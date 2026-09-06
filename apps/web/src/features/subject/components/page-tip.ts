/**
 * Lógica pura de la tarjeta de vista previa de página (`PageTip`), portada de
 * `tips.js` del baseline de Proba (`App.pageTip` / `App.pageLead`).
 *
 * Acá no hay React ni modelo de materia: solo lectura del DOM (`targetOf`) y
 * recorte de texto. Todo lo que decide QUÉ mostrar vive en `PageTip.tsx`; lo de
 * acá es lo que se puede probar sin montar nada.
 *
 * El texto que sale de estas funciones conserva la matemática entre signos de
 * dólar: quien lo dibuja es `MathText`, no este módulo.
 *
 * El archivo va en kebab-case (`page-tip.ts`, como `route-info.ts`) y no en
 * `pageTip.ts`: en un sistema de archivos que no distingue mayúsculas —el de
 * macOS— ese nombre choca con `PageTip.tsx` y `./components/PageTip` deja de
 * resolver al componente.
 */
import { headingId, type PageHeading } from "@sinapsis/contract";

/** Caracteres del respaldo del resumen (primer párrafo del cuerpo). */
export const MAX_LEAD = 280;
/** Caracteres del párrafo de la sección apuntada por un ancla. */
export const MAX_SEC = 220;

/** Un enlace del shell que apunta a una página de la materia. */
export interface TipTarget {
  el: HTMLElement;
  slug: string;
  /** Ancla dentro de la página (cadena vacía si el enlace no la trae). */
  anchor: string;
}

/**
 * Las CUATRO formas de enlace a una página que reconoce la tarjeta:
 *
 *  1. `<a href="/m/<materia>/p/<slug>[#ancla]">` — el enlace del SPA: wikilinks,
 *     índice, catálogo, backlinks, fuentes, anterior/siguiente, segmentos…
 *  2. `<a href="#/p/<slug>">` — la forma del baseline, que usan los bundles de
 *     herramientas de la materia (N0-41).
 *  3. `[data-go="#/p/<slug>"]` y `[data-nav="#/p/<slug>"]` — ídem, sin `<a>`.
 *  4. `[data-page-tip="<slug>[#ancla]"]` — marca explícita para cualquier nodo.
 */
/**
 * `base` es `import.meta.env.BASE_URL` (termina en `/`): en GitHub Pages el
 * sitio cuelga de `/Sinapsis/` y los `<Link>` del router llevan ese prefijo en
 * el `href`, así que el selector tiene que llevarlo también. Sin esto, la
 * tarjeta funcionaba en desarrollo (`/`) y desaparecía en el sitio publicado.
 */
export function pageRoutePrefix(subject: string, base = "/"): string {
  const root = base.endsWith("/") ? base : `${base}/`;
  return `${root}m/${subject}/p/`;
}

export function tipSelector(subject: string, base = "/"): string {
  return [
    `a[href^="${pageRoutePrefix(subject, base)}"]`,
    'a[href^="#/p/"]',
    '[data-go^="#/p/"]',
    '[data-nav^="#/p/"]',
    "[data-page-tip]",
  ].join(",");
}

/**
 * Quedan fuera:
 *  - la propia tarjeta: sus enlaces no pueden pedir otra;
 *  - el rail, que ya tiene su tooltip propio (`Rail.module.css .tip`) y mostraría
 *    dos a la vez. Se lo identifica por su nombre accesible, el mismo con el que
 *    lo busca la suite e2e (`waitForSubjectShell`);
 *  - lo que viva dentro de un diálogo: la tarjeta flota por encima de ellos y
 *    taparía justo lo que se está eligiendo.
 */
const EXCLUDED = '[data-page-tip-card],nav[aria-label="Secciones de la materia"],[role="dialog"]';

const HASH_PREFIX = "#/p/";

