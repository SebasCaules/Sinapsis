/**
 * Cuatrimestres de la landing: rótulos y agrupado de tarjetas. Analizar y
 * ordenar el rótulo canónico ("AAAA-1C" / "AAAA-2C") es del contrato, que es la
 * misma regla que aplica el API; acá viven solo los rótulos de la interfaz.
 * El usuario puede escribir cualquier cosa: lo que no se puede analizar se
 * conserva tal cual y se ordena al final.
 */
import {
  canonicalSemester,
  compareSemestersDesc,
  parseSemester,
  type SemesterParts,
  type SubjectCard,
} from "@sinapsis/contract";

export { canonicalSemester, compareSemestersDesc, parseSemester };
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
  /* La identidad de un cuatrimestre es su FORMA CANÓNICA (B10): "2026-1c",
     " 2026-1C " y "2026-1C" son el mismo cuatrimestre, y si se comparan crudos
     la lista termina con secciones gemelas que se pisan al guardar. Lo que se
     muestra y lo que se guarda es siempre la forma canónica. */
  const seen = new Set<string>();
  const out: string[] = [];
  const push = (raw: string) => {
    const label = canonicalSemester(raw);
    if (!label || seen.has(label)) return;
    seen.add(label);
    out.push(label);
  };
  for (const s of saved) push(s);
  const extra = [...new Set(cards.map((c) => canonicalSemester(semesterOf(c))))]
    .filter((s) => s && !seen.has(s))
    .sort(compareSemestersDesc);
  for (const s of extra) push(s);
  return out;
}

/**
 * Reparte las tarjetas en los cuatrimestres dados, en ese orden y sin descartar
 * los vacíos. Cada grupo se ordena por `position` (empate: por nombre).
 */
export function groupBySemesters(semesters: readonly string[], cards: readonly SubjectCard[]): SemesterGroup[] {
  /* El reparto también va por forma canónica (B10): una materia guardada como
     "2026-1c" cae en la sección "2026-1C" en vez de desaparecer de la vista. */
  const buckets = new Map<string, SubjectCard[]>(semesters.map((s) => [canonicalSemester(s), []]));
  for (const card of cards) buckets.get(canonicalSemester(semesterOf(card)))?.push(card);
  return semesters.map((semester) => ({
    semester,
    label: semesterLabel(semester),
    chip: semesterChip(semester),
    cards: [...(buckets.get(canonicalSemester(semester)) ?? [])].sort(
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
