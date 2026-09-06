import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { StudyContent, SubjectConfig, type SubjectConfig as Cfg } from "@sinapsis/contract";
import { compileWiki } from "./compile.js";
import { compileStudy, isEmptyStudy, splitSections, studyCounts } from "./study.js";

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
