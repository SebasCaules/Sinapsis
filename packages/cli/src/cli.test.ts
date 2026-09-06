import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { chmod, mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { SubjectConfig, SyncPayload, ToolPush } from "@sinapsis/contract";
import { SiteCatalog, SitePages, SiteSubject, SiteTools } from "@sinapsis/contract/site";
import { compileStudy, studyCounts } from "@sinapsis/markdown";
import { cleanArgv, extractCwd, main } from "./cli.js";
import { gateCounts, shorten } from "./commands/propose.js";
import { extraChecks } from "./commands/validate.js";
import { invocationCwd, type Ctx } from "./context.js";

const run = promisify(execFile);

const PKG_ROOT = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const REPO_ROOT = path.resolve(PKG_ROOT, "../..");
/** La materia real vive dentro del repositorio: los tests no necesitan el vault. */
const PROBA_DIR = path.join(REPO_ROOT, "subjects/proba");
const PROBA_CONFIG = path.join(PROBA_DIR, "sinapsis.config.json");

/** Contexto de prueba: acumula la salida en memoria. */
function testCtx(cwd: string, env: Record<string, string | undefined> = {}): Ctx & {
  stdout: string[];
  stderr: string[];
} {
  const stdout: string[] = [];
  const stderr: string[] = [];
  return {
    out: (line) => stdout.push(line),
    err: (line) => stderr.push(line),
    cwd,
    env,
    stdout,
    stderr,
  };
}

describe("cleanArgv", () => {
  it("descarta los `--` sueltos que agrega pnpm run", () => {
    expect(cleanArgv(["--", "--", "sync", "--dry-run"])).toEqual(["sync", "--dry-run"]);
    expect(cleanArgv(["sync"])).toEqual(["sync"]);
  });
});

describe("extractCwd", () => {
  it("saca --cwd de cualquier posición", () => {
    expect(extractCwd(["--cwd", "/a", "sync"])).toEqual({ cwd: "/a", rest: ["sync"] });
    expect(extractCwd(["sync", "--cwd", "/a", "--dry-run"])).toEqual({ cwd: "/a", rest: ["sync", "--dry-run"] });
    expect(extractCwd(["sync", "--cwd=/a"])).toEqual({ cwd: "/a", rest: ["sync"] });
  });

  it("gana la última aparición y sin bandera no cambia nada", () => {
    expect(extractCwd(["--cwd", "/a", "sync", "--cwd=/b"])).toEqual({ cwd: "/b", rest: ["sync"] });
    expect(extractCwd(["status"])).toEqual({ rest: ["status"] });
  });
});

describe("invocationCwd", () => {
  const insidePackage = path.join(PKG_ROOT, "src");

  it("usa INIT_CWD solo si pnpm reubicó el proceso dentro del paquete del CLI", () => {
    expect(invocationCwd({ INIT_CWD: "/proyectos/materia" }, insidePackage)).toBe("/proyectos/materia");
    expect(invocationCwd({ INIT_CWD: "/proyectos/materia" }, PKG_ROOT)).toBe("/proyectos/materia");
  });

  it("fuera del paquete manda process.cwd(), aunque haya INIT_CWD heredado", () => {
    expect(invocationCwd({ INIT_CWD: "/otro/repo" }, "/proyectos/materia")).toBe("/proyectos/materia");
    expect(invocationCwd({}, "/proyectos/materia")).toBe("/proyectos/materia");
    expect(invocationCwd({ INIT_CWD: "   " }, insidePackage)).toBe(insidePackage);
  });
});

describe("sinapsis init", () => {
  let base = "";
  let subject = "";

  beforeEach(async () => {
    base = await mkdtemp(path.join(tmpdir(), "sinapsis-cli-"));
    subject = path.join(base, "analisis-2");
    await mkdir(path.join(subject, "wiki", "conceptos"), { recursive: true });
    await mkdir(path.join(subject, "wiki", "practicas"), { recursive: true });
    const page = (titulo: string, unidad: string, resumen = "Un resumen.") =>
      `---\ntitulo: ${titulo}\nunidad: ${unidad}\nresumen: '${resumen}'\n---\n\n# ${titulo}\n\nCuerpo.\n`;
    await writeFile(path.join(subject, "wiki", "conceptos", "limite.md"), page("Límite", "1"));
    await writeFile(path.join(subject, "wiki", "conceptos", "derivada.md"), page("Derivada", "2"));
    await writeFile(path.join(subject, "wiki", "practicas", "tp1.md"), page("TP 1", "1"));
    await writeFile(path.join(subject, "wiki", "practicas", "tp2.md"), page("TP 2", "2"));
  });

  afterEach(async () => {
    await rm(base, { recursive: true, force: true });
  });

  it("escribe un config válido a partir del wiki", async () => {
    const ctx = testCtx(subject);
    const code = await main(["init", "--wiki", "wiki"], ctx);
    expect(ctx.stderr.join("\n")).toBe("");
    expect(code).toBe(0);

    const written = path.join(subject, "sinapsis.config.json");
    expect(existsSync(written)).toBe(true);
    const parsed = SubjectConfig.parse(JSON.parse(await readFile(written, "utf8")) as unknown);

    expect(parsed.slug).toBe("analisis-2");
    expect(parsed.division.singular).toBe("Unidad");
    expect(parsed.divisions.map((d) => d.key)).toEqual(["1", "2"]);
    expect(parsed.pageTypes.map((t) => t.folder)).toEqual(["conceptos", "practicas"]);
    expect(parsed.pageTypes.map((t) => t.key)).toEqual(["concepto", "practica"]);
    expect(parsed.wiki).toMatchObject({ root: "wiki", divisionField: "unidad" });
    expect(parsed.name).toBe("COMPLETAR");

    // El informe dice qué falta completar.
    expect(ctx.stdout.join("\n")).toContain("Qué falta completar");
    expect(ctx.stdout.join("\n")).toContain("name, code, institution, semester");

    // El config recién creado valida.
    const validateCtx = testCtx(subject);
    expect(await main(["validate", "--config", "sinapsis.config.json"], validateCtx)).toBe(0);
  });

  it("deja lista la carpeta del material de estudio", async () => {
    const ctx = testCtx(subject);
    expect(await main(["init", "--wiki", "wiki"], ctx)).toBe(0);

    const study = path.join(subject, "estudio");
    expect(existsSync(path.join(study, "README.md"))).toBe(true);
    const ejemplo = await readFile(path.join(study, "flashcards-ejemplo.md"), "utf8");
    expect(ejemplo).toContain("tipo: flashcards");
    expect(ctx.stdout.join("\n")).toContain("material de estudio");

    // El config declara la carpeta y el ejemplo compila: 2 tarjetas, sin advertencias.
    const parsed = SubjectConfig.parse(
      JSON.parse(await readFile(path.join(subject, "sinapsis.config.json"), "utf8")) as unknown,
    );
    expect(parsed.wiki.study).toBe("estudio");
    const compiled = await compileStudy({ dir: study, config: parsed });
    expect(compiled.issues).toEqual([]);
    expect(compiled.study.decks[0]!.cards.map((c) => c.id)).toEqual(["ejemplo:1", "ids"]);
  });

  it("no sobreescribe un config existente salvo con --force", async () => {
    const ctx = testCtx(subject);
    expect(await main(["init", "--wiki", "wiki"], ctx)).toBe(0);

    const again = testCtx(subject);
    expect(await main(["init", "--wiki", "wiki"], again)).toBe(1);
    expect(again.stderr.join("\n")).toContain("Ya existe");

    const forced = testCtx(subject);
    expect(await main(["init", "--wiki", "wiki", "--force", "--slug", "an2"], forced)).toBe(0);
    const parsed = SubjectConfig.parse(
      JSON.parse(await readFile(path.join(subject, "sinapsis.config.json"), "utf8")) as unknown,
    );
    expect(parsed.slug).toBe("an2");
  });

  it("falla si la carpeta del wiki no existe", async () => {
    const ctx = testCtx(subject);
    expect(await main(["init", "--wiki", "no-existe"], ctx)).toBe(1);
    expect(ctx.stderr.join("\n")).toContain("No encuentro la carpeta del wiki");
  });
});

describe("sinapsis validate", () => {
  let dir = "";

  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), "sinapsis-validate-"));
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("acepta el config de la materia real de Proba", async () => {
    const ctx = testCtx(REPO_ROOT);
    expect(await main(["validate", "--config", "subjects/proba/sinapsis.config.json"], ctx)).toBe(0);
    expect(ctx.stdout.join("\n")).toContain("Config válido");
    // El material de estudio de Proba trae dos modalidades de plan (S-11).
    expect(ctx.stdout.join("\n")).toContain("Modalidades: Cursada + final (5 fases) · Final directo (1 fase)");
  });

  it("sale 1 con un config roto e indica el campo", async () => {
    const broken = path.join(dir, "sinapsis.config.json");
    await writeFile(
      broken,
      JSON.stringify({ slug: "Mal Slug", name: "X", code: "1", institution: "ITBA", divisions: [] }),
    );
    const ctx = testCtx(dir);
    expect(await main(["validate", "--config", "sinapsis.config.json"], ctx)).toBe(1);
    const err = ctx.stderr.join("\n");
    expect(err).toContain("no cumple el contrato");
    expect(err).toContain("slug");
    expect(err).toContain("divisions");
    expect(err).toContain("pageTypes");
  });

  it("--cwd manda sobre el directorio del contexto, delante o detrás del comando", async () => {
    await writeFile(
      path.join(dir, "sinapsis.config.json"),
      JSON.stringify({ slug: "Mal Slug", name: "X", code: "1", institution: "ITBA", divisions: [] }),
    );

    // Desde REPO_ROOT no habría config; con --cwd sí (y falla por el contrato, no por faltante).
    const antes = testCtx(REPO_ROOT);
    expect(await main(["--cwd", dir, "validate"], antes)).toBe(1);
    expect(antes.stderr.join("\n")).toContain("no cumple el contrato");

    const despues = testCtx(REPO_ROOT);
    expect(await main(["validate", `--cwd=${dir}`], despues)).toBe(1);
    expect(despues.stderr.join("\n")).toContain("no cumple el contrato");

    // Sin la bandera, el mismo comando no encuentra nada.
    const sinBandera = testCtx(path.join(dir, "no-existe"));
    expect(await main(["validate"], sinBandera)).toBe(1);
    expect(sinBandera.stderr.join("\n")).toContain("No encuentro el config");
  });

  it("resume el material de estudio y detecta un quiz sin opción correcta", async () => {
    await writeFile(
      path.join(dir, "sinapsis.config.json"),
      JSON.stringify({
        slug: "demo",
        name: "Demo",
        code: "0",
        institution: "ITBA",
        division: { singular: "Unidad", abbr: "U", plural: "Unidades" },
        divisions: [{ key: "1", name: "Una" }],
        pageTypes: [{ key: "concepto", label: "Concepto", plural: "Conceptos", folder: "conceptos" }],
        wiki: { root: "wiki", divisionField: "unidad", study: "estudio" },
      }),
    );
    await mkdir(path.join(dir, "estudio"), { recursive: true });
    await writeFile(
      path.join(dir, "estudio", "flashcards-uno.md"),
      "---\ntipo: flashcards\ntitulo: Uno\nid: uno\n---\n\n## Anverso\n\nReverso.\n",
    );
    await writeFile(
      path.join(dir, "estudio", "quiz-roto.md"),
      "---\ntipo: quiz\ntitulo: Roto\n---\n\n## ¿Cuál es?\n\n- [ ] Una\n- [ ] Otra\n",
    );

    const ctx = testCtx(dir);
    // Las advertencias del material de estudio no invalidan el config.
    expect(await main(["validate"], ctx)).toBe(0);
    const stdout = ctx.stdout.join("\n");
    expect(stdout).toContain("Estudio: 1 mazo (1 tarjeta) · 0 quizzes (0 preguntas) · plan: no · 0 kits");
    expect(stdout).toContain("no marca ninguna opción correcta");
  });

  it("sale 1 si el archivo no existe o no es JSON", async () => {
    const missing = testCtx(dir);
    expect(await main(["validate", "--config", "no-existe.json"], missing)).toBe(1);
    expect(missing.stderr.join("\n")).toContain("No encuentro el config");

    await writeFile(path.join(dir, "roto.json"), "{ no es json");
    const invalid = testCtx(dir);
    expect(await main(["validate", "--config", "roto.json"], invalid)).toBe(1);
    expect(invalid.stderr.join("\n")).toContain("no es JSON válido");
  });

  it("detecta problemas que zod no ve", () => {
    const base = SubjectConfig.parse(
      JSON.parse(
        JSON.stringify({
          slug: "x",
          name: "X",
          code: "1",
          institution: "ITBA",
          division: { singular: "Unidad", abbr: "U", plural: "Unidades" },
          divisions: [
            { key: "1", name: "Una" },
            { key: "1", name: "Repetida" },
          ],
          pageTypes: [
            { key: "a", label: "A", plural: "As", folder: "a" },
            { key: "b", label: "B", plural: "Bs", folder: "a" },
          ],
          rail: [
            {
              id: "g",
              label: "G",
              items: [
                { id: "i1", label: "I1", icon: "home", kind: "builtin", target: "inventada" },
                { id: "i2", label: "I2", icon: "link", kind: "link", target: "https://campus.itba.edu.ar" },
              ],
            },
          ],
        }),
      ) as unknown,
    );
    const messages = extraChecks(base).map((p) => `${p.level} ${p.field}: ${p.message}`);
    expect(messages.join("\n")).toContain('divisions: clave repetida "1"');
    expect(messages.join("\n")).toContain('pageTypes: carpeta repetida "a"');
    expect(messages.join("\n")).toContain('vista builtin desconocida "inventada"');
    // Desde la auditoría de seguridad del Sprint 1, una URL relativa en un `link`
    // la rechaza el propio esquema zod (ExternalUrl), antes de llegar a extraChecks.
    expect(() =>
      SubjectConfig.parse({ ...base, rail: [{ id: "g", label: "G", items: [{ id: "i", label: "I", icon: "link", kind: "link", target: "campus.itba.edu.ar" }] }] }),
    ).toThrow(/http\(s\) o mailto/);
    expect(() =>
      SubjectConfig.parse({ ...base, rail: [{ id: "g", label: "G", items: [{ id: "i", label: "I", icon: "link", kind: "link", target: "javascript:alert(1)" }] }] }),
    ).toThrow(/http\(s\) o mailto/);
    expect(() => SubjectConfig.parse({ ...base, wiki: { root: "wiki", index: "../../.ssh/id_rsa" } })).toThrow(/\.\./);
  });
});

