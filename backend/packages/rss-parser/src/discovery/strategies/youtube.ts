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

const extractHandleFromPath = (inputUrl: URL) => {
  const pathSegments = inputUrl.pathname.split("/").filter(Boolean);
  const maybeHandle = pathSegments[0];
  if (!maybeHandle || !maybeHandle.startsWith("@")) {
    return null;
  }

  const handle = maybeHandle.slice(1).trim();
  return handle.length > 0 ? handle : null;
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
    const handle = extractHandleFromPath(inputUrl);

    const directFeedUrl = channelId
      ? `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
      : null;
    const userFeedUrl = handle
      ? `https://www.youtube.com/feeds/videos.xml?user=${encodeURIComponent(handle)}`
      : null;

    const canonicalUrl = toYoutubeWatchlessUrl(inputUrl);
    const canonicalInputUrl = new URL(canonicalUrl ?? inputUrl.toString());
    const handleVideosUrl = handle
      ? `https://www.youtube.com/@${encodeURIComponent(handle)}/videos`
      : null;
    const htmlDiscoveryTargets = uniqueUrls([
      canonicalInputUrl.toString(),
      handleVideosUrl ?? ""
    ]);
    const htmlCandidateMatrix = await Promise.all(
      htmlDiscoveryTargets.map((targetUrl) =>
        discoverFeedLinksFromHtml(new URL(targetUrl))
      )
    );
    const htmlCandidates = htmlCandidateMatrix.flat();

    return uniqueUrls([
      directFeedUrl ?? "",
      userFeedUrl ?? "",
      ...htmlCandidates,
      canonicalInputUrl.toString(),
      inputUrl.toString()
    ]);
  }
};
