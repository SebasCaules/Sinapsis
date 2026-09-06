import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { homedir, tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { SubjectConfig, SyncPayload } from "@sinapsis/contract";
import { cleanArgv, main } from "./cli.js";
import { extraChecks } from "./commands/validate.js";
import type { Ctx } from "./context.js";

const run = promisify(execFile);

const PKG_ROOT = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const REPO_ROOT = path.resolve(PKG_ROOT, "../..");
const PROBA_CONFIG = path.join(REPO_ROOT, "examples/proba/sinapsis.config.json");
const PROBA_WIKI = process.env["SINAPSIS_PROBA_VAULT"]
  ? path.join(process.env["SINAPSIS_PROBA_VAULT"], "wiki")
  : path.join(homedir(), "Desktop/ITBA/26-1C/Proba_Obsidian/wiki");

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

  it("acepta el config de ejemplo de Proba", async () => {
    const ctx = testCtx(REPO_ROOT);
    expect(await main(["validate", "--config", "examples/proba/sinapsis.config.json"], ctx)).toBe(0);
    expect(ctx.stdout.join("\n")).toContain("Config válido");
    // El rail de Proba usa herramientas: se avisa que son del Sprint 3.
    expect(ctx.stdout.join("\n")).toContain("Próximamente");
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
                { id: "i2", label: "I2", icon: "link", kind: "link", target: "campus.itba.edu.ar" },
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
    expect(messages.join("\n")).toContain("URL absoluta");
  });
});

describe("sinapsis sync --dry-run", () => {
  const available = existsSync(PROBA_WIKI) && existsSync(PROBA_CONFIG);

  it.skipIf(!available)("compila el wiki de Proba y escribe un payload válido", async () => {
    const out = path.join(await mkdtemp(path.join(tmpdir(), "sinapsis-sync-")), "payload.json");
    const ctx = testCtx(REPO_ROOT);
    const code = await main(
      [
        "sync",
        "--config",
        "examples/proba/sinapsis.config.json",
        "--wiki",
        PROBA_WIKI,
        "--dry-run",
        "--out",
        out,
      ],
      ctx,
    );

    expect(ctx.stderr.join("\n")).toBe("");
    expect(code).toBe(0);
    expect(ctx.stdout.join("\n")).toContain("--dry-run: no se llamó al API");

    const payload = SyncPayload.parse(JSON.parse(await readFile(out, "utf8")) as unknown);
    expect(payload.pages.length).toBeGreaterThanOrEqual(190);
    expect(payload.config.slug).toBe("proba");
    expect(payload.generator).toMatch(/^@sinapsis\/cli /);
    expect(new Date(payload.generatedAt).toString()).not.toBe("Invalid Date");

    await rm(path.dirname(out), { recursive: true, force: true });
  });

  it("no llama al API ni pide token en --dry-run", async () => {
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

    const ctx = testCtx(dir);
    expect(await main(["sync", "--dry-run"], ctx)).toBe(0);
    const stdout = ctx.stdout.join("\n");
    expect(stdout).toContain("páginas: 1");
    expect(stdout).toContain("sin advertencias");
    expect(stdout).toContain("divisiones sin páginas: 2");

    await rm(dir, { recursive: true, force: true });
  });

  it("sale 1 sin token cuando no es dry-run", async () => {
    const ctx = testCtx(REPO_ROOT, {});
    const code = await main(
      ["sync", "--config", "examples/proba/sinapsis.config.json", "--wiki", PROBA_WIKI],
      ctx,
    );
    expect(code).toBe(1);
    expect(ctx.stderr.join("\n")).toContain("Falta el token de sync");
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
