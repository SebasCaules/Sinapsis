import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Button } from "./Button";
import css from "./Button.module.css";

afterEach(cleanup);

describe("<Button/>", () => {
  it("por defecto es secundario", () => {
    render(<Button>Cancelar</Button>);
    const btn = screen.getByRole("button", { name: "Cancelar" });
    expect(btn.getAttribute("data-variant")).toBe("secondary");
    expect(btn.getAttribute("type")).toBe("button");
  });

  it("la variante destructiva se marca y se pinta distinto de la primaria", () => {
    render(<Button variant="danger">Quitar materia</Button>);
    const btn = screen.getByRole("button", { name: "Quitar materia" });
    expect(btn.getAttribute("data-variant")).toBe("danger");
    expect(btn.className).toContain(css.danger);
    expect(btn.className).not.toContain(css.primary);
  });

  it("un botón ocupado lo dice con aria-busy", () => {
    render(
      <Button variant="primary" disabled aria-busy>
        Guardando…
      </Button>,
    );
    const btn = screen.getByRole("button", { name: "Guardando…" });
    expect(btn.getAttribute("aria-busy")).toBe("true");
    expect((btn as HTMLButtonElement).disabled).toBe(true);
  });

  it("un conmutador expone su estado", () => {
    render(<Button active>Gestionar</Button>);
    const btn = screen.getByRole("button", { name: "Gestionar" });
    expect(btn.getAttribute("aria-pressed")).toBe("true");
    expect(btn.getAttribute("data-active")).toBe("true");
  });
});
