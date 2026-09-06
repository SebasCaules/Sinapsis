/**
 * `sinapsis propose` — una materia propone un cambio a la plataforma
 * (contrato N0-44, `docs/PROPOSALS.md`).
 *
 * El agente de una materia no parchea la plataforma: la modifica en una rama del
 * repositorio de Sinapsis, escribe la propuesta y pide revisión. Este comando
 * hace todo el trabajo de secretaría de ese flujo:
 *
 *  1. Comprueba que el repositorio de la plataforma esté en `main` y que lo único
 *     modificado sea lo que la materia declara (`--files`).
 *  2. Corre los gates **antes** de tocar git (`pnpm typecheck`, `pnpm test`, y
 *     `pnpm build` si el cambio toca `apps/`). Si fallan, no crea nada: el agente
 *     corrige y vuelve a ejecutar el mismo comando.
 *  3. Crea la rama `proposal/<materia>-<AAAAMMDD>-<titulo>`, escribe
 *     `proposals/<AAAA-MM-DD>-<materia>-<titulo>.md` con la plantilla completa y
 *     commitea el cambio junto con la propuesta.
 *  4. Si hay remoto en GitHub y `gh` autenticado, abre el PR; si no, deja la rama
 *     y anota la propuesta en `proposals/INBOX.md`.
 *  5. Vuelve a `main` y le dice al usuario que abra `/sinapsis-review`.
 *
 * Decisión B4-3: la fila del INBOX se escribe **solo en `main`**, en un commit
 * propio. El INBOX es el índice del orquestador y tiene que verse sin cambiar de
 * rama; escribirlo también en la rama no agrega nada y hace conflictar dos
 * propuestas abiertas a la vez. La rama lleva el cambio y la propuesta, nada más.
 *
 * Decisión Q5-1: la fila va al final de la tabla de **abiertas**, no al final del
 * archivo. El INBOX tiene después la tabla de las cerradas, que escribe
 * `/sinapsis-review` al adjudicar.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import pc from "picocolors";
import { normalizeSlug } from "@sinapsis/contract";
import { resolveUserPath, PACKAGE_ROOT, type Ctx } from "../context.js";
import { changeLabel, changedFiles, git, gitLine, runCommand, type GitChange } from "../git.js";

export interface ProposeOptions {
  subject?: string;
  title?: string;
  body?: string;
  /** Archivos que la materia declara haber cambiado, separados por coma. */
  files?: string;
  /** Texto de la sección «Compatibilidad»; si falta, queda un COMPLETAR. */
  compat?: string;
  skipGates?: boolean;
  /** Repositorio de la plataforma (o `SINAPSIS_HOME`). */
  repo?: string;
}

/** Rama única del flujo: nunca se propone contra otra. */
export const MAIN_BRANCH = "main";
export const PROPOSALS_DIR = "proposals";
export const INBOX_FILE = path.join(PROPOSALS_DIR, "INBOX.md");

/** Raíz del repositorio de la plataforma cuando el CLI corre desde su propio código. */
const REPO_ROOT = path.resolve(PACKAGE_ROOT, "../..");

