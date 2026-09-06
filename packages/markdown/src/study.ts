/**
 * Compilador del material de estudio: de la carpeta `wiki.study` a `StudyContent`.
 *
 * El material de estudio es contenido de la materia, no de la plataforma
 * (decisión N0-27): vive en el repositorio de la materia, en la carpeta que
 * declara `wiki.study` (por defecto `estudio/`), **relativa al config** —no al
 * wiki—, y viaja en `SyncPayload.study`.
 *
 * Cuatro clases de archivo, documentadas en `docs/CONTRACT.md` §7:
 *
 *  - `*.md` con `tipo: flashcards` → un `Deck`; cada `## Anverso` abre una tarjeta.
 *  - `*.md` con `tipo: quiz`       → un `Quiz`; cada `## Enunciado` abre una pregunta.
 *  - `plan.json`                   → un `Plan`.
 *  - `kits.json`                   → `Kit[]`.
 *
 * Nada de esto es obligatorio: sin carpeta (o con la carpeta vacía) el resultado
 * es un `StudyContent` vacío y ninguna advertencia. Los problemas de formato y
 * las referencias rotas son advertencias, nunca errores: el material se emite
 * igual y el autor decide si lo arregla.
 */
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import {
  Kit,
  Plan,
  StudyContent,
  isValidSlug,
  normalizeSlug,
  type Card as CardType,
  type Deck as DeckType,
  type Kit as KitType,
  type Plan as PlanType,
  type Page as PageType,
  type Quiz as QuizType,
  type QuizQuestion as QuizQuestionType,
  type StudyContent as StudyContentType,
  type SubjectConfig as SubjectConfigType,
} from "@sinapsis/contract";
import type { CompileIssue } from "./compile.js";
import { parseFrontmatter } from "./frontmatter.js";
import { splitLines } from "./inline.js";

// ---------------------------------------------------------------------------
// Entradas y salidas
// ---------------------------------------------------------------------------

export interface CompileStudyOptions {
  /** Carpeta del material de estudio (absoluta). Si no existe, el resultado es vacío. */
  dir: string;
  config: SubjectConfigType;
  /**
   * Páginas ya compiladas del wiki. Con ellas se verifican las referencias a
   * slugs (`Card.page`, `QuizQuestion.page`, `Kit.pages`). Si no se pasan
   * —`sinapsis validate`, que no compila el wiki— esas verificaciones se omiten.
   */
  pages?: ReadonlyArray<Pick<PageType, "slug">> | undefined;
}

export interface CompileStudyResult {
  study: StudyContentType;
  issues: CompileIssue[];
}

/** Conteos del material de estudio: los imprime el CLI y los usan los tests. */
export interface StudyCounts {
  decks: number;
  cards: number;
  quizzes: number;
  questions: number;
  phases: number;
  milestones: number;
  tasks: number;
  kits: number;
}

export function studyCounts(study: StudyContentType): StudyCounts {
  const phases = study.plan?.phases ?? [];
  const milestones = phases.flatMap((p) => p.milestones);
  return {
    decks: study.decks.length,
    cards: study.decks.reduce((n, d) => n + d.cards.length, 0),
    quizzes: study.quizzes.length,
    questions: study.quizzes.reduce((n, q) => n + q.questions.length, 0),
    phases: phases.length,
    milestones: milestones.length,
    tasks: milestones.reduce((n, m) => n + m.tasks.length, 0),
    kits: study.kits.length,
  };
}

/** true si no hay nada que enviar (ni mazos, ni quizzes, ni plan, ni kits). */
export function isEmptyStudy(study: StudyContentType): boolean {
  return study.decks.length === 0 && study.quizzes.length === 0 && study.plan === null && study.kits.length === 0;
}

/** `StudyContent` vacío (el resultado cuando la materia no trae material propio). */
export function emptyStudy(): StudyContentType {
  return { decks: [], quizzes: [], plan: null, kits: [] };
}

// ---------------------------------------------------------------------------
// compileStudy
// ---------------------------------------------------------------------------

const PLAN_FILE = "plan.json";
const KITS_FILE = "kits.json";
/** `tipo` del frontmatter → qué compila. Sin `tipo`, el archivo se ignora en silencio. */
const DECK_TYPES = new Set(["flashcards", "mazo", "cards", "tarjetas"]);
const QUIZ_TYPES = new Set(["quiz", "cuestionario"]);