describe("sinapsis publish", () => {
  it("compila la materia real de Proba y escribe un payload válido (--dry-run)", async () => {
    const out = path.join(await mkdtemp(path.join(tmpdir(), "sinapsis-publish-")), "payload.json");
    const ctx = testCtx(REPO_ROOT);
    const code = await main(
      ["publish", "--config", "subjects/proba/sinapsis.config.json", "--dry-run", "--out", out],
      ctx,
    );

    expect(ctx.stderr.join("\n")).toBe("");
    expect(code).toBe(0);
    expect(ctx.stdout.join("\n")).toContain("--dry-run: no se tocó el repositorio de la plataforma");

    const payload = SyncPayload.parse(JSON.parse(await readFile(out, "utf8")) as unknown);
    expect(payload.pages.length).toBeGreaterThanOrEqual(190);
    expect(payload.config.slug).toBe("proba");
    expect(payload.generator).toMatch(/^@sinapsis\/cli /);
    expect(new Date(payload.generatedAt).toString()).not.toBe("Invalid Date");

    // El material de estudio de `subjects/proba/estudio` viaja en el payload.
    const study = payload.study;
    expect(study).toBeDefined();
    expect(studyCounts(study!)).toEqual({
      decks: 6,
      cards: 46,
      quizzes: 1,
      questions: 15,
      phases: 6,
      milestones: 30,
      tasks: 89,
      tracks: 2,
      kits: 8,
    });
    // Las dos modalidades del plan (S-11): `phases` repite la de la cursada.
    expect(study!.plan!.tracks.map((t) => `${t.id}:${t.phases.length}`)).toEqual(["cursada:5", "final-directo:1"]);
    expect(study!.plan!.phases.map((p) => p.id)).toEqual(study!.plan!.tracks[0]!.phases.map((p) => p.id));
    expect(study!.decks.map((d) => d.id)).toContain("distribuciones");
    expect(study!.kits.map((k) => k.id)).toContain("parcialito-1");
    expect(ctx.stdout.join("\n")).toContain(
      "Estudio: 6 mazos (46 tarjetas) · 1 quiz (15 preguntas) · plan: 6 fases · 8 kits",
    );

    // Los dos bundles reales de la materia compilan y viajarían con ella.
    expect(ctx.stdout.join("\n")).toContain("bundle proba-tools");
    expect(ctx.stdout.join("\n")).toContain("bundle proba-exercises");

    // Objetivo de la conversión: ninguna referencia rota en el material de estudio.
    expect(ctx.stdout.join("\n")).not.toContain("estudio ·");

    await rm(path.dirname(out), { recursive: true, force: true });
  });

  it("--dry-run no necesita repositorio de plataforma ni red", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "sinapsis-dry-"));
    await mkdir(path.join(dir, "wiki", "conceptos"), { recursive: true });
    await writeFile(
      path.join(dir, "wiki", "conceptos", "uno.md"),
      "---\ntitulo: Uno\nunidad: 1\nresumen: 'Algo.'\n---\n# Uno\n",
    );
    await writeFile(
      path.join(dir, "sinapsis.config.json"),
      JSON.stringify({
        slug: "demo",
        name: "Demo",
        code: "0",
        institution: "ITBA",
        division: { singular: "Unidad", abbr: "U", plural: "Unidades" },
        divisions: [
          { key: "1", name: "Una" },
          { key: "2", name: "Vacía" },
        ],
        pageTypes: [{ key: "concepto", label: "Concepto", plural: "Conceptos", folder: "conceptos" }],
        wiki: { root: "wiki", divisionField: "unidad" },
      }),
    );

    // `--repo` apunta a algo que ni siquiera es un repositorio: en dry-run no se mira.
    const ctx = testCtx(dir);
    expect(await main(["publish", "--dry-run", "--repo", path.join(dir, "no-existe")], ctx)).toBe(0);
    const stdout = ctx.stdout.join("\n");
    expect(stdout).toContain("páginas: 1");
    expect(stdout).toContain("sin advertencias");
    expect(stdout).toContain("divisiones sin páginas: 2");
    expect(stdout).toContain("sin bundles de herramientas");

    await rm(dir, { recursive: true, force: true });
  });

  /** Materia mínima con wiki y sin carpeta `tools/`. */
  async function makeWikiOnly(): Promise<string> {
    const dir = await mkdtemp(path.join(tmpdir(), "sinapsis-publish-tools-"));
    await mkdir(path.join(dir, "wiki", "conceptos"), { recursive: true });
    await writeFile(
      path.join(dir, "wiki", "conceptos", "uno.md"),
      "---\ntitulo: Uno\nunidad: 1\nresumen: 'Algo.'\n---\n# Uno\n",
    );
    await writeFile(path.join(dir, "sinapsis.config.json"), JSON.stringify(DEMO_CONFIG), "utf8");
    return dir;
  }

  it("una materia sin herramientas se publica igual (AC-08)", async () => {
    const dir = await makeWikiOnly();
    const ctx = testCtx(dir);
    /* El objeto del comando es la materia: no tener herramientas no puede
       hacerlo salir 1 ni dejar el wiki sin publicar. */
    expect(await main(["publish", "--dry-run"], ctx)).toBe(0);
    expect(ctx.stderr.join("\n")).toBe("");
    const stdout = ctx.stdout.join("\n");
    expect(stdout).toContain("sin bundles de herramientas");
    expect(stdout).toContain("páginas: 1");

    /* `tools build`, en cambio, SÍ tiene a la carpeta por objeto: sigue saliendo 1. */
    const build = testCtx(dir);
    expect(await main(["tools", "build"], build)).toBe(1);
    expect(build.stderr.join("\n")).toContain("No encuentro la carpeta de herramientas");

    await rm(dir, { recursive: true, force: true });
  });

  it("un bundle que NO compila corta la publicación (AC-08)", async () => {
    const dir = await makeWikiOnly();
    const bundle = path.join(dir, "tools", "demo");
    await mkdir(bundle, { recursive: true });
    await writeFile(
      path.join(bundle, "sinapsis.tools.json"),
      JSON.stringify({ ...DEMO_MANIFEST, styles: [], data: [] }),
      "utf8",
    );
    await writeFile(path.join(bundle, "demo.js"), "(function () {\n  var x = ;\n})();\n", "utf8");

    const ctx = testCtx(dir);
    expect(await main(["publish", "--dry-run"], ctx)).toBe(1);
    expect(ctx.stderr.join("\n")).toContain("SyntaxError");

    await rm(dir, { recursive: true, force: true });
  });

  it("sale 1 si el repositorio de la plataforma no es un repositorio git", async () => {
    const dir = await makeWikiOnly();
    const ctx = testCtx(dir, {});
    expect(await main(["publish", "--repo", dir], ctx)).toBe(1);
    expect(ctx.stderr.join("\n")).toContain("no es un repositorio git");
    await rm(dir, { recursive: true, force: true });
  });
});

