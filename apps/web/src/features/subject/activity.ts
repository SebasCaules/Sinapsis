/**
 * Actividad de estudio de la materia, en el navegador (localStorage, clave
 * `LS_KEYS.activity(slug)`): los días en los que hubo estudio (para la racha
 * del inicio, como el `pe.activity` del baseline) y la última página abierta
 * («Continuar leyendo»). Es una preferencia local a propósito: no viaja al API
 * ni al contrato (si algún día conviene compartirla entre dispositivos, se
 * promueve a `StudyState`).
 *
 *   recordActivity(slug)        anota el día local de hoy (calificar, quiz, leer)
 *   setLastRead(slug, page)     guarda la última página leída con su instante
 *   useActivity(slug)           hook: { days, streak, lastRead }
 *   streakOf(days, today)       racha de días consecutivos que termina hoy o ayer
 */
import { useSyncExternalStore } from "react";
import { LS_KEYS } from "@sinapsis/contract";

export interface Activity {
  /** Días locales AAAA-MM-DD con estudio, ventana de 60, del más viejo al más nuevo. */
  days: string[];
  lastRead: { page: string; at: string } | null;
}

const WINDOW = 60;
const EMPTY: Activity = Object.freeze({ days: [], lastRead: null }) as Activity;
const listeners = new Set<() => void>();
const cache = new Map<string, Activity>();

/** Día LOCAL de hoy como AAAA-MM-DD (nunca UTC: a la noche cambiaría de día). */
export function localToday(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function read(slug: string): Activity {
  const hit = cache.get(slug);
  if (hit) return hit;
  let value: Activity = EMPTY;
  try {
    const raw = localStorage.getItem(LS_KEYS.activity(slug));
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Activity>;
      value = {
        days: Array.isArray(parsed.days) ? parsed.days.filter((d): d is string => typeof d === "string").slice(-WINDOW) : [],
        lastRead:
          parsed.lastRead && typeof parsed.lastRead.page === "string" && typeof parsed.lastRead.at === "string"
            ? { page: parsed.lastRead.page, at: parsed.lastRead.at }
            : null,
      };
    }
  } catch {
    value = EMPTY;
  }
  cache.set(slug, value);
  return value;
}

function write(slug: string, next: Activity): void {
  cache.set(slug, next);
  try {
    localStorage.setItem(LS_KEYS.activity(slug), JSON.stringify(next));
  } catch {
    /* sin almacenamiento: la actividad vive solo en memoria */
  }
  for (const fn of listeners) fn();
}

export function recordActivity(slug: string, today = localToday()): void {
  const cur = read(slug);
  if (cur.days[cur.days.length - 1] === today) return;
  const days = [...cur.days.filter((d) => d !== today), today].sort().slice(-WINDOW);
  write(slug, { ...cur, days });
}

export function setLastRead(slug: string, page: string, at = new Date().toISOString()): void {
  const cur = read(slug);
  if (cur.lastRead?.page === page) return;
  write(slug, { ...cur, lastRead: { page, at } });
}

/** Racha: días consecutivos con estudio que llegan hasta hoy (o hasta ayer, que todavía no se corta). */
export function streakOf(days: readonly string[], today = localToday()): number {
  const set = new Set(days);
  const dayMs = 86_400_000;
  const toNum = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    return Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1) / dayMs;
  };
  let cursor = toNum(today);
  if (!set.has(today)) {
    cursor -= 1;
    if (!set.has(fromNum(cursor))) return 0;
  }
  let n = 0;
  while (set.has(fromNum(cursor))) {
    n += 1;
    cursor -= 1;
  }
  return n;
}

function fromNum(n: number): string {
  return new Date(n * 86_400_000).toISOString().slice(0, 10);
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function useActivity(slug: string): Activity & { streak: number } {
  const value = useSyncExternalStore(subscribe, () => read(slug), () => EMPTY);
  return { ...value, streak: streakOf(value.days) };
}
