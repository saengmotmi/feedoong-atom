import { ResultAsync } from "neverthrow";
import { match } from "ts-pattern";

import { DEFAULT_HEAD_TIMEOUT_MS, DEFAULT_HEAD_USER_AGENT } from "./constants.js";
import {
  createTimeoutSignal,
  isHttpFeedSource,
  normalizeHeaderValue,
  resolveFetch,
  resolveNow
} from "./runtime.js";
import type {
  CommonSyncDeps,
  HeadCheckResult,
  SourceRecord
} from "./types.js";

type HeadRuleState = {
  responseStatus: number;
  responseOk: boolean;
  hasValidators: boolean;
  unchanged: boolean;
  isInitial: boolean;
};

type HeadRuleInput = {
  source: SourceRecord;
  checkedAt: string;
  responseStatus: number;
  responseOk: boolean;
  headEtag: string | null;
  headLastModified: string | null;
};

const deriveNextValidators = (input: {
  source: SourceRecord;
  headEtag: string | null;
  headLastModified: string | null;
}) => ({
  headEtag: input.headEtag ?? input.source.lastHeadEtag ?? null,
  headLastModified: input.headLastModified ?? input.source.lastHeadLastModified ?? null
});

const toHeadRuleState = (input: HeadRuleInput): HeadRuleState => {
  const sameEtag = Boolean(
    input.headEtag &&
      input.source.lastHeadEtag &&
      input.headEtag === input.source.lastHeadEtag
  );
  const sameLastModified = Boolean(
    input.headLastModified &&
      input.source.lastHeadLastModified &&
      input.headLastModified === input.source.lastHeadLastModified
  );

  return {
    responseStatus: input.responseStatus,
    responseOk: input.responseOk,
    hasValidators: Boolean(input.headEtag || input.headLastModified),
    unchanged: sameEtag || sameLastModified,
    isInitial: !input.source.lastHeadEtag && !input.source.lastHeadLastModified
  };
};

const buildHeadCheckResult = (
  input: HeadRuleInput,
  shouldFetch: boolean,
  reason: string
): HeadCheckResult => {
  const nextValidators = deriveNextValidators(input);
  return {
    checkedAt: input.checkedAt,
    shouldFetch,
    reason,
    headEtag: nextValidators.headEtag,
    headLastModified: nextValidators.headLastModified
  };
};

const evaluateHeadRules = (input: HeadRuleInput): HeadCheckResult => {
  const state = toHeadRuleState(input);

  return match(state)
    .with({ responseStatus: 304 }, () =>
      buildHeadCheckResult(input, false, "head-304-not-modified")
    )
    .with({ responseOk: false }, ({ responseStatus }) =>
      buildHeadCheckResult(input, true, `head-status-${responseStatus}`)
    )
    .with({ hasValidators: false }, () =>
      buildHeadCheckResult(input, true, "head-missing-validators")
    )
    .with({ unchanged: true }, () =>
      buildHeadCheckResult(input, false, "head-unchanged")
    )
    .with({ isInitial: true }, () => buildHeadCheckResult(input, true, "head-initial"))
    .otherwise(() => buildHeadCheckResult(input, true, "head-changed"));
};

const createHeadRequestHeaders = (source: SourceRecord, userAgent: string) => {
  const headers = new Headers();
  headers.set("user-agent", userAgent);
  if (source.lastHeadEtag) {
    headers.set("if-none-match", source.lastHeadEtag);
  }
  if (source.lastHeadLastModified) {
    headers.set("if-modified-since", source.lastHeadLastModified);
  }
  return headers;
};

const buildHeadErrorFallback = (
  source: SourceRecord,
  checkedAt: string,
  reason: string
): HeadCheckResult => ({
  checkedAt,
  shouldFetch: true,
  reason,
  headEtag: source.lastHeadEtag ?? null,
  headLastModified: source.lastHeadLastModified ?? null
});

const buildNonHttpFallback = (
  source: SourceRecord,
  checkedAt: string
): HeadCheckResult => ({
  checkedAt,
  shouldFetch: true,
  reason: "non-http-source",
  headEtag: source.lastHeadEtag ?? null,
  headLastModified: source.lastHeadLastModified ?? null
});

export const checkSourceByHead = async (
  source: SourceRecord,
  deps: CommonSyncDeps
): Promise<HeadCheckResult> => {
  const checkedAt = resolveNow(deps.now)();

  if (!isHttpFeedSource(source.url)) {
    return buildNonHttpFallback(source, checkedAt);
  }

  const fetcher = resolveFetch(deps.fetchImpl);
  const userAgent = deps.headUserAgent ?? DEFAULT_HEAD_USER_AGENT;
  const timeoutMs = deps.headTimeoutMs ?? DEFAULT_HEAD_TIMEOUT_MS;
  const headers = createHeadRequestHeaders(source, userAgent);

  return ResultAsync
    .fromPromise(
      fetcher(source.url, {
        method: "HEAD",
        redirect: "follow",
        headers,
        signal: createTimeoutSignal(timeoutMs)
      }),
      () => "head-request-failed"
    )
    .map((response) =>
      evaluateHeadRules({
        source,
        checkedAt,
        responseStatus: response.status,
        responseOk: response.ok,
        headEtag: normalizeHeaderValue(response.headers.get("etag")),
        headLastModified: normalizeHeaderValue(response.headers.get("last-modified"))
      })
    )
    .match(
      (value) => value,
      (reason) => buildHeadErrorFallback(source, checkedAt, reason)
    );
};
