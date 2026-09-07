/**
 * Diagramas Mermaid (N0-nn) — contra la librería DE VERDAD, sin mock.
 *
 * El otro archivo (`Mermaid.test.tsx`) mockea `mermaid` para contar el import
 * dinámico. Ese mock no sirve para la promesa central de la propuesta —«si el
 * diagrama no compila se muestra el bloque de código, nunca el cartel de error
 * de Mermaid»— porque el fallo de la librería real no se parece al del mock:
 * Mermaid no lanza, **dibuja** su propio cartel de error como un SVG más. Acá
 * se importa `mermaid@11` tal cual y se comprueba el comportamiento real.
 *
 * ## Por qué hace falta un `getBBox`
 *
 * jsdom implementa el DOM pero no el layout: `SVGElement.prototype.getBBox`
 * —con el que Mermaid mide cada etiqueta antes de acomodar el diagrama— no
 * existe y `mermaid.render` muere con «childNodeEl.node(...)?.getBBox is not a
 * function». Se le da una medida aproximada (ancho proporcional al texto) y la
 * librería real corre entera: parsea, arma el SVG y lo monta. Lo único falso es
 * cuánto mide cada caja, que no es lo que estos tests miran.
 */
import { beforeAll, afterEach, describe, expect, it } from "vitest";
import { cleanup, render, waitFor } from "@testing-library/react";
import { Markdown } from "./Markdown";

/**
 * `waitFor` espera 1 s por defecto y eso no alcanza: la primera prueba de este
 * archivo paga el import de una librería de 659 kB, y con la suite entera en
 * paralelo el dibujo llega tarde. El límite de cada `it` no cubre al de
 * `waitFor`, así que se le da margen propio.
 */
const ESPERA = { timeout: 20000, interval: 25 } as const;

beforeAll(() => {
  /* Medida aproximada, suficiente para que Mermaid acomode el diagrama. */
  Object.defineProperty(SVGElement.prototype, "getBBox", {
    configurable: true,
    writable: true,
    value(this: SVGElement) {
      const text = this.textContent ?? "";
      return { x: 0, y: 0, width: Math.max(text.length * 7, 10), height: 18 };
    },
  });
});

afterEach(cleanup);

function html(body: string): HTMLElement {
  return render(<Markdown body={body} subject="cripto" exists={() => true} />).container;
}

const VALIDO = "```mermaid\nflowchart TD\n  A[Cliente] --> B[Servidor]\n```";
/* El mismo diagrama sin el destino de la flecha: no parsea. */
const ROTO = "```mermaid\nflowchart TD\n  A --> \n```";

describe("Mermaid con la librería real", () => {
  it("un diagrama válido se dibuja como SVG", async () => {
    const root = html(VALIDO);
    await waitFor(() => expect(root.querySelector('[data-mermaid="dibujado"] svg')).not.toBeNull(), ESPERA);
    const svg = root.querySelector('[data-mermaid="dibujado"] svg');
    expect(svg?.getAttribute("aria-roledescription")).toBe("flowchart-v2");
    /* Dibujado el diagrama, el bloque de código no se muestra. */
    expect(root.querySelector("pre[data-mermaid]")).toBeNull();
  }, 30000);

  it("un diagrama que no compila deja el bloque de código y NO el cartel de error", async () => {
    const root = html(ROTO);
    await waitFor(() => expect(root.querySelector('pre[data-mermaid="sin-dibujar"]')).not.toBeNull(), ESPERA);
    /* El texto que escribió el autor, tal cual. */
    expect(root.querySelector('pre[data-mermaid="sin-dibujar"] code')?.textContent).toContain("flowchart TD");
    /* Ni un solo SVG: ni el del diagrama ni el cartel de Mermaid. */
    expect(root.querySelector("svg")).toBeNull();
    expect(root.innerHTML).not.toContain("Syntax error");
    /* Y tampoco se coló en otra parte del documento. */
    expect(document.body.innerHTML).not.toContain("Syntax error");
  }, 30000);

  it("el SVG del diagrama entra sin script ni manejadores de evento", async () => {
    const root = html(VALIDO);
    await waitFor(() => expect(root.querySelector('[data-mermaid="dibujado"] svg')).not.toBeNull(), ESPERA);
    const host = root.querySelector('[data-mermaid="dibujado"]');
    expect(host?.querySelector("script")).toBeNull();
    expect(host?.innerHTML).not.toContain("javascript:");
    expect(/\son[a-z]+=/.test(host?.innerHTML ?? "")).toBe(false);
  }, 30000);

  it("los `<br/>` de una etiqueta parten la línea", async () => {
    const root = html("```mermaid\ngraph TD\n  A[Criptografía<br/>qué es y para qué] --> B[Criptosistema]\n```");
    await waitFor(() => expect(root.querySelector('[data-mermaid="dibujado"] svg')).not.toBeNull(), ESPERA);
    expect(root.querySelector('[data-mermaid="dibujado"]')?.innerHTML).toContain("<br>");
  }, 30000);
});