// ---------------------------------------------------------------------------
// Sprint 4 — publish contra un repositorio de plataforma de verdad (sin red)
// ---------------------------------------------------------------------------

/** Página markdown mínima. */
function page(titulo: string, unidad: string, cuerpo = "Cuerpo."): string {
  return `---\ntitulo: ${titulo}\nunidad: ${unidad}\nresumen: 'Resumen de ${titulo}.'\n---\n\n${cuerpo}\n`;
}

/** El vault de la materia «demo»: config, wiki, estudio y un bundle. */
async function makeVault(base: string): Promise<string> {
  const dir = path.join(base, "vault");
  await mkdir(path.join(dir, "wiki", "conceptos"), { recursive: true });
  await mkdir(path.join(dir, "estudio"), { recursive: true });
  await writeFile(path.join(dir, "sinapsis.config.json"), JSON.stringify(DEMO_CONFIG, null, 2), "utf8");
  await writeFile(path.join(dir, "wiki", "conceptos", "uno.md"), page("Uno", "1", "Va a [[Dos]]."), "utf8");
  await writeFile(path.join(dir, "wiki", "conceptos", "dos.md"), page("Dos", "1"), "utf8");
  await writeFile(
    path.join(dir, "estudio", "flashcards-uno.md"),
    "---\ntipo: flashcards\ntitulo: Uno\nid: uno\n---\n\n## Anverso\n\nReverso.\n",
    "utf8",
  );
  // Un bundle completo, con `dist/` y `scripts/` que NO tienen que viajar.
  const bundle = path.join(dir, "tools", "demo");
  await mkdir(path.join(bundle, "data"), { recursive: true });
  await mkdir(path.join(bundle, "scripts"), { recursive: true });
  await mkdir(path.join(bundle, "dist"), { recursive: true });
  await writeFile(path.join(bundle, "sinapsis.tools.json"), JSON.stringify(DEMO_MANIFEST, null, 2), "utf8");
  await writeFile(path.join(bundle, "demo.js"), DEMO_SCRIPT, "utf8");
  await writeFile(path.join(bundle, "demo.css"), ".demo { padding: 8px; }\n", "utf8");
  await writeFile(path.join(bundle, "data", "demo.json"), '{ "n": 1 }\n', "utf8");
  await writeFile(path.join(bundle, "scripts", "construir.mjs"), "export const x = 1;\n", "utf8");
  await writeFile(path.join(bundle, "dist", "tool-push.json"), "{}\n", "utf8");
  return dir;
}

/**
 * Repositorio de plataforma de mentira, en `main` y SIN remoto: ya trae una
 * versión vieja de la materia («vieja.md», que la publicación tiene que borrar).
 */
async function makePlatform(base: string): Promise<string> {
  const dir = path.join(base, "plataforma");
  const published = path.join(dir, "subjects", "demo");
  await mkdir(path.join(published, "wiki", "conceptos"), { recursive: true });
  await mkdir(path.join(published, "estudio"), { recursive: true });
  await writeFile(
    path.join(published, "sinapsis.config.json"),
    JSON.stringify({ ...DEMO_CONFIG, wiki: { ...DEMO_CONFIG.wiki, root: "wiki", study: "estudio" } }, null, 2),
    "utf8",
  );
  await writeFile(path.join(published, "wiki", "conceptos", "uno.md"), page("Uno", "1", "Va a [[Dos]]."), "utf8");
  await writeFile(path.join(published, "wiki", "conceptos", "vieja.md"), page("Vieja", "1"), "utf8");

  const git = (...args: string[]) => run("git", args, { cwd: dir });
  await git("init", "-q", "-b", "main", ".");
  await git("config", "user.email", "prueba@sinapsis.local");
  await git("config", "user.name", "Prueba");
  await git("add", "-A");
  await git("commit", "-qm", "inicial");
  return dir;
}

