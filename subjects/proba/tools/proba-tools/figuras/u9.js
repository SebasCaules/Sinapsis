/* ============================================================
   figuras/u9.js — figuras de la Unidad 9 (pruebas de hipótesis).

   Se carga DESPUÉS de figures.js (necesita App.registerFigure) y de
   lib-math.js (window.M). Cada figura se registra con su identificador
   definitivo; las páginas del wiki las invocan con el callout

       > [!figura] <id>
       > <epígrafe>

   FIGURAS REGISTRADAS
     u9-las-dos-campanas-y-sobre-el-mismo-eje   conceptos/error-tipo-i-y-tipo-ii
     u9-curva-oc-la-forma-de-segun-la-cola      conceptos/error-tipo-i-y-tipo-ii
     u9-valor-p-contra-en-la-misma-cola         conceptos/valor-p
     u9-las-tres-rectas-de-rechazo              conceptos/estadistico-de-prueba
     u9-dos-ejes-una-misma-decision             conceptos/estadistico-de-prueba
     u9-el-precio-de-detectar-diferencias-chicas
                                                tecnicas/diseno-de-prueba-tamano-muestral
     u9-por-que-x-c-con-s-esta-mal              conceptos/prueba-de-hipotesis-para-la-media
     u9-colas-pesadas-y-el-precio-del-fractil   conceptos/prueba-de-hipotesis-para-la-media
     u9-arbol-de-eleccion-del-estadistico       tecnicas/reconocer-prueba-de-hipotesis

   NÚMEROS
     Todos los fractiles, colas y valores p salen de window.M (normInv,
     normCDF, normPDF, tInv, tCDF, tPDF): no hay ninguna constante escrita a
     mano en las lecturas. Las áreas sombreadas se dibujan sobre la MISMA
     función de densidad con la que se calcula el número que se muestra, así
     que el dibujo y la lectura no pueden separarse.

   ESTILO (ola 14)
     · La IDENTIDAD de cada serie sale de las ranuras Fig.series(1..6), en el
       orden en que aparecen en la leyenda. Los tokens de estado
       (Fig.status("bad"/"good"/"warn")) quedan reservados para el SIGNIFICADO
       —región de rechazo, decisión— y siempre llevan rótulo al lado.
     · El trazo de dato va a 2 px (valor por omisión del motor). Las líneas de
       construcción, guías, ejes sueltos y aristas del árbol llevan la clase
       .fig-ref y grosor 1.2–1.4: son canal secundario.
     · Ningún rótulo se pinta con el color de la serie: el texto va en
       --text-2 / --text-3 y la identidad la aporta un punto de color al lado
       (Fig.label con {keyColor}) o la propia marca sobre la que se apoya.
     · Las regiones sombreadas son un lavado plano al 12 %; el rayado se usa
       solo donde DOS áreas se superponen (figura del valor p).
     · La prosa explicativa vive en el epígrafe del callout [!figura] del
       wiki, no dentro del lienzo.

   PLANTEO DE REFERENCIA
     Media:      mu0 = 20, sigma = 2   (el ejemplo de los tableros de secado
                 de las slides de la cátedra).
     Proporción: q0 = 0.08             (el ejemplo de la curva OC para la
                 proporción de las slides).
   ============================================================ */
