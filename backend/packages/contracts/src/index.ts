import { z, type ZodIssue } from "zod";

export const INVALID_JSON_BODY_ERROR = "INVALID_JSON_BODY";
export const DUPLICATE_SOURCE_URL_ERROR = "DUPLICATE_SOURCE_URL";

export const API_ERROR_CODES = {
  INVALID_REQUEST: "INVALID_REQUEST",
  UNAUTHORIZED: "UNAUTHORIZED",
  DUPLICATE_SOURCE_URL: "DUPLICATE_SOURCE_URL",
  SOURCE_REGISTRATION_FAILED: "SOURCE_REGISTRATION_FAILED",
  SOURCE_NOT_FOUND: "SOURCE_NOT_FOUND",
  URL_NOT_ALLOWED: "URL_NOT_ALLOWED",
  SERVER_MISCONFIGURED: "SERVER_MISCONFIGURED",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR"
} as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES];

export const API_WRITE_KEY_HEADER = "x-api-key";
export const SCHEDULER_KEY_HEADER = "x-scheduler-key";

type ApiErrorResponseInput = {
  code: ApiErrorCode;
  message: string;
  requestId: string;
  issues?: ZodIssue[];
};

export type ApiErrorResponse = ApiErrorResponseInput;

export const createApiErrorResponse = (
  input: ApiErrorResponseInput
): ApiErrorResponse =>
  input.issues
    ? {
        code: input.code,
        message: input.message,
        requestId: input.requestId,
        issues: input.issues
      }
    : {
        code: input.code,
        message: input.message,
        requestId: input.requestId
      };

export const toErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error && error.message.trim().length > 0
    ? error.message
    : fallback;

export class ApiDomainError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;

  constructor(
    code: ApiErrorCode,
    status: number,
    message: string,
    options?: { cause?: unknown }
  ) {
    super(message, options);
    this.name = "ApiDomainError";
    this.code = code;
    this.status = status;
  }
}

export class InvalidJsonBodyError extends ApiDomainError {
  constructor(options?: { cause?: unknown }) {
    super(
      API_ERROR_CODES.INVALID_REQUEST,
      400,
      INVALID_JSON_BODY_ERROR,
      options
    );
    this.name = "InvalidJsonBodyError";
  }
}

export class DuplicateSourceUrlError extends ApiDomainError {
  readonly url: string;

  constructor(url: string, options?: { cause?: unknown }) {
    super(
      API_ERROR_CODES.DUPLICATE_SOURCE_URL,
      409,
      DUPLICATE_SOURCE_URL_ERROR,
      options
    );
    this.name = "DuplicateSourceUrlError";
    this.url = url;
  }
}

export class SourceRegistrationError extends ApiDomainError {
  constructor(cause: unknown, message = "RSS를 등록할 수 없습니다.") {
    super(API_ERROR_CODES.SOURCE_REGISTRATION_FAILED, 422, message, { cause });
    this.name = "SourceRegistrationError";
  }
}

export class UrlNotAllowedError extends ApiDomainError {
  readonly url: string;

  constructor(url: string, message = "내부 네트워크 주소는 등록할 수 없습니다.") {
    super(API_ERROR_CODES.URL_NOT_ALLOWED, 422, message);
    this.name = "UrlNotAllowedError";
    this.url = url;
  }
}

export class UnauthorizedError extends ApiDomainError {
  constructor(message = "인증에 실패했습니다.") {
    super(API_ERROR_CODES.UNAUTHORIZED, 401, message);
    this.name = "UnauthorizedError";
  }
}

export class ServerMisconfiguredError extends ApiDomainError {
  constructor(message = "서버 인증 키가 설정되지 않았습니다.") {
    super(API_ERROR_CODES.SERVER_MISCONFIGURED, 503, message);
    this.name = "ServerMisconfiguredError";
  }
}

export const normalizeSecret = (value: string | null | undefined) =>
  value?.trim() ?? "";

export const ensureAuthorizedByKey = (input: {
  expectedKey: string | null | undefined;
  providedKey: string | null | undefined;
  unauthorizedMessage?: string;
}) => {
  const expected = normalizeSecret(input.expectedKey);
  if (expected.length === 0) {
    return;
  }

  const provided = normalizeSecret(input.providedKey);
  if (provided !== expected) {
    throw new UnauthorizedError(input.unauthorizedMessage);
  }
};

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "host.docker.internal",
  "metadata.google.internal"
]);

