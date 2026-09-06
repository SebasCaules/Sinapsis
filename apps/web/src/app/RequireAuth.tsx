import { Navigate, Outlet, useLocation } from "react-router-dom";
import { routes } from "@sinapsis/contract";
import { Seal } from "@/components/platform";
import { useMe } from "@/lib/auth";
import css from "./RequireAuth.module.css";

/** Puerta de sesión: carga discreta → landing, o /login recordando de dónde venía. */
export function RequireAuth() {
  const { data: me, isPending } = useMe();
  const location = useLocation();

  if (isPending) {
    return (
      <div className={css.loading}>
        <Seal size={34} />
        <span className={css.rule} />
        <span className={css.text}>Abriendo la biblioteca</span>
      </div>
    );
  }

  if (!me) return <Navigate to={routes.login()} replace state={{ from: location.pathname + location.search }} />;

  return <Outlet />;
}
