/* ============================================================
   data/study-data.js — GENERADO por `scripts/extract-study-data.mjs`.
   No editar a mano: se regenera desde `estudio/study-data.js` del
   baseline de Proba.

   Hace dos cosas, en este orden:

   1. Publica `window.STUDY`. El runtime deja el JSON declarado en
      `manifest.data` en `App.STUDY`; el baseline lo leía del global.

   2. Vuelve a enganchar las 58 funciones que JSON no puede llevar
      (`DISTS[i].f`, `.domain`, `.mean`, `.varc`: cierran sobre la
      numérica `M` del runtime). El cuerpo de cada una es copia literal
      del original.

   Este archivo es el PRIMER script del manifiesto, antes que cualquier
   vista: el explorador, las calculadoras y el asistente asumen que las
   distribuciones ya vienen completas.
   ============================================================ */
(function () {
  "use strict";
  var A = window.App;
  var M = window.M || (A && A.M) || {};
  var data = (A && A.STUDY) || window.STUDY || null;

  if (!data || typeof data !== "object" || !data.DISTS) {
    if (typeof console !== "undefined" && console.warn) {
      console.warn("[proba-tools] No llegó `data/study-data.json`: el explorador, " +
        "las calculadoras y el asistente van a quedar sin distribuciones.");
    }
    window.STUDY = data || {};
    return;
  }

  // [ruta, función] — la ruta es relativa a la raíz de STUDY.
  var FNS = [
  [["DISTS",0,"f"], p => k => (k === 0 ? 1 - p.p : k === 1 ? p.p : 0)],
  [["DISTS",0,"domain"], () => [0, 1]],
  [["DISTS",0,"mean"], p => p.p],
  [["DISTS",0,"varc"], p => p.p * (1 - p.p)],
  [["DISTS",1,"f"], p => k => M.binomPMF(k, p.n, p.p)],
  [["DISTS",1,"domain"], p => [0, p.n]],
  [["DISTS",1,"mean"], p => p.n * p.p],
  [["DISTS",1,"varc"], p => p.n * p.p * (1 - p.p)],
  [["DISTS",2,"f"], p => k => (k < 0 ? 0 : Math.pow(1 - p.p, k) * p.p)],
  [["DISTS",2,"domain"], p => [0, Math.max(8, Math.ceil(Math.log(0.001) / Math.log(1 - p.p)))]],
  [["DISTS",2,"mean"], p => (1 - p.p) / p.p],
  [["DISTS",2,"varc"], p => (1 - p.p) / (p.p * p.p)],
  [["DISTS",3,"f"], p => k => (k < 0 ? 0 : Math.exp(M.combLog(k + p.r - 1, k)) * Math.pow(1 - p.p, k) * Math.pow(p.p, p.r))],
  [["DISTS",3,"domain"], p => [0, Math.max(12, Math.ceil(p.r * (1 - p.p) / p.p + 4 * Math.sqrt(p.r * (1 - p.p)) / p.p) + 6)]],
  [["DISTS",3,"mean"], p => p.r * (1 - p.p) / p.p],
  [["DISTS",3,"varc"], p => p.r * (1 - p.p) / (p.p * p.p)],
  [["DISTS",4,"valid"], p => p.M <= p.N && p.n <= p.N],
  [["DISTS",4,"f"], p => k => M.hyperPMF(k, p.N, p.M, p.n)],
  [["DISTS",4,"domain"], p => [Math.max(0, p.n - (p.N - p.M)), Math.min(p.n, p.M)]],
  [["DISTS",4,"mean"], p => p.n * p.M / p.N],
  [["DISTS",4,"varc"], p => p.n * (p.M / p.N) * (1 - p.M / p.N) * (p.N - p.n) / (p.N - 1)],
  [["DISTS",5,"f"], p => k => M.poissonPMF(k, p.lam)],
  [["DISTS",5,"domain"], p => [0, Math.max(8, Math.ceil(p.lam + 4 * Math.sqrt(p.lam) + 4))]],
  [["DISTS",5,"mean"], p => p.lam],
  [["DISTS",5,"varc"], p => p.lam],
  [["DISTS",6,"valid"], p => p.b > p.a],
  [["DISTS",6,"f"], p => x => (x >= p.a && x <= p.b ? 1 / (p.b - p.a) : 0)],
  [["DISTS",6,"domain"], p => [p.a - (p.b - p.a) * 0.15, p.b + (p.b - p.a) * 0.15]],
  [["DISTS",6,"mean"], p => (p.a + p.b) / 2],
  [["DISTS",6,"varc"], p => Math.pow(p.b - p.a, 2) / 12],
  [["DISTS",7,"f"], p => x => (x >= 0 ? p.lam * Math.exp(-p.lam * x) : 0)],
  [["DISTS",7,"domain"], p => [0, 6 / p.lam]],
  [["DISTS",7,"mean"], p => 1 / p.lam],
  [["DISTS",7,"varc"], p => 1 / (p.lam * p.lam)],
  [["DISTS",8,"f"], p => x => M.normPDF(x, p.mu, p.sigma)],
  [["DISTS",8,"domain"], p => [p.mu - 4 * p.sigma, p.mu + 4 * p.sigma]],
  [["DISTS",8,"mean"], p => p.mu],
  [["DISTS",8,"varc"], p => p.sigma * p.sigma],
  [["DISTS",9,"f"], p => x => (x > 0 ? Math.exp(p.a * Math.log(p.lam) + (p.a - 1) * Math.log(x) - p.lam * x - M.lgamma(p.a)) : 0)],
  [["DISTS",9,"domain"], p => [0, (p.a / p.lam) + 5 * Math.sqrt(p.a) / p.lam]],
  [["DISTS",9,"mean"], p => p.a / p.lam],
  [["DISTS",9,"varc"], p => p.a / (p.lam * p.lam)],
  [["DISTS",10,"f"], p => x => (x > 0 ? Math.exp(p.k * Math.log(p.lam) + (p.k - 1) * Math.log(x) - p.lam * x - M.lfact(p.k - 1)) : 0)],
  [["DISTS",10,"domain"], p => [0, (p.k / p.lam) + 5 * Math.sqrt(p.k) / p.lam]],
  [["DISTS",10,"mean"], p => p.k / p.lam],
  [["DISTS",10,"varc"], p => p.k / (p.lam * p.lam)],
  [["DISTS",11,"f"], p => x => (x > 0 ? p.lam * p.b * Math.pow(p.lam * x, p.b - 1) * Math.exp(-Math.pow(p.lam * x, p.b)) : 0)],
  [["DISTS",11,"domain"], p => [0, Math.pow(-Math.log(0.001), 1 / p.b) / p.lam]],
  [["DISTS",11,"mean"], p => M.gammafn(1 + 1 / p.b) / p.lam],
  [["DISTS",11,"varc"], p => (M.gammafn(1 + 2 / p.b) - Math.pow(M.gammafn(1 + 1 / p.b), 2)) / (p.lam * p.lam)],
  [["DISTS",12,"f"], p => x => M.tPDF(x, p.m)],
  [["DISTS",12,"domain"], () => [-5, 5]],
  [["DISTS",12,"mean"], p => (p.m > 1 ? 0 : null)],
  [["DISTS",12,"varc"], p => (p.m > 2 ? p.m / (p.m - 2) : null)],
  [["DISTS",13,"f"], p => x => M.chi2PDF(x, p.k)],
  [["DISTS",13,"domain"], p => [0, p.k + 5 * Math.sqrt(2 * p.k) + 5]],
  [["DISTS",13,"mean"], p => p.k],
  [["DISTS",13,"varc"], p => 2 * p.k]
  ];

  var reattached = 0, lost = 0;
  for (var i = 0; i < FNS.length; i++) {
    var p = FNS[i][0], node = data, j;
    for (j = 0; j < p.length - 1; j++) {
      node = node && node[p[j]];
      if (node == null) break;
    }
    if (node == null) { lost++; continue; }
    node[p[p.length - 1]] = FNS[i][1];
    reattached++;
  }

  if (lost && typeof console !== "undefined" && console.warn) {
    console.warn("[proba-tools] " + lost + " de " + FNS.length + " funciones de STUDY no " +
      "encontraron su lugar: `data/study-data.json` y `data/study-data.js` están " +
      "desincronizados (regenerá con scripts/extract-study-data.mjs).");
  }

  window.STUDY = data;
  if (A) A.STUDY = data;
})();
