import { describe, expect, it } from "vitest";
import {
  addDays,
  addMonths,
  addYears,
  clamp,
  compare,
  daysInMonth,
  formatIso,
  formatLong,
  formatMonthYear,
  formatShort,
  isOutOfRange,
  isSameDay,
  isWeekend,
  monthGrid,
  parseIso,
  weekdayIndex,
} from "./datePicker";

const d = (year: number, month: number, day: number) => ({ year, month, day });

describe("datePicker · lectura y escritura ISO", () => {
  it("lee y devuelve «AAAA-MM-DD»", () => {
    expect(parseIso("2026-04-12")).toEqual(d(2026, 4, 12));
    expect(formatIso(d(2026, 4, 12))).toBe("2026-04-12");
    expect(formatIso(d(2026, 1, 5))).toBe("2026-01-05");
  });

  it("descarta lo que no es una fecha civil válida", () => {
    for (const bad of ["", "12/04/2026", "2026-4-12", "2026-13-01", "2026-02-30", "2025-02-29", null, undefined]) {
      expect(parseIso(bad)).toBeNull();
    }
    expect(parseIso("2024-02-29")).toEqual(d(2024, 2, 29));
  });
});

describe("datePicker · aritmética", () => {
  it("suma días cruzando el fin de año", () => {
    expect(addDays(d(2025, 12, 31), 1)).toEqual(d(2026, 1, 1));
    expect(addDays(d(2026, 1, 1), -1)).toEqual(d(2025, 12, 31));
    expect(addDays(d(2026, 4, 12), 7)).toEqual(d(2026, 4, 19));
  });

  it("suma meses sin saltarse el mes de destino", () => {
    expect(addMonths(d(2026, 1, 31), 1)).toEqual(d(2026, 2, 28));
    expect(addMonths(d(2024, 1, 31), 1)).toEqual(d(2024, 2, 29));
    expect(addMonths(d(2025, 12, 15), 1)).toEqual(d(2026, 1, 15));
    expect(addMonths(d(2026, 1, 15), -1)).toEqual(d(2025, 12, 15));
    expect(addMonths(d(2026, 4, 12), -12)).toEqual(d(2025, 4, 12));
  });

  it("suma años cuidando el 29 de febrero", () => {
    expect(addYears(d(2024, 2, 29), 1)).toEqual(d(2025, 2, 28));
    expect(addYears(d(2026, 4, 12), -1)).toEqual(d(2025, 4, 12));
  });

  it("cuenta los días de cada mes, con febrero bisiesto", () => {
    expect(daysInMonth(2024, 2)).toBe(29);
    expect(daysInMonth(2025, 2)).toBe(28);
    expect(daysInMonth(2000, 2)).toBe(29);
    expect(daysInMonth(2100, 2)).toBe(28);
    expect(daysInMonth(2026, 4)).toBe(30);
    expect(daysInMonth(2026, 12)).toBe(31);
  });
});

describe("datePicker · rejilla del mes", () => {
  it("son 6 filas de 7 y todas empiezan en lunes", () => {
    for (const [y, m] of [
      [2026, 4],
      [2026, 2],
      [2024, 2],
      [2025, 12],
      [2026, 3],
    ] as const) {
      const grid = monthGrid(y, m);
      expect(grid).toHaveLength(6);
      for (const row of grid) {
        expect(row).toHaveLength(7);
        expect(weekdayIndex(row[0]!)).toBe(0);
        expect(isWeekend(row[5]!)).toBe(true);
        expect(isWeekend(row[6]!)).toBe(true);
      }
    }
  });

  it("empieza en el lunes anterior al día 1 y es continua", () => {
    /* El 1 de abril de 2026 cae miércoles: la fila arranca el lunes 30 de marzo. */
    const grid = monthGrid(2026, 4);
    expect(formatIso(grid[0]![0]!)).toBe("2026-03-30");
    expect(formatIso(grid[0]![2]!)).toBe("2026-04-01");
    const flat = grid.flat();
    expect(flat).toHaveLength(42);
    for (let i = 1; i < flat.length; i++) {
      expect(flat[i]).toEqual(addDays(flat[i - 1]!, 1));
    }
  });

  it("febrero de un año bisiesto muestra el día 29", () => {
    const flat = monthGrid(2024, 2).flat().map(formatIso);
    expect(flat).toContain("2024-02-29");
    expect(flat).not.toContain("2024-02-30");
    /* Febrero de 2021 empezó lunes: aun así hay 6 filas (llega hasta marzo). */
    expect(monthGrid(2021, 2).flat().map(formatIso)).toContain("2021-03-14");
  });

  it("el mes que cruza de año trae los dos años", () => {
    const flat = monthGrid(2025, 12).flat().map(formatIso);
    expect(flat[0]).toBe("2025-12-01");
    expect(flat).toContain("2026-01-04");
  });
});

describe("datePicker · formatos en español neutro", () => {
  it("largo, corto y cabecera", () => {
    expect(formatLong(d(2026, 4, 12))).toBe("12 de abril de 2026");
    expect(formatLong(d(2026, 9, 1))).toBe("1 de septiembre de 2026");
    expect(formatShort(d(2026, 4, 12))).toBe("12 abr 2026");
    expect(formatShort(d(2025, 12, 3))).toBe("3 dic 2025");
    expect(formatMonthYear(2026, 4)).toBe("Abril de 2026");
    expect(formatMonthYear(2026, 1)).toBe("Enero de 2026");
  });
});

describe("datePicker · comparación y rango", () => {
  it("ordena y compara días", () => {
    expect(compare(d(2026, 4, 12), d(2026, 4, 12))).toBe(0);
    expect(compare(d(2025, 12, 31), d(2026, 1, 1))).toBe(-1);
    expect(compare(d(2026, 5, 1), d(2026, 4, 30))).toBe(1);
    expect(isSameDay(d(2026, 4, 12), d(2026, 4, 12))).toBe(true);
    expect(isSameDay(d(2026, 4, 12), d(2026, 5, 12))).toBe(false);
    expect(isSameDay(null, d(2026, 4, 12))).toBe(false);
  });

  it("acerca la fecha al rango y marca las de fuera", () => {
    const min = d(2026, 4, 10);
    const max = d(2026, 4, 20);
    expect(clamp(d(2026, 4, 1), min, max)).toEqual(min);
    expect(clamp(d(2026, 5, 1), min, max)).toEqual(max);
    expect(clamp(d(2026, 4, 15), min, max)).toEqual(d(2026, 4, 15));
    expect(clamp(d(2026, 4, 15), null, null)).toEqual(d(2026, 4, 15));
    expect(clamp(d(2026, 1, 1), null, max)).toEqual(d(2026, 1, 1));
    expect(isOutOfRange(d(2026, 4, 9), min, max)).toBe(true);
    expect(isOutOfRange(d(2026, 4, 10), min, max)).toBe(false);
    expect(isOutOfRange(d(2026, 4, 20), min, max)).toBe(false);
    expect(isOutOfRange(d(2026, 4, 21), min, max)).toBe(true);
    expect(isOutOfRange(d(1999, 1, 1))).toBe(false);
  });
});
