import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import "./styles/tokens.css";
import "./styles/base.css";
import { ApiError, installMockApi } from "./lib/api";
import { enableMockFromQuery } from "./mocks/dev-fixtures";
import { router } from "./app/router";

/**
 * `networkMode: "always"` es obligatorio: sin él, TanStack Query considera que
 * el navegador está sin red (lo que en jsdom y detrás de un proxy pasa seguido)
 * y deja la consulta en «pausa» para siempre, sin error ni datos. Los 4xx no se
 * reintentan: el servidor ya dijo que no.
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

/* El `import.meta.env.DEV &&` no es redundante: es literal `false` en la
   compilación de producción, así que Rollup poda el import dinámico y ni el
   cliente de mentira ni sus fixtures viajan al bundle. */
async function start(): Promise<void> {
  if (import.meta.env.DEV && enableMockFromQuery()) {
    const { mockApi } = await import("@/mocks/api");
    installMockApi(mockApi);
  }

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </React.StrictMode>,
  );
}

void start();
