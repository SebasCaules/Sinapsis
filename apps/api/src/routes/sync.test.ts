import { sql } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type {
  PageDetail,
  SearchHit,
  SubjectDetail,
  SyncResult,
} from "@sinapsis/contract";
import { createHarness, type Harness } from "../test/harness.js";
import { demoConfig, demoPayload, pageApunte, pageIntro, pageTeorema } from "../test/fixtures.js";

describe("sync de una materia", () => {
  let h: Harness;

  beforeAll(async () => {
    h = await createHarness();
  });

  afterAll(() => h.close());

  const sync = (body: unknown, token: string | null = h?.env.SYNC_TOKEN ?? null) =>
    h.json(
      "PUT",
      "/api/subjects/demo/sync",
      body,
      token === null ? {} : { authorization: `Bearer ${token}` },
    );

  it("devuelve 401 sin token y con un token equivocado", async () => {
    expect((await sync(demoPayload(), null)).status).toBe(401);
    expect((await sync(demoPayload(), "token-equivocado")).status).toBe(401);
  });

  it("rechaza un slug de URL que no coincide con el config", async () => {
    const res = await h.json("PUT", "/api/subjects/otra/sync", demoPayload(), {
      authorization: `Bearer ${h.env.SYNC_TOKEN}`,
    });
    expect(res.status).toBe(400);
  });

  it("rechaza un payload que no valida contra el contrato", async () => {
    const res = await sync({ config: { slug: "demo" }, pages: [], generatedAt: "hoy" });
    expect(res.status).toBe(400);
    expect((await res.json()) as { error: string }).toHaveProperty("error");
  });

  it("primer sync: crea la materia y sus 3 páginas", async () => {
    const res = await sync(demoPayload());
    expect(res.status).toBe(200);
    const result = (await res.json()) as SyncResult;
    expect(result).toMatchObject({
      subject: "demo",
      pages: 3,
      created: 3,
      updated: 0,
      deleted: 0,
    });
    expect(result.warnings).toEqual([]);
  });

  it("es idempotente: repetir el mismo payload no cambia nada", async () => {
    const result = (await (await sync(demoPayload())).json()) as SyncResult;
    expect(result).toMatchObject({ created: 0, updated: 0, deleted: 0, pages: 3 });
  });

  it("segundo sync con 2 páginas (una modificada): updated=1, deleted=1", async () => {
    const modificada = { ...pageIntro, body: `${pageIntro.body} Ahora con un párrafo nuevo.` };
    const res = await sync(demoPayload([modificada, pageTeorema]));
    expect(res.status).toBe(200);
    expect((await res.json()) as SyncResult).toMatchObject({
      pages: 2,
      created: 0,
      updated: 1,
      deleted: 1,
    });
  });

  it("GET /api/subjects/:slug devuelve config y 2 PageMeta sin cuerpo", async () => {
    await h.login();
    const res = await h.request("/api/subjects/demo");
    expect(res.status).toBe(200);
    const detail = (await res.json()) as SubjectDetail;

    expect(detail.placeholder).toBe(false);
    expect(detail.lastSyncAt).toBeTypeOf("string");
    expect(detail.config.name).toBe("Materia Demo");
    expect(detail.config.divisions).toHaveLength(2);
    expect(detail.config.pageTypes.map((t) => t.key)).toEqual(["concepto", "fuente"]);
    expect(detail.pages).toHaveLength(2);
    expect(detail.pages.map((p) => p.slug).sort()).toEqual(["intro", "teorema-central"]);
    for (const page of detail.pages) {
      expect(page).not.toHaveProperty("body");
      expect(page).not.toHaveProperty("links");
      expect(page).not.toHaveProperty("headings");
    }
    expect(detail.studied).toEqual([]);
  });

  it("GET de una materia inexistente devuelve 404", async () => {
    const res = await h.request("/api/subjects/no-existe");
    expect(res.status).toBe(404);
  });

  it("GET .../pages/:page devuelve el cuerpo y los backlinks", async () => {
    const res = await h.request("/api/subjects/demo/pages/teorema-central");
    expect(res.status).toBe(200);
    const detail = (await res.json()) as PageDetail;

    expect(detail.page.slug).toBe("teorema-central");
    expect(detail.page.body).toContain("campana de Gauss");
    expect(detail.page.headings).toHaveLength(1);
    expect(detail.studied).toBe(false);
    // `apunte-clase` también enlazaba, pero el segundo sync la borró.
    expect(detail.backlinks.map((b) => b.slug)).toEqual(["intro"]);

    const sinBacklinks = (await (
      await h.request("/api/subjects/demo/pages/intro")
    ).json()) as PageDetail;
    expect(sinBacklinks.backlinks).toEqual([]);

    expect((await h.request("/api/subjects/demo/pages/fantasma")).status).toBe(404);
  });

  it("la búsqueda encuentra por una palabra del cuerpo", async () => {
    const res = await h.request("/api/subjects/demo/search?q=campana");
    expect(res.status).toBe(200);
    const hits = (await res.json()) as SearchHit[];
    expect(hits.map((hit) => hit.slug)).toContain("teorema-central");
    expect(hits[0]?.title).toBe("Teorema Central del Límite");
    expect(hits[0]?.division).toBe("2");
    expect(hits[0]?.snippet.length).toBeGreaterThan(0);
  });

  it("la búsqueda ignora acentos y tolera prefijos", async () => {
    const hits = (await (
      await h.request("/api/subjects/demo/search?q=limite")
    ).json()) as SearchHit[];
    expect(hits.map((hit) => hit.slug)).toContain("teorema-central");
  });

  it("la búsqueda encuentra por una palabra que solo está en el resumen", async () => {
    // "estudia" solo aparece en el `summary` de `intro` (el cuerpo habla de
    // muestreo): el índice cubre title + summary + body, no solo dos columnas.
    const hits = (await (
      await h.request("/api/subjects/demo/search?q=estudia")
    ).json()) as SearchHit[];
    expect(hits.map((hit) => hit.slug)).toEqual(["intro"]);
    expect(hits[0]?.snippet.length).toBeGreaterThan(0);
  });

  it("la búsqueda con q vacío devuelve una lista vacía", async () => {
    expect(await (await h.request("/api/subjects/demo/search?q=")).json()).toEqual([]);
    expect(await (await h.request("/api/subjects/demo/search")).json()).toEqual([]);
    expect(await (await h.request("/api/subjects/demo/search?q=%20%2A%2A")).json()).toEqual([]);
  });

  it("el índice de búsqueda se limpia con las páginas borradas", async () => {
    const hits = (await (
      await h.request("/api/subjects/demo/search?q=convergencia")
    ).json()) as SearchHit[];
    expect(hits).toEqual([]);
  });

  it("avisa cuando una página trae una división o un tipo desconocidos", async () => {
    const rara = {
      ...pageApunte,
      slug: "pagina-rara",
      division: "99",
      type: "desconocido",
    };
    const result = (await (await sync(demoPayload([pageIntro, pageTeorema, rara]))).json()) as SyncResult;
    expect(result.warnings).toHaveLength(2);
    expect(result.warnings.join(" ")).toContain('la división "99" no está declarada');
    expect(result.warnings.join(" ")).toContain('el tipo "desconocido" no está declarado');
  });

  it("no avisa por la división reservada 'meta'", async () => {
    const transversal = { ...pageApunte, slug: "transversal", division: "meta", type: "fuente" };
    const result = (await (
      await sync(demoPayload([pageIntro, pageTeorema, transversal]))
    ).json()) as SyncResult;
    expect(result.warnings).toEqual([]);
  });

  it("rechaza páginas repetidas en el payload", async () => {
    const res = await sync(demoPayload([pageIntro, pageIntro]));
    expect(res.status).toBe(400);
  });

  it("el sync convierte una materia placeholder en sincronizada", async () => {
    await h.login();
    const creada = await h.json("POST", "/api/subjects", {
      slug: "algebra",
      name: "Álgebra",
      code: "93.58",
      institution: "ITBA",
      semester: "2026-1C",
      division: { singular: "Unidad", abbr: "U", plural: "Unidades" },
    });
    expect(creada.status).toBe(201);
    expect((await creada.json()) as { placeholder: boolean }).toMatchObject({ placeholder: true });

    const res = await h.json(
      "PUT",
      "/api/subjects/algebra/sync",
      {
        config: demoConfig({ slug: "algebra", name: "Álgebra II" }),
        pages: [pageIntro],
        generatedAt: "2026-09-05T12:00:00.000Z",
      },
      { authorization: `Bearer ${h.env.SYNC_TOKEN}` },
    );
    expect(res.status).toBe(200);

    const detail = (await (await h.request("/api/subjects/algebra")).json()) as SubjectDetail;
    expect(detail.placeholder).toBe(false);
    expect(detail.config.name).toBe("Álgebra II");
  });
});

