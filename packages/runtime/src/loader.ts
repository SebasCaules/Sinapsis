/* ============================================================
   loader.ts — carga de bundles de herramientas y figuras.

   Un bundle es lo que el CLI construye y el API sirve desde
   `/api/subjects/:slug/tools/:id/files/*` (N0-41): datos JSON, hojas de estilo
   y scripts CLÁSICOS (IIFE) que se registran contra `window.App`.

   Reglas del cargador:
     · los scripts van EN ORDEN, encadenados: se inserta el siguiente recién
       cuando el anterior disparó `load`. Con inserción dinámica, `defer` no
       garantiza el orden, así que no alcanza con marcarlos;
     · las cargas se serializan en una sola cola: mientras un bundle carga, sus
       `registerView` / `registerFigure` se le atribuyen a él (así
       `unloadBundle` sabe qué sacar);
     · idempotente por id: pedir dos veces el mismo bundle devuelve la misma
       promesa y no vuelve a insertar nada;
     · un script que falla corta la carga con un `Error` que nombra la URL.
   ============================================================ */
import type { FigureMeta, ProgressProvider, SearchProvider, ViewFn } from "@sinapsis/contract";
import type { FigureDrawFn } from "./figures.js";
import type { RuntimeApp } from "./compat.js";

/** Manifiesto de bundle (mismo shape que `SinapsisRuntime.loadBundle`). */
export interface BundleInfo {
  id: string;
  /** Prefijo de las URLs de los archivos (p. ej. `/api/subjects/proba/tools/figuras/files/`). */
  base: string;
  scripts: string[];
  styles: string[];
  data: string[];
}

interface LoadedBundle {
  info: BundleInfo;
  promise: Promise<void>;
  views: string[];
  figures: string[];
  /** Claves de `App.DATA` que puso este bundle. */
  data: string[];
  nodes: Element[];
  /** Limpiadores que el bundle registró con `App.onTeardown`. */
  teardowns: Array<() => void>;
  /** Proveedores de búsqueda que registró con `App.registerSearchProvider`. */
  providers: SearchProvider[];
  /** Proveedores de progreso que registró con `App.registerProgressProvider`. */
  progress: ProgressProvider[];
}

export interface BundleLoader {
  loadBundle(info: BundleInfo): Promise<void>;
  unloadBundle(id: string): void;
  isLoaded(id: string): boolean;
  /** Ids de los bundles cargados (o cargándose). */
  ids(): string[];
  /** Proveedores de búsqueda que registraron los bundles cargados. */
  searchProviders(): SearchProvider[];
  /** Proveedores de progreso que registraron los bundles cargados. */
  progressProviders(): ProgressProvider[];
  /** Descarga todo (lo usa `uninstallRuntime`). */
  unloadAll(): void;
}

