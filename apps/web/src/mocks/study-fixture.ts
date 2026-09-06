/**
 * Fixtures del Sprint 2: material de estudio y grafo de mentira para la materia
 * de Proba. Solo se usan en el modo mock (`?mock=1` en desarrollo) y en los
 * tests; `mocks/api.ts` es su único consumidor en tiempo de ejecución y ese
 * módulo entra por `import()` dinámico bajo `import.meta.env.DEV`.
 *
 * Se exporta cada pieza por separado (y no solo el `StudyContent` armado) para
 * que las vistas de estudio puedan tiparse contra un mazo, un quiz, un plan o un
 * kit concretos sin tener que buscarlos dentro del objeto.
 *
 * Regla de oro: todo lo que hay acá valida contra el contrato. `study-fixture.test.ts`
 * lo comprueba con `StudyContent.parse`, así que si el contrato cambia, el test
 * canta antes que la interfaz.
 */
import {
  autoDecks,
  divisionOf,
  type Deck,
  type GraphData,
  type GraphEdge,
  type GraphNode,
  type Kit,
  type PageMeta,
  type Plan,
  type Quiz,
  type StudyContent,
  type StudyState,
  type SubjectConfigLoose,
} from "@sinapsis/contract";
import { mockPages, probaConfig } from "@/features/subject/mocks/proba-fixture";

// ---------------------------------------------------------------------------
// Mazos autorales (los `auto` los agrega `mockStudyContent` con el contrato)
// ---------------------------------------------------------------------------

/** U4 · Continuas. El reverso de `card:continuas:densidad` lleva `$math$` a propósito. */
export const deckContinuas: Deck = {
  id: "deck-continuas",
  title: "Continuas · lo esencial",
  description: "Las cuatro ideas que hay que tener frescas antes de mirar una tabla de $\\Phi$.",
  division: "4",
  source: "authored",
  cards: [
    {
      id: "card:continuas:densidad",
      front: "¿Qué relación hay entre la densidad y la acumulada de una variable continua?",
      /* Reverso con matemática en línea: el lector de tarjetas tiene que renderizar KaTeX. */
      back: "La acumulada integra a la densidad: $F_X(x) = \\int_{-\\infty}^{x} f_X(t)\\,dt$, y donde $F_X$ es derivable vale $f_X(x) = F_X'(x)$.",
      division: "4",
      page: "variable-aleatoria-continua",
      tags: ["continua"],
    },
    {
      id: "card:continuas:puntual",
      front: "¿Por qué $P(X = x) = 0$ en el caso continuo?",
      back: "Porque la probabilidad es el área bajo la densidad y un punto no encierra área. Solo tienen probabilidad los intervalos.",
      division: "4",
      page: "variable-aleatoria-continua",
      tags: ["continua"],
    },
    {
      id: "card:continuas:normal",
      front: "¿Cómo se estandariza una $X \\sim N(\\mu, \\sigma)$?",
      back: "Con $Z = (X - \\mu)/\\sigma \\sim N(0,1)$: se resta la media, se divide por el desvío y se lee la tabla de $\\Phi$.",
      division: "4",
      page: "distribucion-normal",
      tags: ["normal"],
    },
    {
      id: "card:continuas:exponencial",
      front: "¿Qué quiere decir que la exponencial «no tiene memoria»?",
      back: "Que lo que ya esperó no cambia lo que falta esperar: $P(X > s + t \\mid X > s) = P(X > t)$.",
      division: "4",
      page: "distribucion-exponencial",
      tags: ["exponencial"],
    },
  ],
};

