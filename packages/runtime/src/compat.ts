/* ============================================================
   compat.ts — arma el objeto `App` (window.App) que esperan los bundles.

   Es la capa de compatibilidad con el baseline de Proba: los mismos nombres
   (`PAGES`, `BY_SLUG`, `UNITS`, `unitShort`, `go`, `katex`, `icon`, `Fig`,
   `Plot`, `M`…) pero alimentados con el contrato de Sinapsis (`SubjectConfig`,
   `PageMeta`, `routes`, `effectiveDivisions`, `divisionColor`).

   Lo que el HOST provee (`SubjectContext`): la materia abierta, sus páginas, el
   conjunto de páginas leídas, el tema y tres callbacks —`navigate`, `toast` y,
   opcionalmente, `setCrumbs` y `render`—. Todo lo demás lo pone el runtime.
   ============================================================ */
import {
  countsAsContent,
  divisionColor,
  divisionLong,
  divisionOf,
  divisionShort,
  effectiveDivisions,
  routes,
  type CompatApp,
  type CompatRoute,
  type CompatStorage,
  type FigureMeta,
  type PageMeta,
  type ProgressProvider,
  type SearchProvider,
  type SubjectConfigLoose,
  type ThemeId,
  type ViewFn,
} from "@sinapsis/contract";
import { createFigures, type FigureApi, type FigureDrawFn } from "./figures.js";
import { createPlot } from "./plot.js";
import { createMath, type MathLib } from "./math.js";
import { icon } from "./icons.js";
import {
  KATEX_MACROS,
  createMarkdown,
  escapeHtml,
  figureMarkup,
  katexRender,
  type MarkdownApi,
} from "./markdown.js";

/**
 * Miga de pan: el último tramo, sin destino, es la pantalla actual.
 *
 * `href` es la forma del contrato (ruta del SPA) y `hash` la del baseline
 * (`#/taller`): `App.setCrumbs` acepta las dos y le entrega al host siempre un
 * `href` ya traducido (brecha herr-08).
 */
export interface Crumb {
  label: string;
  href?: string;
  /** Alias del baseline: `#/inicio`, `#/taller`, `#/p/slug`… */
  hash?: string;
}

/** Lo que la plataforma (host) le presta al runtime por materia abierta. */
export interface SubjectContext {
  slug: string;
  config: SubjectConfigLoose;
  pages: PageMeta[];
  /** Slugs de las páginas ya leídas. Se lee en vivo: el host puede mutarlo. */
  studied: Set<string>;
  /** Navegación del SPA. El runtime siempre le pasa una ruta `/m/…`. */
  navigate(path: string, opts?: { replace?: boolean }): void;
  toast(message: string, tone?: "ok" | "bad"): void;
  theme: ThemeId;
  setCrumbs?(items: Crumb[]): void;
  /** Re-render de la vista actual (compat: `App.render()`). */
  render?(): void;
  /**
   * ¿Está abierta la paleta ⌘K del shell? (compat: `App.paletteOpen()`). Si el
   * host no la provee, el runtime mira `[data-palette-open]` en el documento.
   */
  paletteOpen?(): boolean;
  /**
   * Abre la paleta ⌘K del shell (compat: `App.openPalette()`). Si el host no la
   * provee, el runtime despacha `PALETTE_EVENT` en `window`.
   */
  openPalette?(): void;
  /**
   * Anota actividad de estudio de hoy (compat: `App.markActivity()`). Lo resuelve
   * el host con `features/subject/activity.ts` mientras la actividad viva en el
   * navegador; el día que `StudyState` la lleve al API, cambia solo acá.
   */
  markActivity?(): void;
  /**
   * Título que pide la vista (compat: `App.setTitle()`). El host lo compone con
   * el nombre de la materia; el bundle NO escribe `document.title` (herr-10).
   */
  setTitle?(label: string): void;
}

/** KaTeX del baseline: `A.katex(tex, display)` y, además, la API de la librería. */
export interface KatexCompat {
  (tex: string, display?: boolean): string;
  renderToString(tex: string, opts?: Record<string, unknown>): string;
}

/**
 * `window.App`: el contrato `CompatApp` más lo que usan los módulos del
 * baseline y que el contrato no nombra (`fmt4`, `fmt6`, `joinInlineMath`,
 * `refitFormulas`, `VIEWS`…).
 */
