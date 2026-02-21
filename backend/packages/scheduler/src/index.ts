import "dotenv/config";

import cron from "node-cron";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:4000";
const SYNC_CRON = process.env.SYNC_CRON ?? "*/30 * * * *";
const SCHEDULER_KEY = process.env.SCHEDULER_KEY ?? "";

const triggerSync = async () => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };
  if (SCHEDULER_KEY) {
    headers["x-scheduler-key"] = SCHEDULER_KEY;
  }

  const response = await fetch(`${API_BASE_URL}/internal/sync`, {
    method: "POST",
    headers
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

const run = () => {
  console.log(`[scheduler] started, cron="${SYNC_CRON}"`);

  void triggerSync().catch((error) => {
    console.error("[scheduler] initial sync failed", error);
  });

  cron.schedule(SYNC_CRON, () => {
    void triggerSync().catch((error) => {
      console.error("[scheduler] periodic sync failed", error);
    });
  });
};

run();
