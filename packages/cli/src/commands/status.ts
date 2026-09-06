/**
 * `sinapsis status` — qué tan lejos está el vault local de lo que la plataforma
 * ya tiene publicado.
 *
 * Sin API, «lo publicado» es la carpeta `subjects/<slug>/` del repositorio de la
 * plataforma. El comando compila las dos versiones (la del vault y la del repo)
 * con el mismo compilador y las compara por HUELLA de cada página: así una
 * diferencia de formato del markdown que no cambia la página compilada no
 * aparece como cambio, y un cambio real sí, aunque la fecha del archivo no se
 * haya movido.
 *
 * No consulta la red. Si hay remoto en GitHub y `gh` autenticado, además lista
 * los PR abiertos de la materia (`subject/<slug>-*`).
 */
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import pc from "picocolors";
import { plural, type Page as PageType } from "@sinapsis/contract";
import { compileWiki } from "@sinapsis/markdown";
import { resolveUserPath, type Ctx } from "../context.js";
import { ghReady, githubRemote, repoRoot, runCommand } from "../git.js";
import { countsByDivision, countsByType, heading, studyLine, webUrl } from "../report.js";
import { GENERATOR } from "../version.js";
import { SUBJECTS_DIR } from "./publish.js";
import { DEFAULT_CONFIG, loadConfig } from "./validate.js";
import { resolveRepo } from "./propose.js";

export interface StatusOptions {
  config?: string;
  /** Sobreescribe `wiki.root` del config. */
  wiki?: string;
  /** Repositorio de la plataforma (o `SINAPSIS_HOME`). */
  repo?: string;
}

/** Diferencia entre el vault y lo publicado. */
export interface PageDiff {
  added: string[];
  changed: string[];
  removed: string[];
  same: number;
}

/**
 * Huella de una página compilada: distingue «igual» de «modificada». Se calcula
 * sobre la página entera tal como la emite el compilador, así no hay una segunda
 * lista de campos que se pueda desincronizar del contrato.
 */
export function pageHash(page: PageType): string {
  return createHash("sha1").update(JSON.stringify(page)).digest("hex");
}

/** Compara dos conjuntos de páginas compiladas. */
export function diffPages(local: readonly PageType[], published: readonly PageType[]): PageDiff {
  const before = new Map(published.map((p) => [p.slug, pageHash(p)]));
  const added: string[] = [];
  const changed: string[] = [];
  let same = 0;

  for (const page of local) {
    const hash = before.get(page.slug);
    if (hash === undefined) added.push(page.slug);
    else if (hash !== pageHash(page)) changed.push(page.slug);
    else same += 1;
    before.delete(page.slug);
  }
  return {
    added: added.sort((a, b) => a.localeCompare(b, "en")),
    changed: changed.sort((a, b) => a.localeCompare(b, "en")),
    removed: [...before.keys()].sort((a, b) => a.localeCompare(b, "en")),
    same,
  };
}

