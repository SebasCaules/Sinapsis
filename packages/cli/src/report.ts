/** Resúmenes que imprimen `sync` y `status`. */
import pc from "picocolors";
import {
  DIVISION_NONE,
  divisionLong,
  type Page,
  type PageMeta,
  type SubjectConfig,
} from "@sinapsis/contract";
import type { Ctx } from "./context.js";

type AnyPage = Pick<Page | PageMeta, "type" | "division">;

export function heading(ctx: Ctx, config: SubjectConfig): void {
  ctx.out(
    `${pc.bold(config.name)} ${pc.dim(`· ${config.code} · ${config.institution}`)} ${pc.dim(`[${config.slug}]`)}`,
  );
}

/** Conteo de páginas por tipo, en el orden declarado en `pageTypes`. */
export function countsByType(ctx: Ctx, config: SubjectConfig, pages: readonly AnyPage[]): void {
  ctx.out(pc.bold("  por tipo"));
  const counted = new Set<string>();
  for (const type of config.pageTypes) {
    const n = pages.filter((p) => p.type === type.key).length;
    counted.add(type.key);
    ctx.out(`    ${pad(type.plural, 22)} ${String(n).padStart(4)}${type.countsAsContent ? "" : pc.dim("  (no cuenta)")}`);
  }
  const others = new Map<string, number>();
  for (const page of pages) {
    if (counted.has(page.type)) continue;
    others.set(page.type, (others.get(page.type) ?? 0) + 1);
  }
  for (const [type, n] of [...others].sort((a, b) => a[0].localeCompare(b[0], "es"))) {
    const label = type === DIVISION_NONE ? "Meta (índice, registro)" : type;
    const mark = type === DIVISION_NONE ? pc.dim("") : pc.yellow("  (sin declarar)");
    ctx.out(`    ${pad(label, 22)} ${String(n).padStart(4)}${mark}`);
  }
}

/** Conteo de páginas por división, en el orden declarado en `divisions`. */
export function countsByDivision(ctx: Ctx, config: SubjectConfig, pages: readonly AnyPage[]): void {
  ctx.out(pc.bold("  por división"));
  const counted = new Set<string>();
  const empty: string[] = [];
  for (const division of config.divisions) {
    const n = pages.filter((p) => p.division === division.key).length;
    counted.add(division.key);
    if (n === 0) empty.push(division.key);
    const line = `    ${pad(divisionLong(config, division.key), 44)} ${String(n).padStart(4)}`;
    ctx.out(n === 0 ? pc.yellow(line) : line);
  }

  const meta = pages.filter((p) => p.division === DIVISION_NONE).length;
  if (meta > 0) ctx.out(`    ${pad("Transversales (toda la materia)", 44)} ${String(meta).padStart(4)}`);

  const others = new Map<string, number>();
  for (const page of pages) {
    if (counted.has(page.division) || page.division === DIVISION_NONE) continue;
    others.set(page.division, (others.get(page.division) ?? 0) + 1);
  }
  for (const [key, n] of [...others].sort((a, b) => a[0].localeCompare(b[0], "es"))) {
    ctx.out(pc.yellow(`    ${pad(`${key} (no está en config.divisions)`, 44)} ${String(n).padStart(4)}`));
  }

  if (empty.length > 0) {
    ctx.out(pc.yellow(`    divisiones sin páginas: ${empty.join(", ")}`));
  }
}

export function warnings(ctx: Ctx, lines: readonly string[], limit = Number.POSITIVE_INFINITY): void {
  if (lines.length === 0) {
    ctx.out(`  ${pc.green("sin advertencias")}`);
    return;
  }
  ctx.out(pc.bold(pc.yellow(`  ${lines.length} advertencia(s)`)));
  const shown = lines.slice(0, limit);
  for (const line of shown) ctx.out(pc.yellow(`    ${line}`));
  if (lines.length > shown.length) {
    ctx.out(pc.dim(`    … y ${lines.length - shown.length} más`));
  }
}

function pad(text: string, width: number): string {
  return text.length >= width ? text : text + " ".repeat(width - text.length);
}
