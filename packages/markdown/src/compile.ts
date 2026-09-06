/**
 * Compilador del wiki: de archivos markdown a `Page[]` y `SyncPayload`.
 *
 * Reimplementa el contrato de `build.py` (la app de Proba) sobre el esquema de
 * `@sinapsis/contract`: `unidad→division`, `tipo→type`, `resumen→summary`,
 * `fuentes→sources`, `actualizado→updatedAt`.
 */
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import {
  DIVISION_NONE,
  Page,
  SubjectConfig,
  SyncPayload,
  type Page as PageType,
  type SubjectConfig as SubjectConfigType,
  type SyncPayload as SyncPayloadType,
} from "@sinapsis/contract";
import { parseFrontmatter } from "./frontmatter.js";
import { countWords, extractHeadings, extractLinks, firstH1 } from "./inline.js";
import { PACKAGE_VERSION } from "./version.js";

const SLUG_RE = /^[a-z0-9][a-z0-9-]*$/;
const DIVISION_KEY_RE = /^[a-z0-9_-]+$/i;

/** Motivo por el que el compilador levantó una advertencia. */
export type IssueKind =
  | "slug-normalized"
  | "duplicate-slug"
  | "unknown-division"
  | "invalid-division"
  | "unknown-type"
  | "missing-summary"
  | "invalid-order"
  | "broken-link"
  | "nested-folder";

export interface CompileIssue {
  kind: IssueKind;
  /** Slug (o nombre de archivo) de la página afectada. */
  page: string;
  detail: string;
}

export interface CompilePageInput {
  slug: string;
  folder: string;
  text: string;
  config: SubjectConfigType;
  /** Tipo por defecto si el frontmatter no lo declara. Si falta, se deduce de `folder`. */
  defaultType?: string;
  /** Fuerza la división (páginas meta de la raíz del wiki). */
  division?: string;
  /** Sumidero opcional de advertencias estructuradas. */
  issues?: CompileIssue[];
  /**
   * Mapa opcional `slug normalizado → destino tal como está escrito en el wiki`.
   * Sirve para que las advertencias de wikilinks rotos nombren el texto original.
   */
  linkOriginals?: Map<string, string>;
}

// ---------------------------------------------------------------------------
// Normalizadores
// ---------------------------------------------------------------------------

/** Convierte cualquier texto en un `Slug` válido (o cadena vacía si no queda nada). */
export function normalizeSlug(raw: string): string {
  return raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120)
    .replace(/-+$/, "");
}

/** Convierte cualquier texto en una `DivisionKey` válida. */
export function normalizeDivisionKey(raw: string): string {
  return raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^[-_]+|[-_]+$/g, "")
    .slice(0, 24)
    .toLowerCase();
}

// ---------------------------------------------------------------------------
// Lectura del frontmatter
// ---------------------------------------------------------------------------

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

/** Lista del frontmatter; acepta también un escalar separado por comas. */
function list(meta: Record<string, unknown>, ...keys: string[]): string[] {
  for (const key of keys) {
    const value = meta[key];
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      return value.map((item) => String(item).trim()).filter((item) => item !== "");
    }
    if (typeof value === "object") continue;
    const text = String(value).trim();
    if (text === "") continue;
    return text
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");
  }
  return [];
}

function typeForFolder(config: SubjectConfigType, folder: string): string | undefined {
  return config.pageTypes.find((t) => t.folder === folder)?.key;
}

// ---------------------------------------------------------------------------
// compilePage
// ---------------------------------------------------------------------------

