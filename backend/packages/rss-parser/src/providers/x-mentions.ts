import type { ParsedFeedItem } from "../index.js";

const DEFAULT_X_API_BASE = "https://api.x.com/2";
const DEFAULT_MAX_RESULTS = 100;
const MAX_ALLOWED_RESULTS = 100;
const DEFAULT_TIMEOUT_MS = 10_000;

type XUser = {
  id: string;
  username: string;
  name?: string;
};

type XMentionTweet = {
  id: string;
  text?: string;
  created_at?: string;
  author_id?: string;
  referenced_tweets?: Array<{
    id: string;
    type: string;
  }>;
  entities?: {
    mentions?: Array<{
      username?: string;
      id?: string;
    }>;
  };
};

type XUserLookupResponse = {
  data?: XUser;
  errors?: Array<{
    title?: string;
    detail?: string;
  }>;
};

type XMentionsResponse = {
  data?: XMentionTweet[];
  includes?: {
    users?: XUser[];
  };
  errors?: Array<{
    title?: string;
    detail?: string;
  }>;
};

export type XMentionsProviderConfig = {
  token: string;
  apiBaseUrl?: string;
  maxResults?: number | string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
};

const parseUsernameFromCandidateUrl = (candidateUrl: string) => {
  const parsed = new URL(candidateUrl);
  if (parsed.protocol !== "x-mentions:") {
    return null;
  }

  const pathSegments = parsed.pathname.split("/").filter(Boolean);
  if (!pathSegments[0]) {
    return null;
  }

  const username = decodeURIComponent(pathSegments[0]).replace(/^@+/, "").trim();
  return username.length > 0 ? username.toLowerCase() : null;
};

const buildAuthHeaders = (token: string) => ({
  authorization: `Bearer ${token}`,
  "content-type": "application/json"
});

const toQueryString = (params: Record<string, string | number | undefined>) => {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }
    searchParams.set(key, String(value));
  }
  return searchParams.toString();
};

const resolveFetch = (fetchImpl?: typeof fetch) => {
  if (fetchImpl) {
    return fetchImpl;
  }
  if (typeof fetch !== "function") {
    throw new Error("fetch is not available in the current runtime");
  }
  return fetch;
};

const createTimeoutSignal = (timeoutMs: number): AbortSignal => {
  if (typeof AbortSignal.timeout === "function") {
    return AbortSignal.timeout(timeoutMs);
  }

  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller.signal;
};

const normalizeMaxResults = (value: number | string | undefined) => {
  const parsed = Number(value ?? DEFAULT_MAX_RESULTS);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_MAX_RESULTS;
  }
  return Math.min(MAX_ALLOWED_RESULTS, Math.floor(parsed));
};

const readJsonOrThrow = async <T>(response: Response): Promise<T> => {
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${text.slice(0, 180)}`.trim());
  }

  try {
    return JSON.parse(text) as T;
  } catch (_error) {
    throw new Error("X API JSON 파싱 실패");
  }
};

const resolveTargetUser = async (
  baseUrl: string,
  token: string,
  username: string,
  fetcher: typeof fetch,
  timeoutMs: number
): Promise<XUser> => {
  const userLookupQuery = toQueryString({
    "user.fields": "username,name"
  });
  const userLookupUrl =
    `${baseUrl}/users/by/username/${encodeURIComponent(username)}?${userLookupQuery}`;
  const response = await fetcher(userLookupUrl, {
    headers: buildAuthHeaders(token),
    signal: createTimeoutSignal(timeoutMs)
  });
  const payload = await readJsonOrThrow<XUserLookupResponse>(response);
  if (!payload.data) {
    const reason = payload.errors?.[0]?.detail ?? payload.errors?.[0]?.title ?? "사용자 조회 실패";
    throw new Error(reason);
  }
  return payload.data;
};

const isRetweet = (tweet: XMentionTweet) =>
  (tweet.referenced_tweets ?? []).some((value) => value.type === "retweeted");

const isReply = (tweet: XMentionTweet) =>
  (tweet.referenced_tweets ?? []).some((value) => value.type === "replied_to");

const isMentioningTarget = (tweet: XMentionTweet, targetUsername: string) =>
  (tweet.entities?.mentions ?? []).some(
    (mention) => mention.username?.toLowerCase() === targetUsername.toLowerCase()
  );

const buildItemTitle = (text: string) => {
  const compact = text.replace(/\s+/g, " ").trim();
  if (compact.length === 0) {
    return "(제목 없음)";
  }
  return compact.length > 84 ? `${compact.slice(0, 84)}…` : compact;
};

const buildItems = (
  tweets: XMentionTweet[],
  usersById: Map<string, XUser>,
  targetUserId: string,
  targetUsername: string
): ParsedFeedItem[] =>
  tweets
    .filter((tweet) => Boolean(tweet.id))
    .filter((tweet) => !isRetweet(tweet))
    .filter((tweet) => !isReply(tweet))
    .filter((tweet) => tweet.author_id !== targetUserId)
    .filter((tweet) => isMentioningTarget(tweet, targetUsername))
    .map((tweet) => {
      const author = tweet.author_id ? usersById.get(tweet.author_id) : undefined;
      const authorUsername = author?.username ?? targetUsername;
      const text = tweet.text ?? "";
      const title = buildItemTitle(text);
      return {
        guid: tweet.id,
        title,
        link: `https://x.com/${encodeURIComponent(authorUsername)}/status/${tweet.id}`,
        summary: text.trim().length > 0 ? text : null,
        publishedAt: tweet.created_at ?? null
      };
    });

export const parseXMentionsFeed = async (
  candidateUrl: string,
  config: XMentionsProviderConfig
) => {
  const token = config.token.trim();
  if (!token) {
    throw new Error(
      "X Mentions 전략 사용을 위해 X_BEARER_TOKEN 환경 변수가 필요합니다."
    );
  }

  const targetUsername = parseUsernameFromCandidateUrl(candidateUrl);
  if (!targetUsername) {
    throw new Error("x-mentions URL에서 username을 추출할 수 없습니다.");
  }

  const timeoutMs = config.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const fetcher = resolveFetch(config.fetchImpl);
  const baseUrl = (config.apiBaseUrl ?? DEFAULT_X_API_BASE).replace(/\/$/, "");
  const targetUser = await resolveTargetUser(baseUrl, token, targetUsername, fetcher, timeoutMs);
  const mentionsQuery = toQueryString({
    max_results: normalizeMaxResults(config.maxResults),
    "tweet.fields": "created_at,author_id,referenced_tweets,entities",
    expansions: "author_id",
    "user.fields": "username,name"
  });
  const mentionsUrl = `${baseUrl}/users/${targetUser.id}/mentions?${mentionsQuery}`;

  const mentionsResponse = await fetcher(mentionsUrl, {
    headers: buildAuthHeaders(token),
    signal: createTimeoutSignal(timeoutMs)
  });
  const mentionsPayload = await readJsonOrThrow<XMentionsResponse>(mentionsResponse);
  const usersById = new Map(
    (mentionsPayload.includes?.users ?? []).map((user) => [user.id, user])
  );
  const items = buildItems(
    mentionsPayload.data ?? [],
    usersById,
    targetUser.id,
    targetUser.username
  );

  return {
    title: `X Mentions @${targetUser.username}`,
    url: `https://x.com/${targetUser.username}`,
    feedUrl: candidateUrl,
    items
  };
};
