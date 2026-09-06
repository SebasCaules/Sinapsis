/**
 * Rail de 52 px (regiones 01-04 del contrato): sello, grupos FIJOS de la
 * plataforma, grupos SLOT de la materia y el botón de plegar el índice.
 * Los grupos slot llevan `data-slot="true"`; los fijos, `false`.
 */
import { useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { routes } from "@sinapsis/contract";
import { Icon, Seal, UiIcon } from "@/components/platform";
import type { RailGroupView, RailItemView } from "../model";
import { railScale } from "./rail-fit";
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
  const navRef = useRef<HTMLElement>(null);
  const scale = useRailScale(navRef, groups.map((g) => g.items.length));
  // una página del rail gana sobre "Todo el wiki" cuando es exactamente esa página
  const exact = groups.some((g) => g.items.some((i) => i.item.kind === "page" && i.to === pathname));

  /**
   * El rail es UNA columna de controles: ↑ y ↓ la recorren en círculo (y
   * Inicio/Fin van a los extremos), como en core.js:2552-2564. Sin esto llegar
   * al último icono costaba diecinueve tabuladores que además atravesaban el
   * índice.
   */
  const onKeyDown = (event: React.KeyboardEvent) => {
    const keys = ["ArrowDown", "ArrowUp", "Home", "End"];
    if (!keys.includes(event.key)) return;
    const nav = navRef.current;
    if (!nav) return;
    const focusables = [...nav.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")];
    if (!focusables.length) return;
    const at = focusables.indexOf(document.activeElement as HTMLElement);
    if (at === -1) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? focusables.length - 1
          : (at + (event.key === "ArrowDown" ? 1 : focusables.length - 1)) % focusables.length;
    focusables[next]?.focus();
  };

  return (
    <nav
      className={css.rail}
      aria-label="Secciones de la materia"
      ref={navRef}
      style={{ ["--rs" as string]: scale }}
      data-scaled={scale < 1 ? "true" : undefined}
      onKeyDown={onKeyDown}
    >
      <div className={css.sealRow}>
        {/* Sin `title` nativo: el globo propio (.tip) ya dice lo mismo y sin él
            el navegador dibujaba los dos, uno encima del otro (shell-22). */}
        <Link className={css.seal} to={routes.landing()} aria-label="Volver a Sinapsis">
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
          {/* Rótulo vertical en el borde izquierdo: distingue cada sección del
              rail de un vistazo (pedido del usuario). Decorativo: el nombre
              accesible del grupo ya lo lleva `aria-label`. */}
          <span className={css.groupLabel} aria-hidden="true">
            {group.label}
          </span>
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
      <a className={css.item} href={view.href} target="_blank" rel="noopener noreferrer" aria-label={item.label}>
        {body}
      </a>
    );
  }

  return (
    <Link
      className={css.item}
      to={view.to ?? "."}
      aria-label={item.label}
      aria-current={active ? "page" : undefined}
      data-active={active ? "true" : undefined}
    >
      {body}
    </Link>
  );
}

/**
 * Escala del rail según la altura disponible: se recalcula al montar, al cambiar
 * la cantidad de ítems y al redimensionar la ventana (ResizeObserver sobre el
 * propio rail). Usa medidas naturales, así que aplicar la escala no la cambia.
 */
function useRailScale(ref: React.RefObject<HTMLElement | null>, itemsPerGroup: number[]): number {
  const [scale, setScale] = useState(1);
  const key = itemsPerGroup.join(",");
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const counts = key ? key.split(",").map(Number) : [];
    const measure = () => setScale(railScale(el.clientHeight, counts));
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, key]);
  return scale;
}
