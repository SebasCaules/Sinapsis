/**
 * `scaffoldConfig` — inferencia de un `sinapsis.config.json` a partir de un wiki
 * existente. Es lo que hace `sinapsis init`: adivina tipos de página (carpetas),
 * divisiones (valores del campo de división más frecuente) y nomenclatura, y deja
 * placeholders "COMPLETAR" en lo que solo sabe el usuario.
 */
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import {
  fold,
  isValidDivisionKey,
  normalizeDivisionKey,
  normalizeSlug,
  type DivisionLabel,
  type SubjectConfigInput,
} from "@sinapsis/contract";
import { parseFrontmatter } from "./frontmatter.js";

/** Marca de los campos que el usuario debe completar a mano tras `init`. */
export const TODO = "COMPLETAR";

/** Campos de frontmatter candidatos a ser la división del temario, por prioridad. */
const DIVISION_FIELDS = [
  "unidad",
  "division",
  "división",
  "modulo",
  "módulo",
  "semana",
  "capitulo",
  "capítulo",
] as const;

const DIVISION_LABELS: Record<string, DivisionLabel> = {
  unidad: { singular: "Unidad", abbr: "U", plural: "Unidades" },
  semana: { singular: "Semana", abbr: "S", plural: "Semanas" },
  modulo: { singular: "Módulo", abbr: "M", plural: "Módulos" },
  capitulo: { singular: "Capítulo", abbr: "C", plural: "Capítulos" },
  division: { singular: "División", abbr: "D", plural: "Divisiones" },
};

const INDEX_CANDIDATES = ["index.md", "indice.md", "índice.md", "readme.md"];
const LOG_CANDIDATES = ["log.md", "registro.md", "changelog.md"];

/** Carpetas cuyo contenido no cuenta para el progreso (material de referencia). */
const REFERENCE_FOLDERS = new Set(["fuentes", "sources", "bibliografia", "bibliografía", "material"]);

export interface FolderSurvey {
  folder: string;
  pages: number;
}

export interface WikiSurvey {
  /** Raíz absoluta inspeccionada. */
  wikiRoot: string;
  folders: FolderSurvey[];
  pages: number;
  /** Campo del frontmatter elegido como división (tal como está escrito en el wiki). */
  divisionField: string;
  /** Cuántas páginas declaran ese campo. */
  divisionFieldHits: number;
  /** Valores distintos del campo de división, ya ordenados, con su conteo. */
  divisions: Array<{ key: string; raw: string; count: number; numeric: boolean }>;
  indexFile?: string;
  logFile?: string;
  /** Páginas sin `resumen` encontradas durante la inspección. */
  withoutSummary: number;
}

export interface ScaffoldOptions {
  /** Carpeta raíz del wiki (relativa o absoluta). */
  wikiDir: string;
  /** Slug de la materia; si falta se deriva del nombre de la carpeta que contiene el wiki. */
  slug?: string;
  /** Directorio donde vivirá el config; sirve para calcular `wiki.root` relativo. */
  configDir?: string;
  /** Inspección ya hecha (evita releer el wiki). */
  survey?: WikiSurvey;
}

// ---------------------------------------------------------------------------
// Inspección
// ---------------------------------------------------------------------------

/** Recorre el wiki y resume lo que hace falta para proponer un config. */
export async function inspectWiki(wikiDir: string): Promise<WikiSurvey> {
  const wikiRoot = path.resolve(wikiDir);
  const entries = await readdir(wikiRoot, { withFileTypes: true });

  const folders: FolderSurvey[] = [];
  const fieldHits = new Map<string, number>();
  const valueCounts = new Map<string, Map<string, number>>();
  let pages = 0;
  let withoutSummary = 0;

  for (const entry of entries.filter((e) => e.isDirectory() && !e.name.startsWith("."))) {
    const dir = path.join(wikiRoot, entry.name);
    const files = (await readdir(dir, { withFileTypes: true }))
      .filter((f) => f.isFile() && f.name.endsWith(".md"))
      .map((f) => f.name)
      .sort((a, b) => a.localeCompare(b, "en"));
    if (files.length === 0) continue;
    folders.push({ folder: entry.name, pages: files.length });
    pages += files.length;

    for (const file of files) {
      const { meta } = parseFrontmatter(await readFile(path.join(dir, file), "utf8"));
      if (String(meta["resumen"] ?? meta["summary"] ?? "").trim() === "") withoutSummary += 1;
      for (const field of DIVISION_FIELDS) {
        const raw = meta[field];
        if (raw === undefined || raw === null || Array.isArray(raw)) continue;
        const value = String(raw).trim();
        if (value === "") continue;
        fieldHits.set(field, (fieldHits.get(field) ?? 0) + 1);
        const bucket = valueCounts.get(field) ?? new Map<string, number>();
        bucket.set(value, (bucket.get(value) ?? 0) + 1);
        valueCounts.set(field, bucket);
      }
    }
  }

  // Campo de división más frecuente (empate → orden de DIVISION_FIELDS).
  let divisionField: string = DIVISION_FIELDS[0];
  let divisionFieldHits = 0;
  for (const field of DIVISION_FIELDS) {
    const hits = fieldHits.get(field) ?? 0;
    if (hits > divisionFieldHits) {
      divisionField = field;
      divisionFieldHits = hits;
    }
  }

  const raws = [...(valueCounts.get(divisionField) ?? new Map<string, number>()).entries()];
  const divisions = raws
    .map(([raw, count]) => ({
      raw,
      count,
      numeric: /^\d+$/.test(raw),
      key: isValidDivisionKey(raw) ? raw : normalizeDivisionKey(raw),
    }))
    .filter((d) => d.key !== "")
    .sort((a, b) => {
      if (a.numeric && b.numeric) return Number(a.raw) - Number(b.raw);
      if (a.numeric !== b.numeric) return a.numeric ? -1 : 1;
      return a.raw.localeCompare(b.raw, "es");
    });

  const names = new Set(entries.filter((e) => e.isFile()).map((e) => e.name.toLowerCase()));
  const original = new Map(entries.filter((e) => e.isFile()).map((e) => [e.name.toLowerCase(), e.name]));
  const indexFile = INDEX_CANDIDATES.find((c) => names.has(c));
  const logFile = LOG_CANDIDATES.find((c) => names.has(c));

  return {
    wikiRoot,
    folders,
    pages,
    divisionField,
    divisionFieldHits,
    divisions,
    ...(indexFile ? { indexFile: original.get(indexFile) ?? indexFile } : {}),
    ...(logFile ? { logFile: original.get(logFile) ?? logFile } : {}),
    withoutSummary,
  };
}

