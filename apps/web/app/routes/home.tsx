import { data, redirect } from "react-router";

import type { Route } from "./+types/home";

type Source = {
  id: number;
  url: string;
  title: string;
  lastSyncedAt: string | null;
  createdAt: string;
};

type FeedItem = {
  id: number;
  sourceId: number;
  sourceTitle: string;
  title: string;
  link: string;
  summary: string | null;
  publishedAt: string | null;
  createdAt: string;
};

type ApiServiceBinding = {
  fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
};

type RouteContextWithApiService = {
  apiService?: ApiServiceBinding;
};

type GlobalWithApiService = typeof globalThis & {
  __FEEDOONG_API_SERVICE?: ApiServiceBinding;
};

const DEFAULT_CACHE_TTL_SECONDS = 60;
const DEFAULT_STALE_SECONDS = 300;
const SERVICE_BINDING_BASE_URL = "http://api.internal";

const buildCacheControl = (ttlSeconds: number) =>
  `public, max-age=0, s-maxage=${ttlSeconds}, stale-while-revalidate=${DEFAULT_STALE_SECONDS}`;

const makeApiUrl = (baseUrl: string, path: string) => `${baseUrl}${path}`;

const fetchJson = async <T,>(
  url: string,
  init?: RequestInit,
  cacheTtlSeconds?: number,
  fetchImpl: typeof fetch = fetch
): Promise<T> => {
  const requestInit: RequestInit & { cf?: Record<string, unknown> } = {
    ...init
  };

  if (cacheTtlSeconds && (!init?.method || init.method === "GET")) {
    requestInit.cf = {
      cacheEverything: true,
      cacheTtl: cacheTtlSeconds
    };
  }

  const response = await fetchImpl(url, requestInit);

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `API request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
};

const getApiServiceBinding = (context: unknown): ApiServiceBinding | null => {
  const globalApiService =
    (globalThis as GlobalWithApiService).__FEEDOONG_API_SERVICE ?? null;
  if (globalApiService) {
    return globalApiService;
  }

  const routeContext = context as RouteContextWithApiService;
  return routeContext.apiService ?? null;
};

const parseStatusLabel = (status: string | null) => {
  switch (status) {
    case "source-added":
      return "RSS 소스를 등록했습니다.";
    case "synced":
      return "동기화를 완료했습니다.";
    case "source-error":
      return "RSS 등록에 실패했습니다.";
    case "sync-error":
      return "동기화에 실패했습니다.";
    default:
      return null;
  }
};

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, " ");

const toSummary = (value: string | null) => {
  if (!value) {
    return "요약이 아직 없습니다.";
  }

  const text = stripHtml(value).replace(/\s+/g, " ").trim();
  if (!text) {
    return "요약이 아직 없습니다.";
  }

  if (text.length <= 140) {
    return text;
  }

  return `${text.slice(0, 140)}…`;
};

const formatPublishedLabel = (publishedAt: string | null) => {
  if (!publishedAt) {
    return "발행일 없음";
  }

  return new Date(publishedAt).toLocaleDateString("ko-KR", {
    month: "2-digit",
    day: "2-digit"
  });
};

const getHostLabel = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch (_error) {
    return "원문";
  }
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Feedoong Atom | RSC" },
    { name: "description", content: "Cloudflare Edge에서 캐시되는 개인 RSS 피드" }
  ];
}

export async function loader({ context, request }: Route.LoaderArgs) {
  const apiService = getApiServiceBinding(context);
  const apiBaseUrl = apiService
    ? SERVICE_BINDING_BASE_URL
    : process.env.API_BASE_URL ?? "http://localhost:4000";
  const apiFetch = apiService?.fetch.bind(apiService) ?? fetch;
  const ttlSeconds = Number(
    process.env.CACHE_TTL_SECONDS ?? DEFAULT_CACHE_TTL_SECONDS
  );

  const requestUrl = new URL(request.url);
  const status = parseStatusLabel(requestUrl.searchParams.get("status"));

  try {
    const [sourcesResult, itemsResult] = await Promise.all([
      fetchJson<{ sources: Source[] }>(
        makeApiUrl(apiBaseUrl, "/v1/sources"),
        undefined,
        ttlSeconds,
        apiFetch
      ),
      fetchJson<{ items: FeedItem[] }>(
        makeApiUrl(apiBaseUrl, "/v1/items?limit=100&offset=0"),
        undefined,
        ttlSeconds,
        apiFetch
      )
    ]);

    return data(
      {
        sources: sourcesResult.sources,
        items: itemsResult.items,
        status,
        error: null
      },
      {
        headers: {
          "Cache-Control": buildCacheControl(ttlSeconds),
          "Cache-Tag": "feedoong,feedoong-dashboard"
        }
      }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "피드를 가져오지 못했습니다.";

    return data(
      {
        sources: [] as Source[],
        items: [] as FeedItem[],
        status,
        error: errorMessage
      },
      {
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  }
}

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const apiService = getApiServiceBinding(context);
  const apiBaseUrl = apiService
    ? SERVICE_BINDING_BASE_URL
    : process.env.API_BASE_URL ?? "http://localhost:4000";
  const apiFetch = apiService?.fetch.bind(apiService) ?? fetch;

  if (intent === "add-source") {
    const url = String(formData.get("url") ?? "").trim();
    if (!url) {
      return redirect("/?status=source-error");
    }

    try {
      await fetchJson(makeApiUrl(apiBaseUrl, "/v1/sources"), {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({ url })
      }, undefined, apiFetch);
      return redirect("/?status=source-added");
    } catch (_error) {
      return redirect("/?status=source-error");
    }
  }

  if (intent === "sync") {
    try {
      await fetchJson(makeApiUrl(apiBaseUrl, "/v1/sync"), {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: "{}"
      }, undefined, apiFetch);
      return redirect("/?status=synced");
    } catch (_error) {
      return redirect("/?status=sync-error");
    }
  }

  return redirect("/");
}

export async function ServerComponent({ loaderData }: Route.ComponentProps) {
  const { sources, items, status, error } = loaderData;

  return (
    <main className="feed-page">
      <header className="topbar">
        <div className="brand">
          <span className="brand-dot" aria-hidden />
          <strong className="brand-title">Feedoong</strong>
        </div>
        <form method="post" className="sync-form">
          <input type="hidden" name="intent" value="sync" />
          <button type="submit">피드 새로고침</button>
        </form>
      </header>

      <section className="composer">
        <form method="post" className="add-source-form">
          <input type="hidden" name="intent" value="add-source" />
          <label htmlFor="source-url-input" className="sr-only">
            RSS URL
          </label>
          <div className="add-source-shell">
            <input
              id="source-url-input"
              name="url"
              type="url"
              placeholder="URL을 추가해서 피드로 모아보세요!"
              required
            />
            <button type="submit" className="add-source-button" aria-label="RSS 소스 등록">
              +
            </button>
          </div>
        </form>

        <div className="feed-tabs" role="tablist" aria-label="피드 탭">
          <button type="button" role="tab" aria-selected className="chip active">
            내 피드
          </button>
          <button type="button" role="tab" aria-selected={false} className="chip">
            둘러보기
          </button>
        </div>

        <p className="stats">등록 소스 {sources.length}개 · 로드된 아이템 {items.length}개</p>
        {status ? <p className="hint">{status}</p> : null}
        {error ? <p className="error">{error}</p> : null}
      </section>

      <section className="feed-list" aria-label="최신 아이템">
        <ul className="feed-items">
          {items.length > 0
            ? items.map((item) => (
                <li key={item.id} className="feed-card">
                  <div className="feed-content">
                    <a href={item.link} target="_blank" rel="noreferrer" className="feed-title">
                      {item.title || "제목 없음"}
                    </a>
                    <p className="feed-summary">{toSummary(item.summary)}</p>
                    <p className="feed-meta-line">
                      <span>{item.sourceTitle}</span>
                      <span>{formatPublishedLabel(item.publishedAt)}</span>
                      <span>{getHostLabel(item.link)}</span>
                    </p>
                  </div>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="feed-thumb"
                    aria-label={`${item.title || "아이템"} 열기`}
                  >
                    열기
                  </a>
                </li>
              ))
            : Array.from({ length: 5 }).map((_, index) => (
                <li key={`skeleton-${index}`} className="feed-card skeleton">
                  <div className="feed-content">
                    <div className="sk-bar sk-title" />
                    <div className="sk-bar sk-summary" />
                    <div className="sk-row">
                      <div className="sk-dot" />
                      <div className="sk-chip" />
                      <div className="sk-chip" />
                    </div>
                  </div>
                  <div className="feed-thumb sk-thumb" />
                </li>
              ))}
        </ul>
      </section>
    </main>
  );
}
