import Parser from "rss-parser";
import { z } from "zod";

import { discoverFeedCandidates } from "./discovery/index.js";
import { parseXMentionsFeed } from "./providers/x-mentions.js";

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

const parser = new Parser();

const toSafeGuid = (link: string, title: string) => `${link}::${title}`;

const isXMentionsCandidate = (candidateFeedUrl: string) => {
  try {
    return new URL(candidateFeedUrl).protocol === "x-mentions:";
  } catch (_error) {
    return false;
  }
};

export const parseFeed = async (url: string): Promise<ParsedFeedResult> => {
  const inputUrl = rssUrlSchema.parse(url);
  const discovery = await discoverFeedCandidates(inputUrl);
  const errors: string[] = [];

  for (const candidateFeedUrl of discovery.candidates) {
    try {
      if (isXMentionsCandidate(candidateFeedUrl)) {
        const parsed = await parseXMentionsFeed(candidateFeedUrl);
        return {
          title: parsed.title,
          url: parsed.url,
          feedUrl: parsed.feedUrl,
          discoveryStrategy: discovery.strategyName,
          items: parsed.items
        };
      }

      const parsed = await parser.parseURL(candidateFeedUrl);

      return {
        title: parsed.title ?? candidateFeedUrl,
        url: parsed.link ?? candidateFeedUrl,
        feedUrl: candidateFeedUrl,
        discoveryStrategy: discovery.strategyName,
        items: (parsed.items ?? []).map((item) => {
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
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`${candidateFeedUrl} => ${message}`);
    }
  }

  const compactErrors = errors.slice(0, 4).join(" | ");
  throw new Error(
    `RSS 발견/파싱 실패 (strategy=${discovery.strategyName}, attempts=${discovery.candidates.length}): ${compactErrors}`
  );
};
