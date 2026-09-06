/**
 * `sinapsis publish` — la materia entra al repositorio de la plataforma.
 *
 * Desde el Sprint 4 no hay API: publicar una materia es abrir un PR contra
 * `SebasCaules/Sinapsis` con la carpeta `subjects/<slug>/` (config, wiki
 * markdown, `estudio/` y los bundles de `tools/`). El orquestador lo revisa y lo
 * integra; el sitio se reconstruye solo en cada push a `main`.
 *
 * Reglas de las que este comando no se sale:
 *
 *  1. **Nunca toca el árbol de trabajo del usuario ni cambia su rama.** Todo el
 *     trabajo con git ocurre en un WORKTREE TEMPORAL creado desde `origin/main`
 *     (o `main` si no hay remoto), que se desmonta al terminar. El repositorio
 *     de la plataforma puede estar en cualquier rama y con cambios sin
 *     commitear: no se entera.
 *  2. **Reemplazo completo de `subjects/<slug>/`.** La carpeta se borra y se
 *     vuelve a escribir, así una página, un mazo o un bundle que la materia
 *     borró desaparece de la plataforma en vez de quedar de fósil.
 *  3. **Sin coautoría en el commit.** El mensaje termina en su última línea de
 *     contenido; ninguna plantilla del entorno agrega nada.
 */
