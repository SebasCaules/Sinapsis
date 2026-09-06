/**
 * El runtime de la materia, atado al ciclo de vida del shell (N0-41 / N0-42).
 *
 * Entrar en una materia INSTALA el runtime con su contexto (config, páginas,
 * progreso, tema, navegación y avisos); salir lo desinstala. Los bundles con
 * `figures: true` se cargan en cuanto se entra —el lector los necesita para
 * montar `[!figura]` en la primera página que se abra—; los demás esperan a que
 * alguien abra su vista.
 *
 * Nada de esto es obligatorio: si el API todavía no sirve `/tools`, si la
 * materia no declara bundles o si el paquete del runtime no está, el shell
 * funciona exactamente como en el Sprint 2. Por eso la consulta no reintenta y
 * todos los caminos degradan en silencio.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { ThemeId, ToolInfo, ToolView, ViewFn } from "@sinapsis/contract";
import { api, qk } from "@/lib/api";
import { useToast } from "@/components/platform";
import type { SubjectModel } from "../model";
import { useTheme } from "../store";
import {
  bundleOf,
  ensureFigureStyles,
  loadRuntimeModule,
  watchRedraw,
  type RedrawWatch,
  type RuntimeApi,
  type RuntimeContext,
  type RuntimeCrumb,
  type RuntimeModule,
} from "./runtime";

/** Referencias estables: sin ellas cada render rearmaría el handle. */
const NO_TOOLS: ToolInfo[] = [];
const NO_LOADED: ReadonlySet<string> = new Set<string>();
/** Desatador inerte: sin runtime instalado no hay nada que soltar. */
const NO_UNBIND = (): void => undefined;

/** Lo que el shell y sus vistas pueden pedirle al runtime. */
export interface RuntimeHandle {
  /** true cuando el runtime está instalado y se le pueden pedir vistas. */
  ready: boolean;
  /**
   * true si la materia declara bundles pero el runtime no se pudo instalar. Sin
   * esto, una vista de herramienta se quedaba en «Cargando…» para siempre.
   */
  unavailable: boolean;
  /** true mientras `GET /subjects/:slug/tools` no respondió (ni bien ni mal). */
  pending: boolean;
  /** Bundles declarados por la materia (vacío si no hay o si el API falló). */
  tools: ToolInfo[];
  /** El bundle que registra la vista `viewId`, o null. */
  toolForView: (viewId: string) => ToolInfo | null;
  /** La declaración de la vista en el manifiesto (rótulo, icono, ancho). */
  viewInfo: (viewId: string) => ToolView | null;
  /** Rótulo de la vista: es el de la pestaña, la miga y el título del documento. */
  viewLabel: (viewId: string) => string | undefined;
  /** Carga un bundle (idempotente); resuelve false si no se pudo. */
  load: (toolId: string) => Promise<boolean>;
  /** ¿Ya está cargado ese bundle? */
  isLoaded: (toolId: string) => boolean;
  /** La vista registrada por un bundle ya cargado, o null. */
  view: (viewId: string) => ViewFn | null;
  /**
   * Ata el contenedor de la vista recién montada (S-16): pasa a ser el ámbito de
   * `App.$`/`App.$$` y recibe la delegación de clics de navegación
   * (`[data-nav]`, `[data-go]`, wikilinks) hacia `App.go`, que navega por el
   * router sin recargar. Devuelve el desatador, que el host llama al desmontar.
   */
  bindView: (container: HTMLElement) => () => void;
  /** true si hay al menos un bundle de figuras cargado. */
  figures: boolean;
  mountFigures: (container: HTMLElement) => number;
  unmountFigures: (container: HTMLElement) => number;
  /** Se suscribe al cambio de tema del runtime; devuelve el desuscriptor. */
  onThemeChange: (fn: (theme: ThemeId) => void) => () => void;
  /** Vigila si la vista montada registró redibujo propio (ver `watchRedraw`). */
  watchRedraw: () => RedrawWatch;
  /** Migas que pidió la vista con `App.setCrumbs` (null si no pidió ninguna). */
  crumbs: RuntimeCrumb[] | null;
  /** Cambia con cada `App.render()`: el host vuelve a montar la vista. */
  renderTick: number;
  /** Borra las migas de la vista (el host, al desmontar). */
  clearCrumbs: () => void;
}

/** Ganchos del shell que el runtime expone a los bundles (`App.paletteOpen()` / `App.openPalette()`). */
export interface RuntimeHooks {
  paletteOpen?: () => boolean;
  openPalette?: () => void;
}