export async function compileStudy(opts: CompileStudyOptions): Promise<CompileStudyResult> {
  const { config } = opts;
  const issues: CompileIssue[] = [];
  const study = emptyStudy();

  const entries = await listStudyFiles(opts.dir);
  if (entries === null) return { study, issues };

  // --- mazos y quizzes ------------------------------------------------------
  const markdown = entries.filter((name) => name.endsWith(".md") && name.toLowerCase() !== "readme.md");
  const texts = await Promise.all(markdown.map((name) => readFile(path.join(opts.dir, name), "utf8")));

  markdown.forEach((file, i) => {
    const { meta, body } = parseFrontmatter(texts[i] ?? "");
    const kind = scalar(meta, "tipo", "type").toLowerCase();
    if (kind === "") return; // notas sueltas del autor: no son material compilable
    if (DECK_TYPES.has(kind)) {
      const deck = parseDeck({ file, meta, body, config, issues });
      if (deck) study.decks.push(deck);
      return;
    }
    if (QUIZ_TYPES.has(kind)) {
      const quiz = parseQuiz({ file, meta, body, config, issues });
      if (quiz) study.quizzes.push(quiz);
      return;
    }
    issues.push({
      kind: "study-invalid",
      page: file,
      detail: `tipo "${kind}" desconocido (se admiten "flashcards" y "quiz"); el archivo se ignora`,
    });
  });

  // --- plan y kits ----------------------------------------------------------
  if (entries.includes(PLAN_FILE)) {
    study.plan = (await parseJsonFile(opts.dir, PLAN_FILE, Plan, issues)) as PlanType | null;
  }
  if (entries.includes(KITS_FILE)) {
    const kits = (await parseJsonFile(opts.dir, KITS_FILE, Kit.array(), issues)) as KitType[] | null;
    if (kits) study.kits = kits;
  }

  crossCheck(study, config, opts.pages, issues);

  // Última red: si algo quedó fuera del contrato pese a las validaciones, se
  // avisa y se emite un `StudyContent` vacío antes que un payload inválido.
  const parsed = StudyContent.safeParse(study);
  if (!parsed.success) {
    for (const issue of parsed.error.issues.slice(0, 8)) {
      issues.push({
        kind: "study-invalid",
        page: "estudio",
        detail: `${issue.path.join(".") || "(raíz)"}: ${issue.message}`,
      });
    }
    return { study: emptyStudy(), issues };
  }
  return { study: parsed.data, issues };
}

/** Nombres de archivo de la carpeta de estudio, o `null` si la carpeta no existe. */
async function listStudyFiles(dir: string): Promise<string[] | null> {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (cause) {
    const code = (cause as NodeJS.ErrnoException).code;
    if (code === "ENOENT" || code === "ENOTDIR") return null;
    throw cause;
  }
  return entries
    .filter((e) => e.isFile() && !e.name.startsWith(".") && !e.name.startsWith("_"))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b, "en"));
}

// ---------------------------------------------------------------------------
// Mazos
// ---------------------------------------------------------------------------

interface ParseInput {
  file: string;
  meta: Record<string, unknown>;
  body: string;
  config: SubjectConfigType;
  issues: CompileIssue[];
}

function parseDeck({ file, meta, body, config, issues }: ParseInput): DeckType | null {
  const id = idFromMeta(meta, file, issues);
  const title = scalar(meta, "titulo", "title");
  if (title === "") {
    issues.push({ kind: "study-invalid", page: file, detail: 'falta "titulo" en el frontmatter' });
  }
  const division = divisionFromMeta(meta, config, file, issues);

  const cards: CardType[] = [];
  splitSections(body).forEach((section, i) => {
    const front = section.heading.text.trim();
    const { directives, rest } = takeDirectives(section.lines);
    const back = rest.join("\n").trim();
    if (front === "" || back === "") {
      issues.push({
        kind: "study-empty",
        page: file,
        detail: `la tarjeta ${i + 1} ("${front || "sin anverso"}") no tiene ${front === "" ? "anverso" : "reverso"}`,
      });
      return;
    }
    const page = directives.page === undefined ? undefined : pageRef(directives.page, file, issues);
    cards.push({
      id: section.heading.id ?? `${id}:${cards.length + 1}`,
      front: clamp(front, 4000, file, "anverso", issues),
      back: clamp(back, 8000, file, "reverso", issues),
      tags: directives.tags,
      ...(division ? { division } : {}),
      ...(page ? { page } : {}),
    });
  });

  if (cards.length === 0) {
    issues.push({ kind: "study-empty", page: file, detail: "el mazo no tiene tarjetas (cada «## …» abre una)" });
    return null;
  }

  const description = scalar(meta, "descripcion", "description");
  return {
    id,
    title: (title || id).slice(0, 120),
    ...(description ? { description: description.slice(0, 600) } : {}),
    ...(division ? { division } : {}),
    source: "authored",
    cards,
  };
}

