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

type HeadCheckResult = {
  checkedAt: string;
  shouldFetch: boolean;
  reason: string;
  headEtag: string | null;
  headLastModified: string | null;
};

type CommonSyncDeps = {
  repository: SyncRepository;
  parseFeed: ParseFeedPort;
  fetchImpl?: typeof fetch;
  now?: () => string;
  headTimeoutMs?: number;
  headUserAgent?: string;
};

type SyncOneSourceDeps = CommonSyncDeps & {
  sourceId: number;
};

const DEFAULT_HEAD_TIMEOUT_MS = 7000;
const DEFAULT_HEAD_USER_AGENT = "FeedoongBot/0.3 (+head-preflight)";

const isHttpFeedSource = (rawUrl: string) => {
  try {
    const url = new URL(rawUrl);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_error) {
    return false;
  }
};

const normalizeHeaderValue = (value: string | null) => {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
};

const resolveNow = (now?: () => string) => now ?? (() => new Date().toISOString());

const resolveFetch = (fetchImpl?: typeof fetch) => {
  if (fetchImpl) {
    return fetchImpl;
  }
  if (typeof fetch !== "function") {
    throw new Error("fetch is not available in the current runtime");
  }
  return fetch;
};

const createTimeoutSignal = (timeoutMs: number): AbortSignal => {
  if (typeof AbortSignal.timeout === "function") {
    return AbortSignal.timeout(timeoutMs);
  }

  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller.signal;
};

const checkSourceByHead = async (
  source: SourceRecord,
  deps: CommonSyncDeps
): Promise<HeadCheckResult> => {
  const now = resolveNow(deps.now);
  const checkedAt = now();

  if (!isHttpFeedSource(source.url)) {
    return {
      checkedAt,
      shouldFetch: true,
      reason: "non-http-source",
      headEtag: source.lastHeadEtag ?? null,
      headLastModified: source.lastHeadLastModified ?? null
    };
  }

  try {
    const fetcher = resolveFetch(deps.fetchImpl);
    const headers = new Headers();
    headers.set("user-agent", deps.headUserAgent ?? DEFAULT_HEAD_USER_AGENT);
    if (source.lastHeadEtag) {
      headers.set("if-none-match", source.lastHeadEtag);
    }
    if (source.lastHeadLastModified) {
      headers.set("if-modified-since", source.lastHeadLastModified);
    }

    const response = await fetcher(source.url, {
      method: "HEAD",
      redirect: "follow",
      headers,
      signal: createTimeoutSignal(deps.headTimeoutMs ?? DEFAULT_HEAD_TIMEOUT_MS)
    });

    const headEtag = normalizeHeaderValue(response.headers.get("etag"));
    const headLastModified = normalizeHeaderValue(response.headers.get("last-modified"));
    const nextEtag = headEtag ?? source.lastHeadEtag ?? null;
    const nextLastModified = headLastModified ?? source.lastHeadLastModified ?? null;

    if (response.status === 304) {
      return {
        checkedAt,
        shouldFetch: false,
        reason: "head-304-not-modified",
        headEtag: nextEtag,
        headLastModified: nextLastModified
      };
    }

    if (!response.ok) {
      return {
        checkedAt,
        shouldFetch: true,
        reason: `head-status-${response.status}`,
        headEtag: nextEtag,
        headLastModified: nextLastModified
      };
    }

    if (!headEtag && !headLastModified) {
      return {
        checkedAt,
        shouldFetch: true,
        reason: "head-missing-validators",
        headEtag: nextEtag,
        headLastModified: nextLastModified
      };
    }

    const sameEtag = Boolean(headEtag && source.lastHeadEtag && headEtag === source.lastHeadEtag);
    const sameLastModified = Boolean(
      headLastModified &&
      source.lastHeadLastModified &&
      headLastModified === source.lastHeadLastModified
    );

    if (sameEtag || sameLastModified) {
      return {
        checkedAt,
        shouldFetch: false,
        reason: "head-unchanged",
        headEtag: nextEtag,
        headLastModified: nextLastModified
      };
    }

    if (!source.lastHeadEtag && !source.lastHeadLastModified) {
      return {
        checkedAt,
        shouldFetch: true,
        reason: "head-initial",
        headEtag: nextEtag,
        headLastModified: nextLastModified
      };
    }

    return {
      checkedAt,
      shouldFetch: true,
      reason: "head-changed",
      headEtag: nextEtag,
      headLastModified: nextLastModified
    };
  } catch (_error) {
    return {
      checkedAt,
      shouldFetch: true,
      reason: "head-request-failed",
      headEtag: source.lastHeadEtag ?? null,
      headLastModified: source.lastHeadLastModified ?? null
    };
  }
};

export const syncOneSource = async (deps: SyncOneSourceDeps): Promise<SyncDetail> => {
  const source = await deps.repository.getSourceById(deps.sourceId);
  if (!source) {
    throw new Error(`Source not found: ${deps.sourceId}`);
  }

  const now = resolveNow(deps.now);
  const headCheck = await checkSourceByHead(source, deps);
  if (!headCheck.shouldFetch) {
    await deps.repository.updateSourceCheckMetadata(
      source.id,
      headCheck.checkedAt,
      headCheck.headEtag,
      headCheck.headLastModified
    );

    return {
      sourceId: source.id,
      sourceUrl: source.url,
      sourceTitle: source.title,
      inserted: 0,
      totalFetched: 0,
      status: "skipped",
      error: null,
      skipReason: headCheck.reason,
      headCheckReason: headCheck.reason
    };
  }

  const parsed = await deps.parseFeed(source.url);
  const normalizedItems = parsed.items
    .filter((item) => item.link.length > 0)
    .map((item) => ({
      guid: item.guid,
      title: item.title,
      link: item.link,
      summary: item.summary,
      publishedAt: item.publishedAt
    }));

  const inserted = await deps.repository.insertItems(source.id, normalizedItems);

  await deps.repository.updateSourceMetadata(source.id, parsed.title, now(), {
    checkedAt: headCheck.checkedAt,
    headEtag: headCheck.headEtag,
    headLastModified: headCheck.headLastModified
  });

  return {
    sourceId: source.id,
    sourceUrl: source.url,
    sourceTitle: parsed.title,
    inserted,
    totalFetched: parsed.items.length,
    status: "ok",
    error: null,
    skipReason: null,
    headCheckReason: headCheck.reason
  };
};

export const syncAllSources = async (deps: CommonSyncDeps): Promise<SyncResult> => {
  const sources = await deps.repository.listSources();
  const details: SyncDetail[] = [];
  let totalInserted = 0;
  let failedSources = 0;

  for (const source of sources) {
    try {
      const detail = await syncOneSource({
        ...deps,
        sourceId: source.id
      });
      details.push(detail);
      totalInserted += detail.inserted;
    } catch (error) {
      failedSources += 1;
      details.push({
        sourceId: source.id,
        sourceUrl: source.url,
        sourceTitle: source.title,
        inserted: 0,
        totalFetched: 0,
        status: "failed",
        error: error instanceof Error ? error.message : "알 수 없는 동기화 에러",
        skipReason: null,
        headCheckReason: null
      });
    }
  }

  return {
    syncedSources: sources.length,
    failedSources,
    totalInserted,
    details
  };
};
