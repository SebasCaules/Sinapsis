/* ============================================================
   figuras/u5.js — figuras de la unidad 5 (función de variable aleatoria,
   vectores aleatorios bidimensionales, covarianza y correlación,
   independencia, esperanza y varianza condicional, mezclas).

   Se carga DESPUÉS de figures.js (necesita App.registerFigure y App.Fig)
   y de lib-math.js (window.M). Cada figura se registra con su id
   definitivo 'u5-…' y se monta desde el markdown del wiki con el bloque
   '> [!figura] <id>'.

   Figuras registradas aquí
     u5-la-preimagen-de-g-x-y-sobre-la-curva-de-g   {g(X)≤y} traducido a un evento sobre X
     u5-de-una-uniforme-a-cualquier-distribucion    transformada inversa (continua y discreta)
     u5-del-arbol-a-la-tabla-conjunta               árbol → tabla 2×2 con marginales (estática)
     u5-traducir-p-g-x-y-c-a-una-region-del-plano   {V ≤ v₀} sobre el soporte triangular
     u5-cortes-del-soporte-triangular-0-r-h-10      cortes horizontal y vertical del triángulo
     u5-la-marginal-como-sombra-de-la-conjunta      superficie 3D y su sombra marginal
     u5-que-mide-y-que-no-mide                      ρ, los cuatro cuadrantes y el contraejemplo
     u5-soporte-rectangular-contra-soporte-no-rectangula  el test visual de independencia
     u5-varianza-intra-mas-varianza-entre           ley de varianza total, geométricamente
     u5-la-mezcla-como-superposicion-ponderada      combinación convexa y sobredispersión

   Lenguaje visual común de la unidad (las cuatro figuras que caen en la
   misma página deben leerse como una serie)
     · soporte / conjunta / función principal → --primary
     · recta o plano de corte, valor móvil     → --accent
     · región resaltada, preimagen, tramo 1    → --good
     · segunda serie, tramo 2, cortes en r     → --u5
     · error conceptual, punto fuera del soporte → --bad
   Los colores se leen SIEMPRE en tiempo de dibujo (F.color): el remonte por
   cambio de tema los renueva sin tocar el estado de los deslizadores.
   ============================================================ */
