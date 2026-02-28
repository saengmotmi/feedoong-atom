import { API_WRITE_KEY_HEADER } from "@feedoong/contracts";
import { requireConfiguredSecret } from "@feedoong/contracts";
import { z } from "zod";

import type {
  ApiRuntime,
  ApiServiceBinding,
  DashboardPayload,
  FeedItem,
  GlobalWithApiService,
  RouteContextWithApiService,
  Source
} from "./home.types";

const DEFAULT_CACHE_TTL_SECONDS = 60;
const DEFAULT_STALE_SECONDS = 300;
const DEFAULT_API_TIMEOUT_MS = 8000;
const SERVICE_BINDING_BASE_URL = "http://api.internal";
const READ_RETRY_ATTEMPTS = 1;

export class ApiRequestError extends Error {
  readonly status: number;
  readonly responseBody: string;

  constructor(status: number, responseBody: string, options?: { cause?: unknown }) {
    super(responseBody || `API request failed (${status})`, options);
    this.name = "ApiRequestError";
    this.status = status;
    this.responseBody = responseBody;
  }
}

const sourceSchema = z.object({
  id: z.number(),
  url: z.string(),
  title: z.string(),
  lastSyncedAt: z.string().nullable(),
  createdAt: z.string()
});

const feedItemSchema = z.object({
  id: z.number(),
  sourceId: z.number(),
  sourceTitle: z.string(),
  title: z.string(),
  link: z.string(),
  summary: z.string().nullable(),
  publishedAt: z.string().nullable(),
  createdAt: z.string()
});

const sourcesResponseSchema = z.object({
  sources: z.array(sourceSchema)
});

const itemsResponseSchema = z.object({
  items: z.array(feedItemSchema)
});

const resolvePositiveNumber = (
  rawValue: string | undefined,
  fallbackValue: number,
  minValue = 1,
  maxValue = Number.MAX_SAFE_INTEGER
) => {
  const parsed = Number(rawValue ?? `${fallbackValue}`);
  if (!Number.isFinite(parsed) || parsed < minValue) {
    return fallbackValue;
  }
  return Math.min(Math.floor(parsed), maxValue);
};

const resolveApiBaseUrl = (rawBaseUrl: string) => {
  try {
    const parsed = new URL(rawBaseUrl);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error("API_BASE_URL must use http/https");
    }
    return parsed.href.replace(/\/+$/, "");
  } catch (error) {
    throw new Error(
      `API_BASE_URL is invalid: ${rawBaseUrl}`,
      { cause: error }
    );
  }
};

const withTimeout = (init: RequestInit | undefined, timeoutMs: number): RequestInit => ({
  ...init,
  signal: init?.signal ?? AbortSignal.timeout(timeoutMs)
});

const isRetryableStatus = (status: number) =>
  status === 408 || status === 429 || status === 500 || status === 502 || status === 503 || status === 504;

const isRetryableError = (error: unknown) => {
  if (error instanceof ApiRequestError) {
    return isRetryableStatus(error.status);
  }
  if (error instanceof Error) {
    const lowered = error.message.toLowerCase();
    return lowered.includes("timeout") || lowered.includes("network");
  }
  return false;
};

export const toApiErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof ApiRequestError && (error.status === 401 || error.status === 503)) {
    return "웹 API 인증 설정을 확인해 주세요.";
  }

  return error instanceof Error && error.message.trim().length > 0
    ? error.message
    : fallback;
};

export const buildCacheControl = (ttlSeconds: number) =>
  `public, max-age=0, s-maxage=${ttlSeconds}, stale-while-revalidate=${DEFAULT_STALE_SECONDS}`;

const makeApiUrl = (baseUrl: string, path: string) => `${baseUrl}${path}`;

const toApiErrorResponseMessage = (rawBody: string) => {
  const trimmed = rawBody.trim();
  if (!trimmed) {
    return "";
  }

  try {
    const parsed = JSON.parse(trimmed) as { message?: unknown };
    return typeof parsed.message === "string" ? parsed.message : trimmed;
  } catch (_error) {
    return trimmed;
  }
};

