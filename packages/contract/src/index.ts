/**
 * @sinapsis/contract — el contrato entre la plataforma y cada materia.
 *
 * Tres piezas, en orden de estabilidad:
 *  1. SubjectConfig  → lo que declara cada materia en su `sinapsis.config.json`
 *                      (hero, nomenclatura de división, tipos de página, rail, fab).
 *  2. Page           → lo que emite el compilador del wiki por cada página markdown
 *                      (mismo contrato que `build.py` de la app de Proba, con
 *                      `unidad` renombrado a `division`).
 *  3. SyncPayload / DTOs de la API → lo que viaja por HTTP.
 *
 * Todo está definido con zod para validar en el borde (CLI y API) y derivar los
 * tipos TypeScript de una sola fuente.
 */
import { z } from "zod";

// ---------------------------------------------------------------------------
// Primitivas
// ---------------------------------------------------------------------------

/** Slug URL-safe: minúsculas, dígitos y guiones. Se usa para materias y páginas. */
export const Slug = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9][a-z0-9-]*$/, "slug: solo minúsculas, dígitos y guiones");
export type Slug = z.infer<typeof Slug>;

/** Clave de división: "1".."9", "0", "eval", "meta", "s01"… Libre pero corta. */
export const DivisionKey = z.string().min(1).max(24).regex(/^[a-z0-9_-]+$/i);
export type DivisionKey = z.infer<typeof DivisionKey>;

/** Color de materia o de grupo: hex (#rrggbb) o token del design system (--u3). */
export const ColorRef = z
  .string()
  .regex(/^(#[0-9a-fA-F]{6}|--[a-z0-9-]+)$/, "color: hex #rrggbb o token --nombre");
export type ColorRef = z.infer<typeof ColorRef>;

export const ThemeId = z.enum(["pergamino", "laurel", "claustro"]);
export type ThemeId = z.infer<typeof ThemeId>;

/** Iconos disponibles en el rail (registro cerrado, lo dibuja la plataforma). */
export const IconName = z.enum([
  "home", "map", "grid", "book", "sigma", "graph", "cards", "quiz", "pencil", "timer",
  "function", "calc", "compass", "layers", "notebook", "star", "list", "clock",
  "square", "circle", "diamond", "line", "triangle", "flask", "chart", "table",
  "link", "tool", "sparkle", "wrench",
]);
export type IconName = z.infer<typeof IconName>;

// ---------------------------------------------------------------------------
// 1. SubjectConfig — sinapsis.config.json
// ---------------------------------------------------------------------------

/** Nomenclatura de la división del temario: Unidad/U/Unidades, Semana/S/Semanas… */
export const DivisionLabel = z.object({
  singular: z.string().min(1).max(32),
  abbr: z.string().min(1).max(6),
  plural: z.string().min(1).max(32),
});
export type DivisionLabel = z.infer<typeof DivisionLabel>;

export const DivisionDef = z.object({
  key: DivisionKey,
  name: z.string().min(1).max(120),
  /** Orden explícito en el índice; si falta, se usa el orden del array. */
  order: z.number().int().optional(),
  /**
   * numbered: cuenta para la numeración "U1, U2…" y para el color paramétrico.
   * extra: divisiones sin número (Complementos, Evaluaciones, Transversales): gris.
   */
  kind: z.enum(["numbered", "extra"]).default("numbered"),
  /** Color fijo opcional; si falta, la plataforma lo deriva del índice (escala paramétrica). */
  color: ColorRef.optional(),
});
export type DivisionDef = z.infer<typeof DivisionDef>;

export const PageTypeDef = z.object({
  key: z
    .string()
    .min(1)
    .max(32)
    .regex(/^[a-z][a-z0-9_-]*$/)
    .refine((k) => k !== "meta", "pageTypes: la clave «meta» está reservada para índice y registro"),
  label: z.string().min(1).max(40),
  plural: z.string().min(1).max(40),
  /** Carpeta del wiki cuyas páginas son de este tipo por defecto (el frontmatter manda). */
  folder: z.string().min(1).max(64).optional(),
  /** false para las "fuentes": no cuentan en el progreso ni en la numeración de lectura. */
  countsAsContent: z.boolean().default(true),
  /** true para plegar el bloque por defecto en el índice (fuentes). */
  collapsedByDefault: z.boolean().default(false),
});
export type PageTypeDef = z.infer<typeof PageTypeDef>;

/**
 * Un ítem del rail. `kind` decide qué abre:
 *  - builtin: una vista de la plataforma (home, wiki, graph…). El id es la vista.
 *  - page:    una página del wiki (target = slug).
 *  - link:    una URL externa (target = url); se abre en pestaña nueva.
 *  - tool:    una herramienta propia de la materia (target = id de la tool).
 *             En el Sprint 1 la plataforma la muestra como "Próximamente".
 */
export const RailItemKind = z.enum(["builtin", "page", "link", "tool"]);
export type RailItemKind = z.infer<typeof RailItemKind>;

/** El `target` depende del `kind`: slug para page, id para tool/builtin, URL http(s)/mailto para link. */
function refineTarget(v: { kind: RailItemKind; target: string }, ctx: z.RefinementCtx) {
  const ok =
    v.kind === "link" ? ExternalUrl.safeParse(v.target).success :
    v.kind === "page" ? Slug.safeParse(v.target).success :
    /^[a-z][a-z0-9_-]{0,47}$/.test(v.target);
  if (!ok) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["target"],
      message: v.kind === "link" ? "link: solo URLs http(s) o mailto" : `target inválido para kind «${v.kind}»`,
    });
  }
}

