/**
 * Placas de ejercicio (§ lector-05). El criterio es el del baseline
 * (`wrapExercises`, core.js:936-985) y los casos son los del wiki de Proba:
 * `distribucion-normal` (4 placas con «Planteo»), `tecnica-derivadas-parciales`
 * (1, con el enunciado en cursiva) y las secciones «Ejercicios resueltos», que
 * NO son una placa sino el título de la sección.
 */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { Markdown } from "./Markdown";

afterEach(cleanup);

function html(body: string): HTMLElement {
  const view = render(<Markdown body={body} subject="proba" exists={() => true} />);
  return view.container;
}

const plates = (root: HTMLElement) => root.querySelectorAll<HTMLElement>("section.exercise-plate");

describe("rehypeExercisePlates", () => {
  it("un encabezado en singular abre la placa y se lleva su cuerpo", () => {
    const root = html("## Ejercicio A — consumo de combustible\n\nSe mide el consumo.\n");
    expect(plates(root)).toHaveLength(1);
    const plate = plates(root)[0] as HTMLElement;
    expect(plate.querySelector("h2")?.textContent).toBe("Ejercicio A — consumo de combustible");
    expect(plate.textContent).toContain("Se mide el consumo.");
  });

  it("el plural es el título de la sección: abren placa sus subtítulos", () => {
    const root = html(
      "## Ejercicios resueltos\n\n### Ejercicio 1\n\nUno.\n\n### Ejercicio 2\n\nDos.\n",
    );
    expect(plates(root)).toHaveLength(2);
    /* El h2 de la sección queda FUERA de toda placa: si entrara, se tragaría la
       sección entera y los ejercicios quedarían sueltos dentro de una resolución. */
    const seccion = root.querySelector("h2");
    expect(seccion?.closest("section.exercise-plate")).toBeNull();
  });

  it("una placa nunca envuelve a otra", () => {
    const root = html("### Ejercicio 1\n\nUno.\n\n### Ejercicio 2\n\nDos.\n");
    expect(plates(root)).toHaveLength(2);
    expect((plates(root)[0] as HTMLElement).textContent).not.toContain("Ejercicio 2");
  });

  it("un encabezado de nivel igual o menor corta la placa", () => {
    const root = html("### Ejercicio 1\n\nUno.\n\n## Otra sección\n\nTexto.\n");
    const plate = plates(root)[0] as HTMLElement;
    expect(plate.textContent).not.toContain("Otra sección");
    expect(root.querySelector("h2")?.closest("section.exercise-plate")).toBeNull();
  });

  it("el rótulo de resolución separa el enunciado del desarrollo", () => {
    const root = html(
      "### Ejercicio 3\n\nUn lote trae 40 piezas.\n\nPlanteo. Se define X como el número de piezas fallidas.\n",
    );
    const solucion = (plates(root)[0] as HTMLElement).querySelector(".solucion");
    expect(solucion).not.toBeNull();
    expect(solucion?.textContent).toContain("Planteo.");
    expect(solucion?.textContent).not.toContain("Un lote trae 40 piezas.");
  });

  it("sin rótulo, la resolución empieza tras el enunciado en cursiva", () => {
    const root = html(
      "### Ejercicio 4\n\n*Calcule la derivada parcial respecto de x.*\n\nSe deriva tratando y como constante.\n",
    );
    const solucion = (plates(root)[0] as HTMLElement).querySelector(".solucion");
    expect(solucion?.textContent?.trim()).toBe("Se deriva tratando y como constante.");
  });

  it("la tabla que acompaña al enunciado todavía es enunciado", () => {
    const root = html(
      "### Ejercicio 5\n\nEnunciado. Los datos son estos.\n\n| x | y |\n| - | - |\n| 1 | 2 |\n\nSe promedia la columna.\n",
    );
    const plate = plates(root)[0] as HTMLElement;
    expect(plate.querySelector("table")?.closest(".solucion")).toBeNull();
    expect(plate.querySelector(".solucion")?.textContent?.trim()).toBe("Se promedia la columna.");
  });

  it("sin enunciado ni rótulo no hay corte: la placa va entera", () => {
    const root = html("### Ejercicio 6\n\nSe calcula la esperanza y se termina.\n");
    expect(plates(root)).toHaveLength(1);
    expect((plates(root)[0] as HTMLElement).querySelector(".solucion")).toBeNull();
  });

  it("un encabezado de ejercicio sin cuerpo no arma una placa vacía", () => {
    const root = html("## Ejercicio resuelto\n\n### Ejercicio A\n\nCuerpo.\n");
    expect(plates(root)).toHaveLength(1);
    expect(root.querySelector("h2")?.closest("section.exercise-plate")).toBeNull();
  });

  it("una página sin ejercicios no cambia", () => {
    const root = html("## Esperanza\n\nLa esperanza es el promedio ponderado.\n");
    expect(plates(root)).toHaveLength(0);
    expect(root.querySelector("h2")?.textContent).toBe("Esperanza");
  });

  it("el encabezado de la placa conserva su ancla", () => {
    /* El `id` lo pone `rehypeHeadingIds` con el criterio del contrato: envolver
       el encabezado no puede moverlo, o `[[pagina#ancla]]` deja de apuntar. */
    const root = html("### Ejercicio A — consumo\n\nCuerpo.\n");
    expect(root.querySelector("h3")?.id).toBe("ejercicio-a-consumo");
  });
});

describe("exercisePlates: false (N0-64)", () => {
  const EJ = "### Ejercicio 1\n\nAnalizar por qué no es seguro.\n\n> [!nota]- Resolución del Ejercicio 1\n> Porque el adversario gana con una consulta.";

  it("sin placas, «Ejercicio N» es un encabezado más", () => {
    const view = render(
      <Markdown body={EJ} subject="cripto" exists={() => true} exercisePlates={false} />,
    );
    expect(view.container.querySelector(".exercise-plate")).toBeNull();
    expect(view.container.querySelector("h3")?.textContent).toBe("Ejercicio 1");
    /* El aviso plegado sigue siendo la única caja de la página. */
    expect(view.container.querySelectorAll("details.callout")).toHaveLength(1);
  });

  it("con placas —el default— se arma la caja, como en Proba", () => {
    const view = render(<Markdown body={EJ} subject="proba" exists={() => true} />);
    expect(view.container.querySelector(".exercise-plate")).not.toBeNull();
  });
});

