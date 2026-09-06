/**
 * El callout `figura` es un CONTRATO con el runtime (N0-42): `App.mountFigures`
 * busca `[data-fig]` y dibuja dentro de su `.fig-host`. Si este marcado cambia,
 * las figuras de todas las materias dejan de montarse en silencio, así que se
 * prueba tal cual sale del pipeline del lector.
 *
 * Los avisos normales van en el mismo archivo: son el otro lado del plugin.
 */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { Markdown } from "./Markdown";

afterEach(cleanup);

function html(body: string): HTMLElement {
  const view = render(<Markdown body={body} subject="proba" exists={() => true} />);
  return view.container;
}

describe("callout `figura`", () => {
  it("emite el marcado que monta el runtime", () => {
    const root = html("> [!figura] normal-densidad\n> La campana de Gauss.");
    const figure = root.querySelector("figure");
    expect(figure).not.toBeNull();
    /* `data-fig` es lo que busca `mountFigures`; `doc-figure` es la clase del
       baseline y `figura` la de esta hoja de estilos. */
    expect(figure?.getAttribute("data-fig")).toBe("normal-densidad");
    expect(figure?.classList.contains("figura")).toBe(true);
    expect(figure?.classList.contains("doc-figure")).toBe(true);
    expect(figure?.querySelector(".fig-host")).not.toBeNull();
    expect(figure?.querySelector("figcaption")?.textContent).toContain("La campana de Gauss.");
  });

  it("sin bundle de figuras deja el marco de reserva dentro del hueco", () => {
    const root = html("> [!figura] normal-densidad\n> Epígrafe.");
    const host = root.querySelector<HTMLElement>(".fig-host");
    /* El marco vive DENTRO del hueco: `mountFigures` lo vacía al dibujar. */
    expect(host?.textContent).toBe("Figura interactiva");
    expect(root.querySelector(".figFrame")).not.toBeNull();
  });

  it("el rótulo es «Figura» a secas: el id no es texto para el lector", () => {
    /* §4-D: `labelFor` mostraba «Figura · <id>» y el id es el nombre interno del
       bundle (`U0-FUBINI-ORDEN-DE-INTEGRACION`), que el baseline nunca dibuja.
       El id sigue estando donde importa: en `data-fig`. */
    const root = html("> [!figura] normal-densidad\n> Epígrafe.");
    expect(root.querySelector(".figLabel")?.textContent).toBe("Figura");
    expect(root.querySelector("figcaption")?.textContent).not.toContain("normal-densidad");
    expect(root.querySelector("figure")?.getAttribute("data-fig")).toBe("normal-densidad");
    expect(root.textContent).not.toContain("Sprint");
  });

  it("lo que sigue al id es epígrafe, no parte del id", () => {
    const root = html("> [!figura] normal-densidad Densidad de la normal\n> Detalle.");
    expect(root.querySelector("figure")?.getAttribute("data-fig")).toBe("normal-densidad");
    expect(root.querySelector(".calloutTitle")?.textContent).toBe("Densidad de la normal");
  });

  it("los avisos normales siguen siendo un `aside` con su rótulo", () => {
    const root = html("> [!warn] Ojo\n> Cuidado con la varianza.");
    const aside = root.querySelector("aside.callout");
    expect(aside?.getAttribute("data-type")).toBe("warn");
    expect(aside?.querySelector(".calloutLabel")?.textContent).toBe("Atención");
    expect(aside?.querySelector(".calloutTitle")?.textContent).toBe("Ojo");
    expect(root.querySelector("figure")).toBeNull();
  });
});
