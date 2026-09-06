/**
 * Extracción de wikilinks, encabezados y métricas del cuerpo markdown.
 * Todo replica el comportamiento de `build.py` (ver `docs/CONTRACT.md` §3).
 */
import type { PageLink, PageHeading } from "@sinapsis/contract";

const WIKILINK = /\[\[([^\]]+)\]\]/g;
const HEADING = /^(#{1,4})\s+(.*?)\s*#*$/;
const WORD = /[\p{L}\p{N}_]+/gu;

/** Corta un texto en líneas del mismo modo que `str.splitlines()` de Python. */
export function splitLines(text: string): string[] {
  return text.split(/\r\n|[\n\r\v\f\x1c\x1d\x1e\x85\u2028\u2029]/);
}

/**
 * Wikilinks salientes: `[[slug]]`, `[[slug|texto]]`, `[[slug#ancla|texto]]`.
 *
 * - Desescapa `\|` (los pipes escapados de las tablas de Obsidian).
 * - Deduplica por la terna `(slug, anchor, text)`.
 * - Devuelve el slug **tal como está escrito**; normalizarlo contra los slugs
 *   reales de la materia es tarea de `compilePage`.
 */
export function extractLinks(body: string): PageLink[] {
  const links: PageLink[] = [];
  const seen = new Set<string>();

  for (const match of body.matchAll(WIKILINK)) {
    const inner = (match[1] ?? "").replace(/\\\|/g, "|");
    const pipe = inner.indexOf("|");
    const rawTarget = pipe === -1 ? inner : inner.slice(0, pipe);
    const text = pipe === -1 ? "" : inner.slice(pipe + 1).trim();
    const target = rawTarget.trim().replace(/\\+$/, "").trim();

    const hash = target.indexOf("#");
    const slug = (hash === -1 ? target : target.slice(0, hash)).trim();
    const anchor = (hash === -1 ? "" : target.slice(hash + 1)).trim();

    const key = `${slug}\u0000${anchor}\u0000${text}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const link: PageLink = { slug };
    if (anchor) link.anchor = anchor;
    if (text) link.text = text;
    links.push(link);
  }

  return links;
}

/**
 * Tabla de contenidos: encabezados H1..H4.
 * Ignora las líneas dentro de bloques matemáticos `$$…$$` (paridad con `build.py`:
 * un `$$` al principio de línea alterna el estado si aparece una cantidad impar
 * de veces en esa línea).
 */
export function extractHeadings(body: string): PageHeading[] {
  const headings: PageHeading[] = [];
  let inMath = false;

  for (const line of splitLines(body)) {
    const stripped = line.trim();
    if (stripped.startsWith("$$")) {
      const count = (stripped.match(/\$\$/g) ?? []).length;
      if (count % 2 === 1) inMath = !inMath;
      continue;
    }
    if (inMath) continue;

    const m = line.match(HEADING);
    if (!m) continue;
    const level = (m[1] ?? "").length;
    const text = (m[2] ?? "").trim();
    headings.push({ level, text, id: slugifyAnchor(text) });
  }

  return headings;
}

/**
 * Id estable de un encabezado: quita `$math$`, resuelve wikilinks, borra
 * `*_\``, pasa a minúsculas y deja solo `[a-z0-9áéíóúñü]` y guiones.
 * Idéntico a `slugify_anchor` de `build.py`.
 */
export function slugifyAnchor(text: string): string {
  let t = text.replace(/\$[^$]*\$/g, "");
  t = t.replace(/\[\[([^\]|]+)(\|[^\]]+)?\]\]/g, (_m, target: string, alias?: string) =>
    alias ? alias.slice(1) : target,
  );
  t = t.replace(/[*_`]/g, "");
  t = t.toLowerCase().trim();
  t = t.replace(/[^a-z0-9áéíóúñü ]+/g, "");
  t = t.replace(/\s+/g, "-").replace(/^-+|-+$/g, "");
  return t || "h";
}

/** Palabras del cuerpo. Paridad con `len(re.findall(r"\w+", body))` de Python. */
export function countWords(body: string): number {
  return (body.match(WORD) ?? []).length;
}

/** Primer encabezado H1 del cuerpo, o `null`. */
export function firstH1(body: string): string | null {
  for (const line of splitLines(body)) {
    const m = line.match(HEADING);
    if (m && (m[1] ?? "").length === 1) return (m[2] ?? "").trim();
  }
  return null;
}