function attr(el: Element, name: string): string {
  return el.getAttribute(name) ?? "";
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * `{el, slug, anchor}` del enlace bajo `node`, o null si no apunta a una página
 * de esta materia. No valida que la página exista: eso lo sabe el modelo.
 */
export function targetOf(node: EventTarget | null, subject: string, base = "/"): TipTarget | null {
  if (!(node instanceof Element)) return null;
  const el = node.closest<HTMLElement>(tipSelector(subject, base));
  if (!el) return null;
  if (el.closest(EXCLUDED)) return null;

  let raw = attr(el, "data-page-tip");
  if (!raw) {
    const href = attr(el, "data-go") || attr(el, "data-nav") || attr(el, "href");
    const routePrefix = pageRoutePrefix(subject, base);
    const prefix = href.startsWith(HASH_PREFIX) ? HASH_PREFIX : href.startsWith(routePrefix) ? routePrefix : "";
    if (!prefix) return null;
    raw = href.slice(prefix.length);
  }

  const clean = (raw.split("?")[0] ?? "").split("#");
  const slug = safeDecode(clean[0] ?? "").trim();
  if (!slug) return null;
  const fromHref = clean[1] ? safeDecode(clean[1]) : "";
  const anchor = (fromHref || attr(el, "data-anchor")).trim();
  return { el, slug, anchor };
}

/**
 * Markdown ligero → texto plano, conservando la matemática entre dólares.
 *
 * La negrita se DESARMA (y no se conserva como en el baseline, que componía la
 * tarjeta con su renderizador de markdown): acá el texto lo dibuja `MathText`,
 * que solo entiende de fórmulas, así que un `**` que sobreviva se leería crudo.
 */
export function plainish(source: string): string {
  if (!source) return "";
  return String(source)
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[\[([^\]|#]+)(?:#[^\]|]+)?\|([^\]]+)\]\]/g, "$2")
    .replace(/\[\[([^\]|#]+)(?:#([^\]|]+))?\]\]/g, (_m, target: string, anchor?: string) => anchor || target)
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Corta en palabra y NUNCA deja un `$` suelto: media fórmula rompe el
 * renderizado de la matemática (en el baseline daba `.katex-error`).
 */
export function clip(source: string, max: number): string {
  if (!source) return "";
  let text = source.trim();
  if (text.length > max) {
    let cut = text.slice(0, max);
    const space = cut.lastIndexOf(" ");
    if (space > max * 0.5) cut = cut.slice(0, space);
    text = `${cut.replace(/[\s,;:.\-–—]+$/, "")}…`;
  }
  const dollars = (text.match(/\$/g) ?? []).length;
  if (dollars % 2 === 1) {
    const last = text.lastIndexOf("$");
    text = `${text.slice(0, last).replace(/[\s,;:.\-–—]+$/, "")}…`;
  }
  return text;
}

/**
 * Primer párrafo «de verdad»: sin títulos, citas, listas, tablas ni cercas.
 *
 * Única diferencia con el baseline: un bloque de matemática de display se salta
 * ENTERO, no solo su línea de apertura. El compilador garantiza que los `$$` van
 * en líneas propias (N0-47), así que la fórmula no se cuela como si fuera prosa.
 */
export function firstPara(body: string): string {
  const lines = String(body ?? "").split("\n");
  const buffer: string[] = [];
  let fence = false;
  let math = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (/^(```|~~~)/.test(trimmed)) {
      fence = !fence;
      continue;
    }
    if (fence) continue;
    if (trimmed === "$$") {
      math = !math;
      continue;
    }
    if (math) continue;
    if (!trimmed) {
      if (buffer.length) break;
      continue;
    }
    if (buffer.length) {
      buffer.push(trimmed);
      continue;
    }
    if (/^#{1,6}\s/.test(trimmed)) continue;
    if (/^(>|\||-{3,}|\*{3,}|!\[|\d+\.\s|[-*+]\s|\$\$)/.test(trimmed)) continue;
    buffer.push(trimmed);
  }
  return buffer.join(" ");
}

/** Quita el rótulo con el que abren muchas páginas del wiki (**En breve.**). */
export function stripLabel(source: string): string {
  return String(source ?? "")
    .replace(/^\*\*\s*(en breve|qué es|que es)\s*[.:]?\s*\*\*\s*[:.]?\s*/i, "")
    .trim();
}

/**
 * El texto de entrada de la tarjeta: el `resumen` del frontmatter y, si está
 * vacío, el primer párrafo del cuerpo sin rótulo y recortado.
 *
 * Sin cuerpo (todavía no llegó del API) devuelve una cadena vacía en vez de
 * inventar nada: la tarjeta se dibuja primero con lo que hay y se completa
 * cuando el cuerpo llega.
 */
export function leadOf(meta: { summary?: string }, body?: string): string {
  const summary = (meta.summary ?? "").trim();
  if (summary) return plainish(summary);
  if (!body) return "";
  return clip(plainish(stripLabel(firstPara(body))), MAX_LEAD);
}

export interface TipSection {
  title: string;
  /** Puede quedar vacío: el ancla existe pero la sección abre con una tabla o una cita. */
  text: string;
}

/**
 * Primer párrafo de la sección apuntada por el ancla.
 *
 * El ancla se compara con `headingId` del contrato (N0-22), que es el mismo
 * algoritmo con el que el compilador numeró `Page.headings[].id` y con el que el
 * wikilink `[[pagina#ancla]]` armó su href. Si el encabezado no aparece en el
 * cuerpo pero sí en el índice de la página, se muestra el título solo.
 */
export function sectionOf(
  body: string,
  headings: readonly PageHeading[],
  anchor: string,
): TipSection | null {
  const wanted = String(anchor ?? "").trim();
  if (!wanted) return null;
  /* El ancla llega de dos formas: YA normalizada (`href="…#proceso-de-conteo"`,
     que la escribió el compilador) o como el texto del encabezado
     (`data-page-tip="pagina#Proceso de conteo"`). `headingId` NO es idempotente
     —borra los guiones antes de poner los suyos—, así que se comparan las dos. */
  const wantedId = headingId(wanted);
  const lines = String(body ?? "").split("\n");

  let fence = false;
  let found = -1;
  let title = "";
  for (let i = 0; i < lines.length; i += 1) {
    const trimmed = (lines[i] ?? "").trim();
    if (/^(```|~~~)/.test(trimmed)) {
      fence = !fence;
      continue;
    }
    if (fence) continue;
    const match = /^(#{2,6})\s+(.+?)\s*$/.exec(trimmed);
    if (!match) continue;
    const text = (match[2] ?? "").replace(/\s*#+\s*$/, "");
    const id = headingId(text);
    if (id === wanted || id === wantedId || text.toLowerCase() === wanted.toLowerCase()) {
      found = i;
      title = text;
      break;
    }
  }

  if (found < 0) {
    const heading = headings.find((h) => h.id === wanted || h.id === wantedId);
    return heading ? { title: heading.text, text: "" } : null;
  }

  const buffer: string[] = [];
  let math = false;
  for (let k = found + 1; k < lines.length; k += 1) {
    const trimmed = (lines[k] ?? "").trim();
    if (/^(```|~~~)/.test(trimmed)) {
      fence = !fence;
      continue;
    }
    if (fence) continue;
    /* Igual que en `firstPara`: la matemática de display no es el párrafo de la
       sección; si la sección abre con una fórmula, queda el título solo. */
    if (trimmed === "$$") {
      math = !math;
      continue;
    }
    if (math) continue;
    if (/^#{1,6}\s/.test(trimmed)) break;
    if (!trimmed) {
      if (buffer.length) break;
      continue;
    }
    if (!buffer.length && /^(>|\||-{3,}|\$\$)/.test(trimmed)) continue;
    buffer.push(trimmed);
  }
  return { title, text: clip(plainish(stripLabel(buffer.join(" "))), MAX_SEC) };
}
