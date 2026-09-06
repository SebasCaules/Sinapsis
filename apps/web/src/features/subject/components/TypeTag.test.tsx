import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EXERCISES_COLOR, EXERCISES_LABEL, EXERCISES_TYPE, PageTypeTag, TypeTag, typeTagOf } from "./TypeTag";

const model = { typeLabel: (k: string) => (k === "concepto" ? "Concepto" : k), typeColor: (k: string) => `var(--${k})` };

describe("TypeTag", () => {
  it("dibuja el rótulo con el tipo y el color del tipo", () => {
    render(<TypeTag type="concepto" label="Concepto" color="var(--u2)" />);
    const tag = screen.getByText("Concepto");
    expect(tag.getAttribute("data-type")).toBe("concepto");
    expect(tag.getAttribute("style")).toContain("--tcol: var(--u2)");
  });

  it("PageTypeTag resuelve rótulo y color desde el modelo, y el sintético de ejercicios por su cuenta", () => {
    render(<PageTypeTag model={model} type="concepto" size="sm" />);
    expect(screen.getByText("Concepto").getAttribute("style")).toContain("var(--concepto)");
    expect(typeTagOf(model, EXERCISES_TYPE)).toEqual({ label: EXERCISES_LABEL, color: EXERCISES_COLOR });
  });
});
