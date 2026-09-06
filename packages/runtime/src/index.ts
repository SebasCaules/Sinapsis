/* ============================================================
   @sinapsis/runtime — runtime del navegador para bundles de materia (N0-41/42).

   `installRuntime(ctx)` arma el `App` de compatibilidad (mismos nombres que el
   baseline de Proba), instala el motor de figuras y el de gráficos, y publica
   `window.App`, `window.M` y `window.SinapsisRuntime`. A partir de ahí, un
   bundle de la materia —scripts clásicos que el CLI construyó— registra sus
   vistas con `App.registerView` y sus figuras con `App.registerFigure`.

   Uso desde la plataforma (apps/web):
       const rt = installRuntime({ slug, config, pages, studied, navigate, toast, theme });
       await rt.loadBundle({ id: "figuras", base, scripts, styles, data });
       rt.App.mountFigures(articleEl);      // dibuja los `[data-fig]` del documento
       rt.setTheme("claustro");             // redibuja lo que pidió setRedraw
       rt.updateContext({ ...ctx, pages }); // cambiar de materia sin recargar
       uninstallRuntime();

   El marcado que espera `mountFigures` lo emite `renderMarkdown` para el
   callout `> [!figura] <id>` (ver `markdown.ts`):
       <figure class="doc-figure" data-fig="ID">
         <div class="fig-host"></div><figcaption>…</figcaption>
       </figure>
   ============================================================ */
import type { SinapsisRuntime, ThemeId, ViewFn } from "@sinapsis/contract";
import { createCompatApp, type CompatHandle, type RuntimeApp, type SubjectContext } from "./compat.js";
import { createLoader, type BundleInfo, type BundleLoader } from "./loader.js";

export type { SubjectContext, RuntimeApp, Crumb, KatexCompat } from "./compat.js";
export type { BundleInfo, BundleLoader } from "./loader.js";
export type { MathLib, Matrix } from "./math.js";
export type { MarkdownApi, MarkdownContext } from "./markdown.js";
export { createCompatApp, translateRoute, fmt, fmt4, fmt6, cssVar, withAlpha, emptyState, backBar } from "./compat.js";
export { createLoader, resolveUrl, dataKey } from "./loader.js";
export { createMath } from "./math.js";
export { createFigures } from "./figures.js";
export { createPlot } from "./plot.js";
export { icon, ICONS } from "./icons.js";
export {
  KATEX_MACROS,
  createMarkdown,
  escapeHtml,
  enhanceDoc,
  figureMarkup,
  joinInlineMath,
  katexRender,
  refitFormulas,
  renderMathHtml,
  rich,
} from "./markdown.js";

/** Lo que se publica en `window.SinapsisRuntime` (contrato + mandos del host). */
export interface Runtime extends SinapsisRuntime {
  App: RuntimeApp;
  /** Cambia el tema y dispara los redibujos registrados con `setRedraw`. */
  setTheme(theme: ThemeId): void;
  /** Cambia de materia (o refresca páginas/leídas) sin recrear el runtime. */
  updateContext(ctx: SubjectContext): void;
  /** Desmonta el runtime: quita los bundles, los listeners y los globales. */
  uninstall(): void;
}

let current: Runtime | null = null;
let currentTeardown: (() => void) | null = null;

/** Runtime instalado, o null. */
export function getRuntime(): Runtime | null {
  return current;
}

/**
 * Instala el runtime para una materia. Si ya había uno, lo desmonta primero
 * (una sola materia abierta a la vez, como en el baseline).
 */
export function installRuntime(ctx: SubjectContext): Runtime {
  if (current) uninstallRuntime();

  const handle: CompatHandle = createCompatApp(ctx);
  const app = handle.app;
  const loader: BundleLoader = createLoader(app);
  const themeListeners = new Set<(theme: ThemeId) => void>();

  // Delegación de `data-action`: el baseline ata sus botones con
  // `App.registerAction(nombre, fn)` y `data-action="nombre"` en el marcado.
  const onClick = (ev: Event): void => {
    const target = ev.target as Element | null;
    if (!target || !target.closest) return;
    const el = target.closest("[data-action]") as HTMLElement | null;
    if (!el) return;
    const name = el.getAttribute("data-action");
    if (!name) return;
    app.runAction(name, el, ev);
  };
  if (typeof document !== "undefined") document.addEventListener("click", onClick);

  const runtime: Runtime = {
    version: 1,
    get subject(): string | null {
      return handle.context().slug || null;
    },
    get theme(): ThemeId {
      return app.theme;
    },
    App: app,
    loadBundle(info: BundleInfo): Promise<void> {
      return loader.loadBundle(info);
    },
    unloadBundle(id: string): void {
      loader.unloadBundle(id);
    },
    view(id: string): ViewFn | null {
      return app.view(id);
    },
    onThemeChange(fn: (theme: ThemeId) => void): () => void {
      themeListeners.add(fn);
      return () => themeListeners.delete(fn);
    },
    setTheme(theme: ThemeId): void {
      handle.setTheme(theme);
      themeListeners.forEach((fn) => {
        try {
          fn(theme);
        } catch (e) {
          if (typeof console !== "undefined") console.error("onThemeChange:", e);
        }
      });
    },
    updateContext(next: SubjectContext): void {
      handle.setContext(next);
    },
    uninstall(): void {
      uninstallRuntime();
    },
  };

  currentTeardown = () => {
    if (typeof document !== "undefined") document.removeEventListener("click", onClick);
    themeListeners.clear();
    loader.unloadAll();
    if (typeof window !== "undefined") {
      if (window.App === (app as unknown as Window["App"])) delete window.App;
      if (window.M === (app.M as unknown as Window["M"])) delete window.M;
      if (window.SinapsisRuntime === runtime) delete window.SinapsisRuntime;
    }
  };

  current = runtime;
  if (typeof window !== "undefined") {
    window.App = app;
    window.M = app.M;
    window.SinapsisRuntime = runtime;
  }
  return runtime;
}

/** Desmonta el runtime instalado (idempotente). */
export function uninstallRuntime(): void {
  const teardown = currentTeardown;
  current = null;
  currentTeardown = null;
  if (teardown) teardown();
}