describe("sinapsis publish --no-pr", () => {
  let base = "";

  beforeEach(async () => {
    base = await mkdtemp(path.join(tmpdir(), "sinapsis-plataforma-"));
  });

  afterEach(async () => {
    await rm(base, { recursive: true, force: true });
  });

  it("deja la materia en una rama nueva sin tocar el árbol ni la rama del usuario", async () => {
    const vault = await makeVault(base);
    const repo = await makePlatform(base);
    const git = (...args: string[]) => run("git", ["-C", repo, ...args]);

    // El usuario está trabajando: en otra rama y con un archivo sin commitear.
    await git("checkout", "-q", "-b", "wip");
    await writeFile(path.join(repo, "borrador.txt"), "no lo toques\n", "utf8");
    const antes = (await git("status", "--porcelain")).stdout;

    const ctx = testCtx(vault);
    const code = await main(["publish", "--repo", repo, "--no-pr", "--branch", "subject/demo-20260906"], ctx);
    expect(ctx.stderr.join("\n")).toBe("");
    expect(code).toBe(0);

    // 1. La rama existe, el usuario sigue en la suya y su borrador está intacto.
    expect((await git("branch", "--list", "subject/demo-20260906")).stdout).toContain("subject/demo-20260906");
    expect((await git("rev-parse", "--abbrev-ref", "HEAD")).stdout.trim()).toBe("wip");
    expect((await git("status", "--porcelain")).stdout).toBe(antes);
    // 2. El worktree temporal se desmontó.
    expect((await git("worktree", "list")).stdout.trim().split("\n")).toHaveLength(1);

    // 3. Lo copiado: reemplazo COMPLETO de subjects/demo (`vieja.md` ya no está).
    const files = (await git("ls-tree", "-r", "--name-only", "subject/demo-20260906", "--", "subjects/demo")).stdout
      .trim()
      .split("\n")
      .sort();
    expect(files).toEqual([
      "subjects/demo/estudio/flashcards-uno.md",
      "subjects/demo/sinapsis.config.json",
      "subjects/demo/tools/demo/data/demo.json",
      "subjects/demo/tools/demo/demo.css",
      "subjects/demo/tools/demo/demo.js",
      "subjects/demo/tools/demo/sinapsis.tools.json",
      "subjects/demo/wiki/conceptos/dos.md",
      "subjects/demo/wiki/conceptos/uno.md",
    ]);

    // 4. El config publicado apunta a `wiki/` y `estudio/`.
    const config = SubjectConfig.parse(
      JSON.parse((await git("show", "subject/demo-20260906:subjects/demo/sinapsis.config.json")).stdout) as unknown,
    );
    expect(config.wiki.root).toBe("wiki");
    expect(config.wiki.study).toBe("estudio");
    expect(config.slug).toBe("demo");

    // 5. El mensaje del commit: título, conteos y NINGÚN trailer de coautoría.
    const message = (await git("log", "-1", "--format=%B", "subject/demo-20260906")).stdout;
    expect(message).toContain("Materia demo: Demo — 2 páginas, 1 bundle");
    expect(message).toContain("Páginas: 2");
    expect(message).toContain("Bundles: 1");
    expect(message).not.toMatch(/Co-Authored-By/i);
    expect(message).not.toMatch(/Claude/i);

    // 6. El informe dice dónde quedó, sin hablar de PR ni de red.
    expect(ctx.stdout.join("\n")).toContain("--no-pr: la rama queda local");
    expect(ctx.stdout.join("\n")).toContain("https://sebascaules.github.io/Sinapsis/m/demo");
  });

  it("una segunda publicación sin cambios no crea ninguna rama", async () => {
    const vault = await makeVault(base);
    const repo = await makePlatform(base);
    const git = (...args: string[]) => run("git", ["-C", repo, ...args]);

    // Se integra la primera publicación en `main` para que el estado quede al día.
    expect(await main(["publish", "--repo", repo, "--no-pr", "--branch", "subject/demo-1"], testCtx(vault))).toBe(0);
    await git("merge", "--ff-only", "subject/demo-1");

    const ctx = testCtx(vault);
    expect(await main(["publish", "--repo", repo, "--no-pr", "--branch", "subject/demo-2"], ctx)).toBe(0);
    expect(ctx.stdout.join("\n")).toContain("no hay nada que proponer");
    expect((await git("branch", "--list", "subject/demo-2")).stdout.trim()).toBe("");
  });
});

describe("sinapsis status", () => {
  let base = "";

  beforeEach(async () => {
    base = await mkdtemp(path.join(tmpdir(), "sinapsis-status-"));
  });

  afterEach(async () => {
    await rm(base, { recursive: true, force: true });
  });

  it("compara el vault con lo publicado y nombra lo nuevo, lo cambiado y lo borrado", async () => {
    const vault = await makeVault(base);
    const repo = await makePlatform(base);

    const ctx = testCtx(vault);
    expect(await main(["status", "--repo", repo], ctx)).toBe(0);
    expect(ctx.stderr.join("\n")).toBe("");

    const stdout = ctx.stdout.join("\n");
    expect(stdout).toContain("contra lo publicado");
    expect(stdout).toMatch(/nuevas\s+1\s+dos/);
    expect(stdout).toMatch(/borradas\s+1\s+vieja/);
    expect(stdout).toMatch(/iguales\s+1/);
    expect(stdout).toContain("el material de estudio local difiere del publicado");
    expect(stdout).toContain("Publique los cambios con `sinapsis publish`");
    expect(stdout).toContain("https://sebascaules.github.io/Sinapsis/m/demo");
  });

  it("dice que la materia todavía no está publicada", async () => {
    const vault = await makeVault(base);
    const repo = await makePlatform(base);
    await rm(path.join(repo, "subjects", "demo"), { recursive: true, force: true });

    const ctx = testCtx(vault);
    expect(await main(["status", "--repo", repo], ctx)).toBe(0);
    expect(ctx.stdout.join("\n")).toContain("la materia todavía no está en");
    expect(ctx.stdout.join("\n")).toContain("Publíquela con `sinapsis publish`");
  });

  it("no reporta diferencias cuando el vault y lo publicado coinciden", async () => {
    const vault = await makeVault(base);
    const repo = await makePlatform(base);
    // Se publica y se integra: a partir de ahí el vault y la plataforma son lo mismo.
    expect(await main(["publish", "--repo", repo, "--no-pr", "--branch", "subject/demo-1"], testCtx(vault))).toBe(0);
    await run("git", ["-C", repo, "merge", "--ff-only", "subject/demo-1"]);

    const ctx = testCtx(vault);
    expect(await main(["status", "--repo", repo], ctx)).toBe(0);
    expect(ctx.stdout.join("\n")).toContain("al día: no hay nada que publicar");
  });
});

// ---------------------------------------------------------------------------
// Sprint 4 — site build
// ---------------------------------------------------------------------------

