import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { DuplicateSourceUrlError } from "@feedoong/contracts";

import {
  addSource,
  getSourceById,
  insertItems,
  listItems,
  listSources,
  updateSourceCheckMetadata,
  updateSourceFailureState,
  updateSourceMetadata
} from "../src/storage.js";
import { createFakeD1Database } from "./helpers/fake-d1.js";

import type { Bindings } from "../src/types.js";

const createTestEnv = (overrides: Partial<Bindings> = {}): Bindings => ({
  FEEDOONG_DB: createFakeD1Database(),
  WEB_ORIGIN: "*",
  API_WRITE_KEY: "test-write-key",
  SCHEDULER_KEY: "test-scheduler-key",
  ...overrides
});

describe("api-worker storage regression", () => {
  it("source 등록/조회 시 createdAt 내림차순으로 반환한다", async () => {
    const env = createTestEnv();

    await addSource(env, "https://example.com/a.xml", "a", () => "2026-01-01T00:00:00.000Z");
    await addSource(env, "https://example.com/b.xml", "b", () => "2026-01-02T00:00:00.000Z");

    const sources = await listSources(env);
    assert.equal(sources.length, 2);
    assert.deepEqual(
      sources.map((source) => source.url),
      ["https://example.com/b.xml", "https://example.com/a.xml"]
    );
  });

  it("중복 URL source 등록은 DuplicateSourceUrlError를 던진다", async () => {
    const env = createTestEnv();
    await addSource(env, "https://example.com/feed.xml", "title");

    await assert.rejects(
      () => addSource(env, "https://example.com/feed.xml", "title"),
      (error: unknown) => {
        assert.ok(error instanceof DuplicateSourceUrlError);
        return true;
      }
    );
  });

  it("insert 단계에서 UNIQUE 제약이 나도 DuplicateSourceUrlError로 정규화한다", async () => {
    const env = createTestEnv({
      FEEDOONG_DB: createFakeD1Database({
        failSourceInsertWithUniqueErrorOnce: true
      })
    });

    await assert.rejects(
      () => addSource(env, "https://example.com/feed.xml", "title"),
      (error: unknown) => {
        assert.ok(error instanceof DuplicateSourceUrlError);
        return true;
      }
    );
  });

  it("item 증분 등록은 guid/link 중복을 무시하고 inserted count를 반환한다", async () => {
    const env = createTestEnv();
    const source = await addSource(env, "https://example.com/feed.xml", "source-title");

    const firstInserted = await insertItems(
      env,
      source.id,
      [
        {
          guid: "g-1",
          title: "first",
          link: "https://example.com/posts/1",
          summary: "one",
          publishedAt: "2026-01-01T09:00:00.000Z"
        },
        {
          guid: "g-2",
          title: "second",
          link: "https://example.com/posts/2",
          summary: "two",
          publishedAt: "2026-01-02T09:00:00.000Z"
        }
      ],
      () => "2026-01-10T00:00:00.000Z"
    );
    assert.equal(firstInserted, 2);

    const secondInserted = await insertItems(
      env,
      source.id,
      [
        {
          guid: "g-2",
          title: "dup-guid",
          link: "https://example.com/posts/2-dup",
          summary: null,
          publishedAt: "2026-01-03T09:00:00.000Z"
        },
        {
          guid: "g-3",
          title: "third",
          link: "https://example.com/posts/3",
          summary: null,
          publishedAt: "2026-01-03T10:00:00.000Z"
        }
      ],
      () => "2026-01-11T00:00:00.000Z"
    );

    assert.equal(secondInserted, 1);
    const items = await listItems(env, 10, 0);
    assert.equal(items.length, 3);
    assert.deepEqual(
      items.map((item) => item.link),
      [
        "https://example.com/posts/3",
        "https://example.com/posts/2",
        "https://example.com/posts/1"
      ]
    );
  });

  it("source metadata 업데이트는 source/item title과 head validator를 함께 반영한다", async () => {
    const env = createTestEnv();
    const source = await addSource(env, "https://example.com/feed.xml", "old-title");
    await insertItems(env, source.id, [
      {
        guid: "g-1",
        title: "item",
        link: "https://example.com/posts/1",
        summary: null,
        publishedAt: "2026-01-01T00:00:00.000Z"
      }
    ]);

    await updateSourceMetadata(
      env,
      source.id,
      "new-title",
      "2026-01-02T00:00:00.000Z",
      {
        checkedAt: "2026-01-02T00:00:00.000Z",
        headEtag: "etag-v2",
        headLastModified: "Wed, 01 Jan 2026 00:00:00 GMT"
      }
    );

    const updated = await getSourceById(env, source.id);
    assert.ok(updated);
    assert.equal(updated.title, "new-title");
    assert.equal(updated.lastSyncedAt, "2026-01-02T00:00:00.000Z");
    assert.equal(updated.lastCheckedAt, "2026-01-02T00:00:00.000Z");
    assert.equal(updated.lastHeadEtag, "etag-v2");
    assert.equal(updated.lastHeadLastModified, "Wed, 01 Jan 2026 00:00:00 GMT");
    assert.equal(updated.errorCount, 0);
    assert.equal(updated.retryAfterSeconds, null);
    assert.equal(updated.nextCheckAt, null);
    assert.equal(updated.lastErrorType, null);

    const items = await listItems(env, 10, 0);
    assert.equal(items[0]?.sourceTitle, "new-title");
  });

  it("check metadata 단독 업데이트는 마지막 체크 정보만 갱신한다", async () => {
    const env = createTestEnv();
    const source = await addSource(env, "https://example.com/feed.xml", "source-title");

    await updateSourceCheckMetadata(
      env,
      source.id,
      "2026-01-03T00:00:00.000Z",
      "etag-v3",
      "Thu, 02 Jan 2026 00:00:00 GMT"
    );

    const updated = await getSourceById(env, source.id);
    assert.ok(updated);
    assert.equal(updated.lastCheckedAt, "2026-01-03T00:00:00.000Z");
    assert.equal(updated.lastHeadEtag, "etag-v3");
    assert.equal(updated.lastHeadLastModified, "Thu, 02 Jan 2026 00:00:00 GMT");
    assert.equal(updated.title, "source-title");
  });

  it("실패 상태 업데이트는 errorCount/retryAfter/nextCheckAt을 갱신한다", async () => {
    const env = createTestEnv();
    const source = await addSource(env, "https://example.com/feed.xml", "source-title");

    await updateSourceFailureState(
      env,
      source.id,
      "2026-01-03T00:00:00.000Z",
      "HTTP_429",
      1200
    );

    const updated = await getSourceById(env, source.id);
    assert.ok(updated);
    assert.equal(updated.errorCount, 1);
    assert.equal(updated.retryAfterSeconds, 1200);
    assert.equal(updated.lastErrorType, "HTTP_429");
    assert.equal(updated.nextCheckAt, "2026-01-03T00:20:00.000Z");
    assert.equal(updated.lastCheckedAt, "2026-01-03T00:00:00.000Z");
  });
});
