/**
 * El cuerpo de una página del wiki. El markdown viaja crudo desde el API y se
 * arma acá (decisión N0-10): sin HTML crudo del usuario (`rehype-raw` queda
 * fuera a propósito), con matemática KaTeX, wikilinks de Obsidian y callouts.
 */
import { useMemo, type ComponentPropsWithoutRef } from "react";
import ReactMarkdown, { type Components, type ExtraProps } from "react-markdown";
import { Link } from "react-router-dom";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { remarkCallouts } from "./remarkCallouts";
import { remarkWikilinks } from "./remarkWikilinks";
import css from "./markdown.module.css";

export interface MarkdownProps {
  body: string;
  /** Slug de la materia: base de los wikilinks. */
  subject: string;
  /** Slugs que existen en la materia (los demás se dibujan como enlace roto). */
  slugs: ReadonlySet<string>;
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

const REHYPE = [rehypeSlug, [rehypeKatex, { output: "html" }]] as const;

export function Markdown({ body, subject, slugs }: MarkdownProps) {
  const remarkPlugins = useMemo(
    () => [
      remarkGfm,
      remarkMath,
      [remarkWikilinks, { subject, exists: (slug: string) => slugs.has(slug) }],
      remarkCallouts,
    ],
    [subject, slugs],
  );

  return (
    <div className={css.prose}>
      <ReactMarkdown
        remarkPlugins={remarkPlugins as never}
        rehypePlugins={REHYPE as never}
        components={components}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}
