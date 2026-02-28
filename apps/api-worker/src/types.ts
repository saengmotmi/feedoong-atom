export type SourceRow = {
  id: number;
  url: string;
  title: string;
  lastSyncedAt: string | null;
  lastCheckedAt?: string | null;
  lastHeadEtag?: string | null;
  lastHeadLastModified?: string | null;
  nextCheckAt?: string | null;
  errorCount?: number;
  retryAfterSeconds?: number | null;
  lastErrorType?: string | null;
  createdAt: string;
};

export type ItemRow = {
  id: number;
  sourceId: number;
  sourceTitle: string;
  guid: string;
  title: string;
  link: string;
  summary: string | null;
  publishedAt: string | null;
  createdAt: string;
};

export type SyncCommand =
  | {
      kind: "single";
      sourceId: number;
    }
  | {
      kind: "all";
    };

export type Bindings = {
  FEEDOONG_DB: D1Database;
  WEB_ORIGIN?: string;
  API_WRITE_KEY?: string;
  SCHEDULER_KEY?: string;
  X_BEARER_TOKEN?: string;
  X_API_BASE_URL?: string;
  X_MENTIONS_MAX_RESULTS?: string;
  PARSE_FEED_TIMEOUT_MS?: string;
};
