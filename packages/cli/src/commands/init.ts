/** `sinapsis init` — propone un `sinapsis.config.json` a partir del wiki. */
import { writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import pc from "picocolors";
import { SubjectConfig } from "@sinapsis/contract";
import { inspectWiki, isDirectory, pendingFields, scaffoldConfig, TODO } from "@sinapsis/markdown";
import { resolveUserPath, type Ctx } from "../context.js";

export interface InitOptions {
  wiki?: string;
  out?: string;
  slug?: string;
  force?: boolean;
}

export async function runInit(opts: InitOptions, ctx: Ctx): Promise<number> {
  const wikiDir = resolveUserPath(ctx, opts.wiki ?? "wiki");
  if (!(await isDirectory(wikiDir))) {
    ctx.err(pc.red(`No encuentro la carpeta del wiki: ${wikiDir}`));
    ctx.err(pc.dim("Indicá otra con --wiki <dir>."));
    return 1;
  }

  const outFile = resolveUserPath(ctx, opts.out ?? "sinapsis.config.json");
  if (existsSync(outFile) && !opts.force) {
    ctx.err(pc.red(`Ya existe ${outFile}.`));
    ctx.err(pc.dim("Usá --force para sobreescribirlo o --out <file> para escribir en otro lado."));
    return 1;
  }

  const survey = await inspectWiki(wikiDir);
  if (survey.pages === 0) {
    ctx.err(pc.red(`No hay páginas .md en las carpetas de ${wikiDir}.`));
    ctx.err(pc.dim("El compilador solo recorre el primer nivel de cada carpeta del wiki."));
    return 1;
  }

  const draft = await scaffoldConfig({
    wikiDir,
    ...(opts.slug ? { slug: opts.slug } : {}),
    configDir: path.dirname(outFile),
    survey,
  });

  const parsed = SubjectConfig.safeParse(draft);
  if (!parsed.success) {
    ctx.err(pc.red("El config inferido no valida contra el contrato:"));
    for (const issue of parsed.error.issues) {
      ctx.err(`  ${pc.bold(issue.path.join(".") || "(raíz)")}: ${issue.message}`);
    }
    return 1;
  }

  await writeFile(outFile, `${JSON.stringify(draft, null, 2)}\n`, "utf8");

  // ---- informe -------------------------------------------------------------
  ctx.out(pc.green(`Config escrito en ${outFile}`));
  ctx.out("");
  ctx.out(`  wiki: ${pc.dim(wikiDir)}`);
  ctx.out(`  páginas: ${survey.pages} en ${survey.folders.length} carpeta(s)`);
  ctx.out(pc.bold("  tipos de página inferidos (de las carpetas)"));
  for (const type of draft.pageTypes) {
    const folder = type.folder ?? "—";
    const count = survey.folders.find((f) => f.folder === folder)?.pages ?? 0;
    ctx.out(`    ${type.key.padEnd(16)} ${String(count).padStart(4)}  ${pc.dim(`${folder}/`)}`);
  }
  ctx.out(
    pc.bold(
      `  campo de división: ${pc.reset(pc.cyan(survey.divisionField))} ${pc.dim(
        `(${survey.divisionFieldHits} de ${survey.pages} páginas lo declaran)`,
      )}`,
    ),
  );
  for (const division of survey.divisions) {
    const def = draft.divisions.find((d) => d.key === division.key);
    ctx.out(`    ${division.key.padEnd(8)} ${String(division.count).padStart(4)}  ${pc.dim(def?.name ?? "")}`);
  }
  if (survey.withoutSummary > 0) {
    ctx.out(pc.yellow(`  ${survey.withoutSummary} página(s) sin "resumen" (afecta tooltips y tarjetas)`));
  }

  ctx.out("");
  ctx.out(pc.bold("Qué falta completar a mano:"));
  const pending = pendingFields(draft);
  if (pending.length > 0) {
    ctx.out(`  · ${pending.join(", ")} — hoy dicen "${TODO}".`);
  }
  ctx.out(`  · divisions[].name — reemplazá los nombres provisorios por los del programa.`);
  ctx.out(`  · division — nomenclatura (${draft.division.singular}/${draft.division.abbr}/${draft.division.plural}).`);
  ctx.out(`  · rail — grupos slot con las herramientas de la materia (queda vacío).`);
  ctx.out(`  · color — opcional: token --u1…--u9 o hex #rrggbb.`);
  ctx.out("");
  ctx.out(pc.dim(`Después: sinapsis validate --config ${relative(ctx, outFile)}`));
  ctx.out(pc.dim(`Y luego: sinapsis sync --config ${relative(ctx, outFile)} --dry-run`));
  return 0;
}

function relative(ctx: Ctx, target: string): string {
  const rel = path.relative(ctx.cwd, target);
  return rel === "" || rel.startsWith("..") ? target : rel;
}