const toIpv4Octets = (hostname: string): number[] | null => {
  if (!/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return null;
  }

  const octets = hostname.split(".").map((value) => Number(value));
  if (octets.some((octet) => Number.isNaN(octet) || octet < 0 || octet > 255)) {
    return null;
  }

  return octets;
};

const toIpv4Number = (octets: number[]) =>
  (octets[0] ?? 0) * 256 ** 3 +
  (octets[1] ?? 0) * 256 ** 2 +
  (octets[2] ?? 0) * 256 +
  (octets[3] ?? 0);

const IPV4_PRIVATE_RANGES: Array<[number, number]> = [
  [toIpv4Number([0, 0, 0, 0]), toIpv4Number([0, 255, 255, 255])],
  [toIpv4Number([10, 0, 0, 0]), toIpv4Number([10, 255, 255, 255])],
  [toIpv4Number([100, 64, 0, 0]), toIpv4Number([100, 127, 255, 255])],
  [toIpv4Number([127, 0, 0, 0]), toIpv4Number([127, 255, 255, 255])],
  [toIpv4Number([169, 254, 0, 0]), toIpv4Number([169, 254, 255, 255])],
  [toIpv4Number([172, 16, 0, 0]), toIpv4Number([172, 31, 255, 255])],
  [toIpv4Number([192, 168, 0, 0]), toIpv4Number([192, 168, 255, 255])]
];

const isPrivateIpv4Hostname = (hostname: string) => {
  const octets = toIpv4Octets(hostname);
  if (!octets) {
    return false;
  }

  const value = toIpv4Number(octets);
  return IPV4_PRIVATE_RANGES.some(([start, end]) => value >= start && value <= end);
};

const isPrivateIpv6Hostname = (hostname: string) => {
  const normalized = hostname.toLowerCase();
  if (normalized === "::1" || normalized === "::") {
    return true;
  }
  if (
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    normalized.startsWith("fe8") ||
    normalized.startsWith("fe9") ||
    normalized.startsWith("fea") ||
    normalized.startsWith("feb")
  ) {
    return true;
  }

  if (normalized.startsWith("::ffff:")) {
    const mapped = normalized.slice("::ffff:".length);
    return isPrivateIpv4Hostname(mapped);
  }

  return false;
};

export const isPrivateOrLocalHost = (hostname: string) => {
  const normalized = hostname.trim().toLowerCase();
  if (!normalized) {
    return true;
  }

  if (BLOCKED_HOSTNAMES.has(normalized)) {
    return true;
  }

  if (
    normalized.endsWith(".localhost") ||
    normalized.endsWith(".local") ||
    normalized.endsWith(".internal")
  ) {
    return true;
  }

  if (isPrivateIpv4Hostname(normalized)) {
    return true;
  }

  return isPrivateIpv6Hostname(normalized);
};

export const isPublicHttpUrl = (value: string) => {
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return false;
    }
    if (url.username || url.password) {
      return false;
    }

    return !isPrivateOrLocalHost(url.hostname);
  } catch (_error) {
    return false;
  }
};

export const assertPublicSourceUrl = (value: string) => {
  if (!isPublicHttpUrl(value)) {
    throw new UrlNotAllowedError(value);
  }
};

export const sourceBodySchema = z.object({
  url: z.string().url()
});

export const itemsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(200).default(50),
  offset: z.coerce.number().int().min(0).default(0)
});

export const syncBodySchema = z.object({
  sourceId: z.coerce.number().int().positive().optional()
});

export type SourceBody = z.infer<typeof sourceBodySchema>;
export type ItemsQuery = z.infer<typeof itemsQuerySchema>;
export type SyncBody = z.infer<typeof syncBodySchema>;

export const readJsonBody = async (request: Request): Promise<unknown> => {
  const rawBody = await request.text();
  if (rawBody.trim().length === 0) {
    return {};
  }

  try {
    return JSON.parse(rawBody) as unknown;
  } catch (error) {
    throw new InvalidJsonBodyError({
      cause: error
    });
  }
};
