/**
 * Un ancla que cae dentro de un aviso plegado tiene que abrirlo (N0-62): con el
 * `<details>` cerrado el destino no tiene medida y el salto queda en la nada.
 */
import { describe, expect, it } from "vitest";
import { openFoldedAncestors } from "./folded";

function dom(html: string): HTMLElement {
  const host = document.createElement("div");
  host.innerHTML = html;
  return host;
}

describe("openFoldedAncestors", () => {
  it("abre el pliegue que contiene al destino", () => {
    const host = dom('<details class="callout"><summary>Cita</summary><h3 id="x">Sección</h3></details>');
    const details = host.querySelector("details");
    expect(details?.open).toBe(false);
    openFoldedAncestors(host.querySelector("#x"));
    expect(details?.open).toBe(true);
  });

  it("abre todos los pliegues anidados, no solo el más cercano", () => {
    const host = dom(
      '<details id="fuera"><summary>a</summary><details id="dentro"><summary>b</summary><p id="x">t</p></details></details>',
    );
    openFoldedAncestors(host.querySelector("#x"));
    expect(host.querySelector<HTMLDetailsElement>("#fuera")?.open).toBe(true);
    expect(host.querySelector<HTMLDetailsElement>("#dentro")?.open).toBe(true);
  });

  it("no toca nada si el destino no está plegado, ni se cae con null", () => {
    const host = dom('<p id="x">t</p><details id="otro"><summary>a</summary></details>');
    openFoldedAncestors(host.querySelector("#x"));
    expect(host.querySelector<HTMLDetailsElement>("#otro")?.open).toBe(false);
    expect(() => openFoldedAncestors(null)).not.toThrow();
  });
});
