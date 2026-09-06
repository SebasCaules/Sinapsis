/**
 * Modelo derivado del material de estudio: todo lo que las vistas de flashcards,
 * quiz, plan y kits necesitan saber a partir de `StudyContent` (lo que trae la
 * materia) y `StudyState` (lo que hizo el usuario).
 *
 * Es una capa PURA (sin React, sin DOM, sin `Date.now()` implícito: la hora
 * entra por parámetro), igual que `../model.ts` para el shell. Las vistas solo
 * leen de acá; ninguna vuelve a recorrer los mazos por su cuenta.
 *
 * Reglas del contrato que implementa (ninguna se reescribe acá):
 *  - SRS: `sm2` y `SRS_DEFAULT` son del contrato (decisión N0-28). La web SOLO
 *    previsualiza el próximo intervalo; quien persiste es el API.
 *  - Vencida: tiene estado SRS y su `due` ya pasó. Nueva: no tiene estado.
 *    Dominada: intervalo ≥ 21 días.
 *  - La cola de hoy (`dueCards`) son las vencidas —la más atrasada primero— y
 *    después las nuevas, que el SRS considera pendientes desde el día cero: de
 *    ahí que su estado pueda ser `null`.
 */
import {
  SRS_DEFAULT,
  sm2,
  type Card,
  type Deck,
  type Kit,
  type Plan,
  type PlanMilestone,
  type PlanPhase,
  type PlanTask,
  type Quiz,
  type QuizAttempt,
  type SrsGrade,
  type SrsState,
  type StudyContent,
  type StudyState,
} from "@sinapsis/contract";

/** Intervalo (en días) a partir del cual una tarjeta se considera dominada. */
export const MASTERED_DAYS = 21;

/** Las cuatro notas del SM-2, en el orden en que se dibujan los botones. */
export const GRADES: readonly SrsGrade[] = [1, 2, 3, 4];

export const GRADE_LABEL: Record<SrsGrade, string> = {
  1: "Otra vez",
  2: "Difícil",
  3: "Bien",
  4: "Fácil",
};

/** Contenido y estado vacíos: referencias ESTABLES, para no rearmar el modelo en cada render. */
export const EMPTY_CONTENT: StudyContent = Object.freeze({ decks: [], quizzes: [], plan: null, kits: [] });
export const EMPTY_STATE: StudyState = Object.freeze({
  srs: [],
  bookmarks: [],
  notes: [],
  tasksDone: [],
  attempts: [],
});

/** Una tarjeta con su mazo y su estado (null si nunca se estudió). */
export interface CardEntry {
  card: Card;
  deck: Deck;
  srs: SrsState | null;
}

export interface DeckStat {
  deck: Deck;
  total: number;
  /** Con estado SRS y `due` ya cumplido. */
  due: number;
  /** Sin estado SRS: nunca vistas. */
  fresh: number;
  /** Intervalo ≥ MASTERED_DAYS. */
  mastered: number;
  /** Vencidas + nuevas: lo que entra en la cola de hoy. */
  pending: number;
  /** Dominadas sobre el total (0..1). */
  ratio: number;
}

export interface QuizStat {
  quiz: Quiz;
  questions: number;
  /** Intentos de este quiz, del más viejo al más nuevo. */
  attempts: QuizAttempt[];
  /** Mejor intento por proporción; a igual proporción, el más reciente. */
  best: QuizAttempt | null;
  last: QuizAttempt | null;
  /** Porcentaje del mejor intento (0..100), null sin intentos. */
  bestPct: number | null;
}

export interface KitStat {
  kit: Kit;
  decks: Deck[];
  quizzes: Quiz[];
  /** Slugs de página declarados por el kit (tal cual: la vista resuelve cuáles existen). */
  pages: string[];
  /** Páginas del kit ya marcadas como leídas. */
  read: number;
  readRatio: number;
  /** Vencidas + nuevas en los mazos del kit. */
  due: number;
  cards: number;
  questions: number;
  /** Ids de herramientas del rail declaradas por el kit. */
  tools: string[];
}

export interface Progress {
  done: number;
  total: number;
  /** 0..1; 0 cuando no hay nada que hacer. */
  ratio: number;
}

export interface TaskRef {
  phase: PlanPhase;
  milestone: PlanMilestone;
  task: PlanTask;
}

/** Modo de una sesión de repaso (`?modo=` de `flashcards/:deck`). */
export type SessionMode = "vencidas" | "todo" | "nuevas";

