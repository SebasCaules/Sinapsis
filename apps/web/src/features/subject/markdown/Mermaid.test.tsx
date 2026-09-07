/**
 * Diagramas Mermaid (N0-69) — con la librería mockeada.
 *
 * Acá se comprueba lo que el mock puede comprobar sin mentir: que la librería
 * **no se toca** en una página sin diagramas (el import dinámico pasa por el
 * mock, así que se cuenta), y que el componente cae al bloque de código en
 * las tres formas en que Mermaid puede fallar —el cartel de error, el hueco
 * vacío y la promesa rechazada—. El dibujo de verdad, contra `mermaid@11` sin
 * mockear, está en `Mermaid.real.test.tsx`.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, waitFor } from "@testing-library/react";

/** Cuántas veces se importó la librería: el import dinámico pasa por acá. */
let imports = 0;
/** Cómo falla `run` en este test. */
let fallo: "ninguno" | "cartel" | "vacio" | "rechazo" = "ninguno";

/**
 * El SVG que Mermaid deja en el hueco cuando un diagrama no parsea y no está
 * `suppressErrorRendering`: no lanza, dibuja SU cartel. Reproducirlo es lo que
 * hace que este test sirva de red contra la regresión.
 */
function cartelDeError(): SVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("aria-roledescription", "error");
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.textContent = "Syntax error in text";
  g.append(text);
  svg.append(g);
  return svg;
}

vi.mock("mermaid", () => ({
  default: {
    initialize: vi.fn(),
    /* `run` dibuja EN el elemento, como el de verdad. */
    run: vi.fn(async ({ nodes }: { nodes: HTMLElement[] }) => {
      imports += 1;
      if (fallo === "rechazo") throw new Error("mermaid no pudo dibujar");
      for (const node of nodes) {
        const chart = node.textContent ?? "";
        if (fallo !== "ninguno" || chart.includes("ROTO")) {
          node.replaceChildren(...(fallo === "vacio" ? [] : [cartelDeError()]));
          continue;
        }
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("aria-roledescription", "flowchart-v2");
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
  fallo = "ninguno";
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

  it("el cartel de error de Mermaid NO cuenta como diagrama: cae al bloque de código", async () => {
    const root = html("```mermaid\nROTO no es un diagrama\n```");
    await waitFor(() => expect(root.querySelector('[data-mermaid="sin-dibujar"]')).not.toBeNull());
    expect(root.querySelector("pre code")?.textContent).toContain("ROTO no es un diagrama");
    expect(root.querySelector("svg")).toBeNull();
    expect(root.innerHTML).not.toContain("Syntax error");
  });

  it("un hueco vacío también cae al bloque de código", async () => {
    fallo = "vacio";
    const root = html(DIAGRAMA);
    await waitFor(() => expect(root.querySelector('[data-mermaid="sin-dibujar"]')).not.toBeNull());
    expect(root.querySelector("pre code")?.textContent).toContain("graph TD");
    expect(root.querySelector("svg")).toBeNull();
  });

  it("una promesa rechazada también cae al bloque de código", async () => {
    fallo = "rechazo";
    const root = html(DIAGRAMA);
    await waitFor(() => expect(root.querySelector('[data-mermaid="sin-dibujar"]')).not.toBeNull());
    expect(root.querySelector("pre code")?.textContent).toContain("graph TD");
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
