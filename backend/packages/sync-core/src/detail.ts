import * as R from "remeda";

import { toUnknownSyncMessage } from "./runtime.js";
import type {
  HeadCheckResult,
  ParseFeedResult,
  ParsedFeedItem,
  SourceRecord,
  SyncDetail
} from "./types.js";

const hasLink = (item: ParsedFeedItem) => item.link.length > 0;

const toSyncInsertItem = (item: ParsedFeedItem): ParsedFeedItem => ({
  guid: item.guid,
  title: item.title,
  link: item.link,
  summary: item.summary,
  publishedAt: item.publishedAt
});

export const normalizeSyncItems = (items: ParsedFeedItem[]) =>
  R.pipe(items, R.filter(hasLink), R.map(toSyncInsertItem));

export const createSkippedDetail = (
  source: SourceRecord,
  headCheck: HeadCheckResult
): SyncDetail => ({
  sourceId: source.id,
  sourceUrl: source.url,
  sourceTitle: source.title,
  inserted: 0,
  totalFetched: 0,
  status: "skipped",
  error: null,
  skipReason: headCheck.reason,
  headCheckReason: headCheck.reason
});

export const createOkDetail = (input: {
  source: SourceRecord;
  parsed: ParseFeedResult;
  inserted: number;
  headReason: string;
}): SyncDetail => ({
  sourceId: input.source.id,
  sourceUrl: input.source.url,
  sourceTitle: input.parsed.title,
  inserted: input.inserted,
  totalFetched: input.parsed.items.length,
  status: "ok",
  error: null,
  skipReason: null,
  headCheckReason: input.headReason
});

export const createFailedDetail = (source: SourceRecord, message: string): SyncDetail => ({
  sourceId: source.id,
  sourceUrl: source.url,
  sourceTitle: source.title,
  inserted: 0,
  totalFetched: 0,
  status: "failed",
  error: toUnknownSyncMessage(message),
  skipReason: null,
  headCheckReason: null
});
