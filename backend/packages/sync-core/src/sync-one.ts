import { ResultAsync } from "neverthrow";

import { checkSourceByHead } from "./head-check.js";
import { createOkDetail, createSkippedDetail, normalizeSyncItems } from "./detail.js";
import { resolveNow, toErrorMessage } from "./runtime.js";
import type { SourceRecord, SyncDetail, SyncOneSourceDeps } from "./types.js";

const runSyncFetchStage = (
  deps: SyncOneSourceDeps,
  source: SourceRecord,
  headCheck: {
    checkedAt: string;
    headEtag: string | null;
    headLastModified: string | null;
    reason: string;
  }
) => {
  const syncedAt = resolveNow(deps.now)();

  return ResultAsync
    .fromPromise(Promise.resolve(deps.parseFeed(source.url)), toErrorMessage)
    .map((parsed) => ({
      parsed,
      normalizedItems: normalizeSyncItems(parsed.items)
    }))
    .andThen(({ parsed, normalizedItems }) =>
      ResultAsync.fromPromise(
        Promise.all([
          deps.repository.insertItems(source.id, normalizedItems),
          deps.repository.updateSourceMetadata(source.id, parsed.title, syncedAt, {
            checkedAt: headCheck.checkedAt,
            headEtag: headCheck.headEtag,
            headLastModified: headCheck.headLastModified
          })
        ]),
        toErrorMessage
      ).map(([inserted]) =>
        createOkDetail({
          source,
          parsed,
          inserted,
          headReason: headCheck.reason
        })
      )
    );
};

export const syncOneSource = async (deps: SyncOneSourceDeps): Promise<SyncDetail> => {
  const source = await deps.repository.getSourceById(deps.sourceId);
  if (!source) {
    throw new Error(`Source not found: ${deps.sourceId}`);
  }

  const headCheck = await checkSourceByHead(source, deps);
  if (!headCheck.shouldFetch) {
    await deps.repository.updateSourceCheckMetadata(
      source.id,
      headCheck.checkedAt,
      headCheck.headEtag,
      headCheck.headLastModified
    );
    return createSkippedDetail(source, headCheck);
  }

  const syncResult = await runSyncFetchStage(deps, source, headCheck);
  if (syncResult.isErr()) {
    throw new Error(syncResult.error);
  }
  return syncResult.value;
};
