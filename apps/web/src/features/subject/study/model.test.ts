/**
 * El modelo de estudio es la única pieza de estas vistas con reglas propias
 * (vencidas, nuevas, dominadas, cola de repaso, progreso del plan, mejor
 * puntaje, kits), así que es la que se prueba. La hora entra por parámetro: los
 * casos son deterministas.
 */
import { describe, expect, it } from "vitest";
import { SRS_DEFAULT, type SrsState, type StudyContent, type StudyState } from "@sinapsis/contract";
import {
  buildStudyModel,
  daysUntil,
  formatInterval,
  intervalPreview,
  nextInterval,
  plainText,
  relativeDayLabel,
  spokenMath,
} from "./model";

const NOW = new Date("2026-09-05T12:00:00.000Z");
const DAY = 86_400_000;

/** Estado SRS de una tarjeta: vence en `dueInDays` (negativo = ya venció). */
function srs(cardId: string, dueInDays: number, interval: number, extra: Partial<SrsState> = {}): SrsState {
  return {
    cardId,
    ease: 2.5,
    interval,
    due: new Date(NOW.getTime() + dueInDays * DAY).toISOString(),
    reps: 2,
    lapses: 0,
    lastGrade: 3,
    updatedAt: NOW.toISOString(),
    ...extra,
  };
}

const card = (id: string, division?: string) => ({
  id,
  front: `Anverso de ${id}`,
  back: `Reverso de ${id}`,
  ...(division ? { division } : {}),
  tags: [],
});

const content: StudyContent = {
  decks: [
    {
      id: "u1",
      title: "Unidad 1",
      division: "1",
      source: "authored",
      cards: [card("c1", "1"), card("c2", "1"), card("c3", "1"), card("c4", "1")],
    },
    {
      id: "auto-2",
      title: "Resúmenes · Unidad 2",
      division: "2",
      source: "auto",
      cards: [card("c5", "2"), card("c6", "2")],
    },
  ],
  quizzes: [
    {
      id: "q1",
      title: "Quiz 1",
      questions: [
        { id: "q1-1", prompt: "¿A?", options: [{ text: "sí", correct: true }, { text: "no", correct: false }] },
        { id: "q1-2", prompt: "¿B?", options: [{ text: "sí", correct: true }, { text: "no", correct: false }] },
        { id: "q1-3", prompt: "¿C?", options: [{ text: "sí", correct: true }, { text: "no", correct: false }] },
      ],
    },
    {
      id: "q2",
      title: "Quiz 2",
      questions: [
        { id: "q2-1", prompt: "¿D?", options: [{ text: "sí", correct: true }, { text: "no", correct: false }] },
        { id: "q2-2", prompt: "¿E?", options: [{ text: "sí", correct: true }, { text: "no", correct: false }] },
      ],
    },
  ],
  plan: {
    title: "Plan de estudio",
    tracks: [],
    phases: [
      {
        id: "p1",
        title: "Parcialito 1",
        date: "2026-09-08",
        milestones: [
          {
            id: "m1",
            title: "Descriptiva",
            divisions: ["1"],
            tasks: [
              { id: "t1", label: "Leer la unidad", kind: "read", target: "1" },
              { id: "t2", label: "Repasar el mazo", kind: "cards", target: "u1" },
            ],
          },
          {
            id: "m2",
            title: "Práctica",
            divisions: ["1"],
            tasks: [{ id: "t3", label: "Quiz de la unidad", kind: "quiz", target: "q1" }],
          },
        ],
      },
      {
        id: "p2",
        title: "Final",
        date: "2026-08-30",
        milestones: [
          {
            id: "m3",
            title: "Integrador",
            divisions: ["1", "2"],
            tasks: [
              { id: "t4", label: "Repasar todo", kind: "custom" },
              { id: "t5", label: "Simulacro", kind: "exercises", target: "https://ejemplo.test/simulacro" },
            ],
          },
        ],
      },
    ],
  },
  kits: [
    {
      id: "k1",
      title: "Kit del parcialito",
      divisions: ["1"],
      pages: ["pa", "pb", "pc"],
      decks: ["u1", "no-existe"],
      quizzes: ["q1"],
      tools: ["calc"],
    },
  ],
};

/* c1 venció ayer, c4 hace tres días; c2 vence mañana (30 d: dominada);
   c4 está en 21 d justos (dominada); c3 y c5 nunca se vieron; c6 tiene 20 d. */
const state: StudyState = {
  srs: [srs("c1", -1, 5), srs("c2", 1, 30), srs("c4", -3, 21), srs("c6", 10, 20)],
  bookmarks: [],
  notes: [],
  tasksDone: ["t1", "t2", "t3"],
  attempts: [
    { quizId: "q1", score: 2, total: 3, at: "2026-09-01T10:00:00.000Z" },
    { quizId: "q1", score: 3, total: 3, at: "2026-09-02T10:00:00.000Z" },
    { quizId: "q1", score: 1, total: 3, at: "2026-09-03T10:00:00.000Z" },
    { quizId: "q2", score: 1, total: 2, at: "2026-09-01T10:00:00.000Z" },
    { quizId: "q2", score: 1, total: 2, at: "2026-09-04T10:00:00.000Z" },
  ],
};

