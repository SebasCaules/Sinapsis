import { describe, expect, it } from "vitest";
import { stripLeadingH1 } from "./ReaderView";

describe("stripLeadingH1", () => {
  it("quita el H1 inicial cuando coincide con el título", () => {
    expect(stripLeadingH1("# Distribución Normal\n\n**En breve.** texto", "Distribución Normal")).toBe("**En breve.** texto");
  });
  it("no toca el cuerpo si no empieza con H1", () => {
    expect(stripLeadingH1("Intro\n# Otro", "Distribución Normal")).toBe("Intro\n# Otro");
  });
  it("conserva un H1 distinto del título", () => {
    expect(stripLeadingH1("# Otro título\ntexto", "Distribución Normal")).toBe("# Otro título\ntexto");
  });
  it("tolera formato y espacios en el H1", () => {
    expect(stripLeadingH1("#  **Distribución Normal**  \ntexto", "Distribución Normal")).toBe("texto");
  });
});
