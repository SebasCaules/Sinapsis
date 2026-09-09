/**
 * §4-G — el índice «En esta página» mostraba el marcado crudo del encabezado.
 *
 * `Page.headings[].text` es y sigue siendo el texto CRUDO: de él sale `headingId`
 * y es lo que el autor del wiki escribe en `[[pagina#ancla]]` (N0-22). Así que la
 * corrección es de presentación y vive acá: `tocLabel` se queda con la etiqueta
 * del wikilink y `MathText` compone la matemática en línea.
 *
 * Los casos son los encabezados REALES del wiki de Proba (86 entradas crudas en
 * 34 páginas, 18 de ellas en `formulario-maestro`).
 */
import { describe, expect, it } from "vitest";
import { SubjectConfig, headingId, type PageMeta, type SubjectDetail } from "@sinapsis/contract";
import rawProbaConfig from "../../../../../../subjects/proba/sinapsis.config.json";
import { buildSubjectModel } from "../model";
import { splitHeadingMark } from "../markdown/heading-mark";
import { isGroupStep, neighborsOf, readSteps, readingOrder, savedAt, tocLabel } from "./ReaderView";
import type { ExtraStep } from "../model";

describe("splitHeadingMark", () => {
  it("separa el rótulo corto de la unidad del título", () => {
    expect(splitHeadingMark("U2 · Probabilidad — axiomas, condicional, Bayes")).toEqual({
      mark: "U2",
      label: "Probabilidad — axiomas, condicional, Bayes",
    });
  });

  it("un encabezado sin marca queda entero", () => {
    expect(splitHeadingMark("Contenido")).toEqual({ mark: null, label: "Contenido" });
  });

  /* El separador « · » es corriente en los títulos del wiki: solo cuenta como
     marca cuando lo que lo precede es corto como un rótulo de división. */
  it("un título largo antes del separador no es una marca", () => {
    const texto = "Aproximación normal de la binomial · De Moivre–Laplace";
    expect(splitHeadingMark(texto)).toEqual({ mark: null, label: texto });
  });
});

describe("tocLabel", () => {
  it("un wikilink con etiqueta muestra la etiqueta", () => {
    expect(tocLabel("[[leyes-de-de-morgan|Leyes de De Morgan]]")).toBe("Leyes de De Morgan");
  });

  it("un wikilink sin etiqueta muestra el destino", () => {
    expect(tocLabel("Cotas — ver [[desigualdad-de-chebyshev]]")).toBe(
      "Cotas — ver desigualdad-de-chebyshev",
    );
  });

  it("varios wikilinks en un mismo encabezado", () => {
    expect(tocLabel("[[esperanza|Esperanza]] y [[varianza|Varianza]]")).toBe("Esperanza y Varianza");
  });

  it("una etiqueta con `]` adentro no se corta", () => {
    expect(tocLabel("[[esperanza|Esperanza $E[X]$]]")).toBe("Esperanza $E[X]$");
  });

  it("un ancla interna muestra su etiqueta", () => {
    expect(tocLabel("[[#Independencia|Independencia]]")).toBe("Independencia");
  });

  /* La matemática NO se toca acá: la compone `MathText`, que es lo que recibe
     esta salida. Lo que importa es que los `$` sigan en pie para que los vea. */
  it("deja la matemática en línea intacta para MathText", () => {
    expect(tocLabel("Esperanza por la cola (supervivencia), $X\\ge 0$")).toBe(
      "Esperanza por la cola (supervivencia), $X\\ge 0$",
    );
    expect(tocLabel("Normal estándar $Z\\sim N(0,1)$")).toBe("Normal estándar $Z\\sim N(0,1)$");
  });

  it("un encabezado sin marcado no cambia", () => {
    expect(tocLabel("Axiomas de Kolmogorov")).toBe("Axiomas de Kolmogorov");
  });

  /**
   * La invariante que no se puede romper: el rótulo es SOLO presentación, así
   * que el ancla del encabezado tiene que salir igual del texto crudo y del
   * rotulado. Si dejara de valer, `[[pagina#ancla]]` apuntaría a un id que no
   * existe en el DOM (N0-22).
   */
  it("rotular no mueve el ancla del encabezado", () => {
    const crudos = [
      "[[independencia|Independencia]]",
      "[[leyes-de-de-morgan|Leyes de De Morgan]]",
      "Cotas — ver [[desigualdad-de-chebyshev]]",
      "Esperanza por la cola (supervivencia), $X\\ge 0$",
      "Normal estándar $Z\\sim N(0,1)$",
      "6 · Normal estándar y estandarización",
    ];
    for (const crudo of crudos) {
      expect(headingId(tocLabel(crudo)), crudo).toBe(headingId(crudo));
    }
    expect(headingId("[[independencia|Independencia]]")).toBe("independencia");
  });
});


