import { parseFeed } from "@feedoong/rss-parser";

import type { FeedoongDb } from "./db.js";

export type SyncDetail = {
  sourceId: number;
  sourceUrl: string;
  sourceTitle: string;
  inserted: number;
  totalFetched: number;
  status: "ok" | "failed";
  error: string | null;
};

export const syncOneSource = async (
  db: FeedoongDb,
  sourceId: number
): Promise<SyncDetail> => {
  const source = db.getSourceById(sourceId);
  if (!source) {
    throw new Error(`Source not found: ${sourceId}`);
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

  db.updateSourceMetadata(source.id, parsed.title, new Date().toISOString());

  return {
    sourceId: source.id,
    sourceUrl: source.url,
    sourceTitle: parsed.title,
    inserted,
    totalFetched: parsed.items.length,
    status: "ok",
    error: null
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
        error: error instanceof Error ? error.message : "알 수 없는 동기화 에러"
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
