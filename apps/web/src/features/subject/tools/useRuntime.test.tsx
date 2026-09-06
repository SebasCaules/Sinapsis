/**
 * El cableado del progreso de los bundles (N0-61) desde el lado del shell:
 *
 *  - un bundle con `progress: true` se carga al ENTRAR en la materia, sin que
 *    nadie abra su vista (igual que uno de figuras);
 *  - sus proveedores quedan a la vista del shell (`progressProviders()`);
 *  - `App.progressChanged()` sube el `progressTick`, que es lo que obliga a
 *    rehacer el modelo y redibujar las barras;
 *  - sin bundles de progreso no hay proveedores y el tick no se mueve solo.
 *
 * El runtime es de mentira (la misma costura de `tools/runtime.ts` que usa
 * `ToolHost.test.tsx`): acá se prueba el contrato del shell, no el paquete.
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes, useParams } from "react-router-dom";
import {
  SubjectConfig,
  type ProgressProvider,
  type SubjectDetail,
  type ToolInfo,
  type ViewFn,
} from "@sinapsis/contract";
import rawProbaConfig from "../../../../../../subjects/proba/sinapsis.config.json";
import { api, type ApiClient } from "@/lib/api";
import { buildSubjectModel } from "../model";
import { resetRuntimeModuleForTests, type RuntimeApi, type RuntimeModule } from "./runtime";
import { useRuntime } from "./useRuntime";

const config = SubjectConfig.parse(rawProbaConfig);
const detail: SubjectDetail = { config, pages: [], studied: [], placeholder: false, lastSyncAt: null };
const model = buildSubjectModel(detail);

/** Un bundle que declara `progress` y otro que no: solo el primero se autocarga. */
function toolsWith(progress: boolean): ToolInfo[] {
  return [
    {
      manifest: {
        id: "pasos",
        title: "Ejercicios",
        version: "0.0.1",
        runtime: 1,
        scripts: ["pasos.js"],
        styles: [],
        views: [{ id: "ejercicios", label: "Ejercicios", layout: "wide" }],
        figures: false,
        progress,
        data: [],
      },
      bytes: 64,
      updatedAt: "2026-09-06T10:00:00.000Z",
      base: "subjects/proba/tools/pasos",
    },
  ];
}

const PROVIDER: ProgressProvider = {
  id: "ejercicios",
  label: "ejercicios",
  stepsOf: (division: string) =>
    division === "1" ? [{ id: "1", label: "Ejercicio 1", done: true, group: "Guía" }] : [],
};

let loaded: string[] = [];
let providers: ProgressProvider[] = [];
let notify: () => void = () => undefined;

/** Runtime de mentira: solo lo que este archivo mira. */
function fakeModule(): RuntimeModule {
  const listeners = new Set<() => void>();
  notify = () => listeners.forEach((fn) => fn());
  const runtime = {
    version: 1,
    subject: "proba",
    theme: "pergamino",
    App: {} as RuntimeApi["App"],
    loadBundle: async (info: { id: string }) => {
      loaded.push(info.id);
      /* Cargar tarda: el script registra su proveedor en otro turno, que es lo
         que obliga al shell a rehacer el modelo cuando el bundle termina. */
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
      providers.push(PROVIDER);
    },
    unloadBundle: () => undefined,
    view: (): ViewFn | null => null,
    searchProviders: () => [],
    progressProviders: () => providers.slice(),
    onProgressChange: (fn: () => void) => {
      listeners.add(fn);
      return () => void listeners.delete(fn);
    },
    bindView: () => () => undefined,
    onThemeChange: () => () => undefined,
    setTheme: () => undefined,
    updateContext: () => undefined,
    uninstall: () => undefined,
  } as unknown as RuntimeApi;
  return { installRuntime: () => runtime, uninstallRuntime: () => undefined };
}

let originalSubject: ApiClient["subject"];

beforeEach(() => {
  originalSubject = { ...api.subject };
  loaded = [];
  providers = [];
  resetRuntimeModuleForTests(fakeModule());
});

afterEach(() => {
  Object.assign(api.subject, originalSubject);
  resetRuntimeModuleForTests();
  cleanup();
});

/** Espía del handle: publica en el DOM lo que el shell leería de él. */
function Spy() {
  const { subject = "" } = useParams();
  const runtime = useRuntime(subject, model);
  const steps = runtime.progressProviders().flatMap((p) => p.stepsOf("1"));
  return (
    <>
      <span data-testid="tick">{runtime.progressTick}</span>
      <span data-testid="pasos">{steps.length}</span>
    </>
  );
}

function renderShell() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, networkMode: "always" } },
  });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={["/m/proba"]}>
        <Routes>
          <Route path="/m/:subject" element={<Spy />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("useRuntime · progreso de los bundles", () => {
  it("carga al entrar el bundle que declara `progress` y expone sus proveedores", async () => {
    api.subject.tools = async () => toolsWith(true);
    renderShell();
    await waitFor(() => expect(loaded).toEqual(["pasos"]));
    /* El modelo se rehace cuando el bundle termina de cargar: sin ese pulso, la
       barra de la unidad seguiría contando solo páginas hasta el primer clic. */
    await waitFor(() => expect(screen.getByTestId("pasos").textContent).toBe("1"));
    await waitFor(() => expect(Number(screen.getByTestId("tick").textContent)).toBeGreaterThan(0));
  });

  it("un bundle que no declara `progress` no se carga al entrar", async () => {
    api.subject.tools = async () => toolsWith(false);
    renderShell();
    await screen.findByTestId("tick");
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });
    expect(loaded).toEqual([]);
    expect(screen.getByTestId("pasos").textContent).toBe("0");
  });

  it("`App.progressChanged()` sube el pulso: el shell vuelve a pedir los pasos", async () => {
    api.subject.tools = async () => toolsWith(true);
    renderShell();
    await waitFor(() => expect(screen.getByTestId("pasos").textContent).toBe("1"));
    const antes = Number(screen.getByTestId("tick").textContent);
    await act(async () => {
      notify();
    });
    expect(Number(screen.getByTestId("tick").textContent)).toBe(antes + 1);
  });
});
