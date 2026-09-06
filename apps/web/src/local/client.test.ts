/**
 * El cliente local de punta a punta: lee los archivos del sitio con un `fetch`
 * de mentira y escribe en el documento del navegador.
 *
 * Lo que se prueba es lo que el API garantizaba y ahora hay que sostener acá: el
 * 404 de una materia que no existe, el material con los mazos automáticos, el
 * SRS recortado a las tarjetas vigentes (bug 7), los intentos más recientes y la
 * independencia entre las tareas del plan y sus fechas.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SubjectConfig, type SubjectConfigInput } from "@sinapsis/contract";
import { emptyBackup, type SitePages, type SiteSubject, type SiteCatalog } from "@sinapsis/contract/site";
import { ApiError } from "@/lib/apiError";
import { clearCatalogCache } from "./catalog";
import { clearSearchIndexes, localApi } from "./client";
import { getState, resetStateForTests, update, withSubject } from "./state";

const AHORA = "2026-09-06T12:00:00.000Z";

const configInput: SubjectConfigInput = {
  contract: 1,
  slug: "proba",
  name: "Probabilidad y Estadística",
  code: "93.24",
  institution: "ITBA",
  semester: "2026-1C",
  division: { singular: "Unidad", abbr: "U", plural: "Unidades" },
  divisions: [{ key: "u1", name: "Unidad 1", kind: "numbered" }],
  pageTypes: [
    { key: "tema", label: "Tema", plural: "Temas" },
    { key: "apunte", label: "Apunte", plural: "Apuntes", countsAsContent: false },
  ],
};

const catalog: SiteCatalog = {
  format: 1,
  builtAt: "2026-09-05T10:00:00.000Z",
  subjects: [
    {
      slug: "proba",
      name: "Probabilidad y Estadística",
      code: "93.24",
      institution: "ITBA",
      color: "--u9",
      semester: "2026-1C",
      division: { singular: "Unidad", abbr: "U", plural: "Unidades" },
      divisionsCount: 1,
      pagesCount: 2,
      totalPages: 3,
      toolsCount: 0,
      builtAt: "2026-09-05T10:00:00.000Z",
    },
  ],
};

const subject: SiteSubject = {
  format: 1,
  builtAt: "2026-09-05T10:00:00.000Z",
  config: SubjectConfig.parse(configInput),
  pages: [
    { slug: "media", title: "Media", type: "tema", folder: "temas", division: "u1", order: 2, summary: "El valor medio.", tags: [], sources: [], words: 300 },
    { slug: "varianza", title: "Varianza", type: "tema", folder: "temas", division: "u1", order: 1, summary: "La dispersión.", tags: [], sources: [], words: 250 },
    { slug: "apunte-7", title: "Apunte 7", type: "apunte", folder: "apuntes", division: "u1", summary: "", tags: [], sources: [], words: 90 },
  ],
  links: [{ from: "varianza", to: "media" }],
  study: {
    decks: [{ id: "mazo", title: "Mazo propio", division: "u1", source: "authored", cards: [{ id: "c1", front: "a", back: "b", tags: [] }] }],
    quizzes: [],
    plan: null,
    kits: [],
  },
  warnings: [],
};

const pages: SitePages = {
  format: 1,
  pages: {
    media: { body: "La media es el centro de la distribución.", links: [], headings: [] },
    varianza: { body: "La varianza mide la dispersión respecto de la media.", links: [{ slug: "media", text: "media" }], headings: [] },
    "apunte-7": { body: "Notas sueltas sobre la media.", links: [], headings: [] },
  },
};

/** `fetch` de mentira: sirve los cuatro archivos del sitio y 404 para el resto. */
function installFetch(files: Record<string, unknown>): void {
  vi.stubGlobal("fetch", async (url: string) => {
    const body = files[String(url)];
    if (body === undefined) return new Response("no está", { status: 404 });
    return new Response(JSON.stringify(body), { status: 200, headers: { "content-type": "application/json" } });
  });
}

