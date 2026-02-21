import type { FeedDiscoveryStrategy } from "../types.js";
import { discoverFeedLinksFromHtml, uniqueUrls } from "../utils.js";

const isBlogPath = (pathname: string) => pathname.includes("/blog/");

export const chromeDevStrategy: FeedDiscoveryStrategy = {
  name: "chrome-dev",
  matches: (inputUrl) => inputUrl.hostname.toLowerCase() === "developer.chrome.com",
  getCandidates: async (inputUrl) => {
    const origin = `${inputUrl.protocol}//${inputUrl.host}`;
    const staticBlogFeedUrl = `${origin}/static/blog/feed.xml`;
    const legacyBlogFeedUrl = `${origin}/feeds/blog.xml`;
    const legacyAllFeedUrl = `${origin}/feeds/all.xml`;
    const htmlCandidates = await discoverFeedLinksFromHtml(inputUrl);

    const prioritizedFeedCandidates = isBlogPath(inputUrl.pathname)
      ? [staticBlogFeedUrl, legacyBlogFeedUrl, legacyAllFeedUrl]
      : [staticBlogFeedUrl, legacyAllFeedUrl, legacyBlogFeedUrl];

    return uniqueUrls([
      ...prioritizedFeedCandidates,
      ...htmlCandidates,
      inputUrl.toString()
    ]);
  }
};
