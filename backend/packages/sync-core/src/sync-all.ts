import * as R from "remeda";
import { ResultAsync } from "neverthrow";
import { match } from "ts-pattern";

import { INITIAL_SYNC_AGGREGATE } from "./constants.js";
import { createFailedDetail } from "./detail.js";
import { toErrorMessage } from "./runtime.js";
import { syncOneSource } from "./sync-one.js";
import type {
  CommonSyncDeps,
  SourceRecord,
  SyncAggregate,
  SyncAttempt,
  SyncResult
} from "./types.js";

const runSyncAttempt = async (
  deps: CommonSyncDeps,
  source: SourceRecord
): Promise<SyncAttempt> =>
  ResultAsync
    .fromPromise(
      syncOneSource({
        ...deps,
        sourceId: source.id
      }),
      toErrorMessage
    )
    .match(
      (detail) => ({
        kind: "ok",
        detail
      }),
      (message) => ({
        kind: "failed",
        source,
        message
      })
    );

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
  const sources = await deps.repository.listSources();
  const attempts = await Promise.all(
    R.pipe(
      sources,
      R.map((source) => runSyncAttempt(deps, source))
    )
  );

  const aggregate = R.pipe(
    attempts,
    R.reduce((accumulator, attempt) => appendSyncAttempt(accumulator, attempt), INITIAL_SYNC_AGGREGATE)
  );

  return {
    syncedSources: sources.length,
    failedSources: aggregate.failedSources,
    totalInserted: aggregate.totalInserted,
    details: aggregate.details
  };
};
