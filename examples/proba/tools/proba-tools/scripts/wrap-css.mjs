#!/usr/bin/env node
/**
 * wrap-css.mjs — genera `css/*.css` del bundle a partir del CSS del baseline.
 *
 * Todo lo que el bundle inyecta queda ACOTADO al contenedor de la vista con
 * anidamiento CSS nativo:
 *
 *     .sinapsis-tool {
 *       & .card { … }
 *       [data-theme="claustro"] & .card { … }
 *     }
 *
 * Cada selector se reescribe con `&` explícito: los que empiezan por un
 * ancestro de tema (`[data-theme=…]`, `html`, `body`) llevan el `&` DESPUÉS
 * del ancestro (el tema se declara en la raíz del documento, por encima del
 * contenedor); el resto lo lleva delante.
 *
 * Además de envolver:
 *  - `vocab.css` toma solo el vocabulario de clases de `styles.css` (sin
 *    tokens `:root`, sin bloques de tema, sin `@font-face`, sin `html`/`body`)
 *    y le antepone un preámbulo escrito a mano que reemplaza lo que aportaba
 *    la regla `body` del baseline (tipografía base y `box-sizing`).
 *  - `tools.css`, `taller.css`, `lab.css` y `lookup.css` se envuelven enteros.
 *
 *   node scripts/wrap-css.mjs [carpeta-del-baseline]
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BUNDLE = path.resolve(HERE, "..");
const SRC = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(os.homedir(), "Desktop/ITBA/26-1C/Proba_Obsidian/estudio");

// ---------------------------------------------------------------------------
// Parser de primer nivel (comentarios, at-rules y reglas), sin dependencias.
// ---------------------------------------------------------------------------

function topLevel(css) {
  const out = [];
  let i = 0;
  const n = css.length;
  while (i < n) {
    if (/\s/.test(css[i])) { i++; continue; }
    if (css.startsWith("/*", i)) {
      const e = css.indexOf("*/", i + 2);
      const end = e === -1 ? n : e + 2;
      out.push({ kind: "comment", text: css.slice(i, end) });
      i = end;
      continue;
    }
    let j = i;
    while (j < n) {
      const c = css[j];
      if (c === "/" && css[j + 1] === "*") { const e = css.indexOf("*/", j + 2); j = e === -1 ? n : e + 2; continue; }
      if (c === '"' || c === "'") { const q = c; j++; while (j < n && css[j] !== q) { if (css[j] === "\\") j++; j++; } j++; continue; }
      if (c === "{" || c === ";") break;
      j++;
    }
    const prelude = css.slice(i, j).trim();
    if (j >= n) { if (prelude) out.push({ kind: "raw", text: prelude }); break; }
    if (css[j] === ";") { out.push({ kind: "statement", prelude, text: css.slice(i, j + 1) }); i = j + 1; continue; }
    let k = j, d = 0;
    while (k < n) {
      const c = css[k];
      if (c === "/" && css[k + 1] === "*") { const e = css.indexOf("*/", k + 2); k = e === -1 ? n : e + 2; continue; }
      if (c === '"' || c === "'") { const q = c; k++; while (k < n && css[k] !== q) { if (css[k] === "\\") k++; k++; } k++; continue; }
      if (c === "{") d++;
      else if (c === "}") { d--; if (d === 0) { k++; break; } }
      k++;
    }
    out.push({ kind: prelude.startsWith("@") ? "atrule" : "rule", prelude, body: css.slice(j + 1, k - 1) });
    i = k;
  }
  return out;
}