describe("sinapsis site build", () => {
  let base = "";
  let subjects = "";
  let out = "";

  /** Una materia fuente completa dentro de `subjects/<slug>/`. */
  async function makeSource(slug: string, opts: { tools?: boolean } = {}): Promise<string> {
    const dir = path.join(subjects, slug);
    await mkdir(path.join(dir, "wiki", "conceptos"), { recursive: true });
    await mkdir(path.join(dir, "estudio"), { recursive: true });
    await writeFile(
      path.join(dir, "sinapsis.config.json"),
      JSON.stringify({ ...DEMO_CONFIG, slug, wiki: { ...DEMO_CONFIG.wiki, root: "wiki", study: "estudio" } }, null, 2),
      "utf8",
    );
    await writeFile(path.join(dir, "wiki", "conceptos", "uno.md"), page("Uno", "1", "Va a [[Dos]] y a [[Tres]]."), "utf8");
    await writeFile(path.join(dir, "wiki", "conceptos", "dos.md"), page("Dos", "1", "Vuelve a [[Uno]]."), "utf8");
    await writeFile(path.join(dir, "wiki", "conceptos", "tres.md"), page("Tres", "1"), "utf8");
    await writeFile(
      path.join(dir, "estudio", "flashcards-uno.md"),
      "---\ntipo: flashcards\ntitulo: Uno\nid: uno\n---\n\n## Anverso\n\nReverso.\n",
      "utf8",
    );
    if (opts.tools !== false) {
      const bundle = path.join(dir, "tools", "demo");
      await mkdir(path.join(bundle, "data"), { recursive: true });
      await writeFile(path.join(bundle, "sinapsis.tools.json"), JSON.stringify(DEMO_MANIFEST, null, 2), "utf8");
      await writeFile(path.join(bundle, "demo.js"), DEMO_SCRIPT, "utf8");
      await writeFile(path.join(bundle, "demo.css"), ".demo { padding: 8px; }\n", "utf8");
      await writeFile(path.join(bundle, "data", "demo.json"), '{ "n": 1 }\n', "utf8");
    }
    return dir;
  }

  beforeEach(async () => {
    base = await mkdtemp(path.join(tmpdir(), "sinapsis-site-"));
    subjects = path.join(base, "subjects");
    out = path.join(base, "salida");
    await mkdir(subjects, { recursive: true });
  });

  afterEach(async () => {
    await rm(base, { recursive: true, force: true });
  });

  const json = async (...parts: string[]): Promise<unknown> =>
    JSON.parse(await readFile(path.join(out, ...parts), "utf8")) as unknown;

  it("escribe los cuatro archivos del contrato y los archivos del bundle", async () => {
    await makeSource("demo");
    const ctx = testCtx(base);
    expect(await main(["site", "build", "--subjects", subjects, "--out", out], ctx)).toBe(0);
    expect(ctx.stderr.join("\n")).toBe("");

    // 1. Catálogo.
    const catalog = SiteCatalog.parse(await json("index.json"));
    expect(catalog.subjects).toHaveLength(1);
    const entry = catalog.subjects[0]!;
    expect(entry.slug).toBe("demo");
    // Las tres páginas cuentan como contenido; no hay índice ni registro.
    expect(entry.pagesCount).toBe(3);
    expect(entry.totalPages).toBe(3);
    expect(entry.toolsCount).toBe(1);
    expect(entry.divisionsCount).toBe(1);
    expect(new Date(entry.builtAt).toString()).not.toBe("Invalid Date");

    // 2. La materia: config, páginas sin cuerpo, enlaces resueltos y estudio.
    const subject = SiteSubject.parse(await json("demo", "subject.json"));
    expect(subject.pages.map((p) => p.slug).sort()).toEqual(["dos", "tres", "uno"]);
    expect(subject.pages[0]).not.toHaveProperty("body");
    // `uno → dos`, `uno → tres` y `dos → uno`: sin auto-enlaces, sin repetidos y
    // solo hacia páginas que existen.
    expect(subject.links.sort((a, b) => `${a.from}${a.to}`.localeCompare(`${b.from}${b.to}`))).toEqual([
      { from: "dos", to: "uno" },
      { from: "uno", to: "dos" },
      { from: "uno", to: "tres" },
    ]);
    expect(subject.study.decks.map((d) => d.id)).toEqual(["uno"]);
    expect(subject.warnings).toEqual([]);

    // 3. Los cuerpos.
    const pages = SitePages.parse(await json("demo", "pages.json"));
    expect(Object.keys(pages.pages).sort()).toEqual(["dos", "tres", "uno"]);
    expect(pages.pages["uno"]!.body).toContain("[[Dos]]");
    expect(pages.pages["uno"]!.links.map((l) => l.slug).sort()).toEqual(["dos", "tres"]);

    // 4. Los bundles: índice con la base relativa y los archivos escritos.
    const tools = SiteTools.parse(await json("demo", "tools.json"));
    expect(tools.tools).toHaveLength(1);
    expect(tools.tools[0]!.base).toBe("subjects/demo/tools/demo");
    expect(tools.tools[0]!.bytes).toBeGreaterThan(0);
    expect(tools.tools[0]!.updatedAt).toBe(entry.builtAt);
    expect(await readFile(path.join(out, "demo/tools/demo/demo.js"), "utf8")).toContain("registerView");
    expect(existsSync(path.join(out, "demo/tools/demo/data/demo.json"))).toBe(true);
  });

  it("--only compila una sola materia y no borra el resto de la salida", async () => {
    await makeSource("demo");
    await makeSource("otra");
    const primero = testCtx(base);
    expect(await main(["site", "build", "--subjects", subjects, "--out", out], primero)).toBe(0);
    expect(SiteCatalog.parse(await json("index.json")).subjects.map((s) => s.slug)).toEqual(["demo", "otra"]);

    // Se cambia solo «demo» y se recompila solo «demo».
    await writeFile(path.join(subjects, "demo", "wiki", "conceptos", "cuatro.md"), page("Cuatro", "1"), "utf8");
    const ctx = testCtx(base);
    expect(await main(["site", "build", "--subjects", subjects, "--out", out, "--only", "demo"], ctx)).toBe(0);

    const catalog = SiteCatalog.parse(await json("index.json"));
    expect(catalog.subjects.map((s) => s.slug)).toEqual(["demo", "otra"]);
    expect(catalog.subjects.find((s) => s.slug === "demo")!.totalPages).toBe(4);
    expect(existsSync(path.join(out, "otra", "subject.json"))).toBe(true);

    // Una materia que no existe es un error, no un build vacío.
    const falta = testCtx(base);
    expect(await main(["site", "build", "--subjects", subjects, "--out", out, "--only", "no-existe"], falta)).toBe(1);
    expect(falta.stderr.join("\n")).toContain('No encuentro la materia "no-existe"');
  });

  it("sin --only limpia de la salida las materias que ya no están", async () => {
    await makeSource("demo");
    await makeSource("otra");
    expect(await main(["site", "build", "--subjects", subjects, "--out", out], testCtx(base))).toBe(0);
    expect(existsSync(path.join(out, "otra", "subject.json"))).toBe(true);

    await rm(path.join(subjects, "otra"), { recursive: true, force: true });
    const ctx = testCtx(base);
    expect(await main(["site", "build", "--subjects", subjects, "--out", out], ctx)).toBe(0);
    expect(existsSync(path.join(out, "otra"))).toBe(false);
    expect(SiteCatalog.parse(await json("index.json")).subjects.map((s) => s.slug)).toEqual(["demo"]);
    expect(ctx.stdout.join("\n")).toContain("se quitó de la salida");
  });

  it("un bundle que no compila hace fallar el build y no escribe nada", async () => {
    await makeSource("demo");
    await writeFile(path.join(subjects, "demo", "tools", "demo", "demo.js"), "(function () { var x = ; })();\n", "utf8");

    const ctx = testCtx(base);
    expect(await main(["site", "build", "--subjects", subjects, "--out", out], ctx)).toBe(1);
    expect(ctx.stderr.join("\n")).toContain("SyntaxError");
    expect(existsSync(path.join(out, "index.json"))).toBe(false);
  });

  it("--strict convierte las advertencias en un fallo", async () => {
    await makeSource("demo");
    // Un wikilink roto: el compilador lo advierte y el build sigue saliendo 0…
    await writeFile(path.join(subjects, "demo", "wiki", "conceptos", "tres.md"), page("Tres", "1", "Va a [[Inexistente]]."), "utf8");

    const normal = testCtx(base);
    expect(await main(["site", "build", "--subjects", subjects, "--out", out], normal)).toBe(0);
    expect(SiteSubject.parse(await json("demo", "subject.json")).warnings.join("\n")).toContain("inexistente");

    // …salvo con --strict.
    const strict = testCtx(base);
    expect(await main(["site", "build", "--subjects", subjects, "--out", out, "--strict"], strict)).toBe(1);
    expect(strict.stderr.join("\n")).toContain("--strict");
  });

  it("suma las advertencias de coherencia que levantaba el API", async () => {
    const dir = await makeSource("demo", { tools: false });
    // Una página con una división que el config no declara.
    await writeFile(path.join(dir, "wiki", "conceptos", "tres.md"), page("Tres", "9"), "utf8");

    const ctx = testCtx(base);
    expect(await main(["site", "build", "--subjects", subjects, "--out", out], ctx)).toBe(0);
    const warnings = SiteSubject.parse(await json("demo", "subject.json")).warnings.join("\n");
    expect(warnings).toContain('la división "9" no está declarada en el config');
  });

  it("sale 1 si la carpeta de materias no existe", async () => {
    const ctx = testCtx(base);
    expect(await main(["site", "build", "--subjects", path.join(base, "no-existe"), "--out", out], ctx)).toBe(1);
    expect(ctx.stderr.join("\n")).toContain("No encuentro la carpeta de materias");
  });
});

describe("binario compilado", () => {
  const bin = path.join(PKG_ROOT, "bin/sinapsis.mjs");
  const dist = path.join(PKG_ROOT, "dist/index.js");

  it.skipIf(!existsSync(dist))("sale 1 con un config roto", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "sinapsis-bin-"));
    await writeFile(path.join(dir, "sinapsis.config.json"), "{}");
    let status = 0;
    let stderr = "";
    try {
      await run(process.execPath, [bin, "validate"], { cwd: dir, env: { ...process.env, INIT_CWD: dir } });
    } catch (cause) {
      const error = cause as { code?: number; stderr?: string };
      status = error.code ?? 0;
      stderr = error.stderr ?? "";
    }
    expect(status).toBe(1);
    expect(stderr).toContain("no cumple el contrato");
    await rm(dir, { recursive: true, force: true });
  });

  it.skipIf(!existsSync(dist))("responde --version", async () => {
    const { stdout } = await run(process.execPath, [bin, "--version"]);
    expect(stdout.trim()).toMatch(/^\d+\.\d+\.\d+$/);
  });
});

// ---------------------------------------------------------------------------
// Sprint 3 — bundles de herramientas
// ---------------------------------------------------------------------------

/** Config mínimo de una materia de prueba, con un ítem de rail `kind: "tool"`. */
const DEMO_CONFIG = {
  slug: "demo",
  name: "Demo",
  code: "0",
  institution: "ITBA",
  division: { singular: "Unidad", abbr: "U", plural: "Unidades" },
  divisions: [{ key: "1", name: "Una" }],
  pageTypes: [{ key: "concepto", label: "Concepto", plural: "Conceptos", folder: "conceptos" }],
  rail: [
    {
      id: "resolver",
      label: "Resolver",
      items: [{ id: "demo", label: "Demo", icon: "flask", kind: "tool", target: "demo" }],
    },
  ],
  wiki: { root: "wiki", divisionField: "unidad", study: "estudio" },
};

