/**
 * Botón flotante de la materia (región 11 · SLOT): 44 px, abajo a la derecha.
 * No decide nada: el modelo ya resolvió el destino con el mismo resolutor del
 * rail (`model.fab`), así que acá solo se dibuja el `RailItemView`.
 */
import { Link } from "react-router-dom";
import { Icon } from "@/components/platform";
import type { RailItemView } from "../model";
import css from "./Fab.module.css";

export function Fab({ view }: { view: RailItemView }) {
  const { item } = view;
  const icon = <Icon name={item.icon} size={20} />;

  if (view.external && view.href) {
    return (
      <a
        className={css.fab}
        href={view.href}
        target="_blank"
        rel="noopener noreferrer"
        title={item.label}
        aria-label={item.label}
      >
        {icon}
      </a>
    );
  }

  return (
    <Link className={css.fab} to={view.to ?? "."} title={item.label} aria-label={item.label}>
      {icon}
    </Link>
  );
}
