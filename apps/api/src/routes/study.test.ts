/**
 * Material de estudio: lo autoral llega en `SyncPayload.study` y los mazos
 * automáticos los calcula el contrato en cada lectura (N0-27).
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { StudyContent, SyncResult } from "@sinapsis/contract";
import { createHarness, type Harness } from "../test/harness.js";
import {
  demoPayload,
  demoStudy,
  pageApunte,
  pageIntro,
  pageSinResumen,
  pageTeorema,
} from "../test/fixtures.js";

const PAGINAS = [pageIntro, pageTeorema, pageApunte, pageSinResumen];

describe("GET /api/subjects/:slug/study con material autoral", () => {
  let h: Harness;

  const study = async (slug = "demo"): Promise<StudyContent> =>
    (await (await h.request(`/api/subjects/${slug}/study`)).json()) as StudyContent;

  beforeAll(async () => {
    h = await createHarness();
    const res = await h.json("PUT", "/api/subjects/demo/sync", demoPayload(PAGINAS, demoStudy()), {
      authorization: `Bearer ${h.env.SYNC_TOKEN}`,
    });
    expect(res.status).toBe(200);
    expect(((await res.json()) as SyncResult).warnings).toEqual([]);
    await h.login();
  });

  afterAll(() => h.close());

  it("exige sesión y 404 si la materia no existe", async () => {
    const anon = await createHarness();
    expect((await anon.request("/api/subjects/demo/study")).status).toBe(401);
    anon.close();

    const res = await h.request("/api/subjects/no-existe/study");
    expect(res.status).toBe(404);
    expect((await res.json()) as { error: string }).toEqual({ error: "La materia no existe" });
  });

  it("devuelve el mazo autoral primero y los automáticos al final", async () => {
    const content = await study();
    expect(content.decks.map((d) => d.id)).toEqual(["mazo-base", "auto-1", "auto-2"]);
    expect(content.decks.map((d) => d.source)).toEqual(["authored", "auto", "auto"]);
    expect(content.decks[0]?.cards.map((c) => c.id)).toEqual(["carta-tcl", "carta-intro"]);
  });

  it("los mazos automáticos saltean las fuentes y las páginas sin resumen", async () => {
    const content = await study();
    const auto1 = content.decks.find((d) => d.id === "auto-1");
    const auto2 = content.decks.find((d) => d.id === "auto-2");

    // División 1: `intro` sí; `apunte-clase` es fuente y `sin-resumen` no tiene resumen.
    expect(auto1?.cards.map((c) => c.id)).toEqual(["auto:intro"]);
    expect(auto1?.title).toBe("Resúmenes · Unidad 1 · Primera parte");
    expect(auto1?.cards[0]).toMatchObject({
      front: "Introducción",
      back: "Qué estudia la materia.",
      page: "intro",
      division: "1",
    });
    expect(auto2?.cards.map((c) => c.id)).toEqual(["auto:teorema-central"]);
  });

  it("quizzes, plan y kits vienen tal cual del sync", async () => {
    const content = await study();
    expect(content.quizzes.map((q) => q.id)).toEqual(["quiz-base"]);
    expect(content.quizzes[0]?.questions[0]?.options).toHaveLength(2);
    expect(content.plan?.phases.map((p) => p.id)).toEqual(["parcial-1"]);
    expect(content.plan?.phases[0]?.milestones[0]?.tasks.map((t) => t.id)).toEqual([
      "tarea-leer",
      "tarea-mazo",
      "tarea-quiz",
    ]);
    expect(content.kits.map((k) => k.id)).toEqual(["kit-parcial"]);
  });

  it("los mazos automáticos siguen a las páginas sin re-enviar el material", async () => {
    const res = await h.json(
      "PUT",
      "/api/subjects/demo/sync",
      demoPayload([pageIntro, pageApunte, pageSinResumen], demoStudy()),
      { authorization: `Bearer ${h.env.SYNC_TOKEN}` },
    );
    expect(res.status).toBe(200);

    const content = await study();
    // Se fue la única página de la división 2: su mazo automático desaparece.
    expect(content.decks.map((d) => d.id)).toEqual(["mazo-base", "auto-1"]);
  });

  it("un sync sin `study` conserva el material ya guardado", async () => {
    const res = await h.json("PUT", "/api/subjects/demo/sync", demoPayload(PAGINAS), {
      authorization: `Bearer ${h.env.SYNC_TOKEN}`,
    });
    expect(res.status).toBe(200);
    expect((await study()).decks.map((d) => d.id)).toEqual(["mazo-base", "auto-1", "auto-2"]);
  });

  it("un `study` nuevo reemplaza al anterior por completo", async () => {
    const res = await h.json(
      "PUT",
      "/api/subjects/demo/sync",
      demoPayload(PAGINAS, demoStudy({ decks: [], quizzes: [], kits: [] })),
      { authorization: `Bearer ${h.env.SYNC_TOKEN}` },
    );
    expect(res.status).toBe(200);

    const content = await study();
    expect(content.decks.map((d) => d.id)).toEqual(["auto-1", "auto-2"]);
    expect(content.quizzes).toEqual([]);
    expect(content.kits).toEqual([]);
    expect(content.plan?.title).toBe("Plan de estudio");
  });
});

describe("GET /api/subjects/:slug/study sin material autoral", () => {
  let h: Harness;

  beforeAll(async () => {
    h = await createHarness();
    await h.login();
  });

  afterAll(() => h.close());

  it("una materia sin sync devuelve el material vacío", async () => {
    const creada = await h.json("POST", "/api/subjects", {
      slug: "vacia",
      name: "Materia vacía",
      code: "00.02",
      institution: "ITBA",
      semester: "2026-1C",
      division: { singular: "Unidad", abbr: "U", plural: "Unidades" },
    });
    expect(creada.status).toBe(201);

    const content = (await (await h.request("/api/subjects/vacia/study")).json()) as StudyContent;
    expect(content).toEqual({ decks: [], quizzes: [], plan: null, kits: [] });
  });

  it("una materia sincronizada sin `study` devuelve solo los mazos automáticos", async () => {
    const res = await h.json("PUT", "/api/subjects/demo/sync", demoPayload(PAGINAS), {
      authorization: `Bearer ${h.env.SYNC_TOKEN}`,
    });
    expect(res.status).toBe(200);

    const content = (await (await h.request("/api/subjects/demo/study")).json()) as StudyContent;
    expect(content.decks.map((d) => d.id)).toEqual(["auto-1", "auto-2"]);
    expect(content.decks.every((d) => d.source === "auto")).toBe(true);
    expect(content.quizzes).toEqual([]);
    expect(content.plan).toBeNull();
    expect(content.kits).toEqual([]);
  });
});

describe("el sync avisa de las referencias rotas del material", () => {
  let h: Harness;

  beforeAll(async () => {
    h = await createHarness();
  });

  afterAll(() => h.close());

  it("mazos, quizzes, kits y tareas que apuntan a algo inexistente", async () => {
    const roto = demoStudy({
      decks: [
        {
          id: "mazo-roto",
          title: "Mazo roto",
          source: "authored",
          cards: [
            { id: "carta-rota", front: "Anverso", back: "Reverso", page: "pagina-fantasma", tags: [] },
          ],
        },
      ],
      kits: [
        {
          id: "kit-roto",
          title: "Kit roto",
          divisions: [],
          pages: ["pagina-fantasma"],
          decks: ["mazo-inexistente"],
          quizzes: ["quiz-inexistente"],
          tools: [],
        },
      ],
      plan: {
        title: "Plan roto",
        tracks: [],
        phases: [
          {
            id: "fase-1",
            title: "Fase",
            milestones: [
              {
                id: "hito-1",
                title: "Hito",
                divisions: [],
                tasks: [
                  { id: "tarea-rota", label: "Leer una división que no existe", kind: "read", target: "99" },
                  { id: "tarea-mazo", label: "Repasar", kind: "cards", target: "mazo-inexistente" },
                ],
              },
            ],
          },
        ],
      },
    });

    const res = await h.json("PUT", "/api/subjects/demo/sync", demoPayload(PAGINAS, roto), {
      authorization: `Bearer ${h.env.SYNC_TOKEN}`,
    });
    expect(res.status).toBe(200);

    const { warnings } = (await res.json()) as SyncResult;
    const texto = warnings.join(" · ");
    expect(texto).toContain('la tarjeta "carta-rota" cita la página "pagina-fantasma"');
    expect(texto).toContain('kit "kit-roto": la página "pagina-fantasma" no existe');
    expect(texto).toContain('kit "kit-roto": el mazo "mazo-inexistente" no existe');
    expect(texto).toContain('kit "kit-roto": el quiz "quiz-inexistente" no existe');
    expect(texto).toContain('tarea "tarea-rota": la división "99" no está declarada');
    expect(texto).toContain('tarea "tarea-mazo": el mazo "mazo-inexistente" no existe');
    // El quiz de la fixture cita una página que sí existe: no genera ruido.
    expect(texto).not.toContain("quiz-base");
    expect(warnings).toHaveLength(6);
  });

  it("un material coherente no genera ninguna advertencia", async () => {
    const res = await h.json("PUT", "/api/subjects/demo/sync", demoPayload(PAGINAS, demoStudy()), {
      authorization: `Bearer ${h.env.SYNC_TOKEN}`,
    });
    expect(((await res.json()) as SyncResult).warnings).toEqual([]);
  });
});
