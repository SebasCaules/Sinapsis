/**
 * Sitio estático de la suite: `e2e/.site/`.
 *
 * Ya no hay API que sembrar. La web lee ARCHIVOS (`subjects/index.json`,
 * `subjects/<slug>/{subject,pages,tools}.json` y los bundles), así que «sembrar»
 * es compilar una materia a esa forma y servirla como `publicDir` de Vite
 * (`SINAPSIS_PUBLIC_DIR`, ver `apps/web/vite.config.ts`).
 *
 * Se compila ANTES de levantar Vite, no en `globalSetup`: Playwright arranca el
 * `webServer` primero (`createGlobalSetupTasks` corre los plugins antes que los
 * `globalSetup`), y Vite fotografía el contenido de `publicDir` al crear el
 * servidor. Por eso el comando del `webServer` empieza por `prepare-site.ts`,
 * que llama a `buildSite()` y deja el resultado en `.site/build.json`;
 * `global-setup.ts` lo lee para escribir el manifiesto de la siembra.
 *
 * Dos modos, como siempre:
 *
 *   | Modo    | Fuente                  | Cuándo                                   |
 *   |---------|-------------------------|------------------------------------------|
 *   | `proba` | `subjects/`             | existe `subjects/proba` (la materia real) |
 *   | `demo`  | `e2e/fixtures/subjects` | si no, o forzando con SINAPSIS_E2E_VAULT  |
 *
 * `SINAPSIS_E2E_VAULT` conserva su semántica: apuntarla a una ruta que no
 * existe fuerza el fixture, que es la única forma de ejercitarlo en una máquina
 * que sí tiene la materia real.
 *
 *     SINAPSIS_E2E_VAULT=/no/existe pnpm e2e
 */
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Carpeta de `e2e/` (este archivo vive en `e2e/support/`).
 *
 * `__dirname` y no `import.meta.url`: Playwright transpila los archivos de la
 * suite a CommonJS (el `package.json` más cercano no declara `"type": "module"`),
 * donde `import.meta` no existe.
 */
export const E2E_DIR = path.resolve(__dirname, "..");
export const REPO_ROOT = path.resolve(E2E_DIR, "..");

/** Sitio que sirve Vite durante la suite (gitignorado). */
export const SITE_DIR = path.join(E2E_DIR, ".site");
export const SITE_SUBJECTS_DIR = path.join(SITE_DIR, "subjects");
/** Resultado de la compilación, para que `global-setup` no la repita. */
export const BUILD_FILE = path.join(SITE_DIR, "build.json");

/** `public/` de la web: de ahí salen las fuentes, el manifiesto y el icono. */
export const WEB_PUBLIC_DIR = path.join(REPO_ROOT, "apps", "web", "public");

/** Materias fuente de cada modo. */
export const PROBA_SUBJECTS_DIR = path.join(REPO_ROOT, "subjects");
export const DEMO_SUBJECTS_DIR = path.join(E2E_DIR, "fixtures", "subjects");

/**
 * Materia real dentro del repositorio. `SINAPSIS_E2E_VAULT` la reemplaza:
 * apuntándola a una ruta inexistente se fuerza el fixture.
 */
export const PROBA_SOURCE =
  process.env["SINAPSIS_E2E_VAULT"] ?? path.join(PROBA_SUBJECTS_DIR, "proba");

/** true cuando la suite corre con la materia real. */
export function useProba(): boolean {
  return existsSync(PROBA_SOURCE);
}

/** Lo que `buildSite()` deja escrito para `global-setup.ts`. */
export interface SiteBuild {
  mode: "proba" | "demo";
  /** Carpeta de materias FUENTE que se compiló. */
  source: string;
  /** Slugs compilados, en el orden del catálogo. */
  subjects: string[];
  builtAt: string;
}

/**
 * Copia a `.site/` todo lo que la web sirve desde `public/` MENOS `subjects/`:
 * las fuentes (sin ellas el smoke visual saldría con la tipografía del sistema),
 * `manifest.webmanifest`, `icon.svg` y `.nojekyll`. Las materias las escribe el
 * compilador, no esta copia.
 */
async function copyPublicAssets(): Promise<void> {
  const entries = await readdir(WEB_PUBLIC_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === "subjects") continue;
    await cp(path.join(WEB_PUBLIC_DIR, entry.name), path.join(SITE_DIR, entry.name), {
      recursive: true,
    });
  }
}

/**
 * Compila las materias del modo elegido con el MISMO código que
 * `pnpm sinapsis -- site build` (`runSiteBuild` de `packages/cli`): un wiki que
 * no compila o un bundle roto cortan acá con el problema que reportaría el CLI.
 */
export async function buildSite(): Promise<SiteBuild> {
  const proba = useProba();
  const source = proba ? PROBA_SUBJECTS_DIR : DEMO_SUBJECTS_DIR;

  await rm(SITE_DIR, { recursive: true, force: true });
  await mkdir(SITE_DIR, { recursive: true });
  await copyPublicAssets();

  const { runSiteBuild } = (await import("../../packages/cli/src/commands/site.js")) as {
    runSiteBuild: (
      opts: { subjects?: string; out?: string; only?: string; strict?: boolean },
      ctx: {
        out: (line: string) => void;
        err: (line: string) => void;
        cwd: string;
        env: Record<string, string | undefined>;
      },
    ) => Promise<number>;
  };

  const lines: string[] = [];
  const code = await runSiteBuild(
    { subjects: source, out: SITE_SUBJECTS_DIR },
    {
      out: (line) => lines.push(line),
      err: (line) => lines.push(line),
      cwd: REPO_ROOT,
      env: process.env,
    },
  );
  if (code !== 0) {
    throw new Error(`Siembra E2E — «site build» falló:\n${lines.join("\n")}`);
  }

  const catalog = JSON.parse(await readFile(path.join(SITE_SUBJECTS_DIR, "index.json"), "utf8")) as {
    subjects: Array<{ slug: string }>;
  };
  const build: SiteBuild = {
    mode: proba ? "proba" : "demo",
    source,
    subjects: catalog.subjects.map((entry) => entry.slug),
    builtAt: new Date().toISOString(),
  };
  await writeFile(BUILD_FILE, `${JSON.stringify(build, null, 2)}\n`, "utf8");

  console.log(
    `[e2e] sitio: ${build.mode} · ${path.relative(REPO_ROOT, source)} → ` +
      `${path.relative(REPO_ROOT, SITE_SUBJECTS_DIR)} (${build.subjects.join(", ")})`,
  );
  return build;
}

/** El resultado de la compilación que hizo el `webServer`; la rehace si falta. */
export async function readOrBuildSite(): Promise<SiteBuild> {
  if (existsSync(BUILD_FILE)) {
    return JSON.parse(await readFile(BUILD_FILE, "utf8")) as SiteBuild;
  }
  return buildSite();
}
