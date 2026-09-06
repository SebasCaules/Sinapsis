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

const FENCE = /^\s{0,3}(`{3,}|~{3,})/;
/** Marcadores de cita (`>`) y sangría que preceden al contenido de una línea. */
const PREFIX = /^(\s*(?:>[ \t]?)*\s*)/;
const DD = /\$\$/g;

/**
 * Normaliza los delimitadores de matemática en display para que remark-math
 * lea lo mismo que el baseline (`renderMathHtml`), que empareja `$$…$$` de a
 * pares, en orden, sin importar dónde caigan los saltos de línea. remark-math
 * en cambio solo abre un bloque si `$$` está solo en su línea:
 *
 *   `$$ f(x)`  al principio de una línea    → cerca de apertura con «meta» y la
 *                                             fórmula se PIERDE; el bloque no
 *                                             cierra nunca y se traga el resto
 *                                             de la página.
 *   `… g(x) $$` al final, con el bloque abierto → no cierra (mismo efecto).
 *   `$$ h(x) $$` en una sola línea           → matemática inline (chica), no
 *                                             display.
 *
 * Se reescriben a `$$` / contenido / `$$` en líneas propias, conservando el
 * prefijo de la línea (marcadores de cita `>` y sangría de lista) para que el
 * bloque siga dentro de la cita o del ítem. Los `$$` se emparejan en orden
 * dentro de la línea (`$$ a $$ b $$` abre, cierra y vuelve a abrir), fuera de
 * bloques de código. `texto $$a$$ texto` (par completo dentro de una línea con
 * texto alrededor) se deja como está: inline doble, igual que en el baseline.
 */
export function normalizeDisplayMath(body: string): string {
  const out: string[] = [];
  let inMath = false;
  /* Prefijo de la línea que abrió el bloque: la cerca de cierre lo repite, no
     el de la línea de continuación (una fórmula sangrada 9 espacios para
     alinearla convertiría el `$$` de cierre en código sangrado y el bloque no
     cerraría nunca). */
  let openPre = "";
  let fence: string | null = null;

  const push = (pre: string, text: string): void => {
    out.push(text ? pre + text : pre.trimEnd());
  };

  /* Reparte los `$$` de `t` (ya sin prefijo) en líneas propias; `pre` es lo que
     antecede al contenido en la línea original. Los `$$` dentro de código en
     línea (`` `$$…$$` ``) no cuentan. */
  const emit = (pre: string, t: string, original: string | null): void => {
    const masked = t.replace(/`+[^`]*`+/g, (m) => "`".repeat(m.length));
    const pos: number[] = [];
    for (const m of masked.matchAll(DD)) pos.push(m.index);
    const n = pos.length;
    if (n === 0) {
      out.push(original ?? pre + t);
      return;
    }
    if (inMath) {
      // Cierra en el PRIMER `$$`; lo que siga es una línea nueva.
      const at = pos[0] ?? 0;
      const before = t.slice(0, at).trimEnd();
      const after = t.slice(at + 2).trim();
      if (before) push(pre, before);
      push(openPre, "$$");
      inMath = false;
      if (after) emit(pre, after, null);
      return;
    }
    if (pos[0] !== 0) {
      if (n % 2 === 0) {
        // `texto $$a$$ texto`: pares completos con texto alrededor, inline doble.
        out.push(original ?? pre + t);
        return;
      }
      // `texto $$ f(x)`: el último `$$` abre un bloque que sigue en otra línea.
      const at = pos[n - 1] ?? 0;
      const before = t.slice(0, at).trimEnd();
      const rest = t.slice(at + 2).trim();
      if (before) push(pre, before);
      push(pre, "$$");
      inMath = true;
      openPre = pre;
      if (rest) push(pre, rest);
      return;
    }
    // Empieza con `$$`: abre; cada `$$` siguiente alterna cierra/abre.
    let open = false;
    for (let k = 0; k < n; k += 1) {
      open = !open;
      push(pre, "$$");
      const from = (pos[k] ?? 0) + 2;
      const to = k + 1 < n ? pos[k + 1] : undefined;
      const seg = t.slice(from, to).trim();
      const last = k === n - 1;
      if (open) {
        if (seg) push(pre, seg);
        if (last) {
          inMath = true;
          openPre = pre;
        }
      } else if (seg) {
        // texto suelto entre un cierre y la próxima apertura (o al final)
        push(pre, seg);
      }
    }
  };

  for (const line of splitLines(body)) {
    const f = FENCE.exec(line);
    if (!inMath && f) {
      const mark = f[1] ?? "";
      if (fence === null) fence = mark;
      else if (mark[0] === fence[0] && mark.length >= fence.length) fence = null;
      out.push(line);
      continue;
    }
    if (fence !== null) {
      out.push(line);
      continue;
    }
    const pre = PREFIX.exec(line)?.[1] ?? "";
    const t = line.slice(pre.length).trimEnd();
    emit(pre, t, line);
  }

  return out.join("\n");
}
