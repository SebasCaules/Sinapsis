#!/usr/bin/env node
/**
 * smoke.mjs — verificación del bundle SIN el runtime de la plataforma.
 *
 * Monta un DOM de jsdom, instala un STUB de `window.App` con los miembros que
 * declara `CompatApp` (`packages/contract/src/runtime.ts`) —cada uno una
 * función que registra su llamada—, corre los scripts del manifiesto en orden
 * (con `vm.runInContext` sobre el contexto de la ventana) y comprueba:
 *
 *   1. que se registran las cinco vistas del manifiesto (`registerView`);
 *   2. que se registran al menos 90 figuras (`registerFigure`);
 *   3. qué miembros de `App` / `M` / `Fig` / `Plot` usa cada script — con la
 *      marca ✗ para los que NO están en `CompatApp`, que es lo que R4 tiene
 *      que agregar al runtime.
 *
 * Además intenta renderizar cada vista contra el stub y reporta hasta dónde
 * llega; un fallo ahí NO rompe el smoke: el stub no tiene ni matemática ni
 * dibujo de verdad.
 *
 *   node scripts/smoke.mjs [--json]
 *
 * Salida legible en stdout; código 1 si falla alguna de las dos primeras
 * comprobaciones.
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BUNDLE = path.resolve(HERE, "..");
const REPO = path.resolve(BUNDLE, "../../../..");
const JSON_OUT = process.argv.includes("--json");

// ---------------------------------------------------------------------------
// jsdom: instalado en el workspace (devDependency de @sinapsis/runtime)
// ---------------------------------------------------------------------------

async function loadJsdom() {
  try { return await import("jsdom"); } catch { /* sigue */ }
  const roots = [
    path.join(REPO, "packages/runtime/package.json"),
    path.join(REPO, "apps/web/package.json"),
    path.join(REPO, "package.json"),
  ];
  for (const r of roots) {
    if (!fs.existsSync(r)) continue;
    try { return await import(createRequire(r).resolve("jsdom")); } catch { /* sigue */ }
  }
  const store = path.join(REPO, "node_modules/.pnpm");
  if (fs.existsSync(store)) {
    const hit = fs.readdirSync(store).find((d) => d.startsWith("jsdom@"));
    if (hit) {
      const p = path.join(store, hit, "node_modules/jsdom/lib/api.js");
      if (fs.existsSync(p)) return await import(p);
    }
  }
  throw new Error("No se encontró jsdom. Corré `pnpm install` en la raíz del repo.");
}

// ---------------------------------------------------------------------------
// Superficie declarada por el contrato: se lee de runtime.ts para no duplicarla
// ---------------------------------------------------------------------------

function interfaceMembers(name) {
  const src = fs.readFileSync(path.join(REPO, "packages/contract/src/runtime.ts"), "utf8");
  const start = src.indexOf("interface " + name);
  if (start === -1) return new Set();
  let i = src.indexOf("{", start), depth = 0, end = i;
  for (; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}") { depth--; if (!depth) { end = i; break; } }
  }
  const body = src.slice(src.indexOf("{", start) + 1, end);
  const names = new Set();
  for (const m of body.matchAll(/^\s{2}([A-Za-z_$][\w$]*)\??[(:<]/gm)) names.add(m[1]);
  return names;
}

// ---------------------------------------------------------------------------
// Escaneo estático: qué miembros pide cada archivo (el uso real es en render)
// ---------------------------------------------------------------------------

/** Miembros de Array/Object/String/Function: nunca son del contrato. */
const BUILTIN = new Set([
  "length", "push", "pop", "shift", "unshift", "splice", "slice", "concat", "join", "map",
  "filter", "reduce", "forEach", "some", "every", "find", "findIndex", "indexOf", "lastIndexOf",
  "includes", "sort", "reverse", "flat", "fill", "keys", "values", "entries", "toString",
  "valueOf", "hasOwnProperty", "constructor", "prototype", "call", "apply", "bind", "name",
  "charAt", "charCodeAt", "replace", "split", "trim", "toFixed", "toLowerCase", "toUpperCase",
  "test", "match", "padStart", "padEnd", "repeat", "startsWith", "endsWith", "substring",
]);

