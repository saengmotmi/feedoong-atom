import type { FeedDiscoveryStrategy } from "../types.js";
import { discoverFeedLinksFromHtml, uniqueUrls } from "../utils.js";

const toYoutubeWatchlessUrl = (inputUrl: URL) => {
  if (inputUrl.hostname.toLowerCase() === "youtu.be") {
    const videoId = inputUrl.pathname.split("/").filter(Boolean)[0];
    if (!videoId) {
      return null;
    }
    return `https://www.youtube.com/watch?v=${videoId}`;
  }

  return null;
};

const extractChannelIdFromPath = (inputUrl: URL) => {
  const pathSegments = inputUrl.pathname.split("/").filter(Boolean);
  if (pathSegments[0] !== "channel" || !pathSegments[1]) {
    return null;
  }
  return pathSegments[1];
};

export const youtubeStrategy: FeedDiscoveryStrategy = {
  name: "youtube",
  matches: (inputUrl) => {
    const host = inputUrl.hostname.toLowerCase();
    return host === "youtube.com" || host.endsWith(".youtube.com") || host === "youtu.be";
  },
  getCandidates: async (inputUrl) => {
    const channelIdFromQuery = inputUrl.searchParams.get("channel_id");
    const channelIdFromPath = extractChannelIdFromPath(inputUrl);
    const channelId = channelIdFromQuery ?? channelIdFromPath;

    const directFeedUrl = channelId
      ? `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
      : null;

    const canonicalUrl = toYoutubeWatchlessUrl(inputUrl);
    const htmlDiscoveryTarget = new URL(canonicalUrl ?? inputUrl.toString());
    const htmlCandidates = await discoverFeedLinksFromHtml(htmlDiscoveryTarget);

    return uniqueUrls([inputUrl.toString(), directFeedUrl ?? "", ...htmlCandidates]);
  }
};
