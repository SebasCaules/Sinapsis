/* ============================================================
   figuras/u7.js — figuras de la Unidad 7 (suma de variables aleatorias,
   desigualdades, LGN y TCL).

   Se carga DESPUÉS de figures.js (necesita App.registerFigure) y de
   lib-math.js (window.M). Cada figura se registra con su identificador
   definitivo; las páginas del wiki las invocan con el callout

       > [!figura] <id>
       > <epígrafe>

   FIGURAS REGISTRADAS
     u7-convolucion-deslizar-reflejar-y-solapar
                                     conceptos/suma-de-variables-aleatorias.md
     u7-la-rebanada-x-y-s-sobre-la-conjunta
                                     conceptos/suma-de-variables-aleatorias.md
     u7-barras-contra-campana-de-donde-sale-el-12
                                     conceptos/aproximacion-normal-de-la-binomial.md
     u7-cuanto-se-despega-la-cota-de-chebyshev
                                     teoremas/desigualdad-de-chebyshev.md
     u7-la-recta-x-por-encima-del-escalon
                                     teoremas/desigualdad-de-chebyshev.md
     u7-linea-de-tiempo-la-dualidad-t-k-n-t
                                     distribuciones/distribucion-erlang.md
     u7-s-n-se-abre-x-n-se-cierra    conceptos/promedio-muestral.md
     u7-el-cuadrado-unidad-cortado-por-x-y-s
                                     conceptos/suma-de-va-independientes.md
     u7-los-desvios-se-suman-en-cuadratura
                                     conceptos/suma-de-va-independientes.md

   EXACTITUD NUMÉRICA
     Todo valor que aparece en un readout se calcula, no se escribe a mano:
     las colas normales con M.normCDF, las binomiales con M.binomPMF /
     M.binomCDF, las Gamma con M.gammp (incompleta regularizada) y las
     integrales de convolución con M.integrate (Simpson) sobre los límites
     EXACTOS del solapamiento — nunca sobre una ventana amplia — para que el
     área numérica y la fórmula cerrada coincidan hasta el último decimal
     mostrado. Las realizaciones simuladas usan Fig.rng(semilla): son
     reproducibles y el botón «Nueva realización» solo cambia la semilla, que
     vive en api.state (host.__figState) para sobrevivir a un remonte por
     cambio de tema o resize.

   COLORES DE SERIE
     Los tokens --primary, --accent, --warn y --u7 se parecen entre sí en al
     menos uno de los tres temas (en claustro primary, warn y u7 son tres
     ámbares; en pergamino y laurel accent y u7 son el mismo oliva). Por eso,
     cuando dos series de una misma figura deben distinguirse a simple vista,
     la segunda usa --u2 (azul) o --u3 (violeta): son los dos únicos tonos que
     no colisionan con ningún otro token de la paleta en ninguno de los tres
     temas. Nunca se escriben colores fijos: todo sale de F.color(token).
   ============================================================ */
