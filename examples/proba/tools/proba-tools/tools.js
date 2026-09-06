/* [bundle proba-tools] Copia de `estudio/tools.js` del baseline de Proba.
   Las diferencias con el original están marcadas con «[bundle]» y explicadas
   en ADAPTACIONES.md. Compat de datos: el runtime deja el JSON declarado en
   `manifest.data` en `App.STUDY`; el baseline lo leía del global
   `window.STUDY`. El shim mantiene vivos los dos nombres. */
var STUDY = window.STUDY || (window.App && window.App.STUDY) || {};

/* ============================================================
   tools.js — HERRAMIENTAS MATEMÁTICAS
   Vistas: explorador (distribuciones), calc (calculadoras), asistente (árboles).
   IIFE sobre window.App. No redefine helpers del contrato; usa App.M / App.STUDY.
   ============================================================ */
(function () {
  "use strict";
  var A = window.App;
  if (!A) return;
  var M = A.M, STUDY = A.STUDY || window.STUDY || {};
  // [bundle] `App.$` / `App.$$` no están en CompatApp (anotados para R4): si el
  // runtime no los trae, se usan equivalentes locales con la misma semántica
  // que los del baseline (raíz opcional, $$ devuelve un array de verdad).
  var $ = typeof A.$ === "function" ? A.$ : function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = typeof A.$$ === "function" ? A.$$ : function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  // [bundle] El baseline llama `App.katex(tex, display)` como FUNCIÓN; el
  // contrato `CompatApp` la declara como `{ renderToString }` (anotado para
  // R4). El shim acepta las dos formas.
  var katex = typeof A.katex === "function"
    ? A.katex
    : function (tex, display) {
        if (!A.katex || typeof A.katex.renderToString !== "function") return "";
        try {
          return A.katex.renderToString(tex, { displayMode: !!display, throwOnError: false, macros: A.KATEX_MACROS });
        } catch (e) { return ""; }
      };

  // ---------- helpers locales (no en el contrato App) ----------
  // formato con N decimales, robusto a no-finitos
  function fmtN(x, n) {
    if (x == null || !isFinite(x)) return "—";
    var f = Math.pow(10, n == null ? 4 : n);
    return String(Math.round(x * f) / f);
  }
  // % con 2 decimales
  function pct(x) { return (x == null || !isFinite(x)) ? "—" : (Math.round(x * 1e4) / 1e2) + "%"; }
  // Lee un número de un input; NaN si está vacío. Acepta coma o punto como
  // separador decimal: los campos de las calculadoras son type="text" (ver
  // fldHtml) y quien escribe "1,96" tiene que obtener lo mismo que con "1.96".
  function num(sel) {
    var el = $(sel); if (!el) return NaN;
    var v = String(el.value).trim().replace(",", ".");
    return v === "" ? NaN : +v;
  }
  // Simpson compuesto para integrar f en [a,b] (continuas sin CDF cerrada)
  function simpson(f, a, b, n) {
    if (b <= a) return 0;
    n = n || 800; if (n % 2) n++;
    var h = (b - a) / n, s = f(a) + f(b);
    for (var i = 1; i < n; i++) { var x = a + i * h; var y = f(x); if (!isFinite(y)) y = 0; s += (i % 2 ? 4 : 2) * y; }
    return s * h / 3;
  }

  // ============================================================
  //  CDF por distribución — devuelve P(X ≤ x) usando App.M si existe,
  //  o integración numérica de la densidad como fallback.
  // ============================================================
  function distCDF(dist, p, x) {
    var id = dist.id;
    if (id === "bernoulli") { if (x < 0) return 0; if (x < 1) return 1 - p.p; return 1; }
    if (id === "binomial") return M.binomCDF(x, p.n, p.p);
    if (id === "poisson") return M.poissonCDF(x, p.lam);
    if (id === "geometrica") return M.geomCDF(x, p.p);
    if (id === "binomial-negativa") return M.negbinCDF(x, p.r, p.p);
    if (id === "hipergeometrica") return M.hyperCDF(x, p.N, p.M, p.n);
    if (id === "uniforme") return M.uniformCDF(x, p.a, p.b);
    if (id === "exponencial") return M.expCDF(x, p.lam);
    if (id === "normal") return M.normCDF(x, p.mu, p.sigma);
    if (id === "t") return M.tCDF(x, p.m);
    if (id === "chi2") return M.chi2CDF(x, p.k);
    // gamma, erlang, weibull → integrar la densidad numéricamente desde 0
    var f = dist.f(p);
    return Math.min(1, Math.max(0, simpson(f, 0, Math.max(x, 0), 1000)));
  }

  // P(a ≤ X ≤ b). Para discretas suma PMF (incluye ambos extremos).
  function distProbInterval(dist, p, a, b) {
    if (b < a) { var t = a; a = b; b = t; }
    if (dist.kind === "disc") {
      var f = dist.f(p), s = 0;
      var lo = Math.ceil(a - 1e-9), hi = Math.floor(b + 1e-9);
      // límite de seguridad por si el rango es enorme
      if (hi - lo > 100000) return null;
      for (var k = lo; k <= hi; k++) { var y = f(k); if (isFinite(y) && y > 0) s += y; }
      return Math.min(1, s);
    }
    // continua: F(b) − F(a)
    var pb = distCDF(dist, p, b), pa = distCDF(dist, p, a);
    return Math.min(1, Math.max(0, pb - pa));
  }

  // ============================================================
  //  VIEW: EXPLORADOR DE DISTRIBUCIONES
  // ============================================================
  var exState = { id: "binomial", params: null, _for: null, a: null, b: null };

  A.registerView("explorador", function (main, arg) {
    document.title = "Explorador de distribuciones · Estudio P&E";
    var dists = STUDY.DISTS || [];
    if (arg && dists.find(function (d) { return d.id === arg; })) exState.id = arg;
    var dist = dists.find(function (d) { return d.id === exState.id; }) || dists[0];
    if (!dist) { main.innerHTML = A.emptyState("No hay distribuciones cargadas."); return; }

    // (re)inicializar params al cambiar de distribución
    if (!exState.params || exState._for !== dist.id) {
      exState.params = {};
      dist.params.forEach(function (pp) { exState.params[pp.key] = pp.def; });
      exState._for = dist.id;
      var dom = dist.domain(exState.params);
      // valores por defecto del intervalo P(a≤X≤b): tercios del dominio
      exState.a = dist.kind === "disc" ? Math.round(dom[0] + (dom[1] - dom[0]) * 0.3) : +(dom[0] + (dom[1] - dom[0]) * 0.3).toFixed(2);
      exState.b = dist.kind === "disc" ? Math.round(dom[0] + (dom[1] - dom[0]) * 0.6) : +(dom[0] + (dom[1] - dom[0]) * 0.6).toFixed(2);
    }

    var tabs = dists.map(function (d) {
      return '<button class="chip-btn' + (d.id === dist.id ? " on" : "") + '" data-action="ex-tab" data-dist="' + d.id + '">' + A.escapeHtml(d.name) + "</button>";
    }).join("");

    main.innerHTML =
      '<h1 class="section-title">Explorador de distribuciones</h1>' +
      '<div class="ex-tabs">' + tabs + "</div>" +
      '<div class="tool-layout">' +
        "<div>" +
          '<div class="card">' +
            '<div class="ex-head"><span class="ex-name">' + A.escapeHtml(dist.name) + "</span>" +
              '<span class="badge">' + (dist.kind === "disc" ? "discreta" : "continua") + "</span>" +
              '<span class="badge"><span class="dot" style="background:' + A.unitMeta(String(dist.unit)).color + '"></span>' + A.unitShort(String(dist.unit)) + "</span></div>" +
            '<p class="ex-modela">' + A.escapeHtml(dist.modela) + "</p>" +
            '<div class="ex-support">Soporte: ' + katex(dist.support, false) + "</div>" +
            '<div class="controls" id="exControls"></div>' +
            (dist.note ? '<div class="callout" style="margin-top:16px"><span class="callout-tag">Convención</span>' + A.rich(dist.note) + "</div>" : "") +
            '<a class="chip-btn" style="margin-top:16px" data-nav="#/p/' + dist.slug + '">' + A.icon("book", 15) + " Ver página completa</a>" +
          "</div>" +
          // tarjeta de probabilidad sombreada P(a ≤ X ≤ b)
          '<div class="card ex-prob-card">' +
            '<div class="subsection-title" style="margin-top:0">' + A.icon("sliders", 16) + " Probabilidad " + katex("P(a \\le X \\le b)", false) + "</div>" +
            '<div class="ex-prob-inputs">' +
              '<div class="ex-fld"><label class="lbl">a</label><input type="text" inputmode="decimal" autocomplete="off" class="field" id="exA" value="' + exState.a + '"></div>' +
              '<div class="ex-fld"><label class="lbl">b</label><input type="text" inputmode="decimal" autocomplete="off" class="field" id="exB" value="' + exState.b + '"></div>' +
            "</div>" +
            '<div class="ex-prob-out" id="exProbOut">—</div>' +
            '<p class="ex-prob-hint" id="exProbHint"></p>' +
          "</div>" +
        "</div>" +
        "<div>" +
          '<div class="plot-wrap">' +
            '<canvas id="exCanvas" height="360"></canvas>' +
            '<div class="pw-legend" id="exLegend"></div>' +
            '<p class="ex-readout" id="exReadout" hidden></p>' +
          "</div>" +
          '<div class="stat-pills" id="exStats"></div>' +
          '<div class="dist-formula" id="exFormula"></div>' +
        "</div>" +
      "</div>";

    // sliders de parámetros
    var cc = $("#exControls");
    cc.innerHTML = dist.params.map(function (pp) {
      return '<div class="control"><label>' + A.rich(pp.label) +
        ' <span class="val" id="exv_' + pp.key + '">' + A.fmt(exState.params[pp.key]) + "</span></label>" +
        '<input type="range" min="' + pp.min + '" max="' + pp.max + '" step="' + pp.step + '" value="' + exState.params[pp.key] + '" data-pk="' + pp.key + '"></div>';
    }).join("");
    $$("input[type=range]", cc).forEach(function (inp) {
      inp.addEventListener("input", function () {
        exState.params[inp.dataset.pk] = +inp.value;
        var lbl = $("#exv_" + inp.dataset.pk); if (lbl) lbl.textContent = A.fmt(+inp.value);
        refreshExplorer(dist);
      });
    });

    // fórmula (PMF/densidad + E + V + FGM)
    $("#exFormula").innerHTML =
      '<div class="ex-formula-grid">' +
      "<div>" + katex(dist.tex.pmf, true) + "</div>" +
      '<div class="ex-formula-row"><span>' + katex(dist.tex.mean) + "</span><span>" + katex(dist.tex.var) + "</span>" +
      (dist.tex.fgm && dist.tex.fgm !== "—" ? "<span>" + katex(dist.tex.fgm) + "</span>" : "") +
      "</div></div>";

    // inputs del intervalo
    var aIn = $("#exA"), bIn = $("#exB");
    function onInterval() {
      // num() acepta coma o punto; lo que no es un número se trata como vacío
      var a = num("#exA"), b = num("#exB");
      exState.a = isFinite(a) ? a : null;
      exState.b = isFinite(b) ? b : null;
      refreshExplorer(dist);
    }
    aIn.addEventListener("input", onInterval);
    bIn.addEventListener("input", onInterval);

    // redibujo en cambio de tema / resize
    A.setRedraw(function () { drawExplorer(dist); });
    refreshExplorer(dist);
  });

  A.registerAction("ex-tab", function (el) {
    A.go("#/explorador/" + el.dataset.dist);
  });

  function refreshExplorer(dist) {
    var p = exState.params;
    var statsEl = $("#exStats"), probOut = $("#exProbOut"), probHint = $("#exProbHint");
    if (dist.valid && !dist.valid(p)) {
      if (statsEl) statsEl.innerHTML = '<div class="pill" style="color:var(--bad-text)">Parámetros inválidos: revise las restricciones de la distribución.</div>';
      if (probOut) probOut.textContent = "—";
      if (probHint) probHint.textContent = "";
      var cv = $("#exCanvas");
      if (cv) {
        var c = cv.getContext("2d"); c.clearRect(0, 0, cv.width, cv.height);
        // Desenganchar el hover del dibujo anterior: su instantánea pertenece a
        // parámetros que ya no valen y, ante el primer movimiento del puntero,
        // repondría el gráfico viejo sobre el lienzo vacío.
        if (cv.__plotHoverOff) cv.__plotHoverOff();
        cv.dataset.plotReadout = "";
      }
      var lg = $("#exLegend"); if (lg) lg.innerHTML = "";
      var rd = $("#exReadout"); if (rd) { rd.textContent = ""; rd.hidden = true; }
      return;
    }
    var mean = dist.mean(p), varc = dist.varc(p);
    var sd = (varc != null && varc >= 0) ? Math.sqrt(varc) : null;
    if (statsEl) statsEl.innerHTML =
      '<div class="pill">' + katex("E[X]") + " = <b>" + (mean == null ? "—" : fmtN(mean, 4)) + "</b></div>" +
      '<div class="pill">' + katex("V(X)") + " = <b>" + (varc == null ? "—" : fmtN(varc, 4)) + "</b></div>" +
      '<div class="pill">' + katex("\\sigma") + " = <b>" + (sd == null ? "—" : fmtN(sd, 4)) + "</b></div>";

    // probabilidad del intervalo
    if (probOut) {
      var a = exState.a, b = exState.b;
      if (a == null || b == null || !isFinite(a) || !isFinite(b)) {
        probOut.textContent = "—";
        if (probHint) probHint.textContent = "Indique a y b para sombrear la región.";
      } else {
        var prob = distProbInterval(dist, p, a, b);
        var lo = Math.min(a, b), hi = Math.max(a, b);
        if (prob == null) {
          probOut.textContent = "—";
          if (probHint) probHint.textContent = "Rango demasiado grande para sumar.";
        } else {
          probOut.innerHTML = katex("P(" + fmtN(lo, 3) + " \\le X \\le " + fmtN(hi, 3) + ")") + " = <b>" + fmtN(prob, 6) + "</b>";
          if (probHint) probHint.innerHTML = "≈ " + pct(prob) + (dist.kind === "disc" ? " · suma de la PMF en enteros del rango" : " · área bajo la densidad");
        }
      }
    }
    drawExplorer(dist);
  }

  function drawExplorer(dist) {
    var canvas = $("#exCanvas"); if (!canvas) return;
    var p = exState.params;
    if (dist.valid && !dist.valid(p)) return;
    plotDist(canvas, dist, p, dist.mean(p), exState.a, exState.b);
  }

  // Dibuja la distribución sobre App.Plot (plot.js): rejilla y ticks redondos,
  // relleno plano sin degradados, una sola capa por región y leyenda de tres
  // entradas. La región [a,b] se pinta como segmento propio —no encima del
  // área de la densidad— para que no se apilen dos lavados en la misma zona.
  function plotDist(canvas, dist, p, mean, regA, regB) {
    var P = A.Plot;
    if (!P) return;
    var s = P.setup(canvas, 360);
    var ctx = s.ctx;
    var box = P.frame(ctx, { W: s.W, H: s.H });
    var disc = dist.kind === "disc";
    var f = dist.f(p);
    var dom = dist.domain(p), d0 = dom[0], d1 = dom[1];

    // muestreo
    var xs = [], ys = [], ymax = 0, i, x, y;
    if (disc) {
      var lo = Math.max(0, Math.floor(d0)), hi = Math.min(Math.ceil(d1), lo + 200);
      for (var k = lo; k <= hi; k++) { y = f(k); if (!isFinite(y) || y < 0) y = 0; xs.push(k); ys.push(y); if (y > ymax) ymax = y; }
    } else {
      var N = 260;
      for (i = 0; i <= N; i++) { x = d0 + (d1 - d0) * i / N; y = f(x); if (!isFinite(y) || y < 0) y = 0; xs.push(x); ys.push(y); if (y > ymax) ymax = y; }
    }
    if (!xs.length) return;
    if (ymax <= 0 || !isFinite(ymax)) ymax = 1;

    // Escala Y con tope redondo: se toma el paso de A.Fig.ticks y se sube el
    // techo al múltiplo siguiente, así TODAS las etiquetas quedan redondas.
    var t0 = P.ticks(0, ymax, 5);
    var step = t0.length > 1 ? t0[1] - t0[0] : (ymax || 1);
    var top = Math.ceil(ymax * 1.05 / step - 1e-9) * step;
    if (!(top > 0) || !isFinite(top)) top = ymax;
    var yTicks = [], nv = Math.min(12, Math.round(top / step));
    for (i = 0; i <= nv; i++) yTicks.push(i * step);

    var xmin = disc ? xs[0] - 0.6 : d0;
    var xmax = disc ? xs[xs.length - 1] + 0.6 : d1;
    var sx = P.scales([xmin, xmax], [box.x0, box.x1]);
    var sy = P.scales([0, top], [box.y1, box.y0]);

    // ticks de X: enteros en las discretas, valores redondos en las continuas
    var xTicks;
    if (disc) {
      var stepK = Math.ceil(xs.length / 12);
      xTicks = xs.filter(function (v, j) { return j % stepK === 0; });
    } else {
      xTicks = P.ticks(xmin, xmax, 6);
    }
    P.axes(ctx, { sx: sx, sy: sy, box: box, xTicks: xTicks, yTicks: yTicks, zero: sy(0) });

    var cDist = P.series(1);          // la distribución (ranura 1 de la paleta)
    var cReg = P.series(2);           // la región [a,b] (ranura 2)
    var cAnn = A.cssVar("--text-3");  // anotaciones (E[X]): nunca color de dato

    var hasReg = regA != null && regB != null && isFinite(regA) && isFinite(regB);
    var rLo = hasReg ? Math.min(regA, regB) : 0, rHi = hasReg ? Math.max(regA, regB) : 0;

    if (disc) {
      var inReg = function (xx) { return hasReg && xx >= Math.ceil(rLo - 1e-9) && xx <= Math.floor(rHi + 1e-9); };
      P.bars(ctx, {
        sx: sx, sy: sy, xs: xs, ys: ys, base: sy(0),
        color: function (j, xx) { return inReg(xx) ? cReg : cDist; }
      });
    } else {
      // tres segmentos disjuntos: fuera de [a,b] el lavado de la densidad,
      // dentro el de la región. Ninguna zona lleva dos capas encima.
      var sLo = hasReg ? Math.max(rLo, xmin) : 0, sHi = hasReg ? Math.min(rHi, xmax) : 0;
      var band = hasReg && sHi > sLo;
      var sample = function (a0, b0, n) {
        var px = [], py = [], j, vx, vy;
        for (j = 0; j <= n; j++) {
          vx = a0 + (b0 - a0) * j / n; vy = f(vx);
          if (!isFinite(vy) || vy < 0) vy = 0;
          px.push(vx); py.push(vy);
        }
        return { xs: px, ys: py };
      };
      if (band) {
        if (sLo > xmin) { var L = sample(xmin, sLo, 80); P.area(ctx, { sx: sx, sy: sy, xs: L.xs, ys: L.ys, base: sy(0), color: cDist }); }
        if (sHi < xmax) { var R = sample(sHi, xmax, 80); P.area(ctx, { sx: sx, sy: sy, xs: R.xs, ys: R.ys, base: sy(0), color: cDist }); }
        var Mm = sample(sLo, sHi, 120);
        P.area(ctx, { sx: sx, sy: sy, xs: Mm.xs, ys: Mm.ys, base: sy(0), color: cReg, alpha: P.tokenAlpha("--plot-fill-a", 0.24) });
      } else {
        P.area(ctx, { sx: sx, sy: sy, xs: xs, ys: ys, base: sy(0), color: cDist });
      }
      P.curve(ctx, { sx: sx, sy: sy, xs: xs, ys: ys, color: cDist, width: 2 });
    }

    // media: anotación, no serie
    if (mean != null && isFinite(mean) && mean >= xmin && mean <= xmax) {
      P.vline(ctx, mean, { sx: sx, box: box, label: "E[X]", color: cAnn, y1: sy(0) });
    }

    // leyenda
    var items = [
      disc ? { label: "p(x) · masa de probabilidad", kind: "bar", color: cDist }
           : { label: "f(x) · densidad", kind: "line", color: cDist }
    ];
    if (hasReg) items.push(disc
      ? { label: "región a ≤ X ≤ b", kind: "bar", color: cReg }
      : { label: "región a ≤ X ≤ b", kind: "area", color: cReg, alpha: P.tokenAlpha("--plot-fill-a", 0.24) });
    if (mean != null && isFinite(mean)) items.push({ label: "E[X]", kind: "dash", color: cAnn });
    P.legend("#exLegend", items);

    // lectura del punto más cercano
    P.hover(canvas, {
      sx: sx, sy: sy, box: box, readout: "#exReadout",
      series: [{ label: dist.name, color: cDist, xs: xs, ys: ys }],
      fmt: function (pt) {
        return disc
          ? "P(X = " + pt.x + ") = " + fmtN(pt.y, 4)
          : "f(" + fmtN(pt.x, 3) + ") = " + fmtN(pt.y, 4);
      }
    });

    P.a11y(canvas, (disc ? "Función de masa de probabilidad de " : "Densidad de ") + dist.name +
      (hasReg ? ", con la región entre " + fmtN(rLo, 3) + " y " + fmtN(rHi, 3) + " resaltada" : "") +
      (mean != null && isFinite(mean) ? " y la media en " + fmtN(mean, 3) : "") + ".");
  }

  // ============================================================
  //  VIEW: CALCULADORAS  —  #/calc y #/calc/<sección>
  // ============================================================
  //  Secciones (el <arg> de la ruta): continuas · discretas · ic ·
  //  hipotesis · muestra · tablas. Una subnavegación de chips pegada arriba
  //  lleva a cada una.
  //
  //  La vista se ARMA UNA SOLA VEZ por montaje (marca: #calcRoot). Navegar
  //  entre secciones solo mueve el scroll: no se pierden los datos cargados ni
  //  se recalculan las cuatro tablas. Ningún handler de "input" reconstruye una
  //  tabla — las tablas se arman al montar y después solo se mueve la clase
  //  .hot de una celda a otra.
  //
  //  Todo el HTML que se inyecta aquí lo genera este módulo: los textos fijos
  //  son literales y cualquier dato variable pasa por los formateadores
  //  numéricos (fmtN / toFixed / fmtProb) o por esc() = A.escapeHtml. No entra
  //  markup de ninguna fuente externa ni de entrada libre del usuario.
  //
  //  Anatomía de cada tarjeta:
  //    .calc-formula   la fórmula que aplica, en KaTeX display, arriba de todo
  //    .seg            modo explícito (directo / inverso)
  //    .field.err + .calc-err   validación por campo, con el motivo escrito
  //    .calc-out       resultado grande + botón [data-action="calc-copy"]
  //    details.calc-steps       la fórmula con los números sustituidos
  //    .calc-presets   chips [data-preset] con los campos en data-fields (JSON)
  //    [data-action="calc-lookup"]  abre App.quickLookup precargado
  // ============================================================

  var CALC_SECTIONS = [
    // title = el nombre de la sección: el mismo texto en el encabezado H2, en la
    // miga y en document.title. label es solo el rótulo corto del chip de la
    // subnavegación.
    { id: "continuas", label: "Continuas", icon: "function", title: "Distribuciones continuas" },
    { id: "discretas", label: "Discretas", icon: "dist", title: "Distribuciones discretas" },
    { id: "ic", label: "Intervalos", icon: "target", title: "Intervalos de confianza" },
    { id: "hipotesis", label: "Hipótesis", icon: "gauge", title: "Pruebas de hipótesis" },
    { id: "muestra", label: "Tamaño de muestra", icon: "sliders", title: "Tamaño de muestra" },
    { id: "tablas", label: "Tablas", icon: "grid", title: "Tablas de fractiles" }
  ];

  // ---------- helpers de la vista calc ----------
  function esc(s) { return A.escapeHtml(String(s)); }
  function jat(o) { return esc(JSON.stringify(o)); }
  function parseJ(s) { try { return JSON.parse(s || "{}"); } catch (e) { return {}; } }
  // Entero de un campo; NaN si está vacío o si el dato no es entero (un n vacío
  // NO vale 0, y un 8.7 no se redondea en silencio: el campo queda marcado y el
  // mensaje de error dice que debe ser un entero).
  function inum(sel) { var v = num(sel); return (isFinite(v) && Math.floor(v) === v) ? v : NaN; }

  // probabilidades: notación científica cuando el redondeo las mostraría como 0
  function fmtProb(x) {
    if (x == null || !isFinite(x)) return "—";
    if (x !== 0 && Math.abs(x) < 1e-4) return x.toExponential(2);
    return String(Math.round(x * 1e6) / 1e6);
  }
  // el valor-p en KaTeX: por debajo de 1e-4 se enuncia como cota, no como cifra
  function pvalTex(p) {
    if (!isFinite(p)) return "\\text{—}";
    if (p < 1e-4) return "p<10^{-4}";
    return "p=" + fmtN(p, 5);
  }
  function pvalText(p) { return !isFinite(p) ? "—" : (p < 1e-4 ? p.toExponential(2) : String(fmtN(p, 5))); }
  // α tal como se escribió: redondearlo a 4 decimales dejaba comparaciones que
  // se leen al revés ("p=0.07186 ≥ α=0.0719"). Misma resolución que el valor-p.
  function fmtAlpha(a) {
    if (a == null || !isFinite(a)) return "—";
    if (a !== 0 && Math.abs(a) < 1e-4) return a.toExponential(2);
    return String(Math.round(a * 1e6) / 1e6);
  }

  // Lectura de p = P(X ≤ v) como nivel α, con la MISMA convención que el
  // buscador de valores (lookup.js): α es el área de la cola CHICA y siempre se
  // dice de qué cola se trata. Con p = 0.5 las dos colas valen 0.5 y no hay
  // ningún α que nombrar; con p < 0.5 el α es el propio p en la cola inferior
  // (escribir "α = 1 − p" ahí daba niveles mayores que 1).
  // sim = la distribución es simétrica (Normal, t): el α bilateral vale el doble
  // del unilateral y el fractil de p es el opuesto del de 1 − p.
  function alphaNota(p, sim) {
    if (!(p > 0 && p < 1)) return "";
    var up = 1 - p;
    if (Math.min(p, up) > 0.5 - 5e-5) return "Con $p=0.5$ las dos colas valen $0.5$: ninguna de las dos es un $\\alpha$.";
    if (up < p) {
      return "Lectura de $p$ como nivel: $\\alpha=1-p=" + fmtN(up, 4) + "$ en la cola superior" +
        (sim ? "; a dos colas $" + fmtN(2 * up, 4) + "$" : "") + ".";
    }
    return "Lectura de $p$ como nivel: $\\alpha=p=" + fmtN(p, 4) + "$ en la cola inferior" +
      (sim ? "; a dos colas $" + fmtN(2 * p, 4) + "$. Por simetría este fractil es el opuesto del de $p=" + fmtN(up, 6) + "$" : "") + ".";
  }

  // Ajuste de las placas KaTeX de las tarjetas: el mismo que usa el lector
  // (A.enhanceDoc encoge la placa que no entra y, si aun así desborda, la deja
  // con scroll y el degradado de .is-wide). Se llama sobre contenedores chicos
  // —.calc-formula y .cs-body—, donde enhanceDoc no tiene encabezados, tablas
  // ni callouts que tocar.
  function fitPlates(el) {
    if (!el || !A.enhanceDoc) return;
    try { A.enhanceDoc(el); } catch (e) {}
  }
  function fitAllPlates() {
    var root = document.getElementById("calcRoot");
    if (!root) return;
    $$(".calc-formula, .cs-body", root).forEach(fitPlates);
  }
  var fitTimer = null;
  window.addEventListener("resize", function () {
    if (!document.getElementById("calcRoot")) return;
    if (fitTimer) clearTimeout(fitTimer);
    fitTimer = setTimeout(fitAllPlates, 160);
  });

  // Los campos de las calculadoras son type="text" con inputmode="decimal" a
  // propósito: el navegador localiza un input[type=number] y muestra "1,96"
  // mientras el resultado y los pasos de la misma tarjeta escriben "0.975002".
  // Con texto entra lo mismo que sale y num() acepta las dos escrituras.
  // Los step/min/max que llegan en attrs quedan como documentación del dominio
  // del campo: la validación real la hace check() y se ve en .calc-err.
  function fldHtml(id, label, value, attrs) {
    return '<div class="ex-fld"><label class="lbl" for="' + id + '">' + label + "</label>" +
      '<input type="text" inputmode="decimal" autocomplete="off" class="field" id="' + id + '" value="' + esc(value) + '" ' + (attrs || "") + "></div>";
  }
  function cardHead(title, extra) {
    return '<div class="calc-head"><div class="calc-title">' + title + "</div>" + (extra || "") + "</div>";
  }
  function formulaHtml(tex, id) {
    return '<div class="calc-formula"' + (id ? ' id="' + id + '"' : "") + ">" + katex(tex, true) + "</div>";
  }
  function setFormula(id, tex) {
    var el = $("#" + id); if (!el) return;
    el.innerHTML = katex(tex, true);
    fitPlates(el);
  }

  function outHtml(id, cls) {
    return '<div class="calc-outrow">' +
      '<div class="calc-out' + (cls ? " " + cls : "") + '" id="' + id + '" aria-live="polite">—</div>' +
      '<button type="button" class="icon-btn calc-copy" data-action="calc-copy" data-val="" ' +
      'title="Copiar el resultado" aria-label="Copiar el resultado">' + A.icon("copy", 14) + "</button></div>";
  }
  // plain = lo que se copia; html (opcional) = lo que se muestra (KaTeX)
  function setOut(id, plain, html) {
    var el = $("#" + id); if (!el) return;
    if (html != null) el.innerHTML = html; else el.textContent = plain;
    var btn = el.parentNode ? el.parentNode.querySelector('[data-action="calc-copy"]') : null;
    if (btn) {
      var v = plain == null ? "" : String(plain);
      btn.setAttribute("data-val", v);
      btn.disabled = !v || v === "—";
    }
  }
  function ctpRow(id, texLabel) {
    return '<div class="ctp"><span class="ctp-l">' + katex(texLabel) + "</span>" +
      '<span class="ctp-v" id="' + id + '">—</span>' +
      '<button type="button" class="icon-btn calc-copy" data-action="calc-copy" data-val="" ' +
      'title="Copiar el valor" aria-label="Copiar el valor">' + A.icon("copy", 13) + "</button></div>";
  }
  function setCtp(id, v) {
    var el = $("#" + id); if (!el) return;
    el.textContent = v;
    var b = el.parentNode ? el.parentNode.querySelector('[data-action="calc-copy"]') : null;
    if (b) { b.setAttribute("data-val", v); b.disabled = (v === "—"); }
  }

  // open = true deja el bloque desplegado al montar (la prueba de hipotesis
  // muestra sus pasos de entrada; el resto de las tarjetas arranca plegado)
  function stepsHtml(id, open) {
    return '<details class="calc-steps is-empty"' + (open ? " open" : "") + ' id="' + id + '">' +
      '<summary>Pasos</summary><div class="cs-body"></div></details>';
  }
  function setSteps(id, html) {
    var d = $("#" + id); if (!d) return;
    var b = d.querySelector(".cs-body"); if (b) b.innerHTML = html || "";
    d.classList.toggle("is-empty", !html);
    if (!html) d.open = false;
    // plegado el ancho medido es 0: ahí el ajuste lo dispara el 'toggle'
    if (html && b && d.open) fitPlates(b);
  }

  function errHtml(id) { return '<p class="calc-err" id="' + id + '" role="alert"></p>'; }
  // list = [{sel, bad, msg}] — marca .field.err en los campos culpables y
  // escribe el motivo del primero. Devuelve true si no hay nada mal.
  function check(errId, list) {
    var bad = null;
    list.forEach(function (c) {
      var el = $(c.sel);
      if (el) el.classList.toggle("err", !!c.bad);
      if (c.bad && !bad) bad = c;
    });
    var e = $("#" + errId);
    if (e) { e.textContent = bad ? bad.msg : ""; e.classList.toggle("show", !!bad); }
    return !bad;
  }
  var MSG_SIGMA = "σ debe ser > 0";
  var MSG_P = "p debe estar entre 0 y 1";
  var MSG_N = "n debe ser un entero ≥ 1";
  var MSG_N2 = "n debe ser un entero ≥ 2";
  var MSG_LAM = "λ debe ser ≥ 0";
  var MSG_DF = "los grados de libertad deben ser un entero ≥ 1";
  var MSG_LVL = "el nivel de confianza debe estar entre 0 y 100";

  function segHtml(id, attr, items, cur) {
    return '<div class="seg calc-seg" id="' + id + '" role="group">' + items.map(function (it) {
      return '<button type="button" data-' + attr + '="' + esc(it.id) + '"' +
        (it.id === cur ? ' class="on" aria-pressed="true"' : ' aria-pressed="false"') + ">" + it.label + "</button>";
    }).join("") + "</div>";
  }
  function wireSeg(id, attr, fn) {
    $$("#" + id + " button").forEach(function (b) {
      b.addEventListener("click", function () {
        $$("#" + id + " button").forEach(function (x) { x.classList.remove("on"); x.setAttribute("aria-pressed", "false"); });
        b.classList.add("on"); b.setAttribute("aria-pressed", "true");
        fn(b.getAttribute("data-" + attr));
      });
    });
  }
  // muestra el bloque .calc-when cuyo data-when coincide con el modo
  function showWhen(scopeSel, mode) {
    $$(scopeSel + " .calc-when").forEach(function (el) {
      el.classList.toggle("is-off", el.getAttribute("data-when") !== mode);
    });
  }

  // chips de preset: data-fields = {selector: valor}; data-click = selectores
  // de botones (separados por "|") que se pulsan ANTES de cargar los campos.
  function presetsHtml(list) {
    return '<div class="calc-presets">' + list.map(function (p) {
      return '<button type="button" class="chip-btn calc-preset" data-preset="' + esc(p.label) + '"' +
        ' data-action="calc-preset" data-fields="' + jat(p.f) + '"' +
        (p.click ? ' data-click="' + esc(p.click) + '"' : "") + ">" + esc(p.label) + "</button>";
    }).join("") + "</div>";
  }
  // botón que abre App.quickLookup: base es el estado inicial, from mapea
  // clave→selector y se lee en el momento del clic (así el buscador abre con
  // lo que hay cargado). Cuando lo que corresponde precargar no es el valor
  // crudo de un campo — gl = n − 1, el fractil 1 − α/2, o un modo que depende
  // del parámetro elegido — la tarjeta pasa un id y su función de recálculo
  // reescribe base con setLookup.
  function lookupHtml(base, from, id) {
    return '<button type="button" class="chip-btn calc-lookup" data-action="calc-lookup"' +
      (id ? ' id="' + id + '"' : "") + ' data-ql="' + jat(base) + '"' +
      ' data-ql-from="' + jat(from || {}) + '" title="Abrir el buscador de valores con estos datos">' +
      A.icon("search", 13) + "<span>Buscador de valores</span></button>";
  }
  // reescribe el data-ql de un botón "Buscador de valores". Las claves cuyo
  // valor numérico no es finito se omiten: así el buscador conserva el último
  // valor que tuviera para esa clave en vez de recibir un NaN.
  function setLookup(id, base) {
    var b = $("#" + id); if (!b) return;
    var o = {};
    Object.keys(base).forEach(function (k) {
      var v = base[k];
      if (typeof v === "number" ? isFinite(v) : v != null) o[k] = v;
    });
    b.setAttribute("data-ql", JSON.stringify(o));
  }
  // fractil bilateral 1 − α/2; NaN si α no sirve (setLookup lo descarta)
  function qBilat(alpha) { return (alpha > 0 && alpha < 1) ? 1 - alpha / 2 : NaN; }

  // nivel de confianza en % → α; NaN si el nivel no sirve
  function alphaFromLvl(sel) {
    var v = num(sel);
    if (!(v > 0 && v < 100)) return NaN;
    return 1 - v / 100;
  }
  var LVL_CHIPS = [90, 95, 99];
  function lvlChips(sel) {
    return LVL_CHIPS.map(function (v) {
      var f = {}; f[sel] = v;
      return '<button type="button" class="chip-btn calc-preset xs" data-preset="' + v + '%" data-action="calc-preset" data-fields="' + jat(f) + '">' + v + "%</button>";
    }).join("");
  }
  var ALPHA_CHIPS = [0.10, 0.05, 0.01];
  function alphaChips(sel) {
    return ALPHA_CHIPS.map(function (v) {
      var f = {}; f[sel] = v;
      return '<button type="button" class="chip-btn calc-preset xs" data-preset="alfa ' + v + '" data-action="calc-preset" data-fields="' + jat(f) + '">' + v + "</button>";
    }).join("");
  }

  // ---------- acciones globales (delegación de core.js) ----------
  A.registerAction("calc-copy", function (el) {
    var v = el.getAttribute("data-val") || "";
    if (!v || v === "—") { A.toast("No hay un resultado para copiar"); return; }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(v).then(
        function () { A.toast("Copiado al portapapeles"); },
        function () { A.toast("No se pudo copiar"); }
      );
    } else { A.toast("Portapapeles no disponible"); }
  });

  A.registerAction("calc-preset", function (el) {
    var clicks = el.getAttribute("data-click");
    if (clicks) clicks.split("|").forEach(function (s) { var b = $(s.trim()); if (b) b.click(); });
    var f = parseJ(el.getAttribute("data-fields"));
    // el orden de las claves se respeta: un preset puede cambiar primero un
    // <select> que reconstruye campos y recién después cargarlos
    Object.keys(f).forEach(function (sel) {
      var inp = $(sel); if (!inp) return;
      inp.value = String(f[sel]);
      inp.dispatchEvent(new Event("input", { bubbles: true }));
      inp.dispatchEvent(new Event("change", { bubbles: true }));
    });
  });

  A.registerAction("calc-lookup", function (el) {
    if (!A.quickLookup) { A.toast("El buscador de valores no está disponible"); return; }
    var base = parseJ(el.getAttribute("data-ql"));
    var from = parseJ(el.getAttribute("data-ql-from"));
    Object.keys(from).forEach(function (k) {
      var v = num(from[k]);
      if (isFinite(v)) base[k] = v;
    });
    A.quickLookup.open(base);
  });

  // ---------- registro de la vista ----------
  function calcSection(arg) {
    var id = String(arg || "").split("/")[0].toLowerCase();
    for (var i = 0; i < CALC_SECTIONS.length; i++) if (CALC_SECTIONS[i].id === id) return CALC_SECTIONS[i];
    return null;
  }

  A.registerView("calc", function (main, arg) {
    var sec = calcSection(arg);
    document.title = (sec ? sec.title + " · " : "") + "Calculadoras · Estudio P&E";
    A.setCrumbs(sec
      ? [{ label: "Inicio", hash: "#/inicio" }, { label: "Calculadoras", hash: "#/calc" }, { label: sec.title }]
      : [{ label: "Inicio", hash: "#/inicio" }, { label: "Resolver" }, { label: "Calculadoras" }]);
    // se arma una sola vez: ir a otra sección solo mueve el scroll
    if (!main.querySelector("#calcRoot")) buildCalc(main);
    markSubnav(sec ? sec.id : "");
    if (sec) {
      // el router hace su propio scrollTo justo después de la vista: este va después
      setTimeout(function () {
        var el = document.getElementById("calc-" + sec.id);
        if (el) el.scrollIntoView({ block: "start" });
      }, 0);
    }
  });

  function markSubnav(id) {
    $$("#calcSubnav [data-sec]").forEach(function (a) {
      a.classList.toggle("on", a.getAttribute("data-sec") === id);
    });
  }

  function subnavHtml() {
    return '<nav class="calc-subnav" id="calcSubnav" aria-label="Secciones de las calculadoras">' +
      CALC_SECTIONS.map(function (s) {
        return '<a class="chip-btn" href="#/calc/' + s.id + '" data-sec="' + s.id + '">' +
          A.icon(s.icon, 14) + "<span>" + s.label + "</span></a>";
      }).join("") + "</nav>";
  }
  function sectionHtml(s, inner) {
    return '<section class="calc-section" id="calc-' + s.id + '">' +
      '<h2 class="subsection-title">' + A.icon(s.icon, 16) + " " + s.title + "</h2>" + inner + "</section>";
  }
  function grid(inner) { return '<div class="calc-grid">' + inner + "</div>"; }

  function buildCalc(main) {
    main.innerHTML =
      '<div id="calcRoot">' +
      '<h1 class="section-title">Calculadoras</h1>' +
      '<p class="section-sub">Con las convenciones de la cátedra. Cada tarjeta muestra la fórmula que aplica, ' +
      "el resultado y los pasos con los números ya sustituidos.</p>" +
      subnavHtml() +
      sectionHtml(CALC_SECTIONS[0], grid(normalCard() + tCard() + chiCard())) +
      sectionHtml(CALC_SECTIONS[1], grid(binomCard() + poissonCard())) +
      sectionHtml(CALC_SECTIONS[2], grid(icMediaCard() + icPropCard() + icVarCard())) +
      sectionHtml(CALC_SECTIONS[3], grid(htCard())) +
      sectionHtml(CALC_SECTIONS[4], grid(nMediaCard() + nPropCard())) +
      sectionHtml(CALC_SECTIONS[5], tablesHtml()) +
      "</div>";

    // Los pasos plegados miden 0 de ancho: la placa recién se puede ajustar
    // cuando se despliegan. 'toggle' no burbujea → un handler en captura.
    var root = main.querySelector("#calcRoot");
    if (root) root.addEventListener("toggle", function (e) {
      var d = e.target;
      if (!d || !d.classList || !d.classList.contains("calc-steps") || !d.open) return;
      fitPlates(d.querySelector(".cs-body"));
    }, true);

    buildTables();     // primero las tablas: las tarjetas las resaltan al calcular
    wireNormal();
    wireT();
    wireChi();
    wireBinom();
    wirePoisson();
    wireIcMedia();
    wireIcProp();
    wireIcVar();
    wireHt();
    wireNMedia();
    wireNProp();
    fitAllPlates();    // las fórmulas fijas de cada tarjeta, ya en el DOM
  }

  // ============================================================
  //  SECCIÓN 1 · continuas
  // ============================================================
  var DIR_SEG = [{ id: "cdf", label: "valor → probabilidad" }, { id: "inv", label: "probabilidad → valor" }];

  function normalCard() {
    return '<div class="card" id="cardNormal">' +
      cardHead("Normal Φ", lookupHtml({ mode: "norm" }, {}, "n_lookup")) +
      formulaHtml("z=\\dfrac{x-\\mu}{\\sigma},\\qquad \\Phi(z)=P(Z\\le z)") +
      segHtml("n_mode", "m", DIR_SEG, "cdf") +
      '<div class="calc-2col">' + fldHtml("n_mu", "μ", 0) + fldHtml("n_sigma", "σ", 1) + "</div>" +
      '<div class="calc-when" data-when="cdf">' + fldHtml("n_x", "x", 1.96) + "</div>" +
      '<div class="calc-when is-off" data-when="inv">' + fldHtml("n_p", "p = P(X ≤ x)", 0.975, 'step="any" min="0" max="1"') + "</div>" +
      errHtml("n_err") + outHtml("n_out") + stepsHtml("n_steps") +
      presetsHtml([
        { label: "estándar (μ=0, σ=1)", click: "#n_mode [data-m='cdf']", f: { "#n_mu": 0, "#n_sigma": 1, "#n_x": 1.96 } },
        { label: "z 0.95", click: "#n_mode [data-m='inv']", f: { "#n_mu": 0, "#n_sigma": 1, "#n_p": 0.95 } },
        { label: "z 0.975", click: "#n_mode [data-m='inv']", f: { "#n_mu": 0, "#n_sigma": 1, "#n_p": 0.975 } },
        { label: "z 0.99", click: "#n_mode [data-m='inv']", f: { "#n_mu": 0, "#n_sigma": 1, "#n_p": 0.99 } }
      ]) + "</div>";
  }
  function wireNormal() {
    var mode = "cdf";
    var upd = function () {
      var mu = num("#n_mu"), sg = num("#n_sigma"), x = num("#n_x"), p = num("#n_p");
      // el buscador abre en el MISMO sentido que la tarjeta y con el campo que
      // esa dirección usa (x en directo, p en inverso), no siempre con x
      setLookup("n_lookup", { mode: "norm", dir: mode === "cdf" ? "cdf" : "inv",
        mu: mu, sigma: sg, value: mode === "cdf" ? x : p });
      var okAll = check("n_err", [
        { sel: "#n_mu", bad: !isFinite(mu), msg: "μ debe ser un número" },
        { sel: "#n_sigma", bad: !(sg > 0), msg: MSG_SIGMA },
        { sel: "#n_x", bad: mode === "cdf" && !isFinite(x), msg: "x debe ser un número" },
        { sel: "#n_p", bad: mode === "inv" && !(p > 0 && p < 1), msg: MSG_P }
      ]);
      // con σ ≤ 0 (o cualquier otro error) se limpia TODO: resultado, pasos y tablas
      if (!okAll) { setOut("n_out", "—"); setSteps("n_steps", ""); setHotZ(null); setHotZCrit(NaN); return; }
      if (mode === "cdf") {
        var z = (x - mu) / sg, pr = M.normCDF(x, mu, sg);
        setOut("n_out", fmtProb(pr));
        setSteps("n_steps",
          katex("z=\\dfrac{x-\\mu}{\\sigma}=\\dfrac{" + fmtN(x, 4) + "-" + fmtN(mu, 4) + "}{" + fmtN(sg, 4) + "}=" + fmtN(z, 4), true) +
          katex("\\Phi(" + fmtN(z, 4) + ")=" + fmtProb(pr), true) +
          '<p class="calc-note">' + A.rich("Cola superior: $P(X>x)=1-\\Phi(z)=" + fmtProb(M.normSF(x, mu, sg)) + "$.") + "</p>");
        setHotZ(z);
        setHotZCrit(NaN);
      } else {
        var zp = M.normInv(p), xv = mu + sg * zp;
        var lect = alphaNota(p, true);
        setOut("n_out", fmtN(xv, 6));
        setSteps("n_steps",
          katex("z_p=\\Phi^{-1}(" + fmtN(p, 6) + ")=" + fmtN(zp, 4), true) +
          katex("x=\\mu+\\sigma z_p=" + fmtN(mu, 4) + "+" + fmtN(sg, 4) + "\\cdot" + fmtN(zp, 4) + "=" + fmtN(xv, 6), true) +
          (lect ? '<p class="calc-note">' + A.rich(lect) + "</p>" : ""));
        setHotZ(zp);
        setHotZCrit(p);
      }
    };
    wireSeg("n_mode", "m", function (v) { mode = v; showWhen("#cardNormal", mode); upd(); });
    ["#n_mu", "#n_sigma", "#n_x", "#n_p"].forEach(function (s) { var el = $(s); if (el) el.addEventListener("input", upd); });
    upd();
  }

  function tCard() {
    return '<div class="card" id="cardT">' +
      cardHead("t de Student", lookupHtml({ mode: "t" }, {}, "t_lookup")) +
      formulaHtml("T\\sim t_{m},\\qquad P(T\\le t)") +
      segHtml("t_mode", "m", DIR_SEG, "cdf") +
      fldHtml("t_df", "grados de libertad (m)", 10, 'min="1" step="1"') +
      '<div class="calc-when" data-when="cdf">' + fldHtml("t_x", "t", 2.2281) + "</div>" +
      '<div class="calc-when is-off" data-when="inv">' + fldHtml("t_p", "p = P(T ≤ t)", 0.975, 'step="any" min="0" max="1"') + "</div>" +
      errHtml("t_err") + outHtml("t_out") + stepsHtml("t_steps") +
      presetsHtml([
        { label: "m=9, p=0.975", click: "#t_mode [data-m='inv']", f: { "#t_df": 9, "#t_p": 0.975 } },
        { label: "m=14, p=0.975", click: "#t_mode [data-m='inv']", f: { "#t_df": 14, "#t_p": 0.975 } },
        { label: "m=24, p=0.95", click: "#t_mode [data-m='inv']", f: { "#t_df": 24, "#t_p": 0.95 } }
      ]) + "</div>";
  }
  function wireT() {
    var mode = "cdf";
    var upd = function () {
      var df = inum("#t_df"), x = num("#t_x"), p = num("#t_p");
      setLookup("t_lookup", { mode: "t", dir: mode === "cdf" ? "cdf" : "inv",
        df: df, value: mode === "cdf" ? x : p });
      var okAll = check("t_err", [
        { sel: "#t_df", bad: !(df >= 1), msg: MSG_DF },
        { sel: "#t_x", bad: mode === "cdf" && !isFinite(x), msg: "t debe ser un número" },
        { sel: "#t_p", bad: mode === "inv" && !(p > 0 && p < 1), msg: MSG_P }
      ]);
      if (!okAll) { setOut("t_out", "—"); setSteps("t_steps", ""); setHotT(NaN, NaN, "t"); return; }
      if (mode === "cdf") {
        var pr = M.tCDF(x, df);
        setOut("t_out", fmtProb(pr));
        setSteps("t_steps",
          katex("P(T\\le " + fmtN(x, 4) + ")=" + fmtProb(pr) + "\\quad\\text{con } m=" + df, true) +
          '<p class="calc-note">' + A.rich("La $t$ es simétrica: $P(T\\le -t)=1-P(T\\le t)=" + fmtProb(1 - pr) + "$." +
            (x < 0 ? " En la tabla de $t$ críticos se resalta $|t|$, por simetría." : "")) + "</p>");
        // la tabla solo tiene columnas de cola chica: se busca por min(p, 1−p)
        setHotT(df, Math.min(pr, 1 - pr), "t");
      } else {
        var tv = M.tInv(p, df);
        var lectT = alphaNota(p, true);
        setOut("t_out", fmtN(tv, 6));
        setSteps("t_steps",
          katex("t_{" + df + ",\\," + fmtN(p, 6) + "}=" + fmtN(tv, 4), true) +
          (lectT ? '<p class="calc-note">' + A.rich(lectT) + "</p>" : ""));
        setHotT(df, Math.min(p, 1 - p), "t");
      }
    };
    wireSeg("t_mode", "m", function (v) { mode = v; showWhen("#cardT", mode); upd(); });
    ["#t_df", "#t_x", "#t_p"].forEach(function (s) { var el = $(s); if (el) el.addEventListener("input", upd); });
    upd();
  }

  function chiCard() {
    return '<div class="card" id="cardChi">' +
      cardHead("Ji-cuadrado χ²", lookupHtml({ mode: "chi2" }, {}, "c_lookup")) +
      formulaHtml("X\\sim\\chi^2_{k},\\qquad P(X\\le x)") +
      segHtml("c_mode", "m", DIR_SEG, "cdf") +
      fldHtml("c_df", "grados de libertad (k)", 10, 'min="1" step="1"') +
      '<div class="calc-when" data-when="cdf">' + fldHtml("c_x", "x", 18.307) + "</div>" +
      '<div class="calc-when is-off" data-when="inv">' + fldHtml("c_p", "p = P(X ≤ x)", 0.95, 'step="any" min="0" max="1"') + "</div>" +
      errHtml("c_err") + outHtml("c_out") + stepsHtml("c_steps") +
      '<p class="calc-note">La χ² NO es simétrica: un intervalo bilateral necesita los dos fractiles, ' +
      A.rich("$\\chi^2_{k,\\,\\alpha/2}$ y $\\chi^2_{k,\\,1-\\alpha/2}$") + ".</p>" +
      presetsHtml([
        { label: "k=9, p=0.975", click: "#c_mode [data-m='inv']", f: { "#c_df": 9, "#c_p": 0.975 } },
        { label: "k=9, p=0.025", click: "#c_mode [data-m='inv']", f: { "#c_df": 9, "#c_p": 0.025 } },
        { label: "k=19, p=0.95", click: "#c_mode [data-m='inv']", f: { "#c_df": 19, "#c_p": 0.95 } }
      ]) + "</div>";
  }
  function wireChi() {
    var mode = "cdf";
    var upd = function () {
      var k = inum("#c_df"), x = num("#c_x"), p = num("#c_p");
      setLookup("c_lookup", { mode: "chi2", dir: mode === "cdf" ? "cdf" : "inv",
        df: k, value: mode === "cdf" ? x : p });
      var okAll = check("c_err", [
        { sel: "#c_df", bad: !(k >= 1), msg: MSG_DF },
        { sel: "#c_x", bad: mode === "cdf" && !(x >= 0), msg: "x debe ser un número ≥ 0" },
        { sel: "#c_p", bad: mode === "inv" && !(p > 0 && p < 1), msg: MSG_P }
      ]);
      if (!okAll) { setOut("c_out", "—"); setSteps("c_steps", ""); setHotChi(NaN, NaN); return; }
      if (mode === "cdf") {
        var pr = M.chi2CDF(x, k);
        setOut("c_out", fmtProb(pr));
        setSteps("c_steps",
          katex("P(\\chi^2_{" + k + "}\\le " + fmtN(x, 4) + ")=" + fmtProb(pr), true) +
          '<p class="calc-note">' + A.rich("Cola superior: $P(X>x)=" + fmtProb(1 - pr) + "$.") + "</p>");
        setHotChi(k, pr);
      } else {
        var xv = M.chi2Inv(p, k);
        // la χ² no es simétrica: el α bilateral NO es el doble del unilateral
        var lectC = alphaNota(p, false);
        setOut("c_out", fmtN(xv, 6));
        setSteps("c_steps", katex("\\chi^2_{" + k + ",\\," + fmtN(p, 6) + "}=" + fmtN(xv, 4), true) +
          (lectC ? '<p class="calc-note">' + A.rich(lectC) + "</p>" : ""));
        setHotChi(k, p);
      }
    };
    wireSeg("c_mode", "m", function (v) { mode = v; showWhen("#cardChi", mode); upd(); });
    ["#c_df", "#c_x", "#c_p"].forEach(function (s) { var el = $(s); if (el) el.addEventListener("input", upd); });
    upd();
  }

  // ============================================================
  //  SECCIÓN 2 · discretas
  // ============================================================
  var DISC_SEG = [{ id: "prob", label: "P(X…)" }, { id: "quant", label: "cuantil" }];

  // k! para los pasos: exacto hasta 20, después como potencia de 10
  function factTex(k) {
    if (k <= 20) { var f = 1; for (var i = 2; i <= k; i++) f *= i; return String(f); }
    return "10^{" + fmtN(M.lfact(k) / Math.LN10, 2) + "}";
  }
  function powTex(base, e, val) {
    return fmtN(base, 4) + "^{" + e + "}=" + (isFinite(val) && val !== 0 && Math.abs(val) < 1e-4 ? val.toExponential(4) : fmtN(val, 8));
  }

  function binomCard() {
    return '<div class="card" id="cardBinom">' +
      cardHead("Binomial(n, p)", lookupHtml({ mode: "binom" }, {}, "bi_lookup")) +
      formulaHtml("P(X=k)=\\binom{n}{k}p^{k}(1-p)^{\\,n-k}") +
      segHtml("bi_mode", "m", DISC_SEG, "prob") +
      '<div class="calc-3col">' +
        fldHtml("bi_n", "n", 20, 'min="1" step="1"') +
        fldHtml("bi_p", "p", 0.4, 'step="any" min="0" max="1"') +
        '<div class="calc-when" data-when="prob">' + fldHtml("bi_k", "k", 8, 'min="0" step="1"') + "</div>" +
        '<div class="calc-when is-off" data-when="quant">' + fldHtml("bi_q", "p objetivo", 0.95, 'step="any" min="0" max="1"') + "</div>" +
      "</div>" +
      errHtml("bi_err") + outHtml("bi_out") +
      '<div class="calc-triple calc-when" data-when="prob">' + ctpRow("bi_le", "P(X\\le k)") + ctpRow("bi_ge", "P(X\\ge k)") + "</div>" +
      stepsHtml("bi_steps") +
      presetsHtml([
        { label: "n=20, p=0.4, k=8", click: "#bi_mode [data-m='prob']", f: { "#bi_n": 20, "#bi_p": 0.4, "#bi_k": 8 } },
        { label: "n=10, p=0.5, k=3", click: "#bi_mode [data-m='prob']", f: { "#bi_n": 10, "#bi_p": 0.5, "#bi_k": 3 } },
        { label: "n=100, p=0.02, k=0", click: "#bi_mode [data-m='prob']", f: { "#bi_n": 100, "#bi_p": 0.02, "#bi_k": 0 } },
        { label: "cuantil 0.95", click: "#bi_mode [data-m='quant']", f: { "#bi_n": 20, "#bi_p": 0.4, "#bi_q": 0.95 } }
      ]) + "</div>";
  }
  function wireBinom() {
    var mode = "prob";
    var upd = function () {
      var n = inum("#bi_n"), p = num("#bi_p"), k = inum("#bi_k"), q = num("#bi_q");
      setLookup("bi_lookup", { mode: "binom", dir: mode === "prob" ? "cdf" : "inv",
        n: n, p: p, value: mode === "prob" ? k : q });
      var okAll = check("bi_err", [
        { sel: "#bi_n", bad: !(n >= 1), msg: MSG_N },
        { sel: "#bi_p", bad: !(p >= 0 && p <= 1), msg: MSG_P },
        // k > n no da error de cálculo (P(X=k)=0) pero los pasos quedan absurdos:
        // (n sobre k)=0 y (1−p)^{n−k} con exponente negativo
        { sel: "#bi_k", bad: mode === "prob" && (!(k >= 0) || (n >= 1 && k > n)), msg: "k debe ser un entero entre 0 y n" },
        { sel: "#bi_q", bad: mode === "quant" && !(q > 0 && q <= 1), msg: "el p objetivo debe estar entre 0 y 1" }
      ]);
      if (!okAll) { setOut("bi_out", "—"); setCtp("bi_le", "—"); setCtp("bi_ge", "—"); setSteps("bi_steps", ""); return; }
      var degen = (p === 0 || p === 1)
        ? '<p class="calc-note">' + (p === 0 ? "Con p = 0 la variable es degenerada: toda la masa está en k = 0."
          : "Con p = 1 la variable es degenerada: toda la masa está en k = n.") + "</p>" : "";
      if (mode === "prob") {
        var eq = M.binomPMF(k, n, p), le = M.binomCDF(k, n, p), ge = M.binomSF(k, n, p);
        setOut("bi_out", fmtProb(eq));
        setCtp("bi_le", fmtProb(le));
        setCtp("bi_ge", fmtProb(ge));
        var cb = M.comb(n, k), pk = Math.pow(p, k), qk = Math.pow(1 - p, n - k);
        var cbTex = isFinite(cb) ? (cb >= 1e15 ? cb.toExponential(4) : String(Math.round(cb))) : "10^{" + fmtN(M.combLog(n, k) / Math.LN10, 2) + "}";
        setSteps("bi_steps",
          katex("\\binom{" + n + "}{" + k + "}=" + cbTex, true) +
          katex("p^{k}=" + powTex(p, k, pk), true) +
          katex("(1-p)^{\\,n-k}=" + powTex(1 - p, n - k, qk), true) +
          katex("P(X=" + k + ")=" + fmtProb(eq), true) +
          '<p class="calc-note">' + A.rich("$P(X\\ge k)$ se calcula sumando la cola superior, no como $1-P(X\\le k-1)$: esa resta pierde dígitos en la cola derecha.") + "</p>" + degen);
      } else {
        var kq = M.binomInv(q, n, p);
        var below = kq > 0 ? M.binomCDF(kq - 1, n, p) : 0;
        setOut("bi_out", String(kq));
        setSteps("bi_steps",
          katex("k_{" + fmtN(q, 4) + "}=\\min\\{k: P(X\\le k)\\ge " + fmtN(q, 4) + "\\}=" + kq, true) +
          katex("P(X\\le " + (kq - 1) + ")=" + fmtProb(below) + "<" + fmtN(q, 4) + "\\le P(X\\le " + kq + ")=" + fmtProb(M.binomCDF(kq, n, p)), true) + degen);
        setCtp("bi_le", "—"); setCtp("bi_ge", "—");
      }
    };
    wireSeg("bi_mode", "m", function (v) { mode = v; showWhen("#cardBinom", mode); upd(); });
    ["#bi_n", "#bi_p", "#bi_k", "#bi_q"].forEach(function (s) { var el = $(s); if (el) el.addEventListener("input", upd); });
    upd();
  }

  function poissonCard() {
    return '<div class="card" id="cardPois">' +
      cardHead("Poisson(λ)", lookupHtml({ mode: "pois" }, {}, "po_lookup")) +
      formulaHtml("P(X=k)=\\dfrac{e^{-\\lambda}\\lambda^{k}}{k!}") +
      segHtml("po_mode", "m", DISC_SEG, "prob") +
      '<div class="calc-2col">' +
        fldHtml("po_lam", "λ", 4, 'step="any" min="0"') +
        '<div class="calc-when" data-when="prob">' + fldHtml("po_k", "k", 3, 'min="0" step="1"') + "</div>" +
        '<div class="calc-when is-off" data-when="quant">' + fldHtml("po_q", "p objetivo", 0.95, 'step="any" min="0" max="1"') + "</div>" +
      "</div>" +
      errHtml("po_err") + outHtml("po_out") +
      '<div class="calc-triple calc-when" data-when="prob">' + ctpRow("po_le", "P(X\\le k)") + ctpRow("po_ge", "P(X\\ge k)") + "</div>" +
      stepsHtml("po_steps") +
      presetsHtml([
        { label: "λ=4, k=3", click: "#po_mode [data-m='prob']", f: { "#po_lam": 4, "#po_k": 3 } },
        { label: "λ=2.5, k=0", click: "#po_mode [data-m='prob']", f: { "#po_lam": 2.5, "#po_k": 0 } },
        { label: "cuantil 0.95", click: "#po_mode [data-m='quant']", f: { "#po_lam": 4, "#po_q": 0.95 } }
      ]) + "</div>";
  }
  function wirePoisson() {
    var mode = "prob";
    var upd = function () {
      var lam = num("#po_lam"), k = inum("#po_k"), q = num("#po_q");
      setLookup("po_lookup", { mode: "pois", dir: mode === "prob" ? "cdf" : "inv",
        lam: lam, value: mode === "prob" ? k : q });
      var okAll = check("po_err", [
        { sel: "#po_lam", bad: !(lam >= 0), msg: MSG_LAM },
        { sel: "#po_k", bad: mode === "prob" && !(k >= 0), msg: "k debe ser un entero ≥ 0" },
        { sel: "#po_q", bad: mode === "quant" && !(q > 0 && q < 1), msg: "el p objetivo debe estar entre 0 y 1" }
      ]);
      if (!okAll) { setOut("po_out", "—"); setCtp("po_le", "—"); setCtp("po_ge", "—"); setSteps("po_steps", ""); return; }
      var degen = lam === 0 ? '<p class="calc-note">Con λ = 0 la variable es degenerada: toda la masa está en k = 0.</p>' : "";
      if (mode === "prob") {
        var eq = M.poissonPMF(k, lam), le = M.poissonCDF(k, lam), ge = M.poissonSF(k, lam);
        setOut("po_out", fmtProb(eq));
        setCtp("po_le", fmtProb(le));
        setCtp("po_ge", fmtProb(ge));
        var ex = Math.exp(-lam), lk = Math.pow(lam, k);
        setSteps("po_steps",
          katex("e^{-\\lambda}=e^{-" + fmtN(lam, 4) + "}=" + (ex !== 0 && ex < 1e-4 ? ex.toExponential(4) : fmtN(ex, 8)), true) +
          katex("\\lambda^{k}=" + powTex(lam, k, lk), true) +
          katex("k!=" + factTex(k), true) +
          katex("P(X=" + k + ")=\\dfrac{e^{-\\lambda}\\lambda^{k}}{k!}=" + fmtProb(eq), true) +
          '<p class="calc-note">' + A.rich("$P(X\\ge k)$ se suma directamente en la cola superior.") + "</p>" + degen);
      } else {
        var kq = M.poissonInv(q, lam);
        var below = kq > 0 ? M.poissonCDF(kq - 1, lam) : 0;
        setOut("po_out", isFinite(kq) ? String(kq) : "—");
        setSteps("po_steps",
          katex("k_{" + fmtN(q, 4) + "}=\\min\\{k: P(X\\le k)\\ge " + fmtN(q, 4) + "\\}=" + kq, true) +
          katex("P(X\\le " + (kq - 1) + ")=" + fmtProb(below) + "<" + fmtN(q, 4) + "\\le P(X\\le " + kq + ")=" + fmtProb(M.poissonCDF(kq, lam)), true) + degen);
        setCtp("po_le", "—"); setCtp("po_ge", "—");
      }
    };
    wireSeg("po_mode", "m", function (v) { mode = v; showWhen("#cardPois", mode); upd(); });
    ["#po_lam", "#po_k", "#po_q"].forEach(function (s) { var el = $(s); if (el) el.addEventListener("input", upd); });
    upd();
  }

  // ============================================================
  //  SECCIÓN 3 · intervalos de confianza
  // ============================================================
  function icMediaCard() {
    return '<div class="card" id="cardIcm">' +
      cardHead("IC para la media μ", lookupHtml({ mode: "norm", dir: "inv" }, {}, "icm_lookup")) +
      // el selector de modo va ANTES de los campos: decide si el tercer campo es σ o S
      segHtml("icm_mode", "m", [{ id: "z", label: "σ conocido (z)" }, { id: "t", label: "σ desconocido (t · usar S)" }], "z") +
      formulaHtml("\\bar x \\pm z_{1-\\alpha/2}\\dfrac{\\sigma}{\\sqrt n}", "icm_formula") +
      '<div class="calc-2col">' + fldHtml("icm_xbar", "x̄ (media muestral)", 50) + fldHtml("icm_n", "n", 25, 'min="2" step="1"') + "</div>" +
      '<div class="calc-2col">' +
        '<div class="ex-fld"><label class="lbl" id="icm_sdlbl" for="icm_sd">σ (conocido)</label>' +
        '<input type="text" inputmode="decimal" autocomplete="off" class="field" id="icm_sd" value="8" min="0"></div>' +
        fldHtml("icm_lvl", "nivel de confianza (%)", 95, 'step="any" min="0" max="100"') +
      "</div>" +
      '<div class="calc-presets">' + lvlChips("#icm_lvl") + "</div>" +
      errHtml("icm_err") + outHtml("icm_out", "tex") + stepsHtml("icm_steps") +
      '<p class="calc-note" id="icm_tabla"></p></div>';
  }
  function wireIcMedia() {
    var mode = "z";
    var upd = function () {
      var xbar = num("#icm_xbar"), n = inum("#icm_n"), sd = num("#icm_sd"), alpha = alphaFromLvl("#icm_lvl");
      var lbl = $("#icm_sdlbl"); if (lbl) lbl.textContent = mode === "z" ? "σ (conocido)" : "S (muestral)";
      setFormula("icm_formula", mode === "z"
        ? "\\bar x \\pm z_{1-\\alpha/2}\\dfrac{\\sigma}{\\sqrt n}"
        : "\\bar x \\pm t_{n-1,\\,1-\\alpha/2}\\dfrac{S}{\\sqrt n}");
      // el buscador abre con la distribución que la tarjeta está usando:
      // z con el fractil 1 − α/2, o t con gl = n − 1
      setLookup("icm_lookup", mode === "z"
        ? { mode: "norm", dir: "inv", mu: 0, sigma: 1, value: qBilat(alpha) }
        : { mode: "t", dir: "inv", df: n - 1, value: qBilat(alpha) });
      var okAll = check("icm_err", [
        { sel: "#icm_xbar", bad: !isFinite(xbar), msg: "x̄ debe ser un número" },
        { sel: "#icm_n", bad: !(n >= 2), msg: MSG_N2 },
        { sel: "#icm_sd", bad: !(sd > 0), msg: mode === "z" ? MSG_SIGMA : "S debe ser > 0" },
        { sel: "#icm_lvl", bad: !isFinite(alpha), msg: MSG_LVL }
      ]);
      var tabla = $("#icm_tabla");
      if (!okAll) { setOut("icm_out", "—"); setSteps("icm_steps", ""); if (tabla) tabla.textContent = ""; setHotT(NaN, NaN, "icm"); return; }
      var crit, critTex, tablaTxt;
      if (mode === "z") {
        crit = M.normInv(1 - alpha / 2);
        critTex = "z_{1-\\alpha/2}=z_{" + fmtN(1 - alpha / 2, 4) + "}=" + fmtN(crit, 4);
        tablaTxt = "En la tabla de fractiles z: z crítico " + fmtN(crit, 4) + " (α = " + fmtN(alpha, 4) + ", dos colas).";
      } else {
        crit = M.tInv(1 - alpha / 2, n - 1);
        critTex = "t_{" + (n - 1) + ",\\,1-\\alpha/2}=" + fmtN(crit, 4);
        tablaTxt = "En la tabla de t críticos: fila m = " + (n - 1) + ", columna α = " + fmtN(alpha / 2, 4) + " ⇒ " + fmtN(crit, 4) + ".";
      }
      var err = crit * sd / Math.sqrt(n), lo = xbar - err, hi = xbar + err;
      setOut("icm_out", "[" + fmtN(lo, 4) + ", " + fmtN(hi, 4) + "]", katex("[" + fmtN(lo, 4) + ",\\; " + fmtN(hi, 4) + "]"));
      setSteps("icm_steps",
        katex("\\alpha=1-" + fmtN(1 - alpha, 4) + "=" + fmtN(alpha, 4), true) +
        katex(critTex, true) +
        katex("\\text{margen}=" + fmtN(crit, 4) + "\\cdot\\dfrac{" + fmtN(sd, 4) + "}{\\sqrt{" + n + "}}=" + fmtN(err, 4), true) +
        katex("IC=" + fmtN(xbar, 4) + "\\pm" + fmtN(err, 4) + "=[" + fmtN(lo, 4) + ",\\; " + fmtN(hi, 4) + "]", true));
      if (tabla) tabla.textContent = tablaTxt;
      // en modo z la tarjeta ya no usa la tabla de t: apaga SU resaltado
      setHotT(mode === "t" ? n - 1 : NaN, mode === "t" ? alpha / 2 : NaN, "icm");
    };
    wireSeg("icm_mode", "m", function (v) { mode = v; upd(); });
    ["#icm_xbar", "#icm_n", "#icm_sd", "#icm_lvl"].forEach(function (s) { var el = $(s); if (el) el.addEventListener("input", upd); });
    upd();
  }

  function icPropCard() {
    return '<div class="card" id="cardIcp">' +
      cardHead("IC para una proporción p", lookupHtml({ mode: "norm", dir: "inv" }, {}, "icp_lookup")) +
      formulaHtml("\\hat p \\pm z_{1-\\alpha/2}\\sqrt{\\dfrac{\\hat p\\,\\hat q}{n}}") +
      '<div class="calc-2col">' + fldHtml("icp_phat", "p̂ (proporción)", 0.4, 'step="any" min="0" max="1"') + fldHtml("icp_n", "n", 200, 'min="1" step="1"') + "</div>" +
      fldHtml("icp_lvl", "nivel de confianza (%)", 95, 'step="any" min="0" max="100"') +
      '<div class="calc-presets">' + lvlChips("#icp_lvl") + "</div>" +
      errHtml("icp_err") + outHtml("icp_out", "tex") + stepsHtml("icp_steps") +
      '<p class="calc-note" id="icp_tabla"></p></div>';
  }
  function wireIcProp() {
    var upd = function () {
      var ph = num("#icp_phat"), n = inum("#icp_n"), alpha = alphaFromLvl("#icp_lvl");
      setLookup("icp_lookup", { mode: "norm", dir: "inv", mu: 0, sigma: 1, value: qBilat(alpha) });
      var okAll = check("icp_err", [
        { sel: "#icp_phat", bad: !(ph >= 0 && ph <= 1), msg: "p̂ debe estar entre 0 y 1" },
        { sel: "#icp_n", bad: !(n >= 1), msg: MSG_N },
        { sel: "#icp_lvl", bad: !isFinite(alpha), msg: MSG_LVL }
      ]);
      var tabla = $("#icp_tabla");
      if (!okAll) { setOut("icp_out", "—"); setSteps("icp_steps", ""); if (tabla) tabla.textContent = ""; return; }
      var z = M.normInv(1 - alpha / 2), se = Math.sqrt(ph * (1 - ph) / n), err = z * se;
      var lo = Math.max(0, ph - err), hi = Math.min(1, ph + err);
      // la condición real de la aproximación normal es n·p̂ ≥ 5 y n·(1−p̂) ≥ 5,
      // no "n ≥ 30": con p̂ = 0 o 1 el error estándar es 0 y el IC es un punto
      var nph = n * ph, nqh = n * (1 - ph), aviso = "";
      if (ph === 0 || ph === 1) {
        aviso = "Con p̂ = " + fmtN(ph, 4) + " el error estándar vale 0 y el intervalo degenera a un punto: la aproximación normal no sirve en este caso.";
      } else if (nph < 5 || nqh < 5) {
        aviso = "n·p̂ = " + fmtN(nph, 2) + " y n·(1−p̂) = " + fmtN(nqh, 2) + ": con alguno de los dos por debajo de 5 la aproximación normal no es válida.";
      } else if (n < 30) {
        aviso = "n chico: la aproximación normal puede fallar.";
      }
      setOut("icp_out", "[" + fmtN(lo, 4) + ", " + fmtN(hi, 4) + "]", katex("[" + fmtN(lo, 4) + ",\\; " + fmtN(hi, 4) + "]"));
      setSteps("icp_steps",
        katex("\\alpha=" + fmtN(alpha, 4) + ",\\qquad z_{1-\\alpha/2}=" + fmtN(z, 4), true) +
        katex("\\sqrt{\\dfrac{\\hat p\\hat q}{n}}=\\sqrt{\\dfrac{" + fmtN(ph, 4) + "\\cdot" + fmtN(1 - ph, 4) + "}{" + n + "}}=" + fmtN(se, 5), true) +
        katex("\\text{margen}=" + fmtN(z, 4) + "\\cdot" + fmtN(se, 5) + "=" + fmtN(err, 5), true) +
        (aviso ? '<p class="calc-note">' + aviso + "</p>" : ""));
      if (tabla) tabla.textContent = "En la tabla de fractiles z: z crítico " + fmtN(z, 4) + " (α = " + fmtN(alpha, 4) + ", dos colas).";
    };
    ["#icp_phat", "#icp_n", "#icp_lvl"].forEach(function (s) { var el = $(s); if (el) el.addEventListener("input", upd); });
    upd();
  }

  function icVarCard() {
    return '<div class="card" id="cardIcv">' +
      cardHead("IC para σ² y σ", lookupHtml({ mode: "chi2", dir: "inv" }, {}, "icv_lookup")) +
      formulaHtml("\\left[\\dfrac{(n-1)S^2}{\\chi^2_{n-1,\\,1-\\alpha/2}},\\;\\dfrac{(n-1)S^2}{\\chi^2_{n-1,\\,\\alpha/2}}\\right]") +
      '<div class="calc-2col">' + fldHtml("icv_n", "n", 20, 'min="2" step="1"') + fldHtml("icv_s", "S (desvío muestral)", 3.2, 'step="any" min="0"') + "</div>" +
      fldHtml("icv_lvl", "nivel de confianza (%)", 95, 'step="any" min="0" max="100"') +
      '<div class="calc-presets">' + lvlChips("#icv_lvl") + "</div>" +
      errHtml("icv_err") +
      '<p class="lbl calc-lbl">IC para σ²</p>' + outHtml("icv_out", "tex") +
      '<p class="lbl calc-lbl">IC para σ</p>' + outHtml("icv_outsd", "tex sm") +
      stepsHtml("icv_steps") +
      '<p class="calc-note">La χ² no es simétrica: el intervalo usa dos fractiles distintos y no queda centrado en S². ' +
      "El fractil grande va en el denominador del extremo izquierdo.</p></div>";
  }
  function wireIcVar() {
    var upd = function () {
      var n = inum("#icv_n"), s = num("#icv_s"), alpha = alphaFromLvl("#icv_lvl");
      // la tarjeta trabaja con χ² de n − 1 grados de libertad: el buscador tiene que
      // abrir con los mismos gl, no con n
      setLookup("icv_lookup", { mode: "chi2", dir: "inv", df: n - 1, value: qBilat(alpha) });
      var okAll = check("icv_err", [
        { sel: "#icv_n", bad: !(n >= 2), msg: MSG_N2 },
        { sel: "#icv_s", bad: !(s > 0), msg: "S debe ser > 0" },
        { sel: "#icv_lvl", bad: !isFinite(alpha), msg: MSG_LVL }
      ]);
      if (!okAll) { setOut("icv_out", "—"); setOut("icv_outsd", "—"); setSteps("icv_steps", ""); return; }
      var df = n - 1, sq = df * s * s;
      var chiHi = M.chi2Inv(1 - alpha / 2, df), chiLo = M.chi2Inv(alpha / 2, df);
      var lo = sq / chiHi, hi = sq / chiLo;
      setOut("icv_out", "[" + fmtN(lo, 4) + ", " + fmtN(hi, 4) + "]", katex("[" + fmtN(lo, 4) + ",\\; " + fmtN(hi, 4) + "]"));
      setOut("icv_outsd", "[" + fmtN(Math.sqrt(lo), 4) + ", " + fmtN(Math.sqrt(hi), 4) + "]",
        katex("[" + fmtN(Math.sqrt(lo), 4) + ",\\; " + fmtN(Math.sqrt(hi), 4) + "]"));
      setSteps("icv_steps",
        katex("(n-1)S^2=" + df + "\\cdot" + fmtN(s, 4) + "^2=" + fmtN(sq, 4), true) +
        katex("\\chi^2_{" + df + ",\\," + fmtN(1 - alpha / 2, 4) + "}=" + fmtN(chiHi, 4) + ",\\qquad \\chi^2_{" + df + ",\\," + fmtN(alpha / 2, 4) + "}=" + fmtN(chiLo, 4), true) +
        katex("IC(\\sigma^2)=\\left[\\dfrac{" + fmtN(sq, 4) + "}{" + fmtN(chiHi, 4) + "},\\;\\dfrac{" + fmtN(sq, 4) + "}{" + fmtN(chiLo, 4) + "}\\right]=[" + fmtN(lo, 4) + ",\\; " + fmtN(hi, 4) + "]", true) +
        katex("IC(\\sigma)=\\left[\\sqrt{" + fmtN(lo, 4) + "},\\;\\sqrt{" + fmtN(hi, 4) + "}\\,\\right]=[" + fmtN(Math.sqrt(lo), 4) + ",\\; " + fmtN(Math.sqrt(hi), 4) + "]", true));
      setHotChi(df, 1 - alpha / 2);
    };
    ["#icv_n", "#icv_s", "#icv_lvl"].forEach(function (s) { var el = $(s); if (el) el.addEventListener("input", upd); });
    upd();
  }

  // ============================================================
  //  SECCIÓN 4 · prueba de hipótesis
  // ============================================================
  // fórmula simbólica del estadístico, según el parámetro elegido
  var HT_FORMULA = {
    media_z: "Z=\\dfrac{\\bar x-\\mu_0}{\\sigma/\\sqrt n}\\;\\sim\\;N(0,1)",
    media_t: "T=\\dfrac{\\bar x-\\mu_0}{S/\\sqrt n}\\;\\sim\\;t_{n-1}",
    prop: "Z=\\dfrac{\\hat p-p_0}{\\sqrt{p_0(1-p_0)/n}}\\;\\sim\\;N(0,1)",
    "var": "\\chi^2=\\dfrac{(n-1)S^2}{\\sigma_0^2}\\;\\sim\\;\\chi^2_{n-1}"
  };
  // estado inicial del buscador de valores para el test activo: el fractil
  // crítico que la tarjeta acaba de usar, en la distribución que corresponde
  function htLookupBase(param, alt, alpha, n) {
    var ok = alpha > 0 && alpha < 1;
    var q = ok ? (alt === "ne" ? 1 - alpha / 2 : 1 - alpha) : NaN;
    if (param === "media_t") return { mode: "t", dir: "inv", df: n - 1, value: q };
    if (param === "var") {
      return { mode: "chi2", dir: "inv", df: n - 1,
        value: ok ? (alt === "ne" ? 1 - alpha / 2 : alt === "gt" ? 1 - alpha : alpha) : NaN };
    }
    return { mode: "norm", dir: "inv", mu: 0, sigma: 1, value: q };
  }

  function htCard() {
    return '<div class="card ht-card" id="cardHt">' +
      cardHead("Prueba de hipótesis", lookupHtml({ mode: "norm", dir: "inv" }, {}, "ht_lookup")) +
      formulaHtml(HT_FORMULA.media_z, "ht_formula") +
      '<div class="ht-row">' +
        '<div class="ex-fld"><label class="lbl" for="ht_param">Parámetro</label>' +
          '<select class="field" id="ht_param"><option value="media_z">Media μ (σ conocido)</option>' +
          '<option value="media_t">Media μ (σ desconocido)</option>' +
          '<option value="prop">Proporción p</option>' +
          '<option value="var">Varianza σ²</option></select></div>' +
        '<div class="ex-fld"><label class="lbl" for="ht_alt">H₁</label>' +
          '<select class="field" id="ht_alt"><option value="ne">≠ (dos colas)</option><option value="gt">&gt; (cola der.)</option><option value="lt">&lt; (cola izq.)</option></select></div>' +
        '<div class="ex-fld"><label class="lbl" for="ht_alpha">α</label>' +
          '<input type="text" inputmode="decimal" autocomplete="off" class="field" id="ht_alpha" value="0.05" min="0" max="1">' +
          '<div class="calc-presets">' + alphaChips("#ht_alpha") + "</div></div>" +
      "</div>" +
      '<div class="ht-row" id="ht_data"></div>' +
      errHtml("ht_err") +
      '<div class="ht-outs">' +
        '<div><p class="lbl calc-lbl">Estadístico observado</p>' + outHtml("ht_stat") + "</div>" +
        '<div><p class="lbl calc-lbl">valor-p</p>' + outHtml("ht_pval") + "</div>" +
      "</div>" +
      '<div id="ht_dec"></div>' +
      stepsHtml("ht_steps", true) +
      '<div id="ht_notes"></div>' +
      presetsHtml([
        { label: "media, σ conocido, 2 colas", f: { "#ht_param": "media_z", "#ht_alt": "ne", "#ht_alpha": 0.05, "#ht_xbar": 103, "#ht_mu0": 100, "#ht_sd": 10, "#ht_n": 36 } },
        { label: "media, σ desconocido, cola der.", f: { "#ht_param": "media_t", "#ht_alt": "gt", "#ht_alpha": 0.05, "#ht_xbar": 12.4, "#ht_mu0": 12, "#ht_sd": 0.8, "#ht_n": 16 } },
        { label: "proporción, cola der.", f: { "#ht_param": "prop", "#ht_alt": "gt", "#ht_alpha": 0.05, "#ht_phat": 0.55, "#ht_p0": 0.5, "#ht_n": 150 } },
        { label: "varianza, 2 colas", f: { "#ht_param": "var", "#ht_alt": "ne", "#ht_alpha": 0.05, "#ht_s": 3.2, "#ht_sig0": 2.5, "#ht_n": 20 } }
      ]) + "</div>";
  }
  function htDataInputs(param) {
    if (param === "prop") {
      return dataFld("ht_phat", "p̂ observado", "0.55", 0, 1) + dataFld("ht_p0", "p₀ (H₀)", "0.5", 0, 1) + dataFld("ht_n", "n", "150", null, null, 1);
    }
    if (param === "var") {
      return dataFld("ht_s", "S (desvío muestral)", "3.2", 0) + dataFld("ht_sig0", "σ₀ (H₀)", "2.5", 0) + dataFld("ht_n", "n", "20", null, null, 1);
    }
    var third = param === "media_z" ? dataFld("ht_sd", "σ (conocido)", "10", 0) : dataFld("ht_sd", "S (muestral)", "10", 0);
    return dataFld("ht_xbar", "x̄ observado", "103") + dataFld("ht_mu0", "μ₀ (H₀)", "100") + third + dataFld("ht_n", "n", "36", null, null, 1);
  }
  function dataFld(id, label, val, mn, mx, step) {
    var attrs = ' step="' + (step != null ? step : "any") + '"';
    if (mn != null) attrs += ' min="' + mn + '"';
    if (mx != null) attrs += ' max="' + mx + '"';
    return '<div class="ex-fld"><label class="lbl" for="' + id + '">' + label + '</label><input type="text" inputmode="decimal" autocomplete="off" class="field" id="' + id + '" value="' + val + '"' + attrs + "></div>";
  }
  var htOpen = true;                     // ¿los pasos del test quedan desplegados?
  function wireHt() {
    var rebuild = function () {
      var param = $("#ht_param").value;
      $("#ht_data").innerHTML = htDataInputs(param);
      $$("#ht_data input").forEach(function (el) { el.addEventListener("input", compute); });
      compute();
    };
    var compute = function () {
      var param = $("#ht_param").value, alt = $("#ht_alt").value, alpha = num("#ht_alpha");
      var n = inum("#ht_n");
      var stat, statTex, distName, critTex, reject, pval, h0tex, tabla;
      var aviso = "";                    // advertencia de validez, si corresponde

      setFormula("ht_formula", HT_FORMULA[param] || HT_FORMULA.media_z);
      setLookup("ht_lookup", htLookupBase(param, alt, alpha, n));

      var base = [
        { sel: "#ht_alpha", bad: !(alpha > 0 && alpha < 1), msg: "α debe estar entre 0 y 1" },
        { sel: "#ht_n", bad: !(n >= 1), msg: MSG_N }
      ];
      var extra = [];
      if (param === "prop") {
        extra = [
          { sel: "#ht_phat", bad: !(num("#ht_phat") >= 0 && num("#ht_phat") <= 1), msg: "p̂ debe estar entre 0 y 1" },
          { sel: "#ht_p0", bad: !(num("#ht_p0") > 0 && num("#ht_p0") < 1), msg: "p₀ debe estar entre 0 y 1" }
        ];
      } else if (param === "var") {
        extra = [
          { sel: "#ht_s", bad: !(num("#ht_s") > 0), msg: "S debe ser > 0" },
          { sel: "#ht_sig0", bad: !(num("#ht_sig0") > 0), msg: "σ₀ debe ser > 0" },
          { sel: "#ht_n", bad: !(n >= 2), msg: MSG_N2 }
        ];
      } else {
        extra = [
          { sel: "#ht_xbar", bad: !isFinite(num("#ht_xbar")), msg: "x̄ debe ser un número" },
          { sel: "#ht_mu0", bad: !isFinite(num("#ht_mu0")), msg: "μ₀ debe ser un número" },
          { sel: "#ht_sd", bad: !(num("#ht_sd") > 0), msg: param === "media_z" ? MSG_SIGMA : "S debe ser > 0" }
        ];
        if (param === "media_t") extra.push({ sel: "#ht_n", bad: !(n >= 2), msg: MSG_N2 });
      }
      if (!check("ht_err", base.concat(extra))) { htClear(); return; }

      // la tabla de t solo la usa el test con σ desconocido: en los demás
      // parámetros esta tarjeta apaga su resaltado
      setHotT(NaN, NaN, "ht");

      if (param === "prop") {
        var ph = num("#ht_phat"), p0 = num("#ht_p0");
        var se = Math.sqrt(p0 * (1 - p0) / n);
        stat = (ph - p0) / se;
        statTex = "Z=\\dfrac{\\hat p-p_0}{\\sqrt{p_0(1-p_0)/n}}=\\dfrac{" + fmtN(ph, 4) + "-" + fmtN(p0, 4) + "}{\\sqrt{" + fmtN(p0, 4) + "\\cdot" + fmtN(1 - p0, 4) + "/" + n + "}}=" + fmtN(stat, 4);
        distName = "normal estándar";
        h0tex = "H_0:\\;p=p_0\\qquad H_1:\\;p" + altSym(alt) + "p_0";
        var rZ = zCritReject(stat, alt, alpha);
        critTex = rZ.critTex; reject = rZ.reject; pval = rZ.pval;
        tabla = "En la tabla de fractiles z: z crítico " + fmtN(rZ.crit, 4) + " (α = " + fmtAlpha(alpha) + ", " + (alt === "ne" ? "dos colas" : "una cola") + ").";
        if (n * p0 < 5 || n * (1 - p0) < 5) {
          aviso = "n·p₀ = " + fmtN(n * p0, 2) + " y n·(1−p₀) = " + fmtN(n * (1 - p0), 2) +
            ": con alguno de los dos por debajo de 5 la aproximación normal del estadístico no es válida.";
        }
        setHotZ(stat);
      } else if (param === "media_z") {
        var xbar = num("#ht_xbar"), mu0 = num("#ht_mu0"), sd = num("#ht_sd");
        stat = (xbar - mu0) / (sd / Math.sqrt(n));
        statTex = "Z=\\dfrac{\\bar x-\\mu_0}{\\sigma/\\sqrt n}=\\dfrac{" + fmtN(xbar, 3) + "-" + fmtN(mu0, 3) + "}{" + fmtN(sd, 3) + "/\\sqrt{" + n + "}}=" + fmtN(stat, 4);
        distName = "normal estándar";
        h0tex = "H_0:\\;\\mu=\\mu_0\\qquad H_1:\\;\\mu" + altSym(alt) + "\\mu_0";
        var rz2 = zCritReject(stat, alt, alpha);
        critTex = rz2.critTex; reject = rz2.reject; pval = rz2.pval;
        tabla = "En la tabla de fractiles z: z crítico " + fmtN(rz2.crit, 4) + " (α = " + fmtAlpha(alpha) + ", " + (alt === "ne" ? "dos colas" : "una cola") + ").";
        setHotZ(stat);
      } else if (param === "media_t") {
        var xb = num("#ht_xbar"), m0 = num("#ht_mu0"), S = num("#ht_sd"), dfT = n - 1;
        stat = (xb - m0) / (S / Math.sqrt(n));
        statTex = "T=\\dfrac{\\bar x-\\mu_0}{S/\\sqrt n}=\\dfrac{" + fmtN(xb, 3) + "-" + fmtN(m0, 3) + "}{" + fmtN(S, 3) + "/\\sqrt{" + n + "}}=" + fmtN(stat, 4);
        distName = "t de Student con " + dfT + " g.l.";
        h0tex = "H_0:\\;\\mu=\\mu_0\\qquad H_1:\\;\\mu" + altSym(alt) + "\\mu_0";
        var rT = tCritReject(stat, alt, alpha, dfT);
        critTex = rT.critTex; reject = rT.reject; pval = rT.pval;
        tabla = "En la tabla de t críticos: fila m = " + dfT + ", columna α = " + fmtAlpha(alt === "ne" ? alpha / 2 : alpha) + " ⇒ " + fmtN(rT.crit, 4) + ".";
        setHotT(dfT, alt === "ne" ? alpha / 2 : alpha, "ht");
      } else {
        var Sv = num("#ht_s"), sig0 = num("#ht_sig0"), dfV = n - 1;
        stat = dfV * Sv * Sv / (sig0 * sig0);
        statTex = "\\chi^2=\\dfrac{(n-1)S^2}{\\sigma_0^2}=\\dfrac{" + dfV + "\\cdot" + fmtN(Sv, 3) + "^2}{" + fmtN(sig0, 3) + "^2}=" + fmtN(stat, 4);
        distName = "χ² con " + dfV + " g.l.";
        h0tex = "H_0:\\;\\sigma^2=\\sigma_0^2\\qquad H_1:\\;\\sigma^2" + altSym(alt) + "\\sigma_0^2";
        var rC = chiCritReject(stat, alt, alpha, dfV);
        critTex = rC.critTex; reject = rC.reject; pval = rC.pval;
        tabla = "En la tabla de χ² críticos: fila k = " + dfV + ", " + rC.tabla;
        setHotChi(dfV, rC.hotP);
      }

      var cmp = pval < alpha ? "<" : "\\ge";
      setOut("ht_stat", fmtN(stat, 4));
      setOut("ht_pval", pvalText(pval));
      htSet("ht_dec",
        '<div class="ht-decision ' + (reject ? "rej" : "no") + '">' + A.icon(reject ? "x" : "check", 18) +
          "<span>" + (reject ? "Se RECHAZA H₀" : "NO se rechaza H₀") + " al nivel α=" + fmtAlpha(alpha) + ".</span></div>");
      htSet("ht_notes",
        '<p class="ht-note">' + tabla + "</p>" +
        '<p class="ht-note">' + (reject
          ? "El estadístico cae en la región de rechazo (equivale a valor-p &lt; α)."
          : "El estadístico NO cae en la región de rechazo (valor-p ≥ α). No hay evidencia suficiente contra H₀.") + "</p>" +
        (aviso ? '<p class="ht-note">' + aviso + "</p>" : ""));
      setStepsHt(
        '<ol class="ht-list">' +
          '<li><span class="ht-k">Hipótesis</span>' + katex(h0tex) + "</li>" +
          '<li><span class="ht-k">Estadístico observado</span>' + katex(statTex, true) + "</li>" +
          '<li><span class="ht-k">Distribución bajo H₀</span><span class="ht-txt">' + distName + "</span></li>" +
          '<li><span class="ht-k">Región de rechazo (α=' + fmtAlpha(alpha) + ")</span>" + katex(critTex) + "</li>" +
          '<li><span class="ht-k">valor-p ≈</span><span class="ht-txt ht-mono">' + pvalText(pval) + "</span></li>" +
          '<li><span class="ht-k">Decisión por el valor-p</span>' +
            katex(pvalTex(pval) + cmp + "\\alpha=" + fmtAlpha(alpha)) +
            '<span class="ht-txt"> ⇒ ' + (reject ? "se rechaza H₀" : "no se rechaza H₀") + "</span></li>" +
        "</ol>");
    };
    // escribe markup armado por este módulo en un hueco fijo de la tarjeta
    function htSet(id, html) { var el = $("#" + id); if (el) el.innerHTML = html; }
    // los pasos arrancan desplegados y, si se pliegan a mano, siguen plegados:
    // se lee .open en el momento (el evento "toggle" del <details> llega en una
    // tarea posterior, así que escucharlo daría el estado anterior). htOpen
    // guarda cómo estaban antes de un error, que vacía el bloque y lo cierra.
    var stepsBox = $("#ht_steps");
    function setStepsHt(html) {
      var vacio = !stepsBox || stepsBox.classList.contains("is-empty");
      var abierto = stepsBox ? stepsBox.open : true;
      setSteps("ht_steps", html);
      if (stepsBox) stepsBox.open = vacio ? htOpen : abierto;
    }
    function htClear() {
      setOut("ht_stat", "—"); setOut("ht_pval", "—");
      htSet("ht_dec", ""); htSet("ht_notes", ""); setHotT(NaN, NaN, "ht");
      if (stepsBox && !stepsBox.classList.contains("is-empty")) htOpen = stepsBox.open;
      setSteps("ht_steps", "");
    }
    $("#ht_param").addEventListener("change", rebuild);
    $("#ht_alt").addEventListener("change", compute);
    $("#ht_alpha").addEventListener("input", compute);
    rebuild();
  }
  function altSym(alt) { return alt === "ne" ? "\\neq" : alt === "gt" ? ">" : "<"; }

  // región de rechazo + valor-p para estadístico Z
  function zCritReject(z, alt, alpha) {
    var crit, critTex, reject, pval;
    if (alt === "ne") {
      crit = M.normInv(1 - alpha / 2);
      critTex = "|Z|>z_{1-\\alpha/2}=" + fmtN(crit, 4);
      reject = Math.abs(z) > crit;
      pval = 2 * M.normSF(Math.abs(z));
    } else if (alt === "gt") {
      crit = M.normInv(1 - alpha);
      critTex = "Z>z_{1-\\alpha}=" + fmtN(crit, 4);
      reject = z > crit;
      pval = M.normSF(z);
    } else {
      crit = M.normInv(1 - alpha);
      critTex = "Z<-z_{1-\\alpha}=" + fmtN(-crit, 4);
      reject = z < -crit;
      pval = M.normCDF(z);
    }
    return { crit: crit, critTex: critTex, reject: reject, pval: pval };
  }
  // región de rechazo + valor-p para estadístico T
  function tCritReject(t, alt, alpha, df) {
    var crit, critTex, reject, pval;
    if (alt === "ne") {
      crit = M.tInv(1 - alpha / 2, df);
      critTex = "|T|>t_{" + df + ",\\,1-\\alpha/2}=" + fmtN(crit, 4);
      reject = Math.abs(t) > crit;
      pval = 2 * (1 - M.tCDF(Math.abs(t), df));
    } else if (alt === "gt") {
      crit = M.tInv(1 - alpha, df);
      critTex = "T>t_{" + df + ",\\,1-\\alpha}=" + fmtN(crit, 4);
      reject = t > crit;
      pval = 1 - M.tCDF(t, df);
    } else {
      crit = M.tInv(1 - alpha, df);
      critTex = "T<-t_{" + df + ",\\,1-\\alpha}=" + fmtN(-crit, 4);
      reject = t < -crit;
      pval = M.tCDF(t, df);
    }
    return { crit: crit, critTex: critTex, reject: reject, pval: pval };
  }
  // región de rechazo + valor-p para el estadístico χ² de la varianza.
  // hotP = el fractil que conviene resaltar en la tabla de χ² críticos.
  function chiCritReject(x2, alt, alpha, df) {
    var critTex, reject, pval, crit, hotP, tabla;
    if (alt === "ne") {
      var lo = M.chi2Inv(alpha / 2, df), hi = M.chi2Inv(1 - alpha / 2, df);
      critTex = "\\chi^2<\\chi^2_{" + df + ",\\,\\alpha/2}=" + fmtN(lo, 4) + "\\quad\\text{o}\\quad \\chi^2>\\chi^2_{" + df + ",\\,1-\\alpha/2}=" + fmtN(hi, 4);
      reject = x2 < lo || x2 > hi;
      var F = M.chi2CDF(x2, df);
      pval = 2 * Math.min(F, 1 - F);
      crit = hi; hotP = 1 - alpha / 2;
      tabla = "columnas p = " + fmtN(alpha / 2, 4) + " y p = " + fmtN(1 - alpha / 2, 4) + " ⇒ " + fmtN(lo, 4) + " y " + fmtN(hi, 4) + ".";
    } else if (alt === "gt") {
      crit = M.chi2Inv(1 - alpha, df);
      critTex = "\\chi^2>\\chi^2_{" + df + ",\\,1-\\alpha}=" + fmtN(crit, 4);
      reject = x2 > crit;
      pval = 1 - M.chi2CDF(x2, df);
      hotP = 1 - alpha;
      tabla = "columna p = " + fmtN(1 - alpha, 4) + " ⇒ " + fmtN(crit, 4) + ".";
    } else {
      crit = M.chi2Inv(alpha, df);
      critTex = "\\chi^2<\\chi^2_{" + df + ",\\,\\alpha}=" + fmtN(crit, 4);
      reject = x2 < crit;
      pval = M.chi2CDF(x2, df);
      hotP = alpha;
      tabla = "columna p = " + fmtN(alpha, 4) + " ⇒ " + fmtN(crit, 4) + ".";
    }
    return { crit: crit, critTex: critTex, reject: reject, pval: pval, hotP: hotP, tabla: tabla };
  }

  // ============================================================
  //  SECCIÓN 5 · tamaño de muestra
  // ============================================================
  function nMediaCard() {
    return '<div class="card" id="cardNm">' +
      cardHead("Tamaño de muestra · media", lookupHtml({ mode: "norm", dir: "inv" }, {}, "nm_lookup")) +
      formulaHtml("n=\\left\\lceil\\left(\\dfrac{z_{1-\\alpha/2}\\,\\sigma}{E}\\right)^{2}\\right\\rceil") +
      '<div class="calc-2col">' + fldHtml("nm_sd", "σ (o una estimación)", 8, 'step="any" min="0"') + fldHtml("nm_e", "E (margen de error)", 2, 'step="any" min="0"') + "</div>" +
      fldHtml("nm_lvl", "nivel de confianza (%)", 95, 'step="any" min="0" max="100"') +
      '<div class="calc-presets">' + lvlChips("#nm_lvl") + "</div>" +
      errHtml("nm_err") + outHtml("nm_out") + stepsHtml("nm_steps") +
      '<p class="calc-note">El resultado se redondea siempre hacia arriba: con el entero anterior el margen quedaría por encima de E.</p></div>';
  }
  function wireNMedia() {
    var upd = function () {
      var sd = num("#nm_sd"), E = num("#nm_e"), alpha = alphaFromLvl("#nm_lvl");
      setLookup("nm_lookup", { mode: "norm", dir: "inv", mu: 0, sigma: 1, value: qBilat(alpha) });
      var okAll = check("nm_err", [
        { sel: "#nm_sd", bad: !(sd > 0), msg: MSG_SIGMA },
        { sel: "#nm_e", bad: !(E > 0), msg: "E debe ser > 0" },
        { sel: "#nm_lvl", bad: !isFinite(alpha), msg: MSG_LVL }
      ]);
      if (!okAll) { setOut("nm_out", "—"); setSteps("nm_steps", ""); return; }
      var z = M.normInv(1 - alpha / 2), raw = Math.pow(z * sd / E, 2), n = Math.ceil(raw);
      setOut("nm_out", String(n));
      setSteps("nm_steps",
        katex("z_{1-\\alpha/2}=" + fmtN(z, 4) + "\\quad(\\alpha=" + fmtN(alpha, 4) + ")", true) +
        katex("\\left(\\dfrac{" + fmtN(z, 4) + "\\cdot" + fmtN(sd, 4) + "}{" + fmtN(E, 4) + "}\\right)^{2}=" + fmtN(raw, 4), true) +
        katex("n=\\lceil " + fmtN(raw, 4) + "\\rceil=" + n, true));
    };
    ["#nm_sd", "#nm_e", "#nm_lvl"].forEach(function (s) { var el = $(s); if (el) el.addEventListener("input", upd); });
    upd();
  }

  function nPropCard() {
    return '<div class="card" id="cardNp">' +
      cardHead("Tamaño de muestra · proporción", lookupHtml({ mode: "norm", dir: "inv" }, {}, "np_lookup")) +
      segHtml("np_mode", "m", [{ id: "phat", label: "con p̂ estimado" }, { id: "cons", label: "conservador (p̂ = 0.5)" }], "phat") +
      formulaHtml("n=\\left\\lceil z_{1-\\alpha/2}^{2}\\,\\dfrac{\\hat p(1-\\hat p)}{E^{2}}\\right\\rceil", "np_formula") +
      '<div class="calc-2col">' +
        '<div class="calc-when" data-when="phat">' + fldHtml("np_phat", "p̂ estimado", 0.4, 'step="any" min="0" max="1"') + "</div>" +
        '<div class="calc-when is-off" data-when="cons"><div class="ex-fld"><label class="lbl" for="np_cons">p̂(1−p̂)</label>' +
          '<input type="text" class="field" id="np_cons" value="0.25" disabled></div></div>' +
        fldHtml("np_e", "E (margen de error)", 0.05, 'step="any" min="0"') +
      "</div>" +
      fldHtml("np_lvl", "nivel de confianza (%)", 95, 'step="any" min="0" max="100"') +
      '<div class="calc-presets">' + lvlChips("#np_lvl") + "</div>" +
      errHtml("np_err") + outHtml("np_out") + stepsHtml("np_steps") +
      '<p class="calc-note">Sin una estimación previa de p se usa el caso peor: p̂(1−p̂) alcanza su máximo, 0.25, en p̂ = 0.5.</p></div>';
  }
  function wireNProp() {
    var mode = "phat";
    var upd = function () {
      var ph = num("#np_phat"), E = num("#np_e"), alpha = alphaFromLvl("#np_lvl");
      setLookup("np_lookup", { mode: "norm", dir: "inv", mu: 0, sigma: 1, value: qBilat(alpha) });
      setFormula("np_formula", mode === "phat"
        ? "n=\\left\\lceil z_{1-\\alpha/2}^{2}\\,\\dfrac{\\hat p(1-\\hat p)}{E^{2}}\\right\\rceil"
        : "n=\\left\\lceil \\dfrac{z_{1-\\alpha/2}^{2}}{4E^{2}}\\right\\rceil");
      var okAll = check("np_err", [
        { sel: "#np_phat", bad: mode === "phat" && !(ph >= 0 && ph <= 1), msg: "p̂ debe estar entre 0 y 1" },
        { sel: "#np_e", bad: !(E > 0), msg: "E debe ser > 0" },
        { sel: "#np_lvl", bad: !isFinite(alpha), msg: MSG_LVL }
      ]);
      if (!okAll) { setOut("np_out", "—"); setSteps("np_steps", ""); return; }
      var prod = mode === "phat" ? ph * (1 - ph) : 0.25;
      var z = M.normInv(1 - alpha / 2), raw = z * z * prod / (E * E), n = Math.ceil(raw);
      setOut("np_out", String(n));
      setSteps("np_steps",
        katex("z_{1-\\alpha/2}=" + fmtN(z, 4) + "\\quad(\\alpha=" + fmtN(alpha, 4) + ")", true) +
        katex("\\hat p(1-\\hat p)=" + fmtN(prod, 6), true) +
        katex("\\dfrac{" + fmtN(z, 4) + "^2\\cdot" + fmtN(prod, 6) + "}{" + fmtN(E, 4) + "^2}=" + fmtN(raw, 4), true) +
        katex("n=\\lceil " + fmtN(raw, 4) + "\\rceil=" + n, true));
    };
    wireSeg("np_mode", "m", function (v) { mode = v; showWhen("#cardNp", mode); upd(); });
    ["#np_phat", "#np_e", "#np_lvl"].forEach(function (s) { var el = $(s); if (el) el.addEventListener("input", upd); });
    upd();
  }

  // ============================================================
  //  SECCIÓN 6 · tablas
  // ============================================================
  //  Las cuatro tablas se arman UNA vez (buildTables) y guardan sus celdas en
  //  arrays. Los handlers de input solo llaman a setHot*, que mueve una clase.
  var Z_ALPHAS = [0.10, 0.05, 0.025, 0.01, 0.005];
  var T_ROWS = (function () { var a = [], m; for (m = 1; m <= 30; m++) a.push(m); return a.concat([40, 60, 120, Infinity]); })();
  var T_ALPHAS = [0.10, 0.05, 0.025, 0.01, 0.005];
  var CHI_PS = [0.005, 0.025, 0.05, 0.95, 0.975, 0.995];

  var zCells = [], zcCells = [], tCells = [], chiCells = [];
  var zHot = null, zcHot = [], tHot = null, chiHot = null;
  // quién manda sobre la celda resaltada de la tabla de t: la tarjeta de t, el
  // IC de la media o el test. Solo el dueño actual puede apagarla.
  var tHotOwner = null;
  // tolerancia de coincidencia fila/columna: el α que llega desde una CDF
  // (p. ej. 1 − P(T ≤ t)) trae el error del método, no cae exacto en 0.025
  var TOL = 1e-4;

  function tablesHtml() {
    return '<div class="calc-grid calc-tables">' +
      '<div class="card">' +
        '<div class="calc-title">Fractiles z frecuentes</div>' +
        '<p class="calc-note">Calculados con la misma rutina que las calculadoras. Se resaltan las dos lecturas del p ' +
        "cargado en la tarjeta Normal en modo «probabilidad → valor».</p>" +
        '<div class="ztable-scroll" id="zcritWrap"></div>' +
        '<p class="calc-note" id="zcNote"></p>' +
      "</div>" +
      '<div class="card">' +
        '<div class="calc-title">t críticos ' + katex("t_{m,\\,1-\\alpha}") + "</div>" +
        '<p class="calc-note">Filas: grados de libertad m. Columnas: α, el área de la cola. ' +
        "Se resalta la celda de los grados de libertad y el α cargados en la tarjeta de t, " +
        "en el IC de la media (modo t) o en la prueba con σ desconocido.</p>" +
        '<div class="ztable-scroll" id="tcritWrap"></div>' +
      "</div>" +
      '<div class="card">' +
        '<div class="calc-title">χ² críticos ' + katex("\\chi^2_{k,\\,p}") + "</div>" +
        '<p class="calc-note">Filas: grados de libertad k. Columnas: el fractil p. ' +
        "Se resalta la celda de los grados de libertad y el fractil cargados en la tarjeta de χ², " +
        "en el IC de la varianza o en la prueba de varianza.</p>" +
        '<div class="ztable-scroll" id="chicritWrap"></div>' +
      "</div>" +
      "</div>" +
      '<div class="card calc-ztable-card">' +
        '<div class="calc-title">Tabla normal estándar ' + katex("\\Phi(z)=P(Z\\le z)") + "</div>" +
        '<p class="calc-note">Se resalta el z de la tarjeta Normal (o el estadístico Z de la prueba). ' +
        "Con z negativo se resalta |z| y se muestra la lectura por simetría.</p>" +
        '<div class="ztable-scroll" id="ztableWrap"></div>' +
        '<p class="calc-note" id="zNote"></p>' +
      "</div>";
  }

  function buildTables() {
    buildZTable();
    buildZCritTable();
    buildTCritTable();
    buildChiCritTable();
  }

  // ---- Φ(z): 35 × 10, una sola construcción ----
  function buildZTable() {
    var wrap = $("#ztableWrap"); if (!wrap) return;
    var html = '<table class="ztable"><tr><th>z</th>';
    for (var c = 0; c < 10; c++) html += "<th>0.0" + c + "</th>";
    html += "</tr>";
    for (var r = 0; r <= 34; r++) {
      var zr = r / 10;
      html += '<tr><td class="zhead">' + zr.toFixed(1) + "</td>";
      for (var cc = 0; cc < 10; cc++) html += "<td>" + M.normCDF(zr + cc / 100).toFixed(4) + "</td>";
      html += "</tr>";
    }
    wrap.innerHTML = html + "</table>";
    zCells = [];
    $$("tr", wrap).slice(1).forEach(function (tr) { zCells.push($$("td", tr).slice(1)); });
  }
  // desplaza el contenedor de la tabla (nunca la ventana) hasta la celda activa
  function scrollCellIntoWrap(sel, cell) {
    var w = $(sel); if (!w || !cell) return;
    if (w.scrollHeight <= w.clientHeight) return;
    w.scrollTop = Math.max(0, cell.offsetTop - w.clientHeight / 2 + cell.offsetHeight / 2);
  }
  function setHotZ(z) {
    if (zHot) { zHot.classList.remove("hot"); zHot = null; }
    var note = $("#zNote"); if (note) note.innerHTML = "";
    if (z == null || !isFinite(z)) return;
    var az = Math.abs(z);
    if (az >= 3.5) {
      if (note) note.innerHTML = A.rich("$|z|=" + fmtN(az, 4) + "$ queda fuera de la tabla ($z\\le 3.49$): $\\Phi(|z|)$ ya es prácticamente 1.");
      return;
    }
    var idx = Math.round(az * 100), r = Math.floor(idx / 10), c = idx % 10;
    if (!zCells[r] || !zCells[r][c]) return;
    zHot = zCells[r][c];
    zHot.classList.add("hot");
    scrollCellIntoWrap("#ztableWrap", zHot);
    if (note) {
      var pa = M.normCDF(az);
      note.innerHTML = z < 0
        ? A.rich("Se resalta $|z|=" + fmtN(az, 2) + "$. Por simetría: $\\Phi(-z)=1-\\Phi(z)=1-" + fmtN(pa, 4) + "=" + fmtN(1 - pa, 4) + "$.")
        : A.rich("$\\Phi(" + fmtN(az, 2) + ")=" + fmtN(pa, 4) + "$ en la celda resaltada (el z exacto es " + fmtN(az, 4) + ").");
    }
  }

  // ---- fractiles z frecuentes, calculados con M.normInv ----
  function buildZCritTable() {
    var wrap = $("#zcritWrap"); if (!wrap) return;
    var html = '<table class="ztable"><tr><th>α</th><th>' + katex("z_{1-\\alpha}") + " (1 cola)</th><th>" + katex("z_{1-\\alpha/2}") + " (2 colas)</th></tr>";
    Z_ALPHAS.forEach(function (a) {
      html += '<tr><td class="zhead">' + a.toFixed(3) + "</td><td>" + M.normInv(1 - a).toFixed(4) + "</td><td>" + M.normInv(1 - a / 2).toFixed(4) + "</td></tr>";
    });
    wrap.innerHTML = html + "</table>";
    zcCells = [];
    $$("tr", wrap).slice(1).forEach(function (tr) { zcCells.push($$("td", tr).slice(1)); });
  }
  // p de la tarjeta Normal en modo inverso → sus DOS lecturas de α
  function setHotZCrit(p) {
    zcHot.forEach(function (c) { c.classList.remove("hot"); });
    zcHot = [];
    var note = $("#zcNote"); if (note) note.textContent = "";
    if (!isFinite(p) || !(p > 0 && p < 1)) return;
    // α es el área de la cola CHICA: con p < 0.5 esa cola es la inferior y el
    // fractil es el opuesto del que muestra la tabla. Con p = 0.5 no hay α.
    var a1 = Math.min(p, 1 - p);
    if (a1 > 0.5 - 5e-5) return;
    var a2 = 2 * a1, txt = [];
    Z_ALPHAS.forEach(function (a, i) {
      if (!zcCells[i]) return;
      if (Math.abs(a - a1) < TOL) { zcCells[i][0].classList.add("hot"); zcHot.push(zcCells[i][0]); txt.push("α = " + fmtN(a, 4) + " a una cola"); }
      if (Math.abs(a - a2) < TOL) { zcCells[i][1].classList.add("hot"); zcHot.push(zcCells[i][1]); txt.push("α = " + fmtN(a, 4) + " a dos colas"); }
    });
    if (note && txt.length) {
      note.textContent = "p = " + fmtN(p, 6) + " deja " + fmtN(a1, 4) + " en la cola " + (p > 0.5 ? "superior" : "inferior") +
        " y se lee como " + txt.join(" y ") +
        (p < 0.5 ? ". El fractil es el opuesto del que muestra la tabla." : ".");
    }
  }

  // ---- t críticos ----
  function buildTCritTable() {
    var wrap = $("#tcritWrap"); if (!wrap) return;
    var html = '<table class="ztable"><tr><th>m</th>';
    T_ALPHAS.forEach(function (a) { html += "<th>" + a.toFixed(3) + "</th>"; });
    html += "</tr>";
    T_ROWS.forEach(function (m) {
      html += '<tr><td class="zhead">' + (isFinite(m) ? m : "∞") + "</td>";
      T_ALPHAS.forEach(function (a) {
        var v = isFinite(m) ? M.tInv(1 - a, m) : M.normInv(1 - a);
        html += "<td>" + v.toFixed(4) + "</td>";
      });
      html += "</tr>";
    });
    wrap.innerHTML = html + "</table>";
    tCells = [];
    $$("tr", wrap).slice(1).forEach(function (tr) { tCells.push($$("td", tr).slice(1)); });
  }
  // owner = qué tarjeta pide el resaltado ("t", "icm", "ht"). Apagar solo surte
  // efecto si quien lo pide es el dueño actual: así una tarjeta que deja de usar
  // la tabla (el IC de la media al volver a σ conocido) borra SU resaltado sin
  // pisar el que puso otra.
  function setHotT(df, alpha, owner) {
    owner = owner || "t";
    var apagar = function () {
      if (tHot && tHotOwner === owner) { tHot.classList.remove("hot"); tHot = null; tHotOwner = null; }
    };
    if (!(df >= 1) || !(alpha > 0)) { apagar(); return; }
    var ri = -1, ci = -1, i;
    for (i = 0; i < T_ROWS.length; i++) if (T_ROWS[i] === df) { ri = i; break; }
    for (i = 0; i < T_ALPHAS.length; i++) if (Math.abs(T_ALPHAS[i] - alpha) < TOL) { ci = i; break; }
    if (ri < 0 || ci < 0 || !tCells[ri]) { apagar(); return; }
    if (tHot) tHot.classList.remove("hot");
    tHot = tCells[ri][ci];
    tHotOwner = owner;
    tHot.classList.add("hot");
    scrollCellIntoWrap("#tcritWrap", tHot);
  }

  // ---- χ² críticos ----
  function buildChiCritTable() {
    var wrap = $("#chicritWrap"); if (!wrap) return;
    // el rincón dice solo "k": con "k · p" la celda envolvía en tres líneas y la
    // primera columna se llevaba el ancho que necesita la última (p = 0.995)
    var html = '<table class="ztable"><tr><th>k</th>';
    CHI_PS.forEach(function (p) { html += "<th>" + p.toFixed(3) + "</th>"; });
    html += "</tr>";
    for (var k = 1; k <= 30; k++) {
      html += '<tr><td class="zhead">' + k + "</td>";
      for (var j = 0; j < CHI_PS.length; j++) {
        // χ²_{1,\,0.005} = 3.93e-5: con 4 decimales la celda se leería "0.0000"
        var cv = M.chi2Inv(CHI_PS[j], k);
        html += "<td>" + (cv < 5e-4 ? cv.toExponential(2) : cv.toFixed(4)) + "</td>";
      }
      html += "</tr>";
    }
    wrap.innerHTML = html + "</table>";
    chiCells = [];
    $$("tr", wrap).slice(1).forEach(function (tr) { chiCells.push($$("td", tr).slice(1)); });
  }
  function setHotChi(k, p) {
    if (chiHot) { chiHot.classList.remove("hot"); chiHot = null; }
    if (!(k >= 1 && k <= 30) || !isFinite(p)) return;
    var ci = -1;
    for (var i = 0; i < CHI_PS.length; i++) if (Math.abs(CHI_PS[i] - p) < TOL) { ci = i; break; }
    if (ci < 0 || !chiCells[k - 1]) return;
    chiHot = chiCells[k - 1][ci];
    chiHot.classList.add("hot");
    scrollCellIntoWrap("#chicritWrap", chiHot);
  }

  // ============================================================
  //  VIEW: ASISTENTE (árboles de decisión)
  // ============================================================
  var wizState = { which: "dist", node: null, crumbs: [], done: null };

  A.registerView("asistente", function (main, arg) {
    document.title = "¿Qué distribución o prueba? · Estudio P&E";
    if (arg === "test" || arg === "dist") wizState.which = arg;
    var wz = wizState.which === "dist" ? STUDY.DIST_WIZARD : STUDY.TEST_WIZARD;
    if (!wizState.node) { wizState.node = wz.start; wizState.crumbs = []; wizState.done = null; }
    drawWizard(main);
  });

  function drawWizard(main) {
    var isDist = wizState.which === "dist";
    var wz = isDist ? STUDY.DIST_WIZARD : STUDY.TEST_WIZARD;
    var node = wz.nodes[wizState.node];
    var body;
    if (wizState.done) body = wizResultHtml(wizState.done, isDist);
    else body =
      (wizState.crumbs.length ? '<div class="wiz-crumbs">' + wizState.crumbs.map(function (c) { return "<span>" + A.escapeHtml(c) + "</span>"; }).join("") + "</div>" : "") +
      (node ? wizQuestionHtml(node) : "");

    main.innerHTML =
      // el H1 no cambia con el modo: es el nombre de la herramienta, el mismo que
      // usan la miga, el sidebar y document.title. El modo se lee en el selector.
      '<h1 class="section-title">¿Qué distribución o prueba?</h1>' +
      '<div class="seg" style="margin-bottom:22px">' +
        '<button class="' + (isDist ? "on" : "") + '" data-action="wiz-which" data-which="dist">Distribución</button>' +
        '<button class="' + (!isDist ? "on" : "") + '" data-action="wiz-which" data-which="test">Prueba de hipótesis</button>' +
      "</div>" +
      '<div class="wizard-stage">' + body +
        '<div class="wiz-footer"><button class="btn ghost" data-action="wiz-reset">' + A.icon("refresh", 15) + " Empezar de nuevo</button></div>" +
      "</div>";
  }
  function wizQuestionHtml(node) {
    return '<div class="wiz-q">' + A.rich(node.q) + '</div><div class="wiz-opts">' +
      node.opts.map(function (o, i) {
        return '<button class="wiz-opt" data-action="wiz-pick" data-i="' + i + '">' + A.escapeHtml(o.label) + '<span class="arr">' + A.icon("chev", 16) + "</span></button>";
      }).join("") +
      "</div>";
  }
  function wizResultHtml(done, isDist) {
    var crumbs = '<div class="wiz-crumbs">' + wizState.crumbs.map(function (c) { return "<span>" + A.escapeHtml(c) + "</span>"; }).join("") + "</div>";
    var res;
    if (done.dist) {
      var d = STUDY.DISTS.find(function (x) { return x.id === done.dist; });
      res = '<div class="wiz-result card"><div class="wiz-kicker">Le conviene la</div>' +
        '<div class="big">' + A.escapeHtml(d.name) + "</div>" +
        '<div class="wiz-pmf">' + katex(d.tex.pmf, true) + "</div>" +
        '<div class="wiz-ev"><span>' + katex(d.tex.mean) + "</span><span>" + katex(d.tex.var) + "</span></div>" +
        '<p class="wiz-modela">' + A.escapeHtml(d.modela) + "</p>" +
        '<div class="wiz-actions"><a class="btn primary" data-nav="#/explorador/' + d.id + '">' + A.icon("sliders", 15) + " Explorar</a>" +
        (A.BY_SLUG[d.slug] ? '<a class="btn" data-nav="#/p/' + d.slug + '">' + A.icon("book", 15) + " Ver wiki</a>" : "") + "</div></div>";
    } else {
      var r = done.result;
      res = '<div class="wiz-result card"><div class="wiz-kicker">Use el estadístico</div>' +
        '<div class="wiz-pmf">' + katex(r.stat, true) + "</div>" +
        '<p class="wiz-modela">' + A.rich(r.tip) + "</p>" +
        '<div class="wiz-actions">' +
        '<a class="btn primary" data-nav="#/calc">' + A.icon("gauge", 15) + " Calcular la prueba</a>" +
        (r.slug && A.BY_SLUG[r.slug] ? '<a class="btn" data-nav="#/p/' + r.slug + '">' + A.icon("book", 15) + " Ver en el wiki</a>" : "") + "</div></div>";
    }
    return crumbs + res;
  }

  A.registerAction("wiz-which", function (el) {
    wizState.which = el.dataset.which;
    var wz = wizState.which === "dist" ? STUDY.DIST_WIZARD : STUDY.TEST_WIZARD;
    wizState.node = wz.start; wizState.crumbs = []; wizState.done = null;
    drawWizard($("#main"));
  });
  A.registerAction("wiz-reset", function () {
    var wz = wizState.which === "dist" ? STUDY.DIST_WIZARD : STUDY.TEST_WIZARD;
    wizState.node = wz.start; wizState.crumbs = []; wizState.done = null;
    drawWizard($("#main"));
  });
  A.registerAction("wiz-pick", function (el) {
    var isDist = wizState.which === "dist";
    var wz = isDist ? STUDY.DIST_WIZARD : STUDY.TEST_WIZARD;
    var node = wz.nodes[wizState.node];
    var opt = node.opts[+el.dataset.i];
    wizState.crumbs.push(opt.label);
    if (opt.to) { wizState.node = opt.to; }
    else if (opt.dist) { wizState.done = { dist: opt.dist }; }
    else if (opt.result) { wizState.done = { result: opt.result }; }
    drawWizard($("#main"));
  });
})();
