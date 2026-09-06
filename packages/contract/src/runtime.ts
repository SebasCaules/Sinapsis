/**
 * Contrato del RUNTIME del navegador para los bundles de herramientas (Sprint 3).
 *
 * La plataforma instala `window.SinapsisRuntime` y, por compatibilidad con el baseline
 * (la app de Proba: vistas y figuras escritas contra `window.App` y `window.M`),
 * también `window.App` y `window.M` mientras hay una materia abierta. Los bundles son
 * scripts clásicos (IIFE) que se cargan después del runtime y registran vistas con
 * `App.registerView(id, fn)` y figuras con `App.registerFigure(id, draw, meta)`.
 *
 * Solo tipos: la implementación vive en `packages/runtime` (web).
 */
import type { PageMeta, SubjectConfigLoose, ThemeId } from "./index.js";

/** Función de vista del baseline: escribe en `main` y ata sus propios listeners. */
export type ViewFn = (main: HTMLElement, arg?: string) => void | (() => void);

/**
 * Figura interactiva: dibuja dentro de `host` (SVG/canvas) y puede devolver un limpiador.
 * Firma del baseline: `draw(host, api, meta)`.
 */
export type FigureDraw = (host: HTMLElement, ctx: FigureContext, meta?: FigureMeta) => void | (() => void);
export interface FigureMeta {
  /** Epígrafe por defecto si el callout no trae texto. */
  caption?: string;
  /** Alto sugerido en px. */
  height?: number;
  [extra: string]: unknown;
}
/** `api` que recibe cada figura (el del baseline más tema, tokens y redibujo). */
export interface FigureContext {
  id: string;
  host: HTMLElement;
  figure: HTMLElement;
  /** Helpers de dibujo (`App.Fig`). */
  Fig: Record<string, unknown>;
  /** Estado por instancia de figura (controles interactivos). */
  state: Record<string, unknown>;
  setState(patch: Record<string, unknown>): void;
  /** Registra un limpiador (listeners, timers) que corre al desmontar. */
  cleanup(fn: () => void): void;
  theme: ThemeId;
  /** Lee un token CSS resuelto (`--primary` → "#7c2230"). */
  cssVar(name: string): string;
  /** Vuelve a dibujar (p. ej. tras cambiar el tema). */
  redraw(): void;
}

/** `App.katex`: invocable como en el baseline (`katex(tex, display)`) y con `renderToString`. */
export interface KatexLike {
  (tex: string, display?: boolean): string;
  renderToString(tex: string, opts?: Record<string, unknown>): string;
}

/**
 * Superficie `window.App` que garantiza el runtime (nombres del baseline). Los
 * bundles de Proba usan exactamente estos miembros; una materia nueva puede usar
 * cualquiera. Lo marcado «compat» existe para no reescribir código del baseline.
 */
export interface CompatApp {
  // --- registro ---
  registerView(id: string, fn: ViewFn): void;
  registerAction(name: string, fn: (el: HTMLElement, ev: Event) => void): void; // compat: data-action
  registerFigure(id: string, draw: FigureDraw, meta?: FigureMeta): void;
  mountFigures(container: HTMLElement | Document): number;
  unmountFigures(container: HTMLElement | Document): number;
  setRedraw(fn: (() => void) | null): void; // compat: la vista pide redibujo al cambiar tema
  FIGURES: Record<string, { draw: FigureDraw; meta: FigureMeta }>;

  // --- datos de la materia (solo lectura) ---
  SUBJECT: { slug: string; config: SubjectConfigLoose };
  PAGES: PageMeta[];
  CONTENT: PageMeta[];
  BY_SLUG: Record<string, PageMeta>;
  UNITS: Array<{ key: string; name: string; color: string }>;
  TYPES: Array<{ key: string; label: string }>;
  unitShort(key: string): string;
  unitMeta(key: string): { key: string; name: string; color: string };
  isStudied(slug: string): boolean;
  /** Datos JSON del bundle (`manifest.data`), fusionados por clave de archivo. */
  STUDY: Record<string, unknown>;
  DATA: Record<string, unknown>;

