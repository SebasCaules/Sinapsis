/**
 * `/m/:s/t/:tool` — el sitio donde vive una herramienta de la materia (N0-41).
 *
 * El host no sabe NADA de lo que dibuja: busca el bundle cuyo manifiesto declara
 * la vista, lo carga, y le entrega un nodo del DOM y el argumento de la URL.
 * Desde ahí manda el bundle, que es JavaScript clásico contra `window.App`.
 *
 * Lo que sí es del host:
 *  - el ancho (`wide` 1120 · `full` todo el área) y la clase `sinapsis-tool`,
 *    que es la que engancha el CSS de los bundles;
 *  - el ciclo de vida: montar una sola vez, llamar al limpiador que devolvió la
 *    vista y vaciar el nodo al salir. Cambiar SOLO el argumento de la URL no
 *    desmonta nada: se vuelve a invocar la vista sobre el mismo nodo, que es lo
 *    que hacía el `render()` del baseline (brecha herr-13);
 *  - el tema: si la vista registró un redibujo propio, el runtime se encarga; si
 *    no, se la vuelve a montar (decisión D4-2) SALVO que el usuario ya haya
 *    escrito algo en ella, porque remontar le borraría el trabajo (herr-05);
 *  - `App.render()`, que es la forma que tiene una vista del baseline de pedir
 *    «vuelva a dibujarme»;
 *  - atar el contenedor al runtime (`bindView`, S-16): ámbito de `App.$`/`App.$$`
 *    y delegación de los clics de `[data-nav]` / `[data-go]` hacia `App.go`, que
 *    navega por el router sin recargar;
 *  - la reserva de ~72 px al pie en pantallas angostas, para que el FAB de ⌘J
 *    del bundle no tape los últimos controles (`ToolHost.module.css`).
 *
 * Sin bundle que declare la vista, la ruta sigue mostrando «Próximamente» con el
 * nombre que la materia le dio en el rail, igual que en el Sprint 2.
 */
import { useEffect, useRef, useState } from "react";
import { Navigate, useParams, useSearchParams } from "react-router-dom";
import { routes } from "@sinapsis/contract";
import { useSubjectCtx } from "../context";
import { ComingSoon, ErrorCard } from "../components/States";
import { PALETTE_EVENT } from "./runtime";
import css from "./ToolHost.module.css";

type Status = "idle" | "loading" | "ready" | "failed";

