import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { SubjectConfig } from "@sinapsis/contract";
import { inspectWiki, pendingFields, scaffoldConfig, singularizeEs } from "./scaffold.js";

describe("singularizeEs", () => {
  it("singulariza los nombres de carpeta habituales", () => {
    expect(singularizeEs("conceptos")).toBe("concepto");
    expect(singularizeEs("distribuciones")).toBe("distribucion");
    expect(singularizeEs("teoremas")).toBe("teorema");
    expect(singularizeEs("tecnicas")).toBe("tecnica");
    expect(singularizeEs("formularios")).toBe("formulario");
    expect(singularizeEs("fuentes")).toBe("fuente");
    expect(singularizeEs("clases")).toBe("clase");
    expect(singularizeEs("papeles")).toBe("papel");
    expect(singularizeEs("wiki")).toBe("wiki");
  });
});

describe("scaffoldConfig", () => {
  let base = "";
  let wikiDir = "";

  beforeEach(async () => {
    base = await mkdtemp(path.join(tmpdir(), "sinapsis-scaffold-"));
    // La carpeta padre del wiki da el slug de la materia.
    const subject = path.join(base, "Algebra Lineal");
    wikiDir = path.join(subject, "wiki");
    await mkdir(path.join(wikiDir, "conceptos"), { recursive: true });
    await mkdir(path.join(wikiDir, "fuentes"), { recursive: true });
    await writeFile(
      path.join(wikiDir, "conceptos", "matrices.md"),
      "---\ntitulo: Matrices\nsemana: 1\nresumen: 'Qué es.'\n---\n# Matrices\n",
    );
    await writeFile(
      path.join(wikiDir, "conceptos", "determinantes.md"),
      "---\ntitulo: Determinantes\nsemana: 2\n---\n# Determinantes\n",
    );
    await writeFile(
      path.join(wikiDir, "fuentes", "tp1.md"),
      "---\ntitulo: TP 1\nsemana: 1\nresumen: 'Guía.'\n---\n# TP1\n",
    );
    await writeFile(
      path.join(wikiDir, "fuentes", "final.md"),
      "---\ntitulo: Final\nsemana: eval\nresumen: 'Modelo.'\n---\n# Final\n",
    );
    await writeFile(path.join(wikiDir, "index.md"), "# Índice\n");
  });

  afterEach(async () => {
    await rm(base, { recursive: true, force: true });
  });

  it("detecta el campo de división y su nomenclatura", async () => {
    const survey = await inspectWiki(wikiDir);
    expect(survey.divisionField).toBe("semana");
    expect(survey.divisionFieldHits).toBe(4);
    expect(survey.divisions.map((d) => d.key)).toEqual(["1", "2", "eval"]);
    expect(survey.indexFile).toBe("index.md");
    expect(survey.logFile).toBeUndefined();
    expect(survey.withoutSummary).toBe(1);
  });

  it("produce un config válido contra el contrato", async () => {
    const draft = await scaffoldConfig({ wikiDir, configDir: path.dirname(wikiDir) });
    const parsed = SubjectConfig.parse(draft);

    expect(parsed.slug).toBe("algebra-lineal");
    expect(parsed.division).toEqual({ singular: "Semana", abbr: "S", plural: "Semanas" });
    expect(parsed.divisions).toEqual([
      { key: "1", name: "Semana 1", kind: "numbered" },
      { key: "2", name: "Semana 2", kind: "numbered" },
      { key: "eval", name: "Eval", kind: "extra" },
    ]);
    expect(parsed.pageTypes.map((t) => [t.key, t.label, t.plural, t.folder])).toEqual([
      ["concepto", "Concepto", "Conceptos", "conceptos"],
      ["fuente", "Fuente", "Fuentes", "fuentes"],
    ]);
    expect(parsed.pageTypes[1]!.countsAsContent).toBe(false);
    expect(parsed.wiki).toMatchObject({ root: "wiki", index: "index.md", divisionField: "semana" });
    expect(parsed.rail).toEqual([]);
    expect(parsed.fab).toBeNull();
  });

  it("marca los campos que el usuario debe completar", async () => {
    const draft = await scaffoldConfig({ wikiDir, slug: "alglin" });
    expect(draft.slug).toBe("alglin");
    expect(pendingFields(draft).sort()).toEqual(["code", "institution", "name", "semester"]);
  });
});
