/**
 * remark-wikilinks — `[[slug]]`, `[[slug|texto]]`, `[[slug#ancla|texto]]` y
 * `[[#ancla|texto]]` (salto dentro de la misma página).
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
 *
 * ## Por qué el transformador NO mira un nodo de texto por vez
 *
 * `remark-math` es una extensión del PARSER (micromark), no un transformador: la
 * matemática ya está partida en nodos `inlineMath` cuando cualquier plugin de
 * remark corre, sin importar el orden del arreglo de plugins (verificado: mover
 * este plugin antes de `remarkMath` no cambia nada). Así que una etiqueta como
 * `[[distribucion-binomial|Binomial $(n,p)$]]` llega al árbol partida en tres
 * hermanos —`"[[distribucion-binomial|Binomial "`, `inlineMath("(n,p)")`, `"]]"`—
 * y un barrido nodo por nodo nunca encuentra el `]]`.
 *
 * Por eso el recorrido es por PADRE: se linealizan los hijos que se pueden
 * volver a escribir sin pérdida (`text` y `inlineMath`, que es `$…$`), se buscan
 * los wikilinks sobre esa cadena y se reparten los nodos otra vez. La etiqueta
 * conserva sus nodos `inlineMath`, así que la matemática se compone DENTRO del
 * enlace en vez de salir cruda.
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

/**
 * `[[…]]` hasta el primer `]]`.
 *
 *  · Un `]` suelto SÍ entra: el wiki de Proba escribe etiquetas como
 *    `[[esperanza|$E[X]$]]` (4 en total) y con `[^\]]+` quedaban crudas.
 *  · Un salto de línea también: un wikilink largo puede quedar partido por el
 *    ajuste del editor (2 casos en el wiki, y el baseline los resuelve). El
 *    salto es blando —vive dentro del mismo párrafo—, y el tope de 200 impide
 *    que un `[[` sin cerrar se coma media página buscando un `]]`.
 *
 * La alternancia es determinista —un carácter es `]` o no lo es—, así que no hay
 * retroceso exponencial.
 */
const WIKILINK = /\[\[((?:[^\]]|\](?!\])){1,200}?)\]\]/g;

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

/**
 * Fuente de un nodo en línea, o null si no se puede volver a escribir sin
 * pérdida (y entonces corta la corrida: un wikilink no la cruza).
 *
 * `inlineMath` vuelve a `$…$` exactamente como lo escribió el autor del wiki, y
 * es el ÚNICO nodo que en la práctica parte un wikilink por la mitad.
 */
function sourceOf(node: MdNode): string | null {
  if (node.type === "text") return node.value ?? "";
  if (node.type === "inlineMath") return "$" + (node.value ?? "") + "$";
  return null;
}

/** Una corrida de hermanos linealizables y el mapa de cada uno sobre la cadena. */
interface Run {
  /** Índice del primer hijo de la corrida dentro del padre. */
  from: number;
  /** Índice (exclusivo) del último. */
  to: number;
  text: string;
  /** Por hijo: [inicio, fin) dentro de `text`. */
  spans: Array<{ node: MdNode; start: number; end: number }>;
}

function runsOf(children: MdNode[]): Run[] {
  const runs: Run[] = [];
  let current: Run | null = null;
  children.forEach((child, i) => {
    const src = sourceOf(child);
    if (src === null) {
      current = null;
      return;
    }
    if (!current) {
      current = { from: i, to: i + 1, text: "", spans: [] };
      runs.push(current);
    }
    current.spans.push({ node: child, start: current.text.length, end: current.text.length + src.length });
    current.text += src;
    current.to = i + 1;
  });
  return runs;
}

/**
 * Los nodos que cubren `[a, b)` de la corrida. Un `inlineMath` entero se
 * conserva como nodo (la matemática se compone); si el corte lo parte por la
 * mitad —no pasa con un wikilink bien formado— se degrada a su fuente literal.
 */
function slice(run: Run, a: number, b: number): MdNode[] {
  const out: MdNode[] = [];
  if (b <= a) return out;
  for (const span of run.spans) {
    if (span.end <= a || span.start >= b) continue;
    const from = Math.max(a, span.start);
    const to = Math.min(b, span.end);
    if (span.node.type !== "text" && from === span.start && to === span.end) {
      out.push(span.node);
      continue;
    }
    const value = run.text.slice(from, to);
    if (value) out.push({ type: "text", value });
  }
  return out;
}

/**
 * ¿La posición `i` de la corrida cae dentro de un nodo de TEXTO?
 *
 * Los `[[…]]` que viven dentro de una fórmula —`$[[a,b]]$` es un intervalo, no
 * un enlace— no son wikilinks: se exige que tanto la apertura como el cierre
 * caigan en texto para convertir.
 */
function inText(run: Run, i: number): boolean {
  for (const span of run.spans) {
    if (i >= span.start && i < span.end) return span.node.type === "text";
  }
  return false;
}

