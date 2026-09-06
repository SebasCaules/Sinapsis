#!/usr/bin/env node
/**
 * Convierte el material de estudio de la app de Probabilidad y Estadística
 * (`estudio/study-data.js` del vault de Obsidian) al formato de Sinapsis
 * (`docs/CONTRACT.md` §7): mazos y quiz en markdown, `plan.json` y `kits.json`.
 *
 * Es un script de un solo uso que queda en el repositorio para poder regenerar
 * la carpeta cuando el material del vault cambie. **Solo lee** el vault; escribe
 * únicamente dentro de `examples/proba/estudio/`.
 *
 *   node examples/proba/tools/convert-study-data.mjs \
 *     [--data  ~/Desktop/ITBA/26-1C/Proba_Obsidian/estudio/study-data.js] \
 *     [--wiki  ~/Desktop/ITBA/26-1C/Proba_Obsidian/wiki] \
 *     [--payload /tmp/p2.json]   # payload compilado (`sinapsis sync --dry-run --out`)
 *     [--out   examples/proba/estudio] [--dry-run]
 *
 * De la fuente salen:
 *   FLASHCARDS → flashcards-<mazo>.md   (un archivo por `deck`)
 *   DISTS      → flashcards-distribuciones.md  (el mazo «E[X] y V(X)» que la app
 *                autogeneraba en tiempo de ejecución y al que apuntan plan y kits)
 *   QUIZ       → quiz-general.md
 *   ROADMAP    → plan.json
 *   KITS       → kits.json
 */
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const EXAMPLE = path.resolve(HERE, "..");
const VAULT = path.join(homedir(), "Desktop/ITBA/26-1C/Proba_Obsidian");

const args = parseArgs(process.argv.slice(2));
const dataFile = resolve(args.data ?? path.join(VAULT, "estudio/study-data.js"));
const wikiDir = resolve(args.wiki ?? path.join(VAULT, "wiki"));
const outDir = resolve(args.out ?? path.join(EXAMPLE, "estudio"));
const configFile = resolve(args.config ?? path.join(EXAMPLE, "sinapsis.config.json"));

// ---------------------------------------------------------------------------
// Fuentes
// ---------------------------------------------------------------------------

const config = JSON.parse(await readFile(configFile, "utf8"));
const divisionName = new Map(config.divisions.map((d) => [d.key, d.name]));
const railIds = new Set(config.rail.flatMap((g) => g.items.map((i) => i.id)));

/** Páginas del wiki: slug → { division, title }. Del payload compilado si lo hay. */
const wiki = args.payload ? await pagesFromPayload(resolve(args.payload)) : await pagesFromWiki(wikiDir);

/**
 * `study-data.js` es un IIFE del navegador que publica `window.STUDY`. Se ejecuta
 * en un contexto aislado con un `window` mínimo: las funciones que usan `window.M`
 * (densidades, dominios) quedan definidas pero nunca se invocan desde acá.
 */
const sandbox = { window: { M: {} }, console };
vm.createContext(sandbox);
vm.runInContext(await readFile(dataFile, "utf8"), sandbox, { filename: dataFile });
const STUDY = sandbox.window.STUDY;
if (!STUDY) throw new Error(`${dataFile} no publicó window.STUDY`);

// ---------------------------------------------------------------------------
// 1. Mazos de flashcards
// ---------------------------------------------------------------------------

/** Mazos curados: el orden de aparición en FLASHCARDS manda. */
const byDeck = new Map();
for (const card of STUDY.FLASHCARDS) {
  if (!byDeck.has(card.deck)) byDeck.set(card.deck, []);
  byDeck.get(card.deck).push(card);
}

/** Título de la app → id del mazo en Sinapsis (lo usan el plan y los kits). */
const DECK_IDS = new Map([["Distribuciones · E[X] y V(X)", "distribuciones"]]);
for (const title of byDeck.keys()) DECK_IDS.set(title, slugify(title));

const decks = [];
for (const [title, cards] of byDeck) {
  decks.push({
    id: DECK_IDS.get(title),
    title,
    cards: cards.map((c) => ({ front: c.q, back: c.a, page: c.slug })),
  });
}

/**
 * El mazo «Distribuciones · E[X] y V(X)» no estaba en FLASHCARDS: la app lo
 * generaba desde DISTS al arrancar. Acá se materializa, porque el plan y cuatro
 * kits lo nombran; sin él esas referencias quedarían rotas.
 */
