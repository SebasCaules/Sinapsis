/**
 * remark-callouts — avisos de Obsidian.
 *
 *   > [!info] Título opcional
 *   > cuerpo del aviso
 *
 * pasa a `<aside class="callout" data-type="info">` con un rótulo en versalita.
 * El tipo `figura` es especial: en el Sprint 1 la plataforma todavía no dibuja
 * figuras interactivas, así que muestra el epígrafe con el rótulo «Figura · id»
 * y un marco discontinuo que anuncia el sprint en el que llegará.
 */
import { visit } from "unist-util-visit";

interface MdNode {
  type: string;
  value?: string;
  children?: MdNode[];
  data?: Record<string, unknown>;
}

/** Tipos reconocidos → rótulo en versalita. Cualquier otro cae en «nota». */
export const CALLOUT_LABELS: Record<string, string> = {
  info: "Información",
  nota: "Nota",
  tip: "Truco",
  intuicion: "Intuición",
  ejemplo: "Ejemplo",
  warn: "Atención",
  discrepancia: "Discrepancia",
  figura: "Figura",
};

const ALIASES: Record<string, string> = {
  note: "nota",
  hint: "tip",
  tldr: "info",
  abstract: "info",
  example: "ejemplo",
  warning: "warn",
  caution: "warn",
  atencion: "warn",
  intuition: "intuicion",
  figure: "figura",
};

const HEAD = /^\[!([\p{L}\p{N}_-]+)\]([+-]?)[ \t]*([^\n]*)(\n|$)/u;

function normalizeType(raw: string): string {
  const key = raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const aliased = ALIASES[key] ?? key;
  return CALLOUT_LABELS[aliased] ? aliased : "nota";
}

function span(className: string, value: string): MdNode {
  return {
    type: "calloutPart",
    data: {
      hName: "p",
      hProperties: { className: [className] },
      hChildren: [{ type: "text", value }],
    },
  };
}

export function remarkCallouts() {
  return function transformer(tree: MdNode): void {
    visit(tree as never, "blockquote", (node: unknown) => {
      const quote = node as MdNode;
      const first = quote.children?.[0];
      if (!first || first.type !== "paragraph" || !first.children?.length) return;
      const lead = first.children[0];
      if (!lead || lead.type !== "text" || typeof lead.value !== "string") return;
      const m = HEAD.exec(lead.value);
      if (!m || !m[1]) return;

      const kind = normalizeType(m[1]);
      const title = (m[3] ?? "").trim();
      lead.value = lead.value.slice(m[0].length);
      if (!lead.value) {
        first.children.shift();
        if (!first.children.length) quote.children?.shift();
      }

      const head: MdNode[] = [span("calloutLabel", labelFor(kind, title))];
      if (kind === "figura") {
        head.push({
          type: "calloutPart",
          data: {
            hName: "div",
            hProperties: { className: ["calloutFrame"] },
            hChildren: [{ type: "text", value: "Figura interactiva: Sprint 2" }],
          },
        });
      } else if (title) {
        head.push(span("calloutTitle", title));
      }

      quote.data = {
        ...quote.data,
        hName: "aside",
        hProperties: { className: ["callout"], "data-type": kind },
      };
      quote.children = [...head, ...(quote.children ?? [])];
    });
  };
}

function labelFor(kind: string, title: string): string {
  const label = CALLOUT_LABELS[kind] ?? CALLOUT_LABELS.nota ?? "Nota";
  if (kind === "figura") return title ? `Figura · ${title}` : "Figura";
  return label;
}
