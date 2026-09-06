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

/** Botón-buscador de la cabecera: abre el buscador real. */
export function SearchButton({ onClick, label = "Buscar…", hint = "⌘K", width = 300 }: SearchButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${css.shell} ${css.button}`}
      style={{ width }}
      aria-keyshortcuts="Meta+K Control+K"
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
