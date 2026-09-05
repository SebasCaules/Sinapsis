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

const routes: RouteObject[] = [
  {
    element: <AppRoot />,
    children: [
      ...authRoutes,
      { element: <RequireAuth />, children: [...landingRoutes, ...subjectRoutes] },
    ],
  },
];

export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter(routes);