export interface StudyModel {
  content: StudyContent;
  state: StudyState;
  /** La hora con la que se construyó el modelo (todas las cuentas de vencimiento). */
  now: Date;
  /** true si la materia no trae nada de material de estudio. */
  empty: boolean;

  srsOf: (cardId: string) => SrsState | null;
  /** Todas las tarjetas de todos los mazos, en el orden en que llegaron. */
  entries: CardEntry[];
  decks: DeckStat[];
  deck: (id: string) => DeckStat | undefined;
  /** Totales de todos los mazos juntos. */
  totals: { cards: number; due: number; fresh: number; mastered: number; pending: number };
  /** La cola de hoy: vencidas (la más atrasada primero) y después las nuevas. */
  dueCards: (at?: Date) => CardEntry[];
  /**
   * Las tarjetas de una sesión. `deckIds` null = todos los mazos.
   * El orden de «vencidas» es el de la cola de hoy; el de «todo» y «nuevas», el del mazo.
   */
  cardsOf: (deckIds: readonly string[] | null, mode: SessionMode, at?: Date) => CardEntry[];

  quizzes: QuizStat[];
  quiz: (id: string) => QuizStat | undefined;

  plan: Plan | null;
  planProgress: Progress;
  phaseProgress: (phaseId: string) => Progress;
  milestoneProgress: (milestoneId: string) => Progress;
  isTaskDone: (taskId: string) => boolean;
  /** La primera fase con tareas pendientes (null si el plan está completo o no hay plan). */
  currentPhase: PlanPhase | null;
  nextTask: () => TaskRef | null;

  kits: KitStat[];
  kit: (id: string) => KitStat | undefined;
}

/** El `?modo=` de la sesión; cualquier cosa rara cae en «vencidas». */
export function parseMode(raw: string | null | undefined): SessionMode {
  return raw === "todo" || raw === "nuevas" ? raw : "vencidas";
}

/** Estado de partida del SM-2 para una tarjeta nunca vista. */
function base(prev: SrsState | null): Omit<SrsState, "cardId" | "due" | "updatedAt"> & { due?: string } {
  return prev ?? { ...SRS_DEFAULT };
}

/** Intervalo en días que dejaría esta nota, sin tocar nada: es la previsualización de los botones. */
export function nextInterval(prev: SrsState | null, grade: SrsGrade, now: Date): number {
  return sm2(base(prev), grade, now.toISOString()).interval;
}

/** Lo que el SM-2 devolvería: sirve para el optimista de `grade` y para la previsualización. */
export function nextSrs(cardId: string, prev: SrsState | null, grade: SrsGrade, now: Date): SrsState {
  return { cardId, ...sm2(base(prev), grade, now.toISOString()) };
}

/**
 * Rótulo corto de un intervalo, en la tipografía de cifras: «10 min» (repetir
 * hoy), «1 d», «12 d», «2 mes», «1 a».
 */
export function formatInterval(days: number): string {
  if (!Number.isFinite(days) || days <= 0) return "10 min";
  if (days < 30) return `${Math.round(days)} d`;
  if (days < 365) return `${Math.round(days / 30)} mes`;
  const years = days / 365;
  return `${years < 10 ? Math.round(years * 10) / 10 : Math.round(years)} a`;
}

/** Previsualización de una nota: «Bien → 12 d». */
export function intervalPreview(prev: SrsState | null, grade: SrsGrade, now: Date): string {
  return formatInterval(nextInterval(prev, grade, now));
}

/**
 * Markdown → texto llano para los rótulos compactos (la lista de preguntas
 * falladas). NO toca la matemática: los `$…$` siguen enteros para KaTeX.
 */
export function plainText(md: string): string {
  return (md ?? "")
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2")
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/(\*\*|__)(.+?)\1/g, "$2")
    .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1$2")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Comandos de LaTeX frecuentes en el material de una materia → cómo se leen.
 *
 * El orden importa: lo más largo primero (`\leq` antes que `\le`), y el
 * `(?![a-zA-Z])` evita que `\le` se coma el principio de `\left`. Lo que no esté
 * en la tabla se descarta al final: es preferible una lectura incompleta a que
 * un lector de pantalla deletree «barra invertida ce ele ede o te».
 */
