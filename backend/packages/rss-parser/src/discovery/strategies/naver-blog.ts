import type { FeedDiscoveryStrategy } from "../types.js";
import { discoverFeedLinksFromHtml, uniqueUrls } from "../utils.js";

const extractNaverBlogId = (inputUrl: URL) => {
  const pathSegments = inputUrl.pathname.split("/").filter(Boolean);
  if (pathSegments[0]) {
    return pathSegments[0];
  }

  const blogIdFromQuery = inputUrl.searchParams.get("blogId");
  return blogIdFromQuery?.trim() || null;
};

const isNaverBlogHost = (host: string) =>
  host === "blog.naver.com" || host === "m.blog.naver.com";

export const naverBlogStrategy: FeedDiscoveryStrategy = {
  name: "naver-blog",
  matches: (inputUrl) => isNaverBlogHost(inputUrl.hostname.toLowerCase()),
  getCandidates: async (inputUrl) => {
    const blogId = extractNaverBlogId(inputUrl);
    const derivedFeedUrl = blogId
      ? `https://rss.blog.naver.com/${blogId}.xml`
      : null;
    const htmlCandidates = await discoverFeedLinksFromHtml(inputUrl);

    return uniqueUrls([derivedFeedUrl ?? "", ...htmlCandidates, inputUrl.toString()]);
  }
};
