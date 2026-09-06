/**
 * El modelo es la única pieza del shell con reglas propias (orden pedagógico,
 * divisiones sintéticas, progreso, vecinos, rail), así que es la que se prueba.
 * Se usa la config REAL de Proba y ocho páginas sintéticas.
 */
import { describe, expect, it } from "vitest";
import {
  BUILTIN_VIEWS,
  DIVISION_NONE,
  DIVISION_OTHER,
  SubjectConfig,
  routes,
  type BuiltinView,
  type PageMeta,
  type SubjectDetail,
} from "@sinapsis/contract";
import rawProbaConfig from "../../../../../examples/proba/sinapsis.config.json";
import { buildSubjectModel } from "./model";

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
  page("p-a", "concepto", "1", { order: 2 }),
  page("p-b", "concepto", "1", { order: 1 }),
  page("p-c", "teorema", "1"),
  page("p-d", "fuente", "1", { order: 1 }),
  page("p-e", "distribucion", "2", { order: 1 }),
  page("p-f", "concepto", "2", { order: 1 }),
  page("p-g", "concepto", "99"),
  page("p-h", "concepto", "meta"),
];

function model(studied: string[] = ["p-b", "p-d"]) {
  const detail: SubjectDetail = { config, pages, studied, placeholder: false, lastSyncAt: null };
  return buildSubjectModel(detail);
}

/* El config real de Proba ya no trae ningún `link` externo (el usuario sacó el
   campus): para probar ese `kind` se agrega un grupo extra solo en el test. */
const configConLink = SubjectConfig.parse({
  ...rawProbaConfig,
  rail: [
    ...rawProbaConfig.rail,
    {
      id: "material",
      label: "Material",
      color: "--accent",
      items: [{ id: "catedra", label: "Campus de la cátedra", icon: "link", kind: "link", target: "https://campus.itba.edu.ar" }],
    },
  ],
});
function modelConLink(studied: string[] = ["p-b", "p-d"]) {
  const detail: SubjectDetail = { config: configConLink, pages, studied, placeholder: false, lastSyncAt: null };
  return buildSubjectModel(detail);
}

const slugs = (list: PageMeta[]) => list.map((p) => p.slug);

describe("secuencia pedagógica", () => {
  it("ordena por `order` y deja al final las páginas sin orden", () => {
    expect(slugs(model().sequence("1"))).toEqual(["p-b", "p-a", "p-c"]);
  });

  it("desempata por el orden del tipo en el config (concepto antes que distribución)", () => {
    expect(slugs(model().sequence("2"))).toEqual(["p-f", "p-e"]);
  });

  it("deja fuera de la secuencia a los tipos que no cuentan como contenido", () => {
    expect(slugs(model().sequence("1"))).not.toContain("p-d");
    expect(slugs(model().pagesByDivision("1"))).toContain("p-d");
  });

  it("agrupa por tipo en el orden del config", () => {
    expect(model().typeBlocks("1").map((b) => b.type.key)).toEqual(["concepto", "teorema", "fuente"]);
  });
});

describe("divisiones", () => {
  it("manda las divisiones desconocidas al grupo «Otras»", () => {
    const m = model();
    const otras = m.division(DIVISION_OTHER);
    expect(otras).toBeDefined();
    expect(otras?.name).toBe("Otras");
    expect(otras?.color).toBe("var(--u0)");
    expect(slugs(m.pagesByDivision(DIVISION_OTHER))).toEqual(["p-g"]);
    expect(m.divisionOf(pages[6] as PageMeta)).toBe(DIVISION_OTHER);
  });

  it("crea la división transversal para las páginas sin división", () => {
    const m = model();
    expect(m.division(DIVISION_NONE)?.short).toBe("Transv.");
    expect(m.division(DIVISION_NONE)?.color).toBe("var(--umeta)");
    expect(slugs(m.pagesByDivision(DIVISION_NONE))).toEqual(["p-h"]);
  });

  it("marca como sintéticas solo las que no declara la materia", () => {
    const m = model();
    expect(m.division(DIVISION_NONE)?.synthetic).toBe(true);
    expect(m.division(DIVISION_OTHER)?.synthetic).toBe(true);
    expect(m.division("1")?.synthetic).toBe(false);
  });

  it("cuenta como unidades solo las divisiones declaradas (paridad con la landing)", () => {
    expect(model().divisionsCount).toBe(config.divisions.length);
    expect(model().divisions.filter((d) => d.synthetic)).toHaveLength(2);
  });

  it("solo muestra las divisiones con páginas y respeta el orden del config", () => {
    expect(model().visibleDivisions.map((d) => d.key)).toEqual(["1", "2", DIVISION_NONE, DIVISION_OTHER]);
  });

  it("usa el rótulo corto del contrato", () => {
    expect(model().division("1")?.label).toBe("U1 · Estadística Descriptiva");
    expect(model().division("eval")?.color).toBe("var(--ueval)");
  });

  it("las sintéticas no corren la numeración de las declaradas", () => {
    expect(model().division("2")?.short).toBe("U2");
  });
});