// ---------------------------------------------------------------------------
// Scaffold
// ---------------------------------------------------------------------------

/** Propone un `sinapsis.config.json` a partir del wiki. Los huecos quedan como "COMPLETAR". */
export async function scaffoldConfig(opts: ScaffoldOptions): Promise<SubjectConfigInput> {
  const survey = opts.survey ?? (await inspectWiki(opts.wikiDir));
  const wikiRoot = survey.wikiRoot;

  const label = divisionLabelFor(survey.divisionField);

  const divisions =
    survey.divisions.length > 0
      ? survey.divisions.map((d) => ({
          key: d.key,
          name: d.numeric ? `${label.singular} ${d.raw}` : capitalize(d.raw),
          ...(d.numeric ? {} : { kind: "extra" as const }),
        }))
      : [{ key: "1", name: `${label.singular} 1` }];

  const pageTypes =
    survey.folders.length > 0
      ? survey.folders.map((f) => {
          const singular = singularizeEs(f.folder);
          const reference = REFERENCE_FOLDERS.has(f.folder.toLowerCase());
          return {
            key: typeKey(singular),
            label: capitalize(singular),
            plural: capitalize(f.folder),
            folder: f.folder,
            ...(reference ? { countsAsContent: false, collapsedByDefault: true } : {}),
          };
        })
      : [{ key: "pagina", label: "Página", plural: "Páginas" }];

  const root = opts.configDir
    ? toPosix(path.relative(path.resolve(opts.configDir), wikiRoot)) || "."
    : path.basename(wikiRoot);

  const slug = opts.slug ?? inferSlug(wikiRoot);

  return {
    contract: 1,
    slug,
    name: TODO,
    code: TODO,
    institution: TODO,
    semester: TODO,
    division: label,
    divisions,
    pageTypes,
    rail: [],
    fab: null,
    wiki: {
      root,
      ...(survey.indexFile ? { index: survey.indexFile } : {}),
      ...(survey.logFile ? { log: survey.logFile } : {}),
      ignore: [],
      divisionField: survey.divisionField,
      // Material de estudio: relativo al config, no al wiki (ver `study.ts`).
      study: "estudio",
    },
  };
}

/** Campos que `init` deja como placeholder y el usuario debe completar. */
export function pendingFields(config: SubjectConfigInput): string[] {
  const pending: string[] = [];
  for (const field of ["name", "code", "institution", "semester"] as const) {
    if (config[field] === TODO) pending.push(field);
  }
  return pending;
}

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

function divisionLabelFor(field: string): DivisionLabel {
  return DIVISION_LABELS[fold(field)] ?? DIVISION_LABELS["division"]!;
}

function inferSlug(wikiRoot: string): string {
  const parent = normalizeSlug(path.basename(path.dirname(wikiRoot)));
  if (parent) return parent;
  return normalizeSlug(path.basename(wikiRoot)) || "materia";
}

function typeKey(singular: string): string {
  const base = fold(singular)
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
  if (base === "") return "pagina";
  return /^[a-z]/.test(base) ? base : `t-${base}`.slice(0, 32);
}

/** Consonantes que en español piden plural en `-es` (papel→papeles, unidad→unidades). */
const PLURAL_ES = new Set(["l", "r", "n", "d", "z", "j", "y"]);

/** Singularización simple del español. Suficiente para nombres de carpeta. */
export function singularizeEs(word: string): string {
  if (word.length <= 3) return word;
  if (/ones$/i.test(word)) return `${word.slice(0, -4)}on`;
  if (/ces$/i.test(word)) return `${word.slice(0, -3)}z`;
  if (/es$/i.test(word)) {
    const stem = word.slice(0, -2);
    const last = stem.slice(-1).toLowerCase();
    return PLURAL_ES.has(last) ? stem : word.slice(0, -1);
  }
  if (/s$/i.test(word)) return word.slice(0, -1);
  return word;
}

function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function toPosix(p: string): string {
  return p.split(path.sep).join("/");
}

/** `true` si la ruta existe y es un directorio. */
export async function isDirectory(target: string): Promise<boolean> {
  try {
    return (await stat(target)).isDirectory();
  } catch {
    return false;
  }
}
