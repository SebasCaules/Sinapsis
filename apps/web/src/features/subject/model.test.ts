/**
 * El modelo es la única pieza del shell con reglas propias (orden pedagógico,
 * divisiones sintéticas, progreso, vecinos, rail), así que es la que se prueba.
 * Se usa la config REAL de Proba y ocho páginas sintéticas.
 */
import { describe, expect, it } from "vitest";
import {
  DIVISION_NONE,
  DIVISION_OTHER,
  SubjectConfig,
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

describe("rail", () => {
  it("intercala los grupos SLOT entre los FIJOS y marca cuál es cuál", () => {
    const groups = model().railGroups;
    expect(groups.map((g) => g.id)).toEqual(["ruta", "consultar", "practicar", "resolver", "material", "mio"]);
    expect(groups.map((g) => g.slot)).toEqual([false, false, false, true, true, false]);
  });

  it("esconde los ítems `page` cuyo slug no existe y los grupos que quedan vacíos", () => {
    const groups = model().railGroups;
    const material = groups.find((g) => g.id === "material");
    expect(material?.items.map((i) => i.item.id)).toEqual(["catedra"]);
    expect(groups.find((g) => g.id === "wikimeta")).toBeUndefined();
  });

  it("resuelve las rutas de cada `kind`", () => {
    const groups = model().railGroups;
    const home = groups[0]?.items[0];
    expect(home?.to).toBe("/m/proba");
    const graph = groups[1]?.items[1];
    expect(graph?.to).toBe("/m/proba/graph");
    const explorador = groups[3]?.items[0];
    expect(explorador?.to).toBe("/m/proba/t/explorador");
    const campus = groups[4]?.items[0];
    expect(campus?.external).toBe(true);
    expect(campus?.href).toBe("https://campus.itba.edu.ar");
  });
});