export interface RuntimeApp extends CompatApp {
  /**
   * Igual que en el contrato, pero con el `api` real del motor portado
   * (`FigureApi`: el del baseline más el `FigureContext` del contrato).
   */
  registerFigure(id: string, draw: FigureDrawFn, meta?: FigureMeta): void;
  /** Slug de la materia activa. */
  subject: string;
  theme: ThemeId;
  katex: KatexCompat;
  /** Vistas registradas por los bundles. */
  VIEWS: Record<string, ViewFn>;
  view(id: string): ViewFn | null;
  registerView(id: string, fn: ViewFn): void;
  /** Acciones de `data-action` (delegación instalada por el runtime). */
  ACTIONS: Record<string, (el: HTMLElement, ev: Event) => void>;
  runAction(name: string, el: HTMLElement, ev: Event): boolean;
  /** Redibujo pedido por la vista activa (`setRedraw`). */
  redraw(): void;
  fmt4(x: number): string;
  fmt6(x: number): string;
  joinInlineMath(src: string, md?: boolean): string;
  refitFormulas(container?: HTMLElement | null): void;
  /** Marcado de figura que espera `mountFigures`. */
  figureMarkup(id: string, captionHtml?: string): string;
  shuffle<T>(a: T[]): T[];
  /** Igual que `M`, pero con la superficie numérica tipada. */
  MathLib: MathLib;

  /* --- atajos del baseline que el contrato todavía no nombra (S-16) --------
     `$` y `$$` son `querySelector`/`querySelectorAll` ACOTADOS al contenedor de
     la vista montada (el que ata `bindView`). Sin vista montada —o si el
     contenedor ya se desmontó— caen en `document`, que es lo que hacía el
     baseline. Una vista que cuelgue marcado de `document.body` (la burbuja ⌘J
     de `lookup.js`, por ejemplo) tiene que pasar su raíz a mano. */
  $(sel: string, root?: ParentNode | null): HTMLElement | null;
  $$(sel: string, root?: ParentNode | null): HTMLElement[];
  /**
   * ¿Está abierta la paleta ⌘K del shell? Es una PREGUNTA, no una orden: así la
   * usa `lookup.js` (Escape cierra su burbuja solo si la paleta no está
   * abierta). Para abrirla está `openPalette()`.
   */
  paletteOpen(): boolean;
  /** Abre la paleta ⌘K del shell. */
  openPalette(): void;
}

/** Lo que devuelve `createCompatApp`: el `App` y el mando para actualizarlo. */
export interface CompatHandle {
  app: RuntimeApp;
  /** Cambia de materia (o refresca páginas/leídas) sin recrear el `App`. */
  setContext(next: SubjectContext): void;
  /** Contexto actual (lectura). */
  context(): SubjectContext;
  /** Fija el tema y dispara el redibujo registrado con `setRedraw`. */
  setTheme(theme: ThemeId): void;
  /** Contenedor de la vista montada: ámbito de `App.$` y `App.$$`. */
  setViewRoot(el: HTMLElement | null): void;
  viewRoot(): HTMLElement | null;
  markdown: MarkdownApi;
  /** Anota la posición de scroll de la ruta actual (la lee `App.scrollFor`). */
  saveScroll(y: number): void;
  /**
   * Corre los limpiadores que se registraron con `App.onTeardown` FUERA de la
   * carga de un bundle (los de un bundle los corre `unloadBundle`) y olvida los
   * proveedores de búsqueda. Lo llama el desmontaje del runtime.
   */
  runTeardowns(): void;
  /** Proveedores de resultados para la paleta (`App.registerSearchProvider`). */
  searchProviders(): SearchProvider[];
  /** Proveedores de pasos de progreso (`App.registerProgressProvider`). */
  progressProviders(): ProgressProvider[];
  /** Se suscribe a `App.progressChanged()`; devuelve el desuscriptor. */
  onProgressChange(fn: () => void): () => void;
}

/**
 * Evento con el que el runtime le pide al shell que abra la paleta ⌘K cuando el
 * host no le pasó un `openPalette` propio. El shell de la plataforma tiene que
 * escucharlo en `window`; mientras no lo escuche, `App.openPalette()` no hace
 * nada visible (degradación aceptable: la paleta se abre igual con ⌘K).
 */
export const PALETTE_EVENT = "sinapsis:palette";

// ---------------------------------------------------------------------------
// Helpers de formato (port del baseline)
// ---------------------------------------------------------------------------

/** `fmt(n)` del baseline; con `digits` fuerza los decimales. */
export function fmt(x: number, digits?: number): string {
  if (digits != null) return Number(x).toFixed(digits);
  return Number.isInteger(x) ? String(x) : Math.abs(x) < 100 ? x.toFixed(2) : x.toFixed(1);
}

export function fmt4(x: number): string {
  if (!isFinite(x)) return "∞";
  return String(Math.round(x * 10000) / 10000);
}

export function fmt6(x: number): string {
  if (!isFinite(x)) return x > 0 ? "∞" : "−∞";
  return (Math.round(x * 1e6) / 1e6).toString();
}

