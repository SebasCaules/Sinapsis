/**
 * Paridad con `build.py` — el compilador Python del baseline de Proba.
 *
 * Compila el wiki real del vault (solo lectura) con el config de ejemplo del repo
 * y lo compara contra `estudio/data.js`, la salida del script original. El test se
 * saltea si el vault no está en esta máquina.
 *
 * Vault por defecto: `~/Desktop/ITBA/26-1C/Proba_Obsidian`
 * (se puede apuntar a otro con la variable de entorno `SINAPSIS_PROBA_VAULT`).
 */
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { fold } from "@sinapsis/contract";
import { compileWiki } from "./compile.js";
import { countWords, splitLines } from "./inline.js";

const VAULT = process.env["SINAPSIS_PROBA_VAULT"] ?? path.join(homedir(), "Desktop/ITBA/26-1C/Proba_Obsidian");
const DATA_JS = path.join(VAULT, "estudio", "data.js");
const WIKI = path.join(VAULT, "wiki");
const CONFIG = path.resolve(fileURLToPath(new URL("../../../examples/proba/sinapsis.config.json", import.meta.url)));

const available = existsSync(DATA_JS) && existsSync(WIKI) && existsSync(CONFIG);

/** Página tal como la emite `build.py`. */
interface PythonPage {
  slug: string;
  title: string;
  tipo: string;
  folder: string;
  unidad: string;
  orden?: number;
  resumen?: string;
  formato?: string;
  tags: string[];
  fuentes: string[];
  actualizado?: string;
  links: Array<{ slug: string; anchor: string; text: string }>;
  headings: Array<{ level: number; text: string; id: string }>;
  body: string;
  words: number;
}

function readPythonOutput(): Map<string, PythonPage> {
  const raw = readFileSync(DATA_JS, "utf8");
  const json = raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);
  const data = JSON.parse(json) as { pages: PythonPage[] };
  return new Map(data.pages.map((p) => [p.slug, p]));
}

/**
 * Las dos páginas meta de la raíz son una divergencia deliberada de `title`:
 * `build.py` les pone un título fijo ("Índice del wiki" / "Registro (log)") y el
 * compilador TypeScript aplica la misma regla que a todas las demás
 * (frontmatter → H1 → slug).
 */
const TITLE_EXCEPTIONS = new Set(["indice", "log"]);

/**
 * La otra divergencia deliberada (auditoría del Sprint 1, «H1 duplicado»): el
 * shell ya dibuja el título de la página, así que el compilador recorta del
 * cuerpo el primer H1 cuando solo repite ese título. Frente a `build.py` eso
 * significa, y solo para las páginas donde el H1 coincide con el título:
 *
 *  - `headings` tiene un elemento menos (el H1 recortado, siempre el primero);
 *  - `body` no tiene esa línea ni la línea en blanco que la seguía;
 *  - `words` baja en las palabras de esa línea.
 *
 * Todo lo demás (conjunto de páginas, title, type, division, order, links, ids
 * de encabezado y el resto del cuerpo) sigue siendo idéntico byte a byte.
 */
