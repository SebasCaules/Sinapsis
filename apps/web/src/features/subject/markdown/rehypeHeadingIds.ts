/**
 * rehype-heading-ids — el `id` de cada encabezado sale de `headingId`, el helper
 * del contrato que ya usa el compilador para llenar `Page.headings[].id`.
 *
 * Reemplaza a `rehype-slug`, que aplicaba OTRO criterio (sin acentos, con
 * sufijos «-1» al repetirse): con dos dueños distintos del ancla, un
 * `[[pagina#ancla]]` del wiki apuntaba a un id que no existía en el DOM y el
 * índice de la página tenía que salir a leer los ids del navegador. Con un solo
 * dueño, el índice se arma con `page.headings` tal cual llega del API.
 */
import { headingId } from "@sinapsis/contract";
import { visit } from "unist-util-visit";

interface HastNode {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

const HEADINGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);

/** ¿Es el marcado que dejó `remark-math` para una fórmula? */
function isMath(node: HastNode): boolean {
  const raw = node.properties?.className;
  const list = Array.isArray(raw) ? raw : typeof raw === "string" ? raw.split(/\s+/) : [];
  return list.some((c) => typeof c === "string" && c.startsWith("math"));
}

/**
 * Texto plano de un encabezado. La matemática se saltea: `headingId` también la
 * descarta cuando el compilador la ve escrita como `$…$`, así que los dos lados
 * llegan al mismo id.
 */
export function headingText(node: HastNode): string {
  if (node.type === "text") return node.value ?? "";
  if (node.type === "element" && isMath(node)) return "";
  return (node.children ?? []).map(headingText).join("");
}

export function rehypeHeadingIds() {
  return function transformer(tree: unknown): undefined {
    visit(tree as never, "element", (node: unknown) => {
      const el = node as HastNode;
      if (!el.tagName || !HEADINGS.has(el.tagName)) return;
      el.properties = { ...el.properties, id: headingId(headingText(el)) };
    });
    return undefined;
  };
}
