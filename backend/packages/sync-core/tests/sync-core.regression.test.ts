import assert from "node:assert/strict";
import fs from "node:fs";
import { describe, it } from "node:test";

import { SourceNotFoundError, syncOneSource } from "../src/index.js";

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
      updateSourceCheckMetadata: async () => undefined
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
      }
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
      }
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
});
