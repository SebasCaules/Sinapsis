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
  /**
   * Posición de cada división en el programa (`{ "1": 0, "2": 1, … }`). Es el
   * orden de `UNITS` en forma de tabla: sirve para ordenar por unidad sin
   * recorrer el arreglo en cada comparación.
   */
  unitOrder: Record<string, number>;
  /** Rótulo de cada tipo de página (`{ concepto: "Concepto", … }`), tabla de `TYPES`. */
  TYPE_LABEL: Record<string, string>;
  unitShort(key: string): string;
  unitMeta(key: string): { key: string; name: string; color: string };
  isStudied(slug: string): boolean;
  /** Datos JSON del bundle (`manifest.data`), fusionados por clave de archivo. */
  STUDY: Record<string, unknown>;
  DATA: Record<string, unknown>;

  // --- navegación ---
  /** Acepta rutas del baseline (`#/p/slug`, `#/explorador/x`, `#/unidad/3`) y del SPA (`/m/...`). */
  go(target: string, opts?: { replace?: boolean }): void;
  /**
   * Migas de la vista. `href` es la ruta del SPA; `hash` es el alias del baseline
   * (`#/taller`) y lo traduce el runtime antes de entregárselas al host. El
   * último tramo, sin destino, es la pantalla actual.
   */
  setCrumbs(items: Array<{ label: string; href?: string; hash?: string }>): void;
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
  /** Normalización de búsqueda: minúsculas y sin diacríticos. */
  normText(s: string): string;
  /**
   * Texto buscable de una fórmula LaTeX: se quitan barras, llaves y `\dfrac`
   * para que «sqrt n» u «overline x» encuentren la expresión.
   */
  texPlain(tex: string): string;
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

  // --- contenedor de la vista montada ---
  /**
   * El nodo que el host le prestó a la vista (el que ata `bindView`), o null si
   * no hay ninguna montada. Es el reemplazo de `$("#main")` del baseline: en la
   * plataforma el `#main` del shell NO es el contenedor de la vista, así que una
   * acción que quiera redibujarse entera tiene que pedir ESTA raíz.
   */
  viewRoot(): HTMLElement | null;

  // --- almacenamiento local (compat: `A.LS` del baseline) ---
  /**
   * `localStorage` con prefijo por materia: dos materias que usen la misma clave
   * («pe.exEstado») no se pisan, y borrar una materia no toca a las demás. Los
   * valores viajan como JSON, igual que en el baseline; cualquier fallo de
   * almacenamiento (modo privado, cuota) se traga y devuelve el valor por
   * omisión.
   */
  LS: CompatStorage;

  // --- ruta y query (compat: `A.parseRoute` / `A.setQuery` del baseline) ---
  /**
   * La ruta REAL del SPA (`/m/<materia>/t/<vista>/<arg>?x=1`) leída con la
   * gramática del baseline: `{ view, arg, query, qs }`. Las rutas propias de la
   * plataforma se devuelven con el nombre que tenían en el baseline (`p`,
   * `unidad`, `wiki`, `plan`, `grafo`, `apuntes`…).
   */
  parseRoute(): CompatRoute;
  /**
   * Fusiona parámetros en la query de la URL actual SIN re-renderizar ni empujar
   * historial (`history.replaceState`), como en el baseline: `null`/`undefined`
   * borran la clave y `""` deja el parámetro vacío. Devuelve la query resultante.
   */
  setQuery(patch: Record<string, string | number | boolean | null | undefined>): Record<string, string>;
  /**
   * Estado por vista, en memoria del runtime: sobrevive a la navegación y al
   * cambio de tema (que puede volver a montar la vista) pero no al refresco.
   */
  viewState(id: string): Record<string, unknown>;
  /**
   * Posición de scroll guardada para esa ruta (la del baseline, `#/calc/ic`, o la
   * del SPA), o `undefined` si no hay ninguna. Sirve para distinguir una llegada
   * nueva de un regreso con Atrás.
   */
  scrollFor(route?: string): number | undefined;

  // --- fechas (compat) ---
  /** Día LOCAL de hoy, `AAAA-MM-DD`. */
  localToday(): string;
  /** Día UTC de hoy, `AAAA-MM-DD` (el `today()` del baseline). */
  today(): string;

  // --- ciclo de vida y anfitrión ---
  /**
   * Registra un limpiador del BUNDLE: corre cuando se descarga (salir de la
   * materia, cambiar de materia, desinstalar el runtime). Es lo que necesita un
   * bundle que cuelga marcado de `document.body` o ata teclas en `document`
   * para no duplicarse al reentrar.
   */
  onTeardown(fn: () => void): void;
  /**
   * Registra un proveedor de resultados para la paleta ⌘K del shell. El registro
   * es del bundle y se olvida al descargarlo; la paleta lo consume cuando la
   * materia está abierta.
   */
  registerSearchProvider(fn: SearchProvider): void;
  /**
   * Registra un proveedor de pasos de progreso. El registro es del bundle y se
   * olvida al descargarlo; la barra de cada división suma sus pasos a las
   * páginas leídas. Para que la plataforma los tenga sin que nadie abra la
   * vista, el manifiesto declara `progress: true`.
   */
  registerProgressProvider(provider: ProgressProvider): void;
  /**
   * Avisa de que el estado de los pasos cambió (se marcó un ejercicio). El
   * anfitrión vuelve a consultar a los proveedores y redibuja las barras.
   */
  progressChanged(): void;
  /**
   * URL de un archivo del bundle que está corriendo (`vendor/x.js.txt` →
   * `/api/subjects/<materia>/tools/<bundle>/files/vendor/x.js.txt`). Es lo que
   * necesita un bundle que carga algo PEREZOSAMENTE —una biblioteca pesada que
   * solo hace falta en una pantalla— en vez de declararlo en `scripts`, donde
   * se cargaría siempre. Solo resuelve mientras corren los scripts del bundle:
   * la vista tiene que guardarse la URL al evaluarse, no pedirla después.
   * Fuera de una carga devuelve la ruta tal cual.
   */
  toolFileUrl(file: string): string;
  /** Anota actividad de estudio de HOY (racha del inicio). */
  markActivity(): void;
  /**
   * Título de la pestaña que pide la vista. El anfitrión lo compone con el
   * nombre de la materia: el bundle NO escribe `document.title`.
   */
  setTitle(label: string): void;
}

