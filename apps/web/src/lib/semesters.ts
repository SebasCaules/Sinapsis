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

/** Agrupa por `semester` (descendente) y ordena cada grupo por `position` (empate: por nombre). */
export function groupBySemester(cards: SubjectCard[]): SemesterGroup[] {
  const buckets = new Map<string, SubjectCard[]>();
  for (const card of cards) {
    const key = card.semester || "Sin cuatrimestre";
    const list = buckets.get(key);
    if (list) list.push(card);
    else buckets.set(key, [card]);
  }
  return [...buckets.entries()]
    .sort((a, b) => compareSemestersDesc(a[0], b[0]))
    .map(([semester, list]) => ({
      semester,
      label: semesterLabel(semester),
      chip: semesterChip(semester),
      cards: [...list].sort((a, b) => a.position - b.position || a.name.localeCompare(b.name, "es")),
    }));
}

/** Sugerencia para "+ Agregar cuatrimestre": el siguiente al más reciente. */
export function nextSemesterSuggestion(existing: string[]): string {
  const parsed = existing.map(parseSemester).filter((p): p is SemesterParts => p !== null);
  if (parsed.length === 0) return `${new Date().getFullYear()}-1C`;
  const top = parsed.sort((a, b) => b.year - a.year || b.term - a.term)[0];
  if (!top) return `${new Date().getFullYear()}-1C`;
  return top.term >= 2 ? `${top.year + 1}-1C` : `${top.year}-2C`;
}
