import type { RouteObject } from "react-router-dom";
import { routes } from "@sinapsis/contract";
import { LandingPage } from "./LandingPage";

export const landingRoutes: RouteObject[] = [{ path: routes.landing(), element: <LandingPage /> }];