/** U1 · Descriptiva. */
export const deckDescriptiva: Deck = {
  id: "deck-descriptiva",
  title: "Descriptiva · medidas",
  description: "Posición, dispersión y forma: qué mide cada una y cuándo miente.",
  division: "1",
  source: "authored",
  cards: [
    {
      id: "card:descriptiva:media",
      front: "¿Cuándo la mediana representa mejor que la media?",
      back: "Cuando la distribución es asimétrica o hay atípicos: la media se corre detrás de los valores extremos y la mediana no.",
      division: "1",
      page: "medidas-de-tendencia-central",
      tags: ["posicion"],
    },
    {
      id: "card:descriptiva:varianza",
      front: "¿Qué mide la varianza muestral?",
      back: "El promedio de los desvíos al cuadrado respecto de la media: $s^2 = \\frac{1}{n-1}\\sum (x_i - \\bar{x})^2$. Su raíz es el desvío estándar, en las unidades del dato.",
      division: "1",
      page: "medidas-de-dispersion",
      tags: ["dispersion"],
    },
    {
      id: "card:descriptiva:iqr",
      front: "¿Para qué sirve el rango intercuartílico?",
      back: "Es la dispersión del 50 % central de los datos y no se altera con los atípicos: por eso lo usa el diagrama de caja.",
      division: "1",
      page: "medidas-de-dispersion",
      tags: ["dispersion"],
    },
    {
      id: "card:descriptiva:histograma",
      front: "¿Qué decide la forma que muestra un histograma?",
      back: "El ancho de clase: demasiado ancho aplana la forma y demasiado angosto la vuelve ruido. Conviene mirar más de una elección.",
      division: "1",
      page: "histograma-y-frecuencias",
      tags: ["forma"],
    },
  ],
};

export const authoredDecks: Deck[] = [deckContinuas, deckDescriptiva];

// ---------------------------------------------------------------------------
// Quiz
// ---------------------------------------------------------------------------

export const quizContinuas: Quiz = {
  id: "quiz-continuas",
  title: "Variables aleatorias continuas",
  description: "Tres preguntas de reconocimiento sobre la unidad 4.",
  division: "4",
  questions: [
    {
      id: "q:continuas:1",
      prompt: "Si $X \\sim N(\\mu, \\sigma)$, ¿cuánto vale $P(\\mu - \\sigma < X < \\mu + \\sigma)$?",
      options: [
        { text: "50 %", correct: false },
        { text: "68,3 %", correct: true },
        { text: "95,4 %", correct: false },
        { text: "99,7 %", correct: false },
      ],
      explanation: "Es la primera línea de la regla empírica: un desvío a cada lado cubre algo más de dos tercios del área.",
      page: "distribucion-normal",
    },
    {
      id: "q:continuas:2",
      prompt: "¿Cuál de estas afirmaciones sobre una variable continua es verdadera?",
      options: [
        { text: "$P(X = x) = 0$ para todo $x$", correct: true },
        { text: "La densidad nunca pasa de 1", correct: false },
        { text: "La acumulada puede decrecer", correct: false },
      ],
      explanation:
        "La densidad puede valer más que 1 (lo que vale 1 es el área total) y la acumulada nunca decrece. Lo que sí es nulo es la probabilidad puntual.",
      page: "variable-aleatoria-continua",
    },
    {
      id: "q:continuas:3",
      prompt: "La distribución exponencial modela…",
      options: [
        { text: "la cantidad de eventos en un intervalo fijo", correct: false },
        { text: "el tiempo hasta el primer evento de un proceso de Poisson", correct: true },
        { text: "el promedio de una muestra grande", correct: false },
      ],
      explanation: "La cuenta de eventos es Poisson; el promedio de una muestra grande tiende a la normal por el TCL.",
      page: "distribucion-exponencial",
    },
  ],
};

export const quizzes: Quiz[] = [quizContinuas];

// ---------------------------------------------------------------------------
// Plan de estudio: 2 fases, 3 hitos, 6 tareas (las cinco clases de `PlanTask`)
// ---------------------------------------------------------------------------

