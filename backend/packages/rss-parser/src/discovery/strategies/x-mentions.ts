import type { FeedDiscoveryStrategy } from "../types.js";

const RESERVED_PATHS = new Set([
  "",
  "home",
  "explore",
  "search",
  "notifications",
  "messages",
  "i",
  "settings",
  "compose",
  "login",
  "signup",
  "tos",
  "privacy",
  "about",
  "intent",
  "hashtag"
]);

const USERNAME_PATTERN = /^[A-Za-z0-9_]{1,15}$/;

const normalizeUsername = (raw: string) => {
  const trimmed = raw.replace(/^@+/, "").trim();
  if (!trimmed) {
    return null;
  }

  const decoded = decodeURIComponent(trimmed);
  return USERNAME_PATTERN.test(decoded) ? decoded.toLowerCase() : null;
};

const extractUsernameFromPath = (inputUrl: URL) => {
  const pathSegments = inputUrl.pathname.split("/").filter(Boolean);
  if (pathSegments.length === 0) {
    return null;
  }

  const first = pathSegments[0]?.toLowerCase() ?? "";
  if (RESERVED_PATHS.has(first)) {
    return null;
  }

  const username = normalizeUsername(pathSegments[0] ?? "");
  if (!username) {
    return null;
  }

  if (pathSegments[1] && pathSegments[1].toLowerCase() !== "status") {
    return null;
  }

  return username;
};

export const xMentionsStrategy: FeedDiscoveryStrategy = {
  name: "x-mentions",
  includeDefaultFallback: false,
  matches: (inputUrl) => {
    const host = inputUrl.hostname.toLowerCase();
    return (
      host === "x.com" ||
      host.endsWith(".x.com") ||
      host === "twitter.com" ||
      host.endsWith(".twitter.com")
    );
  },
  getCandidates: async (inputUrl) => {
    const username = extractUsernameFromPath(inputUrl);
    if (!username) {
      return [];
    }

    return [`x-mentions://mentions/${encodeURIComponent(username)}`];
  }
};
