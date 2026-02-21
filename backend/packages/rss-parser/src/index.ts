import Parser from "rss-parser";
import { z } from "zod";

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
  items: ParsedFeedItem[];
};

const parser = new Parser();

const toSafeGuid = (link: string, title: string) => `${link}::${title}`;

export const parseFeed = async (url: string): Promise<ParsedFeedResult> => {
  const feedUrl = rssUrlSchema.parse(url);
  const parsed = await parser.parseURL(feedUrl);

  return {
    title: parsed.title ?? feedUrl,
    url: parsed.link ?? feedUrl,
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
};
