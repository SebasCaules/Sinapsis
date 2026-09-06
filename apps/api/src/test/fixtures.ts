/**
 * Fixtures del Sprint 1: una materia mínima válida (2 divisiones, 2 tipos) y
 * tres páginas con wikilinks entre sí.
 */
import type { PageInput, SubjectConfigInput } from "@sinapsis/contract";

export function demoConfig(overrides: Partial<SubjectConfigInput> = {}): SubjectConfigInput {
  return {
    contract: 1,
    slug: "demo",
    name: "Materia Demo",
    code: "00.01",
    institution: "ITBA",
    color: "--u4",
    semester: "2026-1C",
    division: { singular: "Unidad", abbr: "U", plural: "Unidades" },
    divisions: [
      { key: "1", name: "Primera parte" },
      { key: "2", name: "Segunda parte" },
    ],
    pageTypes: [
      { key: "concepto", label: "Concepto", plural: "Conceptos", folder: "conceptos" },
      {
        key: "fuente",
        label: "Fuente",
        plural: "Fuentes",
        folder: "fuentes",
        countsAsContent: false,
        collapsedByDefault: true,
      },
    ],
    rail: [],
    fab: null,
    wiki: { root: "wiki", index: "index.md", divisionField: "unidad" },
    ...overrides,
  };
}

export const pageIntro: PageInput = {
  slug: "intro",
  title: "Introducción",
  type: "concepto",
  folder: "conceptos",
  division: "1",
  order: 1,
  summary: "Qué estudia la materia.",
  tags: ["basico"],
  sources: ["apunte-clase"],
  updatedAt: "2026-09-01",
  links: [{ slug: "teorema-central", text: "el TCL" }],
  headings: [{ level: 1, text: "Introducción", id: "introduccion" }],
  body: "La introducción explica el muestreo aleatorio y anticipa el TCL.",
  words: 10,
};

export const pageTeorema: PageInput = {
  slug: "teorema-central",
  title: "Teorema Central del Límite",
  type: "concepto",
  folder: "conceptos",
  division: "2",
  order: 1,
  summary: "La suma de variables tiende a la normal.",
  tags: ["tcl"],
  sources: [],
  links: [],
  headings: [{ level: 1, text: "Teorema Central del Límite", id: "tcl" }],
  body: "El teorema central del límite dice que la suma tiende a la campana de Gauss.",
  words: 14,
};

export const pageApunte: PageInput = {
  slug: "apunte-clase",
  title: "Apunte de clase",
  type: "fuente",
  folder: "fuentes",
  division: "1",
  summary: "Notas tomadas en la clase teórica.",
  format: "pdf",
  tags: [],
  sources: [],
  links: [{ slug: "teorema-central" }],
  headings: [],
  body: "Apunte de la clase teórica sobre convergencia.",
  words: 7,
};

export function demoPayload(pages: PageInput[] = [pageIntro, pageTeorema, pageApunte]) {
  return {
    config: demoConfig(),
    pages,
    generatedAt: "2026-09-05T12:00:00.000Z",
    generator: "@sinapsis/api tests",
  };
}
