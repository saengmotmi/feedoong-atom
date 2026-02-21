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

const DEFAULT_CACHE_TTL_SECONDS = 60;
const DEFAULT_STALE_SECONDS = 300;

const buildCacheControl = (ttlSeconds: number) =>
  `public, max-age=0, s-maxage=${ttlSeconds}, stale-while-revalidate=${DEFAULT_STALE_SECONDS}`;

const makeApiUrl = (baseUrl: string, path: string) => `${baseUrl}${path}`;

const fetchJson = async <T,>(
  url: string,
  init?: RequestInit,
  cacheTtlSeconds?: number
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

  const response = await fetch(url, requestInit);

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `API request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
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

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Feedoong Solo | RSC" },
    { name: "description", content: "Cloudflare Edge에서 캐시되는 개인 RSS 피드" }
  ];
}

export async function loader({ context, request }: Route.LoaderArgs) {
  const apiBaseUrl = process.env.API_BASE_URL ?? "http://localhost:4000";
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
        ttlSeconds
      ),
      fetchJson<{ items: FeedItem[] }>(
        makeApiUrl(apiBaseUrl, "/v1/items?limit=100&offset=0"),
        undefined,
        ttlSeconds
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
  const apiBaseUrl = process.env.API_BASE_URL ?? "http://localhost:4000";

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
      });
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
      });
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
    <main className="container">
      <section className="hero">
        <h1>Feedoong Solo</h1>
        <p>Vite + RRv7 Framework + RSC + Cloudflare Edge Cache</p>
      </section>

      <section className="panel">
        <form method="post" className="row">
          <input type="hidden" name="intent" value="add-source" />
          <input
            name="url"
            type="url"
            placeholder="https://example.com/rss.xml"
            required
          />
          <button type="submit">소스 등록</button>
        </form>
        <form method="post" className="row compact">
          <input type="hidden" name="intent" value="sync" />
          <button type="submit">지금 동기화</button>
        </form>
        {status ? <p className="hint">{status}</p> : null}
        {error ? <p className="error">{error}</p> : null}
      </section>

      <section className="panel">
        <h2>등록 소스 ({sources.length})</h2>
        <ul className="list">
          {sources.map((source) => (
            <li key={source.id} className="card">
              <strong>{source.title}</strong>
              <a href={source.url} target="_blank" rel="noreferrer">
                {source.url}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <h2>최신 아이템 ({items.length})</h2>
        <ul className="list">
          {items.map((item) => (
            <li key={item.id} className="card">
              <a href={item.link} target="_blank" rel="noreferrer">
                {item.title}
              </a>
              <p className="meta">
                {item.sourceTitle} ·{" "}
                {item.publishedAt
                  ? new Date(item.publishedAt).toLocaleString("ko-KR")
                  : "발행일 없음"}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