export const RailItem = z
  .object({
    id: z.string().min(1).max(48).regex(/^[a-z][a-z0-9_-]*$/),
    label: z.string().min(1).max(60),
    icon: IconName,
    kind: RailItemKind,
    target: z.string().min(1).max(400),
    /** Texto corto del tooltip; si falta se usa `label · grupo`. */
    hint: z.string().max(120).optional(),
  })
  .superRefine(refineTarget);
export type RailItem = z.infer<typeof RailItem>;

export const RailGroup = z.object({
  id: z.string().min(1).max(48).regex(/^[a-z][a-z0-9_-]*$/),
  label: z.string().min(1).max(40),
  color: ColorRef.optional(),
  items: z.array(RailItem).min(1).max(8),
});
export type RailGroup = z.infer<typeof RailGroup>;

export const Fab = z
  .object({
    icon: IconName,
    label: z.string().min(1).max(60),
    kind: RailItemKind,
    target: z.string().min(1).max(400),
  })
  .superRefine(refineTarget);
export type Fab = z.infer<typeof Fab>;

/**
 * Ruta relativa segura: sin `..`, sin raíz absoluta, sin `~`. El config de una
 * materia puede venir de un repositorio ajeno: nunca debe poder apuntar fuera
 * de su propia carpeta (el CLI la lee y sube el contenido al API).
 */
export const SafeRelativePath = z
  .string()
  .min(1)
  .max(200)
  .refine((v) => !/^([a-zA-Z]:)?[\\/]/.test(v) && !v.startsWith("~"), "ruta: debe ser relativa")
  .refine((v) => !/(^|[\\/])\.\.([\\/]|$)/.test(v), "ruta: no se admite «..»")
  .refine((v) => !/\0/.test(v), "ruta: carácter inválido");
export type SafeRelativePath = z.infer<typeof SafeRelativePath>;

/** URL externa admitida en los ítems `link`: solo http(s) o mailto. */
export const ExternalUrl = z
  .string()
  .min(1)
  .max(400)
  .refine((v) => /^(https?:\/\/[^\s]+|mailto:[^\s]+)$/i.test(v), "link: solo URLs http(s) o mailto");

