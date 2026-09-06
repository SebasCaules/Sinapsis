/** `sinapsis validate` — valida el `sinapsis.config.json` y el material de estudio. */
import { readFile } from "node:fs/promises";
import path from "node:path";
import pc from "picocolors";
import {
  BUILTIN_VIEWS,
  DIVISION_NONE,
  SubjectConfig,
  isExternalUrl,
  type SubjectConfig as SubjectConfigType,
} from "@sinapsis/contract";
import { compileStudy, formatIssues, isInside } from "@sinapsis/markdown";
import { resolveUserPath, type Ctx } from "../context.js";
import { studyLine } from "../report.js";

export interface ValidateOptions {
  config?: string;
}

export const DEFAULT_CONFIG = "sinapsis.config.json";

/** Lee y valida un config; devuelve `null` (y ya imprimió el error) si no sirve. */
export async function loadConfig(
  ctx: Ctx,
  file: string,
): Promise<{ config: SubjectConfigType; path: string } | null> {
  const configPath = resolveUserPath(ctx, file);
  let raw: string;
  try {
    raw = await readFile(configPath, "utf8");
  } catch {
    ctx.err(pc.red(`No encuentro el config: ${configPath}`));
    ctx.err(pc.dim("Indicá otro con --config <file>, o creá uno con `sinapsis init`."));
    return null;
  }

  let json: unknown;
  try {
    json = JSON.parse(raw) as unknown;
  } catch (cause) {
    ctx.err(pc.red(`${configPath} no es JSON válido:`));
    ctx.err(`  ${cause instanceof Error ? cause.message : String(cause)}`);
    return null;
  }

  const parsed = SubjectConfig.safeParse(json);
  if (!parsed.success) {
    ctx.err(pc.red(`${configPath} no cumple el contrato:`));
    for (const issue of parsed.error.issues) {
      ctx.err(`  ${pc.bold(issue.path.join(".") || "(raíz)")}: ${issue.message}`);
    }
    return null;
  }

  return { config: parsed.data, path: configPath };
}

export async function runValidate(opts: ValidateOptions, ctx: Ctx): Promise<number> {
  const loaded = await loadConfig(ctx, opts.config ?? DEFAULT_CONFIG);
  if (!loaded) return 1;

  const problems = extraChecks(loaded.config);
  const errors = problems.filter((p) => p.level === "error");
  const warnings = problems.filter((p) => p.level === "warning");

  if (errors.length > 0) {
    ctx.err(pc.red(`${loaded.path} tiene ${errors.length} problema(s):`));
    for (const problem of errors) ctx.err(`  ${pc.bold(problem.field)}: ${problem.message}`);
    return 1;
  }

  ctx.out(pc.green(`Config válido: ${loaded.path}`));
  ctx.out(
    `  ${loaded.config.slug} · ${loaded.config.name} · ${loaded.config.divisions.length} ${loaded.config.division.plural.toLowerCase()} · ${loaded.config.pageTypes.length} tipo(s) de página`,
  );

  // Material de estudio: mismas advertencias que en `sync`, salvo las que
  // necesitan las páginas del wiki (`validate` no lo compila): esas se ven en
  // el dry-run del sync. Y la misma contención que `compileWiki`: `wiki.study`
  // viene del config de la materia (que puede ser de un repositorio ajeno) y no
  // puede apuntar fuera de la carpeta del config.
  const configDir = path.dirname(loaded.path);
  const studyDir = path.resolve(configDir, loaded.config.wiki.study);
  if (!isInside(configDir, studyDir)) {
    ctx.err(pc.red(`wiki.study: "${loaded.config.wiki.study}" queda fuera de la carpeta del config`));
    return 1;
  }
  const { study, issues } = await compileStudy({ dir: studyDir, config: loaded.config });
  studyLine(ctx, study);
  const studyWarnings = formatIssues(issues);
  for (const line of studyWarnings) ctx.out(pc.yellow(`  aviso · ${line}`));
  if (studyWarnings.length > 0) {
    ctx.out(pc.dim("  (las referencias a páginas se verifican en `sinapsis sync --dry-run`)"));
  }

  for (const problem of warnings) {
    ctx.out(pc.yellow(`  aviso · ${problem.field}: ${problem.message}`));
  }
  return 0;
}

interface Problem {
  level: "error" | "warning";
  field: string;
  message: string;
}

/** Reglas que zod no puede expresar: unicidad de claves y coherencia del rail. */
export function extraChecks(config: SubjectConfigType): Problem[] {
  const problems: Problem[] = [];

  const keyGroups: Array<[field: string, keys: string[]]> = [
    ["divisions", config.divisions.map((d) => d.key)],
    ["pageTypes", config.pageTypes.map((t) => t.key)],
    ["rail", config.rail.map((g) => g.id)],
  ];
  for (const [field, keys] of keyGroups) {
    const seen = new Set<string>();
    for (const key of keys) {
      if (seen.has(key)) {
        problems.push({ level: "error", field, message: `clave repetida "${key}"` });
      }
      seen.add(key);
    }
  }

  if (config.divisions.some((d) => d.key === DIVISION_NONE)) {
    problems.push({
      level: "error",
      field: "divisions",
      message: `"${DIVISION_NONE}" está reservada para las páginas transversales`,
    });
  }

  const folders = config.pageTypes.map((t) => t.folder).filter((f): f is string => Boolean(f));
  const seenFolders = new Set<string>();
  for (const folder of folders) {
    if (seenFolders.has(folder)) {
      problems.push({ level: "error", field: "pageTypes", message: `carpeta repetida "${folder}"` });
    }
    seenFolders.add(folder);
  }

  const railItems: Array<{ item: { kind: string; target: string }; id?: string; where: string }> = [
    ...config.rail.flatMap((group) =>
      group.items.map((item) => ({ item, id: item.id, where: `rail.${group.id}.${item.id}` })),
    ),
    ...(config.fab ? [{ item: config.fab, where: "fab" }] : []),
  ];
  const itemIds = new Set<string>();
  for (const { item, id, where } of railItems) {
    if (id !== undefined) {
      if (itemIds.has(id)) {
        problems.push({ level: "error", field: where, message: `id de ítem repetido "${id}"` });
      }
      itemIds.add(id);
    }
    if (item.kind === "builtin" && !(BUILTIN_VIEWS as readonly string[]).includes(item.target)) {
      problems.push({
        level: "error",
        field: where,
        message: `vista builtin desconocida "${item.target}" (válidas: ${BUILTIN_VIEWS.join(", ")})`,
      });
    }
    if (item.kind === "link" && !isExternalUrl(item.target)) {
      problems.push({
        level: "error",
        field: where,
        message: `un ítem "link" necesita una URL http(s) o mailto`,
      });
    }
    if (item.kind === "tool") {
      problems.push({
        level: "warning",
        field: where,
        message: `las herramientas propias son del Sprint 3; hasta entonces se muestra "Próximamente"`,
      });
    }
  }

  const placeholders = (["name", "code", "institution", "semester"] as const).filter(
    (field) => config[field] === "COMPLETAR",
  );
  if (placeholders.length > 0) {
    problems.push({
      level: "warning",
      field: placeholders.join(", "),
      message: 'todavía dice "COMPLETAR"',
    });
  }

  return problems;
}