/** Compila una página markdown al esquema `Page` del contrato. */
export function compilePage(input: CompilePageInput): PageType {
  const { config, folder, text } = input;
  const issues = input.issues ?? [];
  const { meta, body } = parseFrontmatter(text);

  // --- slug -----------------------------------------------------------------
  let slug = input.slug;
  if (!SLUG_RE.test(slug)) {
    const normalized = normalizeSlug(slug);
    issues.push({
      kind: "slug-normalized",
      page: slug,
      detail: normalized ? `"${slug}" → "${normalized}"` : `"${slug}" no produce un slug válido`,
    });
    slug = normalized || "pagina";
  }

  // --- tipo -----------------------------------------------------------------
  const declaredType = scalar(meta, "tipo", "type");
  let type = declaredType || input.defaultType || typeForFolder(config, folder) || folder || "pagina";
  type = type.slice(0, 32);
  // `meta` está reservado para las páginas índice/registro: la plataforma las conoce.
  if (type !== DIVISION_NONE && !config.pageTypes.some((t) => t.key === type)) {
    issues.push({ kind: "unknown-type", page: slug, detail: `tipo "${type}"` });
  }

  // --- división -------------------------------------------------------------
  let division: string;
  if (input.division !== undefined) {
    division = input.division;
  } else {
    const raw = scalar(meta, config.wiki.divisionField);
    if (raw === "") {
      division = DIVISION_NONE;
    } else if (DIVISION_KEY_RE.test(raw) && raw.length <= 24) {
      division = raw;
    } else {
      const normalized = normalizeDivisionKey(raw);
      issues.push({
        kind: "invalid-division",
        page: slug,
        detail: normalized ? `"${raw}" → "${normalized}"` : `"${raw}" no es una clave de división válida`,
      });
      division = normalized || DIVISION_NONE;
    }
    if (division !== DIVISION_NONE && !config.divisions.some((d) => d.key === division)) {
      issues.push({ kind: "unknown-division", page: slug, detail: `división "${division}"` });
    }
  }

  // --- título ---------------------------------------------------------------
  const title = scalar(meta, "titulo", "title") || firstH1(body) || capitalize(slug.replace(/-/g, " "));

  // --- orden ----------------------------------------------------------------
  let order: number | undefined;
  const rawOrder = scalar(meta, "orden", "order");
  if (rawOrder !== "") {
    const parsed = Number.parseInt(rawOrder, 10);
    if (Number.isFinite(parsed) && parsed > 0) {
      order = parsed;
    } else {
      issues.push({ kind: "invalid-order", page: slug, detail: `orden "${rawOrder}"` });
    }
  }

  // --- resto del frontmatter ------------------------------------------------
  const summary = scalar(meta, "resumen", "summary").slice(0, 1200);
  if (summary === "" && type !== DIVISION_NONE) {
    issues.push({ kind: "missing-summary", page: slug, detail: "" });
  }

  const format = scalar(meta, "formato", "format").slice(0, 40);
  const updatedAt = scalar(meta, "actualizado", "updatedAt", "updated").slice(0, 40);
  const tags = list(meta, "tags").map((t) => t.slice(0, 60));
  const sources = list(meta, "fuentes", "sources").map((s) => s.slice(0, 120));

  // --- cuerpo ---------------------------------------------------------------
  const links = resolveLinks(extractLinks(body), slug, input.linkOriginals);
  const headings = extractHeadings(body).map((h) => ({
    level: h.level,
    text: h.text.slice(0, 300),
    id: h.id.slice(0, 200),
  }));

  return Page.parse({
    slug,
    title: title.slice(0, 200) || slug,
    type,
    folder: folder.slice(0, 64),
    division,
    ...(order !== undefined ? { order } : {}),
    summary,
    ...(format ? { format } : {}),
    tags,
    sources,
    ...(updatedAt ? { updatedAt } : {}),
    links,
    headings,
    body,
    words: countWords(body),
  });
}

/**
 * Adapta los wikilinks crudos al contrato:
 *  - `[[#ancla]]` (enlace interno) apunta a la propia página;
 *  - un destino que no es un `Slug` válido se normaliza igual que el nombre de
 *    archivo del que saldría la página (`[[De Morgan]]` → `de-morgan`), y el
 *    original queda en `originals` para que las advertencias sean rastreables;
 *  - se vuelve a deduplicar por `(slug, anchor, text)` tras la normalización.
 */
