import type { SyncAggregate } from "./types.js";

export const DEFAULT_HEAD_TIMEOUT_MS = 7000;
export const DEFAULT_HEAD_USER_AGENT = "FeedoongBot/0.3 (+head-preflight)";
export const UNKNOWN_SYNC_ERROR = "알 수 없는 동기화 에러";
export const DEFAULT_SYNC_RETRY_AFTER_SECONDS = 300;
export const MAX_SYNC_RETRY_AFTER_SECONDS = 21600;

export const INITIAL_SYNC_AGGREGATE: SyncAggregate = {
  failedSources: 0,
  totalInserted: 0,
  details: []
};
