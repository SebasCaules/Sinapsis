/**
 * El cuerpo de una página del wiki. El markdown viaja crudo desde el API y se
 * arma acá (decisión N0-10): sin HTML crudo del usuario (`rehype-raw` queda
 * fuera a propósito), con matemática KaTeX, wikilinks de Obsidian y callouts.
 *
 * El H1 del cuerpo no se toca: el compilador ya lo recortó, y el lector pone el
 * título de la página por su cuenta.
 */
import { memo, useMemo, type ComponentPropsWithoutRef } from "react";
import ReactMarkdown, { type Components, type ExtraProps } from "react-markdown";
import { Link } from "react-router-dom";
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
   marcado de la fórmula. */
const REHYPE: PluggableList = [rehypeHeadingIds, [rehypeKatex, { output: "html" }]];

export const Markdown = memo(function Markdown({ body, subject, exists }: MarkdownProps) {
  const remarkPlugins = useMemo<PluggableList>(
    () => [remarkGfm, remarkMath, [remarkWikilinks, { subject, exists }], remarkCallouts],
    [subject, exists],
  );

  return (
    <div className={css.prose}>
      <ReactMarkdown remarkPlugins={remarkPlugins} rehypePlugins={REHYPE} components={components}>
        {body}
      </ReactMarkdown>
    </div>
  );
});
