import { parseFeed } from "@feedoong/rss-parser";
import {
  syncAllSources as runSyncAllSources,
  syncOneSource as runSyncOneSource
} from "@feedoong/sync-core";
import { match } from "ts-pattern";

import { createRepository } from "./storage";
import type { ParsedFeedResult } from "@feedoong/rss-parser";
import type { ParseFeedPort, SyncDetail } from "@feedoong/sync-core";
import type { Bindings, StorageRef, SyncCommand } from "./types";

export const createParseFeedPort = (env: Bindings): ((url: string) => Promise<ParsedFeedResult>) => (url) =>
  parseFeed(url, {
    xMentions: {
      token: env.X_BEARER_TOKEN ?? "",
      apiBaseUrl: env.X_API_BASE_URL,
      maxResults: env.X_MENTIONS_MAX_RESULTS
    }
  });

const syncOneSource = async (
  storageRef: StorageRef,
  sourceId: number,
  parseFeedPort: ParseFeedPort
): Promise<SyncDetail> =>
  runSyncOneSource({
    repository: createRepository(storageRef),
    sourceId,
    parseFeed: parseFeedPort
  });

export const syncAllSources = async (storageRef: StorageRef, parseFeedPort: ParseFeedPort) =>
  runSyncAllSources({
    repository: createRepository(storageRef),
    parseFeed: parseFeedPort
  });

export const parseSyncCommand = (sourceId: number | undefined): SyncCommand =>
  match(sourceId)
    .with(undefined, () => ({ kind: "all" } as const))
    .otherwise((resolvedSourceId) => ({
      kind: "single",
      sourceId: resolvedSourceId
    } as const));

export const executeSyncCommand = async (
  storageRef: StorageRef,
  parseFeedPort: ParseFeedPort,
  command: SyncCommand
) =>
  match(command)
    .with({ kind: "single" }, async ({ sourceId }) => {
      const detail = await syncOneSource(storageRef, sourceId, parseFeedPort);
      return {
        syncedSources: 1,
        failedSources: 0,
        totalInserted: detail.inserted,
        details: [detail]
      };
    })
    .with({ kind: "all" }, async () => syncAllSources(storageRef, parseFeedPort))
    .exhaustive();