function h1LineIndex(body: string, title: string): number | null {
  const strip = (t: string) => fold(t).replace(/[*_`]/g, "").trim();
  const wanted = strip(title);
  const lines = splitLines(body);
  for (let i = 0; i < lines.length; i += 1) {
    const m = (lines[i] ?? "").match(/^#\s+(.*?)\s*#*$/);
    if (!m) continue;
    return wanted !== "" && strip(m[1] ?? "") === wanted ? i : null;
  }
  return null;
}

/** El cuerpo de `build.py` con el H1 del título recortado, igual que el compilador. */
function withoutTitleH1(body: string, title: string): { body: string; removed: string | null } {
  const at = h1LineIndex(body, title);
  if (at === null) return { body, removed: null };
  const parts = body.split(/(\r\n|[\n\r\v\f\x1c\x1d\x1e\x85\u2028\u2029])/);
  const drop = new Set([at * 2, at * 2 + 1]);
  if ((parts[at * 2 + 2] ?? "x").trim() === "") drop.add(at * 2 + 2).add(at * 2 + 3);
  return {
    body: parts.filter((_, i) => !drop.has(i)).join(""),
    removed: parts[at * 2] ?? "",
  };
}

describe.skipIf(!available)("paridad con build.py (vault de Proba)", () => {
  it("compila el mismo conjunto de páginas con los mismos campos", async () => {
    const expected = readPythonOutput();
    const { payload } = await compileWiki({ configPath: CONFIG, wikiRoot: WIKI });
    const got = new Map(payload.pages.map((p) => [p.slug, p]));

    expect(got.size).toBeGreaterThanOrEqual(200);
    expect([...got.keys()].sort()).toEqual([...expected.keys()].sort());

    const diffs: string[] = [];
    for (const [slug, e] of expected) {
      const g = got.get(slug);
      if (!g) continue;

      if (!TITLE_EXCEPTIONS.has(slug) && g.title !== e.title) {
        diffs.push(`${slug}: title "${g.title}" ≠ "${e.title}"`);
      }
      if (g.type !== e.tipo) diffs.push(`${slug}: type "${g.type}" ≠ "${e.tipo}"`);

      const division = e.unidad === "" ? "meta" : e.unidad;
      if (g.division !== division) diffs.push(`${slug}: division "${g.division}" ≠ "${division}"`);

      if (g.order !== e.orden) diffs.push(`${slug}: order ${g.order} ≠ ${e.orden}`);

      // La única diferencia admitida: el H1 que repetía el título.
      const { removed } = withoutTitleH1(e.body, g.title);
      const expectedHeadings = e.headings.length - (removed === null ? 0 : 1);
      if (g.headings.length !== expectedHeadings) {
        diffs.push(`${slug}: headings ${g.headings.length} ≠ ${expectedHeadings}`);
      }
      if (g.links.length !== e.links.length) {
        diffs.push(`${slug}: links ${g.links.length} ≠ ${e.links.length}`);
      }

      const expectedWords = e.words - (removed === null ? 0 : countWords(removed));
      const tolerance = Math.max(2, Math.ceil(expectedWords * 0.02));
      if (Math.abs(g.words - expectedWords) > tolerance) {
        diffs.push(`${slug}: words ${g.words} ≠ ${expectedWords} (tolerancia ±${tolerance})`);
      }
    }

    expect(diffs.slice(0, 20).join("\n")).toBe("");
    expect(diffs).toHaveLength(0);
  });

  it("reproduce los ids de encabezado y el cuerpo crudo (salvo el H1 del título)", async () => {
    const expected = readPythonOutput();
    const { payload } = await compileWiki({ configPath: CONFIG, wikiRoot: WIKI });

    const diffs: string[] = [];
    let trimmed = 0;
    for (const page of payload.pages) {
      const e = expected.get(page.slug);
      if (!e) continue;
      const { body, removed } = withoutTitleH1(e.body, page.title);
      if (removed !== null) trimmed += 1;
      if (page.body !== body) diffs.push(`${page.slug}: body`);
      // El H1 recortado es siempre el primero, así que el resto se corre uno.
      const offset = removed === null ? 0 : 1;
      page.headings.forEach((h, i) => {
        const expectedHeading = e.headings[i + offset];
        if (!expectedHeading) return;
        if (h.id !== expectedHeading.id || h.text !== expectedHeading.text || h.level !== expectedHeading.level) {
          diffs.push(`${page.slug}: heading[${i}] ${JSON.stringify(h)} ≠ ${JSON.stringify(expectedHeading)}`);
        }
      });
    }
    expect(diffs.slice(0, 20).join("\n")).toBe("");
    // La divergencia es real y masiva: casi todas las páginas repetían el título.
    expect(trimmed).toBeGreaterThan(150);
  });

  it("solo levanta advertencias por wikilinks realmente rotos", async () => {
    const { issues } = await compileWiki({ configPath: CONFIG, wikiRoot: WIKI });
    const kinds = new Set(issues.map((i) => i.kind));
    expect([...kinds].sort()).toEqual(["broken-link"]);
  });
});
