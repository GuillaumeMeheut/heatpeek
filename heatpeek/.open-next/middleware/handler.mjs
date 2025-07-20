
import {Buffer} from "node:buffer";
globalThis.Buffer = Buffer;

import {AsyncLocalStorage} from "node:async_hooks";
globalThis.AsyncLocalStorage = AsyncLocalStorage;


const defaultDefineProperty = Object.defineProperty;
Object.defineProperty = function(o, p, a) {
  if(p=== '__import_unsupported' && Boolean(globalThis.__import_unsupported)) {
    return;
  }
  return defaultDefineProperty(o, p, a);
};

  
  
  globalThis.openNextDebug = false;globalThis.openNextVersion = "3.7.0";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/@opennextjs/aws/dist/utils/error.js
function isOpenNextError(e) {
  try {
    return "__openNextInternal" in e;
  } catch {
    return false;
  }
}
var init_error = __esm({
  "node_modules/@opennextjs/aws/dist/utils/error.js"() {
  }
});

// node_modules/@opennextjs/aws/dist/adapters/logger.js
function debug(...args) {
  if (globalThis.openNextDebug) {
    console.log(...args);
  }
}
function warn(...args) {
  console.warn(...args);
}
function error(...args) {
  if (args.some((arg) => isDownplayedErrorLog(arg))) {
    return debug(...args);
  }
  if (args.some((arg) => isOpenNextError(arg))) {
    const error2 = args.find((arg) => isOpenNextError(arg));
    if (error2.logLevel < getOpenNextErrorLogLevel()) {
      return;
    }
    if (error2.logLevel === 0) {
      return console.log(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    if (error2.logLevel === 1) {
      return warn(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    return console.error(...args);
  }
  console.error(...args);
}
function getOpenNextErrorLogLevel() {
  const strLevel = process.env.OPEN_NEXT_ERROR_LOG_LEVEL ?? "1";
  switch (strLevel.toLowerCase()) {
    case "debug":
    case "0":
      return 0;
    case "error":
    case "2":
      return 2;
    default:
      return 1;
  }
}
var DOWNPLAYED_ERROR_LOGS, isDownplayedErrorLog;
var init_logger = __esm({
  "node_modules/@opennextjs/aws/dist/adapters/logger.js"() {
    init_error();
    DOWNPLAYED_ERROR_LOGS = [
      {
        clientName: "S3Client",
        commandName: "GetObjectCommand",
        errorName: "NoSuchKey"
      }
    ];
    isDownplayedErrorLog = (errorLog) => DOWNPLAYED_ERROR_LOGS.some((downplayedInput) => downplayedInput.clientName === errorLog?.clientName && downplayedInput.commandName === errorLog?.commandName && (downplayedInput.errorName === errorLog?.error?.name || downplayedInput.errorName === errorLog?.error?.Code));
  }
});

// node_modules/cookie/dist/index.js
var require_dist = __commonJS({
  "node_modules/cookie/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parse = parse3;
    exports.serialize = serialize;
    var cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
    var cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
    var domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
    var pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
    var __toString = Object.prototype.toString;
    var NullObject = /* @__PURE__ */ (() => {
      const C = function() {
      };
      C.prototype = /* @__PURE__ */ Object.create(null);
      return C;
    })();
    function parse3(str, options) {
      const obj = new NullObject();
      const len = str.length;
      if (len < 2)
        return obj;
      const dec = options?.decode || decode;
      let index = 0;
      do {
        const eqIdx = str.indexOf("=", index);
        if (eqIdx === -1)
          break;
        const colonIdx = str.indexOf(";", index);
        const endIdx = colonIdx === -1 ? len : colonIdx;
        if (eqIdx > endIdx) {
          index = str.lastIndexOf(";", eqIdx - 1) + 1;
          continue;
        }
        const keyStartIdx = startIndex(str, index, eqIdx);
        const keyEndIdx = endIndex(str, eqIdx, keyStartIdx);
        const key = str.slice(keyStartIdx, keyEndIdx);
        if (obj[key] === void 0) {
          let valStartIdx = startIndex(str, eqIdx + 1, endIdx);
          let valEndIdx = endIndex(str, endIdx, valStartIdx);
          const value = dec(str.slice(valStartIdx, valEndIdx));
          obj[key] = value;
        }
        index = endIdx + 1;
      } while (index < len);
      return obj;
    }
    function startIndex(str, index, max) {
      do {
        const code = str.charCodeAt(index);
        if (code !== 32 && code !== 9)
          return index;
      } while (++index < max);
      return max;
    }
    function endIndex(str, index, min) {
      while (index > min) {
        const code = str.charCodeAt(--index);
        if (code !== 32 && code !== 9)
          return index + 1;
      }
      return min;
    }
    function serialize(name, val, options) {
      const enc = options?.encode || encodeURIComponent;
      if (!cookieNameRegExp.test(name)) {
        throw new TypeError(`argument name is invalid: ${name}`);
      }
      const value = enc(val);
      if (!cookieValueRegExp.test(value)) {
        throw new TypeError(`argument val is invalid: ${val}`);
      }
      let str = name + "=" + value;
      if (!options)
        return str;
      if (options.maxAge !== void 0) {
        if (!Number.isInteger(options.maxAge)) {
          throw new TypeError(`option maxAge is invalid: ${options.maxAge}`);
        }
        str += "; Max-Age=" + options.maxAge;
      }
      if (options.domain) {
        if (!domainValueRegExp.test(options.domain)) {
          throw new TypeError(`option domain is invalid: ${options.domain}`);
        }
        str += "; Domain=" + options.domain;
      }
      if (options.path) {
        if (!pathValueRegExp.test(options.path)) {
          throw new TypeError(`option path is invalid: ${options.path}`);
        }
        str += "; Path=" + options.path;
      }
      if (options.expires) {
        if (!isDate(options.expires) || !Number.isFinite(options.expires.valueOf())) {
          throw new TypeError(`option expires is invalid: ${options.expires}`);
        }
        str += "; Expires=" + options.expires.toUTCString();
      }
      if (options.httpOnly) {
        str += "; HttpOnly";
      }
      if (options.secure) {
        str += "; Secure";
      }
      if (options.partitioned) {
        str += "; Partitioned";
      }
      if (options.priority) {
        const priority = typeof options.priority === "string" ? options.priority.toLowerCase() : void 0;
        switch (priority) {
          case "low":
            str += "; Priority=Low";
            break;
          case "medium":
            str += "; Priority=Medium";
            break;
          case "high":
            str += "; Priority=High";
            break;
          default:
            throw new TypeError(`option priority is invalid: ${options.priority}`);
        }
      }
      if (options.sameSite) {
        const sameSite = typeof options.sameSite === "string" ? options.sameSite.toLowerCase() : options.sameSite;
        switch (sameSite) {
          case true:
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError(`option sameSite is invalid: ${options.sameSite}`);
        }
      }
      return str;
    }
    function decode(str) {
      if (str.indexOf("%") === -1)
        return str;
      try {
        return decodeURIComponent(str);
      } catch (e) {
        return str;
      }
    }
    function isDate(val) {
      return __toString.call(val) === "[object Date]";
    }
  }
});

// node_modules/@opennextjs/aws/dist/http/util.js
function parseSetCookieHeader(cookies) {
  if (!cookies) {
    return [];
  }
  if (typeof cookies === "string") {
    return cookies.split(/(?<!Expires=\w+),/i).map((c) => c.trim());
  }
  return cookies;
}
function getQueryFromIterator(it) {
  const query = {};
  for (const [key, value] of it) {
    if (key in query) {
      if (Array.isArray(query[key])) {
        query[key].push(value);
      } else {
        query[key] = [query[key], value];
      }
    } else {
      query[key] = value;
    }
  }
  return query;
}
var init_util = __esm({
  "node_modules/@opennextjs/aws/dist/http/util.js"() {
  }
});

// node_modules/@opennextjs/aws/dist/overrides/converters/utils.js
function getQueryFromSearchParams(searchParams) {
  return getQueryFromIterator(searchParams.entries());
}
var init_utils = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/converters/utils.js"() {
    init_util();
  }
});

// node_modules/@opennextjs/aws/dist/overrides/converters/edge.js
var edge_exports = {};
__export(edge_exports, {
  default: () => edge_default
});
import { Buffer as Buffer2 } from "node:buffer";
var import_cookie, NULL_BODY_STATUSES, converter, edge_default;
var init_edge = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/converters/edge.js"() {
    import_cookie = __toESM(require_dist(), 1);
    init_util();
    init_utils();
    NULL_BODY_STATUSES = /* @__PURE__ */ new Set([101, 103, 204, 205, 304]);
    converter = {
      convertFrom: async (event) => {
        const url = new URL(event.url);
        const searchParams = url.searchParams;
        const query = getQueryFromSearchParams(searchParams);
        const body = await event.arrayBuffer();
        const headers = {};
        event.headers.forEach((value, key) => {
          headers[key] = value;
        });
        const rawPath = url.pathname;
        const method = event.method;
        const shouldHaveBody = method !== "GET" && method !== "HEAD";
        const cookieHeader = event.headers.get("cookie");
        const cookies = cookieHeader ? import_cookie.default.parse(cookieHeader) : {};
        return {
          type: "core",
          method,
          rawPath,
          url: event.url,
          body: shouldHaveBody ? Buffer2.from(body) : void 0,
          headers,
          remoteAddress: event.headers.get("x-forwarded-for") ?? "::1",
          query,
          cookies
        };
      },
      convertTo: async (result) => {
        if ("internalEvent" in result) {
          const request = new Request(result.internalEvent.url, {
            body: result.internalEvent.body,
            method: result.internalEvent.method,
            headers: {
              ...result.internalEvent.headers,
              "x-forwarded-host": result.internalEvent.headers.host
            }
          });
          if (globalThis.__dangerous_ON_edge_converter_returns_request === true) {
            return request;
          }
          const cfCache = (result.isISR || result.internalEvent.rawPath.startsWith("/_next/image")) && process.env.DISABLE_CACHE !== "true" ? { cacheEverything: true } : {};
          return fetch(request, {
            // This is a hack to make sure that the response is cached by Cloudflare
            // See https://developers.cloudflare.com/workers/examples/cache-using-fetch/#caching-html-resources
            // @ts-expect-error - This is a Cloudflare specific option
            cf: cfCache
          });
        }
        const headers = new Headers();
        for (const [key, value] of Object.entries(result.headers)) {
          if (key === "set-cookie" && typeof value === "string") {
            const cookies = parseSetCookieHeader(value);
            for (const cookie of cookies) {
              headers.append(key, cookie);
            }
            continue;
          }
          if (Array.isArray(value)) {
            for (const v of value) {
              headers.append(key, v);
            }
          } else {
            headers.set(key, value);
          }
        }
        const body = NULL_BODY_STATUSES.has(result.statusCode) ? null : result.body;
        return new Response(body, {
          status: result.statusCode,
          headers
        });
      },
      name: "edge"
    };
    edge_default = converter;
  }
});

// node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js
var cloudflare_edge_exports = {};
__export(cloudflare_edge_exports, {
  default: () => cloudflare_edge_default
});
var cfPropNameMapping, handler, cloudflare_edge_default;
var init_cloudflare_edge = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js"() {
    cfPropNameMapping = {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: [encodeURIComponent, "x-open-next-city"],
      country: "x-open-next-country",
      regionCode: "x-open-next-region",
      latitude: "x-open-next-latitude",
      longitude: "x-open-next-longitude"
    };
    handler = async (handler3, converter2) => async (request, env, ctx) => {
      globalThis.process = process;
      for (const [key, value] of Object.entries(env)) {
        if (typeof value === "string") {
          process.env[key] = value;
        }
      }
      const internalEvent = await converter2.convertFrom(request);
      const cfProperties = request.cf;
      for (const [propName, mapping] of Object.entries(cfPropNameMapping)) {
        const propValue = cfProperties?.[propName];
        if (propValue != null) {
          const [encode, headerName] = Array.isArray(mapping) ? mapping : [null, mapping];
          internalEvent.headers[headerName] = encode ? encode(propValue) : propValue;
        }
      }
      const response = await handler3(internalEvent, {
        waitUntil: ctx.waitUntil.bind(ctx)
      });
      const result = await converter2.convertTo(response);
      return result;
    };
    cloudflare_edge_default = {
      wrapper: handler,
      name: "cloudflare-edge",
      supportStreaming: true,
      edgeRuntime: true
    };
  }
});

// node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js
var pattern_env_exports = {};
__export(pattern_env_exports, {
  default: () => pattern_env_default
});
var envLoader, pattern_env_default;
var init_pattern_env = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js"() {
    init_logger();
    envLoader = {
      name: "env",
      resolve: async (_path) => {
        try {
          const origin = JSON.parse(process.env.OPEN_NEXT_ORIGIN ?? "{}");
          for (const [key, value] of Object.entries(globalThis.openNextConfig.functions ?? {}).filter(([key2]) => key2 !== "default")) {
            if (value.patterns.some((pattern) => {
              return new RegExp(
                // transform glob pattern to regex
                `/${pattern.replace(/\*\*/g, "(.*)").replace(/\*/g, "([^/]*)").replace(/\//g, "\\/").replace(/\?/g, ".")}`
              ).test(_path);
            })) {
              debug("Using origin", key, value.patterns);
              return origin[key];
            }
          }
          if (_path.startsWith("/_next/image") && origin.imageOptimizer) {
            debug("Using origin", "imageOptimizer", _path);
            return origin.imageOptimizer;
          }
          if (origin.default) {
            debug("Using default origin", origin.default, _path);
            return origin.default;
          }
          return false;
        } catch (e) {
          error("Error while resolving origin", e);
          return false;
        }
      }
    };
    pattern_env_default = envLoader;
  }
});

// node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js
var dummy_exports = {};
__export(dummy_exports, {
  default: () => dummy_default
});
var resolver, dummy_default;
var init_dummy = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js"() {
    resolver = {
      name: "dummy"
    };
    dummy_default = resolver;
  }
});

// node_modules/@opennextjs/aws/dist/utils/stream.js
import { Readable } from "node:stream";
function toReadableStream(value, isBase64) {
  return Readable.toWeb(Readable.from(Buffer.from(value, isBase64 ? "base64" : "utf8")));
}
function emptyReadableStream() {
  if (process.env.OPEN_NEXT_FORCE_NON_EMPTY_RESPONSE === "true") {
    return Readable.toWeb(Readable.from([Buffer.from("SOMETHING")]));
  }
  return Readable.toWeb(Readable.from([]));
}
var init_stream = __esm({
  "node_modules/@opennextjs/aws/dist/utils/stream.js"() {
  }
});

// node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js
var fetch_exports = {};
__export(fetch_exports, {
  default: () => fetch_default
});
var fetchProxy, fetch_default;
var init_fetch = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js"() {
    init_stream();
    fetchProxy = {
      name: "fetch-proxy",
      // @ts-ignore
      proxy: async (internalEvent) => {
        const { url, headers: eventHeaders, method, body } = internalEvent;
        const headers = Object.fromEntries(Object.entries(eventHeaders).filter(([key]) => key.toLowerCase() !== "cf-connecting-ip"));
        const response = await fetch(url, {
          method,
          headers,
          body
        });
        const responseHeaders = {};
        response.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });
        return {
          type: "core",
          headers: responseHeaders,
          statusCode: response.status,
          isBase64Encoded: true,
          body: response.body ?? emptyReadableStream()
        };
      }
    };
    fetch_default = fetchProxy;
  }
});

// .next/server/edge-runtime-webpack.js
var require_edge_runtime_webpack = __commonJS({
  ".next/server/edge-runtime-webpack.js"() {
    "use strict";
    (() => {
      "use strict";
      var e = {}, r = {};
      function t(o) {
        var n = r[o];
        if (void 0 !== n) return n.exports;
        var i = r[o] = { exports: {} }, l = true;
        try {
          e[o].call(i.exports, i, i.exports, t), l = false;
        } finally {
          l && delete r[o];
        }
        return i.exports;
      }
      t.m = e, t.amdO = {}, (() => {
        var e2 = [];
        t.O = (r2, o, n, i) => {
          if (o) {
            i = i || 0;
            for (var l = e2.length; l > 0 && e2[l - 1][2] > i; l--) e2[l] = e2[l - 1];
            e2[l] = [o, n, i];
            return;
          }
          for (var a = 1 / 0, l = 0; l < e2.length; l++) {
            for (var [o, n, i] = e2[l], u = true, f = 0; f < o.length; f++) a >= i && Object.keys(t.O).every((e3) => t.O[e3](o[f])) ? o.splice(f--, 1) : (u = false, i < a && (a = i));
            if (u) {
              e2.splice(l--, 1);
              var s = n();
              void 0 !== s && (r2 = s);
            }
          }
          return r2;
        };
      })(), t.n = (e2) => {
        var r2 = e2 && e2.__esModule ? () => e2.default : () => e2;
        return t.d(r2, { a: r2 }), r2;
      }, t.d = (e2, r2) => {
        for (var o in r2) t.o(r2, o) && !t.o(e2, o) && Object.defineProperty(e2, o, { enumerable: true, get: r2[o] });
      }, t.g = function() {
        if ("object" == typeof globalThis) return globalThis;
        try {
          return this || Function("return this")();
        } catch (e2) {
          if ("object" == typeof window) return window;
        }
      }(), t.o = (e2, r2) => Object.prototype.hasOwnProperty.call(e2, r2), t.r = (e2) => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e2, "__esModule", { value: true });
      }, (() => {
        var e2 = { 993: 0 };
        t.O.j = (r3) => 0 === e2[r3];
        var r2 = (r3, o2) => {
          var n, i, [l, a, u] = o2, f = 0;
          if (l.some((r4) => 0 !== e2[r4])) {
            for (n in a) t.o(a, n) && (t.m[n] = a[n]);
            if (u) var s = u(t);
          }
          for (r3 && r3(o2); f < l.length; f++) i = l[f], t.o(e2, i) && e2[i] && e2[i][0](), e2[i] = 0;
          return t.O(s);
        }, o = self.webpackChunk_N_E = self.webpackChunk_N_E || [];
        o.forEach(r2.bind(null, 0)), o.push = r2.bind(null, o.push.bind(o));
      })();
    })();
  }
});

// node-built-in-modules:node:async_hooks
var node_async_hooks_exports = {};
import * as node_async_hooks_star from "node:async_hooks";
var init_node_async_hooks = __esm({
  "node-built-in-modules:node:async_hooks"() {
    __reExport(node_async_hooks_exports, node_async_hooks_star);
  }
});

// node-built-in-modules:node:buffer
var node_buffer_exports = {};
import * as node_buffer_star from "node:buffer";
var init_node_buffer = __esm({
  "node-built-in-modules:node:buffer"() {
    __reExport(node_buffer_exports, node_buffer_star);
  }
});

// .next/server/src/middleware.js
var require_middleware = __commonJS({
  ".next/server/src/middleware.js"() {
    "use strict";
    (self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([[727], { 67: (e) => {
      "use strict";
      e.exports = (init_node_async_hooks(), __toCommonJS(node_async_hooks_exports));
    }, 195: (e) => {
      "use strict";
      e.exports = (init_node_buffer(), __toCommonJS(node_buffer_exports));
    }, 954: (e, t, r) => {
      "use strict";
      let i;
      r.r(t), r.d(t, { default: () => ii });
      var s, n, a, o, l, u, c, h, d, p, f, g, m, v, b, w, y, _, S, k, x, T, O, E = {};
      async function P() {
        let e10 = "_ENTRIES" in globalThis && _ENTRIES.middleware_instrumentation && (await _ENTRIES.middleware_instrumentation).register;
        if (e10) try {
          await e10();
        } catch (e11) {
          throw e11.message = `An error occurred while loading instrumentation hook: ${e11.message}`, e11;
        }
      }
      r.r(E), r.d(E, { config: () => r7, middleware: () => r9 });
      let R = null;
      function C() {
        return R || (R = P()), R;
      }
      function j(e10) {
        return `The edge runtime does not support Node.js '${e10}' module.
Learn More: https://nextjs.org/docs/messages/node-module-in-edge-runtime`;
      }
      process !== r.g.process && (process.env = r.g.process.env, r.g.process = process), Object.defineProperty(globalThis, "__import_unsupported", { value: function(e10) {
        let t10 = new Proxy(function() {
        }, { get(t11, r10) {
          if ("then" === r10) return {};
          throw Error(j(e10));
        }, construct() {
          throw Error(j(e10));
        }, apply(r10, i2, s2) {
          if ("function" == typeof s2[0]) return s2[0](t10);
          throw Error(j(e10));
        } });
        return new Proxy({}, { get: () => t10 });
      }, enumerable: false, configurable: false }), C();
      var A = r(416), I = r(329);
      let N = Symbol("response"), L = Symbol("passThrough"), $ = Symbol("waitUntil");
      class M {
        constructor(e10) {
          this[$] = [], this[L] = false;
        }
        respondWith(e10) {
          this[N] || (this[N] = Promise.resolve(e10));
        }
        passThroughOnException() {
          this[L] = true;
        }
        waitUntil(e10) {
          this[$].push(e10);
        }
      }
      class D extends M {
        constructor(e10) {
          super(e10.request), this.sourcePage = e10.page;
        }
        get request() {
          throw new A.qJ({ page: this.sourcePage });
        }
        respondWith() {
          throw new A.qJ({ page: this.sourcePage });
        }
      }
      var U = r(669), q = r(241);
      function B(e10, t10) {
        let r10 = "string" == typeof t10 ? new URL(t10) : t10, i2 = new URL(e10, t10), s2 = r10.protocol + "//" + r10.host;
        return i2.protocol + "//" + i2.host === s2 ? i2.toString().replace(s2, "") : i2.toString();
      }
      var V = r(718);
      let F = [["RSC"], ["Next-Router-State-Tree"], ["Next-Router-Prefetch"]], H = ["__nextFallback", "__nextLocale", "__nextInferredLocaleFromDefault", "__nextDefaultLocale", "__nextIsNotFound", "_rsc"], G = ["__nextDataReq"];
      var z = r(217);
      class W extends Error {
        constructor() {
          super("Headers cannot be modified. Read more: https://nextjs.org/docs/app/api-reference/functions/headers");
        }
        static callable() {
          throw new W();
        }
      }
      class K extends Headers {
        constructor(e10) {
          super(), this.headers = new Proxy(e10, { get(t10, r10, i2) {
            if ("symbol" == typeof r10) return z.g.get(t10, r10, i2);
            let s2 = r10.toLowerCase(), n2 = Object.keys(e10).find((e11) => e11.toLowerCase() === s2);
            if (void 0 !== n2) return z.g.get(t10, n2, i2);
          }, set(t10, r10, i2, s2) {
            if ("symbol" == typeof r10) return z.g.set(t10, r10, i2, s2);
            let n2 = r10.toLowerCase(), a2 = Object.keys(e10).find((e11) => e11.toLowerCase() === n2);
            return z.g.set(t10, a2 ?? r10, i2, s2);
          }, has(t10, r10) {
            if ("symbol" == typeof r10) return z.g.has(t10, r10);
            let i2 = r10.toLowerCase(), s2 = Object.keys(e10).find((e11) => e11.toLowerCase() === i2);
            return void 0 !== s2 && z.g.has(t10, s2);
          }, deleteProperty(t10, r10) {
            if ("symbol" == typeof r10) return z.g.deleteProperty(t10, r10);
            let i2 = r10.toLowerCase(), s2 = Object.keys(e10).find((e11) => e11.toLowerCase() === i2);
            return void 0 === s2 || z.g.deleteProperty(t10, s2);
          } });
        }
        static seal(e10) {
          return new Proxy(e10, { get(e11, t10, r10) {
            switch (t10) {
              case "append":
              case "delete":
              case "set":
                return W.callable;
              default:
                return z.g.get(e11, t10, r10);
            }
          } });
        }
        merge(e10) {
          return Array.isArray(e10) ? e10.join(", ") : e10;
        }
        static from(e10) {
          return e10 instanceof Headers ? e10 : new K(e10);
        }
        append(e10, t10) {
          let r10 = this.headers[e10];
          "string" == typeof r10 ? this.headers[e10] = [r10, t10] : Array.isArray(r10) ? r10.push(t10) : this.headers[e10] = t10;
        }
        delete(e10) {
          delete this.headers[e10];
        }
        get(e10) {
          let t10 = this.headers[e10];
          return void 0 !== t10 ? this.merge(t10) : null;
        }
        has(e10) {
          return void 0 !== this.headers[e10];
        }
        set(e10, t10) {
          this.headers[e10] = t10;
        }
        forEach(e10, t10) {
          for (let [r10, i2] of this.entries()) e10.call(t10, i2, r10, this);
        }
        *entries() {
          for (let e10 of Object.keys(this.headers)) {
            let t10 = e10.toLowerCase(), r10 = this.get(t10);
            yield [t10, r10];
          }
        }
        *keys() {
          for (let e10 of Object.keys(this.headers)) {
            let t10 = e10.toLowerCase();
            yield t10;
          }
        }
        *values() {
          for (let e10 of Object.keys(this.headers)) {
            let t10 = this.get(e10);
            yield t10;
          }
        }
        [Symbol.iterator]() {
          return this.entries();
        }
      }
      var J = r(938);
      let X = Error("Invariant: AsyncLocalStorage accessed in runtime where it is not available");
      class Y {
        disable() {
          throw X;
        }
        getStore() {
        }
        run() {
          throw X;
        }
        exit() {
          throw X;
        }
        enterWith() {
          throw X;
        }
      }
      let Q = globalThis.AsyncLocalStorage;
      function Z() {
        return Q ? new Q() : new Y();
      }
      let ee = Z();
      class et extends Error {
        constructor() {
          super("Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#cookiessetname-value-options");
        }
        static callable() {
          throw new et();
        }
      }
      class er {
        static seal(e10) {
          return new Proxy(e10, { get(e11, t10, r10) {
            switch (t10) {
              case "clear":
              case "delete":
              case "set":
                return et.callable;
              default:
                return z.g.get(e11, t10, r10);
            }
          } });
        }
      }
      let ei = Symbol.for("next.mutated.cookies");
      class es {
        static wrap(e10, t10) {
          let r10 = new J.nV(new Headers());
          for (let t11 of e10.getAll()) r10.set(t11);
          let i2 = [], s2 = /* @__PURE__ */ new Set(), n2 = () => {
            let e11 = ee.getStore();
            if (e11 && (e11.pathWasRevalidated = true), i2 = r10.getAll().filter((e12) => s2.has(e12.name)), t10) {
              let e12 = [];
              for (let t11 of i2) {
                let r11 = new J.nV(new Headers());
                r11.set(t11), e12.push(r11.toString());
              }
              t10(e12);
            }
          };
          return new Proxy(r10, { get(e11, t11, r11) {
            switch (t11) {
              case ei:
                return i2;
              case "delete":
                return function(...t12) {
                  s2.add("string" == typeof t12[0] ? t12[0] : t12[0].name);
                  try {
                    e11.delete(...t12);
                  } finally {
                    n2();
                  }
                };
              case "set":
                return function(...t12) {
                  s2.add("string" == typeof t12[0] ? t12[0] : t12[0].name);
                  try {
                    return e11.set(...t12);
                  } finally {
                    n2();
                  }
                };
              default:
                return z.g.get(e11, t11, r11);
            }
          } });
        }
      }
      var en = r(300);
      !function(e10) {
        e10.handleRequest = "BaseServer.handleRequest", e10.run = "BaseServer.run", e10.pipe = "BaseServer.pipe", e10.getStaticHTML = "BaseServer.getStaticHTML", e10.render = "BaseServer.render", e10.renderToResponseWithComponents = "BaseServer.renderToResponseWithComponents", e10.renderToResponse = "BaseServer.renderToResponse", e10.renderToHTML = "BaseServer.renderToHTML", e10.renderError = "BaseServer.renderError", e10.renderErrorToResponse = "BaseServer.renderErrorToResponse", e10.renderErrorToHTML = "BaseServer.renderErrorToHTML", e10.render404 = "BaseServer.render404";
      }(s || (s = {})), function(e10) {
        e10.loadDefaultErrorComponents = "LoadComponents.loadDefaultErrorComponents", e10.loadComponents = "LoadComponents.loadComponents";
      }(n || (n = {})), function(e10) {
        e10.getRequestHandler = "NextServer.getRequestHandler", e10.getServer = "NextServer.getServer", e10.getServerRequestHandler = "NextServer.getServerRequestHandler", e10.createServer = "createServer.createServer";
      }(a || (a = {})), function(e10) {
        e10.compression = "NextNodeServer.compression", e10.getBuildId = "NextNodeServer.getBuildId", e10.createComponentTree = "NextNodeServer.createComponentTree", e10.clientComponentLoading = "NextNodeServer.clientComponentLoading", e10.getLayoutOrPageModule = "NextNodeServer.getLayoutOrPageModule", e10.generateStaticRoutes = "NextNodeServer.generateStaticRoutes", e10.generateFsStaticRoutes = "NextNodeServer.generateFsStaticRoutes", e10.generatePublicRoutes = "NextNodeServer.generatePublicRoutes", e10.generateImageRoutes = "NextNodeServer.generateImageRoutes.route", e10.sendRenderResult = "NextNodeServer.sendRenderResult", e10.proxyRequest = "NextNodeServer.proxyRequest", e10.runApi = "NextNodeServer.runApi", e10.render = "NextNodeServer.render", e10.renderHTML = "NextNodeServer.renderHTML", e10.imageOptimizer = "NextNodeServer.imageOptimizer", e10.getPagePath = "NextNodeServer.getPagePath", e10.getRoutesManifest = "NextNodeServer.getRoutesManifest", e10.findPageComponents = "NextNodeServer.findPageComponents", e10.getFontManifest = "NextNodeServer.getFontManifest", e10.getServerComponentManifest = "NextNodeServer.getServerComponentManifest", e10.getRequestHandler = "NextNodeServer.getRequestHandler", e10.renderToHTML = "NextNodeServer.renderToHTML", e10.renderError = "NextNodeServer.renderError", e10.renderErrorToHTML = "NextNodeServer.renderErrorToHTML", e10.render404 = "NextNodeServer.render404", e10.startResponse = "NextNodeServer.startResponse", e10.route = "route", e10.onProxyReq = "onProxyReq", e10.apiResolver = "apiResolver", e10.internalFetch = "internalFetch";
      }(o || (o = {})), (l || (l = {})).startServer = "startServer.startServer", function(e10) {
        e10.getServerSideProps = "Render.getServerSideProps", e10.getStaticProps = "Render.getStaticProps", e10.renderToString = "Render.renderToString", e10.renderDocument = "Render.renderDocument", e10.createBodyResult = "Render.createBodyResult";
      }(u || (u = {})), function(e10) {
        e10.renderToString = "AppRender.renderToString", e10.renderToReadableStream = "AppRender.renderToReadableStream", e10.getBodyResult = "AppRender.getBodyResult", e10.fetch = "AppRender.fetch";
      }(c || (c = {})), (h || (h = {})).executeRoute = "Router.executeRoute", (d || (d = {})).runHandler = "Node.runHandler", (p || (p = {})).runHandler = "AppRouteRouteHandlers.runHandler", function(e10) {
        e10.generateMetadata = "ResolveMetadata.generateMetadata", e10.generateViewport = "ResolveMetadata.generateViewport";
      }(f || (f = {})), (g || (g = {})).execute = "Middleware.execute";
      let ea = ["Middleware.execute", "BaseServer.handleRequest", "Render.getServerSideProps", "Render.getStaticProps", "AppRender.fetch", "AppRender.getBodyResult", "Render.renderDocument", "Node.runHandler", "AppRouteRouteHandlers.runHandler", "ResolveMetadata.generateMetadata", "ResolveMetadata.generateViewport", "NextNodeServer.createComponentTree", "NextNodeServer.findPageComponents", "NextNodeServer.getLayoutOrPageModule", "NextNodeServer.startResponse", "NextNodeServer.clientComponentLoading"], eo = ["NextNodeServer.findPageComponents", "NextNodeServer.createComponentTree", "NextNodeServer.clientComponentLoading"], { context: el, propagation: eu, trace: ec, SpanStatusCode: eh, SpanKind: ed, ROOT_CONTEXT: ep } = i = r(439), ef = (e10) => null !== e10 && "object" == typeof e10 && "function" == typeof e10.then, eg = (e10, t10) => {
        (null == t10 ? void 0 : t10.bubble) === true ? e10.setAttribute("next.bubble", true) : (t10 && e10.recordException(t10), e10.setStatus({ code: eh.ERROR, message: null == t10 ? void 0 : t10.message })), e10.end();
      }, em = /* @__PURE__ */ new Map(), ev = i.createContextKey("next.rootSpanId"), eb = 0, ew = () => eb++;
      class ey {
        getTracerInstance() {
          return ec.getTracer("next.js", "0.0.1");
        }
        getContext() {
          return el;
        }
        getActiveScopeSpan() {
          return ec.getSpan(null == el ? void 0 : el.active());
        }
        withPropagatedContext(e10, t10, r10) {
          let i2 = el.active();
          if (ec.getSpanContext(i2)) return t10();
          let s2 = eu.extract(i2, e10, r10);
          return el.with(s2, t10);
        }
        trace(...e10) {
          var t10;
          let [r10, i2, s2] = e10, { fn: n2, options: a2 } = "function" == typeof i2 ? { fn: i2, options: {} } : { fn: s2, options: { ...i2 } }, o2 = a2.spanName ?? r10;
          if (!ea.includes(r10) && "1" !== process.env.NEXT_OTEL_VERBOSE || a2.hideSpan) return n2();
          let l2 = this.getSpanContext((null == a2 ? void 0 : a2.parentSpan) ?? this.getActiveScopeSpan()), u2 = false;
          l2 ? (null == (t10 = ec.getSpanContext(l2)) ? void 0 : t10.isRemote) && (u2 = true) : (l2 = (null == el ? void 0 : el.active()) ?? ep, u2 = true);
          let c2 = ew();
          return a2.attributes = { "next.span_name": o2, "next.span_type": r10, ...a2.attributes }, el.with(l2.setValue(ev, c2), () => this.getTracerInstance().startActiveSpan(o2, a2, (e11) => {
            let t11 = "performance" in globalThis ? globalThis.performance.now() : void 0, i3 = () => {
              em.delete(c2), t11 && process.env.NEXT_OTEL_PERFORMANCE_PREFIX && eo.includes(r10 || "") && performance.measure(`${process.env.NEXT_OTEL_PERFORMANCE_PREFIX}:next-${(r10.split(".").pop() || "").replace(/[A-Z]/g, (e12) => "-" + e12.toLowerCase())}`, { start: t11, end: performance.now() });
            };
            u2 && em.set(c2, new Map(Object.entries(a2.attributes ?? {})));
            try {
              if (n2.length > 1) return n2(e11, (t13) => eg(e11, t13));
              let t12 = n2(e11);
              if (ef(t12)) return t12.then((t13) => (e11.end(), t13)).catch((t13) => {
                throw eg(e11, t13), t13;
              }).finally(i3);
              return e11.end(), i3(), t12;
            } catch (t12) {
              throw eg(e11, t12), i3(), t12;
            }
          }));
        }
        wrap(...e10) {
          let t10 = this, [r10, i2, s2] = 3 === e10.length ? e10 : [e10[0], {}, e10[1]];
          return ea.includes(r10) || "1" === process.env.NEXT_OTEL_VERBOSE ? function() {
            let e11 = i2;
            "function" == typeof e11 && "function" == typeof s2 && (e11 = e11.apply(this, arguments));
            let n2 = arguments.length - 1, a2 = arguments[n2];
            if ("function" != typeof a2) return t10.trace(r10, e11, () => s2.apply(this, arguments));
            {
              let i3 = t10.getContext().bind(el.active(), a2);
              return t10.trace(r10, e11, (e12, t11) => (arguments[n2] = function(e13) {
                return null == t11 || t11(e13), i3.apply(this, arguments);
              }, s2.apply(this, arguments)));
            }
          } : s2;
        }
        startSpan(...e10) {
          let [t10, r10] = e10, i2 = this.getSpanContext((null == r10 ? void 0 : r10.parentSpan) ?? this.getActiveScopeSpan());
          return this.getTracerInstance().startSpan(t10, r10, i2);
        }
        getSpanContext(e10) {
          return e10 ? ec.setSpan(el.active(), e10) : void 0;
        }
        getRootSpanAttributes() {
          let e10 = el.active().getValue(ev);
          return em.get(e10);
        }
      }
      let e_ = (() => {
        let e10 = new ey();
        return () => e10;
      })(), eS = "__prerender_bypass";
      Symbol("__next_preview_data"), Symbol(eS);
      class ek {
        constructor(e10, t10, r10, i2) {
          var s2;
          let n2 = e10 && function(e11, t11) {
            let r11 = K.from(e11.headers);
            return { isOnDemandRevalidate: r11.get(en.y3) === t11.previewModeId, revalidateOnlyGenerated: r11.has(en.Qq) };
          }(t10, e10).isOnDemandRevalidate, a2 = null == (s2 = r10.get(eS)) ? void 0 : s2.value;
          this.isEnabled = !!(!n2 && a2 && e10 && a2 === e10.previewModeId), this._previewModeId = null == e10 ? void 0 : e10.previewModeId, this._mutableCookies = i2;
        }
        enable() {
          if (!this._previewModeId) throw Error("Invariant: previewProps missing previewModeId this should never happen");
          this._mutableCookies.set({ name: eS, value: this._previewModeId, httpOnly: true, sameSite: "none", secure: true, path: "/" });
        }
        disable() {
          this._mutableCookies.set({ name: eS, value: "", httpOnly: true, sameSite: "none", secure: true, path: "/", expires: /* @__PURE__ */ new Date(0) });
        }
      }
      function ex(e10, t10) {
        if ("x-middleware-set-cookie" in e10.headers && "string" == typeof e10.headers["x-middleware-set-cookie"]) {
          let r10 = e10.headers["x-middleware-set-cookie"], i2 = new Headers();
          for (let e11 of (0, I.l$)(r10)) i2.append("set-cookie", e11);
          for (let e11 of new J.nV(i2).getAll()) t10.set(e11);
        }
      }
      let eT = { wrap(e10, { req: t10, res: r10, renderOpts: i2 }, s2) {
        let n2;
        function a2(e11) {
          r10 && r10.setHeader("Set-Cookie", e11);
        }
        i2 && "previewProps" in i2 && (n2 = i2.previewProps);
        let o2 = {}, l2 = { get headers() {
          return o2.headers || (o2.headers = function(e11) {
            let t11 = K.from(e11);
            for (let e12 of F) t11.delete(e12.toString().toLowerCase());
            return K.seal(t11);
          }(t10.headers)), o2.headers;
        }, get cookies() {
          if (!o2.cookies) {
            let e11 = new J.qC(K.from(t10.headers));
            ex(t10, e11), o2.cookies = er.seal(e11);
          }
          return o2.cookies;
        }, get mutableCookies() {
          if (!o2.mutableCookies) {
            let e11 = function(e12, t11) {
              let r11 = new J.qC(K.from(e12));
              return es.wrap(r11, t11);
            }(t10.headers, (null == i2 ? void 0 : i2.onUpdateCookies) || (r10 ? a2 : void 0));
            ex(t10, e11), o2.mutableCookies = e11;
          }
          return o2.mutableCookies;
        }, get draftMode() {
          return o2.draftMode || (o2.draftMode = new ek(n2, t10, this.cookies, this.mutableCookies)), o2.draftMode;
        }, reactLoadableManifest: (null == i2 ? void 0 : i2.reactLoadableManifest) || {}, assetPrefix: (null == i2 ? void 0 : i2.assetPrefix) || "" };
        return e10.run(l2, s2, l2);
      } }, eO = Z();
      function eE() {
        return { previewModeId: process.env.__NEXT_PREVIEW_MODE_ID, previewModeSigningKey: process.env.__NEXT_PREVIEW_MODE_SIGNING_KEY || "", previewModeEncryptionKey: process.env.__NEXT_PREVIEW_MODE_ENCRYPTION_KEY || "" };
      }
      class eP extends U.I {
        constructor(e10) {
          super(e10.input, e10.init), this.sourcePage = e10.page;
        }
        get request() {
          throw new A.qJ({ page: this.sourcePage });
        }
        respondWith() {
          throw new A.qJ({ page: this.sourcePage });
        }
        waitUntil() {
          throw new A.qJ({ page: this.sourcePage });
        }
      }
      let eR = { keys: (e10) => Array.from(e10.keys()), get: (e10, t10) => e10.get(t10) ?? void 0 }, eC = (e10, t10) => e_().withPropagatedContext(e10.headers, t10, eR), ej = false;
      async function eA(e10) {
        let t10, i2;
        !function() {
          if (!ej && (ej = true, "true" === process.env.NEXT_PRIVATE_TEST_PROXY)) {
            let { interceptTestApis: e11, wrapRequestHandler: t11 } = r(177);
            e11(), eC = t11(eC);
          }
        }(), await C();
        let s2 = void 0 !== self.__BUILD_MANIFEST;
        e10.request.url = e10.request.url.replace(/\.rsc($|\?)/, "$1");
        let n2 = new V.c(e10.request.url, { headers: e10.request.headers, nextConfig: e10.request.nextConfig });
        for (let e11 of [...n2.searchParams.keys()]) {
          let t11 = n2.searchParams.getAll(e11);
          (0, I.LI)(e11, (r10) => {
            for (let e12 of (n2.searchParams.delete(r10), t11)) n2.searchParams.append(r10, e12);
            n2.searchParams.delete(e11);
          });
        }
        let a2 = n2.buildId;
        n2.buildId = "";
        let o2 = e10.request.headers["x-nextjs-data"];
        o2 && "/index" === n2.pathname && (n2.pathname = "/");
        let l2 = (0, I.EK)(e10.request.headers), u2 = /* @__PURE__ */ new Map();
        if (!s2) for (let e11 of F) {
          let t11 = e11.toString().toLowerCase();
          l2.get(t11) && (u2.set(t11, l2.get(t11)), l2.delete(t11));
        }
        let c2 = new eP({ page: e10.page, input: function(e11, t11) {
          let r10 = "string" == typeof e11, i3 = r10 ? new URL(e11) : e11;
          for (let e12 of H) i3.searchParams.delete(e12);
          if (t11) for (let e12 of G) i3.searchParams.delete(e12);
          return r10 ? i3.toString() : i3;
        }(n2, true).toString(), init: { body: e10.request.body, geo: e10.request.geo, headers: l2, ip: e10.request.ip, method: e10.request.method, nextConfig: e10.request.nextConfig, signal: e10.request.signal } });
        o2 && Object.defineProperty(c2, "__isData", { enumerable: false, value: true }), !globalThis.__incrementalCacheShared && e10.IncrementalCache && (globalThis.__incrementalCache = new e10.IncrementalCache({ appDir: true, fetchCache: true, minimalMode: true, fetchCacheKeyPrefix: "", dev: false, requestHeaders: e10.request.headers, requestProtocol: "https", getPrerenderManifest: () => ({ version: -1, routes: {}, dynamicRoutes: {}, notFoundRoutes: [], preview: eE() }) }));
        let h2 = new D({ request: c2, page: e10.page });
        if ((t10 = await eC(c2, () => "/middleware" === e10.page || "/src/middleware" === e10.page ? e_().trace(g.execute, { spanName: `middleware ${c2.method} ${c2.nextUrl.pathname}`, attributes: { "http.target": c2.nextUrl.pathname, "http.method": c2.method } }, () => eT.wrap(eO, { req: c2, renderOpts: { onUpdateCookies: (e11) => {
          i2 = e11;
        }, previewProps: eE() } }, () => e10.handler(c2, h2))) : e10.handler(c2, h2))) && !(t10 instanceof Response)) throw TypeError("Expected an instance of Response to be returned");
        t10 && i2 && t10.headers.set("set-cookie", i2);
        let d2 = null == t10 ? void 0 : t10.headers.get("x-middleware-rewrite");
        if (t10 && d2 && !s2) {
          let r10 = new V.c(d2, { forceLocale: true, headers: e10.request.headers, nextConfig: e10.request.nextConfig });
          r10.host === c2.nextUrl.host && (r10.buildId = a2 || r10.buildId, t10.headers.set("x-middleware-rewrite", String(r10)));
          let i3 = B(String(r10), String(n2));
          o2 && t10.headers.set("x-nextjs-rewrite", i3);
        }
        let p2 = null == t10 ? void 0 : t10.headers.get("Location");
        if (t10 && p2 && !s2) {
          let r10 = new V.c(p2, { forceLocale: false, headers: e10.request.headers, nextConfig: e10.request.nextConfig });
          t10 = new Response(t10.body, t10), r10.host === c2.nextUrl.host && (r10.buildId = a2 || r10.buildId, t10.headers.set("Location", String(r10))), o2 && (t10.headers.delete("Location"), t10.headers.set("x-nextjs-redirect", B(String(r10), String(n2))));
        }
        let f2 = t10 || q.x.next(), m2 = f2.headers.get("x-middleware-override-headers"), v2 = [];
        if (m2) {
          for (let [e11, t11] of u2) f2.headers.set(`x-middleware-request-${e11}`, t11), v2.push(e11);
          v2.length > 0 && f2.headers.set("x-middleware-override-headers", m2 + "," + v2.join(","));
        }
        return { response: f2, waitUntil: Promise.all(h2[$]), fetchMetrics: c2.fetchMetrics };
      }
      var eI = r(322);
      function eN() {
        return "undefined" != typeof window && void 0 !== window.document;
      }
      let eL = { path: "/", sameSite: "lax", httpOnly: false, maxAge: 3456e4 }, e$ = /^(.*)[.](0|[1-9][0-9]*)$/;
      function eM(e10, t10) {
        if (e10 === t10) return true;
        let r10 = e10.match(e$);
        return !!r10 && r10[1] === t10;
      }
      function eD(e10, t10, r10) {
        let i2 = r10 ?? 3180, s2 = encodeURIComponent(t10);
        if (s2.length <= i2) return [{ name: e10, value: t10 }];
        let n2 = [];
        for (; s2.length > 0; ) {
          let e11 = s2.slice(0, i2), t11 = e11.lastIndexOf("%");
          t11 > i2 - 3 && (e11 = e11.slice(0, t11));
          let r11 = "";
          for (; e11.length > 0; ) try {
            r11 = decodeURIComponent(e11);
            break;
          } catch (t12) {
            if (t12 instanceof URIError && "%" === e11.at(-3) && e11.length > 3) e11 = e11.slice(0, e11.length - 3);
            else throw t12;
          }
          n2.push(r11), s2 = s2.slice(e11.length);
        }
        return n2.map((t11, r11) => ({ name: `${e10}.${r11}`, value: t11 }));
      }
      async function eU(e10, t10) {
        let r10 = await t10(e10);
        if (r10) return r10;
        let i2 = [];
        for (let r11 = 0; ; r11++) {
          let s2 = `${e10}.${r11}`, n2 = await t10(s2);
          if (!n2) break;
          i2.push(n2);
        }
        return i2.length > 0 ? i2.join("") : null;
      }
      let eq = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".split(""), eB = " 	\n\r=".split(""), eV = (() => {
        let e10 = Array(128);
        for (let t10 = 0; t10 < e10.length; t10 += 1) e10[t10] = -1;
        for (let t10 = 0; t10 < eB.length; t10 += 1) e10[eB[t10].charCodeAt(0)] = -2;
        for (let t10 = 0; t10 < eq.length; t10 += 1) e10[eq[t10].charCodeAt(0)] = t10;
        return e10;
      })();
      function eF(e10) {
        let t10 = [], r10 = 0, i2 = 0;
        if (function(e11, t11) {
          for (let r11 = 0; r11 < e11.length; r11 += 1) {
            let i3 = e11.charCodeAt(r11);
            if (i3 > 55295 && i3 <= 56319) {
              let t12 = (i3 - 55296) * 1024 & 65535;
              i3 = (e11.charCodeAt(r11 + 1) - 56320 & 65535 | t12) + 65536, r11 += 1;
            }
            !function(e12, t12) {
              if (e12 <= 127) {
                t12(e12);
                return;
              }
              if (e12 <= 2047) {
                t12(192 | e12 >> 6), t12(128 | 63 & e12);
                return;
              }
              if (e12 <= 65535) {
                t12(224 | e12 >> 12), t12(128 | e12 >> 6 & 63), t12(128 | 63 & e12);
                return;
              }
              if (e12 <= 1114111) {
                t12(240 | e12 >> 18), t12(128 | e12 >> 12 & 63), t12(128 | e12 >> 6 & 63), t12(128 | 63 & e12);
                return;
              }
              throw Error(`Unrecognized Unicode codepoint: ${e12.toString(16)}`);
            }(i3, t11);
          }
        }(e10, (e11) => {
          for (r10 = r10 << 8 | e11, i2 += 8; i2 >= 6; ) {
            let e12 = r10 >> i2 - 6 & 63;
            t10.push(eq[e12]), i2 -= 6;
          }
        }), i2 > 0) for (r10 <<= 6 - i2, i2 = 6; i2 >= 6; ) {
          let e11 = r10 >> i2 - 6 & 63;
          t10.push(eq[e11]), i2 -= 6;
        }
        return t10.join("");
      }
      function eH(e10) {
        let t10 = [], r10 = (e11) => {
          t10.push(String.fromCodePoint(e11));
        }, i2 = { utf8seq: 0, codepoint: 0 }, s2 = 0, n2 = 0;
        for (let t11 = 0; t11 < e10.length; t11 += 1) {
          let a2 = eV[e10.charCodeAt(t11)];
          if (a2 > -1) for (s2 = s2 << 6 | a2, n2 += 6; n2 >= 8; ) (function(e11, t12, r11) {
            if (0 === t12.utf8seq) {
              if (e11 <= 127) {
                r11(e11);
                return;
              }
              for (let r12 = 1; r12 < 6; r12 += 1) if ((e11 >> 7 - r12 & 1) == 0) {
                t12.utf8seq = r12;
                break;
              }
              if (2 === t12.utf8seq) t12.codepoint = 31 & e11;
              else if (3 === t12.utf8seq) t12.codepoint = 15 & e11;
              else if (4 === t12.utf8seq) t12.codepoint = 7 & e11;
              else throw Error("Invalid UTF-8 sequence");
              t12.utf8seq -= 1;
            } else if (t12.utf8seq > 0) {
              if (e11 <= 127) throw Error("Invalid UTF-8 sequence");
              t12.codepoint = t12.codepoint << 6 | 63 & e11, t12.utf8seq -= 1, 0 === t12.utf8seq && r11(t12.codepoint);
            }
          })(s2 >> n2 - 8 & 255, i2, r10), n2 -= 8;
          else if (-2 === a2) continue;
          else throw Error(`Invalid Base64-URL character "${e10.at(t11)}" at position ${t11}`);
        }
        return t10.join("");
      }
      let eG = "base64-";
      async function ez({ getAll: e10, setAll: t10, setItems: r10, removedItems: i2 }, s2) {
        let n2 = s2.cookieEncoding, a2 = s2.cookieOptions ?? null, o2 = await e10([...r10 ? Object.keys(r10) : [], ...i2 ? Object.keys(i2) : []]), l2 = o2?.map(({ name: e11 }) => e11) || [], u2 = Object.keys(i2).flatMap((e11) => l2.filter((t11) => eM(t11, e11))), c2 = Object.keys(r10).flatMap((e11) => {
          let t11 = new Set(l2.filter((t12) => eM(t12, e11))), i3 = r10[e11];
          "base64url" === n2 && (i3 = eG + eF(i3));
          let s3 = eD(e11, i3);
          return s3.forEach((e12) => {
            t11.delete(e12.name);
          }), u2.push(...t11), s3;
        }), h2 = { ...eL, ...a2, maxAge: 0 }, d2 = { ...eL, ...a2, maxAge: eL.maxAge };
        delete h2.name, delete d2.name, await t10([...u2.map((e11) => ({ name: e11, value: "", options: h2 })), ...c2.map(({ name: e11, value: t11 }) => ({ name: e11, value: t11, options: d2 }))]);
      }
      let eW = (e10) => {
        let t10;
        return e10 ? t10 = e10 : "undefined" == typeof fetch ? t10 = (...e11) => Promise.resolve().then(r.bind(r, 254)).then(({ default: t11 }) => t11(...e11)) : t10 = fetch, (...e11) => t10(...e11);
      };
      class eK extends Error {
        constructor(e10, t10 = "FunctionsError", r10) {
          super(e10), this.name = t10, this.context = r10;
        }
      }
      class eJ extends eK {
        constructor(e10) {
          super("Failed to send a request to the Edge Function", "FunctionsFetchError", e10);
        }
      }
      class eX extends eK {
        constructor(e10) {
          super("Relay Error invoking the Edge Function", "FunctionsRelayError", e10);
        }
      }
      class eY extends eK {
        constructor(e10) {
          super("Edge Function returned a non-2xx status code", "FunctionsHttpError", e10);
        }
      }
      !function(e10) {
        e10.Any = "any", e10.ApNortheast1 = "ap-northeast-1", e10.ApNortheast2 = "ap-northeast-2", e10.ApSouth1 = "ap-south-1", e10.ApSoutheast1 = "ap-southeast-1", e10.ApSoutheast2 = "ap-southeast-2", e10.CaCentral1 = "ca-central-1", e10.EuCentral1 = "eu-central-1", e10.EuWest1 = "eu-west-1", e10.EuWest2 = "eu-west-2", e10.EuWest3 = "eu-west-3", e10.SaEast1 = "sa-east-1", e10.UsEast1 = "us-east-1", e10.UsWest1 = "us-west-1", e10.UsWest2 = "us-west-2";
      }(m || (m = {}));
      class eQ {
        constructor(e10, { headers: t10 = {}, customFetch: r10, region: i2 = m.Any } = {}) {
          this.url = e10, this.headers = t10, this.region = i2, this.fetch = eW(r10);
        }
        setAuth(e10) {
          this.headers.Authorization = `Bearer ${e10}`;
        }
        invoke(e10, t10 = {}) {
          var r10, i2, s2, n2, a2;
          return i2 = this, s2 = void 0, n2 = void 0, a2 = function* () {
            try {
              let i3;
              let { headers: s3, method: n3, body: a3 } = t10, o2 = {}, { region: l2 } = t10;
              l2 || (l2 = this.region);
              let u2 = new URL(`${this.url}/${e10}`);
              l2 && "any" !== l2 && (o2["x-region"] = l2, u2.searchParams.set("forceFunctionRegion", l2)), a3 && (s3 && !Object.prototype.hasOwnProperty.call(s3, "Content-Type") || !s3) && ("undefined" != typeof Blob && a3 instanceof Blob || a3 instanceof ArrayBuffer ? (o2["Content-Type"] = "application/octet-stream", i3 = a3) : "string" == typeof a3 ? (o2["Content-Type"] = "text/plain", i3 = a3) : "undefined" != typeof FormData && a3 instanceof FormData ? i3 = a3 : (o2["Content-Type"] = "application/json", i3 = JSON.stringify(a3)));
              let c2 = yield this.fetch(u2.toString(), { method: n3 || "POST", headers: Object.assign(Object.assign(Object.assign({}, o2), this.headers), s3), body: i3 }).catch((e11) => {
                throw new eJ(e11);
              }), h2 = c2.headers.get("x-relay-error");
              if (h2 && "true" === h2) throw new eX(c2);
              if (!c2.ok) throw new eY(c2);
              let d2 = (null !== (r10 = c2.headers.get("Content-Type")) && void 0 !== r10 ? r10 : "text/plain").split(";")[0].trim();
              return { data: "application/json" === d2 ? yield c2.json() : "application/octet-stream" === d2 ? yield c2.blob() : "text/event-stream" === d2 ? c2 : "multipart/form-data" === d2 ? yield c2.formData() : yield c2.text(), error: null, response: c2 };
            } catch (e11) {
              return { data: null, error: e11, response: e11 instanceof eY || e11 instanceof eX ? e11.context : void 0 };
            }
          }, new (n2 || (n2 = Promise))(function(e11, t11) {
            function r11(e12) {
              try {
                l2(a2.next(e12));
              } catch (e13) {
                t11(e13);
              }
            }
            function o2(e12) {
              try {
                l2(a2.throw(e12));
              } catch (e13) {
                t11(e13);
              }
            }
            function l2(t12) {
              var i3;
              t12.done ? e11(t12.value) : ((i3 = t12.value) instanceof n2 ? i3 : new n2(function(e12) {
                e12(i3);
              })).then(r11, o2);
            }
            l2((a2 = a2.apply(i2, s2 || [])).next());
          });
        }
      }
      let { PostgrestClient: eZ, PostgrestQueryBuilder: e0, PostgrestFilterBuilder: e1, PostgrestTransformBuilder: e2, PostgrestBuilder: e3, PostgrestError: e6 } = r(690), e4 = function() {
        if ("undefined" != typeof WebSocket) return WebSocket;
        if (void 0 !== global.WebSocket) return global.WebSocket;
        if (void 0 !== window.WebSocket) return window.WebSocket;
        if (void 0 !== self.WebSocket) return self.WebSocket;
        throw Error("`WebSocket` is not supported in this environment");
      }();
      !function(e10) {
        e10[e10.connecting = 0] = "connecting", e10[e10.open = 1] = "open", e10[e10.closing = 2] = "closing", e10[e10.closed = 3] = "closed";
      }(v || (v = {})), function(e10) {
        e10.closed = "closed", e10.errored = "errored", e10.joined = "joined", e10.joining = "joining", e10.leaving = "leaving";
      }(b || (b = {})), function(e10) {
        e10.close = "phx_close", e10.error = "phx_error", e10.join = "phx_join", e10.reply = "phx_reply", e10.leave = "phx_leave", e10.access_token = "access_token";
      }(w || (w = {})), (y || (y = {})).websocket = "websocket", function(e10) {
        e10.Connecting = "connecting", e10.Open = "open", e10.Closing = "closing", e10.Closed = "closed";
      }(_ || (_ = {}));
      class e5 {
        constructor() {
          this.HEADER_LENGTH = 1;
        }
        decode(e10, t10) {
          return e10.constructor === ArrayBuffer ? t10(this._binaryDecode(e10)) : "string" == typeof e10 ? t10(JSON.parse(e10)) : t10({});
        }
        _binaryDecode(e10) {
          let t10 = new DataView(e10), r10 = new TextDecoder();
          return this._decodeBroadcast(e10, t10, r10);
        }
        _decodeBroadcast(e10, t10, r10) {
          let i2 = t10.getUint8(1), s2 = t10.getUint8(2), n2 = this.HEADER_LENGTH + 2, a2 = r10.decode(e10.slice(n2, n2 + i2));
          n2 += i2;
          let o2 = r10.decode(e10.slice(n2, n2 + s2));
          return n2 += s2, { ref: null, topic: a2, event: o2, payload: JSON.parse(r10.decode(e10.slice(n2, e10.byteLength))) };
        }
      }
      class e8 {
        constructor(e10, t10) {
          this.callback = e10, this.timerCalc = t10, this.timer = void 0, this.tries = 0, this.callback = e10, this.timerCalc = t10;
        }
        reset() {
          this.tries = 0, clearTimeout(this.timer);
        }
        scheduleTimeout() {
          clearTimeout(this.timer), this.timer = setTimeout(() => {
            this.tries = this.tries + 1, this.callback();
          }, this.timerCalc(this.tries + 1));
        }
      }
      !function(e10) {
        e10.abstime = "abstime", e10.bool = "bool", e10.date = "date", e10.daterange = "daterange", e10.float4 = "float4", e10.float8 = "float8", e10.int2 = "int2", e10.int4 = "int4", e10.int4range = "int4range", e10.int8 = "int8", e10.int8range = "int8range", e10.json = "json", e10.jsonb = "jsonb", e10.money = "money", e10.numeric = "numeric", e10.oid = "oid", e10.reltime = "reltime", e10.text = "text", e10.time = "time", e10.timestamp = "timestamp", e10.timestamptz = "timestamptz", e10.timetz = "timetz", e10.tsrange = "tsrange", e10.tstzrange = "tstzrange";
      }(S || (S = {}));
      let e9 = (e10, t10, r10 = {}) => {
        var i2;
        let s2 = null !== (i2 = r10.skipTypes) && void 0 !== i2 ? i2 : [];
        return Object.keys(t10).reduce((r11, i3) => (r11[i3] = e7(i3, e10, t10, s2), r11), {});
      }, e7 = (e10, t10, r10, i2) => {
        let s2 = t10.find((t11) => t11.name === e10), n2 = null == s2 ? void 0 : s2.type, a2 = r10[e10];
        return n2 && !i2.includes(n2) ? te(n2, a2) : tt(a2);
      }, te = (e10, t10) => {
        if ("_" === e10.charAt(0)) return tn(t10, e10.slice(1, e10.length));
        switch (e10) {
          case S.bool:
            return tr(t10);
          case S.float4:
          case S.float8:
          case S.int2:
          case S.int4:
          case S.int8:
          case S.numeric:
          case S.oid:
            return ti(t10);
          case S.json:
          case S.jsonb:
            return ts(t10);
          case S.timestamp:
            return ta(t10);
          case S.abstime:
          case S.date:
          case S.daterange:
          case S.int4range:
          case S.int8range:
          case S.money:
          case S.reltime:
          case S.text:
          case S.time:
          case S.timestamptz:
          case S.timetz:
          case S.tsrange:
          case S.tstzrange:
          default:
            return tt(t10);
        }
      }, tt = (e10) => e10, tr = (e10) => {
        switch (e10) {
          case "t":
            return true;
          case "f":
            return false;
          default:
            return e10;
        }
      }, ti = (e10) => {
        if ("string" == typeof e10) {
          let t10 = parseFloat(e10);
          if (!Number.isNaN(t10)) return t10;
        }
        return e10;
      }, ts = (e10) => {
        if ("string" == typeof e10) try {
          return JSON.parse(e10);
        } catch (e11) {
          console.log(`JSON parse error: ${e11}`);
        }
        return e10;
      }, tn = (e10, t10) => {
        if ("string" != typeof e10) return e10;
        let r10 = e10.length - 1, i2 = e10[r10];
        if ("{" === e10[0] && "}" === i2) {
          let i3;
          let s2 = e10.slice(1, r10);
          try {
            i3 = JSON.parse("[" + s2 + "]");
          } catch (e11) {
            i3 = s2 ? s2.split(",") : [];
          }
          return i3.map((e11) => te(t10, e11));
        }
        return e10;
      }, ta = (e10) => "string" == typeof e10 ? e10.replace(" ", "T") : e10, to = (e10) => {
        let t10 = e10;
        return (t10 = (t10 = t10.replace(/^ws/i, "http")).replace(/(\/socket\/websocket|\/socket|\/websocket)\/?$/i, "")).replace(/\/+$/, "");
      };
      class tl {
        constructor(e10, t10, r10 = {}, i2 = 1e4) {
          this.channel = e10, this.event = t10, this.payload = r10, this.timeout = i2, this.sent = false, this.timeoutTimer = void 0, this.ref = "", this.receivedResp = null, this.recHooks = [], this.refEvent = null;
        }
        resend(e10) {
          this.timeout = e10, this._cancelRefEvent(), this.ref = "", this.refEvent = null, this.receivedResp = null, this.sent = false, this.send();
        }
        send() {
          this._hasReceived("timeout") || (this.startTimeout(), this.sent = true, this.channel.socket.push({ topic: this.channel.topic, event: this.event, payload: this.payload, ref: this.ref, join_ref: this.channel._joinRef() }));
        }
        updatePayload(e10) {
          this.payload = Object.assign(Object.assign({}, this.payload), e10);
        }
        receive(e10, t10) {
          var r10;
          return this._hasReceived(e10) && t10(null === (r10 = this.receivedResp) || void 0 === r10 ? void 0 : r10.response), this.recHooks.push({ status: e10, callback: t10 }), this;
        }
        startTimeout() {
          this.timeoutTimer || (this.ref = this.channel.socket._makeRef(), this.refEvent = this.channel._replyEventName(this.ref), this.channel._on(this.refEvent, {}, (e10) => {
            this._cancelRefEvent(), this._cancelTimeout(), this.receivedResp = e10, this._matchReceive(e10);
          }), this.timeoutTimer = setTimeout(() => {
            this.trigger("timeout", {});
          }, this.timeout));
        }
        trigger(e10, t10) {
          this.refEvent && this.channel._trigger(this.refEvent, { status: e10, response: t10 });
        }
        destroy() {
          this._cancelRefEvent(), this._cancelTimeout();
        }
        _cancelRefEvent() {
          this.refEvent && this.channel._off(this.refEvent, {});
        }
        _cancelTimeout() {
          clearTimeout(this.timeoutTimer), this.timeoutTimer = void 0;
        }
        _matchReceive({ status: e10, response: t10 }) {
          this.recHooks.filter((t11) => t11.status === e10).forEach((e11) => e11.callback(t10));
        }
        _hasReceived(e10) {
          return this.receivedResp && this.receivedResp.status === e10;
        }
      }
      !function(e10) {
        e10.SYNC = "sync", e10.JOIN = "join", e10.LEAVE = "leave";
      }(k || (k = {}));
      class tu {
        constructor(e10, t10) {
          this.channel = e10, this.state = {}, this.pendingDiffs = [], this.joinRef = null, this.caller = { onJoin: () => {
          }, onLeave: () => {
          }, onSync: () => {
          } };
          let r10 = (null == t10 ? void 0 : t10.events) || { state: "presence_state", diff: "presence_diff" };
          this.channel._on(r10.state, {}, (e11) => {
            let { onJoin: t11, onLeave: r11, onSync: i2 } = this.caller;
            this.joinRef = this.channel._joinRef(), this.state = tu.syncState(this.state, e11, t11, r11), this.pendingDiffs.forEach((e12) => {
              this.state = tu.syncDiff(this.state, e12, t11, r11);
            }), this.pendingDiffs = [], i2();
          }), this.channel._on(r10.diff, {}, (e11) => {
            let { onJoin: t11, onLeave: r11, onSync: i2 } = this.caller;
            this.inPendingSyncState() ? this.pendingDiffs.push(e11) : (this.state = tu.syncDiff(this.state, e11, t11, r11), i2());
          }), this.onJoin((e11, t11, r11) => {
            this.channel._trigger("presence", { event: "join", key: e11, currentPresences: t11, newPresences: r11 });
          }), this.onLeave((e11, t11, r11) => {
            this.channel._trigger("presence", { event: "leave", key: e11, currentPresences: t11, leftPresences: r11 });
          }), this.onSync(() => {
            this.channel._trigger("presence", { event: "sync" });
          });
        }
        static syncState(e10, t10, r10, i2) {
          let s2 = this.cloneDeep(e10), n2 = this.transformState(t10), a2 = {}, o2 = {};
          return this.map(s2, (e11, t11) => {
            n2[e11] || (o2[e11] = t11);
          }), this.map(n2, (e11, t11) => {
            let r11 = s2[e11];
            if (r11) {
              let i3 = t11.map((e12) => e12.presence_ref), s3 = r11.map((e12) => e12.presence_ref), n3 = t11.filter((e12) => 0 > s3.indexOf(e12.presence_ref)), l2 = r11.filter((e12) => 0 > i3.indexOf(e12.presence_ref));
              n3.length > 0 && (a2[e11] = n3), l2.length > 0 && (o2[e11] = l2);
            } else a2[e11] = t11;
          }), this.syncDiff(s2, { joins: a2, leaves: o2 }, r10, i2);
        }
        static syncDiff(e10, t10, r10, i2) {
          let { joins: s2, leaves: n2 } = { joins: this.transformState(t10.joins), leaves: this.transformState(t10.leaves) };
          return r10 || (r10 = () => {
          }), i2 || (i2 = () => {
          }), this.map(s2, (t11, i3) => {
            var s3;
            let n3 = null !== (s3 = e10[t11]) && void 0 !== s3 ? s3 : [];
            if (e10[t11] = this.cloneDeep(i3), n3.length > 0) {
              let r11 = e10[t11].map((e11) => e11.presence_ref), i4 = n3.filter((e11) => 0 > r11.indexOf(e11.presence_ref));
              e10[t11].unshift(...i4);
            }
            r10(t11, n3, i3);
          }), this.map(n2, (t11, r11) => {
            let s3 = e10[t11];
            if (!s3) return;
            let n3 = r11.map((e11) => e11.presence_ref);
            s3 = s3.filter((e11) => 0 > n3.indexOf(e11.presence_ref)), e10[t11] = s3, i2(t11, s3, r11), 0 === s3.length && delete e10[t11];
          }), e10;
        }
        static map(e10, t10) {
          return Object.getOwnPropertyNames(e10).map((r10) => t10(r10, e10[r10]));
        }
        static transformState(e10) {
          return Object.getOwnPropertyNames(e10 = this.cloneDeep(e10)).reduce((t10, r10) => {
            let i2 = e10[r10];
            return "metas" in i2 ? t10[r10] = i2.metas.map((e11) => (e11.presence_ref = e11.phx_ref, delete e11.phx_ref, delete e11.phx_ref_prev, e11)) : t10[r10] = i2, t10;
          }, {});
        }
        static cloneDeep(e10) {
          return JSON.parse(JSON.stringify(e10));
        }
        onJoin(e10) {
          this.caller.onJoin = e10;
        }
        onLeave(e10) {
          this.caller.onLeave = e10;
        }
        onSync(e10) {
          this.caller.onSync = e10;
        }
        inPendingSyncState() {
          return !this.joinRef || this.joinRef !== this.channel._joinRef();
        }
      }
      !function(e10) {
        e10.ALL = "*", e10.INSERT = "INSERT", e10.UPDATE = "UPDATE", e10.DELETE = "DELETE";
      }(x || (x = {})), function(e10) {
        e10.BROADCAST = "broadcast", e10.PRESENCE = "presence", e10.POSTGRES_CHANGES = "postgres_changes", e10.SYSTEM = "system";
      }(T || (T = {})), function(e10) {
        e10.SUBSCRIBED = "SUBSCRIBED", e10.TIMED_OUT = "TIMED_OUT", e10.CLOSED = "CLOSED", e10.CHANNEL_ERROR = "CHANNEL_ERROR";
      }(O || (O = {}));
      class tc {
        constructor(e10, t10 = { config: {} }, r10) {
          this.topic = e10, this.params = t10, this.socket = r10, this.bindings = {}, this.state = b.closed, this.joinedOnce = false, this.pushBuffer = [], this.subTopic = e10.replace(/^realtime:/i, ""), this.params.config = Object.assign({ broadcast: { ack: false, self: false }, presence: { key: "" }, private: false }, t10.config), this.timeout = this.socket.timeout, this.joinPush = new tl(this, w.join, this.params, this.timeout), this.rejoinTimer = new e8(() => this._rejoinUntilConnected(), this.socket.reconnectAfterMs), this.joinPush.receive("ok", () => {
            this.state = b.joined, this.rejoinTimer.reset(), this.pushBuffer.forEach((e11) => e11.send()), this.pushBuffer = [];
          }), this._onClose(() => {
            this.rejoinTimer.reset(), this.socket.log("channel", `close ${this.topic} ${this._joinRef()}`), this.state = b.closed, this.socket._remove(this);
          }), this._onError((e11) => {
            this._isLeaving() || this._isClosed() || (this.socket.log("channel", `error ${this.topic}`, e11), this.state = b.errored, this.rejoinTimer.scheduleTimeout());
          }), this.joinPush.receive("timeout", () => {
            this._isJoining() && (this.socket.log("channel", `timeout ${this.topic}`, this.joinPush.timeout), this.state = b.errored, this.rejoinTimer.scheduleTimeout());
          }), this._on(w.reply, {}, (e11, t11) => {
            this._trigger(this._replyEventName(t11), e11);
          }), this.presence = new tu(this), this.broadcastEndpointURL = to(this.socket.endPoint) + "/api/broadcast", this.private = this.params.config.private || false;
        }
        subscribe(e10, t10 = this.timeout) {
          var r10, i2;
          if (this.socket.isConnected() || this.socket.connect(), this.state == b.closed) {
            let { config: { broadcast: s2, presence: n2, private: a2 } } = this.params;
            this._onError((t11) => null == e10 ? void 0 : e10(O.CHANNEL_ERROR, t11)), this._onClose(() => null == e10 ? void 0 : e10(O.CLOSED));
            let o2 = {}, l2 = { broadcast: s2, presence: n2, postgres_changes: null !== (i2 = null === (r10 = this.bindings.postgres_changes) || void 0 === r10 ? void 0 : r10.map((e11) => e11.filter)) && void 0 !== i2 ? i2 : [], private: a2 };
            this.socket.accessTokenValue && (o2.access_token = this.socket.accessTokenValue), this.updateJoinPayload(Object.assign({ config: l2 }, o2)), this.joinedOnce = true, this._rejoin(t10), this.joinPush.receive("ok", async ({ postgres_changes: t11 }) => {
              var r11;
              if (this.socket.setAuth(), void 0 === t11) {
                null == e10 || e10(O.SUBSCRIBED);
                return;
              }
              {
                let i3 = this.bindings.postgres_changes, s3 = null !== (r11 = null == i3 ? void 0 : i3.length) && void 0 !== r11 ? r11 : 0, n3 = [];
                for (let r12 = 0; r12 < s3; r12++) {
                  let s4 = i3[r12], { filter: { event: a3, schema: o3, table: l3, filter: u2 } } = s4, c2 = t11 && t11[r12];
                  if (c2 && c2.event === a3 && c2.schema === o3 && c2.table === l3 && c2.filter === u2) n3.push(Object.assign(Object.assign({}, s4), { id: c2.id }));
                  else {
                    this.unsubscribe(), this.state = b.errored, null == e10 || e10(O.CHANNEL_ERROR, Error("mismatch between server and client bindings for postgres changes"));
                    return;
                  }
                }
                this.bindings.postgres_changes = n3, e10 && e10(O.SUBSCRIBED);
                return;
              }
            }).receive("error", (t11) => {
              this.state = b.errored, null == e10 || e10(O.CHANNEL_ERROR, Error(JSON.stringify(Object.values(t11).join(", ") || "error")));
            }).receive("timeout", () => {
              null == e10 || e10(O.TIMED_OUT);
            });
          }
          return this;
        }
        presenceState() {
          return this.presence.state;
        }
        async track(e10, t10 = {}) {
          return await this.send({ type: "presence", event: "track", payload: e10 }, t10.timeout || this.timeout);
        }
        async untrack(e10 = {}) {
          return await this.send({ type: "presence", event: "untrack" }, e10);
        }
        on(e10, t10, r10) {
          return this._on(e10, t10, r10);
        }
        async send(e10, t10 = {}) {
          var r10, i2;
          if (this._canPush() || "broadcast" !== e10.type) return new Promise((r11) => {
            var i3, s2, n2;
            let a2 = this._push(e10.type, e10, t10.timeout || this.timeout);
            "broadcast" !== e10.type || (null === (n2 = null === (s2 = null === (i3 = this.params) || void 0 === i3 ? void 0 : i3.config) || void 0 === s2 ? void 0 : s2.broadcast) || void 0 === n2 ? void 0 : n2.ack) || r11("ok"), a2.receive("ok", () => r11("ok")), a2.receive("error", () => r11("error")), a2.receive("timeout", () => r11("timed out"));
          });
          {
            let { event: s2, payload: n2 } = e10, a2 = { method: "POST", headers: { Authorization: this.socket.accessTokenValue ? `Bearer ${this.socket.accessTokenValue}` : "", apikey: this.socket.apiKey ? this.socket.apiKey : "", "Content-Type": "application/json" }, body: JSON.stringify({ messages: [{ topic: this.subTopic, event: s2, payload: n2, private: this.private }] }) };
            try {
              let e11 = await this._fetchWithTimeout(this.broadcastEndpointURL, a2, null !== (r10 = t10.timeout) && void 0 !== r10 ? r10 : this.timeout);
              return await (null === (i2 = e11.body) || void 0 === i2 ? void 0 : i2.cancel()), e11.ok ? "ok" : "error";
            } catch (e11) {
              if ("AbortError" === e11.name) return "timed out";
              return "error";
            }
          }
        }
        updateJoinPayload(e10) {
          this.joinPush.updatePayload(e10);
        }
        unsubscribe(e10 = this.timeout) {
          this.state = b.leaving;
          let t10 = () => {
            this.socket.log("channel", `leave ${this.topic}`), this._trigger(w.close, "leave", this._joinRef());
          };
          this.joinPush.destroy();
          let r10 = null;
          return new Promise((i2) => {
            (r10 = new tl(this, w.leave, {}, e10)).receive("ok", () => {
              t10(), i2("ok");
            }).receive("timeout", () => {
              t10(), i2("timed out");
            }).receive("error", () => {
              i2("error");
            }), r10.send(), this._canPush() || r10.trigger("ok", {});
          }).finally(() => {
            null == r10 || r10.destroy();
          });
        }
        teardown() {
          this.pushBuffer.forEach((e10) => e10.destroy()), this.rejoinTimer && clearTimeout(this.rejoinTimer.timer), this.joinPush.destroy();
        }
        async _fetchWithTimeout(e10, t10, r10) {
          let i2 = new AbortController(), s2 = setTimeout(() => i2.abort(), r10), n2 = await this.socket.fetch(e10, Object.assign(Object.assign({}, t10), { signal: i2.signal }));
          return clearTimeout(s2), n2;
        }
        _push(e10, t10, r10 = this.timeout) {
          if (!this.joinedOnce) throw `tried to push '${e10}' to '${this.topic}' before joining. Use channel.subscribe() before pushing events`;
          let i2 = new tl(this, e10, t10, r10);
          return this._canPush() ? i2.send() : (i2.startTimeout(), this.pushBuffer.push(i2)), i2;
        }
        _onMessage(e10, t10, r10) {
          return t10;
        }
        _isMember(e10) {
          return this.topic === e10;
        }
        _joinRef() {
          return this.joinPush.ref;
        }
        _trigger(e10, t10, r10) {
          var i2, s2;
          let n2 = e10.toLocaleLowerCase(), { close: a2, error: o2, leave: l2, join: u2 } = w;
          if (r10 && [a2, o2, l2, u2].indexOf(n2) >= 0 && r10 !== this._joinRef()) return;
          let c2 = this._onMessage(n2, t10, r10);
          if (t10 && !c2) throw "channel onMessage callbacks must return the payload, modified or unmodified";
          ["insert", "update", "delete"].includes(n2) ? null === (i2 = this.bindings.postgres_changes) || void 0 === i2 || i2.filter((e11) => {
            var t11, r11, i3;
            return (null === (t11 = e11.filter) || void 0 === t11 ? void 0 : t11.event) === "*" || (null === (i3 = null === (r11 = e11.filter) || void 0 === r11 ? void 0 : r11.event) || void 0 === i3 ? void 0 : i3.toLocaleLowerCase()) === n2;
          }).map((e11) => e11.callback(c2, r10)) : null === (s2 = this.bindings[n2]) || void 0 === s2 || s2.filter((e11) => {
            var r11, i3, s3, a3, o3, l3;
            if (!["broadcast", "presence", "postgres_changes"].includes(n2)) return e11.type.toLocaleLowerCase() === n2;
            if ("id" in e11) {
              let n3 = e11.id, a4 = null === (r11 = e11.filter) || void 0 === r11 ? void 0 : r11.event;
              return n3 && (null === (i3 = t10.ids) || void 0 === i3 ? void 0 : i3.includes(n3)) && ("*" === a4 || (null == a4 ? void 0 : a4.toLocaleLowerCase()) === (null === (s3 = t10.data) || void 0 === s3 ? void 0 : s3.type.toLocaleLowerCase()));
            }
            {
              let r12 = null === (o3 = null === (a3 = null == e11 ? void 0 : e11.filter) || void 0 === a3 ? void 0 : a3.event) || void 0 === o3 ? void 0 : o3.toLocaleLowerCase();
              return "*" === r12 || r12 === (null === (l3 = null == t10 ? void 0 : t10.event) || void 0 === l3 ? void 0 : l3.toLocaleLowerCase());
            }
          }).map((e11) => {
            if ("object" == typeof c2 && "ids" in c2) {
              let e12 = c2.data, { schema: t11, table: r11, commit_timestamp: i3, type: s3, errors: n3 } = e12;
              c2 = Object.assign(Object.assign({}, { schema: t11, table: r11, commit_timestamp: i3, eventType: s3, new: {}, old: {}, errors: n3 }), this._getPayloadRecords(e12));
            }
            e11.callback(c2, r10);
          });
        }
        _isClosed() {
          return this.state === b.closed;
        }
        _isJoined() {
          return this.state === b.joined;
        }
        _isJoining() {
          return this.state === b.joining;
        }
        _isLeaving() {
          return this.state === b.leaving;
        }
        _replyEventName(e10) {
          return `chan_reply_${e10}`;
        }
        _on(e10, t10, r10) {
          let i2 = e10.toLocaleLowerCase(), s2 = { type: i2, filter: t10, callback: r10 };
          return this.bindings[i2] ? this.bindings[i2].push(s2) : this.bindings[i2] = [s2], this;
        }
        _off(e10, t10) {
          let r10 = e10.toLocaleLowerCase();
          return this.bindings[r10] = this.bindings[r10].filter((e11) => {
            var i2;
            return !((null === (i2 = e11.type) || void 0 === i2 ? void 0 : i2.toLocaleLowerCase()) === r10 && tc.isEqual(e11.filter, t10));
          }), this;
        }
        static isEqual(e10, t10) {
          if (Object.keys(e10).length !== Object.keys(t10).length) return false;
          for (let r10 in e10) if (e10[r10] !== t10[r10]) return false;
          return true;
        }
        _rejoinUntilConnected() {
          this.rejoinTimer.scheduleTimeout(), this.socket.isConnected() && this._rejoin();
        }
        _onClose(e10) {
          this._on(w.close, {}, e10);
        }
        _onError(e10) {
          this._on(w.error, {}, (t10) => e10(t10));
        }
        _canPush() {
          return this.socket.isConnected() && this._isJoined();
        }
        _rejoin(e10 = this.timeout) {
          this._isLeaving() || (this.socket._leaveOpenTopic(this.topic), this.state = b.joining, this.joinPush.resend(e10));
        }
        _getPayloadRecords(e10) {
          let t10 = { new: {}, old: {} };
          return ("INSERT" === e10.type || "UPDATE" === e10.type) && (t10.new = e9(e10.columns, e10.record)), ("UPDATE" === e10.type || "DELETE" === e10.type) && (t10.old = e9(e10.columns, e10.old_record)), t10;
        }
      }
      let th = () => {
      }, td = `
  addEventListener("message", (e) => {
    if (e.data.event === "start") {
      setInterval(() => postMessage({ event: "keepAlive" }), e.data.interval);
    }
  });`;
      class tp {
        constructor(e10, t10) {
          var i2;
          this.accessTokenValue = null, this.apiKey = null, this.channels = [], this.endPoint = "", this.httpEndpoint = "", this.headers = {}, this.params = {}, this.timeout = 1e4, this.heartbeatIntervalMs = 25e3, this.heartbeatTimer = void 0, this.pendingHeartbeatRef = null, this.heartbeatCallback = th, this.ref = 0, this.logger = th, this.conn = null, this.sendBuffer = [], this.serializer = new e5(), this.stateChangeCallbacks = { open: [], close: [], error: [], message: [] }, this.accessToken = null, this._resolveFetch = (e11) => {
            let t11;
            return e11 ? t11 = e11 : "undefined" == typeof fetch ? t11 = (...e12) => Promise.resolve().then(r.bind(r, 254)).then(({ default: t12 }) => t12(...e12)) : t11 = fetch, (...e12) => t11(...e12);
          }, this.endPoint = `${e10}/${y.websocket}`, this.httpEndpoint = to(e10), (null == t10 ? void 0 : t10.transport) ? this.transport = t10.transport : this.transport = null, (null == t10 ? void 0 : t10.params) && (this.params = t10.params), (null == t10 ? void 0 : t10.timeout) && (this.timeout = t10.timeout), (null == t10 ? void 0 : t10.logger) && (this.logger = t10.logger), ((null == t10 ? void 0 : t10.logLevel) || (null == t10 ? void 0 : t10.log_level)) && (this.logLevel = t10.logLevel || t10.log_level, this.params = Object.assign(Object.assign({}, this.params), { log_level: this.logLevel })), (null == t10 ? void 0 : t10.heartbeatIntervalMs) && (this.heartbeatIntervalMs = t10.heartbeatIntervalMs);
          let s2 = null === (i2 = null == t10 ? void 0 : t10.params) || void 0 === i2 ? void 0 : i2.apikey;
          if (s2 && (this.accessTokenValue = s2, this.apiKey = s2), this.reconnectAfterMs = (null == t10 ? void 0 : t10.reconnectAfterMs) ? t10.reconnectAfterMs : (e11) => [1e3, 2e3, 5e3, 1e4][e11 - 1] || 1e4, this.encode = (null == t10 ? void 0 : t10.encode) ? t10.encode : (e11, t11) => t11(JSON.stringify(e11)), this.decode = (null == t10 ? void 0 : t10.decode) ? t10.decode : this.serializer.decode.bind(this.serializer), this.reconnectTimer = new e8(async () => {
            this.disconnect(), this.connect();
          }, this.reconnectAfterMs), this.fetch = this._resolveFetch(null == t10 ? void 0 : t10.fetch), null == t10 ? void 0 : t10.worker) {
            if ("undefined" != typeof window && !window.Worker) throw Error("Web Worker is not supported");
            this.worker = (null == t10 ? void 0 : t10.worker) || false, this.workerUrl = null == t10 ? void 0 : t10.workerUrl;
          }
          this.accessToken = (null == t10 ? void 0 : t10.accessToken) || null;
        }
        connect() {
          if (!this.conn) {
            if (this.transport || (this.transport = e4), !this.transport) throw Error("No transport provided");
            this.conn = new this.transport(this.endpointURL()), this.setupConnection();
          }
        }
        endpointURL() {
          return this._appendParams(this.endPoint, Object.assign({}, this.params, { vsn: "1.0.0" }));
        }
        disconnect(e10, t10) {
          this.conn && (this.conn.onclose = function() {
          }, e10 ? this.conn.close(e10, null != t10 ? t10 : "") : this.conn.close(), this.conn = null, this.heartbeatTimer && clearInterval(this.heartbeatTimer), this.reconnectTimer.reset(), this.channels.forEach((e11) => e11.teardown()));
        }
        getChannels() {
          return this.channels;
        }
        async removeChannel(e10) {
          let t10 = await e10.unsubscribe();
          return 0 === this.channels.length && this.disconnect(), t10;
        }
        async removeAllChannels() {
          let e10 = await Promise.all(this.channels.map((e11) => e11.unsubscribe()));
          return this.channels = [], this.disconnect(), e10;
        }
        log(e10, t10, r10) {
          this.logger(e10, t10, r10);
        }
        connectionState() {
          switch (this.conn && this.conn.readyState) {
            case v.connecting:
              return _.Connecting;
            case v.open:
              return _.Open;
            case v.closing:
              return _.Closing;
            default:
              return _.Closed;
          }
        }
        isConnected() {
          return this.connectionState() === _.Open;
        }
        channel(e10, t10 = { config: {} }) {
          let r10 = `realtime:${e10}`, i2 = this.getChannels().find((e11) => e11.topic === r10);
          if (i2) return i2;
          {
            let r11 = new tc(`realtime:${e10}`, t10, this);
            return this.channels.push(r11), r11;
          }
        }
        push(e10) {
          let { topic: t10, event: r10, payload: i2, ref: s2 } = e10, n2 = () => {
            this.encode(e10, (e11) => {
              var t11;
              null === (t11 = this.conn) || void 0 === t11 || t11.send(e11);
            });
          };
          this.log("push", `${t10} ${r10} (${s2})`, i2), this.isConnected() ? n2() : this.sendBuffer.push(n2);
        }
        async setAuth(e10 = null) {
          let t10 = e10 || this.accessToken && await this.accessToken() || this.accessTokenValue;
          this.accessTokenValue != t10 && (this.accessTokenValue = t10, this.channels.forEach((e11) => {
            t10 && e11.updateJoinPayload({ access_token: t10, version: "realtime-js/2.11.15" }), e11.joinedOnce && e11._isJoined() && e11._push(w.access_token, { access_token: t10 });
          }));
        }
        async sendHeartbeat() {
          var e10;
          if (!this.isConnected()) {
            this.heartbeatCallback("disconnected");
            return;
          }
          if (this.pendingHeartbeatRef) {
            this.pendingHeartbeatRef = null, this.log("transport", "heartbeat timeout. Attempting to re-establish connection"), this.heartbeatCallback("timeout"), null === (e10 = this.conn) || void 0 === e10 || e10.close(1e3, "hearbeat timeout");
            return;
          }
          this.pendingHeartbeatRef = this._makeRef(), this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref: this.pendingHeartbeatRef }), this.heartbeatCallback("sent"), await this.setAuth();
        }
        onHeartbeat(e10) {
          this.heartbeatCallback = e10;
        }
        flushSendBuffer() {
          this.isConnected() && this.sendBuffer.length > 0 && (this.sendBuffer.forEach((e10) => e10()), this.sendBuffer = []);
        }
        _makeRef() {
          let e10 = this.ref + 1;
          return e10 === this.ref ? this.ref = 0 : this.ref = e10, this.ref.toString();
        }
        _leaveOpenTopic(e10) {
          let t10 = this.channels.find((t11) => t11.topic === e10 && (t11._isJoined() || t11._isJoining()));
          t10 && (this.log("transport", `leaving duplicate topic "${e10}"`), t10.unsubscribe());
        }
        _remove(e10) {
          this.channels = this.channels.filter((t10) => t10.topic !== e10.topic);
        }
        setupConnection() {
          this.conn && (this.conn.binaryType = "arraybuffer", this.conn.onopen = () => this._onConnOpen(), this.conn.onerror = (e10) => this._onConnError(e10), this.conn.onmessage = (e10) => this._onConnMessage(e10), this.conn.onclose = (e10) => this._onConnClose(e10));
        }
        _onConnMessage(e10) {
          this.decode(e10.data, (e11) => {
            let { topic: t10, event: r10, payload: i2, ref: s2 } = e11;
            "phoenix" === t10 && "phx_reply" === r10 && this.heartbeatCallback("ok" == e11.payload.status ? "ok" : "error"), s2 && s2 === this.pendingHeartbeatRef && (this.pendingHeartbeatRef = null), this.log("receive", `${i2.status || ""} ${t10} ${r10} ${s2 && "(" + s2 + ")" || ""}`, i2), Array.from(this.channels).filter((e12) => e12._isMember(t10)).forEach((e12) => e12._trigger(r10, i2, s2)), this.stateChangeCallbacks.message.forEach((t11) => t11(e11));
          });
        }
        _onConnOpen() {
          this.log("transport", `connected to ${this.endpointURL()}`), this.flushSendBuffer(), this.reconnectTimer.reset(), this.worker ? this.workerRef || this._startWorkerHeartbeat() : this._startHeartbeat(), this.stateChangeCallbacks.open.forEach((e10) => e10());
        }
        _startHeartbeat() {
          this.heartbeatTimer && clearInterval(this.heartbeatTimer), this.heartbeatTimer = setInterval(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
        }
        _startWorkerHeartbeat() {
          this.workerUrl ? this.log("worker", `starting worker for from ${this.workerUrl}`) : this.log("worker", "starting default worker");
          let e10 = this._workerObjectUrl(this.workerUrl);
          this.workerRef = new Worker(e10), this.workerRef.onerror = (e11) => {
            this.log("worker", "worker error", e11.message), this.workerRef.terminate();
          }, this.workerRef.onmessage = (e11) => {
            "keepAlive" === e11.data.event && this.sendHeartbeat();
          }, this.workerRef.postMessage({ event: "start", interval: this.heartbeatIntervalMs });
        }
        _onConnClose(e10) {
          this.log("transport", "close", e10), this._triggerChanError(), this.heartbeatTimer && clearInterval(this.heartbeatTimer), this.reconnectTimer.scheduleTimeout(), this.stateChangeCallbacks.close.forEach((t10) => t10(e10));
        }
        _onConnError(e10) {
          this.log("transport", `${e10}`), this._triggerChanError(), this.stateChangeCallbacks.error.forEach((t10) => t10(e10));
        }
        _triggerChanError() {
          this.channels.forEach((e10) => e10._trigger(w.error));
        }
        _appendParams(e10, t10) {
          if (0 === Object.keys(t10).length) return e10;
          let r10 = e10.match(/\?/) ? "&" : "?", i2 = new URLSearchParams(t10);
          return `${e10}${r10}${i2}`;
        }
        _workerObjectUrl(e10) {
          let t10;
          if (e10) t10 = e10;
          else {
            let e11 = new Blob([td], { type: "application/javascript" });
            t10 = URL.createObjectURL(e11);
          }
          return t10;
        }
      }
      class tf extends Error {
        constructor(e10) {
          super(e10), this.__isStorageError = true, this.name = "StorageError";
        }
      }
      function tg(e10) {
        return "object" == typeof e10 && null !== e10 && "__isStorageError" in e10;
      }
      class tm extends tf {
        constructor(e10, t10) {
          super(e10), this.name = "StorageApiError", this.status = t10;
        }
        toJSON() {
          return { name: this.name, message: this.message, status: this.status };
        }
      }
      class tv extends tf {
        constructor(e10, t10) {
          super(e10), this.name = "StorageUnknownError", this.originalError = t10;
        }
      }
      let tb = (e10) => {
        let t10;
        return e10 ? t10 = e10 : "undefined" == typeof fetch ? t10 = (...e11) => Promise.resolve().then(r.bind(r, 254)).then(({ default: t11 }) => t11(...e11)) : t10 = fetch, (...e11) => t10(...e11);
      }, tw = () => function(e10, t10, r10, i2) {
        return new (r10 || (r10 = Promise))(function(s2, n2) {
          function a2(e11) {
            try {
              l2(i2.next(e11));
            } catch (e12) {
              n2(e12);
            }
          }
          function o2(e11) {
            try {
              l2(i2.throw(e11));
            } catch (e12) {
              n2(e12);
            }
          }
          function l2(e11) {
            var t11;
            e11.done ? s2(e11.value) : ((t11 = e11.value) instanceof r10 ? t11 : new r10(function(e12) {
              e12(t11);
            })).then(a2, o2);
          }
          l2((i2 = i2.apply(e10, t10 || [])).next());
        });
      }(void 0, void 0, void 0, function* () {
        return "undefined" == typeof Response ? (yield Promise.resolve().then(r.bind(r, 254))).Response : Response;
      }), ty = (e10) => {
        if (Array.isArray(e10)) return e10.map((e11) => ty(e11));
        if ("function" == typeof e10 || e10 !== Object(e10)) return e10;
        let t10 = {};
        return Object.entries(e10).forEach(([e11, r10]) => {
          t10[e11.replace(/([-_][a-z])/gi, (e12) => e12.toUpperCase().replace(/[-_]/g, ""))] = ty(r10);
        }), t10;
      };
      var t_ = function(e10, t10, r10, i2) {
        return new (r10 || (r10 = Promise))(function(s2, n2) {
          function a2(e11) {
            try {
              l2(i2.next(e11));
            } catch (e12) {
              n2(e12);
            }
          }
          function o2(e11) {
            try {
              l2(i2.throw(e11));
            } catch (e12) {
              n2(e12);
            }
          }
          function l2(e11) {
            var t11;
            e11.done ? s2(e11.value) : ((t11 = e11.value) instanceof r10 ? t11 : new r10(function(e12) {
              e12(t11);
            })).then(a2, o2);
          }
          l2((i2 = i2.apply(e10, t10 || [])).next());
        });
      };
      let tS = (e10) => e10.msg || e10.message || e10.error_description || e10.error || JSON.stringify(e10), tk = (e10, t10, r10) => t_(void 0, void 0, void 0, function* () {
        e10 instanceof (yield tw()) && !(null == r10 ? void 0 : r10.noResolveJson) ? e10.json().then((r11) => {
          t10(new tm(tS(r11), e10.status || 500));
        }).catch((e11) => {
          t10(new tv(tS(e11), e11));
        }) : t10(new tv(tS(e10), e10));
      }), tx = (e10, t10, r10, i2) => {
        let s2 = { method: e10, headers: (null == t10 ? void 0 : t10.headers) || {} };
        return "GET" === e10 ? s2 : (s2.headers = Object.assign({ "Content-Type": "application/json" }, null == t10 ? void 0 : t10.headers), i2 && (s2.body = JSON.stringify(i2)), Object.assign(Object.assign({}, s2), r10));
      };
      function tT(e10, t10, r10, i2, s2, n2) {
        return t_(this, void 0, void 0, function* () {
          return new Promise((a2, o2) => {
            e10(r10, tx(t10, i2, s2, n2)).then((e11) => {
              if (!e11.ok) throw e11;
              return (null == i2 ? void 0 : i2.noResolveJson) ? e11 : e11.json();
            }).then((e11) => a2(e11)).catch((e11) => tk(e11, o2, i2));
          });
        });
      }
      function tO(e10, t10, r10, i2) {
        return t_(this, void 0, void 0, function* () {
          return tT(e10, "GET", t10, r10, i2);
        });
      }
      function tE(e10, t10, r10, i2, s2) {
        return t_(this, void 0, void 0, function* () {
          return tT(e10, "POST", t10, i2, s2, r10);
        });
      }
      function tP(e10, t10, r10, i2, s2) {
        return t_(this, void 0, void 0, function* () {
          return tT(e10, "DELETE", t10, i2, s2, r10);
        });
      }
      var tR = r(195).Buffer, tC = function(e10, t10, r10, i2) {
        return new (r10 || (r10 = Promise))(function(s2, n2) {
          function a2(e11) {
            try {
              l2(i2.next(e11));
            } catch (e12) {
              n2(e12);
            }
          }
          function o2(e11) {
            try {
              l2(i2.throw(e11));
            } catch (e12) {
              n2(e12);
            }
          }
          function l2(e11) {
            var t11;
            e11.done ? s2(e11.value) : ((t11 = e11.value) instanceof r10 ? t11 : new r10(function(e12) {
              e12(t11);
            })).then(a2, o2);
          }
          l2((i2 = i2.apply(e10, t10 || [])).next());
        });
      };
      let tj = { limit: 100, offset: 0, sortBy: { column: "name", order: "asc" } }, tA = { cacheControl: "3600", contentType: "text/plain;charset=UTF-8", upsert: false };
      class tI {
        constructor(e10, t10 = {}, r10, i2) {
          this.url = e10, this.headers = t10, this.bucketId = r10, this.fetch = tb(i2);
        }
        uploadOrUpdate(e10, t10, r10, i2) {
          return tC(this, void 0, void 0, function* () {
            try {
              let s2;
              let n2 = Object.assign(Object.assign({}, tA), i2), a2 = Object.assign(Object.assign({}, this.headers), "POST" === e10 && { "x-upsert": String(n2.upsert) }), o2 = n2.metadata;
              "undefined" != typeof Blob && r10 instanceof Blob ? ((s2 = new FormData()).append("cacheControl", n2.cacheControl), o2 && s2.append("metadata", this.encodeMetadata(o2)), s2.append("", r10)) : "undefined" != typeof FormData && r10 instanceof FormData ? ((s2 = r10).append("cacheControl", n2.cacheControl), o2 && s2.append("metadata", this.encodeMetadata(o2))) : (s2 = r10, a2["cache-control"] = `max-age=${n2.cacheControl}`, a2["content-type"] = n2.contentType, o2 && (a2["x-metadata"] = this.toBase64(this.encodeMetadata(o2)))), (null == i2 ? void 0 : i2.headers) && (a2 = Object.assign(Object.assign({}, a2), i2.headers));
              let l2 = this._removeEmptyFolders(t10), u2 = this._getFinalPath(l2), c2 = yield this.fetch(`${this.url}/object/${u2}`, Object.assign({ method: e10, body: s2, headers: a2 }, (null == n2 ? void 0 : n2.duplex) ? { duplex: n2.duplex } : {})), h2 = yield c2.json();
              if (c2.ok) return { data: { path: l2, id: h2.Id, fullPath: h2.Key }, error: null };
              return { data: null, error: h2 };
            } catch (e11) {
              if (tg(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        upload(e10, t10, r10) {
          return tC(this, void 0, void 0, function* () {
            return this.uploadOrUpdate("POST", e10, t10, r10);
          });
        }
        uploadToSignedUrl(e10, t10, r10, i2) {
          return tC(this, void 0, void 0, function* () {
            let s2 = this._removeEmptyFolders(e10), n2 = this._getFinalPath(s2), a2 = new URL(this.url + `/object/upload/sign/${n2}`);
            a2.searchParams.set("token", t10);
            try {
              let e11;
              let t11 = Object.assign({ upsert: tA.upsert }, i2), n3 = Object.assign(Object.assign({}, this.headers), { "x-upsert": String(t11.upsert) });
              "undefined" != typeof Blob && r10 instanceof Blob ? ((e11 = new FormData()).append("cacheControl", t11.cacheControl), e11.append("", r10)) : "undefined" != typeof FormData && r10 instanceof FormData ? (e11 = r10).append("cacheControl", t11.cacheControl) : (e11 = r10, n3["cache-control"] = `max-age=${t11.cacheControl}`, n3["content-type"] = t11.contentType);
              let o2 = yield this.fetch(a2.toString(), { method: "PUT", body: e11, headers: n3 }), l2 = yield o2.json();
              if (o2.ok) return { data: { path: s2, fullPath: l2.Key }, error: null };
              return { data: null, error: l2 };
            } catch (e11) {
              if (tg(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        createSignedUploadUrl(e10, t10) {
          return tC(this, void 0, void 0, function* () {
            try {
              let r10 = this._getFinalPath(e10), i2 = Object.assign({}, this.headers);
              (null == t10 ? void 0 : t10.upsert) && (i2["x-upsert"] = "true");
              let s2 = yield tE(this.fetch, `${this.url}/object/upload/sign/${r10}`, {}, { headers: i2 }), n2 = new URL(this.url + s2.url), a2 = n2.searchParams.get("token");
              if (!a2) throw new tf("No token returned by API");
              return { data: { signedUrl: n2.toString(), path: e10, token: a2 }, error: null };
            } catch (e11) {
              if (tg(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        update(e10, t10, r10) {
          return tC(this, void 0, void 0, function* () {
            return this.uploadOrUpdate("PUT", e10, t10, r10);
          });
        }
        move(e10, t10, r10) {
          return tC(this, void 0, void 0, function* () {
            try {
              return { data: yield tE(this.fetch, `${this.url}/object/move`, { bucketId: this.bucketId, sourceKey: e10, destinationKey: t10, destinationBucket: null == r10 ? void 0 : r10.destinationBucket }, { headers: this.headers }), error: null };
            } catch (e11) {
              if (tg(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        copy(e10, t10, r10) {
          return tC(this, void 0, void 0, function* () {
            try {
              return { data: { path: (yield tE(this.fetch, `${this.url}/object/copy`, { bucketId: this.bucketId, sourceKey: e10, destinationKey: t10, destinationBucket: null == r10 ? void 0 : r10.destinationBucket }, { headers: this.headers })).Key }, error: null };
            } catch (e11) {
              if (tg(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        createSignedUrl(e10, t10, r10) {
          return tC(this, void 0, void 0, function* () {
            try {
              let i2 = this._getFinalPath(e10), s2 = yield tE(this.fetch, `${this.url}/object/sign/${i2}`, Object.assign({ expiresIn: t10 }, (null == r10 ? void 0 : r10.transform) ? { transform: r10.transform } : {}), { headers: this.headers }), n2 = (null == r10 ? void 0 : r10.download) ? `&download=${true === r10.download ? "" : r10.download}` : "";
              return { data: s2 = { signedUrl: encodeURI(`${this.url}${s2.signedURL}${n2}`) }, error: null };
            } catch (e11) {
              if (tg(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        createSignedUrls(e10, t10, r10) {
          return tC(this, void 0, void 0, function* () {
            try {
              let i2 = yield tE(this.fetch, `${this.url}/object/sign/${this.bucketId}`, { expiresIn: t10, paths: e10 }, { headers: this.headers }), s2 = (null == r10 ? void 0 : r10.download) ? `&download=${true === r10.download ? "" : r10.download}` : "";
              return { data: i2.map((e11) => Object.assign(Object.assign({}, e11), { signedUrl: e11.signedURL ? encodeURI(`${this.url}${e11.signedURL}${s2}`) : null })), error: null };
            } catch (e11) {
              if (tg(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        download(e10, t10) {
          return tC(this, void 0, void 0, function* () {
            let r10 = void 0 !== (null == t10 ? void 0 : t10.transform), i2 = this.transformOptsToQueryString((null == t10 ? void 0 : t10.transform) || {}), s2 = i2 ? `?${i2}` : "";
            try {
              let t11 = this._getFinalPath(e10), i3 = yield tO(this.fetch, `${this.url}/${r10 ? "render/image/authenticated" : "object"}/${t11}${s2}`, { headers: this.headers, noResolveJson: true });
              return { data: yield i3.blob(), error: null };
            } catch (e11) {
              if (tg(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        info(e10) {
          return tC(this, void 0, void 0, function* () {
            let t10 = this._getFinalPath(e10);
            try {
              let e11 = yield tO(this.fetch, `${this.url}/object/info/${t10}`, { headers: this.headers });
              return { data: ty(e11), error: null };
            } catch (e11) {
              if (tg(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        exists(e10) {
          return tC(this, void 0, void 0, function* () {
            let t10 = this._getFinalPath(e10);
            try {
              return yield function(e11, t11, r10, i2) {
                return t_(this, void 0, void 0, function* () {
                  return tT(e11, "HEAD", t11, Object.assign(Object.assign({}, r10), { noResolveJson: true }), void 0);
                });
              }(this.fetch, `${this.url}/object/${t10}`, { headers: this.headers }), { data: true, error: null };
            } catch (e11) {
              if (tg(e11) && e11 instanceof tv) {
                let t11 = e11.originalError;
                if ([400, 404].includes(null == t11 ? void 0 : t11.status)) return { data: false, error: e11 };
              }
              throw e11;
            }
          });
        }
        getPublicUrl(e10, t10) {
          let r10 = this._getFinalPath(e10), i2 = [], s2 = (null == t10 ? void 0 : t10.download) ? `download=${true === t10.download ? "" : t10.download}` : "";
          "" !== s2 && i2.push(s2);
          let n2 = void 0 !== (null == t10 ? void 0 : t10.transform), a2 = this.transformOptsToQueryString((null == t10 ? void 0 : t10.transform) || {});
          "" !== a2 && i2.push(a2);
          let o2 = i2.join("&");
          return "" !== o2 && (o2 = `?${o2}`), { data: { publicUrl: encodeURI(`${this.url}/${n2 ? "render/image" : "object"}/public/${r10}${o2}`) } };
        }
        remove(e10) {
          return tC(this, void 0, void 0, function* () {
            try {
              return { data: yield tP(this.fetch, `${this.url}/object/${this.bucketId}`, { prefixes: e10 }, { headers: this.headers }), error: null };
            } catch (e11) {
              if (tg(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        list(e10, t10, r10) {
          return tC(this, void 0, void 0, function* () {
            try {
              let i2 = Object.assign(Object.assign(Object.assign({}, tj), t10), { prefix: e10 || "" });
              return { data: yield tE(this.fetch, `${this.url}/object/list/${this.bucketId}`, i2, { headers: this.headers }, r10), error: null };
            } catch (e11) {
              if (tg(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        encodeMetadata(e10) {
          return JSON.stringify(e10);
        }
        toBase64(e10) {
          return void 0 !== tR ? tR.from(e10).toString("base64") : btoa(e10);
        }
        _getFinalPath(e10) {
          return `${this.bucketId}/${e10}`;
        }
        _removeEmptyFolders(e10) {
          return e10.replace(/^\/|\/$/g, "").replace(/\/+/g, "/");
        }
        transformOptsToQueryString(e10) {
          let t10 = [];
          return e10.width && t10.push(`width=${e10.width}`), e10.height && t10.push(`height=${e10.height}`), e10.resize && t10.push(`resize=${e10.resize}`), e10.format && t10.push(`format=${e10.format}`), e10.quality && t10.push(`quality=${e10.quality}`), t10.join("&");
        }
      }
      let tN = { "X-Client-Info": "storage-js/2.7.1" };
      var tL = function(e10, t10, r10, i2) {
        return new (r10 || (r10 = Promise))(function(s2, n2) {
          function a2(e11) {
            try {
              l2(i2.next(e11));
            } catch (e12) {
              n2(e12);
            }
          }
          function o2(e11) {
            try {
              l2(i2.throw(e11));
            } catch (e12) {
              n2(e12);
            }
          }
          function l2(e11) {
            var t11;
            e11.done ? s2(e11.value) : ((t11 = e11.value) instanceof r10 ? t11 : new r10(function(e12) {
              e12(t11);
            })).then(a2, o2);
          }
          l2((i2 = i2.apply(e10, t10 || [])).next());
        });
      };
      class t$ {
        constructor(e10, t10 = {}, r10) {
          this.url = e10, this.headers = Object.assign(Object.assign({}, tN), t10), this.fetch = tb(r10);
        }
        listBuckets() {
          return tL(this, void 0, void 0, function* () {
            try {
              return { data: yield tO(this.fetch, `${this.url}/bucket`, { headers: this.headers }), error: null };
            } catch (e10) {
              if (tg(e10)) return { data: null, error: e10 };
              throw e10;
            }
          });
        }
        getBucket(e10) {
          return tL(this, void 0, void 0, function* () {
            try {
              return { data: yield tO(this.fetch, `${this.url}/bucket/${e10}`, { headers: this.headers }), error: null };
            } catch (e11) {
              if (tg(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        createBucket(e10, t10 = { public: false }) {
          return tL(this, void 0, void 0, function* () {
            try {
              return { data: yield tE(this.fetch, `${this.url}/bucket`, { id: e10, name: e10, public: t10.public, file_size_limit: t10.fileSizeLimit, allowed_mime_types: t10.allowedMimeTypes }, { headers: this.headers }), error: null };
            } catch (e11) {
              if (tg(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        updateBucket(e10, t10) {
          return tL(this, void 0, void 0, function* () {
            try {
              return { data: yield function(e11, t11, r10, i2, s2) {
                return t_(this, void 0, void 0, function* () {
                  return tT(e11, "PUT", t11, i2, void 0, r10);
                });
              }(this.fetch, `${this.url}/bucket/${e10}`, { id: e10, name: e10, public: t10.public, file_size_limit: t10.fileSizeLimit, allowed_mime_types: t10.allowedMimeTypes }, { headers: this.headers }), error: null };
            } catch (e11) {
              if (tg(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        emptyBucket(e10) {
          return tL(this, void 0, void 0, function* () {
            try {
              return { data: yield tE(this.fetch, `${this.url}/bucket/${e10}/empty`, {}, { headers: this.headers }), error: null };
            } catch (e11) {
              if (tg(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        deleteBucket(e10) {
          return tL(this, void 0, void 0, function* () {
            try {
              return { data: yield tP(this.fetch, `${this.url}/bucket/${e10}`, {}, { headers: this.headers }), error: null };
            } catch (e11) {
              if (tg(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
      }
      class tM extends t$ {
        constructor(e10, t10 = {}, r10) {
          super(e10, t10, r10);
        }
        from(e10) {
          return new tI(this.url, this.headers, e10, this.fetch);
        }
      }
      let tD = "";
      "undefined" != typeof Deno ? tD = "deno" : "undefined" != typeof document ? tD = "web" : "undefined" != typeof navigator && "ReactNative" === navigator.product ? tD = "react-native" : tD = "node";
      let tU = { headers: { "X-Client-Info": `supabase-js-${tD}/2.50.4` } }, tq = { schema: "public" }, tB = { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true, flowType: "implicit" }, tV = {};
      var tF = r(254);
      let tH = (e10) => {
        let t10;
        return e10 ? t10 = e10 : "undefined" == typeof fetch ? t10 = tF.default : t10 = fetch, (...e11) => t10(...e11);
      }, tG = () => "undefined" == typeof Headers ? tF.Headers : Headers, tz = (e10, t10, r10) => {
        let i2 = tH(r10), s2 = tG();
        return (r11, n2) => function(e11, t11, r12, i3) {
          return new (r12 || (r12 = Promise))(function(s3, n3) {
            function a2(e12) {
              try {
                l2(i3.next(e12));
              } catch (e13) {
                n3(e13);
              }
            }
            function o2(e12) {
              try {
                l2(i3.throw(e12));
              } catch (e13) {
                n3(e13);
              }
            }
            function l2(e12) {
              var t12;
              e12.done ? s3(e12.value) : ((t12 = e12.value) instanceof r12 ? t12 : new r12(function(e13) {
                e13(t12);
              })).then(a2, o2);
            }
            l2((i3 = i3.apply(e11, t11 || [])).next());
          });
        }(void 0, void 0, void 0, function* () {
          var a2;
          let o2 = null !== (a2 = yield t10()) && void 0 !== a2 ? a2 : e10, l2 = new s2(null == n2 ? void 0 : n2.headers);
          return l2.has("apikey") || l2.set("apikey", e10), l2.has("Authorization") || l2.set("Authorization", `Bearer ${o2}`), i2(r11, Object.assign(Object.assign({}, n2), { headers: l2 }));
        });
      }, tW = "2.70.0", tK = { "X-Client-Info": `gotrue-js/${tW}` }, tJ = "X-Supabase-Api-Version", tX = { "2024-01-01": { timestamp: Date.parse("2024-01-01T00:00:00.0Z"), name: "2024-01-01" } }, tY = /^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}$|[a-z0-9_-]{2}$)$/i;
      class tQ extends Error {
        constructor(e10, t10, r10) {
          super(e10), this.__isAuthError = true, this.name = "AuthError", this.status = t10, this.code = r10;
        }
      }
      function tZ(e10) {
        return "object" == typeof e10 && null !== e10 && "__isAuthError" in e10;
      }
      class t0 extends tQ {
        constructor(e10, t10, r10) {
          super(e10, t10, r10), this.name = "AuthApiError", this.status = t10, this.code = r10;
        }
      }
      class t1 extends tQ {
        constructor(e10, t10) {
          super(e10), this.name = "AuthUnknownError", this.originalError = t10;
        }
      }
      class t2 extends tQ {
        constructor(e10, t10, r10, i2) {
          super(e10, r10, i2), this.name = t10, this.status = r10;
        }
      }
      class t3 extends t2 {
        constructor() {
          super("Auth session missing!", "AuthSessionMissingError", 400, void 0);
        }
      }
      class t6 extends t2 {
        constructor() {
          super("Auth session or user missing", "AuthInvalidTokenResponseError", 500, void 0);
        }
      }
      class t4 extends t2 {
        constructor(e10) {
          super(e10, "AuthInvalidCredentialsError", 400, void 0);
        }
      }
      class t5 extends t2 {
        constructor(e10, t10 = null) {
          super(e10, "AuthImplicitGrantRedirectError", 500, void 0), this.details = null, this.details = t10;
        }
        toJSON() {
          return { name: this.name, message: this.message, status: this.status, details: this.details };
        }
      }
      class t8 extends t2 {
        constructor(e10, t10 = null) {
          super(e10, "AuthPKCEGrantCodeExchangeError", 500, void 0), this.details = null, this.details = t10;
        }
        toJSON() {
          return { name: this.name, message: this.message, status: this.status, details: this.details };
        }
      }
      class t9 extends t2 {
        constructor(e10, t10) {
          super(e10, "AuthRetryableFetchError", t10, void 0);
        }
      }
      function t7(e10) {
        return tZ(e10) && "AuthRetryableFetchError" === e10.name;
      }
      class re extends t2 {
        constructor(e10, t10, r10) {
          super(e10, "AuthWeakPasswordError", t10, "weak_password"), this.reasons = r10;
        }
      }
      class rt extends t2 {
        constructor(e10) {
          super(e10, "AuthInvalidJwtError", 400, "invalid_jwt");
        }
      }
      let rr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".split(""), ri = " 	\n\r=".split(""), rs = (() => {
        let e10 = Array(128);
        for (let t10 = 0; t10 < e10.length; t10 += 1) e10[t10] = -1;
        for (let t10 = 0; t10 < ri.length; t10 += 1) e10[ri[t10].charCodeAt(0)] = -2;
        for (let t10 = 0; t10 < rr.length; t10 += 1) e10[rr[t10].charCodeAt(0)] = t10;
        return e10;
      })();
      function rn(e10, t10, r10) {
        if (null !== e10) for (t10.queue = t10.queue << 8 | e10, t10.queuedBits += 8; t10.queuedBits >= 6; ) r10(rr[t10.queue >> t10.queuedBits - 6 & 63]), t10.queuedBits -= 6;
        else if (t10.queuedBits > 0) for (t10.queue = t10.queue << 6 - t10.queuedBits, t10.queuedBits = 6; t10.queuedBits >= 6; ) r10(rr[t10.queue >> t10.queuedBits - 6 & 63]), t10.queuedBits -= 6;
      }
      function ra(e10, t10, r10) {
        let i2 = rs[e10];
        if (i2 > -1) for (t10.queue = t10.queue << 6 | i2, t10.queuedBits += 6; t10.queuedBits >= 8; ) r10(t10.queue >> t10.queuedBits - 8 & 255), t10.queuedBits -= 8;
        else if (-2 === i2) return;
        else throw Error(`Invalid Base64-URL character "${String.fromCharCode(e10)}"`);
      }
      function ro(e10) {
        let t10 = [], r10 = (e11) => {
          t10.push(String.fromCodePoint(e11));
        }, i2 = { utf8seq: 0, codepoint: 0 }, s2 = { queue: 0, queuedBits: 0 }, n2 = (e11) => {
          !function(e12, t11, r11) {
            if (0 === t11.utf8seq) {
              if (e12 <= 127) {
                r11(e12);
                return;
              }
              for (let r12 = 1; r12 < 6; r12 += 1) if ((e12 >> 7 - r12 & 1) == 0) {
                t11.utf8seq = r12;
                break;
              }
              if (2 === t11.utf8seq) t11.codepoint = 31 & e12;
              else if (3 === t11.utf8seq) t11.codepoint = 15 & e12;
              else if (4 === t11.utf8seq) t11.codepoint = 7 & e12;
              else throw Error("Invalid UTF-8 sequence");
              t11.utf8seq -= 1;
            } else if (t11.utf8seq > 0) {
              if (e12 <= 127) throw Error("Invalid UTF-8 sequence");
              t11.codepoint = t11.codepoint << 6 | 63 & e12, t11.utf8seq -= 1, 0 === t11.utf8seq && r11(t11.codepoint);
            }
          }(e11, i2, r10);
        };
        for (let t11 = 0; t11 < e10.length; t11 += 1) ra(e10.charCodeAt(t11), s2, n2);
        return t10.join("");
      }
      let rl = () => "undefined" != typeof window && "undefined" != typeof document, ru = { tested: false, writable: false }, rc = () => {
        if (!rl()) return false;
        try {
          if ("object" != typeof globalThis.localStorage) return false;
        } catch (e11) {
          return false;
        }
        if (ru.tested) return ru.writable;
        let e10 = `lswt-${Math.random()}${Math.random()}`;
        try {
          globalThis.localStorage.setItem(e10, e10), globalThis.localStorage.removeItem(e10), ru.tested = true, ru.writable = true;
        } catch (e11) {
          ru.tested = true, ru.writable = false;
        }
        return ru.writable;
      }, rh = (e10) => {
        let t10;
        return e10 ? t10 = e10 : "undefined" == typeof fetch ? t10 = (...e11) => Promise.resolve().then(r.bind(r, 254)).then(({ default: t11 }) => t11(...e11)) : t10 = fetch, (...e11) => t10(...e11);
      }, rd = (e10) => "object" == typeof e10 && null !== e10 && "status" in e10 && "ok" in e10 && "json" in e10 && "function" == typeof e10.json, rp = async (e10, t10, r10) => {
        await e10.setItem(t10, JSON.stringify(r10));
      }, rf = async (e10, t10) => {
        let r10 = await e10.getItem(t10);
        if (!r10) return null;
        try {
          return JSON.parse(r10);
        } catch (e11) {
          return r10;
        }
      }, rg = async (e10, t10) => {
        await e10.removeItem(t10);
      };
      class rm {
        constructor() {
          this.promise = new rm.promiseConstructor((e10, t10) => {
            this.resolve = e10, this.reject = t10;
          });
        }
      }
      function rv(e10) {
        let t10 = e10.split(".");
        if (3 !== t10.length) throw new rt("Invalid JWT structure");
        for (let e11 = 0; e11 < t10.length; e11++) if (!tY.test(t10[e11])) throw new rt("JWT not in base64url format");
        return { header: JSON.parse(ro(t10[0])), payload: JSON.parse(ro(t10[1])), signature: function(e11) {
          let t11 = [], r10 = { queue: 0, queuedBits: 0 }, i2 = (e12) => {
            t11.push(e12);
          };
          for (let t12 = 0; t12 < e11.length; t12 += 1) ra(e11.charCodeAt(t12), r10, i2);
          return new Uint8Array(t11);
        }(t10[2]), raw: { header: t10[0], payload: t10[1] } };
      }
      async function rb(e10) {
        return await new Promise((t10) => {
          setTimeout(() => t10(null), e10);
        });
      }
      function rw(e10) {
        return ("0" + e10.toString(16)).substr(-2);
      }
      async function ry(e10) {
        let t10 = new TextEncoder().encode(e10);
        return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", t10))).map((e11) => String.fromCharCode(e11)).join("");
      }
      async function r_(e10) {
        return "undefined" != typeof crypto && void 0 !== crypto.subtle && "undefined" != typeof TextEncoder ? btoa(await ry(e10)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") : (console.warn("WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256."), e10);
      }
      async function rS(e10, t10, r10 = false) {
        let i2 = function() {
          let e11 = new Uint32Array(56);
          if ("undefined" == typeof crypto) {
            let e12 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~", t11 = e12.length, r11 = "";
            for (let i3 = 0; i3 < 56; i3++) r11 += e12.charAt(Math.floor(Math.random() * t11));
            return r11;
          }
          return crypto.getRandomValues(e11), Array.from(e11, rw).join("");
        }(), s2 = i2;
        r10 && (s2 += "/PASSWORD_RECOVERY"), await rp(e10, `${t10}-code-verifier`, s2);
        let n2 = await r_(i2), a2 = i2 === n2 ? "plain" : "s256";
        return [n2, a2];
      }
      rm.promiseConstructor = Promise;
      let rk = /^2[0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/i, rx = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
      function rT(e10) {
        if (!rx.test(e10)) throw Error("@supabase/auth-js: Expected parameter to be UUID but is not");
      }
      var rO = function(e10, t10) {
        var r10 = {};
        for (var i2 in e10) Object.prototype.hasOwnProperty.call(e10, i2) && 0 > t10.indexOf(i2) && (r10[i2] = e10[i2]);
        if (null != e10 && "function" == typeof Object.getOwnPropertySymbols) for (var s2 = 0, i2 = Object.getOwnPropertySymbols(e10); s2 < i2.length; s2++) 0 > t10.indexOf(i2[s2]) && Object.prototype.propertyIsEnumerable.call(e10, i2[s2]) && (r10[i2[s2]] = e10[i2[s2]]);
        return r10;
      };
      let rE = (e10) => e10.msg || e10.message || e10.error_description || e10.error || JSON.stringify(e10), rP = [502, 503, 504];
      async function rR(e10) {
        var t10;
        let r10, i2;
        if (!rd(e10)) throw new t9(rE(e10), 0);
        if (rP.includes(e10.status)) throw new t9(rE(e10), e10.status);
        try {
          r10 = await e10.json();
        } catch (e11) {
          throw new t1(rE(e11), e11);
        }
        let s2 = function(e11) {
          let t11 = e11.headers.get(tJ);
          if (!t11 || !t11.match(rk)) return null;
          try {
            return /* @__PURE__ */ new Date(`${t11}T00:00:00.0Z`);
          } catch (e12) {
            return null;
          }
        }(e10);
        if (s2 && s2.getTime() >= tX["2024-01-01"].timestamp && "object" == typeof r10 && r10 && "string" == typeof r10.code ? i2 = r10.code : "object" == typeof r10 && r10 && "string" == typeof r10.error_code && (i2 = r10.error_code), i2) {
          if ("weak_password" === i2) throw new re(rE(r10), e10.status, (null === (t10 = r10.weak_password) || void 0 === t10 ? void 0 : t10.reasons) || []);
          if ("session_not_found" === i2) throw new t3();
        } else if ("object" == typeof r10 && r10 && "object" == typeof r10.weak_password && r10.weak_password && Array.isArray(r10.weak_password.reasons) && r10.weak_password.reasons.length && r10.weak_password.reasons.reduce((e11, t11) => e11 && "string" == typeof t11, true)) throw new re(rE(r10), e10.status, r10.weak_password.reasons);
        throw new t0(rE(r10), e10.status || 500, i2);
      }
      let rC = (e10, t10, r10, i2) => {
        let s2 = { method: e10, headers: (null == t10 ? void 0 : t10.headers) || {} };
        return "GET" === e10 ? s2 : (s2.headers = Object.assign({ "Content-Type": "application/json;charset=UTF-8" }, null == t10 ? void 0 : t10.headers), s2.body = JSON.stringify(i2), Object.assign(Object.assign({}, s2), r10));
      };
      async function rj(e10, t10, r10, i2) {
        var s2;
        let n2 = Object.assign({}, null == i2 ? void 0 : i2.headers);
        n2[tJ] || (n2[tJ] = tX["2024-01-01"].name), (null == i2 ? void 0 : i2.jwt) && (n2.Authorization = `Bearer ${i2.jwt}`);
        let a2 = null !== (s2 = null == i2 ? void 0 : i2.query) && void 0 !== s2 ? s2 : {};
        (null == i2 ? void 0 : i2.redirectTo) && (a2.redirect_to = i2.redirectTo);
        let o2 = Object.keys(a2).length ? "?" + new URLSearchParams(a2).toString() : "", l2 = await rA(e10, t10, r10 + o2, { headers: n2, noResolveJson: null == i2 ? void 0 : i2.noResolveJson }, {}, null == i2 ? void 0 : i2.body);
        return (null == i2 ? void 0 : i2.xform) ? null == i2 ? void 0 : i2.xform(l2) : { data: Object.assign({}, l2), error: null };
      }
      async function rA(e10, t10, r10, i2, s2, n2) {
        let a2;
        let o2 = rC(t10, i2, s2, n2);
        try {
          a2 = await e10(r10, Object.assign({}, o2));
        } catch (e11) {
          throw console.error(e11), new t9(rE(e11), 0);
        }
        if (a2.ok || await rR(a2), null == i2 ? void 0 : i2.noResolveJson) return a2;
        try {
          return await a2.json();
        } catch (e11) {
          await rR(e11);
        }
      }
      function rI(e10) {
        var t10, r10;
        let i2 = null;
        return e10.access_token && e10.refresh_token && e10.expires_in && (i2 = Object.assign({}, e10), !e10.expires_at) && (i2.expires_at = (r10 = e10.expires_in, Math.round(Date.now() / 1e3) + r10)), { data: { session: i2, user: null !== (t10 = e10.user) && void 0 !== t10 ? t10 : e10 }, error: null };
      }
      function rN(e10) {
        let t10 = rI(e10);
        return !t10.error && e10.weak_password && "object" == typeof e10.weak_password && Array.isArray(e10.weak_password.reasons) && e10.weak_password.reasons.length && e10.weak_password.message && "string" == typeof e10.weak_password.message && e10.weak_password.reasons.reduce((e11, t11) => e11 && "string" == typeof t11, true) && (t10.data.weak_password = e10.weak_password), t10;
      }
      function rL(e10) {
        var t10;
        return { data: { user: null !== (t10 = e10.user) && void 0 !== t10 ? t10 : e10 }, error: null };
      }
      function r$(e10) {
        return { data: e10, error: null };
      }
      function rM(e10) {
        let { action_link: t10, email_otp: r10, hashed_token: i2, redirect_to: s2, verification_type: n2 } = e10;
        return { data: { properties: { action_link: t10, email_otp: r10, hashed_token: i2, redirect_to: s2, verification_type: n2 }, user: Object.assign({}, rO(e10, ["action_link", "email_otp", "hashed_token", "redirect_to", "verification_type"])) }, error: null };
      }
      function rD(e10) {
        return e10;
      }
      let rU = ["global", "local", "others"];
      var rq = function(e10, t10) {
        var r10 = {};
        for (var i2 in e10) Object.prototype.hasOwnProperty.call(e10, i2) && 0 > t10.indexOf(i2) && (r10[i2] = e10[i2]);
        if (null != e10 && "function" == typeof Object.getOwnPropertySymbols) for (var s2 = 0, i2 = Object.getOwnPropertySymbols(e10); s2 < i2.length; s2++) 0 > t10.indexOf(i2[s2]) && Object.prototype.propertyIsEnumerable.call(e10, i2[s2]) && (r10[i2[s2]] = e10[i2[s2]]);
        return r10;
      };
      class rB {
        constructor({ url: e10 = "", headers: t10 = {}, fetch: r10 }) {
          this.url = e10, this.headers = t10, this.fetch = rh(r10), this.mfa = { listFactors: this._listFactors.bind(this), deleteFactor: this._deleteFactor.bind(this) };
        }
        async signOut(e10, t10 = rU[0]) {
          if (0 > rU.indexOf(t10)) throw Error(`@supabase/auth-js: Parameter scope must be one of ${rU.join(", ")}`);
          try {
            return await rj(this.fetch, "POST", `${this.url}/logout?scope=${t10}`, { headers: this.headers, jwt: e10, noResolveJson: true }), { data: null, error: null };
          } catch (e11) {
            if (tZ(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async inviteUserByEmail(e10, t10 = {}) {
          try {
            return await rj(this.fetch, "POST", `${this.url}/invite`, { body: { email: e10, data: t10.data }, headers: this.headers, redirectTo: t10.redirectTo, xform: rL });
          } catch (e11) {
            if (tZ(e11)) return { data: { user: null }, error: e11 };
            throw e11;
          }
        }
        async generateLink(e10) {
          try {
            let { options: t10 } = e10, r10 = rq(e10, ["options"]), i2 = Object.assign(Object.assign({}, r10), t10);
            return "newEmail" in r10 && (i2.new_email = null == r10 ? void 0 : r10.newEmail, delete i2.newEmail), await rj(this.fetch, "POST", `${this.url}/admin/generate_link`, { body: i2, headers: this.headers, xform: rM, redirectTo: null == t10 ? void 0 : t10.redirectTo });
          } catch (e11) {
            if (tZ(e11)) return { data: { properties: null, user: null }, error: e11 };
            throw e11;
          }
        }
        async createUser(e10) {
          try {
            return await rj(this.fetch, "POST", `${this.url}/admin/users`, { body: e10, headers: this.headers, xform: rL });
          } catch (e11) {
            if (tZ(e11)) return { data: { user: null }, error: e11 };
            throw e11;
          }
        }
        async listUsers(e10) {
          var t10, r10, i2, s2, n2, a2, o2;
          try {
            let l2 = { nextPage: null, lastPage: 0, total: 0 }, u2 = await rj(this.fetch, "GET", `${this.url}/admin/users`, { headers: this.headers, noResolveJson: true, query: { page: null !== (r10 = null === (t10 = null == e10 ? void 0 : e10.page) || void 0 === t10 ? void 0 : t10.toString()) && void 0 !== r10 ? r10 : "", per_page: null !== (s2 = null === (i2 = null == e10 ? void 0 : e10.perPage) || void 0 === i2 ? void 0 : i2.toString()) && void 0 !== s2 ? s2 : "" }, xform: rD });
            if (u2.error) throw u2.error;
            let c2 = await u2.json(), h2 = null !== (n2 = u2.headers.get("x-total-count")) && void 0 !== n2 ? n2 : 0, d2 = null !== (o2 = null === (a2 = u2.headers.get("link")) || void 0 === a2 ? void 0 : a2.split(",")) && void 0 !== o2 ? o2 : [];
            return d2.length > 0 && (d2.forEach((e11) => {
              let t11 = parseInt(e11.split(";")[0].split("=")[1].substring(0, 1)), r11 = JSON.parse(e11.split(";")[1].split("=")[1]);
              l2[`${r11}Page`] = t11;
            }), l2.total = parseInt(h2)), { data: Object.assign(Object.assign({}, c2), l2), error: null };
          } catch (e11) {
            if (tZ(e11)) return { data: { users: [] }, error: e11 };
            throw e11;
          }
        }
        async getUserById(e10) {
          rT(e10);
          try {
            return await rj(this.fetch, "GET", `${this.url}/admin/users/${e10}`, { headers: this.headers, xform: rL });
          } catch (e11) {
            if (tZ(e11)) return { data: { user: null }, error: e11 };
            throw e11;
          }
        }
        async updateUserById(e10, t10) {
          rT(e10);
          try {
            return await rj(this.fetch, "PUT", `${this.url}/admin/users/${e10}`, { body: t10, headers: this.headers, xform: rL });
          } catch (e11) {
            if (tZ(e11)) return { data: { user: null }, error: e11 };
            throw e11;
          }
        }
        async deleteUser(e10, t10 = false) {
          rT(e10);
          try {
            return await rj(this.fetch, "DELETE", `${this.url}/admin/users/${e10}`, { headers: this.headers, body: { should_soft_delete: t10 }, xform: rL });
          } catch (e11) {
            if (tZ(e11)) return { data: { user: null }, error: e11 };
            throw e11;
          }
        }
        async _listFactors(e10) {
          rT(e10.userId);
          try {
            let { data: t10, error: r10 } = await rj(this.fetch, "GET", `${this.url}/admin/users/${e10.userId}/factors`, { headers: this.headers, xform: (e11) => ({ data: { factors: e11 }, error: null }) });
            return { data: t10, error: r10 };
          } catch (e11) {
            if (tZ(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _deleteFactor(e10) {
          rT(e10.userId), rT(e10.id);
          try {
            return { data: await rj(this.fetch, "DELETE", `${this.url}/admin/users/${e10.userId}/factors/${e10.id}`, { headers: this.headers }), error: null };
          } catch (e11) {
            if (tZ(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
      }
      let rV = { getItem: (e10) => rc() ? globalThis.localStorage.getItem(e10) : null, setItem: (e10, t10) => {
        rc() && globalThis.localStorage.setItem(e10, t10);
      }, removeItem: (e10) => {
        rc() && globalThis.localStorage.removeItem(e10);
      } };
      function rF(e10 = {}) {
        return { getItem: (t10) => e10[t10] || null, setItem: (t10, r10) => {
          e10[t10] = r10;
        }, removeItem: (t10) => {
          delete e10[t10];
        } };
      }
      let rH = { debug: !!(globalThis && rc() && globalThis.localStorage && "true" === globalThis.localStorage.getItem("supabase.gotrue-js.locks.debug")) };
      class rG extends Error {
        constructor(e10) {
          super(e10), this.isAcquireTimeout = true;
        }
      }
      class rz extends rG {
      }
      async function rW(e10, t10, r10) {
        rH.debug && console.log("@supabase/gotrue-js: navigatorLock: acquire lock", e10, t10);
        let i2 = new globalThis.AbortController();
        return t10 > 0 && setTimeout(() => {
          i2.abort(), rH.debug && console.log("@supabase/gotrue-js: navigatorLock acquire timed out", e10);
        }, t10), await Promise.resolve().then(() => globalThis.navigator.locks.request(e10, 0 === t10 ? { mode: "exclusive", ifAvailable: true } : { mode: "exclusive", signal: i2.signal }, async (i3) => {
          if (i3) {
            rH.debug && console.log("@supabase/gotrue-js: navigatorLock: acquired", e10, i3.name);
            try {
              return await r10();
            } finally {
              rH.debug && console.log("@supabase/gotrue-js: navigatorLock: released", e10, i3.name);
            }
          } else {
            if (0 === t10) throw rH.debug && console.log("@supabase/gotrue-js: navigatorLock: not immediately available", e10), new rz(`Acquiring an exclusive Navigator LockManager lock "${e10}" immediately failed`);
            if (rH.debug) try {
              let e11 = await globalThis.navigator.locks.query();
              console.log("@supabase/gotrue-js: Navigator LockManager state", JSON.stringify(e11, null, "  "));
            } catch (e11) {
              console.warn("@supabase/gotrue-js: Error when querying Navigator LockManager state", e11);
            }
            return console.warn("@supabase/gotrue-js: Navigator LockManager returned a null lock when using #request without ifAvailable set to true, it appears this browser is not following the LockManager spec https://developer.mozilla.org/en-US/docs/Web/API/LockManager/request"), await r10();
          }
        }));
      }
      !function() {
        if ("object" != typeof globalThis) try {
          Object.defineProperty(Object.prototype, "__magic__", { get: function() {
            return this;
          }, configurable: true }), __magic__.globalThis = __magic__, delete Object.prototype.__magic__;
        } catch (e10) {
          "undefined" != typeof self && (self.globalThis = self);
        }
      }();
      let rK = { url: "http://localhost:9999", storageKey: "supabase.auth.token", autoRefreshToken: true, persistSession: true, detectSessionInUrl: true, headers: tK, flowType: "implicit", debug: false, hasCustomAuthorizationHeader: false };
      async function rJ(e10, t10, r10) {
        return await r10();
      }
      class rX {
        constructor(e10) {
          var t10, r10;
          this.memoryStorage = null, this.stateChangeEmitters = /* @__PURE__ */ new Map(), this.autoRefreshTicker = null, this.visibilityChangedCallback = null, this.refreshingDeferred = null, this.initializePromise = null, this.detectSessionInUrl = true, this.hasCustomAuthorizationHeader = false, this.suppressGetSessionWarning = false, this.lockAcquired = false, this.pendingInLock = [], this.broadcastChannel = null, this.logger = console.log, this.instanceID = rX.nextInstanceID, rX.nextInstanceID += 1, this.instanceID > 0 && rl() && console.warn("Multiple GoTrueClient instances detected in the same browser context. It is not an error, but this should be avoided as it may produce undefined behavior when used concurrently under the same storage key.");
          let i2 = Object.assign(Object.assign({}, rK), e10);
          if (this.logDebugMessages = !!i2.debug, "function" == typeof i2.debug && (this.logger = i2.debug), this.persistSession = i2.persistSession, this.storageKey = i2.storageKey, this.autoRefreshToken = i2.autoRefreshToken, this.admin = new rB({ url: i2.url, headers: i2.headers, fetch: i2.fetch }), this.url = i2.url, this.headers = i2.headers, this.fetch = rh(i2.fetch), this.lock = i2.lock || rJ, this.detectSessionInUrl = i2.detectSessionInUrl, this.flowType = i2.flowType, this.hasCustomAuthorizationHeader = i2.hasCustomAuthorizationHeader, i2.lock ? this.lock = i2.lock : rl() && (null === (t10 = null == globalThis ? void 0 : globalThis.navigator) || void 0 === t10 ? void 0 : t10.locks) ? this.lock = rW : this.lock = rJ, this.jwks = { keys: [] }, this.jwks_cached_at = Number.MIN_SAFE_INTEGER, this.mfa = { verify: this._verify.bind(this), enroll: this._enroll.bind(this), unenroll: this._unenroll.bind(this), challenge: this._challenge.bind(this), listFactors: this._listFactors.bind(this), challengeAndVerify: this._challengeAndVerify.bind(this), getAuthenticatorAssuranceLevel: this._getAuthenticatorAssuranceLevel.bind(this) }, this.persistSession ? i2.storage ? this.storage = i2.storage : rc() ? this.storage = rV : (this.memoryStorage = {}, this.storage = rF(this.memoryStorage)) : (this.memoryStorage = {}, this.storage = rF(this.memoryStorage)), rl() && globalThis.BroadcastChannel && this.persistSession && this.storageKey) {
            try {
              this.broadcastChannel = new globalThis.BroadcastChannel(this.storageKey);
            } catch (e11) {
              console.error("Failed to create a new BroadcastChannel, multi-tab state changes will not be available", e11);
            }
            null === (r10 = this.broadcastChannel) || void 0 === r10 || r10.addEventListener("message", async (e11) => {
              this._debug("received broadcast notification from other tab or client", e11), await this._notifyAllSubscribers(e11.data.event, e11.data.session, false);
            });
          }
          this.initialize();
        }
        _debug(...e10) {
          return this.logDebugMessages && this.logger(`GoTrueClient@${this.instanceID} (${tW}) ${(/* @__PURE__ */ new Date()).toISOString()}`, ...e10), this;
        }
        async initialize() {
          return this.initializePromise || (this.initializePromise = (async () => await this._acquireLock(-1, async () => await this._initialize()))()), await this.initializePromise;
        }
        async _initialize() {
          var e10;
          try {
            let t10 = function(e11) {
              let t11 = {}, r11 = new URL(e11);
              if (r11.hash && "#" === r11.hash[0]) try {
                new URLSearchParams(r11.hash.substring(1)).forEach((e12, r12) => {
                  t11[r12] = e12;
                });
              } catch (e12) {
              }
              return r11.searchParams.forEach((e12, r12) => {
                t11[r12] = e12;
              }), t11;
            }(window.location.href), r10 = "none";
            if (this._isImplicitGrantCallback(t10) ? r10 = "implicit" : await this._isPKCECallback(t10) && (r10 = "pkce"), rl() && this.detectSessionInUrl && "none" !== r10) {
              let { data: i2, error: s2 } = await this._getSessionFromURL(t10, r10);
              if (s2) {
                if (this._debug("#_initialize()", "error detecting session from URL", s2), tZ(s2) && "AuthImplicitGrantRedirectError" === s2.name) {
                  let t11 = null === (e10 = s2.details) || void 0 === e10 ? void 0 : e10.code;
                  if ("identity_already_exists" === t11 || "identity_not_found" === t11 || "single_identity_not_deletable" === t11) return { error: s2 };
                }
                return await this._removeSession(), { error: s2 };
              }
              let { session: n2, redirectType: a2 } = i2;
              return this._debug("#_initialize()", "detected session in URL", n2, "redirect type", a2), await this._saveSession(n2), setTimeout(async () => {
                "recovery" === a2 ? await this._notifyAllSubscribers("PASSWORD_RECOVERY", n2) : await this._notifyAllSubscribers("SIGNED_IN", n2);
              }, 0), { error: null };
            }
            return await this._recoverAndRefresh(), { error: null };
          } catch (e11) {
            if (tZ(e11)) return { error: e11 };
            return { error: new t1("Unexpected error during initialization", e11) };
          } finally {
            await this._handleVisibilityChange(), this._debug("#_initialize()", "end");
          }
        }
        async signInAnonymously(e10) {
          var t10, r10, i2;
          try {
            let { data: s2, error: n2 } = await rj(this.fetch, "POST", `${this.url}/signup`, { headers: this.headers, body: { data: null !== (r10 = null === (t10 = null == e10 ? void 0 : e10.options) || void 0 === t10 ? void 0 : t10.data) && void 0 !== r10 ? r10 : {}, gotrue_meta_security: { captcha_token: null === (i2 = null == e10 ? void 0 : e10.options) || void 0 === i2 ? void 0 : i2.captchaToken } }, xform: rI });
            if (n2 || !s2) return { data: { user: null, session: null }, error: n2 };
            let a2 = s2.session, o2 = s2.user;
            return s2.session && (await this._saveSession(s2.session), await this._notifyAllSubscribers("SIGNED_IN", a2)), { data: { user: o2, session: a2 }, error: null };
          } catch (e11) {
            if (tZ(e11)) return { data: { user: null, session: null }, error: e11 };
            throw e11;
          }
        }
        async signUp(e10) {
          var t10, r10, i2;
          try {
            let s2;
            if ("email" in e10) {
              let { email: r11, password: i3, options: n3 } = e10, a3 = null, o3 = null;
              "pkce" === this.flowType && ([a3, o3] = await rS(this.storage, this.storageKey)), s2 = await rj(this.fetch, "POST", `${this.url}/signup`, { headers: this.headers, redirectTo: null == n3 ? void 0 : n3.emailRedirectTo, body: { email: r11, password: i3, data: null !== (t10 = null == n3 ? void 0 : n3.data) && void 0 !== t10 ? t10 : {}, gotrue_meta_security: { captcha_token: null == n3 ? void 0 : n3.captchaToken }, code_challenge: a3, code_challenge_method: o3 }, xform: rI });
            } else if ("phone" in e10) {
              let { phone: t11, password: n3, options: a3 } = e10;
              s2 = await rj(this.fetch, "POST", `${this.url}/signup`, { headers: this.headers, body: { phone: t11, password: n3, data: null !== (r10 = null == a3 ? void 0 : a3.data) && void 0 !== r10 ? r10 : {}, channel: null !== (i2 = null == a3 ? void 0 : a3.channel) && void 0 !== i2 ? i2 : "sms", gotrue_meta_security: { captcha_token: null == a3 ? void 0 : a3.captchaToken } }, xform: rI });
            } else throw new t4("You must provide either an email or phone number and a password");
            let { data: n2, error: a2 } = s2;
            if (a2 || !n2) return { data: { user: null, session: null }, error: a2 };
            let o2 = n2.session, l2 = n2.user;
            return n2.session && (await this._saveSession(n2.session), await this._notifyAllSubscribers("SIGNED_IN", o2)), { data: { user: l2, session: o2 }, error: null };
          } catch (e11) {
            if (tZ(e11)) return { data: { user: null, session: null }, error: e11 };
            throw e11;
          }
        }
        async signInWithPassword(e10) {
          try {
            let t10;
            if ("email" in e10) {
              let { email: r11, password: i3, options: s2 } = e10;
              t10 = await rj(this.fetch, "POST", `${this.url}/token?grant_type=password`, { headers: this.headers, body: { email: r11, password: i3, gotrue_meta_security: { captcha_token: null == s2 ? void 0 : s2.captchaToken } }, xform: rN });
            } else if ("phone" in e10) {
              let { phone: r11, password: i3, options: s2 } = e10;
              t10 = await rj(this.fetch, "POST", `${this.url}/token?grant_type=password`, { headers: this.headers, body: { phone: r11, password: i3, gotrue_meta_security: { captcha_token: null == s2 ? void 0 : s2.captchaToken } }, xform: rN });
            } else throw new t4("You must provide either an email or phone number and a password");
            let { data: r10, error: i2 } = t10;
            if (i2) return { data: { user: null, session: null }, error: i2 };
            if (!r10 || !r10.session || !r10.user) return { data: { user: null, session: null }, error: new t6() };
            return r10.session && (await this._saveSession(r10.session), await this._notifyAllSubscribers("SIGNED_IN", r10.session)), { data: Object.assign({ user: r10.user, session: r10.session }, r10.weak_password ? { weakPassword: r10.weak_password } : null), error: i2 };
          } catch (e11) {
            if (tZ(e11)) return { data: { user: null, session: null }, error: e11 };
            throw e11;
          }
        }
        async signInWithOAuth(e10) {
          var t10, r10, i2, s2;
          return await this._handleProviderSignIn(e10.provider, { redirectTo: null === (t10 = e10.options) || void 0 === t10 ? void 0 : t10.redirectTo, scopes: null === (r10 = e10.options) || void 0 === r10 ? void 0 : r10.scopes, queryParams: null === (i2 = e10.options) || void 0 === i2 ? void 0 : i2.queryParams, skipBrowserRedirect: null === (s2 = e10.options) || void 0 === s2 ? void 0 : s2.skipBrowserRedirect });
        }
        async exchangeCodeForSession(e10) {
          return await this.initializePromise, this._acquireLock(-1, async () => this._exchangeCodeForSession(e10));
        }
        async signInWithWeb3(e10) {
          let { chain: t10 } = e10;
          if ("solana" === t10) return await this.signInWithSolana(e10);
          throw Error(`@supabase/auth-js: Unsupported chain "${t10}"`);
        }
        async signInWithSolana(e10) {
          var t10, r10, i2, s2, n2, a2, o2, l2, u2, c2, h2, d2;
          let p2, f2;
          if ("message" in e10) p2 = e10.message, f2 = e10.signature;
          else {
            let h3;
            let { chain: d3, wallet: g2, statement: m2, options: v2 } = e10;
            if (rl()) {
              if ("object" == typeof g2) h3 = g2;
              else {
                let e11 = window;
                if ("solana" in e11 && "object" == typeof e11.solana && ("signIn" in e11.solana && "function" == typeof e11.solana.signIn || "signMessage" in e11.solana && "function" == typeof e11.solana.signMessage)) h3 = e11.solana;
                else throw Error("@supabase/auth-js: No compatible Solana wallet interface on the window object (window.solana) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'solana', wallet: resolvedUserWallet }) instead.");
              }
            } else {
              if ("object" != typeof g2 || !(null == v2 ? void 0 : v2.url)) throw Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");
              h3 = g2;
            }
            let b2 = new URL(null !== (t10 = null == v2 ? void 0 : v2.url) && void 0 !== t10 ? t10 : window.location.href);
            if ("signIn" in h3 && h3.signIn) {
              let e11;
              let t11 = await h3.signIn(Object.assign(Object.assign(Object.assign({ issuedAt: (/* @__PURE__ */ new Date()).toISOString() }, null == v2 ? void 0 : v2.signInWithSolana), { version: "1", domain: b2.host, uri: b2.href }), m2 ? { statement: m2 } : null));
              if (Array.isArray(t11) && t11[0] && "object" == typeof t11[0]) e11 = t11[0];
              else if (t11 && "object" == typeof t11 && "signedMessage" in t11 && "signature" in t11) e11 = t11;
              else throw Error("@supabase/auth-js: Wallet method signIn() returned unrecognized value");
              if ("signedMessage" in e11 && "signature" in e11 && ("string" == typeof e11.signedMessage || e11.signedMessage instanceof Uint8Array) && e11.signature instanceof Uint8Array) p2 = "string" == typeof e11.signedMessage ? e11.signedMessage : new TextDecoder().decode(e11.signedMessage), f2 = e11.signature;
              else throw Error("@supabase/auth-js: Wallet method signIn() API returned object without signedMessage and signature fields");
            } else {
              if (!("signMessage" in h3) || "function" != typeof h3.signMessage || !("publicKey" in h3) || "object" != typeof h3 || !h3.publicKey || !("toBase58" in h3.publicKey) || "function" != typeof h3.publicKey.toBase58) throw Error("@supabase/auth-js: Wallet does not have a compatible signMessage() and publicKey.toBase58() API");
              p2 = [`${b2.host} wants you to sign in with your Solana account:`, h3.publicKey.toBase58(), ...m2 ? ["", m2, ""] : [""], "Version: 1", `URI: ${b2.href}`, `Issued At: ${null !== (i2 = null === (r10 = null == v2 ? void 0 : v2.signInWithSolana) || void 0 === r10 ? void 0 : r10.issuedAt) && void 0 !== i2 ? i2 : (/* @__PURE__ */ new Date()).toISOString()}`, ...(null === (s2 = null == v2 ? void 0 : v2.signInWithSolana) || void 0 === s2 ? void 0 : s2.notBefore) ? [`Not Before: ${v2.signInWithSolana.notBefore}`] : [], ...(null === (n2 = null == v2 ? void 0 : v2.signInWithSolana) || void 0 === n2 ? void 0 : n2.expirationTime) ? [`Expiration Time: ${v2.signInWithSolana.expirationTime}`] : [], ...(null === (a2 = null == v2 ? void 0 : v2.signInWithSolana) || void 0 === a2 ? void 0 : a2.chainId) ? [`Chain ID: ${v2.signInWithSolana.chainId}`] : [], ...(null === (o2 = null == v2 ? void 0 : v2.signInWithSolana) || void 0 === o2 ? void 0 : o2.nonce) ? [`Nonce: ${v2.signInWithSolana.nonce}`] : [], ...(null === (l2 = null == v2 ? void 0 : v2.signInWithSolana) || void 0 === l2 ? void 0 : l2.requestId) ? [`Request ID: ${v2.signInWithSolana.requestId}`] : [], ...(null === (c2 = null === (u2 = null == v2 ? void 0 : v2.signInWithSolana) || void 0 === u2 ? void 0 : u2.resources) || void 0 === c2 ? void 0 : c2.length) ? ["Resources", ...v2.signInWithSolana.resources.map((e12) => `- ${e12}`)] : []].join("\n");
              let e11 = await h3.signMessage(new TextEncoder().encode(p2), "utf8");
              if (!e11 || !(e11 instanceof Uint8Array)) throw Error("@supabase/auth-js: Wallet signMessage() API returned an recognized value");
              f2 = e11;
            }
          }
          try {
            let { data: t11, error: r11 } = await rj(this.fetch, "POST", `${this.url}/token?grant_type=web3`, { headers: this.headers, body: Object.assign({ chain: "solana", message: p2, signature: function(e11) {
              let t12 = [], r12 = { queue: 0, queuedBits: 0 }, i3 = (e12) => {
                t12.push(e12);
              };
              return e11.forEach((e12) => rn(e12, r12, i3)), rn(null, r12, i3), t12.join("");
            }(f2) }, (null === (h2 = e10.options) || void 0 === h2 ? void 0 : h2.captchaToken) ? { gotrue_meta_security: { captcha_token: null === (d2 = e10.options) || void 0 === d2 ? void 0 : d2.captchaToken } } : null), xform: rI });
            if (r11) throw r11;
            if (!t11 || !t11.session || !t11.user) return { data: { user: null, session: null }, error: new t6() };
            return t11.session && (await this._saveSession(t11.session), await this._notifyAllSubscribers("SIGNED_IN", t11.session)), { data: Object.assign({}, t11), error: r11 };
          } catch (e11) {
            if (tZ(e11)) return { data: { user: null, session: null }, error: e11 };
            throw e11;
          }
        }
        async _exchangeCodeForSession(e10) {
          let t10 = await rf(this.storage, `${this.storageKey}-code-verifier`), [r10, i2] = (null != t10 ? t10 : "").split("/");
          try {
            let { data: t11, error: s2 } = await rj(this.fetch, "POST", `${this.url}/token?grant_type=pkce`, { headers: this.headers, body: { auth_code: e10, code_verifier: r10 }, xform: rI });
            if (await rg(this.storage, `${this.storageKey}-code-verifier`), s2) throw s2;
            if (!t11 || !t11.session || !t11.user) return { data: { user: null, session: null, redirectType: null }, error: new t6() };
            return t11.session && (await this._saveSession(t11.session), await this._notifyAllSubscribers("SIGNED_IN", t11.session)), { data: Object.assign(Object.assign({}, t11), { redirectType: null != i2 ? i2 : null }), error: s2 };
          } catch (e11) {
            if (tZ(e11)) return { data: { user: null, session: null, redirectType: null }, error: e11 };
            throw e11;
          }
        }
        async signInWithIdToken(e10) {
          try {
            let { options: t10, provider: r10, token: i2, access_token: s2, nonce: n2 } = e10, { data: a2, error: o2 } = await rj(this.fetch, "POST", `${this.url}/token?grant_type=id_token`, { headers: this.headers, body: { provider: r10, id_token: i2, access_token: s2, nonce: n2, gotrue_meta_security: { captcha_token: null == t10 ? void 0 : t10.captchaToken } }, xform: rI });
            if (o2) return { data: { user: null, session: null }, error: o2 };
            if (!a2 || !a2.session || !a2.user) return { data: { user: null, session: null }, error: new t6() };
            return a2.session && (await this._saveSession(a2.session), await this._notifyAllSubscribers("SIGNED_IN", a2.session)), { data: a2, error: o2 };
          } catch (e11) {
            if (tZ(e11)) return { data: { user: null, session: null }, error: e11 };
            throw e11;
          }
        }
        async signInWithOtp(e10) {
          var t10, r10, i2, s2, n2;
          try {
            if ("email" in e10) {
              let { email: i3, options: s3 } = e10, n3 = null, a2 = null;
              "pkce" === this.flowType && ([n3, a2] = await rS(this.storage, this.storageKey));
              let { error: o2 } = await rj(this.fetch, "POST", `${this.url}/otp`, { headers: this.headers, body: { email: i3, data: null !== (t10 = null == s3 ? void 0 : s3.data) && void 0 !== t10 ? t10 : {}, create_user: null === (r10 = null == s3 ? void 0 : s3.shouldCreateUser) || void 0 === r10 || r10, gotrue_meta_security: { captcha_token: null == s3 ? void 0 : s3.captchaToken }, code_challenge: n3, code_challenge_method: a2 }, redirectTo: null == s3 ? void 0 : s3.emailRedirectTo });
              return { data: { user: null, session: null }, error: o2 };
            }
            if ("phone" in e10) {
              let { phone: t11, options: r11 } = e10, { data: a2, error: o2 } = await rj(this.fetch, "POST", `${this.url}/otp`, { headers: this.headers, body: { phone: t11, data: null !== (i2 = null == r11 ? void 0 : r11.data) && void 0 !== i2 ? i2 : {}, create_user: null === (s2 = null == r11 ? void 0 : r11.shouldCreateUser) || void 0 === s2 || s2, gotrue_meta_security: { captcha_token: null == r11 ? void 0 : r11.captchaToken }, channel: null !== (n2 = null == r11 ? void 0 : r11.channel) && void 0 !== n2 ? n2 : "sms" } });
              return { data: { user: null, session: null, messageId: null == a2 ? void 0 : a2.message_id }, error: o2 };
            }
            throw new t4("You must provide either an email or phone number.");
          } catch (e11) {
            if (tZ(e11)) return { data: { user: null, session: null }, error: e11 };
            throw e11;
          }
        }
        async verifyOtp(e10) {
          var t10, r10;
          try {
            let i2, s2;
            "options" in e10 && (i2 = null === (t10 = e10.options) || void 0 === t10 ? void 0 : t10.redirectTo, s2 = null === (r10 = e10.options) || void 0 === r10 ? void 0 : r10.captchaToken);
            let { data: n2, error: a2 } = await rj(this.fetch, "POST", `${this.url}/verify`, { headers: this.headers, body: Object.assign(Object.assign({}, e10), { gotrue_meta_security: { captcha_token: s2 } }), redirectTo: i2, xform: rI });
            if (a2) throw a2;
            if (!n2) throw Error("An error occurred on token verification.");
            let o2 = n2.session, l2 = n2.user;
            return (null == o2 ? void 0 : o2.access_token) && (await this._saveSession(o2), await this._notifyAllSubscribers("recovery" == e10.type ? "PASSWORD_RECOVERY" : "SIGNED_IN", o2)), { data: { user: l2, session: o2 }, error: null };
          } catch (e11) {
            if (tZ(e11)) return { data: { user: null, session: null }, error: e11 };
            throw e11;
          }
        }
        async signInWithSSO(e10) {
          var t10, r10, i2;
          try {
            let s2 = null, n2 = null;
            return "pkce" === this.flowType && ([s2, n2] = await rS(this.storage, this.storageKey)), await rj(this.fetch, "POST", `${this.url}/sso`, { body: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, "providerId" in e10 ? { provider_id: e10.providerId } : null), "domain" in e10 ? { domain: e10.domain } : null), { redirect_to: null !== (r10 = null === (t10 = e10.options) || void 0 === t10 ? void 0 : t10.redirectTo) && void 0 !== r10 ? r10 : void 0 }), (null === (i2 = null == e10 ? void 0 : e10.options) || void 0 === i2 ? void 0 : i2.captchaToken) ? { gotrue_meta_security: { captcha_token: e10.options.captchaToken } } : null), { skip_http_redirect: true, code_challenge: s2, code_challenge_method: n2 }), headers: this.headers, xform: r$ });
          } catch (e11) {
            if (tZ(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async reauthenticate() {
          return await this.initializePromise, await this._acquireLock(-1, async () => await this._reauthenticate());
        }
        async _reauthenticate() {
          try {
            return await this._useSession(async (e10) => {
              let { data: { session: t10 }, error: r10 } = e10;
              if (r10) throw r10;
              if (!t10) throw new t3();
              let { error: i2 } = await rj(this.fetch, "GET", `${this.url}/reauthenticate`, { headers: this.headers, jwt: t10.access_token });
              return { data: { user: null, session: null }, error: i2 };
            });
          } catch (e10) {
            if (tZ(e10)) return { data: { user: null, session: null }, error: e10 };
            throw e10;
          }
        }
        async resend(e10) {
          try {
            let t10 = `${this.url}/resend`;
            if ("email" in e10) {
              let { email: r10, type: i2, options: s2 } = e10, { error: n2 } = await rj(this.fetch, "POST", t10, { headers: this.headers, body: { email: r10, type: i2, gotrue_meta_security: { captcha_token: null == s2 ? void 0 : s2.captchaToken } }, redirectTo: null == s2 ? void 0 : s2.emailRedirectTo });
              return { data: { user: null, session: null }, error: n2 };
            }
            if ("phone" in e10) {
              let { phone: r10, type: i2, options: s2 } = e10, { data: n2, error: a2 } = await rj(this.fetch, "POST", t10, { headers: this.headers, body: { phone: r10, type: i2, gotrue_meta_security: { captcha_token: null == s2 ? void 0 : s2.captchaToken } } });
              return { data: { user: null, session: null, messageId: null == n2 ? void 0 : n2.message_id }, error: a2 };
            }
            throw new t4("You must provide either an email or phone number and a type");
          } catch (e11) {
            if (tZ(e11)) return { data: { user: null, session: null }, error: e11 };
            throw e11;
          }
        }
        async getSession() {
          return await this.initializePromise, await this._acquireLock(-1, async () => this._useSession(async (e10) => e10));
        }
        async _acquireLock(e10, t10) {
          this._debug("#_acquireLock", "begin", e10);
          try {
            if (this.lockAcquired) {
              let e11 = this.pendingInLock.length ? this.pendingInLock[this.pendingInLock.length - 1] : Promise.resolve(), r10 = (async () => (await e11, await t10()))();
              return this.pendingInLock.push((async () => {
                try {
                  await r10;
                } catch (e12) {
                }
              })()), r10;
            }
            return await this.lock(`lock:${this.storageKey}`, e10, async () => {
              this._debug("#_acquireLock", "lock acquired for storage key", this.storageKey);
              try {
                this.lockAcquired = true;
                let e11 = t10();
                for (this.pendingInLock.push((async () => {
                  try {
                    await e11;
                  } catch (e12) {
                  }
                })()), await e11; this.pendingInLock.length; ) {
                  let e12 = [...this.pendingInLock];
                  await Promise.all(e12), this.pendingInLock.splice(0, e12.length);
                }
                return await e11;
              } finally {
                this._debug("#_acquireLock", "lock released for storage key", this.storageKey), this.lockAcquired = false;
              }
            });
          } finally {
            this._debug("#_acquireLock", "end");
          }
        }
        async _useSession(e10) {
          this._debug("#_useSession", "begin");
          try {
            let t10 = await this.__loadSession();
            return await e10(t10);
          } finally {
            this._debug("#_useSession", "end");
          }
        }
        async __loadSession() {
          this._debug("#__loadSession()", "begin"), this.lockAcquired || this._debug("#__loadSession()", "used outside of an acquired lock!", Error().stack);
          try {
            let e10 = null, t10 = await rf(this.storage, this.storageKey);
            if (this._debug("#getSession()", "session from storage", t10), null !== t10 && (this._isValidSession(t10) ? e10 = t10 : (this._debug("#getSession()", "session from storage is not valid"), await this._removeSession())), !e10) return { data: { session: null }, error: null };
            let r10 = !!e10.expires_at && 1e3 * e10.expires_at - Date.now() < 9e4;
            if (this._debug("#__loadSession()", `session has${r10 ? "" : " not"} expired`, "expires_at", e10.expires_at), !r10) {
              if (this.storage.isServer) {
                let t11 = this.suppressGetSessionWarning;
                e10 = new Proxy(e10, { get: (e11, r11, i3) => (t11 || "user" !== r11 || (console.warn("Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server."), t11 = true, this.suppressGetSessionWarning = true), Reflect.get(e11, r11, i3)) });
              }
              return { data: { session: e10 }, error: null };
            }
            let { session: i2, error: s2 } = await this._callRefreshToken(e10.refresh_token);
            if (s2) return { data: { session: null }, error: s2 };
            return { data: { session: i2 }, error: null };
          } finally {
            this._debug("#__loadSession()", "end");
          }
        }
        async getUser(e10) {
          return e10 ? await this._getUser(e10) : (await this.initializePromise, await this._acquireLock(-1, async () => await this._getUser()));
        }
        async _getUser(e10) {
          try {
            if (e10) return await rj(this.fetch, "GET", `${this.url}/user`, { headers: this.headers, jwt: e10, xform: rL });
            return await this._useSession(async (e11) => {
              var t10, r10, i2;
              let { data: s2, error: n2 } = e11;
              if (n2) throw n2;
              return (null === (t10 = s2.session) || void 0 === t10 ? void 0 : t10.access_token) || this.hasCustomAuthorizationHeader ? await rj(this.fetch, "GET", `${this.url}/user`, { headers: this.headers, jwt: null !== (i2 = null === (r10 = s2.session) || void 0 === r10 ? void 0 : r10.access_token) && void 0 !== i2 ? i2 : void 0, xform: rL }) : { data: { user: null }, error: new t3() };
            });
          } catch (e11) {
            if (tZ(e11)) return tZ(e11) && "AuthSessionMissingError" === e11.name && (await this._removeSession(), await rg(this.storage, `${this.storageKey}-code-verifier`)), { data: { user: null }, error: e11 };
            throw e11;
          }
        }
        async updateUser(e10, t10 = {}) {
          return await this.initializePromise, await this._acquireLock(-1, async () => await this._updateUser(e10, t10));
        }
        async _updateUser(e10, t10 = {}) {
          try {
            return await this._useSession(async (r10) => {
              let { data: i2, error: s2 } = r10;
              if (s2) throw s2;
              if (!i2.session) throw new t3();
              let n2 = i2.session, a2 = null, o2 = null;
              "pkce" === this.flowType && null != e10.email && ([a2, o2] = await rS(this.storage, this.storageKey));
              let { data: l2, error: u2 } = await rj(this.fetch, "PUT", `${this.url}/user`, { headers: this.headers, redirectTo: null == t10 ? void 0 : t10.emailRedirectTo, body: Object.assign(Object.assign({}, e10), { code_challenge: a2, code_challenge_method: o2 }), jwt: n2.access_token, xform: rL });
              if (u2) throw u2;
              return n2.user = l2.user, await this._saveSession(n2), await this._notifyAllSubscribers("USER_UPDATED", n2), { data: { user: n2.user }, error: null };
            });
          } catch (e11) {
            if (tZ(e11)) return { data: { user: null }, error: e11 };
            throw e11;
          }
        }
        async setSession(e10) {
          return await this.initializePromise, await this._acquireLock(-1, async () => await this._setSession(e10));
        }
        async _setSession(e10) {
          try {
            if (!e10.access_token || !e10.refresh_token) throw new t3();
            let t10 = Date.now() / 1e3, r10 = t10, i2 = true, s2 = null, { payload: n2 } = rv(e10.access_token);
            if (n2.exp && (i2 = (r10 = n2.exp) <= t10), i2) {
              let { session: t11, error: r11 } = await this._callRefreshToken(e10.refresh_token);
              if (r11) return { data: { user: null, session: null }, error: r11 };
              if (!t11) return { data: { user: null, session: null }, error: null };
              s2 = t11;
            } else {
              let { data: i3, error: n3 } = await this._getUser(e10.access_token);
              if (n3) throw n3;
              s2 = { access_token: e10.access_token, refresh_token: e10.refresh_token, user: i3.user, token_type: "bearer", expires_in: r10 - t10, expires_at: r10 }, await this._saveSession(s2), await this._notifyAllSubscribers("SIGNED_IN", s2);
            }
            return { data: { user: s2.user, session: s2 }, error: null };
          } catch (e11) {
            if (tZ(e11)) return { data: { session: null, user: null }, error: e11 };
            throw e11;
          }
        }
        async refreshSession(e10) {
          return await this.initializePromise, await this._acquireLock(-1, async () => await this._refreshSession(e10));
        }
        async _refreshSession(e10) {
          try {
            return await this._useSession(async (t10) => {
              var r10;
              if (!e10) {
                let { data: i3, error: s3 } = t10;
                if (s3) throw s3;
                e10 = null !== (r10 = i3.session) && void 0 !== r10 ? r10 : void 0;
              }
              if (!(null == e10 ? void 0 : e10.refresh_token)) throw new t3();
              let { session: i2, error: s2 } = await this._callRefreshToken(e10.refresh_token);
              return s2 ? { data: { user: null, session: null }, error: s2 } : i2 ? { data: { user: i2.user, session: i2 }, error: null } : { data: { user: null, session: null }, error: null };
            });
          } catch (e11) {
            if (tZ(e11)) return { data: { user: null, session: null }, error: e11 };
            throw e11;
          }
        }
        async _getSessionFromURL(e10, t10) {
          try {
            if (!rl()) throw new t5("No browser detected.");
            if (e10.error || e10.error_description || e10.error_code) throw new t5(e10.error_description || "Error in URL with unspecified error_description", { error: e10.error || "unspecified_error", code: e10.error_code || "unspecified_code" });
            switch (t10) {
              case "implicit":
                if ("pkce" === this.flowType) throw new t8("Not a valid PKCE flow url.");
                break;
              case "pkce":
                if ("implicit" === this.flowType) throw new t5("Not a valid implicit grant flow url.");
            }
            if ("pkce" === t10) {
              if (this._debug("#_initialize()", "begin", "is PKCE flow", true), !e10.code) throw new t8("No code detected.");
              let { data: t11, error: r11 } = await this._exchangeCodeForSession(e10.code);
              if (r11) throw r11;
              let i3 = new URL(window.location.href);
              return i3.searchParams.delete("code"), window.history.replaceState(window.history.state, "", i3.toString()), { data: { session: t11.session, redirectType: null }, error: null };
            }
            let { provider_token: r10, provider_refresh_token: i2, access_token: s2, refresh_token: n2, expires_in: a2, expires_at: o2, token_type: l2 } = e10;
            if (!s2 || !a2 || !n2 || !l2) throw new t5("No session defined in URL");
            let u2 = Math.round(Date.now() / 1e3), c2 = parseInt(a2), h2 = u2 + c2;
            o2 && (h2 = parseInt(o2));
            let d2 = h2 - u2;
            1e3 * d2 <= 3e4 && console.warn(`@supabase/gotrue-js: Session as retrieved from URL expires in ${d2}s, should have been closer to ${c2}s`);
            let p2 = h2 - c2;
            u2 - p2 >= 120 ? console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued over 120s ago, URL could be stale", p2, h2, u2) : u2 - p2 < 0 && console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued in the future? Check the device clock for skew", p2, h2, u2);
            let { data: f2, error: g2 } = await this._getUser(s2);
            if (g2) throw g2;
            let m2 = { provider_token: r10, provider_refresh_token: i2, access_token: s2, expires_in: c2, expires_at: h2, refresh_token: n2, token_type: l2, user: f2.user };
            return window.location.hash = "", this._debug("#_getSessionFromURL()", "clearing window.location.hash"), { data: { session: m2, redirectType: e10.type }, error: null };
          } catch (e11) {
            if (tZ(e11)) return { data: { session: null, redirectType: null }, error: e11 };
            throw e11;
          }
        }
        _isImplicitGrantCallback(e10) {
          return !!(e10.access_token || e10.error_description);
        }
        async _isPKCECallback(e10) {
          let t10 = await rf(this.storage, `${this.storageKey}-code-verifier`);
          return !!(e10.code && t10);
        }
        async signOut(e10 = { scope: "global" }) {
          return await this.initializePromise, await this._acquireLock(-1, async () => await this._signOut(e10));
        }
        async _signOut({ scope: e10 } = { scope: "global" }) {
          return await this._useSession(async (t10) => {
            var r10;
            let { data: i2, error: s2 } = t10;
            if (s2) return { error: s2 };
            let n2 = null === (r10 = i2.session) || void 0 === r10 ? void 0 : r10.access_token;
            if (n2) {
              let { error: t11 } = await this.admin.signOut(n2, e10);
              if (t11 && !(tZ(t11) && "AuthApiError" === t11.name && (404 === t11.status || 401 === t11.status || 403 === t11.status))) return { error: t11 };
            }
            return "others" !== e10 && (await this._removeSession(), await rg(this.storage, `${this.storageKey}-code-verifier`)), { error: null };
          });
        }
        onAuthStateChange(e10) {
          let t10 = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(e11) {
            let t11 = 16 * Math.random() | 0;
            return ("x" == e11 ? t11 : 3 & t11 | 8).toString(16);
          }), r10 = { id: t10, callback: e10, unsubscribe: () => {
            this._debug("#unsubscribe()", "state change callback with id removed", t10), this.stateChangeEmitters.delete(t10);
          } };
          return this._debug("#onAuthStateChange()", "registered callback with id", t10), this.stateChangeEmitters.set(t10, r10), (async () => {
            await this.initializePromise, await this._acquireLock(-1, async () => {
              this._emitInitialSession(t10);
            });
          })(), { data: { subscription: r10 } };
        }
        async _emitInitialSession(e10) {
          return await this._useSession(async (t10) => {
            var r10, i2;
            try {
              let { data: { session: i3 }, error: s2 } = t10;
              if (s2) throw s2;
              await (null === (r10 = this.stateChangeEmitters.get(e10)) || void 0 === r10 ? void 0 : r10.callback("INITIAL_SESSION", i3)), this._debug("INITIAL_SESSION", "callback id", e10, "session", i3);
            } catch (t11) {
              await (null === (i2 = this.stateChangeEmitters.get(e10)) || void 0 === i2 ? void 0 : i2.callback("INITIAL_SESSION", null)), this._debug("INITIAL_SESSION", "callback id", e10, "error", t11), console.error(t11);
            }
          });
        }
        async resetPasswordForEmail(e10, t10 = {}) {
          let r10 = null, i2 = null;
          "pkce" === this.flowType && ([r10, i2] = await rS(this.storage, this.storageKey, true));
          try {
            return await rj(this.fetch, "POST", `${this.url}/recover`, { body: { email: e10, code_challenge: r10, code_challenge_method: i2, gotrue_meta_security: { captcha_token: t10.captchaToken } }, headers: this.headers, redirectTo: t10.redirectTo });
          } catch (e11) {
            if (tZ(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async getUserIdentities() {
          var e10;
          try {
            let { data: t10, error: r10 } = await this.getUser();
            if (r10) throw r10;
            return { data: { identities: null !== (e10 = t10.user.identities) && void 0 !== e10 ? e10 : [] }, error: null };
          } catch (e11) {
            if (tZ(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async linkIdentity(e10) {
          var t10;
          try {
            let { data: r10, error: i2 } = await this._useSession(async (t11) => {
              var r11, i3, s2, n2, a2;
              let { data: o2, error: l2 } = t11;
              if (l2) throw l2;
              let u2 = await this._getUrlForProvider(`${this.url}/user/identities/authorize`, e10.provider, { redirectTo: null === (r11 = e10.options) || void 0 === r11 ? void 0 : r11.redirectTo, scopes: null === (i3 = e10.options) || void 0 === i3 ? void 0 : i3.scopes, queryParams: null === (s2 = e10.options) || void 0 === s2 ? void 0 : s2.queryParams, skipBrowserRedirect: true });
              return await rj(this.fetch, "GET", u2, { headers: this.headers, jwt: null !== (a2 = null === (n2 = o2.session) || void 0 === n2 ? void 0 : n2.access_token) && void 0 !== a2 ? a2 : void 0 });
            });
            if (i2) throw i2;
            return !rl() || (null === (t10 = e10.options) || void 0 === t10 ? void 0 : t10.skipBrowserRedirect) || window.location.assign(null == r10 ? void 0 : r10.url), { data: { provider: e10.provider, url: null == r10 ? void 0 : r10.url }, error: null };
          } catch (t11) {
            if (tZ(t11)) return { data: { provider: e10.provider, url: null }, error: t11 };
            throw t11;
          }
        }
        async unlinkIdentity(e10) {
          try {
            return await this._useSession(async (t10) => {
              var r10, i2;
              let { data: s2, error: n2 } = t10;
              if (n2) throw n2;
              return await rj(this.fetch, "DELETE", `${this.url}/user/identities/${e10.identity_id}`, { headers: this.headers, jwt: null !== (i2 = null === (r10 = s2.session) || void 0 === r10 ? void 0 : r10.access_token) && void 0 !== i2 ? i2 : void 0 });
            });
          } catch (e11) {
            if (tZ(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _refreshAccessToken(e10) {
          let t10 = `#_refreshAccessToken(${e10.substring(0, 5)}...)`;
          this._debug(t10, "begin");
          try {
            var r10, i2;
            let s2 = Date.now();
            return await (r10 = async (r11) => (r11 > 0 && await rb(200 * Math.pow(2, r11 - 1)), this._debug(t10, "refreshing attempt", r11), await rj(this.fetch, "POST", `${this.url}/token?grant_type=refresh_token`, { body: { refresh_token: e10 }, headers: this.headers, xform: rI })), i2 = (e11, t11) => t11 && t7(t11) && Date.now() + 200 * Math.pow(2, e11) - s2 < 3e4, new Promise((e11, t11) => {
              (async () => {
                for (let s3 = 0; s3 < 1 / 0; s3++) try {
                  let t12 = await r10(s3);
                  if (!i2(s3, null, t12)) {
                    e11(t12);
                    return;
                  }
                } catch (e12) {
                  if (!i2(s3, e12)) {
                    t11(e12);
                    return;
                  }
                }
              })();
            }));
          } catch (e11) {
            if (this._debug(t10, "error", e11), tZ(e11)) return { data: { session: null, user: null }, error: e11 };
            throw e11;
          } finally {
            this._debug(t10, "end");
          }
        }
        _isValidSession(e10) {
          return "object" == typeof e10 && null !== e10 && "access_token" in e10 && "refresh_token" in e10 && "expires_at" in e10;
        }
        async _handleProviderSignIn(e10, t10) {
          let r10 = await this._getUrlForProvider(`${this.url}/authorize`, e10, { redirectTo: t10.redirectTo, scopes: t10.scopes, queryParams: t10.queryParams });
          return this._debug("#_handleProviderSignIn()", "provider", e10, "options", t10, "url", r10), rl() && !t10.skipBrowserRedirect && window.location.assign(r10), { data: { provider: e10, url: r10 }, error: null };
        }
        async _recoverAndRefresh() {
          var e10;
          let t10 = "#_recoverAndRefresh()";
          this._debug(t10, "begin");
          try {
            let r10 = await rf(this.storage, this.storageKey);
            if (this._debug(t10, "session from storage", r10), !this._isValidSession(r10)) {
              this._debug(t10, "session is not valid"), null !== r10 && await this._removeSession();
              return;
            }
            let i2 = (null !== (e10 = r10.expires_at) && void 0 !== e10 ? e10 : 1 / 0) * 1e3 - Date.now() < 9e4;
            if (this._debug(t10, `session has${i2 ? "" : " not"} expired with margin of 90000s`), i2) {
              if (this.autoRefreshToken && r10.refresh_token) {
                let { error: e11 } = await this._callRefreshToken(r10.refresh_token);
                e11 && (console.error(e11), t7(e11) || (this._debug(t10, "refresh failed with a non-retryable error, removing the session", e11), await this._removeSession()));
              }
            } else await this._notifyAllSubscribers("SIGNED_IN", r10);
          } catch (e11) {
            this._debug(t10, "error", e11), console.error(e11);
            return;
          } finally {
            this._debug(t10, "end");
          }
        }
        async _callRefreshToken(e10) {
          var t10, r10;
          if (!e10) throw new t3();
          if (this.refreshingDeferred) return this.refreshingDeferred.promise;
          let i2 = `#_callRefreshToken(${e10.substring(0, 5)}...)`;
          this._debug(i2, "begin");
          try {
            this.refreshingDeferred = new rm();
            let { data: t11, error: r11 } = await this._refreshAccessToken(e10);
            if (r11) throw r11;
            if (!t11.session) throw new t3();
            await this._saveSession(t11.session), await this._notifyAllSubscribers("TOKEN_REFRESHED", t11.session);
            let i3 = { session: t11.session, error: null };
            return this.refreshingDeferred.resolve(i3), i3;
          } catch (e11) {
            if (this._debug(i2, "error", e11), tZ(e11)) {
              let r11 = { session: null, error: e11 };
              return t7(e11) || await this._removeSession(), null === (t10 = this.refreshingDeferred) || void 0 === t10 || t10.resolve(r11), r11;
            }
            throw null === (r10 = this.refreshingDeferred) || void 0 === r10 || r10.reject(e11), e11;
          } finally {
            this.refreshingDeferred = null, this._debug(i2, "end");
          }
        }
        async _notifyAllSubscribers(e10, t10, r10 = true) {
          let i2 = `#_notifyAllSubscribers(${e10})`;
          this._debug(i2, "begin", t10, `broadcast = ${r10}`);
          try {
            this.broadcastChannel && r10 && this.broadcastChannel.postMessage({ event: e10, session: t10 });
            let i3 = [], s2 = Array.from(this.stateChangeEmitters.values()).map(async (r11) => {
              try {
                await r11.callback(e10, t10);
              } catch (e11) {
                i3.push(e11);
              }
            });
            if (await Promise.all(s2), i3.length > 0) {
              for (let e11 = 0; e11 < i3.length; e11 += 1) console.error(i3[e11]);
              throw i3[0];
            }
          } finally {
            this._debug(i2, "end");
          }
        }
        async _saveSession(e10) {
          this._debug("#_saveSession()", e10), this.suppressGetSessionWarning = true, await rp(this.storage, this.storageKey, e10);
        }
        async _removeSession() {
          this._debug("#_removeSession()"), await rg(this.storage, this.storageKey), await this._notifyAllSubscribers("SIGNED_OUT", null);
        }
        _removeVisibilityChangedCallback() {
          this._debug("#_removeVisibilityChangedCallback()");
          let e10 = this.visibilityChangedCallback;
          this.visibilityChangedCallback = null;
          try {
            e10 && rl() && (null == window ? void 0 : window.removeEventListener) && window.removeEventListener("visibilitychange", e10);
          } catch (e11) {
            console.error("removing visibilitychange callback failed", e11);
          }
        }
        async _startAutoRefresh() {
          await this._stopAutoRefresh(), this._debug("#_startAutoRefresh()");
          let e10 = setInterval(() => this._autoRefreshTokenTick(), 3e4);
          this.autoRefreshTicker = e10, e10 && "object" == typeof e10 && "function" == typeof e10.unref ? e10.unref() : "undefined" != typeof Deno && "function" == typeof Deno.unrefTimer && Deno.unrefTimer(e10), setTimeout(async () => {
            await this.initializePromise, await this._autoRefreshTokenTick();
          }, 0);
        }
        async _stopAutoRefresh() {
          this._debug("#_stopAutoRefresh()");
          let e10 = this.autoRefreshTicker;
          this.autoRefreshTicker = null, e10 && clearInterval(e10);
        }
        async startAutoRefresh() {
          this._removeVisibilityChangedCallback(), await this._startAutoRefresh();
        }
        async stopAutoRefresh() {
          this._removeVisibilityChangedCallback(), await this._stopAutoRefresh();
        }
        async _autoRefreshTokenTick() {
          this._debug("#_autoRefreshTokenTick()", "begin");
          try {
            await this._acquireLock(0, async () => {
              try {
                let e10 = Date.now();
                try {
                  return await this._useSession(async (t10) => {
                    let { data: { session: r10 } } = t10;
                    if (!r10 || !r10.refresh_token || !r10.expires_at) {
                      this._debug("#_autoRefreshTokenTick()", "no session");
                      return;
                    }
                    let i2 = Math.floor((1e3 * r10.expires_at - e10) / 3e4);
                    this._debug("#_autoRefreshTokenTick()", `access token expires in ${i2} ticks, a tick lasts 30000ms, refresh threshold is 3 ticks`), i2 <= 3 && await this._callRefreshToken(r10.refresh_token);
                  });
                } catch (e11) {
                  console.error("Auto refresh tick failed with error. This is likely a transient error.", e11);
                }
              } finally {
                this._debug("#_autoRefreshTokenTick()", "end");
              }
            });
          } catch (e10) {
            if (e10.isAcquireTimeout || e10 instanceof rG) this._debug("auto refresh token tick lock not available");
            else throw e10;
          }
        }
        async _handleVisibilityChange() {
          if (this._debug("#_handleVisibilityChange()"), !rl() || !(null == window ? void 0 : window.addEventListener)) return this.autoRefreshToken && this.startAutoRefresh(), false;
          try {
            this.visibilityChangedCallback = async () => await this._onVisibilityChanged(false), null == window || window.addEventListener("visibilitychange", this.visibilityChangedCallback), await this._onVisibilityChanged(true);
          } catch (e10) {
            console.error("_handleVisibilityChange", e10);
          }
        }
        async _onVisibilityChanged(e10) {
          let t10 = `#_onVisibilityChanged(${e10})`;
          this._debug(t10, "visibilityState", document.visibilityState), "visible" === document.visibilityState ? (this.autoRefreshToken && this._startAutoRefresh(), e10 || (await this.initializePromise, await this._acquireLock(-1, async () => {
            if ("visible" !== document.visibilityState) {
              this._debug(t10, "acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting");
              return;
            }
            await this._recoverAndRefresh();
          }))) : "hidden" === document.visibilityState && this.autoRefreshToken && this._stopAutoRefresh();
        }
        async _getUrlForProvider(e10, t10, r10) {
          let i2 = [`provider=${encodeURIComponent(t10)}`];
          if ((null == r10 ? void 0 : r10.redirectTo) && i2.push(`redirect_to=${encodeURIComponent(r10.redirectTo)}`), (null == r10 ? void 0 : r10.scopes) && i2.push(`scopes=${encodeURIComponent(r10.scopes)}`), "pkce" === this.flowType) {
            let [e11, t11] = await rS(this.storage, this.storageKey), r11 = new URLSearchParams({ code_challenge: `${encodeURIComponent(e11)}`, code_challenge_method: `${encodeURIComponent(t11)}` });
            i2.push(r11.toString());
          }
          if (null == r10 ? void 0 : r10.queryParams) {
            let e11 = new URLSearchParams(r10.queryParams);
            i2.push(e11.toString());
          }
          return (null == r10 ? void 0 : r10.skipBrowserRedirect) && i2.push(`skip_http_redirect=${r10.skipBrowserRedirect}`), `${e10}?${i2.join("&")}`;
        }
        async _unenroll(e10) {
          try {
            return await this._useSession(async (t10) => {
              var r10;
              let { data: i2, error: s2 } = t10;
              return s2 ? { data: null, error: s2 } : await rj(this.fetch, "DELETE", `${this.url}/factors/${e10.factorId}`, { headers: this.headers, jwt: null === (r10 = null == i2 ? void 0 : i2.session) || void 0 === r10 ? void 0 : r10.access_token });
            });
          } catch (e11) {
            if (tZ(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _enroll(e10) {
          try {
            return await this._useSession(async (t10) => {
              var r10, i2;
              let { data: s2, error: n2 } = t10;
              if (n2) return { data: null, error: n2 };
              let a2 = Object.assign({ friendly_name: e10.friendlyName, factor_type: e10.factorType }, "phone" === e10.factorType ? { phone: e10.phone } : { issuer: e10.issuer }), { data: o2, error: l2 } = await rj(this.fetch, "POST", `${this.url}/factors`, { body: a2, headers: this.headers, jwt: null === (r10 = null == s2 ? void 0 : s2.session) || void 0 === r10 ? void 0 : r10.access_token });
              return l2 ? { data: null, error: l2 } : ("totp" === e10.factorType && (null === (i2 = null == o2 ? void 0 : o2.totp) || void 0 === i2 ? void 0 : i2.qr_code) && (o2.totp.qr_code = `data:image/svg+xml;utf-8,${o2.totp.qr_code}`), { data: o2, error: null });
            });
          } catch (e11) {
            if (tZ(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _verify(e10) {
          return this._acquireLock(-1, async () => {
            try {
              return await this._useSession(async (t10) => {
                var r10;
                let { data: i2, error: s2 } = t10;
                if (s2) return { data: null, error: s2 };
                let { data: n2, error: a2 } = await rj(this.fetch, "POST", `${this.url}/factors/${e10.factorId}/verify`, { body: { code: e10.code, challenge_id: e10.challengeId }, headers: this.headers, jwt: null === (r10 = null == i2 ? void 0 : i2.session) || void 0 === r10 ? void 0 : r10.access_token });
                return a2 ? { data: null, error: a2 } : (await this._saveSession(Object.assign({ expires_at: Math.round(Date.now() / 1e3) + n2.expires_in }, n2)), await this._notifyAllSubscribers("MFA_CHALLENGE_VERIFIED", n2), { data: n2, error: a2 });
              });
            } catch (e11) {
              if (tZ(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        async _challenge(e10) {
          return this._acquireLock(-1, async () => {
            try {
              return await this._useSession(async (t10) => {
                var r10;
                let { data: i2, error: s2 } = t10;
                return s2 ? { data: null, error: s2 } : await rj(this.fetch, "POST", `${this.url}/factors/${e10.factorId}/challenge`, { body: { channel: e10.channel }, headers: this.headers, jwt: null === (r10 = null == i2 ? void 0 : i2.session) || void 0 === r10 ? void 0 : r10.access_token });
              });
            } catch (e11) {
              if (tZ(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        async _challengeAndVerify(e10) {
          let { data: t10, error: r10 } = await this._challenge({ factorId: e10.factorId });
          return r10 ? { data: null, error: r10 } : await this._verify({ factorId: e10.factorId, challengeId: t10.id, code: e10.code });
        }
        async _listFactors() {
          let { data: { user: e10 }, error: t10 } = await this.getUser();
          if (t10) return { data: null, error: t10 };
          let r10 = (null == e10 ? void 0 : e10.factors) || [], i2 = r10.filter((e11) => "totp" === e11.factor_type && "verified" === e11.status), s2 = r10.filter((e11) => "phone" === e11.factor_type && "verified" === e11.status);
          return { data: { all: r10, totp: i2, phone: s2 }, error: null };
        }
        async _getAuthenticatorAssuranceLevel() {
          return this._acquireLock(-1, async () => await this._useSession(async (e10) => {
            var t10, r10;
            let { data: { session: i2 }, error: s2 } = e10;
            if (s2) return { data: null, error: s2 };
            if (!i2) return { data: { currentLevel: null, nextLevel: null, currentAuthenticationMethods: [] }, error: null };
            let { payload: n2 } = rv(i2.access_token), a2 = null;
            n2.aal && (a2 = n2.aal);
            let o2 = a2;
            return (null !== (r10 = null === (t10 = i2.user.factors) || void 0 === t10 ? void 0 : t10.filter((e11) => "verified" === e11.status)) && void 0 !== r10 ? r10 : []).length > 0 && (o2 = "aal2"), { data: { currentLevel: a2, nextLevel: o2, currentAuthenticationMethods: n2.amr || [] }, error: null };
          }));
        }
        async fetchJwk(e10, t10 = { keys: [] }) {
          let r10 = t10.keys.find((t11) => t11.kid === e10);
          if (r10 || (r10 = this.jwks.keys.find((t11) => t11.kid === e10)) && this.jwks_cached_at + 6e5 > Date.now()) return r10;
          let { data: i2, error: s2 } = await rj(this.fetch, "GET", `${this.url}/.well-known/jwks.json`, { headers: this.headers });
          if (s2) throw s2;
          if (!i2.keys || 0 === i2.keys.length) throw new rt("JWKS is empty");
          if (this.jwks = i2, this.jwks_cached_at = Date.now(), !(r10 = i2.keys.find((t11) => t11.kid === e10))) throw new rt("No matching signing key found in JWKS");
          return r10;
        }
        async getClaims(e10, t10 = { keys: [] }) {
          try {
            let r10 = e10;
            if (!r10) {
              let { data: e11, error: t11 } = await this.getSession();
              if (t11 || !e11.session) return { data: null, error: t11 };
              r10 = e11.session.access_token;
            }
            let { header: i2, payload: s2, signature: n2, raw: { header: a2, payload: o2 } } = rv(r10);
            if (!function(e11) {
              if (!e11) throw Error("Missing exp claim");
              if (e11 <= Math.floor(Date.now() / 1e3)) throw Error("JWT has expired");
            }(s2.exp), !i2.kid || "HS256" === i2.alg || !("crypto" in globalThis && "subtle" in globalThis.crypto)) {
              let { error: e11 } = await this.getUser(r10);
              if (e11) throw e11;
              return { data: { claims: s2, header: i2, signature: n2 }, error: null };
            }
            let l2 = function(e11) {
              switch (e11) {
                case "RS256":
                  return { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } };
                case "ES256":
                  return { name: "ECDSA", namedCurve: "P-256", hash: { name: "SHA-256" } };
                default:
                  throw Error("Invalid alg claim");
              }
            }(i2.alg), u2 = await this.fetchJwk(i2.kid, t10), c2 = await crypto.subtle.importKey("jwk", u2, l2, true, ["verify"]);
            if (!await crypto.subtle.verify(l2, c2, n2, function(e11) {
              let t11 = [];
              return function(e12, t12) {
                for (let r11 = 0; r11 < e12.length; r11 += 1) {
                  let i3 = e12.charCodeAt(r11);
                  if (i3 > 55295 && i3 <= 56319) {
                    let t13 = (i3 - 55296) * 1024 & 65535;
                    i3 = (e12.charCodeAt(r11 + 1) - 56320 & 65535 | t13) + 65536, r11 += 1;
                  }
                  !function(e13, t13) {
                    if (e13 <= 127) {
                      t13(e13);
                      return;
                    }
                    if (e13 <= 2047) {
                      t13(192 | e13 >> 6), t13(128 | 63 & e13);
                      return;
                    }
                    if (e13 <= 65535) {
                      t13(224 | e13 >> 12), t13(128 | e13 >> 6 & 63), t13(128 | 63 & e13);
                      return;
                    }
                    if (e13 <= 1114111) {
                      t13(240 | e13 >> 18), t13(128 | e13 >> 12 & 63), t13(128 | e13 >> 6 & 63), t13(128 | 63 & e13);
                      return;
                    }
                    throw Error(`Unrecognized Unicode codepoint: ${e13.toString(16)}`);
                  }(i3, t12);
                }
              }(e11, (e12) => t11.push(e12)), new Uint8Array(t11);
            }(`${a2}.${o2}`))) throw new rt("Invalid JWT signature");
            return { data: { claims: s2, header: i2, signature: n2 }, error: null };
          } catch (e11) {
            if (tZ(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
      }
      rX.nextInstanceID = 0;
      let rY = rX;
      class rQ extends rY {
        constructor(e10) {
          super(e10);
        }
      }
      class rZ {
        constructor(e10, t10, r10) {
          var i2, s2, n2;
          if (this.supabaseUrl = e10, this.supabaseKey = t10, !e10) throw Error("supabaseUrl is required.");
          if (!t10) throw Error("supabaseKey is required.");
          let a2 = new URL(function(e11) {
            return e11.endsWith("/") ? e11 : e11 + "/";
          }(e10));
          this.realtimeUrl = new URL("realtime/v1", a2), this.realtimeUrl.protocol = this.realtimeUrl.protocol.replace("http", "ws"), this.authUrl = new URL("auth/v1", a2), this.storageUrl = new URL("storage/v1", a2), this.functionsUrl = new URL("functions/v1", a2);
          let o2 = `sb-${a2.hostname.split(".")[0]}-auth-token`, l2 = function(e11, t11) {
            var r11, i3;
            let { db: s3, auth: n3, realtime: a3, global: o3 } = e11, { db: l3, auth: u2, realtime: c2, global: h2 } = t11, d2 = { db: Object.assign(Object.assign({}, l3), s3), auth: Object.assign(Object.assign({}, u2), n3), realtime: Object.assign(Object.assign({}, c2), a3), global: Object.assign(Object.assign(Object.assign({}, h2), o3), { headers: Object.assign(Object.assign({}, null !== (r11 = null == h2 ? void 0 : h2.headers) && void 0 !== r11 ? r11 : {}), null !== (i3 = null == o3 ? void 0 : o3.headers) && void 0 !== i3 ? i3 : {}) }), accessToken: () => {
              var e12, t12, r12, i4;
              return e12 = this, t12 = void 0, i4 = function* () {
                return "";
              }, new (r12 = void 0, r12 = Promise)(function(s4, n4) {
                function a4(e13) {
                  try {
                    l4(i4.next(e13));
                  } catch (e14) {
                    n4(e14);
                  }
                }
                function o4(e13) {
                  try {
                    l4(i4.throw(e13));
                  } catch (e14) {
                    n4(e14);
                  }
                }
                function l4(e13) {
                  var t13;
                  e13.done ? s4(e13.value) : ((t13 = e13.value) instanceof r12 ? t13 : new r12(function(e14) {
                    e14(t13);
                  })).then(a4, o4);
                }
                l4((i4 = i4.apply(e12, t12 || [])).next());
              });
            } };
            return e11.accessToken ? d2.accessToken = e11.accessToken : delete d2.accessToken, d2;
          }(null != r10 ? r10 : {}, { db: tq, realtime: tV, auth: Object.assign(Object.assign({}, tB), { storageKey: o2 }), global: tU });
          this.storageKey = null !== (i2 = l2.auth.storageKey) && void 0 !== i2 ? i2 : "", this.headers = null !== (s2 = l2.global.headers) && void 0 !== s2 ? s2 : {}, l2.accessToken ? (this.accessToken = l2.accessToken, this.auth = new Proxy({}, { get: (e11, t11) => {
            throw Error(`@supabase/supabase-js: Supabase Client is configured with the accessToken option, accessing supabase.auth.${String(t11)} is not possible`);
          } })) : this.auth = this._initSupabaseAuthClient(null !== (n2 = l2.auth) && void 0 !== n2 ? n2 : {}, this.headers, l2.global.fetch), this.fetch = tz(t10, this._getAccessToken.bind(this), l2.global.fetch), this.realtime = this._initRealtimeClient(Object.assign({ headers: this.headers, accessToken: this._getAccessToken.bind(this) }, l2.realtime)), this.rest = new eZ(new URL("rest/v1", a2).href, { headers: this.headers, schema: l2.db.schema, fetch: this.fetch }), l2.accessToken || this._listenForAuthEvents();
        }
        get functions() {
          return new eQ(this.functionsUrl.href, { headers: this.headers, customFetch: this.fetch });
        }
        get storage() {
          return new tM(this.storageUrl.href, this.headers, this.fetch);
        }
        from(e10) {
          return this.rest.from(e10);
        }
        schema(e10) {
          return this.rest.schema(e10);
        }
        rpc(e10, t10 = {}, r10 = {}) {
          return this.rest.rpc(e10, t10, r10);
        }
        channel(e10, t10 = { config: {} }) {
          return this.realtime.channel(e10, t10);
        }
        getChannels() {
          return this.realtime.getChannels();
        }
        removeChannel(e10) {
          return this.realtime.removeChannel(e10);
        }
        removeAllChannels() {
          return this.realtime.removeAllChannels();
        }
        _getAccessToken() {
          var e10, t10, r10, i2, s2, n2;
          return r10 = this, i2 = void 0, s2 = void 0, n2 = function* () {
            if (this.accessToken) return yield this.accessToken();
            let { data: r11 } = yield this.auth.getSession();
            return null !== (t10 = null === (e10 = r11.session) || void 0 === e10 ? void 0 : e10.access_token) && void 0 !== t10 ? t10 : null;
          }, new (s2 || (s2 = Promise))(function(e11, t11) {
            function a2(e12) {
              try {
                l2(n2.next(e12));
              } catch (e13) {
                t11(e13);
              }
            }
            function o2(e12) {
              try {
                l2(n2.throw(e12));
              } catch (e13) {
                t11(e13);
              }
            }
            function l2(t12) {
              var r11;
              t12.done ? e11(t12.value) : ((r11 = t12.value) instanceof s2 ? r11 : new s2(function(e12) {
                e12(r11);
              })).then(a2, o2);
            }
            l2((n2 = n2.apply(r10, i2 || [])).next());
          });
        }
        _initSupabaseAuthClient({ autoRefreshToken: e10, persistSession: t10, detectSessionInUrl: r10, storage: i2, storageKey: s2, flowType: n2, lock: a2, debug: o2 }, l2, u2) {
          let c2 = { Authorization: `Bearer ${this.supabaseKey}`, apikey: `${this.supabaseKey}` };
          return new rQ({ url: this.authUrl.href, headers: Object.assign(Object.assign({}, c2), l2), storageKey: s2, autoRefreshToken: e10, persistSession: t10, detectSessionInUrl: r10, storage: i2, flowType: n2, lock: a2, debug: o2, fetch: u2, hasCustomAuthorizationHeader: "Authorization" in this.headers });
        }
        _initRealtimeClient(e10) {
          return new tp(this.realtimeUrl.href, Object.assign(Object.assign({}, e10), { params: Object.assign({ apikey: this.supabaseKey }, null == e10 ? void 0 : e10.params) }));
        }
        _listenForAuthEvents() {
          return this.auth.onAuthStateChange((e10, t10) => {
            this._handleTokenChanged(e10, "CLIENT", null == t10 ? void 0 : t10.access_token);
          });
        }
        _handleTokenChanged(e10, t10, r10) {
          ("TOKEN_REFRESHED" === e10 || "SIGNED_IN" === e10) && this.changedAccessToken !== r10 ? this.changedAccessToken = r10 : "SIGNED_OUT" === e10 && (this.realtime.setAuth(), "STORAGE" == t10 && this.auth.signOut(), this.changedAccessToken = void 0);
        }
      }
      let r0 = (e10, t10, r10) => new rZ(e10, t10, r10);
      var r1 = r(635);
      let r2 = ["/signin", "/signup", "/auth/callback", "/auth/confirm"], r3 = ["/manage-sites"], r6 = async (e10) => {
        try {
          let t10 = r1.NextResponse.next({ request: { headers: e10.headers } }), r10 = function(e11, t11, r11) {
            if (!e11 || !t11) throw Error(`Your project's URL and Key are required to create a Supabase client!

Check your Supabase project's API settings to find these values

https://supabase.com/dashboard/project/_/settings/api`);
            let { storage: i3, getAll: s3, setAll: n3, setItems: a2, removedItems: o2 } = function(e12, t12) {
              let r12, i4;
              let s4 = e12.cookies ?? null, n4 = e12.cookieEncoding, a3 = {}, o3 = {};
              if (s4) {
                if ("get" in s4) {
                  let e13 = async (e14) => {
                    let t13 = e14.flatMap((e15) => [e15, ...Array.from({ length: 5 }).map((t14, r14) => `${e15}.${r14}`)]), r13 = [];
                    for (let e15 = 0; e15 < t13.length; e15 += 1) {
                      let i5 = await s4.get(t13[e15]);
                      (i5 || "string" == typeof i5) && r13.push({ name: t13[e15], value: i5 });
                    }
                    return r13;
                  };
                  if (r12 = async (t13) => await e13(t13), "set" in s4 && "remove" in s4) i4 = async (e14) => {
                    for (let t13 = 0; t13 < e14.length; t13 += 1) {
                      let { name: r13, value: i5, options: n5 } = e14[t13];
                      i5 ? await s4.set(r13, i5, n5) : await s4.remove(r13, n5);
                    }
                  };
                  else if (t12) i4 = async () => {
                    console.warn("@supabase/ssr: createServerClient was configured without set and remove cookie methods, but the client needs to set cookies. This can lead to issues such as random logouts, early session termination or increased token refresh requests. If in NextJS, check your middleware.ts file, route handlers and server actions for correctness. Consider switching to the getAll and setAll cookie methods instead of get, set and remove which are deprecated and can be difficult to use correctly.");
                  };
                  else throw Error("@supabase/ssr: createBrowserClient requires configuring a getAll and setAll cookie method (deprecated: alternatively both get, set and remove can be used)");
                } else if ("getAll" in s4) {
                  if (r12 = async () => await s4.getAll(), "setAll" in s4) i4 = s4.setAll;
                  else if (t12) i4 = async () => {
                    console.warn("@supabase/ssr: createServerClient was configured without the setAll cookie method, but the client needs to set cookies. This can lead to issues such as random logouts, early session termination or increased token refresh requests. If in NextJS, check your middleware.ts file, route handlers and server actions for correctness.");
                  };
                  else throw Error("@supabase/ssr: createBrowserClient requires configuring both getAll and setAll cookie methods (deprecated: alternatively both get, set and remove can be used)");
                } else throw Error(`@supabase/ssr: ${t12 ? "createServerClient" : "createBrowserClient"} requires configuring getAll and setAll cookie methods (deprecated: alternatively use get, set and remove).${eN() ? " As this is called in a browser runtime, consider removing the cookies option object to use the document.cookie API automatically." : ""}`);
              } else if (!t12 && eN()) {
                let e13 = () => {
                  let e14 = (0, eI.Qc)(document.cookie);
                  return Object.keys(e14).map((t13) => ({ name: t13, value: e14[t13] ?? "" }));
                };
                r12 = () => e13(), i4 = (e14) => {
                  e14.forEach(({ name: e15, value: t13, options: r13 }) => {
                    document.cookie = (0, eI.qC)(e15, t13, r13);
                  });
                };
              } else if (t12) throw Error("@supabase/ssr: createServerClient must be initialized with cookie options that specify getAll and setAll functions (deprecated, not recommended: alternatively use get, set and remove)");
              else r12 = () => [], i4 = () => {
                throw Error("@supabase/ssr: createBrowserClient in non-browser runtimes (including Next.js pre-rendering mode) was not initialized cookie options that specify getAll and setAll functions (deprecated: alternatively use get, set and remove), but they were needed");
              };
              return t12 ? { getAll: r12, setAll: i4, setItems: a3, removedItems: o3, storage: { isServer: true, getItem: async (e13) => {
                if ("string" == typeof a3[e13]) return a3[e13];
                if (o3[e13]) return null;
                let t13 = await r12([e13]), i5 = await eU(e13, async (e14) => {
                  let r13 = t13?.find(({ name: t14 }) => t14 === e14) || null;
                  return r13 ? r13.value : null;
                });
                if (!i5) return null;
                let s5 = i5;
                return "string" == typeof i5 && i5.startsWith(eG) && (s5 = eH(i5.substring(eG.length))), s5;
              }, setItem: async (t13, s5) => {
                t13.endsWith("-code-verifier") && await ez({ getAll: r12, setAll: i4, setItems: { [t13]: s5 }, removedItems: {} }, { cookieOptions: e12?.cookieOptions ?? null, cookieEncoding: n4 }), a3[t13] = s5, delete o3[t13];
              }, removeItem: async (e13) => {
                delete a3[e13], o3[e13] = true;
              } } } : { getAll: r12, setAll: i4, setItems: a3, removedItems: o3, storage: { isServer: false, getItem: async (e13) => {
                let t13 = await r12([e13]), i5 = await eU(e13, async (e14) => {
                  let r13 = t13?.find(({ name: t14 }) => t14 === e14) || null;
                  return r13 ? r13.value : null;
                });
                if (!i5) return null;
                let s5 = i5;
                return i5.startsWith(eG) && (s5 = eH(i5.substring(eG.length))), s5;
              }, setItem: async (t13, s5) => {
                let a4 = await r12([t13]), o4 = new Set((a4?.map(({ name: e13 }) => e13) || []).filter((e13) => eM(e13, t13))), l3 = s5;
                "base64url" === n4 && (l3 = eG + eF(s5));
                let u2 = eD(t13, l3);
                u2.forEach(({ name: e13 }) => {
                  o4.delete(e13);
                });
                let c2 = { ...eL, ...e12?.cookieOptions, maxAge: 0 }, h2 = { ...eL, ...e12?.cookieOptions, maxAge: eL.maxAge };
                delete c2.name, delete h2.name;
                let d2 = [...[...o4].map((e13) => ({ name: e13, value: "", options: c2 })), ...u2.map(({ name: e13, value: t14 }) => ({ name: e13, value: t14, options: h2 }))];
                d2.length > 0 && await i4(d2);
              }, removeItem: async (t13) => {
                let s5 = await r12([t13]), n5 = (s5?.map(({ name: e13 }) => e13) || []).filter((e13) => eM(e13, t13)), a4 = { ...eL, ...e12?.cookieOptions, maxAge: 0 };
                delete a4.name, n5.length > 0 && await i4(n5.map((e13) => ({ name: e13, value: "", options: a4 })));
              } } };
            }({ ...r11, cookieEncoding: r11?.cookieEncoding ?? "base64url" }, true), l2 = r0(e11, t11, { ...r11, global: { ...r11?.global, headers: { ...r11?.global?.headers, "X-Client-Info": "supabase-ssr/0.6.1 createServerClient" } }, auth: { ...r11?.cookieOptions?.name ? { storageKey: r11.cookieOptions.name } : null, ...r11?.auth, flowType: "pkce", autoRefreshToken: false, detectSessionInUrl: false, persistSession: true, storage: i3 } });
            return l2.auth.onAuthStateChange(async (e12) => {
              (Object.keys(a2).length > 0 || Object.keys(o2).length > 0) && ("SIGNED_IN" === e12 || "TOKEN_REFRESHED" === e12 || "USER_UPDATED" === e12 || "PASSWORD_RECOVERY" === e12 || "SIGNED_OUT" === e12 || "MFA_CHALLENGE_VERIFIED" === e12) && await ez({ getAll: s3, setAll: n3, setItems: a2, removedItems: o2 }, { cookieOptions: r11?.cookieOptions ?? null, cookieEncoding: r11?.cookieEncoding ?? "base64url" });
            }), l2;
          }("https://rkrkpchutofbpyqvniqq.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrcmtwY2h1dG9mYnB5cXZuaXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NjQxMDEsImV4cCI6MjA2ODI0MDEwMX0.ZwRskqebH9S5St7QH3d4-fhQ8u4MzBng6bWYA0MlQnw", { cookies: { getAll: () => e10.cookies.getAll(), setAll(r11) {
            r11.forEach(({ name: t11, value: r12 }) => e10.cookies.set(t11, r12)), t10 = r1.NextResponse.next({ request: e10 }), r11.forEach(({ name: e11, value: r12, options: i3 }) => t10.cookies.set(e11, r12, i3));
          } } }), { data: { user: i2 }, error: s2 } = await r10.auth.getUser(), n2 = e10.nextUrl.pathname;
          if (r3.some((e11) => n2.startsWith(e11)) && (s2 || !i2)) {
            let t11 = new URL("/signin", e10.url);
            return t11.searchParams.set("redirectTo", n2), r1.NextResponse.redirect(t11);
          }
          if (r2.some((e11) => n2.startsWith(e11)) && i2) return r1.NextResponse.redirect(new URL("/", e10.url));
          return t10;
        } catch (e11) {
          return console.error("Middleware error:", e11), new r1.NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500, headers: { "Content-Type": "application/json" } });
        }
      };
      var r4 = r(858);
      let r5 = [{ parameter: "device", defaultValue: "desktop", routeSpecificTransformations: { "/heatmap": { all: "desktop" } }, routes: { include: ["/(data)", "/heatmap", "/dashboard"] }, routeSpecificDefaults: { "/dashboard": "all" } }, { parameter: "url", defaultValue: "", routes: { include: ["/(data)", "/heatmap", "/dashboard"] }, routeSpecificDefaults: { "/dashboard": "all" } }], r8 = (0, r4.createI18nMiddleware)({ locales: ["en", "fr"], defaultLocale: "en", urlMappingStrategy: "rewrite" });
      async function r9(e10) {
        let t10 = await r6(e10);
        return 200 !== t10.status ? t10 : function(e11) {
          let { pathname: t11, searchParams: r10 } = e11.nextUrl, i2 = new URLSearchParams(r10.toString()), s2 = false;
          for (let e12 of r5) {
            if (e12.routes?.exclude && e12.routes.exclude.some((e13) => t11.includes(e13)) || e12.routes?.include && !e12.routes.include.some((e13) => t11.includes(e13))) continue;
            let r11 = e12.defaultValue;
            if (e12.routeSpecificDefaults) {
              for (let [i3, s3] of Object.entries(e12.routeSpecificDefaults)) if (t11.includes(i3)) {
                r11 = s3;
                break;
              }
            }
            if (i2.has(e12.parameter)) {
              let r12 = i2.get(e12.parameter);
              if (e12.routeSpecificTransformations && r12) {
                for (let [n2, a2] of Object.entries(e12.routeSpecificTransformations)) if (t11.includes(n2) && a2[r12]) {
                  let t12 = a2[r12];
                  i2.set(e12.parameter, t12), s2 = true;
                  break;
                }
              } else if (e12.transformations && r12 && e12.transformations[r12]) {
                let t12 = e12.transformations[r12];
                i2.set(e12.parameter, t12), s2 = true;
              }
            } else i2.set(e12.parameter, r11), s2 = true;
          }
          if (s2) {
            let t12 = new URL(e11.url);
            return t12.search = i2.toString(), r1.NextResponse.redirect(t12);
          }
          return null;
        }(e10) || r8(e10);
      }
      let r7 = { matcher: ["/((?!_next/static|_next/image|favicon\\.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|js)$).*)"] }, ie = { ...E }, it = ie.middleware || ie.default, ir = "/src/middleware";
      if ("function" != typeof it) throw Error(`The Middleware "${ir}" must export a \`middleware\` or a \`default\` function`);
      function ii(e10) {
        return eA({ ...e10, page: ir, handler: it });
      }
    }, 254: (e, t, r) => {
      "use strict";
      r.r(t), r.d(t, { Headers: () => a, Request: () => o, Response: () => l, default: () => n, fetch: () => s });
      var i = function() {
        if ("undefined" != typeof self) return self;
        if ("undefined" != typeof window) return window;
        if (void 0 !== r.g) return r.g;
        throw Error("unable to locate global object");
      }();
      let s = i.fetch, n = i.fetch.bind(i), a = i.Headers, o = i.Request, l = i.Response;
    }, 22: function(e, t, r) {
      "use strict";
      var i = this && this.__importDefault || function(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      };
      Object.defineProperty(t, "__esModule", { value: true });
      let s = i(r(254)), n = i(r(335));
      class a {
        constructor(e2) {
          var t2, r2;
          this.shouldThrowOnError = false, this.method = e2.method, this.url = e2.url, this.headers = new Headers(e2.headers), this.schema = e2.schema, this.body = e2.body, this.shouldThrowOnError = null !== (t2 = e2.shouldThrowOnError) && void 0 !== t2 && t2, this.signal = e2.signal, this.isMaybeSingle = null !== (r2 = e2.isMaybeSingle) && void 0 !== r2 && r2, e2.fetch ? this.fetch = e2.fetch : "undefined" == typeof fetch ? this.fetch = s.default : this.fetch = fetch;
        }
        throwOnError() {
          return this.shouldThrowOnError = true, this;
        }
        setHeader(e2, t2) {
          return this.headers = new Headers(this.headers), this.headers.set(e2, t2), this;
        }
        then(e2, t2) {
          void 0 === this.schema || (["GET", "HEAD"].includes(this.method) ? this.headers.set("Accept-Profile", this.schema) : this.headers.set("Content-Profile", this.schema)), "GET" !== this.method && "HEAD" !== this.method && this.headers.set("Content-Type", "application/json");
          let r2 = (0, this.fetch)(this.url.toString(), { method: this.method, headers: this.headers, body: JSON.stringify(this.body), signal: this.signal }).then(async (e3) => {
            var t3, r3, i2, s2;
            let a2 = null, o = null, l = null, u = e3.status, c = e3.statusText;
            if (e3.ok) {
              if ("HEAD" !== this.method) {
                let r4 = await e3.text();
                "" === r4 || (o = "text/csv" === this.headers.get("Accept") ? r4 : this.headers.get("Accept") && (null === (t3 = this.headers.get("Accept")) || void 0 === t3 ? void 0 : t3.includes("application/vnd.pgrst.plan+text")) ? r4 : JSON.parse(r4));
              }
              let s3 = null === (r3 = this.headers.get("Prefer")) || void 0 === r3 ? void 0 : r3.match(/count=(exact|planned|estimated)/), n2 = null === (i2 = e3.headers.get("content-range")) || void 0 === i2 ? void 0 : i2.split("/");
              s3 && n2 && n2.length > 1 && (l = parseInt(n2[1])), this.isMaybeSingle && "GET" === this.method && Array.isArray(o) && (o.length > 1 ? (a2 = { code: "PGRST116", details: `Results contain ${o.length} rows, application/vnd.pgrst.object+json requires 1 row`, hint: null, message: "JSON object requested, multiple (or no) rows returned" }, o = null, l = null, u = 406, c = "Not Acceptable") : o = 1 === o.length ? o[0] : null);
            } else {
              let t4 = await e3.text();
              try {
                a2 = JSON.parse(t4), Array.isArray(a2) && 404 === e3.status && (o = [], a2 = null, u = 200, c = "OK");
              } catch (r4) {
                404 === e3.status && "" === t4 ? (u = 204, c = "No Content") : a2 = { message: t4 };
              }
              if (a2 && this.isMaybeSingle && (null === (s2 = null == a2 ? void 0 : a2.details) || void 0 === s2 ? void 0 : s2.includes("0 rows")) && (a2 = null, u = 200, c = "OK"), a2 && this.shouldThrowOnError) throw new n.default(a2);
            }
            return { error: a2, data: o, count: l, status: u, statusText: c };
          });
          return this.shouldThrowOnError || (r2 = r2.catch((e3) => {
            var t3, r3, i2;
            return { error: { message: `${null !== (t3 = null == e3 ? void 0 : e3.name) && void 0 !== t3 ? t3 : "FetchError"}: ${null == e3 ? void 0 : e3.message}`, details: `${null !== (r3 = null == e3 ? void 0 : e3.stack) && void 0 !== r3 ? r3 : ""}`, hint: "", code: `${null !== (i2 = null == e3 ? void 0 : e3.code) && void 0 !== i2 ? i2 : ""}` }, data: null, count: null, status: 0, statusText: "" };
          })), r2.then(e2, t2);
        }
        returns() {
          return this;
        }
        overrideTypes() {
          return this;
        }
      }
      t.default = a;
    }, 191: function(e, t, r) {
      "use strict";
      var i = this && this.__importDefault || function(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      };
      Object.defineProperty(t, "__esModule", { value: true });
      let s = i(r(210)), n = i(r(401));
      class a {
        constructor(e2, { headers: t2 = {}, schema: r2, fetch: i2 } = {}) {
          this.url = e2, this.headers = new Headers(t2), this.schemaName = r2, this.fetch = i2;
        }
        from(e2) {
          let t2 = new URL(`${this.url}/${e2}`);
          return new s.default(t2, { headers: new Headers(this.headers), schema: this.schemaName, fetch: this.fetch });
        }
        schema(e2) {
          return new a(this.url, { headers: this.headers, schema: e2, fetch: this.fetch });
        }
        rpc(e2, t2 = {}, { head: r2 = false, get: i2 = false, count: s2 } = {}) {
          var a2;
          let o, l;
          let u = new URL(`${this.url}/rpc/${e2}`);
          r2 || i2 ? (o = r2 ? "HEAD" : "GET", Object.entries(t2).filter(([e3, t3]) => void 0 !== t3).map(([e3, t3]) => [e3, Array.isArray(t3) ? `{${t3.join(",")}}` : `${t3}`]).forEach(([e3, t3]) => {
            u.searchParams.append(e3, t3);
          })) : (o = "POST", l = t2);
          let c = new Headers(this.headers);
          return s2 && c.set("Prefer", `count=${s2}`), new n.default({ method: o, url: u, headers: c, schema: this.schemaName, body: l, fetch: null !== (a2 = this.fetch) && void 0 !== a2 ? a2 : fetch });
        }
      }
      t.default = a;
    }, 335: (e, t) => {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: true });
      class r extends Error {
        constructor(e2) {
          super(e2.message), this.name = "PostgrestError", this.details = e2.details, this.hint = e2.hint, this.code = e2.code;
        }
      }
      t.default = r;
    }, 401: function(e, t, r) {
      "use strict";
      var i = this && this.__importDefault || function(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      };
      Object.defineProperty(t, "__esModule", { value: true });
      let s = i(r(251));
      class n extends s.default {
        eq(e2, t2) {
          return this.url.searchParams.append(e2, `eq.${t2}`), this;
        }
        neq(e2, t2) {
          return this.url.searchParams.append(e2, `neq.${t2}`), this;
        }
        gt(e2, t2) {
          return this.url.searchParams.append(e2, `gt.${t2}`), this;
        }
        gte(e2, t2) {
          return this.url.searchParams.append(e2, `gte.${t2}`), this;
        }
        lt(e2, t2) {
          return this.url.searchParams.append(e2, `lt.${t2}`), this;
        }
        lte(e2, t2) {
          return this.url.searchParams.append(e2, `lte.${t2}`), this;
        }
        like(e2, t2) {
          return this.url.searchParams.append(e2, `like.${t2}`), this;
        }
        likeAllOf(e2, t2) {
          return this.url.searchParams.append(e2, `like(all).{${t2.join(",")}}`), this;
        }
        likeAnyOf(e2, t2) {
          return this.url.searchParams.append(e2, `like(any).{${t2.join(",")}}`), this;
        }
        ilike(e2, t2) {
          return this.url.searchParams.append(e2, `ilike.${t2}`), this;
        }
        ilikeAllOf(e2, t2) {
          return this.url.searchParams.append(e2, `ilike(all).{${t2.join(",")}}`), this;
        }
        ilikeAnyOf(e2, t2) {
          return this.url.searchParams.append(e2, `ilike(any).{${t2.join(",")}}`), this;
        }
        is(e2, t2) {
          return this.url.searchParams.append(e2, `is.${t2}`), this;
        }
        in(e2, t2) {
          let r2 = Array.from(new Set(t2)).map((e3) => "string" == typeof e3 && RegExp("[,()]").test(e3) ? `"${e3}"` : `${e3}`).join(",");
          return this.url.searchParams.append(e2, `in.(${r2})`), this;
        }
        contains(e2, t2) {
          return "string" == typeof t2 ? this.url.searchParams.append(e2, `cs.${t2}`) : Array.isArray(t2) ? this.url.searchParams.append(e2, `cs.{${t2.join(",")}}`) : this.url.searchParams.append(e2, `cs.${JSON.stringify(t2)}`), this;
        }
        containedBy(e2, t2) {
          return "string" == typeof t2 ? this.url.searchParams.append(e2, `cd.${t2}`) : Array.isArray(t2) ? this.url.searchParams.append(e2, `cd.{${t2.join(",")}}`) : this.url.searchParams.append(e2, `cd.${JSON.stringify(t2)}`), this;
        }
        rangeGt(e2, t2) {
          return this.url.searchParams.append(e2, `sr.${t2}`), this;
        }
        rangeGte(e2, t2) {
          return this.url.searchParams.append(e2, `nxl.${t2}`), this;
        }
        rangeLt(e2, t2) {
          return this.url.searchParams.append(e2, `sl.${t2}`), this;
        }
        rangeLte(e2, t2) {
          return this.url.searchParams.append(e2, `nxr.${t2}`), this;
        }
        rangeAdjacent(e2, t2) {
          return this.url.searchParams.append(e2, `adj.${t2}`), this;
        }
        overlaps(e2, t2) {
          return "string" == typeof t2 ? this.url.searchParams.append(e2, `ov.${t2}`) : this.url.searchParams.append(e2, `ov.{${t2.join(",")}}`), this;
        }
        textSearch(e2, t2, { config: r2, type: i2 } = {}) {
          let s2 = "";
          "plain" === i2 ? s2 = "pl" : "phrase" === i2 ? s2 = "ph" : "websearch" === i2 && (s2 = "w");
          let n2 = void 0 === r2 ? "" : `(${r2})`;
          return this.url.searchParams.append(e2, `${s2}fts${n2}.${t2}`), this;
        }
        match(e2) {
          return Object.entries(e2).forEach(([e3, t2]) => {
            this.url.searchParams.append(e3, `eq.${t2}`);
          }), this;
        }
        not(e2, t2, r2) {
          return this.url.searchParams.append(e2, `not.${t2}.${r2}`), this;
        }
        or(e2, { foreignTable: t2, referencedTable: r2 = t2 } = {}) {
          let i2 = r2 ? `${r2}.or` : "or";
          return this.url.searchParams.append(i2, `(${e2})`), this;
        }
        filter(e2, t2, r2) {
          return this.url.searchParams.append(e2, `${t2}.${r2}`), this;
        }
      }
      t.default = n;
    }, 210: function(e, t, r) {
      "use strict";
      var i = this && this.__importDefault || function(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      };
      Object.defineProperty(t, "__esModule", { value: true });
      let s = i(r(401));
      class n {
        constructor(e2, { headers: t2 = {}, schema: r2, fetch: i2 }) {
          this.url = e2, this.headers = new Headers(t2), this.schema = r2, this.fetch = i2;
        }
        select(e2, { head: t2 = false, count: r2 } = {}) {
          let i2 = false, n2 = (null != e2 ? e2 : "*").split("").map((e3) => /\s/.test(e3) && !i2 ? "" : ('"' === e3 && (i2 = !i2), e3)).join("");
          return this.url.searchParams.set("select", n2), r2 && this.headers.append("Prefer", `count=${r2}`), new s.default({ method: t2 ? "HEAD" : "GET", url: this.url, headers: this.headers, schema: this.schema, fetch: this.fetch });
        }
        insert(e2, { count: t2, defaultToNull: r2 = true } = {}) {
          var i2;
          if (t2 && this.headers.append("Prefer", `count=${t2}`), r2 || this.headers.append("Prefer", "missing=default"), Array.isArray(e2)) {
            let t3 = e2.reduce((e3, t4) => e3.concat(Object.keys(t4)), []);
            if (t3.length > 0) {
              let e3 = [...new Set(t3)].map((e4) => `"${e4}"`);
              this.url.searchParams.set("columns", e3.join(","));
            }
          }
          return new s.default({ method: "POST", url: this.url, headers: this.headers, schema: this.schema, body: e2, fetch: null !== (i2 = this.fetch) && void 0 !== i2 ? i2 : fetch });
        }
        upsert(e2, { onConflict: t2, ignoreDuplicates: r2 = false, count: i2, defaultToNull: n2 = true } = {}) {
          var a;
          if (this.headers.append("Prefer", `resolution=${r2 ? "ignore" : "merge"}-duplicates`), void 0 !== t2 && this.url.searchParams.set("on_conflict", t2), i2 && this.headers.append("Prefer", `count=${i2}`), n2 || this.headers.append("Prefer", "missing=default"), Array.isArray(e2)) {
            let t3 = e2.reduce((e3, t4) => e3.concat(Object.keys(t4)), []);
            if (t3.length > 0) {
              let e3 = [...new Set(t3)].map((e4) => `"${e4}"`);
              this.url.searchParams.set("columns", e3.join(","));
            }
          }
          return new s.default({ method: "POST", url: this.url, headers: this.headers, schema: this.schema, body: e2, fetch: null !== (a = this.fetch) && void 0 !== a ? a : fetch });
        }
        update(e2, { count: t2 } = {}) {
          var r2;
          return t2 && this.headers.append("Prefer", `count=${t2}`), new s.default({ method: "PATCH", url: this.url, headers: this.headers, schema: this.schema, body: e2, fetch: null !== (r2 = this.fetch) && void 0 !== r2 ? r2 : fetch });
        }
        delete({ count: e2 } = {}) {
          var t2;
          return e2 && this.headers.append("Prefer", `count=${e2}`), new s.default({ method: "DELETE", url: this.url, headers: this.headers, schema: this.schema, fetch: null !== (t2 = this.fetch) && void 0 !== t2 ? t2 : fetch });
        }
      }
      t.default = n;
    }, 251: function(e, t, r) {
      "use strict";
      var i = this && this.__importDefault || function(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      };
      Object.defineProperty(t, "__esModule", { value: true });
      let s = i(r(22));
      class n extends s.default {
        select(e2) {
          let t2 = false, r2 = (null != e2 ? e2 : "*").split("").map((e3) => /\s/.test(e3) && !t2 ? "" : ('"' === e3 && (t2 = !t2), e3)).join("");
          return this.url.searchParams.set("select", r2), this.headers.append("Prefer", "return=representation"), this;
        }
        order(e2, { ascending: t2 = true, nullsFirst: r2, foreignTable: i2, referencedTable: s2 = i2 } = {}) {
          let n2 = s2 ? `${s2}.order` : "order", a = this.url.searchParams.get(n2);
          return this.url.searchParams.set(n2, `${a ? `${a},` : ""}${e2}.${t2 ? "asc" : "desc"}${void 0 === r2 ? "" : r2 ? ".nullsfirst" : ".nullslast"}`), this;
        }
        limit(e2, { foreignTable: t2, referencedTable: r2 = t2 } = {}) {
          let i2 = void 0 === r2 ? "limit" : `${r2}.limit`;
          return this.url.searchParams.set(i2, `${e2}`), this;
        }
        range(e2, t2, { foreignTable: r2, referencedTable: i2 = r2 } = {}) {
          let s2 = void 0 === i2 ? "offset" : `${i2}.offset`, n2 = void 0 === i2 ? "limit" : `${i2}.limit`;
          return this.url.searchParams.set(s2, `${e2}`), this.url.searchParams.set(n2, `${t2 - e2 + 1}`), this;
        }
        abortSignal(e2) {
          return this.signal = e2, this;
        }
        single() {
          return this.headers.set("Accept", "application/vnd.pgrst.object+json"), this;
        }
        maybeSingle() {
          return "GET" === this.method ? this.headers.set("Accept", "application/json") : this.headers.set("Accept", "application/vnd.pgrst.object+json"), this.isMaybeSingle = true, this;
        }
        csv() {
          return this.headers.set("Accept", "text/csv"), this;
        }
        geojson() {
          return this.headers.set("Accept", "application/geo+json"), this;
        }
        explain({ analyze: e2 = false, verbose: t2 = false, settings: r2 = false, buffers: i2 = false, wal: s2 = false, format: n2 = "text" } = {}) {
          var a;
          let o = [e2 ? "analyze" : null, t2 ? "verbose" : null, r2 ? "settings" : null, i2 ? "buffers" : null, s2 ? "wal" : null].filter(Boolean).join("|"), l = null !== (a = this.headers.get("Accept")) && void 0 !== a ? a : "application/json";
          return this.headers.set("Accept", `application/vnd.pgrst.plan+${n2}; for="${l}"; options=${o};`), this;
        }
        rollback() {
          return this.headers.append("Prefer", "tx=rollback"), this;
        }
        returns() {
          return this;
        }
        maxAffected(e2) {
          return this.headers.append("Prefer", "handling=strict"), this.headers.append("Prefer", `max-affected=${e2}`), this;
        }
      }
      t.default = n;
    }, 690: function(e, t, r) {
      "use strict";
      var i = this && this.__importDefault || function(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      };
      Object.defineProperty(t, "__esModule", { value: true }), t.PostgrestError = t.PostgrestBuilder = t.PostgrestTransformBuilder = t.PostgrestFilterBuilder = t.PostgrestQueryBuilder = t.PostgrestClient = void 0;
      let s = i(r(191));
      t.PostgrestClient = s.default;
      let n = i(r(210));
      t.PostgrestQueryBuilder = n.default;
      let a = i(r(401));
      t.PostgrestFilterBuilder = a.default;
      let o = i(r(251));
      t.PostgrestTransformBuilder = o.default;
      let l = i(r(22));
      t.PostgrestBuilder = l.default;
      let u = i(r(335));
      t.PostgrestError = u.default, t.default = { PostgrestClient: s.default, PostgrestQueryBuilder: n.default, PostgrestFilterBuilder: a.default, PostgrestTransformBuilder: o.default, PostgrestBuilder: l.default, PostgrestError: u.default };
    }, 322: (e, t) => {
      "use strict";
      t.Qc = function(e2, t2) {
        let r2 = new o(), i2 = e2.length;
        if (i2 < 2) return r2;
        let s2 = t2?.decode || c, n2 = 0;
        do {
          let t3 = e2.indexOf("=", n2);
          if (-1 === t3) break;
          let a2 = e2.indexOf(";", n2), o2 = -1 === a2 ? i2 : a2;
          if (t3 > o2) {
            n2 = e2.lastIndexOf(";", t3 - 1) + 1;
            continue;
          }
          let c2 = l(e2, n2, t3), h = u(e2, t3, c2), d = e2.slice(c2, h);
          if (void 0 === r2[d]) {
            let i3 = l(e2, t3 + 1, o2), n3 = u(e2, o2, i3), a3 = s2(e2.slice(i3, n3));
            r2[d] = a3;
          }
          n2 = o2 + 1;
        } while (n2 < i2);
        return r2;
      }, t.qC = function(e2, t2, o2) {
        let l2 = o2?.encode || encodeURIComponent;
        if (!r.test(e2)) throw TypeError(`argument name is invalid: ${e2}`);
        let u2 = l2(t2);
        if (!i.test(u2)) throw TypeError(`argument val is invalid: ${t2}`);
        let c2 = e2 + "=" + u2;
        if (!o2) return c2;
        if (void 0 !== o2.maxAge) {
          if (!Number.isInteger(o2.maxAge)) throw TypeError(`option maxAge is invalid: ${o2.maxAge}`);
          c2 += "; Max-Age=" + o2.maxAge;
        }
        if (o2.domain) {
          if (!s.test(o2.domain)) throw TypeError(`option domain is invalid: ${o2.domain}`);
          c2 += "; Domain=" + o2.domain;
        }
        if (o2.path) {
          if (!n.test(o2.path)) throw TypeError(`option path is invalid: ${o2.path}`);
          c2 += "; Path=" + o2.path;
        }
        if (o2.expires) {
          var h;
          if (h = o2.expires, "[object Date]" !== a.call(h) || !Number.isFinite(o2.expires.valueOf())) throw TypeError(`option expires is invalid: ${o2.expires}`);
          c2 += "; Expires=" + o2.expires.toUTCString();
        }
        if (o2.httpOnly && (c2 += "; HttpOnly"), o2.secure && (c2 += "; Secure"), o2.partitioned && (c2 += "; Partitioned"), o2.priority) switch ("string" == typeof o2.priority ? o2.priority.toLowerCase() : void 0) {
          case "low":
            c2 += "; Priority=Low";
            break;
          case "medium":
            c2 += "; Priority=Medium";
            break;
          case "high":
            c2 += "; Priority=High";
            break;
          default:
            throw TypeError(`option priority is invalid: ${o2.priority}`);
        }
        if (o2.sameSite) switch ("string" == typeof o2.sameSite ? o2.sameSite.toLowerCase() : o2.sameSite) {
          case true:
          case "strict":
            c2 += "; SameSite=Strict";
            break;
          case "lax":
            c2 += "; SameSite=Lax";
            break;
          case "none":
            c2 += "; SameSite=None";
            break;
          default:
            throw TypeError(`option sameSite is invalid: ${o2.sameSite}`);
        }
        return c2;
      };
      let r = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/, i = /^[\u0021-\u003A\u003C-\u007E]*$/, s = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i, n = /^[\u0020-\u003A\u003D-\u007E]*$/, a = Object.prototype.toString, o = (() => {
        let e2 = function() {
        };
        return e2.prototype = /* @__PURE__ */ Object.create(null), e2;
      })();
      function l(e2, t2, r2) {
        do {
          let r3 = e2.charCodeAt(t2);
          if (32 !== r3 && 9 !== r3) return t2;
        } while (++t2 < r2);
        return r2;
      }
      function u(e2, t2, r2) {
        for (; t2 > r2; ) {
          let r3 = e2.charCodeAt(--t2);
          if (32 !== r3 && 9 !== r3) return t2 + 1;
        }
        return r2;
      }
      function c(e2) {
        if (-1 === e2.indexOf("%")) return e2;
        try {
          return decodeURIComponent(e2);
        } catch (t2) {
          return e2;
        }
      }
    }, 858: (e, t, r) => {
      "use strict";
      var i = Object.defineProperty, s = Object.getOwnPropertyDescriptor, n = Object.getOwnPropertyNames, a = Object.prototype.hasOwnProperty, o = {};
      ((e2, t2) => {
        for (var r2 in t2) i(e2, r2, { get: t2[r2], enumerable: true });
      })(o, { createI18nMiddleware: () => h }), e.exports = ((e2, t2, r2, o2) => {
        if (t2 && "object" == typeof t2 || "function" == typeof t2) for (let l2 of n(t2)) a.call(e2, l2) || l2 === r2 || i(e2, l2, { get: () => t2[l2], enumerable: !(o2 = s(t2, l2)) || o2.enumerable });
        return e2;
      })(i({}, "__esModule", { value: true }), o);
      var l = r(635), u = "Next-Locale", c = (e2) => null;
      function h(e2) {
        return function(t2) {
          var r2, i2, s2, n2, a2;
          let o2 = null != (r2 = function(e3, t3, r3 = d) {
            var i3, s3;
            let n3 = null != (s3 = null == (i3 = t3.cookies.get(u)) ? void 0 : i3.value) ? s3 : r3(t3);
            return n3 && e3.includes(n3) ? n3 : null;
          }(e2.locales, t2, e2.resolveLocaleFromRequest)) ? r2 : e2.defaultLocale, h2 = t2.nextUrl;
          if (n2 = e2.locales, a2 = h2.pathname, n2.every((e3) => !(a2 === `/${e3}` || a2.startsWith(`/${e3}/`)))) {
            h2.pathname = `/${o2}${h2.pathname}`;
            let r3 = null != (i2 = e2.urlMappingStrategy) ? i2 : "redirect";
            return "rewrite" === r3 || "rewriteDefault" === r3 && o2 === e2.defaultLocale ? p(t2, l.NextResponse.rewrite(h2), o2) : (["redirect", "rewriteDefault"].includes(r3) || c(`Invalid urlMappingStrategy: ${r3}. Defaulting to redirect.`), p(t2, l.NextResponse.redirect(h2), o2));
          }
          let f = l.NextResponse.next(), g = null == (s2 = h2.pathname.split("/", 2)) ? void 0 : s2[1];
          if (!g || e2.locales.includes(g)) {
            if ("rewrite" === e2.urlMappingStrategy && g !== o2 || "rewriteDefault" === e2.urlMappingStrategy && (g !== o2 || g === e2.defaultLocale)) {
              let e3 = new URL(h2.pathname.slice(g.length + 1) || "/", t2.url);
              e3.search = h2.search, f = l.NextResponse.redirect(e3);
            }
            return p(t2, f, null != g ? g : e2.defaultLocale);
          }
          return f;
        };
      }
      var d = (e2) => {
        var t2, r2, i2;
        let s2 = e2.headers.get("Accept-Language"), n2 = null == (i2 = null == (r2 = null == (t2 = null == s2 ? void 0 : s2.split(",", 1)) ? void 0 : t2[0]) ? void 0 : r2.split("-", 1)) ? void 0 : i2[0];
        return null != n2 ? n2 : null;
      };
      function p(e2, t2, r2) {
        var i2;
        return t2.headers.set("X-Next-Locale", r2), (null == (i2 = e2.cookies.get(u)) ? void 0 : i2.value) !== r2 && t2.cookies.set(u, r2, { sameSite: "strict" }), t2;
      }
    }, 945: (e) => {
      "use strict";
      var t = Object.defineProperty, r = Object.getOwnPropertyDescriptor, i = Object.getOwnPropertyNames, s = Object.prototype.hasOwnProperty, n = {};
      function a(e2) {
        var t2;
        let r2 = ["path" in e2 && e2.path && `Path=${e2.path}`, "expires" in e2 && (e2.expires || 0 === e2.expires) && `Expires=${("number" == typeof e2.expires ? new Date(e2.expires) : e2.expires).toUTCString()}`, "maxAge" in e2 && "number" == typeof e2.maxAge && `Max-Age=${e2.maxAge}`, "domain" in e2 && e2.domain && `Domain=${e2.domain}`, "secure" in e2 && e2.secure && "Secure", "httpOnly" in e2 && e2.httpOnly && "HttpOnly", "sameSite" in e2 && e2.sameSite && `SameSite=${e2.sameSite}`, "partitioned" in e2 && e2.partitioned && "Partitioned", "priority" in e2 && e2.priority && `Priority=${e2.priority}`].filter(Boolean), i2 = `${e2.name}=${encodeURIComponent(null != (t2 = e2.value) ? t2 : "")}`;
        return 0 === r2.length ? i2 : `${i2}; ${r2.join("; ")}`;
      }
      function o(e2) {
        let t2 = /* @__PURE__ */ new Map();
        for (let r2 of e2.split(/; */)) {
          if (!r2) continue;
          let e3 = r2.indexOf("=");
          if (-1 === e3) {
            t2.set(r2, "true");
            continue;
          }
          let [i2, s2] = [r2.slice(0, e3), r2.slice(e3 + 1)];
          try {
            t2.set(i2, decodeURIComponent(null != s2 ? s2 : "true"));
          } catch {
          }
        }
        return t2;
      }
      function l(e2) {
        var t2, r2;
        if (!e2) return;
        let [[i2, s2], ...n2] = o(e2), { domain: a2, expires: l2, httponly: h2, maxage: d2, path: p, samesite: f, secure: g, partitioned: m, priority: v } = Object.fromEntries(n2.map(([e3, t3]) => [e3.toLowerCase(), t3]));
        return function(e3) {
          let t3 = {};
          for (let r3 in e3) e3[r3] && (t3[r3] = e3[r3]);
          return t3;
        }({ name: i2, value: decodeURIComponent(s2), domain: a2, ...l2 && { expires: new Date(l2) }, ...h2 && { httpOnly: true }, ..."string" == typeof d2 && { maxAge: Number(d2) }, path: p, ...f && { sameSite: u.includes(t2 = (t2 = f).toLowerCase()) ? t2 : void 0 }, ...g && { secure: true }, ...v && { priority: c.includes(r2 = (r2 = v).toLowerCase()) ? r2 : void 0 }, ...m && { partitioned: true } });
      }
      ((e2, r2) => {
        for (var i2 in r2) t(e2, i2, { get: r2[i2], enumerable: true });
      })(n, { RequestCookies: () => h, ResponseCookies: () => d, parseCookie: () => o, parseSetCookie: () => l, stringifyCookie: () => a }), e.exports = ((e2, n2, a2, o2) => {
        if (n2 && "object" == typeof n2 || "function" == typeof n2) for (let l2 of i(n2)) s.call(e2, l2) || l2 === a2 || t(e2, l2, { get: () => n2[l2], enumerable: !(o2 = r(n2, l2)) || o2.enumerable });
        return e2;
      })(t({}, "__esModule", { value: true }), n);
      var u = ["strict", "lax", "none"], c = ["low", "medium", "high"], h = class {
        constructor(e2) {
          this._parsed = /* @__PURE__ */ new Map(), this._headers = e2;
          let t2 = e2.get("cookie");
          if (t2) for (let [e3, r2] of o(t2)) this._parsed.set(e3, { name: e3, value: r2 });
        }
        [Symbol.iterator]() {
          return this._parsed[Symbol.iterator]();
        }
        get size() {
          return this._parsed.size;
        }
        get(...e2) {
          let t2 = "string" == typeof e2[0] ? e2[0] : e2[0].name;
          return this._parsed.get(t2);
        }
        getAll(...e2) {
          var t2;
          let r2 = Array.from(this._parsed);
          if (!e2.length) return r2.map(([e3, t3]) => t3);
          let i2 = "string" == typeof e2[0] ? e2[0] : null == (t2 = e2[0]) ? void 0 : t2.name;
          return r2.filter(([e3]) => e3 === i2).map(([e3, t3]) => t3);
        }
        has(e2) {
          return this._parsed.has(e2);
        }
        set(...e2) {
          let [t2, r2] = 1 === e2.length ? [e2[0].name, e2[0].value] : e2, i2 = this._parsed;
          return i2.set(t2, { name: t2, value: r2 }), this._headers.set("cookie", Array.from(i2).map(([e3, t3]) => a(t3)).join("; ")), this;
        }
        delete(e2) {
          let t2 = this._parsed, r2 = Array.isArray(e2) ? e2.map((e3) => t2.delete(e3)) : t2.delete(e2);
          return this._headers.set("cookie", Array.from(t2).map(([e3, t3]) => a(t3)).join("; ")), r2;
        }
        clear() {
          return this.delete(Array.from(this._parsed.keys())), this;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `RequestCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map((e2) => `${e2.name}=${encodeURIComponent(e2.value)}`).join("; ");
        }
      }, d = class {
        constructor(e2) {
          var t2, r2, i2;
          this._parsed = /* @__PURE__ */ new Map(), this._headers = e2;
          let s2 = null != (i2 = null != (r2 = null == (t2 = e2.getSetCookie) ? void 0 : t2.call(e2)) ? r2 : e2.get("set-cookie")) ? i2 : [];
          for (let e3 of Array.isArray(s2) ? s2 : function(e4) {
            if (!e4) return [];
            var t3, r3, i3, s3, n2, a2 = [], o2 = 0;
            function l2() {
              for (; o2 < e4.length && /\s/.test(e4.charAt(o2)); ) o2 += 1;
              return o2 < e4.length;
            }
            for (; o2 < e4.length; ) {
              for (t3 = o2, n2 = false; l2(); ) if ("," === (r3 = e4.charAt(o2))) {
                for (i3 = o2, o2 += 1, l2(), s3 = o2; o2 < e4.length && "=" !== (r3 = e4.charAt(o2)) && ";" !== r3 && "," !== r3; ) o2 += 1;
                o2 < e4.length && "=" === e4.charAt(o2) ? (n2 = true, o2 = s3, a2.push(e4.substring(t3, i3)), t3 = o2) : o2 = i3 + 1;
              } else o2 += 1;
              (!n2 || o2 >= e4.length) && a2.push(e4.substring(t3, e4.length));
            }
            return a2;
          }(s2)) {
            let t3 = l(e3);
            t3 && this._parsed.set(t3.name, t3);
          }
        }
        get(...e2) {
          let t2 = "string" == typeof e2[0] ? e2[0] : e2[0].name;
          return this._parsed.get(t2);
        }
        getAll(...e2) {
          var t2;
          let r2 = Array.from(this._parsed.values());
          if (!e2.length) return r2;
          let i2 = "string" == typeof e2[0] ? e2[0] : null == (t2 = e2[0]) ? void 0 : t2.name;
          return r2.filter((e3) => e3.name === i2);
        }
        has(e2) {
          return this._parsed.has(e2);
        }
        set(...e2) {
          let [t2, r2, i2] = 1 === e2.length ? [e2[0].name, e2[0].value, e2[0]] : e2, s2 = this._parsed;
          return s2.set(t2, function(e3 = { name: "", value: "" }) {
            return "number" == typeof e3.expires && (e3.expires = new Date(e3.expires)), e3.maxAge && (e3.expires = new Date(Date.now() + 1e3 * e3.maxAge)), (null === e3.path || void 0 === e3.path) && (e3.path = "/"), e3;
          }({ name: t2, value: r2, ...i2 })), function(e3, t3) {
            for (let [, r3] of (t3.delete("set-cookie"), e3)) {
              let e4 = a(r3);
              t3.append("set-cookie", e4);
            }
          }(s2, this._headers), this;
        }
        delete(...e2) {
          let [t2, r2, i2] = "string" == typeof e2[0] ? [e2[0]] : [e2[0].name, e2[0].path, e2[0].domain];
          return this.set({ name: t2, path: r2, domain: i2, value: "", expires: /* @__PURE__ */ new Date(0) });
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `ResponseCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map(a).join("; ");
        }
      };
    }, 439: (e, t, r) => {
      (() => {
        "use strict";
        var t2 = { 491: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.ContextAPI = void 0;
          let i2 = r2(223), s2 = r2(172), n2 = r2(930), a = "context", o = new i2.NoopContextManager();
          class l {
            constructor() {
            }
            static getInstance() {
              return this._instance || (this._instance = new l()), this._instance;
            }
            setGlobalContextManager(e3) {
              return (0, s2.registerGlobal)(a, e3, n2.DiagAPI.instance());
            }
            active() {
              return this._getContextManager().active();
            }
            with(e3, t4, r3, ...i3) {
              return this._getContextManager().with(e3, t4, r3, ...i3);
            }
            bind(e3, t4) {
              return this._getContextManager().bind(e3, t4);
            }
            _getContextManager() {
              return (0, s2.getGlobal)(a) || o;
            }
            disable() {
              this._getContextManager().disable(), (0, s2.unregisterGlobal)(a, n2.DiagAPI.instance());
            }
          }
          t3.ContextAPI = l;
        }, 930: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.DiagAPI = void 0;
          let i2 = r2(56), s2 = r2(912), n2 = r2(957), a = r2(172);
          class o {
            constructor() {
              function e3(e4) {
                return function(...t5) {
                  let r3 = (0, a.getGlobal)("diag");
                  if (r3) return r3[e4](...t5);
                };
              }
              let t4 = this;
              t4.setLogger = (e4, r3 = { logLevel: n2.DiagLogLevel.INFO }) => {
                var i3, o2, l;
                if (e4 === t4) {
                  let e5 = Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
                  return t4.error(null !== (i3 = e5.stack) && void 0 !== i3 ? i3 : e5.message), false;
                }
                "number" == typeof r3 && (r3 = { logLevel: r3 });
                let u = (0, a.getGlobal)("diag"), c = (0, s2.createLogLevelDiagLogger)(null !== (o2 = r3.logLevel) && void 0 !== o2 ? o2 : n2.DiagLogLevel.INFO, e4);
                if (u && !r3.suppressOverrideMessage) {
                  let e5 = null !== (l = Error().stack) && void 0 !== l ? l : "<failed to generate stacktrace>";
                  u.warn(`Current logger will be overwritten from ${e5}`), c.warn(`Current logger will overwrite one already registered from ${e5}`);
                }
                return (0, a.registerGlobal)("diag", c, t4, true);
              }, t4.disable = () => {
                (0, a.unregisterGlobal)("diag", t4);
              }, t4.createComponentLogger = (e4) => new i2.DiagComponentLogger(e4), t4.verbose = e3("verbose"), t4.debug = e3("debug"), t4.info = e3("info"), t4.warn = e3("warn"), t4.error = e3("error");
            }
            static instance() {
              return this._instance || (this._instance = new o()), this._instance;
            }
          }
          t3.DiagAPI = o;
        }, 653: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.MetricsAPI = void 0;
          let i2 = r2(660), s2 = r2(172), n2 = r2(930), a = "metrics";
          class o {
            constructor() {
            }
            static getInstance() {
              return this._instance || (this._instance = new o()), this._instance;
            }
            setGlobalMeterProvider(e3) {
              return (0, s2.registerGlobal)(a, e3, n2.DiagAPI.instance());
            }
            getMeterProvider() {
              return (0, s2.getGlobal)(a) || i2.NOOP_METER_PROVIDER;
            }
            getMeter(e3, t4, r3) {
              return this.getMeterProvider().getMeter(e3, t4, r3);
            }
            disable() {
              (0, s2.unregisterGlobal)(a, n2.DiagAPI.instance());
            }
          }
          t3.MetricsAPI = o;
        }, 181: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.PropagationAPI = void 0;
          let i2 = r2(172), s2 = r2(874), n2 = r2(194), a = r2(277), o = r2(369), l = r2(930), u = "propagation", c = new s2.NoopTextMapPropagator();
          class h {
            constructor() {
              this.createBaggage = o.createBaggage, this.getBaggage = a.getBaggage, this.getActiveBaggage = a.getActiveBaggage, this.setBaggage = a.setBaggage, this.deleteBaggage = a.deleteBaggage;
            }
            static getInstance() {
              return this._instance || (this._instance = new h()), this._instance;
            }
            setGlobalPropagator(e3) {
              return (0, i2.registerGlobal)(u, e3, l.DiagAPI.instance());
            }
            inject(e3, t4, r3 = n2.defaultTextMapSetter) {
              return this._getGlobalPropagator().inject(e3, t4, r3);
            }
            extract(e3, t4, r3 = n2.defaultTextMapGetter) {
              return this._getGlobalPropagator().extract(e3, t4, r3);
            }
            fields() {
              return this._getGlobalPropagator().fields();
            }
            disable() {
              (0, i2.unregisterGlobal)(u, l.DiagAPI.instance());
            }
            _getGlobalPropagator() {
              return (0, i2.getGlobal)(u) || c;
            }
          }
          t3.PropagationAPI = h;
        }, 997: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.TraceAPI = void 0;
          let i2 = r2(172), s2 = r2(846), n2 = r2(139), a = r2(607), o = r2(930), l = "trace";
          class u {
            constructor() {
              this._proxyTracerProvider = new s2.ProxyTracerProvider(), this.wrapSpanContext = n2.wrapSpanContext, this.isSpanContextValid = n2.isSpanContextValid, this.deleteSpan = a.deleteSpan, this.getSpan = a.getSpan, this.getActiveSpan = a.getActiveSpan, this.getSpanContext = a.getSpanContext, this.setSpan = a.setSpan, this.setSpanContext = a.setSpanContext;
            }
            static getInstance() {
              return this._instance || (this._instance = new u()), this._instance;
            }
            setGlobalTracerProvider(e3) {
              let t4 = (0, i2.registerGlobal)(l, this._proxyTracerProvider, o.DiagAPI.instance());
              return t4 && this._proxyTracerProvider.setDelegate(e3), t4;
            }
            getTracerProvider() {
              return (0, i2.getGlobal)(l) || this._proxyTracerProvider;
            }
            getTracer(e3, t4) {
              return this.getTracerProvider().getTracer(e3, t4);
            }
            disable() {
              (0, i2.unregisterGlobal)(l, o.DiagAPI.instance()), this._proxyTracerProvider = new s2.ProxyTracerProvider();
            }
          }
          t3.TraceAPI = u;
        }, 277: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.deleteBaggage = t3.setBaggage = t3.getActiveBaggage = t3.getBaggage = void 0;
          let i2 = r2(491), s2 = (0, r2(780).createContextKey)("OpenTelemetry Baggage Key");
          function n2(e3) {
            return e3.getValue(s2) || void 0;
          }
          t3.getBaggage = n2, t3.getActiveBaggage = function() {
            return n2(i2.ContextAPI.getInstance().active());
          }, t3.setBaggage = function(e3, t4) {
            return e3.setValue(s2, t4);
          }, t3.deleteBaggage = function(e3) {
            return e3.deleteValue(s2);
          };
        }, 993: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.BaggageImpl = void 0;
          class r2 {
            constructor(e3) {
              this._entries = e3 ? new Map(e3) : /* @__PURE__ */ new Map();
            }
            getEntry(e3) {
              let t4 = this._entries.get(e3);
              if (t4) return Object.assign({}, t4);
            }
            getAllEntries() {
              return Array.from(this._entries.entries()).map(([e3, t4]) => [e3, t4]);
            }
            setEntry(e3, t4) {
              let i2 = new r2(this._entries);
              return i2._entries.set(e3, t4), i2;
            }
            removeEntry(e3) {
              let t4 = new r2(this._entries);
              return t4._entries.delete(e3), t4;
            }
            removeEntries(...e3) {
              let t4 = new r2(this._entries);
              for (let r3 of e3) t4._entries.delete(r3);
              return t4;
            }
            clear() {
              return new r2();
            }
          }
          t3.BaggageImpl = r2;
        }, 830: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.baggageEntryMetadataSymbol = void 0, t3.baggageEntryMetadataSymbol = Symbol("BaggageEntryMetadata");
        }, 369: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.baggageEntryMetadataFromString = t3.createBaggage = void 0;
          let i2 = r2(930), s2 = r2(993), n2 = r2(830), a = i2.DiagAPI.instance();
          t3.createBaggage = function(e3 = {}) {
            return new s2.BaggageImpl(new Map(Object.entries(e3)));
          }, t3.baggageEntryMetadataFromString = function(e3) {
            return "string" != typeof e3 && (a.error(`Cannot create baggage metadata from unknown type: ${typeof e3}`), e3 = ""), { __TYPE__: n2.baggageEntryMetadataSymbol, toString: () => e3 };
          };
        }, 67: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.context = void 0;
          let i2 = r2(491);
          t3.context = i2.ContextAPI.getInstance();
        }, 223: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.NoopContextManager = void 0;
          let i2 = r2(780);
          class s2 {
            active() {
              return i2.ROOT_CONTEXT;
            }
            with(e3, t4, r3, ...i3) {
              return t4.call(r3, ...i3);
            }
            bind(e3, t4) {
              return t4;
            }
            enable() {
              return this;
            }
            disable() {
              return this;
            }
          }
          t3.NoopContextManager = s2;
        }, 780: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.ROOT_CONTEXT = t3.createContextKey = void 0, t3.createContextKey = function(e3) {
            return Symbol.for(e3);
          };
          class r2 {
            constructor(e3) {
              let t4 = this;
              t4._currentContext = e3 ? new Map(e3) : /* @__PURE__ */ new Map(), t4.getValue = (e4) => t4._currentContext.get(e4), t4.setValue = (e4, i2) => {
                let s2 = new r2(t4._currentContext);
                return s2._currentContext.set(e4, i2), s2;
              }, t4.deleteValue = (e4) => {
                let i2 = new r2(t4._currentContext);
                return i2._currentContext.delete(e4), i2;
              };
            }
          }
          t3.ROOT_CONTEXT = new r2();
        }, 506: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.diag = void 0;
          let i2 = r2(930);
          t3.diag = i2.DiagAPI.instance();
        }, 56: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.DiagComponentLogger = void 0;
          let i2 = r2(172);
          class s2 {
            constructor(e3) {
              this._namespace = e3.namespace || "DiagComponentLogger";
            }
            debug(...e3) {
              return n2("debug", this._namespace, e3);
            }
            error(...e3) {
              return n2("error", this._namespace, e3);
            }
            info(...e3) {
              return n2("info", this._namespace, e3);
            }
            warn(...e3) {
              return n2("warn", this._namespace, e3);
            }
            verbose(...e3) {
              return n2("verbose", this._namespace, e3);
            }
          }
          function n2(e3, t4, r3) {
            let s3 = (0, i2.getGlobal)("diag");
            if (s3) return r3.unshift(t4), s3[e3](...r3);
          }
          t3.DiagComponentLogger = s2;
        }, 972: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.DiagConsoleLogger = void 0;
          let r2 = [{ n: "error", c: "error" }, { n: "warn", c: "warn" }, { n: "info", c: "info" }, { n: "debug", c: "debug" }, { n: "verbose", c: "trace" }];
          class i2 {
            constructor() {
              for (let e3 = 0; e3 < r2.length; e3++) this[r2[e3].n] = /* @__PURE__ */ function(e4) {
                return function(...t4) {
                  if (console) {
                    let r3 = console[e4];
                    if ("function" != typeof r3 && (r3 = console.log), "function" == typeof r3) return r3.apply(console, t4);
                  }
                };
              }(r2[e3].c);
            }
          }
          t3.DiagConsoleLogger = i2;
        }, 912: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.createLogLevelDiagLogger = void 0;
          let i2 = r2(957);
          t3.createLogLevelDiagLogger = function(e3, t4) {
            function r3(r4, i3) {
              let s2 = t4[r4];
              return "function" == typeof s2 && e3 >= i3 ? s2.bind(t4) : function() {
              };
            }
            return e3 < i2.DiagLogLevel.NONE ? e3 = i2.DiagLogLevel.NONE : e3 > i2.DiagLogLevel.ALL && (e3 = i2.DiagLogLevel.ALL), t4 = t4 || {}, { error: r3("error", i2.DiagLogLevel.ERROR), warn: r3("warn", i2.DiagLogLevel.WARN), info: r3("info", i2.DiagLogLevel.INFO), debug: r3("debug", i2.DiagLogLevel.DEBUG), verbose: r3("verbose", i2.DiagLogLevel.VERBOSE) };
          };
        }, 957: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.DiagLogLevel = void 0, function(e3) {
            e3[e3.NONE = 0] = "NONE", e3[e3.ERROR = 30] = "ERROR", e3[e3.WARN = 50] = "WARN", e3[e3.INFO = 60] = "INFO", e3[e3.DEBUG = 70] = "DEBUG", e3[e3.VERBOSE = 80] = "VERBOSE", e3[e3.ALL = 9999] = "ALL";
          }(t3.DiagLogLevel || (t3.DiagLogLevel = {}));
        }, 172: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.unregisterGlobal = t3.getGlobal = t3.registerGlobal = void 0;
          let i2 = r2(200), s2 = r2(521), n2 = r2(130), a = s2.VERSION.split(".")[0], o = Symbol.for(`opentelemetry.js.api.${a}`), l = i2._globalThis;
          t3.registerGlobal = function(e3, t4, r3, i3 = false) {
            var n3;
            let a2 = l[o] = null !== (n3 = l[o]) && void 0 !== n3 ? n3 : { version: s2.VERSION };
            if (!i3 && a2[e3]) {
              let t5 = Error(`@opentelemetry/api: Attempted duplicate registration of API: ${e3}`);
              return r3.error(t5.stack || t5.message), false;
            }
            if (a2.version !== s2.VERSION) {
              let t5 = Error(`@opentelemetry/api: Registration of version v${a2.version} for ${e3} does not match previously registered API v${s2.VERSION}`);
              return r3.error(t5.stack || t5.message), false;
            }
            return a2[e3] = t4, r3.debug(`@opentelemetry/api: Registered a global for ${e3} v${s2.VERSION}.`), true;
          }, t3.getGlobal = function(e3) {
            var t4, r3;
            let i3 = null === (t4 = l[o]) || void 0 === t4 ? void 0 : t4.version;
            if (i3 && (0, n2.isCompatible)(i3)) return null === (r3 = l[o]) || void 0 === r3 ? void 0 : r3[e3];
          }, t3.unregisterGlobal = function(e3, t4) {
            t4.debug(`@opentelemetry/api: Unregistering a global for ${e3} v${s2.VERSION}.`);
            let r3 = l[o];
            r3 && delete r3[e3];
          };
        }, 130: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.isCompatible = t3._makeCompatibilityCheck = void 0;
          let i2 = r2(521), s2 = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
          function n2(e3) {
            let t4 = /* @__PURE__ */ new Set([e3]), r3 = /* @__PURE__ */ new Set(), i3 = e3.match(s2);
            if (!i3) return () => false;
            let n3 = { major: +i3[1], minor: +i3[2], patch: +i3[3], prerelease: i3[4] };
            if (null != n3.prerelease) return function(t5) {
              return t5 === e3;
            };
            function a(e4) {
              return r3.add(e4), false;
            }
            return function(e4) {
              if (t4.has(e4)) return true;
              if (r3.has(e4)) return false;
              let i4 = e4.match(s2);
              if (!i4) return a(e4);
              let o = { major: +i4[1], minor: +i4[2], patch: +i4[3], prerelease: i4[4] };
              return null != o.prerelease || n3.major !== o.major ? a(e4) : 0 === n3.major ? n3.minor === o.minor && n3.patch <= o.patch ? (t4.add(e4), true) : a(e4) : n3.minor <= o.minor ? (t4.add(e4), true) : a(e4);
            };
          }
          t3._makeCompatibilityCheck = n2, t3.isCompatible = n2(i2.VERSION);
        }, 886: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.metrics = void 0;
          let i2 = r2(653);
          t3.metrics = i2.MetricsAPI.getInstance();
        }, 901: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.ValueType = void 0, function(e3) {
            e3[e3.INT = 0] = "INT", e3[e3.DOUBLE = 1] = "DOUBLE";
          }(t3.ValueType || (t3.ValueType = {}));
        }, 102: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.createNoopMeter = t3.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = t3.NOOP_OBSERVABLE_GAUGE_METRIC = t3.NOOP_OBSERVABLE_COUNTER_METRIC = t3.NOOP_UP_DOWN_COUNTER_METRIC = t3.NOOP_HISTOGRAM_METRIC = t3.NOOP_COUNTER_METRIC = t3.NOOP_METER = t3.NoopObservableUpDownCounterMetric = t3.NoopObservableGaugeMetric = t3.NoopObservableCounterMetric = t3.NoopObservableMetric = t3.NoopHistogramMetric = t3.NoopUpDownCounterMetric = t3.NoopCounterMetric = t3.NoopMetric = t3.NoopMeter = void 0;
          class r2 {
            constructor() {
            }
            createHistogram(e3, r3) {
              return t3.NOOP_HISTOGRAM_METRIC;
            }
            createCounter(e3, r3) {
              return t3.NOOP_COUNTER_METRIC;
            }
            createUpDownCounter(e3, r3) {
              return t3.NOOP_UP_DOWN_COUNTER_METRIC;
            }
            createObservableGauge(e3, r3) {
              return t3.NOOP_OBSERVABLE_GAUGE_METRIC;
            }
            createObservableCounter(e3, r3) {
              return t3.NOOP_OBSERVABLE_COUNTER_METRIC;
            }
            createObservableUpDownCounter(e3, r3) {
              return t3.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC;
            }
            addBatchObservableCallback(e3, t4) {
            }
            removeBatchObservableCallback(e3) {
            }
          }
          t3.NoopMeter = r2;
          class i2 {
          }
          t3.NoopMetric = i2;
          class s2 extends i2 {
            add(e3, t4) {
            }
          }
          t3.NoopCounterMetric = s2;
          class n2 extends i2 {
            add(e3, t4) {
            }
          }
          t3.NoopUpDownCounterMetric = n2;
          class a extends i2 {
            record(e3, t4) {
            }
          }
          t3.NoopHistogramMetric = a;
          class o {
            addCallback(e3) {
            }
            removeCallback(e3) {
            }
          }
          t3.NoopObservableMetric = o;
          class l extends o {
          }
          t3.NoopObservableCounterMetric = l;
          class u extends o {
          }
          t3.NoopObservableGaugeMetric = u;
          class c extends o {
          }
          t3.NoopObservableUpDownCounterMetric = c, t3.NOOP_METER = new r2(), t3.NOOP_COUNTER_METRIC = new s2(), t3.NOOP_HISTOGRAM_METRIC = new a(), t3.NOOP_UP_DOWN_COUNTER_METRIC = new n2(), t3.NOOP_OBSERVABLE_COUNTER_METRIC = new l(), t3.NOOP_OBSERVABLE_GAUGE_METRIC = new u(), t3.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = new c(), t3.createNoopMeter = function() {
            return t3.NOOP_METER;
          };
        }, 660: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.NOOP_METER_PROVIDER = t3.NoopMeterProvider = void 0;
          let i2 = r2(102);
          class s2 {
            getMeter(e3, t4, r3) {
              return i2.NOOP_METER;
            }
          }
          t3.NoopMeterProvider = s2, t3.NOOP_METER_PROVIDER = new s2();
        }, 200: function(e2, t3, r2) {
          var i2 = this && this.__createBinding || (Object.create ? function(e3, t4, r3, i3) {
            void 0 === i3 && (i3 = r3), Object.defineProperty(e3, i3, { enumerable: true, get: function() {
              return t4[r3];
            } });
          } : function(e3, t4, r3, i3) {
            void 0 === i3 && (i3 = r3), e3[i3] = t4[r3];
          }), s2 = this && this.__exportStar || function(e3, t4) {
            for (var r3 in e3) "default" === r3 || Object.prototype.hasOwnProperty.call(t4, r3) || i2(t4, e3, r3);
          };
          Object.defineProperty(t3, "__esModule", { value: true }), s2(r2(46), t3);
        }, 651: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3._globalThis = void 0, t3._globalThis = "object" == typeof globalThis ? globalThis : r.g;
        }, 46: function(e2, t3, r2) {
          var i2 = this && this.__createBinding || (Object.create ? function(e3, t4, r3, i3) {
            void 0 === i3 && (i3 = r3), Object.defineProperty(e3, i3, { enumerable: true, get: function() {
              return t4[r3];
            } });
          } : function(e3, t4, r3, i3) {
            void 0 === i3 && (i3 = r3), e3[i3] = t4[r3];
          }), s2 = this && this.__exportStar || function(e3, t4) {
            for (var r3 in e3) "default" === r3 || Object.prototype.hasOwnProperty.call(t4, r3) || i2(t4, e3, r3);
          };
          Object.defineProperty(t3, "__esModule", { value: true }), s2(r2(651), t3);
        }, 939: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.propagation = void 0;
          let i2 = r2(181);
          t3.propagation = i2.PropagationAPI.getInstance();
        }, 874: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.NoopTextMapPropagator = void 0;
          class r2 {
            inject(e3, t4) {
            }
            extract(e3, t4) {
              return e3;
            }
            fields() {
              return [];
            }
          }
          t3.NoopTextMapPropagator = r2;
        }, 194: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.defaultTextMapSetter = t3.defaultTextMapGetter = void 0, t3.defaultTextMapGetter = { get(e3, t4) {
            if (null != e3) return e3[t4];
          }, keys: (e3) => null == e3 ? [] : Object.keys(e3) }, t3.defaultTextMapSetter = { set(e3, t4, r2) {
            null != e3 && (e3[t4] = r2);
          } };
        }, 845: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.trace = void 0;
          let i2 = r2(997);
          t3.trace = i2.TraceAPI.getInstance();
        }, 403: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.NonRecordingSpan = void 0;
          let i2 = r2(476);
          class s2 {
            constructor(e3 = i2.INVALID_SPAN_CONTEXT) {
              this._spanContext = e3;
            }
            spanContext() {
              return this._spanContext;
            }
            setAttribute(e3, t4) {
              return this;
            }
            setAttributes(e3) {
              return this;
            }
            addEvent(e3, t4) {
              return this;
            }
            setStatus(e3) {
              return this;
            }
            updateName(e3) {
              return this;
            }
            end(e3) {
            }
            isRecording() {
              return false;
            }
            recordException(e3, t4) {
            }
          }
          t3.NonRecordingSpan = s2;
        }, 614: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.NoopTracer = void 0;
          let i2 = r2(491), s2 = r2(607), n2 = r2(403), a = r2(139), o = i2.ContextAPI.getInstance();
          class l {
            startSpan(e3, t4, r3 = o.active()) {
              if (null == t4 ? void 0 : t4.root) return new n2.NonRecordingSpan();
              let i3 = r3 && (0, s2.getSpanContext)(r3);
              return "object" == typeof i3 && "string" == typeof i3.spanId && "string" == typeof i3.traceId && "number" == typeof i3.traceFlags && (0, a.isSpanContextValid)(i3) ? new n2.NonRecordingSpan(i3) : new n2.NonRecordingSpan();
            }
            startActiveSpan(e3, t4, r3, i3) {
              let n3, a2, l2;
              if (arguments.length < 2) return;
              2 == arguments.length ? l2 = t4 : 3 == arguments.length ? (n3 = t4, l2 = r3) : (n3 = t4, a2 = r3, l2 = i3);
              let u = null != a2 ? a2 : o.active(), c = this.startSpan(e3, n3, u), h = (0, s2.setSpan)(u, c);
              return o.with(h, l2, void 0, c);
            }
          }
          t3.NoopTracer = l;
        }, 124: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.NoopTracerProvider = void 0;
          let i2 = r2(614);
          class s2 {
            getTracer(e3, t4, r3) {
              return new i2.NoopTracer();
            }
          }
          t3.NoopTracerProvider = s2;
        }, 125: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.ProxyTracer = void 0;
          let i2 = new (r2(614)).NoopTracer();
          class s2 {
            constructor(e3, t4, r3, i3) {
              this._provider = e3, this.name = t4, this.version = r3, this.options = i3;
            }
            startSpan(e3, t4, r3) {
              return this._getTracer().startSpan(e3, t4, r3);
            }
            startActiveSpan(e3, t4, r3, i3) {
              let s3 = this._getTracer();
              return Reflect.apply(s3.startActiveSpan, s3, arguments);
            }
            _getTracer() {
              if (this._delegate) return this._delegate;
              let e3 = this._provider.getDelegateTracer(this.name, this.version, this.options);
              return e3 ? (this._delegate = e3, this._delegate) : i2;
            }
          }
          t3.ProxyTracer = s2;
        }, 846: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.ProxyTracerProvider = void 0;
          let i2 = r2(125), s2 = new (r2(124)).NoopTracerProvider();
          class n2 {
            getTracer(e3, t4, r3) {
              var s3;
              return null !== (s3 = this.getDelegateTracer(e3, t4, r3)) && void 0 !== s3 ? s3 : new i2.ProxyTracer(this, e3, t4, r3);
            }
            getDelegate() {
              var e3;
              return null !== (e3 = this._delegate) && void 0 !== e3 ? e3 : s2;
            }
            setDelegate(e3) {
              this._delegate = e3;
            }
            getDelegateTracer(e3, t4, r3) {
              var i3;
              return null === (i3 = this._delegate) || void 0 === i3 ? void 0 : i3.getTracer(e3, t4, r3);
            }
          }
          t3.ProxyTracerProvider = n2;
        }, 996: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.SamplingDecision = void 0, function(e3) {
            e3[e3.NOT_RECORD = 0] = "NOT_RECORD", e3[e3.RECORD = 1] = "RECORD", e3[e3.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED";
          }(t3.SamplingDecision || (t3.SamplingDecision = {}));
        }, 607: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.getSpanContext = t3.setSpanContext = t3.deleteSpan = t3.setSpan = t3.getActiveSpan = t3.getSpan = void 0;
          let i2 = r2(780), s2 = r2(403), n2 = r2(491), a = (0, i2.createContextKey)("OpenTelemetry Context Key SPAN");
          function o(e3) {
            return e3.getValue(a) || void 0;
          }
          function l(e3, t4) {
            return e3.setValue(a, t4);
          }
          t3.getSpan = o, t3.getActiveSpan = function() {
            return o(n2.ContextAPI.getInstance().active());
          }, t3.setSpan = l, t3.deleteSpan = function(e3) {
            return e3.deleteValue(a);
          }, t3.setSpanContext = function(e3, t4) {
            return l(e3, new s2.NonRecordingSpan(t4));
          }, t3.getSpanContext = function(e3) {
            var t4;
            return null === (t4 = o(e3)) || void 0 === t4 ? void 0 : t4.spanContext();
          };
        }, 325: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.TraceStateImpl = void 0;
          let i2 = r2(564);
          class s2 {
            constructor(e3) {
              this._internalState = /* @__PURE__ */ new Map(), e3 && this._parse(e3);
            }
            set(e3, t4) {
              let r3 = this._clone();
              return r3._internalState.has(e3) && r3._internalState.delete(e3), r3._internalState.set(e3, t4), r3;
            }
            unset(e3) {
              let t4 = this._clone();
              return t4._internalState.delete(e3), t4;
            }
            get(e3) {
              return this._internalState.get(e3);
            }
            serialize() {
              return this._keys().reduce((e3, t4) => (e3.push(t4 + "=" + this.get(t4)), e3), []).join(",");
            }
            _parse(e3) {
              !(e3.length > 512) && (this._internalState = e3.split(",").reverse().reduce((e4, t4) => {
                let r3 = t4.trim(), s3 = r3.indexOf("=");
                if (-1 !== s3) {
                  let n2 = r3.slice(0, s3), a = r3.slice(s3 + 1, t4.length);
                  (0, i2.validateKey)(n2) && (0, i2.validateValue)(a) && e4.set(n2, a);
                }
                return e4;
              }, /* @__PURE__ */ new Map()), this._internalState.size > 32 && (this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, 32))));
            }
            _keys() {
              return Array.from(this._internalState.keys()).reverse();
            }
            _clone() {
              let e3 = new s2();
              return e3._internalState = new Map(this._internalState), e3;
            }
          }
          t3.TraceStateImpl = s2;
        }, 564: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.validateValue = t3.validateKey = void 0;
          let r2 = "[_0-9a-z-*/]", i2 = `[a-z]${r2}{0,255}`, s2 = `[a-z0-9]${r2}{0,240}@[a-z]${r2}{0,13}`, n2 = RegExp(`^(?:${i2}|${s2})$`), a = /^[ -~]{0,255}[!-~]$/, o = /,|=/;
          t3.validateKey = function(e3) {
            return n2.test(e3);
          }, t3.validateValue = function(e3) {
            return a.test(e3) && !o.test(e3);
          };
        }, 98: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.createTraceState = void 0;
          let i2 = r2(325);
          t3.createTraceState = function(e3) {
            return new i2.TraceStateImpl(e3);
          };
        }, 476: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.INVALID_SPAN_CONTEXT = t3.INVALID_TRACEID = t3.INVALID_SPANID = void 0;
          let i2 = r2(475);
          t3.INVALID_SPANID = "0000000000000000", t3.INVALID_TRACEID = "00000000000000000000000000000000", t3.INVALID_SPAN_CONTEXT = { traceId: t3.INVALID_TRACEID, spanId: t3.INVALID_SPANID, traceFlags: i2.TraceFlags.NONE };
        }, 357: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.SpanKind = void 0, function(e3) {
            e3[e3.INTERNAL = 0] = "INTERNAL", e3[e3.SERVER = 1] = "SERVER", e3[e3.CLIENT = 2] = "CLIENT", e3[e3.PRODUCER = 3] = "PRODUCER", e3[e3.CONSUMER = 4] = "CONSUMER";
          }(t3.SpanKind || (t3.SpanKind = {}));
        }, 139: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.wrapSpanContext = t3.isSpanContextValid = t3.isValidSpanId = t3.isValidTraceId = void 0;
          let i2 = r2(476), s2 = r2(403), n2 = /^([0-9a-f]{32})$/i, a = /^[0-9a-f]{16}$/i;
          function o(e3) {
            return n2.test(e3) && e3 !== i2.INVALID_TRACEID;
          }
          function l(e3) {
            return a.test(e3) && e3 !== i2.INVALID_SPANID;
          }
          t3.isValidTraceId = o, t3.isValidSpanId = l, t3.isSpanContextValid = function(e3) {
            return o(e3.traceId) && l(e3.spanId);
          }, t3.wrapSpanContext = function(e3) {
            return new s2.NonRecordingSpan(e3);
          };
        }, 847: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.SpanStatusCode = void 0, function(e3) {
            e3[e3.UNSET = 0] = "UNSET", e3[e3.OK = 1] = "OK", e3[e3.ERROR = 2] = "ERROR";
          }(t3.SpanStatusCode || (t3.SpanStatusCode = {}));
        }, 475: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.TraceFlags = void 0, function(e3) {
            e3[e3.NONE = 0] = "NONE", e3[e3.SAMPLED = 1] = "SAMPLED";
          }(t3.TraceFlags || (t3.TraceFlags = {}));
        }, 521: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.VERSION = void 0, t3.VERSION = "1.6.0";
        } }, i = {};
        function s(e2) {
          var r2 = i[e2];
          if (void 0 !== r2) return r2.exports;
          var n2 = i[e2] = { exports: {} }, a = true;
          try {
            t2[e2].call(n2.exports, n2, n2.exports, s), a = false;
          } finally {
            a && delete i[e2];
          }
          return n2.exports;
        }
        s.ab = "//";
        var n = {};
        (() => {
          Object.defineProperty(n, "__esModule", { value: true }), n.trace = n.propagation = n.metrics = n.diag = n.context = n.INVALID_SPAN_CONTEXT = n.INVALID_TRACEID = n.INVALID_SPANID = n.isValidSpanId = n.isValidTraceId = n.isSpanContextValid = n.createTraceState = n.TraceFlags = n.SpanStatusCode = n.SpanKind = n.SamplingDecision = n.ProxyTracerProvider = n.ProxyTracer = n.defaultTextMapSetter = n.defaultTextMapGetter = n.ValueType = n.createNoopMeter = n.DiagLogLevel = n.DiagConsoleLogger = n.ROOT_CONTEXT = n.createContextKey = n.baggageEntryMetadataFromString = void 0;
          var e2 = s(369);
          Object.defineProperty(n, "baggageEntryMetadataFromString", { enumerable: true, get: function() {
            return e2.baggageEntryMetadataFromString;
          } });
          var t3 = s(780);
          Object.defineProperty(n, "createContextKey", { enumerable: true, get: function() {
            return t3.createContextKey;
          } }), Object.defineProperty(n, "ROOT_CONTEXT", { enumerable: true, get: function() {
            return t3.ROOT_CONTEXT;
          } });
          var r2 = s(972);
          Object.defineProperty(n, "DiagConsoleLogger", { enumerable: true, get: function() {
            return r2.DiagConsoleLogger;
          } });
          var i2 = s(957);
          Object.defineProperty(n, "DiagLogLevel", { enumerable: true, get: function() {
            return i2.DiagLogLevel;
          } });
          var a = s(102);
          Object.defineProperty(n, "createNoopMeter", { enumerable: true, get: function() {
            return a.createNoopMeter;
          } });
          var o = s(901);
          Object.defineProperty(n, "ValueType", { enumerable: true, get: function() {
            return o.ValueType;
          } });
          var l = s(194);
          Object.defineProperty(n, "defaultTextMapGetter", { enumerable: true, get: function() {
            return l.defaultTextMapGetter;
          } }), Object.defineProperty(n, "defaultTextMapSetter", { enumerable: true, get: function() {
            return l.defaultTextMapSetter;
          } });
          var u = s(125);
          Object.defineProperty(n, "ProxyTracer", { enumerable: true, get: function() {
            return u.ProxyTracer;
          } });
          var c = s(846);
          Object.defineProperty(n, "ProxyTracerProvider", { enumerable: true, get: function() {
            return c.ProxyTracerProvider;
          } });
          var h = s(996);
          Object.defineProperty(n, "SamplingDecision", { enumerable: true, get: function() {
            return h.SamplingDecision;
          } });
          var d = s(357);
          Object.defineProperty(n, "SpanKind", { enumerable: true, get: function() {
            return d.SpanKind;
          } });
          var p = s(847);
          Object.defineProperty(n, "SpanStatusCode", { enumerable: true, get: function() {
            return p.SpanStatusCode;
          } });
          var f = s(475);
          Object.defineProperty(n, "TraceFlags", { enumerable: true, get: function() {
            return f.TraceFlags;
          } });
          var g = s(98);
          Object.defineProperty(n, "createTraceState", { enumerable: true, get: function() {
            return g.createTraceState;
          } });
          var m = s(139);
          Object.defineProperty(n, "isSpanContextValid", { enumerable: true, get: function() {
            return m.isSpanContextValid;
          } }), Object.defineProperty(n, "isValidTraceId", { enumerable: true, get: function() {
            return m.isValidTraceId;
          } }), Object.defineProperty(n, "isValidSpanId", { enumerable: true, get: function() {
            return m.isValidSpanId;
          } });
          var v = s(476);
          Object.defineProperty(n, "INVALID_SPANID", { enumerable: true, get: function() {
            return v.INVALID_SPANID;
          } }), Object.defineProperty(n, "INVALID_TRACEID", { enumerable: true, get: function() {
            return v.INVALID_TRACEID;
          } }), Object.defineProperty(n, "INVALID_SPAN_CONTEXT", { enumerable: true, get: function() {
            return v.INVALID_SPAN_CONTEXT;
          } });
          let b = s(67);
          Object.defineProperty(n, "context", { enumerable: true, get: function() {
            return b.context;
          } });
          let w = s(506);
          Object.defineProperty(n, "diag", { enumerable: true, get: function() {
            return w.diag;
          } });
          let y = s(886);
          Object.defineProperty(n, "metrics", { enumerable: true, get: function() {
            return y.metrics;
          } });
          let _ = s(939);
          Object.defineProperty(n, "propagation", { enumerable: true, get: function() {
            return _.propagation;
          } });
          let S = s(845);
          Object.defineProperty(n, "trace", { enumerable: true, get: function() {
            return S.trace;
          } }), n.default = { context: b.context, diag: w.diag, metrics: y.metrics, propagation: _.propagation, trace: S.trace };
        })(), e.exports = n;
      })();
    }, 133: (e) => {
      (() => {
        "use strict";
        "undefined" != typeof __nccwpck_require__ && (__nccwpck_require__.ab = "//");
        var t = {};
        (() => {
          t.parse = function(t2, r2) {
            if ("string" != typeof t2) throw TypeError("argument str must be a string");
            for (var s2 = {}, n = t2.split(i), a = (r2 || {}).decode || e2, o = 0; o < n.length; o++) {
              var l = n[o], u = l.indexOf("=");
              if (!(u < 0)) {
                var c = l.substr(0, u).trim(), h = l.substr(++u, l.length).trim();
                '"' == h[0] && (h = h.slice(1, -1)), void 0 == s2[c] && (s2[c] = function(e3, t3) {
                  try {
                    return t3(e3);
                  } catch (t4) {
                    return e3;
                  }
                }(h, a));
              }
            }
            return s2;
          }, t.serialize = function(e3, t2, i2) {
            var n = i2 || {}, a = n.encode || r;
            if ("function" != typeof a) throw TypeError("option encode is invalid");
            if (!s.test(e3)) throw TypeError("argument name is invalid");
            var o = a(t2);
            if (o && !s.test(o)) throw TypeError("argument val is invalid");
            var l = e3 + "=" + o;
            if (null != n.maxAge) {
              var u = n.maxAge - 0;
              if (isNaN(u) || !isFinite(u)) throw TypeError("option maxAge is invalid");
              l += "; Max-Age=" + Math.floor(u);
            }
            if (n.domain) {
              if (!s.test(n.domain)) throw TypeError("option domain is invalid");
              l += "; Domain=" + n.domain;
            }
            if (n.path) {
              if (!s.test(n.path)) throw TypeError("option path is invalid");
              l += "; Path=" + n.path;
            }
            if (n.expires) {
              if ("function" != typeof n.expires.toUTCString) throw TypeError("option expires is invalid");
              l += "; Expires=" + n.expires.toUTCString();
            }
            if (n.httpOnly && (l += "; HttpOnly"), n.secure && (l += "; Secure"), n.sameSite) switch ("string" == typeof n.sameSite ? n.sameSite.toLowerCase() : n.sameSite) {
              case true:
              case "strict":
                l += "; SameSite=Strict";
                break;
              case "lax":
                l += "; SameSite=Lax";
                break;
              case "none":
                l += "; SameSite=None";
                break;
              default:
                throw TypeError("option sameSite is invalid");
            }
            return l;
          };
          var e2 = decodeURIComponent, r = encodeURIComponent, i = /; */, s = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
        })(), e.exports = t;
      })();
    }, 340: (e, t, r) => {
      var i;
      (() => {
        var s = { 226: function(s2, n2) {
          !function(a2, o2) {
            "use strict";
            var l = "function", u = "undefined", c = "object", h = "string", d = "major", p = "model", f = "name", g = "type", m = "vendor", v = "version", b = "architecture", w = "console", y = "mobile", _ = "tablet", S = "smarttv", k = "wearable", x = "embedded", T = "Amazon", O = "Apple", E = "ASUS", P = "BlackBerry", R = "Browser", C = "Chrome", j = "Firefox", A = "Google", I = "Huawei", N = "Microsoft", L = "Motorola", $ = "Opera", M = "Samsung", D = "Sharp", U = "Sony", q = "Xiaomi", B = "Zebra", V = "Facebook", F = "Chromium OS", H = "Mac OS", G = function(e2, t2) {
              var r2 = {};
              for (var i2 in e2) t2[i2] && t2[i2].length % 2 == 0 ? r2[i2] = t2[i2].concat(e2[i2]) : r2[i2] = e2[i2];
              return r2;
            }, z = function(e2) {
              for (var t2 = {}, r2 = 0; r2 < e2.length; r2++) t2[e2[r2].toUpperCase()] = e2[r2];
              return t2;
            }, W = function(e2, t2) {
              return typeof e2 === h && -1 !== K(t2).indexOf(K(e2));
            }, K = function(e2) {
              return e2.toLowerCase();
            }, J = function(e2, t2) {
              if (typeof e2 === h) return e2 = e2.replace(/^\s\s*/, ""), typeof t2 === u ? e2 : e2.substring(0, 350);
            }, X = function(e2, t2) {
              for (var r2, i2, s3, n3, a3, u2, h2 = 0; h2 < t2.length && !a3; ) {
                var d2 = t2[h2], p2 = t2[h2 + 1];
                for (r2 = i2 = 0; r2 < d2.length && !a3 && d2[r2]; ) if (a3 = d2[r2++].exec(e2)) for (s3 = 0; s3 < p2.length; s3++) u2 = a3[++i2], typeof (n3 = p2[s3]) === c && n3.length > 0 ? 2 === n3.length ? typeof n3[1] == l ? this[n3[0]] = n3[1].call(this, u2) : this[n3[0]] = n3[1] : 3 === n3.length ? typeof n3[1] !== l || n3[1].exec && n3[1].test ? this[n3[0]] = u2 ? u2.replace(n3[1], n3[2]) : void 0 : this[n3[0]] = u2 ? n3[1].call(this, u2, n3[2]) : void 0 : 4 === n3.length && (this[n3[0]] = u2 ? n3[3].call(this, u2.replace(n3[1], n3[2])) : void 0) : this[n3] = u2 || o2;
                h2 += 2;
              }
            }, Y = function(e2, t2) {
              for (var r2 in t2) if (typeof t2[r2] === c && t2[r2].length > 0) {
                for (var i2 = 0; i2 < t2[r2].length; i2++) if (W(t2[r2][i2], e2)) return "?" === r2 ? o2 : r2;
              } else if (W(t2[r2], e2)) return "?" === r2 ? o2 : r2;
              return e2;
            }, Q = { ME: "4.90", "NT 3.11": "NT3.51", "NT 4.0": "NT4.0", 2e3: "NT 5.0", XP: ["NT 5.1", "NT 5.2"], Vista: "NT 6.0", 7: "NT 6.1", 8: "NT 6.2", 8.1: "NT 6.3", 10: ["NT 6.4", "NT 10.0"], RT: "ARM" }, Z = { browser: [[/\b(?:crmo|crios)\/([\w\.]+)/i], [v, [f, "Chrome"]], [/edg(?:e|ios|a)?\/([\w\.]+)/i], [v, [f, "Edge"]], [/(opera mini)\/([-\w\.]+)/i, /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i, /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i], [f, v], [/opios[\/ ]+([\w\.]+)/i], [v, [f, $ + " Mini"]], [/\bopr\/([\w\.]+)/i], [v, [f, $]], [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i, /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i, /(ba?idubrowser)[\/ ]?([\w\.]+)/i, /(?:ms|\()(ie) ([\w\.]+)/i, /(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i, /(heytap|ovi)browser\/([\d\.]+)/i, /(weibo)__([\d\.]+)/i], [f, v], [/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i], [v, [f, "UC" + R]], [/microm.+\bqbcore\/([\w\.]+)/i, /\bqbcore\/([\w\.]+).+microm/i], [v, [f, "WeChat(Win) Desktop"]], [/micromessenger\/([\w\.]+)/i], [v, [f, "WeChat"]], [/konqueror\/([\w\.]+)/i], [v, [f, "Konqueror"]], [/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i], [v, [f, "IE"]], [/ya(?:search)?browser\/([\w\.]+)/i], [v, [f, "Yandex"]], [/(avast|avg)\/([\w\.]+)/i], [[f, /(.+)/, "$1 Secure " + R], v], [/\bfocus\/([\w\.]+)/i], [v, [f, j + " Focus"]], [/\bopt\/([\w\.]+)/i], [v, [f, $ + " Touch"]], [/coc_coc\w+\/([\w\.]+)/i], [v, [f, "Coc Coc"]], [/dolfin\/([\w\.]+)/i], [v, [f, "Dolphin"]], [/coast\/([\w\.]+)/i], [v, [f, $ + " Coast"]], [/miuibrowser\/([\w\.]+)/i], [v, [f, "MIUI " + R]], [/fxios\/([-\w\.]+)/i], [v, [f, j]], [/\bqihu|(qi?ho?o?|360)browser/i], [[f, "360 " + R]], [/(oculus|samsung|sailfish|huawei)browser\/([\w\.]+)/i], [[f, /(.+)/, "$1 " + R], v], [/(comodo_dragon)\/([\w\.]+)/i], [[f, /_/g, " "], v], [/(electron)\/([\w\.]+) safari/i, /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i, /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i], [f, v], [/(metasr)[\/ ]?([\w\.]+)/i, /(lbbrowser)/i, /\[(linkedin)app\]/i], [f], [/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i], [[f, V], v], [/(kakao(?:talk|story))[\/ ]([\w\.]+)/i, /(naver)\(.*?(\d+\.[\w\.]+).*\)/i, /safari (line)\/([\w\.]+)/i, /\b(line)\/([\w\.]+)\/iab/i, /(chromium|instagram)[\/ ]([-\w\.]+)/i], [f, v], [/\bgsa\/([\w\.]+) .*safari\//i], [v, [f, "GSA"]], [/musical_ly(?:.+app_?version\/|_)([\w\.]+)/i], [v, [f, "TikTok"]], [/headlesschrome(?:\/([\w\.]+)| )/i], [v, [f, C + " Headless"]], [/ wv\).+(chrome)\/([\w\.]+)/i], [[f, C + " WebView"], v], [/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i], [v, [f, "Android " + R]], [/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i], [f, v], [/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i], [v, [f, "Mobile Safari"]], [/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i], [v, f], [/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i], [f, [v, Y, { "1.0": "/8", 1.2: "/1", 1.3: "/3", "2.0": "/412", "2.0.2": "/416", "2.0.3": "/417", "2.0.4": "/419", "?": "/" }]], [/(webkit|khtml)\/([\w\.]+)/i], [f, v], [/(navigator|netscape\d?)\/([-\w\.]+)/i], [[f, "Netscape"], v], [/mobile vr; rv:([\w\.]+)\).+firefox/i], [v, [f, j + " Reality"]], [/ekiohf.+(flow)\/([\w\.]+)/i, /(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i, /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i, /(firefox)\/([\w\.]+)/i, /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i, /(links) \(([\w\.]+)/i, /panasonic;(viera)/i], [f, v], [/(cobalt)\/([\w\.]+)/i], [f, [v, /master.|lts./, ""]]], cpu: [[/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i], [[b, "amd64"]], [/(ia32(?=;))/i], [[b, K]], [/((?:i[346]|x)86)[;\)]/i], [[b, "ia32"]], [/\b(aarch64|arm(v?8e?l?|_?64))\b/i], [[b, "arm64"]], [/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i], [[b, "armhf"]], [/windows (ce|mobile); ppc;/i], [[b, "arm"]], [/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i], [[b, /ower/, "", K]], [/(sun4\w)[;\)]/i], [[b, "sparc"]], [/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i], [[b, K]]], device: [[/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i], [p, [m, M], [g, _]], [/\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i, /samsung[- ]([-\w]+)/i, /sec-(sgh\w+)/i], [p, [m, M], [g, y]], [/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i], [p, [m, O], [g, y]], [/\((ipad);[-\w\),; ]+apple/i, /applecoremedia\/[\w\.]+ \((ipad)/i, /\b(ipad)\d\d?,\d\d?[;\]].+ios/i], [p, [m, O], [g, _]], [/(macintosh);/i], [p, [m, O]], [/\b(sh-?[altvz]?\d\d[a-ekm]?)/i], [p, [m, D], [g, y]], [/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i], [p, [m, I], [g, _]], [/(?:huawei|honor)([-\w ]+)[;\)]/i, /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i], [p, [m, I], [g, y]], [/\b(poco[\w ]+)(?: bui|\))/i, /\b; (\w+) build\/hm\1/i, /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i, /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i, /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i], [[p, /_/g, " "], [m, q], [g, y]], [/\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i], [[p, /_/g, " "], [m, q], [g, _]], [/; (\w+) bui.+ oppo/i, /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i], [p, [m, "OPPO"], [g, y]], [/vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i], [p, [m, "Vivo"], [g, y]], [/\b(rmx[12]\d{3})(?: bui|;|\))/i], [p, [m, "Realme"], [g, y]], [/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i, /\bmot(?:orola)?[- ](\w*)/i, /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i], [p, [m, L], [g, y]], [/\b(mz60\d|xoom[2 ]{0,2}) build\//i], [p, [m, L], [g, _]], [/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i], [p, [m, "LG"], [g, _]], [/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i, /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i, /\blg-?([\d\w]+) bui/i], [p, [m, "LG"], [g, y]], [/(ideatab[-\w ]+)/i, /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i], [p, [m, "Lenovo"], [g, _]], [/(?:maemo|nokia).*(n900|lumia \d+)/i, /nokia[-_ ]?([-\w\.]*)/i], [[p, /_/g, " "], [m, "Nokia"], [g, y]], [/(pixel c)\b/i], [p, [m, A], [g, _]], [/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i], [p, [m, A], [g, y]], [/droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i], [p, [m, U], [g, y]], [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i], [[p, "Xperia Tablet"], [m, U], [g, _]], [/ (kb2005|in20[12]5|be20[12][59])\b/i, /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i], [p, [m, "OnePlus"], [g, y]], [/(alexa)webm/i, /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i, /(kf[a-z]+)( bui|\)).+silk\//i], [p, [m, T], [g, _]], [/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i], [[p, /(.+)/g, "Fire Phone $1"], [m, T], [g, y]], [/(playbook);[-\w\),; ]+(rim)/i], [p, m, [g, _]], [/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i], [p, [m, P], [g, y]], [/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i], [p, [m, E], [g, _]], [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i], [p, [m, E], [g, y]], [/(nexus 9)/i], [p, [m, "HTC"], [g, _]], [/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i, /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i, /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i], [m, [p, /_/g, " "], [g, y]], [/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i], [p, [m, "Acer"], [g, _]], [/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i], [p, [m, "Meizu"], [g, y]], [/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i, /(hp) ([\w ]+\w)/i, /(asus)-?(\w+)/i, /(microsoft); (lumia[\w ]+)/i, /(lenovo)[-_ ]?([-\w]+)/i, /(jolla)/i, /(oppo) ?([\w ]+) bui/i], [m, p, [g, y]], [/(kobo)\s(ereader|touch)/i, /(archos) (gamepad2?)/i, /(hp).+(touchpad(?!.+tablet)|tablet)/i, /(kindle)\/([\w\.]+)/i, /(nook)[\w ]+build\/(\w+)/i, /(dell) (strea[kpr\d ]*[\dko])/i, /(le[- ]+pan)[- ]+(\w{1,9}) bui/i, /(trinity)[- ]*(t\d{3}) bui/i, /(gigaset)[- ]+(q\w{1,9}) bui/i, /(vodafone) ([\w ]+)(?:\)| bui)/i], [m, p, [g, _]], [/(surface duo)/i], [p, [m, N], [g, _]], [/droid [\d\.]+; (fp\du?)(?: b|\))/i], [p, [m, "Fairphone"], [g, y]], [/(u304aa)/i], [p, [m, "AT&T"], [g, y]], [/\bsie-(\w*)/i], [p, [m, "Siemens"], [g, y]], [/\b(rct\w+) b/i], [p, [m, "RCA"], [g, _]], [/\b(venue[\d ]{2,7}) b/i], [p, [m, "Dell"], [g, _]], [/\b(q(?:mv|ta)\w+) b/i], [p, [m, "Verizon"], [g, _]], [/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i], [p, [m, "Barnes & Noble"], [g, _]], [/\b(tm\d{3}\w+) b/i], [p, [m, "NuVision"], [g, _]], [/\b(k88) b/i], [p, [m, "ZTE"], [g, _]], [/\b(nx\d{3}j) b/i], [p, [m, "ZTE"], [g, y]], [/\b(gen\d{3}) b.+49h/i], [p, [m, "Swiss"], [g, y]], [/\b(zur\d{3}) b/i], [p, [m, "Swiss"], [g, _]], [/\b((zeki)?tb.*\b) b/i], [p, [m, "Zeki"], [g, _]], [/\b([yr]\d{2}) b/i, /\b(dragon[- ]+touch |dt)(\w{5}) b/i], [[m, "Dragon Touch"], p, [g, _]], [/\b(ns-?\w{0,9}) b/i], [p, [m, "Insignia"], [g, _]], [/\b((nxa|next)-?\w{0,9}) b/i], [p, [m, "NextBook"], [g, _]], [/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i], [[m, "Voice"], p, [g, y]], [/\b(lvtel\-)?(v1[12]) b/i], [[m, "LvTel"], p, [g, y]], [/\b(ph-1) /i], [p, [m, "Essential"], [g, y]], [/\b(v(100md|700na|7011|917g).*\b) b/i], [p, [m, "Envizen"], [g, _]], [/\b(trio[-\w\. ]+) b/i], [p, [m, "MachSpeed"], [g, _]], [/\btu_(1491) b/i], [p, [m, "Rotor"], [g, _]], [/(shield[\w ]+) b/i], [p, [m, "Nvidia"], [g, _]], [/(sprint) (\w+)/i], [m, p, [g, y]], [/(kin\.[onetw]{3})/i], [[p, /\./g, " "], [m, N], [g, y]], [/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i], [p, [m, B], [g, _]], [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i], [p, [m, B], [g, y]], [/smart-tv.+(samsung)/i], [m, [g, S]], [/hbbtv.+maple;(\d+)/i], [[p, /^/, "SmartTV"], [m, M], [g, S]], [/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i], [[m, "LG"], [g, S]], [/(apple) ?tv/i], [m, [p, O + " TV"], [g, S]], [/crkey/i], [[p, C + "cast"], [m, A], [g, S]], [/droid.+aft(\w)( bui|\))/i], [p, [m, T], [g, S]], [/\(dtv[\);].+(aquos)/i, /(aquos-tv[\w ]+)\)/i], [p, [m, D], [g, S]], [/(bravia[\w ]+)( bui|\))/i], [p, [m, U], [g, S]], [/(mitv-\w{5}) bui/i], [p, [m, q], [g, S]], [/Hbbtv.*(technisat) (.*);/i], [m, p, [g, S]], [/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i, /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i], [[m, J], [p, J], [g, S]], [/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i], [[g, S]], [/(ouya)/i, /(nintendo) ([wids3utch]+)/i], [m, p, [g, w]], [/droid.+; (shield) bui/i], [p, [m, "Nvidia"], [g, w]], [/(playstation [345portablevi]+)/i], [p, [m, U], [g, w]], [/\b(xbox(?: one)?(?!; xbox))[\); ]/i], [p, [m, N], [g, w]], [/((pebble))app/i], [m, p, [g, k]], [/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i], [p, [m, O], [g, k]], [/droid.+; (glass) \d/i], [p, [m, A], [g, k]], [/droid.+; (wt63?0{2,3})\)/i], [p, [m, B], [g, k]], [/(quest( 2| pro)?)/i], [p, [m, V], [g, k]], [/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i], [m, [g, x]], [/(aeobc)\b/i], [p, [m, T], [g, x]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i], [p, [g, y]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i], [p, [g, _]], [/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i], [[g, _]], [/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i], [[g, y]], [/(android[-\w\. ]{0,9});.+buil/i], [p, [m, "Generic"]]], engine: [[/windows.+ edge\/([\w\.]+)/i], [v, [f, "EdgeHTML"]], [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i], [v, [f, "Blink"]], [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, /ekioh(flow)\/([\w\.]+)/i, /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i, /(icab)[\/ ]([23]\.[\d\.]+)/i, /\b(libweb)/i], [f, v], [/rv\:([\w\.]{1,9})\b.+(gecko)/i], [v, f]], os: [[/microsoft (windows) (vista|xp)/i], [f, v], [/(windows) nt 6\.2; (arm)/i, /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i, /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i], [f, [v, Y, Q]], [/(win(?=3|9|n)|win 9x )([nt\d\.]+)/i], [[f, "Windows"], [v, Y, Q]], [/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i, /ios;fbsv\/([\d\.]+)/i, /cfnetwork\/.+darwin/i], [[v, /_/g, "."], [f, "iOS"]], [/(mac os x) ?([\w\. ]*)/i, /(macintosh|mac_powerpc\b)(?!.+haiku)/i], [[f, H], [v, /_/g, "."]], [/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i], [v, f], [/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i, /(blackberry)\w*\/([\w\.]*)/i, /(tizen|kaios)[\/ ]([\w\.]+)/i, /\((series40);/i], [f, v], [/\(bb(10);/i], [v, [f, P]], [/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i], [v, [f, "Symbian"]], [/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i], [v, [f, j + " OS"]], [/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i], [v, [f, "webOS"]], [/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i], [v, [f, "watchOS"]], [/crkey\/([\d\.]+)/i], [v, [f, C + "cast"]], [/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i], [[f, F], v], [/panasonic;(viera)/i, /(netrange)mmh/i, /(nettv)\/(\d+\.[\w\.]+)/i, /(nintendo|playstation) ([wids345portablevuch]+)/i, /(xbox); +xbox ([^\);]+)/i, /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i, /(mint)[\/\(\) ]?(\w*)/i, /(mageia|vectorlinux)[; ]/i, /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i, /(hurd|linux) ?([\w\.]*)/i, /(gnu) ?([\w\.]*)/i, /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, /(haiku) (\w+)/i], [f, v], [/(sunos) ?([\w\.\d]*)/i], [[f, "Solaris"], v], [/((?:open)?solaris)[-\/ ]?([\w\.]*)/i, /(aix) ((\d)(?=\.|\)| )[\w\.])*/i, /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i, /(unix) ?([\w\.]*)/i], [f, v]] }, ee = function(e2, t2) {
              if (typeof e2 === c && (t2 = e2, e2 = o2), !(this instanceof ee)) return new ee(e2, t2).getResult();
              var r2 = typeof a2 !== u && a2.navigator ? a2.navigator : o2, i2 = e2 || (r2 && r2.userAgent ? r2.userAgent : ""), s3 = r2 && r2.userAgentData ? r2.userAgentData : o2, n3 = t2 ? G(Z, t2) : Z, w2 = r2 && r2.userAgent == i2;
              return this.getBrowser = function() {
                var e3, t3 = {};
                return t3[f] = o2, t3[v] = o2, X.call(t3, i2, n3.browser), t3[d] = typeof (e3 = t3[v]) === h ? e3.replace(/[^\d\.]/g, "").split(".")[0] : o2, w2 && r2 && r2.brave && typeof r2.brave.isBrave == l && (t3[f] = "Brave"), t3;
              }, this.getCPU = function() {
                var e3 = {};
                return e3[b] = o2, X.call(e3, i2, n3.cpu), e3;
              }, this.getDevice = function() {
                var e3 = {};
                return e3[m] = o2, e3[p] = o2, e3[g] = o2, X.call(e3, i2, n3.device), w2 && !e3[g] && s3 && s3.mobile && (e3[g] = y), w2 && "Macintosh" == e3[p] && r2 && typeof r2.standalone !== u && r2.maxTouchPoints && r2.maxTouchPoints > 2 && (e3[p] = "iPad", e3[g] = _), e3;
              }, this.getEngine = function() {
                var e3 = {};
                return e3[f] = o2, e3[v] = o2, X.call(e3, i2, n3.engine), e3;
              }, this.getOS = function() {
                var e3 = {};
                return e3[f] = o2, e3[v] = o2, X.call(e3, i2, n3.os), w2 && !e3[f] && s3 && "Unknown" != s3.platform && (e3[f] = s3.platform.replace(/chrome os/i, F).replace(/macos/i, H)), e3;
              }, this.getResult = function() {
                return { ua: this.getUA(), browser: this.getBrowser(), engine: this.getEngine(), os: this.getOS(), device: this.getDevice(), cpu: this.getCPU() };
              }, this.getUA = function() {
                return i2;
              }, this.setUA = function(e3) {
                return i2 = typeof e3 === h && e3.length > 350 ? J(e3, 350) : e3, this;
              }, this.setUA(i2), this;
            };
            ee.VERSION = "1.0.35", ee.BROWSER = z([f, v, d]), ee.CPU = z([b]), ee.DEVICE = z([p, m, g, w, y, S, _, k, x]), ee.ENGINE = ee.OS = z([f, v]), typeof n2 !== u ? (s2.exports && (n2 = s2.exports = ee), n2.UAParser = ee) : r.amdO ? void 0 !== (i = function() {
              return ee;
            }.call(t, r, t, e)) && (e.exports = i) : typeof a2 !== u && (a2.UAParser = ee);
            var et = typeof a2 !== u && (a2.jQuery || a2.Zepto);
            if (et && !et.ua) {
              var er = new ee();
              et.ua = er.getResult(), et.ua.get = function() {
                return er.getUA();
              }, et.ua.set = function(e2) {
                er.setUA(e2);
                var t2 = er.getResult();
                for (var r2 in t2) et.ua[r2] = t2[r2];
              };
            }
          }("object" == typeof window ? window : this);
        } }, n = {};
        function a(e2) {
          var t2 = n[e2];
          if (void 0 !== t2) return t2.exports;
          var r2 = n[e2] = { exports: {} }, i2 = true;
          try {
            s[e2].call(r2.exports, r2, r2.exports, a), i2 = false;
          } finally {
            i2 && delete n[e2];
          }
          return r2.exports;
        }
        a.ab = "//";
        var o = a(226);
        e.exports = o;
      })();
    }, 635: (e, t, r) => {
      "use strict";
      function i() {
        throw Error('ImageResponse moved from "next/server" to "next/og" since Next.js 14, please import from "next/og" instead');
      }
      r.r(t), r.d(t, { ImageResponse: () => i, NextRequest: () => s.I, NextResponse: () => n.x, URLPattern: () => c, userAgent: () => u, userAgentFromString: () => l });
      var s = r(669), n = r(241), a = r(340), o = r.n(a);
      function l(e2) {
        return { ...o()(e2), isBot: void 0 !== e2 && /Googlebot|Mediapartners-Google|AdsBot-Google|googleweblight|Storebot-Google|Google-PageRenderer|Google-InspectionTool|Bingbot|BingPreview|Slurp|DuckDuckBot|baiduspider|yandex|sogou|LinkedInBot|bitlybot|tumblr|vkShare|quora link preview|facebookexternalhit|facebookcatalog|Twitterbot|applebot|redditbot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|ia_archiver/i.test(e2) };
      }
      function u({ headers: e2 }) {
        return l(e2.get("user-agent") || void 0);
      }
      let c = "undefined" == typeof URLPattern ? void 0 : URLPattern;
    }, 300: (e, t, r) => {
      "use strict";
      r.d(t, { Qq: () => a, dN: () => i, u7: () => s, y3: () => n });
      let i = "nxtP", s = "nxtI", n = "x-prerender-revalidate", a = "x-prerender-revalidate-if-generated", o = { shared: "shared", reactServerComponents: "rsc", serverSideRendering: "ssr", actionBrowser: "action-browser", api: "api", middleware: "middleware", instrument: "instrument", edgeAsset: "edge-asset", appPagesBrowser: "app-pages-browser", appMetadataRoute: "app-metadata-route", appRouteHandler: "app-route-handler" };
      ({ ...o, GROUP: { serverOnly: [o.reactServerComponents, o.actionBrowser, o.appMetadataRoute, o.appRouteHandler, o.instrument], clientOnly: [o.serverSideRendering, o.appPagesBrowser], nonClientServerTarget: [o.middleware, o.api], app: [o.reactServerComponents, o.actionBrowser, o.appMetadataRoute, o.appRouteHandler, o.serverSideRendering, o.appPagesBrowser, o.shared, o.instrument] } });
    }, 416: (e, t, r) => {
      "use strict";
      r.d(t, { Y5: () => n, cR: () => s, qJ: () => i });
      class i extends Error {
        constructor({ page: e2 }) {
          super(`The middleware "${e2}" accepts an async API directly with the form:
  
  export function middleware(request, event) {
    return NextResponse.redirect('/new-location')
  }
  
  Read more: https://nextjs.org/docs/messages/middleware-new-signature
  `);
        }
      }
      class s extends Error {
        constructor() {
          super(`The request.page has been deprecated in favour of \`URLPattern\`.
  Read more: https://nextjs.org/docs/messages/middleware-request-page
  `);
        }
      }
      class n extends Error {
        constructor() {
          super(`The request.ua has been removed in favour of \`userAgent\` function.
  Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent
  `);
        }
      }
    }, 718: (e, t, r) => {
      "use strict";
      function i(e2) {
        return e2.replace(/\/$/, "") || "/";
      }
      function s(e2) {
        let t2 = e2.indexOf("#"), r2 = e2.indexOf("?"), i2 = r2 > -1 && (t2 < 0 || r2 < t2);
        return i2 || t2 > -1 ? { pathname: e2.substring(0, i2 ? r2 : t2), query: i2 ? e2.substring(r2, t2 > -1 ? t2 : void 0) : "", hash: t2 > -1 ? e2.slice(t2) : "" } : { pathname: e2, query: "", hash: "" };
      }
      function n(e2, t2) {
        if (!e2.startsWith("/") || !t2) return e2;
        let { pathname: r2, query: i2, hash: n2 } = s(e2);
        return "" + t2 + r2 + i2 + n2;
      }
      function a(e2, t2) {
        if (!e2.startsWith("/") || !t2) return e2;
        let { pathname: r2, query: i2, hash: n2 } = s(e2);
        return "" + r2 + t2 + i2 + n2;
      }
      function o(e2, t2) {
        if ("string" != typeof e2) return false;
        let { pathname: r2 } = s(e2);
        return r2 === t2 || r2.startsWith(t2 + "/");
      }
      function l(e2, t2) {
        let r2;
        let i2 = e2.split("/");
        return (t2 || []).some((t3) => !!i2[1] && i2[1].toLowerCase() === t3.toLowerCase() && (r2 = t3, i2.splice(1, 1), e2 = i2.join("/") || "/", true)), { pathname: e2, detectedLocale: r2 };
      }
      r.d(t, { c: () => d });
      let u = /(?!^https?:\/\/)(127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|\[::1\]|localhost)/;
      function c(e2, t2) {
        return new URL(String(e2).replace(u, "localhost"), t2 && String(t2).replace(u, "localhost"));
      }
      let h = Symbol("NextURLInternal");
      class d {
        constructor(e2, t2, r2) {
          let i2, s2;
          "object" == typeof t2 && "pathname" in t2 || "string" == typeof t2 ? (i2 = t2, s2 = r2 || {}) : s2 = r2 || t2 || {}, this[h] = { url: c(e2, i2 ?? s2.base), options: s2, basePath: "" }, this.analyze();
        }
        analyze() {
          var e2, t2, r2, i2, s2;
          let n2 = function(e3, t3) {
            var r3, i3;
            let { basePath: s3, i18n: n3, trailingSlash: a3 } = null != (r3 = t3.nextConfig) ? r3 : {}, u3 = { pathname: e3, trailingSlash: "/" !== e3 ? e3.endsWith("/") : a3 };
            s3 && o(u3.pathname, s3) && (u3.pathname = function(e4, t4) {
              if (!o(e4, t4)) return e4;
              let r4 = e4.slice(t4.length);
              return r4.startsWith("/") ? r4 : "/" + r4;
            }(u3.pathname, s3), u3.basePath = s3);
            let c2 = u3.pathname;
            if (u3.pathname.startsWith("/_next/data/") && u3.pathname.endsWith(".json")) {
              let e4 = u3.pathname.replace(/^\/_next\/data\//, "").replace(/\.json$/, "").split("/"), r4 = e4[0];
              u3.buildId = r4, c2 = "index" !== e4[1] ? "/" + e4.slice(1).join("/") : "/", true === t3.parseData && (u3.pathname = c2);
            }
            if (n3) {
              let e4 = t3.i18nProvider ? t3.i18nProvider.analyze(u3.pathname) : l(u3.pathname, n3.locales);
              u3.locale = e4.detectedLocale, u3.pathname = null != (i3 = e4.pathname) ? i3 : u3.pathname, !e4.detectedLocale && u3.buildId && (e4 = t3.i18nProvider ? t3.i18nProvider.analyze(c2) : l(c2, n3.locales)).detectedLocale && (u3.locale = e4.detectedLocale);
            }
            return u3;
          }(this[h].url.pathname, { nextConfig: this[h].options.nextConfig, parseData: true, i18nProvider: this[h].options.i18nProvider }), a2 = function(e3, t3) {
            let r3;
            if ((null == t3 ? void 0 : t3.host) && !Array.isArray(t3.host)) r3 = t3.host.toString().split(":", 1)[0];
            else {
              if (!e3.hostname) return;
              r3 = e3.hostname;
            }
            return r3.toLowerCase();
          }(this[h].url, this[h].options.headers);
          this[h].domainLocale = this[h].options.i18nProvider ? this[h].options.i18nProvider.detectDomainLocale(a2) : function(e3, t3, r3) {
            if (e3) for (let n3 of (r3 && (r3 = r3.toLowerCase()), e3)) {
              var i3, s3;
              if (t3 === (null == (i3 = n3.domain) ? void 0 : i3.split(":", 1)[0].toLowerCase()) || r3 === n3.defaultLocale.toLowerCase() || (null == (s3 = n3.locales) ? void 0 : s3.some((e4) => e4.toLowerCase() === r3))) return n3;
            }
          }(null == (t2 = this[h].options.nextConfig) ? void 0 : null == (e2 = t2.i18n) ? void 0 : e2.domains, a2);
          let u2 = (null == (r2 = this[h].domainLocale) ? void 0 : r2.defaultLocale) || (null == (s2 = this[h].options.nextConfig) ? void 0 : null == (i2 = s2.i18n) ? void 0 : i2.defaultLocale);
          this[h].url.pathname = n2.pathname, this[h].defaultLocale = u2, this[h].basePath = n2.basePath ?? "", this[h].buildId = n2.buildId, this[h].locale = n2.locale ?? u2, this[h].trailingSlash = n2.trailingSlash;
        }
        formatPathname() {
          var e2;
          let t2;
          return t2 = function(e3, t3, r2, i2) {
            if (!t3 || t3 === r2) return e3;
            let s2 = e3.toLowerCase();
            return !i2 && (o(s2, "/api") || o(s2, "/" + t3.toLowerCase())) ? e3 : n(e3, "/" + t3);
          }((e2 = { basePath: this[h].basePath, buildId: this[h].buildId, defaultLocale: this[h].options.forceLocale ? void 0 : this[h].defaultLocale, locale: this[h].locale, pathname: this[h].url.pathname, trailingSlash: this[h].trailingSlash }).pathname, e2.locale, e2.buildId ? void 0 : e2.defaultLocale, e2.ignorePrefix), (e2.buildId || !e2.trailingSlash) && (t2 = i(t2)), e2.buildId && (t2 = a(n(t2, "/_next/data/" + e2.buildId), "/" === e2.pathname ? "index.json" : ".json")), t2 = n(t2, e2.basePath), !e2.buildId && e2.trailingSlash ? t2.endsWith("/") ? t2 : a(t2, "/") : i(t2);
        }
        formatSearch() {
          return this[h].url.search;
        }
        get buildId() {
          return this[h].buildId;
        }
        set buildId(e2) {
          this[h].buildId = e2;
        }
        get locale() {
          return this[h].locale ?? "";
        }
        set locale(e2) {
          var t2, r2;
          if (!this[h].locale || !(null == (r2 = this[h].options.nextConfig) ? void 0 : null == (t2 = r2.i18n) ? void 0 : t2.locales.includes(e2))) throw TypeError(`The NextURL configuration includes no locale "${e2}"`);
          this[h].locale = e2;
        }
        get defaultLocale() {
          return this[h].defaultLocale;
        }
        get domainLocale() {
          return this[h].domainLocale;
        }
        get searchParams() {
          return this[h].url.searchParams;
        }
        get host() {
          return this[h].url.host;
        }
        set host(e2) {
          this[h].url.host = e2;
        }
        get hostname() {
          return this[h].url.hostname;
        }
        set hostname(e2) {
          this[h].url.hostname = e2;
        }
        get port() {
          return this[h].url.port;
        }
        set port(e2) {
          this[h].url.port = e2;
        }
        get protocol() {
          return this[h].url.protocol;
        }
        set protocol(e2) {
          this[h].url.protocol = e2;
        }
        get href() {
          let e2 = this.formatPathname(), t2 = this.formatSearch();
          return `${this.protocol}//${this.host}${e2}${t2}${this.hash}`;
        }
        set href(e2) {
          this[h].url = c(e2), this.analyze();
        }
        get origin() {
          return this[h].url.origin;
        }
        get pathname() {
          return this[h].url.pathname;
        }
        set pathname(e2) {
          this[h].url.pathname = e2;
        }
        get hash() {
          return this[h].url.hash;
        }
        set hash(e2) {
          this[h].url.hash = e2;
        }
        get search() {
          return this[h].url.search;
        }
        set search(e2) {
          this[h].url.search = e2;
        }
        get password() {
          return this[h].url.password;
        }
        set password(e2) {
          this[h].url.password = e2;
        }
        get username() {
          return this[h].url.username;
        }
        set username(e2) {
          this[h].url.username = e2;
        }
        get basePath() {
          return this[h].basePath;
        }
        set basePath(e2) {
          this[h].basePath = e2.startsWith("/") ? e2 : `/${e2}`;
        }
        toString() {
          return this.href;
        }
        toJSON() {
          return this.href;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { href: this.href, origin: this.origin, protocol: this.protocol, username: this.username, password: this.password, host: this.host, hostname: this.hostname, port: this.port, pathname: this.pathname, search: this.search, searchParams: this.searchParams, hash: this.hash };
        }
        clone() {
          return new d(String(this), this[h].options);
        }
      }
    }, 217: (e, t, r) => {
      "use strict";
      r.d(t, { g: () => i });
      class i {
        static get(e2, t2, r2) {
          let i2 = Reflect.get(e2, t2, r2);
          return "function" == typeof i2 ? i2.bind(e2) : i2;
        }
        static set(e2, t2, r2, i2) {
          return Reflect.set(e2, t2, r2, i2);
        }
        static has(e2, t2) {
          return Reflect.has(e2, t2);
        }
        static deleteProperty(e2, t2) {
          return Reflect.deleteProperty(e2, t2);
        }
      }
    }, 938: (e, t, r) => {
      "use strict";
      r.d(t, { Q7: () => i.stringifyCookie, nV: () => i.ResponseCookies, qC: () => i.RequestCookies });
      var i = r(945);
    }, 669: (e, t, r) => {
      "use strict";
      r.d(t, { I: () => l });
      var i = r(718), s = r(329), n = r(416), a = r(938);
      let o = Symbol("internal request");
      class l extends Request {
        constructor(e2, t2 = {}) {
          let r2 = "string" != typeof e2 && "url" in e2 ? e2.url : String(e2);
          (0, s.r4)(r2), e2 instanceof Request ? super(e2, t2) : super(r2, t2);
          let n2 = new i.c(r2, { headers: (0, s.lb)(this.headers), nextConfig: t2.nextConfig });
          this[o] = { cookies: new a.qC(this.headers), geo: t2.geo || {}, ip: t2.ip, nextUrl: n2, url: n2.toString() };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, geo: this.geo, ip: this.ip, nextUrl: this.nextUrl, url: this.url, bodyUsed: this.bodyUsed, cache: this.cache, credentials: this.credentials, destination: this.destination, headers: Object.fromEntries(this.headers), integrity: this.integrity, keepalive: this.keepalive, method: this.method, mode: this.mode, redirect: this.redirect, referrer: this.referrer, referrerPolicy: this.referrerPolicy, signal: this.signal };
        }
        get cookies() {
          return this[o].cookies;
        }
        get geo() {
          return this[o].geo;
        }
        get ip() {
          return this[o].ip;
        }
        get nextUrl() {
          return this[o].nextUrl;
        }
        get page() {
          throw new n.cR();
        }
        get ua() {
          throw new n.Y5();
        }
        get url() {
          return this[o].url;
        }
      }
    }, 241: (e, t, r) => {
      "use strict";
      r.d(t, { x: () => c });
      var i = r(938), s = r(718), n = r(329), a = r(217);
      let o = Symbol("internal response"), l = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
      function u(e2, t2) {
        var r2;
        if (null == e2 ? void 0 : null == (r2 = e2.request) ? void 0 : r2.headers) {
          if (!(e2.request.headers instanceof Headers)) throw Error("request.headers must be an instance of Headers");
          let r3 = [];
          for (let [i2, s2] of e2.request.headers) t2.set("x-middleware-request-" + i2, s2), r3.push(i2);
          t2.set("x-middleware-override-headers", r3.join(","));
        }
      }
      class c extends Response {
        constructor(e2, t2 = {}) {
          super(e2, t2);
          let r2 = this.headers, l2 = new Proxy(new i.nV(r2), { get(e3, s2, n2) {
            switch (s2) {
              case "delete":
              case "set":
                return (...n3) => {
                  let a2 = Reflect.apply(e3[s2], e3, n3), o2 = new Headers(r2);
                  return a2 instanceof i.nV && r2.set("x-middleware-set-cookie", a2.getAll().map((e4) => (0, i.Q7)(e4)).join(",")), u(t2, o2), a2;
                };
              default:
                return a.g.get(e3, s2, n2);
            }
          } });
          this[o] = { cookies: l2, url: t2.url ? new s.c(t2.url, { headers: (0, n.lb)(r2), nextConfig: t2.nextConfig }) : void 0 };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, url: this.url, body: this.body, bodyUsed: this.bodyUsed, headers: Object.fromEntries(this.headers), ok: this.ok, redirected: this.redirected, status: this.status, statusText: this.statusText, type: this.type };
        }
        get cookies() {
          return this[o].cookies;
        }
        static json(e2, t2) {
          let r2 = Response.json(e2, t2);
          return new c(r2.body, r2);
        }
        static redirect(e2, t2) {
          let r2 = "number" == typeof t2 ? t2 : (null == t2 ? void 0 : t2.status) ?? 307;
          if (!l.has(r2)) throw RangeError('Failed to execute "redirect" on "response": Invalid status code');
          let i2 = "object" == typeof t2 ? t2 : {}, s2 = new Headers(null == i2 ? void 0 : i2.headers);
          return s2.set("Location", (0, n.r4)(e2)), new c(null, { ...i2, headers: s2, status: r2 });
        }
        static rewrite(e2, t2) {
          let r2 = new Headers(null == t2 ? void 0 : t2.headers);
          return r2.set("x-middleware-rewrite", (0, n.r4)(e2)), u(t2, r2), new c(null, { ...t2, headers: r2 });
        }
        static next(e2) {
          let t2 = new Headers(null == e2 ? void 0 : e2.headers);
          return t2.set("x-middleware-next", "1"), u(e2, t2), new c(null, { ...e2, headers: t2 });
        }
      }
    }, 329: (e, t, r) => {
      "use strict";
      r.d(t, { EK: () => s, LI: () => l, l$: () => n, lb: () => a, r4: () => o });
      var i = r(300);
      function s(e2) {
        let t2 = new Headers();
        for (let [r2, i2] of Object.entries(e2)) for (let e3 of Array.isArray(i2) ? i2 : [i2]) void 0 !== e3 && ("number" == typeof e3 && (e3 = e3.toString()), t2.append(r2, e3));
        return t2;
      }
      function n(e2) {
        var t2, r2, i2, s2, n2, a2 = [], o2 = 0;
        function l2() {
          for (; o2 < e2.length && /\s/.test(e2.charAt(o2)); ) o2 += 1;
          return o2 < e2.length;
        }
        for (; o2 < e2.length; ) {
          for (t2 = o2, n2 = false; l2(); ) if ("," === (r2 = e2.charAt(o2))) {
            for (i2 = o2, o2 += 1, l2(), s2 = o2; o2 < e2.length && "=" !== (r2 = e2.charAt(o2)) && ";" !== r2 && "," !== r2; ) o2 += 1;
            o2 < e2.length && "=" === e2.charAt(o2) ? (n2 = true, o2 = s2, a2.push(e2.substring(t2, i2)), t2 = o2) : o2 = i2 + 1;
          } else o2 += 1;
          (!n2 || o2 >= e2.length) && a2.push(e2.substring(t2, e2.length));
        }
        return a2;
      }
      function a(e2) {
        let t2 = {}, r2 = [];
        if (e2) for (let [i2, s2] of e2.entries()) "set-cookie" === i2.toLowerCase() ? (r2.push(...n(s2)), t2[i2] = 1 === r2.length ? r2[0] : r2) : t2[i2] = s2;
        return t2;
      }
      function o(e2) {
        try {
          return String(new URL(String(e2)));
        } catch (t2) {
          throw Error(`URL is malformed "${String(e2)}". Please use only absolute URLs - https://nextjs.org/docs/messages/middleware-relative-urls`, { cause: t2 });
        }
      }
      function l(e2, t2) {
        for (let r2 of [i.dN, i.u7]) e2 !== r2 && e2.startsWith(r2) && t2(e2.substring(r2.length));
      }
    }, 488: (e, t, r) => {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: true }), function(e2, t2) {
        for (var r2 in t2) Object.defineProperty(e2, r2, { enumerable: true, get: t2[r2] });
      }(t, { getTestReqInfo: function() {
        return a;
      }, withRequest: function() {
        return n;
      } });
      let i = new (r(67)).AsyncLocalStorage();
      function s(e2, t2) {
        let r2 = t2.header(e2, "next-test-proxy-port");
        if (r2) return { url: t2.url(e2), proxyPort: Number(r2), testData: t2.header(e2, "next-test-data") || "" };
      }
      function n(e2, t2, r2) {
        let n2 = s(e2, t2);
        return n2 ? i.run(n2, r2) : r2();
      }
      function a(e2, t2) {
        return i.getStore() || (e2 && t2 ? s(e2, t2) : void 0);
      }
    }, 375: (e, t, r) => {
      "use strict";
      var i = r(195).Buffer;
      Object.defineProperty(t, "__esModule", { value: true }), function(e2, t2) {
        for (var r2 in t2) Object.defineProperty(e2, r2, { enumerable: true, get: t2[r2] });
      }(t, { handleFetch: function() {
        return o;
      }, interceptFetch: function() {
        return l;
      }, reader: function() {
        return n;
      } });
      let s = r(488), n = { url: (e2) => e2.url, header: (e2, t2) => e2.headers.get(t2) };
      async function a(e2, t2) {
        let { url: r2, method: s2, headers: n2, body: a2, cache: o2, credentials: l2, integrity: u, mode: c, redirect: h, referrer: d, referrerPolicy: p } = t2;
        return { testData: e2, api: "fetch", request: { url: r2, method: s2, headers: [...Array.from(n2), ["next-test-stack", function() {
          let e3 = (Error().stack ?? "").split("\n");
          for (let t3 = 1; t3 < e3.length; t3++) if (e3[t3].length > 0) {
            e3 = e3.slice(t3);
            break;
          }
          return (e3 = (e3 = (e3 = e3.filter((e4) => !e4.includes("/next/dist/"))).slice(0, 5)).map((e4) => e4.replace("webpack-internal:///(rsc)/", "").trim())).join("    ");
        }()]], body: a2 ? i.from(await t2.arrayBuffer()).toString("base64") : null, cache: o2, credentials: l2, integrity: u, mode: c, redirect: h, referrer: d, referrerPolicy: p } };
      }
      async function o(e2, t2) {
        let r2 = (0, s.getTestReqInfo)(t2, n);
        if (!r2) return e2(t2);
        let { testData: o2, proxyPort: l2 } = r2, u = await a(o2, t2), c = await e2(`http://localhost:${l2}`, { method: "POST", body: JSON.stringify(u), next: { internal: true } });
        if (!c.ok) throw Error(`Proxy request failed: ${c.status}`);
        let h = await c.json(), { api: d } = h;
        switch (d) {
          case "continue":
            return e2(t2);
          case "abort":
          case "unhandled":
            throw Error(`Proxy request aborted [${t2.method} ${t2.url}]`);
        }
        return function(e3) {
          let { status: t3, headers: r3, body: s2 } = e3.response;
          return new Response(s2 ? i.from(s2, "base64") : null, { status: t3, headers: new Headers(r3) });
        }(h);
      }
      function l(e2) {
        return r.g.fetch = function(t2, r2) {
          var i2;
          return (null == r2 ? void 0 : null == (i2 = r2.next) ? void 0 : i2.internal) ? e2(t2, r2) : o(e2, new Request(t2, r2));
        }, () => {
          r.g.fetch = e2;
        };
      }
    }, 177: (e, t, r) => {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: true }), function(e2, t2) {
        for (var r2 in t2) Object.defineProperty(e2, r2, { enumerable: true, get: t2[r2] });
      }(t, { interceptTestApis: function() {
        return n;
      }, wrapRequestHandler: function() {
        return a;
      } });
      let i = r(488), s = r(375);
      function n() {
        return (0, s.interceptFetch)(r.g.fetch);
      }
      function a(e2) {
        return (t2, r2) => (0, i.withRequest)(t2, s.reader, () => e2(t2, r2));
      }
    } }, (e) => {
      var t = e(e.s = 954);
      (_ENTRIES = "undefined" == typeof _ENTRIES ? {} : _ENTRIES)["middleware_src/middleware"] = t;
    }]);
  }
});

// node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js
var edgeFunctionHandler_exports = {};
__export(edgeFunctionHandler_exports, {
  default: () => edgeFunctionHandler
});
async function edgeFunctionHandler(request) {
  const path3 = new URL(request.url).pathname;
  const routes = globalThis._ROUTES;
  const correspondingRoute = routes.find((route) => route.regex.some((r) => new RegExp(r).test(path3)));
  if (!correspondingRoute) {
    throw new Error(`No route found for ${request.url}`);
  }
  const entry = await self._ENTRIES[`middleware_${correspondingRoute.name}`];
  const result = await entry.default({
    page: correspondingRoute.page,
    request: {
      ...request,
      page: {
        name: correspondingRoute.name
      }
    }
  });
  globalThis.__openNextAls.getStore()?.pendingPromiseRunner.add(result.waitUntil);
  const response = result.response;
  return response;
}
var init_edgeFunctionHandler = __esm({
  "node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js"() {
    globalThis._ENTRIES = {};
    globalThis.self = globalThis;
    globalThis._ROUTES = [{ "name": "src/middleware", "page": "/", "regex": ["^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?!_next\\/static|_next\\/image|favicon\\.ico|api\\/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|js)$).*))(.json)?[\\/#\\?]?$"] }];
    require_edge_runtime_webpack();
    require_middleware();
  }
});

// node_modules/@opennextjs/aws/dist/utils/promise.js
init_logger();
var DetachedPromise = class {
  resolve;
  reject;
  promise;
  constructor() {
    let resolve;
    let reject;
    this.promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    this.resolve = resolve;
    this.reject = reject;
  }
};
var DetachedPromiseRunner = class {
  promises = [];
  withResolvers() {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    return detachedPromise;
  }
  add(promise) {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    promise.then(detachedPromise.resolve, detachedPromise.reject);
  }
  async await() {
    debug(`Awaiting ${this.promises.length} detached promises`);
    const results = await Promise.allSettled(this.promises.map((p) => p.promise));
    const rejectedPromises = results.filter((r) => r.status === "rejected");
    rejectedPromises.forEach((r) => {
      error(r.reason);
    });
  }
};
async function awaitAllDetachedPromise() {
  const store = globalThis.__openNextAls.getStore();
  const promisesToAwait = store?.pendingPromiseRunner.await() ?? Promise.resolve();
  if (store?.waitUntil) {
    store.waitUntil(promisesToAwait);
    return;
  }
  await promisesToAwait;
}
function provideNextAfterProvider() {
  const NEXT_REQUEST_CONTEXT_SYMBOL = Symbol.for("@next/request-context");
  const VERCEL_REQUEST_CONTEXT_SYMBOL = Symbol.for("@vercel/request-context");
  const store = globalThis.__openNextAls.getStore();
  const waitUntil = store?.waitUntil ?? ((promise) => store?.pendingPromiseRunner.add(promise));
  const nextAfterContext = {
    get: () => ({
      waitUntil
    })
  };
  globalThis[NEXT_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  if (process.env.EMULATE_VERCEL_REQUEST_CONTEXT) {
    globalThis[VERCEL_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  }
}
function runWithOpenNextRequestContext({ isISRRevalidation, waitUntil, requestId = Math.random().toString(36) }, fn) {
  return globalThis.__openNextAls.run({
    requestId,
    pendingPromiseRunner: new DetachedPromiseRunner(),
    isISRRevalidation,
    waitUntil,
    writtenTags: /* @__PURE__ */ new Set()
  }, async () => {
    provideNextAfterProvider();
    let result;
    try {
      result = await fn();
    } finally {
      await awaitAllDetachedPromise();
    }
    return result;
  });
}

// node_modules/@opennextjs/aws/dist/adapters/middleware.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/resolve.js
async function resolveConverter(converter2) {
  if (typeof converter2 === "function") {
    return converter2();
  }
  const m_1 = await Promise.resolve().then(() => (init_edge(), edge_exports));
  return m_1.default;
}
async function resolveWrapper(wrapper) {
  if (typeof wrapper === "function") {
    return wrapper();
  }
  const m_1 = await Promise.resolve().then(() => (init_cloudflare_edge(), cloudflare_edge_exports));
  return m_1.default;
}
async function resolveOriginResolver(originResolver) {
  if (typeof originResolver === "function") {
    return originResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_pattern_env(), pattern_env_exports));
  return m_1.default;
}
async function resolveAssetResolver(assetResolver) {
  if (typeof assetResolver === "function") {
    return assetResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_dummy(), dummy_exports));
  return m_1.default;
}
async function resolveProxyRequest(proxyRequest) {
  if (typeof proxyRequest === "function") {
    return proxyRequest();
  }
  const m_1 = await Promise.resolve().then(() => (init_fetch(), fetch_exports));
  return m_1.default;
}

// node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
async function createGenericHandler(handler3) {
  const config = await import("./open-next.config.mjs").then((m) => m.default);
  globalThis.openNextConfig = config;
  const override = config[handler3.type]?.override;
  const converter2 = await resolveConverter(override?.converter);
  const { name, wrapper } = await resolveWrapper(override?.wrapper);
  debug("Using wrapper", name);
  return wrapper(handler3.handler, converter2);
}

// node_modules/@opennextjs/aws/dist/core/routing/util.js
import crypto2 from "node:crypto";
import { Readable as Readable2 } from "node:stream";

// node_modules/@opennextjs/aws/dist/adapters/config/index.js
init_logger();
import path from "node:path";
globalThis.__dirname ??= "";
var NEXT_DIR = path.join(__dirname, ".next");
var OPEN_NEXT_DIR = path.join(__dirname, ".open-next");
debug({ NEXT_DIR, OPEN_NEXT_DIR });
var NextConfig = { "env": {}, "webpack": null, "eslint": { "ignoreDuringBuilds": false }, "typescript": { "ignoreBuildErrors": false, "tsconfigPath": "tsconfig.json" }, "distDir": ".next", "cleanDistDir": true, "assetPrefix": "", "cacheMaxMemorySize": 52428800, "configOrigin": "next.config.mjs", "useFileSystemPublicRoutes": true, "generateEtags": true, "pageExtensions": ["tsx", "ts", "jsx", "js"], "poweredByHeader": true, "compress": true, "analyticsId": "", "images": { "deviceSizes": [640, 750, 828, 1080, 1200, 1920, 2048, 3840], "imageSizes": [16, 32, 48, 64, 96, 128, 256, 384], "path": "/_next/image", "loader": "default", "loaderFile": "", "domains": [], "disableStaticImages": false, "minimumCacheTTL": 60, "formats": ["image/webp"], "dangerouslyAllowSVG": false, "contentSecurityPolicy": "script-src 'none'; frame-src 'none'; sandbox;", "contentDispositionType": "inline", "remotePatterns": [{ "protocol": "https", "hostname": "nopzpxrhrcerdfnecoqd.supabase.co" }, { "protocol": "https", "hostname": "rkrkpchutofbpyqvniqq.supabase.co" }], "unoptimized": false }, "devIndicators": { "buildActivity": true, "buildActivityPosition": "bottom-right" }, "onDemandEntries": { "maxInactiveAge": 6e4, "pagesBufferLength": 5 }, "amp": { "canonicalBase": "" }, "basePath": "", "sassOptions": {}, "trailingSlash": false, "i18n": null, "productionBrowserSourceMaps": false, "optimizeFonts": true, "excludeDefaultMomentLocales": true, "serverRuntimeConfig": {}, "publicRuntimeConfig": {}, "reactProductionProfiling": false, "reactStrictMode": null, "httpAgentOptions": { "keepAlive": true }, "outputFileTracing": true, "staticPageGenerationTimeout": 60, "swcMinify": true, "output": "standalone", "modularizeImports": { "@mui/icons-material": { "transform": "@mui/icons-material/{{member}}" }, "lodash": { "transform": "lodash/{{member}}" } }, "experimental": { "multiZoneDraftMode": false, "prerenderEarlyExit": false, "serverMinification": true, "serverSourceMaps": false, "linkNoTouchStart": false, "caseSensitiveRoutes": false, "clientRouterFilter": true, "clientRouterFilterRedirects": false, "fetchCacheKeyPrefix": "", "middlewarePrefetch": "flexible", "optimisticClientCache": true, "manualClientBasePath": false, "cpus": 9, "memoryBasedWorkersCount": false, "isrFlushToDisk": true, "workerThreads": false, "optimizeCss": false, "nextScriptWorkers": false, "scrollRestoration": false, "externalDir": false, "disableOptimizedLoading": false, "gzipSize": true, "craCompat": false, "esmExternals": true, "fullySpecified": false, "outputFileTracingRoot": "/Users/guillaume/Documents/perso/heatpeek-project/heatpeek", "swcTraceProfiling": false, "forceSwcTransforms": false, "largePageDataBytes": 128e3, "adjustFontFallbacks": false, "adjustFontFallbacksWithSizeAdjust": false, "typedRoutes": false, "instrumentationHook": false, "bundlePagesExternals": false, "parallelServerCompiles": false, "parallelServerBuildTraces": false, "ppr": false, "missingSuspenseWithCSRBailout": true, "optimizeServerReact": true, "useEarlyImport": false, "staleTimes": { "dynamic": 30, "static": 300 }, "optimizePackageImports": ["lucide-react", "date-fns", "lodash-es", "ramda", "antd", "react-bootstrap", "ahooks", "@ant-design/icons", "@headlessui/react", "@headlessui-float/react", "@heroicons/react/20/solid", "@heroicons/react/24/solid", "@heroicons/react/24/outline", "@visx/visx", "@tremor/react", "rxjs", "@mui/material", "@mui/icons-material", "recharts", "react-use", "@material-ui/core", "@material-ui/icons", "@tabler/icons-react", "mui-core", "react-icons/ai", "react-icons/bi", "react-icons/bs", "react-icons/cg", "react-icons/ci", "react-icons/di", "react-icons/fa", "react-icons/fa6", "react-icons/fc", "react-icons/fi", "react-icons/gi", "react-icons/go", "react-icons/gr", "react-icons/hi", "react-icons/hi2", "react-icons/im", "react-icons/io", "react-icons/io5", "react-icons/lia", "react-icons/lib", "react-icons/lu", "react-icons/md", "react-icons/pi", "react-icons/ri", "react-icons/rx", "react-icons/si", "react-icons/sl", "react-icons/tb", "react-icons/tfi", "react-icons/ti", "react-icons/vsc", "react-icons/wi"], "trustHostHeader": false, "isExperimentalCompile": false }, "configFileName": "next.config.mjs" };
var BuildId = "nMe9B8RRkQxu1DKN4y-jm";
var RoutesManifest = { "basePath": "", "rewrites": { "beforeFiles": [], "afterFiles": [], "fallback": [] }, "redirects": [{ "source": "/:path+/", "destination": "/:path+", "internal": true, "statusCode": 308, "regex": "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))/$" }], "routes": { "static": [{ "page": "/_not-found", "regex": "^/_not\\-found(?:/)?$", "routeKeys": {}, "namedRegex": "^/_not\\-found(?:/)?$" }, { "page": "/sitemap.xml", "regex": "^/sitemap\\.xml(?:/)?$", "routeKeys": {}, "namedRegex": "^/sitemap\\.xml(?:/)?$" }], "dynamic": [{ "page": "/api/verify/[trackingId]", "regex": "^/api/verify/([^/]+?)(?:/)?$", "routeKeys": { "nxtPtrackingId": "nxtPtrackingId" }, "namedRegex": "^/api/verify/(?<nxtPtrackingId>[^/]+?)(?:/)?$" }, { "page": "/[locale]", "regex": "^/([^/]+?)(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)(?:/)?$" }, { "page": "/[locale]/auth/callback", "regex": "^/([^/]+?)/auth/callback(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/auth/callback(?:/)?$" }, { "page": "/[locale]/auth/confirm", "regex": "^/([^/]+?)/auth/confirm(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/auth/confirm(?:/)?$" }, { "page": "/[locale]/manage-sites", "regex": "^/([^/]+?)/manage\\-sites(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/manage\\-sites(?:/)?$" }, { "page": "/[locale]/pricing", "regex": "^/([^/]+?)/pricing(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/pricing(?:/)?$" }, { "page": "/[locale]/signin", "regex": "^/([^/]+?)/signin(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/signin(?:/)?$" }, { "page": "/[locale]/signup", "regex": "^/([^/]+?)/signup(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/signup(?:/)?$" }, { "page": "/[locale]/why", "regex": "^/([^/]+?)/why(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/why(?:/)?$" }, { "page": "/[locale]/[id]/dashboard", "regex": "^/([^/]+?)/([^/]+?)/dashboard(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale", "nxtPid": "nxtPid" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/(?<nxtPid>[^/]+?)/dashboard(?:/)?$" }, { "page": "/[locale]/[id]/get-started", "regex": "^/([^/]+?)/([^/]+?)/get\\-started(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale", "nxtPid": "nxtPid" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/(?<nxtPid>[^/]+?)/get\\-started(?:/)?$" }, { "page": "/[locale]/[id]/heatmap", "regex": "^/([^/]+?)/([^/]+?)/heatmap(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale", "nxtPid": "nxtPid" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/(?<nxtPid>[^/]+?)/heatmap(?:/)?$" }, { "page": "/[locale]/[id]/manage-urls", "regex": "^/([^/]+?)/([^/]+?)/manage\\-urls(?:/)?$", "routeKeys": { "nxtPlocale": "nxtPlocale", "nxtPid": "nxtPid" }, "namedRegex": "^/(?<nxtPlocale>[^/]+?)/(?<nxtPid>[^/]+?)/manage\\-urls(?:/)?$" }], "data": { "static": [], "dynamic": [] } }, "locales": [] };
var ConfigHeaders = [];
var PrerenderManifest = { "version": 4, "routes": { "/sitemap.xml": { "initialHeaders": { "cache-control": "public, max-age=0, must-revalidate", "content-type": "application/xml", "x-next-cache-tags": "_N_T_/layout,_N_T_/sitemap.xml/layout,_N_T_/sitemap.xml/route,_N_T_/sitemap.xml" }, "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/sitemap.xml", "dataRoute": null } }, "dynamicRoutes": {}, "notFoundRoutes": [], "preview": { "previewModeId": "0a38bbd87a5b28f849bbab6b2a8fd9ea", "previewModeSigningKey": "3b873f6df1016cf555044785895c54ff5241e242a198cfb457409059d3419e52", "previewModeEncryptionKey": "32792a1bdae948404c22ca6e95caa676dc95cf868a07c56554894a60c9d7ea9d" } };
var MiddlewareManifest = { "version": 3, "middleware": { "/": { "files": ["server/edge-runtime-webpack.js", "server/src/middleware.js"], "name": "src/middleware", "page": "/", "matchers": [{ "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?!_next\\/static|_next\\/image|favicon\\.ico|api\\/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|js)$).*))(.json)?[\\/#\\?]?$", "originalSource": "/((?!_next/static|_next/image|favicon\\.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|js)$).*)" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "nMe9B8RRkQxu1DKN4y-jm", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "J9lmPl2v4J4/43gQ7M3xTOBudDz9juQLTObbUbrq+ME=", "__NEXT_PREVIEW_MODE_ID": "0a38bbd87a5b28f849bbab6b2a8fd9ea", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "32792a1bdae948404c22ca6e95caa676dc95cf868a07c56554894a60c9d7ea9d", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "3b873f6df1016cf555044785895c54ff5241e242a198cfb457409059d3419e52" } } }, "functions": {}, "sortedMiddleware": ["/"] };
var AppPathRoutesManifest = { "/_not-found/page": "/_not-found", "/api/verify/[trackingId]/route": "/api/verify/[trackingId]", "/sitemap.xml/route": "/sitemap.xml", "/api/webhook/stripe/route": "/api/webhook/stripe", "/[locale]/auth/confirm/route": "/[locale]/auth/confirm", "/[locale]/auth/callback/route": "/[locale]/auth/callback", "/[locale]/(insight)/manage-sites/page": "/[locale]/manage-sites", "/[locale]/(insight)/[id]/get-started/page": "/[locale]/[id]/get-started", "/[locale]/(insight)/[id]/manage-urls/page": "/[locale]/[id]/manage-urls", "/[locale]/(landing)/pricing/page": "/[locale]/pricing", "/[locale]/(landing)/page": "/[locale]", "/[locale]/(landing)/signin/page": "/[locale]/signin", "/[locale]/(landing)/signup/page": "/[locale]/signup", "/[locale]/(landing)/why/page": "/[locale]/why", "/[locale]/(insight)/[id]/(data)/heatmap/page": "/[locale]/[id]/heatmap", "/[locale]/(insight)/[id]/(data)/dashboard/page": "/[locale]/[id]/dashboard" };
var FunctionsConfigManifest = { "version": 1, "functions": {} };
var PagesManifest = { "/_app": "pages/_app.js", "/_error": "pages/_error.js", "/_document": "pages/_document.js", "/404": "pages/404.html" };
process.env.NEXT_BUILD_ID = BuildId;

// node_modules/@opennextjs/aws/dist/http/openNextResponse.js
init_logger();
init_util();
import { Transform } from "node:stream";

// node_modules/@opennextjs/aws/dist/core/routing/util.js
init_util();
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
init_stream();
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/i18n/accept-header.js
function parse(raw, preferences, options) {
  const lowers = /* @__PURE__ */ new Map();
  const header = raw.replace(/[ \t]/g, "");
  if (preferences) {
    let pos = 0;
    for (const preference of preferences) {
      const lower = preference.toLowerCase();
      lowers.set(lower, { orig: preference, pos: pos++ });
      if (options.prefixMatch) {
        const parts2 = lower.split("-");
        while (parts2.pop(), parts2.length > 0) {
          const joined = parts2.join("-");
          if (!lowers.has(joined)) {
            lowers.set(joined, { orig: preference, pos: pos++ });
          }
        }
      }
    }
  }
  const parts = header.split(",");
  const selections = [];
  const map = /* @__PURE__ */ new Set();
  for (let i = 0; i < parts.length; ++i) {
    const part = parts[i];
    if (!part) {
      continue;
    }
    const params = part.split(";");
    if (params.length > 2) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const token = params[0].toLowerCase();
    if (!token) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const selection = { token, pos: i, q: 1 };
    if (preferences && lowers.has(token)) {
      selection.pref = lowers.get(token).pos;
    }
    map.add(selection.token);
    if (params.length === 2) {
      const q = params[1];
      const [key, value] = q.split("=");
      if (!value || key !== "q" && key !== "Q") {
        throw new Error(`Invalid ${options.type} header`);
      }
      const score = Number.parseFloat(value);
      if (score === 0) {
        continue;
      }
      if (Number.isFinite(score) && score <= 1 && score >= 1e-3) {
        selection.q = score;
      }
    }
    selections.push(selection);
  }
  selections.sort((a, b) => {
    if (b.q !== a.q) {
      return b.q - a.q;
    }
    if (b.pref !== a.pref) {
      if (a.pref === void 0) {
        return 1;
      }
      if (b.pref === void 0) {
        return -1;
      }
      return a.pref - b.pref;
    }
    return a.pos - b.pos;
  });
  const values = selections.map((selection) => selection.token);
  if (!preferences || !preferences.length) {
    return values;
  }
  const preferred = [];
  for (const selection of values) {
    if (selection === "*") {
      for (const [preference, value] of lowers) {
        if (!map.has(preference)) {
          preferred.push(value.orig);
        }
      }
    } else {
      const lower = selection.toLowerCase();
      if (lowers.has(lower)) {
        preferred.push(lowers.get(lower).orig);
      }
    }
  }
  return preferred;
}
function acceptLanguage(header = "", preferences) {
  return parse(header, preferences, {
    type: "accept-language",
    prefixMatch: true
  })[0] || void 0;
}

// node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
function isLocalizedPath(path3) {
  return NextConfig.i18n?.locales.includes(path3.split("/")[1].toLowerCase()) ?? false;
}
function getLocaleFromCookie(cookies) {
  const i18n = NextConfig.i18n;
  const nextLocale = cookies.NEXT_LOCALE?.toLowerCase();
  return nextLocale ? i18n?.locales.find((locale) => nextLocale === locale.toLowerCase()) : void 0;
}
function detectDomainLocale({ hostname, detectedLocale }) {
  const i18n = NextConfig.i18n;
  const domains = i18n?.domains;
  if (!domains) {
    return;
  }
  const lowercasedLocale = detectedLocale?.toLowerCase();
  for (const domain of domains) {
    const domainHostname = domain.domain.split(":", 1)[0].toLowerCase();
    if (hostname === domainHostname || lowercasedLocale === domain.defaultLocale.toLowerCase() || domain.locales?.some((locale) => lowercasedLocale === locale.toLowerCase())) {
      return domain;
    }
  }
}
function detectLocale(internalEvent, i18n) {
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  if (i18n.localeDetection === false) {
    return domainLocale?.defaultLocale ?? i18n.defaultLocale;
  }
  const cookiesLocale = getLocaleFromCookie(internalEvent.cookies);
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  debug({
    cookiesLocale,
    preferredLocale,
    defaultLocale: i18n.defaultLocale,
    domainLocale
  });
  return domainLocale?.defaultLocale ?? cookiesLocale ?? preferredLocale ?? i18n.defaultLocale;
}
function localizePath(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n) {
    return internalEvent.rawPath;
  }
  if (isLocalizedPath(internalEvent.rawPath)) {
    return internalEvent.rawPath;
  }
  const detectedLocale = detectLocale(internalEvent, i18n);
  return `/${detectedLocale}${internalEvent.rawPath}`;
}
function handleLocaleRedirect(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n || i18n.localeDetection === false || internalEvent.rawPath !== "/") {
    return false;
  }
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  const detectedLocale = detectLocale(internalEvent, i18n);
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  const preferredDomain = detectDomainLocale({
    detectedLocale: preferredLocale
  });
  if (domainLocale && preferredDomain) {
    const isPDomain = preferredDomain.domain === domainLocale.domain;
    const isPLocale = preferredDomain.defaultLocale === preferredLocale;
    if (!isPDomain || !isPLocale) {
      const scheme = `http${preferredDomain.http ? "" : "s"}`;
      const rlocale = isPLocale ? "" : preferredLocale;
      return {
        type: "core",
        statusCode: 307,
        headers: {
          Location: `${scheme}://${preferredDomain.domain}/${rlocale}`
        },
        body: emptyReadableStream(),
        isBase64Encoded: false
      };
    }
  }
  const defaultLocale = domainLocale?.defaultLocale ?? i18n.defaultLocale;
  if (detectedLocale.toLowerCase() !== defaultLocale.toLowerCase()) {
    return {
      type: "core",
      statusCode: 307,
      headers: {
        Location: constructNextUrl(internalEvent.url, `/${detectedLocale}`)
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}

// node_modules/@opennextjs/aws/dist/core/routing/queue.js
function generateShardId(rawPath, maxConcurrency, prefix) {
  let a = cyrb128(rawPath);
  let t = a += 1831565813;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  const randomFloat = ((t ^ t >>> 14) >>> 0) / 4294967296;
  const randomInt = Math.floor(randomFloat * maxConcurrency);
  return `${prefix}-${randomInt}`;
}
function generateMessageGroupId(rawPath) {
  const maxConcurrency = Number.parseInt(process.env.MAX_REVALIDATE_CONCURRENCY ?? "10");
  return generateShardId(rawPath, maxConcurrency, "revalidate");
}
function cyrb128(str) {
  let h1 = 1779033703;
  let h2 = 3144134277;
  let h3 = 1013904242;
  let h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ h1 >>> 18, 597399067);
  h2 = Math.imul(h4 ^ h2 >>> 22, 2869860233);
  h3 = Math.imul(h1 ^ h3 >>> 17, 951274213);
  h4 = Math.imul(h2 ^ h4 >>> 19, 2716044179);
  h1 ^= h2 ^ h3 ^ h4, h2 ^= h1, h3 ^= h1, h4 ^= h1;
  return h1 >>> 0;
}

// node_modules/@opennextjs/aws/dist/core/routing/util.js
function isExternal(url, host) {
  if (!url)
    return false;
  const pattern = /^https?:\/\//;
  if (host) {
    return pattern.test(url) && !url.includes(host);
  }
  return pattern.test(url);
}
function convertFromQueryString(query) {
  if (query === "")
    return {};
  const queryParts = query.split("&");
  return getQueryFromIterator(queryParts.map((p) => {
    const [key, value] = p.split("=");
    return [key, value];
  }));
}
function getUrlParts(url, isExternal2) {
  if (!isExternal2) {
    const regex2 = /\/([^?]*)\??(.*)/;
    const match3 = url.match(regex2);
    return {
      hostname: "",
      pathname: match3?.[1] ? `/${match3[1]}` : url,
      protocol: "",
      queryString: match3?.[2] ?? ""
    };
  }
  const regex = /^(https?:)\/\/?([^\/\s]+)(\/[^?]*)?(\?.*)?/;
  const match2 = url.match(regex);
  if (!match2) {
    throw new Error(`Invalid external URL: ${url}`);
  }
  return {
    protocol: match2[1] ?? "https:",
    hostname: match2[2],
    pathname: match2[3] ?? "",
    queryString: match2[4]?.slice(1) ?? ""
  };
}
function constructNextUrl(baseUrl, path3) {
  const nextBasePath = NextConfig.basePath ?? "";
  const url = new URL(`${nextBasePath}${path3}`, baseUrl);
  return url.href;
}
function convertToQueryString(query) {
  const queryStrings = [];
  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => queryStrings.push(`${key}=${entry}`));
    } else {
      queryStrings.push(`${key}=${value}`);
    }
  });
  return queryStrings.length > 0 ? `?${queryStrings.join("&")}` : "";
}
function getMiddlewareMatch(middlewareManifest2, functionsManifest) {
  if (functionsManifest?.functions?.["/_middleware"]) {
    return functionsManifest.functions["/_middleware"].matchers?.map(({ regexp }) => new RegExp(regexp)) ?? [/.*/];
  }
  const rootMiddleware = middlewareManifest2.middleware["/"];
  if (!rootMiddleware?.matchers)
    return [];
  return rootMiddleware.matchers.map(({ regexp }) => new RegExp(regexp));
}
function escapeRegex(str, { isPath } = {}) {
  const result = str.replaceAll("(.)", "_\xB51_").replaceAll("(..)", "_\xB52_").replaceAll("(...)", "_\xB53_");
  return isPath ? result : result.replaceAll("+", "_\xB54_");
}
function unescapeRegex(str) {
  return str.replaceAll("_\xB51_", "(.)").replaceAll("_\xB52_", "(..)").replaceAll("_\xB53_", "(...)").replaceAll("_\xB54_", "+");
}
function convertBodyToReadableStream(method, body) {
  if (method === "GET" || method === "HEAD")
    return void 0;
  if (!body)
    return void 0;
  const readable = new ReadableStream({
    start(controller) {
      controller.enqueue(body);
      controller.close();
    }
  });
  return readable;
}
var CommonHeaders;
(function(CommonHeaders2) {
  CommonHeaders2["CACHE_CONTROL"] = "cache-control";
  CommonHeaders2["NEXT_CACHE"] = "x-nextjs-cache";
})(CommonHeaders || (CommonHeaders = {}));

// node_modules/@opennextjs/aws/dist/core/routingHandler.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
import { createHash } from "node:crypto";
init_stream();

// node_modules/@opennextjs/aws/dist/utils/cache.js
init_logger();
async function hasBeenRevalidated(key, tags, cacheEntry) {
  if (globalThis.openNextConfig.dangerous?.disableTagCache) {
    return false;
  }
  const value = cacheEntry.value;
  if (!value) {
    return true;
  }
  if ("type" in cacheEntry && cacheEntry.type === "page") {
    return false;
  }
  const lastModified = cacheEntry.lastModified ?? Date.now();
  if (globalThis.tagCache.mode === "nextMode") {
    return await globalThis.tagCache.hasBeenRevalidated(tags, lastModified);
  }
  const _lastModified = await globalThis.tagCache.getLastModified(key, lastModified);
  return _lastModified === -1;
}
function getTagsFromValue(value) {
  if (!value) {
    return [];
  }
  try {
    return value.meta?.headers?.["x-next-cache-tags"]?.split(",") ?? [];
  } catch (e) {
    return [];
  }
}

// node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
init_logger();
var CACHE_ONE_YEAR = 60 * 60 * 24 * 365;
var CACHE_ONE_MONTH = 60 * 60 * 24 * 30;
var VARY_HEADER = "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch, Next-Url";
async function computeCacheControl(path3, body, host, revalidate, lastModified) {
  let finalRevalidate = CACHE_ONE_YEAR;
  const existingRoute = Object.entries(PrerenderManifest.routes).find((p) => p[0] === path3)?.[1];
  if (revalidate === void 0 && existingRoute) {
    finalRevalidate = existingRoute.initialRevalidateSeconds === false ? CACHE_ONE_YEAR : existingRoute.initialRevalidateSeconds;
  } else if (revalidate !== void 0) {
    finalRevalidate = revalidate === false ? CACHE_ONE_YEAR : revalidate;
  }
  const age = Math.round((Date.now() - (lastModified ?? 0)) / 1e3);
  const hash = (str) => createHash("md5").update(str).digest("hex");
  const etag = hash(body);
  if (revalidate === 0) {
    return {
      "cache-control": "private, no-cache, no-store, max-age=0, must-revalidate",
      "x-opennext-cache": "ERROR",
      etag
    };
  }
  if (finalRevalidate !== CACHE_ONE_YEAR) {
    const sMaxAge = Math.max(finalRevalidate - age, 1);
    debug("sMaxAge", {
      finalRevalidate,
      age,
      lastModified,
      revalidate
    });
    const isStale = sMaxAge === 1;
    if (isStale) {
      let url = NextConfig.trailingSlash ? `${path3}/` : path3;
      if (NextConfig.basePath) {
        url = `${NextConfig.basePath}${url}`;
      }
      await globalThis.queue.send({
        MessageBody: {
          host,
          url,
          eTag: etag,
          lastModified: lastModified ?? Date.now()
        },
        MessageDeduplicationId: hash(`${path3}-${lastModified}-${etag}`),
        MessageGroupId: generateMessageGroupId(path3)
      });
    }
    return {
      "cache-control": `s-maxage=${sMaxAge}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
      "x-opennext-cache": isStale ? "STALE" : "HIT",
      etag
    };
  }
  return {
    "cache-control": `s-maxage=${CACHE_ONE_YEAR}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
    "x-opennext-cache": "HIT",
    etag
  };
}
async function generateResult(event, localizedPath, cachedValue, lastModified) {
  debug("Returning result from experimental cache");
  let body = "";
  let type = "application/octet-stream";
  let isDataRequest = false;
  switch (cachedValue.type) {
    case "app":
      isDataRequest = Boolean(event.headers.rsc);
      body = isDataRequest ? cachedValue.rsc : cachedValue.html;
      type = isDataRequest ? "text/x-component" : "text/html; charset=utf-8";
      break;
    case "page":
      isDataRequest = Boolean(event.query.__nextDataReq);
      body = isDataRequest ? JSON.stringify(cachedValue.json) : cachedValue.html;
      type = isDataRequest ? "application/json" : "text/html; charset=utf-8";
      break;
  }
  const cacheControl = await computeCacheControl(localizedPath, body, event.headers.host, cachedValue.revalidate, lastModified);
  return {
    type: "core",
    // sometimes other status codes can be cached, like 404. For these cases, we should return the correct status code
    statusCode: cachedValue.meta?.status ?? 200,
    body: toReadableStream(body, false),
    isBase64Encoded: false,
    headers: {
      ...cacheControl,
      "content-type": type,
      ...cachedValue.meta?.headers,
      vary: VARY_HEADER
    }
  };
}
function escapePathDelimiters(segment, escapeEncoded) {
  return segment.replace(new RegExp(`([/#?]${escapeEncoded ? "|%(2f|23|3f|5c)" : ""})`, "gi"), (char) => encodeURIComponent(char));
}
function decodePathParams(pathname) {
  return pathname.split("/").map((segment) => {
    try {
      return escapePathDelimiters(decodeURIComponent(segment), true);
    } catch (e) {
      return segment;
    }
  }).join("/");
}
async function cacheInterceptor(event) {
  if (Boolean(event.headers["next-action"]) || Boolean(event.headers["x-prerender-revalidate"]))
    return event;
  let localizedPath = localizePath(event);
  if (NextConfig.basePath) {
    localizedPath = localizedPath.replace(NextConfig.basePath, "");
  }
  localizedPath = localizedPath.replace(/\/$/, "");
  localizedPath = decodePathParams(localizedPath);
  debug("Checking cache for", localizedPath, PrerenderManifest);
  const isISR = Object.keys(PrerenderManifest.routes).includes(localizedPath ?? "/") || Object.values(PrerenderManifest.dynamicRoutes).some((dr) => new RegExp(dr.routeRegex).test(localizedPath));
  debug("isISR", isISR);
  if (isISR) {
    try {
      const cachedData = await globalThis.incrementalCache.get(localizedPath ?? "/index");
      debug("cached data in interceptor", cachedData);
      if (!cachedData?.value) {
        return event;
      }
      if (cachedData.value?.type === "app") {
        const tags = getTagsFromValue(cachedData.value);
        const _hasBeenRevalidated = await hasBeenRevalidated(localizedPath, tags, cachedData);
        if (_hasBeenRevalidated) {
          return event;
        }
      }
      const host = event.headers.host;
      switch (cachedData?.value?.type) {
        case "app":
        case "page":
          return generateResult(event, localizedPath, cachedData.value, cachedData.lastModified);
        case "redirect": {
          const cacheControl = await computeCacheControl(localizedPath, "", host, cachedData.value.revalidate, cachedData.lastModified);
          return {
            type: "core",
            statusCode: cachedData.value.meta?.status ?? 307,
            body: emptyReadableStream(),
            headers: {
              ...cachedData.value.meta?.headers ?? {},
              ...cacheControl
            },
            isBase64Encoded: false
          };
        }
        default:
          return event;
      }
    } catch (e) {
      debug("Error while fetching cache", e);
      return event;
    }
  }
  return event;
}

// node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
function parse2(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path3 = "";
  var tryConsume = function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  };
  var mustConsume = function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  };
  var consumeText = function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  };
  var isSafe = function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  };
  var safePattern = function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  };
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path3 += prefix;
        prefix = "";
      }
      if (path3) {
        result.push(path3);
        path3 = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path3 += value;
      continue;
    }
    if (path3) {
      result.push(path3);
      path3 = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
function compile(str, options) {
  return tokensToFunction(parse2(str, options), options);
}
function tokensToFunction(tokens, options) {
  if (options === void 0) {
    options = {};
  }
  var reFlags = flags(options);
  var _a = options.encode, encode = _a === void 0 ? function(x) {
    return x;
  } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
  var matches = tokens.map(function(token) {
    if (typeof token === "object") {
      return new RegExp("^(?:".concat(token.pattern, ")$"), reFlags);
    }
  });
  return function(data) {
    var path3 = "";
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (typeof token === "string") {
        path3 += token;
        continue;
      }
      var value = data ? data[token.name] : void 0;
      var optional = token.modifier === "?" || token.modifier === "*";
      var repeat = token.modifier === "*" || token.modifier === "+";
      if (Array.isArray(value)) {
        if (!repeat) {
          throw new TypeError('Expected "'.concat(token.name, '" to not repeat, but got an array'));
        }
        if (value.length === 0) {
          if (optional)
            continue;
          throw new TypeError('Expected "'.concat(token.name, '" to not be empty'));
        }
        for (var j = 0; j < value.length; j++) {
          var segment = encode(value[j], token);
          if (validate && !matches[i].test(segment)) {
            throw new TypeError('Expected all "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
          }
          path3 += token.prefix + segment + token.suffix;
        }
        continue;
      }
      if (typeof value === "string" || typeof value === "number") {
        var segment = encode(String(value), token);
        if (validate && !matches[i].test(segment)) {
          throw new TypeError('Expected "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
        }
        path3 += token.prefix + segment + token.suffix;
        continue;
      }
      if (optional)
        continue;
      var typeOfMessage = repeat ? "an array" : "a string";
      throw new TypeError('Expected "'.concat(token.name, '" to be ').concat(typeOfMessage));
    }
    return path3;
  };
}
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path3 = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    };
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path: path3, index, params };
  };
}
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
function regexpToRegexp(path3, keys) {
  if (!keys)
    return path3;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path3.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path3.source);
  }
  return path3;
}
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path3) {
    return pathToRegexp(path3, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
function stringToRegexp(path3, keys, options) {
  return tokensToRegexp(parse2(path3, options), keys, options);
}
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
function pathToRegexp(path3, keys, options) {
  if (path3 instanceof RegExp)
    return regexpToRegexp(path3, keys);
  if (Array.isArray(path3))
    return arrayToRegexp(path3, keys, options);
  return stringToRegexp(path3, keys, options);
}

// node_modules/@opennextjs/aws/dist/utils/normalize-path.js
import path2 from "node:path";
function normalizeRepeatedSlashes(url) {
  const urlNoQuery = url.host + url.pathname;
  return `${url.protocol}//${urlNoQuery.replace(/\\/g, "/").replace(/\/\/+/g, "/")}${url.search}`;
}

// node_modules/@opennextjs/aws/dist/core/routing/matcher.js
init_stream();
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/routeMatcher.js
var optionalLocalePrefixRegex = `^/(?:${RoutesManifest.locales.map((locale) => `${locale}/?`).join("|")})?`;
var optionalBasepathPrefixRegex = RoutesManifest.basePath ? `^${RoutesManifest.basePath}/?` : "^/";
var optionalPrefix = optionalLocalePrefixRegex.replace("^/", optionalBasepathPrefixRegex);
function routeMatcher(routeDefinitions) {
  const regexp = routeDefinitions.map((route) => ({
    page: route.page,
    regexp: new RegExp(route.regex.replace("^/", optionalPrefix))
  }));
  const appPathsSet = /* @__PURE__ */ new Set();
  const routePathsSet = /* @__PURE__ */ new Set();
  for (const [k, v] of Object.entries(AppPathRoutesManifest)) {
    if (k.endsWith("page")) {
      appPathsSet.add(v);
    } else if (k.endsWith("route")) {
      routePathsSet.add(v);
    }
  }
  return function matchRoute(path3) {
    const foundRoutes = regexp.filter((route) => route.regexp.test(path3));
    return foundRoutes.map((foundRoute) => {
      let routeType = "page";
      if (appPathsSet.has(foundRoute.page)) {
        routeType = "app";
      } else if (routePathsSet.has(foundRoute.page)) {
        routeType = "route";
      }
      return {
        route: foundRoute.page,
        type: routeType
      };
    });
  };
}
var staticRouteMatcher = routeMatcher([
  ...RoutesManifest.routes.static,
  ...getStaticAPIRoutes()
]);
var dynamicRouteMatcher = routeMatcher(RoutesManifest.routes.dynamic);
function getStaticAPIRoutes() {
  const createRouteDefinition = (route) => ({
    page: route,
    regex: `^${route}(?:/)?$`
  });
  const dynamicRoutePages = new Set(RoutesManifest.routes.dynamic.map(({ page }) => page));
  const pagesStaticAPIRoutes = Object.keys(PagesManifest).filter((route) => route.startsWith("/api/") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  const appPathsStaticAPIRoutes = Object.values(AppPathRoutesManifest).filter((route) => route.startsWith("/api/") || route === "/api" && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  return [...pagesStaticAPIRoutes, ...appPathsStaticAPIRoutes];
}

// node_modules/@opennextjs/aws/dist/core/routing/matcher.js
var routeHasMatcher = (headers, cookies, query) => (redirect) => {
  switch (redirect.type) {
    case "header":
      return !!headers?.[redirect.key.toLowerCase()] && new RegExp(redirect.value ?? "").test(headers[redirect.key.toLowerCase()] ?? "");
    case "cookie":
      return !!cookies?.[redirect.key] && new RegExp(redirect.value ?? "").test(cookies[redirect.key] ?? "");
    case "query":
      return query[redirect.key] && Array.isArray(redirect.value) ? redirect.value.reduce((prev, current) => prev || new RegExp(current).test(query[redirect.key]), false) : new RegExp(redirect.value ?? "").test(query[redirect.key] ?? "");
    case "host":
      return headers?.host !== "" && new RegExp(redirect.value ?? "").test(headers.host);
    default:
      return false;
  }
};
function checkHas(matcher, has, inverted = false) {
  return has ? has.reduce((acc, cur) => {
    if (acc === false)
      return false;
    return inverted ? !matcher(cur) : matcher(cur);
  }, true) : true;
}
var getParamsFromSource = (source) => (value) => {
  debug("value", value);
  const _match = source(value);
  return _match ? _match.params : {};
};
var computeParamHas = (headers, cookies, query) => (has) => {
  if (!has.value)
    return {};
  const matcher = new RegExp(`^${has.value}$`);
  const fromSource = (value) => {
    const matches = value.match(matcher);
    return matches?.groups ?? {};
  };
  switch (has.type) {
    case "header":
      return fromSource(headers[has.key.toLowerCase()] ?? "");
    case "cookie":
      return fromSource(cookies[has.key] ?? "");
    case "query":
      return Array.isArray(query[has.key]) ? fromSource(query[has.key].join(",")) : fromSource(query[has.key] ?? "");
    case "host":
      return fromSource(headers.host ?? "");
  }
};
function convertMatch(match2, toDestination, destination) {
  if (!match2) {
    return destination;
  }
  const { params } = match2;
  const isUsingParams = Object.keys(params).length > 0;
  return isUsingParams ? toDestination(params) : destination;
}
function getNextConfigHeaders(event, configHeaders) {
  if (!configHeaders) {
    return {};
  }
  const matcher = routeHasMatcher(event.headers, event.cookies, event.query);
  const requestHeaders = {};
  const localizedRawPath = localizePath(event);
  for (const { headers, has, missing, regex, source, locale } of configHeaders) {
    const path3 = locale === false ? event.rawPath : localizedRawPath;
    if (new RegExp(regex).test(path3) && checkHas(matcher, has) && checkHas(matcher, missing, true)) {
      const fromSource = match(source);
      const _match = fromSource(path3);
      headers.forEach((h) => {
        try {
          const key = convertMatch(_match, compile(h.key), h.key);
          const value = convertMatch(_match, compile(h.value), h.value);
          requestHeaders[key] = value;
        } catch {
          debug(`Error matching header ${h.key} with value ${h.value}`);
          requestHeaders[h.key] = h.value;
        }
      });
    }
  }
  return requestHeaders;
}
function handleRewrites(event, rewrites) {
  const { rawPath, headers, query, cookies, url } = event;
  const localizedRawPath = localizePath(event);
  const matcher = routeHasMatcher(headers, cookies, query);
  const computeHas = computeParamHas(headers, cookies, query);
  const rewrite = rewrites.find((route) => {
    const path3 = route.locale === false ? rawPath : localizedRawPath;
    return new RegExp(route.regex).test(path3) && checkHas(matcher, route.has) && checkHas(matcher, route.missing, true);
  });
  let finalQuery = query;
  let rewrittenUrl = url;
  const isExternalRewrite = isExternal(rewrite?.destination);
  debug("isExternalRewrite", isExternalRewrite);
  if (rewrite) {
    const { pathname, protocol, hostname, queryString } = getUrlParts(rewrite.destination, isExternalRewrite);
    const pathToUse = rewrite.locale === false ? rawPath : localizedRawPath;
    debug("urlParts", { pathname, protocol, hostname, queryString });
    const toDestinationPath = compile(escapeRegex(pathname, { isPath: true }));
    const toDestinationHost = compile(escapeRegex(hostname));
    const toDestinationQuery = compile(escapeRegex(queryString));
    const params = {
      // params for the source
      ...getParamsFromSource(match(escapeRegex(rewrite.source, { isPath: true })))(pathToUse),
      // params for the has
      ...rewrite.has?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {}),
      // params for the missing
      ...rewrite.missing?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {})
    };
    const isUsingParams = Object.keys(params).length > 0;
    let rewrittenQuery = queryString;
    let rewrittenHost = hostname;
    let rewrittenPath = pathname;
    if (isUsingParams) {
      rewrittenPath = unescapeRegex(toDestinationPath(params));
      rewrittenHost = unescapeRegex(toDestinationHost(params));
      rewrittenQuery = unescapeRegex(toDestinationQuery(params));
    }
    if (NextConfig.i18n && !isExternalRewrite) {
      const strippedPathLocale = rewrittenPath.replace(new RegExp(`^/(${NextConfig.i18n.locales.join("|")})`), "");
      if (strippedPathLocale.startsWith("/api/")) {
        rewrittenPath = strippedPathLocale;
      }
    }
    rewrittenUrl = isExternalRewrite ? `${protocol}//${rewrittenHost}${rewrittenPath}` : new URL(rewrittenPath, event.url).href;
    finalQuery = {
      ...query,
      ...convertFromQueryString(rewrittenQuery)
    };
    rewrittenUrl += convertToQueryString(finalQuery);
    debug("rewrittenUrl", { rewrittenUrl, finalQuery, isUsingParams });
  }
  return {
    internalEvent: {
      ...event,
      query: finalQuery,
      rawPath: new URL(rewrittenUrl).pathname,
      url: rewrittenUrl
    },
    __rewrite: rewrite,
    isExternalRewrite
  };
}
function handleRepeatedSlashRedirect(event) {
  if (event.rawPath.match(/(\\|\/\/)/)) {
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: normalizeRepeatedSlashes(new URL(event.url))
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}
function handleTrailingSlashRedirect(event) {
  const url = new URL(event.rawPath, "http://localhost");
  if (
    // Someone is trying to redirect to a different origin, let's not do that
    url.host !== "localhost" || NextConfig.skipTrailingSlashRedirect || // We should not apply trailing slash redirect to API routes
    event.rawPath.startsWith("/api/")
  ) {
    return false;
  }
  const emptyBody = emptyReadableStream();
  if (NextConfig.trailingSlash && !event.headers["x-nextjs-data"] && !event.rawPath.endsWith("/") && !event.rawPath.match(/[\w-]+\.[\w]+$/g)) {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0]}/${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  if (!NextConfig.trailingSlash && event.rawPath.endsWith("/") && event.rawPath !== "/") {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0].replace(/\/$/, "")}${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  return false;
}
function handleRedirects(event, redirects) {
  const repeatedSlashRedirect = handleRepeatedSlashRedirect(event);
  if (repeatedSlashRedirect)
    return repeatedSlashRedirect;
  const trailingSlashRedirect = handleTrailingSlashRedirect(event);
  if (trailingSlashRedirect)
    return trailingSlashRedirect;
  const localeRedirect = handleLocaleRedirect(event);
  if (localeRedirect)
    return localeRedirect;
  const { internalEvent, __rewrite } = handleRewrites(event, redirects.filter((r) => !r.internal));
  if (__rewrite && !__rewrite.internal) {
    return {
      type: event.type,
      statusCode: __rewrite.statusCode ?? 308,
      headers: {
        Location: internalEvent.url
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
}
function fixDataPage(internalEvent, buildId) {
  const { rawPath, query } = internalEvent;
  const basePath = NextConfig.basePath ?? "";
  const dataPattern = `${basePath}/_next/data/${buildId}`;
  if (rawPath.startsWith("/_next/data") && !rawPath.startsWith(dataPattern)) {
    return {
      type: internalEvent.type,
      statusCode: 404,
      body: toReadableStream("{}"),
      headers: {
        "Content-Type": "application/json"
      },
      isBase64Encoded: false
    };
  }
  if (rawPath.startsWith(dataPattern) && rawPath.endsWith(".json")) {
    const newPath = `${basePath}${rawPath.slice(dataPattern.length, -".json".length).replace(/^\/index$/, "/")}`;
    query.__nextDataReq = "1";
    return {
      ...internalEvent,
      rawPath: newPath,
      query,
      url: new URL(`${newPath}${convertToQueryString(query)}`, internalEvent.url).href
    };
  }
  return internalEvent;
}
function handleFallbackFalse(internalEvent, prerenderManifest) {
  const { rawPath } = internalEvent;
  const { dynamicRoutes, routes } = prerenderManifest;
  const prerenderedFallbackRoutes = Object.entries(dynamicRoutes).filter(([, { fallback }]) => fallback === false);
  const routeFallback = prerenderedFallbackRoutes.some(([, { routeRegex }]) => {
    const routeRegexExp = new RegExp(routeRegex);
    return routeRegexExp.test(rawPath);
  });
  const locales = NextConfig.i18n?.locales;
  const routesAlreadyHaveLocale = locales?.includes(rawPath.split("/")[1]) || // If we don't use locales, we don't need to add the default locale
  locales === void 0;
  let localizedPath = routesAlreadyHaveLocale ? rawPath : `/${NextConfig.i18n?.defaultLocale}${rawPath}`;
  if (
    // Not if localizedPath is "/" tho, because that would not make it find `isPregenerated` below since it would be try to match an empty string.
    localizedPath !== "/" && NextConfig.trailingSlash && localizedPath.endsWith("/")
  ) {
    localizedPath = localizedPath.slice(0, -1);
  }
  const matchedStaticRoute = staticRouteMatcher(localizedPath);
  const prerenderedFallbackRoutesName = prerenderedFallbackRoutes.map(([name]) => name);
  const matchedDynamicRoute = dynamicRouteMatcher(localizedPath).filter(({ route }) => !prerenderedFallbackRoutesName.includes(route));
  const isPregenerated = Object.keys(routes).includes(localizedPath);
  if (routeFallback && !isPregenerated && matchedStaticRoute.length === 0 && matchedDynamicRoute.length === 0) {
    return {
      event: {
        ...internalEvent,
        rawPath: "/404",
        url: constructNextUrl(internalEvent.url, "/404"),
        headers: {
          ...internalEvent.headers,
          "x-invoke-status": "404"
        }
      },
      isISR: false
    };
  }
  return {
    event: internalEvent,
    isISR: routeFallback || isPregenerated
  };
}

// node_modules/@opennextjs/aws/dist/core/routing/middleware.js
init_stream();
init_utils();
var middlewareManifest = MiddlewareManifest;
var functionsConfigManifest = FunctionsConfigManifest;
var middleMatch = getMiddlewareMatch(middlewareManifest, functionsConfigManifest);
function defaultMiddlewareLoader() {
  return Promise.resolve().then(() => (init_edgeFunctionHandler(), edgeFunctionHandler_exports));
}
async function handleMiddleware(internalEvent, initialSearch, middlewareLoader = defaultMiddlewareLoader) {
  const headers = internalEvent.headers;
  if (headers["x-isr"] && headers["x-prerender-revalidate"] === PrerenderManifest.preview.previewModeId)
    return internalEvent;
  const normalizedPath = localizePath(internalEvent);
  const hasMatch = middleMatch.some((r) => r.test(normalizedPath));
  if (!hasMatch)
    return internalEvent;
  const initialUrl = new URL(normalizedPath, internalEvent.url);
  initialUrl.search = initialSearch;
  const url = initialUrl.href;
  const middleware = await middlewareLoader();
  const result = await middleware.default({
    // `geo` is pre Next 15.
    geo: {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: decodeURIComponent(headers["x-open-next-city"]),
      country: headers["x-open-next-country"],
      region: headers["x-open-next-region"],
      latitude: headers["x-open-next-latitude"],
      longitude: headers["x-open-next-longitude"]
    },
    headers,
    method: internalEvent.method || "GET",
    nextConfig: {
      basePath: NextConfig.basePath,
      i18n: NextConfig.i18n,
      trailingSlash: NextConfig.trailingSlash
    },
    url,
    body: convertBodyToReadableStream(internalEvent.method, internalEvent.body)
  });
  const statusCode = result.status;
  const responseHeaders = result.headers;
  const reqHeaders = {};
  const resHeaders = {};
  const filteredHeaders = [
    "x-middleware-override-headers",
    "x-middleware-next",
    "x-middleware-rewrite",
    // We need to drop `content-encoding` because it will be decoded
    "content-encoding"
  ];
  const xMiddlewareKey = "x-middleware-request-";
  responseHeaders.forEach((value, key) => {
    if (key.startsWith(xMiddlewareKey)) {
      const k = key.substring(xMiddlewareKey.length);
      reqHeaders[k] = value;
    } else {
      if (filteredHeaders.includes(key.toLowerCase()))
        return;
      if (key.toLowerCase() === "set-cookie") {
        resHeaders[key] = resHeaders[key] ? [...resHeaders[key], value] : [value];
      } else {
        resHeaders[key] = value;
      }
    }
  });
  const rewriteUrl = responseHeaders.get("x-middleware-rewrite");
  let isExternalRewrite = false;
  let middlewareQuery = internalEvent.query;
  let newUrl = internalEvent.url;
  if (rewriteUrl) {
    newUrl = rewriteUrl;
    if (isExternal(newUrl, internalEvent.headers.host)) {
      isExternalRewrite = true;
    } else {
      const rewriteUrlObject = new URL(rewriteUrl);
      middlewareQuery = getQueryFromSearchParams(rewriteUrlObject.searchParams);
      if ("__nextDataReq" in internalEvent.query) {
        middlewareQuery.__nextDataReq = internalEvent.query.__nextDataReq;
      }
    }
  }
  if (!rewriteUrl && !responseHeaders.get("x-middleware-next")) {
    const body = result.body ?? emptyReadableStream();
    return {
      type: internalEvent.type,
      statusCode,
      headers: resHeaders,
      body,
      isBase64Encoded: false
    };
  }
  return {
    responseHeaders: resHeaders,
    url: newUrl,
    rawPath: new URL(newUrl).pathname,
    type: internalEvent.type,
    headers: { ...internalEvent.headers, ...reqHeaders },
    body: internalEvent.body,
    method: internalEvent.method,
    query: middlewareQuery,
    cookies: internalEvent.cookies,
    remoteAddress: internalEvent.remoteAddress,
    isExternalRewrite
  };
}

// node_modules/@opennextjs/aws/dist/core/routingHandler.js
var MIDDLEWARE_HEADER_PREFIX = "x-middleware-response-";
var MIDDLEWARE_HEADER_PREFIX_LEN = MIDDLEWARE_HEADER_PREFIX.length;
var INTERNAL_HEADER_PREFIX = "x-opennext-";
var INTERNAL_HEADER_INITIAL_URL = `${INTERNAL_HEADER_PREFIX}initial-url`;
var INTERNAL_HEADER_LOCALE = `${INTERNAL_HEADER_PREFIX}locale`;
var INTERNAL_HEADER_RESOLVED_ROUTES = `${INTERNAL_HEADER_PREFIX}resolved-routes`;
var INTERNAL_EVENT_REQUEST_ID = `${INTERNAL_HEADER_PREFIX}request-id`;
var geoHeaderToNextHeader = {
  "x-open-next-city": "x-vercel-ip-city",
  "x-open-next-country": "x-vercel-ip-country",
  "x-open-next-region": "x-vercel-ip-country-region",
  "x-open-next-latitude": "x-vercel-ip-latitude",
  "x-open-next-longitude": "x-vercel-ip-longitude"
};
function applyMiddlewareHeaders(eventOrResult, middlewareHeaders) {
  const isResult = isInternalResult(eventOrResult);
  const headers = eventOrResult.headers;
  const keyPrefix = isResult ? "" : MIDDLEWARE_HEADER_PREFIX;
  Object.entries(middlewareHeaders).forEach(([key, value]) => {
    if (value) {
      headers[keyPrefix + key] = Array.isArray(value) ? value.join(",") : value;
    }
  });
}
async function routingHandler(event, { assetResolver }) {
  try {
    for (const [openNextGeoName, nextGeoName] of Object.entries(geoHeaderToNextHeader)) {
      const value = event.headers[openNextGeoName];
      if (value) {
        event.headers[nextGeoName] = value;
      }
    }
    for (const key of Object.keys(event.headers)) {
      if (key.startsWith(INTERNAL_HEADER_PREFIX) || key.startsWith(MIDDLEWARE_HEADER_PREFIX)) {
        delete event.headers[key];
      }
    }
    let headers = getNextConfigHeaders(event, ConfigHeaders);
    let eventOrResult = fixDataPage(event, BuildId);
    if (isInternalResult(eventOrResult)) {
      return eventOrResult;
    }
    const redirect = handleRedirects(eventOrResult, RoutesManifest.redirects);
    if (redirect) {
      redirect.headers.Location = new URL(redirect.headers.Location).href;
      debug("redirect", redirect);
      return redirect;
    }
    const middlewareEventOrResult = await handleMiddleware(
      eventOrResult,
      // We need to pass the initial search without any decoding
      // TODO: we'd need to refactor InternalEvent to include the initial querystring directly
      // Should be done in another PR because it is a breaking change
      new URL(event.url).search
    );
    if (isInternalResult(middlewareEventOrResult)) {
      return middlewareEventOrResult;
    }
    headers = {
      ...middlewareEventOrResult.responseHeaders,
      ...headers
    };
    let isExternalRewrite = middlewareEventOrResult.isExternalRewrite ?? false;
    eventOrResult = middlewareEventOrResult;
    if (!isExternalRewrite) {
      const beforeRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.beforeFiles);
      eventOrResult = beforeRewrite.internalEvent;
      isExternalRewrite = beforeRewrite.isExternalRewrite;
      if (!isExternalRewrite) {
        const assetResult = await assetResolver?.maybeGetAssetResult?.(eventOrResult);
        if (assetResult) {
          applyMiddlewareHeaders(assetResult, headers);
          return assetResult;
        }
      }
    }
    const foundStaticRoute = staticRouteMatcher(eventOrResult.rawPath);
    const isStaticRoute = !isExternalRewrite && foundStaticRoute.length > 0;
    if (!(isStaticRoute || isExternalRewrite)) {
      const afterRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.afterFiles);
      eventOrResult = afterRewrite.internalEvent;
      isExternalRewrite = afterRewrite.isExternalRewrite;
    }
    let isISR = false;
    if (!isExternalRewrite) {
      const fallbackResult = handleFallbackFalse(eventOrResult, PrerenderManifest);
      eventOrResult = fallbackResult.event;
      isISR = fallbackResult.isISR;
    }
    const foundDynamicRoute = dynamicRouteMatcher(eventOrResult.rawPath);
    const isDynamicRoute = !isExternalRewrite && foundDynamicRoute.length > 0;
    if (!(isDynamicRoute || isStaticRoute || isExternalRewrite)) {
      const fallbackRewrites = handleRewrites(eventOrResult, RoutesManifest.rewrites.fallback);
      eventOrResult = fallbackRewrites.internalEvent;
      isExternalRewrite = fallbackRewrites.isExternalRewrite;
    }
    const isNextImageRoute = eventOrResult.rawPath.startsWith("/_next/image");
    const isRouteFoundBeforeAllRewrites = isStaticRoute || isDynamicRoute || isExternalRewrite;
    if (!(isRouteFoundBeforeAllRewrites || isNextImageRoute || // We need to check again once all rewrites have been applied
    staticRouteMatcher(eventOrResult.rawPath).length > 0 || dynamicRouteMatcher(eventOrResult.rawPath).length > 0)) {
      eventOrResult = {
        ...eventOrResult,
        rawPath: "/404",
        url: constructNextUrl(eventOrResult.url, "/404"),
        headers: {
          ...eventOrResult.headers,
          "x-middleware-response-cache-control": "private, no-cache, no-store, max-age=0, must-revalidate"
        }
      };
    }
    if (globalThis.openNextConfig.dangerous?.enableCacheInterception && !isInternalResult(eventOrResult)) {
      debug("Cache interception enabled");
      eventOrResult = await cacheInterceptor(eventOrResult);
      if (isInternalResult(eventOrResult)) {
        applyMiddlewareHeaders(eventOrResult, headers);
        return eventOrResult;
      }
    }
    applyMiddlewareHeaders(eventOrResult, headers);
    const resolvedRoutes = [
      ...foundStaticRoute,
      ...foundDynamicRoute
    ];
    debug("resolvedRoutes", resolvedRoutes);
    return {
      internalEvent: eventOrResult,
      isExternalRewrite,
      origin: false,
      isISR,
      resolvedRoutes,
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(eventOrResult, NextConfig.i18n) : void 0
    };
  } catch (e) {
    error("Error in routingHandler", e);
    return {
      internalEvent: {
        type: "core",
        method: "GET",
        rawPath: "/500",
        url: constructNextUrl(event.url, "/500"),
        headers: {
          ...event.headers
        },
        query: event.query,
        cookies: event.cookies,
        remoteAddress: event.remoteAddress
      },
      isExternalRewrite: false,
      origin: false,
      isISR: false,
      resolvedRoutes: [],
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(event, NextConfig.i18n) : void 0
    };
  }
}
function isInternalResult(eventOrResult) {
  return eventOrResult != null && "statusCode" in eventOrResult;
}

// node_modules/@opennextjs/aws/dist/adapters/middleware.js
globalThis.internalFetch = fetch;
globalThis.__openNextAls = new AsyncLocalStorage();
var defaultHandler = async (internalEvent, options) => {
  const config = globalThis.openNextConfig.middleware;
  const originResolver = await resolveOriginResolver(config?.originResolver);
  const externalRequestProxy = await resolveProxyRequest(config?.override?.proxyExternalRequest);
  const assetResolver = await resolveAssetResolver(config?.assetResolver);
  const requestId = Math.random().toString(36);
  return runWithOpenNextRequestContext({
    isISRRevalidation: internalEvent.headers["x-isr"] === "1",
    waitUntil: options?.waitUntil,
    requestId
  }, async () => {
    const result = await routingHandler(internalEvent, { assetResolver });
    if ("internalEvent" in result) {
      debug("Middleware intercepted event", internalEvent);
      if (!result.isExternalRewrite) {
        const origin = await originResolver.resolve(result.internalEvent.rawPath);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_HEADER_INITIAL_URL]: internalEvent.url,
              [INTERNAL_HEADER_RESOLVED_ROUTES]: JSON.stringify(result.resolvedRoutes),
              [INTERNAL_EVENT_REQUEST_ID]: requestId
            }
          },
          isExternalRewrite: result.isExternalRewrite,
          origin,
          isISR: result.isISR,
          initialURL: result.initialURL,
          resolvedRoutes: result.resolvedRoutes
        };
      }
      try {
        return externalRequestProxy.proxy(result.internalEvent);
      } catch (e) {
        error("External request failed.", e);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_EVENT_REQUEST_ID]: requestId
            },
            rawPath: "/500",
            url: constructNextUrl(result.internalEvent.url, "/500"),
            method: "GET"
          },
          // On error we need to rewrite to the 500 page which is an internal rewrite
          isExternalRewrite: false,
          origin: false,
          isISR: result.isISR,
          initialURL: result.internalEvent.url,
          resolvedRoutes: [{ route: "/500", type: "page" }]
        };
      }
    }
    result.headers[INTERNAL_EVENT_REQUEST_ID] = requestId;
    debug("Middleware response", result);
    return result;
  });
};
var handler2 = await createGenericHandler({
  handler: defaultHandler,
  type: "middleware"
});
var middleware_default = {
  fetch: handler2
};
export {
  middleware_default as default,
  handler2 as handler
};
