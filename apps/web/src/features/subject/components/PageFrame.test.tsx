/**
 * `PageFrame` — el marco de página de la plataforma (N0-64), probado SIN el
 * lector: lo que se comprueba acá es que el marco sirve igual a cualquier vista
 * que le pase pasos, un paso actual y sus vecinos. El lector tiene sus propias
 * pruebas (`views/ReaderView.strip.test.tsx`), que son las que garantizan que el
 * DOM de la barra no cambió.
 *
 * Los dos casos que importan son los dos usos que hay: la página abierta es una
 * PÁGINA del wiki (el lector) o un GRUPO de ejercicios (una vista de herramienta
 * con `frame: "page"`).
 */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SubjectConfig, type PageMeta, type SubjectDetail } from "@sinapsis/contract";
import rawProbaConfig from "../../../../../../subjects/proba/sinapsis.config.json";
import { buildSubjectModel, type ExtraStep, type SubjectModel } from "../model";
import { PageFrame, type ReadStep } from "./PageFrame";
import { EXERCISES_TYPE } from "./TypeTag";

const config = SubjectConfig.parse(rawProbaConfig);

function meta(slug: string, title: string, order: number): PageMeta {
  return {
    slug,
    title,
    type: "concepto",
    folder: "conceptos",
    division: "1",
    order,
    summary: "",
    tags: [],
    sources: [],
    words: 120,
  };
}

const pages = [meta("u1-a", "Medidas de posición", 1), meta("u1-b", "Medidas de dispersión", 2)];
const detail: SubjectDetail = { config, pages, studied: ["u1-a"], placeholder: false, lastSyncAt: null };

const PASOS: Record<string, ExtraStep[]> = {
  "1": [
    { id: "g1", label: "Ej. 1", done: true, group: "Guía", to: "/m/proba/t/ejercicios?arg=1%2Fguia", source: "ejercicios" },
    { id: "g2", label: "Ej. 2", done: false, group: "Guía", to: "/m/proba/t/ejercicios?arg=1%2Fguia", source: "ejercicios" },
    { id: "l1", label: "Prop. 1", done: false, group: "Lutzio", to: "/m/proba/t/ejercicios?arg=1%2Flutzio", source: "ejercicios" },
  ],
};

const build = (): SubjectModel =>
  buildSubjectModel(detail, false, { extraSteps: (d) => PASOS[d] ?? [] });

function mount(node: React.ReactNode) {
  return render(<MemoryRouter>{node}</MemoryRouter>);
}

afterEach(cleanup);

