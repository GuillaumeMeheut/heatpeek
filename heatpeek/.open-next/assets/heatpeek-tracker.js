!(function () {
  "use strict";
  function t(e, r) {
    const s = n();
    return (t = function (t, n) {
      return s[(t -= 482)];
    })(e, r);
  }
  function n() {
    const t = [
      "lighthouse",
      "baiduspider",
      "curl",
      "spider",
      "pingdom",
      "28ksOtNd",
      "some",
      "selenium",
      "datadog",
      "1326762BWcVuz",
      "mozilla/5.0 (crawler;)",
      "117KJqUXW",
      "apache-httpclient",
      "facebookexternalhit",
      "phantomjs",
      "acunetix",
      "mozilla/5.0 (compatible;)",
      "twitterbot",
      "mozilla/5.0 (monitoring;)",
      "webdriver",
      "nikto",
      "688xCwfHw",
      "bingbot",
      "googlebot",
      "includes",
      "3248590VNOthr",
      "zap",
      "8681752MLLlqi",
      "python-requests",
      "nessus",
      "burp",
      "puppeteer",
      "yandexbot",
      "wget",
      "2269aFQfNG",
      "playwright",
      "mozilla/5.0 (spider;)",
      "bot",
      "linkedinbot",
      "toLowerCase",
      "9825536KfEWMY",
      "1312795ddHuXQ",
      "4941873gORNCF",
    ];
    return (n = function () {
      return t;
    })();
  }
  function e(t, n) {
    const s = r();
    return (e = function (t, n) {
      return s[(t -= 469)];
    })(t, n);
  }
  function r() {
    const t = [
      "/api/verify/",
      "1695iSdbUP",
      "application/json",
      "3572910WHrORo",
      "4637540acxvXq",
      "location",
      "40152ETaciz",
      "POST",
      "232868uIuRrN",
      "search",
      "Heatpeek: verifyTracking failed",
      "error",
      "12457296bMrxZw",
      "get",
      "30040vwWRSC",
      "66TIUjrx",
      "226zcIcJi",
      "stringify",
      "10782VkXmkd",
      "1666wqrBzr",
      "close",
    ];
    return (r = function () {
      return t;
    })();
  }
  function s() {
    const t = [
      "trackingId",
      "&b=",
      "CACHE_DURATION",
      "data",
      "device",
      "lastFetch",
      "1QziMBq",
      "&d=",
      "9564fIdzhQ",
      "1233ubcawj",
      "5512878GQmREI",
      "/api/project/init?id=",
      "endpointAPI",
      "4818345lCsFiz",
      "&p=",
      "browser",
      "21427758fMvdqI",
      "&o=",
      "1041570eCFiHB",
      "Failed to fetch config",
      "2566440QQDxii",
      "3569215XAxpHg",
      "path",
    ];
    return (s = function () {
      return t;
    })();
  }
  function i(t, n) {
    const e = s();
    return (i = function (t, n) {
      return e[(t -= 279)];
    })(t, n);
  }
  !(function (n) {
    const e = t,
      r = n();
    for (;;)
      try {
        if (
          978943 ===
          (-parseInt(e(506)) / 1) * (-parseInt(e(493)) / 2) +
            -parseInt(e(514)) / 3 +
            (parseInt(e(520)) / 4) * (-parseInt(e(513)) / 5) +
            -parseInt(e(524)) / 6 +
            -parseInt(e(512)) / 7 +
            parseInt(e(499)) / 8 +
            (parseInt(e(483)) / 9) * (parseInt(e(497)) / 10)
        )
          break;
        r.push(r.shift());
      } catch (s) {
        r.push(r.shift());
      }
  })(n),
    (function (t) {
      const n = e,
        r = t();
      for (;;)
        try {
          if (
            923970 ===
            parseInt(n(473)) / 1 +
              (parseInt(n(481)) / 2) * (-parseInt(n(471)) / 3) +
              parseInt(n(469)) / 4 +
              (-parseInt(n(487)) / 5) * (parseInt(n(483)) / 6) +
              (parseInt(n(484)) / 7) * (parseInt(n(479)) / 8) +
              -parseInt(n(477)) / 9 +
              (parseInt(n(489)) / 10) * (parseInt(n(480)) / 11)
          )
            break;
          r.push(r.shift());
        } catch (s) {
          r.push(r.shift());
        }
    })(r),
    (function (t) {
      const n = i,
        e = t();
      for (;;)
        try {
          if (
            722850 ===
            (-parseInt(n(298)) / 1) * (parseInt(n(287)) / 2) +
              (parseInt(n(301)) / 3) * (parseInt(n(300)) / 4) +
              parseInt(n(290)) / 5 +
              parseInt(n(279)) / 6 +
              parseInt(n(282)) / 7 +
              parseInt(n(289)) / 8 +
              -parseInt(n(285)) / 9
          )
            break;
          e.push(e.shift());
        } catch (r) {
          e.push(e.shift());
        }
    })(s);
  const o = {
    data: null,
    lastFetch: 0,
    CACHE_DURATION: 6e4,
    endpointAPI: null,
    endpoint: null,
    trackingId: null,
    path: null,
    device: null,
    browser: null,
    os: null,
    init(t, n, e, r, s, o, a) {
      const c = i;
      (this[c(281)] = t),
        (this.endpoint = n),
        (this[c(292)] = e),
        (this.path = r),
        (this[c(296)] = s),
        (this.browser = o),
        (this.os = a);
    },
    async fetch() {
      const t = i,
        n = Date.now();
      if (this.data && n - this[t(297)] < this[t(294)]) return this[t(295)];
      try {
        const e = await fetch(
          this[t(281)] +
            t(280) +
            this.trackingId +
            t(283) +
            encodeURIComponent(this[t(291)]) +
            t(299) +
            this[t(296)] +
            t(293) +
            this[t(284)] +
            t(286) +
            this.os
        );
        if (!e.ok) throw new Error(t(288));
        return (
          (this[t(295)] = await e.json()), (this[t(297)] = n), this[t(295)]
        );
      } catch (e) {
        return null;
      }
    },
    get() {
      return this.data;
    },
  };
  function a(t, n) {
    const e = c();
    return (a = function (t, n) {
      return e[(t -= 494)];
    })(t, n);
  }
  function c() {
    const t = [
      "pathname",
      "4011oGSFPg",
      "visibilityState",
      "heatpeek:navigation",
      "320BVxiKQ",
      "hashchange",
      "visible",
      "pushState",
      "768612TPnfqa",
      "dispatchEvent",
      "1616uQrNus",
      "717304tPqyVH",
      "1049846fCjqUU",
      "5227605fyhFKx",
      "addEventListener",
      "6306054AQSEGu",
      "pageshow",
      "7EXQqQj",
      "12056SePBpU",
      "90BjjXuC",
    ];
    return (c = function () {
      return t;
    })();
  }
  function p(t, n) {
    const e = u();
    return (p = function (t, n) {
      return e[(t -= 396)];
    })(t, n);
  }
  function u() {
    const t = [
      "5511024clrhig",
      "99hIiKAk",
      "toLowerCase",
      "length",
      "tagName",
      "4BACIGs",
      "2341425LkIAru",
      "606148lgzNVs",
      "3xpJrLK",
      "join",
      "charCodeAt",
      "5097501auKuEY",
      "8073352ZGRXFm",
      "toString",
      "className",
      "map",
      "from",
      "9470CYHrsj",
      "6ULxPNL",
      "8gFzHHe",
      "escape",
      "1752567pJFiJF",
      " > ",
      "indexOf",
      "nodeName",
      "abs",
      "unshift",
    ];
    return (u = function () {
      return t;
    })();
  }
  function f(t) {
    const n = p;
    if (t.id) return "#" + CSS.escape(t.id);
    const e = [];
    for (; t && t.nodeType === Node.ELEMENT_NODE; ) {
      let r = t[n(416)][n(421)]();
      if (t[n(406)]) {
        r += Array.from(t.classList)
          [n(407)]((t) => "." + CSS[n(412)](t))
          [n(401)]("");
      }
      const s = t.parentElement;
      if (s) {
        const e = Array[n(408)](s.children).filter(
          (e) => e[n(396)] === t.tagName
        );
        if (e.length > 1) {
          r += ":nth-of-type(" + (e[n(415)](t) + 1) + ")";
        }
      }
      e[n(418)](r), (t = t.parentElement);
    }
    return (function (t) {
      const n = p;
      let e = 0;
      for (let r = 0; r < t[n(422)]; r++)
        (e = (e << 5) - e + t[n(402)](r)), (e |= 0);
      return Math[n(417)](e)[n(405)](36).substring(0, 8);
    })(e[n(401)](n(414)));
  }
  function h() {
    const t = [
      "scrollY",
      "visibilityState",
      "3204330dHMfdf",
      "sendBeacon",
      "2483880VdinhM",
      "31765660TOHyzY",
      "clear",
      "18LCFgYl",
      "left",
      "click",
      "pageX",
      "3682368EjDtPM",
      "8xKYYGa",
      "set",
      "/api/event/events",
      "hidden",
      "top",
      "scrollX",
      "now",
      "splice",
      "9212511VOmAZu",
      "endpointAPI",
      "browser",
      "length",
      "toISOString",
      "919578THEBLY",
      "rage_click",
      "visibilitychange",
      "application/json",
      "device",
      "has",
      "1qBMsYu",
      "target",
      "stringify",
      "pageY",
      "shift",
      "getBoundingClientRect",
      "375425zXNIkK",
      "heatpeek:navigation",
      "height",
      "addEventListener",
      "path",
      "round",
    ];
    return (h = function () {
      return t;
    })();
  }
  function d(t, n) {
    const e = h();
    return (d = function (t, n) {
      return e[(t -= 318)];
    })(t, n);
  }
  !(function (t) {
    const n = a,
      e = t();
    for (;;)
      try {
        if (
          811798 ===
          -parseInt(n(497)) / 1 +
            parseInt(n(513)) / 2 +
            (parseInt(n(506)) / 3) * (parseInt(n(495)) / 4) +
            -parseInt(n(498)) / 5 +
            (-parseInt(n(500)) / 6) * (-parseInt(n(502)) / 7) +
            (-parseInt(n(496)) / 8) * (-parseInt(n(504)) / 9) +
            (-parseInt(n(509)) / 10) * (-parseInt(n(503)) / 11)
        )
          break;
        e.push(e.shift());
      } catch (r) {
        e.push(e.shift());
      }
  })(c),
    (function (t) {
      const n = p,
        e = t();
      for (;;)
        try {
          if (
            888908 ===
            (-parseInt(n(400)) / 1) * (-parseInt(n(399)) / 2) +
              (-parseInt(n(413)) / 3) * (-parseInt(n(397)) / 4) +
              (parseInt(n(398)) / 5) * (-parseInt(n(410)) / 6) +
              -parseInt(n(404)) / 7 +
              (parseInt(n(411)) / 8) * (parseInt(n(403)) / 9) +
              (parseInt(n(409)) / 10) * (-parseInt(n(420)) / 11) +
              parseInt(n(419)) / 12
          )
            break;
          e.push(e.shift());
        } catch (r) {
          e.push(e.shift());
        }
    })(u),
    (function (t) {
      const n = d,
        e = t();
      for (;;)
        try {
          if (
            815099 ===
            (-parseInt(n(358)) / 1) * (-parseInt(n(352)) / 2) +
              -parseInt(n(329)) / 3 +
              -parseInt(n(331)) / 4 +
              (-parseInt(n(321)) / 5) * (parseInt(n(334)) / 6) +
              -parseInt(n(347)) / 7 +
              (-parseInt(n(339)) / 8) * (-parseInt(n(338)) / 9) +
              parseInt(n(332)) / 10
          )
            break;
          e.push(e.shift());
        } catch (r) {
          e.push(e.shift());
        }
    })(h);
  const I = g;
  function l() {
    const t = [
      "1895174umcubc",
      "26220336bLqcSR",
      "2645216dfrvZF",
      "914640QZWIIr",
      "11649743IQToDH",
      "25QvdVya",
      "483304RZwcBR",
      "update_snap_desktop",
      "large-desktop",
      "innerWidth",
      "9039192VqgoPw",
      "tablet",
      "desktop",
      "mobile",
    ];
    return (l = function () {
      return t;
    })();
  }
  function g(t, n) {
    const e = l();
    return (g = function (t, n) {
      return e[(t -= 206)];
    })(t, n);
  }
  !(function (t) {
    const n = g,
      e = t();
    for (;;)
      try {
        if (
          978577 ===
          parseInt(n(212)) / 1 +
            -parseInt(n(214)) / 2 +
            -parseInt(n(215)) / 3 +
            (parseInt(n(218)) / 4) * (parseInt(n(217)) / 5) +
            -parseInt(n(208)) / 6 +
            -parseInt(n(216)) / 7 +
            parseInt(n(213)) / 8
        )
          break;
        e.push(e.shift());
      } catch (r) {
        e.push(e.shift());
      }
  })(l);
  const w = {
    desktop: I(219),
    tablet: "update_snap_tablet",
    mobile: "update_snap_mobile",
  };
  function m(t, n) {
    const e = b();
    return (m = function (t, n) {
      return e[(t -= 288)];
    })(t, n);
  }
  function b() {
    const t = [
      "2HykDyl",
      "206221yqOPxh",
      "55kNnSFc",
      "296292gDGUAl",
      "load",
      "8044302vUpvMi",
      "browser",
      "device",
      "24953780yvCDlZ",
      "innerWidth",
      "trackingId",
      "href",
      "application/json",
      "page_config",
      "addEventListener",
      "stringify",
      "5782143qgqfzn",
      "innerHeight",
      "18iOYTet",
      "documentElement",
      "POST",
      "outerHTML",
      "300882vfYhXl",
      "10787216iVaRua",
      "endpoint",
    ];
    return (b = function () {
      return t;
    })();
  }
  function y({ config: t }) {
    const n = m;
    window[n(295)](n(310), () => {
      setTimeout(() => {
        (function (t) {
          const n = m;
          if ("Chrome" !== t[n(312)]) return !1;
          const e = t.get();
          return !!e?.[n(294)]?.[w[t[n(288)]]];
        })(t) &&
          (function (t) {
            const n = m;
            fetch(t[n(305)] + "/api/screenPage", {
              method: n(301),
              headers: { "Content-Type": n(293) },
              body: JSON[n(296)]({
                trackingId: t[n(291)],
                device: t[n(288)],
                browser: t[n(312)],
                os: t.os,
                url: window.location[n(292)],
                snapshot: k(),
              }),
            });
          })(t);
      }, 2500);
    });
  }
  function k() {
    const t = m;
    return {
      html: document[t(300)][t(302)],
      viewport: { width: window[t(290)], height: window[t(298)] },
    };
  }
  function v(t, n) {
    const e = C();
    return (v = function (t, n) {
      return e[(t -= 176)];
    })(t, n);
  }
  function S({ config: t }) {
    (function (t) {
      const n = v,
        e = t[n(178)]();
      return t[n(184)] !== n(183) && !1 !== e?.[n(182)]?.[n(179)];
    })(t) &&
      ((function () {
        const t = a;
        let n = location[t(505)];
        function e(e = !1) {
          const r = t,
            s = location[r(505)];
          (e && s === n) ||
            ((n = s), document[r(494)](new CustomEvent(r(508), { detail: s })));
        }
        window.addEventListener(t(510), () => e(!0)),
          window.addEventListener("popstate", () => e(!0));
        const r = history.pushState;
        (history[t(512)] = function () {
          r.apply(this, arguments), e(!0);
        }),
          "hidden" === document[t(507)] || "prerender" === document[t(507)]
            ? document[t(499)]("visibilitychange", () => {
                const n = t;
                document.visibilityState === n(511) && e(!1);
              })
            : e(!1),
          window.addEventListener(t(501), (t) => {
            t.persisted && e(!1);
          });
      })(),
      (function ({ config: t }) {
        const n = d;
        let e = 0;
        const r = new Map(),
          s = [];
        let i = 0;
        const o = () => {
          const n = d;
          if (!s[n(350)]) return;
          const e = JSON[n(360)]({
            trackingId: t.trackingId,
            path: t[n(325)],
            device: t[n(356)],
            browser: t[n(349)],
            os: t.os,
            events: s[n(346)](0),
          });
          navigator[n(330)]
            ? navigator[n(330)](t[n(348)] + n(341), e)
            : fetch(t.endpointAPI + n(341), {
                method: "POST",
                headers: { "Content-Type": n(355) },
                body: e,
              });
        };
        setInterval(o, 5e3),
          window.addEventListener("beforeunload", o),
          document[n(324)](n(354), () => {
            const t = n;
            document[t(328)] === t(342) && o();
          }),
          document[n(324)](n(336), (t) => {
            const a = n,
              c = Date[a(345)]();
            if (c - e < 500) return;
            e = c;
            const p = t[a(359)],
              u = p[a(320)](),
              h = Math.round(u[a(335)] + window[a(344)]),
              d = Math[a(326)](u[a(343)] + window[a(327)]),
              I = Math.round(u.width),
              l = Math.round(u[a(323)]),
              g = f(p),
              w = (t[a(337)] - h) / I,
              m = (t[a(318)] - d) / l;
            r[a(357)](g) || r[a(340)](g, []);
            const b = r.get(g);
            for (b.push(c); b[a(350)] && b[0] < c - 1500; ) b[a(319)]();
            const y = b[a(350)] >= 3,
              k = {
                timestamp: new Date()[a(351)](),
                selector: g,
                erx: w,
                ery: m,
              };
            s.push(
              y
                ? { ...k, type: a(353) }
                : { ...k, type: a(336), firstClickRank: i < 3 ? ++i : null }
            ),
              s.length >= 10 && o();
          }),
          document[n(324)](n(322), () => {
            (i = 0), r[n(333)]();
          });
      })({ config: t }),
      y({ config: t }));
  }
  function C() {
    const t = [
      "large-desktop",
      "device",
      "10062912WrxPVT",
      "27vHUQMh",
      "17546aebEMn",
      "122083YkQDTW",
      "7012950SCczkX",
      "288FWxBTx",
      "429000pdyVqz",
      "3081280ahCYsc",
      "get",
      "is_active",
      "9391920twFgOU",
      "6UXfZVQ",
      "page_config",
    ];
    return (C = function () {
      return t;
    })();
  }
  function E() {
    const t = [
      "chrome",
      "522068bStpqU",
      "5785200ErjtyB",
      "edge",
      "73652wAzyOY",
      "4nofKma",
      "firefox",
      "safari",
      "3520460bUcAlO",
      "test",
      "192FWsRUN",
      "224ZNzYof",
      "other",
      "9ygnkQb",
      "33IRjoxT",
      "5606820Otwpni",
      "89016kmeGSh",
      "858077zbkfNw",
    ];
    return (E = function () {
      return t;
    })();
  }
  function x(t, n) {
    const e = E();
    return (x = function (t, n) {
      return e[(t -= 345)];
    })(t, n);
  }
  function O() {
    const t = [
      "6611096HSaesu",
      "ios",
      "3553456sUerIm",
      "1122095BdivBJ",
      "userAgent",
      "test",
      "9138357XqDoam",
      "4393900kmZIjv",
      "android",
      "58722mdKLzo",
      "windows",
      "chromeos",
      "333332Iliysl",
      "3dyfnPx",
      "5JMxsMR",
    ];
    return (O = function () {
      return t;
    })();
  }
  function z(t, n) {
    const e = O();
    return (z = function (t, n) {
      return e[(t -= 197)];
    })(t, n);
  }
  function N(t, n) {
    const e = A();
    return (N = function (t, n) {
      return e[(t -= 461)];
    })(t, n);
  }
  function A() {
    const t = [
      "3itMkbr",
      "pathname",
      "27930BjtcvZ",
      "5057695cUudrY",
      "60552gwFEQq",
      "7875480yRflpU",
      "182663wdnGxG",
      "fetch",
      "init",
      "2664nOSSxy",
      "getAttribute",
      "http://localhost:3000",
      "4GIOKDD",
      "3990153YkiFiO",
      "9vdbPmo",
      "11SXzlnd",
      "13502416lQjWaR",
      "588tsCJcD",
      "location",
    ];
    return (A = function () {
      return t;
    })();
  }
  !(function (t) {
    const n = m,
      e = t();
    for (;;)
      try {
        if (
          985256 ===
          -parseInt(n(307)) / 1 +
            (parseInt(n(306)) / 2) * (-parseInt(n(297)) / 3) +
            parseInt(n(309)) / 4 +
            (parseInt(n(308)) / 5) * (parseInt(n(303)) / 6) +
            -parseInt(n(311)) / 7 +
            -parseInt(n(304)) / 8 +
            (parseInt(n(299)) / 9) * (parseInt(n(289)) / 10)
        )
          break;
        e.push(e.shift());
      } catch (r) {
        e.push(e.shift());
      }
  })(b),
    (function (t) {
      const n = v,
        e = t();
      for (;;)
        try {
          if (
            693857 ===
            parseInt(n(188)) / 1 +
              (-parseInt(n(187)) / 2) * (parseInt(n(190)) / 3) +
              parseInt(n(177)) / 4 +
              parseInt(n(176)) / 5 +
              (parseInt(n(181)) / 6) * (-parseInt(n(189)) / 7) +
              -parseInt(n(185)) / 8 +
              (-parseInt(n(186)) / 9) * (-parseInt(n(180)) / 10)
          )
            break;
          e.push(e.shift());
        } catch (r) {
          e.push(e.shift());
        }
    })(C),
    (function (t) {
      const n = x,
        e = t();
      for (;;)
        try {
          if (
            609857 ===
            (parseInt(n(350)) / 1) * (parseInt(n(354)) / 2) +
              (parseInt(n(345)) / 3) * (-parseInt(n(353)) / 4) +
              parseInt(n(357)) / 5 +
              (parseInt(n(347)) / 6) * (parseInt(n(360)) / 7) +
              -parseInt(n(351)) / 8 +
              (-parseInt(n(362)) / 9) * (-parseInt(n(346)) / 10) +
              (-parseInt(n(348)) / 11) * (parseInt(n(359)) / 12)
          )
            break;
          e.push(e.shift());
        } catch (r) {
          e.push(e.shift());
        }
    })(E),
    (function (t) {
      const n = z,
        e = t();
      for (;;)
        try {
          if (
            759408 ===
            -parseInt(n(210)) / 1 +
              (-parseInt(n(204)) / 2) * (-parseInt(n(205)) / 3) +
              (-parseInt(n(209)) / 4) * (-parseInt(n(206)) / 5) +
              parseInt(n(201)) / 6 +
              parseInt(n(199)) / 7 +
              -parseInt(n(207)) / 8 +
              parseInt(n(198)) / 9
          )
            break;
          e.push(e.shift());
        } catch (r) {
          e.push(e.shift());
        }
    })(O),
    (function (t) {
      const n = N,
        e = t();
      for (;;)
        try {
          if (
            872153 ===
            (-parseInt(n(470)) / 1) * (-parseInt(n(472)) / 2) +
              -parseInt(n(464)) / 3 +
              (parseInt(n(463)) / 4) * (-parseInt(n(473)) / 5) +
              (-parseInt(n(474)) / 6) * (parseInt(n(468)) / 7) +
              (parseInt(n(467)) / 8) * (parseInt(n(465)) / 9) +
              (-parseInt(n(475)) / 10) * (parseInt(n(466)) / 11) +
              (-parseInt(n(479)) / 12) * (-parseInt(n(476)) / 13)
          )
            break;
          e.push(e.shift());
        } catch (r) {
          e.push(e.shift());
        }
    })(A),
    (function () {
      const n = N,
        r = document.currentScript[n(461)]("id"),
        s = n(462);
      if (
        !r ||
        (function () {
          const n = t,
            e = navigator.userAgent[n(511)]();
          return [
            n(509),
            "crawler",
            n(518),
            "headless",
            n(522),
            n(495),
            n(494),
            n(504),
            "duckduckbot",
            n(516),
            n(515),
            n(491),
            n(486),
            n(503),
            n(507),
            "nmap",
            n(492),
            n(487),
            n(501),
            n(502),
            n(498),
            n(517),
            n(505),
            n(500),
            "java-http-client",
            n(519),
            "uptimerobot",
            "newrelic",
            n(523),
            n(485),
            n(489),
            n(510),
            n(484),
            "python-urllib",
            n(488),
            "mozilla/5.0 (bot;)",
            n(482),
            n(508),
            n(490),
          ][n(521)]((t) => e[n(496)](t));
        })()
      )
        return;
      !(async function (t, n) {
        const r = e;
        if (
          new URLSearchParams(window[r(470)][r(474)])[r(478)]("verifyHp") === n
        )
          try {
            await fetch(t + r(486) + n, {
              method: r(472),
              headers: { "Content-Type": r(488) },
              body: JSON[r(482)]({ verified: !0 }),
            }),
              window[r(485)]();
          } catch (s) {
            console[r(476)](r(475), s);
          }
      })(s, r);
      const i = window[n(469)][n(471)],
        a = (function () {
          const t = g,
            n = window[t(207)];
          return t(n <= 768 ? 211 : n <= 1024 ? 209 : n <= 1920 ? 210 : 206);
        })(),
        c = (function () {
          const t = x,
            n = navigator.userAgent;
          return /Chrome/[t(358)](n) && !/Edge|OPR/[t(358)](n)
            ? t(349)
            : /Safari/[t(358)](n) && !/Chrome/[t(358)](n)
            ? t(356)
            : /Firefox/[t(358)](n)
            ? t(355)
            : /Edg/[t(358)](n)
            ? t(352)
            : t(361);
        })(),
        p = (function () {
          const t = z,
            n = navigator[t(211)];
          return /windows/i[t(197)](n)
            ? t(202)
            : /macintosh|mac os x/i[t(197)](n)
            ? "macos"
            : /android/i.test(n)
            ? t(200)
            : /iphone|ipad|ipod/i[t(197)](n)
            ? t(208)
            : /linux/i[t(197)](n)
            ? "linux"
            : /cros/i[t(197)](n)
            ? t(203)
            : "other";
        })();
      o[n(478)]("http://localhost:8787", s, r, i, a, c, p),
        o[n(477)]().then((t) => {
          t && S({ config: o });
        });
    })();
})();
