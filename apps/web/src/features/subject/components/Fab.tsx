/** Botón flotante de la materia (región 11 · SLOT): 44 px, abajo a la derecha. */
import { Link } from "react-router-dom";
import { routes, type Fab as FabDef } from "@sinapsis/contract";
import { Icon } from "@/components/platform";
import css from "./Fab.module.css";

export function Fab({ slug, fab }: { slug: string; fab: FabDef }) {
  const label = fab.label;
  const icon = <Icon name={fab.icon} size={20} />;

  if (fab.kind === "link") {
    return (
      <a className={css.fab} href={fab.target} target="_blank" rel="noopener noreferrer" title={label} aria-label={label}>
        {icon}
      </a>
    );
  }

  const to =
    fab.kind === "page"
      ? routes.page(slug, fab.target)
      : fab.kind === "tool"
        ? routes.tool(slug, fab.target)
        : fab.target === "home"
          ? routes.subject(slug)
          : fab.target === "wiki"
            ? routes.wiki(slug)
            : fab.target === "graph"
              ? routes.graph(slug)
              : routes.tool(slug, fab.target);

  return (
    <Link className={css.fab} to={to} title={label} aria-label={label}>
      {icon}
    </Link>
  );
}
