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

  it("en gestión ofrece asa y «Quitar cuatrimestre» solo en el vacío", async () => {
    renderLanding();
    await manage();

    const empty = await screen.findByRole("region", { name: "Cuatrimestre 2 · 2026" });
    const full = screen.getByRole("region", { name: "Cuatrimestre 1 · 2026" });

    expect(within(empty).getByRole("button", { name: "Reordenar Cuatrimestre 2 · 2026" })).toBeTruthy();
    expect(within(full).getByRole("button", { name: "Reordenar Cuatrimestre 1 · 2026" })).toBeTruthy();

    expect(within(empty).getByRole("button", { name: "Quitar cuatrimestre" })).toBeTruthy();
    expect(within(full).queryByRole("button", { name: "Quitar cuatrimestre" })).toBeNull();
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