describe("el índice FTS lo mantienen los triggers", () => {
  let h: Harness;

  beforeAll(async () => {
    h = await createHarness();
    await h.login();
  });

  afterAll(() => h.close());

  const sync = (pages = [pageIntro, pageTeorema, pageApunte]) =>
    h.json("PUT", "/api/subjects/demo/sync", demoPayload(pages), {
      authorization: `Bearer ${h.env.SYNC_TOKEN}`,
    });

  /**
   * Huella del índice: `pages_fts` es de contenido externo (S-06), así que no
   * guarda el texto y no se puede listar. Lo que sí delata cualquier escritura
   * son sus segmentos internos: si `pages_fts_data` no cambió, nadie tocó el
   * índice.
   */
  const ftsFingerprint = () =>
    h.db.all<{ id: number; n: number }>(
      sql`SELECT id AS id, length(block) AS n FROM pages_fts_data ORDER BY id`,
    );

  const buscar = async (q: string): Promise<string[]> => {
    const hits = (await (await h.request(`/api/subjects/demo/search?q=${q}`)).json()) as SearchHit[];
    return hits.map((hit) => hit.slug);
  };

  it("el primer sync indexa las tres páginas", async () => {
    expect((await sync()).status).toBe(200);
    expect(await buscar("campana")).toContain("teorema-central");
    expect(await buscar("muestreo")).toContain("intro");
    expect(await buscar("convergencia")).toContain("apunte-clase");
  });

  it("un segundo sync idéntico no toca el índice", async () => {
    const antes = await ftsFingerprint();
    const result = (await (await sync()).json()) as SyncResult;
    expect(result).toMatchObject({ created: 0, updated: 0, deleted: 0 });
    // Sin UPDATE sobre `pages` no se dispara ningún trigger: mismos segmentos.
    expect(await ftsFingerprint()).toEqual(antes);
  });

  it("un sync incremental actualiza por trigger la fila de la página modificada", async () => {
    const antes = await ftsFingerprint();

    const modificada = { ...pageTeorema, body: "Ahora habla de martingalas en distribución." };
    const result = (await (await sync([pageIntro, modificada, pageApunte])).json()) as SyncResult;
    expect(result).toMatchObject({ created: 0, updated: 1, deleted: 0 });
    expect(await ftsFingerprint()).not.toEqual(antes);

    // El índice quedó coherente: el cuerpo viejo ya no está y el nuevo sí.
    expect(await buscar("campana")).not.toContain("teorema-central");
    expect(await buscar("martingalas")).toContain("teorema-central");
    // Y las páginas que no se tocaron siguen buscándose.
    expect(await buscar("muestreo")).toContain("intro");
  });

  it("una página borrada sale del índice", async () => {
    const result = (await (await sync([pageIntro, pageApunte])).json()) as SyncResult;
    expect(result).toMatchObject({ created: 0, updated: 0, deleted: 1 });

    expect(await buscar("martingalas")).not.toContain("teorema-central");
    expect(await buscar("muestreo")).toContain("intro");
  });

  it("cambiar solo el resumen reindexa esa columna", async () => {
    // El resumen es una columna del índice: el trigger `pages_au` tiene que
    // borrar la fila vieja y escribir la nueva también cuando lo único que
    // cambió es `summary`.
    expect(await buscar("estudia")).toContain("intro");

    const modificada = { ...pageIntro, summary: "Panorama del cuatrimestre." };
    const result = (await (await sync([modificada, pageApunte])).json()) as SyncResult;
    expect(result).toMatchObject({ created: 0, updated: 1, deleted: 0 });

    expect(await buscar("panorama")).toContain("intro");
    expect(await buscar("estudia")).not.toContain("intro");
  });

  it("el índice queda íntegro contra la tabla de páginas", async () => {
    await expect(
      h.db.run(sql`INSERT INTO pages_fts (pages_fts) VALUES ('integrity-check')`),
    ).resolves.toBeDefined();
  });
});

