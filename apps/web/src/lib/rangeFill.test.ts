import { afterEach, describe, expect, it } from "vitest";
import { installRangeFill, rangePercent, syncRange } from "./rangeFill";

describe("rangeFill", () => {
  let off: (() => void) | null = null;
  afterEach(() => {
    off?.();
    off = null;
    document.body.innerHTML = "";
  });

  it("rangePercent acota y tolera rangos vacíos", () => {
    expect(rangePercent(5, 0, 10)).toBe(50);
    expect(rangePercent(-1, 0, 10)).toBe(0);
    expect(rangePercent(20, 0, 10)).toBe(100);
    expect(rangePercent(3, 5, 5)).toBe(0);
  });

  it("syncRange escribe --pct y el setter de value lo mantiene al día", () => {
    off = installRangeFill();
    const el = document.createElement("input");
    el.type = "range";
    el.min = "0";
    el.max = "20";
    el.value = "5";
    document.body.appendChild(el);
    syncRange(el);
    expect(el.style.getPropertyValue("--pct")).toBe("25.00%");
    el.value = "10";
    expect(el.style.getPropertyValue("--pct")).toBe("50.00%");
    el.value = "15";
    el.dispatchEvent(new Event("input", { bubbles: true }));
    expect(el.style.getPropertyValue("--pct")).toBe("75.00%");
  });
});
