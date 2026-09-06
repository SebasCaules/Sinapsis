/**
 * El callout `figura` es un CONTRATO con el runtime (N0-42): `App.mountFigures`
 * busca `[data-fig]` y dibuja dentro de su `.fig-host`. Si este marcado cambia,
 * las figuras de todas las materias dejan de montarse en silencio, así que se
 * prueba tal cual sale del pipeline del lector.
 *
 * Los avisos van en el mismo archivo: son el otro lado del plugin. Los casos
 * heredados (§ lector-06) son texto REAL del wiki de Proba —`formulario-maestro`
 * y `distribucion-normal`—, que es donde se midieron las 6 y 1 pérdidas.
 */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { Markdown } from "./Markdown";

afterEach(cleanup);

function html(body: string): HTMLElement {
  const view = render(<Markdown body={body} subject="proba" exists={() => true} />);
  return view.container;
}

const callout = (root: HTMLElement) => root.querySelector<HTMLElement>("aside.callout");
const label = (root: HTMLElement) => root.querySelector(".calloutLabel")?.textContent ?? "";

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

  it("el epígrafe no lleva rótulo delante: empieza en el texto del autor", () => {
    /* § lector-18: `makeFigure` del baseline MUEVE los nodos al `figcaption` sin
       anteponer nada, y el id es el nombre interno del bundle
       (`U0-FUBINI-ORDEN-DE-INTEGRACION`), que no es texto para el lector. */
    const root = html("> [!figura] normal-densidad\n> Las tres bandas anidadas.");
    expect(root.querySelector(".figLabel")).toBeNull();
    const caption = root.querySelector("figcaption")?.textContent ?? "";
    expect(caption.startsWith("Las tres bandas anidadas.")).toBe(true);
    expect(caption).not.toContain("Figura");
    expect(caption).not.toContain("normal-densidad");
    expect(root.querySelector("figure")?.getAttribute("data-fig")).toBe("normal-densidad");
  });

  it("lo que sigue al id es epígrafe, no parte del id", () => {
    const root = html("> [!figura] normal-densidad Densidad de la normal\n> Detalle.");
    expect(root.querySelector("figure")?.getAttribute("data-fig")).toBe("normal-densidad");
    expect(root.querySelector(".calloutTitle")?.textContent).toBe("Densidad de la normal");
  });
});

describe("callout con sintaxis de Obsidian", () => {
  it("es un `aside` con su tipo", () => {
    const root = html("> [!warn] Ojo\n> Cuidado con la varianza.");
    expect(callout(root)?.getAttribute("data-type")).toBe("warn");
    expect(root.querySelector("figure")).toBeNull();
  });

  it("con título propio, el título es el ÚNICO rótulo", () => {
    /* § lector-17: el baseline guarda un solo `data-callout-title` y lo pinta
       con `::before`; acá se leía «INFORMACIÓN / Convenciones». */
    const root = html("> [!info] Convenciones\n> La notación de la materia.");
    expect(label(root)).toBe("Convenciones");
    expect(root.querySelector(".calloutTitle")).toBeNull();
    expect(callout(root)?.textContent).not.toContain("Información");
  });

  it("sin título propio, el rótulo es el nombre del tipo", () => {
    const root = html("> [!info]\n> La notación de la materia.");
    expect(label(root)).toBe("Información");
  });
});

