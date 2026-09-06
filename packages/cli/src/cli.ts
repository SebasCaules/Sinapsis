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
import { runPropose } from "./commands/propose.js";
import { runPublish } from "./commands/publish.js";
import { runSiteBuild } from "./commands/site.js";
import { runStatus } from "./commands/status.js";
import { runToolsBuild, runToolsList } from "./commands/tools.js";
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
    .description("Compila el wiki de una materia y lo publica en la plataforma Sinapsis.")
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
    .command("publish")
    .description("Compila la materia y abre un PR con `subjects/<slug>/` en el repo de la plataforma.")
    .option("--config <file>", "ruta del config", "sinapsis.config.json")
    .option("--wiki <dir>", "sobreescribe wiki.root del config (ruta absoluta o relativa)")
    .option("--repo <dir>", "repositorio de la plataforma (o SINAPSIS_HOME)")
    .option("--dry-run", "compila y muestra el resumen sin tocar el repositorio", false)
    .option("--out <file>", "escribe el SyncPayload compilado en un archivo")
    .option("--no-pr", "deja la rama local: no empuja ni abre PR")
    .option("--branch <nombre>", "nombre de la rama (por defecto subject/<slug>-<AAAAMMDD>)")
    .action(async (opts: Parameters<typeof runPublish>[0]) => {
      code = await runPublish(opts, ctx);
    });

  // Alias oculto de compatibilidad: `sync` era el nombre del comando mientras
  // hubo API. Hace exactamente lo mismo que `publish` y lo avisa.
  program
    .command("sync", { hidden: true })
    .description("Alias de `publish` (compatibilidad).")
    .option("--config <file>", "ruta del config", "sinapsis.config.json")
    .option("--wiki <dir>", "sobreescribe wiki.root del config (ruta absoluta o relativa)")
    .option("--repo <dir>", "repositorio de la plataforma (o SINAPSIS_HOME)")
    .option("--dry-run", "compila y muestra el resumen sin tocar el repositorio", false)
    .option("--out <file>", "escribe el SyncPayload compilado en un archivo")
    .option("--no-pr", "deja la rama local: no empuja ni abre PR")
    .option("--branch <nombre>", "nombre de la rama (por defecto subject/<slug>-<AAAAMMDD>)")
    .action(async (opts: Parameters<typeof runPublish>[0]) => {
      code = await runPublish({ ...opts, legacy: true }, ctx);
    });

  const site = program.command("site").description("El sitio estático de la plataforma.");

  site
    .command("build")
    .description("Compila las materias de `subjects/` a los archivos JSON que lee la web.")
    .option("--subjects <dir>", "carpeta con las materias fuente", "subjects")
    .option("--out <dir>", "carpeta de salida", "apps/web/public/subjects")
    .option("--only <slug>", "compila una sola materia")
    .option("--strict", "las advertencias también hacen fallar el build", false)
    .action(async (opts: Parameters<typeof runSiteBuild>[0]) => {
      code = await runSiteBuild(opts, ctx);
    });

  program
    .command("propose")
    .description("Propone un cambio a la plataforma en una rama del repo de Sinapsis (docs/PROPOSALS.md).")
    .requiredOption("--subject <slug>", "materia que propone")
    .requiredOption("--title <texto>", "qué se propone, en una línea")
    .requiredOption("--body <texto>", "por qué hace falta y por qué no se resuelve en la materia")
    .option("--files <a,b>", "archivos cambiados que la materia declara (por defecto, todos los modificados)")
    .option("--compat <texto>", "texto de la sección «Compatibilidad»")
    .option("--skip-gates", "no corre typecheck/test/build (solo para propuestas de documentación)", false)
    .option("--repo <dir>", "repositorio de la plataforma (o SINAPSIS_HOME)")
    .action(async (opts: Parameters<typeof runPropose>[0]) => {
      code = await runPropose(opts, ctx);
    });

  const tools = program
    .command("tools")
    .description("Bundles de herramientas y figuras de la materia (<config>/tools).");

  tools
    .command("build")
    .description("Valida y empaqueta los bundles; escribe dist/tool-push.json.")
    .option("--config <file>", "ruta del config", "sinapsis.config.json")
    .option("--dir <dir>", "carpeta del bundle o de los bundles (por defecto <config>/tools)")
    .option("--minify", "minifica los scripts en .dist/ y empaqueta esa versión", false)
    .option("--out <file>", "dónde escribir el ToolPush (solo con un bundle)")
    .action(async (opts: Parameters<typeof runToolsBuild>[0]) => {
      code = await runToolsBuild(opts, ctx);
    });

  tools
    .command("list")
    .description("Muestra los bundles que la materia tiene publicados en el repo de la plataforma.")
    .option("--config <file>", "ruta del config", "sinapsis.config.json")
    .option("--repo <dir>", "repositorio de la plataforma (o SINAPSIS_HOME)")
    .action(async (opts: Parameters<typeof runToolsList>[0]) => {
      code = await runToolsList(opts, ctx);
    });

  program
    .command("status")
    .description("Compara el vault local con lo publicado en `<repo>/subjects/<slug>/`.")
    .option("--config <file>", "ruta del config", "sinapsis.config.json")
    .option("--wiki <dir>", "sobreescribe wiki.root del config (ruta absoluta o relativa)")
    .option("--repo <dir>", "repositorio de la plataforma (o SINAPSIS_HOME)")
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
