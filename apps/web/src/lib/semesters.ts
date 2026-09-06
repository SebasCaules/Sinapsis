/**
 * Cuatrimestres de la landing: analizar el rótulo, ordenarlos y agrupar tarjetas.
 * El rótulo canónico es "AAAA-1C" / "AAAA-2C" (el que sugiere `sinapsis.config.json`),
 * pero el usuario puede escribir cualquier cosa: lo que no se puede analizar se
 * conserva tal cual y se ordena al final.
 */
import type { SubjectCard } from "@sinapsis/contract";

export interface SemesterParts {
  year: number;
  term: number;
}

const RE = /^\s*(\d{4})\s*-\s*(\d{1,2})\s*C\s*$/i;

/** "2026-1C" → { year: 2026, term: 1 }. Devuelve null si el rótulo es libre. */
export function parseSemester(raw: string): SemesterParts | null {
  const m = RE.exec(raw ?? "");
  if (!m) return null;
  const year = Number(m[1]);
  const term = Number(m[2]);
  if (!Number.isFinite(year) || !Number.isFinite(term) || term < 1) return null;
  return { year, term };
}

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

/**
 * Orden natural descendente: el cuatrimestre más reciente primero
 * ("2026-2C" > "2026-1C" > "2025-2C"). Los rótulos libres van al final,
 * ordenados alfabéticamente de forma descendente.
 */
export function compareSemestersDesc(a: string, b: string): number {
  const pa = parseSemester(a);
  const pb = parseSemester(b);
  if (pa && pb) return pb.year - pa.year || pb.term - pa.term;
  if (pa) return -1;
  if (pb) return 1;
  return b.localeCompare(a, "es", { numeric: true, sensitivity: "base" });
}

export interface SemesterGroup {
  semester: string;
  label: string;
  chip: string;
  cards: SubjectCard[];
}

/**
 * Agrupa por `semester` (descendente) y ordena cada grupo por `position`
 * (empate: por nombre). `extraSemesters` fuerza la aparición de cuatrimestres
 * vacíos (los que el usuario acaba de crear en modo gestión).
 */
export function groupBySemester(cards: SubjectCard[], extraSemesters: string[] = []): SemesterGroup[] {
  const buckets = new Map<string, SubjectCard[]>();
  for (const s of extraSemesters) if (!buckets.has(s)) buckets.set(s, []);
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
