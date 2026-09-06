/* [bundle proba-tools] Copia de `estudio/taller.js` del baseline de Proba.
   Las diferencias con el original están marcadas con «[bundle]» y explicadas
   en ADAPTACIONES.md. Compat de datos: el runtime deja el JSON declarado en
   `manifest.data` en `App.STUDY`; el baseline lo leía del global
   `window.STUDY`. El shim mantiene vivos los dos nombres. */
var STUDY = window.STUDY || (window.App && window.App.STUDY) || {};

/* ============================================================
   taller.js — TALLER DE RESOLUCIÓN: solvers interactivos para los
   arquetipos más recurrentes de los parciales/finales de 93.24.
   Vistas: taller (hub) · taller/<key>  (markov · confiabilidad · inferencia · bayes)
   Usa el contrato window.App (core.js) y la numérica window.M (lib-math.js,
   incluye álgebra lineal: matMul, matPow, stationary, matInverse, integrate).

   La matemática vive en funciones PURAS (mkCompute/cfCompute/infCompute/bsCompute)
   verificadas contra vectores de test adversariales; la UI sólo lee inputs,
   llama al compute y formatea. Expuestas en App._taller para testeo.
   ============================================================ */
(function () {
  "use strict";
  var A = window.App; if (!A) return;
  var M = window.M;
  // [bundle] `App.$` / `App.$$` no están en CompatApp (anotados para R4):
  // equivalentes locales con la misma semántica que los del baseline.
  var $ = typeof A.$ === "function" ? A.$ : function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = typeof A.$$ === "function" ? A.$$ : function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  // [bundle] El baseline llama `App.katex(tex, display)` como FUNCIÓN; el
  // contrato la declara como `{ renderToString }` (anotado para R4).
  var icon = A.icon, esc = A.escapeHtml;
  var katex = typeof A.katex === "function"
    ? A.katex
    : function (tex, display) {
        if (!A.katex || typeof A.katex.renderToString !== "function") return "";
        try {
          return A.katex.renderToString(tex, { displayMode: !!display, throwOnError: false, macros: A.KATEX_MACROS });
        } catch (e) { return ""; }
      };

  function num(x, d) { d = d == null ? 4 : d; if (x == null || !isFinite(x)) return x === Infinity ? "∞" : x === -Infinity ? "−∞" : "—"; var p = Math.pow(10, d); return String(Math.round(x * p) / p); }
  function K(tex, disp) { return katex(tex, !!disp); }

  var SOLVERS = [
    { key: "markov", title: "Cadenas de Markov", icon: "layers", color: "var(--u6)",
      blurb: "Matriz de transición → clasificación, distribución estacionaria, Pⁿ y tiempo medio a absorción con (I−Q)⁻¹." },
    { key: "confiabilidad", title: "Confiabilidad de sistemas", icon: "sliders", color: "var(--u4)",
      blurb: "Componentes exponenciales en serie/paralelo → confiabilidad R(t), vida media E[T] y P(T>E[T])." },
    { key: "inferencia", title: "Inferencia: IC · prueba · n", icon: "gauge", color: "var(--u8)",
      blurb: "Intervalos de confianza, prueba de hipótesis con valor p y tamaño de muestra, para media y proporción." },
    { key: "bayes", title: "Bayes / árbol", icon: "compass", color: "var(--u2)",
      blurb: "Partición de causas con priors y verosimilitudes → probabilidad total y posteriores, con árbol." },
    { key: "potencia", title: "Potencia y errores α/β", icon: "target", color: "var(--u9)",
      blurb: "Curvas H₀ y H₁ dibujadas: región de rechazo (α), error tipo II (β) y potencia 1−β, con sliders." },
  ];
  var BY_KEY = {}; SOLVERS.forEach(function (s) { BY_KEY[s.key] = s; });

  // ============================================================
  //  NÚCLEO DE CÁLCULO (puro, testeable)
  // ============================================================

  // ---- Markov ----
  function allPositive(Mx) { for (var i = 0; i < Mx.length; i++) for (var j = 0; j < Mx.length; j++) if (Mx[i][j] <= 1e-12) return false; return true; }
  function irreducible(P) {
    var n = P.length, R = [];
    for (var i = 0; i < n; i++) { R.push([]); for (var j = 0; j < n; j++) R[i].push(i === j || P[i][j] > 1e-12); }
    for (var k = 0; k < n; k++) for (var a = 0; a < n; a++) for (var b = 0; b < n; b++) if (R[a][k] && R[k][b]) R[a][b] = true;
    for (var x = 0; x < n; x++) for (var y = 0; y < n; y++) if (!R[x][y]) return false;
    return true;
  }
  function mkCompute(P, m) {
    var n = P.length;
    var rowSums = P.map(function (r) { return r.reduce(function (a, b) { return a + b; }, 0); });
    var rowsOk = rowSums.every(function (s) { return Math.abs(s - 1) < 1e-6; });
    if (!rowsOk) return { rowsOk: false, rowSums: rowSums };
    var absorbing = []; for (var i = 0; i < n; i++) if (Math.abs(P[i][i] - 1) < 1e-9) absorbing.push(i);
    // regular: alguna potencia con todas las entradas > 0 (cota de Wielandt (n-1)^2+1)
    var regular = false, kreg = 0, Pk = P.map(function (r) { return r.slice(); });
    var kmax = Math.max(1, (n - 1) * (n - 1) + 1);
    for (var k = 1; k <= kmax; k++) { if (allPositive(Pk)) { regular = true; kreg = k; break; } Pk = M.matMul(Pk, P); }
    var irred = irreducible(P);
    // π única ⟺ irreducible (y sin estados absorbentes); en cadenas absorbentes/reducibles no es única
    var pi = (absorbing.length === 0 && irred) ? M.stationary(P) : null;
    if (pi && !pi.every(function (v) { return isFinite(v); })) pi = null;
    var Pn = M.matPow(P, m);
    var meanToAbsorption = null, fundamental = null, transient = null;
    if (absorbing.length) {
      var trans = []; for (var t = 0; t < n; t++) if (absorbing.indexOf(t) < 0) trans.push(t);
      if (trans.length) {
        var Q = trans.map(function (r) { return trans.map(function (c) { return P[r][c]; }); });
        var ImQ = Q.map(function (r, ri) { return r.map(function (v, ci) { return (ri === ci ? 1 : 0) - v; }); });
        var N = M.matInverse(ImQ);
        if (N) { fundamental = N; transient = trans; meanToAbsorption = N.map(function (r) { return r.reduce(function (a, b) { return a + b; }, 0); }); }
      }
    }
    return { rowsOk: true, rowSums: rowSums, absorbing: absorbing, regular: regular, kreg: kreg, irreducible: irred, pi: pi, Pn: Pn, transient: transient, fundamental: fundamental, meanToAbsorption: meanToAbsorption };
  }

  // ---- Confiabilidad ----
  function cfRS(caseType, means, x) {
    if (caseType === "serie") { var L = means.reduce(function (a, m) { return a + 1 / m; }, 0); return Math.exp(-L * x); }
    if (caseType === "paralelo") { var prod = 1; means.forEach(function (m) { prod *= (1 - Math.exp(-x / m)); }); return 1 - prod; }
    // 2x2: rama A = means[0],means[1] en serie; rama B = means[2],means[3] en serie; ramas en paralelo
    var rA = 1 / means[0] + 1 / means[1], rB = 1 / means[2] + 1 / means[3];
    return 1 - (1 - Math.exp(-rA * x)) * (1 - Math.exp(-rB * x));
  }
  function cfCompute(caseType, means, t) {
    var RS = function (x) { return cfRS(caseType, means, x); };
    var Rt = RS(t);
    var maxMean = Math.max.apply(null, means.concat([1]));
    var ET = M.integrate(RS, 0, 40 * maxMean, 6000);
    return { Rt: Rt, ET: ET, P_T_gt_ET: RS(ET) };
  }

  // ---- Inferencia ----
  function infCompute(inp) {
    if (inp.task === "ic") {
      var alpha = 1 - inp.conf;
      if (inp.param === "media") {
        var sd = inp.sigma != null ? inp.sigma : inp.s;
        var crit = inp.sigmaKnown ? M.normInv(1 - alpha / 2) : M.tInv(1 - alpha / 2, inp.n - 1);
        var se = sd / Math.sqrt(inp.n), d = crit * se;
        return { crit: crit, se: se, margin: d, ic: [inp.xbar - d, inp.xbar + d] };
      }
      var z = M.normInv(1 - alpha / 2), sep = Math.sqrt(inp.phat * (1 - inp.phat) / inp.n), dp = z * sep;
      return { crit: z, se: sep, margin: dp, ic: [inp.phat - dp, inp.phat + dp] };
    }
    if (inp.task === "test") {
      var a = inp.alpha, tail = inp.tail, stat, useT = false, df = inp.n - 1, se;
      if (inp.param === "media") { var sdt = inp.sigma != null ? inp.sigma : inp.s; se = sdt / Math.sqrt(inp.n); stat = (inp.xbar - inp.mu0) / se; useT = !inp.sigmaKnown; }
      else { se = Math.sqrt(inp.p0 * (1 - inp.p0) / inp.n); stat = (inp.phat - inp.p0) / se; }
      var cdf = function (x) { return useT ? M.tCDF(x, df) : M.normCDF(x); };
      var inv = function (p) { return useT ? M.tInv(p, df) : M.normInv(p); };
      var crit, pval;
      if (tail === "two") { crit = inv(1 - a / 2); pval = 2 * (1 - cdf(Math.abs(stat))); }
      else if (tail === "right") { crit = inv(1 - a); pval = 1 - cdf(stat); }
      else { crit = inv(1 - a); pval = cdf(stat); }
      return { stat: stat, crit: Math.abs(crit), se: se, useT: useT, df: df, pvalue: pval, reject: pval < a };
    }
    // task === "n"
    var alphaN = 1 - inp.conf, zN = M.normInv(1 - alphaN / 2);
    var E = inp.semiancho != null ? inp.semiancho : inp.E;
    if (inp.param === "proporcion") {
      var pq = (inp.pPlan == null || inp.pPlan === "peor") ? 0.25 : inp.pPlan * (1 - inp.pPlan);
      return { crit: zN, n: Math.ceil(Math.pow(zN / E, 2) * pq), pq: pq };
    }
    var sdN = inp.sigma != null ? inp.sigma : inp.s;
    if (inp.sigmaKnown) return { crit: zN, n: Math.ceil(Math.pow(zN * sdN / E, 2)) };
    // σ desconocido: iterar (el fractil t depende de n), luego barrer al MENOR n autoconsistente
    var n = Math.max(2, Math.ceil(Math.pow(zN * sdN / E, 2)));
    for (var it = 0; it < 200; it++) { var tt = M.tInv(1 - alphaN / 2, n - 1); var need = Math.pow(tt * sdN / E, 2); var nn = Math.ceil(need); if (nn <= n) break; n = nn; }
    while (n > 2) { var t2 = M.tInv(1 - alphaN / 2, n - 2); if ((n - 1) >= Math.pow(t2 * sdN / E, 2)) n = n - 1; else break; }
    return { n: n, iterated: true };
  }

  // ---- Bayes ----
  function bsCompute(priors, like) {
    var pB = priors.reduce(function (a, p, i) { return a + p * like[i]; }, 0);
    // si P(B)=0 las posteriores son 0/0 (indefinidas): se devuelven null, no 0
    var post = priors.map(function (p, i) { return pB > 0 ? p * like[i] / pB : null; });
    return { pB: pB, post: post };
  }

  A._taller = { mkCompute: mkCompute, cfCompute: cfCompute, infCompute: infCompute, bsCompute: bsCompute, irreducible: irreducible, pwCompute: pwCompute };

  // ============================================================
  //  HUB  (#/taller)
  // ============================================================
  A.registerView("taller", function (main, arg) {
    if (arg && BY_KEY[arg]) { renderSolver(main, BY_KEY[arg]); return; }
    document.title = "Taller de resolución · Estudio P&E";
    var cards = SOLVERS.map(function (s) {
      return '<a class="kit-card card" href="#/taller/' + s.key + '" data-nav style="--kcol:' + s.color + '">' +
        '<div class="kit-card-top"><span class="kit-ic" style="background:color-mix(in srgb,' + s.color + ' 16%,transparent);color:' + s.color + '">' + icon(s.icon, 22) + "</span></div>" +
        "<h3>" + esc(s.title) + "</h3><p>" + esc(s.blurb) + "</p>" +
      "</a>";
    }).join("");
    main.innerHTML =
      '<div class="rm-hero"><div class="rm-hero-main">' +
        '<div class="eyebrow">' + icon("function", 13) + " Paso a paso</div>" +
        '<h1 class="section-title" style="margin:2px 0 6px">Taller de resolución</h1>' +
        '<p class="section-sub" style="margin:0">Cargue los datos del problema y la app desarrolla la solución con sus fórmulas.</p>' +
      "</div></div>" +
      '<div class="kit-grid">' + cards + "</div>" +
      '<div class="rm-foot"><a class="btn" href="#/plan" data-nav>' + icon("map", 14) + " Plan de estudio</a>" +
        '<a class="btn" href="#/calc" data-nav>' + icon("calc", 14) + " Calculadoras</a></div>";
  });

  function renderSolver(main, s) {
    document.title = s.title + " · Taller · Estudio P&E";
    // El core no conoce los títulos de los talleres: sin este setCrumbs el último
    // tramo sería la clave interna capitalizada ('Markov', 'Inferencia').
    A.setCrumbs([
      { label: "Inicio", hash: "#/inicio" },
      { label: "Taller de resolución", hash: "#/taller" },
      { label: s.title },
    ]);
    main.innerHTML = A.backBar("#/taller", "Taller de resolución") +
      '<header class="unit-hero" style="--ucol:' + s.color + '"><div class="eyebrow">' + icon(s.icon, 13) + " Taller</div>" +
      '<h1 class="section-title">' + esc(s.title) + '</h1><p class="section-sub" style="margin-bottom:0">' + esc(s.blurb) + "</p></header>" +
      '<div id="solverBody"></div>';
    var body = $("#solverBody");
    if (s.key === "markov") renderMarkov(body);
    else if (s.key === "confiabilidad") renderConfi(body);
    else if (s.key === "inferencia") renderInfer(body);
    else if (s.key === "bayes") renderBayes(body);
    else if (s.key === "potencia") renderPower(body);
  }

  // helpers de presentación
  function stepsBox(html) { return '<div class="card solver-result"><div class="rail-title" style="margin-bottom:10px">' + icon("lightbulb", 13) + " Resolución</div>" + html + "</div>"; }
  function step(title, body) { return '<div class="slv-step"><div class="slv-step-h">' + esc(title) + "</div><div class='slv-step-b'>" + body + "</div></div>"; }
  function matTable(Mx, hi) {
    return '<table class="slv-mat"><tbody>' + Mx.map(function (r, i) {
      return "<tr>" + r.map(function (v, j) { return "<td" + (hi && hi(i, j) ? ' class="hl"' : "") + ">" + num(v, 4) + "</td>"; }).join("") + "</tr>";
    }).join("") + "</tbody></table>";
  }
  function warn(msg) { return '<div class="slv-warn">' + icon("flag", 13) + " " + esc(msg) + "</div>"; }
  function row2(a, b) { return '<div class="slv-row2"><div>' + a + "</div><div>" + b + "</div></div>"; }
  function gv(id) { var el = $(id); return el ? parseFloat(el.value) : NaN; }

  // ============================================================
  //  1) MARKOV — UI
  // ============================================================
  var mk = { n: 4, P: null, m: 2 };
  function mkDefault(n) {
    if (n === 4) return [[0.7, 0.2, 0, 0.1], [0.1, 0.6, 0.2, 0.1], [0, 0.2, 0.6, 0.2], [0, 0, 0, 1]];
    if (n === 2) return [[0.9, 0.1], [0.5, 0.5]];
    if (n === 3) return [[0.5, 0.3, 0.2], [0.2, 0.6, 0.2], [0.1, 0.3, 0.6]];
    var Z = []; for (var i = 0; i < n; i++) { Z.push([]); for (var j = 0; j < n; j++) Z[i].push(i === j ? 1 : 0); } return Z;
  }
  function renderMarkov(body) {
    if (!mk.P || mk.P.length !== mk.n) mk.P = mkDefault(mk.n);
    var sizeSel = [2, 3, 4, 5].map(function (k) { return '<button data-mksize="' + k + '"' + (k === mk.n ? ' class="on"' : "") + ">" + k + "×" + k + "</button>"; }).join("");
    var grid = '<div class="mk-grid" style="grid-template-columns:repeat(' + mk.n + ',1fr)">';
    for (var i = 0; i < mk.n; i++) for (var j = 0; j < mk.n; j++)
      grid += '<input class="field mk-cell" id="mk_' + i + "_" + j + '" type="number" step="0.01" value="' + mk.P[i][j] + '" aria-label="P fila ' + (i + 1) + " col " + (j + 1) + '">';
    grid += "</div>";
    body.innerHTML =
      '<div class="card"><div class="slv-controls">' +
        '<div><label class="lbl">Estados</label><div class="seg" id="mkSize">' + sizeSel + "</div></div>" +
        '<div><label class="lbl">Potencia n (para Pⁿ)</label><input class="field" id="mkPow" type="number" min="1" max="100" step="1" value="' + mk.m + '" style="width:90px"></div>' +
        '<div class="slv-presets"><label class="lbl">Ejemplos</label><div><button class="chip-btn" data-mkpreset="catedra">Absorbente 4×4</button> <button class="chip-btn" data-mkpreset="regular3">Regular 3×3</button></div></div>' +
      "</div>" +
      '<div class="slv-matwrap"><div class="slv-matlabel">Matriz de transición P (fila i = desde el estado i, debe sumar 1)</div>' + grid + "</div>" +
      '<div style="margin-top:14px"><button class="btn primary" data-action="mk-solve">' + icon("play", 15) + " Resolver</button></div></div>" +
      '<div id="mkOut"></div>';
    $$("#mkSize button").forEach(function (b) { b.addEventListener("click", function () { mkRead(); mk.n = +b.dataset.mksize; mk.P = mkDefault(mk.n); renderMarkov(body); }); });
    $$("[data-mkpreset]", body).forEach(function (b) { b.addEventListener("click", function () { if (b.dataset.mkpreset === "catedra") { mk.n = 4; mk.P = mkDefault(4); } else { mk.n = 3; mk.P = mkDefault(3); } renderMarkov(body); }); });
  }
  function mkRead() {
    var P = []; for (var i = 0; i < mk.n; i++) { P.push([]); for (var j = 0; j < mk.n; j++) { var el = $("#mk_" + i + "_" + j); P[i].push(el ? parseFloat(el.value) || 0 : 0); } }
    mk.P = P; var pw = $("#mkPow"); mk.m = pw ? Math.max(1, Math.round(+pw.value || 1)) : 2;
  }
  function mkSolve() {
    mkRead();
    var r = mkCompute(mk.P, mk.m), out = "";
    if (!r.rowsOk) { $("#mkOut").innerHTML = stepsBox(step("Validación", warn("Hay filas que no suman 1: " + r.rowSums.map(function (s) { return num(s, 3); }).join(", ") + ". Corrija la matriz para que cada fila sume 1."))); return; }
    out += step("1. Validación", "Cada fila suma 1 ✓ (matriz estocástica válida).");
    var clas = "<ul class='slv-list'>" +
      "<li>Estados absorbentes (Pᵢᵢ=1): " + (r.absorbing.length ? r.absorbing.map(function (x) { return "e" + (x + 1); }).join(", ") : "ninguno") + "</li>" +
      "<li>¿Irreducible? " + (r.irreducible ? "Sí (todos los estados se comunican)." : "No (la cadena es reducible).") + "</li>" +
      "<li>¿Regular? " + (r.regular ? "Sí — " + K("P^{" + r.kreg + "}") + " tiene todas sus entradas positivas (irreducible y aperiódica)." : "No se halló potencia con todas las entradas positivas.") + "</li>" +
      "</ul>";
    out += step("2. Clasificación", clas);
    if (r.absorbing.length) {
      out += step("3. Distribución estacionaria", "Hay estado(s) absorbente(s): la estacionaria no es única; el análisis relevante es el <b>tiempo a absorción</b> (paso 5).");
    } else if (r.pi) {
      var piTxt = "<div class='slv-vec'>" + r.pi.map(function (x, i) { return "<span>π" + (i + 1) + " = <b>" + num(x, 5) + "</b></span>"; }).join("") + "</div>";
      out += step("3. Distribución estacionaria", "Resolviendo " + K("\\pi P=\\pi,\\ \\textstyle\\sum_i\\pi_i=1") + ":" + piTxt +
        (r.regular ? "<div class='slv-note'>Cadena regular ⇒ π es también la distribución <b>límite</b>: " + K("\\lim_{n\\to\\infty}P^n_{ij}=\\pi_j") + ".</div>"
          : "<div class='slv-note'>π satisface el balance, pero la cadena no es regular (p. ej. periódica): π puede no ser el límite de " + K("P^n") + ".</div>"));
    } else {
      out += step("3. Distribución estacionaria", warn("La cadena es reducible y sin un único estado absorbente: la distribución estacionaria no es única."));
    }
    out += step("4. P^" + mk.m + " (probabilidades a " + mk.m + " pasos)", K("P^{" + mk.m + "}") + matTable(r.Pn));
    if (r.meanToAbsorption) {
      var tlist = "<div class='slv-vec'>" + r.transient.map(function (st, idx) { return "<span>desde e" + (st + 1) + ": <b>" + num(r.meanToAbsorption[idx], 4) + "</b> pasos</span>"; }).join("") + "</div>";
      out += step("5. Tiempo medio a absorción", "Submatriz de transitorios Q, matriz fundamental " + K("N=(I-Q)^{-1}") + ":" + matTable(r.fundamental) +
        "Tiempo medio hasta la absorción desde cada estado transitorio = <b>suma de su fila</b> en N:" + tlist);
    }
    $("#mkOut").innerHTML = stepsBox(out);
    try { A.enhanceDoc($("#mkOut")); } catch (e) {}
  }
  A.registerAction("mk-solve", mkSolve);

  // ============================================================
  //  2) CONFIABILIDAD — UI
  // ============================================================
  var cf = { mode: "2x2" };
  function renderConfi(body) {
    var modes = [["serie", "n en serie"], ["paralelo", "n en paralelo"], ["2x2", "2 ramas ∥ · 2 en serie"]];
    var seg = modes.map(function (m) { return '<button data-cfmode="' + m[0] + '"' + (m[0] === cf.mode ? ' class="on"' : "") + ">" + m[1] + "</button>"; }).join("");
    var meansHtml = cf.mode === "2x2"
      ? '<label class="lbl">Medias de los 4 componentes — rama A: 1ª y 2ª · rama B: 3ª y 4ª (cada uno ~ Exp(1/Mᵢ))</label><input class="field" id="cf_means" type="text" value="1, 1, 1, 1">'
      : '<label class="lbl">Medias de los componentes (separadas por coma; cada uno ~ Exp(1/Mᵢ))</label><input class="field" id="cf_means" type="text" value="2, 2, 2">';
    body.innerHTML =
      '<div class="card"><div class="slv-controls">' +
        '<div><label class="lbl">Estructura</label><div class="seg" id="cfMode">' + seg + "</div></div>" +
        '<div><label class="lbl">Tiempo t</label><input class="field" id="cf_t" type="number" step="0.1" value="1" style="width:100px"></div>' +
      "</div>" +
      '<div style="margin-top:10px">' + meansHtml + "</div>" +
      '<div class="slv-note" style="margin-top:8px">Serie: falla si falla alguno → R=∏Rᵢ. Paralelo: falla si fallan todos → R=1−∏(1−Rᵢ). El 2×2 son 2 ramas en paralelo, cada una con 2 componentes en serie.</div>' +
      '<div style="margin-top:14px"><button class="btn primary" data-action="cf-solve">' + icon("play", 15) + " Resolver</button></div></div>" +
      '<div id="cfOut"></div>';
    $$("#cfMode button").forEach(function (b) { b.addEventListener("click", function () { cf.mode = b.dataset.cfmode; renderConfi(body); }); });
  }
  function cfSolve() {
    var t = parseFloat($("#cf_t").value); if (!isFinite(t)) t = 1;
    var means = ($("#cf_means").value || "").split(",").map(function (s) { return parseFloat(s.trim()); }).filter(function (x) { return isFinite(x) && x > 0; });
    if (cf.mode === "2x2" && means.length < 4) { while (means.length < 4) means.push(means[means.length - 1] || 1); }
    if (!means.length) means = [1];
    var r = cfCompute(cf.mode, means, t), out = "";
    var formula, detail = "";
    if (cf.mode === "serie") {
      var L = means.reduce(function (a, m) { return a + 1 / m; }, 0);
      formula = K("R_S(t)=\\prod_i e^{-\\lambda_i t}=e^{-(\\sum\\lambda_i)t}=e^{-" + num(L, 4) + "t}", true);
      detail = "Serie de exponenciales ⇒ el sistema es Exp(Σλ), con " + K("E[T]=1/\\sum\\lambda_i") + " y siempre " + K("P(T>E[T])=e^{-1}\\approx0.3679") + ".";
    } else if (cf.mode === "paralelo") {
      formula = K("R_S(t)=1-\\prod_i\\left(1-e^{-\\lambda_i t}\\right)", true);
      detail = "Paralelo ⇒ falla si fallan todos. E[T] se obtiene integrando R(t).";
    } else {
      formula = K("R_S(t)=1-\\left(1-e^{-r_A t}\\right)\\left(1-e^{-r_B t}\\right)", true);
      detail = "Cada rama (2 en serie) colapsa a Exp(rama). " + K("r_A=\\tfrac1{M_1}+\\tfrac1{M_2}=" + num(1 / means[0] + 1 / means[1], 4) + ",\\ r_B=\\tfrac1{M_3}+\\tfrac1{M_4}=" + num(1 / means[2] + 1 / means[3], 4));
    }
    out += step("1. Confiabilidad del sistema", formula + detail);
    out += step("2. R(t) en t = " + num(t, 4), K("R_S(" + num(t, 4) + ")=" + num(r.Rt, 6)));
    out += step("3. Vida media E[T]", K("E[T]=\\int_0^\\infty R_S(t)\\,dt\\approx " + num(r.ET, 5)) + "<div class='slv-note'>(integración numérica de R(t))</div>");
    out += step("4. P(T > E[T])", K("P(T>E[T])=R_S(E[T])\\approx " + num(r.P_T_gt_ET, 6)));
    $("#cfOut").innerHTML = stepsBox(out);
    try { A.enhanceDoc($("#cfOut")); } catch (e) {}
  }
  A.registerAction("cf-solve", cfSolve);

  // ============================================================
  //  3) INFERENCIA — UI
  // ============================================================
  var inf = { task: "ic", param: "media", sigmaKnown: true, tail: "two" };
  function renderInfer(body) {
    var tabs = [["ic", "Intervalo de confianza"], ["test", "Prueba de hipótesis"], ["n", "Tamaño de muestra"]]
      .map(function (t) { return '<button data-inftask="' + t[0] + '"' + (t[0] === inf.task ? ' class="on"' : "") + ">" + t[1] + "</button>"; }).join("");
    var pars = [["media", "Media μ"], ["proporcion", "Proporción p"]]
      .map(function (p) { return '<button data-infparam="' + p[0] + '"' + (p[0] === inf.param ? ' class="on"' : "") + ">" + p[1] + "</button>"; }).join("");
    var isMedia = inf.param === "media";
    var sigSeg = '<label class="lbl">σ</label><div class="seg" id="infSig"><button data-infsig="1"' + (inf.sigmaKnown ? ' class="on"' : "") + '>conocido (Z)</button><button data-infsig="0"' + (!inf.sigmaKnown ? ' class="on"' : "") + '>desconocido (t)</button></div>';
    var tailSeg = '<label class="lbl">H₁</label><div class="seg" id="infTail"><button data-inftail="two"' + (inf.tail === "two" ? ' class="on"' : "") + '>≠</button><button data-inftail="right"' + (inf.tail === "right" ? ' class="on"' : "") + '>&gt;</button><button data-inftail="left"' + (inf.tail === "left" ? ' class="on"' : "") + '>&lt;</button></div>';
    var fields = "", showSig = false;
    if (inf.task === "ic") {
      showSig = isMedia;
      fields += isMedia
        ? row2('<label class="lbl">n</label><input class="field" id="if_n" type="number" value="16">', '<label class="lbl">media x̄</label><input class="field" id="if_xbar" type="number" step="any" value="20.5">') +
          row2('<label class="lbl">' + (inf.sigmaKnown ? "σ (desvío poblacional)" : "s (desvío muestral)") + '</label><input class="field" id="if_sd" type="number" step="any" value="2.4">', '<label class="lbl">Confianza</label><input class="field" id="if_conf" type="number" step="0.01" value="0.95">')
        : row2('<label class="lbl">n</label><input class="field" id="if_n" type="number" value="400">', '<label class="lbl">p̂</label><input class="field" id="if_phat" type="number" step="any" value="0.30">') +
          '<div><label class="lbl">Confianza</label><input class="field" id="if_conf" type="number" step="0.01" value="0.95" style="width:120px"></div>';
    } else if (inf.task === "test") {
      showSig = isMedia;
      fields += isMedia
        ? row2('<label class="lbl">n</label><input class="field" id="if_n" type="number" value="36">', '<label class="lbl">media x̄</label><input class="field" id="if_xbar" type="number" step="any" value="103">') +
          row2('<label class="lbl">' + (inf.sigmaKnown ? "σ" : "s") + '</label><input class="field" id="if_sd" type="number" step="any" value="10">', '<label class="lbl">μ₀ (H₀)</label><input class="field" id="if_mu0" type="number" step="any" value="100">') +
          row2('<label class="lbl">α</label><input class="field" id="if_alpha" type="number" step="0.01" value="0.05">', tailSeg)
        : row2('<label class="lbl">n</label><input class="field" id="if_n" type="number" value="150">', '<label class="lbl">p̂</label><input class="field" id="if_phat" type="number" step="any" value="0.55">') +
          row2('<label class="lbl">p₀ (H₀)</label><input class="field" id="if_p0" type="number" step="any" value="0.5">', '<label class="lbl">α</label><input class="field" id="if_alpha" type="number" step="0.01" value="0.05">') +
          "<div>" + tailSeg + "</div>";
    } else {
      showSig = isMedia;
      fields += isMedia
        ? row2('<label class="lbl">' + (inf.sigmaKnown ? "σ (conocido)" : "s (estimado)") + '</label><input class="field" id="if_sd" type="number" step="any" value="8">', '<label class="lbl">semiancho deseado E</label><input class="field" id="if_E" type="number" step="any" value="2">') +
          '<div><label class="lbl">Confianza</label><input class="field" id="if_conf" type="number" step="0.01" value="0.95" style="width:120px"></div>'
        : row2('<label class="lbl">semiancho deseado E</label><input class="field" id="if_E" type="number" step="any" value="0.03">', '<label class="lbl">Confianza</label><input class="field" id="if_conf" type="number" step="0.01" value="0.95">') +
          '<div><label class="lbl">p̂ (opcional; vacío ⇒ peor caso ½)</label><input class="field" id="if_phat" type="number" step="any" placeholder="½" style="width:170px"></div>';
    }
    body.innerHTML =
      '<div class="card"><div class="slv-controls">' +
        '<div><label class="lbl">Qué calcular</label><div class="seg" id="infTask">' + tabs + "</div></div>" +
        '<div><label class="lbl">Parámetro</label><div class="seg" id="infParam">' + pars + "</div></div>" +
        (showSig ? "<div>" + sigSeg + "</div>" : "") +
      "</div>" +
      '<div class="slv-fields">' + fields + "</div>" +
      '<div style="margin-top:14px"><button class="btn primary" data-action="inf-solve">' + icon("play", 15) + " Resolver</button></div></div>" +
      '<div id="infOut"></div>';
    $$("#infTask button").forEach(function (b) { b.addEventListener("click", function () { inf.task = b.dataset.inftask; renderInfer(body); }); });
    $$("#infParam button").forEach(function (b) { b.addEventListener("click", function () { inf.param = b.dataset.infparam; renderInfer(body); }); });
    var sig = $("#infSig"); if (sig) $$("#infSig button").forEach(function (b) { b.addEventListener("click", function () { inf.sigmaKnown = b.dataset.infsig === "1"; renderInfer(body); }); });
    var tl = $("#infTail"); if (tl) $$("#infTail button").forEach(function (b) { b.addEventListener("click", function () { inf.tail = b.dataset.inftail; renderInfer(body); }); });
  }
  function infSolve() {
    var out = "", isMedia = inf.param === "media", r;
    if (inf.task === "ic") {
      var inp = { task: "ic", param: inf.param, sigmaKnown: inf.sigmaKnown, n: gv("#if_n"), conf: gv("#if_conf") };
      if (isMedia) { inp.xbar = gv("#if_xbar"); if (inf.sigmaKnown) inp.sigma = gv("#if_sd"); else inp.s = gv("#if_sd"); } else { inp.phat = gv("#if_phat"); }
      r = infCompute(inp);
      var title = isMedia ? (inf.sigmaKnown ? "IC para μ (σ conocido)" : "IC para μ (σ desconocido, t de Student)") : "IC para la proporción p";
      var formula = isMedia ? (inf.sigmaKnown ? "\\bar X \\pm z_{1-\\alpha/2}\\,\\dfrac{\\sigma}{\\sqrt n}" : "\\bar X \\pm t_{n-1,\\,1-\\alpha/2}\\,\\dfrac{S}{\\sqrt n}") : "\\hat p \\pm z_{1-\\alpha/2}\\sqrt{\\dfrac{\\hat p(1-\\hat p)}{n}}";
      out += step(title, K(formula, true) + "fractil = " + num(r.crit, 4) + ", SE = " + num(r.se, 5) + ", margen = " + num(r.margin, 5) +
        "<div class='slv-ic'>IC = [ <b>" + num(r.ic[0], 5) + "</b> , <b>" + num(r.ic[1], 5) + "</b> ]</div>");
    } else if (inf.task === "test") {
      var inT = { task: "test", param: inf.param, sigmaKnown: inf.sigmaKnown, tail: inf.tail, n: gv("#if_n"), alpha: gv("#if_alpha") };
      if (isMedia) { inT.xbar = gv("#if_xbar"); inT.mu0 = gv("#if_mu0"); if (inf.sigmaKnown) inT.sigma = gv("#if_sd"); else inT.s = gv("#if_sd"); } else { inT.phat = gv("#if_phat"); inT.p0 = gv("#if_p0"); }
      r = infCompute(inT);
      var sym = isMedia ? (r.useT ? "T" : "Z") : "Z";
      var critTxt = inf.tail === "two" ? "±" + num(r.crit, 4) : (inf.tail === "right" ? "+" + num(r.crit, 4) : "−" + num(r.crit, 4));
      out += step("Prueba de " + (isMedia ? "media" : "proporción") + " (" + (inf.tail === "two" ? "dos colas" : inf.tail === "right" ? "cola derecha" : "cola izquierda") + ")",
        K(sym + "=\\dfrac{" + (isMedia ? "\\bar X-\\mu_0" : "\\hat p-p_0") + "}{" + (isMedia ? (r.useT ? "S" : "\\sigma") + "/\\sqrt n" : "\\sqrt{p_0(1-p_0)/n}") + "}", true) +
        "<ul class='slv-list'><li>Estadístico " + sym + " = <b>" + num(r.stat, 4) + "</b>" + (r.useT ? " (t con " + r.df + " g.l.)" : " (N(0,1))") + "</li>" +
        "<li>Valor crítico (α=" + num(inT.alpha, 3) + "): " + critTxt + "</li>" +
        "<li>Valor p = <b>" + num(r.pvalue, 5) + "</b></li>" +
        "<li>Decisión: <b class='" + (r.reject ? "slv-rej" : "slv-acc") + "'>" + (r.reject ? "se rechaza H₀" : "no se rechaza H₀") + "</b> (p " + (r.reject ? "<" : "≥") + " α)</li></ul>");
    } else {
      var inN = { task: "n", param: inf.param, sigmaKnown: inf.sigmaKnown, conf: gv("#if_conf"), semiancho: gv("#if_E") };
      if (isMedia) inN[inf.sigmaKnown ? "sigma" : "s"] = gv("#if_sd");
      else { var phEl = $("#if_phat"); inN.pPlan = (phEl && phEl.value !== "") ? parseFloat(phEl.value) : "peor"; }
      r = infCompute(inN);
      if (isMedia && inf.sigmaKnown) out += step("Tamaño de muestra para la media (σ conocido)", K("n=\\left(\\dfrac{z_{1-\\alpha/2}\\,\\sigma}{E}\\right)^2", true) + "fractil z = " + num(r.crit, 4) + " ⇒ <b>n = " + r.n + "</b> (redondeo hacia arriba)");
      else if (isMedia) out += step("Tamaño de muestra para la media (σ desconocido, iterando t)", K("n\\ge\\left(\\dfrac{t_{n-1,\\,1-\\alpha/2}\\,S}{E}\\right)^2", true) + "Como el fractil t depende de n, se itera y se toma el menor n autoconsistente: <b>n = " + r.n + "</b>");
      else out += step("Tamaño de muestra para la proporción", K("n=\\left(\\dfrac{z_{1-\\alpha/2}}{E}\\right)^2\\,p(1-p)", true) + ((inN.pPlan === "peor") ? "Peor caso p=½ ⇒ p(1−p)=0.25. " : "p(1−p) = " + num(r.pq, 4) + ". ") + "fractil z = " + num(r.crit, 4) + " ⇒ <b>n = " + r.n + "</b>");
    }
    $("#infOut").innerHTML = stepsBox(out);
    try { A.enhanceDoc($("#infOut")); } catch (e) {}
  }
  A.registerAction("inf-solve", infSolve);

  // ============================================================
  //  4) BAYES — UI
  // ============================================================
  var bs = { k: 3 };
  function renderBayes(body) {
    var sizeSel = [2, 3, 4, 5].map(function (k) { return '<button data-bssize="' + k + '"' + (k === bs.k ? ' class="on"' : "") + ">" + k + "</button>"; }).join("");
    var defP = bs.k === 3 ? [0.5, 0.3, 0.2] : null, defL = bs.k === 3 ? [0.03, 0.04, 0.05] : null, rows = "";
    for (var i = 0; i < bs.k; i++)
      rows += row2('<label class="lbl">P(A' + (i + 1) + ') prior</label><input class="field bs-prior" id="bs_pr_' + i + '" type="number" step="any" value="' + (defP ? defP[i] : num(1 / bs.k, 4)) + '">',
        '<label class="lbl">P(B | A' + (i + 1) + ') verosimilitud</label><input class="field bs-like" id="bs_lk_' + i + '" type="number" step="any" value="' + (defL ? defL[i] : 0.5) + '">');
    body.innerHTML =
      '<div class="card"><div class="slv-controls"><div><label class="lbl">Causas (partición)</label><div class="seg" id="bsSize">' + sizeSel + "</div></div></div>" +
      '<div class="slv-note" style="margin:6px 0 10px">Los priors P(Aᵢ) deben sumar 1. B es el evento observado.</div>' +
      '<div class="slv-fields">' + rows + "</div>" +
      '<div style="margin-top:14px"><button class="btn primary" data-action="bs-solve">' + icon("play", 15) + " Resolver</button></div></div>" +
      '<div id="bsOut"></div>';
    $$("#bsSize button").forEach(function (b) { b.addEventListener("click", function () { bs.k = +b.dataset.bssize; renderBayes(body); }); });
  }
  function bsSolve() {
    var pr = [], lk = [];
    for (var i = 0; i < bs.k; i++) { pr.push(parseFloat(($("#bs_pr_" + i) || {}).value) || 0); lk.push(parseFloat(($("#bs_lk_" + i) || {}).value) || 0); }
    var sumPr = pr.reduce(function (a, b) { return a + b; }, 0);
    var r = bsCompute(pr, lk), out = "";
    if (Math.abs(sumPr - 1) > 1e-6) out += warn("Los priors suman " + num(sumPr, 4) + " (deberían sumar 1).");
    out += step("1. Probabilidad total", K("P(B)=\\sum_i P(B\\mid A_i)\\,P(A_i)", true) +
      "<div class='slv-vec'>" + pr.map(function (p, i) { return "<span>" + num(p, 3) + "·" + num(lk[i], 3) + "</span>"; }).join(" + ") + " = <b>P(B) = " + num(r.pB, 5) + "</b></div>");
    var tbl = "<table class='slv-mat bayes'><thead><tr><th>i</th><th>P(Aᵢ)</th><th>P(B|Aᵢ)</th><th>P(Aᵢ|B)</th></tr></thead><tbody>" +
      pr.map(function (p, i) { return "<tr><td>A" + (i + 1) + "</td><td>" + num(p, 4) + "</td><td>" + num(lk[i], 4) + "</td><td class='hl'>" + num(r.post[i], 5) + "</td></tr>"; }).join("") + "</tbody></table>";
    out += step("2. Posteriores (Bayes)", K("P(A_i\\mid B)=\\dfrac{P(B\\mid A_i)P(A_i)}{P(B)}", true) + tbl +
      "<div class='slv-note'>Suma de posteriores = " + num(r.post.reduce(function (a, b) { return a + b; }, 0), 5) + " (debe dar 1).</div>");
    $("#bsOut").innerHTML = stepsBox(out);
    try { A.enhanceDoc($("#bsOut")); } catch (e) {}
  }
  A.registerAction("bs-solve", bsSolve);

  // ============================================================
  //  5) POTENCIA y errores α/β  (visualizador con canvas)
  // ============================================================
  function pwCompute(inp) {
    var alpha = inp.alpha, tail = inp.tail, c0, c1, se0, se1;
    if (inp.param === "media") { var se = inp.sigma / Math.sqrt(inp.n); c0 = inp.mu0; c1 = inp.mu1; se0 = se; se1 = se; }
    else { c0 = inp.p0; c1 = inp.p1; se0 = Math.sqrt(inp.p0 * (1 - inp.p0) / inp.n); se1 = Math.sqrt(inp.p1 * (1 - inp.p1) / inp.n); }
    var crit, beta;
    if (tail === "right") { var zr = M.normInv(1 - alpha); var cr = c0 + zr * se0; crit = [cr]; beta = M.normCDF(cr, c1, se1); }
    else if (tail === "left") { var zl = M.normInv(1 - alpha); var cl = c0 - zl * se0; crit = [cl]; beta = 1 - M.normCDF(cl, c1, se1); }
    else { var zt = M.normInv(1 - alpha / 2); var lo = c0 - zt * se0, hi = c0 + zt * se0; crit = [lo, hi]; beta = M.normCDF(hi, c1, se1) - M.normCDF(lo, c1, se1); }
    return { center0: c0, center1: c1, se0: se0, se1: se1, crit: crit, beta: beta, power: 1 - beta, tail: tail, param: inp.param };
  }
  A._taller.pwCompute = pwCompute;

  var pw = { param: "media", tail: "right", last: null };
  function renderPower(body) {
    var isMedia = pw.param === "media";
    var parSeg = [["media", "Media μ (σ conocido)"], ["proporcion", "Proporción p"]].map(function (p) { return '<button data-pwparam="' + p[0] + '"' + (p[0] === pw.param ? ' class="on"' : "") + ">" + p[1] + "</button>"; }).join("");
    var tailSeg = [["two", "≠"], ["right", ">"], ["left", "<"]].map(function (t) { return '<button data-pwtail="' + t[0] + '"' + (t[0] === pw.tail ? ' class="on"' : "") + ">" + t[1] + "</button>"; }).join("");
    var fields = isMedia
      ? row2('<label class="lbl">μ₀ (H₀)</label><input class="field" id="pw_mu0" type="number" step="any" value="100">', '<label class="lbl">μ₁ (alternativa real)</label><input class="field" id="pw_mu1" type="number" step="any" value="104">') +
        row2('<label class="lbl">σ</label><input class="field" id="pw_sigma" type="number" step="any" value="10">', '<label class="lbl">n</label><input class="field" id="pw_n" type="number" value="25">')
      : row2('<label class="lbl">p₀ (H₀)</label><input class="field" id="pw_p0" type="number" step="any" value="0.5">', '<label class="lbl">p₁ (alternativa real)</label><input class="field" id="pw_p1" type="number" step="any" value="0.6">') +
        '<div><label class="lbl">n</label><input class="field" id="pw_n" type="number" value="100" style="width:120px"></div>';
    body.innerHTML =
      '<div class="card"><div class="slv-controls">' +
        '<div><label class="lbl">Parámetro</label><div class="seg" id="pwParam">' + parSeg + "</div></div>" +
        '<div><label class="lbl">H₁</label><div class="seg" id="pwTail">' + tailSeg + "</div></div>" +
        '<div><label class="lbl">α</label><input class="field" id="pw_alpha" type="number" step="0.01" value="0.05" style="width:90px"></div>' +
      "</div>" +
      '<div class="slv-fields">' + fields + "</div>" +
      '<div style="margin-top:14px"><button class="btn primary" data-action="pw-solve">' + icon("play", 15) + " Dibujar</button></div></div>" +
      '<div class="card pw-card"><canvas id="pwCanvas" class="pw-canvas"></canvas>' +
        '<div class="pw-legend" id="pwLegend"></div>' +
        '<div class="pw-readout" id="pwReadout" hidden></div>' +
      "</div>" +
      '<div id="pwOut"></div>';
    $$("#pwParam button").forEach(function (b) { b.addEventListener("click", function () { pw.param = b.dataset.pwparam; renderPower(body); }); });
    $$("#pwTail button").forEach(function (b) { b.addEventListener("click", function () { pw.tail = b.dataset.pwtail; renderPower(body); }); });
    pwSolve(); // dibuja el escenario por defecto al entrar
  }
  function pwSolve() {
    var inp = { param: pw.param, tail: pw.tail, alpha: gv("#pw_alpha"), n: gv("#pw_n") };
    if (pw.param === "media") { inp.mu0 = gv("#pw_mu0"); inp.mu1 = gv("#pw_mu1"); inp.sigma = gv("#pw_sigma"); }
    else { inp.p0 = gv("#pw_p0"); inp.p1 = gv("#pw_p1"); }
    var r = pwCompute(inp); pw.last = r;
    var cv = $("#pwCanvas"); if (cv) drawPower(cv, r);
    A.setRedraw(function () { var c = $("#pwCanvas"); if (c && pw.last) drawPower(c, pw.last); });
    var critTxt = r.crit.map(function (c) { return num(c, 4); }).join(" y ");
    var out = step("Región de rechazo, β y potencia",
      "<ul class='slv-list'>" +
        "<li>Valor(es) crítico(s) (bajo H₀, " + (pw.tail === "two" ? "dos colas" : pw.tail === "right" ? "cola derecha" : "cola izquierda") + "): <b>" + critTxt + "</b></li>" +
        "<li>Nivel α = " + num(inp.alpha, 3) + " · Error tipo II " + K("\\beta") + " = <b>" + num(r.beta, 5) + "</b></li>" +
        "<li>Potencia " + K("1-\\beta") + " = <b class='slv-acc'>" + num(r.power, 5) + "</b></li>" +
      "</ul>" +
      "<div class='slv-note'>El crítico se fija bajo H₀ (área α). β es el área de H₁ que cae en la zona de NO rechazo; subir n o α, o alejar la alternativa, achica β y sube la potencia.</div>");
    $("#pwOut").innerHTML = stepsBox(out);
    try { A.enhanceDoc($("#pwOut")); } catch (e) {}
  }
  A.registerAction("pw-solve", pwSolve);

  // Dibujo del visualizador de potencia sobre App.Plot.
  // Ranuras de identidad de serie (1-based, la misma numeración de A.Fig.series):
  //   1 = H₀ (y su cola de rechazo, el área α)
  //   2 = H₁ (y su zona de no rechazo, el área β)
  // Cada área lleva el color de la curva bajo la que se calcula, así la leyenda
  // nombra las cuatro codificaciones con dos identidades y no con cuatro.
  // Si figures.js no expusiera A.Fig.series, App.Plot cae solo a --s1..--s6 y,
  // en último caso, a los tokens semánticos: acá no se codifica ningún hexadecimal.
  function drawPower(cv, r) {
    var P = A.Plot; if (!P || !cv) return;
    var s = P.setup(cv, 300), ctx = s.ctx;
    var box = P.frame(ctx, { W: s.W, H: s.H, pad: { l: 66 } });
    var mu0 = r.center0, mu1 = r.center1, se0 = r.se0, se1 = r.se1, seMax = Math.max(se0, se1);
    var xmin = Math.min(mu0, mu1) - 4.3 * seMax, xmax = Math.max(mu0, mu1) + 4.3 * seMax;
    var pdf0 = function (x) { return M.normPDF(x, mu0, se0); };
    var pdf1 = function (x) { return M.normPDF(x, mu1, se1); };
    // Techo del eje Y en un valor redondo (múltiplo siguiente del paso entre ticks).
    var peak = Math.max(pdf0(mu0), pdf1(mu1));
    var t0 = P.ticks(0, peak * 1.05, 6), st = t0.length > 1 ? t0[1] - t0[0] : (peak || 1);
    var ymax = st > 0 ? Math.ceil((peak * 1.05) / st) * st : peak;

    var sx = P.scales([xmin, xmax], [box.x0, box.x1]);
    var sy = P.scales([0, ymax], [box.y1, box.y0]);
    var isMedia = r.param === "media";
    P.axes(ctx, { sx: sx, sy: sy, box: box, xTicks: 8, yTicks: 6,
      xLabel: isMedia ? "X̄ (media muestral)" : "p̂ (proporción muestral)", yLabel: "densidad" });

    var cH0 = P.series(1), cH1 = P.series(2);
    var fillA = P.tokenAlpha("--plot-fill-a", 0.28);
    var NS = 260, crit = r.crit, tail = r.tail;
    var rej = tail === "right" ? function (x) { return x >= crit[0]; }
      : tail === "left" ? function (x) { return x <= crit[0]; }
      : function (x) { return x <= crit[0] || x >= crit[1]; };
    var acc = function (x) { return !rej(x); };
    var gx = [], g0 = [], g1 = [], i;
    for (i = 0; i <= NS; i++) {
      var xv = xmin + (xmax - xmin) * i / NS;
      gx.push(xv); g0.push(pdf0(xv)); g1.push(pdf1(xv));
    }
    // Una sola capa lavada por región, sin degradado y sin apilar lavados.
    function fillRegion(ys, test, color) {
      ctx.save();
      ctx.setLineDash([]);
      ctx.fillStyle = P.alpha(color, fillA);
      var seg = [];
      function flush() {
        if (seg.length > 1) {
          ctx.beginPath();
          ctx.moveTo(seg[0][0], sy(0));
          for (var k = 0; k < seg.length; k++) ctx.lineTo(seg[k][0], seg[k][1]);
          ctx.lineTo(seg[seg.length - 1][0], sy(0));
          ctx.closePath(); ctx.fill();
        }
        seg = [];
      }
      for (var j = 0; j <= NS; j++) {
        if (test(gx[j])) seg.push([sx(gx[j]), sy(ys[j])]); else flush();
      }
      flush();
      ctx.restore();
    }
    fillRegion(g0, rej, cH0);
    fillRegion(g1, acc, cH1);
    P.curve(ctx, { sx: sx, sy: sy, xs: gx, ys: g0, color: cH0, width: 2 });
    P.curve(ctx, { sx: sx, sy: sy, xs: gx, ys: g1, color: cH1, width: 2 });

    // Valor(es) crítico(s): el rótulo va en --text-2, nunca en el color del dato.
    crit.forEach(function (c, k) {
      P.vline(ctx, c, { sx: sx, box: box, label: "c" + (crit.length > 1 ? (k + 1) : "") + " = " + num(c, 3) });
    });

    // Rótulo de cada campana: guion corto del color de la serie + texto en --text-2.
    function tag(txt, cx, cy, col) {
      ctx.save();
      ctx.font = "600 12px " + (P.cssVar("--font-ui") || "sans-serif");
      var tw = ctx.measureText(txt).width, dash = 14, gap = 5, tot = dash + gap + tw;
      var lx = Math.max(box.x0, Math.min(box.x1 - tot, cx - tot / 2));
      var ly = Math.max(box.y0 + 6, cy);
      ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.lineCap = "round"; ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + dash, ly); ctx.stroke();
      ctx.fillStyle = P.cssVar("--text-2") || "#555";
      ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.fillText(txt, lx + dash + gap, ly);
      ctx.restore();
    }
    tag("H₀", sx(mu0), sy(pdf0(mu0)) - 9, cH0);
    tag("H₁", sx(mu1), sy(pdf1(mu1)) - 9, cH1);

    P.legend("#pwLegend", [
      { label: "H₀ (no hay efecto)", color: cH0, kind: "line" },
      { label: "H₁ (efecto real)", color: cH1, kind: "line" },
      { label: "α · rechazo", color: cH0, kind: "area", alpha: fillA },
      { label: "β · error II", color: cH1, kind: "area", alpha: fillA }
    ]);
    P.a11y(cv, "Densidades de la distribución del estadístico bajo H₀ (centro " + num(mu0, 4) +
      ") y bajo H₁ (centro " + num(mu1, 4) + "), con el valor crítico en " +
      crit.map(function (c) { return num(c, 4); }).join(" y ") + ". Área α de rechazo bajo H₀ y área β = " +
      num(r.beta, 4) + " bajo H₁; potencia " + num(r.power, 4) + ".");
    P.hover(cv, {
      sx: sx, sy: sy, box: box, readout: "#pwReadout",
      series: [{ label: "H₀", color: cH0, xs: gx, ys: g0 }],
      fmt: function (pt) {
        return (isMedia ? "X̄" : "p̂") + " = " + num(pt.x, 3) +
          "   ·   densidad H₀ " + num(pdf0(pt.x), 4) +
          "   ·   densidad H₁ " + num(pdf1(pt.x), 4);
      }
    });
  }
})();
