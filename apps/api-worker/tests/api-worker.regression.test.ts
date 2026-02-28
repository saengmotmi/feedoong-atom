import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { API_ERROR_CODES, API_WRITE_KEY_HEADER, SCHEDULER_KEY_HEADER } from "@feedoong/contracts";

import app from "../src/index.js";
import { createFakeD1Database } from "./helpers/fake-d1.js";

import type { Bindings } from "../src/types.js";

type ErrorBody = {
  code: string;
  message: string;
  requestId: string;
};

const createBindings = (overrides: Partial<Bindings> = {}): Bindings => ({
  FEEDOONG_DB: createFakeD1Database(),
  WEB_ORIGIN: "*",
  API_WRITE_KEY: "write-key",
  SCHEDULER_KEY: "scheduler-key",
  ...overrides
});

const postJson = async (
  pathValue: string,
  body: unknown,
  env: Bindings,
  headers: Record<string, string> = {}
) =>
  app.request(
    pathValue,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...headers
      },
      body: JSON.stringify(body)
    },
    env
  );

const assertError: (
  body: unknown,
  code: string
) => asserts body is ErrorBody = (body, code) => {
  assert.equal(typeof body, "object");
  assert.ok(body);
  const resolved = body as Partial<ErrorBody>;
  assert.equal(resolved.code, code);
  assert.equal(typeof resolved.message, "string");
  assert.equal(typeof resolved.requestId, "string");
  assert.ok((resolved.requestId ?? "").length > 0);
};

describe("api-worker regression", () => {
  it("health endpoint는 정상 응답을 반환한다", async () => {
    const response = await app.request("/health", {}, createBindings());
    assert.equal(response.status, 200);
    const body = (await response.json()) as { ok: boolean; now: string };
    assert.equal(body.ok, true);
    assert.ok(body.now.length > 0);
  });

  it("API_WRITE_KEY가 비어 있으면 쓰기 API를 503으로 차단한다", async () => {
    const response = await postJson(
      "/v1/sync",
      {},
      createBindings({ API_WRITE_KEY: " " })
    );

    assert.equal(response.status, 503);
    const body = (await response.json()) as unknown;
    assertError(body, API_ERROR_CODES.SERVER_MISCONFIGURED);
  });

  it("x-api-key가 잘못되면 401을 반환한다", async () => {
    const response = await postJson(
      "/v1/sync",
      {},
      createBindings(),
      { [API_WRITE_KEY_HEADER]: "wrong-key" }
    );

    assert.equal(response.status, 401);
    const body = (await response.json()) as unknown;
    assertError(body, API_ERROR_CODES.UNAUTHORIZED);
  });

  it("SCHEDULER_KEY가 비어 있으면 internal sync를 503으로 차단한다", async () => {
    const response = await postJson(
      "/internal/sync",
      {},
      createBindings({ SCHEDULER_KEY: "" }),
      { [SCHEDULER_KEY_HEADER]: "scheduler-key" }
    );

    assert.equal(response.status, 503);
    const body = (await response.json()) as unknown;
    assertError(body, API_ERROR_CODES.SERVER_MISCONFIGURED);
  });

  it("scheduler key가 틀리면 internal sync는 401을 반환한다", async () => {
    const response = await postJson(
      "/internal/sync",
      {},
      createBindings(),
      { [SCHEDULER_KEY_HEADER]: "wrong-key" }
    );

    assert.equal(response.status, 401);
    const body = (await response.json()) as unknown;
    assertError(body, API_ERROR_CODES.UNAUTHORIZED);
  });

  it("빈 source 목록에서 sync는 200과 0 inserted를 반환한다", async () => {
    const response = await postJson(
      "/v1/sync",
      {},
      createBindings(),
      { [API_WRITE_KEY_HEADER]: "write-key" }
    );

    assert.equal(response.status, 200);
    const body = (await response.json()) as {
      syncedSources: number;
      failedSources: number;
      totalInserted: number;
      details: unknown[];
    };
    assert.equal(body.syncedSources, 0);
    assert.equal(body.failedSources, 0);
    assert.equal(body.totalInserted, 0);
    assert.equal(body.details.length, 0);
  });
});