describe("progreso", () => {
  it("no cuenta las fuentes", () => {
    const m = model(["p-b", "p-d"]);
    expect(m.progress("1")).toMatchObject({ done: 1, total: 3 });
    expect(m.progressTotal).toMatchObject({ done: 1, total: 7 });
    expect(m.sourcesCount).toBe(1);
  });

  it("apunta a la primera página sin leer del orden global", () => {
    expect(model(["p-b"]).nextUnread()?.slug).toBe("p-a");
    expect(model(["p-a", "p-b", "p-c", "p-e", "p-f", "p-g", "p-h"]).nextUnread()).toBeNull();
  });

  it("elige el repaso entre las estudiadas más viejas", () => {
    expect(slugs(model(["p-a", "p-c"]).reviewPages())).toEqual(["p-a", "p-c"]);
    expect(slugs(model([]).reviewPages())).toEqual(["p-b", "p-a", "p-c"]);
  });
});

describe("vecinos", () => {
  it("no tiene anterior en la primera ni siguiente en la última", () => {
    const m = model();
    expect(m.prevNext("p-b").prev).toBeNull();
    expect(m.prevNext("p-b").next?.slug).toBe("p-a");
    expect(m.prevNext("p-c").prev?.slug).toBe("p-a");
    expect(m.prevNext("p-c").next).toBeNull();
  });

  it("una fuente no tiene vecinos: no está en la secuencia", () => {
    expect(model().prevNext("p-d")).toEqual({ prev: null, next: null });
    expect(model().positionOf("p-d")).toBe(0);
    expect(model().positionOf("p-a")).toBe(2);
  });

  it("una página inexistente no rompe nada", () => {
    expect(model().prevNext("no-existe")).toEqual({ prev: null, next: null });
  });
});

/* ---------------------------------------------------------------------------
 * Portada de división: hub, panorama, orden de las fuentes y cadena de
 * divisiones. Va con su propio juego de páginas porque el de arriba lo comparte
 * media docena de pruebas y agregarle páginas les movería todos los totales.
 * ------------------------------------------------------------------------- */

const unitPages: PageMeta[] = [
  page("u1-fuente-b", "fuente", "1", { title: "02 - General" }),
  page("u1-fuente-a", "fuente", "1", { title: "01 - Introducción" }),
  page("u1-teorema", "teorema", "1", { order: 2 }),
  page("u1-hub", "concepto", "1", { order: 3, hub: true }),
  page("u1-concepto", "concepto", "1", { order: 1 }),
  page("u2-dist", "distribucion", "2", { order: 1 }),
  page("u2-concepto", "concepto", "2", { order: 2 }),
  page("eval-1", "concepto", "eval", { order: 1 }),
  page("transversal", "formulario", DIVISION_NONE),
  page("indice", "meta", DIVISION_NONE),
];

function unitModel(studied: string[] = []) {
  const detail: SubjectDetail = { config, pages: unitPages, studied, placeholder: false, lastSyncAt: null };
  return buildSubjectModel(detail);
}

