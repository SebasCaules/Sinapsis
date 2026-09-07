/**
 * Avisos plegados y anclas (N0-62).
 *
 * Un `> [!tipo]-` se dibuja como `<details>` cerrado. El cuerpo sigue en el
 * HTML, así que la búsqueda y los enlaces entrantes no cambian, pero un
 * encabezado adentro de un pliegue cerrado no tiene medida: saltar a él sin
 * abrirlo primero deja al lector en cualquier lado.
 */

/** Abre todos los `<details>` que contienen a `target`, de adentro hacia afuera. */
export function openFoldedAncestors(target: Element | null): void {
  for (let node = target?.parentElement ?? null; node; node = node.parentElement) {
    if (node instanceof HTMLDetailsElement) node.open = true;
  }
}
