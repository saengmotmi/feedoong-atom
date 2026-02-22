const FEED_SUFFIX_PATTERN =
  /(\/(feed|rss)(\/|$)|\/atom\.xml$|\/index\.xml$|\/feeds\/|\.xml($|\?))/i;

const HTML_FEED_LINK_PATTERNS = [
  /<link[^>]*type=["']application\/(?:rss|atom)\+xml["'][^>]*href=["']([^"']+)["'][^>]*>/gi,
  /<link[^>]*href=["']([^"']+)["'][^>]*type=["']application\/(?:rss|atom)\+xml["'][^>]*>/gi,
  /<link[^>]*rel=["'][^"']*alternate[^"']*["'][^>]*href=["']([^"']+)["'][^>]*>/gi
];

const FEED_HINT_PATTERN = /(feed|rss|atom|xml)/i;

export const isHttpUrl = (value: string) => {
  try {
    const url = new URL(value);
    return (
      url.protocol === "http:" ||
      url.protocol === "https:" ||
      url.protocol === "x-mentions:"
    );
  } catch (_error) {
    return false;
  }
};

export const isLikelyFeedUrl = (inputUrl: URL) =>
  FEED_SUFFIX_PATTERN.test(inputUrl.pathname) || /rss|atom/i.test(inputUrl.search);

export const uniqueUrls = (urls: string[]) => {
  const visited = new Set<string>();
  const result: string[] = [];

  for (const rawUrl of urls) {
    if (!isHttpUrl(rawUrl)) {
      continue;
    }

    const normalized = new URL(rawUrl).toString();
    if (visited.has(normalized)) {
      continue;
    }
    visited.add(normalized);
    result.push(normalized);
  }

  return result;
};

export const buildRootFeedCandidates = (inputUrl: URL) => {
  const origin = `${inputUrl.protocol}//${inputUrl.host}`;
  return uniqueUrls([
    `${origin}/feed`,
    `${origin}/rss`,
    `${origin}/atom.xml`,
    `${origin}/index.xml`
  ]);
};

export const discoverFeedLinksFromHtml = async (inputUrl: URL) => {
  if (isLikelyFeedUrl(inputUrl)) {
    return [];
  }

  let response: Response;
  try {
    response = await fetch(inputUrl.toString(), {
      redirect: "follow",
      signal: AbortSignal.timeout(7000),
      headers: {
        "user-agent": "FeedoongBot/0.2 (+local)"
      }
    });
  } catch (_error) {
    return [];
  }

  if (!response.ok) {
    return [];
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) {
    return [];
  }

  let html = "";
  try {
    html = await response.text();
  } catch (_error) {
    return [];
  }

  const discovered: string[] = [];
  for (const pattern of HTML_FEED_LINK_PATTERNS) {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(html)) !== null) {
      const href = match[1]?.trim();
      if (!href) {
        continue;
      }
      if (!FEED_HINT_PATTERN.test(href) && !href.includes("application/rss+xml")) {
        continue;
      }
      try {
        discovered.push(new URL(href, response.url).toString());
      } catch (_error) {
        continue;
      }
    }
  }

  return uniqueUrls(discovered);
};
