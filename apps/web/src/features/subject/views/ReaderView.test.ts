/**
 * §4-G — el índice «En esta página» mostraba el marcado crudo del encabezado.
 *
 * `Page.headings[].text` es y sigue siendo el texto CRUDO: de él sale `headingId`
 * y es lo que el autor del wiki escribe en `[[pagina#ancla]]` (N0-22). Así que la
 * corrección es de presentación y vive acá: `tocLabel` se queda con la etiqueta
 * del wikilink y `MathText` compone la matemática en línea.
 *
 * Los casos son los encabezados REALES del wiki de Proba (86 entradas crudas en
 * 34 páginas, 18 de ellas en `formulario-maestro`).
 */
import { describe, expect, it } from "vitest";
import { headingId } from "@sinapsis/contract";
import { tocLabel } from "./ReaderView";

describe("tocLabel", () => {
  it("un wikilink con etiqueta muestra la etiqueta", () => {
    expect(tocLabel("[[leyes-de-de-morgan|Leyes de De Morgan]]")).toBe("Leyes de De Morgan");
  });

  it("un wikilink sin etiqueta muestra el destino", () => {
    expect(tocLabel("Cotas — ver [[desigualdad-de-chebyshev]]")).toBe(
      "Cotas — ver desigualdad-de-chebyshev",
    );
  });

  it("varios wikilinks en un mismo encabezado", () => {
    expect(tocLabel("[[esperanza|Esperanza]] y [[varianza|Varianza]]")).toBe("Esperanza y Varianza");
  });

  it("una etiqueta con `]` adentro no se corta", () => {
    expect(tocLabel("[[esperanza|Esperanza $E[X]$]]")).toBe("Esperanza $E[X]$");
  });

  it("un ancla interna muestra su etiqueta", () => {
    expect(tocLabel("[[#Independencia|Independencia]]")).toBe("Independencia");
  });

  /* La matemática NO se toca acá: la compone `MathText`, que es lo que recibe
     esta salida. Lo que importa es que los `$` sigan en pie para que los vea. */
  it("deja la matemática en línea intacta para MathText", () => {
    expect(tocLabel("Esperanza por la cola (supervivencia), $X\\ge 0$")).toBe(
      "Esperanza por la cola (supervivencia), $X\\ge 0$",
    );
    expect(tocLabel("Normal estándar $Z\\sim N(0,1)$")).toBe("Normal estándar $Z\\sim N(0,1)$");
  });

  it("un encabezado sin marcado no cambia", () => {
    expect(tocLabel("Axiomas de Kolmogorov")).toBe("Axiomas de Kolmogorov");
  });

  /**
   * La invariante que no se puede romper: el rótulo es SOLO presentación, así
   * que el ancla del encabezado tiene que salir igual del texto crudo y del
   * rotulado. Si dejara de valer, `[[pagina#ancla]]` apuntaría a un id que no
   * existe en el DOM (N0-22).
   */
  it("rotular no mueve el ancla del encabezado", () => {
    const crudos = [
      "[[independencia|Independencia]]",
      "[[leyes-de-de-morgan|Leyes de De Morgan]]",
      "Cotas — ver [[desigualdad-de-chebyshev]]",
      "Esperanza por la cola (supervivencia), $X\\ge 0$",
      "Normal estándar $Z\\sim N(0,1)$",
      "6 · Normal estándar y estandarización",
    ];
    for (const crudo of crudos) {
      expect(headingId(tocLabel(crudo)), crudo).toBe(headingId(crudo));
    }
    expect(headingId("[[independencia|Independencia]]")).toBe("independencia");
  });
});
