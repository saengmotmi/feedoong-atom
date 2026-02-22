export type SourceRow = {
  id: number;
  url: string;
  title: string;
  lastSyncedAt: string | null;
  lastCheckedAt?: string | null;
  lastHeadEtag?: string | null;
  lastHeadLastModified?: string | null;
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

export type StorageShape = {
  nextSourceId: number;
  nextItemId: number;
  sources: SourceRow[];
  items: ItemRow[];
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
  FEEDOONG_DB: KVNamespace;
  WEB_ORIGIN?: string;
  SCHEDULER_KEY?: string;
  X_BEARER_TOKEN?: string;
  X_API_BASE_URL?: string;
  X_MENTIONS_MAX_RESULTS?: string;
};

export type StorageRef = {
  current: StorageShape;
};
