/**
 * S-03 · cuatrimestres persistentes (N0-32): la landing dibuja los cuatrimestres
 * que el usuario guardó aunque estén vacíos, y al guardar el orden los devuelve
 * en `saveLayout({ items, semesters })`.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { LandingLayoutInput, SubjectCard as SubjectCardData } from "@sinapsis/contract";
import { api } from "@/lib/api";
import { LandingPage } from "./LandingPage";

const proba: SubjectCardData = {
  slug: "proba",
  name: "Probabilidad y Estadística",
  code: "93.24",
  institution: "ITBA",
  color: "--u9",
  division: { singular: "Unidad", abbr: "U", plural: "Unidades" },
  divisionsCount: 12,
  pagesCount: 200,
  studiedCount: 62,
  dueCount: 0,
  semester: "2026-1C",
  position: 0,
  placeholder: false,
  lastSyncAt: null,
};

/** El cuatrimestre nuevo (2026-2C) está guardado pero todavía sin materias. */
const SAVED_SEMESTERS = ["2026-2C", "2026-1C"];

/** Entra en modo gestión, pero recién cuando la landing terminó de cargar. */
async function manage(): Promise<void> {
  await screen.findByRole("region", { name: "Cuatrimestre 2 · 2026" });
  fireEvent.click(screen.getByRole("button", { name: /Gestionar/ }));
}

let saveLayout: ReturnType<typeof vi.fn>;

function renderLanding() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, networkMode: "always" }, mutations: { networkMode: "always" } },
  });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  saveLayout = vi.fn(async (_input: LandingLayoutInput) => [proba]);
  vi.spyOn(api.auth, "me").mockResolvedValue({
    id: "u1",
    email: "estudiante@itba.edu.ar",
    name: "Estudiante",
    picture: null,
    theme: "pergamino",
  });
  vi.spyOn(api.landing, "list").mockResolvedValue([proba]);
  vi.spyOn(api.landing, "semesters").mockResolvedValue([...SAVED_SEMESTERS]);
  vi.spyOn(api.landing, "saveLayout").mockImplementation(saveLayout);
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("<LandingPage/> con un cuatrimestre vacío", () => {
  it("dibuja el cuatrimestre vacío como sección y lo cuenta en el subtítulo", async () => {
    renderLanding();
    const empty = await screen.findByRole("region", { name: "Cuatrimestre 2 · 2026" });
    expect(within(empty).getByText("0 materias")).toBeTruthy();
    /* La fantasma acompaña al cuatrimestre vacío para poder llenarlo. */
    expect(within(empty).getByRole("button", { name: "Agregar materia" })).toBeTruthy();
    expect(screen.getByText("1 materia · 2 cuatrimestres")).toBeTruthy();
  });

  it("en gestión ofrece asa siempre y «Quitar cuatrimestre» apagado si tiene materias", async () => {
    renderLanding();
    await manage();

    const empty = await screen.findByRole("region", { name: "Cuatrimestre 2 · 2026" });
    const full = screen.getByRole("region", { name: "Cuatrimestre 1 · 2026" });

    expect(within(empty).getByRole("button", { name: "Reordenar Cuatrimestre 2 · 2026" })).toBeTruthy();
    expect(within(full).getByRole("button", { name: "Reordenar Cuatrimestre 1 · 2026" })).toBeTruthy();

    /* U10: con materias el botón NO desaparece; se muestra apagado y dice por qué. */
    const enabled = within(empty).getByRole("button", { name: "Quitar cuatrimestre" });
    const disabled = within(full).getByRole("button", { name: "Quitar cuatrimestre" });
    expect((enabled as HTMLButtonElement).disabled).toBe(false);
    expect((disabled as HTMLButtonElement).disabled).toBe(true);
    /* El motivo: globo del ratón en el envoltorio, texto para el lector de
       pantalla en el `aria-describedby`. El nombre accesible sigue siendo el
       rótulo visible (WCAG 2.5.3). */
    expect(disabled.parentElement?.getAttribute("title")).toBe("Mueva o quite sus materias primero");
    const reason = document.getElementById(disabled.getAttribute("aria-describedby") ?? "");
    expect(reason?.textContent).toBe("Mueva o quite sus materias primero");
  });

  it("el plegable se nombra con el cuatrimestre y su cuenta, y apunta a la grilla", async () => {
    renderLanding();
    const toggle = await screen.findByRole("button", { name: "Cuatrimestre 1 · 2026, 1 materia" });
    const grid = document.getElementById(toggle.getAttribute("aria-controls") ?? "");
    expect(grid).toBeTruthy();
    expect(grid?.querySelector('[data-slug="proba"]')).toBeTruthy();
  });

  it("guarda el orden de los cuatrimestres junto con las materias", async () => {
    renderLanding();
    await manage();
    fireEvent.click(await screen.findByRole("button", { name: "Guardar" }));

    /* `mutate()` corre la mutación en un microtask: hay que esperarla. */
    await waitFor(() => expect(saveLayout).toHaveBeenCalledTimes(1));
    expect(saveLayout.mock.calls[0]?.[0]).toEqual({
      items: [{ slug: "proba", semester: "2026-1C", position: 0 }],
      semesters: SAVED_SEMESTERS,
    });
  });

  it("quitar el cuatrimestre vacío lo saca de lo que se guarda", async () => {
    renderLanding();
    await manage();
    const empty = await screen.findByRole("region", { name: "Cuatrimestre 2 · 2026" });
    fireEvent.click(within(empty).getByRole("button", { name: "Quitar cuatrimestre" }));
    fireEvent.click(screen.getByRole("button", { name: "Guardar" }));

    await waitFor(() => expect(saveLayout).toHaveBeenCalledTimes(1));
    expect(saveLayout.mock.calls[0]?.[0]).toMatchObject({ semesters: ["2026-1C"] });
  });
});