const DEMO_MANIFEST = {
  id: "demo",
  title: "Demostración",
  version: "0.1.0",
  scripts: ["demo.js"],
  styles: ["demo.css"],
  views: [{ id: "demo", label: "Vista de ejemplo", icon: "flask" }],
  figures: true,
  data: ["data/demo.json"],
};

const DEMO_SCRIPT = [
  "(function () {",
  '  "use strict";',
  "  var App = window.App;",
  '  App.registerView("demo", function (main) {',
  '    main.innerHTML = "<h1>Demo</h1>";',
  "    App.mountFigures(main);",
  "  });",
  '  App.registerFigure("demo-fig", function (host, ctx) {',
  '    host.innerHTML = "<svg viewBox=\\"0 0 10 10\\"></svg>" + ctx.cssVar("--primary");',
  '  }, { caption: "Una figura" });',
  "})();",
  "",
].join("\n");

/** Materia de prueba con un bundle en `tools/demo/`. */
async function makeSubject(base: string, manifest: Record<string, unknown> = DEMO_MANIFEST): Promise<string> {
  const dir = path.join(base, "materia");
  const bundle = path.join(dir, "tools", "demo");
  await mkdir(path.join(bundle, "data"), { recursive: true });
  await writeFile(path.join(dir, "sinapsis.config.json"), JSON.stringify(DEMO_CONFIG), "utf8");
  await writeFile(path.join(bundle, "sinapsis.tools.json"), JSON.stringify(manifest, null, 2), "utf8");
  await writeFile(path.join(bundle, "demo.js"), DEMO_SCRIPT, "utf8");
  await writeFile(path.join(bundle, "demo.css"), ".demo { padding: 8px; }\n", "utf8");
  await writeFile(path.join(bundle, "data", "demo.json"), '{ "n": 1 }\n', "utf8");
  return dir;
}

describe("sinapsis tools build", () => {
  let base = "";

  beforeEach(async () => {
    base = await mkdtemp(path.join(tmpdir(), "sinapsis-tools-"));
  });

  afterEach(async () => {
    await rm(base, { recursive: true, force: true });
  });

  it("valida, empaqueta y escribe dist/tool-push.json", async () => {
    const dir = await makeSubject(base);
    // Un binario y una fuente sueltos: viajan aunque el manifiesto no los declare.
    await writeFile(path.join(dir, "tools", "demo", "logo.png"), Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x00, 0x01]));
    // Código sin declarar y un archivo con extensión ajena: no viajan.
    await writeFile(path.join(dir, "tools", "demo", "build.mjs"), "export const x = 1;\n", "utf8");
    await writeFile(path.join(dir, "tools", "demo", "notas.yaml"), "a: 1\n", "utf8");

    const ctx = testCtx(dir);
    expect(await main(["tools", "build"], ctx)).toBe(0);
    expect(ctx.stderr.join("\n")).toBe("");

    const stdout = ctx.stdout.join("\n");
    expect(stdout).toContain("Demostración");
    expect(stdout).toContain("Vista de ejemplo (demo)");
    expect(stdout).toContain("figuras: sí");
    expect(stdout).toContain("build.mjs");
    expect(stdout).toContain("notas.yaml");
    expect(stdout).toContain("1 bundle listo");

    const pushFile = path.join(dir, "tools", "demo", "dist", "tool-push.json");
    const push = ToolPush.parse(JSON.parse(await readFile(pushFile, "utf8")) as unknown);
    expect(push.manifest.id).toBe("demo");
    expect(push.files.map((f) => f.path).sort()).toEqual(["data/demo.json", "demo.css", "demo.js", "logo.png"]);
    expect(push.files.find((f) => f.path === "logo.png")!.encoding).toBe("base64");
    expect(push.files.find((f) => f.path === "demo.js")!.content).toContain("registerFigure");
  });

  it("sale 1 si un archivo declarado no existe", async () => {
    const dir = await makeSubject(base, { ...DEMO_MANIFEST, scripts: ["demo.js", "falta.js"] });
    const ctx = testCtx(dir);
    expect(await main(["tools", "build"], ctx)).toBe(1);
    expect(ctx.stderr.join("\n")).toContain("falta.js");
    expect(ctx.stderr.join("\n")).toContain("no existe");
  });

  it("sale 1 con una ruta que se escapa de la carpeta del bundle", async () => {
    const dir = await makeSubject(base, { ...DEMO_MANIFEST, scripts: ["../../secreto.js"] });
    const ctx = testCtx(dir);
    expect(await main(["tools", "build"], ctx)).toBe(1);
    expect(ctx.stderr.join("\n")).toContain("«..»");
  });

  it("sale 1 con una extensión que el contrato no admite", async () => {
    const dir = await makeSubject(base, { ...DEMO_MANIFEST, scripts: ["demo.js"], data: ["data/demo.yaml"] });
    const ctx = testCtx(dir);
    expect(await main(["tools", "build"], ctx)).toBe(1);
    expect(ctx.stderr.join("\n")).toContain("extensión no admitida");
  });

  it("sale 1 si un script no parsea, y nombra el archivo y la línea", async () => {
    const dir = await makeSubject(base);
    await writeFile(path.join(dir, "tools", "demo", "demo.js"), "(function () {\n  var x = ;\n})();\n", "utf8");
    const ctx = testCtx(dir);
    expect(await main(["tools", "build"], ctx)).toBe(1);
    const err = ctx.stderr.join("\n");
    expect(err).toContain("demo.js");
    expect(err).toContain("SyntaxError");
    expect(err).toContain("demo.js:2");
  });

  it("un `package.json` con type module en la materia no invalida los IIFE clásicos", async () => {
    const dir = await makeSubject(base);
    await writeFile(path.join(dir, "package.json"), '{ "name": "materia", "type": "module" }\n', "utf8");
    const ctx = testCtx(dir);
    expect(await main(["tools", "build"], ctx)).toBe(0);
  });

  it("un archivo de texto que NO es UTF-8 viaja en base64 y conserva su tamaño (AC-07)", async () => {
    const dir = await makeSubject(base);
    // `ff fe 41`: latin-1, sin bytes nulos y con extensión de texto. Subirlo como
    // utf8 lo llenaba de U+FFFD y le cambiaba el tamaño.
    const raw = Buffer.from([0xff, 0xfe, 0x41]);
    await writeFile(path.join(dir, "tools", "demo", "tabla.csv"), raw);

    const ctx = testCtx(dir);
    expect(await main(["tools", "build"], ctx)).toBe(0);

    const push = ToolPush.parse(
      JSON.parse(await readFile(path.join(dir, "tools", "demo", "dist", "tool-push.json"), "utf8")) as unknown,
    );
    const csv = push.files.find((f) => f.path === "tabla.csv")!;
    expect(csv.encoding).toBe("base64");
    expect(Buffer.from(csv.content, "base64").equals(raw)).toBe(true);

    // Un texto que SÍ es UTF-8 sigue viajando como texto.
    expect(push.files.find((f) => f.path === "demo.css")!.encoding).toBe("utf8");
  });

  it("un `.mjs` con `import` no pasa el gate: el runtime lo carga como script clásico (AC-13)", async () => {
    const dir = await makeSubject(base, { ...DEMO_MANIFEST, scripts: ["demo.js", "modulo.mjs"] });
    await writeFile(
      path.join(dir, "tools", "demo", "modulo.mjs"),
      'import { algo } from "./demo.js";\nexport const x = algo;\n',
      "utf8",
    );

    const ctx = testCtx(dir);
    expect(await main(["tools", "build"], ctx)).toBe(1);
    const err = ctx.stderr.join("\n");
    expect(err).toContain("modulo.mjs");
    expect(err).toContain("SyntaxError");
    expect(err).toContain("`<script>` clásico");
  });

  it("lo que queda podado por hondo se informa, no desaparece (AC-14)", async () => {
    const dir = await makeSubject(base);
    const hondo = path.join(dir, "tools", "demo", ..."abcdefghi".split(""));
    await mkdir(hondo, { recursive: true });
    await writeFile(path.join(hondo, "lejos.txt"), "no viaja\n", "utf8");

    const ctx = testCtx(dir);
    expect(await main(["tools", "build"], ctx)).toBe(0);
    const stdout = ctx.stdout.join("\n");
    expect(stdout).toContain("más de 8 niveles");
    expect(stdout).toContain("a/b/c/d/e/f/g/h/i/");

    const push = ToolPush.parse(
      JSON.parse(await readFile(path.join(dir, "tools", "demo", "dist", "tool-push.json"), "utf8")) as unknown,
    );
    expect(push.files.some((f) => f.path.includes("lejos.txt"))).toBe(false);
  });

  it("rechaza un bundle que supera el tope de 20 MB", async () => {
    const dir = await makeSubject(base, { ...DEMO_MANIFEST, data: ["data/demo.json", "data/grande.json"] });
    await writeFile(path.join(dir, "tools", "demo", "data", "grande.json"), "a".repeat(21 * 1024 * 1024), "utf8");
    const ctx = testCtx(dir);
    expect(await main(["tools", "build"], ctx)).toBe(1);
    expect(ctx.stderr.join("\n")).toContain("tope del contrato es 20.0 MB");
  });

  it("--minify deja los scripts en .dist/ y sube esa versión", async () => {
    const dir = await makeSubject(base);
    const ctx = testCtx(dir);
    expect(await main(["tools", "build", "--minify"], ctx)).toBe(0);
    expect(ctx.stdout.join("\n")).toContain("minificado:");

    const minified = await readFile(path.join(dir, "tools", "demo", ".dist", "demo.js"), "utf8");
    expect(minified.split("\n").length).toBeLessThan(DEMO_SCRIPT.split("\n").length);
    const push = ToolPush.parse(
      JSON.parse(await readFile(path.join(dir, "tools", "demo", "dist", "tool-push.json"), "utf8")) as unknown,
    );
    expect(push.files.find((f) => f.path === "demo.js")!.content).toBe(minified);
  });

  it("avisa en `validate` cuando ningún bundle registra la vista del rail", async () => {
    const dir = await makeSubject(base, { ...DEMO_MANIFEST, views: [{ id: "otra", label: "Otra" }] });
    const ctx = testCtx(dir);
    expect(await main(["validate"], ctx)).toBe(0);
    expect(ctx.stdout.join("\n")).toContain('ningún bundle de tools/ registra la vista "demo"');

    // Con la vista declarada, el aviso desaparece.
    const ok = testCtx(await makeSubject(await mkdtemp(path.join(tmpdir(), "sinapsis-tools-ok-"))));
    expect(await main(["validate"], ok)).toBe(0);
    expect(ok.stdout.join("\n")).not.toContain("ningún bundle");
  });
});