// ---------------------------------------------------------------------------
// Quizzes
// ---------------------------------------------------------------------------

const OPTION = /^\s{0,3}[-*+]\s+\[([ xX])\]\s+(.*)$/;
const QUOTE = /^\s{0,3}>\s?(.*)$/;
/**
 * Texto alternativo de una opción, al final de la línea: `- [x] $\alpha$ {alt: alfa}`.
 * Es para las opciones que son solo matemática, que un lector de pantalla no
 * puede leer (`QuizOption.alt` del contrato). Si al quitarlo no queda texto, la
 * directiva se ignora: la opción vale más que su alternativa.
 */
const OPTION_ALT = /\{alt:\s*([^}]*)\}$/i;

function parseQuiz({ file, meta, body, config, issues }: ParseInput): QuizType | null {
  const id = idFromMeta(meta, file, issues);
  const title = scalar(meta, "titulo", "title");
  if (title === "") {
    issues.push({ kind: "study-invalid", page: file, detail: 'falta "titulo" en el frontmatter' });
  }
  const division = divisionFromMeta(meta, config, file, issues);

  const questions: QuizQuestionType[] = [];
  splitSections(body).forEach((section, i) => {
    const where = `la pregunta ${i + 1} ("${section.heading.text.trim() || "sin enunciado"}")`;
    const { directives, rest } = takeDirectives(section.lines);

    const preamble: string[] = [];
    const options: Array<{ text: string; correct: boolean; alt?: string }> = [];
    const explanation: string[] = [];
    let seenOption = false;
    for (const line of rest) {
      const option = line.match(OPTION);
      if (option) {
        seenOption = true;
        const { text, alt } = optionText((option[2] ?? "").trim());
        options.push({
          text,
          correct: (option[1] ?? "").toLowerCase() === "x",
          ...(alt ? { alt } : {}),
        });
        continue;
      }
      const quote = line.match(QUOTE);
      if (quote && seenOption) {
        explanation.push((quote[1] ?? "").trim());
        continue;
      }
      if (!seenOption) preamble.push(line);
    }

    const prompt = [section.heading.text.trim(), preamble.join("\n").trim()].filter(Boolean).join("\n\n");
    if (prompt === "") {
      issues.push({ kind: "study-empty", page: file, detail: `${where} no tiene enunciado` });
      return;
    }
    if (options.length < 2) {
      issues.push({
        kind: "quiz-few-options",
        page: file,
        detail: `${where} tiene ${options.length} opción(es); hacen falta al menos 2 (lista "- [ ] …" / "- [x] …")`,
      });
      return;
    }
    if (options.length > 8) {
      issues.push({
        kind: "study-invalid",
        page: file,
        detail: `${where} tiene ${options.length} opciones; se conservan las primeras 8`,
      });
      options.length = 8;
    }
    if (!options.some((o) => o.correct)) {
      issues.push({
        kind: "quiz-no-correct",
        page: file,
        detail: `${where} no marca ninguna opción correcta con "- [x]"; la pregunta se descarta`,
      });
      return;
    }

    const text = explanation.join("\n").trim();
    const page = directives.page === undefined ? undefined : pageRef(directives.page, file, issues);
    questions.push({
      id: section.heading.id ?? `${id}:${questions.length + 1}`,
      prompt: clamp(prompt, 4000, file, "enunciado", issues),
      options,
      ...(text ? { explanation: text.slice(0, 4000) } : {}),
      ...(division ? { division } : {}),
      ...(page ? { page } : {}),
    });
  });

  if (questions.length === 0) {
    issues.push({ kind: "study-empty", page: file, detail: "el quiz no tiene preguntas válidas (cada «## …» abre una)" });
    return null;
  }

  const description = scalar(meta, "descripcion", "description");
  return {
    id,
    title: (title || id).slice(0, 120),
    ...(description ? { description: description.slice(0, 600) } : {}),
    ...(division ? { division } : {}),
    questions,
  };
}

