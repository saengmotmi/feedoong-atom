import type { FeedDiscoveryStrategy } from "../types.js";
import { uniqueUrls } from "../utils.js";

const extractVelogUsername = (inputUrl: URL) => {
  const match = inputUrl.pathname.match(/^\/@([^/?#]+)/);
  return match?.[1] ?? null;
};

export const velogStrategy: FeedDiscoveryStrategy = {
  name: "velog",
  matches: (inputUrl) => /(^|\.)(velog\.io)$/i.test(inputUrl.hostname),
  getCandidates: async (inputUrl) => {
    const username = extractVelogUsername(inputUrl);
    const derivedRssUrl = username ? `https://v2.velog.io/rss/${username}` : null;

    return uniqueUrls([inputUrl.toString(), derivedRssUrl ?? ""]);
  }
};