export async function runPropose(opts: ProposeOptions, ctx: Ctx): Promise<number> {
  const subject = (opts.subject ?? "").trim();
  const title = (opts.title ?? "").trim();
  const body = (opts.body ?? "").trim();
  const missing = [
    subject === "" ? "--subject" : "",
    title === "" ? "--title" : "",
    body === "" ? "--body" : "",
  ].filter(Boolean);
  if (missing.length > 0) {
    ctx.err(pc.red(`Faltan ${missing.join(", ")}.`));
    ctx.err(pc.dim('Ejemplo: sinapsis propose --subject proba --title "Rail con badges" --body "Por qué hace falta"'));
    return 1;
  }

  const repo = resolveRepo(ctx, opts.repo);
  const root = await gitLine(repo, ["rev-parse", "--show-toplevel"]);
  if (root === null) {
    ctx.err(pc.red(`${repo} no es un repositorio git.`));
    ctx.err(pc.dim("Indique el repo de la plataforma con --repo <dir> o con SINAPSIS_HOME."));
    return 1;
  }

  const branchNow = await gitLine(root, ["rev-parse", "--abbrev-ref", "HEAD"]);
  if (branchNow !== MAIN_BRANCH) {
    ctx.err(pc.red(`El repositorio está en "${branchNow ?? "?"}" y una propuesta nace de "${MAIN_BRANCH}".`));
    ctx.err(pc.dim(`Vuelva con \`git -C ${root} checkout ${MAIN_BRANCH}\` y repita.`));
    return 1;
  }

  // --- qué se propone -------------------------------------------------------
  const changes = await changedFiles(root);
  const declared = (opts.files ?? "")
    .split(",")
    .map((f) => normalizeRelative(f))
    .filter((f) => f !== "");

  if (declared.length > 0) {
    const allowed = new Set(declared);
    const extra = changes.filter((c) => !allowed.has(c.path));
    if (extra.length > 0) {
      ctx.err(pc.red(`El árbol tiene ${extra.length} cambio(s) que --files no declara:`));
      for (const change of extra) ctx.err(`  ${changeLabel(change.status)}: ${change.path}`);
      ctx.err(pc.dim("Una propuesta es un cambio coherente: declare todo lo que toca o limpie el resto."));
      return 1;
    }
    const absent = declared.filter((f) => !changes.some((c) => c.path === f));
    if (absent.length > 0) {
      ctx.err(pc.red(`--files nombra archivos sin cambios: ${absent.join(", ")}`));
      return 1;
    }
  }

  if (changes.length === 0) {
    ctx.err(pc.red("No hay ningún cambio que proponer: el árbol de la plataforma está limpio."));
    ctx.err(pc.dim("Implemente el cambio en el repo de la plataforma y después ejecute `propose`."));
    return 1;
  }

  const paths = changes.map((c) => c.path);
  const date = isoDate(new Date());
  const slug = normalizeSlug(subject) || "materia";
  const titleSlug = shorten(normalizeSlug(title) || "propuesta", 60);
  const branch = `proposal/${slug}-${date.replaceAll("-", "")}-${titleSlug}`;
  const file = path.join(PROPOSALS_DIR, `${date}-${slug}-${titleSlug}.md`);

  if ((await gitLine(root, ["rev-parse", "--verify", "--quiet", branch])) !== null) {
    ctx.err(pc.red(`Ya existe la rama ${branch}.`));
    ctx.err(pc.dim(`Revise esa propuesta, o bórrela con \`git -C ${root} branch -D ${branch}\` y repita.`));
    return 1;
  }

  ctx.out(pc.bold(`Propuesta de ${slug}: ${title}`));
  ctx.out(`  repositorio: ${pc.dim(root)}`);
  ctx.out(`  rama: ${pc.bold(branch)}`);
  ctx.out(`  archivos: ${paths.length}`);
  for (const change of changes) ctx.out(`    ${pc.dim(changeLabel(change.status).padEnd(11))} ${change.path}`);
  ctx.out("");

  // --- gates ----------------------------------------------------------------
  const gates = opts.skipGates ? null : await runGates(ctx, root, paths);
  if (gates && gates.some((g) => g.code !== 0)) {
    ctx.err(pc.red("Los gates no pasan: no se creó la rama ni la propuesta."));
    ctx.err(pc.dim("Corrija el cambio y vuelva a ejecutar el mismo comando."));
    return 1;
  }

  // --- rama, propuesta y commit --------------------------------------------
  const created = await git(root, ["checkout", "-b", branch]);
  if (created.code !== 0) {
    ctx.err(pc.red(`No se pudo crear la rama ${branch}:`));
    ctx.err(created.output.trim());
    return 1;
  }

  const proposal = renderProposal({ date, slug, title, body, branch, changes, gates, compat: opts.compat });
  await writeFile(path.join(root, file), proposal, "utf8");

  const added = await git(root, ["add", "--", ...paths, file]);
  if (added.code !== 0) {
    ctx.err(pc.red("No se pudieron agregar los archivos al índice:"));
    ctx.err(added.output.trim());
    await back(ctx, root);
    return 1;
  }
  const committed = await git(root, ["commit", "-m", `Propuesta de ${slug}: ${title}`, "-m", body]);
  if (committed.code !== 0) {
    ctx.err(pc.red("No se pudo commitear la propuesta:"));
    ctx.err(committed.output.trim());
    await back(ctx, root);
    return 1;
  }
  ctx.out(pc.green(`propuesta escrita en ${file} y commiteada en ${branch}`));

  // --- PR o INBOX -----------------------------------------------------------
  const pr = await openPullRequest(ctx, root, branch, title, file);
  if (pr) {
    await stampPr(root, file, pr);
    ctx.out(pc.green(`PR abierto: ${pr}`));
  }
  await back(ctx, root);
  if (!pr) {
    const noted = await noteInInbox(ctx, root, { date, slug, title, branch });
    if (!noted) return 1;
  }

  ctx.out("");
  ctx.out(pc.bold("Siguiente paso (lo hace el usuario, no la materia):"));
  ctx.out(`  Abra una sesión de Claude Code en \`${root}\` y ejecute \`/sinapsis-review\`.`);
  ctx.out(`  Rama a revisar: ${pc.bold(branch)}`);
  ctx.out(`  Propuesta: ${file}`);
  return 0;
}

