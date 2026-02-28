import "dotenv/config";

import cron from "node-cron";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:4000";
const SYNC_CRON = process.env.SYNC_CRON ?? "*/30 * * * *";
const SCHEDULER_KEY = process.env.SCHEDULER_KEY ?? "";
const SYNC_REQUEST_TIMEOUT_MS = Number(process.env.SYNC_REQUEST_TIMEOUT_MS ?? "15000");
const SYNC_RETRY_ATTEMPTS = Number(process.env.SYNC_RETRY_ATTEMPTS ?? "2");
const SYNC_RETRY_BASE_DELAY_MS = Number(process.env.SYNC_RETRY_BASE_DELAY_MS ?? "1500");

const toRetryDelayMs = (attempt: number) =>
  Math.min(SYNC_RETRY_BASE_DELAY_MS * 2 ** attempt, 15000);

const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, Math.max(0, ms));
  });

const triggerSyncOnce = async () => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };
  if (SCHEDULER_KEY) {
    headers["x-scheduler-key"] = SCHEDULER_KEY;
  }

  const response = await fetch(`${API_BASE_URL}/internal/sync`, {
    method: "POST",
    headers,
    signal: AbortSignal.timeout(SYNC_REQUEST_TIMEOUT_MS)
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`sync failed (${response.status}): ${message}`);
  }

  const result = await response.json();
  console.log(
    `[scheduler] synced=${result.syncedSources}, inserted=${result.totalInserted}`
  );
};

const triggerSyncWithRetry = async () => {
  let attempt = 0;
  while (attempt <= SYNC_RETRY_ATTEMPTS) {
    try {
      await triggerSyncOnce();
      return;
    } catch (error) {
      if (attempt >= SYNC_RETRY_ATTEMPTS) {
        throw error;
      }

      const delayMs = toRetryDelayMs(attempt);
      console.warn(
        `[scheduler] sync attempt ${attempt + 1} failed. retry in ${delayMs}ms`
      );
      await sleep(delayMs);
      attempt += 1;
    }
  }
};

let inFlightSync: Promise<void> | null = null;

const runSyncSafely = async (label: "initial" | "periodic") => {
  if (inFlightSync) {
    console.warn(`[scheduler] ${label} sync skipped: previous sync still in-flight`);
    return;
  }

  inFlightSync = triggerSyncWithRetry()
    .catch((error) => {
      console.error(`[scheduler] ${label} sync failed`, error);
    })
    .finally(() => {
      inFlightSync = null;
    });

  await inFlightSync;
};

const run = () => {
  console.log(`[scheduler] started, cron="${SYNC_CRON}"`);

  void runSyncSafely("initial");

  cron.schedule(SYNC_CRON, () => {
    void runSyncSafely("periodic");
  });
};

run();
