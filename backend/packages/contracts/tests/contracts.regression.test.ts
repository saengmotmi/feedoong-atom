import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  API_ERROR_CODES,
  ServerMisconfiguredError,
  UnauthorizedError,
  UrlNotAllowedError,
  assertPublicSourceUrl,
  createApiErrorResponse,
  ensureAuthorizedByKey,
  isPrivateOrLocalHost,
  isPublicHttpUrl,
  requireConfiguredSecret
} from "../src/index.js";

describe("contracts regression", () => {
  it("isPrivateOrLocalHost는 로컬/사설/메타데이터 호스트를 차단한다", () => {
    const blockedHosts = [
      "localhost",
      "127.0.0.1",
      "10.0.0.1",
      "172.16.0.10",
      "192.168.1.7",
      "169.254.169.254",
      "metadata.google.internal",
      "::1",
      "fc00::1",
      "service.local",
      "cluster.internal"
    ];

    for (const host of blockedHosts) {
      assert.equal(isPrivateOrLocalHost(host), true, `expected blocked host: ${host}`);
    }
  });

  it("isPublicHttpUrl은 공개 http/https URL만 허용한다", () => {
    const allowed = [
      "https://example.com/rss.xml",
      "http://news.ycombinator.com/rss",
      "https://x.com/ohjtack"
    ];
    const denied = [
      "ftp://example.com/feed.xml",
      "x-mentions://mentions/ohjtack",
      "http://127.0.0.1/feed.xml",
      "http://localhost:4000/feed.xml",
      "http://user:pass@example.com/feed.xml"
    ];

    for (const value of allowed) {
      assert.equal(isPublicHttpUrl(value), true, `expected allowed url: ${value}`);
    }
    for (const value of denied) {
      assert.equal(isPublicHttpUrl(value), false, `expected denied url: ${value}`);
    }
  });

  it("assertPublicSourceUrl은 비공개 URL에 대해 UrlNotAllowedError를 던진다", () => {
    assert.throws(() => assertPublicSourceUrl("http://127.0.0.1/feed.xml"), (error: unknown) => {
      assert.ok(error instanceof UrlNotAllowedError);
      assert.equal(error.code, API_ERROR_CODES.URL_NOT_ALLOWED);
      assert.equal(error.status, 422);
      return true;
    });
  });

  it("ensureAuthorizedByKey는 expected key가 비어 있으면 통과한다", () => {
    assert.doesNotThrow(() => {
      ensureAuthorizedByKey({
        expectedKey: "  ",
        providedKey: ""
      });
    });
  });

  it("ensureAuthorizedByKey는 키가 다르면 UnauthorizedError를 던진다", () => {
    assert.throws(
      () =>
        ensureAuthorizedByKey({
          expectedKey: "secret",
          providedKey: "wrong"
        }),
      (error: unknown) => {
        assert.ok(error instanceof UnauthorizedError);
        assert.equal(error.code, API_ERROR_CODES.UNAUTHORIZED);
        assert.equal(error.status, 401);
        return true;
      }
    );
  });

  it("createApiErrorResponse는 issues가 없으면 필드를 생략한다", () => {
    const response = createApiErrorResponse({
      code: API_ERROR_CODES.INVALID_REQUEST,
      message: "Invalid request",
      requestId: "req-1"
    });

    assert.deepEqual(response, {
      code: API_ERROR_CODES.INVALID_REQUEST,
      message: "Invalid request",
      requestId: "req-1"
    });
    assert.equal("issues" in response, false);
  });

  it("requireConfiguredSecret은 빈 값이면 ServerMisconfiguredError를 던진다", () => {
    assert.throws(
      () =>
        requireConfiguredSecret({
          value: " ",
          secretName: "API_WRITE_KEY"
        }),
      (error: unknown) => {
        assert.ok(error instanceof ServerMisconfiguredError);
        assert.equal(error.code, API_ERROR_CODES.SERVER_MISCONFIGURED);
        assert.equal(error.status, 503);
        return true;
      }
    );
  });
});
