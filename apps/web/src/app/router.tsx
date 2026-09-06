/**
 * Router de la SPA — archivo EXCLUSIVO del orquestador.
 * Cada feature exporta sus rutas desde `features/<x>/routes.tsx` y acá se integran.
 *
 *   features/auth/routes.tsx     → export const authRoutes: RouteObject[]      (/login)
 *   features/landing/routes.tsx  → export const landingRoutes: RouteObject[]   (/)
 *   features/subject/routes.tsx  → export const subjectRoutes: RouteObject[]   (/m/:subject/*)
 *   app/RequireAuth.tsx          → export function RequireAuth(): JSX (Outlet si hay sesión, si no → /login)
 *   app/AppRoot.tsx              → export function AppRoot(): JSX (ThemeProvider + Outlet + toasts)
 */
import { createBrowserRouter, type RouteObject } from "react-router-dom";
import { AppRoot } from "./AppRoot";
import { RequireAuth } from "./RequireAuth";
import { authRoutes } from "@/features/auth/routes";
import { landingRoutes } from "@/features/landing/routes";
import { subjectRoutes } from "@/features/subject/routes";

/**
 * Bancos de prueba de componentes: SOLO en desarrollo y sin sesión, para poder
 * mirarlos con el navegador. En `vite build`, `import.meta.env.DEV` es la
 * constante `false`, así que Rollup se lleva la rama entera —el `import()`
 * incluido— y ni la ruta ni la página entran en el paquete de producción.
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
    children: [
      ...authRoutes,
      ...devRoutes,
      { element: <RequireAuth />, children: [...landingRoutes, ...subjectRoutes] },
    ],
  },
];

export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter(routes);