decks.push({
  id: "distribuciones",
  title: "Distribuciones · E[X] y V(X)",
  description: "Esperanza y varianza de cada distribución del programa, con lo que modela.",
  cards: STUDY.DISTS.map((d) => ({
    front: `${d.name}: $E[X]$ y $V(X)$`,
    back: [
      `$$${d.tex.mean}$$`,
      `$$${d.tex.var}$$`,
      "",
      d.modela,
      ...(d.note ? ["", d.note] : []),
    ].join("\n"),
    page: d.slug,
    tags: [d.kind === "disc" ? "discreta" : "continua"],
  })),
});

for (const deck of decks) {
  deck.division = commonDivision(deck.cards);
  deck.file = `flashcards-${deck.id}.md`;
}

// ---------------------------------------------------------------------------
// 2. Quiz
// ---------------------------------------------------------------------------

const quiz = {
  id: "quiz-general",
  file: "quiz-general.md",
  title: "Quiz conceptual",
  description: "Reconocer distribuciones, criterios de inferencia y convenciones de la cátedra.",
  questions: STUDY.QUIZ.map((q) => ({
    prompt: q.q,
    options: q.options.map((text, i) => ({ text, correct: i === q.correct })),
    explanation: q.explain,
    page: q.slug,
  })),
};

// ---------------------------------------------------------------------------
// 3. Plan de estudio (ROADMAP → Plan)
// ---------------------------------------------------------------------------

const UNITS = STUDY.ROADMAP.unitsMeta;

/**
 * `nav` de la app → tarea del contrato. Lo que la plataforma todavía no tiene
 * (simulador, banco de ejercicios, asistentes) queda como `custom` sin destino:
 * la etiqueta explica qué hacer y no se inventa un enlace roto.
 */
function fromNav(nav, label) {
  if (nav === "#/quiz") return { label, kind: "quiz", target: quiz.id };
  if (nav === "#/formularios") return { label, kind: "custom", target: "formulario-maestro" };
  if (nav === "#/flashcards/__due") return { label, kind: "cards" };
  return { label, kind: "custom" };
}

const phaseOrder = [...STUDY.ROADMAP.modes.find((m) => m.id === "cursada").phases, "directo"];
const phases = phaseOrder.map((id, i) => {
  const phase = STUDY.ROADMAP.phases.find((p) => p.id === id);
  const n = i + 1;
  const milestones = [];

  if (phase.milestones) {
    // Fases con hitos temáticos propios (el final integrador).
    for (const milestone of phase.milestones) {
      milestones.push({
        title: milestone.title,
        divisions: [],
        tasks: milestone.tasks.map((task) => {
          const label = task.hint ? `${task.label} (${task.hint})` : task.label;
          if (task.kind === "deck") return { label, kind: "cards", target: DECK_IDS.get(task.deck) };
          if (task.kind === "tool") return fromNav(task.nav, label);
          const slug = task.slug ?? task.slugs?.[0];
          return { label, kind: "custom", ...(wiki.has(slug) ? { target: slug } : {}) };
        }),
      });
    }
  } else {
    // Un hito por unidad, con las tareas estándar del cronograma.
    for (const unit of phase.units) {
      const meta = UNITS[unit] ?? {};
      const tasks = [{ label: `Leer la teoría de la ${unitLabel(unit)}`, kind: "read", target: unit }];
      for (const deck of meta.decks ?? []) {
        tasks.push({ label: `Repasar las flashcards de «${deck}»`, kind: "cards", target: DECK_IDS.get(deck) });
      }
      if (meta.tp) {
        tasks.push({
          label: `Resolver el TP${unit} · ${meta.tp.ej} ejercicios (${meta.tp.horas})`,
          kind: "exercises",
        });
      }
      milestones.push({ title: unitLabel(unit), divisions: [unit], tasks });
    }
  }

  // Unidades de repaso: no llevan hito completo en la app; acá van juntas en uno.
  if (phase.review?.length) {
    milestones.push({
      title: `Repaso de ${phase.review.map((u) => `U${u}`).join(", ")}`,
      divisions: phase.review,
      tasks: phase.review.map((unit) => ({
        label: `Repasar la ${unitLabel(unit)}`,
        kind: "read",
        target: unit,
      })),
    });
  }

  // Cierre: el simulacro de la instancia y el quiz de autoevaluación.
  milestones.push({
    title: "Simulacro y autoevaluación",
    divisions: [],
    tasks: [
      ...(phase.exam ? [{ label: `${phase.exam.label} — ${phase.exam.hint}`, kind: "custom" }] : []),
      { label: "Quiz conceptual de autoevaluación", kind: "quiz", target: quiz.id },
    ],
  });

  return {
    id: `fase-${n}`,
    title: phase.title,
    ...(phase.kicker ? { subtitle: phase.kicker } : {}),
    scope: scopeOf(phase),
    milestones: milestones.map((m, mi) => ({
      id: `fase-${n}-h${mi + 1}`,
      title: m.title,
      divisions: m.divisions,
      tasks: m.tasks.map((t, ti) => ({
        id: `fase-${n}-h${mi + 1}-t${ti + 1}`,
        label: cut(t.label, 200),
        kind: t.kind,
        ...(t.target ? { target: t.target } : {}),
      })),
    })),
  };
});

