/**
 * Cuatrimestres de la landing (S-03, N0-32): `user_semesters` es lo único que
 * conserva un cuatrimestre vacío y el orden elegido por el usuario.
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { SubjectCard } from "@sinapsis/contract";
import { createHarness, type Harness, type UserClient } from "../test/harness.js";

const divisionLabel = { singular: "Unidad", abbr: "U", plural: "Unidades" };

describe("GET /api/landing/semesters y PUT /api/landing con `semesters`", () => {
  let h: Harness;

  const semesters = async (): Promise<string[]> =>
    (await (await h.request("/api/landing/semesters")).json()) as string[];

  const guardar = (body: unknown) => h.json("PUT", "/api/landing", body);

  const crear = (slug: string, semester: string) =>
    h.json("POST", "/api/subjects", {
      slug,
      name: slug,
      code: "00.01",
      institution: "ITBA",
      semester,
      division: divisionLabel,
    });

  beforeAll(async () => {
    h = await createHarness();
    await h.login();
  });

  afterAll(() => h.close());

  it("exige sesión", async () => {
    const anon = await createHarness();
    expect((await anon.request("/api/landing/semesters")).status).toBe(401);
    anon.close();
  });

  it("una landing vacía no tiene cuatrimestres", async () => {
    expect(await semesters()).toEqual([]);
  });

  it("sin declarar nada, salen los de las materias en orden descendente", async () => {
    expect((await crear("quimica", "2026-1C")).status).toBe(201);
    expect((await crear("fisica", "2026-2C")).status).toBe(201);
    expect(await semesters()).toEqual(["2026-2C", "2026-1C"]);
  });

  it("PUT con `semesters` guarda el orden y los cuatrimestres vacíos", async () => {
    const res = await guardar({ items: [], semesters: ["2027-1C", "2026-1C", "2026-2C"] });
    expect(res.status).toBe(200);
    // La respuesta sigue siendo la landing.
    expect(((await res.json()) as SubjectCard[]).map((c) => c.slug).sort()).toEqual([
      "fisica",
      "quimica",
    ]);
    // "2027-1C" no tiene materias y sobrevive igual, en la posición elegida.
    expect(await semesters()).toEqual(["2027-1C", "2026-1C", "2026-2C"]);
  });

  it("un cuatrimestre con materias que no se declaró se agrega al final", async () => {
    expect((await guardar({ items: [], semesters: ["2027-1C"] })).status).toBe(200);
    expect(await semesters()).toEqual(["2027-1C", "2026-2C", "2026-1C"]);
  });

  it("un PUT sin `semesters` no toca los declarados", async () => {
    const res = await guardar({
      items: [{ slug: "fisica", semester: "2027-1C", position: 0 }],
    });
    expect(res.status).toBe(200);
    expect(await semesters()).toEqual(["2027-1C", "2026-1C"]);
  });

  it("una lista vacía borra los declarados y quedan solo los de las materias", async () => {
    expect((await guardar({ items: [], semesters: [] })).status).toBe(200);
    expect(await semesters()).toEqual(["2027-1C", "2026-1C"]);

    // Y con las materias movidas, el orden es el canónico del contrato.
    expect(
      (
        await guardar({
          items: [
            { slug: "fisica", semester: "2026-2C", position: 0 },
            { slug: "quimica", semester: "2026-1C", position: 0 },
          ],
          semesters: [],
        })
      ).status,
    ).toBe(200);
    expect(await semesters()).toEqual(["2026-2C", "2026-1C"]);
  });

  it("descarta los repetidos conservando la primera aparición", async () => {
    expect(
      (await guardar({ items: [], semesters: ["2026-1C", "2026-2C", "2026-1C"] })).status,
    ).toBe(200);
    expect(await semesters()).toEqual(["2026-1C", "2026-2C"]);
  });

  it("normaliza el rótulo y deduplica por la forma canónica", async () => {
    expect(
      (await guardar({ items: [], semesters: ["2026-1c", "2026-1C", " 2026-2c "] })).status,
    ).toBe(200);
    expect(await semesters()).toEqual(["2026-1C", "2026-2C"]);
  });

  it("rechaza una lista de cuatrimestres inválida", async () => {
    expect((await guardar({ items: [], semesters: [""] })).status).toBe(400);
    expect((await guardar({ items: [], semesters: "2026-1C" })).status).toBe(400);
  });

  it("los cuatrimestres son de cada usuario", async () => {
    const otro: UserClient = await h.otherUser({ email: "tercera@sinapsis.local" });
    expect(await (await otro.request("/api/landing/semesters")).json()).toEqual([]);

    expect(
      (await otro.json("PUT", "/api/landing", { items: [], semesters: ["2030-1C"] })).status,
    ).toBe(200);
    expect(await (await otro.request("/api/landing/semesters")).json()).toEqual(["2030-1C"]);
    // El primero no se entera.
    expect(await semesters()).toEqual(["2026-1C", "2026-2C"]);
  });

  it("una materia creada con un rótulo no canónico cae en el cuatrimestre canónico", async () => {
    const res = await crear("algebra", "2025-2c");
    expect(res.status).toBe(201);
    expect(((await res.json()) as SubjectCard).semester).toBe("2025-2C");
    expect(await semesters()).toEqual(["2026-1C", "2026-2C", "2025-2C"]);

    // Y moverla en minúsculas tampoco abre un cuatrimestre nuevo.
    const movida = await guardar({ items: [{ slug: "algebra", semester: "2026-1c", position: 3 }] });
    expect(movida.status).toBe(200);
    const cards = (await movida.json()) as SubjectCard[];
    expect(cards.find((c) => c.slug === "algebra")?.semester).toBe("2026-1C");
    expect(await semesters()).toEqual(["2026-1C", "2026-2C"]);
  });
});
