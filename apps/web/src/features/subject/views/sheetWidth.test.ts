/**
 * Ancho de la hoja del lector: los límites, lo que se guarda y la cuenta del
 * arrastre.
 *
 * Lo que se prueba acá es la parte PURA (la que decide cuánto mide la hoja); el
 * asa —sus atributos, el teclado y lo que queda en `localStorage`— se prueba
 * montada, en `ReaderView.resize.test.tsx`.
 */
import { beforeEach, describe, expect, it } from "vitest";
import {
  SHEET_DEFAULT,
  SHEET_MAX,
  SHEET_MIN,
  SHEET_STEP,
  SHEET_WIDTH_KEY,
  clampSheetWidth,
  readSheetWidth,
  resizeSheet,
  writeSheetWidth,
} from "./sheetWidth";

beforeEach(() => localStorage.clear());

describe("clampSheetWidth", () => {
  it("un ancho de adentro no se toca", () => {
    expect(clampSheetWidth(SHEET_DEFAULT)).toBe(840);
    expect(clampSheetWidth(1000)).toBe(1000);
  });

  it("recorta a los dos extremos", () => {
    expect(clampSheetWidth(10)).toBe(SHEET_MIN);
    expect(clampSheetWidth(-4000)).toBe(SHEET_MIN);
    expect(clampSheetWidth(99_999)).toBe(SHEET_MAX);
  });

  it("los extremos son alcanzables", () => {
    expect(clampSheetWidth(SHEET_MIN)).toBe(SHEET_MIN);
    expect(clampSheetWidth(SHEET_MAX)).toBe(SHEET_MAX);
  });

  it("redondea a un entero de píxeles", () => {
    expect(clampSheetWidth(840.6)).toBe(841);
  });

  it("lo que no es un número cae en la medida de fábrica", () => {
    expect(clampSheetWidth(Number.NaN)).toBe(SHEET_DEFAULT);
    expect(clampSheetWidth(Number.POSITIVE_INFINITY)).toBe(SHEET_DEFAULT);
  });
});

describe("readSheetWidth", () => {
  it("sin nada guardado, la medida de fábrica", () => {
    expect(readSheetWidth()).toBe(SHEET_DEFAULT);
  });

  it("devuelve el ancho guardado", () => {
    localStorage.setItem(SHEET_WIDTH_KEY, "1024");
    expect(readSheetWidth()).toBe(1024);
  });

  it("basura, vacío o una lista no rompen nada", () => {
    for (const raw of ["", "   ", "ancho", "{}", "840px", "[1,2]"]) {
      localStorage.setItem(SHEET_WIDTH_KEY, raw);
      expect(readSheetWidth(), raw).toBe(SHEET_DEFAULT);
    }
  });

  /* Un valor de otra época (si mañana se mueven los límites) vuelve a fábrica en
     vez de dejar la hoja en una medida que ya no se puede elegir con las asas. */
  it("un valor fuera de los límites vuelve a la medida de fábrica", () => {
    localStorage.setItem(SHEET_WIDTH_KEY, String(SHEET_MIN - 1));
    expect(readSheetWidth()).toBe(SHEET_DEFAULT);
    localStorage.setItem(SHEET_WIDTH_KEY, String(SHEET_MAX + 1));
    expect(readSheetWidth()).toBe(SHEET_DEFAULT);
  });

  it("lo que escribe writeSheetWidth se vuelve a leer igual", () => {
    writeSheetWidth(972);
    expect(localStorage.getItem(SHEET_WIDTH_KEY)).toBe("972");
    expect(readSheetWidth()).toBe(972);
  });

  it("writeSheetWidth guarda ya recortado: nunca deja un valor inválido", () => {
    writeSheetWidth(99_999);
    expect(readSheetWidth()).toBe(SHEET_MAX);
    writeSheetWidth(0);
    expect(readSheetWidth()).toBe(SHEET_MIN);
  });
});

describe("resizeSheet", () => {
  /* La hoja está CENTRADA en la columna: el borde tiene que quedarse debajo del
     puntero, y para eso lo que crece de un lado tiene que crecer también del
     otro. Correr el asa derecha 60 px agranda 120. */
  it("el asa derecha hacia la derecha agranda el doble", () => {
    expect(resizeSheet(840, 60, "right")).toBe(960);
  });

  it("el asa derecha hacia la izquierda achica el doble", () => {
    expect(resizeSheet(840, -60, "right")).toBe(720);
  });

  it("el asa izquierda va al revés", () => {
    expect(resizeSheet(840, -60, "left")).toBe(960);
    expect(resizeSheet(840, 60, "left")).toBe(720);
  });

  it("las dos asas son simétricas: el mismo tirón hacia afuera da el mismo ancho", () => {
    for (const dx of [8, 24, 100, 240]) {
      expect(resizeSheet(840, dx, "right"), String(dx)).toBe(resizeSheet(840, -dx, "left"));
    }
  });

  it("sin movimiento el ancho no cambia", () => {
    expect(resizeSheet(913, 0, "right")).toBe(913);
    expect(resizeSheet(913, 0, "left")).toBe(913);
  });

  it("un tirón enorme se queda en los límites", () => {
    expect(resizeSheet(840, 5000, "right")).toBe(SHEET_MAX);
    expect(resizeSheet(840, -5000, "right")).toBe(SHEET_MIN);
    expect(resizeSheet(840, -5000, "left")).toBe(SHEET_MAX);
    expect(resizeSheet(840, 5000, "left")).toBe(SHEET_MIN);
  });

  it("arranca del ancho que YA tenía la hoja, no de los 840", () => {
    expect(resizeSheet(1000, 40, "right")).toBe(1080);
  });

  it("el paso del teclado es más chico que la mitad del recorrido", () => {
    /* Con Shift el paso es cuatro veces mayor: tiene que seguir habiendo más de
       un tramo entre el mínimo y el máximo, o el ajuste fino se pierde. */
    expect(SHEET_STEP * 4).toBeLessThan((SHEET_MAX - SHEET_MIN) / 2);
  });
});