const MATH_WORDS: ReadonlyArray<readonly [RegExp, string]> = [
  [/\\alpha(?![a-zA-Z])/g, "alfa"],
  [/\\beta(?![a-zA-Z])/g, "beta"],
  [/\\gamma(?![a-zA-Z])/g, "gamma"],
  [/\\delta(?![a-zA-Z])/g, "delta"],
  [/\\epsilon(?![a-zA-Z])/g, "épsilon"],
  [/\\theta(?![a-zA-Z])/g, "theta"],
  [/\\lambda(?![a-zA-Z])/g, "lambda"],
  [/\\mu(?![a-zA-Z])/g, "mu"],
  [/\\pi(?![a-zA-Z])/g, "pi"],
  [/\\rho(?![a-zA-Z])/g, "rho"],
  [/\\sigma(?![a-zA-Z])/g, "sigma"],
  [/\\tau(?![a-zA-Z])/g, "tau"],
  [/\\phi(?![a-zA-Z])/g, "fi"],
  [/\\omega(?![a-zA-Z])/g, "omega"],
  [/\\Sigma(?![a-zA-Z])/g, "sigma mayúscula"],
  [/\\Omega(?![a-zA-Z])/g, "omega mayúscula"],
  [/\\leq?(?![a-zA-Z])/g, "menor o igual que"],
  [/\\geq?(?![a-zA-Z])/g, "mayor o igual que"],
  [/\\neq(?![a-zA-Z])/g, "distinto de"],
  [/\\approx(?![a-zA-Z])/g, "aproximadamente"],
  [/\\sim(?![a-zA-Z])/g, "se distribuye como"],
  [/\\pm(?![a-zA-Z])/g, "más o menos"],
  [/\\cdot(?![a-zA-Z])/g, "por"],
  [/\\times(?![a-zA-Z])/g, "por"],
  [/\\div(?![a-zA-Z])/g, "dividido"],
  [/\\infty(?![a-zA-Z])/g, "infinito"],
  [/\\sum(?![a-zA-Z])/g, "sumatoria de"],
  [/\\prod(?![a-zA-Z])/g, "productoria de"],
  [/\\int(?![a-zA-Z])/g, "integral de"],
  [/\\sqrt(?![a-zA-Z])/g, "raíz de"],
  [/\\frac(?![a-zA-Z])/g, "fracción"],
  [/\\binom(?![a-zA-Z])/g, "combinatorio"],
  [/\\bar(?![a-zA-Z])/g, "media de"],
  [/\\hat(?![a-zA-Z])/g, "estimador de"],
  [/\\in(?![a-zA-Z])/g, "pertenece a"],
  [/\\subset(?![a-zA-Z])/g, "incluido en"],
  [/\\cup(?![a-zA-Z])/g, "unión"],
  [/\\cap(?![a-zA-Z])/g, "intersección"],
  [/\\to(?![a-zA-Z])/g, "tiende a"],
  [/\\Rightarrow(?![a-zA-Z])/g, "implica"],
  [/\\forall(?![a-zA-Z])/g, "para todo"],
  [/\\exists(?![a-zA-Z])/g, "existe"],
  [/\\mid(?![a-zA-Z])/g, "dado"],
];

/**
 * Texto con matemática `$…$` → algo que un lector de pantalla pueda decir.
 *
 * Es el respaldo de `QuizOption.alt` del contrato: cuando la materia no escribió
 * el texto alternativo, esto al menos convierte los comandos más comunes en
 * palabras. `$\alpha \le 0,05$` deja de leerse «dólar barra alfa barra le cero
 * coma cero cinco dólar» y pasa a ser «alfa menor o igual que 0,05».
 */