/** Quita el cuatrimestre vacío: el cambio más barato para ensuciar el borrador. */
async function dirtyDraft(): Promise<void> {
  const empty = await screen.findByRole("region", { name: "Cuatrimestre 2 · 2026" });
  fireEvent.click(within(empty).getByRole("button", { name: "Quitar cuatrimestre" }));
  await waitFor(() => expect(screen.queryByRole("region", { name: "Cuatrimestre 2 · 2026" })).toBeNull());
}

describe("<LandingPage/> · el borrador de gestión (N0-38)", () => {
  it("⌘K abre el buscador y NO descarta el borrador", async () => {
    renderLanding();
    await manage();
    await dirtyDraft();

    fireEvent.keyDown(window, { key: "k", metaKey: true });

    /* Sigue en gestión: la barra y sus botones no se fueron. */
    expect(screen.getByRole("button", { name: "Guardar" })).toBeTruthy();
    expect(screen.queryByRole("region", { name: "Cuatrimestre 2 · 2026" })).toBeNull();
  });

  it("salir con cambios pide confirmación y «Seguir editando» conserva el borrador", async () => {
    renderLanding();
    await manage();
    await dirtyDraft();

    fireEvent.click(screen.getByRole("button", { name: /Gestionar/ }));
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText("Hay cambios sin guardar")).toBeTruthy();

    fireEvent.click(within(dialog).getByRole("button", { name: "Seguir editando" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(screen.getByRole("button", { name: "Guardar" })).toBeTruthy();
  });

  it("sin cambios, salir de gestión no pregunta nada", async () => {
    renderLanding();
    await manage();
    fireEvent.click(screen.getByRole("button", { name: /Gestionar/ }));
    await waitFor(() => expect(screen.queryByRole("button", { name: "Guardar" })).toBeNull());
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("un rechazo del servidor conserva el borrador y muestra el error", async () => {
    saveLayout.mockRejectedValue(new Error("El rótulo no entra en el contrato."));
    renderLanding();
    await manage();
    await dirtyDraft();
    fireEvent.click(screen.getByRole("button", { name: "Guardar" }));

    await screen.findByText("El rótulo no entra en el contrato.");
    /* Sigue en gestión y el cuatrimestre quitado sigue quitado: no se recargó nada. */
    expect(screen.getByRole("button", { name: "Guardar" })).toBeTruthy();
    expect(screen.queryByRole("region", { name: "Cuatrimestre 2 · 2026" })).toBeNull();
  });
});

describe("<LandingPage/> · agregar cuatrimestre", () => {
  async function openSemesterDialog(): Promise<HTMLElement> {
    fireEvent.click(await screen.findByRole("button", { name: "Agregar cuatrimestre" }));
    return screen.findByRole("dialog");
  }

  it("rechaza en el campo un rótulo de 25 caracteres", async () => {
    renderLanding();
    await manage();
    const dialog = await openSemesterDialog();
    const field = within(dialog).getByLabelText("Rótulo") as HTMLInputElement;
    expect(field.maxLength).toBe(24);

    fireEvent.change(field, { target: { value: "x".repeat(25) } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Agregar" }));

    expect(within(dialog).getByText(/No puede pasar de 24 caracteres/)).toBeTruthy();
    /* El diálogo sigue abierto con lo escrito: no se tira el borrador. */
    expect((within(dialog).getByLabelText("Rótulo") as HTMLInputElement).value).toBe("x".repeat(25));
  });

  it("no duplica un cuatrimestre que solo difiere en la caja", async () => {
    renderLanding();
    await manage();
    const dialog = await openSemesterDialog();
    fireEvent.change(within(dialog).getByLabelText("Rótulo"), { target: { value: "2026-1c" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Agregar" }));

    expect(within(dialog).getByText("«2026-1C» ya está en la lista.")).toBeTruthy();
    expect(screen.getAllByRole("region", { name: "Cuatrimestre 1 · 2026" })).toHaveLength(1);
  });

  it("guarda la forma canónica de un rótulo nuevo", async () => {
    renderLanding();
    await manage();
    const dialog = await openSemesterDialog();
    fireEvent.change(within(dialog).getByLabelText("Rótulo"), { target: { value: "2027-2c" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Agregar" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(screen.getByRole("region", { name: "Cuatrimestre 2 · 2027" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Guardar" }));
    await waitFor(() => expect(saveLayout).toHaveBeenCalledTimes(1));
    expect(saveLayout.mock.calls[0]?.[0]).toMatchObject({ semesters: ["2027-2C", "2026-2C", "2026-1C"] });
  });
});

describe("<LandingPage/> · sin la lista de cuatrimestres (B3)", () => {
  it("apaga «Gestionar» y ofrece reintentar cuando la consulta falla", async () => {
    vi.spyOn(api.landing, "semesters").mockRejectedValue(new Error("500"));
    renderLanding();

    await screen.findByText(/No se pudieron cargar sus cuatrimestres/);
    const button = await screen.findByRole("button", { name: /Gestionar/ });
    expect((button as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByRole("button", { name: "Reintentar" })).toBeTruthy();
  });
});