/* ---------------------------------------------------------------------------
 * Recorrido del lector (§ lector-01, lector-02, lector-08 y lector-22).
 *
 * La config es la REAL de Proba (divisiones 1..9, 0 y `eval`) y las páginas son
 * sintéticas: dos divisiones con secuencia, una fuente suelta y el cajón
 * transversal, que es donde estaban los tres callejones sin salida.
 * ------------------------------------------------------------------------- */
const config = SubjectConfig.parse(rawProbaConfig);

function page(slug: string, type: string, division: string, extra: Partial<PageMeta> = {}): PageMeta {
  return {
    slug,
    title: slug.toUpperCase(),
    type,
    folder: type,
    division,
    summary: "",
    tags: [],
    sources: [],
    words: 100,
    ...extra,
  };
}

const pages: PageMeta[] = [
  page("u1-a", "concepto", "1", { order: 1 }),
  page("u1-b", "concepto", "1", { order: 2 }),
  page("u1-fuente", "fuente", "1"),
  page("u2-a", "concepto", "2", { order: 1 }),
  page("u2-b", "concepto", "2", { order: 2 }),
  page("u3-a", "concepto", "3", { order: 1 }),
  page("transv", "formulario", "meta"),
  page("indice", "meta", "meta"),
];

function model() {
  const detail: SubjectDetail = { config, pages, studied: [], placeholder: false, lastSyncAt: null };
  return buildSubjectModel(detail);
}

const order = () => readingOrder(model());
const vecinos = (slug: string) => neighborsOf(model(), order(), slug);

describe("orden de lectura global", () => {
  it("recorre las divisiones en orden y deja las fuentes al final de la suya", () => {
    expect(order().map((p) => p.slug)).toEqual([
      "u1-a",
      "u1-b",
      "u1-fuente",
      "u2-a",
      "u2-b",
      "u3-a",
      /* «transv» no está: una página sin división no es un tramo (N0-74). */
    ]);
  });

  it("las páginas del tipo reservado `meta` quedan afuera", () => {
    /* El índice y el registro del wiki no son lectura: el baseline los saca de
       `CONTENT` y con eso del orden, del progreso y de «última leída». */
    expect(order().some((p) => p.slug === "indice")).toBe(false);
  });
});

describe("vecinos del lector", () => {
  it("dentro de la división, el vecino es la página de al lado y no se rotula el cruce", () => {
    const { prev, next } = vecinos("u1-a");
    expect(prev).toBeNull();
    expect(next?.page.slug).toBe("u1-b");
    expect(next?.division).toBeNull();
  });

  it("la última de la división sigue en la primera de la siguiente, y lo dice", () => {
    /* § lector-01: acá la lectura moría («Última de la unidad»). */
    const { next } = vecinos("u1-b");
    expect(next?.page.slug).toBe("u2-a");
    expect(next?.division?.key).toBe("2");
  });

  it("la primera de la división vuelve a la última de la anterior", () => {
    const { prev } = vecinos("u2-a");
    expect(prev?.page.slug).toBe("u1-b");
    expect(prev?.division?.key).toBe("1");
  });

  it("la primera página de la materia no tiene anterior", () => {
    expect(vecinos("u1-a").prev).toBeNull();
  });

  it("la última página de la materia no tiene siguiente", () => {
    expect(vecinos("u3-a").next).toBeNull();
  });

  it("una fuente cae al orden global en vez de quedarse sin vecinos", () => {
    /* § lector-02: `positionOf` da 0 y el lector mostraba «← Anterior» inerte y
       un «Última de la unidad» que además era falso. */
    const { prev, next } = vecinos("u1-fuente");
    expect(prev?.page.slug).toBe("u1-b");
    expect(prev?.division).toBeNull();
    expect(next?.page.slug).toBe("u2-a");
    expect(next?.division?.key).toBe("2");
  });

  it("una página sin división no está en ningún recorrido: no tiene vecinos", () => {
    /* § lector-08 trataba «Transversales» como una división más; desde N0-74 las
       páginas sin división ni siquiera forman un cajón: quedan fuera del orden
       de lectura, como el índice. */
    expect(vecinos("transv")).toEqual({ prev: null, next: null });
  });

  it("una página `meta` no tiene vecinos", () => {
    expect(vecinos("indice")).toEqual({ prev: null, next: null });
  });

  it("una página que no existe no tiene vecinos", () => {
    expect(vecinos("no-existe")).toEqual({ prev: null, next: null });
  });
});

