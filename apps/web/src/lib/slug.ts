/**
 * Derivación del slug de una materia a partir de su nombre: minúsculas, sin
 * acentos, palabras unidas por guiones. Tiene que satisfacer el esquema `Slug`
 * del contrato (/^[a-z0-9][a-z0-9-]*$/, máximo 120).
 */
const MAX = 120;

/** Marcas diacríticas combinantes que deja la normalización NFD. */
const COMBINING = /[\u0300-\u036f]/g;

export function slugify(input: string): string {
  return (input ?? "")
    .normalize("NFD")
    .replace(COMBINING, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX)
    .replace(/-+$/g, "");
}

/** true si el texto ya es un slug válido según el contrato. */
export function isValidSlug(value: string): boolean {
  return /^[a-z0-9][a-z0-9-]*$/.test(value) && value.length <= MAX;
}