describe("PageFrame", () => {
  it("con una página abierta: identidad, barra y el marco alrededor del contenido", () => {
    const model = build();
    const steps = model.unitSteps("1");
    mount(
      <PageFrame
        model={model}
        subject="proba"
        division={model.division("1")}
        type="concepto"
        position="página 1 de 2 · +3 ejercicios"
        title="Medidas de posición"
        steps={steps}
        current={{ kind: "page", slug: "u1-a" }}
        prev={null}
        next={{ page: pages[1] as PageMeta, division: null }}
        actions={<button type="button">Marcar estudiado</button>}
        footer={<span>al pie</span>}
        aside={<div data-testid="columna" />}
      >
        <p>la prosa</p>
      </PageFrame>,
    );

    /* Identidad: chip de la división, etiqueta de tipo y posición. */
    expect(screen.getByRole("link", { name: /U1 ·/ })).toBeTruthy();
    expect(screen.getByText("Concepto").dataset["type"]).toBe("concepto");
    expect(screen.getByText("página 1 de 2 · +3 ejercicios")).toBeTruthy();
    expect(screen.getByRole("heading", { level: 1, name: "Medidas de posición" })).toBeTruthy();

    /* Barra: dos páginas y dos grupos, en ese orden. */
    const seg = screen.getByRole("link", { name: "1 de 2. Medidas de posición" });
    expect(seg.dataset["seg"]).toBe("1");
    expect(seg.dataset["state"]).toBe("current");
    expect(screen.getByRole("link", { name: "Ejercicios · Guía · 1 de 2 resueltos" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Ejercicios · Lutzio · 0 de 1 resuelto" })).toBeTruthy();

    /* Las ranuras: acciones, contenido, pie y columna. */
    expect(screen.getByRole("button", { name: "Marcar estudiado" })).toBeTruthy();
    expect(screen.getByText("la prosa")).toBeTruthy();
    expect(screen.getByText("al pie")).toBeTruthy();
    expect(screen.getByTestId("columna")).toBeTruthy();

    /* Y las dos asas de ancho, que son del marco. */
    expect(screen.getAllByRole("separator", { name: "Ancho de la hoja" })).toHaveLength(2);
  });

  it("con un grupo de ejercicios abierto: el segmento del grupo queda marcado", () => {
    const model = build();
    const steps = model.unitSteps("1");
    mount(
      <PageFrame
        model={model}
        subject="proba"
        division={model.division("1")}
        type={EXERCISES_TYPE}
        position="ejercicios 1 de 2 · 2 ejercicios"
        steps={steps}
        current={{ kind: "extra", id: "Guía" }}
        prev={{ page: pages[1] as PageMeta, division: null }}
        next={steps[steps.length - 1] as ReadStep}
      >
        <div data-testid="bundle" />
      </PageFrame>,
    );

    /* La etiqueta es la de ejercicios y la posición cuenta grupos. */
    expect(screen.getByText("Ejercicios").dataset["type"]).toBe("ejercicios");
    expect(screen.getByText("ejercicios 1 de 2 · 2 ejercicios")).toBeTruthy();

    const seg = screen.getByRole("link", { name: "Ejercicios · Guía · 1 de 2 resueltos" });
    expect(seg.dataset["current"]).toBe("true");
    expect(seg.getAttribute("aria-current")).toBe("page");
    expect(seg.getAttribute("href")).toBe("/m/proba/t/ejercicios?arg=1%2Fguia");
    /* El otro grupo no. */
    expect(
      screen.getByRole("link", { name: "Ejercicios · Lutzio · 0 de 1 resuelto" }).dataset["current"],
    ).toBeUndefined();

    /* Ninguna página queda marcada como actual: la página abierta no es una. */
    expect(screen.getByRole("link", { name: "2 de 2. Medidas de dispersión" }).dataset["state"]).toBe("todo");

    /* Vecinos: atrás la última página de la unidad, adelante el grupo
       siguiente. Se mira el PIE, que es donde se leen los dos con su título (el
       par de arriba dice lo mismo pero va a secas). */
    const pie = within(screen.getByRole("navigation", { name: "Páginas vecinas" }));
    expect(pie.getByRole("link", { name: /← Anterior/ }).getAttribute("href")).toBe("/m/proba/p/u1-b");
    expect(pie.getByRole("link", { name: /Siguiente: ejercicios →/ }).getAttribute("href")).toBe(
      "/m/proba/t/ejercicios?arg=1%2Flutzio",
    );
    /* Y arriba, flanqueando la barra, el rótulo nombra el grupo. */
    expect(screen.getByRole("link", { name: /^Lutzio →/ }).getAttribute("href")).toBe(
      "/m/proba/t/ejercicios?arg=1%2Flutzio",
    );
    expect(screen.getByTestId("bundle")).toBeTruthy();
    /* Sin `title`, el marco no inventa un encabezado: lo pone el contenido. */
    expect(screen.queryByRole("heading", { level: 1 })).toBeNull();
  });

  it("sin recorrido no dibuja la barra: una unidad de una sola página", () => {
    const model = buildSubjectModel(
      {
        config,
        pages: [meta("solo", "Única", 1)],
        studied: [],
        placeholder: false,
        lastSyncAt: null,
      },
      false,
    );
    mount(
      <PageFrame
        model={model}
        subject="proba"
        division={model.division("1")}
        type="concepto"
        steps={model.unitSteps("1")}
        current={{ kind: "page", slug: "solo" }}
      >
        <p>sola</p>
      </PageFrame>,
    );
    expect(screen.queryByRole("navigation", { name: /^Páginas de la/ })).toBeNull();
    /* Y sin vecinos tampoco hay pie de navegación. */
    expect(screen.queryByRole("navigation", { name: "Páginas vecinas" })).toBeNull();
  });
});
