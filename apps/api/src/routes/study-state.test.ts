/**
 * Estado de estudio del usuario: favoritos, apuntes, tareas del plan e
 * intentos de quiz. Todo es por usuario y materia; nada se comparte.
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Note, QuizAttempt, StudyContent, StudyState } from "@sinapsis/contract";
import { ATTEMPTS_LIMIT } from "../services/study.js";
import { createHarness, type Harness, type UserClient } from "../test/harness.js";
import { demoPayload, demoStudy, pageIntro, pageTeorema } from "../test/fixtures.js";

describe("favoritos, apuntes, tareas e intentos", () => {
  let h: Harness;

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

  it("el estado arranca vacío", async () => {
    expect(await state()).toEqual({ srs: [], bookmarks: [], notes: [], tasksDone: [], attempts: [], planDates: {} });
  });

  it("exige sesión y 404 si la materia no existe", async () => {
    const anon = await createHarness();
    expect((await anon.request("/api/subjects/demo/study/state")).status).toBe(401);
    anon.close();

    for (const path of [
      "/api/subjects/nada/study/state",
      "/api/subjects/nada/bookmarks/intro",
      "/api/subjects/nada/tasks/tarea-leer",
    ]) {
      expect((await h.request(path, { method: path.includes("state") ? "GET" : "PUT" })).status).toBe(404);
    }
  });

  // -------------------------------------------------------------------------

  it("favoritos: alta idempotente, listado y baja", async () => {
    expect((await h.request("/api/subjects/demo/bookmarks/intro", { method: "PUT" })).status).toBe(204);
    expect((await h.request("/api/subjects/demo/bookmarks/intro", { method: "PUT" })).status).toBe(204);
    expect((await state()).bookmarks).toEqual(["intro"]);

    expect(
      (await h.request("/api/subjects/demo/bookmarks/teorema-central", { method: "PUT" })).status,
    ).toBe(204);
    expect((await state()).bookmarks.sort()).toEqual(["intro", "teorema-central"]);

    expect((await h.request("/api/subjects/demo/bookmarks/intro", { method: "DELETE" })).status).toBe(204);
    expect((await state()).bookmarks).toEqual(["teorema-central"]);
    // Borrar algo que no está tampoco falla.
    expect((await h.request("/api/subjects/demo/bookmarks/intro", { method: "DELETE" })).status).toBe(204);
  });

  it("favoritos: 404 si la página no existe", async () => {
    const res = await h.request("/api/subjects/demo/bookmarks/pagina-fantasma", { method: "PUT" });
    expect(res.status).toBe(404);
    expect((await res.json()) as { error: string }).toEqual({ error: "La página no existe" });
  });

  // -------------------------------------------------------------------------

  it("apuntes: se guardan, se pisan y se borran", async () => {
    const res = await h.json("PUT", "/api/subjects/demo/notes/intro", { body: "Repasar el muestreo." });
    expect(res.status).toBe(200);
    const note = (await res.json()) as Note;
    expect(note).toMatchObject({ page: "intro", body: "Repasar el muestreo." });
    expect(Date.parse(note.updatedAt)).toBeLessThanOrEqual(Date.now());

    expect((await state()).notes).toEqual([note]);

    const segunda = (await (
      await h.json("PUT", "/api/subjects/demo/notes/intro", { body: "Ahora con la corrección." })
    ).json()) as Note;
    expect(segunda.body).toBe("Ahora con la corrección.");
    expect((await state()).notes).toHaveLength(1);

    expect((await h.request("/api/subjects/demo/notes/intro", { method: "DELETE" })).status).toBe(204);
    expect((await state()).notes).toEqual([]);
  });

  it("apuntes: 404 si la página no existe y 400 si el cuerpo es enorme", async () => {
    expect(
      (await h.json("PUT", "/api/subjects/demo/notes/pagina-fantasma", { body: "hola" })).status,
    ).toBe(404);
    expect(
      (await h.json("PUT", "/api/subjects/demo/notes/intro", { body: "x".repeat(50_001) })).status,
    ).toBe(400);
    expect(
      (await h.json("PUT", "/api/subjects/demo/notes/intro", { body: "x".repeat(50_000) })).status,
    ).toBe(200);
    await h.request("/api/subjects/demo/notes/intro", { method: "DELETE" });
  });

  // -------------------------------------------------------------------------

  it("tareas del plan: marcar y desmarcar", async () => {
    expect((await h.request("/api/subjects/demo/tasks/tarea-leer", { method: "PUT" })).status).toBe(204);
    expect((await h.request("/api/subjects/demo/tasks/tarea-leer", { method: "PUT" })).status).toBe(204);
    expect((await h.request("/api/subjects/demo/tasks/tarea-quiz", { method: "PUT" })).status).toBe(204);
    expect((await state()).tasksDone).toEqual(["tarea-leer", "tarea-quiz"]);

    expect((await h.request("/api/subjects/demo/tasks/tarea-leer", { method: "DELETE" })).status).toBe(204);
    expect((await state()).tasksDone).toEqual(["tarea-quiz"]);
  });

  it("tareas: 400 si el id no tiene formato de StudyId", async () => {
    const res = await h.request("/api/subjects/demo/tasks/tarea%20con%20espacios", { method: "PUT" });
    expect(res.status).toBe(400);
  });

  // -------------------------------------------------------------------------

  it("intentos de quiz: se guardan y vuelven en el estado", async () => {
    const res = await h.json("POST", "/api/subjects/demo/quiz/quiz-base/attempts", {
      score: 3,
      total: 5,
    });
    expect(res.status).toBe(201);
    const attempt = (await res.json()) as QuizAttempt;
    expect(attempt).toMatchObject({ quizId: "quiz-base", score: 3, total: 5 });

    const { attempts } = await state();
    expect(attempts).toHaveLength(1);
    expect(attempts[0]).toEqual(attempt);
  });

  it("intentos: rechaza puntajes imposibles", async () => {
    const post = (body: unknown) => h.json("POST", "/api/subjects/demo/quiz/quiz-base/attempts", body);
    expect((await post({ score: 6, total: 5 })).status).toBe(400);
    expect((await post({ score: -1, total: 5 })).status).toBe(400);
    expect((await post({ score: 0, total: 0 })).status).toBe(400);
    expect((await post({ score: 1.5, total: 5 })).status).toBe(400);
    expect((await post({ total: 5 })).status).toBe(400);
    // El borde válido sí entra.
    expect((await post({ score: 5, total: 5 })).status).toBe(201);
  });

  it("intentos: el estado devuelve los últimos 50", async () => {
    for (let i = 0; i < ATTEMPTS_LIMIT; i += 1) {
      const res = await h.json("POST", "/api/subjects/demo/quiz/quiz-otro/attempts", {
        score: 1,
        total: 2,
      });
      expect(res.status).toBe(201);
    }
    const { attempts } = await state();
    expect(attempts).toHaveLength(ATTEMPTS_LIMIT);
  });
});

describe("el estado de estudio no se filtra entre usuarios", () => {
  let h: Harness;
  let otro: UserClient;

  const stateOf = async (client: { request: Harness["request"] }): Promise<StudyState> =>
    (await (await client.request("/api/subjects/demo/study/state")).json()) as StudyState;

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
    otro = await h.otherUser({ email: "segunda@sinapsis.local", name: "Segunda persona" });

    // El primero deja de todo.
    await h.request("/api/subjects/demo/bookmarks/intro", { method: "PUT" });
    await h.json("PUT", "/api/subjects/demo/notes/intro", { body: "Mi apunte." });
    await h.request("/api/subjects/demo/tasks/tarea-leer", { method: "PUT" });
    await h.json("POST", "/api/subjects/demo/quiz/quiz-base/attempts", { score: 4, total: 5 });
    await h.json("POST", "/api/subjects/demo/study/srs/carta-tcl", { grade: 3 });
  });

  afterAll(() => h.close());

  it("el segundo usuario arranca con el estado vacío", async () => {
    expect(await stateOf(otro)).toEqual({
      srs: [],
      bookmarks: [],
      notes: [],
      tasksDone: [],
      attempts: [],
      planDates: {},
    });
  });

  it("lo que escribe el segundo no aparece en el estado del primero", async () => {
    expect(
      (await otro.request("/api/subjects/demo/bookmarks/teorema-central", { method: "PUT" })).status,
    ).toBe(204);
    expect(
      (await otro.json("PUT", "/api/subjects/demo/notes/teorema-central", { body: "Apunte ajeno." }))
        .status,
    ).toBe(200);
    expect((await otro.json("POST", "/api/subjects/demo/study/srs/carta-tcl", { grade: 1 })).status).toBe(200);

    const mio = await stateOf(h);
    expect(mio.bookmarks).toEqual(["intro"]);
    expect(mio.notes.map((n) => n.page)).toEqual(["intro"]);
    expect(mio.tasksDone).toEqual(["tarea-leer"]);
    expect(mio.attempts).toHaveLength(1);
    expect(mio.srs).toHaveLength(1);
    expect(mio.srs[0]).toMatchObject({ cardId: "carta-tcl", lastGrade: 3, lapses: 0 });

    const ajeno = await stateOf(otro);
    expect(ajeno.bookmarks).toEqual(["teorema-central"]);
    expect(ajeno.notes.map((n) => n.page)).toEqual(["teorema-central"]);
    expect(ajeno.tasksDone).toEqual([]);
    expect(ajeno.attempts).toEqual([]);
    expect(ajeno.srs[0]).toMatchObject({ cardId: "carta-tcl", lastGrade: 1, lapses: 1 });
  });

  it("el segundo usuario tampoco puede borrar lo del primero", async () => {
    expect(
      (await otro.request("/api/subjects/demo/bookmarks/intro", { method: "DELETE" })).status,
    ).toBe(204);
    expect((await stateOf(h)).bookmarks).toEqual(["intro"]);
  });
});

describe("el SRS del estado se recorta al material vigente (bug 7)", () => {
  let h: Harness;

  const sync = (study: StudyContent) =>
    h.json("PUT", "/api/subjects/demo/sync", demoPayload([pageIntro, pageTeorema], study), {
      authorization: `Bearer ${h.env.SYNC_TOKEN}`,
    });

  const state = async (): Promise<StudyState> =>
    (await (await h.request("/api/subjects/demo/study/state")).json()) as StudyState;

  beforeAll(async () => {
    h = await createHarness();
    expect((await sync(demoStudy())).status).toBe(200);
    await h.login();
  });

  afterAll(() => h.close());

  it("devuelve solo las tarjetas que existen hoy", async () => {
    // Una tarjeta autoral, una del mazo automático y una que no está en ningún
    // mazo (quedó de un sync anterior): el POST acepta las tres.
    for (const cardId of ["carta-tcl", "auto:intro", "carta-vieja"]) {
      expect((await h.json("POST", `/api/subjects/demo/study/srs/${cardId}`, { grade: 3 })).status).toBe(200);
    }
    expect((await state()).srs.map((s) => s.cardId).sort()).toEqual(["auto:intro", "carta-tcl"]);
  });

  it("la fila no se borra: si la tarjeta vuelve al material, vuelve su progreso", async () => {
    const study = demoStudy();
    study.decks[0]!.cards.push({
      id: "carta-vieja",
      front: "¿Qué es una muestra?",
      back: "Un subconjunto de la población.",
      tags: [],
    });
    expect((await sync(study)).status).toBe(200);

    const vieja = (await state()).srs.find((s) => s.cardId === "carta-vieja");
    expect(vieja).toMatchObject({ reps: 1, lastGrade: 3 });
  });
});

describe("fechas de las instancias del plan", () => {
  let h: Harness;

  const state = async (): Promise<StudyState> =>
    (await (await h.request("/api/subjects/demo/study/state")).json()) as StudyState;

  const put = (key: string, body: unknown) =>
    h.json("PUT", `/api/subjects/demo/study/plan-dates/${key}`, body);

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

  it("se cargan, se pisan y vuelven en el estado", async () => {
    expect((await put("parcialito1", { date: "2026-04-15" })).status).toBe(204);
    expect((await put("parcial", { date: "2026-06-02" })).status).toBe(204);
    expect((await state()).planDates).toEqual({ parcial: "2026-06-02", parcialito1: "2026-04-15" });

    // El upsert pisa la fecha anterior, no agrega una fila.
    expect((await put("parcialito1", { date: "2026-04-22" })).status).toBe(204);
    expect((await state()).planDates).toEqual({ parcial: "2026-06-02", parcialito1: "2026-04-22" });
  });

  it("borrar una instancia es idempotente y no toca a las demás", async () => {
    expect(
      (await h.request("/api/subjects/demo/study/plan-dates/parcial", { method: "DELETE" })).status,
    ).toBe(204);
    expect((await state()).planDates).toEqual({ parcialito1: "2026-04-22" });

    // Borrar algo que no está tampoco falla.
    expect(
      (await h.request("/api/subjects/demo/study/plan-dates/parcial", { method: "DELETE" })).status,
    ).toBe(204);
    expect((await state()).planDates).toEqual({ parcialito1: "2026-04-22" });
  });

  it("«Reiniciar el plan» borra las tareas y deja las fechas", async () => {
    expect((await put("final", { date: "2026-07-30" })).status).toBe(204);
    expect((await h.request("/api/subjects/demo/tasks/tarea-leer", { method: "PUT" })).status).toBe(204);
    expect((await h.request("/api/subjects/demo/tasks/tarea-quiz", { method: "PUT" })).status).toBe(204);
    expect((await state()).tasksDone).toEqual(["tarea-leer", "tarea-quiz"]);

    expect((await h.request("/api/subjects/demo/tasks", { method: "DELETE" })).status).toBe(204);

    const despues = await state();
    expect(despues.tasksDone).toEqual([]);
    expect(despues.planDates).toEqual({ final: "2026-07-30", parcialito1: "2026-04-22" });

    // Y es idempotente.
    expect((await h.request("/api/subjects/demo/tasks", { method: "DELETE" })).status).toBe(204);
    expect((await state()).tasksDone).toEqual([]);
  });

  it("«Borrar fechas» borra todas las de la materia y deja el resto del estado", async () => {
    expect((await h.request("/api/subjects/demo/tasks/tarea-leer", { method: "PUT" })).status).toBe(204);
    expect((await h.request("/api/subjects/demo/study/plan-dates", { method: "DELETE" })).status).toBe(204);

    const despues = await state();
    expect(despues.planDates).toEqual({});
    expect(despues.tasksDone).toEqual(["tarea-leer"]);

    // Idempotente: borrar cuando ya no hay nada sigue siendo 204.
    expect((await h.request("/api/subjects/demo/study/plan-dates", { method: "DELETE" })).status).toBe(204);
  });

  it("400 si la clave o la fecha no tienen formato válido", async () => {
    for (const key of ["clave%20con%20espacios", "-arranca-con-guion"]) {
      const res = await h.json("PUT", `/api/subjects/demo/study/plan-dates/${key}`, {
        date: "2026-04-15",
      });
      expect(res.status).toBe(400);
      expect((await res.json()) as { error: string }).toEqual({
        error: "El id de la instancia no tiene un formato válido",
      });
      expect(
        (await h.request(`/api/subjects/demo/study/plan-dates/${key}`, { method: "DELETE" })).status,
      ).toBe(400);
    }

    for (const date of ["15/04/2026", "2026-4-15", "2026-04-15T00:00:00Z", "", 20260415, null]) {
      const res = await put("parcial", { date });
      expect(res.status).toBe(400);
      expect(((await res.json()) as { error: string }).error).toMatch(/^Fecha inválida — /);
    }
    expect((await put("parcial", {})).status).toBe(400);

    // El mensaje del formato dice CUÁL es el formato: «Invalid» a secas no
    // servía para corregir la llamada.
    const malFormato = await put("parcial", { date: "15/04/2026" });
    expect(((await malFormato.json()) as { error: string }).error).toContain("AAAA-MM-DD");

    // El estado no cambió con ninguno de los rechazos.
    expect((await state()).planDates).toEqual({});
  });

  /**
   * El formato no alcanza: `2026-13-45` cumple el patrón y no existe. Antes se
   * guardaba con 204 y volvía tal cual en el estado.
   */
  it("400 si la fecha tiene formato válido pero no existe en el calendario", async () => {
    for (const date of ["2026-13-45", "2026-02-30", "2025-02-29", "2026-00-10", "2026-04-31"]) {
      const res = await put("parcial", { date });
      expect(res.status).toBe(400);
      expect(((await res.json()) as { error: string }).error).toMatch(/calendario/);
    }
    expect((await state()).planDates).toEqual({});

    // El bisiesto sí pasa, y el 31 de un mes de 31 también.
    expect((await put("parcial", { date: "2028-02-29" })).status).toBe(204);
    expect((await put("final", { date: "2026-12-31" })).status).toBe(204);
    expect((await state()).planDates).toEqual({ final: "2026-12-31", parcial: "2028-02-29" });
    expect((await h.request("/api/subjects/demo/study/plan-dates", { method: "DELETE" })).status).toBe(204);
  });

  it("exige sesión y 404 si la materia no existe", async () => {
    const anon = await createHarness();
    expect(
      (await anon.json("PUT", "/api/subjects/demo/study/plan-dates/parcial", { date: "2026-06-02" }))
        .status,
    ).toBe(401);
    expect(
      (await anon.request("/api/subjects/demo/study/plan-dates/parcial", { method: "DELETE" })).status,
    ).toBe(401);
    expect((await anon.request("/api/subjects/demo/study/plan-dates", { method: "DELETE" })).status).toBe(401);
    expect((await anon.request("/api/subjects/demo/tasks", { method: "DELETE" })).status).toBe(401);
    anon.close();

    expect(
      (await h.json("PUT", "/api/subjects/nada/study/plan-dates/parcial", { date: "2026-06-02" }))
        .status,
    ).toBe(404);
    expect(
      (await h.request("/api/subjects/nada/study/plan-dates/parcial", { method: "DELETE" })).status,
    ).toBe(404);
    expect((await h.request("/api/subjects/nada/study/plan-dates", { method: "DELETE" })).status).toBe(404);
    expect((await h.request("/api/subjects/nada/tasks", { method: "DELETE" })).status).toBe(404);
  });

  it("las fechas no se filtran entre usuarios", async () => {
    const otro = await h.otherUser({ email: "fechas@sinapsis.local", name: "Otra cursada" });

    expect((await put("parcial", { date: "2026-06-02" })).status).toBe(204);
    expect(
      (await otro.json("PUT", "/api/subjects/demo/study/plan-dates/parcial", { date: "2026-06-09" }))
        .status,
    ).toBe(204);

    expect((await state()).planDates).toEqual({ parcial: "2026-06-02" });
    const ajeno = (await (
      await otro.request("/api/subjects/demo/study/state")
    ).json()) as StudyState;
    expect(ajeno.planDates).toEqual({ parcial: "2026-06-09" });

    // Y el borrado total del otro no toca las mías.
    expect(
      (await otro.request("/api/subjects/demo/study/plan-dates", { method: "DELETE" })).status,
    ).toBe(204);
    expect((await state()).planDates).toEqual({ parcial: "2026-06-02" });
  });
});