/** Quita el blanco de los bordes de la etiqueta sin tocar sus nodos de adentro. */
function trimEdges(nodes: MdNode[]): MdNode[] {
  const out = nodes.slice();
  const first = out[0];
  if (first && first.type === "text") {
    const value = (first.value ?? "").replace(/^\s+/, "");
    if (value) out[0] = { type: "text", value };
    else out.shift();
  }
  const last = out[out.length - 1];
  if (last && last.type === "text") {
    const value = (last.value ?? "").replace(/\s+$/, "");
    if (value) out[out.length - 1] = { type: "text", value };
    else out.pop();
  }
  return out;
}

export function remarkWikilinks(options: WikilinkOptions) {
  const { subject, exists } = options;

  /** Nodo destino de un wikilink ya partido. `label` son los nodos de la etiqueta. */
  function linkNode(inner: string, raw: string, label: MdNode[]): MdNode {
    const { slug, anchor, text } = parseWikilink(inner);
    const shown: MdNode[] = label.length ? label : [{ type: "text", value: text ?? slug }];

    /* `[[#ancla|texto]]` es un salto DENTRO de la página, como en el baseline: no
       tiene slug y no hace falta ninguno, alcanza con el ancla del compilador
       (N0-22), que es el mismo id que el lector pinta en el encabezado. */
    if (!slug && anchor) {
      return {
        type: "link",
        url: "#" + headingId(anchor),
        data: { hProperties: { className: ["wikilink"], "data-anchor": anchor } },
        children: label.length ? label : [{ type: "text", value: text ?? anchor }],
      };
    }
    if (!slug) return { type: "text", value: raw };
    if (exists(slug)) {
      return {
        type: "link",
        /* El ancla pasa por `headingId`: es el mismo id que el compilador
           le puso al encabezado y que el lector pinta en el DOM. */
        url: routes.page(subject, slug) + (anchor ? "#" + headingId(anchor) : ""),
        data: { hProperties: { className: ["wikilink"], "data-slug": slug } },
        children: shown,
      };
    }
    return {
      type: "wikilinkBroken",
      data: {
        hName: "span",
        hProperties: {
          className: ["wikilink-broken"],
          title: "«" + slug + "» todavía no existe en esta materia",
        },
      },
      children: shown,
    };
  }

  return function transformer(tree: unknown): undefined {
    visit(
      tree as never,
      (node: unknown) => Array.isArray((node as MdNode).children),
      (node: unknown) => {
        const holder = node as MdNode;
        const children = holder.children;
        if (!children || !children.length) return;
        // dentro de un enlace de verdad no se anidan enlaces
        if (holder.type === "link" || holder.type === "linkReference") return SKIP;
        if (!children.some((c) => c.type === "text" && (c.value ?? "").includes("[["))) return;

        let changed = false;
        const next: MdNode[] = [];
        let cursor = 0;
        for (const run of runsOf(children)) {
          // los hijos que quedaron fuera de la corrida pasan tal cual
          for (let i = cursor; i < run.from; i += 1) next.push(children[i] as MdNode);
          cursor = run.to;

          if (!run.text.includes("[[")) {
            run.spans.forEach((s) => next.push(s.node));
            continue;
          }

          let last = 0;
          WIKILINK.lastIndex = 0;
          let m: RegExpExecArray | null;
          const parts: MdNode[] = [];
          let hit = false;
          while ((m = WIKILINK.exec(run.text)) !== null) {
            const inner = m[1];
            if (inner === undefined) continue;
            // el `[[` y el `]]` tienen que estar los dos en texto, no en una fórmula
            if (!inText(run, m.index) || !inText(run, m.index + m[0].length - 1)) continue;
            parts.push(...slice(run, last, m.index));
            const innerStart = m.index + 2;
            const bar = inner.indexOf("|");
            /* La etiqueta solo se reconstruye con sus nodos cuando hay una: sin
               `|` el texto visible es el slug, y ahí no hay nada que conservar. */
            const label =
              bar === -1 ? [] : trimEdges(slice(run, innerStart + bar + 1, innerStart + inner.length));
            parts.push(linkNode(inner, m[0], label));
            last = m.index + m[0].length;
            hit = true;
          }
          if (!hit) {
            run.spans.forEach((s) => next.push(s.node));
            continue;
          }
          changed = true;
          parts.push(...slice(run, last, run.text.length));
          next.push(...parts);
        }
        for (let i = cursor; i < children.length; i += 1) next.push(children[i] as MdNode);

        if (!changed) return;
        holder.children = next;
        /* Se sigue bajando a los hijos NUEVOS a propósito: un párrafo puede
           tener un wikilink suelto y otro dentro de `**negrita**`, y el segundo
           vive en un hijo que esta pasada no linealiza. Los enlaces recién
           creados los frena la guardia de `link` de arriba. */
        return;
      },
    );
    return undefined;
  };
}
