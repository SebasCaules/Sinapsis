/**
 * El menú del avatar después de quitar la sesión (Sprint 4): un perfil local con
 * nombre editable, las tres acciones sobre lo guardado en este navegador y el
 * aviso de que el progreso vive acá. Nada de correo ni de «Cerrar sesión».
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { emptyBackup } from "@sinapsis/contract/site";
import { api } from "@/lib/api";
import { getState, resetStateForTests } from "@/local/state";
import { resetPersistForTests } from "@/local/persist";
import { AvatarMenu, initialsOf } from "./AvatarMenu";

function renderMenu() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, networkMode: "always" }, mutations: { networkMode: "always" } },
  });
  return render(
    <QueryClientProvider client={client}>
      <AvatarMenu />
    </QueryClientProvider>,
  );
}

/** Abre el menú (el avatar muestra las iniciales del perfil). */
async function abrir(): Promise<void> {
  fireEvent.click(await screen.findByRole("button", { name: /^Perfil de/ }));
}

beforeEach(() => {
  resetStateForTests(emptyBackup("2026-09-06T12:00:00.000Z"));
  resetPersistForTests();
  localStorage.clear();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("iniciales", () => {
  it("toma la primera y la última palabra", () => {
    expect(initialsOf("Sebastián Caules")).toBe("SC");
    expect(initialsOf("Estudiante")).toBe("ES");
    expect(initialsOf("")).toBe("ES");
  });
});

describe("<AvatarMenu/>", () => {
  it("muestra el perfil local y las acciones de la copia, sin sesión ni correo", async () => {
    renderMenu();
    await abrir();

    expect(screen.getByText("Estudiante")).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: /Descargar copia de seguridad/ })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: /Restaurar copia/ })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: /Borrar todo lo local/ })).toBeTruthy();
    expect(screen.queryByText(/Cerrar sesión/)).toBeNull();
    expect(screen.queryByText(/@/)).toBeNull();
  });

  it("dice una sola vez dónde vive el progreso", async () => {
    renderMenu();
    await abrir();
    expect(screen.getAllByText(/Tu progreso se guarda en este navegador/)).toHaveLength(1);
  });

  it("el nombre se edita en línea y queda en el perfil local", async () => {
    renderMenu();
    await abrir();

    fireEvent.click(screen.getByRole("button", { name: /Cambiar el nombre/ }));
    const field = await screen.findByLabelText("Nombre");
    fireEvent.change(field, { target: { value: "Sebastián" } });
    fireEvent.keyDown(field, { key: "Enter" });

    await waitFor(() => expect(getState().profile.name).toBe("Sebastián"));
  });

  it("«Borrar todo lo local…» pide confirmación en un diálogo de la plataforma", async () => {
    renderMenu();
    await abrir();

    fireEvent.click(screen.getByRole("menuitem", { name: /Borrar todo lo local/ }));

    const dialog = await screen.findByRole("dialog");
    expect(dialog.textContent).toContain("No se puede deshacer.");
    expect(screen.getByRole("button", { name: "Borrar todo" })).toBeTruthy();
  });

  it("descargar la copia usa el cliente local, no la red", async () => {
    const me = vi.spyOn(api.auth, "me");
    renderMenu();
    await abrir();
    expect(me).toHaveBeenCalled();
  });
});