beforeEach(() => {
  resetStateForTests(emptyBackup(AHORA));
  clearCatalogCache();
  clearSearchIndexes();
  installFetch({
    "/subjects/index.json": catalog,
    "/subjects/proba/subject.json": subject,
    "/subjects/proba/pages.json": pages,
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("perfil", () => {
  it("es el perfil local, sin correo", async () => {
    const me = await localApi.auth.me();
    expect(me).toEqual({ id: "local", email: "", name: "Estudiante", picture: null, theme: "pergamino" });
  });

  it("el tema y el nombre se guardan en el documento", async () => {
    await localApi.auth.setTheme("laurel");
    await localApi.auth.setName("  Sebastián  ");
    expect(getState().profile).toEqual({ name: "Sebastián", theme: "laurel" });
    expect((await localApi.auth.me()).name).toBe("Sebastián");
  });
});

describe("materia", () => {
  it("el detalle sale de subject.json", async () => {
    const detail = await localApi.subject.detail("proba");
    expect(detail.config.slug).toBe("proba");
    expect(detail.pages).toHaveLength(3);
    expect(detail.placeholder).toBe(false);
    expect(detail.lastSyncAt).toBe("2026-09-05T10:00:00.000Z");
  });

  it("una materia que no existe es un 404 (las vistas ya lo saben mostrar)", async () => {
    await expect(localApi.subject.detail("fantasma")).rejects.toMatchObject({ status: 404 });
    await expect(localApi.subject.detail("fantasma")).rejects.toBeInstanceOf(ApiError);
  });

  it("la página trae cuerpo, backlinks y si está estudiada", async () => {
    await localApi.subject.markStudied("proba", "media");
    const detail = await localApi.subject.page("proba", "media");
    expect(detail.page.body).toContain("centro");
    expect(detail.backlinks.map((p) => p.slug)).toEqual(["varianza"]);
    expect(detail.studied).toBe(true);
  });

  it("una página que no existe también es un 404", async () => {
    await expect(localApi.subject.page("proba", "gamma")).rejects.toMatchObject({ status: 404 });
  });

  it("el progreso se guarda por materia y se puede desmarcar", async () => {
    await localApi.subject.markStudied("proba", "media");
    expect((await localApi.subject.detail("proba")).studied).toEqual(["media"]);
    await localApi.subject.unmarkStudied("proba", "media");
    expect((await localApi.subject.detail("proba")).studied).toEqual([]);
  });

  it("la búsqueda usa el índice de la materia y prefiere el material propio", async () => {
    const hits = await localApi.subject.search("proba", "media");
    expect(hits[0]?.slug).toBe("media");
    expect(hits.map((h) => h.slug)).toContain("apunte-7");
  });

  it("el grafo sale de las páginas y los enlaces", async () => {
    const graph = await localApi.subject.graph("proba");
    expect(graph.nodes).toHaveLength(3);
    expect(graph.edges).toEqual([{ from: "varianza", to: "media" }]);
  });

  it("sin tools.json la materia no tiene bundles", async () => {
    expect(await localApi.subject.tools("proba")).toEqual([]);
  });
});

describe("materias placeholder", () => {
  beforeEach(async () => {
    await localApi.landing.createSubject({
      slug: "analisis",
      name: "Análisis",
      code: "93.58",
      institution: "ITBA",
      semester: "2026-2C",
      division: { singular: "Unidad", abbr: "U", plural: "Unidades" },
    });
  });

  it("el detalle es un config sintético, sin páginas", async () => {
    const detail = await localApi.subject.detail("analisis");
    expect(detail.placeholder).toBe(true);
    expect(detail.pages).toEqual([]);
    expect(detail.config.divisions).toEqual([]);
    expect(detail.config.name).toBe("Análisis");
  });

  it("no tiene material ni búsqueda", async () => {
    expect(await localApi.study.content("analisis")).toEqual({ decks: [], quizzes: [], plan: null, kits: [] });
    expect(await localApi.subject.search("analisis", "media")).toEqual([]);
  });
});

describe("material de estudio", () => {
  it("el autoral primero y los mazos automáticos al final", async () => {
    const content = await localApi.study.content("proba");
    expect(content.decks.map((d) => d.id)).toEqual(["mazo", "auto-u1"]);
    /* Los automáticos salen de los resúmenes de las páginas de CONTENIDO. */
    expect(content.decks[1]?.cards.map((c) => c.page)).toEqual(["varianza", "media"]);
  });
});

describe("estado de estudio", () => {
  it("`grade` aplica SM-2 del contrato y se guarda", async () => {
    const first = await localApi.study.grade("proba", "c1", 3);
    expect(first.reps).toBe(1);
    expect(first.interval).toBe(1);
    const second = await localApi.study.grade("proba", "c1", 3);
    expect(second.reps).toBe(2);
    expect((await localApi.study.state("proba")).srs).toHaveLength(1);
  });

  it("el SRS se recorta a las tarjetas que existen hoy (bug 7)", async () => {
    await localApi.study.grade("proba", "c1", 3);
    await localApi.study.grade("proba", "borrada", 3);

    const state = await localApi.study.state("proba");
    expect(state.srs.map((s) => s.cardId)).toEqual(["c1"]);
    /* La fila NO se borra: si la tarjeta vuelve, vuelve su progreso. */
    expect(getState().subjects["proba"]?.srs.map((s) => s.cardId)).toEqual(["c1", "borrada"]);
  });

  it("los intentos vuelven de más nuevo a más viejo y como mucho 50", async () => {
    for (let i = 0; i < 55; i += 1) await localApi.study.recordAttempt("proba", "quiz", i, 60);
    const state = await localApi.study.state("proba");
    expect(state.attempts).toHaveLength(50);
    expect((state.attempts[0]?.at ?? "") >= (state.attempts[49]?.at ?? "")).toBe(true);
  });

  it("favoritos y apuntes se guardan y se borran", async () => {
    await localApi.study.addBookmark("proba", "media");
    await localApi.study.addBookmark("proba", "media");
    await localApi.study.saveNote("proba", "media", "Repasar el ejemplo 3.");
    let state = await localApi.study.state("proba");
    expect(state.bookmarks).toEqual(["media"]);
    expect(state.notes[0]?.body).toBe("Repasar el ejemplo 3.");

    await localApi.study.removeBookmark("proba", "media");
    await localApi.study.deleteNote("proba", "media");
    state = await localApi.study.state("proba");
    expect(state.bookmarks).toEqual([]);
    expect(state.notes).toEqual([]);
  });

  it("«Reiniciar el plan» destilda las tareas y NO borra las fechas", async () => {
    await localApi.study.setTask("proba", "t1", true);
    await localApi.study.setPlanDate("proba", "parcial1", "2026-10-01");

    await localApi.study.resetTasks("proba");

    const state = await localApi.study.state("proba");
    expect(state.tasksDone).toEqual([]);
    expect(state.planDates).toEqual({ parcial1: "2026-10-01" });
  });

  it("«Borrar fechas» no toca las tareas", async () => {
    await localApi.study.setTask("proba", "t1", true);
    await localApi.study.setPlanDate("proba", "parcial1", "2026-10-01");

    await localApi.study.clearPlanDate("proba", "parcial1");
    await localApi.study.setPlanDate("proba", "final", "2026-12-01");
    await localApi.study.resetPlanDates("proba");

    const state = await localApi.study.state("proba");
    expect(state.tasksDone).toEqual(["t1"]);
    expect(state.planDates).toEqual({});
  });

  it("el estado de una materia no se mezcla con el de otra", async () => {
    await localApi.study.addBookmark("proba", "media");
    update((doc) => withSubject(doc, "otra", (s) => ({ ...s, bookmarks: ["x"] })));
    expect((await localApi.study.state("proba")).bookmarks).toEqual(["media"]);
  });
});

describe("landing", () => {
  it("lista las materias del catálogo y sabe cuáles quedaron fuera", async () => {
    expect((await localApi.landing.list()).map((c) => c.slug)).toEqual(["proba"]);
    expect(await localApi.landing.available()).toEqual([]);

    await localApi.landing.removeFromLanding("proba");

    expect(await localApi.landing.list()).toEqual([]);
    expect((await localApi.landing.available()).map((c) => c.slug)).toEqual(["proba"]);
  });

  it("guardar la disposición devuelve las tarjetas ya ubicadas", async () => {
    const cards = await localApi.landing.saveLayout({
      items: [{ slug: "proba", semester: "2027-1c", position: 4 }],
      semesters: ["2027-1C"],
    });
    expect(cards[0]?.semester).toBe("2027-1C");
    expect(cards[0]?.position).toBe(4);
    expect(await localApi.landing.semesters()).toEqual(["2027-1C"]);
  });
});
