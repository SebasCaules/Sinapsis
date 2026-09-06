#!/usr/bin/env node
/**
 * extract-exam-data.mjs — banco de opción múltiple del simulador de parcial.
 *
 * El simulador arma su banco con `buildQuizPool()` (parcial.js), que necesita
 * dos claves del `study-data.js` del baseline:
 *
 *   QUIZ    las 15 preguntas declaradas;
 *   DISTS   las 14 distribuciones, de las que solo se leen `id`, `name`,
 *           `slug` y `tex.mean` / `tex.var` para generar las 28 preguntas de
 *           esperanza y varianza con distractores reales.
 *
 * Esas dos claves NO viajan en `App.STUDY`: ahí vive el `study-data.json` del
 * bundle `proba-tools`, cuyas `DISTS` llevan funciones vivas (`f`, `domain`,
 * `mean`, `varc`) que no se pueden pisar. Este bundle publica su propia copia
 * —solo datos, sin ninguna función— en el global `window.EXAMEN`.
 *
 * Es un script de un solo uso: se corre a mano cuando cambia el baseline.
 *
 *   node scripts/extract-exam-data.mjs [ruta/al/study-data.js]
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
if (!STUDY || !Array.isArray(STUDY.QUIZ) || !Array.isArray(STUDY.DISTS)) {
  console.error("El archivo no dejó `window.STUDY.QUIZ` / `window.STUDY.DISTS`.");
  process.exit(1);
}

/* Solo los cuatro campos que lee el generador: cualquier otro sería peso
   muerto, y `f`/`domain`/`mean`/`varc` son funciones que JSON pierde. */
const DISTS = STUDY.DISTS.map((d) => ({
  id: d.id,
  name: d.name,
  slug: d.slug,
  tex: { mean: d.tex && d.tex.mean, var: d.tex && d.tex.var },
}));
const faltan = DISTS.filter((d) => !d.id || !d.name || !d.tex.mean || !d.tex.var);
if (faltan.length) {
  console.error(`Distribuciones sin id/name/tex: ${faltan.map((d) => d.id || "?").join(", ")}`);
  process.exit(1);
}

const HEAD = `/* ============================================================
   data/exam-data.js — GENERADO por \`scripts/extract-exam-data.mjs\`.
   No editar a mano: se regenera desde \`estudio/study-data.js\` del
   baseline de Proba.

   Publica \`window.EXAMEN = { QUIZ, DISTS }\`, el banco de opción múltiple
   del simulador de parcial. Son datos puros: las funciones vivas de las
   distribuciones (\`f\`, \`domain\`, \`mean\`, \`varc\`) no entran porque el
   generador de preguntas solo lee \`id\`, \`name\`, \`slug\` y \`tex\`.

   Este archivo es el PRIMER script del manifiesto, antes que
   \`parcial.js\`.
   ============================================================ */
window.EXAMEN = `;

const out = HEAD + JSON.stringify({ QUIZ: STUDY.QUIZ, DISTS }, null, 1) + ";\n";
const dest = path.join(BUNDLE, "data", "exam-data.js");
fs.writeFileSync(dest, out, "utf8");
console.log(
  `data/exam-data.js  ${(fs.statSync(dest).size / 1024).toFixed(1)} kB · ` +
    `${STUDY.QUIZ.length} preguntas declaradas + ${DISTS.length * 2} generadas = ${STUDY.QUIZ.length + DISTS.length * 2}`,
);
