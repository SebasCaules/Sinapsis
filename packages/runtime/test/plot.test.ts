import { describe, expect, it } from "vitest";
import { createCompatApp } from "../src/compat.js";
import { makeContext } from "./fixtures.js";

/**
 * `Plot` dibuja sobre canvas 2D, que jsdom no implementa: se prueban las partes
 * PURAS (escalas, ticks, paleta, opacidades) y la leyenda, que es DOM.
 */
const Plot = createCompatApp(makeContext()).app.Plot as Record<string, any>;

describe("Plot", () => {
  it("scales mapea dominio a rango y sabe invertir", () => {
    const s = Plot["scales"]([0, 1], [0, 100]);
    expect(s(0.5)).toBe(50);
    expect(s.invert(25)).toBeCloseTo(0.25, 12);
    expect(s.domain()).toEqual([0, 1]);
    expect(s.range()).toEqual([0, 100]);
  });
  it("scales admite escala logarítmica", () => {
    const s = Plot["scales"]([1, 1000], [0, 300], { log: true });
    expect(s(10)).toBeCloseTo(100, 6);
    expect(s.invert(200)).toBeCloseTo(100, 6);
  });
  it("ticks devuelve valores redondos dentro del intervalo", () => {
    const t = Plot["ticks"](0, 10, 5) as number[];
    expect(t[0]).toBe(0);
    expect(t[t.length - 1]).toBe(10);
    expect(t.every((v) => Number.isFinite(v))).toBe(true);
  });
  it("logTicks devuelve potencias de 10", () => {
    expect(Plot["logTicks"](1, 1000)).toEqual([1, 10, 100, 1000]);
  });
  it("labeler saca los decimales del paso, no del valor", () => {
    const f = Plot["labeler"]([0, 0.1, 0.2]);
    expect(f(0.1)).toBe("0.1");
    expect(f(0)).toBe("0");
    // con paso ≥ 1 no hay decimales (criterio del baseline)
    expect(Plot["labeler"]([0, 5, 10])(5)).toBe("5");
  });
  it("PAD es el padding estándar único", () => {
    expect(Plot["PAD"]).toEqual({ l: 48, r: 16, t: 20, b: 34 });
  });
  it("series delega en Fig.series (1..6, no cíclica)", () => {
    expect(typeof Plot["series"](1)).toBe("string");
    expect(Plot["series"](9)).toBe(Plot["series"](6));
  });
  it("tokenAlpha cae al valor por omisión si el token no existe", () => {
    expect(Plot["tokenAlpha"]("--no-existe", 0.1)).toBe(0.1);
  });
  it("legend emite .pw-legend con una muestra por entrada", () => {
    const host = document.createElement("div");
    Plot["legend"](host, [
      { label: "Binomial", color: "#123456", kind: "bar" },
      { label: "Normal", color: "#654321", kind: "line" },
    ]);
    expect(host.className).toContain("pw-legend");
    expect(host.querySelectorAll(".pw-sw")).toHaveLength(2);
    expect(host.textContent).toContain("Binomial");
  });
});
