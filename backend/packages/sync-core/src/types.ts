export type MaybePromise<T> = T | Promise<T>;

export type SourceRecord = {
  id: number;
  url: string;
  title: string;
  lastSyncedAt: string | null;
  lastCheckedAt?: string | null;
  lastHeadEtag?: string | null;
  lastHeadLastModified?: string | null;
  createdAt: string;
};

export type ParsedFeedItem = {
  guid: string;
  title: string;
  link: string;
  summary: string | null;
  publishedAt: string | null;
};

export type ParseFeedResult = {
  title: string;
  items: ParsedFeedItem[];
};

export type ParseFeedPort = (url: string) => MaybePromise<ParseFeedResult>;

export type SyncRepository = {
  getSourceById: (sourceId: number) => MaybePromise<SourceRecord | null | undefined>;
  listSources: () => MaybePromise<SourceRecord[]>;
  insertItems: (sourceId: number, items: ParsedFeedItem[]) => MaybePromise<number>;
  updateSourceMetadata: (
    sourceId: number,
    title: string,
    syncedAt: string,
    checkMetadata?: {
      checkedAt?: string | null;
      headEtag?: string | null;
      headLastModified?: string | null;
    }
  ) => MaybePromise<void>;
  updateSourceCheckMetadata: (
    sourceId: number,
    checkedAt: string,
    headEtag: string | null,
    headLastModified: string | null
  ) => MaybePromise<void>;
};

export type SyncDetail = {
  sourceId: number;
  sourceUrl: string;
  sourceTitle: string;
  inserted: number;
  totalFetched: number;
  status: "ok" | "failed" | "skipped";
  error: string | null;
  skipReason: string | null;
  headCheckReason: string | null;
};

export type SyncResult = {
  syncedSources: number;
  failedSources: number;
  totalInserted: number;
  details: SyncDetail[];
};

export type HeadCheckResult = {
  checkedAt: string;
  shouldFetch: boolean;
  reason: string;
  headEtag: string | null;
  headLastModified: string | null;
};

export type CommonSyncDeps = {
  repository: SyncRepository;
  parseFeed: ParseFeedPort;
  fetchImpl?: typeof fetch;
  now?: () => string;
  headTimeoutMs?: number;
  headUserAgent?: string;
};

export type SyncOneSourceDeps = CommonSyncDeps & {
  sourceId: number;
};

export type SyncAttempt =
  | {
      kind: "ok";
      detail: SyncDetail;
    }
  | {
      kind: "failed";
      source: SourceRecord;
      message: string;
    };

export type SyncAggregate = {
  failedSources: number;
  totalInserted: number;
  details: SyncDetail[];
};