/** Corta una lista de selectores por comas de primer nivel. */
function splitSelectors(prelude) {
  const out = [];
  let depth = 0, cur = "";
  for (let i = 0; i < prelude.length; i++) {
    const c = prelude[i];
    if (c === "(" || c === "[") depth++;
    else if (c === ")" || c === "]") depth--;
    else if (c === "," && depth === 0) { out.push(cur.trim()); cur = ""; continue; }
    cur += c;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

const classesOf = (sel) => (sel.match(/\.(-?[_a-zA-Z][\w-]*)/g) || []).map((c) => c.slice(1));

/** Reescribe un selector para vivir dentro de `.sinapsis-tool { … }`. */
const THEME_ANCESTOR = /^((?:\[data-theme[^\]]*\]|html|body)(?:[.:#][^\s>+~]*)*(?:\([^)]*\))?)\s+(.+)$/;
function nest(sel) {
  const m = sel.match(THEME_ANCESTOR);
  if (m) return `${m[1]} & ${m[2]}`;
  return `& ${sel}`;
}

/**
 * Clase «raíz» de un selector: la del primer compuesto, ya descontado un
 * ancestro de tema. Es lo que decide si el selector pertenece al vocabulario
 * (`.doc h1` sí; `.dash-hero h1` no) en las secciones mixtas.
 */
function rootClasses(sel) {
  const m = sel.match(THEME_ANCESTOR);
  const rest = m ? m[2] : sel;
  const first = rest.split(/[\s>+~]+/)[0] || "";
  return classesOf(first);
}

function reindent(text, pad) {
  const lines = text.replace(/^\n+|\s+$/g, "").split("\n");
  const base = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length));
  return lines.map((l) => (l.trim() ? pad + l.slice(Number.isFinite(base) ? base : 0) : "")).join("\n");
}

/** Serializa nodos ya filtrados, con los selectores reescritos. */
function emit(nodes, pad = "  ") {
  const out = [];
  for (const nd of nodes) {
    if (nd.kind === "comment") { out.push(reindent(nd.text, pad)); continue; }
    if (nd.kind === "atrule") {
      out.push(`${pad}${nd.prelude} {`);
      out.push(emit(nd.children, pad + "  "));
      out.push(`${pad}}`);
      continue;
    }
    const sels = nd.selectors.map(nest).join(",\n" + pad);
    const body = reindent(nd.body, pad + "  ");
    out.push(`${pad}${sels} {\n${body}\n${pad}}`);
  }
  return out.join("\n");
}

// ---------------------------------------------------------------------------
// vocab.css — selección del vocabulario de `styles.css`
// ---------------------------------------------------------------------------

/** Secciones de `styles.css` que aportan vocabulario completo. */
const KEEP_WHOLE = new Set([
  "TINTA DE UNIDAD",
  "TIPOGRAFÍA DE SECCIÓN",
  "COMPONENTES",
  "DOC",
  "PLOTS / EXPLORADOR / CALCULADORAS",
  "EJERCICIOS / WIZARD",
]);
/** Secciones mixtas: se filtran selector por selector contra el vocabulario. */
const KEEP_MIXED = new Set(["HEADER", "READER", "MOBILE", "PRESTIGIO", "PRINT"]);
/** Secciones que son chrome de la plataforma y no entran nunca. */
// (todas las demás: THEME · *, LAYOUT, FLASHCARDS, QUIZ, GRAFO, PALETA, DASH HERO)

/** Reglas globales de `styles.css` que reemplaza el preámbulo escrito a mano. */
const DROP_PRELUDE = new Set([
  "*, *::before, *::after",
  ':root, [data-theme="pergamino"], [data-theme="light"], [data-theme="laurel"]',
  '[data-theme="claustro"], [data-theme="dark"]',
  "html",
  "body",
  "body::before",
  ":root",
]);

/** Clases de chrome que se rescatan igual porque las vistas las usan. */
const RESCUE = new Set(["kbd", "kbd-hint", "icon-btn", "rail-title"]);

function sectionName(commentText) {
  const m = commentText.match(/^\/\*\s*=+\s*\n\s*([^\n]+)/);
  if (!m || !commentText.includes("====")) return null;
  return m[1].trim().split(/\s+[—·(]/)[0].trim();
}

const stylesCss = fs.readFileSync(path.join(SRC, "styles.css"), "utf8");
const nodes = topLevel(stylesCss);

// Paso 1: repartir nodos por sección.
const bySection = [];
let cur = { name: "(inicio)", nodes: [] };
for (const nd of nodes) {
  if (nd.kind === "comment") {
    const name = sectionName(nd.text);
    if (name) { bySection.push(cur); cur = { name, nodes: [] }; continue; }
  }
  cur.nodes.push(nd);
}
bySection.push(cur);

// Paso 2: vocabulario = clases declaradas en las secciones completas + rescates.
const VOCAB = new Set(RESCUE);
for (const sec of bySection) {
  if (!KEEP_WHOLE.has(sec.name)) continue;
  const walk = (list) => {
    for (const nd of list) {
      if (nd.kind === "rule") classesOf(nd.prelude).forEach((c) => VOCAB.add(c));
      else if (nd.kind === "atrule" && nd.body) walk(topLevel(nd.body));
    }
  };
  walk(sec.nodes);
}
// Las clases propias de las herramientas también son vocabulario (las secciones
// mixtas pueden refinarlas: p. ej. `.tool-layout` en MOBILE).
for (const f of ["tools.css", "taller.css", "lab.css", "lookup.css"]) {
  const walk = (list) => {
    for (const nd of list) {
      if (nd.kind === "rule") classesOf(nd.prelude).forEach((c) => VOCAB.add(c));
      else if (nd.kind === "atrule" && nd.body) walk(topLevel(nd.body));
    }
  };
  walk(topLevel(fs.readFileSync(path.join(SRC, f), "utf8")));
}

// Paso 3: filtrar.
const dropped = [];
function filterNodes(list, mixed) {
  // Paso A: decidir nodo por nodo (los comentarios quedan pendientes).
  const decided = list.map((nd) => {
    if (nd.kind === "comment") return { keep: null, nd };
    if (nd.kind === "statement" || nd.kind === "raw") return { keep: false, nd };
    if (nd.kind === "atrule") {
      if (/^@(font-face|import|charset)/i.test(nd.prelude)) { dropped.push(nd.prelude); return { keep: false, nd }; }
      const children = filterNodes(topLevel(nd.body), mixed);
      if (!children.length) { dropped.push(nd.prelude + " (vacía)"); return { keep: false, nd }; }
      return { keep: true, out: { kind: "atrule", prelude: nd.prelude, children } };
    }
    if (DROP_PRELUDE.has(nd.prelude.replace(/\s+/g, " ").trim())) { dropped.push(nd.prelude); return { keep: false, nd }; }
    let sels = splitSelectors(nd.prelude);
    // En las secciones mixtas manda la PRIMERA clase del primer compuesto:
    // `.doc h1` entra, `.dash-hero h1` no; `.chip-btn.on` entra, `.theme-pop.show` no.
    if (mixed) sels = sels.filter((s) => VOCAB.has(rootClasses(s)[0]));
    if (!sels.length) { dropped.push(nd.prelude.replace(/\s+/g, " ")); return { keep: false, nd }; }
    if (sels.length !== splitSelectors(nd.prelude).length) {
      dropped.push(...splitSelectors(nd.prelude).filter((s) => !sels.includes(s)));
    }
    return { keep: true, out: { kind: "rule", selectors: sels, body: nd.body } };
  });

  // Paso B: un comentario solo sobrevive si sobrevive la regla que documenta
  // (la siguiente regla del original). Así no quedan comentarios huérfanos.
  const out = [];
  for (let i = 0; i < decided.length; i++) {
    const d = decided[i];
    if (d.keep === null) {
      let j = i + 1;
      while (j < decided.length && decided[j].keep === null) j++;
      if (j < decided.length && decided[j].keep) out.push({ kind: "comment", text: d.nd.text });
      continue;
    }
    if (d.keep) out.push(d.out);
  }
  return out;
}

const vocabParts = [];
for (const sec of bySection) {
  const whole = KEEP_WHOLE.has(sec.name);
  const mixed = KEEP_MIXED.has(sec.name);
  if (!whole && !mixed) continue;
  const kept = filterNodes(sec.nodes, mixed);
  if (!kept.length) continue;
  vocabParts.push(`\n  /* ${"=".repeat(56)}\n     ${sec.name}\n     ${"=".repeat(56)} */\n` + emit(kept));
}

// Paso 4: dos piezas que las vistas del bundle usan pero que no viven en
// `styles.css`: la cabecera de unidad (`.unit-hero`, en `reader.css`) que
// abren el taller y el laboratorio, y la rejilla de tarjetas del hub del
// taller (`.kit-*` / `.rm-hero*` / `.rm-foot`, en `roadmap.css`).
const EXTRA = {
  "reader.css": ["unit-hero", "unit-hero-row", "unit-hero-prog"],
  "roadmap.css": ["rm-hero", "rm-hero-main", "rm-hero-ring", "rm-hero-stat", "rm-foot", "kit-grid", "kit-card", "kit-card-top", "kit-ic"],
};
for (const [file, roots] of Object.entries(EXTRA)) {
  const allow = new Set(roots);
  const pick = (list) => {
    const out = [];
    for (const nd of list) {
      if (nd.kind === "atrule") {
        const children = pick(topLevel(nd.body));
        if (children.length) out.push({ kind: "atrule", prelude: nd.prelude, children });
        continue;
      }
      if (nd.kind !== "rule") continue;
      const sels = splitSelectors(nd.prelude).filter((s) => allow.has(rootClasses(s)[0]));
      if (sels.length) out.push({ kind: "rule", selectors: sels, body: nd.body });
    }
    return out;
  };
  const kept = pick(topLevel(fs.readFileSync(path.join(SRC, file), "utf8")));
  if (!kept.length) throw new Error(`${file}: no se rescató ninguna regla (¿cambiaron los nombres?)`);
  vocabParts.push(`\n  /* ${"=".repeat(56)}\n     RESCATADO DE ${file} — ${roots.map((r) => "." + r).join(" · ")}\n     ${"=".repeat(56)} */\n` + emit(kept));
}

const PREAMBLE = `/* ============================================================
   vocab.css — vocabulario de clases del baseline de Proba
   (\`estudio/styles.css\`), acotado al contenedor de la vista.

   GENERADO por \`scripts/wrap-css.mjs\`. No editar a mano.

   Qué NO entra: los tokens \`:root\`, los tres bloques de tema
   (pergamino · laurel · claustro), \`@font-face\`, \`html\`/\`body\` y el
   chrome de la app original (header, sidebar, lector, paleta, grafo,
   flashcards, quiz, selector de tema). Los tokens y las fuentes los
   aporta la plataforma; los colores viajan como \`var(--token)\`.

   El preámbulo de abajo reemplaza lo que la regla \`body\` del baseline
   le daba a estas clases (tipografía base y \`box-sizing\`), ahora
   acotado al contenedor.
   ============================================================ */

.sinapsis-tool,
.sinapsis-tool *,
.sinapsis-tool *::before,
.sinapsis-tool *::after { box-sizing: border-box; }

.sinapsis-tool {
  color: var(--text);
  font-family: var(--font-ui);
  font-weight: 500;
  font-size: 14.75px;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
`;

const vocab = PREAMBLE + vocabParts.join("\n") + "\n}\n";
fs.writeFileSync(path.join(BUNDLE, "css", "vocab.css"), vocab, "utf8");

// ---------------------------------------------------------------------------
// tools.css · taller.css · lab.css · lookup.css — envueltos enteros
// ---------------------------------------------------------------------------

/**
 * Parches al CSS del baseline antes de envolverlo. Solo lo que apunta a nodos
 * de la app original que en la plataforma no existen dentro del contenedor.
 */
const PATCHES = {
  "lookup.css": [
    {
      // `#main` es el <main> de la app original: queda fuera del contenedor de
      // la vista, así que la regla no puede vivir dentro del envoltorio. El
      // hueco para el FAB lo reserva el host de la plataforma.
      find: "  #main { padding-bottom: 72px; }",
      replace: "  /* [bundle] `#main { padding-bottom: 72px }` del baseline: fuera del\n     contenedor de la vista. El hueco bajo el FAB lo reserva el host. */",
    },
  ],
};

const HEAD = (name) => `/* ============================================================
   ${name} — copia envuelta de \`estudio/${name}\` del baseline de Proba.
   GENERADO por \`scripts/wrap-css.mjs\`. No editar a mano.
   Todo queda acotado al contenedor \`.sinapsis-tool\` de la vista.
   ============================================================ */

.sinapsis-tool {
`;

for (const name of ["tools.css", "taller.css", "lab.css", "lookup.css"]) {
  let css = fs.readFileSync(path.join(SRC, name), "utf8");
  for (const p of PATCHES[name] || []) {
    if (!css.includes(p.find)) throw new Error(`${name}: no se encontró el parche ${JSON.stringify(p.find)}`);
    css = css.replace(p.find, p.replace);
  }
  const kept = filterNodes(topLevel(css), false);
  fs.writeFileSync(path.join(BUNDLE, "css", name), HEAD(name) + emit(kept) + "\n}\n", "utf8");
}

// ---------------------------------------------------------------------------

const files = ["vocab.css", "tools.css", "taller.css", "lab.css", "lookup.css"];
for (const f of files) {
  const p = path.join(BUNDLE, "css", f);
  console.log(`css/${f.padEnd(12)} ${(fs.statSync(p).size / 1024).toFixed(1)} kB`);
}
console.log(`\nvocabulario reconocido: ${VOCAB.size} clases`);
console.log(`reglas descartadas de styles.css: ${dropped.length}`);
