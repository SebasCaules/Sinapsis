/* ============================================================
   figuras/u6.js — figuras de la Unidad 6 (procesos estocásticos).

   Se carga DESPUÉS de figures.js (necesita App.registerFigure y App.Fig) y de
   lib-math.js (window.M). Cada figura se registra con su identificador
   definitivo; las páginas del wiki las invocan con el callout

       > [!figura] <id>
       > <epígrafe>

   FIGURAS REGISTRADAS
     u6-dualidad-conteo-tiempo-la-escalera-n-t-y-los-ins
                                        conceptos/proceso-de-poisson.md
     u6-el-intervalo-infinitesimal-t-t-h-y-las-tres-rama
                                        conceptos/proceso-de-poisson.md
     u6-refinar-el-reloj-de-binomial-t-t-t-a-poisson-t
                                        conceptos/relacion-bernoulli-poisson.md
     u6-convergencia-de-p-n-cuando-hay-y-cuando-no
                                        conceptos/cadenas-de-markov.md
     u6-diagrama-de-estados-a-partir-de-la-matriz-p
                                        conceptos/cadenas-de-markov.md
     u6-forma-canonica-los-bloques-i-0-f-q
                                        conceptos/cadenas-de-markov.md
     u6-trayectorias-de-la-caminata-y-el-abanico-n
                                        conceptos/caminata-aleatoria.md
     u6-caminata-1-contra-caminata-gaussiana-mismo-momen
                                        conceptos/caminata-aleatoria.md
     u6-anatomia-de-una-realizacion-de-bernoulli
                                        conceptos/proceso-de-bernoulli.md
     u6-que-mira-cada-propiedad-dos-ventanas-sobre-la-mi
                                        conceptos/procesos-estocasticos.md

   NÚMEROS
     Todo valor que aparece en pantalla se calcula: las probabilidades con
     window.M (poissonPMF/poissonCDF, binomPMF, normPDF/normCDF, matInverse,
     matMul, stationary, integrate) y los estadísticos de simulación sobre las
     muestras efectivamente dibujadas. No hay ninguna constante copiada a mano.

   AZAR
     Toda simulación pasa por Fig.rng(semilla), de modo que la figura es
     reproducible: el botón «Nueva realización» incrementa api.state.seed y
     vuelve a dibujar. Como las exponenciales se sortean con u.exp(λ) sobre las
     MISMAS uniformes, mover λ reescala la realización en vez de resortearla, y
     así se ve el efecto del parámetro y no el del ruido.

   KaTeX SOBRE EL SVG
     Fig.tex cuelga un <div> del envoltorio del <svg>, no de la capa de dibujo:
     por eso las figuras que redibujan llaman antes a clearTex(svg), y las
     estáticas lo usan sin más (dibujan una sola vez por montaje).
   ============================================================ */
