import { parseFeed } from "@feedoong/rss-parser";

import type { FeedoongDb, SourceRow } from "./db.js";

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

type HeadCheckResult = {
  checkedAt: string;
  shouldFetch: boolean;
  reason: string;
  headEtag: string | null;
  headLastModified: string | null;
};

const HEAD_TIMEOUT_MS = 7000;

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

const checkSourceByHead = async (source: SourceRow): Promise<HeadCheckResult> => {
  const checkedAt = new Date().toISOString();

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
    const headers = new Headers();
    headers.set("user-agent", "FeedoongBot/0.3 (+head-preflight)");
    if (source.lastHeadEtag) {
      headers.set("if-none-match", source.lastHeadEtag);
    }
    if (source.lastHeadLastModified) {
      headers.set("if-modified-since", source.lastHeadLastModified);
    }

    const response = await fetch(source.url, {
      method: "HEAD",
      redirect: "follow",
      headers,
      signal: AbortSignal.timeout(HEAD_TIMEOUT_MS)
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

export const syncOneSource = async (
  db: FeedoongDb,
  sourceId: number
): Promise<SyncDetail> => {
  const source = db.getSourceById(sourceId);
  if (!source) {
    throw new Error(`Source not found: ${sourceId}`);
  }

  const headCheck = await checkSourceByHead(source);
  if (!headCheck.shouldFetch) {
    db.updateSourceCheckMetadata(
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

  const parsed = await parseFeed(source.url);
  const inserted = db.insertItems(
    source.id,
    parsed.items
      .filter((item) => item.link.length > 0)
      .map((item) => ({
        guid: item.guid,
        title: item.title,
        link: item.link,
        summary: item.summary,
        publishedAt: item.publishedAt
      }))
  );

  db.updateSourceMetadata(source.id, parsed.title, new Date().toISOString(), {
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

export const syncAllSources = async (db: FeedoongDb) => {
  const sources = db.listSources();
  const details: SyncDetail[] = [];
  let totalInserted = 0;
  let failedSources = 0;

  for (const source of sources) {
    try {
      const detail = await syncOneSource(db, source.id);
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