function resolveLinks(
  raw: ReturnType<typeof extractLinks>,
  ownSlug: string,
  originals?: Map<string, string>,
) {
  const out: typeof raw = [];
  const seen = new Set<string>();
  for (const link of raw) {
    let slug = link.slug;
    if (slug === "") {
      slug = ownSlug;
    } else if (!SLUG_RE.test(slug)) {
      slug = normalizeSlug(slug) || ownSlug;
      if (originals && !originals.has(slug)) originals.set(slug, link.slug);
    }
    const key = `${slug}\u0000${link.anchor ?? ""}\u0000${link.text ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      slug,
      ...(link.anchor ? { anchor: link.anchor.slice(0, 200) } : {}),
      ...(link.text ? { text: link.text.slice(0, 200) } : {}),
    });
  }
  return out;
}

function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// ---------------------------------------------------------------------------
// compileWiki
// ---------------------------------------------------------------------------

export interface CompileWikiFromConfigPath {
  /** Ruta al `sinapsis.config.json`. La raíz del wiki se resuelve relativa a él. */
  configPath: string;
  /** Sobreescribe `config.wiki.root` (bandera `--wiki` del CLI). */
  wikiRoot?: string;
  /** Identificador de la herramienta que compila; va en `payload.generator`. */
  generator?: string;
}

export interface CompileWikiFromConfig {
  config: SubjectConfigType | unknown;
  /** Directorio contra el que se resuelve `config.wiki.root`. */
  rootDir: string;
  wikiRoot?: string;
  generator?: string;
}

export type CompileWikiOptions = CompileWikiFromConfigPath | CompileWikiFromConfig;

export interface CompileWikiResult {
  payload: SyncPayloadType;
  warnings: string[];
  issues: CompileIssue[];
  /** Raíz del wiki efectivamente recorrida (absoluta). */
  wikiRoot: string;
}

/** Compila un wiki completo y devuelve el `SyncPayload` listo para el API. */
export async function compileWiki(opts: CompileWikiOptions): Promise<CompileWikiResult> {
  let config: SubjectConfigType;
  let rootDir: string;

  if ("configPath" in opts) {
    const configPath = path.resolve(opts.configPath);
    const rawConfig = JSON.parse(await readFile(configPath, "utf8")) as unknown;
    config = SubjectConfig.parse(rawConfig);
    rootDir = path.dirname(configPath);
  } else {
    config = SubjectConfig.parse(opts.config);
    rootDir = path.resolve(opts.rootDir);
  }

  const wikiRoot = opts.wikiRoot ? path.resolve(opts.wikiRoot) : path.resolve(rootDir, config.wiki.root);

  const issues: CompileIssue[] = [];
  /** Destinos de wikilink que hubo que normalizar: slug normalizado → texto original. */
  const linkOriginals = new Map<string, string>();
  const pages: PageType[] = [];
  const bySlug = new Map<string, string>();

  const push = (page: PageType, origin: string) => {
    const previous = bySlug.get(page.slug);
    if (previous !== undefined) {
      issues.push({
        kind: "duplicate-slug",
        page: page.slug,
        detail: `${origin} choca con ${previous}; se conserva la primera`,
      });
      return;
    }
    bySlug.set(page.slug, origin);
    pages.push(page);
  };

  // --- carpetas de contenido ------------------------------------------------
  const ignore = new Set(config.wiki.ignore);
  for (const folder of await listFolders(wikiRoot, ignore, config)) {
    const dir = path.join(wikiRoot, folder);
    const entries = await readdir(dir, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile() && e.name.endsWith(".md"))
      .map((e) => e.name)
      .sort((a, b) => a.localeCompare(b, "en"));
    const nested = entries.filter((e) => e.isDirectory() && !e.name.startsWith(".")).map((e) => e.name);
    for (const sub of nested) {
      issues.push({
        kind: "nested-folder",
        page: `${folder}/${sub}`,
        detail: "las subcarpetas no se recorren (solo el primer nivel de cada carpeta)",
      });
    }

    for (const file of files) {
      const text = await readFile(path.join(dir, file), "utf8");
      const page = compilePage({
        slug: file.slice(0, -3),
        folder,
        text,
        config,
        issues,
        linkOriginals,
      });
      push(page, `${folder}/${file}`);
    }
  }

  // --- páginas meta de la raíz ---------------------------------------------
  const rootPages: Array<[file: string | undefined, slug: string]> = [
    [config.wiki.index, "indice"],
    [config.wiki.log, "log"],
  ];
  for (const [file, slug] of rootPages) {
    if (!file) continue;
    const full = path.resolve(wikiRoot, file);
    const text = await readFileOrNull(full);
    if (text === null) continue;
    const page = compilePage({
      slug,
      folder: DIVISION_NONE,
      text,
      config,
      defaultType: DIVISION_NONE,
      division: DIVISION_NONE,
      issues,
      linkOriginals,
    });
    push(page, file);
  }

  // --- wikilinks rotos ------------------------------------------------------
  const known = new Set(pages.map((p) => p.slug));
  for (const page of pages) {
    const broken = [...new Set(page.links.map((l) => l.slug).filter((s) => !known.has(s)))];
    if (broken.length > 0) {
      const detail = broken
        .map((target) => {
          const original = linkOriginals.get(target);
          return original ? `${target} (escrito "${original}")` : target;
        })
        .join(", ");
      issues.push({ kind: "broken-link", page: page.slug, detail });
    }
  }

  const payload: SyncPayloadType = SyncPayload.parse({
    config,
    pages,
    generatedAt: new Date().toISOString(),
    generator: opts.generator ?? `@sinapsis/markdown ${PACKAGE_VERSION}`,
  });

  return { payload, warnings: formatIssues(issues), issues, wikiRoot };
}

/** Carpetas de primer nivel con al menos un `.md`, en orden de `pageTypes` y luego alfabético. */
async function listFolders(
  wikiRoot: string,
  ignore: ReadonlySet<string>,
  config: SubjectConfigType,
): Promise<string[]> {
  const entries = await readdir(wikiRoot, { withFileTypes: true });
  const candidates: string[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith(".")) continue;
    if (ignore.has(entry.name)) continue;
    const inner = await readdir(path.join(wikiRoot, entry.name), { withFileTypes: true });
    if (!inner.some((f) => f.isFile() && f.name.endsWith(".md"))) continue;
    candidates.push(entry.name);
  }

  const declared = config.pageTypes.map((t) => t.folder).filter((f): f is string => Boolean(f));
  const ordered: string[] = [];
  for (const folder of declared) {
    if (candidates.includes(folder) && !ordered.includes(folder)) ordered.push(folder);
  }
  for (const folder of candidates.sort((a, b) => a.localeCompare(b, "en"))) {
    if (!ordered.includes(folder)) ordered.push(folder);
  }
  return ordered;
}

async function readFileOrNull(file: string): Promise<string | null> {
  try {
    return await readFile(file, "utf8");
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Advertencias legibles
// ---------------------------------------------------------------------------

const MAX_LISTED = 6;

/** Agrupa las advertencias estructuradas en líneas legibles para el CLI. */
export function formatIssues(issues: readonly CompileIssue[]): string[] {
  const out: string[] = [];
  const of = (kind: IssueKind) => issues.filter((i) => i.kind === kind);

  for (const issue of of("slug-normalized")) {
    out.push(`slug normalizado: ${issue.detail}`);
  }
  for (const issue of of("duplicate-slug")) {
    out.push(`slug duplicado "${issue.page}": ${issue.detail}`);
  }
  for (const issue of of("nested-folder")) {
    out.push(`subcarpeta ignorada "${issue.page}": ${issue.detail}`);
  }
  for (const issue of of("invalid-division")) {
    out.push(`división normalizada en "${issue.page}": ${issue.detail}`);
  }
  for (const issue of of("invalid-order")) {
    out.push(`orden inválido en "${issue.page}": ${issue.detail} (se ignora)`);
  }

  const unknownDivisions = groupByDetail(of("unknown-division"));
  for (const [detail, list_] of unknownDivisions) {
    out.push(`${detail} no está en config.divisions — ${list_.length} página(s): ${sample(list_)}`);
  }

  const unknownTypes = groupByDetail(of("unknown-type"));
  for (const [detail, list_] of unknownTypes) {
    out.push(`${detail} no está en config.pageTypes — ${list_.length} página(s): ${sample(list_)}`);
  }

  const missing = of("missing-summary").map((i) => i.page);
  if (missing.length > 0) {
    out.push(`${missing.length} página(s) sin "resumen": ${sample(missing)}`);
  }

  const broken = of("broken-link");
  if (broken.length > 0) {
    const targets = new Set<string>();
    let total = 0;
    for (const issue of broken) {
      const parts = issue.detail.split(", ").filter(Boolean);
      total += parts.length;
      for (const t of parts) targets.add(t);
    }
    out.push(
      `${total} wikilink(s) roto(s) hacia ${targets.size} destino(s) inexistente(s): ${sample([...targets])}`,
    );
    for (const issue of broken) {
      out.push(`  · "${issue.page}" → ${issue.detail}`);
    }
  }

  return out;
}

function groupByDetail(issues: readonly CompileIssue[]): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const issue of issues) {
    const bucket = map.get(issue.detail) ?? [];
    bucket.push(issue.page);
    map.set(issue.detail, bucket);
  }
  return map;
}

function sample(items: readonly string[]): string {
  const head = items.slice(0, MAX_LISTED).join(", ");
  return items.length > MAX_LISTED ? `${head} (+${items.length - MAX_LISTED} más)` : head;
}
