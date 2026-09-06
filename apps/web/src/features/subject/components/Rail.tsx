/**
 * Rail de 52 px (regiones 01-04 del contrato): sello, grupos FIJOS de la
 * plataforma, grupos SLOT de la materia y el botón de plegar el índice.
 * Los grupos slot llevan `data-slot="true"`; los fijos, `false`.
 */
import { Link, useLocation } from "react-router-dom";
import { routes } from "@sinapsis/contract";
import { Icon, Seal, UiIcon } from "@/components/platform";
import type { RailGroupView, RailItemView } from "../model";
import css from "./Rail.module.css";

export interface RailProps {
  slug: string;
  groups: RailGroupView[];
  compact: boolean;
  onToggleCompact: () => void;
}

/** ¿Esta ruta del rail es la que se está viendo? */
export function railItemActive(pathname: string, item: RailItemView, slug: string): boolean {
  const to = item.to;
  if (!to) return false;
  if (to === routes.subject(slug)) return pathname === to;
  if (to === routes.wiki(slug)) {
    // leer una página o una división es "consultar el wiki"; los prefijos salen
    // de las mismas rutas del contrato, no de un literal repetido acá
    return (
      pathname === to ||
      pathname.startsWith(routes.page(slug, "")) ||
      pathname.startsWith(routes.division(slug, ""))
    );
  }
  return pathname === to || pathname.startsWith(`${to}/`);
}

export function Rail({ slug, groups, compact, onToggleCompact }: RailProps) {
  const { pathname } = useLocation();
  // una página del rail gana sobre "Todo el wiki" cuando es exactamente esa página
  const exact = groups.some((g) => g.items.some((i) => i.item.kind === "page" && i.to === pathname));

  return (
    <nav className={css.rail} aria-label="Secciones de la materia">
      <div className={css.sealRow}>
        <Link className={css.seal} to={routes.landing()} aria-label="Volver a Sinapsis" title="Volver a Sinapsis">
          <Seal size={34} />
          <span className={css.tip} role="tooltip">
            Volver a Sinapsis
          </span>
        </Link>
      </div>

      {/* Mostrar u ocultar el índice: arriba, bajo el sello, con el icono clásico
          del panel lateral (antes vivía al pie del rail con un chevrón ambiguo). */}
      <div className={css.toggleRow}>
        <button
          type="button"
          className={css.item}
          onClick={onToggleCompact}
          aria-expanded={!compact}
          aria-label={compact ? "Mostrar el índice" : "Ocultar el índice"}
          title={compact ? "Mostrar el índice" : "Ocultar el índice"}
        >
          <UiIcon name="sidebar" size={18} />
          <span className={css.tip} role="tooltip">
            {compact ? "Mostrar el índice" : "Ocultar el índice"}
          </span>
        </button>
      </div>

      {groups.map((group) => (
        <div
          key={group.id}
          className={css.group}
          data-slot={group.slot ? "true" : "false"}
          style={{ ["--gcol" as string]: group.color }}
          role="group"
          aria-label={group.label}
        >
          {group.items.map((view) => {
            const active = !(exact && view.item.kind !== "page") && railItemActive(pathname, view, slug);
            return <RailButton key={`${group.id}:${view.item.id}`} view={view} group={group} active={active} />;
          })}
        </div>
      ))}

      <div className={css.spacer} />
    </nav>
  );
}

function RailButton({ view, group, active }: { view: RailItemView; group: RailGroupView; active: boolean }) {
  const { item } = view;
  const hint = item.hint ?? `${item.label} · ${group.label}`;
  const body = (
    <>
      {active ? <span className={css.bar} aria-hidden="true" /> : null}
      <Icon name={item.icon} size={18} />
      {view.external ? <UiIcon name="external" size={10} className={css.externalMark} /> : null}
      <span className={css.tip} role="tooltip">
        {hint}
      </span>
    </>
  );

  if (view.external && view.href) {
    return (
      <a
        className={css.item}
        href={view.href}
        target="_blank"
        rel="noopener noreferrer"
        title={hint}
        aria-label={item.label}
      >
        {body}
      </a>
    );
  }

  return (
    <Link
      className={css.item}
      to={view.to ?? "."}
      title={hint}
      aria-label={item.label}
      aria-current={active ? "page" : undefined}
      data-active={active ? "true" : undefined}
    >
      {body}
    </Link>
  );
}