/** Separa el texto de una opción de su `{alt: …}` final (ver `OPTION_ALT`). */
function optionText(raw: string): { text: string; alt: string } {
  const match = raw.match(OPTION_ALT);
  if (!match) return { text: raw.slice(0, 600), alt: "" };
  const text = raw.slice(0, raw.length - match[0].length).trim();
  if (text === "") return { text: raw.slice(0, 600), alt: "" };
  return { text: text.slice(0, 600), alt: (match[1] ?? "").trim().slice(0, 300) };
}

// ---------------------------------------------------------------------------
// plan.json y kits.json
// ---------------------------------------------------------------------------

interface Schema<T> {
  safeParse(value: unknown):
    | { success: true; data: T }
    | { success: false; error: { issues: ReadonlyArray<{ path: PropertyKey[]; message: string }> } };
}

/** Lee un JSON y lo valida contra el esquema del contrato; las issues llevan la ruta del campo. */
async function parseJsonFile<T>(
  dir: string,
  file: string,
  schema: Schema<T>,
  issues: CompileIssue[],
): Promise<T | null> {
  let raw: string;
  try {
    raw = await readFile(path.join(dir, file), "utf8");
  } catch {
    return null;
  }

  let json: unknown;
  try {
    json = JSON.parse(raw) as unknown;
  } catch (cause) {
    issues.push({
      kind: "study-invalid",
      page: file,
      detail: `no es JSON válido: ${cause instanceof Error ? cause.message : String(cause)}`,
    });
    return null;
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    for (const issue of parsed.error.issues.slice(0, 12)) {
      issues.push({ kind: "study-invalid", page: file, detail: `${issue.path.join(".") || "(raíz)"}: ${issue.message}` });
    }
    return null;
  }
  return parsed.data;
}

// ---------------------------------------------------------------------------
// Validaciones cruzadas (advertencias, nunca errores)
// ---------------------------------------------------------------------------

