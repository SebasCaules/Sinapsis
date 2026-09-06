import { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/platform";
import { ThemeId } from "@sinapsis/contract";
import { useMe } from "@/lib/auth";
import { useUiStore } from "@/lib/store";
import { mockParam } from "@/mocks/dev-fixtures";
import css from "./AppRoot.module.css";

/**
 * Raíz de la SPA: piel (grano de papel), sincronización del tema con el perfil
 * del usuario y capa de avisos. No decide rutas: eso es de router.tsx.
 */
export function AppRoot() {
  const { data: me } = useMe();
  const theme = useUiStore((s) => s.theme);
  const sidebarCompact = useUiStore((s) => s.sidebarCompact);
  const setTheme = useUiStore((s) => s.setTheme);
  const setSignedIn = useUiStore((s) => s.setSignedIn);
  const adopted = useRef(false);

  /* El `<html>` ya trae data-theme del script de index.html; esto lo mantiene
     alineado con el store si algo lo cambia (tests, otra pestaña). */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.classList.toggle("sb-compact", sidebarCompact);
  }, [sidebarCompact]);

  /* Solo en desarrollo: ?theme=laurel fuerza un tema (capturas del smoke visual). */
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const forced = ThemeId.safeParse(mockParam("theme"));
    if (forced.success) setTheme(forced.data, { push: false });
  }, [setTheme]);

  /* El tema del servidor manda UNA sola vez por sesión: después gana el usuario. */
  useEffect(() => {
    setSignedIn(Boolean(me));
    if (!me) {
      adopted.current = false;
      return;
    }
    if (adopted.current) return;
    adopted.current = true;
    if (import.meta.env.DEV && ThemeId.safeParse(mockParam("theme")).success) return;
    setTheme(me.theme, { push: false });
  }, [me, setTheme, setSignedIn]);

  return (
    <div className={css.shell}>
      <div className={css.grain} data-grain aria-hidden="true" />
      <div className={css.content}>
        <Outlet />
      </div>
      <Toaster />
    </div>
  );
}
