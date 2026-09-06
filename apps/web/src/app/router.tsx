/**
 * Router de la SPA — archivo EXCLUSIVO del orquestador.
 * Cada feature exporta sus rutas desde `features/<x>/routes.tsx` y acá se integran.
 *
 *   features/landing/routes.tsx  → export const landingRoutes: RouteObject[]   (/)
 *   features/subject/routes.tsx  → export const subjectRoutes: RouteObject[]   (/m/:subject/*)
 *   app/AppRoot.tsx              → export function AppRoot(): JSX (tema + Outlet + toasts)
 *
 * Desde el Sprint 4 no hay puerta de sesión: todas las rutas son públicas, el
 * estado es del navegador. Lo que sí hay es un `basename`: en GitHub Pages el
 * sitio cuelga de `/Sinapsis/`, y `import.meta.env.BASE_URL` es la única fuente
 * de esa base (la fija `vite.config.ts` con `VITE_BASE`).
 */
import { createBrowserRouter, type RouteObject } from "react-router-dom";
import { AppRoot } from "./AppRoot";
import { landingRoutes } from "@/features/landing/routes";
import { subjectRoutes } from "@/features/subject/routes";

/**
 * Bancos de prueba de componentes: SOLO en desarrollo, para poder mirarlos con
 * el navegador. En `vite build`, `import.meta.env.DEV` es la constante `false`,
 * así que Rollup se lleva la rama entera —el `import()` incluido— y ni la ruta
 * ni la página entran en el paquete de producción.
 */
const devRoutes: RouteObject[] = import.meta.env.DEV
  ? [
      {
        path: "/dev/datepicker",
        lazy: async () => ({ Component: (await import("@/dev/DatePickerPlayground")).DatePickerPlayground }),
      },
    ]
  : [];

const routes: RouteObject[] = [
  {
    element: <AppRoot />,
    children: [...devRoutes, ...landingRoutes, ...subjectRoutes],
  },
];

/** `/Sinapsis/` → `/Sinapsis`; `/` → `/`. Sin barra final, como pide el router. */
export const basename: string = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter(routes, { basename });
