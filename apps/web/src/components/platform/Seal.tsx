import css from "./Seal.module.css";

/**
 * Sello «S» de Sinapsis. Referencia: 34 px de círculo, aro de 26 px y letra de
 * 15 px; los demás tamaños escalan esas proporciones.
 */
export function Seal({ size = 34, title = "Sinapsis" }: { size?: number; title?: string }) {
  return (
    <span role="img" aria-label={title} className={css.seal} style={{ width: size, height: size }}>
      <span className={css.ring} style={{ width: (size * 26) / 34, height: (size * 26) / 34 }}>
        <span className={css.letter} style={{ fontSize: (size * 15) / 34 }}>
          S
        </span>
      </span>
    </span>
  );
}
