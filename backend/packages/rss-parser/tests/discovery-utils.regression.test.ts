import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  discoverFeedLinksFromHtml,
  isHttpUrl,
  uniqueUrls
} from "../src/discovery/utils.js";

const withMockedFetch = async (
  mock: typeof fetch,
  run: () => Promise<void>
) => {
  const previousFetch = globalThis.fetch;
  Object.defineProperty(globalThis, "fetch", {
    value: mock,
    configurable: true
  });

  try {
    await run();
  } finally {
    Object.defineProperty(globalThis, "fetch", {
      value: previousFetch,
      configurable: true
    });
  }
};

describe("rss-parser discovery utils regression", () => {
  it("isHttpUrl은 공개 http/https와 x-mentions만 허용한다", () => {
    const allowed = [
      "https://example.com/feed.xml",
      "http://example.com/rss",
      "x-mentions://mentions/ohjtack"
    ];
    const denied = [
      "http://127.0.0.1/feed.xml",
      "file:///tmp/feed.xml",
      "javascript:alert(1)"
    ];

    for (const value of allowed) {
      assert.equal(isHttpUrl(value), true, `expected allowed: ${value}`);
    }
    for (const value of denied) {
      assert.equal(isHttpUrl(value), false, `expected denied: ${value}`);
    }
  });

  it("uniqueUrls는 비허용 URL을 제거하고 중복을 정규화한다", () => {
    const result = uniqueUrls([
      "https://example.com/feed.xml",
      "https://example.com/feed.xml",
      "https://example.com/feed.xml#hash",
      "http://127.0.0.1/feed.xml",
      "x-mentions://mentions/ohjtack",
      "x-mentions://mentions/ohjtack"
    ]);

    assert.deepEqual(result, [
      "https://example.com/feed.xml",
      "https://example.com/feed.xml#hash",
      "x-mentions://mentions/ohjtack"
    ]);
  });

  it("discoverFeedLinksFromHtml는 HTML feed link를 추출하고 정규화한다", async () => {
    let fetchCallCount = 0;

    await withMockedFetch(
      (async () => {
        fetchCallCount += 1;
        const response = new Response(
          `
            <html><head>
              <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
              <link type="application/atom+xml" href="https://example.com/atom.xml" />
              <link rel="alternate" href="https://example.com/not-feed" />
            </head></html>
          `,
          {
            status: 200,
            headers: {
              "content-type": "text/html; charset=utf-8"
            }
          }
        );
        Object.defineProperty(response, "url", {
          value: "https://example.com/blog",
          configurable: true
        });
        return response;
      }) as typeof fetch,
      async () => {
        const links = await discoverFeedLinksFromHtml(
          new URL("https://example.com/blog")
        );

        assert.equal(fetchCallCount, 1);
        assert.deepEqual(links, [
          "https://example.com/feed.xml",
          "https://example.com/atom.xml",
          "https://example.com/not-feed"
        ]);
      }
    );
  });

  it("discoverFeedLinksFromHtml는 private/local URL이면 요청하지 않고 종료한다", async () => {
    let fetchCallCount = 0;

    await withMockedFetch(
      (async () => {
        fetchCallCount += 1;
        return new Response("", { status: 200 });
      }) as typeof fetch,
      async () => {
        const links = await discoverFeedLinksFromHtml(
          new URL("http://127.0.0.1/blog")
        );
        assert.deepEqual(links, []);
      }
    );

    assert.equal(fetchCallCount, 0);
  });
});
