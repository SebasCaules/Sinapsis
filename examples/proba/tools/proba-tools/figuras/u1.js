/* ============================================================
   figuras/u1.js — figuras de la Unidad 1 (estadística descriptiva).

   Se carga DESPUÉS de figures.js (necesita App.registerFigure) y de
   lib-math.js (window.M). Cada figura se registra con su identificador
   definitivo; las páginas del wiki las invocan con el callout

       > [!figura] <id>
       > <epígrafe>

   FIGURAS REGISTRADAS
     u1-bigotes-vs-limites-de-tukey     boxplot.md
     u1-lo-que-el-boxplot-no-muestra    (no registrada: fuera de alcance)
     u1-lectura-del-cuartil-sobre-la-ojiva
                                        tecnica-datos-agrupados-interpolacion.md
     u1-balanza-media-contra-mediana    medidas-de-tendencia-central.md
     u1-paridad-de-n-y-la-mediana       medidas-de-tendencia-central.md
     u1-tres-formas-y-el-orden-media-mediana
                                        asimetria-y-curtosis.md
     u1-peso-de-colas-a-igual-media-y-desvio
                                        asimetria-y-curtosis.md
     u1-el-ancho-de-bin-cambia-la-historia
                                        histograma-y-frecuencias.md
     u1-los-f-i-subintervalos-del-reparto
                                        datos-agrupados.md
     u1-bandas-x-ks-sobre-el-histograma medidas-de-dispersion.md

   CONVENCIÓN DE CUARTILES
     La función quantile() de este archivo implementa el criterio documentado
     en wiki/conceptos/cuartiles-y-percentiles.md (el del video de la cátedra):
     con h = p·n, si h es entero se promedian las dos observaciones contiguas
     y si no se interpola linealmente; para p = 0.5 con n impar prevalece la
     definición de mediana (la observación central). No se usa la convención
     de ningún paquete estadístico en particular, justamente porque la propia
     página documenta que difieren.

   DATOS
     Los conjuntos de datos de tabla (1000 llamadas, 100 recién nacidos, el
     intervalo [36,39) de la teórica) son los de las páginas del wiki. Los
     conjuntos simulados se generan con Fig.rng(semilla) — reproducibles — y
     TODOS los números que aparecen en pantalla se calculan sobre los datos
     efectivamente dibujados, nunca se escriben a mano.

   NUEVA REALIZACIÓN (figuras 4, 7 y 9)
     Las tres figuras que simulan datos guardan su semilla en api.state.seed,
     o sea en host.__figState, de modo que SOBREVIVE al remonte por cambio de
     tema o por resize: la misma realización se vuelve a dibujar igual. El
     botón «Nueva realización» incrementa esa semilla y redibuja, así que la
     variabilidad muestral se puede mirar sin recargar la página. Los datos se
     generan dentro de redraw() —nunca antes— y la caché de cada figura está
     indexada por semilla, con lo que un redibujo por tema no vuelve a
     simular.

   COLORES DE SERIE
     Los pares de tokens de cada figura se eligieron para que contrasten en
     los TRES temas, no solo en pergamino: en laurel --u1 y --primary son casi
     el mismo verde oscuro (igual que --good y --primary), y en claustro
     --accent y --bad son casi el mismo salmón. Por eso las series que deben
     distinguirse entre sí usan tokens de familias distintas —--u2 (azul),
     --u3 (violeta), --u5 (magenta)— y, cuando comparten panel, además trazos
     discontinuos distintos. No se escriben colores fijos en ningún caso.
   ============================================================ */
