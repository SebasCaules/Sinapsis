import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { routes } from "@sinapsis/contract";
import { Seal } from "@/components/platform";
import { useMe } from "@/lib/auth";
import css from "./RequireAuth.module.css";

/**
 * Puerta de sesión. Distingue los desenlaces de `useMe` (S-15):
 *
 *   hay sesión           → la vista protegida;
 *   no se pudo saber     → «Reconectando con el servidor…», y se espera;
 *   se agotó la espera   → el aviso deja de ser una espera y ofrece las dos
 *                          salidas que hay: reintentar, o ir a iniciar sesión;
 *   no hay sesión (401)  → `/login`, recordando de dónde venía.
 *
 * Lo importante es el del medio: mientras el API se reinicia, la sesión sigue
 * viva en la base y la cookie sigue sirviendo. Mandar a `/login` en ese momento
 * hacía perder la pantalla —y el trabajo— por un corte de dos segundos.
 *
 * Y lo importante del que sigue: agotados los cinco reintentos ya no se sabe
 * nada y no va a saberse solo. Quien tenía la pantalla abierta se queda donde
 * está, pero quien NUNCA tuvo sesión quedaba en «Reconectando…» para siempre,
 * sin manera de llegar a la pantalla de acceso.
 */
export function RequireAuth() {
  const { data: me, isPending, isError, isFetching, failureCount, refetch } = useMe();
  const location = useLocation();

  /* Hay sesión: adentro. Va primero a propósito, para que un refetch fallido en
     segundo plano no saque al usuario de la pantalla en la que está trabajando. */
  if (me) return <Outlet />;

  /* Se agotaron los reintentos sin respuesta concluyente. NO se manda a `/login`
     por las malas —la sesión puede estar viva— pero se ofrece ir. */
  if (isError) {
    return (
      <div className={css.loading} role="status">
        <Seal size={34} />
        <span className={css.rule} />
        <span className={css.notice}>No se pudo contactar con el servidor.</span>
        <div className={css.actions}>
          <button
            type="button"
            className={css.action}
            disabled={isFetching}
            onClick={() => {
              void refetch();
            }}
          >
            {isFetching ? "Reintentando…" : "Reintentar"}
          </button>
          <Link
            className={`${css.action} ${css.quiet}`}
            to={routes.login()}
            state={{ from: location.pathname + location.search }}
          >
            Ir a iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  /* Ya falló al menos un intento y todavía no hubo una respuesta concluyente:
     5xx o fallo de red. Se avisa desde el primer fallo (no al agotar los
     reintentos) para que la espera tenga explicación. */
  if (failureCount > 0) {
    return (
      <div className={css.loading} role="status">
        <Seal size={34} />
        <span className={css.rule} />
        <span className={`${css.text} ${css.reconnect}`}>Reconectando con el servidor…</span>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className={css.loading}>
        <Seal size={34} />
        <span className={css.rule} />
        <span className={css.text}>Abriendo la biblioteca</span>
      </div>
    );
  }

  return <Navigate to={routes.login()} replace state={{ from: location.pathname + location.search }} />;
}
