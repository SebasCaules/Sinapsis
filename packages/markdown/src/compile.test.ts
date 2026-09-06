import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  SubjectConfig,
  normalizeDivisionKey,
  normalizeSlug,
  type SubjectConfig as Cfg,
} from "@sinapsis/contract";
import { compilePage, compileWiki } from "./compile.js";

const config: Cfg = SubjectConfig.parse({
  slug: "demo",
  name: "Materia de prueba",
  code: "00.00",
  institution: "ITBA",
  division: { singular: "Unidad", abbr: "U", plural: "Unidades" },
  divisions: [
    { key: "1", name: "Primera" },
    { key: "2", name: "Segunda" },
    { key: "eval", name: "Evaluaciones", kind: "extra" },
  ],
  pageTypes: [
    { key: "concepto", label: "Concepto", plural: "Conceptos", folder: "conceptos" },
    { key: "fuente", label: "Fuente", plural: "Fuentes", folder: "fuentes", countsAsContent: false },
  ],
  wiki: { root: "wiki", index: "index.md", log: "log.md", divisionField: "unidad" },
});

describe("normalizeSlug / normalizeDivisionKey", () => {
  it("produce un slug válido", () => {
    expect(normalizeSlug("Distribución Normal")).toBe("distribucion-normal");
    expect(normalizeSlug("  ¡Hola!  ")).toBe("hola");
    expect(normalizeSlug("---")).toBe("");
  });

  it("produce una clave de división válida", () => {
    expect(normalizeDivisionKey("Unidad 3")).toBe("unidad-3");
    expect(normalizeDivisionKey("evaluación")).toBe("evaluacion");
  });
});

describe("compilePage", () => {
  const page = (text: string, over: Partial<Parameters<typeof compilePage>[0]> = {}) =>
    compilePage({ slug: "x", folder: "conceptos", text, config, ...over });

  it("mapea el frontmatter al contrato", () => {
    const p = page(
      [
        "---",
        "titulo: Distribución Normal",
        "unidad: 2",
        "orden: 8",
        "resumen: 'La campana.'",
        "formato: apunte",
        "tags: [continua, normal]",
        'fuentes: ["[[teorica-normal]]"]',
        "actualizado: 2026-09-04",
        "---",
        "# H1",
        "Cuerpo con [[otra-pagina]].",
      ].join("\n"),
    );
    expect(p).toMatchObject({
      slug: "x",
      title: "Distribución Normal",
      type: "concepto",
      folder: "conceptos",
      division: "2",
      order: 8,
      summary: "La campana.",
      format: "apunte",
      tags: ["continua", "normal"],
      sources: ["teorica-normal"],
      updatedAt: "2026-09-04",
    });
    expect(p.links).toEqual([{ slug: "otra-pagina" }]);
    expect(p.headings).toEqual([{ level: 1, text: "H1", id: "h1" }]);
    expect(p.body.startsWith("# H1")).toBe(true);
  });

  it("usa el primer H1 y luego el slug como título", () => {
    expect(page("# Desde el H1\n").title).toBe("Desde el H1");
    expect(compilePage({ slug: "dos-palabras", folder: "conceptos", text: "sin nada", config }).title).toBe(
      "Dos palabras",
    );
  });

  it("toma el tipo de la carpeta y lo pisa con el frontmatter", () => {
    expect(page("cuerpo").type).toBe("concepto");
    expect(page("---\ntipo: fuente\n---\ncuerpo").type).toBe("fuente");
  });

  it("marca como transversal la página sin campo de división", () => {
    expect(page("cuerpo").division).toBe("meta");
    expect(page("---\nunidad: ''\n---\ncuerpo").division).toBe("meta");
  });

  it("advierte por división y tipo desconocidos sin descartar la página", () => {
    const issues: Parameters<typeof compilePage>[0]["issues"] = [];
    const p = page("---\nunidad: 7\ntipo: receta\n---\ncuerpo", { issues });
    expect(p.division).toBe("7");
    expect(p.type).toBe("receta");
    expect(issues.map((i) => i.kind)).toEqual(
      expect.arrayContaining(["unknown-division", "unknown-type", "missing-summary"]),
    );
  });

  it("normaliza el slug del archivo y avisa", () => {
    const issues: Parameters<typeof compilePage>[0]["issues"] = [];
    const p = compilePage({ slug: "Distribución Normal", folder: "conceptos", text: "x", config, issues });
    expect(p.slug).toBe("distribucion-normal");
    expect(issues.some((i) => i.kind === "slug-normalized")).toBe(true);
  });

  it("normaliza una división inválida", () => {
    const issues: Parameters<typeof compilePage>[0]["issues"] = [];
    const p = page("---\nunidad: Unidad 1\n---\nx", { issues });
    expect(p.division).toBe("unidad-1");
    expect(issues.some((i) => i.kind === "invalid-division")).toBe(true);
  });

  it("ignora un orden no positivo y avisa", () => {
    const issues: Parameters<typeof compilePage>[0]["issues"] = [];
    expect(page("---\norden: 0\n---\nx", { issues }).order).toBeUndefined();
    expect(issues.some((i) => i.kind === "invalid-order")).toBe(true);
  });

  it("resuelve [[#ancla]] contra la propia página", () => {
    const p = page("ver [[#Sección|acá]]");
    expect(p.links).toEqual([{ slug: "x", anchor: "Sección", text: "acá" }]);
  });

  it("normaliza un destino de wikilink que no es un slug", () => {
    expect(page("ver [[De Morgan]]").links).toEqual([{ slug: "de-morgan" }]);
  });
});

