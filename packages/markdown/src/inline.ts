/**
 * Extracción de wikilinks, encabezados y métricas del cuerpo markdown.
 * Todo replica el comportamiento de `build.py` (ver `docs/contracts/02-paginas.md`).
 */
import { headingId, type PageLink, type PageHeading } from "@sinapsis/contract";

/**
 * Id estable de un encabezado. Dueño único: `headingId` del contrato (lo usan
 * también el API y el lector, así `[[pagina#ancla]]` resuelve siempre igual).
 * Se reexporta con el nombre histórico del compilador.
 */
export { headingId as slugifyAnchor } from "@sinapsis/contract";

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
    headings.push({ level, text, id: headingId(text) });
  }

  return headings;
}

/** Palabras del cuerpo. Paridad con `len(re.findall(r"\w+", body))` de Python. */
export function countWords(body: string): number {
  return (body.match(WORD) ?? []).length;
}

/**
 * Primer encabezado H1 del cuerpo: su texto y el índice de su línea (en la
 * numeración de `splitLines`), o `null`. Lo usa el compilador tanto para
 * deducir el título como para recortar el H1 que solo repite ese título.
 */
export function firstH1Line(body: string): { line: number; text: string } | null {
  const lines = splitLines(body);
  for (let i = 0; i < lines.length; i += 1) {
    const m = (lines[i] ?? "").match(HEADING);
    if (m && (m[1] ?? "").length === 1) return { line: i, text: (m[2] ?? "").trim() };
  }
  return null;
}

/** Primer encabezado H1 del cuerpo, o `null`. */
export function firstH1(body: string): string | null {
  return firstH1Line(body)?.text ?? null;
}

const FENCE = /^\s{0,3}(```|~~~)/;
const DD = /\$\$/g;

function count(re: RegExp, s: string): number {
  return (s.match(re) ?? []).length;
}

/**
 * Normaliza los delimitadores de matemática en display para que remark-math
 * lea lo mismo que el baseline (`renderMathHtml`), que empareja `$$…$$` sin
 * importar dónde caigan los saltos de línea. remark-math en cambio solo abre
 * un bloque si `$$` está solo en su línea:
 *
 *   `$$ f(x)`  al principio de una línea    → cerca de apertura con «meta» y la
 *                                             fórmula se PIERDE; el bloque no
 *                                             cierra nunca y se traga el resto
 *                                             de la página.
 *   `… g(x) $$` al final, con el bloque abierto → no cierra (mismo efecto).
 *   `$$ h(x) $$` en una sola línea           → matemática inline (chica), no
 *                                             display.
 *
 * Se reescriben esas tres formas a `$$` / contenido / `$$` en líneas propias.
 * Fuera de bloques de código; `$$a$$` dentro de una línea con texto alrededor
 * se deja como está (inline doble, igual que en el baseline).
 */
export function normalizeDisplayMath(body: string): string {
  const out: string[] = [];
  let inMath = false;
  let fence: string | null = null;

  for (const line of splitLines(body)) {
    const t = line.trim();
    const f = FENCE.exec(line);
    if (!inMath && f) {
      const mark = f[1] ?? "";
      if (fence === null) fence = mark;
      else if (fence === mark) fence = null;
      out.push(line);
      continue;
    }
    if (fence !== null) {
      out.push(line);
      continue;
    }

    const n = count(DD, t);
    if (!inMath) {
      if (t === "$$") {
        inMath = true;
        out.push(line);
      } else if (t.startsWith("$$") && n === 2 && t.endsWith("$$") && t.length > 4) {
        // `$$ x $$` solo en su línea → bloque display de tres líneas.
        out.push("$$", t.slice(2, -2).trim(), "$$");
      } else if (t.startsWith("$$") && n % 2 === 1) {
        // `$$ x` abre con contenido en la misma línea.
        inMath = true;
        out.push("$$", t.slice(2).trimStart());
      } else {
        out.push(line);
      }
    } else if (t === "$$") {
      inMath = false;
      out.push(line);
    } else if (t.endsWith("$$") && n % 2 === 1) {
      // `x $$` cierra con contenido antes.
      inMath = false;
      out.push(line.replace(/\s*\$\$\s*$/, ""), "$$");
    } else {
      out.push(line);
    }
  }

  return out.join("\n");
}
