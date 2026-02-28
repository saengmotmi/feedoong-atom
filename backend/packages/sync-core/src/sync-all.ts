import * as R from "remeda";
import { match } from "ts-pattern";

import { INITIAL_SYNC_AGGREGATE } from "./constants.js";
import { createFailedDetail } from "./detail.js";
import { resolveNow, toErrorMessage } from "./runtime.js";
import { syncOneSource } from "./sync-one.js";
import type {
  CommonSyncDeps,
  SourceRecord,
  SyncAggregate,
  SyncAttempt,
  SyncResult
} from "./types.js";

type FailureStateUpdate = {
  errorType: string;
  retryAfterSeconds: number | null;
};

const resolveFailureStateUpdate = (message: string): FailureStateUpdate => {
  const normalized = message.toLowerCase();
  const retryAfter = normalized.match(/retry[- ]after[:= ]+(\d+)/i);
  const retryAfterSeconds = retryAfter ? Number(retryAfter[1]) : null;

  if (normalized.includes("429")) {
    return {
      errorType: "HTTP_429",
      retryAfterSeconds: retryAfterSeconds ?? 3600
    };
  }

  if (normalized.includes("503")) {
    return {
      errorType: "HTTP_503",
      retryAfterSeconds: retryAfterSeconds ?? 900
    };
  }

  return {
    errorType: "SYNC_ERROR",
    retryAfterSeconds
  };
};

const isDueForSync = (source: SourceRecord, nowIso: string) => {
  const nextCheckAt = source.nextCheckAt ?? null;
  return !nextCheckAt || nextCheckAt <= nowIso;
};

const runSyncAttempt = async (
  deps: CommonSyncDeps,
  source: SourceRecord,
  nowIso: string
): Promise<SyncAttempt> =>
  syncOneSource({
    ...deps,
    sourceId: source.id
  })
    .then((detail) => ({
      kind: "ok",
      detail
    }) as const)
    .catch(async (error: unknown) => {
      const message = toErrorMessage(error);
      const failureUpdate = resolveFailureStateUpdate(message);

      await Promise.resolve(
        deps.repository.updateSourceFailureState(
          source.id,
          nowIso,
          failureUpdate.errorType,
          failureUpdate.retryAfterSeconds
        )
      ).catch(() => undefined);

      return {
        kind: "failed",
        source,
        message
      } as const;
    });

const appendSyncAttempt = (
  aggregate: SyncAggregate,
  attempt: SyncAttempt
): SyncAggregate =>
  match(attempt)
    .with({ kind: "ok" }, ({ detail }) => ({
      ...aggregate,
      totalInserted: aggregate.totalInserted + detail.inserted,
      details: [...aggregate.details, detail]
    }))
    .with({ kind: "failed" }, ({ source, message }) => ({
      ...aggregate,
      failedSources: aggregate.failedSources + 1,
      details: [...aggregate.details, createFailedDetail(source, message)]
    }))
    .exhaustive();

export const syncAllSources = async (deps: CommonSyncDeps): Promise<SyncResult> => {
  const nowIso = resolveNow(deps.now)();
  const sources = await deps.repository.listSources();
  const dueSources = R.pipe(
    sources,
    R.filter((source) => isDueForSync(source, nowIso))
  );

  const attempts = await Promise.all(
    R.pipe(
      dueSources,
      R.map((source) => runSyncAttempt(deps, source, nowIso))
    )
  );

  const aggregate = R.pipe(
    attempts,
    R.reduce((accumulator, attempt) => appendSyncAttempt(accumulator, attempt), INITIAL_SYNC_AGGREGATE)
  );

  return {
    syncedSources: dueSources.length,
    failedSources: aggregate.failedSources,
    totalInserted: aggregate.totalInserted,
    details: aggregate.details
  };
};
