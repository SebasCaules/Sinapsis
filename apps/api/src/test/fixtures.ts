/**
 * Fixtures de los tests: una materia mínima válida (2 divisiones, 2 tipos) con
 * páginas enlazadas entre sí, y el material de estudio autoral que viaja en
 * `SyncPayload.study` (Sprint 2).
 */
import type { PageInput, StudyContent, SubjectConfigInput } from "@sinapsis/contract";

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

/** Página de contenido sin resumen: el mazo automático tiene que saltearla. */
export const pageSinResumen: PageInput = {
  slug: "sin-resumen",
  title: "Página sin resumen",
  type: "concepto",
  folder: "conceptos",
  division: "1",
  order: 2,
  summary: "",
  tags: [],
  sources: [],
  links: [],
  headings: [],
  body: "Un cuerpo sin resumen en el frontmatter.",
  words: 8,
};

export function demoPayload(
  pages: PageInput[] = [pageIntro, pageTeorema, pageApunte],
  study?: StudyContent,
) {
  return {
    config: demoConfig(),
    pages,
    ...(study ? { study } : {}),
    generatedAt: "2026-09-05T12:00:00.000Z",
    generator: "@sinapsis/api tests",
  };
}

/**
 * Material de estudio autoral coherente con las páginas de arriba: un mazo, un
 * quiz, un plan de una fase y un kit que los combina. Todas las referencias
 * apuntan a algo que existe; los tests rompen las que quieren probar.
 */
export function demoStudy(overrides: Partial<StudyContent> = {}): StudyContent {
  return {
    decks: [
      {
        id: "mazo-base",
        title: "Mazo base",
        description: "Las dos ideas centrales.",
        division: "1",
        source: "authored",
        cards: [
          {
            id: "carta-tcl",
            front: "¿Qué dice el TCL?",
            back: "Que la suma de variables tiende a la normal.",
            division: "2",
            page: "teorema-central",
            tags: ["tcl"],
          },
          {
            id: "carta-intro",
            front: "¿Qué estudia la materia?",
            back: "El muestreo aleatorio.",
            division: "1",
            page: "intro",
            tags: [],
          },
        ],
      },
    ],
    quizzes: [
      {
        id: "quiz-base",
        title: "Quiz de repaso",
        questions: [
          {
            id: "pregunta-tcl",
            prompt: "El TCL habla de…",
            options: [
              { text: "sumas de variables", correct: true },
              { text: "derivadas parciales", correct: false },
            ],
            explanation: "Es un teorema de convergencia de sumas.",
            page: "teorema-central",
          },
        ],
      },
    ],
    plan: {
      title: "Plan de estudio",
      tracks: [],
      phases: [
        {
          id: "parcial-1",
          title: "Primer parcial",
          date: "2026-10-15",
          milestones: [
            {
              id: "hito-1",
              title: "Cerrar la primera parte",
              divisions: ["1"],
              tasks: [
                { id: "tarea-leer", label: "Leer la Unidad 1", kind: "read", target: "1" },
                { id: "tarea-mazo", label: "Repasar el mazo base", kind: "cards", target: "mazo-base" },
                { id: "tarea-quiz", label: "Hacer el quiz", kind: "quiz", target: "quiz-base" },
              ],
            },
          ],
        },
      ],
    },
    kits: [
      {
        id: "kit-parcial",
        title: "Kit del primer parcial",
        divisions: ["1"],
        pages: ["intro"],
        decks: ["mazo-base"],
        quizzes: ["quiz-base"],
        tools: [],
      },
    ],
    ...overrides,
  };
}

/**
 * Cuatro páginas enlazadas para el grafo: a→b, a→c, b→c, c→d y d→a, más un
 * wikilink roto (d→fantasma) que no tiene que aparecer como arista.
 */
export function linkedPages(): PageInput[] {
  const base = (slug: string, title: string, links: string[]): PageInput => ({
    slug,
    title,
    type: "concepto",
    folder: "conceptos",
    division: "1",
    summary: `Resumen de ${title}.`,
    tags: [],
    sources: [],
    links: links.map((target) => ({ slug: target })),
    headings: [],
    body: `Cuerpo de ${title}.`,
    words: 5,
  });
  return [
    base("nodo-a", "Nodo A", ["nodo-b", "nodo-c"]),
    base("nodo-b", "Nodo B", ["nodo-c"]),
    base("nodo-c", "Nodo C", ["nodo-d"]),
    base("nodo-d", "Nodo D", ["nodo-a", "pagina-fantasma"]),
  ];
}
