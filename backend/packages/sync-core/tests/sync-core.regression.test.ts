import assert from "node:assert/strict";
import fs from "node:fs";
import { describe, it } from "node:test";

import { SourceNotFoundError, syncAllSources, syncOneSource } from "../src/index.js";

import type { ParseFeedResult, SourceRecord, SyncRepository } from "../src/types.js";

type SyncCoreFixture = {
  source: SourceRecord;
  parsed: ParseFeedResult;
};

const FIXTURE = JSON.parse(
  fs.readFileSync(new URL("./fixtures/sync-core.fixture.json", import.meta.url), "utf8")
) as SyncCoreFixture;

const cloneSource = (): SourceRecord =>
  structuredClone(FIXTURE.source) as SourceRecord;

const FIXED_NOW = "2026-03-01T00:00:00.000Z";

describe("sync-core regression fixtures", () => {
  it("미존재 sourceId는 SourceNotFoundError를 던진다", async () => {
    const repository: SyncRepository = {
      getSourceById: async () => null,
      listSources: async () => [],
      insertItems: async () => 0,
      updateSourceMetadata: async () => undefined,
      updateSourceCheckMetadata: async () => undefined,
      updateSourceFailureState: async () => undefined
    };

    await assert.rejects(
      () =>
        syncOneSource({
          sourceId: 999,
          repository,
          parseFeed: async () => FIXTURE.parsed
        }),
      (error: unknown) => {
        assert.ok(error instanceof SourceNotFoundError);
        assert.equal(error.sourceId, 999);
        return true;
      }
    );
  });

  it("HEAD validator가 동일하면 fetch 없이 skipped 처리한다", async () => {
    const source = cloneSource();
    let parseFeedCallCount = 0;
    let checkMetadataCallCount = 0;
    let insertCallCount = 0;
    let sourceMetadataCallCount = 0;

    const repository: SyncRepository = {
      getSourceById: async () => source,
      listSources: async () => [source],
      insertItems: async () => {
        insertCallCount += 1;
        return 0;
      },
      updateSourceMetadata: async () => {
        sourceMetadataCallCount += 1;
      },
      updateSourceCheckMetadata: async () => {
        checkMetadataCallCount += 1;
      },
      updateSourceFailureState: async () => undefined
    };

    const result = await syncOneSource({
      sourceId: source.id,
      repository,
      now: () => FIXED_NOW,
      parseFeed: async () => {
        parseFeedCallCount += 1;
        return FIXTURE.parsed;
      },
      fetchImpl: async () =>
        new Response(null, {
          status: 200,
          headers: {
            etag: source.lastHeadEtag ?? "",
            "last-modified": source.lastHeadLastModified ?? ""
          }
        })
    });

    assert.equal(result.status, "skipped");
    assert.equal(result.inserted, 0);
    assert.equal(result.skipReason, "head-unchanged");
    assert.equal(parseFeedCallCount, 0);
    assert.equal(insertCallCount, 0);
    assert.equal(sourceMetadataCallCount, 0);
    assert.equal(checkMetadataCallCount, 1);
  });

  it("HEAD validator가 바뀌면 fetch + insert + metadata 갱신을 수행한다", async () => {
    const source = cloneSource();
    let sourceMetadataArgs:
      | {
          sourceId: number;
          title: string;
          syncedAt: string;
          checkMetadata:
            | {
                checkedAt?: string | null;
                headEtag?: string | null;
                headLastModified?: string | null;
              }
            | undefined;
        }
      | undefined;
    let checkMetadataCallCount = 0;

    const repository: SyncRepository = {
      getSourceById: async () => source,
      listSources: async () => [source],
      insertItems: async (_sourceId, items) => items.length,
      updateSourceMetadata: async (sourceId, title, syncedAt, checkMetadata) => {
        sourceMetadataArgs = {
          sourceId,
          title,
          syncedAt,
          checkMetadata
        };
      },
      updateSourceCheckMetadata: async () => {
        checkMetadataCallCount += 1;
      },
      updateSourceFailureState: async () => undefined
    };

    const result = await syncOneSource({
      sourceId: source.id,
      repository,
      now: () => FIXED_NOW,
      parseFeed: async () => FIXTURE.parsed,
      fetchImpl: async () =>
        new Response(null, {
          status: 200,
          headers: {
            etag: "etag-v2",
            "last-modified": "Sat, 28 Feb 2026 01:00:00 GMT"
          }
        })
    });

    assert.equal(result.status, "ok");
    assert.equal(result.inserted, 2);
    assert.equal(result.totalFetched, 2);
    assert.equal(result.headCheckReason, "head-changed");
    assert.equal(checkMetadataCallCount, 0);

    assert.ok(sourceMetadataArgs);
    assert.equal(sourceMetadataArgs.sourceId, source.id);
    assert.equal(sourceMetadataArgs.title, FIXTURE.parsed.title);
    assert.equal(sourceMetadataArgs.syncedAt, FIXED_NOW);
    assert.equal(sourceMetadataArgs.checkMetadata?.headEtag, "etag-v2");
    assert.equal(
      sourceMetadataArgs.checkMetadata?.headLastModified,
      "Sat, 28 Feb 2026 01:00:00 GMT"
    );
    assert.equal(sourceMetadataArgs.checkMetadata?.checkedAt, FIXED_NOW);
  });

  it("nextCheckAt이 미래인 source는 syncAll에서 건너뛴다", async () => {
    const dueSource = cloneSource();
    const futureSource = {
      ...cloneSource(),
      id: 99,
      url: "https://example.com/future.xml",
      nextCheckAt: "2026-03-02T00:00:00.000Z"
    };
    let parseFeedCallCount = 0;

    const repository: SyncRepository = {
      getSourceById: async (sourceId) =>
        sourceId === dueSource.id ? dueSource : futureSource,
      listSources: async () => [dueSource, futureSource],
      insertItems: async (_sourceId, items) => items.length,
      updateSourceMetadata: async () => undefined,
      updateSourceCheckMetadata: async () => undefined,
      updateSourceFailureState: async () => undefined
    };

    const result = await syncAllSources({
      repository,
      now: () => FIXED_NOW,
      parseFeed: async () => {
        parseFeedCallCount += 1;
        return FIXTURE.parsed;
      },
      fetchImpl: async () =>
        new Response(null, {
          status: 200,
          headers: {
            etag: "etag-v3",
            "last-modified": "Sat, 28 Feb 2026 02:00:00 GMT"
          }
        })
    });

    assert.equal(result.syncedSources, 1);
    assert.equal(result.failedSources, 0);
    assert.equal(result.details.length, 1);
    assert.equal(parseFeedCallCount, 1);
    assert.equal(result.details[0]?.sourceId, dueSource.id);
  });

  it("실패한 source는 updateSourceFailureState로 backoff 상태를 기록한다", async () => {
    const source = cloneSource();
    let failureUpdateArgs:
      | {
          sourceId: number;
          failedAt: string;
          errorType: string;
          retryAfterSeconds?: number | null;
        }
      | undefined;

    const repository: SyncRepository = {
      getSourceById: async () => source,
      listSources: async () => [source],
      insertItems: async () => 0,
      updateSourceMetadata: async () => undefined,
      updateSourceCheckMetadata: async () => undefined,
      updateSourceFailureState: async (sourceId, failedAt, errorType, retryAfterSeconds) => {
        failureUpdateArgs = {
          sourceId,
          failedAt,
          errorType,
          retryAfterSeconds
        };
      }
    };

    const result = await syncAllSources({
      repository,
      now: () => FIXED_NOW,
      parseFeed: async () => {
        throw new Error("sync failed (429): rate limited");
      },
      fetchImpl: async () =>
        new Response(null, {
          status: 200,
          headers: {
            etag: "etag-v9",
            "last-modified": "Sat, 28 Feb 2026 03:00:00 GMT"
          }
        })
    });

    assert.equal(result.syncedSources, 1);
    assert.equal(result.failedSources, 1);
    assert.equal(result.details[0]?.status, "failed");
    assert.ok(failureUpdateArgs);
    assert.equal(failureUpdateArgs.sourceId, source.id);
    assert.equal(failureUpdateArgs.failedAt, FIXED_NOW);
    assert.equal(failureUpdateArgs.errorType, "HTTP_429");
    assert.equal(failureUpdateArgs.retryAfterSeconds, 3600);
  });
});