(function () {
  "use strict";

  var A = window.App;
  if (!A || !A.registerFigure) return;
  var M = window.M || {};

  // ---- utilidades locales ------------------------------------------------

  var uidc = 0;
  function uniqueId(p) { return p + "-" + (++uidc); }
  function clearNode(n) { while (n && n.firstChild) n.removeChild(n.firstChild); }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  function normCDF(x) { return M.normCDF ? M.normCDF(x, 0, 1) : 0; }
  function normPDF(x) { return M.normPDF ? M.normPDF(x, 0, 1) : 0; }

  // Máximo de una función muestreada (para fijar el alto del eje).
  function maxOf(fn, a, b, n) {
    var m = 0, i, v;
    n = n || 200;
    for (i = 0; i <= n; i++) {
      v = fn(a + (b - a) * i / n);
      if (isFinite(v) && v > m) m = v;
    }
    return m;
  }

  // Barra horizontal por segmentos apilados, con rótulo y valor a la derecha.
  function stackBar(F, layer, o) {
    var x = o.x, y = o.y, h = o.h, len = o.len;
    F.el("rect", {
      x: x, y: y, width: len, height: h, rx: 3,
      fill: F.color("surface-2"), stroke: F.color("border-2"), "stroke-width": 1
    }, layer);
    var cur = x;
    (o.parts || []).forEach(function (p) {
      var w = clamp(p.v / o.scale, 0, 1) * len;
      if (w > 0.4) {
        F.el("rect", {
          x: cur, y: y, width: w, height: h, rx: 2.5,
          fill: p.fill
        }, layer);
      }
      cur += w;
    });
    T(F, layer, x, y - 5, o.label, { size: 11.5, fill: o.labelFill || F.color("text-2") });
    T(F, layer, x + len + 9, y + h / 2, o.value, {
      size: 11.5, baseline: "middle", mono: true, fill: o.valueFill || F.color("text-2")
    });
  }

  // Punta de flecha reutilizable (F.graph la crea internamente pero no la expone).
  function arrow(F, svg, layer, pts, o) {
    o = o || {};
    var id = uniqueId("u5a");
    var m = F.el("marker", {
      id: id, viewBox: "0 0 10 10", refX: 9, refY: 5,
      markerWidth: 6, markerHeight: 6, orient: "auto-start-reverse"
    }, F.defs(svg));
    F.el("path", { d: "M0 0 L10 5 L0 10 z", fill: o.stroke || F.color("text-3") }, m);
    var p = F.path(layer, o.d || F.ptsToPath(pts), {
      stroke: o.stroke || F.color("text-3"),
      width: o.width == null ? 1.3 : o.width,
      dash: o.dash, cls: "fig-ref"
    });
    p.setAttribute("marker-end", "url(#" + id + ")");
    return p;
  }

  // Rótulo con halo del color del fondo de la figura (--surface-2, el fondo de
  // .doc-figure). Se usa donde el texto cae inevitablemente sobre una curva o
  // sobre la superficie 3D: el color solo no alcanza para separarlo del fondo.
  // El halo se pinta DEBAJO del relleno (paint-order), así que no engorda la letra.
  function haloText(F, layer, x, y, str, o) {
    o = o || {};
    var t = T(F, layer, x, y, str, o);
    t.style.paintOrder = "stroke fill";
    t.style.stroke = F.color("surface-2");
    t.style.strokeWidth = (o.halo == null ? 3 : o.halo) + "px";
    t.style.strokeLinejoin = "round";
    return t;
  }

  // Recorte rectangular reutilizable. Se crea UNA vez por montaje (fuera de
  // redraw), porque cada llamada agrega un nodo a <defs>.
  function clipRect(F, svg, x, y, w, h) {
    var id = uniqueId("u5c");
    var cp = F.el("clipPath", { id: id, clipPathUnits: "userSpaceOnUse" }, F.defs(svg));
    F.el("rect", { x: x, y: y, width: w, height: h }, cp);
    return "url(#" + id + ")";
  }

  // Rótulo de figura. El texto va SIEMPRE en un token de texto; cuando la
  // llamada pide el color de una serie, ese color pasa a un punto de 6 px
  // delante del rótulo (la clave de color del contrato de figures.js).
  var TOKENS_TEXTO = ["text", "text-2", "text-3", "plot-axis", "plot-grid", "math-ink"];
  function T(F, layer, x, y, str, o) {
    o = o || {};
    var i, esTexto = !o.fill;
    for (i = 0; i < TOKENS_TEXTO.length && !esTexto; i++) {
      if (F.color(TOKENS_TEXTO[i]) === o.fill) esTexto = true;
    }
    if (esTexto) return F.text(layer, x, y, str, o);
    var t = F.label(layer, x, y, str, {
      size: o.size, anchor: o.anchor, mono: o.mono, weight: o.weight,
      baseline: o.baseline, fill: F.color("text-2"), keyColor: o.fill
    });
    if (o.opacity != null) t.style.opacity = o.opacity;
    return t;
  }

  function reg(id, draw, meta) { A.registerFigure(id, draw, meta); }

  // ==========================================================================
  //  F1 · u5-la-preimagen-de-g-x-y-sobre-la-curva-de-g
  //  El evento {g(X) ≤ y} reescrito como un evento sobre X.
  // ==========================================================================
  reg("u5-la-preimagen-de-g-x-y-sobre-la-curva-de-g", function (host, api) {
    var F = api.Fig;
    var W = 680;
    var P = F.panels(host, 2, { w: W, heights: [206, 172], gap: 4 });
    var svgA = P[0], svgB = P[1];
    var padL = 58, padR = 22;
    var X0 = -3.6, X1 = 3.6;

    var GS = {
      sq: { g: function (x) { return x * x; }, lo: -1, hi: 6, name: "g(x) = x²" },
      linp: { g: function (x) { return 2 * x + 1; }, lo: -6.5, hi: 8.5, name: "g(x) = 2x + 1" },
      linm: { g: function (x) { return 3 - x; }, lo: -0.8, hi: 6.8, name: "g(x) = −x + 3" }
    };
    var curG = "sq";
    function yOf(t) { var s = GS[curG]; return s.lo + t * (s.hi - s.lo); }

    // Preimagen exacta {x : g(x) ≤ y}, como lista de intervalos (puede ser vacía).
    function preimage(gk, y) {
      if (gk === "sq") {
        if (y < 0) return [];
        var s = Math.sqrt(y);
        return [[-s, s]];
      }
      if (gk === "linp") return [[-Infinity, (y - 1) / 2]];
      return [[3 - y, Infinity]];
    }
    // F_Y(y) = P(g(X) ≤ y) con X ~ N(0,1): valor exacto, no el área dibujada.
    function FY(gk, y) {
      if (gk === "sq") {
        if (y < 0) return 0;
        var s = Math.sqrt(y);
        return normCDF(s) - normCDF(-s);
      }
      if (gk === "linp") return normCDF((y - 1) / 2);
      return 1 - normCDF(3 - y);
    }
    function setDesc(gk, y) {
      if (gk === "sq") {
        if (y < 0) return "∅  (ningún x cumple x² ≤ y)";
        return "[−√y, √y] = [" + F.fmt(-Math.sqrt(y), 2) + ", " + F.fmt(Math.sqrt(y), 2) + "]";
      }
      if (gk === "linp") return "(−∞, (y−1)/2] = (−∞, " + F.fmt((y - 1) / 2, 2) + "]";
      return "[3−y, +∞) = [" + F.fmt(3 - y, 2) + ", +∞)";
    }

    var ctl;
    var sel = F.select(host, {
      k: "g", label: "función g",
      options: [
        { v: "sq", label: "g(x) = x²  (no inyectiva)" },
        { v: "linp", label: "g(x) = 2x + 1  (creciente)" },
        { v: "linm", label: "g(x) = −x + 3  (decreciente)" }
      ],
      value: "sq"
    }, function (k, v) {
      curG = v;
      ctl.set("t", ctl.get("t"));   // refresca el rótulo con la escala del nuevo g
      redraw();
    });
    curG = sel.get() || "sq";

    ctl = F.controls(host, [{
      k: "t", label: "altura del corte", min: 0, max: 1, step: 0.005, value: 0.4,
      fmt: function (t) { return "y = " + F.fmt(yOf(t), 2); }
    }], function () { redraw(); });
    ctl.set("t", ctl.get("t"));   // primer rótulo, ya con la escala de g

    var out = F.readouts(host, [
      { k: "fy", tex: "F_Y(y) = \\P(g(X) \\le y)" },
      { k: "set", tex: "\\{x : g(x) \\le y\\}" },
      { k: "y", label: "altura y" }
    ]);

    F.legend(host, [
      { label: "curva y = g(x)", color: F.series(1) },
      { label: "recta horizontal en la altura y", color: F.series(2), dash: true },
      { label: "preimagen {x : g(x) ≤ y}", color: F.series(3), fill: true },
      { label: "densidad fₓ (normal estándar)", color: F.series(4) }
    ]);

    var layA = F.el("g", null, svgA);
    var layB = F.el("g", null, svgB);
    // la parábola se sale del rango visible: hay que recortarla al panel
    var clipA = clipRect(F, svgA, padL, 12, W - padR - padL, 156);

    function redraw() {
      clearNode(layA); clearNode(layB);
      var spec = GS[curG];
      var t = ctl.get("t");
      var y = yOf(t);
      var iv = preimage(curG, y);
      var cPri = F.series(1), cAcc = F.series(2),
        cGood = F.series(3), cU5 = F.series(4), cTxt = F.color("text-3");

      // ---- panel superior: la curva de g y la recta y --------------------
      var hA = 206;
      var sxA = F.scale([X0, X1], [padL, W - padR]);
      var syA = F.scale([spec.lo, spec.hi], [hA - 44, 18]);
      F.axes(layA, {
        sx: sxA, sy: syA, xTicks: 7, yTicks: 5, grid: true,
        xLabel: "x", yLabel: "g(x)"
      });

      // franja de la preimagen sobre el eje x (dentro del panel de g)
      var baseA = syA(clamp(0, spec.lo, spec.hi));
      iv.forEach(function (I) {
        var a = clamp(I[0], X0, X1), b = clamp(I[1], X0, X1);
        if (!(b > a)) return;
        F.el("rect", {
          x: sxA(a), y: syA(spec.hi), width: sxA(b) - sxA(a), height: syA(spec.lo) - syA(spec.hi),
          fill: cGood, opacity: 0.11
        }, layA);
        F.el("rect", {
          x: sxA(a), y: baseA - 2.5, width: sxA(b) - sxA(a), height: 5, rx: 2.5,
          fill: cGood
        }, layA);
      });

      F.hline(layA, syA(clamp(y, spec.lo, spec.hi)), {
        x0: padL, x1: W - padR, stroke: cAcc, width: 1.8, dash: "6 4"
      });
      T(F, layA, W - padR - 4, syA(clamp(y, spec.lo, spec.hi)) - 6, "y = " + F.fmt(y, 2), {
        size: 11.5, anchor: "end", mono: true, fill: cAcc
      });

      var gCurve = F.el("g", { "clip-path": clipA }, layA);
      F.curve(gCurve, spec.g, sxA, syA, { stroke: cPri, width: 2, n: 300 });
      T(F, layA, W - padR - 4, 30, spec.name, { size: 12.5, anchor: "end", fill: cPri, weight: 600 });

      // marcas de los extremos de la preimagen
      iv.forEach(function (I) {
        [I[0], I[1]].forEach(function (e) {
          if (!isFinite(e) || e < X0 || e > X1) return;
          F.vline(layA, sxA(e), { y0: syA(spec.hi), y1: baseA, stroke: cGood, width: 1.2, dash: "3 3" });
          F.marker(layA, sxA(e), baseA, { r: 4.6, fill: cGood });
          T(F, layA, sxA(e), baseA + 15, F.fmt(e, 2), {
            size: 11, anchor: "middle", mono: true, fill: cGood
          });
        });
      });

      // ---- panel inferior: la densidad de X, con la misma región --------
      var hB = 172;
      var sxB = F.scale([X0, X1], [padL, W - padR]);
      var syB = F.scale([0, 0.53], [hB - 46, 16]);
      F.axes(layB, {
        sx: sxB, sy: syB, xTicks: 7, yTicks: 4, grid: true,
        xLabel: "x", yLabel: "densidad de X", y0: 0
      });
      iv.forEach(function (I) {
        var a = clamp(I[0], X0, X1), b = clamp(I[1], X0, X1);
        if (!(b > a)) return;
        F.area(layB, normPDF, sxB, syB, {
          from: a, to: b, fill: cGood, opacity: 0.12, hatch: { angle: 45, size: 10, width: 2 }
        });
      });
      F.curve(layB, normPDF, sxB, syB, { stroke: cU5, width: 2, n: 260 });
      iv.forEach(function (I) {
        [I[0], I[1]].forEach(function (e) {
          if (!isFinite(e) || e < X0 || e > X1) return;
          F.vline(layB, sxB(e), { y0: syB(0), y1: 16, stroke: cGood, width: 1.2, dash: "3 3" });
        });
      });
      var fy = FY(curG, y);
      T(F, layB, padL + 8, 26, "P(g(X) ≤ y) = " + F.fmt(fy, 4), {
        size: 12, fill: cGood, weight: 600
      });
      T(F, layB, W - padR - 4, 26, "el mismo eje x que arriba", {
        size: 11, anchor: "end", fill: cTxt
      });

      out.set("fy", F.fmt(fy, 4));
      out.set("set", setDesc(curG, y));
      out.set("y", F.fmt(y, 3));
    }

    redraw();
  }, { title: "La preimagen de {g(X) ≤ y} sobre la curva de g", unidad: "5", page: "funcion-de-variable-aleatoria", kind: "interactive" });

  // ==========================================================================
  //  F2 · u5-de-una-uniforme-a-cualquier-distribucion
  //  Transformada inversa: u → F⁻(u), continua y discreta.
  // ==========================================================================
  reg("u5-de-una-uniforme-a-cualquier-distribucion", function (host, api) {
    var F = api.Fig;
    var W = 680;
    var P = F.panels(host, 2, { w: W, heights: [214, 182], gap: 4 });
    var svgA = P[0], svgB = P[1];
    var padL = 58, padR = 22;

    var DIST = {
      exp: {
        cont: true, x0: 0, x1: 12, name: "Exp(0.5)", mean: 2,
        cdf: function (x) { return x <= 0 ? 0 : 1 - Math.exp(-0.5 * x); },
        pdf: function (x) { return x < 0 ? 0 : 0.5 * Math.exp(-0.5 * x); },
        inv: function (u) { return -2 * Math.log(1 - u); }
      },
      ber: {
        cont: false, x0: -0.7, x1: 1.9, name: "Bernoulli(0.6)", mean: 0.6,
        sup: [0, 1],
        pmf: function (k) { return k === 0 ? 0.4 : (k === 1 ? 0.6 : 0); },
        inv: function (u) { return u < 0.4 ? 0 : 1; }
      },
      hip: {
        cont: false, x0: -0.7, x1: 2.9, name: "Hipergeométrica H(10, 4, 2)", mean: 0.8,
        sup: [0, 1, 2],
        pmf: function (k) { return M.hyperPMF ? M.hyperPMF(k, 10, 4, 2) : 0; },
        inv: function (u) {
          var acc = 0, k;
          for (k = 0; k <= 2; k++) { acc += M.hyperPMF(k, 10, 4, 2); if (u <= acc) return k; }
          return 2;
        }
      }
    };
    function cdfOf(d, x) {
      if (d.cont) return d.cdf(x);
      var acc = 0, i;
      for (i = 0; i < d.sup.length; i++) if (d.sup[i] <= x) acc += d.pmf(d.sup[i]);
      return acc;
    }

    var curD = "exp";
    var st = api.state;
    if (!st.muestras || st.dist !== curD) { st.muestras = []; st.dist = curD; }

    var ctl;
    var sel = F.select(host, {
      k: "dist", label: "distribución objetivo",
      options: [
        { v: "exp", label: "Exp(0.5) — continua" },
        { v: "ber", label: "Bernoulli(0.6) — discreta" },
        { v: "hip", label: "H(10, 4, 2) — discreta" }
      ],
      value: "exp"
    }, function (k, v) {
      curD = v; st.dist = v; st.muestras = []; redraw();
    });
    curD = sel.get() || "exp";
    if (st.dist !== curD) { st.dist = curD; st.muestras = []; }

    ctl = F.controls(host, [
      { k: "u", label: "u sorteado en (0,1)", min: 0.01, max: 0.99, step: 0.005, value: 0.62, dec: 3 }
    ], function () { redraw(); });

    F.buttons(host, [
      {
        label: "Sortear 100", title: "acumula 100 valores más en el histograma",
        onClick: function () {
          var r = F.rng(4321 + st.muestras.length);
          var d = DIST[curD], i;
          for (i = 0; i < 100; i++) st.muestras.push(d.inv(clamp(r(), 1e-9, 1 - 1e-9)));
          redraw();
        }
      },
      { label: "Vaciar", onClick: function () { st.muestras = []; redraw(); } }
    ]);

    var out = F.readouts(host, [
      { k: "q", tex: "F_X^{\\leftarrow}(u)" },
      { k: "n", label: "muestras acumuladas" },
      { k: "mx", tex: "\\bar{x}" },
      { k: "mt", tex: "\\E[X]" }
    ]);

    F.legend(host, [
      { label: "FDA Fₓ", color: F.series(1) },
      { label: "proyección u → F⁻(u)", color: F.series(2) },
      { label: "muestras acumuladas", color: F.series(3), fill: true },
      { label: "densidad o masa teórica", color: F.series(4) }
    ]);

    var layA = F.el("g", null, svgA);
    var layB = F.el("g", null, svgB);

    function redraw() {
      clearNode(layA); clearNode(layB);
      var d = DIST[curD];
      var u = ctl.get("u");
      var q = d.inv(u);
      var cPri = F.series(1), cAcc = F.series(2),
        cGood = F.series(3), cU5 = F.series(4), cTxt = F.color("text-3");

      // ---- panel superior: la FDA y la proyección -----------------------
      var hA = 214;
      var sxA = F.scale([d.x0, d.x1], [padL, W - padR]);
      var syA = F.scale([0, 1.06], [hA - 44, 18]);
      F.axes(layA, {
        sx: sxA, sy: syA, xTicks: 6, yTicks: 5, grid: true,
        xLabel: "x", yLabel: "FDA de X", y0: 0
      });

      if (d.cont) {
        F.curve(layA, d.cdf, sxA, syA, { stroke: cPri, width: 2, n: 260 });
      } else {
        // escalones: tramo horizontal + salto punteado, con punto lleno a la izquierda
        var prev = 0, i;
        F.line(layA, [[sxA(d.x0), syA(0)], [sxA(d.sup[0]), syA(0)]], { stroke: cPri, width: 2 });
        for (i = 0; i < d.sup.length; i++) {
          var k = d.sup[i];
          var acc = prev + d.pmf(k);
          var xEnd = i + 1 < d.sup.length ? d.sup[i + 1] : d.x1;
          F.line(layA, [[sxA(k), syA(acc)], [sxA(xEnd), syA(acc)]], { stroke: cPri, width: 2 });
          F.line(layA, [[sxA(k), syA(prev)], [sxA(k), syA(acc)]], {
            stroke: cPri, width: 1.2, dash: "3 3", cls: "fig-ref"
          });
          F.marker(layA, sxA(k), syA(acc), { r: 4.6, fill: cPri });
          prev = acc;
        }
      }

      // proyección: horizontal desde el eje hasta la curva, y caída al eje x
      F.line(layA, [[padL, syA(u)], [sxA(q), syA(u)]], { stroke: cAcc, width: 1.8, dash: "5 4", cls: "fig-ref" });
      arrow(F, svgA, layA, [[sxA(q), syA(u)], [sxA(q), syA(0)]], { stroke: cAcc, width: 1.8 });
      F.marker(layA, sxA(q), syA(0), { r: 4.6, fill: cAcc });
      // Con u muy chico la horizontal punteada casi toca el eje x y este rótulo
      // se metía en la franja donde ahora va el de F⁻(u): se lo frena 30 px
      // arriba del eje (la línea punteada queda justo debajo, sigue leyéndose).
      T(F, layA, padL + 6, Math.min(syA(u) - 6, syA(0) - 30), "u = " + F.fmt(u, 3),
        { size: 11.5, mono: true, fill: cAcc });
      // El rótulo va ARRIBA del eje y corrido a un costado de la flecha: la
      // fila de abajo es la de las marcas del eje, y centrado ahí tapaba justo
      // la marca que cae en F⁻(u) (visible en los modos discretos, donde el
      // cuantil aterriza siempre sobre una marca entera). Halo porque en la
      // exponencial, con u chico, la curva de la FDA pasa por detrás.
      var qx = sxA(q), qDer = qx + 108 < W - padR;
      haloText(F, layA, qx + (qDer ? 9 : -9), syA(0) - 9, "F⁻(u) = " + F.fmt(q, 3), {
        size: 11.5, anchor: qDer ? "start" : "end", mono: true, fill: cAcc
      });
      if (!d.cont) {
        // La nota va por encima del marco: dentro del panel, a la derecha, la
        // única banda libre es la del escalón F = 1, que la tachaba por el medio.
        T(F, layA, W - padR - 4, 12,
          "un tramo entero de u → un único x", {
            size: 10.5, anchor: "end", fill: cTxt
          });
      }
      T(F, layA, padL + 6, 30, d.name, { size: 12.5, fill: cPri, weight: 600 });

      // ---- panel inferior: histograma acumulado -------------------------
      var hB = 182;
      var xs = st.muestras;
      var n = xs.length;
      var sxB = F.scale([d.x0, d.x1], [padL, W - padR]);
      var yTop, i2;

      if (d.cont) {
        var nb = 24, bw = (d.x1 - d.x0) / nb;
        var cnt = [], b;
        for (b = 0; b < nb; b++) cnt.push(0);
        for (i2 = 0; i2 < n; i2++) {
          b = Math.floor((xs[i2] - d.x0) / bw);
          if (b >= 0 && b < nb) cnt[b]++;
        }
        var dens = cnt.map(function (c) { return n ? c / (n * bw) : 0; });
        yTop = Math.max(d.pdf(d.x0 + 1e-9), Math.max.apply(null, dens.concat([0]))) * 1.18;
        var syB = F.scale([0, yTop], [hB - 46, 16]);
        F.axes(layB, {
          sx: sxB, sy: syB, xTicks: 6, yTicks: 4, grid: true,
          xLabel: "x", yLabel: "densidad", y0: 0
        });
        for (b = 0; b < nb; b++) {
          if (!dens[b]) continue;
          F.el("rect", {
            x: sxB(d.x0 + b * bw) + 0.5, y: syB(dens[b]),
            width: Math.max(1, sxB(d.x0 + bw) - sxB(d.x0) - 1),
            height: syB(0) - syB(dens[b]),
            fill: cGood
          }, layB);
        }
        F.curve(layB, d.pdf, sxB, syB, { stroke: cU5, width: 2, n: 240, from: 0, to: d.x1 });
      } else {
        var freq = d.sup.map(function (k) {
          var c = 0, j;
          for (j = 0; j < n; j++) if (xs[j] === k) c++;
          return n ? c / n : 0;
        });
        yTop = Math.max(
          Math.max.apply(null, d.sup.map(function (k) { return d.pmf(k); })),
          Math.max.apply(null, freq.concat([0]))
        ) * 1.25;
        var syB2 = F.scale([0, yTop], [hB - 46, 16]);
        F.axes(layB, {
          sx: sxB, sy: syB2, xTicks: d.sup, yTicks: 4, grid: true,
          xLabel: "x", yLabel: "frecuencia", y0: 0
        });
        d.sup.forEach(function (k, i3) {
          var xc = sxB(k), bw2 = 24;
          if (freq[i3] > 0) {
            F.el("rect", {
              x: xc - bw2 / 2, y: syB2(freq[i3]), width: bw2,
              height: syB2(0) - syB2(freq[i3]), rx: 2, fill: cGood
            }, layB);
          }
          var pm = d.pmf(k);
          F.line(layB, [[xc - bw2 / 2 - 6, syB2(pm)], [xc + bw2 / 2 + 6, syB2(pm)]], {
            stroke: cU5, width: 2
          });
          T(F, layB, xc, syB2(pm) - 8, F.fmt(pm, 3), {
            size: 11, anchor: "middle", mono: true, fill: cU5
          });
        });
      }
      T(F, layB, W - padR - 4, 28, n ? (n + " muestras acumuladas") : "sin muestras todavía", {
        size: 11.5, anchor: "end", fill: cTxt
      });

      var mx = n ? xs.reduce(function (a2, b2) { return a2 + b2; }, 0) / n : null;
      out.set("q", F.fmt(q, 4));
      out.set("n", String(n));
      out.set("mx", mx == null ? "—" : F.fmt(mx, 4));
      out.set("mt", F.fmt(d.mean, 4));
    }

    redraw();
  }, { title: "De una uniforme a cualquier distribución", unidad: "5", page: "funcion-de-variable-aleatoria", kind: "interactive" });

  // ==========================================================================
  //  F3 · u5-del-arbol-a-la-tabla-conjunta  (estática)
  // ==========================================================================
  reg("u5-del-arbol-a-la-tabla-conjunta", function (host, api) {
    var F = api.Fig;
    var W = 700, H = 342;
    var svg = F.svg(host, { w: W, h: H, title: "Del árbol del experimento a la tabla conjunta con marginales" });
    var lay = F.el("g", null, svg);

    var cPri = F.series(1), cAcc = F.series(2), cU5 = F.series(4),
      cBad = F.series(5), cTxt = F.color("text-2"), cTxt3 = F.color("text-3"),
      cBor = F.color("border-2"), cSurf = F.color("surface-2");

    // ---- árbol ------------------------------------------------------------
    T(F, lay, 34, 26, "árbol del experimento", { size: 12.5, fill: cTxt, weight: 600 });
    var root = { x: 44, y: 168 };
    var nodes = [
      { x: 128, y: 104, lab: "X = 0", p: "1/2" },
      { x: 128, y: 232, lab: "X = 1", p: "1/2" }
    ];
    var leaves = [
      { x: 226, y: 70, from: 0, lab: "Y = 0", p: "1/5", j: 0.1, cell: [0, 0] },
      { x: 226, y: 130, from: 0, lab: "Y = 1", p: "4/5", j: 0.4, cell: [0, 1] },
      { x: 226, y: 200, from: 1, lab: "Y = 0", p: "3/5", j: 0.3, cell: [1, 0] },
      { x: 226, y: 264, from: 1, lab: "Y = 1", p: "2/5", j: 0.2, cell: [1, 1] }
    ];

    F.marker(lay, root.x, root.y, { r: 5, fill: cPri });
    T(F, lay, root.x, root.y + 19, "urna", { size: 11, anchor: "middle", fill: cTxt3 });

    nodes.forEach(function (nd, i) {
      F.line(lay, [[root.x + 6, root.y], [nd.x - 6, nd.y]], { stroke: cPri, width: 2 });
      T(F, lay, (root.x + nd.x) / 2 - 4, (root.y + nd.y) / 2 + (i ? 14 : -8), nd.p, {
        size: 11, anchor: "middle", mono: true, fill: cTxt
      });
      F.marker(lay, nd.x, nd.y, { r: 4.6, fill: cPri });
      T(F, lay, nd.x - 10, nd.y, nd.lab, {
        size: 12, anchor: "end", baseline: "middle", fill: cTxt, weight: 600
      });
    });

    leaves.forEach(function (lf) {
      var nd = nodes[lf.from];
      F.line(lay, [[nd.x + 5, nd.y], [lf.x - 5, lf.y]], { stroke: cU5, width: 2 });
      T(F, lay, (nd.x + lf.x) / 2, (nd.y + lf.y) / 2 + (lf.y < nd.y ? -7 : 13), lf.p, {
        size: 11, anchor: "middle", mono: true, fill: cTxt
      });
      F.marker(lay, lf.x, lf.y, { r: 4.6, fill: cU5 });
      T(F, lay, lf.x + 9, lf.y, lf.lab, {
        size: 11.5, baseline: "middle", mono: true, fill: cTxt
      });
    });

    // ---- tabla conjunta ---------------------------------------------------
    var tx = 452, ty = 78, cw = 76, ch = 46;
    T(F, lay, tx - 56, 26, "tabla conjunta p", { size: 12.5, fill: cTxt, weight: 600 });
    T(F, lay, tx - 56, 44, "filas y columnas suman las marginales", {
      size: 11, fill: cTxt3
    });

    T(F, lay, tx + 0.5 * cw, ty - 12, "Y = 0", { size: 11.5, anchor: "middle", fill: cTxt3, mono: true });
    T(F, lay, tx + 1.5 * cw, ty - 12, "Y = 1", { size: 11.5, anchor: "middle", fill: cTxt3, mono: true });
    T(F, lay, tx + 2 * cw + (cw - 16) / 2, ty - 12, "marg. X", { size: 11.5, anchor: "middle", fill: cTxt3, mono: true });
    T(F, lay, tx - 8, ty + ch / 2, "X = 0", { size: 11.5, anchor: "end", baseline: "middle", fill: cTxt3, mono: true });
    T(F, lay, tx - 8, ty + 1.5 * ch, "X = 1", { size: 11.5, anchor: "end", baseline: "middle", fill: cTxt3, mono: true });
    T(F, lay, tx - 8, ty + 2 * ch + (ch - 12) / 2, "marg. Y", { size: 11.5, anchor: "end", baseline: "middle", fill: cTxt3, mono: true });

    var joint = [[0.1, 0.4], [0.3, 0.2]];
    var pX = [0.5, 0.5], pY = [0.4, 0.6];
    var cellXY = function (i, j) { return [tx + (j + 0.5) * cw, ty + (i + 0.5) * ch]; };

    var i, j;
    for (i = 0; i < 2; i++) {
      for (j = 0; j < 2; j++) {
        var hot = (i === 0 && j === 0);
        F.el("rect", {
          x: tx + j * cw, y: ty + i * ch, width: cw, height: ch, rx: 3,
          fill: hot ? cBad : cSurf, opacity: hot ? 0.16 : 1,
          stroke: hot ? cBad : cBor, "stroke-width": hot ? 1.8 : 1
        }, lay);
        T(F, lay, tx + (j + 0.5) * cw, ty + (i + 0.5) * ch, F.fmt(joint[i][j], 2), {
          size: 13, anchor: "middle", baseline: "middle", mono: true,
          fill: F.color("text"), weight: 600
        });
      }
    }
    for (i = 0; i < 2; i++) {
      F.el("rect", {
        x: tx + 2 * cw, y: ty + i * ch, width: cw - 16, height: ch, rx: 3,
        fill: cAcc, opacity: 0.13, stroke: cAcc, "stroke-width": 1
      }, lay);
      T(F, lay, tx + 2 * cw + (cw - 16) / 2, ty + (i + 0.5) * ch, F.fmt(pX[i], 2), {
        size: 12.5, anchor: "middle", baseline: "middle", mono: true, fill: F.color("text"), weight: 600
      });
    }
    for (j = 0; j < 2; j++) {
      F.el("rect", {
        x: tx + j * cw, y: ty + 2 * ch, width: cw, height: ch - 12, rx: 3,
        fill: cAcc, opacity: 0.13, stroke: cAcc, "stroke-width": 1
      }, lay);
      T(F, lay, tx + (j + 0.5) * cw, ty + 2 * ch + (ch - 12) / 2, F.fmt(pY[j], 2), {
        size: 12.5, anchor: "middle", baseline: "middle", mono: true, fill: F.color("text"), weight: 600
      });
    }

    // flechas del árbol a la celda correspondiente, rotuladas con el producto
    leaves.forEach(function (lf) {
      var c = cellXY(lf.cell[0], lf.cell[1]);
      var yc = c[1] + (lf.cell[1] === 0 ? -10 : 10);
      var x1 = lf.x + 56, y1 = lf.y, x2 = tx - 58;
      var mx = (x1 + x2) / 2;
      arrow(F, svg, lay, null, {
        d: "M" + x1 + " " + y1 + "Q" + mx + " " + ((y1 + yc) / 2) + " " + x2 + " " + yc,
        stroke: F.color("text-3"), width: 1, dash: "3 3"
      });
      T(F, lay, mx, (y1 + yc) / 2 + (y1 < yc ? -6 : 14), F.fmt(lf.j, 2), {
        size: 11.5, anchor: "middle", mono: true, fill: cTxt, weight: 600
      });
    });

    T(F, lay, 34, H - 34,
      "p(0,0) = 0.10  ≠  0.50 · 0.40 = 0.20", {
        size: 12, fill: cBad, weight: 600
      });
    T(F, lay, 34, H - 15,
      "X e Y no son independientes", { size: 11.5, fill: cTxt3 });

    F.legend(host, [
      { label: "ramas de X (moneda)", color: cPri },
      { label: "ramas de Y dado X", color: cU5 },
      { label: "marginales (sumas de fila y de columna)", color: cAcc, fill: true },
      { label: "celda que rompe la independencia", color: cBad }
    ]);
  }, { title: "Del árbol a la tabla conjunta", unidad: "5", page: "variables-aleatorias-bidimensionales", kind: "static" });

  // ==========================================================================
  //  F4 · u5-traducir-p-g-x-y-c-a-una-region-del-plano
  //  {V = πR²H ≤ v₀} sobre el soporte 0 < r < h < 10.
  // ==========================================================================
  reg("u5-traducir-p-g-x-y-c-a-una-region-del-plano", function (host, api) {
    var F = api.Fig;
    var W = 700, H = 384;
    var svg = F.svg(host, { w: W, h: H, title: "La región {V ≤ v₀} sobre el soporte triangular 0 < r < h < 10" });

    var ctl = F.controls(host, [
      { k: "v", label: "umbral v₀ / π", min: 5, max: 1200, value: 125, log: true, dec: 1 }
    ], function () { redraw(); });

    var out = F.readouts(host, [
      { k: "p", tex: "\\P(V \\le v_0)" },
      { k: "rq", tex: "r^{*} = \\sqrt{v_0/(10\\pi)}" },
      { k: "rc", tex: "r_c = (v_0/\\pi)^{1/3}" },
      { k: "ni", label: "integrales necesarias" }
    ]);

    F.legend(host, [
      { label: "soporte 0 < r < h < 10", color: F.series(1), fill: true },
      { label: "tramo 1: techo h = 10", color: F.series(3), fill: true },
      { label: "tramo 2: techo h = v₀/(π r²)", color: F.series(4), fill: true },
      { label: "curva de nivel V = v₀", color: F.series(2) }
    ]);

    var lay = F.el("g", null, svg);
    var K = 3 / 500;

    // P(V ≤ v₀) exacta, integrando f(r,h) = 3r/500 sobre la región.
    function prob(v0) {
      var rq = Math.min(10, Math.sqrt(v0 / (10 * Math.PI)));
      var rc = Math.min(10, Math.pow(v0 / Math.PI, 1 / 3));
      var p1 = K * (5 * rq * rq - rq * rq * rq / 3);
      var p2 = 0;
      if (rc > rq) {
        p2 = K * ((v0 / Math.PI) * Math.log(rc / rq) - (rc * rc * rc - rq * rq * rq) / 3);
      }
      return { p: clamp(p1 + p2, 0, 1), rq: rq, rc: rc, p1: p1, p2: p2 };
    }

    function redraw() {
      clearNode(lay);
      var v0 = ctl.get("v") * Math.PI;
      var R = prob(v0);
      var cPri = F.series(1), cAcc = F.series(2), cGood = F.series(3),
        cU5 = F.series(4), cTxt = F.color("text-2"), cTxt3 = F.color("text-3");

      var sx = F.scale([0, 10], [64, 452]);
      var sy = F.scale([0, 10], [326, 44]);
      F.axes(lay, {
        sx: sx, sy: sy, xTicks: 6, yTicks: 6, grid: true,
        xLabel: "radio r", yLabel: "altura h", y0: 0
      });

      // soporte completo
      F.line(lay, [[0, 0], [0, 10], [10, 10]], {
        sx: sx, sy: sy, close: true, fill: cPri, opacity: 0.11, stroke: cPri, width: 2
      });

      // tramo 1: 0 < r < r*, r < h < 10
      var rq = R.rq, rc = R.rc, pts, k, r;
      if (rq > 1e-4) {
        F.line(lay, [[0, 0], [0, 10], [rq, 10], [rq, rq]], {
          sx: sx, sy: sy, close: true, fill: cGood, opacity: 0.12
        });
      }
      // tramo 2: r* < r < r_c, r < h < v₀/(π r²)
      if (rc > rq + 1e-4) {
        pts = [];
        for (k = 0; k <= 40; k++) { r = rq + (rc - rq) * k / 40; pts.push([r, r]); }
        for (k = 40; k >= 0; k--) {
          r = rq + (rc - rq) * k / 40;
          pts.push([r, Math.min(10, v0 / (Math.PI * r * r))]);
        }
        F.line(lay, pts, {
          sx: sx, sy: sy, close: true, fill: cU5, opacity: 0.12, stroke: cU5, width: 2
        });
      }

      // curva de nivel V = v₀ (arranca justo donde entra por el techo h = 10)
      if (rq < 10) {
        F.curve(lay, function (rr) { return v0 / (Math.PI * rr * rr); }, sx, sy, {
          from: Math.max(rq, 0.02), to: 10, n: 220, stroke: cAcc, width: 2
        });
      }
      F.line(lay, [[0, 0], [10, 10]], { sx: sx, sy: sy, stroke: cPri, width: 1.5, dash: "5 4", cls: "fig-ref" });
      T(F, lay, sx(8.4), sy(8.0), "h = r", { size: 11, mono: true, fill: cPri });

      // marcas de r* y r_c (rótulos escalonados para que no se pisen)
      [[rq, "r* =", cGood, 18], [rc, "r crít. =", cU5, 32]].forEach(function (m) {
        if (!(m[0] > 0.02 && m[0] < 9.98)) return;
        F.vline(lay, sx(m[0]), { y0: sy(0), y1: sy(10), stroke: m[2], width: 1.3, dash: "4 3" });
        T(F, lay, sx(m[0]), m[3], m[1] + " " + F.fmt(m[0], 2), {
          size: 11, anchor: "middle", mono: true, fill: m[2]
        });
      });

      // rótulos de los límites de integración
      var bx = 476;
      T(F, lay, bx, 52, "límites de integración", { size: 12, fill: cTxt, weight: 600 });
      var partido = rc > rq + 1e-4 && rq > 1e-4;
      F.el("rect", { x: bx - 6, y: 66, width: 214, height: 62, rx: 4, fill: cGood, opacity: 0.14 }, lay);
      T(F, lay, bx, 84, "tramo 1", { size: 11.5, fill: cGood, weight: 600 });
      T(F, lay, bx, 102, "0 < r < " + F.fmt(rq, 2), { size: 11.5, mono: true, fill: cTxt });
      T(F, lay, bx, 119, "r < h < 10", { size: 11.5, mono: true, fill: cTxt });

      F.el("rect", { x: bx - 6, y: 142, width: 214, height: 62, rx: 4, fill: cU5, opacity: partido ? 0.14 : 0.05 }, lay);
      T(F, lay, bx, 160, "tramo 2", { size: 11.5, fill: cU5, weight: 600, opacity: partido ? 1 : 0.45 });
      if (partido) {
        T(F, lay, bx, 178, F.fmt(rq, 2) + " < r < " + F.fmt(rc, 2), { size: 11.5, mono: true, fill: cTxt });
        T(F, lay, bx, 195, "r < h < v₀/(π r²)", { size: 11.5, mono: true, fill: cTxt });
      } else {
        T(F, lay, bx, 182, "no hace falta: la curva", { size: 11, fill: cTxt3 });
        T(F, lay, bx, 197, "salió del triángulo", { size: 11, fill: cTxt3 });
      }

      T(F, lay, bx, 232, "v₀ = " + F.fmt(ctl.get("v"), 1) + " π  ≈  " + F.fmt(v0, 1), {
        size: 11.5, mono: true, fill: cAcc
      });
      T(F, lay, bx, 254, "P(V ≤ v₀) = " + F.fmt(R.p, 4), {
        size: 12.5, mono: true, fill: cTxt, weight: 600
      });
      T(F, lay, bx, 276, "= " + F.fmt(R.p1, 4) + " + " + F.fmt(R.p2, 4), {
        size: 11.5, mono: true, fill: cTxt3
      });
      T(F, lay, bx, 306, "V = π R² H", { size: 12, mono: true, fill: cTxt3 });
      T(F, lay, bx, 324, "f(r,h) = 3r/500", { size: 12, mono: true, fill: cTxt3 });

      out.set("p", F.fmt(R.p, 4));
      out.set("rq", F.fmt(rq, 4));
      out.set("rc", F.fmt(rc, 4));
      out.set("ni", partido ? "2 (la región se parte)" : "1 (una sola región)");
    }

    redraw();
  }, { title: "Traducir P(g(X,Y) ≤ c) a una región del plano", unidad: "5", page: "variables-aleatorias-bidimensionales", kind: "interactive" });

  // ==========================================================================
  //  F5 · u5-cortes-del-soporte-triangular-0-r-h-10
  // ==========================================================================
  reg("u5-cortes-del-soporte-triangular-0-r-h-10", function (host, api) {
    var F = api.Fig;
    var W = 700, H = 396;
    var svg = F.svg(host, { w: W, h: H, title: "Cortes horizontal y vertical del soporte triangular 0 < r < h < 10" });

    var ctl = F.controls(host, [
      { k: "h0", label: "corte horizontal h₀", min: 1, max: 10, step: 0.1, value: 6, dec: 2 },
      { k: "r0", label: "corte vertical r₀", min: 0.2, max: 9.5, step: 0.1, value: 3, dec: 2 }
    ], function () { redraw(); });
    var tg = F.toggle(host, {
      k: "marg", label: "mostrar marginales en vez de condicionales", value: false
    }, function () { redraw(); });

    var out = F.readouts(host, [
      { k: "er", tex: "\\E[R \\mid H = h_0] = 2h_0/3" },
      { k: "eh", tex: "\\E[H \\mid R = r_0]" },
      { k: "f52", tex: "f_{R,H}(5,2)" },
      { k: "pr", tex: "f_R(5)\\,f_H(2)" }
    ]);

    F.legend(host, [
      { label: "soporte 0 < r < h < 10", color: F.series(1), fill: true },
      { label: "corte horizontal h = h₀", color: F.series(2) },
      { label: "corte vertical r = r₀", color: F.series(4) },
      { label: "esperanza condicional", color: F.series(3), dash: true }
    ]);

    var lay = F.el("g", null, svg);
    var K = 3 / 500;

    function fRH(r, h) { return (r > 0 && r < h && h < 10) ? K * r : 0; }
    function fH(h) { return (h > 0 && h < 10) ? 3 * h * h / 1000 : 0; }
    function fR(r) { return (r > 0 && r < 10) ? K * r * (10 - r) : 0; }

    function redraw() {
      clearNode(lay);
      var h0 = ctl.get("h0"), r0 = ctl.get("r0");
      var marg = tg.get();
      var cPri = F.series(1), cAcc = F.series(2), cGood = F.series(3),
        cU5 = F.series(4), cBad = F.series(5), cTxt3 = F.color("text-3");

      // ---- panel principal: el triángulo -------------------------------
      var sx = F.scale([0, 10], [64, 376]);
      var sy = F.scale([0, 10], [330, 46]);
      F.axes(lay, {
        sx: sx, sy: sy, xTicks: 6, yTicks: 6, grid: true,
        xLabel: "radio r", yLabel: "altura h", y0: 0
      });

      F.line(lay, [[0, 0], [0, 10], [10, 10]], {
        sx: sx, sy: sy, close: true, fill: cPri, opacity: 0.12, stroke: cPri, width: 2
      });
      T(F, lay, sx(6.4), sy(5.4), "f(r,h) = 3r/500", { size: 11.5, mono: true, fill: cPri });

      // cortes
      F.line(lay, [[0, h0], [h0, h0]], { sx: sx, sy: sy, stroke: cAcc, width: 2 });
      T(F, lay, sx(h0) - 8, sy(h0) - 7, "h₀ = " + F.fmt(h0, 2), {
        size: 11.5, mono: true, anchor: "end", fill: cAcc
      });
      F.line(lay, [[r0, r0], [r0, 10]], { sx: sx, sy: sy, stroke: cU5, width: 2 });
      T(F, lay, sx(r0) + 5, sy(10) + 16, "r₀ = " + F.fmt(r0, 2), { size: 11.5, mono: true, fill: cU5 });

      // esperanza condicional sobre el corte horizontal
      var er = 2 * h0 / 3;
      F.marker(lay, sx(er), sy(h0), { r: 4.6, fill: cGood });
      T(F, lay, sx(er), sy(h0) + 16, "E[R|H=h₀]", { size: 10.5, anchor: "middle", fill: cGood });

      // punto (5,2), fuera del soporte
      // (5, 2) no es una serie: es un ESTADO (punto fuera del soporte), y va
      // con el color de estado y su rótulo al lado.
      F.el("circle", {
        cx: sx(5), cy: sy(2), r: 5, fill: "none",
        stroke: F.status("bad"), "stroke-width": 2
      }, lay);
      T(F, lay, sx(5) + 9, sy(2) + 4, "(5, 2) fuera del soporte", { size: 11, fill: F.color("text-2") });

      // ---- panel derecho superior: R dado H = h₀ (o marginal de R) ------
      var ax = 448, bx = 686;
      var sxR = F.scale([0, 10], [ax, bx]);
      var topMax = marg ? 0.16 : (2 / h0) * 1.2;
      var syR = F.scale([0, topMax], [176, 62]);
      F.axes(lay, {
        sx: sxR, sy: syR, xTicks: 5, yTicks: 3, grid: true, xLabel: "r", y0: 0
      });
      if (marg) {
        F.area(lay, fR, sxR, syR, { from: 0, to: 10, fill: cPri, opacity: 0.12 });
        F.curve(lay, fR, sxR, syR, { from: 0, to: 10, n: 160, stroke: cPri, width: 2 });
        T(F, lay, ax, 50, "marginal de R: 3r(10−r)/500", { size: 11, mono: true, fill: cPri });
        F.marker(lay, sxR(5), syR(fR(5)), { r: 4.6, fill: cPri });
      } else {
        var fc = function (rr) { return (rr > 0 && rr < h0) ? 2 * rr / (h0 * h0) : 0; };
        F.area(lay, fc, sxR, syR, { from: 0, to: h0, fill: cAcc, opacity: 0.12 });
        F.curve(lay, fc, sxR, syR, { from: 0, to: h0, n: 140, stroke: cAcc, width: 2 });
        F.line(lay, [[sxR(h0), syR(0)], [sxR(h0), syR(fc(h0))]], { stroke: cAcc, width: 1.3, dash: "3 3", cls: "fig-ref" });
        F.vline(lay, sxR(er), { y0: syR(0), y1: syR(topMax), stroke: cGood, width: 1.5, dash: "5 4" });
        T(F, lay, ax, 50, "f(r|H=h₀) = 2r/h₀²  en 0 < r < h₀", {
          size: 11, mono: true, fill: cAcc
        });
        T(F, lay, sxR(er) + (er > 6 ? -5 : 5), 74, "2h₀/3 = " + F.fmt(er, 2), {
          size: 11, mono: true, fill: cGood, anchor: er > 6 ? "end" : "start"
        });
      }

      // ---- panel derecho inferior: H dado R = r₀ (o marginal de H) ------
      var syH0 = 336, syH1 = 236;
      var sxH = F.scale([0, 10], [ax, bx]);
      var botMax = marg ? 0.36 : (1 / (10 - r0)) * 1.6;
      var syH = F.scale([0, botMax], [syH0, syH1]);
      F.axes(lay, {
        sx: sxH, sy: syH, xTicks: 5, yTicks: 3, grid: true, xLabel: "h", y0: 0
      });
      var eh = (10 + r0) / 2;
      if (marg) {
        F.area(lay, fH, sxH, syH, { from: 0, to: 10, fill: cPri, opacity: 0.12 });
        F.curve(lay, fH, sxH, syH, { from: 0, to: 10, n: 160, stroke: cPri, width: 2 });
        T(F, lay, ax, syH1 - 12, "marginal de H: 3h²/1000", { size: 11, mono: true, fill: cPri });
      } else {
        var alto = 1 / (10 - r0);
        var fh = function (hh) { return (hh > r0 && hh < 10) ? alto : 0; };
        F.area(lay, fh, sxH, syH, { from: r0, to: 10, fill: cU5, opacity: 0.12 });
        F.line(lay, [[sxH(r0), syH(0)], [sxH(r0), syH(alto)], [sxH(10), syH(alto)], [sxH(10), syH(0)]], {
          stroke: cU5, width: 2
        });
        F.vline(lay, sxH(eh), { y0: syH(0), y1: syH(botMax), stroke: cGood, width: 1.5, dash: "5 4" });
        T(F, lay, ax, syH1 - 12, "f(h|R=r₀) = 1/(10−r₀)  →  U(r₀, 10)", {
          size: 11, mono: true, fill: cU5
        });
        T(F, lay, sxH(eh) - 5, syH1 + 14, "(10+r₀)/2 = " + F.fmt(eh, 2), {
          size: 11, mono: true, fill: cGood, anchor: "end"
        });
      }
      T(F, lay, ax, H - 12, marg
        ? "la marginal acumula los cortes"
        : "una condicional por corte", { size: 11, fill: cTxt3 });

      out.set("er", F.fmt(er, 4));
      out.set("eh", F.fmt(eh, 4));
      out.set("f52", F.fmt(fRH(5, 2), 4));
      out.set("pr", F.fmt(fR(5) * fH(2), 4));
    }

    redraw();
  }, { title: "Cortes del soporte triangular 0 < r < h < 10", unidad: "5", page: "variables-aleatorias-bidimensionales", kind: "interactive" });

  // ==========================================================================
  //  F6 · u5-la-marginal-como-sombra-de-la-conjunta  (3D)
  // ==========================================================================
  reg("u5-la-marginal-como-sombra-de-la-conjunta", function (host, api) {
    var F = api.Fig;
    var W = 700, H = 380;
    var svg = F.svg(host, { w: W, h: H, title: "La superficie f(x,y) = (x+y)/27 y la marginal que proyecta al integrar en y" });

    var ctl = F.controls(host, [
      { k: "t", label: "corte en x = t", min: 0, max: 3, step: 0.05, value: 1.5, dec: 2 },
      // El azimut inicial NO puede ser +30: con elev = 26 la pendiente de la
      // superficie en y (0.4167·cos elev = 0.375) casi cancela el aporte de la
      // profundidad (sin azim·sin elev = 0.379) y el plano se proyecta como una
      // lámina chata — el fenómeno que la figura existe para mostrar solo
      // aparece si el lector mueve el deslizador. Con −55 la caja del plano
      // pasa de 287×34 px a 292×180 px y el corte se lee de entrada.
      { k: "azim", label: "azimut (°)", min: -70, max: 70, step: 5, value: -55, dec: 0 }
    ], function () { redraw(); });

    var out = F.readouts(host, [
      { k: "fx", tex: "f_X(t) = 1/6 + t/9" },
      { k: "int", tex: "\\int_0^3 f_{X,Y}(t,y)\\,dy" },
      { k: "mx", tex: "\\max_y f_{X,Y}(t,y)" }
    ]);

    F.legend(host, [
      { label: "densidad conjunta f(x,y) = (x+y)/27", color: F.series(1), fill: true },
      { label: "corte en x = t", color: F.series(2) },
      { label: "marginal fₓ (escala propia)", color: F.series(4) }
    ]);

    var lay = F.el("g", null, svg);
    var L = 1.5;                     // el dominio (0,3)² centrado en el origen
    var ZS = 2.5;                    // altura de la superficie en unidades de proyección
    var FMAX = 6 / 27;               // máximo de f sobre el dominio
    var FXMAX = 1 / 6 + 3 / 9;       // máximo de f_X sobre (0,3)

    function f(x, y) { return (x + y) / 27; }
    function fX(x) { return 1 / 6 + x / 9; }

    function redraw() {
      clearNode(lay);
      var t = ctl.get("t"), az = ctl.get("azim");
      var cPri = F.series(1), cAcc = F.series(2), cU5 = F.series(4),
        cGrid = F.color("plot-grid"), cAxis = F.color("plot-axis"), cTxt3 = F.color("text-3");

      var proj = F.iso3d({ elev: 26, azim: az, scale: 70 });
      var cx = W / 2 - 34, cy = H * 0.70;
      function pr(x, y, z) {
        var p = proj.project(x - L, y - L, z);
        return [cx + p[0], cy + p[1]];
      }

      // rejilla de la base
      var g, p1, p2;
      for (g = 0; g <= 3; g += 0.5) {
        p1 = pr(g, 0, 0); p2 = pr(g, 3, 0);
        F.line(lay, [p1, p2], { stroke: cGrid, width: 1, cls: "fig-ref" });
        p1 = pr(0, g, 0); p2 = pr(3, g, 0);
        F.line(lay, [p1, p2], { stroke: cGrid, width: 1, cls: "fig-ref" });
      }
      // Las LÍNEAS de los ejes van aquí, debajo de la superficie, como corresponde
      // al orden del pintor. Con azimut negativo el eje x queda ENTERO por
      // debajo de la sábana (su extremo cae dentro de la silueta), así que al
      // final se repasan los dos ejes con un trazo punteado tenue y se ponen los
      // rótulos: sobre el eje visible el repaso cae exactamente encima del trazo
      // sólido y no se nota; sobre el eje tapado se lee como línea oculta.
      var axOver = [];
      [[3.6, 0, "x"], [0, 3.6, "y"]].forEach(function (a) {
        var o0 = pr(0, 0, 0), e0 = pr(a[0], a[1], 0);
        F.line(lay, [o0, e0], { stroke: cAxis, width: 1.3, cls: "fig-ref" });
        axOver.push({ a: o0, b: e0, lab: a[2] });
      });

      // superficie: fn recibe coordenadas ya centradas
      F.surface(lay, function (u, v) { return f(u + L, v + L); },
        { xs: { from: -L, to: L, n: 24 }, ys: { from: -L, to: L, n: 24 } },
        proj, {
          fillLow: F.color("surface-2"), fillHigh: cPri,
          stroke: F.color("border-2"), strokeWidth: 0.35,
          cx: cx, cy: cy, zScale: ZS
        });

      // plano y curva del corte x = t
      var top = [], bot = [], k, yv;
      for (k = 0; k <= 60; k++) {
        yv = 3 * k / 60;
        top.push(pr(t, yv, f(t, yv) / FMAX * ZS));
        bot.push(pr(t, yv, 0));
      }
      F.path(lay, F.ptsToPath(top.concat(bot.slice().reverse()), true), {
        fill: cAcc, opacity: 0.12
      });
      F.line(lay, top, { stroke: cAcc, width: 2 });

      // la marginal, levantada como una pared exterior al dominio: se rellena
      // de 0 a t para que se lea como algo que se va acumulando, no flotando
      var yM = -0.75, ZM = ZS * 0.8;
      var full = [], part = [], base = [], xv;
      for (k = 0; k <= 60; k++) {
        xv = 3 * k / 60;
        full.push(pr(xv, yM, fX(xv) / FXMAX * ZM));
      }
      for (k = 0; k <= 60; k++) {
        xv = t * k / 60;
        part.push(pr(xv, yM, fX(xv) / FXMAX * ZM));
        base.push(pr(xv, yM, 0));
      }
      F.line(lay, [pr(0, yM, 0), pr(3, yM, 0)], { stroke: cAxis, width: 1.1, dash: "3 3", cls: "fig-ref" });
      F.line(lay, full, { stroke: cU5, width: 1.3, dash: "4 3", opacity: 0.45, cls: "fig-ref" });
      if (t > 0.02) {
        F.path(lay, F.ptsToPath(part.concat(base.slice().reverse()), true), {
          fill: cU5, opacity: 0.12
        });
        F.line(lay, part, { stroke: cU5, width: 2 });
      }
      var pm = pr(t, yM, fX(t) / FXMAX * ZM);
      F.line(lay, [pr(t, yM, 0), pm], { stroke: cU5, width: 1.2, dash: "3 3", cls: "fig-ref" });
      F.marker(lay, pm[0], pm[1], { r: 4.6, fill: cU5 });
      T(F, lay, pm[0] + 8, pm[1] - 8, "fₓ(t) = " + F.fmt(fX(t), 4), {
        size: 11.5, mono: true, fill: cU5
      });

      // eje vertical de referencia
      var zb = pr(0, 3, 0), zt = pr(0, 3, ZS * 1.12);
      F.line(lay, [zb, zt], { stroke: cAxis, width: 1.2, dash: "3 3", cls: "fig-ref" });
      haloText(F, lay, zt[0] - 12, zt[1] - 4, "f", { size: 12.5, fill: cTxt3, halo: 2.4 });

      // el rótulo del corte va al final y apoyado en el piso: si va antes, la
      // pared de la marginal lo tapa
      var tl = pr(t, 3, 0);
      T(F, lay, tl[0] - 8, tl[1] + 15, "x = t = " + F.fmt(t, 2), {
        size: 11.5, mono: true, anchor: "end", fill: cAcc
      });

      axOver.forEach(function (a) {
        F.line(lay, [a.a, a.b], { stroke: cAxis, width: 1.2, dash: "4 4", opacity: 0.85, cls: "fig-ref" });
        haloText(F, lay, a.b[0] + 6, a.b[1] + 5, a.lab, { size: 12.5, fill: cTxt3, halo: 2.4 });
      });

      var integ = M.integrate ? M.integrate(function (y) { return f(t, y); }, 0, 3, 400) : fX(t);
      out.set("fx", F.fmt(fX(t), 5));
      out.set("int", F.fmt(integ, 5));
      out.set("mx", F.fmt((t + 3) / 27, 5));
    }

    redraw();
  }, { title: "La marginal como sombra de la conjunta", unidad: "5", page: "variables-aleatorias-bidimensionales", kind: "interactive" });

  // ==========================================================================
  //  F7 · u5-que-mide-y-que-no-mide
  //  ρ, los cuatro cuadrantes y el contraejemplo Cov = 0 sin independencia.
  // ==========================================================================
  reg("u5-que-mide-y-que-no-mide", function (host, api) {
    var F = api.Fig;
    var W = 660, H = 380;
    var svg = F.svg(host, { w: W, h: H, title: "Nube de puntos, cuadrantes con el signo de (x−x̄)(y−ȳ) y valor de ρ" });
    var N = 320;

    var ctl;
    var sel = F.select(host, {
      k: "modo", label: "generador",
      options: [
        { v: "normal", label: "normal bivariada con ρ regulable" },
        { v: "cuad", label: "contraejemplo Y = X²" },
        { v: "anillo", label: "contraejemplo: soporte en anillo" }
      ],
      value: "normal"
    }, function (k, v) { modo = v; redraw(); });
    var modo = sel.get() || "normal";

    ctl = F.controls(host, [
      { k: "rho", label: "ρ (solo en la normal)", min: -1, max: 1, step: 0.01, value: 0.75, dec: 2 }
    ], function () { redraw(); });

    F.buttons(host, [{
      label: "Nueva realización",
      title: "vuelve a sortear los mismos n puntos con otra semilla",
      onClick: function () {
        api.state.seed = (api.state.seed == null ? 1 : api.state.seed) + 1;
        redraw();
      }
    }]);

    var out = F.readouts(host, [
      { k: "rh", tex: "\\hat{\\rho}" },
      { k: "cv", tex: "\\widehat{\\Cov}(X,Y)" },
      { k: "rt", label: "ρ teórico" },
      { k: "n", label: "n" },
      { k: "nota", label: "lectura" }
    ]);

    F.legend(host, [
      { label: "producto (x−x̄)(y−ȳ) positivo", color: F.div(0.85), fill: true },
      { label: "producto negativo", color: F.div(-0.85), fill: true },
      { label: "puntos de la muestra", color: F.series(1), fill: true },
      { label: "medias x̄ e ȳ", color: F.series(2), dash: true },
      { label: "recta de mínimos cuadrados", color: F.series(4), dash: true }
    ]);

    var lay = F.el("g", null, svg);

    function sample() {
      var seed = 20250 + (api.state.seed == null ? 1 : api.state.seed) * 977;
      var u = F.rng(seed);
      var rho = clamp(ctl.get("rho"), -1, 1);
      var pts = [], i, x, y, z1, z2, th, rr;
      for (i = 0; i < N; i++) {
        if (modo === "normal") {
          z1 = u.normal(0, 1); z2 = u.normal(0, 1);
          x = z1; y = rho * z1 + Math.sqrt(Math.max(0, 1 - rho * rho)) * z2;
        } else if (modo === "cuad") {
          x = u.range(-2, 2);
          y = x * x + 0.12 * u.normal(0, 1);
        } else {
          th = u.range(0, 2 * Math.PI);
          rr = 1 + 0.05 * u.normal(0, 1);
          x = rr * Math.cos(th); y = rr * Math.sin(th);
        }
        pts.push([x, y]);
      }
      return pts;
    }

    function redraw() {
      clearNode(lay);
      var pts = sample();
      var i, n = pts.length;
      var mx = 0, my = 0;
      for (i = 0; i < n; i++) { mx += pts[i][0]; my += pts[i][1]; }
      mx /= n; my /= n;
      var sxx = 0, syy = 0, sxy = 0, dx, dy;
      for (i = 0; i < n; i++) {
        dx = pts[i][0] - mx; dy = pts[i][1] - my;
        sxx += dx * dx; syy += dy * dy; sxy += dx * dy;
      }
      sxx /= n; syy /= n; sxy /= n;
      var rhat = sxy / Math.sqrt(Math.max(1e-12, sxx * syy));

      var sdx = Math.sqrt(sxx), sdy = Math.sqrt(syy);
      var X0 = mx - 3.3 * sdx, X1 = mx + 3.3 * sdx;
      var Y0 = my - 3.3 * sdy, Y1 = my + 3.3 * sdy;

      var cPri = F.series(1), cAcc = F.series(2);
      // el signo del producto es una magnitud CON SIGNO: par divergente, no
      // colores de estado (los cuadrantes no son «correcto» ni «incorrecto»).
      var cPos = F.div(0.85), cNeg = F.div(-0.85);

      var sx = F.scale([X0, X1], [62, W - 26]);
      var sy = F.scale([Y0, Y1], [H - 52, 46]);

      // cuadrantes tintados según el signo del producto
      function quad(xa, xb, ya, yb, c) {
        F.el("rect", {
          x: Math.min(sx(xa), sx(xb)), y: Math.min(sy(ya), sy(yb)),
          width: Math.abs(sx(xb) - sx(xa)), height: Math.abs(sy(yb) - sy(ya)),
          fill: c, opacity: 0.16
        }, lay);
      }
      quad(mx, X1, my, Y1, cPos);   // (+,+)
      quad(X0, mx, Y0, my, cPos);   // (−,−)
      quad(X0, mx, my, Y1, cNeg);   // (−,+)
      quad(mx, X1, Y0, my, cNeg);   // (+,−)

      F.axes(lay, {
        sx: sx, sy: sy, xTicks: 6, yTicks: 5, grid: true,
        xLabel: "x", yLabel: "y", y0: Y0
      });

      F.vline(lay, sx(mx), { y0: sy(Y1), y1: sy(Y0), stroke: cAcc, width: 1.5, dash: "5 4" });
      F.hline(lay, sy(my), { x0: sx(X0), x1: sx(X1), stroke: cAcc, width: 1.5, dash: "5 4" });
      T(F, lay, sx(mx) + 5, sy(Y1) + 12, "x̄ = " + F.fmt(mx, 2), { size: 11, mono: true, fill: cAcc });
      T(F, lay, sx(X0) + 6, sy(my) - 6, "ȳ = " + F.fmt(my, 2), { size: 11, mono: true, fill: cAcc });

      for (i = 0; i < n; i++) {
        if (pts[i][0] < X0 || pts[i][0] > X1 || pts[i][1] < Y0 || pts[i][1] > Y1) continue;
        F.el("circle", {
          cx: sx(pts[i][0]), cy: sy(pts[i][1]), r: 2.5,
          fill: cPri, opacity: 0.62
        }, lay);
      }

      // La recta de mínimos cuadrados se dibuja SIEMPRE: en los contraejemplos
      // queda horizontal, que es justamente lo que la figura quiere mostrar.
      if (sxx > 1e-9) {
        var b = sxy / sxx, a = my - b * mx;
        F.line(lay, [[X0, a + b * X0], [X1, a + b * X1]], {
          sx: sx, sy: sy, stroke: F.series(4), width: 2, dash: "6 4",
          serie: "recta de mínimos cuadrados"
        });
      }
      // el centro (x̄, ȳ) es el vértice de los cuatro cuadrantes
      F.marker(lay, sx(mx), sy(my), { r: 4.6, fill: cAcc, serie: "centro (x̄, ȳ)" });

      var nota;
      if (modo === "normal") {
        nota = Math.abs(rhat) > 0.95
          ? "con |ρ| ≈ 1 la nube colapsa sobre una recta"
          : "pesan más los cuadrantes del signo de ρ";
      } else {
        nota = "ρ ≈ 0 con dependencia clara: ρ solo mide relación lineal";
      }

      out.set("rh", F.fmt(rhat, 4));
      out.set("cv", F.fmt(sxy, 4));
      out.set("rt", modo === "normal" ? F.fmt(ctl.get("rho"), 2) : "0 (por simetría)");
      out.set("n", String(n));
      out.set("nota", nota);
    }

    redraw();
  }, { title: "Qué mide ρ y qué no mide", unidad: "5", page: "covarianza-y-correlacion", kind: "interactive" });

  // ==========================================================================
  //  F8 · u5-soporte-rectangular-contra-soporte-no-rectangula
  // ==========================================================================
  reg("u5-soporte-rectangular-contra-soporte-no-rectangula", function (host, api) {
    var F = api.Fig;
    var W = 700, H = 356;
    var svg = F.svg(host, { w: W, h: H, title: "Soporte rectangular contra soporte triangular: el rango admisible de Y" });

    var ctl = F.controls(host, [
      {
        k: "t", label: "posición del corte", min: 0.04, max: 0.96, step: 0.01, value: 0.45,
        fmt: function (t) { return F.fmt(3 * t, 2) + "  /  " + F.fmt(t, 2); }
      }
    ], function () { redraw(); });

    var out = F.readouts(host, [
      { k: "yl", label: "rango de Y dado X = x₀ (rectángulo)" },
      { k: "yr", label: "rango de Y dado X = x₀ (triángulo)" },
      { k: "ll", label: "largo del segmento (rect. / triáng.)" }
    ]);

    F.legend(host, [
      { label: "soporte de f(x,y)", color: F.series(1), fill: true },
      { label: "corte x = x₀", color: F.series(2) },
      { label: "rango admisible de Y sobre el corte", color: F.series(3) }
    ]);

    var lay = F.el("g", null, svg);

    function redraw() {
      clearNode(lay);
      var t = ctl.get("t");
      var xl = 3 * t, xr = t;
      var cPri = F.series(1), cAcc = F.series(2), cGood = F.series(3),
        cWarn = F.color("text-3"), cTxt = F.color("text-2"), cTxt3 = F.color("text-3");

      // ---- panel izquierdo: rectángulo (0,3)² ---------------------------
      var sxL = F.scale([0, 3.2], [62, 322]);
      var syL = F.scale([0, 3.2], [268, 62]);
      F.axes(lay, { sx: sxL, sy: syL, xTicks: 4, yTicks: 4, grid: true, yLabel: "y", y0: 0 });
      T(F, lay, 62, 40, "soporte rectangular  (0,3) × (0,3)", { size: 12.5, fill: cTxt, weight: 600 });
      T(F, lay, 62, 56, "f(x,y) = (x+y)/27", { size: 11, mono: true, fill: cTxt3 });

      F.el("rect", {
        x: sxL(0), y: syL(3), width: sxL(3) - sxL(0), height: syL(0) - syL(3),
        fill: cPri, "fill-opacity": 0.12, stroke: cPri, "stroke-width": 2
      }, lay);

      F.vline(lay, sxL(xl), { y0: syL(3.2), y1: syL(0), stroke: cAcc, width: 1.8, dash: "5 4" });
      F.line(lay, [[sxL(xl), syL(0)], [sxL(xl), syL(3)]], {
        stroke: cGood, width: 2, serie: "rango de Y sobre el corte"
      });
      F.marker(lay, sxL(xl), syL(0), { r: 4.6, fill: cGood, serie: false });
      F.marker(lay, sxL(xl), syL(3), { r: 4.6, fill: cGood, serie: false });
      T(F, lay, sxL(xl), syL(0) + 32, "x₀ = " + F.fmt(xl, 2), {
        size: 11.5, anchor: "middle", mono: true, fill: cAcc
      });
      T(F, lay, sxL(xl) + 9, syL(1.5), "Y ∈ (0, 3)", { size: 11.5, mono: true, fill: cGood });
      T(F, lay, 62, 322, "largo 3: no depende de x₀", { size: 11.5, fill: cGood });
      T(F, lay, 62, 342, "⚠ necesario, no suficiente", { size: 11, fill: cWarn });

      // ---- panel derecho: triángulo 0 < y < x < 1 -----------------------
      var sxR = F.scale([0, 1.07], [420, 680]);
      var syR = F.scale([0, 1.07], [268, 62]);
      F.axes(lay, { sx: sxR, sy: syR, xTicks: 4, yTicks: 4, grid: true, yLabel: "y", y0: 0 });
      T(F, lay, 420, 40, "soporte triangular  0 < y < x < 1", { size: 12.5, fill: cTxt, weight: 600 });
      T(F, lay, 420, 56, "f(x,y) = 2", { size: 11, mono: true, fill: cTxt3 });

      F.line(lay, [[0, 0], [1, 0], [1, 1]], {
        sx: sxR, sy: syR, close: true, fill: cPri, opacity: 0.12, stroke: cPri, width: 2
      });

      F.vline(lay, sxR(xr), { y0: syR(1.07), y1: syR(0), stroke: cAcc, width: 1.8, dash: "5 4" });
      F.line(lay, [[sxR(xr), syR(0)], [sxR(xr), syR(xr)]], {
        stroke: cGood, width: 2, serie: "rango de Y sobre el corte"
      });
      F.marker(lay, sxR(xr), syR(0), { r: 4.6, fill: cGood, serie: false });
      F.marker(lay, sxR(xr), syR(xr), { r: 4.6, fill: cGood, serie: false });
      T(F, lay, sxR(xr), syR(0) + 32, "x₀ = " + F.fmt(xr, 2), {
        size: 11.5, anchor: "middle", mono: true, fill: cAcc
      });
      var derecha = xr > 0.58;
      T(F, lay, sxR(xr) + (derecha ? -9 : 9), syR(Math.max(xr, 0.28) / 2),
        "Y ∈ (0, " + F.fmt(xr, 2) + ")", {
          size: 11.5, mono: true, fill: cGood, anchor: derecha ? "end" : "start"
        });
      T(F, lay, 420, 322, "el largo se acorta con x₀", {
        size: 11.5, fill: cGood
      });
      T(F, lay, 420, 342, "conocer X restringe a Y", { size: 11, fill: cTxt3 });

      out.set("yl", "(0, 3) — fijo");
      out.set("yr", "(0, " + F.fmt(xr, 2) + ") — depende de x₀");
      out.set("ll", "3.00  /  " + F.fmt(xr, 2));
    }

    redraw();
  }, { title: "Soporte rectangular contra soporte no rectangular", unidad: "5", page: "independencia-de-variables-aleatorias", kind: "interactive" });

  // ==========================================================================
  //  F9 · u5-varianza-intra-mas-varianza-entre
  // ==========================================================================
  reg("u5-varianza-intra-mas-varianza-entre", function (host, api) {
    var F = api.Fig;
    var W = 680;
    var P = F.panels(host, 2, { w: W, heights: [214, 164], gap: 6 });
    var svgA = P[0], svgB = P[1];

    var ctl = F.controls(host, [
      { k: "d", label: "separación entre las medias", min: 0, max: 5, step: 0.05, value: 2.5, dec: 2 },
      { k: "s", label: "ancho σ de cada grupo", min: 0.4, max: 2.5, step: 0.05, value: 0.9, dec: 2 }
    ], function () { redraw(); });

    var out = F.readouts(host, [
      { k: "intra", tex: "\\E[\\Var(X \\mid Y)]" },
      { k: "entre", tex: "\\Var(\\E[X \\mid Y])" },
      { k: "tot", tex: "\\Var(X)" },
      { k: "chk", label: "control numérico de Var(X)" }
    ]);

    F.legend(host, [
      { label: "densidades condicionales (peso 1/3 cada una)", color: F.series(4), dash: true },
      { label: "densidad total (la mezcla)", color: F.series(1) },
      { label: "medias condicionales", color: F.series(2), dash: true },
      { label: "variabilidad intra / entre", color: F.series(3), fill: true }
    ]);

    var layA = F.el("g", null, svgA);
    var layB = F.el("g", null, svgB);

    function redraw() {
      clearNode(layA); clearNode(layB);
      var d = ctl.get("d"), s = ctl.get("s");
      var mus = [-d, 0, d], w = 1 / 3;
      var intra = s * s;
      var entre = (2 * d * d) / 3;
      var total = intra + entre;

      var cPri = F.series(1), cAcc = F.series(2), cGood = F.series(3),
        cU5 = F.series(4), cBad = F.series(5), cTxt3 = F.color("text-3");

      function mix(x) {
        var i, v = 0;
        for (i = 0; i < 3; i++) v += w * M.normPDF(x, mus[i], s);
        return v;
      }

      // ---- panel superior: densidades ----------------------------------
      var hA = 214, X0 = -d - 3.6 * s, X1 = d + 3.6 * s;
      var ymax = maxOf(mix, X0, X1, 400) * 1.28;
      var sx = F.scale([X0, X1], [58, W - 22]);
      var sy = F.scale([0, ymax], [hA - 44, 18]);
      F.axes(layA, { sx: sx, sy: sy, xTicks: 7, yTicks: 4, grid: true, xLabel: "x", yLabel: "densidad", y0: 0 });

      mus.forEach(function (m) {
        F.curve(layA, function (x) { return w * M.normPDF(x, m, s); }, sx, sy, {
          n: 220, stroke: cU5, width: 2, dash: "5 4"
        });
        F.vline(layA, sx(m), { y0: sy(0), y1: sy(w * M.normPDF(m, m, s)), stroke: cAcc, width: 1.4, dash: "4 3" });
        F.marker(layA, sx(m), sy(0), { r: 4.6, fill: cAcc });
      });
      F.curve(layA, mix, sx, sy, { n: 320, stroke: cPri, width: 2 });

      // anotación intra: ancho de un grupo (±σ alrededor de la media central)
      var yIntra = sy(ymax * 0.855);
      F.line(layA, [[sx(-s), yIntra], [sx(s), yIntra]], { stroke: cGood, width: 2 });
      [[-s], [s]].forEach(function (e) {
        F.line(layA, [[sx(e[0]), yIntra - 4], [sx(e[0]), yIntra + 4]], { stroke: cGood, width: 2 });
      });
      T(F, layA, sx(0), yIntra - 8, "intra: ±σ = ±" + F.fmt(s, 2), {
        size: 11, anchor: "middle", fill: cGood
      });

      // anotación entre: distancia entre las medias extremas
      var yEntre = sy(ymax * 0.99);
      if (d > 0.05) {
        F.line(layA, [[sx(-d), yEntre], [sx(d), yEntre]], { stroke: cAcc, width: 2 });
        [[-d], [d]].forEach(function (e) {
          F.line(layA, [[sx(e[0]), yEntre - 4], [sx(e[0]), yEntre + 4]], { stroke: cAcc, width: 2 });
        });
        T(F, layA, sx(0), yEntre - 8, "entre: d = " + F.fmt(d, 2), {
          size: 11, anchor: "middle", fill: cAcc
        });
      } else {
        T(F, layA, sx(0), yEntre - 8, "con d = 0 no hay parte «entre»", {
          size: 11, anchor: "middle", fill: cTxt3
        });
      }

      // ---- panel inferior: la descomposición en barras ------------------
      var bx = 226, blen = W - bx - 78;
      var esc = Math.max(total, 0.5) * 1.06;
      stackBar(F, layB, {
        x: bx, y: 26, h: 21, len: blen, scale: esc,
        parts: [{ v: intra, fill: cGood }],
        label: "intra  E[Var(X | Y)] = σ²", value: F.fmt(intra, 3), labelFill: cGood
      });
      stackBar(F, layB, {
        x: bx, y: 68, h: 21, len: blen, scale: esc,
        parts: [{ v: entre, fill: cAcc }],
        label: "entre  Var(E[X | Y]) = 2d²/3", value: F.fmt(entre, 3), labelFill: cAcc
      });
      stackBar(F, layB, {
        x: bx, y: 110, h: 21, len: blen, scale: esc,
        parts: [{ v: intra, fill: cGood }, { v: entre, fill: cAcc }],
        label: "total  Var(X) = intra + entre", value: F.fmt(total, 3), labelFill: cPri
      });
      T(F, layB, bx - 12, 36, "1", { size: 11, anchor: "end", mono: true, fill: cTxt3 });
      T(F, layB, bx - 12, 78, "2", { size: 11, anchor: "end", mono: true, fill: cTxt3 });
      T(F, layB, bx - 12, 120, "3", { size: 11, anchor: "end", mono: true, fill: cTxt3 });
      T(F, layB, 14, 154,
        "solo intra subestima en " + F.fmt(entre, 3), {
          size: 11.5, fill: cTxt3
        });

      // control numérico: Var(X) por integración directa de la mezcla
      var m1 = M.integrate(function (x) { return x * mix(x); }, X0 - 4, X1 + 4, 1200);
      var m2 = M.integrate(function (x) { return x * x * mix(x); }, X0 - 4, X1 + 4, 1200);

      out.set("intra", F.fmt(intra, 4));
      out.set("entre", F.fmt(entre, 4));
      out.set("tot", F.fmt(total, 4));
      out.set("chk", F.fmt(m2 - m1 * m1, 4));
    }

    redraw();
  }, { title: "Varianza intra más varianza entre", unidad: "5", page: "esperanza-condicional", kind: "interactive" });

  // ==========================================================================
  //  F10 · u5-la-mezcla-como-superposicion-ponderada
  // ==========================================================================
  reg("u5-la-mezcla-como-superposicion-ponderada", function (host, api) {
    var F = api.Fig;
    var W = 680;
    var P = F.panels(host, 2, { w: W, heights: [216, 166], gap: 6 });
    var svgA = P[0], svgB = P[1];

    var ctl = F.controls(host, [
      { k: "p", label: "P(M = 0) — peso del subte", min: 0, max: 1, step: 0.01, value: 0.7, dec: 2 },
      { k: "m0", label: "media condicional en subte", min: 5, max: 60, step: 1, value: 30, dec: 0 },
      { k: "m1", label: "media condicional en colectivo", min: 5, max: 60, step: 1, value: 40, dec: 0 }
    ], function () { redraw(); });

    var out = F.readouts(host, [
      { k: "et", tex: "\\E[T]" },
      { k: "intra", tex: "\\E[\\Var(T \\mid M)]" },
      { k: "entre", tex: "\\Var(\\E[T \\mid M])" },
      { k: "tot", tex: "\\Var(T)" }
    ]);

    F.legend(host, [
      { label: "P(M=0)·f(t | M=0)", color: F.series(2), dash: true },
      { label: "P(M=1)·f(t | M=1)", color: F.series(4), dash: true },
      { label: "mezcla f_T (combinación convexa)", color: F.series(1) },
      { label: "descomposición de la varianza", color: F.series(3), fill: true }
    ]);

    var layA = F.el("g", null, svgA);
    var layB = F.el("g", null, svgB);

    function redraw() {
      clearNode(layA); clearNode(layB);
      var p = ctl.get("p"), m0 = ctl.get("m0"), m1 = ctl.get("m1");
      var q = 1 - p;
      var mu = p * m0 + q * m1;
      var intra = p * m0 * m0 + q * m1 * m1;
      var entre = p * (m0 - mu) * (m0 - mu) + q * (m1 - mu) * (m1 - mu);
      var total = intra + entre;

      var cPri = F.series(1), cAcc = F.series(2), cGood = F.series(3),
        cU5 = F.series(4), cBad = F.series(5), cTxt3 = F.color("text-3");

      var f0 = function (t) { return t < 0 ? 0 : p * (1 / m0) * Math.exp(-t / m0); };
      var f1 = function (t) { return t < 0 ? 0 : q * (1 / m1) * Math.exp(-t / m1); };
      var fT = function (t) { return f0(t) + f1(t); };

      // ---- panel superior: superposición ponderada ----------------------
      var hA = 216, T1 = 4 * Math.max(m0, m1);
      var ymax = Math.max(fT(0), 1e-4) * 1.16;
      var sx = F.scale([0, T1], [62, W - 22]);
      var sy = F.scale([0, ymax], [hA - 44, 18]);
      F.axes(layA, {
        sx: sx, sy: sy, xTicks: 6, yTicks: 4, grid: true,
        xLabel: "tiempo t (minutos)", yLabel: "densidad", y0: 0
      });

      F.area(layA, f0, sx, sy, { from: 0, to: T1, fill: cAcc, opacity: 0.12 });
      F.area(layA, f1, sx, sy, { from: 0, to: T1, fill: cU5, opacity: 0.12 });
      F.curve(layA, f0, sx, sy, { from: 0, to: T1, n: 240, stroke: cAcc, width: 2, dash: "5 4" });
      F.curve(layA, f1, sx, sy, { from: 0, to: T1, n: 240, stroke: cU5, width: 2, dash: "5 4" });
      F.curve(layA, fT, sx, sy, { from: 0, to: T1, n: 300, stroke: cPri, width: 2 });

      F.vline(layA, sx(mu), { y0: sy(0), y1: sy(fT(mu)), stroke: cGood, width: 1.6, dash: "4 3" });
      T(F, layA, sx(mu) + 5, sy(fT(mu)) - 8, "E[T] = " + F.fmt(mu, 2), {
        size: 11.5, mono: true, fill: cGood
      });
      // los rótulos van ARRIBA del eje: en la fila de las marcas de escala se
      // encimarían con los números del eje
      // marcas de las medias condicionales sobre el eje; el rótulo va junto,
      // arriba a la derecha, para no encimarse con las curvas ni con la escala
      [[m0, cAcc], [m1, cU5]].forEach(function (e) {
        F.marker(layA, sx(e[0]), sy(0), { r: 4.6, fill: e[1] });
        F.line(layA, [[sx(e[0]), sy(0) - 6], [sx(e[0]), sy(0) + 6]], { stroke: e[1], width: 1.6, cls: "fig-ref" });
      });
      T(F, layA, W - 26, 30, "m₀ = " + F.fmt(m0, 0) + "   m₁ = " + F.fmt(m1, 0), {
        size: 11.5, anchor: "end", mono: true, fill: cTxt3
      });

      // ---- panel inferior: las tres barras ------------------------------
      var bx = 244, blen = W - bx - 92;
      var esc = Math.max(total, 1) * 1.06;
      stackBar(F, layB, {
        x: bx, y: 28, h: 21, len: blen, scale: esc,
        parts: [{ v: intra, fill: cGood }],
        label: "intra  E[Var(T | M)]", value: F.fmt(intra, 1), labelFill: cGood
      });
      stackBar(F, layB, {
        x: bx, y: 70, h: 21, len: blen, scale: esc,
        parts: [{ v: entre, fill: cAcc }],
        label: "entre  Var(E[T | M])", value: F.fmt(entre, 1), labelFill: cAcc
      });
      stackBar(F, layB, {
        x: bx, y: 112, h: 21, len: blen, scale: esc,
        parts: [{ v: intra, fill: cGood }, { v: entre, fill: cAcc }],
        label: "total  Var(T) = intra + entre", value: F.fmt(total, 1), labelFill: cPri
      });
      T(F, layB, 14, 156, Math.abs(m0 - m1) < 0.5
        ? "con m₀ = m₁ no hay parte «entre»"
        : "solo intra pierde " + F.fmt(entre, 1) + " de varianza", {
          size: 11.5, fill: cTxt3
        });

      out.set("et", F.fmt(mu, 3));
      out.set("intra", F.fmt(intra, 2));
      out.set("entre", F.fmt(entre, 2));
      out.set("tot", F.fmt(total, 2));
    }

    redraw();
  }, { title: "La mezcla como superposición ponderada", unidad: "5", page: "mezcla-de-distribuciones", kind: "interactive" });

})();
