/**
 * Selector de tema de la cabecera.
 *
 * El baseline (core.js:2288-2301) no cicla a ciegas: el botón abre un menú con
 * los TRES temas nombrados, su clase (claro / oscuro), tres muestras de color y
 * la marca sobre el activo — se elige el tema, no se lo adivina. La tecla `T`
 * sigue siendo el ciclo rápido.
 */
import { useEffect, useId, useRef, useState } from "react";
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

/** Claro u oscuro: lo mismo que declara `color-scheme` en `tokens.css`. */
const KIND: Record<ThemeId, string> = {
  pergamino: "claro",
  laurel: "claro",
  claustro: "oscuro",
};

const THEMES: ThemeId[] = ["pergamino", "laurel", "claustro"];

/** Botón que abre el menú de temas. Atajo: T (ciclo rápido). */
export function ThemeToggle() {
  const theme = useUiStore((s) => s.theme);
  const setTheme = useUiStore((s) => s.setTheme);
  const cycleTheme = useUiStore((s) => s.cycleTheme);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  /* `IconButton` no reenvía ref: el disparador es el primer botón del envoltorio. */
  const focusTrigger = () => wrapRef.current?.querySelector<HTMLButtonElement>("button")?.focus();

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

  /* Clic fuera y Escape cierran el menú, como en `AvatarMenu`. */
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      setOpen(false);
      focusTrigger();
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={css.wrap} ref={wrapRef}>
      <IconButton
        label={`Tema: ${THEME_LABEL[theme]} · elegir tema (T para ciclar)`}
        aria-keyshortcuts="t"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        className={css.toggle}
        onClick={() => setOpen((v) => !v)}
        data-theme-toggle={theme}
      >
        <UiIcon name={ICON[theme]} size={14} />
      </IconButton>

      {open ? (
        <div className={css.menu} id={menuId} role="menu" aria-label="Tema">
          <div className={css.head}>Tema</div>
          {THEMES.map((id) => (
            <button
              key={id}
              type="button"
              role="menuitemradio"
              aria-checked={id === theme}
              className={css.option}
              onClick={() => {
                setTheme(id);
                setOpen(false);
                focusTrigger();
              }}
            >
              {/* Las muestras se pintan con los tokens DEL tema: el propio
                  `data-theme` reabre la escala de `tokens.css` en la muestra. */}
              <span className={css.swatch} data-theme={id} aria-hidden="true">
                <i className={css.chipBg} />
                <i className={css.chipPrimary} />
                <i className={css.chipAccent} />
              </span>
              <span className={css.name}>{THEME_LABEL[id]}</span>
              <span className={css.kind}>{KIND[id]}</span>
              <span className={css.tick} aria-hidden="true">
                {id === theme ? <UiIcon name="check" size={14} /> : null}
              </span>
            </button>
          ))}
        </div>
      ) : null}

      {/* El cambio de tema no se ve con un lector de pantalla: hay que decirlo. */}
      <span className={css.live} role="status">{`Tema: ${THEME_LABEL[theme]}`}</span>
    </div>
  );
}