export const WikiSource = z.object({
  /** Carpeta raíz del wiki, relativa al config. */
  root: SafeRelativePath.default("wiki"),
  /** Página índice y registro (rutas relativas a root). Opcionales. */
  index: SafeRelativePath.optional(),
  log: SafeRelativePath.optional(),
  /** Carpetas a ignorar dentro de root. */
  ignore: z.array(z.string()).default([]),
  /** Campo del frontmatter que indica la división (por compatibilidad: "unidad" en Proba). */
  divisionField: z.string().default("division"),
});
export type WikiSource = z.infer<typeof WikiSource>;

export const SubjectConfig = z.object({
  /** Versión del contrato que entiende esta materia. */
  contract: z.literal(1).default(1),
  slug: Slug,
  name: z.string().min(1).max(120),
  code: z.string().min(1).max(24),
  institution: z.string().min(1).max(80),
  color: ColorRef.optional(),
  /** Cuatrimestre sugerido para la landing ("2026-1C"); el usuario puede moverla. */
  semester: z.string().max(24).optional(),
  division: DivisionLabel,
  divisions: z.array(DivisionDef).min(1).max(64),
  pageTypes: z.array(PageTypeDef).min(1).max(24),
  /** Grupos SLOT del rail (regiones 03 del contrato). Los grupos FIJOS los dibuja la plataforma. */
  rail: z.array(RailGroup).max(6).default([]),
  fab: Fab.nullable().default(null),
  wiki: WikiSource.default({}),
});
export type SubjectConfig = z.infer<typeof SubjectConfig>;
export type SubjectConfigInput = z.input<typeof SubjectConfig>;

// ---------------------------------------------------------------------------
// 2. Page — lo que emite el compilador del wiki
// ---------------------------------------------------------------------------

export const PageLink = z.object({
  /** Destino tal como está escrito en el wikilink; puede no ser un slug válido (enlace roto). */
  slug: z.string().min(1).max(200),
  anchor: z.string().max(200).optional(),
  text: z.string().max(200).optional(),
});
export type PageLink = z.infer<typeof PageLink>;

export const PageHeading = z.object({
  level: z.number().int().min(1).max(6),
  text: z.string().max(300),
  id: z.string().max(200),
});
export type PageHeading = z.infer<typeof PageHeading>;

/** Clave reservada para páginas sin división (transversales). */
export const DIVISION_NONE = "meta" as const;
/** Clave sintética que agrupa páginas cuya división no está declarada en el config. */
export const DIVISION_OTHER = "otras" as const;
/** Tipo de página reservado para las páginas índice y registro del wiki. */
export const PAGE_TYPE_META = "meta" as const;
/** Slugs reservados de las páginas meta que emite el compilador. */
export const META_PAGES = { index: "indice", log: "log" } as const;

export const Page = z.object({
  slug: Slug,
  title: z.string().min(1).max(200),
  type: z.string().min(1).max(32),
  folder: z.string().max(64).default(""),
  /** Clave de división; DIVISION_NONE si la página es transversal. */
  division: DivisionKey.default(DIVISION_NONE),
  /** Orden pedagógico 1..M dentro de la división (opcional). */
  order: z.number().int().positive().optional(),
  /** 1-2 frases: alimenta tooltips y tarjetas. */
  summary: z.string().max(1200).default(""),
  format: z.string().max(40).optional(),
  tags: z.array(z.string().max(60)).default([]),
  /** Slugs de las fuentes citadas en el frontmatter. */
  sources: z.array(z.string().max(120)).default([]),
  updatedAt: z.string().max(40).optional(),
  links: z.array(PageLink).default([]),
  headings: z.array(PageHeading).default([]),
  /** Markdown crudo (sin frontmatter). */
  body: z.string(),
  words: z.number().int().nonnegative().default(0),
});
export type Page = z.infer<typeof Page>;
export type PageInput = z.input<typeof Page>;

