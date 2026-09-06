import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { DatePicker } from "./DatePicker.tsx";
import { formatLong, formatShort, today } from "./datePicker";

afterEach(cleanup);

const LABEL = "Fecha límite";

function setup(props: Partial<React.ComponentProps<typeof DatePicker>> = {}) {
  const onChange = vi.fn();
  render(<DatePicker value="2026-04-12" onChange={onChange} label={LABEL} {...props} />);
  const trigger = screen.getByRole("button", { name: /^Fecha límite/ });
  return { onChange, trigger };
}

const dialog = () => screen.getByRole("dialog", { name: `Elegir fecha: ${LABEL}` });
const cell = (name: string) => screen.getByRole("gridcell", { name });

describe("<DatePicker/> · disparador", () => {
  it("muestra la fecha en formato corto y su etiqueta accesible", () => {
    const { trigger } = setup();
    expect(trigger.textContent).toContain("12 abr 2026");
    expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(trigger.getAttribute("type")).toBe("button");
  });

  it("sin valor muestra el marcador de posición", () => {
    render(<DatePicker value={null} onChange={() => {}} label="Entrega" placeholder="Sin fecha" />);
    expect(screen.getByRole("button", { name: /^Entrega/ }).textContent).toContain("Sin fecha");
    expect(screen.queryByRole("button", { name: /Quitar fecha/ })).toBeNull();
  });

  it("un valor ilegible se trata como «sin fecha»", () => {
    render(<DatePicker value="12/04/2026" onChange={() => {}} label="Entrega" />);
    expect(screen.getByRole("button", { name: /^Entrega/ }).textContent).toContain("Sin fecha");
  });

  it("«Quitar fecha» devuelve null y no abre el calendario", () => {
    const { onChange } = setup();
    fireEvent.click(screen.getByRole("button", { name: `Quitar fecha: ${LABEL}` }));
    expect(onChange).toHaveBeenCalledWith(null);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("con clearable={false} no hay botón de quitar", () => {
    setup({ clearable: false });
    expect(screen.queryByRole("button", { name: /Quitar fecha/ })).toBeNull();
  });

  it("deshabilitado no abre ni ofrece quitar", () => {
    const { trigger } = setup({ disabled: true });
    expect((trigger as HTMLButtonElement).disabled).toBe(true);
    expect(screen.queryByRole("button", { name: /Quitar fecha/ })).toBeNull();
    fireEvent.click(trigger);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("<DatePicker/> · apertura", () => {
  it("abre con clic y marca aria-expanded", () => {
    const { trigger } = setup();
    fireEvent.click(trigger);
    expect(dialog()).toBeTruthy();
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(trigger.getAttribute("aria-controls")).toBe(dialog().getAttribute("id"));
    expect(dialog().getAttribute("aria-modal")).toBe("false");
  });

  it("abre con Enter, con Espacio y con Flecha abajo", () => {
    const { trigger } = setup();
    for (const key of ["Enter", " ", "ArrowDown"]) {
      fireEvent.keyDown(trigger, { key });
      expect(dialog()).toBeTruthy();
      fireEvent.keyDown(document.activeElement ?? document.body, { key: "Escape" });
      expect(screen.queryByRole("dialog")).toBeNull();
    }
  });

  it("al abrir, el foco cae en la celda del valor", () => {
    const { trigger } = setup();
    fireEvent.click(trigger);
    expect(document.activeElement?.getAttribute("aria-label")).toBe("12 de abril de 2026");
    expect(document.activeElement?.getAttribute("tabindex")).toBe("0");
  });

  it("sin valor el foco cae en la celda de hoy", () => {
    render(<DatePicker value={null} onChange={() => {}} label="Entrega" />);
    fireEvent.click(screen.getByRole("button", { name: /^Entrega/ }));
    expect(document.activeElement?.getAttribute("aria-label")).toBe(formatLong(today()));
    expect(document.activeElement?.getAttribute("data-today")).toBe("true");
  });

  it("la rejilla es de 6 filas de 7 y solo una celda es tabulable", () => {
    const { trigger } = setup();
    fireEvent.click(trigger);
    const grid = within(dialog()).getByRole("grid");
    expect(within(grid).getAllByRole("row")).toHaveLength(6);
    const cells = within(grid).getAllByRole("gridcell");
    expect(cells).toHaveLength(42);
    expect(cells.filter((c) => c.getAttribute("tabindex") === "0")).toHaveLength(1);
  });
});

describe("<DatePicker/> · teclado en la rejilla", () => {
  it("las flechas mueven el foco y la vista sigue al foco", () => {
    const { trigger } = setup({ value: "2026-04-01" });
    fireEvent.click(trigger);
    expect(within(dialog()).getByText("Abril de 2026")).toBeTruthy();
    fireEvent.keyDown(document.activeElement!, { key: "ArrowLeft" });
    expect(document.activeElement?.getAttribute("aria-label")).toBe("31 de marzo de 2026");
    expect(within(dialog()).getByText("Marzo de 2026")).toBeTruthy();
    fireEvent.keyDown(document.activeElement!, { key: "ArrowDown" });
    expect(document.activeElement?.getAttribute("aria-label")).toBe("7 de abril de 2026");
    fireEvent.keyDown(document.activeElement!, { key: "ArrowUp" });
    expect(document.activeElement?.getAttribute("aria-label")).toBe("31 de marzo de 2026");
    fireEvent.keyDown(document.activeElement!, { key: "ArrowRight" });
    expect(document.activeElement?.getAttribute("aria-label")).toBe("1 de abril de 2026");
  });

  it("Inicio y Fin van a los extremos de la semana", () => {
    const { trigger } = setup();
    fireEvent.click(trigger);
    fireEvent.keyDown(document.activeElement!, { key: "Home" });
    expect(document.activeElement?.getAttribute("aria-label")).toBe("6 de abril de 2026");
    fireEvent.keyDown(document.activeElement!, { key: "End" });
    expect(document.activeElement?.getAttribute("aria-label")).toBe("12 de abril de 2026");
  });

  it("AvPág y RePág cambian de mes; con Mayúsculas, de año", () => {
    const { trigger } = setup();
    fireEvent.click(trigger);
    fireEvent.keyDown(document.activeElement!, { key: "PageDown" });
    expect(within(dialog()).getByText("Mayo de 2026")).toBeTruthy();
    expect(document.activeElement?.getAttribute("aria-label")).toBe("12 de mayo de 2026");
    fireEvent.keyDown(document.activeElement!, { key: "PageUp" });
    expect(within(dialog()).getByText("Abril de 2026")).toBeTruthy();
    fireEvent.keyDown(document.activeElement!, { key: "PageDown", shiftKey: true });
    expect(within(dialog()).getByText("Abril de 2027")).toBeTruthy();
    fireEvent.keyDown(document.activeElement!, { key: "PageUp", shiftKey: true });
    expect(within(dialog()).getByText("Abril de 2026")).toBeTruthy();
  });

  it("Enter elige la fecha, cierra y devuelve el foco al disparador", () => {
    const { trigger, onChange } = setup();
    fireEvent.click(trigger);
    fireEvent.keyDown(document.activeElement!, { key: "ArrowRight" });
    fireEvent.keyDown(document.activeElement!, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith("2026-04-13");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("Espacio también elige", () => {
    const { trigger, onChange } = setup();
    fireEvent.click(trigger);
    fireEvent.keyDown(document.activeElement!, { key: " " });
    expect(onChange).toHaveBeenCalledWith("2026-04-12");
  });

  it("Escape cierra sin cambiar nada y devuelve el foco", () => {
    const { trigger, onChange } = setup();
    fireEvent.click(trigger);
    fireEvent.keyDown(document.activeElement!, { key: "ArrowRight" });
    fireEvent.keyDown(document.activeElement!, { key: "Escape" });
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });
});

describe("<DatePicker/> · ratón, cabecera y rango", () => {
  it("un clic en una celda elige esa fecha", () => {
    const { trigger, onChange } = setup();
    fireEvent.click(trigger);
    fireEvent.click(cell("20 de abril de 2026"));
    expect(onChange).toHaveBeenCalledWith("2026-04-20");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("los días del mes vecino se ven, se marcan y se pueden elegir", () => {
    const { trigger, onChange } = setup();
    fireEvent.click(trigger);
    const outside = cell("30 de marzo de 2026");
    expect(outside.getAttribute("data-outside")).toBe("true");
    fireEvent.click(outside);
    expect(onChange).toHaveBeenCalledWith("2026-03-30");
  });

  it("los botones de mes y «Hoy» mueven la vista", () => {
    const { trigger } = setup();
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("button", { name: "Mes siguiente" }));
    expect(within(dialog()).getByText("Mayo de 2026")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Mes anterior" }));
    expect(within(dialog()).getByText("Abril de 2026")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Hoy" }));
    expect(within(dialog()).getByRole("gridcell", { name: formatLong(today()) }).getAttribute("data-today")).toBe("true");
  });

  it("aria-selected marca solo la fecha elegida, y hoy lleva data-today", () => {
    const { trigger } = setup();
    fireEvent.click(trigger);
    expect(cell("12 de abril de 2026").getAttribute("aria-selected")).toBe("true");
    expect(cell("13 de abril de 2026").getAttribute("aria-selected")).toBe("false");
    expect(cell("12 de abril de 2026").getAttribute("data-selected")).toBe("true");
    expect(cell("11 de abril de 2026").getAttribute("data-weekend")).toBe("true");
  });

  it("min y max deshabilitan los días de fuera y los botones que no llevan a ninguna parte", () => {
    const { trigger } = setup({ min: "2026-04-10", max: "2026-04-20" });
    fireEvent.click(trigger);
    expect((cell("9 de abril de 2026") as HTMLButtonElement).disabled).toBe(true);
    expect((cell("21 de abril de 2026") as HTMLButtonElement).disabled).toBe(true);
    expect((cell("10 de abril de 2026") as HTMLButtonElement).disabled).toBe(false);
    expect((cell("20 de abril de 2026") as HTMLButtonElement).disabled).toBe(false);
    expect((screen.getByRole("button", { name: "Mes anterior" }) as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByRole("button", { name: "Mes siguiente" }) as HTMLButtonElement).disabled).toBe(true);
  });

  it("las flechas no salen del rango", () => {
    const { trigger, onChange } = setup({ value: "2026-04-10", min: "2026-04-10", max: "2026-04-20" });
    fireEvent.click(trigger);
    fireEvent.keyDown(document.activeElement!, { key: "ArrowLeft" });
    expect(document.activeElement?.getAttribute("aria-label")).toBe("10 de abril de 2026");
    fireEvent.keyDown(document.activeElement!, { key: "PageDown" });
    expect(document.activeElement?.getAttribute("aria-label")).toBe("20 de abril de 2026");
    fireEvent.keyDown(document.activeElement!, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith("2026-04-20");
  });

  it("un clic fuera cierra el calendario sin cambiar nada", () => {
    const { trigger, onChange } = setup();
    fireEvent.click(trigger);
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("el disparador vuelve a cerrar el calendario", () => {
    const { trigger } = setup();
    fireEvent.click(trigger);
    fireEvent.click(trigger);
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("el texto corto del disparador y el largo de la celda usan los mismos nombres", () => {
    expect(formatShort({ year: 2026, month: 4, day: 12 })).toBe("12 abr 2026");
    expect(formatLong({ year: 2026, month: 4, day: 12 })).toBe("12 de abril de 2026");
  });
});
