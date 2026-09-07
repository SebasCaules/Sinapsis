/**
 * @sinapsis/contract — el contrato entre la plataforma y cada materia.
 *
 * Tres piezas, en orden de estabilidad:
 *  1. SubjectConfig  → lo que declara cada materia en su `sinapsis.config.json`
 *                      (hero, nomenclatura de división, tipos de página, rail, fab).
 *  2. Page           → lo que emite el compilador del wiki por cada página markdown
 *                      (mismo contrato que `build.py` de la app de Proba, con
 *                      `unidad` renombrado a `division`).
 *  3. SyncPayload / DTOs        → lo que emite el compilador y lo que leen las vistas.
 *     El sitio estático (archivos JSON, estado local, copia de seguridad) vive
 *     en `site.ts` y se importa como `@sinapsis/contract/site`.
 *
 * Todo está definido con zod para validar en el borde (CLI y web) y derivar los
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
  /**
   * Color del tipo (hex o token `--nombre`): pinta los segmentos de la barra de
   * unidad del lector y el punto del tipo en las tarjetas. Sin declarar, la
   * plataforma asigna uno por posición (`typeColor`).
   */
  color: ColorRef.optional(),
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
 * de su propia carpeta (el CLI la lee y la copia al repositorio de la plataforma).
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
  /** Carpeta (relativa al config) con el material de estudio: mazos, quizzes, plan y kits. */
  study: SafeRelativePath.default("estudio"),
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
  /**
   * ¿El lector arma la placa de ejercicio? Con `true` —el default— un encabezado
   * «Ejercicio N» y lo que lo sigue se envuelven en una caja con antetítulo
   * (§ lector-05). Una materia cuyas guías ya traen su propia estructura —el
   * enunciado en prosa y la resolución en un aviso plegable— lo pone en `false`
   * para no encajar una caja adentro de otra (N0-70).
   */
  exercisePlates: z.boolean().default(true),
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

/**
 * Un adjunto de imagen de una página: la referencia tal como está escrita en el
 * cuerpo (`![alt](../../assets/des-feistel.png)`) y el nombre estable con que se
 * publica (`<hash>.<ext>`). El lector reescribe el `src` con este mapa; una
 * referencia que no está acá se deja intacta (N0-68).
 */
export const PageAsset = z.object({
  /** El `src` literal del markdown, sin decodificar. */
  ref: z.string().min(1).max(400),
  /** Nombre publicado: hash del contenido más la extensión. */
  file: z.string().min(1).max(80),
});
export type PageAsset = z.infer<typeof PageAsset>;

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
  /**
   * Página «hub» de su división (frontmatter `hub: true`): la portada o el panorama
   * de la unidad. La vista de la división la muestra como tarjeta de panorama y va
   * primera en la secuencia; el grafo la etiqueta de forma permanente.
   */
  hub: z.boolean().optional(),
  updatedAt: z.string().max(40).optional(),
  links: z.array(PageLink).default([]),
  headings: z.array(PageHeading).default([]),
  /**
   * Adjuntos de imagen que el cuerpo referencia y que se publican con la
   * materia. Opcional y vacío por default: una materia sin imágenes compila
   * exactamente igual que antes.
   */
  assets: z.array(PageAsset).max(500).default([]),
  /** Markdown crudo (sin frontmatter). */
  body: z.string(),
  words: z.number().int().nonnegative().default(0),
});
export type Page = z.infer<typeof Page>;
export type PageInput = z.input<typeof Page>;

/** Page sin cuerpo: lo que viaja en listados e índices. */
export const PageMeta = Page.omit({ body: true, links: true, headings: true, assets: true });
export type PageMeta = z.infer<typeof PageMeta>;

// ---------------------------------------------------------------------------
// 3. Salida del compilador y DTOs de las vistas
// ---------------------------------------------------------------------------

export const SyncPayload = z.object({
  config: SubjectConfig,
  pages: z.array(Page).max(20000),
  /** Material de estudio compilado de `wiki.study` (Sprint 2). Opcional: sin él, la plataforma autogenera un mazo por división. */
  study: z.lazy(() => StudyContent).optional(),
  generatedAt: z.string(),
  /** Identificador de la herramienta que compiló (p. ej. "@sinapsis/cli 0.1.0"). */
  generator: z.string().max(80).optional(),
});
export type SyncPayload = z.infer<typeof SyncPayload>;


