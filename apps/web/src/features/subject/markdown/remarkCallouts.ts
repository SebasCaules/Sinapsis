/**
 * remark-callouts — avisos de Obsidian y sus formas HEREDADAS.
 *
 *   > [!info] Título opcional
 *   > cuerpo del aviso
 *
 * pasa a `<aside class="callout" data-type="info">` con un rótulo en versalita.
 *
 * Buena parte del wiki es anterior a la sintaxis de Obsidian y escribe el aviso
 * en prosa. El baseline (`parseCallouts`, core.js:800-874) reconoce cuatro
 * formas y este plugin las porta enteras (§ lector-06):
 *
 *   1. `> [!tipo] Título`               — sintaxis de Obsidian
 *   2. `> ⚠ …`                          — atención, o discrepancia si la nombra
 *   3. `> **Intuición.** …`             — el rótulo abre en negrita
 *   4. `> Nota: …` / `> **Cuidado con el ancho.** …` — el rótulo abre en texto
 *
 * En las tres heredadas el rótulo se RETIRA del cuerpo y sube al título del
 * aviso (`stripLeadingLabel` del baseline): la palabra no se lee dos veces. Al
 * cuerpo, que dejó de ser la continuación de la oración, se le repone la
 * mayúscula inicial.
 *
 * El aviso imprime UNA sola versalita (§ lector-17): el título que escribió el
 * autor o, si no hay, el nombre del tipo. Es lo que hace el baseline, que guarda
 * un único `data-callout-title` y lo pinta con `::before`.
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
  cita: "Cita",
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
  quote: "cita",
  cite: "cita",
  figure: "figura",
};

const HEAD = /^\[!([\p{L}\p{N}_-]+)\]([+-]?)[ \t]*([^\n]*)(\n|$)/u;

/* --- formas heredadas (core.js:690-724) ---------------------------------- */

/** Palabras que valen como rótulo de un aviso escrito en prosa. */
const LEAD_WORD = "(Atenci[oó]n|Cuidado|Advertencia|Ojo|Discrepancia|Nota)s?";
const LEAD_STRONG_RE = new RegExp(`^\\s*${LEAD_WORD}\\b`, "i");
/* Sin corchetes ni paréntesis: «⚠ Discrepancia [05:39]: …» no es un rótulo, es
   el cuerpo con una marca de tiempo. Esos casos caen en el respaldo, que retira
   solo la palabra inicial. */
const LEAD_TEXT_RE = new RegExp(`^\\s*(${LEAD_WORD}(?:\\s+[^.:!?()\\[\\]]{1,60})?)\\s*[.:]\\s*`, "i");
const DROP_LEAD_RE = new RegExp(`^\\s*${LEAD_WORD}\\s*`, "i");
const DROP_INTUI_RE = /^\s*Intuici[óo]n\s*/i;
const INTUI_RE = /^\s*Intuici[óo]n/i;
const WARN_RE = /^\s*⚠/u;
/* El aviso legado abre con la palabra rótulo y la cierra con «.», «:» o raya a
   poca distancia; si no cierra, es prosa que empieza con esa palabra. */
const LEGACY_LABEL_RE = /^(Nota|Advertencia|Cuidado|Ojo|Atenci[óo]n)\b[^.:—\n]{0,40}[.:—]/i;
/** Tope de largo del rótulo: si no entra entero, no se parte por la mitad. */
const LABEL_MAX = 60;

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

/* --- lectura del árbol ---------------------------------------------------- */

/** Texto plano del nodo, sin la matemática (que no es prosa) y sin dobles espacios. */
function plainText(node: MdNode): string {
  return rawText(node).replace(/\s+/g, " ").trim();
}

function rawText(node: MdNode): string {
  if (node.type === "inlineMath" || node.type === "math") return "";
  if (typeof node.value === "string" && !node.children?.length) return node.value;
  return (node.children ?? []).map(rawText).join("");
}

/** Primer párrafo hijo DIRECTO de la cita (los anidados se resuelven solos). */
function firstParagraph(quote: MdNode): MdNode | null {
  return (quote.children ?? []).find((c) => c.type === "paragraph") ?? null;
}

