import { isRouteErrorResponse, Links, Meta, Outlet, ScrollRestoration } from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

export const meta: Route.MetaFunction = () => [
  { title: "Feedoong Solo" },
  {
    name: "description",
    content: "Vite + React Router v7 RSC + Cloudflare 기반 개인 RSS 피드"
  }
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let title = "문제가 발생했습니다";
  let message = "잠시 후 다시 시도해 주세요.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    title = `${error.status}`;
    message = error.statusText || message;
  } else if (import.meta.env.DEV && error instanceof Error) {
    message = error.message;
    stack = error.stack;
  }

  return (
    <main className="container">
      <section className="panel">
        <h1>{title}</h1>
        <p>{message}</p>
        {stack ? <pre>{stack}</pre> : null}
      </section>
    </main>
  );
}
