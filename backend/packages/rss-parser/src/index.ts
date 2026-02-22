import { ResultAsync, err, errAsync, ok, type Result } from "neverthrow";
import Parser from "rss-parser";
import * as R from "remeda";
import { match } from "ts-pattern";
import { z } from "zod";

import { discoverFeedCandidates } from "./discovery/index.js";
import { parseXMentionsFeed } from "./providers/x-mentions.js";
import type { XMentionsProviderConfig } from "./providers/x-mentions.js";

export const rssUrlSchema = z.string().url();

export type ParsedFeedItem = {
  guid: string;
  title: string;
  link: string;
  summary: string | null;
  publishedAt: string | null;
};

export type ParsedFeedResult = {
  title: string;
  url: string;
  feedUrl: string;
  discoveryStrategy: string;
  items: ParsedFeedItem[];
};

export type ParseFeedOptions = {
  xMentions?: Partial<XMentionsProviderConfig> & {
    token?: string;
  };
};

type CandidateFailure = {
  candidateFeedUrl: string;
  message: string;
};

type CandidateAttempt = () => Promise<Result<ParsedFeedResult, CandidateFailure>>;

const parser = new Parser();

const toSafeGuid = (link: string, title: string) => `${link}::${title}`;

const toErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

const isXMentionsCandidate = (candidateFeedUrl: string) => {
  try {
    return new URL(candidateFeedUrl).protocol === "x-mentions:";
  } catch (_error) {
    return false;
  }
};

const toCandidateFailure = (
  candidateFeedUrl: string,
  message: string
): CandidateFailure => ({
  candidateFeedUrl,
  message
});

const toCompactFailureMessage = (failures: CandidateFailure[]) =>
  R.pipe(
    failures,
    R.take(4),
    R.map((failure) => `${failure.candidateFeedUrl} => ${failure.message}`),
    R.join(" | ")
  );

const normalizeStandardItems = (
  items: Array<{
    guid?: string;
    title?: string;
    link?: string;
    contentSnippet?: string;
    content?: string;
    isoDate?: string;
    pubDate?: string;
  }>
): ParsedFeedItem[] =>
  R.pipe(
    items,
    R.map((item) => {
      const link = item.link ?? "";
      const title = item.title ?? "(제목 없음)";
      return {
        guid: item.guid ?? toSafeGuid(link, title),
        title,
        link,
        summary: item.contentSnippet ?? item.content ?? null,
        publishedAt: item.isoDate ?? item.pubDate ?? null
      };
    })
  );

const parseStandardCandidate = (
  candidateFeedUrl: string,
  strategyName: string
): ResultAsync<ParsedFeedResult, CandidateFailure> =>
  ResultAsync
    .fromPromise(parser.parseURL(candidateFeedUrl), (error) =>
      toCandidateFailure(candidateFeedUrl, toErrorMessage(error))
    )
    .map((parsed) => ({
      title: parsed.title ?? candidateFeedUrl,
      url: parsed.link ?? candidateFeedUrl,
      feedUrl: candidateFeedUrl,
      discoveryStrategy: strategyName,
      items: normalizeStandardItems((parsed.items ?? []) as Array<{
        guid?: string;
        title?: string;
        link?: string;
        contentSnippet?: string;
        content?: string;
        isoDate?: string;
        pubDate?: string;
      }>)
    }));

const parseXMentionsCandidate = (
  candidateFeedUrl: string,
  strategyName: string,
  options: ParseFeedOptions
): ResultAsync<ParsedFeedResult, CandidateFailure> => {
  const token = options.xMentions?.token?.trim() ?? "";
  if (!token) {
    return errAsync(
      toCandidateFailure(
        candidateFeedUrl,
        "X Mentions 전략 사용을 위해 X_BEARER_TOKEN 환경 변수가 필요합니다."
      )
    );
  }

  return ResultAsync
    .fromPromise(
      parseXMentionsFeed(candidateFeedUrl, {
        token,
        apiBaseUrl: options.xMentions?.apiBaseUrl,
        maxResults: options.xMentions?.maxResults,
        fetchImpl: options.xMentions?.fetchImpl,
        timeoutMs: options.xMentions?.timeoutMs
      }),
      (error) => toCandidateFailure(candidateFeedUrl, toErrorMessage(error))
    )
    .map((parsed) => ({
      title: parsed.title,
      url: parsed.url,
      feedUrl: parsed.feedUrl,
      discoveryStrategy: strategyName,
      items: parsed.items
    }));
};

const parseCandidate = (input: {
  candidateFeedUrl: string;
  strategyName: string;
  options: ParseFeedOptions;
}): ResultAsync<ParsedFeedResult, CandidateFailure> =>
  match(isXMentionsCandidate(input.candidateFeedUrl))
    .with(true, () =>
      parseXMentionsCandidate(input.candidateFeedUrl, input.strategyName, input.options)
    )
    .otherwise(() =>
      parseStandardCandidate(input.candidateFeedUrl, input.strategyName)
    );

const attemptFirstSuccess = async (attempts: CandidateAttempt[]) => {
  const failures: CandidateFailure[] = [];

  for (const attempt of attempts) {
    const result = await attempt();
    if (result.isOk()) {
      return ok(result.value);
    }
    failures.push(result.error);
  }

  return err(failures);
};

const toCandidateAttempt = (input: {
  candidateFeedUrl: string;
  strategyName: string;
  options: ParseFeedOptions;
}): CandidateAttempt => async () => parseCandidate(input);

const buildDiscoveryFailureError = (input: {
  strategyName: string;
  attempts: number;
  failures: CandidateFailure[];
}) => {
  const compactErrors = toCompactFailureMessage(input.failures);
  return new Error(
    `RSS 발견/파싱 실패 (strategy=${input.strategyName}, attempts=${input.attempts}): ${compactErrors}`
  );
};

export const parseFeed = async (
  url: string,
  options: ParseFeedOptions = {}
): Promise<ParsedFeedResult> => {
  const inputUrl = rssUrlSchema.parse(url);
  const discovery = await discoverFeedCandidates(inputUrl);
  const attempts = R.pipe(
    discovery.candidates,
    R.map((candidateFeedUrl) =>
      toCandidateAttempt({
        candidateFeedUrl,
        strategyName: discovery.strategyName,
        options
      })
    )
  );

  const result = await attemptFirstSuccess(attempts);
  if (result.isOk()) {
    return result.value;
  }

  throw buildDiscoveryFailureError({
    strategyName: discovery.strategyName,
    attempts: discovery.candidates.length,
    failures: result.error
  });
};
