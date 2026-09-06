/**
 * remark-wikilinks — `[[slug]]`, `[[slug|texto]]`, `[[slug#ancla|texto]]`.
 *
 * Convierte los enlaces de Obsidian en enlaces del SPA:
 *   [[distribucion-normal|la Normal]]  →  <a href="/m/proba/p/distribucion-normal"
 *                                            class="wikilink" data-slug="…">la Normal</a>
 * Si el slug no existe en la materia, el enlace se dibuja como texto marcado
 * (`<span class="wikilink-broken">`): el wiki es del usuario y un enlace roto es
 * información, no un error que deba romper la página.
 *
 * También desescapa `\|` dentro del wikilink, que es como se escribe el separador
 * cuando el enlace vive en una celda de tabla.
 */
import { headingId, routes } from "@sinapsis/contract";
import { visit, SKIP } from "unist-util-visit";

export interface WikilinkOptions {
  /** Slug de la materia: arma el href. */
  subject: string;
  /** ¿Existe esa página en la materia? */
  exists: (slug: string) => boolean;
}

interface MdNode {
  type: string;
  value?: string;
  url?: string;
  children?: MdNode[];
  data?: Record<string, unknown>;
}

const WIKILINK = /\[\[([^\]\n]+)\]\]/g;

/** Parte "slug#ancla|texto" en sus tres pedazos. */
export function parseWikilink(inner: string): { slug: string; anchor: string | null; text: string | null } {
  const clean = inner.replace(/\\\|/g, "|").trim();
  const bar = clean.indexOf("|");
  const targetRaw = bar === -1 ? clean : clean.slice(0, bar);
  const text = bar === -1 ? null : clean.slice(bar + 1).trim() || null;
  const hash = targetRaw.indexOf("#");
  const slug = (hash === -1 ? targetRaw : targetRaw.slice(0, hash)).trim();
  const anchor = hash === -1 ? null : targetRaw.slice(hash + 1).trim() || null;
  return { slug, anchor, text };
}

export function remarkWikilinks(options: WikilinkOptions) {
  const { subject, exists } = options;

  return function transformer(tree: unknown): undefined {
    visit(tree as never, "text", (node: unknown, index: unknown, parent: unknown) => {
      const text = node as MdNode;
      const holder = parent as MdNode | null;
      const at = index as number | null;
      if (!holder || at === null || typeof text.value !== "string") return;
      // dentro de un enlace de verdad no se anidan enlaces
      if (holder.type === "link" || holder.type === "linkReference") return;
      if (!text.value.includes("[[")) return;

      const out: MdNode[] = [];
      let last = 0;
      WIKILINK.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = WIKILINK.exec(text.value)) !== null) {
        const inner = m[1];
        if (inner === undefined) continue;
        if (m.index > last) out.push({ type: "text", value: text.value.slice(last, m.index) });
        last = m.index + m[0].length;
        const { slug, anchor, text: label } = parseWikilink(inner);
        const shown = label ?? slug;
        if (!slug) {
          out.push({ type: "text", value: m[0] });
        } else if (exists(slug)) {
          out.push({
            type: "link",
            /* El ancla pasa por `headingId`: es el mismo id que el compilador
               le puso al encabezado y que el lector pinta en el DOM. */
            url: routes.page(subject, slug) + (anchor ? `#${headingId(anchor)}` : ""),
            data: { hProperties: { className: ["wikilink"], "data-slug": slug } },
            children: [{ type: "text", value: shown }],
          });
        } else {
          out.push({
            type: "wikilinkBroken",
            data: {
              hName: "span",
              hProperties: {
                className: ["wikilink-broken"],
                title: `«${slug}» todavía no existe en esta materia`,
              },
              hChildren: [{ type: "text", value: shown }],
            },
          });
        }
      }
      if (!out.length) return;
      if (last < text.value.length) out.push({ type: "text", value: text.value.slice(last) });

      holder.children?.splice(at, 1, ...out);
      return [SKIP, at + out.length];
    });
    return undefined;
  };
}
