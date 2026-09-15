/**
 * rehype-typography — dos ataduras que el navegador no hace solo y que, sueltas,
 * cortan lo que se lee como una unidad (pedido del usuario sobre las páginas de
 * parcial de Cripto):
 *
 *   1. La puntuación pegada a una fórmula en línea. KaTeX deja cada fórmula
 *      como cajas `inline-block`, y el navegador las trata como un carácter de
 *      reemplazo: admite el corte de renglón justo antes y justo después, así
 *      que una coma quedaba huérfana al principio de la línea siguiente y un
 *      paréntesis de apertura, solo al final de la anterior. Un «word joiner»
 *      (U+2060) entre la fórmula y su puntuación lo prohíbe (UAX #14, LB11),
 *      sin envolver nada en más marcado.
 *
 *   2. Las abreviaturas que van pegadas a su número: «Ej. 3», «Clase 5»,
 *      «Guía 4». Un espacio duro (U+00A0) las deja en el mismo renglón.
 *
 *   3. La fórmula en línea entera. KaTeX admite el corte de renglón entre sus
 *      tramos (después de un = o un +), y una ecuación repartida en dos líneas
 *      se lee mal. Las fórmulas de hasta `NOWRAP_MAX` caracteres de TeX —a
 *      17 px, unos 400 px como mucho— van envueltas en un `span.math-nowrap`
 *      que la hoja de estilos no deja partir en una columna de escritorio; en
 *      un teléfono la columna mide menos que eso y el envoltorio no aplica. Las
 *      más largas se quedan como estaban: partidas se leen peor, pero enteras
 *      se saldrían de la columna (Proba tiene 60 de más de 90 caracteres).
 *
 * Corre ANTES de `rehype-katex`, cuando la fórmula todavía es el `<span
 * class="math math-inline">` que dejó `remark-math`; la de bloque
 * (`math-display`) no se toca porque nunca comparte renglón con texto.
 * El código (`<code>`, `<pre>`) queda fuera: ahí cada carácter es literal.
 */
import { SKIP, visit } from "unist-util-visit";

interface HastNode {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

const WORD_JOINER = "⁠";
const NBSP = " ";

/** Puntuación que no puede abrir un renglón después de una fórmula. */
const PUNTUACION = /^[,.;:)\]}»”’!?…]/;
/** Puntuación que no puede cerrar un renglón antes de una fórmula. */
const APERTURA = /[(\[{«“‘¿¡]$/;

/** Abreviaturas y rótulos que se leen con el número que les sigue. */
const ABREVIATURAS =
  /\b(Ej|Ejs|Fig|Figs|Cap|Caps|Tab|Sec|pág|págs|p)\. (?=\d)|\b(Clase|Clases|Guía|Guías|Práctica|Prácticas|Ejercicio|Ejercicios|Unidad|Unidades|Sección|Capítulo|Teorema|Lema|Parcial|Bloque|Ronda|Paso|Mensaje|Filmina|Slide|Página) (?=\d)/g;

/** Largo máximo del TeX de una fórmula en línea que se deja sin partir. */
export const NOWRAP_MAX = 90;
export const NOWRAP_CLASS = "math-nowrap";

const SIN_TOCAR = new Set(["code", "pre", "script", "style"]);
/* Los encabezados no se atan: casi nunca doblan, y su texto es el que leen el
   índice de la página y las placas de ejercicio («Ejercicio N», literal). */
const ENCABEZADOS = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);

function classes(node: HastNode): string[] {
  const raw = node.properties?.className;
  return Array.isArray(raw) ? raw.map(String) : typeof raw === "string" ? raw.split(/\s+/) : [];
}

/** ¿Es una fórmula en línea de `remark-math`, todavía sin renderizar? */
export function isInlineMath(node: HastNode | undefined): boolean {
  return node?.type === "element" && classes(node).includes("math-inline");
}

/** ¿Es una fórmula, en línea o de bloque? Adentro el texto es TeX y no se toca. */
function isMath(node: HastNode): boolean {
  return classes(node).includes("math");
}

/** Ata las abreviaturas de un texto a su número. Exportado para el test. */
export function atarAbreviaturas(texto: string): string {
  return texto.replace(ABREVIATURAS, (m) => m.slice(0, -1) + NBSP);
}

function texDe(node: HastNode): string {
  return (node.children ?? []).map((c) => (c.type === "text" ? (c.value ?? "") : texDe(c))).join("");
}

export function rehypeTypography() {
  return function transformer(tree: unknown): undefined {
    /* Primero las ataduras de texto; después el envoltorio, para que la
       fórmula siga siendo hermana directa de su puntuación al medirla. */
    visit(tree as never, "element", (node: unknown) => {
      const el = node as HastNode;
      if ((el.tagName && SIN_TOCAR.has(el.tagName)) || isMath(el)) return SKIP;
      if (!el.children || (el.tagName && ENCABEZADOS.has(el.tagName))) return;
      const hijos = el.children;
      for (let i = 0; i < hijos.length; i++) {
        const hijo = hijos[i];
        if (!hijo || hijo.type !== "text" || typeof hijo.value !== "string") continue;
        let value = atarAbreviaturas(hijo.value);
        if (isInlineMath(hijos[i - 1]) && PUNTUACION.test(value)) value = WORD_JOINER + value;
        if (isInlineMath(hijos[i + 1]) && APERTURA.test(value)) value = value + WORD_JOINER;
        hijo.value = value;
      }
    });
    visit(tree as never, "element", (node: unknown) => {
      const el = node as HastNode;
      if ((el.tagName && SIN_TOCAR.has(el.tagName)) || isMath(el) || classes(el).includes(NOWRAP_CLASS)) return SKIP;
      if (!el.children) return;
      el.children = el.children.map((hijo) =>
        isInlineMath(hijo) && texDe(hijo).trim().length <= NOWRAP_MAX
          ? { type: "element", tagName: "span", properties: { className: [NOWRAP_CLASS] }, children: [hijo] }
          : hijo,
      );
    });
    return undefined;
  };
}
