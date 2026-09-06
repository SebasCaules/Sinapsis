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
import { compileWiki } from "./compile.js";

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
 * Las dos páginas meta de la raíz son la única divergencia deliberada: `build.py`
 * les pone un título fijo ("Índice del wiki" / "Registro (log)") y el compilador
 * TypeScript aplica la misma regla que a todas las demás (frontmatter → H1 → slug).
 */
const TITLE_EXCEPTIONS = new Set(["indice", "log"]);

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

      if (g.headings.length !== e.headings.length) {
        diffs.push(`${slug}: headings ${g.headings.length} ≠ ${e.headings.length}`);
      }
      if (g.links.length !== e.links.length) {
        diffs.push(`${slug}: links ${g.links.length} ≠ ${e.links.length}`);
      }

      const tolerance = Math.max(2, Math.ceil(e.words * 0.02));
      if (Math.abs(g.words - e.words) > tolerance) {
        diffs.push(`${slug}: words ${g.words} ≠ ${e.words} (tolerancia ±${tolerance})`);
      }
    }

    expect(diffs.slice(0, 20).join("\n")).toBe("");
    expect(diffs).toHaveLength(0);
  });

  it("reproduce los ids de encabezado y el cuerpo crudo", async () => {
    const expected = readPythonOutput();
    const { payload } = await compileWiki({ configPath: CONFIG, wikiRoot: WIKI });

    const diffs: string[] = [];
    for (const page of payload.pages) {
      const e = expected.get(page.slug);
      if (!e) continue;
      if (page.body !== e.body) diffs.push(`${page.slug}: body`);
      page.headings.forEach((h, i) => {
        const expectedHeading = e.headings[i];
        if (!expectedHeading) return;
        if (h.id !== expectedHeading.id || h.text !== expectedHeading.text || h.level !== expectedHeading.level) {
          diffs.push(`${page.slug}: heading[${i}] ${JSON.stringify(h)} ≠ ${JSON.stringify(expectedHeading)}`);
        }
      });
    }
    expect(diffs.slice(0, 20).join("\n")).toBe("");
  });

  it("solo levanta advertencias por wikilinks realmente rotos", async () => {
    const { issues } = await compileWiki({ configPath: CONFIG, wikiRoot: WIKI });
    const kinds = new Set(issues.map((i) => i.kind));
    expect([...kinds].sort()).toEqual(["broken-link"]);
  });
});