const model = (over: Partial<StudyState> = {}, studied = new Set(["pa"])) =>
  buildStudyModel(content, { ...state, ...over }, NOW, studied);

describe("mazos: vencidas, nuevas y dominadas", () => {
  it("cuenta como vencida la que tiene estado y su fecha ya pasó", () => {
    expect(model().deck("u1")?.due).toBe(2);
    expect(model().deck("auto-2")?.due).toBe(0);
  });

  it("cuenta como nueva la que no tiene estado SRS", () => {
    expect(model().deck("u1")?.fresh).toBe(1);
    expect(model().deck("auto-2")?.fresh).toBe(1);
  });

  it("cuenta como dominada desde 21 días justos de intervalo", () => {
    expect(model().deck("u1")?.mastered).toBe(2); // 30 d y 21 d
    expect(model().deck("auto-2")?.mastered).toBe(0); // 20 d se queda afuera
  });

  it("suma los totales de todos los mazos", () => {
    expect(model().totals).toEqual({ cards: 6, due: 2, fresh: 2, mastered: 2, pending: 4 });
  });

  it("sin estado del usuario, todas las tarjetas son nuevas y ninguna está vencida", () => {
    const fresh = buildStudyModel(content, null, NOW);
    expect(fresh.totals).toEqual({ cards: 6, due: 0, fresh: 6, mastered: 0, pending: 6 });
  });
});

describe("cola de repaso", () => {
  it("pone primero la más atrasada y después las nuevas", () => {
    expect(model().dueCards().map((e) => e.card.id)).toEqual(["c4", "c1", "c3", "c5"]);
  });

  it("cada entrada trae su mazo y el estado de la tarjeta (null si es nueva)", () => {
    const [first, , third] = model().dueCards();
    expect(first?.deck.id).toBe("u1");
    expect(first?.srs?.cardId).toBe("c4");
    expect(third?.srs).toBeNull();
  });

  it("filtra por mazo y por modo", () => {
    const m = model();
    expect(m.cardsOf(["u1"], "vencidas").map((e) => e.card.id)).toEqual(["c4", "c1", "c3"]);
    expect(m.cardsOf(["u1"], "nuevas").map((e) => e.card.id)).toEqual(["c3"]);
    expect(m.cardsOf(["u1"], "todo")).toHaveLength(4);
    expect(m.cardsOf(null, "todo")).toHaveLength(6);
  });

  it("adelanta el vencimiento si se le pasa otra hora", () => {
    const later = new Date(NOW.getTime() + 2 * DAY);
    expect(model().dueCards(later).map((e) => e.card.id)).toEqual(["c4", "c1", "c2", "c3", "c5"]);
  });
});

describe("previsualización del próximo intervalo", () => {
  it("una tarjeta nueva vuelve en 10 minutos con «Otra vez» y en 1 día con el resto", () => {
    expect(intervalPreview(null, 1, NOW)).toBe("10 min");
    expect(intervalPreview(null, 2, NOW)).toBe("1 d");
    expect(intervalPreview(null, 3, NOW)).toBe("1 d");
    expect(intervalPreview(null, 4, NOW)).toBe("1 d");
  });

  it("una tarjeta con historia estira el intervalo según la nota", () => {
    const prev = srs("cx", -1, 10);
    expect(nextInterval(prev, 1, NOW)).toBe(0);
    expect(intervalPreview(prev, 2, NOW)).toBe("19 d");
    expect(intervalPreview(prev, 3, NOW)).toBe("25 d");
    expect(intervalPreview(prev, 4, NOW)).toBe("1 mes");
  });

  it("parte del estado por defecto del contrato cuando no hay estado previo", () => {
    expect(nextInterval(null, 3, NOW)).toBe(nextInterval({ ...SRS_DEFAULT, cardId: "z", due: "", updatedAt: "" }, 3, NOW));
  });

  it("rotula los intervalos en días, meses y años", () => {
    expect(formatInterval(0)).toBe("10 min");
    expect(formatInterval(1)).toBe("1 d");
    expect(formatInterval(29)).toBe("29 d");
    expect(formatInterval(30)).toBe("1 mes");
    expect(formatInterval(365)).toBe("1 a");
  });
});

describe("texto llano de los rótulos compactos", () => {
  it("saca el marcado pero deja la matemática entera", () => {
    expect(plainText("En una muestra con **asimetría positiva** fuerte, $\\bar{x} > Me$")).toBe(
      "En una muestra con asimetría positiva fuerte, $\\bar{x} > Me$",
    );
    expect(plainText("Ver [[distribucion-normal|la normal]] y `codigo`")).toBe("Ver la normal y codigo");
    expect(plainText("## Título\n\ncon *énfasis*")).toBe("Título con énfasis");
  });
});

