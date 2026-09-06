import type { RouteObject } from "react-router-dom";
import { routes } from "@sinapsis/contract";
import { LoginPage } from "./LoginPage";

export const authRoutes: RouteObject[] = [{ path: routes.login(), element: <LoginPage /> }];