  // --- navegación ---
  /** Acepta rutas del baseline (`#/p/slug`, `#/explorador/x`, `#/unidad/3`) y del SPA (`/m/...`). */
  go(target: string, opts?: { replace?: boolean }): void;
  setCrumbs(items: Array<{ label: string; href?: string }>): void;
  render(): void; // compat: re-render de la vista actual
  toast(message: string, tone?: "ok" | "bad"): void;

  // --- render ---
  escapeHtml(s: string): string;
  icon(name: string, size?: number): string;
  katex: KatexLike;
  KATEX_MACROS: Record<string, string>;
  /** Markdown → HTML (math, wikilinks, callouts), como el baseline. */
  renderMarkdown(md: string, currentSlug?: string): string;
  renderMathHtml(html: string): string;
  /** Texto con `$…$` → HTML con KaTeX en línea. */
  rich(text: string): string;
  enhanceDoc(root: HTMLElement): void;
  emptyState(title: string, sub?: string): string;
  backBar(href: string, label: string): string;
  fmt(n: number, digits?: number): string;
  cssVar(name: string): string;
  withAlpha(color: string, alpha: number): string;
  /** NO lo provee el runtime: lo instala el bundle de Proba (`lookup.js`) y solo existe si un bundle lo define. */
  quickLookup?(kind: string, params: Record<string, number>): void; // compat: burbuja de valores

  // --- dibujo (portados del baseline: figures.js / plot.js) ---
  Fig: Record<string, unknown>;
  Plot: Record<string, unknown>;
  /** Biblioteca numérica (`lib-math.js` portada): funciones escalares y de matrices. */
  M: Record<string, unknown>;

  // --- consulta del DOM (compat: `$`/`$$` del baseline) ---
  /**
   * `querySelector` acotado al contenedor de la vista montada; con `root`, dentro de
   * ese nodo. Sin vista montada (o con el contenedor ya desmontado), `document`.
   */
  $(sel: string, root?: ParentNode | null): HTMLElement | null;
  /** Igual que `$`, pero devuelve un array (no una NodeList). */
  $$(sel: string, root?: ParentNode | null): HTMLElement[];

  // --- paleta ⌘K del shell ---
  /** ¿Está abierta la paleta? Es una PREGUNTA: así la usa `lookup.js` del baseline con Escape. */
  paletteOpen(): boolean;
  /** Abre la paleta ⌘K del shell. */
  openPalette(): void;
}

/** Lo que la plataforma instala en `window.SinapsisRuntime`. */
export interface SinapsisRuntime {
  version: 1;
  /** Materia activa; null fuera de una materia. */
  subject: string | null;
  theme: ThemeId;
  App: CompatApp;
  /** Carga un bundle (scripts en orden + estilos) una sola vez; resuelve cuando registró sus vistas/figuras. */
  loadBundle(info: { id: string; base: string; scripts: string[]; styles: string[]; data: string[] }): Promise<void>;
  unloadBundle(id: string): void;
  /** Vista registrada por algún bundle cargado, o null. */
  view(id: string): ViewFn | null;
  onThemeChange(fn: (theme: ThemeId) => void): () => void;
  /**
   * Ata el contenedor de la vista montada: ámbito de `$`/`$$` y delegación de los
   * clics de `[data-nav]`, `[data-go]` y `a.wikilink[data-slug]` hacia `go` (sin
   * recargar la página; ⌘/Ctrl-clic y `target="_blank"` pasan de largo). Devuelve el
   * desatador, que el host llama al desmontar la vista; también limpia `setRedraw`.
   */
  bindView(container: HTMLElement): () => void;
}

declare global {
  interface Window {
    SinapsisRuntime?: SinapsisRuntime;
    App?: CompatApp;
    M?: CompatApp["M"];
  }
}
