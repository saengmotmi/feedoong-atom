import type { FeedDiscoveryStrategy } from "../types.js";
import { uniqueUrls } from "../utils.js";

const extractFeedTarget = (pathname: string) => {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return null;
  }

  if (segments[0] === "feed") {
    return null;
  }

  return segments[0];
};

export const mediumStrategy: FeedDiscoveryStrategy = {
  name: "medium",
  matches: (inputUrl) =>
    inputUrl.hostname.toLowerCase() === "medium.com" ||
    inputUrl.hostname.toLowerCase().endsWith(".medium.com"),
  getCandidates: async (inputUrl) => {
    const feedTarget = extractFeedTarget(inputUrl.pathname);
    const derivedFeedUrl = feedTarget
      ? `${inputUrl.origin}/feed/${feedTarget}`
      : null;

    return uniqueUrls([derivedFeedUrl ?? "", inputUrl.toString()]);
  }
};
