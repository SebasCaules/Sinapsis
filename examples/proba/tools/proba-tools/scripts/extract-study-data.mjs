#!/usr/bin/env node
/**
 * extract-study-data.mjs — parte el `study-data.js` del baseline de Proba en
 * las dos mitades que necesita el bundle.
 *
 * El original es un script clásico que asigna
 *   `window.STUDY = { DISTS, FLASHCARDS, QUIZ, DIST_WIZARD, TEST_WIZARD,
 *                     CHEATSHEETS, ROADMAP, KITS }`
 * y sus distribuciones NO son datos puros: cada una trae funciones vivas
 * (`f`, `domain`, `mean`, `varc`) cerradas sobre la numérica `M`. Eso no
 * sobrevive a JSON, así que se emiten dos archivos:
 *
 *   data/study-data.json  la mitad serializable (`manifest.data`; el runtime
 *                         la deja en `App.STUDY`);
 *   data/study-data.js    el PRIMER script del manifiesto: publica el global
 *                         `window.STUDY` que asumía el baseline y vuelve a
 *                         enganchar las funciones en su lugar, con el código
 *                         copiado literalmente del original.
 *
 * Del objeto solo se conservan las claves que consumen las vistas del bundle:
 * DISTS (explorador y calculadoras), DIST_WIZARD y TEST_WIZARD (asistente) y
 * CHEATSHEETS. FLASHCARDS, QUIZ, ROADMAP y KITS ya viven en `estudio/` como
 * material de estudio de la plataforma.
 *
 * Es un script de un solo uso: se corre a mano cuando cambia el baseline.
 *
 *   node scripts/extract-study-data.mjs [ruta/al/study-data.js]
 *
 * Sin argumento usa `~/Desktop/ITBA/26-1C/Proba_Obsidian/estudio/study-data.js`.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BUNDLE = path.resolve(HERE, "..");
const DEFAULT_SRC = path.join(os.homedir(), "Desktop/ITBA/26-1C/Proba_Obsidian/estudio/study-data.js");
const KEEP = ["DISTS", "DIST_WIZARD", "TEST_WIZARD", "CHEATSHEETS"];

const src = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_SRC;
if (!fs.existsSync(src)) {
  console.error(`No se encuentra el origen: ${src}`);
  process.exit(1);
}

const code = fs.readFileSync(src, "utf8");
const sandbox = { window: {}, console, Math, JSON, Object, Array, String, Number, Boolean, Date, isFinite, isNaN, parseFloat, parseInt };
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(code, sandbox, { filename: path.basename(src), timeout: 20000 });

const STUDY = sandbox.window.STUDY;
if (!STUDY || typeof STUDY !== "object") {
  console.error("El archivo no dejó `window.STUDY`.");
  process.exit(1);
}
const missing = KEEP.filter((k) => STUDY[k] === undefined);
if (missing.length) {
  console.error(`Faltan claves en window.STUDY: ${missing.join(", ")}`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Separar datos serializables de funciones vivas
// ---------------------------------------------------------------------------

/** `["DISTS", 3, "domain"]` → `["DISTS"][3]["domain"]`, para el archivo generado. */
const pathExpr = (p) => p.map((k) => (typeof k === "number" ? `[${k}]` : `[${JSON.stringify(k)}]`)).join("");

/**
 * Una función se re-emite como EXPRESIÓN. `Function.prototype.toString`
 * devuelve el texto original, que puede ser `p => …`, `function (p) {…}` o la
 * forma abreviada de método `domain() {…}`; a esta última hay que anteponerle
 * `function ` para que sea una expresión válida.
 */
function asExpression(fn) {
  const s = String(fn).trim();
  if (/^(function\b|async\s|\(|[A-Za-z_$][\w$]*\s*=>)/.test(s)) return s;
  if (/^[A-Za-z_$][\w$]*\s*\(/.test(s)) return "function " + s;
  return s;
}

const fns = [];
function split(value, at) {
  if (typeof value === "function") { fns.push({ path: at, src: asExpression(value) }); return undefined; }
  if (Array.isArray(value)) {
    const out = value.map((v, i) => split(v, at.concat(i)));
    return out;
  }
  if (value && typeof value === "object") {
    const out = {};
    for (const k of Object.keys(value)) {
      const v = split(value[k], at.concat(k));
      if (v !== undefined) out[k] = v;
    }
    return out;
  }
  if (typeof value === "undefined") return undefined;
  return value;
}

const data = {};
for (const k of KEEP) data[k] = split(STUDY[k], [k]);

// ---------------------------------------------------------------------------
// Escribir las dos mitades
// ---------------------------------------------------------------------------

const dest = path.join(BUNDLE, "data");
fs.mkdirSync(dest, { recursive: true });
fs.writeFileSync(path.join(dest, "study-data.json"), JSON.stringify(data, null, 2) + "\n", "utf8");

const entries = fns.map((f) => `  [${JSON.stringify(f.path)}, ${f.src}]`).join(",\n");
const js = `/* ============================================================
   data/study-data.js — GENERADO por \`scripts/extract-study-data.mjs\`.
   No editar a mano: se regenera desde \`estudio/study-data.js\` del
   baseline de Proba.

   Hace dos cosas, en este orden:

   1. Publica \`window.STUDY\`. El runtime deja el JSON declarado en
      \`manifest.data\` en \`App.STUDY\`; el baseline lo leía del global.

   2. Vuelve a enganchar las ${fns.length} funciones que JSON no puede llevar
      (\`DISTS[i].f\`, \`.domain\`, \`.mean\`, \`.varc\`: cierran sobre la
      numérica \`M\` del runtime). El cuerpo de cada una es copia literal
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
      console.warn("[proba-tools] No llegó \`data/study-data.json\`: el explorador, " +
        "las calculadoras y el asistente van a quedar sin distribuciones.");
    }
    window.STUDY = data || {};
    return;
  }

  // [ruta, función] — la ruta es relativa a la raíz de STUDY.
  var FNS = [
${entries}
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
      "encontraron su lugar: \`data/study-data.json\` y \`data/study-data.js\` están " +
      "desincronizados (regenerá con scripts/extract-study-data.mjs).");
  }

  window.STUDY = data;
  if (A) A.STUDY = data;
})();
`;
fs.writeFileSync(path.join(dest, "study-data.js"), js, "utf8");

// ---------------------------------------------------------------------------

const kb = (p) => (fs.statSync(p).size / 1024).toFixed(1) + " kB";
console.log(`data/study-data.json  ${kb(path.join(dest, "study-data.json"))}`);
console.log(`data/study-data.js    ${kb(path.join(dest, "study-data.js"))}  — ${fns.length} funciones re-enganchadas`);
console.log(`  claves: ${KEEP.map((k) => `${k} (${Array.isArray(data[k]) ? data[k].length + " ítems" : "objeto"})`).join(" · ")}`);
console.log(`  descartadas: ${Object.keys(STUDY).filter((k) => !KEEP.includes(k)).join(", ")}`);
const byKey = {};
for (const f of fns) byKey[f.path[f.path.length - 1]] = (byKey[f.path[f.path.length - 1]] || 0) + 1;
console.log(`  funciones por campo: ${Object.entries(byKey).map(([k, n]) => `${k} ×${n}`).join(" · ")}`);
