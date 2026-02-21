import type { FeedDiscoveryStrategy } from "../types.js";
import { uniqueUrls } from "../utils.js";

export const tistoryStrategy: FeedDiscoveryStrategy = {
  name: "tistory",
  matches: (inputUrl) => /(^|\.)(tistory\.com)$/i.test(inputUrl.hostname),
  getCandidates: async (inputUrl) =>
    uniqueUrls([inputUrl.toString(), `${inputUrl.origin}/rss`])
};
