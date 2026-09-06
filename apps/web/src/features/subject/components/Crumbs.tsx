/** Migas de 28 px (región 08): casita · materia · división · página. */
import { Link } from "react-router-dom";
import { routes } from "@sinapsis/contract";
import { Icon } from "@/components/platform";
import css from "./Crumbs.module.css";

export interface Crumb {
  label: string;
  to?: string;
}

export function Crumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className={css.crumbs} aria-label="Migas de pan">
      {/* Casita, no carpeta: el destino es el inicio de la plataforma. */}
      <Link to={routes.landing()} className={css.home} aria-label="Mis materias" title="Mis materias">
        <Icon name="home" size={13} />
      </Link>
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <span key={`${item.label}-${i}`} className={css.step}>
            {/* «›» y no «·»: los propios rótulos llevan puntos («U3 · Variables
                Aleatorias Discretas») y con el mismo signo la cadena se leía
                como una sola tira. El baseline usa la flecha (core.js:1443). */}
            <span className={css.sep} aria-hidden="true">
              ›
            </span>
            {item.to && !last ? (
              <Link to={item.to} className={css.link} title={item.label}>
                {item.label}
              </Link>
            ) : (
              <span className={last ? css.current : css.link} title={item.label} aria-current={last ? "page" : undefined}>
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
