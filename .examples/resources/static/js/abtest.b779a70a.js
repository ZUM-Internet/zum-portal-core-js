!function (t) {
  function e (e) {
    for (var n, i, o = e[0], l = e[1], u = e[2], f = 0, p = []; f < o.length; f++) i = o[f], Object.prototype.hasOwnProperty.call(a, i) && a[i] && p.push(a[i][0]), a[i] = 0;
    for (n in l) Object.prototype.hasOwnProperty.call(l, n) && (t[n] = l[n]);
    for (c && c(e); p.length;) p.shift()();
    return s.push.apply(s, u || []), r()
  }

  function r () {
    for (var t, e = 0; e < s.length; e++) {
      for (var r = s[e], n = !0, o = 1; o < r.length; o++) {
        var l = r[o];
        0 !== a[l] && (n = !1)
      }
      n && (s.splice(e--, 1), t = i(i.s = r[0]))
    }
    return t
  }

  var n = {}, a = {abtest: 0}, s = [];

  function i (e) {
    if (n[e]) return n[e].exports;
    var r = n[e] = {i: e, l: !1, exports: {}};
    return t[e].call(r.exports, r, r.exports, i), r.l = !0, r.exports
  }

  i.m = t, i.c = n, i.d = function (t, e, r) {
    i.o(t, e) || Object.defineProperty(t, e, {enumerable: !0, get: r})
  }, i.r = function (t) {
    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {value: "Module"}), Object.defineProperty(t, "__esModule", {value: !0})
  }, i.t = function (t, e) {
    if (1 & e && (t = i(t)), 8 & e) return t;
    if (4 & e && "object" == typeof t && t && t.__esModule) return t;
    var r = Object.create(null);
    if (i.r(r), Object.defineProperty(r, "default", {
      enumerable: !0,
      value: t
    }), 2 & e && "string" != typeof t) for (var n in t) i.d(r, n, function (e) {
      return t[e]
    }.bind(null, n));
    return r
  }, i.n = function (t) {
    var e = t && t.__esModule ? function () {
      return t.default
    } : function () {
      return t
    };
    return i.d(e, "a", e), e
  }, i.o = function (t, e) {
    return Object.prototype.hasOwnProperty.call(t, e)
  }, i.p = "/";
  var o = window.zumPortalJsonp = window.zumPortalJsonp || [], l = o.push.bind(o);
  o.push = e, o = o.slice();
  for (var u = 0; u < o.length; u++) e(o[u]);
  var c = l;
  s.push([0, "chunk-vendors"]), r()
}({
  0: function (t, e, r) {
    t.exports = r("d212")
  }, "18bd": function (t, e, r) {
    "use strict";
    var n = {
      name: "ABTest",
      props: {selectedVariant: {type: String, required: !0}, variants: {type: Array, required: !0}}
    }, a = r("2877"), s = Object(a.a)(n, (function () {
      var t = this.$createElement;
      return (this._self._c || t)("div", [this._t(this.selectedVariant)], 2)
    }), [], !1, null, null, null);
    e.a = s.exports
  }, "8fb8": function (t, e, r) {
    "use strict";
    var n = r("a78e"), a = r.n(n);
    e.a = Object.freeze({get: t => (a.a.getJSON("_ABTEST_VARIANT") || {})[t] || null})
  }, d212: function (t, e, r) {
    "use strict";
    r.r(e);
    var n = r("2b0e"), a = r("f83c").a, s = r("2877"), i = Object(s.a)(a, (function () {
      var t = this, e = t.$createElement, r = t._self._c || e;
      return r("div", {attrs: {id: "app"}}, [r("ABTest", {
        attrs: {
          selectedVariant: t.selectedVariant,
          variants: t.variants
        }
      }, [r("div", {
        attrs: {slot: t.variants[0]},
        slot: t.variants[0]
      }, [t._v("A 렌더링")]), r("div", {
        attrs: {slot: t.variants[1]},
        slot: t.variants[1]
      }, [t._v("B 렌더링")]), r("div", {
        attrs: {slot: t.variants[2]},
        slot: t.variants[2]
      }, [t._v("C 렌더링")]), r("div", {attrs: {slot: t.variants[3]}, slot: t.variants[3]}, [t._v("D 렌더링")])])], 1)
    }), [], !1, null, null, null).exports;
    new n.a({el: "#app", render: t => t(i)})
  }, f83c: function (t, e, r) {
    "use strict";
    (function (t) {
      var n = r("18bd"), a = r("8fb8");
      e.a = {
        name: "App",
        components: {ABTest: n.a},
        data: () => ({selectedVariant: "A", variants: ["A", "B", "C", "D"]}),
        mounted () {
          const e = a.a.get("example");
          null === e ? t.get("/api/abtest").then(() => {
            this.selectedVariant = a.a.get("example") || "A"
          }) : this.selectedVariant = e
        }
      }
    }).call(this, r("fc8e"))
  }
});