import { describe, expect, it } from "vitest";
import { RAIL_MIN_SCALE, railGroupsHeight, railScale } from "./rail-fit";

describe("railScale", () => {
  it("con lugar de sobra no achica nada", () => {
    expect(railScale(900, [3, 2, 2, 4, 2, 2])).toBe(1);
  });
  it("achica en proporción cuando los grupos no entran", () => {
    const groups = [3, 2, 2, 4, 2, 2];
    const needed = railGroupsHeight(groups); // 15 ítems → 15·36 + 9·2 + 6·13 = 636
    expect(needed).toBe(636);
    const available = 88 + 500; // sello + conmutador + 500 de lugar
    expect(railScale(available, groups)).toBeCloseTo(500 / 636, 2);
  });
  it("no baja del piso ni se rompe sin grupos", () => {
    expect(railScale(200, [8, 8, 8])).toBe(RAIL_MIN_SCALE);
    expect(railScale(200, [])).toBe(1);
    expect(railScale(0, [3])).toBe(1);
  });
});