export function spokenMath(text: string): string {
  let out = (text ?? "").replace(/\$/g, " ");
  for (const [re, word] of MATH_WORDS) out = out.replace(re, ` ${word} `);
  return out
    .replace(/\\(left|right|,|;|:|!|quad|qquad)/g, " ")
    .replace(/\\[a-zA-Z]+/g, " ")
    .replace(/[{}]/g, " ")
    .replace(/\^/g, " elevado a ")
    .replace(/_/g, " sub ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Días enteros entre hoy y una fecha `AAAA-MM-DD` (negativo si ya pasó). */
export function daysUntil(date: string, now: Date): number | null {
  const target = Date.parse(`${date}T00:00:00`);
  if (Number.isNaN(target)) return null;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return Math.round((target - today) / 86_400_000);
}

/** «hoy», «mañana», «en 12 días», «hace 3 días». */
export function relativeDayLabel(date: string, now: Date): string | null {
  const d = daysUntil(date, now);
  if (d === null) return null;
  if (d === 0) return "hoy";
  if (d === 1) return "mañana";
  if (d === -1) return "ayer";
  return d > 0 ? `en ${d} días` : `hace ${-d} días`;
}

/** «14 de marzo de 2026» a partir de `AAAA-MM-DD` (sin sorpresas de zona horaria). */
export function formatDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("es", { day: "numeric", month: "long", year: "numeric" });
}

/** «hace 2 días» / «hoy» a partir de un instante ISO (intentos de quiz). */
export function relativeSince(iso: string, now: Date): string {
  const at = Date.parse(iso);
  if (Number.isNaN(at)) return "";
  const minutes = Math.round((now.getTime() - at) / 60_000);
  if (minutes < 1) return "recién";
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.round(hours / 24);
  if (days === 1) return "ayer";
  if (days < 30) return `hace ${days} días`;
  return formatDate(new Date(at).toISOString().slice(0, 10));
}

const ratioOf = (done: number, total: number): number => (total ? done / total : 0);

/**
 * Construye el modelo. `studied` (las páginas leídas del shell) solo lo usan los
 * kits para su barra de lectura: el material de estudio no lo conoce.
 */
export function buildStudyModel(
  content: StudyContent | null | undefined,
  state: StudyState | null | undefined,
  now: Date = new Date(),
  studied: ReadonlySet<string> = new Set<string>(),
): StudyModel {
  const data = content ?? EMPTY_CONTENT;
  const user = state ?? EMPTY_STATE;
  const at = now.getTime();

  // --- SRS ------------------------------------------------------------------
  const srsByCard = new Map(user.srs.map((s) => [s.cardId, s]));
  const srsOf = (cardId: string): SrsState | null => srsByCard.get(cardId) ?? null;

  const entries: CardEntry[] = [];
  const deckById = new Map<string, Deck>();
  for (const deck of data.decks) {
    deckById.set(deck.id, deck);
    for (const card of deck.cards) entries.push({ card, deck, srs: srsOf(card.id) });
  }

  const dueAt = (entry: CardEntry): number => (entry.srs ? Date.parse(entry.srs.due) : Number.NaN);
  const isDue = (entry: CardEntry, when: number): boolean => {
    const due = dueAt(entry);
    return !Number.isNaN(due) && due <= when;
  };
  const isFresh = (entry: CardEntry): boolean => entry.srs === null;
  const isMastered = (entry: CardEntry): boolean => (entry.srs?.interval ?? 0) >= MASTERED_DAYS;

  const statOf = (deck: Deck): DeckStat => {
    const cards = deck.cards.map((card): CardEntry => ({ card, deck, srs: srsOf(card.id) }));
    let due = 0;
    let fresh = 0;
    let mastered = 0;
    for (const entry of cards) {
      if (isFresh(entry)) fresh += 1;
      else if (isDue(entry, at)) due += 1;
      if (isMastered(entry)) mastered += 1;
    }
    return {
      deck,
      total: cards.length,
      due,
      fresh,
      mastered,
      pending: due + fresh,
      ratio: ratioOf(mastered, cards.length),
    };
  };

  const decks = data.decks.map(statOf);
  const statById = new Map(decks.map((d) => [d.deck.id, d]));

  const totals = decks.reduce(
    (acc, d) => ({
      cards: acc.cards + d.total,
      due: acc.due + d.due,
      fresh: acc.fresh + d.fresh,
      mastered: acc.mastered + d.mastered,
      pending: acc.pending + d.pending,
    }),
    { cards: 0, due: 0, fresh: 0, mastered: 0, pending: 0 },
  );

  /* La cola: primero las vencidas de todos los mazos, la más atrasada arriba;
     después las nuevas en el orden en que las escribió la materia. */
  const queue = (list: CardEntry[], when: number): CardEntry[] => {
    const overdue = list.filter((e) => isDue(e, when)).sort((a, b) => dueAt(a) - dueAt(b));
    return [...overdue, ...list.filter(isFresh)];
  };

  const dueCards = (when: Date = now): CardEntry[] => queue(entries, when.getTime());

  const cardsOf = (
    deckIds: readonly string[] | null,
    mode: SessionMode,
    when: Date = now,
  ): CardEntry[] => {
    const wanted = deckIds ? new Set(deckIds) : null;
    const list = wanted ? entries.filter((e) => wanted.has(e.deck.id)) : entries;
    if (mode === "todo") return list.slice();
    if (mode === "nuevas") return list.filter(isFresh);
    return queue(list, when.getTime());
  };

  // --- quizzes --------------------------------------------------------------
  const attemptsByQuiz = new Map<string, QuizAttempt[]>();
  for (const attempt of user.attempts) {
    const list = attemptsByQuiz.get(attempt.quizId);
    if (list) list.push(attempt);
    else attemptsByQuiz.set(attempt.quizId, [attempt]);
  }
  for (const list of attemptsByQuiz.values()) list.sort((a, b) => Date.parse(a.at) - Date.parse(b.at));

  const pctOf = (a: QuizAttempt): number => (a.total ? a.score / a.total : 0);

  const quizzes: QuizStat[] = data.quizzes.map((quiz) => {
    const attempts = attemptsByQuiz.get(quiz.id) ?? [];
    /* Mejor por proporción; a igualdad, el más reciente (la lista ya está en orden). */
    const best = attempts.reduce<QuizAttempt | null>(
      (top, a) => (top === null || pctOf(a) >= pctOf(top) ? a : top),
      null,
    );
    return {
      quiz,
      questions: quiz.questions.length,
      attempts,
      best,
      last: attempts.length ? (attempts[attempts.length - 1] ?? null) : null,
      bestPct: best ? Math.round(pctOf(best) * 100) : null,
    };
  });
  const quizById = new Map(quizzes.map((q) => [q.quiz.id, q]));

  // --- plan -----------------------------------------------------------------
  const plan = data.plan;
  const done = new Set(user.tasksDone);
  const isTaskDone = (taskId: string): boolean => done.has(taskId);

  const progressOf = (tasks: readonly PlanTask[]): Progress => {
    const total = tasks.length;
    const hechas = tasks.reduce((n, t) => (done.has(t.id) ? n + 1 : n), 0);
    return { done: hechas, total, ratio: ratioOf(hechas, total) };
  };

  const phaseProgressById = new Map<string, Progress>();
  const milestoneProgressById = new Map<string, Progress>();
  let planDone = 0;
  let planTotal = 0;
  let currentPhase: PlanPhase | null = null;

  for (const phase of plan?.phases ?? []) {
    const tasks: PlanTask[] = [];
    for (const milestone of phase.milestones) {
      milestoneProgressById.set(milestone.id, progressOf(milestone.tasks));
      tasks.push(...milestone.tasks);
    }
    const p = progressOf(tasks);
    phaseProgressById.set(phase.id, p);
    planDone += p.done;
    planTotal += p.total;
    if (currentPhase === null && p.done < p.total) currentPhase = phase;
  }

  const EMPTY_PROGRESS: Progress = { done: 0, total: 0, ratio: 0 };

  const nextTask = (): TaskRef | null => {
    for (const phase of plan?.phases ?? []) {
      for (const milestone of phase.milestones) {
        for (const task of milestone.tasks) {
          if (!done.has(task.id)) return { phase, milestone, task };
        }
      }
    }
    return null;
  };

  // --- kits -----------------------------------------------------------------
  const quizContentById = new Map(data.quizzes.map((q) => [q.id, q]));

  const kits: KitStat[] = data.kits.map((kit) => {
    const kitDecks = kit.decks.map((id) => deckById.get(id)).filter((d): d is Deck => !!d);
    const kitQuizzes = kit.quizzes.map((id) => quizContentById.get(id)).filter((q): q is Quiz => !!q);
    const read = kit.pages.reduce((n, slug) => (studied.has(slug) ? n + 1 : n), 0);
    const due = kitDecks.reduce((n, d) => n + (statById.get(d.id)?.pending ?? 0), 0);
    return {
      kit,
      decks: kitDecks,
      quizzes: kitQuizzes,
      pages: kit.pages,
      read,
      readRatio: ratioOf(read, kit.pages.length),
      due,
      cards: kitDecks.reduce((n, d) => n + d.cards.length, 0),
      questions: kitQuizzes.reduce((n, q) => n + q.questions.length, 0),
      tools: kit.tools,
    };
  });
  const kitById = new Map(kits.map((k) => [k.kit.id, k]));

  return {
    content: data,
    state: user,
    now,
    empty: data.decks.length === 0 && data.quizzes.length === 0 && data.kits.length === 0 && !data.plan,
    srsOf,
    entries,
    decks,
    deck: (id) => statById.get(id),
    totals,
    dueCards,
    cardsOf,
    quizzes,
    quiz: (id) => quizById.get(id),
    plan,
    planProgress: { done: planDone, total: planTotal, ratio: ratioOf(planDone, planTotal) },
    phaseProgress: (id) => phaseProgressById.get(id) ?? EMPTY_PROGRESS,
    milestoneProgress: (id) => milestoneProgressById.get(id) ?? EMPTY_PROGRESS,
    isTaskDone,
    currentPhase,
    nextTask,
    kits,
    kit: (id) => kitById.get(id),
  };
}