describe("portada de división", () => {
  it("pone el hub primero en la secuencia aunque su `order` no lo ponga ahí", () => {
    expect(slugs(unitModel().sequence("1"))).toEqual(["u1-hub", "u1-concepto", "u1-teorema"]);
  });

  it("el panorama es el hub de la división", () => {
    expect(unitModel().overview("1")?.slug).toBe("u1-hub");
  });

  it("sin hub, el panorama es la primera página del primer tipo de contenido", () => {
    /* En la división 2 manda `order` (la distribución va primera), pero el
       panorama es el primer concepto, como en el original. */
    expect(slugs(unitModel().sequence("2"))).toEqual(["u2-dist", "u2-concepto"]);
    expect(unitModel().overview("2")?.slug).toBe("u2-concepto");
  });

  it("una división sin páginas de contenido no tiene panorama", () => {
    expect(unitModel().overview("3")).toBeNull();
  });

  it("ordena las fuentes por título", () => {
    expect(slugs(unitModel().sources("1"))).toEqual(["u1-fuente-a", "u1-fuente-b"]);
  });

  it("deja las páginas meta fuera de la secuencia y del progreso", () => {
    const m = unitModel();
    expect(slugs(m.pagesByDivision(DIVISION_NONE))).toContain("indice");
    expect(slugs(m.sequence(DIVISION_NONE))).toEqual(["transversal"]);
    expect(m.progress(DIVISION_NONE)).toMatchObject({ done: 0, total: 1 });
  });

  it("encadena las divisiones declaradas que tienen secuencia", () => {
    const m = unitModel();
    expect(m.adjacentDivision("1", -1)).toBeNull();
    expect(m.adjacentDivision("1", 1)?.key).toBe("2");
    expect(m.adjacentDivision("2", -1)?.key).toBe("1");
    /* Las declaradas sin páginas (3…9, 0) no están en la cadena. */
    expect(m.adjacentDivision("2", 1)?.key).toBe("eval");
    expect(m.adjacentDivision("eval", 1)).toBeNull();
  });

  it("rotula el tipo reservado «meta» como «Wiki» en vez de la clave cruda", () => {
    /* El contrato reserva `meta`: la materia no lo puede declarar en `pageTypes`,
       así que el rótulo lo pone la plataforma. */
    expect(unitModel().typeLabel("meta")).toBe("Wiki");
    expect(unitModel().typeLabel("concepto")).toBe("Concepto");
    expect(unitModel().typeLabel("inventado")).toBe("inventado");
  });

  it("las divisiones sintéticas no encadenan: no son la siguiente de nadie", () => {
    const m = unitModel();
    expect(m.adjacentDivision(DIVISION_NONE, -1)).toBeNull();
    expect(m.adjacentDivision(DIVISION_NONE, 1)).toBeNull();
    expect(m.adjacentDivision("no-existe", 1)).toBeNull();
  });
});

