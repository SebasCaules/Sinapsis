/**
 * Cabecera de 40 px (región 07): atrás · pestaña activa · ⌘K · tema · avatar.
 * En el Sprint 1 hay UNA sola pestaña: el botón «+» queda deshabilitado con su
 * aviso, para que el hueco de las pestañas múltiples ya esté dibujado. La ✕ sí
 * hace algo — cerrar la única pestaña es volver al inicio de la materia.
 */
import { Link, useNavigate } from "react-router-dom";
import { routes } from "@sinapsis/contract";
import { AvatarMenu, SearchButton, ThemeToggle, UiIcon } from "@/components/platform";
import css from "./SubjectHeader.module.css";

export interface TabInfo {
  title: string;
  /** Rótulo corto de la división (solo cuando hay una página abierta). */
  chip: string | null;
  /** Color de la división del chip. */
  color: string | null;
}

export interface SubjectHeaderProps {
  tab: TabInfo;
  /** Slug de la materia: destino al cerrar la pestaña. */
  subject: string;
  onSearch: () => void;
}

export function SubjectHeader({ tab, subject, onSearch }: SubjectHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className={css.header} data-testid="subject-header">
      <button type="button" className={css.back} onClick={() => navigate(-1)} aria-label="Atrás" title="Atrás">
        <UiIcon name="chevronLeft" size={14} />
      </button>

      <div className={css.tab} style={tab.color ? { ["--ucol" as string]: tab.color } : undefined}>
        {tab.chip ? (
          <span className={css.tabChip}>{tab.chip}</span>
        ) : (
          <span className={css.tabDot} aria-hidden="true" />
        )}
        <span className={css.tabTitle}>{tab.title}</span>
        <Link
          className={css.tabClose}
          to={routes.subject(subject)}
          aria-label="Cerrar la pestaña"
          title="Cerrar la pestaña"
        >
          <UiIcon name="close" size={13} />
        </Link>
      </div>

      <button
        type="button"
        className={css.addTab}
        disabled
        aria-label="Nueva pestaña"
        title="Pestañas: próximamente"
      >
        <UiIcon name="plus" size={13} />
        <span className={css.tip} role="tooltip">
          Pestañas: próximamente
        </span>
      </button>

      <div className={css.spacer} />

      <SearchButton label="Buscar páginas…" width={250} onClick={onSearch} />
      <ThemeToggle />
      <AvatarMenu />
    </header>
  );
}