function crossCheck(
  study: StudyContentType,
  config: SubjectConfigType,
  pages: ReadonlyArray<Pick<PageType, "slug">> | undefined,
  issues: CompileIssue[],
): void {
  const slugs = pages ? new Set(pages.map((p) => p.slug)) : null;
  const deckIds = new Set(study.decks.map((d) => d.id));
  const quizIds = new Set(study.quizzes.map((q) => q.id));
  const divisions = new Set(config.divisions.map((d) => d.key));
  const railIds = new Set(config.rail.flatMap((g) => g.items.map((item) => item.id)));

  const broken = (where: string, detail: string) => issues.push({ kind: "study-broken-ref", page: where, detail });
  const checkPage = (where: string, slug: string | undefined) => {
    if (slug && slugs && !slugs.has(slug)) broken(where, `la página "${slug}" no existe en el wiki`);
  };

  // --- ids únicos -----------------------------------------------------------
  for (const id of duplicates(study.decks.map((d) => d.id))) {
    issues.push({ kind: "study-duplicate-id", page: "mazos", detail: `id de mazo "${id}"` });
  }
  for (const id of duplicates(study.quizzes.map((q) => q.id))) {
    issues.push({ kind: "study-duplicate-id", page: "quizzes", detail: `id de quiz "${id}"` });
  }
  for (const id of duplicates(study.decks.flatMap((d) => d.cards.map((c) => c.id)))) {
    issues.push({
      kind: "study-duplicate-id",
      page: "mazos",
      detail: `id de tarjeta "${id}" (el SRS del usuario se guarda por id)`,
    });
  }
  for (const id of duplicates(study.quizzes.flatMap((q) => q.questions.map((x) => x.id)))) {
    issues.push({ kind: "study-duplicate-id", page: "quizzes", detail: `id de pregunta "${id}"` });
  }
  for (const id of duplicates(study.kits.map((k) => k.id))) {
    issues.push({ kind: "study-duplicate-id", page: KITS_FILE, detail: `id de kit "${id}"` });
  }

  // --- mazos y quizzes ------------------------------------------------------
  for (const deck of study.decks) {
    for (const card of deck.cards) checkPage(`mazo "${deck.id}"`, card.page);
  }
  for (const quiz of study.quizzes) {
    for (const question of quiz.questions) checkPage(`quiz "${quiz.id}"`, question.page);
  }

  // --- plan -----------------------------------------------------------------
  for (const phase of study.plan?.phases ?? []) {
    for (const milestone of phase.milestones) {
      const where = `${PLAN_FILE} · ${phase.id}/${milestone.id}`;
      for (const key of milestone.divisions) {
        if (!divisions.has(key)) broken(where, `la división "${key}" no está en config.divisions`);
      }
      for (const task of milestone.tasks) {
        if (task.target === undefined || task.target === "") continue;
        if (task.kind === "read" && !divisions.has(task.target)) {
          broken(`${where}/${task.id}`, `«read» apunta a "${task.target}", que no es una división del config`);
        }
        if (task.kind === "cards" && !deckIds.has(task.target)) {
          broken(`${where}/${task.id}`, `«cards» apunta al mazo "${task.target}", que no existe`);
        }
        if (task.kind === "quiz" && !quizIds.has(task.target)) {
          broken(`${where}/${task.id}`, `«quiz» apunta al quiz "${task.target}", que no existe`);
        }
        if (task.kind === "tool" && !railIds.has(task.target)) {
          broken(
            `${where}/${task.id}`,
            `«tool» apunta a "${task.target}", que no es un id de ítem del rail del config`,
          );
        }
      }
    }
  }

  // --- kits -----------------------------------------------------------------
  for (const kit of study.kits) {
    const where = `${KITS_FILE} · ${kit.id}`;
    for (const key of kit.divisions) {
      if (!divisions.has(key)) broken(where, `la división "${key}" no está en config.divisions`);
    }
    for (const slug of kit.pages) checkPage(where, slug);
    for (const id of kit.decks) {
      if (!deckIds.has(id)) broken(where, `el mazo "${id}" no existe`);
    }
    for (const id of kit.quizzes) {
      if (!quizIds.has(id)) broken(where, `el quiz "${id}" no existe`);
    }
    for (const id of kit.tools) {
      if (!railIds.has(id)) broken(where, `la herramienta "${id}" no es un ítem del rail del config`);
    }
  }
}

function duplicates(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const dupes = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) dupes.add(value);
    seen.add(value);
  }
  return [...dupes];
}

// ---------------------------------------------------------------------------
// Secciones `##`, directivas y frontmatter
// ---------------------------------------------------------------------------