describe("compilePage · H1 que repite el título", () => {
  const page = (text: string) => compilePage({ slug: "x", folder: "conceptos", text, config });
  const fm = (titulo: string) => `---\ntitulo: ${titulo}\nresumen: 'r'\n---\n`;

  it("quita el H1 igual al título (y la línea en blanco que le sigue)", () => {
    const p = page(`${fm("Media Muestral")}# Media Muestral\n\nCuerpo.\n`);
    expect(p.body).toBe("Cuerpo.\n");
    expect(p.headings).toEqual([]);
    expect(p.words).toBe(1);
  });

  it("quita el H1 del que salió el título cuando no hay frontmatter", () => {
    const p = page("# Desde el H1\n\nCuerpo.\n");
    expect(p.title).toBe("Desde el H1");
    expect(p.body).toBe("Cuerpo.\n");
    expect(p.headings).toEqual([]);
  });

  it("iguala el título aunque el H1 lleve formato o acentos distintos", () => {
    expect(page(`${fm("Distribución Normal")}# **Distribución Normal**\n\nCuerpo.\n`).body).toBe("Cuerpo.\n");
    expect(page(`${fm("Distribución Normal")}# Distribucion Normal\n\nCuerpo.\n`).body).toBe("Cuerpo.\n");
  });

  it("conserva un H1 distinto del título", () => {
    const p = page(`${fm("Media Muestral")}# Otra cosa\n\nCuerpo.\n`);
    expect(p.body).toBe("# Otra cosa\n\nCuerpo.\n");
    expect(p.headings).toEqual([{ level: 1, text: "Otra cosa", id: "otra-cosa" }]);
  });

  it("deja intacto el cuerpo sin H1", () => {
    const p = page(`${fm("Media Muestral")}Cuerpo.\n\n## Sección\n`);
    expect(p.body).toBe("Cuerpo.\n\n## Sección\n");
    expect(p.headings).toEqual([{ level: 2, text: "Sección", id: "sección" }]);
  });

  it("solo recorta la línea en blanco inmediata, no el resto del cuerpo", () => {
    const p = page(`${fm("Media")}# Media\nSin línea en blanco.\n`);
    expect(p.body).toBe("Sin línea en blanco.\n");
  });
});

describe("compileWiki", () => {
  let dir = "";

  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), "sinapsis-wiki-"));
    await mkdir(path.join(dir, "wiki", "conceptos"), { recursive: true });
    await mkdir(path.join(dir, "wiki", "fuentes"), { recursive: true });
    await mkdir(path.join(dir, "wiki", "borradores"), { recursive: true });
    await writeFile(
      path.join(dir, "wiki", "conceptos", "media.md"),
      "---\ntitulo: Media\nunidad: 1\nresumen: 'Promedio.'\n---\n# Media\nVer [[varianza]] y [[fantasma]].\n",
    );
    await writeFile(
      path.join(dir, "wiki", "conceptos", "varianza.md"),
      "---\ntitulo: Varianza\nunidad: 1\n---\n# Varianza\n",
    );
    await writeFile(
      path.join(dir, "wiki", "fuentes", "tp1.md"),
      "---\ntitulo: TP 1\nunidad: 1\nresumen: 'Guía.'\nformato: pdf\n---\n# TP1\n",
    );
    await writeFile(path.join(dir, "wiki", "borradores", "wip.md"), "# WIP\n");
    await writeFile(path.join(dir, "wiki", "index.md"), "# Índice\n");
    await writeFile(path.join(dir, "wiki", "log.md"), "# Registro\n");
    await writeFile(
      path.join(dir, "sinapsis.config.json"),
      JSON.stringify({ ...config, wiki: { ...config.wiki, ignore: ["borradores"] } }, null, 2),
    );
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("compila el wiki completo desde el config", async () => {
    const { payload, warnings, issues } = await compileWiki({
      configPath: path.join(dir, "sinapsis.config.json"),
    });

    expect(payload.pages.map((p) => p.slug)).toEqual(["media", "varianza", "tp1", "indice", "log"]);
    expect(payload.config.slug).toBe("demo");
    expect(payload.generator).toContain("@sinapsis/markdown");
    expect(new Date(payload.generatedAt).toString()).not.toBe("Invalid Date");

    // Las páginas meta de la raíz.
    const indice = payload.pages.find((p) => p.slug === "indice")!;
    expect(indice).toMatchObject({ type: "meta", folder: "meta", division: "meta" });

    // La carpeta ignorada no aporta páginas.
    expect(payload.pages.some((p) => p.slug === "wip")).toBe(false);

    // Warnings: wikilink roto y página sin resumen.
    expect(issues.some((i) => i.kind === "broken-link" && i.detail.includes("fantasma"))).toBe(true);
    expect(issues.some((i) => i.kind === "missing-summary" && i.page === "varianza")).toBe(true);
    expect(warnings.join("\n")).toContain("fantasma");
    expect(warnings.join("\n")).toContain('sin "resumen"');
  });

  it("acepta config en memoria y sobreescritura de la raíz del wiki", async () => {
    const { payload } = await compileWiki({
      config,
      rootDir: dir,
      wikiRoot: path.join(dir, "wiki"),
      generator: "@sinapsis/cli 9.9.9",
    });
    // Sin `wiki.ignore`, la carpeta de borradores también entra.
    expect(payload.pages.map((p) => p.slug)).toEqual(["media", "varianza", "tp1", "wip", "indice", "log"]);
    expect(payload.generator).toBe("@sinapsis/cli 9.9.9");
  });

  it("respeta el orden de pageTypes al recorrer las carpetas", async () => {
    const { payload } = await compileWiki({ config, rootDir: dir });
    const folders = payload.pages.map((p) => p.folder);
    expect(folders).toEqual(["conceptos", "conceptos", "fuentes", "borradores", "meta", "meta"]);
  });
});
