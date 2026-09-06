/** Resúmenes que imprimen `sync`, `status` y `validate`. */
import pc from "picocolors";
import {
  DIVISION_NONE,
  PAGE_TYPE_META,
  divisionLong,
  plural,
  routes,
  type Page,
  type PageMeta,
  type StudyContent,
  type SubjectConfigLoose,
} from "@sinapsis/contract";
import { isEmptyStudy, studyCounts } from "@sinapsis/markdown";
import { ApiError } from "./api.js";
import type { Ctx } from "./context.js";

type AnyPage = Pick<Page | PageMeta, "type" | "division">;
type AnyConfig = Pick<SubjectConfigLoose, "slug" | "name" | "code" | "institution" | "division" | "divisions" | "pageTypes">;

/** Base de la web para los enlaces finales cuando no hay bandera ni entorno. */
export const DEFAULT_WEB = "http://localhost:5173";

export function heading(ctx: Ctx, config: AnyConfig): void {
  ctx.out(
    `${pc.bold(config.name)} ${pc.dim(`· ${config.code} · ${config.institution}`)} ${pc.dim(`[${config.slug}]`)}`,
  );
}

/**
 * Un bloque de conteos: primero las claves declaradas en el config (en su
 * orden), después las que aparecen en las páginas sin estar declaradas.
 */
interface CountsSpec<T> {
  /** Título del bloque ("por tipo", "por división"). */
  title: string;
  /** Claves declaradas, en el orden del config. */
  declared: readonly T[];
  key: (item: T) => string;
  /** Rótulo y ancho de la columna izquierda. */
  label: (item: T) => string;
  width: number;
  /** Campo de la página que se compara con la clave. */
  of: (page: AnyPage) => string;
  /** Sufijo opcional de una fila declarada (p. ej. "(no cuenta)"). */
  note?: (item: T, n: number) => string;
  /** ¿La fila declarada se destaca cuando quedó en cero? */
  highlightEmpty?: boolean;
  /** Rótulo de una clave que no está en el config (null = no se lista aparte). */
  extraLabel: (key: string) => { label: string; mark: string; warn: boolean } | null;
  /** Línea final opcional a partir de las claves declaradas que quedaron vacías. */
  footer?: (empty: string[]) => string | null;
}

function counts<T>(ctx: Ctx, pages: readonly AnyPage[], spec: CountsSpec<T>): void {
  ctx.out(pc.bold(`  ${spec.title}`));

  const declared = new Set<string>();
  const empty: string[] = [];
  for (const item of spec.declared) {
    const key = spec.key(item);
    declared.add(key);
    const n = pages.filter((p) => spec.of(p) === key).length;
    if (n === 0) empty.push(key);
    const line = `    ${pad(spec.label(item), spec.width)} ${String(n).padStart(4)}${spec.note?.(item, n) ?? ""}`;
    ctx.out(spec.highlightEmpty && n === 0 ? pc.yellow(line) : line);
  }

  const others = new Map<string, number>();
  for (const page of pages) {
    const key = spec.of(page);
    if (declared.has(key)) continue;
    others.set(key, (others.get(key) ?? 0) + 1);
  }
  for (const [key, n] of [...others].sort((a, b) => a[0].localeCompare(b[0], "es"))) {
    const extra = spec.extraLabel(key);
    if (!extra) continue;
    const line = `    ${pad(extra.label, spec.width)} ${String(n).padStart(4)}${extra.mark}`;
    ctx.out(extra.warn ? pc.yellow(line) : line);
  }

  const footer = spec.footer?.(empty);
  if (footer) ctx.out(pc.yellow(footer));
}

/** Conteo de páginas por tipo, en el orden declarado en `pageTypes`. */
export function countsByType(ctx: Ctx, config: AnyConfig, pages: readonly AnyPage[]): void {
  counts(ctx, pages, {
    title: "por tipo",
    declared: config.pageTypes,
    key: (t) => t.key,
    label: (t) => t.plural,
    width: 22,
    of: (p) => p.type,
    note: (t) => (t.countsAsContent ? "" : pc.dim("  (no cuenta)")),
    extraLabel: (key) =>
      key === PAGE_TYPE_META
        ? { label: "Meta (índice, registro)", mark: "", warn: false }
        : { label: key, mark: pc.yellow("  (sin declarar)"), warn: false },
  });
}