// ---------------------------------------------------------------------------
// Gates
// ---------------------------------------------------------------------------

export interface GateResult {
  name: string;
  code: number;
  output: string;
}

/** `pnpm typecheck`, `pnpm test` y, si el cambio toca `apps/`, `pnpm build`. */
async function runGates(ctx: Ctx, repo: string, paths: readonly string[]): Promise<GateResult[]> {
  const scripts = ["typecheck", "test", ...(paths.some((p) => p.startsWith("apps/")) ? ["build"] : [])];
  const results: GateResult[] = [];

  for (const script of scripts) {
    ctx.out(pc.dim(`  gate: pnpm ${script}…`));
    const result = await runCommand("pnpm", [script], repo);
    // La ruta absoluta del repositorio se reemplaza por `.`: la propuesta la lee el
    // orquestador en otra máquina (y en un worktree), y esas rutas solo hacen ruido.
    results.push({ name: `pnpm ${script}`, code: result.code, output: result.output.replaceAll(repo, ".") });
    if (result.code === 0) {
      ctx.out(`  ${pc.green("OK")} pnpm ${script}`);
      continue;
    }
    ctx.out(`  ${pc.red("FALLÓ")} pnpm ${script}`);
    for (const line of tail(result.output, 20).split("\n")) ctx.out(pc.dim(`      ${line}`));
    break; // los gates son una cadena: el primero que falla corta
  }
  return results;
}

// ---------------------------------------------------------------------------
// La propuesta
// ---------------------------------------------------------------------------

interface ProposalInput {
  date: string;
  slug: string;
  title: string;
  body: string;
  branch: string;
  changes: readonly GitChange[];
  gates: GateResult[] | null;
  compat?: string | undefined;
}

/** El archivo `proposals/<fecha>-<materia>-<titulo>.md`, con la plantilla completa. */
export function renderProposal(input: ProposalInput): string {
  const touches = (prefix: string) => input.changes.some((c) => c.path.startsWith(prefix));
  const contract = touches("packages/contract/");

  const scope = [
    "Archivos cambiados en la rama (`git status --porcelain` al proponer):",
    "",
    ...input.changes.map((c) => `- \`${c.path}\` — ${changeLabel(c.status)}`),
    "",
    contract
      ? "**Contrato afectado: `packages/contract`.** Si esto cambia el esquema, necesita versión del contrato o campo opcional con default, tests, y una fila en `docs/DECISIONS.md`; si solo documenta o prueba una decisión ya tomada, alcanza con decir cuál (regla de `docs/PROPOSALS.md`)."
      : "Contratos afectados: ninguno (`packages/contract` no se toca).",
  ];

  const compat = input.compat?.trim()
    ? [input.compat.trim()]
    : [
        "COMPLETAR: qué pasa con las demás materias y con los datos ya sincronizados.",
        "",
        ...(contract
          ? ["- Contrato: diga si el campo nuevo es opcional y con default, para que los `sinapsis.config.json` y los payloads ya sincronizados sigan validando."]
          : []),
        ...(touches("apps/api/") ? ["- API: diga si hace falta migración y si los clientes anteriores siguen funcionando."] : []),
        ...(touches("apps/web/") ? ["- Web: diga qué se ve distinto y en qué materias."] : []),
      ];

  const gates =
    input.gates === null
      ? ["Omitidos con `--skip-gates`: la propuesta no cambia código ejecutable.", ""]
      : input.gates.flatMap((gate) => [
          `### \`${gate.name}\` — ${gate.code === 0 ? "OK" : `falló (código ${gate.code})`}`,
          "",
          // Lo comparable entre dos máquinas: los conteos. El resto de la salida
          // lleva tiempos y advertencias que cambian en cada corrida.
          ...(gateCounts(gate.output).length > 0
            ? ["Conteos (esto es lo que el orquestador vuelve a obtener en la rama):", "", ...gateCounts(gate.output), ""]
            : []),
          "Últimas líneas:",
          "",
          "```",
          tail(gate.output.trimEnd(), 20) || "(sin salida)",
          "```",
          "",
        ]);

  return [
    "---",
    `fecha: ${input.date}`,
    `materia: ${input.slug}`,
    `titulo: ${yaml(input.title)}`,
    `rama: ${input.branch}`,
    "estado: abierta",
    "pr: null",
    "---",
    "",
    "## Motivo",
    "",
    input.body,
    "",
    "## Alcance",
    "",
    ...scope,
    "",
    "## Compatibilidad",
    "",
    ...compat,
    "",
    "## Gates",
    "",
    ...gates,
    "## Revisión",
    "",
    "(la completa el orquestador con `/sinapsis-review`: veredicto, motivos, commit de merge)",
    "",
  ].join("\n");
}