describe("matemática dicha en palabras (U7)", () => {
  it("traduce los comandos frecuentes y se come los dólares", () => {
    expect(spokenMath("$\\alpha \\le 0,05$")).toBe("alfa menor o igual que 0,05");
    expect(spokenMath("$\\sigma^2$")).toBe("sigma elevado a 2");
    expect(spokenMath("$\\mu \\ge \\lambda$")).toBe("mu mayor o igual que lambda");
  });

  it("no confunde «\\le» con el principio de «\\lambda» ni de «\\left»", () => {
    expect(spokenMath("$\\lambda$")).toBe("lambda");
    expect(spokenMath("$\\left( x \\right)$")).toBe("( x )");
  });

  it("descarta lo que no sabe traducir en vez de deletrear la barra invertida", () => {
    expect(spokenMath("$\\operatorname{Var}(X)$")).toBe("Var (X)");
  });

  it("mezcla prosa y fórmula sin dejar espacios de más", () => {
    expect(spokenMath("El estimador $\\hat{p}$ es insesgado")).toBe("El estimador estimador de p es insesgado");
  });
});

describe("plan de estudio", () => {
  it("mide el progreso total y el de cada fase e hito", () => {
    const m = model();
    expect(m.planProgress).toEqual({ done: 3, total: 5, ratio: 3 / 5 });
    expect(m.phaseProgress("p1")).toEqual({ done: 3, total: 3, ratio: 1 });
    expect(m.phaseProgress("p2")).toEqual({ done: 0, total: 2, ratio: 0 });
    expect(m.milestoneProgress("m2")).toEqual({ done: 1, total: 1, ratio: 1 });
  });

  it("la fase actual es la primera con tareas pendientes", () => {
    expect(model().currentPhase?.id).toBe("p2");
    expect(model({ tasksDone: ["t1"] }).currentPhase?.id).toBe("p1");
    expect(model({ tasksDone: ["t1", "t2", "t3", "t4", "t5"] }).currentPhase).toBeNull();
  });

  it("la próxima tarea es la primera sin tildar, con su hito y su fase", () => {
    const next = model({ tasksDone: ["t1"] }).nextTask();
    expect(next?.task.id).toBe("t2");
    expect(next?.milestone.id).toBe("m1");
    expect(next?.phase.id).toBe("p1");
    expect(model({ tasksDone: ["t1", "t2", "t3", "t4", "t5"] }).nextTask()).toBeNull();
  });
});

describe("quizzes", () => {
  it("el mejor puntaje es el de mayor proporción y el último es el más reciente", () => {
    const q1 = model().quiz("q1");
    expect(q1?.best?.score).toBe(3);
    expect(q1?.bestPct).toBe(100);
    expect(q1?.last?.at).toBe("2026-09-03T10:00:00.000Z");
    expect(q1?.attempts).toHaveLength(3);
  });

  it("a igual proporción gana el intento más reciente", () => {
    expect(model().quiz("q2")?.best?.at).toBe("2026-09-04T10:00:00.000Z");
  });

  it("sin intentos no hay mejor ni último puntaje", () => {
    const m = buildStudyModel(content, { ...state, attempts: [] }, NOW);
    expect(m.quiz("q1")?.best).toBeNull();
    expect(m.quiz("q1")?.bestPct).toBeNull();
    expect(m.quiz("q1")?.questions).toBe(3);
  });
});

describe("kits", () => {
  it("resuelve mazos y quizzes reales y descarta los ids que no existen", () => {
    const k = model().kit("k1");
    expect(k?.decks.map((d) => d.id)).toEqual(["u1"]);
    expect(k?.quizzes.map((q) => q.id)).toEqual(["q1"]);
    expect(k?.cards).toBe(4);
    expect(k?.questions).toBe(3);
  });

  it("mide la lectura con las páginas estudiadas y lo pendiente con los mazos", () => {
    const k = model().kit("k1");
    expect(k?.read).toBe(1);
    expect(k?.readRatio).toBeCloseTo(1 / 3);
    expect(k?.due).toBe(3); // 2 vencidas + 1 nueva en «u1»
  });
});

describe("fechas del plan", () => {
  it("cuenta los días hasta la fecha de la fase", () => {
    expect(daysUntil("2026-09-08", NOW)).toBe(3);
    expect(daysUntil("2026-09-05", NOW)).toBe(0);
    expect(daysUntil("2026-09-02", NOW)).toBe(-3);
    expect(daysUntil("no-es-fecha", NOW)).toBeNull();
  });

  it("rotula «hoy», «mañana», «en N días» y «hace N días»", () => {
    expect(relativeDayLabel("2026-09-05", NOW)).toBe("hoy");
    expect(relativeDayLabel("2026-09-06", NOW)).toBe("mañana");
    expect(relativeDayLabel("2026-09-08", NOW)).toBe("en 3 días");
    expect(relativeDayLabel("2026-09-02", NOW)).toBe("hace 3 días");
  });
});

describe("materia sin material de estudio", () => {
  it("devuelve un modelo vacío sin romperse", () => {
    const m = buildStudyModel(null, null, NOW);
    expect(m.empty).toBe(true);
    expect(m.decks).toEqual([]);
    expect(m.dueCards()).toEqual([]);
    expect(m.nextTask()).toBeNull();
    expect(m.planProgress).toEqual({ done: 0, total: 0, ratio: 0 });
  });
});