/** Page sin cuerpo: lo que viaja en listados e índices. */
export const PageMeta = Page.omit({ body: true, links: true, headings: true });
export type PageMeta = z.infer<typeof PageMeta>;

// ---------------------------------------------------------------------------
// 3. Sync y DTOs de la API
// ---------------------------------------------------------------------------

export const SyncPayload = z.object({
  config: SubjectConfig,
  pages: z.array(Page).max(20000),
  generatedAt: z.string(),
  /** Identificador de la herramienta que compiló (p. ej. "@sinapsis/cli 0.1.0"). */
  generator: z.string().max(80).optional(),
});
export type SyncPayload = z.infer<typeof SyncPayload>;

export const SyncResult = z.object({
  subject: Slug,
  pages: z.number().int(),
  created: z.number().int(),
  updated: z.number().int(),
  deleted: z.number().int(),
  warnings: z.array(z.string()),
});
export type SyncResult = z.infer<typeof SyncResult>;

/** Usuario autenticado. */
export const User = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  picture: z.string().url().nullable(),
  theme: ThemeId,
});
export type User = z.infer<typeof User>;

/** Materia tal como la ve la landing (config + agregados + posición del usuario). */
export const SubjectCard = z.object({
  slug: Slug,
  name: z.string(),
  code: z.string(),
  institution: z.string(),
  color: ColorRef,
  division: DivisionLabel,
  divisionsCount: z.number().int(),
  pagesCount: z.number().int(),
  studiedCount: z.number().int(),
  /** Cuatrimestre en la landing de este usuario. */
  semester: z.string(),
  position: z.number().int(),
  /** true si la materia todavía no recibió ningún sync (creada a mano desde la landing). */
  placeholder: z.boolean(),
  lastSyncAt: z.string().nullable(),
});
export type SubjectCard = z.infer<typeof SubjectCard>;

/** Cuerpo de "Agregar materia" desde la landing (los campos del diálogo). */
export const CreateSubjectInput = z.object({
  slug: Slug,
  name: z.string().min(1).max(120),
  code: z.string().min(1).max(24),
  institution: z.string().min(1).max(80),
  semester: z.string().min(1).max(24),
  color: ColorRef.optional(),
  division: DivisionLabel,
});
export type CreateSubjectInput = z.infer<typeof CreateSubjectInput>;

/** Reordenar / mover en la landing: lista completa de posiciones del usuario. */
export const LandingLayoutInput = z.object({
  items: z.array(z.object({ slug: Slug, semester: z.string().min(1).max(24), position: z.number().int() })),
});
export type LandingLayoutInput = z.infer<typeof LandingLayoutInput>;

/**
 * Config tal como la sirve el API: igual a SubjectConfig pero admite `divisions` y
 * `pageTypes` vacíos (materias placeholder creadas desde la landing, sin sync).
 */
export const SubjectConfigLoose = SubjectConfig.extend({
  divisions: z.array(DivisionDef).max(64),
  pageTypes: z.array(PageTypeDef).max(24),
});
export type SubjectConfigLoose = z.infer<typeof SubjectConfigLoose>;

/** Detalle de materia para el shell: config (laxa) + páginas sin cuerpo + progreso. */
export const SubjectDetail = z.object({
  config: SubjectConfigLoose,
  pages: z.array(PageMeta),
  studied: z.array(Slug),
  placeholder: z.boolean(),
  lastSyncAt: z.string().nullable(),
});
export type SubjectDetail = z.infer<typeof SubjectDetail>;

export const PageDetail = z.object({
  page: Page,
  backlinks: z.array(PageMeta),
  studied: z.boolean(),
});
export type PageDetail = z.infer<typeof PageDetail>;

export const SearchHit = z.object({
  slug: Slug,
  title: z.string(),
  type: z.string(),
  division: DivisionKey,
  snippet: z.string(),
});
export type SearchHit = z.infer<typeof SearchHit>;

