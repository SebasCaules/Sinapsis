/**
 * Diagramas Mermaid (N0-63).
 *
 * Lo que importa acá no es el dibujo —eso lo hace Mermaid— sino las tres reglas
 * de la propuesta: se carga sola en las páginas que la usan, un diagrama roto
 * cae al bloque de código, y lo que entra al DOM pasa por el saneado.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, waitFor } from "@testing-library/react";

/** Cuántas veces se importó la librería: el import dinámico pasa por acá. */
let imports = 0;
let shouldFail = false;

vi.mock("mermaid", () => ({
  default: {
    initialize: vi.fn(),
    /* `run` dibuja EN el elemento, como el de verdad: si el diagrama no compila
       lo deja sin SVG, que es lo que el componente mira para saber si salió. */
    run: vi.fn(async ({ nodes }: { nodes: HTMLElement[] }) => {
      imports += 1;
      for (const node of nodes) {
        const chart = node.textContent ?? "";
        if (shouldFail || chart.includes("ROTO")) continue;
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.textContent = chart.slice(0, 10);
        svg.append(text);
        node.replaceChildren(svg);
      }
    }),
  },
}));

const { Markdown } = await import("./Markdown");

beforeEach(() => {
  imports = 0;
  shouldFail = false;
});
afterEach(cleanup);

function html(body: string): HTMLElement {
  return render(<Markdown body={body} subject="cripto" exists={() => true} />).container;
}

const DIAGRAMA = "```mermaid\ngraph TD\n  A[Cliente] --> B[Servidor]\n```";

describe("Mermaid", () => {
  it("dibuja un bloque mermaid válido", async () => {
    const root = html(DIAGRAMA);
    await waitFor(() => expect(root.querySelector('[data-mermaid="dibujado"]')).not.toBeNull());
    expect(root.querySelector('[data-mermaid="dibujado"] svg')).not.toBeNull();
    /* Mientras dibuja se ve el código; una vez dibujado, ya no. */
    expect(root.querySelector('pre[data-mermaid]')).toBeNull();
  });

  it("un diagrama que no compila cae al bloque de código, no a un hueco", async () => {
    const root = html("```mermaid\nROTO no es un diagrama\n```");
    await waitFor(() => expect(root.querySelector('[data-mermaid="sin-dibujar"]')).not.toBeNull());
    expect(root.querySelector("pre code")?.textContent).toContain("ROTO no es un diagrama");
    expect(root.querySelector("svg")).toBeNull();
  });

  it("una página sin mermaid no toca la librería", async () => {
    const root = html("```js\nconst a = 1;\n```\n\nTexto con `código` en línea.");
    await new Promise((r) => setTimeout(r, 20));
    expect(imports).toBe(0);
    /* Y el bloque de código sigue siendo un bloque de código. */
    expect(root.querySelector("pre code")?.textContent).toContain("const a = 1;");
    expect(root.querySelector("[data-mermaid]")).toBeNull();
  });

  it("un bloque mermaid vacío no es un diagrama", async () => {
    const root = html("```mermaid\n\n```");
    await new Promise((r) => setTimeout(r, 20));
    expect(imports).toBe(0);
    expect(root.querySelector("[data-mermaid]")).toBeNull();
  });

  it("el SVG entra saneado: sin script ni manejadores de evento", async () => {
    const root = html(DIAGRAMA);
    await waitFor(() => expect(root.querySelector('[data-mermaid="dibujado"] svg')).not.toBeNull());
    const host = root.querySelector("[data-mermaid=\"dibujado\"]");
    expect(host?.querySelector("script")).toBeNull();
    expect(host?.innerHTML).not.toContain("onload");
  });
});
