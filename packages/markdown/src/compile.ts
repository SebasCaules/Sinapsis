/**
 * Compilador del wiki: de archivos markdown a `Page[]` y `SyncPayload`.
 *
 * Reimplementa el contrato de `build.py` (la app de Proba) sobre el esquema de
 * `@sinapsis/contract`: `unidad→division`, `tipo→type`, `resumen→summary`,
 * `fuentes→sources`, `actualizado→updatedAt`.
 */
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import {
  DIVISION_NONE,
  META_PAGES,
  PAGE_TYPE_META,
  Page,
  SubjectConfig,
  SyncPayload,
  fold,
  isValidDivisionKey,
  isValidSlug,
  normalizeDivisionKey,
  normalizeSlug,
  type Page as PageType,
  type StudyContent as StudyContentType,
  type SubjectConfig as SubjectConfigType,
  type SyncPayload as SyncPayloadType,
} from "@sinapsis/contract";
import {
  capAssets,
  formatBytes,
  readAssetIndex,
  resolvePageAssets,
  type WikiAsset,
} from "./assets.js";
import { parseFrontmatter } from "./frontmatter.js";
import { countWords, extractHeadings, extractLinks, firstH1Line, normalizeDisplayMath } from "./inline.js";
import { compileStudy, isEmptyStudy } from "./study.js";
import { PACKAGE_VERSION } from "./version.js";

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
  | "nested-folder"
  // Adjuntos de imagen (`assets.ts`, N0-nn).
  | "asset-missing"
  | "asset-outside"
  | "asset-too-big"
  | "asset-unsupported"
  | "asset-index-invalid"
  // Material de estudio (`wiki.study`, ver `study.ts`).
  | "study-invalid"
  | "study-empty"
  | "study-duplicate-id"
  | "study-broken-ref"
  | "quiz-few-options"
  | "quiz-no-correct";

export interface CompileIssue {
  kind: IssueKind;
  /**
   * Slug (o nombre de archivo) de la página afectada. En las advertencias del
   * material de estudio, el archivo o el objeto afectado ("kits.json · final").
   */
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
  const { meta, body: rawBody } = parseFrontmatter(text);

