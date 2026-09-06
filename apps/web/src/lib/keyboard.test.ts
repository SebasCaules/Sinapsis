import { describe, expect, it } from "vitest";
import { isTypingTarget } from "./keyboard";

const el = (tag: string) => document.createElement(tag);

describe("isTypingTarget", () => {
  it("reconoce los controles donde se escribe", () => {
    expect(isTypingTarget(el("input"))).toBe(true);
    expect(isTypingTarget(el("textarea"))).toBe(true);
    expect(isTypingTarget(el("select"))).toBe(true);
  });

  it("reconoce el contenido editable", () => {
    const div = el("div");
    Object.defineProperty(div, "isContentEditable", { value: true });
    expect(isTypingTarget(div)).toBe(true);
  });

  it("deja pasar el atajo en el resto de la página", () => {
    expect(isTypingTarget(el("button"))).toBe(false);
    expect(isTypingTarget(el("div"))).toBe(false);
    expect(isTypingTarget(document.body)).toBe(false);
  });

  it("tolera un destino que no es un elemento", () => {
    expect(isTypingTarget(null)).toBe(false);
    expect(isTypingTarget(window)).toBe(false);
    expect(isTypingTarget({} as EventTarget)).toBe(false);
  });
});
