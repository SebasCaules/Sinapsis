/**
 * Cuatrimestres de la landing: rótulos y agrupado de tarjetas. Analizar y
 * ordenar el rótulo canónico ("AAAA-1C" / "AAAA-2C") es del contrato, que es la
 * misma regla que aplica el API; acá viven solo los rótulos de la interfaz.
 * El usuario puede escribir cualquier cosa: lo que no se puede analizar se
 * conserva tal cual y se ordena al final.
 */
import { compareSemestersDesc, parseSemester, type SemesterParts, type SubjectCard } from "@sinapsis/contract";

export { compareSemestersDesc, parseSemester };
export type { SemesterParts };

/** Rótulo largo de la cabecera: "Cuatrimestre 1 · 2026". */
export function semesterLabel(raw: string): string {
  const p = parseSemester(raw);
  return p ? `Cuatrimestre ${p.term} · ${p.year}` : raw;
}

/** Rótulo compacto para controles angostos: "C1 · 2026". */
export function semesterShort(raw: string): string {
  const p = parseSemester(raw);
  return p ? `C${p.term} · ${p.year}` : raw;
}

/** Chip mono de la cabecera: "C1". Para rótulos libres, las primeras 3 letras. */
export function semesterChip(raw: string): string {
  const p = parseSemester(raw);
  if (p) return `C${p.term}`;
  const compact = (raw ?? "").replace(/\s+/g, "");
  return compact.slice(0, 3).toUpperCase() || "—";
}

export interface SemesterGroup {
  semester: string;
  label: string;
  chip: string;
  cards: SubjectCard[];
}

/** Cuatrimestre de una tarjeta; las que no traen rótulo caen en un grupo propio. */
export const semesterOf = (card: Pick<SubjectCard, "semester">): string => card.semester || "Sin cuatrimestre";

/**
 * Cuatrimestres que se muestran: los que el usuario guardó (`GET /landing/semesters`,
 * que incluye los vacíos y manda el ORDEN) más los que alguna materia use y la
 * lista no mencione, agregados al final del más reciente al más antiguo.
 *
 * La unión es lo que evita que una materia quede huérfana si la lista guardada
 * llega vieja o vacía: sin cuatrimestres guardados, el resultado es exactamente
 * el orden por rótulo de antes.
 */
export function unionSemesters(saved: readonly string[], cards: readonly SubjectCard[]): string[] {
  const out: string[] = [];
  for (const s of saved) if (s && !out.includes(s)) out.push(s);
  const extra = [...new Set(cards.map(semesterOf))].filter((s) => !out.includes(s)).sort(compareSemestersDesc);
  return [...out, ...extra];
}

/**
 * Reparte las tarjetas en los cuatrimestres dados, en ese orden y sin descartar
 * los vacíos. Cada grupo se ordena por `position` (empate: por nombre).
 */
export function groupBySemesters(semesters: readonly string[], cards: readonly SubjectCard[]): SemesterGroup[] {
  const buckets = new Map<string, SubjectCard[]>(semesters.map((s) => [s, []]));
  for (const card of cards) buckets.get(semesterOf(card))?.push(card);
  return semesters.map((semester) => ({
    semester,
    label: semesterLabel(semester),
    chip: semesterChip(semester),
    cards: [...(buckets.get(semester) ?? [])].sort(
      (a, b) => a.position - b.position || a.name.localeCompare(b.name, "es"),
    ),
  }));
}

/** Atajo sin lista guardada: agrupa por rótulo descendente, solo con los cuatrimestres que tienen materias. */
export function groupBySemester(cards: readonly SubjectCard[]): SemesterGroup[] {
  return groupBySemesters(unionSemesters([], cards), cards);
}

/** Sugerencia para "+ Agregar cuatrimestre": el siguiente al más reciente. */
export function nextSemesterSuggestion(existing: string[]): string {
  const parsed = existing.map(parseSemester).filter((p): p is SemesterParts => p !== null);
  if (parsed.length === 0) return `${new Date().getFullYear()}-1C`;
  const top = parsed.sort((a, b) => b.year - a.year || b.term - a.term)[0];
  if (!top) return `${new Date().getFullYear()}-1C`;
  return top.term >= 2 ? `${top.year + 1}-1C` : `${top.year}-2C`;
}
