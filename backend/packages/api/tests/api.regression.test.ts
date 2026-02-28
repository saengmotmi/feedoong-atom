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

const assertErrorPayload = (
  body: unknown,
  expectedCode: string
): asserts body is { code: string; message: string; requestId: string } => {
  assert.equal(typeof body, "object");
  assert.ok(body);
  const resolved = body as { code?: unknown; message?: unknown; requestId?: unknown };
  assert.equal(resolved.code, expectedCode);
  assert.equal(typeof resolved.message, "string");
  assert.equal(typeof resolved.requestId, "string");
  assert.ok((resolved.requestId as string).length > 0);
};

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
    const response = await postJson(
      app,
      "/v1/sources",
      {
        url: "https://example.com/blog"
      },
      {
        "x-request-id": "req-auth-missing"
      }
    );

    assert.equal(response.status, 401);
    const body = (await response.json()) as unknown;
    assertErrorPayload(body, "UNAUTHORIZED");
    assert.equal(body.requestId, "req-auth-missing");
  });

  it("쓰기 API는 잘못된 x-api-key도 401을 반환한다", async () => {
    const app = createFixtureDrivenApp();
    const response = await postJson(
      app,
      "/v1/sync",
      {},
      {
        [API_WRITE_KEY_HEADER]: "wrong-key"
      }
    );

    assert.equal(response.status, 401);
    const body = (await response.json()) as unknown;
    assertErrorPayload(body, "UNAUTHORIZED");
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
    const body = (await response.json()) as unknown;
    assertErrorPayload(body, "URL_NOT_ALLOWED");
  });

  it("요청 바디 검증 실패 시 400 + INVALID_REQUEST를 반환한다", async () => {
    const app = createFixtureDrivenApp();
    const response = await postJson(
      app,
      "/v1/sources",
      { url: "not-url" },
      {
        [API_WRITE_KEY_HEADER]: "test-write-key"
      }
    );

    assert.equal(response.status, 400);
    const body = (await response.json()) as {
      code?: unknown;
      issues?: unknown;
    };
    assertErrorPayload(body, "INVALID_REQUEST");
    assert.ok(Array.isArray(body.issues));
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

    const duplicateRegisterResponse = await postJson(
      app,
      "/v1/sources",
      { url: "https://example.com/blog" },
      {
        [API_WRITE_KEY_HEADER]: "test-write-key"
      }
    );
    assert.equal(duplicateRegisterResponse.status, 409);
    const duplicateBody = (await duplicateRegisterResponse.json()) as unknown;
    assertErrorPayload(duplicateBody, "DUPLICATE_SOURCE_URL");

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
    const body = (await response.json()) as unknown;
    assertErrorPayload(body, "SOURCE_NOT_FOUND");
  });

  it("all sync는 일부 소스 실패를 failed detail로 유지한다", async () => {
    const db = new FeedoongDb(createTempDbPath());
    const parseFeedPort = async (url: string) => {
      if (url === "https://example.com/blog-failing") {
        return {
          ...PARSE_FEED_FIXTURES["https://example.com/blog"],
          feedUrl: "https://example.com/failing-feed.xml"
        };
      }
      if (url === "https://example.com/failing-feed.xml") {
        throw new Error("fixture parse fail");
      }
      const fixture = PARSE_FEED_FIXTURES[url];
      if (!fixture) {
        throw new Error(`No parse-feed fixture for url=${url}`);
      }
      return fixture;
    };

    const app = createApiApp({
      db,
      parseFeedPort,
      webOrigin: "*",
      apiWriteKey: "test-write-key",
      schedulerKey: "test-scheduler-key"
    });

    const registerOk = await postJson(
      app,
      "/v1/sources",
      { url: "https://example.com/blog" },
      {
        [API_WRITE_KEY_HEADER]: "test-write-key"
      }
    );
    assert.equal(registerOk.status, 201);

    const registerFail = await postJson(
      app,
      "/v1/sources",
      { url: "https://example.com/blog-failing" },
      {
        [API_WRITE_KEY_HEADER]: "test-write-key"
      }
    );
    assert.equal(registerFail.status, 201);

    const syncAllResponse = await postJson(
      app,
      "/v1/sync",
      {},
      {
        [API_WRITE_KEY_HEADER]: "test-write-key"
      }
    );
    assert.equal(syncAllResponse.status, 200);

    const syncAllBody = (await syncAllResponse.json()) as {
      syncedSources: number;
      failedSources: number;
      totalInserted: number;
      details: Array<{ status: string; sourceUrl: string }>;
    };

    assert.equal(syncAllBody.syncedSources, 2);
    assert.equal(syncAllBody.failedSources, 1);
    assert.equal(syncAllBody.totalInserted, 2);
    assert.equal(
      syncAllBody.details.some(
        (detail) =>
          detail.status === "failed" &&
          detail.sourceUrl === "https://example.com/failing-feed.xml"
      ),
      true
    );
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
    const body = (await response.json()) as unknown;
    assertErrorPayload(body, "UNAUTHORIZED");
  });

  it("internal sync는 scheduler key가 맞으면 실행된다", async () => {
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

    const response = await postJson(
      app,
      "/internal/sync",
      {},
      {
        [SCHEDULER_KEY_HEADER]: "test-scheduler-key"
      }
    );
    assert.equal(response.status, 200);
    const body = (await response.json()) as {
      syncedSources: number;
      failedSources: number;
    };
    assert.equal(body.syncedSources, 1);
    assert.equal(body.failedSources, 0);
  });

  it("예상치 못한 내부 에러는 500 + INTERNAL_SERVER_ERROR로 마스킹된다", async () => {
    const db = new FeedoongDb(createTempDbPath());
    (db as unknown as { listSources: () => never }).listSources = () => {
      throw new Error("leak-this-message");
    };

    const app = createApiApp({
      db,
      webOrigin: "*",
      apiWriteKey: "test-write-key",
      schedulerKey: "test-scheduler-key"
    });

    const response = await app.request("/v1/sources");
    assert.equal(response.status, 500);

    const body = (await response.json()) as unknown;
    assertErrorPayload(body, "INTERNAL_SERVER_ERROR");
    assert.equal(body.message, "알 수 없는 서버 에러");
  });
});