describe("rail", () => {
  it("intercala los grupos SLOT entre los FIJOS y marca cuál es cuál", () => {
    const groups = modelConLink().railGroups;
    expect(groups.map((g) => g.id)).toEqual(["ruta", "consultar", "practicar", "resolver", "material", "mio"]);
    expect(groups.map((g) => g.slot)).toEqual([false, false, false, true, true, false]);
  });

  it("esconde los ítems `page` cuyo slug no existe y los grupos que quedan vacíos", () => {
    const groups = modelConLink().railGroups;
    const material = groups.find((g) => g.id === "material");
    expect(material?.items.map((i) => i.item.id)).toEqual(["catedra"]);
    /* El grupo «Resolver» de Proba es todo `kind: "tool"`: ninguna herramienta
       depende de que exista una página, así que el grupo entero sobrevive. */
    const resolver = groups.find((g) => g.id === "resolver");
    expect(resolver?.items.map((i) => i.item.id)).toEqual([
      "formularios",
      "explorador",
      "taller",
      "calc",
      "asistente",
      "lab",
      "ejercicios",
      "parcial",
    ]);
    expect(groups.find((g) => g.id === "wikimeta")).toBeUndefined();
  });

  it("resuelve las rutas de cada `kind`", () => {
    const groups = modelConLink().railGroups;
    const home = groups[0]?.items[0];
    expect(home?.to).toBe("/m/proba");
    const graph = groups[1]?.items[1];
    expect(graph?.to).toBe("/m/proba/graph");
    const explorador = groups[3]?.items[1];
    expect(explorador?.to).toBe("/m/proba/t/explorador");
    const campus = groups[4]?.items[0];
    expect(campus?.external).toBe(true);
    expect(campus?.href).toBe("https://campus.itba.edu.ar");
  });

  /* Sprint 2: las nueve vistas builtin del contrato tienen que caer en su ruta
     de `routes.*`, no en «Próximamente». Si alguna vuelve a /t/:id es que se
     olvidó de la tabla `BUILTIN_ROUTES`. */
  it("manda cada vista builtin del contrato a su ruta del contrato", () => {
    const m = model();
    const expected: Record<BuiltinView, string> = {
      home: routes.subject("proba"),
      plan: routes.plan("proba"),
      kits: routes.kits("proba"),
      wiki: routes.wiki("proba"),
      graph: routes.graph("proba"),
      flashcards: routes.flashcards("proba"),
      quiz: routes.quiz("proba"),
      notes: routes.notes("proba"),
      favorites: routes.favorites("proba"),
    };
    for (const view of BUILTIN_VIEWS) {
      expect(m.railItem(view)?.to, `builtin «${view}»`).toBe(expected[view]);
    }
  });

  it("no deja ninguna vista builtin del rail colgada de /t/:id", () => {
    const tools = model()
      .railGroups.flatMap((g) => g.items)
      .filter((v) => v.item.kind === "builtin")
      .map((v) => v.to);
    expect(tools.some((to) => to?.startsWith("/m/proba/t/"))).toBe(false);
  });

  /* Sprint 3 · `kind: "tool"`: el rail sigue mandando a `/t/:target` y quien
     decide si hay herramienta o «Próximamente» es el host, con los bundles que
     declaró la materia. El modelo NO valida ids de herramienta: un bundle puede
     llegar en el próximo sync y el ítem tiene que seguir estando. */
  it("los ítems `tool` van a /t/:target, exista o no el bundle", () => {
    const m = model();
    const explorador = m.railItem("explorador");
    expect(explorador?.item.kind).toBe("tool");
    expect(explorador?.to).toBe(routes.tool("proba", "explorador"));
    expect(explorador?.href).toBeNull();
    expect(explorador?.external).toBe(false);
    /* Las ocho herramientas que declara Proba, en el orden del config. */
    expect(
      m.railGroups
        .find((g) => g.id === "resolver")
        ?.items.map((v) => v.to),
    ).toEqual(
      ["formularios", "explorador", "taller", "calc", "asistente", "lab", "ejercicios", "parcial"].map(
        (id) => routes.tool("proba", id),
      ),
    );
  });

  it("`railItem` busca las herramientas por su `target`, no por su id", () => {
    const detail: SubjectDetail = {
      config: {
        ...config,
        rail: [
          {
            id: "propias",
            label: "Propias",
            items: [
              { id: "atajo", label: "La calculadora", icon: "calc", kind: "tool", target: "calculadora" },
            ],
          },
        ],
      },
      pages,
      studied: [],
      placeholder: false,
      lastSyncAt: null,
    };
    const m = buildSubjectModel(detail);
    /* `/t/:tool` trae el TARGET: es lo que el host busca en los manifiestos. */
    expect(m.railItem("calculadora")?.item.label).toBe("La calculadora");
    expect(m.railItem("calculadora")?.to).toBe(routes.tool("proba", "calculadora"));
    expect(m.railItem("atajo")).toBeNull();
  });

  /* Los kits nombran los ítems del rail por su id. Un ítem `page` o `link` no
     tiene un `target` que se pueda nombrar desde fuera (es un slug o una URL),
     así que hay que encontrarlo por su id: sin esto, los siete kits de Proba
     que declaran «formularios» perdían ese lanzador en silencio. */
  it("`railItem` encuentra las páginas y los enlaces del rail por su id", () => {
    const detail: SubjectDetail = {
      config: {
        ...config,
        rail: [
          {
            id: "propias",
            label: "Propias",
            items: [
              { id: "formularios", label: "Formulario general", icon: "sigma", kind: "page", target: "p-a" },
              { id: "catedra", label: "Campus", icon: "link", kind: "link", target: "https://campus.itba.edu.ar" },
            ],
          },
        ],
      },
      pages,
      studied: [],
      placeholder: false,
      lastSyncAt: null,
    };
    const m = buildSubjectModel(detail);
    expect(m.railItem("formularios")?.to).toBe(routes.page("proba", "p-a"));
    expect(m.railItem("catedra")?.href).toBe("https://campus.itba.edu.ar");
    expect(m.railItem("catedra")?.external).toBe(true);
    /* El slug NO es una llave: el id es el nombre público del ítem. */
    expect(m.railItem("p-a")).toBeNull();
  });

  it("una vista builtin que la plataforma no conoce cae en «Próximamente» (/t/:id)", () => {
    const detail: SubjectDetail = {
      config: {
        ...config,
        rail: [
          {
            id: "futuro",
            label: "Futuro",
            items: [
              { id: "holodeck", label: "Holodeck", icon: "sparkle", kind: "builtin", target: "holodeck" },
            ],
          },
        ],
      },
      pages,
      studied: [],
      placeholder: false,
      lastSyncAt: null,
    };
    expect(buildSubjectModel(detail).railItem("holodeck")?.to).toBe("/m/proba/t/holodeck");
  });
});