const plan = { title: "Plan de estudio · Probabilidad y Estadística", phases };

// ---------------------------------------------------------------------------
// 4. Kits
// ---------------------------------------------------------------------------

/** `nav` de un kit → id del ítem del rail que lo abre (los demás no tienen destino aún). */
const TOOL_IDS = new Map([
  ["#/explorador", "explorador"],
  ["#/taller", "taller"],
  ["#/calc", "calc"],
  ["#/lab", "lab"],
  ["#/formularios", "formularios"],
]);

const kits = STUDY.KITS.map((kit) => {
  const pages = kit.pages.filter((slug) => wiki.has(slug));
  // Los `tools` del kit son [{label, nav, icon}]: solo sobreviven los que el rail
  // del config sabe abrir; simulador, banco de ejercicios y asistentes no tienen
  // ítem de rail todavía y se descartan en vez de quedar como botones muertos.
  const tools = [...new Set(kit.tools.map((t) => TOOL_IDS.get(t.nav)).filter((id) => id && railIds.has(id)))];
  const quizzes = kit.tools.some((t) => t.nav === "#/quiz") ? [quiz.id] : [];
  return {
    id: kit.id,
    title: kit.title,
    description: cut(kit.blurb, 600),
    divisions: orderedDivisions(pages),
    pages,
    decks: kit.decks.map((d) => DECK_IDS.get(d)).filter(Boolean),
    ...(quizzes.length ? { quizzes } : {}),
    tools,
  };
});

// ---------------------------------------------------------------------------
// Escritura
// ---------------------------------------------------------------------------

const files = new Map();
for (const deck of decks) files.set(deck.file, deckMarkdown(deck));
files.set(quiz.file, quizMarkdown(quiz));
files.set("plan.json", `${JSON.stringify(plan, null, 2)}\n`);
files.set("kits.json", `${JSON.stringify(kits, null, 2)}\n`);

if (!args["dry-run"]) {
  await mkdir(outDir, { recursive: true });
  for (const [name, text] of files) await writeFile(path.join(outDir, name), text, "utf8");
}

const cards = decks.reduce((n, d) => n + d.cards.length, 0);
const milestones = phases.reduce((n, p) => n + p.milestones.length, 0);
const tasks = phases.reduce((n, p) => n + p.milestones.reduce((m, h) => m + h.tasks.length, 0), 0);
const brokenPages = STUDY.KITS.flatMap((k) => k.pages).filter((slug) => !wiki.has(slug));

console.log(`${args["dry-run"] ? "(dry-run) " : ""}${outDir}`);
console.log(`  mazos:     ${decks.length} (${cards} tarjetas)`);
for (const deck of decks) {
  console.log(`    ${deck.id.padEnd(24)} ${String(deck.cards.length).padStart(3)}  ${deck.division ? `U${deck.division}` : "sin división"}`);
}
console.log(`  quizzes:   1 (${quiz.questions.length} preguntas)`);
console.log(`  plan:      ${phases.length} fases · ${milestones} hitos · ${tasks} tareas`);
console.log(`  kits:      ${kits.length}`);
if (brokenPages.length) {
  console.log(`  páginas descartadas por no existir en el wiki: ${[...new Set(brokenPages)].join(", ")}`);
}

// ---------------------------------------------------------------------------
// Serialización a markdown
// ---------------------------------------------------------------------------

function deckMarkdown(deck) {
  const lines = [
    "---",
    "tipo: flashcards",
    `titulo: ${yaml(deck.title)}`,
    `id: ${deck.id}`,
    ...(deck.division ? [`division: "${deck.division}"`] : []),
    ...(deck.description ? [`descripcion: ${yaml(deck.description)}`] : []),
    "---",
    "",
    `<!-- Generado por examples/proba/tools/convert-study-data.mjs desde estudio/study-data.js. -->`,
    "",
  ];
  for (const card of deck.cards) {
    lines.push(`## ${oneLine(card.front)}`, "");
    if (card.page) lines.push(`> pagina: ${card.page}`);
    if (card.tags?.length) lines.push(`> tags: ${card.tags.join(", ")}`);
    if (card.page || card.tags?.length) lines.push("");
    lines.push(card.back.trim(), "");
  }
  return `${lines.join("\n").trimEnd()}\n`;
}