  // --- slug -----------------------------------------------------------------
  let slug = input.slug;
  if (!isValidSlug(slug)) {
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
  if (type !== PAGE_TYPE_META && !config.pageTypes.some((t) => t.key === type)) {
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
    } else if (isValidDivisionKey(raw)) {
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
  const h1 = firstH1Line(rawBody);
  const title = scalar(meta, "titulo", "title") || h1?.text || capitalize(slug.replace(/-/g, " "));

  // El shell ya dibuja el título de la página: un H1 que solo lo repite sería un
  // segundo encabezado idéntico. Se recorta del cuerpo (y del índice de
  // encabezados) tanto si el título salió de ese H1 como si lo iguala.
  // Los `$$` de display van en líneas propias: es lo único que remark-math lee
  // igual que el baseline (ver `normalizeDisplayMath`).
  const body = normalizeDisplayMath(
    h1 && sameHeading(h1.text, title) ? dropLine(rawBody, h1.line) : rawBody,
  );

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
  if (summary === "" && type !== PAGE_TYPE_META) {
    issues.push({ kind: "missing-summary", page: slug, detail: "" });
  }

  const format = scalar(meta, "formato", "format").slice(0, 40);
  const hubRaw = scalar(meta, "hub").trim().toLowerCase();
  const hub = hubRaw === "true" || hubRaw === "sí" || hubRaw === "si" || hubRaw === "yes" || hubRaw === "1";
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
    ...(hub ? { hub } : {}),
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
    } else if (!isValidSlug(slug)) {
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
// Recorte del H1 que repite el título
// ---------------------------------------------------------------------------

/**
 * ¿Son el mismo encabezado? Se comparan plegando acentos y mayúsculas (`fold`)
 * y sin las marcas de énfasis de markdown, así `# **Título**` iguala a `Título`.
 */
function sameHeading(a: string, b: string): boolean {
  const strip = (t: string) => fold(t).replace(/[*_`]/g, "").trim();
  const left = strip(a);
  return left !== "" && left === strip(b);
}

/** Separadores de línea de `splitLines`, como grupo de captura para `String.split`. */
const LINE_BREAK = /(\r\n|[\n\r\v\f\x1c\x1d\x1e\x85\u2028\u2029])/;

/**
 * Devuelve el texto sin la línea `index` (y sin la línea en blanco que le siga).
 * Trabaja sobre los separadores originales para no reescribir los saltos de
 * línea del resto del cuerpo.
 */
function dropLine(text: string, index: number): string {
  // `split` con grupo de captura intercala línea, separador, línea, separador…
  const parts = text.split(LINE_BREAK);
  const at = index * 2;
  if (parts[at] === undefined) return text;
  const drop = new Set([at, at + 1]);
  const next = at + 2;
  if ((parts[next] ?? "x").trim() === "") drop.add(next).add(next + 1);
  return parts.filter((_, i) => !drop.has(i)).join("");
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
  /**
   * Material de estudio compilado (`wiki.study`). Siempre presente, aunque esté
   * vacío; `payload.study` lo lleva solo cuando hay algo que enviar.
   */
  study: StudyContentType;
  /** Carpeta del material de estudio, resuelta contra el config (absoluta). */
  studyDir: string;
  /**
   * Adjuntos de imagen que las páginas referencian, sin repetir y ya dentro del
   * tope de la materia. Vacío cuando el wiki no tiene imágenes, que es el caso
   * de toda materia anterior a N0-nn.
   */
  assets: WikiAsset[];
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
  // `--wiki` (opts.wikiRoot) es un flag del usuario y se confía; `config.wiki.root` viene
  // del config de la materia y debe quedar dentro de la carpeta del config.
  if (!opts.wikiRoot && !isInside(rootDir, wikiRoot)) {
    throw new Error(`wiki.root: "${config.wiki.root}" queda fuera de la carpeta del config`);
  }

  const issues: CompileIssue[] = [];
  /** Destinos de wikilink que hubo que normalizar: slug normalizado → texto original. */
  const linkOriginals = new Map<string, string>();
  const pages: PageType[] = [];
  const bySlug = new Map<string, string>();
  /** Carpeta en disco de cada página emitida: contra ella resuelve `![](…)`. */
  const pageDirs = new Map<string, string>();

  const push = (page: PageType, origin: string, dir: string) => {
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
    pageDirs.set(page.slug, dir);
    pages.push(page);
  };

  // --- carpetas de contenido ------------------------------------------------
  // La E/S de cada carpeta va en paralelo; la compilación, después y en orden,
  // para que `pages` e `issues` no dependan de qué lectura terminó primero.
  const ignore = new Set(config.wiki.ignore);
  const folders = await listFolders(wikiRoot, ignore, config);
  const folderContents = await Promise.all(
    folders.map(async (folder) => {
      const dir = path.join(wikiRoot, folder);
      const entries = await readdir(dir, { withFileTypes: true });
      const names = entries
        .filter((e) => e.isFile() && e.name.endsWith(".md"))
        .map((e) => e.name)
        .sort((a, b) => a.localeCompare(b, "en"));
      const nested = entries.filter((e) => e.isDirectory() && !e.name.startsWith(".")).map((e) => e.name);
      const files = await Promise.all(
        names.map(async (name) => ({ name, text: await readFile(path.join(dir, name), "utf8") })),
      );
      return { folder, nested, files };
    }),
  );

  for (const { folder, nested, files } of folderContents) {
    for (const sub of nested) {
      issues.push({
        kind: "nested-folder",
        page: `${folder}/${sub}`,
        detail: "las subcarpetas no se recorren (solo el primer nivel de cada carpeta)",
      });
    }

    for (const { name, text } of files) {
      const page = compilePage({
        slug: name.slice(0, -3),
        folder,
        text,
        config,
        issues,
        linkOriginals,
      });
      push(page, `${folder}/${name}`, path.join(wikiRoot, folder));
    }
  }

  // --- páginas meta de la raíz ---------------------------------------------
  const rootPages: Array<[file: string | undefined, slug: string, field: string]> = [
    [config.wiki.index, META_PAGES.index, "index"],
    [config.wiki.log, META_PAGES.log, "log"],
  ];
  const rootTexts = await Promise.all(
    rootPages.map(async ([file, , field]) => {
      if (!file) return null;
      const full = path.resolve(wikiRoot, file);
      // Defensa en profundidad además del esquema: nunca leer fuera del wiki.
      if (!isInside(wikiRoot, full)) {
        throw new Error(`wiki.${field}: la ruta "${file}" queda fuera de la carpeta del wiki`);
      }
      return readFileOrNull(full);
    }),
  );
  rootPages.forEach(([file, slug], i) => {
    const text = rootTexts[i];
    if (!file || text === null || text === undefined) return;
    const page = compilePage({
      slug,
      folder: PAGE_TYPE_META,
      text,
      config,
      defaultType: PAGE_TYPE_META,
      division: DIVISION_NONE,
      issues,
      linkOriginals,
    });
    push(page, file, path.dirname(path.resolve(wikiRoot, file)));
  });

  // --- adjuntos de imagen (N0-nn) -------------------------------------------
  // La raíz de la contención es la carpeta del CONFIG, no la del wiki: un vault
  // de Obsidian guarda los adjuntos fuera de `wiki/` (`../../assets/x.png`), y
  // esa es justamente la forma que hay que reconocer.
  const assetIndex = await readAssetIndex(rootDir);
  const knownAssets = new Map<string, WikiAsset>();
  /** Nombre publicado → páginas que lo referencian, para poder nombrarlas al avisar. */
  const assetPages = new Map<string, string[]>();
  for (let i = 0; i < pages.length; i += 1) {
    const page = pages[i];
    if (page === undefined) continue;
    const dir = pageDirs.get(page.slug);
    if (dir === undefined) continue;
    const { assets: pageAssets, issues: assetIssues } = await resolvePageAssets({
      body: page.body,
      pageDir: dir,
      rootDir,
      index: assetIndex,
      known: knownAssets,
    });
    for (const issue of assetIssues) issues.push({ kind: issue.kind, page: page.slug, detail: issue.detail });
    for (const asset of pageAssets) {
      const bucket = assetPages.get(asset.file) ?? [];
      if (!bucket.includes(page.slug)) bucket.push(page.slug);
      assetPages.set(asset.file, bucket);
    }
    if (pageAssets.length > 0) pages[i] = { ...page, assets: pageAssets };
  }
  const { kept: assets, dropped } = capAssets([...knownAssets.values()]);
  if (dropped.length > 0) {
    const droppedFiles = new Set(dropped.map((a) => a.file));
    for (const asset of dropped) {
      // `page` lleva un slug como todas las demás advertencias; el archivo va en
      // el texto, porque el tope que se pasó es el de la materia, no el suyo.
      const refs = assetPages.get(asset.file) ?? [];
      const where = refs.length > 0 ? `; lo referencian: ${sample(refs)}` : "";
      issues.push({
        kind: "asset-too-big",
        page: refs[0] ?? "(materia)",
        detail: `el archivo "${asset.ref}" (${formatBytes(asset.bytes)}) no entra en el tope de la materia${where}`,
      });
    }
    // Un adjunto que no se publica no se referencia: la página conserva el
    // markdown original y el lector lo muestra tal cual.
    for (let i = 0; i < pages.length; i += 1) {
      const page = pages[i];
      if (page === undefined || page.assets.length === 0) continue;
      const keep = page.assets.filter((a) => !droppedFiles.has(a.file));
      if (keep.length !== page.assets.length) pages[i] = { ...page, assets: keep };
    }
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

  // --- material de estudio --------------------------------------------------
  // `wiki.study` es relativa al **config**, no al wiki: el material de estudio
  // es del repositorio de la materia y no se mueve aunque `--wiki` apunte a otro
  // lado (decisión N0-27).
  const studyDir = path.resolve(rootDir, config.wiki.study);
  if (!isInside(rootDir, studyDir)) {
    throw new Error(`wiki.study: "${config.wiki.study}" queda fuera de la carpeta del config`);
  }
  const { study, issues: studyIssues } = await compileStudy({ dir: studyDir, config, pages });
  issues.push(...studyIssues);

  // `study` viaja siempre, aunque esté vacío: el sync reemplaza el material de
  // estudio igual que reemplaza las páginas, así borrar la carpeta lo borra de
  // la plataforma. La ausencia del campo queda reservada para un CLI anterior al
  // Sprint 2, y el API la interpreta como "deje lo que ya tenía".
  const payload: SyncPayloadType = SyncPayload.parse({
    config,
    pages,
    study,
    generatedAt: new Date().toISOString(),
    generator: opts.generator ?? `@sinapsis/markdown ${PACKAGE_VERSION}`,
  });

  return { payload, warnings: formatIssues(issues), issues, wikiRoot, study, studyDir, assets };
}

/**
 * Los archivos del wiki que el compilador lee, como rutas relativas a la raíz
 * del wiki y con barras: `<carpeta>/<archivo>.md` de cada carpeta de primer
 * nivel, más `wiki.index` y `wiki.log` si existen.
 *
 * Es la misma lista que recorre `compileWiki` (mismas carpetas, mismo filtro de
 * `wiki.ignore`, mismo «solo el primer nivel»). La expone el paquete para que
 * `sinapsis publish` copie al repositorio de la plataforma exactamente lo que la
 * plataforma va a compilar, sin una segunda regla que se pueda desincronizar.
 */
export async function listWikiFiles(wikiRoot: string, config: SubjectConfigType): Promise<string[]> {
  const root = path.resolve(wikiRoot);
  const ignore = new Set(config.wiki.ignore);
  const folders = await listFolders(root, ignore, config);

  const out: string[] = [];
  for (const folder of folders) {
    const entries = await readdir(path.join(root, folder), { withFileTypes: true });
    const names = entries
      .filter((e) => e.isFile() && e.name.endsWith(".md"))
      .map((e) => e.name)
      .sort((a, b) => a.localeCompare(b, "en"));
    for (const name of names) out.push(`${folder}/${name}`);
  }

  for (const file of [config.wiki.index, config.wiki.log]) {
    if (!file) continue;
    const full = path.resolve(root, file);
    // La misma contención que `compileWiki`: nunca se copia nada de fuera del wiki.
    if (!isInside(root, full)) continue;
    if (await exists(full)) out.push(path.relative(root, full).split(path.sep).join("/"));
  }
  return out;
}

async function exists(file: string): Promise<boolean> {
  try {
    return (await stat(file)).isFile();
  } catch {
    return false;
  }
}

/** Carpetas de primer nivel con al menos un `.md`, en orden de `pageTypes` y luego alfabético. */
async function listFolders(
  wikiRoot: string,
  ignore: ReadonlySet<string>,
  config: SubjectConfigType,
): Promise<string[]> {
  const entries = await readdir(wikiRoot, { withFileTypes: true });
  const names = entries
    .filter((e) => e.isDirectory() && !e.name.startsWith(".") && !ignore.has(e.name))
    .map((e) => e.name);
  const withMarkdown = await Promise.all(
    names.map(async (name) => {
      const inner = await readdir(path.join(wikiRoot, name), { withFileTypes: true });
      return inner.some((f) => f.isFile() && f.name.endsWith(".md"));
    }),
  );
  const candidates = names.filter((_, i) => withMarkdown[i]);

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

  for (const issue of of("asset-missing")) {
    out.push(`adjunto sin archivo en "${issue.page}": ${issue.detail} (la imagen se deja como está)`);
  }
  for (const issue of of("asset-outside")) {
    out.push(`adjunto fuera de la materia en "${issue.page}": ${issue.detail} (no se publica)`);
  }
  for (const issue of of("asset-too-big")) {
    out.push(`adjunto demasiado grande en "${issue.page}": ${issue.detail}`);
  }
  for (const issue of of("asset-unsupported")) {
    out.push(`adjunto no admitido en "${issue.page}": ${issue.detail} (se deja como está)`);
  }
  for (const issue of of("asset-index-invalid")) {
    out.push(`índice de adjuntos inválido en "${issue.page}": ${issue.detail} (no se publica)`);
  }

  // --- material de estudio --------------------------------------------------
  for (const issue of of("study-invalid")) {
    out.push(`estudio · ${issue.page}: ${issue.detail}`);
  }
  for (const issue of of("study-empty")) {
    out.push(`estudio · ${issue.page}: ${issue.detail}`);
  }
  for (const issue of of("quiz-few-options")) {
    out.push(`estudio · ${issue.page}: ${issue.detail}`);
  }
  for (const issue of of("quiz-no-correct")) {
    out.push(`estudio · ${issue.page}: ${issue.detail}`);
  }
  for (const issue of of("study-duplicate-id")) {
    out.push(`estudio · ${issue.page}: ${issue.detail} repetido`);
  }
  for (const issue of of("study-broken-ref")) {
    out.push(`estudio · referencia rota en ${issue.page}: ${issue.detail}`);
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

/** true si `target` es `base` o está dentro de `base` (tras resolver). */
export function isInside(base: string, target: string): boolean {
  const rel = path.relative(base, target);
  return rel === "" || (!rel.startsWith("..") && !path.isAbsolute(rel));
}
