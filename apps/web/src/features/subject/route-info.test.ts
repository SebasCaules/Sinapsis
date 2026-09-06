/**
 * `describePath` es lo que decide el rótulo de cada pestaña, de la última miga y
 * del título del documento. Como también describe rutas que NO se están
 * visitando (la que abre un ⌘-clic), se prueba sin router.
 */
import { describe, expect, it } from "vitest";
import { SubjectConfig, routes, type PageMeta, type SubjectDetail } from "@sinapsis/contract";
import rawProbaConfig from "../../../../../examples/proba/sinapsis.config.json";
import { buildSubjectModel } from "./model";
import { describePath, isSubjectPath, subjectSegments } from "./route-info";

const config = SubjectConfig.parse(rawProbaConfig);
const pages: PageMeta[] = [
  { slug: "media", title: "Media aritmética", type: "concepto", folder: "concepto", division: "1", summary: "", tags: [], sources: [], words: 10 },
];
const detail: SubjectDetail = { config, pages, studied: [], placeholder: false, lastSyncAt: null };
const model = buildSubjectModel(detail);
const S = "proba";

describe("pertenencia a la materia", () => {
  it("reconoce las rutas de la materia y descarta las ajenas", () => {
    expect(isSubjectPath(S, routes.subject(S))).toBe(true);
    expect(isSubjectPath(S, routes.page(S, "media"))).toBe(true);
    expect(isSubjectPath(S, "/m/otra/wiki")).toBe(false);
    expect(isSubjectPath(S, "/")).toBe(false);
    /* Prefijo parecido pero distinto: /m/probabilidad no es /m/proba. */
    expect(isSubjectPath(S, "/m/probabilidad/wiki")).toBe(false);
  });

  it("descodifica los segmentos", () => {
    expect(subjectSegments(S, "/m/proba/p/media%20aritmetica")).toEqual(["p", "media aritmetica"]);
  });
});

describe("rótulos", () => {
  it("da el título de cada vista de la plataforma", () => {
    const title = (path: string) => describePath(model, S, path).title;
    expect(title(routes.subject(S))).toBe("Inicio");
    expect(title(routes.wiki(S))).toBe("Todo el wiki");
    expect(title(routes.graph(S))).toBe("Grafo de conexiones");
    expect(title(routes.notes(S))).toBe("Mis apuntes");
    expect(title(routes.favorites(S))).toBe("Favoritos");
    expect(title(routes.plan(S))).toBe("Plan de estudio");
    expect(title(routes.kits(S))).toBe("Kits de estudio");
    expect(title(routes.flashcards(S))).toBe("Flashcards");
    expect(title(routes.quiz(S))).toBe("Quiz");
  });

  it("una página trae chip, color, miga de su división y su slug", () => {
    const info = describePath(model, S, routes.page(S, "media"));
    expect(info.title).toBe("Media aritmética");
    expect(info.chip).toBe("U1");
    expect(info.color).toBe("var(--u1)");
    expect(info.parent).toEqual({ label: "U1 · Estadística Descriptiva", to: routes.division(S, "1") });
    expect(info.page).toBe("media");
    expect(info.division).toBe("1");
  });

  it("una página que no está en la materia se rotula con su slug", () => {
    expect(describePath(model, S, routes.page(S, "fantasma")).title).toBe("fantasma");
  });

  it("una división se rotula con su etiqueta y no lleva chip", () => {
    const info = describePath(model, S, routes.division(S, "1"));
    expect(info.title).toBe("U1 · Estadística Descriptiva");
    expect(info.chip).toBeNull();
    expect(info.division).toBe("1");
  });

  it("una herramienta usa el rótulo que le puso la materia", () => {
    expect(describePath(model, S, routes.tool(S, "explorador")).title).toBe("Explorador de distribuciones");
  });

  it("con el material de estudio a mano usa el nombre del mazo o del quiz", () => {
    const labels = { deck: (id: string) => (id === "u1" ? "Repaso U1" : undefined) };
    expect(describePath(model, S, routes.deck(S, "u1"), labels).title).toBe("Repaso U1");
    /* Sin rótulo conocido, el título fijo de la vista. */
    expect(describePath(model, S, routes.deck(S, "otro"), labels).title).toBe("Flashcards");
  });

  it("sin modelo (mientras carga) devuelve los rótulos que no dependen de las páginas", () => {
    expect(describePath(null, S, routes.graph(S)).title).toBe("Grafo de conexiones");
    expect(describePath(null, S, routes.page(S, "media")).title).toBe("media");
  });

  it("una ruta desconocida de la materia es «No encontrado»", () => {
    expect(describePath(model, S, "/m/proba/vaya-a-saber").title).toBe("No encontrado");
  });
});
