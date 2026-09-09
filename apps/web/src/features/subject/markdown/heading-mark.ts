/**
 * Marca de división al principio de un encabezado: «U2 · Probabilidad…».
 *
 * Es la única forma que tiene una página SUELTA —el formulario maestro, que
 * cruza todo el programa— de decir a qué unidad pertenece cada tramo: la página
 * no tiene división, pero sus secciones sí. Quien la escribe usa el rótulo corto
 * que ya muestra el resto de la plataforma (`DivisionNode.short`), y tanto el
 * cuerpo como el índice de la página lo dibujan con el color de esa unidad.
 *
 * Vive acá, y no en una vista, porque lo leen las dos: el lector (para el índice
 * lateral) y el markdown (para el encabezado de la sección).
 */

/** Ningún rótulo corto de división es más largo que esto («Comple.», «Sueltas»). */
const MAX_MARCA = 12;

export const HEADING_MARK_SEP = " · ";

/**
 * Corta la marca del título. Un encabezado que no empiece por una marca corta se
 * devuelve entero: el separador « · » es corriente en los títulos del wiki y no
 * puede tomarse por una marca.
 */
export function splitHeadingMark(text: string): { mark: string | null; label: string } {
  const at = text.indexOf(HEADING_MARK_SEP);
  if (at <= 0 || at > MAX_MARCA) return { mark: null, label: text };
  return { mark: text.slice(0, at), label: text.slice(at + HEADING_MARK_SEP.length) };
}
