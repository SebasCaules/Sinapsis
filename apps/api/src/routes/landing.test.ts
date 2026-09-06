import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { SubjectCard, SubjectDetail } from "@sinapsis/contract";
import { createHarness, type Harness } from "../test/harness.js";
import { demoPayload } from "../test/fixtures.js";

const divisionLabel = { singular: "Unidad", abbr: "U", plural: "Unidades" };

describe("landing, materias y progreso", () => {
  let h: Harness;

  const landing = async (): Promise<SubjectCard[]> =>
    (await (await h.request("/api/landing")).json()) as SubjectCard[];

  beforeAll(async () => {
    h = await createHarness();
    await h.login();
  });

  afterAll(() => h.close());

  it("exige sesión", async () => {
    const anon = await createHarness();
    expect((await anon.request("/api/landing")).status).toBe(401);
    expect(
      (await anon.json("POST", "/api/subjects", { slug: "x", name: "X" })).status,
    ).toBe(401);
    anon.close();
  });

  it("arranca vacía", async () => {
    expect(await landing()).toEqual([]);
  });

  it("crea una materia placeholder y la muestra en la landing", async () => {
    const res = await h.json("POST", "/api/subjects", {
      slug: "quimica",
      name: "Química General",
      code: "12.01",
      institution: "ITBA",
      semester: "2026-1C",
      division: divisionLabel,
    });
    expect(res.status).toBe(201);

    const card = (await res.json()) as SubjectCard;
    expect(card).toMatchObject({
      slug: "quimica",
      name: "Química General",
      placeholder: true,
      divisionsCount: 0,
      pagesCount: 0,
      studiedCount: 0,
      semester: "2026-1C",
      position: 0,
      lastSyncAt: null,
    });
    // Sin color declarado se usa el de reserva.
    expect(card.color).toBe("--u1");

    expect((await landing()).map((c) => c.slug)).toEqual(["quimica"]);
  });

  it("una materia placeholder se puede abrir con un config sintético", async () => {
    const detail = (await (await h.request("/api/subjects/quimica")).json()) as SubjectDetail;
    expect(detail.placeholder).toBe(true);
    expect(detail.config.slug).toBe("quimica");
    expect(detail.config.divisions).toEqual([]);
    expect(detail.config.pageTypes).toEqual([]);
    expect(detail.config.rail).toEqual([]);
    expect(detail.config.division).toEqual(divisionLabel);
    expect(detail.pages).toEqual([]);
  });

  it("rechaza agregar dos veces la misma materia (409)", async () => {
    const res = await h.json("POST", "/api/subjects", {
      slug: "quimica",
      name: "Química General",
      code: "12.01",
      institution: "ITBA",
      semester: "2026-2C",
      division: divisionLabel,
    });
    expect(res.status).toBe(409);
  });

  it("rechaza un slug inválido con 400", async () => {
    const res = await h.json("POST", "/api/subjects", {
      slug: "Química General",
      name: "Química General",
      code: "12.01",
      institution: "ITBA",
      semester: "2026-1C",
      division: divisionLabel,
    });
    expect(res.status).toBe(400);
  });

  it("apila las materias nuevas al final del cuatrimestre", async () => {
    const res = await h.json("POST", "/api/subjects", {
      slug: "fisica",
      name: "Física I",
      code: "93.26",
      institution: "ITBA",
      semester: "2026-1C",
      color: "--u7",
      division: divisionLabel,
    });
    expect(res.status).toBe(201);
    expect((await res.json()) as SubjectCard).toMatchObject({ position: 1, color: "--u7" });
  });

  it("PUT /api/landing mueve una materia de cuatrimestre y reordena", async () => {
    const res = await h.json("PUT", "/api/landing", {
      items: [
        { slug: "fisica", semester: "2026-2C", position: 0 },
        { slug: "quimica", semester: "2026-1C", position: 0 },
        // Un slug que no está en la landing del usuario se ignora.
        { slug: "inexistente", semester: "2026-2C", position: 5 },
      ],
    });
    expect(res.status).toBe(200);

    const cards = (await res.json()) as SubjectCard[];
    // Cuatrimestre descendente: 2026-2C antes que 2026-1C.
    expect(cards.map((c) => [c.slug, c.semester, c.position])).toEqual([
      ["fisica", "2026-2C", 0],
      ["quimica", "2026-1C", 0],
    ]);
    expect(await landing()).toEqual(cards);
  });

  it("una materia sincronizada trae divisiones, páginas de contenido y progreso", async () => {
    const sync = await h.json("PUT", "/api/subjects/demo/sync", demoPayload(), {
      authorization: `Bearer ${h.env.SYNC_TOKEN}`,
    });
    expect(sync.status).toBe(200);

    const added = await h.json("POST", "/api/subjects", {
      slug: "demo",
      name: "Materia Demo",
      code: "00.01",
      institution: "ITBA",
      semester: "2026-1C",
      division: divisionLabel,
    });
    expect(added.status).toBe(201);

    const card = (await added.json()) as SubjectCard;
    expect(card).toMatchObject({
      placeholder: false,
      divisionsCount: 2,
      // apunte-clase es de tipo `fuente` (countsAsContent: false) y no cuenta.
      pagesCount: 2,
      studiedCount: 0,
      color: "--u4",
    });
    expect(card.lastSyncAt).toBeTypeOf("string");
  });

  it("PUT /progress marca la página y la landing lo cuenta", async () => {
    expect((await h.request("/api/subjects/demo/progress/intro", { method: "PUT" })).status).toBe(204);

    const card = (await landing()).find((c) => c.slug === "demo");
    expect(card?.studiedCount).toBe(1);

    const detail = (await (await h.request("/api/subjects/demo")).json()) as SubjectDetail;
    expect(detail.studied).toEqual(["intro"]);
  });

  it("marcar una página que no cuenta como contenido no mueve studiedCount", async () => {
    expect(
      (await h.request("/api/subjects/demo/progress/apunte-clase", { method: "PUT" })).status,
    ).toBe(204);
    const card = (await landing()).find((c) => c.slug === "demo");
    expect(card?.studiedCount).toBe(1);

    await h.request("/api/subjects/demo/progress/apunte-clase", { method: "DELETE" });
  });

  it("PUT /progress de una página inexistente devuelve 404", async () => {
    expect((await h.request("/api/subjects/demo/progress/fantasma", { method: "PUT" })).status).toBe(404);
    expect((await h.request("/api/subjects/nada/progress/intro", { method: "PUT" })).status).toBe(404);
  });

  it("DELETE /progress desmarca", async () => {
    expect((await h.request("/api/subjects/demo/progress/intro", { method: "DELETE" })).status).toBe(204);
    const card = (await landing()).find((c) => c.slug === "demo");
    expect(card?.studiedCount).toBe(0);
  });

  it("DELETE /subjects/:slug/landing la quita sin borrar la materia ni el progreso", async () => {
    expect((await h.request("/api/subjects/demo/progress/intro", { method: "PUT" })).status).toBe(204);

    const res = await h.request("/api/subjects/demo/landing", { method: "DELETE" });
    expect(res.status).toBe(204);
    expect((await landing()).map((c) => c.slug)).not.toContain("demo");

    // La materia sigue siendo consultable aunque no esté en la landing (N0-6).
    const detail = (await (await h.request("/api/subjects/demo")).json()) as SubjectDetail;
    expect(detail.pages).toHaveLength(3);
    expect(detail.studied).toEqual(["intro"]);

    // Y al volver a agregarla, el progreso sigue ahí.
    const again = await h.json("POST", "/api/subjects", {
      slug: "demo",
      name: "Materia Demo",
      code: "00.01",
      institution: "ITBA",
      semester: "2026-1C",
      division: divisionLabel,
    });
    expect(again.status).toBe(201);
    expect((await again.json()) as SubjectCard).toMatchObject({ studiedCount: 1 });
  });

  it("el progreso sobrevive a un sync que borra la página", async () => {
    const payload = demoPayload();
    const sinIntro = { ...payload, pages: payload.pages.filter((p) => p.slug !== "intro") };
    const res = await h.json("PUT", "/api/subjects/demo/sync", sinIntro, {
      authorization: `Bearer ${h.env.SYNC_TOKEN}`,
    });
    expect(res.status).toBe(200);

    // La página no existe: no se cuenta ni se lista…
    const card = (await landing()).find((c) => c.slug === "demo");
    expect(card?.studiedCount).toBe(0);
    const detail = (await (await h.request("/api/subjects/demo")).json()) as SubjectDetail;
    expect(detail.studied).toEqual([]);

    // …pero al volver la página, la marca sigue guardada.
    const vuelve = await h.json("PUT", "/api/subjects/demo/sync", payload, {
      authorization: `Bearer ${h.env.SYNC_TOKEN}`,
    });
    expect(vuelve.status).toBe(200);
    const card2 = (await landing()).find((c) => c.slug === "demo");
    expect(card2?.studiedCount).toBe(1);
  });
});