/* ------------------------------------------------------------------ N0-61 */

/**
 * La barra de unidad incluye los ejercicios: los grupos son el último tramo de
 * la unidad, después de la última página.
 */
describe("pasos del lector con ejercicios", () => {
  const PASOS: Record<string, ExtraStep[]> = {
    "1": [
      { id: "g1", label: "Ejercicio 1", done: true, group: "Guía", to: "/m/proba/t/ejercicios?arg=1%2Fguia", source: "ejercicios" },
      { id: "g2", label: "Ejercicio 2", done: false, group: "Guía", to: "/m/proba/t/ejercicios?arg=1%2Fguia", source: "ejercicios" },
      { id: "p1", label: "Parcial 1", done: false, group: "Parciales", to: "/m/proba/t/ejercicios?arg=1%2Fparciales", source: "ejercicios" },
    ],
  };
  const conPasos = () =>
    buildSubjectModel(
      { config, pages, studied: [], placeholder: false, lastSyncAt: null },
      false,
      { extraSteps: (d) => PASOS[d] ?? [] },
    );
  const pasos = (slug: string) => {
    const m = conPasos();
    return readSteps(m, readingOrder(m), slug);
  };

  it("la última página de la unidad sigue en el primer grupo, no en la unidad siguiente", () => {
    const { next } = pasos("u1-b");
    expect(isGroupStep(next)).toBe(true);
    expect(next).toMatchObject({ kind: "extra", id: "Guía", done: 1, total: 2, to: "/m/proba/t/ejercicios?arg=1%2Fguia" });
  });

  it("dentro de la unidad y desde atrás, nada cambia", () => {
    const { prev, next } = pasos("u1-a");
    expect(prev).toBeNull();
    expect(isGroupStep(next)).toBe(false);
    expect((next as { page: { slug: string } }).page.slug).toBe("u1-b");
    /* «Anterior» no ve nunca un grupo: los ejercicios son una vista de
       herramienta y no dibujan barra. */
    expect(isGroupStep(pasos("u2-a").prev)).toBe(false);
  });

  it("una unidad sin grupos conserva el cruce a la siguiente", () => {
    const { next } = pasos("u2-b");
    expect(isGroupStep(next)).toBe(false);
    expect((next as { page: { slug: string } }).page.slug).toBe("u3-a");
  });

  it("sin proveedores, los pasos son exactamente los vecinos de siempre", () => {
    const m = model();
    const order_ = readingOrder(m);
    for (const slug of ["u1-a", "u1-b", "u2-a", "u1-fuente", "transv", "no-existe"]) {
      expect(readSteps(m, order_, slug)).toEqual(neighborsOf(m, order_, slug));
    }
  });
});

describe("sello del apunte", () => {
  const hoy = new Date("2026-09-06T18:00:00");

  it("el apunte de hoy muestra solo la hora", () => {
    expect(savedAt("2026-09-06T14:32:00", hoy)).toMatch(/^Guardado · \d{2}:\d{2}$/);
  });

  it("el de otro día antepone el día (§ lector-02 de la tarjeta)", () => {
    /* «Guardado · 23:22» se leía como si fuera de hoy. */
    const sello = savedAt("2026-09-03T23:22:00", hoy);
    expect(sello).toContain("sept");
    expect(sello.split("·")).toHaveLength(3);
  });

  it("una fecha ilegible no inventa nada", () => {
    expect(savedAt("no es una fecha")).toBe("Guardado");
  });
});