(function () {
  "use strict";

  var A = window.App;
  if (!A || typeof A.registerFigure !== "function") return;
  var M = window.M || {};

  // ---------------- utilidades locales ----------------

  var SQRT2PI = Math.sqrt(2 * Math.PI);

  function nPDF(x, mu, sd) {
    if (M.normPDF) return M.normPDF(x, mu, sd);
    var z = (x - mu) / sd;
    return Math.exp(-0.5 * z * z) / (sd * SQRT2PI);
  }
  function nCDF(x, mu, sd) { return M.normCDF(x, mu, sd); }

  // Gamma(forma a, tasa lam): densidad y FDA (esta última vía la incompleta
  // regularizada P(a, lam·x) que ya expone lib-math).
  function gammaPDF(x, a, lam) {
    if (x <= 0) return 0;
    return Math.exp(a * Math.log(lam) + (a - 1) * Math.log(x) - lam * x - M.lgamma(a));
  }
  function gammaCDF(x, a, lam) {
    if (x <= 0) return 0;
    return M.gammp(a, lam * x);
  }

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  // Texto con halo del color del fondo, para los rótulos que caen sobre una
  // curva o una línea punteada (figures.css ya fija paint-order: stroke fill).
  function haloText(F, layer, x, y, str, o) {
    o = o || {};
    var t = F.text(layer, x, y, str, o);
    t.style.paintOrder = "stroke fill";
    t.style.stroke = F.color("surface");
    t.style.strokeWidth = (o.halo == null ? 3 : o.halo) + "px";
    t.style.strokeLinejoin = "round";
    return t;
  }

  // Integral de Simpson sobre un intervalo acotado (delega en lib-math).
  function integ(f, a, b, n) {
    if (!(b > a)) return 0;
    return M.integrate(f, a, b, n || 2000);
  }

  // Devuelve las cajas .fig-ctl que CREÓ la llamada fn(). Fig.controls comparte
  // una única fila .fig-controls por host, así que para poder mostrar y ocultar
  // un grupo de deslizadores hay que quedarse con las cajas nuevas: es la única
  // forma de distinguirlas de las que ya estaban en la misma fila.
  function nuevasCajas(host, fn) {
    var previas = [], i;
    var antes = host.querySelectorAll(".fig-ctl");
    for (i = 0; i < antes.length; i++) previas.push(antes[i]);
    var r = fn();
    var cajas = [];
    var luego = host.querySelectorAll(".fig-ctl");
    for (i = 0; i < luego.length; i++) {
      if (previas.indexOf(luego[i]) < 0) cajas.push(luego[i]);
    }
    return { ctl: r, cajas: cajas };
  }
  function mostrarCajas(cajas, visible) {
    for (var i = 0; i < cajas.length; i++) cajas[i].style.display = visible ? "" : "none";
  }

  // Rótulo de lectura junto a una marca: se escribe del lado donde queda
  // lugar (a la derecha si la marca está en la mitad izquierda del lienzo, a
  // la izquierda si no), para que nunca pise la línea de referencia vertical
  // que baja de la propia marca ni se salga del viewBox.
  function rotuloAlCostado(F, capa, x, y, ancho, str, colorSerie, size) {
    var izq = x < ancho / 2;
    return F.label(capa, x + (izq ? 9 : -9), y, str, {
      size: size || 11.5, anchor: izq ? "start" : "end",
      mono: true, keyColor: colorSerie
    });
  }

  // Máximo de una función muestreada (para fijar la escala vertical).
  function maxDe(f, a, b, n) {
    var m = 0, i, v;
    n = n || 200;
    for (i = 0; i <= n; i++) {
      v = f(a + (b - a) * i / n);
      if (isFinite(v) && v > m) m = v;
    }
    return m;
  }

  // ============================================================
  //  1. Convolución: deslizar, reflejar y solapar
  //     (conceptos/suma-de-variables-aleatorias.md)
  // ============================================================

  // Cada par define: densidades de X e Y, la fórmula cerrada de f_S, los
  // límites EXACTOS del solapamiento (para que la integral numérica no tenga
  // que adivinar dónde el integrando se anula) y las ventanas de dibujo.
  var PARES = {
    exp: {
      label: "Exp(λ₁) + Exp(λ₂)",
      specs: [
        { k: "l1", label: "lambda 1", tex: "\\lambda_1", min: 0.3, max: 3, step: 0.05, value: 1, dec: 2 },
        { k: "l2", label: "lambda 2", tex: "\\lambda_2", min: 0.3, max: 3, step: 0.05, value: 1, dec: 2 }
      ],
      fx: function (p) { return function (x) { return x < 0 ? 0 : p.l1 * Math.exp(-p.l1 * x); }; },
      fy: function (p) { return function (y) { return y < 0 ? 0 : p.l2 * Math.exp(-p.l2 * y); }; },
      fs: function (p) {
        var a = p.l1, b = p.l2;
        if (Math.abs(a - b) < 1e-9) {
          return function (s) { return s <= 0 ? 0 : a * a * s * Math.exp(-a * s); };
        }
        return function (s) {
          return s <= 0 ? 0 : a * b / (b - a) * (Math.exp(-a * s) - Math.exp(-b * s));
        };
      },
      limites: function (p, s) { return s <= 0 ? null : [0, s]; },
      ventanaY: function () { return [-1.2, 8]; },
      ventanaS: function () { return [0, 8]; },
      sRango: [0.05, 7.5],
      sInicial: 2,
      formula: "f_S(s)=\\dfrac{\\lambda_1\\lambda_2}{\\lambda_2-\\lambda_1}\\left(e^{-\\lambda_1 s}-e^{-\\lambda_2 s}\\right)"
    },
    normal: {
      label: "N(0, σ₁) + N(0, σ₂)",
      specs: [
        { k: "s1", label: "sigma 1", tex: "\\sigma_1", min: 0.4, max: 2.5, step: 0.05, value: 1, dec: 2 },
        { k: "s2", label: "sigma 2", tex: "\\sigma_2", min: 0.4, max: 2.5, step: 0.05, value: 1, dec: 2 }
      ],
      fx: function (p) { return function (x) { return nPDF(x, 0, p.s1); }; },
      fy: function (p) { return function (y) { return nPDF(y, 0, p.s2); }; },
      fs: function (p) {
        var sd = Math.sqrt(p.s1 * p.s1 + p.s2 * p.s2);
        return function (s) { return nPDF(s, 0, sd); };
      },
      limites: function (p, s) {
        var r = 9 * Math.max(p.s1, p.s2);
        return [Math.min(-r, s - r), Math.max(r, s + r)];
      },
      acotado: false,
      ventanaY: function () { return [-6, 6]; },
      ventanaS: function () { return [-6, 6]; },
      sRango: [-5, 5],
      sInicial: 1.5,
      formula: "f_S(s)=\\varphi\\!\\left(s;\\,0,\\ \\sqrt{\\sigma_1^2+\\sigma_2^2}\\right)"
    },
    unif: {
      label: "U(0, a) + U(0, b)",
      specs: [
        { k: "a", label: "a", min: 0.5, max: 3, step: 0.1, value: 1, dec: 1 },
        { k: "b", label: "b", min: 0.5, max: 3, step: 0.1, value: 1, dec: 1 }
      ],
      fx: function (p) { return function (x) { return (x >= 0 && x <= p.a) ? 1 / p.a : 0; }; },
      fy: function (p) { return function (y) { return (y >= 0 && y <= p.b) ? 1 / p.b : 0; }; },
      fs: function (p) {
        return function (s) {
          var lo = Math.max(0, s - p.a), hi = Math.min(p.b, s);
          return hi > lo ? (hi - lo) / (p.a * p.b) : 0;
        };
      },
      limites: function (p, s) {
        var lo = Math.max(0, s - p.a), hi = Math.min(p.b, s);
        return hi > lo ? [lo, hi] : null;
      },
      ventanaY: function (p) { return [-0.6, Math.max(p.a, p.b) + 0.6]; },
      ventanaS: function (p) { return [0, p.a + p.b + 0.4]; },
      // el soporte de f_S es (0, a+b): fuera de ahí no hay nada que mirar
      sRango: function (p) { return [0.05, p.a + p.b - 0.05]; },
      sInicial: function (p) { return (p.a + p.b) * 0.35; },
      formula: "f_S(s)=\\dfrac{\\left|\\,[\\,s-a,\\,s\\,]\\cap[0,\\,b\\,]\\,\\right|}{a\\,b}"
    }
  };

  A.registerFigure("u7-convolucion-deslizar-reflejar-y-solapar", function (host, api) {
    var F = api.Fig;
    var W = 690;
    var pads = { l: 56, r: 22, t: 20, b: 44 };

    var svgs = F.panels(host, 2, { w: W, heights: [236, 196], gap: 8 });
    var svgTop = svgs[0], svgBot = svgs[1];

    var sel = F.select(host, {
      k: "par", label: "sumandos",
      options: [
        { v: "exp", label: PARES.exp.label },
        { v: "normal", label: PARES.normal.label },
        { v: "unif", label: PARES.unif.label }
      ],
      value: "exp"
    }, function () { sincronizarGrupos(); ajustarRangoS(true); invalidar(); redraw(); });

    // El rango del deslizador de s se declara aquí con los extremos MÁS AMPLIOS
    // de los tres pares; ajustarRangoS() lo estrecha al rango útil del par
    // elegido, porque Fig.controls recorta contra estos min/max iniciales.
    var gs = nuevasCajas(host, function () {
      return F.controls(host, [
        { k: "s", label: "s (desplazamiento)", min: -6, max: 8, step: 0.05, value: 2, dec: 2 }
      ], function () { redraw(); });
    });
    var ctlS = gs.ctl;
    var inputS = gs.cajas.length ? gs.cajas[0].querySelector("input[type=range]") : null;

    var grupos = {};
    Object.keys(PARES).forEach(function (nombre) {
      var g = nuevasCajas(host, function () {
        return F.controls(host, PARES[nombre].specs, function () {
          invalidar(); ajustarRangoS(false); redraw();
        });
      });
      grupos[nombre] = g;
    });

    var out = F.readouts(host, [
      { k: "area", label: "área del producto (numérica)" },
      { k: "exact", tex: "f_S(s)\\ \\text{(fórmula cerrada)}" },
      { k: "sop", label: "tramo donde el producto no se anula" }
    ]);

    F.legend(host, [
      { label: "f_Y(y) — densidad fija", color: F.series(1) },
      { label: "f_X(s − y) — reflejada y desplazada", color: F.series(2), dash: true },
      { label: "producto f_X(s − y)·f_Y(y): su área es f_S(s)", color: F.series(3), fill: true },
      { label: "f_S(s) ya trazada (es esa misma área)", color: F.series(3) }
    ]);

    var capaTop = F.el("g", null, svgTop);
    var capaBot = F.el("g", null, svgBot);

    // Muestreo de f_S: solo se recalcula cuando cambian los parámetros del par,
    // no en cada movimiento del deslizador de s.
    var cache = null;
    function invalidar() { cache = null; }

    function sincronizarGrupos() {
      var act = sel.get();
      Object.keys(grupos).forEach(function (nombre) {
        mostrarCajas(grupos[nombre].cajas, nombre === act);
      });
    }

    function parametros(nombre) {
      var p = {}, ctl = grupos[nombre].ctl;
      PARES[nombre].specs.forEach(function (sp) { p[sp.k] = ctl.get(sp.k); });
      return p;
    }

    function valorDe(campo, P, p) {
      return typeof P[campo] === "function" ? P[campo](p) : P[campo];
    }

    // Estrecha el deslizador de s al rango donde el par elegido tiene algo que
    // mostrar. Con `reiniciar` lleva s al valor inicial de ese par (cambio de
    // sumandos); sin él solo lo recorta, para no perder la posición elegida
    // por el lector cuando cambian los parámetros o se remonta la figura.
    function ajustarRangoS(reiniciar) {
      var P = PARES[sel.get()];
      var p = parametros(sel.get());
      var r = valorDe("sRango", P, p);
      var paso = 0.05;
      if (inputS) {
        inputS.min = String(r[0]);
        inputS.max = String(r[1]);
        inputS.step = String(paso);
      }
      var v = reiniciar ? valorDe("sInicial", P, p) : ctlS.get("s");
      v = Math.round(clamp(v, r[0], r[1]) / paso) * paso;
      ctlS.set("s", clamp(v, r[0], r[1]));
    }

    function limpiar(g) { while (g.firstChild) g.removeChild(g.firstChild); }

    function redraw() {
      limpiar(capaTop);
      limpiar(capaBot);

      var nombre = sel.get();
      var P = PARES[nombre];
      var p = parametros(nombre);
      var fx = P.fx(p), fy = P.fy(p), fs = P.fs(p);
      var venY = P.ventanaY(p), venS = P.ventanaS(p);
      var rangoS = valorDe("sRango", P, p);
      var s = clamp(ctlS.get("s"), rangoS[0], rangoS[1]);

      if (!cache || cache.nombre !== nombre || cache.clave !== JSON.stringify(p)) {
        var pts = [], i, n = 300;
        for (i = 0; i <= n; i++) {
          var sv = venS[0] + (venS[1] - venS[0]) * i / n;
          pts.push([sv, fs(sv)]);
        }
        cache = { nombre: nombre, clave: JSON.stringify(p), pts: pts, max: 0 };
        pts.forEach(function (q) { if (q[1] > cache.max) cache.max = q[1]; });
      }

      // ---------- panel superior: el integrando ----------
      var prod = function (y) { return fx(s - y) * fy(y); };
      var yMax = Math.max(
        maxDe(fy, venY[0], venY[1], 260),
        maxDe(function (y) { return fx(s - y); }, venY[0], venY[1], 260),
        maxDe(prod, venY[0], venY[1], 260)
      ) * 1.18 || 1;

      var hT = 236;
      var sxT = F.scale(venY, [pads.l, W - pads.r]);
      var syT = F.scale([0, yMax], [hT - pads.b, pads.t]);
      F.axes(capaTop, {
        sx: sxT, sy: syT, xTicks: 8, yTicks: 4, grid: true,
        xLabel: "y (variable de integración)", yLabel: "densidad", y0: 0
      });

      var lim = P.limites(p, s);
      if (lim) {
        var lo = Math.max(lim[0], venY[0]), hi = Math.min(lim[1], venY[1]);
        if (hi > lo) {
          F.area(capaTop, prod, sxT, syT, {
            from: lo, to: hi, n: 260, fill: F.series(3), serie: false
          });
        }
      }
      F.curve(capaTop, fy, sxT, syT, { stroke: F.series(1), n: 320, serie: "f_Y(y)" });
      F.curve(capaTop, function (y) { return fx(s - y); }, sxT, syT, {
        stroke: F.series(2), dash: "6 4", n: 320, serie: "f_X(s − y)"
      });
      F.curve(capaTop, prod, sxT, syT, { stroke: F.series(3), n: 320, serie: "producto" });

      if (s >= venY[0] && s <= venY[1]) {
        F.vline(capaTop, sxT(s), {
          y0: syT(0), y1: pads.t, stroke: F.series(2), dash: "3 3",
          label: "y = s", labelAt: pads.t - 6
        });
      }

      // ---------- panel inferior: f_S trazada punto a punto ----------
      var hB = 196;
      var padB = { l: pads.l, r: pads.r, t: 18, b: 42 };
      var sxB = F.scale(venS, [padB.l, W - padB.r]);
      var syB = F.scale([0, (cache.max || 1) * 1.2], [hB - padB.b, padB.t]);
      F.axes(capaBot, {
        sx: sxB, sy: syB, xTicks: 8, yTicks: 4, grid: true,
        xLabel: "s", yLabel: "fₛ(s)", y0: 0
      });

      var trazado = [], resto = [];
      cache.pts.forEach(function (q) {
        if (q[0] <= s) trazado.push([sxB(q[0]), syB(q[1])]);
        else resto.push([sxB(q[0]), syB(q[1])]);
      });
      if (resto.length) {
        F.line(capaBot, resto, {
          stroke: F.color("text-3"), dash: "4 4", opacity: 0.6, serie: false
        });
      }
      if (trazado.length > 1) {
        F.line(capaBot, trazado, { stroke: F.series(3), serie: "fₛ(s)" });
      }
      var fsv = fs(s);
      if (s >= venS[0] && s <= venS[1]) {
        F.vline(capaBot, sxB(s), { y0: syB(0), y1: padB.t, stroke: F.color("text-3"), dash: "3 3" });
        F.marker(capaBot, sxB(s), syB(fsv), { r: 4.8, fill: F.series(3), vx: s, vy: fsv, serie: false });
        rotuloAlCostado(F, capaBot, sxB(s), syB(fsv) - 13, W,
          "fₛ(s) = " + F.fmt(fsv, 4), F.series(3));
      }

      // ---------- lecturas ----------
      var area = lim ? integ(prod, lim[0], lim[1], 3000) : 0;
      out.set("area", F.fmt(area, 5));
      out.set("exact", F.fmt(fsv, 5));
      out.set("sop", P.acotado === false
        ? "toda la recta (las dos densidades son positivas en todo \u211d)"
        : (lim ? "y ∈ [" + F.fmt(lim[0], 2) + ", " + F.fmt(lim[1], 2) + "]" : "vacío"));
    }

    sincronizarGrupos();
    ajustarRangoS(false);
    redraw();
  }, {
    titulo: "Convolución: deslizar, reflejar y solapar",
    title: "Convolución: deslizar, reflejar y solapar",
    page: "suma-de-variables-aleatorias", kind: "interactive", unidad: "7"
  });

  // ============================================================
  //  2. La rebanada x + y = s sobre la conjunta (3D)
  //     (conceptos/suma-de-variables-aleatorias.md)
  // ============================================================

  A.registerFigure("u7-la-rebanada-x-y-s-sobre-la-conjunta", function (host, api) {
    var F = api.Fig;
    var W = 690, H = 380;
    var svg = F.svg(host, { w: W, h: H, title: "Densidad conjunta con la recta x + y = s y su rebanada" });

    var ctl = F.controls(host, [
      { k: "s", label: "corte en x + y = s", min: -4, max: 4, step: 0.1, value: 1, dec: 1 },
      { k: "rho", label: "rho (correlación)", tex: "\\rho\\ \\text{(correlación)}", min: -0.9, max: 0.9, step: 0.05, value: 0.6, dec: 2 },
      { k: "azim", label: "azimut (°)", min: -180, max: 180, step: 5, value: 35, dec: 0 }
    ], function () { redraw(); });

    var out = F.readouts(host, [
      { k: "num", label: "área de la rebanada (numérica)" },
      { k: "exa", tex: "f_S(s)=\\varphi\\!\\left(s;0,\\sqrt{2+2\\rho}\\right)" },
      { k: "sd", tex: "\\sigma_S=\\sqrt{2+2\\rho}" }
    ]);

    F.legend(host, [
      { label: "densidad conjunta f(x, y)", color: F.series(1), fill: true },
      { label: "recta x + y = s y su rebanada", color: F.series(2) }
    ]);

    var capa = F.el("g", null, svg);
    var L = 3;

    function limpiar(g) { while (g.firstChild) g.removeChild(g.firstChild); }

    function redraw() {
      limpiar(capa);
      var s = ctl.get("s"), rho = ctl.get("rho"), az = ctl.get("azim");
      var det = 1 - rho * rho;
      var k = 1 / (2 * Math.PI * Math.sqrt(det));
      var f = function (x, y) {
        return k * Math.exp(-(x * x - 2 * rho * x * y + y * y) / (2 * det));
      };

      var proj = F.iso3d({ elev: 26, azim: az, scale: 51 });
      var cx = W / 2, cy = H * 0.74;
      var zScale = 2.6;

      // La rejilla del piso y los ejes son ARMAZÓN, no dato: van en capas
      // .fig-grid / .fig-axes, con filete de 1 px y fuera de la lectura.
      var capaGrid = F.el("g", { "class": "fig-grid" }, capa);
      var capaEjes = F.el("g", { "class": "fig-axes" }, capa);
      var cGrid = F.color("plot-grid");
      for (var gi = -L; gi <= L; gi += 1) {
        var a1 = proj.project(gi, -L, 0), a2 = proj.project(gi, L, 0);
        var b1 = proj.project(-L, gi, 0), b2 = proj.project(L, gi, 0);
        F.line(capaGrid, [[cx + a1[0], cy + a1[1]], [cx + a2[0], cy + a2[1]]], { stroke: cGrid, width: 1, serie: false });
        F.line(capaGrid, [[cx + b1[0], cy + b1[1]], [cx + b2[0], cy + b2[1]]], { stroke: cGrid, width: 1, serie: false });
      }
      [[L + 0.6, 0, "x"], [0, L + 0.6, "y"]].forEach(function (e) {
        var o0 = proj.project(0, 0, 0), e0 = proj.project(e[0], e[1], 0);
        F.line(capaEjes, [[cx + o0[0], cy + o0[1]], [cx + e0[0], cy + e0[1]]], {
          stroke: F.color("plot-axis"), width: 1.2, serie: false
        });
        F.text(capaEjes, cx + e0[0] + 6, cy + e0[1] + 4, e[2], { size: 12, fill: F.color("text-3") });
      });

      var srf = F.surface(capa, f,
        { xs: { from: -L, to: L, n: 26 }, ys: { from: -L, to: L, n: 26 } }, proj, {
          fillLow: F.color("surface-2"),
          fillHigh: F.series(1),
          stroke: F.color("border-2"),
          strokeWidth: 0.35,
          cx: cx, cy: cy, zScale: zScale
        });

      // La rebanada es OBLICUA (x = s − y), así que no la puede dar Fig.slice,
      // que solo corta paralelo a un eje: se construye punto a punto con la
      // misma normalización de altura que usó la superficie.
      var yLo = Math.max(-L, s - L), yHi = Math.min(L, s + L);
      var alto = [], base = [], i, N = 120;
      if (yHi > yLo) {
        for (i = 0; i <= N; i++) {
          var y = yLo + (yHi - yLo) * i / N;
          var x = s - y;
          var v = f(x, y);
          var zz = (v - srf.zmin) / ((srf.zmax - srf.zmin) || 1) * zScale;
          var pa = proj.project(x, y, zz), pb = proj.project(x, y, 0);
          alto.push([cx + pa[0], cy + pa[1]]);
          base.push([cx + pb[0], cy + pb[1]]);
        }
        F.line(capa, alto.concat(base.slice().reverse()), {
          fill: F.series(2), opacity: 0.12, close: true, stroke: "none", width: 0
        });
        F.line(capa, base, { stroke: F.series(2), dash: "4 3", serie: "recta x + y = s" });
        F.line(capa, alto, { stroke: F.series(2), serie: "rebanada" });
        var etq = proj.project(s - yHi, yHi, 0);
        F.label(capa, cx + etq[0] + 10, cy + etq[1] + 14, "x + y = " + F.fmt(s, 1), {
          size: 11.5, mono: true, keyColor: F.series(2)
        });
      }

      // El eje vertical se dibuja DESPUÉS de la superficie para que no quede
      // tapado, en su propia capa de armazón.
      var capaEjeZ = F.el("g", { "class": "fig-axes" }, capa);
      var zt = proj.project(-L, -L, 2.9), zb = proj.project(-L, -L, 0);
      F.line(capaEjeZ, [[cx + zb[0], cy + zb[1]], [cx + zt[0], cy + zt[1]]], {
        stroke: F.color("plot-axis"), width: 1.2, dash: "3 3", serie: false
      });
      F.text(capaEjeZ, cx + zt[0] - 12, cy + zt[1] - 4, "f", { size: 12, fill: F.color("text-3") });

      // f_S(s) = ∫ f(s − y, y) dy sobre toda la recta; para ρ ≠ 0 la conjunta
      // NO factoriza y sin embargo la integral sigue valiendo.
      var num = integ(function (y) { return f(s - y, y); }, -12, 12, 4000);
      var sd = Math.sqrt(2 + 2 * rho);
      out.set("num", F.fmt(num, 5));
      out.set("exa", F.fmt(nPDF(s, 0, sd), 5));
      out.set("sd", F.fmt(sd, 4));
    }

    redraw();
  }, {
    titulo: "La rebanada x + y = s sobre la conjunta",
    title: "La rebanada x + y = s sobre la conjunta",
    page: "suma-de-variables-aleatorias", kind: "interactive", unidad: "7"
  });

  // ============================================================
  //  3. Barras contra campana: de dónde sale el ±½
  //     (conceptos/aproximacion-normal-de-la-binomial.md)
  // ============================================================

  A.registerFigure("u7-barras-contra-campana-de-donde-sale-el-12", function (host, api) {
    var F = api.Fig;
    var W = 690, H = 350;
    var pad = { l: 58, r: 22, t: 22, b: 50 };
    var svg = F.svg(host, { w: W, h: H, title: "PMF binomial superpuesta a la densidad normal" });

    var ctl = F.controls(host, [
      { k: "n", label: "n (ensayos)", min: 5, max: 200, step: 1, value: 100, dec: 0 },
      { k: "p", label: "p (éxito)", min: 0.05, max: 0.95, step: 0.01, value: 0.8, dec: 2 },
      { k: "a", label: "a (extremo izq.)", min: 0, max: 200, step: 1, value: 71, dec: 0 },
      { k: "b", label: "b (extremo der.)", min: 0, max: 200, step: 1, value: 89, dec: 0 }
    ], function () { redraw(); });

    var tg = F.toggle(host, {
      k: "cc", label: "corrección por continuidad (±½)", value: true
    }, function () { redraw(); });

    var out = F.readouts(host, [
      { k: "exacta", tex: "P(a\\le S_n\\le b)\\ \\text{exacta}" },
      { k: "sin", label: "normal sin corregir" },
      { k: "con", label: "normal con ±½" },
      { k: "err", label: "error de cada aproximación" }
    ]);

    F.legend(host, [
      { label: "barras de la PMF de Bin(n, p)", color: F.color("text-3"), fill: true, alpha: 1 },
      { label: "barras dentro de [a, b]", color: F.series(1), fill: true, alpha: 1 },
      { label: "densidad N(np, √(npq))", color: F.series(2) },
      { label: "área normal entre los límites", color: F.series(2), fill: true }
    ]);

    var capa = F.el("g", null, svg);

    function redraw() {
      while (capa.firstChild) capa.removeChild(capa.firstChild);

      var n = Math.round(ctl.get("n"));
      var p = ctl.get("p");
      var a = clamp(Math.round(ctl.get("a")), 0, n);
      var b = clamp(Math.round(ctl.get("b")), 0, n);
      if (a > b) { var t = a; a = b; b = t; }
      if (ctl.get("a") !== a) ctl.set("a", a);
      if (ctl.get("b") !== b) ctl.set("b", b);

      var mu = n * p, sd = Math.sqrt(n * p * (1 - p));
      var x0 = Math.max(-0.8, mu - 4.4 * sd), x1 = Math.min(n + 0.8, mu + 4.4 * sd);
      var fN = function (x) { return nPDF(x, mu, sd); };

      var datos = [], k, ymax = 0;
      var kLo = Math.max(0, Math.floor(x0)), kHi = Math.min(n, Math.ceil(x1));
      for (k = kLo; k <= kHi; k++) {
        var v = M.binomPMF(k, n, p);
        datos.push({ x: k, y: v, fill: (k >= a && k <= b) ? F.series(1) : F.color("text-3") });
        if (v > ymax) ymax = v;
      }
      ymax = Math.max(ymax, fN(mu)) * 1.2;

      var sx = F.scale([x0, x1], [pad.l, W - pad.r]);
      var sy = F.scale([0, ymax], [H - pad.b, pad.t]);
      F.axes(capa, {
        sx: sx, sy: sy, xTicks: 8, yTicks: 5, grid: true,
        xLabel: "s (cantidad de éxitos)", yLabel: "probabilidad / densidad", y0: 0
      });

      var cc = tg.get();
      var bordeIzq = cc ? a - 0.5 : a;
      var bordeDer = cc ? b + 0.5 : b;
      var areaLo = clamp(bordeIzq, x0, x1), areaHi = clamp(bordeDer, x0, x1);
      if (areaHi > areaLo) {
        F.area(capa, fN, sx, sy, {
          from: areaLo, to: areaHi, n: 240, fill: F.series(2), serie: false
        });
      }

      // el ancho de banda se acota para que ninguna barra pase de 24 px de
      // lienzo aun con n chico, donde caben pocos enteros en la ventana
      var pxUnidad = (W - pad.l - pad.r) / ((x1 - x0) || 1);
      F.bars(capa, datos, sx, sy, {
        width: Math.min(1, 26 / pxUnidad), serie: "Bin(n, p)"
      });
      F.curve(capa, fN, sx, sy, { stroke: F.series(2), n: 300, serie: "N(np, √(npq))" });

      [[bordeIzq, cc ? "a − ½" : "a"], [bordeDer, cc ? "b + ½" : "b"]].forEach(function (e) {
        if (e[0] < x0 || e[0] > x1) return;
        F.vline(capa, sx(e[0]), { y0: sy(0), y1: pad.t + 4, stroke: F.series(2), dash: "4 3" });
        F.label(capa, sx(e[0]), pad.t - 6, e[1], {
          size: 11.5, anchor: "middle", keyColor: F.series(2)
        });
      });
      F.vline(capa, sx(mu), { y0: sy(0), y1: sy(fN(mu)), stroke: F.series(2), dash: "5 4" });
      F.label(capa, sx(mu), sy(fN(mu)) - 8, "np = " + F.fmt(mu, 1), {
        size: 11.5, anchor: "middle", mono: true, keyColor: F.series(2)
      });

      var exacta = M.binomCDF(b, n, p) - (a > 0 ? M.binomCDF(a - 1, n, p) : 0);
      var sinCC = nCDF(b, mu, sd) - nCDF(a, mu, sd);
      var conCC = nCDF(b + 0.5, mu, sd) - nCDF(a - 0.5, mu, sd);
      out.set("exacta", F.fmt(exacta, 5));
      out.set("sin", F.fmt(sinCC, 5));
      out.set("con", F.fmt(conCC, 5));
      out.set("err", "sin ±½: " + F.fmt(Math.abs(sinCC - exacta), 5) +
        " · con ±½: " + F.fmt(Math.abs(conCC - exacta), 5));
    }

    redraw();
  }, {
    titulo: "Barras contra campana: de dónde sale el ±½",
    title: "Barras contra campana: de dónde sale el ±½",
    page: "aproximacion-normal-de-la-binomial", kind: "interactive", unidad: "7"
  });

  // ============================================================
  //  4. Cuánto se despega la cota de Chebyshev
  //     (teoremas/desigualdad-de-chebyshev.md)
  // ============================================================

  // Las tres familias se parametrizan para tener EXACTAMENTE la misma media y
  // la misma varianza; por eso la exponencial va desplazada (una Exp pura
  // obliga a σ = μ y no dejaría comparar a igualdad de momentos).
  var FAMILIAS = {
    normal: {
      label: "Normal",
      pdf: function (mu, sd) { return function (x) { return nPDF(x, mu, sd); }; },
      cdf: function (mu, sd) { return function (x) { return nCDF(x, mu, sd); }; },
      sf: function (mu, sd) { return function (x) { return M.normSF(x, mu, sd); }; },
      soporte: function (mu, sd) { return [mu - 4.6 * sd, mu + 4.6 * sd]; }
    },
    exp: {
      label: "Exponencial desplazada",
      pdf: function (mu, sd) {
        var c = mu - sd;
        return function (x) { return x < c ? 0 : Math.exp(-(x - c) / sd) / sd; };
      },
      cdf: function (mu, sd) {
        var c = mu - sd;
        return function (x) { return x <= c ? 0 : 1 - Math.exp(-(x - c) / sd); };
      },
      sf: function (mu, sd) {
        var c = mu - sd;
        return function (x) { return x <= c ? 1 : Math.exp(-(x - c) / sd); };
      },
      soporte: function (mu, sd) { return [mu - 1.6 * sd, mu + 6.2 * sd]; }
    },
    gamma: {
      label: "Gamma",
      pdf: function (mu, sd) {
        var a = (mu * mu) / (sd * sd), lam = mu / (sd * sd);
        return function (x) { return gammaPDF(x, a, lam); };
      },
      cdf: function (mu, sd) {
        var a = (mu * mu) / (sd * sd), lam = mu / (sd * sd);
        return function (x) { return gammaCDF(x, a, lam); };
      },
      sf: function (mu, sd) {
        var a = (mu * mu) / (sd * sd), lam = mu / (sd * sd);
        return function (x) { return M.gammaSF(x, a, lam); };
      },
      soporte: function (mu, sd) { return [Math.max(0, mu - 4.6 * sd), mu + 5.4 * sd]; }
    }
  };

  A.registerFigure("u7-cuanto-se-despega-la-cota-de-chebyshev", function (host, api) {
    var F = api.Fig;
    var W = 700, H = 350;
    var pad = { l: 56, r: 22, t: 24, b: 52 };
    var XPLOT = 470;                       // el gráfico de densidad llega hasta aquí
    var BX0 = 546, BX1 = 662;              // franja de las dos barras enfrentadas
    var svg = F.svg(host, { w: W, h: H, title: "Colas de la distribución frente a la cota de Chebyshev" });

    var sel = F.select(host, {
      k: "fam", label: "familia (misma μ y σ)",
      options: [
        { v: "normal", label: FAMILIAS.normal.label },
        { v: "exp", label: FAMILIAS.exp.label },
        { v: "gamma", label: FAMILIAS.gamma.label }
      ],
      value: "normal"
    }, function () { redraw(); });

    var ctl = F.controls(host, [
      { k: "eps", label: "epsilon", tex: "\\varepsilon", min: 2, max: 160, step: 1, value: 50, dec: 0 },
      { k: "mu", label: "media μ", tex: "\\mu", min: 20, max: 300, step: 5, value: 150, dec: 0 },
      { k: "sd", label: "desvío σ", tex: "\\sigma", min: 5, max: 70, step: 0.01, value: 22.36, dec: 2 }
    ], function () { redraw(); });

    var out = F.readouts(host, [
      { k: "cota", tex: "\\sigma^2/\\varepsilon^2" },
      { k: "real", tex: "P(|X-\\mu|\\ge\\varepsilon)" },
      { k: "raz", label: "cota ÷ real" },
      { k: "k", label: "ε en desvíos (k = ε/σ)" }
    ]);

    F.legend(host, [
      { label: "densidad de X", color: F.series(1) },
      { label: "colas |X − μ| ≥ ε — es la barra «real»", color: F.series(2), fill: true },
      { label: "cota de Chebyshev σ²/ε² — la barra «cota»", color: F.series(3), fill: true }
    ]);

    var capa = F.el("g", null, svg);

    function redraw() {
      while (capa.firstChild) capa.removeChild(capa.firstChild);

      var fam = FAMILIAS[sel.get()];
      var mu = ctl.get("mu"), sd = ctl.get("sd"), eps = ctl.get("eps");
      var pdf = fam.pdf(mu, sd), cdf = fam.cdf(mu, sd), sf = fam.sf(mu, sd);
      var sop = fam.soporte(mu, sd);
      var x0 = sop[0], x1 = sop[1];

      var ymax = maxDe(pdf, x0, x1, 400) * 1.22 || 1;
      var sx = F.scale([x0, x1], [pad.l, XPLOT]);
      var sy = F.scale([0, ymax], [H - pad.b, pad.t]);
      F.axes(capa, {
        sx: sx, sy: sy, xTicks: 5, yTicks: 4, grid: true,
        xLabel: "x", yLabel: "f(x)", y0: 0
      });

      var lo = mu - eps, hi = mu + eps;
      if (lo > x0) {
        F.area(capa, pdf, sx, sy, {
          from: x0, to: Math.min(lo, x1), n: 260, fill: F.series(2), serie: "cola |X − μ| ≥ ε"
        });
      }
      if (hi < x1) {
        F.area(capa, pdf, sx, sy, {
          from: Math.max(hi, x0), to: x1, n: 260, fill: F.series(2), serie: false
        });
      }
      F.curve(capa, pdf, sx, sy, { stroke: F.series(1), n: 340, serie: "f(x)" });
      F.vline(capa, sx(mu), { y0: sy(0), y1: pad.t + 2, stroke: F.series(1), dash: "5 4" });
      F.label(capa, sx(mu), pad.t - 8, "μ", { size: 12, anchor: "middle", keyColor: F.series(1) });
      [[lo, "μ − ε"], [hi, "μ + ε"]].forEach(function (e) {
        if (e[0] < x0 || e[0] > x1) return;
        F.vline(capa, sx(e[0]), { y0: sy(0), y1: pad.t + 2, stroke: F.series(2), dash: "3 3" });
        F.label(capa, sx(e[0]), sy(0) + 34, e[1], { size: 11, anchor: "middle", keyColor: F.series(2) });
      });

      // ---------- barras enfrentadas ----------
      var cota = (sd * sd) / (eps * eps);
      // la cola derecha va con la función de supervivencia, no con 1 − F(x): con
      // ε de varios desvíos esa resta cancela y da 0 donde el valor es diminuto
      // pero finito (y entonces el cociente cota ÷ real salía «∞»).
      var real = cdf(lo) + sf(hi);
      var by0 = H - pad.b, by1 = pad.t + 16;
      var syB = F.scale([0, 1], [by0, by1]);

      // eje y rejilla propios de la franja de barras: armazón, no dato
      var capaBarEje = F.el("g", { "class": "fig-axes" }, capa);
      F.line(capaBarEje, [[BX0 - 16, by0], [BX1 + 12, by0]], {
        stroke: F.color("plot-axis"), width: 1.2, serie: false
      });
      [0, 0.25, 0.5, 0.75, 1].forEach(function (v) {
        F.line(capaBarEje, [[BX0 - 16, syB(v)], [BX1 + 12, syB(v)]], {
          stroke: F.color("plot-grid"), width: 1, serie: false
        });
        F.text(capaBarEje, BX0 - 20, syB(v), String(v), {
          size: 11, anchor: "end", baseline: "middle", fill: F.color("text-3"), mono: true
        });
      });

      // Barra de 22 px de ancho, color pleno y radio de 4 px SOLO en el extremo
      // del dato: la misma forma que dibuja Fig.bars en un gráfico con ejes.
      var ancho = 22;
      function barra(cxx, valor, colorSerie, etiqueta) {
        var v = Math.min(1, valor);
        var yTop = syB(v);
        var altoBarra = Math.max(1, by0 - yTop);
        var r = Math.min(4, ancho / 2, altoBarra);
        var xA = cxx - ancho / 2, xB = cxx + ancho / 2;
        F.el("path", {
          d: "M" + xA + " " + by0 + "V" + (yTop + r) +
             "Q" + xA + " " + yTop + " " + (xA + r) + " " + yTop +
             "H" + (xB - r) + "Q" + xB + " " + yTop + " " + xB + " " + (yTop + r) +
             "V" + by0 + "Z",
          fill: colorSerie
        }, capa);
        if (valor > 1) {
          F.line(capa, [[xA - 5, yTop], [xB + 5, yTop]], {
            stroke: F.color("text-2"), dash: "4 3", serie: false
          });
        }
        F.label(capa, cxx, yTop - 7, valor > 1 ? "> 1" : F.fmt(valor, valor < 0.001 ? 6 : 4), {
          size: 11.5, anchor: "middle", mono: true, keyColor: colorSerie
        });
        F.text(capa, cxx, by0 + 8, etiqueta, {
          size: 11, anchor: "middle", baseline: "hanging", fill: F.color("text-3")
        });
      }
      // La barra «real» repite la ranura de las colas sombreadas porque es esa
      // misma área; la cota ocupa una ranura distinta de la paleta de serie.
      barra(BX0 + 16, cota, F.series(3), "cota");
      barra(BX1 - 20, real, F.series(2), "real");
      // El rótulo va bien arriba: cuando la cota pasa de 1, su barra se corta
      // en y = 1 y escribe «> 1» justo a esta altura.
      F.text(capa, (BX0 + BX1) / 2 - 2, by1 - 21, "probabilidad", {
        size: 11.5, anchor: "middle", fill: F.color("text-3")
      });

      out.set("cota", cota > 1 ? F.fmt(cota, 3) + "  (no dice nada)" : F.fmt(cota, 4));
      out.set("real", real < 1e-4 ? real.toExponential(3) : F.fmt(real, 6));
      // nunca «∞»: si la cola cae por debajo de lo representable se informa una
      // cota inferior del cociente, y por encima de 1e4 se usa notación científica.
      var razon = real > 0 ? cota / real : Infinity;
      out.set("raz", !isFinite(razon) ? "> 1e12 ×"
        : razon >= 1e4 ? razon.toExponential(2) + " ×"
          : F.fmt(razon, 2) + " ×");
      out.set("k", F.fmt(eps / sd, 3));
    }

    redraw();
  }, {
    titulo: "Cuánto se despega la cota de Chebyshev",
    title: "Cuánto se despega la cota de Chebyshev",
    page: "desigualdad-de-chebyshev", kind: "interactive", unidad: "7"
  });

  // ============================================================
  //  5. La recta x/α por encima del escalón (Markov, estática)
  //     (teoremas/desigualdad-de-chebyshev.md)
  // ============================================================

  A.registerFigure("u7-la-recta-x-por-encima-del-escalon", function (host, api) {
    var F = api.Fig;
    var W = 690, H = 320;
    var pad = { l: 58, r: 26, t: 24, b: 52 };
    var svg = F.svg(host, { w: W, h: H, title: "La recta x/α domina a la indicadora en todo el semieje" });

    F.legend(host, [
      { label: "indicadora 1 para x ≥ α", color: F.series(1) },
      { label: "recta y = x/α", color: F.series(2) },
      { label: "diferencia (x/α) − indicadora ≥ 0", color: F.series(3), fill: true },
      { label: "densidad f(x) contra la que se integra", color: F.color("text-3"), dash: true }
    ]);

    var capa = F.el("g", null, svg);
    var ALFA = 2, X1 = 5;

    function redraw() {
      while (capa.firstChild) capa.removeChild(capa.firstChild);

      var sx = F.scale([0, X1], [pad.l, W - pad.r]);
      var sy = F.scale([0, 2.6], [H - pad.b, pad.t]);
      F.axes(capa, {
        sx: sx, sy: sy, xTicks: 6, yTicks: 5, grid: true,
        xLabel: "x", yLabel: "y", y0: 0
      });

      var recta = function (x) { return x / ALFA; };
      var indic = function (x) { return x >= ALFA ? 1 : 0; };

      // La brecha entre las dos curvas es lo que se pierde al acotar.
      F.area(capa, function (x) { return recta(x) - indic(x); }, sx, sy, {
        from: 0, to: X1, n: 400, fill: F.series(3), serie: "brecha"
      });

      // densidad de referencia (Exp de media 1), en gris y al fondo
      F.curve(capa, function (x) { return Math.exp(-x); }, sx, sy, {
        stroke: F.color("text-3"), dash: "5 4", n: 240, serie: "f(x)"
      });
      F.text(capa, sx(0.42), sy(Math.exp(-0.42)) - 10, "f(x)", {
        size: 11.5, fill: F.color("text-3"), mono: true
      });

      F.line(capa, [[0, 0], [ALFA, 0]], { sx: sx, sy: sy, stroke: F.series(1), serie: "indicadora" });
      F.line(capa, [[ALFA, 1], [X1, 1]], { sx: sx, sy: sy, stroke: F.series(1), serie: false });
      // el salto en x = α y la referencia vertical son la MISMA línea punteada
      F.vline(capa, sx(ALFA), { y0: sy(0), y1: pad.t + 2, stroke: F.series(1), dash: "3 3" });
      F.marker(capa, sx(ALFA), sy(1), { r: 4.8, fill: F.series(1), serie: false });
      F.marker(capa, sx(ALFA), sy(0), {
        r: 4.6, fill: F.color("surface"), stroke: F.series(1), strokeWidth: 2, serie: false
      });

      F.line(capa, [[0, 0], [X1, recta(X1)]], {
        sx: sx, sy: sy, stroke: F.series(2), serie: "y = x/α"
      });

      F.label(capa, sx(ALFA) + 11, sy(0) + 13, "α", {
        size: 12.5, baseline: "hanging", key: false
      });
      F.text(capa, sx(ALFA) + 8, sy(1) - 10, "las dos valen 1 en x = α", {
        size: 11, fill: F.color("text-2")
      });
      F.label(capa, sx(4.55), sy(recta(4.55)) - 12, "y = x/α", {
        size: 12, anchor: "end", mono: true, keyColor: F.series(2)
      });
      F.label(capa, sx(3.5), sy(1) + 18, "indicadora", {
        size: 12, anchor: "middle", keyColor: F.series(1)
      });
      F.hline(capa, sy(1), { x0: pad.l, x1: W - pad.r, stroke: F.color("plot-axis"), dash: "2 5", width: 1 });
    }

    redraw();
  }, {
    titulo: "La recta x/α por encima del escalón",
    title: "La recta x/α por encima del escalón",
    page: "desigualdad-de-chebyshev", kind: "static", unidad: "7"
  });

  // ============================================================
  //  6. Línea de tiempo: la dualidad T_k ↔ N(t)
  //     (distribuciones/distribucion-erlang.md)
  // ============================================================

  A.registerFigure("u7-linea-de-tiempo-la-dualidad-t-k-n-t", function (host, api) {
    var F = api.Fig;
    var W = 690;
    var svgs = F.panels(host, 2, { w: W, heights: [186, 200], gap: 8 });
    var svgT = svgs[0], svgN = svgs[1];
    var X0 = 56, X1 = W - 26, TMAX = 10;

    var ctl = F.controls(host, [
      { k: "t", label: "instante t", min: 0.2, max: 10, step: 0.05, value: 3.4, dec: 2 },
      { k: "k", label: "k (ocurrencia esperada)", min: 1, max: 8, step: 1, value: 3, dec: 0 },
      { k: "lam", label: "lambda (tasa)", tex: "\\lambda\\ \\text{(tasa)}", min: 0.2, max: 2.5, step: 0.05, value: 1, dec: 2 }
    ], function (clave) {
      if (clave === "lam") regenerar();
      redraw();
    });

    // La semilla vive en el estado de la figura (host.__figState) y no en una
    // variable de closure: así la realización sorteada sobrevive al remonte
    // por cambio de tema o resize, igual que la posición de los deslizadores.
    if (typeof api.state.semilla !== "number") api.state.semilla = 2733;
    F.buttons(host, [{
      label: "Nueva realización",
      title: "Vuelve a sortear los tiempos entre ocurrencias con otra semilla",
      onClick: function () {
        api.state.semilla = (api.state.semilla * 1103515245 + 12345) >>> 8;
        regenerar();
        redraw();
      }
    }]);

    var out = F.readouts(host, [
      { k: "nt", tex: "N(t)\\ \\text{(en esta realización)}" },
      { k: "tk", tex: "T_k\\ \\text{(en esta realización)}" },
      { k: "dual", label: "las dos lecturas del mismo hecho" },
      { k: "prob", tex: "P(T_k>t)=P\\big(N(t)\\le k-1\\big)" }
    ]);

    F.legend(host, [
      { label: "ocurrencias T₁, T₂, … del proceso", color: F.series(1), fill: true, alpha: 1 },
      { label: "instante t", color: F.series(2) },
      { label: "la k-ésima ocurrencia buscada", color: F.series(3), fill: true, alpha: 1 },
      { label: "contador N(t)", color: F.series(4) }
    ]);

    var capaT = F.el("g", null, svgT);
    var capaN = F.el("g", null, svgN);
    var tiempos = [];

    function regenerar() {
      var u = F.rng(api.state.semilla);
      var lam = ctl.get("lam");
      var acc = 0;
      tiempos = [];
      while (tiempos.length < 40) {
        acc += u.exp(lam);
        if (acc > TMAX * 1.4) break;
        tiempos.push(acc);
      }
    }

    function limpiar(g) { while (g.firstChild) g.removeChild(g.firstChild); }

    function redraw() {
      limpiar(capaT);
      limpiar(capaN);

      var t = ctl.get("t"), k = Math.round(ctl.get("k")), lam = ctl.get("lam");
      var marcas = [], i;
      for (i = 0; i < tiempos.length; i++) {
        if (tiempos[i] > TMAX) break;
        marcas.push({
          t: tiempos[i],
          color: (i + 1) === k ? F.series(3) : F.series(1),
          h: (i + 1) === k ? 23 : 15, width: 2
        });
      }

      var sxPre = F.scale([0, TMAX], [X0, X1]);
      F.el("rect", {
        x: X0, y: 30, width: Math.max(1, sxPre(t) - X0), height: 66,
        fill: F.series(2), opacity: 0.10
      }, capaT);

      // El eje de la línea de tiempo (filete, punta y ticks) es armazón: va en
      // una capa .fig-axes. Las marcas de ocurrencia llevan el trazo de dato.
      var capaEje = F.el("g", { "class": "fig-axes" }, capaT);
      var tl = F.timeline(capaEje, {
        t0: 0, t1: TMAX, x0: X0, x1: X1, y: 74, marks: marcas, ticks: 6,
        label: "tiempo"
      });
      var sx = tl.sx, yEje = tl.y;
      // Rótulo directo de la ÚNICA ocurrencia que la figura señala: la k-ésima.
      // Las demás quedan sin rótulo (la leyenda ya dice qué son) para no
      // amontonar veinte etiquetas sobre el mismo carril.
      for (i = 0; i < marcas.length; i++) {
        if (i + 1 !== k) continue;
        F.marker(capaT, sx(marcas[i].t), yEje, {
          r: 4.8, fill: F.series(3), vx: marcas[i].t, serie: "Tₖ"
        });
        F.label(capaT, sx(marcas[i].t), yEje - 34, "Tₖ", {
          size: 11.5, anchor: "middle", mono: true, keyColor: F.series(3)
        });
      }

      // flechas de los intervalos τ_i entre ocurrencias
      // Corchetes de medida de los τᵢ: son líneas de REFERENCIA (canal
      // secundario, filete tenue), no series. Solo los dos primeros llevan
      // rótulo: con dos ya se lee el patrón y el epígrafe enuncia la suma.
      var previo = 0;
      for (i = 0; i < marcas.length && i < 8; i++) {
        var xa = sx(previo), xb = sx(marcas[i].t);
        var yA = 118;
        F.hline(capaT, yA, { x0: xa, x1: xb, stroke: F.color("text-3"), dash: false, width: 1.2 });
        F.vline(capaT, xa, { y0: yA - 4, y1: yA + 4, stroke: F.color("text-3"), dash: false, width: 1.2 });
        F.vline(capaT, xb, { y0: yA - 4, y1: yA + 4, stroke: F.color("text-3"), dash: false, width: 1.2 });
        if (i < 2 && xb - xa > 26) {
          F.text(capaT, (xa + xb) / 2, yA + 7, "τ" + (i + 1), {
            size: 11, anchor: "middle", baseline: "hanging", fill: F.color("text-3"), mono: true
          });
        }
        previo = marcas[i].t;
      }

      F.vline(capaT, sx(t), { y0: 26, y1: yEje + 8, stroke: F.series(2), dash: "5 4" });
      F.label(capaT, sx(t), 20, "t = " + F.fmt(t, 2), {
        size: 12, anchor: "middle", mono: true, keyColor: F.series(2)
      });

      // ---------- panel del contador N(t) ----------
      var padN = { l: X0, r: W - X1, t: 22, b: 44 };
      var hN = 200;
      var nMax = Math.max(k + 1, marcas.length) + 0.6;
      var sxN = F.scale([0, TMAX], [X0, X1]);
      var syN = F.scale([0, nMax], [hN - padN.b, padN.t]);
      F.axes(capaN, {
        sx: sxN, sy: syN, xTicks: 6, yTicks: Math.min(8, Math.ceil(nMax)), grid: true,
        xLabel: "t", yLabel: "N(t)", y0: 0
      });

      var esc = [[sxN(0), syN(0)]];
      for (i = 0; i < marcas.length; i++) {
        esc.push([sxN(marcas[i].t), syN(i)]);
        esc.push([sxN(marcas[i].t), syN(i + 1)]);
      }
      esc.push([sxN(TMAX), syN(marcas.length)]);
      F.line(capaN, esc, { stroke: F.series(4), serie: "N(t)" });

      var nt = 0;
      for (i = 0; i < marcas.length; i++) if (marcas[i].t <= t) nt++;
      F.vline(capaN, sxN(t), { y0: syN(0), y1: padN.t, stroke: F.series(2), dash: "5 4" });
      F.hline(capaN, syN(k - 1), { x0: X0, x1: X1, stroke: F.series(3), dash: "6 4" });
      F.label(capaN, X1 - 4, syN(k - 1) - 6, "N(t) ≤ k − 1 = " + (k - 1), {
        size: 11.5, anchor: "end", mono: true, keyColor: F.series(3)
      });
      F.marker(capaN, sxN(t), syN(nt), { r: 4.8, fill: F.series(4), vx: t, vy: nt, serie: false });
      // N(t) es no decreciente: arriba y a la IZQUIERDA del punto el escalón
      // siempre deja lugar libre, así que el rótulo va siempre de ese lado.
      F.label(capaN, sxN(t) - 9, syN(nt) - 14, "N(t) = " + nt, {
        size: 11.5, anchor: "end", mono: true, keyColor: F.series(4)
      });

      var tk = tiempos.length >= k ? tiempos[k - 1] : null;
      out.set("nt", String(nt));
      out.set("tk", tk == null ? "fuera de la ventana" : F.fmt(tk, 3));
      out.set("dual", nt <= k - 1
        ? "la k-ésima no llegó (T_k > t)  ⟺  hubo a lo sumo k − 1 (N(t) ≤ k − 1)"
        : "la k-ésima ya llegó (T_k ≤ t)  ⟺  hubo al menos k (N(t) ≥ k)");
      out.set("prob", F.fmt(M.poissonCDF(k - 1, lam * t), 5));
    }

    regenerar();
    redraw();
  }, {
    titulo: "Línea de tiempo: la dualidad Tₖ ↔ N(t)",
    title: "Línea de tiempo: la dualidad Tₖ ↔ N(t)",
    page: "distribucion-erlang", kind: "interactive", unidad: "7"
  });

  // ============================================================
  //  7. S_n se abre, X̄_n se cierra
  //     (conceptos/promedio-muestral.md)
  // ============================================================

  A.registerFigure("u7-s-n-se-abre-x-n-se-cierra", function (host, api) {
    var F = api.Fig;
    var W = 690;
    var svgs = F.panels(host, 2, { w: W, heights: [196, 210], gap: 8 });
    var svgS = svgs[0], svgX = svgs[1];

    var ctl = F.controls(host, [
      { k: "n", label: "n (tamaño de muestra)", min: 1, max: 200, step: 1, value: 9, dec: 0 },
      { k: "mu", label: "media μ", tex: "\\mu", min: -5, max: 10, step: 0.5, value: 2, dec: 1 },
      { k: "sd", label: "desvío σ", tex: "\\sigma", min: 0.5, max: 5, step: 0.1, value: 2, dec: 1 }
    ], function () { redraw(); });

    var tg = F.toggle(host, {
      k: "fija", label: "misma escala en x (±4σ alrededor del centro)", value: true
    }, function () { redraw(); });

    var out = F.readouts(host, [
      { k: "es", tex: "\\E[S_n]=n\\mu" },
      { k: "ss", tex: "\\sigma_{S_n}=\\sigma\\sqrt{n}" },
      { k: "sx", tex: "\\sigma_{\\bar X_n}=\\sigma/\\sqrt{n}" },
      { k: "raz", label: "σ_Sn ÷ σ_X̄n = n" }
    ]);

    F.legend(host, [
      { label: "densidad de la suma Sₙ", color: F.series(1) },
      { label: "densidad del promedio X̄ₙ", color: F.series(2) },
      { label: "banda ±σ alrededor del centro", color: F.series(3), fill: true, band: true }
    ]);

    var capaS = F.el("g", null, svgS);
    var capaX = F.el("g", null, svgX);

    function limpiar(g) { while (g.firstChild) g.removeChild(g.firstChild); }

    function panel(capa, h, centro, sd, ancho, etiqueta, colorSerie, ejeX, serieNom) {
      var pad = { l: 60, r: 24, t: 20, b: 44 };
      var x0 = centro - ancho, x1 = centro + ancho;
      var f = function (x) { return nPDF(x, centro, sd); };
      var ymax = f(centro) * 1.22;
      var sx = F.scale([x0, x1], [pad.l, W - pad.r]);
      var sy = F.scale([0, ymax], [h - pad.b, pad.t]);
      F.axes(capa, {
        sx: sx, sy: sy, xTicks: 7, yTicks: 4, grid: true,
        xLabel: ejeX, yLabel: "densidad", y0: 0
      });
      var bLo = Math.max(x0, centro - sd), bHi = Math.min(x1, centro + sd);
      if (bHi > bLo) {
        F.area(capa, f, sx, sy, {
          from: bLo, to: bHi, n: 260, fill: F.series(3), band: true, serie: false
        });
      }
      F.curve(capa, f, sx, sy, { stroke: colorSerie, n: 320, serie: serieNom });
      F.vline(capa, sx(centro), { y0: sy(0), y1: sy(f(centro)), stroke: colorSerie, dash: "5 4" });
      F.label(capa, sx(centro), sy(f(centro)) - 9, etiqueta, {
        size: 11.5, anchor: "middle", mono: true, keyColor: colorSerie
      });
      [[bLo, "−σ"], [bHi, "+σ"]].forEach(function (e) {
        if (e[0] <= x0 || e[0] >= x1) return;
        F.vline(capa, sx(e[0]), { y0: sy(0), y1: sy(f(e[0])), stroke: F.series(3), dash: "3 3" });
      });
      // La línea punteada de +σ cae justo sobre este rótulo cuando la banda
      // llega al borde derecho: lleva halo del color del fondo para que la
      // línea no lo atraviese (se dibuja después de las verticales).
      haloText(F, capa, W - 26, sy(0) - 8, "ancho ±σ = " + F.fmt(sd, 3), {
        size: 11, anchor: "end", fill: F.color("text-3"), mono: true, halo: 3.6
      });
      if (bLo <= x0 && bHi >= x1) {
        F.label(capa, W - 26, sy(0) - 24, "la banda ±σ excede la ventana", {
          size: 11, anchor: "end", keyColor: F.series(3)
        });
      }
    }

    function redraw() {
      limpiar(capaS);
      limpiar(capaX);

      var n = Math.round(ctl.get("n"));
      var mu = ctl.get("mu"), sd = ctl.get("sd");
      var sdS = sd * Math.sqrt(n), sdX = sd / Math.sqrt(n);
      var fija = tg.get();
      // Con la escala fija, las dos ventanas miden lo mismo en unidades de la
      // variable (±4σ, el ancho que tenían ambas con n = 1): por eso al subir n
      // la suma desborda la ventana y el promedio se convierte en una aguja.
      var anchoS = fija ? 4 * sd : 4 * sdS;
      var anchoX = fija ? 4 * sd : 4 * sdX;

      panel(capaS, 196, n * mu, sdS, anchoS, "n·μ = " + F.fmt(n * mu, 2), F.series(1),
        "valor de la suma Sₙ", "Sₙ");
      panel(capaX, 210, mu, sdX, anchoX, "μ = " + F.fmt(mu, 2), F.series(2),
        "valor del promedio X̄ₙ", "X̄ₙ");

      out.set("es", F.fmt(n * mu, 3));
      out.set("ss", F.fmt(sdS, 4));
      out.set("sx", F.fmt(sdX, 4));
      out.set("raz", F.fmt(sdS / sdX, 2) + "  (= n)");
    }

    redraw();
  }, {
    titulo: "S_n se abre, X̄_n se cierra",
    title: "S_n se abre, X̄_n se cierra",
    page: "promedio-muestral", kind: "interactive", unidad: "7"
  });

  // ============================================================
  //  8. El cuadrado unidad cortado por x + y = s
  //     (conceptos/suma-de-va-independientes.md)
  // ============================================================

  A.registerFigure("u7-el-cuadrado-unidad-cortado-por-x-y-s", function (host, api) {
    var F = api.Fig;
    var W = 690, H = 340;
    var svg = F.svg(host, { w: W, h: H, title: "El cuadrado unidad cortado por la recta x + y = s" });

    var ctl = F.controls(host, [
      { k: "s", label: "s (valor de la suma)", min: -0.5, max: 2.5, step: 0.02, value: 0.7, dec: 2 }
    ], function () { redraw(); });

    var out = F.readouts(host, [
      { k: "caso", label: "caso activo" },
      { k: "corte", label: "corte en y: [y_mín, y_máx]" },
      { k: "len", tex: "\\Delta y = f_S(s)" }
    ]);

    F.legend(host, [
      { label: "cuadrado (0,1)×(0,1) donde la conjunta vale 1", color: F.series(1), fill: true },
      { label: "recta x + y = s", color: F.series(2) },
      { label: "tramo de la recta dentro del cuadrado", color: F.series(3) },
      { label: "densidad triangular fₛ", color: F.series(4) }
    ]);

    var capa = F.el("g", null, svg);

    function redraw() {
      while (capa.firstChild) capa.removeChild(capa.firstChild);

      var s = ctl.get("s");

      // ---------- panel izquierdo: el plano (x, y) ----------
      var pad = { l: 54, t: 30, b: 56 };
      var lado = H - pad.t - pad.b;
      // escala cuadrada: mismo número de píxeles por unidad en los dos ejes,
      // porque de otro modo la recta x + y = s no se vería a 45°
      var px = lado / 1.9;
      var sx = F.scale([-0.45, 1.45], [pad.l, pad.l + 1.9 * px]);
      var sy = F.scale([-0.45, 1.45], [H - pad.b, H - pad.b - 1.9 * px]);

      F.axes(capa, {
        sx: sx, sy: sy, xTicks: [0, 0.5, 1], yTicks: [0, 0.5, 1], grid: true,
        xLabel: "x", yLabel: "y", y0: 0
      });
      F.el("rect", {
        x: sx(0), y: sy(1), width: sx(1) - sx(0), height: sy(0) - sy(1),
        fill: F.series(1), opacity: 0.12, stroke: F.series(1), "stroke-width": 2
      }, capa);
      F.text(capa, (sx(0) + sx(1)) / 2, (sy(0) + sy(1)) / 2, "f(x,y) = 1", {
        size: 11.5, anchor: "middle", baseline: "middle", fill: F.color("text-2"), mono: true
      });

      // recta x + y = s dentro de la ventana
      var d0 = -0.45, d1 = 1.45;
      var pa = [Math.max(d0, s - d1), Math.min(d1, s - d0)];   // rango de y visible
      if (pa[1] > pa[0]) {
        F.line(capa, [[sx(s - pa[0]), sy(pa[0])], [sx(s - pa[1]), sy(pa[1])]], {
          stroke: F.series(2), dash: "5 4", serie: false
        });
      }

      var yLo = Math.max(0, s - 1), yHi = Math.min(1, s);
      var len = yHi > yLo ? yHi - yLo : 0;
      if (len > 0) {
        F.line(capa, [[sx(s - yLo), sy(yLo)], [sx(s - yHi), sy(yHi)]], {
          stroke: F.series(3), serie: "tramo"
        });
        // corchete del intervalo de integración sobre el eje y
        var xb = sx(-0.30);
        F.line(capa, [[xb, sy(yLo)], [xb, sy(yHi)]], { stroke: F.series(3), serie: false });
        F.line(capa, [[xb - 4, sy(yLo)], [xb + 4, sy(yLo)]], { stroke: F.series(3), serie: false });
        F.line(capa, [[xb - 4, sy(yHi)], [xb + 4, sy(yHi)]], { stroke: F.series(3), serie: false });
        F.label(capa, xb - 7, (sy(yLo) + sy(yHi)) / 2, "Δy", {
          size: 11.5, anchor: "end", baseline: "middle", mono: true, keyColor: F.series(3)
        });
      }
      F.label(capa, sx(0.5), pad.t - 12, "x + y = " + F.fmt(s, 2), {
        size: 12, anchor: "middle", mono: true, keyColor: F.series(2)
      });

      // ---------- panel derecho: la triangular ----------
      var rx0 = pad.l + 1.9 * px + 74, rx1 = W - 26;
      var rpad = { t: 34, b: 56 };
      var sxT = F.scale([-0.2, 2.2], [rx0, rx1]);
      var syT = F.scale([0, 1.2], [H - rpad.b, rpad.t]);
      F.axes(capa, {
        sx: sxT, sy: syT, xTicks: [0, 1, 2], yTicks: 3, grid: true,
        xLabel: "s", yLabel: "fₛ(s)", y0: 0
      });
      var fs = function (v) {
        var lo = Math.max(0, v - 1), hi = Math.min(1, v);
        return hi > lo ? hi - lo : 0;
      };
      F.curve(capa, fs, sxT, syT, { stroke: F.series(4), n: 260, serie: "fₛ(s)" });
      if (s >= -0.2 && s <= 2.2) {
        F.vline(capa, sxT(s), { y0: syT(0), y1: rpad.t, stroke: F.series(2), dash: "3 3" });
        F.marker(capa, sxT(s), syT(len), { r: 4.8, fill: F.series(3), vx: s, vy: len, serie: false });
        F.label(capa, sxT(s) - 9, syT(len) - 13, F.fmt(len, 2), {
          size: 11.5, anchor: "end", mono: true, keyColor: F.series(3)
        });
      }

      var caso;
      if (s <= 0) caso = "(i) s ≤ 0: la recta no toca el cuadrado, f_S = 0";
      else if (s < 1) caso = "(ii) 0 < s < 1: corte creciente, f_S(s) = s";
      else if (s < 2) caso = "(iii) 1 ≤ s < 2: corte decreciente, f_S(s) = 2 − s";
      else caso = "(iv) s ≥ 2: la recta ya pasó de largo, f_S = 0";
      out.set("caso", caso);
      out.set("corte", len > 0 ? "[" + F.fmt(yLo, 2) + ", " + F.fmt(yHi, 2) + "]" : "vacío");
      out.set("len", F.fmt(len, 4));
    }

    redraw();
  }, {
    titulo: "El cuadrado unidad cortado por x + y = s",
    title: "El cuadrado unidad cortado por x + y = s",
    page: "suma-de-va-independientes", kind: "interactive", unidad: "7"
  });

  // ============================================================
  //  9. Los desvíos se suman en cuadratura (estática)
  //     (conceptos/suma-de-va-independientes.md)
  // ============================================================

  A.registerFigure("u7-los-desvios-se-suman-en-cuadratura", function (host, api) {
    var F = api.Fig;
    var W = 690, H = 330;
    var svg = F.svg(host, { w: W, h: H, title: "Las varianzas se suman: el desvío de la suma es la hipotenusa" });

    F.legend(host, [
      { label: "densidad de X, con σ₁ = 3", color: F.series(1) },
      { label: "densidad de Y, con σ₂ = 4", color: F.series(2) },
      { label: "densidad de S correcta: σₛ = √(3² + 4²) = 5", color: F.series(3) },
      { label: "error frecuente: sumar los desvíos (σ₁ + σ₂ = 7)", color: F.color("bad"), dash: true }
    ]);

    var capa = F.el("g", null, svg);
    var S1 = 3, S2 = 4;

    function redraw() {
      while (capa.firstChild) capa.removeChild(capa.firstChild);

      var sS = Math.sqrt(S1 * S1 + S2 * S2);
      var sMal = S1 + S2;

      // ---------- izquierda: las campanas ----------
      var pad = { l: 56, t: 26, b: 54 };
      var PX1 = 452;
      var x0 = -20, x1 = 20;
      var sx = F.scale([x0, x1], [pad.l, PX1]);
      var sy = F.scale([0, nPDF(0, 0, S1) * 1.2], [H - pad.b, pad.t]);
      F.axes(capa, {
        sx: sx, sy: sy, xTicks: 7, yTicks: 4, grid: true,
        xLabel: "valor (todas centradas en 0)", yLabel: "densidad", y0: 0
      });

      [[S1, F.series(1), "X", 1.15], [S2, F.series(2), "Y", 1.55], [sS, F.series(3), "S", 2.0]].forEach(function (c) {
        F.curve(capa, function (x) { return nPDF(x, 0, c[0]); }, sx, sy, {
          stroke: c[1], n: 300, serie: c[2]
        });
        // Cada rótulo se ancla a un múltiplo distinto de su σ: con el mismo
        // múltiplo para las tres campanas quedaban a 14 px unos de otros.
        var xe = c[0] * c[3];
        F.label(capa, sx(xe) + 5, sy(nPDF(xe, 0, c[0])) - 4, c[2], {
          size: 12, anchor: "start", mono: true, keyColor: c[1]
        });
      });
      // La campana equivocada usa el color de ESTADO «incorrecto» y va siempre
      // con rótulo directo; queda fuera de la lectura al pasar el puntero
      // porque no es una serie del modelo, es el error que se quiere descartar.
      F.curve(capa, function (x) { return nPDF(x, 0, sMal); }, sx, sy, {
        stroke: F.status("bad"), dash: "6 4", n: 300, serie: false
      });
      F.label(capa, sx(-13.5), sy(nPDF(13.5, 0, sMal)) - 10, "σ₁ + σ₂ (incorrecta)", {
        size: 11, anchor: "middle", keyColor: F.status("bad")
      });

      // ---------- derecha: el triángulo rectángulo ----------
      var tx = 512, ty = H - 92, esc = 26;
      var ax = tx, ay = ty;
      var bx = tx + S1 * esc, by = ty;
      var cyy = ty - S2 * esc;
      F.line(capa, [[ax, ay], [bx, by], [bx, cyy]], {
        stroke: F.color("text-2"), close: true,
        fill: F.series(3), opacity: 0.12, serie: false
      });
      F.line(capa, [[ax, ay], [bx, by]], { stroke: F.series(1), serie: false });
      F.line(capa, [[bx, by], [bx, cyy]], { stroke: F.series(2), serie: false });
      F.line(capa, [[ax, ay], [bx, cyy]], { stroke: F.series(3), serie: false });
      // marca de ángulo recto: armazón geométrico, no dato
      var capaAng = F.el("g", { "class": "fig-axes" }, capa);
      F.el("path", {
        d: "M" + (bx - 11) + " " + by + " v-11 h11",
        fill: "none", stroke: F.color("text-3"), "stroke-width": 1.2
      }, capaAng);

      F.label(capa, (ax + bx) / 2, ay + 17, "σ₁ = 3", {
        size: 12, anchor: "middle", baseline: "hanging", mono: true, keyColor: F.series(1)
      });
      F.label(capa, bx + 8, (by + cyy) / 2, "σ₂ = 4", {
        size: 12, baseline: "middle", mono: true, keyColor: F.series(2)
      });
      F.label(capa, (ax + bx) / 2 - 22, (ay + cyy) / 2 - 2, "σₛ = 5", {
        size: 12.5, anchor: "end", mono: true, keyColor: F.series(3)
      });
      F.text(capa, 466, H - 46, "σₛ² = σ₁² + σ₂²  ⇒  σₛ = 5", {
        size: 11.5, baseline: "hanging", fill: F.color("text-2")
      });
      F.text(capa, 466, H - 28, "σₛ ≥ máx(σ₁, σ₂)", {
        size: 11, baseline: "hanging", fill: F.color("text-3")
      });
    }

    redraw();
  }, {
    titulo: "Los desvíos se suman en cuadratura",
    title: "Los desvíos se suman en cuadratura",
    page: "suma-de-va-independientes", kind: "static", unidad: "7"
  });

})();