/**
 * Los conteos de vitest de una salida de `pnpm test` (`Tests  31 passed (31)`),
 * uno por paquete, como viñetas.
 *
 * Es lo único de la salida que sobrevive al cambio de máquina: el orquestador
 * corre los mismos gates en la rama y compara **estos números**, no el texto
 * literal, que trae tiempos y advertencias distintas en cada corrida.
 */
export function gateCounts(output: string): string[] {
  const out: string[] = [];
  for (const match of output.matchAll(/^(?:(\S+)\s+test:)?\s*Tests\s{2,}(\S.*?)\s*$/gm)) {
    const where = match[1];
    out.push(`- ${where ? `\`${where}\`: ` : ""}${match[2]}`);
  }
  return out;
}

/** Escribe el enlace del PR en el frontmatter y lo suma al commit de la propuesta. */
async function stampPr(repo: string, file: string, url: string): Promise<void> {
  const full = path.join(repo, file);
  const text = await readFile(full, "utf8");
  await writeFile(full, text.replace(/^pr: null$/m, `pr: ${url}`), "utf8");
  await git(repo, ["add", "--", file]);
  await git(repo, ["commit", "--amend", "--no-edit"]);
}

// ---------------------------------------------------------------------------
// PR e INBOX
// ---------------------------------------------------------------------------

/**
 * Abre el PR si hay remoto `origin` en GitHub y `gh` autenticado. Devuelve la URL
 * o `null` (que es el caso normal en una instalación personal sin remoto: la
 * propuesta queda en la rama local y en el INBOX).
 */
async function openPullRequest(
  ctx: Ctx,
  repo: string,
  branch: string,
  title: string,
  file: string,
): Promise<string | null> {
  const origin = await gitLine(repo, ["remote", "get-url", "origin"]);
  if (origin === null || !/github\.com/i.test(origin)) {
    ctx.out(
      pc.dim(
        origin === null
          ? "  sin remoto `origin`: la propuesta queda local."
          : `  el remoto no es GitHub (${origin}): la propuesta queda local.`,
      ),
    );
    return null;
  }

  const auth = await runCommand("gh", ["auth", "status"], repo);
  if (auth.code !== 0) {
    ctx.out(pc.yellow("  hay remoto en GitHub pero `gh auth status` falla: la propuesta queda local."));
    return null;
  }

  const pushed = await git(repo, ["push", "-u", "origin", branch]);
  if (pushed.code !== 0) {
    ctx.err(pc.yellow(`  no se pudo empujar ${branch}: ${tail(pushed.output, 3)}`));
    return null;
  }

  const created = await runCommand("gh", ["pr", "create", "--title", title, "--body-file", file], repo);
  if (created.code !== 0) {
    ctx.err(pc.yellow(`  \`gh pr create\` falló: ${tail(created.output, 5)}`));
    return null;
  }
  const url = created.stdout.match(/https:\/\/\S+/)?.[0];
  return url ?? "(PR creado; gh no devolvió la URL)";
}

/**
 * Fila en `proposals/INBOX.md`, en `main` y en un commit propio (decisión B4-3).
 * Devuelve false si no se pudo (y ya informó por qué).
 */
