/**
 * El anfitrión de herramientas de punta a punta con un runtime de mentira: pide
 * los bundles al API, carga el que declara la vista, la monta en el nodo del
 * host y la desmonta al salir llamando a su limpiador.
 *
 * El runtime de mentira es un módulo con la MISMA superficie que
 * `@sinapsis/runtime` (la costura de `tools/runtime.ts`), y el «bundle» es una
 * función que registra una vista con `App.registerView`, exactamente como haría
 * un script clásico de la materia. Así se prueba el contrato del host sin
 * depender de la implementación del runtime.
 */
import { useMemo } from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Outlet, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  SubjectConfig,
  type SubjectDetail,
  type ThemeId,
  type ToolInfo,
  type ViewFn,
} from "@sinapsis/contract";
import rawProbaConfig from "../../../../../../examples/proba/sinapsis.config.json";
import { api, type ApiClient } from "@/lib/api";
import type { SubjectCtx } from "../context";
import { buildSubjectModel } from "../model";
import {
  PALETTE_EVENT,
  resetRuntimeModuleForTests,
  type RuntimeApi,
  type RuntimeContext,
  type RuntimeModule,
} from "./runtime";
import { useRuntime } from "./useRuntime";
import { ToolHost } from "./ToolHost";

const config = SubjectConfig.parse(rawProbaConfig);
const detail: SubjectDetail = { config, pages: [], studied: [], placeholder: false, lastSyncAt: null };
const model = buildSubjectModel(detail);

/** El manifiesto que devolvería el API para el bundle de la materia. */
const tools: ToolInfo[] = [
  {
    manifest: {
      id: "demo",
      title: "Herramientas de prueba",
      version: "0.0.1",
      runtime: 1,
      scripts: ["demo.js"],
      styles: [],
      views: [
        { id: "explorador", label: "Explorador de distribuciones", layout: "wide" },
        { id: "calc", label: "Calculadoras", layout: "wide" },
      ],
      figures: false,
      data: [],
    },
    bytes: 128,
    updatedAt: "2026-09-05T18:00:00.000Z",
    base: "/api/subjects/proba/tools/demo/files",
  },
  /* Un SEGUNDO bundle: la materia tiene más de uno y sus vistas viven en
     distintos scripts. Es el caso de Proba (figuras + taller + calculadoras). */
  {
    manifest: {
      id: "otro",
      title: "Otras herramientas",
      version: "0.0.1",
      runtime: 1,
      scripts: ["otro.js"],
      styles: [],
      views: [{ id: "laboratorio", label: "Laboratorio", layout: "wide" }],
      figures: false,
      data: [],
    },
    bytes: 128,
    updatedAt: "2026-09-05T18:00:00.000Z",
    base: "/api/subjects/proba/tools/otro/files",
  },
];

/* Lo que el «bundle» deja anotado: sirve para comprobar el desmontaje. */
let mounted = 0;
let cleaned = 0;
let lastArg: string | undefined;
let installedWith: RuntimeContext | null = null;
let loadedBundles: string[] = [];
let uninstalled = 0;
/* `bindView`: qué contenedores se ataron y cuáles se soltaron (S-16). */
let bound: HTMLElement[] = [];
let unbound: HTMLElement[] = [];
let navigated: string[] = [];
let searchOpened = 0;
/** Dispara el cambio de tema del runtime de mentira (para probar D4-2 / herr-05). */
let fireTheme: (theme: ThemeId) => void = () => undefined;
/** Cuántas veces se CONSTRUYÓ la vista `calc` (no cuántas se la invocó). */
let built = 0;