export async function runStatus(opts: StatusOptions, ctx: Ctx): Promise<number> {
  const loaded = await loadConfig(ctx, opts.config ?? DEFAULT_CONFIG);
  if (!loaded) return 1;
  const config = loaded.config;
  const wikiFlag = opts.wiki ? resolveUserPath(ctx, opts.wiki) : undefined;

  let local;
  try {
    local = await compileWiki({
      config,
      rootDir: path.dirname(loaded.path),
      ...(wikiFlag ? { wikiRoot: wikiFlag } : {}),
      generator: GENERATOR,
    });
  } catch (cause) {
    ctx.err(pc.red("No se pudo compilar el wiki local:"));
    ctx.err(`  ${cause instanceof Error ? cause.message : String(cause)}`);
    return 1;
  }

  const repoDir = resolveRepo(ctx, opts.repo);
  const root = await repoRoot(repoDir);
  if (root === null) {
    ctx.err(pc.red(`${repoDir} no es un repositorio git.`));
    ctx.err(pc.dim("Indique el repo de la plataforma con --repo <dir> o con SINAPSIS_HOME."));
    return 1;
  }

  const publishedDir = path.join(root, SUBJECTS_DIR, config.slug);
  const publishedConfig = path.join(publishedDir, "sinapsis.config.json");

  heading(ctx, config);
  ctx.out(`  vault: ${pc.dim(local.wikiRoot)}`);
  ctx.out(`  plataforma: ${pc.dim(publishedDir)}`);
  ctx.out(`  páginas locales: ${pc.bold(String(local.payload.pages.length))}`);
  ctx.out("");

  let published: Awaited<ReturnType<typeof compileWiki>> | null = null;
  try {
    await readFile(publishedConfig, "utf8");
    published = await compileWiki({ configPath: publishedConfig, generator: GENERATOR });
  } catch (cause) {
    const missing = (cause as NodeJS.ErrnoException).code === "ENOENT";
    if (!missing) {
      ctx.err(pc.red(`No se pudo compilar lo publicado en ${publishedDir}:`));
      ctx.err(`  ${cause instanceof Error ? cause.message : String(cause)}`);
      return 1;
    }
  }

  if (published === null) {
    ctx.out(pc.yellow(`  la materia todavía no está en ${root}/${SUBJECTS_DIR}/`));
    ctx.out(pc.dim("  Publíquela con `sinapsis publish`."));
    ctx.out("");
    countsByType(ctx, config, local.payload.pages);
    ctx.out("");
    countsByDivision(ctx, config, local.payload.pages);
    ctx.out("");
    studyLine(ctx, local.study);
    ctx.out("");
    await reportPullRequests(ctx, root, config.slug);
    ctx.out(`  ${webUrl(ctx, config.slug)}`);
    return 0;
  }

  const diff = diffPages(local.payload.pages, published.payload.pages);
  ctx.out(pc.bold("  contra lo publicado"));
  line(ctx, "nuevas", diff.added, pc.green);
  line(ctx, "cambiadas", diff.changed, pc.yellow);
  line(ctx, "borradas", diff.removed, pc.red);
  ctx.out(`    ${pad("iguales")} ${String(diff.same).padStart(4)}`);
  ctx.out("");

  if (JSON.stringify(config) !== JSON.stringify(published.payload.config)) {
    ctx.out(pc.yellow("  el config local difiere del publicado"));
  }
  if (JSON.stringify(local.study) !== JSON.stringify(published.study)) {
    ctx.out(pc.yellow("  el material de estudio local difiere del publicado"));
  }
  const pending = diff.added.length + diff.changed.length + diff.removed.length;
  if (pending === 0 && JSON.stringify(local.payload.config) === JSON.stringify(published.payload.config)) {
    ctx.out(pc.green("  al día: no hay nada que publicar"));
  } else {
    ctx.out(pc.dim("  Publique los cambios con `sinapsis publish`."));
  }
  ctx.out("");

  studyLine(ctx, local.study);
  ctx.out("");
  await reportPullRequests(ctx, root, config.slug);
  ctx.out(`  ${webUrl(ctx, config.slug)}`);
  return 0;
}

/**
 * PR abiertos de la materia. Solo se consulta si hay remoto en GitHub y `gh`
 * autenticado: sin eso el comando no toca la red y no dice nada.
 */
async function reportPullRequests(ctx: Ctx, root: string, slug: string): Promise<void> {
  if ((await githubRemote(root)) === null) return;
  if (!(await ghReady(root))) return;

  const result = await runCommand(
    "gh",
    ["pr", "list", "--state", "open", "--limit", "50", "--json", "number,title,url,headRefName"],
    root,
  );
  if (result.code !== 0) {
    ctx.out(pc.dim("  no se pudieron listar los PR abiertos (`gh pr list` falló)"));
    return;
  }

  let list: Array<{ number?: number; title?: string; url?: string; headRefName?: string }> = [];
  try {
    list = JSON.parse(result.stdout || "[]") as typeof list;
  } catch {
    return;
  }
  const mine = list.filter((pr) => (pr.headRefName ?? "").startsWith(`subject/${slug}-`));
  if (mine.length === 0) {
    ctx.out(pc.dim(`  sin PR abiertos de "${slug}"`));
    return;
  }
  ctx.out(`  ${pc.bold(String(mine.length))} PR ${plural(mine.length, "abierto", "abiertos")}`);
  for (const pr of mine) {
    ctx.out(`    #${pr.number} ${pr.title ?? ""} ${pc.dim(pr.headRefName ?? "")}`);
    if (pr.url) ctx.out(`      ${pc.dim(pr.url)}`);
  }
  ctx.out("");
}

/** Una fila del bloque de diferencias, con hasta seis slugs de ejemplo. */
function line(ctx: Ctx, label: string, slugs: readonly string[], color: (s: string) => string): void {
  const text = `    ${pad(label)} ${String(slugs.length).padStart(4)}` + (slugs.length > 0 ? pc.dim(`  ${sample(slugs)}`) : "");
  ctx.out(slugs.length > 0 ? color(text) : text);
}

function sample(slugs: readonly string[]): string {
  return slugs.length <= 6 ? slugs.join(", ") : `${slugs.slice(0, 6).join(", ")} … (+${slugs.length - 6})`;
}

function pad(text: string): string {
  return text.length >= 12 ? text : text + " ".repeat(12 - text.length);
}
