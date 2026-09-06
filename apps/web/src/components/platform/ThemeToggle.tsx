import { useEffect } from "react";
import type { ThemeId } from "@sinapsis/contract";
import { isTypingTarget } from "@/lib/keyboard";
import { THEME_LABEL, useUiStore } from "@/lib/store";
import { UiIcon, type UiIconName } from "./Icon";
import { IconButton } from "./Button";
import css from "./ThemeToggle.module.css";

const ICON: Record<ThemeId, UiIconName> = {
  pergamino: "sun",
  laurel: "leaf",
  claustro: "moon",
};

/** Botón que cicla pergamino → laurel → claustro. Atajo: T. */
export function ThemeToggle() {
  const theme = useUiStore((s) => s.theme);
  const cycleTheme = useUiStore((s) => s.cycleTheme);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "t" && e.key !== "T") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;
      e.preventDefault();
      cycleTheme();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cycleTheme]);

  return (
    <>
      <IconButton
        label={`Tema: ${THEME_LABEL[theme]} · T para ciclar`}
        aria-keyshortcuts="t"
        className={css.toggle}
        onClick={cycleTheme}
        data-theme-toggle={theme}
      >
        <UiIcon name={ICON[theme]} size={14} />
      </IconButton>
      {/* El cambio de tema no se ve con un lector de pantalla: hay que decirlo. */}
      <span className={css.live} role="status">{`Tema: ${THEME_LABEL[theme]}`}</span>
    </>
  );
}