const H2 = /^##(?!#)\s*(.*?)\s*#*\s*$/;
const EXPLICIT_ID = /\{#([^}\s]+)\}$/;
const FENCE = /^\s{0,3}(```+|~~~+)/;

export interface StudySection {
  heading: { text: string; id: string | undefined };
  lines: string[];
}

/**
 * Corta el cuerpo en secciones de nivel 2: cada `## …` abre una tarjeta o una
 * pregunta y el cuerpo que sigue le pertenece hasta el próximo `##`. Los `##`
 * dentro de un bloque de código o de un bloque `$$…$$` no cuentan; los `###`
 * tampoco (así el reverso puede tener sus propios subtítulos).
 */
export function splitSections(body: string): StudySection[] {
  const out: StudySection[] = [];
  let fence: string | null = null;
  let math = false;

  for (const line of splitLines(body)) {
    const trimmed = line.trim();
    const fenceMatch = line.match(FENCE);
    if (fenceMatch) {
      const mark = (fenceMatch[1] ?? "").slice(0, 3);
      if (fence === null) fence = mark;
      else if (fence === mark) fence = null;
    } else if (fence === null && trimmed.startsWith("$$")) {
      const count = (trimmed.match(/\$\$/g) ?? []).length;
      if (count % 2 === 1) math = !math;
    }

    const heading = fence === null && !math ? line.match(H2) : null;
    if (heading) {
      const raw = (heading[1] ?? "").trim();
      const explicit = raw.match(EXPLICIT_ID);
      out.push({
        heading: {
          text: explicit ? raw.slice(0, raw.length - explicit[0].length).trim() : raw,
          id: explicit ? studyId(explicit[1] ?? "") || undefined : undefined,
        },
        lines: [],
      });
      continue;
    }
    out[out.length - 1]?.lines.push(line);
  }

  return out;
}

const DIRECTIVE = /^\s{0,3}>?\s*(pagina|página|page|tags)\s*:\s*(.*)$/i;

/**
 * Directivas del encabezado de una tarjeta o pregunta: `pagina: slug` y
 * `tags: a, b`, con o sin `>` delante (para que se lean como un callout en
 * Obsidian). Valen solo mientras no haya empezado el contenido.
 */
function takeDirectives(lines: readonly string[]): {
  directives: { page?: string; tags: string[] };
  rest: string[];
} {
  const directives: { page?: string; tags: string[] } = { tags: [] };
  let i = 0;
  for (; i < lines.length; i += 1) {
    const line = lines[i] ?? "";
    if (line.trim() === "" || line.trim() === ">") continue;
    const match = line.match(DIRECTIVE);
    if (!match) break;
    const value = (match[2] ?? "").trim();
    if ((match[1] ?? "").toLowerCase() === "tags") {
      directives.tags = value
        .split(",")
        .map((t) => t.trim().slice(0, 60))
        .filter((t) => t !== "");
    } else if (value !== "") {
      directives.page = value;
    }
  }
  return { directives, rest: lines.slice(i) };
}

/** `Card.page` / `QuizQuestion.page`: se normaliza igual que el nombre de archivo del wiki. */
function pageRef(raw: string, file: string, issues: CompileIssue[]): string | undefined {
  if (isValidSlug(raw)) return raw;
  const normalized = normalizeSlug(raw);
  if (normalized === "") {
    issues.push({ kind: "study-invalid", page: file, detail: `"pagina: ${raw}" no produce un slug válido (se ignora)` });
    return undefined;
  }
  issues.push({ kind: "study-invalid", page: file, detail: `slug normalizado: "${raw}" → "${normalized}"` });
  return normalized;
}

/** Id del mazo o del quiz: el del frontmatter o el nombre del archivo, normalizados. */
function idFromMeta(meta: Record<string, unknown>, file: string, issues: CompileIssue[]): string {
  const fallback = studyId(file.replace(/\.md$/i, "")) || "mazo";
  const declared = scalar(meta, "id");
  if (declared === "") return fallback;
  const normalized = studyId(declared);
  if (normalized === "") {
    issues.push({ kind: "study-invalid", page: file, detail: `id "${declared}" inválido; se usa "${fallback}"` });
    return fallback;
  }
  return normalized;
}

/** `StudyId`: minúsculas, dígitos y `. _ - :`. Vacío si no queda nada utilizable. */
function studyId(raw: string): string {
  return (raw ?? "")
    .normalize("NFD")
    .replace(/\p{M}+/gu, "")
    .replace(/[^a-zA-Z0-9._:-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^[^a-zA-Z0-9]+/, "")
    .replace(/[-._:]+$/, "")
    .toLowerCase()
    .slice(0, 160);
}

/** División declarada en el frontmatter (`division`, o el campo de división del config). */
function divisionFromMeta(
  meta: Record<string, unknown>,
  config: SubjectConfigType,
  file: string,
  issues: CompileIssue[],
): string | undefined {
  const raw = scalar(meta, "division", "división", config.wiki.divisionField);
  if (raw === "") return undefined;
  const key = raw.slice(0, 24);
  if (!config.divisions.some((d) => d.key === key)) {
    issues.push({ kind: "study-broken-ref", page: file, detail: `la división "${key}" no está en config.divisions` });
  }
  return key;
}

function clamp(text: string, max: number, file: string, what: string, issues: CompileIssue[]): string {
  if (text.length <= max) return text;
  issues.push({ kind: "study-invalid", page: file, detail: `un ${what} supera los ${max} caracteres y se recortó` });
  return text.slice(0, max);
}

function scalar(meta: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const value = meta[key];
    if (value === undefined || value === null) continue;
    if (Array.isArray(value) || typeof value === "object") continue;
    const text = String(value).trim();
    if (text !== "") return text;
  }
  return "";
}