export const probaPlan: Plan = {
  title: "Plan de estudio · Probabilidad y Estadística",
  phases: [
    {
      id: "fase-parcial-1",
      title: "Primer parcial",
      subtitle: "Descriptiva y probabilidad elemental",
      date: "2026-10-08",
      scope: "Unidades 1 y 2: medidas de posición y dispersión, histogramas, probabilidad condicional e independencia.",
      milestones: [
        {
          id: "hito-descriptiva",
          title: "Descriptiva al día",
          divisions: ["1"],
          tasks: [
            { id: "task:leer-u1", label: "Leer las cuatro páginas de la unidad 1", kind: "read", target: "1" },
            { id: "task:mazo-descriptiva", label: "Repasar el mazo de medidas", kind: "cards", target: "deck-descriptiva" },
          ],
        },
        {
          id: "hito-probabilidad",
          title: "Probabilidad elemental",
          divisions: ["2"],
          tasks: [
            { id: "task:tp1", label: "Resolver el TP1 con las consignas de la cátedra", kind: "exercises", target: "tp1-probabilidad" },
            { id: "task:consulta", label: "Anotar las dudas para la clase de consulta", kind: "custom" },
          ],
        },
      ],
    },
    {
      id: "fase-final",
      title: "Final",
      subtitle: "Continuas e inferencia",
      date: "2026-12-10",
      scope: "Toda la materia, con énfasis en la unidad 4 y en el uso de tablas.",
      milestones: [
        {
          id: "hito-continuas",
          title: "Continuas firmes",
          divisions: ["4"],
          tasks: [
            { id: "task:leer-u4", label: "Releer la unidad 4 completa", kind: "read", target: "4" },
            { id: "task:quiz-continuas", label: "Hacer el quiz de continuas sin la tabla a mano", kind: "quiz", target: "quiz-continuas" },
          ],
        },
      ],
    },
  ],
  /* Modalidades (N0-43): las MISMAS tareas repartidas de otra manera. Los ids
     son globales al plan, así que tildar «Leer la unidad 1» en la cursada la deja
     tildada también en el final directo. */
  tracks: [
    {
      id: "cursada",
      label: "Cursada y final",
      description: "Dos parciales durante el cuatrimestre y el final al cierre.",
      phases: [
        {
          id: "fase-parcial-1",
          title: "Primer parcial",
          subtitle: "Descriptiva y probabilidad elemental",
          date: "2026-10-08",
          scope:
            "Unidades 1 y 2: medidas de posición y dispersión, histogramas, probabilidad condicional e independencia.",
          milestones: [
            {
              id: "hito-descriptiva",
              title: "Descriptiva al día",
              divisions: ["1"],
              tasks: [
                { id: "task:leer-u1", label: "Leer las cuatro páginas de la unidad 1", kind: "read", target: "1" },
                {
                  id: "task:mazo-descriptiva",
                  label: "Repasar el mazo de medidas",
                  kind: "cards",
                  target: "deck-descriptiva",
                },
              ],
            },
            {
              id: "hito-probabilidad",
              title: "Probabilidad elemental",
              divisions: ["2"],
              tasks: [
                {
                  id: "task:tp1",
                  label: "Resolver el TP1 con las consignas de la cátedra",
                  kind: "exercises",
                  target: "tp1-probabilidad",
                },
                { id: "task:consulta", label: "Anotar las dudas para la clase de consulta", kind: "custom" },
              ],
            },
          ],
        },
        {
          id: "fase-final",
          title: "Final",
          subtitle: "Continuas e inferencia",
          date: "2026-12-10",
          scope: "Toda la materia, con énfasis en la unidad 4 y en el uso de tablas.",
          milestones: [
            {
              id: "hito-continuas",
              title: "Continuas firmes",
              divisions: ["4"],
              tasks: [
                { id: "task:leer-u4", label: "Releer la unidad 4 completa", kind: "read", target: "4" },
                {
                  id: "task:quiz-continuas",
                  label: "Hacer el quiz de continuas sin la tabla a mano",
                  kind: "quiz",
                  target: "quiz-continuas",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "final-directo",
      label: "Final directo",
      description: "Sin cursada: una sola instancia con toda la materia.",
      phases: [
        {
          id: "fase-libre",
          title: "Final libre",
          subtitle: "Toda la materia en una sola instancia",
          date: "2026-12-10",
          scope: "Las cuatro unidades, con el formulario permitido y las tablas de la cátedra.",
          milestones: [
            {
              id: "hito-repaso-general",
              title: "Repaso general",
              divisions: ["1", "2", "4"],
              tasks: [
                { id: "task:leer-u1", label: "Leer las cuatro páginas de la unidad 1", kind: "read", target: "1" },
                { id: "task:leer-u4", label: "Releer la unidad 4 completa", kind: "read", target: "4" },
                {
                  id: "task:quiz-continuas",
                  label: "Hacer el quiz de continuas sin la tabla a mano",
                  kind: "quiz",
                  target: "quiz-continuas",
                },
              ],
            },
            {
              id: "hito-explorador",
              title: "Herramientas a mano",
              divisions: [],
              tasks: [
                {
                  id: "task:explorador",
                  label: "Recorrer el explorador de distribuciones",
                  kind: "tool",
                  target: "explorador",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Kits
// ---------------------------------------------------------------------------

export const kitParcial: Kit = {
  id: "kit-parcial-1",
  title: "Kit del primer parcial",
  description: "Lo mínimo para sentarse a rendir: dos páginas, un mazo y la calculadora de la cátedra.",
  divisions: ["1", "2"],
  pages: ["medidas-de-tendencia-central", "medidas-de-dispersion", "probabilidad-condicional"],
  decks: ["deck-descriptiva"],
  quizzes: [],
  tools: ["calc"],
};

export const kitContinuas: Kit = {
  id: "kit-continuas",
  title: "Kit de continuas",
  description: "Normal y exponencial, con el quiz para comprobar que quedó.",
  divisions: ["4"],
  pages: ["variable-aleatoria-continua", "distribucion-normal", "distribucion-exponencial"],
  decks: ["deck-continuas"],
  quizzes: ["quiz-continuas"],
  tools: ["explorador", "formularios"],
};

export const kits: Kit[] = [kitParcial, kitContinuas];

// ---------------------------------------------------------------------------
// Armado del `StudyContent` y del estado inicial
// ---------------------------------------------------------------------------

type GraphConfig = Pick<SubjectConfigLoose, "divisions">;
type StudyConfig = Pick<SubjectConfigLoose, "division" | "divisions" | "pageTypes">;

/**
 * Material completo de la materia de mentira: los mazos autorales más los
 * automáticos que deriva el contrato de los resúmenes (`autoDecks`), para que
 * las vistas vean las dos procedencias (`source: "authored" | "auto"`).
 */
export function mockStudyContent(
  cfg: StudyConfig = probaConfig,
  pages: readonly PageMeta[] = mockPages,
): StudyContent {
  return {
    decks: [...authoredDecks, ...autoDecks(cfg, pages)],
    quizzes,
    plan: probaPlan,
    kits,
  };
}

/** Estado inicial del usuario: 1 favorito, 1 apunte, 2 tareas hechas, 1 intento, sin SRS. */
export function mockStudyState(): StudyState {
  return {
    srs: [],
    bookmarks: ["distribucion-normal"],
    notes: [
      {
        page: "medidas-de-dispersion",
        body: "Ojo: la cátedra escribe $N(\\mu,\\sigma)$ con el desvío, no con la varianza.\n\nRevisar el ejercicio 4 del TP.",
        updatedAt: "2026-09-02T14:05:00.000Z",
      },
    ],
    tasksDone: ["task:leer-u1", "task:mazo-descriptiva"],
    attempts: [{ quizId: "quiz-continuas", score: 2, total: 3, at: "2026-09-03T19:40:00.000Z" }],
  };
}

// ---------------------------------------------------------------------------
// Grafo de conexiones
// ---------------------------------------------------------------------------

/**
 * Grafo de mentira derivado de las páginas del fixture: un nodo por página y una
 * arista entre páginas consecutivas de la misma división (la cadena de lectura,
 * ordenada por `order` y, a falta de él, por el orden del fixture). Alcanza para
 * que la vista del grafo tenga componentes separadas y grados distintos.
 */
export function mockGraph(cfg: GraphConfig = probaConfig, pages: readonly PageMeta[] = mockPages): GraphData {
  const chains = new Map<string, PageMeta[]>();
  pages.forEach((p) => {
    const key = divisionOf(cfg, p);
    const list = chains.get(key);
    if (list) list.push(p);
    else chains.set(key, [p]);
  });

  const edges: GraphEdge[] = [];
  for (const list of chains.values()) {
    const chain = [...list].sort(
      (a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER),
    );
    for (let i = 0; i + 1 < chain.length; i++) {
      const from = chain[i];
      const to = chain[i + 1];
      if (from && to) edges.push({ from: from.slug, to: to.slug });
    }
  }

  const nodes: GraphNode[] = pages.map((p) => ({
    slug: p.slug,
    title: p.title,
    type: p.type,
    division: divisionOf(cfg, p),
    words: p.words,
    inDegree: edges.filter((e) => e.to === p.slug).length,
    outDegree: edges.filter((e) => e.from === p.slug).length,
  }));

  return { nodes, edges };
}