export function ToolHost() {
  const { model, runtime, openSearch } = useSubjectCtx();
  const { tool = "" } = useParams();
  const [params] = useSearchParams();
  const arg = params.get("arg") ?? undefined;

  /* El handle cambia de identidad con cada miga o bundle nuevo: si los efectos
     dependieran de él, una vista que llama a `setCrumbs` al montarse se
     desmontaría a sí misma en bucle. Se lee siempre de la ref. */
  const runtimeRef = useRef(runtime);
  runtimeRef.current = runtime;

  const info = runtime.toolForView(tool);
  const view = runtime.viewInfo(tool);
  const toolId = info?.manifest.id ?? null;
  const { ready, unavailable, pending, renderTick } = runtime;

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<unknown>(null);
  /** Cambia cuando hay que volver a montar la vista (tema sin redibujo propio). */
  const [remount, setRemount] = useState(0);
  const hostRef = useRef<HTMLDivElement>(null);

  /* ---------- carga del bundle --------------------------------------------- */
  useEffect(() => {
    if (!toolId || !ready) return;
    const rt = runtimeRef.current;
    if (rt.isLoaded(toolId)) {
      setStatus("ready");
      return;
    }
    let alive = true;
    setStatus("loading");
    setError(null);
    rt.load(toolId).then(
      (ok) => {
        if (!alive) return;
        if (ok) setStatus("ready");
        else {
          setStatus("failed");
          setError(new Error("El runtime de la materia no está disponible."));
        }
      },
      (cause: unknown) => {
        if (!alive) return;
        setStatus("failed");
        setError(cause);
      },
    );
    return () => {
      alive = false;
    };
  }, [toolId, ready]);

  /* ---------- montaje de la vista ------------------------------------------- */
  /* El argumento se lee de una ref: NO es una dependencia del montaje (cambiar
     de sección no puede desmontar la herramienta, brecha herr-13). */
  const argRef = useRef(arg);
  argRef.current = arg;
  /** La invocación viva de la vista: su función, su nodo, su limpiador y su arg. */
  const viewRef = useRef<{
    fn: (host: HTMLElement, arg?: string) => void | (() => void);
    host: HTMLElement;
    cleanup: void | (() => void);
    arg: string | undefined;
  } | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || status !== "ready") return;
    const rt = runtimeRef.current;
    /* Pasar a una vista de OTRO bundle: `status` todavía dice «ready» por el
       bundle anterior —el efecto de carga corre en este mismo commit y su
       `setStatus("loading")` no se ve hasta el render siguiente—, así que
       `rt.view(tool)` daría null y se pintaría el error de «no registró la
       vista» hasta que el bundle nuevo termine de cargar. Se espera: el efecto
       de carga vuelve con `ready` cuando el bundle esté. */
    if (toolId && !rt.isLoaded(toolId)) return;
    const fn = rt.view(tool);
    if (!fn) {
      setStatus("failed");
      setError(new Error(`El material de la materia no registró la vista «${tool}».`));
      return;
    }

    /* Se ata ANTES de dibujar: una vista puede llamar a `App.$` mientras se
       monta, y tiene que ver su propio contenedor y no el documento entero. */
    const unbindView = rt.bindView(host);
    const watch = rt.watchRedraw();
    let cleanup: void | (() => void);
    try {
      cleanup = fn(host, argRef.current);
    } catch (cause) {
      unbindView();
      watch.release();
      host.replaceChildren();
      setStatus("failed");
      setError(cause);
      return;
    }
    viewRef.current = { fn, host, cleanup, arg: argRef.current };

    /* Cambio de tema: el runtime ya llamó a los redibujos registrados. Si esta
       vista no registró ninguno, la única forma de que tome los colores nuevos
       es volver a montarla… y eso le borra al usuario lo que haya cargado. Los
       estilos del bundle son `var(--token)` y se repintan solos con el
       `data-theme` de la raíz: lo único que se pierde sin remontar es un lienzo
       dibujado con los colores viejos, que vale mucho menos que los datos
       escritos (brecha herr-05). */
    const off = rt.onThemeChange(() => {
      if (watch.registered()) return;
      if (hasUserInput(host)) return;
      setRemount((n) => n + 1);
    });

    return () => {
      off();
      unbindView();
      watch.release();
      const live = viewRef.current;
      viewRef.current = null;
      if (typeof live?.cleanup === "function") {
        try {
          live.cleanup();
        } catch {
          /* una vista que no sabe limpiarse no puede impedir que se la saque */
        }
      }
      host.replaceChildren();
    };
  }, [status, toolId, tool, remount, renderTick]);

  /* ---------- cambio de sección (`?arg=`) ------------------------------------
     El baseline volvía a llamar a la vista con el argumento nuevo SIN vaciar el
     contenedor: así las calculadoras conservan lo escrito al saltar de sección
     (brecha herr-13). Si el efecto de montaje ya corrió con este argumento —al
     entrar, o al cambiar de herramienta— no hay nada que rehacer. */
  useEffect(() => {
    const live = viewRef.current;
    if (!live || live.arg === arg) return;
    if (typeof live.cleanup === "function") {
      try {
        live.cleanup();
      } catch {
        /* el limpiador de la invocación anterior es de mejor esfuerzo */
      }
    }
    live.arg = arg;
    try {
      live.cleanup = live.fn(live.host, arg);
    } catch (cause) {
      setStatus("failed");
      setError(cause);
    }
  }, [arg, status, toolId, tool, remount, renderTick]);

  /* Las migas que pidió la vista son suyas: se borran al dejarla. */
  useEffect(() => () => runtimeRef.current.clearCrumbs(), [tool]);

  /* `App.openPalette()` del bundle (S-16). El runtime no conoce el shell, así
     que pide la paleta con un evento; el host, que sí tiene `openSearch` del
     contexto de la materia, lo atiende mientras hay una herramienta abierta. */
  useEffect(() => {
    const onPalette = () => openSearch();
    window.addEventListener(PALETTE_EVENT, onPalette);
    return () => window.removeEventListener(PALETTE_EVENT, onPalette);
  }, [openSearch]);

  /* ---------- estados ------------------------------------------------------- */
  if (!info || !view) {
    /* Mientras no se sepa qué bundles tiene la materia no se puede decir que la
       herramienta no existe. */
    if (pending) return <ToolLoading />;
    const item = model.railItem(tool);
    /* «Próximamente» es una PROMESA: solo vale para lo que la materia reservó en
       el rail. Un id que no está en ninguna parte no existe, y el baseline lo
       devolvía al inicio de la materia en vez de dejarlo en una pantalla muerta
       (brecha herr-12). */
    if (!item) return <Navigate to={routes.subject(model.slug)} replace />;
    return <ComingSoon title={item.item.label} />;
  }

  /* El bundle está declarado pero el runtime no se pudo instalar: decirlo, y no
     dejar la pantalla en «Cargando…» para siempre. */
  if (unavailable) {
    return (
      <ErrorCard
        error={new Error("No se pudo cargar el material interactivo de la materia.")}
        subject={model.slug}
      />
    );
  }

  if (status === "failed") {
    return <ErrorCard error={error} subject={model.slug} />;
  }

  return (
    <div className={css.frame} data-layout={view.layout} data-testid="tool-host">
      {status === "ready" ? null : <ToolLoading />}
      {/* `sinapsis-tool` es GLOBAL a propósito: es la clase contra la que están
          escritos los estilos de los bundles de la materia. */}
      <div
        ref={hostRef}
        className="sinapsis-tool"
        data-layout={view.layout}
        data-tool={info.manifest.id}
        data-view={view.id}
        hidden={status !== "ready"}
      />
    </div>
  );
}

/**
 * ¿Hay algo que el usuario haya escrito o elegido dentro de la herramienta?
 *
 * Se compara contra el valor POR OMISIÓN del marcado (`defaultValue`,
 * `defaultChecked`, `defaultSelected`): así una vista recién dibujada, con sus
 * treinta campos en su valor de fábrica, se puede volver a montar sin miedo, y
 * una con datos cargados no se toca.
 */
function hasUserInput(host: HTMLElement): boolean {
  const fields = host.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
    "input, textarea, select",
  );
  for (const field of fields) {
    if (field instanceof HTMLSelectElement) {
      const options = Array.from(field.options);
      if (options.some((o) => o.selected !== o.defaultSelected)) return true;
      continue;
    }
    if (field instanceof HTMLInputElement && (field.type === "checkbox" || field.type === "radio")) {
      if (field.checked !== field.defaultChecked) return true;
      continue;
    }
    if (field.value !== field.defaultValue) return true;
  }
  return false;
}

function ToolLoading() {
  return (
    <div className={css.loading} aria-busy="true" aria-live="polite">
      <span className={css.eyebrow}>HERRAMIENTA</span>
      <p className={css.loadingText}>Cargando herramienta…</p>
      <span className={css.bar} aria-hidden="true" />
    </div>
  );
}

export default ToolHost;
