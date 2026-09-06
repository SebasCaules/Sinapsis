/**
 * Texto corto con matemática en línea (`$…$`): resúmenes de las tarjetas del
 * catálogo y epígrafes. No es el pipeline del lector: acá solo hace falta KaTeX,
 * no markdown entero.
 *
 * El catálogo dibuja cientos de resúmenes y los vuelve a dibujar con cada tecla
 * del filtro, así que el componente se memoriza y el HTML de cada fórmula se
 * guarda en una caché de módulo: la misma fórmula no se compone dos veces.
 */
import { Fragment, memo, useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface Part {
  math: boolean;
  value: string;
}

/** Parte un texto en trozos de prosa y trozos de matemática. */
export function splitMath(text: string): Part[] {
  const parts: Part[] = [];
  const re = /\$([^$\n]+)\$/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ math: false, value: text.slice(last, m.index) });
    parts.push({ math: true, value: m[1] ?? "" });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ math: false, value: text.slice(last) });
  return parts.length ? parts : [{ math: false, value: text }];
}

/** fórmula → HTML de KaTeX. Vive lo que la pestaña: las fórmulas de una materia se repiten. */
const rendered = new Map<string, string>();

function renderMath(tex: string): string {
  let html = rendered.get(tex);
  if (html === undefined) {
    /* `htmlAndMathml` y no `html`: la capa visual de KaTeX va con `aria-hidden`,
       así que sin el MathML de al lado la fórmula NO EXISTE para un lector de
       pantalla (U2). El coste es un nodo más por fórmula, invisible. */
    html = katex.renderToString(tex, { throwOnError: false, output: "htmlAndMathml" });
    rendered.set(tex, html);
  }
  return html;
}

export const MathText = memo(function MathText({ text, className }: { text: string; className?: string }) {
  const parts = useMemo(() => splitMath(text), [text]);
  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.math ? (
          <span
            key={i}
            // KaTeX genera el HTML a partir del texto de la fórmula y escapa la
            // entrada: no hay HTML del usuario en este marcado.
            dangerouslySetInnerHTML={{
              __html: renderMath(part.value),
            }}
          />
        ) : (
          <Fragment key={i}>{part.value}</Fragment>
        ),
      )}
    </span>
  );
});