/** `A.LS`: `localStorage` con prefijo por materia y valores JSON. */
export interface CompatStorage {
  /** La clave REAL en `localStorage` (`sinapsis.<materia>.rt.<nombre>`). */
  key(name: string): string;
  /** Valor JSON guardado, o `fallback` si no hay o no se pudo leer. */
  get<T = unknown>(name: string, fallback?: T): T;
  /** Como `get`, pero garantiza un objeto plano (nunca null ni array). */
  getObj(name: string): Record<string, unknown>;
  set(name: string, value: unknown): void;
  del(name: string): void;
}

/** Ruta del baseline leída de la URL real del SPA. */
export interface CompatRoute {
  /** Vista: `inicio`, `p`, `unidad`, `wiki`, `plan`, o el id de la herramienta. */
  view: string;
  /** Argumento de la vista (`""` si no hay). */
  arg: string;
  /** Parámetros de la query, ya decodificados. */
  query: Record<string, string>;
  /** La query cruda, sin el `?`. */
  qs: string;
}

/** Un resultado que un bundle le ofrece a la paleta ⌘K. */
export interface SearchHit {
  label: string;
  /** Segunda línea (grupo, unidad, aclaración). */
  sub?: string;
  /** Destino en la gramática de `App.go` (`#/calc/ic`, `/m/proba/p/slug`). */
  target: string;
  /** Rótulo del grupo en la paleta (por omisión, «Herramientas»). */
  group?: string;
}

/** Proveedor de resultados de la paleta: recibe lo tecleado y devuelve sus aciertos. */
export type SearchProvider = (query: string) => SearchHit[];

/**
 * Un paso de progreso que un bundle suma a la barra de una división: un
 * ejercicio de la guía, una tarjeta de un mazo propio, un simulacro. Cada paso
 * vale UNO, igual que una página leída.
 */
export interface ProgressStep {
  /** Identificador estable dentro del proveedor (no se muestra). */
  id: string;
  /** Rótulo del paso, por si el anfitrión lo lista. */
  label: string;
  /** ¿Está hecho? Lo decide el bundle con su propio criterio. */
  done: boolean;
  /**
   * Grupo al que pertenece el paso dentro de la división («Guía», «Lutzio»,
   * «Parciales»). El anfitrión dibuja una tarjeta por grupo.
   */
  group?: string;
  /**
   * Destino del grupo, en la gramática de rutas del SPA
   * (`/m/<materia>/t/<vista>?arg=…`). Los pasos de un mismo grupo comparten
   * destino: el anfitrión usa el del primero.
   */
  to?: string;
}

/**
 * Proveedor de pasos de progreso. `stepsOf` se consulta CADA VEZ que la
 * plataforma recalcula el progreso, así que devuelve el estado del momento; el
 * bundle avisa de un cambio con `App.progressChanged()`.
 */
export interface ProgressProvider {
  /** Identificador del proveedor dentro del bundle (`"ejercicios"`). */
  id: string;
  /** Rótulo en plural y minúsculas para el desglose («ejercicios»). */
  label: string;
  /** Pasos de esa división; arreglo vacío si el bundle no aporta nada ahí. */
  stepsOf(division: string): ProgressStep[];
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
  /**
   * Proveedores de resultados que registraron los bundles cargados
   * (`App.registerSearchProvider`). La paleta ⌘K del shell los consulta; si no
   * hay bundles, la lista está vacía.
   */
  searchProviders(): SearchProvider[];
  /**
   * Proveedores de progreso que registraron los bundles cargados
   * (`App.registerProgressProvider`). La barra de cada división los consulta;
   * si no hay ninguno, la lista está vacía y el progreso son solo páginas.
   */
  progressProviders(): ProgressProvider[];
  /**
   * Se suscribe a `App.progressChanged()`; devuelve el desuscriptor. El
   * anfitrión vuelve a pedir los pasos y redibuja.
   */
  onProgressChange(fn: () => void): () => void;
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
    /**
     * KaTeX como global, que es como lo cargaba el `index.html` del baseline y
     * como lo asumen los bundles (`figures.js` → `putTex` compone con
     * `window.katex`). Lo publica el runtime al instalarse y lo retira al
     * desmontarse. Sin tipo: el contrato no depende de `katex`, y quien lo usa
     * ya lo hace con acceso laxo.
     */
    katex?: unknown;
  }
}