function quizMarkdown(q) {
  const lines = [
    "---",
    "tipo: quiz",
    `titulo: ${yaml(q.title)}`,
    `id: ${q.id}`,
    `descripcion: ${yaml(q.description)}`,
    "---",
    "",
    `<!-- Generado por examples/proba/tools/convert-study-data.mjs desde estudio/study-data.js. -->`,
    "",
  ];
  for (const question of q.questions) {
    lines.push(`## ${oneLine(question.prompt)}`, "");
    if (question.page) lines.push(`> pagina: ${question.page}`, "");
    for (const option of question.options) {
      lines.push(`- [${option.correct ? "x" : " "}] ${oneLine(option.text)}`);
    }
    lines.push("");
    if (question.explanation) lines.push(`> ${oneLine(question.explanation)}`, "");
  }
  return `${lines.join("\n").trimEnd()}\n`;
}

// ---------------------------------------------------------------------------
// Auxiliares
// ---------------------------------------------------------------------------

function scopeOf(phase) {
  const parts = [phase.blurb];
  if (phase.expect?.length) {
    parts.push("", "**Qué cae:**", ...phase.expect.map((e) => `- **${e.t}** (U${e.u}) — ${e.d}`));
  }
  if (phase.guide?.length) {
    parts.push("", "**Orden de estudio sugerido:**", ...phase.guide.map((g) => `- **${g.t}** — ${g.d}`));
  }
  return cut(parts.join("\n"), 4000);
}

function unitLabel(unit) {
  const name = divisionName.get(unit);
  return name ? `Unidad ${unit} · ${name}` : `Unidad ${unit}`;
}

/** División común a todas las tarjetas del mazo, o `undefined` si hay mezcla. */
function commonDivision(cards) {
  const keys = new Set();
  for (const card of cards) {
    const page = card.page ? wiki.get(card.page) : undefined;
    if (!page?.division) return undefined;
    keys.add(page.division);
  }
  return keys.size === 1 ? [...keys][0] : undefined;
}

/** Divisiones de un conjunto de páginas, en el orden del config. */
function orderedDivisions(slugs) {
  const keys = new Set(slugs.map((s) => wiki.get(s)?.division).filter(Boolean));
  return config.divisions.map((d) => d.key).filter((key) => keys.has(key));
}

function slugify(raw) {
  return String(raw)
    .normalize("NFD")
    .replace(/\p{M}+/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

/** El anverso y las opciones ocupan una línea: se colapsan los saltos. */
function oneLine(text) {
  return String(text).replace(/\s*\n\s*/g, " ").trim();
}

function yaml(text) {
  return `'${String(text).replace(/'/g, "''")}'`;
}

function cut(text, max) {
  return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;
}

function resolve(target) {
  const value = target.startsWith("~/") ? path.join(homedir(), target.slice(2)) : target;
  return path.resolve(process.cwd(), value);
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const eq = arg.indexOf("=");
    if (eq !== -1) out[arg.slice(2, eq)] = arg.slice(eq + 1);
    else if ((argv[i + 1] ?? "--").startsWith("--")) out[arg.slice(2)] = true;
    else out[arg.slice(2)] = argv[(i += 1)];
  }
  return out;
}

/** Páginas desde un `SyncPayload` compilado (`sinapsis sync --dry-run --out`). */
async function pagesFromPayload(file) {
  const payload = JSON.parse(await readFile(file, "utf8"));
  return new Map(payload.pages.map((p) => [p.slug, { division: p.division === "meta" ? "" : p.division, title: p.title }]));
}

/** Páginas leyendo el wiki: primer nivel de cada carpeta, `unidad` y `titulo` del frontmatter. */
async function pagesFromWiki(root) {
  const pages = new Map();
  for (const entry of await readdir(root, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
    const dir = path.join(root, entry.name);
    for (const file of await readdir(dir)) {
      if (!file.endsWith(".md")) continue;
      const text = await readFile(path.join(dir, file), "utf8");
      pages.set(file.slice(0, -3), { division: field(text, "unidad"), title: field(text, "titulo") });
    }
  }
  return pages;
}

/** Valor de una clave del frontmatter, sin dependencias (solo `unidad` y `titulo`). */
function field(text, key) {
  if (!text.startsWith("---")) return "";
  const end = text.indexOf("\n---", 3);
  const block = end === -1 ? "" : text.slice(3, end);
  for (const line of block.split("\n")) {
    const colon = line.indexOf(":");
    if (colon === -1 || line.slice(0, colon).trim() !== key) continue;
    return line.slice(colon + 1).trim().replace(/^["']|["']$/g, "");
  }
  return "";
}
