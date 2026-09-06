/**
 * Contexto de ejecución del CLI: salida y directorio base.
 *
 * El directorio base es el de invocación, no el del paquete. Se resuelve así,
 * de mayor a menor prioridad:
 *
 *  1. `--cwd <dir>` — la bandera global; gana siempre.
 *  2. `INIT_CWD` — solo si el proceso quedó *dentro* del paquete del CLI, que es
 *     justo lo que hace `pnpm --dir <repo> sinapsis -- …`: reubica el proceso y
 *     deja la carpeta original del usuario en esa variable.
 *  3. `process.cwd()` — el caso normal (binario instalado, `npx`, `node dist/`).
 *
 * De ese directorio cuelgan las rutas relativas del usuario (`--config`,
 * `--wiki`, `--out`).
 */
import { homedir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

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

/** Raíz del paquete del CLI (`src/context.ts` y `dist/index.js` cuelgan de ella). */
export const PACKAGE_ROOT = path.resolve(fileURLToPath(new URL("..", import.meta.url)));

/** true si `target` es `base` o cuelga de `base`. */
function isInside(base: string, target: string): boolean {
  const rel = path.relative(base, target);
  return rel === "" || (!rel.startsWith("..") && !path.isAbsolute(rel));
}

/** Directorio desde el que el usuario invocó el comando (reglas 2 y 3 de arriba). */
export function invocationCwd(
  env: Record<string, string | undefined> = process.env,
  cwd: string = process.cwd(),
  packageRoot: string = PACKAGE_ROOT,
): string {
  const init = (env["INIT_CWD"] ?? "").trim();
  // Fuera del paquete, `process.cwd()` ya es el directorio del usuario: un
  // INIT_CWD heredado de otro `pnpm run` no debe pisarlo.
  if (init !== "" && isInside(packageRoot, cwd)) return init;
  return cwd;
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