import { copyFile, mkdir, mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import pc from "picocolors";
import { plural, type SubjectConfig as SubjectConfigType } from "@sinapsis/contract";
import {
  ASSET_INDEX_FILE,
  ASSET_INDEX_FORMAT,
  compileWiki,
  formatAssetBytes,
  listWikiFiles,
  type WikiAsset,
} from "@sinapsis/markdown";
import { resolveUserPath, type Ctx } from "../context.js";
import { ghReady, git, githubRemote, hasRef, repoRoot, runCommand } from "../git.js";
import { countsByDivision, countsByType, heading, studyLine, warnings as printWarnings, webUrl } from "../report.js";
import { buildBundle, findBundles, formatBytes, MANIFEST_FILE, type BuiltBundle } from "../tools/bundle.js";
import { GENERATOR } from "../version.js";
import { resolveInside } from "./site.js";
import { DEFAULT_CONFIG, loadConfig } from "./validate.js";
import { resolveRepo } from "./propose.js";

export interface PublishOptions {
  config?: string;
  /** Sobreescribe `wiki.root` del config (el vault vive fuera del repo de la materia). */
  wiki?: string;
  /** Repositorio de la plataforma (o `SINAPSIS_HOME`). */
  repo?: string;
  /** Compila, valida e informa; no toca el repositorio de la plataforma. */
  dryRun?: boolean;
  /** Escribe el `SyncPayload` compilado en un archivo. */
  out?: string;
  /**
   * Bandera negable `--no-pr` de commander: es `true` por defecto y `false`
   * cuando el usuario pide `--no-pr` (la rama queda local, sin push ni PR).
   */
  pr?: boolean;
  /** Nombre de rama explícito (por defecto `subject/<slug>-<AAAAMMDD>`). */
  branch?: string;
  /** true cuando se invocó por el alias `sync` (solo cambia el aviso). */
  legacy?: boolean;
}

/** Carpeta de las materias dentro del repositorio de la plataforma. */
export const SUBJECTS_DIR = "subjects";
/** Rama de la que nace toda publicación. */
export const MAIN_BRANCH = "main";

export async function runPublish(opts: PublishOptions, ctx: Ctx): Promise<number> {
  if (opts.legacy) {
    ctx.err(pc.yellow("`sinapsis sync` ahora se llama `sinapsis publish` (el alias sigue funcionando)."));
  }

  const loaded = await loadConfig(ctx, opts.config ?? DEFAULT_CONFIG);
  if (!loaded) return 1;
  const config = loaded.config;
  const rootDir = path.dirname(loaded.path);
  const wikiFlag = opts.wiki ? resolveUserPath(ctx, opts.wiki) : undefined;

  // --- compilación ----------------------------------------------------------
  let compiled;
  try {
    compiled = await compileWiki({
      config,
      rootDir,
      ...(wikiFlag ? { wikiRoot: wikiFlag } : {}),
      generator: GENERATOR,
    });
  } catch (cause) {
    ctx.err(pc.red("No se pudo compilar el wiki:"));
    ctx.err(`  ${cause instanceof Error ? cause.message : String(cause)}`);
    return 1;
  }

  const { payload, warnings } = compiled;

  heading(ctx, config);
  ctx.out(`  wiki: ${pc.dim(compiled.wikiRoot)}`);
  ctx.out(`  páginas: ${pc.bold(String(payload.pages.length))}`);
  ctx.out("");
  countsByType(ctx, config, payload.pages);
  ctx.out("");
  countsByDivision(ctx, config, payload.pages);
  ctx.out("");
  studyLine(ctx, compiled.study);
  ctx.out(`  ${pc.dim(compiled.studyDir)}`);
  if (compiled.assets.length > 0) {
    const bytes = compiled.assets.reduce((sum, a) => sum + a.bytes, 0);
    ctx.out("");
    ctx.out(
      `  Adjuntos: ${pc.bold(String(compiled.assets.length))} ${plural(compiled.assets.length, "imagen", "imágenes")} · ${formatAssetBytes(bytes)}`,
    );
  }
  ctx.out("");
  printWarnings(ctx, warnings);
  ctx.out("");

  if (opts.out) {
    const outFile = resolveUserPath(ctx, opts.out);
    await mkdir(path.dirname(outFile), { recursive: true });
    await writeFile(outFile, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
    ctx.out(pc.dim(`payload escrito en ${outFile}`));
  }

  // --- bundles --------------------------------------------------------------
  // Se construyen antes de tocar git: un bundle roto detiene la publicación
  // entera en vez de dejar la materia a medio copiar. Una materia SIN carpeta
  // `tools/` no es un bundle roto.
  const bundles = await buildBundles(ctx, path.join(rootDir, "tools"));
  if (bundles === null) return 1;
  if (bundles.length > 0) {
    for (const bundle of bundles) {
      ctx.out(
        `  bundle ${pc.bold(bundle.manifest.id)} ${pc.dim(bundle.manifest.version)} · ${bundle.push.files.length} ${plural(bundle.push.files.length, "archivo", "archivos")} · ${formatBytes(bundle.bytes)}`,
      );
    }
    ctx.out("");
  }

  if (opts.dryRun) {
    ctx.out(pc.dim("--dry-run: no se tocó el repositorio de la plataforma."));
    return 0;
  }

  // --- repositorio de la plataforma ----------------------------------------
  const repoDir = resolveRepo(ctx, opts.repo);
  const root = await repoRoot(repoDir);
  if (root === null) {
    ctx.err(pc.red(`${repoDir} no es un repositorio git.`));
    ctx.err(pc.dim("Indique el repo de la plataforma con --repo <dir> o con SINAPSIS_HOME."));
    return 1;
  }

  const remote = await githubRemote(root);
  // La base es el `main` REMOTO al día: un `origin/main` viejo haría nacer la
  // rama de una plataforma que ya no existe. Sin red, se sigue con lo que hay.
  if (remote !== null) {
    const fetched = await git(root, ["fetch", "--quiet", "origin", MAIN_BRANCH]);
    if (fetched.code !== 0) ctx.out(pc.yellow(`  no se pudo actualizar origin/${MAIN_BRANCH} (¿sin red?): se usa la copia local.`));
  }
  const base = remote !== null && (await hasRef(root, `origin/${MAIN_BRANCH}`)) ? `origin/${MAIN_BRANCH}` : MAIN_BRANCH;
  if (!(await hasRef(root, base))) {
    ctx.err(pc.red(`${root} no tiene la rama "${base}".`));
    return 1;
  }

  const branch = opts.branch?.trim() ? opts.branch.trim() : await freeBranch(root, config.slug, new Date());
  if (await hasRef(root, branch)) {
    ctx.err(pc.red(`Ya existe la rama ${branch}.`));
    ctx.err(pc.dim(`Bórrela con \`git -C ${root} branch -D ${branch}\` o elija otra con --branch.`));
    return 1;
  }

  ctx.out(`  repositorio: ${pc.dim(root)}`);
  ctx.out(`  base: ${pc.bold(base)} · rama: ${pc.bold(branch)}`);

  // --- worktree temporal ----------------------------------------------------
  const scratch = await mkdtemp(path.join(tmpdir(), "sinapsis-publish-"));
  const worktree = path.join(scratch, "repo");
  const added = await git(root, ["worktree", "add", "--quiet", "-b", branch, worktree, base]);
  if (added.code !== 0) {
    ctx.err(pc.red(`No se pudo crear el worktree temporal desde ${base}:`));
    ctx.err(added.output.trim());
    await rm(scratch, { recursive: true, force: true });
    return 1;
  }

  /** La rama se borra al final solo si no llegó a llevar ningún commit. */
  let dropBranch = false;
  try {
    const dest = path.join(worktree, SUBJECTS_DIR, config.slug);
    await rm(dest, { recursive: true, force: true });
    const copied = await copySubject({
      dest,
      config,
      wikiRoot: compiled.wikiRoot,
      studyDir: compiled.studyDir,
      bundles,
      assets: compiled.assets,
    });
    ctx.out(
      `  copiados: ${pc.bold(String(copied.wiki))} .md · estudio: ${copied.study} ${plural(copied.study, "archivo", "archivos")} · adjuntos: ${copied.assets} · bundles: ${bundles.length}`,
    );

    const rel = `${SUBJECTS_DIR}/${config.slug}`;
    const staged = await git(worktree, ["add", "--all", "--", rel]);
    if (staged.code !== 0) {
      ctx.err(pc.red("No se pudieron agregar los archivos al índice:"));
      ctx.err(staged.output.trim());
      // Un intento que muere antes del commit no deja la rama tomada: si no, el
      // intento siguiente —el mismo comando— moriría en «Ya existe la rama».
      dropBranch = true;
      return 1;
    }

    const pending = await git(worktree, ["status", "--porcelain", "--", rel]);
    if (pending.stdout.trim() === "") {
      ctx.out(pc.green(`La materia ya está publicada tal cual en ${base}: no hay nada que proponer.`));
      dropBranch = true;
      return 0;
    }

    const summary = {
      slug: config.slug,
      name: config.name,
      pages: payload.pages.length,
      bundles: bundles.length,
      warnings,
      config,
      wiki: copied.wiki,
      assets: copied.assets,
      study: copied.study,
    };
    const committed = await git(worktree, [
      "commit",
      "--no-verify",
      "-m",
      commitTitle(summary),
      "-m",
      commitBody(summary),
    ]);
    if (committed.code !== 0) {
      ctx.err(pc.red("No se pudo commitear la materia:"));
      ctx.err(committed.output.trim());
      dropBranch = true;
      return 1;
    }
    ctx.out(pc.green(`commit escrito en ${branch}`));

    // --- PR -------------------------------------------------------------------
    if (opts.pr === false) {
      ctx.out(pc.dim("  --no-pr: la rama queda local; abra el PR cuando quiera."));
      reportLocal(ctx, root, branch);
    } else if (remote === null) {
      ctx.out(pc.dim("  sin remoto GitHub en `origin`: la rama queda local."));
      reportLocal(ctx, root, branch);
    } else if (!(await ghReady(worktree))) {
      ctx.out(pc.yellow("  hay remoto en GitHub pero `gh auth status` falla: la rama queda local."));
      reportLocal(ctx, root, branch);
    } else {
      const url = await openPullRequest(ctx, worktree, scratch, branch, summary);
      if (url === null) reportLocal(ctx, root, branch);
      else ctx.out(pc.green(`PR abierto: ${url}`));
    }

    ctx.out(`  ${webUrl(ctx, config.slug)}`);
  } finally {
    // El worktree es temporal siempre: la rama sobrevive, la carpeta no. La
    // rama se borra únicamente cuando no hubo nada que commitear (y siempre
    // DESPUÉS de desmontar el worktree: git no borra una rama que está
    // registrada en uno).
    await git(root, ["worktree", "remove", "--force", worktree]);
    if (dropBranch) await git(root, ["branch", "-D", branch]);
    await rm(scratch, { recursive: true, force: true });
  }
  return 0;
}

// ---------------------------------------------------------------------------
// Copia de la materia
// ---------------------------------------------------------------------------

export interface CopySubjectInput {
  /** Carpeta destino (`<repo>/subjects/<slug>`), ya vaciada. */
  dest: string;
  config: SubjectConfigType;
  /** Raíz del wiki efectivamente compilada (puede ser un vault de fuera del repo). */
  wikiRoot: string;
  /** Carpeta del material de estudio, resuelta contra el config. */
  studyDir: string;
  bundles: readonly BuiltBundle[];
  /** Adjuntos de imagen que el compilador resolvió (N0-61). */
  assets: readonly WikiAsset[];
}

/**
 * Escribe la materia en `dest`: config normalizado, wiki, `estudio/` y bundles.
 *
 * Lo que se copia del wiki es EXACTAMENTE lo que el compilador lee
 * (`listWikiFiles`), no la carpeta entera: un vault de Obsidian trae adjuntos,
 * plantillas y `.obsidian/` que no son la materia.
 */
export async function copySubject(
  input: CopySubjectInput,
): Promise<{ wiki: number; study: number; assets: number }> {
  const { dest, config } = input;
  await mkdir(dest, { recursive: true });

  // --- config ---------------------------------------------------------------
  // En el repositorio de la plataforma el wiki siempre está en `wiki/` y el
  // material de estudio en `estudio/`: el resto del config viaja tal cual.
  const published: SubjectConfigType = {
    ...config,
    wiki: { ...config.wiki, root: "wiki", study: "estudio" },
  };
  await writeFile(path.join(dest, "sinapsis.config.json"), `${JSON.stringify(published, null, 2)}\n`, "utf8");

  // --- wiki -----------------------------------------------------------------
  const files = await listWikiFiles(input.wikiRoot, config);
  for (const rel of files) {
    const target = resolveInside(path.join(dest, "wiki"), rel);
    if (target === null) continue;
    await mkdir(path.dirname(target), { recursive: true });
    await copyFile(path.join(input.wikiRoot, rel), target);
  }

  // --- estudio --------------------------------------------------------------
  const study = await copyTree(input.studyDir, path.join(dest, "estudio"));

  // --- adjuntos -------------------------------------------------------------
  // Los archivos van con su nombre publicado (`<hash>.<ext>`) y el índice
  // traduce la ruta del vault a ese nombre: es lo que deja que `site build`
  // compile esta copia al mismo resultado, sin los archivos originales.
  if (input.assets.length > 0) {
    const assetsDir = path.join(dest, "assets");
    await mkdir(assetsDir, { recursive: true });
    const index: Record<string, string> = {};
    for (const asset of input.assets) {
      const target = resolveInside(assetsDir, asset.file);
      if (target === null) continue;
      await copyFile(asset.source, target);
      index[asset.ref] = asset.file;
    }
    await writeFile(
      path.join(assetsDir, ASSET_INDEX_FILE),
      `${JSON.stringify({ format: ASSET_INDEX_FORMAT, assets: index }, null, 2)}\n`,
      "utf8",
    );
  }

  // --- bundles --------------------------------------------------------------
  for (const bundle of input.bundles) {
    const dir = path.join(dest, "tools", bundle.manifest.id);
    await mkdir(dir, { recursive: true });
    await copyFile(path.join(bundle.dir, MANIFEST_FILE), path.join(dir, MANIFEST_FILE));
    for (const file of bundle.push.files) {
      const target = resolveInside(dir, file.path);
      if (target === null) continue;
      await mkdir(path.dirname(target), { recursive: true });
      await copyFile(path.join(bundle.dir, file.path), target);
    }
  }

  return { wiki: files.length, study, assets: input.assets.length };
}

/** Carpetas que nunca se copian del material de estudio. */
const SKIP_TREE = new Set(["node_modules", ".git", "dist", ".dist"]);

/** Copia una carpeta entera (sin lo oculto ni `node_modules/`) y cuenta los archivos. */
async function copyTree(from: string, to: string): Promise<number> {
  let entries;
  try {
    entries = await readdir(from, { withFileTypes: true });
  } catch {
    return 0;
  }
  await mkdir(to, { recursive: true });
  let n = 0;
  for (const entry of entries) {
    if (entry.name.startsWith(".") || SKIP_TREE.has(entry.name)) continue;
    const source = path.join(from, entry.name);
    const target = path.join(to, entry.name);
    if (entry.isDirectory()) n += await copyTree(source, target);
    else if (entry.isFile()) {
      await copyFile(source, target);
      n += 1;
    }
  }
  return n;
}

// ---------------------------------------------------------------------------
// Rama, commit y PR
// ---------------------------------------------------------------------------

/** `subject/<slug>-<AAAAMMDD>`, con sufijo `-2`, `-3`… si ya está tomada. */
export async function freeBranch(repo: string, slug: string, date: Date): Promise<string> {
  const stamp = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
  const first = `subject/${slug}-${stamp}`;
  if (!(await hasRef(repo, first))) return first;
  for (let n = 2; n < 100; n += 1) {
    const candidate = `${first}-${n}`;
    if (!(await hasRef(repo, candidate))) return candidate;
  }
  return `${first}-${Date.now()}`;
}

interface Summary {
  slug: string;
  name: string;
  pages: number;
  bundles: number;
  warnings: readonly string[];
  config: SubjectConfigType;
  wiki: number;
  study: number;
  assets: number;
}

/** `Materia <slug>: <name> — N páginas, M bundles`. */
export function commitTitle(s: Pick<Summary, "slug" | "name" | "pages" | "bundles">): string {
  return `Materia ${s.slug}: ${s.name} — ${s.pages} ${plural(s.pages, "página", "páginas")}, ${s.bundles} ${plural(s.bundles, "bundle", "bundles")}`;
}

/**
 * Cuerpo del commit: conteos y advertencias. **Sin ningún trailer de
 * coautoría**: el mensaje termina en su última línea de contenido.
 */
export function commitBody(s: Summary): string {
  const lines = [
    `Páginas: ${s.pages}`,
    `Divisiones declaradas: ${s.config.divisions.length}`,
    `Archivos del wiki copiados: ${s.wiki}`,
    `Material de estudio: ${s.study} ${plural(s.study, "archivo", "archivos")}`,
    `Adjuntos de imagen: ${s.assets}`,
    `Bundles: ${s.bundles}`,
  ];
  if (s.warnings.length === 0) {
    lines.push("Advertencias: ninguna");
  } else {
    lines.push(`Advertencias: ${s.warnings.length}`);
    for (const line of s.warnings.slice(0, 20)) lines.push(`- ${line}`);
    if (s.warnings.length > 20) lines.push(`- …y ${s.warnings.length - 20} más`);
  }
  return lines.join("\n");
}

/** Cuerpo del PR: conteos, divisiones, bundles y advertencias. */
export function pullRequestBody(s: Summary): string {
  const divisions = s.config.divisions.map((d) => `- \`${d.key}\` — ${d.name}`);
  const warnings =
    s.warnings.length === 0
      ? ["Ninguna."]
      : [...s.warnings.slice(0, 40).map((line) => `- ${line}`), ...(s.warnings.length > 40 ? [`- …y ${s.warnings.length - 40} más`] : [])];

  return [
    `Materia \`${s.slug}\` — ${s.name} (${s.config.code} · ${s.config.institution}).`,
    "",
    "## Contenido",
    "",
    `- Páginas: **${s.pages}**`,
    `- Archivos del wiki: ${s.wiki}`,
    `- Material de estudio: ${s.study} archivo(s)`,
    `- Adjuntos de imagen: ${s.assets}`,
    `- Bundles de herramientas: ${s.bundles}`,
    "",
    `## ${s.config.division.plural} (${s.config.divisions.length})`,
    "",
    ...divisions,
    "",
    "## Advertencias",
    "",
    ...warnings,
    "",
    `Todo el cambio vive en \`subjects/${s.slug}/\`.`,
    "",
  ].join("\n");
}

/** Empuja la rama y abre el PR contra `main`. Devuelve la URL, o `null`. */
async function openPullRequest(
  ctx: Ctx,
  worktree: string,
  scratch: string,
  branch: string,
  summary: Summary,
): Promise<string | null> {
  const pushed = await git(worktree, ["push", "-u", "origin", branch]);
  if (pushed.code !== 0) {
    ctx.err(pc.yellow(`  no se pudo empujar ${branch}: ${pushed.output.trim().split("\n").slice(-3).join(" ")}`));
    return null;
  }
  const bodyFile = path.join(scratch, "pr-body.md");
  await writeFile(bodyFile, pullRequestBody(summary), "utf8");
  const created = await runCommand(
    "gh",
    ["pr", "create", "--base", MAIN_BRANCH, "--head", branch, "--title", `Materia ${summary.slug}: ${summary.name}`, "--body-file", bodyFile],
    worktree,
  );
  if (created.code !== 0) {
    ctx.err(pc.yellow(`  \`gh pr create\` falló: ${created.output.trim().split("\n").slice(-5).join(" ")}`));
    return null;
  }
  return created.stdout.match(/https:\/\/\S+/)?.[0] ?? "(PR creado; gh no devolvió la URL)";
}

function reportLocal(ctx: Ctx, root: string, branch: string): void {
  ctx.out(pc.dim(`  Revísela con \`git -C ${root} log ${branch} -1 --stat\`.`));
}

// ---------------------------------------------------------------------------
// Auxiliares
// ---------------------------------------------------------------------------

/**
 * Construye los bundles de `base`. `[]` si la materia no tiene herramientas (no
 * es un error: publicar el wiki es el objeto del comando); `null` si alguno no
 * compila, y ya informó por qué.
 */
async function buildBundles(ctx: Ctx, base: string): Promise<BuiltBundle[] | null> {
  const dirs = await findBundles(base);
  if (dirs === null || dirs.length === 0) {
    ctx.out(pc.dim(`  sin bundles de herramientas (${base})`));
    ctx.out("");
    return [];
  }
  const built: BuiltBundle[] = [];
  for (const dir of dirs) {
    const outcome = await buildBundle(dir);
    if (!outcome.ok) {
      ctx.err(pc.red(`El bundle de ${dir} no se puede publicar (${outcome.problems.length} problema(s)):`));
      for (const problem of outcome.problems) ctx.err(`  ${pc.bold(problem.where)}: ${problem.message}`);
      return null;
    }
    built.push(outcome.bundle);
  }
  return built;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}
