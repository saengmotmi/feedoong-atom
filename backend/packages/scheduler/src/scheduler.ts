export type SchedulerLogger = Pick<Console, "log" | "warn" | "error">;

type TriggerSyncInput = {
  apiBaseUrl: string;
  schedulerKey: string;
  timeoutMs: number;
  fetchImpl?: typeof fetch;
  logger?: SchedulerLogger;
};

type TriggerSyncWithRetryInput = TriggerSyncInput & {
  retryAttempts: number;
  retryBaseDelayMs: number;
  sleepImpl?: (ms: number) => Promise<void>;
};

type SyncLabel = "initial" | "periodic";

const MAX_RETRY_DELAY_MS = 15000;

export const toRetryDelayMs = (baseDelayMs: number, attempt: number) =>
  Math.min(baseDelayMs * 2 ** attempt, MAX_RETRY_DELAY_MS);

export const createSyncRequestHeaders = (schedulerKey: string) => {
  const normalizedKey = schedulerKey.trim();
  if (normalizedKey.length === 0) {
    throw new Error("schedulerKey is required");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-scheduler-key": normalizedKey
  };

  return headers;
};

export const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, Math.max(0, ms));
  });

export const triggerSyncOnce = async (
  input: TriggerSyncInput
): Promise<{ syncedSources: number; totalInserted: number }> => {
  const fetchImpl = input.fetchImpl ?? fetch;
  const response = await fetchImpl(`${input.apiBaseUrl}/internal/sync`, {
    method: "POST",
    headers: createSyncRequestHeaders(input.schedulerKey),
    signal: AbortSignal.timeout(input.timeoutMs)
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`sync failed (${response.status}): ${message}`);
  }

  const result = (await response.json()) as {
    syncedSources: number;
    totalInserted: number;
  };

  (input.logger ?? console).log(
    `[scheduler] synced=${result.syncedSources}, inserted=${result.totalInserted}`
  );

  return result;
};

export const triggerSyncWithRetry = async (
  input: TriggerSyncWithRetryInput
): Promise<void> => {
  const sleepImpl = input.sleepImpl ?? sleep;
  const logger = input.logger ?? console;

  let attempt = 0;
  while (attempt <= input.retryAttempts) {
    try {
      await triggerSyncOnce(input);
      return;
    } catch (error) {
      if (attempt >= input.retryAttempts) {
        throw error;
      }

      const delayMs = toRetryDelayMs(input.retryBaseDelayMs, attempt);
      logger.warn(
        `[scheduler] sync attempt ${attempt + 1} failed. retry in ${delayMs}ms`
      );
      await sleepImpl(delayMs);
      attempt += 1;
    }
  }
};

export const createRunSyncSafely = (input: {
  runSync: () => Promise<void>;
  logger?: SchedulerLogger;
}) => {
  let inFlightSync: Promise<void> | null = null;
  const logger = input.logger ?? console;

  return async (label: SyncLabel): Promise<void> => {
    if (inFlightSync) {
      logger.warn(
        `[scheduler] ${label} sync skipped: previous sync still in-flight`
      );
      return;
    }

    inFlightSync = input
      .runSync()
      .catch((error) => {
        logger.error(`[scheduler] ${label} sync failed`, error);
      })
      .finally(() => {
        inFlightSync = null;
      });

    await inFlightSync;
  };
};
