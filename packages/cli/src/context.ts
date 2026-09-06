/**
 * Contexto de ejecución del CLI: salida y directorio base.
 *
 * El directorio base es el de invocación, no el del paquete: cuando el CLI se
 * corre con `pnpm --dir <repo> sinapsis -- …` desde el repo de una materia,
 * pnpm deja la carpeta original en `INIT_CWD` y las rutas relativas del usuario
 * (`--config`, `--wiki`, `--out`) tienen que resolverse contra ella.
 */
import { homedir } from "node:os";
import path from "node:path";

export interface Ctx {
  /** Escribe una línea en la salida estándar. */
  out(line: string): void;
  /** Escribe una línea en la salida de error. */
  err(line: string): void;
  /** Directorio contra el que se resuelven las rutas relativas del usuario. */
  cwd: string;
  /** Variables de entorno visibles para el CLI. */
  env: Record<string, string | undefined>;
}

/** Directorio desde el que el usuario invocó el comando. */
export function invocationCwd(env: Record<string, string | undefined> = process.env): string {
  const init = env["INIT_CWD"];
  return init && init.trim() !== "" ? init : process.cwd();
}

export function defaultCtx(): Ctx {
  return {
    out: (line) => process.stdout.write(`${line}\n`),
    err: (line) => process.stderr.write(`${line}\n`),
    cwd: invocationCwd(),
    env: process.env,
  };
}

/** Resuelve una ruta del usuario (relativa, absoluta o con `~/`) contra `ctx.cwd`. */
export function resolveUserPath(ctx: Ctx, target: string): string {
  let value = target;
  if (value === "~") value = homedir();
  else if (value.startsWith("~/")) value = path.join(homedir(), value.slice(2));
  return path.resolve(ctx.cwd, value);
}