async function noteInInbox(
  ctx: Ctx,
  repo: string,
  entry: { date: string; slug: string; title: string; branch: string },
): Promise<boolean> {
  const full = path.join(repo, INBOX_FILE);
  let text: string;
  try {
    text = await readFile(full, "utf8");
  } catch {
    ctx.err(pc.red(`No encuentro ${INBOX_FILE} en ${repo}.`));
    ctx.err(pc.dim("La propuesta quedó en su rama; avísele al usuario para que la revise igual."));
    return false;
  }

  const row = `| ${entry.date} | ${entry.slug} | ${cell(entry.title)} | ${entry.branch} | abierta |`;
  await writeFile(full, insertInboxRow(text, row), "utf8");

  const added = await git(repo, ["add", "--", INBOX_FILE]);
  const committed =
    added.code === 0 ? await git(repo, ["commit", "-m", `proposals: ${entry.slug} — ${entry.title}`]) : added;
  if (committed.code !== 0) {
    ctx.err(pc.yellow(`  la fila quedó escrita en ${INBOX_FILE} pero sin commitear: ${tail(committed.output, 3)}`));
    return true;
  }
  ctx.out(pc.green(`fila agregada a ${INBOX_FILE} en ${MAIN_BRANCH}`));
  return true;
}

// ---------------------------------------------------------------------------
// Auxiliares
// ---------------------------------------------------------------------------

/** Repositorio de la plataforma: `--repo`, `SINAPSIS_HOME`, o el del propio CLI. */
export function resolveRepo(ctx: Ctx, flag?: string): string {
  if (flag) return resolveUserPath(ctx, flag);
  const home = (ctx.env["SINAPSIS_HOME"] ?? "").trim();
  return home === "" ? REPO_ROOT : resolveUserPath(ctx, home);
}

/** Vuelve a `main` pase lo que pase: la materia nunca deja el repo en otra rama. */
async function back(ctx: Ctx, repo: string): Promise<void> {
  const result = await git(repo, ["checkout", MAIN_BRANCH]);
  if (result.code !== 0) {
    ctx.err(pc.yellow(`No se pudo volver a ${MAIN_BRANCH}: ${tail(result.output, 3)}`));
  }
}

/** Ruta relativa y con barras, tal como la nombra `git status`. */
function normalizeRelative(raw: string): string {
  return raw.trim().replace(/^\.\//, "").split(path.sep).join("/");
}

function isoDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * Recorta un slug a `max` caracteres **por el guion anterior**, para que el nombre
 * de la rama y del archivo terminen en una palabra entera y no en un muñón
 * (`…-es-la-m`). Si la primera palabra ya es más larga que el límite, corta seco.
 */
export function shorten(slug: string, max: number): string {
  if (slug.length <= max) return slug;
  const cut = slug.slice(0, max);
  const lastDash = cut.lastIndexOf("-");
  return (lastDash > 0 ? cut.slice(0, lastDash) : cut).replace(/-+$/, "");
}

/** Últimas `n` líneas de una salida larga, con la marca de lo recortado. */
export function tail(text: string, n: number): string {
  const lines = text.replace(/\s+$/, "").split("\n");
  if (lines.length <= n) return lines.join("\n");
  return [`… (${lines.length - n} líneas anteriores)`, ...lines.slice(-n)].join("\n");
}

/** Escalar YAML entre comillas dobles. */
function yaml(text: string): string {
  return `"${text.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`;
}

/** Celda de la tabla del INBOX: sin barras ni saltos que rompan el markdown. */
function cell(text: string): string {
  return text.replaceAll("|", "\\|").replace(/\s*\n\s*/g, " ");
}

/**
 * Agrega la fila al final de la **primera** tabla del INBOX, que es la de las
 * propuestas abiertas.
 *
 * No se agrega al final del archivo: el INBOX tiene después la tabla de las
 * propuestas cerradas (la escribe `/sinapsis-review` al adjudicar), y una fila de
 * cinco columnas caída ahí queda invisible para el orquestador y con las columnas
 * cambiadas. Si el archivo no tiene ninguna tabla, se agrega al final, que es lo
 * único sensato que queda.
 */
export function insertInboxRow(text: string, row: string): string {
  const lines = text.replace(/\n+$/, "").split("\n");
  const separator = lines.findIndex((line) => /^\|\s*:?-{3,}/.test(line.trim()));
  if (separator === -1) return `${lines.join("\n")}\n${row}\n`;

  let end = separator + 1;
  while (end < lines.length && lines[end]!.trim().startsWith("|")) end += 1;
  lines.splice(end, 0, row);
  return `${lines.join("\n")}\n`;
}
