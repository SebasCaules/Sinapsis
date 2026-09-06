import { useEffect } from "react";
import type { ThemeId } from "@sinapsis/contract";
import { THEME_LABEL, useUiStore } from "@/lib/store";
import { UiIcon, type UiIconName } from "./Icon";
import { IconButton } from "./Button";
import css from "./ThemeToggle.module.css";

const ICON: Record<ThemeId, UiIconName> = {
  pergamino: "sun",
  laurel: "leaf",
  claustro: "moon",
};

/** true si el foco está en un campo de texto: ahí la tecla T se escribe, no cicla. */
function typingInField(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el || !el.tagName) return false;
  const tag = el.tagName.toLowerCase();
  return tag === "input" || tag === "textarea" || tag === "select" || el.isContentEditable === true;
}

/** Botón que cicla pergamino → laurel → claustro. Atajo: T. */
export function ThemeToggle() {
  const theme = useUiStore((s) => s.theme);
  const cycleTheme = useUiStore((s) => s.cycleTheme);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "t" && e.key !== "T") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (typingInField(e.target)) return;
      e.preventDefault();
      cycleTheme();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cycleTheme]);

  return (
    <IconButton
      label={`Tema: ${THEME_LABEL[theme]} · T para ciclar`}
      className={css.toggle}
      onClick={cycleTheme}
      data-theme-toggle={theme}
    >
      <UiIcon name={ICON[theme]} size={16} />
    </IconButton>
  );
}