export function useRuntime(slug: string, model: SubjectModel | null, hooks?: RuntimeHooks): RuntimeHandle {
  const navigate = useNavigate();
  const hooksRef = useRef(hooks);
  hooksRef.current = hooks;
  const { toast } = useToast();
  const theme = useTheme();

  /* El API puede no tener todavía la ruta de herramientas (agente A4): un 404
     acá no puede dejar la materia en estado de error ni reintentarse. */
  const query = useQuery({
    queryKey: qk.tools(slug),
    queryFn: () => api.subject.tools(slug),
    enabled: slug.length > 0,
    retry: false,
    staleTime: 5 * 60_000,
  });
  const tools = query.data ?? NO_TOOLS;

  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [loaded, setLoaded] = useState<ReadonlySet<string>>(NO_LOADED);
  const [crumbs, setCrumbs] = useState<RuntimeCrumb[] | null>(null);
  const [renderTick, setRenderTick] = useState(0);

  const runtimeRef = useRef<RuntimeApi | null>(null);
  const moduleRef = useRef<RuntimeModule | null>(null);
  /** Promesas de carga en curso, por id de bundle: `load` es idempotente. */
  const loadingRef = useRef(new Map<string, Promise<boolean>>());

  /* Lo que el contexto del runtime necesita de React se lee de refs: así el
     efecto de instalación depende SOLO de la materia y no se reinstala porque
     cambió el toast o se marcó una página. */
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;
  const toastRef = useRef(toast);
  toastRef.current = toast;
  const modelRef = useRef(model);
  modelRef.current = model;
  const themeRef = useRef(theme);
  themeRef.current = theme;

  const hasModel = model !== null;
  /* El runtime es pesado (KaTeX, marked, figuras, gráficos): una materia que no
     declara ningún bundle no lo descarga ni lo instala. */
  const hasTools = tools.length > 0;

  /**
   * El contexto que se le presta al runtime. Se arma en cada render (es barato)
   * y se guarda en una ref: el efecto de instalación lo lee de ahí, así depende
   * SOLO de la materia y no se reinstala porque cambió el toast o porque se
   * marcó una página como leída.
   */
  const contextOf = (): RuntimeContext | null => {
    const live = modelRef.current;
    if (!live) return null;
    return {
      slug,
      config: live.config,
      pages: live.pages,
      studied: live.studied,
      theme: themeRef.current,
      navigate: (path, opts) => navigateRef.current(path, { replace: opts?.replace ?? false }),
      toast: (message, tone) => toastRef.current(message, tone === "bad" ? "bad" : "good"),
      setCrumbs: (items) => setCrumbs(items.length ? items : null),
      render: () => setRenderTick((n) => n + 1),
      /* Se leen en el momento de la llamada: el estado de la paleta cambia sin
         que el contexto se vuelva a instalar. */
      paletteOpen: () => hooksRef.current?.paletteOpen?.() ?? false,
      openPalette: () => hooksRef.current?.openPalette?.(),
    };
  };
  const contextRef = useRef(contextOf);
  contextRef.current = contextOf;

  /* ---------- instalación / desinstalación --------------------------------- */
  useEffect(() => {
    if (!slug || !hasModel || !hasTools) return;
    let cancelled = false;

    void (async () => {
      const mod = await loadRuntimeModule();
      const ctx = contextRef.current();
      if (cancelled || !ctx) return;
      if (!mod) {
        setUnavailable(true);
        return;
      }
      let installed: RuntimeApi;
      try {
        installed = mod.installRuntime(ctx);
      } catch {
        /* Un runtime que no instala no puede tumbar la materia: la materia
           sigue, y las herramientas avisan que no están disponibles. */
        setUnavailable(true);
        return;
      }
      if (cancelled) {
        mod.uninstallRuntime();
        return;
      }
      moduleRef.current = mod;
      runtimeRef.current = installed;
      void ensureFigureStyles();
      setReady(true);
    })();

    return () => {
      cancelled = true;
      const mod = moduleRef.current;
      try {
        mod?.uninstallRuntime();
      } catch {
        /* desinstalar es de mejor esfuerzo: la materia ya se está dejando */
      }
      runtimeRef.current = null;
      moduleRef.current = null;
      loadingRef.current = new Map();
      setReady(false);
      setUnavailable(false);
      setLoaded(NO_LOADED);
      setCrumbs(null);
    };
  }, [slug, hasModel, hasTools]);

  /* ---------- contexto vivo: páginas y progreso ----------------------------- */
  useEffect(() => {
    if (!ready || !model) return;
    const ctx = contextRef.current();
    if (ctx) runtimeRef.current?.updateContext(ctx);
  }, [ready, model]);

  /* ---------- tema ---------------------------------------------------------- */
  useEffect(() => {
    if (!ready) return;
    runtimeRef.current?.setTheme(theme);
  }, [ready, theme]);

  /* ---------- carga de bundles ---------------------------------------------- */
  const toolsRef = useRef(tools);
  toolsRef.current = tools;

  const load = useCallback(
    (toolId: string): Promise<boolean> => {
      const pending = loadingRef.current.get(toolId);
      if (pending) return pending;
      const runtime = runtimeRef.current;
      const info = toolsRef.current.find((t) => t.manifest.id === toolId);
      if (!runtime || !info) return Promise.resolve(false);
      const promise = runtime
        .loadBundle(bundleOf(slug, info))
        .then(() => {
          setLoaded((prev) => {
            if (prev.has(toolId)) return prev;
            const next = new Set(prev);
            next.add(toolId);
            return next;
          });
          return true;
        })
        .catch((error: unknown) => {
          /* Se olvida el intento fallido: reabrir la vista vuelve a probar. */
          loadingRef.current.delete(toolId);
          throw error;
        });
      loadingRef.current.set(toolId, promise);
      return promise;
    },
    [slug],
  );

  /* Los bundles de figuras se cargan al ENTRAR: la primera página del lector ya
     tiene que poder montar sus `[!figura]` sin esperar a nadie. */
  useEffect(() => {
    if (!ready) return;
    for (const info of tools) {
      if (info.manifest.figures) void load(info.manifest.id).catch(() => undefined);
    }
  }, [ready, tools, load]);

  /* ---------- handle -------------------------------------------------------- */
  const toolForView = useCallback(
    (viewId: string): ToolInfo | null =>
      toolsRef.current.find((t) => t.manifest.views.some((v) => v.id === viewId)) ?? null,
    [],
  );

  const viewInfo = useCallback(
    (viewId: string): ToolView | null => {
      for (const tool of toolsRef.current) {
        const found = tool.manifest.views.find((v) => v.id === viewId);
        if (found) return found;
      }
      return null;
    },
    [],
  );

  const figures = useMemo(
    () => tools.some((t) => t.manifest.figures && loaded.has(t.manifest.id)),
    [tools, loaded],
  );

  return useMemo<RuntimeHandle>(
    () => ({
      ready,
      unavailable,
      pending: query.isPending,
      tools,
      toolForView,
      viewInfo,
      viewLabel: (viewId: string) => viewInfo(viewId)?.label,
      load,
      isLoaded: (toolId: string) => loaded.has(toolId),
      view: (viewId: string) => runtimeRef.current?.view(viewId) ?? null,
      bindView: (container: HTMLElement) => runtimeRef.current?.bindView(container) ?? NO_UNBIND,
      figures,
      mountFigures: (container: HTMLElement) => runtimeRef.current?.App.mountFigures(container) ?? 0,
      unmountFigures: (container: HTMLElement) => runtimeRef.current?.App.unmountFigures(container) ?? 0,
      onThemeChange: (fn: (next: ThemeId) => void) =>
        runtimeRef.current?.onThemeChange(fn) ?? (() => undefined),
      watchRedraw: () => watchRedraw(runtimeRef.current),
      crumbs,
      renderTick,
      clearCrumbs: () => setCrumbs(null),
    }),
    [ready, unavailable, query.isPending, tools, toolForView, viewInfo, load, loaded, figures, crumbs, renderTick],
  );
}

/** Handle inerte: lo usan el shell mientras carga la materia y los tests. */
export const IDLE_RUNTIME: RuntimeHandle = {
  ready: false,
  unavailable: false,
  pending: false,
  tools: NO_TOOLS,
  toolForView: () => null,
  viewInfo: () => null,
  viewLabel: () => undefined,
  load: () => Promise.resolve(false),
  isLoaded: () => false,
  view: () => null,
  bindView: () => NO_UNBIND,
  figures: false,
  mountFigures: () => 0,
  unmountFigures: () => 0,
  onThemeChange: () => () => undefined,
  watchRedraw: () => ({ registered: () => false, release: () => undefined }),
  crumbs: null,
  renderTick: 0,
  clearCrumbs: () => undefined,
};
