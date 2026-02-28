import "dotenv/config";

import cron from "node-cron";

import { createRunSyncSafely, triggerSyncWithRetry } from "./scheduler.js";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:4000";
const SYNC_CRON = process.env.SYNC_CRON ?? "*/30 * * * *";
const SCHEDULER_KEY = process.env.SCHEDULER_KEY ?? "";
const SYNC_REQUEST_TIMEOUT_MS = Number(process.env.SYNC_REQUEST_TIMEOUT_MS ?? "15000");
const SYNC_RETRY_ATTEMPTS = Number(process.env.SYNC_RETRY_ATTEMPTS ?? "2");
const SYNC_RETRY_BASE_DELAY_MS = Number(process.env.SYNC_RETRY_BASE_DELAY_MS ?? "1500");
const REQUIRED_SCHEDULER_KEY = SCHEDULER_KEY.trim();

if (REQUIRED_SCHEDULER_KEY.length === 0) {
  throw new Error("SCHEDULER_KEY is required for scheduler runtime");
}

const runSyncSafely = createRunSyncSafely({
  runSync: () =>
    triggerSyncWithRetry({
      apiBaseUrl: API_BASE_URL,
      schedulerKey: REQUIRED_SCHEDULER_KEY,
      timeoutMs: SYNC_REQUEST_TIMEOUT_MS,
      retryAttempts: SYNC_RETRY_ATTEMPTS,
      retryBaseDelayMs: SYNC_RETRY_BASE_DELAY_MS
    })
});

const run = () => {
  console.log(`[scheduler] started, cron="${SYNC_CRON}"`);

  void runSyncSafely("initial");

  cron.schedule(SYNC_CRON, () => {
    void runSyncSafely("periodic");
  });
};

run();
