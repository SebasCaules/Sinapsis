/**
 * SRS (SM-2 con cuatro notas, N0-28): el API aplica la función pura del
 * contrato y persiste el resultado por usuario y materia.
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { SrsState, StudyState } from "@sinapsis/contract";
import { createHarness, type Harness } from "../test/harness.js";
import { demoPayload, demoStudy, pageIntro, pageTeorema } from "../test/fixtures.js";

describe("SRS de una materia", () => {
  let h: Harness;

  const grade = (cardId: string, value: unknown) =>
    h.json("POST", `/api/subjects/demo/study/srs/${encodeURIComponent(cardId)}`, { grade: value });

  const gradeOk = async (cardId: string, value: number): Promise<SrsState> => {
    const res = await grade(cardId, value);
    expect(res.status).toBe(200);
    return (await res.json()) as SrsState;
  };

  const state = async (): Promise<StudyState> =>
    (await (await h.request("/api/subjects/demo/study/state")).json()) as StudyState;

  beforeAll(async () => {
    h = await createHarness();
    const res = await h.json(
      "PUT",
      "/api/subjects/demo/sync",
      demoPayload([pageIntro, pageTeorema], demoStudy()),
      { authorization: `Bearer ${h.env.SYNC_TOKEN}` },
    );
    expect(res.status).toBe(200);
    await h.login();
  });

  afterAll(() => h.close());

  it("exige sesión y 404 si la materia no existe", async () => {
    const anon = await createHarness();
    expect((await anon.json("POST", "/api/subjects/demo/study/srs/x", { grade: 3 })).status).toBe(401);
    anon.close();

    expect((await h.json("POST", "/api/subjects/nada/study/srs/x", { grade: 3 })).status).toBe(404);
  });

  it("la secuencia 3, 3, 4 hace crecer el intervalo y deja el vencimiento en el futuro", async () => {
    const uno = await gradeOk("carta-tcl", 3);
    expect(uno).toMatchObject({ cardId: "carta-tcl", interval: 1, reps: 1, lapses: 0, lastGrade: 3 });
    expect(uno.ease).toBeCloseTo(2.5, 5);

    const dos = await gradeOk("carta-tcl", 3);
    expect(dos).toMatchObject({ interval: 3, reps: 2, lapses: 0, lastGrade: 3 });

    const tres = await gradeOk("carta-tcl", 4);
    expect(tres).toMatchObject({ reps: 3, lapses: 0, lastGrade: 4 });
    expect(tres.ease).toBeGreaterThan(dos.ease);
    expect(tres.interval).toBeGreaterThan(dos.interval);

    expect([uno.interval, dos.interval, tres.interval]).toEqual([1, 3, 10]);
    for (const paso of [uno, dos, tres]) {
      expect(Date.parse(paso.due)).toBeGreaterThan(Date.now());
    }
  });

  it("la nota 1 suma un lapso, vuelve el intervalo a 0 y baja la facilidad", async () => {
    const antes = (await state()).srs.find((s) => s.cardId === "carta-tcl");
    expect(antes).toBeDefined();

    const otraVez = await gradeOk("carta-tcl", 1);
    expect(otraVez).toMatchObject({ interval: 0, reps: 0, lapses: 1, lastGrade: 1 });
    expect(otraVez.ease).toBeCloseTo((antes?.ease ?? 0) - 0.2, 5);
    // Con intervalo 0 la tarjeta vuelve en diez minutos, no al día siguiente.
    expect(Date.parse(otraVez.due)).toBeGreaterThan(Date.now());
    expect(Date.parse(otraVez.due)).toBeLessThan(Date.now() + 60 * 60 * 1000);
  });

  it("el estado de estudio devuelve las tarjetas repasadas", async () => {
    await gradeOk("auto:intro", 3);
    const { srs } = await state();
    expect(srs.map((s) => s.cardId).sort()).toEqual(["auto:intro", "carta-tcl"]);
  });

  it("DELETE resetea la tarjeta y la siguiente nota arranca de cero", async () => {
    const res = await h.request("/api/subjects/demo/study/srs/carta-tcl", { method: "DELETE" });
    expect(res.status).toBe(204);
    expect((await state()).srs.map((s) => s.cardId)).toEqual(["auto:intro"]);

    const nueva = await gradeOk("carta-tcl", 3);
    expect(nueva).toMatchObject({ interval: 1, reps: 1, lapses: 0 });
    expect(nueva.ease).toBeCloseTo(2.5, 5);

    // Borrar una tarjeta que nunca se repasó también responde 204.
    expect(
      (await h.request("/api/subjects/demo/study/srs/nunca-vista", { method: "DELETE" })).status,
    ).toBe(204);
  });

  it("acepta tarjetas que no están en la base (los mazos automáticos no se guardan)", async () => {
    const auto = await gradeOk("auto:teorema-central", 2);
    expect(auto.cardId).toBe("auto:teorema-central");
    expect(auto.reps).toBe(1);
  });

  it("rechaza una nota fuera de 1..4 y un cuerpo sin nota", async () => {
    expect((await grade("carta-tcl", 7)).status).toBe(400);
    expect((await grade("carta-tcl", 0)).status).toBe(400);
    expect((await grade("carta-tcl", 2.5)).status).toBe(400);
    expect((await grade("carta-tcl", "3")).status).toBe(400);
    expect((await h.json("POST", "/api/subjects/demo/study/srs/carta-tcl", {})).status).toBe(400);
  });

  it("rechaza un id de tarjeta con un formato imposible", async () => {
    const res = await grade("carta con espacios", 3);
    expect(res.status).toBe(400);
    expect((await res.json()) as { error: string }).toMatchObject({
      error: expect.stringContaining("formato"),
    });
  });
});
