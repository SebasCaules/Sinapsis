import type { RefObject } from "react";
import { Link } from "react-router-dom";
import { routes } from "@sinapsis/contract";
import { Seal } from "./Seal";
import { SearchButton, SearchInput } from "./SearchButton";
import { ThemeToggle } from "./ThemeToggle";
import { AvatarMenu } from "./AvatarMenu";
import css from "./PlatformHeader.module.css";

export interface HeaderSearch {
  placeholder: string;
  onClick: () => void;
  /** 300 px en la landing, 250 px dentro de una materia. */
  width?: number;
  /**
   * Cuando está presente, la cabecera dibuja un campo en línea en lugar del
   * botón (la landing filtra sus tarjetas sin salir de la vista).
   */
  inline?: {
    value: string;
    onChange: (value: string) => void;
    onClose: () => void;
    inputRef?: RefObject<HTMLInputElement>;
  };
}

export interface PlatformHeaderProps {
  search?: HeaderSearch;
  /** Contenido opcional entre la marca y las herramientas (migas de materia). */
  children?: React.ReactNode;
}

/** Cabecera fija de 40 px: sello · Sinapsis · buscador · tema · avatar. */
export function PlatformHeader({ search, children }: PlatformHeaderProps) {
  const width = search?.width ?? 300;
  return (
    <header className={css.header}>
      <Link className={css.brand} to={routes.landing()} aria-label="Sinapsis · volver a mis materias">
        <Seal size={34} />
        <span className={css.wordmark}>Sinapsis</span>
      </Link>
      {children}
      <div className={css.spacer} />
      <div className={css.tools}>
        {search ? (
          search.inline ? (
            <SearchInput
              ref={search.inline.inputRef}
              value={search.inline.value}
              onChange={search.inline.onChange}
              onClose={search.inline.onClose}
              placeholder={search.placeholder}
              width={width}
            />
          ) : (
            <SearchButton label={search.placeholder} onClick={search.onClick} width={width} />
          )
        ) : null}
        <ThemeToggle />
        <AvatarMenu />
      </div>
    </header>
  );
}
