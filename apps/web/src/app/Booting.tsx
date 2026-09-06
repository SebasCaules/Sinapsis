import { Seal } from "@/components/platform";
import css from "./Booting.module.css";

/**
 * Lo que se ve mientras se abre el estado local (IndexedDB puede tardar unas
 * décimas en un arranque en frío). Es el mismo cartel que mostraba la puerta de
 * sesión del Sprint 3: sello, filete y «Abriendo la biblioteca».
 *
 * Solo aparece si la carga tarda: por debajo de ese umbral, `main.tsx` no lo
 * dibuja y la aplicación entra directo.
 */
export function Booting() {
  return (
    <div className={css.loading} role="status">
      <Seal size={34} />
      <span className={css.rule} />
      <span className={css.text}>Abriendo la biblioteca</span>
    </div>
  );
}