/** Une `base` y `file` respetando las rutas absolutas y las URLs completas. */
export function resolveUrl(base: string, file: string): string {
  const f = String(file || "");
  if (/^(https?:)?\/\//i.test(f) || f.startsWith("/")) return f;
  const b = String(base || "");
  if (!b) return f;
  return b.endsWith("/") ? b + f : b + "/" + f;
}

/** `data/study-data.json` → `study-data`. */
export function dataKey(file: string): string {
  const name = String(file || "").split("?")[0]!.split("#")[0]!.split("/").pop() || "";
  return name.replace(/\.[^.]+$/, "");
}

/** ¿Es el archivo de material de estudio que además se funde en `App.STUDY`? */
function isStudyData(file: string): boolean {
  return dataKey(file) === "study-data";
}

export function createLoader(app: RuntimeApp): BundleLoader {
  const bundles = new Map<string, LoadedBundle>();
  /** Cola única: garantiza el orden y la atribución de lo registrado. */
  let queue: Promise<unknown> = Promise.resolve();

  function attribute(entry: LoadedBundle, run: () => Promise<void>): Promise<void> {
    const realView = app.registerView;
    const realFigure = app.registerFigure;
    const realTeardown = app.onTeardown;
    const realProvider = app.registerSearchProvider;
    const realProgress = app.registerProgressProvider;
    const realFileUrl = app.toolFileUrl;
    app.registerView = function (id: string, fn: ViewFn) {
      entry.views.push(id);
      return realView.call(app, id, fn);
    };
    app.registerFigure = function (id: string, draw: FigureDrawFn, meta?: FigureMeta) {
      entry.figures.push(id);
      return realFigure.call(app, id, draw, meta);
    };
    /* Lo que el bundle registre para deshacerse (marcado colgado del `body`,
       teclas atadas a `document`) es SUYO: corre al descargarlo, no antes ni
       después (brecha herr-04). */
    app.onTeardown = function (fn: () => void) {
      if (typeof fn === "function") entry.teardowns.push(fn);
    };
    app.registerSearchProvider = function (fn: SearchProvider) {
      if (typeof fn === "function") entry.providers.push(fn);
    };
    /* Los pasos que el bundle suma a la barra de cada división también son
       SUYOS: descargarlo devuelve el progreso a las páginas leídas. */
    app.registerProgressProvider = function (provider: ProgressProvider) {
      if (provider && typeof provider.stepsOf === "function") entry.progress.push(provider);
    };
    /* Un archivo del bundle que NO se declara en el manifiesto —una biblioteca
       pesada que solo hace falta en una pantalla— se pide por su URL. Solo
       resuelve mientras corren los scripts del bundle, que es cuando se sabe
       de quién es la base; la vista se guarda la URL al evaluarse. */
    app.toolFileUrl = function (file: string) {
      return resolveUrl(entry.info.base, file);
    };
    const restore = () => {
      app.registerView = realView;
      app.registerFigure = realFigure;
      app.onTeardown = realTeardown;
      app.registerSearchProvider = realProvider;
      app.registerProgressProvider = realProgress;
      app.toolFileUrl = realFileUrl;
    };
    return run().then(
      (v) => {
        restore();
        return v;
      },
      (e) => {
        restore();
        throw e;
      },
    );
  }

  function addStyle(entry: LoadedBundle, url: string): void {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    link.setAttribute("data-bundle", entry.info.id);
    document.head.appendChild(link);
    entry.nodes.push(link);
  }

  function addScript(entry: LoadedBundle, url: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const s = document.createElement("script");
      s.src = url;
      s.async = false;
      s.setAttribute("data-bundle", entry.info.id);
      s.addEventListener("load", () => resolve());
      s.addEventListener("error", () =>
        reject(new Error("bundle «" + entry.info.id + "»: no se pudo cargar el script " + url)),
      );
      document.head.appendChild(s);
      entry.nodes.push(s);
    });
  }

  async function loadData(entry: LoadedBundle, url: string, file: string): Promise<void> {
    let res: Response;
    try {
      res = await fetch(url, { credentials: "same-origin" });
    } catch (e) {
      throw new Error("bundle «" + entry.info.id + "»: no se pudo pedir " + url + " (" + String(e) + ")");
    }
    if (!res.ok) {
      throw new Error("bundle «" + entry.info.id + "»: " + url + " respondió HTTP " + res.status);
    }
    const json = (await res.json()) as unknown;
    const key = dataKey(file);
    app.DATA[key] = json;
    entry.data.push(key);
    // `study-data.json` además se funde en `App.STUDY`, como en el baseline.
    if (isStudyData(file) && json && typeof json === "object") {
      Object.assign(app.STUDY, json as Record<string, unknown>);
    }
  }

  function loadBundle(info: BundleInfo): Promise<void> {
    if (!info || !info.id) return Promise.reject(new Error("loadBundle: falta el id del bundle"));
    const already = bundles.get(info.id);
    if (already) return already.promise;

    const entry: LoadedBundle = {
      info,
      promise: Promise.resolve(),
      views: [],
      figures: [],
      data: [],
      nodes: [],
      teardowns: [],
      providers: [],
      progress: [],
    };
    const run = async (): Promise<void> => {
      for (const file of info.data || []) {
        await loadData(entry, resolveUrl(info.base, file), file);
      }
      for (const file of info.styles || []) {
        addStyle(entry, resolveUrl(info.base, file));
      }
      for (const file of info.scripts || []) {
        await addScript(entry, resolveUrl(info.base, file));
      }
    };
    // La cola serializa las cargas: el orden de los scripts y la atribución de
    // vistas/figuras dependen de que no se solapen dos bundles.
    const p = queue.then(() => attribute(entry, run));
    queue = p.catch(() => undefined);
    entry.promise = p.catch((e: unknown) => {
      // Un bundle que falló no queda «cargado»: se puede reintentar. Y como la
      // entrada desaparece, `unloadBundle` ya no va a poder limpiar lo que
      // alcanzaron a registrar los scripts anteriores al que reventó: se limpia
      // acá, igual que en la descarga.
      bundles.delete(info.id);
      runTeardowns(entry);
      removeNodes(entry);
      forget(entry);
      throw e;
    });
    bundles.set(info.id, entry);
    return entry.promise;
  }

  function removeNodes(entry: LoadedBundle): void {
    entry.nodes.forEach((n) => {
      if (n.parentNode) n.parentNode.removeChild(n);
    });
    entry.nodes = [];
    /* Cinturón para el marcado que el bundle colgó por su cuenta: cualquier nodo
       que lleve su marca desaparece con él. Sin esto, el FAB del buscador de
       valores se acumulaba en cada reentrada a la materia (brecha herr-04). */
    if (typeof document === "undefined") return;
    const mark = String(entry.info.id).replace(/["\\]/g, "\\$&");
    document.querySelectorAll('[data-bundle="' + mark + '"]').forEach((n) => {
      if (n.parentNode) n.parentNode.removeChild(n);
    });
  }

  /** Corre los limpiadores que el bundle registró con `App.onTeardown`. */
  function runTeardowns(entry: LoadedBundle): void {
    const list = entry.teardowns;
    entry.teardowns = [];
    entry.providers = [];
    entry.progress = [];
    list.forEach((fn) => {
      try {
        fn();
      } catch (e) {
        /* un limpiador que falla no puede impedir que se descargue el resto */
        if (typeof console !== "undefined") console.error("onTeardown:", e);
      }
    });
  }

  /** Borra del `App` todo lo que registró el bundle: vistas, figuras y datos. */
  function forget(entry: LoadedBundle): void {
    entry.views.forEach((v) => {
      delete app.VIEWS[v];
    });
    entry.figures.forEach((f) => {
      delete app.FIGURES[f];
    });
    entry.data.forEach((k) => {
      delete app.DATA[k];
    });
    entry.views = [];
    entry.figures = [];
    entry.data = [];
  }

  function unloadBundle(id: string): void {
    const entry = bundles.get(id);
    if (!entry) return;
    bundles.delete(id);
    /* Primero lo que el bundle sabe deshacer (su marcado, sus teclas), después
       lo que puso el cargador: si se hiciera al revés, el limpiador correría con
       sus estilos ya retirados. */
    runTeardowns(entry);
    removeNodes(entry);
    forget(entry);
  }

  return {
    loadBundle,
    unloadBundle,
    isLoaded: (id: string) => bundles.has(id),
    ids: () => Array.from(bundles.keys()),
    searchProviders: () => Array.from(bundles.values()).flatMap((b) => b.providers),
    progressProviders: () => Array.from(bundles.values()).flatMap((b) => b.progress),
    unloadAll: () => {
      Array.from(bundles.keys()).forEach(unloadBundle);
    },
  };
}
