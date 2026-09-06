/**
 * La mezcla pura y la partida de quiz guardada en el navegador.
 *
 * La mezcla se prueba con un generador fijo: sin eso no hay forma de afirmar
 * nada sobre un resultado al azar, y lo que importa es que sea una permutación
 * (no pierde ni duplica preguntas) y que no toque la lista de entrada.
 */
import { afterEach, describe, expect, it } from "vitest";
import { clearRun, readRun, saveRun, shuffle } from "./quizStore";

afterEach(() => {
  localStorage.clear();
});

describe("shuffle", () => {
  it("no toca la lista original y devuelve una permutación", () => {
    const input = ["a", "b", "c", "d", "e"];
    const copy = [...input];
    const out = shuffle(input);
    expect(input).toEqual(copy);
    expect(out).not.toBe(input);
    expect([...out].sort()).toEqual([...input].sort());
  });

  it("con un azar que devuelve el máximo, el orden no cambia", () => {
    /* `j = floor(0,999 * (i + 1)) = i`: cada elemento se cambia consigo mismo. */
    expect(shuffle([1, 2, 3, 4], () => 0.999)).toEqual([1, 2, 3, 4]);
  });

  it("con un azar que devuelve cero, el primero termina último", () => {
    /* Fisher-Yates de atrás para adelante con `j = 0` es una rotación. */
    expect(shuffle([1, 2, 3], () => 0)).toEqual([2, 3, 1]);
  });

  it("una lista vacía o de un elemento sale igual", () => {
    expect(shuffle([])).toEqual([]);
    expect(shuffle(["solo"])).toEqual(["solo"]);
  });
});

const run = {
  quizId: "q1",
  ids: ["p1", "p2", "p3"],
  at: 1,
  picks: { p1: 2 },
  retry: false,
  n: null,
};

describe("la partida guardada", () => {
  it("guarda y devuelve la partida del mismo quiz", () => {
    saveRun("proba", run);
    expect(readRun("proba", "q1")).toMatchObject({ ids: run.ids, at: 1, picks: { p1: 2 }, n: null });
  });

  it("no cruza materias ni quizzes", () => {
    saveRun("proba", run);
    expect(readRun("algebra", "q1")).toBeNull();
    expect(readRun("proba", "otro")).toBeNull();
  });

  it("no reanuda una partida terminada: ver el resultado ES terminarla", () => {
    saveRun("proba", { ...run, at: run.ids.length });
    expect(readRun("proba", "q1")).toBeNull();
  });

  it("no reanuda una partida de más de un día", () => {
    saveRun("proba", run);
    const mañana = Date.now() + 25 * 60 * 60 * 1000;
    expect(readRun("proba", "q1", mañana)).toBeNull();
  });

  it("recuerda la longitud pedida, para no reanudar una tanda por otra", () => {
    saveRun("proba", { ...run, n: 5 });
    expect(readRun("proba", "q1")?.n).toBe(5);
  });

  it("clearRun la borra y deja en paz a las demás", () => {
    saveRun("proba", run);
    saveRun("proba", { ...run, quizId: "q2" });
    clearRun("proba", "q1");
    expect(readRun("proba", "q1")).toBeNull();
    expect(readRun("proba", "q2")).not.toBeNull();
  });

  it("un valor corrupto en el almacenamiento no rompe la lectura", () => {
    localStorage.setItem("sinapsis.proba.quizRun", "{ esto no es json");
    expect(readRun("proba", "q1")).toBeNull();
  });
});
