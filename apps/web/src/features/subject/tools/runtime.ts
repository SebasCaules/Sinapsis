/**
 * Costura ÚNICA con `@sinapsis/runtime` (N0-41): el paquete que instala
 * `window.SinapsisRuntime` / `window.App` y carga los bundles de la materia.
 *
 * Toda la web habla con el runtime a través de este módulo, y por dos motivos:
 *
 *  1. El runtime es PESADO (KaTeX, marked, el motor de figuras y el de gráficos)
 *     y una materia sin herramientas no tiene por qué pagarlo: se carga con un
 *     `import()` diferido, la primera vez que se entra en una materia.
 *  2. Si el paquete no resuelve —o el navegador falla al traerlo— la materia
 *     sigue funcionando como en el Sprint 2: «Próximamente» en `/t/:tool` y el
 *     epígrafe de siempre en el lector. Ninguna vista de la plataforma se cae
 *     por un bundle que no está (decisión D4-1).
 *
 * Los tipos SÍ son los del paquete (`Runtime`, `SubjectContext`): acá no se
 * reinventa el contrato, solo se difiere la carga.
 */
import { toolFileUrl, type ToolInfo } from "@sinapsis/contract";
import type { BundleInfo, Crumb, Runtime, SubjectContext } from "@sinapsis/runtime";

export type RuntimeApi = Runtime;
export type RuntimeContext = SubjectContext;
export type RuntimeCrumb = Crumb;

/**
 * Lo que la web usa del módulo. Es un subconjunto declarado a mano —y no
 * `typeof import(...)`— para que el compilador verifique que el paquete lo
 * cumple y para que un doble de prueba no tenga que imitarlo entero.
 */
export interface RuntimeModule {
  installRuntime(ctx: SubjectContext): Runtime;
  uninstallRuntime(): void;
}

let modulePromise: Promise<RuntimeModule | null> | null = null;

/** Carga el paquete una sola vez; null si no se pudo. */
export function loadRuntimeModule(): Promise<RuntimeModule | null> {
  if (!modulePromise) {
    modulePromise = import("@sinapsis/runtime").then(
      (mod): RuntimeModule => mod,
      () => null,
    );
  }
  return modulePromise;
}

/**
 * Argumentos de `runtime.loadBundle` para un bundle de la materia. `base` lo
 * manda el API; si viniera vacío se arma con `toolFileUrl` del contrato, que es
 * la MISMA ruta que sirve los archivos.
 */
export function bundleOf(subject: string, info: ToolInfo): BundleInfo {
  const id = info.manifest.id;
  const base = info.base || toolFileUrl(subject, id, "").replace(/\/+$/, "");
  return {
    id,
    base,
    scripts: [...info.manifest.scripts],
    styles: [...info.manifest.styles],
    data: [...info.manifest.data],
  };
}

/**
 * Instrumentación de `App.setRedraw` mientras dura el montaje de una vista.
 *
 * El contrato no dice si la vista registró un redibujo, y el host lo necesita
 * para decidir qué hacer al cambiar el tema: si lo registró, el runtime redibuja
 * y no hay que tocar nada; si no, hay que volver a montarla (decisión D4-2).
 * Cuando la propiedad no se puede envolver se responde «no registró»: volver a
 * montar es más caro, pero deja los colores bien, que es lo que se ve.
 */
export interface RedrawWatch {
  registered: () => boolean;
  release: () => void;
}

const NO_WATCH: RedrawWatch = { registered: () => false, release: () => undefined };

export function watchRedraw(runtime: RuntimeApi | null): RedrawWatch {
  const app = runtime?.App;
  if (!app || typeof app.setRedraw !== "function") return NO_WATCH;
  const original = app.setRedraw;
  let flag = false;
  try {
    app.setRedraw = function patched(fn: (() => void) | null) {
      flag = typeof fn === "function";
      return original.call(app, fn);
    };
  } catch {
    return NO_WATCH;
  }
  return {
    registered: () => flag,
    release: () => {
      try {
        app.setRedraw = original;
      } catch {
        /* el runtime ya se desinstaló: no hay nada que restaurar */
      }
    },
  };
}

/* --- estilos de las figuras -------------------------------------------------
   `styles/figures.css` es del runtime (estila lo que `figures.js` dibuja dentro
   del hueco) y se inyecta UNA vez por sesión, no por página del lector. El
   marco exterior —`.doc-figure`, `.fig-host`, el epígrafe y `.fig-missing`— es
   de la plataforma y vive en `markdown.module.css`. El `import()` lo deja en el
   mismo trozo diferido que el runtime: una materia sin bundles no lo descarga
   (decisión D4-3). */

let figureStyles: Promise<void> | null = null;

export function ensureFigureStyles(): Promise<void> {
  if (!figureStyles) {
    figureStyles = import("@sinapsis/runtime/styles/figures.css").then(
      () => undefined,
      () => undefined,
    );
  }
  return figureStyles;
}

/**
 * Solo para los tests. Sin argumento vuelve a la carga real del paquete; con un
 * doble, lo usa; con `null`, simula que el paquete no está.
 */
export function resetRuntimeModuleForTests(mod?: RuntimeModule | null): void {
  modulePromise = mod === undefined ? null : Promise.resolve(mod);
  figureStyles = Promise.resolve();
}