// ---------------------------------------------------------------------------
// Helpers compartidos (puros, sin dependencias)
// ---------------------------------------------------------------------------

/** Rótulo corto de una división: "U3", "S07", o el nombre para las extra. */
export function divisionShort(cfg: Pick<SubjectConfig, "division" | "divisions">, key: DivisionKey): string {
  const idx = cfg.divisions.findIndex((d) => d.key === key);
  const d = cfg.divisions[idx];
  if (!d) return key === DIVISION_NONE ? "Transv." : key;
  if (d.kind === "extra") return d.name.length <= 8 ? d.name : d.name.slice(0, 6) + ".";
  const n = numberedIndex(cfg, key);
  return cfg.division.abbr + (n !== null ? String(n) : "");
}

/** Rótulo largo: "Unidad 3 · Variables Aleatorias Discretas". */
export function divisionLong(cfg: Pick<SubjectConfig, "division" | "divisions">, key: DivisionKey): string {
  const d = cfg.divisions.find((x) => x.key === key);
  if (!d) return key === DIVISION_NONE ? "Transversales (toda la materia)" : key;
  if (d.kind === "extra") return d.name;
  const n = numberedIndex(cfg, key);
  return `${cfg.division.singular} ${n ?? ""} · ${d.name}`.replace("  ", " ");
}

/** Posición 1..N entre las divisiones numeradas (null si no es numerada). */
export function numberedIndex(cfg: Pick<SubjectConfig, "divisions">, key: DivisionKey): number | null {
  const numbered = cfg.divisions.filter((d) => d.kind !== "extra");
  const i = numbered.findIndex((d) => d.key === key);
  return i === -1 ? null : i + 1;
}

/**
 * Escala de color paramétrica (decisión del mockup 00): N ≤ 9 usa la base
 * heráldica --u1…--u9; N > 9 barre el matiz en oklch con L y C fijos.
 * Devuelve un valor CSS listo para usar.
 */
export function divisionColor(cfg: Pick<SubjectConfig, "divisions">, key: DivisionKey, dark = false): string {
  const d = cfg.divisions.find((x) => x.key === key);
  if (d?.color) return d.color.startsWith("--") ? `var(${d.color})` : d.color;
  if (!d || d.kind === "extra") return "var(--u0)";
  const numbered = cfg.divisions.filter((x) => x.kind !== "extra");
  const n = numbered.length;
  const i = numbered.findIndex((x) => x.key === key);
  if (n <= 9) return `var(--u${i + 1})`;
  const L = dark ? 0.74 : 0.52;
  const C = dark ? 0.085 : 0.095;
  return `oklch(${L} ${C} ${Math.round(162 + i * (320 / n))})`;
}

// ---------------------------------------------------------------------------
// Texto y slugs (una sola implementación para api, web, markdown y cli)
// ---------------------------------------------------------------------------

/** Pliega acentos y mayúsculas: "Distribución" → "distribucion". Criterio único de igualdad «sin acentos». */
export function fold(text: string): string {
  return (text ?? "").normalize("NFD").replace(/\p{M}+/gu, "").toLowerCase();
}

/** Convierte cualquier texto en un `Slug` válido (o "" si no queda nada). */
export function normalizeSlug(raw: string): string {
  return fold(raw)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120)
    .replace(/-+$/, "");
}

/** Convierte cualquier texto en una `DivisionKey` válida. */
export function normalizeDivisionKey(raw: string): string {
  return (raw ?? "")
    .normalize("NFD")
    .replace(/\p{M}+/gu, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^[-_]+|[-_]+$/g, "")
    .slice(0, 24)
    .toLowerCase();
}

export const isValidSlug = (v: string): boolean => Slug.safeParse(v).success;
export const isValidDivisionKey = (v: string): boolean => DivisionKey.safeParse(v).success;
export const isExternalUrl = (v: string): boolean => ExternalUrl.safeParse(v).success;

