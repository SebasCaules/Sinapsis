/**
 * Texto corto con matemática en línea (`$…$`): resúmenes de las tarjetas del
 * catálogo y epígrafes. No es el pipeline del lector: acá solo hace falta KaTeX,
 * no markdown entero.
 */
import { Fragment, useMemo } from "react";
import katex from "katex";

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

export function MathText({ text, className }: { text: string; className?: string }) {
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
              __html: katex.renderToString(part.value, { throwOnError: false, output: "html" }),
            }}
          />
        ) : (
          <Fragment key={i}>{part.value}</Fragment>
        ),
      )}
    </span>
  );
}
