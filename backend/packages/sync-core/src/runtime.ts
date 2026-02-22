import { UNKNOWN_SYNC_ERROR } from "./constants.js";

export const toErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

export const toUnknownSyncMessage = (message: string) =>
  message.trim().length > 0 ? message : UNKNOWN_SYNC_ERROR;

export const resolveNow = (now?: () => string) => now ?? (() => new Date().toISOString());

export const resolveFetch = (fetchImpl?: typeof fetch) => {
  if (fetchImpl) {
    return fetchImpl;
  }
  if (typeof fetch !== "function") {
    throw new Error("fetch is not available in the current runtime");
  }
  return fetch;
};

export const createTimeoutSignal = (timeoutMs: number): AbortSignal => {
  if (typeof AbortSignal.timeout === "function") {
    return AbortSignal.timeout(timeoutMs);
  }

  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller.signal;
};

export const normalizeHeaderValue = (value: string | null) => {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
};

export const isHttpFeedSource = (rawUrl: string) => {
  try {
    const url = new URL(rawUrl);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_error) {
    return false;
  }
};
