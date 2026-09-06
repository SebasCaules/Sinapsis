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
  type FigureMeta,
  type PageMeta,
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

/** Miga de pan: el último tramo, sin `href`, es la pantalla actual. */
export interface Crumb {
  label: string;
  href?: string;
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
  markdown: MarkdownApi;
}

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
  return /^(https?:)?\/\//i.test(t) || /^mailto:/i.test(t);
}

/**
 * Traduce una ruta del baseline a una ruta del SPA:
 *   `#/p/slug`         → `/m/<materia>/p/slug`
 *   `#/unidad/3`       → `/m/<materia>/d/3`   (también `#/division/3`)
 *   `#/wiki`           → `/m/<materia>/wiki`
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
  const q = arg ? "?arg=" + encodeURIComponent(arg) + (qs ? "&" + qs : "") : tail;
  return routes.tool(subject, view) + q;
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
  return { PAGES, CONTENT, BY_SLUG, UNITS, TYPES };
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
      ctx.navigate(path, opts);
    },
    setCrumbs(items: Crumb[]): void {
      ctx.setCrumbs?.(items);
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
    fmt,
    fmt4,
    fmt6,
    cssVar,
    withAlpha,
    shuffle,

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
  }

  function setTheme(theme: ThemeId): void {
    ctx = { ...ctx, theme };
    app.theme = theme;
    app.redraw();
  }

  return { app, setContext, context: () => ctx, setTheme, markdown };
}

/** División efectiva de una página, con el criterio del contrato. */
export function unitOf(config: SubjectConfigLoose, page: PageMeta): string {
  return divisionOf(config, page);
}