/** `--token` → `var(--token)`; un hex se devuelve tal cual; vacío → fallback. */
export function cssColor(ref: string | null | undefined, fallback = "var(--u0)"): string {
  if (!ref) return fallback;
  return ref.startsWith("--") ? `var(${ref})` : ref;
}

/** Singular o plural según n: plural(1, "página", "páginas") → "página". */
export function plural(n: number, singular: string, pluralForm: string): string {
  return n === 1 ? singular : pluralForm;
}

/** Mensaje de error de una respuesta del API (`{ error }`) o, si no, `HTTP <status> <statusText>`. */
export function errorMessageFromBody(body: unknown, status: number, statusText = ""): string {
  if (body && typeof body === "object" && typeof (body as { error?: unknown }).error === "string") {
    return (body as { error: string }).error;
  }
  return `HTTP ${status}${statusText ? " " + statusText : ""}`;
}

/**
 * ¿El tipo cuenta como contenido (progreso, numeración de lectura)? Los tipos
 * no declarados en el config cuentan; solo `countsAsContent: false` excluye.
 */
export function countsAsContent(cfg: Pick<SubjectConfigLoose, "pageTypes">, type: string): boolean {
  return cfg.pageTypes.find((t) => t.key === type)?.countsAsContent !== false;
}

// ---------------------------------------------------------------------------
// Cuatrimestres: rótulo canónico "AAAA-NC" (regla de la landing)
// ---------------------------------------------------------------------------

export interface SemesterParts { year: number; term: number }
const SEMESTER_RE = /^(\d{4})-(\d{1,2})C$/i;

/** "2026-1C" → { year: 2026, term: 1 }; null si el rótulo es libre. */
export function parseSemester(raw: string): SemesterParts | null {
  const m = SEMESTER_RE.exec((raw ?? "").trim());
  if (!m) return null;
  const year = Number(m[1]);
  const term = Number(m[2]);
  if (!Number.isFinite(year) || !Number.isFinite(term) || term < 1) return null;
  return { year, term };
}

/** Descendente: el más reciente primero; los rótulos libres al final (alfabético descendente). */
export function compareSemestersDesc(a: string, b: string): number {
  const pa = parseSemester(a);
  const pb = parseSemester(b);
  if (pa && pb) return pb.year - pa.year || pb.term - pa.term;
  if (pa) return -1;
  if (pb) return 1;
  return b.localeCompare(a, "es", { numeric: true, sensitivity: "base" });
}

// ---------------------------------------------------------------------------
// Divisiones efectivas y anclas de encabezado (regla única para api, web y compilador)
// ---------------------------------------------------------------------------

/** División de una página según el config: declarada, DIVISION_NONE o DIVISION_OTHER. */
export function divisionOf(cfg: Pick<SubjectConfigLoose, "divisions">, page: Pick<Page, "division">): DivisionKey {
  const key = page.division || DIVISION_NONE;
  if (key === DIVISION_NONE) return DIVISION_NONE;
  return cfg.divisions.some((d) => d.key === key) ? key : DIVISION_OTHER;
}

/**
 * Divisiones que se muestran: las declaradas (ordenadas por `order`, luego por
 * posición) más las sintéticas que hagan falta: «Transversales» (DIVISION_NONE)
 * si hay páginas sin división y «Otras» (DIVISION_OTHER) si hay páginas con una
 * división no declarada. Las sintéticas son `kind: "extra"`.
 */
export function effectiveDivisions(
  cfg: Pick<SubjectConfigLoose, "divisions">,
  pages: ReadonlyArray<Pick<Page, "division">>,
): DivisionDef[] {
  const declared = cfg.divisions
    .map((d, i) => ({ d, i }))
    .sort((a, b) => (a.d.order ?? a.i) - (b.d.order ?? b.i) || a.i - b.i)
    .map((x) => x.d);
  const keys = new Set(pages.map((p) => divisionOf(cfg, p)));
  const out: DivisionDef[] = [...declared];
  if (keys.has(DIVISION_NONE) && !declared.some((d) => d.key === DIVISION_NONE)) {
    out.push({ key: DIVISION_NONE, name: "Transversales", kind: "extra", color: "--umeta" });
  }
  if (keys.has(DIVISION_OTHER)) {
    out.push({ key: DIVISION_OTHER, name: "Otras", kind: "extra", color: "--u0" });
  }
  return out;
}

