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
import { MemoryRouter, Outlet, Route, Routes, useParams } from "react-router-dom";
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
      views: [{ id: "explorador", label: "Explorador de distribuciones", layout: "wide" }],
      figures: false,
      data: [],
    },
    bytes: 128,
    updatedAt: "2026-09-05T18:00:00.000Z",
    base: "/api/subjects/proba/tools/demo/files",
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

  /* El «script» del bundle: lo mismo que haría un IIFE contra `window.App`. */
  const runScript = () => {
    app.registerView("explorador", (main, arg) => {
      mounted += 1;
      lastArg = arg;
      const title = document.createElement("h1");
      title.textContent = "Herramienta de prueba";
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

  const runtime: RuntimeApi = {
    version: 1,
    subject: "proba",
    theme: "pergamino",
    uninstall: () => undefined,
    App: app,
    loadBundle: async (info) => {
      loadedBundles.push(`${info.base}/${info.scripts[0] ?? ""}`);
      runScript();
    },
    unloadBundle: () => undefined,
    view: (id) => views.get(id) ?? null,
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
  const ctx = useMemo<SubjectCtx>(
    () => ({ slug: subject, model, openSearch: () => void (searchOpened += 1), runtime }),
    [subject, runtime],
  );
  return (
    <>
      <Outlet context={ctx} />
      <span data-testid="crumbs">{(runtime.crumbs ?? []).map((c) => c.label).join(" · ")}</span>
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

  it("sin bundle que declare la vista, sigue el «Próximamente» del rail", async () => {
    /* `taller` es un ítem del rail de Proba, pero ningún bundle lo registra. */
    renderTool("/m/proba/t/taller");
    expect(await screen.findByText("Taller de resolución")).toBeTruthy();
    expect(screen.getByText("PRÓXIMAMENTE")).toBeTruthy();
    expect(mounted).toBe(0);
  });
});
