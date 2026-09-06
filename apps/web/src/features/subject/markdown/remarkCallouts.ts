/**
 * remark-callouts — avisos de Obsidian.
 *
 *   > [!info] Título opcional
 *   > cuerpo del aviso
 *
 * pasa a `<aside class="callout" data-type="info">` con un rótulo en versalita.
 *
 * El tipo `figura` es OTRA cosa (N0-42): `> [!figura] id` no es un aviso, es el
 * hueco de una figura interactiva. Emite EXACTAMENTE el marcado que espera
 * `App.mountFigures` de `@sinapsis/runtime` (`figureMarkup`)
 *
 *   <figure class="figura doc-figure" data-fig="id">
 *     <div class="fig-host">…marco de reserva…</div>
 *     <figcaption>…epígrafe…</figcaption>
 *   </figure>
 *
 * y el lector se encarga del resto: si la materia trae un bundle de figuras
 * cargado, vacía el hueco y llama a `App.mountFigures`; si no, el marco
 * discontinuo se queda donde está y el epígrafe se lee igual. El marcado no
 * promete nada: una materia sin figuras no anuncia ninguna que vaya a llegar.
 */
import { fold } from "@sinapsis/contract";
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
  /* «Intuición» y «intuicion» son el mismo aviso: el criterio de igualdad sin
     acentos es uno solo en toda la plataforma (`fold` del contrato). */
  const key = fold(raw);
  const aliased = ALIASES[key] ?? key;
  return CALLOUT_LABELS[aliased] ? aliased : "nota";
}

/** Nodo de HTML puro dentro del árbol de markdown (el hueco de la figura). */
function host(): MdNode {
  return {
    type: "calloutPart",
    data: {
      hName: "div",
      hProperties: { className: ["fig-host"] },
      /* El marco de reserva vive DENTRO del hueco: montar una figura lo vacía y
         lo reemplaza por el dibujo, así no quedan los dos a la vez. */
      hChildren: [
        {
          type: "element",
          tagName: "span",
          properties: { className: ["figFrame"] },
          children: [{ type: "text", value: "Figura interactiva" }],
        },
      ],
    },
  };
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
  return function transformer(tree: unknown): undefined {
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

      if (kind === "figura") {
        /* El primer token del título es el ID de la figura (lo que el bundle
           registró con `App.registerFigure`); lo que siga es epígrafe. */
        const [id = "", ...rest] = title.split(/\s+/);
        const extra = rest.join(" ").trim();
        const caption: MdNode = {
          type: "calloutPart",
          data: { hName: "figcaption" },
          children: [
            span("figLabel", labelFor(kind)),
            ...(extra ? [span("calloutTitle", extra)] : []),
            ...(quote.children ?? []),
          ],
        };
        quote.data = {
          ...quote.data,
          hName: "figure",
          /* `doc-figure` es el nombre del baseline de Proba y `figura` el de la
             plataforma: la figura lleva los dos para que sirvan tanto el CSS del
             runtime como el de esta hoja. */
          hProperties: id
            ? { className: ["figura", "doc-figure"], "data-fig": id }
            : { className: ["figura", "doc-figure"] },
        };
        quote.children = [host(), caption];
        return;
      }

      const head: MdNode[] = [span("calloutLabel", labelFor(kind))];
      if (title) head.push(span("calloutTitle", title));

      quote.data = {
        ...quote.data,
        hName: "aside",
        hProperties: { className: ["callout"], "data-type": kind },
      };
      quote.children = [...head, ...(quote.children ?? [])];
    });
    return undefined;
  };
}

/**
 * Rótulo en versalita del aviso. No lleva NUNCA el «título» del callout: en
 * `> [!figura] id` ese primer token es el identificador del bundle, no texto
 * para el lector (el baseline no lo muestra). El id sigue en `data-fig`, que es
 * donde lo busca `App.mountFigures`.
 */
function labelFor(kind: string): string {
  return CALLOUT_LABELS[kind] ?? CALLOUT_LABELS.nota ?? "Nota";
}
