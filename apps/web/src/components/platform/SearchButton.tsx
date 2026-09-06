import { forwardRef } from "react";
import { UiIcon } from "./Icon";
import css from "./SearchButton.module.css";

export interface SearchButtonProps {
  onClick?: () => void;
  label?: string;
  hint?: string;
  /** 300 px en la landing, 250 px dentro de una materia. */
  width?: number;
}

/**
 * Botón-buscador de la cabecera: abre el buscador real.
 *
 * `width` es un ancho DESEADO, no fijo: se publica como `--sb-w` y la hoja lo
 * usa como base flexible con un mínimo de 34 px. Con el ancho fijo, en una
 * cabecera angosta el buscador se quedaba con 250 de los 368 px disponibles y la
 * barra de pestañas quedaba en 18 px (nav.css:328-329 hace lo mismo: bajo 860 px
 * el buscador se reduce a la lupa).
 */
export function SearchButton({ onClick, label = "Buscar…", hint = "⌘K", width = 300 }: SearchButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${css.shell} ${css.button}`}
      style={{ ["--sb-w" as string]: `${width}px` }}
      aria-keyshortcuts="Meta+K Control+K"
      title={label}
    >
      <UiIcon name="search" size={14} />
      <span className={css.label}>{label}</span>
      <kbd className={css.kbd}>{hint}</kbd>
    </button>
  );
}

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  placeholder?: string;
  width?: number;
}

/** El mismo casco, con un campo de verdad adentro (búsqueda en línea). */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  { value, onChange, onClose, placeholder = "Buscar…", width = 300 },
  ref,
) {
  return (
    <div className={css.shell} style={{ width }}>
      <UiIcon name="search" size={14} />
      <input
        ref={ref}
        className={css.input}
        type="search"
        value={value}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            onClose();
          }
        }}
      />
      <button type="button" className={css.clear} onClick={onClose} aria-label="Cerrar la búsqueda">
        <UiIcon name="close" size={12} />
      </button>
    </div>
  );
});
