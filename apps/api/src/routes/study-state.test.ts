/**
 * Estado de estudio del usuario: favoritos, apuntes, tareas del plan e
 * intentos de quiz. Todo es por usuario y materia; nada se comparte.
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Note, QuizAttempt, StudyState } from "@sinapsis/contract";
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
    expect(await state()).toEqual({ srs: [], bookmarks: [], notes: [], tasksDone: [], attempts: [] });
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
