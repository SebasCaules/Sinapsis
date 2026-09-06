/**
 * Frontmatter — bloque YAML inicial delimitado por `---`.
 *
 * Paridad con `build.py` de la app de Proba: el bloque se recorta igual
 * (desde el `---` inicial hasta el primer `\n---`), pero el contenido se parsea
 * primero con el paquete `yaml` en modo tolerante y, si eso falla, con el
 * parser manual del script original (listas `[a, b]` y cadenas entre comillas).
 */
import YAML from "yaml";

/** Un wikilink completo, tal como aparece en un valor del frontmatter. */
const WIKILINK_FULL = /^\[\[([^\]]+)\]\]$/;

export interface Frontmatter {
  meta: Record<string, unknown>;
  body: string;
}

/**
 * Separa el bloque YAML inicial del cuerpo markdown.
 * Si el texto no empieza con `---`, devuelve `meta` vacío y el texto completo.
 */
export function parseFrontmatter(text: string): Frontmatter {
  if (!text.startsWith("---")) return { meta: {}, body: text };

  const end = text.indexOf("\n---", 3);
  if (end === -1) return { meta: {}, body: text };

  const raw = stripNewlines(text.slice(3, end));
  const body = text.slice(end + 4).replace(/^\n+/, "");

  const meta = parseYamlTolerant(raw) ?? parseManual(raw);
  return { meta, body };
}

/** Quita saltos de línea al principio y al final (equivale a `strip("\n")` de Python). */
function stripNewlines(s: string): string {
  return s.replace(/^\n+/, "").replace(/\n+$/, "");
}

/**
 * Intenta parsear con `yaml`. Devuelve `null` si el bloque no es un mapa válido
 * (entonces el llamador cae al parser manual).
 */
function parseYamlTolerant(raw: string): Record<string, unknown> | null {
  if (raw.trim() === "") return {};
  let doc;
  try {
    doc = YAML.parseDocument(raw, { version: "1.2", uniqueKeys: false });
  } catch {
    return null;
  }
  if (doc.errors.length > 0) return null;
  let value: unknown;
  try {
    value = doc.toJS({ maxAliasCount: 100 });
  } catch {
    return null;
  }
  if (value === null || typeof value !== "object" || Array.isArray(value)) return null;

  const out: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
    out[String(key).trim()] = normalizeValue(val);
  }
  return out;
}

/** Parser manual de `build.py`: una línea `clave: valor` por entrada. */
function parseManual(raw: string): Record<string, unknown> {
  const meta: Record<string, unknown> = {};
  for (const line of raw.split(/\r\n|\n|\r/)) {
    const trimmedRight = line.replace(/\s+$/, "");
    if (!trimmedRight || trimmedRight.trimStart().startsWith("#")) continue;
    const colon = trimmedRight.indexOf(":");
    if (colon === -1) continue;
    const key = trimmedRight.slice(0, colon).trim();
    const val = trimmedRight.slice(colon + 1).trim();
    if (!key) continue;
    meta[key] = parseScalarOrList(val);
  }
  return meta;
}

/** Parsea un valor del frontmatter manual: lista `[a, b]`, cadena entre comillas o escalar. */
export function parseScalarOrList(val: string): string | string[] {
  if (val === "") return "";
  if (val.startsWith("[") && val.endsWith("]")) {
    const inner = val.slice(1, -1).trim();
    if (!inner) return [];
    const items: string[] = [];
    for (const rawItem of splitTopCommas(inner)) {
      const cleaned = cleanWikilink(stripQuotes(rawItem.trim()));
      if (cleaned) items.push(cleaned);
    }
    return items;
  }
  return stripQuotes(val.trim());
}

/** Divide por comas que no estén dentro de comillas (suficiente para este frontmatter). */
export function splitTopCommas(s: string): string[] {
  const out: string[] = [];
  let cur = "";
  let quote: string | null = null;
  for (const ch of s) {
    if (quote) {
      cur += ch;
      if (ch === quote) quote = null;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
      cur += ch;
    } else if (ch === ",") {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  if (cur) out.push(cur);
  return out;
}

/** `strip('"').strip("'").strip()` de Python: quita comillas envolventes repetidas. */
function stripQuotes(s: string): string {
  return s.replace(/^"+|"+$/g, "").replace(/^'+|'+$/g, "").trim();
}

/** `[[destino|texto]]` → `destino` (sin ancla). Deja intacto cualquier otro valor. */
export function cleanWikilink(value: string): string {
  const m = value.match(WIKILINK_FULL);
  if (!m || m[1] === undefined) return value;
  const target = m[1].split("|")[0] ?? "";
  return (target.split("#")[0] ?? "").trim();
}

/**
 * Normaliza un valor salido de `yaml` al mismo dominio que produce el parser
 * manual: escalares como cadena, listas como `string[]` con los wikilinks
 * reducidos a su slug, y `null`/`undefined` como cadena vacía.
 */
function normalizeValue(val: unknown): unknown {
  if (val === null || val === undefined) return "";
  if (Array.isArray(val)) {
    return val
      .map((item) => cleanWikilink(scalarToString(item).trim()))
      .filter((item) => item !== "");
  }
  if (typeof val === "object") return val;
  return val;
}

function scalarToString(val: unknown): string {
  if (val === null || val === undefined) return "";
  if (val instanceof Date) return val.toISOString().slice(0, 10);
  if (typeof val === "object") return "";
  return String(val);
}