/** Un runtime de mentira con la superficie que consume la web. */
function fakeModule(): RuntimeModule {
  const views = new Map<string, ViewFn>();
  const themeListeners = new Set<(theme: ThemeId) => void>();

  /* Solo los cuatro miembros que toca el host: el resto de `RuntimeApp` es del
     baseline y no interviene en este contrato. */
  const app = {
    registerView: (id: string, fn: ViewFn) => void views.set(id, fn),
    setRedraw: () => undefined,
    mountFigures: () => 0,
    unmountFigures: () => 0,
  } as unknown as RuntimeApi["App"];

  /**
   * Una vista con el ciclo de vida de las calculadoras del baseline: se
   * construye UNA vez y, al cambiar de sección, solo anota el argumento. Sirve
   * para probar que cambiar `?arg=` no la desmonta (brecha herr-13) y que un
   * campo escrito sobrevive al cambio de tema (brecha herr-05).
   */
  const registerCalc = () => {
    app.registerView("calc", (main, arg) => {
      mounted += 1;
      lastArg = arg;
      if (!main.querySelector("#calcRoot")) {
        built += 1;
        const root = document.createElement("div");
        root.id = "calcRoot";
        const title = document.createElement("h1");
        title.textContent = "Calculadoras de prueba";
        const field = document.createElement("input");
        field.setAttribute("aria-label", "z");
        field.setAttribute("value", "0");
        root.append(title, field);
        main.appendChild(root);
      }
      return () => {
        cleaned += 1;
      };
    });
  };

  /** El «script» de una vista: lo mismo que haría un IIFE contra `window.App`. */
  const register = (id: string, heading: string) => {
    app.registerView(id, (main, arg) => {
      mounted += 1;
      lastArg = arg;
      const title = document.createElement("h1");
      title.textContent = heading;
      main.appendChild(title);
      /* Un enlace del baseline: `href` de hash y `data-nav`. Si el contenedor
         no está atado, esto navega al hash crudo y recarga. */
      const link = document.createElement("a");
      link.setAttribute("data-nav", "#/taller");
      link.textContent = "Ir al taller";
      main.appendChild(link);
      return () => {
        cleaned += 1;
      };
    });
  };

  /* Cada bundle registra SOLO lo suyo: la vista del segundo no existe hasta que
     su script corrió. */
  const runScript = (id: string) => {
    if (id === "otro") register("laboratorio", "Laboratorio de prueba");
    else {
      register("explorador", "Herramienta de prueba");
      registerCalc();
    }
  };

  const runtime: RuntimeApi = {
    version: 1,
    subject: "proba",
    theme: "pergamino",
    uninstall: () => undefined,
    App: app,
    loadBundle: async (info) => {
      loadedBundles.push(`${info.base}/${info.scripts[0] ?? ""}`);
      /* Una carga de verdad tarda: el `<script>` se inserta y su `load` llega
         en otro turno. Sin esa espera, el hueco entre «cambió la vista» y
         «cargó el bundle» no existe y no se puede probar. */
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
      runScript(info.id);
    },
    unloadBundle: () => undefined,
    view: (id) => views.get(id) ?? null,
    searchProviders: () => [],
    /* Doble mínimo de la delegación real: lo que se prueba acá es el CONTRATO
       del host (atar antes de dibujar, soltar al desmontar, una sola vez). La
       gramática de `[data-nav]`/`[data-go]` se prueba en `packages/runtime`. */
    bindView: (container: HTMLElement) => {
      bound.push(container);
      const onClick = (ev: Event) => {
        const el = (ev.target as Element).closest("[data-nav]");
        if (!el) return;
        ev.preventDefault();
        navigated.push(el.getAttribute("data-nav") ?? "");
      };
      container.addEventListener("click", onClick);
      return () => {
        unbound.push(container);
        container.removeEventListener("click", onClick);
      };
    },
    onThemeChange: (fn) => {
      themeListeners.add(fn);
      fireTheme = (theme: ThemeId) => themeListeners.forEach((listener) => listener(theme));
      return () => void themeListeners.delete(fn);
    },
    setTheme: () => undefined,
    updateContext: () => undefined,
  };

  return {
    installRuntime: (ctx) => {
      installedWith = ctx;
      return runtime;
    },
    uninstallRuntime: () => {
      uninstalled += 1;
    },
  };
}

let originalSubject: ApiClient["subject"];

beforeEach(() => {
  originalSubject = { ...api.subject };
  api.subject.tools = async () => tools;
  mounted = 0;
  cleaned = 0;
  lastArg = undefined;
  installedWith = null;
  loadedBundles = [];
  uninstalled = 0;
  bound = [];
  unbound = [];
  navigated = [];
  searchOpened = 0;
  built = 0;
  fireTheme = () => undefined;
  resetRuntimeModuleForTests(fakeModule());
});

afterEach(() => {
  Object.assign(api.subject, originalSubject);
  resetRuntimeModuleForTests();
  cleanup();
});

/** El shell, reducido a lo único que le importa al host: instalar el runtime. */
function ShellStub() {
  const { subject = "" } = useParams();
  const runtime = useRuntime(subject, model);
  const navigate = useNavigate();
  const ctx = useMemo<SubjectCtx>(
    () => ({ slug: subject, model, openSearch: () => void (searchOpened += 1), runtime }),
    [subject, runtime],
  );
  return (
    <>
      <Outlet context={ctx} />
      <span data-testid="crumbs">{(runtime.crumbs ?? []).map((c) => c.label).join(" · ")}</span>
      {/* El rail, reducido a lo único que importa acá: saltar de una vista a otra. */}
      <button onClick={() => navigate("/m/proba/t/laboratorio")}>Ir al laboratorio</button>
      <button onClick={() => navigate("/m/proba/t/calc?arg=tablas")}>Ir a Tablas</button>
      <span data-testid="ruta">{useLocation().pathname}</span>
    </>
  );
}

