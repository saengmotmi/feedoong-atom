import type { FeedDiscoveryStrategy } from "../types.js";
import { discoverFeedLinksFromHtml, uniqueUrls } from "../utils.js";

export const brunchStrategy: FeedDiscoveryStrategy = {
  name: "brunch",
  matches: (inputUrl) => inputUrl.hostname.toLowerCase() === "brunch.co.kr",
  getCandidates: async (inputUrl) => {
    const htmlCandidates = await discoverFeedLinksFromHtml(inputUrl);
    return uniqueUrls([...htmlCandidates, inputUrl.toString()]);
  }
};
