/* ============================================================
   figuras/u3.js — figuras de la Unidad 3 (variables aleatorias discretas).

   Se carga DESPUÉS de figures.js (necesita App.registerFigure) y de
   lib-math.js (window.M, del que salen TODOS los valores numéricos).

   Figuras registradas
     u3-binomial-vs-poisson-superpuestas-por-que-manda-p
     u3-falta-de-memoria-la-cola-recortada-y-reescalada-
     u3-la-escalera-de-la-fda-cada-salto-es-una-masa-pun
     u3-el-balancin-la-esperanza-como-centro-de-masa
     u3-de-s-a-la-recta-la-particion-que-induce-una-v-a
     u3-de-donde-sale-el-combinatorio-enumerar-las-secue
     u3-poblacion-conjunto-a-y-muestra-de-donde-sale-el-
     u3-n-creciente-con-p-m-n-fijo-la-hipergeometrica-se
     u3-la-tira-de-ensayos-por-que-c-k-r1-k-y-no-c-k-r-k
     u3-mapa-de-las-seis-discretas-y-los-pasajes-entre-e
   ============================================================ */
(function () {
  "use strict";

  var A = window.App;
  if (!A || typeof A.registerFigure !== "function") return;
  var M = window.M || {};

  // ---------- utilidades locales ----------

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function iround(v) { return Math.round(v); }

  // Serie de enteros lo…hi
  function range(lo, hi) {
    var out = [], k;
    for (k = lo; k <= hi; k++) out.push(k);
    return out;
  }

  // Ancho de barra en unidades de DATO que no supere `wmax` px del lienzo.
  // El sistema topea la barra en 24 px y deja el sobrante de la banda como
  // aire; Fig.bars solo entiende unidades de dato, así que se convierte acá.
  function anchoBarra(sx, deseado, wmax) {
    var d = sx.domain(), r = sx.range();
    var px = Math.abs(r[1] - r[0]) / Math.abs(d[1] - d[0]);
    if (!isFinite(px) || px <= 0) return deseado;
    return Math.min(deseado, (wmax == null ? 22 : wmax) / px);
  }

  // Dibuja dos PMF discretas superpuestas sobre el mismo eje k.
  // Con pocos valores usa barras apareadas; con muchos, dos poligonales
  // (a esa densidad una barra mide menos de un píxel y no se leería).
  function twoPMF(F, layer, W, H, pad, ks, pa, pb, o) {
    var i, ymax = 0;
    for (i = 0; i < ks.length; i++) {
      if (pa[i] > ymax) ymax = pa[i];
      if (pb[i] > ymax) ymax = pb[i];
    }
    if (!(ymax > 0)) ymax = 1;
    var sx = F.scale([ks[0] - 0.5, ks[ks.length - 1] + 0.5], [pad.l, W - pad.r]);
    var sy = F.scale([0, ymax * 1.18], [H - pad.b, pad.t]);
    F.axes(layer, {
      sx: sx, sy: sy, xTicks: Math.min(8, ks.length), yTicks: 4,
      xLabel: o.xLabel || "k (cantidad de éxitos)", yLabel: "P(X = k)", y0: 0
    });
    var dense = ks.length > 40;
    if (dense) {
      // con tres series en juego el color no alcanza: la segunda va discontinua
      F.line(layer, ks.map(function (k, j) { return [k, pa[j]]; }),
        { sx: sx, sy: sy, stroke: o.colorA, serie: o.serieA });
      F.line(layer, ks.map(function (k, j) { return [k, pb[j]]; }),
        { sx: sx, sy: sy, stroke: o.colorB, dash: "6 4", serie: o.serieB });
    } else {
      var wD = anchoBarra(sx, 0.40, 22);
      F.bars(layer, ks.map(function (k, j) { return [k - wD / 2, pa[j]]; }), sx, sy,
        { width: wD, fill: o.colorA, serie: o.serieA });
      F.bars(layer, ks.map(function (k, j) { return [k + wD / 2, pb[j]]; }), sx, sy,
        { width: wD, fill: o.colorB, serie: o.serieB });
    }
    return { sx: sx, sy: sy, dense: dense };
  }

  // Panel inferior: diferencia punto a punto pa − pb. Devuelve el máximo |Δ|.
  function diffPanel(F, layer, W, H, pad, ks, pa, pb, o) {
    var d = [], i, m = 0, v;
    for (i = 0; i < ks.length; i++) {
      v = pa[i] - pb[i];
      d.push(v);
      if (Math.abs(v) > m) m = Math.abs(v);
    }
    var lim = m > 0 ? m * 1.3 : 1e-3;
    var sx = F.scale([ks[0] - 0.5, ks[ks.length - 1] + 0.5], [pad.l, W - pad.r]);
    var sy = F.scale([-lim, lim], [H - pad.b, pad.t]);
    // Los ticks del eje x van al PIE del panel: si colgaran de y = 0 quedarían
    // tapados por las barras de diferencia negativa, que nacen justo ahí. La
    // línea del cero se traza aparte.
    F.axes(layer, {
      sx: sx, sy: sy, xTicks: Math.min(8, ks.length), yTicks: 5, y0: -lim
    });
    F.hline(layer, sy(0), {
      x0: pad.l, x1: W - pad.r, stroke: F.color("plot-axis"),
      width: 1.2, dash: false, opacity: 0.9
    });
    F.bars(layer, ks.map(function (k, j) { return [k, d[j]]; }), sx, sy, {
      fill: o.color, width: anchoBarra(sx, ks.length > 40 ? 0.72 : 0.62, 22),
      serie: o.serie || "diferencia"
    });
    // la nota va arriba a la derecha: al pie ahora están los ticks del eje x.
    F.text(layer, W - pad.r, pad.t - 3, o.note || "diferencia entre las dos PMF", {
      size: 11, anchor: "end", fill: F.color("text-3")
    });
    return m;
  }

  // ============================================================
  //  1) Binomial vs. Poisson superpuestas — por qué manda p
  // ============================================================
  A.registerFigure("u3-binomial-vs-poisson-superpuestas-por-que-manda-p", function (host, api) {
    var F = api.Fig;
    var W = 660, HT = 250, HB = 130;
    var pnl = F.panels(host, 2, { w: W, heights: [HT, HB], gap: 4 });
    var padT = { l: 58, r: 16, t: 16, b: 46 };
    var padB = { l: 58, r: 16, t: 14, b: 34 };

    var ctl = F.controls(host, [
      { k: "n", label: "n (ensayos)", min: 10, max: 2000, step: 10, value: 1000, dec: 0 },
      { k: "p", label: "p (éxito)", min: 0.001, max: 0.5, value: 0.003, log: true, dec: 3 }
    ], function (k) {
      if (k === "n" && tg.get()) {
        var lam = api.state.lamFijo || 3;
        ctl.set("p", clamp(lam / Math.max(1, iround(ctl.get("n"))), 0.001, 0.5));
      }
      redraw();
    });

    var tg = F.toggle(host, {
      k: "fijarLambda", label: "mantener λ = n·p constante al mover n", value: false
    }, function (k, v) {
      if (v) api.state.lamFijo = iround(ctl.get("n")) * ctl.get("p");
      redraw();
    });

    F.buttons(host, [
      {
        label: "n = 1000, p = 0,003",
        title: "λ = 3: la aproximación es excelente",
        onClick: function () { ctl.set("n", 1000); ctl.set("p", 0.003); redraw(); }
      },
      {
        label: "n = 1000, p = 0,3",
        title: "mismo n, p grande: la aproximación se rompe",
        onClick: function () { ctl.set("n", 1000); ctl.set("p", 0.3); redraw(); }
      },
      {
        label: "n = 30, p = 0,1",
        title: "λ = 3 con n chico: todavía se nota la diferencia",
        onClick: function () { ctl.set("n", 30); ctl.set("p", 0.1); redraw(); }
      }
    ]);

    var out = F.readouts(host, [
      { k: "lam", tex: "\\lambda = np" },
      { k: "err", label: "máx |ΔP|" },
      { k: "vb", tex: "V_{\\text{bin}} = npq" },
      { k: "vp", tex: "V_{\\text{Poi}} = \\lambda" }
    ]);

    F.legend(host, [
      { label: "Binomial(n, p)", color: F.series(1), fill: true },
      { label: "Poisson(λ = np)", color: F.series(2), fill: true },
      { label: "diferencia Binomial − Poisson", color: F.series(3), fill: true }
    ]);

    var gT = F.el("g", null, pnl[0]);
    var gB = F.el("g", null, pnl[1]);

    function redraw() {
      while (gT.firstChild) gT.removeChild(gT.firstChild);
      while (gB.firstChild) gB.removeChild(gB.firstChild);

      var n = iround(ctl.get("n"));
      var p = ctl.get("p");
      var lam = n * p;
      var sd = Math.sqrt(lam + 1);
      var lo = Math.max(0, Math.floor(lam - 4.5 * sd - 1));
      var hi = Math.ceil(lam + 4.5 * sd + 1);
      if (hi < lo + 4) hi = lo + 4;
      if (hi > lo + 160) hi = lo + 160;

      var ks = range(lo, hi), pa = [], pb = [], i;
      for (i = 0; i < ks.length; i++) {
        pa.push(M.binomPMF(ks[i], n, p));
        pb.push(M.poissonPMF(ks[i], lam));
      }

      twoPMF(F, gT, W, HT, padT, ks, pa, pb, {
        colorA: F.series(1), colorB: F.series(2),
        serieA: "Binomial", serieB: "Poisson"
      });
      var maxd = diffPanel(F, gB, W, HB, padB, ks, pa, pb, {
        color: F.series(3), note: "diferencia Binomial − Poisson"
      });

      out.set("lam", F.fmt(lam, 3));
      out.set("err", maxd < 1e-4 ? maxd.toExponential(2) : F.fmt(maxd, 5));
      out.set("vb", F.fmt(n * p * (1 - p), 3));
      out.set("vp", F.fmt(lam, 3));
    }

    redraw();
  }, {
    title: "Binomial vs. Poisson superpuestas: por qué manda p y no n",
    page: "distribucion-poisson", kind: "interactive", unidad: "3"
  });

  // ============================================================
  //  2) Falta de memoria de la geométrica
  // ============================================================
  A.registerFigure("u3-falta-de-memoria-la-cola-recortada-y-reescalada-", function (host, api) {
    var F = api.Fig;
    var W = 660, HT = 250, HB = 110;
    var pnl = F.panels(host, 2, { w: W, heights: [HT, HB], gap: 6 });
    var pad = { l: 58, r: 16, t: 18, b: 46 };

    var ctl = F.controls(host, [
      { k: "p", label: "p (éxito por ensayo)", min: 0.05, max: 0.9, step: 0.01, value: 0.25, dec: 2 },
      { k: "L", label: "L (fracasos ya vistos)", min: 0, max: 15, step: 1, value: 5, dec: 0 },
      { k: "D", label: "Δ (espera adicional)", min: 1, max: 10, step: 1, value: 3, dec: 0 }
    ], function () { redraw(); });

    F.toggle(host, { k: "resc", label: "reescalar la cola dividiendo por qᴸ", value: true },
      function () { redraw(); });

    var out = F.readouts(host, [
      { k: "qL", tex: "P(X \\ge L) = q^{L}" },
      { k: "qLD", tex: "P(X \\ge L+\\Delta) = q^{L+\\Delta}" },
      { k: "coc", tex: "\\text{cociente} = q^{\\Delta}" },
      { k: "pd", tex: "P(X \\ge \\Delta)" }
    ]);

    F.legend(host, [
      { label: "PMF original p·qᵏ", color: F.series(1), fill: true },
      { label: "cola condicional {X ≥ L}", color: F.series(2), fill: true },
      { label: "cola reescalada, corrida a k − L", color: F.series(3) }
    ]);

    var gT = F.el("g", null, pnl[0]);
    var gB = F.el("g", null, pnl[1]);

    function redraw() {
      while (gT.firstChild) gT.removeChild(gT.firstChild);
      while (gB.firstChild) gB.removeChild(gB.firstChild);

      var p = ctl.get("p"), q = 1 - p;
      var L = iround(ctl.get("L")), D = iround(ctl.get("D"));
      var resc = !!api.state.resc;

      // hasta dónde mostrar: cola del 0,3 % o L+Δ+6, lo que sea mayor
      var kTail = Math.ceil(Math.log(0.003) / Math.log(q));
      var kmax = clamp(Math.max(kTail, L + D + 6), 8, 44);
      var ks = range(0, kmax), i;

      var pmf = ks.map(function (k) { return M.geomPMF(k, p); });
      var ymax = pmf[0] * 1.2;

      var sx = F.scale([-0.6, kmax + 0.6], [pad.l, W - pad.r]);
      var sy = F.scale([0, ymax], [HT - pad.b, pad.t]);
      F.axes(gT, {
        sx: sx, sy: sy, xTicks: Math.min(10, kmax + 1), yTicks: 4,
        xLabel: "k (fracasos antes del primer éxito)", yLabel: "P(X = k)", y0: 0
      });

      // barras: la PMF entera en la ranura 1 y la cola condicional, encima,
      // en la ranura 2 (dos series sólidas, sin transparencias)
      var wB = anchoBarra(sx, 0.68, 22);
      F.bars(gT, ks.map(function (k, j) { return [k, pmf[j]]; }), sx, sy,
        { width: wB, fill: F.series(1), serie: "PMF original" });
      var cola = [];
      for (i = L; i < ks.length; i++) cola.push([ks[i], pmf[i]]);
      F.bars(gT, cola, sx, sy, { width: wB, fill: F.series(2), serie: "cola {X ≥ L}" });

      // cola reescalada: p·q^k / q^L colocada en k − L. Coincide exactamente
      // con la PMF original, que es justo lo que afirma la falta de memoria.
      if (resc) {
        for (i = L; i <= kmax; i++) {
          var h = pmf[i] / Math.pow(q, L);
          var xa = sx(i - L - 0.34), xb = sx(i - L + 0.34);
          F.el("rect", {
            x: Math.min(xa, xb), y: sy(h),
            width: Math.abs(xb - xa), height: Math.max(0.5, sy(0) - sy(h)),
            fill: "none", stroke: F.series(3), "stroke-width": 2,
            "stroke-dasharray": "3 2", rx: 3
          }, gT);
        }
      }

      F.vline(gT, sx(L - 0.5), {
        y0: pad.t, y1: sy(0), stroke: F.color("plot-axis"),
        label: "L = " + L, labelAt: pad.t + 10, keyColor: F.series(2)
      });

      // ---- panel inferior: la recta con L, M = L+Δ y el tramo Δ ----
      // Se dibuja a mano en vez de con Fig.timeline para que la regla y sus
      // marcas queden como cromo de eje (trazo fino y continuo) y los rótulos
      // en tokens de texto, con la clave de color al lado.
      var gEje = F.el("g", { class: "fig-axes" }, gB);
      var st = F.scale([0, kmax], [pad.l, W - pad.r]);
      var yL = 58, cAx = F.color("plot-axis"), cT3b = F.color("text-3");
      F.el("line", { x1: pad.l, y1: yL, x2: W - pad.r, y2: yL, stroke: cAx, "stroke-width": 1.2 }, gEje);
      var pasoT = Math.max(1, Math.ceil((kmax + 1) / 10));
      for (i = 0; i <= kmax; i += pasoT) {
        F.el("line", { x1: st(i), y1: yL, x2: st(i), y2: yL + 4, stroke: cAx, "stroke-width": 1 }, gEje);
        F.text(gEje, st(i), yL + 8, String(i), {
          size: 11, anchor: "middle", baseline: "hanging", fill: cT3b, mono: true
        });
      }
      F.text(gEje, W - pad.r, yL + 24, "fracasos acumulados", {
        size: 11.5, anchor: "end", baseline: "hanging", fill: cT3b
      });

      var xa2 = st(L), xb2 = st(Math.min(kmax, L + D));
      F.el("rect", {
        x: Math.min(xa2, xb2), y: yL - 12, width: Math.max(1, Math.abs(xb2 - xa2)), height: 12,
        rx: 3, fill: F.mix(F.series(3), F.color("surface"), 0.55)
      }, gB);
      F.el("line", { x1: xa2, y1: yL - 24, x2: xa2, y2: yL, stroke: F.series(2), "stroke-width": 2 }, gB);
      F.el("line", { x1: xb2, y1: yL - 24, x2: xb2, y2: yL, stroke: F.series(3), "stroke-width": 2 }, gB);
      F.label(gB, xa2, yL - 28, "L", { size: 11, anchor: "middle", mono: true, keyColor: F.series(2) });
      F.label(gB, xb2, yL - 28, "M = L+Δ", { size: 11, anchor: "middle", mono: true, keyColor: F.series(3) });
      F.text(gB, (xa2 + xb2) / 2, yL - 42, "Δ = " + D, {
        size: 11.5, anchor: "middle", fill: F.color("text-2"), mono: true
      });

      var qL = Math.pow(q, L), qLD = Math.pow(q, L + D);
      // con p alto las dos colas caen por debajo de 1e-4 y con 4 decimales se
      // leerían las dos como 0.0000, con lo que el cociente parecería salir de
      // 0/0. Se usa la misma regla que el resto de la unidad: notación
      // científica por debajo de 1e-4.
      var corto = function (v) { return v < 1e-4 ? v.toExponential(2) : F.fmt(v, 4); };
      out.set("qL", corto(qL));
      out.set("qLD", corto(qLD));
      out.set("coc", F.fmt(qLD / qL, 4));
      out.set("pd", F.fmt(Math.pow(q, D), 4));
    }

    redraw();
  }, {
    title: "Falta de memoria: la cola recortada y reescalada vuelve a ser la misma",
    page: "distribucion-geometrica", kind: "interactive", unidad: "3"
  });

  // ============================================================
  //  3) La escalera de la FDA
  // ============================================================
  A.registerFigure("u3-la-escalera-de-la-fda-cada-salto-es-una-masa-pun", function (host, api) {
    var F = api.Fig;
    var W = 660, HT = 170, HB = 210;
    var pnl = F.panels(host, 2, { w: W, heights: [HT, HB], gap: 6 });
    var padT = { l: 58, r: 20, t: 16, b: 40 };
    var padB = { l: 58, r: 20, t: 18, b: 46 };
    var SUP = [0, 1, 2, 3];

    var ctl = F.controls(host, [
      { k: "x", label: "cursor x", min: -1, max: 4, step: 0.25, value: 2, dec: 2 },
      { k: "w0", label: "peso de k = 0", min: 0, max: 10, step: 1, value: 1, dec: 0 },
      { k: "w1", label: "peso de k = 1", min: 0, max: 10, step: 1, value: 3, dec: 0 },
      { k: "w2", label: "peso de k = 2", min: 0, max: 10, step: 1, value: 4, dec: 0 },
      { k: "w3", label: "peso de k = 3", min: 0, max: 10, step: 1, value: 2, dec: 0 }
    ], function () { redraw(); });

    var out = F.readouts(host, [
      { k: "F", tex: "F_X(x) = P(X \\le x)" },
      { k: "Pl", tex: "P(X < x)" },
      { k: "jump", tex: "\\text{salto} = p_X(x)" }
    ]);

    F.legend(host, [
      { label: "PMF pₓ(k)", color: F.series(1), fill: true },
      { label: "FDA Fₓ(x), continua a derecha", color: F.series(2) },
      { label: "cursor x", color: F.color("plot-axis"), dash: true }
    ]);

    var gT = F.el("g", null, pnl[0]);
    var gB = F.el("g", null, pnl[1]);
    var sxB = null;

    // capa de arrastre sobre el panel de la FDA
    var hit = F.el("rect", {
      x: padB.l, y: padB.t, width: W - padB.r - padB.l, height: HB - padB.b - padB.t,
      fill: "transparent"
    }, pnl[1]);
    var stop = F.drag(hit, {
      onDrag: function (px) {
        if (!sxB) return;
        var v = Math.round(sxB.invert(px) * 4) / 4;
        ctl.set("x", clamp(v, -1, 4));
        redraw();
      }
    });
    api.cleanup(stop);

    function weights() {
      var w = [ctl.get("w0"), ctl.get("w1"), ctl.get("w2"), ctl.get("w3")];
      var s = w[0] + w[1] + w[2] + w[3];
      if (s <= 0) { w = [1, 1, 1, 1]; s = 4; }
      return w.map(function (v) { return v / s; });
    }

    function redraw() {
      while (gT.firstChild) gT.removeChild(gT.firstChild);
      while (gB.firstChild) gB.removeChild(gB.firstChild);

      var p = weights();
      var x = ctl.get("x");
      var i;

      // --- panel superior: PMF ---
      var pmax = Math.max(p[0], p[1], p[2], p[3]);
      var sx = F.scale([-1.2, 4.2], [padT.l, W - padT.r]);
      var sy = F.scale([0, pmax * 1.25], [HT - padT.b, padT.t]);
      F.axes(gT, { sx: sx, sy: sy, xTicks: [-1, 0, 1, 2, 3, 4], yTicks: 3, yLabel: "pₓ(k)", y0: 0 });
      // las masas no se rotulan acá: cada una se lee en el salto de la FDA
      F.bars(gT, SUP.map(function (k, j) { return [k, p[j]]; }), sx, sy,
        { width: anchoBarra(sx, 0.5, 22), fill: F.series(1), serie: "pₓ(k)" });
      F.vline(gT, sx(x), { y0: padT.t, y1: sy(0), stroke: F.color("plot-axis") });

      // --- panel inferior: FDA escalonada ---
      var sx2 = F.scale([-1.2, 4.2], [padB.l, W - padB.r]);
      var sy2 = F.scale([0, 1.12], [HB - padB.b, padB.t]);
      sxB = sx2;
      F.axes(gB, {
        sx: sx2, sy: sy2, xTicks: [-1, 0, 1, 2, 3, 4], yTicks: [0, 0.25, 0.5, 0.75, 1],
        xLabel: "x", yLabel: "Fₓ(x)", y0: 0
      });

      var acc = 0, cum = [];
      for (i = 0; i < SUP.length; i++) { acc += p[i]; cum.push(acc); }

      var cPri = F.series(2);
      // la escalera entera es UNA sola trayectoria de 2 px: peldaños y saltos.
      // Los extremos cerrado/abierto son los que dicen dónde vale la función.
      var pasos = [[sx2(-1.2), sy2(0)]];
      for (i = 0; i < SUP.length; i++) {
        var prev = i === 0 ? 0 : cum[i - 1];
        var xr = i < SUP.length - 1 ? SUP[i + 1] : 4.2;
        pasos.push([sx2(SUP[i]), sy2(prev)]);
        pasos.push([sx2(SUP[i]), sy2(cum[i])]);
        pasos.push([sx2(xr), sy2(cum[i])]);
      }
      F.line(gB, pasos, { stroke: cPri, serie: "Fₓ(x)" });
      for (i = 0; i < SUP.length; i++) {
        var prev2 = i === 0 ? 0 : cum[i - 1];
        F.text(gB, sx2(SUP[i]) + 8, (sy2(prev2) + sy2(cum[i])) / 2, "p = " + F.fmt(p[i], 2), {
          size: 10.5, fill: F.color("text-3"), mono: true, baseline: "middle"
        });
        // extremo cerrado (arriba) y abierto (abajo)
        F.el("circle", {
          cx: sx2(SUP[i]), cy: sy2(cum[i]), r: 4.6, fill: cPri,
          stroke: F.color("surface"), "stroke-width": 2
        }, gB);
        F.el("circle", {
          cx: sx2(SUP[i]), cy: sy2(prev2), r: 4.6,
          fill: F.color("surface"), stroke: cPri, "stroke-width": 2
        }, gB);
      }

      // cursor y lecturas exactas
      var Fx = 0, Pl = 0;
      for (i = 0; i < SUP.length; i++) {
        if (SUP[i] <= x) Fx += p[i];
        if (SUP[i] < x) Pl += p[i];
      }
      F.vline(gB, sx2(x), { y0: padB.t, y1: sy2(0), stroke: F.color("plot-axis") });
      F.marker(gB, sx2(x), sy2(Fx), { r: 4.8, fill: cPri, serie: false });
      F.text(gB, sx2(x) + 10, sy2(Fx) - 9, "F(x) = " + F.fmt(Fx, 3), {
        size: 11, fill: F.color("text-2"), mono: true
      });
      if (Fx - Pl > 1e-12) {
        // el límite por izquierda se marca hueco, como el extremo abierto
        F.marker(gB, sx2(x), sy2(Pl), {
          r: 4.8, fill: F.color("surface"), stroke: cPri, strokeWidth: 2, serie: false
        });
        F.text(gB, sx2(x) + 10, sy2(Pl) + 14, "P(X<x) = " + F.fmt(Pl, 3), {
          size: 11, fill: F.color("text-3"), mono: true
        });
      }

      out.set("F", F.fmt(Fx, 4));
      out.set("Pl", F.fmt(Pl, 4));
      out.set("jump", F.fmt(Fx - Pl, 4));
    }

    redraw();
  }, {
    title: "La escalera de la FDA: cada salto es una masa puntual",
    page: "funcion-de-distribucion-acumulada", kind: "interactive", unidad: "3"
  });

  // ============================================================
  //  4) El balancín: la esperanza como centro de masa
  // ============================================================
  A.registerFigure("u3-el-balancin-la-esperanza-como-centro-de-masa", function (host, api) {
    var F = api.Fig;
    var W = 660, H = 324;
    var svg = F.svg(host, { w: W, h: H, title: "Balancín: la esperanza como centro de masa" });
    var SUP = [0, 1, 2, 3, 4];
    var yBar = 168, yAxis = 252;

    var ctl = F.controls(host, [
      { k: "f", label: "posición del fulcro", min: 0, max: 4, step: 0.05, value: 1.5, dec: 2 },
      { k: "w0", label: "peso de k = 0", min: 0, max: 10, step: 1, value: 1, dec: 0 },
      { k: "w1", label: "peso de k = 1", min: 0, max: 10, step: 1, value: 1, dec: 0 },
      { k: "w2", label: "peso de k = 2", min: 0, max: 10, step: 1, value: 3, dec: 0 },
      { k: "w3", label: "peso de k = 3", min: 0, max: 10, step: 1, value: 3, dec: 0 },
      { k: "w4", label: "peso de k = 4", min: 0, max: 10, step: 1, value: 2, dec: 0 }
    ], function () { redraw(); });

    F.buttons(host, [
      {
        label: "colocar el fulcro en E[X]",
        title: "el único punto donde la barra queda horizontal",
        // valor EXACTO de E[X]: ctl.set guarda el número tal cual (el paso del
        // deslizador solo limita el arrastre manual), así el desbalance queda en 0
        onClick: function () { ctl.set("f", esperanza()); redraw(); }
      }
    ]);

    var out = F.readouts(host, [
      { k: "E", tex: "\\E[X] = \\sum_k k\\,p_X(k)" },
      { k: "f", label: "fulcro" },
      { k: "des", tex: "\\sum_k (k-f)\\,p_X(k)" }
    ]);

    F.legend(host, [
      { label: "masas pₓ(k) sobre la barra", color: F.series(1), fill: true },
      { label: "fulcro (posición elegida)", color: F.series(2), fill: true },
      { label: "E[X] sobre el eje", color: F.series(3) }
    ]);

    var layer = F.el("g", null, svg);

    function pesos() {
      var w = SUP.map(function (k, j) { return ctl.get("w" + j); });
      var s = 0, i;
      for (i = 0; i < w.length; i++) s += w[i];
      if (s <= 0) { w = [1, 1, 1, 1, 1]; s = 5; }
      return w.map(function (v) { return v / s; });
    }
    function esperanza() {
      var p = pesos(), e = 0, i;
      for (i = 0; i < SUP.length; i++) e += SUP[i] * p[i];
      return e;
    }

    function redraw() {
      while (layer.firstChild) layer.removeChild(layer.firstChild);

      var p = pesos();
      var f = ctl.get("f");
      var E = esperanza();
      var des = E - f;                                  // = Σ (k − f) p_X(k)

      var sx = F.scale([-0.6, 4.6], [70, W - 40]);
      var cTxt = F.color("text-3");

      // suelo y eje de valores: cromo de eje, trazo fino y continuo
      var gEje = F.el("g", { class: "fig-axes" }, layer);
      var cAx = F.color("plot-axis");
      F.el("line", { x1: sx(-0.6), y1: yAxis, x2: sx(4.6), y2: yAxis, stroke: cAx, "stroke-width": 1.2 }, gEje);
      SUP.forEach(function (k) {
        F.el("line", { x1: sx(k), y1: yAxis, x2: sx(k), y2: yAxis + 5, stroke: cAx, "stroke-width": 1 }, gEje);
        F.text(gEje, sx(k), yAxis + 9, String(k), {
          size: 11.5, anchor: "middle", baseline: "hanging", fill: cTxt, mono: true
        });
      });
      F.text(gEje, sx(4.6) + 14, yAxis, "k", {
        size: 12, baseline: "middle", fill: cTxt, mono: true
      });

      // marca de E[X] sobre el eje (ranura 3)
      var cE = F.series(3);
      F.line(layer, [[sx(E), yAxis - 9], [sx(E), yAxis + 9]], { stroke: cE, serie: false });
      F.line(layer, [[sx(E), yAxis + 10], [sx(E), yAxis + 45]], {
        stroke: cE, width: 1.5, dash: "3 3", opacity: 0.8, cls: "fig-ref", serie: false
      });
      F.label(layer, sx(E), yAxis + 47, "E[X] = " + F.fmt(E, 2), {
        size: 11.5, anchor: "middle", baseline: "hanging", mono: true, keyColor: cE
      });

      // fulcro
      var fx = sx(f);
      var cF = F.series(2);
      F.path(layer, "M" + fx + " " + (yBar + 8) + "L" + (fx - 17) + " " + yAxis + "L" + (fx + 17) + " " + yAxis + "Z", {
        fill: F.mix(cF, F.color("surface"), 0.55), stroke: cF, width: 2
      });
      // con el fulcro sobre E[X] la punteada cruzaría el rótulo: se corre a la izquierda
      var pegado = Math.abs(sx(E) - fx) < 46;
      F.label(layer, pegado ? fx - 10 : fx, yAxis + 27, "fulcro " + F.fmt(f, 2), {
        size: 11.5, anchor: pegado ? "end" : "middle", baseline: "hanging",
        mono: true, keyColor: cF
      });

      // barra rígida con las masas, inclinada según el desbalance
      var ang = clamp(des * 7, -17, 17);
      var g = F.el("g", { transform: "rotate(" + ang.toFixed(2) + " " + fx + " " + yBar + ")" }, layer);
      var cM = F.series(1);
      F.el("rect", {
        x: sx(-0.45), y: yBar - 4, width: sx(4.45) - sx(-0.45), height: 8,
        rx: 4, fill: F.mix(cM, F.color("surface"), 0.42)
      }, g);
      SUP.forEach(function (k, j) {
        if (p[j] <= 0) return;
        var r = 8 + 26 * Math.sqrt(p[j]);
        var cx = sx(k), cy = yBar - 6 - r;
        F.el("line", { x1: cx, y1: yBar - 4, x2: cx, y2: cy + r, stroke: cM, "stroke-width": 2 }, g);
        F.el("circle", {
          cx: cx, cy: cy, r: r, fill: F.mix(cM, F.color("surface"), 0.76),
          stroke: cM, "stroke-width": 2
        }, g);
        F.text(g, cx, cy, F.fmt(p[j], 2), {
          size: 11.5, anchor: "middle", baseline: "middle", fill: F.color("text"), mono: true
        });
      });

      // veredicto: equilibrio solo en E[X] exacto (el botón lo alcanza);
      // un fulcro apenas corrido deja la barra casi horizontal, y el texto lo dice
      var eq = Math.abs(des) < 1e-9;
      var casi = !eq && Math.abs(des) < 0.03;
      // el estado va como punto de color CON rótulo; el texto, en tokens de texto
      var veredicto = eq ? "equilibrio en E[X]"
        : casi ? "casi equilibrado"
          : (des > 0 ? "cae hacia la derecha" : "cae hacia la izquierda");
      F.label(layer, W / 2, 20, veredicto, {
        size: 12.5, anchor: "middle", baseline: "hanging", weight: 600,
        keyColor: F.status(eq ? "good" : "warn")
      });

      out.set("E", F.fmt(E, 4));
      out.set("f", F.fmt(f, 4));
      out.set("des", F.fmt(des, 4));
    }

    redraw();
  }, {
    title: "El balancín: la esperanza como centro de masa",
    page: "esperanza", kind: "interactive", unidad: "3"
  });

  // ============================================================
  //  5) De S a la recta: la partición que induce una v.a. (estática)
  // ============================================================
  A.registerFigure("u3-de-s-a-la-recta-la-particion-que-induce-una-v-a", function (host, api) {
    var F = api.Fig;
    var W = 660, H = 312;
    var svg = F.svg(host, { w: W, h: H, title: "El espacio muestral partido por los eventos {X = k} y el recorrido en la recta" });
    var g = F.el("g", null, svg);

    var P = [0.10, 0.15, 0.30, 0.25, 0.20];
    var cTxt = F.color("text-2"), cT3 = F.color("text-3");
    var cU = F.series(1), cAc = F.series(2);

    F.legend(host, [
      { label: "eventos {X = k} en S", color: cU, fill: true },
      { label: "recorrido Rₓ en la recta", color: cAc, fill: true }
    ]);

    // ---- espacio muestral S, partido en columnas de área proporcional ----
    // Las columnas van en el mismo orden que los valores del recorrido, así
    // que cada flecha baja recta y ninguna se cruza con otra.
    var bx = 40, by = 66, bw = 580, bh = 108;
    // La explicación (columnas disjuntas de ancho proporcional que cubren S)
    // vive en el epígrafe del callout [!figura] de la página del wiki.
    F.text(g, bx, by - 18, "S · eventos {X = k}", {
      size: 12.5, baseline: "auto", fill: cTxt, weight: 600
    });

    var xAcc = bx, cx = [], i, wCol;
    for (i = 0; i < P.length; i++) {
      wCol = bw * P[i];
      F.el("rect", {
        x: xAcc, y: by, width: wCol, height: bh,
        fill: F.mix(cU, F.color("surface"), 0.86 - 0.07 * i),
        stroke: F.color("border-2"), "stroke-width": 1
      }, g);
      F.text(g, xAcc + wCol / 2, by + bh / 2 - 9, "X = " + i, {
        size: 12, anchor: "middle", baseline: "middle", fill: cTxt, mono: true
      });
      F.text(g, xAcc + wCol / 2, by + bh / 2 + 11, "P = " + F.fmt(P[i], 2), {
        size: 10.5, anchor: "middle", baseline: "middle", fill: cT3, mono: true
      });
      cx.push(xAcc + wCol / 2);
      xAcc += wCol;
    }
    F.el("rect", {
      x: bx, y: by, width: bw, height: bh, rx: 4,
      fill: "none", stroke: F.color("plot-axis"), "stroke-width": 1.6
    }, g);
    // ---- recta real con el recorrido y sus entornos ----
    var ly = 244;
    var sx = F.scale([-0.6, 4.6], [56, W - 46]);
    var gEje = F.el("g", { class: "fig-axes" }, g);
    F.el("line", { x1: sx(-0.6), y1: ly, x2: sx(4.6), y2: ly, stroke: F.color("plot-axis"), "stroke-width": 1.2 }, gEje);
    F.path(gEje, "M" + sx(4.6) + " " + ly + "l-8 -4 v8 z", { fill: F.color("plot-axis") });
    F.text(gEje, sx(4.6) + 8, ly, "ℝ", { size: 12.5, baseline: "middle", fill: cT3 });

    for (i = 0; i < P.length; i++) {
      var xa = sx(i - 0.26), xb = sx(i + 0.26);
      F.el("rect", {
        x: xa, y: ly - 13, width: xb - xa, height: 26, rx: 5,
        fill: F.mix(cAc, F.color("surface"), 0.86), stroke: cAc, "stroke-width": 1, "stroke-dasharray": "3 2"
      }, g);
      F.el("circle", {
        cx: sx(i), cy: ly, r: 4.8, fill: cAc, stroke: F.color("surface"), "stroke-width": 2
      }, g);
      F.text(g, sx(i), ly + 18, String(i), {
        size: 11.5, anchor: "middle", baseline: "hanging", fill: cTxt, mono: true
      });
    }
    F.text(g, sx(-0.6), ly + 34, "recorrido Rₓ ⊂ ℝ", {
      size: 11.5, baseline: "hanging", fill: cT3, mono: true
    });

    // ---- flechas X: S → ℝ (una por columna, sin cruces) ----
    for (i = 0; i < P.length; i++) {
      var x0 = cx[i], y0 = by + bh + 2;
      var x1 = sx(i), y1 = ly - 17;
      F.path(g, "M" + x0 + " " + y0 + "C" + x0 + " " + (y0 + 24) + " " + x1 + " " + (y1 - 24) + " " + x1 + " " + y1, {
        stroke: cU, width: 1.5, opacity: 0.85, dash: "4 3", cls: "fig-ref"
      });
      F.path(g, "M" + x1 + " " + (y1 + 4) + "l-4 -6 h8 z", { fill: cU });
    }

    return null;
  }, {
    title: "De S a la recta: la partición que induce una v.a.",
    page: "variable-aleatoria", kind: "static", unidad: "3"
  });

  // ============================================================
  //  6) De dónde sale el combinatorio: enumerar las secuencias
  // ============================================================
  A.registerFigure("u3-de-donde-sale-el-combinatorio-enumerar-las-secue", function (host, api) {
    var F = api.Fig;
    var W = 660, HT = 306, HB = 160;
    var pnl = F.panels(host, 2, { w: W, heights: [HT, HB], gap: 6 });

    var ctl = F.controls(host, [
      { k: "n", label: "n (ensayos)", min: 3, max: 6, step: 1, value: 5, dec: 0 },
      { k: "k", label: "k (éxitos)", min: 0, max: 6, step: 1, value: 2, dec: 0 },
      { k: "p", label: "p (éxito)", min: 0.05, max: 0.95, step: 0.05, value: 0.5, dec: 2 }
    ], function () { redraw(); });

    var out = F.readouts(host, [
      { k: "c", tex: "\\binom{n}{k}" },
      { k: "seq", tex: "p^{k}q^{\\,n-k}" },
      { k: "tot", tex: "P(X=k)" }
    ]);

    F.legend(host, [
      { label: "éxito (E) en la tira", color: F.series(1), fill: true },
      { label: "fracaso (F)", color: F.color("border-2"), fill: true },
      { label: "PMF: el k elegido", color: F.series(2), fill: true }
    ]);

    var gT = F.el("g", null, pnl[0]);
    var gB = F.el("g", null, pnl[1]);

    // todas las combinaciones de k posiciones entre n
    function combos(n, k) {
      var out2 = [];
      (function rec(start, acc) {
        if (acc.length === k) { out2.push(acc.slice()); return; }
        for (var i = start; i < n; i++) { acc.push(i); rec(i + 1, acc); acc.pop(); }
      })(0, []);
      return out2;
    }

    function redraw() {
      while (gT.firstChild) gT.removeChild(gT.firstChild);
      while (gB.firstChild) gB.removeChild(gB.firstChild);

      var n = iround(ctl.get("n"));
      var k = iround(ctl.get("k"));
      if (k > n) { k = n; ctl.set("k", k); }
      var p = ctl.get("p"), q = 1 - p;

      var rows = combos(n, k);
      var cTxt = F.color("text-2"), cT3 = F.color("text-3");

      F.text(gT, 20, 12, "C(" + n + ", " + k + ") = " + rows.length + " secuencias", {
        size: 12.5, baseline: "hanging", fill: cTxt, weight: 600
      });

      var cw = 22, ch = 18, gapY = 23;
      var perCol = 10;
      var colW = n * cw + 34;
      var x0 = 30, y0 = 40;

      rows.forEach(function (pos, idx) {
        var ci = Math.floor(idx / perCol), ri = idx % perCol;
        var rx = x0 + ci * colW, ry = y0 + ri * gapY;
        var set = {}, j;
        for (j = 0; j < pos.length; j++) set[pos[j]] = 1;
        for (j = 0; j < n; j++) {
          var ok = !!set[j];
          F.el("rect", {
            x: rx + j * cw, y: ry, width: cw - 3, height: ch, rx: 3,
            fill: ok ? F.mix(F.series(1), F.color("surface"), 0.58) : F.color("surface-3"),
            stroke: F.color("border-2"), "stroke-width": 1
          }, gT);
          F.text(gT, rx + j * cw + (cw - 3) / 2, ry + ch / 2, ok ? "E" : "F", {
            size: 11.5, anchor: "middle", baseline: "middle",
            fill: ok ? cTxt : cT3, mono: true, weight: 600
          });
        }
      });

      // El razonamiento completo (todas las filas comparten probabilidad; lo
      // único que cambia con k es cuántas hay) está en el epígrafe del wiki y
      // en los lectores de la figura.
      var yNota = y0 + Math.min(rows.length, perCol) * gapY + 10;
      F.text(gT, x0, yNota, "misma probabilidad por fila", {
        size: 11.5, baseline: "hanging", fill: cT3
      });

      // --- panel inferior: PMF con el k actual destacado ---
      var ks = range(0, n);
      var pmf = ks.map(function (kk) { return M.binomPMF(kk, n, p); });
      var padB = { l: 56, r: 18, t: 26, b: 42 };
      var sx = F.scale([-0.6, n + 0.6], [padB.l, W - padB.r]);
      var sy = F.scale([0, Math.max.apply(null, pmf) * 1.35], [HB - padB.b, padB.t]);
      F.axes(gB, {
        sx: sx, sy: sy, xTicks: ks, yTicks: 3,
        xLabel: "k (éxitos)", yLabel: "P(X = k)", y0: 0
      });
      var wB = anchoBarra(sx, 0.6, 22);
      F.bars(gB, ks.map(function (kk, j) { return [kk, pmf[j]]; }), sx, sy,
        { width: wB, fill: F.series(1), serie: "P(X = k)" });
      F.bars(gB, [[k, pmf[k]]], sx, sy, { width: wB, fill: F.series(2), serie: "k elegido" });
      // una sola etiqueta directa: el combinatorio de la barra elegida
      F.text(gB, sx(k), sy(pmf[k]) - 9, "C = " + M.comb(n, k), {
        size: 10.5, anchor: "middle", fill: F.color("text-2"), mono: true
      });

      var each = Math.pow(p, k) * Math.pow(q, n - k);
      out.set("c", String(M.comb(n, k)));
      out.set("seq", F.fmt(each, 5));
      out.set("tot", F.fmt(M.binomPMF(k, n, p), 5));
    }

    redraw();
  }, {
    title: "De dónde sale el combinatorio: enumerar las secuencias",
    page: "distribucion-binomial", kind: "interactive", unidad: "3"
  });

  // ============================================================
  //  7) Población, conjunto A y muestra: de dónde sale el recorrido
  // ============================================================
  A.registerFigure("u3-poblacion-conjunto-a-y-muestra-de-donde-sale-el-", function (host, api) {
    var F = api.Fig;
    var W = 660, HT = 230, HB = 120;
    var pnl = F.panels(host, 2, { w: W, heights: [HT, HB], gap: 6 });

    var ctl = F.controls(host, [
      { k: "N", label: "N (población)", min: 10, max: 100, step: 1, value: 40, dec: 0 },
      { k: "M", label: "M (especiales)", min: 0, max: 100, step: 1, value: 30, dec: 0 },
      { k: "n", label: "n (muestra)", min: 1, max: 100, step: 1, value: 25, dec: 0 }
    ], function () { redraw(); });

    F.buttons(host, [
      {
        label: "N = 40, M = 30, n = 25",
        title: "el mínimo deja de ser 0: la muestra no entra entera en el complemento",
        onClick: function () { ctl.set("N", 40); ctl.set("M", 30); ctl.set("n", 25); redraw(); }
      },
      {
        label: "N = 40, M = 3, n = 10",
        title: "hay pocos especiales: el máximo es M, no n",
        onClick: function () { ctl.set("N", 40); ctl.set("M", 3); ctl.set("n", 10); redraw(); }
      },
      {
        label: "N = 100, M = 40, n = 5",
        title: "caso holgado: el recorrido es {0, …, n}",
        onClick: function () { ctl.set("N", 100); ctl.set("M", 40); ctl.set("n", 5); redraw(); }
      }
    ]);

    var out = F.readouts(host, [
      { k: "comp", tex: "N-M" },
      { k: "lo", tex: "\\min \\mathcal{R}_X = \\max\\{0,\\, n-(N-M)\\}" },
      { k: "hi", tex: "\\max \\mathcal{R}_X = \\min\\{n,\\, M\\}" },
      { k: "card", label: "valores posibles" }
    ]);

    F.legend(host, [
      { label: "conjunto A (M especiales)", color: F.series(1), fill: true },
      { label: "complemento (N − M)", color: F.color("border-2"), fill: true },
      { label: "muestra de tamaño n", color: F.series(2) }
    ]);

    var gT = F.el("g", null, pnl[0]);
    var gB = F.el("g", null, pnl[1]);

    function fila(g, sx, y, N, Mm, n, desde, titulo, kVal) {
      var cTxt = F.color("text-2"), cT3 = F.color("text-3");
      var h = 26;
      F.text(g, 24, y - 34, titulo, { size: 12, baseline: "hanging", fill: cTxt, weight: 600 });
      // población: [0, M] especiales, [M, N] complemento
      F.el("rect", {
        x: sx(0), y: y, width: sx(Mm) - sx(0), height: h,
        fill: F.mix(F.series(1), F.color("surface"), 0.62),
        stroke: F.color("border-2"), "stroke-width": 1
      }, g);
      F.el("rect", {
        x: sx(Mm), y: y, width: sx(N) - sx(Mm), height: h,
        fill: F.color("surface-3"), stroke: F.color("border-2"), "stroke-width": 1
      }, g);
      if (Mm > 0) F.text(g, (sx(0) + sx(Mm)) / 2, y + h / 2, "A = " + Mm, {
        size: 11, anchor: "middle", baseline: "middle", fill: cTxt, mono: true
      });
      if (N - Mm > 0) F.text(g, (sx(Mm) + sx(N)) / 2, y + h / 2, String(N - Mm), {
        size: 11, anchor: "middle", baseline: "middle", fill: cT3, mono: true
      });
      // ventana de la muestra
      var a = sx(desde), b = sx(desde + n);
      F.el("rect", {
        x: a, y: y - 9, width: b - a, height: h + 18, rx: 4,
        fill: "none", stroke: F.series(2), "stroke-width": 2
      }, g);
      F.label(g, (a + b) / 2, y + h + 12, "muestra n = " + n, {
        size: 11, anchor: "middle", baseline: "hanging", mono: true, keyColor: F.series(2)
      });
      // solapamiento con A
      var oa = Math.max(sx(0), a), ob = Math.min(sx(Mm), b);
      if (ob > oa) {
        F.el("rect", {
          x: oa, y: y, width: ob - oa, height: h,
          fill: F.mix(F.series(2), F.color("surface"), 0.42)
        }, g);
      }
      F.label(g, W - 22, y + h / 2, "k = " + kVal, {
        size: 12, anchor: "end", baseline: "middle", mono: true, weight: 600, keyColor: F.series(2)
      });
    }

    function redraw() {
      while (gT.firstChild) gT.removeChild(gT.firstChild);
      while (gB.firstChild) gB.removeChild(gB.firstChild);

      var N = iround(ctl.get("N"));
      var Mm = iround(ctl.get("M"));
      if (Mm > N) { Mm = N; ctl.set("M", Mm); }
      var n = iround(ctl.get("n"));
      if (n > N) { n = N; ctl.set("n", n); }
      if (n < 1) n = 1;

      var lo = Math.max(0, n - (N - Mm));
      var hi = Math.min(n, Mm);

      var sx = F.scale([0, N], [40, W - 96]);
      fila(gT, sx, 54, N, Mm, n, N - n, "mínimo solapamiento posible", lo);
      fila(gT, sx, 152, N, Mm, n, 0, "máximo solapamiento posible", hi);

      // --- eje del recorrido ---
      var padB = { l: 46, r: 26, t: 34, b: 40 };
      var sk = F.scale([-0.6, n + 0.6], [padB.l, W - padB.r]);
      var yk = HB - padB.b;
      var gEje = F.el("g", { class: "fig-axes" }, gB);
      F.el("line", {
        x1: sk(-0.6), y1: yk, x2: sk(n + 0.6), y2: yk,
        stroke: F.color("plot-axis"), "stroke-width": 1.2
      }, gEje);
      F.el("rect", {
        x: sk(lo - 0.45), y: yk - 16, width: Math.max(2, sk(hi + 0.45) - sk(lo - 0.45)), height: 32,
        rx: 5, fill: F.mix(F.series(2), F.color("surface"), 0.80)
      }, gB);
      var stepK = Math.max(1, Math.ceil((n + 1) / 24));
      for (var kk = 0; kk <= n; kk += stepK) {
        var dentro = kk >= lo && kk <= hi;
        F.el("circle", {
          cx: sk(kk), cy: yk, r: dentro ? 4.6 : 2.6,
          fill: dentro ? F.series(2) : F.color("border-2")
        }, gB);
      }
      // los cuatro valores que importan se rotulan siempre, caigan o no en el paso
      var marcas = {}, mk;
      [[0, false], [n, false], [lo, true], [hi, true]].forEach(function (m) {
        if (marcas[m[0]] == null || m[1]) marcas[m[0]] = m[1];
      });
      for (mk in marcas) {
        if (!Object.prototype.hasOwnProperty.call(marcas, mk)) continue;
        var vk = +mk;
        F.el("circle", {
          cx: sk(vk), cy: yk, r: vk >= lo && vk <= hi ? 4.6 : 2.6,
          fill: vk >= lo && vk <= hi ? F.series(2) : F.color("border-2")
        }, gB);
        F.text(gB, sk(vk), yk + 10, String(vk), {
          size: 11, anchor: "middle", baseline: "hanging",
          fill: marcas[mk] ? F.color("text-2") : F.color("text-3"), mono: true
        });
      }
      F.text(gB, padB.l, 8, "recorrido Rₓ = {" + lo + ", …, " + hi + "}", {
        size: 12.5, baseline: "hanging", fill: F.color("text-2"), weight: 600
      });
      F.text(gB, W - padB.r, 8,
        lo > 0 ? "el mínimo no es 0" : (hi < n ? "el máximo no es n" : "caso holgado"), {
        size: 11.5, anchor: "end", baseline: "hanging", fill: F.color("text-3")
      });

      out.set("comp", String(N - Mm));
      out.set("lo", String(lo));
      out.set("hi", String(hi));
      out.set("card", String(hi - lo + 1));
    }

    redraw();
  }, {
    title: "Población, conjunto A y muestra: de dónde sale el recorrido",
    page: "distribucion-hipergeometrica", kind: "interactive", unidad: "3"
  });

  // ============================================================
  //  8) N creciente con p = M/N fijo: hipergeométrica → binomial
  // ============================================================
  A.registerFigure("u3-n-creciente-con-p-m-n-fijo-la-hipergeometrica-se", function (host, api) {
    var F = api.Fig;
    var W = 660, HT = 250, HB = 130;
    var pnl = F.panels(host, 2, { w: W, heights: [HT, HB], gap: 4 });
    var padT = { l: 58, r: 16, t: 16, b: 46 };
    var padB = { l: 58, r: 16, t: 14, b: 34 };

    var ctl = F.controls(host, [
      { k: "N", label: "N (población)", min: 20, max: 2000, step: 10, value: 50, dec: 0 },
      { k: "p", label: "p = M/N (objetivo)", min: 0.05, max: 0.95, step: 0.01, value: 0.4, dec: 2 },
      { k: "n", label: "n (muestra)", min: 1, max: 120, step: 1, value: 20, dec: 0 }
    ], function () { redraw(); });

    F.buttons(host, [
      {
        label: "N = 1000, n = 5",
        title: "n muy chico frente a N: las dos PMF casi coinciden",
        onClick: function () { ctl.set("N", 1000); ctl.set("n", 5); ctl.set("p", 0.4); redraw(); }
      },
      {
        label: "N = 1000, n = 100",
        title: "n deja de ser chico frente a N: aparece una diferencia apreciable",
        onClick: function () { ctl.set("N", 1000); ctl.set("n", 100); ctl.set("p", 0.4); redraw(); }
      },
      {
        label: "N = 50, n = 50",
        title: "caso extremo n = N: la hipergeométrica es degenerada y su varianza se anula",
        onClick: function () { ctl.set("N", 50); ctl.set("n", 50); ctl.set("p", 0.4); redraw(); }
      }
    ]);

    var out = F.readouts(host, [
      { k: "M", label: "M = round(p·N)" },
      { k: "fac", tex: "\\dfrac{N-n}{N-1}" },
      { k: "vh", tex: "V_{\\mathcal H} = npq\\dfrac{N-n}{N-1}" },
      { k: "vb", tex: "V_{\\text{Bi}} = npq" },
      { k: "err", label: "máx |ΔP|" }
    ]);

    F.legend(host, [
      { label: "Hipergeométrica(N, M, n)", color: F.series(1), fill: true },
      { label: "Binomial(n, p = M/N)", color: F.series(2), fill: true },
      { label: "diferencia Hiperg. − Binomial", color: F.series(3), fill: true }
    ]);

    var gT = F.el("g", null, pnl[0]);
    var gB = F.el("g", null, pnl[1]);

    function redraw() {
      while (gT.firstChild) gT.removeChild(gT.firstChild);
      while (gB.firstChild) gB.removeChild(gB.firstChild);

      var N = iround(ctl.get("N"));
      var n = iround(ctl.get("n"));
      if (n > N) { n = N; ctl.set("n", n); }
      var pTarget = ctl.get("p");
      var Mm = clamp(iround(pTarget * N), 0, N);
      var p = Mm / N;
      var q = 1 - p;

      var lo = Math.max(0, n - (N - Mm));
      var hi = Math.min(n, Mm);
      // la binomial vive en 0…n; se muestra el rango completo para que se vea
      // cuándo la hipergeométrica tiene soporte estrictamente menor
      var k0 = 0, k1 = n;
      if (n > 160) { k0 = Math.max(0, Math.floor(n * p - 80)); k1 = Math.min(n, k0 + 160); }
      var ks = range(k0, k1), ph = [], pb = [], i;
      for (i = 0; i < ks.length; i++) {
        ph.push(M.hyperPMF(ks[i], N, Mm, n));
        pb.push(M.binomPMF(ks[i], n, p));
      }

      var sc = twoPMF(F, gT, W, HT, padT, ks, ph, pb, {
        colorA: F.series(1), colorB: F.series(2),
        serieA: "Hipergeométrica", serieB: "Binomial",
        xLabel: "k (especiales en la muestra)"
      });
      if (lo > 0 || hi < n) {
        F.text(gT, W - padT.r, padT.t, "soporte: {" + lo + ", …, " + hi + "}", {
          size: 11, anchor: "end", baseline: "hanging", fill: F.color("text-3"), mono: true
        });
      }
      var maxd = diffPanel(F, gB, W, HB, padB, ks, ph, pb, {
        color: F.series(3), note: "diferencia Hiperg. − Binomial"
      });

      var fac = N > 1 ? (N - n) / (N - 1) : 0;
      out.set("M", String(Mm));
      out.set("fac", F.fmt(fac, 4));
      out.set("vh", F.fmt(n * p * q * fac, 4));
      out.set("vb", F.fmt(n * p * q, 4));
      out.set("err", maxd < 1e-4 ? maxd.toExponential(2) : F.fmt(maxd, 5));
      return sc;
    }

    redraw();
  }, {
    title: "N creciente con p = M/N fijo: la hipergeométrica se vuelve binomial",
    page: "distribucion-hipergeometrica", kind: "interactive", unidad: "3"
  });

  // ============================================================
  //  9) La tira de ensayos de la binomial negativa
  // ============================================================
  A.registerFigure("u3-la-tira-de-ensayos-por-que-c-k-r1-k-y-no-c-k-r-k", function (host, api) {
    var F = api.Fig;
    var W = 660, HT = 210, HB = 160;
    var pnl = F.panels(host, 2, { w: W, heights: [HT, HB], gap: 6 });

    var ctl = F.controls(host, [
      { k: "r", label: "r (éxitos buscados)", min: 1, max: 5, step: 1, value: 3, dec: 0 },
      { k: "k", label: "k (fracasos)", min: 0, max: 10, step: 1, value: 4, dec: 0 },
      { k: "p", label: "p (éxito)", min: 0.05, max: 0.95, step: 0.05, value: 0.4, dec: 2 }
    ], function () { redraw(); });

    F.buttons(host, [
      {
        label: "nueva disposición",
        title: "otra manera válida de repartir los k fracasos y los r−1 éxitos previos",
        onClick: function () { api.state.seed = (api.state.seed || 1) + 1; redraw(); }
      },
      {
        label: "r = 1 (caso geométrico)",
        onClick: function () { ctl.set("r", 1); redraw(); }
      }
    ]);

    var out = F.readouts(host, [
      { k: "c", tex: "\\binom{k+r-1}{k}" },
      { k: "cmal", tex: "\\binom{k+r}{k}\\ \\text{(incorrecto)}" },
      { k: "seq", tex: "q^{k}p^{r}" },
      { k: "tot", tex: "P(X=k)" }
    ]);

    F.legend(host, [
      { label: "éxito (E) en la tira", color: F.series(1), fill: true },
      { label: "fracaso (F)", color: F.color("border-2"), fill: true },
      { label: "r-ésimo éxito, posición fija", color: F.series(2) }
    ]);

    var gT = F.el("g", null, pnl[0]);
    var gB = F.el("g", null, pnl[1]);

    function redraw() {
      while (gT.firstChild) gT.removeChild(gT.firstChild);
      while (gB.firstChild) gB.removeChild(gB.firstChild);

      var r = iround(ctl.get("r"));
      var k = iround(ctl.get("k"));
      var p = ctl.get("p"), q = 1 - p;
      var total = k + r;
      var cTxt = F.color("text-2"), cT3 = F.color("text-3");

      // reparto reproducible de los r−1 éxitos entre las primeras k+r−1 casillas
      var u = F.rng(api.state.seed || 1);
      var libres = total - 1;
      var idx = [], i;
      for (i = 0; i < libres; i++) idx.push(i);
      for (i = libres - 1; i > 0; i--) {                 // Fisher-Yates con u
        var j = u.int(i + 1), t = idx[i]; idx[i] = idx[j]; idx[j] = t;
      }
      var exitos = {};
      for (i = 0; i < r - 1; i++) exitos[idx[i]] = 1;

      var cw = Math.min(40, Math.floor((W - 120) / Math.max(1, total)));
      var ch = 32;
      var x0 = (W - (cw * total)) / 2;
      var y0 = 78;

      F.text(gT, W / 2, 14, "una tira de k + r = " + total + " ensayos", {
        size: 12.5, anchor: "middle", baseline: "hanging", fill: cTxt, weight: 600
      });

      // llave sobre las primeras k+r−1 casillas
      var bx0 = x0, bx1 = x0 + cw * libres;
      F.path(gT, "M" + bx0 + " " + (y0 - 10) + "v-8h" + (bx1 - bx0) + "v8", {
        stroke: F.series(1), width: 2
      });
      F.label(gT, (bx0 + bx1) / 2, y0 - 26, "k + r − 1 = " + libres + " permutables", {
        size: 11.5, anchor: "middle", baseline: "auto", keyColor: F.series(1)
      });

      for (i = 0; i < total; i++) {
        var last = i === total - 1;
        var ok = last || !!exitos[i];
        F.el("rect", {
          x: x0 + i * cw, y: y0, width: cw - 4, height: ch, rx: 4,
          fill: ok ? F.mix(F.series(1), F.color("surface"), last ? 0.42 : 0.58)
            : F.color("surface-3"),
          stroke: last ? F.series(2) : F.color("border-2"),
          "stroke-width": last ? 2 : 1
        }, gT);
        F.text(gT, x0 + i * cw + (cw - 4) / 2, y0 + ch / 2, ok ? "E" : "F", {
          size: 13, anchor: "middle", baseline: "middle",
          fill: ok ? cTxt : cT3, mono: true, weight: 700
        });
        F.text(gT, x0 + i * cw + (cw - 4) / 2, y0 + ch + 6, String(i + 1), {
          size: 10, anchor: "middle", baseline: "hanging", fill: cT3, mono: true
        });
      }

      // Por qué la última casilla no se permuta (si el r-ésimo éxito cayera
      // antes, la serie ya habría terminado) está en el epígrafe del callout
      // [!figura] de la página del wiki, junto con la comparación de los dos
      // combinatorios; acá quedan solo los rótulos de marca.
      var xUlt = bx1 + (cw - 4) / 2;
      F.line(gT, [[xUlt, y0 + ch + 24], [xUlt, y0 + ch + 34]], {
        stroke: F.series(2), width: 1.5, cls: "fig-ref", serie: false
      });
      F.label(gT, xUlt, y0 + ch + 40, "posición fija", {
        size: 11.5, anchor: "middle", baseline: "hanging", keyColor: F.series(2)
      });

      // --- panel inferior: PMF de la binomial negativa ---
      var kmax = 10;
      var ks = range(0, kmax);
      var pmf = ks.map(function (kk) { return M.negbinPMF(kk, r, p); });
      var padB = { l: 56, r: 18, t: 20, b: 42 };
      var sx = F.scale([-0.6, kmax + 0.6], [padB.l, W - padB.r]);
      var sy = F.scale([0, Math.max.apply(null, pmf) * 1.25], [HB - padB.b, padB.t]);
      F.axes(gB, {
        sx: sx, sy: sy, xTicks: ks, yTicks: 3,
        xLabel: "k (fracasos antes del r-ésimo éxito)", yLabel: "P(X = k)", y0: 0
      });
      var wB = anchoBarra(sx, 0.62, 22);
      F.bars(gB, ks.map(function (kk, j) { return [kk, pmf[j]]; }), sx, sy,
        { width: wB, fill: F.series(1), serie: "P(X = k)" });
      F.bars(gB, [[k, pmf[k]]], sx, sy, { width: wB, fill: F.series(2), serie: "k elegido" });

      out.set("c", String(M.comb(k + r - 1, k)));
      out.set("cmal", String(M.comb(k + r, k)));
      out.set("seq", F.fmt(Math.pow(q, k) * Math.pow(p, r), 6));
      out.set("tot", F.fmt(M.negbinPMF(k, r, p), 6));
    }

    redraw();
  }, {
    title: "La tira de ensayos: por qué C(k+r−1, k) y no C(k+r, k)",
    page: "distribucion-binomial-negativa", kind: "interactive", unidad: "3"
  });

  // ============================================================
  // 10) Mapa de las seis discretas (estática)
  // ============================================================
  A.registerFigure("u3-mapa-de-las-seis-discretas-y-los-pasajes-entre-e", function (host, api) {
    var F = api.Fig;
    var W = 660, HT = 330, HB = 214;
    var pnl = F.panels(host, 2, { w: W, heights: [HT, HB], gap: 8 });
    var gT = F.el("g", null, pnl[0]);
    var gB = F.el("g", null, pnl[1]);

    var cU = F.series(1), cAc = F.series(2), cT3 = F.color("text-3");

    var nodes = [
      { id: "ber", x: 82, y: 78, label: "Ber(p)", fill: F.color("surface-2") },
      { id: "bi", x: 310, y: 78, label: "Bi(n,p)", fill: F.color("surface-2") },
      { id: "po", x: 566, y: 78, label: "Po(λ)", fill: F.color("surface-2") },
      { id: "hip", x: 480, y: 248, label: "H(N,M,n)", fill: F.color("surface-2"), size: 11 },
      { id: "geo", x: 82, y: 248, label: "Geo(p)", fill: F.color("surface-2") },
      { id: "bn", x: 268, y: 248, label: "BN(r,p)", fill: F.color("surface-2") }
    ];
    // rótulo de arista en tokens de texto: el color lo lleva la flecha
    var edges = [
      { from: "ber", to: "bi", label: "suma de n", color: cU, width: 2, labelFill: cT3 },
      { from: "bi", to: "ber", label: "n = 1", curve: 34, color: cAc, dash: "5 4", width: 2, labelFill: cT3 },
      { from: "bi", to: "po", label: "n→∞, p→0, np = λ", color: cU, width: 2, labelFill: cT3 },
      { from: "hip", to: "bi", label: "N→∞, M/N→p", color: cU, width: 2, labelFill: cT3 },
      { from: "geo", to: "bn", label: "suma de r", color: cU, width: 2, labelFill: cT3 },
      { from: "bn", to: "geo", label: "r = 1", curve: 34, color: cAc, dash: "5 4", width: 2, labelFill: cT3 }
    ];

    F.text(gT, W / 2, 12, "pasajes entre las discretas", {
      size: 12.5, anchor: "middle", baseline: "hanging", fill: F.color("text-2"), weight: 600
    });
    F.graph(gT, { nodes: nodes, edges: edges, r: 38, stroke: F.color("plot-axis") });

    F.label(gT, 24, HT - 28, "continua: límite o suma", {
      size: 11, baseline: "hanging", keyColor: cU
    });
    F.label(gT, 24, HT - 14, "punteada: caso particular", {
      size: 11, baseline: "hanging", keyColor: cAc
    });

    // --- tabla de recorrido, E y V ---
    var filas = [
      ["Bernoulli(p)", "{0, 1}", "p", "pq"],
      ["Binomial(n, p)", "{0, …, n}", "np", "npq"],
      ["Geométrica(p)", "ℕ₀", "q/p", "q/p²"],
      ["BinNeg(r, p)", "ℕ₀", "rq/p", "rq/p²"],
      ["Hipergeom.(N,M,n)", "{máx(0,n−N+M), …, mín(n,M)}", "np, p = M/N", "npq·(N−n)/(N−1)"],
      ["Poisson(λ)", "ℕ₀", "λ", "λ"]
    ];
    var cols = [16, 152, 372, 494];
    var cabec = ["distribución", "recorrido", "E[X]", "V(X)"];
    var i, j;
    for (j = 0; j < cabec.length; j++) {
      F.text(gB, cols[j], 8, cabec[j], { size: 11.5, baseline: "hanging", fill: cT3, weight: 600 });
    }
    F.el("line", {
      x1: 12, y1: 26, x2: W - 12, y2: 26,
      stroke: F.color("border-2"), "stroke-width": 1
    }, F.el("g", { class: "fig-axes" }, gB));
    for (i = 0; i < filas.length; i++) {
      var y = 38 + i * 25;
      if (i % 2 === 1) {
        F.el("rect", { x: 12, y: y - 6, width: W - 24, height: 24, fill: F.color("surface-2"), opacity: 0.7 }, gB);
      }
      for (j = 0; j < 4; j++) {
        F.text(gB, cols[j], y, filas[i][j], {
          size: j === 0 ? 11.5 : 11, baseline: "hanging",
          fill: j === 0 ? F.color("text-2") : F.color("text-3"), mono: j > 0
        });
      }
    }
    var yPie = 38 + filas.length * 25 + 8;
    F.text(gB, 16, yPie, "hipergeométrica → binomial:", {
      size: 11, baseline: "hanging", fill: F.color("text-2")
    });
    F.text(gB, W - 12, yPie, "coincide E[X], no V(X)", {
      size: 11, anchor: "end", baseline: "hanging", fill: cT3
    });

    return null;
  }, {
    title: "Mapa de las seis discretas y los pasajes entre ellas",
    page: "reconocer-distribucion-discreta", kind: "static", unidad: "3"
  });

})();