function renderTool(path: string) {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false, networkMode: "always" },
      mutations: { retry: false, networkMode: "always" },
    },
  });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/m/:subject" element={<ShellStub />}>
            <Route path="t/:tool" element={<ToolHost />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

const hostNode = () => document.querySelector<HTMLElement>(".sinapsis-tool");

describe("<ToolHost/>", () => {
  it("carga el bundle de la vista y la monta", async () => {
    renderTool("/m/proba/t/explorador");

    /* Mientras el bundle no está, el host lo dice; no muestra «Próximamente». */
    expect(screen.getByText("Cargando herramienta…")).toBeTruthy();

    expect(await screen.findByText("Herramienta de prueba")).toBeTruthy();
    expect(mounted).toBe(1);
    expect(loadedBundles).toEqual(["/api/subjects/proba/tools/demo/files/demo.js"]);
    /* La vista vive dentro del nodo del host, con el ancho del manifiesto. */
    expect(hostNode()?.getAttribute("data-layout")).toBe("wide");
    expect(hostNode()?.textContent).toContain("Herramienta de prueba");
    expect(screen.queryByText("Cargando herramienta…")).toBeNull();
  });

  it("instala el runtime con el contexto de la materia y lo desinstala al salir", async () => {
    const view = renderTool("/m/proba/t/explorador");
    await screen.findByText("Herramienta de prueba");

    expect(installedWith?.slug).toBe("proba");
    expect(installedWith?.config.slug).toBe("proba");
    expect(typeof installedWith?.setCrumbs).toBe("function");
    expect(typeof installedWith?.render).toBe("function");

    view.unmount();
    expect(uninstalled).toBe(1);
  });

  it("le pasa a la vista el `?arg=` de la URL", async () => {
    renderTool("/m/proba/t/explorador?arg=normal");
    await screen.findByText("Herramienta de prueba");
    expect(lastArg).toBe("normal");
  });

  it("al salir llama al limpiador de la vista y vacía el nodo", async () => {
    const view = renderTool("/m/proba/t/explorador");
    await screen.findByText("Herramienta de prueba");
    const node = hostNode();
    expect(node).not.toBeNull();

    view.unmount();
    expect(cleaned).toBe(1);
    expect(node?.childElementCount).toBe(0);
  });

  it("las migas que pide la vista con `App.setCrumbs` llegan al shell", async () => {
    renderTool("/m/proba/t/explorador");
    await screen.findByText("Herramienta de prueba");

    act(() => installedWith?.setCrumbs?.([{ label: "Explorador" }, { label: "Normal" }]));
    await waitFor(() => expect(screen.getByTestId("crumbs").textContent).toBe("Explorador · Normal"));
  });

  it("si el runtime no se puede cargar, lo dice en vez de quedarse cargando", async () => {
    /* `null`: la materia declara el bundle pero el paquete no resuelve. */
    resetRuntimeModuleForTests(null);
    renderTool("/m/proba/t/explorador");
    expect(await screen.findByText("No se pudo cargar el material interactivo de la materia.")).toBeTruthy();
    expect(mounted).toBe(0);
  });

  it("ata el contenedor al runtime (una sola vez) y lo suelta al salir", async () => {
    const view = renderTool("/m/proba/t/explorador");
    await screen.findByText("Herramienta de prueba");
    const node = hostNode();

    expect(bound).toEqual([node]);
    expect(unbound).toEqual([]);

    view.unmount();
    expect(unbound).toEqual([node]);
    /* Ni un atado de más: ir y volver no puede dejar listeners duplicados. */
    expect(bound).toHaveLength(1);
  });

  it("los `[data-nav]` de la vista los atiende el runtime, no el navegador", async () => {
    const view = renderTool("/m/proba/t/explorador");
    await screen.findByText("Herramienta de prueba");

    const link = screen.getByText("Ir al taller");
    act(() => void link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true })));
    expect(navigated).toEqual(["#/taller"]);

    /* Desmontada la vista, el mismo clic ya no llega a ningún lado. */
    const orphan = link;
    view.unmount();
    orphan.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    expect(navigated).toEqual(["#/taller"]);
  });

  it("el pedido de paleta del bundle abre la del shell", async () => {
    const view = renderTool("/m/proba/t/explorador");
    await screen.findByText("Herramienta de prueba");

    act(() => void window.dispatchEvent(new CustomEvent(PALETTE_EVENT)));
    expect(searchOpened).toBe(1);

    /* Fuera de la herramienta nadie escucha: sin listeners huérfanos. */
    view.unmount();
    window.dispatchEvent(new CustomEvent(PALETTE_EVENT));
    expect(searchOpened).toBe(1);
  });

  it("pasar a la vista de OTRO bundle no pinta «no registró la vista» (AC-05)", async () => {
    renderTool("/m/proba/t/explorador");
    await screen.findByText("Herramienta de prueba");

    /* Todo lo que se vio en pantalla mientras el segundo bundle cargaba: el
       error no puede aparecer NI UN RENDER, aunque después se corrija solo. */
    const visto: string[] = [];
    const observer = new MutationObserver(() => {
      if (document.body.textContent?.includes("no registró la vista")) visto.push("error");
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    act(() =>
      void screen
        .getByText("Ir al laboratorio")
        .dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true })),
    );

    /* Justo después del salto: el bundle nuevo todavía no cargó, así que se
       espera con el aviso de carga; el error es del bundle que YA no está. */
    expect(screen.queryByText(/no registró la vista/)).toBeNull();
    expect(screen.getByText("Cargando herramienta…")).toBeTruthy();

    expect(await screen.findByText("Laboratorio de prueba")).toBeTruthy();
    observer.disconnect();

    expect(visto).toEqual([]);
    expect(loadedBundles).toEqual([
      "/api/subjects/proba/tools/demo/files/demo.js",
      "/api/subjects/proba/tools/otro/files/otro.js",
    ]);
    /* La vista anterior se limpió y la nueva se montó: dos montajes, una limpieza. */
    expect(mounted).toBe(2);
    expect(cleaned).toBe(1);
  });

  it("cambiar de sección (`?arg=`) NO desmonta la vista (brecha herr-13)", async () => {
    renderTool("/m/proba/t/calc?arg=continuas");
    await screen.findByText("Calculadoras de prueba");
    expect(built).toBe(1);

    const campo = screen.getByLabelText("z") as HTMLInputElement;
    campo.value = "42";
    const nodo = hostNode();

    act(() =>
      void screen
        .getByText("Ir a Tablas")
        .dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true })),
    );
    await waitFor(() => expect(lastArg).toBe("tablas"));

    /* La vista se volvió a invocar con el argumento nuevo, pero sobre el MISMO
       nodo y sin reconstruirse: lo escrito sigue ahí. */
    expect(hostNode()).toBe(nodo);
    expect(built).toBe(1);
    expect((screen.getByLabelText("z") as HTMLInputElement).value).toBe("42");
  });

  it("cambiar de tema no borra lo que el usuario cargó (brecha herr-05)", async () => {
    renderTool("/m/proba/t/calc?arg=continuas");
    await screen.findByText("Calculadoras de prueba");
    const campo = screen.getByLabelText("z") as HTMLInputElement;
    campo.value = "42";

    act(() => fireTheme("claustro"));
    await waitFor(() => expect(screen.getByText("Calculadoras de prueba")).toBeTruthy());

    expect(built).toBe(1);
    expect((screen.getByLabelText("z") as HTMLInputElement).value).toBe("42");
  });

  it("con la vista intacta, el cambio de tema sí la vuelve a montar (D4-2)", async () => {
    renderTool("/m/proba/t/calc?arg=continuas");
    await screen.findByText("Calculadoras de prueba");
    expect(built).toBe(1);

    act(() => fireTheme("claustro"));
    /* Nadie escribió nada: se puede reconstruir para que tome los colores. */
    await waitFor(() => expect(built).toBe(2));
    expect(cleaned).toBe(1);
  });

  it("una herramienta que la materia no reservó devuelve al inicio (brecha herr-12)", async () => {
    renderTool("/m/proba/t/no-existe-ni-en-el-rail");
    await waitFor(() => expect(screen.getByTestId("ruta").textContent).toBe("/m/proba"));
    expect(screen.queryByText("PRÓXIMAMENTE")).toBeNull();
  });

  it("sin bundle que declare la vista, sigue el «Próximamente» del rail", async () => {
    /* `taller` es un ítem del rail de Proba, pero ningún bundle lo registra. */
    renderTool("/m/proba/t/taller");
    expect(await screen.findByText("Taller de resolución")).toBeTruthy();
    expect(screen.getByText("PRÓXIMAMENTE")).toBeTruthy();
    expect(mounted).toBe(0);
  });
});
