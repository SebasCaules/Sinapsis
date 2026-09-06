/**
 * Las fixtures de estudio son el contrato de trabajo entre el mock y las vistas
 * del Sprint 2: si dejan de validar contra `StudyContent`, las vistas que se
 * tipan contra ellas estarían programando sobre algo que el API nunca va a
 * devolver. Por eso se validan acá y no en el navegador.
 */
import { describe, expect, it } from "vitest";
import { GraphData, SRS_DEFAULT, StudyContent, StudyState, sm2 } from "@sinapsis/contract";
import { authoredDecks, mockGraph, mockStudyContent, mockStudyState, probaPlan, quizContinuas } from "./study-fixture";

describe("mockStudyContent", () => {
  const content = StudyContent.parse(mockStudyContent());

  it("valida contra el contrato", () => {
    expect(content.decks.length).toBeGreaterThan(0);
  });

  it("trae los dos mazos autorales de cuatro tarjetas y al menos uno automático", () => {
    const authored = content.decks.filter((d) => d.source === "authored");
    expect(authored).toHaveLength(2);
    expect(authored.every((d) => d.cards.length === 4)).toBe(true);
    expect(content.decks.some((d) => d.source === "auto")).toBe(true);
  });

  it("los mazos automáticos salen de los resúmenes de las páginas", () => {
    const auto = content.decks.filter((d) => d.source === "auto");
    expect(auto.every((d) => d.cards.every((c) => c.id.startsWith("auto:")))).toBe(true);
  });

  it("hay matemática en el reverso de alguna tarjeta", () => {
    const backs = authoredDecks.flatMap((d) => d.cards.map((c) => c.back));
    expect(backs.some((b) => /\$[^$]+\$/.test(b))).toBe(true);
  });

  it("el quiz tiene tres preguntas, todas con explicación y con una correcta", () => {
    expect(quizContinuas.questions).toHaveLength(3);
    expect(quizContinuas.questions.every((q) => Boolean(q.explanation))).toBe(true);
    expect(quizContinuas.questions.every((q) => q.options.some((o) => o.correct))).toBe(true);
  });

  it("el plan tiene dos fases, tres hitos y seis tareas de las cinco clases", () => {
    expect(probaPlan.phases).toHaveLength(2);
    const milestones = probaPlan.phases.flatMap((p) => p.milestones);
    const tasks = milestones.flatMap((m) => m.tasks);
    expect(milestones).toHaveLength(3);
    expect(tasks).toHaveLength(6);
    expect(new Set(tasks.map((t) => t.kind))).toEqual(new Set(["read", "cards", "quiz", "exercises", "custom"]));
  });

  it("los kits apuntan a mazos y quizzes que existen", () => {
    const deckIds = new Set(content.decks.map((d) => d.id));
    const quizIds = new Set(content.quizzes.map((q) => q.id));
    for (const kit of content.kits) {
      expect(kit.decks.every((id) => deckIds.has(id))).toBe(true);
      expect(kit.quizzes.every((id) => quizIds.has(id))).toBe(true);
    }
    expect(content.kits).toHaveLength(2);
  });

  it("las tareas de tipo mazo o quiz apuntan a material que existe", () => {
    const ids = new Set([...content.decks.map((d) => d.id), ...content.quizzes.map((q) => q.id)]);
    const targeted = probaPlan.phases
      .flatMap((p) => p.milestones)
      .flatMap((m) => m.tasks)
      .filter((t) => t.kind === "cards" || t.kind === "quiz");
    expect(targeted.length).toBeGreaterThan(0);
    expect(targeted.every((t) => t.target && ids.has(t.target))).toBe(true);
  });
});

describe("mockStudyState", () => {
  const state = StudyState.parse(mockStudyState());

  it("valida contra el contrato y arranca con lo mínimo para ver las vistas", () => {
    expect(state.bookmarks).toHaveLength(1);
    expect(state.notes).toHaveLength(1);
    expect(state.tasksDone).toHaveLength(2);
    expect(state.attempts).toHaveLength(1);
    expect(state.srs).toHaveLength(0);
  });

  it("las tareas hechas existen en el plan", () => {
    const ids = new Set(probaPlan.phases.flatMap((p) => p.milestones).flatMap((m) => m.tasks).map((t) => t.id));
    expect(state.tasksDone.every((id) => ids.has(id))).toBe(true);
  });

  it("una tarjeta calificada con SM-2 sigue valiendo como SrsState", () => {
    const next = { cardId: "card:continuas:normal", ...sm2(SRS_DEFAULT, 3, "2026-09-05T12:00:00.000Z") };
    expect(() => StudyState.parse({ ...mockStudyState(), srs: [next] })).not.toThrow();
    expect(next.reps).toBe(1);
  });
});

describe("mockGraph", () => {
  const graph = GraphData.parse(mockGraph());

  it("hay un nodo por página y las aristas van entre páginas de la misma división", () => {
    expect(graph.nodes).toHaveLength(12);
    const divisionOfNode = new Map(graph.nodes.map((n) => [n.slug, n.division]));
    expect(graph.edges.length).toBeGreaterThan(0);
    for (const e of graph.edges) {
      expect(divisionOfNode.get(e.from)).toBe(divisionOfNode.get(e.to));
    }
  });

  it("los grados de cada nodo coinciden con las aristas", () => {
    for (const n of graph.nodes) {
      expect(n.inDegree).toBe(graph.edges.filter((e) => e.to === n.slug).length);
      expect(n.outDegree).toBe(graph.edges.filter((e) => e.from === n.slug).length);
    }
  });
});