/**
 * Qué miembros pide un archivo, por objeto del contrato. Los alias locales
 * (`M`, `F`, `P`) solo se cuentan en los archivos donde están LIGADOS al
 * objeto correspondiente: en el baseline `P` también es una matriz de
 * transición y `F` un acumulador, y contarlos siempre ensucia el inventario.
 */
function scanMembers(code) {
  const found = { App: new Set(), M: new Set(), Fig: new Set(), Plot: new Set(), FigureContext: new Set() };
  // Fuera comentarios: los encabezados del baseline nombran miembros que no usa.
  const clean = code.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/^[^\n"'`]*?\/\/.*$/gm, " ");

  const aliases = { App: new Set(["A", "App"]), FigureContext: new Set(["api"]), M: new Set(["M"]), Fig: new Set(["Fig"]), Plot: new Set(["Plot"]) };
  const bind = (re, target) => {
    for (const m of clean.matchAll(re)) aliases[target].add(m[1]);
  };
  bind(/([A-Za-z_$][\w$]*)\s*=\s*(?:window\.)?(?:A|App)\.Plot\b/g, "Plot");
  bind(/([A-Za-z_$][\w$]*)\s*=\s*(?:window\.)?(?:api|A|App)\.Fig\b/g, "Fig");
  bind(/([A-Za-z_$][\w$]*)\s*=\s*(?:window\.M\b|(?:A|App)\.M\b)/g, "M");

  for (const [target, names] of Object.entries(aliases)) {
    for (const alias of names) {
      const re = new RegExp("(?<![\\w$.])" + alias.replace(/\$/g, "\\$") + "\\.([A-Za-z_$][\\w$]*)", "g");
      for (const m of clean.matchAll(re)) if (!BUILTIN.has(m[1])) found[target].add(m[1]);
    }
  }
  return found;
}

/**
 * Nombres que ya expone un módulo portado del runtime
 * (`packages/runtime/src/{math,figures,plot}.ts`). Es un cotejo ORIENTATIVO,
 * por nombre: junta las claves de los literales de objeto (`svg: svgOf`), los
 * miembros de interfaz (`normCDF(...)`) y las funciones declaradas. Sirve para
 * ver de un vistazo si algo que el bundle pide no está portado todavía; no
 * reemplaza mirar el archivo.
 */
function portedNames(file) {
  const p = path.join(REPO, "packages/runtime/src", file);
  if (!fs.existsSync(p)) return null;
  const src = fs.readFileSync(p, "utf8").replace(/\/\*[\s\S]*?\*\//g, " ").replace(/^[^\n"'`]*?\/\/.*$/gm, " ");
  const names = new Set();
  for (const m of src.matchAll(/(?:^|[{,])\s*([A-Za-z_$][\w$]*)\s*:/gm)) names.add(m[1]);
  for (const m of src.matchAll(/\bfunction\s+([A-Za-z_$][\w$]*)/g)) names.add(m[1]);
  for (const m of src.matchAll(/^\s{2}([A-Za-z_$][\w$]*)\s*[(<]/gm)) names.add(m[1]);
  return names;
}

// ---------------------------------------------------------------------------

const manifest = JSON.parse(fs.readFileSync(path.join(BUNDLE, "sinapsis.tools.json"), "utf8"));
const study = JSON.parse(fs.readFileSync(path.join(BUNDLE, manifest.data[0]), "utf8"));
const COMPAT = interfaceMembers("CompatApp");
const FIGCTX = interfaceMembers("FigureContext");

const { JSDOM } = await loadJsdom();
const dom = new JSDOM('<!doctype html><html><body><main id="main"></main></body></html>', {
  url: "https://sinapsis.test/m/proba/t/explorador",
  runScripts: "outside-only",
  pretendToBeVisual: true,
});
const win = dom.window;
const ctx = dom.getInternalVMContext();

// --- registro de llamadas -------------------------------------------------
const calls = new Map();   // "App.icon" → nº de llamadas
const reads = new Map();   // "App.Fig"  → nº de lecturas
const writes = new Set();  // "App._lab"
let currentFile = "(arranque)";
const byFile = new Map();  // archivo → Set("App.icon")

function note(map, key) {
  map.set(key, (map.get(key) || 0) + 1);
  if (!byFile.has(currentFile)) byFile.set(currentFile, new Set());
  byFile.get(currentFile).add(key);
}

const views = new Map();
const figures = new Map();
const actions = new Map();

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** `App.katex` con las DOS formas: el baseline la llama como función. */
function katexFn(tex, display) { return `<span class="katex${display ? " katex-display" : ""}">${esc(tex)}</span>`; }
katexFn.renderToString = (tex, opts) => katexFn(tex, !!(opts && opts.displayMode));

const appImpl = {
  registerView: (id, fn) => { views.set(id, fn); },
  registerAction: (name, fn) => { actions.set(name, fn); },
  registerFigure: (id, draw, meta) => { figures.set(id, { draw, meta: meta || {} }); },
  mountFigures: () => 0,
  unmountFigures: () => 0,
  setRedraw: () => {},
  FIGURES: {},

  SUBJECT: { slug: "proba", config: { slug: "proba", divisions: [], pageTypes: [] } },
  PAGES: [], CONTENT: [], BY_SLUG: {}, UNITS: [], TYPES: [],
  unitShort: (k) => "U" + k,
  unitMeta: (k) => ({ key: k, name: "Unidad " + k, color: "var(--u1)" }),
  isStudied: () => false,
  STUDY: study,
  DATA: { "study-data.json": study },

  go: () => {},
  setCrumbs: () => {},
  render: () => {},
  toast: () => {},

  escapeHtml: esc,
  icon: (name, size) => `<svg data-icon="${esc(name)}" width="${size || 16}"></svg>`,
  katex: katexFn,
  KATEX_MACROS: {},
  renderMarkdown: (md) => `<div class="doc">${esc(md)}</div>`,
  renderMathHtml: (html) => html,
  rich: (t) => esc(t),
  enhanceDoc: () => {},
  emptyState: (t, s) => `<div class="empty"><div class="empty-t">${esc(t)}</div><div class="empty-s">${esc(s || "")}</div></div>`,
  backBar: (href, label) => `<a class="back-bar" href="${esc(href)}" data-nav>${esc(label)}</a>`,
  fmt: (n, d) => (n == null || !isFinite(n) ? "—" : String(Number(n).toFixed(d == null ? 2 : d))),
  cssVar: () => "#7c2230",
  withAlpha: (c) => c,
};
// A propósito el stub NO trae `$` ni `$$`: no están en CompatApp y así se
// ejercitan los reemplazos locales que dejó la adaptación en cada script.

/** Objeto abierto (`M`, `Fig`, `Plot`) que registra cada miembro pedido. */
function openRecorder(label, fallback) {
  return new Proxy({}, {
    get(_t, prop) {
      if (typeof prop !== "string") return undefined;
      note(reads, `${label}.${prop}`);
      return (...args) => { note(calls, `${label}.${prop}`); return fallback(prop, args); };
    },
    has: () => true,
  });
}
/** Escala lineal con la misma superficie que `Plot.scales` / `Fig.scale`. */
function stubScale(dom, ran) {
  const [d0, d1] = dom && dom.length ? dom : [0, 1];
  const [r0, r1] = ran && ran.length ? ran : [0, 100];
  const s = (v) => r0 + ((v - d0) / ((d1 - d0) || 1)) * (r1 - r0);
  s.invert = (px) => d0 + ((px - r0) / ((r1 - r0) || 1)) * (d1 - d0);
  s.domain = () => [d0, d1];
  s.range = () => [r0, r1];
  s.log = false;
  return s;
}

const M = openRecorder("M", () => 0.5);
const Fig = openRecorder("Fig", (prop, args) => {
  if (prop === "svg" || prop === "el" || prop === "div") return win.document.createElement("div");
  if (prop === "scale") return stubScale(args[0], args[1]);
  if (prop === "ticks") return [0, 0.5, 1];
  if (prop === "rng") return () => Math.random();
  if (prop === "color" || prop === "series" || prop === "mix" || prop === "seq" || prop === "status") return "#7c2230";
  if (prop === "fmt") return "0";
  return {};
});
const Plot = openRecorder("Plot", (prop, args) => {
  if (prop === "scales") return stubScale(args[0], args[1]);
  if (prop === "ticks" || prop === "logTicks") return [0, 0.5, 1];
  if (prop === "cssVar" || prop === "series" || prop === "alpha" || prop === "tokenAlpha") return "#7c2230";
  if (prop === "setup") return { ctx: null, w: 600, h: 300, dpr: 1 };
  return {};
});
appImpl.M = M;
appImpl.Fig = Fig;
appImpl.Plot = Plot;

const App = new Proxy(appImpl, {
  get(t, prop) {
    if (typeof prop !== "string") return t[prop];
    note(reads, `App.${prop}`);
    const v = t[prop];
    if (typeof v === "function" && prop !== "katex") {
      return function (...args) { note(calls, `App.${prop}`); return v.apply(t, args); };
    }
    return v;
  },
  set(t, prop, v) {
    if (typeof prop === "string") writes.add(`App.${prop}`);
    t[prop] = v;
    return true;
  },
});

win.App = App;
win.M = M;

// --- correr los scripts en orden -----------------------------------------
const loadErrors = [];
for (const rel of manifest.scripts) {
  currentFile = rel;
  const code = fs.readFileSync(path.join(BUNDLE, rel), "utf8");
  try {
    vm.runInContext(code, ctx, { filename: rel, timeout: 30000 });
  } catch (e) {
    loadErrors.push({ file: rel, error: String((e && e.message) || e) });
  }
}
currentFile = "(post)";

// --- render de cada vista contra el stub ----------------------------------
const renders = [];
for (const v of manifest.views) {
  const fn = views.get(v.id);
  if (!fn) { renders.push({ view: v.id, ok: false, error: "no registrada" }); continue; }
  currentFile = `render:${v.id}`;
  const main = win.document.createElement("div");
  main.className = "sinapsis-tool";
  win.document.body.appendChild(main);
  try {
    fn(main);
    renders.push({ view: v.id, ok: true, html: main.innerHTML.length });
  } catch (e) {
    renders.push({ view: v.id, ok: false, error: String((e && e.message) || e).slice(0, 160) });
  }
}
currentFile = "(post)";

// --- escaneo estático por archivo ----------------------------------------
const staticScan = {};
for (const rel of manifest.scripts) {
  staticScan[rel] = scanMembers(fs.readFileSync(path.join(BUNDLE, rel), "utf8"));
}
const union = { App: new Set(), M: new Set(), Fig: new Set(), Plot: new Set(), FigureContext: new Set() };
for (const s of Object.values(staticScan)) for (const k of Object.keys(union)) s[k].forEach((x) => union[k].add(x));

// --- comprobaciones -------------------------------------------------------
const wantViews = manifest.views.map((v) => v.id);
const missingViews = wantViews.filter((id) => !views.has(id));
const extraViews = [...views.keys()].filter((id) => !wantViews.includes(id));
const okViews = missingViews.length === 0;
const okFigures = figures.size >= 90;
const ok = okViews && okFigures && loadErrors.length === 0;

const missingCompat = [...union.App].filter((m) => !COMPAT.has(m)).sort();
const missingFigCtx = [...union.FigureContext].filter((m) => !FIGCTX.has(m)).sort();

if (JSON_OUT) {
  console.log(JSON.stringify({
    ok, views: [...views.keys()], missingViews, extraViews, figures: figures.size,
    figureIds: [...figures.keys()],
    actions: [...actions.keys()], loadErrors, renders,
    missingCompat, missingFigCtx,
    required: Object.fromEntries(Object.entries(union).map(([k, v]) => [k, [...v].sort()])),
    calledAtLoad: Object.fromEntries([...byFile].map(([k, v]) => [k, [...v].sort()])),
  }, null, 2));
  process.exit(ok ? 0 : 1);
}

const L = (s = "") => console.log(s);
const mark = (b) => (b ? "OK   " : "FALLA");
const wrap = (items, pad) => {
  const out = [];
  let line = "";
  for (const it of items) {
    if (line.length + it.length + 1 > 92) { out.push(pad + line); line = ""; }
    line += (line ? " " : "") + it;
  }
  if (line) out.push(pad + line);
  return out.join("\n");
};

L("=".repeat(74));
L(`  smoke — bundle ${manifest.id} v${manifest.version}`);
L("=".repeat(74));
L();
L(`  ${mark(loadErrors.length === 0)} ${manifest.scripts.length} scripts cargados sin excepción`);
for (const e of loadErrors) L(`        x ${e.file}: ${e.error}`);
L(`  ${mark(okViews)} vistas registradas (${views.size}): ${[...views.keys()].join(", ")}`);
if (missingViews.length) L(`        faltan: ${missingViews.join(", ")}`);
if (extraViews.length) L(`        de más (no están en el manifiesto): ${extraViews.join(", ")}`);
L(`  ${mark(okFigures)} figuras registradas: ${figures.size} (mínimo 90)`);
L(`        acciones data-action registradas: ${actions.size}`);
L(wrap([...actions.keys()], "          "));
L();
L("  Render de cada vista contra el stub (informativo: el stub no tiene");
L("  matemática ni dibujo de verdad):");
for (const r of renders) L(`    ${r.ok ? "dibuja" : "corta "}  ${r.view.padEnd(12)} ${r.ok ? r.html + " bytes de HTML" : r.error}`);
L();
L("-".repeat(74));
L("  MIEMBROS DE `App` QUE USA EL BUNDLE   (x = no está en CompatApp)");
L("-".repeat(74));
for (const m of [...union.App].sort()) L(`    ${COMPAT.has(m) ? " " : "x"}  App.${m}`);
L();
L("-".repeat(74));
L("  MIEMBROS DEL 2º ARGUMENTO DE `registerFigure` (FigureContext)");
L("-".repeat(74));
for (const m of [...union.FigureContext].sort()) L(`    ${FIGCTX.has(m) ? " " : "x"}  ctx.${m}`);
L();
L("-".repeat(74));
L("  MOTOR PORTADO AL RUNTIME  (x = el nombre no aparece en packages/runtime/src)");
L("-".repeat(74));
for (const [label, key, file] of [["window.M", "M", "math.ts"], ["App.Fig", "Fig", "figures.ts"], ["App.Plot", "Plot", "plot.ts"]]) {
  const have = portedNames(file);
  const items = [...union[key]].sort();
  const gaps = have ? items.filter((m) => !have.has(m)) : null;
  L(`  ${label} — ${items.length} miembros requeridos  (cotejo contra ${file}${have ? "" : ": no existe todavía"})`);
  L(wrap(items.map((m) => (have && !have.has(m) ? "x" + m : m)), "    "));
  if (gaps && gaps.length) L(`    faltarían: ${gaps.join(" ")}`);
  L();
}
L("-".repeat(74));
L("  POR ARCHIVO  (escaneo estático)");
L("-".repeat(74));
for (const rel of manifest.scripts) {
  const s = staticScan[rel];
  const parts = [];
  for (const k of ["App", "FigureContext", "M", "Fig", "Plot"]) {
    if (s[k].size) parts.push([k, [...s[k]].sort()]);
  }
  if (!parts.length) continue;
  L(`  ${rel}`);
  for (const [k, items] of parts) {
    L(`      ${k}:`);
    L(wrap(items, "        "));
  }
}
L();
L("-".repeat(74));
L(`  Escrituras sobre App durante la carga: ${[...writes].sort().join(", ") || "(ninguna)"}`);
L(`  Faltan en CompatApp: ${missingCompat.length ? missingCompat.map((m) => "App." + m).join(", ") : "(nada)"}`);
L(`  Faltan en FigureContext: ${missingFigCtx.length ? missingFigCtx.map((m) => "ctx." + m).join(", ") : "(nada)"}`);
L("-".repeat(74));
L(`  RESULTADO: ${ok ? "OK" : "FALLA"}`);
L();

process.exit(ok ? 0 : 1);
