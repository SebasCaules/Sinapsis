/**
 * Ancho de la hoja del lector, ajustable por el lector mismo (pedido del
 * usuario: «que el card de la página de la wiki sea agrandable para los
 * costados»).
 *
 * La medida de 840 de N0-20 sigue siendo el VALOR DE FÁBRICA —la hoja nace ahí
 * y ahí vuelve con un doble clic— pero deja de ser una constante encerrada en el
 * CSS: pasa a ser `--sheet-width` en `.layout`, y `.sheet` la lee con
 * `min(var(--sheet-width), 100%)`, de modo que el ancho elegido nunca puede
 * desbordar la columna.
 *
 * Es una preferencia de LECTURA, global como el tema y no por materia: quien
 * agranda la hoja lo hace porque su pantalla o su vista se lo piden, no porque
 * esté leyendo Probabilidad. Se guarda con una clave propia, con la forma de
 * `LS_KEYS` pero sin entrar en el contrato (mismo criterio que `planTrackKey`
 * en `features/subject/store.ts`): no viaja por ningún contrato ni por la copia
 * de seguridad.
 */
import { useCallback, useState } from "react";

/** Medida de fábrica: los 840 del contrato y de N0-20. */
export const SHEET_DEFAULT = 840;
/** Por debajo la medida de lectura se rompe y las fórmulas largas no entran. */
export const SHEET_MIN = 620;
/** Por encima el renglón se vuelve demasiado largo para seguirlo con el ojo. */
export const SHEET_MAX = 1320;
/** Paso del teclado en las flechas; con Shift, cuatro veces más. */
export const SHEET_STEP = 24;

/**
 * Clave de la preferencia. Sigue la forma de `LS_KEYS` del contrato
 * (`sinapsis.<preferencia>`) sin agregarle una entrada: es solo de la web.
 */
export const SHEET_WIDTH_KEY = "sinapsis.sheetWidth";

/** Recorta a los límites y a un entero de píxeles. Lo ilegible cae al valor de fábrica. */
export function clampSheetWidth(value: number): number {
  if (!Number.isFinite(value)) return SHEET_DEFAULT;
  return Math.round(Math.min(SHEET_MAX, Math.max(SHEET_MIN, value)));
}

/**
 * Ancho guardado. Solo se acepta un número DENTRO de los límites: basura, vacío
 * o un valor de otra época (si mañana cambian `SHEET_MIN` o `SHEET_MAX`) vuelven
 * a los 840 en vez de dejar la hoja en una medida que ya no se puede elegir.
 */
export function readSheetWidth(): number {
  try {
    const raw = localStorage.getItem(SHEET_WIDTH_KEY);
    if (raw === null || raw.trim() === "") return SHEET_DEFAULT;
    const value = Number(raw);
    if (!Number.isFinite(value) || value < SHEET_MIN || value > SHEET_MAX) return SHEET_DEFAULT;
    return Math.round(value);
  } catch {
    return SHEET_DEFAULT;
  }
}

/** Guarda la preferencia. Sin almacenamiento, vale para esta sesión y nada más. */
export function writeSheetWidth(value: number): void {
  try {
    localStorage.setItem(SHEET_WIDTH_KEY, String(clampSheetWidth(value)));
  } catch {
    /* modo privado o cuota llena: la preferencia se pierde, la app sigue */
  }
}

/**
 * Ancho nuevo al arrastrar un asa `dx` píxeles hacia la derecha.
 *
 * El crecimiento es SIMÉTRICO porque la hoja está centrada en la columna: si el
 * asa derecha se corre 60 px, la hoja tiene que crecer 120 (60 de cada lado)
 * para que ese borde siga exactamente debajo del puntero. El asa izquierda hace
 * lo mismo al revés: hacia la izquierda agranda, hacia la derecha achica.
 */
export function resizeSheet(startWidth: number, dx: number, side: "left" | "right"): number {
  const delta = side === "right" ? dx : -dx;
  return clampSheetWidth(startWidth + delta * 2);
}

/**
 * Estado del ancho: arranca en lo guardado y cada cambio se recorta y se
 * persiste. El lector monta y desmonta a cada página, así que la lectura inicial
 * es perezosa (`useState(readSheetWidth)`) y no toca `localStorage` en cada
 * render.
 */
export function useSheetWidth(): [number, (value: number) => void] {
  const [width, setWidth] = useState(readSheetWidth);
  const commit = useCallback((value: number) => {
    const next = clampSheetWidth(value);
    setWidth(next);
    writeSheetWidth(next);
  }, []);
  return [width, commit];
}
