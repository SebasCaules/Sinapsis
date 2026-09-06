/* [bundle proba-tools] Copia de `estudio/lab.js` del baseline de Proba.
   Las diferencias con el original están marcadas con «[bundle]» y explicadas
   en ADAPTACIONES.md. Compat de datos: el runtime deja el JSON declarado en
   `manifest.data` en `App.STUDY`; el baseline lo leía del global
   `window.STUDY`. El shim mantiene vivos los dos nombres. */
var STUDY = window.STUDY || (window.App && window.App.STUDY) || {};

/* ============================================================
   lab.js — LABORATORIO MONTE CARLO: Teorema Central del Límite y
   Ley de los Grandes Números. Simulación en vivo (offline) que muestra
   cómo el promedio muestral X̄ converge a la Normal (TCL) y a μ (LGN).
   Vista: lab  (#/lab)

   PRNG y generadores idénticos a los verificados con vectores de control
   (Mulberry32 + transformada inversa; Poisson por Knuth). Núcleo puro
   expuesto en App._lab para testeo.
   ============================================================ */
(function () {
  "use strict";
  var A = window.App; if (!A) return;
  var M = window.M;
  // [bundle] `App.$` / `App.$$` no están en CompatApp (anotados para R4):
  // equivalentes locales con la misma semántica que los del baseline.
  var $ = typeof A.$ === "function" ? A.$ : function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = typeof A.$$ === "function" ? A.$$ : function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var icon = A.icon, esc = A.escapeHtml;
  // [bundle] El baseline llama `App.katex(tex, display)` como FUNCIÓN; el
  // contrato la declara como `{ renderToString }` (anotado para R4).
  var katex = typeof A.katex === "function"
    ? A.katex
    : function (tex, display) {
        if (!A.katex || typeof A.katex.renderToString !== "function") return "";
        try {
          return A.katex.renderToString(tex, { displayMode: !!display, throwOnError: false, macros: A.KATEX_MACROS });
        } catch (e) { return ""; }
      };
  function K(t, d) { return katex(t, !!d); }
  function num(x, d) { d = d == null ? 4 : d; if (x == null || !isFinite(x)) return "—"; var p = Math.pow(10, d); return String(Math.round(x * p) / p); }

  // ---- PRNG determinista (Mulberry32) + generadores ----
  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  var DISTS = {
    bernoulli: { name: "Bernoulli(p)", params: [{ k: "p", label: "p", def: 0.3, min: 0.01, max: 0.99, step: 0.01 }],
      gen: function (r, p) { return r() < p.p ? 1 : 0; }, E: function (p) { return p.p; }, V: function (p) { return p.p * (1 - p.p); } },
    uniforme: { name: "Uniforme(a,b)", params: [{ k: "a", label: "a", def: 0, min: -10, max: 10, step: 0.5 }, { k: "b", label: "b", def: 1, min: -10, max: 20, step: 0.5 }],
      gen: function (r, p) { return p.a + (p.b - p.a) * r(); }, E: function (p) { return (p.a + p.b) / 2; }, V: function (p) { return Math.pow(p.b - p.a, 2) / 12; } },
    exponencial: { name: "Exponencial(λ)", params: [{ k: "lam", label: "λ", def: 1, min: 0.1, max: 5, step: 0.1 }],
      gen: function (r, p) { return -Math.log(1 - r()) / p.lam; }, E: function (p) { return 1 / p.lam; }, V: function (p) { return 1 / (p.lam * p.lam); } },
    poisson: { name: "Poisson(λ)", params: [{ k: "lam", label: "λ", def: 4, min: 0.2, max: 20, step: 0.2 }],
      gen: function (r, p) { var L = Math.exp(-p.lam), k = 0, prod = 1; do { k++; prod *= r(); } while (prod > L); return k - 1; }, E: function (p) { return p.lam; }, V: function (p) { return p.lam; } },
    dado: { name: "Dado {1..6}", params: [],
      gen: function (r) { return Math.floor(r() * 6) + 1; }, E: function () { return 3.5; }, V: function () { return 35 / 12; } },
  };

  // promedios muestrales X̄: rep repeticiones del promedio de n i.i.d.
  function simulateMeans(distKey, params, n, rep, seed) {
    var d = DISTS[distKey], r = mulberry32(seed >>> 0), means = [], s1 = 0, s2 = 0;
    for (var j = 0; j < rep; j++) { var sum = 0; for (var i = 0; i < n; i++) sum += d.gen(r, params); var m = sum / n; means.push(m); s1 += m; s2 += m * m; }
    var empMean = s1 / rep, empVar = s2 / rep - empMean * empMean;
    return { means: means, empMean: empMean, empVar: empVar, empSd: Math.sqrt(Math.max(0, empVar)) };
  }
  // ley de grandes números: media corriente de una única secuencia larga
  function simulateRunning(distKey, params, N, seed) {
    var d = DISTS[distKey], r = mulberry32(seed >>> 0), sum = 0, pts = [];
    var marks = {}; var step = Math.max(1, Math.floor(N / 400));
    for (var i = 1; i <= N; i++) { sum += d.gen(r, params); if (i % step === 0 || i === N || i <= 20) pts.push([i, sum / i]); }
    return { pts: pts, finalMean: sum / N };
  }
  A._lab = { mulberry32: mulberry32, DISTS: DISTS, simulateMeans: simulateMeans, simulateRunning: simulateRunning };

  // ============================================================
  //  VISTA
  // ============================================================
  var lab = { dist: "exponencial", params: { lam: 1, p: 0.3, a: 0, b: 1 }, n: 30, rep: 20000, mode: "tcl", seed: 12345, last: null };

  A.registerView("lab", function (main) {
    document.title = "Laboratorio Monte Carlo · Estudio P&E";
    var d = DISTS[lab.dist];
    var distSeg = Object.keys(DISTS).map(function (k) { return '<button data-labdist="' + k + '"' + (k === lab.dist ? ' class="on"' : "") + ">" + DISTS[k].name.replace(/\(.*\)/, "") + "</button>"; }).join("");
    var modeSeg = [["tcl", "TCL · histograma de X̄"], ["lgn", "LGN · convergencia"]].map(function (m) { return '<button data-labmode="' + m[0] + '"' + (m[0] === lab.mode ? ' class="on"' : "") + ">" + m[1] + "</button>"; }).join("");
    var paramFields = d.params.map(function (pp) {
      var v = lab.params[pp.k] != null ? lab.params[pp.k] : pp.def;
      return '<div><label class="lbl">' + esc(pp.label) + '</label><input class="field" id="lab_p_' + pp.k + '" type="number" step="' + pp.step + '" value="' + v + '" style="width:90px"></div>';
    }).join("");
    var nField = '<div><label class="lbl">n (tamaño de muestra)</label><input class="field" id="lab_n" type="number" min="1" max="500" value="' + lab.n + '" style="width:110px"></div>';
    var repField = lab.mode === "tcl"
      ? '<div><label class="lbl">repeticiones</label><input class="field" id="lab_rep" type="number" min="200" max="80000" step="1000" value="' + lab.rep + '" style="width:120px"></div>'
      : '<div><label class="lbl">N (largo de la secuencia)</label><input class="field" id="lab_N" type="number" min="100" max="200000" step="1000" value="50000" style="width:140px"></div>';

    main.innerHTML =
      '<header class="unit-hero" style="--ucol:var(--u7)"><div class="eyebrow">' + icon("layers", 13) + " Simulación</div>" +
      '<h1 class="section-title">Laboratorio Monte Carlo</h1>' +
      '<p class="section-sub" style="margin-bottom:0">El promedio muestral X̄ tiende a la Normal (TCL, teorema central del límite) y se concentra en μ (LGN, ley de los grandes números). Simulación con semilla reproducible.</p></header>' +
      '<div class="card"><div class="slv-controls">' +
        '<div><label class="lbl">Distribución base</label><div class="seg" id="labDist">' + distSeg + "</div></div>" +
        '<div><label class="lbl">Qué mostrar</label><div class="seg" id="labMode">' + modeSeg + "</div></div>" +
      "</div>" +
      '<div class="slv-fields" style="margin-top:12px"><div class="lab-row">' + paramFields + nField + repField + "</div></div>" +
      '<div style="margin-top:14px"><button class="btn primary" data-action="lab-run">' + icon("play", 15) + " Simular</button> " +
        '<button class="btn" data-action="lab-reseed">' + icon("refresh", 14) + " Otra semilla</button></div></div>" +
      '<div class="card pw-card"><canvas id="labCanvas" class="pw-canvas" style="height:320px"></canvas>' +
        '<div class="pw-legend" id="labLegend"></div>' +
        '<div class="pw-readout" id="labReadout" hidden></div></div>' +
      '<div id="labOut"></div>';

    $$("#labDist button").forEach(function (b) { b.addEventListener("click", function () { lab.dist = b.dataset.labdist; A.render(); }); });
    $$("#labMode button").forEach(function (b) { b.addEventListener("click", function () { lab.mode = b.dataset.labmode; A.render(); }); });
    labRun();
  });

  function readParams() {
    var d = DISTS[lab.dist], p = {};
    d.params.forEach(function (pp) { var el = $("#lab_p_" + pp.k); p[pp.k] = el ? parseFloat(el.value) : pp.def; });
    lab.params = Object.assign({}, lab.params, p);
    var nEl = $("#lab_n"); if (nEl) lab.n = Math.max(1, Math.round(+nEl.value || 30));
    var repEl = $("#lab_rep"); if (repEl) lab.rep = Math.max(200, Math.round(+repEl.value || 20000));
    return p;
  }
  function labRun() {
    var d = DISTS[lab.dist], p = readParams();
    if (lab.dist === "uniforme" && p.b <= p.a) { $("#labOut").innerHTML = stepsBox(warn("La uniforme necesita b > a.")); return; }
    var mu = d.E(p), varX = d.V(p), sdX = Math.sqrt(varX), sdMean = sdX / Math.sqrt(lab.n);
    if (lab.mode === "tcl") {
      var sim = simulateMeans(lab.dist, p, lab.n, lab.rep, lab.seed); lab.last = { kind: "tcl", sim: sim, mu: mu, sdMean: sdMean };
      drawHist($("#labCanvas"), sim.means, mu, sdMean);
      var out = step("Teorema Central del Límite",
        "X̄ es el promedio de <b>n = " + lab.n + "</b> muestras i.i.d. de " + esc(d.name) + ", repetido <b>" + lab.rep + "</b> veces." +
        K("\\bar X \\approx \\mathcal N\\!\\left(\\mu,\\ \\tfrac{\\sigma}{\\sqrt n}\\right),\\quad \\mu=" + num(mu, 4) + ",\\ \\tfrac{\\sigma}{\\sqrt n}=" + num(sdMean, 5), true) +
        '<table class="slv-mat" style="margin-top:4px"><thead><tr><th></th><th>teórico</th><th>empírico</th></tr></thead><tbody>' +
        "<tr><td>media de X̄</td><td>" + num(mu, 5) + "</td><td class='hl'>" + num(sim.empMean, 5) + "</td></tr>" +
        "<tr><td>desvío de X̄</td><td>" + num(sdMean, 5) + "</td><td class='hl'>" + num(sim.empSd, 5) + "</td></tr>" +
        "</tbody></table>" +
        "<div class='slv-note'>Aunque la base no sea normal, el histograma de X̄ se acerca a la campana al crecer n.</div>");
      $("#labOut").innerHTML = stepsBox(out);
    } else {
      var NEl = $("#lab_N"); var N = NEl ? Math.max(100, Math.round(+NEl.value || 50000)) : 50000;
      var run = simulateRunning(lab.dist, p, N, lab.seed); lab.last = { kind: "lgn", run: run, mu: mu, sdX: sdX, N: N };
      drawLGN($("#labCanvas"), run.pts, mu, sdX, N);
      var out2 = step("Ley de los Grandes Números",
        "Media corriente de una secuencia de " + esc(d.name) + " a medida que crece n (hasta " + N + ")." +
        K("\\bar X_n \\xrightarrow{n\\to\\infty} \\mu = " + num(mu, 4), true) +
        "<div class='slv-vec'><span>μ teórico = <b>" + num(mu, 5) + "</b></span><span>media en n=" + N + ": <b>" + num(run.finalMean, 5) + "</b></span></div>" +
        "<div class='slv-note'>La media muestral se concentra en μ; la banda " + K("\\mu\\pm 2\\sigma/\\sqrt n") + " (Chebyshev/Normal) se angosta como 1/√n.</div>");
      $("#labOut").innerHTML = stepsBox(out2);
    }
    A.setRedraw(function () { redraw(); });
    try { A.enhanceDoc($("#labOut")); } catch (e) {}
  }
  function redraw() {
    var L = lab.last; if (!L) return; var cv = $("#labCanvas"); if (!cv) return;
    if (L.kind === "tcl") drawHist(cv, L.sim.means, L.mu, L.sdMean); else drawLGN(cv, L.run.pts, L.mu, L.sdX, L.N);
  }
  function stepsBox(html) { return '<div class="card solver-result"><div class="rail-title" style="margin-bottom:10px">' + icon("lightbulb", 13) + " Lectura</div>" + html + "</div>"; }
  function step(t, b) { return '<div class="slv-step"><div class="slv-step-h">' + esc(t) + "</div><div class='slv-step-b'>" + b + "</div></div>"; }
  function warn(m) { return '<div class="slv-warn">' + icon("flag", 13) + " " + esc(m) + "</div>"; }

  A.registerAction("lab-run", labRun);
  A.registerAction("lab-reseed", function () { lab.seed = (lab.seed * 1664525 + 1013904223) >>> 0; labRun(); });

  // ---- dibujo (sobre App.Plot: ejes, marcas, leyenda, lectura) ----
  // Ranuras de identidad de serie (1-based, la misma numeración de A.Fig.series):
  //   1 = serie observada (histograma de X̄ / media corriente)
  //   2 = referencia teórica (densidad Normal del TCL)
  //   3 = banda ±2σ/√n de la LGN
  // Si figures.js no expusiera A.Fig.series, App.Plot cae solo a --s1..--s6 y,
  // en último caso, a los tokens semánticos: acá no se codifica ningún hexadecimal.

  // Techo del eje Y en un valor redondo: se sube al múltiplo siguiente del paso
  // entre ticks por encima de ymax*1.05, para que todas las etiquetas sean redondas.
  function topY(v, n) {
    var t = A.Plot.ticks(0, v * 1.05, n || 5);
    var st = t.length > 1 ? t[1] - t[0] : (v || 1);
    return st > 0 ? Math.ceil((v * 1.05) / st) * st : v;
  }

  function drawHist(cv, means, mu, sdMean) {
    var P = A.Plot; if (!P || !cv) return;
    var s = P.setup(cv, 320), ctx = s.ctx;
    var box = P.frame(ctx, { W: s.W, H: s.H, pad: { l: 66 } });
    var lo = mu - 4.2 * sdMean, hi = mu + 4.2 * sdMean;
    var nb = 44, bins = new Array(nb).fill(0), bw = (hi - lo) / nb;
    means.forEach(function (m) { var b = Math.floor((m - lo) / bw); if (b >= 0 && b < nb) bins[b]++; });
    var rep = means.length, maxDens = 0;
    var dens = bins.map(function (c) { var dd = c / (rep * bw); if (dd > maxDens) maxDens = dd; return dd; });
    var centers = dens.map(function (_, i) { return lo + (i + 0.5) * bw; });
    var ymax = topY(Math.max(maxDens, M.normPDF(mu, mu, sdMean)), 6);

    var sx = P.scales([lo, hi], [box.x0, box.x1]);
    var sy = P.scales([0, ymax], [box.y1, box.y0]);
    P.axes(ctx, { sx: sx, sy: sy, box: box, xTicks: 8, yTicks: 6,
      xLabel: "X̄ (promedio muestral)", yLabel: "densidad" });

    var cHist = P.series(1), cNorm = P.series(2);
    // Relleno plano y opaco: la barra no lleva opacidad propia, así el swatch de
    // la leyenda puede ser exactamente el mismo color sin falsear la marca.
    P.bars(ctx, { sx: sx, sy: sy, xs: centers, ys: dens, base: sy(0),
      color: cHist, gap: 2, radius: 2 });

    var nx = [], ny = [], k;
    for (k = 0; k <= 240; k++) { var x = lo + (hi - lo) * k / 240; nx.push(x); ny.push(M.normPDF(x, mu, sdMean)); }
    P.curve(ctx, { sx: sx, sy: sy, xs: nx, ys: ny, color: cNorm, width: 2 });
    // La referencia μ es una anotación: trazo y swatch en --text-3 (legible en
    // los tres temas) y rótulo en --text-2 (lo pone Plot.vline). Nunca lleva el
    // color de una serie ni el de la rejilla.
    var cRef = P.cssVar("--text-3") || "#666";
    P.vline(ctx, mu, { sx: sx, box: box, label: "μ = " + num(mu, 3), color: cRef });

    P.legend("#labLegend", [
      { label: "histograma de X̄", color: cHist, kind: "bar" },
      { label: "Normal del TCL", color: cNorm, kind: "line" },
      { label: "μ (media teórica)", color: cRef, kind: "dash" }
    ]);
    P.a11y(cv, "Histograma de " + rep + " promedios muestrales X̄ de tamaño n = " + lab.n +
      ", con la densidad Normal del teorema central del límite superpuesta. Media teórica μ = " +
      num(mu, 4) + " y desvío de X̄ = " + num(sdMean, 5) + ".");
    P.hover(cv, {
      sx: sx, sy: sy, box: box, readout: "#labReadout",
      series: [{ label: "densidad", color: cHist, xs: centers, ys: dens }],
      fmt: function (pt) { return "X̄ ≈ " + num(pt.x, 4) + "   ·   densidad " + num(pt.y, 4); }
    });
  }

  function drawLGN(cv, pts, mu, sdX, N) {
    var P = A.Plot; if (!P || !cv) return;
    var s = P.setup(cv, 320), ctx = s.ctx;
    var box = P.frame(ctx, { W: s.W, H: s.H, pad: { l: 66 } });
    var ys = pts.map(function (p) { return p[1]; });
    var ymin = Math.min(mu - 2 * sdX, Math.min.apply(null, ys));
    var ymax = Math.max(mu + 2 * sdX, Math.max.apply(null, ys));
    var mrg = (ymax - ymin) * 0.08 || 1; ymin -= mrg; ymax += mrg;

    var sx = P.scales([1, Math.max(10, N)], [box.x0, box.x1], { log: true });
    var sy = P.scales([ymin, ymax], [box.y1, box.y0]);
    // Eje X logarítmico: los ticks son potencias de 10 y el rótulo lo declara.
    P.axes(ctx, { sx: sx, sy: sy, box: box, log: true, yTicks: 6, zero: box.y1,
      xLabel: "n (escala log)", yLabel: "media corriente X̄ₙ",
      fmtX: function (v) { return v >= 1000 ? (v / 1000) + "k" : String(Math.round(v)); } });

    var cRun = P.series(1), cBand = P.series(3);
    var bandA = P.tokenAlpha("--plot-band-a", 0.14);
    // Banda ±2σ/√n: una sola capa lavada a la opacidad del token del tema.
    ctx.save();
    ctx.setLineDash([]);
    ctx.fillStyle = P.alpha(cBand, bandA);
    ctx.beginPath();
    var i, n;
    for (i = 0; i < pts.length; i++) {
      n = pts[i][0];
      var px = sx(n), py = sy(mu + 2 * sdX / Math.sqrt(n));
      if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
    }
    for (i = pts.length - 1; i >= 0; i--) {
      n = pts[i][0];
      ctx.lineTo(sx(n), sy(mu - 2 * sdX / Math.sqrt(n)));
    }
    ctx.closePath(); ctx.fill();
    ctx.restore();

    // Referencia horizontal μ: trazo punteado en --text-3 (anotación legible en
    // los tres temas) + rótulo en --text-2.
    var cRef = P.cssVar("--text-3") || "#666";
    var yMu = Math.round(sy(mu)) + 0.5;
    ctx.save();
    ctx.strokeStyle = cRef;
    ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.moveTo(box.x0, yMu); ctx.lineTo(box.x1, yMu); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = P.cssVar("--text-2") || "#555";
    ctx.font = "600 11px " + (P.cssVar("--font-mono") || "monospace");
    ctx.textAlign = "right"; ctx.textBaseline = "bottom";
    ctx.fillText("μ = " + num(mu, 3), box.x1, yMu - 4);
    ctx.restore();

    var rx = pts.map(function (p) { return p[0]; });
    var ry = pts.map(function (p) { return p[1]; });
    P.curve(ctx, { sx: sx, sy: sy, xs: rx, ys: ry, color: cRun, width: 2 });

    P.legend("#labLegend", [
      { label: "media corriente X̄ₙ", color: cRun, kind: "line" },
      { label: "μ (media teórica)", color: cRef, kind: "dash" },
      { label: "banda ±2σ/√n", color: cBand, kind: "area", alpha: bandA }
    ]);
    P.a11y(cv, "Media corriente de una secuencia de hasta n = " + N +
      " observaciones, en eje horizontal logarítmico, con la banda ±2σ/√n alrededor de μ = " +
      num(mu, 4) + ". Media final: " + num(ry[ry.length - 1], 5) + ".");
    P.hover(cv, {
      sx: sx, sy: sy, box: box, readout: "#labReadout",
      series: [{ label: "media corriente", color: cRun, xs: rx, ys: ry }],
      fmt: function (pt) { return "n = " + Math.round(pt.x) + "   ·   X̄ₙ = " + num(pt.y, 5); }
    });
  }
})();
