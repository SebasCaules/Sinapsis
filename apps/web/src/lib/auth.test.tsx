/**
 * La puerta de sesión (S-15). Lo que se prueba no es `useMe` por dentro sino el
 * contrato de los tres desenlaces, visto desde la pantalla:
 *
 *   401                  → `/login`;
 *   500 y después 200    → la vista protegida, sin pasar por `/login`;
 *   fallo de red         → «Reconectando con el servidor…», sin `/login`.
 *
 * El API se sustituye por el objeto mutable `api` (única costura de red de la
 * SPA), igual que en el resto de las pruebas de la web.
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import type { User } from "@sinapsis/contract";
import { RequireAuth } from "@/app/RequireAuth";
import { ApiError, api, type ApiClient } from "./api";
import { ME_MAX_RETRIES, meRetryDelay, shouldRetryMe } from "./auth";

const user: User = {
  id: "u1",
  email: "quien@sea.test",
  name: "Quien Sea",
  picture: null,
  theme: "pergamino",
};

let originalAuth: ApiClient["auth"];
let client: QueryClient | null = null;

beforeEach(() => {
  originalAuth = { ...api.auth };
});

afterEach(() => {
  Object.assign(api.auth, originalAuth);
  cleanup();
  /* Corta los reintentos que sigan en vuelo: si no, una prueba de fallo de red
     deja una consulta reintentando durante la siguiente. */
  client?.clear();
  client = null;
});

function renderGate() {
  client = new QueryClient({
    defaultOptions: {
      /* `retry` y `retryDelay` los pone `useMe`: acá solo se fuerza que la cola
         no se pause por `navigator.onLine` en jsdom. */
      queries: { networkMode: "always" },
      mutations: { retry: false, networkMode: "always" },
    },
  });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={["/m/proba"]}>
        <Routes>
          <Route element={<RequireAuth />}>
            <Route path="/m/proba" element={<p>Contenido protegido</p>} />
          </Route>
          <Route path="/login" element={<p>Pantalla de acceso</p>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("política de reintento de useMe", () => {
  it("un 401 o un 403 no se reintentan: el servidor ya contestó", () => {
    expect(shouldRetryMe(1, new ApiError(401, "Sin sesión"))).toBe(false);
    expect(shouldRetryMe(1, new ApiError(403, "Origen no permitido"))).toBe(false);
    expect(shouldRetryMe(1, new ApiError(404, "No encontrado"))).toBe(false);
  });
  it("un 5xx o un fallo de red se reintentan hasta el tope", () => {
    expect(shouldRetryMe(1, new ApiError(502, "Bad gateway"))).toBe(true);
    expect(shouldRetryMe(1, new TypeError("Failed to fetch"))).toBe(true);
    expect(shouldRetryMe(ME_MAX_RETRIES, new TypeError("Failed to fetch"))).toBe(false);
  });
  it("la espera crece y tiene techo", () => {
    expect(meRetryDelay(0)).toBe(300);
    expect(meRetryDelay(1)).toBe(600);
    expect(meRetryDelay(9)).toBe(4000);
  });
});

describe("<RequireAuth/>", () => {
  it("401: no hay sesión, va a /login", async () => {
    api.auth.me = async () => {
      throw new ApiError(401, "Sin sesión");
    };
    renderGate();
    expect(await screen.findByText("Pantalla de acceso")).toBeTruthy();
    expect(screen.queryByText("Contenido protegido")).toBeNull();
  });

  it("500 y después 200: renderiza el contenido sin pasar por /login", async () => {
    let calls = 0;
    api.auth.me = async () => {
      calls += 1;
      if (calls === 1) throw new ApiError(500, "El servidor no pudo responder");
      return user;
    };
    renderGate();

    /* Mientras reintenta, avisa que está reconectando; nunca manda a /login. */
    expect(await screen.findByText("Reconectando con el servidor…")).toBeTruthy();
    expect(screen.queryByText("Pantalla de acceso")).toBeNull();

    expect(await screen.findByText("Contenido protegido", {}, { timeout: 3000 })).toBeTruthy();
    expect(calls).toBe(2);
    expect(screen.queryByText("Pantalla de acceso")).toBeNull();
  });

  it("fallo de red: estado de reconexión anunciado, y no se pierde la pantalla", async () => {
    api.auth.me = async () => {
      throw new TypeError("Failed to fetch");
    };
    renderGate();

    const status = await screen.findByRole("status");
    expect(status.textContent).toContain("Reconectando con el servidor…");
    await waitFor(() => expect(screen.queryByText("Pantalla de acceso")).toBeNull());
  });
});