/** Primer nodo de texto con contenido, si el párrafo ARRANCA con texto. */
function leadingTextNode(p: MdNode): MdNode | null {
  for (const child of p.children ?? []) {
    if (child.type !== "text") return null;
    if (/\S/.test(child.value ?? "")) return child;
  }
  return null;
}

/** Primera negrita del párrafo, saltando el texto en blanco que la precede. */
function leadingStrong(p: MdNode): MdNode | null {
  for (const child of p.children ?? []) {
    if (child.type === "text" && !/\S/.test(child.value ?? "")) continue;
    return child.type === "strong" ? child : null;
  }
  return null;
}

/**
 * Rótulo sacado de la negrita inicial. Devuelve "" cuando no sirve como título
 * —trae matemática o un enlace, o es demasiado largo—: en ese caso la negrita se
 * deja donde está y el aviso usa el rótulo genérico, sin perder nada del cuerpo.
 */
function labelFromStrong(strong: MdNode): string {
  const hasRich = (node: MdNode): boolean =>
    node.type === "inlineMath" ||
    node.type === "math" ||
    node.type === "link" ||
    node.type === "linkReference" ||
    (node.children ?? []).some(hasRich);
  if (hasRich(strong)) return "";
  const text = plainText(strong).replace(/[.:\s]+$/, "").trim();
  return text.length <= LABEL_MAX ? text : "";
}

/** Retira la palabra inicial del primer texto del nodo (la etiqueta ya la dice). */
function dropLeadWord(node: MdNode, re: RegExp): void {
  for (const child of node.children ?? []) {
    if (child.type !== "text") return;
    if (!/\S/.test(child.value ?? "")) continue;
    child.value = (child.value ?? "").replace(re, "");
    return;
  }
}

/**
 * Repone la mayúscula del cuerpo. Quitado el rótulo, «Nota: la suma…» queda en
 * «la suma…», y como el rótulo pasó a ser el TÍTULO del aviso, el cuerpo ya no
 * es la continuación de nada. Solo toca texto plano del principio (baja a una
 * negrita o una cursiva inicial, nunca a una fórmula).
 */
function capFirst(node: MdNode, depth = 0): void {
  if (depth > 2) return;
  for (const child of node.children ?? []) {
    if (child.type === "text") {
      const value = child.value ?? "";
      const at = value.search(/\S/);
      if (at < 0) continue;
      const letter = value[at] ?? "";
      if (letter === letter.toUpperCase()) return; // ya está en mayúscula, o no es letra
      child.value = value.slice(0, at) + letter.toUpperCase() + value.slice(at + 1);
      return;
    }
    if (child.type === "strong" || child.type === "emphasis") capFirst(child, depth + 1);
    return; // cualquier otro nodo: no se toca
  }
}

/**
 * Retira del cuerpo el rótulo que el aviso ya imprime arriba y lo devuelve como
 * título. `lead` es el primer nodo de texto del párrafo, si lo hay.
 */
function stripLeadingLabel(p: MdNode, lead: MdNode | null, fallback: string): string {
  // (a) el rótulo viene en negrita: «**Atención.** …»
  if (!lead || !/\S/.test(lead.value ?? "")) {
    const strong = leadingStrong(p);
    if (!strong || !LEAD_STRONG_RE.test(plainText(strong))) return fallback;
    const label = labelFromStrong(strong);
    if (!label) {
      dropLeadWord(strong, DROP_LEAD_RE);
      capFirst(p);
      return fallback;
    }
    const at = (p.children ?? []).indexOf(strong);
    p.children?.splice(at, 1);
    const after = p.children?.[at];
    if (after?.type === "text") after.value = (after.value ?? "").replace(/^[\s.]+/, " ");
    capFirst(p);
    return label;
  }
  // (b) el rótulo viene en texto plano: «Discrepancia con el raw: …»
  const m = LEAD_TEXT_RE.exec(lead.value ?? "");
  if (m?.[1]) {
    lead.value = (lead.value ?? "").slice(m[0].length);
    capFirst(p);
    return m[1].replace(/\s+/g, " ").trim();
  }
  // (c) el rótulo no cierra en «.» ni «:» porque lo que sigue trae paréntesis o
  //     corchetes («Discrepancia [05:39]: …»). Se retira solo la palabra inicial.
  if (LEAD_STRONG_RE.test(lead.value ?? "")) {
    lead.value = (lead.value ?? "").replace(DROP_LEAD_RE, "");
    capFirst(p);
    return fallback;
  }
  return fallback;
}

