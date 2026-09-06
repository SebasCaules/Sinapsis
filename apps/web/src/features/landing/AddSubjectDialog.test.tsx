/**
 * «Agregar materia» con el catálogo del sitio (Sprint 4 · §2.2): primero la
 * lista de materias compiladas que el usuario quitó de su landing, y detrás el
 * formulario de siempre para las materias que inventa a mano.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { CreateSubjectInput, SubjectCard } from "@sinapsis/contract";
import { AddSubjectDialog } from "./AddSubjectDialog";

const proba: SubjectCard = {
  slug: "proba",
  name: "Probabilidad y Estadística",
  code: "93.24",
  institution: "ITBA",
  color: "--u9",
  division: { singular: "Unidad", abbr: "U", plural: "Unidades" },
  divisionsCount: 12,
  pagesCount: 200,
  studiedCount: 0,
  dueCount: 0,
  semester: "2026-1C",
  position: 0,
  placeholder: false,
  lastSyncAt: "2026-09-05T10:00:00.000Z",
};

function renderDialog(available: SubjectCard[], onSubmit = vi.fn(async (_i: CreateSubjectInput) => undefined)) {
  render(
    <AddSubjectDialog
      open
      onClose={() => undefined}
      available={available}
      semesters={["2026-2C", "2026-1C"]}
      defaultSemester="2026-2C"
      onSubmit={onSubmit}
    />,
  );
  return onSubmit;
}

afterEach(cleanup);

describe("<AddSubjectDialog/> con materias del catálogo", () => {
  it("ofrece la lista y la primera viene elegida", () => {
    renderDialog([proba]);
    expect(screen.getByRole("radiogroup", { name: "Materias del catálogo" })).toBeTruthy();
    expect(screen.getByRole("radio", { name: /Probabilidad y Estadística/ }).getAttribute("aria-checked")).toBe("true");
  });

  it("con una materia del catálogo elegida no pide nombre ni dirección", () => {
    renderDialog([proba]);
    expect(screen.queryByLabelText("Nombre")).toBeNull();
    expect(screen.queryByLabelText(/Dirección/)).toBeNull();
    /* El cuatrimestre sí: es lo único que decide el usuario. */
    expect(screen.getByLabelText("Cuatrimestre")).toBeTruthy();
  });

  it("agregarla manda los datos del catálogo con el cuatrimestre elegido", () => {
    const onSubmit = renderDialog([proba]);
    fireEvent.click(screen.getByRole("button", { name: "Agregar materia" }));
    expect(onSubmit).toHaveBeenCalledWith({
      slug: "proba",
      name: "Probabilidad y Estadística",
      code: "93.24",
      institution: "ITBA",
      semester: "2026-2C",
      color: "--u9",
      division: { singular: "Unidad", abbr: "U", plural: "Unidades" },
    });
  });

  it("«Materia nueva» devuelve el formulario completo", () => {
    renderDialog([proba]);
    fireEvent.click(screen.getByRole("radio", { name: /Materia nueva/ }));
    expect(screen.getByLabelText("Nombre")).toBeTruthy();
    expect(screen.getByLabelText(/Dirección/)).toBeTruthy();
    expect(screen.getByRole("radiogroup", { name: "Color de la materia" })).toBeTruthy();
  });
});

describe("<AddSubjectDialog/> sin catálogo", () => {
  it("abre directo en el formulario", () => {
    renderDialog([]);
    expect(screen.queryByRole("radiogroup", { name: "Materias del catálogo" })).toBeNull();
    expect(screen.getByLabelText("Nombre")).toBeTruthy();
  });

  it("crea la materia con lo que se escribió", () => {
    const onSubmit = renderDialog([]);
    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Análisis Matemático" } });
    fireEvent.change(screen.getByLabelText("Código"), { target: { value: "93.58" } });
    fireEvent.change(screen.getByLabelText("Institución"), { target: { value: "ITBA" } });
    fireEvent.click(screen.getByRole("button", { name: "Agregar materia" }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ slug: "analisis-matematico", name: "Análisis Matemático", semester: "2026-2C" }),
    );
  });
});
