import { j as jsxRuntimeExports, O as Outlet, M as Meta, L as Links, S as ScrollRestoration, i as isRouteErrorResponse } from "../index.js";
import "../__vite_rsc_assets_manifest.js";
import "node:async_hooks";
const meta = () => [{
  title: "Feedoong Solo"
}, {
  name: "description",
  content: "Vite + React Router v7 RSC + Cloudflare 기반 개인 RSS 피드"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", {
    lang: "ko",
    children: [/* @__PURE__ */ jsxRuntimeExports.jsxs("head", {
      children: [/* @__PURE__ */ jsxRuntimeExports.jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsxRuntimeExports.jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsxRuntimeExports.jsx(Meta, {}), /* @__PURE__ */ jsxRuntimeExports.jsx(Links, {})]
    }), /* @__PURE__ */ jsxRuntimeExports.jsxs("body", {
      children: [children, /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollRestoration, {})]
    })]
  });
}
function App() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {});
}
function ErrorBoundary({
  error
}) {
  let title = "문제가 발생했습니다";
  let message = "잠시 후 다시 시도해 주세요.";
  if (isRouteErrorResponse(error)) {
    title = `${error.status}`;
    message = error.statusText || message;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("main", {
    className: "container",
    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", {
      className: "panel",
      children: [/* @__PURE__ */ jsxRuntimeExports.jsx("h1", {
        children: title
      }), /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
        children: message
      }), null]
    })
  });
}
const export_ad2555d7d286 = {
  ErrorBoundary,
  Layout,
  default: App,
  meta
};
export {
  export_ad2555d7d286
};