// ---------------------------------------------------------------------------
// Sprint 3 — propuestas de cambio a la plataforma (N0-44)
// ---------------------------------------------------------------------------

describe("sinapsis propose", () => {
  let repo = "";

  /** Repositorio de plataforma de mentira: INBOX, gates que pasan y un commit inicial. */
  async function makeRepo(): Promise<string> {
    const dir = await mkdtemp(path.join(tmpdir(), "sinapsis-repo-"));
    await mkdir(path.join(dir, "proposals"), { recursive: true });
    await mkdir(path.join(dir, "packages", "contract", "src"), { recursive: true });
    await writeFile(
      path.join(dir, "proposals", "INBOX.md"),
      "# Propuestas pendientes de revisión\n\n| fecha | materia | título | rama | estado |\n|---|---|---|---|---|\n",
      "utf8",
    );
    await writeFile(path.join(dir, "package.json"), '{ "name": "falso", "scripts": { "typecheck": "true" } }\n', "utf8");
    await writeFile(path.join(dir, "packages", "contract", "src", "index.ts"), "export const x = 1;\n", "utf8");

    const git = (...args: string[]) => run("git", args, { cwd: dir });
    await git("init", "-q", "-b", "main", ".");
    await git("config", "user.email", "prueba@sinapsis.local");
    await git("config", "user.name", "Prueba");
    await git("add", "-A");
    await git("commit", "-qm", "inicial");
    return dir;
  }

  beforeEach(async () => {
    repo = await makeRepo();
  });

  afterEach(async () => {
    await rm(repo, { recursive: true, force: true });
  });

  it("crea la rama, escribe la propuesta, anota el INBOX en main y vuelve a main", async () => {
    await writeFile(path.join(repo, "packages", "contract", "src", "index.ts"), "export const x = 2;\n", "utf8");

    const ctx = testCtx(repo);
    const code = await main(
      [
        "propose",
        "--repo",
        repo,
        "--subject",
        "proba",
        "--title",
        "Badge en el rail",
        "--body",
        "La materia necesita marcar cuántas tarjetas vencen y eso lo dibuja la plataforma.",
        "--skip-gates",
      ],
      ctx,
    );
    expect(ctx.stderr.join("\n")).toBe("");
    expect(code).toBe(0);

    const today = new Date();
    const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const branch = `proposal/proba-${iso.replaceAll("-", "")}-badge-en-el-rail`;

    // Termina en main, con la rama creada y la fila del INBOX commiteada ahí.
    const { stdout: head } = await run("git", ["rev-parse", "--abbrev-ref", "HEAD"], { cwd: repo });
    expect(head.trim()).toBe("main");
    const { stdout: branches } = await run("git", ["branch", "--list", "proposal/*"], { cwd: repo });
    expect(branches).toContain(branch);

    const inbox = await readFile(path.join(repo, "proposals", "INBOX.md"), "utf8");
    expect(inbox).toContain(`| ${iso} | proba | Badge en el rail | ${branch} | abierta |`);
    const { stdout: log } = await run("git", ["log", "--oneline", "-1"], { cwd: repo });
    expect(log).toContain("proposals: proba — Badge en el rail");

    // La propuesta vive en la rama, no en main.
    const file = `proposals/${iso}-proba-badge-en-el-rail.md`;
    expect(existsSync(path.join(repo, file))).toBe(false);
    const { stdout: proposal } = await run("git", ["show", `${branch}:${file}`], { cwd: repo });
    expect(proposal).toContain(`rama: ${branch}`);
    expect(proposal).toContain("estado: abierta");
    expect(proposal).toContain("## Motivo");
    expect(proposal).toContain("La materia necesita marcar cuántas tarjetas vencen");
    expect(proposal).toContain("- `packages/contract/src/index.ts` — modificado");
    expect(proposal).toContain("Contrato afectado: `packages/contract`");
    expect(proposal).toContain("Omitidos con `--skip-gates`");
    expect(proposal).toContain("## Revisión");

    // El cambio viaja en el mismo commit de la rama.
    const { stdout: changed } = await run("git", ["show", "--name-only", "--format=", branch], { cwd: repo });
    expect(changed).toContain("packages/contract/src/index.ts");
    expect(changed).toContain(file);

    expect(ctx.stdout.join("\n")).toContain("/sinapsis-review");
  });

  it("falla si el árbol tiene cambios que --files no declara, y no toca git", async () => {
    await writeFile(path.join(repo, "packages", "contract", "src", "index.ts"), "export const x = 2;\n", "utf8");
    // Una carpeta nueva: se informa archivo por archivo, no como «suelta/».
    await mkdir(path.join(repo, "suelta"), { recursive: true });
    await writeFile(path.join(repo, "suelta", "suelto.txt"), "algo\n", "utf8");

    const ctx = testCtx(repo);
    const code = await main(
      [
        "propose",
        "--repo",
        repo,
        "--subject",
        "proba",
        "--title",
        "Otra cosa",
        "--body",
        "Motivo.",
        "--files",
        "packages/contract/src/index.ts",
        "--skip-gates",
      ],
      ctx,
    );
    expect(code).toBe(1);
    expect(ctx.stderr.join("\n")).toContain("suelta/suelto.txt");
    const { stdout: branches } = await run("git", ["branch", "--list", "proposal/*"], { cwd: repo });
    expect(branches.trim()).toBe("");
  });

  it("falla si no hay nada que proponer o si el repo no está en main", async () => {
    const limpio = testCtx(repo);
    expect(
      await main(["propose", "--repo", repo, "--subject", "proba", "--title", "T", "--body", "B", "--skip-gates"], limpio),
    ).toBe(1);
    expect(limpio.stderr.join("\n")).toContain("árbol de la plataforma está limpio");

    await run("git", ["checkout", "-q", "-b", "otra"], { cwd: repo });
    await writeFile(path.join(repo, "packages", "contract", "src", "index.ts"), "export const x = 3;\n", "utf8");
    const otra = testCtx(repo);
    expect(
      await main(["propose", "--repo", repo, "--subject", "proba", "--title", "T", "--body", "B", "--skip-gates"], otra),
    ).toBe(1);
    expect(otra.stderr.join("\n")).toContain('está en "otra"');
  });

  it("corre los gates y no crea nada si fallan", async () => {
    await writeFile(path.join(repo, "package.json"), '{ "name": "falso", "scripts": { "typecheck": "false" } }\n', "utf8");
    await run("git", ["commit", "-qam", "gates rotos"], { cwd: repo });
    await writeFile(path.join(repo, "packages", "contract", "src", "index.ts"), "export const x = 2;\n", "utf8");

    const ctx = testCtx(repo);
    const code = await main(
      ["propose", "--repo", repo, "--subject", "proba", "--title", "Con gates", "--body", "Motivo."],
      ctx,
    );
    expect(code).toBe(1);
    expect(ctx.stdout.join("\n")).toContain("pnpm typecheck");
    expect(ctx.stderr.join("\n")).toContain("Los gates no pasan");
    const { stdout: branches } = await run("git", ["branch", "--list", "proposal/*"], { cwd: repo });
    expect(branches.trim()).toBe("");
    // Tampoco quedó la fila del INBOX ni un commit suelto en main.
    const inbox = await readFile(path.join(repo, "proposals", "INBOX.md"), "utf8");
    expect(inbox).not.toContain("Con gates");
    const { stdout: log } = await run("git", ["log", "--oneline", "-1"], { cwd: repo });
    expect(log).toContain("gates rotos");
  }, 60_000);

  it("si el commit falla, la rama NO queda creada: el intento siguiente pasa (AC-15)", async () => {
    await writeFile(path.join(repo, "packages", "contract", "src", "index.ts"), "export const x = 2;\n", "utf8");

    /* Un `pre-commit` que rechaza: la forma más fiel de «el commit falló después
       del checkout -b». Sin borrar la rama, el intento siguiente moría en
       «Ya existe la rama». */
    const hooks = path.join(repo, ".git", "hooks");
    const hook = path.join(hooks, "pre-commit");
    await mkdir(hooks, { recursive: true });
    await writeFile(hook, "#!/bin/sh\nexit 1\n", "utf8");
    await chmod(hook, 0o755);
    await run("git", ["config", "core.hooksPath", hooks], { cwd: repo });

    const args = [
      "propose",
      "--repo",
      repo,
      "--subject",
      "proba",
      "--title",
      "Commit roto",
      "--body",
      "Motivo.",
      "--skip-gates",
    ];

    const falla = testCtx(repo);
    expect(await main(args, falla)).toBe(1);
    expect(falla.stderr.join("\n")).toContain("No se pudo commitear la propuesta");
    expect(falla.stderr.join("\n")).toContain("Se borró la rama");

    // Ni rama colgada ni HEAD fuera de main.
    const { stdout: branches } = await run("git", ["branch", "--list", "proposal/*"], { cwd: repo });
    expect(branches.trim()).toBe("");
    const { stdout: head } = await run("git", ["rev-parse", "--abbrev-ref", "HEAD"], { cwd: repo });
    expect(head.trim()).toBe("main");

    // Arreglado lo que fallaba, el MISMO comando llega hasta el final.
    await rm(hook, { force: true });
    const retry = testCtx(repo);
    expect(await main(args, retry)).toBe(0);
    expect(retry.stderr.join("\n")).not.toContain("Ya existe la rama");
    const { stdout: after } = await run("git", ["branch", "--list", "proposal/*"], { cwd: repo });
    expect(after).toContain("-commit-roto");
  });

  it("falla si --files nombra un archivo sin cambios", async () => {
    await writeFile(path.join(repo, "packages", "contract", "src", "index.ts"), "export const x = 2;\n", "utf8");

    const ctx = testCtx(repo);
    const code = await main(
      [
        "propose",
        "--repo",
        repo,
        "--subject",
        "proba",
        "--title",
        "Archivo fantasma",
        "--body",
        "Motivo.",
        "--files",
        "packages/contract/src/index.ts,packages/contract/src/no-existe.ts",
        "--skip-gates",
      ],
      ctx,
    );
    expect(code).toBe(1);
    expect(ctx.stderr.join("\n")).toContain("packages/contract/src/no-existe.ts");
    const { stdout: branches } = await run("git", ["branch", "--list", "proposal/*"], { cwd: repo });
    expect(branches.trim()).toBe("");
  });

  it("dos propuestas abiertas a la vez no se pisan: dos ramas y dos filas en el INBOX", async () => {
    const propose = async (subject: string, title: string, file: string) => {
      await writeFile(path.join(repo, file), `export const x = "${title}";\n`, "utf8");
      const ctx = testCtx(repo);
      const code = await main(
        ["propose", "--repo", repo, "--subject", subject, "--title", title, "--body", "Motivo.", "--skip-gates"],
        ctx,
      );
      expect(ctx.stderr.join("\n")).toBe("");
      expect(code).toBe(0);
    };

    await propose("proba", "Primera", "packages/contract/src/index.ts");
    await propose("algebra", "Segunda", "packages/contract/src/otro.ts");

    const { stdout: branches } = await run("git", ["branch", "--list", "proposal/*"], { cwd: repo });
    expect(branches).toContain("-primera");
    expect(branches).toContain("-segunda");

    const inbox = await readFile(path.join(repo, "proposals", "INBOX.md"), "utf8");
    expect(inbox).toContain("| proba | Primera |");
    expect(inbox).toContain("| algebra | Segunda |");
    // Cada fila viajó en su propio commit de main, y main quedó limpio.
    const { stdout: log } = await run("git", ["log", "--oneline", "-2"], { cwd: repo });
    expect(log).toContain("proposals: algebra — Segunda");
    expect(log).toContain("proposals: proba — Primera");
    const { stdout: status } = await run("git", ["status", "--porcelain"], { cwd: repo });
    expect(status.trim()).toBe("");
  });

  it("la fila entra en la tabla de abiertas, no al final de un INBOX con más secciones", async () => {
    const inboxPath = path.join(repo, "proposals", "INBOX.md");
    await writeFile(
      inboxPath,
      `${await readFile(inboxPath, "utf8")}\n## Cerradas\n\n| fecha | materia | título | veredicto |\n|---|---|---|---|\n| 2026-09-05 | proba | Vieja | aprobada |\n`,
      "utf8",
    );
    await run("git", ["commit", "-qam", "INBOX con cerradas"], { cwd: repo });
    await writeFile(path.join(repo, "packages", "contract", "src", "index.ts"), "export const x = 2;\n", "utf8");

    const ctx = testCtx(repo);
    expect(
      await main(
        ["propose", "--repo", repo, "--subject", "proba", "--title", "Nueva", "--body", "Motivo.", "--skip-gates"],
        ctx,
      ),
    ).toBe(0);

    const lines = (await readFile(inboxPath, "utf8")).split("\n");
    const nueva = lines.findIndex((l) => l.includes("| Nueva |"));
    const cerradas = lines.findIndex((l) => l.startsWith("## Cerradas"));
    expect(nueva).toBeGreaterThan(0);
    expect(nueva).toBeLessThan(cerradas);
    // Y la tabla de cerradas quedó intacta.
    expect(lines[lines.length - 2]).toContain("| 2026-09-05 | proba | Vieja | aprobada |");
  });

  it("recorta el título largo por el guion: la rama no termina en un muñón", async () => {
    expect(shorten("corto", 60)).toBe("corto");
    expect(shorten("documentar-que-una-fase-compartida-entre-modalidades-es-la-misma", 60)).toBe(
      "documentar-que-una-fase-compartida-entre-modalidades-es-la",
    );
    // Una sola palabra más larga que el límite se corta seco: no hay guion donde cortar.
    expect(shorten("a".repeat(70), 60)).toBe("a".repeat(60));

    await writeFile(path.join(repo, "packages", "contract", "src", "index.ts"), "export const x = 2;\n", "utf8");
    const ctx = testCtx(repo);
    expect(
      await main(
        [
          "propose",
          "--repo",
          repo,
          "--subject",
          "proba",
          "--title",
          "Documentar que una fase compartida entre modalidades es la misma fase",
          "--body",
          "Motivo.",
          "--skip-gates",
        ],
        ctx,
      ),
    ).toBe(0);
    const { stdout: branches } = await run("git", ["branch", "--list", "proposal/*"], { cwd: repo });
    expect(branches.trim()).toMatch(/-es-la$/);
  });
});

describe("gateCounts", () => {
  it("saca el conteo de vitest de cada paquete de una corrida recursiva", () => {
    const output = [
      "packages/contract test:  Test Files  3 passed (3)",
      "packages/contract test:       Tests  31 passed (31)",
      "packages/cli test:       Tests  35 passed | 2 skipped (37)",
    ].join("\n");
    expect(gateCounts(output)).toEqual([
      "- `packages/contract`: 31 passed (31)",
      "- `packages/cli`: 35 passed | 2 skipped (37)",
    ]);
  });

  it("también sirve para una corrida de un solo paquete, y no inventa nada", () => {
    expect(gateCounts("      Tests  7 passed (7)")).toEqual(["- 7 passed (7)"]);
    expect(gateCounts("tsc --noEmit: Done")).toEqual([]);
  });
});