(function () {
  "use strict";

  var A = window.App;
  if (!A || typeof A.registerFigure !== "function") return;
  var F = A.Fig;
  if (!F) return;
  var M = window.M || {};

  // ============================================================
  //  utilidades comunes
  // ============================================================

  var SUB = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉"];
  function sub(n) {
    var s = "", str = String(n), i;
    for (i = 0; i < str.length; i++) s += SUB[+str.charAt(i)] || str.charAt(i);
    return s;
  }

  // Quita los <div class="fig-tex"> del envoltorio de un <svg>: hay que
  // llamarlo al empezar cada redibujo, porque Fig.tex NO cuelga de la capa.
  function clearTex(svg) {
    var wrap = svg && svg.__wrap;
    if (!wrap) return;
    var list = wrap.querySelectorAll(".fig-tex"), i;
    for (i = list.length - 1; i >= 0; i--) wrap.removeChild(list[i]);
  }

  // Leyenda dibujada DENTRO del SVG (para las figuras cuyas etiquetas cambian
  // con los controles: Fig.legend agregaría una fila nueva en cada redibujo).
  function inlineLegend(g, x, y, items, o) {
    o = o || {};
    var vertical = !!o.vertical, cx = x, cy = y, i;
    for (i = 0; i < items.length; i++) {
      var it = items[i];
      if (it.fill) {
        F.el("rect", { x: cx, y: cy - 5.5, width: 15, height: 11, rx: 2, fill: it.color, opacity: it.opacity == null ? 0.55 : it.opacity }, g);
      } else {
        F.el("line", {
          x1: cx, y1: cy, x2: cx + 17, y2: cy, stroke: it.color,
          "stroke-width": 2, "stroke-dasharray": it.dash ? "4 3" : null
        }, g);
      }
      F.text(g, cx + 22, cy, it.label, {
        size: o.size || 11.5, baseline: "middle", fill: F.color("text-2")
      });
      if (vertical) cy += o.lh || 18;
      else cx += 22 + String(it.label).length * (o.cw || 6.05) + (o.gap || 18);
    }
    return vertical ? cy : cx;
  }

  // Tiñe un color con transparencia (para lavados y bloques de matriz).
  function tintOf(c, a) { return (A.withAlpha ? A.withAlpha(c, a) : c) || c; }

  // Línea de tiempo propia (en vez de Fig.timeline): el eje, sus marcas de
  // escala y las llaves viven en un grupo .fig-axes —son mobiliario de eje, no
  // dato— y los rótulos de evento van en tokens de texto, no en el color de la
  // serie. Las varillas de evento llevan el trazo de dato de 2 px.
  function timeAxis(g, o) {
    var t0 = o.t0 == null ? 0 : o.t0, t1 = o.t1;
    var x0 = o.x0, x1 = o.x1, y = o.y;
    var s = F.scale([t0, t1], [x0, x1]);
    var ax = F.el("g", { "class": "fig-axes" }, g);
    var cAx = F.color("plot-axis"), cTx = F.color("text-3");
    F.el("line", { x1: x0, y1: y, x2: x1, y2: y, stroke: cAx, "stroke-width": 1 }, ax);
    F.el("path", { d: "M" + x1 + " " + y + "l-7 -4 v8 z", fill: cAx }, ax);
    var nT = o.ticks == null ? 6 : o.ticks;
    var step = (t1 - t0) / nT;
    var mag = Math.pow(10, Math.floor(Math.log(step) / Math.LN10));
    var nice = mag;
    [1, 2, 2.5, 5, 10].some(function (kk) { if (kk * mag >= step) { nice = kk * mag; return true; } return false; });
    var dec = nice >= 1 ? 0 : (nice >= 0.1 ? 1 : 2);
    for (var v = Math.ceil(t0 / nice) * nice; v <= t1 + 1e-9; v += nice) {
      var px = s(v);
      F.el("line", { x1: px, y1: y, x2: px, y2: y + 4, stroke: cAx, "stroke-width": 1 }, ax);
      F.text(ax, px, y + 8, F.fmt(v, dec), {
        size: 11, anchor: "middle", baseline: "hanging", fill: cTx, mono: true
      });
    }
    if (o.label) F.text(ax, x1, y + 24, o.label, {
      size: 11.5, anchor: "end", baseline: "hanging", fill: cTx
    });
    var lastPx = -1e9, tier = 0;
    (o.marks || []).slice().sort(function (a, b) { return a.t - b.t; }).forEach(function (m) {
      var px = s(m.t), c = m.color || F.series(1);
      tier = (px - lastPx) < (o.minGap == null ? 22 : o.minGap) ? (tier + 1) % 3 : 0;
      lastPx = px;
      var h = (m.h || 13) + tier * 13;
      F.el("line", {
        x1: px, y1: y - h, x2: px, y2: y + 3, stroke: c,
        "stroke-width": 2, "stroke-linecap": "round"
      }, g);
      F.el("circle", { cx: px, cy: y, r: 3, fill: c }, g);
      if (m.label != null) F.text(g, px, y - h - 5, m.label, {
        size: 11, anchor: "middle", mono: true, fill: F.color("text-2")
      });
    });
    return s;
  }

  // --- álgebra de cadenas ---

  function rowVecMul(p, P) {                 // vector fila por matriz
    var n = P.length, out = [], i, j, s;
    for (j = 0; j < n; j++) { s = 0; for (i = 0; i < n; i++) s += p[i] * P[i][j]; out.push(s); }
    return out;
  }
  function normalizeVec(v) {
    var s = 0, i, out = [];
    for (i = 0; i < v.length; i++) s += Math.max(0, v[i]);
    if (!(s > 0)) { for (i = 0; i < v.length; i++) out.push(1 / v.length); return out; }
    for (i = 0; i < v.length; i++) out.push(Math.max(0, v[i]) / s);
    return out;
  }
  function reachMatrix(P) {                  // R[i][j]=1 si j es accesible desde i en ≥1 paso
    var n = P.length, R = [], i, j, k, changed = true;
    for (i = 0; i < n; i++) { R.push([]); for (j = 0; j < n; j++) R[i].push(P[i][j] > 1e-12 ? 1 : 0); }
    while (changed) {
      changed = false;
      for (i = 0; i < n; i++) for (k = 0; k < n; k++) {
        if (!R[i][k]) continue;
        for (j = 0; j < n; j++) if (R[k][j] && !R[i][j]) { R[i][j] = 1; changed = true; }
      }
    }
    return R;
  }
  function classifyStates(P) {               // "absorbente" | "transiente" | "recurrente"
    var n = P.length, R = reachMatrix(P), out = [], i, j, tr;
    for (i = 0; i < n; i++) {
      if (P[i][i] > 1 - 1e-12) { out.push("absorbente"); continue; }
      tr = false;
      for (j = 0; j < n; j++) if (R[i][j] && !R[j][i]) tr = true;
      out.push(tr ? "transiente" : "recurrente");
    }
    return out;
  }

  // --- probabilidad ---

  function poissonAtLeast(k, lt) {           // P(N ≥ k) con N ~ Poisson(lt)
    if (k <= 0) return 1;
    return Math.max(0, 1 - M.poissonCDF(k - 1, lt));
  }
  // P(T_k < t) con T_k ~ Erlang(k, λ), por integración numérica de su densidad.
  // Se calcula aparte de la fórmula de Poisson justamente para poder mostrar
  // que las dos cuentas dan el mismo número (esa es la dualidad).
  function erlangCDF(t, k, lam) {
    if (t <= 0) return 0;
    var lg = M.lgamma ? M.lgamma(k) : 0;
    var f = function (x) {
      if (x < 0) return 0;
      // En x = 0 la densidad vale λ si k = 1 y 0 si k > 1. Devolver 0 en ambos
      // casos sesga la regla de Simpson (que evalúa el extremo) en (h/3)·λ.
      if (x === 0) return k > 1 ? 0 : lam;
      return Math.exp(k * Math.log(lam) + (k - 1) * Math.log(x) - lam * x - lg);
    };
    return Math.min(1, Math.max(0, M.integrate(f, 0, t, 800)));
  }

  // Histograma de frecuencias relativas sobre bordes comunes.
  function histogram(xs, edges) {
    var counts = new Array(edges.length - 1), i, j;
    for (i = 0; i < counts.length; i++) counts[i] = 0;
    for (i = 0; i < xs.length; i++) {
      var v = xs[i];
      if (v < edges[0] || v > edges[edges.length - 1]) continue;
      j = Math.floor((v - edges[0]) / (edges[1] - edges[0]));
      if (j < 0) j = 0;
      if (j >= counts.length) j = counts.length - 1;
      counts[j]++;
    }
    for (i = 0; i < counts.length; i++) counts[i] /= (xs.length || 1);
    return counts;
  }
  function meanOf(xs) { var s = 0, i; for (i = 0; i < xs.length; i++) s += xs[i]; return s / (xs.length || 1); }
  function varOf(xs) {
    var m = meanOf(xs), s = 0, i;
    for (i = 0; i < xs.length; i++) s += (xs[i] - m) * (xs[i] - m);
    return s / (xs.length || 1);
  }

  // ============================================================
  //  1 · Dualidad conteo ↔ tiempo  (proceso-de-poisson.md)
  // ============================================================

  A.registerFigure("u6-dualidad-conteo-tiempo-la-escalera-n-t-y-los-ins", function (host, api) {
    var W = 690, HA = 236, HB = 168, TMAX = 10;
    var pad = { l: 52, r: 24, t: 16, b: 30 };
    var ps = F.panels(host, 2, { w: W, heights: [HA, HB], gap: 4 });
    var svgA = ps[0], svgB = ps[1];

    var ctl = F.controls(host, [
      { k: "lam", label: "λ (eventos por unidad de tiempo)", min: 0.2, max: 2, step: 0.05, value: 0.8, dec: 2 },
      { k: "t", label: "instante t", min: 0.5, max: TMAX, step: 0.1, value: 4.5, dec: 1 },
      { k: "kk", label: "nivel k", min: 1, max: 10, step: 1, value: 3, dec: 0 }
    ], function () { redraw(); });

    F.buttons(host, [{
      label: "Nueva realización",
      title: "sortea otros tiempos entre eventos con la misma tasa λ",
      onClick: function () { api.state.seed = (api.state.seed || 1) + 1; redraw(); }
    }]);

    var out = F.readouts(host, [
      { k: "tk", tex: "T_k" },
      { k: "nt", tex: "N(t)" },
      { k: "pt", tex: "P(T_k<t)" },
      { k: "pn", tex: "P(N(t)\\ge k)" },
      { k: "eq", label: "los dos sucesos" }
    ]);

    F.legend(host, [
      { label: "escalera N(t)", color: F.series(1) },
      { label: "tramo con N(t) ≥ k", color: F.series(2) },
      { label: "instante t", color: F.series(3), dash: true },
      { label: "nivel k", color: F.series(4), dash: true }
    ]);

    var layA = F.el("g", null, svgA), layB = F.el("g", null, svgB);

    function eventTimes(lam, seed) {
      var u = F.rng(seed), ts = [], t = 0;
      while (ts.length < 80) {
        t += u.exp(lam);
        if (t > TMAX) break;
        ts.push(t);
      }
      return ts;
    }

    function redraw() {
      while (layA.firstChild) layA.removeChild(layA.firstChild);
      while (layB.firstChild) layB.removeChild(layB.firstChild);
      clearTex(svgA);

      var lam = ctl.get("lam"), t = ctl.get("t"), k = Math.round(ctl.get("kk"));
      var ts = eventTimes(lam, api.state.seed || 1);
      var n = ts.length;
      var Nt = 0, i;
      for (i = 0; i < n; i++) if (ts[i] <= t) Nt++;
      var Tk = k <= n ? ts[k - 1] : null;

      var sx = F.scale([0, TMAX], [pad.l, W - pad.r]);
      var yTop = Math.max(n, k) + 1;
      var sy = F.scale([0, yTop], [HA - pad.b, pad.t]);

      F.axes(layA, {
        sx: sx, sy: sy, xTicks: 6, yTicks: Math.min(8, yTop),
        xLabel: null, yLabel: "N(t)", y0: 0
      });

      // escalera: tramo horizontal a altura i entre T_i y T_{i+1}
      var bounds = [0].concat(ts, [TMAX]);
      for (i = 0; i < bounds.length - 1; i++) {
        var hi = i >= k;                         // ese tramo cumple N(t) ≥ k
        F.line(layA, [[sx(bounds[i]), sy(i)], [sx(bounds[i + 1]), sy(i)]], {
          stroke: hi ? F.series(2) : F.series(1), width: 2, serie: false
        });
        if (i < bounds.length - 2) {             // salto vertical en T_{i+1}
          F.line(layA, [[sx(bounds[i + 1]), sy(i)], [sx(bounds[i + 1]), sy(i + 1)]], {
            stroke: i + 1 >= k ? F.series(2) : F.series(1), width: 2, serie: false
          });
          F.marker(layA, sx(bounds[i + 1]), sy(i + 1), {
            r: 4.6, fill: i + 1 >= k ? F.series(2) : F.series(1), serie: false
          });
        }
      }

      F.hline(layA, sy(k), { x0: pad.l, x1: W - pad.r, stroke: F.series(4) });
      F.label(layA, W - pad.r - 4, sy(k) - 7, "nivel k = " + k, {
        size: 11.5, anchor: "end", keyColor: F.series(4)
      });
      F.vline(layA, sx(t), { y0: pad.t, y1: HA - pad.b, stroke: F.series(3) });
      F.label(layA, sx(t) + 7, pad.t + 11, "t = " + F.fmt(t, 1), {
        size: 11.5, keyColor: F.series(3)
      });
      // El rótulo se dibuja fuera del grupo .fig-marker: así el punto de la clave
      // de color (6 px) no se confunde con el marcador de dato (r ≥ 4.6).
      F.marker(layA, sx(t), sy(Nt), { r: 4.8, fill: F.series(3) });
      F.label(layA, sx(t), sy(Nt) - 15, "N(t) = " + Nt, {
        size: 11, anchor: "middle", keyColor: F.series(3)
      });
      if (Tk != null) {
        F.marker(layA, sx(Tk), sy(k), { r: 4.8, fill: F.series(2) });
        F.label(layA, sx(Tk), sy(k) - 15, "T" + sub(k), {
          size: 11, anchor: "middle", keyColor: F.series(2)
        });
      }

      // ---- panel inferior: línea de tiempo con los T_i y los τ_i ----
      var marks = ts.map(function (v, idx) {
        return { t: v, label: "T" + sub(idx + 1), color: idx + 1 === k ? F.series(2) : F.series(1) };
      });
      timeAxis(layB, { t0: 0, t1: TMAX, x0: pad.l, x1: W - pad.r, y: 62, ticks: 6, marks: marks });
      if (Tk != null) {
        F.el("rect", {
          x: sx(0), y: 86, width: Math.max(2, sx(Tk) - sx(0)), height: 5, rx: 2.5,
          fill: F.series(2)
        }, layB);
        F.text(layB, (sx(0) + sx(Tk)) / 2, 95, "tramo {T" + sub(k) + " < t}", {
          size: 11.5, anchor: "middle", baseline: "hanging", fill: F.color("text-2")
        });
      }
      F.vline(layB, sx(t), { y0: 24, y1: 104, stroke: F.series(3) });

      // corchetes de los tiempos entre eventos (los primeros, para no apiñar)
      // llaves de medida de los τᵢ: mobiliario de eje (.fig-axes), no dato
      var yb = 122, shown = Math.min(4, n);
      var braces = F.el("g", { "class": "fig-axes" }, layB);
      for (i = 0; i < shown; i++) {
        var a = i === 0 ? 0 : ts[i - 1], b = ts[i];
        F.el("path", {
          d: "M" + sx(a) + " " + (yb - 5) + "V" + yb + "H" + sx(b) + "V" + (yb - 5),
          fill: "none", stroke: F.color("plot-axis"), "stroke-width": 1
        }, braces);
        F.text(braces, (sx(a) + sx(b)) / 2, yb + 4, "τ" + sub(i + 1), {
          size: 11.5, anchor: "middle", baseline: "hanging", fill: F.color("text-3")
        });
      }
      F.text(layB, W - pad.r, 148, "tiempo t", {
        size: 11.5, anchor: "end", baseline: "hanging", fill: F.color("text-3")
      });

      // ---- lecturas ----
      var lt = lam * t;
      var pErl = erlangCDF(t, k, lam);
      var pPoi = poissonAtLeast(k, lt);
      out.set("tk", Tk == null ? "> " + TMAX : F.fmt(Tk, 3));
      out.set("nt", String(Nt));
      out.set("pt", F.fmt(pErl, 5));
      out.set("pn", F.fmt(pPoi, 5));
      var aTrue = Tk != null && Tk < t, bTrue = Nt >= k;
      out.set("eq", aTrue === bTrue
        ? (aTrue ? "ambos verdaderos" : "ambos falsos")
        : "INCONSISTENTE");
    }

    redraw();
  }, {
    title: "Dualidad conteo ↔ tiempo en el proceso de Poisson",
    page: "proceso-de-poisson", kind: "interactive", unidad: "6"
  });

  // ============================================================
  //  2 · El intervalo infinitesimal [t, t+h]  (proceso-de-poisson.md)
  // ============================================================

  A.registerFigure("u6-el-intervalo-infinitesimal-t-t-h-y-las-tres-rama", function (host, api) {
    var W = 690, H1 = 268, H2 = 118;
    var ps = F.panels(host, 2, { w: W, heights: [H1, H2], gap: 2 });
    var svg = ps[0], svg2 = ps[1];
    var g = F.el("g", null, svg), g2 = F.el("g", null, svg2);

    F.legend(host, [
      { label: "rama del término −λh", color: F.series(1) },
      { label: "rama del término +λh", color: F.series(2) },
      { label: "rama descartada (axioma 4)", color: F.color("text-3"), dash: true }
    ]);

    var xL = 148, xR = 486, yA = 96, yB = 168, yC = 236, r = 25;

    // eje del intervalo [t, t+h]
    var axI = F.el("g", { "class": "fig-axes" }, g);
    F.el("line", { x1: xL, y1: 42, x2: xR, y2: 42, stroke: F.color("plot-axis"), "stroke-width": 1 }, axI);
    [[xL, "t"], [xR, "t + h"]].forEach(function (p) {
      F.el("line", { x1: p[0], y1: 36, x2: p[0], y2: 48, stroke: F.color("plot-axis"), "stroke-width": 1 }, axI);
      F.text(axI, p[0], 30, p[1], { size: 12, anchor: "middle", fill: F.color("text-2") });
    });
    F.text(g, (xL + xR) / 2, 58, "intervalo de longitud h (corto)", {
      size: 11.5, anchor: "middle", baseline: "hanging", fill: F.color("text-3")
    });

    F.graph(g, {
      r: r,
      nodes: [
        { id: "a", x: xL, y: yA, label: "n", fill: F.color("surface-2"), stroke: F.series(1) },
        { id: "b", x: xL, y: yB, label: "n−1", fill: F.color("surface-2"), stroke: F.series(2) },
        { id: "c", x: xL, y: yC, label: "n−k", fill: F.color("surface-2"), stroke: F.color("text-3") },
        { id: "r", x: xR, y: yB, label: "n", fill: F.color("surface-2"), stroke: F.color("plot-axis"), r: 27 }
      ],
      edges: [
        { from: "a", to: "r", color: F.series(1), width: 2 },
        { from: "b", to: "r", color: F.series(2), width: 2 },
        { from: "c", to: "r", color: F.color("text-3"), width: 2, dash: "5 4" }
      ]
    });

    F.text(g, xL, yA - r - 12, "valor de N(t)", { size: 11.5, anchor: "middle", fill: F.color("text-3") });
    F.text(g, xR, yB - 42, "valor de N(t+h)", { size: 11.5, anchor: "middle", fill: F.color("text-3") });
    F.label(g, xL - r - 8, yA, "sin eventos", { size: 11, anchor: "end", baseline: "middle", keyColor: F.series(1) });
    F.label(g, xL - r - 8, yB, "un evento", { size: 11, anchor: "end", baseline: "middle", keyColor: F.series(2) });
    F.text(g, xL - r - 8, yC, "k > 1 eventos", { size: 11, anchor: "end", baseline: "middle", fill: F.color("text-3") });

    F.tex(host, "\\Delta N(h)=0:\\ 1-\\lambda h+o(h)", { svg: svg, x: 330, y: 104, anchor: "middle" });
    F.tex(host, "\\Delta N(h)=1:\\ \\lambda h+o(h)", { svg: svg, x: 330, y: 152, anchor: "middle" });
    F.tex(host, "\\Delta N(h)=k>1:\\ o(h)", { svg: svg, x: 330, y: 222, anchor: "middle" });
    F.text(g, 330, 238, "descartada por el axioma 4", {
      size: 11, anchor: "middle", baseline: "hanging", fill: F.color("text-3")
    });

    // panel del álgebra
    F.tex(host, "P_n(t+h)=(1-\\lambda h)\\,P_n(t)+\\lambda h\\,P_{n-1}(t)+o(h)",
      { svg: svg2, x: W / 2, y: 24, anchor: "middle" });
    F.el("path", {
      d: "M" + (W / 2) + " 40 v22", stroke: F.color("plot-axis"), "stroke-width": 2, fill: "none"
    }, g2);
    F.el("path", { d: "M" + (W / 2) + " 66 l-4 -7 h8 z", fill: F.color("plot-axis") }, g2);
    F.text(g2, W / 2 + 10, 51, "restar Pₙ(t) y hacer h → 0", {
      size: 11.5, baseline: "middle", fill: F.color("text-3")
    });
    F.tex(host, "\\dot P_n(t)=-\\lambda\\,P_n(t)+\\lambda\\,P_{n-1}(t)",
      { svg: svg2, x: W / 2, y: 92, anchor: "middle" });
  }, {
    title: "Las tres ramas sobre [t, t+h]",
    page: "proceso-de-poisson", kind: "static", unidad: "6"
  });

  // ============================================================
  //  3 · Refinar el reloj: Binomial → Poisson  (relacion-bernoulli-poisson.md)
  // ============================================================

  A.registerFigure("u6-refinar-el-reloj-de-binomial-t-t-t-a-poisson-t", function (host, api) {
    var W = 690, H1 = 164, H2 = 236;
    var pad = { l: 52, r: 24 };
    var ps = F.panels(host, 2, { w: W, heights: [H1, H2], gap: 4 });
    var svgA = ps[0], svgB = ps[1];

    var ctl = F.controls(host, [
      { k: "lam", label: "λ (tasa)", min: 0.2, max: 5, step: 0.05, value: 1.25, dec: 2 },
      { k: "t", label: "t (largo del intervalo)", min: 1, max: 10, step: 0.5, value: 4, dec: 1 },
      {
        k: "m", label: "ranuras m = t/Δt", min: 1, max: 2000, value: 6, log: true,
        fmt: function (v) { return String(Math.round(v)); }
      }
    ], function () { redraw(); });

    F.buttons(host, [{
      label: "Nueva realización",
      title: "sortea otro patrón de eventos con la misma tasa",
      onClick: function () { api.state.seed = (api.state.seed || 1) + 1; redraw(); }
    }]);

    var out = F.readouts(host, [
      { k: "dt", tex: "\\Delta t=t/m" },
      { k: "p", tex: "p=\\lambda\\,\\Delta t" },
      { k: "lt", tex: "m\\,p=\\lambda t" },
      { k: "occ", label: "eventos / ranuras ocupadas" },
      { k: "err", label: "máx |Bin − Poi|" },
      { k: "nota", label: "estado del acoplamiento" }
    ]);

    F.legend(host, [
      { label: "ranura ocupada", color: F.series(1), fill: true, alpha: 1 },
      { label: "evento en tiempo continuo", color: F.series(2) },
      { label: "Binomial(m, λt/m)", color: F.series(3), fill: true, alpha: 1 },
      { label: "Poisson(λt)", color: F.series(4) }
    ]);

    var layA = F.el("g", null, svgA), layB = F.el("g", null, svgB);

    function eventTimes(lam, t, seed) {
      var u = F.rng(seed), ts = [], x = 0;
      while (ts.length < 400) {
        x += u.exp(lam);
        if (x > t) break;
        ts.push(x);
      }
      return ts;
    }

    function redraw() {
      while (layA.firstChild) layA.removeChild(layA.firstChild);
      while (layB.firstChild) layB.removeChild(layB.firstChild);

      var lam = ctl.get("lam"), t = ctl.get("t"), m = Math.max(1, Math.round(ctl.get("m")));
      var dt = t / m, p = lam * dt, lt = lam * t;
      var ts = eventTimes(lam, t, api.state.seed || 1);
      var sx = F.scale([0, t], [pad.l, W - pad.r]);
      var slotPx = (sx(dt) - sx(0));

      // ranuras ocupadas (acoplamiento: una ranura se pinta si cayó ≥1 evento)
      var occupied = {}, i, nOcc = 0;
      for (i = 0; i < ts.length; i++) {
        var idx = Math.min(m - 1, Math.floor(ts[i] / dt));
        if (!occupied[idx]) { occupied[idx] = 1; nOcc++; }
      }

      // banda de ranuras
      var yTop = 30, yH = 24;
      F.el("rect", {
        x: sx(0), y: yTop, width: sx(t) - sx(0), height: yH, rx: 3,
        fill: F.color("surface-2"), stroke: F.color("border-2"), "stroke-width": 1
      }, layA);
      if (slotPx >= 2.6) {
        var sep = F.el("g", { "class": "fig-axes" }, layA);   // rejilla de ranuras
        for (i = 1; i < m; i++) {
          F.el("line", {
            x1: sx(i * dt), y1: yTop, x2: sx(i * dt), y2: yTop + yH,
            stroke: F.color("border-2"), "stroke-width": 1
          }, sep);
        }
      }
      for (var key in occupied) {
        if (!Object.prototype.hasOwnProperty.call(occupied, key)) continue;
        var j = +key;
        F.el("rect", {
          x: sx(j * dt), y: yTop + 1, width: Math.max(1.3, slotPx - 1), height: yH - 2,
          fill: F.series(1)
        }, layA);
      }
      F.text(layA, pad.l, yTop - 8, "ranuras de ancho Δt sobre [0, t]", {
        size: 11.5, fill: F.color("text-3")
      });

      timeAxis(layA, {
        t0: 0, t1: t, x0: pad.l, x1: W - pad.r, y: 104, ticks: 6, label: "tiempo",
        marks: ts.map(function (v) { return { t: v, color: F.series(2), h: 11 }; })
      });

      // el aviso va a las lecturas: dentro del lienzo solo quedan rótulos de marca
      var bad = p > 1, nota;
      if (bad) nota = "p = λΔt = " + F.fmt(p, 2) + " > 1: Δt demasiado grande";
      else if (nOcc < ts.length) nota = (ts.length - nOcc) + " evento(s) comparten ranura";
      else nota = "una ranura por evento";

      // ---- panel inferior: PMF binomial contra perfil de Poisson ----
      var nMax = Math.min(40, Math.max(8, Math.ceil(lt + 4 * Math.sqrt(lt))));
      var poi = [], bin = [], maxY = 0, err = 0, k2;
      for (k2 = 0; k2 <= nMax; k2++) {
        var pv = M.poissonPMF(k2, lt);
        poi.push([k2, pv]);
        if (pv > maxY) maxY = pv;
        if (!bad) {
          var bv = M.binomPMF(k2, m, p);
          bin.push([k2, bv]);
          if (bv > maxY) maxY = bv;
          if (Math.abs(bv - pv) > err) err = Math.abs(bv - pv);
        }
      }
      var bx = F.scale([-0.6, nMax + 0.6], [pad.l, W - pad.r]);
      var by = F.scale([0, maxY * 1.16], [H2 - 42, 16]);
      F.axes(layB, {
        sx: bx, sy: by, xTicks: Math.min(12, nMax + 1), yTicks: 4,
        xLabel: "n = cantidad de eventos en [0, t]", yLabel: "P(N = n)", y0: 0
      });
      // la barra nunca pasa de 24 px de ancho: el sobrante de la banda es aire
      var wBar = Math.min(0.72, 24 / Math.max(1e-9, bx(1) - bx(0)));
      if (!bad) {
        F.bars(layB, bin, bx, by, { fill: F.series(3), width: wBar, serie: "Binomial" });
      }
      F.line(layB, poi, { sx: bx, sy: by, stroke: F.series(4), width: 2, serie: "Poisson" });
      if (poi.length <= 22) {
        poi.forEach(function (q) {
          F.marker(layB, bx(q[0]), by(q[1]), { r: 4.6, fill: F.series(4), serie: false });
        });
      }

      out.set("dt", F.fmt(dt, 4));
      out.set("p", F.fmt(p, 4) + (bad ? "  (> 1)" : ""));
      out.set("lt", F.fmt(m * p, 4));
      out.set("occ", ts.length + " / " + nOcc);
      out.set("err", bad ? "—" : F.fmt(err, 5));
      out.set("nota", nota);
    }

    redraw();
  }, {
    title: "De Binomial(t/Δt, λΔt) a Poisson(λt)",
    page: "relacion-bernoulli-poisson", kind: "interactive", unidad: "6"
  });

  // ============================================================
  //  Cadenas de ejemplo (comparten las figuras 4 y 5)
  // ============================================================

  var CHAINS = [
    {
      v: "regular", label: "vendedor viajero (regular)",
      states: ["A", "B", "C"],
      P: [[0, 1, 0], [2 / 3, 0, 1 / 3], [2 / 3, 1 / 3, 0]],
      hasPi: true,
      note: "Cadena regular: p(n) converge a π y el límite es el mismo cualquiera sea p(0)."
    },
    {
      v: "periodica", label: "el bebé (periódica, período 3)",
      states: ["duerme", "come", "juega"],
      P: [[0, 1, 0], [0, 0, 1], [1, 0, 0]],
      hasPi: false, avg: true,
      note: "Cadena periódica: p(n) oscila para siempre y no hay π. El promedio temporal sí existe y vale 1/3 en cada estado."
    },
    {
      v: "absorbentes", label: "dos estados absorbentes",
      states: ["a₁", "t", "a₂"],
      P: [[1, 0, 0], [0.3, 0.4, 0.3], [0, 0, 1]],
      hasPi: false,
      note: "Con dos absorbentes p(n) converge, pero el límite depende de p(0): cada absorbente hereda una parte distinta según dónde arrancó la cadena."
    },
    {
      v: "transiente", label: "transiente + subcadena regular",
      states: ["t", "X", "Y"],
      P: [[0.5, 0.5, 0], [0, 0.5, 0.5], [0, 1, 0]],
      hasPi: true,
      note: "El estado transiente se abandona con probabilidad 1: su curva cae a 0 y el resto converge a la estacionaria de la subcadena regular."
    }
  ];
  function chainByKey(v) {
    for (var i = 0; i < CHAINS.length; i++) if (CHAINS[i].v === v) return CHAINS[i];
    return CHAINS[0];
  }
  // Identidad de cada estado por ranura fija de serie (1, 2, 3), en el orden en
  // que aparecen en la leyenda; nunca por --good/--warn/--bad.
  function stateColor(i) { return F.series(i + 1); }

  // ============================================================
  //  4 · Convergencia de p(n)  (cadenas-de-markov.md)
  // ============================================================

  A.registerFigure("u6-convergencia-de-p-n-cuando-hay-y-cuando-no", function (host, api) {
    var W = 690, H = 300;
    var pad = { l: 52, r: 26, t: 16, b: 46 };
    var svg = F.svg(host, { w: W, h: H, title: "Evolución de p(n) en cuatro cadenas de Markov" });

    var sel = F.select(host, {
      k: "chain", label: "cadena", value: "regular",
      options: CHAINS.map(function (c) { return { v: c.v, label: c.label }; })
    }, function () { api.state.ghost = null; redraw(); });

    var ctl = F.controls(host, [
      { k: "w1", label: "peso inicial s₁", min: 0, max: 1, step: 0.05, value: 1, dec: 2 },
      { k: "w2", label: "peso inicial s₂", min: 0, max: 1, step: 0.05, value: 0, dec: 2 },
      { k: "w3", label: "peso inicial s₃", min: 0, max: 1, step: 0.05, value: 0, dec: 2 },
      { k: "N", label: "horizonte n", min: 5, max: 80, step: 1, value: 30, dec: 0 }
    ], function () { redraw(); });

    F.buttons(host, [
      {
        label: "fijar como referencia",
        title: "guarda las curvas actuales en gris para comparar con otro p(0)",
        onClick: function () { api.state.ghost = lastCurves(); redraw(); }
      },
      { label: "borrar referencia", onClick: function () { api.state.ghost = null; redraw(); } }
    ]);

    var out = F.readouts(host, [
      { k: "p0", tex: "\\vec p(0)" },
      { k: "pn", tex: "\\vec p(n)" },
      { k: "pi", tex: "\\vec\\pi" },
      { k: "gap", label: "|p(n) − p(n−1)|∞" },
      { k: "nota", label: "qué muestra esta cadena" }
    ]);

    var layer = F.el("g", null, svg);
    var cache = null, leg = null;
    function lastCurves() { return cache ? { curves: cache.curves, states: cache.states } : null; }

    function redraw() {
      while (layer.firstChild) layer.removeChild(layer.firstChild);

      var ch = chainByKey(sel.get());
      var N = Math.round(ctl.get("N"));
      var p0 = normalizeVec([ctl.get("w1"), ctl.get("w2"), ctl.get("w3")]);
      var ns = ch.P.length, i, j;

      var curves = [];
      for (i = 0; i < ns; i++) curves.push([]);
      var p = p0.slice();
      for (j = 0; j <= N; j++) {
        for (i = 0; i < ns; i++) curves[i].push(p[i]);
        if (j < N) p = rowVecMul(p, ch.P);
      }
      cache = { curves: curves, states: ch.states };

      var sx = F.scale([0, N], [pad.l, W - pad.r]);
      var sy = F.scale([0, 1], [H - pad.b, pad.t]);
      F.axes(layer, {
        sx: sx, sy: sy, xTicks: 6, yTicks: 5, xLabel: "n (paso)", yLabel: "pⱼ(n)", y0: 0
      });

      // curvas de referencia guardadas
      var gh = api.state.ghost;
      if (gh && gh.curves) {
        for (i = 0; i < gh.curves.length; i++) {
          var gpts = [];
          for (j = 0; j < gh.curves[i].length && j <= N; j++) gpts.push([j, gh.curves[i][j]]);
          F.line(layer, gpts, {
            sx: sx, sy: sy, stroke: F.color("text-3"), width: 2, opacity: 0.38,
            serie: i === 0 ? "referencia guardada" : false
          });
        }
      }

      // π (si existe) y promedio temporal en la periódica
      var pi = null;
      if (ch.hasPi) {
        try { pi = M.stationary(ch.P); } catch (e) { pi = null; }
      }
      if (pi) {
        for (i = 0; i < ns; i++) {
          F.hline(layer, sy(pi[i]), { x0: pad.l, x1: W - pad.r, stroke: stateColor(i) });
        }
      } else if (ch.avg) {
        F.hline(layer, sy(1 / ns), { x0: pad.l, x1: W - pad.r, stroke: F.color("text-3") });
        F.text(layer, W - pad.r - 6, sy(1 / ns) - 6, "promedio temporal 1/" + ns, {
          size: 11, anchor: "end", fill: F.color("text-3")
        });
      }

      for (i = 0; i < ns; i++) {
        var pts = [];
        for (j = 0; j <= N; j++) pts.push([j, curves[i][j]]);
        F.line(layer, pts, {
          sx: sx, sy: sy, stroke: stateColor(i), width: 2,
          dash: i === 1 ? "7 4" : (i === 2 ? "2 4" : null),   // canal secundario
          serie: "p(" + ch.states[i] + ")"
        });
        // rótulo directo del extremo: un marcador por curva, no uno por punto
        F.marker(layer, sx(N), sy(curves[i][N]), { r: 4.6, fill: stateColor(i), serie: false });
      }

      // leyenda en .fig-legend; se rehace en cada redibujo porque los nombres de
      // los estados cambian con la cadena elegida
      var items = [];
      for (i = 0; i < ns; i++) items.push({ label: "p(" + ch.states[i] + ")", color: stateColor(i), dash: i > 0 });
      if (pi) items.push({ label: "π (punteada)", color: F.color("text-3"), dash: true });
      if (gh) items.push({ label: "referencia guardada", color: F.color("text-3") });
      if (leg && leg.el.parentNode) leg.el.parentNode.removeChild(leg.el);
      leg = F.legend(host, items);

      function vec(v) {
        return "(" + v.map(function (x) { return F.fmt(x, 3); }).join(", ") + ")";
      }
      var gap = 0;
      for (i = 0; i < ns; i++) gap = Math.max(gap, Math.abs(curves[i][N] - curves[i][Math.max(0, N - 1)]));
      out.set("p0", vec(p0));
      out.set("pn", vec(curves.map(function (c) { return c[N]; })));
      out.set("pi", pi ? vec(pi) : "no existe");
      out.set("gap", F.fmt(gap, 5));
      out.set("nota", ch.note);
    }

    redraw();
  }, {
    title: "Convergencia de p(n) en cuatro cadenas",
    page: "cadenas-de-markov", kind: "interactive", unidad: "6"
  });

  // ============================================================
  //  5 · Diagrama de estados  (cadenas-de-markov.md)
  // ============================================================

  A.registerFigure("u6-diagrama-de-estados-a-partir-de-la-matriz-p", function (host, api) {
    var W = 690, H = 348;
    var svg = F.svg(host, { w: W, h: H, title: "Diagrama de estados de una cadena de Markov y frecuencia de visitas" });

    var sel = F.select(host, {
      k: "chain", label: "cadena", value: "regular",
      options: CHAINS.map(function (c) { return { v: c.v, label: c.label }; })
    }, function () { resetWalk(); redraw(); });

    F.buttons(host, [
      { label: "dar un paso", onClick: function () { step(1); } },
      { label: "dar 100 pasos", onClick: function () { step(100); } },
      { label: "reiniciar", onClick: function () { resetWalk(); redraw(); } }
    ]);

    var out = F.readouts(host, [
      { k: "cur", label: "estado actual" },
      { k: "steps", label: "pasos dados" },
      { k: "freq", label: "frecuencia de visitas" },
      { k: "pi", tex: "\\vec\\pi" },
      { k: "rows", label: "filas que suman 1" }
    ]);

    function resetWalk() {
      var ch = chainByKey(sel.get());
      api.state.cur = 0;
      api.state.draws = 0;
      api.state.visits = ch.P.map(function () { return 0; });
      api.state.visits[0] = 1;
      api.state.steps = 0;
    }
    if (api.state.visits == null || api.state.visits.length !== chainByKey(sel.get()).P.length) resetWalk();

    function step(times) {
      var ch = chainByKey(sel.get());
      var u = F.rng(api.state.seed == null ? 4242 : api.state.seed), i, j;
      for (i = 0; i < (api.state.draws || 0); i++) u();          // reproducible: se descarta lo ya consumido
      for (i = 0; i < times; i++) {
        var x = u(), acc = 0, next = ch.P.length - 1;
        api.state.draws = (api.state.draws || 0) + 1;
        for (j = 0; j < ch.P.length; j++) {
          acc += ch.P[api.state.cur][j];
          if (x < acc) { next = j; break; }
        }
        api.state.cur = next;
        api.state.visits[next]++;
        api.state.steps++;
      }
      redraw();
    }

    var layer = F.el("g", null, svg);

    function redraw() {
      while (layer.firstChild) layer.removeChild(layer.firstChild);

      var ch = chainByKey(sel.get());
      var P = ch.P, ns = P.length, i, j;
      var kinds = classifyStates(P);
      var fillFor = {
        absorbente: F.color("bad-soft") || F.color("surface-2"),
        transiente: F.color("surface-3") || F.color("surface-2"),
        recurrente: F.color("good-soft") || F.color("surface-2")
      };
      var strokeFor = {
        absorbente: F.color("bad"), transiente: F.color("text-3"), recurrente: F.color("good")
      };

      // --- grafo (mitad izquierda) ---
      var cx = 176, cy = 168, R = 92, nodes = [], edges = [];
      for (i = 0; i < ns; i++) {
        var ang = (-90 + i * 360 / ns) * Math.PI / 180;
        nodes.push({
          id: String(i), x: cx + R * Math.cos(ang), y: cy + R * Math.sin(ang),
          label: ch.states[i], size: 11.5,
          fill: fillFor[kinds[i]], stroke: strokeFor[kinds[i]], strokeWidth: 1.8
        });
      }
      function lab(v) {
        if (Math.abs(v - 1) < 1e-9) return "1";
        if (Math.abs(v - 1 / 3) < 1e-9) return "1/3";
        if (Math.abs(v - 2 / 3) < 1e-9) return "2/3";
        return F.fmt(v, 2);
      }
      for (i = 0; i < ns; i++) for (j = 0; j < ns; j++) {
        if (P[i][j] <= 1e-12) continue;
        edges.push({
          from: String(i), to: String(j), label: lab(P[i][j]),
          curve: i === j ? 0 : 20,
          color: i === j ? strokeFor[kinds[i]] : F.color("plot-axis"),
          labelFill: F.color("text-2"),
          width: 2
        });
      }
      F.graph(layer, { nodes: nodes, edges: edges, r: 26 });

      // --- matriz P (mitad derecha, arriba) ---
      var mx = 396, my = 44, cw = 52, chh = 24;
      F.text(layer, mx, my - 24, "matriz de transición P", { size: 11.5, fill: F.color("text-3") });
      for (i = 0; i < ns; i++) {
        F.text(layer, mx - 8, my + i * chh + chh / 2, ch.states[i], {
          size: 11, anchor: "end", baseline: "middle", fill: F.color("text-3")
        });
        F.text(layer, mx + i * cw + cw / 2, my - 8, ch.states[i], {
          size: 11, anchor: "middle", fill: F.color("text-3")
        });
        for (j = 0; j < ns; j++) {
          F.el("rect", {
            x: mx + j * cw, y: my + i * chh, width: cw - 2, height: chh - 2, rx: 2,
            fill: P[i][j] > 1e-12 ? F.color("primary-soft") : F.color("surface-2"),
            stroke: F.color("border"), "stroke-width": 0.8
          }, layer);
          F.text(layer, mx + j * cw + (cw - 2) / 2, my + i * chh + (chh - 2) / 2, lab(P[i][j]), {
            size: 11, anchor: "middle", baseline: "middle", mono: true,
            fill: P[i][j] > 1e-12 ? F.color("text") : F.color("text-3")
          });
        }
      }

      // --- frecuencias de visita contra π (mitad derecha, abajo) ---
      var pi = null;
      if (ch.hasPi) { try { pi = M.stationary(P); } catch (e) { pi = null; } }
      var total = 0;
      for (i = 0; i < ns; i++) total += api.state.visits[i];
      var by0 = my + ns * chh + 42, bw = 24, bh = 76;
      F.text(layer, mx, by0 - 14, "frecuencia de visitas" + (pi ? " y π (marca)" : ""), {
        size: 11.5, fill: F.color("text-3")
      });
      var axF = F.el("g", { "class": "fig-axes" }, layer);   // línea de base de las barras
      F.el("line", {
        x1: mx - 4, y1: by0 + bh, x2: mx + ns * (bw + 30), y2: by0 + bh,
        stroke: F.color("plot-axis"), "stroke-width": 1
      }, axF);
      for (i = 0; i < ns; i++) {
        var fr = total ? api.state.visits[i] / total : 0;
        var x0 = mx + i * (bw + 30);
        F.el("rect", {
          x: x0, y: by0 + bh - fr * bh, width: bw, height: Math.max(0.5, fr * bh), rx: 2,
          fill: stateColor(i)
        }, layer);
        F.text(layer, x0 + bw / 2, by0 + bh + 5, ch.states[i], {
          size: 11, anchor: "middle", baseline: "hanging", fill: F.color("text-3")
        });
        var top = Math.max(fr, pi ? pi[i] : 0);
        F.text(layer, x0 + bw / 2, by0 + bh - top * bh - 7, F.fmt(fr, 3), {
          size: 11, anchor: "middle", mono: true, fill: F.color("text-2")
        });
        if (pi) {
          F.el("line", {
            x1: x0 - 3, y1: by0 + bh - pi[i] * bh, x2: x0 + bw + 3, y2: by0 + bh - pi[i] * bh,
            stroke: F.color("text"), "stroke-width": 2, "stroke-dasharray": "4 3"
          }, layer);
        }
      }

      inlineLegend(layer, 40, H - 22, [
        { label: "recurrente", color: strokeFor.recurrente },
        { label: "transiente", color: strokeFor.transiente },
        { label: "absorbente", color: strokeFor.absorbente }
      ], { size: 11 });

      var ok = true;
      for (i = 0; i < ns; i++) {
        var s = 0;
        for (j = 0; j < ns; j++) s += P[i][j];
        if (Math.abs(s - 1) > 1e-9) ok = false;
      }
      out.set("cur", ch.states[api.state.cur]);
      out.set("steps", String(api.state.steps || 0));
      out.set("freq", "(" + api.state.visits.map(function (v) {
        return F.fmt(total ? v / total : 0, 3);
      }).join(", ") + ")");
      out.set("pi", pi ? "(" + pi.map(function (x) { return F.fmt(x, 3); }).join(", ") + ")" : "no existe");
      out.set("rows", ok ? "sí (matriz estocástica)" : "NO");
    }

    // arranque: 200 pasos ya dados, para que la frecuencia de visitas se pueda
    // comparar con π desde el primer vistazo (el botón "reiniciar" vuelve a 0)
    if (!api.state.steps) step(200); else redraw();
  }, {
    title: "Diagrama de estados a partir de la matriz P",
    page: "cadenas-de-markov", kind: "interactive", unidad: "6"
  });

  // ============================================================
  //  6 · Forma canónica: los bloques I, 0, F, Q  (cadenas-de-markov.md)
  // ============================================================

  A.registerFigure("u6-forma-canonica-los-bloques-i-0-f-q", function (host, api) {
    var W = 690, H1 = 258, H2 = 132;
    var ps = F.panels(host, 2, { w: W, heights: [H1, H2], gap: 4 });
    var svg = ps[0], svg2 = ps[1];
    var g = F.el("g", null, svg), g2 = F.el("g", null, svg2);

    // Cadena de ejemplo en orden canónico (a₁, a₂, t₁, t₂): dos absorbentes y
    // dos transientes. Todos los números de la figura salen de esta matriz.
    var names = ["a₁", "a₂", "t₁", "t₂"];
    var Pc = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0.2, 0, 0.3, 0.5],
      [0, 0.4, 0.4, 0.2]
    ];
    var perm = [2, 0, 3, 1];                     // orden "como vino el enunciado"
    var Po = perm.map(function (i) { return perm.map(function (j) { return Pc[i][j]; }); });
    var namesO = perm.map(function (i) { return names[i]; });

    var Q = [[Pc[2][2], Pc[2][3]], [Pc[3][2], Pc[3][3]]];
    var Fb = [[Pc[2][0], Pc[2][1]], [Pc[3][0], Pc[3][1]]];
    var I2 = M.eye(2);
    var IQ = [[I2[0][0] - Q[0][0], I2[0][1] - Q[0][1]], [I2[1][0] - Q[1][0], I2[1][1] - Q[1][1]]];
    var Mm = M.matInverse(IQ);
    var G = M.matMul(Mm, Fb);

    var CW = 46, CH = 26;
    function drawMatrix(x0, y0, P, labs, blockOf, title) {
      F.text(g, x0 + 2 * CW, y0 - 26, title, { size: 12, anchor: "middle", fill: F.color("text-2") });
      var i, j;
      for (i = 0; i < 4; i++) {
        F.text(g, x0 - 7, y0 + i * CH + CH / 2, labs[i], {
          size: 11, anchor: "end", baseline: "middle", fill: F.color("text-3")
        });
        F.text(g, x0 + i * CW + CW / 2, y0 - 9, labs[i], {
          size: 11, anchor: "middle", fill: F.color("text-3")
        });
        for (j = 0; j < 4; j++) {
          var bk = blockOf ? blockOf(i, j) : null;
          F.el("rect", {
            x: x0 + j * CW, y: y0 + i * CH, width: CW - 2, height: CH - 2, rx: 2,
            fill: bk ? bk.fill : F.color("surface-2"),
            stroke: bk ? bk.stroke : F.color("border"), "stroke-width": bk ? 1 : 0.8
          }, g);
          F.text(g, x0 + j * CW + (CW - 2) / 2, y0 + i * CH + (CH - 2) / 2, F.fmt(P[i][j], 1), {
            size: 11, anchor: "middle", baseline: "middle", mono: true,
            fill: P[i][j] > 0 ? F.color("text") : F.color("text-3")
          });
        }
      }
    }

    // Los tokens *-soft del tema oscuro son cuatro tonos casi idénticos, así que
    // los bloques se tiñen con los acentos fuertes rebajados con A.withAlpha:
    // se distinguen igual de bien en pergamino, laurel y claustro.
    function tint(tok, a) {
      return tintOf(F.color(tok), a) || F.color("surface-2");
    }
    var BLOCKS = {
      I: { fill: tint("s1", 0.26), stroke: tint("s1", 0.8), name: "I", desc: "absorbente → sí mismo" },
      Z: { fill: tint("text-3", 0.16), stroke: tint("text-3", 0.6), name: "0", desc: "absorbente → transiente" },
      Fm: { fill: tint("s2", 0.28), stroke: tint("s2", 0.8), name: "F", desc: "transiente → absorbente" },
      Q: { fill: tint("s3", 0.24), stroke: tint("s3", 0.8), name: "Q", desc: "transiente → transiente" }
    };
    function blockOf(i, j) {
      if (i < 2) return j < 2 ? BLOCKS.I : BLOCKS.Z;
      return j < 2 ? BLOCKS.Fm : BLOCKS.Q;
    }

    drawMatrix(64, 62, Po, namesO, null, "P con los estados como vienen");
    drawMatrix(430, 62, Pc, names, blockOf, "P reordenada: forma canónica");

    F.el("path", {
      d: "M296 114 h56", stroke: F.color("plot-axis"), "stroke-width": 2, fill: "none"
    }, g);
    F.el("path", { d: "M356 114 l-8 -4.5 v9 z", fill: F.color("plot-axis") }, g);
    F.text(g, 324, 104, "reordenar", { size: 11, anchor: "middle", fill: F.color("text-3") });
    F.text(g, 324, 130, "absorbentes primero", { size: 11, anchor: "middle", baseline: "hanging", fill: F.color("text-3") });

    ["I", "Z", "Fm", "Q"].forEach(function (kk, idx) {
      var b = BLOCKS[kk];
      var lx = 64 + (idx % 2) * 320, ly = 186 + Math.floor(idx / 2) * 18;
      F.el("rect", { x: lx, y: ly - 5.5, width: 15, height: 11, rx: 2, fill: b.fill, stroke: b.stroke, "stroke-width": 1 }, g);
      F.text(g, lx + 21, ly, b.name + " — " + b.desc, { size: 11, baseline: "middle", fill: F.color("text-2") });
    });
    // panel de fórmulas
    F.tex(host, "\\mathbb{M}=(\\mathbb{I}-\\mathbb{Q})^{-1}", { svg: svg2, x: 96, y: 26, anchor: "middle" });
    F.text(g2, 96, 48, "tiempo esperado en cada transiente", { size: 11, anchor: "middle", baseline: "hanging", fill: F.color("text-3") });
    F.tex(host, "\\textstyle\\sum_j \\mathbb{M}(i,j)", { svg: svg2, x: 344, y: 26, anchor: "middle" });
    F.text(g2, 344, 48, "tiempo hasta la absorción desde i", { size: 11, anchor: "middle", baseline: "hanging", fill: F.color("text-3") });
    F.tex(host, "\\mathbb{G}=\\mathbb{M}\\,\\mathbb{F}", { svg: svg2, x: 588, y: 26, anchor: "middle" });
    F.text(g2, 588, 48, "P(absorbido por j | parte de i)", { size: 11, anchor: "middle", baseline: "hanging", fill: F.color("text-3") });

    // Las sumas por fila y las probabilidades de absorción se leen abajo, en las
    // lecturas: dentro del lienzo quedan solo los valores de las filas.
    var rows = [
      "M(t₁,·) = (" + F.fmt(Mm[0][0], 3) + ", " + F.fmt(Mm[0][1], 3) + ")",
      "M(t₂,·) = (" + F.fmt(Mm[1][0], 3) + ", " + F.fmt(Mm[1][1], 3) + ")",
      "G(t₁,·) = (" + F.fmt(G[0][0], 3) + ", " + F.fmt(G[0][1], 3) + ")",
      "G(t₂,·) = (" + F.fmt(G[1][0], 3) + ", " + F.fmt(G[1][1], 3) + ")"
    ];
    rows.forEach(function (s, i) {
      F.text(g2, 64 + (i % 2) * 200, 78 + Math.floor(i / 2) * 17, s, {
        size: 11, mono: true, baseline: "hanging", fill: F.color("text-2")
      });
    });

    F.readouts(host, [
      { k: "det", label: "det(I − Q)", value: F.fmt(IQ[0][0] * IQ[1][1] - IQ[0][1] * IQ[1][0], 4) },
      { k: "et1", label: "E[pasos] desde t₁", value: F.fmt(Mm[0][0] + Mm[0][1], 4) },
      { k: "et2", label: "E[pasos] desde t₂", value: F.fmt(Mm[1][0] + Mm[1][1], 4) },
      { k: "g", label: "P(absorbido en a₁ | t₁)", value: F.fmt(G[0][0], 4) }
    ]);
  }, {
    title: "Forma canónica: los bloques I, 0, F y Q",
    page: "cadenas-de-markov", kind: "static", unidad: "6"
  });

  // ============================================================
  //  7 · Trayectorias de la caminata y el abanico ±√n  (caminata-aleatoria.md)
  // ============================================================

  A.registerFigure("u6-trayectorias-de-la-caminata-y-el-abanico-n", function (host, api) {
    var W = 690, H = 348;
    var pad = { l: 54, r: 20, t: 16, b: 44 };
    var svg = F.svg(host, { w: W, h: H, title: "Trayectorias de la caminata aleatoria con la media y la banda de dispersión" });

    var ctl = F.controls(host, [
      { k: "p", label: "p (paso +1)", min: 0.05, max: 0.95, step: 0.01, value: 0.5, dec: 2 },
      { k: "n", label: "n (pasos)", min: 20, max: 200, step: 5, value: 100, dec: 0 },
      { k: "R", label: "trayectorias", min: 1, max: 30, step: 1, value: 12, dec: 0 },
      { k: "kk", label: "ancho de la banda (k desvíos)", min: 1, max: 3, step: 0.5, value: 2, dec: 1 }
    ], function () { redraw(); });

    var tgB = F.toggle(host, { k: "band", label: "banda ±k·√Var", value: true }, function () { redraw(); });
    var tgM = F.toggle(host, { k: "mean", label: "recta de la media", value: true }, function () { redraw(); });

    F.buttons(host, [{
      label: "resortear", onClick: function () { api.state.seed = (api.state.seed || 1) + 1; api.state.sel = -1; redraw(); }
    }]);

    var out = F.readouts(host, [
      { k: "e", tex: "\\E[X_n]=n(2p-1)" },
      { k: "sd", tex: "\\sqrt{\\Var[X_n]}=2\\sqrt{np(1-p)}" },
      { k: "in", label: "trayectorias dentro de la banda en n" },
      { k: "sel", label: "trayectoria elegida (Xₙ)" }
    ]);

    F.legend(host, [
      { label: "trayectorias simuladas", color: F.series(1) },
      { label: "trayectoria seleccionada", color: F.series(2) },
      { label: "media E[Xₙ]", color: F.series(3), dash: true },
      { label: "banda ±k desvíos", color: F.series(4), fill: true }
    ]);

    var layer = F.el("g", null, svg);

    function redraw() {
      while (layer.firstChild) layer.removeChild(layer.firstChild);

      var p = ctl.get("p"), n = Math.round(ctl.get("n")), R = Math.round(ctl.get("R"));
      var kk = ctl.get("kk");
      var u = F.rng(api.state.seed || 1);
      var paths = [], i, j, x, lo = 0, hi = 0;
      for (i = 0; i < R; i++) {
        var tr = [0];
        x = 0;
        for (j = 1; j <= n; j++) { x += (u() < p ? 1 : -1); tr.push(x); if (x < lo) lo = x; if (x > hi) hi = x; }
        paths.push(tr);
      }
      var muN = n * (2 * p - 1), sdN = 2 * Math.sqrt(n * p * (1 - p));
      lo = Math.min(lo, muN - kk * sdN);
      hi = Math.max(hi, muN + kk * sdN);
      var m2 = Math.max(3, (hi - lo) * 0.08);

      var sx = F.scale([0, n], [pad.l, W - pad.r]);
      var sy = F.scale([lo - m2, hi + m2], [H - pad.b, pad.t]);
      F.axes(layer, {
        sx: sx, sy: sy, xTicks: 6, yTicks: 6, xLabel: "n (pasos)", yLabel: "Xₙ", y0: lo - m2
      });
      F.hline(layer, sy(0), { x0: pad.l, x1: W - pad.r, stroke: F.color("plot-axis"), dash: "2 5", width: 1 });

      // banda ±k·√Var, con Var[X_j] = 4·j·p·(1−p)
      if (tgB.get()) {
        var up = [], dn = [];
        for (j = 0; j <= n; j++) {
          var mu = j * (2 * p - 1), s = 2 * Math.sqrt(j * p * (1 - p));
          up.push([sx(j), sy(mu + kk * s)]);
          dn.push([sx(j), sy(mu - kk * s)]);
        }
        F.path(layer, F.ptsToPath(up.concat(dn.slice().reverse()), true), {
          fill: F.series(4), opacity: 0.10
        });
        F.line(layer, up, { stroke: F.series(4), width: 2, dash: "5 4", serie: "banda ±k desvíos" });
        F.line(layer, dn, { stroke: F.series(4), width: 2, dash: "5 4", serie: false });
      }
      if (tgM.get()) {
        F.line(layer, [[sx(0), sy(0)], [sx(n), sy(muN)]], {
          stroke: F.series(3), width: 2, dash: "7 4", serie: "media E[Xₙ]"
        });
      }

      var sel = api.state.sel == null ? -1 : api.state.sel;
      for (i = 0; i < R; i++) {
        var pts = [];
        for (j = 0; j <= n; j++) pts.push([sx(j), sy(paths[i][j])]);
        var isSel = i === sel;
        var el2 = F.line(layer, pts, {
          stroke: isSel ? F.series(2) : F.series(1), width: 2,
          opacity: isSel ? 1 : 0.42, serie: isSel ? "trayectoria elegida" : false
        });
        el2.style.cursor = "pointer";
        el2.setAttribute("stroke-linecap", "round");
        (function (idx) {
          el2.addEventListener("click", function () {
            api.state.sel = (api.state.sel === idx ? -1 : idx);
            redraw();
          });
        })(i);
      }

      var inside = 0;
      for (i = 0; i < R; i++) if (Math.abs(paths[i][n] - muN) <= kk * sdN) inside++;
      out.set("e", F.fmt(muN, 2));
      out.set("sd", F.fmt(sdN, 3));
      out.set("in", inside + " / " + R);
      out.set("sel", sel >= 0 && sel < R ? String(paths[sel][n]) : "— (haga clic en una)");
    }

    redraw();
  }, {
    title: "Trayectorias de la caminata y el abanico ±√n",
    page: "caminata-aleatoria", kind: "interactive", unidad: "6"
  });

  // ============================================================
  //  8 · Caminata ±1 contra caminata gaussiana  (caminata-aleatoria.md)
  // ============================================================

  A.registerFigure("u6-caminata-1-contra-caminata-gaussiana-mismo-momen", function (host, api) {
    var W = 690, H = 330;
    var pad = { l: 56, r: 24, t: 18, b: 46 };
    var svg = F.svg(host, { w: W, h: H, title: "PMF de la caminata simétrica contra la densidad de la caminata gaussiana" });

    var ctl = F.controls(host, [
      { k: "n", label: "n (pasos)", min: 2, max: 120, step: 1, value: 16, dec: 0 }
    ], function () { redraw(); });
    var tgZ = F.toggle(host, { k: "z", label: "normalizar a Xₙ/√n", value: false }, function () { redraw(); });
    var tgD = F.toggle(host, { k: "dens", label: "mostrar la densidad gaussiana", value: true }, function () { redraw(); });

    var out = F.readouts(host, [
      { k: "sup", label: "puntos del recorrido" },
      { k: "max", label: "masa máxima" },
      { k: "sum", label: "suma de las masas" },
      { k: "pe", tex: "P(|X_n|\\le\\sqrt n)" },
      { k: "pn", label: "aproximación normal" }
    ]);

    var layer = F.el("g", null, svg), leg = null;

    function redraw() {
      while (layer.firstChild) layer.removeChild(layer.firstChild);

      var n = Math.round(ctl.get("n")), z = tgZ.get(), dens = tgD.get();
      var sdn = Math.sqrt(n);
      var lim = Math.min(n, Math.ceil(4 * sdn)) + 1;
      var scaleX = z ? 1 / sdn : 1;
      var stepW = 2 * scaleX;                            // el peine solo carga una paridad

      // masas exactas: P(X_n = x) = Binomial((n+x)/2 ; n, 1/2)
      var pts = [], maxY = 0, sum = 0, pExact = 0, x, mass, h;
      for (x = -n; x <= n; x += 2) {
        h = (n + x) / 2;
        mass = M.binomPMF(h, n, 0.5);
        sum += mass;
        if (Math.abs(x) <= sdn + 1e-9) pExact += mass;
        if (Math.abs(x) > lim) continue;
        pts.push([x * scaleX, mass]);
        if (mass > maxY) maxY = mass;
      }

      var xlim = lim * scaleX;
      var sx = F.scale([-xlim, xlim], [pad.l, W - pad.r]);
      var sy = F.scale([0, maxY * 1.2], [H - pad.b, pad.t]);
      F.axes(layer, {
        sx: sx, sy: sy, xTicks: 7, yTicks: 4, y0: 0,
        xLabel: z ? "Xₙ/√n" : "Xₙ", yLabel: "masa / (densidad × paso)"
      });

      // la barra nunca pasa de 24 px de ancho (el tope se aplica en unidades de dato)
      var wBar = Math.min(stepW * 0.42, 24 / Math.max(1e-9, sx(1) - sx(0)));
      F.bars(layer, pts, sx, sy, { fill: F.series(1), width: wBar, serie: "P(Xₙ = x)" });

      var items = [{ label: "P(Xₙ = x): peine discreto", color: F.series(1), fill: true, alpha: 1 }];
      if (dens) {
        var f = z
          ? function (v) { return stepW * M.normPDF(v, 0, 1); }
          : function (v) { return stepW * M.normPDF(v, 0, sdn); };
        F.curve(layer, f, sx, sy, { stroke: F.series(2), width: 2, n: 260, serie: "densidad normal" });
        items.push({ label: z ? "densidad N(0,1) × 2/√n" : "densidad N(0,n) × 2", color: F.series(2) });
      }
      // la leyenda se rehace en cada redibujo y desaparece si queda una sola serie
      if (leg && leg.el.parentNode) leg.el.parentNode.removeChild(leg.el);
      leg = items.length >= 2 ? F.legend(host, items) : null;

      var pNorm = M.normCDF(sdn, 0, sdn) - M.normCDF(-sdn, 0, sdn);
      out.set("sup", (n + 1) + " (espaciados 2)");
      out.set("max", F.fmt(maxY, 5));
      out.set("sum", F.fmt(sum, 6));
      out.set("pe", F.fmt(pExact, 5));
      out.set("pn", F.fmt(pNorm, 5));
    }

    redraw();
  }, {
    title: "Caminata ±1 contra caminata gaussiana",
    page: "caminata-aleatoria", kind: "interactive", unidad: "6"
  });

  // ============================================================
  //  9 · Anatomía de una realización de Bernoulli  (proceso-de-bernoulli.md)
  // ============================================================

  A.registerFigure("u6-anatomia-de-una-realizacion-de-bernoulli", function (host, api) {
    var W = 690, H1 = 128, H2 = 92, H3 = 172;
    var K = 14, p = 0.35;
    var pad = { l: 54, r: 26 };
    var ps = F.panels(host, 3, { w: W, heights: [H1, H2, H3], gap: 2 });
    var gA = F.el("g", null, ps[0]), gB = F.el("g", null, ps[1]), gC = F.el("g", null, ps[2]);

    // realización fija: se busca la primera semilla con al menos 3 éxitos
    var seed = 11, ys = null, i;
    for (var attempt = 0; attempt < 200; attempt++) {
      var u = F.rng(seed), v = [], c = 0;
      for (i = 1; i <= K; i++) { var s = u() < p ? 1 : 0; v.push(s); c += s; }
      if (c >= 3) { ys = v; break; }
      seed++;
    }
    if (!ys) ys = [0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0];

    var N = [0], succ = [];
    for (i = 0; i < K; i++) { N.push(N[i] + ys[i]); if (ys[i]) succ.push(i + 1); }

    var sx = F.scale([0, K], [pad.l, W - pad.r]);

    // --- panel 1: escalera del conteo ---
    var syA = F.scale([0, N[K] + 2], [H1 - 26, 16]);
    F.axes(gA, { sx: sx, sy: syA, xTicks: false, yTicks: Math.min(6, N[K] + 3), yLabel: "N(k)", y0: 0, gridX: false });
    for (i = 0; i < K; i++) {
      F.line(gA, [[sx(i), syA(N[i])], [sx(i + 1), syA(N[i])]], { stroke: F.series(1), width: 2 });
      if (N[i + 1] > N[i]) {
        F.line(gA, [[sx(i + 1), syA(N[i])], [sx(i + 1), syA(N[i + 1])]], {
          stroke: F.series(1), width: 2, serie: false
        });
        F.marker(gA, sx(i + 1), syA(N[i + 1]), { r: 4.6, fill: F.series(1), serie: false });
      }
    }
    F.text(gA, pad.l, 8, "conteo acumulado N(k)", {
      size: 11.5, baseline: "hanging", fill: F.color("text-3")
    });

    // --- panel 2: la fila de ranuras ---
    var yS = 26, hS = 30;
    for (i = 0; i < K; i++) {
      var xa = sx(i), xb = sx(i + 1);
      F.el("rect", {
        x: xa + 1.5, y: yS, width: xb - xa - 3, height: hS, rx: 3,
        fill: ys[i] ? tintOf(F.series(2), 0.30) : F.color("surface-2"),
        stroke: ys[i] ? F.series(2) : F.color("border-2"), "stroke-width": 1
      }, gB);
      F.text(gB, (xa + xb) / 2, yS + hS / 2, ys[i] ? "1" : "0", {
        size: 12.5, anchor: "middle", baseline: "middle", mono: true, weight: 600,
        fill: ys[i] ? F.color("text") : F.color("text-3")
      });
      F.text(gB, (xa + xb) / 2, yS + hS + 5, String(i + 1), {
        size: 11, anchor: "middle", baseline: "hanging", mono: true, fill: F.color("text-3")
      });
    }
    F.text(gB, pad.l, 8, "ensayos independientes", {
      size: 11.5, baseline: "hanging", fill: F.color("text-3")
    });
    F.text(gB, W - pad.r, 8, "p = " + p, {
      size: 11.5, anchor: "end", baseline: "hanging", mono: true, fill: F.color("text-2")
    });

    // --- panel 3: los T_k y los τ_i ---
    var marks = succ.slice(0, 6).map(function (v, idx) {
      return { t: v, label: "T" + sub(idx + 1), color: F.series(3) };
    });
    timeAxis(gC, { t0: 0, t1: K, x0: pad.l, x1: W - pad.r, y: 70, ticks: 7, marks: marks });
    // llaves de medida de las esperas τᵢ: mobiliario de eje (.fig-axes), no dato
    var braces = F.el("g", { "class": "fig-axes" }, gC);
    var yb = 106, shown = Math.min(3, succ.length);
    for (i = 0; i < shown; i++) {
      var a = i === 0 ? 0 : succ[i - 1], b = succ[i];
      F.el("path", {
        d: "M" + sx(a) + " " + (yb - 6) + "V" + yb + "H" + sx(b) + "V" + (yb - 6),
        fill: "none", stroke: F.color("plot-axis"), "stroke-width": 1
      }, braces);
      F.text(braces, (sx(a) + sx(b)) / 2, yb + 4, "τ" + sub(i + 1), {
        size: 11.5, anchor: "middle", baseline: "hanging", mono: true, fill: F.color("text-3")
      });
    }
    F.text(gC, pad.l, 8, "instantes Tk y esperas τᵢ", {
      size: 11.5, baseline: "hanging", fill: F.color("text-3")
    });
    F.text(gC, pad.l, H3 - 12, "k (número de ensayo)", {
      size: 11.5, fill: F.color("text-3")
    });

    F.tex(host, "N(k)\\sim\\mathrm{Binomial}(k,p)", { svg: ps[0], x: W - 148, y: 17, anchor: "middle" });
    F.tex(host, "\\tau_i\\sim\\mathrm{Geom\\acute{e}trica}(p)", { svg: ps[2], x: W - 152, y: 136, anchor: "middle" });
    F.tex(host, "T_k=\\tau_1+\\cdots+\\tau_k\\sim\\mathrm{BN}(k,p)", { svg: ps[2], x: W - 152, y: 156, anchor: "middle" });

    F.readouts(host, [
      { k: "n", label: "N(" + K + ")", value: String(N[K]) },
      { k: "t", label: "T₁, T₂, T₃", value: succ.slice(0, 3).join(", ") || "—" },
      { k: "tau", label: "τ₁, τ₂, τ₃", value: succ.slice(0, 3).map(function (v, idx) {
        return v - (idx === 0 ? 0 : succ[idx - 1]);
      }).join(", ") || "—" },
      { k: "rec", label: "recorrido de N(k)", value: "{0, 1, …, k}" }
    ]);

    F.legend(host, [
      { label: "conteo N(k)", color: F.series(1) },
      { label: "ranura con éxito", color: F.series(2), fill: true, alpha: 0.3 },
      { label: "instantes Tk", color: F.series(3) },
      { label: "esperas τᵢ", color: F.color("text-3") }
    ]);
  }, {
    title: "Anatomía de una realización de Bernoulli",
    page: "proceso-de-bernoulli", kind: "static", unidad: "6"
  });

  // ============================================================
  //  10 · Dos ventanas sobre la misma trayectoria  (procesos-estocasticos.md)
  // ============================================================

  A.registerFigure("u6-que-mira-cada-propiedad-dos-ventanas-sobre-la-mi", function (host, api) {
    var W = 690, HA = 200, HB = 196, NT = 120, REPS = 800;
    var pad = { l: 54, r: 22, t: 16, b: 30 };
    var ps = F.panels(host, 2, { w: W, heights: [HA, HB], gap: 4 });
    var svgA = ps[0], svgB = ps[1];

    var sel = F.select(host, {
      k: "proc", label: "proceso", value: "pm1",
      options: [
        { v: "pm1", label: "caminata ±1 (p = 1/2)" },
        { v: "gauss", label: "caminata gaussiana" },
        { v: "bern", label: "conteo de Bernoulli (p = 0.4)" }
      ]
    }, function () { memo = {}; redraw(); });

    var ctl = F.controls(host, [
      { k: "a1", label: "inicio ventana 1", min: 0, max: NT - 5, step: 1, value: 10, dec: 0 },
      { k: "L1", label: "ancho ventana 1", min: 2, max: 50, step: 1, value: 24, dec: 0 },
      { k: "a2", label: "inicio ventana 2", min: 0, max: NT - 5, step: 1, value: 70, dec: 0 },
      { k: "L2", label: "ancho ventana 2", min: 2, max: 50, step: 1, value: 24, dec: 0 }
    ], function () { redraw(); });

    F.buttons(host, [{
      label: "Nueva realización",
      title: "resortea la trayectoria dibujada (los histogramas usan " + REPS + " realizaciones)",
      onClick: function () { api.state.seed = (api.state.seed || 1) + 1; redraw(); }
    }]);

    var out = F.readouts(host, [
      { k: "inc1", label: "ventana 1: media / var" },
      { k: "inc2", label: "ventana 2: media / var" },
      { k: "teo", label: "fórmulas teóricas" },
      { k: "same", label: "mismos anchos" },
      { k: "disj", label: "ventanas disjuntas" }
    ]);

    F.legend(host, [
      { label: "trayectoria X(t)", color: F.series(1) },
      { label: "ventana 1", color: F.series(2), fill: true },
      { label: "ventana 2", color: F.series(3), fill: true }
    ]);

    var layA = F.el("g", null, svgA), layB = F.el("g", null, svgB);
    // capa de arrastre persistente: no se borra en el redibujo, así el puntero
    // no pierde el elemento capturado mientras se mueve una ventana
    var hit = F.el("rect", {
      x: pad.l, y: pad.t, width: W - pad.r - pad.l, height: HA - pad.b - pad.t,
      fill: "transparent"
    }, svgA);
    hit.style.pointerEvents = "all";
    var memo = {};

    function stepOf(proc, u) {
      if (proc === "gauss") return u.normal(0, 1);
      if (proc === "bern") return u() < 0.4 ? 1 : 0;
      return u() < 0.5 ? 1 : -1;
    }
    function theory(proc) {
      if (proc === "gauss") return { m: 0, v: 1 };
      if (proc === "bern") return { m: 0.4, v: 0.24 };
      return { m: 0, v: 1 };
    }
    // Muestra de incrementos sobre una ventana de largo L. Depende SOLO de L
    // (esa es la estacionariedad de incrementos), por eso se memoriza por largo.
    function sample(proc, L, salt) {
      var key = proc + ":" + L + ":" + salt;
      if (memo[key]) return memo[key];
      var u = F.rng(90210 + L * 7 + salt * 100003), res = [], r, j;
      for (r = 0; r < REPS; r++) {
        var s = 0;
        for (j = 0; j < L; j++) s += stepOf(proc, u);
        res.push(s);
      }
      memo[key] = res;
      return res;
    }
    function edgesFor(proc, data, nb) {
      var lo = Infinity, hi = -Infinity, i;
      for (i = 0; i < data.length; i++) { if (data[i] < lo) lo = data[i]; if (data[i] > hi) hi = data[i]; }
      if (!(hi > lo)) { hi = lo + 1; }
      var pad2 = (hi - lo) * 0.04 + 0.5;
      lo -= pad2; hi += pad2;
      var e = [], w2 = (hi - lo) / nb;
      for (i = 0; i <= nb; i++) e.push(lo + i * w2);
      return e;
    }
    function drawHist(g, x0, x1, y0, y1, sets, title, xLabel) {
      var pooled = [], i;
      for (i = 0; i < sets.length; i++) pooled = pooled.concat(sets[i].data);
      var edges = edgesFor(null, pooled, 22);
      var hs = sets.map(function (s) { return histogram(s.data, edges); });
      var maxY = 0;
      hs.forEach(function (h) { h.forEach(function (v) { if (v > maxY) maxY = v; }); });
      var hx = F.scale([edges[0], edges[edges.length - 1]], [x0, x1]);
      var hy = F.scale([0, maxY * 1.18 || 1], [y1, y0]);
      F.axes(g, {
        sx: hx, sy: hy, xTicks: 5, yTicks: 3, y0: 0, grid: true,
        xLabel: xLabel, yLabel: "frec. rel."
      });
      hs.forEach(function (h, si) {
        var pts = [], j;
        for (j = 0; j < h.length; j++) {
          pts.push([hx(edges[j]), hy(h[j])]);
          pts.push([hx(edges[j + 1]), hy(h[j])]);
        }
        F.path(g, F.ptsToPath([[hx(edges[0]), hy(0)]].concat(pts, [[hx(edges[edges.length - 1]), hy(0)]]), true), {
          fill: sets[si].color, opacity: 0.10
        });
        F.line(g, pts, {
          stroke: sets[si].color, width: 2,
          dash: si === 1 ? "6 4" : null,          // canal secundario del segundo perfil
          serie: sets[si].label || false
        });
      });
      F.text(g, (x0 + x1) / 2, y0 - 12, title, {
        size: 11.5, anchor: "middle", fill: F.color("text-3")
      });
    }

    function redraw() {
      while (layA.firstChild) layA.removeChild(layA.firstChild);
      while (layB.firstChild) layB.removeChild(layB.firstChild);

      var proc = sel.get();
      var a1 = Math.round(ctl.get("a1")), L1 = Math.round(ctl.get("L1"));
      var a2 = Math.round(ctl.get("a2")), L2 = Math.round(ctl.get("L2"));
      var b1 = Math.min(NT, a1 + L1), b2 = Math.min(NT, a2 + L2);

      var u = F.rng(api.state.seed || 1), traj = [0], x = 0, i;
      for (i = 1; i <= NT; i++) { x += stepOf(proc, u); traj.push(x); }
      var lo = Math.min.apply(null, traj), hi = Math.max.apply(null, traj);
      var m2 = Math.max(1, (hi - lo) * 0.12);

      var sx = F.scale([0, NT], [pad.l, W - pad.r]);
      var sy = F.scale([lo - m2, hi + m2], [HA - pad.b, pad.t]);
      F.axes(layA, {
        sx: sx, sy: sy, xTicks: 6, yTicks: 5, xLabel: "t (paso)", yLabel: "X(t)", y0: lo - m2
      });
      F.hline(layA, sy(0), { x0: pad.l, x1: W - pad.r, stroke: F.color("plot-axis"), dash: "2 5", width: 1 });

      [[a1, b1, F.series(2), "1"], [a2, b2, F.series(3), "2"]].forEach(function (wd) {
        F.el("rect", {
          x: sx(wd[0]), y: pad.t, width: Math.max(2, sx(wd[1]) - sx(wd[0])), height: HA - pad.b - pad.t,
          fill: wd[2], opacity: 0.13
        }, layA);
        F.el("line", {
          x1: sx(wd[1]), y1: sy(traj[wd[0]]), x2: sx(wd[1]), y2: sy(traj[wd[1]]),
          stroke: wd[2], "stroke-width": 2, "stroke-linecap": "round"
        }, layA);
        F.label(layA, sx(wd[0]) + 4, pad.t + 11, "ventana " + wd[3] + " (largo " + (wd[1] - wd[0]) + ")", {
          size: 11, keyColor: wd[2]
        });
        F.label(layA, sx(wd[1]) + 6, (sy(traj[wd[0]]) + sy(traj[wd[1]])) / 2,
          "Δ = " + F.fmt(traj[wd[1]] - traj[wd[0]], proc === "gauss" ? 2 : 0), {
          size: 11, baseline: "middle", mono: true, keyColor: wd[2]
        });
      });

      var pts = [];
      for (i = 0; i <= NT; i++) pts.push([sx(i), sy(traj[i])]);
      F.line(layA, pts, { stroke: F.series(1), width: 2, serie: "X(t)" });

      // ---- panel inferior: dos pares de histogramas ----
      var s1 = sample(proc, b1 - a1, 0), s2 = sample(proc, b2 - a2, 1);
      drawHist(layB, pad.l, W / 2 - 26, 34, HB - 50, [
        { data: s1, color: F.series(2), label: "ventana 1" },
        { data: s2, color: F.series(3), label: "ventana 2" }
      ], "incremento por ventana", "incremento X(b) − X(a)");

      var t1 = b1, t2 = b2;
      var m1 = sample(proc, Math.max(1, t1), 2), mm2 = sample(proc, Math.max(1, t2), 3);
      drawHist(layB, W / 2 + 30, W - pad.r, 34, HB - 50, [
        { data: m1, color: F.series(2), label: "t = " + t1 },
        { data: mm2, color: F.series(3), label: "t = " + t2 }
      ], "X(t) en dos instantes", "valor de X(t)");

      var th = theory(proc), L1e = b1 - a1, L2e = b2 - a2;
      out.set("inc1", F.fmt(meanOf(s1), 2) + " / " + F.fmt(varOf(s1), 2) +
        "  (teór. " + F.fmt(th.m * L1e, 2) + " / " + F.fmt(th.v * L1e, 2) + ")");
      out.set("inc2", F.fmt(meanOf(s2), 2) + " / " + F.fmt(varOf(s2), 2) +
        "  (teór. " + F.fmt(th.m * L2e, 2) + " / " + F.fmt(th.v * L2e, 2) + ")");
      out.set("teo", "E = " + F.fmt(th.m, 2) + "·L,  Var = " + F.fmt(th.v, 2) + "·L");
      out.set("same", (b1 - a1) === (b2 - a2) ? "sí ⇒ misma distribución del incremento" : "no ⇒ distribuciones distintas");
      out.set("disj", (b1 <= a2 || b2 <= a1) ? "sí ⇒ incrementos independientes" : "no (se superponen)");
    }

    // arrastre: mueve la ventana cuyo centro esté más cerca del puntero
    var which = 1;
    var stop = F.drag(hit, {
      onStart: function (px) {
        var sxq = F.scale([0, NT], [pad.l, W - pad.r]);
        var c1 = sxq(ctl.get("a1") + ctl.get("L1") / 2);
        var c2 = sxq(ctl.get("a2") + ctl.get("L2") / 2);
        which = Math.abs(px - c1) <= Math.abs(px - c2) ? 1 : 2;
      },
      onDrag: function (px) {
        var sxq = F.scale([0, NT], [pad.l, W - pad.r]);
        var L = Math.round(ctl.get(which === 1 ? "L1" : "L2"));
        var v = Math.round(sxq.invert(px) - L / 2);
        v = Math.max(0, Math.min(NT - 5, v));
        ctl.set(which === 1 ? "a1" : "a2", v);
        redraw();
      }
    });
    api.cleanup(stop);

    redraw();
  }, {
    title: "Dos ventanas sobre la misma trayectoria",
    page: "procesos-estocasticos", kind: "interactive", unidad: "6"
  });

})();