(function () {
  "use strict";

  var A = window.App;
  if (!A || typeof A.registerFigure !== "function") return;
  var M = window.M || {};

  // ---------------- estadísticos de muestra ----------------

  function asc(a, b) { return a - b; }
  function sortedCopy(xs) { return xs.slice().sort(asc); }

  function mean(xs) {
    var s = 0, i;
    for (i = 0; i < xs.length; i++) s += xs[i];
    return s / xs.length;
  }
  function sd(xs) {                       // desvío MUESTRAL (divide por n-1)
    var m = mean(xs), s = 0, i;
    for (i = 0; i < xs.length; i++) s += (xs[i] - m) * (xs[i] - m);
    return Math.sqrt(s / (xs.length - 1));
  }
  function centralMoment(xs, p) {
    var m = mean(xs), s = 0, i;
    for (i = 0; i < xs.length; i++) s += Math.pow(xs[i] - m, p);
    return s / xs.length;
  }
  // γ = Σ(x−x̄)³ / (n s³), con s muestral — la fórmula de asimetria-y-curtosis.md
  function skew(xs) { return centralMoment(xs, 3) / Math.pow(sd(xs), 3); }

  // Cuartiles/percentiles: ver la nota de convención en la cabecera.
  function quantile(sorted, p) {
    var n = sorted.length;
    if (!n) return NaN;
    if (p <= 0) return sorted[0];
    if (p >= 1) return sorted[n - 1];
    if (Math.abs(p - 0.5) < 1e-12 && n % 2 === 1) return sorted[(n - 1) / 2];
    var h = p * n, k = Math.floor(h), f = h - k;
    if (f < 1e-9) {                       // h entero → promedio de las contiguas
      if (k < 1) return sorted[0];
      if (k >= n) return sorted[n - 1];
      return (sorted[k - 1] + sorted[k]) / 2;
    }
    if (k < 1) return sorted[0];
    if (k >= n) return sorted[n - 1];
    return sorted[k - 1] + f * (sorted[k] - sorted[k - 1]);
  }

  function histogram(data, lo, hi, nbins) {
    var counts = [], i, b, w = (hi - lo) / nbins;
    for (i = 0; i < nbins; i++) counts.push(0);
    for (i = 0; i < data.length; i++) {
      b = Math.floor((data[i] - lo) / w);
      if (b < 0) b = 0;
      if (b >= nbins) b = nbins - 1;
      counts[b] += 1;
    }
    return { counts: counts, w: w, lo: lo, hi: hi, n: data.length };
  }
  function histBars(h, scaleY) {
    var out = [], i;
    for (i = 0; i < h.counts.length; i++) {
      out.push({ x: h.lo + (i + 0.5) * h.w, y: scaleY ? scaleY(h.counts[i]) : h.counts[i] });
    }
    return out;
  }

  // Eje horizontal suelto (línea + marcas + rótulos), para las figuras que no
  // usan un par de escalas completo y por eso no pueden apoyarse en Fig.axes.
  function xAxis(F, layer, sx, y, opts) {
    opts = opts || {};
    var r = sx.range(), d = sx.domain();
    var cAxis = F.color("plot-axis"), cTxt = F.color("text-3");
    // El mobiliario del eje va en un grupo .fig-axes: es recesivo y no compite
    // con el trazo de dato (que es siempre de 2 px).
    var g = F.el("g", { "class": "fig-axes" }, layer);
    F.line(g, [[r[0], y], [r[1], y]], { stroke: cAxis, width: 1.2, serie: false });
    var ticks = opts.ticks || F.ticks(d[0], d[1], opts.count || 7);
    ticks.forEach(function (v) {
      if (v < Math.min(d[0], d[1]) || v > Math.max(d[0], d[1])) return;
      var px = sx(v);
      F.line(g, [[px, y], [px, y + 4]], { stroke: cAxis, width: 1, serie: false });
      F.text(g, px, y + 8, opts.fmt ? opts.fmt(v) : String(Math.round(v * 1000) / 1000), {
        size: 11, anchor: "middle", baseline: "hanging", fill: cTxt, mono: true
      });
    });
    if (opts.label) {
      F.text(g, (r[0] + r[1]) / 2, y + 28, opts.label, {
        size: 12, anchor: "middle", baseline: "hanging", fill: cTxt
      });
    }
  }

  // ============================================================
  //  1. Bigotes vs. límites de Tukey   (boxplot.md)
  // ============================================================

  // Muestra fija de 14 valores; el decimoquinto lo mueve el usuario.
  var TUKEY_BASE = [12, 15, 17, 18, 20, 21, 22, 24, 25, 27, 28, 30, 31, 34];

  A.registerFigure("u1-bigotes-vs-limites-de-tukey", function (host, api) {
    var F = api.Fig;
    var W = 680, H = 300;
    var pad = { l: 34, r: 26 };
    var Y_FENCE_TOP = 52, Y_BOX0 = 74, Y_BOX1 = 130, Y_MID = 102;
    var Y_PTS = 172, Y_AXIS = 226;

    var svg = F.svg(host, {
      w: W, h: H,
      title: "Boxplot con las vallas de Tukey y el bigote apoyado en el dato real"
    });

    var ctl = F.controls(host, [
      { k: "xmax", label: "dato más grande", min: 34, max: 72, step: 0.5, value: 52, dec: 1 }
    ], function () { redraw(); });

    var sel = F.select(host, {
      k: "factor", label: "margen",
      options: [
        { v: "1", label: "1.0 · IQR" },
        { v: "1.5", label: "1.5 · IQR (Tukey)" },
        { v: "3", label: "3.0 · IQR (severo)" }
      ],
      value: "1.5"
    }, function () { redraw(); });

    var out = F.readouts(host, [
      { k: "q", tex: "q_1,\\ q_2,\\ q_3" },
      { k: "iqr", tex: "\\mathrm{IQR}" },
      { k: "uw", tex: "U_W" },
      { k: "big", label: "bigote superior" },
      { k: "nout", label: "outliers" }
    ]);

    F.legend(host, [
      { label: "caja q₁–q₃ y mediana", color: F.series(1) },
      { label: "datos dentro de las vallas", color: F.series(2), fill: true },
      { label: "outliers", color: F.series(3), fill: true },
      { label: "vallas de Tukey", color: F.series(4), dash: true }
    ]);

    var layer = F.el("g", null, svg);
    var sx = F.scale([-6, 78], [pad.l + 20, W - pad.r]);

    // Zona de arrastre PERSISTENTE: se crea una sola vez y sobrevive a los
    // redibujos, así el puntero no pierde la captura al soltar y recrear el
    // marcador. Arrastrar en la banda de los puntos mueve el dato más grande.
    var hit = F.el("rect", {
      x: sx.range()[0], y: Y_PTS - 22, width: sx.range()[1] - sx.range()[0], height: 44,
      fill: "transparent"
    }, svg);
    var stopDrag = F.drag(hit, {
      onDrag: function (px) {
        var v = Math.round(sx.invert(px) * 2) / 2;
        v = Math.max(34, Math.min(72, v));
        ctl.set("xmax", v);
        redraw();
      }
    });
    api.cleanup(stopDrag);

    function redraw() {
      while (layer.firstChild) layer.removeChild(layer.firstChild);

      var kf = parseFloat(sel.get()) || 1.5;
      var xm = ctl.get("xmax");
      var s = sortedCopy(TUKEY_BASE.concat([xm]));
      var q1 = quantile(s, 0.25), q2 = quantile(s, 0.5), q3 = quantile(s, 0.75);
      var iqr = q3 - q1;
      var lw = q1 - kf * iqr, uw = q3 + kf * iqr;

      // Bigote = dato REAL más extremo que sigue dentro de [L_W, U_W].
      var loW = s[0], hiW = s[s.length - 1], i;
      for (i = 0; i < s.length; i++) { if (s[i] >= lw) { loW = s[i]; break; } }
      for (i = s.length - 1; i >= 0; i--) { if (s[i] <= uw) { hiW = s[i]; break; } }
      var nOut = 0;
      for (i = 0; i < s.length; i++) if (s[i] < lw || s[i] > uw) nOut++;

      var cP = F.series(1), cWarn = F.series(4), cBad = F.series(3);
      var cU1 = F.series(2), cTxt = F.color("text-3");

      // vallas
      [[lw, "valla inf."], [uw, "valla sup."]].forEach(function (p) {
        var d = sx.domain();
        if (p[0] < d[0] || p[0] > d[1]) return;
        F.vline(layer, sx(p[0]), {
          y0: Y_FENCE_TOP, y1: Y_PTS + 22, stroke: cWarn, dash: "5 4"
        });
        F.label(layer, sx(p[0]), Y_FENCE_TOP - 7, p[1] + " = " + F.fmt(p[0], 2), {
          size: 11.5, anchor: "middle", mono: true, keyColor: cWarn
        });
      });

      // bigotes (hasta el dato real, no hasta la valla)
      [[q1, loW], [q3, hiW]].forEach(function (p) {
        F.line(layer, [[sx(p[0]), Y_MID], [sx(p[1]), Y_MID]], { stroke: cP, width: 2, serie: false });
        F.line(layer, [[sx(p[1]), Y_BOX0 + 10], [sx(p[1]), Y_BOX1 - 10]], { stroke: cP, width: 2, serie: false });
      });

      // caja y mediana
      F.el("rect", {
        x: sx(q1), y: Y_BOX0, width: Math.max(1, sx(q3) - sx(q1)), height: Y_BOX1 - Y_BOX0,
        rx: 3, fill: cP, "fill-opacity": 0.14, stroke: cP, "stroke-width": 1.6
      }, layer);
      F.line(layer, [[sx(q2), Y_BOX0], [sx(q2), Y_BOX1]], { stroke: cP, width: 2, serie: "caja" });
      F.label(layer, sx(q2), Y_BOX0 - 7, "mediana", { size: 11, anchor: "middle", keyColor: cP });

      // datos
      for (i = 0; i < s.length; i++) {
        var esOut = s[i] < lw || s[i] > uw;
        var esMovil = Math.abs(s[i] - xm) < 1e-9;
        F.marker(layer, sx(s[i]), Y_PTS, {
          r: esMovil ? 6 : 4.4,
          fill: esOut ? cBad : cU1,
          stroke: F.color("surface"),
          strokeWidth: 2,
          serie: esOut ? "outlier" : "dato"
        });
      }
      F.text(layer, sx(xm), Y_PTS + 16, "dato móvil", {
        size: 11, anchor: "middle", baseline: "hanging", fill: cTxt
      });

      // marca del bigote superior, para leer que se apoya en un dato
      F.vline(layer, sx(hiW), { y0: Y_MID, y1: Y_PTS - 8, stroke: cP, dash: "2 3" });

      xAxis(F, layer, sx, Y_AXIS, { count: 8, label: "valor observado" });

      out.set("q", F.fmt(q1, 2) + " · " + F.fmt(q2, 2) + " · " + F.fmt(q3, 2));
      out.set("iqr", F.fmt(iqr, 2));
      out.set("uw", F.fmt(uw, 2));
      out.set("big", F.fmt(hiW, 2));
      out.set("nout", String(nOut));
    }

    redraw();
  }, {
    titulo: "Bigotes vs. límites de Tukey", title: "Bigotes vs. límites de Tukey",
    page: "boxplot", kind: "interactive", unidad: "1"
  });

  // ============================================================
  //  2. Lectura del cuartil sobre la ojiva
  //     (tecnica-datos-agrupados-interpolacion.md)
  // ============================================================

  var OJIVA_DS = {
    llamadas: {
      label: "1000 llamadas (TP1 ej. 4)",
      edges: [15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315],
      f: [6, 28, 88, 180, 247, 260, 133, 42, 11, 5],
      unidad: "s", dec: 2, xLabel: "duración de la llamada (segundos)"
    },
    bebes: {
      label: "100 recién nacidos (TP1 ej. 5)",
      edges: [2.6, 2.8, 3.0, 3.2, 3.4, 3.6, 3.8, 4.0, 4.2, 4.4, 4.6],
      f: [2, 3, 14, 10, 15, 18, 16, 14, 4, 4],
      unidad: "kg", dec: 4, xLabel: "peso al nacer (kg)"
    }
  };

  function ojivaPrep(ds) {
    if (ds.__prep) return ds;
    var F = [], acc = 0, i;
    for (i = 0; i < ds.f.length; i++) { acc += ds.f[i]; F.push(acc); }
    ds.F = F; ds.n = acc; ds.__prep = true;
    return ds;
  }

  // Texto con halo del color del fondo: sirve para los rótulos que caen sobre
  // una curva o sobre los ticks del eje (figures.css ya fija paint-order).
  function haloText(F, layer, x, y, str, o) {
    o = o || {};
    var t = F.text(layer, x, y, str, o);
    t.style.paintOrder = "stroke fill";
    t.style.stroke = F.color("surface");
    t.style.strokeWidth = (o.halo == null ? 3 : o.halo) + "px";
    t.style.strokeLinejoin = "round";
    return t;
  }

  A.registerFigure("u1-lectura-del-cuartil-sobre-la-ojiva", function (host, api) {
    var F = api.Fig;
    var W = 680, H = 380;
    var pad = { l: 62, r: 26, t: 26, b: 60 };

    var svg = F.svg(host, {
      w: W, h: H,
      title: "Polígono de frecuencias acumuladas con la lectura interpolada del cuartil"
    });

    var ctl = F.controls(host, [
      {
        k: "p", label: "fracción acumulada p", min: 0, max: 100, step: 0.5, value: 50,
        fmt: function (v) { return F.fmt(v, 1) + " %"; }
      }
    ], function () { redraw(); });

    var sel = F.select(host, {
      k: "ds", label: "tabla",
      options: [
        { v: "llamadas", label: OJIVA_DS.llamadas.label },
        { v: "bebes", label: OJIVA_DS.bebes.label }
      ],
      value: "llamadas"
    }, function () { redraw(); });

    var out = F.readouts(host, [
      { k: "val", tex: "q_p" },
      { k: "int", label: "intervalo" },
      { k: "frac", tex: "\\dfrac{p\\,n - F_{i-1}}{f_i}" },
      { k: "fs", tex: "F_{i-1},\\ f_i" }
    ]);

    F.legend(host, [
      { label: "acumulada por intervalo", color: F.series(1), fill: true },
      { label: "polígono acumulado (ojiva)", color: F.series(2) },
      { label: "lectura interpolada", color: F.series(3), dash: true }
    ]);

    var layer = F.el("g", null, svg);

    function redraw() {
      while (layer.firstChild) layer.removeChild(layer.firstChild);

      var ds = ojivaPrep(OJIVA_DS[sel.get()] || OJIVA_DS.llamadas);
      var p = ctl.get("p") / 100;
      var L = ds.f.length;
      var sx = F.scale([ds.edges[0], ds.edges[L]], [pad.l, W - pad.r]);
      var sy = F.scale([0, 1], [H - pad.b, pad.t]);

      F.axes(layer, {
        sx: sx, sy: sy, xTicks: ds.edges, yTicks: 5, grid: true, gridX: false, y0: 0,
        xLabel: ds.xLabel, yLabel: "frecuencia relativa acumulada"
      });

      var cU1 = F.series(1), cP = F.series(2), cA = F.series(3);
      var cTxt = F.color("text-3");

      // barras de la acumulada por intervalo
      var barras = [], i;
      for (i = 0; i < L; i++) {
        barras.push({ x: (ds.edges[i] + ds.edges[i + 1]) / 2, y: ds.F[i] / ds.n });
      }
      // El grosor de barra se topa en 24 px: el sobrante de la banda queda
      // como aire entre columnas.
      var pxU = Math.abs(sx(1) - sx(0));
      F.bars(layer, barras, sx, sy, {
        fill: cU1, width: Math.min(ds.edges[1] - ds.edges[0], 26 / pxU),
        serie: "acumulada por intervalo"
      });

      // ojiva
      var pts = [[ds.edges[0], 0]];
      for (i = 0; i < L; i++) pts.push([ds.edges[i + 1], ds.F[i] / ds.n]);
      F.line(layer, pts, { stroke: cP, width: 2, sx: sx, sy: sy, serie: "ojiva" });
      pts.forEach(function (q) {
        F.marker(layer, sx(q[0]), sy(q[1]), { r: 4.6, fill: cP, serie: false });
      });

      // intervalo donde cae el cruce
      var target = p * ds.n;
      var idx = 0;
      while (idx < L - 1 && (ds.F[idx] < target || ds.f[idx] === 0)) idx++;
      var Fprev = idx === 0 ? 0 : ds.F[idx - 1];
      var fi = ds.f[idx];
      var Li = ds.edges[idx], Lsi = ds.edges[idx + 1];
      var frac = fi > 0 ? (target - Fprev) / fi : 0;
      var val = Li + frac * (Lsi - Li);
      if (p <= 0) { val = ds.edges[0]; frac = 0; }
      if (p >= 1) { val = ds.edges[L]; frac = 1; }

      // segmento resaltado del intervalo
      F.line(layer, [[Li, Fprev / ds.n], [Lsi, ds.F[idx] / ds.n]], {
        stroke: cA, width: 2, sx: sx, sy: sy, serie: "intervalo de la lectura"
      });

      // horizontal en p y vertical hasta el eje
      F.hline(layer, sy(p), { x0: pad.l, x1: sx(val), stroke: cA, dash: "5 4" });
      F.vline(layer, sx(val), { y0: sy(p), y1: sy(0), stroke: cA, dash: "5 4" });
      F.marker(layer, sx(val), sy(p), { r: 5, fill: cA, serie: "lectura" });
      // con p muy chico la horizontal se pega al eje x y este rótulo chocaría
      // con el del valor leído: se lo sube por encima de aquel.
      var yP = (sy(0) - sy(p) < 18) ? sy(0) - 26 : sy(p) - 7;
      haloText(F, layer, pad.l + 7, yP, "p = " + F.fmt(p * 100, 1) + " %", {
        size: 11, anchor: "start", fill: cTxt, mono: true
      });
      var derecha = sx(val) < W - pad.r - 90;
      F.label(layer, sx(val) + (derecha ? 7 : -7), sy(0) - 8,
        F.fmt(val, ds.dec) + " " + ds.unidad, {
          size: 11.5, anchor: derecha ? "start" : "end", mono: true, weight: 600, keyColor: cA
        });

      // Rótulos del intervalo interpolado: los dos de la izquierda por DEBAJO
      // del extremo izquierdo del segmento y los dos de la derecha por ENCIMA
      // del derecho, que es donde queda espacio libre en cualquier posición.
      // Llevan halo porque la ojiva pasa justo por ahí en muchas posiciones.
      // En los extremos del deslizador (p = 0 o p = 1) el valor está fijado por
      // código al borde de la tabla y los cuatro rótulos se apilarían sobre el
      // mismo punto: ahí no aportan nada y no se dibujan.
      if (p > 0 && p < 1) {
        var izqFuera = sx(Li) - 6 > pad.l + 74;   // ¿entra el rótulo a la izquierda?
        var xIzq = sx(Li) + (izqFuera ? -6 : 6), aIzq = izqFuera ? "end" : "start";
        // si el extremo izquierdo cae sobre el eje, el par baja por debajo de
        // los ticks en vez de escribirse encima de ellos.
        var yI1 = sy(Fprev / ds.n) + 16;
        if (sy(0) - sy(Fprev / ds.n) < 20) yI1 = sy(0) + 34;
        haloText(F, layer, xIzq, yI1, "Lᵢ = " + Li, {
          size: 11, anchor: aIzq, fill: cTxt, mono: true, halo: 4.5
        });
        haloText(F, layer, xIzq, yI1 + 14, "Fᵢ₋₁ = " + Fprev, {
          size: 11, anchor: aIzq, fill: cTxt, mono: true, halo: 4.5
        });
        // el par de la derecha se mantiene siempre a cierta altura sobre el eje
        // (si no, con F_i chico se apila con los rótulos de p y del valor), y
        // arriba del todo no hay lugar para los dos renglones: pasan abajo.
        var yDer = sy(ds.F[idx] / ds.n);
        var yD1 = Math.min(yDer - 26, sy(0) - 52), yD2 = yD1 + 15;
        // si tampoco entra arriba, el par baja: se apila DEBAJO del par izquierdo
        // (los dos extremos están casi a la misma altura y si no se pisarían).
        if (yD1 < pad.t + 4) { yD1 = Math.min(yI1 + 32, H - 22); yD2 = yD1 + 15; }
        haloText(F, layer, sx(Lsi) - 6, yD1, "Lₛᵢ = " + Lsi, {
          size: 11, anchor: "end", fill: cTxt, mono: true, halo: 4.5
        });
        haloText(F, layer, sx(Lsi) - 6, yD2, "Fᵢ = " + ds.F[idx], {
          size: 11, anchor: "end", fill: cTxt, mono: true, halo: 4.5
        });
      }

      out.set("val", F.fmt(val, ds.dec) + " " + ds.unidad);
      out.set("int", "(" + Li + ", " + Lsi + "]");
      out.set("frac", F.fmt(frac, 4));
      out.set("fs", Fprev + " · " + fi);
    }

    redraw();
  }, {
    titulo: "Lectura del cuartil sobre la ojiva", title: "Lectura del cuartil sobre la ojiva",
    page: "tecnica-datos-agrupados-interpolacion", kind: "interactive", unidad: "1"
  });

  // ============================================================
  //  3. Balanza: media contra mediana   (medidas-de-tendencia-central.md)
  // ============================================================

  var BALANZA = {
    alturas: {
      etiqueta: "alturas (cm)", base: [150, 160, 170, 180], k: "xAlturas",
      label: "dato más grande (cm)", min: 190, max: 290, step: 1, value: 230,
      dom: [138, 302], dec: 2, unidad: "cm"
    },
    ingresos: {
      etiqueta: "ingresos (US$)", base: [1, 1, 2], k: "xIngresos",
      label: "ingreso más alto (US$)", min: 10, max: 200, step: 1, value: 100,
      dom: [-8, 214], dec: 2, unidad: "US$"
    }
  };

  A.registerFigure("u1-balanza-media-contra-mediana", function (host, api) {
    var F = api.Fig;
    var W = 660, H = 300;
    var pad = { l: 34, r: 30 };
    var Y_BEAM = 152, Y_AXIS = 250;

    var svg = F.svg(host, {
      w: W, h: H,
      title: "Los datos sobre una recta, con la media como fulcro y la mediana como corte"
    });

    var cual = api.state.conjunto === "ingresos" ? "ingresos" : "alturas";
    var cfg = BALANZA[cual];

    F.select(host, {
      k: "conjunto", label: "conjunto",
      options: [
        { v: "alturas", label: BALANZA.alturas.etiqueta },
        { v: "ingresos", label: BALANZA.ingresos.etiqueta }
      ],
      value: cual
    }, function () { api.setState({}); });

    var ctl = F.controls(host, [
      {
        k: cfg.k, label: cfg.label, min: cfg.min, max: cfg.max,
        step: cfg.step, value: cfg.value, dec: 0
      }
    ], function () { redraw(); });

    var out = F.readouts(host, [
      { k: "media", tex: "\\bar x" },
      { k: "mediana", label: "mediana" },
      { k: "suma", tex: "\\sum (x_i - \\bar x)" },
      { k: "lados", label: "datos a cada lado" }
    ]);

    F.legend(host, [
      { label: "datos", color: F.series(1), fill: true },
      { label: "media (fulcro de la balanza)", color: F.series(2) },
      { label: "mediana", color: F.series(3), dash: true },
      { label: "brazos de palanca", color: F.series(4) }
    ]);

    var layer = F.el("g", null, svg);
    var sx = F.scale(cfg.dom, [pad.l, W - pad.r]);

    function redraw() {
      while (layer.firstChild) layer.removeChild(layer.firstChild);

      var datos = cfg.base.concat([ctl.get(cfg.k)]);
      var s = sortedCopy(datos);
      var m = mean(s), med = quantile(s, 0.5);
      var suma = 0, izq = 0, der = 0, i;
      for (i = 0; i < s.length; i++) {
        suma += s[i] - m;
        if (s[i] < med) izq++;
        else if (s[i] > med) der++;
      }

      var cU1 = F.series(1), cA = F.series(2), cG = F.series(3);
      // Un solo color para los brazos: el signo del desvío ya se lee por el
      // lado del fulcro en que cae cada renglón, no hace falta un segundo tono.
      var cB = F.series(4), cTxt = F.color("text-3");

      // brazos de palanca: un renglón por dato, desde la media hasta el dato
      for (i = 0; i < s.length; i++) {
        var yArm = 100 + i * 9;
        F.line(layer, [[sx(m), yArm], [sx(s[i]), yArm]], {
          stroke: cB, width: 2, serie: "brazo de palanca"
        });
      }

      // viga con los datos
      F.line(layer, [[sx(cfg.dom[0]), Y_BEAM], [sx(cfg.dom[1]), Y_BEAM]], {
        stroke: F.color("plot-axis"), width: 2, serie: false
      });
      for (i = 0; i < s.length; i++) {
        F.marker(layer, sx(s[i]), Y_BEAM, { r: 6, fill: cU1, serie: "dato" });
      }

      // fulcro en la media
      var mx = sx(m);
      F.path(layer, "M" + mx + " " + (Y_BEAM + 6) + "L" + (mx - 13) + " " + (Y_BEAM + 34) +
        "L" + (mx + 13) + " " + (Y_BEAM + 34) + "Z", { fill: cA, opacity: 0.9 });
      F.label(layer, mx, Y_BEAM + 50, "media = " + F.fmt(m, cfg.dec), {
        size: 12, anchor: "middle", baseline: "hanging", mono: true, weight: 600, keyColor: cA
      });

      // mediana
      F.vline(layer, sx(med), { y0: 50, y1: Y_BEAM, stroke: cG, dash: "5 4" });
      F.label(layer, sx(med), 42, "mediana = " + F.fmt(med, cfg.dec), {
        size: 12, anchor: "middle", mono: true, weight: 600, keyColor: cG
      });
      // Con la mediana pegada al borde izquierdo (conjunto «ingresos») el
      // contador de la izquierda no entra y se cortaba: en ese caso los dos
      // pasan a la derecha de la mediana, en dos renglones.
      var txtIzq = izq + " a la izquierda", txtDer = der + " a la derecha";
      if (sx(med) - 8 - txtIzq.length * 5.9 < 2) {
        F.text(layer, sx(med) + 8, 64, txtIzq, { size: 11, anchor: "start", fill: cTxt });
        F.text(layer, sx(med) + 8, 78, txtDer, { size: 11, anchor: "start", fill: cTxt });
      } else {
        F.text(layer, sx(med) - 8, 64, txtIzq, { size: 11, anchor: "end", fill: cTxt });
        F.text(layer, sx(med) + 8, 64, txtDer, { size: 11, anchor: "start", fill: cTxt });
      }

      xAxis(F, layer, sx, Y_AXIS, { count: 8, label: cfg.etiqueta });

      out.set("media", F.fmt(m, cfg.dec));
      out.set("mediana", F.fmt(med, cfg.dec));
      out.set("suma", F.fmt(Math.abs(suma) < 1e-9 ? 0 : suma, 4));
      out.set("lados", izq + " / " + der);
    }

    redraw();
  }, {
    titulo: "Balanza: media contra mediana", title: "Balanza: media contra mediana",
    page: "medidas-de-tendencia-central", kind: "interactive", unidad: "1"
  });

  // ============================================================
  //  4. Paridad de n y la mediana   (medidas-de-tendencia-central.md)
  // ============================================================

  var PAR_SEED = 20260117;
  var parCache = null;
  function paridadDatos(F, seed) {
    if (parCache && parCache.seed === seed) return parCache.xs;
    var u = F.rng(seed), xs = [], i;
    for (i = 0; i < 61; i++) xs.push(Math.round(u.normal(40, 4.3) * 1000) / 1000);
    xs.sort(asc);
    parCache = { seed: seed, xs: xs };
    return xs;
  }

  A.registerFigure("u1-paridad-de-n-y-la-mediana", function (host, api) {
    var F = api.Fig;
    var W = 660, H = 320;
    var pad = { l: 56, r: 22, t: 34, b: 52 };

    var svg = F.svg(host, {
      w: W, h: H,
      title: "Muestra ordenada y posición de corte de la mediana según la paridad de n"
    });

    var sel = F.select(host, {
      k: "caso", label: "caso",
      options: [
        { v: "impar", label: "n = 61 (impar)" },
        { v: "par30", label: "n = 60, posición 30" },
        { v: "par31", label: "n = 60, posición 31" },
        { v: "parprom", label: "n = 60, promedio de 30 y 31" }
      ],
      value: "impar"
    }, function () { redraw(); });

    F.buttons(host, [{
      label: "Nueva realización",
      title: "vuelve a sortear las 61 observaciones con otra semilla",
      onClick: function () {
        api.state.seed = (api.state.seed == null ? PAR_SEED : api.state.seed) + 1;
        redraw();
      }
    }]);

    var out = F.readouts(host, [
      { k: "n", label: "n" },
      { k: "pos", label: "posición de corte" },
      { k: "med", label: "mediana" },
      { k: "lados", label: "datos a cada lado" }
    ]);

    F.legend(host, [
      { label: "muestra ordenada", color: F.series(1), fill: true },
      { label: "observación central", color: F.series(2), fill: true },
      { label: "corte", color: F.series(3), dash: true },
      { label: "mediana", color: F.series(4), dash: true }
    ]);

    var layer = F.el("g", null, svg);

    function redraw() {
      while (layer.firstChild) layer.removeChild(layer.firstChild);

      var todos = paridadDatos(F, api.state.seed == null ? PAR_SEED : api.state.seed);
      var caso = sel.get();
      var impar = caso === "impar";
      var xs = impar ? todos : todos.slice(0, 60);
      var n = xs.length;

      var pos, med, izq, der, destacados;
      if (impar) {
        pos = 31; med = xs[30]; izq = 30; der = 30; destacados = [31];
      } else if (caso === "par30") {
        pos = 30; med = xs[29]; izq = 29; der = 30; destacados = [30];
      } else if (caso === "par31") {
        pos = 31; med = xs[30]; izq = 30; der = 29; destacados = [31];
      } else {
        pos = 30.5; med = (xs[29] + xs[30]) / 2; izq = 30; der = 30; destacados = [30, 31];
      }

      var sx = F.scale([0.5, n + 0.5], [pad.l, W - pad.r]);
      var lo = Math.floor(xs[0]) - 1, hi = Math.ceil(xs[n - 1]) + 1;
      var sy = F.scale([lo, hi], [H - pad.b, pad.t]);

      F.axes(layer, {
        sx: sx, sy: sy, xTicks: [1, 10, 20, 30, 40, 50, 60], yTicks: 5, grid: true, y0: lo,
        xLabel: "posición i en la muestra ordenada", yLabel: "valor"
      });

      // La observación central va en --u3 (violeta) y no en --primary: en
      // laurel --primary es el mismo verde oscuro que --u1 y el punto
      // destacado se perdía entre los de la muestra.
      var cU1 = F.series(1), cDest = F.series(2), cA = F.series(3);
      var cG = F.series(4), cTxt = F.color("text-3");

      F.vline(layer, sx(pos), { y0: pad.t - 12, y1: H - pad.b, stroke: cA, dash: "5 4" });
      F.hline(layer, sy(med), { x0: pad.l, x1: W - pad.r, stroke: cG, dash: "5 4" });

      var i;
      for (i = 0; i < n; i++) {
        var dest = destacados.indexOf(i + 1) >= 0;
        F.marker(layer, sx(i + 1), sy(xs[i]), {
          r: dest ? 6 : 4.2, fill: dest ? cDest : cU1,
          serie: dest ? "observación central" : "muestra ordenada"
        });
      }

      F.text(layer, sx(pos) - 10, pad.t - 16, izq + " datos", {
        size: 11.5, anchor: "end", fill: cTxt
      });
      F.text(layer, sx(pos) + 10, pad.t - 16, der + " datos", {
        size: 11.5, anchor: "start", fill: cTxt
      });
      F.label(layer, W - pad.r, sy(med) - 7, "mediana = " + F.fmt(med, 3), {
        size: 11.5, anchor: "end", mono: true, keyColor: cG
      });

      out.set("n", String(n));
      out.set("pos", pos === Math.floor(pos) ? String(pos) : "30 y 31");
      out.set("med", F.fmt(med, 5));
      out.set("lados", izq + " / " + der);
    }

    redraw();
  }, {
    titulo: "Paridad de n y la mediana", title: "Paridad de n y la mediana",
    page: "medidas-de-tendencia-central", kind: "interactive", unidad: "1"
  });

  // ============================================================
  //  5. Tres formas y el orden media-mediana   (asimetria-y-curtosis.md)
  // ============================================================

  // Muestras deterministas por cuantiles de una Gamma(a,1): x_i = Q((i-½)/n).
  // Q se obtiene de chi2Inv porque Gamma(a,1) = χ²(2a)/2. Las formas a se
  // eligieron para que la asimetría EMPÍRICA de la muestra dibujada caiga sobre
  // los tres valores de la teórica (1.898, −1.505, 0.306); el valor que se
  // muestra en pantalla es siempre el calculado sobre los datos.
  var formasCache = null;
  function formasDatos() {
    if (formasCache) return formasCache;
    var n = 240;
    function q(p, a) { return M.chi2Inv(p, 2 * a) / 2; }
    function muestra(a, signo) {
      var xs = [], i;
      for (i = 0; i < n; i++) xs.push(signo * q((i + 0.5) / n, a));
      var m = mean(xs), s = sd(xs);
      return xs.map(function (v) { return (v - m) / s; }).sort(asc);
    }
    formasCache = [
      { titulo: "cola larga a la derecha", z: muestra(0.95, 1) },
      { titulo: "cola larga a la izquierda", z: muestra(1.545, -1) },
      { titulo: "aproximadamente simétrica", z: muestra(39, 1) }
    ];
    formasCache.forEach(function (d) {
      d.g = skew(d.z);
      d.media = mean(d.z);
      d.mediana = quantile(d.z, 0.5);
    });
    return formasCache;
  }

  A.registerFigure("u1-tres-formas-y-el-orden-media-mediana", function (host, api) {
    var F = api.Fig;
    var W = 690, H = 310;
    var pad = { l: 62, r: 14, t: 50, b: 52 };
    var GAP = 26, NBINS = 36, X0 = -5.2, X1 = 5.6;

    var svg = F.svg(host, {
      w: W, h: H,
      title: "Tres histogramas en la misma escala con la media y la mediana marcadas"
    });

    var out = F.readouts(host, [
      { k: "d1", label: "cola a derecha: mediana − media" },
      { k: "d2", label: "cola a izquierda: mediana − media" },
      { k: "d3", label: "simétrica: mediana − media" }
    ]);

    F.legend(host, [
      { label: "frecuencia", color: F.series(1), fill: true },
      { label: "cola larga", color: F.series(2), fill: true },
      { label: "media", color: F.series(3), dash: true },
      { label: "mediana", color: F.series(4), dash: true }
    ]);

    var layer = F.el("g", null, svg);
    var datos = formasDatos();

    var hists = datos.map(function (d) { return histogram(d.z, X0, X1, NBINS); });
    var ymax = 0;
    hists.forEach(function (h) {
      h.counts.forEach(function (c) { if (c / h.n > ymax) ymax = c / h.n; });
    });
    ymax *= 1.16;

    var colW = (W - pad.l - pad.r - 2 * GAP) / 3;
    var sy = F.scale([0, ymax], [H - pad.b, pad.t]);
    // media en --u5 (magenta) y mediana en --u2 (azul): en laurel --good y
    // --primary son dos verdes casi iguales y las dos rectas se confundían.
    // Además llevan trazos discontinuos distintos, para el caso simétrico en
    // que quedan casi superpuestas.
    var cU1 = F.series(1), cA = F.series(2), cMedia = F.series(3);
    var cMediana = F.series(4), cTxt = F.color("text-3"), cTxt2 = F.color("text-2");

    // Todo el mobiliario de eje —rejilla, líneas de base y marcas— vive en un
    // grupo .fig-axes: es recesivo y queda por debajo de las barras.
    var ejes = F.el("g", { "class": "fig-axes" }, layer);

    // eje vertical único, a la izquierda
    F.ticks(0, ymax, 4).forEach(function (v) {
      if (v > ymax) return;
      F.line(ejes, [[pad.l - 6, sy(v)], [W - pad.r, sy(v)]], {
        stroke: F.color("plot-grid"), width: 1, serie: false
      });
      F.text(ejes, pad.l - 9, sy(v), F.fmt(v, 2), {
        size: 11, anchor: "end", baseline: "middle", fill: cTxt, mono: true
      });
    });
    F.text(layer, 13, (pad.t + H - pad.b) / 2, "frecuencia relativa", {
      size: 12, anchor: "middle", fill: cTxt, rotate: -90
    });

    datos.forEach(function (d, j) {
      var x0 = pad.l + j * (colW + GAP);
      var sx = F.scale([X0, X1], [x0, x0 + colW]);
      var h = hists[j];
      var signo = d.g >= 0 ? 1 : -1;

      var barras = h.counts.map(function (c, i) {
        var centro = X0 + (i + 0.5) * h.w;
        var cola = Math.abs(d.g) > 0.6 && signo * centro > 2;
        return { x: centro, y: c / h.n, fill: cola ? cA : cU1 };
      });
      F.bars(layer, barras, sx, sy, { width: h.w, serie: d.titulo });

      F.line(ejes, [[x0, sy(0)], [x0 + colW, sy(0)]], {
        stroke: F.color("plot-axis"), width: 1.2, serie: false
      });
      [-4, 0, 4].forEach(function (v) {
        F.line(ejes, [[sx(v), sy(0)], [sx(v), sy(0) + 4]], {
          stroke: F.color("plot-axis"), width: 1, serie: false
        });
        F.text(ejes, sx(v), sy(0) + 8, String(v), {
          size: 11, anchor: "middle", baseline: "hanging", fill: cTxt, mono: true
        });
      });

      F.vline(layer, sx(d.media), { y0: pad.t, y1: sy(0), stroke: cMedia, dash: "7 3" });
      F.vline(layer, sx(d.mediana), { y0: pad.t, y1: sy(0), stroke: cMediana, dash: "2 3" });

      F.text(layer, x0 + colW / 2, pad.t - 30, d.titulo, {
        size: 12, anchor: "middle", fill: cTxt2, weight: 600
      });
      F.text(layer, x0 + colW / 2, pad.t - 13, "γ = " + F.fmt(d.g, 3), {
        size: 12, anchor: "middle", fill: cTxt2, mono: true, weight: 600
      });
    });

    F.text(layer, (pad.l + W - pad.r) / 2, H - pad.b + 26, "valor estandarizado (x − media) / s", {
      size: 12, anchor: "middle", baseline: "hanging", fill: cTxt
    });

    out.set("d1", F.fmt(datos[0].mediana - datos[0].media, 3));
    out.set("d2", F.fmt(datos[1].mediana - datos[1].media, 3));
    out.set("d3", F.fmt(datos[2].mediana - datos[2].media, 3));
  }, {
    titulo: "Tres formas y el orden media-mediana",
    title: "Tres formas y el orden media-mediana",
    page: "asimetria-y-curtosis", kind: "static", unidad: "1"
  });

  // ============================================================
  //  6. Peso de colas a igual media y desvío   (asimetria-y-curtosis.md)
  // ============================================================

  A.registerFigure("u1-peso-de-colas-a-igual-media-y-desvio", function (host, api) {
    var F = api.Fig;
    var W = 660;
    var pans = F.panels(host, 2, { heights: [236, 176], w: W, gap: 4 });

    var RAIZ3 = Math.sqrt(3);
    var B_LAP = 1 / Math.SQRT2;
    function dUnif(x) { return (x >= -RAIZ3 && x <= RAIZ3) ? 1 / (2 * RAIZ3) : 0; }
    function dNorm(x) { return M.normPDF(x, 0, 1); }
    function dLap(x) { return Math.exp(-Math.abs(x) / B_LAP) / (2 * B_LAP); }

    // κ = m₄/m₂² − 3, por integración numérica sobre el soporte de cada densidad.
    function kurtosis(f, a, b) {
      var m4 = M.integrate(function (x) { return x * x * x * x * f(x); }, a, b, 4000);
      var m2 = M.integrate(function (x) { return x * x * f(x); }, a, b, 4000);
      return m4 / (m2 * m2) - 3;
    }
    var kU = kurtosis(dUnif, -RAIZ3, RAIZ3);
    var kN = kurtosis(dNorm, -12, 12);
    var kL = kurtosis(dLap, -18, 18);

    // La normal va en --u3 (violeta) y no en --primary: en laurel --primary es
    // el mismo verde oscuro que --u1 y, en el panel logarítmico, la normal y
    // la uniforme quedaban indistinguibles. El trazo discontinuo de la normal
    // agrega una segunda pista, independiente del color.
    var cU1 = F.series(1), cN = F.series(2), cA = F.series(3);
    var cTxt = F.color("text-3");

    // Tres series: además del color llevan trazos distintos, que es el canal
    // secundario que las separa cuando el color no alcanza.
    var series = [
      { f: dUnif, c: cU1, dash: null, nombre: "uniforme (platicúrtica)", k: kU },
      { f: dNorm, c: cN, dash: "7 4", nombre: "normal (mesocúrtica)", k: kN },
      { f: dLap, c: cA, dash: "2 4", nombre: "Laplace (leptocúrtica)", k: kL }
    ];

    var out = F.readouts(host, [
      { k: "ku", label: "κ uniforme" },
      { k: "kn", label: "κ normal" },
      { k: "kl", label: "κ Laplace" }
    ]);
    F.legend(host, series.map(function (s) {
      return { label: s.nombre + " · κ = " + F.fmt(s.k, 2), color: s.c, dash: !!s.dash };
    }));

    // panel superior: las tres densidades superpuestas
    var p0 = { l: 54, r: 18, t: 20, b: 44 };
    var sx0 = F.scale([-4, 4], [p0.l, W - p0.r]);
    var sy0 = F.scale([0, 0.80], [236 - p0.b, p0.t]);
    F.axes(pans[0], {
      sx: sx0, sy: sy0, xTicks: 9, yTicks: 5, grid: true, y0: 0,
      xLabel: "x (media 0, desvío 1 en las tres)", yLabel: "f(x)"
    });
    series.forEach(function (s) {
      F.curve(pans[0], s.f, sx0, sy0, { stroke: s.c, dash: s.dash, n: 420, serie: s.nombre });
    });
    // los saltos de la uniforme, que el muestreo de la curva no dibuja
    [-RAIZ3, RAIZ3].forEach(function (x) {
      F.line(pans[0], [[sx0(x), sy0(0)], [sx0(x), sy0(dUnif(0))]], { stroke: cU1, width: 2, serie: false });
    });
    F.label(pans[0], sx0(0), sy0(dLap(0)) - 8, "Laplace", {
      size: 11.5, anchor: "middle", weight: 600, keyColor: cA
    });
    F.label(pans[0], sx0(0.05), sy0(dNorm(0)) + 14, "normal", {
      size: 11.5, anchor: "start", keyColor: cN
    });
    F.label(pans[0], sx0(-1.2), sy0(dUnif(0)) - 8, "uniforme", {
      size: 11.5, anchor: "middle", keyColor: cU1
    });

    // panel inferior: detalle de la cola derecha en escala logarítmica
    var p1 = { l: 62, r: 18, t: 20, b: 46 };
    var sx1 = F.scale([1.5, 5], [p1.l, W - p1.r]);
    var sy1 = F.scale([1e-6, 1], [176 - p1.b, p1.t], { log: true });
    F.axes(pans[1], {
      sx: sx1, sy: sy1, xTicks: 8, yTicks: [1, 1e-2, 1e-4, 1e-6], grid: true, y0: 1e-6,
      xLabel: "x (detalle de la cola derecha)", yLabel: "f(x), escala log."
    });
    series.forEach(function (s) {
      F.curve(pans[1], s.f, sx1, sy1, { stroke: s.c, dash: s.dash, n: 420, serie: s.nombre });
    });
    F.vline(pans[1], sx1(RAIZ3), {
      y0: sy1(dUnif(0)), y1: sy1(1e-6), stroke: cU1, dash: "3 3"
    });
    F.text(pans[1], sx1(RAIZ3) + 5, sy1(2e-5), "la uniforme se corta en √3", {
      size: 11, anchor: "start", fill: cTxt
    });
    // Rótulos al pie de cada curva en el panel logarítmico: ahí no hay
    // referencia de posición y el color por sí solo no alcanza.
    F.label(pans[1], sx1(4.55), sy1(dLap(4.55)) - 8, "Laplace", {
      size: 11, anchor: "start", weight: 600, keyColor: cA
    });
    F.label(pans[1], sx1(4.55), sy1(dNorm(4.55)) - 8, "normal", {
      size: 11, anchor: "start", weight: 600, keyColor: cN
    });

    out.set("ku", F.fmt(kU, 3));
    out.set("kn", F.fmt(kN, 3));
    out.set("kl", F.fmt(kL, 3));
  }, {
    titulo: "Peso de colas a igual media y desvío",
    title: "Peso de colas a igual media y desvío",
    page: "asimetria-y-curtosis", kind: "static", unidad: "1"
  });

  // ============================================================
  //  7. El ancho de bin cambia la historia   (histograma-y-frecuencias.md)
  // ============================================================

  var BIN_SEED = 20260904;
  var binCache = null;
  function binDatos(F, seed) {
    if (binCache && binCache.seed === seed) return binCache;
    var u = F.rng(seed), xs = [], i, v;
    for (i = 0; i < 400; i++) {
      v = u() < 0.6 ? u.normal(35, 5) : u.normal(60, 6);
      xs.push(Math.round(v * 10) / 10);
    }
    xs.sort(asc);
    binCache = {
      seed: seed, xs: xs,
      lo: Math.floor(xs[0]) - 1, hi: Math.ceil(xs[xs.length - 1]) + 1
    };
    return binCache;
  }

  A.registerFigure("u1-el-ancho-de-bin-cambia-la-historia", function (host, api) {
    var F = api.Fig;
    var W = 660, H0 = 226, H1 = 156;
    var pans = F.panels(host, 2, { heights: [H0, H1], w: W, gap: 4 });

    var ctl = F.controls(host, [
      { k: "N", label: "cantidad de intervalos", min: 3, max: 60, step: 1, value: 18, dec: 0 }
    ], function () { redraw(); });

    F.buttons(host, [{
      label: "Nueva realización",
      title: "vuelve a sortear las 400 observaciones con otra semilla",
      onClick: function () {
        api.state.seed = (api.state.seed == null ? BIN_SEED : api.state.seed) + 1;
        redraw();
      }
    }]);

    var out = F.readouts(host, [
      { k: "n", label: "cantidad de intervalos" },
      { k: "w", label: "ancho de cada intervalo" },
      { k: "max", label: "frecuencia máxima" },
      { k: "zona", label: "zona sugerida" }
    ]);

    F.legend(host, [
      { label: "histograma (cambia con N)", color: F.series(1), fill: true },
      { label: "acumulada F(α) (no cambia con N)", color: F.series(2) },
      { label: "cuartiles leídos sobre F", color: F.series(3), dash: true }
    ]);

    var padA = { l: 52, r: 20, t: 20, b: 40 };
    var padB = { l: 52, r: 20, t: 14, b: 42 };
    var syB = F.scale([0, 1], [H1 - padB.b, padB.t]);
    var cU1 = F.series(1), cP = F.series(2), cA = F.series(3);
    var cG = F.status("good"), cTxt = F.color("text-3");

    var capaB = F.el("g", null, pans[1]);
    var layer = F.el("g", null, pans[0]);

    // ---- panel inferior: la acumulada. No depende de N, pero sí de la
    //      realización, así que se redibuja solo cuando cambia la semilla
    //      (mover el deslizador de N no la vuelve a trazar). ----
    var acumSeed = null;
    function acumulada(d, sxB) {
      if (acumSeed === d.seed) return;
      acumSeed = d.seed;
      while (capaB.firstChild) capaB.removeChild(capaB.firstChild);
      var n = d.xs.length, acum = [], i;
      for (i = 0; i < n; i++) acum.push([d.xs[i], (i + 1) / n]);
      F.axes(capaB, {
        sx: sxB, sy: syB, xTicks: 8, yTicks: 5, grid: true, y0: 0,
        xLabel: "valor", yLabel: "F(α)"
      });
      F.line(capaB, [[d.lo, 0], [d.xs[0], 0]], { stroke: cP, width: 2, sx: sxB, sy: syB, serie: false });
      F.line(capaB, acum, { stroke: cP, width: 2, sx: sxB, sy: syB, serie: "F(α)" });
      F.line(capaB, [[d.xs[n - 1], 1], [d.hi, 1]], { stroke: cP, width: 2, sx: sxB, sy: syB, serie: false });
      [0.25, 0.5, 0.75].forEach(function (p) {
        var q = quantile(d.xs, p);
        F.hline(capaB, syB(p), { x0: padB.l, x1: sxB(q), stroke: cA, dash: "4 4" });
        F.vline(capaB, sxB(q), { y0: syB(p), y1: syB(0), stroke: cA, dash: "4 4" });
        F.label(capaB, sxB(q), syB(0) - 7, F.fmt(q, 1), {
          size: 11, anchor: "middle", mono: true, keyColor: cA
        });
      });
    }

    function redraw() {
      while (layer.firstChild) layer.removeChild(layer.firstChild);
      var d = binDatos(F, api.state.seed == null ? BIN_SEED : api.state.seed);
      var sxA = F.scale([d.lo, d.hi], [padA.l, W - padA.r]);
      var sxB = F.scale([d.lo, d.hi], [padB.l, W - padB.r]);
      acumulada(d, sxB);
      var N = Math.round(ctl.get("N"));
      var h = histogram(d.xs, d.lo, d.hi, N);
      var mx = 0, i2;
      for (i2 = 0; i2 < h.counts.length; i2++) if (h.counts[i2] > mx) mx = h.counts[i2];
      var syA = F.scale([0, mx * 1.18], [H0 - padA.b, padA.t]);

      F.axes(layer, {
        sx: sxA, sy: syA, xTicks: 8, yTicks: 4, grid: true, y0: 0,
        xLabel: "valor", yLabel: "frecuencia"
      });
      // Histograma dibujado como ESCALÓN: el ancho del intervalo se sigue
      // leyendo en el propio contorno y ninguna barra se come el lienzo,
      // incluso con tres intervalos.
      var esc = [], ii, dEsc = "M" + sxA(h.lo) + " " + syA(0);
      for (ii = 0; ii < h.counts.length; ii++) {
        var xa2 = sxA(h.lo + ii * h.w), xb2 = sxA(h.lo + (ii + 1) * h.w);
        var yv = syA(h.counts[ii]);
        esc.push([xa2, yv], [xb2, yv]);
        dEsc += "L" + xa2 + " " + yv + "L" + xb2 + " " + yv;
      }
      dEsc += "L" + sxA(h.hi) + " " + syA(0) + "Z";
      F.path(layer, dEsc, { fill: cU1, opacity: 0.16 });
      F.line(layer, esc, { stroke: cU1, width: 2, serie: "frecuencia" });

      var enZona = N >= 15 && N <= 20;
      F.label(layer, W - padA.r, padA.t - 4,
        enZona ? "N en la zona sugerida (15 a 20)" : "zona sugerida: 15 a 20 intervalos", {
          size: 11.5, anchor: "end", fill: enZona ? F.color("text-2") : cTxt,
          keyColor: enZona ? cG : null
        });

      out.set("n", String(N));
      out.set("w", F.fmt(h.w, 2));
      out.set("max", String(mx));
      out.set("zona", enZona ? "sí (15 a 20)" : "no (15 a 20)");
    }

    redraw();
  }, {
    titulo: "El ancho de bin cambia la historia",
    title: "El ancho de bin cambia la historia",
    page: "histograma-y-frecuencias", kind: "interactive", unidad: "1"
  });

  // ============================================================
  //  8. Los f_i subintervalos del reparto   (datos-agrupados.md)
  // ============================================================

  A.registerFigure("u1-los-f-i-subintervalos-del-reparto", function (host, api) {
    var F = api.Fig;
    var W = 660, H = 268;
    var pad = { l: 46, r: 30 };
    var Y_ACUM = 62, Y_NUM = 96, Y_BAR0 = 108, Y_BAR1 = 152, Y_AXIS = 202;

    var svg = F.svg(host, {
      w: W, h: H,
      title: "El intervalo [36,39) partido en 18 subintervalos, uno por dato"
    });
    F.tex(host, "q_1 = 36 + \\dfrac{15 - 12}{18}\\,(39 - 36) = 36.5", {
      svg: svg, x: W / 2, y: 24, anchor: "middle"
    });

    var Li = 36, Lsi = 39, fi = 18, Fprev = 12, objetivo = 15;   // 0.25 · 60
    var q1 = Li + (objetivo - Fprev) / fi * (Lsi - Li);

    var layer = F.el("g", null, svg);
    var sx = F.scale([Li - 0.12, Lsi + 0.12], [pad.l, W - pad.r]);
    var cU1 = F.series(1), cA = F.series(2), cTxt = F.color("text-3");
    var cBorde = F.color("border-2") || F.color("border");
    // Los tabiques entre subintervalos son mobiliario, no dato: van en un
    // grupo .fig-grid, finos y recesivos.
    var tabiques = F.el("g", { "class": "fig-grid" }, layer);

    // rectángulo del intervalo: lavado plano y contorno de 2 px, que es la
    // marca de dato de la serie (y por eso la que entra en la lectura).
    F.el("rect", {
      x: sx(Li), y: Y_BAR0, width: sx(Lsi) - sx(Li), height: Y_BAR1 - Y_BAR0,
      rx: 2, fill: cU1, "fill-opacity": 0.14
    }, layer);
    F.line(layer, [
      [sx(Li), Y_BAR1], [sx(Li), Y_BAR0], [sx(Lsi), Y_BAR0], [sx(Lsi), Y_BAR1]
    ], { stroke: cU1, width: 2, serie: "intervalo [36, 39)" });

    // los 3 primeros subintervalos: los datos que faltan acumular
    F.el("rect", {
      x: sx(Li), y: Y_BAR0, width: sx(q1) - sx(Li), height: Y_BAR1 - Y_BAR0,
      rx: 2, fill: cA, "fill-opacity": 0.24
    }, layer);

    var paso = (Lsi - Li) / fi, j;
    for (j = 1; j < fi; j++) {
      F.line(tabiques, [[sx(Li + j * paso), Y_BAR0], [sx(Li + j * paso), Y_BAR1]], {
        stroke: cBorde, width: 1, serie: false
      });
    }
    for (j = 1; j <= fi; j++) {
      F.label(layer, sx(Li + j * paso), Y_NUM, String(Fprev + j), {
        size: 11, anchor: "middle", mono: true,
        fill: (Fprev + j) === objetivo ? F.color("text") : cTxt,
        weight: (Fprev + j) === objetivo ? 600 : null,
        keyColor: (Fprev + j) === objetivo ? cA : null
      });
    }
    F.text(layer, sx(Li) + 4, Y_ACUM, "acumulado hasta 36: " + Fprev + " datos", {
      size: 11.5, anchor: "start", fill: cTxt
    });
    F.text(layer, sx(Lsi) - 4, Y_ACUM, "acumulado hasta 39: " + (Fprev + fi) + " datos", {
      size: 11.5, anchor: "end", fill: cTxt
    });
    F.text(layer, (sx(Li) + sx(Lsi)) / 2, Y_BAR1 + 16, "18 subintervalos iguales", {
      size: 11.5, anchor: "middle", baseline: "hanging", fill: cTxt
    });

    F.vline(layer, sx(q1), { y0: Y_NUM + 6, y1: Y_AXIS, stroke: cA, dash: "5 4" });
    F.marker(layer, sx(q1), Y_BAR1, { r: 5, fill: cA, serie: "q₁" });
    F.label(layer, sx(q1) + 8, Y_AXIS - 10, "q₁ = " + F.fmt(q1, 2), {
      size: 12, anchor: "start", mono: true, weight: 600, keyColor: cA
    });

    xAxis(F, layer, sx, Y_AXIS, {
      ticks: [36, 36.5, 37, 37.5, 38, 38.5, 39],
      label: "valor dentro del intervalo [36, 39)"
    });

    F.legend(host, [
      { label: "intervalo [36, 39) con fᵢ = 18", color: cU1, fill: true },
      { label: "los 3 datos que faltan para llegar a 15", color: cA, fill: true }
    ]);
  }, {
    titulo: "Los f_i subintervalos del reparto",
    title: "Los f_i subintervalos del reparto",
    page: "datos-agrupados", kind: "static", unidad: "1"
  });

  // ============================================================
  //  9. Bandas x̄ ± k·s sobre el histograma   (medidas-de-dispersion.md)
  // ============================================================

  var BAND_SEED = 31415;
  var bandCache = null;
  function bandDatos(F, seed) {
    if (bandCache && bandCache.seed === seed) return bandCache;
    function prep(xs, etiqueta) {
      xs.sort(asc);
      return {
        xs: xs, etiqueta: etiqueta, m: mean(xs), s: sd(xs),
        lo: Math.floor(xs[0]) - 1, hi: Math.ceil(xs[xs.length - 1]) + 1
      };
    }
    var u = F.rng(seed), a = [], i;
    for (i = 0; i < 600; i++) a.push(u.normal(50, 8));
    var v = F.rng(2718 + (seed - BAND_SEED)), b = [];
    for (i = 0; i < 600; i++) b.push(20 + 30 * v.exp(1));
    bandCache = {
      seed: seed,
      normal: prep(a, "conjunto aproximadamente normal"),
      asimetrica: prep(b, "conjunto claramente asimétrico")
    };
    return bandCache;
  }

  A.registerFigure("u1-bandas-x-ks-sobre-el-histograma", function (host, api) {
    var F = api.Fig;
    var W = 660, H = 330;
    var pad = { l: 54, r: 22, t: 24, b: 52 };

    var svg = F.svg(host, {
      w: W, h: H,
      title: "Histograma con la banda de la media más o menos k desvíos"
    });

    var ctl = F.controls(host, [
      { k: "k", label: "k (semiamplitud en desvíos)", min: 0.5, max: 3.5, step: 0.05, value: 1, dec: 2 }
    ], function () { redraw(); });

    var sel = F.select(host, {
      k: "conj", label: "conjunto",
      options: [
        { v: "normal", label: "aproximadamente normal" },
        { v: "asimetrica", label: "claramente asimétrico" }
      ],
      value: "normal"
    }, function () { redraw(); });

    F.buttons(host, [{
      label: "Nueva realización",
      title: "vuelve a sortear los 600 datos de cada conjunto con otra semilla",
      onClick: function () {
        api.state.seed = (api.state.seed == null ? BAND_SEED : api.state.seed) + 1;
        redraw();
      }
    }]);

    var out = F.readouts(host, [
      { k: "m", tex: "\\bar x" },
      { k: "s", label: "s" },
      { k: "pct", label: "datos dentro de la banda" },
      { k: "teo", tex: "2\\Phi(k)-1" }
    ]);

    F.legend(host, [
      { label: "histograma", color: F.series(1), fill: true },
      { label: "banda media ± k·s", color: F.series(2), fill: true },
      { label: "media", color: F.series(3) }
    ]);

    var layer = F.el("g", null, svg);

    function redraw() {
      while (layer.firstChild) layer.removeChild(layer.firstChild);
      var D = bandDatos(F, api.state.seed == null ? BAND_SEED : api.state.seed);
      var d = D[sel.get()] || D.normal;
      var k = ctl.get("k");
      var h = histogram(d.xs, d.lo, d.hi, 26);
      var mx = 0, i;
      for (i = 0; i < h.counts.length; i++) if (h.counts[i] > mx) mx = h.counts[i];

      var sx = F.scale([d.lo, d.hi], [pad.l, W - pad.r]);
      var sy = F.scale([0, mx * 1.18], [H - pad.b, pad.t]);

      F.axes(layer, {
        sx: sx, sy: sy, xTicks: 8, yTicks: 5, grid: true, y0: 0,
        xLabel: d.etiqueta, yLabel: "frecuencia"
      });

      var cU1 = F.series(1), cA = F.series(2), cG = F.series(3);
      var lo = d.m - k * d.s, hi = d.m + k * d.s;
      var xa = Math.max(sx(d.lo), sx(lo)), xb = Math.min(sx(d.hi), sx(hi));
      F.el("rect", {
        x: xa, y: pad.t, width: Math.max(0, xb - xa), height: (H - pad.b) - pad.t,
        fill: cA, "fill-opacity": 0.15
      }, layer);

      F.bars(layer, histBars(h), sx, sy, { fill: cU1, width: h.w, serie: "frecuencia" });

      F.line(layer, [[sx(d.m), pad.t], [sx(d.m), sy(0)]], {
        stroke: cG, width: 2, serie: "media"
      });
      [[lo, "media − k·s"], [hi, "media + k·s"]].forEach(function (p) {
        if (p[0] < d.lo || p[0] > d.hi) return;
        F.vline(layer, sx(p[0]), { y0: pad.t, y1: sy(0), stroke: cA, dash: "4 4" });
        F.label(layer, sx(p[0]), pad.t - 8, p[1], { size: 11, anchor: "middle", keyColor: cA });
      });
      F.label(layer, sx(d.m), pad.t - 8, "media", {
        size: 12, anchor: "middle", weight: 600, keyColor: cG
      });

      var dentro = 0;
      for (i = 0; i < d.xs.length; i++) if (d.xs[i] >= lo && d.xs[i] <= hi) dentro++;
      var pct = dentro / d.xs.length;
      var teo = M.normCDF ? (2 * M.normCDF(k, 0, 1) - 1) : NaN;

      out.set("m", F.fmt(d.m, 3));
      out.set("s", F.fmt(d.s, 3));
      out.set("pct", F.fmt(pct * 100, 1) + " %");
      out.set("teo", F.fmt(teo * 100, 1) + " %");
    }

    redraw();
  }, {
    titulo: "Bandas x̄ ± k·s sobre el histograma",
    title: "Bandas x̄ ± k·s sobre el histograma",
    page: "medidas-de-dispersion", kind: "interactive", unidad: "1"
  });

})();
