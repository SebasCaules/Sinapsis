#!/usr/bin/env node
/**
 * wrap-css.mjs — genera `css/*.css` del bundle a partir del CSS del baseline.
 *
 * Es el MISMO método que `proba-tools/scripts/wrap-css.mjs` (mismo parser,
 * mismo reescritor de selectores, mismo criterio de vocabulario), con dos
 * diferencias que pide este bundle:
 *
 *  1. **Las reglas de impresión salen del envoltorio.** `ejercicios.css` y
 *     `formularios.css` traen `@media print` con selectores que apuntan a
 *     `html` / `body` (`html:has(.ej-doc)`, `body:has(.ej-doc) .crumbs`): son
 *     ANCESTROS del contenedor de la vista, así que no pueden vivir dentro de
 *     `.sinapsis-tool { … }`. Los bloques `@media print` se emiten planos, al
 *     final del archivo, con el prefijo `.sinapsis-tool ` en los selectores que
 *     sí son de adentro y VERBATIM en los que empiezan por `html`/`body`.
 *     Sin esto, imprimir con un tema oscuro dejaba los márgenes de la hoja en
 *     negro y las migas del shell salían en el papel.
 *  2. **`parcial.css` es un recorte de `study.css`**: solo las reglas `exam-*`
 *     (el simulador) y las tres que refinan las opciones de opción múltiple.
 *     Flashcards y quiz no entran: ese material vive en la plataforma.
 *
 * `vocab.css` se genera igual que en `proba-tools` PERO con dos secciones más
 * de `styles.css` —`FLASHCARDS` (el anillo y la barra de progreso que reusa el
 * resultado del parcial) y `QUIZ` (`.quiz-opt`, `.quiz-q`, `.quiz-opts`, que el
 * simulador usa para sus ítems de opción múltiple)— y con `latex.css` entero,
 * que es la piel de documento que comparten las tres vistas.
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
// (idéntico al de `proba-tools/scripts/wrap-css.mjs`)
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

/** `@keyframes` que `emit` encontró: se escriben PLANOS, antes del envoltorio. */
let KEYFRAMES = [];
const takeKeyframes = () => {
  const out = KEYFRAMES;
  KEYFRAMES = [];
  return out.length ? out.join("\n") + "\n\n" : "";
};

