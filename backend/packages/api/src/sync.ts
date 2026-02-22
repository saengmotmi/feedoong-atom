import { parseFeed } from "@feedoong/rss-parser";
import {
  syncAllSources as runSyncAllSources,
  syncOneSource as runSyncOneSource
} from "@feedoong/sync-core";

import type { SyncDetail, SyncRepository } from "@feedoong/sync-core";
import type { ParsedFeedResult } from "@feedoong/rss-parser";

import type { FeedoongDb } from "./db.js";

const createRepository = (db: FeedoongDb): SyncRepository => ({
  getSourceById: (sourceId) => db.getSourceById(sourceId) ?? null,
  listSources: () => db.listSources(),
  insertItems: (sourceId, items) => db.insertItems(sourceId, items),
  updateSourceMetadata: (sourceId, title, syncedAt, checkMetadata) =>
    db.updateSourceMetadata(sourceId, title, syncedAt, checkMetadata),
  updateSourceCheckMetadata: (sourceId, checkedAt, headEtag, headLastModified) =>
    db.updateSourceCheckMetadata(sourceId, checkedAt, headEtag, headLastModified)
});

export type { SyncDetail };

type SyncOptions = {
  parseFeedPort?: (url: string) => Promise<ParsedFeedResult>;
};

const resolveParseFeedPort = (options?: SyncOptions) =>
  options?.parseFeedPort ?? ((url: string) => parseFeed(url));

export const syncOneSource = async (
  db: FeedoongDb,
  sourceId: number,
  options?: SyncOptions
): Promise<SyncDetail> =>
  runSyncOneSource({
    repository: createRepository(db),
    sourceId,
    parseFeed: resolveParseFeedPort(options)
  });

export const syncAllSources = async (db: FeedoongDb, options?: SyncOptions) =>
  runSyncAllSources({
    repository: createRepository(db),
    parseFeed: resolveParseFeedPort(options)
  });