export const fetchJson = async <T,>(
  url: string,
  init?: RequestInit,
  cacheTtlSeconds?: number,
  timeoutMs = DEFAULT_API_TIMEOUT_MS,
  fetchImpl: typeof fetch = fetch
): Promise<T> => {
  const method = (init?.method ?? "GET").toUpperCase();
  const maxAttempts = method === "GET" ? READ_RETRY_ATTEMPTS + 1 : 1;
  let attempt = 0;

  while (attempt < maxAttempts) {
    const requestInit: RequestInit & { cf?: Record<string, unknown> } = withTimeout(init, timeoutMs);

    if (cacheTtlSeconds && method === "GET") {
      requestInit.cf = {
        cacheEverything: true,
        cacheTtl: cacheTtlSeconds
      };
    }

    try {
      const response = await fetchImpl(url, requestInit);

      if (!response.ok) {
        const rawBody = await response.text().catch(() => "");
        const message = toApiErrorResponseMessage(rawBody);
        throw new ApiRequestError(
          response.status,
          message || `API request failed (${response.status})`
        );
      }

      return response.json() as Promise<T>;
    } catch (error) {
      attempt += 1;
      if (attempt >= maxAttempts || !isRetryableError(error)) {
        throw error;
      }
    }
  }

  throw new Error("unreachable fetchJson branch");
};

const getApiServiceBinding = (context: unknown): ApiServiceBinding | null => {
  const globalApiService =
    (globalThis as GlobalWithApiService).__FEEDOONG_API_SERVICE ?? null;
  if (globalApiService) {
    return globalApiService;
  }

  const routeContext = context as RouteContextWithApiService;
  return routeContext.apiService ?? null;
};

export const resolveApiRuntime = (context: unknown): ApiRuntime => {
  const apiService = getApiServiceBinding(context);
  const apiBaseUrl = apiService
    ? SERVICE_BINDING_BASE_URL
    : resolveApiBaseUrl(process.env.API_BASE_URL ?? "http://localhost:4000");

  return {
    apiBaseUrl,
    apiFetch: apiService?.fetch.bind(apiService) ?? fetch,
    ttlSeconds: resolvePositiveNumber(
      process.env.CACHE_TTL_SECONDS,
      DEFAULT_CACHE_TTL_SECONDS,
      1,
      3600
    ),
    apiTimeoutMs: resolvePositiveNumber(
      process.env.API_TIMEOUT_MS,
      DEFAULT_API_TIMEOUT_MS,
      1000,
      60000
    ),
    apiWriteKey: requireConfiguredSecret({
      value: process.env["API_WRITE_KEY"],
      secretName: "API_WRITE_KEY"
    })
  };
};

export const loadDashboardPayload = async (runtime: ApiRuntime): Promise<DashboardPayload> => {
  const [sourcesResult, itemsResult] = await Promise.all([
    fetchJson<z.infer<typeof sourcesResponseSchema>>(
      makeApiUrl(runtime.apiBaseUrl, "/v1/sources"),
      undefined,
      runtime.ttlSeconds,
      runtime.apiTimeoutMs,
      runtime.apiFetch
    ),
    fetchJson<z.infer<typeof itemsResponseSchema>>(
      makeApiUrl(runtime.apiBaseUrl, "/v1/items?limit=100&offset=0"),
      undefined,
      runtime.ttlSeconds,
      runtime.apiTimeoutMs,
      runtime.apiFetch
    )
  ] as const);

  const validatedSources = sourcesResponseSchema.parse(sourcesResult);
  const validatedItems = itemsResponseSchema.parse(itemsResult);

  return {
    sources: validatedSources.sources as Source[],
    items: validatedItems.items as FeedItem[]
  };
};

export const requestAddSource = async (runtime: ApiRuntime, url: string) =>
  fetchJson(
    makeApiUrl(runtime.apiBaseUrl, "/v1/sources"),
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(runtime.apiWriteKey
          ? {
              [API_WRITE_KEY_HEADER]: runtime.apiWriteKey
            }
          : {})
      },
      body: JSON.stringify({ url })
    },
    undefined,
    runtime.apiTimeoutMs,
    runtime.apiFetch
  );

export const requestSync = async (runtime: ApiRuntime) =>
  fetchJson(
    makeApiUrl(runtime.apiBaseUrl, "/v1/sync"),
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(runtime.apiWriteKey
          ? {
              [API_WRITE_KEY_HEADER]: runtime.apiWriteKey
            }
          : {})
      },
      body: "{}"
    },
    undefined,
    runtime.apiTimeoutMs,
    runtime.apiFetch
  );
