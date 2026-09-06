/* ============================================================
   figuras/u8.js — figuras de la Unidad 8 (inferencia: estimación puntual
   e intervalos de confianza).

   Se carga DESPUÉS de figures.js (necesita App.registerFigure) y de
   lib-math.js (window.M, del que salen TODOS los valores numéricos: no hay
   ninguna aproximación dibujada "a ojo").

   Figuras registradas
     u8-ic-cobertura-frecuentista          100 intervalos simulados vs. γ
     u8-descomposicion-sesgo-varianza      ECM = varianza + sesgo²
     u8-verosimilitud-borde-vs-interior    máximo interior vs. máximo en el borde
     u8-superficie-log-verosimilitud-normal  ln L(μ, σ) como superficie 3D
     u8-map-prior-verosimilitud-posterior  el MAP entre el prior y los datos
     u8-t-vs-normal-y-fractiles            colas de t_m y fractiles vs. z
     u8-ji-cuadrado-dos-colas-ic-varianza  IC de σ² y la inversión de extremos
     u8-por-que-n-menos-1                  la parábola Σ(xᵢ−c)² y el n−1
   ============================================================ */
(function () {
  "use strict";

  var A = window.App;
  if (!A || typeof A.registerFigure !== "function") return;
  var M = window.M || {};

  // ---------- utilidades locales ----------

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function iround(v) { return Math.round(v); }

  function mean(a) {
    var s = 0, i;
    for (i = 0; i < a.length; i++) s += a[i];
    return a.length ? s / a.length : 0;
  }
  // suma de cuadrados respecto de un centro c
  function sumSq(a, c) {
    var s = 0, i, d;
    for (i = 0; i < a.length; i++) { d = a[i] - c; s += d * d; }
    return s;
  }
  function maxOf(a) { return Math.max.apply(null, a); }
  function minOf(a) { return Math.min.apply(null, a); }

  // flecha recta con punta rellena
  function arrow(F, layer, x1, y1, x2, y2, col, o) {
    o = o || {};
    F.line(layer, [[x1, y1], [x2, y2]], {
      stroke: col, width: o.width == null ? 1.4 : o.width, dash: o.dash,
      cls: "fig-ref", serie: false
    });
    var ang = Math.atan2(y2 - y1, x2 - x1);
    var L = o.head == null ? 7 : o.head, w = L * 0.45;
    var ax = x2 - L * Math.cos(ang), ay = y2 - L * Math.sin(ang);
    var d = "M" + x2 + " " + y2 +
      "L" + (ax + w * Math.sin(ang)) + " " + (ay - w * Math.cos(ang)) +
      "L" + (ax - w * Math.sin(ang)) + " " + (ay + w * Math.cos(ang)) + "Z";
    F.path(layer, d, { fill: col });
    if (o.back) {
      var bx = x1 + L * Math.cos(ang), by = y1 + L * Math.sin(ang);
      var d2 = "M" + x1 + " " + y1 +
        "L" + (bx + w * Math.sin(ang)) + " " + (by - w * Math.cos(ang)) +
        "L" + (bx - w * Math.sin(ang)) + " " + (by + w * Math.cos(ang)) + "Z";
      F.path(layer, d2, { fill: col });
    }
  }

  // Conector ortogonal entre dos puntos, con la punta hacia abajo.
  // o.ym fija la altura del tramo horizontal: cuando se dibujan DOS conectores
  // que se cruzan hay que darles corredores distintos, porque con la altura
  // por omisión (y1+y2)/2 los dos tramos horizontales caen en la misma y, se
  // superponen y el cruce deja de verse.
  function elbow(F, layer, x1, y1, x2, y2, col, o) {
    o = o || {};
    var ym = o.ym == null ? (y1 + y2) / 2 : o.ym;
    F.line(layer, [[x1, y1], [x1, ym], [x2, ym], [x2, y2 - 7]], {
      stroke: col, width: o.width == null ? 1.3 : o.width, dash: o.dash || "5 4",
      cls: "fig-ref", serie: false
    });
    arrow(F, layer, x2, y2 - 12, x2, y2, col, { width: 1.3 });
    if (o.label) {
      F.label(layer, (x1 + x2) / 2, ym - 5, o.label, {
        anchor: "middle", size: 11, fill: F.color("text-2"), keyColor: o.labelKey || col
      });
    }
  }

  // Trama de rayas diagonales reutilizable. figures.js crea una <pattern>
  // nueva en cada llamada a Fig.area({hatch}); aquí hace falta una que
  // SOBREVIVA a los redibujos sin acumular nodos en <defs>, así que se
  // cachea por (svg, color) y sólo se actualiza el trazo.
  var hatchSeq = 0;
  function hatchFill(F, svg, stroke, size, angle) {
    var defs = F.defs(svg);
    var key = "u8hatch";
    var pat = defs.querySelector('pattern[data-key="' + key + '"]');
    if (!pat) {
      var id = "u8h" + (++hatchSeq) + "-" + Math.round(Math.random() * 1e6);
      pat = F.el("pattern", {
        id: id, "data-key": key,
        width: size || 6, height: size || 6,
        patternUnits: "userSpaceOnUse",
        patternTransform: "rotate(" + (angle == null ? 45 : angle) + ")"
      }, defs);
      F.el("line", { x1: 0, y1: 0, x2: 0, y2: size || 6, "stroke-width": 2 }, pat);
    }
    pat.firstChild.setAttribute("stroke", stroke);
    return "url(#" + pat.getAttribute("id") + ")";
  }

  // muestra normal reproducible
  function normalSample(F, seed, n, mu, sd) {
    var u = F.rng(seed), out = [], i;
    for (i = 0; i < n; i++) out.push(u.normal(mu, sd));
    return out;
  }

  // ============================================================
  //  1) ¿Qué significa "90 % de confianza"? — 100 intervalos simulados
  // ============================================================
  A.registerFigure("u8-ic-cobertura-frecuentista", function (host, api) {
    var F = api.Fig;
    // Alto generoso a propósito: con cien filas y el trazo de dato de 2 px hace
    // falta que cada intervalo tenga su propio renglón, sin que se toquen.
    var W = 680, H = 640;
    var MU0 = 10, SIG = 2, REP = 100;
    var pad = { l: 58, r: 20, t: 26, b: 48 };

    var svg = F.svg(host, { w: W, h: H, title: "Cien intervalos de confianza simulados sobre el mismo μ" });

    var ctl = F.controls(host, [
      { k: "gamma", tex: "\\gamma\\ \\text{(confianza)}", min: 0.50, max: 0.99, step: 0.01, value: 0.90, dec: 2 },
      { k: "n", label: "n (tamaño de cada muestra)", min: 2, max: 100, step: 1, value: 12, dec: 0 }
    ], function () { redraw(); });

    F.buttons(host, [{
      label: "Nueva tanda",
      title: "vuelve a simular las 100 muestras con otra semilla",
      onClick: function () { api.state.seed = (api.state.seed || 1) + 1; redraw(); }
    }]);

    var out = F.readouts(host, [
      { k: "cob", label: "intervalos que contienen μ" },
      { k: "prop", label: "proporción observada" },
      { k: "z", tex: "z_{(1+\\gamma)/2}" },
      { k: "delta", tex: "\\Delta = z_{(1+\\gamma)/2}\\,\\sigma/\\sqrt{n}" }
    ]);

    F.legend(host, [
      { label: "intervalo que contiene μ", color: F.status("good") },
      { label: "intervalo que no lo contiene", color: F.status("bad") },
      { label: "μ verdadero", color: F.color("text"), dash: true }
    ]);

    var layer = F.el("g", null, svg);

    function zetas() {
      var u = F.rng(1000 + (api.state.seed || 1) * 37), z = [], i;
      for (i = 0; i < REP; i++) z.push(u.normal(0, 1));
      return z;
    }

    function redraw() {
      while (layer.firstChild) layer.removeChild(layer.firstChild);

      var g = ctl.get("gamma");
      var n = clamp(iround(ctl.get("n")), 2, 100);
      var z = zetas();
      var zc = M.normInv((1 + g) / 2, 0, 1);
      var se = SIG / Math.sqrt(n);
      var half = zc * se;

      // x̄ᵢ = μ + (σ/√n)·zᵢ  →  el intervalo cubre μ ⟺ |zᵢ| ≤ z_{(1+γ)/2}
      var lo = Infinity, hi = -Infinity, i, xb = [], cov = 0;
      for (i = 0; i < REP; i++) {
        xb.push(MU0 + se * z[i]);
        if (Math.abs(z[i]) <= zc) cov++;
        if (xb[i] - half < lo) lo = xb[i] - half;
        if (xb[i] + half > hi) hi = xb[i] + half;
      }
      var pad2 = (hi - lo) * 0.06;
      var sx = F.scale([lo - pad2, hi + pad2], [pad.l, W - pad.r]);
      var rowTop = pad.t + 8, rowBot = H - pad.b;
      var step = (rowBot - rowTop) / REP;

      // eje horizontal solo (las filas no son una magnitud)
      var sy = F.scale([0, 1], [rowBot, rowTop]);
      F.axes(layer, {
        sx: sx, sy: sy, xTicks: 7, yTicks: false, grid: false,
        xLabel: "valor del parámetro", y0: 0
      });
      // La rejilla vertical se dibuja a mano (las filas no son una magnitud),
      // pero va dentro de un grupo .fig-grid: es mobiliario del eje, no dato.
      var gGrid = F.el("g", { class: "fig-grid" }, layer);
      F.ticks(sx.domain()[0], sx.domain()[1], 7).forEach(function (v) {
        F.line(gGrid, [[sx(v), rowTop - 4], [sx(v), rowBot]], {
          stroke: F.color("plot-grid"), width: 1, serie: false
        });
      });

      // --good / --bad como ESTADO (cubre μ / no lo cubre), con su rótulo en la
      // leyenda: no son identidad de serie, y por eso no se registran como tal.
      var cOk = F.status("good"), cBad = F.status("bad");
      for (i = 0; i < REP; i++) {
        var y = rowTop + (i + 0.5) * step;
        var ok = Math.abs(z[i]) <= zc;
        var col = ok ? cOk : cBad;
        var gRow = F.el("g", null, layer);
        F.el("title", null, gRow).textContent =
          "muestra " + (i + 1) + ": x̄ = " + F.fmt(xb[i], 3) +
          ", intervalo (" + F.fmt(xb[i] - half, 3) + " ; " + F.fmt(xb[i] + half, 3) + ")";
        F.line(gRow, [[sx(xb[i] - half), y], [sx(xb[i] + half), y]], {
          stroke: col, width: 2, opacity: ok ? 0.78 : 1, serie: false
        });
        // En una tira de cien filas la marca es el renglón entero; el centro se
        // señala con un punto pequeño, no con un marcador de lectura.
        F.el("circle", {
          cx: sx(xb[i]), cy: y, r: 2.2, fill: col, opacity: ok ? 0.85 : 1
        }, gRow);
      }

      F.vline(layer, sx(MU0), {
        y0: pad.t - 6, y1: rowBot, stroke: F.color("text"), dash: "6 4"
      });
      F.text(layer, sx(MU0), pad.t - 10, "μ = " + MU0 + " (verdadero)", {
        anchor: "middle", size: 12, fill: F.color("text-2"), weight: 600
      });
      F.text(layer, pad.l, pad.t - 10, "σ = " + SIG + " conocido · 100 muestras", {
        size: 11, fill: F.color("text-3")
      });

      out.set("cob", cov + " de " + REP);
      out.set("prop", F.fmt(cov / REP, 2));
      out.set("z", F.fmt(zc, 3));
      out.set("delta", F.fmt(half, 3));
      api.state.__cob = cov;
      api.state.__half = half;
      api.state.__zc = zc;
    }

    redraw();
  }, { title: "Cobertura frecuentista de 100 intervalos", page: "intervalos-de-confianza", kind: "interactive", unidad: "8" });

  // ============================================================
  //  2) ECM = varianza + sesgo²
  // ============================================================
  A.registerFigure("u8-descomposicion-sesgo-varianza", function (host, api) {
    var F = api.Fig;
    var W = 660, HT = 250, HB = 158;
    var pnl = F.panels(host, 2, { w: W, heights: [HT, HB], gap: 6 });
    var svgT = pnl[0], svgB = pnl[1];
    var padT = { l: 66, r: 18, t: 30, b: 44 };
    var padB = { l: 66, r: 18, t: 20, b: 40 };

    var ctl = F.controls(host, [
      { k: "b1", label: "sesgo del estimador ①", min: -2, max: 2, step: 0.05, value: 0, dec: 2 },
      { k: "s1", label: "desvío del estimador ①", min: 0.15, max: 2, step: 0.05, value: 1.00, dec: 2 },
      { k: "b2", label: "sesgo del estimador ②", min: -2, max: 2, step: 0.05, value: 0.80, dec: 2 },
      { k: "s2", label: "desvío del estimador ②", min: 0.15, max: 2, step: 0.05, value: 0.45, dec: 2 },
      { k: "n", label: "n (los desvíos van como 1/√n)", min: 1, max: 40, step: 1, value: 1, dec: 0 }
    ], function () { redraw(); });

    var tg = F.toggle(host, {
      k: "ver2", label: "mostrar el segundo estimador", value: true
    }, function () { redraw(); });

    var out = F.readouts(host, [
      { k: "e1", tex: "\\mathrm{mse}(\\hat\\theta_1)" },
      { k: "e2", tex: "\\mathrm{mse}(\\hat\\theta_2)" },
      { k: "cual", label: "menor ECM" }
    ]);

    F.legend(host, [
      { label: "estimador ①", color: F.series(1) },
      { label: "estimador ②", color: F.series(2), dash: true },
      { label: "varianza V(θ̂): tramo liso", color: F.series(1), fill: true, alpha: 0.5 },
      { label: "sesgo²: tramo rayado", color: F.series(3), fill: true, alpha: 0.5 },
      { label: "θ verdadero", color: F.color("text"), dash: true }
    ]);

    var layT = F.el("g", null, svgT);
    var layB = F.el("g", null, svgB);

    function redraw() {
      while (layT.firstChild) layT.removeChild(layT.firstChild);
      while (layB.firstChild) layB.removeChild(layB.firstChild);

      var n = clamp(iround(ctl.get("n")), 1, 40);
      var rn = Math.sqrt(n);
      var two = tg.get();
      var est = [
        { b: ctl.get("b1"), s: ctl.get("s1") / rn, col: F.series(1), dash: null, tag: "①" }
      ];
      if (two) est.push({ b: ctl.get("b2"), s: ctl.get("s2") / rn, col: F.series(2), dash: "6 4", tag: "②" });
      est.forEach(function (e) { e.mse = e.s * e.s + e.b * e.b; });

      // ---- panel superior: densidades de muestreo sobre el eje de θ ----
      var R = 0.6, i;
      for (i = 0; i < est.length; i++) R = Math.max(R, Math.abs(est[i].b) + 3.2 * est[i].s);
      R = Math.max(R, 1.2);
      var ymax = 0;
      for (i = 0; i < est.length; i++) ymax = Math.max(ymax, M.normPDF(est[i].b, est[i].b, est[i].s));

      var sx = F.scale([-R, R], [padT.l, W - padT.r]);
      var sy = F.scale([0, ymax * 1.30], [HT - padT.b, padT.t]);
      F.axes(layT, {
        sx: sx, sy: sy, xTicks: 7, yTicks: 4, grid: true, y0: 0,
        xLabel: "valores posibles de θ̂  (θ = 0)", yLabel: "densidad"
      });

      est.forEach(function (e) {
        F.curve(layT, function (x) { return M.normPDF(x, e.b, e.s); }, sx, sy, {
          stroke: e.col, dash: e.dash, n: 260, serie: "estimador " + e.tag
        });
        F.vline(layT, sx(e.b), {
          y0: sy(0), y1: sy(M.normPDF(e.b, e.b, e.s)), stroke: e.col, dash: "3 3"
        });
        F.label(layT, sx(e.b), sy(M.normPDF(e.b, e.b, e.s)) - 6, "E[θ̂] " + e.tag, {
          anchor: "middle", size: 11, fill: F.color("text-2"), keyColor: e.col
        });
      });

      F.vline(layT, sx(0), { y0: padT.t - 6, y1: sy(0), stroke: F.color("text"), dash: "6 4" });
      F.text(layT, sx(0), padT.t - 12, "θ", { anchor: "middle", size: 13, fill: F.color("text-2"), weight: 600 });

      // flecha del sesgo y doble flecha del desvío, sobre el primer estimador
      var e0 = est[0];
      var yb = sy(ymax * 1.12);
      if (Math.abs(e0.b) > 1e-6) {
        arrow(F, layT, sx(0), yb, sx(e0.b), yb, F.series(3), { width: 1.6 });
        F.label(layT, (sx(0) + sx(e0.b)) / 2, yb - 7, "sesgo", {
          anchor: "middle", size: 11, fill: F.color("text-2"), keyColor: F.series(3)
        });
      } else {
        F.label(layT, sx(0) + 8, yb - 4, "sesgo = 0", {
          size: 11, fill: F.color("text-2"), keyColor: F.series(3)
        });
      }
      var ys = sy(M.normPDF(e0.b + e0.s, e0.b, e0.s));
      arrow(F, layT, sx(e0.b - e0.s), ys, sx(e0.b + e0.s), ys, e0.col, { width: 1.4, back: true, head: 6 });
      F.label(layT, sx(e0.b + e0.s) + 7, ys, "± desvío ①", {
        baseline: "middle", size: 11, fill: F.color("text-2"), keyColor: e0.col
      });

      // ---- panel inferior: barra apilada V + sesgo² ----
      var mx = 0;
      for (i = 0; i < est.length; i++) mx = Math.max(mx, est[i].mse);
      var bx = F.scale([0, mx * 1.22], [padB.l, W - padB.r]);
      var by = F.scale([0, 1], [HB - padB.b, padB.t]);
      F.axes(layB, {
        sx: bx, sy: by, xTicks: 6, yTicks: false, grid: true,
        xLabel: "error cuadrático medio", y0: 0
      });

      var rowH = 22;
      est.forEach(function (e, j) {
        var y = padB.t + 14 + j * (rowH + 24);
        // En el lienzo queda solo el total: el desglose V + sesgo² lo cuenta el
        // epígrafe, y la propia barra ya lo muestra partida en dos tramos.
        F.text(layB, bx(0), y - 5, e.tag + "  ECM = " + F.fmt(e.mse, 3), {
          size: 11, fill: F.color("text-2"), mono: true
        });
        // tramo de la varianza: relleno LISO, en el color del estimador
        F.el("rect", {
          x: bx(0), y: y, width: Math.max(1, bx(e.s * e.s) - bx(0)), height: rowH,
          // el radio de 4 px va SOLO en el extremo del dato: si detrás viene el
          // tramo del sesgo², este tramo termina recto y el corte queda limpio.
          fill: e.col, opacity: 0.5, rx: (bx(e.mse) - bx(e.s * e.s) > 0.5 ? 0 : 4)
        }, layB);
        // tramo del sesgo²: lavado plano de la ranura 3 MÁS rayado. El rayado es
        // canal secundario: refuerza un corte que el color ya marca, para que los
        // dos tramos se sigan distinguiendo en impresión y con daltonismo.
        // Si el sesgo es 0 no hay tramo rayado: dibujarlo con un ancho mínimo
        // dejaría una astilla al final de la barra que se leería como sesgo.
        var xs = bx(e.s * e.s), wS = bx(e.mse) - xs;
        if (wS > 0.5) {
          F.el("rect", {
            x: xs, y: y, width: wS, height: rowH,
            fill: F.series(3), opacity: 0.28, rx: 4
          }, layB);
          F.el("rect", {
            x: xs, y: y, width: wS, height: rowH,
            fill: hatchFill(F, svgB, F.series(3)), opacity: 0.55, rx: 4
          }, layB);
        }
        // separador entre los dos tramos
        if (e.b !== 0) {
          F.line(layB, [[xs, y], [xs, y + rowH]], {
            stroke: F.color("surface"), serie: false
          });
        }
        F.label(layB, bx(0) - 8, y + rowH / 2, e.tag, {
          anchor: "end", baseline: "middle", size: 13,
          fill: F.color("text-2"), weight: 600, keyColor: e.col
        });
      });

      out.set("e1", F.fmt(est[0].mse, 4));
      out.set("e2", two ? F.fmt(est[1].mse, 4) : "—");
      out.set("cual", two
        ? (Math.abs(est[0].mse - est[1].mse) < 1e-9 ? "empatan"
          : (est[0].mse < est[1].mse ? "el ①" : "el ②"))
        : "—");
      api.state.__mse = est.map(function (e) { return e.mse; });
    }

    redraw();
  }, { title: "ECM = varianza + sesgo²", page: "estimacion-puntual", kind: "interactive", unidad: "8" });

  // ============================================================
  //  3) Máximo interior vs. máximo en el borde del soporte
  // ============================================================
  A.registerFigure("u8-verosimilitud-borde-vs-interior", function (host, api) {
    var F = api.Fig;
    var W = 680, HA = 78, HB = 195, HC = 195;
    var AL = 0.25, AH = 8;             // rango del eje común (datos y α)
    var LO = 3, HI = 8;                // extremos fijos de las dos uniformes
    var pnl = F.panels(host, 3, { w: W, heights: [HA, HB, HC], gap: 4 });
    var svgA = pnl[0], svgB = pnl[1], svgC = pnl[2];
    var padA = { l: 66, r: 18, t: 22, b: 30 };
    var padB = { l: 66, r: 18, t: 20, b: 40 };

    var ctl = F.controls(host, [
      { k: "n", label: "n (tamaño de la muestra)", min: 3, max: 20, step: 1, value: 8, dec: 0 }
    ], function () { ensure(true); redrawAll(); });

    var sel = F.select(host, {
      k: "modelo", label: "segundo modelo",
      options: [
        { v: "sup", label: "Uniforme(3, α) → el máximo es x₍ₙ₎" },
        { v: "inf", label: "Uniforme(α, 8) → el máximo es x₍₁₎" }
      ], value: "sup"
    }, function () { redrawAll(); });

    F.buttons(host, [{
      label: "Nueva muestra",
      title: "vuelve a simular los datos con otra semilla",
      onClick: function () { api.state.seed = (api.state.seed || 1) + 1; ensure(true); redrawAll(); }
    }]);

    var out = F.readouts(host, [
      { k: "aL", tex: "\\hat\\alpha_{\\text{Laplace}} = \\tfrac1n\\sum|x_i|" },
      { k: "aU", label: "α̂ de la uniforme" },
      { k: "der", label: "¿se anula la derivada en α̂?" }
    ]);

    F.legend(host, [
      { label: "verosimilitud L(α)", color: F.series(1) },
      { label: "α̂ (máximo)", color: F.series(2), dash: true },
      { label: "datos observados", color: F.series(3), fill: true, alpha: 1 }
    ]);

    var sx = F.scale([AL, AH], [padA.l, W - padA.r]);

    // ---- muestra (arrastrable) ----
    function ensure(force) {
      var n = clamp(iround(ctl.get("n")), 3, 20);
      var key = (api.state.seed || 1) + "/" + n;
      if (force || api.state.sampleKey !== key || !api.state.sample ||
        api.state.sample.length !== n) {
        var u = F.rng(707 + (api.state.seed || 1) * 91), a = [], i;
        for (i = 0; i < n; i++) a.push(LO + 3 * u());
        a.sort(function (p, q) { return p - q; });
        api.state.sample = a;
        api.state.sampleKey = key;
      }
      return api.state.sample;
    }

    var stops = [];
    function clearStops() {
      stops.forEach(function (f) { try { f(); } catch (e) {} });
      stops = [];
    }
    api.cleanup(clearStops);

    var layA = F.el("g", null, svgA);
    var layB = F.el("g", null, svgB);
    var layC = F.el("g", null, svgC);

    function drawRug() {
      clearStops();
      while (layA.firstChild) layA.removeChild(layA.firstChild);
      var xs = ensure(false);
      var yBase = HA - padA.b;
      // el eje propio de la tira va en un grupo .fig-axes: es mobiliario, no dato
      var gAx = F.el("g", { class: "fig-axes" }, layA);
      F.line(gAx, [[sx(AL), yBase], [sx(AH), yBase]], {
        stroke: F.color("plot-axis"), width: 1.2, serie: false
      });
      [1, 2, 3, 4, 5, 6, 7, 8].forEach(function (v) {
        if (v < AL || v > AH) return;
        F.line(gAx, [[sx(v), yBase], [sx(v), yBase + 4]], {
          stroke: F.color("plot-axis"), width: 1, serie: false
        });
        F.text(gAx, sx(v), yBase + 7, String(v), {
          anchor: "middle", baseline: "hanging", size: 11, fill: F.color("text-3"), mono: true
        });
      });
      F.text(layA, padA.l, padA.t - 8, "arrastre los puntos", {
        size: 11, fill: F.color("text-3")
      });

      xs.forEach(function (v, idx) {
        var c = F.el("circle", {
          cx: sx(v), cy: yBase, r: 6, fill: F.series(3),
          stroke: F.color("surface"), "stroke-width": 2, class: "fig-hit"
        }, layA);
        stops.push(F.drag(c, {
          onDrag: function (px) {
            var nv = clamp(sx.invert(px), LO + 0.08, HI - 0.08);
            api.state.sample[idx] = nv;
            c.setAttribute("cx", sx(nv));
            drawCurves();
          },
          onEnd: function () {
            api.state.sample.sort(function (p, q) { return p - q; });
            drawRug();
            drawCurves();
          }
        }));
      });
    }

    // dibuja un panel de verosimilitud reescalada al máximo
    function panelFrame(lay, H, xLabel) {
      var sy = F.scale([0, 1.16], [H - padB.b, padB.t]);
      F.axes(lay, {
        sx: sx, sy: sy, xTicks: 8, yTicks: 3, grid: true, y0: 0,
        xLabel: xLabel, yLabel: "L(α) / L(α̂)"
      });
      return sy;
    }

    function drawCurves() {
      while (layB.firstChild) layB.removeChild(layB.firstChild);
      while (layC.firstChild) layC.removeChild(layC.firstChild);

      var xs = api.state.sample;
      var n = xs.length;
      var S = 0, i;
      for (i = 0; i < n; i++) S += Math.abs(xs[i]);
      var aHatL = S / n;                         // EMV de Laplace(0, α)
      var mx = maxOf(xs), mn = minOf(xs);
      var modo = sel.get();
      var aHatU = modo === "sup" ? mx : mn;

      // ---- panel B: Laplace(0, α), máximo interior ----
      // La fórmula de L(α) va al epígrafe: dentro del lienzo solo el nombre del
      // modelo, para que el rótulo del eje no se vuelva un renglón de prosa.
      var syB = panelFrame(layB, HB, "α  —  modelo Laplace(0, α)");
      function lnLL(a) { return -n * Math.log(2 * a) - S / a; }
      var top = lnLL(aHatL);
      F.curve(layB, function (a) { return Math.exp(lnLL(a) - top); }, sx, syB, {
        stroke: F.series(1), n: 320, from: AL, to: AH, serie: "L(α) / L(α̂)"
      });
      F.vline(layB, sx(aHatL), {
        y0: syB(0), y1: syB(1), stroke: F.series(2), dash: "5 4"
      });
      F.marker(layB, sx(aHatL), syB(1), {
        r: 4.6, fill: F.series(2), vx: aHatL, vy: 1, serie: "α̂ (máximo)"
      });
      F.line(layB, [[sx(aHatL) - 46, syB(1)], [sx(aHatL) + 46, syB(1)]], {
        stroke: F.series(2), width: 1.5, dash: "2 3", cls: "fig-ref", serie: false
      });
      F.label(layB, sx(aHatL), syB(1) - 12, "α̂ = " + F.fmt(aHatL, 3) + " — tangente horizontal", {
        anchor: "middle", size: 11, fill: F.color("text-2"), keyColor: F.series(2)
      });
      F.text(layB, padB.l + 4, padB.t + 4, "máximo interior", {
        size: 11, fill: F.color("text-3")
      });

      // ---- panel C: uniforme con el parámetro en el borde ----
      var syC = panelFrame(layC, HC,
        modo === "sup" ? "α  —  Uniforme(3, α)" : "α  —  Uniforme(α, 8)");

      var cP = F.series(1);
      if (modo === "sup") {
        // cero a la izquierda del máximo muestral, salto y decrecimiento
        F.line(layC, [[sx(AL), syC(0)], [sx(mx), syC(0)]], { stroke: cP });
        F.line(layC, [[sx(mx), syC(0)], [sx(mx), syC(1)]], { stroke: cP, dash: "4 3" });
        F.curve(layC, function (a) { return Math.pow((mx - LO) / (a - LO), n); }, sx, syC, {
          stroke: cP, n: 300, from: mx, to: AH
        });
      } else {
        F.curve(layC, function (a) { return Math.pow((HI - mn) / (HI - a), n); }, sx, syC, {
          stroke: cP, n: 300, from: AL, to: mn
        });
        F.line(layC, [[sx(mn), syC(1)], [sx(mn), syC(0)]], { stroke: cP, dash: "4 3" });
        F.line(layC, [[sx(mn), syC(0)], [sx(AH), syC(0)]], { stroke: cP });
      }
      F.vline(layC, sx(aHatU), {
        y0: syC(0), y1: syC(1), stroke: F.series(2), dash: "5 4"
      });
      F.marker(layC, sx(aHatU), syC(1), {
        r: 4.6, fill: F.series(2), vx: aHatU, vy: 1, serie: "α̂ (máximo)"
      });
      F.label(layC, sx(aHatU) + (modo === "sup" ? 8 : -8), syC(1) - 10,
        "α̂ = " + (modo === "sup" ? "máx xᵢ" : "mín xᵢ") + " = " + F.fmt(aHatU, 3), {
          anchor: modo === "sup" ? "start" : "end", size: 11,
          fill: F.color("text-2"), keyColor: F.series(2)
        });
      // marcas de los datos sobre el eje del panel
      xs.forEach(function (v) {
        F.line(layC, [[sx(v), syC(0)], [sx(v), syC(0) - 8]], {
          stroke: F.series(3), opacity: 0.85, serie: false
        });
      });
      F.text(layC, padB.l + 4, padB.t + 4, "máximo en el borde", {
        size: 11, fill: F.color("text-3")
      });

      out.set("aL", F.fmt(aHatL, 4));
      out.set("aU", F.fmt(aHatU, 4));
      out.set("der", "en Laplace sí; en la uniforme no");
      api.state.__aHatL = aHatL;
      api.state.__aHatU = aHatU;
    }

    function redrawAll() { drawRug(); drawCurves(); }

    ensure(false);
    redrawAll();
  }, { title: "Verosimilitud: máximo interior vs. borde", page: "estimacion-puntual", kind: "interactive", unidad: "8" });

  // ============================================================
  //  4) La log-verosimilitud como superficie
  // ============================================================
  A.registerFigure("u8-superficie-log-verosimilitud-normal", function (host, api) {
    var F = api.Fig;
    var W = 660, H3 = 268, H2 = 180;
    var pnl = F.panels(host, 2, { w: W, heights: [H3, H2], gap: 6 });
    var svg3 = pnl[0], svg2 = pnl[1];
    var pad2 = { l: 62, r: 18, t: 32, b: 42 };
    var SMIN = 0.5, SMAX = 2.5;

    var ctl = F.controls(host, [
      { k: "n", label: "n (tamaño de la muestra)", min: 3, max: 100, step: 1, value: 12, dec: 0 },
      { k: "azim", label: "azimut (°)", min: -180, max: 180, step: 5, value: 40, dec: 0 },
      { k: "corte", label: "corte en σ = constante", min: SMIN, max: SMAX, step: 0.05, value: 1.0, dec: 2 }
    ], function () { redraw(); });

    var tg = F.toggle(host, {
      k: "verL", label: "mostrar L en vez de ln L", value: false
    }, function () { redraw(); });

    F.buttons(host, [{
      label: "Nueva muestra",
      onClick: function () { api.state.seed = (api.state.seed || 1) + 1; redraw(); }
    }]);

    var out = F.readouts(host, [
      { k: "mu", tex: "\\hat\\mu = \\overline X_n" },
      { k: "sg", tex: "\\hat\\sigma = \\sqrt{\\tfrac1n\\sum(x_i-\\overline X_n)^2}" },
      { k: "curv", tex: "-\\,\\partial^2 \\ln L/\\partial\\mu^2 = n/\\hat\\sigma^2" },
      { k: "top", label: "máximo de ln L" }
    ]);

    F.legend(host, [
      { label: "superficie de ln L(μ, σ)", color: F.series(1), fill: true, alpha: 0.6 },
      { label: "corte σ = constante", color: F.series(2) },
      { label: "cumbre (μ̂, σ̂)", color: F.series(3), fill: true, alpha: 1 }
    ]);

    var lay3 = F.el("g", null, svg3);
    var lay2 = F.el("g", null, svg2);

    function redraw() {
      while (lay3.firstChild) lay3.removeChild(lay3.firstChild);
      while (lay2.firstChild) lay2.removeChild(lay2.firstChild);

      var n = clamp(iround(ctl.get("n")), 3, 100);
      var az = ctl.get("azim");
      var sCut = clamp(ctl.get("corte"), SMIN, SMAX);
      var verL = tg.get();

      var xs = normalSample(F, 4400 + (api.state.seed || 1) * 53, n, 0, 1);
      var xb = mean(xs);
      var SS = sumSq(xs, xb);
      var sHat = Math.sqrt(SS / n);

      // ln L(μ, σ) = −n·ln σ − (n/2)·ln(2π) − [SS + n(x̄−μ)²] / (2σ²)
      function lnL(mu, sg) {
        return -n * Math.log(sg) - n / 2 * Math.log(2 * Math.PI) -
          (SS + n * (xb - mu) * (xb - mu)) / (2 * sg * sg);
      }
      var top = lnL(xb, sHat);
      var FLOOR = top - 24;                       // recorte para que la superficie se lea
      function zOf(mu, sg) {
        var v = lnL(mu, sg);
        if (verL) return Math.exp(Math.max(v, top - 40) - top);
        return Math.max(v, FLOOR);
      }

      // semiancho del eje μ: el que hace caer ln L unas 20 unidades en el borde
      var MW = clamp(sHat * Math.sqrt(40 / n), 0.35, 3.2);
      var cx = W / 2, cy = 182;

      // coordenadas normalizadas para el proyector: μ y σ a [−1.6, 1.6]
      function ux(mu) { return (mu - xb) / MW * 1.7; }
      function uy(sg) { return ((sg - SMIN) / (SMAX - SMIN) - 0.5) * 3.2; }
      var SC = 60;
      var projS = F.iso3d({ elev: 26, azim: az, scale: SC });

      // rejilla de la base
      // rejilla y ejes de la base: mobiliario recesivo, en sus propios grupos
      var cGrid = F.color("plot-grid"), i;
      var gBase = F.el("g", { class: "fig-grid" }, lay3);
      var gEjes = F.el("g", { class: "fig-axes" }, lay3);
      for (i = -3; i <= 3; i++) {
        var p1 = projS.project(i * 0.55, -1.6, 0), p2 = projS.project(i * 0.55, 1.6, 0);
        var p3 = projS.project(-1.7, i * 0.55, 0), p4 = projS.project(1.7, i * 0.55, 0);
        F.line(gBase, [[cx + p1[0], cy + p1[1]], [cx + p2[0], cy + p2[1]]], {
          stroke: cGrid, width: 1, serie: false
        });
        F.line(gBase, [[cx + p3[0], cy + p3[1]], [cx + p4[0], cy + p4[1]]], {
          stroke: cGrid, width: 1, serie: false
        });
      }
      [[2.1, 0, "μ"], [0, 1.95, "σ"]].forEach(function (a) {
        var o0 = projS.project(0, 0, 0), e0 = projS.project(a[0], a[1], 0);
        F.line(gEjes, [[cx + o0[0], cy + o0[1]], [cx + e0[0], cy + e0[1]]], {
          stroke: F.color("plot-axis"), width: 1.3, serie: false
        });
        F.text(gEjes, cx + e0[0] + 6, cy + e0[1] + 4, a[2], { size: 13, fill: F.color("text-2") });
      });

      var f3 = function (u, v) {
        return zOf(xb + u / 1.7 * MW, SMIN + (v / 3.2 + 0.5) * (SMAX - SMIN));
      };
      var srf = F.surface(lay3, f3,
        { xs: { from: -1.7, to: 1.7, n: 30 }, ys: { from: -1.6, to: 1.6, n: 30 } }, projS, {
          fillLow: F.color("surface-2"), fillHigh: F.series(1),
          stroke: F.color("border-2"), strokeWidth: 0.35,
          cx: cx, cy: cy, zScale: 2.5
        });

      F.slice(lay3, f3, { axis: "y", at: uy(sCut), range: [-1.7, 1.7], n: 120 }, projS, {
        cx: cx, cy: cy, zScale: 2.5, zmin: srf.zmin, zmax: srf.zmax,
        stroke: F.series(2), width: 2,
        planeFill: F.series(2), planeOpacity: 0.12
      });

      // cumbre
      var zc = (zOf(xb, sHat) - srf.zmin) / ((srf.zmax - srf.zmin) || 1) * 2.5;
      var pk = projS.project(ux(xb), uy(sHat), zc);
      F.marker(lay3, cx + pk[0], cy + pk[1], {
        r: 4.6, fill: F.series(3), vx: xb, vy: sHat, serie: "cumbre (μ̂, σ̂)"
      });
      F.label(lay3, cx + pk[0] + 8, cy + pk[1] - 8,
        "(μ̂, σ̂) = (" + F.fmt(xb, 2) + ", " + F.fmt(sHat, 2) + ")", {
          size: 11, fill: F.color("text-2"), keyColor: F.series(3)
        });
      F.text(lay3, 12, 16, verL ? "L(μ, σ) reescalada al máximo" : "ln L(μ, σ)  (recortada por debajo)", {
        size: 11, fill: F.color("text-3")
      });

      // ---- panel 2D: el corte σ = constante ----
      var mus = [], vals = [], lo = Infinity, hi = -Infinity, mu;
      for (i = 0; i <= 200; i++) {
        mu = xb - MW + 2 * MW * i / 200;
        var v = verL ? Math.exp(lnL(mu, sCut) - top) : lnL(mu, sCut);
        mus.push(mu); vals.push(v);
        if (v < lo) lo = v;
        if (v > hi) hi = v;
      }
      var sx2 = F.scale([xb - MW, xb + MW], [pad2.l, W - pad2.r]);
      var sy2 = F.scale([lo - (hi - lo) * 0.12, hi + (hi - lo) * 0.18], [H2 - pad2.b, pad2.t]);
      F.axes(lay2, {
        sx: sx2, sy: sy2, xTicks: 7, yTicks: 4, grid: true,
        xLabel: "μ  (con σ = " + F.fmt(sCut, 2) + " fijo)"
      });
      // El nombre del eje vertical va arriba y horizontal: girado a la izquierda
      // se pisaba con los números del eje al pasar la escala a L / L(μ̂).
      F.text(lay2, 8, pad2.t - 14, verL ? "L / L(μ̂)" : "ln L", {
        size: 11, fill: F.color("text-3")
      });
      F.line(lay2, mus.map(function (m2, j) { return [m2, vals[j]]; }), {
        sx: sx2, sy: sy2, stroke: F.series(2), serie: verL ? "L / L(μ̂)" : "ln L"
      });
      F.vline(lay2, sx2(xb), {
        y0: sy2(sy2.domain()[0]), y1: pad2.t, stroke: F.series(3), dash: "5 4"
      });
      F.label(lay2, sx2(xb), pad2.t - 6, "vértice en μ = x̄ = " + F.fmt(xb, 3), {
        anchor: "middle", size: 11, fill: F.color("text-2"), keyColor: F.series(3)
      });

      out.set("mu", F.fmt(xb, 4));
      out.set("sg", F.fmt(sHat, 4));
      out.set("curv", F.fmt(n / (sHat * sHat), 3));
      out.set("top", F.fmt(top, 3));
      api.state.__xb = xb;
      api.state.__sHat = sHat;
      api.state.__top = top;
    }

    redraw();
  }, { title: "ln L(μ, σ) como superficie", page: "estimacion-puntual", kind: "interactive", unidad: "8" });

  // ============================================================
  //  5) El MAP como negociación entre prior y datos
  // ============================================================
  A.registerFigure("u8-map-prior-verosimilitud-posterior", function (host, api) {
    var F = api.Fig;
    var W = 660, HT = 270, HB = 92;
    var pnl = F.panels(host, 2, { w: W, heights: [HT, HB], gap: 6 });
    var svgT = pnl[0], svgB = pnl[1];
    var padT = { l: 66, r: 18, t: 24, b: 44 };
    var padB = { l: 66, r: 18, t: 22, b: 32 };
    var SIG = 1, MUP = 0;                       // σ conocido y prior centrado en 0

    var ctl = F.controls(host, [
      { k: "n", label: "n (tamaño de la muestra)", min: 1, max: 200, value: 4, log: true, dec: 0, fmt: function (v) { return String(iround(v)); } },
      { k: "sp", tex: "\\sigma_p\\ \\text{(desvío del prior)}", min: 0.2, max: 3, step: 0.05, value: 1, dec: 2 },
      { k: "xb", tex: "\\overline X_n\\ \\text{(media muestral)}", min: -1, max: 5, step: 0.05, value: 3, dec: 2 }
    ], function () { redraw(); });

    var out = F.readouts(host, [
      { k: "map", tex: "\\hat\\mu_{\\text{MAP}}" },
      { k: "wd", tex: "n\\sigma_p^2/(n\\sigma_p^2+\\sigma^2)" },
      { k: "wp", tex: "\\sigma^2/(n\\sigma_p^2+\\sigma^2)" },
      { k: "spost", label: "desvío de la posterior" }
    ]);

    F.legend(host, [
      { label: "prior g(μ)", color: F.series(3), dash: true },
      { label: "verosimilitud (normalizada)", color: F.series(2) },
      { label: "posterior g(μ | datos)", color: F.series(1) }
    ]);

    var layT = F.el("g", null, svgT);
    var layB = F.el("g", null, svgB);

    function redraw() {
      while (layT.firstChild) layT.removeChild(layT.firstChild);
      while (layB.firstChild) layB.removeChild(layB.firstChild);

      var n = clamp(iround(ctl.get("n")), 1, 200);
      var sp = ctl.get("sp");
      var xb = ctl.get("xb");

      var seLik = SIG / Math.sqrt(n);                     // desvío de la verosimilitud en μ
      var prec = n / (SIG * SIG) + 1 / (sp * sp);
      var sPost = Math.sqrt(1 / prec);
      var wDat = (n * sp * sp) / (n * sp * sp + SIG * SIG);
      var muMap = wDat * xb + (1 - wDat) * MUP;

      var lo = Math.min(MUP - 3.2 * sp, xb - 3.2 * seLik, muMap - 3.2 * sPost);
      var hi = Math.max(MUP + 3.2 * sp, xb + 3.2 * seLik, muMap + 3.2 * sPost);
      var ymax = Math.max(M.normPDF(MUP, MUP, sp), M.normPDF(xb, xb, seLik), M.normPDF(muMap, muMap, sPost));

      var sx = F.scale([lo, hi], [padT.l, W - padT.r]);
      var sy = F.scale([0, ymax * 1.22], [HT - padT.b, padT.t]);
      F.axes(layT, {
        sx: sx, sy: sy, xTicks: 7, yTicks: 4, grid: true, y0: 0,
        xLabel: "μ", yLabel: "densidad"
      });

      F.curve(layT, function (x) { return M.normPDF(x, MUP, sp); }, sx, sy, {
        stroke: F.series(3), dash: "6 4", n: 260, serie: "prior g(μ)"
      });
      F.curve(layT, function (x) { return M.normPDF(x, xb, seLik); }, sx, sy, {
        stroke: F.series(2), n: 260, serie: "verosimilitud"
      });
      F.area(layT, function (x) { return M.normPDF(x, muMap, sPost); }, sx, sy, {
        fill: F.series(1), band: true, n: 260, serie: false
      });
      F.curve(layT, function (x) { return M.normPDF(x, muMap, sPost); }, sx, sy, {
        stroke: F.series(1), n: 260, serie: "posterior"
      });

      [[MUP, "μₚ (prior)", F.series(3)], [xb, "x̄", F.series(2)], [muMap, "μ̂ MAP", F.series(1)]]
        .forEach(function (m2, j) {
          F.vline(layT, sx(m2[0]), {
            y0: sy(0), y1: padT.t + 4 + j * 13, stroke: m2[2], dash: "4 3"
          });
          F.label(layT, sx(m2[0]) + 4, padT.t + 4 + j * 13, m2[1], {
            size: 11, fill: F.color("text-2"), keyColor: m2[2]
          });
        });

      // ---- barra de pesos ----
      var bx = F.scale([0, 1], [padB.l, W - padB.r]);
      var y0 = padB.t, hRow = 26;
      // Los dos tramos van como lavado plano y separados 2 px: así el rótulo se
      // puede escribir en tinta de texto y no en el color del fondo.
      F.el("rect", {
        x: bx(0), y: y0, width: Math.max(1, bx(wDat) - bx(0) - 1), height: hRow,
        fill: F.series(2), opacity: 0.3, rx: 4
      }, layB);
      F.el("rect", {
        x: bx(wDat) + 1, y: y0, width: Math.max(1, bx(1) - bx(wDat) - 1), height: hRow,
        fill: F.series(3), opacity: 0.3, rx: 4
      }, layB);
      F.label(layB, (bx(0) + bx(wDat)) / 2, y0 + hRow / 2 + 4, "datos " + F.fmt(wDat, 3), {
        anchor: "middle", size: 11, fill: F.color("text-2"), weight: 600, keyColor: F.series(2)
      });
      F.label(layB, (bx(wDat) + bx(1)) / 2, y0 + hRow / 2 + 4, "prior " + F.fmt(1 - wDat, 3), {
        anchor: "middle", size: 11, fill: F.color("text-2"), weight: 600, keyColor: F.series(3)
      });
      F.text(layB, padB.l, y0 - 8, "pesos del promedio ponderado", {
        size: 11, fill: F.color("text-3")
      });
      var gPes = F.el("g", { class: "fig-axes" }, layB);
      [0, 0.25, 0.5, 0.75, 1].forEach(function (t) {
        F.line(gPes, [[bx(t), y0 + hRow], [bx(t), y0 + hRow + 4]], {
          stroke: F.color("plot-axis"), width: 1, serie: false
        });
        F.text(gPes, bx(t), y0 + hRow + 7, String(t), {
          anchor: "middle", baseline: "hanging", size: 11, fill: F.color("text-3"), mono: true
        });
      });

      out.set("map", F.fmt(muMap, 4));
      out.set("wd", F.fmt(wDat, 4));
      out.set("wp", F.fmt(1 - wDat, 4));
      out.set("spost", F.fmt(sPost, 4));
      api.state.__map = muMap;
      api.state.__w = wDat;
      api.state.__sPost = sPost;
    }

    redraw();
  }, { title: "MAP: prior, verosimilitud y posterior", page: "estimacion-puntual", kind: "interactive", unidad: "8" });

  // ============================================================
  //  6) Cuántos grados de libertad cuestan las colas
  // ============================================================
  A.registerFigure("u8-t-vs-normal-y-fractiles", function (host, api) {
    var F = api.Fig;
    var W = 660, HT = 258, HB = 182;
    var pnl = F.panels(host, 2, { w: W, heights: [HT, HB], gap: 6 });
    var svgT = pnl[0], svgB = pnl[1];
    var padT = { l: 66, r: 18, t: 20, b: 44 };
    var padB = { l: 66, r: 18, t: 24, b: 44 };
    var FONDO = [1, 3, 10, 50];

    var ctl = F.controls(host, [
      { k: "m", label: "m (grados de libertad)", min: 1, max: 60, step: 1, value: 4, dec: 0 },
      { k: "gamma", tex: "\\gamma", min: 0.80, max: 0.995, step: 0.005, value: 0.95, dec: 3 }
    ], function () { redraw(); });

    var tg = F.toggle(host, {
      k: "logm", label: "escala logarítmica en los grados de libertad", value: false
    }, function () { redraw(); });

    var out = F.readouts(host, [
      { k: "t", tex: "t_{m,\\gamma}" },
      { k: "z", tex: "z_\\gamma" },
      { k: "r", tex: "t_{m,\\gamma}/z_\\gamma" },
      { k: "pz", tex: "P(T_m > z_\\gamma)" }
    ]);

    F.legend(host, [
      { label: "t con m grados de libertad", color: F.series(1) },
      { label: "normal estándar", color: F.series(2) },
      { label: "cola de la t, área 1−γ", color: F.series(1), fill: true, alpha: 0.45 },
      { label: "cola de la normal, área 1−γ", color: F.series(2), fill: true, band: true },
      { label: "otras t (m = 1, 3, 10, 50)", color: F.series(3), dash: true }
    ]);

    var layT = F.el("g", null, svgT);
    var layB = F.el("g", null, svgB);

    function redraw() {
      while (layT.firstChild) layT.removeChild(layT.firstChild);
      while (layB.firstChild) layB.removeChild(layB.firstChild);

      var m = clamp(iround(ctl.get("m")), 1, 60);
      var g = ctl.get("gamma");
      var tq = M.tInv(g, m);
      var zq = M.normInv(g, 0, 1);

      // ---- panel superior: densidades y colas ----
      var XL = 5;
      var sx = F.scale([-XL, XL], [padT.l, W - padT.r]);
      var sy = F.scale([0, 0.44], [HT - padT.b, padT.t]);
      F.axes(layT, {
        sx: sx, sy: sy, xTicks: 9, yTicks: 4, grid: true, y0: 0,
        xLabel: "t", yLabel: "densidad"
      });

      FONDO.forEach(function (mm) {
        if (mm === m) return;
        F.curve(layT, function (x) { return M.tPDF(x, mm); }, sx, sy, {
          stroke: F.series(3), dash: "3 5", opacity: 0.4, n: 300, serie: false
        });
      });
      // colas sombreadas: primero la de la t, después la de la normal
      F.area(layT, function (x) { return M.tPDF(x, m); }, sx, sy, {
        from: Math.min(tq, XL), to: XL, fill: F.series(1),
        hatch: { angle: 45, size: 7, width: 2 }, n: 160, serie: false
      });
      F.area(layT, function (x) { return M.normPDF(x, 0, 1); }, sx, sy, {
        from: Math.min(zq, XL), to: XL, fill: F.series(2), band: true, n: 160, serie: false
      });
      F.curve(layT, function (x) { return M.normPDF(x, 0, 1); }, sx, sy, {
        stroke: F.series(2), n: 320, serie: "normal estándar"
      });
      F.curve(layT, function (x) { return M.tPDF(x, m); }, sx, sy, {
        stroke: F.series(1), n: 320, serie: "t con m = " + m
      });

      F.vline(layT, sx(clamp(zq, -XL, XL)), {
        y0: sy(0), y1: padT.t + 30, stroke: F.series(2), dash: "4 3"
      });
      F.label(layT, sx(clamp(zq, -XL, XL)) - 4, padT.t + 26, "z(γ) = " + F.fmt(zq, 3), {
        anchor: "end", size: 11, fill: F.color("text-2"), keyColor: F.series(2)
      });
      F.vline(layT, sx(clamp(tq, -XL, XL)), {
        y0: sy(0), y1: padT.t + 12, stroke: F.series(1), dash: "4 3"
      });
      // con m chico el fractil se sale de la escala, la línea se pega al borde
      // derecho y el rótulo no entra: en ese caso se escribe hacia la izquierda.
      var txtT = "t(m, γ) = " + F.fmt(tq, 3) + (tq > XL ? "  (fuera de escala)" : "");
      var xT = sx(clamp(tq, -XL, XL)), anchorT = "start";
      if (xT + 4 + txtT.length * 5.9 > W - padT.r) { anchorT = "end"; }
      F.label(layT, xT + (anchorT === "end" ? -4 : 4), padT.t + 8, txtT, {
        size: 11, anchor: anchorT, fill: F.color("text-2"), keyColor: F.series(1)
      });
      F.text(layT, padT.l + 4, padT.t + 4, "m = " + m + " · γ = " + F.fmt(g, 3), {
        size: 11, fill: F.color("text-3")
      });

      // ---- panel inferior: el fractil como función de m ----
      var t1 = M.tInv(g, 1);
      var ymax = Math.min(t1, 4 * zq) * 1.04;
      var mLo = 1, mHi = 60;
      var lg = tg.get();
      var bx = F.scale([mLo, mHi], [padB.l, W - padB.r], { log: lg });
      var by = F.scale([0, ymax], [HB - padB.b, padB.t]);
      F.axes(layB, {
        sx: bx, sy: by, yTicks: 4, grid: true, y0: 0,
        xTicks: lg ? [1, 2, 3, 5, 10, 20, 30, 60] : 7,
        xLabel: "grados de libertad m", yLabel: "t (m, γ)"
      });

      var pts = [], k, tv, clipped = false;
      for (k = mLo; k <= mHi; k++) {
        tv = M.tInv(g, k);
        if (tv > ymax) { clipped = true; continue; }
        pts.push([k, tv]);
      }
      F.line(layB, pts, { sx: bx, sy: by, stroke: F.series(1), serie: "t (m, γ)" });
      F.hline(layB, by(zq), {
        x0: padB.l, x1: W - padB.r, stroke: F.series(2), dash: "5 4"
      });
      F.text(layB, W - padB.r - 4, by(zq) - 6, "asíntota  z(γ) = " + F.fmt(zq, 3), {
        anchor: "end", size: 11, fill: F.color("text-2")
      });
      if (tq <= ymax) {
        F.marker(layB, bx(m), by(tq), {
          r: 4.6, fill: F.series(1), vx: m, vy: tq, serie: "m elegido"
        });
        // con m grande el marcador queda contra el borde derecho: el rótulo se
        // vuelca a la izquierda y BAJO el punto, para no pisar el de la asíntota.
        var derM = bx(m) + 8 + ("m = " + m).length * 5.9 < W - padB.r - 145;
        F.label(layB, bx(m) + (derM ? 8 : -8), by(tq) + (derM ? -8 : 16), "m = " + m, {
          size: 11, anchor: derM ? "start" : "end",
          fill: F.color("text-2"), keyColor: F.series(1)
        });
      }
      if (clipped) {
        F.text(layB, padB.l + 4, padB.t + 4,
          "t(1, γ) = " + F.fmt(t1, 2) + " fuera de escala", {
            size: 11, fill: F.color("text-3")
          });
      }

      out.set("t", F.fmt(tq, 4));
      out.set("z", F.fmt(zq, 4));
      out.set("r", F.fmt(tq / zq, 4));
      out.set("pz", F.fmt(1 - M.tCDF(zq, m), 4));
      api.state.__tq = tq;
      api.state.__zq = zq;
    }

    redraw();
  }, { title: "Colas de la t y sus fractiles", page: "distribucion-t-de-student", kind: "interactive", unidad: "8" });

  // ============================================================
  //  7) Por qué el IC de la varianza no es simétrico
  // ============================================================
  A.registerFigure("u8-ji-cuadrado-dos-colas-ic-varianza", function (host, api) {
    var F = api.Fig;
    var W = 690, H_BASE = 456, H = 528;          // H sólo cuando se muestra la variante con la t
    var svg = F.svg(host, { w: W, h: H_BASE, title: "Intervalo de confianza para la varianza y las dos colas de la ji-cuadrado" });
    var padU = { l: 60, r: 22, t: 26 };          // panel superior: χ²
    var Y_UP = 230;                              // línea de base del panel superior
    var Y_LOW = 360;                             // línea de base del eje de σ²
    var Y_C1 = 296;                              // corredor del conector χ² superior → extremo inferior
    var Y_C2 = 326;                              // corredor del conector χ² inferior → extremo superior

    var ctl = F.controls(host, [
      { k: "n", label: "n (tamaño de la muestra)", min: 3, max: 60, step: 1, value: 10, dec: 0 },
      { k: "gamma", tex: "\\gamma", min: 0.80, max: 0.99, step: 0.005, value: 0.95, dec: 3 },
      { k: "s", label: "desvío muestral observado s", min: 1, max: 20, step: 0.01, value: 10.56, dec: 2 }
    ], function () { redraw(); });

    var tg = F.toggle(host, {
      k: "mal", label: "usar cuantiles de la t (mal)", value: false
    }, function () { redraw(); });

    var out = F.readouts(host, [
      { k: "s2", tex: "S^2" },
      { k: "qi", tex: "\\chi^2_{n-1;\\,(1-\\gamma)/2}" },
      { k: "qs", tex: "\\chi^2_{n-1;\\,(1+\\gamma)/2}" },
      { k: "ic", tex: "IC_\\gamma(\\sigma^2)" },
      { k: "mal", label: "el mismo cálculo con la t" }
    ]);

    F.legend(host, [
      { label: "densidad de χ² con n−1 g.l.", color: F.series(1) },
      { label: "colas de área (1−γ)/2 cada una", color: F.series(2), fill: true, alpha: 0.45 },
      { label: "intervalo para σ²", color: F.series(3) },
      { label: "S² observado", color: F.series(4), fill: true, alpha: 1 }
    ]);

    var layer = F.el("g", null, svg);

    function redraw() {
      while (layer.firstChild) layer.removeChild(layer.firstChild);

      // el lienzo sólo crece cuando hay que mostrar la variante con la t
      var hNow = tg.get() ? H : H_BASE;
      if (svg.__h !== hNow) {
        svg.setAttribute("viewBox", "0 0 " + W + " " + hNow);
        svg.__h = hNow;
      }

      var n = clamp(iround(ctl.get("n")), 3, 60);
      var k = n - 1;
      var g = ctl.get("gamma");
      var s = ctl.get("s");
      var S2 = s * s;
      var a = (1 - g) / 2;
      var qLo = M.chi2Inv(a, k);
      var qHi = M.chi2Inv(1 - a, k);
      var L = (k * S2) / qHi;                    // extremo inferior de σ²
      var U = (k * S2) / qLo;                    // extremo superior de σ²

      // ---- panel superior: la ji-cuadrado ----
      var xMax = M.chi2Inv(0.9995, k) * 1.02;
      var sx = F.scale([0, xMax], [padU.l, W - padU.r]);
      var yPk = M.chi2PDF(Math.max(k - 2, 0.4), k);
      var sy = F.scale([0, yPk * 1.30], [Y_UP, padU.t]);
      F.axes(layer, {
        sx: sx, sy: sy, xTicks: 7, yTicks: 4, grid: true, y0: 0,
        xLabel: "valores de  (n−1)S²/σ²  ~  χ²(n−1)", yLabel: "densidad"
      });

      var fchi = function (x) { return M.chi2PDF(x, k); };
      F.area(layer, fchi, sx, sy, {
        from: 0, to: qLo, fill: F.series(2),
        hatch: { angle: 45, size: 7, width: 2 }, n: 140, serie: false
      });
      F.area(layer, fchi, sx, sy, {
        from: qHi, to: xMax, fill: F.series(2),
        hatch: { angle: 45, size: 7, width: 2 }, n: 140, serie: false
      });
      F.curve(layer, fchi, sx, sy, { stroke: F.series(1), n: 320, serie: "densidad χ²(n−1)" });

      F.vline(layer, sx(k), { y0: sy(0), y1: sy(fchi(k)), stroke: F.color("text-3"), dash: "3 3" });
      // al costado de la línea punteada, no centrado sobre ella (si no, la
      // propia línea de trazos atraviesa el texto por el medio).
      F.text(layer, sx(k) + 6, Y_UP - 8, "media = n−1 = " + k, {
        anchor: "start", size: 11, fill: F.color("text-3")
      });

      [[qLo, "χ² inferior", -1], [qHi, "χ² superior", 1]].forEach(function (q) {
        F.vline(layer, sx(q[0]), { y0: sy(0), y1: padU.t + 6, stroke: F.series(2), dash: "4 3" });
        F.marker(layer, sx(q[0]), sy(0), {
          r: 4.6, fill: F.series(2), vx: q[0], vy: 0, serie: q[1]
        });
        // con n chico el cuantil inferior queda casi en x = 0 y su rótulo se
        // salía por la izquierda: ahí se lo vuelca hacia adentro.
        var txtQ = q[1] + " = " + F.fmt(q[0], 3), lado = q[2];
        if (lado < 0 && sx(q[0]) - 5 - txtQ.length * 5.9 < padU.l - 34) lado = 1;
        else if (lado > 0 && sx(q[0]) + 5 + txtQ.length * 5.9 > W - padU.r) lado = -1;
        F.label(layer, sx(q[0]) + lado * 5, padU.t + 2, txtQ, {
          anchor: lado < 0 ? "end" : "start", size: 11,
          fill: F.color("text-2"), keyColor: F.series(2)
        });
      });
      var xNota = Math.min(W - padU.r, sx(qHi) - 8);
      F.text(layer, xNota, padU.t + 26,
        "área de cada cola = (1−γ)/2 = " + F.fmt(a, 4), {
          anchor: "end", size: 11, fill: F.color("text-3")
        });
      F.text(layer, xNota, padU.t + 42,
        "los dos cuantiles NO son opuestos", {
          anchor: "end", size: 11, fill: F.color("text-3")
        });

      // ---- panel inferior: el eje de σ² ----
      var hiS = U * 1.22;
      var bx = F.scale([0, hiS], [padU.l, W - padU.r]);
      // eje propio de σ²: mobiliario, en su grupo .fig-axes
      var gSig = F.el("g", { class: "fig-axes" }, layer);
      F.line(gSig, [[bx(0), Y_LOW], [bx(hiS), Y_LOW]], {
        stroke: F.color("plot-axis"), width: 1.3, serie: false
      });
      F.ticks(0, hiS, 6).forEach(function (v) {
        if (v < 0 || v > hiS) return;
        F.line(gSig, [[bx(v), Y_LOW], [bx(v), Y_LOW + 4]], {
          stroke: F.color("plot-axis"), width: 1, serie: false
        });
        F.text(gSig, bx(v), Y_LOW + 7, F.fmt(v, 0), {
          anchor: "middle", baseline: "hanging", size: 11, fill: F.color("text-3"), mono: true
        });
      });
      // La explicación de por qué se cruzan los extremos va al epígrafe; aquí
      // queda solo el nombre del eje.
      F.text(gSig, (bx(0) + bx(hiS)) / 2, Y_LOW + 68,
        "σ² (varianza poblacional)", {
          anchor: "middle", baseline: "hanging", size: 12, fill: F.color("text-3")
        });

      // La banda del intervalo va como <rect> y no como trazo: es una barra, y
      // así conserva su grosor propio sin apartarse del trazo de dato de 2 px.
      var cIC = F.series(3);
      F.el("rect", {
        x: bx(L), y: Y_LOW - 3, width: Math.max(2, bx(U) - bx(L)), height: 6, rx: 3, fill: cIC
      }, layer);
      [[L, "extremo inferior"], [U, "extremo superior"]].forEach(function (p) {
        F.line(layer, [[bx(p[0]), Y_LOW - 9], [bx(p[0]), Y_LOW + 9]], {
          stroke: cIC, serie: false
        });
        F.text(layer, bx(p[0]), Y_LOW + 24, F.fmt(p[0], 2), {
          anchor: "middle", baseline: "hanging", size: 11, fill: F.color("text-2"), mono: true
        });
        F.label(layer, bx(p[0]), Y_LOW + 50, p[1], {
          anchor: "middle", size: 11, fill: F.color("text-2"), keyColor: cIC
        });
      });
      F.marker(layer, bx(S2), Y_LOW, {
        r: 5, fill: F.series(4), vx: S2, serie: "S² observado"
      });
      F.label(layer, bx(S2), Y_LOW - 14, "S² = " + F.fmt(S2, 2), {
        anchor: "middle", size: 11, fill: F.color("text-2"), keyColor: F.series(4)
      });

      // Conectores CRUZADOS: el cuantil superior manda al extremo INFERIOR y
      // viceversa. Van por corredores distintos (Y_C1 ≠ Y_C2) y con guionados
      // distintos, para que el cruce se vea; además cada tramo lleva rótulo,
      // que es lo que fija la lectura aunque la geometría cambie con n, γ o s.
      elbow(F, layer, sx(qHi), Y_UP + 46, bx(L), Y_LOW - 10, F.series(2), {
        ym: Y_C1, dash: "5 4", width: 1.6,
        label: "χ² superior  →  extremo inferior"
      });
      elbow(F, layer, sx(qLo), Y_UP + 46, bx(U), Y_LOW - 10, F.series(2), {
        ym: Y_C2, dash: "1.5 3", width: 1.6,
        label: "χ² inferior  →  extremo superior"
      });

      // ---- variante incorrecta con cuantiles de la t ----
      var malTxt = "—";
      if (tg.get()) {
        var tHi = M.tInv(1 - a, k);
        var tLo = M.tInv(a, k);                  // negativo
        var mL = (k * S2) / tHi;                 // "extremo inferior" con la t
        var mU = (k * S2) / tLo;                 // negativo: cae a la IZQUIERDA de 0
        // --bad como ESTADO (el procedimiento equivocado), siempre con rótulo:
        // por eso estas marcas no se registran como identidad de serie.
        var cBad = F.status("bad");
        var yT = Y_LOW + 80;
        var xL = bx(clamp(mL, 0, hiS));
        var x0 = bx(0);
        // No se dibuja NINGUNA barra entre los dos extremos: una barra desde 0
        // hasta mL se leería como un intervalo válido y muy ancho, que es justo
        // lo contrario de lo que pasa. Las dos condiciones se dibujan como
        // semirrectas que apuntan en sentidos OPUESTOS, así que no encierran nada.
        F.line(layer, [[xL, yT - 8], [xL, yT + 8]], { stroke: cBad, serie: false });
        arrow(F, layer, xL, yT, Math.min(W - padU.r, xL + 54), yT, cBad, { width: 2.6, head: 8 });
        F.line(layer, [[x0, yT - 8], [x0, yT + 8]], { stroke: cBad, dash: "2 2", serie: false });
        arrow(F, layer, x0, yT, Math.max(8, x0 - 44), yT, cBad, { width: 2.6, head: 8 });
        // El detalle de por qué no encierran nada va al epígrafe: en el lienzo
        // quedan las dos condiciones y su conclusión, en renglones cortos.
        F.label(layer, x0, yT + 24, "con la t: σ² ≥ " + F.fmt(mL, 2), {
          size: 11, fill: F.color("text-2"), keyColor: cBad
        });
        F.label(layer, x0, yT + 40, "y a la vez σ² ≤ " + F.fmt(mU, 2), {
          size: 11, fill: F.color("text-2"), keyColor: cBad
        });
        F.text(layer, x0, yT + 56, "el intervalo queda vacío", {
          size: 11, fill: F.color("text-2"), weight: 600
        });
        malTxt = "[" + F.fmt(mL, 2) + " ; " + F.fmt(mU, 2) + "]  (vacío)";
      }

      out.set("s2", F.fmt(S2, 3));
      out.set("qi", F.fmt(qLo, 4));
      out.set("qs", F.fmt(qHi, 4));
      out.set("ic", "[" + F.fmt(L, 2) + " ; " + F.fmt(U, 2) + "]");
      out.set("mal", malTxt);
      api.state.__L = L;
      api.state.__U = U;
      api.state.__qLo = qLo;
      api.state.__qHi = qHi;
    }

    redraw();
  }, { title: "IC de la varianza con la ji-cuadrado", page: "intervalos-de-confianza", kind: "interactive", unidad: "8" });

  // ============================================================
  //  8) El grado de libertad que se gasta (por qué n−1)
  // ============================================================
  A.registerFigure("u8-por-que-n-menos-1", function (host, api) {
    var F = api.Fig;
    var W = 660, HA = 100, HB = 260;
    var MU = 10, SD = 2, VAR = SD * SD;
    var pnl = F.panels(host, 2, { w: W, heights: [HA, HB], gap: 4 });
    var svgA = pnl[0], svgB = pnl[1];
    var padA = { l: 86, r: 18, t: 26, b: 36 };
    var padB = { l: 86, r: 18, t: 22, b: 44 };

    var ctl = F.controls(host, [
      { k: "n", label: "n (tamaño de la muestra)", min: 2, max: 30, step: 1, value: 8, dec: 0 }
    ], function () { reset(); redraw(); });

    F.buttons(host, [
      { label: "Nueva muestra", onClick: function () { advance(1); redraw(); } },
      { label: "+50 muestras", onClick: function () { advance(50); redraw(); } },
      { label: "Reiniciar el conteo", onClick: function () { reset(); redraw(); } }
    ]);

    var out = F.readouts(host, [
      { k: "q", label: "Q(x̄) de esta muestra" },
      { k: "qmu", label: "Q(μ) de esta muestra" },
      { k: "acum", label: "muestras acumuladas" },
      { k: "pn", tex: "\\overline{Q/n}" },
      { k: "pn1", tex: "\\overline{Q/(n-1)}" }
    ]);

    F.legend(host, [
      { label: "Q(c) = Σ(xᵢ − c)²", color: F.series(1) },
      { label: "vértice en c = x̄ (mínimo)", color: F.series(2), fill: true, alpha: 1 },
      { label: "c = μ verdadero", color: F.series(3), fill: true, alpha: 1 },
      { label: "datos observados", color: F.series(4), fill: true, alpha: 1 }
    ]);

    function reset() {
      api.state.acc = { k: 0, sN: 0, sN1: 0 };
      api.state.seedBase = (api.state.seedBase || 0) + 1000;
      advance(1);
    }
    function advance(count) {
      var n = clamp(iround(ctl.get("n")), 2, 30);
      var acc = api.state.acc || (api.state.acc = { k: 0, sN: 0, sN1: 0 });
      var i, xs;
      for (i = 0; i < count; i++) {
        api.state.step = (api.state.step || 0) + 1;
        xs = normalSample(F, (api.state.seedBase || 1000) + api.state.step * 17, n, MU, SD);
        var Q = sumSq(xs, mean(xs));
        acc.k++;
        acc.sN += Q / n;
        acc.sN1 += Q / (n - 1);
      }
      api.state.sample = xs;
      api.state.sampleN = n;
    }

    var layA = F.el("g", null, svgA);
    var layB = F.el("g", null, svgB);

    var stopDrag = null;
    api.cleanup(function () { if (stopDrag) stopDrag(); stopDrag = null; });

    function redraw() {
      while (layA.firstChild) layA.removeChild(layA.firstChild);
      while (layB.firstChild) layB.removeChild(layB.firstChild);
      if (stopDrag) { stopDrag(); stopDrag = null; }

      var n = clamp(iround(ctl.get("n")), 2, 30);
      if (!api.state.sample || api.state.sampleN !== n) { reset(); }
      var xs = api.state.sample;
      var acc = api.state.acc;
      var xb = mean(xs);
      var Qxb = sumSq(xs, xb);
      var Qmu = sumSq(xs, MU);

      // eje común de c y de los datos
      var lo = Math.min(minOf(xs), MU) - 1.2;
      var hi = Math.max(maxOf(xs), MU) + 1.2;
      var sx = F.scale([lo, hi], [padA.l, W - padA.r]);

      // ---- panel A: los datos ----
      var yBase = HA - padA.b;
      // el eje propio de la tira de datos va en su grupo .fig-axes
      var gAx = F.el("g", { class: "fig-axes" }, layA);
      F.line(gAx, [[sx(lo), yBase], [sx(hi), yBase]], {
        stroke: F.color("plot-axis"), width: 1.2, serie: false
      });
      F.ticks(lo, hi, 6).forEach(function (v) {
        F.line(gAx, [[sx(v), yBase], [sx(v), yBase + 4]], {
          stroke: F.color("plot-axis"), width: 1, serie: false
        });
        F.text(gAx, sx(v), yBase + 7, F.fmt(v, 1), {
          anchor: "middle", baseline: "hanging", size: 11, fill: F.color("text-3"), mono: true
        });
      });
      xs.forEach(function (v) {
        F.el("circle", {
          cx: sx(v), cy: yBase, r: 4.6, fill: F.series(4),
          stroke: F.color("surface"), "stroke-width": 2
        }, layA);
      });
      F.vline(layA, sx(xb), { y0: padA.t, y1: yBase, stroke: F.series(2), dash: "4 3" });
      F.label(layA, sx(xb), padA.t - 8, "x̄ = " + F.fmt(xb, 3), {
        anchor: "middle", size: 11, fill: F.color("text-2"), keyColor: F.series(2)
      });
      F.vline(layA, sx(MU), { y0: padA.t, y1: yBase, stroke: F.series(3), dash: "6 4" });
      F.label(layA, sx(MU) - 6, yBase - 10, "μ = " + MU, {
        anchor: "end", size: 11, fill: F.color("text-2"), keyColor: F.series(3)
      });

      // ---- panel B: la parábola Q(c) ----
      function Q(c) { return Qxb + n * (xb - c) * (xb - c); }
      // el eje vertical se ajusta a la zona interesante (vértice y valor en μ)
      var qTop = Math.max(Qmu * 1.9, Qxb * 2.4, 1e-6);
      var half = Math.sqrt(Math.max(0, (qTop - Qxb) / n));
      var cA = Math.max(lo, xb - half), cB = Math.min(hi, xb + half);
      var sy = F.scale([0, qTop], [HB - padB.b, padB.t]);
      F.axes(layB, {
        sx: sx, sy: sy, xTicks: 6, yTicks: 5, grid: true, y0: 0,
        xLabel: "centro c", yLabel: "Q(c) = Σ(xᵢ − c)²"
      });
      F.curve(layB, Q, sx, sy, { stroke: F.series(1), n: 260, from: cA, to: cB, serie: "Q(c)" });

      F.marker(layB, sx(xb), sy(Qxb), {
        r: 5, fill: F.series(2), vx: xb, vy: Qxb, serie: "Q(x̄)"
      });
      F.label(layB, sx(xb), sy(Qxb) + 22, "Q(x̄) = " + F.fmt(Qxb, 2) + "  (mínimo)", {
        anchor: "middle", size: 11, fill: F.color("text-2"), keyColor: F.series(2)
      });
      F.marker(layB, sx(MU), sy(Qmu), {
        r: 5, fill: F.series(3), vx: MU, vy: Qmu, serie: "Q(μ)"
      });
      F.label(layB, sx(MU), sy(Qmu) - 12, "Q(μ) = " + F.fmt(Qmu, 2), {
        anchor: "middle", size: 11, fill: F.color("text-2"), keyColor: F.series(3)
      });

      // brecha vertical Q(μ) − Q(x̄) = n(x̄−μ)²
      var xg = sx(MU), izq = MU < xb;
      // La brecha es una ACOTACIÓN, no una serie: va en tinta recesiva.
      arrow(F, layB, xg, sy(Qxb), xg, sy(Qmu), F.color("text-3"), { width: 1.5, back: true, head: 6 });
      F.line(layB, [[sx(xb), sy(Qxb)], [xg, sy(Qxb)]], {
        stroke: F.color("text-3"), width: 1, dash: "3 3", cls: "fig-ref", serie: false
      });
      F.text(layB, xg + (izq ? -9 : 9), (sy(Qxb) + sy(Qmu)) / 2,
        "brecha = n(x̄−μ)² = " + F.fmt(n * (xb - MU) * (xb - MU), 2), {
          anchor: izq ? "end" : "start", baseline: "middle", size: 11, fill: F.color("text-2")
        });

      // marcador arrastrable del centro c
      var c0 = clamp(api.state.cPos == null ? xb + (cB - xb) * 0.55 : api.state.cPos, cA, cB);
      var mk = F.el("circle", {
        cx: sx(c0), cy: sy(Q(c0)), r: 6.5, fill: F.color("surface"),
        stroke: F.series(1), "stroke-width": 2, class: "fig-hit"
      }, layB);
      var lbl = F.text(layB, sx(c0), sy(Q(c0)) - 16,
        "c = " + F.fmt(c0, 2) + " → Q = " + F.fmt(Q(c0), 2), {
          anchor: "middle", size: 11, fill: F.color("text-2")
        });
      stopDrag = F.drag(mk, {
        onDrag: function (px) {
          var cv = clamp(sx.invert(px), cA, cB);
          api.state.cPos = cv;
          mk.setAttribute("cx", sx(cv));
          mk.setAttribute("cy", sy(Q(cv)));
          lbl.setAttribute("x", sx(cv));
          lbl.setAttribute("y", sy(Q(cv)) - 16);
          lbl.textContent = "c = " + F.fmt(cv, 2) + " → Q = " + F.fmt(Q(cv), 2);
        }
      });

      out.set("q", F.fmt(Qxb, 3));
      out.set("qmu", F.fmt(Qmu, 3));
      out.set("acum", String(acc.k));
      out.set("pn", F.fmt(acc.sN / acc.k, 4) + "   (σ² = " + VAR + ")");
      out.set("pn1", F.fmt(acc.sN1 / acc.k, 4) + "   (σ² = " + VAR + ")");
      api.state.__Qxb = Qxb;
      api.state.__Qmu = Qmu;
      api.state.__prom = [acc.sN / acc.k, acc.sN1 / acc.k];
    }

    if (!api.state.acc) reset();
    redraw();
  }, { title: "La parábola Σ(xᵢ−c)² y el n−1", page: "varianza-muestral", kind: "interactive", unidad: "8" });

})();
