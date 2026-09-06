import { describe, expect, it } from "vitest";
import { createMath } from "../src/math.js";

const M = createMath();

/** Igualdad numérica con tolerancia relativa. */
function close(a: number, b: number, rel = 1e-9): void {
  expect(Math.abs(a - b)).toBeLessThanOrEqual(Math.abs(b) * rel + 1e-12);
}

describe("M — normal", () => {
  it("Φ(1.96) = 0.975 (tabla)", () => {
    close(M.normCDF(1.96), 0.9750021048517795, 1e-12);
  });
  it("z_{0.975} = 1.959964", () => {
    close(M.normInv(0.975), 1.959963984540054, 1e-9);
  });
  it("la cola superior conserva cifras donde 1 − Φ colapsa", () => {
    close(M.normSF(6), 9.865876450376946e-10, 1e-9);
    expect(M.normSF(9)).toBeGreaterThan(0);
  });
  it("normPDF(0) = 1/√(2π)", () => {
    close(M.normPDF(0), 1 / Math.sqrt(2 * Math.PI), 1e-12);
  });
  it("normCDF con μ y σ", () => {
    close(M.normCDF(110, 100, 10), M.normCDF(1), 1e-12);
  });
});

describe("M — t de Student y chi cuadrado", () => {
  it("t_{0.975,10} = 2.228", () => {
    expect(M.tInv(0.975, 10)).toBeCloseTo(2.228138852, 6);
  });
  it("tCDF invierte a tInv", () => {
    close(M.tCDF(M.tInv(0.975, 10), 10), 0.975, 1e-7);
  });
  it("una cola extrema con pocos grados de libertad NO se corta en ±1000", () => {
    /* AC-04: el corchete de la bisección era fijo, así que `tInv` devolvía el
       extremo en silencio. t_{0.9999, 1} (Cauchy) vale 3183.098757. */
    close(M.tInv(0.9999, 1), 3183.0987578790806, 1e-6);
    close(M.tInv(1e-4, 1), -3183.0987578790806, 1e-6);
  });
  it("χ²_{0.95,5} = 11.07", () => {
    expect(M.chi2Inv(0.95, 5)).toBeCloseTo(11.0704976935, 6);
  });
  it("chi2CDF invierte a chi2Inv", () => {
    close(M.chi2CDF(11.0704976935, 5), 0.95, 1e-7);
  });
});

describe("M — gamma y combinatoria", () => {
  it("Γ(5) = 24", () => close(M.gammafn(5), 24, 1e-10));
  it("lgamma(1) = 0", () => expect(Math.abs(M.lgamma(1))).toBeLessThan(1e-12));
  it("C(10,3) = 120", () => expect(M.comb(10, 3)).toBe(120));
  it("combExact(52,5) = 2598960", () => expect(M.combExact(52, 5)).toBe(2598960));
});

describe("M — discretas", () => {
  it("binomPMF(3;10,0.5) = 0.1171875 exacto", () => {
    expect(M.binomPMF(3, 10, 0.5)).toBe(0.1171875);
  });
  it("binomCDF(3;10,0.5) = 0.171875", () => close(M.binomCDF(3, 10, 0.5), 0.171875, 1e-12));
  it("binomSF(8;10,0.5) = 56/1024", () => close(M.binomSF(8, 10, 0.5), 56 / 1024, 1e-12));
  it("binomInv(0.5;10,0.5) = 5", () => expect(M.binomInv(0.5, 10, 0.5)).toBe(5));
  it("poissonCDF(2;3) = 0.42319", () => close(M.poissonCDF(2, 3), 0.42319008112684364, 1e-10));
  it("poissonSF(4;3) = 1 − CDF(3)", () => close(M.poissonSF(4, 3), 1 - M.poissonCDF(3, 3), 1e-9));
  it("poissonInv(0.5;3) = 3", () => expect(M.poissonInv(0.5, 3)).toBe(3));
  it("hyperPMF(1;10,3,2) = 7/15", () => close(M.hyperPMF(1, 10, 3, 2), 7 / 15, 1e-10));
  it("negbinPMF(2;3,0.5) = 0.1875", () => close(M.negbinPMF(2, 3, 0.5), 0.1875, 1e-10));
  it("negbinCDF acumula la PMF", () => {
    close(M.negbinCDF(2, 3, 0.5), M.negbinPMF(0, 3, 0.5) + M.negbinPMF(1, 3, 0.5) + M.negbinPMF(2, 3, 0.5), 1e-12);
  });
  it("casos degenerados blindados", () => {
    expect(M.binomPMF(0, 5, 0)).toBe(1);
    expect(M.binomPMF(5, 5, 1)).toBe(1);
    expect(M.poissonPMF(0, 0)).toBe(1);
    expect(M.negbinPMF(0, 3, 1)).toBe(1);
  });
});

describe("M — continuas e integración", () => {
  it("expCDF(1;1) = 1 − e⁻¹", () => close(M.expCDF(1, 1), 1 - Math.exp(-1), 1e-12));
  it("uniformCDF(0.5;0,2) = 0.25", () => close(M.uniformCDF(0.5, 0, 2), 0.25, 1e-12));
  it("∫₀¹ x² = 1/3", () => close(M.integrate((x: number) => x * x, 0, 1), 1 / 3, 1e-10));
});

describe("M — álgebra lineal", () => {
  const P = [
    [0.9, 0.1],
    [0.5, 0.5],
  ];
  it("matMul y matPow coinciden", () => {
    const p2 = M.matMul(P, P);
    const q2 = M.matPow(P, 2);
    close(p2[0]![0]!, q2[0]![0]!, 1e-12);
    close(p2[1]![1]!, q2[1]![1]!, 1e-12);
  });
  it("distribución estacionaria de la cadena", () => {
    const pi = M.stationary(P)!;
    close(pi[0]!, 5 / 6, 1e-9);
    close(pi[1]!, 1 / 6, 1e-9);
  });
  it("solveLinear resuelve el sistema", () => {
    const x = M.solveLinear(
      [
        [2, 1],
        [1, 3],
      ],
      [5, 10],
    )!;
    close(x[0]!, 1, 1e-10);
    close(x[1]!, 3, 1e-10);
  });
  it("matInverse invierte una diagonal", () => {
    const inv = M.matInverse([
      [2, 0],
      [0, 4],
    ])!;
    close(inv[0]![0]!, 0.5, 1e-12);
    close(inv[1]![1]!, 0.25, 1e-12);
  });
  it("una matriz singular devuelve null", () => {
    expect(
      M.matInverse([
        [1, 2],
        [2, 4],
      ]),
    ).toBeNull();
  });
});

describe("M — muestra", () => {
  it("media y desvío muestral", () => {
    close(M.meanOf([2, 4, 4, 4, 5, 5, 7, 9]), 5, 1e-12);
    close(M.sampleSD([2, 4, 4, 4, 5, 5, 7, 9]), 2.13808993, 1e-6);
  });
});
