/**
 * Slugs de materia. La derivación vive en el contrato (`normalizeSlug`), que es
 * la misma que usan el API y el CLI: acá solo se le pone el nombre con el que la
 * conoce la interfaz.
 */
export { normalizeSlug as slugify, isValidSlug } from "@sinapsis/contract";
