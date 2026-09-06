/**
 * Envoltorio mínimo de `git` y de los comandos que corre `sinapsis propose`.
 *
 * Todo pasa por `execFile` con la lista de argumentos separada (nunca por una
 * shell): los títulos de propuesta y los nombres de rama vienen de la línea de
 * comandos de otro agente y no pueden convertirse en comandos.
 */
import { execFile } from "node:child_process";

export interface RunResult {
  code: number;
  stdout: string;
  stderr: string;
  /** stdout + stderr, en el orden en que los devolvió el proceso. */
  output: string;
}

/** Corre un comando y devuelve su salida sin lanzar excepciones. */
export function runCommand(
  command: string,
  args: readonly string[],
  cwd: string,
  env?: Record<string, string | undefined>,
): Promise<RunResult> {
  return new Promise((resolve) => {
    execFile(
      command,
      [...args],
      { cwd, maxBuffer: 32 * 1024 * 1024, env: (env ?? process.env) as NodeJS.ProcessEnv },
      (error, stdout, stderr) => {
        const code = error === null ? 0 : ((error as NodeJS.ErrnoException & { code?: number }).code ?? 1);
        const out = String(stdout);
        const err = String(stderr);
        resolve({
          code: typeof code === "number" ? code : 1,
          stdout: out,
          stderr: err,
          output: [out, err].filter((s) => s.trim() !== "").join("\n"),
        });
      },
    );
  });
}

export const git = (repo: string, args: readonly string[]): Promise<RunResult> => runCommand("git", args, repo);

/** Salida de `git` recortada, o `null` si el comando falló. */
export async function gitLine(repo: string, args: readonly string[]): Promise<string | null> {
  const result = await git(repo, args);
  return result.code === 0 ? result.stdout.trim() : null;
}

export interface GitChange {
  /** Ruta relativa a la raíz del repositorio (la nueva, si hubo renombre). */
  path: string;
  /** Los dos caracteres de estado de `git status --porcelain` ("?? ", " M", "A "…). */
  status: string;
}

/**
 * `git status --porcelain -z`: rutas exactas aunque tengan espacios o acentos.
 * En un renombre (`R`) se informa la ruta nueva, que es la que hay que agregar.
 *
 * `--untracked-files=all` es importante: sin él, una carpeta nueva se informa
 * como una sola entrada `carpeta/` y `--files` no podría nombrar sus archivos ni
 * la propuesta listarlos.
 */
export async function changedFiles(repo: string): Promise<GitChange[]> {
  const result = await git(repo, ["status", "--porcelain", "-z", "--untracked-files=all"]);
  if (result.code !== 0) return [];

  const parts = result.stdout.split("\0");
  const out: GitChange[] = [];
  for (let i = 0; i < parts.length; i += 1) {
    const entry = parts[i];
    if (!entry || entry.length < 4) continue;
    const status = entry.slice(0, 2);
    const target = entry.slice(3);
    // Un renombre trae la ruta vieja en el registro siguiente: se saltea.
    if (status.startsWith("R") || status.startsWith("C")) i += 1;
    out.push({ status, path: target });
  }
  return out.sort((a, b) => a.path.localeCompare(b.path, "en"));
}

/** Rótulo legible del estado de `git status` para la sección «Alcance». */
export function changeLabel(status: string): string {
  if (status.startsWith("??")) return "nuevo";
  if (status.startsWith("A")) return "agregado";
  if (status.startsWith("R")) return "renombrado";
  if (status.startsWith("D") || status[1] === "D") return "borrado";
  return "modificado";
}

/** Raíz del repositorio que contiene `dir`, o `null` si no es un repositorio git. */
export async function repoRoot(dir: string): Promise<string | null> {
  return gitLine(dir, ["rev-parse", "--show-toplevel"]);
}

/** ¿Existe la referencia (`main`, `origin/main`, una rama…)? */
export async function hasRef(repo: string, ref: string): Promise<boolean> {
  return (await gitLine(repo, ["rev-parse", "--verify", "--quiet", ref])) !== null;
}

/** URL del remoto `origin` si apunta a GitHub; `null` en cualquier otro caso. */
export async function githubRemote(repo: string): Promise<string | null> {
  const origin = await gitLine(repo, ["remote", "get-url", "origin"]);
  return origin !== null && /github\.com/i.test(origin) ? origin : null;
}

/** ¿Está `gh` instalado y autenticado en este repositorio? */
export async function ghReady(repo: string): Promise<boolean> {
  return (await runCommand("gh", ["auth", "status"], repo)).code === 0;
}
