/**
 * `sinapsis` — CLI de la plataforma.
 *
 * Las rutas relativas (`--config`, `--wiki`, `--out`) se resuelven contra el
 * directorio desde el que se invocó el comando, no contra el del paquete: así
 * funciona igual con `pnpm sinapsis -- …` desde la raíz del repo que con
 * `pnpm --dir $SINAPSIS_HOME sinapsis -- …` desde el repo de una materia
 * (ver `context.ts`). `--cwd <dir>` fuerza ese directorio y gana sobre todo.
 */
import { Command, CommanderError } from "commander";
import pc from "picocolors";
import { runInit } from "./commands/init.js";
import { runStatus } from "./commands/status.js";
import { runSync } from "./commands/sync.js";
import { runValidate } from "./commands/validate.js";
import { defaultCtx, resolveUserPath, type Ctx } from "./context.js";
import { VERSION } from "./version.js";

/** Quita el `--` suelto que puede dejar `pnpm run <script> -- <args>`. */
export function cleanArgv(argv: readonly string[]): string[] {
  const args = [...argv];
  while (args[0] === "--") args.shift();
  return args;
}

/**
 * Saca `--cwd <dir>` / `--cwd=<dir>` de cualquier posición de la línea de
 * comandos. Se procesa antes que commander para que la bandera valga igual
 * delante del subcomando (`sinapsis --cwd . sync`) que detrás
 * (`sinapsis sync --cwd .`). Si aparece varias veces, gana la última.
 */
export function extractCwd(argv: readonly string[]): { cwd?: string; rest: string[] } {
  const rest: string[] = [];
  let cwd: string | undefined;
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i] ?? "";
    if (arg === "--cwd") {
      const value = argv[i + 1];
      if (value !== undefined) {
        cwd = value;
        i += 1;
        continue;
      }
    }
    if (arg.startsWith("--cwd=")) {
      cwd = arg.slice("--cwd=".length);
      continue;
    }
    rest.push(arg);
  }
  return cwd === undefined ? { rest } : { cwd, rest };
}

export async function main(argv: readonly string[], ctx: Ctx = defaultCtx()): Promise<number> {
  let code = 0;

  const { cwd, rest } = extractCwd(cleanArgv(argv));
  if (cwd !== undefined) {
    if (cwd.trim() === "") {
      ctx.err(pc.red("--cwd necesita un directorio."));
      return 1;
    }
    ctx.cwd = resolveUserPath(ctx, cwd);
  }

  const program = new Command();
  program
    .name("sinapsis")
    .description("Compila y sincroniza el wiki de una materia con la plataforma Sinapsis.")
    .version(VERSION, "-v, --version")
    .option(
      "--cwd <dir>",
      "directorio base de las rutas relativas (por defecto: el de invocación; se admite en cualquier posición)",
    )
    .exitOverride()
    .showHelpAfterError()
    .configureOutput({
      writeOut: (str) => ctx.out(str.replace(/\n$/, "")),
      writeErr: (str) => ctx.err(str.replace(/\n$/, "")),
    });

  program
    .command("init")
    .description("Propone un sinapsis.config.json a partir del wiki de la materia.")
    .option("--wiki <dir>", "carpeta raíz del wiki", "wiki")
    .option("--out <file>", "dónde escribir el config", "sinapsis.config.json")
    .option("--slug <slug>", "slug de la materia (por defecto, el nombre de la carpeta)")
    .option("--force", "sobreescribir el config si ya existe", false)
    .action(async (opts: Parameters<typeof runInit>[0]) => {
      code = await runInit(opts, ctx);
    });

  program
    .command("validate")
    .description("Valida el sinapsis.config.json contra el contrato.")
    .option("--config <file>", "ruta del config", "sinapsis.config.json")
    .action(async (opts: Parameters<typeof runValidate>[0]) => {
      code = await runValidate(opts, ctx);
    });

  program
    .command("sync")
    .description("Compila el wiki y lo sincroniza con el API.")
    .option("--config <file>", "ruta del config", "sinapsis.config.json")
    .option("--wiki <dir>", "sobreescribe wiki.root del config (ruta absoluta o relativa)")
    .option("--api <url>", "base del API (o SINAPSIS_API)")
    .option("--token <token>", "token de sync (o SINAPSIS_TOKEN / SYNC_TOKEN)")
    .option("--dry-run", "compila y muestra el resumen sin llamar al API", false)
    .option("--out <file>", "escribe el SyncPayload compilado en un archivo")
    .option("--web <url>", "base de la web para el enlace final (o SINAPSIS_WEB)")
    .action(async (opts: Parameters<typeof runSync>[0]) => {
      code = await runSync(opts, ctx);
    });

  program
    .command("status")
    .description("Muestra el estado de la materia en la plataforma.")
    .option("--config <file>", "ruta del config", "sinapsis.config.json")
    .option("--api <url>", "base del API (o SINAPSIS_API)")
    .option("--token <token>", "token (o SINAPSIS_TOKEN / SYNC_TOKEN)")
    .option("--web <url>", "base de la web para el enlace final (o SINAPSIS_WEB)")
    .action(async (opts: Parameters<typeof runStatus>[0]) => {
      code = await runStatus(opts, ctx);
    });

  try {
    await program.parseAsync(rest, { from: "user" });
  } catch (cause) {
    if (cause instanceof CommanderError) {
      // `--help` y `--version` ya escribieron su salida.
      return cause.code === "commander.helpDisplayed" || cause.code === "commander.version" ? 0 : 1;
    }
    ctx.err(pc.red(cause instanceof Error ? cause.message : String(cause)));
    return 1;
  }

  return code;
}
