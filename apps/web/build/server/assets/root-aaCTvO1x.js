import { r as registerClientReference } from "../index.js";
import "node:async_hooks";
import "../__vite_rsc_assets_manifest.js";
import "set-cookie-parser";
const meta = /* @__PURE__ */ registerClientReference(() => {
  throw new Error("Unexpectedly client reference export 'meta' is called on server");
}, "ad2555d7d286", "meta");
const Layout = /* @__PURE__ */ registerClientReference(() => {
  throw new Error("Unexpectedly client reference export 'Layout' is called on server");
}, "ad2555d7d286", "Layout");
const root = /* @__PURE__ */ registerClientReference(() => {
  throw new Error("Unexpectedly client reference export 'default' is called on server");
}, "ad2555d7d286", "default");
const ErrorBoundary = /* @__PURE__ */ registerClientReference(() => {
  throw new Error("Unexpectedly client reference export 'ErrorBoundary' is called on server");
}, "ad2555d7d286", "ErrorBoundary");
export {
  ErrorBoundary,
  Layout,
  root as default,
  meta
};