/** Convierte la cita en un aviso con su única versalita. */
function markCallout(quote: MdNode, kind: string, title: string): void {
  quote.data = {
    ...quote.data,
    hName: "aside",
    hProperties: { className: ["callout"], "data-type": kind },
  };
  quote.children = [span("calloutLabel", title || labelFor(kind)), ...(quote.children ?? [])];
}

export function remarkCallouts() {
  return function transformer(tree: unknown): undefined {
    visit(tree as never, "blockquote", (node: unknown) => {
      const quote = node as MdNode;
      if (quote.data?.hName) return; // idempotencia
      const first = firstParagraph(quote);
      if (!first?.children?.length) return;
      const lead = leadingTextNode(first);

      // 1) sintaxis de Obsidian: > [!tipo]± Título
      const m = lead ? HEAD.exec(lead.value ?? "") : null;
      if (lead && m?.[1]) {
        const kind = normalizeType(m[1]);
        const title = (m[3] ?? "").trim();
        lead.value = (lead.value ?? "").slice(m[0].length);
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
              /* Sin rótulo «FIGURA» delante del epígrafe (§ lector-18): el
                 baseline mueve los nodos al `figcaption` sin anteponer nada. */
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

        markCallout(quote, kind, title);
        return;
      }

      // 2) heredado: «⚠ …» (y su variante de discrepancia)
      if (lead && WARN_RE.test(lead.value ?? "")) {
        const disc = /discrepancia/i.test(plainText(first));
        lead.value = (lead.value ?? "").replace(/^\s*⚠️?\s*/u, "");
        const kind = disc ? "discrepancia" : "warn";
        markCallout(quote, kind, stripLeadingLabel(first, lead, labelFor(kind)));
        return;
      }

      // 3) heredado: «> **Intuición.** …» (se retira la negrita inicial)
      const strong = lead ? null : leadingStrong(first);
      if (strong && INTUI_RE.test(plainText(strong))) {
        const label = labelFromStrong(strong);
        if (label) {
          const at = (first.children ?? []).indexOf(strong);
          first.children?.splice(at, 1);
          const after = first.children?.[at];
          if (after?.type === "text") after.value = (after.value ?? "").replace(/^[\s.]+/, " ");
        } else {
          dropLeadWord(strong, DROP_INTUI_RE);
        }
        capFirst(first);
        markCallout(quote, "intuicion", label || labelFor("intuicion"));
        return;
      }

      // 4) heredado: el rótulo abre el párrafo, en texto plano o en negrita.
      //    «> Nota: …», «> **Nota de notación:** …», «> Ojo con el umbral: …».
      const legacy = LEGACY_LABEL_RE.exec(plainText(first));
      if (legacy?.[1]) {
        const isNote = /^nota/i.test(legacy[1]);
        const kind = isNote ? "nota" : "warn";
        markCallout(quote, kind, stripLeadingLabel(first, lead, labelFor(kind)));
      }
    });
    return undefined;
  };
}

/**
 * Rótulo genérico del aviso, el que se usa cuando el autor no escribió uno. No
 * lleva NUNCA el «título» del callout: en `> [!figura] id` ese primer token es
 * el identificador del bundle, no texto para el lector (el baseline no lo
 * muestra). El id sigue en `data-fig`, que es donde lo busca `App.mountFigures`.
 */
function labelFor(kind: string): string {
  return CALLOUT_LABELS[kind] ?? CALLOUT_LABELS.nota ?? "Nota";
}