describe("page_links: el grafo de la materia lo llena el sync", () => {
  let h: Harness;

  beforeAll(async () => {
    h = await createHarness();
  });

  afterAll(() => h.close());

  const edges = async (): Promise<string[]> =>
    (
      await h.db.all<{ from_slug: string; to_slug: string }>(
        sql`SELECT from_slug, to_slug FROM page_links ORDER BY from_slug, to_slug`,
      )
    ).map((row) => `${row.from_slug}->${row.to_slug}`);

  const sync = (pages = [pageIntro, pageTeorema, pageApunte]) =>
    h.json("PUT", "/api/subjects/demo/sync", demoPayload(pages), {
      authorization: `Bearer ${h.env.SYNC_TOKEN}`,
    });

  it("guarda solo los wikilinks cuyo destino existe", async () => {
    const rota = {
      ...pageTeorema,
      links: [{ slug: "pagina-fantasma" }, { slug: "intro" }, { slug: "teorema-central" }],
    };
    expect((await sync([pageIntro, rota, pageApunte])).status).toBe(200);
    // `pagina-fantasma` no existe y el enlace a sí misma no es una arista.
    expect(await edges()).toEqual([
      "apunte-clase->teorema-central",
      "intro->teorema-central",
      "teorema-central->intro",
    ]);
  });

  it("se reconstruye cuando una página se borra", async () => {
    expect((await sync([pageIntro, pageTeorema])).status).toBe(200);
    expect(await edges()).toEqual(["intro->teorema-central"]);
  });
});
