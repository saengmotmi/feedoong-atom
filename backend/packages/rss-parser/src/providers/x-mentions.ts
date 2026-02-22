import type { ParsedFeedItem } from "../index.js";

const DEFAULT_X_API_BASE = "https://api.x.com/2";
const DEFAULT_MAX_RESULTS = 100;
const MAX_ALLOWED_RESULTS = 100;

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

const asGlobal = () =>
  globalThis as typeof globalThis & {
    __FEEDOONG_X_BEARER_TOKEN?: string;
    __FEEDOONG_X_API_BASE_URL?: string;
    __FEEDOONG_X_MENTIONS_MAX_RESULTS?: string | number;
  };

const getFromProcess = (key: string) => {
  if (typeof process === "undefined" || !("env" in process)) {
    return undefined;
  }
  return process.env?.[key];
};

const getXBearerToken = () => {
  const globalValue = asGlobal().__FEEDOONG_X_BEARER_TOKEN;
  const processValue = getFromProcess("X_BEARER_TOKEN");
  return (globalValue ?? processValue ?? "").trim();
};

const getXApiBaseUrl = () => {
  const globalValue = asGlobal().__FEEDOONG_X_API_BASE_URL;
  const processValue = getFromProcess("X_API_BASE_URL");
  return (globalValue ?? processValue ?? DEFAULT_X_API_BASE).replace(/\/$/, "");
};

const getMaxResults = () => {
  const globalValue = asGlobal().__FEEDOONG_X_MENTIONS_MAX_RESULTS;
  const processValue = getFromProcess("X_MENTIONS_MAX_RESULTS");
  const raw = globalValue ?? processValue ?? DEFAULT_MAX_RESULTS;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_MAX_RESULTS;
  }
  return Math.min(MAX_ALLOWED_RESULTS, Math.floor(parsed));
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
  username: string
): Promise<XUser> => {
  const userLookupQuery = toQueryString({
    "user.fields": "username,name"
  });
  const userLookupUrl =
    `${baseUrl}/users/by/username/${encodeURIComponent(username)}?${userLookupQuery}`;
  const response = await fetch(userLookupUrl, {
    headers: buildAuthHeaders(token),
    signal: AbortSignal.timeout(10_000)
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

export const parseXMentionsFeed = async (candidateUrl: string) => {
  const token = getXBearerToken();
  if (!token) {
    throw new Error(
      "X Mentions 전략 사용을 위해 X_BEARER_TOKEN 환경 변수가 필요합니다."
    );
  }

  const targetUsername = parseUsernameFromCandidateUrl(candidateUrl);
  if (!targetUsername) {
    throw new Error("x-mentions URL에서 username을 추출할 수 없습니다.");
  }

  const baseUrl = getXApiBaseUrl();
  const targetUser = await resolveTargetUser(baseUrl, token, targetUsername);
  const mentionsQuery = toQueryString({
    max_results: getMaxResults(),
    "tweet.fields": "created_at,author_id,referenced_tweets,entities",
    expansions: "author_id",
    "user.fields": "username,name"
  });
  const mentionsUrl = `${baseUrl}/users/${targetUser.id}/mentions?${mentionsQuery}`;

  const mentionsResponse = await fetch(mentionsUrl, {
    headers: buildAuthHeaders(token),
    signal: AbortSignal.timeout(10_000)
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
