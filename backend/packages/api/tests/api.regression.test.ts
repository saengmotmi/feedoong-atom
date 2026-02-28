import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, it } from "node:test";

import { API_WRITE_KEY_HEADER, SCHEDULER_KEY_HEADER } from "@feedoong/contracts";

import { createApiApp } from "../src/app.js";
import { FeedoongDb } from "../src/db.js";

import type { ParsedFeedResult } from "@feedoong/rss-parser";

type FixtureMap = Record<string, ParsedFeedResult>;

const PARSE_FEED_FIXTURES = JSON.parse(
  fs.readFileSync(new URL("./fixtures/parse-feed.fixture.json", import.meta.url), "utf8")
) as FixtureMap;

const tempDirs: string[] = [];

const createTempDbPath = () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "feedoong-api-test-"));
  tempDirs.push(dir);
  return path.join(dir, "db.json");
};

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

const postJson = async (
  app: ReturnType<typeof createApiApp>,
  pathValue: string,
  body: unknown,
  headers: Record<string, string> = {}
) =>
  app.request(pathValue, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...headers
    },
    body: JSON.stringify(body)
  });

const createFixtureDrivenApp = () => {
  const db = new FeedoongDb(createTempDbPath());
  const parseFeedPort = async (url: string) => {
    const parsed = PARSE_FEED_FIXTURES[url];
    if (!parsed) {
      throw new Error(`No parse-feed fixture for url=${url}`);
    }
    return parsed;
  };

  return createApiApp({
    db,
    parseFeedPort,
    webOrigin: "*",
    apiWriteKey: "test-write-key",
    schedulerKey: "test-scheduler-key"
  });
};

describe("API regression fixtures", () => {
  it("쓰기 API는 x-api-key 없으면 401을 반환한다", async () => {
    const app = createFixtureDrivenApp();
    const response = await postJson(app, "/v1/sources", {
      url: "https://example.com/blog"
    });

    assert.equal(response.status, 401);
    const body = (await response.json()) as {
      code: string;
      requestId: string;
    };
    assert.equal(body.code, "UNAUTHORIZED");
    assert.equal(typeof body.requestId, "string");
    assert.ok(body.requestId.length > 0);
  });

  it("private/local URL 등록은 422로 차단한다", async () => {
    const app = createFixtureDrivenApp();
    const response = await postJson(
      app,
      "/v1/sources",
      { url: "http://127.0.0.1/rss.xml" },
      {
        [API_WRITE_KEY_HEADER]: "test-write-key"
      }
    );

    assert.equal(response.status, 422);
    const body = (await response.json()) as {
      code: string;
    };
    assert.equal(body.code, "URL_NOT_ALLOWED");
  });

  it("fixture 기반으로 source 등록 후 단일 sync가 정상 동작한다", async () => {
    const app = createFixtureDrivenApp();

    const registerResponse = await postJson(
      app,
      "/v1/sources",
      { url: "https://example.com/blog" },
      {
        [API_WRITE_KEY_HEADER]: "test-write-key"
      }
    );
    assert.equal(registerResponse.status, 201);
    const registered = (await registerResponse.json()) as {
      source: {
        id: number;
        url: string;
      };
    };
    assert.equal(registered.source.url, "https://example.com/feed.xml");

    const syncResponse = await postJson(
      app,
      "/v1/sync",
      { sourceId: registered.source.id },
      {
        [API_WRITE_KEY_HEADER]: "test-write-key"
      }
    );
    assert.equal(syncResponse.status, 200);
    const syncBody = (await syncResponse.json()) as {
      syncedSources: number;
      failedSources: number;
      totalInserted: number;
    };
    assert.equal(syncBody.syncedSources, 1);
    assert.equal(syncBody.failedSources, 0);
    assert.equal(syncBody.totalInserted, 2);

    const itemsResponse = await app.request("/v1/items?limit=10&offset=0");
    assert.equal(itemsResponse.status, 200);
    const itemsBody = (await itemsResponse.json()) as {
      items: Array<{ link: string }>;
    };
    assert.equal(itemsBody.items.length, 2);
    assert.deepEqual(
      itemsBody.items.map((item) => item.link),
      ["https://example.com/posts/2", "https://example.com/posts/1"]
    );
  });

  it("없는 sourceId 동기화는 404 코드로 고정된다", async () => {
    const app = createFixtureDrivenApp();
    const response = await postJson(
      app,
      "/v1/sync",
      { sourceId: 9999 },
      {
        [API_WRITE_KEY_HEADER]: "test-write-key"
      }
    );

    assert.equal(response.status, 404);
    const body = (await response.json()) as {
      code: string;
    };
    assert.equal(body.code, "SOURCE_NOT_FOUND");
  });

  it("internal sync는 scheduler key 불일치 시 401을 반환한다", async () => {
    const app = createFixtureDrivenApp();
    const response = await postJson(
      app,
      "/internal/sync",
      {},
      {
        [SCHEDULER_KEY_HEADER]: "wrong-key"
      }
    );

    assert.equal(response.status, 401);
    const body = (await response.json()) as {
      code: string;
    };
    assert.equal(body.code, "UNAUTHORIZED");
  });
});
