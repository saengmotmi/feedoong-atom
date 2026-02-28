import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  createRunSyncSafely,
  createSyncRequestHeaders,
  toRetryDelayMs,
  triggerSyncOnce,
  triggerSyncWithRetry
} from "../src/scheduler.js";

const createNoopLogger = () => ({
  log: () => undefined,
  warn: () => undefined,
  error: () => undefined
});

describe("scheduler regression", () => {
  it("scheduler key가 있으면 헤더를 포함한다", () => {
    assert.deepEqual(createSyncRequestHeaders("secret-key"), {
      "Content-Type": "application/json",
      "x-scheduler-key": "secret-key"
    });
  });

  it("scheduler key가 비어 있으면 즉시 예외를 던진다", () => {
    assert.throws(() => createSyncRequestHeaders("   "), /schedulerKey is required/);
  });

  it("retry delay는 지수 증가하고 상한을 넘지 않는다", () => {
    assert.equal(toRetryDelayMs(1000, 0), 1000);
    assert.equal(toRetryDelayMs(1000, 1), 2000);
    assert.equal(toRetryDelayMs(1000, 2), 4000);
    assert.equal(toRetryDelayMs(8000, 2), 15000);
  });

  it("triggerSyncOnce는 실패 응답을 에러로 바꾼다", async () => {
    const fetchImpl: typeof fetch = async () =>
      new Response("forbidden", { status: 403 });

    await assert.rejects(
      () =>
        triggerSyncOnce({
          apiBaseUrl: "https://api.example.com",
          schedulerKey: "k",
          timeoutMs: 1000,
          fetchImpl,
          logger: createNoopLogger()
        }),
      /sync failed \(403\): forbidden/
    );
  });

  it("triggerSyncWithRetry는 실패 후 재시도에서 성공할 수 있다", async () => {
    let callCount = 0;
    const recordedSleeps: number[] = [];

    const fetchImpl: typeof fetch = async () => {
      callCount += 1;
      if (callCount === 1) {
        return new Response("temporary", { status: 503 });
      }
      return new Response(
        JSON.stringify({
          syncedSources: 2,
          totalInserted: 10
        }),
        {
          status: 200,
          headers: {
            "content-type": "application/json"
          }
        }
      );
    };

    await triggerSyncWithRetry({
      apiBaseUrl: "https://api.example.com",
      schedulerKey: "k",
      timeoutMs: 1000,
      retryAttempts: 2,
      retryBaseDelayMs: 500,
      fetchImpl,
      sleepImpl: async (ms) => {
        recordedSleeps.push(ms);
      },
      logger: createNoopLogger()
    });

    assert.equal(callCount, 2);
    assert.deepEqual(recordedSleeps, [500]);
  });

  it("triggerSyncWithRetry는 최대 재시도 초과 시 실패한다", async () => {
    let callCount = 0;
    const fetchImpl: typeof fetch = async () => {
      callCount += 1;
      return new Response("down", { status: 502 });
    };

    await assert.rejects(
      () =>
        triggerSyncWithRetry({
          apiBaseUrl: "https://api.example.com",
          schedulerKey: "k",
          timeoutMs: 1000,
          retryAttempts: 2,
          retryBaseDelayMs: 100,
          fetchImpl,
          sleepImpl: async () => undefined,
          logger: createNoopLogger()
        }),
      /sync failed \(502\): down/
    );

    assert.equal(callCount, 3);
  });

  it("createRunSyncSafely는 in-flight 중복 실행을 막는다", async () => {
    let runCount = 0;
    let release: (() => void) | null = null;

    const runSync = async () => {
      runCount += 1;
      await new Promise<void>((resolve) => {
        release = resolve;
      });
    };

    const runner = createRunSyncSafely({
      runSync,
      logger: createNoopLogger()
    });

    const first = runner("initial");
    const second = runner("periodic");
    await Promise.resolve();

    assert.equal(runCount, 1);
    release?.();
    await Promise.all([first, second]);
    assert.equal(runCount, 1);
  });
});