/** Conteo de páginas por división, en el orden declarado en `divisions`. */
export function countsByDivision(ctx: Ctx, config: AnyConfig, pages: readonly AnyPage[]): void {
  counts(ctx, pages, {
    title: "por división",
    declared: config.divisions,
    key: (d) => d.key,
    label: (d) => divisionLong(config, d.key),
    width: 44,
    of: (p) => p.division,
    highlightEmpty: true,
    extraLabel: (key) =>
      key === DIVISION_NONE
        ? { label: "Transversales (toda la materia)", mark: "", warn: false }
        : { label: `${key} (no está en config.divisions)`, mark: "", warn: true },
    footer: (empty) => (empty.length > 0 ? `    divisiones sin páginas: ${empty.join(", ")}` : null),
  });
}

/**
 * Una línea con el material de estudio (`wiki.study`). La imprimen igual `sync`
 * (desde lo compilado), `validate` (ídem, sin verificar slugs) y `status` (desde
 * lo que devuelve el API), para poder compararlas de un vistazo.
 */
export function studyLine(ctx: Ctx, study: StudyContent): void {
  if (isEmptyStudy(study)) {
    ctx.out(
      `  ${pc.bold("Estudio")}: ${pc.dim("sin material propio (la plataforma genera un mazo por división)")}`,
    );
    return;
  }
  const n = studyCounts(study);
  ctx.out(
    `  ${pc.bold("Estudio")}: ${n.decks} ${plural(n.decks, "mazo", "mazos")} (${n.cards} ${plural(n.cards, "tarjeta", "tarjetas")})` +
      ` · ${n.quizzes} ${plural(n.quizzes, "quiz", "quizzes")} (${n.questions} ${plural(n.questions, "pregunta", "preguntas")})` +
      ` · plan: ${n.phases === 0 ? "no" : `${n.phases} ${plural(n.phases, "fase", "fases")}`}` +
      ` · ${n.kits} ${plural(n.kits, "kit", "kits")}`,
  );

  // Modalidades del plan (`Plan.tracks`): qué ve el usuario en el conmutador y
  // cuántas fases trae cada una. La primera es la que se muestra por defecto.
  const tracks = study.plan?.tracks ?? [];
  if (tracks.length > 0) {
    const list = tracks
      .map((t) => `${t.label} (${t.phases.length} ${plural(t.phases.length, "fase", "fases")})`)
      .join(" · ");
    ctx.out(`  ${pc.bold("Modalidades")}: ${list}`);
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

/** Enlace a la materia en la web: bandera `--web`, `SINAPSIS_WEB` o el valor por defecto. */
export function webUrl(ctx: Ctx, flag: string | undefined, slug: string): string {
  const base = flag ?? ctx.env["SINAPSIS_WEB"] ?? DEFAULT_WEB;
  return `${base.replace(/\/+$/, "")}${routes.subject(slug)}`;
}

/** Qué decir ante un status HTTP concreto. */
export interface ApiErrorHint {
  /** Reemplaza el encabezado rojo. */
  headline?: string;
  /** Líneas en gris debajo del encabezado. */
  hints?: readonly string[];
}

/** Pistas propias de cada comando para `reportApiError`. */
export interface ApiErrorHints {
  /** Encabezado por defecto. Sin él: «No se pudo consultar <api>: <mensaje>». */
  headline?: (api: string, message: string) => string;
  /** Por status HTTP: `sync` y `status` cuentan cosas distintas ante un 401. */
  byStatus?: Record<number, ApiErrorHint>;
}

/**
 * Informa un fallo contra el API y devuelve el código de salida (siempre 1).
 * Único lugar donde se decide el formato: encabezado rojo, pistas en gris y,
 * cuando ni siquiera hubo respuesta, el recordatorio de levantar el API.
 */
export function reportApiError(ctx: Ctx, api: string, cause: unknown, extraHints: ApiErrorHints = {}): number {
  if (!(cause instanceof ApiError)) {
    ctx.err(pc.red(cause instanceof Error ? cause.message : String(cause)));
    return 1;
  }

  const hint = cause.status === undefined ? undefined : extraHints.byStatus?.[cause.status];
  const fallback = extraHints.headline ?? ((base, message) => `No se pudo consultar ${base}: ${message}`);
  ctx.err(pc.red(hint?.headline ?? fallback(api, cause.message)));
  for (const line of hint?.hints ?? []) ctx.err(pc.dim(line));

  if (cause.status === undefined) {
    ctx.err(pc.dim("¿Está corriendo el API? `pnpm dev:api` en el repo de Sinapsis."));
  }
  return 1;
}

function pad(text: string, width: number): string {
  return text.length >= width ? text : text + " ".repeat(width - text.length);
}
