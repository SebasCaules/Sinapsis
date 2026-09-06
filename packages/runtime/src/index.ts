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
import katex from "katex";
import type { SearchProvider, SinapsisRuntime, ThemeId, ViewFn } from "@sinapsis/contract";
import { createCompatApp, type CompatHandle, type RuntimeApp, type SubjectContext } from "./compat.js";
import { createLoader, type BundleInfo, type BundleLoader } from "./loader.js";
import { bindNav } from "./nav.js";

export type { SubjectContext, RuntimeApp, Crumb, KatexCompat } from "./compat.js";
export type { BundleInfo, BundleLoader } from "./loader.js";
export type { MathLib, Matrix } from "./math.js";
export type { MarkdownApi, MarkdownContext } from "./markdown.js";
export { createCompatApp, translateRoute, parseLocation, isQueryOnlyChange, serializeQuery, fmt, fmt4, fmt6, cssVar, withAlpha, emptyState, backBar, PALETTE_EVENT } from "./compat.js";
export { NAV_SEL, bindNav, isPlainClick, navTargetOf } from "./nav.js";
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
  /**
   * Ata el contenedor de la vista que el host acaba de montar (S-16): pasa a
   * ser el ámbito de `App.$`/`App.$$` y recibe la delegación de clics de
   * navegación (`[data-nav]`, `[data-go]`, wikilinks) hacia `App.go`.
   *
   * Devuelve el desatador, que el host DEBE llamar al desmontar la vista: es lo
   * que evita listeners duplicados al ir y volver de una pestaña, y lo que
   * impide que el `App` quede apuntando a un contenedor que ya no está.
   */
  bindView(container: HTMLElement): () => void;
  /** Desmonta el runtime: quita los bundles, los listeners y los globales. */
  uninstall(): void;
}

let current: Runtime | null = null;
let currentTeardown: (() => void) | null = null;

/**
 * `window` con `katex` como lo trata el runtime: opcional y sin tipo.
 *
 * Los tipos de `katex` traen `export as namespace katex`, o sea un global UMD
 * OBLIGATORIO y con el tipo del namespace del módulo; el `katex?: unknown` del
 * contrato se intersecta con él y `window.katex` termina siendo obligatorio (no
 * se puede `delete`) y de un tipo al que el default export no asigna. Esta vista
 * angosta es la misma que ya usa `figures.ts` para leerlo.
 */
function globals(): { katex?: unknown } {
  return window as unknown as { katex?: unknown };
}

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

  /* Memoria de scroll (`App.scrollFor`): el baseline la llevaba sobre `window`,
     pero en la plataforma quien scrollea es el `<main>` del shell. Se escucha en
     FASE DE CAPTURA porque el evento `scroll` de un elemento no burbujea, y se
     anota con un techo de una vez cada 150 ms. */
  let lastSave = 0;
  const onScroll = (ev: Event): void => {
    const now = Date.now();
    if (now - lastSave < 150) return;
    lastSave = now;
    const target = ev.target as (Element & { scrollTop?: number }) | Document | null;
    const y =
      target && (target as Element).nodeType === 1
        ? ((target as Element).scrollTop ?? 0)
        : typeof window !== "undefined"
          ? window.scrollY || 0
          : 0;
    handle.saveScroll(y);
  };
  if (typeof document !== "undefined") document.addEventListener("scroll", onScroll, true);

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
    searchProviders(): SearchProvider[] {
      /* Los de los bundles cargados más los que se hayan registrado fuera de una
         carga (una materia que instale el runtime a mano). */
      return loader.searchProviders().concat(handle.searchProviders());
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
    bindView(container: HTMLElement): () => void {
      handle.setViewRoot(container);
      const unbind = bindNav(container, (target) => app.go(target));
      return () => {
        unbind();
        /* El redibujo que registró la vista con `setRedraw` muere con ella: si
           no, un cambio de tema fuera de la herramienta seguiría llamando a la
           función de una vista ya desmontada, que dibuja sobre un contenedor
           que ya no está en el documento. */
        try {
          app.setRedraw(null);
        } catch {
          /* el runtime ya se desinstaló: no hay nada que soltar */
        }
        /* Solo se suelta si sigue siendo la raíz: si otra vista ya se montó
           encima, el desmontaje tardío de la anterior no puede borrarla. */
        if (handle.viewRoot() === container) handle.setViewRoot(null);
      };
    },
    uninstall(): void {
      uninstallRuntime();
    },
  };

  currentTeardown = () => {
    if (typeof document !== "undefined") {
      document.removeEventListener("click", onClick);
      document.removeEventListener("scroll", onScroll, true);
    }
    themeListeners.clear();
    handle.setViewRoot(null);
    /* Los bundles se descargan (y con ellos corren SUS limpiadores) y después
       los que se registraron fuera de una carga: nada del material de la materia
       puede sobrevivir a salir de ella (brecha herr-04). */
    loader.unloadAll();
    handle.runTeardowns();
    if (typeof window !== "undefined") {
      if (window.App === (app as unknown as Window["App"])) delete window.App;
      if (window.M === (app.M as unknown as Window["M"])) delete window.M;
      if (window.SinapsisRuntime === runtime) delete window.SinapsisRuntime;
      // solo se retira el que publicó ESTE runtime: si lo puso otro, se respeta
      const g = globals();
      if (g.katex === katex) delete g.katex;
    }
  };

  current = runtime;
  if (typeof window !== "undefined") {
    window.App = app;
    window.M = app.M;
    window.SinapsisRuntime = runtime;
    /* El baseline cargaba KaTeX como global desde `index.html` y los bundles lo
       asumen: `figures.js` → `putTex` compone con `window.katex` y, sin el
       global, las fórmulas de las figuras salen como LaTeX crudo. Se publica
       SOLO si nadie más lo puso (una página que traiga su propio KaTeX manda), y
       el teardown lo retira. Con esto `putTex` queda verbatim, con sus macros
       propias, que es lo que pide P4-1. */
    const g = globals();
    if (!g.katex) g.katex = katex;
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