/**
 * Quien usa la plataforma. Desde el Sprint 4 no hay sesión: es el PERFIL LOCAL
 * del navegador (`LocalProfile` en `site.ts`), con `id: "local"` y `email` vacío.
 * Se conserva la forma para que las vistas no cambien.
 */
export const User = z.object({
  id: z.string(),
  email: z.string().default(""),
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
  /** Tarjetas SRS vencidas para este usuario (Sprint 3). */
  dueCount: z.number().int().min(0).default(0),
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
  /** Lista ordenada de cuatrimestres del usuario (incluye los vacíos). Si falta, no se toca. */
  semesters: z.array(z.string().min(1).max(24)).max(64).optional(),
});
export type LandingLayoutInput = z.infer<typeof LandingLayoutInput>;

/**
 * Config tal como lo ven las vistas: igual a SubjectConfig pero admite `divisions` y
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

/**
 * Color de un tipo de página: el declarado en el config o, si no, uno de la
 * paleta de unidades por posición entre los tipos que cuentan como contenido
 * (los que no cuentan —fuentes— van en gris cálido `--u0`). Un tipo que el
 * config no declara también cae en `--u0`.
 */
const TYPE_PALETTE = ["--u2", "--u3", "--u5", "--u1", "--u6", "--u4", "--u8", "--u9", "--u7"] as const;
export function typeColor(cfg: Pick<SubjectConfigLoose, "pageTypes">, key: string): string {
  const t = cfg.pageTypes.find((x) => x.key === key);
  if (t?.color) return cssColor(t.color);
  if (!t || t.countsAsContent === false) return "var(--u0)";
  const content = cfg.pageTypes.filter((x) => x.countsAsContent !== false);
  const i = content.findIndex((x) => x.key === key);
  return `var(${TYPE_PALETTE[i % TYPE_PALETTE.length]})`;
}

/** `--token` → `var(--token)`; un hex se devuelve tal cual; vacío → fallback. */
export function cssColor(ref: string | null | undefined, fallback = "var(--u0)"): string {
  if (!ref) return fallback;
  return ref.startsWith("--") ? `var(${ref})` : ref;
}

/** Singular o plural según n: plural(1, "página", "páginas") → "página". */
export function plural(n: number, singular: string, pluralForm: string): string {
  return n === 1 ? singular : pluralForm;
}

/**
 * ¿El tipo cuenta como contenido (progreso, numeración de lectura)? Los tipos
 * no declarados en el config cuentan; solo `countsAsContent: false` excluye.
 */