/**
 * Id estable de un encabezado, dueño único: lo usa el compilador (`Page.headings[].id`)
 * y el lector al renderizar, así `[[pagina#ancla]]` resuelve siempre igual. Quita
 * `$math$`, resuelve wikilinks, borra `*_\``, minúsculas, deja `[a-z0-9áéíóúñü]` y guiones.
 * Idéntico a `slugify_anchor` de `build.py` (paridad con el baseline).
 */
export function headingId(text: string): string {
  let t = (text ?? "").replace(/\$[^$]*\$/g, "");
  t = t.replace(/\[\[([^\]|]+)(\|[^\]]+)?\]\]/g, (_m, target: string, alias?: string) => (alias ? alias.slice(1) : target));
  t = t.replace(/[*_`]/g, "");
  t = t.toLowerCase().trim();
  t = t.replace(/[^a-z0-9áéíóúñü ]+/g, "");
  t = t.replace(/\s+/g, "-").replace(/^-+|-+$/g, "");
  return t || "h";
}

/** Vistas builtin que la plataforma garantiza en el Sprint 1. */
export const BUILTIN_VIEWS = ["home", "wiki", "graph", "flashcards", "quiz", "notes", "favorites"] as const;
export type BuiltinView = (typeof BUILTIN_VIEWS)[number];

/** Grupos FIJOS del rail (regiones 02 del contrato). Los dibuja la plataforma, no la materia. */
export const FIXED_RAIL: readonly RailGroup[] = [
  {
    id: "ruta",
    label: "Mi ruta",
    color: "--primary",
    items: [{ id: "home", label: "Inicio", icon: "home", kind: "builtin", target: "home" }],
  },
  {
    id: "consultar",
    label: "Consultar",
    color: "--u3",
    items: [
      { id: "wiki", label: "Todo el wiki", icon: "book", kind: "builtin", target: "wiki" },
      { id: "graph", label: "Grafo de conexiones", icon: "graph", kind: "builtin", target: "graph" },
    ],
  },
];

/** Grupo FIJO de cierre: se dibuja después de los slots de la materia. */
export const FIXED_RAIL_TAIL: readonly RailGroup[] = [
  {
    id: "wikimeta",
    label: "Wiki",
    color: "--text-2",
    items: [
      { id: "index", label: "Índice del wiki", icon: "list", kind: "page", target: META_PAGES.index },
      { id: "log", label: "Registro del wiki", icon: "clock", kind: "page", target: META_PAGES.log },
    ],
  },
];

/** Claves de localStorage de la plataforma (prefijo único, nunca por materia). */
export const LS_KEYS = {
  theme: "sinapsis.theme",
  sidebarCompact: "sinapsis.sbCompact",
  landingCollapsed: "sinapsis.landing.collapsed",
  openDivisions: (subject: string) => `sinapsis.${subject}.openDivisions`,
} as const;

/** Rutas del SPA — única fuente para web y CLI (mensajes de éxito). */
export const routes = {
  landing: () => "/",
  login: () => "/login",
  subject: (s: string) => `/m/${s}`,
  wiki: (s: string) => `/m/${s}/wiki`,
  graph: (s: string) => `/m/${s}/graph`,
  division: (s: string, d: string) => `/m/${s}/d/${d}`,
  page: (s: string, p: string) => `/m/${s}/p/${p}`,
  tool: (s: string, t: string) => `/m/${s}/t/${t}`,
} as const;

/** Prefijo de la API HTTP. */
export const API_PREFIX = "/api" as const;
