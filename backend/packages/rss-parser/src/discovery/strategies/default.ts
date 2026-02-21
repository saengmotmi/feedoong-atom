import type { FeedDiscoveryStrategy } from "../types.js";
import {
  buildRootFeedCandidates,
  discoverFeedLinksFromHtml,
  isLikelyFeedUrl,
  uniqueUrls
} from "../utils.js";

export const defaultStrategy: FeedDiscoveryStrategy = {
  name: "default",
  matches: () => true,
  getCandidates: async (inputUrl) => {
    if (isLikelyFeedUrl(inputUrl)) {
      return [inputUrl.toString()];
    }

    const rootCandidates = buildRootFeedCandidates(inputUrl);
    const htmlCandidates = await discoverFeedLinksFromHtml(inputUrl);

    return uniqueUrls([inputUrl.toString(), ...htmlCandidates, ...rootCandidates]);
  }
};
