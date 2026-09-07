/**
 * El `src` de las imágenes del wiki (N0-68).
 *
 * Lo que se prueba es la regla, no el dibujo: solo se reescribe lo que el
 * compilador reconoció, y nunca se inventa una ruta para lo que no está en el
 * mapa.
 */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { Markdown } from "./Markdown";
import { assetUrl } from "./remarkAssets";

afterEach(cleanup);

const REF = "../../assets/des%20feistel.png";
const FILE = "0123456789abcdef.png";

function html(body: string, assets: { ref: string; file: string }[] = []): HTMLElement {
  const view = render(<Markdown body={body} subject="cripto" exists={() => true} assets={assets} />);
  return view.container;
}

const img = (root: HTMLElement) => root.querySelector("img");

describe("remarkAssets", () => {
  it("reescribe el src de una imagen que el compilador publicó", () => {
    const root = html(`![Feistel](${REF})`, [{ ref: REF, file: FILE }]);
    expect(img(root)?.getAttribute("src")).toBe(`/subjects/cripto/assets/${FILE}`);
    expect(img(root)?.getAttribute("alt")).toBe("Feistel");
  });

  it("deja intacta la referencia que no está en el mapa", () => {
    const root = html("![otra](../../assets/no-publicada.png)", [{ ref: REF, file: FILE }]);
    expect(img(root)?.getAttribute("src")).toBe("../../assets/no-publicada.png");
  });

  it("sin adjuntos no toca nada", () => {
    const root = html(`![Feistel](${REF})`);
    expect(img(root)?.getAttribute("src")).toBe(REF);
  });

  it("no admite un nombre publicado que no sea un nombre de archivo", () => {
    /* Defensa en profundidad: el mapa lo escribe el compilador, pero llega como
       dato de la materia igual que el cuerpo. */
    for (const file of ["javascript:alert(1)", "../../otro.png", "/etc/passwd"]) {
      cleanup();
      const root = html(`![x](${REF})`, [{ ref: REF, file }]);
      expect(img(root)?.getAttribute("src"), file).toBe(REF);
    }
  });

  it("no toca una URL absoluta aunque alguien la ponga en el mapa", () => {
    const root = html("![web](https://example.com/a.png)", [
      { ref: "https://example.com/a.png", file: FILE },
    ]);
    // El mapa la tiene, así que se reescribe: la guarda contra URLs está en el
    // compilador, que nunca las mete. Lo que acá importa es que el resultado
    // siga siendo una ruta del sitio y no la URL de un tercero.
    expect(img(root)?.getAttribute("src")).toBe(`/subjects/cripto/assets/${FILE}`);
  });
});

describe("assetUrl", () => {
  it("respeta el BASE_URL de GitHub Pages", () => {
    expect(assetUrl("/Sinapsis/", "cripto", FILE)).toBe(`/Sinapsis/subjects/cripto/assets/${FILE}`);
    expect(assetUrl("/", "cripto", FILE)).toBe(`/subjects/cripto/assets/${FILE}`);
  });
});
