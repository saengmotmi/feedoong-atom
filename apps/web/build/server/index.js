import require$$0, { AsyncLocalStorage as AsyncLocalStorage$1 } from "node:async_hooks";
import assetsManifest from "./__vite_rsc_assets_manifest.js";
import { splitCookiesString } from "set-cookie-parser";
function tinyassert(value, message) {
  if (value) return;
  if (message instanceof Error) throw message;
  throw new TinyAssertionError(message, tinyassert);
}
var TinyAssertionError = class extends Error {
  constructor(message, stackStartFunction) {
    super(message ?? "TinyAssertionError");
    if (stackStartFunction && "captureStackTrace" in Error) Error.captureStackTrace(this, stackStartFunction);
  }
};
function safeFunctionCast(f) {
  return f;
}
function memoize(f, options) {
  const keyFn = ((...args) => args[0]);
  const cache = /* @__PURE__ */ new Map();
  return safeFunctionCast(function(...args) {
    const key = keyFn(...args);
    const value = cache.get(key);
    if (typeof value !== "undefined") return value;
    const newValue = f.apply(this, args);
    cache.set(key, newValue);
    return newValue;
  });
}
const SERVER_REFERENCE_PREFIX = "$$server:";
const SERVER_DECODE_CLIENT_PREFIX = "$$decode-client:";
function removeReferenceCacheTag(id) {
  return id.split("$$cache=")[0];
}
function setInternalRequire() {
  globalThis.__vite_rsc_require__ = (id) => {
    if (id.startsWith(SERVER_REFERENCE_PREFIX)) {
      id = id.slice(9);
      return globalThis.__vite_rsc_server_require__(id);
    }
    return globalThis.__vite_rsc_client_require__(id);
  };
}
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var server_edge = {};
var reactServerDomWebpackServer_edge_production = {};
var reactDom_reactServer = { exports: {} };
var reactDom_reactServer_production = {};
var react_reactServer = { exports: {} };
var react_reactServer_production = {};
var hasRequiredReact_reactServer_production;
function requireReact_reactServer_production() {
  if (hasRequiredReact_reactServer_production) return react_reactServer_production;
  hasRequiredReact_reactServer_production = 1;
  var ReactSharedInternals = { H: null, A: null };
  function formatProdErrorMessage(code) {
    var url = "https://react.dev/errors/" + code;
    if (1 < arguments.length) {
      url += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var i = 2; i < arguments.length; i++)
        url += "&args[]=" + encodeURIComponent(arguments[i]);
    }
    return "Minified React error #" + code + "; visit " + url + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var isArrayImpl = Array.isArray;
  function noop() {
  }
  var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler"), REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense"), REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo"), REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
  function getIteratorFn(maybeIterable) {
    if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
    maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
    return "function" === typeof maybeIterable ? maybeIterable : null;
  }
  var hasOwnProperty = Object.prototype.hasOwnProperty, assign = Object.assign;
  function ReactElement(type, key, props) {
    var refProp = props.ref;
    return {
      $$typeof: REACT_ELEMENT_TYPE,
      type,
      key,
      ref: void 0 !== refProp ? refProp : null,
      props
    };
  }
  function cloneAndReplaceKey(oldElement, newKey) {
    return ReactElement(oldElement.type, newKey, oldElement.props);
  }
  function isValidElement(object) {
    return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
  }
  function escape(key) {
    var escaperLookup = { "=": "=0", ":": "=2" };
    return "$" + key.replace(/[=:]/g, function(match) {
      return escaperLookup[match];
    });
  }
  var userProvidedKeyEscapeRegex = /\/+/g;
  function getElementKey(element, index) {
    return "object" === typeof element && null !== element && null != element.key ? escape("" + element.key) : index.toString(36);
  }
  function resolveThenable(thenable) {
    switch (thenable.status) {
      case "fulfilled":
        return thenable.value;
      case "rejected":
        throw thenable.reason;
      default:
        switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(
          function(fulfilledValue) {
            "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
          },
          function(error) {
            "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
          }
        )), thenable.status) {
          case "fulfilled":
            return thenable.value;
          case "rejected":
            throw thenable.reason;
        }
    }
    throw thenable;
  }
  function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
    var type = typeof children;
    if ("undefined" === type || "boolean" === type) children = null;
    var invokeCallback = false;
    if (null === children) invokeCallback = true;
    else
      switch (type) {
        case "bigint":
        case "string":
        case "number":
          invokeCallback = true;
          break;
        case "object":
          switch (children.$$typeof) {
            case REACT_ELEMENT_TYPE:
            case REACT_PORTAL_TYPE:
              invokeCallback = true;
              break;
            case REACT_LAZY_TYPE:
              return invokeCallback = children._init, mapIntoArray(
                invokeCallback(children._payload),
                array,
                escapedPrefix,
                nameSoFar,
                callback
              );
          }
      }
    if (invokeCallback)
      return callback = callback(children), invokeCallback = "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar, isArrayImpl(callback) ? (escapedPrefix = "", null != invokeCallback && (escapedPrefix = invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
        return c;
      })) : null != callback && (isValidElement(callback) && (callback = cloneAndReplaceKey(
        callback,
        escapedPrefix + (null == callback.key || children && children.key === callback.key ? "" : ("" + callback.key).replace(
          userProvidedKeyEscapeRegex,
          "$&/"
        ) + "/") + invokeCallback
      )), array.push(callback)), 1;
    invokeCallback = 0;
    var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
    if (isArrayImpl(children))
      for (var i = 0; i < children.length; i++)
        nameSoFar = children[i], type = nextNamePrefix + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
          nameSoFar,
          array,
          escapedPrefix,
          type,
          callback
        );
    else if (i = getIteratorFn(children), "function" === typeof i)
      for (children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
        nameSoFar = nameSoFar.value, type = nextNamePrefix + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
          nameSoFar,
          array,
          escapedPrefix,
          type,
          callback
        );
    else if ("object" === type) {
      if ("function" === typeof children.then)
        return mapIntoArray(
          resolveThenable(children),
          array,
          escapedPrefix,
          nameSoFar,
          callback
        );
      array = String(children);
      throw Error(
        formatProdErrorMessage(
          31,
          "[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array
        )
      );
    }
    return invokeCallback;
  }
  function mapChildren(children, func, context) {
    if (null == children) return children;
    var result = [], count = 0;
    mapIntoArray(children, result, "", "", function(child) {
      return func.call(context, child, count++);
    });
    return result;
  }
  function lazyInitializer(payload) {
    if (-1 === payload._status) {
      var ctor = payload._result;
      ctor = ctor();
      ctor.then(
        function(moduleObject) {
          if (0 === payload._status || -1 === payload._status)
            payload._status = 1, payload._result = moduleObject;
        },
        function(error) {
          if (0 === payload._status || -1 === payload._status)
            payload._status = 2, payload._result = error;
        }
      );
      -1 === payload._status && (payload._status = 0, payload._result = ctor);
    }
    if (1 === payload._status) return payload._result.default;
    throw payload._result;
  }
  function createCacheRoot() {
    return /* @__PURE__ */ new WeakMap();
  }
  function createCacheNode() {
    return { s: 0, v: void 0, o: null, p: null };
  }
  react_reactServer_production.Children = {
    map: mapChildren,
    forEach: function(children, forEachFunc, forEachContext) {
      mapChildren(
        children,
        function() {
          forEachFunc.apply(this, arguments);
        },
        forEachContext
      );
    },
    count: function(children) {
      var n = 0;
      mapChildren(children, function() {
        n++;
      });
      return n;
    },
    toArray: function(children) {
      return mapChildren(children, function(child) {
        return child;
      }) || [];
    },
    only: function(children) {
      if (!isValidElement(children)) throw Error(formatProdErrorMessage(143));
      return children;
    }
  };
  react_reactServer_production.Fragment = REACT_FRAGMENT_TYPE;
  react_reactServer_production.Profiler = REACT_PROFILER_TYPE;
  react_reactServer_production.StrictMode = REACT_STRICT_MODE_TYPE;
  react_reactServer_production.Suspense = REACT_SUSPENSE_TYPE;
  react_reactServer_production.__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
  react_reactServer_production.cache = function(fn) {
    return function() {
      var dispatcher = ReactSharedInternals.A;
      if (!dispatcher) return fn.apply(null, arguments);
      var fnMap = dispatcher.getCacheForType(createCacheRoot);
      dispatcher = fnMap.get(fn);
      void 0 === dispatcher && (dispatcher = createCacheNode(), fnMap.set(fn, dispatcher));
      fnMap = 0;
      for (var l = arguments.length; fnMap < l; fnMap++) {
        var arg = arguments[fnMap];
        if ("function" === typeof arg || "object" === typeof arg && null !== arg) {
          var objectCache = dispatcher.o;
          null === objectCache && (dispatcher.o = objectCache = /* @__PURE__ */ new WeakMap());
          dispatcher = objectCache.get(arg);
          void 0 === dispatcher && (dispatcher = createCacheNode(), objectCache.set(arg, dispatcher));
        } else
          objectCache = dispatcher.p, null === objectCache && (dispatcher.p = objectCache = /* @__PURE__ */ new Map()), dispatcher = objectCache.get(arg), void 0 === dispatcher && (dispatcher = createCacheNode(), objectCache.set(arg, dispatcher));
      }
      if (1 === dispatcher.s) return dispatcher.v;
      if (2 === dispatcher.s) throw dispatcher.v;
      try {
        var result = fn.apply(null, arguments);
        fnMap = dispatcher;
        fnMap.s = 1;
        return fnMap.v = result;
      } catch (error) {
        throw result = dispatcher, result.s = 2, result.v = error, error;
      }
    };
  };
  react_reactServer_production.cacheSignal = function() {
    var dispatcher = ReactSharedInternals.A;
    return dispatcher ? dispatcher.cacheSignal() : null;
  };
  react_reactServer_production.captureOwnerStack = function() {
    return null;
  };
  react_reactServer_production.cloneElement = function(element, config, children) {
    if (null === element || void 0 === element)
      throw Error(formatProdErrorMessage(267, element));
    var props = assign({}, element.props), key = element.key;
    if (null != config)
      for (propName in void 0 !== config.key && (key = "" + config.key), config)
        !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
    var propName = arguments.length - 2;
    if (1 === propName) props.children = children;
    else if (1 < propName) {
      for (var childArray = Array(propName), i = 0; i < propName; i++)
        childArray[i] = arguments[i + 2];
      props.children = childArray;
    }
    return ReactElement(element.type, key, props);
  };
  react_reactServer_production.createElement = function(type, config, children) {
    var propName, props = {}, key = null;
    if (null != config)
      for (propName in void 0 !== config.key && (key = "" + config.key), config)
        hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (props[propName] = config[propName]);
    var childrenLength = arguments.length - 2;
    if (1 === childrenLength) props.children = children;
    else if (1 < childrenLength) {
      for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++)
        childArray[i] = arguments[i + 2];
      props.children = childArray;
    }
    if (type && type.defaultProps)
      for (propName in childrenLength = type.defaultProps, childrenLength)
        void 0 === props[propName] && (props[propName] = childrenLength[propName]);
    return ReactElement(type, key, props);
  };
  react_reactServer_production.createRef = function() {
    return { current: null };
  };
  react_reactServer_production.forwardRef = function(render) {
    return { $$typeof: REACT_FORWARD_REF_TYPE, render };
  };
  react_reactServer_production.isValidElement = isValidElement;
  react_reactServer_production.lazy = function(ctor) {
    return {
      $$typeof: REACT_LAZY_TYPE,
      _payload: { _status: -1, _result: ctor },
      _init: lazyInitializer
    };
  };
  react_reactServer_production.memo = function(type, compare) {
    return {
      $$typeof: REACT_MEMO_TYPE,
      type,
      compare: void 0 === compare ? null : compare
    };
  };
  react_reactServer_production.use = function(usable) {
    return ReactSharedInternals.H.use(usable);
  };
  react_reactServer_production.useCallback = function(callback, deps) {
    return ReactSharedInternals.H.useCallback(callback, deps);
  };
  react_reactServer_production.useDebugValue = function() {
  };
  react_reactServer_production.useId = function() {
    return ReactSharedInternals.H.useId();
  };
  react_reactServer_production.useMemo = function(create, deps) {
    return ReactSharedInternals.H.useMemo(create, deps);
  };
  react_reactServer_production.version = "19.2.4";
  return react_reactServer_production;
}
var react_reactServer_development = {};
var hasRequiredReact_reactServer_development;
function requireReact_reactServer_development() {
  if (hasRequiredReact_reactServer_development) return react_reactServer_development;
  hasRequiredReact_reactServer_development = 1;
  "production" !== process.env.NODE_ENV && (function() {
    function noop() {
    }
    function getIteratorFn(maybeIterable) {
      if (null === maybeIterable || "object" !== typeof maybeIterable)
        return null;
      maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
      return "function" === typeof maybeIterable ? maybeIterable : null;
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
      var dispatcher = ReactSharedInternals.A;
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
    function cloneAndReplaceKey(oldElement, newKey) {
      newKey = ReactElement(
        oldElement.type,
        newKey,
        oldElement.props,
        oldElement._owner,
        oldElement._debugStack,
        oldElement._debugTask
      );
      oldElement._store && (newKey._store.validated = oldElement._store.validated);
      return newKey;
    }
    function validateChildKeys(node) {
      isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
      return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    function escape(key) {
      var escaperLookup = { "=": "=0", ":": "=2" };
      return "$" + key.replace(/[=:]/g, function(match) {
        return escaperLookup[match];
      });
    }
    function getElementKey(element, index) {
      return "object" === typeof element && null !== element && null != element.key ? (checkKeyStringCoercion(element.key), escape("" + element.key)) : index.toString(36);
    }
    function resolveThenable(thenable) {
      switch (thenable.status) {
        case "fulfilled":
          return thenable.value;
        case "rejected":
          throw thenable.reason;
        default:
          switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(
            function(fulfilledValue) {
              "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
            },
            function(error) {
              "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
            }
          )), thenable.status) {
            case "fulfilled":
              return thenable.value;
            case "rejected":
              throw thenable.reason;
          }
      }
      throw thenable;
    }
    function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
      var type = typeof children;
      if ("undefined" === type || "boolean" === type) children = null;
      var invokeCallback = false;
      if (null === children) invokeCallback = true;
      else
        switch (type) {
          case "bigint":
          case "string":
          case "number":
            invokeCallback = true;
            break;
          case "object":
            switch (children.$$typeof) {
              case REACT_ELEMENT_TYPE:
              case REACT_PORTAL_TYPE:
                invokeCallback = true;
                break;
              case REACT_LAZY_TYPE:
                return invokeCallback = children._init, mapIntoArray(
                  invokeCallback(children._payload),
                  array,
                  escapedPrefix,
                  nameSoFar,
                  callback
                );
            }
        }
      if (invokeCallback) {
        invokeCallback = children;
        callback = callback(invokeCallback);
        var childKey = "" === nameSoFar ? "." + getElementKey(invokeCallback, 0) : nameSoFar;
        isArrayImpl(callback) ? (escapedPrefix = "", null != childKey && (escapedPrefix = childKey.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
          return c;
        })) : null != callback && (isValidElement(callback) && (null != callback.key && (invokeCallback && invokeCallback.key === callback.key || checkKeyStringCoercion(callback.key)), escapedPrefix = cloneAndReplaceKey(
          callback,
          escapedPrefix + (null == callback.key || invokeCallback && invokeCallback.key === callback.key ? "" : ("" + callback.key).replace(
            userProvidedKeyEscapeRegex,
            "$&/"
          ) + "/") + childKey
        ), "" !== nameSoFar && null != invokeCallback && isValidElement(invokeCallback) && null == invokeCallback.key && invokeCallback._store && !invokeCallback._store.validated && (escapedPrefix._store.validated = 2), callback = escapedPrefix), array.push(callback));
        return 1;
      }
      invokeCallback = 0;
      childKey = "" === nameSoFar ? "." : nameSoFar + ":";
      if (isArrayImpl(children))
        for (var i = 0; i < children.length; i++)
          nameSoFar = children[i], type = childKey + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
            nameSoFar,
            array,
            escapedPrefix,
            type,
            callback
          );
      else if (i = getIteratorFn(children), "function" === typeof i)
        for (i === children.entries && (didWarnAboutMaps || console.warn(
          "Using Maps as children is not supported. Use an array of keyed ReactElements instead."
        ), didWarnAboutMaps = true), children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
          nameSoFar = nameSoFar.value, type = childKey + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
            nameSoFar,
            array,
            escapedPrefix,
            type,
            callback
          );
      else if ("object" === type) {
        if ("function" === typeof children.then)
          return mapIntoArray(
            resolveThenable(children),
            array,
            escapedPrefix,
            nameSoFar,
            callback
          );
        array = String(children);
        throw Error(
          "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
        );
      }
      return invokeCallback;
    }
    function mapChildren(children, func, context) {
      if (null == children) return children;
      var result = [], count = 0;
      mapIntoArray(children, result, "", "", function(child) {
        return func.call(context, child, count++);
      });
      return result;
    }
    function resolveDispatcher() {
      var dispatcher = ReactSharedInternals.H;
      null === dispatcher && console.error(
        "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."
      );
      return dispatcher;
    }
    function lazyInitializer(payload) {
      if (-1 === payload._status) {
        var ioInfo = payload._ioInfo;
        null != ioInfo && (ioInfo.start = ioInfo.end = performance.now());
        ioInfo = payload._result;
        var thenable = ioInfo();
        thenable.then(
          function(moduleObject) {
            if (0 === payload._status || -1 === payload._status) {
              payload._status = 1;
              payload._result = moduleObject;
              var _ioInfo = payload._ioInfo;
              null != _ioInfo && (_ioInfo.end = performance.now());
              void 0 === thenable.status && (thenable.status = "fulfilled", thenable.value = moduleObject);
            }
          },
          function(error) {
            if (0 === payload._status || -1 === payload._status) {
              payload._status = 2;
              payload._result = error;
              var _ioInfo2 = payload._ioInfo;
              null != _ioInfo2 && (_ioInfo2.end = performance.now());
              void 0 === thenable.status && (thenable.status = "rejected", thenable.reason = error);
            }
          }
        );
        ioInfo = payload._ioInfo;
        if (null != ioInfo) {
          ioInfo.value = thenable;
          var displayName = thenable.displayName;
          "string" === typeof displayName && (ioInfo.name = displayName);
        }
        -1 === payload._status && (payload._status = 0, payload._result = thenable);
      }
      if (1 === payload._status)
        return ioInfo = payload._result, void 0 === ioInfo && console.error(
          "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))\n\nDid you accidentally put curly braces around the import?",
          ioInfo
        ), "default" in ioInfo || console.error(
          "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))",
          ioInfo
        ), ioInfo.default;
      throw payload._result;
    }
    function createCacheRoot() {
      return /* @__PURE__ */ new WeakMap();
    }
    function createCacheNode() {
      return { s: 0, v: void 0, o: null, p: null };
    }
    var ReactSharedInternals = {
      H: null,
      A: null,
      getCurrentStack: null,
      recentlyCreatedOwnerStacks: 0
    }, isArrayImpl = Array.isArray, REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo"), REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator, REACT_CLIENT_REFERENCE = /* @__PURE__ */ Symbol.for("react.client.reference"), hasOwnProperty = Object.prototype.hasOwnProperty, assign = Object.assign, createTask = console.createTask ? console.createTask : function() {
      return null;
    }, createFakeCallStack = {
      react_stack_bottom_frame: function(callStackForError) {
        return callStackForError();
      }
    }, specialPropKeyWarningShown, didWarnAboutOldJSXRuntime;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = createFakeCallStack.react_stack_bottom_frame.bind(
      createFakeCallStack,
      UnknownOwner
    )();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutMaps = false, userProvidedKeyEscapeRegex = /\/+/g;
    react_reactServer_development.Children = {
      map: mapChildren,
      forEach: function(children, forEachFunc, forEachContext) {
        mapChildren(
          children,
          function() {
            forEachFunc.apply(this, arguments);
          },
          forEachContext
        );
      },
      count: function(children) {
        var n = 0;
        mapChildren(children, function() {
          n++;
        });
        return n;
      },
      toArray: function(children) {
        return mapChildren(children, function(child) {
          return child;
        }) || [];
      },
      only: function(children) {
        if (!isValidElement(children))
          throw Error(
            "React.Children.only expected to receive a single React element child."
          );
        return children;
      }
    };
    react_reactServer_development.Fragment = REACT_FRAGMENT_TYPE;
    react_reactServer_development.Profiler = REACT_PROFILER_TYPE;
    react_reactServer_development.StrictMode = REACT_STRICT_MODE_TYPE;
    react_reactServer_development.Suspense = REACT_SUSPENSE_TYPE;
    react_reactServer_development.__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
    react_reactServer_development.cache = function(fn) {
      return function() {
        var dispatcher = ReactSharedInternals.A;
        if (!dispatcher) return fn.apply(null, arguments);
        var fnMap = dispatcher.getCacheForType(createCacheRoot);
        dispatcher = fnMap.get(fn);
        void 0 === dispatcher && (dispatcher = createCacheNode(), fnMap.set(fn, dispatcher));
        fnMap = 0;
        for (var l = arguments.length; fnMap < l; fnMap++) {
          var arg = arguments[fnMap];
          if ("function" === typeof arg || "object" === typeof arg && null !== arg) {
            var objectCache = dispatcher.o;
            null === objectCache && (dispatcher.o = objectCache = /* @__PURE__ */ new WeakMap());
            dispatcher = objectCache.get(arg);
            void 0 === dispatcher && (dispatcher = createCacheNode(), objectCache.set(arg, dispatcher));
          } else
            objectCache = dispatcher.p, null === objectCache && (dispatcher.p = objectCache = /* @__PURE__ */ new Map()), dispatcher = objectCache.get(arg), void 0 === dispatcher && (dispatcher = createCacheNode(), objectCache.set(arg, dispatcher));
        }
        if (1 === dispatcher.s) return dispatcher.v;
        if (2 === dispatcher.s) throw dispatcher.v;
        try {
          var result = fn.apply(null, arguments);
          fnMap = dispatcher;
          fnMap.s = 1;
          return fnMap.v = result;
        } catch (error) {
          throw result = dispatcher, result.s = 2, result.v = error, error;
        }
      };
    };
    react_reactServer_development.cacheSignal = function() {
      var dispatcher = ReactSharedInternals.A;
      return dispatcher ? dispatcher.cacheSignal() : null;
    };
    react_reactServer_development.captureOwnerStack = function() {
      var getCurrentStack = ReactSharedInternals.getCurrentStack;
      return null === getCurrentStack ? null : getCurrentStack();
    };
    react_reactServer_development.cloneElement = function(element, config, children) {
      if (null === element || void 0 === element)
        throw Error(
          "The argument must be a React element, but you passed " + element + "."
        );
      var props = assign({}, element.props), key = element.key, owner = element._owner;
      if (null != config) {
        var JSCompiler_inline_result;
        a: {
          if (hasOwnProperty.call(config, "ref") && (JSCompiler_inline_result = Object.getOwnPropertyDescriptor(
            config,
            "ref"
          ).get) && JSCompiler_inline_result.isReactWarning) {
            JSCompiler_inline_result = false;
            break a;
          }
          JSCompiler_inline_result = void 0 !== config.ref;
        }
        JSCompiler_inline_result && (owner = getOwner());
        hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key);
        for (propName in config)
          !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
      }
      var propName = arguments.length - 2;
      if (1 === propName) props.children = children;
      else if (1 < propName) {
        JSCompiler_inline_result = Array(propName);
        for (var i = 0; i < propName; i++)
          JSCompiler_inline_result[i] = arguments[i + 2];
        props.children = JSCompiler_inline_result;
      }
      props = ReactElement(
        element.type,
        key,
        props,
        owner,
        element._debugStack,
        element._debugTask
      );
      for (key = 2; key < arguments.length; key++)
        validateChildKeys(arguments[key]);
      return props;
    };
    react_reactServer_development.createElement = function(type, config, children) {
      for (var i = 2; i < arguments.length; i++)
        validateChildKeys(arguments[i]);
      i = {};
      var key = null;
      if (null != config)
        for (propName in didWarnAboutOldJSXRuntime || !("__self" in config) || "key" in config || (didWarnAboutOldJSXRuntime = true, console.warn(
          "Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform"
        )), hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key), config)
          hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (i[propName] = config[propName]);
      var childrenLength = arguments.length - 2;
      if (1 === childrenLength) i.children = children;
      else if (1 < childrenLength) {
        for (var childArray = Array(childrenLength), _i = 0; _i < childrenLength; _i++)
          childArray[_i] = arguments[_i + 2];
        Object.freeze && Object.freeze(childArray);
        i.children = childArray;
      }
      if (type && type.defaultProps)
        for (propName in childrenLength = type.defaultProps, childrenLength)
          void 0 === i[propName] && (i[propName] = childrenLength[propName]);
      key && defineKeyPropWarningGetter(
        i,
        "function" === typeof type ? type.displayName || type.name || "Unknown" : type
      );
      var propName = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
      return ReactElement(
        type,
        key,
        i,
        getOwner(),
        propName ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
        propName ? createTask(getTaskName(type)) : unknownOwnerDebugTask
      );
    };
    react_reactServer_development.createRef = function() {
      var refObject = { current: null };
      Object.seal(refObject);
      return refObject;
    };
    react_reactServer_development.forwardRef = function(render) {
      null != render && render.$$typeof === REACT_MEMO_TYPE ? console.error(
        "forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...))."
      ) : "function" !== typeof render ? console.error(
        "forwardRef requires a render function but was given %s.",
        null === render ? "null" : typeof render
      ) : 0 !== render.length && 2 !== render.length && console.error(
        "forwardRef render functions accept exactly two parameters: props and ref. %s",
        1 === render.length ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."
      );
      null != render && null != render.defaultProps && console.error(
        "forwardRef render functions do not support defaultProps. Did you accidentally pass a React component?"
      );
      var elementType = { $$typeof: REACT_FORWARD_REF_TYPE, render }, ownName;
      Object.defineProperty(elementType, "displayName", {
        enumerable: false,
        configurable: true,
        get: function() {
          return ownName;
        },
        set: function(name) {
          ownName = name;
          render.name || render.displayName || (Object.defineProperty(render, "name", { value: name }), render.displayName = name);
        }
      });
      return elementType;
    };
    react_reactServer_development.isValidElement = isValidElement;
    react_reactServer_development.lazy = function(ctor) {
      ctor = { _status: -1, _result: ctor };
      var lazyType = {
        $$typeof: REACT_LAZY_TYPE,
        _payload: ctor,
        _init: lazyInitializer
      }, ioInfo = {
        name: "lazy",
        start: -1,
        end: -1,
        value: null,
        owner: null,
        debugStack: Error("react-stack-top-frame"),
        debugTask: console.createTask ? console.createTask("lazy()") : null
      };
      ctor._ioInfo = ioInfo;
      lazyType._debugInfo = [{ awaited: ioInfo }];
      return lazyType;
    };
    react_reactServer_development.memo = function(type, compare) {
      null == type && console.error(
        "memo: The first argument must be a component. Instead received: %s",
        null === type ? "null" : typeof type
      );
      compare = {
        $$typeof: REACT_MEMO_TYPE,
        type,
        compare: void 0 === compare ? null : compare
      };
      var ownName;
      Object.defineProperty(compare, "displayName", {
        enumerable: false,
        configurable: true,
        get: function() {
          return ownName;
        },
        set: function(name) {
          ownName = name;
          type.name || type.displayName || (Object.defineProperty(type, "name", { value: name }), type.displayName = name);
        }
      });
      return compare;
    };
    react_reactServer_development.use = function(usable) {
      return resolveDispatcher().use(usable);
    };
    react_reactServer_development.useCallback = function(callback, deps) {
      return resolveDispatcher().useCallback(callback, deps);
    };
    react_reactServer_development.useDebugValue = function(value, formatterFn) {
      return resolveDispatcher().useDebugValue(value, formatterFn);
    };
    react_reactServer_development.useId = function() {
      return resolveDispatcher().useId();
    };
    react_reactServer_development.useMemo = function(create, deps) {
      return resolveDispatcher().useMemo(create, deps);
    };
    react_reactServer_development.version = "19.2.4";
  })();
  return react_reactServer_development;
}
var hasRequiredReact_reactServer;
function requireReact_reactServer() {
  if (hasRequiredReact_reactServer) return react_reactServer.exports;
  hasRequiredReact_reactServer = 1;
  if (process.env.NODE_ENV === "production") {
    react_reactServer.exports = requireReact_reactServer_production();
  } else {
    react_reactServer.exports = requireReact_reactServer_development();
  }
  return react_reactServer.exports;
}
var hasRequiredReactDom_reactServer_production;
function requireReactDom_reactServer_production() {
  if (hasRequiredReactDom_reactServer_production) return reactDom_reactServer_production;
  hasRequiredReactDom_reactServer_production = 1;
  var React2 = requireReact_reactServer();
  function noop() {
  }
  var Internals = {
    d: {
      f: noop,
      r: function() {
        throw Error(
          "Invalid form element. requestFormReset must be passed a form that was rendered by React."
        );
      },
      D: noop,
      C: noop,
      L: noop,
      m: noop,
      X: noop,
      S: noop,
      M: noop
    },
    p: 0,
    findDOMNode: null
  };
  if (!React2.__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE)
    throw Error(
      'The "react" package in this environment is not configured correctly. The "react-server" condition must be enabled in any environment that runs React Server Components.'
    );
  function getCrossOriginStringAs(as, input) {
    if ("font" === as) return "";
    if ("string" === typeof input)
      return "use-credentials" === input ? input : "";
  }
  reactDom_reactServer_production.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Internals;
  reactDom_reactServer_production.preconnect = function(href, options) {
    "string" === typeof href && (options ? (options = options.crossOrigin, options = "string" === typeof options ? "use-credentials" === options ? options : "" : void 0) : options = null, Internals.d.C(href, options));
  };
  reactDom_reactServer_production.prefetchDNS = function(href) {
    "string" === typeof href && Internals.d.D(href);
  };
  reactDom_reactServer_production.preinit = function(href, options) {
    if ("string" === typeof href && options && "string" === typeof options.as) {
      var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin), integrity = "string" === typeof options.integrity ? options.integrity : void 0, fetchPriority = "string" === typeof options.fetchPriority ? options.fetchPriority : void 0;
      "style" === as ? Internals.d.S(
        href,
        "string" === typeof options.precedence ? options.precedence : void 0,
        {
          crossOrigin,
          integrity,
          fetchPriority
        }
      ) : "script" === as && Internals.d.X(href, {
        crossOrigin,
        integrity,
        fetchPriority,
        nonce: "string" === typeof options.nonce ? options.nonce : void 0
      });
    }
  };
  reactDom_reactServer_production.preinitModule = function(href, options) {
    if ("string" === typeof href)
      if ("object" === typeof options && null !== options) {
        if (null == options.as || "script" === options.as) {
          var crossOrigin = getCrossOriginStringAs(
            options.as,
            options.crossOrigin
          );
          Internals.d.M(href, {
            crossOrigin,
            integrity: "string" === typeof options.integrity ? options.integrity : void 0,
            nonce: "string" === typeof options.nonce ? options.nonce : void 0
          });
        }
      } else null == options && Internals.d.M(href);
  };
  reactDom_reactServer_production.preload = function(href, options) {
    if ("string" === typeof href && "object" === typeof options && null !== options && "string" === typeof options.as) {
      var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin);
      Internals.d.L(href, as, {
        crossOrigin,
        integrity: "string" === typeof options.integrity ? options.integrity : void 0,
        nonce: "string" === typeof options.nonce ? options.nonce : void 0,
        type: "string" === typeof options.type ? options.type : void 0,
        fetchPriority: "string" === typeof options.fetchPriority ? options.fetchPriority : void 0,
        referrerPolicy: "string" === typeof options.referrerPolicy ? options.referrerPolicy : void 0,
        imageSrcSet: "string" === typeof options.imageSrcSet ? options.imageSrcSet : void 0,
        imageSizes: "string" === typeof options.imageSizes ? options.imageSizes : void 0,
        media: "string" === typeof options.media ? options.media : void 0
      });
    }
  };
  reactDom_reactServer_production.preloadModule = function(href, options) {
    if ("string" === typeof href)
      if (options) {
        var crossOrigin = getCrossOriginStringAs(options.as, options.crossOrigin);
        Internals.d.m(href, {
          as: "string" === typeof options.as && "script" !== options.as ? options.as : void 0,
          crossOrigin,
          integrity: "string" === typeof options.integrity ? options.integrity : void 0
        });
      } else Internals.d.m(href);
  };
  reactDom_reactServer_production.version = "19.2.4";
  return reactDom_reactServer_production;
}
var reactDom_reactServer_development = {};
var hasRequiredReactDom_reactServer_development;
function requireReactDom_reactServer_development() {
  if (hasRequiredReactDom_reactServer_development) return reactDom_reactServer_development;
  hasRequiredReactDom_reactServer_development = 1;
  "production" !== process.env.NODE_ENV && (function() {
    function noop() {
    }
    function getCrossOriginStringAs(as, input) {
      if ("font" === as) return "";
      if ("string" === typeof input)
        return "use-credentials" === input ? input : "";
    }
    function getValueDescriptorExpectingObjectForWarning(thing) {
      return null === thing ? "`null`" : void 0 === thing ? "`undefined`" : "" === thing ? "an empty string" : 'something with type "' + typeof thing + '"';
    }
    function getValueDescriptorExpectingEnumForWarning(thing) {
      return null === thing ? "`null`" : void 0 === thing ? "`undefined`" : "" === thing ? "an empty string" : "string" === typeof thing ? JSON.stringify(thing) : "number" === typeof thing ? "`" + thing + "`" : 'something with type "' + typeof thing + '"';
    }
    var React2 = requireReact_reactServer(), Internals = {
      d: {
        f: noop,
        r: function() {
          throw Error(
            "Invalid form element. requestFormReset must be passed a form that was rendered by React."
          );
        },
        D: noop,
        C: noop,
        L: noop,
        m: noop,
        X: noop,
        S: noop,
        M: noop
      },
      p: 0,
      findDOMNode: null
    };
    if (!React2.__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE)
      throw Error(
        'The "react" package in this environment is not configured correctly. The "react-server" condition must be enabled in any environment that runs React Server Components.'
      );
    "function" === typeof Map && null != Map.prototype && "function" === typeof Map.prototype.forEach && "function" === typeof Set && null != Set.prototype && "function" === typeof Set.prototype.clear && "function" === typeof Set.prototype.forEach || console.error(
      "React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"
    );
    reactDom_reactServer_development.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Internals;
    reactDom_reactServer_development.preconnect = function(href, options) {
      "string" === typeof href && href ? null != options && "object" !== typeof options ? console.error(
        "ReactDOM.preconnect(): Expected the `options` argument (second) to be an object but encountered %s instead. The only supported option at this time is `crossOrigin` which accepts a string.",
        getValueDescriptorExpectingEnumForWarning(options)
      ) : null != options && "string" !== typeof options.crossOrigin && console.error(
        "ReactDOM.preconnect(): Expected the `crossOrigin` option (second argument) to be a string but encountered %s instead. Try removing this option or passing a string value instead.",
        getValueDescriptorExpectingObjectForWarning(options.crossOrigin)
      ) : console.error(
        "ReactDOM.preconnect(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.",
        getValueDescriptorExpectingObjectForWarning(href)
      );
      "string" === typeof href && (options ? (options = options.crossOrigin, options = "string" === typeof options ? "use-credentials" === options ? options : "" : void 0) : options = null, Internals.d.C(href, options));
    };
    reactDom_reactServer_development.prefetchDNS = function(href) {
      if ("string" !== typeof href || !href)
        console.error(
          "ReactDOM.prefetchDNS(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.",
          getValueDescriptorExpectingObjectForWarning(href)
        );
      else if (1 < arguments.length) {
        var options = arguments[1];
        "object" === typeof options && options.hasOwnProperty("crossOrigin") ? console.error(
          "ReactDOM.prefetchDNS(): Expected only one argument, `href`, but encountered %s as a second argument instead. This argument is reserved for future options and is currently disallowed. It looks like the you are attempting to set a crossOrigin property for this DNS lookup hint. Browsers do not perform DNS queries using CORS and setting this attribute on the resource hint has no effect. Try calling ReactDOM.prefetchDNS() with just a single string argument, `href`.",
          getValueDescriptorExpectingEnumForWarning(options)
        ) : console.error(
          "ReactDOM.prefetchDNS(): Expected only one argument, `href`, but encountered %s as a second argument instead. This argument is reserved for future options and is currently disallowed. Try calling ReactDOM.prefetchDNS() with just a single string argument, `href`.",
          getValueDescriptorExpectingEnumForWarning(options)
        );
      }
      "string" === typeof href && Internals.d.D(href);
    };
    reactDom_reactServer_development.preinit = function(href, options) {
      "string" === typeof href && href ? null == options || "object" !== typeof options ? console.error(
        "ReactDOM.preinit(): Expected the `options` argument (second) to be an object with an `as` property describing the type of resource to be preinitialized but encountered %s instead.",
        getValueDescriptorExpectingEnumForWarning(options)
      ) : "style" !== options.as && "script" !== options.as && console.error(
        'ReactDOM.preinit(): Expected the `as` property in the `options` argument (second) to contain a valid value describing the type of resource to be preinitialized but encountered %s instead. Valid values for `as` are "style" and "script".',
        getValueDescriptorExpectingEnumForWarning(options.as)
      ) : console.error(
        "ReactDOM.preinit(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.",
        getValueDescriptorExpectingObjectForWarning(href)
      );
      if ("string" === typeof href && options && "string" === typeof options.as) {
        var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin), integrity = "string" === typeof options.integrity ? options.integrity : void 0, fetchPriority = "string" === typeof options.fetchPriority ? options.fetchPriority : void 0;
        "style" === as ? Internals.d.S(
          href,
          "string" === typeof options.precedence ? options.precedence : void 0,
          {
            crossOrigin,
            integrity,
            fetchPriority
          }
        ) : "script" === as && Internals.d.X(href, {
          crossOrigin,
          integrity,
          fetchPriority,
          nonce: "string" === typeof options.nonce ? options.nonce : void 0
        });
      }
    };
    reactDom_reactServer_development.preinitModule = function(href, options) {
      var encountered = "";
      "string" === typeof href && href || (encountered += " The `href` argument encountered was " + getValueDescriptorExpectingObjectForWarning(href) + ".");
      void 0 !== options && "object" !== typeof options ? encountered += " The `options` argument encountered was " + getValueDescriptorExpectingObjectForWarning(options) + "." : options && "as" in options && "script" !== options.as && (encountered += " The `as` option encountered was " + getValueDescriptorExpectingEnumForWarning(options.as) + ".");
      if (encountered)
        console.error(
          "ReactDOM.preinitModule(): Expected up to two arguments, a non-empty `href` string and, optionally, an `options` object with a valid `as` property.%s",
          encountered
        );
      else
        switch (encountered = options && "string" === typeof options.as ? options.as : "script", encountered) {
          case "script":
            break;
          default:
            encountered = getValueDescriptorExpectingEnumForWarning(encountered), console.error(
              'ReactDOM.preinitModule(): Currently the only supported "as" type for this function is "script" but received "%s" instead. This warning was generated for `href` "%s". In the future other module types will be supported, aligning with the import-attributes proposal. Learn more here: (https://github.com/tc39/proposal-import-attributes)',
              encountered,
              href
            );
        }
      if ("string" === typeof href)
        if ("object" === typeof options && null !== options) {
          if (null == options.as || "script" === options.as)
            encountered = getCrossOriginStringAs(
              options.as,
              options.crossOrigin
            ), Internals.d.M(href, {
              crossOrigin: encountered,
              integrity: "string" === typeof options.integrity ? options.integrity : void 0,
              nonce: "string" === typeof options.nonce ? options.nonce : void 0
            });
        } else null == options && Internals.d.M(href);
    };
    reactDom_reactServer_development.preload = function(href, options) {
      var encountered = "";
      "string" === typeof href && href || (encountered += " The `href` argument encountered was " + getValueDescriptorExpectingObjectForWarning(href) + ".");
      null == options || "object" !== typeof options ? encountered += " The `options` argument encountered was " + getValueDescriptorExpectingObjectForWarning(options) + "." : "string" === typeof options.as && options.as || (encountered += " The `as` option encountered was " + getValueDescriptorExpectingObjectForWarning(options.as) + ".");
      encountered && console.error(
        'ReactDOM.preload(): Expected two arguments, a non-empty `href` string and an `options` object with an `as` property valid for a `<link rel="preload" as="..." />` tag.%s',
        encountered
      );
      if ("string" === typeof href && "object" === typeof options && null !== options && "string" === typeof options.as) {
        encountered = options.as;
        var crossOrigin = getCrossOriginStringAs(
          encountered,
          options.crossOrigin
        );
        Internals.d.L(href, encountered, {
          crossOrigin,
          integrity: "string" === typeof options.integrity ? options.integrity : void 0,
          nonce: "string" === typeof options.nonce ? options.nonce : void 0,
          type: "string" === typeof options.type ? options.type : void 0,
          fetchPriority: "string" === typeof options.fetchPriority ? options.fetchPriority : void 0,
          referrerPolicy: "string" === typeof options.referrerPolicy ? options.referrerPolicy : void 0,
          imageSrcSet: "string" === typeof options.imageSrcSet ? options.imageSrcSet : void 0,
          imageSizes: "string" === typeof options.imageSizes ? options.imageSizes : void 0,
          media: "string" === typeof options.media ? options.media : void 0
        });
      }
    };
    reactDom_reactServer_development.preloadModule = function(href, options) {
      var encountered = "";
      "string" === typeof href && href || (encountered += " The `href` argument encountered was " + getValueDescriptorExpectingObjectForWarning(href) + ".");
      void 0 !== options && "object" !== typeof options ? encountered += " The `options` argument encountered was " + getValueDescriptorExpectingObjectForWarning(options) + "." : options && "as" in options && "string" !== typeof options.as && (encountered += " The `as` option encountered was " + getValueDescriptorExpectingObjectForWarning(options.as) + ".");
      encountered && console.error(
        'ReactDOM.preloadModule(): Expected two arguments, a non-empty `href` string and, optionally, an `options` object with an `as` property valid for a `<link rel="modulepreload" as="..." />` tag.%s',
        encountered
      );
      "string" === typeof href && (options ? (encountered = getCrossOriginStringAs(
        options.as,
        options.crossOrigin
      ), Internals.d.m(href, {
        as: "string" === typeof options.as && "script" !== options.as ? options.as : void 0,
        crossOrigin: encountered,
        integrity: "string" === typeof options.integrity ? options.integrity : void 0
      })) : Internals.d.m(href));
    };
    reactDom_reactServer_development.version = "19.2.4";
  })();
  return reactDom_reactServer_development;
}
var hasRequiredReactDom_reactServer;
function requireReactDom_reactServer() {
  if (hasRequiredReactDom_reactServer) return reactDom_reactServer.exports;
  hasRequiredReactDom_reactServer = 1;
  if (process.env.NODE_ENV === "production") {
    reactDom_reactServer.exports = requireReactDom_reactServer_production();
  } else {
    reactDom_reactServer.exports = requireReactDom_reactServer_development();
  }
  return reactDom_reactServer.exports;
}
var hasRequiredReactServerDomWebpackServer_edge_production;
function requireReactServerDomWebpackServer_edge_production() {
  if (hasRequiredReactServerDomWebpackServer_edge_production) return reactServerDomWebpackServer_edge_production;
  hasRequiredReactServerDomWebpackServer_edge_production = 1;
  const __viteRscAsyncHooks = require$$0;
  globalThis.AsyncLocalStorage = __viteRscAsyncHooks.AsyncLocalStorage;
  var ReactDOM = requireReactDom_reactServer(), React2 = requireReact_reactServer(), REACT_LEGACY_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.element"), REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment"), REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo"), REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy"), REACT_MEMO_CACHE_SENTINEL = /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel");
  var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
  function getIteratorFn(maybeIterable) {
    if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
    maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
    return "function" === typeof maybeIterable ? maybeIterable : null;
  }
  var ASYNC_ITERATOR = Symbol.asyncIterator;
  function handleErrorInNextTick(error) {
    setTimeout(function() {
      throw error;
    });
  }
  var LocalPromise = Promise, scheduleMicrotask = "function" === typeof queueMicrotask ? queueMicrotask : function(callback) {
    LocalPromise.resolve(null).then(callback).catch(handleErrorInNextTick);
  }, currentView = null, writtenBytes = 0;
  function writeChunkAndReturn(destination, chunk) {
    if (0 !== chunk.byteLength)
      if (2048 < chunk.byteLength)
        0 < writtenBytes && (destination.enqueue(
          new Uint8Array(currentView.buffer, 0, writtenBytes)
        ), currentView = new Uint8Array(2048), writtenBytes = 0), destination.enqueue(chunk);
      else {
        var allowableBytes = currentView.length - writtenBytes;
        allowableBytes < chunk.byteLength && (0 === allowableBytes ? destination.enqueue(currentView) : (currentView.set(chunk.subarray(0, allowableBytes), writtenBytes), destination.enqueue(currentView), chunk = chunk.subarray(allowableBytes)), currentView = new Uint8Array(2048), writtenBytes = 0);
        currentView.set(chunk, writtenBytes);
        writtenBytes += chunk.byteLength;
      }
    return true;
  }
  var textEncoder = new TextEncoder();
  function stringToChunk(content) {
    return textEncoder.encode(content);
  }
  function byteLengthOfChunk(chunk) {
    return chunk.byteLength;
  }
  function closeWithError(destination, error) {
    "function" === typeof destination.error ? destination.error(error) : destination.close();
  }
  var CLIENT_REFERENCE_TAG$1 = /* @__PURE__ */ Symbol.for("react.client.reference"), SERVER_REFERENCE_TAG = /* @__PURE__ */ Symbol.for("react.server.reference");
  function registerClientReferenceImpl(proxyImplementation, id, async) {
    return Object.defineProperties(proxyImplementation, {
      $$typeof: { value: CLIENT_REFERENCE_TAG$1 },
      $$id: { value: id },
      $$async: { value: async }
    });
  }
  var FunctionBind = Function.prototype.bind, ArraySlice = Array.prototype.slice;
  function bind() {
    var newFn = FunctionBind.apply(this, arguments);
    if (this.$$typeof === SERVER_REFERENCE_TAG) {
      var args = ArraySlice.call(arguments, 1), $$typeof = { value: SERVER_REFERENCE_TAG }, $$id = { value: this.$$id };
      args = { value: this.$$bound ? this.$$bound.concat(args) : args };
      return Object.defineProperties(newFn, {
        $$typeof,
        $$id,
        $$bound: args,
        bind: { value: bind, configurable: true }
      });
    }
    return newFn;
  }
  var serverReferenceToString = {
    value: function() {
      return "function () { [omitted code] }";
    },
    configurable: true,
    writable: true
  }, PROMISE_PROTOTYPE = Promise.prototype, deepProxyHandlers = {
    get: function(target, name) {
      switch (name) {
        case "$$typeof":
          return target.$$typeof;
        case "$$id":
          return target.$$id;
        case "$$async":
          return target.$$async;
        case "name":
          return target.name;
        case "displayName":
          return;
        case "defaultProps":
          return;
        case "_debugInfo":
          return;
        case "toJSON":
          return;
        case Symbol.toPrimitive:
          return Object.prototype[Symbol.toPrimitive];
        case Symbol.toStringTag:
          return Object.prototype[Symbol.toStringTag];
        case "Provider":
          throw Error(
            "Cannot render a Client Context Provider on the Server. Instead, you can export a Client Component wrapper that itself renders a Client Context Provider."
          );
        case "then":
          throw Error(
            "Cannot await or return from a thenable. You cannot await a client module from a server component."
          );
      }
      throw Error(
        "Cannot access " + (String(target.name) + "." + String(name)) + " on the server. You cannot dot into a client module from a server component. You can only pass the imported name through."
      );
    },
    set: function() {
      throw Error("Cannot assign to a client module from a server module.");
    }
  };
  function getReference(target, name) {
    switch (name) {
      case "$$typeof":
        return target.$$typeof;
      case "$$id":
        return target.$$id;
      case "$$async":
        return target.$$async;
      case "name":
        return target.name;
      case "defaultProps":
        return;
      case "_debugInfo":
        return;
      case "toJSON":
        return;
      case Symbol.toPrimitive:
        return Object.prototype[Symbol.toPrimitive];
      case Symbol.toStringTag:
        return Object.prototype[Symbol.toStringTag];
      case "__esModule":
        var moduleId = target.$$id;
        target.default = registerClientReferenceImpl(
          function() {
            throw Error(
              "Attempted to call the default export of " + moduleId + " from the server but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component."
            );
          },
          target.$$id + "#",
          target.$$async
        );
        return true;
      case "then":
        if (target.then) return target.then;
        if (target.$$async) return;
        var clientReference = registerClientReferenceImpl({}, target.$$id, true), proxy = new Proxy(clientReference, proxyHandlers$1);
        target.status = "fulfilled";
        target.value = proxy;
        return target.then = registerClientReferenceImpl(
          function(resolve) {
            return Promise.resolve(resolve(proxy));
          },
          target.$$id + "#then",
          false
        );
    }
    if ("symbol" === typeof name)
      throw Error(
        "Cannot read Symbol exports. Only named exports are supported on a client module imported on the server."
      );
    clientReference = target[name];
    clientReference || (clientReference = registerClientReferenceImpl(
      function() {
        throw Error(
          "Attempted to call " + String(name) + "() from the server but " + String(name) + " is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component."
        );
      },
      target.$$id + "#" + name,
      target.$$async
    ), Object.defineProperty(clientReference, "name", { value: name }), clientReference = target[name] = new Proxy(clientReference, deepProxyHandlers));
    return clientReference;
  }
  var proxyHandlers$1 = {
    get: function(target, name) {
      return getReference(target, name);
    },
    getOwnPropertyDescriptor: function(target, name) {
      var descriptor = Object.getOwnPropertyDescriptor(target, name);
      descriptor || (descriptor = {
        value: getReference(target, name),
        writable: false,
        configurable: false,
        enumerable: false
      }, Object.defineProperty(target, name, descriptor));
      return descriptor;
    },
    getPrototypeOf: function() {
      return PROMISE_PROTOTYPE;
    },
    set: function() {
      throw Error("Cannot assign to a client module from a server module.");
    }
  }, ReactDOMSharedInternals = ReactDOM.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, previousDispatcher = ReactDOMSharedInternals.d;
  ReactDOMSharedInternals.d = {
    f: previousDispatcher.f,
    r: previousDispatcher.r,
    D: prefetchDNS,
    C: preconnect,
    L: preload,
    m: preloadModule$1,
    X: preinitScript,
    S: preinitStyle,
    M: preinitModuleScript
  };
  function prefetchDNS(href) {
    if ("string" === typeof href && href) {
      var request = resolveRequest();
      if (request) {
        var hints = request.hints, key = "D|" + href;
        hints.has(key) || (hints.add(key), emitHint(request, "D", href));
      } else previousDispatcher.D(href);
    }
  }
  function preconnect(href, crossOrigin) {
    if ("string" === typeof href) {
      var request = resolveRequest();
      if (request) {
        var hints = request.hints, key = "C|" + (null == crossOrigin ? "null" : crossOrigin) + "|" + href;
        hints.has(key) || (hints.add(key), "string" === typeof crossOrigin ? emitHint(request, "C", [href, crossOrigin]) : emitHint(request, "C", href));
      } else previousDispatcher.C(href, crossOrigin);
    }
  }
  function preload(href, as, options) {
    if ("string" === typeof href) {
      var request = resolveRequest();
      if (request) {
        var hints = request.hints, key = "L";
        if ("image" === as && options) {
          var imageSrcSet = options.imageSrcSet, imageSizes = options.imageSizes, uniquePart = "";
          "string" === typeof imageSrcSet && "" !== imageSrcSet ? (uniquePart += "[" + imageSrcSet + "]", "string" === typeof imageSizes && (uniquePart += "[" + imageSizes + "]")) : uniquePart += "[][]" + href;
          key += "[image]" + uniquePart;
        } else key += "[" + as + "]" + href;
        hints.has(key) || (hints.add(key), (options = trimOptions(options)) ? emitHint(request, "L", [href, as, options]) : emitHint(request, "L", [href, as]));
      } else previousDispatcher.L(href, as, options);
    }
  }
  function preloadModule$1(href, options) {
    if ("string" === typeof href) {
      var request = resolveRequest();
      if (request) {
        var hints = request.hints, key = "m|" + href;
        if (hints.has(key)) return;
        hints.add(key);
        return (options = trimOptions(options)) ? emitHint(request, "m", [href, options]) : emitHint(request, "m", href);
      }
      previousDispatcher.m(href, options);
    }
  }
  function preinitStyle(href, precedence, options) {
    if ("string" === typeof href) {
      var request = resolveRequest();
      if (request) {
        var hints = request.hints, key = "S|" + href;
        if (hints.has(key)) return;
        hints.add(key);
        return (options = trimOptions(options)) ? emitHint(request, "S", [
          href,
          "string" === typeof precedence ? precedence : 0,
          options
        ]) : "string" === typeof precedence ? emitHint(request, "S", [href, precedence]) : emitHint(request, "S", href);
      }
      previousDispatcher.S(href, precedence, options);
    }
  }
  function preinitScript(src, options) {
    if ("string" === typeof src) {
      var request = resolveRequest();
      if (request) {
        var hints = request.hints, key = "X|" + src;
        if (hints.has(key)) return;
        hints.add(key);
        return (options = trimOptions(options)) ? emitHint(request, "X", [src, options]) : emitHint(request, "X", src);
      }
      previousDispatcher.X(src, options);
    }
  }
  function preinitModuleScript(src, options) {
    if ("string" === typeof src) {
      var request = resolveRequest();
      if (request) {
        var hints = request.hints, key = "M|" + src;
        if (hints.has(key)) return;
        hints.add(key);
        return (options = trimOptions(options)) ? emitHint(request, "M", [src, options]) : emitHint(request, "M", src);
      }
      previousDispatcher.M(src, options);
    }
  }
  function trimOptions(options) {
    if (null == options) return null;
    var hasProperties = false, trimmed = {}, key;
    for (key in options)
      null != options[key] && (hasProperties = true, trimmed[key] = options[key]);
    return hasProperties ? trimmed : null;
  }
  function getChildFormatContext(parentContext, type, props) {
    switch (type) {
      case "img":
        type = props.src;
        var srcSet = props.srcSet;
        if (!("lazy" === props.loading || !type && !srcSet || "string" !== typeof type && null != type || "string" !== typeof srcSet && null != srcSet || "low" === props.fetchPriority || parentContext & 3) && ("string" !== typeof type || ":" !== type[4] || "d" !== type[0] && "D" !== type[0] || "a" !== type[1] && "A" !== type[1] || "t" !== type[2] && "T" !== type[2] || "a" !== type[3] && "A" !== type[3]) && ("string" !== typeof srcSet || ":" !== srcSet[4] || "d" !== srcSet[0] && "D" !== srcSet[0] || "a" !== srcSet[1] && "A" !== srcSet[1] || "t" !== srcSet[2] && "T" !== srcSet[2] || "a" !== srcSet[3] && "A" !== srcSet[3])) {
          var sizes = "string" === typeof props.sizes ? props.sizes : void 0;
          var input = props.crossOrigin;
          preload(type || "", "image", {
            imageSrcSet: srcSet,
            imageSizes: sizes,
            crossOrigin: "string" === typeof input ? "use-credentials" === input ? input : "" : void 0,
            integrity: props.integrity,
            type: props.type,
            fetchPriority: props.fetchPriority,
            referrerPolicy: props.referrerPolicy
          });
        }
        return parentContext;
      case "link":
        type = props.rel;
        srcSet = props.href;
        if (!(parentContext & 1 || null != props.itemProp || "string" !== typeof type || "string" !== typeof srcSet || "" === srcSet))
          switch (type) {
            case "preload":
              preload(srcSet, props.as, {
                crossOrigin: props.crossOrigin,
                integrity: props.integrity,
                nonce: props.nonce,
                type: props.type,
                fetchPriority: props.fetchPriority,
                referrerPolicy: props.referrerPolicy,
                imageSrcSet: props.imageSrcSet,
                imageSizes: props.imageSizes,
                media: props.media
              });
              break;
            case "modulepreload":
              preloadModule$1(srcSet, {
                as: props.as,
                crossOrigin: props.crossOrigin,
                integrity: props.integrity,
                nonce: props.nonce
              });
              break;
            case "stylesheet":
              preload(srcSet, "stylesheet", {
                crossOrigin: props.crossOrigin,
                integrity: props.integrity,
                nonce: props.nonce,
                type: props.type,
                fetchPriority: props.fetchPriority,
                referrerPolicy: props.referrerPolicy,
                media: props.media
              });
          }
        return parentContext;
      case "picture":
        return parentContext | 2;
      case "noscript":
        return parentContext | 1;
      default:
        return parentContext;
    }
  }
  var supportsRequestStorage = "function" === typeof AsyncLocalStorage, requestStorage = supportsRequestStorage ? new AsyncLocalStorage() : null, TEMPORARY_REFERENCE_TAG = /* @__PURE__ */ Symbol.for("react.temporary.reference"), proxyHandlers = {
    get: function(target, name) {
      switch (name) {
        case "$$typeof":
          return target.$$typeof;
        case "name":
          return;
        case "displayName":
          return;
        case "defaultProps":
          return;
        case "_debugInfo":
          return;
        case "toJSON":
          return;
        case Symbol.toPrimitive:
          return Object.prototype[Symbol.toPrimitive];
        case Symbol.toStringTag:
          return Object.prototype[Symbol.toStringTag];
        case "Provider":
          throw Error(
            "Cannot render a Client Context Provider on the Server. Instead, you can export a Client Component wrapper that itself renders a Client Context Provider."
          );
        case "then":
          return;
      }
      throw Error(
        "Cannot access " + String(name) + " on the server. You cannot dot into a temporary client reference from a server component. You can only pass the value through to the client."
      );
    },
    set: function() {
      throw Error(
        "Cannot assign to a temporary client reference from a server module."
      );
    }
  };
  function createTemporaryReference(temporaryReferences, id) {
    var reference = Object.defineProperties(
      function() {
        throw Error(
          "Attempted to call a temporary Client Reference from the server but it is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component."
        );
      },
      { $$typeof: { value: TEMPORARY_REFERENCE_TAG } }
    );
    reference = new Proxy(reference, proxyHandlers);
    temporaryReferences.set(reference, id);
    return reference;
  }
  function noop() {
  }
  var SuspenseException = Error(
    "Suspense Exception: This is not a real error! It's an implementation detail of `use` to interrupt the current render. You must either rethrow it immediately, or move the `use` call outside of the `try/catch` block. Capturing without rethrowing will lead to unexpected behavior.\n\nTo handle async errors, wrap your component in an error boundary, or call the promise's `.catch` method and pass the result to `use`."
  );
  function trackUsedThenable(thenableState2, thenable, index) {
    index = thenableState2[index];
    void 0 === index ? thenableState2.push(thenable) : index !== thenable && (thenable.then(noop, noop), thenable = index);
    switch (thenable.status) {
      case "fulfilled":
        return thenable.value;
      case "rejected":
        throw thenable.reason;
      default:
        "string" === typeof thenable.status ? thenable.then(noop, noop) : (thenableState2 = thenable, thenableState2.status = "pending", thenableState2.then(
          function(fulfilledValue) {
            if ("pending" === thenable.status) {
              var fulfilledThenable = thenable;
              fulfilledThenable.status = "fulfilled";
              fulfilledThenable.value = fulfilledValue;
            }
          },
          function(error) {
            if ("pending" === thenable.status) {
              var rejectedThenable = thenable;
              rejectedThenable.status = "rejected";
              rejectedThenable.reason = error;
            }
          }
        ));
        switch (thenable.status) {
          case "fulfilled":
            return thenable.value;
          case "rejected":
            throw thenable.reason;
        }
        suspendedThenable = thenable;
        throw SuspenseException;
    }
  }
  var suspendedThenable = null;
  function getSuspendedThenable() {
    if (null === suspendedThenable)
      throw Error(
        "Expected a suspended thenable. This is a bug in React. Please file an issue."
      );
    var thenable = suspendedThenable;
    suspendedThenable = null;
    return thenable;
  }
  var currentRequest$1 = null, thenableIndexCounter = 0, thenableState = null;
  function getThenableStateAfterSuspending() {
    var state = thenableState || [];
    thenableState = null;
    return state;
  }
  var HooksDispatcher = {
    readContext: unsupportedContext,
    use,
    useCallback: function(callback) {
      return callback;
    },
    useContext: unsupportedContext,
    useEffect: unsupportedHook,
    useImperativeHandle: unsupportedHook,
    useLayoutEffect: unsupportedHook,
    useInsertionEffect: unsupportedHook,
    useMemo: function(nextCreate) {
      return nextCreate();
    },
    useReducer: unsupportedHook,
    useRef: unsupportedHook,
    useState: unsupportedHook,
    useDebugValue: function() {
    },
    useDeferredValue: unsupportedHook,
    useTransition: unsupportedHook,
    useSyncExternalStore: unsupportedHook,
    useId,
    useHostTransitionStatus: unsupportedHook,
    useFormState: unsupportedHook,
    useActionState: unsupportedHook,
    useOptimistic: unsupportedHook,
    useMemoCache: function(size) {
      for (var data2 = Array(size), i = 0; i < size; i++)
        data2[i] = REACT_MEMO_CACHE_SENTINEL;
      return data2;
    },
    useCacheRefresh: function() {
      return unsupportedRefresh;
    }
  };
  HooksDispatcher.useEffectEvent = unsupportedHook;
  function unsupportedHook() {
    throw Error("This Hook is not supported in Server Components.");
  }
  function unsupportedRefresh() {
    throw Error("Refreshing the cache is not supported in Server Components.");
  }
  function unsupportedContext() {
    throw Error("Cannot read a Client Context from a Server Component.");
  }
  function useId() {
    if (null === currentRequest$1)
      throw Error("useId can only be used while React is rendering");
    var id = currentRequest$1.identifierCount++;
    return "_" + currentRequest$1.identifierPrefix + "S_" + id.toString(32) + "_";
  }
  function use(usable) {
    if (null !== usable && "object" === typeof usable || "function" === typeof usable) {
      if ("function" === typeof usable.then) {
        var index = thenableIndexCounter;
        thenableIndexCounter += 1;
        null === thenableState && (thenableState = []);
        return trackUsedThenable(thenableState, usable, index);
      }
      usable.$$typeof === REACT_CONTEXT_TYPE && unsupportedContext();
    }
    if (usable.$$typeof === CLIENT_REFERENCE_TAG$1) {
      if (null != usable.value && usable.value.$$typeof === REACT_CONTEXT_TYPE)
        throw Error("Cannot read a Client Context from a Server Component.");
      throw Error("Cannot use() an already resolved Client Reference.");
    }
    throw Error("An unsupported type was passed to use(): " + String(usable));
  }
  var DefaultAsyncDispatcher = {
    getCacheForType: function(resourceType) {
      var JSCompiler_inline_result = (JSCompiler_inline_result = resolveRequest()) ? JSCompiler_inline_result.cache : /* @__PURE__ */ new Map();
      var entry = JSCompiler_inline_result.get(resourceType);
      void 0 === entry && (entry = resourceType(), JSCompiler_inline_result.set(resourceType, entry));
      return entry;
    },
    cacheSignal: function() {
      var request = resolveRequest();
      return request ? request.cacheController.signal : null;
    }
  }, ReactSharedInternalsServer = React2.__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  if (!ReactSharedInternalsServer)
    throw Error(
      'The "react" package in this environment is not configured correctly. The "react-server" condition must be enabled in any environment that runs React Server Components.'
    );
  var isArrayImpl = Array.isArray, getPrototypeOf = Object.getPrototypeOf;
  function objectName(object) {
    object = Object.prototype.toString.call(object);
    return object.slice(8, object.length - 1);
  }
  function describeValueForErrorMessage(value) {
    switch (typeof value) {
      case "string":
        return JSON.stringify(
          10 >= value.length ? value : value.slice(0, 10) + "..."
        );
      case "object":
        if (isArrayImpl(value)) return "[...]";
        if (null !== value && value.$$typeof === CLIENT_REFERENCE_TAG)
          return "client";
        value = objectName(value);
        return "Object" === value ? "{...}" : value;
      case "function":
        return value.$$typeof === CLIENT_REFERENCE_TAG ? "client" : (value = value.displayName || value.name) ? "function " + value : "function";
      default:
        return String(value);
    }
  }
  function describeElementType(type) {
    if ("string" === typeof type) return type;
    switch (type) {
      case REACT_SUSPENSE_TYPE:
        return "Suspense";
      case REACT_SUSPENSE_LIST_TYPE:
        return "SuspenseList";
    }
    if ("object" === typeof type)
      switch (type.$$typeof) {
        case REACT_FORWARD_REF_TYPE:
          return describeElementType(type.render);
        case REACT_MEMO_TYPE:
          return describeElementType(type.type);
        case REACT_LAZY_TYPE:
          var payload = type._payload;
          type = type._init;
          try {
            return describeElementType(type(payload));
          } catch (x) {
          }
      }
    return "";
  }
  var CLIENT_REFERENCE_TAG = /* @__PURE__ */ Symbol.for("react.client.reference");
  function describeObjectForErrorMessage(objectOrArray, expandedName) {
    var objKind = objectName(objectOrArray);
    if ("Object" !== objKind && "Array" !== objKind) return objKind;
    objKind = -1;
    var length = 0;
    if (isArrayImpl(objectOrArray)) {
      var str = "[";
      for (var i = 0; i < objectOrArray.length; i++) {
        0 < i && (str += ", ");
        var value = objectOrArray[i];
        value = "object" === typeof value && null !== value ? describeObjectForErrorMessage(value) : describeValueForErrorMessage(value);
        "" + i === expandedName ? (objKind = str.length, length = value.length, str += value) : str = 10 > value.length && 40 > str.length + value.length ? str + value : str + "...";
      }
      str += "]";
    } else if (objectOrArray.$$typeof === REACT_ELEMENT_TYPE)
      str = "<" + describeElementType(objectOrArray.type) + "/>";
    else {
      if (objectOrArray.$$typeof === CLIENT_REFERENCE_TAG) return "client";
      str = "{";
      i = Object.keys(objectOrArray);
      for (value = 0; value < i.length; value++) {
        0 < value && (str += ", ");
        var name = i[value], encodedKey = JSON.stringify(name);
        str += ('"' + name + '"' === encodedKey ? name : encodedKey) + ": ";
        encodedKey = objectOrArray[name];
        encodedKey = "object" === typeof encodedKey && null !== encodedKey ? describeObjectForErrorMessage(encodedKey) : describeValueForErrorMessage(encodedKey);
        name === expandedName ? (objKind = str.length, length = encodedKey.length, str += encodedKey) : str = 10 > encodedKey.length && 40 > str.length + encodedKey.length ? str + encodedKey : str + "...";
      }
      str += "}";
    }
    return void 0 === expandedName ? str : -1 < objKind && 0 < length ? (objectOrArray = " ".repeat(objKind) + "^".repeat(length), "\n  " + str + "\n  " + objectOrArray) : "\n  " + str;
  }
  var hasOwnProperty = Object.prototype.hasOwnProperty, ObjectPrototype$1 = Object.prototype, stringify = JSON.stringify;
  function defaultErrorHandler(error) {
    console.error(error);
  }
  function RequestInstance(type, model, bundlerConfig, onError, onPostpone, onAllReady, onFatalError, identifierPrefix, temporaryReferences) {
    if (null !== ReactSharedInternalsServer.A && ReactSharedInternalsServer.A !== DefaultAsyncDispatcher)
      throw Error("Currently React only supports one RSC renderer at a time.");
    ReactSharedInternalsServer.A = DefaultAsyncDispatcher;
    var abortSet = /* @__PURE__ */ new Set(), pingedTasks = [], hints = /* @__PURE__ */ new Set();
    this.type = type;
    this.status = 10;
    this.flushScheduled = false;
    this.destination = this.fatalError = null;
    this.bundlerConfig = bundlerConfig;
    this.cache = /* @__PURE__ */ new Map();
    this.cacheController = new AbortController();
    this.pendingChunks = this.nextChunkId = 0;
    this.hints = hints;
    this.abortableTasks = abortSet;
    this.pingedTasks = pingedTasks;
    this.completedImportChunks = [];
    this.completedHintChunks = [];
    this.completedRegularChunks = [];
    this.completedErrorChunks = [];
    this.writtenSymbols = /* @__PURE__ */ new Map();
    this.writtenClientReferences = /* @__PURE__ */ new Map();
    this.writtenServerReferences = /* @__PURE__ */ new Map();
    this.writtenObjects = /* @__PURE__ */ new WeakMap();
    this.temporaryReferences = temporaryReferences;
    this.identifierPrefix = identifierPrefix || "";
    this.identifierCount = 1;
    this.taintCleanupQueue = [];
    this.onError = void 0 === onError ? defaultErrorHandler : onError;
    this.onPostpone = void 0 === onPostpone ? noop : onPostpone;
    this.onAllReady = onAllReady;
    this.onFatalError = onFatalError;
    type = createTask(this, model, null, false, 0, abortSet);
    pingedTasks.push(type);
  }
  var currentRequest = null;
  function resolveRequest() {
    if (currentRequest) return currentRequest;
    if (supportsRequestStorage) {
      var store = requestStorage.getStore();
      if (store) return store;
    }
    return null;
  }
  function serializeThenable(request, task, thenable) {
    var newTask = createTask(
      request,
      thenable,
      task.keyPath,
      task.implicitSlot,
      task.formatContext,
      request.abortableTasks
    );
    switch (thenable.status) {
      case "fulfilled":
        return newTask.model = thenable.value, pingTask(request, newTask), newTask.id;
      case "rejected":
        return erroredTask(request, newTask, thenable.reason), newTask.id;
      default:
        if (12 === request.status)
          return request.abortableTasks.delete(newTask), 21 === request.type ? (haltTask(newTask), finishHaltedTask(newTask, request)) : (task = request.fatalError, abortTask(newTask), finishAbortedTask(newTask, request, task)), newTask.id;
        "string" !== typeof thenable.status && (thenable.status = "pending", thenable.then(
          function(fulfilledValue) {
            "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
          },
          function(error) {
            "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
          }
        ));
    }
    thenable.then(
      function(value) {
        newTask.model = value;
        pingTask(request, newTask);
      },
      function(reason) {
        0 === newTask.status && (erroredTask(request, newTask, reason), enqueueFlush(request));
      }
    );
    return newTask.id;
  }
  function serializeReadableStream(request, task, stream) {
    function progress(entry) {
      if (0 === streamTask.status)
        if (entry.done)
          streamTask.status = 1, entry = streamTask.id.toString(16) + ":C\n", request.completedRegularChunks.push(stringToChunk(entry)), request.abortableTasks.delete(streamTask), request.cacheController.signal.removeEventListener(
            "abort",
            abortStream
          ), enqueueFlush(request), callOnAllReadyIfReady(request);
        else
          try {
            streamTask.model = entry.value, request.pendingChunks++, tryStreamTask(request, streamTask), enqueueFlush(request), reader.read().then(progress, error);
          } catch (x$11) {
            error(x$11);
          }
    }
    function error(reason) {
      0 === streamTask.status && (request.cacheController.signal.removeEventListener("abort", abortStream), erroredTask(request, streamTask, reason), enqueueFlush(request), reader.cancel(reason).then(error, error));
    }
    function abortStream() {
      if (0 === streamTask.status) {
        var signal = request.cacheController.signal;
        signal.removeEventListener("abort", abortStream);
        signal = signal.reason;
        21 === request.type ? (request.abortableTasks.delete(streamTask), haltTask(streamTask), finishHaltedTask(streamTask, request)) : (erroredTask(request, streamTask, signal), enqueueFlush(request));
        reader.cancel(signal).then(error, error);
      }
    }
    var supportsBYOB = stream.supportsBYOB;
    if (void 0 === supportsBYOB)
      try {
        stream.getReader({ mode: "byob" }).releaseLock(), supportsBYOB = true;
      } catch (x) {
        supportsBYOB = false;
      }
    var reader = stream.getReader(), streamTask = createTask(
      request,
      task.model,
      task.keyPath,
      task.implicitSlot,
      task.formatContext,
      request.abortableTasks
    );
    request.pendingChunks++;
    task = streamTask.id.toString(16) + ":" + (supportsBYOB ? "r" : "R") + "\n";
    request.completedRegularChunks.push(stringToChunk(task));
    request.cacheController.signal.addEventListener("abort", abortStream);
    reader.read().then(progress, error);
    return serializeByValueID(streamTask.id);
  }
  function serializeAsyncIterable(request, task, iterable, iterator) {
    function progress(entry) {
      if (0 === streamTask.status)
        if (entry.done) {
          streamTask.status = 1;
          if (void 0 === entry.value)
            var endStreamRow = streamTask.id.toString(16) + ":C\n";
          else
            try {
              var chunkId = outlineModelWithFormatContext(
                request,
                entry.value,
                0
              );
              endStreamRow = streamTask.id.toString(16) + ":C" + stringify(serializeByValueID(chunkId)) + "\n";
            } catch (x) {
              error(x);
              return;
            }
          request.completedRegularChunks.push(stringToChunk(endStreamRow));
          request.abortableTasks.delete(streamTask);
          request.cacheController.signal.removeEventListener(
            "abort",
            abortIterable
          );
          enqueueFlush(request);
          callOnAllReadyIfReady(request);
        } else
          try {
            streamTask.model = entry.value, request.pendingChunks++, tryStreamTask(request, streamTask), enqueueFlush(request), iterator.next().then(progress, error);
          } catch (x$12) {
            error(x$12);
          }
    }
    function error(reason) {
      0 === streamTask.status && (request.cacheController.signal.removeEventListener(
        "abort",
        abortIterable
      ), erroredTask(request, streamTask, reason), enqueueFlush(request), "function" === typeof iterator.throw && iterator.throw(reason).then(error, error));
    }
    function abortIterable() {
      if (0 === streamTask.status) {
        var signal = request.cacheController.signal;
        signal.removeEventListener("abort", abortIterable);
        var reason = signal.reason;
        21 === request.type ? (request.abortableTasks.delete(streamTask), haltTask(streamTask), finishHaltedTask(streamTask, request)) : (erroredTask(request, streamTask, signal.reason), enqueueFlush(request));
        "function" === typeof iterator.throw && iterator.throw(reason).then(error, error);
      }
    }
    iterable = iterable === iterator;
    var streamTask = createTask(
      request,
      task.model,
      task.keyPath,
      task.implicitSlot,
      task.formatContext,
      request.abortableTasks
    );
    request.pendingChunks++;
    task = streamTask.id.toString(16) + ":" + (iterable ? "x" : "X") + "\n";
    request.completedRegularChunks.push(stringToChunk(task));
    request.cacheController.signal.addEventListener("abort", abortIterable);
    iterator.next().then(progress, error);
    return serializeByValueID(streamTask.id);
  }
  function emitHint(request, code, model) {
    model = stringify(model);
    code = stringToChunk(":H" + code + model + "\n");
    request.completedHintChunks.push(code);
    enqueueFlush(request);
  }
  function readThenable(thenable) {
    if ("fulfilled" === thenable.status) return thenable.value;
    if ("rejected" === thenable.status) throw thenable.reason;
    throw thenable;
  }
  function createLazyWrapperAroundWakeable(request, task, wakeable) {
    switch (wakeable.status) {
      case "fulfilled":
        return wakeable.value;
      case "rejected":
        break;
      default:
        "string" !== typeof wakeable.status && (wakeable.status = "pending", wakeable.then(
          function(fulfilledValue) {
            "pending" === wakeable.status && (wakeable.status = "fulfilled", wakeable.value = fulfilledValue);
          },
          function(error) {
            "pending" === wakeable.status && (wakeable.status = "rejected", wakeable.reason = error);
          }
        ));
    }
    return { $$typeof: REACT_LAZY_TYPE, _payload: wakeable, _init: readThenable };
  }
  function voidHandler() {
  }
  function processServerComponentReturnValue(request, task, Component, result) {
    if ("object" !== typeof result || null === result || result.$$typeof === CLIENT_REFERENCE_TAG$1)
      return result;
    if ("function" === typeof result.then)
      return createLazyWrapperAroundWakeable(request, task, result);
    var iteratorFn = getIteratorFn(result);
    return iteratorFn ? (request = {}, request[Symbol.iterator] = function() {
      return iteratorFn.call(result);
    }, request) : "function" !== typeof result[ASYNC_ITERATOR] || "function" === typeof ReadableStream && result instanceof ReadableStream ? result : (request = {}, request[ASYNC_ITERATOR] = function() {
      return result[ASYNC_ITERATOR]();
    }, request);
  }
  function renderFunctionComponent(request, task, key, Component, props) {
    var prevThenableState = task.thenableState;
    task.thenableState = null;
    thenableIndexCounter = 0;
    thenableState = prevThenableState;
    props = Component(props, void 0);
    if (12 === request.status)
      throw "object" === typeof props && null !== props && "function" === typeof props.then && props.$$typeof !== CLIENT_REFERENCE_TAG$1 && props.then(voidHandler, voidHandler), null;
    props = processServerComponentReturnValue(request, task, Component, props);
    Component = task.keyPath;
    prevThenableState = task.implicitSlot;
    null !== key ? task.keyPath = null === Component ? key : Component + "," + key : null === Component && (task.implicitSlot = true);
    request = renderModelDestructive(request, task, emptyRoot, "", props);
    task.keyPath = Component;
    task.implicitSlot = prevThenableState;
    return request;
  }
  function renderFragment(request, task, children) {
    return null !== task.keyPath ? (request = [
      REACT_ELEMENT_TYPE,
      REACT_FRAGMENT_TYPE,
      task.keyPath,
      { children }
    ], task.implicitSlot ? [request] : request) : children;
  }
  var serializedSize = 0;
  function deferTask(request, task) {
    task = createTask(
      request,
      task.model,
      task.keyPath,
      task.implicitSlot,
      task.formatContext,
      request.abortableTasks
    );
    pingTask(request, task);
    return serializeLazyID(task.id);
  }
  function renderElement(request, task, type, key, ref, props) {
    if (null !== ref && void 0 !== ref)
      throw Error(
        "Refs cannot be used in Server Components, nor passed to Client Components."
      );
    if ("function" === typeof type && type.$$typeof !== CLIENT_REFERENCE_TAG$1 && type.$$typeof !== TEMPORARY_REFERENCE_TAG)
      return renderFunctionComponent(request, task, key, type, props);
    if (type === REACT_FRAGMENT_TYPE && null === key)
      return type = task.implicitSlot, null === task.keyPath && (task.implicitSlot = true), props = renderModelDestructive(
        request,
        task,
        emptyRoot,
        "",
        props.children
      ), task.implicitSlot = type, props;
    if (null != type && "object" === typeof type && type.$$typeof !== CLIENT_REFERENCE_TAG$1)
      switch (type.$$typeof) {
        case REACT_LAZY_TYPE:
          var init2 = type._init;
          type = init2(type._payload);
          if (12 === request.status) throw null;
          return renderElement(request, task, type, key, ref, props);
        case REACT_FORWARD_REF_TYPE:
          return renderFunctionComponent(request, task, key, type.render, props);
        case REACT_MEMO_TYPE:
          return renderElement(request, task, type.type, key, ref, props);
      }
    else
      "string" === typeof type && (ref = task.formatContext, init2 = getChildFormatContext(ref, type, props), ref !== init2 && null != props.children && outlineModelWithFormatContext(request, props.children, init2));
    request = key;
    key = task.keyPath;
    null === request ? request = key : null !== key && (request = key + "," + request);
    props = [REACT_ELEMENT_TYPE, type, request, props];
    task = task.implicitSlot && null !== request ? [props] : props;
    return task;
  }
  function pingTask(request, task) {
    var pingedTasks = request.pingedTasks;
    pingedTasks.push(task);
    1 === pingedTasks.length && (request.flushScheduled = null !== request.destination, 21 === request.type || 10 === request.status ? scheduleMicrotask(function() {
      return performWork(request);
    }) : setTimeout(function() {
      return performWork(request);
    }, 0));
  }
  function createTask(request, model, keyPath, implicitSlot, formatContext, abortSet) {
    request.pendingChunks++;
    var id = request.nextChunkId++;
    "object" !== typeof model || null === model || null !== keyPath || implicitSlot || request.writtenObjects.set(model, serializeByValueID(id));
    var task = {
      id,
      status: 0,
      model,
      keyPath,
      implicitSlot,
      formatContext,
      ping: function() {
        return pingTask(request, task);
      },
      toJSON: function(parentPropertyName, value) {
        serializedSize += parentPropertyName.length;
        var prevKeyPath = task.keyPath, prevImplicitSlot = task.implicitSlot;
        try {
          var JSCompiler_inline_result = renderModelDestructive(
            request,
            task,
            this,
            parentPropertyName,
            value
          );
        } catch (thrownValue) {
          if (parentPropertyName = task.model, parentPropertyName = "object" === typeof parentPropertyName && null !== parentPropertyName && (parentPropertyName.$$typeof === REACT_ELEMENT_TYPE || parentPropertyName.$$typeof === REACT_LAZY_TYPE), 12 === request.status)
            task.status = 3, 21 === request.type ? (prevKeyPath = request.nextChunkId++, prevKeyPath = parentPropertyName ? serializeLazyID(prevKeyPath) : serializeByValueID(prevKeyPath), JSCompiler_inline_result = prevKeyPath) : (prevKeyPath = request.fatalError, JSCompiler_inline_result = parentPropertyName ? serializeLazyID(prevKeyPath) : serializeByValueID(prevKeyPath));
          else if (value = thrownValue === SuspenseException ? getSuspendedThenable() : thrownValue, "object" === typeof value && null !== value && "function" === typeof value.then) {
            JSCompiler_inline_result = createTask(
              request,
              task.model,
              task.keyPath,
              task.implicitSlot,
              task.formatContext,
              request.abortableTasks
            );
            var ping = JSCompiler_inline_result.ping;
            value.then(ping, ping);
            JSCompiler_inline_result.thenableState = getThenableStateAfterSuspending();
            task.keyPath = prevKeyPath;
            task.implicitSlot = prevImplicitSlot;
            JSCompiler_inline_result = parentPropertyName ? serializeLazyID(JSCompiler_inline_result.id) : serializeByValueID(JSCompiler_inline_result.id);
          } else
            task.keyPath = prevKeyPath, task.implicitSlot = prevImplicitSlot, request.pendingChunks++, prevKeyPath = request.nextChunkId++, prevImplicitSlot = logRecoverableError(request, value), emitErrorChunk(request, prevKeyPath, prevImplicitSlot), JSCompiler_inline_result = parentPropertyName ? serializeLazyID(prevKeyPath) : serializeByValueID(prevKeyPath);
        }
        return JSCompiler_inline_result;
      },
      thenableState: null
    };
    abortSet.add(task);
    return task;
  }
  function serializeByValueID(id) {
    return "$" + id.toString(16);
  }
  function serializeLazyID(id) {
    return "$L" + id.toString(16);
  }
  function encodeReferenceChunk(request, id, reference) {
    request = stringify(reference);
    id = id.toString(16) + ":" + request + "\n";
    return stringToChunk(id);
  }
  function serializeClientReference(request, parent, parentPropertyName, clientReference) {
    var clientReferenceKey = clientReference.$$async ? clientReference.$$id + "#async" : clientReference.$$id, writtenClientReferences = request.writtenClientReferences, existingId = writtenClientReferences.get(clientReferenceKey);
    if (void 0 !== existingId)
      return parent[0] === REACT_ELEMENT_TYPE && "1" === parentPropertyName ? serializeLazyID(existingId) : serializeByValueID(existingId);
    try {
      var config = request.bundlerConfig, modulePath = clientReference.$$id;
      existingId = "";
      var resolvedModuleData = config[modulePath];
      if (resolvedModuleData) existingId = resolvedModuleData.name;
      else {
        var idx = modulePath.lastIndexOf("#");
        -1 !== idx && (existingId = modulePath.slice(idx + 1), resolvedModuleData = config[modulePath.slice(0, idx)]);
        if (!resolvedModuleData)
          throw Error(
            'Could not find the module "' + modulePath + '" in the React Client Manifest. This is probably a bug in the React Server Components bundler.'
          );
      }
      if (true === resolvedModuleData.async && true === clientReference.$$async)
        throw Error(
          'The module "' + modulePath + '" is marked as an async ESM module but was loaded as a CJS proxy. This is probably a bug in the React Server Components bundler.'
        );
      var JSCompiler_inline_result = true === resolvedModuleData.async || true === clientReference.$$async ? [resolvedModuleData.id, resolvedModuleData.chunks, existingId, 1] : [resolvedModuleData.id, resolvedModuleData.chunks, existingId];
      request.pendingChunks++;
      var importId = request.nextChunkId++, json = stringify(JSCompiler_inline_result), row = importId.toString(16) + ":I" + json + "\n", processedChunk = stringToChunk(row);
      request.completedImportChunks.push(processedChunk);
      writtenClientReferences.set(clientReferenceKey, importId);
      return parent[0] === REACT_ELEMENT_TYPE && "1" === parentPropertyName ? serializeLazyID(importId) : serializeByValueID(importId);
    } catch (x) {
      return request.pendingChunks++, parent = request.nextChunkId++, parentPropertyName = logRecoverableError(request, x), emitErrorChunk(request, parent, parentPropertyName), serializeByValueID(parent);
    }
  }
  function outlineModelWithFormatContext(request, value, formatContext) {
    value = createTask(
      request,
      value,
      null,
      false,
      formatContext,
      request.abortableTasks
    );
    retryTask(request, value);
    return value.id;
  }
  function serializeTypedArray(request, tag, typedArray) {
    request.pendingChunks++;
    var bufferId = request.nextChunkId++;
    emitTypedArrayChunk(request, bufferId, tag, typedArray, false);
    return serializeByValueID(bufferId);
  }
  function serializeBlob(request, blob) {
    function progress(entry) {
      if (0 === newTask.status)
        if (entry.done)
          request.cacheController.signal.removeEventListener("abort", abortBlob), pingTask(request, newTask);
        else
          return model.push(entry.value), reader.read().then(progress).catch(error);
    }
    function error(reason) {
      0 === newTask.status && (request.cacheController.signal.removeEventListener("abort", abortBlob), erroredTask(request, newTask, reason), enqueueFlush(request), reader.cancel(reason).then(error, error));
    }
    function abortBlob() {
      if (0 === newTask.status) {
        var signal = request.cacheController.signal;
        signal.removeEventListener("abort", abortBlob);
        signal = signal.reason;
        21 === request.type ? (request.abortableTasks.delete(newTask), haltTask(newTask), finishHaltedTask(newTask, request)) : (erroredTask(request, newTask, signal), enqueueFlush(request));
        reader.cancel(signal).then(error, error);
      }
    }
    var model = [blob.type], newTask = createTask(request, model, null, false, 0, request.abortableTasks), reader = blob.stream().getReader();
    request.cacheController.signal.addEventListener("abort", abortBlob);
    reader.read().then(progress).catch(error);
    return "$B" + newTask.id.toString(16);
  }
  var modelRoot = false;
  function renderModelDestructive(request, task, parent, parentPropertyName, value) {
    task.model = value;
    if (value === REACT_ELEMENT_TYPE) return "$";
    if (null === value) return null;
    if ("object" === typeof value) {
      switch (value.$$typeof) {
        case REACT_ELEMENT_TYPE:
          var elementReference = null, writtenObjects = request.writtenObjects;
          if (null === task.keyPath && !task.implicitSlot) {
            var existingReference = writtenObjects.get(value);
            if (void 0 !== existingReference)
              if (modelRoot === value) modelRoot = null;
              else return existingReference;
            else
              -1 === parentPropertyName.indexOf(":") && (parent = writtenObjects.get(parent), void 0 !== parent && (elementReference = parent + ":" + parentPropertyName, writtenObjects.set(value, elementReference)));
          }
          if (3200 < serializedSize) return deferTask(request, task);
          parentPropertyName = value.props;
          parent = parentPropertyName.ref;
          request = renderElement(
            request,
            task,
            value.type,
            value.key,
            void 0 !== parent ? parent : null,
            parentPropertyName
          );
          "object" === typeof request && null !== request && null !== elementReference && (writtenObjects.has(request) || writtenObjects.set(request, elementReference));
          return request;
        case REACT_LAZY_TYPE:
          if (3200 < serializedSize) return deferTask(request, task);
          task.thenableState = null;
          parentPropertyName = value._init;
          value = parentPropertyName(value._payload);
          if (12 === request.status) throw null;
          return renderModelDestructive(request, task, emptyRoot, "", value);
        case REACT_LEGACY_ELEMENT_TYPE:
          throw Error(
            'A React Element from an older version of React was rendered. This is not supported. It can happen if:\n- Multiple copies of the "react" package is used.\n- A library pre-bundled an old copy of "react" or "react/jsx-runtime".\n- A compiler tries to "inline" JSX instead of using the runtime.'
          );
      }
      if (value.$$typeof === CLIENT_REFERENCE_TAG$1)
        return serializeClientReference(
          request,
          parent,
          parentPropertyName,
          value
        );
      if (void 0 !== request.temporaryReferences && (elementReference = request.temporaryReferences.get(value), void 0 !== elementReference))
        return "$T" + elementReference;
      elementReference = request.writtenObjects;
      writtenObjects = elementReference.get(value);
      if ("function" === typeof value.then) {
        if (void 0 !== writtenObjects) {
          if (null !== task.keyPath || task.implicitSlot)
            return "$@" + serializeThenable(request, task, value).toString(16);
          if (modelRoot === value) modelRoot = null;
          else return writtenObjects;
        }
        request = "$@" + serializeThenable(request, task, value).toString(16);
        elementReference.set(value, request);
        return request;
      }
      if (void 0 !== writtenObjects)
        if (modelRoot === value) {
          if (writtenObjects !== serializeByValueID(task.id))
            return writtenObjects;
          modelRoot = null;
        } else return writtenObjects;
      else if (-1 === parentPropertyName.indexOf(":") && (writtenObjects = elementReference.get(parent), void 0 !== writtenObjects)) {
        existingReference = parentPropertyName;
        if (isArrayImpl(parent) && parent[0] === REACT_ELEMENT_TYPE)
          switch (parentPropertyName) {
            case "1":
              existingReference = "type";
              break;
            case "2":
              existingReference = "key";
              break;
            case "3":
              existingReference = "props";
              break;
            case "4":
              existingReference = "_owner";
          }
        elementReference.set(value, writtenObjects + ":" + existingReference);
      }
      if (isArrayImpl(value)) return renderFragment(request, task, value);
      if (value instanceof Map)
        return value = Array.from(value), "$Q" + outlineModelWithFormatContext(request, value, 0).toString(16);
      if (value instanceof Set)
        return value = Array.from(value), "$W" + outlineModelWithFormatContext(request, value, 0).toString(16);
      if ("function" === typeof FormData && value instanceof FormData)
        return value = Array.from(value.entries()), "$K" + outlineModelWithFormatContext(request, value, 0).toString(16);
      if (value instanceof Error) return "$Z";
      if (value instanceof ArrayBuffer)
        return serializeTypedArray(request, "A", new Uint8Array(value));
      if (value instanceof Int8Array)
        return serializeTypedArray(request, "O", value);
      if (value instanceof Uint8Array)
        return serializeTypedArray(request, "o", value);
      if (value instanceof Uint8ClampedArray)
        return serializeTypedArray(request, "U", value);
      if (value instanceof Int16Array)
        return serializeTypedArray(request, "S", value);
      if (value instanceof Uint16Array)
        return serializeTypedArray(request, "s", value);
      if (value instanceof Int32Array)
        return serializeTypedArray(request, "L", value);
      if (value instanceof Uint32Array)
        return serializeTypedArray(request, "l", value);
      if (value instanceof Float32Array)
        return serializeTypedArray(request, "G", value);
      if (value instanceof Float64Array)
        return serializeTypedArray(request, "g", value);
      if (value instanceof BigInt64Array)
        return serializeTypedArray(request, "M", value);
      if (value instanceof BigUint64Array)
        return serializeTypedArray(request, "m", value);
      if (value instanceof DataView)
        return serializeTypedArray(request, "V", value);
      if ("function" === typeof Blob && value instanceof Blob)
        return serializeBlob(request, value);
      if (elementReference = getIteratorFn(value))
        return parentPropertyName = elementReference.call(value), parentPropertyName === value ? (value = Array.from(parentPropertyName), "$i" + outlineModelWithFormatContext(request, value, 0).toString(16)) : renderFragment(request, task, Array.from(parentPropertyName));
      if ("function" === typeof ReadableStream && value instanceof ReadableStream)
        return serializeReadableStream(request, task, value);
      elementReference = value[ASYNC_ITERATOR];
      if ("function" === typeof elementReference)
        return null !== task.keyPath ? (request = [
          REACT_ELEMENT_TYPE,
          REACT_FRAGMENT_TYPE,
          task.keyPath,
          { children: value }
        ], request = task.implicitSlot ? [request] : request) : (parentPropertyName = elementReference.call(value), request = serializeAsyncIterable(
          request,
          task,
          value,
          parentPropertyName
        )), request;
      if (value instanceof Date) return "$D" + value.toJSON();
      request = getPrototypeOf(value);
      if (request !== ObjectPrototype$1 && (null === request || null !== getPrototypeOf(request)))
        throw Error(
          "Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. Classes or null prototypes are not supported." + describeObjectForErrorMessage(parent, parentPropertyName)
        );
      return value;
    }
    if ("string" === typeof value) {
      serializedSize += value.length;
      if ("Z" === value[value.length - 1] && parent[parentPropertyName] instanceof Date)
        return "$D" + value;
      if (1024 <= value.length && null !== byteLengthOfChunk)
        return request.pendingChunks++, task = request.nextChunkId++, emitTextChunk(request, task, value, false), serializeByValueID(task);
      request = "$" === value[0] ? "$" + value : value;
      return request;
    }
    if ("boolean" === typeof value) return value;
    if ("number" === typeof value)
      return Number.isFinite(value) ? 0 === value && -Infinity === 1 / value ? "$-0" : value : Infinity === value ? "$Infinity" : -Infinity === value ? "$-Infinity" : "$NaN";
    if ("undefined" === typeof value) return "$undefined";
    if ("function" === typeof value) {
      if (value.$$typeof === CLIENT_REFERENCE_TAG$1)
        return serializeClientReference(
          request,
          parent,
          parentPropertyName,
          value
        );
      if (value.$$typeof === SERVER_REFERENCE_TAG)
        return task = request.writtenServerReferences, parentPropertyName = task.get(value), void 0 !== parentPropertyName ? request = "$h" + parentPropertyName.toString(16) : (parentPropertyName = value.$$bound, parentPropertyName = null === parentPropertyName ? null : Promise.resolve(parentPropertyName), request = outlineModelWithFormatContext(
          request,
          { id: value.$$id, bound: parentPropertyName },
          0
        ), task.set(value, request), request = "$h" + request.toString(16)), request;
      if (void 0 !== request.temporaryReferences && (request = request.temporaryReferences.get(value), void 0 !== request))
        return "$T" + request;
      if (value.$$typeof === TEMPORARY_REFERENCE_TAG)
        throw Error(
          "Could not reference an opaque temporary reference. This is likely due to misconfiguring the temporaryReferences options on the server."
        );
      if (/^on[A-Z]/.test(parentPropertyName))
        throw Error(
          "Event handlers cannot be passed to Client Component props." + describeObjectForErrorMessage(parent, parentPropertyName) + "\nIf you need interactivity, consider converting part of this to a Client Component."
        );
      throw Error(
        'Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server". Or maybe you meant to call this function rather than return it.' + describeObjectForErrorMessage(parent, parentPropertyName)
      );
    }
    if ("symbol" === typeof value) {
      task = request.writtenSymbols;
      elementReference = task.get(value);
      if (void 0 !== elementReference)
        return serializeByValueID(elementReference);
      elementReference = value.description;
      if (Symbol.for(elementReference) !== value)
        throw Error(
          "Only global symbols received from Symbol.for(...) can be passed to Client Components. The symbol Symbol.for(" + (value.description + ") cannot be found among global symbols.") + describeObjectForErrorMessage(parent, parentPropertyName)
        );
      request.pendingChunks++;
      parentPropertyName = request.nextChunkId++;
      parent = encodeReferenceChunk(
        request,
        parentPropertyName,
        "$S" + elementReference
      );
      request.completedImportChunks.push(parent);
      task.set(value, parentPropertyName);
      return serializeByValueID(parentPropertyName);
    }
    if ("bigint" === typeof value) return "$n" + value.toString(10);
    throw Error(
      "Type " + typeof value + " is not supported in Client Component props." + describeObjectForErrorMessage(parent, parentPropertyName)
    );
  }
  function logRecoverableError(request, error) {
    var prevRequest = currentRequest;
    currentRequest = null;
    try {
      var onError = request.onError;
      var errorDigest = supportsRequestStorage ? requestStorage.run(void 0, onError, error) : onError(error);
    } finally {
      currentRequest = prevRequest;
    }
    if (null != errorDigest && "string" !== typeof errorDigest)
      throw Error(
        'onError returned something with a type other than "string". onError should return a string and may return null or undefined but must not return anything else. It received something of type "' + typeof errorDigest + '" instead'
      );
    return errorDigest || "";
  }
  function fatalError(request, error) {
    var onFatalError = request.onFatalError;
    onFatalError(error);
    null !== request.destination ? (request.status = 14, closeWithError(request.destination, error)) : (request.status = 13, request.fatalError = error);
    request.cacheController.abort(
      Error("The render was aborted due to a fatal error.", { cause: error })
    );
  }
  function emitErrorChunk(request, id, digest) {
    digest = { digest };
    id = id.toString(16) + ":E" + stringify(digest) + "\n";
    id = stringToChunk(id);
    request.completedErrorChunks.push(id);
  }
  function emitModelChunk(request, id, json) {
    id = id.toString(16) + ":" + json + "\n";
    id = stringToChunk(id);
    request.completedRegularChunks.push(id);
  }
  function emitTypedArrayChunk(request, id, tag, typedArray, debug) {
    debug ? request.pendingDebugChunks++ : request.pendingChunks++;
    debug = new Uint8Array(
      typedArray.buffer,
      typedArray.byteOffset,
      typedArray.byteLength
    );
    typedArray = 2048 < typedArray.byteLength ? debug.slice() : debug;
    debug = typedArray.byteLength;
    id = id.toString(16) + ":" + tag + debug.toString(16) + ",";
    id = stringToChunk(id);
    request.completedRegularChunks.push(id, typedArray);
  }
  function emitTextChunk(request, id, text, debug) {
    if (null === byteLengthOfChunk)
      throw Error(
        "Existence of byteLengthOfChunk should have already been checked. This is a bug in React."
      );
    debug ? request.pendingDebugChunks++ : request.pendingChunks++;
    text = stringToChunk(text);
    debug = text.byteLength;
    id = id.toString(16) + ":T" + debug.toString(16) + ",";
    id = stringToChunk(id);
    request.completedRegularChunks.push(id, text);
  }
  function emitChunk(request, task, value) {
    var id = task.id;
    "string" === typeof value && null !== byteLengthOfChunk ? emitTextChunk(request, id, value, false) : value instanceof ArrayBuffer ? emitTypedArrayChunk(request, id, "A", new Uint8Array(value), false) : value instanceof Int8Array ? emitTypedArrayChunk(request, id, "O", value, false) : value instanceof Uint8Array ? emitTypedArrayChunk(request, id, "o", value, false) : value instanceof Uint8ClampedArray ? emitTypedArrayChunk(request, id, "U", value, false) : value instanceof Int16Array ? emitTypedArrayChunk(request, id, "S", value, false) : value instanceof Uint16Array ? emitTypedArrayChunk(request, id, "s", value, false) : value instanceof Int32Array ? emitTypedArrayChunk(request, id, "L", value, false) : value instanceof Uint32Array ? emitTypedArrayChunk(request, id, "l", value, false) : value instanceof Float32Array ? emitTypedArrayChunk(request, id, "G", value, false) : value instanceof Float64Array ? emitTypedArrayChunk(request, id, "g", value, false) : value instanceof BigInt64Array ? emitTypedArrayChunk(request, id, "M", value, false) : value instanceof BigUint64Array ? emitTypedArrayChunk(request, id, "m", value, false) : value instanceof DataView ? emitTypedArrayChunk(request, id, "V", value, false) : (value = stringify(value, task.toJSON), emitModelChunk(request, task.id, value));
  }
  function erroredTask(request, task, error) {
    task.status = 4;
    error = logRecoverableError(request, error);
    emitErrorChunk(request, task.id, error);
    request.abortableTasks.delete(task);
    callOnAllReadyIfReady(request);
  }
  var emptyRoot = {};
  function retryTask(request, task) {
    if (0 === task.status) {
      task.status = 5;
      var parentSerializedSize = serializedSize;
      try {
        modelRoot = task.model;
        var resolvedModel = renderModelDestructive(
          request,
          task,
          emptyRoot,
          "",
          task.model
        );
        modelRoot = resolvedModel;
        task.keyPath = null;
        task.implicitSlot = false;
        if ("object" === typeof resolvedModel && null !== resolvedModel)
          request.writtenObjects.set(resolvedModel, serializeByValueID(task.id)), emitChunk(request, task, resolvedModel);
        else {
          var json = stringify(resolvedModel);
          emitModelChunk(request, task.id, json);
        }
        task.status = 1;
        request.abortableTasks.delete(task);
        callOnAllReadyIfReady(request);
      } catch (thrownValue) {
        if (12 === request.status)
          if (request.abortableTasks.delete(task), task.status = 0, 21 === request.type)
            haltTask(task), finishHaltedTask(task, request);
          else {
            var errorId = request.fatalError;
            abortTask(task);
            finishAbortedTask(task, request, errorId);
          }
        else {
          var x = thrownValue === SuspenseException ? getSuspendedThenable() : thrownValue;
          if ("object" === typeof x && null !== x && "function" === typeof x.then) {
            task.status = 0;
            task.thenableState = getThenableStateAfterSuspending();
            var ping = task.ping;
            x.then(ping, ping);
          } else erroredTask(request, task, x);
        }
      } finally {
        serializedSize = parentSerializedSize;
      }
    }
  }
  function tryStreamTask(request, task) {
    var parentSerializedSize = serializedSize;
    try {
      emitChunk(request, task, task.model);
    } finally {
      serializedSize = parentSerializedSize;
    }
  }
  function performWork(request) {
    var prevDispatcher = ReactSharedInternalsServer.H;
    ReactSharedInternalsServer.H = HooksDispatcher;
    var prevRequest = currentRequest;
    currentRequest$1 = currentRequest = request;
    try {
      var pingedTasks = request.pingedTasks;
      request.pingedTasks = [];
      for (var i = 0; i < pingedTasks.length; i++)
        retryTask(request, pingedTasks[i]);
      flushCompletedChunks(request);
    } catch (error) {
      logRecoverableError(request, error), fatalError(request, error);
    } finally {
      ReactSharedInternalsServer.H = prevDispatcher, currentRequest$1 = null, currentRequest = prevRequest;
    }
  }
  function abortTask(task) {
    0 === task.status && (task.status = 3);
  }
  function finishAbortedTask(task, request, errorId) {
    3 === task.status && (errorId = serializeByValueID(errorId), task = encodeReferenceChunk(request, task.id, errorId), request.completedErrorChunks.push(task));
  }
  function haltTask(task) {
    0 === task.status && (task.status = 3);
  }
  function finishHaltedTask(task, request) {
    3 === task.status && request.pendingChunks--;
  }
  function flushCompletedChunks(request) {
    var destination = request.destination;
    if (null !== destination) {
      currentView = new Uint8Array(2048);
      writtenBytes = 0;
      try {
        for (var importsChunks = request.completedImportChunks, i = 0; i < importsChunks.length; i++)
          request.pendingChunks--, writeChunkAndReturn(destination, importsChunks[i]);
        importsChunks.splice(0, i);
        var hintChunks = request.completedHintChunks;
        for (i = 0; i < hintChunks.length; i++)
          writeChunkAndReturn(destination, hintChunks[i]);
        hintChunks.splice(0, i);
        var regularChunks = request.completedRegularChunks;
        for (i = 0; i < regularChunks.length; i++)
          request.pendingChunks--, writeChunkAndReturn(destination, regularChunks[i]);
        regularChunks.splice(0, i);
        var errorChunks = request.completedErrorChunks;
        for (i = 0; i < errorChunks.length; i++)
          request.pendingChunks--, writeChunkAndReturn(destination, errorChunks[i]);
        errorChunks.splice(0, i);
      } finally {
        request.flushScheduled = false, currentView && 0 < writtenBytes && (destination.enqueue(
          new Uint8Array(currentView.buffer, 0, writtenBytes)
        ), currentView = null, writtenBytes = 0);
      }
    }
    0 === request.pendingChunks && (12 > request.status && request.cacheController.abort(
      Error(
        "This render completed successfully. All cacheSignals are now aborted to allow clean up of any unused resources."
      )
    ), null !== request.destination && (request.status = 14, request.destination.close(), request.destination = null));
  }
  function startWork(request) {
    request.flushScheduled = null !== request.destination;
    supportsRequestStorage ? scheduleMicrotask(function() {
      requestStorage.run(request, performWork, request);
    }) : scheduleMicrotask(function() {
      return performWork(request);
    });
    setTimeout(function() {
      10 === request.status && (request.status = 11);
    }, 0);
  }
  function enqueueFlush(request) {
    false === request.flushScheduled && 0 === request.pingedTasks.length && null !== request.destination && (request.flushScheduled = true, setTimeout(function() {
      request.flushScheduled = false;
      flushCompletedChunks(request);
    }, 0));
  }
  function callOnAllReadyIfReady(request) {
    0 === request.abortableTasks.size && (request = request.onAllReady, request());
  }
  function startFlowing(request, destination) {
    if (13 === request.status)
      request.status = 14, closeWithError(destination, request.fatalError);
    else if (14 !== request.status && null === request.destination) {
      request.destination = destination;
      try {
        flushCompletedChunks(request);
      } catch (error) {
        logRecoverableError(request, error), fatalError(request, error);
      }
    }
  }
  function finishHalt(request, abortedTasks) {
    try {
      abortedTasks.forEach(function(task) {
        return finishHaltedTask(task, request);
      });
      var onAllReady = request.onAllReady;
      onAllReady();
      flushCompletedChunks(request);
    } catch (error) {
      logRecoverableError(request, error), fatalError(request, error);
    }
  }
  function finishAbort(request, abortedTasks, errorId) {
    try {
      abortedTasks.forEach(function(task) {
        return finishAbortedTask(task, request, errorId);
      });
      var onAllReady = request.onAllReady;
      onAllReady();
      flushCompletedChunks(request);
    } catch (error) {
      logRecoverableError(request, error), fatalError(request, error);
    }
  }
  function abort(request, reason) {
    if (!(11 < request.status))
      try {
        request.status = 12;
        request.cacheController.abort(reason);
        var abortableTasks = request.abortableTasks;
        if (0 < abortableTasks.size)
          if (21 === request.type)
            abortableTasks.forEach(function(task) {
              return haltTask(task, request);
            }), setTimeout(function() {
              return finishHalt(request, abortableTasks);
            }, 0);
          else {
            var error = void 0 === reason ? Error(
              "The render was aborted by the server without a reason."
            ) : "object" === typeof reason && null !== reason && "function" === typeof reason.then ? Error(
              "The render was aborted by the server with a promise."
            ) : reason, digest = logRecoverableError(request, error, null), errorId = request.nextChunkId++;
            request.fatalError = errorId;
            request.pendingChunks++;
            emitErrorChunk(request, errorId, digest, error, false, null);
            abortableTasks.forEach(function(task) {
              return abortTask(task, request, errorId);
            });
            setTimeout(function() {
              return finishAbort(request, abortableTasks, errorId);
            }, 0);
          }
        else {
          var onAllReady = request.onAllReady;
          onAllReady();
          flushCompletedChunks(request);
        }
      } catch (error$26) {
        logRecoverableError(request, error$26), fatalError(request, error$26);
      }
  }
  function resolveServerReference(bundlerConfig, id) {
    var name = "", resolvedModuleData = bundlerConfig[id];
    if (resolvedModuleData) name = resolvedModuleData.name;
    else {
      var idx = id.lastIndexOf("#");
      -1 !== idx && (name = id.slice(idx + 1), resolvedModuleData = bundlerConfig[id.slice(0, idx)]);
      if (!resolvedModuleData)
        throw Error(
          'Could not find the module "' + id + '" in the React Server Manifest. This is probably a bug in the React Server Components bundler.'
        );
    }
    return resolvedModuleData.async ? [resolvedModuleData.id, resolvedModuleData.chunks, name, 1] : [resolvedModuleData.id, resolvedModuleData.chunks, name];
  }
  var chunkCache = /* @__PURE__ */ new Map();
  function requireAsyncModule(id) {
    var promise = __vite_rsc_require__(id);
    if ("function" !== typeof promise.then || "fulfilled" === promise.status)
      return null;
    promise.then(
      function(value) {
        promise.status = "fulfilled";
        promise.value = value;
      },
      function(reason) {
        promise.status = "rejected";
        promise.reason = reason;
      }
    );
    return promise;
  }
  function ignoreReject() {
  }
  function preloadModule(metadata) {
    for (var chunks = metadata[1], promises = [], i = 0; i < chunks.length; ) {
      var chunkId = chunks[i++];
      chunks[i++];
      var entry = chunkCache.get(chunkId);
      if (void 0 === entry) {
        entry = __webpack_chunk_load__(chunkId);
        promises.push(entry);
        var resolve = chunkCache.set.bind(chunkCache, chunkId, null);
        entry.then(resolve, ignoreReject);
        chunkCache.set(chunkId, entry);
      } else null !== entry && promises.push(entry);
    }
    return 4 === metadata.length ? 0 === promises.length ? requireAsyncModule(metadata[0]) : Promise.all(promises).then(function() {
      return requireAsyncModule(metadata[0]);
    }) : 0 < promises.length ? Promise.all(promises) : null;
  }
  function requireModule2(metadata) {
    var moduleExports = __vite_rsc_require__(metadata[0]);
    if (4 === metadata.length && "function" === typeof moduleExports.then)
      if ("fulfilled" === moduleExports.status)
        moduleExports = moduleExports.value;
      else throw moduleExports.reason;
    if ("*" === metadata[2]) return moduleExports;
    if ("" === metadata[2])
      return moduleExports.__esModule ? moduleExports.default : moduleExports;
    if (hasOwnProperty.call(moduleExports, metadata[2]))
      return moduleExports[metadata[2]];
  }
  var RESPONSE_SYMBOL = /* @__PURE__ */ Symbol();
  function ReactPromise(status, value, reason) {
    this.status = status;
    this.value = value;
    this.reason = reason;
  }
  ReactPromise.prototype = Object.create(Promise.prototype);
  ReactPromise.prototype.then = function(resolve, reject) {
    switch (this.status) {
      case "resolved_model":
        initializeModelChunk(this);
    }
    switch (this.status) {
      case "fulfilled":
        if ("function" === typeof resolve) {
          for (var inspectedValue = this.value, cycleProtection = 0, visited = /* @__PURE__ */ new Set(); inspectedValue instanceof ReactPromise; ) {
            cycleProtection++;
            if (inspectedValue === this || visited.has(inspectedValue) || 1e3 < cycleProtection) {
              "function" === typeof reject && reject(Error("Cannot have cyclic thenables."));
              return;
            }
            visited.add(inspectedValue);
            if ("fulfilled" === inspectedValue.status)
              inspectedValue = inspectedValue.value;
            else break;
          }
          resolve(this.value);
        }
        break;
      case "pending":
      case "blocked":
        "function" === typeof resolve && (null === this.value && (this.value = []), this.value.push(resolve));
        "function" === typeof reject && (null === this.reason && (this.reason = []), this.reason.push(reject));
        break;
      default:
        "function" === typeof reject && reject(this.reason);
    }
  };
  var ObjectPrototype = Object.prototype, ArrayPrototype = Array.prototype;
  function wakeChunk(response, listeners, value, chunk) {
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      "function" === typeof listener ? listener(value) : fulfillReference(response, listener, value, chunk.reason);
    }
  }
  function rejectChunk(response, listeners, error) {
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      "function" === typeof listener ? listener(error) : rejectReference(response, listener.handler, error);
    }
  }
  function triggerErrorOnChunk(response, chunk, error) {
    if ("pending" !== chunk.status && "blocked" !== chunk.status)
      chunk.reason.error(error);
    else {
      var listeners = chunk.reason;
      chunk.status = "rejected";
      chunk.reason = error;
      null !== listeners && rejectChunk(response, listeners, error);
    }
  }
  function createResolvedModelChunk(response, value, id) {
    var $jscomp$compprop2 = {};
    return new ReactPromise(
      "resolved_model",
      value,
      ($jscomp$compprop2.id = id, $jscomp$compprop2[RESPONSE_SYMBOL] = response, $jscomp$compprop2)
    );
  }
  function resolveModelChunk(response, chunk, value, id) {
    if ("pending" !== chunk.status)
      chunk = chunk.reason, "C" === value[0] ? chunk.close("C" === value ? '"$undefined"' : value.slice(1)) : chunk.enqueueModel(value);
    else {
      var resolveListeners = chunk.value, rejectListeners = chunk.reason;
      chunk.status = "resolved_model";
      chunk.value = value;
      value = {};
      chunk.reason = (value.id = id, value[RESPONSE_SYMBOL] = response, value);
      if (null !== resolveListeners)
        switch (initializeModelChunk(chunk), chunk.status) {
          case "fulfilled":
            wakeChunk(response, resolveListeners, chunk.value, chunk);
            break;
          case "blocked":
          case "pending":
            if (chunk.value)
              for (response = 0; response < resolveListeners.length; response++)
                chunk.value.push(resolveListeners[response]);
            else chunk.value = resolveListeners;
            if (chunk.reason) {
              if (rejectListeners)
                for (resolveListeners = 0; resolveListeners < rejectListeners.length; resolveListeners++)
                  chunk.reason.push(rejectListeners[resolveListeners]);
            } else chunk.reason = rejectListeners;
            break;
          case "rejected":
            rejectListeners && rejectChunk(response, rejectListeners, chunk.reason);
        }
    }
  }
  function createResolvedIteratorResultChunk(response, value, done) {
    var $jscomp$compprop4 = {};
    return new ReactPromise(
      "resolved_model",
      (done ? '{"done":true,"value":' : '{"done":false,"value":') + value + "}",
      ($jscomp$compprop4.id = -1, $jscomp$compprop4[RESPONSE_SYMBOL] = response, $jscomp$compprop4)
    );
  }
  function resolveIteratorResultChunk(response, chunk, value, done) {
    resolveModelChunk(
      response,
      chunk,
      (done ? '{"done":true,"value":' : '{"done":false,"value":') + value + "}",
      -1
    );
  }
  function loadServerReference$1(response, metaData, parentObject, key) {
    function reject(error) {
      var rejectListeners = blockedPromise.reason, erroredPromise = blockedPromise;
      erroredPromise.status = "rejected";
      erroredPromise.value = null;
      erroredPromise.reason = error;
      null !== rejectListeners && rejectChunk(response, rejectListeners, error);
      rejectReference(response, handler, error);
    }
    var id = metaData.id;
    if ("string" !== typeof id || "then" === key) return null;
    var cachedPromise = metaData.$$promise;
    if (void 0 !== cachedPromise) {
      if ("fulfilled" === cachedPromise.status)
        return cachedPromise = cachedPromise.value, "__proto__" === key ? null : parentObject[key] = cachedPromise;
      initializingHandler ? (id = initializingHandler, id.deps++) : id = initializingHandler = { chunk: null, value: null, reason: null, deps: 1, errored: false };
      cachedPromise.then(
        resolveReference.bind(null, response, id, parentObject, key),
        rejectReference.bind(null, response, id)
      );
      return null;
    }
    var blockedPromise = new ReactPromise("blocked", null, null);
    metaData.$$promise = blockedPromise;
    var serverReference = resolveServerReference(response._bundlerConfig, id);
    cachedPromise = metaData.bound;
    if (id = preloadModule(serverReference))
      cachedPromise instanceof ReactPromise && (id = Promise.all([id, cachedPromise]));
    else if (cachedPromise instanceof ReactPromise)
      id = Promise.resolve(cachedPromise);
    else
      return cachedPromise = requireModule2(serverReference), id = blockedPromise, id.status = "fulfilled", id.value = cachedPromise;
    if (initializingHandler) {
      var handler = initializingHandler;
      handler.deps++;
    } else
      handler = initializingHandler = {
        chunk: null,
        value: null,
        reason: null,
        deps: 1,
        errored: false
      };
    id.then(function() {
      var resolvedValue = requireModule2(serverReference);
      if (metaData.bound) {
        var promiseValue = metaData.bound.value;
        promiseValue = isArrayImpl(promiseValue) ? promiseValue.slice(0) : [];
        if (1e3 < promiseValue.length) {
          reject(
            Error(
              "Server Function has too many bound arguments. Received " + promiseValue.length + " but the limit is 1000."
            )
          );
          return;
        }
        promiseValue.unshift(null);
        resolvedValue = resolvedValue.bind.apply(resolvedValue, promiseValue);
      }
      promiseValue = blockedPromise.value;
      var initializedPromise = blockedPromise;
      initializedPromise.status = "fulfilled";
      initializedPromise.value = resolvedValue;
      initializedPromise.reason = null;
      null !== promiseValue && wakeChunk(response, promiseValue, resolvedValue, initializedPromise);
      resolveReference(response, handler, parentObject, key, resolvedValue);
    }, reject);
    return null;
  }
  function reviveModel(response, parentObj, parentKey, value, reference, arrayRoot) {
    if ("string" === typeof value)
      return parseModelString(
        response,
        parentObj,
        parentKey,
        value,
        reference,
        arrayRoot
      );
    if ("object" === typeof value && null !== value)
      if (void 0 !== reference && void 0 !== response._temporaryReferences && response._temporaryReferences.set(value, reference), isArrayImpl(value)) {
        if (null === arrayRoot) {
          var childContext = { count: 0, fork: false };
          response._rootArrayContexts.set(value, childContext);
        } else childContext = arrayRoot;
        1 < value.length && (childContext.fork = true);
        bumpArrayCount(childContext, value.length + 1, response);
        for (parentObj = 0; parentObj < value.length; parentObj++)
          value[parentObj] = reviveModel(
            response,
            value,
            "" + parentObj,
            value[parentObj],
            void 0 !== reference ? reference + ":" + parentObj : void 0,
            childContext
          );
      } else
        for (childContext in value)
          hasOwnProperty.call(value, childContext) && ("__proto__" === childContext ? delete value[childContext] : (parentObj = void 0 !== reference && -1 === childContext.indexOf(":") ? reference + ":" + childContext : void 0, parentObj = reviveModel(
            response,
            value,
            childContext,
            value[childContext],
            parentObj,
            null
          ), void 0 !== parentObj ? value[childContext] = parentObj : delete value[childContext]));
    return value;
  }
  function bumpArrayCount(arrayContext, slots, response) {
    if ((arrayContext.count += slots) > response._arraySizeLimit && arrayContext.fork)
      throw Error(
        "Maximum array nesting exceeded. Large nested arrays can be dangerous. Try adding intermediate objects."
      );
  }
  var initializingHandler = null;
  function initializeModelChunk(chunk) {
    var prevHandler = initializingHandler;
    initializingHandler = null;
    var _chunk$reason = chunk.reason, response = _chunk$reason[RESPONSE_SYMBOL];
    _chunk$reason = _chunk$reason.id;
    _chunk$reason = -1 === _chunk$reason ? void 0 : _chunk$reason.toString(16);
    var resolvedModel = chunk.value;
    chunk.status = "blocked";
    chunk.value = null;
    chunk.reason = null;
    try {
      var rawModel = JSON.parse(resolvedModel);
      resolvedModel = { count: 0, fork: false };
      var value = reviveModel(
        response,
        { "": rawModel },
        "",
        rawModel,
        _chunk$reason,
        resolvedModel
      ), resolveListeners = chunk.value;
      if (null !== resolveListeners)
        for (chunk.value = null, chunk.reason = null, rawModel = 0; rawModel < resolveListeners.length; rawModel++) {
          var listener = resolveListeners[rawModel];
          "function" === typeof listener ? listener(value) : fulfillReference(response, listener, value, resolvedModel);
        }
      if (null !== initializingHandler) {
        if (initializingHandler.errored) throw initializingHandler.reason;
        if (0 < initializingHandler.deps) {
          initializingHandler.value = value;
          initializingHandler.reason = resolvedModel;
          initializingHandler.chunk = chunk;
          return;
        }
      }
      chunk.status = "fulfilled";
      chunk.value = value;
      chunk.reason = resolvedModel;
    } catch (error) {
      chunk.status = "rejected", chunk.reason = error;
    } finally {
      initializingHandler = prevHandler;
    }
  }
  function reportGlobalError(response, error) {
    response._closed = true;
    response._closedReason = error;
    response._chunks.forEach(function(chunk) {
      "pending" === chunk.status ? triggerErrorOnChunk(response, chunk, error) : "fulfilled" === chunk.status && null !== chunk.reason && (chunk = chunk.reason, "function" === typeof chunk.error && chunk.error(error));
    });
  }
  function getChunk(response, id) {
    var chunks = response._chunks, chunk = chunks.get(id);
    chunk || (chunk = response._formData.get(response._prefix + id), chunk = "string" === typeof chunk ? createResolvedModelChunk(response, chunk, id) : response._closed ? new ReactPromise("rejected", null, response._closedReason) : new ReactPromise("pending", null, null), chunks.set(id, chunk));
    return chunk;
  }
  function fulfillReference(response, reference, value, arrayRoot) {
    var handler = reference.handler, parentObject = reference.parentObject, key = reference.key, map = reference.map, path = reference.path;
    try {
      for (var localLength = 0, rootArrayContexts = response._rootArrayContexts, i = 1; i < path.length; i++) {
        var name = path[i];
        if ("object" !== typeof value || null === value || getPrototypeOf(value) !== ObjectPrototype && getPrototypeOf(value) !== ArrayPrototype || !hasOwnProperty.call(value, name))
          throw Error("Invalid reference.");
        value = value[name];
        if (isArrayImpl(value))
          localLength = 0, arrayRoot = rootArrayContexts.get(value) || arrayRoot;
        else if (arrayRoot = null, "string" === typeof value)
          localLength = value.length;
        else if ("bigint" === typeof value) {
          var n = Math.abs(Number(value));
          localLength = 0 === n ? 1 : Math.floor(Math.log10(n)) + 1;
        } else localLength = ArrayBuffer.isView(value) ? value.byteLength : 0;
      }
      var resolvedValue = map(response, value, parentObject, key);
      var referenceArrayRoot = reference.arrayRoot;
      null !== referenceArrayRoot && (null !== arrayRoot ? (arrayRoot.fork && (referenceArrayRoot.fork = true), bumpArrayCount(referenceArrayRoot, arrayRoot.count, response)) : 0 < localLength && bumpArrayCount(referenceArrayRoot, localLength, response));
    } catch (error) {
      rejectReference(response, handler, error);
      return;
    }
    resolveReference(response, handler, parentObject, key, resolvedValue);
  }
  function resolveReference(response, handler, parentObject, key, resolvedValue) {
    "__proto__" !== key && (parentObject[key] = resolvedValue);
    "" === key && null === handler.value && (handler.value = resolvedValue);
    handler.deps--;
    0 === handler.deps && (parentObject = handler.chunk, null !== parentObject && "blocked" === parentObject.status && (key = parentObject.value, parentObject.status = "fulfilled", parentObject.value = handler.value, parentObject.reason = handler.reason, null !== key && wakeChunk(response, key, handler.value, parentObject)));
  }
  function rejectReference(response, handler, error) {
    handler.errored || (handler.errored = true, handler.value = null, handler.reason = error, handler = handler.chunk, null !== handler && "blocked" === handler.status && triggerErrorOnChunk(response, handler, error));
  }
  function getOutlinedModel(response, reference, parentObject, key, referenceArrayRoot, map) {
    reference = reference.split(":");
    var id = parseInt(reference[0], 16), chunk = getChunk(response, id);
    switch (chunk.status) {
      case "resolved_model":
        initializeModelChunk(chunk);
    }
    switch (chunk.status) {
      case "fulfilled":
        id = chunk.value;
        chunk = chunk.reason;
        for (var localLength = 0, rootArrayContexts = response._rootArrayContexts, i = 1; i < reference.length; i++) {
          localLength = reference[i];
          if ("object" !== typeof id || null === id || getPrototypeOf(id) !== ObjectPrototype && getPrototypeOf(id) !== ArrayPrototype || !hasOwnProperty.call(id, localLength))
            throw Error("Invalid reference.");
          id = id[localLength];
          isArrayImpl(id) ? (localLength = 0, chunk = rootArrayContexts.get(id) || chunk) : (chunk = null, "string" === typeof id ? localLength = id.length : "bigint" === typeof id ? (localLength = Math.abs(Number(id)), localLength = 0 === localLength ? 1 : Math.floor(Math.log10(localLength)) + 1) : localLength = ArrayBuffer.isView(id) ? id.byteLength : 0);
        }
        parentObject = map(response, id, parentObject, key);
        null !== referenceArrayRoot && (null !== chunk ? (chunk.fork && (referenceArrayRoot.fork = true), bumpArrayCount(referenceArrayRoot, chunk.count, response)) : 0 < localLength && bumpArrayCount(referenceArrayRoot, localLength, response));
        return parentObject;
      case "blocked":
        return initializingHandler ? (response = initializingHandler, response.deps++) : response = initializingHandler = { chunk: null, value: null, reason: null, deps: 1, errored: false }, referenceArrayRoot = {
          handler: response,
          parentObject,
          key,
          map,
          path: reference,
          arrayRoot: referenceArrayRoot
        }, null === chunk.value ? chunk.value = [referenceArrayRoot] : chunk.value.push(referenceArrayRoot), null === chunk.reason ? chunk.reason = [referenceArrayRoot] : chunk.reason.push(referenceArrayRoot), null;
      case "pending":
        throw Error("Invalid forward reference.");
      default:
        return initializingHandler ? (initializingHandler.errored = true, initializingHandler.value = null, initializingHandler.reason = chunk.reason) : initializingHandler = {
          chunk: null,
          value: null,
          reason: chunk.reason,
          deps: 0,
          errored: true
        }, null;
    }
  }
  function createMap(response, model) {
    if (!isArrayImpl(model)) throw Error("Invalid Map initializer.");
    if (true === model.$$consumed) throw Error("Already initialized Map.");
    response = new Map(model);
    model.$$consumed = true;
    return response;
  }
  function createSet(response, model) {
    if (!isArrayImpl(model)) throw Error("Invalid Set initializer.");
    if (true === model.$$consumed) throw Error("Already initialized Set.");
    response = new Set(model);
    model.$$consumed = true;
    return response;
  }
  function extractIterator(response, model) {
    if (!isArrayImpl(model)) throw Error("Invalid Iterator initializer.");
    if (true === model.$$consumed) throw Error("Already initialized Iterator.");
    response = model[Symbol.iterator]();
    model.$$consumed = true;
    return response;
  }
  function createModel(response, model, parentObject, key) {
    return "then" === key && "function" === typeof model ? null : model;
  }
  function parseTypedArray(response, reference, constructor, bytesPerElement, parentObject, parentKey, referenceArrayRoot) {
    function reject(error) {
      if (!handler.errored) {
        handler.errored = true;
        handler.value = null;
        handler.reason = error;
        var chunk = handler.chunk;
        null !== chunk && "blocked" === chunk.status && triggerErrorOnChunk(response, chunk, error);
      }
    }
    reference = parseInt(reference.slice(2), 16);
    var key = response._prefix + reference;
    bytesPerElement = response._chunks;
    if (bytesPerElement.has(reference))
      throw Error("Already initialized typed array.");
    bytesPerElement.set(
      reference,
      new ReactPromise(
        "rejected",
        null,
        Error("Already initialized typed array.")
      )
    );
    reference = response._formData.get(key).arrayBuffer();
    if (initializingHandler) {
      var handler = initializingHandler;
      handler.deps++;
    } else
      handler = initializingHandler = {
        chunk: null,
        value: null,
        reason: null,
        deps: 1,
        errored: false
      };
    reference.then(function(buffer) {
      try {
        null !== referenceArrayRoot && bumpArrayCount(referenceArrayRoot, buffer.byteLength, response);
        var resolvedValue = constructor === ArrayBuffer ? buffer : new constructor(buffer);
        "__proto__" !== key && (parentObject[parentKey] = resolvedValue);
        "" === parentKey && null === handler.value && (handler.value = resolvedValue);
      } catch (x) {
        reject(x);
        return;
      }
      handler.deps--;
      0 === handler.deps && (buffer = handler.chunk, null !== buffer && "blocked" === buffer.status && (resolvedValue = buffer.value, buffer.status = "fulfilled", buffer.value = handler.value, buffer.reason = null, null !== resolvedValue && wakeChunk(response, resolvedValue, handler.value, buffer)));
    }, reject);
    return null;
  }
  function resolveStream(response, id, stream, controller) {
    var chunks = response._chunks;
    stream = new ReactPromise("fulfilled", stream, controller);
    chunks.set(id, stream);
    response = response._formData.getAll(response._prefix + id);
    for (id = 0; id < response.length; id++)
      chunks = response[id], "string" === typeof chunks && ("C" === chunks[0] ? controller.close("C" === chunks ? '"$undefined"' : chunks.slice(1)) : controller.enqueueModel(chunks));
  }
  function parseReadableStream(response, reference, type) {
    function enqueue(value) {
      "bytes" !== type || ArrayBuffer.isView(value) ? controller.enqueue(value) : flightController.error(Error("Invalid data for bytes stream."));
    }
    reference = parseInt(reference.slice(2), 16);
    if (response._chunks.has(reference))
      throw Error("Already initialized stream.");
    var controller = null, closed = false, stream = new ReadableStream({
      type,
      start: function(c) {
        controller = c;
      }
    }), previousBlockedChunk = null, flightController = {
      enqueueModel: function(json) {
        if (null === previousBlockedChunk) {
          var chunk = createResolvedModelChunk(response, json, -1);
          initializeModelChunk(chunk);
          "fulfilled" === chunk.status ? enqueue(chunk.value) : (chunk.then(enqueue, flightController.error), previousBlockedChunk = chunk);
        } else {
          chunk = previousBlockedChunk;
          var chunk$31 = new ReactPromise("pending", null, null);
          chunk$31.then(enqueue, flightController.error);
          previousBlockedChunk = chunk$31;
          chunk.then(function() {
            previousBlockedChunk === chunk$31 && (previousBlockedChunk = null);
            resolveModelChunk(response, chunk$31, json, -1);
          });
        }
      },
      close: function() {
        if (!closed)
          if (closed = true, null === previousBlockedChunk)
            controller.close();
          else {
            var blockedChunk = previousBlockedChunk;
            previousBlockedChunk = null;
            blockedChunk.then(function() {
              return controller.close();
            });
          }
      },
      error: function(error) {
        if (!closed)
          if (closed = true, null === previousBlockedChunk)
            controller.error(error);
          else {
            var blockedChunk = previousBlockedChunk;
            previousBlockedChunk = null;
            blockedChunk.then(function() {
              return controller.error(error);
            });
          }
      }
    };
    resolveStream(response, reference, stream, flightController);
    return stream;
  }
  function FlightIterator(next) {
    this.next = next;
  }
  FlightIterator.prototype = {};
  FlightIterator.prototype[ASYNC_ITERATOR] = function() {
    return this;
  };
  function parseAsyncIterable(response, reference, iterator) {
    reference = parseInt(reference.slice(2), 16);
    if (response._chunks.has(reference))
      throw Error("Already initialized stream.");
    var buffer = [], closed = false, nextWriteIndex = 0, $jscomp$compprop5 = {};
    $jscomp$compprop5 = ($jscomp$compprop5[ASYNC_ITERATOR] = function() {
      var nextReadIndex = 0;
      return new FlightIterator(function(arg) {
        if (void 0 !== arg)
          throw Error(
            "Values cannot be passed to next() of AsyncIterables passed to Client Components."
          );
        if (nextReadIndex === buffer.length) {
          if (closed)
            return new ReactPromise(
              "fulfilled",
              { done: true, value: void 0 },
              null
            );
          buffer[nextReadIndex] = new ReactPromise("pending", null, null);
        }
        return buffer[nextReadIndex++];
      });
    }, $jscomp$compprop5);
    iterator = iterator ? $jscomp$compprop5[ASYNC_ITERATOR]() : $jscomp$compprop5;
    resolveStream(response, reference, iterator, {
      enqueueModel: function(value) {
        nextWriteIndex === buffer.length ? buffer[nextWriteIndex] = createResolvedIteratorResultChunk(
          response,
          value,
          false
        ) : resolveIteratorResultChunk(
          response,
          buffer[nextWriteIndex],
          value,
          false
        );
        nextWriteIndex++;
      },
      close: function(value) {
        if (!closed)
          for (closed = true, nextWriteIndex === buffer.length ? buffer[nextWriteIndex] = createResolvedIteratorResultChunk(
            response,
            value,
            true
          ) : resolveIteratorResultChunk(
            response,
            buffer[nextWriteIndex],
            value,
            true
          ), nextWriteIndex++; nextWriteIndex < buffer.length; )
            resolveIteratorResultChunk(
              response,
              buffer[nextWriteIndex++],
              '"$undefined"',
              true
            );
      },
      error: function(error) {
        if (!closed)
          for (closed = true, nextWriteIndex === buffer.length && (buffer[nextWriteIndex] = new ReactPromise(
            "pending",
            null,
            null
          )); nextWriteIndex < buffer.length; )
            triggerErrorOnChunk(response, buffer[nextWriteIndex++], error);
      }
    });
    return iterator;
  }
  function parseModelString(response, obj, key, value, reference, arrayRoot) {
    if ("$" === value[0]) {
      switch (value[1]) {
        case "$":
          return null !== arrayRoot && bumpArrayCount(arrayRoot, value.length - 1, response), value.slice(1);
        case "@":
          return obj = parseInt(value.slice(2), 16), getChunk(response, obj);
        case "h":
          return arrayRoot = value.slice(2), getOutlinedModel(
            response,
            arrayRoot,
            obj,
            key,
            null,
            loadServerReference$1
          );
        case "T":
          if (void 0 === reference || void 0 === response._temporaryReferences)
            throw Error(
              "Could not reference an opaque temporary reference. This is likely due to misconfiguring the temporaryReferences options on the server."
            );
          return createTemporaryReference(
            response._temporaryReferences,
            reference
          );
        case "Q":
          return arrayRoot = value.slice(2), getOutlinedModel(response, arrayRoot, obj, key, null, createMap);
        case "W":
          return arrayRoot = value.slice(2), getOutlinedModel(response, arrayRoot, obj, key, null, createSet);
        case "K":
          obj = value.slice(2);
          obj = response._prefix + obj + "_";
          key = new FormData();
          response = response._formData;
          arrayRoot = Array.from(response.keys());
          for (value = 0; value < arrayRoot.length; value++)
            if (reference = arrayRoot[value], reference.startsWith(obj)) {
              for (var entries = response.getAll(reference), newKey = reference.slice(obj.length), j = 0; j < entries.length; j++)
                key.append(newKey, entries[j]);
              response.delete(reference);
            }
          return key;
        case "i":
          return arrayRoot = value.slice(2), getOutlinedModel(response, arrayRoot, obj, key, null, extractIterator);
        case "I":
          return Infinity;
        case "-":
          return "$-0" === value ? -0 : -Infinity;
        case "N":
          return NaN;
        case "u":
          return;
        case "D":
          return new Date(Date.parse(value.slice(2)));
        case "n":
          obj = value.slice(2);
          if (300 < obj.length)
            throw Error(
              "BigInt is too large. Received " + obj.length + " digits but the limit is 300."
            );
          null !== arrayRoot && bumpArrayCount(arrayRoot, obj.length, response);
          return BigInt(obj);
        case "A":
          return parseTypedArray(
            response,
            value,
            ArrayBuffer,
            1,
            obj,
            key,
            arrayRoot
          );
        case "O":
          return parseTypedArray(
            response,
            value,
            Int8Array,
            1,
            obj,
            key,
            arrayRoot
          );
        case "o":
          return parseTypedArray(
            response,
            value,
            Uint8Array,
            1,
            obj,
            key,
            arrayRoot
          );
        case "U":
          return parseTypedArray(
            response,
            value,
            Uint8ClampedArray,
            1,
            obj,
            key,
            arrayRoot
          );
        case "S":
          return parseTypedArray(
            response,
            value,
            Int16Array,
            2,
            obj,
            key,
            arrayRoot
          );
        case "s":
          return parseTypedArray(
            response,
            value,
            Uint16Array,
            2,
            obj,
            key,
            arrayRoot
          );
        case "L":
          return parseTypedArray(
            response,
            value,
            Int32Array,
            4,
            obj,
            key,
            arrayRoot
          );
        case "l":
          return parseTypedArray(
            response,
            value,
            Uint32Array,
            4,
            obj,
            key,
            arrayRoot
          );
        case "G":
          return parseTypedArray(
            response,
            value,
            Float32Array,
            4,
            obj,
            key,
            arrayRoot
          );
        case "g":
          return parseTypedArray(
            response,
            value,
            Float64Array,
            8,
            obj,
            key,
            arrayRoot
          );
        case "M":
          return parseTypedArray(
            response,
            value,
            BigInt64Array,
            8,
            obj,
            key,
            arrayRoot
          );
        case "m":
          return parseTypedArray(
            response,
            value,
            BigUint64Array,
            8,
            obj,
            key,
            arrayRoot
          );
        case "V":
          return parseTypedArray(
            response,
            value,
            DataView,
            1,
            obj,
            key,
            arrayRoot
          );
        case "B":
          return obj = parseInt(value.slice(2), 16), response._formData.get(response._prefix + obj);
        case "R":
          return parseReadableStream(response, value, void 0);
        case "r":
          return parseReadableStream(response, value, "bytes");
        case "X":
          return parseAsyncIterable(response, value, false);
        case "x":
          return parseAsyncIterable(response, value, true);
      }
      value = value.slice(1);
      return getOutlinedModel(response, value, obj, key, arrayRoot, createModel);
    }
    null !== arrayRoot && bumpArrayCount(arrayRoot, value.length, response);
    return value;
  }
  function createResponse(bundlerConfig, formFieldPrefix, temporaryReferences) {
    var backingFormData = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : new FormData(), arraySizeLimit = 4 < arguments.length && void 0 !== arguments[4] ? arguments[4] : 1e6, chunks = /* @__PURE__ */ new Map();
    return {
      _bundlerConfig: bundlerConfig,
      _prefix: formFieldPrefix,
      _formData: backingFormData,
      _chunks: chunks,
      _closed: false,
      _closedReason: null,
      _temporaryReferences: temporaryReferences,
      _rootArrayContexts: /* @__PURE__ */ new WeakMap(),
      _arraySizeLimit: arraySizeLimit
    };
  }
  function close(response) {
    reportGlobalError(response, Error("Connection closed."));
  }
  function loadServerReference(bundlerConfig, metaData) {
    var id = metaData.id;
    if ("string" !== typeof id) return null;
    var serverReference = resolveServerReference(bundlerConfig, id);
    bundlerConfig = preloadModule(serverReference);
    metaData = metaData.bound;
    return metaData instanceof Promise ? Promise.all([metaData, bundlerConfig]).then(function(_ref) {
      _ref = _ref[0];
      var fn = requireModule2(serverReference);
      if (1e3 < _ref.length)
        throw Error(
          "Server Function has too many bound arguments. Received " + _ref.length + " but the limit is 1000."
        );
      return fn.bind.apply(fn, [null].concat(_ref));
    }) : bundlerConfig ? Promise.resolve(bundlerConfig).then(function() {
      return requireModule2(serverReference);
    }) : Promise.resolve(requireModule2(serverReference));
  }
  function decodeBoundActionMetaData(body, serverManifest, formFieldPrefix, arraySizeLimit) {
    body = createResponse(
      serverManifest,
      formFieldPrefix,
      void 0,
      body,
      arraySizeLimit
    );
    close(body);
    body = getChunk(body, 0);
    body.then(function() {
    });
    if ("fulfilled" !== body.status) throw body.reason;
    return body.value;
  }
  reactServerDomWebpackServer_edge_production.createClientModuleProxy = function(moduleId) {
    moduleId = registerClientReferenceImpl({}, moduleId, false);
    return new Proxy(moduleId, proxyHandlers$1);
  };
  reactServerDomWebpackServer_edge_production.createTemporaryReferenceSet = function() {
    return /* @__PURE__ */ new WeakMap();
  };
  reactServerDomWebpackServer_edge_production.decodeAction = function(body, serverManifest) {
    var formData = new FormData(), action = null, seenActions = /* @__PURE__ */ new Set();
    body.forEach(function(value, key) {
      key.startsWith("$ACTION_") ? key.startsWith("$ACTION_REF_") ? seenActions.has(key) || (seenActions.add(key), value = "$ACTION_" + key.slice(12) + ":", value = decodeBoundActionMetaData(body, serverManifest, value), action = loadServerReference(serverManifest, value)) : key.startsWith("$ACTION_ID_") && !seenActions.has(key) && (seenActions.add(key), value = key.slice(11), action = loadServerReference(serverManifest, {
        id: value,
        bound: null
      })) : formData.append(key, value);
    });
    return null === action ? null : action.then(function(fn) {
      return fn.bind(null, formData);
    });
  };
  reactServerDomWebpackServer_edge_production.decodeFormState = function(actionResult, body, serverManifest) {
    var keyPath = body.get("$ACTION_KEY");
    if ("string" !== typeof keyPath) return Promise.resolve(null);
    var metaData = null;
    body.forEach(function(value, key) {
      key.startsWith("$ACTION_REF_") && (value = "$ACTION_" + key.slice(12) + ":", metaData = decodeBoundActionMetaData(body, serverManifest, value));
    });
    if (null === metaData) return Promise.resolve(null);
    var referenceId = metaData.id;
    return Promise.resolve(metaData.bound).then(function(bound) {
      return null === bound ? null : [actionResult, keyPath, referenceId, bound.length - 1];
    });
  };
  reactServerDomWebpackServer_edge_production.decodeReply = function(body, webpackMap, options) {
    if ("string" === typeof body) {
      var form = new FormData();
      form.append("0", body);
      body = form;
    }
    body = createResponse(
      webpackMap,
      "",
      options ? options.temporaryReferences : void 0,
      body,
      options ? options.arraySizeLimit : void 0
    );
    webpackMap = getChunk(body, 0);
    close(body);
    return webpackMap;
  };
  reactServerDomWebpackServer_edge_production.decodeReplyFromAsyncIterable = function(iterable, webpackMap, options) {
    function progress(entry) {
      if (entry.done) close(response);
      else {
        entry = entry.value;
        var name = entry[0];
        entry = entry[1];
        if ("string" === typeof entry) {
          response._formData.append(name, entry);
          var prefix = response._prefix;
          if (name.startsWith(prefix)) {
            var chunks = response._chunks;
            name = +name.slice(prefix.length);
            (chunks = chunks.get(name)) && resolveModelChunk(response, chunks, entry, name);
          }
        } else response._formData.append(name, entry);
        iterator.next().then(progress, error);
      }
    }
    function error(reason) {
      reportGlobalError(response, reason);
      "function" === typeof iterator.throw && iterator.throw(reason).then(error, error);
    }
    var iterator = iterable[ASYNC_ITERATOR](), response = createResponse(
      webpackMap,
      "",
      options ? options.temporaryReferences : void 0,
      void 0,
      options ? options.arraySizeLimit : void 0
    );
    iterator.next().then(progress, error);
    return getChunk(response, 0);
  };
  reactServerDomWebpackServer_edge_production.prerender = function(model, webpackMap, options) {
    return new Promise(function(resolve, reject) {
      var request = new RequestInstance(
        21,
        model,
        webpackMap,
        options ? options.onError : void 0,
        options ? options.onPostpone : void 0,
        function() {
          var stream = new ReadableStream(
            {
              type: "bytes",
              pull: function(controller) {
                startFlowing(request, controller);
              },
              cancel: function(reason) {
                request.destination = null;
                abort(request, reason);
              }
            },
            { highWaterMark: 0 }
          );
          resolve({ prelude: stream });
        },
        reject,
        options ? options.identifierPrefix : void 0,
        options ? options.temporaryReferences : void 0
      );
      if (options && options.signal) {
        var signal = options.signal;
        if (signal.aborted) abort(request, signal.reason);
        else {
          var listener = function() {
            abort(request, signal.reason);
            signal.removeEventListener("abort", listener);
          };
          signal.addEventListener("abort", listener);
        }
      }
      startWork(request);
    });
  };
  reactServerDomWebpackServer_edge_production.registerClientReference = function(proxyImplementation, id, exportName) {
    return registerClientReferenceImpl(
      proxyImplementation,
      id + "#" + exportName,
      false
    );
  };
  reactServerDomWebpackServer_edge_production.registerServerReference = function(reference, id, exportName) {
    return Object.defineProperties(reference, {
      $$typeof: { value: SERVER_REFERENCE_TAG },
      $$id: {
        value: null === exportName ? id : id + "#" + exportName,
        configurable: true
      },
      $$bound: { value: null, configurable: true },
      bind: { value: bind, configurable: true },
      toString: serverReferenceToString
    });
  };
  reactServerDomWebpackServer_edge_production.renderToReadableStream = function(model, webpackMap, options) {
    var request = new RequestInstance(
      20,
      model,
      webpackMap,
      options ? options.onError : void 0,
      options ? options.onPostpone : void 0,
      noop,
      noop,
      options ? options.identifierPrefix : void 0,
      options ? options.temporaryReferences : void 0
    );
    if (options && options.signal) {
      var signal = options.signal;
      if (signal.aborted) abort(request, signal.reason);
      else {
        var listener = function() {
          abort(request, signal.reason);
          signal.removeEventListener("abort", listener);
        };
        signal.addEventListener("abort", listener);
      }
    }
    return new ReadableStream(
      {
        type: "bytes",
        start: function() {
          startWork(request);
        },
        pull: function(controller) {
          startFlowing(request, controller);
        },
        cancel: function(reason) {
          request.destination = null;
          abort(request, reason);
        }
      },
      { highWaterMark: 0 }
    );
  };
  return reactServerDomWebpackServer_edge_production;
}
var reactServerDomWebpackServer_edge_development = {};
var hasRequiredReactServerDomWebpackServer_edge_development;
function requireReactServerDomWebpackServer_edge_development() {
  if (hasRequiredReactServerDomWebpackServer_edge_development) return reactServerDomWebpackServer_edge_development;
  hasRequiredReactServerDomWebpackServer_edge_development = 1;
  const __viteRscAsyncHooks = require$$0;
  globalThis.AsyncLocalStorage = __viteRscAsyncHooks.AsyncLocalStorage;
  "production" !== process.env.NODE_ENV && (function() {
    function voidHandler() {
    }
    function getIteratorFn(maybeIterable) {
      if (null === maybeIterable || "object" !== typeof maybeIterable)
        return null;
      maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
      return "function" === typeof maybeIterable ? maybeIterable : null;
    }
    function _defineProperty(obj, key, value) {
      a: if ("object" == typeof key && key) {
        var e = key[Symbol.toPrimitive];
        if (void 0 !== e) {
          key = e.call(key, "string");
          if ("object" != typeof key) break a;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        key = String(key);
      }
      key = "symbol" == typeof key ? key : key + "";
      key in obj ? Object.defineProperty(obj, key, {
        value,
        enumerable: true,
        configurable: true,
        writable: true
      }) : obj[key] = value;
      return obj;
    }
    function handleErrorInNextTick(error) {
      setTimeout(function() {
        throw error;
      });
    }
    function writeChunkAndReturn(destination, chunk) {
      if (0 !== chunk.byteLength)
        if (2048 < chunk.byteLength)
          0 < writtenBytes && (destination.enqueue(
            new Uint8Array(currentView.buffer, 0, writtenBytes)
          ), currentView = new Uint8Array(2048), writtenBytes = 0), destination.enqueue(chunk);
        else {
          var allowableBytes = currentView.length - writtenBytes;
          allowableBytes < chunk.byteLength && (0 === allowableBytes ? destination.enqueue(currentView) : (currentView.set(
            chunk.subarray(0, allowableBytes),
            writtenBytes
          ), destination.enqueue(currentView), chunk = chunk.subarray(allowableBytes)), currentView = new Uint8Array(2048), writtenBytes = 0);
          currentView.set(chunk, writtenBytes);
          writtenBytes += chunk.byteLength;
        }
      return true;
    }
    function completeWriting(destination) {
      currentView && 0 < writtenBytes && (destination.enqueue(
        new Uint8Array(currentView.buffer, 0, writtenBytes)
      ), currentView = null, writtenBytes = 0);
    }
    function stringToChunk(content) {
      return textEncoder.encode(content);
    }
    function byteLengthOfChunk(chunk) {
      return chunk.byteLength;
    }
    function closeWithError(destination, error) {
      "function" === typeof destination.error ? destination.error(error) : destination.close();
    }
    function isClientReference2(reference) {
      return reference.$$typeof === CLIENT_REFERENCE_TAG$1;
    }
    function registerClientReferenceImpl(proxyImplementation, id, async) {
      return Object.defineProperties(proxyImplementation, {
        $$typeof: { value: CLIENT_REFERENCE_TAG$1 },
        $$id: { value: id },
        $$async: { value: async }
      });
    }
    function bind() {
      var newFn = FunctionBind.apply(this, arguments);
      if (this.$$typeof === SERVER_REFERENCE_TAG) {
        null != arguments[0] && console.error(
          'Cannot bind "this" of a Server Action. Pass null or undefined as the first argument to .bind().'
        );
        var args = ArraySlice.call(arguments, 1), $$typeof = { value: SERVER_REFERENCE_TAG }, $$id = { value: this.$$id };
        args = { value: this.$$bound ? this.$$bound.concat(args) : args };
        return Object.defineProperties(newFn, {
          $$typeof,
          $$id,
          $$bound: args,
          $$location: { value: this.$$location, configurable: true },
          bind: { value: bind, configurable: true }
        });
      }
      return newFn;
    }
    function getReference(target, name) {
      switch (name) {
        case "$$typeof":
          return target.$$typeof;
        case "$$id":
          return target.$$id;
        case "$$async":
          return target.$$async;
        case "name":
          return target.name;
        case "defaultProps":
          return;
        case "_debugInfo":
          return;
        case "toJSON":
          return;
        case Symbol.toPrimitive:
          return Object.prototype[Symbol.toPrimitive];
        case Symbol.toStringTag:
          return Object.prototype[Symbol.toStringTag];
        case "__esModule":
          var moduleId = target.$$id;
          target.default = registerClientReferenceImpl(
            function() {
              throw Error(
                "Attempted to call the default export of " + moduleId + " from the server but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component."
              );
            },
            target.$$id + "#",
            target.$$async
          );
          return true;
        case "then":
          if (target.then) return target.then;
          if (target.$$async) return;
          var clientReference = registerClientReferenceImpl(
            {},
            target.$$id,
            true
          ), proxy = new Proxy(clientReference, proxyHandlers$1);
          target.status = "fulfilled";
          target.value = proxy;
          return target.then = registerClientReferenceImpl(
            function(resolve) {
              return Promise.resolve(resolve(proxy));
            },
            target.$$id + "#then",
            false
          );
      }
      if ("symbol" === typeof name)
        throw Error(
          "Cannot read Symbol exports. Only named exports are supported on a client module imported on the server."
        );
      clientReference = target[name];
      clientReference || (clientReference = registerClientReferenceImpl(
        function() {
          throw Error(
            "Attempted to call " + String(name) + "() from the server but " + String(name) + " is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component."
          );
        },
        target.$$id + "#" + name,
        target.$$async
      ), Object.defineProperty(clientReference, "name", { value: name }), clientReference = target[name] = new Proxy(clientReference, deepProxyHandlers));
      return clientReference;
    }
    function resolveClientReferenceMetadata(config, clientReference) {
      var modulePath = clientReference.$$id, name = "", resolvedModuleData = config[modulePath];
      if (resolvedModuleData) name = resolvedModuleData.name;
      else {
        var idx = modulePath.lastIndexOf("#");
        -1 !== idx && (name = modulePath.slice(idx + 1), resolvedModuleData = config[modulePath.slice(0, idx)]);
        if (!resolvedModuleData)
          throw Error(
            'Could not find the module "' + modulePath + '" in the React Client Manifest. This is probably a bug in the React Server Components bundler.'
          );
      }
      if (true === resolvedModuleData.async && true === clientReference.$$async)
        throw Error(
          'The module "' + modulePath + '" is marked as an async ESM module but was loaded as a CJS proxy. This is probably a bug in the React Server Components bundler.'
        );
      return true === resolvedModuleData.async || true === clientReference.$$async ? [resolvedModuleData.id, resolvedModuleData.chunks, name, 1] : [resolvedModuleData.id, resolvedModuleData.chunks, name];
    }
    function preload(href, as, options) {
      if ("string" === typeof href) {
        var request = resolveRequest();
        if (request) {
          var hints = request.hints, key = "L";
          if ("image" === as && options) {
            var imageSrcSet = options.imageSrcSet, imageSizes = options.imageSizes, uniquePart = "";
            "string" === typeof imageSrcSet && "" !== imageSrcSet ? (uniquePart += "[" + imageSrcSet + "]", "string" === typeof imageSizes && (uniquePart += "[" + imageSizes + "]")) : uniquePart += "[][]" + href;
            key += "[image]" + uniquePart;
          } else key += "[" + as + "]" + href;
          hints.has(key) || (hints.add(key), (options = trimOptions(options)) ? emitHint(request, "L", [href, as, options]) : emitHint(request, "L", [href, as]));
        } else previousDispatcher.L(href, as, options);
      }
    }
    function preloadModule$1(href, options) {
      if ("string" === typeof href) {
        var request = resolveRequest();
        if (request) {
          var hints = request.hints, key = "m|" + href;
          if (hints.has(key)) return;
          hints.add(key);
          return (options = trimOptions(options)) ? emitHint(request, "m", [href, options]) : emitHint(request, "m", href);
        }
        previousDispatcher.m(href, options);
      }
    }
    function trimOptions(options) {
      if (null == options) return null;
      var hasProperties = false, trimmed = {}, key;
      for (key in options)
        null != options[key] && (hasProperties = true, trimmed[key] = options[key]);
      return hasProperties ? trimmed : null;
    }
    function getChildFormatContext(parentContext, type, props) {
      switch (type) {
        case "img":
          type = props.src;
          var srcSet = props.srcSet;
          if (!("lazy" === props.loading || !type && !srcSet || "string" !== typeof type && null != type || "string" !== typeof srcSet && null != srcSet || "low" === props.fetchPriority || parentContext & 3) && ("string" !== typeof type || ":" !== type[4] || "d" !== type[0] && "D" !== type[0] || "a" !== type[1] && "A" !== type[1] || "t" !== type[2] && "T" !== type[2] || "a" !== type[3] && "A" !== type[3]) && ("string" !== typeof srcSet || ":" !== srcSet[4] || "d" !== srcSet[0] && "D" !== srcSet[0] || "a" !== srcSet[1] && "A" !== srcSet[1] || "t" !== srcSet[2] && "T" !== srcSet[2] || "a" !== srcSet[3] && "A" !== srcSet[3])) {
            var sizes = "string" === typeof props.sizes ? props.sizes : void 0;
            var input = props.crossOrigin;
            preload(type || "", "image", {
              imageSrcSet: srcSet,
              imageSizes: sizes,
              crossOrigin: "string" === typeof input ? "use-credentials" === input ? input : "" : void 0,
              integrity: props.integrity,
              type: props.type,
              fetchPriority: props.fetchPriority,
              referrerPolicy: props.referrerPolicy
            });
          }
          return parentContext;
        case "link":
          type = props.rel;
          srcSet = props.href;
          if (!(parentContext & 1 || null != props.itemProp || "string" !== typeof type || "string" !== typeof srcSet || "" === srcSet))
            switch (type) {
              case "preload":
                preload(srcSet, props.as, {
                  crossOrigin: props.crossOrigin,
                  integrity: props.integrity,
                  nonce: props.nonce,
                  type: props.type,
                  fetchPriority: props.fetchPriority,
                  referrerPolicy: props.referrerPolicy,
                  imageSrcSet: props.imageSrcSet,
                  imageSizes: props.imageSizes,
                  media: props.media
                });
                break;
              case "modulepreload":
                preloadModule$1(srcSet, {
                  as: props.as,
                  crossOrigin: props.crossOrigin,
                  integrity: props.integrity,
                  nonce: props.nonce
                });
                break;
              case "stylesheet":
                preload(srcSet, "stylesheet", {
                  crossOrigin: props.crossOrigin,
                  integrity: props.integrity,
                  nonce: props.nonce,
                  type: props.type,
                  fetchPriority: props.fetchPriority,
                  referrerPolicy: props.referrerPolicy,
                  media: props.media
                });
            }
          return parentContext;
        case "picture":
          return parentContext | 2;
        case "noscript":
          return parentContext | 1;
        default:
          return parentContext;
      }
    }
    function collectStackTracePrivate(error, structuredStackTrace) {
      error = [];
      for (var i = framesToSkip; i < structuredStackTrace.length; i++) {
        var callSite = structuredStackTrace[i], name = callSite.getFunctionName() || "<anonymous>";
        if (name.includes("react_stack_bottom_frame")) break;
        else if (callSite.isNative())
          callSite = callSite.isAsync(), error.push([name, "", 0, 0, 0, 0, callSite]);
        else {
          if (callSite.isConstructor()) name = "new " + name;
          else if (!callSite.isToplevel()) {
            var callSite$jscomp$0 = callSite;
            name = callSite$jscomp$0.getTypeName();
            var methodName = callSite$jscomp$0.getMethodName();
            callSite$jscomp$0 = callSite$jscomp$0.getFunctionName();
            var result = "";
            callSite$jscomp$0 ? (name && identifierRegExp.test(callSite$jscomp$0) && callSite$jscomp$0 !== name && (result += name + "."), result += callSite$jscomp$0, !methodName || callSite$jscomp$0 === methodName || callSite$jscomp$0.endsWith("." + methodName) || callSite$jscomp$0.endsWith(" " + methodName) || (result += " [as " + methodName + "]")) : (name && (result += name + "."), result = methodName ? result + methodName : result + "<anonymous>");
            name = result;
          }
          "<anonymous>" === name && (name = "");
          methodName = callSite.getScriptNameOrSourceURL() || "<anonymous>";
          "<anonymous>" === methodName && (methodName = "", callSite.isEval() && (callSite$jscomp$0 = callSite.getEvalOrigin()) && (methodName = callSite$jscomp$0.toString() + ", <anonymous>"));
          callSite$jscomp$0 = callSite.getLineNumber() || 0;
          result = callSite.getColumnNumber() || 0;
          var enclosingLine = "function" === typeof callSite.getEnclosingLineNumber ? callSite.getEnclosingLineNumber() || 0 : 0, enclosingCol = "function" === typeof callSite.getEnclosingColumnNumber ? callSite.getEnclosingColumnNumber() || 0 : 0;
          callSite = callSite.isAsync();
          error.push([
            name,
            methodName,
            callSite$jscomp$0,
            result,
            enclosingLine,
            enclosingCol,
            callSite
          ]);
        }
      }
      collectedStackTrace = error;
      return "";
    }
    function collectStackTrace(error, structuredStackTrace) {
      collectStackTracePrivate(error, structuredStackTrace);
      error = (error.name || "Error") + ": " + (error.message || "");
      for (var i = 0; i < structuredStackTrace.length; i++)
        error += "\n    at " + structuredStackTrace[i].toString();
      return error;
    }
    function parseStackTrace(error, skipFrames) {
      var existing = stackTraceCache.get(error);
      if (void 0 !== existing) return existing;
      collectedStackTrace = null;
      framesToSkip = skipFrames;
      existing = Error.prepareStackTrace;
      Error.prepareStackTrace = collectStackTrace;
      try {
        var stack = String(error.stack);
      } finally {
        Error.prepareStackTrace = existing;
      }
      if (null !== collectedStackTrace)
        return stack = collectedStackTrace, collectedStackTrace = null, stackTraceCache.set(error, stack), stack;
      stack.startsWith("Error: react-stack-top-frame\n") && (stack = stack.slice(29));
      existing = stack.indexOf("react_stack_bottom_frame");
      -1 !== existing && (existing = stack.lastIndexOf("\n", existing));
      -1 !== existing && (stack = stack.slice(0, existing));
      stack = stack.split("\n");
      for (existing = []; skipFrames < stack.length; skipFrames++) {
        var parsed = frameRegExp.exec(stack[skipFrames]);
        if (parsed) {
          var name = parsed[1] || "", isAsync = "async " === parsed[8];
          "<anonymous>" === name ? name = "" : name.startsWith("async ") && (name = name.slice(5), isAsync = true);
          var filename = parsed[2] || parsed[5] || "";
          "<anonymous>" === filename && (filename = "");
          existing.push([
            name,
            filename,
            +(parsed[3] || parsed[6]),
            +(parsed[4] || parsed[7]),
            0,
            0,
            isAsync
          ]);
        }
      }
      stackTraceCache.set(error, existing);
      return existing;
    }
    function createTemporaryReference(temporaryReferences, id) {
      var reference = Object.defineProperties(
        function() {
          throw Error(
            "Attempted to call a temporary Client Reference from the server but it is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component."
          );
        },
        { $$typeof: { value: TEMPORARY_REFERENCE_TAG } }
      );
      reference = new Proxy(reference, proxyHandlers);
      temporaryReferences.set(reference, id);
      return reference;
    }
    function noop() {
    }
    function trackUsedThenable(thenableState2, thenable, index) {
      index = thenableState2[index];
      void 0 === index ? (thenableState2.push(thenable), (thenableState2._stacks || (thenableState2._stacks = [])).push(Error())) : index !== thenable && (thenable.then(noop, noop), thenable = index);
      switch (thenable.status) {
        case "fulfilled":
          return thenable.value;
        case "rejected":
          throw thenable.reason;
        default:
          "string" === typeof thenable.status ? thenable.then(noop, noop) : (thenableState2 = thenable, thenableState2.status = "pending", thenableState2.then(
            function(fulfilledValue) {
              if ("pending" === thenable.status) {
                var fulfilledThenable = thenable;
                fulfilledThenable.status = "fulfilled";
                fulfilledThenable.value = fulfilledValue;
              }
            },
            function(error) {
              if ("pending" === thenable.status) {
                var rejectedThenable = thenable;
                rejectedThenable.status = "rejected";
                rejectedThenable.reason = error;
              }
            }
          ));
          switch (thenable.status) {
            case "fulfilled":
              return thenable.value;
            case "rejected":
              throw thenable.reason;
          }
          suspendedThenable = thenable;
          throw SuspenseException;
      }
    }
    function getSuspendedThenable() {
      if (null === suspendedThenable)
        throw Error(
          "Expected a suspended thenable. This is a bug in React. Please file an issue."
        );
      var thenable = suspendedThenable;
      suspendedThenable = null;
      return thenable;
    }
    function getThenableStateAfterSuspending() {
      var state = thenableState || [];
      state._componentDebugInfo = currentComponentDebugInfo;
      thenableState = currentComponentDebugInfo = null;
      return state;
    }
    function unsupportedHook() {
      throw Error("This Hook is not supported in Server Components.");
    }
    function unsupportedRefresh() {
      throw Error(
        "Refreshing the cache is not supported in Server Components."
      );
    }
    function unsupportedContext() {
      throw Error("Cannot read a Client Context from a Server Component.");
    }
    function resolveOwner() {
      if (currentOwner) return currentOwner;
      if (supportsComponentStorage) {
        var owner = componentStorage.getStore();
        if (owner) return owner;
      }
      return null;
    }
    function prepareStackTrace(error, structuredStackTrace) {
      error = (error.name || "Error") + ": " + (error.message || "");
      for (var i = 0; i < structuredStackTrace.length; i++)
        error += "\n    at " + structuredStackTrace[i].toString();
      return error;
    }
    function resetOwnerStackLimit() {
      var now = getCurrentTime();
      1e3 < now - lastResetTime && (ReactSharedInternalsServer.recentlyCreatedOwnerStacks = 0, lastResetTime = now);
    }
    function isObjectPrototype(object) {
      if (!object) return false;
      var ObjectPrototype2 = Object.prototype;
      if (object === ObjectPrototype2) return true;
      if (getPrototypeOf(object)) return false;
      object = Object.getOwnPropertyNames(object);
      for (var i = 0; i < object.length; i++)
        if (!(object[i] in ObjectPrototype2)) return false;
      return true;
    }
    function isGetter(object, name) {
      if (object === Object.prototype || null === object) return false;
      var descriptor = Object.getOwnPropertyDescriptor(object, name);
      return void 0 === descriptor ? isGetter(getPrototypeOf(object), name) : "function" === typeof descriptor.get;
    }
    function isSimpleObject(object) {
      if (!isObjectPrototype(getPrototypeOf(object))) return false;
      for (var names = Object.getOwnPropertyNames(object), i = 0; i < names.length; i++) {
        var descriptor = Object.getOwnPropertyDescriptor(object, names[i]);
        if (!descriptor || !descriptor.enumerable && ("key" !== names[i] && "ref" !== names[i] || "function" !== typeof descriptor.get))
          return false;
      }
      return true;
    }
    function objectName(object) {
      object = Object.prototype.toString.call(object);
      return object.slice(8, object.length - 1);
    }
    function describeKeyForErrorMessage(key) {
      var encodedKey = JSON.stringify(key);
      return '"' + key + '"' === encodedKey ? key : encodedKey;
    }
    function describeValueForErrorMessage(value) {
      switch (typeof value) {
        case "string":
          return JSON.stringify(
            10 >= value.length ? value : value.slice(0, 10) + "..."
          );
        case "object":
          if (isArrayImpl(value)) return "[...]";
          if (null !== value && value.$$typeof === CLIENT_REFERENCE_TAG)
            return "client";
          value = objectName(value);
          return "Object" === value ? "{...}" : value;
        case "function":
          return value.$$typeof === CLIENT_REFERENCE_TAG ? "client" : (value = value.displayName || value.name) ? "function " + value : "function";
        default:
          return String(value);
      }
    }
    function describeElementType(type) {
      if ("string" === typeof type) return type;
      switch (type) {
        case REACT_SUSPENSE_TYPE:
          return "Suspense";
        case REACT_SUSPENSE_LIST_TYPE:
          return "SuspenseList";
      }
      if ("object" === typeof type)
        switch (type.$$typeof) {
          case REACT_FORWARD_REF_TYPE:
            return describeElementType(type.render);
          case REACT_MEMO_TYPE:
            return describeElementType(type.type);
          case REACT_LAZY_TYPE:
            var payload = type._payload;
            type = type._init;
            try {
              return describeElementType(type(payload));
            } catch (x) {
            }
        }
      return "";
    }
    function describeObjectForErrorMessage(objectOrArray, expandedName) {
      var objKind = objectName(objectOrArray);
      if ("Object" !== objKind && "Array" !== objKind) return objKind;
      var start = -1, length = 0;
      if (isArrayImpl(objectOrArray))
        if (jsxChildrenParents.has(objectOrArray)) {
          var type = jsxChildrenParents.get(objectOrArray);
          objKind = "<" + describeElementType(type) + ">";
          for (var i = 0; i < objectOrArray.length; i++) {
            var value = objectOrArray[i];
            value = "string" === typeof value ? value : "object" === typeof value && null !== value ? "{" + describeObjectForErrorMessage(value) + "}" : "{" + describeValueForErrorMessage(value) + "}";
            "" + i === expandedName ? (start = objKind.length, length = value.length, objKind += value) : objKind = 15 > value.length && 40 > objKind.length + value.length ? objKind + value : objKind + "{...}";
          }
          objKind += "</" + describeElementType(type) + ">";
        } else {
          objKind = "[";
          for (type = 0; type < objectOrArray.length; type++)
            0 < type && (objKind += ", "), i = objectOrArray[type], i = "object" === typeof i && null !== i ? describeObjectForErrorMessage(i) : describeValueForErrorMessage(i), "" + type === expandedName ? (start = objKind.length, length = i.length, objKind += i) : objKind = 10 > i.length && 40 > objKind.length + i.length ? objKind + i : objKind + "...";
          objKind += "]";
        }
      else if (objectOrArray.$$typeof === REACT_ELEMENT_TYPE)
        objKind = "<" + describeElementType(objectOrArray.type) + "/>";
      else {
        if (objectOrArray.$$typeof === CLIENT_REFERENCE_TAG) return "client";
        if (jsxPropsParents.has(objectOrArray)) {
          objKind = jsxPropsParents.get(objectOrArray);
          objKind = "<" + (describeElementType(objKind) || "...");
          type = Object.keys(objectOrArray);
          for (i = 0; i < type.length; i++) {
            objKind += " ";
            value = type[i];
            objKind += describeKeyForErrorMessage(value) + "=";
            var _value2 = objectOrArray[value];
            var _substr2 = value === expandedName && "object" === typeof _value2 && null !== _value2 ? describeObjectForErrorMessage(_value2) : describeValueForErrorMessage(_value2);
            "string" !== typeof _value2 && (_substr2 = "{" + _substr2 + "}");
            value === expandedName ? (start = objKind.length, length = _substr2.length, objKind += _substr2) : objKind = 10 > _substr2.length && 40 > objKind.length + _substr2.length ? objKind + _substr2 : objKind + "...";
          }
          objKind += ">";
        } else {
          objKind = "{";
          type = Object.keys(objectOrArray);
          for (i = 0; i < type.length; i++)
            0 < i && (objKind += ", "), value = type[i], objKind += describeKeyForErrorMessage(value) + ": ", _value2 = objectOrArray[value], _value2 = "object" === typeof _value2 && null !== _value2 ? describeObjectForErrorMessage(_value2) : describeValueForErrorMessage(_value2), value === expandedName ? (start = objKind.length, length = _value2.length, objKind += _value2) : objKind = 10 > _value2.length && 40 > objKind.length + _value2.length ? objKind + _value2 : objKind + "...";
          objKind += "}";
        }
      }
      return void 0 === expandedName ? objKind : -1 < start && 0 < length ? (objectOrArray = " ".repeat(start) + "^".repeat(length), "\n  " + objKind + "\n  " + objectOrArray) : "\n  " + objKind;
    }
    function defaultFilterStackFrame(filename) {
      return "" !== filename && !filename.startsWith("node:") && !filename.includes("node_modules");
    }
    function filterStackTrace(request, stack) {
      request = request.filterStackFrame;
      for (var filteredStack = [], i = 0; i < stack.length; i++) {
        var callsite = stack[i], functionName = callsite[0];
        var url = callsite[1];
        if (url.startsWith("about://React/")) {
          var envIdx = url.indexOf("/", 14), suffixIdx = url.lastIndexOf("?");
          -1 < envIdx && -1 < suffixIdx && (url = decodeURI(url.slice(envIdx + 1, suffixIdx)));
        }
        request(url, functionName, callsite[2], callsite[3]) && (callsite = callsite.slice(0), callsite[1] = url, filteredStack.push(callsite));
      }
      return filteredStack;
    }
    function patchConsole(consoleInst, methodName) {
      var descriptor = Object.getOwnPropertyDescriptor(consoleInst, methodName);
      if (descriptor && (descriptor.configurable || descriptor.writable) && "function" === typeof descriptor.value) {
        var originalMethod = descriptor.value;
        descriptor = Object.getOwnPropertyDescriptor(originalMethod, "name");
        var wrapperMethod = function() {
          var request = resolveRequest();
          if (("assert" !== methodName || !arguments[0]) && null !== request) {
            a: {
              var error = Error("react-stack-top-frame");
              collectedStackTrace = null;
              framesToSkip = 1;
              var previousPrepare = Error.prepareStackTrace;
              Error.prepareStackTrace = collectStackTracePrivate;
              try {
                if ("" !== error.stack) {
                  var JSCompiler_inline_result = null;
                  break a;
                }
              } finally {
                Error.prepareStackTrace = previousPrepare;
              }
              JSCompiler_inline_result = collectedStackTrace;
            }
            JSCompiler_inline_result = filterStackTrace(
              request,
              JSCompiler_inline_result || []
            );
            request.pendingDebugChunks++;
            error = resolveOwner();
            previousPrepare = Array.from(arguments);
            a: {
              var env = 0;
              switch (methodName) {
                case "dir":
                case "dirxml":
                case "groupEnd":
                case "table":
                  env = null;
                  break a;
                case "assert":
                  env = 1;
              }
              var format = previousPrepare[env], style = previousPrepare[env + 1], badge = previousPrepare[env + 2];
              "string" === typeof format && format.startsWith("\x1B[0m\x1B[7m%c%s\x1B[0m%c") && "background: #e6e6e6;background: light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.25));color: #000000;color: light-dark(#000000, #ffffff);border-radius: 2px" === style && "string" === typeof badge ? (format = format.slice(18), " " === format[0] && (format = format.slice(1)), previousPrepare.splice(env, 4, format), env = badge.slice(1, badge.length - 1)) : env = null;
            }
            null === env && (env = (0, request.environmentName)());
            null != error && outlineComponentInfo(request, error);
            badge = [methodName, JSCompiler_inline_result, error, env];
            badge.push.apply(badge, previousPrepare);
            previousPrepare = serializeDebugModel(
              request,
              (null === request.deferredDebugObjects ? 500 : 10) + JSCompiler_inline_result.length,
              badge
            );
            "[" !== previousPrepare[0] && (previousPrepare = serializeDebugModel(
              request,
              10 + JSCompiler_inline_result.length,
              [
                methodName,
                JSCompiler_inline_result,
                error,
                env,
                "Unknown Value: React could not send it from the server."
              ]
            ));
            JSCompiler_inline_result = stringToChunk(
              ":W" + previousPrepare + "\n"
            );
            request.completedDebugChunks.push(JSCompiler_inline_result);
          }
          return originalMethod.apply(this, arguments);
        };
        descriptor && Object.defineProperty(wrapperMethod, "name", descriptor);
        Object.defineProperty(consoleInst, methodName, {
          value: wrapperMethod
        });
      }
    }
    function getCurrentStackInDEV() {
      var owner = resolveOwner();
      if (null === owner) return "";
      try {
        var info = "";
        if (owner.owner || "string" !== typeof owner.name) {
          for (; owner; ) {
            var ownerStack = owner.debugStack;
            if (null != ownerStack) {
              if (owner = owner.owner) {
                var JSCompiler_temp_const = info;
                var error = ownerStack, prevPrepareStackTrace = Error.prepareStackTrace;
                Error.prepareStackTrace = prepareStackTrace;
                var stack = error.stack;
                Error.prepareStackTrace = prevPrepareStackTrace;
                stack.startsWith("Error: react-stack-top-frame\n") && (stack = stack.slice(29));
                var idx = stack.indexOf("\n");
                -1 !== idx && (stack = stack.slice(idx + 1));
                idx = stack.indexOf("react_stack_bottom_frame");
                -1 !== idx && (idx = stack.lastIndexOf("\n", idx));
                var JSCompiler_inline_result = -1 !== idx ? stack = stack.slice(0, idx) : "";
                info = JSCompiler_temp_const + ("\n" + JSCompiler_inline_result);
              }
            } else break;
          }
          var JSCompiler_inline_result$jscomp$0 = info;
        } else {
          JSCompiler_temp_const = owner.name;
          if (void 0 === prefix)
            try {
              throw Error();
            } catch (x) {
              prefix = (error = x.stack.trim().match(/\n( *(at )?)/)) && error[1] || "", suffix = -1 < x.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < x.stack.indexOf("@") ? "@unknown:0:0" : "";
            }
          JSCompiler_inline_result$jscomp$0 = "\n" + prefix + JSCompiler_temp_const + suffix;
        }
      } catch (x) {
        JSCompiler_inline_result$jscomp$0 = "\nError generating stack: " + x.message + "\n" + x.stack;
      }
      return JSCompiler_inline_result$jscomp$0;
    }
    function defaultErrorHandler(error) {
      console.error(error);
    }
    function RequestInstance(type, model, bundlerConfig, onError, onPostpone, onAllReady, onFatalError, identifierPrefix, temporaryReferences, environmentName, filterStackFrame, keepDebugAlive) {
      if (null !== ReactSharedInternalsServer.A && ReactSharedInternalsServer.A !== DefaultAsyncDispatcher)
        throw Error(
          "Currently React only supports one RSC renderer at a time."
        );
      ReactSharedInternalsServer.A = DefaultAsyncDispatcher;
      ReactSharedInternalsServer.getCurrentStack = getCurrentStackInDEV;
      var abortSet = /* @__PURE__ */ new Set(), pingedTasks = [], hints = /* @__PURE__ */ new Set();
      this.type = type;
      this.status = 10;
      this.flushScheduled = false;
      this.destination = this.fatalError = null;
      this.bundlerConfig = bundlerConfig;
      this.cache = /* @__PURE__ */ new Map();
      this.cacheController = new AbortController();
      this.pendingChunks = this.nextChunkId = 0;
      this.hints = hints;
      this.abortableTasks = abortSet;
      this.pingedTasks = pingedTasks;
      this.completedImportChunks = [];
      this.completedHintChunks = [];
      this.completedRegularChunks = [];
      this.completedErrorChunks = [];
      this.writtenSymbols = /* @__PURE__ */ new Map();
      this.writtenClientReferences = /* @__PURE__ */ new Map();
      this.writtenServerReferences = /* @__PURE__ */ new Map();
      this.writtenObjects = /* @__PURE__ */ new WeakMap();
      this.temporaryReferences = temporaryReferences;
      this.identifierPrefix = identifierPrefix || "";
      this.identifierCount = 1;
      this.taintCleanupQueue = [];
      this.onError = void 0 === onError ? defaultErrorHandler : onError;
      this.onPostpone = void 0 === onPostpone ? defaultPostponeHandler : onPostpone;
      this.onAllReady = onAllReady;
      this.onFatalError = onFatalError;
      this.pendingDebugChunks = 0;
      this.completedDebugChunks = [];
      this.debugDestination = null;
      this.environmentName = void 0 === environmentName ? function() {
        return "Server";
      } : "function" !== typeof environmentName ? function() {
        return environmentName;
      } : environmentName;
      this.filterStackFrame = void 0 === filterStackFrame ? defaultFilterStackFrame : filterStackFrame;
      this.didWarnForKey = null;
      this.writtenDebugObjects = /* @__PURE__ */ new WeakMap();
      this.deferredDebugObjects = keepDebugAlive ? { retained: /* @__PURE__ */ new Map(), existing: /* @__PURE__ */ new Map() } : null;
      type = this.timeOrigin = performance.now();
      emitTimeOriginChunk(this, type + performance.timeOrigin);
      this.abortTime = -0;
      model = createTask(
        this,
        model,
        null,
        false,
        0,
        abortSet,
        type,
        null,
        null,
        null
      );
      pingedTasks.push(model);
    }
    function createRequest(model, bundlerConfig, onError, identifierPrefix, onPostpone, temporaryReferences, environmentName, filterStackFrame, keepDebugAlive) {
      resetOwnerStackLimit();
      return new RequestInstance(
        20,
        model,
        bundlerConfig,
        onError,
        onPostpone,
        noop,
        noop,
        identifierPrefix,
        temporaryReferences,
        environmentName,
        filterStackFrame,
        keepDebugAlive
      );
    }
    function createPrerenderRequest(model, bundlerConfig, onAllReady, onFatalError, onError, identifierPrefix, onPostpone, temporaryReferences, environmentName, filterStackFrame, keepDebugAlive) {
      resetOwnerStackLimit();
      return new RequestInstance(
        21,
        model,
        bundlerConfig,
        onError,
        onPostpone,
        onAllReady,
        onFatalError,
        identifierPrefix,
        temporaryReferences,
        environmentName,
        filterStackFrame,
        keepDebugAlive
      );
    }
    function resolveRequest() {
      if (currentRequest) return currentRequest;
      if (supportsRequestStorage) {
        var store = requestStorage.getStore();
        if (store) return store;
      }
      return null;
    }
    function serializeDebugThenable(request, counter, thenable) {
      request.pendingDebugChunks++;
      var id = request.nextChunkId++, ref = "$@" + id.toString(16);
      request.writtenDebugObjects.set(thenable, ref);
      switch (thenable.status) {
        case "fulfilled":
          return emitOutlinedDebugModelChunk(request, id, counter, thenable.value), ref;
        case "rejected":
          return emitErrorChunk(request, id, "", thenable.reason, true, null), ref;
      }
      if (request.status === ABORTING)
        return emitDebugHaltChunk(request, id), ref;
      var deferredDebugObjects = request.deferredDebugObjects;
      if (null !== deferredDebugObjects)
        return deferredDebugObjects.retained.set(id, thenable), ref = "$Y@" + id.toString(16), request.writtenDebugObjects.set(thenable, ref), ref;
      var cancelled = false;
      thenable.then(
        function(value) {
          cancelled || (cancelled = true, request.status === ABORTING ? emitDebugHaltChunk(request, id) : emitOutlinedDebugModelChunk(request, id, counter, value), enqueueFlush(request));
        },
        function(reason) {
          cancelled || (cancelled = true, request.status === ABORTING ? emitDebugHaltChunk(request, id) : emitErrorChunk(request, id, "", reason, true, null), enqueueFlush(request));
        }
      );
      Promise.resolve().then(function() {
        cancelled || (cancelled = true, emitDebugHaltChunk(request, id), enqueueFlush(request), counter = request = null);
      });
      return ref;
    }
    function emitRequestedDebugThenable(request, id, counter, thenable) {
      thenable.then(
        function(value) {
          request.status === ABORTING ? emitDebugHaltChunk(request, id) : emitOutlinedDebugModelChunk(request, id, counter, value);
          enqueueFlush(request);
        },
        function(reason) {
          request.status === ABORTING ? emitDebugHaltChunk(request, id) : emitErrorChunk(request, id, "", reason, true, null);
          enqueueFlush(request);
        }
      );
    }
    function serializeThenable(request, task, thenable) {
      var newTask = createTask(
        request,
        thenable,
        task.keyPath,
        task.implicitSlot,
        task.formatContext,
        request.abortableTasks,
        task.time,
        task.debugOwner,
        task.debugStack,
        task.debugTask
      );
      switch (thenable.status) {
        case "fulfilled":
          return forwardDebugInfoFromThenable(
            request,
            newTask,
            thenable
          ), newTask.model = thenable.value, pingTask(request, newTask), newTask.id;
        case "rejected":
          return forwardDebugInfoFromThenable(
            request,
            newTask,
            thenable
          ), erroredTask(request, newTask, thenable.reason), newTask.id;
        default:
          if (request.status === ABORTING)
            return request.abortableTasks.delete(newTask), 21 === request.type ? (haltTask(newTask), finishHaltedTask(newTask, request)) : (task = request.fatalError, abortTask(newTask), finishAbortedTask(newTask, request, task)), newTask.id;
          "string" !== typeof thenable.status && (thenable.status = "pending", thenable.then(
            function(fulfilledValue) {
              "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
            },
            function(error) {
              "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
            }
          ));
      }
      thenable.then(
        function(value) {
          forwardDebugInfoFromCurrentContext(request, newTask, thenable);
          newTask.model = value;
          pingTask(request, newTask);
        },
        function(reason) {
          0 === newTask.status && (newTask.timed = true, erroredTask(request, newTask, reason), enqueueFlush(request));
        }
      );
      return newTask.id;
    }
    function serializeReadableStream(request, task, stream) {
      function progress(entry) {
        if (0 === streamTask.status)
          if (entry.done)
            streamTask.status = 1, entry = streamTask.id.toString(16) + ":C\n", request.completedRegularChunks.push(stringToChunk(entry)), request.abortableTasks.delete(streamTask), request.cacheController.signal.removeEventListener(
              "abort",
              abortStream
            ), enqueueFlush(request), callOnAllReadyIfReady(request);
          else
            try {
              streamTask.model = entry.value, request.pendingChunks++, tryStreamTask(request, streamTask), enqueueFlush(request), reader.read().then(progress, error);
            } catch (x$0) {
              error(x$0);
            }
      }
      function error(reason) {
        0 === streamTask.status && (request.cacheController.signal.removeEventListener(
          "abort",
          abortStream
        ), erroredTask(request, streamTask, reason), enqueueFlush(request), reader.cancel(reason).then(error, error));
      }
      function abortStream() {
        if (0 === streamTask.status) {
          var signal = request.cacheController.signal;
          signal.removeEventListener("abort", abortStream);
          signal = signal.reason;
          21 === request.type ? (request.abortableTasks.delete(streamTask), haltTask(streamTask), finishHaltedTask(streamTask, request)) : (erroredTask(request, streamTask, signal), enqueueFlush(request));
          reader.cancel(signal).then(error, error);
        }
      }
      var supportsBYOB = stream.supportsBYOB;
      if (void 0 === supportsBYOB)
        try {
          stream.getReader({ mode: "byob" }).releaseLock(), supportsBYOB = true;
        } catch (x) {
          supportsBYOB = false;
        }
      var reader = stream.getReader(), streamTask = createTask(
        request,
        task.model,
        task.keyPath,
        task.implicitSlot,
        task.formatContext,
        request.abortableTasks,
        task.time,
        task.debugOwner,
        task.debugStack,
        task.debugTask
      );
      request.pendingChunks++;
      task = streamTask.id.toString(16) + ":" + (supportsBYOB ? "r" : "R") + "\n";
      request.completedRegularChunks.push(stringToChunk(task));
      request.cacheController.signal.addEventListener("abort", abortStream);
      reader.read().then(progress, error);
      return serializeByValueID(streamTask.id);
    }
    function serializeAsyncIterable(request, task, iterable, iterator) {
      function progress(entry) {
        if (0 === streamTask.status)
          if (entry.done) {
            streamTask.status = 1;
            if (void 0 === entry.value)
              var endStreamRow = streamTask.id.toString(16) + ":C\n";
            else
              try {
                var chunkId = outlineModel(request, entry.value);
                endStreamRow = streamTask.id.toString(16) + ":C" + stringify(serializeByValueID(chunkId)) + "\n";
              } catch (x) {
                error(x);
                return;
              }
            request.completedRegularChunks.push(stringToChunk(endStreamRow));
            request.abortableTasks.delete(streamTask);
            request.cacheController.signal.removeEventListener(
              "abort",
              abortIterable
            );
            enqueueFlush(request);
            callOnAllReadyIfReady(request);
          } else
            try {
              streamTask.model = entry.value, request.pendingChunks++, tryStreamTask(request, streamTask), enqueueFlush(request), callIteratorInDEV(iterator, progress, error);
            } catch (x$1) {
              error(x$1);
            }
      }
      function error(reason) {
        0 === streamTask.status && (request.cacheController.signal.removeEventListener(
          "abort",
          abortIterable
        ), erroredTask(request, streamTask, reason), enqueueFlush(request), "function" === typeof iterator.throw && iterator.throw(reason).then(error, error));
      }
      function abortIterable() {
        if (0 === streamTask.status) {
          var signal = request.cacheController.signal;
          signal.removeEventListener("abort", abortIterable);
          var reason = signal.reason;
          21 === request.type ? (request.abortableTasks.delete(streamTask), haltTask(streamTask), finishHaltedTask(streamTask, request)) : (erroredTask(request, streamTask, signal.reason), enqueueFlush(request));
          "function" === typeof iterator.throw && iterator.throw(reason).then(error, error);
        }
      }
      var isIterator = iterable === iterator, streamTask = createTask(
        request,
        task.model,
        task.keyPath,
        task.implicitSlot,
        task.formatContext,
        request.abortableTasks,
        task.time,
        task.debugOwner,
        task.debugStack,
        task.debugTask
      );
      (task = iterable._debugInfo) && forwardDebugInfo(request, streamTask, task);
      request.pendingChunks++;
      isIterator = streamTask.id.toString(16) + ":" + (isIterator ? "x" : "X") + "\n";
      request.completedRegularChunks.push(stringToChunk(isIterator));
      request.cacheController.signal.addEventListener("abort", abortIterable);
      callIteratorInDEV(iterator, progress, error);
      return serializeByValueID(streamTask.id);
    }
    function emitHint(request, code, model) {
      model = stringify(model);
      code = stringToChunk(":H" + code + model + "\n");
      request.completedHintChunks.push(code);
      enqueueFlush(request);
    }
    function readThenable(thenable) {
      if ("fulfilled" === thenable.status) return thenable.value;
      if ("rejected" === thenable.status) throw thenable.reason;
      throw thenable;
    }
    function createLazyWrapperAroundWakeable(request, task, wakeable) {
      switch (wakeable.status) {
        case "fulfilled":
          return forwardDebugInfoFromThenable(request, task, wakeable), wakeable.value;
        case "rejected":
          forwardDebugInfoFromThenable(request, task, wakeable);
          break;
        default:
          "string" !== typeof wakeable.status && (wakeable.status = "pending", wakeable.then(
            function(fulfilledValue) {
              forwardDebugInfoFromCurrentContext(request, task, wakeable);
              "pending" === wakeable.status && (wakeable.status = "fulfilled", wakeable.value = fulfilledValue);
            },
            function(error) {
              forwardDebugInfoFromCurrentContext(request, task, wakeable);
              "pending" === wakeable.status && (wakeable.status = "rejected", wakeable.reason = error);
            }
          ));
      }
      return {
        $$typeof: REACT_LAZY_TYPE,
        _payload: wakeable,
        _init: readThenable
      };
    }
    function callWithDebugContextInDEV(request, task, callback, arg) {
      var componentDebugInfo = {
        name: "",
        env: task.environmentName,
        key: null,
        owner: task.debugOwner
      };
      componentDebugInfo.stack = null === task.debugStack ? null : filterStackTrace(request, parseStackTrace(task.debugStack, 1));
      componentDebugInfo.debugStack = task.debugStack;
      request = componentDebugInfo.debugTask = task.debugTask;
      currentOwner = componentDebugInfo;
      try {
        return request ? request.run(callback.bind(null, arg)) : callback(arg);
      } finally {
        currentOwner = null;
      }
    }
    function processServerComponentReturnValue(request, task, Component, result) {
      if ("object" !== typeof result || null === result || isClientReference2(result))
        return result;
      if ("function" === typeof result.then)
        return result.then(function(resolvedValue) {
          "object" === typeof resolvedValue && null !== resolvedValue && resolvedValue.$$typeof === REACT_ELEMENT_TYPE && (resolvedValue._store.validated = 1);
        }, voidHandler), createLazyWrapperAroundWakeable(request, task, result);
      result.$$typeof === REACT_ELEMENT_TYPE && (result._store.validated = 1);
      var iteratorFn = getIteratorFn(result);
      if (iteratorFn) {
        var multiShot = _defineProperty({}, Symbol.iterator, function() {
          var iterator = iteratorFn.call(result);
          iterator !== result || "[object GeneratorFunction]" === Object.prototype.toString.call(Component) && "[object Generator]" === Object.prototype.toString.call(result) || callWithDebugContextInDEV(request, task, function() {
            console.error(
              "Returning an Iterator from a Server Component is not supported since it cannot be looped over more than once. "
            );
          });
          return iterator;
        });
        multiShot._debugInfo = result._debugInfo;
        return multiShot;
      }
      return "function" !== typeof result[ASYNC_ITERATOR] || "function" === typeof ReadableStream && result instanceof ReadableStream ? result : (multiShot = _defineProperty({}, ASYNC_ITERATOR, function() {
        var iterator = result[ASYNC_ITERATOR]();
        iterator !== result || "[object AsyncGeneratorFunction]" === Object.prototype.toString.call(Component) && "[object AsyncGenerator]" === Object.prototype.toString.call(result) || callWithDebugContextInDEV(request, task, function() {
          console.error(
            "Returning an AsyncIterator from a Server Component is not supported since it cannot be looped over more than once. "
          );
        });
        return iterator;
      }), multiShot._debugInfo = result._debugInfo, multiShot);
    }
    function renderFunctionComponent(request, task, key, Component, props, validated) {
      var prevThenableState = task.thenableState;
      task.thenableState = null;
      if (canEmitDebugInfo)
        if (null !== prevThenableState)
          var componentDebugInfo = prevThenableState._componentDebugInfo;
        else {
          var componentDebugID = task.id;
          componentDebugInfo = Component.displayName || Component.name || "";
          var componentEnv = (0, request.environmentName)();
          request.pendingChunks++;
          componentDebugInfo = {
            name: componentDebugInfo,
            env: componentEnv,
            key,
            owner: task.debugOwner
          };
          componentDebugInfo.stack = null === task.debugStack ? null : filterStackTrace(request, parseStackTrace(task.debugStack, 1));
          componentDebugInfo.props = props;
          componentDebugInfo.debugStack = task.debugStack;
          componentDebugInfo.debugTask = task.debugTask;
          outlineComponentInfo(request, componentDebugInfo);
          var timestamp = performance.now();
          timestamp > task.time ? (emitTimingChunk(request, task.id, timestamp), task.time = timestamp) : task.timed || emitTimingChunk(request, task.id, task.time);
          task.timed = true;
          emitDebugChunk(request, componentDebugID, componentDebugInfo);
          task.environmentName = componentEnv;
          2 === validated && warnForMissingKey(request, key, componentDebugInfo, task.debugTask);
        }
      else return outlineTask(request, task);
      thenableIndexCounter = 0;
      thenableState = prevThenableState;
      currentComponentDebugInfo = componentDebugInfo;
      props = supportsComponentStorage ? task.debugTask ? task.debugTask.run(
        componentStorage.run.bind(
          componentStorage,
          componentDebugInfo,
          callComponentInDEV,
          Component,
          props,
          componentDebugInfo
        )
      ) : componentStorage.run(
        componentDebugInfo,
        callComponentInDEV,
        Component,
        props,
        componentDebugInfo
      ) : task.debugTask ? task.debugTask.run(
        callComponentInDEV.bind(
          null,
          Component,
          props,
          componentDebugInfo
        )
      ) : callComponentInDEV(Component, props, componentDebugInfo);
      if (request.status === ABORTING)
        throw "object" !== typeof props || null === props || "function" !== typeof props.then || isClientReference2(props) || props.then(voidHandler, voidHandler), null;
      validated = thenableState;
      if (null !== validated)
        for (prevThenableState = validated._stacks || (validated._stacks = []), componentDebugID = 0; componentDebugID < validated.length; componentDebugID++)
          forwardDebugInfoFromThenable(
            request,
            task,
            validated[componentDebugID],
            componentDebugInfo,
            prevThenableState[componentDebugID]
          );
      props = processServerComponentReturnValue(
        request,
        task,
        Component,
        props
      );
      task.debugOwner = componentDebugInfo;
      task.debugStack = null;
      task.debugTask = null;
      Component = task.keyPath;
      componentDebugInfo = task.implicitSlot;
      null !== key ? task.keyPath = null === Component ? key : Component + "," + key : null === Component && (task.implicitSlot = true);
      request = renderModelDestructive(request, task, emptyRoot, "", props);
      task.keyPath = Component;
      task.implicitSlot = componentDebugInfo;
      return request;
    }
    function warnForMissingKey(request, key, componentDebugInfo, debugTask) {
      function logKeyError() {
        console.error(
          'Each child in a list should have a unique "key" prop.%s%s See https://react.dev/link/warning-keys for more information.',
          "",
          ""
        );
      }
      key = request.didWarnForKey;
      null == key && (key = request.didWarnForKey = /* @__PURE__ */ new WeakSet());
      request = componentDebugInfo.owner;
      if (null != request) {
        if (key.has(request)) return;
        key.add(request);
      }
      supportsComponentStorage ? debugTask ? debugTask.run(
        componentStorage.run.bind(
          componentStorage,
          componentDebugInfo,
          callComponentInDEV,
          logKeyError,
          null,
          componentDebugInfo
        )
      ) : componentStorage.run(
        componentDebugInfo,
        callComponentInDEV,
        logKeyError,
        null,
        componentDebugInfo
      ) : debugTask ? debugTask.run(
        callComponentInDEV.bind(
          null,
          logKeyError,
          null,
          componentDebugInfo
        )
      ) : callComponentInDEV(logKeyError, null, componentDebugInfo);
    }
    function renderFragment(request, task, children) {
      for (var i = 0; i < children.length; i++) {
        var child = children[i];
        null === child || "object" !== typeof child || child.$$typeof !== REACT_ELEMENT_TYPE || null !== child.key || child._store.validated || (child._store.validated = 2);
      }
      if (null !== task.keyPath)
        return request = [
          REACT_ELEMENT_TYPE,
          REACT_FRAGMENT_TYPE,
          task.keyPath,
          { children },
          null,
          null,
          0
        ], task.implicitSlot ? [request] : request;
      if (i = children._debugInfo) {
        if (canEmitDebugInfo) forwardDebugInfo(request, task, i);
        else return outlineTask(request, task);
        children = Array.from(children);
      }
      return children;
    }
    function renderAsyncFragment(request, task, children, getAsyncIterator) {
      if (null !== task.keyPath)
        return request = [
          REACT_ELEMENT_TYPE,
          REACT_FRAGMENT_TYPE,
          task.keyPath,
          { children },
          null,
          null,
          0
        ], task.implicitSlot ? [request] : request;
      getAsyncIterator = getAsyncIterator.call(children);
      return serializeAsyncIterable(request, task, children, getAsyncIterator);
    }
    function deferTask(request, task) {
      task = createTask(
        request,
        task.model,
        task.keyPath,
        task.implicitSlot,
        task.formatContext,
        request.abortableTasks,
        task.time,
        task.debugOwner,
        task.debugStack,
        task.debugTask
      );
      pingTask(request, task);
      return serializeLazyID(task.id);
    }
    function outlineTask(request, task) {
      task = createTask(
        request,
        task.model,
        task.keyPath,
        task.implicitSlot,
        task.formatContext,
        request.abortableTasks,
        task.time,
        task.debugOwner,
        task.debugStack,
        task.debugTask
      );
      retryTask(request, task);
      return 1 === task.status ? serializeByValueID(task.id) : serializeLazyID(task.id);
    }
    function renderElement(request, task, type, key, ref, props, validated) {
      if (null !== ref && void 0 !== ref)
        throw Error(
          "Refs cannot be used in Server Components, nor passed to Client Components."
        );
      jsxPropsParents.set(props, type);
      "object" === typeof props.children && null !== props.children && jsxChildrenParents.set(props.children, type);
      if ("function" !== typeof type || isClientReference2(type) || type.$$typeof === TEMPORARY_REFERENCE_TAG) {
        if (type === REACT_FRAGMENT_TYPE && null === key)
          return 2 === validated && (validated = {
            name: "Fragment",
            env: (0, request.environmentName)(),
            key,
            owner: task.debugOwner,
            stack: null === task.debugStack ? null : filterStackTrace(
              request,
              parseStackTrace(task.debugStack, 1)
            ),
            props,
            debugStack: task.debugStack,
            debugTask: task.debugTask
          }, warnForMissingKey(request, key, validated, task.debugTask)), validated = task.implicitSlot, null === task.keyPath && (task.implicitSlot = true), request = renderModelDestructive(
            request,
            task,
            emptyRoot,
            "",
            props.children
          ), task.implicitSlot = validated, request;
        if (null != type && "object" === typeof type && !isClientReference2(type))
          switch (type.$$typeof) {
            case REACT_LAZY_TYPE:
              type = callLazyInitInDEV(type);
              if (request.status === ABORTING) throw null;
              return renderElement(
                request,
                task,
                type,
                key,
                ref,
                props,
                validated
              );
            case REACT_FORWARD_REF_TYPE:
              return renderFunctionComponent(
                request,
                task,
                key,
                type.render,
                props,
                validated
              );
            case REACT_MEMO_TYPE:
              return renderElement(
                request,
                task,
                type.type,
                key,
                ref,
                props,
                validated
              );
            case REACT_ELEMENT_TYPE:
              type._store.validated = 1;
          }
        else if ("string" === typeof type) {
          ref = task.formatContext;
          var newFormatContext = getChildFormatContext(ref, type, props);
          ref !== newFormatContext && null != props.children && outlineModelWithFormatContext(
            request,
            props.children,
            newFormatContext
          );
        }
      } else
        return renderFunctionComponent(
          request,
          task,
          key,
          type,
          props,
          validated
        );
      ref = task.keyPath;
      null === key ? key = ref : null !== ref && (key = ref + "," + key);
      newFormatContext = null;
      ref = task.debugOwner;
      null !== ref && outlineComponentInfo(request, ref);
      if (null !== task.debugStack) {
        newFormatContext = filterStackTrace(
          request,
          parseStackTrace(task.debugStack, 1)
        );
        var id = outlineDebugModel(
          request,
          { objectLimit: 2 * newFormatContext.length + 1 },
          newFormatContext
        );
        request.writtenObjects.set(newFormatContext, serializeByValueID(id));
      }
      request = [
        REACT_ELEMENT_TYPE,
        type,
        key,
        props,
        ref,
        newFormatContext,
        validated
      ];
      task = task.implicitSlot && null !== key ? [request] : request;
      return task;
    }
    function pingTask(request, task) {
      task.timed = true;
      var pingedTasks = request.pingedTasks;
      pingedTasks.push(task);
      1 === pingedTasks.length && (request.flushScheduled = null !== request.destination, 21 === request.type || 10 === request.status ? scheduleMicrotask(function() {
        return performWork(request);
      }) : setTimeout(function() {
        return performWork(request);
      }, 0));
    }
    function createTask(request, model, keyPath, implicitSlot, formatContext, abortSet, lastTimestamp, debugOwner, debugStack, debugTask) {
      request.pendingChunks++;
      var id = request.nextChunkId++;
      "object" !== typeof model || null === model || null !== keyPath || implicitSlot || request.writtenObjects.set(model, serializeByValueID(id));
      var task = {
        id,
        status: 0,
        model,
        keyPath,
        implicitSlot,
        formatContext,
        ping: function() {
          return pingTask(request, task);
        },
        toJSON: function(parentPropertyName, value) {
          var parent = this, originalValue = parent[parentPropertyName];
          "object" !== typeof originalValue || originalValue === value || originalValue instanceof Date || callWithDebugContextInDEV(request, task, function() {
            "Object" !== objectName(originalValue) ? "string" === typeof jsxChildrenParents.get(parent) ? console.error(
              "%s objects cannot be rendered as text children. Try formatting it using toString().%s",
              objectName(originalValue),
              describeObjectForErrorMessage(parent, parentPropertyName)
            ) : console.error(
              "Only plain objects can be passed to Client Components from Server Components. %s objects are not supported.%s",
              objectName(originalValue),
              describeObjectForErrorMessage(parent, parentPropertyName)
            ) : console.error(
              "Only plain objects can be passed to Client Components from Server Components. Objects with toJSON methods are not supported. Convert it manually to a simple value before passing it to props.%s",
              describeObjectForErrorMessage(parent, parentPropertyName)
            );
          });
          return renderModel(request, task, parent, parentPropertyName, value);
        },
        thenableState: null,
        timed: false
      };
      task.time = lastTimestamp;
      task.environmentName = request.environmentName();
      task.debugOwner = debugOwner;
      task.debugStack = debugStack;
      task.debugTask = debugTask;
      abortSet.add(task);
      return task;
    }
    function serializeByValueID(id) {
      return "$" + id.toString(16);
    }
    function serializeLazyID(id) {
      return "$L" + id.toString(16);
    }
    function serializeDeferredObject(request, value) {
      var deferredDebugObjects = request.deferredDebugObjects;
      return null !== deferredDebugObjects ? (request.pendingDebugChunks++, request = request.nextChunkId++, deferredDebugObjects.existing.set(value, request), deferredDebugObjects.retained.set(request, value), "$Y" + request.toString(16)) : "$Y";
    }
    function serializeNumber(number) {
      return Number.isFinite(number) ? 0 === number && -Infinity === 1 / number ? "$-0" : number : Infinity === number ? "$Infinity" : -Infinity === number ? "$-Infinity" : "$NaN";
    }
    function encodeReferenceChunk(request, id, reference) {
      request = stringify(reference);
      id = id.toString(16) + ":" + request + "\n";
      return stringToChunk(id);
    }
    function serializeClientReference(request, parent, parentPropertyName, clientReference) {
      var clientReferenceKey = clientReference.$$async ? clientReference.$$id + "#async" : clientReference.$$id, writtenClientReferences = request.writtenClientReferences, existingId = writtenClientReferences.get(clientReferenceKey);
      if (void 0 !== existingId)
        return parent[0] === REACT_ELEMENT_TYPE && "1" === parentPropertyName ? serializeLazyID(existingId) : serializeByValueID(existingId);
      try {
        var clientReferenceMetadata = resolveClientReferenceMetadata(
          request.bundlerConfig,
          clientReference
        );
        request.pendingChunks++;
        var importId = request.nextChunkId++;
        emitImportChunk(request, importId, clientReferenceMetadata, false);
        writtenClientReferences.set(clientReferenceKey, importId);
        return parent[0] === REACT_ELEMENT_TYPE && "1" === parentPropertyName ? serializeLazyID(importId) : serializeByValueID(importId);
      } catch (x) {
        return request.pendingChunks++, parent = request.nextChunkId++, parentPropertyName = logRecoverableError(request, x, null), emitErrorChunk(request, parent, parentPropertyName, x, false, null), serializeByValueID(parent);
      }
    }
    function serializeDebugClientReference(request, parent, parentPropertyName, clientReference) {
      var existingId = request.writtenClientReferences.get(
        clientReference.$$async ? clientReference.$$id + "#async" : clientReference.$$id
      );
      if (void 0 !== existingId)
        return parent[0] === REACT_ELEMENT_TYPE && "1" === parentPropertyName ? serializeLazyID(existingId) : serializeByValueID(existingId);
      try {
        var clientReferenceMetadata = resolveClientReferenceMetadata(
          request.bundlerConfig,
          clientReference
        );
        request.pendingDebugChunks++;
        var importId = request.nextChunkId++;
        emitImportChunk(request, importId, clientReferenceMetadata, true);
        return parent[0] === REACT_ELEMENT_TYPE && "1" === parentPropertyName ? serializeLazyID(importId) : serializeByValueID(importId);
      } catch (x) {
        return request.pendingDebugChunks++, parent = request.nextChunkId++, parentPropertyName = logRecoverableError(request, x, null), emitErrorChunk(request, parent, parentPropertyName, x, true, null), serializeByValueID(parent);
      }
    }
    function outlineModel(request, value) {
      return outlineModelWithFormatContext(request, value, 0);
    }
    function outlineModelWithFormatContext(request, value, formatContext) {
      value = createTask(
        request,
        value,
        null,
        false,
        formatContext,
        request.abortableTasks,
        performance.now(),
        null,
        null,
        null
      );
      retryTask(request, value);
      return value.id;
    }
    function serializeServerReference(request, serverReference) {
      var writtenServerReferences = request.writtenServerReferences, existingId = writtenServerReferences.get(serverReference);
      if (void 0 !== existingId) return "$h" + existingId.toString(16);
      existingId = serverReference.$$bound;
      existingId = null === existingId ? null : Promise.resolve(existingId);
      var id = serverReference.$$id, location = null, error = serverReference.$$location;
      error && (error = parseStackTrace(error, 1), 0 < error.length && (location = error[0], location = [location[0], location[1], location[2], location[3]]));
      existingId = null !== location ? {
        id,
        bound: existingId,
        name: "function" === typeof serverReference ? serverReference.name : "",
        env: (0, request.environmentName)(),
        location
      } : { id, bound: existingId };
      request = outlineModel(request, existingId);
      writtenServerReferences.set(serverReference, request);
      return "$h" + request.toString(16);
    }
    function serializeLargeTextString(request, text) {
      request.pendingChunks++;
      var textId = request.nextChunkId++;
      emitTextChunk(request, textId, text, false);
      return serializeByValueID(textId);
    }
    function serializeMap(request, map) {
      map = Array.from(map);
      return "$Q" + outlineModel(request, map).toString(16);
    }
    function serializeFormData(request, formData) {
      formData = Array.from(formData.entries());
      return "$K" + outlineModel(request, formData).toString(16);
    }
    function serializeSet(request, set) {
      set = Array.from(set);
      return "$W" + outlineModel(request, set).toString(16);
    }
    function serializeTypedArray(request, tag, typedArray) {
      request.pendingChunks++;
      var bufferId = request.nextChunkId++;
      emitTypedArrayChunk(request, bufferId, tag, typedArray, false);
      return serializeByValueID(bufferId);
    }
    function serializeDebugTypedArray(request, tag, typedArray) {
      request.pendingDebugChunks++;
      var bufferId = request.nextChunkId++;
      emitTypedArrayChunk(request, bufferId, tag, typedArray, true);
      return serializeByValueID(bufferId);
    }
    function serializeDebugBlob(request, blob) {
      function progress(entry) {
        if (entry.done)
          emitOutlinedDebugModelChunk(
            request,
            id,
            { objectLimit: model.length + 2 },
            model
          ), enqueueFlush(request);
        else
          return model.push(entry.value), reader.read().then(progress).catch(error);
      }
      function error(reason) {
        emitErrorChunk(request, id, "", reason, true, null);
        enqueueFlush(request);
        reader.cancel(reason).then(noop, noop);
      }
      var model = [blob.type], reader = blob.stream().getReader();
      request.pendingDebugChunks++;
      var id = request.nextChunkId++;
      reader.read().then(progress).catch(error);
      return "$B" + id.toString(16);
    }
    function serializeBlob(request, blob) {
      function progress(entry) {
        if (0 === newTask.status)
          if (entry.done)
            request.cacheController.signal.removeEventListener(
              "abort",
              abortBlob
            ), pingTask(request, newTask);
          else
            return model.push(entry.value), reader.read().then(progress).catch(error);
      }
      function error(reason) {
        0 === newTask.status && (request.cacheController.signal.removeEventListener(
          "abort",
          abortBlob
        ), erroredTask(request, newTask, reason), enqueueFlush(request), reader.cancel(reason).then(error, error));
      }
      function abortBlob() {
        if (0 === newTask.status) {
          var signal = request.cacheController.signal;
          signal.removeEventListener("abort", abortBlob);
          signal = signal.reason;
          21 === request.type ? (request.abortableTasks.delete(newTask), haltTask(newTask), finishHaltedTask(newTask, request)) : (erroredTask(request, newTask, signal), enqueueFlush(request));
          reader.cancel(signal).then(error, error);
        }
      }
      var model = [blob.type], newTask = createTask(
        request,
        model,
        null,
        false,
        0,
        request.abortableTasks,
        performance.now(),
        null,
        null,
        null
      ), reader = blob.stream().getReader();
      request.cacheController.signal.addEventListener("abort", abortBlob);
      reader.read().then(progress).catch(error);
      return "$B" + newTask.id.toString(16);
    }
    function renderModel(request, task, parent, key, value) {
      serializedSize += key.length;
      var prevKeyPath = task.keyPath, prevImplicitSlot = task.implicitSlot;
      try {
        return renderModelDestructive(request, task, parent, key, value);
      } catch (thrownValue) {
        parent = task.model;
        parent = "object" === typeof parent && null !== parent && (parent.$$typeof === REACT_ELEMENT_TYPE || parent.$$typeof === REACT_LAZY_TYPE);
        if (request.status === ABORTING) {
          task.status = 3;
          if (21 === request.type)
            return task = request.nextChunkId++, task = parent ? serializeLazyID(task) : serializeByValueID(task), task;
          task = request.fatalError;
          return parent ? serializeLazyID(task) : serializeByValueID(task);
        }
        key = thrownValue === SuspenseException ? getSuspendedThenable() : thrownValue;
        if ("object" === typeof key && null !== key && "function" === typeof key.then)
          return request = createTask(
            request,
            task.model,
            task.keyPath,
            task.implicitSlot,
            task.formatContext,
            request.abortableTasks,
            task.time,
            task.debugOwner,
            task.debugStack,
            task.debugTask
          ), value = request.ping, key.then(value, value), request.thenableState = getThenableStateAfterSuspending(), task.keyPath = prevKeyPath, task.implicitSlot = prevImplicitSlot, parent ? serializeLazyID(request.id) : serializeByValueID(request.id);
        task.keyPath = prevKeyPath;
        task.implicitSlot = prevImplicitSlot;
        request.pendingChunks++;
        prevKeyPath = request.nextChunkId++;
        prevImplicitSlot = logRecoverableError(request, key, task);
        emitErrorChunk(
          request,
          prevKeyPath,
          prevImplicitSlot,
          key,
          false,
          task.debugOwner
        );
        return parent ? serializeLazyID(prevKeyPath) : serializeByValueID(prevKeyPath);
      }
    }
    function renderModelDestructive(request, task, parent, parentPropertyName, value) {
      task.model = value;
      "__proto__" === parentPropertyName && callWithDebugContextInDEV(request, task, function() {
        console.error(
          "Expected not to serialize an object with own property `__proto__`. When parsed this property will be omitted.%s",
          describeObjectForErrorMessage(parent, parentPropertyName)
        );
      });
      if (value === REACT_ELEMENT_TYPE) return "$";
      if (null === value) return null;
      if ("object" === typeof value) {
        switch (value.$$typeof) {
          case REACT_ELEMENT_TYPE:
            var elementReference = null, _writtenObjects = request.writtenObjects;
            if (null === task.keyPath && !task.implicitSlot) {
              var _existingReference = _writtenObjects.get(value);
              if (void 0 !== _existingReference)
                if (modelRoot === value) modelRoot = null;
                else return _existingReference;
              else
                -1 === parentPropertyName.indexOf(":") && (_existingReference = _writtenObjects.get(parent), void 0 !== _existingReference && (elementReference = _existingReference + ":" + parentPropertyName, _writtenObjects.set(value, elementReference)));
            }
            if (serializedSize > MAX_ROW_SIZE) return deferTask(request, task);
            if (_existingReference = value._debugInfo)
              if (canEmitDebugInfo)
                forwardDebugInfo(request, task, _existingReference);
              else return outlineTask(request, task);
            _existingReference = value.props;
            var refProp = _existingReference.ref;
            refProp = void 0 !== refProp ? refProp : null;
            task.debugOwner = value._owner;
            task.debugStack = value._debugStack;
            task.debugTask = value._debugTask;
            if (void 0 === value._owner || void 0 === value._debugStack || void 0 === value._debugTask) {
              var key = "";
              null !== value.key && (key = ' key="' + value.key + '"');
              console.error(
                "Attempted to render <%s%s> without development properties. This is not supported. It can happen if:\n- The element is created with a production version of React but rendered in development.\n- The element was cloned with a custom function instead of `React.cloneElement`.\nThe props of this element may help locate this element: %o",
                value.type,
                key,
                value.props
              );
            }
            request = renderElement(
              request,
              task,
              value.type,
              value.key,
              refProp,
              _existingReference,
              value._store.validated
            );
            "object" === typeof request && null !== request && null !== elementReference && (_writtenObjects.has(request) || _writtenObjects.set(request, elementReference));
            return request;
          case REACT_LAZY_TYPE:
            if (serializedSize > MAX_ROW_SIZE) return deferTask(request, task);
            task.thenableState = null;
            elementReference = callLazyInitInDEV(value);
            if (request.status === ABORTING) throw null;
            if (_writtenObjects = value._debugInfo)
              if (canEmitDebugInfo)
                forwardDebugInfo(request, task, _writtenObjects);
              else return outlineTask(request, task);
            return renderModelDestructive(
              request,
              task,
              emptyRoot,
              "",
              elementReference
            );
          case REACT_LEGACY_ELEMENT_TYPE:
            throw Error(
              'A React Element from an older version of React was rendered. This is not supported. It can happen if:\n- Multiple copies of the "react" package is used.\n- A library pre-bundled an old copy of "react" or "react/jsx-runtime".\n- A compiler tries to "inline" JSX instead of using the runtime.'
            );
        }
        if (isClientReference2(value))
          return serializeClientReference(
            request,
            parent,
            parentPropertyName,
            value
          );
        if (void 0 !== request.temporaryReferences && (elementReference = request.temporaryReferences.get(value), void 0 !== elementReference))
          return "$T" + elementReference;
        elementReference = request.writtenObjects;
        _writtenObjects = elementReference.get(value);
        if ("function" === typeof value.then) {
          if (void 0 !== _writtenObjects) {
            if (null !== task.keyPath || task.implicitSlot)
              return "$@" + serializeThenable(request, task, value).toString(16);
            if (modelRoot === value) modelRoot = null;
            else return _writtenObjects;
          }
          request = "$@" + serializeThenable(request, task, value).toString(16);
          elementReference.set(value, request);
          return request;
        }
        if (void 0 !== _writtenObjects)
          if (modelRoot === value) {
            if (_writtenObjects !== serializeByValueID(task.id))
              return _writtenObjects;
            modelRoot = null;
          } else return _writtenObjects;
        else if (-1 === parentPropertyName.indexOf(":") && (_writtenObjects = elementReference.get(parent), void 0 !== _writtenObjects)) {
          _existingReference = parentPropertyName;
          if (isArrayImpl(parent) && parent[0] === REACT_ELEMENT_TYPE)
            switch (parentPropertyName) {
              case "1":
                _existingReference = "type";
                break;
              case "2":
                _existingReference = "key";
                break;
              case "3":
                _existingReference = "props";
                break;
              case "4":
                _existingReference = "_owner";
            }
          elementReference.set(
            value,
            _writtenObjects + ":" + _existingReference
          );
        }
        if (isArrayImpl(value)) return renderFragment(request, task, value);
        if (value instanceof Map) return serializeMap(request, value);
        if (value instanceof Set) return serializeSet(request, value);
        if ("function" === typeof FormData && value instanceof FormData)
          return serializeFormData(request, value);
        if (value instanceof Error) return serializeErrorValue(request, value);
        if (value instanceof ArrayBuffer)
          return serializeTypedArray(request, "A", new Uint8Array(value));
        if (value instanceof Int8Array)
          return serializeTypedArray(request, "O", value);
        if (value instanceof Uint8Array)
          return serializeTypedArray(request, "o", value);
        if (value instanceof Uint8ClampedArray)
          return serializeTypedArray(request, "U", value);
        if (value instanceof Int16Array)
          return serializeTypedArray(request, "S", value);
        if (value instanceof Uint16Array)
          return serializeTypedArray(request, "s", value);
        if (value instanceof Int32Array)
          return serializeTypedArray(request, "L", value);
        if (value instanceof Uint32Array)
          return serializeTypedArray(request, "l", value);
        if (value instanceof Float32Array)
          return serializeTypedArray(request, "G", value);
        if (value instanceof Float64Array)
          return serializeTypedArray(request, "g", value);
        if (value instanceof BigInt64Array)
          return serializeTypedArray(request, "M", value);
        if (value instanceof BigUint64Array)
          return serializeTypedArray(request, "m", value);
        if (value instanceof DataView)
          return serializeTypedArray(request, "V", value);
        if ("function" === typeof Blob && value instanceof Blob)
          return serializeBlob(request, value);
        if (elementReference = getIteratorFn(value))
          return elementReference = elementReference.call(value), elementReference === value ? "$i" + outlineModel(request, Array.from(elementReference)).toString(16) : renderFragment(request, task, Array.from(elementReference));
        if ("function" === typeof ReadableStream && value instanceof ReadableStream)
          return serializeReadableStream(request, task, value);
        elementReference = value[ASYNC_ITERATOR];
        if ("function" === typeof elementReference)
          return renderAsyncFragment(request, task, value, elementReference);
        if (value instanceof Date) return "$D" + value.toJSON();
        elementReference = getPrototypeOf(value);
        if (elementReference !== ObjectPrototype$1 && (null === elementReference || null !== getPrototypeOf(elementReference)))
          throw Error(
            "Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. Classes or null prototypes are not supported." + describeObjectForErrorMessage(parent, parentPropertyName)
          );
        if ("Object" !== objectName(value))
          callWithDebugContextInDEV(request, task, function() {
            console.error(
              "Only plain objects can be passed to Client Components from Server Components. %s objects are not supported.%s",
              objectName(value),
              describeObjectForErrorMessage(parent, parentPropertyName)
            );
          });
        else if (!isSimpleObject(value))
          callWithDebugContextInDEV(request, task, function() {
            console.error(
              "Only plain objects can be passed to Client Components from Server Components. Classes or other objects with methods are not supported.%s",
              describeObjectForErrorMessage(parent, parentPropertyName)
            );
          });
        else if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(value);
          0 < symbols.length && callWithDebugContextInDEV(request, task, function() {
            console.error(
              "Only plain objects can be passed to Client Components from Server Components. Objects with symbol properties like %s are not supported.%s",
              symbols[0].description,
              describeObjectForErrorMessage(parent, parentPropertyName)
            );
          });
        }
        return value;
      }
      if ("string" === typeof value)
        return serializedSize += value.length, "Z" === value[value.length - 1] && parent[parentPropertyName] instanceof Date ? "$D" + value : 1024 <= value.length && null !== byteLengthOfChunk ? serializeLargeTextString(request, value) : "$" === value[0] ? "$" + value : value;
      if ("boolean" === typeof value) return value;
      if ("number" === typeof value) return serializeNumber(value);
      if ("undefined" === typeof value) return "$undefined";
      if ("function" === typeof value) {
        if (isClientReference2(value))
          return serializeClientReference(
            request,
            parent,
            parentPropertyName,
            value
          );
        if (value.$$typeof === SERVER_REFERENCE_TAG)
          return serializeServerReference(request, value);
        if (void 0 !== request.temporaryReferences && (request = request.temporaryReferences.get(value), void 0 !== request))
          return "$T" + request;
        if (value.$$typeof === TEMPORARY_REFERENCE_TAG)
          throw Error(
            "Could not reference an opaque temporary reference. This is likely due to misconfiguring the temporaryReferences options on the server."
          );
        if (/^on[A-Z]/.test(parentPropertyName))
          throw Error(
            "Event handlers cannot be passed to Client Component props." + describeObjectForErrorMessage(parent, parentPropertyName) + "\nIf you need interactivity, consider converting part of this to a Client Component."
          );
        if (jsxChildrenParents.has(parent) || jsxPropsParents.has(parent) && "children" === parentPropertyName)
          throw request = value.displayName || value.name || "Component", Error(
            "Functions are not valid as a child of Client Components. This may happen if you return " + request + " instead of <" + request + " /> from render. Or maybe you meant to call this function rather than return it." + describeObjectForErrorMessage(parent, parentPropertyName)
          );
        throw Error(
          'Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server". Or maybe you meant to call this function rather than return it.' + describeObjectForErrorMessage(parent, parentPropertyName)
        );
      }
      if ("symbol" === typeof value) {
        task = request.writtenSymbols;
        elementReference = task.get(value);
        if (void 0 !== elementReference)
          return serializeByValueID(elementReference);
        elementReference = value.description;
        if (Symbol.for(elementReference) !== value)
          throw Error(
            "Only global symbols received from Symbol.for(...) can be passed to Client Components. The symbol Symbol.for(" + (value.description + ") cannot be found among global symbols.") + describeObjectForErrorMessage(parent, parentPropertyName)
          );
        request.pendingChunks++;
        _writtenObjects = request.nextChunkId++;
        emitSymbolChunk(request, _writtenObjects, elementReference);
        task.set(value, _writtenObjects);
        return serializeByValueID(_writtenObjects);
      }
      if ("bigint" === typeof value) return "$n" + value.toString(10);
      throw Error(
        "Type " + typeof value + " is not supported in Client Component props." + describeObjectForErrorMessage(parent, parentPropertyName)
      );
    }
    function logRecoverableError(request, error, task) {
      var prevRequest = currentRequest;
      currentRequest = null;
      try {
        var onError = request.onError;
        var errorDigest = null !== task ? supportsRequestStorage ? requestStorage.run(
          void 0,
          callWithDebugContextInDEV,
          request,
          task,
          onError,
          error
        ) : callWithDebugContextInDEV(request, task, onError, error) : supportsRequestStorage ? requestStorage.run(void 0, onError, error) : onError(error);
      } finally {
        currentRequest = prevRequest;
      }
      if (null != errorDigest && "string" !== typeof errorDigest)
        throw Error(
          'onError returned something with a type other than "string". onError should return a string and may return null or undefined but must not return anything else. It received something of type "' + typeof errorDigest + '" instead'
        );
      return errorDigest || "";
    }
    function fatalError(request, error) {
      var onFatalError = request.onFatalError;
      onFatalError(error);
      null !== request.destination ? (request.status = CLOSED, closeWithError(request.destination, error)) : (request.status = 13, request.fatalError = error);
      request.cacheController.abort(
        Error("The render was aborted due to a fatal error.", { cause: error })
      );
    }
    function serializeErrorValue(request, error) {
      var name = "Error", env = (0, request.environmentName)();
      try {
        name = error.name;
        var message = String(error.message);
        var stack = filterStackTrace(request, parseStackTrace(error, 0));
        var errorEnv = error.environmentName;
        "string" === typeof errorEnv && (env = errorEnv);
      } catch (x) {
        message = "An error occurred but serializing the error message failed.", stack = [];
      }
      return "$Z" + outlineModel(request, {
        name,
        message,
        stack,
        env
      }).toString(16);
    }
    function emitErrorChunk(request, id, digest, error, debug, owner) {
      var name = "Error", env = (0, request.environmentName)();
      try {
        if (error instanceof Error) {
          name = error.name;
          var message = String(error.message);
          var stack = filterStackTrace(request, parseStackTrace(error, 0));
          var errorEnv = error.environmentName;
          "string" === typeof errorEnv && (env = errorEnv);
        } else
          message = "object" === typeof error && null !== error ? describeObjectForErrorMessage(error) : String(error), stack = [];
      } catch (x) {
        message = "An error occurred but serializing the error message failed.", stack = [];
      }
      error = null == owner ? null : outlineComponentInfo(request, owner);
      digest = {
        digest,
        name,
        message,
        stack,
        env,
        owner: error
      };
      id = id.toString(16) + ":E" + stringify(digest) + "\n";
      id = stringToChunk(id);
      debug ? request.completedDebugChunks.push(id) : request.completedErrorChunks.push(id);
    }
    function emitImportChunk(request, id, clientReferenceMetadata, debug) {
      clientReferenceMetadata = stringify(clientReferenceMetadata);
      id = id.toString(16) + ":I" + clientReferenceMetadata + "\n";
      id = stringToChunk(id);
      debug ? request.completedDebugChunks.push(id) : request.completedImportChunks.push(id);
    }
    function emitSymbolChunk(request, id, name) {
      id = encodeReferenceChunk(request, id, "$S" + name);
      request.completedImportChunks.push(id);
    }
    function emitModelChunk(request, id, json) {
      id = id.toString(16) + ":" + json + "\n";
      id = stringToChunk(id);
      request.completedRegularChunks.push(id);
    }
    function emitDebugHaltChunk(request, id) {
      id = id.toString(16) + ":\n";
      id = stringToChunk(id);
      request.completedDebugChunks.push(id);
    }
    function emitDebugChunk(request, id, debugInfo) {
      var json = serializeDebugModel(request, 500, debugInfo);
      null !== request.debugDestination ? (debugInfo = request.nextChunkId++, json = debugInfo.toString(16) + ":" + json + "\n", request.pendingDebugChunks++, request.completedDebugChunks.push(stringToChunk(json)), id = id.toString(16) + ':D"$' + debugInfo.toString(16) + '"\n', request.completedRegularChunks.push(stringToChunk(id))) : (id = id.toString(16) + ":D" + json + "\n", request.completedRegularChunks.push(stringToChunk(id)));
    }
    function outlineComponentInfo(request, componentInfo) {
      var existingRef = request.writtenDebugObjects.get(componentInfo);
      if (void 0 !== existingRef) return existingRef;
      null != componentInfo.owner && outlineComponentInfo(request, componentInfo.owner);
      existingRef = 10;
      null != componentInfo.stack && (existingRef += componentInfo.stack.length);
      existingRef = { objectLimit: existingRef };
      var componentDebugInfo = {
        name: componentInfo.name,
        key: componentInfo.key
      };
      null != componentInfo.env && (componentDebugInfo.env = componentInfo.env);
      null != componentInfo.owner && (componentDebugInfo.owner = componentInfo.owner);
      null == componentInfo.stack && null != componentInfo.debugStack ? componentDebugInfo.stack = filterStackTrace(
        request,
        parseStackTrace(componentInfo.debugStack, 1)
      ) : null != componentInfo.stack && (componentDebugInfo.stack = componentInfo.stack);
      componentDebugInfo.props = componentInfo.props;
      existingRef = outlineDebugModel(request, existingRef, componentDebugInfo);
      existingRef = serializeByValueID(existingRef);
      request.writtenDebugObjects.set(componentInfo, existingRef);
      request.writtenObjects.set(componentInfo, existingRef);
      return existingRef;
    }
    function emitTypedArrayChunk(request, id, tag, typedArray, debug) {
      debug ? request.pendingDebugChunks++ : request.pendingChunks++;
      var buffer = new Uint8Array(
        typedArray.buffer,
        typedArray.byteOffset,
        typedArray.byteLength
      );
      typedArray = 2048 < typedArray.byteLength ? buffer.slice() : buffer;
      buffer = typedArray.byteLength;
      id = id.toString(16) + ":" + tag + buffer.toString(16) + ",";
      id = stringToChunk(id);
      debug ? request.completedDebugChunks.push(id, typedArray) : request.completedRegularChunks.push(id, typedArray);
    }
    function emitTextChunk(request, id, text, debug) {
      if (null === byteLengthOfChunk)
        throw Error(
          "Existence of byteLengthOfChunk should have already been checked. This is a bug in React."
        );
      debug ? request.pendingDebugChunks++ : request.pendingChunks++;
      text = stringToChunk(text);
      var binaryLength = text.byteLength;
      id = id.toString(16) + ":T" + binaryLength.toString(16) + ",";
      id = stringToChunk(id);
      debug ? request.completedDebugChunks.push(id, text) : request.completedRegularChunks.push(id, text);
    }
    function renderDebugModel(request, counter, parent, parentPropertyName, value) {
      if (null === value) return null;
      if (value === REACT_ELEMENT_TYPE) return "$";
      if ("object" === typeof value) {
        if (isClientReference2(value))
          return serializeDebugClientReference(
            request,
            parent,
            parentPropertyName,
            value
          );
        if (value.$$typeof === CONSTRUCTOR_MARKER) {
          value = value.constructor;
          var ref = request.writtenDebugObjects.get(value);
          void 0 === ref && (request = outlineDebugModel(request, counter, value), ref = serializeByValueID(request));
          return "$P" + ref.slice(1);
        }
        if (void 0 !== request.temporaryReferences) {
          var tempRef = request.temporaryReferences.get(value);
          if (void 0 !== tempRef) return "$T" + tempRef;
        }
        tempRef = request.writtenDebugObjects;
        var existingDebugReference = tempRef.get(value);
        if (void 0 !== existingDebugReference)
          if (debugModelRoot === value) debugModelRoot = null;
          else return existingDebugReference;
        else if (-1 === parentPropertyName.indexOf(":")) {
          if (existingDebugReference = tempRef.get(parent), void 0 !== existingDebugReference) {
            if (0 >= counter.objectLimit && !doNotLimit.has(value))
              return serializeDeferredObject(request, value);
            var propertyName = parentPropertyName;
            if (isArrayImpl(parent) && parent[0] === REACT_ELEMENT_TYPE)
              switch (parentPropertyName) {
                case "1":
                  propertyName = "type";
                  break;
                case "2":
                  propertyName = "key";
                  break;
                case "3":
                  propertyName = "props";
                  break;
                case "4":
                  propertyName = "_owner";
              }
            tempRef.set(value, existingDebugReference + ":" + propertyName);
          } else if (debugNoOutline !== value) {
            if ("function" === typeof value.then)
              return serializeDebugThenable(request, counter, value);
            request = outlineDebugModel(request, counter, value);
            return serializeByValueID(request);
          }
        }
        parent = request.writtenObjects.get(value);
        if (void 0 !== parent) return parent;
        if (0 >= counter.objectLimit && !doNotLimit.has(value))
          return serializeDeferredObject(request, value);
        counter.objectLimit--;
        parent = request.deferredDebugObjects;
        if (null !== parent && (parentPropertyName = parent.existing.get(value), void 0 !== parentPropertyName))
          return parent.existing.delete(value), parent.retained.delete(parentPropertyName), emitOutlinedDebugModelChunk(
            request,
            parentPropertyName,
            counter,
            value
          ), serializeByValueID(parentPropertyName);
        switch (value.$$typeof) {
          case REACT_ELEMENT_TYPE:
            null != value._owner && outlineComponentInfo(request, value._owner);
            "object" === typeof value.type && null !== value.type && doNotLimit.add(value.type);
            "object" === typeof value.key && null !== value.key && doNotLimit.add(value.key);
            doNotLimit.add(value.props);
            null !== value._owner && doNotLimit.add(value._owner);
            counter = null;
            if (null != value._debugStack)
              for (counter = filterStackTrace(
                request,
                parseStackTrace(value._debugStack, 1)
              ), doNotLimit.add(counter), request = 0; request < counter.length; request++)
                doNotLimit.add(counter[request]);
            return [
              REACT_ELEMENT_TYPE,
              value.type,
              value.key,
              value.props,
              value._owner,
              counter,
              value._store.validated
            ];
          case REACT_LAZY_TYPE:
            value = value._payload;
            if (null !== value && "object" === typeof value) {
              switch (value._status) {
                case 1:
                  return request = outlineDebugModel(
                    request,
                    counter,
                    value._result
                  ), serializeLazyID(request);
                case 2:
                  return counter = request.nextChunkId++, emitErrorChunk(
                    request,
                    counter,
                    "",
                    value._result,
                    true,
                    null
                  ), serializeLazyID(counter);
              }
              switch (value.status) {
                case "fulfilled":
                  return request = outlineDebugModel(
                    request,
                    counter,
                    value.value
                  ), serializeLazyID(request);
                case "rejected":
                  return counter = request.nextChunkId++, emitErrorChunk(
                    request,
                    counter,
                    "",
                    value.reason,
                    true,
                    null
                  ), serializeLazyID(counter);
              }
            }
            request.pendingDebugChunks++;
            value = request.nextChunkId++;
            emitDebugHaltChunk(request, value);
            return serializeLazyID(value);
        }
        if ("function" === typeof value.then)
          return serializeDebugThenable(request, counter, value);
        if (isArrayImpl(value)) return value;
        if (value instanceof Map) {
          value = Array.from(value);
          counter.objectLimit++;
          for (ref = 0; ref < value.length; ref++) {
            var entry = value[ref];
            doNotLimit.add(entry);
            var key = entry[0];
            entry = entry[1];
            "object" === typeof key && null !== key && doNotLimit.add(key);
            "object" === typeof entry && null !== entry && doNotLimit.add(entry);
          }
          return "$Q" + outlineDebugModel(request, counter, value).toString(16);
        }
        if (value instanceof Set) {
          value = Array.from(value);
          counter.objectLimit++;
          for (ref = 0; ref < value.length; ref++)
            key = value[ref], "object" === typeof key && null !== key && doNotLimit.add(key);
          return "$W" + outlineDebugModel(request, counter, value).toString(16);
        }
        if ("function" === typeof FormData && value instanceof FormData)
          return value = Array.from(value.entries()), "$K" + outlineDebugModel(
            request,
            { objectLimit: 2 * value.length + 1 },
            value
          ).toString(16);
        if (value instanceof Error) {
          counter = "Error";
          var env = (0, request.environmentName)();
          try {
            counter = value.name, ref = String(value.message), key = filterStackTrace(request, parseStackTrace(value, 0)), entry = value.environmentName, "string" === typeof entry && (env = entry);
          } catch (x) {
            ref = "An error occurred but serializing the error message failed.", key = [];
          }
          request = "$Z" + outlineDebugModel(
            request,
            { objectLimit: 2 * key.length + 1 },
            { name: counter, message: ref, stack: key, env }
          ).toString(16);
          return request;
        }
        if (value instanceof ArrayBuffer)
          return serializeDebugTypedArray(request, "A", new Uint8Array(value));
        if (value instanceof Int8Array)
          return serializeDebugTypedArray(request, "O", value);
        if (value instanceof Uint8Array)
          return serializeDebugTypedArray(request, "o", value);
        if (value instanceof Uint8ClampedArray)
          return serializeDebugTypedArray(request, "U", value);
        if (value instanceof Int16Array)
          return serializeDebugTypedArray(request, "S", value);
        if (value instanceof Uint16Array)
          return serializeDebugTypedArray(request, "s", value);
        if (value instanceof Int32Array)
          return serializeDebugTypedArray(request, "L", value);
        if (value instanceof Uint32Array)
          return serializeDebugTypedArray(request, "l", value);
        if (value instanceof Float32Array)
          return serializeDebugTypedArray(request, "G", value);
        if (value instanceof Float64Array)
          return serializeDebugTypedArray(request, "g", value);
        if (value instanceof BigInt64Array)
          return serializeDebugTypedArray(request, "M", value);
        if (value instanceof BigUint64Array)
          return serializeDebugTypedArray(request, "m", value);
        if (value instanceof DataView)
          return serializeDebugTypedArray(request, "V", value);
        if ("function" === typeof Blob && value instanceof Blob)
          return serializeDebugBlob(request, value);
        if (getIteratorFn(value)) return Array.from(value);
        request = getPrototypeOf(value);
        if (request !== ObjectPrototype$1 && null !== request) {
          counter = /* @__PURE__ */ Object.create(null);
          for (env in value)
            if (hasOwnProperty.call(value, env) || isGetter(request, env))
              counter[env] = value[env];
          ref = request.constructor;
          "function" !== typeof ref || ref.prototype !== request || hasOwnProperty.call(value, "") || isGetter(request, "") || (counter[""] = { $$typeof: CONSTRUCTOR_MARKER, constructor: ref });
          return counter;
        }
        return value;
      }
      if ("string" === typeof value) {
        if ("Z" === value[value.length - 1] && parent[parentPropertyName] instanceof Date)
          return "$D" + value;
        if (1024 <= value.length) {
          if (0 >= counter.objectLimit)
            return serializeDeferredObject(request, value);
          counter.objectLimit--;
          request.pendingDebugChunks++;
          counter = request.nextChunkId++;
          emitTextChunk(request, counter, value, true);
          return serializeByValueID(counter);
        }
        return "$" === value[0] ? "$" + value : value;
      }
      if ("boolean" === typeof value) return value;
      if ("number" === typeof value) return serializeNumber(value);
      if ("undefined" === typeof value) return "$undefined";
      if ("function" === typeof value) {
        if (isClientReference2(value))
          return serializeDebugClientReference(
            request,
            parent,
            parentPropertyName,
            value
          );
        if (void 0 !== request.temporaryReferences && (counter = request.temporaryReferences.get(value), void 0 !== counter))
          return "$T" + counter;
        counter = request.writtenDebugObjects;
        ref = counter.get(value);
        if (void 0 !== ref) return ref;
        ref = Function.prototype.toString.call(value);
        key = value.name;
        key = "$E" + ("string" === typeof key ? "Object.defineProperty(" + ref + ',"name",{value:' + JSON.stringify(key) + "})" : "(" + ref + ")");
        request.pendingDebugChunks++;
        ref = request.nextChunkId++;
        key = encodeReferenceChunk(request, ref, key);
        request.completedDebugChunks.push(key);
        request = serializeByValueID(ref);
        counter.set(value, request);
        return request;
      }
      if ("symbol" === typeof value) {
        counter = request.writtenSymbols.get(value);
        if (void 0 !== counter) return serializeByValueID(counter);
        value = value.description;
        request.pendingChunks++;
        counter = request.nextChunkId++;
        emitSymbolChunk(request, counter, value);
        return serializeByValueID(counter);
      }
      return "bigint" === typeof value ? "$n" + value.toString(10) : value instanceof Date ? "$D" + value.toJSON() : "unknown type " + typeof value;
    }
    function serializeDebugModel(request, objectLimit, model) {
      function replacer(parentPropertyName, value) {
        try {
          return renderDebugModel(
            request,
            counter,
            this,
            parentPropertyName,
            value
          );
        } catch (x) {
          return "Unknown Value: React could not send it from the server.\n" + x.message;
        }
      }
      var counter = { objectLimit };
      objectLimit = debugNoOutline;
      debugNoOutline = model;
      try {
        return stringify(model, replacer);
      } catch (x) {
        return stringify(
          "Unknown Value: React could not send it from the server.\n" + x.message
        );
      } finally {
        debugNoOutline = objectLimit;
      }
    }
    function emitOutlinedDebugModelChunk(request, id, counter, model) {
      function replacer(parentPropertyName, value) {
        try {
          return renderDebugModel(
            request,
            counter,
            this,
            parentPropertyName,
            value
          );
        } catch (x) {
          return "Unknown Value: React could not send it from the server.\n" + x.message;
        }
      }
      "object" === typeof model && null !== model && doNotLimit.add(model);
      var prevModelRoot = debugModelRoot;
      debugModelRoot = model;
      "object" === typeof model && null !== model && request.writtenDebugObjects.set(model, serializeByValueID(id));
      try {
        var json = stringify(model, replacer);
      } catch (x) {
        json = stringify(
          "Unknown Value: React could not send it from the server.\n" + x.message
        );
      } finally {
        debugModelRoot = prevModelRoot;
      }
      id = id.toString(16) + ":" + json + "\n";
      id = stringToChunk(id);
      request.completedDebugChunks.push(id);
    }
    function outlineDebugModel(request, counter, model) {
      var id = request.nextChunkId++;
      request.pendingDebugChunks++;
      emitOutlinedDebugModelChunk(request, id, counter, model);
      return id;
    }
    function emitTimeOriginChunk(request, timeOrigin) {
      request.pendingDebugChunks++;
      timeOrigin = stringToChunk(":N" + timeOrigin + "\n");
      request.completedDebugChunks.push(timeOrigin);
    }
    function forwardDebugInfo(request$jscomp$1, task, debugInfo) {
      for (var id = task.id, i = 0; i < debugInfo.length; i++) {
        var info = debugInfo[i];
        if ("number" === typeof info.time)
          markOperationEndTime(request$jscomp$1, task, info.time);
        else if ("string" === typeof info.name)
          outlineComponentInfo(request$jscomp$1, info), request$jscomp$1.pendingChunks++, emitDebugChunk(request$jscomp$1, id, info);
        else if (info.awaited) {
          var ioInfo = info.awaited;
          if (!(ioInfo.end <= request$jscomp$1.timeOrigin)) {
            var request = request$jscomp$1, ioInfo$jscomp$0 = ioInfo;
            if (!request.writtenObjects.has(ioInfo$jscomp$0)) {
              request.pendingDebugChunks++;
              var id$jscomp$0 = request.nextChunkId++, owner = ioInfo$jscomp$0.owner;
              null != owner && outlineComponentInfo(request, owner);
              var debugStack = null == ioInfo$jscomp$0.stack && null != ioInfo$jscomp$0.debugStack ? filterStackTrace(
                request,
                parseStackTrace(ioInfo$jscomp$0.debugStack, 1)
              ) : ioInfo$jscomp$0.stack;
              var request$jscomp$0 = request, id$jscomp$1 = id$jscomp$0, value = ioInfo$jscomp$0.value, env = ioInfo$jscomp$0.env, objectLimit = 10;
              debugStack && (objectLimit += debugStack.length);
              var debugIOInfo = {
                name: ioInfo$jscomp$0.name,
                start: ioInfo$jscomp$0.start - request$jscomp$0.timeOrigin,
                end: ioInfo$jscomp$0.end - request$jscomp$0.timeOrigin
              };
              null != env && (debugIOInfo.env = env);
              null != debugStack && (debugIOInfo.stack = debugStack);
              null != owner && (debugIOInfo.owner = owner);
              void 0 !== value && (debugIOInfo.value = value);
              value = serializeDebugModel(
                request$jscomp$0,
                objectLimit,
                debugIOInfo
              );
              id$jscomp$1 = id$jscomp$1.toString(16) + ":J" + value + "\n";
              id$jscomp$1 = stringToChunk(id$jscomp$1);
              request$jscomp$0.completedDebugChunks.push(id$jscomp$1);
              request.writtenDebugObjects.set(
                ioInfo$jscomp$0,
                serializeByValueID(id$jscomp$0)
              );
            }
            null != info.owner && outlineComponentInfo(request$jscomp$1, info.owner);
            request = null == info.stack && null != info.debugStack ? filterStackTrace(
              request$jscomp$1,
              parseStackTrace(info.debugStack, 1)
            ) : info.stack;
            ioInfo = { awaited: ioInfo };
            null != info.env && (ioInfo.env = info.env);
            null != info.owner && (ioInfo.owner = info.owner);
            null != request && (ioInfo.stack = request);
            request$jscomp$1.pendingChunks++;
            emitDebugChunk(request$jscomp$1, id, ioInfo);
          }
        } else
          request$jscomp$1.pendingChunks++, emitDebugChunk(request$jscomp$1, id, info);
      }
    }
    function forwardDebugInfoFromThenable(request, task, thenable) {
      (thenable = thenable._debugInfo) && forwardDebugInfo(request, task, thenable);
    }
    function forwardDebugInfoFromCurrentContext(request, task, thenable) {
      (thenable = thenable._debugInfo) && forwardDebugInfo(request, task, thenable);
    }
    function forwardDebugInfoFromAbortedTask(request, task) {
      var model = task.model;
      "object" === typeof model && null !== model && (model = model._debugInfo) && forwardDebugInfo(request, task, model);
    }
    function emitTimingChunk(request, id, timestamp) {
      request.pendingChunks++;
      var json = '{"time":' + (timestamp - request.timeOrigin) + "}";
      null !== request.debugDestination ? (timestamp = request.nextChunkId++, json = timestamp.toString(16) + ":" + json + "\n", request.pendingDebugChunks++, request.completedDebugChunks.push(stringToChunk(json)), id = id.toString(16) + ':D"$' + timestamp.toString(16) + '"\n', request.completedRegularChunks.push(stringToChunk(id))) : (id = id.toString(16) + ":D" + json + "\n", request.completedRegularChunks.push(stringToChunk(id)));
    }
    function markOperationEndTime(request, task, timestamp) {
      request.status === ABORTING && timestamp > request.abortTime || (timestamp > task.time ? (emitTimingChunk(request, task.id, timestamp), task.time = timestamp) : emitTimingChunk(request, task.id, task.time));
    }
    function emitChunk(request, task, value) {
      var id = task.id;
      "string" === typeof value && null !== byteLengthOfChunk ? emitTextChunk(request, id, value, false) : value instanceof ArrayBuffer ? emitTypedArrayChunk(request, id, "A", new Uint8Array(value), false) : value instanceof Int8Array ? emitTypedArrayChunk(request, id, "O", value, false) : value instanceof Uint8Array ? emitTypedArrayChunk(request, id, "o", value, false) : value instanceof Uint8ClampedArray ? emitTypedArrayChunk(request, id, "U", value, false) : value instanceof Int16Array ? emitTypedArrayChunk(request, id, "S", value, false) : value instanceof Uint16Array ? emitTypedArrayChunk(request, id, "s", value, false) : value instanceof Int32Array ? emitTypedArrayChunk(request, id, "L", value, false) : value instanceof Uint32Array ? emitTypedArrayChunk(request, id, "l", value, false) : value instanceof Float32Array ? emitTypedArrayChunk(request, id, "G", value, false) : value instanceof Float64Array ? emitTypedArrayChunk(request, id, "g", value, false) : value instanceof BigInt64Array ? emitTypedArrayChunk(request, id, "M", value, false) : value instanceof BigUint64Array ? emitTypedArrayChunk(
        request,
        id,
        "m",
        value,
        false
      ) : value instanceof DataView ? emitTypedArrayChunk(
        request,
        id,
        "V",
        value,
        false
      ) : (value = stringify(value, task.toJSON), emitModelChunk(request, task.id, value));
    }
    function erroredTask(request, task, error) {
      task.timed && markOperationEndTime(request, task, performance.now());
      task.status = 4;
      var digest = logRecoverableError(request, error, task);
      emitErrorChunk(request, task.id, digest, error, false, task.debugOwner);
      request.abortableTasks.delete(task);
      callOnAllReadyIfReady(request);
    }
    function retryTask(request, task) {
      if (0 === task.status) {
        var prevCanEmitDebugInfo = canEmitDebugInfo;
        task.status = 5;
        var parentSerializedSize = serializedSize;
        try {
          modelRoot = task.model;
          canEmitDebugInfo = true;
          var resolvedModel = renderModelDestructive(
            request,
            task,
            emptyRoot,
            "",
            task.model
          );
          canEmitDebugInfo = false;
          modelRoot = resolvedModel;
          task.keyPath = null;
          task.implicitSlot = false;
          var currentEnv = (0, request.environmentName)();
          currentEnv !== task.environmentName && (request.pendingChunks++, emitDebugChunk(request, task.id, { env: currentEnv }));
          task.timed && markOperationEndTime(request, task, performance.now());
          if ("object" === typeof resolvedModel && null !== resolvedModel)
            request.writtenObjects.set(
              resolvedModel,
              serializeByValueID(task.id)
            ), emitChunk(request, task, resolvedModel);
          else {
            var json = stringify(resolvedModel);
            emitModelChunk(request, task.id, json);
          }
          task.status = 1;
          request.abortableTasks.delete(task);
          callOnAllReadyIfReady(request);
        } catch (thrownValue) {
          if (request.status === ABORTING)
            if (request.abortableTasks.delete(task), task.status = 0, 21 === request.type)
              haltTask(task), finishHaltedTask(task, request);
            else {
              var errorId = request.fatalError;
              abortTask(task);
              finishAbortedTask(task, request, errorId);
            }
          else {
            var x = thrownValue === SuspenseException ? getSuspendedThenable() : thrownValue;
            if ("object" === typeof x && null !== x && "function" === typeof x.then) {
              task.status = 0;
              task.thenableState = getThenableStateAfterSuspending();
              var ping = task.ping;
              x.then(ping, ping);
            } else erroredTask(request, task, x);
          }
        } finally {
          canEmitDebugInfo = prevCanEmitDebugInfo, serializedSize = parentSerializedSize;
        }
      }
    }
    function tryStreamTask(request, task) {
      var prevCanEmitDebugInfo = canEmitDebugInfo;
      canEmitDebugInfo = false;
      var parentSerializedSize = serializedSize;
      try {
        emitChunk(request, task, task.model);
      } finally {
        serializedSize = parentSerializedSize, canEmitDebugInfo = prevCanEmitDebugInfo;
      }
    }
    function performWork(request) {
      var prevDispatcher = ReactSharedInternalsServer.H;
      ReactSharedInternalsServer.H = HooksDispatcher;
      var prevRequest = currentRequest;
      currentRequest$1 = currentRequest = request;
      try {
        var pingedTasks = request.pingedTasks;
        request.pingedTasks = [];
        for (var i = 0; i < pingedTasks.length; i++)
          retryTask(request, pingedTasks[i]);
        flushCompletedChunks(request);
      } catch (error) {
        logRecoverableError(request, error, null), fatalError(request, error);
      } finally {
        ReactSharedInternalsServer.H = prevDispatcher, currentRequest$1 = null, currentRequest = prevRequest;
      }
    }
    function abortTask(task) {
      0 === task.status && (task.status = 3);
    }
    function finishAbortedTask(task, request, errorId) {
      3 === task.status && (forwardDebugInfoFromAbortedTask(request, task), task.timed && markOperationEndTime(request, task, request.abortTime), errorId = serializeByValueID(errorId), task = encodeReferenceChunk(request, task.id, errorId), request.completedErrorChunks.push(task));
    }
    function haltTask(task) {
      0 === task.status && (task.status = 3);
    }
    function finishHaltedTask(task, request) {
      3 === task.status && (forwardDebugInfoFromAbortedTask(request, task), request.pendingChunks--);
    }
    function flushCompletedChunks(request) {
      if (null !== request.debugDestination) {
        var debugDestination = request.debugDestination;
        currentView = new Uint8Array(2048);
        writtenBytes = 0;
        try {
          for (var debugChunks = request.completedDebugChunks, i = 0; i < debugChunks.length; i++)
            request.pendingDebugChunks--, writeChunkAndReturn(debugDestination, debugChunks[i]);
          debugChunks.splice(0, i);
        } finally {
          completeWriting(debugDestination);
        }
      }
      debugDestination = request.destination;
      if (null !== debugDestination) {
        currentView = new Uint8Array(2048);
        writtenBytes = 0;
        try {
          var importsChunks = request.completedImportChunks;
          for (debugChunks = 0; debugChunks < importsChunks.length; debugChunks++)
            if (request.pendingChunks--, !writeChunkAndReturn(
              debugDestination,
              importsChunks[debugChunks]
            )) ;
          importsChunks.splice(0, debugChunks);
          var hintChunks = request.completedHintChunks;
          for (debugChunks = 0; debugChunks < hintChunks.length; debugChunks++)
            if (!writeChunkAndReturn(debugDestination, hintChunks[debugChunks])) ;
          hintChunks.splice(0, debugChunks);
          if (null === request.debugDestination) {
            var _debugChunks = request.completedDebugChunks;
            for (debugChunks = 0; debugChunks < _debugChunks.length; debugChunks++)
              if (request.pendingDebugChunks--, !writeChunkAndReturn(
                debugDestination,
                _debugChunks[debugChunks]
              )) ;
            _debugChunks.splice(0, debugChunks);
          }
          var regularChunks = request.completedRegularChunks;
          for (debugChunks = 0; debugChunks < regularChunks.length; debugChunks++)
            if (request.pendingChunks--, !writeChunkAndReturn(
              debugDestination,
              regularChunks[debugChunks]
            )) ;
          regularChunks.splice(0, debugChunks);
          var errorChunks = request.completedErrorChunks;
          for (debugChunks = 0; debugChunks < errorChunks.length; debugChunks++)
            if (request.pendingChunks--, !writeChunkAndReturn(debugDestination, errorChunks[debugChunks])) ;
          errorChunks.splice(0, debugChunks);
        } finally {
          request.flushScheduled = false, completeWriting(debugDestination);
        }
      }
      0 === request.pendingChunks && (importsChunks = request.debugDestination, 0 === request.pendingDebugChunks ? (null !== importsChunks && (importsChunks.close(), request.debugDestination = null), request.status < ABORTING && request.cacheController.abort(
        Error(
          "This render completed successfully. All cacheSignals are now aborted to allow clean up of any unused resources."
        )
      ), null !== request.destination && (request.status = CLOSED, request.destination.close(), request.destination = null), null !== request.debugDestination && (request.debugDestination.close(), request.debugDestination = null)) : null !== importsChunks && null !== request.destination && (request.status = CLOSED, request.destination.close(), request.destination = null));
    }
    function startWork(request) {
      request.flushScheduled = null !== request.destination;
      supportsRequestStorage ? scheduleMicrotask(function() {
        requestStorage.run(request, performWork, request);
      }) : scheduleMicrotask(function() {
        return performWork(request);
      });
      setTimeout(function() {
        10 === request.status && (request.status = 11);
      }, 0);
    }
    function enqueueFlush(request) {
      false !== request.flushScheduled || 0 !== request.pingedTasks.length || null === request.destination && null === request.debugDestination || (request.flushScheduled = true, setTimeout(function() {
        request.flushScheduled = false;
        flushCompletedChunks(request);
      }, 0));
    }
    function callOnAllReadyIfReady(request) {
      0 === request.abortableTasks.size && (request = request.onAllReady, request());
    }
    function startFlowing(request, destination) {
      if (13 === request.status)
        request.status = CLOSED, closeWithError(destination, request.fatalError);
      else if (request.status !== CLOSED && null === request.destination) {
        request.destination = destination;
        try {
          flushCompletedChunks(request);
        } catch (error) {
          logRecoverableError(request, error, null), fatalError(request, error);
        }
      }
    }
    function finishHalt(request, abortedTasks) {
      try {
        abortedTasks.forEach(function(task) {
          return finishHaltedTask(task, request);
        });
        var onAllReady = request.onAllReady;
        onAllReady();
        flushCompletedChunks(request);
      } catch (error) {
        logRecoverableError(request, error, null), fatalError(request, error);
      }
    }
    function finishAbort(request, abortedTasks, errorId) {
      try {
        abortedTasks.forEach(function(task) {
          return finishAbortedTask(task, request, errorId);
        });
        var onAllReady = request.onAllReady;
        onAllReady();
        flushCompletedChunks(request);
      } catch (error) {
        logRecoverableError(request, error, null), fatalError(request, error);
      }
    }
    function abort(request, reason) {
      if (!(11 < request.status))
        try {
          request.status = ABORTING;
          request.abortTime = performance.now();
          request.cacheController.abort(reason);
          var abortableTasks = request.abortableTasks;
          if (0 < abortableTasks.size)
            if (21 === request.type)
              abortableTasks.forEach(function(task) {
                return haltTask(task, request);
              }), setTimeout(function() {
                return finishHalt(request, abortableTasks);
              }, 0);
            else {
              var error = void 0 === reason ? Error(
                "The render was aborted by the server without a reason."
              ) : "object" === typeof reason && null !== reason && "function" === typeof reason.then ? Error(
                "The render was aborted by the server with a promise."
              ) : reason, digest = logRecoverableError(request, error, null), _errorId2 = request.nextChunkId++;
              request.fatalError = _errorId2;
              request.pendingChunks++;
              emitErrorChunk(request, _errorId2, digest, error, false, null);
              abortableTasks.forEach(function(task) {
                return abortTask(task, request, _errorId2);
              });
              setTimeout(function() {
                return finishAbort(request, abortableTasks, _errorId2);
              }, 0);
            }
          else {
            var onAllReady = request.onAllReady;
            onAllReady();
            flushCompletedChunks(request);
          }
        } catch (error$2) {
          logRecoverableError(request, error$2, null), fatalError(request, error$2);
        }
    }
    function fromHex(str) {
      return parseInt(str, 16);
    }
    function closeDebugChannel(request) {
      var deferredDebugObjects = request.deferredDebugObjects;
      if (null === deferredDebugObjects)
        throw Error(
          "resolveDebugMessage/closeDebugChannel should not be called for a Request that wasn't kept alive. This is a bug in React."
        );
      deferredDebugObjects.retained.forEach(function(value, id) {
        request.pendingDebugChunks--;
        deferredDebugObjects.retained.delete(id);
        deferredDebugObjects.existing.delete(value);
      });
      enqueueFlush(request);
    }
    function resolveServerReference(bundlerConfig, id) {
      var name = "", resolvedModuleData = bundlerConfig[id];
      if (resolvedModuleData) name = resolvedModuleData.name;
      else {
        var idx = id.lastIndexOf("#");
        -1 !== idx && (name = id.slice(idx + 1), resolvedModuleData = bundlerConfig[id.slice(0, idx)]);
        if (!resolvedModuleData)
          throw Error(
            'Could not find the module "' + id + '" in the React Server Manifest. This is probably a bug in the React Server Components bundler.'
          );
      }
      return resolvedModuleData.async ? [resolvedModuleData.id, resolvedModuleData.chunks, name, 1] : [resolvedModuleData.id, resolvedModuleData.chunks, name];
    }
    function requireAsyncModule(id) {
      var promise = __vite_rsc_require__(id);
      if ("function" !== typeof promise.then || "fulfilled" === promise.status)
        return null;
      promise.then(
        function(value) {
          promise.status = "fulfilled";
          promise.value = value;
        },
        function(reason) {
          promise.status = "rejected";
          promise.reason = reason;
        }
      );
      return promise;
    }
    function ignoreReject() {
    }
    function preloadModule(metadata) {
      for (var chunks = metadata[1], promises = [], i = 0; i < chunks.length; ) {
        var chunkId = chunks[i++];
        chunks[i++];
        var entry = chunkCache.get(chunkId);
        if (void 0 === entry) {
          entry = __webpack_chunk_load__(chunkId);
          promises.push(entry);
          var resolve = chunkCache.set.bind(chunkCache, chunkId, null);
          entry.then(resolve, ignoreReject);
          chunkCache.set(chunkId, entry);
        } else null !== entry && promises.push(entry);
      }
      return 4 === metadata.length ? 0 === promises.length ? requireAsyncModule(metadata[0]) : Promise.all(promises).then(function() {
        return requireAsyncModule(metadata[0]);
      }) : 0 < promises.length ? Promise.all(promises) : null;
    }
    function requireModule2(metadata) {
      var moduleExports = __vite_rsc_require__(metadata[0]);
      if (4 === metadata.length && "function" === typeof moduleExports.then)
        if ("fulfilled" === moduleExports.status)
          moduleExports = moduleExports.value;
        else throw moduleExports.reason;
      if ("*" === metadata[2]) return moduleExports;
      if ("" === metadata[2])
        return moduleExports.__esModule ? moduleExports.default : moduleExports;
      if (hasOwnProperty.call(moduleExports, metadata[2]))
        return moduleExports[metadata[2]];
    }
    function ReactPromise(status, value, reason) {
      this.status = status;
      this.value = value;
      this.reason = reason;
    }
    function wakeChunk(response, listeners, value, chunk) {
      for (var i = 0; i < listeners.length; i++) {
        var listener = listeners[i];
        "function" === typeof listener ? listener(value) : fulfillReference(response, listener, value, chunk.reason);
      }
    }
    function rejectChunk(response, listeners, error) {
      for (var i = 0; i < listeners.length; i++) {
        var listener = listeners[i];
        "function" === typeof listener ? listener(error) : rejectReference(response, listener.handler, error);
      }
    }
    function triggerErrorOnChunk(response, chunk, error) {
      if ("pending" !== chunk.status && "blocked" !== chunk.status)
        chunk.reason.error(error);
      else {
        var listeners = chunk.reason;
        chunk.status = "rejected";
        chunk.reason = error;
        null !== listeners && rejectChunk(response, listeners, error);
      }
    }
    function resolveModelChunk(response, chunk, value, id) {
      if ("pending" !== chunk.status)
        chunk = chunk.reason, "C" === value[0] ? chunk.close("C" === value ? '"$undefined"' : value.slice(1)) : chunk.enqueueModel(value);
      else {
        var resolveListeners = chunk.value, rejectListeners = chunk.reason;
        chunk.status = "resolved_model";
        chunk.value = value;
        chunk.reason = _defineProperty({ id }, RESPONSE_SYMBOL, response);
        if (null !== resolveListeners)
          switch (initializeModelChunk(chunk), chunk.status) {
            case "fulfilled":
              wakeChunk(response, resolveListeners, chunk.value, chunk);
              break;
            case "blocked":
            case "pending":
              if (chunk.value)
                for (value = 0; value < resolveListeners.length; value++)
                  chunk.value.push(resolveListeners[value]);
              else chunk.value = resolveListeners;
              if (chunk.reason) {
                if (rejectListeners)
                  for (value = 0; value < rejectListeners.length; value++)
                    chunk.reason.push(rejectListeners[value]);
              } else chunk.reason = rejectListeners;
              break;
            case "rejected":
              rejectListeners && rejectChunk(response, rejectListeners, chunk.reason);
          }
      }
    }
    function createResolvedIteratorResultChunk(response, value, done) {
      return new ReactPromise(
        "resolved_model",
        (done ? '{"done":true,"value":' : '{"done":false,"value":') + value + "}",
        _defineProperty({ id: -1 }, RESPONSE_SYMBOL, response)
      );
    }
    function resolveIteratorResultChunk(response, chunk, value, done) {
      resolveModelChunk(
        response,
        chunk,
        (done ? '{"done":true,"value":' : '{"done":false,"value":') + value + "}",
        -1
      );
    }
    function loadServerReference$1(response, metaData, parentObject, key) {
      function reject(error) {
        var rejectListeners = blockedPromise.reason, erroredPromise = blockedPromise;
        erroredPromise.status = "rejected";
        erroredPromise.value = null;
        erroredPromise.reason = error;
        null !== rejectListeners && rejectChunk(response, rejectListeners, error);
        rejectReference(response, handler, error);
      }
      var id = metaData.id;
      if ("string" !== typeof id || "then" === key) return null;
      var cachedPromise = metaData.$$promise;
      if (void 0 !== cachedPromise) {
        if ("fulfilled" === cachedPromise.status)
          return cachedPromise = cachedPromise.value, "__proto__" === key ? null : parentObject[key] = cachedPromise;
        initializingHandler ? (id = initializingHandler, id.deps++) : id = initializingHandler = { chunk: null, value: null, reason: null, deps: 1, errored: false };
        cachedPromise.then(
          resolveReference.bind(null, response, id, parentObject, key),
          rejectReference.bind(null, response, id)
        );
        return null;
      }
      var blockedPromise = new ReactPromise("blocked", null, null);
      metaData.$$promise = blockedPromise;
      var serverReference = resolveServerReference(response._bundlerConfig, id);
      cachedPromise = metaData.bound;
      if (id = preloadModule(serverReference))
        cachedPromise instanceof ReactPromise && (id = Promise.all([id, cachedPromise]));
      else if (cachedPromise instanceof ReactPromise)
        id = Promise.resolve(cachedPromise);
      else
        return cachedPromise = requireModule2(serverReference), id = blockedPromise, id.status = "fulfilled", id.value = cachedPromise;
      if (initializingHandler) {
        var handler = initializingHandler;
        handler.deps++;
      } else
        handler = initializingHandler = {
          chunk: null,
          value: null,
          reason: null,
          deps: 1,
          errored: false
        };
      id.then(function() {
        var resolvedValue = requireModule2(serverReference);
        if (metaData.bound) {
          var promiseValue = metaData.bound.value;
          promiseValue = isArrayImpl(promiseValue) ? promiseValue.slice(0) : [];
          if (promiseValue.length > MAX_BOUND_ARGS) {
            reject(
              Error(
                "Server Function has too many bound arguments. Received " + promiseValue.length + " but the limit is " + MAX_BOUND_ARGS + "."
              )
            );
            return;
          }
          promiseValue.unshift(null);
          resolvedValue = resolvedValue.bind.apply(resolvedValue, promiseValue);
        }
        promiseValue = blockedPromise.value;
        var initializedPromise = blockedPromise;
        initializedPromise.status = "fulfilled";
        initializedPromise.value = resolvedValue;
        initializedPromise.reason = null;
        null !== promiseValue && wakeChunk(response, promiseValue, resolvedValue, initializedPromise);
        resolveReference(response, handler, parentObject, key, resolvedValue);
      }, reject);
      return null;
    }
    function reviveModel(response, parentObj, parentKey, value, reference, arrayRoot) {
      if ("string" === typeof value)
        return parseModelString(
          response,
          parentObj,
          parentKey,
          value,
          reference,
          arrayRoot
        );
      if ("object" === typeof value && null !== value)
        if (void 0 !== reference && void 0 !== response._temporaryReferences && response._temporaryReferences.set(value, reference), isArrayImpl(value)) {
          if (null === arrayRoot) {
            var childContext = { count: 0, fork: false };
            response._rootArrayContexts.set(value, childContext);
          } else childContext = arrayRoot;
          1 < value.length && (childContext.fork = true);
          bumpArrayCount(childContext, value.length + 1, response);
          for (parentObj = 0; parentObj < value.length; parentObj++)
            value[parentObj] = reviveModel(
              response,
              value,
              "" + parentObj,
              value[parentObj],
              void 0 !== reference ? reference + ":" + parentObj : void 0,
              childContext
            );
        } else
          for (childContext in value)
            hasOwnProperty.call(value, childContext) && ("__proto__" === childContext ? delete value[childContext] : (parentObj = void 0 !== reference && -1 === childContext.indexOf(":") ? reference + ":" + childContext : void 0, parentObj = reviveModel(
              response,
              value,
              childContext,
              value[childContext],
              parentObj,
              null
            ), void 0 !== parentObj ? value[childContext] = parentObj : delete value[childContext]));
      return value;
    }
    function bumpArrayCount(arrayContext, slots, response) {
      if ((arrayContext.count += slots) > response._arraySizeLimit && arrayContext.fork)
        throw Error(
          "Maximum array nesting exceeded. Large nested arrays can be dangerous. Try adding intermediate objects."
        );
    }
    function initializeModelChunk(chunk) {
      var prevHandler = initializingHandler;
      initializingHandler = null;
      var _chunk$reason = chunk.reason, response = _chunk$reason[RESPONSE_SYMBOL];
      _chunk$reason = _chunk$reason.id;
      _chunk$reason = -1 === _chunk$reason ? void 0 : _chunk$reason.toString(16);
      var resolvedModel = chunk.value;
      chunk.status = "blocked";
      chunk.value = null;
      chunk.reason = null;
      try {
        var rawModel = JSON.parse(resolvedModel);
        resolvedModel = { count: 0, fork: false };
        var value = reviveModel(
          response,
          { "": rawModel },
          "",
          rawModel,
          _chunk$reason,
          resolvedModel
        ), resolveListeners = chunk.value;
        if (null !== resolveListeners)
          for (chunk.value = null, chunk.reason = null, rawModel = 0; rawModel < resolveListeners.length; rawModel++) {
            var listener = resolveListeners[rawModel];
            "function" === typeof listener ? listener(value) : fulfillReference(response, listener, value, resolvedModel);
          }
        if (null !== initializingHandler) {
          if (initializingHandler.errored) throw initializingHandler.reason;
          if (0 < initializingHandler.deps) {
            initializingHandler.value = value;
            initializingHandler.reason = resolvedModel;
            initializingHandler.chunk = chunk;
            return;
          }
        }
        chunk.status = "fulfilled";
        chunk.value = value;
        chunk.reason = resolvedModel;
      } catch (error) {
        chunk.status = "rejected", chunk.reason = error;
      } finally {
        initializingHandler = prevHandler;
      }
    }
    function reportGlobalError(response, error) {
      response._closed = true;
      response._closedReason = error;
      response._chunks.forEach(function(chunk) {
        "pending" === chunk.status ? triggerErrorOnChunk(response, chunk, error) : "fulfilled" === chunk.status && null !== chunk.reason && (chunk = chunk.reason, "function" === typeof chunk.error && chunk.error(error));
      });
    }
    function getChunk(response, id) {
      var chunks = response._chunks, chunk = chunks.get(id);
      chunk || (chunk = response._formData.get(response._prefix + id), chunk = "string" === typeof chunk ? new ReactPromise(
        "resolved_model",
        chunk,
        _defineProperty({ id }, RESPONSE_SYMBOL, response)
      ) : response._closed ? new ReactPromise("rejected", null, response._closedReason) : new ReactPromise("pending", null, null), chunks.set(id, chunk));
      return chunk;
    }
    function fulfillReference(response, reference, value, arrayRoot) {
      var handler = reference.handler, parentObject = reference.parentObject, key = reference.key, map = reference.map, path = reference.path;
      try {
        for (var localLength = 0, rootArrayContexts = response._rootArrayContexts, i = 1; i < path.length; i++) {
          var name = path[i];
          if ("object" !== typeof value || null === value || getPrototypeOf(value) !== ObjectPrototype && getPrototypeOf(value) !== ArrayPrototype || !hasOwnProperty.call(value, name))
            throw Error("Invalid reference.");
          value = value[name];
          if (isArrayImpl(value))
            localLength = 0, arrayRoot = rootArrayContexts.get(value) || arrayRoot;
          else if (arrayRoot = null, "string" === typeof value)
            localLength = value.length;
          else if ("bigint" === typeof value) {
            var n = Math.abs(Number(value));
            localLength = 0 === n ? 1 : Math.floor(Math.log10(n)) + 1;
          } else localLength = ArrayBuffer.isView(value) ? value.byteLength : 0;
        }
        var resolvedValue = map(response, value, parentObject, key);
        var referenceArrayRoot = reference.arrayRoot;
        null !== referenceArrayRoot && (null !== arrayRoot ? (arrayRoot.fork && (referenceArrayRoot.fork = true), bumpArrayCount(referenceArrayRoot, arrayRoot.count, response)) : 0 < localLength && bumpArrayCount(referenceArrayRoot, localLength, response));
      } catch (error) {
        rejectReference(response, handler, error);
        return;
      }
      resolveReference(response, handler, parentObject, key, resolvedValue);
    }
    function resolveReference(response, handler, parentObject, key, resolvedValue) {
      "__proto__" !== key && (parentObject[key] = resolvedValue);
      "" === key && null === handler.value && (handler.value = resolvedValue);
      handler.deps--;
      0 === handler.deps && (parentObject = handler.chunk, null !== parentObject && "blocked" === parentObject.status && (key = parentObject.value, parentObject.status = "fulfilled", parentObject.value = handler.value, parentObject.reason = handler.reason, null !== key && wakeChunk(response, key, handler.value, parentObject)));
    }
    function rejectReference(response, handler, error) {
      handler.errored || (handler.errored = true, handler.value = null, handler.reason = error, handler = handler.chunk, null !== handler && "blocked" === handler.status && triggerErrorOnChunk(response, handler, error));
    }
    function getOutlinedModel(response, reference, parentObject, key, referenceArrayRoot, map) {
      reference = reference.split(":");
      var id = parseInt(reference[0], 16), chunk = getChunk(response, id);
      switch (chunk.status) {
        case "resolved_model":
          initializeModelChunk(chunk);
      }
      switch (chunk.status) {
        case "fulfilled":
          id = chunk.value;
          chunk = chunk.reason;
          for (var localLength = 0, rootArrayContexts = response._rootArrayContexts, i = 1; i < reference.length; i++) {
            localLength = reference[i];
            if ("object" !== typeof id || null === id || getPrototypeOf(id) !== ObjectPrototype && getPrototypeOf(id) !== ArrayPrototype || !hasOwnProperty.call(id, localLength))
              throw Error("Invalid reference.");
            id = id[localLength];
            isArrayImpl(id) ? (localLength = 0, chunk = rootArrayContexts.get(id) || chunk) : (chunk = null, "string" === typeof id ? localLength = id.length : "bigint" === typeof id ? (localLength = Math.abs(Number(id)), localLength = 0 === localLength ? 1 : Math.floor(Math.log10(localLength)) + 1) : localLength = ArrayBuffer.isView(id) ? id.byteLength : 0);
          }
          parentObject = map(response, id, parentObject, key);
          null !== referenceArrayRoot && (null !== chunk ? (chunk.fork && (referenceArrayRoot.fork = true), bumpArrayCount(referenceArrayRoot, chunk.count, response)) : 0 < localLength && bumpArrayCount(referenceArrayRoot, localLength, response));
          return parentObject;
        case "blocked":
          return initializingHandler ? (response = initializingHandler, response.deps++) : response = initializingHandler = {
            chunk: null,
            value: null,
            reason: null,
            deps: 1,
            errored: false
          }, referenceArrayRoot = {
            handler: response,
            parentObject,
            key,
            map,
            path: reference,
            arrayRoot: referenceArrayRoot
          }, null === chunk.value ? chunk.value = [referenceArrayRoot] : chunk.value.push(referenceArrayRoot), null === chunk.reason ? chunk.reason = [referenceArrayRoot] : chunk.reason.push(referenceArrayRoot), null;
        case "pending":
          throw Error("Invalid forward reference.");
        default:
          return initializingHandler ? (initializingHandler.errored = true, initializingHandler.value = null, initializingHandler.reason = chunk.reason) : initializingHandler = {
            chunk: null,
            value: null,
            reason: chunk.reason,
            deps: 0,
            errored: true
          }, null;
      }
    }
    function createMap(response, model) {
      if (!isArrayImpl(model)) throw Error("Invalid Map initializer.");
      if (true === model.$$consumed) throw Error("Already initialized Map.");
      response = new Map(model);
      model.$$consumed = true;
      return response;
    }
    function createSet(response, model) {
      if (!isArrayImpl(model)) throw Error("Invalid Set initializer.");
      if (true === model.$$consumed) throw Error("Already initialized Set.");
      response = new Set(model);
      model.$$consumed = true;
      return response;
    }
    function extractIterator(response, model) {
      if (!isArrayImpl(model)) throw Error("Invalid Iterator initializer.");
      if (true === model.$$consumed) throw Error("Already initialized Iterator.");
      response = model[Symbol.iterator]();
      model.$$consumed = true;
      return response;
    }
    function createModel(response, model, parentObject, key) {
      return "then" === key && "function" === typeof model ? null : model;
    }
    function parseTypedArray(response, reference, constructor, bytesPerElement, parentObject, parentKey, referenceArrayRoot) {
      function reject(error) {
        if (!handler.errored) {
          handler.errored = true;
          handler.value = null;
          handler.reason = error;
          var chunk = handler.chunk;
          null !== chunk && "blocked" === chunk.status && triggerErrorOnChunk(response, chunk, error);
        }
      }
      reference = parseInt(reference.slice(2), 16);
      var key = response._prefix + reference;
      bytesPerElement = response._chunks;
      if (bytesPerElement.has(reference))
        throw Error("Already initialized typed array.");
      bytesPerElement.set(
        reference,
        new ReactPromise(
          "rejected",
          null,
          Error("Already initialized typed array.")
        )
      );
      reference = response._formData.get(key).arrayBuffer();
      if (initializingHandler) {
        var handler = initializingHandler;
        handler.deps++;
      } else
        handler = initializingHandler = {
          chunk: null,
          value: null,
          reason: null,
          deps: 1,
          errored: false
        };
      reference.then(function(buffer) {
        try {
          null !== referenceArrayRoot && bumpArrayCount(referenceArrayRoot, buffer.byteLength, response);
          var resolvedValue = constructor === ArrayBuffer ? buffer : new constructor(buffer);
          "__proto__" !== key && (parentObject[parentKey] = resolvedValue);
          "" === parentKey && null === handler.value && (handler.value = resolvedValue);
        } catch (x) {
          reject(x);
          return;
        }
        handler.deps--;
        0 === handler.deps && (buffer = handler.chunk, null !== buffer && "blocked" === buffer.status && (resolvedValue = buffer.value, buffer.status = "fulfilled", buffer.value = handler.value, buffer.reason = null, null !== resolvedValue && wakeChunk(response, resolvedValue, handler.value, buffer)));
      }, reject);
      return null;
    }
    function resolveStream(response, id, stream, controller) {
      var chunks = response._chunks;
      stream = new ReactPromise("fulfilled", stream, controller);
      chunks.set(id, stream);
      response = response._formData.getAll(response._prefix + id);
      for (id = 0; id < response.length; id++)
        chunks = response[id], "string" === typeof chunks && ("C" === chunks[0] ? controller.close(
          "C" === chunks ? '"$undefined"' : chunks.slice(1)
        ) : controller.enqueueModel(chunks));
    }
    function parseReadableStream(response, reference, type) {
      function enqueue(value) {
        "bytes" !== type || ArrayBuffer.isView(value) ? controller.enqueue(value) : flightController.error(Error("Invalid data for bytes stream."));
      }
      reference = parseInt(reference.slice(2), 16);
      if (response._chunks.has(reference))
        throw Error("Already initialized stream.");
      var controller = null, closed = false, stream = new ReadableStream({
        type,
        start: function(c) {
          controller = c;
        }
      }), previousBlockedChunk = null, flightController = {
        enqueueModel: function(json) {
          if (null === previousBlockedChunk) {
            var chunk = new ReactPromise(
              "resolved_model",
              json,
              _defineProperty({ id: -1 }, RESPONSE_SYMBOL, response)
            );
            initializeModelChunk(chunk);
            "fulfilled" === chunk.status ? enqueue(chunk.value) : (chunk.then(enqueue, flightController.error), previousBlockedChunk = chunk);
          } else {
            chunk = previousBlockedChunk;
            var _chunk = new ReactPromise("pending", null, null);
            _chunk.then(enqueue, flightController.error);
            previousBlockedChunk = _chunk;
            chunk.then(function() {
              previousBlockedChunk === _chunk && (previousBlockedChunk = null);
              resolveModelChunk(response, _chunk, json, -1);
            });
          }
        },
        close: function() {
          if (!closed)
            if (closed = true, null === previousBlockedChunk)
              controller.close();
            else {
              var blockedChunk = previousBlockedChunk;
              previousBlockedChunk = null;
              blockedChunk.then(function() {
                return controller.close();
              });
            }
        },
        error: function(error) {
          if (!closed)
            if (closed = true, null === previousBlockedChunk)
              controller.error(error);
            else {
              var blockedChunk = previousBlockedChunk;
              previousBlockedChunk = null;
              blockedChunk.then(function() {
                return controller.error(error);
              });
            }
        }
      };
      resolveStream(response, reference, stream, flightController);
      return stream;
    }
    function FlightIterator(next) {
      this.next = next;
    }
    function parseAsyncIterable(response, reference, iterator) {
      reference = parseInt(reference.slice(2), 16);
      if (response._chunks.has(reference))
        throw Error("Already initialized stream.");
      var buffer = [], closed = false, nextWriteIndex = 0, iterable = _defineProperty({}, ASYNC_ITERATOR, function() {
        var nextReadIndex = 0;
        return new FlightIterator(function(arg) {
          if (void 0 !== arg)
            throw Error(
              "Values cannot be passed to next() of AsyncIterables passed to Client Components."
            );
          if (nextReadIndex === buffer.length) {
            if (closed)
              return new ReactPromise(
                "fulfilled",
                { done: true, value: void 0 },
                null
              );
            buffer[nextReadIndex] = new ReactPromise("pending", null, null);
          }
          return buffer[nextReadIndex++];
        });
      });
      iterator = iterator ? iterable[ASYNC_ITERATOR]() : iterable;
      resolveStream(response, reference, iterator, {
        enqueueModel: function(value) {
          nextWriteIndex === buffer.length ? buffer[nextWriteIndex] = createResolvedIteratorResultChunk(
            response,
            value,
            false
          ) : resolveIteratorResultChunk(
            response,
            buffer[nextWriteIndex],
            value,
            false
          );
          nextWriteIndex++;
        },
        close: function(value) {
          if (!closed)
            for (closed = true, nextWriteIndex === buffer.length ? buffer[nextWriteIndex] = createResolvedIteratorResultChunk(
              response,
              value,
              true
            ) : resolveIteratorResultChunk(
              response,
              buffer[nextWriteIndex],
              value,
              true
            ), nextWriteIndex++; nextWriteIndex < buffer.length; )
              resolveIteratorResultChunk(
                response,
                buffer[nextWriteIndex++],
                '"$undefined"',
                true
              );
        },
        error: function(error) {
          if (!closed)
            for (closed = true, nextWriteIndex === buffer.length && (buffer[nextWriteIndex] = new ReactPromise(
              "pending",
              null,
              null
            )); nextWriteIndex < buffer.length; )
              triggerErrorOnChunk(response, buffer[nextWriteIndex++], error);
        }
      });
      return iterator;
    }
    function parseModelString(response, obj, key, value, reference, arrayRoot) {
      if ("$" === value[0]) {
        switch (value[1]) {
          case "$":
            return null !== arrayRoot && bumpArrayCount(arrayRoot, value.length - 1, response), value.slice(1);
          case "@":
            return obj = parseInt(value.slice(2), 16), getChunk(response, obj);
          case "h":
            return arrayRoot = value.slice(2), getOutlinedModel(
              response,
              arrayRoot,
              obj,
              key,
              null,
              loadServerReference$1
            );
          case "T":
            if (void 0 === reference || void 0 === response._temporaryReferences)
              throw Error(
                "Could not reference an opaque temporary reference. This is likely due to misconfiguring the temporaryReferences options on the server."
              );
            return createTemporaryReference(
              response._temporaryReferences,
              reference
            );
          case "Q":
            return arrayRoot = value.slice(2), getOutlinedModel(response, arrayRoot, obj, key, null, createMap);
          case "W":
            return arrayRoot = value.slice(2), getOutlinedModel(response, arrayRoot, obj, key, null, createSet);
          case "K":
            obj = value.slice(2);
            obj = response._prefix + obj + "_";
            key = new FormData();
            response = response._formData;
            arrayRoot = Array.from(response.keys());
            for (value = 0; value < arrayRoot.length; value++)
              if (reference = arrayRoot[value], reference.startsWith(obj)) {
                for (var entries = response.getAll(reference), newKey = reference.slice(obj.length), j = 0; j < entries.length; j++)
                  key.append(newKey, entries[j]);
                response.delete(reference);
              }
            return key;
          case "i":
            return arrayRoot = value.slice(2), getOutlinedModel(
              response,
              arrayRoot,
              obj,
              key,
              null,
              extractIterator
            );
          case "I":
            return Infinity;
          case "-":
            return "$-0" === value ? -0 : -Infinity;
          case "N":
            return NaN;
          case "u":
            return;
          case "D":
            return new Date(Date.parse(value.slice(2)));
          case "n":
            obj = value.slice(2);
            if (obj.length > MAX_BIGINT_DIGITS)
              throw Error(
                "BigInt is too large. Received " + obj.length + " digits but the limit is " + MAX_BIGINT_DIGITS + "."
              );
            null !== arrayRoot && bumpArrayCount(arrayRoot, obj.length, response);
            return BigInt(obj);
          case "A":
            return parseTypedArray(
              response,
              value,
              ArrayBuffer,
              1,
              obj,
              key,
              arrayRoot
            );
          case "O":
            return parseTypedArray(
              response,
              value,
              Int8Array,
              1,
              obj,
              key,
              arrayRoot
            );
          case "o":
            return parseTypedArray(
              response,
              value,
              Uint8Array,
              1,
              obj,
              key,
              arrayRoot
            );
          case "U":
            return parseTypedArray(
              response,
              value,
              Uint8ClampedArray,
              1,
              obj,
              key,
              arrayRoot
            );
          case "S":
            return parseTypedArray(
              response,
              value,
              Int16Array,
              2,
              obj,
              key,
              arrayRoot
            );
          case "s":
            return parseTypedArray(
              response,
              value,
              Uint16Array,
              2,
              obj,
              key,
              arrayRoot
            );
          case "L":
            return parseTypedArray(
              response,
              value,
              Int32Array,
              4,
              obj,
              key,
              arrayRoot
            );
          case "l":
            return parseTypedArray(
              response,
              value,
              Uint32Array,
              4,
              obj,
              key,
              arrayRoot
            );
          case "G":
            return parseTypedArray(
              response,
              value,
              Float32Array,
              4,
              obj,
              key,
              arrayRoot
            );
          case "g":
            return parseTypedArray(
              response,
              value,
              Float64Array,
              8,
              obj,
              key,
              arrayRoot
            );
          case "M":
            return parseTypedArray(
              response,
              value,
              BigInt64Array,
              8,
              obj,
              key,
              arrayRoot
            );
          case "m":
            return parseTypedArray(
              response,
              value,
              BigUint64Array,
              8,
              obj,
              key,
              arrayRoot
            );
          case "V":
            return parseTypedArray(
              response,
              value,
              DataView,
              1,
              obj,
              key,
              arrayRoot
            );
          case "B":
            return obj = parseInt(value.slice(2), 16), response._formData.get(response._prefix + obj);
          case "R":
            return parseReadableStream(response, value, void 0);
          case "r":
            return parseReadableStream(response, value, "bytes");
          case "X":
            return parseAsyncIterable(response, value, false);
          case "x":
            return parseAsyncIterable(response, value, true);
        }
        value = value.slice(1);
        return getOutlinedModel(
          response,
          value,
          obj,
          key,
          arrayRoot,
          createModel
        );
      }
      null !== arrayRoot && bumpArrayCount(arrayRoot, value.length, response);
      return value;
    }
    function createResponse(bundlerConfig, formFieldPrefix, temporaryReferences) {
      var backingFormData = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : new FormData(), arraySizeLimit = 4 < arguments.length && void 0 !== arguments[4] ? arguments[4] : 1e6, chunks = /* @__PURE__ */ new Map();
      return {
        _bundlerConfig: bundlerConfig,
        _prefix: formFieldPrefix,
        _formData: backingFormData,
        _chunks: chunks,
        _closed: false,
        _closedReason: null,
        _temporaryReferences: temporaryReferences,
        _rootArrayContexts: /* @__PURE__ */ new WeakMap(),
        _arraySizeLimit: arraySizeLimit
      };
    }
    function close(response) {
      reportGlobalError(response, Error("Connection closed."));
    }
    function loadServerReference(bundlerConfig, metaData) {
      var id = metaData.id;
      if ("string" !== typeof id) return null;
      var serverReference = resolveServerReference(bundlerConfig, id);
      bundlerConfig = preloadModule(serverReference);
      metaData = metaData.bound;
      return metaData instanceof Promise ? Promise.all([metaData, bundlerConfig]).then(function(_ref) {
        _ref = _ref[0];
        var fn = requireModule2(serverReference);
        if (_ref.length > MAX_BOUND_ARGS)
          throw Error(
            "Server Function has too many bound arguments. Received " + _ref.length + " but the limit is " + MAX_BOUND_ARGS + "."
          );
        return fn.bind.apply(fn, [null].concat(_ref));
      }) : bundlerConfig ? Promise.resolve(bundlerConfig).then(function() {
        return requireModule2(serverReference);
      }) : Promise.resolve(requireModule2(serverReference));
    }
    function decodeBoundActionMetaData(body, serverManifest, formFieldPrefix, arraySizeLimit) {
      body = createResponse(
        serverManifest,
        formFieldPrefix,
        void 0,
        body,
        arraySizeLimit
      );
      close(body);
      body = getChunk(body, 0);
      body.then(function() {
      });
      if ("fulfilled" !== body.status) throw body.reason;
      return body.value;
    }
    function startReadingFromDebugChannelReadableStream(request$jscomp$0, stream) {
      function progress(_ref) {
        var done = _ref.done, buffer = _ref.value;
        _ref = stringBuffer;
        done ? (buffer = new Uint8Array(0), buffer = stringDecoder.decode(buffer)) : buffer = stringDecoder.decode(buffer, decoderOptions);
        stringBuffer = _ref + buffer;
        _ref = stringBuffer.split("\n");
        for (buffer = 0; buffer < _ref.length - 1; buffer++) {
          var request = request$jscomp$0, message = _ref[buffer], deferredDebugObjects = request.deferredDebugObjects;
          if (null === deferredDebugObjects)
            throw Error(
              "resolveDebugMessage/closeDebugChannel should not be called for a Request that wasn't kept alive. This is a bug in React."
            );
          if ("" === message) closeDebugChannel(request);
          else {
            var command = message.charCodeAt(0);
            message = message.slice(2).split(",").map(fromHex);
            switch (command) {
              case 82:
                for (command = 0; command < message.length; command++) {
                  var id = message[command], retainedValue = deferredDebugObjects.retained.get(id);
                  void 0 !== retainedValue && (request.pendingDebugChunks--, deferredDebugObjects.retained.delete(id), deferredDebugObjects.existing.delete(retainedValue), enqueueFlush(request));
                }
                break;
              case 81:
                for (command = 0; command < message.length; command++)
                  id = message[command], retainedValue = deferredDebugObjects.retained.get(id), void 0 !== retainedValue && (deferredDebugObjects.retained.delete(id), deferredDebugObjects.existing.delete(retainedValue), emitOutlinedDebugModelChunk(
                    request,
                    id,
                    { objectLimit: 10 },
                    retainedValue
                  ), enqueueFlush(request));
                break;
              case 80:
                for (command = 0; command < message.length; command++)
                  id = message[command], retainedValue = deferredDebugObjects.retained.get(id), void 0 !== retainedValue && (deferredDebugObjects.retained.delete(id), emitRequestedDebugThenable(
                    request,
                    id,
                    { objectLimit: 10 },
                    retainedValue
                  ));
                break;
              default:
                throw Error(
                  "Unknown command. The debugChannel was not wired up properly."
                );
            }
          }
        }
        stringBuffer = _ref[_ref.length - 1];
        if (done) closeDebugChannel(request$jscomp$0);
        else return reader.read().then(progress).catch(error);
      }
      function error(e) {
        abort(
          request$jscomp$0,
          Error("Lost connection to the Debug Channel.", { cause: e })
        );
      }
      var reader = stream.getReader(), stringDecoder = new TextDecoder(), stringBuffer = "";
      reader.read().then(progress).catch(error);
    }
    var ReactDOM = requireReactDom_reactServer(), React2 = requireReact_reactServer(), REACT_LEGACY_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.element"), REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment"), REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo"), REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy"), REACT_MEMO_CACHE_SENTINEL = /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel");
    var MAYBE_ITERATOR_SYMBOL = Symbol.iterator, ASYNC_ITERATOR = Symbol.asyncIterator, LocalPromise = Promise, scheduleMicrotask = "function" === typeof queueMicrotask ? queueMicrotask : function(callback) {
      LocalPromise.resolve(null).then(callback).catch(handleErrorInNextTick);
    }, currentView = null, writtenBytes = 0, textEncoder = new TextEncoder(), CLIENT_REFERENCE_TAG$1 = /* @__PURE__ */ Symbol.for("react.client.reference"), SERVER_REFERENCE_TAG = /* @__PURE__ */ Symbol.for("react.server.reference"), FunctionBind = Function.prototype.bind, ArraySlice = Array.prototype.slice, serverReferenceToString = {
      value: function() {
        return "function () { [omitted code] }";
      },
      configurable: true,
      writable: true
    }, PROMISE_PROTOTYPE = Promise.prototype, deepProxyHandlers = {
      get: function(target, name) {
        switch (name) {
          case "$$typeof":
            return target.$$typeof;
          case "$$id":
            return target.$$id;
          case "$$async":
            return target.$$async;
          case "name":
            return target.name;
          case "displayName":
            return;
          case "defaultProps":
            return;
          case "_debugInfo":
            return;
          case "toJSON":
            return;
          case Symbol.toPrimitive:
            return Object.prototype[Symbol.toPrimitive];
          case Symbol.toStringTag:
            return Object.prototype[Symbol.toStringTag];
          case "Provider":
            throw Error(
              "Cannot render a Client Context Provider on the Server. Instead, you can export a Client Component wrapper that itself renders a Client Context Provider."
            );
          case "then":
            throw Error(
              "Cannot await or return from a thenable. You cannot await a client module from a server component."
            );
        }
        throw Error(
          "Cannot access " + (String(target.name) + "." + String(name)) + " on the server. You cannot dot into a client module from a server component. You can only pass the imported name through."
        );
      },
      set: function() {
        throw Error("Cannot assign to a client module from a server module.");
      }
    }, proxyHandlers$1 = {
      get: function(target, name) {
        return getReference(target, name);
      },
      getOwnPropertyDescriptor: function(target, name) {
        var descriptor = Object.getOwnPropertyDescriptor(target, name);
        descriptor || (descriptor = {
          value: getReference(target, name),
          writable: false,
          configurable: false,
          enumerable: false
        }, Object.defineProperty(target, name, descriptor));
        return descriptor;
      },
      getPrototypeOf: function() {
        return PROMISE_PROTOTYPE;
      },
      set: function() {
        throw Error("Cannot assign to a client module from a server module.");
      }
    }, ReactDOMSharedInternals = ReactDOM.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, previousDispatcher = ReactDOMSharedInternals.d;
    ReactDOMSharedInternals.d = {
      f: previousDispatcher.f,
      r: previousDispatcher.r,
      D: function(href) {
        if ("string" === typeof href && href) {
          var request = resolveRequest();
          if (request) {
            var hints = request.hints, key = "D|" + href;
            hints.has(key) || (hints.add(key), emitHint(request, "D", href));
          } else previousDispatcher.D(href);
        }
      },
      C: function(href, crossOrigin) {
        if ("string" === typeof href) {
          var request = resolveRequest();
          if (request) {
            var hints = request.hints, key = "C|" + (null == crossOrigin ? "null" : crossOrigin) + "|" + href;
            hints.has(key) || (hints.add(key), "string" === typeof crossOrigin ? emitHint(request, "C", [href, crossOrigin]) : emitHint(request, "C", href));
          } else previousDispatcher.C(href, crossOrigin);
        }
      },
      L: preload,
      m: preloadModule$1,
      X: function(src, options) {
        if ("string" === typeof src) {
          var request = resolveRequest();
          if (request) {
            var hints = request.hints, key = "X|" + src;
            if (hints.has(key)) return;
            hints.add(key);
            return (options = trimOptions(options)) ? emitHint(request, "X", [src, options]) : emitHint(request, "X", src);
          }
          previousDispatcher.X(src, options);
        }
      },
      S: function(href, precedence, options) {
        if ("string" === typeof href) {
          var request = resolveRequest();
          if (request) {
            var hints = request.hints, key = "S|" + href;
            if (hints.has(key)) return;
            hints.add(key);
            return (options = trimOptions(options)) ? emitHint(request, "S", [
              href,
              "string" === typeof precedence ? precedence : 0,
              options
            ]) : "string" === typeof precedence ? emitHint(request, "S", [href, precedence]) : emitHint(request, "S", href);
          }
          previousDispatcher.S(href, precedence, options);
        }
      },
      M: function(src, options) {
        if ("string" === typeof src) {
          var request = resolveRequest();
          if (request) {
            var hints = request.hints, key = "M|" + src;
            if (hints.has(key)) return;
            hints.add(key);
            return (options = trimOptions(options)) ? emitHint(request, "M", [src, options]) : emitHint(request, "M", src);
          }
          previousDispatcher.M(src, options);
        }
      }
    };
    var framesToSkip = 0, collectedStackTrace = null, identifierRegExp = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/, frameRegExp = /^ {3} at (?:(.+) \((?:(.+):(\d+):(\d+)|<anonymous>)\)|(?:async )?(.+):(\d+):(\d+)|<anonymous>)$/, stackTraceCache = /* @__PURE__ */ new WeakMap(), supportsRequestStorage = "function" === typeof AsyncLocalStorage, requestStorage = supportsRequestStorage ? new AsyncLocalStorage() : null, supportsComponentStorage = supportsRequestStorage, componentStorage = supportsComponentStorage ? new AsyncLocalStorage() : null, TEMPORARY_REFERENCE_TAG = /* @__PURE__ */ Symbol.for("react.temporary.reference"), proxyHandlers = {
      get: function(target, name) {
        switch (name) {
          case "$$typeof":
            return target.$$typeof;
          case "name":
            return;
          case "displayName":
            return;
          case "defaultProps":
            return;
          case "_debugInfo":
            return;
          case "toJSON":
            return;
          case Symbol.toPrimitive:
            return Object.prototype[Symbol.toPrimitive];
          case Symbol.toStringTag:
            return Object.prototype[Symbol.toStringTag];
          case "Provider":
            throw Error(
              "Cannot render a Client Context Provider on the Server. Instead, you can export a Client Component wrapper that itself renders a Client Context Provider."
            );
          case "then":
            return;
        }
        throw Error(
          "Cannot access " + String(name) + " on the server. You cannot dot into a temporary client reference from a server component. You can only pass the value through to the client."
        );
      },
      set: function() {
        throw Error(
          "Cannot assign to a temporary client reference from a server module."
        );
      }
    }, SuspenseException = Error(
      "Suspense Exception: This is not a real error! It's an implementation detail of `use` to interrupt the current render. You must either rethrow it immediately, or move the `use` call outside of the `try/catch` block. Capturing without rethrowing will lead to unexpected behavior.\n\nTo handle async errors, wrap your component in an error boundary, or call the promise's `.catch` method and pass the result to `use`."
    ), suspendedThenable = null, currentRequest$1 = null, thenableIndexCounter = 0, thenableState = null, currentComponentDebugInfo = null, HooksDispatcher = {
      readContext: unsupportedContext,
      use: function(usable) {
        if (null !== usable && "object" === typeof usable || "function" === typeof usable) {
          if ("function" === typeof usable.then) {
            var index = thenableIndexCounter;
            thenableIndexCounter += 1;
            null === thenableState && (thenableState = []);
            return trackUsedThenable(thenableState, usable, index);
          }
          usable.$$typeof === REACT_CONTEXT_TYPE && unsupportedContext();
        }
        if (isClientReference2(usable)) {
          if (null != usable.value && usable.value.$$typeof === REACT_CONTEXT_TYPE)
            throw Error(
              "Cannot read a Client Context from a Server Component."
            );
          throw Error("Cannot use() an already resolved Client Reference.");
        }
        throw Error(
          "An unsupported type was passed to use(): " + String(usable)
        );
      },
      useCallback: function(callback) {
        return callback;
      },
      useContext: unsupportedContext,
      useEffect: unsupportedHook,
      useImperativeHandle: unsupportedHook,
      useLayoutEffect: unsupportedHook,
      useInsertionEffect: unsupportedHook,
      useMemo: function(nextCreate) {
        return nextCreate();
      },
      useReducer: unsupportedHook,
      useRef: unsupportedHook,
      useState: unsupportedHook,
      useDebugValue: function() {
      },
      useDeferredValue: unsupportedHook,
      useTransition: unsupportedHook,
      useSyncExternalStore: unsupportedHook,
      useId: function() {
        if (null === currentRequest$1)
          throw Error("useId can only be used while React is rendering");
        var id = currentRequest$1.identifierCount++;
        return "_" + currentRequest$1.identifierPrefix + "S_" + id.toString(32) + "_";
      },
      useHostTransitionStatus: unsupportedHook,
      useFormState: unsupportedHook,
      useActionState: unsupportedHook,
      useOptimistic: unsupportedHook,
      useMemoCache: function(size) {
        for (var data2 = Array(size), i = 0; i < size; i++)
          data2[i] = REACT_MEMO_CACHE_SENTINEL;
        return data2;
      },
      useCacheRefresh: function() {
        return unsupportedRefresh;
      }
    };
    HooksDispatcher.useEffectEvent = unsupportedHook;
    var currentOwner = null, DefaultAsyncDispatcher = {
      getCacheForType: function(resourceType) {
        var cache = (cache = resolveRequest()) ? cache.cache : /* @__PURE__ */ new Map();
        var entry = cache.get(resourceType);
        void 0 === entry && (entry = resourceType(), cache.set(resourceType, entry));
        return entry;
      },
      cacheSignal: function() {
        var request = resolveRequest();
        return request ? request.cacheController.signal : null;
      }
    };
    DefaultAsyncDispatcher.getOwner = resolveOwner;
    var ReactSharedInternalsServer = React2.__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    if (!ReactSharedInternalsServer)
      throw Error(
        'The "react" package in this environment is not configured correctly. The "react-server" condition must be enabled in any environment that runs React Server Components.'
      );
    var prefix, suffix;
    var lastResetTime = 0;
    if ("object" === typeof performance && "function" === typeof performance.now) {
      var localPerformance = performance;
      var getCurrentTime = function() {
        return localPerformance.now();
      };
    } else {
      var localDate = Date;
      getCurrentTime = function() {
        return localDate.now();
      };
    }
    var callComponent = {
      react_stack_bottom_frame: function(Component, props, componentDebugInfo) {
        currentOwner = componentDebugInfo;
        try {
          return Component(props, void 0);
        } finally {
          currentOwner = null;
        }
      }
    }, callComponentInDEV = callComponent.react_stack_bottom_frame.bind(callComponent), callLazyInit = {
      react_stack_bottom_frame: function(lazy) {
        var init2 = lazy._init;
        return init2(lazy._payload);
      }
    }, callLazyInitInDEV = callLazyInit.react_stack_bottom_frame.bind(callLazyInit), callIterator = {
      react_stack_bottom_frame: function(iterator, progress, error) {
        iterator.next().then(progress, error);
      }
    }, callIteratorInDEV = callIterator.react_stack_bottom_frame.bind(callIterator), isArrayImpl = Array.isArray, getPrototypeOf = Object.getPrototypeOf, jsxPropsParents = /* @__PURE__ */ new WeakMap(), jsxChildrenParents = /* @__PURE__ */ new WeakMap(), CLIENT_REFERENCE_TAG = /* @__PURE__ */ Symbol.for("react.client.reference"), hasOwnProperty = Object.prototype.hasOwnProperty, doNotLimit = /* @__PURE__ */ new WeakSet();
    "object" === typeof console && null !== console && (patchConsole(console, "assert"), patchConsole(console, "debug"), patchConsole(console, "dir"), patchConsole(console, "dirxml"), patchConsole(console, "error"), patchConsole(console, "group"), patchConsole(console, "groupCollapsed"), patchConsole(console, "groupEnd"), patchConsole(console, "info"), patchConsole(console, "log"), patchConsole(console, "table"), patchConsole(console, "trace"), patchConsole(console, "warn"));
    var ObjectPrototype$1 = Object.prototype, stringify = JSON.stringify, ABORTING = 12, CLOSED = 14, defaultPostponeHandler = noop, currentRequest = null, canEmitDebugInfo = false, serializedSize = 0, MAX_ROW_SIZE = 3200, modelRoot = false, CONSTRUCTOR_MARKER = /* @__PURE__ */ Symbol(), debugModelRoot = null, debugNoOutline = null, emptyRoot = {}, decoderOptions = { stream: true }, chunkCache = /* @__PURE__ */ new Map(), RESPONSE_SYMBOL = /* @__PURE__ */ Symbol();
    ReactPromise.prototype = Object.create(Promise.prototype);
    ReactPromise.prototype.then = function(resolve, reject) {
      switch (this.status) {
        case "resolved_model":
          initializeModelChunk(this);
      }
      switch (this.status) {
        case "fulfilled":
          if ("function" === typeof resolve) {
            for (var inspectedValue = this.value, cycleProtection = 0, visited = /* @__PURE__ */ new Set(); inspectedValue instanceof ReactPromise; ) {
              cycleProtection++;
              if (inspectedValue === this || visited.has(inspectedValue) || 1e3 < cycleProtection) {
                "function" === typeof reject && reject(Error("Cannot have cyclic thenables."));
                return;
              }
              visited.add(inspectedValue);
              if ("fulfilled" === inspectedValue.status)
                inspectedValue = inspectedValue.value;
              else break;
            }
            resolve(this.value);
          }
          break;
        case "pending":
        case "blocked":
          "function" === typeof resolve && (null === this.value && (this.value = []), this.value.push(resolve));
          "function" === typeof reject && (null === this.reason && (this.reason = []), this.reason.push(reject));
          break;
        default:
          "function" === typeof reject && reject(this.reason);
      }
    };
    var ObjectPrototype = Object.prototype, ArrayPrototype = Array.prototype, initializingHandler = null;
    FlightIterator.prototype = {};
    FlightIterator.prototype[ASYNC_ITERATOR] = function() {
      return this;
    };
    var MAX_BIGINT_DIGITS = 300, MAX_BOUND_ARGS = 1e3;
    reactServerDomWebpackServer_edge_development.createClientModuleProxy = function(moduleId) {
      moduleId = registerClientReferenceImpl({}, moduleId, false);
      return new Proxy(moduleId, proxyHandlers$1);
    };
    reactServerDomWebpackServer_edge_development.createTemporaryReferenceSet = function() {
      return /* @__PURE__ */ new WeakMap();
    };
    reactServerDomWebpackServer_edge_development.decodeAction = function(body, serverManifest) {
      var formData = new FormData(), action = null, seenActions = /* @__PURE__ */ new Set();
      body.forEach(function(value, key) {
        key.startsWith("$ACTION_") ? key.startsWith("$ACTION_REF_") ? seenActions.has(key) || (seenActions.add(key), value = "$ACTION_" + key.slice(12) + ":", value = decodeBoundActionMetaData(body, serverManifest, value), action = loadServerReference(serverManifest, value)) : key.startsWith("$ACTION_ID_") && !seenActions.has(key) && (seenActions.add(key), value = key.slice(11), action = loadServerReference(serverManifest, {
          id: value,
          bound: null
        })) : formData.append(key, value);
      });
      return null === action ? null : action.then(function(fn) {
        return fn.bind(null, formData);
      });
    };
    reactServerDomWebpackServer_edge_development.decodeFormState = function(actionResult, body, serverManifest) {
      var keyPath = body.get("$ACTION_KEY");
      if ("string" !== typeof keyPath) return Promise.resolve(null);
      var metaData = null;
      body.forEach(function(value, key) {
        key.startsWith("$ACTION_REF_") && (value = "$ACTION_" + key.slice(12) + ":", metaData = decodeBoundActionMetaData(body, serverManifest, value));
      });
      if (null === metaData) return Promise.resolve(null);
      var referenceId = metaData.id;
      return Promise.resolve(metaData.bound).then(function(bound) {
        return null === bound ? null : [actionResult, keyPath, referenceId, bound.length - 1];
      });
    };
    reactServerDomWebpackServer_edge_development.decodeReply = function(body, webpackMap, options) {
      if ("string" === typeof body) {
        var form = new FormData();
        form.append("0", body);
        body = form;
      }
      body = createResponse(
        webpackMap,
        "",
        options ? options.temporaryReferences : void 0,
        body,
        options ? options.arraySizeLimit : void 0
      );
      webpackMap = getChunk(body, 0);
      close(body);
      return webpackMap;
    };
    reactServerDomWebpackServer_edge_development.decodeReplyFromAsyncIterable = function(iterable, webpackMap, options) {
      function progress(entry) {
        if (entry.done) close(response$jscomp$0);
        else {
          entry = entry.value;
          var name = entry[0];
          entry = entry[1];
          if ("string" === typeof entry) {
            var response = response$jscomp$0;
            response._formData.append(name, entry);
            var prefix2 = response._prefix;
            if (name.startsWith(prefix2)) {
              var chunks = response._chunks;
              name = +name.slice(prefix2.length);
              (chunks = chunks.get(name)) && resolveModelChunk(response, chunks, entry, name);
            }
          } else response$jscomp$0._formData.append(name, entry);
          iterator.next().then(progress, error);
        }
      }
      function error(reason) {
        reportGlobalError(response$jscomp$0, reason);
        "function" === typeof iterator.throw && iterator.throw(reason).then(error, error);
      }
      var iterator = iterable[ASYNC_ITERATOR](), response$jscomp$0 = createResponse(
        webpackMap,
        "",
        options ? options.temporaryReferences : void 0,
        void 0,
        options ? options.arraySizeLimit : void 0
      );
      iterator.next().then(progress, error);
      return getChunk(response$jscomp$0, 0);
    };
    reactServerDomWebpackServer_edge_development.prerender = function(model, webpackMap, options) {
      return new Promise(function(resolve, reject) {
        var request = createPrerenderRequest(
          model,
          webpackMap,
          function() {
            var stream = new ReadableStream(
              {
                type: "bytes",
                pull: function(controller) {
                  startFlowing(request, controller);
                },
                cancel: function(reason) {
                  request.destination = null;
                  abort(request, reason);
                }
              },
              { highWaterMark: 0 }
            );
            resolve({ prelude: stream });
          },
          reject,
          options ? options.onError : void 0,
          options ? options.identifierPrefix : void 0,
          options ? options.onPostpone : void 0,
          options ? options.temporaryReferences : void 0,
          options ? options.environmentName : void 0,
          options ? options.filterStackFrame : void 0,
          false
        );
        if (options && options.signal) {
          var signal = options.signal;
          if (signal.aborted) abort(request, signal.reason);
          else {
            var listener = function() {
              abort(request, signal.reason);
              signal.removeEventListener("abort", listener);
            };
            signal.addEventListener("abort", listener);
          }
        }
        startWork(request);
      });
    };
    reactServerDomWebpackServer_edge_development.registerClientReference = function(proxyImplementation, id, exportName) {
      return registerClientReferenceImpl(
        proxyImplementation,
        id + "#" + exportName,
        false
      );
    };
    reactServerDomWebpackServer_edge_development.registerServerReference = function(reference, id, exportName) {
      return Object.defineProperties(reference, {
        $$typeof: { value: SERVER_REFERENCE_TAG },
        $$id: {
          value: null === exportName ? id : id + "#" + exportName,
          configurable: true
        },
        $$bound: { value: null, configurable: true },
        $$location: { value: Error("react-stack-top-frame"), configurable: true },
        bind: { value: bind, configurable: true },
        toString: serverReferenceToString
      });
    };
    reactServerDomWebpackServer_edge_development.renderToReadableStream = function(model, webpackMap, options) {
      var debugChannelReadable = options && options.debugChannel ? options.debugChannel.readable : void 0, debugChannelWritable = options && options.debugChannel ? options.debugChannel.writable : void 0, request = createRequest(
        model,
        webpackMap,
        options ? options.onError : void 0,
        options ? options.identifierPrefix : void 0,
        options ? options.onPostpone : void 0,
        options ? options.temporaryReferences : void 0,
        options ? options.environmentName : void 0,
        options ? options.filterStackFrame : void 0,
        void 0 !== debugChannelReadable
      );
      if (options && options.signal) {
        var signal = options.signal;
        if (signal.aborted) abort(request, signal.reason);
        else {
          var listener = function() {
            abort(request, signal.reason);
            signal.removeEventListener("abort", listener);
          };
          signal.addEventListener("abort", listener);
        }
      }
      void 0 !== debugChannelWritable && new ReadableStream(
        {
          type: "bytes",
          pull: function(controller) {
            if (13 === request.status)
              request.status = CLOSED, closeWithError(controller, request.fatalError);
            else if (request.status !== CLOSED && null === request.debugDestination) {
              request.debugDestination = controller;
              try {
                flushCompletedChunks(request);
              } catch (error) {
                logRecoverableError(request, error, null), fatalError(request, error);
              }
            }
          }
        },
        { highWaterMark: 0 }
      ).pipeTo(debugChannelWritable);
      void 0 !== debugChannelReadable && startReadingFromDebugChannelReadableStream(
        request,
        debugChannelReadable
      );
      return new ReadableStream(
        {
          type: "bytes",
          start: function() {
            startWork(request);
          },
          pull: function(controller) {
            startFlowing(request, controller);
          },
          cancel: function(reason) {
            request.destination = null;
            abort(request, reason);
          }
        },
        { highWaterMark: 0 }
      );
    };
  })();
  return reactServerDomWebpackServer_edge_development;
}
var hasRequiredServer_edge;
function requireServer_edge() {
  if (hasRequiredServer_edge) return server_edge;
  hasRequiredServer_edge = 1;
  var s;
  if (process.env.NODE_ENV === "production") {
    s = requireReactServerDomWebpackServer_edge_production();
  } else {
    s = requireReactServerDomWebpackServer_edge_development();
  }
  server_edge.renderToReadableStream = s.renderToReadableStream;
  server_edge.decodeReply = s.decodeReply;
  server_edge.decodeReplyFromAsyncIterable = s.decodeReplyFromAsyncIterable;
  server_edge.decodeAction = s.decodeAction;
  server_edge.decodeFormState = s.decodeFormState;
  server_edge.registerServerReference = s.registerServerReference;
  server_edge.registerClientReference = s.registerClientReference;
  server_edge.createClientModuleProxy = s.createClientModuleProxy;
  server_edge.createTemporaryReferenceSet = s.createTemporaryReferenceSet;
  return server_edge;
}
var server_edgeExports = requireServer_edge();
let init = false;
let requireModule;
function setRequireModule(options) {
  if (init) return;
  init = true;
  requireModule = (id) => {
    return options.load(removeReferenceCacheTag(id));
  };
  globalThis.__vite_rsc_server_require__ = memoize(async (id) => {
    if (id.startsWith(SERVER_DECODE_CLIENT_PREFIX)) {
      id = id.slice(SERVER_DECODE_CLIENT_PREFIX.length);
      id = removeReferenceCacheTag(id);
      const target = {};
      const getOrCreateClientReference = (name) => {
        return target[name] ??= server_edgeExports.registerClientReference(() => {
          throw new Error(`Unexpectedly client reference export '${name}' is called on server`);
        }, id, name);
      };
      return new Proxy(target, { getOwnPropertyDescriptor(_target, name) {
        if (typeof name !== "string" || name === "then") return Reflect.getOwnPropertyDescriptor(target, name);
        getOrCreateClientReference(name);
        return Reflect.getOwnPropertyDescriptor(target, name);
      } });
    }
    return requireModule(id);
  });
  setInternalRequire();
}
async function loadServerAction(id) {
  const [file, name] = id.split("#");
  return (await requireModule(file))[name];
}
function createServerManifest() {
  const cacheTag = "";
  return new Proxy({}, { get(_target, $$id, _receiver) {
    tinyassert(typeof $$id === "string");
    let [id, name] = $$id.split("#");
    tinyassert(id);
    tinyassert(name);
    return {
      id: SERVER_REFERENCE_PREFIX + id + cacheTag,
      name,
      chunks: [],
      async: true
    };
  } });
}
function createClientManifest(options) {
  const cacheTag = "";
  return new Proxy({}, { get(_target, $$id, _receiver) {
    tinyassert(typeof $$id === "string");
    let [id, name] = $$id.split("#");
    tinyassert(id);
    tinyassert(name);
    options?.onClientReference?.({
      id,
      name
    });
    return {
      id: id + cacheTag,
      name,
      chunks: [],
      async: true
    };
  } });
}
var client_edge = { exports: {} };
var reactServerDomWebpackClient_edge_production = {};
var hasRequiredReactServerDomWebpackClient_edge_production;
function requireReactServerDomWebpackClient_edge_production() {
  if (hasRequiredReactServerDomWebpackClient_edge_production) return reactServerDomWebpackClient_edge_production;
  hasRequiredReactServerDomWebpackClient_edge_production = 1;
  var ReactDOM = requireReactDom_reactServer(), decoderOptions = { stream: true }, hasOwnProperty = Object.prototype.hasOwnProperty;
  function resolveClientReference(bundlerConfig, metadata) {
    if (bundlerConfig) {
      var moduleExports = bundlerConfig[metadata[0]];
      if (bundlerConfig = moduleExports && moduleExports[metadata[2]])
        moduleExports = bundlerConfig.name;
      else {
        bundlerConfig = moduleExports && moduleExports["*"];
        if (!bundlerConfig)
          throw Error(
            'Could not find the module "' + metadata[0] + '" in the React Server Consumer Manifest. This is probably a bug in the React Server Components bundler.'
          );
        moduleExports = metadata[2];
      }
      return 4 === metadata.length ? [bundlerConfig.id, bundlerConfig.chunks, moduleExports, 1] : [bundlerConfig.id, bundlerConfig.chunks, moduleExports];
    }
    return metadata;
  }
  function resolveServerReference(bundlerConfig, id) {
    var name = "", resolvedModuleData = bundlerConfig[id];
    if (resolvedModuleData) name = resolvedModuleData.name;
    else {
      var idx = id.lastIndexOf("#");
      -1 !== idx && (name = id.slice(idx + 1), resolvedModuleData = bundlerConfig[id.slice(0, idx)]);
      if (!resolvedModuleData)
        throw Error(
          'Could not find the module "' + id + '" in the React Server Manifest. This is probably a bug in the React Server Components bundler.'
        );
    }
    return resolvedModuleData.async ? [resolvedModuleData.id, resolvedModuleData.chunks, name, 1] : [resolvedModuleData.id, resolvedModuleData.chunks, name];
  }
  var chunkCache = /* @__PURE__ */ new Map();
  function requireAsyncModule(id) {
    var promise = __vite_rsc_require__(id);
    if ("function" !== typeof promise.then || "fulfilled" === promise.status)
      return null;
    promise.then(
      function(value) {
        promise.status = "fulfilled";
        promise.value = value;
      },
      function(reason) {
        promise.status = "rejected";
        promise.reason = reason;
      }
    );
    return promise;
  }
  function ignoreReject() {
  }
  function preloadModule(metadata) {
    for (var chunks = metadata[1], promises = [], i = 0; i < chunks.length; ) {
      var chunkId = chunks[i++];
      chunks[i++];
      var entry = chunkCache.get(chunkId);
      if (void 0 === entry) {
        entry = __webpack_chunk_load__(chunkId);
        promises.push(entry);
        var resolve = chunkCache.set.bind(chunkCache, chunkId, null);
        entry.then(resolve, ignoreReject);
        chunkCache.set(chunkId, entry);
      } else null !== entry && promises.push(entry);
    }
    return 4 === metadata.length ? 0 === promises.length ? requireAsyncModule(metadata[0]) : Promise.all(promises).then(function() {
      return requireAsyncModule(metadata[0]);
    }) : 0 < promises.length ? Promise.all(promises) : null;
  }
  function requireModule2(metadata) {
    var moduleExports = __vite_rsc_require__(metadata[0]);
    if (4 === metadata.length && "function" === typeof moduleExports.then)
      if ("fulfilled" === moduleExports.status)
        moduleExports = moduleExports.value;
      else throw moduleExports.reason;
    if ("*" === metadata[2]) return moduleExports;
    if ("" === metadata[2])
      return moduleExports.__esModule ? moduleExports.default : moduleExports;
    if (hasOwnProperty.call(moduleExports, metadata[2]))
      return moduleExports[metadata[2]];
  }
  function prepareDestinationWithChunks(moduleLoading, chunks, nonce$jscomp$0) {
    if (null !== moduleLoading)
      for (var i = 1; i < chunks.length; i += 2) {
        var nonce = nonce$jscomp$0, JSCompiler_temp_const = ReactDOMSharedInternals.d, JSCompiler_temp_const$jscomp$0 = JSCompiler_temp_const.X, JSCompiler_temp_const$jscomp$1 = moduleLoading.prefix + chunks[i];
        var JSCompiler_inline_result = moduleLoading.crossOrigin;
        JSCompiler_inline_result = "string" === typeof JSCompiler_inline_result ? "use-credentials" === JSCompiler_inline_result ? JSCompiler_inline_result : "" : void 0;
        JSCompiler_temp_const$jscomp$0.call(
          JSCompiler_temp_const,
          JSCompiler_temp_const$jscomp$1,
          { crossOrigin: JSCompiler_inline_result, nonce }
        );
      }
  }
  var ReactDOMSharedInternals = ReactDOM.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
  function getIteratorFn(maybeIterable) {
    if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
    maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
    return "function" === typeof maybeIterable ? maybeIterable : null;
  }
  var ASYNC_ITERATOR = Symbol.asyncIterator, isArrayImpl = Array.isArray, getPrototypeOf = Object.getPrototypeOf, ObjectPrototype = Object.prototype, knownServerReferences = /* @__PURE__ */ new WeakMap();
  function serializeNumber(number) {
    return Number.isFinite(number) ? 0 === number && -Infinity === 1 / number ? "$-0" : number : Infinity === number ? "$Infinity" : -Infinity === number ? "$-Infinity" : "$NaN";
  }
  function processReply(root, formFieldPrefix, temporaryReferences, resolve, reject) {
    function serializeTypedArray(tag, typedArray) {
      typedArray = new Blob([
        new Uint8Array(
          typedArray.buffer,
          typedArray.byteOffset,
          typedArray.byteLength
        )
      ]);
      var blobId = nextPartId++;
      null === formData && (formData = new FormData());
      formData.append(formFieldPrefix + blobId, typedArray);
      return "$" + tag + blobId.toString(16);
    }
    function serializeBinaryReader(reader) {
      function progress(entry) {
        entry.done ? (entry = nextPartId++, data2.append(formFieldPrefix + entry, new Blob(buffer)), data2.append(
          formFieldPrefix + streamId,
          '"$o' + entry.toString(16) + '"'
        ), data2.append(formFieldPrefix + streamId, "C"), pendingParts--, 0 === pendingParts && resolve(data2)) : (buffer.push(entry.value), reader.read(new Uint8Array(1024)).then(progress, reject));
      }
      null === formData && (formData = new FormData());
      var data2 = formData;
      pendingParts++;
      var streamId = nextPartId++, buffer = [];
      reader.read(new Uint8Array(1024)).then(progress, reject);
      return "$r" + streamId.toString(16);
    }
    function serializeReader(reader) {
      function progress(entry) {
        if (entry.done)
          data2.append(formFieldPrefix + streamId, "C"), pendingParts--, 0 === pendingParts && resolve(data2);
        else
          try {
            var partJSON = JSON.stringify(entry.value, resolveToJSON);
            data2.append(formFieldPrefix + streamId, partJSON);
            reader.read().then(progress, reject);
          } catch (x) {
            reject(x);
          }
      }
      null === formData && (formData = new FormData());
      var data2 = formData;
      pendingParts++;
      var streamId = nextPartId++;
      reader.read().then(progress, reject);
      return "$R" + streamId.toString(16);
    }
    function serializeReadableStream(stream) {
      try {
        var binaryReader = stream.getReader({ mode: "byob" });
      } catch (x) {
        return serializeReader(stream.getReader());
      }
      return serializeBinaryReader(binaryReader);
    }
    function serializeAsyncIterable(iterable, iterator) {
      function progress(entry) {
        if (entry.done) {
          if (void 0 === entry.value)
            data2.append(formFieldPrefix + streamId, "C");
          else
            try {
              var partJSON = JSON.stringify(entry.value, resolveToJSON);
              data2.append(formFieldPrefix + streamId, "C" + partJSON);
            } catch (x) {
              reject(x);
              return;
            }
          pendingParts--;
          0 === pendingParts && resolve(data2);
        } else
          try {
            var partJSON$21 = JSON.stringify(entry.value, resolveToJSON);
            data2.append(formFieldPrefix + streamId, partJSON$21);
            iterator.next().then(progress, reject);
          } catch (x$22) {
            reject(x$22);
          }
      }
      null === formData && (formData = new FormData());
      var data2 = formData;
      pendingParts++;
      var streamId = nextPartId++;
      iterable = iterable === iterator;
      iterator.next().then(progress, reject);
      return "$" + (iterable ? "x" : "X") + streamId.toString(16);
    }
    function resolveToJSON(key, value) {
      if (null === value) return null;
      if ("object" === typeof value) {
        switch (value.$$typeof) {
          case REACT_ELEMENT_TYPE:
            if (void 0 !== temporaryReferences && -1 === key.indexOf(":")) {
              var parentReference = writtenObjects.get(this);
              if (void 0 !== parentReference)
                return temporaryReferences.set(parentReference + ":" + key, value), "$T";
            }
            throw Error(
              "React Element cannot be passed to Server Functions from the Client without a temporary reference set. Pass a TemporaryReferenceSet to the options."
            );
          case REACT_LAZY_TYPE:
            parentReference = value._payload;
            var init2 = value._init;
            null === formData && (formData = new FormData());
            pendingParts++;
            try {
              var resolvedModel = init2(parentReference), lazyId = nextPartId++, partJSON = serializeModel(resolvedModel, lazyId);
              formData.append(formFieldPrefix + lazyId, partJSON);
              return "$" + lazyId.toString(16);
            } catch (x) {
              if ("object" === typeof x && null !== x && "function" === typeof x.then) {
                pendingParts++;
                var lazyId$23 = nextPartId++;
                parentReference = function() {
                  try {
                    var partJSON$24 = serializeModel(value, lazyId$23), data$25 = formData;
                    data$25.append(formFieldPrefix + lazyId$23, partJSON$24);
                    pendingParts--;
                    0 === pendingParts && resolve(data$25);
                  } catch (reason) {
                    reject(reason);
                  }
                };
                x.then(parentReference, parentReference);
                return "$" + lazyId$23.toString(16);
              }
              reject(x);
              return null;
            } finally {
              pendingParts--;
            }
        }
        parentReference = writtenObjects.get(value);
        if ("function" === typeof value.then) {
          if (void 0 !== parentReference)
            if (modelRoot === value) modelRoot = null;
            else return parentReference;
          null === formData && (formData = new FormData());
          pendingParts++;
          var promiseId = nextPartId++;
          key = "$@" + promiseId.toString(16);
          writtenObjects.set(value, key);
          value.then(function(partValue) {
            try {
              var previousReference = writtenObjects.get(partValue);
              var partJSON$27 = void 0 !== previousReference ? JSON.stringify(previousReference) : serializeModel(partValue, promiseId);
              partValue = formData;
              partValue.append(formFieldPrefix + promiseId, partJSON$27);
              pendingParts--;
              0 === pendingParts && resolve(partValue);
            } catch (reason) {
              reject(reason);
            }
          }, reject);
          return key;
        }
        if (void 0 !== parentReference)
          if (modelRoot === value) modelRoot = null;
          else return parentReference;
        else
          -1 === key.indexOf(":") && (parentReference = writtenObjects.get(this), void 0 !== parentReference && (key = parentReference + ":" + key, writtenObjects.set(value, key), void 0 !== temporaryReferences && temporaryReferences.set(key, value)));
        if (isArrayImpl(value)) return value;
        if (value instanceof FormData) {
          null === formData && (formData = new FormData());
          var data$31 = formData;
          key = nextPartId++;
          var prefix = formFieldPrefix + key + "_";
          value.forEach(function(originalValue, originalKey) {
            data$31.append(prefix + originalKey, originalValue);
          });
          return "$K" + key.toString(16);
        }
        if (value instanceof Map)
          return key = nextPartId++, parentReference = serializeModel(Array.from(value), key), null === formData && (formData = new FormData()), formData.append(formFieldPrefix + key, parentReference), "$Q" + key.toString(16);
        if (value instanceof Set)
          return key = nextPartId++, parentReference = serializeModel(Array.from(value), key), null === formData && (formData = new FormData()), formData.append(formFieldPrefix + key, parentReference), "$W" + key.toString(16);
        if (value instanceof ArrayBuffer)
          return key = new Blob([value]), parentReference = nextPartId++, null === formData && (formData = new FormData()), formData.append(formFieldPrefix + parentReference, key), "$A" + parentReference.toString(16);
        if (value instanceof Int8Array) return serializeTypedArray("O", value);
        if (value instanceof Uint8Array) return serializeTypedArray("o", value);
        if (value instanceof Uint8ClampedArray)
          return serializeTypedArray("U", value);
        if (value instanceof Int16Array) return serializeTypedArray("S", value);
        if (value instanceof Uint16Array) return serializeTypedArray("s", value);
        if (value instanceof Int32Array) return serializeTypedArray("L", value);
        if (value instanceof Uint32Array) return serializeTypedArray("l", value);
        if (value instanceof Float32Array) return serializeTypedArray("G", value);
        if (value instanceof Float64Array) return serializeTypedArray("g", value);
        if (value instanceof BigInt64Array)
          return serializeTypedArray("M", value);
        if (value instanceof BigUint64Array)
          return serializeTypedArray("m", value);
        if (value instanceof DataView) return serializeTypedArray("V", value);
        if ("function" === typeof Blob && value instanceof Blob)
          return null === formData && (formData = new FormData()), key = nextPartId++, formData.append(formFieldPrefix + key, value), "$B" + key.toString(16);
        if (key = getIteratorFn(value))
          return parentReference = key.call(value), parentReference === value ? (key = nextPartId++, parentReference = serializeModel(
            Array.from(parentReference),
            key
          ), null === formData && (formData = new FormData()), formData.append(formFieldPrefix + key, parentReference), "$i" + key.toString(16)) : Array.from(parentReference);
        if ("function" === typeof ReadableStream && value instanceof ReadableStream)
          return serializeReadableStream(value);
        key = value[ASYNC_ITERATOR];
        if ("function" === typeof key)
          return serializeAsyncIterable(value, key.call(value));
        key = getPrototypeOf(value);
        if (key !== ObjectPrototype && (null === key || null !== getPrototypeOf(key))) {
          if (void 0 === temporaryReferences)
            throw Error(
              "Only plain objects, and a few built-ins, can be passed to Server Functions. Classes or null prototypes are not supported."
            );
          return "$T";
        }
        return value;
      }
      if ("string" === typeof value) {
        if ("Z" === value[value.length - 1] && this[key] instanceof Date)
          return "$D" + value;
        key = "$" === value[0] ? "$" + value : value;
        return key;
      }
      if ("boolean" === typeof value) return value;
      if ("number" === typeof value) return serializeNumber(value);
      if ("undefined" === typeof value) return "$undefined";
      if ("function" === typeof value) {
        parentReference = knownServerReferences.get(value);
        if (void 0 !== parentReference) {
          key = writtenObjects.get(value);
          if (void 0 !== key) return key;
          key = JSON.stringify(
            { id: parentReference.id, bound: parentReference.bound },
            resolveToJSON
          );
          null === formData && (formData = new FormData());
          parentReference = nextPartId++;
          formData.set(formFieldPrefix + parentReference, key);
          key = "$h" + parentReference.toString(16);
          writtenObjects.set(value, key);
          return key;
        }
        if (void 0 !== temporaryReferences && -1 === key.indexOf(":") && (parentReference = writtenObjects.get(this), void 0 !== parentReference))
          return temporaryReferences.set(parentReference + ":" + key, value), "$T";
        throw Error(
          "Client Functions cannot be passed directly to Server Functions. Only Functions passed from the Server can be passed back again."
        );
      }
      if ("symbol" === typeof value) {
        if (void 0 !== temporaryReferences && -1 === key.indexOf(":") && (parentReference = writtenObjects.get(this), void 0 !== parentReference))
          return temporaryReferences.set(parentReference + ":" + key, value), "$T";
        throw Error(
          "Symbols cannot be passed to a Server Function without a temporary reference set. Pass a TemporaryReferenceSet to the options."
        );
      }
      if ("bigint" === typeof value) return "$n" + value.toString(10);
      throw Error(
        "Type " + typeof value + " is not supported as an argument to a Server Function."
      );
    }
    function serializeModel(model, id) {
      "object" === typeof model && null !== model && (id = "$" + id.toString(16), writtenObjects.set(model, id), void 0 !== temporaryReferences && temporaryReferences.set(id, model));
      modelRoot = model;
      return JSON.stringify(model, resolveToJSON);
    }
    var nextPartId = 1, pendingParts = 0, formData = null, writtenObjects = /* @__PURE__ */ new WeakMap(), modelRoot = root, json = serializeModel(root, 0);
    null === formData ? resolve(json) : (formData.set(formFieldPrefix + "0", json), 0 === pendingParts && resolve(formData));
    return function() {
      0 < pendingParts && (pendingParts = 0, null === formData ? resolve(json) : resolve(formData));
    };
  }
  var boundCache = /* @__PURE__ */ new WeakMap();
  function encodeFormData(reference) {
    var resolve, reject, thenable = new Promise(function(res, rej) {
      resolve = res;
      reject = rej;
    });
    processReply(
      reference,
      "",
      void 0,
      function(body) {
        if ("string" === typeof body) {
          var data2 = new FormData();
          data2.append("0", body);
          body = data2;
        }
        thenable.status = "fulfilled";
        thenable.value = body;
        resolve(body);
      },
      function(e) {
        thenable.status = "rejected";
        thenable.reason = e;
        reject(e);
      }
    );
    return thenable;
  }
  function defaultEncodeFormAction(identifierPrefix) {
    var referenceClosure = knownServerReferences.get(this);
    if (!referenceClosure)
      throw Error(
        "Tried to encode a Server Action from a different instance than the encoder is from. This is a bug in React."
      );
    var data2 = null;
    if (null !== referenceClosure.bound) {
      data2 = boundCache.get(referenceClosure);
      data2 || (data2 = encodeFormData({
        id: referenceClosure.id,
        bound: referenceClosure.bound
      }), boundCache.set(referenceClosure, data2));
      if ("rejected" === data2.status) throw data2.reason;
      if ("fulfilled" !== data2.status) throw data2;
      referenceClosure = data2.value;
      var prefixedData = new FormData();
      referenceClosure.forEach(function(value, key) {
        prefixedData.append("$ACTION_" + identifierPrefix + ":" + key, value);
      });
      data2 = prefixedData;
      referenceClosure = "$ACTION_REF_" + identifierPrefix;
    } else referenceClosure = "$ACTION_ID_" + referenceClosure.id;
    return {
      name: referenceClosure,
      method: "POST",
      encType: "multipart/form-data",
      data: data2
    };
  }
  function isSignatureEqual(referenceId, numberOfBoundArgs) {
    var referenceClosure = knownServerReferences.get(this);
    if (!referenceClosure)
      throw Error(
        "Tried to encode a Server Action from a different instance than the encoder is from. This is a bug in React."
      );
    if (referenceClosure.id !== referenceId) return false;
    var boundPromise = referenceClosure.bound;
    if (null === boundPromise) return 0 === numberOfBoundArgs;
    switch (boundPromise.status) {
      case "fulfilled":
        return boundPromise.value.length === numberOfBoundArgs;
      case "pending":
        throw boundPromise;
      case "rejected":
        throw boundPromise.reason;
      default:
        throw "string" !== typeof boundPromise.status && (boundPromise.status = "pending", boundPromise.then(
          function(boundArgs) {
            boundPromise.status = "fulfilled";
            boundPromise.value = boundArgs;
          },
          function(error) {
            boundPromise.status = "rejected";
            boundPromise.reason = error;
          }
        )), boundPromise;
    }
  }
  function registerBoundServerReference(reference, id, bound, encodeFormAction) {
    knownServerReferences.has(reference) || (knownServerReferences.set(reference, {
      id,
      originalBind: reference.bind,
      bound
    }), Object.defineProperties(reference, {
      $$FORM_ACTION: {
        value: void 0 === encodeFormAction ? defaultEncodeFormAction : function() {
          var referenceClosure = knownServerReferences.get(this);
          if (!referenceClosure)
            throw Error(
              "Tried to encode a Server Action from a different instance than the encoder is from. This is a bug in React."
            );
          var boundPromise = referenceClosure.bound;
          null === boundPromise && (boundPromise = Promise.resolve([]));
          return encodeFormAction(referenceClosure.id, boundPromise);
        }
      },
      $$IS_SIGNATURE_EQUAL: { value: isSignatureEqual },
      bind: { value: bind }
    }));
  }
  var FunctionBind = Function.prototype.bind, ArraySlice = Array.prototype.slice;
  function bind() {
    var referenceClosure = knownServerReferences.get(this);
    if (!referenceClosure) return FunctionBind.apply(this, arguments);
    var newFn = referenceClosure.originalBind.apply(this, arguments), args = ArraySlice.call(arguments, 1), boundPromise = null;
    boundPromise = null !== referenceClosure.bound ? Promise.resolve(referenceClosure.bound).then(function(boundArgs) {
      return boundArgs.concat(args);
    }) : Promise.resolve(args);
    knownServerReferences.set(newFn, {
      id: referenceClosure.id,
      originalBind: newFn.bind,
      bound: boundPromise
    });
    Object.defineProperties(newFn, {
      $$FORM_ACTION: { value: this.$$FORM_ACTION },
      $$IS_SIGNATURE_EQUAL: { value: isSignatureEqual },
      bind: { value: bind }
    });
    return newFn;
  }
  function createBoundServerReference(metaData, callServer, encodeFormAction) {
    function action() {
      var args = Array.prototype.slice.call(arguments);
      return bound ? "fulfilled" === bound.status ? callServer(id, bound.value.concat(args)) : Promise.resolve(bound).then(function(boundArgs) {
        return callServer(id, boundArgs.concat(args));
      }) : callServer(id, args);
    }
    var id = metaData.id, bound = metaData.bound;
    registerBoundServerReference(action, id, bound, encodeFormAction);
    return action;
  }
  function createServerReference$1(id, callServer, encodeFormAction) {
    function action() {
      var args = Array.prototype.slice.call(arguments);
      return callServer(id, args);
    }
    registerBoundServerReference(action, id, null, encodeFormAction);
    return action;
  }
  function ReactPromise(status, value, reason) {
    this.status = status;
    this.value = value;
    this.reason = reason;
  }
  ReactPromise.prototype = Object.create(Promise.prototype);
  ReactPromise.prototype.then = function(resolve, reject) {
    switch (this.status) {
      case "resolved_model":
        initializeModelChunk(this);
        break;
      case "resolved_module":
        initializeModuleChunk(this);
    }
    switch (this.status) {
      case "fulfilled":
        "function" === typeof resolve && resolve(this.value);
        break;
      case "pending":
      case "blocked":
        "function" === typeof resolve && (null === this.value && (this.value = []), this.value.push(resolve));
        "function" === typeof reject && (null === this.reason && (this.reason = []), this.reason.push(reject));
        break;
      case "halted":
        break;
      default:
        "function" === typeof reject && reject(this.reason);
    }
  };
  function readChunk(chunk) {
    switch (chunk.status) {
      case "resolved_model":
        initializeModelChunk(chunk);
        break;
      case "resolved_module":
        initializeModuleChunk(chunk);
    }
    switch (chunk.status) {
      case "fulfilled":
        return chunk.value;
      case "pending":
      case "blocked":
      case "halted":
        throw chunk;
      default:
        throw chunk.reason;
    }
  }
  function wakeChunk(listeners, value, chunk) {
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      "function" === typeof listener ? listener(value) : fulfillReference(listener, value);
    }
  }
  function rejectChunk(listeners, error) {
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      "function" === typeof listener ? listener(error) : rejectReference(listener, error);
    }
  }
  function resolveBlockedCycle(resolvedChunk, reference) {
    var referencedChunk = reference.handler.chunk;
    if (null === referencedChunk) return null;
    if (referencedChunk === resolvedChunk) return reference.handler;
    reference = referencedChunk.value;
    if (null !== reference)
      for (referencedChunk = 0; referencedChunk < reference.length; referencedChunk++) {
        var listener = reference[referencedChunk];
        if ("function" !== typeof listener && (listener = resolveBlockedCycle(resolvedChunk, listener), null !== listener))
          return listener;
      }
    return null;
  }
  function wakeChunkIfInitialized(chunk, resolveListeners, rejectListeners) {
    switch (chunk.status) {
      case "fulfilled":
        wakeChunk(resolveListeners, chunk.value);
        break;
      case "blocked":
        for (var i = 0; i < resolveListeners.length; i++) {
          var listener = resolveListeners[i];
          if ("function" !== typeof listener) {
            var cyclicHandler = resolveBlockedCycle(chunk, listener);
            if (null !== cyclicHandler)
              switch (fulfillReference(listener, cyclicHandler.value), resolveListeners.splice(i, 1), i--, null !== rejectListeners && (listener = rejectListeners.indexOf(listener), -1 !== listener && rejectListeners.splice(listener, 1)), chunk.status) {
                case "fulfilled":
                  wakeChunk(resolveListeners, chunk.value);
                  return;
                case "rejected":
                  null !== rejectListeners && rejectChunk(rejectListeners, chunk.reason);
                  return;
              }
          }
        }
      case "pending":
        if (chunk.value)
          for (i = 0; i < resolveListeners.length; i++)
            chunk.value.push(resolveListeners[i]);
        else chunk.value = resolveListeners;
        if (chunk.reason) {
          if (rejectListeners)
            for (resolveListeners = 0; resolveListeners < rejectListeners.length; resolveListeners++)
              chunk.reason.push(rejectListeners[resolveListeners]);
        } else chunk.reason = rejectListeners;
        break;
      case "rejected":
        rejectListeners && rejectChunk(rejectListeners, chunk.reason);
    }
  }
  function triggerErrorOnChunk(response, chunk, error) {
    "pending" !== chunk.status && "blocked" !== chunk.status ? chunk.reason.error(error) : (response = chunk.reason, chunk.status = "rejected", chunk.reason = error, null !== response && rejectChunk(response, error));
  }
  function createResolvedIteratorResultChunk(response, value, done) {
    return new ReactPromise(
      "resolved_model",
      (done ? '{"done":true,"value":' : '{"done":false,"value":') + value + "}",
      response
    );
  }
  function resolveIteratorResultChunk(response, chunk, value, done) {
    resolveModelChunk(
      response,
      chunk,
      (done ? '{"done":true,"value":' : '{"done":false,"value":') + value + "}"
    );
  }
  function resolveModelChunk(response, chunk, value) {
    if ("pending" !== chunk.status) chunk.reason.enqueueModel(value);
    else {
      var resolveListeners = chunk.value, rejectListeners = chunk.reason;
      chunk.status = "resolved_model";
      chunk.value = value;
      chunk.reason = response;
      null !== resolveListeners && (initializeModelChunk(chunk), wakeChunkIfInitialized(chunk, resolveListeners, rejectListeners));
    }
  }
  function resolveModuleChunk(response, chunk, value) {
    if ("pending" === chunk.status || "blocked" === chunk.status) {
      response = chunk.value;
      var rejectListeners = chunk.reason;
      chunk.status = "resolved_module";
      chunk.value = value;
      chunk.reason = null;
      null !== response && (initializeModuleChunk(chunk), wakeChunkIfInitialized(chunk, response, rejectListeners));
    }
  }
  var initializingHandler = null;
  function initializeModelChunk(chunk) {
    var prevHandler = initializingHandler;
    initializingHandler = null;
    var resolvedModel = chunk.value, response = chunk.reason;
    chunk.status = "blocked";
    chunk.value = null;
    chunk.reason = null;
    try {
      var value = JSON.parse(resolvedModel, response._fromJSON), resolveListeners = chunk.value;
      if (null !== resolveListeners)
        for (chunk.value = null, chunk.reason = null, resolvedModel = 0; resolvedModel < resolveListeners.length; resolvedModel++) {
          var listener = resolveListeners[resolvedModel];
          "function" === typeof listener ? listener(value) : fulfillReference(listener, value, chunk);
        }
      if (null !== initializingHandler) {
        if (initializingHandler.errored) throw initializingHandler.reason;
        if (0 < initializingHandler.deps) {
          initializingHandler.value = value;
          initializingHandler.chunk = chunk;
          return;
        }
      }
      chunk.status = "fulfilled";
      chunk.value = value;
    } catch (error) {
      chunk.status = "rejected", chunk.reason = error;
    } finally {
      initializingHandler = prevHandler;
    }
  }
  function initializeModuleChunk(chunk) {
    try {
      var value = requireModule2(chunk.value);
      chunk.status = "fulfilled";
      chunk.value = value;
    } catch (error) {
      chunk.status = "rejected", chunk.reason = error;
    }
  }
  function reportGlobalError(weakResponse, error) {
    weakResponse._closed = true;
    weakResponse._closedReason = error;
    weakResponse._chunks.forEach(function(chunk) {
      "pending" === chunk.status ? triggerErrorOnChunk(weakResponse, chunk, error) : "fulfilled" === chunk.status && null !== chunk.reason && chunk.reason.error(error);
    });
  }
  function createLazyChunkWrapper(chunk) {
    return { $$typeof: REACT_LAZY_TYPE, _payload: chunk, _init: readChunk };
  }
  function getChunk(response, id) {
    var chunks = response._chunks, chunk = chunks.get(id);
    chunk || (chunk = response._closed ? new ReactPromise("rejected", null, response._closedReason) : new ReactPromise("pending", null, null), chunks.set(id, chunk));
    return chunk;
  }
  function fulfillReference(reference, value) {
    var response = reference.response, handler = reference.handler, parentObject = reference.parentObject, key = reference.key, map = reference.map, path = reference.path;
    try {
      for (var i = 1; i < path.length; i++) {
        for (; "object" === typeof value && null !== value && value.$$typeof === REACT_LAZY_TYPE; ) {
          var referencedChunk = value._payload;
          if (referencedChunk === handler.chunk) value = handler.value;
          else {
            switch (referencedChunk.status) {
              case "resolved_model":
                initializeModelChunk(referencedChunk);
                break;
              case "resolved_module":
                initializeModuleChunk(referencedChunk);
            }
            switch (referencedChunk.status) {
              case "fulfilled":
                value = referencedChunk.value;
                continue;
              case "blocked":
                var cyclicHandler = resolveBlockedCycle(
                  referencedChunk,
                  reference
                );
                if (null !== cyclicHandler) {
                  value = cyclicHandler.value;
                  continue;
                }
              case "pending":
                path.splice(0, i - 1);
                null === referencedChunk.value ? referencedChunk.value = [reference] : referencedChunk.value.push(reference);
                null === referencedChunk.reason ? referencedChunk.reason = [reference] : referencedChunk.reason.push(reference);
                return;
              case "halted":
                return;
              default:
                rejectReference(reference, referencedChunk.reason);
                return;
            }
          }
        }
        var name = path[i];
        if ("object" === typeof value && null !== value && hasOwnProperty.call(value, name))
          value = value[name];
        else throw Error("Invalid reference.");
      }
      for (; "object" === typeof value && null !== value && value.$$typeof === REACT_LAZY_TYPE; ) {
        var referencedChunk$44 = value._payload;
        if (referencedChunk$44 === handler.chunk) value = handler.value;
        else {
          switch (referencedChunk$44.status) {
            case "resolved_model":
              initializeModelChunk(referencedChunk$44);
              break;
            case "resolved_module":
              initializeModuleChunk(referencedChunk$44);
          }
          switch (referencedChunk$44.status) {
            case "fulfilled":
              value = referencedChunk$44.value;
              continue;
          }
          break;
        }
      }
      var mappedValue = map(response, value, parentObject, key);
      "__proto__" !== key && (parentObject[key] = mappedValue);
      "" === key && null === handler.value && (handler.value = mappedValue);
      if (parentObject[0] === REACT_ELEMENT_TYPE && "object" === typeof handler.value && null !== handler.value && handler.value.$$typeof === REACT_ELEMENT_TYPE) {
        var element = handler.value;
        switch (key) {
          case "3":
            element.props = mappedValue;
        }
      }
    } catch (error) {
      rejectReference(reference, error);
      return;
    }
    handler.deps--;
    0 === handler.deps && (reference = handler.chunk, null !== reference && "blocked" === reference.status && (value = reference.value, reference.status = "fulfilled", reference.value = handler.value, reference.reason = handler.reason, null !== value && wakeChunk(value, handler.value)));
  }
  function rejectReference(reference, error) {
    var handler = reference.handler;
    reference = reference.response;
    handler.errored || (handler.errored = true, handler.value = null, handler.reason = error, handler = handler.chunk, null !== handler && "blocked" === handler.status && triggerErrorOnChunk(reference, handler, error));
  }
  function waitForReference(referencedChunk, parentObject, key, response, map, path) {
    if (initializingHandler) {
      var handler = initializingHandler;
      handler.deps++;
    } else
      handler = initializingHandler = {
        parent: null,
        chunk: null,
        value: null,
        reason: null,
        deps: 1,
        errored: false
      };
    parentObject = {
      response,
      handler,
      parentObject,
      key,
      map,
      path
    };
    null === referencedChunk.value ? referencedChunk.value = [parentObject] : referencedChunk.value.push(parentObject);
    null === referencedChunk.reason ? referencedChunk.reason = [parentObject] : referencedChunk.reason.push(parentObject);
    return null;
  }
  function loadServerReference(response, metaData, parentObject, key) {
    if (!response._serverReferenceConfig)
      return createBoundServerReference(
        metaData,
        response._callServer,
        response._encodeFormAction
      );
    var serverReference = resolveServerReference(
      response._serverReferenceConfig,
      metaData.id
    ), promise = preloadModule(serverReference);
    if (promise)
      metaData.bound && (promise = Promise.all([promise, metaData.bound]));
    else if (metaData.bound) promise = Promise.resolve(metaData.bound);
    else
      return promise = requireModule2(serverReference), registerBoundServerReference(
        promise,
        metaData.id,
        metaData.bound,
        response._encodeFormAction
      ), promise;
    if (initializingHandler) {
      var handler = initializingHandler;
      handler.deps++;
    } else
      handler = initializingHandler = {
        parent: null,
        chunk: null,
        value: null,
        reason: null,
        deps: 1,
        errored: false
      };
    promise.then(
      function() {
        var resolvedValue = requireModule2(serverReference);
        if (metaData.bound) {
          var boundArgs = metaData.bound.value.slice(0);
          boundArgs.unshift(null);
          resolvedValue = resolvedValue.bind.apply(resolvedValue, boundArgs);
        }
        registerBoundServerReference(
          resolvedValue,
          metaData.id,
          metaData.bound,
          response._encodeFormAction
        );
        "__proto__" !== key && (parentObject[key] = resolvedValue);
        "" === key && null === handler.value && (handler.value = resolvedValue);
        if (parentObject[0] === REACT_ELEMENT_TYPE && "object" === typeof handler.value && null !== handler.value && handler.value.$$typeof === REACT_ELEMENT_TYPE)
          switch (boundArgs = handler.value, key) {
            case "3":
              boundArgs.props = resolvedValue;
          }
        handler.deps--;
        0 === handler.deps && (resolvedValue = handler.chunk, null !== resolvedValue && "blocked" === resolvedValue.status && (boundArgs = resolvedValue.value, resolvedValue.status = "fulfilled", resolvedValue.value = handler.value, resolvedValue.reason = null, null !== boundArgs && wakeChunk(boundArgs, handler.value)));
      },
      function(error) {
        if (!handler.errored) {
          handler.errored = true;
          handler.value = null;
          handler.reason = error;
          var chunk = handler.chunk;
          null !== chunk && "blocked" === chunk.status && triggerErrorOnChunk(response, chunk, error);
        }
      }
    );
    return null;
  }
  function getOutlinedModel(response, reference, parentObject, key, map) {
    reference = reference.split(":");
    var id = parseInt(reference[0], 16);
    id = getChunk(response, id);
    switch (id.status) {
      case "resolved_model":
        initializeModelChunk(id);
        break;
      case "resolved_module":
        initializeModuleChunk(id);
    }
    switch (id.status) {
      case "fulfilled":
        id = id.value;
        for (var i = 1; i < reference.length; i++) {
          for (; "object" === typeof id && null !== id && id.$$typeof === REACT_LAZY_TYPE; ) {
            id = id._payload;
            switch (id.status) {
              case "resolved_model":
                initializeModelChunk(id);
                break;
              case "resolved_module":
                initializeModuleChunk(id);
            }
            switch (id.status) {
              case "fulfilled":
                id = id.value;
                break;
              case "blocked":
              case "pending":
                return waitForReference(
                  id,
                  parentObject,
                  key,
                  response,
                  map,
                  reference.slice(i - 1)
                );
              case "halted":
                return initializingHandler ? (response = initializingHandler, response.deps++) : initializingHandler = {
                  parent: null,
                  chunk: null,
                  value: null,
                  reason: null,
                  deps: 1,
                  errored: false
                }, null;
              default:
                return initializingHandler ? (initializingHandler.errored = true, initializingHandler.value = null, initializingHandler.reason = id.reason) : initializingHandler = {
                  parent: null,
                  chunk: null,
                  value: null,
                  reason: id.reason,
                  deps: 0,
                  errored: true
                }, null;
            }
          }
          id = id[reference[i]];
        }
        for (; "object" === typeof id && null !== id && id.$$typeof === REACT_LAZY_TYPE; ) {
          reference = id._payload;
          switch (reference.status) {
            case "resolved_model":
              initializeModelChunk(reference);
              break;
            case "resolved_module":
              initializeModuleChunk(reference);
          }
          switch (reference.status) {
            case "fulfilled":
              id = reference.value;
              continue;
          }
          break;
        }
        return map(response, id, parentObject, key);
      case "pending":
      case "blocked":
        return waitForReference(id, parentObject, key, response, map, reference);
      case "halted":
        return initializingHandler ? (response = initializingHandler, response.deps++) : initializingHandler = {
          parent: null,
          chunk: null,
          value: null,
          reason: null,
          deps: 1,
          errored: false
        }, null;
      default:
        return initializingHandler ? (initializingHandler.errored = true, initializingHandler.value = null, initializingHandler.reason = id.reason) : initializingHandler = {
          parent: null,
          chunk: null,
          value: null,
          reason: id.reason,
          deps: 0,
          errored: true
        }, null;
    }
  }
  function createMap(response, model) {
    return new Map(model);
  }
  function createSet(response, model) {
    return new Set(model);
  }
  function createBlob(response, model) {
    return new Blob(model.slice(1), { type: model[0] });
  }
  function createFormData(response, model) {
    response = new FormData();
    for (var i = 0; i < model.length; i++)
      response.append(model[i][0], model[i][1]);
    return response;
  }
  function extractIterator(response, model) {
    return model[Symbol.iterator]();
  }
  function createModel(response, model) {
    return model;
  }
  function parseModelString(response, parentObject, key, value) {
    if ("$" === value[0]) {
      if ("$" === value)
        return null !== initializingHandler && "0" === key && (initializingHandler = {
          parent: initializingHandler,
          chunk: null,
          value: null,
          reason: null,
          deps: 0,
          errored: false
        }), REACT_ELEMENT_TYPE;
      switch (value[1]) {
        case "$":
          return value.slice(1);
        case "L":
          return parentObject = parseInt(value.slice(2), 16), response = getChunk(response, parentObject), createLazyChunkWrapper(response);
        case "@":
          return parentObject = parseInt(value.slice(2), 16), getChunk(response, parentObject);
        case "S":
          return Symbol.for(value.slice(2));
        case "h":
          return value = value.slice(2), getOutlinedModel(
            response,
            value,
            parentObject,
            key,
            loadServerReference
          );
        case "T":
          parentObject = "$" + value.slice(2);
          response = response._tempRefs;
          if (null == response)
            throw Error(
              "Missing a temporary reference set but the RSC response returned a temporary reference. Pass a temporaryReference option with the set that was used with the reply."
            );
          return response.get(parentObject);
        case "Q":
          return value = value.slice(2), getOutlinedModel(response, value, parentObject, key, createMap);
        case "W":
          return value = value.slice(2), getOutlinedModel(response, value, parentObject, key, createSet);
        case "B":
          return value = value.slice(2), getOutlinedModel(response, value, parentObject, key, createBlob);
        case "K":
          return value = value.slice(2), getOutlinedModel(response, value, parentObject, key, createFormData);
        case "Z":
          return resolveErrorProd();
        case "i":
          return value = value.slice(2), getOutlinedModel(response, value, parentObject, key, extractIterator);
        case "I":
          return Infinity;
        case "-":
          return "$-0" === value ? -0 : -Infinity;
        case "N":
          return NaN;
        case "u":
          return;
        case "D":
          return new Date(Date.parse(value.slice(2)));
        case "n":
          return BigInt(value.slice(2));
        default:
          return value = value.slice(1), getOutlinedModel(response, value, parentObject, key, createModel);
      }
    }
    return value;
  }
  function missingCall() {
    throw Error(
      'Trying to call a function from "use server" but the callServer option was not implemented in your router runtime.'
    );
  }
  function ResponseInstance(bundlerConfig, serverReferenceConfig, moduleLoading, callServer, encodeFormAction, nonce, temporaryReferences) {
    var chunks = /* @__PURE__ */ new Map();
    this._bundlerConfig = bundlerConfig;
    this._serverReferenceConfig = serverReferenceConfig;
    this._moduleLoading = moduleLoading;
    this._callServer = void 0 !== callServer ? callServer : missingCall;
    this._encodeFormAction = encodeFormAction;
    this._nonce = nonce;
    this._chunks = chunks;
    this._stringDecoder = new TextDecoder();
    this._fromJSON = null;
    this._closed = false;
    this._closedReason = null;
    this._tempRefs = temporaryReferences;
    this._fromJSON = createFromJSONCallback(this);
  }
  function resolveBuffer(response, id, buffer) {
    response = response._chunks;
    var chunk = response.get(id);
    chunk && "pending" !== chunk.status ? chunk.reason.enqueueValue(buffer) : (buffer = new ReactPromise("fulfilled", buffer, null), response.set(id, buffer));
  }
  function resolveModule(response, id, model) {
    var chunks = response._chunks, chunk = chunks.get(id);
    model = JSON.parse(model, response._fromJSON);
    var clientReference = resolveClientReference(response._bundlerConfig, model);
    prepareDestinationWithChunks(
      response._moduleLoading,
      model[1],
      response._nonce
    );
    if (model = preloadModule(clientReference)) {
      if (chunk) {
        var blockedChunk = chunk;
        blockedChunk.status = "blocked";
      } else
        blockedChunk = new ReactPromise("blocked", null, null), chunks.set(id, blockedChunk);
      model.then(
        function() {
          return resolveModuleChunk(response, blockedChunk, clientReference);
        },
        function(error) {
          return triggerErrorOnChunk(response, blockedChunk, error);
        }
      );
    } else
      chunk ? resolveModuleChunk(response, chunk, clientReference) : (chunk = new ReactPromise("resolved_module", clientReference, null), chunks.set(id, chunk));
  }
  function resolveStream(response, id, stream, controller) {
    response = response._chunks;
    var chunk = response.get(id);
    chunk ? "pending" === chunk.status && (id = chunk.value, chunk.status = "fulfilled", chunk.value = stream, chunk.reason = controller, null !== id && wakeChunk(id, chunk.value)) : (stream = new ReactPromise("fulfilled", stream, controller), response.set(id, stream));
  }
  function startReadableStream(response, id, type) {
    var controller = null, closed = false;
    type = new ReadableStream({
      type,
      start: function(c) {
        controller = c;
      }
    });
    var previousBlockedChunk = null;
    resolveStream(response, id, type, {
      enqueueValue: function(value) {
        null === previousBlockedChunk ? controller.enqueue(value) : previousBlockedChunk.then(function() {
          controller.enqueue(value);
        });
      },
      enqueueModel: function(json) {
        if (null === previousBlockedChunk) {
          var chunk = new ReactPromise("resolved_model", json, response);
          initializeModelChunk(chunk);
          "fulfilled" === chunk.status ? controller.enqueue(chunk.value) : (chunk.then(
            function(v) {
              return controller.enqueue(v);
            },
            function(e) {
              return controller.error(e);
            }
          ), previousBlockedChunk = chunk);
        } else {
          chunk = previousBlockedChunk;
          var chunk$55 = new ReactPromise("pending", null, null);
          chunk$55.then(
            function(v) {
              return controller.enqueue(v);
            },
            function(e) {
              return controller.error(e);
            }
          );
          previousBlockedChunk = chunk$55;
          chunk.then(function() {
            previousBlockedChunk === chunk$55 && (previousBlockedChunk = null);
            resolveModelChunk(response, chunk$55, json);
          });
        }
      },
      close: function() {
        if (!closed)
          if (closed = true, null === previousBlockedChunk) controller.close();
          else {
            var blockedChunk = previousBlockedChunk;
            previousBlockedChunk = null;
            blockedChunk.then(function() {
              return controller.close();
            });
          }
      },
      error: function(error) {
        if (!closed)
          if (closed = true, null === previousBlockedChunk)
            controller.error(error);
          else {
            var blockedChunk = previousBlockedChunk;
            previousBlockedChunk = null;
            blockedChunk.then(function() {
              return controller.error(error);
            });
          }
      }
    });
  }
  function asyncIterator() {
    return this;
  }
  function createIterator(next) {
    next = { next };
    next[ASYNC_ITERATOR] = asyncIterator;
    return next;
  }
  function startAsyncIterable(response, id, iterator) {
    var buffer = [], closed = false, nextWriteIndex = 0, iterable = {};
    iterable[ASYNC_ITERATOR] = function() {
      var nextReadIndex = 0;
      return createIterator(function(arg) {
        if (void 0 !== arg)
          throw Error(
            "Values cannot be passed to next() of AsyncIterables passed to Client Components."
          );
        if (nextReadIndex === buffer.length) {
          if (closed)
            return new ReactPromise(
              "fulfilled",
              { done: true, value: void 0 },
              null
            );
          buffer[nextReadIndex] = new ReactPromise("pending", null, null);
        }
        return buffer[nextReadIndex++];
      });
    };
    resolveStream(
      response,
      id,
      iterator ? iterable[ASYNC_ITERATOR]() : iterable,
      {
        enqueueValue: function(value) {
          if (nextWriteIndex === buffer.length)
            buffer[nextWriteIndex] = new ReactPromise(
              "fulfilled",
              { done: false, value },
              null
            );
          else {
            var chunk = buffer[nextWriteIndex], resolveListeners = chunk.value, rejectListeners = chunk.reason;
            chunk.status = "fulfilled";
            chunk.value = { done: false, value };
            chunk.reason = null;
            null !== resolveListeners && wakeChunkIfInitialized(chunk, resolveListeners, rejectListeners);
          }
          nextWriteIndex++;
        },
        enqueueModel: function(value) {
          nextWriteIndex === buffer.length ? buffer[nextWriteIndex] = createResolvedIteratorResultChunk(
            response,
            value,
            false
          ) : resolveIteratorResultChunk(
            response,
            buffer[nextWriteIndex],
            value,
            false
          );
          nextWriteIndex++;
        },
        close: function(value) {
          if (!closed)
            for (closed = true, nextWriteIndex === buffer.length ? buffer[nextWriteIndex] = createResolvedIteratorResultChunk(
              response,
              value,
              true
            ) : resolveIteratorResultChunk(
              response,
              buffer[nextWriteIndex],
              value,
              true
            ), nextWriteIndex++; nextWriteIndex < buffer.length; )
              resolveIteratorResultChunk(
                response,
                buffer[nextWriteIndex++],
                '"$undefined"',
                true
              );
        },
        error: function(error) {
          if (!closed)
            for (closed = true, nextWriteIndex === buffer.length && (buffer[nextWriteIndex] = new ReactPromise(
              "pending",
              null,
              null
            )); nextWriteIndex < buffer.length; )
              triggerErrorOnChunk(response, buffer[nextWriteIndex++], error);
        }
      }
    );
  }
  function resolveErrorProd() {
    var error = Error(
      "An error occurred in the Server Components render. The specific message is omitted in production builds to avoid leaking sensitive details. A digest property is included on this error instance which may provide additional details about the nature of the error."
    );
    error.stack = "Error: " + error.message;
    return error;
  }
  function mergeBuffer(buffer, lastChunk) {
    for (var l = buffer.length, byteLength = lastChunk.length, i = 0; i < l; i++)
      byteLength += buffer[i].byteLength;
    byteLength = new Uint8Array(byteLength);
    for (var i$56 = i = 0; i$56 < l; i$56++) {
      var chunk = buffer[i$56];
      byteLength.set(chunk, i);
      i += chunk.byteLength;
    }
    byteLength.set(lastChunk, i);
    return byteLength;
  }
  function resolveTypedArray(response, id, buffer, lastChunk, constructor, bytesPerElement) {
    buffer = 0 === buffer.length && 0 === lastChunk.byteOffset % bytesPerElement ? lastChunk : mergeBuffer(buffer, lastChunk);
    constructor = new constructor(
      buffer.buffer,
      buffer.byteOffset,
      buffer.byteLength / bytesPerElement
    );
    resolveBuffer(response, id, constructor);
  }
  function processFullBinaryRow(response, streamState, id, tag, buffer, chunk) {
    switch (tag) {
      case 65:
        resolveBuffer(response, id, mergeBuffer(buffer, chunk).buffer);
        return;
      case 79:
        resolveTypedArray(response, id, buffer, chunk, Int8Array, 1);
        return;
      case 111:
        resolveBuffer(
          response,
          id,
          0 === buffer.length ? chunk : mergeBuffer(buffer, chunk)
        );
        return;
      case 85:
        resolveTypedArray(response, id, buffer, chunk, Uint8ClampedArray, 1);
        return;
      case 83:
        resolveTypedArray(response, id, buffer, chunk, Int16Array, 2);
        return;
      case 115:
        resolveTypedArray(response, id, buffer, chunk, Uint16Array, 2);
        return;
      case 76:
        resolveTypedArray(response, id, buffer, chunk, Int32Array, 4);
        return;
      case 108:
        resolveTypedArray(response, id, buffer, chunk, Uint32Array, 4);
        return;
      case 71:
        resolveTypedArray(response, id, buffer, chunk, Float32Array, 4);
        return;
      case 103:
        resolveTypedArray(response, id, buffer, chunk, Float64Array, 8);
        return;
      case 77:
        resolveTypedArray(response, id, buffer, chunk, BigInt64Array, 8);
        return;
      case 109:
        resolveTypedArray(response, id, buffer, chunk, BigUint64Array, 8);
        return;
      case 86:
        resolveTypedArray(response, id, buffer, chunk, DataView, 1);
        return;
    }
    streamState = response._stringDecoder;
    for (var row = "", i = 0; i < buffer.length; i++)
      row += streamState.decode(buffer[i], decoderOptions);
    buffer = row += streamState.decode(chunk);
    switch (tag) {
      case 73:
        resolveModule(response, id, buffer);
        break;
      case 72:
        id = buffer[0];
        buffer = buffer.slice(1);
        response = JSON.parse(buffer, response._fromJSON);
        buffer = ReactDOMSharedInternals.d;
        switch (id) {
          case "D":
            buffer.D(response);
            break;
          case "C":
            "string" === typeof response ? buffer.C(response) : buffer.C(response[0], response[1]);
            break;
          case "L":
            id = response[0];
            tag = response[1];
            3 === response.length ? buffer.L(id, tag, response[2]) : buffer.L(id, tag);
            break;
          case "m":
            "string" === typeof response ? buffer.m(response) : buffer.m(response[0], response[1]);
            break;
          case "X":
            "string" === typeof response ? buffer.X(response) : buffer.X(response[0], response[1]);
            break;
          case "S":
            "string" === typeof response ? buffer.S(response) : buffer.S(
              response[0],
              0 === response[1] ? void 0 : response[1],
              3 === response.length ? response[2] : void 0
            );
            break;
          case "M":
            "string" === typeof response ? buffer.M(response) : buffer.M(response[0], response[1]);
        }
        break;
      case 69:
        tag = response._chunks;
        chunk = tag.get(id);
        buffer = JSON.parse(buffer);
        streamState = resolveErrorProd();
        streamState.digest = buffer.digest;
        chunk ? triggerErrorOnChunk(response, chunk, streamState) : (response = new ReactPromise("rejected", null, streamState), tag.set(id, response));
        break;
      case 84:
        response = response._chunks;
        (tag = response.get(id)) && "pending" !== tag.status ? tag.reason.enqueueValue(buffer) : (buffer = new ReactPromise("fulfilled", buffer, null), response.set(id, buffer));
        break;
      case 78:
      case 68:
      case 74:
      case 87:
        throw Error(
          "Failed to read a RSC payload created by a development version of React on the server while using a production version on the client. Always use matching versions on the server and the client."
        );
      case 82:
        startReadableStream(response, id, void 0);
        break;
      case 114:
        startReadableStream(response, id, "bytes");
        break;
      case 88:
        startAsyncIterable(response, id, false);
        break;
      case 120:
        startAsyncIterable(response, id, true);
        break;
      case 67:
        (id = response._chunks.get(id)) && "fulfilled" === id.status && id.reason.close("" === buffer ? '"$undefined"' : buffer);
        break;
      default:
        tag = response._chunks, (chunk = tag.get(id)) ? resolveModelChunk(response, chunk, buffer) : (response = new ReactPromise("resolved_model", buffer, response), tag.set(id, response));
    }
  }
  function createFromJSONCallback(response) {
    return function(key, value) {
      if ("__proto__" !== key) {
        if ("string" === typeof value)
          return parseModelString(response, this, key, value);
        if ("object" === typeof value && null !== value) {
          if (value[0] === REACT_ELEMENT_TYPE) {
            if (key = {
              $$typeof: REACT_ELEMENT_TYPE,
              type: value[1],
              key: value[2],
              ref: null,
              props: value[3]
            }, null !== initializingHandler) {
              if (value = initializingHandler, initializingHandler = value.parent, value.errored)
                key = new ReactPromise("rejected", null, value.reason), key = createLazyChunkWrapper(key);
              else if (0 < value.deps) {
                var blockedChunk = new ReactPromise("blocked", null, null);
                value.value = key;
                value.chunk = blockedChunk;
                key = createLazyChunkWrapper(blockedChunk);
              }
            }
          } else key = value;
          return key;
        }
        return value;
      }
    };
  }
  function close(weakResponse) {
    reportGlobalError(weakResponse, Error("Connection closed."));
  }
  function noServerCall() {
    throw Error(
      "Server Functions cannot be called during initial render. This would create a fetch waterfall. Try to use a Server Component to pass data to Client Components instead."
    );
  }
  function createResponseFromOptions(options) {
    return new ResponseInstance(
      options.serverConsumerManifest.moduleMap,
      options.serverConsumerManifest.serverModuleMap,
      options.serverConsumerManifest.moduleLoading,
      noServerCall,
      options.encodeFormAction,
      "string" === typeof options.nonce ? options.nonce : void 0,
      options && options.temporaryReferences ? options.temporaryReferences : void 0
    );
  }
  function startReadingFromStream(response, stream, onDone) {
    function progress(_ref) {
      var value = _ref.value;
      if (_ref.done) return onDone();
      var i = 0, rowState = streamState._rowState;
      _ref = streamState._rowID;
      for (var rowTag = streamState._rowTag, rowLength = streamState._rowLength, buffer = streamState._buffer, chunkLength = value.length; i < chunkLength; ) {
        var lastIdx = -1;
        switch (rowState) {
          case 0:
            lastIdx = value[i++];
            58 === lastIdx ? rowState = 1 : _ref = _ref << 4 | (96 < lastIdx ? lastIdx - 87 : lastIdx - 48);
            continue;
          case 1:
            rowState = value[i];
            84 === rowState || 65 === rowState || 79 === rowState || 111 === rowState || 85 === rowState || 83 === rowState || 115 === rowState || 76 === rowState || 108 === rowState || 71 === rowState || 103 === rowState || 77 === rowState || 109 === rowState || 86 === rowState ? (rowTag = rowState, rowState = 2, i++) : 64 < rowState && 91 > rowState || 35 === rowState || 114 === rowState || 120 === rowState ? (rowTag = rowState, rowState = 3, i++) : (rowTag = 0, rowState = 3);
            continue;
          case 2:
            lastIdx = value[i++];
            44 === lastIdx ? rowState = 4 : rowLength = rowLength << 4 | (96 < lastIdx ? lastIdx - 87 : lastIdx - 48);
            continue;
          case 3:
            lastIdx = value.indexOf(10, i);
            break;
          case 4:
            lastIdx = i + rowLength, lastIdx > value.length && (lastIdx = -1);
        }
        var offset = value.byteOffset + i;
        if (-1 < lastIdx)
          rowLength = new Uint8Array(value.buffer, offset, lastIdx - i), processFullBinaryRow(
            response,
            streamState,
            _ref,
            rowTag,
            buffer,
            rowLength
          ), i = lastIdx, 3 === rowState && i++, rowLength = _ref = rowTag = rowState = 0, buffer.length = 0;
        else {
          value = new Uint8Array(value.buffer, offset, value.byteLength - i);
          buffer.push(value);
          rowLength -= value.byteLength;
          break;
        }
      }
      streamState._rowState = rowState;
      streamState._rowID = _ref;
      streamState._rowTag = rowTag;
      streamState._rowLength = rowLength;
      return reader.read().then(progress).catch(error);
    }
    function error(e) {
      reportGlobalError(response, e);
    }
    var streamState = {
      _rowState: 0,
      _rowID: 0,
      _rowTag: 0,
      _rowLength: 0,
      _buffer: []
    }, reader = stream.getReader();
    reader.read().then(progress).catch(error);
  }
  reactServerDomWebpackClient_edge_production.createFromFetch = function(promiseForResponse, options) {
    var response = createResponseFromOptions(options);
    promiseForResponse.then(
      function(r) {
        startReadingFromStream(response, r.body, close.bind(null, response));
      },
      function(e) {
        reportGlobalError(response, e);
      }
    );
    return getChunk(response, 0);
  };
  reactServerDomWebpackClient_edge_production.createFromReadableStream = function(stream, options) {
    options = createResponseFromOptions(options);
    startReadingFromStream(options, stream, close.bind(null, options));
    return getChunk(options, 0);
  };
  reactServerDomWebpackClient_edge_production.createServerReference = function(id) {
    return createServerReference$1(id, noServerCall);
  };
  reactServerDomWebpackClient_edge_production.createTemporaryReferenceSet = function() {
    return /* @__PURE__ */ new Map();
  };
  reactServerDomWebpackClient_edge_production.encodeReply = function(value, options) {
    return new Promise(function(resolve, reject) {
      var abort = processReply(
        value,
        "",
        options && options.temporaryReferences ? options.temporaryReferences : void 0,
        resolve,
        reject
      );
      if (options && options.signal) {
        var signal = options.signal;
        if (signal.aborted) abort(signal.reason);
        else {
          var listener = function() {
            abort(signal.reason);
            signal.removeEventListener("abort", listener);
          };
          signal.addEventListener("abort", listener);
        }
      }
    });
  };
  reactServerDomWebpackClient_edge_production.registerServerReference = function(reference, id, encodeFormAction) {
    registerBoundServerReference(reference, id, null, encodeFormAction);
    return reference;
  };
  return reactServerDomWebpackClient_edge_production;
}
var reactServerDomWebpackClient_edge_development = {};
var hasRequiredReactServerDomWebpackClient_edge_development;
function requireReactServerDomWebpackClient_edge_development() {
  if (hasRequiredReactServerDomWebpackClient_edge_development) return reactServerDomWebpackClient_edge_development;
  hasRequiredReactServerDomWebpackClient_edge_development = 1;
  "production" !== process.env.NODE_ENV && (function() {
    function resolveClientReference(bundlerConfig, metadata) {
      if (bundlerConfig) {
        var moduleExports = bundlerConfig[metadata[0]];
        if (bundlerConfig = moduleExports && moduleExports[metadata[2]])
          moduleExports = bundlerConfig.name;
        else {
          bundlerConfig = moduleExports && moduleExports["*"];
          if (!bundlerConfig)
            throw Error(
              'Could not find the module "' + metadata[0] + '" in the React Server Consumer Manifest. This is probably a bug in the React Server Components bundler.'
            );
          moduleExports = metadata[2];
        }
        return 4 === metadata.length ? [bundlerConfig.id, bundlerConfig.chunks, moduleExports, 1] : [bundlerConfig.id, bundlerConfig.chunks, moduleExports];
      }
      return metadata;
    }
    function resolveServerReference(bundlerConfig, id) {
      var name = "", resolvedModuleData = bundlerConfig[id];
      if (resolvedModuleData) name = resolvedModuleData.name;
      else {
        var idx = id.lastIndexOf("#");
        -1 !== idx && (name = id.slice(idx + 1), resolvedModuleData = bundlerConfig[id.slice(0, idx)]);
        if (!resolvedModuleData)
          throw Error(
            'Could not find the module "' + id + '" in the React Server Manifest. This is probably a bug in the React Server Components bundler.'
          );
      }
      return resolvedModuleData.async ? [resolvedModuleData.id, resolvedModuleData.chunks, name, 1] : [resolvedModuleData.id, resolvedModuleData.chunks, name];
    }
    function requireAsyncModule(id) {
      var promise = __vite_rsc_require__(id);
      if ("function" !== typeof promise.then || "fulfilled" === promise.status)
        return null;
      promise.then(
        function(value) {
          promise.status = "fulfilled";
          promise.value = value;
        },
        function(reason) {
          promise.status = "rejected";
          promise.reason = reason;
        }
      );
      return promise;
    }
    function ignoreReject() {
    }
    function preloadModule(metadata) {
      for (var chunks = metadata[1], promises = [], i = 0; i < chunks.length; ) {
        var chunkId = chunks[i++];
        chunks[i++];
        var entry = chunkCache.get(chunkId);
        if (void 0 === entry) {
          entry = __webpack_chunk_load__(chunkId);
          promises.push(entry);
          var resolve = chunkCache.set.bind(chunkCache, chunkId, null);
          entry.then(resolve, ignoreReject);
          chunkCache.set(chunkId, entry);
        } else null !== entry && promises.push(entry);
      }
      return 4 === metadata.length ? 0 === promises.length ? requireAsyncModule(metadata[0]) : Promise.all(promises).then(function() {
        return requireAsyncModule(metadata[0]);
      }) : 0 < promises.length ? Promise.all(promises) : null;
    }
    function requireModule2(metadata) {
      var moduleExports = __vite_rsc_require__(metadata[0]);
      if (4 === metadata.length && "function" === typeof moduleExports.then)
        if ("fulfilled" === moduleExports.status)
          moduleExports = moduleExports.value;
        else throw moduleExports.reason;
      if ("*" === metadata[2]) return moduleExports;
      if ("" === metadata[2])
        return moduleExports.__esModule ? moduleExports.default : moduleExports;
      if (hasOwnProperty.call(moduleExports, metadata[2]))
        return moduleExports[metadata[2]];
    }
    function prepareDestinationWithChunks(moduleLoading, chunks, nonce$jscomp$0) {
      if (null !== moduleLoading)
        for (var i = 1; i < chunks.length; i += 2) {
          var nonce = nonce$jscomp$0, JSCompiler_temp_const = ReactDOMSharedInternals.d, JSCompiler_temp_const$jscomp$0 = JSCompiler_temp_const.X, JSCompiler_temp_const$jscomp$1 = moduleLoading.prefix + chunks[i];
          var JSCompiler_inline_result = moduleLoading.crossOrigin;
          JSCompiler_inline_result = "string" === typeof JSCompiler_inline_result ? "use-credentials" === JSCompiler_inline_result ? JSCompiler_inline_result : "" : void 0;
          JSCompiler_temp_const$jscomp$0.call(
            JSCompiler_temp_const,
            JSCompiler_temp_const$jscomp$1,
            { crossOrigin: JSCompiler_inline_result, nonce }
          );
        }
    }
    function getIteratorFn(maybeIterable) {
      if (null === maybeIterable || "object" !== typeof maybeIterable)
        return null;
      maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
      return "function" === typeof maybeIterable ? maybeIterable : null;
    }
    function isObjectPrototype(object) {
      if (!object) return false;
      var ObjectPrototype2 = Object.prototype;
      if (object === ObjectPrototype2) return true;
      if (getPrototypeOf(object)) return false;
      object = Object.getOwnPropertyNames(object);
      for (var i = 0; i < object.length; i++)
        if (!(object[i] in ObjectPrototype2)) return false;
      return true;
    }
    function isSimpleObject(object) {
      if (!isObjectPrototype(getPrototypeOf(object))) return false;
      for (var names = Object.getOwnPropertyNames(object), i = 0; i < names.length; i++) {
        var descriptor = Object.getOwnPropertyDescriptor(object, names[i]);
        if (!descriptor || !descriptor.enumerable && ("key" !== names[i] && "ref" !== names[i] || "function" !== typeof descriptor.get))
          return false;
      }
      return true;
    }
    function objectName(object) {
      object = Object.prototype.toString.call(object);
      return object.slice(8, object.length - 1);
    }
    function describeKeyForErrorMessage(key) {
      var encodedKey = JSON.stringify(key);
      return '"' + key + '"' === encodedKey ? key : encodedKey;
    }
    function describeValueForErrorMessage(value) {
      switch (typeof value) {
        case "string":
          return JSON.stringify(
            10 >= value.length ? value : value.slice(0, 10) + "..."
          );
        case "object":
          if (isArrayImpl(value)) return "[...]";
          if (null !== value && value.$$typeof === CLIENT_REFERENCE_TAG)
            return "client";
          value = objectName(value);
          return "Object" === value ? "{...}" : value;
        case "function":
          return value.$$typeof === CLIENT_REFERENCE_TAG ? "client" : (value = value.displayName || value.name) ? "function " + value : "function";
        default:
          return String(value);
      }
    }
    function describeElementType(type) {
      if ("string" === typeof type) return type;
      switch (type) {
        case REACT_SUSPENSE_TYPE:
          return "Suspense";
        case REACT_SUSPENSE_LIST_TYPE:
          return "SuspenseList";
      }
      if ("object" === typeof type)
        switch (type.$$typeof) {
          case REACT_FORWARD_REF_TYPE:
            return describeElementType(type.render);
          case REACT_MEMO_TYPE:
            return describeElementType(type.type);
          case REACT_LAZY_TYPE:
            var payload = type._payload;
            type = type._init;
            try {
              return describeElementType(type(payload));
            } catch (x) {
            }
        }
      return "";
    }
    function describeObjectForErrorMessage(objectOrArray, expandedName) {
      var objKind = objectName(objectOrArray);
      if ("Object" !== objKind && "Array" !== objKind) return objKind;
      var start = -1, length = 0;
      if (isArrayImpl(objectOrArray))
        if (jsxChildrenParents.has(objectOrArray)) {
          var type = jsxChildrenParents.get(objectOrArray);
          objKind = "<" + describeElementType(type) + ">";
          for (var i = 0; i < objectOrArray.length; i++) {
            var value = objectOrArray[i];
            value = "string" === typeof value ? value : "object" === typeof value && null !== value ? "{" + describeObjectForErrorMessage(value) + "}" : "{" + describeValueForErrorMessage(value) + "}";
            "" + i === expandedName ? (start = objKind.length, length = value.length, objKind += value) : objKind = 15 > value.length && 40 > objKind.length + value.length ? objKind + value : objKind + "{...}";
          }
          objKind += "</" + describeElementType(type) + ">";
        } else {
          objKind = "[";
          for (type = 0; type < objectOrArray.length; type++)
            0 < type && (objKind += ", "), i = objectOrArray[type], i = "object" === typeof i && null !== i ? describeObjectForErrorMessage(i) : describeValueForErrorMessage(i), "" + type === expandedName ? (start = objKind.length, length = i.length, objKind += i) : objKind = 10 > i.length && 40 > objKind.length + i.length ? objKind + i : objKind + "...";
          objKind += "]";
        }
      else if (objectOrArray.$$typeof === REACT_ELEMENT_TYPE)
        objKind = "<" + describeElementType(objectOrArray.type) + "/>";
      else {
        if (objectOrArray.$$typeof === CLIENT_REFERENCE_TAG) return "client";
        if (jsxPropsParents.has(objectOrArray)) {
          objKind = jsxPropsParents.get(objectOrArray);
          objKind = "<" + (describeElementType(objKind) || "...");
          type = Object.keys(objectOrArray);
          for (i = 0; i < type.length; i++) {
            objKind += " ";
            value = type[i];
            objKind += describeKeyForErrorMessage(value) + "=";
            var _value2 = objectOrArray[value];
            var _substr2 = value === expandedName && "object" === typeof _value2 && null !== _value2 ? describeObjectForErrorMessage(_value2) : describeValueForErrorMessage(_value2);
            "string" !== typeof _value2 && (_substr2 = "{" + _substr2 + "}");
            value === expandedName ? (start = objKind.length, length = _substr2.length, objKind += _substr2) : objKind = 10 > _substr2.length && 40 > objKind.length + _substr2.length ? objKind + _substr2 : objKind + "...";
          }
          objKind += ">";
        } else {
          objKind = "{";
          type = Object.keys(objectOrArray);
          for (i = 0; i < type.length; i++)
            0 < i && (objKind += ", "), value = type[i], objKind += describeKeyForErrorMessage(value) + ": ", _value2 = objectOrArray[value], _value2 = "object" === typeof _value2 && null !== _value2 ? describeObjectForErrorMessage(_value2) : describeValueForErrorMessage(_value2), value === expandedName ? (start = objKind.length, length = _value2.length, objKind += _value2) : objKind = 10 > _value2.length && 40 > objKind.length + _value2.length ? objKind + _value2 : objKind + "...";
          objKind += "}";
        }
      }
      return void 0 === expandedName ? objKind : -1 < start && 0 < length ? (objectOrArray = " ".repeat(start) + "^".repeat(length), "\n  " + objKind + "\n  " + objectOrArray) : "\n  " + objKind;
    }
    function serializeNumber(number) {
      return Number.isFinite(number) ? 0 === number && -Infinity === 1 / number ? "$-0" : number : Infinity === number ? "$Infinity" : -Infinity === number ? "$-Infinity" : "$NaN";
    }
    function processReply(root, formFieldPrefix, temporaryReferences, resolve, reject) {
      function serializeTypedArray(tag, typedArray) {
        typedArray = new Blob([
          new Uint8Array(
            typedArray.buffer,
            typedArray.byteOffset,
            typedArray.byteLength
          )
        ]);
        var blobId = nextPartId++;
        null === formData && (formData = new FormData());
        formData.append(formFieldPrefix + blobId, typedArray);
        return "$" + tag + blobId.toString(16);
      }
      function serializeBinaryReader(reader) {
        function progress(entry) {
          entry.done ? (entry = nextPartId++, data2.append(formFieldPrefix + entry, new Blob(buffer)), data2.append(
            formFieldPrefix + streamId,
            '"$o' + entry.toString(16) + '"'
          ), data2.append(formFieldPrefix + streamId, "C"), pendingParts--, 0 === pendingParts && resolve(data2)) : (buffer.push(entry.value), reader.read(new Uint8Array(1024)).then(progress, reject));
        }
        null === formData && (formData = new FormData());
        var data2 = formData;
        pendingParts++;
        var streamId = nextPartId++, buffer = [];
        reader.read(new Uint8Array(1024)).then(progress, reject);
        return "$r" + streamId.toString(16);
      }
      function serializeReader(reader) {
        function progress(entry) {
          if (entry.done)
            data2.append(formFieldPrefix + streamId, "C"), pendingParts--, 0 === pendingParts && resolve(data2);
          else
            try {
              var partJSON = JSON.stringify(entry.value, resolveToJSON);
              data2.append(formFieldPrefix + streamId, partJSON);
              reader.read().then(progress, reject);
            } catch (x) {
              reject(x);
            }
        }
        null === formData && (formData = new FormData());
        var data2 = formData;
        pendingParts++;
        var streamId = nextPartId++;
        reader.read().then(progress, reject);
        return "$R" + streamId.toString(16);
      }
      function serializeReadableStream(stream) {
        try {
          var binaryReader = stream.getReader({ mode: "byob" });
        } catch (x) {
          return serializeReader(stream.getReader());
        }
        return serializeBinaryReader(binaryReader);
      }
      function serializeAsyncIterable(iterable, iterator) {
        function progress(entry) {
          if (entry.done) {
            if (void 0 === entry.value)
              data2.append(formFieldPrefix + streamId, "C");
            else
              try {
                var partJSON = JSON.stringify(entry.value, resolveToJSON);
                data2.append(formFieldPrefix + streamId, "C" + partJSON);
              } catch (x) {
                reject(x);
                return;
              }
            pendingParts--;
            0 === pendingParts && resolve(data2);
          } else
            try {
              var _partJSON = JSON.stringify(entry.value, resolveToJSON);
              data2.append(formFieldPrefix + streamId, _partJSON);
              iterator.next().then(progress, reject);
            } catch (x$0) {
              reject(x$0);
            }
        }
        null === formData && (formData = new FormData());
        var data2 = formData;
        pendingParts++;
        var streamId = nextPartId++;
        iterable = iterable === iterator;
        iterator.next().then(progress, reject);
        return "$" + (iterable ? "x" : "X") + streamId.toString(16);
      }
      function resolveToJSON(key, value) {
        "__proto__" === key && console.error(
          "Expected not to serialize an object with own property `__proto__`. When parsed this property will be omitted.%s",
          describeObjectForErrorMessage(this, key)
        );
        var originalValue = this[key];
        "object" !== typeof originalValue || originalValue === value || originalValue instanceof Date || ("Object" !== objectName(originalValue) ? console.error(
          "Only plain objects can be passed to Server Functions from the Client. %s objects are not supported.%s",
          objectName(originalValue),
          describeObjectForErrorMessage(this, key)
        ) : console.error(
          "Only plain objects can be passed to Server Functions from the Client. Objects with toJSON methods are not supported. Convert it manually to a simple value before passing it to props.%s",
          describeObjectForErrorMessage(this, key)
        ));
        if (null === value) return null;
        if ("object" === typeof value) {
          switch (value.$$typeof) {
            case REACT_ELEMENT_TYPE:
              if (void 0 !== temporaryReferences && -1 === key.indexOf(":")) {
                var parentReference = writtenObjects.get(this);
                if (void 0 !== parentReference)
                  return temporaryReferences.set(parentReference + ":" + key, value), "$T";
              }
              throw Error(
                "React Element cannot be passed to Server Functions from the Client without a temporary reference set. Pass a TemporaryReferenceSet to the options." + describeObjectForErrorMessage(this, key)
              );
            case REACT_LAZY_TYPE:
              originalValue = value._payload;
              var init2 = value._init;
              null === formData && (formData = new FormData());
              pendingParts++;
              try {
                parentReference = init2(originalValue);
                var lazyId = nextPartId++, partJSON = serializeModel(parentReference, lazyId);
                formData.append(formFieldPrefix + lazyId, partJSON);
                return "$" + lazyId.toString(16);
              } catch (x) {
                if ("object" === typeof x && null !== x && "function" === typeof x.then) {
                  pendingParts++;
                  var _lazyId = nextPartId++;
                  parentReference = function() {
                    try {
                      var _partJSON2 = serializeModel(value, _lazyId), _data = formData;
                      _data.append(formFieldPrefix + _lazyId, _partJSON2);
                      pendingParts--;
                      0 === pendingParts && resolve(_data);
                    } catch (reason) {
                      reject(reason);
                    }
                  };
                  x.then(parentReference, parentReference);
                  return "$" + _lazyId.toString(16);
                }
                reject(x);
                return null;
              } finally {
                pendingParts--;
              }
          }
          parentReference = writtenObjects.get(value);
          if ("function" === typeof value.then) {
            if (void 0 !== parentReference)
              if (modelRoot === value) modelRoot = null;
              else return parentReference;
            null === formData && (formData = new FormData());
            pendingParts++;
            var promiseId = nextPartId++;
            key = "$@" + promiseId.toString(16);
            writtenObjects.set(value, key);
            value.then(function(partValue) {
              try {
                var previousReference = writtenObjects.get(partValue);
                var _partJSON3 = void 0 !== previousReference ? JSON.stringify(previousReference) : serializeModel(partValue, promiseId);
                partValue = formData;
                partValue.append(formFieldPrefix + promiseId, _partJSON3);
                pendingParts--;
                0 === pendingParts && resolve(partValue);
              } catch (reason) {
                reject(reason);
              }
            }, reject);
            return key;
          }
          if (void 0 !== parentReference)
            if (modelRoot === value) modelRoot = null;
            else return parentReference;
          else
            -1 === key.indexOf(":") && (parentReference = writtenObjects.get(this), void 0 !== parentReference && (parentReference = parentReference + ":" + key, writtenObjects.set(value, parentReference), void 0 !== temporaryReferences && temporaryReferences.set(parentReference, value)));
          if (isArrayImpl(value)) return value;
          if (value instanceof FormData) {
            null === formData && (formData = new FormData());
            var _data3 = formData;
            key = nextPartId++;
            var prefix2 = formFieldPrefix + key + "_";
            value.forEach(function(originalValue2, originalKey) {
              _data3.append(prefix2 + originalKey, originalValue2);
            });
            return "$K" + key.toString(16);
          }
          if (value instanceof Map)
            return key = nextPartId++, parentReference = serializeModel(Array.from(value), key), null === formData && (formData = new FormData()), formData.append(formFieldPrefix + key, parentReference), "$Q" + key.toString(16);
          if (value instanceof Set)
            return key = nextPartId++, parentReference = serializeModel(Array.from(value), key), null === formData && (formData = new FormData()), formData.append(formFieldPrefix + key, parentReference), "$W" + key.toString(16);
          if (value instanceof ArrayBuffer)
            return key = new Blob([value]), parentReference = nextPartId++, null === formData && (formData = new FormData()), formData.append(formFieldPrefix + parentReference, key), "$A" + parentReference.toString(16);
          if (value instanceof Int8Array)
            return serializeTypedArray("O", value);
          if (value instanceof Uint8Array)
            return serializeTypedArray("o", value);
          if (value instanceof Uint8ClampedArray)
            return serializeTypedArray("U", value);
          if (value instanceof Int16Array)
            return serializeTypedArray("S", value);
          if (value instanceof Uint16Array)
            return serializeTypedArray("s", value);
          if (value instanceof Int32Array)
            return serializeTypedArray("L", value);
          if (value instanceof Uint32Array)
            return serializeTypedArray("l", value);
          if (value instanceof Float32Array)
            return serializeTypedArray("G", value);
          if (value instanceof Float64Array)
            return serializeTypedArray("g", value);
          if (value instanceof BigInt64Array)
            return serializeTypedArray("M", value);
          if (value instanceof BigUint64Array)
            return serializeTypedArray("m", value);
          if (value instanceof DataView) return serializeTypedArray("V", value);
          if ("function" === typeof Blob && value instanceof Blob)
            return null === formData && (formData = new FormData()), key = nextPartId++, formData.append(formFieldPrefix + key, value), "$B" + key.toString(16);
          if (parentReference = getIteratorFn(value))
            return parentReference = parentReference.call(value), parentReference === value ? (key = nextPartId++, parentReference = serializeModel(
              Array.from(parentReference),
              key
            ), null === formData && (formData = new FormData()), formData.append(formFieldPrefix + key, parentReference), "$i" + key.toString(16)) : Array.from(parentReference);
          if ("function" === typeof ReadableStream && value instanceof ReadableStream)
            return serializeReadableStream(value);
          parentReference = value[ASYNC_ITERATOR];
          if ("function" === typeof parentReference)
            return serializeAsyncIterable(value, parentReference.call(value));
          parentReference = getPrototypeOf(value);
          if (parentReference !== ObjectPrototype && (null === parentReference || null !== getPrototypeOf(parentReference))) {
            if (void 0 === temporaryReferences)
              throw Error(
                "Only plain objects, and a few built-ins, can be passed to Server Functions. Classes or null prototypes are not supported." + describeObjectForErrorMessage(this, key)
              );
            return "$T";
          }
          value.$$typeof === REACT_CONTEXT_TYPE ? console.error(
            "React Context Providers cannot be passed to Server Functions from the Client.%s",
            describeObjectForErrorMessage(this, key)
          ) : "Object" !== objectName(value) ? console.error(
            "Only plain objects can be passed to Server Functions from the Client. %s objects are not supported.%s",
            objectName(value),
            describeObjectForErrorMessage(this, key)
          ) : isSimpleObject(value) ? Object.getOwnPropertySymbols && (parentReference = Object.getOwnPropertySymbols(value), 0 < parentReference.length && console.error(
            "Only plain objects can be passed to Server Functions from the Client. Objects with symbol properties like %s are not supported.%s",
            parentReference[0].description,
            describeObjectForErrorMessage(this, key)
          )) : console.error(
            "Only plain objects can be passed to Server Functions from the Client. Classes or other objects with methods are not supported.%s",
            describeObjectForErrorMessage(this, key)
          );
          return value;
        }
        if ("string" === typeof value) {
          if ("Z" === value[value.length - 1] && this[key] instanceof Date)
            return "$D" + value;
          key = "$" === value[0] ? "$" + value : value;
          return key;
        }
        if ("boolean" === typeof value) return value;
        if ("number" === typeof value) return serializeNumber(value);
        if ("undefined" === typeof value) return "$undefined";
        if ("function" === typeof value) {
          parentReference = knownServerReferences.get(value);
          if (void 0 !== parentReference) {
            key = writtenObjects.get(value);
            if (void 0 !== key) return key;
            key = JSON.stringify(
              { id: parentReference.id, bound: parentReference.bound },
              resolveToJSON
            );
            null === formData && (formData = new FormData());
            parentReference = nextPartId++;
            formData.set(formFieldPrefix + parentReference, key);
            key = "$h" + parentReference.toString(16);
            writtenObjects.set(value, key);
            return key;
          }
          if (void 0 !== temporaryReferences && -1 === key.indexOf(":") && (parentReference = writtenObjects.get(this), void 0 !== parentReference))
            return temporaryReferences.set(parentReference + ":" + key, value), "$T";
          throw Error(
            "Client Functions cannot be passed directly to Server Functions. Only Functions passed from the Server can be passed back again."
          );
        }
        if ("symbol" === typeof value) {
          if (void 0 !== temporaryReferences && -1 === key.indexOf(":") && (parentReference = writtenObjects.get(this), void 0 !== parentReference))
            return temporaryReferences.set(parentReference + ":" + key, value), "$T";
          throw Error(
            "Symbols cannot be passed to a Server Function without a temporary reference set. Pass a TemporaryReferenceSet to the options." + describeObjectForErrorMessage(this, key)
          );
        }
        if ("bigint" === typeof value) return "$n" + value.toString(10);
        throw Error(
          "Type " + typeof value + " is not supported as an argument to a Server Function."
        );
      }
      function serializeModel(model, id) {
        "object" === typeof model && null !== model && (id = "$" + id.toString(16), writtenObjects.set(model, id), void 0 !== temporaryReferences && temporaryReferences.set(id, model));
        modelRoot = model;
        return JSON.stringify(model, resolveToJSON);
      }
      var nextPartId = 1, pendingParts = 0, formData = null, writtenObjects = /* @__PURE__ */ new WeakMap(), modelRoot = root, json = serializeModel(root, 0);
      null === formData ? resolve(json) : (formData.set(formFieldPrefix + "0", json), 0 === pendingParts && resolve(formData));
      return function() {
        0 < pendingParts && (pendingParts = 0, null === formData ? resolve(json) : resolve(formData));
      };
    }
    function encodeFormData(reference) {
      var resolve, reject, thenable = new Promise(function(res, rej) {
        resolve = res;
        reject = rej;
      });
      processReply(
        reference,
        "",
        void 0,
        function(body) {
          if ("string" === typeof body) {
            var data2 = new FormData();
            data2.append("0", body);
            body = data2;
          }
          thenable.status = "fulfilled";
          thenable.value = body;
          resolve(body);
        },
        function(e) {
          thenable.status = "rejected";
          thenable.reason = e;
          reject(e);
        }
      );
      return thenable;
    }
    function defaultEncodeFormAction(identifierPrefix) {
      var referenceClosure = knownServerReferences.get(this);
      if (!referenceClosure)
        throw Error(
          "Tried to encode a Server Action from a different instance than the encoder is from. This is a bug in React."
        );
      var data2 = null;
      if (null !== referenceClosure.bound) {
        data2 = boundCache.get(referenceClosure);
        data2 || (data2 = encodeFormData({
          id: referenceClosure.id,
          bound: referenceClosure.bound
        }), boundCache.set(referenceClosure, data2));
        if ("rejected" === data2.status) throw data2.reason;
        if ("fulfilled" !== data2.status) throw data2;
        referenceClosure = data2.value;
        var prefixedData = new FormData();
        referenceClosure.forEach(function(value, key) {
          prefixedData.append("$ACTION_" + identifierPrefix + ":" + key, value);
        });
        data2 = prefixedData;
        referenceClosure = "$ACTION_REF_" + identifierPrefix;
      } else referenceClosure = "$ACTION_ID_" + referenceClosure.id;
      return {
        name: referenceClosure,
        method: "POST",
        encType: "multipart/form-data",
        data: data2
      };
    }
    function isSignatureEqual(referenceId, numberOfBoundArgs) {
      var referenceClosure = knownServerReferences.get(this);
      if (!referenceClosure)
        throw Error(
          "Tried to encode a Server Action from a different instance than the encoder is from. This is a bug in React."
        );
      if (referenceClosure.id !== referenceId) return false;
      var boundPromise = referenceClosure.bound;
      if (null === boundPromise) return 0 === numberOfBoundArgs;
      switch (boundPromise.status) {
        case "fulfilled":
          return boundPromise.value.length === numberOfBoundArgs;
        case "pending":
          throw boundPromise;
        case "rejected":
          throw boundPromise.reason;
        default:
          throw "string" !== typeof boundPromise.status && (boundPromise.status = "pending", boundPromise.then(
            function(boundArgs) {
              boundPromise.status = "fulfilled";
              boundPromise.value = boundArgs;
            },
            function(error) {
              boundPromise.status = "rejected";
              boundPromise.reason = error;
            }
          )), boundPromise;
      }
    }
    function createFakeServerFunction(name, filename, sourceMap, line, col, environmentName, innerFunction) {
      name || (name = "<anonymous>");
      var encodedName = JSON.stringify(name);
      1 >= line ? (line = encodedName.length + 7, col = "s=>({" + encodedName + " ".repeat(col < line ? 0 : col - line) + ":(...args) => s(...args)})\n/* This module is a proxy to a Server Action. Turn on Source Maps to see the server source. */") : col = "/* This module is a proxy to a Server Action. Turn on Source Maps to see the server source. */" + "\n".repeat(line - 2) + "server=>({" + encodedName + ":\n" + " ".repeat(1 > col ? 0 : col - 1) + "(...args) => server(...args)})";
      filename.startsWith("/") && (filename = "file://" + filename);
      sourceMap ? (col += "\n//# sourceURL=about://React/" + encodeURIComponent(environmentName) + "/" + encodeURI(filename) + "?s" + fakeServerFunctionIdx++, col += "\n//# sourceMappingURL=" + sourceMap) : filename && (col += "\n//# sourceURL=" + filename);
      try {
        return (0, eval)(col)(innerFunction)[name];
      } catch (x) {
        return innerFunction;
      }
    }
    function registerBoundServerReference(reference, id, bound, encodeFormAction) {
      knownServerReferences.has(reference) || (knownServerReferences.set(reference, {
        id,
        originalBind: reference.bind,
        bound
      }), Object.defineProperties(reference, {
        $$FORM_ACTION: {
          value: void 0 === encodeFormAction ? defaultEncodeFormAction : function() {
            var referenceClosure = knownServerReferences.get(this);
            if (!referenceClosure)
              throw Error(
                "Tried to encode a Server Action from a different instance than the encoder is from. This is a bug in React."
              );
            var boundPromise = referenceClosure.bound;
            null === boundPromise && (boundPromise = Promise.resolve([]));
            return encodeFormAction(referenceClosure.id, boundPromise);
          }
        },
        $$IS_SIGNATURE_EQUAL: { value: isSignatureEqual },
        bind: { value: bind }
      }));
    }
    function bind() {
      var referenceClosure = knownServerReferences.get(this);
      if (!referenceClosure) return FunctionBind.apply(this, arguments);
      var newFn = referenceClosure.originalBind.apply(this, arguments);
      null != arguments[0] && console.error(
        'Cannot bind "this" of a Server Action. Pass null or undefined as the first argument to .bind().'
      );
      var args = ArraySlice.call(arguments, 1), boundPromise = null;
      boundPromise = null !== referenceClosure.bound ? Promise.resolve(referenceClosure.bound).then(function(boundArgs) {
        return boundArgs.concat(args);
      }) : Promise.resolve(args);
      knownServerReferences.set(newFn, {
        id: referenceClosure.id,
        originalBind: newFn.bind,
        bound: boundPromise
      });
      Object.defineProperties(newFn, {
        $$FORM_ACTION: { value: this.$$FORM_ACTION },
        $$IS_SIGNATURE_EQUAL: { value: isSignatureEqual },
        bind: { value: bind }
      });
      return newFn;
    }
    function createBoundServerReference(metaData, callServer, encodeFormAction, findSourceMapURL) {
      function action() {
        var args = Array.prototype.slice.call(arguments);
        return bound ? "fulfilled" === bound.status ? callServer(id, bound.value.concat(args)) : Promise.resolve(bound).then(function(boundArgs) {
          return callServer(id, boundArgs.concat(args));
        }) : callServer(id, args);
      }
      var id = metaData.id, bound = metaData.bound, location = metaData.location;
      if (location) {
        var functionName = metaData.name || "", filename = location[1], line = location[2];
        location = location[3];
        metaData = metaData.env || "Server";
        findSourceMapURL = null == findSourceMapURL ? null : findSourceMapURL(filename, metaData);
        action = createFakeServerFunction(
          functionName,
          filename,
          findSourceMapURL,
          line,
          location,
          metaData,
          action
        );
      }
      registerBoundServerReference(action, id, bound, encodeFormAction);
      return action;
    }
    function parseStackLocation(error) {
      error = error.stack;
      error.startsWith("Error: react-stack-top-frame\n") && (error = error.slice(29));
      var endOfFirst = error.indexOf("\n");
      if (-1 !== endOfFirst) {
        var endOfSecond = error.indexOf("\n", endOfFirst + 1);
        endOfFirst = -1 === endOfSecond ? error.slice(endOfFirst + 1) : error.slice(endOfFirst + 1, endOfSecond);
      } else endOfFirst = error;
      error = v8FrameRegExp.exec(endOfFirst);
      if (!error && (error = jscSpiderMonkeyFrameRegExp.exec(endOfFirst), !error))
        return null;
      endOfFirst = error[1] || "";
      "<anonymous>" === endOfFirst && (endOfFirst = "");
      endOfSecond = error[2] || error[5] || "";
      "<anonymous>" === endOfSecond && (endOfSecond = "");
      return [
        endOfFirst,
        endOfSecond,
        +(error[3] || error[6]),
        +(error[4] || error[7])
      ];
    }
    function createServerReference$1(id, callServer, encodeFormAction, findSourceMapURL, functionName) {
      function action() {
        var args = Array.prototype.slice.call(arguments);
        return callServer(id, args);
      }
      var location = parseStackLocation(Error("react-stack-top-frame"));
      if (null !== location) {
        var filename = location[1], line = location[2];
        location = location[3];
        findSourceMapURL = null == findSourceMapURL ? null : findSourceMapURL(filename, "Client");
        action = createFakeServerFunction(
          "",
          filename,
          findSourceMapURL,
          line,
          location,
          "Client",
          action
        );
      }
      registerBoundServerReference(action, id, null, encodeFormAction);
      return action;
    }
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
    function getArrayKind(array) {
      for (var kind = 0, i = 0; i < array.length; i++) {
        var value = array[i];
        if ("object" === typeof value && null !== value)
          if (isArrayImpl(value) && 2 === value.length && "string" === typeof value[0]) {
            if (0 !== kind && 3 !== kind) return 1;
            kind = 3;
          } else return 1;
        else {
          if ("function" === typeof value || "string" === typeof value && 50 < value.length || 0 !== kind && 2 !== kind)
            return 1;
          kind = 2;
        }
      }
      return kind;
    }
    function addObjectToProperties(object, properties, indent, prefix2) {
      for (var key in object)
        hasOwnProperty.call(object, key) && "_" !== key[0] && addValueToProperties(key, object[key], properties, indent, prefix2);
    }
    function addValueToProperties(propertyName, value, properties, indent, prefix2) {
      switch (typeof value) {
        case "object":
          if (null === value) {
            value = "null";
            break;
          } else {
            if (value.$$typeof === REACT_ELEMENT_TYPE) {
              var typeName = getComponentNameFromType(value.type) || "…", key = value.key;
              value = value.props;
              var propsKeys = Object.keys(value), propsLength = propsKeys.length;
              if (null == key && 0 === propsLength) {
                value = "<" + typeName + " />";
                break;
              }
              if (3 > indent || 1 === propsLength && "children" === propsKeys[0] && null == key) {
                value = "<" + typeName + " … />";
                break;
              }
              properties.push([
                prefix2 + "  ".repeat(indent) + propertyName,
                "<" + typeName
              ]);
              null !== key && addValueToProperties(
                "key",
                key,
                properties,
                indent + 1,
                prefix2
              );
              propertyName = false;
              for (var propKey in value)
                "children" === propKey ? null != value.children && (!isArrayImpl(value.children) || 0 < value.children.length) && (propertyName = true) : hasOwnProperty.call(value, propKey) && "_" !== propKey[0] && addValueToProperties(
                  propKey,
                  value[propKey],
                  properties,
                  indent + 1,
                  prefix2
                );
              properties.push([
                "",
                propertyName ? ">…</" + typeName + ">" : "/>"
              ]);
              return;
            }
            typeName = Object.prototype.toString.call(value);
            typeName = typeName.slice(8, typeName.length - 1);
            if ("Array" === typeName) {
              if (propKey = getArrayKind(value), 2 === propKey || 0 === propKey) {
                value = JSON.stringify(value);
                break;
              } else if (3 === propKey) {
                properties.push([
                  prefix2 + "  ".repeat(indent) + propertyName,
                  ""
                ]);
                for (propertyName = 0; propertyName < value.length; propertyName++)
                  typeName = value[propertyName], addValueToProperties(
                    typeName[0],
                    typeName[1],
                    properties,
                    indent + 1,
                    prefix2
                  );
                return;
              }
            }
            if ("Promise" === typeName) {
              if ("fulfilled" === value.status) {
                if (typeName = properties.length, addValueToProperties(
                  propertyName,
                  value.value,
                  properties,
                  indent,
                  prefix2
                ), properties.length > typeName) {
                  properties = properties[typeName];
                  properties[1] = "Promise<" + (properties[1] || "Object") + ">";
                  return;
                }
              } else if ("rejected" === value.status && (typeName = properties.length, addValueToProperties(
                propertyName,
                value.reason,
                properties,
                indent,
                prefix2
              ), properties.length > typeName)) {
                properties = properties[typeName];
                properties[1] = "Rejected Promise<" + properties[1] + ">";
                return;
              }
              properties.push([
                "  ".repeat(indent) + propertyName,
                "Promise"
              ]);
              return;
            }
            "Object" === typeName && (propKey = Object.getPrototypeOf(value)) && "function" === typeof propKey.constructor && (typeName = propKey.constructor.name);
            properties.push([
              prefix2 + "  ".repeat(indent) + propertyName,
              "Object" === typeName ? 3 > indent ? "" : "…" : typeName
            ]);
            3 > indent && addObjectToProperties(value, properties, indent + 1, prefix2);
            return;
          }
        case "function":
          value = "" === value.name ? "() => {}" : value.name + "() {}";
          break;
        case "string":
          value = "This object has been omitted by React in the console log to avoid sending too much data from the server. Try logging smaller or more specific objects." === value ? "…" : JSON.stringify(value);
          break;
        case "undefined":
          value = "undefined";
          break;
        case "boolean":
          value = value ? "true" : "false";
          break;
        default:
          value = String(value);
      }
      properties.push([
        prefix2 + "  ".repeat(indent) + propertyName,
        value
      ]);
    }
    function getIODescription(value) {
      try {
        switch (typeof value) {
          case "object":
            if (null === value) return "";
            if (value instanceof Error) return String(value.message);
            if ("string" === typeof value.url) return value.url;
            if ("string" === typeof value.href) return value.href;
            if ("string" === typeof value.src) return value.src;
            if ("string" === typeof value.currentSrc) return value.currentSrc;
            if ("string" === typeof value.command) return value.command;
            if ("object" === typeof value.request && null !== value.request && "string" === typeof value.request.url)
              return value.request.url;
            if ("object" === typeof value.response && null !== value.response && "string" === typeof value.response.url)
              return value.response.url;
            if ("string" === typeof value.id || "number" === typeof value.id || "bigint" === typeof value.id)
              return String(value.id);
            if ("string" === typeof value.name) return value.name;
            var str = value.toString();
            return str.startsWith("[object ") || 5 > str.length || 500 < str.length ? "" : str;
          case "string":
            return 5 > value.length || 500 < value.length ? "" : value;
          case "number":
          case "bigint":
            return String(value);
          default:
            return "";
        }
      } catch (x) {
        return "";
      }
    }
    function markAllTracksInOrder() {
      supportsUserTiming && (console.timeStamp(
        "Server Requests Track",
        1e-3,
        1e-3,
        "Server Requests ⚛",
        void 0,
        "primary-light"
      ), console.timeStamp(
        "Server Components Track",
        1e-3,
        1e-3,
        "Primary",
        "Server Components ⚛",
        "primary-light"
      ));
    }
    function getIOColor(functionName) {
      switch (functionName.charCodeAt(0) % 3) {
        case 0:
          return "tertiary-light";
        case 1:
          return "tertiary";
        default:
          return "tertiary-dark";
      }
    }
    function getIOLongName(ioInfo, description, env, rootEnv) {
      ioInfo = ioInfo.name;
      description = "" === description ? ioInfo : ioInfo + " (" + description + ")";
      return env === rootEnv || void 0 === env ? description : description + " [" + env + "]";
    }
    function getIOShortName(ioInfo, description, env, rootEnv) {
      ioInfo = ioInfo.name;
      env = env === rootEnv || void 0 === env ? "" : " [" + env + "]";
      var desc = "";
      rootEnv = 30 - ioInfo.length - env.length;
      if (1 < rootEnv) {
        var l = description.length;
        if (0 < l && l <= rootEnv) desc = " (" + description + ")";
        else if (description.startsWith("http://") || description.startsWith("https://") || description.startsWith("/")) {
          var queryIdx = description.indexOf("?");
          -1 === queryIdx && (queryIdx = description.length);
          47 === description.charCodeAt(queryIdx - 1) && queryIdx--;
          desc = description.lastIndexOf("/", queryIdx - 1);
          queryIdx - desc < rootEnv ? desc = " (…" + description.slice(desc, queryIdx) + ")" : (l = description.slice(desc, desc + rootEnv / 2), description = description.slice(
            queryIdx - rootEnv / 2,
            queryIdx
          ), desc = " (" + (0 < desc ? "…" : "") + l + "…" + description + ")");
        }
      }
      return ioInfo + desc + env;
    }
    function logComponentAwait(asyncInfo, trackIdx, startTime, endTime, rootEnv, value) {
      if (supportsUserTiming && 0 < endTime) {
        var description = getIODescription(value), name = getIOShortName(
          asyncInfo.awaited,
          description,
          asyncInfo.env,
          rootEnv
        ), entryName = "await " + name;
        name = getIOColor(name);
        var debugTask = asyncInfo.debugTask || asyncInfo.awaited.debugTask;
        if (debugTask) {
          var properties = [];
          "object" === typeof value && null !== value ? addObjectToProperties(value, properties, 0, "") : void 0 !== value && addValueToProperties("awaited value", value, properties, 0, "");
          asyncInfo = getIOLongName(
            asyncInfo.awaited,
            description,
            asyncInfo.env,
            rootEnv
          );
          debugTask.run(
            performance.measure.bind(performance, entryName, {
              start: 0 > startTime ? 0 : startTime,
              end: endTime,
              detail: {
                devtools: {
                  color: name,
                  track: trackNames[trackIdx],
                  trackGroup: "Server Components ⚛",
                  properties,
                  tooltipText: asyncInfo
                }
              }
            })
          );
        } else
          console.timeStamp(
            entryName,
            0 > startTime ? 0 : startTime,
            endTime,
            trackNames[trackIdx],
            "Server Components ⚛",
            name
          );
      }
    }
    function logIOInfoErrored(ioInfo, rootEnv, error) {
      var startTime = ioInfo.start, endTime = ioInfo.end;
      if (supportsUserTiming && 0 <= endTime) {
        var description = getIODescription(error), entryName = getIOShortName(ioInfo, description, ioInfo.env, rootEnv), debugTask = ioInfo.debugTask;
        debugTask ? (error = [
          [
            "rejected with",
            "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error)
          ]
        ], ioInfo = getIOLongName(ioInfo, description, ioInfo.env, rootEnv) + " Rejected", debugTask.run(
          performance.measure.bind(performance, "​" + entryName, {
            start: 0 > startTime ? 0 : startTime,
            end: endTime,
            detail: {
              devtools: {
                color: "error",
                track: "Server Requests ⚛",
                properties: error,
                tooltipText: ioInfo
              }
            }
          })
        )) : console.timeStamp(
          entryName,
          0 > startTime ? 0 : startTime,
          endTime,
          "Server Requests ⚛",
          void 0,
          "error"
        );
      }
    }
    function logIOInfo(ioInfo, rootEnv, value) {
      var startTime = ioInfo.start, endTime = ioInfo.end;
      if (supportsUserTiming && 0 <= endTime) {
        var description = getIODescription(value), entryName = getIOShortName(ioInfo, description, ioInfo.env, rootEnv), color = getIOColor(entryName), debugTask = ioInfo.debugTask;
        if (debugTask) {
          var properties = [];
          "object" === typeof value && null !== value ? addObjectToProperties(value, properties, 0, "") : void 0 !== value && addValueToProperties("Resolved", value, properties, 0, "");
          ioInfo = getIOLongName(ioInfo, description, ioInfo.env, rootEnv);
          debugTask.run(
            performance.measure.bind(performance, "​" + entryName, {
              start: 0 > startTime ? 0 : startTime,
              end: endTime,
              detail: {
                devtools: {
                  color,
                  track: "Server Requests ⚛",
                  properties,
                  tooltipText: ioInfo
                }
              }
            })
          );
        } else
          console.timeStamp(
            entryName,
            0 > startTime ? 0 : startTime,
            endTime,
            "Server Requests ⚛",
            void 0,
            color
          );
      }
    }
    function prepareStackTrace(error, structuredStackTrace) {
      error = (error.name || "Error") + ": " + (error.message || "");
      for (var i = 0; i < structuredStackTrace.length; i++)
        error += "\n    at " + structuredStackTrace[i].toString();
      return error;
    }
    function ReactPromise(status, value, reason) {
      this.status = status;
      this.value = value;
      this.reason = reason;
      this._children = [];
      this._debugChunk = null;
      this._debugInfo = [];
    }
    function unwrapWeakResponse(weakResponse) {
      weakResponse = weakResponse.weak.deref();
      if (void 0 === weakResponse)
        throw Error(
          "We did not expect to receive new data after GC:ing the response."
        );
      return weakResponse;
    }
    function closeDebugChannel(debugChannel) {
      debugChannel.callback && debugChannel.callback("");
    }
    function readChunk(chunk) {
      switch (chunk.status) {
        case "resolved_model":
          initializeModelChunk(chunk);
          break;
        case "resolved_module":
          initializeModuleChunk(chunk);
      }
      switch (chunk.status) {
        case "fulfilled":
          return chunk.value;
        case "pending":
        case "blocked":
        case "halted":
          throw chunk;
        default:
          throw chunk.reason;
      }
    }
    function getRoot(weakResponse) {
      weakResponse = unwrapWeakResponse(weakResponse);
      return getChunk(weakResponse, 0);
    }
    function createPendingChunk(response) {
      0 === response._pendingChunks++ && (response._weakResponse.response = response, null !== response._pendingInitialRender && (clearTimeout(response._pendingInitialRender), response._pendingInitialRender = null));
      return new ReactPromise("pending", null, null);
    }
    function releasePendingChunk(response, chunk) {
      "pending" === chunk.status && 0 === --response._pendingChunks && (response._weakResponse.response = null, response._pendingInitialRender = setTimeout(
        flushInitialRenderPerformance.bind(null, response),
        100
      ));
    }
    function moveDebugInfoFromChunkToInnerValue(chunk, value) {
      value = resolveLazy(value);
      "object" !== typeof value || null === value || !isArrayImpl(value) && "function" !== typeof value[ASYNC_ITERATOR] && value.$$typeof !== REACT_ELEMENT_TYPE && value.$$typeof !== REACT_LAZY_TYPE || (chunk = chunk._debugInfo.splice(0), isArrayImpl(value._debugInfo) ? value._debugInfo.unshift.apply(value._debugInfo, chunk) : Object.defineProperty(value, "_debugInfo", {
        configurable: false,
        enumerable: false,
        writable: true,
        value: chunk
      }));
    }
    function wakeChunk(listeners, value, chunk) {
      for (var i = 0; i < listeners.length; i++) {
        var listener = listeners[i];
        "function" === typeof listener ? listener(value) : fulfillReference(listener, value, chunk);
      }
      moveDebugInfoFromChunkToInnerValue(chunk, value);
    }
    function rejectChunk(listeners, error) {
      for (var i = 0; i < listeners.length; i++) {
        var listener = listeners[i];
        "function" === typeof listener ? listener(error) : rejectReference(listener, error);
      }
    }
    function resolveBlockedCycle(resolvedChunk, reference) {
      var referencedChunk = reference.handler.chunk;
      if (null === referencedChunk) return null;
      if (referencedChunk === resolvedChunk) return reference.handler;
      reference = referencedChunk.value;
      if (null !== reference)
        for (referencedChunk = 0; referencedChunk < reference.length; referencedChunk++) {
          var listener = reference[referencedChunk];
          if ("function" !== typeof listener && (listener = resolveBlockedCycle(resolvedChunk, listener), null !== listener))
            return listener;
        }
      return null;
    }
    function wakeChunkIfInitialized(chunk, resolveListeners, rejectListeners) {
      switch (chunk.status) {
        case "fulfilled":
          wakeChunk(resolveListeners, chunk.value, chunk);
          break;
        case "blocked":
          for (var i = 0; i < resolveListeners.length; i++) {
            var listener = resolveListeners[i];
            if ("function" !== typeof listener) {
              var cyclicHandler = resolveBlockedCycle(chunk, listener);
              if (null !== cyclicHandler)
                switch (fulfillReference(listener, cyclicHandler.value, chunk), resolveListeners.splice(i, 1), i--, null !== rejectListeners && (listener = rejectListeners.indexOf(listener), -1 !== listener && rejectListeners.splice(listener, 1)), chunk.status) {
                  case "fulfilled":
                    wakeChunk(resolveListeners, chunk.value, chunk);
                    return;
                  case "rejected":
                    null !== rejectListeners && rejectChunk(rejectListeners, chunk.reason);
                    return;
                }
            }
          }
        case "pending":
          if (chunk.value)
            for (i = 0; i < resolveListeners.length; i++)
              chunk.value.push(resolveListeners[i]);
          else chunk.value = resolveListeners;
          if (chunk.reason) {
            if (rejectListeners)
              for (resolveListeners = 0; resolveListeners < rejectListeners.length; resolveListeners++)
                chunk.reason.push(rejectListeners[resolveListeners]);
          } else chunk.reason = rejectListeners;
          break;
        case "rejected":
          rejectListeners && rejectChunk(rejectListeners, chunk.reason);
      }
    }
    function triggerErrorOnChunk(response, chunk, error) {
      if ("pending" !== chunk.status && "blocked" !== chunk.status)
        chunk.reason.error(error);
      else {
        releasePendingChunk(response, chunk);
        var listeners = chunk.reason;
        if ("pending" === chunk.status && null != chunk._debugChunk) {
          var prevHandler = initializingHandler, prevChunk = initializingChunk;
          initializingHandler = null;
          chunk.status = "blocked";
          chunk.value = null;
          chunk.reason = null;
          initializingChunk = chunk;
          try {
            initializeDebugChunk(response, chunk);
          } finally {
            initializingHandler = prevHandler, initializingChunk = prevChunk;
          }
        }
        chunk.status = "rejected";
        chunk.reason = error;
        null !== listeners && rejectChunk(listeners, error);
      }
    }
    function createResolvedModelChunk(response, value) {
      return new ReactPromise("resolved_model", value, response);
    }
    function createResolvedIteratorResultChunk(response, value, done) {
      return new ReactPromise(
        "resolved_model",
        (done ? '{"done":true,"value":' : '{"done":false,"value":') + value + "}",
        response
      );
    }
    function resolveIteratorResultChunk(response, chunk, value, done) {
      resolveModelChunk(
        response,
        chunk,
        (done ? '{"done":true,"value":' : '{"done":false,"value":') + value + "}"
      );
    }
    function resolveModelChunk(response, chunk, value) {
      if ("pending" !== chunk.status) chunk.reason.enqueueModel(value);
      else {
        releasePendingChunk(response, chunk);
        var resolveListeners = chunk.value, rejectListeners = chunk.reason;
        chunk.status = "resolved_model";
        chunk.value = value;
        chunk.reason = response;
        null !== resolveListeners && (initializeModelChunk(chunk), wakeChunkIfInitialized(chunk, resolveListeners, rejectListeners));
      }
    }
    function resolveModuleChunk(response, chunk, value) {
      if ("pending" === chunk.status || "blocked" === chunk.status) {
        releasePendingChunk(response, chunk);
        response = chunk.value;
        var rejectListeners = chunk.reason;
        chunk.status = "resolved_module";
        chunk.value = value;
        chunk.reason = null;
        value = [];
        null !== value && chunk._debugInfo.push.apply(chunk._debugInfo, value);
        null !== response && (initializeModuleChunk(chunk), wakeChunkIfInitialized(chunk, response, rejectListeners));
      }
    }
    function initializeDebugChunk(response, chunk) {
      var debugChunk = chunk._debugChunk;
      if (null !== debugChunk) {
        var debugInfo = chunk._debugInfo;
        try {
          if ("resolved_model" === debugChunk.status) {
            for (var idx = debugInfo.length, c = debugChunk._debugChunk; null !== c; )
              "fulfilled" !== c.status && idx++, c = c._debugChunk;
            initializeModelChunk(debugChunk);
            switch (debugChunk.status) {
              case "fulfilled":
                debugInfo[idx] = initializeDebugInfo(
                  response,
                  debugChunk.value
                );
                break;
              case "blocked":
              case "pending":
                waitForReference(
                  debugChunk,
                  debugInfo,
                  "" + idx,
                  response,
                  initializeDebugInfo,
                  [""],
                  true
                );
                break;
              default:
                throw debugChunk.reason;
            }
          } else
            switch (debugChunk.status) {
              case "fulfilled":
                break;
              case "blocked":
              case "pending":
                waitForReference(
                  debugChunk,
                  {},
                  "debug",
                  response,
                  initializeDebugInfo,
                  [""],
                  true
                );
                break;
              default:
                throw debugChunk.reason;
            }
        } catch (error) {
          triggerErrorOnChunk(response, chunk, error);
        }
      }
    }
    function initializeModelChunk(chunk) {
      var prevHandler = initializingHandler, prevChunk = initializingChunk;
      initializingHandler = null;
      var resolvedModel = chunk.value, response = chunk.reason;
      chunk.status = "blocked";
      chunk.value = null;
      chunk.reason = null;
      initializingChunk = chunk;
      initializeDebugChunk(response, chunk);
      try {
        var value = JSON.parse(resolvedModel, response._fromJSON), resolveListeners = chunk.value;
        if (null !== resolveListeners)
          for (chunk.value = null, chunk.reason = null, resolvedModel = 0; resolvedModel < resolveListeners.length; resolvedModel++) {
            var listener = resolveListeners[resolvedModel];
            "function" === typeof listener ? listener(value) : fulfillReference(listener, value, chunk);
          }
        if (null !== initializingHandler) {
          if (initializingHandler.errored) throw initializingHandler.reason;
          if (0 < initializingHandler.deps) {
            initializingHandler.value = value;
            initializingHandler.chunk = chunk;
            return;
          }
        }
        chunk.status = "fulfilled";
        chunk.value = value;
        moveDebugInfoFromChunkToInnerValue(chunk, value);
      } catch (error) {
        chunk.status = "rejected", chunk.reason = error;
      } finally {
        initializingHandler = prevHandler, initializingChunk = prevChunk;
      }
    }
    function initializeModuleChunk(chunk) {
      try {
        var value = requireModule2(chunk.value);
        chunk.status = "fulfilled";
        chunk.value = value;
      } catch (error) {
        chunk.status = "rejected", chunk.reason = error;
      }
    }
    function reportGlobalError(weakResponse, error) {
      if (void 0 !== weakResponse.weak.deref()) {
        var response = unwrapWeakResponse(weakResponse);
        response._closed = true;
        response._closedReason = error;
        response._chunks.forEach(function(chunk) {
          "pending" === chunk.status ? triggerErrorOnChunk(response, chunk, error) : "fulfilled" === chunk.status && null !== chunk.reason && chunk.reason.error(error);
        });
        weakResponse = response._debugChannel;
        void 0 !== weakResponse && (closeDebugChannel(weakResponse), response._debugChannel = void 0, null !== debugChannelRegistry && debugChannelRegistry.unregister(response));
      }
    }
    function nullRefGetter() {
      return null;
    }
    function getTaskName(type) {
      if (type === REACT_FRAGMENT_TYPE) return "<>";
      if ("function" === typeof type) return '"use client"';
      if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE)
        return type._init === readChunk ? '"use client"' : "<...>";
      try {
        var name = getComponentNameFromType(type);
        return name ? "<" + name + ">" : "<...>";
      } catch (x) {
        return "<...>";
      }
    }
    function initializeElement(response, element, lazyNode) {
      var stack = element._debugStack, owner = element._owner;
      null === owner && (element._owner = response._debugRootOwner);
      var env = response._rootEnvironmentName;
      null !== owner && null != owner.env && (env = owner.env);
      var normalizedStackTrace = null;
      null === owner && null != response._debugRootStack ? normalizedStackTrace = response._debugRootStack : null !== stack && (normalizedStackTrace = createFakeJSXCallStackInDEV(
        response,
        stack,
        env
      ));
      element._debugStack = normalizedStackTrace;
      normalizedStackTrace = null;
      supportsCreateTask && null !== stack && (normalizedStackTrace = console.createTask.bind(
        console,
        getTaskName(element.type)
      ), stack = buildFakeCallStack(
        response,
        stack,
        env,
        false,
        normalizedStackTrace
      ), env = null === owner ? null : initializeFakeTask(response, owner), null === env ? (env = response._debugRootTask, normalizedStackTrace = null != env ? env.run(stack) : stack()) : normalizedStackTrace = env.run(stack));
      element._debugTask = normalizedStackTrace;
      null !== owner && initializeFakeStack(response, owner);
      null !== lazyNode && (lazyNode._store && lazyNode._store.validated && !element._store.validated && (element._store.validated = lazyNode._store.validated), "fulfilled" === lazyNode._payload.status && lazyNode._debugInfo && (response = lazyNode._debugInfo.splice(0), element._debugInfo ? element._debugInfo.unshift.apply(element._debugInfo, response) : Object.defineProperty(element, "_debugInfo", {
        configurable: false,
        enumerable: false,
        writable: true,
        value: response
      })));
      Object.freeze(element.props);
    }
    function createLazyChunkWrapper(chunk, validated) {
      var lazyType = {
        $$typeof: REACT_LAZY_TYPE,
        _payload: chunk,
        _init: readChunk
      };
      lazyType._debugInfo = chunk._debugInfo;
      lazyType._store = { validated };
      return lazyType;
    }
    function getChunk(response, id) {
      var chunks = response._chunks, chunk = chunks.get(id);
      chunk || (chunk = response._closed ? new ReactPromise("rejected", null, response._closedReason) : createPendingChunk(response), chunks.set(id, chunk));
      return chunk;
    }
    function fulfillReference(reference, value, fulfilledChunk) {
      var response = reference.response, handler = reference.handler, parentObject = reference.parentObject, key = reference.key, map = reference.map, path = reference.path;
      try {
        for (var i = 1; i < path.length; i++) {
          for (; "object" === typeof value && null !== value && value.$$typeof === REACT_LAZY_TYPE; ) {
            var referencedChunk = value._payload;
            if (referencedChunk === handler.chunk) value = handler.value;
            else {
              switch (referencedChunk.status) {
                case "resolved_model":
                  initializeModelChunk(referencedChunk);
                  break;
                case "resolved_module":
                  initializeModuleChunk(referencedChunk);
              }
              switch (referencedChunk.status) {
                case "fulfilled":
                  value = referencedChunk.value;
                  continue;
                case "blocked":
                  var cyclicHandler = resolveBlockedCycle(
                    referencedChunk,
                    reference
                  );
                  if (null !== cyclicHandler) {
                    value = cyclicHandler.value;
                    continue;
                  }
                case "pending":
                  path.splice(0, i - 1);
                  null === referencedChunk.value ? referencedChunk.value = [reference] : referencedChunk.value.push(reference);
                  null === referencedChunk.reason ? referencedChunk.reason = [reference] : referencedChunk.reason.push(reference);
                  return;
                case "halted":
                  return;
                default:
                  rejectReference(reference, referencedChunk.reason);
                  return;
              }
            }
          }
          var name = path[i];
          if ("object" === typeof value && null !== value && hasOwnProperty.call(value, name))
            value = value[name];
          else throw Error("Invalid reference.");
        }
        for (; "object" === typeof value && null !== value && value.$$typeof === REACT_LAZY_TYPE; ) {
          var _referencedChunk = value._payload;
          if (_referencedChunk === handler.chunk) value = handler.value;
          else {
            switch (_referencedChunk.status) {
              case "resolved_model":
                initializeModelChunk(_referencedChunk);
                break;
              case "resolved_module":
                initializeModuleChunk(_referencedChunk);
            }
            switch (_referencedChunk.status) {
              case "fulfilled":
                value = _referencedChunk.value;
                continue;
            }
            break;
          }
        }
        var mappedValue = map(response, value, parentObject, key);
        "__proto__" !== key && (parentObject[key] = mappedValue);
        "" === key && null === handler.value && (handler.value = mappedValue);
        if (parentObject[0] === REACT_ELEMENT_TYPE && "object" === typeof handler.value && null !== handler.value && handler.value.$$typeof === REACT_ELEMENT_TYPE) {
          var element = handler.value;
          switch (key) {
            case "3":
              transferReferencedDebugInfo(handler.chunk, fulfilledChunk);
              element.props = mappedValue;
              break;
            case "4":
              element._owner = mappedValue;
              break;
            case "5":
              element._debugStack = mappedValue;
              break;
            default:
              transferReferencedDebugInfo(handler.chunk, fulfilledChunk);
          }
        } else
          reference.isDebug || transferReferencedDebugInfo(handler.chunk, fulfilledChunk);
      } catch (error) {
        rejectReference(reference, error);
        return;
      }
      handler.deps--;
      0 === handler.deps && (reference = handler.chunk, null !== reference && "blocked" === reference.status && (value = reference.value, reference.status = "fulfilled", reference.value = handler.value, reference.reason = handler.reason, null !== value && wakeChunk(value, handler.value, reference)));
    }
    function rejectReference(reference, error) {
      var handler = reference.handler;
      reference = reference.response;
      if (!handler.errored) {
        var blockedValue = handler.value;
        handler.errored = true;
        handler.value = null;
        handler.reason = error;
        handler = handler.chunk;
        if (null !== handler && "blocked" === handler.status) {
          if ("object" === typeof blockedValue && null !== blockedValue && blockedValue.$$typeof === REACT_ELEMENT_TYPE) {
            var erroredComponent = {
              name: getComponentNameFromType(blockedValue.type) || "",
              owner: blockedValue._owner
            };
            erroredComponent.debugStack = blockedValue._debugStack;
            supportsCreateTask && (erroredComponent.debugTask = blockedValue._debugTask);
            handler._debugInfo.push(erroredComponent);
          }
          triggerErrorOnChunk(reference, handler, error);
        }
      }
    }
    function waitForReference(referencedChunk, parentObject, key, response, map, path, isAwaitingDebugInfo) {
      if (!(void 0 !== response._debugChannel && response._debugChannel.hasReadable || "pending" !== referencedChunk.status || parentObject[0] !== REACT_ELEMENT_TYPE || "4" !== key && "5" !== key))
        return null;
      if (initializingHandler) {
        var handler = initializingHandler;
        handler.deps++;
      } else
        handler = initializingHandler = {
          parent: null,
          chunk: null,
          value: null,
          reason: null,
          deps: 1,
          errored: false
        };
      parentObject = {
        response,
        handler,
        parentObject,
        key,
        map,
        path
      };
      parentObject.isDebug = isAwaitingDebugInfo;
      null === referencedChunk.value ? referencedChunk.value = [parentObject] : referencedChunk.value.push(parentObject);
      null === referencedChunk.reason ? referencedChunk.reason = [parentObject] : referencedChunk.reason.push(parentObject);
      return null;
    }
    function loadServerReference(response, metaData, parentObject, key) {
      if (!response._serverReferenceConfig)
        return createBoundServerReference(
          metaData,
          response._callServer,
          response._encodeFormAction,
          response._debugFindSourceMapURL
        );
      var serverReference = resolveServerReference(
        response._serverReferenceConfig,
        metaData.id
      ), promise = preloadModule(serverReference);
      if (promise)
        metaData.bound && (promise = Promise.all([promise, metaData.bound]));
      else if (metaData.bound) promise = Promise.resolve(metaData.bound);
      else
        return promise = requireModule2(serverReference), registerBoundServerReference(
          promise,
          metaData.id,
          metaData.bound,
          response._encodeFormAction
        ), promise;
      if (initializingHandler) {
        var handler = initializingHandler;
        handler.deps++;
      } else
        handler = initializingHandler = {
          parent: null,
          chunk: null,
          value: null,
          reason: null,
          deps: 1,
          errored: false
        };
      promise.then(
        function() {
          var resolvedValue = requireModule2(serverReference);
          if (metaData.bound) {
            var boundArgs = metaData.bound.value.slice(0);
            boundArgs.unshift(null);
            resolvedValue = resolvedValue.bind.apply(resolvedValue, boundArgs);
          }
          registerBoundServerReference(
            resolvedValue,
            metaData.id,
            metaData.bound,
            response._encodeFormAction
          );
          "__proto__" !== key && (parentObject[key] = resolvedValue);
          "" === key && null === handler.value && (handler.value = resolvedValue);
          if (parentObject[0] === REACT_ELEMENT_TYPE && "object" === typeof handler.value && null !== handler.value && handler.value.$$typeof === REACT_ELEMENT_TYPE)
            switch (boundArgs = handler.value, key) {
              case "3":
                boundArgs.props = resolvedValue;
                break;
              case "4":
                boundArgs._owner = resolvedValue;
            }
          handler.deps--;
          0 === handler.deps && (resolvedValue = handler.chunk, null !== resolvedValue && "blocked" === resolvedValue.status && (boundArgs = resolvedValue.value, resolvedValue.status = "fulfilled", resolvedValue.value = handler.value, resolvedValue.reason = null, null !== boundArgs && wakeChunk(boundArgs, handler.value, resolvedValue)));
        },
        function(error) {
          if (!handler.errored) {
            var blockedValue = handler.value;
            handler.errored = true;
            handler.value = null;
            handler.reason = error;
            var chunk = handler.chunk;
            if (null !== chunk && "blocked" === chunk.status) {
              if ("object" === typeof blockedValue && null !== blockedValue && blockedValue.$$typeof === REACT_ELEMENT_TYPE) {
                var erroredComponent = {
                  name: getComponentNameFromType(blockedValue.type) || "",
                  owner: blockedValue._owner
                };
                erroredComponent.debugStack = blockedValue._debugStack;
                supportsCreateTask && (erroredComponent.debugTask = blockedValue._debugTask);
                chunk._debugInfo.push(erroredComponent);
              }
              triggerErrorOnChunk(response, chunk, error);
            }
          }
        }
      );
      return null;
    }
    function resolveLazy(value) {
      for (; "object" === typeof value && null !== value && value.$$typeof === REACT_LAZY_TYPE; ) {
        var payload = value._payload;
        if ("fulfilled" === payload.status) value = payload.value;
        else break;
      }
      return value;
    }
    function transferReferencedDebugInfo(parentChunk, referencedChunk) {
      if (null !== parentChunk) {
        referencedChunk = referencedChunk._debugInfo;
        parentChunk = parentChunk._debugInfo;
        for (var i = 0; i < referencedChunk.length; ++i) {
          var debugInfoEntry = referencedChunk[i];
          null == debugInfoEntry.name && parentChunk.push(debugInfoEntry);
        }
      }
    }
    function getOutlinedModel(response, reference, parentObject, key, map) {
      var path = reference.split(":");
      reference = parseInt(path[0], 16);
      reference = getChunk(response, reference);
      null !== initializingChunk && isArrayImpl(initializingChunk._children) && initializingChunk._children.push(reference);
      switch (reference.status) {
        case "resolved_model":
          initializeModelChunk(reference);
          break;
        case "resolved_module":
          initializeModuleChunk(reference);
      }
      switch (reference.status) {
        case "fulfilled":
          for (var value = reference.value, i = 1; i < path.length; i++) {
            for (; "object" === typeof value && null !== value && value.$$typeof === REACT_LAZY_TYPE; ) {
              value = value._payload;
              switch (value.status) {
                case "resolved_model":
                  initializeModelChunk(value);
                  break;
                case "resolved_module":
                  initializeModuleChunk(value);
              }
              switch (value.status) {
                case "fulfilled":
                  value = value.value;
                  break;
                case "blocked":
                case "pending":
                  return waitForReference(
                    value,
                    parentObject,
                    key,
                    response,
                    map,
                    path.slice(i - 1),
                    false
                  );
                case "halted":
                  return initializingHandler ? (parentObject = initializingHandler, parentObject.deps++) : initializingHandler = {
                    parent: null,
                    chunk: null,
                    value: null,
                    reason: null,
                    deps: 1,
                    errored: false
                  }, null;
                default:
                  return initializingHandler ? (initializingHandler.errored = true, initializingHandler.value = null, initializingHandler.reason = value.reason) : initializingHandler = {
                    parent: null,
                    chunk: null,
                    value: null,
                    reason: value.reason,
                    deps: 0,
                    errored: true
                  }, null;
              }
            }
            value = value[path[i]];
          }
          for (; "object" === typeof value && null !== value && value.$$typeof === REACT_LAZY_TYPE; ) {
            path = value._payload;
            switch (path.status) {
              case "resolved_model":
                initializeModelChunk(path);
                break;
              case "resolved_module":
                initializeModuleChunk(path);
            }
            switch (path.status) {
              case "fulfilled":
                value = path.value;
                continue;
            }
            break;
          }
          response = map(response, value, parentObject, key);
          (parentObject[0] !== REACT_ELEMENT_TYPE || "4" !== key && "5" !== key) && transferReferencedDebugInfo(initializingChunk, reference);
          return response;
        case "pending":
        case "blocked":
          return waitForReference(
            reference,
            parentObject,
            key,
            response,
            map,
            path,
            false
          );
        case "halted":
          return initializingHandler ? (parentObject = initializingHandler, parentObject.deps++) : initializingHandler = {
            parent: null,
            chunk: null,
            value: null,
            reason: null,
            deps: 1,
            errored: false
          }, null;
        default:
          return initializingHandler ? (initializingHandler.errored = true, initializingHandler.value = null, initializingHandler.reason = reference.reason) : initializingHandler = {
            parent: null,
            chunk: null,
            value: null,
            reason: reference.reason,
            deps: 0,
            errored: true
          }, null;
      }
    }
    function createMap(response, model) {
      return new Map(model);
    }
    function createSet(response, model) {
      return new Set(model);
    }
    function createBlob(response, model) {
      return new Blob(model.slice(1), { type: model[0] });
    }
    function createFormData(response, model) {
      response = new FormData();
      for (var i = 0; i < model.length; i++)
        response.append(model[i][0], model[i][1]);
      return response;
    }
    function applyConstructor(response, model, parentObject) {
      Object.setPrototypeOf(parentObject, model.prototype);
    }
    function defineLazyGetter(response, chunk, parentObject, key) {
      "__proto__" !== key && Object.defineProperty(parentObject, key, {
        get: function() {
          "resolved_model" === chunk.status && initializeModelChunk(chunk);
          switch (chunk.status) {
            case "fulfilled":
              return chunk.value;
            case "rejected":
              throw chunk.reason;
          }
          return "This object has been omitted by React in the console log to avoid sending too much data from the server. Try logging smaller or more specific objects.";
        },
        enumerable: true,
        configurable: false
      });
      return null;
    }
    function extractIterator(response, model) {
      return model[Symbol.iterator]();
    }
    function createModel(response, model) {
      return model;
    }
    function getInferredFunctionApproximate(code) {
      code = code.startsWith("Object.defineProperty(") ? code.slice(22) : code.startsWith("(") ? code.slice(1) : code;
      if (code.startsWith("async function")) {
        var idx = code.indexOf("(", 14);
        if (-1 !== idx)
          return code = code.slice(14, idx).trim(), (0, eval)("({" + JSON.stringify(code) + ":async function(){}})")[code];
      } else if (code.startsWith("function")) {
        if (idx = code.indexOf("(", 8), -1 !== idx)
          return code = code.slice(8, idx).trim(), (0, eval)("({" + JSON.stringify(code) + ":function(){}})")[code];
      } else if (code.startsWith("class") && (idx = code.indexOf("{", 5), -1 !== idx))
        return code = code.slice(5, idx).trim(), (0, eval)("({" + JSON.stringify(code) + ":class{}})")[code];
      return function() {
      };
    }
    function parseModelString(response, parentObject, key, value) {
      if ("$" === value[0]) {
        if ("$" === value)
          return null !== initializingHandler && "0" === key && (initializingHandler = {
            parent: initializingHandler,
            chunk: null,
            value: null,
            reason: null,
            deps: 0,
            errored: false
          }), REACT_ELEMENT_TYPE;
        switch (value[1]) {
          case "$":
            return value.slice(1);
          case "L":
            return parentObject = parseInt(value.slice(2), 16), response = getChunk(response, parentObject), null !== initializingChunk && isArrayImpl(initializingChunk._children) && initializingChunk._children.push(response), createLazyChunkWrapper(response, 0);
          case "@":
            return parentObject = parseInt(value.slice(2), 16), response = getChunk(response, parentObject), null !== initializingChunk && isArrayImpl(initializingChunk._children) && initializingChunk._children.push(response), response;
          case "S":
            return Symbol.for(value.slice(2));
          case "h":
            var ref = value.slice(2);
            return getOutlinedModel(
              response,
              ref,
              parentObject,
              key,
              loadServerReference
            );
          case "T":
            parentObject = "$" + value.slice(2);
            response = response._tempRefs;
            if (null == response)
              throw Error(
                "Missing a temporary reference set but the RSC response returned a temporary reference. Pass a temporaryReference option with the set that was used with the reply."
              );
            return response.get(parentObject);
          case "Q":
            return ref = value.slice(2), getOutlinedModel(response, ref, parentObject, key, createMap);
          case "W":
            return ref = value.slice(2), getOutlinedModel(response, ref, parentObject, key, createSet);
          case "B":
            return ref = value.slice(2), getOutlinedModel(response, ref, parentObject, key, createBlob);
          case "K":
            return ref = value.slice(2), getOutlinedModel(response, ref, parentObject, key, createFormData);
          case "Z":
            return ref = value.slice(2), getOutlinedModel(
              response,
              ref,
              parentObject,
              key,
              resolveErrorDev
            );
          case "i":
            return ref = value.slice(2), getOutlinedModel(
              response,
              ref,
              parentObject,
              key,
              extractIterator
            );
          case "I":
            return Infinity;
          case "-":
            return "$-0" === value ? -0 : -Infinity;
          case "N":
            return NaN;
          case "u":
            return;
          case "D":
            return new Date(Date.parse(value.slice(2)));
          case "n":
            return BigInt(value.slice(2));
          case "P":
            return ref = value.slice(2), getOutlinedModel(
              response,
              ref,
              parentObject,
              key,
              applyConstructor
            );
          case "E":
            response = value.slice(2);
            try {
              if (!mightHaveStaticConstructor.test(response))
                return (0, eval)(response);
            } catch (x) {
            }
            try {
              if (ref = getInferredFunctionApproximate(response), response.startsWith("Object.defineProperty(")) {
                var idx = response.lastIndexOf(',"name",{value:"');
                if (-1 !== idx) {
                  var name = JSON.parse(
                    response.slice(idx + 16 - 1, response.length - 2)
                  );
                  Object.defineProperty(ref, "name", { value: name });
                }
              }
            } catch (_) {
              ref = function() {
              };
            }
            return ref;
          case "Y":
            if (2 < value.length && (ref = response._debugChannel && response._debugChannel.callback)) {
              if ("@" === value[2])
                return parentObject = value.slice(3), key = parseInt(parentObject, 16), response._chunks.has(key) || ref("P:" + parentObject), getChunk(response, key);
              value = value.slice(2);
              idx = parseInt(value, 16);
              response._chunks.has(idx) || ref("Q:" + value);
              ref = getChunk(response, idx);
              return "fulfilled" === ref.status ? ref.value : defineLazyGetter(response, ref, parentObject, key);
            }
            "__proto__" !== key && Object.defineProperty(parentObject, key, {
              get: function() {
                return "This object has been omitted by React in the console log to avoid sending too much data from the server. Try logging smaller or more specific objects.";
              },
              enumerable: true,
              configurable: false
            });
            return null;
          default:
            return ref = value.slice(1), getOutlinedModel(response, ref, parentObject, key, createModel);
        }
      }
      return value;
    }
    function missingCall() {
      throw Error(
        'Trying to call a function from "use server" but the callServer option was not implemented in your router runtime.'
      );
    }
    function ResponseInstance(bundlerConfig, serverReferenceConfig, moduleLoading, callServer, encodeFormAction, nonce, temporaryReferences, findSourceMapURL, replayConsole, environmentName, debugChannel) {
      var chunks = /* @__PURE__ */ new Map();
      this._bundlerConfig = bundlerConfig;
      this._serverReferenceConfig = serverReferenceConfig;
      this._moduleLoading = moduleLoading;
      this._callServer = void 0 !== callServer ? callServer : missingCall;
      this._encodeFormAction = encodeFormAction;
      this._nonce = nonce;
      this._chunks = chunks;
      this._stringDecoder = new TextDecoder();
      this._fromJSON = null;
      this._closed = false;
      this._closedReason = null;
      this._tempRefs = temporaryReferences;
      this._timeOrigin = 0;
      this._pendingInitialRender = null;
      this._pendingChunks = 0;
      this._weakResponse = { weak: new WeakRef(this), response: this };
      this._debugRootOwner = bundlerConfig = void 0 === ReactSharedInteralsServer || null === ReactSharedInteralsServer.A ? null : ReactSharedInteralsServer.A.getOwner();
      this._debugRootStack = null !== bundlerConfig ? Error("react-stack-top-frame") : null;
      environmentName = void 0 === environmentName ? "Server" : environmentName;
      supportsCreateTask && (this._debugRootTask = console.createTask(
        '"use ' + environmentName.toLowerCase() + '"'
      ));
      this._debugStartTime = performance.now();
      this._debugFindSourceMapURL = findSourceMapURL;
      this._debugChannel = debugChannel;
      this._blockedConsole = null;
      this._replayConsole = replayConsole;
      this._rootEnvironmentName = environmentName;
      debugChannel && (null === debugChannelRegistry ? (closeDebugChannel(debugChannel), this._debugChannel = void 0) : debugChannelRegistry.register(this, debugChannel, this));
      replayConsole && markAllTracksInOrder();
      this._fromJSON = createFromJSONCallback(this);
    }
    function createStreamState(weakResponse, streamDebugValue) {
      var streamState = {
        _rowState: 0,
        _rowID: 0,
        _rowTag: 0,
        _rowLength: 0,
        _buffer: []
      };
      weakResponse = unwrapWeakResponse(weakResponse);
      var debugValuePromise = Promise.resolve(streamDebugValue);
      debugValuePromise.status = "fulfilled";
      debugValuePromise.value = streamDebugValue;
      streamState._debugInfo = {
        name: "RSC stream",
        start: weakResponse._debugStartTime,
        end: weakResponse._debugStartTime,
        byteSize: 0,
        value: debugValuePromise,
        owner: weakResponse._debugRootOwner,
        debugStack: weakResponse._debugRootStack,
        debugTask: weakResponse._debugRootTask
      };
      streamState._debugTargetChunkSize = MIN_CHUNK_SIZE;
      return streamState;
    }
    function addDebugInfo(chunk, debugInfo) {
      var value = resolveLazy(chunk.value);
      "object" !== typeof value || null === value || !isArrayImpl(value) && "function" !== typeof value[ASYNC_ITERATOR] && value.$$typeof !== REACT_ELEMENT_TYPE && value.$$typeof !== REACT_LAZY_TYPE ? chunk._debugInfo.push.apply(chunk._debugInfo, debugInfo) : isArrayImpl(value._debugInfo) ? value._debugInfo.push.apply(value._debugInfo, debugInfo) : Object.defineProperty(value, "_debugInfo", {
        configurable: false,
        enumerable: false,
        writable: true,
        value: debugInfo
      });
    }
    function resolveChunkDebugInfo(streamState, chunk) {
      streamState = [{ awaited: streamState._debugInfo }];
      "pending" === chunk.status || "blocked" === chunk.status ? (streamState = addDebugInfo.bind(null, chunk, streamState), chunk.then(streamState, streamState)) : addDebugInfo(chunk, streamState);
    }
    function resolveBuffer(response, id, buffer, streamState) {
      var chunks = response._chunks, chunk = chunks.get(id);
      chunk && "pending" !== chunk.status ? chunk.reason.enqueueValue(buffer) : (chunk && releasePendingChunk(response, chunk), response = new ReactPromise("fulfilled", buffer, null), resolveChunkDebugInfo(streamState, response), chunks.set(id, response));
    }
    function resolveModule(response, id, model, streamState) {
      var chunks = response._chunks, chunk = chunks.get(id);
      model = JSON.parse(model, response._fromJSON);
      var clientReference = resolveClientReference(
        response._bundlerConfig,
        model
      );
      prepareDestinationWithChunks(
        response._moduleLoading,
        model[1],
        response._nonce
      );
      if (model = preloadModule(clientReference)) {
        if (chunk) {
          releasePendingChunk(response, chunk);
          var blockedChunk = chunk;
          blockedChunk.status = "blocked";
        } else
          blockedChunk = new ReactPromise("blocked", null, null), chunks.set(id, blockedChunk);
        resolveChunkDebugInfo(streamState, blockedChunk);
        model.then(
          function() {
            return resolveModuleChunk(response, blockedChunk, clientReference);
          },
          function(error) {
            return triggerErrorOnChunk(response, blockedChunk, error);
          }
        );
      } else
        chunk ? (resolveChunkDebugInfo(streamState, chunk), resolveModuleChunk(response, chunk, clientReference)) : (chunk = new ReactPromise(
          "resolved_module",
          clientReference,
          null
        ), resolveChunkDebugInfo(streamState, chunk), chunks.set(id, chunk));
    }
    function resolveStream(response, id, stream, controller, streamState) {
      var chunks = response._chunks, chunk = chunks.get(id);
      if (chunk) {
        if (resolveChunkDebugInfo(streamState, chunk), "pending" === chunk.status) {
          releasePendingChunk(response, chunk);
          id = chunk.value;
          if (null != chunk._debugChunk) {
            streamState = initializingHandler;
            chunks = initializingChunk;
            initializingHandler = null;
            chunk.status = "blocked";
            chunk.value = null;
            chunk.reason = null;
            initializingChunk = chunk;
            try {
              if (initializeDebugChunk(response, chunk), null !== initializingHandler && !initializingHandler.errored && 0 < initializingHandler.deps) {
                initializingHandler.value = stream;
                initializingHandler.reason = controller;
                initializingHandler.chunk = chunk;
                return;
              }
            } finally {
              initializingHandler = streamState, initializingChunk = chunks;
            }
          }
          chunk.status = "fulfilled";
          chunk.value = stream;
          chunk.reason = controller;
          null !== id && wakeChunk(id, chunk.value, chunk);
        }
      } else
        response = new ReactPromise("fulfilled", stream, controller), resolveChunkDebugInfo(streamState, response), chunks.set(id, response);
    }
    function startReadableStream(response, id, type, streamState) {
      var controller = null, closed = false;
      type = new ReadableStream({
        type,
        start: function(c) {
          controller = c;
        }
      });
      var previousBlockedChunk = null;
      resolveStream(
        response,
        id,
        type,
        {
          enqueueValue: function(value) {
            null === previousBlockedChunk ? controller.enqueue(value) : previousBlockedChunk.then(function() {
              controller.enqueue(value);
            });
          },
          enqueueModel: function(json) {
            if (null === previousBlockedChunk) {
              var chunk = createResolvedModelChunk(response, json);
              initializeModelChunk(chunk);
              "fulfilled" === chunk.status ? controller.enqueue(chunk.value) : (chunk.then(
                function(v) {
                  return controller.enqueue(v);
                },
                function(e) {
                  return controller.error(e);
                }
              ), previousBlockedChunk = chunk);
            } else {
              chunk = previousBlockedChunk;
              var _chunk3 = createPendingChunk(response);
              _chunk3.then(
                function(v) {
                  return controller.enqueue(v);
                },
                function(e) {
                  return controller.error(e);
                }
              );
              previousBlockedChunk = _chunk3;
              chunk.then(function() {
                previousBlockedChunk === _chunk3 && (previousBlockedChunk = null);
                resolveModelChunk(response, _chunk3, json);
              });
            }
          },
          close: function() {
            if (!closed)
              if (closed = true, null === previousBlockedChunk)
                controller.close();
              else {
                var blockedChunk = previousBlockedChunk;
                previousBlockedChunk = null;
                blockedChunk.then(function() {
                  return controller.close();
                });
              }
          },
          error: function(error) {
            if (!closed)
              if (closed = true, null === previousBlockedChunk)
                controller.error(error);
              else {
                var blockedChunk = previousBlockedChunk;
                previousBlockedChunk = null;
                blockedChunk.then(function() {
                  return controller.error(error);
                });
              }
          }
        },
        streamState
      );
    }
    function asyncIterator() {
      return this;
    }
    function createIterator(next) {
      next = { next };
      next[ASYNC_ITERATOR] = asyncIterator;
      return next;
    }
    function startAsyncIterable(response, id, iterator, streamState) {
      var buffer = [], closed = false, nextWriteIndex = 0, iterable = {};
      iterable[ASYNC_ITERATOR] = function() {
        var nextReadIndex = 0;
        return createIterator(function(arg) {
          if (void 0 !== arg)
            throw Error(
              "Values cannot be passed to next() of AsyncIterables passed to Client Components."
            );
          if (nextReadIndex === buffer.length) {
            if (closed)
              return new ReactPromise(
                "fulfilled",
                { done: true, value: void 0 },
                null
              );
            buffer[nextReadIndex] = createPendingChunk(response);
          }
          return buffer[nextReadIndex++];
        });
      };
      resolveStream(
        response,
        id,
        iterator ? iterable[ASYNC_ITERATOR]() : iterable,
        {
          enqueueValue: function(value) {
            if (nextWriteIndex === buffer.length)
              buffer[nextWriteIndex] = new ReactPromise(
                "fulfilled",
                { done: false, value },
                null
              );
            else {
              var chunk = buffer[nextWriteIndex], resolveListeners = chunk.value, rejectListeners = chunk.reason;
              chunk.status = "fulfilled";
              chunk.value = { done: false, value };
              chunk.reason = null;
              null !== resolveListeners && wakeChunkIfInitialized(
                chunk,
                resolveListeners,
                rejectListeners
              );
            }
            nextWriteIndex++;
          },
          enqueueModel: function(value) {
            nextWriteIndex === buffer.length ? buffer[nextWriteIndex] = createResolvedIteratorResultChunk(
              response,
              value,
              false
            ) : resolveIteratorResultChunk(
              response,
              buffer[nextWriteIndex],
              value,
              false
            );
            nextWriteIndex++;
          },
          close: function(value) {
            if (!closed)
              for (closed = true, nextWriteIndex === buffer.length ? buffer[nextWriteIndex] = createResolvedIteratorResultChunk(response, value, true) : resolveIteratorResultChunk(
                response,
                buffer[nextWriteIndex],
                value,
                true
              ), nextWriteIndex++; nextWriteIndex < buffer.length; )
                resolveIteratorResultChunk(
                  response,
                  buffer[nextWriteIndex++],
                  '"$undefined"',
                  true
                );
          },
          error: function(error) {
            if (!closed)
              for (closed = true, nextWriteIndex === buffer.length && (buffer[nextWriteIndex] = createPendingChunk(response)); nextWriteIndex < buffer.length; )
                triggerErrorOnChunk(response, buffer[nextWriteIndex++], error);
          }
        },
        streamState
      );
    }
    function resolveErrorDev(response, errorInfo) {
      var name = errorInfo.name, env = errorInfo.env;
      var error = buildFakeCallStack(
        response,
        errorInfo.stack,
        env,
        false,
        Error.bind(
          null,
          errorInfo.message || "An error occurred in the Server Components render but no message was provided"
        )
      );
      var ownerTask = null;
      null != errorInfo.owner && (errorInfo = errorInfo.owner.slice(1), errorInfo = getOutlinedModel(
        response,
        errorInfo,
        {},
        "",
        createModel
      ), null !== errorInfo && (ownerTask = initializeFakeTask(response, errorInfo)));
      null === ownerTask ? (response = getRootTask(response, env), error = null != response ? response.run(error) : error()) : error = ownerTask.run(error);
      error.name = name;
      error.environmentName = env;
      return error;
    }
    function createFakeFunction(name, filename, sourceMap, line, col, enclosingLine, enclosingCol, environmentName) {
      name || (name = "<anonymous>");
      var encodedName = JSON.stringify(name);
      1 > enclosingLine ? enclosingLine = 0 : enclosingLine--;
      1 > enclosingCol ? enclosingCol = 0 : enclosingCol--;
      1 > line ? line = 0 : line--;
      1 > col ? col = 0 : col--;
      if (line < enclosingLine || line === enclosingLine && col < enclosingCol)
        enclosingCol = enclosingLine = 0;
      1 > line ? (line = encodedName.length + 3, enclosingCol -= line, 0 > enclosingCol && (enclosingCol = 0), col = col - enclosingCol - line - 3, 0 > col && (col = 0), encodedName = "({" + encodedName + ":" + " ".repeat(enclosingCol) + "_=>" + " ".repeat(col) + "_()})") : 1 > enclosingLine ? (enclosingCol -= encodedName.length + 3, 0 > enclosingCol && (enclosingCol = 0), encodedName = "({" + encodedName + ":" + " ".repeat(enclosingCol) + "_=>" + "\n".repeat(line - enclosingLine) + " ".repeat(col) + "_()})") : enclosingLine === line ? (col = col - enclosingCol - 3, 0 > col && (col = 0), encodedName = "\n".repeat(enclosingLine - 1) + "({" + encodedName + ":\n" + " ".repeat(enclosingCol) + "_=>" + " ".repeat(col) + "_()})") : encodedName = "\n".repeat(enclosingLine - 1) + "({" + encodedName + ":\n" + " ".repeat(enclosingCol) + "_=>" + "\n".repeat(line - enclosingLine) + " ".repeat(col) + "_()})";
      encodedName = 1 > enclosingLine ? encodedName + "\n/* This module was rendered by a Server Component. Turn on Source Maps to see the server source. */" : "/* This module was rendered by a Server Component. Turn on Source Maps to see the server source. */" + encodedName;
      filename.startsWith("/") && (filename = "file://" + filename);
      sourceMap ? (encodedName += "\n//# sourceURL=about://React/" + encodeURIComponent(environmentName) + "/" + encodeURI(filename) + "?" + fakeFunctionIdx++, encodedName += "\n//# sourceMappingURL=" + sourceMap) : encodedName = filename ? encodedName + ("\n//# sourceURL=" + encodeURI(filename)) : encodedName + "\n//# sourceURL=<anonymous>";
      try {
        var fn = (0, eval)(encodedName)[name];
      } catch (x) {
        fn = function(_) {
          return _();
        };
      }
      return fn;
    }
    function buildFakeCallStack(response, stack, environmentName, useEnclosingLine, innerCall) {
      for (var i = 0; i < stack.length; i++) {
        var frame = stack[i], frameKey = frame.join("-") + "-" + environmentName + (useEnclosingLine ? "-e" : "-n"), fn = fakeFunctionCache.get(frameKey);
        if (void 0 === fn) {
          fn = frame[0];
          var filename = frame[1], line = frame[2], col = frame[3], enclosingLine = frame[4];
          frame = frame[5];
          var findSourceMapURL = response._debugFindSourceMapURL;
          findSourceMapURL = findSourceMapURL ? findSourceMapURL(filename, environmentName) : null;
          fn = createFakeFunction(
            fn,
            filename,
            findSourceMapURL,
            line,
            col,
            useEnclosingLine ? line : enclosingLine,
            useEnclosingLine ? col : frame,
            environmentName
          );
          fakeFunctionCache.set(frameKey, fn);
        }
        innerCall = fn.bind(null, innerCall);
      }
      return innerCall;
    }
    function getRootTask(response, childEnvironmentName) {
      var rootTask = response._debugRootTask;
      return rootTask ? response._rootEnvironmentName !== childEnvironmentName ? (response = console.createTask.bind(
        console,
        '"use ' + childEnvironmentName.toLowerCase() + '"'
      ), rootTask.run(response)) : rootTask : null;
    }
    function initializeFakeTask(response, debugInfo) {
      if (!supportsCreateTask || null == debugInfo.stack) return null;
      var cachedEntry = debugInfo.debugTask;
      if (void 0 !== cachedEntry) return cachedEntry;
      var useEnclosingLine = void 0 === debugInfo.key, stack = debugInfo.stack, env = null == debugInfo.env ? response._rootEnvironmentName : debugInfo.env;
      cachedEntry = null == debugInfo.owner || null == debugInfo.owner.env ? response._rootEnvironmentName : debugInfo.owner.env;
      var ownerTask = null == debugInfo.owner ? null : initializeFakeTask(response, debugInfo.owner);
      env = env !== cachedEntry ? '"use ' + env.toLowerCase() + '"' : void 0 !== debugInfo.key ? "<" + (debugInfo.name || "...") + ">" : void 0 !== debugInfo.name ? debugInfo.name || "unknown" : "await " + (debugInfo.awaited.name || "unknown");
      env = console.createTask.bind(console, env);
      useEnclosingLine = buildFakeCallStack(
        response,
        stack,
        cachedEntry,
        useEnclosingLine,
        env
      );
      null === ownerTask ? (response = getRootTask(response, cachedEntry), response = null != response ? response.run(useEnclosingLine) : useEnclosingLine()) : response = ownerTask.run(useEnclosingLine);
      return debugInfo.debugTask = response;
    }
    function fakeJSXCallSite() {
      return Error("react-stack-top-frame");
    }
    function initializeFakeStack(response, debugInfo) {
      if (void 0 === debugInfo.debugStack) {
        null != debugInfo.stack && (debugInfo.debugStack = createFakeJSXCallStackInDEV(
          response,
          debugInfo.stack,
          null == debugInfo.env ? "" : debugInfo.env
        ));
        var owner = debugInfo.owner;
        null != owner && (initializeFakeStack(response, owner), void 0 === owner.debugLocation && null != debugInfo.debugStack && (owner.debugLocation = debugInfo.debugStack));
      }
    }
    function initializeDebugInfo(response, debugInfo) {
      void 0 !== debugInfo.stack && initializeFakeTask(response, debugInfo);
      if (null == debugInfo.owner && null != response._debugRootOwner) {
        var _componentInfoOrAsyncInfo = debugInfo;
        _componentInfoOrAsyncInfo.owner = response._debugRootOwner;
        _componentInfoOrAsyncInfo.stack = null;
        _componentInfoOrAsyncInfo.debugStack = response._debugRootStack;
        _componentInfoOrAsyncInfo.debugTask = response._debugRootTask;
      } else
        void 0 !== debugInfo.stack && initializeFakeStack(response, debugInfo);
      "number" === typeof debugInfo.time && (debugInfo = { time: debugInfo.time + response._timeOrigin });
      return debugInfo;
    }
    function getCurrentStackInDEV() {
      var owner = currentOwnerInDEV;
      if (null === owner) return "";
      try {
        var info = "";
        if (owner.owner || "string" !== typeof owner.name) {
          for (; owner; ) {
            var ownerStack = owner.debugStack;
            if (null != ownerStack) {
              if (owner = owner.owner) {
                var JSCompiler_temp_const = info;
                var error = ownerStack, prevPrepareStackTrace = Error.prepareStackTrace;
                Error.prepareStackTrace = prepareStackTrace;
                var stack = error.stack;
                Error.prepareStackTrace = prevPrepareStackTrace;
                stack.startsWith("Error: react-stack-top-frame\n") && (stack = stack.slice(29));
                var idx = stack.indexOf("\n");
                -1 !== idx && (stack = stack.slice(idx + 1));
                idx = stack.indexOf("react_stack_bottom_frame");
                -1 !== idx && (idx = stack.lastIndexOf("\n", idx));
                var JSCompiler_inline_result = -1 !== idx ? stack = stack.slice(0, idx) : "";
                info = JSCompiler_temp_const + ("\n" + JSCompiler_inline_result);
              }
            } else break;
          }
          var JSCompiler_inline_result$jscomp$0 = info;
        } else {
          JSCompiler_temp_const = owner.name;
          if (void 0 === prefix)
            try {
              throw Error();
            } catch (x) {
              prefix = (error = x.stack.trim().match(/\n( *(at )?)/)) && error[1] || "", suffix = -1 < x.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < x.stack.indexOf("@") ? "@unknown:0:0" : "";
            }
          JSCompiler_inline_result$jscomp$0 = "\n" + prefix + JSCompiler_temp_const + suffix;
        }
      } catch (x) {
        JSCompiler_inline_result$jscomp$0 = "\nError generating stack: " + x.message + "\n" + x.stack;
      }
      return JSCompiler_inline_result$jscomp$0;
    }
    function resolveConsoleEntry(response, json) {
      if (response._replayConsole) {
        var blockedChunk = response._blockedConsole;
        if (null == blockedChunk)
          blockedChunk = createResolvedModelChunk(response, json), initializeModelChunk(blockedChunk), "fulfilled" === blockedChunk.status ? replayConsoleWithCallStackInDEV(response, blockedChunk.value) : (blockedChunk.then(
            function(v) {
              return replayConsoleWithCallStackInDEV(response, v);
            },
            function() {
            }
          ), response._blockedConsole = blockedChunk);
        else {
          var _chunk4 = createPendingChunk(response);
          _chunk4.then(
            function(v) {
              return replayConsoleWithCallStackInDEV(response, v);
            },
            function() {
            }
          );
          response._blockedConsole = _chunk4;
          var unblock = function() {
            response._blockedConsole === _chunk4 && (response._blockedConsole = null);
            resolveModelChunk(response, _chunk4, json);
          };
          blockedChunk.then(unblock, unblock);
        }
      }
    }
    function initializeIOInfo(response, ioInfo) {
      void 0 !== ioInfo.stack && (initializeFakeTask(response, ioInfo), initializeFakeStack(response, ioInfo));
      ioInfo.start += response._timeOrigin;
      ioInfo.end += response._timeOrigin;
      if (response._replayConsole) {
        response = response._rootEnvironmentName;
        var promise = ioInfo.value;
        if (promise)
          switch (promise.status) {
            case "fulfilled":
              logIOInfo(ioInfo, response, promise.value);
              break;
            case "rejected":
              logIOInfoErrored(ioInfo, response, promise.reason);
              break;
            default:
              promise.then(
                logIOInfo.bind(null, ioInfo, response),
                logIOInfoErrored.bind(null, ioInfo, response)
              );
          }
        else logIOInfo(ioInfo, response, void 0);
      }
    }
    function resolveIOInfo(response, id, model) {
      var chunks = response._chunks, chunk = chunks.get(id);
      chunk ? (resolveModelChunk(response, chunk, model), "resolved_model" === chunk.status && initializeModelChunk(chunk)) : (chunk = createResolvedModelChunk(response, model), chunks.set(id, chunk), initializeModelChunk(chunk));
      "fulfilled" === chunk.status ? initializeIOInfo(response, chunk.value) : chunk.then(
        function(v) {
          initializeIOInfo(response, v);
        },
        function() {
        }
      );
    }
    function mergeBuffer(buffer, lastChunk) {
      for (var l = buffer.length, byteLength = lastChunk.length, i = 0; i < l; i++)
        byteLength += buffer[i].byteLength;
      byteLength = new Uint8Array(byteLength);
      for (var _i3 = i = 0; _i3 < l; _i3++) {
        var chunk = buffer[_i3];
        byteLength.set(chunk, i);
        i += chunk.byteLength;
      }
      byteLength.set(lastChunk, i);
      return byteLength;
    }
    function resolveTypedArray(response, id, buffer, lastChunk, constructor, bytesPerElement, streamState) {
      buffer = 0 === buffer.length && 0 === lastChunk.byteOffset % bytesPerElement ? lastChunk : mergeBuffer(buffer, lastChunk);
      constructor = new constructor(
        buffer.buffer,
        buffer.byteOffset,
        buffer.byteLength / bytesPerElement
      );
      resolveBuffer(response, id, constructor, streamState);
    }
    function flushComponentPerformance(response$jscomp$0, root, trackIdx$jscomp$6, trackTime, parentEndTime) {
      if (!isArrayImpl(root._children)) {
        var previousResult = root._children, previousEndTime = previousResult.endTime;
        if (-Infinity < parentEndTime && parentEndTime < previousEndTime && null !== previousResult.component) {
          var componentInfo = previousResult.component, trackIdx = trackIdx$jscomp$6, startTime = parentEndTime;
          if (supportsUserTiming && 0 <= previousEndTime && 10 > trackIdx) {
            var color = componentInfo.env === response$jscomp$0._rootEnvironmentName ? "primary-light" : "secondary-light", entryName = componentInfo.name + " [deduped]", debugTask = componentInfo.debugTask;
            debugTask ? debugTask.run(
              console.timeStamp.bind(
                console,
                entryName,
                0 > startTime ? 0 : startTime,
                previousEndTime,
                trackNames[trackIdx],
                "Server Components ⚛",
                color
              )
            ) : console.timeStamp(
              entryName,
              0 > startTime ? 0 : startTime,
              previousEndTime,
              trackNames[trackIdx],
              "Server Components ⚛",
              color
            );
          }
        }
        previousResult.track = trackIdx$jscomp$6;
        return previousResult;
      }
      var children = root._children, debugInfo = root._debugInfo;
      if (debugInfo) {
        for (var startTime$jscomp$0 = 0, i = 0; i < debugInfo.length; i++) {
          var info = debugInfo[i];
          "number" === typeof info.time && (startTime$jscomp$0 = info.time);
          if ("string" === typeof info.name) {
            startTime$jscomp$0 < trackTime && trackIdx$jscomp$6++;
            trackTime = startTime$jscomp$0;
            break;
          }
        }
        for (var _i4 = debugInfo.length - 1; 0 <= _i4; _i4--) {
          var _info = debugInfo[_i4];
          if ("number" === typeof _info.time && _info.time > parentEndTime) {
            parentEndTime = _info.time;
            break;
          }
        }
      }
      var result = {
        track: trackIdx$jscomp$6,
        endTime: -Infinity,
        component: null
      };
      root._children = result;
      for (var childrenEndTime = -Infinity, childTrackIdx = trackIdx$jscomp$6, childTrackTime = trackTime, _i5 = 0; _i5 < children.length; _i5++) {
        var childResult = flushComponentPerformance(
          response$jscomp$0,
          children[_i5],
          childTrackIdx,
          childTrackTime,
          parentEndTime
        );
        null !== childResult.component && (result.component = childResult.component);
        childTrackIdx = childResult.track;
        var childEndTime = childResult.endTime;
        childEndTime > childTrackTime && (childTrackTime = childEndTime);
        childEndTime > childrenEndTime && (childrenEndTime = childEndTime);
      }
      if (debugInfo)
        for (var componentEndTime = 0, isLastComponent = true, endTime = -1, endTimeIdx = -1, _i6 = debugInfo.length - 1; 0 <= _i6; _i6--) {
          var _info2 = debugInfo[_i6];
          if ("number" === typeof _info2.time) {
            0 === componentEndTime && (componentEndTime = _info2.time);
            var time = _info2.time;
            if (-1 < endTimeIdx)
              for (var j = endTimeIdx - 1; j > _i6; j--) {
                var candidateInfo = debugInfo[j];
                if ("string" === typeof candidateInfo.name) {
                  componentEndTime > childrenEndTime && (childrenEndTime = componentEndTime);
                  var componentInfo$jscomp$0 = candidateInfo, response = response$jscomp$0, componentInfo$jscomp$1 = componentInfo$jscomp$0, trackIdx$jscomp$0 = trackIdx$jscomp$6, startTime$jscomp$1 = time, componentEndTime$jscomp$0 = componentEndTime, childrenEndTime$jscomp$0 = childrenEndTime;
                  if (isLastComponent && "rejected" === root.status && root.reason !== response._closedReason) {
                    var componentInfo$jscomp$2 = componentInfo$jscomp$1, trackIdx$jscomp$1 = trackIdx$jscomp$0, startTime$jscomp$2 = startTime$jscomp$1, childrenEndTime$jscomp$1 = childrenEndTime$jscomp$0, error = root.reason;
                    if (supportsUserTiming) {
                      var env = componentInfo$jscomp$2.env, name = componentInfo$jscomp$2.name, entryName$jscomp$0 = env === response._rootEnvironmentName || void 0 === env ? name : name + " [" + env + "]", properties = [
                        [
                          "Error",
                          "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error)
                        ]
                      ];
                      null != componentInfo$jscomp$2.key && addValueToProperties(
                        "key",
                        componentInfo$jscomp$2.key,
                        properties,
                        0,
                        ""
                      );
                      null != componentInfo$jscomp$2.props && addObjectToProperties(
                        componentInfo$jscomp$2.props,
                        properties,
                        0,
                        ""
                      );
                      performance.measure("​" + entryName$jscomp$0, {
                        start: 0 > startTime$jscomp$2 ? 0 : startTime$jscomp$2,
                        end: childrenEndTime$jscomp$1,
                        detail: {
                          devtools: {
                            color: "error",
                            track: trackNames[trackIdx$jscomp$1],
                            trackGroup: "Server Components ⚛",
                            tooltipText: entryName$jscomp$0 + " Errored",
                            properties
                          }
                        }
                      });
                    }
                  } else {
                    var componentInfo$jscomp$3 = componentInfo$jscomp$1, trackIdx$jscomp$2 = trackIdx$jscomp$0, startTime$jscomp$3 = startTime$jscomp$1, childrenEndTime$jscomp$2 = childrenEndTime$jscomp$0;
                    if (supportsUserTiming && 0 <= childrenEndTime$jscomp$2 && 10 > trackIdx$jscomp$2) {
                      var env$jscomp$0 = componentInfo$jscomp$3.env, name$jscomp$0 = componentInfo$jscomp$3.name, isPrimaryEnv = env$jscomp$0 === response._rootEnvironmentName, selfTime = componentEndTime$jscomp$0 - startTime$jscomp$3, color$jscomp$0 = 0.5 > selfTime ? isPrimaryEnv ? "primary-light" : "secondary-light" : 50 > selfTime ? isPrimaryEnv ? "primary" : "secondary" : 500 > selfTime ? isPrimaryEnv ? "primary-dark" : "secondary-dark" : "error", entryName$jscomp$1 = isPrimaryEnv || void 0 === env$jscomp$0 ? name$jscomp$0 : name$jscomp$0 + " [" + env$jscomp$0 + "]", debugTask$jscomp$0 = componentInfo$jscomp$3.debugTask;
                      if (debugTask$jscomp$0) {
                        var properties$jscomp$0 = [];
                        null != componentInfo$jscomp$3.key && addValueToProperties(
                          "key",
                          componentInfo$jscomp$3.key,
                          properties$jscomp$0,
                          0,
                          ""
                        );
                        null != componentInfo$jscomp$3.props && addObjectToProperties(
                          componentInfo$jscomp$3.props,
                          properties$jscomp$0,
                          0,
                          ""
                        );
                        debugTask$jscomp$0.run(
                          performance.measure.bind(
                            performance,
                            "​" + entryName$jscomp$1,
                            {
                              start: 0 > startTime$jscomp$3 ? 0 : startTime$jscomp$3,
                              end: childrenEndTime$jscomp$2,
                              detail: {
                                devtools: {
                                  color: color$jscomp$0,
                                  track: trackNames[trackIdx$jscomp$2],
                                  trackGroup: "Server Components ⚛",
                                  properties: properties$jscomp$0
                                }
                              }
                            }
                          )
                        );
                      } else
                        console.timeStamp(
                          "​" + entryName$jscomp$1,
                          0 > startTime$jscomp$3 ? 0 : startTime$jscomp$3,
                          childrenEndTime$jscomp$2,
                          trackNames[trackIdx$jscomp$2],
                          "Server Components ⚛",
                          color$jscomp$0
                        );
                    }
                  }
                  componentEndTime = time;
                  result.component = componentInfo$jscomp$0;
                  isLastComponent = false;
                } else if (candidateInfo.awaited && null != candidateInfo.awaited.env) {
                  endTime > childrenEndTime && (childrenEndTime = endTime);
                  var asyncInfo = candidateInfo, env$jscomp$1 = response$jscomp$0._rootEnvironmentName, promise = asyncInfo.awaited.value;
                  if (promise) {
                    var thenable = promise;
                    switch (thenable.status) {
                      case "fulfilled":
                        logComponentAwait(
                          asyncInfo,
                          trackIdx$jscomp$6,
                          time,
                          endTime,
                          env$jscomp$1,
                          thenable.value
                        );
                        break;
                      case "rejected":
                        var asyncInfo$jscomp$0 = asyncInfo, trackIdx$jscomp$3 = trackIdx$jscomp$6, startTime$jscomp$4 = time, endTime$jscomp$0 = endTime, rootEnv = env$jscomp$1, error$jscomp$0 = thenable.reason;
                        if (supportsUserTiming && 0 < endTime$jscomp$0) {
                          var description = getIODescription(error$jscomp$0), entryName$jscomp$2 = "await " + getIOShortName(
                            asyncInfo$jscomp$0.awaited,
                            description,
                            asyncInfo$jscomp$0.env,
                            rootEnv
                          ), debugTask$jscomp$1 = asyncInfo$jscomp$0.debugTask || asyncInfo$jscomp$0.awaited.debugTask;
                          if (debugTask$jscomp$1) {
                            var properties$jscomp$1 = [
                              [
                                "Rejected",
                                "object" === typeof error$jscomp$0 && null !== error$jscomp$0 && "string" === typeof error$jscomp$0.message ? String(error$jscomp$0.message) : String(error$jscomp$0)
                              ]
                            ], tooltipText = getIOLongName(
                              asyncInfo$jscomp$0.awaited,
                              description,
                              asyncInfo$jscomp$0.env,
                              rootEnv
                            ) + " Rejected";
                            debugTask$jscomp$1.run(
                              performance.measure.bind(
                                performance,
                                entryName$jscomp$2,
                                {
                                  start: 0 > startTime$jscomp$4 ? 0 : startTime$jscomp$4,
                                  end: endTime$jscomp$0,
                                  detail: {
                                    devtools: {
                                      color: "error",
                                      track: trackNames[trackIdx$jscomp$3],
                                      trackGroup: "Server Components ⚛",
                                      properties: properties$jscomp$1,
                                      tooltipText
                                    }
                                  }
                                }
                              )
                            );
                          } else
                            console.timeStamp(
                              entryName$jscomp$2,
                              0 > startTime$jscomp$4 ? 0 : startTime$jscomp$4,
                              endTime$jscomp$0,
                              trackNames[trackIdx$jscomp$3],
                              "Server Components ⚛",
                              "error"
                            );
                        }
                        break;
                      default:
                        logComponentAwait(
                          asyncInfo,
                          trackIdx$jscomp$6,
                          time,
                          endTime,
                          env$jscomp$1,
                          void 0
                        );
                    }
                  } else
                    logComponentAwait(
                      asyncInfo,
                      trackIdx$jscomp$6,
                      time,
                      endTime,
                      env$jscomp$1,
                      void 0
                    );
                }
              }
            else {
              endTime = time;
              for (var _j = debugInfo.length - 1; _j > _i6; _j--) {
                var _candidateInfo = debugInfo[_j];
                if ("string" === typeof _candidateInfo.name) {
                  componentEndTime > childrenEndTime && (childrenEndTime = componentEndTime);
                  var _componentInfo = _candidateInfo, _env = response$jscomp$0._rootEnvironmentName, componentInfo$jscomp$4 = _componentInfo, trackIdx$jscomp$4 = trackIdx$jscomp$6, startTime$jscomp$5 = time, childrenEndTime$jscomp$3 = childrenEndTime;
                  if (supportsUserTiming) {
                    var env$jscomp$2 = componentInfo$jscomp$4.env, name$jscomp$1 = componentInfo$jscomp$4.name, entryName$jscomp$3 = env$jscomp$2 === _env || void 0 === env$jscomp$2 ? name$jscomp$1 : name$jscomp$1 + " [" + env$jscomp$2 + "]", properties$jscomp$2 = [
                      [
                        "Aborted",
                        "The stream was aborted before this Component finished rendering."
                      ]
                    ];
                    null != componentInfo$jscomp$4.key && addValueToProperties(
                      "key",
                      componentInfo$jscomp$4.key,
                      properties$jscomp$2,
                      0,
                      ""
                    );
                    null != componentInfo$jscomp$4.props && addObjectToProperties(
                      componentInfo$jscomp$4.props,
                      properties$jscomp$2,
                      0,
                      ""
                    );
                    performance.measure("​" + entryName$jscomp$3, {
                      start: 0 > startTime$jscomp$5 ? 0 : startTime$jscomp$5,
                      end: childrenEndTime$jscomp$3,
                      detail: {
                        devtools: {
                          color: "warning",
                          track: trackNames[trackIdx$jscomp$4],
                          trackGroup: "Server Components ⚛",
                          tooltipText: entryName$jscomp$3 + " Aborted",
                          properties: properties$jscomp$2
                        }
                      }
                    });
                  }
                  componentEndTime = time;
                  result.component = _componentInfo;
                  isLastComponent = false;
                } else if (_candidateInfo.awaited && null != _candidateInfo.awaited.env) {
                  var _asyncInfo = _candidateInfo, _env2 = response$jscomp$0._rootEnvironmentName;
                  _asyncInfo.awaited.end > endTime && (endTime = _asyncInfo.awaited.end);
                  endTime > childrenEndTime && (childrenEndTime = endTime);
                  var asyncInfo$jscomp$1 = _asyncInfo, trackIdx$jscomp$5 = trackIdx$jscomp$6, startTime$jscomp$6 = time, endTime$jscomp$1 = endTime, rootEnv$jscomp$0 = _env2;
                  if (supportsUserTiming && 0 < endTime$jscomp$1) {
                    var entryName$jscomp$4 = "await " + getIOShortName(
                      asyncInfo$jscomp$1.awaited,
                      "",
                      asyncInfo$jscomp$1.env,
                      rootEnv$jscomp$0
                    ), debugTask$jscomp$2 = asyncInfo$jscomp$1.debugTask || asyncInfo$jscomp$1.awaited.debugTask;
                    if (debugTask$jscomp$2) {
                      var tooltipText$jscomp$0 = getIOLongName(
                        asyncInfo$jscomp$1.awaited,
                        "",
                        asyncInfo$jscomp$1.env,
                        rootEnv$jscomp$0
                      ) + " Aborted";
                      debugTask$jscomp$2.run(
                        performance.measure.bind(
                          performance,
                          entryName$jscomp$4,
                          {
                            start: 0 > startTime$jscomp$6 ? 0 : startTime$jscomp$6,
                            end: endTime$jscomp$1,
                            detail: {
                              devtools: {
                                color: "warning",
                                track: trackNames[trackIdx$jscomp$5],
                                trackGroup: "Server Components ⚛",
                                properties: [
                                  [
                                    "Aborted",
                                    "The stream was aborted before this Promise resolved."
                                  ]
                                ],
                                tooltipText: tooltipText$jscomp$0
                              }
                            }
                          }
                        )
                      );
                    } else
                      console.timeStamp(
                        entryName$jscomp$4,
                        0 > startTime$jscomp$6 ? 0 : startTime$jscomp$6,
                        endTime$jscomp$1,
                        trackNames[trackIdx$jscomp$5],
                        "Server Components ⚛",
                        "warning"
                      );
                  }
                }
              }
            }
            endTime = time;
            endTimeIdx = _i6;
          }
        }
      result.endTime = childrenEndTime;
      return result;
    }
    function flushInitialRenderPerformance(response) {
      if (response._replayConsole) {
        var rootChunk = getChunk(response, 0);
        isArrayImpl(rootChunk._children) && (markAllTracksInOrder(), flushComponentPerformance(
          response,
          rootChunk,
          0,
          -Infinity,
          -Infinity
        ));
      }
    }
    function processFullBinaryRow(response, streamState, id, tag, buffer, chunk) {
      switch (tag) {
        case 65:
          resolveBuffer(
            response,
            id,
            mergeBuffer(buffer, chunk).buffer,
            streamState
          );
          return;
        case 79:
          resolveTypedArray(
            response,
            id,
            buffer,
            chunk,
            Int8Array,
            1,
            streamState
          );
          return;
        case 111:
          resolveBuffer(
            response,
            id,
            0 === buffer.length ? chunk : mergeBuffer(buffer, chunk),
            streamState
          );
          return;
        case 85:
          resolveTypedArray(
            response,
            id,
            buffer,
            chunk,
            Uint8ClampedArray,
            1,
            streamState
          );
          return;
        case 83:
          resolveTypedArray(
            response,
            id,
            buffer,
            chunk,
            Int16Array,
            2,
            streamState
          );
          return;
        case 115:
          resolveTypedArray(
            response,
            id,
            buffer,
            chunk,
            Uint16Array,
            2,
            streamState
          );
          return;
        case 76:
          resolveTypedArray(
            response,
            id,
            buffer,
            chunk,
            Int32Array,
            4,
            streamState
          );
          return;
        case 108:
          resolveTypedArray(
            response,
            id,
            buffer,
            chunk,
            Uint32Array,
            4,
            streamState
          );
          return;
        case 71:
          resolveTypedArray(
            response,
            id,
            buffer,
            chunk,
            Float32Array,
            4,
            streamState
          );
          return;
        case 103:
          resolveTypedArray(
            response,
            id,
            buffer,
            chunk,
            Float64Array,
            8,
            streamState
          );
          return;
        case 77:
          resolveTypedArray(
            response,
            id,
            buffer,
            chunk,
            BigInt64Array,
            8,
            streamState
          );
          return;
        case 109:
          resolveTypedArray(
            response,
            id,
            buffer,
            chunk,
            BigUint64Array,
            8,
            streamState
          );
          return;
        case 86:
          resolveTypedArray(
            response,
            id,
            buffer,
            chunk,
            DataView,
            1,
            streamState
          );
          return;
      }
      for (var stringDecoder = response._stringDecoder, row = "", i = 0; i < buffer.length; i++)
        row += stringDecoder.decode(buffer[i], decoderOptions);
      buffer = row += stringDecoder.decode(chunk);
      switch (tag) {
        case 73:
          resolveModule(response, id, buffer, streamState);
          break;
        case 72:
          id = buffer[0];
          streamState = buffer.slice(1);
          response = JSON.parse(streamState, response._fromJSON);
          streamState = ReactDOMSharedInternals.d;
          switch (id) {
            case "D":
              streamState.D(response);
              break;
            case "C":
              "string" === typeof response ? streamState.C(response) : streamState.C(response[0], response[1]);
              break;
            case "L":
              id = response[0];
              buffer = response[1];
              3 === response.length ? streamState.L(id, buffer, response[2]) : streamState.L(id, buffer);
              break;
            case "m":
              "string" === typeof response ? streamState.m(response) : streamState.m(response[0], response[1]);
              break;
            case "X":
              "string" === typeof response ? streamState.X(response) : streamState.X(response[0], response[1]);
              break;
            case "S":
              "string" === typeof response ? streamState.S(response) : streamState.S(
                response[0],
                0 === response[1] ? void 0 : response[1],
                3 === response.length ? response[2] : void 0
              );
              break;
            case "M":
              "string" === typeof response ? streamState.M(response) : streamState.M(response[0], response[1]);
          }
          break;
        case 69:
          tag = response._chunks;
          chunk = tag.get(id);
          buffer = JSON.parse(buffer);
          stringDecoder = resolveErrorDev(response, buffer);
          stringDecoder.digest = buffer.digest;
          chunk ? (resolveChunkDebugInfo(streamState, chunk), triggerErrorOnChunk(response, chunk, stringDecoder)) : (response = new ReactPromise("rejected", null, stringDecoder), resolveChunkDebugInfo(streamState, response), tag.set(id, response));
          break;
        case 84:
          tag = response._chunks;
          (chunk = tag.get(id)) && "pending" !== chunk.status ? chunk.reason.enqueueValue(buffer) : (chunk && releasePendingChunk(response, chunk), response = new ReactPromise("fulfilled", buffer, null), resolveChunkDebugInfo(streamState, response), tag.set(id, response));
          break;
        case 78:
          response._timeOrigin = +buffer - performance.timeOrigin;
          break;
        case 68:
          id = getChunk(response, id);
          "fulfilled" !== id.status && "rejected" !== id.status && "halted" !== id.status && "blocked" !== id.status && "resolved_module" !== id.status && (streamState = id._debugChunk, tag = createResolvedModelChunk(response, buffer), tag._debugChunk = streamState, id._debugChunk = tag, initializeDebugChunk(response, id), "blocked" !== tag.status || void 0 !== response._debugChannel && response._debugChannel.hasReadable || '"' !== buffer[0] || "$" !== buffer[1] || (streamState = buffer.slice(2, buffer.length - 1).split(":"), streamState = parseInt(streamState[0], 16), "pending" === getChunk(response, streamState).status && (id._debugChunk = null)));
          break;
        case 74:
          resolveIOInfo(response, id, buffer);
          break;
        case 87:
          resolveConsoleEntry(response, buffer);
          break;
        case 82:
          startReadableStream(response, id, void 0, streamState);
          break;
        case 114:
          startReadableStream(response, id, "bytes", streamState);
          break;
        case 88:
          startAsyncIterable(response, id, false, streamState);
          break;
        case 120:
          startAsyncIterable(response, id, true, streamState);
          break;
        case 67:
          (response = response._chunks.get(id)) && "fulfilled" === response.status && response.reason.close("" === buffer ? '"$undefined"' : buffer);
          break;
        default:
          if ("" === buffer) {
            if (streamState = response._chunks, (buffer = streamState.get(id)) || streamState.set(id, buffer = createPendingChunk(response)), "pending" === buffer.status || "blocked" === buffer.status)
              releasePendingChunk(response, buffer), response = buffer, response.status = "halted", response.value = null, response.reason = null;
          } else
            tag = response._chunks, (chunk = tag.get(id)) ? (resolveChunkDebugInfo(streamState, chunk), resolveModelChunk(response, chunk, buffer)) : (response = createResolvedModelChunk(response, buffer), resolveChunkDebugInfo(streamState, response), tag.set(id, response));
      }
    }
    function createFromJSONCallback(response) {
      return function(key, value) {
        if ("__proto__" !== key) {
          if ("string" === typeof value)
            return parseModelString(response, this, key, value);
          if ("object" === typeof value && null !== value) {
            if (value[0] === REACT_ELEMENT_TYPE)
              b: {
                var owner = value[4], stack = value[5];
                key = value[6];
                value = {
                  $$typeof: REACT_ELEMENT_TYPE,
                  type: value[1],
                  key: value[2],
                  props: value[3],
                  _owner: void 0 === owner ? null : owner
                };
                Object.defineProperty(value, "ref", {
                  enumerable: false,
                  get: nullRefGetter
                });
                value._store = {};
                Object.defineProperty(value._store, "validated", {
                  configurable: false,
                  enumerable: false,
                  writable: true,
                  value: key
                });
                Object.defineProperty(value, "_debugInfo", {
                  configurable: false,
                  enumerable: false,
                  writable: true,
                  value: null
                });
                Object.defineProperty(value, "_debugStack", {
                  configurable: false,
                  enumerable: false,
                  writable: true,
                  value: void 0 === stack ? null : stack
                });
                Object.defineProperty(value, "_debugTask", {
                  configurable: false,
                  enumerable: false,
                  writable: true,
                  value: null
                });
                if (null !== initializingHandler) {
                  owner = initializingHandler;
                  initializingHandler = owner.parent;
                  if (owner.errored) {
                    stack = new ReactPromise("rejected", null, owner.reason);
                    initializeElement(response, value, null);
                    owner = {
                      name: getComponentNameFromType(value.type) || "",
                      owner: value._owner
                    };
                    owner.debugStack = value._debugStack;
                    supportsCreateTask && (owner.debugTask = value._debugTask);
                    stack._debugInfo = [owner];
                    key = createLazyChunkWrapper(stack, key);
                    break b;
                  }
                  if (0 < owner.deps) {
                    stack = new ReactPromise("blocked", null, null);
                    owner.value = value;
                    owner.chunk = stack;
                    key = createLazyChunkWrapper(stack, key);
                    value = initializeElement.bind(null, response, value, key);
                    stack.then(value, value);
                    break b;
                  }
                }
                initializeElement(response, value, null);
                key = value;
              }
            else key = value;
            return key;
          }
          return value;
        }
      };
    }
    function close(weakResponse) {
      reportGlobalError(weakResponse, Error("Connection closed."));
    }
    function noServerCall() {
      throw Error(
        "Server Functions cannot be called during initial render. This would create a fetch waterfall. Try to use a Server Component to pass data to Client Components instead."
      );
    }
    function createResponseFromOptions(options) {
      return new ResponseInstance(
        options.serverConsumerManifest.moduleMap,
        options.serverConsumerManifest.serverModuleMap,
        options.serverConsumerManifest.moduleLoading,
        noServerCall,
        options.encodeFormAction,
        "string" === typeof options.nonce ? options.nonce : void 0,
        options && options.temporaryReferences ? options.temporaryReferences : void 0,
        options && options.findSourceMapURL ? options.findSourceMapURL : void 0,
        options ? true === options.replayConsoleLogs : false,
        options && options.environmentName ? options.environmentName : void 0,
        options && void 0 !== options.debugChannel ? {
          hasReadable: void 0 !== options.debugChannel.readable,
          callback: null
        } : void 0
      )._weakResponse;
    }
    function startReadingFromStream(response$jscomp$0, stream, onDone, debugValue) {
      function progress(_ref) {
        var value = _ref.value;
        if (_ref.done) return onDone();
        _ref = streamState;
        if (void 0 !== response$jscomp$0.weak.deref()) {
          var response = unwrapWeakResponse(response$jscomp$0), i = 0, rowState = _ref._rowState, rowID = _ref._rowID, rowTag = _ref._rowTag, rowLength = _ref._rowLength, buffer = _ref._buffer, chunkLength = value.length, debugInfo = _ref._debugInfo, endTime = performance.now(), previousEndTime = debugInfo.end, newByteLength = debugInfo.byteSize + chunkLength;
          newByteLength > _ref._debugTargetChunkSize || endTime > previousEndTime + 10 ? (_ref._debugInfo = {
            name: debugInfo.name,
            start: debugInfo.start,
            end: endTime,
            byteSize: newByteLength,
            value: debugInfo.value,
            owner: debugInfo.owner,
            debugStack: debugInfo.debugStack,
            debugTask: debugInfo.debugTask
          }, _ref._debugTargetChunkSize = newByteLength + MIN_CHUNK_SIZE) : (debugInfo.end = endTime, debugInfo.byteSize = newByteLength);
          for (; i < chunkLength; ) {
            debugInfo = -1;
            switch (rowState) {
              case 0:
                debugInfo = value[i++];
                58 === debugInfo ? rowState = 1 : rowID = rowID << 4 | (96 < debugInfo ? debugInfo - 87 : debugInfo - 48);
                continue;
              case 1:
                rowState = value[i];
                84 === rowState || 65 === rowState || 79 === rowState || 111 === rowState || 85 === rowState || 83 === rowState || 115 === rowState || 76 === rowState || 108 === rowState || 71 === rowState || 103 === rowState || 77 === rowState || 109 === rowState || 86 === rowState ? (rowTag = rowState, rowState = 2, i++) : 64 < rowState && 91 > rowState || 35 === rowState || 114 === rowState || 120 === rowState ? (rowTag = rowState, rowState = 3, i++) : (rowTag = 0, rowState = 3);
                continue;
              case 2:
                debugInfo = value[i++];
                44 === debugInfo ? rowState = 4 : rowLength = rowLength << 4 | (96 < debugInfo ? debugInfo - 87 : debugInfo - 48);
                continue;
              case 3:
                debugInfo = value.indexOf(10, i);
                break;
              case 4:
                debugInfo = i + rowLength, debugInfo > value.length && (debugInfo = -1);
            }
            endTime = value.byteOffset + i;
            if (-1 < debugInfo)
              rowLength = new Uint8Array(
                value.buffer,
                endTime,
                debugInfo - i
              ), processFullBinaryRow(
                response,
                _ref,
                rowID,
                rowTag,
                buffer,
                rowLength
              ), i = debugInfo, 3 === rowState && i++, rowLength = rowID = rowTag = rowState = 0, buffer.length = 0;
            else {
              value = new Uint8Array(
                value.buffer,
                endTime,
                value.byteLength - i
              );
              buffer.push(value);
              rowLength -= value.byteLength;
              break;
            }
          }
          _ref._rowState = rowState;
          _ref._rowID = rowID;
          _ref._rowTag = rowTag;
          _ref._rowLength = rowLength;
        }
        return reader.read().then(progress).catch(error);
      }
      function error(e) {
        reportGlobalError(response$jscomp$0, e);
      }
      var streamState = createStreamState(response$jscomp$0, debugValue), reader = stream.getReader();
      reader.read().then(progress).catch(error);
    }
    var ReactDOM = requireReactDom_reactServer(), React2 = requireReact_reactServer(), decoderOptions = { stream: true }, bind$1 = Function.prototype.bind, hasOwnProperty = Object.prototype.hasOwnProperty, chunkCache = /* @__PURE__ */ new Map(), ReactDOMSharedInternals = ReactDOM.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo"), REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator, ASYNC_ITERATOR = Symbol.asyncIterator, isArrayImpl = Array.isArray, getPrototypeOf = Object.getPrototypeOf, jsxPropsParents = /* @__PURE__ */ new WeakMap(), jsxChildrenParents = /* @__PURE__ */ new WeakMap(), CLIENT_REFERENCE_TAG = /* @__PURE__ */ Symbol.for("react.client.reference"), ObjectPrototype = Object.prototype, knownServerReferences = /* @__PURE__ */ new WeakMap(), boundCache = /* @__PURE__ */ new WeakMap(), fakeServerFunctionIdx = 0, FunctionBind = Function.prototype.bind, ArraySlice = Array.prototype.slice, v8FrameRegExp = /^ {3} at (?:(.+) \((.+):(\d+):(\d+)\)|(?:async )?(.+):(\d+):(\d+))$/, jscSpiderMonkeyFrameRegExp = /(?:(.*)@)?(.*):(\d+):(\d+)/, REACT_CLIENT_REFERENCE = /* @__PURE__ */ Symbol.for("react.client.reference"), supportsUserTiming = "undefined" !== typeof console && "function" === typeof console.timeStamp && "undefined" !== typeof performance && "function" === typeof performance.measure, trackNames = "Primary Parallel Parallel​ Parallel​​ Parallel​​​ Parallel​​​​ Parallel​​​​​ Parallel​​​​​​ Parallel​​​​​​​ Parallel​​​​​​​​".split(
      " "
    ), prefix, suffix;
    var ReactSharedInteralsServer = React2.__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, ReactSharedInternals = React2.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE || ReactSharedInteralsServer;
    ReactPromise.prototype = Object.create(Promise.prototype);
    ReactPromise.prototype.then = function(resolve, reject) {
      var _this = this;
      switch (this.status) {
        case "resolved_model":
          initializeModelChunk(this);
          break;
        case "resolved_module":
          initializeModuleChunk(this);
      }
      var resolveCallback = resolve, rejectCallback = reject, wrapperPromise = new Promise(function(res, rej) {
        resolve = function(value) {
          wrapperPromise._debugInfo = _this._debugInfo;
          res(value);
        };
        reject = function(reason) {
          wrapperPromise._debugInfo = _this._debugInfo;
          rej(reason);
        };
      });
      wrapperPromise.then(resolveCallback, rejectCallback);
      switch (this.status) {
        case "fulfilled":
          "function" === typeof resolve && resolve(this.value);
          break;
        case "pending":
        case "blocked":
          "function" === typeof resolve && (null === this.value && (this.value = []), this.value.push(resolve));
          "function" === typeof reject && (null === this.reason && (this.reason = []), this.reason.push(reject));
          break;
        case "halted":
          break;
        default:
          "function" === typeof reject && reject(this.reason);
      }
    };
    var debugChannelRegistry = "function" === typeof FinalizationRegistry ? new FinalizationRegistry(closeDebugChannel) : null, initializingHandler = null, initializingChunk = null, mightHaveStaticConstructor = /\bclass\b.*\bstatic\b/, MIN_CHUNK_SIZE = 65536, supportsCreateTask = !!console.createTask, fakeFunctionCache = /* @__PURE__ */ new Map(), fakeFunctionIdx = 0, createFakeJSXCallStack = {
      react_stack_bottom_frame: function(response, stack, environmentName) {
        return buildFakeCallStack(
          response,
          stack,
          environmentName,
          false,
          fakeJSXCallSite
        )();
      }
    }, createFakeJSXCallStackInDEV = createFakeJSXCallStack.react_stack_bottom_frame.bind(
      createFakeJSXCallStack
    ), currentOwnerInDEV = null, replayConsoleWithCallStack = {
      react_stack_bottom_frame: function(response, payload) {
        var methodName = payload[0], stackTrace = payload[1], owner = payload[2], env = payload[3];
        payload = payload.slice(4);
        var prevStack = ReactSharedInternals.getCurrentStack;
        ReactSharedInternals.getCurrentStack = getCurrentStackInDEV;
        currentOwnerInDEV = null === owner ? response._debugRootOwner : owner;
        try {
          a: {
            var offset = 0;
            switch (methodName) {
              case "dir":
              case "dirxml":
              case "groupEnd":
              case "table":
                var JSCompiler_inline_result = bind$1.apply(
                  console[methodName],
                  [console].concat(payload)
                );
                break a;
              case "assert":
                offset = 1;
            }
            var newArgs = payload.slice(0);
            "string" === typeof newArgs[offset] ? newArgs.splice(
              offset,
              1,
              "\x1B[0m\x1B[7m%c%s\x1B[0m%c " + newArgs[offset],
              "background: #e6e6e6;background: light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.25));color: #000000;color: light-dark(#000000, #ffffff);border-radius: 2px",
              " " + env + " ",
              ""
            ) : newArgs.splice(
              offset,
              0,
              "\x1B[0m\x1B[7m%c%s\x1B[0m%c",
              "background: #e6e6e6;background: light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.25));color: #000000;color: light-dark(#000000, #ffffff);border-radius: 2px",
              " " + env + " ",
              ""
            );
            newArgs.unshift(console);
            JSCompiler_inline_result = bind$1.apply(
              console[methodName],
              newArgs
            );
          }
          var callStack = buildFakeCallStack(
            response,
            stackTrace,
            env,
            false,
            JSCompiler_inline_result
          );
          if (null != owner) {
            var task = initializeFakeTask(response, owner);
            initializeFakeStack(response, owner);
            if (null !== task) {
              task.run(callStack);
              return;
            }
          }
          var rootTask = getRootTask(response, env);
          null != rootTask ? rootTask.run(callStack) : callStack();
        } finally {
          currentOwnerInDEV = null, ReactSharedInternals.getCurrentStack = prevStack;
        }
      }
    }, replayConsoleWithCallStackInDEV = replayConsoleWithCallStack.react_stack_bottom_frame.bind(
      replayConsoleWithCallStack
    );
    reactServerDomWebpackClient_edge_development.createFromFetch = function(promiseForResponse, options) {
      var response = createResponseFromOptions(options);
      promiseForResponse.then(
        function(r) {
          if (options && options.debugChannel && options.debugChannel.readable) {
            var streamDoneCount = 0, handleDone = function() {
              2 === ++streamDoneCount && close(response);
            };
            startReadingFromStream(
              response,
              options.debugChannel.readable,
              handleDone
            );
            startReadingFromStream(response, r.body, handleDone, r);
          } else
            startReadingFromStream(
              response,
              r.body,
              close.bind(null, response),
              r
            );
        },
        function(e) {
          reportGlobalError(response, e);
        }
      );
      return getRoot(response);
    };
    reactServerDomWebpackClient_edge_development.createFromReadableStream = function(stream, options) {
      var response = createResponseFromOptions(options);
      if (options && options.debugChannel && options.debugChannel.readable) {
        var streamDoneCount = 0, handleDone = function() {
          2 === ++streamDoneCount && close(response);
        };
        startReadingFromStream(
          response,
          options.debugChannel.readable,
          handleDone
        );
        startReadingFromStream(response, stream, handleDone, stream);
      } else
        startReadingFromStream(
          response,
          stream,
          close.bind(null, response),
          stream
        );
      return getRoot(response);
    };
    reactServerDomWebpackClient_edge_development.createServerReference = function(id) {
      return createServerReference$1(id, noServerCall);
    };
    reactServerDomWebpackClient_edge_development.createTemporaryReferenceSet = function() {
      return /* @__PURE__ */ new Map();
    };
    reactServerDomWebpackClient_edge_development.encodeReply = function(value, options) {
      return new Promise(function(resolve, reject) {
        var abort = processReply(
          value,
          "",
          options && options.temporaryReferences ? options.temporaryReferences : void 0,
          resolve,
          reject
        );
        if (options && options.signal) {
          var signal = options.signal;
          if (signal.aborted) abort(signal.reason);
          else {
            var listener = function() {
              abort(signal.reason);
              signal.removeEventListener("abort", listener);
            };
            signal.addEventListener("abort", listener);
          }
        }
      });
    };
    reactServerDomWebpackClient_edge_development.registerServerReference = function(reference, id, encodeFormAction) {
      registerBoundServerReference(reference, id, null, encodeFormAction);
      return reference;
    };
  })();
  return reactServerDomWebpackClient_edge_development;
}
var hasRequiredClient_edge;
function requireClient_edge() {
  if (hasRequiredClient_edge) return client_edge.exports;
  hasRequiredClient_edge = 1;
  if (process.env.NODE_ENV === "production") {
    client_edge.exports = requireReactServerDomWebpackClient_edge_production();
  } else {
    client_edge.exports = requireReactServerDomWebpackClient_edge_development();
  }
  return client_edge.exports;
}
requireClient_edge();
function renderToReadableStream$1(data2, options, extraOptions) {
  return server_edgeExports.renderToReadableStream(data2, createClientManifest({ onClientReference: extraOptions?.onClientReference }), options);
}
function registerClientReference(proxy, id, name) {
  return server_edgeExports.registerClientReference(proxy, id, name);
}
function decodeReply(body, options) {
  return server_edgeExports.decodeReply(body, createServerManifest(), options);
}
function decodeAction(body) {
  return server_edgeExports.decodeAction(body, createServerManifest());
}
function decodeFormState(actionResult, body) {
  return server_edgeExports.decodeFormState(actionResult, body, createServerManifest());
}
const createTemporaryReferenceSet = server_edgeExports.createTemporaryReferenceSet;
const serverReferences = {};
initialize();
function initialize() {
  setRequireModule({ load: async (id) => {
    {
      const import_ = serverReferences[id];
      if (!import_) throw new Error(`server reference not found '${id}'`);
      return import_();
    }
  } });
}
function renderToReadableStream(data2, options, extraOptions) {
  return renderToReadableStream$1(data2, options, { onClientReference(metadata) {
    assetsManifest.clientReferenceDeps[metadata.id] ?? {};
  } });
}
var react_reactServerExports = requireReact_reactServer();
const React = /* @__PURE__ */ getDefaultExportFromCjs(react_reactServerExports);
const Outlet$1 = /* @__PURE__ */ registerClientReference(() => {
  throw new Error("Unexpectedly client reference export 'Outlet' is called on server");
}, "37eafacc3f00", "Outlet");
const UNSAFE_WithComponentProps = /* @__PURE__ */ registerClientReference(() => {
  throw new Error("Unexpectedly client reference export 'UNSAFE_WithComponentProps' is called on server");
}, "37eafacc3f00", "UNSAFE_WithComponentProps");
const UNSAFE_WithErrorBoundaryProps = /* @__PURE__ */ registerClientReference(() => {
  throw new Error("Unexpectedly client reference export 'UNSAFE_WithErrorBoundaryProps' is called on server");
}, "37eafacc3f00", "UNSAFE_WithErrorBoundaryProps");
const UNSAFE_WithHydrateFallbackProps = /* @__PURE__ */ registerClientReference(() => {
  throw new Error("Unexpectedly client reference export 'UNSAFE_WithHydrateFallbackProps' is called on server");
}, "37eafacc3f00", "UNSAFE_WithHydrateFallbackProps");
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
function invariant(value, message) {
  if (value === false || value === null || typeof value === "undefined") {
    throw new Error(message);
  }
}
function warning(cond, message) {
  if (!cond) {
    if (typeof console !== "undefined") console.warn(message);
    try {
      throw new Error(message);
    } catch (e) {
    }
  }
}
function createKey() {
  return Math.random().toString(36).substring(2, 10);
}
function createLocation(current, to, state = null, key) {
  let location = {
    pathname: typeof current === "string" ? current : current.pathname,
    search: "",
    hash: "",
    ...typeof to === "string" ? parsePath(to) : to,
    state,
    // TODO: This could be cleaned up.  push/replace should probably just take
    // full Locations now and avoid the need to run through this flow at all
    // But that's a pretty big refactor to the current test suite so going to
    // keep as is for the time being and just let any incoming keys take precedence
    key: to && to.key || key || createKey()
  };
  return location;
}
function createPath({
  pathname = "/",
  search = "",
  hash = ""
}) {
  if (search && search !== "?")
    pathname += search.charAt(0) === "?" ? search : "?" + search;
  if (hash && hash !== "#")
    pathname += hash.charAt(0) === "#" ? hash : "#" + hash;
  return pathname;
}
function parsePath(path) {
  let parsedPath = {};
  if (path) {
    let hashIndex = path.indexOf("#");
    if (hashIndex >= 0) {
      parsedPath.hash = path.substring(hashIndex);
      path = path.substring(0, hashIndex);
    }
    let searchIndex = path.indexOf("?");
    if (searchIndex >= 0) {
      parsedPath.search = path.substring(searchIndex);
      path = path.substring(0, searchIndex);
    }
    if (path) {
      parsedPath.pathname = path;
    }
  }
  return parsedPath;
}
var UninstrumentedSymbol = /* @__PURE__ */ Symbol("Uninstrumented");
function getRouteInstrumentationUpdates(fns, route) {
  let aggregated = {
    lazy: [],
    "lazy.loader": [],
    "lazy.action": [],
    "lazy.middleware": [],
    middleware: [],
    loader: [],
    action: []
  };
  fns.forEach(
    (fn) => fn({
      id: route.id,
      index: route.index,
      path: route.path,
      instrument(i) {
        let keys = Object.keys(aggregated);
        for (let key of keys) {
          if (i[key]) {
            aggregated[key].push(i[key]);
          }
        }
      }
    })
  );
  let updates = {};
  if (typeof route.lazy === "function" && aggregated.lazy.length > 0) {
    let instrumented = wrapImpl(aggregated.lazy, route.lazy, () => void 0);
    if (instrumented) {
      updates.lazy = instrumented;
    }
  }
  if (typeof route.lazy === "object") {
    let lazyObject = route.lazy;
    ["middleware", "loader", "action"].forEach((key) => {
      let lazyFn = lazyObject[key];
      let instrumentations = aggregated[`lazy.${key}`];
      if (typeof lazyFn === "function" && instrumentations.length > 0) {
        let instrumented = wrapImpl(instrumentations, lazyFn, () => void 0);
        if (instrumented) {
          updates.lazy = Object.assign(updates.lazy || {}, {
            [key]: instrumented
          });
        }
      }
    });
  }
  ["loader", "action"].forEach((key) => {
    let handler = route[key];
    if (typeof handler === "function" && aggregated[key].length > 0) {
      let original = handler[UninstrumentedSymbol] ?? handler;
      let instrumented = wrapImpl(
        aggregated[key],
        original,
        (...args) => getHandlerInfo(args[0])
      );
      if (instrumented) {
        if (key === "loader" && original.hydrate === true) {
          instrumented.hydrate = true;
        }
        instrumented[UninstrumentedSymbol] = original;
        updates[key] = instrumented;
      }
    }
  });
  if (route.middleware && route.middleware.length > 0 && aggregated.middleware.length > 0) {
    updates.middleware = route.middleware.map((middleware) => {
      let original = middleware[UninstrumentedSymbol] ?? middleware;
      let instrumented = wrapImpl(
        aggregated.middleware,
        original,
        (...args) => getHandlerInfo(args[0])
      );
      if (instrumented) {
        instrumented[UninstrumentedSymbol] = original;
        return instrumented;
      }
      return middleware;
    });
  }
  return updates;
}
function wrapImpl(impls, handler, getInfo) {
  if (impls.length === 0) {
    return null;
  }
  return async (...args) => {
    let result = await recurseRight(
      impls,
      getInfo(...args),
      () => handler(...args),
      impls.length - 1
    );
    if (result.type === "error") {
      throw result.value;
    }
    return result.value;
  };
}
async function recurseRight(impls, info, handler, index) {
  let impl = impls[index];
  let result;
  if (!impl) {
    try {
      let value = await handler();
      result = { type: "success", value };
    } catch (e) {
      result = { type: "error", value: e };
    }
  } else {
    let handlerPromise = void 0;
    let callHandler = async () => {
      if (handlerPromise) {
        console.error("You cannot call instrumented handlers more than once");
      } else {
        handlerPromise = recurseRight(impls, info, handler, index - 1);
      }
      result = await handlerPromise;
      invariant(result, "Expected a result");
      if (result.type === "error" && result.value instanceof Error) {
        return { status: "error", error: result.value };
      }
      return { status: "success", error: void 0 };
    };
    try {
      await impl(callHandler, info);
    } catch (e) {
      console.error("An instrumentation function threw an error:", e);
    }
    if (!handlerPromise) {
      await callHandler();
    }
    await handlerPromise;
  }
  if (result) {
    return result;
  }
  return {
    type: "error",
    value: new Error("No result assigned in instrumentation chain.")
  };
}
function getHandlerInfo(args) {
  let { request, context, params, unstable_pattern } = args;
  return {
    request: getReadonlyRequest(request),
    params: { ...params },
    unstable_pattern,
    context: getReadonlyContext(context)
  };
}
function getReadonlyRequest(request) {
  return {
    method: request.method,
    url: request.url,
    headers: {
      get: (...args) => request.headers.get(...args)
    }
  };
}
function getReadonlyContext(context) {
  if (isPlainObject(context)) {
    let frozen = { ...context };
    Object.freeze(frozen);
    return frozen;
  } else {
    return {
      get: (ctx) => context.get(ctx)
    };
  }
}
var objectProtoNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function isPlainObject(thing) {
  if (thing === null || typeof thing !== "object") {
    return false;
  }
  const proto = Object.getPrototypeOf(thing);
  return proto === Object.prototype || proto === null || Object.getOwnPropertyNames(proto).sort().join("\0") === objectProtoNames;
}
var _map;
var RouterContextProvider = class {
  /**
   * Create a new `RouterContextProvider` instance
   * @param init An optional initial context map to populate the provider with
   */
  constructor(init2) {
    __privateAdd(this, _map, /* @__PURE__ */ new Map());
    if (init2) {
      for (let [context, value] of init2) {
        this.set(context, value);
      }
    }
  }
  /**
   * Access a value from the context. If no value has been set for the context,
   * it will return the context's `defaultValue` if provided, or throw an error
   * if no `defaultValue` was set.
   * @param context The context to get the value for
   * @returns The value for the context, or the context's `defaultValue` if no
   * value was set
   */
  get(context) {
    if (__privateGet(this, _map).has(context)) {
      return __privateGet(this, _map).get(context);
    }
    if (context.defaultValue !== void 0) {
      return context.defaultValue;
    }
    throw new Error("No value found for context");
  }
  /**
   * Set a value for the context. If the context already has a value set, this
   * will overwrite it.
   *
   * @param context The context to set the value for
   * @param value The value to set for the context
   * @returns {void}
   */
  set(context, value) {
    __privateGet(this, _map).set(context, value);
  }
};
_map = /* @__PURE__ */ new WeakMap();
var unsupportedLazyRouteObjectKeys = /* @__PURE__ */ new Set([
  "lazy",
  "caseSensitive",
  "path",
  "id",
  "index",
  "children"
]);
function isUnsupportedLazyRouteObjectKey(key) {
  return unsupportedLazyRouteObjectKeys.has(
    key
  );
}
var unsupportedLazyRouteFunctionKeys = /* @__PURE__ */ new Set([
  "lazy",
  "caseSensitive",
  "path",
  "id",
  "index",
  "middleware",
  "children"
]);
function isUnsupportedLazyRouteFunctionKey(key) {
  return unsupportedLazyRouteFunctionKeys.has(
    key
  );
}
function isIndexRoute(route) {
  return route.index === true;
}
function convertRoutesToDataRoutes(routes2, mapRouteProperties, parentPath = [], manifest = {}, allowInPlaceMutations = false) {
  return routes2.map((route, index) => {
    let treePath = [...parentPath, String(index)];
    let id = typeof route.id === "string" ? route.id : treePath.join("-");
    invariant(
      route.index !== true || !route.children,
      `Cannot specify children on an index route`
    );
    invariant(
      allowInPlaceMutations || !manifest[id],
      `Found a route id collision on id "${id}".  Route id's must be globally unique within Data Router usages`
    );
    if (isIndexRoute(route)) {
      let indexRoute = {
        ...route,
        id
      };
      manifest[id] = mergeRouteUpdates(
        indexRoute,
        mapRouteProperties(indexRoute)
      );
      return indexRoute;
    } else {
      let pathOrLayoutRoute = {
        ...route,
        id,
        children: void 0
      };
      manifest[id] = mergeRouteUpdates(
        pathOrLayoutRoute,
        mapRouteProperties(pathOrLayoutRoute)
      );
      if (route.children) {
        pathOrLayoutRoute.children = convertRoutesToDataRoutes(
          route.children,
          mapRouteProperties,
          treePath,
          manifest,
          allowInPlaceMutations
        );
      }
      return pathOrLayoutRoute;
    }
  });
}
function mergeRouteUpdates(route, updates) {
  return Object.assign(route, {
    ...updates,
    ...typeof updates.lazy === "object" && updates.lazy != null ? {
      lazy: {
        ...route.lazy,
        ...updates.lazy
      }
    } : {}
  });
}
function matchRoutes(routes2, locationArg, basename2 = "/") {
  return matchRoutesImpl(routes2, locationArg, basename2, false);
}
function matchRoutesImpl(routes2, locationArg, basename2, allowPartial) {
  let location = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
  let pathname = stripBasename(location.pathname || "/", basename2);
  if (pathname == null) {
    return null;
  }
  let branches = flattenRoutes(routes2);
  rankRouteBranches(branches);
  let matches = null;
  for (let i = 0; matches == null && i < branches.length; ++i) {
    let decoded = decodePath(pathname);
    matches = matchRouteBranch(
      branches[i],
      decoded,
      allowPartial
    );
  }
  return matches;
}
function convertRouteMatchToUiMatch(match, loaderData) {
  let { route, pathname, params } = match;
  return {
    id: route.id,
    pathname,
    params,
    data: loaderData[route.id],
    loaderData: loaderData[route.id],
    handle: route.handle
  };
}
function flattenRoutes(routes2, branches = [], parentsMeta = [], parentPath = "", _hasParentOptionalSegments = false) {
  let flattenRoute = (route, index, hasParentOptionalSegments = _hasParentOptionalSegments, relativePath) => {
    let meta = {
      relativePath: relativePath === void 0 ? route.path || "" : relativePath,
      caseSensitive: route.caseSensitive === true,
      childrenIndex: index,
      route
    };
    if (meta.relativePath.startsWith("/")) {
      if (!meta.relativePath.startsWith(parentPath) && hasParentOptionalSegments) {
        return;
      }
      invariant(
        meta.relativePath.startsWith(parentPath),
        `Absolute route path "${meta.relativePath}" nested under path "${parentPath}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`
      );
      meta.relativePath = meta.relativePath.slice(parentPath.length);
    }
    let path = joinPaths([parentPath, meta.relativePath]);
    let routesMeta = parentsMeta.concat(meta);
    if (route.children && route.children.length > 0) {
      invariant(
        // Our types know better, but runtime JS may not!
        // @ts-expect-error
        route.index !== true,
        `Index routes must not have child routes. Please remove all child routes from route path "${path}".`
      );
      flattenRoutes(
        route.children,
        branches,
        routesMeta,
        path,
        hasParentOptionalSegments
      );
    }
    if (route.path == null && !route.index) {
      return;
    }
    branches.push({
      path,
      score: computeScore(path, route.index),
      routesMeta
    });
  };
  routes2.forEach((route, index) => {
    if (route.path === "" || !route.path?.includes("?")) {
      flattenRoute(route, index);
    } else {
      for (let exploded of explodeOptionalSegments(route.path)) {
        flattenRoute(route, index, true, exploded);
      }
    }
  });
  return branches;
}
function explodeOptionalSegments(path) {
  let segments = path.split("/");
  if (segments.length === 0) return [];
  let [first, ...rest] = segments;
  let isOptional = first.endsWith("?");
  let required = first.replace(/\?$/, "");
  if (rest.length === 0) {
    return isOptional ? [required, ""] : [required];
  }
  let restExploded = explodeOptionalSegments(rest.join("/"));
  let result = [];
  result.push(
    ...restExploded.map(
      (subpath) => subpath === "" ? required : [required, subpath].join("/")
    )
  );
  if (isOptional) {
    result.push(...restExploded);
  }
  return result.map(
    (exploded) => path.startsWith("/") && exploded === "" ? "/" : exploded
  );
}
function rankRouteBranches(branches) {
  branches.sort(
    (a, b) => a.score !== b.score ? b.score - a.score : compareIndexes(
      a.routesMeta.map((meta) => meta.childrenIndex),
      b.routesMeta.map((meta) => meta.childrenIndex)
    )
  );
}
var paramRe = /^:[\w-]+$/;
var dynamicSegmentValue = 3;
var indexRouteValue = 2;
var emptySegmentValue = 1;
var staticSegmentValue = 10;
var splatPenalty = -2;
var isSplat = (s) => s === "*";
function computeScore(path, index) {
  let segments = path.split("/");
  let initialScore = segments.length;
  if (segments.some(isSplat)) {
    initialScore += splatPenalty;
  }
  if (index) {
    initialScore += indexRouteValue;
  }
  return segments.filter((s) => !isSplat(s)).reduce(
    (score, segment) => score + (paramRe.test(segment) ? dynamicSegmentValue : segment === "" ? emptySegmentValue : staticSegmentValue),
    initialScore
  );
}
function compareIndexes(a, b) {
  let siblings = a.length === b.length && a.slice(0, -1).every((n, i) => n === b[i]);
  return siblings ? (
    // If two routes are siblings, we should try to match the earlier sibling
    // first. This allows people to have fine-grained control over the matching
    // behavior by simply putting routes with identical paths in the order they
    // want them tried.
    a[a.length - 1] - b[b.length - 1]
  ) : (
    // Otherwise, it doesn't really make sense to rank non-siblings by index,
    // so they sort equally.
    0
  );
}
function matchRouteBranch(branch, pathname, allowPartial = false) {
  let { routesMeta } = branch;
  let matchedParams = {};
  let matchedPathname = "/";
  let matches = [];
  for (let i = 0; i < routesMeta.length; ++i) {
    let meta = routesMeta[i];
    let end = i === routesMeta.length - 1;
    let remainingPathname = matchedPathname === "/" ? pathname : pathname.slice(matchedPathname.length) || "/";
    let match = matchPath(
      { path: meta.relativePath, caseSensitive: meta.caseSensitive, end },
      remainingPathname
    );
    let route = meta.route;
    if (!match && end && allowPartial && !routesMeta[routesMeta.length - 1].route.index) {
      match = matchPath(
        {
          path: meta.relativePath,
          caseSensitive: meta.caseSensitive,
          end: false
        },
        remainingPathname
      );
    }
    if (!match) {
      return null;
    }
    Object.assign(matchedParams, match.params);
    matches.push({
      // TODO: Can this as be avoided?
      params: matchedParams,
      pathname: joinPaths([matchedPathname, match.pathname]),
      pathnameBase: normalizePathname(
        joinPaths([matchedPathname, match.pathnameBase])
      ),
      route
    });
    if (match.pathnameBase !== "/") {
      matchedPathname = joinPaths([matchedPathname, match.pathnameBase]);
    }
  }
  return matches;
}
function matchPath(pattern, pathname) {
  if (typeof pattern === "string") {
    pattern = { path: pattern, caseSensitive: false, end: true };
  }
  let [matcher, compiledParams] = compilePath(
    pattern.path,
    pattern.caseSensitive,
    pattern.end
  );
  let match = pathname.match(matcher);
  if (!match) return null;
  let matchedPathname = match[0];
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
  let captureGroups = match.slice(1);
  let params = compiledParams.reduce(
    (memo, { paramName, isOptional }, index) => {
      if (paramName === "*") {
        let splatValue = captureGroups[index] || "";
        pathnameBase = matchedPathname.slice(0, matchedPathname.length - splatValue.length).replace(/(.)\/+$/, "$1");
      }
      const value = captureGroups[index];
      if (isOptional && !value) {
        memo[paramName] = void 0;
      } else {
        memo[paramName] = (value || "").replace(/%2F/g, "/");
      }
      return memo;
    },
    {}
  );
  return {
    params,
    pathname: matchedPathname,
    pathnameBase,
    pattern
  };
}
function compilePath(path, caseSensitive = false, end = true) {
  warning(
    path === "*" || !path.endsWith("*") || path.endsWith("/*"),
    `Route path "${path}" will be treated as if it were "${path.replace(/\*$/, "/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${path.replace(/\*$/, "/*")}".`
  );
  let params = [];
  let regexpSource = "^" + path.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(
    /\/:([\w-]+)(\?)?/g,
    (_, paramName, isOptional) => {
      params.push({ paramName, isOptional: isOptional != null });
      return isOptional ? "/?([^\\/]+)?" : "/([^\\/]+)";
    }
  ).replace(/\/([\w-]+)\?(\/|$)/g, "(/$1)?$2");
  if (path.endsWith("*")) {
    params.push({ paramName: "*" });
    regexpSource += path === "*" || path === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$";
  } else if (end) {
    regexpSource += "\\/*$";
  } else if (path !== "" && path !== "/") {
    regexpSource += "(?:(?=\\/|$))";
  } else ;
  let matcher = new RegExp(regexpSource, caseSensitive ? void 0 : "i");
  return [matcher, params];
}
function decodePath(value) {
  try {
    return value.split("/").map((v) => decodeURIComponent(v).replace(/\//g, "%2F")).join("/");
  } catch (error) {
    warning(
      false,
      `The URL path "${value}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${error}).`
    );
    return value;
  }
}
function stripBasename(pathname, basename2) {
  if (basename2 === "/") return pathname;
  if (!pathname.toLowerCase().startsWith(basename2.toLowerCase())) {
    return null;
  }
  let startIndex = basename2.endsWith("/") ? basename2.length - 1 : basename2.length;
  let nextChar = pathname.charAt(startIndex);
  if (nextChar && nextChar !== "/") {
    return null;
  }
  return pathname.slice(startIndex) || "/";
}
function prependBasename({
  basename: basename2,
  pathname
}) {
  return pathname === "/" ? basename2 : joinPaths([basename2, pathname]);
}
var ABSOLUTE_URL_REGEX = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
var isAbsoluteUrl = (url) => ABSOLUTE_URL_REGEX.test(url);
function resolvePath(to, fromPathname = "/") {
  let {
    pathname: toPathname,
    search = "",
    hash = ""
  } = typeof to === "string" ? parsePath(to) : to;
  let pathname;
  if (toPathname) {
    toPathname = toPathname.replace(/\/\/+/g, "/");
    if (toPathname.startsWith("/")) {
      pathname = resolvePathname(toPathname.substring(1), "/");
    } else {
      pathname = resolvePathname(toPathname, fromPathname);
    }
  } else {
    pathname = fromPathname;
  }
  return {
    pathname,
    search: normalizeSearch(search),
    hash: normalizeHash(hash)
  };
}
function resolvePathname(relativePath, fromPathname) {
  let segments = fromPathname.replace(/\/+$/, "").split("/");
  let relativeSegments = relativePath.split("/");
  relativeSegments.forEach((segment) => {
    if (segment === "..") {
      if (segments.length > 1) segments.pop();
    } else if (segment !== ".") {
      segments.push(segment);
    }
  });
  return segments.length > 1 ? segments.join("/") : "/";
}
function getInvalidPathError(char, field, dest, path) {
  return `Cannot include a '${char}' character in a manually specified \`to.${field}\` field [${JSON.stringify(
    path
  )}].  Please separate it out to the \`to.${dest}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`;
}
function getPathContributingMatches(matches) {
  return matches.filter(
    (match, index) => index === 0 || match.route.path && match.route.path.length > 0
  );
}
function getResolveToMatches(matches) {
  let pathMatches = getPathContributingMatches(matches);
  return pathMatches.map(
    (match, idx) => idx === pathMatches.length - 1 ? match.pathname : match.pathnameBase
  );
}
function resolveTo(toArg, routePathnames, locationPathname, isPathRelative = false) {
  let to;
  if (typeof toArg === "string") {
    to = parsePath(toArg);
  } else {
    to = { ...toArg };
    invariant(
      !to.pathname || !to.pathname.includes("?"),
      getInvalidPathError("?", "pathname", "search", to)
    );
    invariant(
      !to.pathname || !to.pathname.includes("#"),
      getInvalidPathError("#", "pathname", "hash", to)
    );
    invariant(
      !to.search || !to.search.includes("#"),
      getInvalidPathError("#", "search", "hash", to)
    );
  }
  let isEmptyPath = toArg === "" || to.pathname === "";
  let toPathname = isEmptyPath ? "/" : to.pathname;
  let from;
  if (toPathname == null) {
    from = locationPathname;
  } else {
    let routePathnameIndex = routePathnames.length - 1;
    if (!isPathRelative && toPathname.startsWith("..")) {
      let toSegments = toPathname.split("/");
      while (toSegments[0] === "..") {
        toSegments.shift();
        routePathnameIndex -= 1;
      }
      to.pathname = toSegments.join("/");
    }
    from = routePathnameIndex >= 0 ? routePathnames[routePathnameIndex] : "/";
  }
  let path = resolvePath(to, from);
  let hasExplicitTrailingSlash = toPathname && toPathname !== "/" && toPathname.endsWith("/");
  let hasCurrentTrailingSlash = (isEmptyPath || toPathname === ".") && locationPathname.endsWith("/");
  if (!path.pathname.endsWith("/") && (hasExplicitTrailingSlash || hasCurrentTrailingSlash)) {
    path.pathname += "/";
  }
  return path;
}
var joinPaths = (paths) => paths.join("/").replace(/\/\/+/g, "/");
var normalizePathname = (pathname) => pathname.replace(/\/+$/, "").replace(/^\/*/, "/");
var normalizeSearch = (search) => !search || search === "?" ? "" : search.startsWith("?") ? search : "?" + search;
var normalizeHash = (hash) => !hash || hash === "#" ? "" : hash.startsWith("#") ? hash : "#" + hash;
var DataWithResponseInit = class {
  constructor(data2, init2) {
    this.type = "DataWithResponseInit";
    this.data = data2;
    this.init = init2 || null;
  }
};
function data(data2, init2) {
  return new DataWithResponseInit(
    data2,
    typeof init2 === "number" ? { status: init2 } : init2
  );
}
var redirect = (url, init2 = 302) => {
  let responseInit = init2;
  if (typeof responseInit === "number") {
    responseInit = { status: responseInit };
  } else if (typeof responseInit.status === "undefined") {
    responseInit.status = 302;
  }
  let headers = new Headers(responseInit.headers);
  headers.set("Location", url);
  return new Response(null, { ...responseInit, headers });
};
var ErrorResponseImpl = class {
  constructor(status, statusText, data2, internal = false) {
    this.status = status;
    this.statusText = statusText || "";
    this.internal = internal;
    if (data2 instanceof Error) {
      this.data = data2.toString();
      this.error = data2;
    } else {
      this.data = data2;
    }
  }
};
function isRouteErrorResponse(error) {
  return error != null && typeof error.status === "number" && typeof error.statusText === "string" && typeof error.internal === "boolean" && "data" in error;
}
function getRoutePattern(matches) {
  return matches.map((m) => m.route.path).filter(Boolean).join("/").replace(/\/\/*/g, "/") || "/";
}
var validMutationMethodsArr = [
  "POST",
  "PUT",
  "PATCH",
  "DELETE"
];
var validMutationMethods = new Set(
  validMutationMethodsArr
);
var validRequestMethodsArr = [
  "GET",
  ...validMutationMethodsArr
];
var validRequestMethods = new Set(validRequestMethodsArr);
var redirectStatusCodes = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
var defaultMapRouteProperties = (route) => ({
  hasErrorBoundary: Boolean(route.hasErrorBoundary)
});
var ResetLoaderDataSymbol = /* @__PURE__ */ Symbol("ResetLoaderData");
function createStaticHandler(routes2, opts) {
  invariant(
    routes2.length > 0,
    "You must provide a non-empty routes array to createStaticHandler"
  );
  let manifest = {};
  let basename2 = (opts ? opts.basename : null) || "/";
  let _mapRouteProperties = opts?.mapRouteProperties || defaultMapRouteProperties;
  let mapRouteProperties = _mapRouteProperties;
  if (opts?.unstable_instrumentations) {
    let instrumentations = opts.unstable_instrumentations;
    mapRouteProperties = (route) => {
      return {
        ..._mapRouteProperties(route),
        ...getRouteInstrumentationUpdates(
          instrumentations.map((i) => i.route).filter(Boolean),
          route
        )
      };
    };
  }
  let dataRoutes = convertRoutesToDataRoutes(
    routes2,
    mapRouteProperties,
    void 0,
    manifest
  );
  async function query(request, {
    requestContext,
    filterMatchesToLoad,
    skipLoaderErrorBubbling,
    skipRevalidation,
    dataStrategy,
    generateMiddlewareResponse
  } = {}) {
    let url = new URL(request.url);
    let method = request.method;
    let location = createLocation("", createPath(url), null, "default");
    let matches = matchRoutes(dataRoutes, location, basename2);
    requestContext = requestContext != null ? requestContext : new RouterContextProvider();
    if (!isValidMethod(method) && method !== "HEAD") {
      let error = getInternalRouterError(405, { method });
      let { matches: methodNotAllowedMatches, route } = getShortCircuitMatches(dataRoutes);
      let staticContext = {
        basename: basename2,
        location,
        matches: methodNotAllowedMatches,
        loaderData: {},
        actionData: null,
        errors: {
          [route.id]: error
        },
        statusCode: error.status,
        loaderHeaders: {},
        actionHeaders: {}
      };
      return generateMiddlewareResponse ? generateMiddlewareResponse(() => Promise.resolve(staticContext)) : staticContext;
    } else if (!matches) {
      let error = getInternalRouterError(404, { pathname: location.pathname });
      let { matches: notFoundMatches, route } = getShortCircuitMatches(dataRoutes);
      let staticContext = {
        basename: basename2,
        location,
        matches: notFoundMatches,
        loaderData: {},
        actionData: null,
        errors: {
          [route.id]: error
        },
        statusCode: error.status,
        loaderHeaders: {},
        actionHeaders: {}
      };
      return generateMiddlewareResponse ? generateMiddlewareResponse(() => Promise.resolve(staticContext)) : staticContext;
    }
    if (generateMiddlewareResponse) {
      invariant(
        requestContext instanceof RouterContextProvider,
        "When using middleware in `staticHandler.query()`, any provided `requestContext` must be an instance of `RouterContextProvider`"
      );
      try {
        await loadLazyMiddlewareForMatches(
          matches,
          manifest,
          mapRouteProperties
        );
        let renderedStaticContext;
        let response = await runServerMiddlewarePipeline(
          {
            request,
            unstable_pattern: getRoutePattern(matches),
            matches,
            params: matches[0].params,
            // If we're calling middleware then it must be enabled so we can cast
            // this to the proper type knowing it's not an `AppLoadContext`
            context: requestContext
          },
          async () => {
            let res = await generateMiddlewareResponse(
              async (revalidationRequest, opts2 = {}) => {
                let result2 = await queryImpl(
                  revalidationRequest,
                  location,
                  matches,
                  requestContext,
                  dataStrategy || null,
                  skipLoaderErrorBubbling === true,
                  null,
                  "filterMatchesToLoad" in opts2 ? opts2.filterMatchesToLoad ?? null : filterMatchesToLoad ?? null,
                  skipRevalidation === true
                );
                if (isResponse(result2)) {
                  return result2;
                }
                renderedStaticContext = { location, basename: basename2, ...result2 };
                return renderedStaticContext;
              }
            );
            return res;
          },
          async (error, routeId) => {
            if (isRedirectResponse(error)) {
              return error;
            }
            if (isResponse(error)) {
              try {
                error = new ErrorResponseImpl(
                  error.status,
                  error.statusText,
                  await parseResponseBody(error)
                );
              } catch (e) {
                error = e;
              }
            }
            if (isDataWithResponseInit(error)) {
              error = dataWithResponseInitToErrorResponse(error);
            }
            if (renderedStaticContext) {
              if (routeId in renderedStaticContext.loaderData) {
                renderedStaticContext.loaderData[routeId] = void 0;
              }
              let staticContext = getStaticContextFromError(
                dataRoutes,
                renderedStaticContext,
                error,
                skipLoaderErrorBubbling ? routeId : findNearestBoundary(matches, routeId).route.id
              );
              return generateMiddlewareResponse(
                () => Promise.resolve(staticContext)
              );
            } else {
              let boundaryRouteId = skipLoaderErrorBubbling ? routeId : findNearestBoundary(
                matches,
                matches.find(
                  (m) => m.route.id === routeId || m.route.loader
                )?.route.id || routeId
              ).route.id;
              let staticContext = {
                matches,
                location,
                basename: basename2,
                loaderData: {},
                actionData: null,
                errors: {
                  [boundaryRouteId]: error
                },
                statusCode: isRouteErrorResponse(error) ? error.status : 500,
                actionHeaders: {},
                loaderHeaders: {}
              };
              return generateMiddlewareResponse(
                () => Promise.resolve(staticContext)
              );
            }
          }
        );
        invariant(isResponse(response), "Expected a response in query()");
        return response;
      } catch (e) {
        if (isResponse(e)) {
          return e;
        }
        throw e;
      }
    }
    let result = await queryImpl(
      request,
      location,
      matches,
      requestContext,
      dataStrategy || null,
      skipLoaderErrorBubbling === true,
      null,
      filterMatchesToLoad || null,
      skipRevalidation === true
    );
    if (isResponse(result)) {
      return result;
    }
    return { location, basename: basename2, ...result };
  }
  async function queryRoute(request, {
    routeId,
    requestContext,
    dataStrategy,
    generateMiddlewareResponse
  } = {}) {
    let url = new URL(request.url);
    let method = request.method;
    let location = createLocation("", createPath(url), null, "default");
    let matches = matchRoutes(dataRoutes, location, basename2);
    requestContext = requestContext != null ? requestContext : new RouterContextProvider();
    if (!isValidMethod(method) && method !== "HEAD" && method !== "OPTIONS") {
      throw getInternalRouterError(405, { method });
    } else if (!matches) {
      throw getInternalRouterError(404, { pathname: location.pathname });
    }
    let match = routeId ? matches.find((m) => m.route.id === routeId) : getTargetMatch(matches, location);
    if (routeId && !match) {
      throw getInternalRouterError(403, {
        pathname: location.pathname,
        routeId
      });
    } else if (!match) {
      throw getInternalRouterError(404, { pathname: location.pathname });
    }
    if (generateMiddlewareResponse) {
      invariant(
        requestContext instanceof RouterContextProvider,
        "When using middleware in `staticHandler.queryRoute()`, any provided `requestContext` must be an instance of `RouterContextProvider`"
      );
      await loadLazyMiddlewareForMatches(matches, manifest, mapRouteProperties);
      let response = await runServerMiddlewarePipeline(
        {
          request,
          unstable_pattern: getRoutePattern(matches),
          matches,
          params: matches[0].params,
          // If we're calling middleware then it must be enabled so we can cast
          // this to the proper type knowing it's not an `AppLoadContext`
          context: requestContext
        },
        async () => {
          let res = await generateMiddlewareResponse(
            async (innerRequest) => {
              let result2 = await queryImpl(
                innerRequest,
                location,
                matches,
                requestContext,
                dataStrategy || null,
                false,
                match,
                null,
                false
              );
              let processed = handleQueryResult(result2);
              return isResponse(processed) ? processed : typeof processed === "string" ? new Response(processed) : Response.json(processed);
            }
          );
          return res;
        },
        (error) => {
          if (isDataWithResponseInit(error)) {
            return Promise.resolve(dataWithResponseInitToResponse(error));
          }
          if (isResponse(error)) {
            return Promise.resolve(error);
          }
          throw error;
        }
      );
      return response;
    }
    let result = await queryImpl(
      request,
      location,
      matches,
      requestContext,
      dataStrategy || null,
      false,
      match,
      null,
      false
    );
    return handleQueryResult(result);
    function handleQueryResult(result2) {
      if (isResponse(result2)) {
        return result2;
      }
      let error = result2.errors ? Object.values(result2.errors)[0] : void 0;
      if (error !== void 0) {
        throw error;
      }
      if (result2.actionData) {
        return Object.values(result2.actionData)[0];
      }
      if (result2.loaderData) {
        return Object.values(result2.loaderData)[0];
      }
      return void 0;
    }
  }
  async function queryImpl(request, location, matches, requestContext, dataStrategy, skipLoaderErrorBubbling, routeMatch, filterMatchesToLoad, skipRevalidation) {
    invariant(
      request.signal,
      "query()/queryRoute() requests must contain an AbortController signal"
    );
    try {
      if (isMutationMethod(request.method)) {
        let result2 = await submit(
          request,
          matches,
          routeMatch || getTargetMatch(matches, location),
          requestContext,
          dataStrategy,
          skipLoaderErrorBubbling,
          routeMatch != null,
          filterMatchesToLoad,
          skipRevalidation
        );
        return result2;
      }
      let result = await loadRouteData(
        request,
        matches,
        requestContext,
        dataStrategy,
        skipLoaderErrorBubbling,
        routeMatch,
        filterMatchesToLoad
      );
      return isResponse(result) ? result : {
        ...result,
        actionData: null,
        actionHeaders: {}
      };
    } catch (e) {
      if (isDataStrategyResult(e) && isResponse(e.result)) {
        if (e.type === "error") {
          throw e.result;
        }
        return e.result;
      }
      if (isRedirectResponse(e)) {
        return e;
      }
      throw e;
    }
  }
  async function submit(request, matches, actionMatch, requestContext, dataStrategy, skipLoaderErrorBubbling, isRouteRequest, filterMatchesToLoad, skipRevalidation) {
    let result;
    if (!actionMatch.route.action && !actionMatch.route.lazy) {
      let error = getInternalRouterError(405, {
        method: request.method,
        pathname: new URL(request.url).pathname,
        routeId: actionMatch.route.id
      });
      if (isRouteRequest) {
        throw error;
      }
      result = {
        type: "error",
        error
      };
    } else {
      let dsMatches = getTargetedDataStrategyMatches(
        mapRouteProperties,
        manifest,
        request,
        matches,
        actionMatch,
        [],
        requestContext
      );
      let results = await callDataStrategy(
        request,
        dsMatches,
        isRouteRequest,
        requestContext,
        dataStrategy
      );
      result = results[actionMatch.route.id];
      if (request.signal.aborted) {
        throwStaticHandlerAbortedError(request, isRouteRequest);
      }
    }
    if (isRedirectResult(result)) {
      throw new Response(null, {
        status: result.response.status,
        headers: {
          Location: result.response.headers.get("Location")
        }
      });
    }
    if (isRouteRequest) {
      if (isErrorResult(result)) {
        throw result.error;
      }
      return {
        matches: [actionMatch],
        loaderData: {},
        actionData: { [actionMatch.route.id]: result.data },
        errors: null,
        // Note: statusCode + headers are unused here since queryRoute will
        // return the raw Response or value
        statusCode: 200,
        loaderHeaders: {},
        actionHeaders: {}
      };
    }
    if (skipRevalidation) {
      if (isErrorResult(result)) {
        let boundaryMatch = skipLoaderErrorBubbling ? actionMatch : findNearestBoundary(matches, actionMatch.route.id);
        return {
          statusCode: isRouteErrorResponse(result.error) ? result.error.status : result.statusCode != null ? result.statusCode : 500,
          actionData: null,
          actionHeaders: {
            ...result.headers ? { [actionMatch.route.id]: result.headers } : {}
          },
          matches,
          loaderData: {},
          errors: {
            [boundaryMatch.route.id]: result.error
          },
          loaderHeaders: {}
        };
      } else {
        return {
          actionData: {
            [actionMatch.route.id]: result.data
          },
          actionHeaders: result.headers ? { [actionMatch.route.id]: result.headers } : {},
          matches,
          loaderData: {},
          errors: null,
          statusCode: result.statusCode || 200,
          loaderHeaders: {}
        };
      }
    }
    let loaderRequest = new Request(request.url, {
      headers: request.headers,
      redirect: request.redirect,
      signal: request.signal
    });
    if (isErrorResult(result)) {
      let boundaryMatch = skipLoaderErrorBubbling ? actionMatch : findNearestBoundary(matches, actionMatch.route.id);
      let handlerContext2 = await loadRouteData(
        loaderRequest,
        matches,
        requestContext,
        dataStrategy,
        skipLoaderErrorBubbling,
        null,
        filterMatchesToLoad,
        [boundaryMatch.route.id, result]
      );
      return {
        ...handlerContext2,
        statusCode: isRouteErrorResponse(result.error) ? result.error.status : result.statusCode != null ? result.statusCode : 500,
        actionData: null,
        actionHeaders: {
          ...result.headers ? { [actionMatch.route.id]: result.headers } : {}
        }
      };
    }
    let handlerContext = await loadRouteData(
      loaderRequest,
      matches,
      requestContext,
      dataStrategy,
      skipLoaderErrorBubbling,
      null,
      filterMatchesToLoad
    );
    return {
      ...handlerContext,
      actionData: {
        [actionMatch.route.id]: result.data
      },
      // action status codes take precedence over loader status codes
      ...result.statusCode ? { statusCode: result.statusCode } : {},
      actionHeaders: result.headers ? { [actionMatch.route.id]: result.headers } : {}
    };
  }
  async function loadRouteData(request, matches, requestContext, dataStrategy, skipLoaderErrorBubbling, routeMatch, filterMatchesToLoad, pendingActionResult) {
    let isRouteRequest = routeMatch != null;
    if (isRouteRequest && !routeMatch?.route.loader && !routeMatch?.route.lazy) {
      throw getInternalRouterError(400, {
        method: request.method,
        pathname: new URL(request.url).pathname,
        routeId: routeMatch?.route.id
      });
    }
    let dsMatches;
    if (routeMatch) {
      dsMatches = getTargetedDataStrategyMatches(
        mapRouteProperties,
        manifest,
        request,
        matches,
        routeMatch,
        [],
        requestContext
      );
    } else {
      let maxIdx = pendingActionResult && isErrorResult(pendingActionResult[1]) ? (
        // Up to but not including the boundary
        matches.findIndex((m) => m.route.id === pendingActionResult[0]) - 1
      ) : void 0;
      let pattern = getRoutePattern(matches);
      dsMatches = matches.map((match, index) => {
        if (maxIdx != null && index > maxIdx) {
          return getDataStrategyMatch(
            mapRouteProperties,
            manifest,
            request,
            pattern,
            match,
            [],
            requestContext,
            false
          );
        }
        return getDataStrategyMatch(
          mapRouteProperties,
          manifest,
          request,
          pattern,
          match,
          [],
          requestContext,
          (match.route.loader || match.route.lazy) != null && (!filterMatchesToLoad || filterMatchesToLoad(match))
        );
      });
    }
    if (!dataStrategy && !dsMatches.some((m) => m.shouldLoad)) {
      return {
        matches,
        loaderData: {},
        errors: pendingActionResult && isErrorResult(pendingActionResult[1]) ? {
          [pendingActionResult[0]]: pendingActionResult[1].error
        } : null,
        statusCode: 200,
        loaderHeaders: {}
      };
    }
    let results = await callDataStrategy(
      request,
      dsMatches,
      isRouteRequest,
      requestContext,
      dataStrategy
    );
    if (request.signal.aborted) {
      throwStaticHandlerAbortedError(request, isRouteRequest);
    }
    let handlerContext = processRouteLoaderData(
      matches,
      results,
      pendingActionResult,
      true,
      skipLoaderErrorBubbling
    );
    return {
      ...handlerContext,
      matches
    };
  }
  async function callDataStrategy(request, matches, isRouteRequest, requestContext, dataStrategy) {
    let results = await callDataStrategyImpl(
      dataStrategy || defaultDataStrategy,
      request,
      matches,
      null,
      requestContext
    );
    let dataResults = {};
    await Promise.all(
      matches.map(async (match) => {
        if (!(match.route.id in results)) {
          return;
        }
        let result = results[match.route.id];
        if (isRedirectDataStrategyResult(result)) {
          let response = result.result;
          throw normalizeRelativeRoutingRedirectResponse(
            response,
            request,
            match.route.id,
            matches,
            basename2
          );
        }
        if (isRouteRequest) {
          if (isResponse(result.result)) {
            throw result;
          } else if (isDataWithResponseInit(result.result)) {
            throw dataWithResponseInitToResponse(result.result);
          }
        }
        dataResults[match.route.id] = await convertDataStrategyResultToDataResult(result);
      })
    );
    return dataResults;
  }
  return {
    dataRoutes,
    query,
    queryRoute
  };
}
function getStaticContextFromError(routes2, handlerContext, error, boundaryId) {
  let errorBoundaryId = boundaryId || handlerContext._deepestRenderedBoundaryId || routes2[0].id;
  return {
    ...handlerContext,
    statusCode: isRouteErrorResponse(error) ? error.status : 500,
    errors: {
      [errorBoundaryId]: error
    }
  };
}
function throwStaticHandlerAbortedError(request, isRouteRequest) {
  if (request.signal.reason !== void 0) {
    throw request.signal.reason;
  }
  let method = isRouteRequest ? "queryRoute" : "query";
  throw new Error(
    `${method}() call aborted without an \`AbortSignal.reason\`: ${request.method} ${request.url}`
  );
}
function normalizeTo(location, matches, basename2, to, fromRouteId, relative) {
  let contextualMatches;
  let activeRouteMatch;
  {
    contextualMatches = matches;
    activeRouteMatch = matches[matches.length - 1];
  }
  let path = resolveTo(
    to ? to : ".",
    getResolveToMatches(contextualMatches),
    stripBasename(location.pathname, basename2) || location.pathname,
    relative === "path"
  );
  if (to == null) {
    path.search = location.search;
    path.hash = location.hash;
  }
  if ((to == null || to === "" || to === ".") && activeRouteMatch) {
    let nakedIndex = hasNakedIndexQuery(path.search);
    if (activeRouteMatch.route.index && !nakedIndex) {
      path.search = path.search ? path.search.replace(/^\?/, "?index&") : "?index";
    } else if (!activeRouteMatch.route.index && nakedIndex) {
      let params = new URLSearchParams(path.search);
      let indexValues = params.getAll("index");
      params.delete("index");
      indexValues.filter((v) => v).forEach((v) => params.append("index", v));
      let qs = params.toString();
      path.search = qs ? `?${qs}` : "";
    }
  }
  if (basename2 !== "/") {
    path.pathname = prependBasename({ basename: basename2, pathname: path.pathname });
  }
  return createPath(path);
}
function shouldRevalidateLoader(loaderMatch, arg) {
  if (loaderMatch.route.shouldRevalidate) {
    let routeChoice = loaderMatch.route.shouldRevalidate(arg);
    if (typeof routeChoice === "boolean") {
      return routeChoice;
    }
  }
  return arg.defaultShouldRevalidate;
}
var lazyRoutePropertyCache = /* @__PURE__ */ new WeakMap();
var loadLazyRouteProperty = ({
  key,
  route,
  manifest,
  mapRouteProperties
}) => {
  let routeToUpdate = manifest[route.id];
  invariant(routeToUpdate, "No route found in manifest");
  if (!routeToUpdate.lazy || typeof routeToUpdate.lazy !== "object") {
    return;
  }
  let lazyFn = routeToUpdate.lazy[key];
  if (!lazyFn) {
    return;
  }
  let cache2 = lazyRoutePropertyCache.get(routeToUpdate);
  if (!cache2) {
    cache2 = {};
    lazyRoutePropertyCache.set(routeToUpdate, cache2);
  }
  let cachedPromise = cache2[key];
  if (cachedPromise) {
    return cachedPromise;
  }
  let propertyPromise = (async () => {
    let isUnsupported = isUnsupportedLazyRouteObjectKey(key);
    let staticRouteValue = routeToUpdate[key];
    let isStaticallyDefined = staticRouteValue !== void 0 && key !== "hasErrorBoundary";
    if (isUnsupported) {
      warning(
        !isUnsupported,
        "Route property " + key + " is not a supported lazy route property. This property will be ignored."
      );
      cache2[key] = Promise.resolve();
    } else if (isStaticallyDefined) {
      warning(
        false,
        `Route "${routeToUpdate.id}" has a static property "${key}" defined. The lazy property will be ignored.`
      );
    } else {
      let value = await lazyFn();
      if (value != null) {
        Object.assign(routeToUpdate, { [key]: value });
        Object.assign(routeToUpdate, mapRouteProperties(routeToUpdate));
      }
    }
    if (typeof routeToUpdate.lazy === "object") {
      routeToUpdate.lazy[key] = void 0;
      if (Object.values(routeToUpdate.lazy).every((value) => value === void 0)) {
        routeToUpdate.lazy = void 0;
      }
    }
  })();
  cache2[key] = propertyPromise;
  return propertyPromise;
};
var lazyRouteFunctionCache = /* @__PURE__ */ new WeakMap();
function loadLazyRoute(route, type, manifest, mapRouteProperties, lazyRoutePropertiesToSkip) {
  let routeToUpdate = manifest[route.id];
  invariant(routeToUpdate, "No route found in manifest");
  if (!route.lazy) {
    return {
      lazyRoutePromise: void 0,
      lazyHandlerPromise: void 0
    };
  }
  if (typeof route.lazy === "function") {
    let cachedPromise = lazyRouteFunctionCache.get(routeToUpdate);
    if (cachedPromise) {
      return {
        lazyRoutePromise: cachedPromise,
        lazyHandlerPromise: cachedPromise
      };
    }
    let lazyRoutePromise2 = (async () => {
      invariant(
        typeof route.lazy === "function",
        "No lazy route function found"
      );
      let lazyRoute = await route.lazy();
      let routeUpdates = {};
      for (let lazyRouteProperty in lazyRoute) {
        let lazyValue = lazyRoute[lazyRouteProperty];
        if (lazyValue === void 0) {
          continue;
        }
        let isUnsupported = isUnsupportedLazyRouteFunctionKey(lazyRouteProperty);
        let staticRouteValue = routeToUpdate[lazyRouteProperty];
        let isStaticallyDefined = staticRouteValue !== void 0 && // This property isn't static since it should always be updated based
        // on the route updates
        lazyRouteProperty !== "hasErrorBoundary";
        if (isUnsupported) {
          warning(
            !isUnsupported,
            "Route property " + lazyRouteProperty + " is not a supported property to be returned from a lazy route function. This property will be ignored."
          );
        } else if (isStaticallyDefined) {
          warning(
            !isStaticallyDefined,
            `Route "${routeToUpdate.id}" has a static property "${lazyRouteProperty}" defined but its lazy function is also returning a value for this property. The lazy route property "${lazyRouteProperty}" will be ignored.`
          );
        } else {
          routeUpdates[lazyRouteProperty] = lazyValue;
        }
      }
      Object.assign(routeToUpdate, routeUpdates);
      Object.assign(routeToUpdate, {
        // To keep things framework agnostic, we use the provided `mapRouteProperties`
        // function to set the framework-aware properties (`element`/`hasErrorBoundary`)
        // since the logic will differ between frameworks.
        ...mapRouteProperties(routeToUpdate),
        lazy: void 0
      });
    })();
    lazyRouteFunctionCache.set(routeToUpdate, lazyRoutePromise2);
    lazyRoutePromise2.catch(() => {
    });
    return {
      lazyRoutePromise: lazyRoutePromise2,
      lazyHandlerPromise: lazyRoutePromise2
    };
  }
  let lazyKeys = Object.keys(route.lazy);
  let lazyPropertyPromises = [];
  let lazyHandlerPromise = void 0;
  for (let key of lazyKeys) {
    if (lazyRoutePropertiesToSkip && lazyRoutePropertiesToSkip.includes(key)) {
      continue;
    }
    let promise = loadLazyRouteProperty({
      key,
      route,
      manifest,
      mapRouteProperties
    });
    if (promise) {
      lazyPropertyPromises.push(promise);
      if (key === type) {
        lazyHandlerPromise = promise;
      }
    }
  }
  let lazyRoutePromise = lazyPropertyPromises.length > 0 ? Promise.all(lazyPropertyPromises).then(() => {
  }) : void 0;
  lazyRoutePromise?.catch(() => {
  });
  lazyHandlerPromise?.catch(() => {
  });
  return {
    lazyRoutePromise,
    lazyHandlerPromise
  };
}
function isNonNullable(value) {
  return value !== void 0;
}
function loadLazyMiddlewareForMatches(matches, manifest, mapRouteProperties) {
  let promises = matches.map(({ route }) => {
    if (typeof route.lazy !== "object" || !route.lazy.middleware) {
      return void 0;
    }
    return loadLazyRouteProperty({
      key: "middleware",
      route,
      manifest,
      mapRouteProperties
    });
  }).filter(isNonNullable);
  return promises.length > 0 ? Promise.all(promises) : void 0;
}
async function defaultDataStrategy(args) {
  let matchesToLoad = args.matches.filter((m) => m.shouldLoad);
  let keyedResults = {};
  let results = await Promise.all(matchesToLoad.map((m) => m.resolve()));
  results.forEach((result, i) => {
    keyedResults[matchesToLoad[i].route.id] = result;
  });
  return keyedResults;
}
function runServerMiddlewarePipeline(args, handler, errorHandler) {
  return runMiddlewarePipeline(
    args,
    handler,
    processResult,
    isResponse,
    errorHandler
  );
  function processResult(result) {
    return isDataWithResponseInit(result) ? dataWithResponseInitToResponse(result) : result;
  }
}
async function runMiddlewarePipeline(args, handler, processResult, isResult, errorHandler) {
  let { matches, request, params, context, unstable_pattern } = args;
  let tuples = matches.flatMap(
    (m) => m.route.middleware ? m.route.middleware.map((fn) => [m.route.id, fn]) : []
  );
  let result = await callRouteMiddleware(
    {
      request,
      params,
      context,
      unstable_pattern
    },
    tuples,
    handler,
    processResult,
    isResult,
    errorHandler
  );
  return result;
}
async function callRouteMiddleware(args, middlewares, handler, processResult, isResult, errorHandler, idx = 0) {
  let { request } = args;
  if (request.signal.aborted) {
    throw request.signal.reason ?? new Error(`Request aborted: ${request.method} ${request.url}`);
  }
  let tuple = middlewares[idx];
  if (!tuple) {
    let result = await handler();
    return result;
  }
  let [routeId, middleware] = tuple;
  let nextResult;
  let next = async () => {
    if (nextResult) {
      throw new Error("You may only call `next()` once per middleware");
    }
    try {
      let result = await callRouteMiddleware(
        args,
        middlewares,
        handler,
        processResult,
        isResult,
        errorHandler,
        idx + 1
      );
      nextResult = { value: result };
      return nextResult.value;
    } catch (error) {
      nextResult = { value: await errorHandler(error, routeId, nextResult) };
      return nextResult.value;
    }
  };
  try {
    let value = await middleware(args, next);
    let result = value != null ? processResult(value) : void 0;
    if (isResult(result)) {
      return result;
    } else if (nextResult) {
      return result ?? nextResult.value;
    } else {
      nextResult = { value: await next() };
      return nextResult.value;
    }
  } catch (error) {
    let response = await errorHandler(error, routeId, nextResult);
    return response;
  }
}
function getDataStrategyMatchLazyPromises(mapRouteProperties, manifest, request, match, lazyRoutePropertiesToSkip) {
  let lazyMiddlewarePromise = loadLazyRouteProperty({
    key: "middleware",
    route: match.route,
    manifest,
    mapRouteProperties
  });
  let lazyRoutePromises = loadLazyRoute(
    match.route,
    isMutationMethod(request.method) ? "action" : "loader",
    manifest,
    mapRouteProperties,
    lazyRoutePropertiesToSkip
  );
  return {
    middleware: lazyMiddlewarePromise,
    route: lazyRoutePromises.lazyRoutePromise,
    handler: lazyRoutePromises.lazyHandlerPromise
  };
}
function getDataStrategyMatch(mapRouteProperties, manifest, request, unstable_pattern, match, lazyRoutePropertiesToSkip, scopedContext, shouldLoad, shouldRevalidateArgs = null, callSiteDefaultShouldRevalidate) {
  let isUsingNewApi = false;
  let _lazyPromises = getDataStrategyMatchLazyPromises(
    mapRouteProperties,
    manifest,
    request,
    match,
    lazyRoutePropertiesToSkip
  );
  return {
    ...match,
    _lazyPromises,
    shouldLoad,
    shouldRevalidateArgs,
    shouldCallHandler(defaultShouldRevalidate) {
      isUsingNewApi = true;
      if (!shouldRevalidateArgs) {
        return shouldLoad;
      }
      if (typeof defaultShouldRevalidate === "boolean") {
        return shouldRevalidateLoader(match, {
          ...shouldRevalidateArgs,
          defaultShouldRevalidate
        });
      }
      return shouldRevalidateLoader(match, shouldRevalidateArgs);
    },
    resolve(handlerOverride) {
      let { lazy, loader, middleware } = match.route;
      let callHandler = isUsingNewApi || shouldLoad || handlerOverride && !isMutationMethod(request.method) && (lazy || loader);
      let isMiddlewareOnlyRoute = middleware && middleware.length > 0 && !loader && !lazy;
      if (callHandler && (isMutationMethod(request.method) || !isMiddlewareOnlyRoute)) {
        return callLoaderOrAction({
          request,
          unstable_pattern,
          match,
          lazyHandlerPromise: _lazyPromises?.handler,
          lazyRoutePromise: _lazyPromises?.route,
          handlerOverride,
          scopedContext
        });
      }
      return Promise.resolve({ type: "data", result: void 0 });
    }
  };
}
function getTargetedDataStrategyMatches(mapRouteProperties, manifest, request, matches, targetMatch, lazyRoutePropertiesToSkip, scopedContext, shouldRevalidateArgs = null) {
  return matches.map((match) => {
    if (match.route.id !== targetMatch.route.id) {
      return {
        ...match,
        shouldLoad: false,
        shouldRevalidateArgs,
        shouldCallHandler: () => false,
        _lazyPromises: getDataStrategyMatchLazyPromises(
          mapRouteProperties,
          manifest,
          request,
          match,
          lazyRoutePropertiesToSkip
        ),
        resolve: () => Promise.resolve({ type: "data", result: void 0 })
      };
    }
    return getDataStrategyMatch(
      mapRouteProperties,
      manifest,
      request,
      getRoutePattern(matches),
      match,
      lazyRoutePropertiesToSkip,
      scopedContext,
      true,
      shouldRevalidateArgs
    );
  });
}
async function callDataStrategyImpl(dataStrategyImpl, request, matches, fetcherKey, scopedContext, isStaticHandler) {
  if (matches.some((m) => m._lazyPromises?.middleware)) {
    await Promise.all(matches.map((m) => m._lazyPromises?.middleware));
  }
  let dataStrategyArgs = {
    request,
    unstable_pattern: getRoutePattern(matches),
    params: matches[0].params,
    context: scopedContext,
    matches
  };
  let runClientMiddleware = () => {
    throw new Error(
      "You cannot call `runClientMiddleware()` from a static handler `dataStrategy`. Middleware is run outside of `dataStrategy` during SSR in order to bubble up the Response.  You can enable middleware via the `respond` API in `query`/`queryRoute`"
    );
  };
  let results = await dataStrategyImpl({
    ...dataStrategyArgs,
    fetcherKey,
    runClientMiddleware
  });
  try {
    await Promise.all(
      matches.flatMap((m) => [
        m._lazyPromises?.handler,
        m._lazyPromises?.route
      ])
    );
  } catch (e) {
  }
  return results;
}
async function callLoaderOrAction({
  request,
  unstable_pattern,
  match,
  lazyHandlerPromise,
  lazyRoutePromise,
  handlerOverride,
  scopedContext
}) {
  let result;
  let onReject;
  let isAction = isMutationMethod(request.method);
  let type = isAction ? "action" : "loader";
  let runHandler = (handler) => {
    let reject;
    let abortPromise = new Promise((_, r) => reject = r);
    onReject = () => reject();
    request.signal.addEventListener("abort", onReject);
    let actualHandler = (ctx) => {
      if (typeof handler !== "function") {
        return Promise.reject(
          new Error(
            `You cannot call the handler for a route which defines a boolean "${type}" [routeId: ${match.route.id}]`
          )
        );
      }
      return handler(
        {
          request,
          unstable_pattern,
          params: match.params,
          context: scopedContext
        },
        ...ctx !== void 0 ? [ctx] : []
      );
    };
    let handlerPromise = (async () => {
      try {
        let val = await (handlerOverride ? handlerOverride((ctx) => actualHandler(ctx)) : actualHandler());
        return { type: "data", result: val };
      } catch (e) {
        return { type: "error", result: e };
      }
    })();
    return Promise.race([handlerPromise, abortPromise]);
  };
  try {
    let handler = isAction ? match.route.action : match.route.loader;
    if (lazyHandlerPromise || lazyRoutePromise) {
      if (handler) {
        let handlerError;
        let [value] = await Promise.all([
          // If the handler throws, don't let it immediately bubble out,
          // since we need to let the lazy() execution finish so we know if this
          // route has a boundary that can handle the error
          runHandler(handler).catch((e) => {
            handlerError = e;
          }),
          // Ensure all lazy route promises are resolved before continuing
          lazyHandlerPromise,
          lazyRoutePromise
        ]);
        if (handlerError !== void 0) {
          throw handlerError;
        }
        result = value;
      } else {
        await lazyHandlerPromise;
        let handler2 = isAction ? match.route.action : match.route.loader;
        if (handler2) {
          [result] = await Promise.all([runHandler(handler2), lazyRoutePromise]);
        } else if (type === "action") {
          let url = new URL(request.url);
          let pathname = url.pathname + url.search;
          throw getInternalRouterError(405, {
            method: request.method,
            pathname,
            routeId: match.route.id
          });
        } else {
          return { type: "data", result: void 0 };
        }
      }
    } else if (!handler) {
      let url = new URL(request.url);
      let pathname = url.pathname + url.search;
      throw getInternalRouterError(404, {
        pathname
      });
    } else {
      result = await runHandler(handler);
    }
  } catch (e) {
    return { type: "error", result: e };
  } finally {
    if (onReject) {
      request.signal.removeEventListener("abort", onReject);
    }
  }
  return result;
}
async function parseResponseBody(response) {
  let contentType = response.headers.get("Content-Type");
  if (contentType && /\bapplication\/json\b/.test(contentType)) {
    return response.body == null ? null : response.json();
  }
  return response.text();
}
async function convertDataStrategyResultToDataResult(dataStrategyResult) {
  let { result, type } = dataStrategyResult;
  if (isResponse(result)) {
    let data2;
    try {
      data2 = await parseResponseBody(result);
    } catch (e) {
      return { type: "error", error: e };
    }
    if (type === "error") {
      return {
        type: "error",
        error: new ErrorResponseImpl(result.status, result.statusText, data2),
        statusCode: result.status,
        headers: result.headers
      };
    }
    return {
      type: "data",
      data: data2,
      statusCode: result.status,
      headers: result.headers
    };
  }
  if (type === "error") {
    if (isDataWithResponseInit(result)) {
      if (result.data instanceof Error) {
        return {
          type: "error",
          error: result.data,
          statusCode: result.init?.status,
          headers: result.init?.headers ? new Headers(result.init.headers) : void 0
        };
      }
      return {
        type: "error",
        error: dataWithResponseInitToErrorResponse(result),
        statusCode: isRouteErrorResponse(result) ? result.status : void 0,
        headers: result.init?.headers ? new Headers(result.init.headers) : void 0
      };
    }
    return {
      type: "error",
      error: result,
      statusCode: isRouteErrorResponse(result) ? result.status : void 0
    };
  }
  if (isDataWithResponseInit(result)) {
    return {
      type: "data",
      data: result.data,
      statusCode: result.init?.status,
      headers: result.init?.headers ? new Headers(result.init.headers) : void 0
    };
  }
  return { type: "data", data: result };
}
function normalizeRelativeRoutingRedirectResponse(response, request, routeId, matches, basename2) {
  let location = response.headers.get("Location");
  invariant(
    location,
    "Redirects returned/thrown from loaders/actions must have a Location header"
  );
  if (!isAbsoluteUrl(location)) {
    let trimmedMatches = matches.slice(
      0,
      matches.findIndex((m) => m.route.id === routeId) + 1
    );
    location = normalizeTo(
      new URL(request.url),
      trimmedMatches,
      basename2,
      location
    );
    response.headers.set("Location", location);
  }
  return response;
}
function processRouteLoaderData(matches, results, pendingActionResult, isStaticHandler = false, skipLoaderErrorBubbling = false) {
  let loaderData = {};
  let errors = null;
  let statusCode;
  let foundError = false;
  let loaderHeaders = {};
  let pendingError = pendingActionResult && isErrorResult(pendingActionResult[1]) ? pendingActionResult[1].error : void 0;
  matches.forEach((match) => {
    if (!(match.route.id in results)) {
      return;
    }
    let id = match.route.id;
    let result = results[id];
    invariant(
      !isRedirectResult(result),
      "Cannot handle redirect results in processLoaderData"
    );
    if (isErrorResult(result)) {
      let error = result.error;
      if (pendingError !== void 0) {
        error = pendingError;
        pendingError = void 0;
      }
      errors = errors || {};
      if (skipLoaderErrorBubbling) {
        errors[id] = error;
      } else {
        let boundaryMatch = findNearestBoundary(matches, id);
        if (errors[boundaryMatch.route.id] == null) {
          errors[boundaryMatch.route.id] = error;
        }
      }
      if (!isStaticHandler) {
        loaderData[id] = ResetLoaderDataSymbol;
      }
      if (!foundError) {
        foundError = true;
        statusCode = isRouteErrorResponse(result.error) ? result.error.status : 500;
      }
      if (result.headers) {
        loaderHeaders[id] = result.headers;
      }
    } else {
      loaderData[id] = result.data;
      if (result.statusCode && result.statusCode !== 200 && !foundError) {
        statusCode = result.statusCode;
      }
      if (result.headers) {
        loaderHeaders[id] = result.headers;
      }
    }
  });
  if (pendingError !== void 0 && pendingActionResult) {
    errors = { [pendingActionResult[0]]: pendingError };
    if (pendingActionResult[2]) {
      loaderData[pendingActionResult[2]] = void 0;
    }
  }
  return {
    loaderData,
    errors,
    statusCode: statusCode || 200,
    loaderHeaders
  };
}
function findNearestBoundary(matches, routeId) {
  let eligibleMatches = routeId ? matches.slice(0, matches.findIndex((m) => m.route.id === routeId) + 1) : [...matches];
  return eligibleMatches.reverse().find((m) => m.route.hasErrorBoundary === true) || matches[0];
}
function getShortCircuitMatches(routes2) {
  let route = routes2.length === 1 ? routes2[0] : routes2.find((r) => r.index || !r.path || r.path === "/") || {
    id: `__shim-error-route__`
  };
  return {
    matches: [
      {
        params: {},
        pathname: "",
        pathnameBase: "",
        route
      }
    ],
    route
  };
}
function getInternalRouterError(status, {
  pathname,
  routeId,
  method,
  type,
  message
} = {}) {
  let statusText = "Unknown Server Error";
  let errorMessage = "Unknown @remix-run/router error";
  if (status === 400) {
    statusText = "Bad Request";
    if (method && pathname && routeId) {
      errorMessage = `You made a ${method} request to "${pathname}" but did not provide a \`loader\` for route "${routeId}", so there is no way to handle the request.`;
    } else if (type === "invalid-body") {
      errorMessage = "Unable to encode submission body";
    }
  } else if (status === 403) {
    statusText = "Forbidden";
    errorMessage = `Route "${routeId}" does not match URL "${pathname}"`;
  } else if (status === 404) {
    statusText = "Not Found";
    errorMessage = `No route matches URL "${pathname}"`;
  } else if (status === 405) {
    statusText = "Method Not Allowed";
    if (method && pathname && routeId) {
      errorMessage = `You made a ${method.toUpperCase()} request to "${pathname}" but did not provide an \`action\` for route "${routeId}", so there is no way to handle the request.`;
    } else if (method) {
      errorMessage = `Invalid request method "${method.toUpperCase()}"`;
    }
  }
  return new ErrorResponseImpl(
    status || 500,
    statusText,
    new Error(errorMessage),
    true
  );
}
function dataWithResponseInitToResponse(data2) {
  return Response.json(data2.data, data2.init ?? void 0);
}
function dataWithResponseInitToErrorResponse(data2) {
  return new ErrorResponseImpl(
    data2.init?.status ?? 500,
    data2.init?.statusText ?? "Internal Server Error",
    data2.data
  );
}
function isDataStrategyResult(result) {
  return result != null && typeof result === "object" && "type" in result && "result" in result && (result.type === "data" || result.type === "error");
}
function isRedirectDataStrategyResult(result) {
  return isResponse(result.result) && redirectStatusCodes.has(result.result.status);
}
function isErrorResult(result) {
  return result.type === "error";
}
function isRedirectResult(result) {
  return (result && result.type) === "redirect";
}
function isDataWithResponseInit(value) {
  return typeof value === "object" && value != null && "type" in value && "data" in value && "init" in value && value.type === "DataWithResponseInit";
}
function isResponse(value) {
  return value != null && typeof value.status === "number" && typeof value.statusText === "string" && typeof value.headers === "object" && typeof value.body !== "undefined";
}
function isRedirectStatusCode(statusCode) {
  return redirectStatusCodes.has(statusCode);
}
function isRedirectResponse(result) {
  return isResponse(result) && isRedirectStatusCode(result.status) && result.headers.has("Location");
}
function isValidMethod(method) {
  return validRequestMethods.has(method.toUpperCase());
}
function isMutationMethod(method) {
  return validMutationMethods.has(method.toUpperCase());
}
function hasNakedIndexQuery(search) {
  return new URLSearchParams(search).getAll("index").some((v) => v === "");
}
function getTargetMatch(matches, location) {
  let search = typeof location === "string" ? parsePath(location).search : location.search;
  if (matches[matches.length - 1].route.index && hasNakedIndexQuery(search || "")) {
    return matches[matches.length - 1];
  }
  let pathMatches = getPathContributingMatches(matches);
  return pathMatches[pathMatches.length - 1];
}
function invariant2(value, message) {
  if (value === false || value === null || typeof value === "undefined") {
    console.error(
      "The following error is a bug in React Router; please open an issue! https://github.com/remix-run/react-router/issues/new/choose"
    );
    throw new Error(message);
  }
}
function getDocumentHeadersImpl(context, getRouteHeadersFn, _defaultHeaders) {
  let boundaryIdx = context.errors ? context.matches.findIndex((m) => context.errors[m.route.id]) : -1;
  let matches = boundaryIdx >= 0 ? context.matches.slice(0, boundaryIdx + 1) : context.matches;
  let errorHeaders;
  if (boundaryIdx >= 0) {
    let { actionHeaders, actionData, loaderHeaders, loaderData } = context;
    context.matches.slice(boundaryIdx).some((match) => {
      let id = match.route.id;
      if (actionHeaders[id] && (!actionData || !actionData.hasOwnProperty(id))) {
        errorHeaders = actionHeaders[id];
      } else if (loaderHeaders[id] && !loaderData.hasOwnProperty(id)) {
        errorHeaders = loaderHeaders[id];
      }
      return errorHeaders != null;
    });
  }
  const defaultHeaders = new Headers(_defaultHeaders);
  return matches.reduce((parentHeaders, match, idx) => {
    let { id } = match.route;
    let loaderHeaders = context.loaderHeaders[id] || new Headers();
    let actionHeaders = context.actionHeaders[id] || new Headers();
    let includeErrorHeaders = errorHeaders != null && idx === matches.length - 1;
    let includeErrorCookies = includeErrorHeaders && errorHeaders !== loaderHeaders && errorHeaders !== actionHeaders;
    let headersFn = getRouteHeadersFn(match);
    if (headersFn == null) {
      let headers2 = new Headers(parentHeaders);
      if (includeErrorCookies) {
        prependCookies(errorHeaders, headers2);
      }
      prependCookies(actionHeaders, headers2);
      prependCookies(loaderHeaders, headers2);
      return headers2;
    }
    let headers = new Headers(
      typeof headersFn === "function" ? headersFn({
        loaderHeaders,
        parentHeaders,
        actionHeaders,
        errorHeaders: includeErrorHeaders ? errorHeaders : void 0
      }) : headersFn
    );
    if (includeErrorCookies) {
      prependCookies(errorHeaders, headers);
    }
    prependCookies(actionHeaders, headers);
    prependCookies(loaderHeaders, headers);
    prependCookies(parentHeaders, headers);
    return headers;
  }, new Headers(defaultHeaders));
}
function prependCookies(parentHeaders, childHeaders) {
  let parentSetCookieString = parentHeaders.get("Set-Cookie");
  if (parentSetCookieString) {
    let cookies = splitCookiesString(parentSetCookieString);
    let childCookies = new Set(childHeaders.getSetCookie());
    cookies.forEach((cookie) => {
      if (!childCookies.has(cookie)) {
        childHeaders.append("Set-Cookie", cookie);
      }
    });
  }
}
var SINGLE_FETCH_REDIRECT_STATUS = 202;
function throwIfPotentialCSRFAttack(headers, allowedActionOrigins) {
  let originHeader = headers.get("origin");
  let originDomain = typeof originHeader === "string" && originHeader !== "null" ? new URL(originHeader).host : originHeader;
  let host = parseHostHeader(headers);
  if (originDomain && (!host || originDomain !== host.value)) {
    if (!isAllowedOrigin(originDomain, allowedActionOrigins)) {
      if (host) {
        throw new Error(
          `${host.type} header does not match \`origin\` header from a forwarded action request. Aborting the action.`
        );
      } else {
        throw new Error(
          "`x-forwarded-host` or `host` headers are not provided. One of these is needed to compare the `origin` header from a forwarded action request. Aborting the action."
        );
      }
    }
  }
}
function matchWildcardDomain(domain, pattern) {
  const domainParts = domain.split(".");
  const patternParts = pattern.split(".");
  if (patternParts.length < 1) {
    return false;
  }
  if (domainParts.length < patternParts.length) {
    return false;
  }
  while (patternParts.length) {
    const patternPart = patternParts.pop();
    const domainPart = domainParts.pop();
    switch (patternPart) {
      case "": {
        return false;
      }
      case "*": {
        if (domainPart) {
          continue;
        } else {
          return false;
        }
      }
      case "**": {
        if (patternParts.length > 0) {
          return false;
        }
        return domainPart !== void 0;
      }
      case void 0:
      default: {
        if (domainPart !== patternPart) {
          return false;
        }
      }
    }
  }
  return domainParts.length === 0;
}
function isAllowedOrigin(originDomain, allowedActionOrigins = []) {
  return allowedActionOrigins.some(
    (allowedOrigin) => allowedOrigin && (allowedOrigin === originDomain || matchWildcardDomain(originDomain, allowedOrigin))
  );
}
function parseHostHeader(headers) {
  let forwardedHostHeader = headers.get("x-forwarded-host");
  let forwardedHostValue = forwardedHostHeader?.split(",")[0]?.trim();
  let hostHeader = headers.get("host");
  return forwardedHostValue ? {
    type: "x-forwarded-host",
    value: forwardedHostValue
  } : hostHeader ? {
    type: "host",
    value: hostHeader
  } : void 0;
}
var ERROR_DIGEST_BASE = "REACT_ROUTER_ERROR";
var ERROR_DIGEST_REDIRECT = "REDIRECT";
var ERROR_DIGEST_ROUTE_ERROR_RESPONSE = "ROUTE_ERROR_RESPONSE";
function createRedirectErrorDigest(response) {
  return `${ERROR_DIGEST_BASE}:${ERROR_DIGEST_REDIRECT}:${JSON.stringify({
    status: response.status,
    statusText: response.statusText,
    location: response.headers.get("Location"),
    reloadDocument: response.headers.get("X-Remix-Reload-Document") === "true",
    replace: response.headers.get("X-Remix-Replace") === "true"
  })}`;
}
function createRouteErrorResponseDigest(response) {
  let status = 500;
  let statusText = "";
  let data2;
  if (isDataWithResponseInit(response)) {
    status = response.init?.status ?? status;
    statusText = response.init?.statusText ?? statusText;
    data2 = response.data;
  } else {
    status = response.status;
    statusText = response.statusText;
    data2 = void 0;
  }
  return `${ERROR_DIGEST_BASE}:${ERROR_DIGEST_ROUTE_ERROR_RESPONSE}:${JSON.stringify(
    {
      status,
      statusText,
      data: data2
    }
  )}`;
}
var Outlet = Outlet$1;
var WithComponentProps = UNSAFE_WithComponentProps;
var WithErrorBoundaryProps = UNSAFE_WithErrorBoundaryProps;
var WithHydrateFallbackProps = UNSAFE_WithHydrateFallbackProps;
var globalVar = typeof globalThis !== "undefined" ? globalThis : global;
var ServerStorage = globalVar.___reactRouterServerStorage___ ?? (globalVar.___reactRouterServerStorage___ = new AsyncLocalStorage$1());
var redirect2 = (...args) => {
  const response = redirect(...args);
  const ctx = ServerStorage.getStore();
  if (ctx && ctx.runningAction) {
    ctx.redirect = response;
  }
  return response;
};
// @ts-expect-error - on 18 types, requires 19.
react_reactServerExports.cache(async (resolve) => {
  return Promise.allSettled([resolve]).then((r) => r[0]);
});
async function matchRSCServerRequest({
  allowedActionOrigins,
  createTemporaryReferenceSet: createTemporaryReferenceSet2,
  basename: basename2,
  decodeReply: decodeReply2,
  requestContext,
  loadServerAction: loadServerAction2,
  decodeAction: decodeAction2,
  decodeFormState: decodeFormState2,
  onError,
  request,
  routes: routes2,
  generateResponse
}) {
  let url = new URL(request.url);
  basename2 = basename2 || "/";
  let normalizedPath = url.pathname;
  if (url.pathname.endsWith("/_.rsc")) {
    normalizedPath = url.pathname.replace(/_\.rsc$/, "");
  } else if (url.pathname.endsWith(".rsc")) {
    normalizedPath = url.pathname.replace(/\.rsc$/, "");
  }
  if (stripBasename(normalizedPath, basename2) !== "/" && normalizedPath.endsWith("/")) {
    normalizedPath = normalizedPath.slice(0, -1);
  }
  url.pathname = normalizedPath;
  basename2 = basename2.length > normalizedPath.length ? normalizedPath : basename2;
  let routerRequest = new Request(url.toString(), {
    method: request.method,
    headers: request.headers,
    body: request.body,
    signal: request.signal,
    duplex: request.body ? "half" : void 0
  });
  const temporaryReferences = createTemporaryReferenceSet2();
  const requestUrl = new URL(request.url);
  if (isManifestRequest(requestUrl)) {
    let response2 = await generateManifestResponse(
      routes2,
      basename2,
      request,
      generateResponse,
      temporaryReferences
    );
    return response2;
  }
  let isDataRequest = isReactServerRequest(requestUrl);
  let matches = matchRoutes(routes2, url.pathname, basename2);
  if (matches) {
    await Promise.all(matches.map((m) => explodeLazyRoute(m.route)));
  }
  const leafMatch = matches?.[matches.length - 1];
  if (!isDataRequest && leafMatch && !leafMatch.route.Component && !leafMatch.route.ErrorBoundary) {
    return generateResourceResponse(
      routerRequest,
      routes2,
      basename2,
      leafMatch.route.id,
      requestContext,
      onError
    );
  }
  let response = await generateRenderResponse(
    routerRequest,
    routes2,
    basename2,
    isDataRequest,
    decodeReply2,
    requestContext,
    loadServerAction2,
    decodeAction2,
    decodeFormState2,
    onError,
    generateResponse,
    temporaryReferences,
    allowedActionOrigins
  );
  response.headers.set("X-Remix-Response", "yes");
  return response;
}
async function generateManifestResponse(routes2, basename2, request, generateResponse, temporaryReferences) {
  let url = new URL(request.url);
  let pathParam = url.searchParams.get("paths");
  let pathnames = pathParam ? pathParam.split(",").filter(Boolean) : [url.pathname.replace(/\.manifest$/, "")];
  let routeIds = /* @__PURE__ */ new Set();
  let matchedRoutes = pathnames.flatMap((pathname) => {
    let pathnameMatches = matchRoutes(routes2, pathname, basename2);
    return pathnameMatches?.map((m, i) => ({
      ...m.route,
      parentId: pathnameMatches[i - 1]?.route.id
    })) ?? [];
  }).filter((route) => {
    if (!routeIds.has(route.id)) {
      routeIds.add(route.id);
      return true;
    }
    return false;
  });
  let payload = {
    type: "manifest",
    patches: (await Promise.all([
      ...matchedRoutes.map((route) => getManifestRoute(route)),
      getAdditionalRoutePatches(
        pathnames,
        routes2,
        basename2,
        Array.from(routeIds)
      )
    ])).flat(1)
  };
  return generateResponse(
    {
      statusCode: 200,
      headers: new Headers({
        "Content-Type": "text/x-component",
        Vary: "Content-Type"
      }),
      payload
    },
    { temporaryReferences, onError: defaultOnError }
  );
}
function prependBasenameToRedirectResponse(response, basename2 = "/") {
  if (basename2 === "/") {
    return response;
  }
  let redirect3 = response.headers.get("Location");
  if (!redirect3 || isAbsoluteUrl(redirect3)) {
    return response;
  }
  response.headers.set(
    "Location",
    prependBasename({ basename: basename2, pathname: redirect3 })
  );
  return response;
}
async function processServerAction(request, basename2, decodeReply2, loadServerAction2, decodeAction2, decodeFormState2, onError, temporaryReferences) {
  const getRevalidationRequest = () => new Request(request.url, {
    method: "GET",
    headers: request.headers,
    signal: request.signal
  });
  const isFormRequest = canDecodeWithFormData(
    request.headers.get("Content-Type")
  );
  const actionId = request.headers.get("rsc-action-id");
  if (actionId) {
    if (!decodeReply2 || !loadServerAction2) {
      throw new Error(
        "Cannot handle enhanced server action without decodeReply and loadServerAction functions"
      );
    }
    const reply = isFormRequest ? await request.formData() : await request.text();
    const actionArgs = await decodeReply2(reply, { temporaryReferences });
    const action = await loadServerAction2(actionId);
    const serverAction = action.bind(null, ...actionArgs);
    let actionResult = Promise.resolve(serverAction());
    try {
      await actionResult;
    } catch (error) {
      if (isResponse(error)) {
        return error;
      }
      onError?.(error);
    }
    let maybeFormData = actionArgs.length === 1 ? actionArgs[0] : actionArgs[1];
    let formData = maybeFormData && typeof maybeFormData === "object" && maybeFormData instanceof FormData ? maybeFormData : null;
    let skipRevalidation = formData?.has("$SKIP_REVALIDATION") ?? false;
    return {
      actionResult,
      revalidationRequest: getRevalidationRequest(),
      skipRevalidation
    };
  } else if (isFormRequest) {
    const formData = await request.clone().formData();
    if (Array.from(formData.keys()).some((k) => k.startsWith("$ACTION_"))) {
      if (!decodeAction2) {
        throw new Error(
          "Cannot handle form actions without a decodeAction function"
        );
      }
      const action = await decodeAction2(formData);
      let formState = void 0;
      try {
        let result = await action();
        if (isRedirectResponse(result)) {
          result = prependBasenameToRedirectResponse(result, basename2);
        }
        formState = decodeFormState2?.(result, formData);
      } catch (error) {
        if (isRedirectResponse(error)) {
          return prependBasenameToRedirectResponse(error, basename2);
        }
        if (isResponse(error)) {
          return error;
        }
        onError?.(error);
      }
      return {
        formState,
        revalidationRequest: getRevalidationRequest(),
        skipRevalidation: false
      };
    }
  }
}
async function generateResourceResponse(request, routes2, basename2, routeId, requestContext, onError) {
  try {
    const staticHandler = createStaticHandler(routes2, {
      basename: basename2
    });
    let response = await staticHandler.queryRoute(request, {
      routeId,
      requestContext,
      async generateMiddlewareResponse(queryRoute) {
        try {
          let response2 = await queryRoute(request);
          return generateResourceResponse2(response2);
        } catch (error) {
          return generateErrorResponse(error);
        }
      }
    });
    return response;
  } catch (error) {
    return generateErrorResponse(error);
  }
  function generateErrorResponse(error) {
    let response;
    if (isResponse(error)) {
      response = error;
    } else if (isRouteErrorResponse(error)) {
      onError?.(error);
      const errorMessage = typeof error.data === "string" ? error.data : error.statusText;
      response = new Response(errorMessage, {
        status: error.status,
        statusText: error.statusText
      });
    } else {
      onError?.(error);
      response = new Response("Internal Server Error", { status: 500 });
    }
    return generateResourceResponse2(response);
  }
  function generateResourceResponse2(response) {
    const headers = new Headers(response.headers);
    headers.set("React-Router-Resource", "true");
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
}
async function generateRenderResponse(request, routes2, basename2, isDataRequest, decodeReply2, requestContext, loadServerAction2, decodeAction2, decodeFormState2, onError, generateResponse, temporaryReferences, allowedActionOrigins) {
  let statusCode = 200;
  let url = new URL(request.url);
  let isSubmission = isMutationMethod(request.method);
  let routeIdsToLoad = !isSubmission && url.searchParams.has("_routes") ? url.searchParams.get("_routes").split(",") : null;
  const staticHandler = createStaticHandler(routes2, {
    basename: basename2,
    mapRouteProperties: (r) => ({
      hasErrorBoundary: r.ErrorBoundary != null
    })
  });
  let actionResult;
  const ctx = {
    runningAction: false
  };
  const result = await ServerStorage.run(
    ctx,
    () => staticHandler.query(request, {
      requestContext,
      skipLoaderErrorBubbling: isDataRequest,
      skipRevalidation: isSubmission,
      ...routeIdsToLoad ? { filterMatchesToLoad: (m) => routeIdsToLoad.includes(m.route.id) } : {},
      async generateMiddlewareResponse(query) {
        let formState;
        let skipRevalidation = false;
        if (request.method === "POST") {
          throwIfPotentialCSRFAttack(request.headers, allowedActionOrigins);
          ctx.runningAction = true;
          let result2 = await processServerAction(
            request,
            basename2,
            decodeReply2,
            loadServerAction2,
            decodeAction2,
            decodeFormState2,
            onError,
            temporaryReferences
          );
          ctx.runningAction = false;
          if (isResponse(result2)) {
            return generateRedirectResponse(
              result2,
              actionResult,
              basename2,
              isDataRequest,
              generateResponse,
              temporaryReferences,
              ctx.redirect?.headers
            );
          }
          skipRevalidation = result2?.skipRevalidation ?? false;
          actionResult = result2?.actionResult;
          formState = result2?.formState;
          request = result2?.revalidationRequest ?? request;
          if (ctx.redirect) {
            return generateRedirectResponse(
              ctx.redirect,
              actionResult,
              basename2,
              isDataRequest,
              generateResponse,
              temporaryReferences,
              void 0
            );
          }
        }
        let staticContext = await query(
          request,
          skipRevalidation ? {
            filterMatchesToLoad: () => false
          } : void 0
        );
        if (isResponse(staticContext)) {
          return generateRedirectResponse(
            staticContext,
            actionResult,
            basename2,
            isDataRequest,
            generateResponse,
            temporaryReferences,
            ctx.redirect?.headers
          );
        }
        return generateStaticContextResponse(
          routes2,
          basename2,
          generateResponse,
          statusCode,
          routeIdsToLoad,
          isDataRequest,
          isSubmission,
          actionResult,
          formState,
          staticContext,
          temporaryReferences,
          skipRevalidation,
          ctx.redirect?.headers
        );
      }
    })
  );
  if (isRedirectResponse(result)) {
    return generateRedirectResponse(
      result,
      actionResult,
      basename2,
      isDataRequest,
      generateResponse,
      temporaryReferences,
      ctx.redirect?.headers
    );
  }
  invariant2(isResponse(result), "Expected a response from query");
  return result;
}
function generateRedirectResponse(response, actionResult, basename2, isDataRequest, generateResponse, temporaryReferences, sideEffectRedirectHeaders) {
  let redirect3 = response.headers.get("Location");
  if (isDataRequest && basename2) {
    redirect3 = stripBasename(redirect3, basename2) || redirect3;
  }
  let payload = {
    type: "redirect",
    location: redirect3,
    reload: response.headers.get("X-Remix-Reload-Document") === "true",
    replace: response.headers.get("X-Remix-Replace") === "true",
    status: response.status,
    actionResult
  };
  let headers = new Headers(sideEffectRedirectHeaders);
  for (const [key, value] of response.headers.entries()) {
    headers.append(key, value);
  }
  headers.delete("Location");
  headers.delete("X-Remix-Reload-Document");
  headers.delete("X-Remix-Replace");
  headers.delete("Content-Length");
  headers.set("Content-Type", "text/x-component");
  headers.set("Vary", "Content-Type");
  return generateResponse(
    {
      statusCode: SINGLE_FETCH_REDIRECT_STATUS,
      headers,
      payload
    },
    { temporaryReferences, onError: defaultOnError }
  );
}
async function generateStaticContextResponse(routes2, basename2, generateResponse, statusCode, routeIdsToLoad, isDataRequest, isSubmission, actionResult, formState, staticContext, temporaryReferences, skipRevalidation, sideEffectRedirectHeaders) {
  statusCode = staticContext.statusCode ?? statusCode;
  if (staticContext.errors) {
    staticContext.errors = Object.fromEntries(
      Object.entries(staticContext.errors).map(([key, error]) => [
        key,
        isRouteErrorResponse(error) ? Object.fromEntries(Object.entries(error)) : error
      ])
    );
  }
  staticContext.matches.forEach((m) => {
    const routeHasNoLoaderData = staticContext.loaderData[m.route.id] === void 0;
    const routeHasError = Boolean(
      staticContext.errors && m.route.id in staticContext.errors
    );
    if (routeHasNoLoaderData && !routeHasError) {
      staticContext.loaderData[m.route.id] = null;
    }
  });
  let headers = getDocumentHeadersImpl(
    staticContext,
    (match) => match.route.headers,
    sideEffectRedirectHeaders
  );
  headers.delete("Content-Length");
  const baseRenderPayload = {
    type: "render",
    basename: staticContext.basename,
    actionData: staticContext.actionData,
    errors: staticContext.errors,
    loaderData: staticContext.loaderData,
    location: staticContext.location,
    formState
  };
  const renderPayloadPromise = () => getRenderPayload(
    baseRenderPayload,
    routes2,
    basename2,
    routeIdsToLoad,
    isDataRequest,
    staticContext
  );
  let payload;
  if (actionResult) {
    payload = {
      type: "action",
      actionResult,
      rerender: skipRevalidation ? void 0 : renderPayloadPromise()
    };
  } else if (isSubmission && isDataRequest) {
    payload = {
      ...baseRenderPayload,
      matches: [],
      patches: []
    };
  } else {
    payload = await renderPayloadPromise();
  }
  return generateResponse(
    {
      statusCode,
      headers,
      payload
    },
    { temporaryReferences, onError: defaultOnError }
  );
}
async function getRenderPayload(baseRenderPayload, routes2, basename2, routeIdsToLoad, isDataRequest, staticContext) {
  let deepestRenderedRouteIdx = staticContext.matches.length - 1;
  let parentIds = {};
  staticContext.matches.forEach((m, i) => {
    if (i > 0) {
      parentIds[m.route.id] = staticContext.matches[i - 1].route.id;
    }
    if (staticContext.errors && m.route.id in staticContext.errors && deepestRenderedRouteIdx > i) {
      deepestRenderedRouteIdx = i;
    }
  });
  let matchesPromise = Promise.all(
    staticContext.matches.map((match, i) => {
      let isBelowErrorBoundary = i > deepestRenderedRouteIdx;
      let parentId = parentIds[match.route.id];
      return getRSCRouteMatch({
        staticContext,
        match,
        routeIdsToLoad,
        isBelowErrorBoundary,
        parentId
      });
    })
  );
  let patchesPromise = getAdditionalRoutePatches(
    [staticContext.location.pathname],
    routes2,
    basename2,
    staticContext.matches.map((m) => m.route.id)
  );
  let [matches, patches] = await Promise.all([matchesPromise, patchesPromise]);
  return {
    ...baseRenderPayload,
    matches,
    patches
  };
}
async function getRSCRouteMatch({
  staticContext,
  match,
  isBelowErrorBoundary,
  routeIdsToLoad,
  parentId
}) {
  await explodeLazyRoute(match.route);
  const Layout = match.route.Layout || react_reactServerExports.Fragment;
  const Component = match.route.Component;
  const ErrorBoundary = match.route.ErrorBoundary;
  const HydrateFallback = match.route.HydrateFallback;
  const loaderData = staticContext.loaderData[match.route.id];
  const actionData = staticContext.actionData?.[match.route.id];
  const params = match.params;
  let element = void 0;
  let shouldLoadRoute = !routeIdsToLoad || routeIdsToLoad.includes(match.route.id);
  if (Component && shouldLoadRoute) {
    element = !isBelowErrorBoundary ? react_reactServerExports.createElement(
      Layout,
      null,
      isClientReference(Component) ? react_reactServerExports.createElement(WithComponentProps, {
        children: react_reactServerExports.createElement(Component)
      }) : react_reactServerExports.createElement(Component, {
        loaderData,
        actionData,
        params,
        matches: staticContext.matches.map(
          (match2) => convertRouteMatchToUiMatch(match2, staticContext.loaderData)
        )
      })
    ) : react_reactServerExports.createElement(Outlet);
  }
  let error = void 0;
  if (ErrorBoundary && staticContext.errors) {
    error = staticContext.errors[match.route.id];
  }
  const errorElement = ErrorBoundary ? react_reactServerExports.createElement(
    Layout,
    null,
    isClientReference(ErrorBoundary) ? react_reactServerExports.createElement(WithErrorBoundaryProps, {
      children: react_reactServerExports.createElement(ErrorBoundary)
    }) : react_reactServerExports.createElement(ErrorBoundary, {
      loaderData,
      actionData,
      params,
      error
    })
  ) : void 0;
  const hydrateFallbackElement = HydrateFallback ? react_reactServerExports.createElement(
    Layout,
    null,
    isClientReference(HydrateFallback) ? react_reactServerExports.createElement(WithHydrateFallbackProps, {
      children: react_reactServerExports.createElement(HydrateFallback)
    }) : react_reactServerExports.createElement(HydrateFallback, {
      loaderData,
      actionData,
      params
    })
  ) : void 0;
  return {
    clientAction: match.route.clientAction,
    clientLoader: match.route.clientLoader,
    element,
    errorElement,
    handle: match.route.handle,
    hasAction: !!match.route.action,
    hasComponent: !!Component,
    hasErrorBoundary: !!ErrorBoundary,
    hasLoader: !!match.route.loader,
    hydrateFallbackElement,
    id: match.route.id,
    index: match.route.index,
    links: match.route.links,
    meta: match.route.meta,
    params,
    parentId,
    path: match.route.path,
    pathname: match.pathname,
    pathnameBase: match.pathnameBase,
    shouldRevalidate: match.route.shouldRevalidate,
    // Add an unused client-only export (if present) so HMR can support
    // switching between server-first and client-only routes during development
    ...match.route.__ensureClientRouteModuleForHMR ? {
      __ensureClientRouteModuleForHMR: match.route.__ensureClientRouteModuleForHMR
    } : {}
  };
}
async function getManifestRoute(route) {
  await explodeLazyRoute(route);
  const Layout = route.Layout || react_reactServerExports.Fragment;
  const errorElement = route.ErrorBoundary ? react_reactServerExports.createElement(
    Layout,
    null,
    react_reactServerExports.createElement(route.ErrorBoundary)
  ) : void 0;
  return {
    clientAction: route.clientAction,
    clientLoader: route.clientLoader,
    handle: route.handle,
    hasAction: !!route.action,
    hasComponent: !!route.Component,
    hasErrorBoundary: !!route.ErrorBoundary,
    errorElement,
    hasLoader: !!route.loader,
    id: route.id,
    parentId: route.parentId,
    path: route.path,
    index: "index" in route ? route.index : void 0,
    links: route.links,
    meta: route.meta
  };
}
async function explodeLazyRoute(route) {
  if ("lazy" in route && route.lazy) {
    let {
      default: lazyDefaultExport,
      Component: lazyComponentExport,
      ...lazyProperties
    } = await route.lazy();
    let Component = lazyComponentExport || lazyDefaultExport;
    if (Component && !route.Component) {
      route.Component = Component;
    }
    for (let [k, v] of Object.entries(lazyProperties)) {
      if (k !== "id" && k !== "path" && k !== "index" && k !== "children" && route[k] == null) {
        route[k] = v;
      }
    }
    route.lazy = void 0;
  }
}
async function getAdditionalRoutePatches(pathnames, routes2, basename2, matchedRouteIds) {
  let patchRouteMatches = /* @__PURE__ */ new Map();
  let matchedPaths = /* @__PURE__ */ new Set();
  for (const pathname of pathnames) {
    let segments = pathname.split("/").filter(Boolean);
    let paths = ["/"];
    segments.pop();
    while (segments.length > 0) {
      paths.push(`/${segments.join("/")}`);
      segments.pop();
    }
    paths.forEach((path) => {
      if (matchedPaths.has(path)) {
        return;
      }
      matchedPaths.add(path);
      let matches = matchRoutes(routes2, path, basename2) || [];
      matches.forEach((m, i) => {
        if (patchRouteMatches.get(m.route.id)) {
          return;
        }
        patchRouteMatches.set(m.route.id, {
          ...m.route,
          parentId: matches[i - 1]?.route.id
        });
      });
    });
  }
  let patches = await Promise.all(
    [...patchRouteMatches.values()].filter((route) => !matchedRouteIds.some((id) => id === route.id)).map((route) => getManifestRoute(route))
  );
  return patches;
}
function isReactServerRequest(url) {
  return url.pathname.endsWith(".rsc");
}
function isManifestRequest(url) {
  return url.pathname.endsWith(".manifest");
}
function defaultOnError(error) {
  if (isRedirectResponse(error)) {
    return createRedirectErrorDigest(error);
  }
  if (isResponse(error) || isDataWithResponseInit(error)) {
    return createRouteErrorResponseDigest(error);
  }
}
function isClientReference(x) {
  try {
    return x.$$typeof === /* @__PURE__ */ Symbol.for("react.client.reference");
  } catch {
    return false;
  }
}
function canDecodeWithFormData(contentType) {
  if (!contentType) return false;
  return contentType.match(/\bapplication\/x-www-form-urlencoded\b/) || contentType.match(/\bmultipart\/form-data\b/);
}
const routes = [{ lazy: () => import("./assets/root-aaCTvO1x.js"), id: "root", path: "", children: [{ lazy: () => import("./assets/home-oQiD16qS.js"), id: "../routes/home", index: true }] }];
const basename = "/";
const reactRouterServeConfig = { "assetsBuildDirectory": "../client", "publicPath": "/" };
function fetchServer(request, requestContext) {
  return matchRSCServerRequest({
    basename,
    // Provide the React Server touchpoints.
    createTemporaryReferenceSet,
    decodeAction,
    decodeFormState,
    decodeReply,
    loadServerAction,
    // The incoming request.
    request,
    requestContext,
    // The app routes.
    routes,
    // Encode the match with the React Server implementation.
    generateResponse(match, options) {
      return new Response(renderToReadableStream(match.payload, options), {
        status: match.statusCode,
        headers: match.headers
      });
    }
  });
}
const entry_rsc = {
  async fetch(request, requestContext) {
    if (requestContext && !(requestContext instanceof RouterContextProvider)) {
      requestContext = void 0;
    }
    const ssr = await import("./__ssr_build/index.js");
    return await ssr.generateHTML(
      request,
      await fetchServer(request, requestContext)
    );
  }
};
export {
  React as R,
  requireReact_reactServer as a,
  redirect2 as b,
  data as d,
  entry_rsc as default,
  fetchServer,
  registerClientReference as r,
  reactRouterServeConfig as unstable_reactRouterServeConfig
};
