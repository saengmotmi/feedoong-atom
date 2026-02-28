import { parseFeed } from "@feedoong/rss-parser";
import {
  syncAllSources as runSyncAllSources,
  syncOneSource as runSyncOneSource
} from "@feedoong/sync-core";
import { match } from "ts-pattern";

import { createRepository } from "./storage";
import type { ParsedFeedResult } from "@feedoong/rss-parser";
import type { ParseFeedPort, SyncDetail } from "@feedoong/sync-core";
import type { Bindings, SyncCommand } from "./types";

const DEFAULT_PARSE_FEED_TIMEOUT_MS = 15000;

const resolvePositiveTimeoutMs = (
  rawValue: string | number | undefined,
  fallbackValue: number
) => {
  const resolved =
    typeof rawValue === "number"
      ? rawValue
      : Number(rawValue ?? fallbackValue);
  return Number.isFinite(resolved) && resolved > 0
    ? resolved
    : fallbackValue;
};

const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number,
  operationName: string
): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`${operationName} timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    void promise.then(
      (value) => {
        clearTimeout(timeoutId);
        resolve(value);
      },
      (error) => {
        clearTimeout(timeoutId);
        reject(error);
      }
    );
  });

export const createParseFeedPort = (
  env: Bindings
): ((url: string) => Promise<ParsedFeedResult>) => {
  const parseFeedTimeoutMs = resolvePositiveTimeoutMs(
    env.PARSE_FEED_TIMEOUT_MS,
    DEFAULT_PARSE_FEED_TIMEOUT_MS
  );

  return (url) =>
    withTimeout(
      parseFeed(url, {
        xMentions: {
          token: env.X_BEARER_TOKEN ?? "",
          apiBaseUrl: env.X_API_BASE_URL,
          maxResults: env.X_MENTIONS_MAX_RESULTS,
          timeoutMs: parseFeedTimeoutMs
        }
      }),
      parseFeedTimeoutMs,
      "parseFeed"
    );
};

const syncOneSource = async (
  env: Bindings,
  sourceId: number,
  parseFeedPort: ParseFeedPort
): Promise<SyncDetail> =>
  runSyncOneSource({
    repository: createRepository(env),
    sourceId,
    parseFeed: parseFeedPort
  });

export const syncAllSources = async (env: Bindings, parseFeedPort: ParseFeedPort) =>
  runSyncAllSources({
    repository: createRepository(env),
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
  env: Bindings,
  parseFeedPort: ParseFeedPort,
  command: SyncCommand
) =>
  match(command)
    .with({ kind: "single" }, async ({ sourceId }) => {
      const detail = await syncOneSource(env, sourceId, parseFeedPort);
      return {
        syncedSources: 1,
        failedSources: 0,
        totalInserted: detail.inserted,
        details: [detail]
      };
    })
    .with({ kind: "all" }, async () => syncAllSources(env, parseFeedPort))
    .exhaustive();
