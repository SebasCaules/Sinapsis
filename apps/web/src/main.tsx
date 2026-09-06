import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import "./styles/tokens.css";
import "./styles/base.css";
import { ApiError, installMockApi } from "./lib/api";
import { loadLocalState } from "./local/persist";
import { installTestHook } from "./local/testHook";
import { enableMockFromQuery } from "./mocks/dev-fixtures";
import { Booting } from "./app/Booting";
import { router } from "./app/router";

/**
 * `networkMode: "always"` es obligatorio: sin él, TanStack Query considera que
 * el navegador está sin red (lo que en jsdom pasa seguido) y deja la consulta en
 * «pausa» para siempre, sin error ni datos. Sigue haciendo falta aunque ya no
 * haya red: los datos del sitio se piden con `fetch`. Los 4xx no se reintentan:
 * el archivo que no está no va a aparecer.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: "always",
      retry: (n, e) => !(e instanceof ApiError && e.status >= 400 && e.status < 500) && n < 1,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
    mutations: { networkMode: "always" },
  },
});

/** A partir de acá, esperar la carga del estado local merece un cartel. */
const BOOT_NOTICE_MS = 140;

/* El `import.meta.env.DEV &&` no es redundante: es literal `false` en la
   compilación de producción, así que Rollup poda el import dinámico y ni el
   cliente de mentira ni sus fixtures viajan al bundle. */
async function start(): Promise<void> {
  if (import.meta.env.DEV && enableMockFromQuery()) {
    const { mockApi } = await import("@/mocks/api");
    installMockApi(mockApi);
  }

  const root = ReactDOM.createRoot(document.getElementById("root")!);

  /* El estado personal se lee ANTES de renderizar: si la aplicación se dibujara
     con el documento vacío, la landing parpadearía sin materias y el tema del
     perfil llegaría tarde. Solo si la lectura tarda se dibuja el cartel, para no
     meter un destello en el arranque normal. */
  const notice = setTimeout(() => root.render(<Booting />), BOOT_NOTICE_MS);
  await loadLocalState();
  clearTimeout(notice);

  installTestHook(queryClient);

  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </React.StrictMode>,
  );
}

void start();
