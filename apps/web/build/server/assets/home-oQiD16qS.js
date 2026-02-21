import { R as React, r as registerClientReference, a as requireReact_reactServer, b as redirect2, d as data } from "../index.js";
import assetsManifest from "../__vite_rsc_assets_manifest.js";
import "node:async_hooks";
import "set-cookie-parser";
const RemoveDuplicateServerCss = void 0;
const Resources = /* @__PURE__ */ ((React2, deps, RemoveDuplicateServerCss2, precedence) => {
  return function Resources2() {
    return React2.createElement(React2.Fragment, null, [...deps.css.map((href) => React2.createElement("link", {
      key: "css:" + href,
      rel: "stylesheet",
      ...{ precedence },
      href,
      "data-rsc-css-href": href
    })), RemoveDuplicateServerCss2]);
  };
})(
  React,
  assetsManifest.serverResources["app/routes/home.tsx?route-module"],
  RemoveDuplicateServerCss,
  "vite-rsc/importer-resources"
);
const meta = /* @__PURE__ */ registerClientReference(() => {
  throw new Error("Unexpectedly client reference export 'meta' is called on server");
}, "424330dbe181", "meta");
var jsxRuntime_reactServer = { exports: {} };
var reactJsxRuntime_reactServer_production = {};
var hasRequiredReactJsxRuntime_reactServer_production;
function requireReactJsxRuntime_reactServer_production() {
  if (hasRequiredReactJsxRuntime_reactServer_production) return reactJsxRuntime_reactServer_production;
  hasRequiredReactJsxRuntime_reactServer_production = 1;
  var React2 = requireReact_reactServer(), REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment");
  if (!React2.__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE)
    throw Error(
      'The "react" package in this environment is not configured correctly. The "react-server" condition must be enabled in any environment that runs React Server Components.'
    );
  function jsxProd(type, config, maybeKey) {
    var key = null;
    void 0 !== maybeKey && (key = "" + maybeKey);
    void 0 !== config.key && (key = "" + config.key);
    if ("key" in config) {
      maybeKey = {};
      for (var propName in config)
        "key" !== propName && (maybeKey[propName] = config[propName]);
    } else maybeKey = config;
    config = maybeKey.ref;
    return {
      $$typeof: REACT_ELEMENT_TYPE,
      type,
      key,
      ref: void 0 !== config ? config : null,
      props: maybeKey
    };
  }
  reactJsxRuntime_reactServer_production.Fragment = REACT_FRAGMENT_TYPE;
  reactJsxRuntime_reactServer_production.jsx = jsxProd;
  reactJsxRuntime_reactServer_production.jsxDEV = void 0;
  reactJsxRuntime_reactServer_production.jsxs = jsxProd;
  return reactJsxRuntime_reactServer_production;
}
var reactJsxRuntime_reactServer_development = {};
var hasRequiredReactJsxRuntime_reactServer_development;
function requireReactJsxRuntime_reactServer_development() {
  if (hasRequiredReactJsxRuntime_reactServer_development) return reactJsxRuntime_reactServer_development;
  hasRequiredReactJsxRuntime_reactServer_development = 1;
  "production" !== process.env.NODE_ENV && (function() {
    function getComponentNameFromType(type) {
      if (null == type) return null;
      if ("function" === typeof type)
        return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
      if ("string" === typeof type) return type;
      switch (type) {
        case REACT_FRAGMENT_TYPE:
          return "Fragment";
        case REACT_PROFILER_TYPE:
          return "Profiler";
        case REACT_STRICT_MODE_TYPE:
          return "StrictMode";
        case REACT_SUSPENSE_TYPE:
          return "Suspense";
        case REACT_SUSPENSE_LIST_TYPE:
          return "SuspenseList";
        case REACT_ACTIVITY_TYPE:
          return "Activity";
      }
      if ("object" === typeof type)
        switch ("number" === typeof type.tag && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), type.$$typeof) {
          case REACT_PORTAL_TYPE:
            return "Portal";
          case REACT_CONTEXT_TYPE:
            return type.displayName || "Context";
          case REACT_CONSUMER_TYPE:
            return (type._context.displayName || "Context") + ".Consumer";
          case REACT_FORWARD_REF_TYPE:
            var innerType = type.render;
            type = type.displayName;
            type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
            return type;
          case REACT_MEMO_TYPE:
            return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
          case REACT_LAZY_TYPE:
            innerType = type._payload;
            type = type._init;
            try {
              return getComponentNameFromType(type(innerType));
            } catch (x) {
            }
        }
      return null;
    }
    function testStringCoercion(value) {
      return "" + value;
    }
    function checkKeyStringCoercion(value) {
      try {
        testStringCoercion(value);
        var JSCompiler_inline_result = false;
      } catch (e) {
        JSCompiler_inline_result = true;
      }
      if (JSCompiler_inline_result) {
        JSCompiler_inline_result = console;
        var JSCompiler_temp_const = JSCompiler_inline_result.error;
        var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
        JSCompiler_temp_const.call(
          JSCompiler_inline_result,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          JSCompiler_inline_result$jscomp$0
        );
        return testStringCoercion(value);
      }
    }
    function getTaskName(type) {
      if (type === REACT_FRAGMENT_TYPE) return "<>";
      if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE)
        return "<...>";
      try {
        var name = getComponentNameFromType(type);
        return name ? "<" + name + ">" : "<...>";
      } catch (x) {
        return "<...>";
      }
    }
    function getOwner() {
      var dispatcher = ReactSharedInternalsServer.A;
      return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
      return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
      if (hasOwnProperty.call(config, "key")) {
        var getter = Object.getOwnPropertyDescriptor(config, "key").get;
        if (getter && getter.isReactWarning) return false;
      }
      return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
      function warnAboutAccessingKey() {
        specialPropKeyWarningShown || (specialPropKeyWarningShown = true, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          displayName
        ));
      }
      warnAboutAccessingKey.isReactWarning = true;
      Object.defineProperty(props, "key", {
        get: warnAboutAccessingKey,
        configurable: true
      });
    }
    function elementRefGetterWithDeprecationWarning() {
      var componentName = getComponentNameFromType(this.type);
      didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = true, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      ));
      componentName = this.props.ref;
      return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
      var refProp = props.ref;
      type = {
        $$typeof: REACT_ELEMENT_TYPE,
        type,
        key,
        props,
        _owner: owner
      };
      null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
        enumerable: false,
        get: elementRefGetterWithDeprecationWarning
      }) : Object.defineProperty(type, "ref", { enumerable: false, value: null });
      type._store = {};
      Object.defineProperty(type._store, "validated", {
        configurable: false,
        enumerable: false,
        writable: true,
        value: 0
      });
      Object.defineProperty(type, "_debugInfo", {
        configurable: false,
        enumerable: false,
        writable: true,
        value: null
      });
      Object.defineProperty(type, "_debugStack", {
        configurable: false,
        enumerable: false,
        writable: true,
        value: debugStack
      });
      Object.defineProperty(type, "_debugTask", {
        configurable: false,
        enumerable: false,
        writable: true,
        value: debugTask
      });
      Object.freeze && (Object.freeze(type.props), Object.freeze(type));
      return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
      var children = config.children;
      if (void 0 !== children)
        if (isStaticChildren)
          if (isArrayImpl(children)) {
            for (isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)
              validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else validateChildKeys(children);
      if (hasOwnProperty.call(config, "key")) {
        children = getComponentNameFromType(type);
        var keys = Object.keys(config).filter(function(k) {
          return "key" !== k;
        });
        isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
        didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error(
          'A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />',
          isStaticChildren,
          children,
          keys,
          children
        ), didWarnAboutKeySpread[children + isStaticChildren] = true);
      }
      children = null;
      void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
      hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
      if ("key" in config) {
        maybeKey = {};
        for (var propName in config)
          "key" !== propName && (maybeKey[propName] = config[propName]);
      } else maybeKey = config;
      children && defineKeyPropWarningGetter(
        maybeKey,
        "function" === typeof type ? type.displayName || type.name || "Unknown" : type
      );
      return ReactElement(
        type,
        children,
        maybeKey,
        getOwner(),
        debugStack,
        debugTask
      );
    }
    function validateChildKeys(node) {
      isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
      return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React2 = requireReact_reactServer(), REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo"), REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity"), REACT_CLIENT_REFERENCE = /* @__PURE__ */ Symbol.for("react.client.reference"), ReactSharedInternalsServer = React2.__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    if (!ReactSharedInternalsServer)
      throw Error(
        'The "react" package in this environment is not configured correctly. The "react-server" condition must be enabled in any environment that runs React Server Components.'
      );
    var hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
      return null;
    };
    React2 = {
      react_stack_bottom_frame: function(callStackForError) {
        return callStackForError();
      }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React2.react_stack_bottom_frame.bind(
      React2,
      UnknownOwner
    )();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    reactJsxRuntime_reactServer_development.Fragment = REACT_FRAGMENT_TYPE;
    reactJsxRuntime_reactServer_development.jsx = function(type, config, maybeKey) {
      var trackActualOwner = 1e4 > ReactSharedInternalsServer.recentlyCreatedOwnerStacks++;
      return jsxDEVImpl(
        type,
        config,
        maybeKey,
        false,
        trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
        trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask
      );
    };
    reactJsxRuntime_reactServer_development.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
      var trackActualOwner = 1e4 > ReactSharedInternalsServer.recentlyCreatedOwnerStacks++;
      return jsxDEVImpl(
        type,
        config,
        maybeKey,
        isStaticChildren,
        trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
        trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask
      );
    };
    reactJsxRuntime_reactServer_development.jsxs = function(type, config, maybeKey) {
      var trackActualOwner = 1e4 > ReactSharedInternalsServer.recentlyCreatedOwnerStacks++;
      return jsxDEVImpl(
        type,
        config,
        maybeKey,
        true,
        trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
        trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask
      );
    };
  })();
  return reactJsxRuntime_reactServer_development;
}
var hasRequiredJsxRuntime_reactServer;
function requireJsxRuntime_reactServer() {
  if (hasRequiredJsxRuntime_reactServer) return jsxRuntime_reactServer.exports;
  hasRequiredJsxRuntime_reactServer = 1;
  if (process.env.NODE_ENV === "production") {
    jsxRuntime_reactServer.exports = requireReactJsxRuntime_reactServer_production();
  } else {
    jsxRuntime_reactServer.exports = requireReactJsxRuntime_reactServer_development();
  }
  return jsxRuntime_reactServer.exports;
}
var jsxRuntime_reactServerExports = requireJsxRuntime_reactServer();
const DEFAULT_CACHE_TTL_SECONDS = 60;
const DEFAULT_STALE_SECONDS = 300;
const buildCacheControl = (ttlSeconds) => `public, max-age=0, s-maxage=${ttlSeconds}, stale-while-revalidate=${DEFAULT_STALE_SECONDS}`;
const makeApiUrl = (baseUrl, path) => `${baseUrl}${path}`;
const fetchJson = async (url, init, cacheTtlSeconds) => {
  const requestInit = {
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
  return response.json();
};
const parseStatusLabel = (status) => {
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
async function loader({
  context,
  request
}) {
  const apiBaseUrl = process.env.API_BASE_URL ?? "http://localhost:4000";
  const ttlSeconds = Number(process.env.CACHE_TTL_SECONDS ?? DEFAULT_CACHE_TTL_SECONDS);
  const requestUrl = new URL(request.url);
  const status = parseStatusLabel(requestUrl.searchParams.get("status"));
  try {
    const [sourcesResult, itemsResult] = await Promise.all([fetchJson(makeApiUrl(apiBaseUrl, "/v1/sources"), void 0, ttlSeconds), fetchJson(makeApiUrl(apiBaseUrl, "/v1/items?limit=100&offset=0"), void 0, ttlSeconds)]);
    return data({
      sources: sourcesResult.sources,
      items: itemsResult.items,
      status,
      error: null
    }, {
      headers: {
        "Cache-Control": buildCacheControl(ttlSeconds),
        "Cache-Tag": "feedoong,feedoong-dashboard"
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "피드를 가져오지 못했습니다.";
    return data({
      sources: [],
      items: [],
      status,
      error: errorMessage
    }, {
      headers: {
        "Cache-Control": "no-store"
      }
    });
  }
}
async function action({
  request,
  context
}) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const apiBaseUrl = process.env.API_BASE_URL ?? "http://localhost:4000";
  if (intent === "add-source") {
    const url = String(formData.get("url") ?? "").trim();
    if (!url) {
      return redirect2("/?status=source-error");
    }
    try {
      await fetchJson(makeApiUrl(apiBaseUrl, "/v1/sources"), {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          url
        })
      });
      return redirect2("/?status=source-added");
    } catch (_error) {
      return redirect2("/?status=source-error");
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
      return redirect2("/?status=synced");
    } catch (_error) {
      return redirect2("/?status=sync-error");
    }
  }
  return redirect2("/");
}
async function ServerComponent$1({
  loaderData
}) {
  const {
    sources,
    items,
    status,
    error
  } = loaderData;
  return /* @__PURE__ */ jsxRuntime_reactServerExports.jsxs("main", {
    className: "container",
    children: [/* @__PURE__ */ jsxRuntime_reactServerExports.jsxs("section", {
      className: "hero",
      children: [/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("h1", {
        children: "Feedoong Solo"
      }), /* @__PURE__ */ jsxRuntime_reactServerExports.jsx("p", {
        children: "Vite + RRv7 Framework + RSC + Cloudflare Edge Cache"
      })]
    }), /* @__PURE__ */ jsxRuntime_reactServerExports.jsxs("section", {
      className: "panel",
      children: [/* @__PURE__ */ jsxRuntime_reactServerExports.jsxs("form", {
        method: "post",
        className: "row",
        children: [/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("input", {
          type: "hidden",
          name: "intent",
          value: "add-source"
        }), /* @__PURE__ */ jsxRuntime_reactServerExports.jsx("input", {
          name: "url",
          type: "url",
          placeholder: "https://example.com/rss.xml",
          required: true
        }), /* @__PURE__ */ jsxRuntime_reactServerExports.jsx("button", {
          type: "submit",
          children: "소스 등록"
        })]
      }), /* @__PURE__ */ jsxRuntime_reactServerExports.jsxs("form", {
        method: "post",
        className: "row compact",
        children: [/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("input", {
          type: "hidden",
          name: "intent",
          value: "sync"
        }), /* @__PURE__ */ jsxRuntime_reactServerExports.jsx("button", {
          type: "submit",
          children: "지금 동기화"
        })]
      }), status ? /* @__PURE__ */ jsxRuntime_reactServerExports.jsx("p", {
        className: "hint",
        children: status
      }) : null, error ? /* @__PURE__ */ jsxRuntime_reactServerExports.jsx("p", {
        className: "error",
        children: error
      }) : null]
    }), /* @__PURE__ */ jsxRuntime_reactServerExports.jsxs("section", {
      className: "panel",
      children: [/* @__PURE__ */ jsxRuntime_reactServerExports.jsxs("h2", {
        children: ["등록 소스 (", sources.length, ")"]
      }), /* @__PURE__ */ jsxRuntime_reactServerExports.jsx("ul", {
        className: "list",
        children: sources.map((source) => /* @__PURE__ */ jsxRuntime_reactServerExports.jsxs("li", {
          className: "card",
          children: [/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("strong", {
            children: source.title
          }), /* @__PURE__ */ jsxRuntime_reactServerExports.jsx("a", {
            href: source.url,
            target: "_blank",
            rel: "noreferrer",
            children: source.url
          })]
        }, source.id))
      })]
    }), /* @__PURE__ */ jsxRuntime_reactServerExports.jsxs("section", {
      className: "panel",
      children: [/* @__PURE__ */ jsxRuntime_reactServerExports.jsxs("h2", {
        children: ["최신 아이템 (", items.length, ")"]
      }), /* @__PURE__ */ jsxRuntime_reactServerExports.jsx("ul", {
        className: "list",
        children: items.map((item) => /* @__PURE__ */ jsxRuntime_reactServerExports.jsxs("li", {
          className: "card",
          children: [/* @__PURE__ */ jsxRuntime_reactServerExports.jsx("a", {
            href: item.link,
            target: "_blank",
            rel: "noreferrer",
            children: item.title
          }), /* @__PURE__ */ jsxRuntime_reactServerExports.jsxs("p", {
            className: "meta",
            children: [item.sourceTitle, " ·", " ", item.publishedAt ? new Date(item.publishedAt).toLocaleString("ko-KR") : "발행일 없음"]
          })]
        }, item.id))
      })]
    })]
  });
}
function ServerComponent(props) {
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Resources),
    React.createElement(ServerComponent$1, props)
  );
}
export {
  action,
  ServerComponent as default,
  loader,
  meta
};
