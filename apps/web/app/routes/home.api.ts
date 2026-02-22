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
const SERVICE_BINDING_BASE_URL = "http://api.internal";

export const buildCacheControl = (ttlSeconds: number) =>
  `public, max-age=0, s-maxage=${ttlSeconds}, stale-while-revalidate=${DEFAULT_STALE_SECONDS}`;

const makeApiUrl = (baseUrl: string, path: string) => `${baseUrl}${path}`;

export const fetchJson = async <T,>(
  url: string,
  init?: RequestInit,
  cacheTtlSeconds?: number,
  fetchImpl: typeof fetch = fetch
): Promise<T> => {
  const requestInit: RequestInit & { cf?: Record<string, unknown> } = {
    ...init
  };

  if (cacheTtlSeconds && (!init?.method || init.method === "GET")) {
    requestInit.cf = {
      cacheEverything: true,
      cacheTtl: cacheTtlSeconds
    };
  }

  const response = await fetchImpl(url, requestInit);

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `API request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
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
  return {
    apiBaseUrl: apiService
      ? SERVICE_BINDING_BASE_URL
      : process.env.API_BASE_URL ?? "http://localhost:4000",
    apiFetch: apiService?.fetch.bind(apiService) ?? fetch,
    ttlSeconds: Number(process.env.CACHE_TTL_SECONDS ?? DEFAULT_CACHE_TTL_SECONDS)
  };
};

export const loadDashboardPayload = async (runtime: ApiRuntime): Promise<DashboardPayload> => {
  const [sourcesResult, itemsResult] = await Promise.all([
    fetchJson<{ sources: Source[] }>(
      makeApiUrl(runtime.apiBaseUrl, "/v1/sources"),
      undefined,
      runtime.ttlSeconds,
      runtime.apiFetch
    ),
    fetchJson<{ items: FeedItem[] }>(
      makeApiUrl(runtime.apiBaseUrl, "/v1/items?limit=100&offset=0"),
      undefined,
      runtime.ttlSeconds,
      runtime.apiFetch
    )
  ] as const);

  return {
    sources: sourcesResult.sources,
    items: itemsResult.items
  };
};

export const requestAddSource = async (runtime: ApiRuntime, url: string) =>
  fetchJson(
    makeApiUrl(runtime.apiBaseUrl, "/v1/sources"),
    {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ url })
    },
    undefined,
    runtime.apiFetch
  );

export const requestSync = async (runtime: ApiRuntime) =>
  fetchJson(
    makeApiUrl(runtime.apiBaseUrl, "/v1/sync"),
    {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: "{}"
    },
    undefined,
    runtime.apiFetch
  );
