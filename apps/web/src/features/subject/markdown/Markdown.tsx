/**
 * El cuerpo de una página del wiki. El markdown viaja crudo desde el API y se
 * arma acá (decisión N0-10): sin HTML crudo del usuario (`rehype-raw` queda
 * fuera a propósito), con matemática KaTeX, wikilinks de Obsidian y callouts.
 *
 * El H1 del cuerpo no se toca: el compilador ya lo recortó, y el lector pone el
 * título de la página por su cuenta.
 */
import { memo, useEffect, useMemo, useRef, type ComponentPropsWithoutRef } from "react";
import ReactMarkdown, { type Components, type ExtraProps } from "react-markdown";
import { Link } from "react-router-dom";
import { refitFormulas } from "@sinapsis/runtime";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import type { PluggableList } from "unified";
import { rehypeHeadingIds } from "./rehypeHeadingIds";
import { remarkCallouts } from "./remarkCallouts";
import { remarkWikilinks } from "./remarkWikilinks";
import "katex/dist/katex.min.css";
import css from "./markdown.module.css";

export interface MarkdownProps {
  body: string;
  /** Slug de la materia: base de los wikilinks. */
  subject: string;
  /**
   * ¿Existe esa página en la materia? Tiene que ser una función ESTABLE: si
   * cambia de identidad en cada render, el pipeline entero se rearma y el
   * markdown se vuelve a parsear.
   */
  exists: (slug: string) => boolean;
}

type AnchorProps = ComponentPropsWithoutRef<"a"> & ExtraProps;
type TableProps = ComponentPropsWithoutRef<"table"> & ExtraProps;
type ImageProps = ComponentPropsWithoutRef<"img"> & ExtraProps;

function MarkdownLink({ node: _node, href, children, ...rest }: AnchorProps) {
  if (href && href.startsWith("/m/")) {
    return (
      <Link to={href} {...rest}>
        {children}
      </Link>
    );
  }
  if (href && /^(https?:)?\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}

const components: Components = {
  a: MarkdownLink,
  table: ({ node: _node, ...rest }: TableProps) => (
    <div className={css.tableWrap}>
      <table {...rest} />
    </div>
  ),
  img: ({ node: _node, ...rest }: ImageProps) => <img loading="lazy" {...rest} />,
};

/* Los ids van ANTES que KaTeX: el encabezado todavía tiene su texto, no el
   marcado de la fórmula.

   `htmlAndMathml` y no `html`: la capa visual de KaTeX es `aria-hidden`, así que
   con `html` a secas toda la matemática de una página era silencio para un
   lector de pantalla (U2). */
const REHYPE: PluggableList = [rehypeHeadingIds, [rehypeKatex, { output: "htmlAndMathml" }]];

export const Markdown = memo(function Markdown({ body, subject, exists }: MarkdownProps) {
  const host = useRef<HTMLDivElement>(null);
  const remarkPlugins = useMemo<PluggableList>(
    () => [remarkGfm, remarkMath, [remarkWikilinks, { subject, exists }], remarkCallouts],
    [subject, exists],
  );

  /* Port del ajuste del baseline (`core.js` → `fitWideFormulas`): una placa que
     no entra en la medida se encoge hasta 0,78 del cuerpo y recién entonces se
     vuelve desplazable. Sin esto quedaban 29 fórmulas cortadas en el wiki.

     El observador mira SOLO el ancho: `refitFormulas` cambia el cuerpo de las
     placas y con eso el alto del contenedor, así que reaccionar al alto sería
     un bucle. La primera entrada del observador ya trae la medida inicial, y de
     ahí sale la primera pasada (por eso no se llama a mano). */
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let vivo = true;
    const fit = () => {
      if (vivo && el.isConnected) refitFormulas(el);
    };

    /* Las tipografías de KaTeX llegan después del primer pintado y cambian el
       ancho de la fórmula sin cambiar el del contenedor: sin esta segunda
       pasada, una placa medida con la tipografía de reserva se encoge de menos y
       vuelve a desbordar (5 casos, todos en `video-mezcla`). Es el equivalente
       del reintento a 80 ms de `scheduleFitWideFormulas` en el baseline. */
    const fuentes = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (fuentes?.ready) void fuentes.ready.then(fit);

    if (typeof ResizeObserver === "undefined") {
      fit();
      return () => {
        vivo = false;
      };
    }
    let width = -1;
    const ro = new ResizeObserver((entries) => {
      const next = entries[0]?.contentRect.width ?? el.clientWidth;
      if (Math.abs(next - width) < 1) return;
      width = next;
      fit();
    });
    ro.observe(el);
    return () => {
      vivo = false;
      ro.disconnect();
    };
  }, [body]);

  return (
    <div className={css.prose} ref={host}>
      <ReactMarkdown remarkPlugins={remarkPlugins} rehypePlugins={REHYPE} components={components}>
        {body}
      </ReactMarkdown>
    </div>
  );
});
