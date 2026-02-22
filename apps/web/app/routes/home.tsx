import { data } from "react-router";

import { buildCacheControl, loadDashboardPayload, resolveApiRuntime } from "./home.api";
import { parseActionIntent, runActionIntent } from "./home.actions";
import { formatPublishedLabel, getHostLabel, parseStatusLabel, toSummary } from "./home.presenter";
import type { Route } from "./+types/home";
import type { FeedItem, Source } from "./home.types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Feedoong Atom | RSC" },
    { name: "description", content: "Cloudflare Edge에서 캐시되는 개인 RSS 피드" }
  ];
}

export async function loader({ context, request }: Route.LoaderArgs) {
  const runtime = resolveApiRuntime(context);
  const requestUrl = new URL(request.url);
  const status = parseStatusLabel(requestUrl.searchParams.get("status"));

  try {
    const dashboard = await loadDashboardPayload(runtime);

    return data(
      {
        sources: dashboard.sources,
        items: dashboard.items,
        status,
        error: null
      },
      {
        headers: {
          "Cache-Control": buildCacheControl(runtime.ttlSeconds),
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
  const intent = parseActionIntent(formData.get("intent"));
  return runActionIntent(intent, {
    formData,
    runtime: resolveApiRuntime(context)
  });
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