/** Reescribe un selector para vivir dentro de `.sinapsis-tool { … }`. */
const THEME_ANCESTOR = /^((?:\[data-theme[^\]]*\]|html|body)(?:[.:#][^\s>+~]*)*(?:\([^)]*\))?)\s+(.+)$/;
function nest(sel) {
  const m = sel.match(THEME_ANCESTOR);
  if (m) return `${m[1]} & ${m[2]}`;
  return `& ${sel}`;
}

/** Clase «raíz» de un selector: la del primer compuesto, sin el ancestro de tema. */
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

/** Serializa nodos ya filtrados, con los selectores reescritos para el envoltorio. */
function emit(nodes, pad = "  ") {
  const out = [];
  for (const nd of nodes) {
    if (nd.kind === "comment") { out.push(reindent(nd.text, pad)); continue; }
    if (nd.kind === "atrule") {
      /* `@keyframes` no lleva selectores: sus tramos (`from`, `50%`) no se
         pueden anidar con `&`. Se emiten verbatim y se recogen aparte para
         sacarlos del envoltorio (dentro de `.sinapsis-tool { … }` el nombre de
         la animación sigue siendo global, pero el CSS anidado no es válido). */
      if (nd.raw) { KEYFRAMES.push(`${nd.prelude} {${nd.body}}`); continue; }
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
// Emisión PLANA (fuera del envoltorio) — para `@media print`
// ---------------------------------------------------------------------------

/**
 * Un selector de impresión que empieza por `html` / `body` / `:root` describe un
 * ANCESTRO del contenedor de la vista: se deja tal cual. Cualquier otro es de
 * adentro y se acota con el prefijo del contenedor.
 */
const OUTSIDE = /^(?:html|body|:root)\b/;
function flatSel(sel) {
  return OUTSIDE.test(sel.trim()) ? sel.trim() : `.sinapsis-tool ${sel.trim()}`;
}
function emitFlat(nodes, pad = "") {
  const out = [];
  for (const nd of nodes) {
    if (nd.kind === "comment") { out.push(reindent(nd.text, pad)); continue; }
    if (nd.kind === "atrule") {
      /* `@page` no lleva selectores: viaja verbatim. */
      if (/^@page\b/i.test(nd.prelude)) {
        out.push(`${pad}${nd.prelude} {${nd.body}}`);
        continue;
      }
      out.push(`${pad}${nd.prelude} {`);
      out.push(emitFlat(nd.children, pad + "  "));
      out.push(`${pad}}`);
      continue;
    }
    const sels = nd.selectors.map(flatSel).join(",\n" + pad);
    const body = reindent(nd.body, pad + "  ");
    out.push(`${pad}${sels} {\n${body}\n${pad}}`);
  }
  return out.join("\n");
}

/** Normaliza un nodo crudo a la forma que consumen `emit`/`emitFlat`. */
function normalize(list) {
  const out = [];
  for (const nd of list) {
    if (nd.kind === "comment") { out.push(nd); continue; }
    if (nd.kind === "atrule") {
      if (/^@page\b/i.test(nd.prelude)) { out.push({ kind: "atrule", prelude: nd.prelude, body: nd.body }); continue; }
      out.push({ kind: "atrule", prelude: nd.prelude, children: normalize(topLevel(nd.body)) });
      continue;
    }
    if (nd.kind !== "rule") continue;
    out.push({ kind: "rule", selectors: splitSelectors(nd.prelude), body: nd.body });
  }
  return out;
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
  "EJERCICIOS / WIZARD",
  // [bundle] dos más que `proba-tools`: el simulador de parcial usa el anillo y
  // la fila de progreso de FLASHCARDS y las opciones de QUIZ.
  "FLASHCARDS",
  "QUIZ",
]);
/** Secciones mixtas: se filtran selector por selector contra el vocabulario. */
const KEEP_MIXED = new Set(["HEADER", "READER", "MOBILE", "PRESTIGIO", "PRINT"]);

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

/**
 * Clases de chrome que se rescatan igual porque las vistas las usan.
 * `sheet` es la hoja de papel elevada: vive en la sección READER de
 * `styles.css` (que se filtra selector por selector), y sin ella la colección
 * de ejercicios y el formulario pierden el marco, el filete de unidad y el
 * relleno —quedaban como texto suelto sobre el fondo—.
 */
const RESCUE = new Set(["kbd", "kbd-hint", "icon-btn", "rail-title", "sheet"]);

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
const walkClasses = (list) => {
  for (const nd of list) {
    if (nd.kind === "rule") classesOf(nd.prelude).forEach((c) => VOCAB.add(c));
    else if (nd.kind === "atrule" && nd.body) walkClasses(topLevel(nd.body));
  }
};
for (const sec of bySection) if (KEEP_WHOLE.has(sec.name)) walkClasses(sec.nodes);
// Las clases propias de las tres vistas también son vocabulario.
for (const f of ["ejercicios.css", "formularios.css", "study.css", "latex.css"]) {
  walkClasses(topLevel(fs.readFileSync(path.join(SRC, f), "utf8")));
}

// Paso 3: filtrar.
const dropped = [];
function filterNodes(list, mixed) {
  const decided = list.map((nd) => {
    if (nd.kind === "comment") return { keep: null, nd };
    if (nd.kind === "statement" || nd.kind === "raw") return { keep: false, nd };
    if (nd.kind === "atrule") {
      if (/^@(font-face|import|charset)/i.test(nd.prelude)) { dropped.push(nd.prelude); return { keep: false, nd }; }
      if (/^@keyframes\b/i.test(nd.prelude)) return { keep: true, out: { kind: "atrule", prelude: nd.prelude, body: nd.body, raw: true } };
      const children = filterNodes(topLevel(nd.body), mixed);
      if (!children.length) { dropped.push(nd.prelude + " (vacía)"); return { keep: false, nd }; }
      return { keep: true, out: { kind: "atrule", prelude: nd.prelude, children } };
    }
    if (DROP_PRELUDE.has(nd.prelude.replace(/\s+/g, " ").trim())) { dropped.push(nd.prelude); return { keep: false, nd }; }
    let sels = splitSelectors(nd.prelude);
    if (mixed) sels = sels.filter((s) => VOCAB.has(rootClasses(s)[0]));
    if (!sels.length) { dropped.push(nd.prelude.replace(/\s+/g, " ")); return { keep: false, nd }; }
    if (sels.length !== splitSelectors(nd.prelude).length) {
      dropped.push(...splitSelectors(nd.prelude).filter((s) => !sels.includes(s)));
    }
    return { keep: true, out: { kind: "rule", selectors: sels, body: nd.body } };
  });
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

// Paso 4: `latex.css` entero — la piel de documento (`.tex-doc`, `.tex-title`,
// `.tex-eq`, `.tex-box`…) que comparten la colección de ejercicios y el
// formulario. En `proba-tools` no hacía falta: sus vistas no componen documento.
{
  const kept = filterNodes(topLevel(fs.readFileSync(path.join(SRC, "latex.css"), "utf8")), false);
  if (!kept.length) throw new Error("latex.css: no quedó ninguna regla");
  vocabParts.push(`\n  /* ${"=".repeat(56)}\n     PIEL DE DOCUMENTO — latex.css del baseline\n     ${"=".repeat(56)} */\n` + emit(kept));
}

// Paso 5: dos rescates fuera de `styles.css` — la cabecera de unidad
// (`.unit-hero`, en `reader.css`) que abre la colección de ejercicios igual que
// el taller y el laboratorio, y `.sr-only` (en `nav.css`), el rótulo que solo
// leen los lectores de pantalla: cada ficha de ejercicio abre con un `<h3
// class="sr-only">` para la navegación por encabezados, y sin la regla los 289
// títulos salían impresos en el documento.
{
  const allow = new Set(["unit-hero", "unit-hero-row", "unit-hero-prog"]);
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
  const kept = pick(topLevel(fs.readFileSync(path.join(SRC, "reader.css"), "utf8")));
  if (!kept.length) throw new Error("reader.css: no se rescató ninguna regla (¿cambiaron los nombres?)");
  vocabParts.push(`\n  /* ${"=".repeat(56)}\n     RESCATADO DE reader.css — .unit-hero\n     ${"=".repeat(56)} */\n` + emit(kept));

  const allowNav = new Set(["sr-only"]);
  const pickNav = (list) => {
    const out = [];
    for (const nd of list) {
      if (nd.kind !== "rule") continue;
      const sels = splitSelectors(nd.prelude).filter((x) => allowNav.has(rootClasses(x)[0]));
      if (sels.length) out.push({ kind: "rule", selectors: sels, body: nd.body });
    }
    return out;
  };
  const nav = pickNav(topLevel(fs.readFileSync(path.join(SRC, "nav.css"), "utf8")));
  if (!nav.length) throw new Error("nav.css: no se rescató `.sr-only` (¿cambió el nombre?)");
  vocabParts.push(`\n  /* ${"=".repeat(56)}\n     RESCATADO DE nav.css — .sr-only\n     ${"=".repeat(56)} */\n` + emit(nav));
}

const PREAMBLE = `/* ============================================================
   vocab.css — vocabulario de clases del baseline de Proba
   (\`estudio/styles.css\` + \`latex.css\`), acotado al contenedor de la
   vista.

   GENERADO por \`scripts/wrap-css.mjs\`. No editar a mano.

   Qué NO entra: los tokens \`:root\`, los tres bloques de tema
   (pergamino · laurel · claustro), \`@font-face\`, \`html\`/\`body\` y el
   chrome de la app original (header, sidebar, lector, paleta, grafo,
   selector de tema). Los tokens y las fuentes los aporta la plataforma;
   los colores viajan como \`var(--token)\`.

   Se solapa a propósito con \`css/vocab.css\` del bundle \`proba-tools\`:
   los dos salen del MISMO generador y del mismo \`styles.css\`, así que
   las reglas repetidas son idénticas y ninguna gana sobre la otra. La
   alternativa —que este bundle dependiera de que el otro esté cargado—
   habría atado dos bundles que la plataforma carga por separado.

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

const vocabBody = vocabParts.join("\n");
fs.writeFileSync(path.join(BUNDLE, "css", "vocab.css"), PREAMBLE.replace(/^/, takeKeyframes()) + vocabBody + "\n}\n", "utf8");

// ---------------------------------------------------------------------------
// ejercicios.css · formularios.css — envueltos, con la impresión aparte
// ---------------------------------------------------------------------------

const HEAD = (name, extra) => `/* ============================================================
   ${name} — copia envuelta de \`estudio/${name}\` del baseline de Proba.
   GENERADO por \`scripts/wrap-css.mjs\`. No editar a mano.
   Todo queda acotado al contenedor \`.sinapsis-tool\` de la vista${extra ? `,\n   salvo las reglas de \`@media print\`, que van al final PLANAS: sus
   selectores nombran a \`html\` y \`body\`, que son ancestros del
   contenedor y no pueden vivir dentro del envoltorio` : ""}.
   ============================================================ */

.sinapsis-tool {
`;

/** Separa los bloques `@media print` del resto. */
function splitPrint(list) {
  const screen = [];
  const print = [];
  for (const nd of list) {
    if (nd.kind === "atrule" && /^@media\b[^{]*\bprint\b/i.test(nd.prelude)) print.push(nd);
    else screen.push(nd);
  }
  return { screen, print };
}

const sizes = [];
for (const name of ["ejercicios.css", "formularios.css"]) {
  const css = fs.readFileSync(path.join(SRC, name), "utf8");
  const { screen, print } = splitPrint(topLevel(css));
  const kept = filterNodes(screen, false);
  const body = emit(kept);
  let out = HEAD(name, print.length) + body + "\n}\n";
  out = takeKeyframes() + out;
  if (print.length) {
    out +=
      `\n/* ------------------------------------------------------------\n` +
      `   IMPRESIÓN — fuera del envoltorio a propósito.\n` +
      `   Los selectores que empiezan por \`html\` o \`body\` quedan verbatim\n` +
      `   (son ancestros del contenedor); el resto lleva el prefijo\n` +
      `   \`.sinapsis-tool\`, que es el mismo acotado con otra sintaxis.\n` +
      `   ------------------------------------------------------------ */\n` +
      emitFlat(normalize(print)) +
      "\n";
  }
  fs.writeFileSync(path.join(BUNDLE, "css", name), out, "utf8");
  sizes.push(name);
}

// ---------------------------------------------------------------------------
// parcial.css — recorte de `study.css`: solo el simulador
// ---------------------------------------------------------------------------

{
  const css = fs.readFileSync(path.join(SRC, "study.css"), "utf8");
  const keep = (sel) => {
    const roots = rootClasses(sel);
    return roots.some((c) => /^exam-/.test(c));
  };
  const pick = (list) => {
    const out = [];
    for (const nd of list) {
      if (nd.kind === "atrule") {
        if (/^@keyframes\s+exam/i.test(nd.prelude)) { out.push({ kind: "atrule", prelude: nd.prelude, body: nd.body, raw: true }); continue; }
        const children = pick(topLevel(nd.body));
        if (children.length) out.push({ kind: "atrule", prelude: nd.prelude, children });
        continue;
      }
      if (nd.kind !== "rule") continue;
      const sels = splitSelectors(nd.prelude).filter(keep);
      if (sels.length) out.push({ kind: "rule", selectors: sels, body: nd.body });
    }
    return out;
  };
  const kept = pick(topLevel(css));
  if (kept.length < 40) throw new Error(`study.css: solo se rescataron ${kept.length} reglas exam-* (¿cambiaron los nombres?)`);
  /* Los `@keyframes` no llevan selectores y no se pueden anidar con `&`: van
     planos, antes del envoltorio. */
  const frames = kept.filter((n) => n.raw);
  const rules = kept.filter((n) => !n.raw);
  const head = `/* ============================================================
   parcial.css — recorte de \`estudio/study.css\` del baseline de Proba:
   SOLO las reglas del simulador de parcial (\`exam-*\`). Flashcards y quiz
   no entran: ese material vive en la plataforma como contenido de estudio.
   GENERADO por \`scripts/wrap-css.mjs\`. No editar a mano.
   ============================================================ */

`;
  const framesCss = frames.map((f) => `${f.prelude} {${f.body}}`).join("\n");
  const rulesCss = emit(rules);
  fs.writeFileSync(
    path.join(BUNDLE, "css", "parcial.css"),
    head + takeKeyframes() + (framesCss ? framesCss + "\n\n" : "") + ".sinapsis-tool {\n" + rulesCss + "\n}\n",
    "utf8",
  );
  sizes.push("parcial.css");
}

// ---------------------------------------------------------------------------

for (const f of ["vocab.css", ...sizes]) {
  const p = path.join(BUNDLE, "css", f);
  console.log(`css/${f.padEnd(18)} ${(fs.statSync(p).size / 1024).toFixed(1)} kB`);
}
console.log(`\nvocabulario reconocido: ${VOCAB.size} clases`);
console.log(`reglas descartadas de styles.css: ${dropped.length}`);