describe("avisos heredados (§ lector-06)", () => {
  it("«⚠ …» es un aviso de atención y el símbolo no queda a la vista", () => {
    const root = html("> ⚠️ El estimador no es insesgado.");
    expect(callout(root)?.getAttribute("data-type")).toBe("warn");
    expect(label(root)).toBe("Atención");
    expect(callout(root)?.textContent).not.toContain("⚠");
  });

  it("«cita» distingue la voz citada de la nota del autor", () => {
    const conTitulo = html("> [!cita] De la transcripción (cues pt2 583-589)\n> *«La segunda forma de construir un MAC es a partir de una función de hash.»*");
    expect(callout(conTitulo)?.getAttribute("data-type")).toBe("cita");
    /* Con título, la versalita es el título; el rótulo del tipo aparece cuando
       la cita no lo trae. */
    cleanup();
    const root = html("> [!cita]\n> *«…es a partir de una función de hash.»*");
    expect(callout(root)?.getAttribute("data-type")).toBe("cita");
    expect(label(root)).toBe("Cita");
  });

  it("«quote» y «cite» son alias de «cita»", () => {
    /* `quote` es lo que escribe Obsidian solo, y es lo que trae el wiki de
       Cripto en sus 418 citas de transcripción. Sin el alias caía en `nota`. */
    for (const tipo of ["quote", "cite", "Quote", "CITA"]) {
      cleanup();
      const root = html(`> [!${tipo}] Título\n> Cuerpo.`);
      expect(callout(root)?.getAttribute("data-type")).toBe("cita");
    }
  });

  it("«⚠ … discrepancia …» es un aviso de discrepancia", () => {
    const root = html("> ⚠ Discrepancia con el raw: la diapositiva usa n−1.");
    expect(callout(root)?.getAttribute("data-type")).toBe("discrepancia");
    /* El rótulo sube al título y el cuerpo arranca donde seguía la oración,
       con la mayúscula repuesta. */
    expect(label(root)).toBe("Discrepancia con el raw");
    const body = callout(root)?.querySelector("p:not(.calloutLabel)")?.textContent ?? "";
    expect(body).toBe("La diapositiva usa n−1.");
  });

  it("«⚠ **Atención.** …» retira la negrita y la usa de título", () => {
    const root = html("> ⚠ **Atención.** el orden de integración importa.");
    expect(callout(root)?.getAttribute("data-type")).toBe("warn");
    expect(label(root)).toBe("Atención");
    const body = callout(root)?.querySelector("p:not(.calloutLabel)")?.textContent ?? "";
    expect(body.trim()).toBe("El orden de integración importa.");
    expect(callout(root)?.querySelector("strong")).toBeNull();
  });

  it("«⚠ Discrepancia [05:39]: …» no parte el cuerpo: retira solo la palabra", () => {
    const root = html("> ⚠ Discrepancia [05:39]: el video dice otra cosa.");
    expect(callout(root)?.getAttribute("data-type")).toBe("discrepancia");
    expect(label(root)).toBe("Discrepancia");
    const body = callout(root)?.querySelector("p:not(.calloutLabel)")?.textContent ?? "";
    expect(body).toContain("[05:39]");
  });

  it("«**Intuición.** …» es un aviso de intuición", () => {
    const root = html("> **Intuición.** la varianza mide la dispersión.");
    expect(callout(root)?.getAttribute("data-type")).toBe("intuicion");
    expect(label(root)).toBe("Intuición");
    const body = callout(root)?.querySelector("p:not(.calloutLabel)")?.textContent ?? "";
    expect(body.trim()).toBe("La varianza mide la dispersión.");
  });

  it("un rótulo con matemática deja la negrita donde está y usa el genérico", () => {
    const root = html("> **Intuición ($\\sqrt n$, no $n$).** el error cae despacio.");
    expect(callout(root)?.getAttribute("data-type")).toBe("intuicion");
    expect(label(root)).toBe("Intuición");
    /* La negrita sobrevive (sin la palabra inicial): el cuerpo no pierde nada. */
    expect(callout(root)?.querySelector("strong")).not.toBeNull();
  });

  it("«Nota: …» en texto plano es un aviso de nota", () => {
    const root = html("> Nota: la suma de las frecuencias relativas da 1.");
    expect(callout(root)?.getAttribute("data-type")).toBe("nota");
    expect(label(root)).toBe("Nota");
    const body = callout(root)?.querySelector("p:not(.calloutLabel)")?.textContent ?? "";
    expect(body).toBe("La suma de las frecuencias relativas da 1.");
  });

  it("«Ojo con el umbral: …» es un aviso de atención con su rótulo entero", () => {
    const root = html("> Ojo con el umbral: la cola cambia de lado.");
    expect(callout(root)?.getAttribute("data-type")).toBe("warn");
    expect(label(root)).toBe("Ojo con el umbral");
  });

  it("«**Nota de notación:** …» toma el rótulo de la negrita", () => {
    const root = html("> **Nota de notación:** se escribe con mayúscula.");
    expect(callout(root)?.getAttribute("data-type")).toBe("nota");
    expect(label(root)).toBe("Nota de notación");
  });

  it("una cita común sigue siendo una cita", () => {
    /* El rótulo tiene que CERRAR en «.», «:» o raya a poca distancia: si no, es
       prosa que empieza con esa palabra, no un aviso. */
    const root = html("> Nota que la mediana no cambia cuando se agregan valores extremos al final de la muestra");
    expect(root.querySelector("aside.callout")).toBeNull();
    expect(root.querySelector("blockquote")).not.toBeNull();
  });
});