/** Valor resuelto de un token CSS del tema (`--primary` → "#7c2230"). */
export function cssVar(name: string): string {
  if (typeof document === "undefined") return "";
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** `#rrggbb` → `rgba(r,g,b,a)`; cualquier otra notación se devuelve tal cual. */
export function withAlpha(c: string, a: number): string {
  const v = (c || "").trim();
  if (v.startsWith("#")) {
    let h = v.slice(1);
    if (h.length === 3) h = h.split("").map((x) => x + x).join("");
    const n = parseInt(h, 16);
    return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
  }
  return v;
}

export function emptyState(title: string, sub?: string): string {
  return (
    '<div class="empty">' + icon("search", 40) +
    '<div class="empty-t">' + escapeHtml(title) + "</div>" +
    '<div class="empty-s">' + (sub ? escapeHtml(sub) : "") + "</div></div>"
  );
}

export function backBar(href: string, label: string): string {
  return (
    '<a class="back-bar" href="' + escapeHtml(href) + '" data-nav>' +
    icon("chev", 15) + " " + escapeHtml(label) + "</a>"
  );
}

/**
 * `A.normText` del baseline: normalización de búsqueda —minúsculas y sin
 * diacríticos—, para que «funcion» encuentre «función». `normalize("NFD")` no
 * está en todos los motores viejos: si tira, se devuelve el texto en minúsculas.
 */
export function normText(s: string): string {
  const t = String(s ?? "").toLowerCase();
  try {
    return t.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  } catch {
    return t;
  }
}

/**
 * `A.texPlain` del baseline: texto buscable de una fórmula. Se quitan barras,
 * llaves y `\dfrac` para que «sqrt n» u «overline x» encuentren la expresión
 * aunque esté escrita en LaTeX. El `trim` final es parte del contrato: el
 * resultado se compara con `startsWith`, y un espacio inicial —el que deja
 * cualquier rótulo que empiece en `$`— anulaba el acierto.
 */
export function texPlain(tex: string): string {
  return String(tex ?? "")
    .replace(/\\(?:text|textrm|mathrm|mathit|mathbf|operatorname)\s*\{/g, " {")
    .replace(/\\[dt]?frac/g, " frac ")
    .replace(/\\left|\\right|\\!|\\,|;|\\qquad|\\quad/g, " ")
    .replace(/[\\{}$&]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function shuffle<T>(a: T[]): T[] {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i] as T;
    a[i] = a[j] as T;
    a[j] = t;
  }
  return a;
}

// ---------------------------------------------------------------------------
// Traducción de rutas del baseline
// ---------------------------------------------------------------------------

/** ¿Es una URL externa (se abre en pestaña nueva)? */
function isExternal(t: string): boolean {
  /* `//host`, `/\host` y `\/host` resuelven todos a OTRO origen (el router los
     empujaría con `location.assign`): los tres son externos, no rutas del SPA. */
  return /^(https?:)?[/\\]{2}/i.test(t) || /^mailto:/i.test(t);
}

/**
 * Vistas PROPIAS de la plataforma con nombre del baseline (brecha herr-03): sin
 * esta tabla, `#/plan` o `#/apuntes` caían en `/m/<materia>/t/plan`, que ningún
 * bundle registra, y el usuario terminaba en «Próximamente».
 *
 * Cada entrada dice qué ruta usar sin argumento y con argumento; el resto de las
 * vistas sigue cayendo en `/t/<vista>`, que es donde viven las herramientas.
 */
const PLATFORM_VIEWS: Record<
  string,
  { base: (s: string) => string; withArg?: (s: string, a: string) => string }
> = {
  plan: { base: routes.plan },
  kits: { base: routes.kits, withArg: routes.kit },
  kit: { base: routes.kits, withArg: routes.kit },
  flashcards: { base: routes.flashcards, withArg: routes.deck },
  mazo: { base: routes.flashcards, withArg: routes.deck },
  quiz: { base: routes.quiz, withArg: routes.quizOne },
  apuntes: { base: routes.notes },
  notas: { base: routes.notes },
  favoritos: { base: routes.favorites },
  grafo: { base: routes.graph },
};

/** Nombre del baseline de cada vista propia de la plataforma (inversa de `PLATFORM_VIEWS`). */
const BASELINE_NAME: Record<string, string> = {
  plan: "plan",
  kits: "kits",
  flashcards: "flashcards",
  quiz: "quiz",
  notes: "apuntes",
  favorites: "favoritos",
  graph: "grafo",
  wiki: "wiki",
};

/**
 * Traduce una ruta del baseline a una ruta del SPA:
 *   `#/p/slug`         → `/m/<materia>/p/slug`
 *   `#/unidad/3`       → `/m/<materia>/d/3`   (también `#/division/3`)
 *   `#/wiki`           → `/m/<materia>/wiki`
 *   `#/plan`, `#/quiz/1`, `#/apuntes`… → la vista propia de la plataforma
 *   `#/inicio` o `#/`  → `/m/<materia>`
 *   `#/<vista>[/arg]`  → `/m/<materia>/t/<vista>[?arg=…]`
 * Una ruta que ya empieza con `/` se devuelve tal cual, y `null` avisa que el
 * destino es externo (lo abre `go`).
 */
export function translateRoute(subject: string, target: string): string | null {
  const t = String(target || "").trim();
  if (!t) return routes.subject(subject);
  if (isExternal(t)) return null;
  if (t.startsWith("/")) return t;
  let h = t.replace(/^#\/?/, "");
  let qs = "";
  const qi = h.indexOf("?");
  if (qi >= 0) {
    qs = h.slice(qi + 1);
    h = h.slice(0, qi);
  }
  const parts = h.split("/").filter((x) => x !== "");
  const view = parts[0] || "";
  const arg = parts.slice(1).join("/");
  const tail = qs ? "?" + qs : "";
  if (!view || view === "inicio") return routes.subject(subject) + tail;
  if (view === "p" && arg) return routes.page(subject, arg) + tail;
  if ((view === "unidad" || view === "division") && arg) return routes.division(subject, arg) + tail;
  if (view === "wiki") return routes.wiki(subject) + tail;
  const platform = PLATFORM_VIEWS[view];
  if (platform) {
    const path = arg && platform.withArg ? platform.withArg(subject, arg) : platform.base(subject);
    return path + tail;
  }
  const q = arg ? "?arg=" + encodeURIComponent(arg) + (qs ? "&" + qs : "") : tail;
  return routes.tool(subject, view) + q;
}

/**
 * La INVERSA de `translateRoute`: lee la ruta real del SPA con la gramática del
 * baseline (`A.parseRoute()`), para que una vista portada sepa dónde está.
 *
 *   `/m/proba/t/calc/ic?x=1` → `{ view: "calc", arg: "ic", query: { x: "1" } }`
 *   `/m/proba/t/calc?arg=ic` → lo mismo (forma antigua: el argumento en la query)
 *   `/m/proba/p/normal`      → `{ view: "p", arg: "normal" }`
 *   `/m/proba`               → `{ view: "inicio", arg: "" }`
 *
 * El parámetro `arg` NUNCA aparece en `query`: es el argumento de la vista, no
 * un parámetro suyo.
 */
/**
 * ¿El destino es el sitio donde ya estamos, con otra consulta?
 *
 * Sirve para saber si hay que volver a dibujar la vista después de navegar: el
 * host la reinvoca cuando cambia el ARGUMENTO, pero no cuando cambia el resto de
 * la query (`?sel=1`, `?ej=…`), y en el baseline cualquier cambio de ruta
 * redibujaba. Devuelve `false` si cambia la vista o el argumento —eso ya lo
 * atiende el host, y sin desmontar— y `false` si la ruta es idéntica, para que
 * un enlace al sitio donde uno está no borre lo que la vista tenga cargado.
 *
 * `here` es opcional para poder probarla sin navegador; sin ella lee
 * `location`.
 */
export function isQueryOnlyChange(
  subject: string,
  path: string,
  here?: { pathname: string; search: string },
): boolean {
  const now = here ?? (typeof location === "undefined" ? null : location);
  if (!now) return false;
  const qi = path.indexOf("?");
  const nextPath = qi < 0 ? path : path.slice(0, qi);
  const nextSearch = qi < 0 ? "" : path.slice(qi);
  const a = parseLocation(subject, now.pathname, now.search || "");
  const b = parseLocation(subject, nextPath, nextSearch);
  return a.view === b.view && a.arg === b.arg && a.qs !== b.qs;
}

export function parseLocation(subject: string, pathname: string, search = ""): CompatRoute {
  const query: Record<string, string> = {};
  const raw = String(search || "").replace(/^\?/, "");
  raw.split("&").forEach((kv) => {
    if (!kv) return;
    const i = kv.indexOf("=");
    let k = i < 0 ? kv : kv.slice(0, i);
    let v = i < 0 ? "" : kv.slice(i + 1);
    try {
      k = decodeURIComponent(k);
      v = decodeURIComponent(v.replace(/\+/g, " "));
    } catch {
      /* un porcentaje suelto no puede tumbar la lectura de la ruta */
    }
    if (k) query[k] = v;
  });
  const fromQuery = query["arg"] ?? "";
  delete query["arg"];
  const qs = serializeQuery(query);

  let path = String(pathname || "");
  const prefix = routes.subject(subject);
  if (subject) {
    /* El sitio puede colgar de un base (`/Sinapsis/` en GitHub Pages, N0-59), y
       entonces el prefijo de la materia NO está al principio del pathname:
       `/Sinapsis/m/cripto/t/parciales`. Se lo busca como segmento completo en
       vez de exigir que empiece ahí; si no, la ruta se lee como la vista
       «Sinapsis» y todo lo que dependa de comparar dos rutas —el redibujo de
       `App.go`, `App.parseRoute`— decide mal. */
    const at = path.indexOf(prefix);
    const corta = at + prefix.length;
    if (at >= 0 && (path.length === corta || path[corta] === "/")) path = path.slice(corta);
  }
  const parts = path.split("/").filter((x) => x !== "");
  const head = parts[0] || "";
  const rest = parts.slice(1).join("/");

  const done = (view: string, arg: string): CompatRoute => ({ view, arg: arg || fromQuery, query, qs });
  if (!head) return done("inicio", "");
  if (head === "t") return done(parts[1] || "", parts.slice(2).join("/"));
  if (head === "p") return done("p", rest);
  if (head === "d") return done("unidad", rest);
  const baseline = BASELINE_NAME[head];
  if (baseline) return done(baseline, rest);
  return done(head, rest);
}

/** Claves ordenadas: dos rutas con los mismos parámetros dan el mismo string. */
export function serializeQuery(q: Record<string, string>): string {
  return Object.keys(q)
    .filter((k) => q[k] != null)
    .sort()
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(q[k] as string))
    .join("&");
}

// ---------------------------------------------------------------------------
// createCompatApp
// ---------------------------------------------------------------------------

interface Derived {
  PAGES: PageMeta[];
  CONTENT: PageMeta[];
  BY_SLUG: Record<string, PageMeta>;
  UNITS: Array<{ key: string; name: string; color: string }>;
  TYPES: Array<{ key: string; label: string }>;
  /** `UNITS` en forma de tabla: clave de división → posición en el programa. */
  unitOrder: Record<string, number>;
  /** `TYPES` en forma de tabla: clave de tipo → rótulo. */
  TYPE_LABEL: Record<string, string>;
}

function derive(ctx: SubjectContext): Derived {
  const PAGES = ctx.pages.slice();
  const CONTENT = PAGES.filter((p) => countsAsContent(ctx.config, p.type));
  const BY_SLUG: Record<string, PageMeta> = {};
  PAGES.forEach((p) => {
    BY_SLUG[p.slug] = p;
  });
  const UNITS = effectiveDivisions(ctx.config, PAGES).map((d) => ({
    key: d.key,
    name: d.name,
    color: divisionColor(ctx.config, d.key),
  }));
  const TYPES = ctx.config.pageTypes.map((t) => ({ key: t.key, label: t.label }));
  /* Las dos tablas del baseline (`core.js`: `unitOrder`, `TYPE_LABEL`): son la
     misma información que `UNITS`/`TYPES`, indexada. Ordenar 289 ejercicios por
     unidad con `UNITS.findIndex` es cuadrático; con la tabla es una lectura. */
  const unitOrder: Record<string, number> = {};
  UNITS.forEach((u, i) => {
    unitOrder[u.key] = i;
  });
  const TYPE_LABEL: Record<string, string> = {};
  TYPES.forEach((t) => {
    TYPE_LABEL[t.key] = t.label;
  });
  return { PAGES, CONTENT, BY_SLUG, UNITS, TYPES, unitOrder, TYPE_LABEL };
}

/** Crea el `App` de compatibilidad para una materia. */
export function createCompatApp(initial: SubjectContext): CompatHandle {
  let ctx = initial;

  const markdown = createMarkdown(() => ({
    subject: ctx.slug,
    hasPage: (slug: string) => Object.prototype.hasOwnProperty.call(app.BY_SLUG, slug),
    titleOf: (slug: string) => app.BY_SLUG[slug]?.title ?? null,
  }));

  const math = createMath();

  // `A.katex(tex, display)` es una FUNCIÓN en el baseline y un objeto con
  // `renderToString` en el contrato: se cumplen las dos formas a la vez.
  const katexCompat = ((tex: string, display?: boolean) => katexRender(tex, display)) as KatexCompat;
  katexCompat.renderToString = (tex: string, opts?: Record<string, unknown>) =>
    katexRender(tex, !!(opts && (opts as { displayMode?: boolean }).displayMode));

  let redrawFn: (() => void) | null = null;

  /* Contenedor de la vista montada (lo ata `bindView` desde el host). Es el
     ámbito de `App.$` y `App.$$`. */
  let root: HTMLElement | null = null;
  const doc = (): ParentNode | null => (typeof document === "undefined" ? null : document);
  /**
   * Dónde buscar: la raíz explícita, si la hay; si no, el contenedor de la
   * vista SIEMPRE QUE siga en el documento —un contenedor ya desmontado no
   * puede devolver nada útil, y dejarlo puesto era la forma de que una vista
   * vieja siguiera «encontrando» sus nodos—; si no, el documento.
   */
  const scope = (explicit?: ParentNode | null): ParentNode | null => {
    if (explicit) return explicit;
    if (root && root.isConnected) return root;
    return doc();
  };

  /**
   * Selectores con los que el baseline nombraba al contenedor de la vista. En la
   * plataforma `#main` es OTRA cosa (el `<main id="contenido">` del shell no
   * lleva ese id, y aunque lo llevara no sería el nodo de la herramienta), así
   * que `App.$("#main")` devolvía null y escribir en él lanzaba una excepción
   * (brecha herr-01). Acá se resuelven a la raíz de la vista montada, que es lo
   * que el bundle quiere decir.
   */
  const VIEW_ROOT_SELECTORS = new Set(["#main", "#app", "#content", "#contenido"]);

  /* --- almacenamiento local con prefijo por materia (A.LS) ------------------ */
  const lsPrefix = (): string => "sinapsis." + (ctx.slug || "_") + ".rt.";
  const storage = (): Storage | null => {
    try {
      return typeof localStorage === "undefined" ? null : localStorage;
    } catch {
      /* modo privado o almacenamiento bloqueado: la herramienta sigue, sin memoria */
      return null;
    }
  };
  const LS: CompatStorage = {
    key(name: string): string {
      return lsPrefix() + String(name || "");
    },
    get<T = unknown>(name: string, fallback?: T): T {
      try {
        const raw = storage()?.getItem(LS.key(name));
        if (raw == null) return fallback as T;
        return JSON.parse(raw) as T;
      } catch {
        return fallback as T;
      }
    },
    getObj(name: string): Record<string, unknown> {
      const v = LS.get<unknown>(name, null);
      return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
    },
    set(name: string, value: unknown): void {
      try {
        storage()?.setItem(LS.key(name), JSON.stringify(value));
      } catch {
        /* sin cuota: el estado vive lo que dure la sesión */
      }
    },
    del(name: string): void {
      try {
        storage()?.removeItem(LS.key(name));
      } catch {
        /* nada que borrar */
      }
    },
  };

  /* --- estado por vista, en memoria (A.viewState) --------------------------
     Vive en el runtime y NO en el DOM: por eso sobrevive a que el host vuelva a
     montar la vista al cambiar el tema (brecha herr-05). Se limpia al cambiar
     de materia, que es cuando deja de tener sentido. */
  let viewStates: Record<string, Record<string, unknown>> = {};

  /* --- memoria de scroll por ruta (A.scrollFor) ---------------------------- */
  const scrollMem = new Map<string, number>();
  const routeKey = (target?: string): string => {
    if (target) {
      const path = translateRoute(ctx.slug, target);
      if (path) return path;
    }
    if (typeof location === "undefined") return "";
    return location.pathname + (location.search || "");
  };

  /* --- limpiadores y proveedores de búsqueda -------------------------------
     El cargador de bundles ENVUELVE `onTeardown` y `registerSearchProvider`
     mientras corre un bundle (igual que con `registerView`), para atribuirle lo
     que registre y poder deshacerlo al descargarlo. Lo que se registre fuera de
     una carga cae en estas listas, que corren al desinstalar el runtime. */
  let teardowns: Array<() => void> = [];
  let providers: SearchProvider[] = [];
  let progress: ProgressProvider[] = [];
  /* Los suscriptores son del ANFITRIÓN (la barra de cada división), no del
     bundle: sobreviven a cargar y descargar bundles y se sueltan al desinstalar. */
  const progressListeners = new Set<() => void>();

  const d = derive(ctx);

  const app = {
    // --- materia ---
    SUBJECT: { slug: ctx.slug, config: ctx.config },
    subject: ctx.slug,
    theme: ctx.theme,
    PAGES: d.PAGES,
    CONTENT: d.CONTENT,
    BY_SLUG: d.BY_SLUG,
    UNITS: d.UNITS,
    TYPES: d.TYPES,
    unitOrder: d.unitOrder,
    TYPE_LABEL: d.TYPE_LABEL,
    STUDY: {} as Record<string, unknown>,
    DATA: {} as Record<string, unknown>,

    unitShort(key: string): string {
      return divisionShort(ctx.config, key);
    },
    unitMeta(key: string): { key: string; name: string; color: string } {
      const hit = app.UNITS.find((u) => u.key === key);
      if (hit) return hit;
      return { key, name: divisionLong(ctx.config, key), color: divisionColor(ctx.config, key) };
    },
    isStudied(slug: string): boolean {
      return ctx.studied.has(slug);
    },

    // --- navegación ---
    go(target: string, opts?: { replace?: boolean }): void {
      const path = translateRoute(ctx.slug, target);
      if (path === null) {
        if (typeof window !== "undefined") window.open(String(target), "_blank", "noopener");
        return;
      }
      /* Enlace a la MISMA vista con el MISMO argumento y otra consulta
         (`#/formularios?sel=1`, `#/ejercicios/5/guia?ej=…`): el host no
         reinvoca la vista —solo mira el argumento— así que la ruta cambiaba y
         el documento se quedaba como estaba. En el baseline cualquier cambio de
         ruta disparaba `hashchange` y la vista se volvía a dibujar; acá se pide
         ese redibujo explícitamente. Un cambio de ARGUMENTO no entra: de eso se
         encarga el host sin desmontar, que es lo que conserva lo escrito al
         saltar de sección (brecha herr-13). */
      const redraw = isQueryOnlyChange(ctx.slug, path);
      ctx.navigate(path, opts);
      if (redraw) ctx.render?.();
    },
    /**
     * Migas de la vista. El baseline las escribe con `hash` (`#/taller`) y el
     * contrato las quiere con `href` (ruta del SPA): se aceptan las dos formas y
     * el host recibe siempre una ruta navegable (brecha herr-08).
     */
    setCrumbs(items: Crumb[]): void {
      const list = (items || []).map((c) => {
        if (c.href) return { label: c.label, href: c.href };
        if (!c.hash) return { label: c.label };
        const href = translateRoute(ctx.slug, c.hash);
        return href ? { label: c.label, href } : { label: c.label };
      });
      ctx.setCrumbs?.(list);
    },
    setTitle(label: string): void {
      ctx.setTitle?.(String(label || ""));
    },
    markActivity(): void {
      ctx.markActivity?.();
    },
    render(): void {
      ctx.render?.();
    },
    toast(message: string, tone?: "ok" | "bad"): void {
      ctx.toast(message, tone);
    },

    // --- render ---
    escapeHtml,
    icon,
    katex: katexCompat,
    KATEX_MACROS,
    renderMarkdown: markdown.renderMarkdown,
    renderMathHtml: markdown.renderMathHtml,
    joinInlineMath: markdown.joinInlineMath,
    rich: markdown.rich,
    enhanceDoc: markdown.enhanceDoc,
    refitFormulas: markdown.refitFormulas,
    figureMarkup,
    emptyState,
    backBar,
    normText,
    texPlain,
    fmt,
    fmt4,
    fmt6,
    cssVar,
    withAlpha,
    shuffle,

    // --- consulta del DOM (S-16) ---
    $(sel: string, explicit?: ParentNode | null): HTMLElement | null {
      /* `#main` y compañía SON el contenedor de la vista: el baseline los usaba
         para redibujarse entero (herr-01). */
      if (!explicit && VIEW_ROOT_SELECTORS.has(String(sel).trim()) && root && root.isConnected) return root;
      const where = scope(explicit);
      return where ? where.querySelector<HTMLElement>(sel) : null;
    },
    $$(sel: string, explicit?: ParentNode | null): HTMLElement[] {
      if (!explicit && VIEW_ROOT_SELECTORS.has(String(sel).trim()) && root && root.isConnected) return [root];
      const where = scope(explicit);
      return where ? Array.prototype.slice.call(where.querySelectorAll<HTMLElement>(sel)) : [];
    },
    viewRoot(): HTMLElement | null {
      return root && root.isConnected ? root : null;
    },

    // --- almacenamiento, ruta y estado (primitivas del baseline) ---
    LS,
    parseRoute(): CompatRoute {
      if (typeof location === "undefined") return { view: "inicio", arg: "", query: {}, qs: "" };
      return parseLocation(ctx.slug, location.pathname, location.search);
    },
    setQuery(patch: Record<string, string | number | boolean | null | undefined>): Record<string, string> {
      const current = app.parseRoute();
      const q: Record<string, string> = { ...current.query };
      Object.keys(patch || {}).forEach((k) => {
        const v = patch[k];
        /* Solo null/undefined borran la clave; `""` fija un parámetro vacío. */
        if (v == null) delete q[k];
        else q[k] = String(v);
      });
      const qs = serializeQuery(q);
      if (typeof location !== "undefined" && typeof history !== "undefined") {
        /* El argumento de la vista viaja en la ruta o como `?arg=`: no es un
           parámetro de la vista y no puede perderse al fusionar la query. */
        const keep = new URLSearchParams(location.search).get("arg");
        const extra = keep == null ? "" : (qs ? "&" : "") + "arg=" + encodeURIComponent(keep);
        const dest = location.pathname + (qs || extra ? "?" + qs + extra : "");
        if (dest !== location.pathname + location.search) {
          try {
            /* `replaceState`: NO dispara navegación, NO re-renderiza y NO empuja
               historial, igual que el `setQuery` del baseline. */
            history.replaceState(history.state, "", dest);
          } catch {
            /* sin permiso de historial: la query se queda como estaba */
          }
        }
      }
      return q;
    },
    viewState(id: string): Record<string, unknown> {
      const key = String(id || "");
      const hit = viewStates[key];
      if (hit) return hit;
      const fresh: Record<string, unknown> = {};
      viewStates[key] = fresh;
      return fresh;
    },
    scrollFor(target?: string): number | undefined {
      return scrollMem.get(routeKey(target));
    },
    localToday(): string {
      const d = new Date();
      return (
        d.getFullYear() +
        "-" +
        String(d.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(d.getDate()).padStart(2, "0")
      );
    },
    today(): string {
      return new Date().toISOString().slice(0, 10);
    },

    // --- ciclo de vida del bundle ---
    /**
     * Fuera de la carga de un bundle no hay a qué base resolver: se devuelve la
     * ruta tal cual. El cargador la reemplaza mientras corren los scripts del
     * bundle (igual que `registerView`), así que una vista que necesite cargar
     * algo perezosamente tiene que guardarse la URL AL EVALUARSE.
     */
    toolFileUrl(file: string): string {
      return String(file || "");
    },
    onTeardown(fn: () => void): void {
      if (typeof fn === "function") teardowns.push(fn);
    },
    registerSearchProvider(fn: SearchProvider): void {
      if (typeof fn === "function") providers.push(fn);
    },
    registerProgressProvider(provider: ProgressProvider): void {
      if (provider && typeof provider.stepsOf === "function") progress.push(provider);
    },
    progressChanged(): void {
      progressListeners.forEach((fn) => {
        try {
          fn();
        } catch (e) {
          /* un suscriptor que falla no puede impedir que se enteren los demás */
          if (typeof console !== "undefined") console.error("onProgressChange:", e);
        }
      });
    },

    // --- paleta ⌘K del shell (S-16) ---
    paletteOpen(): boolean {
      if (typeof ctx.paletteOpen === "function") return !!ctx.paletteOpen();
      /* Sin gancho del host: la marca que el shell puede dejar en la raíz. Es
         el mismo camino que ya prueba `lookup.js` por su cuenta. */
      const document_ = doc() as Document | null;
      return !!document_?.querySelector("[data-palette-open]");
    },
    openPalette(): void {
      if (typeof ctx.openPalette === "function") {
        ctx.openPalette();
        return;
      }
      if (typeof window === "undefined" || typeof CustomEvent !== "function") return;
      window.dispatchEvent(new CustomEvent(PALETTE_EVENT));
    },

    // --- registro de vistas y acciones ---
    VIEWS: {} as Record<string, ViewFn>,
    ACTIONS: {} as Record<string, (el: HTMLElement, ev: Event) => void>,
    registerView(id: string, fn: ViewFn): void {
      if (!id || typeof fn !== "function") return;
      app.VIEWS[id] = fn;
    },
    view(id: string): ViewFn | null {
      return app.VIEWS[id] || null;
    },
    registerAction(name: string, fn: (el: HTMLElement, ev: Event) => void): void {
      if (!name || typeof fn !== "function") return;
      app.ACTIONS[name] = fn;
    },
    runAction(name: string, el: HTMLElement, ev: Event): boolean {
      const fn = app.ACTIONS[name];
      if (!fn) return false;
      fn(el, ev);
      return true;
    },
    setRedraw(fn: (() => void) | null): void {
      redrawFn = fn || null;
    },
    redraw(): void {
      if (redrawFn) redrawFn();
    },

    // --- dibujo (se completan más abajo con los motores portados) ---
    FIGURES: {} as RuntimeApp["FIGURES"],
    registerFigure: (() => undefined) as RuntimeApp["registerFigure"],
    mountFigures: (() => 0) as RuntimeApp["mountFigures"],
    unmountFigures: (() => 0) as RuntimeApp["unmountFigures"],
    Fig: {} as Record<string, unknown>,
    Plot: {} as Record<string, unknown>,
    M: math as unknown as CompatApp["M"],
    MathLib: math,
  } as RuntimeApp;

  // `figures.js` y `plot.js` se instalan sobre el propio `App`, como en el
  // baseline (leen `A.cssVar`, `A.katex`, `A.escapeHtml`…).
  createFigures(app);
  createPlot(app);

  function setContext(next: SubjectContext): void {
    /* Cambiar de materia borra lo que era de la anterior: el estado por vista es
       de la materia abierta, no del runtime. */
    if (next.slug !== ctx.slug) {
      viewStates = {};
      scrollMem.clear();
    }
    ctx = next;
    const nd = derive(ctx);
    app.SUBJECT = { slug: ctx.slug, config: ctx.config };
    app.subject = ctx.slug;
    app.theme = ctx.theme;
    app.PAGES = nd.PAGES;
    app.CONTENT = nd.CONTENT;
    app.BY_SLUG = nd.BY_SLUG;
    app.UNITS = nd.UNITS;
    app.TYPES = nd.TYPES;
    app.unitOrder = nd.unitOrder;
    app.TYPE_LABEL = nd.TYPE_LABEL;
  }

  function setTheme(theme: ThemeId): void {
    ctx = { ...ctx, theme };
    app.theme = theme;
    app.redraw();
  }

  function setViewRoot(el: HTMLElement | null): void {
    root = el;
  }

  /** Anota dónde quedó el scroll de la ruta actual (lo llama el runtime). */
  function saveScroll(y: number): void {
    const key = routeKey();
    if (key) scrollMem.set(key, y);
  }

  /** Corre y olvida los limpiadores registrados fuera de un bundle. */
  function runTeardowns(): void {
    const list = teardowns;
    teardowns = [];
    list.forEach((fn) => {
      try {
        fn();
      } catch (e) {
        if (typeof console !== "undefined") console.error("onTeardown:", e);
      }
    });
    providers = [];
    progress = [];
    progressListeners.clear();
  }

  return {
    app,
    setContext,
    context: () => ctx,
    setTheme,
    setViewRoot,
    viewRoot: () => root,
    markdown,
    saveScroll,
    runTeardowns,
    searchProviders: () => providers.slice(),
    progressProviders: () => progress.slice(),
    onProgressChange: (fn: () => void) => {
      progressListeners.add(fn);
      return () => {
        progressListeners.delete(fn);
      };
    },
  };
}

/** División efectiva de una página, con el criterio del contrato. */
export function unitOf(config: SubjectConfigLoose, page: PageMeta): string {
  return divisionOf(config, page);
}
