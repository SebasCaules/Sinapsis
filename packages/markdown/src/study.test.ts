import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { StudyContent, SubjectConfig, type SubjectConfig as Cfg } from "@sinapsis/contract";
import { compileWiki } from "./compile.js";
import { compileStudy, isEmptyStudy, planPhases, splitSections, studyCounts } from "./study.js";

const config: Cfg = SubjectConfig.parse({
  slug: "demo",
  name: "Materia de prueba",
  code: "00.00",
  institution: "ITBA",
  division: { singular: "Unidad", abbr: "U", plural: "Unidades" },
  divisions: [
    { key: "1", name: "Primera" },
    { key: "2", name: "Segunda" },
  ],
  pageTypes: [{ key: "concepto", label: "Concepto", plural: "Conceptos", folder: "conceptos" }],
  rail: [
    {
      id: "resolver",
      label: "Resolver",
      items: [{ id: "calc", label: "Calculadoras", icon: "calc", kind: "tool", target: "calc" }],
    },
  ],
  wiki: { root: "wiki", divisionField: "unidad", study: "estudio" },
});

const pages = [{ slug: "esperanza" }, { slug: "varianza" }];

let dir = "";

beforeEach(async () => {
  dir = await mkdtemp(path.join(tmpdir(), "sinapsis-study-"));
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

const write = (file: string, text: string) => writeFile(path.join(dir, file), text, "utf8");
const compile = () => compileStudy({ dir, config, pages });

describe("compileStudy · carpeta ausente o vacía", () => {
  it("devuelve un StudyContent vacío y sin advertencias si no hay carpeta", async () => {
    const { study, issues } = await compileStudy({ dir: path.join(dir, "no-existe"), config, pages });
    expect(isEmptyStudy(study)).toBe(true);
    expect(issues).toEqual([]);
    expect(StudyContent.safeParse(study).success).toBe(true);
  });

  it("ignora en silencio los archivos sin `tipo` (README, notas)", async () => {
    await write("README.md", "# Cómo se escribe el material\n\n## Esto no es una tarjeta\n");
    await write("notas.md", "---\ntitulo: Notas sueltas\n---\n\n## Tampoco\n\ncuerpo\n");
    const { study, issues } = await compile();
    expect(isEmptyStudy(study)).toBe(true);
    expect(issues).toEqual([]);
  });
});

describe("compileStudy · mazos", () => {
  it("compila un mazo de 3 tarjetas, con `{#id}`, `pagina:` y `tags:`", async () => {
    await write(
      "flashcards-definiciones.md",
      [
        "---",
        "tipo: flashcards",
        "titulo: Definiciones clave",
        "division: 1",
        "descripcion: Las que se toman siempre.",
        "id: definiciones",
        "---",
        "",
        "## Definición de esperanza $E[X]$",
        "",
        "> pagina: esperanza",
        "> tags: discreta, momentos",
        "",
        "$E[X]=\\sum_x x\\,p_X(x)$.",
        "",
        "### Detalle",
        "",
        "Es el centro de masa.",
        "",
        "## Fórmula práctica de la varianza {#varianza-practica}",
        "",
        "pagina: varianza",
        "",
        "$V(X)=E[X^2]-E[X]^2$.",
        "",
        "## Un `##` dentro de código no abre tarjeta",
        "",
        "```md",
        "## esto es un ejemplo",
        "```",
        "",
        "Sigue el mismo reverso.",
        "",
      ].join("\n"),
    );

    const { study, issues } = await compile();
    expect(issues).toEqual([]);
    expect(study.decks).toHaveLength(1);

    const deck = study.decks[0]!;
    expect(deck).toMatchObject({ id: "definiciones", title: "Definiciones clave", division: "1", source: "authored" });
    expect(deck.description).toBe("Las que se toman siempre.");
    expect(deck.cards.map((c) => c.id)).toEqual(["definiciones:1", "varianza-practica", "definiciones:3"]);
    expect(deck.cards[0]).toMatchObject({
      front: "Definición de esperanza $E[X]$",
      page: "esperanza",
      tags: ["discreta", "momentos"],
      division: "1",
    });
    expect(deck.cards[0]!.back).toContain("### Detalle");
    expect(deck.cards[0]!.back).not.toContain("pagina:");
    expect(deck.cards[1]).toMatchObject({ front: "Fórmula práctica de la varianza", page: "varianza" });
    expect(deck.cards[2]!.back).toContain("## esto es un ejemplo");
    expect(studyCounts(study)).toMatchObject({ decks: 1, cards: 3, quizzes: 0, questions: 0, kits: 0 });
  });

  it("toma el id del nombre del archivo y avisa por tarjetas incompletas", async () => {
    await write(
      "flashcards-teoremas.md",
      ["---", "tipo: flashcards", "titulo: Teoremas", "---", "", "## Sin reverso", "", "## Con reverso", "", "Sí.", ""].join("\n"),
    );
    const { study, issues } = await compile();
    expect(study.decks[0]!.id).toBe("flashcards-teoremas");
    expect(study.decks[0]!.cards.map((c) => c.id)).toEqual(["flashcards-teoremas:1"]);
    expect(issues.map((i) => i.kind)).toEqual(["study-empty"]);
    expect(issues[0]!.detail).toContain("no tiene reverso");
  });

  it("avisa por una división no declarada y por una página inexistente", async () => {
    await write(
      "flashcards-otro.md",
      ["---", "tipo: flashcards", "titulo: Otro", "division: 9", "---", "", "## Anverso", "", "> pagina: no-existe", "", "Reverso.", ""].join("\n"),
    );
    const { issues } = await compile();
    const details = issues.map((i) => `${i.kind}: ${i.detail}`).join("\n");
    expect(details).toContain('la división "9" no está en config.divisions');
    expect(details).toContain('la página "no-existe" no existe en el wiki');
  });
});

describe("compileStudy · quizzes", () => {
  const quiz = [
    "---",
    "tipo: quiz",
    "titulo: Quiz conceptual",
    "id: quiz-general",
    "---",
    "",
    "## ¿Qué distribución tiene media = varianza?",
    "",
    "pagina: esperanza",
    "",
    "- [ ] Binomial",
    "- [x] Poisson",
    "- [ ] Normal",
    "",
    "> Poisson: $E[X]=V(X)=\\lambda$.",
    "",
    "## Pregunta sin opción correcta",
    "",
    "- [ ] Una",
    "- [ ] Otra",
    "",
    "## Pregunta con una sola opción",
    "",
    "- [x] Sola",
    "",
  ].join("\n");

  it("compila las preguntas y avisa por las inválidas", async () => {
    await write("quiz-general.md", quiz);
    const { study, issues } = await compile();

    expect(study.quizzes).toHaveLength(1);
    const parsed = study.quizzes[0]!;
    expect(parsed).toMatchObject({ id: "quiz-general", title: "Quiz conceptual" });
    expect(parsed.questions).toHaveLength(1);
    expect(parsed.questions[0]).toMatchObject({
      id: "quiz-general:1",
      prompt: "¿Qué distribución tiene media = varianza?",
      explanation: "Poisson: $E[X]=V(X)=\\lambda$.",
      page: "esperanza",
    });
    expect(parsed.questions[0]!.options).toEqual([
      { text: "Binomial", correct: false },
      { text: "Poisson", correct: true },
      { text: "Normal", correct: false },
    ]);

    const kinds = issues.map((i) => i.kind);
    expect(kinds).toContain("quiz-no-correct");
    expect(kinds).toContain("quiz-few-options");
    expect(issues.find((i) => i.kind === "quiz-no-correct")!.detail).toContain("- [x]");
  });

  it("lee el `{alt: …}` de una opción que es solo matemática", async () => {
    await write(
      "quiz-alt.md",
      [
        "---",
        "tipo: quiz",
        "titulo: Potencia",
        "id: quiz-alt",
        "---",
        "",
        "## ¿Qué mide la potencia de una prueba?",
        "",
        "- [ ] $\\alpha$ {alt: alfa}",
        "- [x] $1-\\beta$ {alt: uno menos beta}",
        "- [ ] $\\beta$",
        "- [ ] {alt: sin texto}",
        "",
      ].join("\n"),
    );
    const { study, issues } = await compile();

    expect(study.quizzes[0]!.questions[0]!.options).toEqual([
      { text: "$\\alpha$", correct: false, alt: "alfa" },
      { text: "$1-\\beta$", correct: true, alt: "uno menos beta" },
      { text: "$\\beta$", correct: false },
      // Sin texto delante, la directiva no se separa: la opción vale más.
      { text: "{alt: sin texto}", correct: false },
    ]);
    expect(issues).toEqual([]);
    expect(StudyContent.safeParse(study).success).toBe(true);
  });

  it("descarta el quiz entero si ninguna pregunta queda en pie", async () => {
    await write("quiz-vacio.md", ["---", "tipo: quiz", "titulo: Vacío", "---", "", "## Sin opciones", "", "texto", ""].join("\n"));
    const { study, issues } = await compile();
    expect(study.quizzes).toEqual([]);
    expect(issues.map((i) => i.kind)).toContain("study-empty");
  });
});

describe("compileStudy · plan.json y kits.json", () => {
  it("compila un plan y un kit correctos", async () => {
    await write(
      "flashcards-uno.md",
      ["---", "tipo: flashcards", "titulo: Uno", "id: uno", "---", "", "## A", "", "B", ""].join("\n"),
    );
    await write(
      "plan.json",
      JSON.stringify({
        title: "Plan de la cursada",
        phases: [
          {
            id: "fase-1",
            title: "Parcial",
            subtitle: "U1 y U2",
            date: "2026-10-01",
            scope: "Todo lo visto.",
            milestones: [
              {
                id: "fase-1-h1",
                title: "Unidad 1",
                divisions: ["1"],
                tasks: [
                  { id: "fase-1-h1-t1", label: "Leer la teoría", kind: "read", target: "1" },
                  { id: "fase-1-h1-t2", label: "Flashcards", kind: "cards", target: "uno" },
                ],
              },
            ],
          },
        ],
      }),
    );
    await write(
      "kits.json",
      JSON.stringify([
        {
          id: "parcial",
          title: "Kit del parcial",
          divisions: ["1"],
          pages: ["esperanza"],
          decks: ["uno"],
          tools: ["calc"],
        },
      ]),
    );

    const { study, issues } = await compile();
    expect(issues).toEqual([]);
    expect(study.plan?.title).toBe("Plan de la cursada");
    expect(study.kits[0]!.tools).toEqual(["calc"]);
    expect(studyCounts(study)).toMatchObject({ phases: 1, milestones: 1, tasks: 2, kits: 1, decks: 1 });
  });

  it("avisa con la ruta del campo cuando plan.json no cumple el contrato", async () => {
    await write("plan.json", JSON.stringify({ phases: [{ id: "fase-1", milestones: [] }] }));
    const { study, issues } = await compile();
    expect(study.plan).toBeNull();
    const detail = issues.map((i) => i.detail).join("\n");
    expect(issues[0]!.kind).toBe("study-invalid");
    expect(detail).toContain("phases.0.title");
  });

  it("avisa si el JSON está roto", async () => {
    await write("kits.json", "[{ esto no es json }]");
    const { study, issues } = await compile();
    expect(study.kits).toEqual([]);
    expect(issues[0]!.detail).toContain("no es JSON válido");
  });

  it("detecta las referencias rotas del plan y de los kits", async () => {
    await write(
      "plan.json",
      JSON.stringify({
        phases: [
          {
            id: "fase-1",
            title: "Fase",
            milestones: [
              {
                id: "fase-1-h1",
                title: "Hito",
                divisions: ["7"],
                tasks: [
                  { id: "fase-1-h1-t1", label: "Leer", kind: "read", target: "esperanza" },
                  { id: "fase-1-h1-t2", label: "Mazo", kind: "cards", target: "no-existe" },
                  { id: "fase-1-h1-t3", label: "Quiz", kind: "quiz", target: "tampoco" },
                  { id: "fase-1-h1-t4", label: "Herramienta", kind: "tool", target: "taller" },
                  { id: "fase-1-h1-t5", label: "Calculadoras", kind: "tool", target: "calc" },
                ],
              },
            ],
          },
        ],
      }),
    );
    await write(
      "kits.json",
      JSON.stringify([
        { id: "k", title: "Kit", pages: ["fantasma"], decks: ["ninguno"], quizzes: ["ningun-quiz"], tools: ["taller"] },
      ]),
    );

    const { issues } = await compile();
    const broken = issues.filter((i) => i.kind === "study-broken-ref").map((i) => i.detail);
    expect(broken).toEqual([
      'la división "7" no está en config.divisions',
      '«read» apunta a "esperanza", que no es una división del config',
      '«cards» apunta al mazo "no-existe", que no existe',
      '«quiz» apunta al quiz "tampoco", que no existe',
      '«tool» apunta a "taller", que no es un id de ítem del rail del config',
      'la página "fantasma" no existe en el wiki',
      'el mazo "ninguno" no existe',
      'el quiz "ningun-quiz" no existe',
      'la herramienta "taller" no es un ítem del rail del config',
    ]);
  });

  it("sin `pages` no verifica los slugs (el caso de `sinapsis validate`)", async () => {
    await write("kits.json", JSON.stringify([{ id: "k", title: "Kit", pages: ["fantasma"] }]));
    const { issues } = await compileStudy({ dir, config });
    expect(issues).toEqual([]);
  });

  it("avisa por ids repetidos entre mazos", async () => {
    const deck = (titulo: string) =>
      ["---", "tipo: flashcards", `titulo: ${titulo}`, "id: repetido", "---", "", "## A {#fija}", "", "B", ""].join("\n");
    await write("a.md", deck("A"));
    await write("b.md", deck("B"));
    const { issues } = await compile();
    const dupes = issues.filter((i) => i.kind === "study-duplicate-id").map((i) => i.detail);
    expect(dupes).toContain('id de mazo "repetido"');
    expect(dupes.join("\n")).toContain('id de tarjeta "fija"');
  });
});

describe("compileStudy · modalidades del plan (Plan.tracks)", () => {
  /** Una fase con un hito y una tarea; `n` distingue los ids. */
  const phase = (id: string, title: string, task = `${id}-h1-t1`) => ({
    id,
    title,
    milestones: [{ id: `${id}-h1`, title: "Hito", divisions: ["1"], tasks: [{ id: task, label: "Leer", kind: "read", target: "1" }] }],
  });

  /** Plan con dos modalidades: la primera repite `phases` (la de por defecto). */
  const conModalidades = (extra: Record<string, unknown> = {}) => ({
    title: "Plan",
    phases: [phase("fase-1", "Parcial"), phase("fase-2", "Final")],
    tracks: [
      { id: "cursada", label: "Cursada + final", phases: [phase("fase-1", "Parcial"), phase("fase-2", "Final")] },
      { id: "final-directo", label: "Final directo", phases: [phase("fase-3", "Todo el programa")] },
    ],
    ...extra,
  });

  it("acepta las dos modalidades y no cuenta dos veces la fase compartida", async () => {
    await write("plan.json", JSON.stringify(conModalidades()));
    const { study, issues } = await compile();

    expect(issues).toEqual([]);
    expect(study.plan?.tracks.map((t) => t.label)).toEqual(["Cursada + final", "Final directo"]);
    expect(study.plan?.phases.map((p) => p.id)).toEqual(["fase-1", "fase-2"]);
    // 3 fases distintas: las dos de la cursada (que `phases` repite) y la del directo.
    expect(planPhases(study.plan).map((p) => p.id)).toEqual(["fase-1", "fase-2", "fase-3"]);
    expect(studyCounts(study)).toMatchObject({ phases: 3, milestones: 3, tasks: 3, tracks: 2 });
  });

  it("avisa por un id de tarea repetido entre dos modalidades", async () => {
    const plan = conModalidades();
    // La fase del final directo reusa el id de tarea de la cursada: al marcarla
    // hecha en una modalidad se marcaría también en la otra.
    plan.tracks[1]!.phases = [phase("fase-3", "Todo el programa", "fase-1-h1-t1")];
    await write("plan.json", JSON.stringify(plan));

    const { issues } = await compile();
    const dupes = issues.filter((i) => i.kind === "study-duplicate-id").map((i) => i.detail);
    expect(dupes.join("\n")).toContain('id de tarea "fase-1-h1-t1"');
  });

  it("una fase repetida con contenido distinto es un error de identificación", async () => {
    const plan = conModalidades();
    plan.tracks[0]!.phases = [phase("fase-1", "Parcial con otro título"), phase("fase-2", "Final")];
    await write("plan.json", JSON.stringify(plan));

    const { issues } = await compile();
    const detail = issues.map((i) => i.detail).join("\n");
    expect(detail).toContain('la fase "fase-1" aparece en dos modalidades con contenido distinto');
  });

  it("avisa si `phases` no repite ninguna modalidad y si se repite un id de modalidad", async () => {
    const plan = conModalidades({ phases: [phase("fase-9", "Suelta")] });
    plan.tracks[1]!.id = "cursada";
    await write("plan.json", JSON.stringify(plan));

    const { issues } = await compile();
    const detail = issues.map((i) => i.detail).join("\n");
    expect(detail).toContain('"phases" no coincide con ninguna modalidad');
    expect(detail).toContain('id de modalidad "cursada"');
  });

  it("verifica las referencias de las fases que solo existen en una modalidad", async () => {
    const plan = conModalidades();
    plan.tracks[1]!.phases = [
      {
        id: "fase-3",
        title: "Todo el programa",
        milestones: [
          {
            id: "fase-3-h1",
            title: "Hito",
            divisions: ["7"],
            tasks: [{ id: "fase-3-h1-t1", label: "Mazo", kind: "cards", target: "no-existe" }],
          },
        ],
      },
    ];
    await write("plan.json", JSON.stringify(plan));

    const { issues } = await compile();
    const broken = issues.filter((i) => i.kind === "study-broken-ref").map((i) => i.detail);
    expect(broken).toEqual([
      'la división "7" no está en config.divisions',
      '«cards» apunta al mazo "no-existe", que no existe',
    ]);
  });

  it("un plan sin modalidades sigue valiendo y cuenta 0 modalidades", async () => {
    await write("plan.json", JSON.stringify({ phases: [phase("fase-1", "Única")] }));
    const { study, issues } = await compile();
    expect(issues).toEqual([]);
    expect(study.plan?.tracks).toEqual([]);
    expect(studyCounts(study)).toMatchObject({ phases: 1, tracks: 0 });
  });
});

describe("compileStudy · instancias evaluatorias del plan (Plan.instances)", () => {
  /** Fase con una tarea; `extra` agrega `instance`, `retake`… */
  const phase = (id: string, extra: Record<string, unknown> = {}) => ({
    id,
    title: "Parcial",
    milestones: [
      { id: `${id}-h1`, title: "Hito", divisions: ["1"], tasks: [{ id: `${id}-h1-t1`, label: "Leer", kind: "read", target: "1" }] },
    ],
    ...extra,
  });

  it("compila las instancias y las fechas que la fase les asocia", async () => {
    await write(
      "plan.json",
      JSON.stringify({
        phases: [phase("fase-1", { instance: "parcial", retake: "recparcial", description: "Integra todo." })],
        instances: [
          { key: "parcial", label: "Parcial (TP1–TP7)" },
          { key: "recparcial", label: "Recuperatorio del parcial", optional: true },
        ],
      }),
    );

    const { study, issues } = await compile();
    expect(issues).toEqual([]);
    expect(study.plan?.instances).toEqual([
      { key: "parcial", label: "Parcial (TP1–TP7)", optional: false },
      { key: "recparcial", label: "Recuperatorio del parcial", optional: true },
    ]);
    expect(study.plan?.phases[0]).toMatchObject({
      instance: "parcial",
      retake: "recparcial",
      description: "Integra todo.",
    });
  });

  it("un plan sin instancias no avisa nada (la materia puede no tener fechas)", async () => {
    await write("plan.json", JSON.stringify({ phases: [phase("fase-1")] }));
    const { study, issues } = await compile();
    expect(issues).toEqual([]);
    expect(study.plan?.instances).toEqual([]);
  });

  it("avisa si una fase apunta a una instancia que «instances» no declara", async () => {
    await write(
      "plan.json",
      JSON.stringify({
        phases: [phase("fase-1", { instance: "parcial", retake: "recparcial" })],
        instances: [{ key: "parcial", label: "Parcial" }],
      }),
    );

    const { issues } = await compile();
    const broken = issues.filter((i) => i.kind === "study-broken-ref");
    expect(broken.map((i) => i.detail)).toEqual([
      '«retake» apunta a la instancia "recparcial", que no está declarada en "instances"',
    ]);
    expect(broken[0]!.page).toBe("plan.json · fase-1");
  });

  it("avisa por una clave de instancia repetida", async () => {
    await write(
      "plan.json",
      JSON.stringify({
        phases: [phase("fase-1", { instance: "parcial" })],
        instances: [
          { key: "parcial", label: "Parcial" },
          { key: "parcial", label: "Parcial (otra vez)" },
        ],
      }),
    );

    const { issues } = await compile();
    const dupes = issues.filter((i) => i.kind === "study-duplicate-id").map((i) => i.detail);
    expect(dupes.join("\n")).toContain('clave de instancia "parcial"');
  });

  it("avisa si el recuperatorio es la misma instancia que la principal", async () => {
    await write(
      "plan.json",
      JSON.stringify({
        phases: [phase("fase-1", { instance: "parcial", retake: "parcial" })],
        instances: [{ key: "parcial", label: "Parcial" }],
      }),
    );

    const { issues } = await compile();
    const detail = issues.map((i) => i.detail).join("\n");
    expect(detail).toContain('«instance» y «retake» son la misma instancia ("parcial")');
  });

  it("una instancia declarada que ninguna fase usa no es un problema", async () => {
    await write(
      "plan.json",
      JSON.stringify({
        phases: [phase("fase-1", { instance: "parcial" })],
        instances: [
          { key: "parcial", label: "Parcial" },
          { key: "final", label: "Final" },
        ],
      }),
    );

    const { issues } = await compile();
    expect(issues).toEqual([]);
  });
});

describe("splitSections", () => {
  it("no abre sección dentro de un bloque de código ni de un bloque $$", () => {
    const sections = splitSections(
      ["## Uno", "```", "## no", "```", "$$", "## tampoco", "$$", "## Dos", "cuerpo"].join("\n"),
    );
    expect(sections.map((s) => s.heading.text)).toEqual(["Uno", "Dos"]);
  });
});

describe("compileWiki · integración", () => {
  it("resuelve `wiki.study` contra el config aunque `--wiki` apunte a otra carpeta", async () => {
    const subject = path.join(dir, "materia");
    const vault = path.join(dir, "vault", "wiki");
    await mkdir(path.join(subject, "estudio"), { recursive: true });
    await mkdir(path.join(vault, "conceptos"), { recursive: true });
    await writeFile(
      path.join(vault, "conceptos", "esperanza.md"),
      "---\ntitulo: Esperanza\nunidad: 1\nresumen: 'El centro de masa.'\n---\n\nCuerpo.\n",
    );
    await writeFile(
      path.join(subject, "estudio", "flashcards-uno.md"),
      ["---", "tipo: flashcards", "titulo: Uno", "id: uno", "---", "", "## A", "", "> pagina: esperanza", "", "B", ""].join("\n"),
    );

    const compiled = await compileWiki({ config, rootDir: subject, wikiRoot: vault });
    expect(compiled.studyDir).toBe(path.join(subject, "estudio"));
    expect(compiled.study.decks).toHaveLength(1);
    expect(compiled.payload.study?.decks[0]!.cards[0]).toMatchObject({ page: "esperanza" });
    expect(compiled.warnings).toEqual([]);
  });

  it("sin material de estudio, `payload.study` viaja vacío (el sync reemplaza)", async () => {
    const subject = path.join(dir, "sin-estudio");
    await mkdir(path.join(subject, "wiki", "conceptos"), { recursive: true });
    await writeFile(
      path.join(subject, "wiki", "conceptos", "uno.md"),
      "---\ntitulo: Uno\nunidad: 1\nresumen: 'Algo.'\n---\n\nCuerpo.\n",
    );
    const compiled = await compileWiki({ config, rootDir: subject });
    expect(compiled.payload.study).toEqual({ decks: [], quizzes: [], plan: null, kits: [] });
    expect(isEmptyStudy(compiled.study)).toBe(true);
    expect(compiled.warnings).toEqual([]);
  });

  it("las advertencias del estudio entran en el listado general", async () => {
    const subject = path.join(dir, "con-avisos");
    await mkdir(path.join(subject, "wiki", "conceptos"), { recursive: true });
    await mkdir(path.join(subject, "estudio"), { recursive: true });
    await writeFile(
      path.join(subject, "wiki", "conceptos", "uno.md"),
      "---\ntitulo: Uno\nunidad: 1\nresumen: 'Algo.'\n---\n\nCuerpo.\n",
    );
    await writeFile(
      path.join(subject, "estudio", "quiz-roto.md"),
      ["---", "tipo: quiz", "titulo: Roto", "---", "", "## Pregunta", "", "- [ ] Una", "- [ ] Otra", ""].join("\n"),
    );

    const compiled = await compileWiki({ config, rootDir: subject });
    expect(compiled.warnings.join("\n")).toContain("no marca ninguna opción correcta");
  });
});

describe("splitSections — cercas largas (AC-06)", () => {
  it("una cerca de cuatro acentos graves no se cierra con una de tres", () => {
    const body = ["## A", "````markdown", "```", "## NO ES UNA TARJETA", "```", "````", "cuerpo"].join("\n");
    expect(splitSections(body).map((s) => s.heading.text)).toEqual(["A"]);
  });
});

/**
 * El separador de la regla 3 se escribía con el byte NUL crudo dentro del
 * string en vez del escape `\0`: `file` clasificaba el módulo como «data» y
 * `grep` sin `-a` lo salteaba sin avisar, así que cualquier búsqueda de texto
 * sobre este archivo quedaba ciega.
 */
describe("el módulo no lleva bytes de control crudos", () => {
  it("study.ts se puede grepear como texto", async () => {
    const src = await readFile(fileURLToPath(new URL("./study.ts", import.meta.url)), "utf8");
    expect(src.includes("\u0000")).toBe(false);
  });
});
