import { beforeEach, describe, expect, it } from "vitest";
import { recordActivity, setLastRead, streakOf, useActivity } from "./activity";
import { renderHook } from "@testing-library/react";

describe("activity", () => {
  beforeEach(() => localStorage.clear());

  it("streakOf cuenta los días consecutivos hasta hoy o ayer", () => {
    expect(streakOf(["2026-09-04", "2026-09-05", "2026-09-06"], "2026-09-06")).toBe(3);
    expect(streakOf(["2026-09-04", "2026-09-05"], "2026-09-06")).toBe(2);
    expect(streakOf(["2026-09-03"], "2026-09-06")).toBe(0);
    expect(streakOf([], "2026-09-06")).toBe(0);
  });

  it("recordActivity anota el día una sola vez y setLastRead guarda la página", () => {
    recordActivity("m", "2026-09-06");
    recordActivity("m", "2026-09-06");
    setLastRead("m", "normal", "2026-09-06T10:00:00.000Z");
    const { result } = renderHook(() => useActivity("m"));
    expect(result.current.days).toEqual(["2026-09-06"]);
    expect(result.current.lastRead?.page).toBe("normal");
  });
});
