/**
 * Lógica pura del calendario de la plataforma. Sin React, sin DOM y sin `Intl`:
 * los nombres de mes y de día son fijos en español neutro, porque el rótulo de
 * una fecha no puede depender del idioma que tenga configurado el sistema del
 * visitante (el mismo plan de estudio debe leerse igual en cualquier máquina).
 *
 * El tipo de trabajo es `CalendarDate` —año, mes 1-12 y día—, nunca `Date`: un
 * `Date` arrastra hora y zona horaria, y con eso «2026-04-12» se convierte en el
 * 11 de abril a poco que el navegador esté al oeste de Greenwich. La aritmética
 * se hace con `Date.UTC`, que sí es estable, y vuelve a salir como CalendarDate.
 */

/** Fecha civil sin hora ni zona. `month` va de 1 a 12. */
export interface CalendarDate {
  year: number;
  month: number;
  day: number;
}

export const MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
] as const;

export const MONTHS_SHORT = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
] as const;

/** Días de la semana empezando por el lunes (la semana del calendario). */
export const WEEKDAYS = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"] as const;
export const WEEKDAYS_SHORT = ["lu", "ma", "mi", "ju", "vi", "sá", "do"] as const;

const ISO_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Días que tiene un mes (con año bisiesto proléptico gregoriano). */
export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/**
 * «AAAA-MM-DD» → CalendarDate. Devuelve null si el texto no tiene ese formato o
 * si la fecha no existe (mes 13, 31 de febrero): el componente trata un valor
 * ilegible como «sin fecha» en lugar de reventar.
 */
export function parseIso(iso: string | null | undefined): CalendarDate | null {
  if (!iso) return null;
  const m = ISO_RE.exec(iso);
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > daysInMonth(year, month)) return null;
  return { year, month, day };
}

const pad = (n: number, width = 2): string => String(n).padStart(width, "0");

/** CalendarDate → «AAAA-MM-DD». */
export function formatIso(d: CalendarDate): string {
  return `${pad(d.year, 4)}-${pad(d.month)}-${pad(d.day)}`;
}

const toUtc = (d: CalendarDate): Date => new Date(Date.UTC(d.year, d.month - 1, d.day));

const fromUtc = (t: Date): CalendarDate => ({
  year: t.getUTCFullYear(),
  month: t.getUTCMonth() + 1,
  day: t.getUTCDate(),
});

/** Suma (o resta) días cruzando meses y años. */
export function addDays(d: CalendarDate, n: number): CalendarDate {
  const t = toUtc(d);
  t.setUTCDate(t.getUTCDate() + n);
  return fromUtc(t);
}

/**
 * Suma (o resta) meses conservando el día cuando existe. El 31 de enero más un
 * mes es el 28 (o 29) de febrero, no el 3 de marzo: saltarse el mes de destino
 * al mover el calendario con AvPág sería un error visible.
 */
export function addMonths(d: CalendarDate, n: number): CalendarDate {
  const total = d.year * 12 + (d.month - 1) + n;
  const year = Math.floor(total / 12);
  const month = (total % 12) + 1;
  return { year, month, day: Math.min(d.day, daysInMonth(year, month)) };
}

/** Suma (o resta) años, con el mismo cuidado del 29 de febrero. */
export function addYears(d: CalendarDate, n: number): CalendarDate {
  return addMonths(d, n * 12);
}

/** Índice del día de la semana con el lunes en 0 y el domingo en 6. */
export function weekdayIndex(d: CalendarDate): number {
  return (toUtc(d).getUTCDay() + 6) % 7;
}

/** true si `d` cae en sábado o domingo. */
export function isWeekend(d: CalendarDate): boolean {
  return weekdayIndex(d) >= 5;
}

/**
 * Rejilla del mes: SIEMPRE 6 filas de 7 días empezando en lunes, con los días
 * de los meses vecinos que completan la primera y la última semana. El alto fijo
 * evita que el calendario salte de tamaño al cambiar de mes.
 */
export function monthGrid(year: number, month: number): CalendarDate[][] {
  const first: CalendarDate = { year, month, day: 1 };
  const start = addDays(first, -weekdayIndex(first));
  const rows: CalendarDate[][] = [];
  for (let r = 0; r < 6; r++) {
    const row: CalendarDate[] = [];
    for (let c = 0; c < 7; c++) row.push(addDays(start, r * 7 + c));
    rows.push(row);
  }
  return rows;
}

/** «12 de abril de 2026» — el nombre accesible de cada celda. */
export function formatLong(d: CalendarDate): string {
  return `${d.day} de ${MONTHS[d.month - 1]} de ${d.year}`;
}

/** «12 abr 2026» — el texto del disparador, que tiene poco ancho. */
export function formatShort(d: CalendarDate): string {
  return `${d.day} ${MONTHS_SHORT[d.month - 1]} ${d.year}`;
}

/** «Abril de 2026» — la cabecera del calendario. */
export function formatMonthYear(year: number, month: number): string {
  const name: string = MONTHS[month - 1] ?? "";
  return `${name.charAt(0).toUpperCase()}${name.slice(1)} de ${year}`;
}

/** −1, 0 o 1. Ordena dos fechas civiles sin pasar por `Date`. */
export function compare(a: CalendarDate, b: CalendarDate): number {
  if (a.year !== b.year) return a.year < b.year ? -1 : 1;
  if (a.month !== b.month) return a.month < b.month ? -1 : 1;
  if (a.day !== b.day) return a.day < b.day ? -1 : 1;
  return 0;
}

export function isSameDay(a: CalendarDate | null | undefined, b: CalendarDate | null | undefined): boolean {
  return !!a && !!b && a.year === b.year && a.month === b.month && a.day === b.day;
}

/** true si la fecha queda fuera del rango permitido (extremos incluidos). */
export function isOutOfRange(
  d: CalendarDate,
  min?: CalendarDate | null,
  max?: CalendarDate | null,
): boolean {
  if (min && compare(d, min) < 0) return true;
  if (max && compare(d, max) > 0) return true;
  return false;
}

/** Acerca la fecha al rango: por debajo devuelve `min`, por encima `max`. */
export function clamp(d: CalendarDate, min?: CalendarDate | null, max?: CalendarDate | null): CalendarDate {
  if (min && compare(d, min) < 0) return min;
  if (max && compare(d, max) > 0) return max;
  return d;
}

/** El día de hoy en la hora local del visitante, ya como fecha civil. */
export function today(now: Date = new Date()): CalendarDate {
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
}
