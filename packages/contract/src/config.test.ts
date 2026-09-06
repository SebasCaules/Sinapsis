/**
 * Tests del contrato: el config de ejemplo de Proba valida, y los helpers de
 * nomenclatura y color de división se comportan según la decisión N0-12
 * (N ≤ 9 → escala heráldica `--u1…--u9`; N > 9 → barrido oklch).
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  DIVISION_NONE,
  SubjectConfig,
  divisionColor,
  divisionLong,
  divisionShort,
  numberedIndex,
  type SubjectConfig as SubjectConfigType,
} from "./index.js";
import { typeColor } from "./index.js";

const EXAMPLE = path.resolve(
  fileURLToPath(new URL("../../../examples/proba/sinapsis.config.json", import.meta.url)),
);

const proba: SubjectConfigType = SubjectConfig.parse(
  JSON.parse(readFileSync(EXAMPLE, "utf8")) as unknown,
);

/** Materia con 14 semanas: fuerza el barrido oklch (N > 9). */
const semanal: SubjectConfigType = SubjectConfig.parse({
  slug: "sistemas",
  name: "Sistemas Operativos",
  code: "72.11",
  institution: "ITBA",
  division: { singular: "Semana", abbr: "S", plural: "Semanas" },
  divisions: [
    ...Array.from({ length: 14 }, (_, i) => ({
      key: `s${String(i + 1).padStart(2, "0")}`,
      name: `Semana ${i + 1}`,
    })),
    { key: "extra", name: "Anexos", kind: "extra" },
  ],
  pageTypes: [{ key: "apunte", label: "Apunte", plural: "Apuntes", folder: "apuntes" }],
});

describe("examples/proba/sinapsis.config.json", () => {
  it("valida contra SubjectConfig", () => {
    expect(proba.slug).toBe("proba");
    expect(proba.contract).toBe(1);
    expect(proba.divisions).toHaveLength(11);
    expect(proba.pageTypes).toHaveLength(6);
    expect(proba.wiki.divisionField).toBe("unidad");
    expect(proba.wiki.root).toBe("wiki");
  });

  it("aplica los valores por defecto del esquema", () => {
    const fuentes = proba.pageTypes.find((t) => t.key === "fuente")!;
    expect(fuentes.countsAsContent).toBe(false);
    expect(fuentes.collapsedByDefault).toBe(true);
    const concepto = proba.pageTypes.find((t) => t.key === "concepto")!;
    expect(concepto.countsAsContent).toBe(true);
    expect(proba.divisions[0]!.kind).toBe("numbered");
    expect(proba.divisions.find((d) => d.key === "0")!.kind).toBe("extra");
    expect(proba.fab).toBeNull();
  });

  it("no declara claves de división ni de tipo repetidas", () => {
    expect(new Set(proba.divisions.map((d) => d.key)).size).toBe(proba.divisions.length);
    expect(new Set(proba.pageTypes.map((t) => t.key)).size).toBe(proba.pageTypes.length);
  });

  it("rechaza un config sin los campos obligatorios", () => {
    const broken = SubjectConfig.safeParse({ ...proba, slug: "Proba Mal", divisions: [] });
    expect(broken.success).toBe(false);
    const paths = broken.success ? [] : broken.error.issues.map((i) => i.path.join("."));
    expect(paths).toEqual(expect.arrayContaining(["slug", "divisions"]));
  });
});

describe("helpers de división — config de Proba (N = 9 numeradas)", () => {
  it("numera solo las divisiones numeradas", () => {
    expect(numberedIndex(proba, "1")).toBe(1);
    expect(numberedIndex(proba, "9")).toBe(9);
    expect(numberedIndex(proba, "0")).toBeNull();
    expect(numberedIndex(proba, "eval")).toBeNull();
  });

  it("divisionShort", () => {
    expect(divisionShort(proba, "1")).toBe("U1");
    expect(divisionShort(proba, "9")).toBe("U9");
    // Las extra usan su nombre, recortado si pasa de 8 caracteres.
    expect(divisionShort(proba, "0")).toBe("Comple.");
    expect(divisionShort(proba, "eval")).toBe("Evalua.");
    expect(divisionShort(proba, DIVISION_NONE)).toBe("Transv.");
  });

  it("divisionLong", () => {
    expect(divisionLong(proba, "4")).toBe("Unidad 4 · Variables Aleatorias Continuas");
    expect(divisionLong(proba, "0")).toBe("Complementos Matemáticos");
    expect(divisionLong(proba, DIVISION_NONE)).toBe("Transversales (toda la materia)");
  });

  it("divisionColor usa la escala heráldica y respeta el color fijo", () => {
    expect(divisionColor(proba, "1")).toBe("var(--u1)");
    expect(divisionColor(proba, "9")).toBe("var(--u9)");
    // Extra sin color propio → gris.
    expect(divisionColor(proba, "0")).toBe("var(--u0)");
    // Extra con color declarado → ese token.
    expect(divisionColor(proba, "eval")).toBe("var(--ueval)");
    // División inexistente → gris.
    expect(divisionColor(proba, "no-existe")).toBe("var(--u0)");
  });
});

describe("helpers de división — 14 semanas (N > 9 → oklch)", () => {
  it("mantiene la nomenclatura de la materia", () => {
    expect(divisionShort(semanal, "s01")).toBe("S1");
    expect(divisionShort(semanal, "s14")).toBe("S14");
    expect(divisionLong(semanal, "s07")).toBe("Semana 7 · Semana 7");
    expect(divisionShort(semanal, "extra")).toBe("Anexos");
  });

  it("barre el matiz en oklch con L y C fijos", () => {
    const n = 14;
    const hue = (i: number) => Math.round(162 + i * (320 / n));

    expect(divisionColor(semanal, "s01")).toBe(`oklch(0.52 0.095 ${hue(0)})`);
    expect(divisionColor(semanal, "s07")).toBe(`oklch(0.52 0.095 ${hue(6)})`);
    expect(divisionColor(semanal, "s14")).toBe(`oklch(0.52 0.095 ${hue(13)})`);

    // Modo oscuro: sube la luminosidad y baja el croma.
    expect(divisionColor(semanal, "s01", true)).toBe(`oklch(0.74 0.085 ${hue(0)})`);

    // Las extra no participan del barrido.
    expect(divisionColor(semanal, "extra")).toBe("var(--u0)");
  });

  it("da un color distinto a cada semana", () => {
    const colors = semanal.divisions
      .filter((d) => d.kind !== "extra")
      .map((d) => divisionColor(semanal, d.key));
    expect(new Set(colors).size).toBe(14);
  });
});

describe("typeColor", () => {
  const cfg = {
    pageTypes: [
      { key: "concepto", label: "Concepto", plural: "Conceptos", countsAsContent: true, collapsedByDefault: false },
      { key: "tecnica", label: "Técnica", plural: "Técnicas", countsAsContent: true, collapsedByDefault: false, color: "--u1" },
      { key: "fuente", label: "Fuente", plural: "Fuentes", countsAsContent: false, collapsedByDefault: true },
    ],
  };
  it("usa el color declarado, la paleta por posición y gris para lo que no cuenta", () => {
    expect(typeColor(cfg, "concepto")).toBe("var(--u2)");
    expect(typeColor(cfg, "tecnica")).toBe("var(--u1)");
    expect(typeColor(cfg, "fuente")).toBe("var(--u0)");
    expect(typeColor(cfg, "desconocido")).toBe("var(--u0)");
  });
});
