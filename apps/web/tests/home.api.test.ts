import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import {
  ApiRequestError,
  fetchJson,
  loadDashboardPayload,
  resolveApiRuntime,
  toApiErrorMessage
} from "../app/routes/home.api.js";

import type { ApiRuntime } from "../app/routes/home.types.js";

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

const createRuntime = (fetchImpl: typeof fetch): ApiRuntime => ({
  apiBaseUrl: "https://api.example.com",
  apiFetch: fetchImpl,
  ttlSeconds: 60,
  apiTimeoutMs: 3000,
  apiWriteKey: "test-key"
});

describe("web home api regression", () => {
  it("resolveApiRuntime은 ttl/timeout을 안전한 범위로 정규화한다", () => {
    process.env.API_BASE_URL = "https://api.example.com";
    process.env.CACHE_TTL_SECONDS = "-1";
    process.env.API_TIMEOUT_MS = "999999";
    process.env.API_WRITE_KEY = "write-key";

    const runtime = resolveApiRuntime({});
    assert.equal(runtime.ttlSeconds, 60);
    assert.equal(runtime.apiTimeoutMs, 60000);
    assert.equal(runtime.apiBaseUrl, "https://api.example.com");
    assert.equal(runtime.apiWriteKey, "write-key");
  });

  it("resolveApiRuntime은 잘못된 API_BASE_URL을 거부한다", () => {
    process.env.API_BASE_URL = "ftp://invalid";
    process.env.API_WRITE_KEY = "write-key";
    assert.throws(() => resolveApiRuntime({}), /API_BASE_URL is invalid/);
  });

  it("fetchJson은 GET 503을 1회 재시도 후 성공하면 반환한다", async () => {
    let callCount = 0;
    const fetchImpl: typeof fetch = async () => {
      callCount += 1;
      if (callCount === 1) {
        return new Response("temporarily unavailable", { status: 503 });
      }
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: {
          "content-type": "application/json"
        }
      });
    };

    const result = await fetchJson<{ ok: boolean }>(
      "https://api.example.com/health",
      { method: "GET" },
      60,
      2000,
      fetchImpl
    );

    assert.equal(callCount, 2);
    assert.equal(result.ok, true);
  });

  it("fetchJson은 POST 실패를 재시도하지 않는다", async () => {
    let callCount = 0;
    const fetchImpl: typeof fetch = async () => {
      callCount += 1;
      return new Response("bad request", { status: 400 });
    };

    await assert.rejects(
      () =>
        fetchJson(
          "https://api.example.com/v1/sources",
          { method: "POST", body: "{}" },
          undefined,
          2000,
          fetchImpl
        ),
      (error: unknown) => {
        assert.ok(error instanceof ApiRequestError);
        assert.equal(error.status, 400);
        return true;
      }
    );
    assert.equal(callCount, 1);
  });

  it("loadDashboardPayload는 잘못된 응답 스키마를 차단한다", async () => {
    const fetchImpl: typeof fetch = async (input) => {
      const url = String(input);
      if (url.endsWith("/v1/sources")) {
        return new Response(JSON.stringify({ sources: [{ id: 1 }] }), {
          status: 200,
          headers: {
            "content-type": "application/json"
          }
        });
      }
      return new Response(JSON.stringify({ items: [] }), {
        status: 200,
        headers: {
          "content-type": "application/json"
        }
      });
    };

    await assert.rejects(
      () => loadDashboardPayload(createRuntime(fetchImpl)),
      /Required/
    );
  });

  it("toApiErrorMessage는 인증/설정 오류를 고정 문구로 변환한다", () => {
    assert.equal(
      toApiErrorMessage(new ApiRequestError(401, "unauthorized"), "fallback"),
      "웹 API 인증 설정을 확인해 주세요."
    );
    assert.equal(
      toApiErrorMessage(new Error("custom error"), "fallback"),
      "custom error"
    );
  });
});