(function () {
  "use strict";

  var A = window.App;
  if (!A || typeof A.registerFigure !== "function") return;
  var M = window.M || {};

  // ---------------- atajos numéricos ----------------

  function zq(p) { return M.normInv(p, 0, 1); }
  function Phi(x) { return M.normCDF(x, 0, 1); }
  function phi(x) { return M.normPDF(x, 0, 1); }
  function tq(p, df) { return M.tInv(p, df); }
  function tcdf(x, df) { return M.tCDF(x, df); }
  function tpdf(x, df) { return M.tPDF(x, df); }

  function clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }

  // Constantes del planteo de referencia.
  var MU0 = 20, SIGMA = 2, Q0 = 0.08;

  // ---------------- helpers de dibujo compartidos ----------------

  // Banda rectangular entre dos valores del eje x. Se apoya en Fig.area con
  // densidad constante 1. Por omisión es un LAVADO PLANO al 12 %: el rayado es
  // canal secundario y solo se pide donde dos áreas se superponen. No se
  // registra como serie porque es contexto, no dato.
  function band(F, layer, sx, sy, from, to, o) {
    o = o || {};
    if (!(to > from)) return null;
    return F.area(layer, function () { return 1; }, sx, sy, {
      from: from, to: to, n: 6,
      fill: o.fill || F.status("bad"),
      opacity: o.opacity == null ? 0.12 : o.opacity,
      hatch: o.hatch || null,
      base: 0, serie: false
    });
  }

  // Recta numérica suelta con marcas y rótulos (para las figuras que no usan
  // un par de escalas completo y por eso no pueden apoyarse en Fig.axes). Es
  // andamiaje: todo va con la clase .fig-ref y sin registrar serie, y los
  // rótulos van en tokens de texto —la identidad la lleva la marca de color.
  function numberLine(F, layer, sx, y, o) {
    o = o || {};
    var r = sx.range();
    var cAxis = F.color("plot-axis"), cTxt = F.color("text-3");
    var guia = { cls: "fig-ref", serie: false };
    F.line(layer, [[r[0] - 6, y], [r[1] + 10, y]],
      { stroke: cAxis, width: 1.2, cls: guia.cls, serie: false });
    // punta de flecha al final del eje
    F.line(layer, [[r[1] + 2, y - 4], [r[1] + 10, y], [r[1] + 2, y + 4]],
      { stroke: cAxis, width: 1.2, cls: guia.cls, serie: false });
    (o.marks || []).forEach(function (m) {
      var px = sx(m.v);
      F.line(layer, [[px, y - 5], [px, y + 5]],
        { stroke: m.color || cAxis, width: 1.4, cls: guia.cls, serie: false });
      if (m.label != null) {
        F.text(layer, px, y + (m.below == null ? 20 : m.below), m.label, {
          size: m.size || 11.5, anchor: "middle", fill: cTxt, mono: m.mono !== false
        });
      }
      if (m.top != null) {
        F.text(layer, px, y - 12, m.top, {
          size: 11.5, anchor: "middle", fill: cTxt, mono: false
        });
      }
    });
    if (o.label) {
      F.text(layer, r[0] - 10, y, o.label, {
        size: 12, anchor: "end", baseline: "middle", fill: F.color("text-2")
      });
    }
  }

  // Flecha vertical entre dos alturas, con punta abajo (línea de construcción).
  function arrowDown(F, layer, x, y0, y1, col) {
    F.line(layer, [[x, y0], [x, y1 - 6]],
      { stroke: col, width: 1.2, dash: "3 3", cls: "fig-ref", serie: false });
    F.line(layer, [[x - 4, y1 - 7], [x, y1], [x + 4, y1 - 7]],
      { stroke: col, width: 1.4, cls: "fig-ref", serie: false });
  }

  // Caja de texto con varias líneas centradas (árbol de decisión).
  function boxNode(F, layer, x, y, w, h, lines, o) {
    o = o || {};
    F.el("rect", {
      x: x - w / 2, y: y, width: w, height: h, rx: 7,
      fill: o.fill || F.color("surface-2"),
      stroke: o.stroke || F.color("border"),
      "stroke-width": o.strokeWidth == null ? 1.2 : o.strokeWidth
    }, layer);
    var n = lines.length;
    var lh = o.lh || 14;
    var y0 = y + h / 2 - ((n - 1) * lh) / 2;
    lines.forEach(function (t, i) {
      F.text(layer, x, y0 + i * lh, t, {
        size: o.size || 11.5, anchor: "middle", baseline: "middle",
        fill: o.color || F.color("text"), mono: !!o.mono,
        weight: i === 0 && o.boldFirst ? "600" : null
      });
    });
  }

  // Arista del árbol con rótulo sobre la condición (canal secundario).
  function edge(F, layer, x0, y0, x1, y1, label, o) {
    o = o || {};
    var col = o.stroke || F.color("plot-axis");
    var my = (y0 + y1) / 2;
    F.line(layer, [[x0, y0], [x0, my], [x1, my], [x1, y1 - 6]],
      { stroke: col, width: 1.2, cls: "fig-ref", serie: false });
    F.line(layer, [[x1 - 4, y1 - 7], [x1, y1], [x1 + 4, y1 - 7]],
      { stroke: col, width: 1.3, cls: "fig-ref", serie: false });
    if (label) {
      F.text(layer, (x0 + x1) / 2, my - 6, label, {
        size: 11, anchor: "middle", fill: F.color("text-3")
      });
    }
  }

  // ============================================================
  // 1 · Las dos campanas: α y β sobre el mismo eje
  // ============================================================
  A.registerFigure("u9-las-dos-campanas-y-sobre-el-mismo-eje", function (host, api) {
    var F = api.Fig;
    var W = 680, H = 360;
    var pad = { l: 56, r: 22, t: 34, b: 54 };
    var svg = F.svg(host, {
      w: W, h: H,
      title: "Densidad del promedio muestral bajo H0 y bajo H1, con las áreas α y β"
    });

    var ctl = F.controls(host, [
      { k: "mu1", label: "μ₁ (media real)", min: 17.5, max: 23, step: 0.05, value: 21.2, dec: 2 },
      { k: "alfa", label: "α (nivel)", min: 0.005, max: 0.25, step: 0.005, value: 0.05, dec: 3 },
      { k: "n", label: "n (tamaño de muestra)", min: 4, max: 120, step: 1, value: 16, dec: 0 }
    ], function () { redraw(); });

    var selCola = F.select(host, {
      k: "cola", label: "cola",
      options: [
        { v: "der", label: "cola derecha" },
        { v: "izq", label: "cola izquierda" },
        { v: "dos", label: "dos colas" }
      ],
      value: "der"
    }, function () { redraw(); });

    var out = F.readouts(host, [
      { k: "xc", tex: "\\bar x_c" },
      { k: "alfa", tex: "\\alpha" },
      { k: "beta", tex: "\\beta(\\mu_1)" },
      { k: "pot", tex: "1-\\beta" }
    ]);

    // Ranura 1 = H₀, ranura 2 = H₁, en el mismo orden en que se leen.
    var S1 = F.series(1), S2 = F.series(2);

    F.legend(host, [
      { label: "bajo H₀: X̄ ~ N(μ₀, σ/√n)", color: S1 },
      { label: "bajo H₁: X̄ ~ N(μ₁, σ/√n)", color: S2 },
      { label: "α — error tipo I (cola de H₀)", color: S1, fill: true, alpha: 0.12 },
      { label: "β — error tipo II (masa de H₁)", color: S2, fill: true, alpha: 0.12 },
      { label: "valor crítico x̄c", color: F.color("text-3"), dash: true }
    ]);

    var layer = F.el("g", null, svg);

    function redraw() {
      while (layer.firstChild) layer.removeChild(layer.firstChild);

      var mu1 = ctl.get("mu1"), a = ctl.get("alfa"), n = Math.round(ctl.get("n"));
      var cola = selCola.get();
      var se = SIGMA / Math.sqrt(n);

      // valores críticos y errores — todo con la normal exacta
      var c1 = -Infinity, c2 = Infinity, beta, alfaReal;
      if (cola === "der") {
        c2 = MU0 + zq(1 - a) * se;
        alfaReal = 1 - Phi((c2 - MU0) / se);
        beta = Phi((c2 - mu1) / se);
      } else if (cola === "izq") {
        c1 = MU0 - zq(1 - a) * se;
        alfaReal = Phi((c1 - MU0) / se);
        beta = 1 - Phi((c1 - mu1) / se);
      } else {
        var zc = zq(1 - a / 2);
        c1 = MU0 - zc * se; c2 = MU0 + zc * se;
        alfaReal = Phi((c1 - MU0) / se) + (1 - Phi((c2 - MU0) / se));
        beta = Phi((c2 - mu1) / se) - Phi((c1 - mu1) / se);
      }

      var lo = Math.min(MU0, mu1) - 4.2 * se;
      var hi = Math.max(MU0, mu1) + 4.2 * se;
      if (isFinite(c1)) lo = Math.min(lo, c1 - 0.6 * se);
      if (isFinite(c2)) hi = Math.max(hi, c2 + 0.6 * se);
      var ymax = M.normPDF(MU0, MU0, se) * 1.22;

      var sx = F.scale([lo, hi], [pad.l, W - pad.r]);
      var sy = F.scale([0, ymax], [H - pad.b, pad.t]);

      F.axes(layer, {
        sx: sx, sy: sy, xTicks: 7, yTicks: 4, grid: true, y0: 0,
        xLabel: "x̄  (promedio muestral)", yLabel: "densidad"
      });

      var f0 = function (x) { return M.normPDF(x, MU0, se); };
      var f1 = function (x) { return M.normPDF(x, mu1, se); };

      // Cada error se pinta con el color de SU curva: α es una cola de H₀ y β
      // es la masa de H₁ que cae en la zona de aceptación. La frontera va en
      // color neutro porque no pertenece a ninguna de las dos densidades.
      var cLim = F.color("text-2");
      if (isFinite(c2) && c2 < hi) {
        F.area(layer, f0, sx, sy, {
          from: clamp(c2, lo, hi), to: hi, fill: S1, opacity: 0.12, serie: false
        });
      }
      if (isFinite(c1) && c1 > lo) {
        F.area(layer, f0, sx, sy, {
          from: lo, to: clamp(c1, lo, hi), fill: S1, opacity: 0.12, serie: false
        });
      }
      // β: masa de H1 que cae en la región de aceptación
      var bLo = isFinite(c1) ? clamp(c1, lo, hi) : lo;
      var bHi = isFinite(c2) ? clamp(c2, lo, hi) : hi;
      if (bHi > bLo) {
        F.area(layer, f1, sx, sy, {
          from: bLo, to: bHi, fill: S2, opacity: 0.12, serie: false
        });
      }

      F.curve(layer, f0, sx, sy, { stroke: S1, n: 260, serie: "densidad bajo H₀" });
      F.curve(layer, f1, sx, sy, { stroke: S2, n: 260, serie: "densidad bajo H₁" });

      // medias
      var criticos = [c1, c2].filter(function (c) { return isFinite(c) && c >= lo && c <= hi; });
      [{ v: MU0, txt: "μ₀ = " + F.fmt(MU0, 1), col: S1, f: f0 },
       { v: mu1, txt: "μ₁ = " + F.fmt(mu1, 2), col: S2, f: f1 }].forEach(function (p) {
        if (p.v < lo || p.v > hi) return;
        var fy = p.f(p.v);
        F.vline(layer, sx(p.v), {
          y0: sy(0), y1: sy(fy), stroke: p.col, dash: "5 4"
        });
        // La línea de trazos de un valor crítico llega hasta arriba del todo y
        // atravesaría este rótulo si cayera casi sobre la media: cuando eso
        // pasa, el rótulo se corre al lado opuesto del crítico más cercano.
        var anchor = "middle", dx = 0, mejor = null, i;
        for (i = 0; i < criticos.length; i++) {
          var d = Math.abs(sx(criticos[i]) - sx(p.v));
          if (d < 34 && (mejor === null || d < mejor.d)) mejor = { d: d, c: criticos[i] };
        }
        if (mejor) {
          if (mejor.c >= p.v) { anchor = "end"; dx = -6; }
          else { anchor = "start"; dx = 6; }
        }
        // el texto va en token de texto y la identidad la lleva el punto de
        // color que Fig.label dibuja delante del rótulo
        F.label(layer, sx(p.v) + dx, sy(fy) - 7, p.txt, {
          anchor: anchor, size: 11.5, fill: F.color("text-2"), keyColor: p.col
        });
      });

      // valores críticos
      [c1, c2].forEach(function (c) {
        if (!isFinite(c) || c < lo || c > hi) return;
        // el rótulo va ARRIBA del extremo superior de la línea; si se lo
        // pone por debajo, la propia línea de trazos lo atraviesa.
        F.vline(layer, sx(c), {
          y0: sy(0), y1: pad.t + 18, stroke: cLim, dash: "3 3"
        });
        F.marker(layer, sx(c), sy(0), { r: 4.6, fill: cLim, serie: false });
        // sin mono: en la tipografía monoespaciada el macron combinante de
        // x̄ se corre a la letra siguiente y se lee "xc̄"
        F.text(layer, sx(c), pad.t + 9, "x̄c = " + F.fmt(c, 3), {
          anchor: "middle", size: 11, fill: cLim
        });
      });

      // rótulos de las dos zonas
      var accCenter = sx((Math.max(bLo, lo) + Math.min(bHi, hi)) / 2);
      F.text(layer, accCenter, pad.t - 12, "no se rechaza H₀", {
        anchor: "middle", size: 11.5, fill: F.color("text-3")
      });
      if (cola !== "izq" && isFinite(c2) && c2 < hi) {
        F.label(layer, (sx(clamp(c2, lo, hi)) + sx(hi)) / 2, pad.t - 12, "se rechaza H₀", {
          anchor: "middle", size: 11.5, fill: F.color("text-2"), keyColor: F.status("bad")
        });
      }
      if (cola !== "der" && isFinite(c1) && c1 > lo) {
        F.label(layer, (sx(lo) + sx(clamp(c1, lo, hi))) / 2, pad.t - 12, "se rechaza H₀", {
          anchor: "middle", size: 11.5, fill: F.color("text-2"), keyColor: F.status("bad")
        });
      }

      var xcTxt = cola === "dos"
        ? F.fmt(c1, 3) + " · " + F.fmt(c2, 3)
        : F.fmt(cola === "der" ? c2 : c1, 4);
      out.set("xc", xcTxt);
      out.set("alfa", F.fmt(alfaReal, 4));
      out.set("beta", F.fmt(beta, 4));
      out.set("pot", F.fmt(1 - beta, 4));
    }

    redraw();
  }, {
    title: "Las dos campanas: α y β sobre el mismo eje",
    page: "error-tipo-i-y-tipo-ii", kind: "interactive", unidad: "9"
  });

  // ============================================================
  // 2 · Curva OC: la forma de β según la cola
  // ============================================================
  A.registerFigure("u9-curva-oc-la-forma-de-segun-la-cola", function (host, api) {
    var F = api.Fig;
    var W = 680, H = 350;
    var pad = { l: 56, r: 22, t: 26, b: 54 };
    var svg = F.svg(host, {
      w: W, h: H,
      title: "Curva característica de operación: β en función del valor real del parámetro"
    });

    var ctl = F.controls(host, [
      { k: "alfa", label: "α (nivel)", min: 0.005, max: 0.25, step: 0.005, value: 0.05, dec: 3 },
      { k: "n", label: "n (tamaño de muestra)", min: 5, max: 200, step: 1, value: 25, dec: 0 },
      { k: "t", label: "punto marcado (posición)", min: 0, max: 1, step: 0.01, value: 0.78, dec: 2 }
    ], function () { redraw(); });

    var selCola = F.select(host, {
      k: "cola", label: "cola",
      options: [
        { v: "der", label: "cola derecha" },
        { v: "izq", label: "cola izquierda" },
        { v: "dos", label: "dos colas" }
      ],
      value: "der"
    }, function () { redraw(); });

    var selPar = F.select(host, {
      k: "par", label: "parámetro",
      options: [
        { v: "media", label: "media μ" },
        { v: "prop", label: "proporción q" }
      ],
      value: "media"
    }, function () { redraw(); });

    var tgPot = F.toggle(host, { k: "pot", label: "curva de potencia (1 − β)", value: false },
      function () { redraw(); });
    var tgCmp = F.toggle(host, { k: "cmp", label: "comparar con n/2 y 2n", value: false },
      function () { redraw(); });

    var out = F.readouts(host, [
      { k: "crit", label: "valor crítico" },
      { k: "theta", tex: "\\theta_1" },
      { k: "beta", tex: "\\beta(\\theta_1)" },
      { k: "pot", tex: "1-\\beta(\\theta_1)" }
    ]);

    var S1 = F.series(1), S2 = F.series(2), S3 = F.series(3);

    F.legend(host, [
      { label: "β con el n elegido", color: S1 },
      { label: "puntos guía: β(θ₀) = 1 − α y β(crítico) ≈ 0.5", color: S2 },
      { label: "punto marcado con el deslizador", color: S3 },
      { label: "β con n/2 y con 2n", color: F.color("text-3"), dash: true }
    ]);

    var layer = F.el("g", null, svg);

    // β(θ1) para un n dado. Devuelve {f, crit:[c1,c2]}.
    function betaFor(par, cola, a, n) {
      if (par === "media") {
        var se = SIGMA / Math.sqrt(n);
        if (cola === "der") {
          var cd = MU0 + zq(1 - a) * se;
          return { crit: [cd], f: function (m) { return Phi((cd - m) / se); } };
        }
        if (cola === "izq") {
          var ci = MU0 - zq(1 - a) * se;
          return { crit: [ci], f: function (m) { return 1 - Phi((ci - m) / se); } };
        }
        var zc = zq(1 - a / 2), l = MU0 - zc * se, r = MU0 + zc * se;
        return { crit: [l, r], f: function (m) { return Phi((r - m) / se) - Phi((l - m) / se); } };
      }
      var se0 = Math.sqrt(Q0 * (1 - Q0) / n);
      var sq = function (q) { return Math.sqrt(Math.max(q * (1 - q), 1e-12) / n); };
      if (cola === "der") {
        var qd = Q0 + zq(1 - a) * se0;
        return { crit: [qd], f: function (q) { return Phi((qd - q) / sq(q)); } };
      }
      if (cola === "izq") {
        var qi = Q0 - zq(1 - a) * se0;
        return { crit: [qi], f: function (q) { return 1 - Phi((qi - q) / sq(q)); } };
      }
      var zc2 = zq(1 - a / 2), ql = Q0 - zc2 * se0, qr = Q0 + zc2 * se0;
      return { crit: [ql, qr], f: function (q) { return Phi((qr - q) / sq(q)) - Phi((ql - q) / sq(q)); } };
    }

    function redraw() {
      while (layer.firstChild) layer.removeChild(layer.firstChild);

      var a = ctl.get("alfa"), n = Math.round(ctl.get("n")), tPos = ctl.get("t");
      var cola = selCola.get(), par = selPar.get();
      var mostrarPot = tgPot.get(), comparar = tgCmp.get();

      var base = betaFor(par, cola, a, n);
      var lo, hi;
      if (par === "media") {
        var se = SIGMA / Math.sqrt(n);
        lo = MU0 - 5 * se; hi = MU0 + 5 * se;
      } else {
        var se0 = Math.sqrt(Q0 * (1 - Q0) / n);
        lo = Math.max(0.004, Q0 - 5 * se0);
        hi = Math.min(0.9, Q0 + 5 * se0);
      }

      var sx = F.scale([lo, hi], [pad.l, W - pad.r]);
      var sy = F.scale([0, 1], [H - pad.b, pad.t]);

      F.axes(layer, {
        sx: sx, sy: sy, xTicks: 7, yTicks: 5, grid: true, y0: 0,
        xLabel: par === "media" ? "μ₁  (media real)" : "q₁  (proporción real)",
        yLabel: mostrarPot ? "1 − β(θ₁)" : "β(θ₁)"
      });

      function plot(res, col, dash, nombre) {
        F.curve(layer, function (x) {
          var b = res.f(x);
          return mostrarPot ? 1 - b : b;
        }, sx, sy, { stroke: col, dash: dash, n: 240, serie: nombre });
      }

      if (comparar) {
        var cMut = F.mix(F.color("text-3"), F.color("surface"), 0.35);
        [Math.max(2, Math.round(n / 2)), Math.round(n * 2)].forEach(function (nn, i) {
          plot(betaFor(par, cola, a, nn), cMut, i === 0 ? "6 4" : "2 3", "n = " + nn);
        });
      }
      plot(base, S1, null, "n = " + n);

      // θ0 y su punto guía β(θ0) = 1 − α
      var th0 = par === "media" ? MU0 : Q0;
      F.vline(layer, sx(th0), {
        y0: sy(0), y1: pad.t, stroke: F.color("text-3"), dash: "4 4", width: 1.2
      });
      // el rótulo va a media altura de la vertical y corrido a la derecha: el
      // extremo superior lo ocupa el punto guía β(θ₀) = 1 − α
      F.text(layer, sx(th0) + 6, (pad.t + sy(0)) / 2, par === "media" ? "μ₀" : "q₀", {
        anchor: "start", size: 11.5, fill: F.color("text-3")
      });
      var b0 = base.f(th0);
      F.marker(layer, sx(th0), sy(mostrarPot ? 1 - b0 : b0), {
        r: 4.6, fill: S2,
        label: (mostrarPot ? "1−β = " : "β = ") + F.fmt(mostrarPot ? 1 - b0 : b0, 3),
        labelDy: -12, key: false, serie: false
      });

      // punto guía en el valor crítico: β ≈ 0.5
      base.crit.forEach(function (c) {
        if (c < lo || c > hi) return;
        var bc = base.f(c);
        F.marker(layer, sx(c), sy(mostrarPot ? 1 - bc : bc), {
          r: 4.6, fill: S2, serie: false
        });
        F.line(layer, [[sx(c), sy(0)], [sx(c), sy(mostrarPot ? 1 - bc : bc)]], {
          stroke: S2, width: 1.2, dash: "2 3", cls: "fig-ref", serie: false
        });
      });

      // punto marcado por el usuario
      var th = lo + tPos * (hi - lo);
      var bt = base.f(th);
      var yv = mostrarPot ? 1 - bt : bt;
      F.line(layer, [[sx(th), sy(0)], [sx(th), sy(yv)]], {
        stroke: S3, width: 1.3, dash: "4 3", cls: "fig-ref", serie: false
      });
      F.marker(layer, sx(th), sy(yv), {
        r: 5, fill: S3, label: F.fmt(yv, 3), labelDy: -13, key: false,
        serie: mostrarPot ? "1 − β en el punto marcado" : "β en el punto marcado",
        vx: th, vy: yv
      });

      out.set("crit", base.crit.map(function (c) { return F.fmt(c, 4); }).join(" · "));
      out.set("theta", F.fmt(th, par === "media" ? 3 : 4));
      out.set("beta", F.fmt(bt, 4));
      out.set("pot", F.fmt(1 - bt, 4));
    }

    redraw();
  }, {
    title: "Curva OC: la forma de β según la cola",
    page: "error-tipo-i-y-tipo-ii", kind: "interactive", unidad: "9"
  });

  // ============================================================
  // 3 · Valor p contra α en la misma cola
  // ============================================================
  A.registerFigure("u9-valor-p-contra-en-la-misma-cola", function (host, api) {
    var F = api.Fig;
    var W = 680, H = 350;
    var pad = { l: 56, r: 22, t: 40, b: 54 };
    var svg = F.svg(host, {
      w: W, h: H,
      title: "Densidad bajo H0 con el área α desde el valor crítico y el valor p desde el estadístico observado"
    });

    var ctl;
    var layer = F.el("g", null, svg);
    // Zona sensible al arrastre: se crea DESPUÉS de la capa de dibujo para
    // quedar por encima, y sobrevive a los redibujos (que solo vacían layer).
    var hit = F.el("rect", {
      x: pad.l, y: pad.t, width: W - pad.r - pad.l, height: H - pad.b - pad.t,
      fill: "transparent"
    }, svg);

    ctl = F.controls(host, [
      { k: "zobs", label: "estadístico observado", min: -4.4, max: 4.4, step: 0.01, value: 2.1, dec: 2 },
      { k: "alfa", label: "α (nivel)", min: 0.005, max: 0.25, step: 0.005, value: 0.05, dec: 3 },
      { k: "gl", label: "grados de libertad (t)", min: 2, max: 120, step: 1, value: 12, dec: 0 }
    ], function () { redraw(); });

    var selCola = F.select(host, {
      k: "cola", label: "cola",
      options: [
        { v: "der", label: "cola derecha" },
        { v: "izq", label: "cola izquierda" },
        { v: "dos", label: "dos colas" }
      ],
      value: "der"
    }, function () { redraw(); });

    var selDist = F.select(host, {
      k: "dist", label: "referencia",
      options: [
        { v: "z", label: "N(0,1)" },
        { v: "t", label: "t de Student" }
      ],
      value: "z"
    }, function () { sincronizarGl(); redraw(); });

    // Los grados de libertad solo tienen sentido con la t: con la N(0,1) el
    // deslizador no cambia nada, así que se deshabilita y se atenúa su fila
    // (mismo tratamiento que el control k de u2-dados-condicional-grilla).
    var inpGl = (function () {
      var ins = ctl.el ? ctl.el.querySelectorAll('input[type="range"]') : [];
      return ins[2] || null;
    })();
    function sincronizarGl() {
      if (!inpGl) return;
      var vale = selDist.get() === "t";
      inpGl.disabled = !vale;
      if (inpGl.parentNode && inpGl.parentNode.style) {
        inpGl.parentNode.style.opacity = vale ? "" : "0.55";
      }
    }

    var out = F.readouts(host, [
      { k: "p", label: "valor p" },
      { k: "alfa", tex: "\\alpha" },
      { k: "zc", label: "valor crítico" },
      { k: "dec", label: "decisión" }
    ]);

    // La densidad es la serie 1; α es una REGIÓN de significado (rechazo) y por
    // eso lleva el token de estado, siempre con su rótulo. El valor p toma la
    // ranura 3 y no la 2: la 2 (#9c3a5f) queda a ΔE 7 de --bad (#a3322b) con
    // visión normal —medido con validate_palette.js— y las dos áreas se
    // superponen, así que tienen que separarse por color sí o sí.
    var S1 = F.series(1), S3 = F.series(3);

    F.legend(host, [
      { label: "densidad bajo H₀", color: S1 },
      { label: "α — desde el valor crítico (rechazo)", color: F.status("bad"), fill: true, alpha: 0.12 },
      { label: "valor p — desde el observado", color: S3, fill: true, alpha: 0.16 }
    ]);

    var DOM = 4.6;
    var sxRef = F.scale([-DOM, DOM], [pad.l, W - pad.r]);

    var stop = F.drag(hit, {
      onDrag: function (px) {
        var v = clamp(sxRef.invert(px), -4.4, 4.4);
        ctl.set("zobs", Math.round(v * 100) / 100);
        redraw();
      }
    });
    api.cleanup(stop);

    function redraw() {
      while (layer.firstChild) layer.removeChild(layer.firstChild);

      var zobs = ctl.get("zobs"), a = ctl.get("alfa"), gl = Math.round(ctl.get("gl"));
      var cola = selCola.get(), dist = selDist.get();
      var esT = dist === "t";

      var f = esT ? function (x) { return tpdf(x, gl); } : phi;
      var Fc = esT ? function (x) { return tcdf(x, gl); } : Phi;
      var Q = esT ? function (p) { return tq(p, gl); } : zq;

      var c1 = -Infinity, c2 = Infinity, p, rechaza;
      if (cola === "der") {
        c2 = Q(1 - a);
        p = 1 - Fc(zobs);
        rechaza = zobs > c2;
      } else if (cola === "izq") {
        c1 = -Q(1 - a);
        p = Fc(zobs);
        rechaza = zobs < c1;
      } else {
        var zc = Q(1 - a / 2);
        c1 = -zc; c2 = zc;
        p = 2 * (1 - Fc(Math.abs(zobs)));
        rechaza = Math.abs(zobs) > zc;
      }

      var sx = sxRef;
      var sy = F.scale([0, f(0) * 1.2], [H - pad.b, pad.t]);

      F.axes(layer, {
        sx: sx, sy: sy, xTicks: 9, yTicks: 4, grid: true, y0: 0,
        xLabel: esT ? "t  (estadístico bajo H₀ ~ t con " + gl + " g.l.)" : "z  (estadístico bajo H₀ ~ N(0,1))",
        yLabel: "densidad"
      });

      var cBad = F.status("bad");

      // El área de α es la REFERENCIA fija: va rayada, porque el área del
      // valor p se le monta encima y las dos tienen que poder leerse a la vez.
      // El rayado es el único de la unidad y cubre solo una cola.
      var aHatch = { angle: 45, size: 7, width: 2 };
      if (isFinite(c2) && c2 < DOM) {
        F.area(layer, f, sx, sy, {
          from: c2, to: DOM, fill: cBad, opacity: 0.12, hatch: aHatch, hatchOpacity: 0.4
        });
      }
      if (isFinite(c1) && c1 > -DOM) {
        F.area(layer, f, sx, sy, {
          from: -DOM, to: c1, fill: cBad, opacity: 0.12, hatch: aHatch, hatchOpacity: 0.4
        });
      }
      // área del valor p (desde el observado, en la MISMA cola): lavado plano
      var zc0 = clamp(zobs, -DOM, DOM);
      var pOpt = { fill: S3, opacity: 0.16, serie: "valor p" };
      function areaP(de, a2) {
        F.area(layer, f, sx, sy, {
          from: de, to: a2, fill: pOpt.fill, opacity: pOpt.opacity, serie: pOpt.serie
        });
      }
      if (cola === "der") {
        areaP(zc0, DOM);
      } else if (cola === "izq") {
        areaP(-DOM, zc0);
      } else {
        var az = Math.abs(zc0);
        areaP(az, DOM);
        areaP(-DOM, -az);
      }

      F.curve(layer, f, sx, sy, { stroke: S1, n: 280, serie: "densidad bajo H₀" });

      [c1, c2].forEach(function (c) {
        if (!isFinite(c) || c < -DOM || c > DOM) return;
        F.vline(layer, sx(c), { y0: sy(0), y1: pad.t + 6, stroke: cBad, dash: "3 3" });
        F.label(layer, sx(c) + (c >= 0 ? -6 : 6), pad.t + 18, "crítico " + F.fmt(c, 3), {
          anchor: c >= 0 ? "end" : "start", size: 11, fill: F.color("text-2"),
          mono: true, keyColor: cBad
        });
      });

      F.vline(layer, sx(zc0), { y0: sy(0), y1: pad.t + 6, stroke: S3, dash: false });
      F.marker(layer, sx(zc0), sy(0), { r: 6, fill: S3, serie: false });
      F.label(layer, sx(zc0), pad.t - 6, "observado = " + F.fmt(zobs, 2), {
        anchor: "middle", size: 11.5, fill: F.color("text-2"), keyColor: S3
      });

      F.label(layer, W - pad.r, pad.t - 22,
        rechaza ? "p < α → se rechaza H₀" : "p ≥ α → no se rechaza H₀", {
          anchor: "end", size: 12.5, weight: "600",
          fill: F.color("text-2"),
          keyColor: rechaza ? cBad : F.status("good")
        });
      F.text(layer, pad.l, pad.t - 22, "arrastre para mover", {
        anchor: "start", size: 11, fill: F.color("text-3")
      });

      out.set("p", F.fmt(p, 5));
      out.set("alfa", F.fmt(a, 4));
      out.set("zc", cola === "dos" ? F.fmt(c1, 3) + " · " + F.fmt(c2, 3)
        : F.fmt(cola === "der" ? c2 : c1, 4));
      out.set("dec", rechaza ? "se rechaza H₀" : "no se rechaza H₀");
    }

    sincronizarGl();
    redraw();
  }, {
    title: "Valor p contra α en la misma cola",
    page: "valor-p", kind: "interactive", unidad: "9"
  });

  // ============================================================
  // 4 · Las tres rectas de rechazo (estática)
  // ============================================================
  A.registerFigure("u9-las-tres-rectas-de-rechazo", function (host, api) {
    var F = api.Fig;
    var W = 680, H = 320;
    var svg = F.svg(host, {
      w: W, h: H,
      title: "Las tres regiones de rechazo sobre la recta del estadístico estandarizado"
    });
    var layer = F.el("g", null, svg);

    var ALFA = 0.05, GL = 15;
    var z1 = zq(1 - ALFA), z2 = zq(1 - ALFA / 2);
    var t1 = tq(1 - ALFA, GL), t2 = tq(1 - ALFA / 2, GL);
    var DOM = 3.4;
    var sx = F.scale([-DOM, DOM], [96, W - 34]);
    var cBad = F.status("bad"), cTxt = F.color("text-2"), cTxt3 = F.color("text-3");

    var filas = [
      {
        y: 78, titulo: "Cola derecha", h1: "H₁: θ > θ₀",
        zonas: [[z1, DOM]],
        marcas: [{ v: 0, label: "0" }, { v: z1, label: F.fmt(z1, 3), color: cBad, top: "z₁₋α" }],
        t: "con T:  t₁₅,₀.₉₅ = " + F.fmt(t1, 3)
      },
      {
        y: 168, titulo: "Cola izquierda", h1: "H₁: θ < θ₀",
        zonas: [[-DOM, -z1]],
        marcas: [{ v: 0, label: "0" }, { v: -z1, label: F.fmt(-z1, 3), color: cBad, top: "−z₁₋α" }],
        t: "con T:  −t₁₅,₀.₉₅ = " + F.fmt(-t1, 3)
      },
      {
        y: 258, titulo: "Dos colas", h1: "H₁: θ ≠ θ₀",
        zonas: [[-DOM, -z2], [z2, DOM]],
        marcas: [
          { v: 0, label: "0" },
          { v: -z2, label: F.fmt(-z2, 3), color: cBad, top: "−z₁₋α/₂" },
          { v: z2, label: F.fmt(z2, 3), color: cBad, top: "z₁₋α/₂" }
        ],
        t: "con T:  ±t₁₅,₀.₉₇₅ = ±" + F.fmt(t2, 3)
      }
    ];

    F.text(layer, 96, 30, "Z ~ N(0,1) bajo H₀  ·  α = 0.05", {
      size: 12.5, anchor: "start", fill: cTxt, weight: "600"
    });

    filas.forEach(function (fila) {
      var sy = F.scale([0, 1], [fila.y, fila.y - 24]);
      fila.zonas.forEach(function (zn) {
        band(F, layer, sx, sy, zn[0], zn[1], { fill: cBad });
      });
      numberLine(F, layer, sx, fila.y, { marks: fila.marcas });

      F.text(layer, 88, fila.y - 8, fila.titulo, {
        size: 12, anchor: "end", fill: cTxt, weight: "600"
      });
      F.text(layer, 88, fila.y + 8, fila.h1, {
        size: 11.5, anchor: "end", fill: cTxt3
      });
      // rótulo dentro de la zona sombreada más ancha
      var ancha = fila.zonas[fila.zonas.length - 1];
      F.label(layer, (sx(ancha[0]) + sx(ancha[1])) / 2, fila.y - 32,
        "zona de rechazo", {
          size: 11, anchor: "middle", fill: cTxt, keyColor: cBad
        });
      F.text(layer, W - 34, fila.y + 34, fila.t, {
        size: 11, anchor: "end", fill: cTxt3, mono: true
      });
    });
  }, {
    title: "Las tres rectas de rechazo",
    page: "estadistico-de-prueba", kind: "static", unidad: "9", hover: false
  });

  // ============================================================
  // 5 · Dos ejes, una misma decisión (estática)
  // ============================================================
  A.registerFigure("u9-dos-ejes-una-misma-decision", function (host, api) {
    var F = api.Fig;
    var W = 680, H = 320;
    var svg = F.svg(host, {
      w: W, h: H,
      title: "El eje del promedio muestral y el eje del estadístico Z inducen la misma decisión"
    });
    var layer = F.el("g", null, svg);

    var ALFA = 0.05, N = 25;
    var se = SIGMA / Math.sqrt(N);
    var zc = zq(1 - ALFA);
    var xc = MU0 + zc * se;
    var DOM = 3.2;

    // Las dos escalas comparten el MISMO tramo de píxeles: por eso las flechas
    // de correspondencia salen verticales y la banda es idéntica arriba y abajo.
    var px0 = 96, px1 = W - 40;
    var sxZ = F.scale([-DOM, DOM], [px0, px1]);
    var sxX = F.scale([MU0 - DOM * se, MU0 + DOM * se], [px0, px1]);

    var yTop = 108, yBot = 246;
    var cBad = F.status("bad"), cTxt = F.color("text-2"), cTxt3 = F.color("text-3");
    var S1 = F.series(1);

    F.text(layer, px0, 34,
      "μ₀ = 20 · σ = 2 · n = 25 · α = 0.05", {
        size: 12.5, anchor: "start", fill: cTxt, weight: "600"
      });

    // banda de rechazo en cada eje (mismo tramo de píxeles)
    band(F, layer, sxX, F.scale([0, 1], [yTop, yTop - 24]), xc, MU0 + DOM * se, { fill: cBad });
    band(F, layer, sxZ, F.scale([0, 1], [yBot, yBot - 24]), zc, DOM, { fill: cBad });

    numberLine(F, layer, sxX, yTop, {
      marks: [
        { v: MU0, label: F.fmt(MU0, 1), top: "μ₀", color: S1 },
        { v: xc, label: F.fmt(xc, 4), top: "x̄c", color: cBad }
      ]
    });
    numberLine(F, layer, sxZ, yBot, {
      marks: [
        { v: 0, label: "0", color: S1 },
        { v: zc, label: F.fmt(zc, 4), top: "z₁₋α", color: cBad }
      ]
    });

    // Rótulos de los dos ejes en dos líneas: en una sola («eje del estimador x̄»
    // mide 102.6 px y «eje del estadístico Z» 107.3 px) anclados en end a x=88
    // arrancaban en x negativo y se salían del viewBox por la izquierda.
    [[yTop, "estimador  x̄"], [yBot, "estadístico  Z"]].forEach(function (r) {
      F.text(layer, 88, r[0] - 8, "eje del", {
        size: 12, anchor: "end", baseline: "middle", fill: cTxt
      });
      F.text(layer, 88, r[0] + 8, r[1], {
        size: 12, anchor: "end", baseline: "middle", fill: cTxt
      });
    });

    // flechas de correspondencia
    arrowDown(F, layer, sxX(MU0), yTop + 34, yBot - 28, S1);
    arrowDown(F, layer, sxX(xc), yTop + 34, yBot - 28, cBad);

    F.text(layer, (sxX(MU0) + sxX(xc)) / 2, (yTop + yBot) / 2 + 4,
      "Z = (x̄ − μ₀) / (σ/√n)", {
        size: 12, anchor: "middle", fill: cTxt3
      });
    F.text(layer, (sxX(MU0) + sxX(xc)) / 2, (yTop + yBot) / 2 + 20,
      "lineal y creciente", {
        size: 11, anchor: "middle", fill: cTxt3
      });

    F.text(layer, px0, H - 24, "x̄ > x̄c  ⟺  Z > z₁₋α", {
      size: 12.5, anchor: "start", fill: cTxt, weight: "600"
    });
  }, {
    title: "Dos ejes, una misma decisión",
    page: "estadistico-de-prueba", kind: "static", unidad: "9", hover: false
  });

  // ============================================================
  // 6 · El precio de detectar diferencias chicas
  // ============================================================
  A.registerFigure("u9-el-precio-de-detectar-diferencias-chicas", function (host, api) {
    var F = api.Fig;
    var W = 680, H = 360;
    var pad = { l: 62, r: 22, t: 30, b: 54 };
    var svg = F.svg(host, {
      w: W, h: H,
      title: "Tamaño de muestra necesario en función de la brecha que se quiere detectar"
    });

    var ctl;
    var layer = F.el("g", null, svg);
    var hit = F.el("rect", {
      x: pad.l, y: pad.t, width: W - pad.r - pad.l, height: H - pad.b - pad.t,
      fill: "transparent"
    }, svg);

    ctl = F.controls(host, [
      { k: "alfa", label: "α (nivel)", min: 0.005, max: 0.15, step: 0.005, value: 0.05, dec: 3 },
      { k: "beta", label: "β* objetivo", min: 0.02, max: 0.4, step: 0.01, value: 0.1, dec: 2 },
      { k: "t", label: "punto marcado (posición)", min: 0, max: 1, step: 0.005, value: 0.3, dec: 3 }
    ], function () { redraw(); });

    var selPar = F.select(host, {
      k: "par", label: "parámetro",
      options: [
        { v: "media", label: "media μ" },
        { v: "prop", label: "proporción q" }
      ],
      value: "media"
    }, function () { redraw(); });

    var selCola = F.select(host, {
      k: "cola", label: "cola",
      options: [
        { v: "una", label: "una cola" },
        { v: "dos", label: "dos colas" }
      ],
      value: "una"
    }, function () { redraw(); });

    var out = F.readouts(host, [
      { k: "x", label: "punto marcado" },
      { k: "n", label: "n necesario" },
      { k: "n2", label: "n con la mitad de brecha" },
      { k: "r", label: "cociente" }
    ]);

    var S1 = F.series(1), S2 = F.series(2), S3 = F.series(3);

    F.legend(host, [
      { label: "β* elegido con el deslizador", color: S1 },
      { label: "punto marcado", color: S2 },
      { label: "mitad de brecha", color: S3 },
      { label: "β* = 0.05 · 0.10 · 0.20 (referencia)", color: F.color("text-3"), dash: true }
    ]);

    var REF = [0.05, 0.10, 0.20];

    function makeN(par, cola, a, bstar) {
      var za = zq(1 - (cola === "dos" ? a / 2 : a));
      var zb = zq(1 - bstar);
      if (par === "media") {
        // n = ((z_{1-α} + z_{1-β*}) σ / (μ1 − μ0))², con d = |μ1−μ0|/σ
        return function (d) {
          var k = (za + zb) / d;
          return k * k;
        };
      }
      // proporción: cada fractil lleva su propio desvío
      return function (q1) {
        var dq = q1 - Q0;
        if (Math.abs(dq) < 1e-9) return Infinity;
        var num = za * Math.sqrt(Q0 * (1 - Q0)) + zb * Math.sqrt(q1 * (1 - q1));
        var k = num / dq;
        return k * k;
      };
    }

    function dominio(par) {
      return par === "media" ? [0.15, 1.5] : [0.11, 0.42];
    }

    function redraw() {
      while (layer.firstChild) layer.removeChild(layer.firstChild);

      var a = ctl.get("alfa"), bstar = ctl.get("beta"), tPos = ctl.get("t");
      var par = selPar.get(), cola = selCola.get();
      var d = dominio(par), lo = d[0], hi = d[1];

      var fActiva = makeN(par, cola, a, bstar);
      var fsRef = REF.map(function (b) { return { b: b, f: makeN(par, cola, a, b) }; });

      var ymax = fActiva(lo);
      fsRef.forEach(function (r) { ymax = Math.max(ymax, r.f(lo)); });
      ymax = Math.ceil(ymax * 1.08 / 10) * 10;

      var sx = F.scale([lo, hi], [pad.l, W - pad.r]);
      var sy = F.scale([0, ymax], [H - pad.b, pad.t]);

      F.axes(layer, {
        sx: sx, sy: sy, xTicks: 7, yTicks: 5, grid: true, y0: 0,
        xLabel: par === "media"
          ? "brecha estandarizada  |μ₁ − μ₀| / σ"
          : "q₁  (proporción real, con q₀ = 0.08)",
        yLabel: "n necesario"
      });

      // los dos puntos marcados se calculan ANTES de rotular las curvas de
      // referencia, para poder correr un rótulo que se les superponga
      var x = lo + tPos * (hi - lo);
      var nx = fActiva(x);
      var xMitad = par === "media" ? x / 2 : Q0 + (x - Q0) / 2;
      var nMitad = fActiva(xMitad);

      // Los tres rótulos de referencia se apoyan en el BORDE IZQUIERDO, donde
      // las tres curvas están bien separadas en vertical (más a la derecha se
      // juntan y cualquier rótulo pisa al de al lado). Solo se corren hacia la
      // derecha si el borde estuviera ocupado por un punto marcado.
      var ocupados = [];
      if (nx <= ymax) ocupados.push([sx(x), sy(nx) - 12]);
      if (nMitad <= ymax && xMitad >= lo) ocupados.push([sx(xMitad), sy(nMitad) - 12]);
      function libre(px, py) {
        for (var k = 0; k < ocupados.length; k++) {
          if (Math.abs(ocupados[k][0] - px) < 62 && Math.abs(ocupados[k][1] - py) < 13) return false;
        }
        return true;
      }

      var cMut = F.mix(F.color("text-3"), F.color("surface"), 0.3);
      fsRef.forEach(function (r, i) {
        // curvas de referencia: canal secundario (.fig-ref, discontinuas)
        F.curve(layer, r.f, sx, sy, {
          stroke: cMut, width: 1.4, dash: "5 4", n: 220, cls: "fig-ref", serie: false
        });
        var cand = [0.015, 0.11, 0.19, 0.27];
        var px = null, py = null;
        for (var j = 0; j < cand.length; j++) {
          var xl = lo + (hi - lo) * cand[j], yl = r.f(xl);
          if (yl > ymax) continue;
          var qx = sx(xl) + 11, qy = sy(yl) - 7;
          if (px === null) { px = qx; py = qy; }   // reserva si ninguna queda libre
          if (libre(qx, qy)) { px = qx; py = qy; break; }
        }
        if (px === null) return;
        ocupados.push([px + 26, py]);
        F.text(layer, px, py, "β* = " + F.fmt(r.b, 2), {
          size: 11, anchor: "start", fill: F.color("text-3")
        });
      });

      F.curve(layer, fActiva, sx, sy, { stroke: S1, n: 260, serie: "n necesario" });

      if (nx <= ymax) {
        F.line(layer, [[sx(x), sy(0)], [sx(x), sy(nx)]], {
          stroke: S2, width: 1.3, dash: "4 3", cls: "fig-ref", serie: false
        });
        F.line(layer, [[sx(lo), sy(nx)], [sx(x), sy(nx)]], {
          stroke: S2, width: 1.3, dash: "4 3", cls: "fig-ref", serie: false
        });
        // pegado al borde izquierdo el rótulo del marcador se monta sobre los
        // ticks del eje y: ahí se lo escribe aparte, a la derecha del punto.
        var izqB = sx(x) < pad.l + 40;
        F.marker(layer, sx(x), sy(nx), {
          r: 5, fill: S2, serie: "n en el punto marcado", vx: x, vy: nx,
          label: izqB ? null : "n = " + Math.ceil(nx), labelDy: -13, key: false
        });
        if (izqB) {
          F.label(layer, sx(x) + 11, sy(nx) - 4, "n = " + Math.ceil(nx), {
            size: 11, anchor: "start", fill: F.color("text-2"), mono: true, keyColor: S2
          });
        }
      }
      if (nMitad <= ymax && xMitad >= lo) {
        var izqM = sx(xMitad) < pad.l + 40;
        F.marker(layer, sx(xMitad), sy(nMitad), {
          r: 4.6, fill: S3, serie: "n con la mitad de la brecha", vx: xMitad, vy: nMitad,
          label: izqM ? null : "n = " + Math.ceil(nMitad), labelDy: -13, key: false
        });
        if (izqM) {
          F.label(layer, sx(xMitad) + 10, sy(nMitad) - 4, "n = " + Math.ceil(nMitad), {
            size: 11, anchor: "start", fill: F.color("text-2"), mono: true, keyColor: S3
          });
        }
      }

      F.text(layer, W - pad.r, pad.t - 10, "media brecha  →  n ×4", {
        size: 11.5, anchor: "end", fill: F.color("text-3")
      });
      F.text(layer, pad.l, pad.t - 10, "arrastre para mover", {
        size: 11, anchor: "start", fill: F.color("text-3")
      });

      out.set("x", F.fmt(x, 3));
      out.set("n", isFinite(nx) ? String(Math.ceil(nx)) : "—");
      out.set("n2", isFinite(nMitad) ? String(Math.ceil(nMitad)) : "—");
      out.set("r", isFinite(nMitad / nx) ? F.fmt(nMitad / nx, 2) + " ×" : "—");
    }

    var stop = F.drag(hit, {
      onDrag: function (px) {
        var dd = dominio(selPar.get());
        var sx = F.scale([dd[0], dd[1]], [pad.l, W - pad.r]);
        var v = clamp(sx.invert(px), dd[0], dd[1]);
        ctl.set("t", Math.round(((v - dd[0]) / (dd[1] - dd[0])) * 200) / 200);
        redraw();
      }
    });
    api.cleanup(stop);

    redraw();
  }, {
    title: "El precio de detectar diferencias chicas",
    page: "diseno-de-prueba-tamano-muestral", kind: "interactive", unidad: "9"
  });

  // ============================================================
  // 7 · Por qué x̄c con S está mal (estática)
  // ============================================================
  A.registerFigure("u9-por-que-x-c-con-s-esta-mal", function (host, api) {
    var F = api.Fig;
    var W = 680, H = 320;
    var svg = F.svg(host, {
      w: W, h: H,
      title: "La regla correcta se fija sobre el estadístico T; la frontera del promedio dependería de S, que todavía no existe"
    });
    var layer = F.el("g", null, svg);

    var ALFA = 0.05, N = 10, GL = N - 1;
    var tc = tq(1 - ALFA, GL);
    var DOM = 3.4;
    var px0 = 108, px1 = W - 40;
    var sx = F.scale([-DOM, DOM], [px0, px1]);

    var yOk = 96, yMal = 232;
    var cBad = F.status("bad"), cGood = F.status("good");
    var cTxt = F.color("text-2"), cTxt3 = F.color("text-3");

    F.text(layer, px0, 32, "σ desconocida · n = 10 · α = 0.05", {
      size: 12.5, anchor: "start", fill: cTxt, weight: "600"
    });

    // --- fila correcta: eje de T ---
    band(F, layer, sx, F.scale([0, 1], [yOk, yOk - 22]), tc, DOM, { fill: cBad });
    numberLine(F, layer, sx, yOk, {
      marks: [
        { v: 0, label: "0" },
        { v: tc, label: F.fmt(tc, 4), top: "t₉,₀.₉₅", color: cBad }
      ]
    });
    F.label(layer, px0 - 12, yOk - 8, "correcto", {
      size: 12, anchor: "end", fill: cTxt, weight: "600", keyColor: cGood
    });
    F.text(layer, px0 - 12, yOk + 8, "eje de T", { size: 11.5, anchor: "end", fill: cTxt3 });
    F.text(layer, px1, yOk - 30, "se conoce antes de muestrear", {
      size: 11, anchor: "end", fill: cTxt3
    });

    // --- fila incorrecta: eje de x̄ con frontera indeterminada ---
    F.label(layer, px0 - 12, yMal - 8, "MAL", {
      size: 13, anchor: "end", fill: cTxt, weight: "700", keyColor: cBad
    });
    F.text(layer, px0 - 12, yMal + 8, "eje de x̄", { size: 11.5, anchor: "end", fill: cTxt3 });

    numberLine(F, layer, sx, yMal, {
      marks: [{ v: 0, label: "μ₀ = 20", top: "μ₀", mono: false }]
    });
    // la frontera x̄c = μ0 + t·S/√n es indeterminada: se dibujan varias
    // posiciones fantasma, una por cada S que la muestra podría arrojar.
    [0.7, 1.15, 1.6, 2.15, 2.7].forEach(function (v, i) {
      F.line(layer, [[sx(v), yMal - 22], [sx(v), yMal + 6]], {
        stroke: cBad, width: 1.4, dash: "3 4", opacity: 0.35 + i * 0.06,
        cls: "fig-ref", serie: false
      });
      F.text(layer, sx(v), yMal - 30, "?", {
        size: 13, anchor: "middle", fill: cTxt3, weight: "700"
      });
    });
    // sin punto de clave: las cinco fronteras fantasma de arriba ya llevan el
    // color, y un punto suelto delante de la fórmula se lee como viñeta
    F.text(layer, (sx(0.7) + sx(2.7)) / 2, yMal + 20,
      "x̄c = μ₀ + t₉,₀.₉₅ · S/√n", {
        size: 12.5, anchor: "middle", fill: cTxt
      });
    F.text(layer, (sx(0.7) + sx(2.7)) / 2, yMal + 40,
      "S no existe todavía", {
        size: 11, anchor: "middle", fill: cTxt3
      });
  }, {
    title: "Por qué x̄c con S está mal",
    page: "prueba-de-hipotesis-para-la-media", kind: "static", unidad: "9", hover: false
  });

  // ============================================================
  // 8 · Colas pesadas y el precio del fractil
  // ============================================================
  A.registerFigure("u9-colas-pesadas-y-el-precio-del-fractil", function (host, api) {
    var F = api.Fig;
    var W = 680;
    var HT = 244, HB = 158;
    var ps = F.panels(host, 2, { w: W, heights: [HT, HB], gap: 4 });
    var top = ps[0], bot = ps[1];
    var padT = { l: 56, r: 22, t: 40, b: 44 };
    var padB = { l: 56, r: 22, t: 40, b: 44 };

    var ctl = F.controls(host, [
      { k: "gl", label: "grados de libertad  n − 1", min: 2, max: 200, step: 1, value: 8, log: true, dec: 0 },
      { k: "alfa", label: "α (nivel)", min: 0.005, max: 0.2, step: 0.005, value: 0.05, dec: 3 }
    ], function () { redraw(); });

    var out = F.readouts(host, [
      { k: "t", label: "fractil t" },
      { k: "z", label: "fractil z" },
      { k: "d", label: "diferencia t − z" },
      { k: "cola", label: "P(T > z₁₋α)" }
    ]);

    var S1 = F.series(1), S2 = F.series(2), S3 = F.series(3);

    F.legend(host, [
      { label: "t con n − 1 g.l.", color: S1 },
      { label: "N(0,1)", color: S2, dash: true },
      { label: "evidencia extra que exige la t", color: S3, fill: true, alpha: 0.18 }
    ]);

    var layerT = F.el("g", null, top);
    var layerB = F.el("g", null, bot);

    function redraw() {
      while (layerT.firstChild) layerT.removeChild(layerT.firstChild);
      while (layerB.firstChild) layerB.removeChild(layerB.firstChild);

      var gl = Math.max(2, Math.round(ctl.get("gl")));
      var a = ctl.get("alfa");
      var tc = tq(1 - a, gl), zc = zq(1 - a);

      var ft = function (x) { return tpdf(x, gl); };
      var fz = phi;
      var cTxt = F.color("text-2");

      // --- panel superior: las dos densidades completas ---
      var DOM = 4.6;
      var sxT = F.scale([-DOM, DOM], [padT.l, W - padT.r]);
      var syT = F.scale([0, Math.max(fz(0), ft(0)) * 1.2], [HT - padT.b, padT.t]);
      F.axes(layerT, {
        sx: sxT, sy: syT, xTicks: 9, yTicks: 4, grid: true, y0: 0,
        xLabel: "estadístico estandarizado", yLabel: "densidad"
      });
      F.curve(layerT, fz, sxT, syT, { stroke: S2, dash: "5 4", n: 260, serie: "N(0,1)" });
      F.curve(layerT, ft, sxT, syT, { stroke: S1, n: 260, serie: "t con " + gl + " g.l." });
      F.vline(layerT, sxT(zc), { y0: syT(0), y1: padT.t + 4, stroke: S2, dash: "3 3" });
      F.vline(layerT, sxT(tc), { y0: syT(0), y1: padT.t + 4, stroke: S1, dash: false });
      F.label(layerT, sxT(zc) - 5, padT.t - 6, "z₁₋α", {
        anchor: "end", size: 11.5, fill: cTxt, keyColor: S2
      });
      F.label(layerT, sxT(tc) + 5, padT.t - 22, "t₍ₙ₋₁₎,₁₋α", {
        anchor: "start", size: 11.5, fill: cTxt, keyColor: S1
      });
      F.text(layerT, padT.l, padT.t - 22, "n − 1 = " + gl, {
        anchor: "start", size: 12, fill: cTxt
      });

      // --- panel inferior: acercamiento a la cola ---
      var lo = Math.min(zc, tc) - 0.55;
      var hi = Math.max(zc, tc) + 1.1;
      var sxB = F.scale([lo, hi], [padB.l, W - padB.r]);
      var ymaxB = Math.max(ft(lo), fz(lo)) * 1.25;
      var syB = F.scale([0, ymaxB], [HB - padB.b, padB.t]);
      F.axes(layerB, {
        sx: sxB, sy: syB, xTicks: 6, yTicks: 3, grid: true, y0: 0,
        xLabel: "acercamiento a la cola derecha", yLabel: "densidad"
      });
      if (tc > zc) {
        band(F, layerB, sxB, F.scale([0, 1], [HB - padB.b, padB.t]), zc, tc, {
          fill: S3, opacity: 0.18
        });
      }
      F.curve(layerB, fz, sxB, syB, { stroke: S2, dash: "5 4", n: 200, serie: "N(0,1)" });
      F.curve(layerB, ft, sxB, syB, { stroke: S1, n: 200, serie: "t con " + gl + " g.l." });
      F.vline(layerB, sxB(zc), { y0: syB(0), y1: padB.t, stroke: S2, dash: "3 3" });
      F.vline(layerB, sxB(tc), { y0: syB(0), y1: padB.t, stroke: S1, dash: false });
      F.label(layerB, sxB(zc) - 7, padB.t - 20, "z₁₋α = " + F.fmt(zc, 3), {
        anchor: "end", size: 11, fill: cTxt, mono: true, keyColor: S2
      });
      F.label(layerB, sxB(tc) + 7, padB.t - 20, "t₍ₙ₋₁₎,₁₋α = " + F.fmt(tc, 3), {
        anchor: "start", size: 11, fill: cTxt, mono: true, keyColor: S1
      });
      if (tc > zc) {
        F.label(layerB, (sxB(zc) + sxB(tc)) / 2, padB.t - 6,
          "Δ = " + F.fmt(tc - zc, 3), {
            anchor: "middle", size: 11.5, fill: cTxt, mono: true, keyColor: S3
          });
      }

      out.set("t", F.fmt(tc, 4));
      out.set("z", F.fmt(zc, 4));
      out.set("d", F.fmt(tc - zc, 4));
      out.set("cola", F.fmt(1 - tcdf(zc, gl), 4));
    }

    redraw();
  }, {
    title: "Colas pesadas y el precio del fractil",
    page: "prueba-de-hipotesis-para-la-media", kind: "interactive", unidad: "9"
  });

  // ============================================================
  // 9 · Árbol de elección del estadístico (estática)
  // ============================================================
  A.registerFigure("u9-arbol-de-eleccion-del-estadistico", function (host, api) {
    var F = api.Fig;
    var W = 700, H = 376;
    var svg = F.svg(host, {
      w: W, h: H,
      title: "Árbol de decisión para elegir el estadístico de prueba"
    });
    var layer = F.el("g", null, svg);

    // Ranura 1 = ramas de la media, ranura 2 = rama de la proporción.
    var S1 = F.series(1), S2 = F.series(2);
    var cHoja = F.mix(F.color("surface-2"), S1, 0.14);
    var cHojaT = F.mix(F.color("surface-2"), S2, 0.16);

    // nivel 0
    boxNode(F, layer, 350, 18, 260, 40, [
      "¿Qué resume la muestra?"
    ], { boldFirst: true, size: 12.5 });

    // nivel 1
    boxNode(F, layer, 205, 108, 250, 40, ["Media μ  ·  ¿σ conocida?"], { size: 12 });
    boxNode(F, layer, 575, 108, 220, 56, [
      "Z = (q̂ − q₀) / √(q₀(1−q₀)/n)",
      "~ N(0,1)   ·   n grande (>100)"
    ], { fill: cHojaT, stroke: S2, size: 11 });

    edge(F, layer, 300, 58, 205, 108, "un promedio x̄");
    edge(F, layer, 400, 58, 575, 108, "una proporción q̂");

    // nivel 2
    boxNode(F, layer, 92, 206, 176, 56, [
      "Z = (x̄ − μ₀) / (σ/√n)",
      "~ N(0,1)"
    ], { fill: cHoja, stroke: S1, size: 11 });
    boxNode(F, layer, 300, 206, 170, 40, ["¿n grande?"], { size: 12 });

    edge(F, layer, 150, 148, 92, 206, "sí");
    edge(F, layer, 260, 148, 300, 206, "no");

    // nivel 3
    boxNode(F, layer, 218, 292, 190, 52, [
      "Z = (x̄ − μ₀) / (S/√n)",
      "vale por el TCL"
    ], { fill: cHoja, stroke: S1, size: 11 });
    boxNode(F, layer, 452, 292, 214, 52, [
      "T = (x̄ − μ₀) / (S/√n)",
      "~ t con n − 1 g.l."
    ], { fill: cHoja, stroke: S1, size: 11 });

    edge(F, layer, 262, 246, 218, 292, "sí");
    edge(F, layer, 340, 246, 452, 292, "no, y la muestra es normal");
  }, {
    title: "Árbol de elección del estadístico",
    page: "reconocer-prueba-de-hipotesis", kind: "static", unidad: "9", hover: false
  });

})();