export function countsAsContent(cfg: Pick<SubjectConfigLoose, "pageTypes">, type: string): boolean {
  /* Las páginas meta del wiki (índice, registro) nunca son contenido: no entran
     en el progreso, la secuencia, el catálogo ni el grafo por defecto. */
  if (type === PAGE_TYPE_META) return false;
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

/** Forma canónica de un rótulo de cuatrimestre: "2026-1c" → "2026-1C"; los libres se recortan. */
export function canonicalSemester(raw: string): string {
  const p = parseSemester(raw);
  return p ? `${p.year}-${p.term}C` : (raw ?? "").trim();
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

// ---------------------------------------------------------------------------
// Sprint 2 — material de estudio (compilado desde `wiki.study`)
// ---------------------------------------------------------------------------

/** Id de tarjeta/pregunta/tarea: estable entre syncs (lo fija el compilador). */
export const StudyId = z.string().min(1).max(160).regex(/^[a-z0-9][a-z0-9._:-]*$/i);

export const Card = z.object({
  id: StudyId,
  /** Anverso y reverso en markdown (KaTeX admitido). */
  front: z.string().min(1).max(4000),
  back: z.string().min(1).max(8000),
  division: DivisionKey.optional(),
  /** Página del wiki relacionada (para «ver en el wiki»). */
  page: Slug.optional(),
  tags: z.array(z.string().max(60)).default([]),
});
export type Card = z.infer<typeof Card>;

export const Deck = z.object({
  id: StudyId,
  title: z.string().min(1).max(120),
  description: z.string().max(600).optional(),
  division: DivisionKey.optional(),
  /** authored: escrito en `wiki.study`; auto: generado por la plataforma desde los resúmenes. */
  source: z.enum(["authored", "auto"]).default("authored"),
  cards: z.array(Card).max(2000),
});
export type Deck = z.infer<typeof Deck>;

export const QuizOption = z.object({
  text: z.string().min(1).max(600),
  correct: z.boolean(),
  /** Texto alternativo para lectores de pantalla cuando `text` es solo matemática (p. ej. «alfa»). */
  alt: z.string().max(300).optional(),
});
export type QuizOption = z.infer<typeof QuizOption>;

export const QuizQuestion = z
  .object({
    id: StudyId,
    prompt: z.string().min(1).max(4000),
    options: z.array(QuizOption).min(2).max(8),
    explanation: z.string().max(4000).optional(),
    division: DivisionKey.optional(),
    page: Slug.optional(),
  })
  .refine((q) => q.options.some((o) => o.correct), "quiz: cada pregunta necesita al menos una opción correcta");
export type QuizQuestion = z.infer<typeof QuizQuestion>;

export const Quiz = z.object({
  id: StudyId,
  title: z.string().min(1).max(120),
  description: z.string().max(600).optional(),
  division: DivisionKey.optional(),
  questions: z.array(QuizQuestion).min(1).max(500),
});
export type Quiz = z.infer<typeof Quiz>;

export const PlanTaskKind = z.enum(["read", "cards", "quiz", "exercises", "tool", "custom"]);
export const PlanTask = z.object({
  id: StudyId,
  label: z.string().min(1).max(200),
  kind: PlanTaskKind.default("custom"),
  /** Destino según kind: división (read), id de mazo (cards), id de quiz (quiz), id de ítem del rail (tool), slug de página o URL (exercises/custom). */
  target: z.string().max(400).optional(),
  /** Detalle corto (costo estimado, cantidad de ejercicios…). */
  detail: z.string().max(300).optional(),
  /** Parámetros del destino de una tarea `tool` (`u=1,2` → `/m/<s>/t/<target>?u=1,2`), sin el `?`. */
  query: z.string().max(200).optional(),
});
export type PlanTask = z.infer<typeof PlanTask>;

export const PlanMilestone = z.object({
  id: StudyId,
  title: z.string().min(1).max(160),
  icon: IconName.optional(),
  divisions: z.array(DivisionKey).default([]),
  tasks: z.array(PlanTask).max(40),
});
export type PlanMilestone = z.infer<typeof PlanMilestone>;

export const PlanPhase = z.object({
  id: StudyId,
  title: z.string().min(1).max(160),
  subtitle: z.string().max(300).optional(),
  icon: IconName.optional(),
  /**
   * Fecha objetivo por defecto (AAAA-MM-DD), p. ej. la del parcial según el cronograma
   * de la cátedra. La fecha real la carga cada usuario por instancia (`instance`) y
   * pisa a esta.
   */
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  /**
   * Instancia evaluatoria de la fase (clave de `Plan.instances`): a esa clave se le
   * carga la fecha del usuario (`StudyState.planDates`). Sin instancia, la fase no
   * lleva fecha editable.
   */
  instance: StudyId.optional(),
  /** Instancia de recuperatorio de la fase (clave de `Plan.instances`), si la hay. */
  retake: StudyId.optional(),
  /** Descripción corta de la fase (una o dos oraciones bajo el título). */
  description: z.string().max(600).optional(),
  /** Texto libre «qué cae en este examen» (markdown: lista con negritas). */
  scope: z.string().max(4000).optional(),
  /** Texto libre «cómo recorrer el programa» de la fase (orden sugerido, ritmo). */
  guide: z.string().max(4000).optional(),
  milestones: z.array(PlanMilestone).max(40),
});
export type PlanPhase = z.infer<typeof PlanPhase>;

/**
 * Instancia evaluatoria real de la cursada (parcialito, parcial, recuperatorio, final).
 * Las fases apuntan a ellas por `key`; el usuario les carga la fecha desde el plan
 * («Fechas de las instancias»), y esa fecha vive en su estado, no en el wiki.
 */
export const PlanInstance = z.object({
  key: StudyId,
  label: z.string().min(1).max(120),
  /** Recuperatorios y opcionales: se muestran plegados hasta que tienen fecha. */
  optional: z.boolean().default(false),
});
export type PlanInstance = z.infer<typeof PlanInstance>;

/** Modalidad alternativa del plan (S-11): p. ej. «Cursada + final» vs. «Final directo». */
export const PlanTrack = z.object({
  id: StudyId,
  label: z.string().min(1).max(80),
  description: z.string().max(300).optional(),
  phases: z.array(PlanPhase).min(1).max(20),
});
export type PlanTrack = z.infer<typeof PlanTrack>;

export const Plan = z.object({
  title: z.string().max(160).default("Plan de estudio"),
  /** Fases de la modalidad por defecto (o del plan único). */
  phases: z.array(PlanPhase).min(1).max(20),
  /**
   * Modalidades alternativas (opcional). La primera es la predeterminada si el usuario
   * no eligió otra; `phases` sigue siendo válida como modalidad «principal» cuando
   * `tracks` está vacío. Los ids de tarea son globales al plan.
   *
   * Una fase con el mismo `id` en dos modalidades (o en `phases` y en una modalidad)
   * ES LA MISMA FASE: su contenido tiene que ser idéntico y sus ids de tarea no
   * cuentan como repetidos; así una modalidad puede compartir fases con otra sin
   * duplicar tareas ni perder el progreso (`tasksDone`) al cambiar de modalidad.
   * Cualquier otro id de tarea repetido en el plan lo señala el compilador como
   * advertencia (`estudio · plan.json: id de tarea … repetido`).
   */
  tracks: z.array(PlanTrack).max(6).default([]),
  /** Instancias evaluatorias con fecha editable por el usuario (ver `PlanInstance`). */
  instances: z.array(PlanInstance).max(20).default([]),
});
export type Plan = z.infer<typeof Plan>;

/**
 * Fecha de una instancia (AAAA-MM-DD), tal como la carga el usuario.
 *
 * El formato no alcanza: `2026-13-45` lo cumple y no existe en el calendario.
 * Se comprueba además que el mes y el día sean los que devuelve `Date`, así que
 * el 29 de febrero solo pasa en año bisiesto. Los dos mensajes son propios: el
 * del `regex` de zod es «Invalid» y no dice qué formato se esperaba.
 */
const DATE_FORMAT = /^\d{4}-\d{2}-\d{2}$/;

const isCalendarDate = (value: string): boolean => {
  const [y, m, d] = value.split("-").map(Number) as [number, number, number];
  /* `Date.UTC(y, …)` interpreta los años de dos cifras como 19xx; con
     `setUTCFullYear` el año va literal y «0002-04-15» sigue siendo válido. */
  const at = new Date(0);
  at.setUTCFullYear(y, m - 1, d);
  return at.getUTCFullYear() === y && at.getUTCMonth() === m - 1 && at.getUTCDate() === d;
};

export const PlanDate = z
  .string()
  .regex(DATE_FORMAT, "debe tener el formato AAAA-MM-DD")
  /* El `refine` corre igual aunque el `regex` haya fallado, así que se saltea
     cuando el formato ya está mal: si no, «15/04/2026» devolvía los dos
     mensajes pegados. */
  .refine((v) => !DATE_FORMAT.test(v) || isCalendarDate(v), "no es una fecha del calendario");
export const PlanDateInput = z.object({ date: PlanDate });
export type PlanDateInput = z.infer<typeof PlanDateInput>;

/**
 * Lanzador de un kit: el id de un ítem del rail (forma corta) o un objeto con
 * rótulo propio, destino con parámetros e icono, como los del baseline
 * («Simulador acotado a U1–U2» → `parcial?u=1,2`).
 */
export const KitTool = z.union([
  z.string().max(48),
  z.object({
    /** Id de un ítem del rail o vista de herramienta (`target` del ítem `kind: "tool"`), con `?parámetros` opcionales. */
    target: z.string().min(1).max(160),
    label: z.string().min(1).max(80).optional(),
    icon: IconName.optional(),
  }),
]);
export type KitTool = z.infer<typeof KitTool>;
/** Id del ítem del rail al que apunta un lanzador (sin los `?parámetros`). */
export function kitToolId(tool: KitTool): string {
  const raw = typeof tool === "string" ? tool : tool.target;
  return raw.split("?")[0] ?? raw;
}
/** Parámetros del lanzador (`?u=1,2` → "u=1,2"), o "" si no lleva. */
export function kitToolParams(tool: KitTool): string {
  const raw = typeof tool === "string" ? tool : tool.target;
  const at = raw.indexOf("?");
  return at >= 0 ? raw.slice(at + 1) : "";
}

export const Kit = z.object({
  id: StudyId,
  title: z.string().min(1).max(120),
  description: z.string().max(600).optional(),
  icon: IconName.optional(),
  /** Color del kit (hex o token); sin declarar, el de su primera división. */
  color: ColorRef.optional(),
  divisions: z.array(DivisionKey).default([]),
  pages: z.array(Slug).default([]),
  decks: z.array(StudyId).default([]),
  quizzes: z.array(StudyId).default([]),
  /** Lanzadores del kit (ver `KitTool`). */
  tools: z.array(KitTool).default([]),
});
export type Kit = z.infer<typeof Kit>;

export const StudyContent = z.object({
  decks: z.array(Deck).max(200).default([]),
  quizzes: z.array(Quiz).max(200).default([]),
  plan: Plan.nullable().default(null),
  kits: z.array(Kit).max(100).default([]),
});
export type StudyContent = z.infer<typeof StudyContent>;
export type StudyContentInput = z.input<typeof StudyContent>;

/**
 * Mazo automático por división a partir de los resúmenes de las páginas de
 * contenido: anverso = título, reverso = `summary`. Lo genera la plataforma cuando
 * la materia no trae mazos propios (y siempre como complemento, marcado `auto`).
 */
export function autoDecks(
  cfg: Pick<SubjectConfigLoose, "division" | "divisions" | "pageTypes">,
  pages: ReadonlyArray<Pick<Page, "slug" | "title" | "summary" | "type" | "division">>,
): Deck[] {
  const out: Deck[] = [];
  for (const d of effectiveDivisions(cfg, pages)) {
    const cards: Card[] = pages
      .filter((p) => divisionOf(cfg, p) === d.key && countsAsContent(cfg, p.type) && p.summary.trim().length > 0)
      .map((p) => ({ id: `auto:${p.slug}`, front: p.title, back: p.summary, division: d.key, page: p.slug, tags: [] }));
    if (cards.length === 0) continue;
    out.push({ id: `auto-${d.key}`, title: `Resúmenes · ${divisionLong(cfg, d.key)}`, division: d.key, source: "auto", cards });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Sprint 2 — estado por usuario: SRS (SM-2), favoritos, apuntes, tareas, intentos
// ---------------------------------------------------------------------------

export const SrsGrade = z.number().int().min(1).max(4);
export type SrsGrade = z.infer<typeof SrsGrade>;

export const SrsState = z.object({
  cardId: StudyId,
  /** Factor de facilidad (SM-2), mínimo 1.3. */
  ease: z.number().min(1.3).max(5),
  /** Intervalo actual en días. */
  interval: z.number().min(0),
  /** Próxima revisión (ISO). */
  due: z.string(),
  reps: z.number().int().min(0),
  lapses: z.number().int().min(0),
  lastGrade: SrsGrade.nullable(),
  updatedAt: z.string(),
});
export type SrsState = z.infer<typeof SrsState>;

export const SRS_DEFAULT: Omit<SrsState, "cardId" | "due" | "updatedAt"> = { ease: 2.5, interval: 0, reps: 0, lapses: 0, lastGrade: null };

/**
 * SM-2 con 4 notas (1 = otra vez, 2 = difícil, 3 = bien, 4 = fácil). Pura: la usan el
 * cliente local para persistir y las vistas para previsualizar («en 3 d»). `now` es ISO.
 */
export function sm2(prev: Omit<SrsState, "cardId" | "due" | "updatedAt"> & { due?: string }, grade: SrsGrade, now: string): Omit<SrsState, "cardId"> {
  let { ease, interval, reps, lapses } = prev;
  if (grade === 1) {
    reps = 0;
    lapses += 1;
    interval = 0;
    ease = Math.max(1.3, ease - 0.2);
  } else {
    const q = grade === 2 ? 3 : grade === 3 ? 4 : 5;
    ease = Math.max(1.3, ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
    if (reps === 0) interval = 1;
    else if (reps === 1) interval = grade === 4 ? 4 : 3;
    else interval = Math.round(interval * ease * (grade === 2 ? 0.8 : grade === 4 ? 1.3 : 1));
    if (grade === 2 && reps > 1) interval = Math.max(1, interval);
    reps += 1;
  }
  const dueMs = Date.parse(now) + (interval === 0 ? 10 * 60 * 1000 : interval * 24 * 60 * 60 * 1000);
  return { ease, interval, reps, lapses, lastGrade: grade, due: new Date(dueMs).toISOString(), updatedAt: now };
}

export const Note = z.object({ page: Slug, body: z.string().max(50000), updatedAt: z.string() });
export type Note = z.infer<typeof Note>;

export const QuizAttempt = z.object({ quizId: StudyId, score: z.number().int().min(0), total: z.number().int().min(1), at: z.string() });
export type QuizAttempt = z.infer<typeof QuizAttempt>;

/** Entradas de las mutaciones de estudio del Sprint 2 (validación y tipado en la web). */
export const SrsGradeInput = z.object({ grade: SrsGrade });
export type SrsGradeInput = z.infer<typeof SrsGradeInput>;
export const NoteInput = z.object({ body: z.string().max(50000) });
export type NoteInput = z.infer<typeof NoteInput>;
export const QuizAttemptInput = z
  .object({ score: z.number().int().min(0), total: z.number().int().min(1) })
  .refine((v) => v.score <= v.total, "score no puede superar total");
export type QuizAttemptInput = z.infer<typeof QuizAttemptInput>;

/** Estado de estudio de la persona en una materia (lo sirve el cliente local: `api.study.state`). */
export const StudyState = z.object({
  srs: z.array(SrsState),
  bookmarks: z.array(Slug),
  notes: z.array(Note),
  tasksDone: z.array(StudyId),
  attempts: z.array(QuizAttempt),
  /** Fechas cargadas por el usuario por instancia evaluatoria (`Plan.instances[].key` → AAAA-MM-DD). */
  planDates: z.record(StudyId, PlanDate).default({}),
});
export type StudyState = z.infer<typeof StudyState>;

/**
 * Grafo de conexiones: nodos = páginas, aristas = wikilinks resueltos (sin auto-enlaces).
 * `division` es la división EFECTIVA (`divisionOf`: declarada, DIVISION_NONE u OTHER), así
 * los filtros del grafo coinciden con los del índice (N0-23).
 */
export const GraphNode = z.object({ slug: Slug, title: z.string(), type: z.string(), division: DivisionKey, words: z.number().int(), inDegree: z.number().int(), outDegree: z.number().int() });
export const GraphEdge = z.object({ from: Slug, to: Slug });
export const GraphData = z.object({ nodes: z.array(GraphNode), edges: z.array(GraphEdge) });
export type GraphNode = z.infer<typeof GraphNode>;
export type GraphEdge = z.infer<typeof GraphEdge>;
export type GraphData = z.infer<typeof GraphData>;

// ---------------------------------------------------------------------------
// Sprint 3 — herramientas por materia (plugins) y figuras interactivas
// ---------------------------------------------------------------------------

/** Versión del runtime del navegador que la plataforma expone a los bundles. */
export const RUNTIME_VERSION = 1 as const;

/** Ruta relativa de un archivo dentro de un bundle: sin `..`, sin raíz, extensión conocida. */
export const ToolFilePath = z
  .string()
  .min(1)
  .max(200)
  .regex(/^[a-zA-Z0-9_][a-zA-Z0-9_./-]*$/, "ruta de bundle: caracteres inválidos")
  .refine((v) => !/(^|\/)\.\.(\/|$)/.test(v) && !v.startsWith("/"), "ruta de bundle: debe ser relativa y sin «..»")
  .refine((v) => !/(^|\/)\.(\/|$)/.test(v) && !v.includes("//") && !v.endsWith("/"), "ruta de bundle: debe venir normalizada (sin «./», «//» ni barra final)")
  .refine((v) => /\.(js|mjs|css|json|svg|png|jpg|jpeg|webp|woff|woff2|txt|md|csv)$/i.test(v), "ruta de bundle: extensión no admitida");
export type ToolFilePath = z.infer<typeof ToolFilePath>;

/** Vista que un bundle registra con `App.registerView(id, fn)`; el rail la abre en `/m/:s/t/:id`. */
export const ToolView = z.object({
  id: z.string().min(1).max(48).regex(/^[a-z][a-z0-9_-]*$/),
  label: z.string().min(1).max(80),
  icon: IconName.optional(),
  /** Vista ancha (1120) o a todo el ancho del área de contenido. */
  layout: z.enum(["wide", "full"]).default("wide"),
  /**
   * Marco con el que la plataforma envuelve la vista. Con `"page"` la vista se
   * dibuja dentro del MISMO marco que una página del wiki (`PageFrame`, N0-64):
   * la hoja con su ancho, la línea de identidad (división · tipo · posición) y
   * la barra de la unidad con su Anterior/Siguiente. El marco solo se aplica
   * cuando el `?arg=` de la URL resuelve a un paso de progreso de una división
   * (`model.stepForTool`); si no resuelve, la vista se dibuja como siempre.
   *
   * Con `"sheet"` la vista se dibuja dentro de la MISMA hoja ajustable que una
   * página del wiki —el ancho se arrastra desde los costados y vuelve a 840 con
   * doble clic— pero sin la línea de identidad ni la barra de la unidad: es para
   * una herramienta que se lee como un documento y no es un paso de ningún
   * recorrido (N0-73). No depende del `?arg=`: se aplica siempre.
   * Sin este campo, la vista se dibuja suelta, que es lo de siempre.
   */
  frame: z.enum(["page", "sheet"]).optional(),
});
export type ToolView = z.infer<typeof ToolView>;

/**
 * Manifiesto de un bundle de herramientas (`sinapsis.tools.json` en la carpeta del
 * bundle). Los scripts son clásicos (IIFE contra `window.App`/`window.M`, como el
 * baseline) y se cargan en orden después de que la plataforma instala el runtime;
 * los estilos se inyectan y quitan con el bundle. Un bundle puede aportar vistas,
 * figuras (`App.registerFigure`) o ambas.
 */
export const ToolManifest = z.object({
  id: z.string().min(1).max(48).regex(/^[a-z][a-z0-9_-]*$/),
  title: z.string().min(1).max(120),
  version: z.string().min(1).max(40),
  description: z.string().max(600).optional(),
  /** Runtime mínimo que necesita. */
  runtime: z.literal(RUNTIME_VERSION).default(RUNTIME_VERSION),
  scripts: z.array(ToolFilePath).max(64).default([]),
  styles: z.array(ToolFilePath).max(32).default([]),
  views: z.array(ToolView).max(32).default([]),
  /** true si registra figuras para los callouts `[!figura]` del wiki. */
  figures: z.boolean().default(false),
  /**
   * true si registra proveedores de progreso (`App.registerProgressProvider`).
   * El bundle se carga al ENTRAR en la materia, como `figures`: la barra de
   * cada división tiene que poder sumar sus pasos sin que nadie abra la vista.
   */
  progress: z.boolean().default(false),
  /** Datos JSON que el bundle puede leer con `App.STUDY`/`App.DATA` (p. ej. `study-data.json`). */
  data: z.array(ToolFilePath).max(16).default([]),
});
export type ToolManifest = z.infer<typeof ToolManifest>;
export type ToolManifestInput = z.input<typeof ToolManifest>;

export const ToolFile = z.object({
  path: ToolFilePath,
  encoding: z.enum(["utf8", "base64"]).default("utf8"),
  content: z.string(),
});
export type ToolFile = z.infer<typeof ToolFile>;

/**
 * Un bundle en memoria: el manifiesto más sus archivos, tal como lo valida
 * `sinapsis tools build` y lo copian `publish` y `site build`. Tope 20 MB por bundle.
 */
export const ToolPush = z.object({
  manifest: ToolManifest,
  files: z.array(ToolFile).min(1).max(400),
});
export type ToolPush = z.infer<typeof ToolPush>;

/** Un bundle publicado, tal como lo lista `subjects/<slug>/tools.json` (ver `site.ts`). */
export const ToolInfo = z.object({
  manifest: ToolManifest,
  bytes: z.number().int().min(0),
  updatedAt: z.string(),
  /**
   * Base de los archivos del bundle, RELATIVA al sitio y sin barra final
   * (`siteToolBase(slug, id)` = `subjects/<slug>/tools/<id>`); la web la
   * prefija con `BASE_URL` y compone `${base}/${path}`.
   */
  base: z.string(),
});
export type ToolInfo = z.infer<typeof ToolInfo>;


/** Vistas builtin que la plataforma garantiza en el Sprint 1. */
export const BUILTIN_VIEWS = ["home", "plan", "kits", "wiki", "graph", "flashcards", "quiz", "notes", "favorites"] as const;
export type BuiltinView = (typeof BUILTIN_VIEWS)[number];

/** Grupos FIJOS del rail (regiones 02 del contrato). Los dibuja la plataforma, no la materia. */
/**
 * Ítems que la plataforma recomienda como máximo en los grupos SLOT de una
 * materia. El rail fijo ya lleva 11 (Mi ruta 3 · Consultar 2 · Practicar 2 ·
 * Lo mío 2 · Wiki 2); con más de 6 de la materia el rail deja de entrar a 36 px
 * por ítem en una pantalla de portátil y la web lo achica (nunca desborda). Es
 * una recomendación: `validate` avisa, no rechaza.
 */
export const RAIL_SLOT_ITEMS_RECOMMENDED = 6 as const;
/** Ítems declarados por la materia en sus grupos slot. */
export function railSlotItemCount(cfg: Pick<SubjectConfigLoose, "rail">): number {
  return cfg.rail.reduce((n, g) => n + g.items.length, 0);
}

export const FIXED_RAIL: readonly RailGroup[] = [
  {
    id: "ruta",
    label: "Mi ruta",
    color: "--primary",
    items: [
      { id: "home", label: "Inicio", icon: "home", kind: "builtin", target: "home" },
      { id: "plan", label: "Plan de estudio", icon: "map", kind: "builtin", target: "plan" },
      { id: "kits", label: "Kits de estudio", icon: "grid", kind: "builtin", target: "kits" },
    ],
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
  {
    id: "practicar",
    label: "Practicar",
    color: "--good",
    items: [
      { id: "flashcards", label: "Flashcards", icon: "cards", kind: "builtin", target: "flashcards" },
      { id: "quiz", label: "Quiz", icon: "quiz", kind: "builtin", target: "quiz" },
    ],
  },
];

/** Grupos FIJOS de cierre: se dibujan después de los slots de la materia. */
export const FIXED_RAIL_TAIL: readonly RailGroup[] = [
  {
    id: "mio",
    label: "Lo mío",
    color: "--warn",
    items: [
      { id: "notes", label: "Mis apuntes", icon: "notebook", kind: "builtin", target: "notes" },
      { id: "favorites", label: "Favoritos", icon: "star", kind: "builtin", target: "favorites" },
    ],
  },
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
  tabs: (subject: string) => `sinapsis.${subject}.tabs`,
  openDivisions: (subject: string) => `sinapsis.${subject}.openDivisions`,
  /** Actividad local de la materia: días con estudio (racha) y última página leída. */
  activity: (subject: string) => `sinapsis.${subject}.activity`,
} as const;

/** Rutas del SPA — única fuente para web y CLI (mensajes de éxito). */
export const routes = {
  landing: () => "/",
  subject: (s: string) => `/m/${s}`,
  wiki: (s: string) => `/m/${s}/wiki`,
  graph: (s: string) => `/m/${s}/graph`,
  division: (s: string, d: string) => `/m/${s}/d/${d}`,
  page: (s: string, p: string) => `/m/${s}/p/${p}`,
  tool: (s: string, t: string) => `/m/${s}/t/${t}`,
  plan: (s: string) => `/m/${s}/plan`,
  kits: (s: string) => `/m/${s}/kits`,
  kit: (s: string, k: string) => `/m/${s}/kits/${k}`,
  flashcards: (s: string) => `/m/${s}/flashcards`,
  deck: (s: string, d: string) => `/m/${s}/flashcards/${d}`,
  quiz: (s: string) => `/m/${s}/quiz`,
  quizOne: (s: string, q: string) => `/m/${s}/quiz/${q}`,
  notes: (s: string) => `/m/${s}/notes`,
  favorites: (s: string) => `/m/${s}/favorites`,
} as const;


/** Tipos del runtime del navegador para bundles de herramientas (Sprint 3). */
export type * from "./runtime.js";
