/**
 * Sync contra el wiki real de Probabilidad y Estadística.
 *
 * Se saltea entero si el vault no está en esta máquina: el `data.js` que genera
 * `build.py` vive fuera del repo. Sirve de prueba de volumen (209 páginas) y de
 * medición del tiempo del sync.
 */
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Slug, type PageInput, type SearchHit, type SubjectConfigInput, type SyncResult } from "@sinapsis/contract";
import { createHarness, type Harness } from "../test/harness.js";

const DATA_JS = join(homedir(), "Desktop/ITBA/26-1C/Proba_Obsidian/estudio/data.js");
const CONFIG_JSON = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../../../examples/proba/sinapsis.config.json",
);

const available = existsSync(DATA_JS) && existsSync(CONFIG_JSON);

interface RawPage {
  slug: string;
  title: string;
  tipo?: string;
  folder?: string;
  unidad?: string;
  orden?: number;
  resumen?: string;
  formato?: string;
  tags?: string[];
  fuentes?: string[];
  actualizado?: string;
  links?: { slug: string; anchor?: string; text?: string }[];
  headings?: { level: number; text: string; id: string }[];
  body?: string;
  words?: number;
}

/** Lee `window.WIKI = {...};` sin evaluar el archivo. */
function readWiki(): { pages: RawPage[] } {
  const source = readFileSync(DATA_JS, "utf8");
  const marker = "window.WIKI =";
  const start = source.indexOf(marker);
  if (start < 0) throw new Error("data.js no declara window.WIKI");
  const json = source.slice(start + marker.length).trim().replace(/;\s*$/, "");
  return JSON.parse(json) as { pages: RawPage[] };
}

/** Traduce el contrato de `build.py` al `Page` de Sinapsis (docs/CONTRACT.md §3). */
function toPage(raw: RawPage): PageInput {
  const division = (raw.unidad ?? "").trim();
  const links = (raw.links ?? []).filter((link) => Slug.safeParse(link.slug).success);
  return {
    slug: raw.slug,
    title: raw.title,
    type: raw.tipo ?? "concepto",
    folder: raw.folder ?? "",
    division: division.length > 0 ? division : "meta",
    ...(typeof raw.orden === "number" ? { order: raw.orden } : {}),
    summary: raw.resumen ?? "",
    ...(raw.formato ? { format: raw.formato } : {}),
    tags: raw.tags ?? [],
    sources: raw.fuentes ?? [],
    ...(raw.actualizado ? { updatedAt: raw.actualizado } : {}),
    links,
    headings: raw.headings ?? [],
    body: raw.body ?? "",
    words: raw.words ?? 0,
  };
}

describe.skipIf(!available)("sync del wiki real de Proba", () => {
  let h: Harness;

  beforeAll(async () => {
    h = await createHarness();
  });

  afterAll(() => h.close());

  it("sincroniza el wiki completo y lo deja buscable", async () => {
    const config = JSON.parse(readFileSync(CONFIG_JSON, "utf8")) as SubjectConfigInput;
    const pages = readWiki().pages.map(toPage);
    expect(pages.length).toBeGreaterThanOrEqual(190);

    const payload = {
      config,
      pages,
      generatedAt: new Date().toISOString(),
      generator: "@sinapsis/api tests (data.js)",
    };

    const started = performance.now();
    const res = await h.json("PUT", "/api/subjects/proba/sync", payload, {
      authorization: `Bearer ${h.env.SYNC_TOKEN}`,
    });
    const elapsed = performance.now() - started;
    expect(res.status).toBe(200);

    const result = (await res.json()) as SyncResult;
    console.log(
      `[sync real] ${result.pages} páginas · created=${result.created} · ${elapsed.toFixed(0)} ms · ` +
        `${result.warnings.length} warning(s)`,
    );
    expect(result.subject).toBe("proba");
    expect(result.created).toBeGreaterThanOrEqual(190);
    expect(result.deleted).toBe(0);

    await h.login();
    const hits = (await (
      await h.request("/api/subjects/proba/search?q=normal")
    ).json()) as SearchHit[];
    expect(hits.slice(0, 5).map((hit) => hit.slug)).toContain("distribucion-normal");
  });

  it("un segundo sync idéntico no toca nada", async () => {
    const config = JSON.parse(readFileSync(CONFIG_JSON, "utf8")) as SubjectConfigInput;
    const pages = readWiki().pages.map(toPage);

    const started = performance.now();
    const res = await h.json(
      "PUT",
      "/api/subjects/proba/sync",
      { config, pages, generatedAt: new Date().toISOString() },
      { authorization: `Bearer ${h.env.SYNC_TOKEN}` },
    );
    const elapsed = performance.now() - started;
    expect(res.status).toBe(200);

    const result = (await res.json()) as SyncResult;
    console.log(`[sync real · idempotente] ${elapsed.toFixed(0)} ms`);
    expect(result).toMatchObject({ created: 0, updated: 0, deleted: 0 });
  });
});
