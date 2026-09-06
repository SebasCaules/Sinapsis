/* ============================================================
   figuras/u4.js — figuras de la Unidad 4 (variables aleatorias continuas).

   Se carga DESPUÉS de figures.js (necesita App.registerFigure) y de
   lib-math.js (window.M, del que salen TODOS los valores numéricos:
   normPDF/normCDF/normInv, expCDF, gammafn, integrate).

   Figuras registradas
     u4-fda-escalera-vs-continua
     u4-fda-y-densidad-acopladas
     u4-regla-empirica-invariante
     u4-simetria-phi-dos-colas
     u4-falta-de-memoria-cola-renormalizada
     u4-discretizacion-a-integral
     u4-densidad-por-ancho-es-probabilidad
     u4-fractil-inverso-densidad-y-sigmoide
     u4-tres-formas-de-la-tasa-de-fallas
     u4-interpolar-vs-redondear-tabla-z
   ============================================================ */
(function () {
  "use strict";

  var A = window.App;
  if (!A || typeof A.registerFigure !== "function") return;
  var M = window.M || {};

  // ---------- utilidades locales ----------

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  // Rótulo de una línea vertical que no se sale del lienzo: se escribe a la
  // derecha de la línea salvo que ahí no entre, en cuyo caso se vuelca a la
  // izquierda (y si tampoco entra, se apoya en el margen izquierdo).
  function rotuloVertical(F, g, px, ly, str, col, xMin, xMax, lado) {
    var w = str.length * 6.6;
    var x, anchor;
    if (lado === "izq") {
      x = px - 4; anchor = "end";
      if (x - w < xMin) { x = px + 4; anchor = "start"; }
      if (anchor === "start" && x + w > xMax) { x = xMax; anchor = "end"; }
    } else {
      x = px + 4; anchor = "start";
      if (x + w > xMax) { x = px - 4; anchor = "end"; }
      if (anchor === "end" && x - w < xMin) { x = xMin; anchor = "start"; }
    }
    return F.label(g, x, ly, str, {
      size: 11, anchor: anchor, fill: F.color("text-2"), keyColor: col, mono: true
    });
  }

  function nPDF(x, mu, sd) {
    if (M.normPDF) return M.normPDF(x, mu, sd);
    mu = mu || 0; sd = sd == null ? 1 : sd;
    var z = (x - mu) / sd;
    return Math.exp(-0.5 * z * z) / (sd * Math.sqrt(2 * Math.PI));
  }
  function nCDF(x, mu, sd) { return M.normCDF(x, mu, sd); }
  function nInv(p) { return M.normInv(p, 0, 1); }

  // Integración de Simpson local (M.integrate existe, pero aquí se usa con
  // pocos nodos y sobre intervalos cortos, así que conviene el control fino).
  function simpson(f, a, b, n) {
    if (M.integrate) return M.integrate(f, a, b, n || 400);
    n = n || 400; if (n % 2) n++;
    var h = (b - a) / n, s = f(a) + f(b), i;
    for (i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * h);
    return s * h / 3;
  }

  // Integral de una densidad partida: se corta en los puntos de salto para que
  // Simpson trabaje siempre sobre un tramo suave (si no, una uniforme da error
  // de primer orden justo en los bordes del soporte).
  function piecewiseIntegral(f, a, b, brk) {
    if (!(b > a)) return 0;
    var pts = [a], i, j, s = 0;
    for (i = 0; i < brk.length; i++) if (brk[i] > a && brk[i] < b) pts.push(brk[i]);
    pts.push(b);
    for (j = 0; j < pts.length - 1; j++) {
      var lo = pts[j] + 1e-11, hi = pts[j + 1] - 1e-11;
      if (hi > lo) s += simpson(f, lo, hi, 200);
    }
    return s;
  }

  // Marco de una sub-figura dentro de un SVG compartido (paneles en columnas).
  function subScales(F, px0, px1, py0, py1, dx, dy) {
    return {
      sx: F.scale(dx, [px0, px1]),
      sy: F.scale(dy, [py0, py1])
    };
  }

  // Título de panel, siempre por encima del área de dibujo.
  function panelTitle(F, layer, x, y, str, col) {
    // El texto va SIEMPRE en tono de texto; el color de la serie entra como
    // clave (un punto delante del rótulo), nunca como color de la letra.
    F.label(layer, x, y, str, {
      size: 12, anchor: "middle", weight: 600, fill: F.color("text-2"), keyColor: col || null
    });
  }

  // ============================================================
  //  1 · FDA en escalera vs. FDA continua — por qué P(X = α) = 0
  // ============================================================

  var ATOMS = [{ x: 0.25, p: 0.20 }, { x: 0.50, p: 0.30 }, { x: 0.75, p: 0.50 }];

  function stairCDF(x) {
    var s = 0, i;
    for (i = 0; i < ATOMS.length; i++) if (x >= ATOMS[i].x - 1e-12) s += ATOMS[i].p;
    return s;
  }
  function atomAt(x) {
    var i;
    for (i = 0; i < ATOMS.length; i++) if (Math.abs(ATOMS[i].x - x) < 1e-9) return ATOMS[i].p;
    return 0;
  }

  A.registerFigure("u4-fda-escalera-vs-continua", function (host, api) {
    var F = api.Fig;
    var W = 680, H = 348;
    var svg = F.svg(host, {
      w: W, h: H,
      title: "FDA en escalera de una variable discreta frente a la FDA continua F(x)=x², con el incremento sobre (α−δ, α]"
    });

    var ctl = F.controls(host, [
      { k: "alpha", tex: "\\alpha", min: 0.05, max: 0.95, step: 0.05, value: 0.5, dec: 2 },
      { k: "delta", tex: "\\delta", min: 0.001, max: 0.5, value: 0.3, log: true, dec: 3 }
    ], function () { redraw(); });

    F.buttons(host, [
      { label: "α sobre un salto (0.50)", onClick: function () { ctl.set("alpha", 0.5); redraw(); } },
      { label: "α fuera de los saltos (0.40)", onClick: function () { ctl.set("alpha", 0.4); redraw(); } },
      { label: "δ muy chico", onClick: function () { ctl.set("delta", 0.002); redraw(); } }
    ]);

    var out = F.readouts(host, [
      { k: "d", label: "escalera: F(α) − F(α−δ)" },
      { k: "c", label: "continua: F(α) − F(α−δ)" },
      { k: "pa", tex: "P(X=\\alpha)\\ \\text{(escalera)}" }
    ]);

    F.legend(host, [
      { label: "FDA en escalera (v.a. discreta)", color: F.series(1) },
      { label: "FDA continua F(x) = x²", color: F.series(2) },
      { label: "incremento sobre (α−δ, α]", color: F.series(3), fill: true }
    ]);

    var layer = F.el("g", null, svg);

    function drawPanel(px0, px1, cont, alpha, delta) {
      var py0 = H - 52, py1 = 44;
      var sc = subScales(F, px0, px1, py0, py1, [-0.06, 1.06], [0, 1.08]);
      var sx = sc.sx, sy = sc.sy;
      var col = cont ? F.series(2) : F.series(1);
      var cAcc = F.series(3);

      F.axes(layer, {
        sx: sx, sy: sy, xTicks: 5, yTicks: 5, grid: true, y0: 0,
        xLabel: "x", yLabel: "F(x)"
      });

      // banda (α−δ, α] sobre el eje x
      var lo = clamp(alpha - delta, -0.06, 1.06);
      F.el("rect", {
        x: sx(lo), y: sy(1.08), width: Math.max(1, sx(alpha) - sx(lo)),
        height: sy(0) - sy(1.08), fill: cAcc, opacity: 0.09
      }, layer);

      var Fx = cont ? function (x) { return clamp(x, 0, 1) * clamp(x, 0, 1); } : stairCDF;

      if (cont) {
        F.curve(layer, Fx, sx, sy, {
          from: -0.06, to: 1.06, stroke: col, n: 220, serie: "FDA continua"
        });
      } else {
        // tramos horizontales + saltos, con punto lleno (derecha) y hueco (izquierda)
        // La escalera es UNA sola trayectoria en unidades de dato: los tramos
        // horizontales encadenados dibujan solos el salto vertical, y así el
        // trazo de dato queda con el grosor único del sistema.
        var edges = [-0.06].concat(ATOMS.map(function (a) { return a.x; })).concat([1.06]);
        var pasos = [], k;
        for (k = 0; k < edges.length - 1; k++) {
          var yv = stairCDF(edges[k]);
          pasos.push([edges[k], yv]);
          pasos.push([edges[k + 1], yv]);
        }
        F.line(layer, pasos, { sx: sx, sy: sy, stroke: col, serie: "FDA en escalera" });
        for (k = 0; k < ATOMS.length; k++) {
          var xa = ATOMS[k].x, yTop = stairCDF(xa), yBot = yTop - ATOMS[k].p;
          F.el("circle", { cx: sx(xa), cy: sy(yTop), r: 4.6, fill: col }, layer);
          F.el("circle", {
            cx: sx(xa), cy: sy(yBot), r: 4.6, fill: F.color("surface"),
            stroke: col, "stroke-width": 2
          }, layer);
        }
      }

      // barra del incremento F(α) − F(α−δ)
      var hi = Fx(alpha), loV = Fx(alpha - delta);
      F.el("rect", {
        x: sx(alpha) - 5, y: sy(hi), width: 10,
        height: Math.max(0.8, sy(loV) - sy(hi)),
        fill: cAcc, rx: 2
      }, layer);
      F.hline(layer, sy(hi), { x0: px0, x1: px1, stroke: cAcc, dash: "3 3" });
      F.hline(layer, sy(loV), { x0: px0, x1: px1, stroke: cAcc, dash: "3 3" });
      F.vline(layer, sx(alpha), {
        y0: sy(0), y1: py1, stroke: cAcc, dash: "4 3",
        label: "α = " + F.fmt(alpha, 2), labelAt: py1 + 14
      });
      F.vline(layer, sx(lo), {
        y0: sy(0), y1: py1, stroke: F.color("text-3"), dash: "2 3",
        label: "α−δ", labelAt: py1 + 30
      });

      return hi - loV;
    }

    function redraw() {
      while (layer.firstChild) layer.removeChild(layer.firstChild);
      var alpha = ctl.get("alpha"), delta = ctl.get("delta");

      panelTitle(F, layer, (46 + 322) / 2, 22, "v.a. discreta — FDA en escalera", F.series(1));
      panelTitle(F, layer, (400 + 664) / 2, 22, "v.a. continua — F(x) = x²", F.series(2));

      var dDisc = drawPanel(46, 322, false, alpha, delta);
      var dCont = drawPanel(400, 664, true, alpha, delta);

      out.set("d", F.fmt(dDisc, 4));
      out.set("c", F.fmt(dCont, 6));
      out.set("pa", F.fmt(atomAt(alpha), 2));
    }

    redraw();
  }, {
    title: "FDA en escalera vs. FDA continua",
    page: "variable-aleatoria-continua", kind: "interactive", unidad: "4"
  });

  // ============================================================
  //  2 · FDA y densidad acopladas
  // ============================================================

  var EJ2 = {
    cuad: {
      label: "F(x) = x² en (0, 1)",
      x0: -0.15, x1: 1.15, xdef: 0.6,
      f: function (x) { return x > 0 && x < 1 ? 2 * x : 0; },
      Fc: function (x) { return x <= 0 ? 0 : (x >= 1 ? 1 : x * x); },
      brk: [0, 1], fmax: 2.2
    },
    unif: {
      label: "Uniforme(0, 2)",
      x0: -0.3, x1: 2.3, xdef: 1.1,
      f: function (x) { return x > 0 && x < 2 ? 0.5 : 0; },
      Fc: function (x) { return x <= 0 ? 0 : (x >= 2 ? 1 : x / 2); },
      brk: [0, 2], fmax: 0.62
    },
    expo: {
      label: "Exponencial(λ = 0.8)",
      x0: -0.2, x1: 5.2, xdef: 1.2,
      f: function (x) { return x < 0 ? 0 : 0.8 * Math.exp(-0.8 * x); },
      Fc: function (x) { return x < 0 ? 0 : 1 - Math.exp(-0.8 * x); },
      brk: [0], fmax: 0.9
    }
  };

  A.registerFigure("u4-fda-y-densidad-acopladas", function (host, api) {
    var F = api.Fig;
    var W = 660;
    var ps = F.panels(host, 2, { w: W, heights: [188, 196] });
    var svgF = ps[0], svgf = ps[1];
    F.el("title", null, svgF).textContent = "FDA F(x) con el cursor en x";
    F.el("title", null, svgf).textContent = "Densidad f(x) con el área acumulada hasta x";

    var key = api.state.ej || "cuad";
    if (!EJ2[key]) key = "cuad";
    var E = EJ2[key];

    F.select(host, {
      k: "ej", label: "ejemplo",
      value: key,
      options: [
        { v: "cuad", label: EJ2.cuad.label },
        { v: "unif", label: EJ2.unif.label },
        { v: "expo", label: EJ2.expo.label }
      ]
    }, function (k, v) {
      api.setState({ ej: v, x: EJ2[v] ? EJ2[v].xdef : 0 });
    });

    var ctl = F.controls(host, [
      { k: "x", label: "cursor x", min: E.x0, max: E.x1, step: 0.005, value: E.xdef, dec: 3 }
    ], function () { redraw(); });

    var out = F.readouts(host, [
      { k: "F", tex: "F_X(x)" },
      { k: "f", tex: "f_X(x)" },
      { k: "area", label: "área acumulada (numérica)" },
      { k: "pend", label: "pendiente de la tangente" }
    ]);

    F.legend(host, [
      { label: "F(x): acumulada", color: F.series(1) },
      { label: "f(x): densidad", color: F.series(2) },
      { label: "área acumulada hasta x", color: F.series(3), fill: true },
      { label: "recta tangente a F en x", color: F.series(4), dash: true }
    ]);

    var gF = F.el("g", null, svgF), gf = F.el("g", null, svgf);
    var padL = 54, padR = 20;

    function redraw() {
      while (gF.firstChild) gF.removeChild(gF.firstChild);
      while (gf.firstChild) gf.removeChild(gf.firstChild);

      var x = clamp(ctl.get("x"), E.x0, E.x1);
      var sx = F.scale([E.x0, E.x1], [padL, W - padR]);
      var syF = F.scale([0, 1.12], [188 - 44, 18]);
      var syf = F.scale([0, E.fmax], [196 - 52, 18]);
      var cP = F.series(1), cD = F.series(2), cA = F.series(3), cG = F.series(4);

      // ---- panel superior: FDA ----
      F.axes(gF, { sx: sx, sy: syF, xTicks: 6, yTicks: 4, grid: true, y0: 0, yLabel: "F(x)" });
      F.curve(gF, E.Fc, sx, syF, { stroke: cP, n: 320, serie: "F(x)" });
      var Fv = E.Fc(x), fv = E.f(x);
      F.hline(gF, syF(Fv), { x0: padL, x1: sx(x), stroke: cA, dash: "4 3" });
      F.vline(gF, sx(x), { y0: syF(0), y1: syF(Fv), stroke: cA, dash: "4 3" });
      F.marker(gF, sx(x), syF(Fv), {
        r: 4.6, fill: cA, label: "F(x) = " + F.fmt(Fv, 3), labelDy: -11, key: false
      });

      // tangente: pendiente f(x) en unidades de datos
      var dxT = (E.x1 - E.x0) * 0.14;
      F.line(gF, [
        [sx(x - dxT), syF(clamp(Fv - fv * dxT, -0.2, 1.3))],
        [sx(x + dxT), syF(clamp(Fv + fv * dxT, -0.2, 1.3))]
      ], { stroke: cG, dash: "6 4", serie: "tangente" });

      // ---- panel inferior: densidad ----
      F.axes(gf, { sx: sx, sy: syf, xTicks: 6, yTicks: 4, grid: true, y0: 0, xLabel: "x", yLabel: "f(x)" });
      if (x > E.x0) {
        F.area(gf, E.f, sx, syf, {
          from: E.x0, to: x, fill: cA, band: true, n: 300, serie: "área acumulada"
        });
      }
      F.curve(gf, E.f, sx, syf, { stroke: cD, n: 400, serie: "f(x)" });
      F.vline(gf, sx(x), {
        y0: syf(0), y1: 18, stroke: cA, dash: "4 3",
        label: "x = " + F.fmt(x, 3), labelAt: 30
      });
      F.marker(gf, sx(x), syf(fv), {
        r: 4.6, fill: cD, label: "f(x) = " + F.fmt(fv, 3), labelDy: -11, key: false
      });

      var area = piecewiseIntegral(E.f, E.x0, Math.max(E.x0, x), E.brk);
      out.set("F", F.fmt(Fv, 4));
      out.set("f", F.fmt(fv, 4));
      out.set("area", F.fmt(area, 4));
      out.set("pend", F.fmt(fv, 4));
    }

    // arrastre del cursor sobre cualquiera de los dos paneles
    function attach(svg) {
      var stop = F.drag(svg, {
        onDrag: function (px) {
          var sx = F.scale([E.x0, E.x1], [padL, W - padR]);
          ctl.set("x", clamp(sx.invert(px), E.x0, E.x1));
          redraw();
        }
      });
      api.cleanup(stop);
    }
    attach(svgF);
    attach(svgf);

    redraw();
  }, {
    title: "FDA y densidad acopladas",
    page: "funcion-de-densidad", kind: "interactive", unidad: "4"
  });

  // ============================================================
  //  3 · Regla empírica invariante bajo μ y σ
  // ============================================================

  A.registerFigure("u4-regla-empirica-invariante", function (host, api) {
    var F = api.Fig;
    var W = 660, H = 336;
    var svg = F.svg(host, {
      w: W, h: H,
      title: "Campana normal con las bandas anidadas μ±σ, μ±2σ y μ±3σ sombreadas y su probabilidad acumulada"
    });

    var ctl = F.controls(host, [
      { k: "mu", tex: "\\mu", min: -6, max: 6, step: 0.1, value: 0, dec: 1 },
      { k: "sigma", tex: "\\sigma", min: 0.4, max: 3, step: 0.05, value: 1, dec: 2 }
    ], function () { redraw(); });

    var tg = F.toggle(host, { k: "zmode", label: "ver en unidades z", value: false },
      function () { redraw(); });

    var out = F.readouts(host, [
      { k: "p1", tex: "P(\\mu-\\sigma<X<\\mu+\\sigma)" },
      { k: "p2", tex: "P(\\mu-2\\sigma<X<\\mu+2\\sigma)" },
      { k: "p3", tex: "P(\\mu-3\\sigma<X<\\mu+3\\sigma)" },
      { k: "peak", tex: "1/(\\sqrt{2\\pi}\\,\\sigma)" }
    ]);

    // La leyenda se rearma en cada dibujo: la entrada de la N(0,1) de referencia
    // solo tiene sentido cuando el modo z la pone en pantalla.
    var cajaLeyenda = document.createElement("div");
    host.appendChild(cajaLeyenda);
    function dibujarLeyenda(enZ) {
      while (cajaLeyenda.firstChild) cajaLeyenda.removeChild(cajaLeyenda.firstChild);
      var items = [
        { label: "densidad", color: F.series(1) },
        { label: "hasta ±1σ: 68.27 %", color: F.series(2), fill: true },
        { label: "hasta ±2σ: 95.45 %", color: F.series(3), fill: true },
        { label: "hasta ±3σ: 99.73 %", color: F.series(4), fill: true }
      ];
      if (enZ) items.push({ label: "N(0,1) de referencia", color: F.series(5), dash: true });
      F.legend(cajaLeyenda, items);
    }

    var layer = F.el("g", null, svg);
    var pad = { l: 54, r: 20, t: 26, b: 50 };

    function redraw() {
      while (layer.firstChild) layer.removeChild(layer.firstChild);
      var mu = ctl.get("mu"), sd = ctl.get("sigma"), z = tg.get();
      dibujarLeyenda(z);

      var cMu = z ? 0 : mu, cSd = z ? 1 : sd;
      var x0 = cMu - 4.2 * cSd, x1 = cMu + 4.2 * cSd;
      var f = function (v) { return nPDF(v, cMu, cSd); };
      var sx = F.scale([x0, x1], [pad.l, W - pad.r]);
      var sy = F.scale([0, f(cMu) * 1.24], [H - pad.b, pad.t]);

      F.axes(layer, {
        sx: sx, sy: sy, xTicks: 7, yTicks: 4, grid: true, y0: 0,
        xLabel: z ? "z = (x − μ)/σ" : "x", yLabel: z ? "φ(z)" : "f(x)"
      });

      // Bandas ANIDADAS μ±kσ: cada una cubre el intervalo COMPLETO, así el
      // porcentaje que la rotula es la probabilidad acumulada de ese intervalo
      // y el número dice la verdad. Se dibujan de la más ancha a la más
      // angosta: los lavados se superponen hacia el centro, que es justamente
      // la lectura correcta (el núcleo pertenece a las tres).
      var bands = [
        { k: 3, col: F.series(4) },
        { k: 2, col: F.series(3) },
        { k: 1, col: F.series(2) }
      ];
      bands.forEach(function (b) {
        var hi = b.k * cSd, nom = "±" + b.k + "σ";
        F.area(layer, f, sx, sy, {
          from: cMu - hi, to: cMu + hi, fill: b.col, band: true, n: 260, serie: nom
        });
      });

      F.curve(layer, f, sx, sy, { stroke: F.series(1), n: 320, serie: "densidad" });
      if (z) {
        // se dibuja DESPUÉS de la curva principal: en unidades z las dos
        // coinciden, y solo encima se ve que el trazo a rayas cae justo sobre
        // el trazo lleno (que es lo que la figura quiere mostrar).
        F.curve(layer, function (v) { return nPDF(v, 0, 1); }, sx, sy,
          { stroke: F.series(5), dash: "9 8", n: 260, serie: "N(0,1)" });
      }

      // puntos de inflexión en μ ± σ
      [-1, 1].forEach(function (s) {
        var xi = cMu + s * cSd;
        F.marker(layer, sx(xi), sy(f(xi)), { r: 4.6, fill: F.series(1), serie: "inflexión" });
      });
      F.label(layer, sx(cMu + cSd) + 9, sy(f(cMu + cSd)) - 9, "inflexión en μ+σ",
        { size: 11, anchor: "start", fill: F.color("text-2"), keyColor: F.series(1) });

      // altura máxima
      F.hline(layer, sy(f(cMu)), {
        x0: pad.l, x1: sx(cMu), stroke: F.color("text-3"), dash: "3 3"
      });
      F.vline(layer, sx(cMu), { y0: sy(0), y1: sy(f(cMu)), stroke: F.color("text-3"), dash: "3 3" });
      F.text(layer, sx(cMu) + 6, sy(f(cMu)) - 8, "máx = " + F.fmt(f(cMu), 4),
        { size: 11, fill: F.color("text-3"), mono: true });

      // Rótulos de porcentaje, uno por banda, escalonados. Cada uno se coloca
      // en el tramo que solo esa banda cubre (entre (k−1)σ y kσ), de modo que
      // la clave de color al lado del texto coincide con la banda que rotula.
      var pcts = [
        { k: 1, y: 0.50, txt: "68.27 %", col: F.series(2) },
        { k: 2, y: 0.26, txt: "95.45 %", col: F.series(3) },
        { k: 3, y: 0.10, txt: "99.73 %", col: F.series(4) }
      ];
      pcts.forEach(function (p) {
        var xr = cMu + (p.k - 0.5) * cSd;
        F.label(layer, sx(xr), sy(f(cMu) * p.y), p.txt, {
          size: 11.5, anchor: "middle", weight: 600,
          fill: F.color("text-2"), keyColor: p.col, mono: true
        });
        F.vline(layer, sx(cMu + p.k * cSd), {
          y0: sy(0), y1: sy(f(cMu) * (p.y + 0.06)), stroke: p.col, dash: "3 3"
        });
        F.vline(layer, sx(cMu - p.k * cSd), {
          y0: sy(0), y1: sy(f(cMu) * (p.y + 0.06)), stroke: p.col, dash: "3 3"
        });
      });

      out.set("p1", F.fmt(100 * (nCDF(mu + sd, mu, sd) - nCDF(mu - sd, mu, sd)), 2) + " %");
      out.set("p2", F.fmt(100 * (nCDF(mu + 2 * sd, mu, sd) - nCDF(mu - 2 * sd, mu, sd)), 2) + " %");
      out.set("p3", F.fmt(100 * (nCDF(mu + 3 * sd, mu, sd) - nCDF(mu - 3 * sd, mu, sd)), 2) + " %");
      out.set("peak", F.fmt(nPDF(mu, mu, sd), 4));
    }

    redraw();
  }, {
    title: "Regla empírica invariante",
    page: "distribucion-normal", kind: "interactive", unidad: "4"
  });

  // ============================================================
  //  4 · Simetría Φ(−z) = 1 − Φ(z)
  // ============================================================

  A.registerFigure("u4-simetria-phi-dos-colas", function (host, api) {
    var F = api.Fig;
    var W = 660, H = 320;
    var svg = F.svg(host, {
      w: W, h: H,
      title: "Densidad normal estándar con las dos colas simétricas y la región central sombreadas"
    });

    var ctl = F.controls(host, [
      { k: "z", label: "z", min: 0, max: 3.5, step: 0.01, value: 1, dec: 4 }
    ], function () { redraw(); });

    F.buttons(host, [
      { label: "z = 1", onClick: function () { ctl.set("z", 1); redraw(); } },
      { label: "z = 1.6449", onClick: function () { ctl.set("z", 1.6449); redraw(); } },
      { label: "z = 1.96", onClick: function () { ctl.set("z", 1.96); redraw(); } },
      { label: "z = 2.5758", onClick: function () { ctl.set("z", 2.5758); redraw(); } }
    ]);

    var out = F.readouts(host, [
      { k: "izq", tex: "\\Phi(-z)" },
      { k: "der", tex: "1-\\Phi(z)" },
      { k: "cen", tex: "2\\Phi(z)-1" },
      { k: "dif", label: "diferencia entre las dos colas" }
    ]);

    F.legend(host, [
      { label: "densidad φ(z)", color: F.series(1) },
      { label: "cola izquierda Φ(−z)", color: F.series(2), fill: true },
      { label: "cola derecha 1 − Φ(z)", color: F.series(3), fill: true },
      { label: "región central 2Φ(z) − 1", color: F.series(4), fill: true }
    ]);

    var layer = F.el("g", null, svg);
    var pad = { l: 54, r: 20, t: 34, b: 50 };

    function redraw() {
      while (layer.firstChild) layer.removeChild(layer.firstChild);
      var z = ctl.get("z");
      var f = function (v) { return nPDF(v, 0, 1); };
      var sx = F.scale([-4, 4], [pad.l, W - pad.r]);
      var sy = F.scale([0, 0.5], [H - pad.b, pad.t]);
      var cA = F.series(2), cB = F.series(3), cG = F.series(4);

      F.axes(layer, {
        sx: sx, sy: sy, xTicks: 9, yTicks: 4, grid: true, y0: 0,
        xLabel: "z", yLabel: "φ(z)"
      });

      F.area(layer, f, sx, sy, { from: -4, to: -z, fill: cA, band: true, n: 220, serie: "cola izquierda" });
      F.area(layer, f, sx, sy, { from: z, to: 4, fill: cB, band: true, n: 220, serie: "cola derecha" });
      F.area(layer, f, sx, sy, { from: -z, to: z, fill: cG, band: true, n: 260, serie: "región central" });
      F.curve(layer, f, sx, sy, { stroke: F.series(1), n: 340, serie: "φ(z)" });

      F.vline(layer, sx(-z), { y0: sy(0), y1: pad.t, stroke: cA, dash: "4 3" });
      F.vline(layer, sx(z), { y0: sy(0), y1: pad.t, stroke: cB, dash: "4 3" });
      rotuloVertical(F, layer, sx(-z), pad.t + 14, "−z = " + F.fmt(-z, 3), cA, pad.l + 2, W - pad.r - 2, "izq");
      rotuloVertical(F, layer, sx(z), pad.t + 14, "z = " + F.fmt(z, 3), cB, pad.l + 2, W - pad.r - 2);

      var pi = nCDF(-z, 0, 1), pd = 1 - nCDF(z, 0, 1), pc = 2 * nCDF(z, 0, 1) - 1;

      // Rótulos de área. Con z grande las dos líneas se pegan a los bordes del
      // lienzo, así que el rótulo se vuelca hacia el centro (invierte el anclaje)
      // en vez de salirse del SVG o pisar los ticks del eje y.
      var tIzq = "Φ(−z) = " + F.fmt(pi, 4);
      var tDer = "1−Φ(z) = " + F.fmt(pd, 4);
      var xIzq = sx(-z) - 8, aIzq = "end";
      if (xIzq - tIzq.length * 7 < pad.l + 6) { xIzq = sx(-z) + 8; aIzq = "start"; }
      var xDer = sx(z) + 8, aDer = "start";
      if (xDer + tDer.length * 7 > W - pad.r - 6) { xDer = sx(z) - 8; aDer = "end"; }
      F.label(layer, xIzq, pad.t + 40, tIzq, {
        size: 11.5, anchor: aIzq, fill: F.color("text-2"), keyColor: cA, mono: true
      });
      F.label(layer, xDer, pad.t + 40, tDer, {
        size: 11.5, anchor: aDer, fill: F.color("text-2"), keyColor: cB, mono: true
      });
      F.label(layer, sx(0), sy(0.5 * 0.42), F.fmt(pc, 4), {
        size: 12.5, anchor: "middle", weight: 600, fill: F.color("text-2"), keyColor: cG, mono: true
      });

      out.set("izq", F.fmt(pi, 6));
      out.set("der", F.fmt(pd, 6));
      out.set("cen", F.fmt(pc, 6));
      out.set("dif", Math.abs(pi - pd) < 1e-9 ? "0 (coinciden)" : F.fmt(Math.abs(pi - pd), 12));
    }

    redraw();
  }, {
    title: "Simetría de Φ y las dos colas",
    page: "estandarizacion-y-tabla-normal", kind: "interactive", unidad: "4"
  });

  // ============================================================
  //  5 · Falta de memoria: la cola renormalizada
  // ============================================================

  A.registerFigure("u4-falta-de-memoria-cola-renormalizada", function (host, api) {
    var F = api.Fig;
    var W = 660;
    var ps = F.panels(host, 2, { w: W, heights: [184, 200] });
    var svgTop = ps[0], svgBot = ps[1];

    var ctl = F.controls(host, [
      { k: "lam", tex: "\\lambda", min: 0.2, max: 2, step: 0.05, value: 0.6, dec: 2 },
      { k: "t", label: "t (edad ya sobrevivida)", min: 0, max: 6, step: 0.1, value: 2, dec: 1 },
      { k: "dl", label: "Δ (tiempo adicional)", min: 0.1, max: 4, step: 0.1, value: 1, dec: 1 }
    ], function () { redraw(); });

    var out = F.readouts(host, [
      { k: "cond", tex: "P(X>t+\\Delta \\mid X>t)" },
      { k: "plain", tex: "P(X>\\Delta)" },
      { k: "dif", label: "diferencia" },
      { k: "st", tex: "P(X>t)" }
    ]);

    F.legend(host, [
      { label: "densidad exponencial f(x)", color: F.series(1) },
      { label: "cola x > t (área = P(X > t))", color: F.series(2), fill: true },
      { label: "vida restante renormalizada", color: F.series(3) },
      { label: "exponencial original desde 0", color: F.series(1), dash: true }
    ]);

    var gT = F.el("g", null, svgTop), gB = F.el("g", null, svgBot);
    var pad = { l: 56, r: 20 };

    function redraw() {
      while (gT.firstChild) gT.removeChild(gT.firstChild);
      while (gB.firstChild) gB.removeChild(gB.firstChild);

      var lam = ctl.get("lam"), t = ctl.get("t"), dl = ctl.get("dl");
      var cP = F.series(1), cA = F.series(2), cD = F.series(3);
      var f = function (x) { return x < 0 ? 0 : lam * Math.exp(-lam * x); };

      // ---- panel superior: densidad completa, cola resaltada ----
      var xmaxT = t + 5 / lam;
      var sxT = F.scale([0, xmaxT], [pad.l, W - pad.r]);
      var syT = F.scale([0, lam * 1.22], [184 - 44, 20]);
      F.axes(gT, { sx: sxT, sy: syT, xTicks: 6, yTicks: 4, grid: true, y0: 0, xLabel: "x", yLabel: "f(x)" });

      F.area(gT, f, sxT, syT, { from: t, to: xmaxT, fill: cA, band: true, n: 260, serie: "cola x > t" });
      F.curve(gT, f, sxT, syT, { from: 0, to: t, stroke: cP, opacity: 0.30, n: 200, serie: false });
      F.curve(gT, f, sxT, syT, { from: t, to: xmaxT, stroke: cP, n: 260, serie: "densidad" });
      F.vline(gT, sxT(t), {
        y0: syT(0), y1: 20, stroke: cA, dash: "4 3",
        label: "t = " + F.fmt(t, 1), labelAt: 34
      });
      if (t + dl <= xmaxT) {
        F.vline(gT, sxT(t + dl), {
          y0: syT(0), y1: 20, stroke: cD, dash: "2 3",
          label: "t+Δ", labelAt: 50
        });
      }

      // ---- panel inferior: cola renormalizada, eje fijo ----
      var ymaxB = 5 / lam;
      var sxB = F.scale([0, ymaxB], [pad.l, W - pad.r]);
      var syB = F.scale([0, lam * 1.22], [200 - 52, 20]);
      var st = Math.exp(-lam * t);
      var g = function (y) { return y < 0 ? 0 : f(t + y) / st; };   // = λe^(−λy)

      F.axes(gB, {
        sx: sxB, sy: syB, xTicks: 6, yTicks: 4, grid: true, y0: 0,
        xLabel: "y = x − t  (vida restante)", yLabel: "f(y)"
      });
      F.area(gB, g, sxB, syB, {
        from: 0, to: Math.min(dl, ymaxB), fill: cD, band: true, n: 220, serie: "P(X−t ≤ Δ | X > t)"
      });
      // La renormalizada va LLENA y debajo; la exponencial original se dibuja
      // ENCIMA y a rayas: solo así se ve que una cae justo sobre la otra, que
      // es lo que la figura enseña.
      F.curve(gB, g, sxB, syB, { stroke: cD, n: 300, serie: "vida restante" });
      // Raya corta y hueco largo: así el trazo lleno de abajo se ve entre las
      // rayas y queda claro que las dos curvas son la MISMA.
      F.curve(gB, f, sxB, syB, { stroke: cP, dash: "4 10", n: 300, serie: "exponencial desde 0" });
      if (dl <= ymaxB) {
        F.vline(gB, sxB(dl), {
          y0: syB(0), y1: 20, stroke: cD, dash: "2 3",
          label: "Δ = " + F.fmt(dl, 1), labelAt: 34
        });
      }

      var pCond = (1 - M.expCDF(t + dl, lam)) / (1 - M.expCDF(t, lam));
      var pPlain = 1 - M.expCDF(dl, lam);
      out.set("cond", F.fmt(pCond, 6));
      out.set("plain", F.fmt(pPlain, 6));
      out.set("dif", Math.abs(pCond - pPlain) < 1e-9 ? "0 (coinciden)" : F.fmt(Math.abs(pCond - pPlain), 12));
      out.set("st", F.fmt(st, 6));
    }

    redraw();
  }, {
    title: "Falta de memoria de la exponencial",
    page: "distribucion-exponencial", kind: "interactive", unidad: "4"
  });

  // ============================================================
  //  6 · De la suma discreta a la integral
  // ============================================================

  A.registerFigure("u4-discretizacion-a-integral", function (host, api) {
    var F = api.Fig;
    var W = 660, H = 336;
    var svg = F.svg(host, {
      w: W, h: H,
      title: "Densidad f(x)=2x discretizada en intervalos de ancho 2δ, con la suma Σ xᵢ pᵢ frente a E[X]"
    });

    var ctl = F.controls(host, [
      { k: "delta", tex: "\\delta\\ \\text{(semiancho)}", min: 0.005, max: 0.25, value: 0.125, log: true, dec: 3 },
      { k: "off", label: "corrimiento de la grilla", min: 0, max: 1, step: 0.05, value: 0, dec: 2 }
    ], function () { redraw(); });

    var out = F.readouts(host, [
      { k: "sum", tex: "\\sum_i x_i\\,p_i" },
      { k: "ex", tex: "\\E[X]=\\int_0^1 x\\,f_X(x)\\,dx" },
      { k: "err", label: "error absoluto" },
      { k: "nb", label: "cantidad de intervalos" }
    ]);

    F.legend(host, [
      { label: "densidad f(x) = 2x", color: F.series(1) },
      { label: "intervalos de ancho 2δ (área = pᵢ)", color: F.series(2), fill: true },
      { label: "Σ xᵢ·pᵢ (aproximación)", color: F.series(3), dash: true },
      { label: "E[X] = 2/3 (exacto)", color: F.series(4), dash: true }
    ]);

    var layer = F.el("g", null, svg);
    var pad = { l: 54, r: 20, t: 40, b: 50 };
    var EXACT = 2 / 3;

    function redraw() {
      while (layer.firstChild) layer.removeChild(layer.firstChild);
      var d = ctl.get("delta"), s = ctl.get("off");
      var w = 2 * d;
      var sx = F.scale([-0.05, 1.05], [pad.l, W - pad.r]);
      var sy = F.scale([0, 2.35], [H - pad.b, pad.t]);
      var cP = F.series(1), cA = F.series(2);

      F.axes(layer, {
        sx: sx, sy: sy, xTicks: 6, yTicks: 5, grid: true, y0: 0,
        xLabel: "x", yLabel: "f(x)"
      });

      var k = 0, sum = 0, nb = 0, bars = [];
      while (true) {
        var e = (s - 1) * w + k * w;
        if (e >= 1 - 1e-12) break;
        k++;
        var a = Math.max(0, e), b = Math.min(1, e + w);
        if (b - a <= 1e-9) continue;
        var p = b * b - a * a;              // F(b) − F(a) con F(x) = x²
        var mid = (a + b) / 2;
        sum += mid * p;
        nb++;
        bars.push({ a: a, b: b, h: p / (b - a) });
        if (k > 500) break;
      }

      // Los rectángulos quedan como lavado plano y el PERFIL escalonado es la
      // marca que porta la forma: es la que se ve converger a la densidad.
      bars.forEach(function (bb) {
        F.el("rect", {
          x: sx(bb.a), y: sy(bb.h),
          width: Math.max(0.6, sx(bb.b) - sx(bb.a)),
          height: Math.max(0.5, sy(0) - sy(bb.h)),
          fill: cA, opacity: 0.16
        }, layer);
      });
      var perfil = [];
      bars.forEach(function (bb) {
        perfil.push([bb.a, bb.h]);
        perfil.push([bb.b, bb.h]);
      });
      if (perfil.length) {
        F.line(layer, perfil, { sx: sx, sy: sy, stroke: cA, serie: "intervalos de ancho 2δ" });
      }

      F.curve(layer, function (x) { return x > 0 && x < 1 ? 2 * x : 0; }, sx, sy,
        { stroke: cP, n: 300, serie: "densidad f(x) = 2x" });

      F.vline(layer, sx(EXACT), { y0: sy(0), y1: pad.t, stroke: F.series(4), dash: "6 4" });
      F.label(layer, sx(EXACT), pad.t - 8, "E[X] = 2/3", {
        size: 11.5, anchor: "middle", fill: F.color("text-2"), keyColor: F.series(4), mono: true
      });
      F.vline(layer, sx(sum), { y0: sy(0), y1: pad.t + 16, stroke: F.series(3), dash: "3 3" });
      F.label(layer, sx(sum), pad.t + 30, "Σ xᵢ·pᵢ = " + F.fmt(sum, 4), {
        size: 11.5, anchor: "middle", fill: F.color("text-2"), keyColor: F.series(3), mono: true
      });

      out.set("sum", F.fmt(sum, 6));
      out.set("ex", F.fmt(EXACT, 6));
      out.set("err", F.fmt(Math.abs(sum - EXACT), 6));
      out.set("nb", String(nb));
    }

    redraw();
  }, {
    title: "De la suma discreta a la integral",
    page: "variable-aleatoria-continua", kind: "interactive", unidad: "4"
  });

  // ============================================================
  //  7 · f(x)·Δx ≈ P — por qué la densidad puede pasar de 1
  // ============================================================

  var EJ7 = {
    cub: {
      label: "f(x) = 3x² en (0, 1) — máximo 3",
      x0: 0, x1: 1, xdef: 0.6, dxdef: 0.3, dxmax: 0.8, ymax: 3.4,
      f: function (x) { return x > 0 && x < 1 ? 3 * x * x : 0; },
      Fc: function (x) { var c = clamp(x, 0, 1); return c * c * c; }
    },
    norm: {
      label: "N(0, 1) — máximo 0.399",
      x0: -3.4, x1: 3.4, xdef: 0.4, dxdef: 0.8, dxmax: 2.4, ymax: 0.52,
      f: function (x) { return nPDF(x, 0, 1); },
      Fc: function (x) { return nCDF(x, 0, 1); }
    },
    cuad: {
      label: "f(x) = 2x en (0, 1) — máximo 2",
      x0: 0, x1: 1, xdef: 0.6, dxdef: 0.3, dxmax: 0.8, ymax: 2.35,
      f: function (x) { return x > 0 && x < 1 ? 2 * x : 0; },
      Fc: function (x) { var c = clamp(x, 0, 1); return c * c; }
    },
    unif: {
      label: "Uniforme(0, 0.5) — densidad 2",
      x0: -0.1, x1: 0.6, xdef: 0.25, dxdef: 0.15, dxmax: 0.5, ymax: 2.35,
      f: function (x) { return x > 0 && x < 0.5 ? 2 : 0; },
      Fc: function (x) { return 2 * clamp(x, 0, 0.5); }
    }
  };

  A.registerFigure("u4-densidad-por-ancho-es-probabilidad", function (host, api) {
    var F = api.Fig;
    var W = 660, H = 336;
    var svg = F.svg(host, {
      w: W, h: H,
      title: "Rectángulo f(x)·Δx superpuesto al área exacta bajo la densidad en el mismo intervalo"
    });

    var key = api.state.ej7 || "cub";
    if (!EJ7[key]) key = "cub";
    var E = EJ7[key];

    F.select(host, {
      k: "ej7", label: "densidad", value: key,
      options: [
        { v: "cub", label: EJ7.cub.label },
        { v: "cuad", label: EJ7.cuad.label },
        { v: "norm", label: EJ7.norm.label },
        { v: "unif", label: EJ7.unif.label }
      ]
    }, function (k, v) {
      api.setState({ ej7: v, x7: EJ7[v].xdef, dx7: EJ7[v].dxdef });
    });

    var ctl = F.controls(host, [
      { k: "x7", label: "x (centro)", min: E.x0, max: E.x1, step: 0.005, value: E.xdef, dec: 3 },
      { k: "dx7", label: "Δx (ancho)", min: (E.x1 - E.x0) / 200, max: E.dxmax, value: E.dxdef, log: true, dec: 4 }
    ], function () { redraw(); });

    var out = F.readouts(host, [
      { k: "fx", tex: "f_X(x)" },
      { k: "rect", tex: "f_X(x)\\,\\Delta x" },
      { k: "int", tex: "\\int_{x-\\Delta x/2}^{x+\\Delta x/2} f_X" },
      { k: "err", label: "error relativo" }
    ]);

    F.legend(host, [
      { label: "densidad f(x)", color: F.series(1) },
      { label: "área exacta (probabilidad)", color: F.series(2), fill: true },
      { label: "rectángulo f(x)·Δx", color: F.series(3), dash: true },
      { label: "nivel y = 1", color: F.color("text-3"), dash: true }
    ]);

    var layer = F.el("g", null, svg);
    var pad = { l: 54, r: 20, t: 40, b: 50 };

    function redraw() {
      while (layer.firstChild) layer.removeChild(layer.firstChild);
      var x = clamp(ctl.get("x7"), E.x0, E.x1);
      var dx = ctl.get("dx7");
      var a = x - dx / 2, b = x + dx / 2;
      var sx = F.scale([E.x0, E.x1], [pad.l, W - pad.r]);
      var sy = F.scale([0, E.ymax], [H - pad.b, pad.t]);
      var cA = F.series(3), cG = F.series(2);

      F.axes(layer, {
        sx: sx, sy: sy, xTicks: 7, yTicks: 5, grid: true, y0: 0,
        xLabel: "x", yLabel: "f(x)"
      });

      // área exacta
      F.area(layer, E.f, sx, sy, {
        from: Math.max(a, E.x0), to: Math.min(b, E.x1), fill: cG, band: true, n: 300,
        serie: "área exacta"
      });
      // rectángulo f(x)·Δx
      var fv = E.f(x);
      var ra = sx(Math.max(a, E.x0)), rb = sx(Math.min(b, E.x1));
      F.el("rect", {
        x: Math.min(ra, rb), y: sy(fv), width: Math.max(1, Math.abs(rb - ra)),
        height: Math.max(0.5, sy(0) - sy(fv)),
        fill: "none", stroke: cA, "stroke-width": 2, "stroke-dasharray": "5 4"
      }, layer);

      F.curve(layer, E.f, sx, sy, { stroke: F.series(1), n: 420, serie: "densidad f(x)" });

      if (E.ymax > 1) {
        F.hline(layer, sy(1), { x0: pad.l, x1: W - pad.r, stroke: F.color("text-3"), dash: "5 4" });
        F.label(layer, W - pad.r - 4, sy(1) - 6, "y = 1", {
          size: 11, anchor: "end", fill: F.color("text-2"), keyColor: F.color("text-3"), mono: true
        });
      }

      F.vline(layer, sx(x), {
        y0: sy(0), y1: pad.t, stroke: cA, dash: "2 3",
        label: "x = " + F.fmt(x, 3), labelAt: pad.t + 14
      });
      F.marker(layer, sx(x), sy(fv), {
        r: 4.6, fill: cA, label: "f(x) = " + F.fmt(fv, 3), labelDy: -11, key: false
      });

      var exact = E.Fc(b) - E.Fc(a);
      var approx = fv * dx;
      var rel = exact > 0 ? Math.abs(approx - exact) / exact : 0;

      out.set("fx", F.fmt(fv, 4));
      out.set("rect", F.fmt(approx, 5));
      out.set("int", F.fmt(exact, 5));
      out.set("err", F.fmt(100 * rel, 3) + " %");
    }

    redraw();
  }, {
    title: "f(x)·Δx aproxima una probabilidad",
    page: "funcion-de-densidad", kind: "interactive", unidad: "4"
  });

  // ============================================================
  //  8 · El problema inverso: de α al fractil z_α
  // ============================================================

  A.registerFigure("u4-fractil-inverso-densidad-y-sigmoide", function (host, api) {
    var F = api.Fig;
    var W = 660;
    var ps = F.panels(host, 2, { w: W, heights: [178, 206] });
    var svgD = ps[0], svgS = ps[1];

    var ctl = F.controls(host, [
      { k: "alpha", tex: "\\alpha", min: 0.001, max: 0.999, step: 0.001, value: 0.95, dec: 3 }
    ], function () { redraw(); });

    F.buttons(host, [
      { label: "α = 0.90", onClick: function () { ctl.set("alpha", 0.90); redraw(); } },
      { label: "α = 0.95", onClick: function () { ctl.set("alpha", 0.95); redraw(); } },
      { label: "α = 0.975", onClick: function () { ctl.set("alpha", 0.975); redraw(); } },
      { label: "α = 0.99", onClick: function () { ctl.set("alpha", 0.99); redraw(); } }
    ]);

    var out = F.readouts(host, [
      { k: "za", tex: "z_\\alpha=\\Phi^{-1}(\\alpha)" },
      { k: "z1a", tex: "z_{1-\\alpha}" },
      { k: "chk", tex: "z_{1-\\alpha}+z_\\alpha" },
      { k: "cola", tex: "1-\\alpha" }
    ]);

    F.legend(host, [
      { label: "densidad φ(z)", color: F.series(1) },
      { label: "área α a la izquierda del fractil", color: F.series(2), fill: true },
      { label: "sigmoide Φ(z)", color: F.series(3) },
      { label: "construcción del fractil espejo", color: F.series(4), dash: true }
    ]);

    var gD = F.el("g", null, svgD), gS = F.el("g", null, svgS);
    var pad = { l: 56, r: 20 };
    var Z0 = -3.6, Z1 = 3.6;

    function redraw() {
      while (gD.firstChild) gD.removeChild(gD.firstChild);
      while (gS.firstChild) gS.removeChild(gS.firstChild);

      var al = clamp(ctl.get("alpha"), 0.001, 0.999);
      var za = clamp(nInv(al), Z0, Z1);
      var z1a = clamp(nInv(1 - al), Z0, Z1);
      var sx = F.scale([Z0, Z1], [pad.l, W - pad.r]);
      var cA = F.series(2), cD = F.series(3), cG = F.series(4);
      var f = function (v) { return nPDF(v, 0, 1); };

      // ---- panel superior: densidad ----
      var syD = F.scale([0, 0.5], [178 - 40, 20]);
      F.axes(gD, { sx: sx, sy: syD, xTicks: 9, yTicks: 3, grid: true, y0: 0, yLabel: "φ(z)" });
      F.area(gD, f, sx, syD, { from: Z0, to: za, fill: cA, band: true, n: 260, serie: "área α" });
      F.curve(gD, f, sx, syD, { stroke: F.series(1), n: 320, serie: "φ(z)" });
      F.vline(gD, sx(za), { y0: syD(0), y1: 20, stroke: cA, dash: "4 3" });
      F.vline(gD, sx(z1a), { y0: syD(0), y1: 20, stroke: cG, dash: "2 3" });
      // Los símbolos compuestos (z con subíndice) los muestran las lecturas de
      // abajo, ya tipografiadas; en el lienzo van los nombres en palabras.
      rotuloVertical(F, gD, sx(za), 32, "fractil = " + F.fmt(za, 4), cA, pad.l + 4, W - pad.r - 4);
      rotuloVertical(F, gD, sx(z1a), 48, "espejo = " + F.fmt(z1a, 4), cG, pad.l + 4, W - pad.r - 4);
      // Con α en los extremos el punto de anclaje natural cae fuera del dominio;
      // en ese caso el rótulo se apoya al costado de la línea z_α, del lado en
      // que sí entra, en vez de quedar cortado contra el borde del lienzo.
      var xArea = sx(Math.min(za, 1.2) - 1.3), anchorArea = "middle";
      if (xArea < pad.l + 70) { xArea = sx(za) + 8; anchorArea = "start"; }
      else if (xArea > W - pad.r - 70) { xArea = sx(za) - 8; anchorArea = "end"; }
      F.label(gD, xArea, syD(0.5 * 0.30), "área = α = " + F.fmt(al, 3), {
        size: 11.5, anchor: anchorArea, weight: 600,
        fill: F.color("text-2"), keyColor: cA, mono: true
      });

      // ---- panel inferior: sigmoide Φ ----
      var syS = F.scale([0, 1.06], [206 - 50, 20]);
      F.axes(gS, {
        sx: sx, sy: syS, xTicks: 9, yTicks: 5, grid: true, y0: 0,
        xLabel: "z", yLabel: "Φ(z)"
      });
      F.curve(gS, function (v) { return nCDF(v, 0, 1); }, sx, syS,
        { stroke: cD, n: 340, serie: "Φ(z)" });

      // Construcción α → fractil: entrar por el eje vertical, cruzar y bajar.
      // Son líneas de REFERENCIA (canal secundario), no trayectorias de dato.
      var guia = { width: 1.5, cls: "fig-ref", serie: false };
      F.line(gS, [[pad.l, syS(al)], [sx(za), syS(al)]],
        { stroke: cA, dash: "5 4", width: guia.width, cls: guia.cls, serie: false });
      F.line(gS, [[sx(za), syS(al)], [sx(za), syS(0)]],
        { stroke: cA, dash: "5 4", width: guia.width, cls: guia.cls, serie: false });
      F.marker(gS, sx(za), syS(al), { r: 4.6, fill: cA, serie: "fractil" });
      F.label(gS, pad.l + 4, syS(al) - 6, "α = " + F.fmt(al, 3), {
        size: 11, fill: F.color("text-2"), keyColor: cA, mono: true
      });

      // punto espejo: mismo trazado con la cola complementaria
      F.line(gS, [[pad.l, syS(1 - al)], [sx(z1a), syS(1 - al)]],
        { stroke: cG, dash: "3 3", width: guia.width, cls: guia.cls, serie: false });
      F.line(gS, [[sx(z1a), syS(1 - al)], [sx(z1a), syS(0)]],
        { stroke: cG, dash: "3 3", width: guia.width, cls: guia.cls, serie: false });
      F.marker(gS, sx(z1a), syS(1 - al), { r: 4.6, fill: cG, serie: "espejo" });
      F.label(gS, pad.l + 4, syS(1 - al) - 6, "1−α = " + F.fmt(1 - al, 3), {
        size: 11, fill: F.color("text-2"), keyColor: cG, mono: true
      });

      out.set("za", F.fmt(za, 5));
      out.set("z1a", F.fmt(z1a, 5));
      out.set("chk", F.fmt(za + z1a, 6) + " (≈ 0: son opuestos)");
      out.set("cola", F.fmt(1 - al, 4));
    }

    redraw();
  }, {
    title: "Fractil inverso en la densidad y en la sigmoide",
    page: "estandarizacion-y-tabla-normal", kind: "interactive", unidad: "4"
  });

  // ============================================================
  //  9 · Las tres formas de R(t): desgaste, azar, mortalidad infantil
  // ============================================================

  A.registerFigure("u4-tres-formas-de-la-tasa-de-fallas", function (host, api) {
    var F = api.Fig;
    var W = 700, H = 316;
    var svg = F.svg(host, {
      w: W, h: H,
      title: "Tasa de fallas, supervivencia y densidad de una familia Weibull al variar el parámetro de forma b"
    });

    var ctl = F.controls(host, [
      { k: "b", label: "b (forma)", min: 0.3, max: 3, step: 0.05, value: 2, dec: 2 },
      { k: "lam", tex: "\\lambda\\ \\text{(escala)}", min: 0.3, max: 2, step: 0.05, value: 1, dec: 2 }
    ], function () { redraw(); });

    F.buttons(host, [
      { label: "b = 0.6 (mortalidad infantil)", onClick: function () { ctl.set("b", 0.6); redraw(); } },
      { label: "b = 1 (exponencial)", onClick: function () { ctl.set("b", 1); redraw(); } },
      { label: "b = 2.5 (desgaste)", onClick: function () { ctl.set("b", 2.5); redraw(); } }
    ]);

    var out = F.readouts(host, [
      { k: "rama", label: "forma de R" },
      { k: "r1", tex: "R(1/\\lambda)=\\lambda b" },
      { k: "s1", tex: "S(1/\\lambda)=e^{-1}" },
      { k: "et", tex: "\\E[T]=\\Gamma(1+1/b)/\\lambda" },
      { k: "med", tex: "\\text{mediana}=(\\ln 2)^{1/b}/\\lambda" }
    ]);

    // la leyenda se rehace en cada dibujo: el color de la curva depende de la rama
    var leg = null;
    function relegend(col, rama) {
      if (leg && leg.el && leg.el.parentNode) leg.el.parentNode.removeChild(leg.el);
      leg = F.legend(host, [
        { label: "b = " + F.fmt(ctl.get("b"), 2) + " (" + rama + ")", color: col },
        { label: "b = 1 (exponencial)", color: F.color("text-3"), dash: true }
      ]);
    }

    var layer = F.el("g", null, svg);
    var PX = [[46, 220], [268, 442], [490, 664]];
    var PY = [H - 52, 54];

    function series(fn, t0, t1, n) {
      var pts = [], i, t, v;
      for (i = 0; i <= n; i++) {
        t = t0 + (t1 - t0) * i / n;
        v = fn(t);
        if (isFinite(v)) pts.push([t, v]);
      }
      return pts;
    }
    function maxOf(pts) {
      var m = 0, i;
      for (i = 0; i < pts.length; i++) if (pts[i][1] > m) m = pts[i][1];
      return m;
    }

    function drawPanel(idx, title, pts, ref, t0, t1, ymax, col, ylab, xlab) {
      var sx = F.scale([0, t1], [PX[idx][0], PX[idx][1]]);
      var sy = F.scale([0, ymax], [PY[0], PY[1]]);
      F.axes(layer, {
        sx: sx, sy: sy, xTicks: 4, yTicks: 4, grid: true, y0: 0,
        xLabel: xlab, yLabel: ylab
      });
      panelTitle(F, layer, (PX[idx][0] + PX[idx][1]) / 2, 34, title, null);
      F.line(layer, ref, { sx: sx, sy: sy, stroke: F.color("text-3"), dash: "6 4", serie: "b = 1" });
      F.line(layer, pts, { sx: sx, sy: sy, stroke: col, serie: "b actual" });
      return { sx: sx, sy: sy };
    }

    function redraw() {
      while (layer.firstChild) layer.removeChild(layer.firstChild);
      var b = ctl.get("b"), lam = ctl.get("lam");
      var t0 = 0.05 / lam, t1 = 3 / lam;

      var R = function (t) { return lam * b * Math.pow(lam * t, b - 1); };
      var S = function (t) { return Math.exp(-Math.pow(lam * t, b)); };
      var fd = function (t) { return R(t) * S(t); };
      var Re = function () { return lam; };
      var Se = function (t) { return Math.exp(-lam * t); };
      var fe = function (t) { return lam * Math.exp(-lam * t); };

      var pR = series(R, t0, t1, 220), pS = series(S, 0, t1, 220), pF = series(fd, t0, t1, 220);
      var rR = series(Re, t0, t1, 2), rS = series(Se, 0, t1, 220), rF = series(fe, t0, t1, 220);

      var yR = Math.max(maxOf(pR), lam * 1.4) * 1.14;
      var yF = Math.max(maxOf(pF), maxOf(rF)) * 1.14;

      var creciente = b > 1.02, decreciente = b < 0.98;
      // La familia es UNA sola serie: la rama (desgaste, azar, mortalidad
      // infantil) se lee en la leyenda y en la lectura «forma de R», no en un
      // color de estado que cambie bajo los pies del lector.
      var col = F.series(1);

      drawPanel(0, "tasa de fallas R(t)", pR, rR, t0, t1, yR, col, "R(t)", "t");
      drawPanel(1, "supervivencia S(t)", pS, rS, 0, t1, 1.08, col, "S(t)", "t");
      drawPanel(2, "densidad f(t)", pF, rF, t0, t1, yF, col, "f(t)", "t");

      var rama = creciente ? "R creciente — desgaste"
        : (decreciente ? "R decreciente — mortalidad infantil"
          : "R constante — falla al azar (exponencial)");

      relegend(col, creciente ? "desgaste" : (decreciente ? "mortalidad infantil" : "falla al azar"));
      out.set("rama", rama);
      out.set("r1", F.fmt(lam * b, 4));
      out.set("s1", F.fmt(S(1 / lam), 4));
      var et = M.gammafn ? M.gammafn(1 + 1 / b) / lam : NaN;
      out.set("et", F.fmt(et, 4));
      out.set("med", F.fmt(Math.pow(Math.LN2, 1 / b) / lam, 4));
    }

    redraw();
  }, {
    title: "Las tres formas de la tasa de fallas",
    page: "tasa-de-fallas", kind: "interactive", unidad: "4"
  });

  // ============================================================
  //  10 · Interpolar vs. redondear en la tabla de Φ
  // ============================================================

  A.registerFigure("u4-interpolar-vs-redondear-tabla-z", function (host, api) {
    var F = api.Fig;
    var W = 680, H = 344, PB = 268;
    var svg = F.svg(host, {
      w: W, h: H,
      title: "Ampliación de Φ entre las filas z = 0.66 y z = 0.67, con la cuerda de interpolación y el valor redondeado"
    });

    var Z1 = 0.66, Z2 = 0.67, ZQ = 0.668;
    var P1 = nCDF(Z1, 0, 1), P2 = nCDF(Z2, 0, 1);
    var real = nCDF(ZQ, 0, 1);
    var interp = P1 + (P2 - P1) * (ZQ - Z1) / (Z2 - Z1);
    var round = P2;                                   // 0.668 redondea a la fila 0.67

    var out = F.readouts(host, [
      { k: "real", tex: "\\Phi(0.668)\\ \\text{(real)}", value: F.fmt(real, 6) },
      { k: "int", label: "interpolado entre 0.66 y 0.67", value: F.fmt(interp, 6) },
      { k: "red", label: "redondeado a la fila 0.67", value: F.fmt(round, 6) },
      { k: "ei", label: "error de interpolar", value: F.fmt(Math.abs(interp - real), 7) },
      { k: "er", label: "error de redondear", value: F.fmt(Math.abs(round - real), 7) }
    ]);

    F.legend(host, [
      { label: "Φ(z) exacta", color: F.series(1) },
      { label: "cuerda entre las dos filas de tabla", color: F.series(2), dash: true },
      { label: "valor real en z = 0.668", color: F.series(3) },
      { label: "valor redondeado (fila 0.67)", color: F.series(4) }
    ]);

    var layer = F.el("g", null, svg);
    var cP = F.series(1), cA = F.series(2), cG = F.series(3), cB = F.series(4);

    // ---- panel izquierdo: la sigmoide completa con el recuadro del zoom ----
    (function () {
      // El panel arranca en x=48 y no en 46: el rótulo vertical «Φ(z)» que dibuja
      // F.axes queda ~36 px a la izquierda del eje y con 46 se salía 0.9 px del
      // viewBox. Con 48 entra con algo más de 1 px de margen.
      var sx = F.scale([0, 3], [48, 300]);
      var sy = F.scale([0, 1.06], [PB, 46]);
      F.axes(layer, { sx: sx, sy: sy, xTicks: 4, yTicks: 5, grid: true, y0: 0, xLabel: "z", yLabel: "Φ(z)" });
      // Sin título en este panel: el eje ya dice «Φ(z)», el rango 0–3 muestra
      // que es la curva completa y el recuadro la ata con la ampliación. Una
      // anotación menos, para quedar dentro del presupuesto de la figura.
      F.curve(layer, function (v) { return nCDF(v, 0, 1); }, sx, sy,
        { stroke: cP, n: 300, serie: "Φ(z)" });
      var rx0 = sx(0.60), rx1 = sx(0.73), ry0 = sy(0.775), ry1 = sy(0.715);
      F.el("rect", {
        x: rx0, y: ry0, width: rx1 - rx0, height: ry1 - ry0,
        fill: cA, opacity: 0.16, stroke: cA, "stroke-width": 2
      }, layer);
      // El recuadro no lleva rótulo: el título del panel de la derecha ya dice
      // qué tramo amplía, y el color los ata. Una anotación menos en el lienzo.
    })();

    // ---- panel derecho: la ampliación ----
    (function () {
      var zA = 0.6565, zB = 0.6735;
      var pA = 0.7438, pB = 0.7502;
      var sx = F.scale([zA, zB], [400, 660]);
      var sy = F.scale([pA, pB], [PB, 46]);
      F.axes(layer, { sx: sx, sy: sy, xTicks: 4, yTicks: 5, grid: true, y0: pA, xLabel: "z", yLabel: "Φ(z)" });
      panelTitle(F, layer, (400 + 660) / 2, 28, "ampliación (filas 0.66–0.67)", null);

      // curva real y, encima, la cuerda punteada (así se ve que casi se calcan)
      F.curve(layer, function (v) { return nCDF(v, 0, 1); }, sx, sy,
        { stroke: cP, n: 220, serie: "Φ(z)" });
      // Raya corta y hueco largo: la cuerda va encima y aun así se ve la curva
      // exacta por debajo, que es justo lo que hay que comparar.
      F.line(layer, [[sx(Z1), sy(P1)], [sx(Z2), sy(P2)]],
        { stroke: cA, dash: "4 10", serie: "cuerda" });

      // filas de la tabla
      F.marker(layer, sx(Z1), sy(P1), { r: 4.6, fill: cP, label: "0.7454", labelDy: 17, key: false });
      F.marker(layer, sx(Z2), sy(P2), {
        r: 4.6, fill: cP, label: "0.7486", labelDy: -16, labelAnchor: "start", key: false
      });

      // z buscado
      F.vline(layer, sx(ZQ), { y0: sy(pA), y1: 46, stroke: F.color("text-3"), dash: "3 3" });
      F.text(layer, sx(ZQ) + 4, 58, "z = 0.668", { size: 10.5, fill: F.color("text-3"), mono: true });

      // los dos valores que compiten con el real
      F.hline(layer, sy(round), { x0: 400, x1: 660, stroke: cB, dash: "5 4" });
      F.label(layer, 404, sy(round) - 6, "redondeado " + F.fmt(round, 6), {
        size: 10.5, fill: F.color("text-2"), keyColor: cB, mono: true
      });
      F.marker(layer, sx(ZQ), sy(round), { r: 4.6, fill: cB, serie: "redondeado" });

      F.hline(layer, sy(real), { x0: 400, x1: 660, stroke: cG, dash: false });
      F.label(layer, 404, sy(real) - 6, "real e interpolado " + F.fmt(real, 6), {
        size: 10.5, fill: F.color("text-2"), keyColor: cG, mono: true
      });
      F.marker(layer, sx(ZQ), sy(real), { r: 4.6, fill: cG, serie: "real" });
    })();
  }, {
    title: "Interpolar vs. redondear en la tabla Z",
    page: "estandarizacion-y-tabla-normal", kind: "static", unidad: "4"
  });

})();
