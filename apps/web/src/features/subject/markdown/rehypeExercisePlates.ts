/**
 * rehype-exercise-plates — placas de ejercicio (§ lector-05).
 *
 * Port de `wrapExercises` del baseline (core.js:936-985, con `exerciseOpeners`
 * y `solutionIndex`). Un encabezado de ejercicio y todo lo que lo sigue hasta el
 * próximo corte se envuelven en
 *
 *   <section class="exercise-plate">
 *     <h3>Ejercicio A — consumo de combustible</h3>   ← antetítulo «EJERCICIO»
 *     …enunciado…
 *     <div class="solucion">…resolución…</div>        ← rótulo «RESOLUCIÓN»
 *   </section>
 *
 * y el CSS pone el filete lateral, el antetítulo y la línea punteada que separa
 * el enunciado de la resolución. Sin esto, «### Ejercicio A — …» es un h3 chico
 * y el enunciado se confunde con la resolución y con el ejercicio anterior.
 *
 * Las tres reglas que decide el baseline y que acá no se reinventan:
 *
 *  1. SINGULAR abre placa («Ejercicio B — …»), PLURAL no («Ejercicios resueltos»
 *     es el título de la sección: abren placa sus subtítulos, uno por ejercicio).
 *  2. La placa corta en cualquier encabezado de nivel igual o menor, y en
 *     cualquier otro encabezado de ejercicio: una placa nunca envuelve a otra.
 *  3. La resolución empieza en el primer bloque con rótulo (Planteo, Cálculo,
 *     Solución…) o, si no hay ninguno, en el primer bloque posterior al
 *     enunciado (el párrafo que abre con «Enunciado»/«Fuente»/… o el que va
 *     entero en cursiva, más la tabla, el aviso o la figura que lo acompañan).
 *
 * Corre ANTES de KaTeX: el texto de los encabezados y de los párrafos todavía es
 * texto, así que las expresiones regulares del baseline valen tal cual.
 */
interface HastNode {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

/** Un encabezado en SINGULAR abre placa. */
const EX_ONE_RE = /^ejercicio(?!s)\b/i;
/** Uno en PLURAL es el título de la sección: abren placa sus subtítulos. */
const EX_LIST_RE = /^ejercicios\b/i;
/** Rótulos con los que arranca una resolución. */
const SOLUTION_RE = /^(Planteo|C[áa]lculo|Soluci|Resoluci|Resultado|Desarrollo|Par[áa]metros|Datos|Sean?\b|\(?[a-e]\))/i;
/** Rótulos con los que se presenta un enunciado. */
const ENUNCIADO_RE = /^(Enunciado|Fuente|Problema|Consigna)\b/i;
/** Proporción del párrafo que la cursiva tiene que cubrir para ser el enunciado. */
const ITALIC_SHARE = 0.6;

const HEADINGS = new Set(["h2", "h3", "h4"]);
/** Lo que todavía es enunciado aunque no sea un párrafo: datos, aviso, figura. */
const DRAG = new Set(["table", "blockquote", "figure", "aside"]);

function isElement(node: HastNode): boolean {
  return node.type === "element";
}

function isHeading(node: HastNode): boolean {
  return isElement(node) && !!node.tagName && HEADINGS.has(node.tagName);
}

function level(node: HastNode): number {
  return Number(node.tagName?.[1] ?? 0);
}

function classesOf(node: HastNode): string[] {
  const raw = node.properties?.className;
  if (Array.isArray(raw)) return raw.filter((c): c is string => typeof c === "string");
  return typeof raw === "string" ? raw.split(/\s+/) : [];
}

/** Texto plano del nodo, sin la matemática (que no es prosa) y sin dobles espacios. */
function text(node: HastNode): string {
  return rawText(node).replace(/\s+/g, " ").trim();
}

function rawText(node: HastNode): string {
  if (node.type === "text") return node.value ?? "";
  if (isElement(node) && classesOf(node).some((c) => c.startsWith("math"))) return "";
  return (node.children ?? []).map(rawText).join("");
}

/** Encabezados que abren placa, en orden de documento (core.js:900-918). */
export function exerciseOpeners(headings: HastNode[]): Set<HastNode> {
  const open = new Set<HastNode>();
  let listLvl = 0;
  let childLvl = 0;
  for (const h of headings) {
    const lvl = level(h);
    const t = text(h);
    if (listLvl && lvl <= listLvl) {
      listLvl = 0;
      childLvl = 0;
    }
    if (EX_LIST_RE.test(t)) {
      listLvl = lvl;
      childLvl = 0;
      continue;
    }
    if (listLvl) {
      // dentro de una lista de ejercicios: manda el primer nivel más profundo
      if (!childLvl) childLvl = lvl;
      if (lvl === childLvl) open.add(h);
      continue;
    }
    if (EX_ONE_RE.test(t)) open.add(h);
  }
  return open;
}

/**
 * ¿Este bloque es (todavía) el enunciado? El párrafo que abre con
 * «Enunciado»/«Fuente»/… o el que va entero en cursiva, que es como se copian
 * los enunciados de la guía (se admite una cola en redonda con la cita).
 */
function isStatement(node: HastNode | undefined): boolean {
  if (!node || node.tagName !== "p") return false;
  const t = text(node);
  if (!t) return false;
  if (ENUNCIADO_RE.test(t)) return true;
  const kids = node.children ?? [];
  const em = kids.find((k) => isElement(k));
  if (!em || (em.tagName !== "em" && em.tagName !== "i")) return false;
  for (const k of kids) {
    if (k === em) break;
    if (k.type !== "text" || /\S/.test(k.value ?? "")) return false; // algo antes de la cursiva
  }
  return text(em).length >= t.length * ITALIC_SHARE;
}

/** La tabla, el aviso y la figura que siguen al enunciado todavía son enunciado. */
function isDrag(node: HastNode): boolean {
  if (!node.tagName) return false;
  if (DRAG.has(node.tagName)) return true;
  return node.tagName === "div" && classesOf(node).some((c) => /^table-?wrap$/i.test(c));
}

/** Índice (dentro de los hijos ELEMENTO) donde empieza la resolución; -1 si no hay. */
export function solutionIndex(kids: HastNode[]): number {
  // (a) rótulo explícito de resolución
  for (let j = 1; j < kids.length; j++) {
    const kid = kids[j];
    if (!kid || kid.tagName !== "p") continue;
    if (SOLUTION_RE.test(text(kid))) return j;
  }
  // (b) sin rótulo: la resolución arranca en el primer bloque posterior al enunciado
  let i = 1;
  let statements = 0;
  while (i < kids.length && isStatement(kids[i])) {
    i += 1;
    statements += 1;
  }
  if (!statements) return -1;
  while (i < kids.length && isDrag(kids[i] as HastNode)) i += 1;
  return i < kids.length ? i : -1;
}

function element(tagName: string, className: string, children: HastNode[]): HastNode {
  return { type: "element", tagName, properties: { className: [className] }, children };
}

/** Arma la placa con los nodos del ejercicio y separa la resolución. */
function plate(nodes: HastNode[]): HastNode {
  const section = element("section", "exercise-plate", nodes);
  const kids = nodes.filter(isElement);
  const at = solutionIndex(kids);
  if (at <= 0) return section;
  const head = kids[at];
  const cut = nodes.indexOf(head as HastNode);
  if (cut <= 0) return section;
  section.children = [...nodes.slice(0, cut), element("div", "solucion", nodes.slice(cut))];
  return section;
}

export function rehypeExercisePlates() {
  return function transformer(tree: unknown): undefined {
    const root = tree as HastNode;
    const children = root.children ?? [];
    const headings = children.filter(isHeading);
    if (!headings.length) return undefined;
    const openers = exerciseOpeners(headings);
    if (!openers.size) return undefined;
    /* La placa corta en otro encabezado de ejercicio o de lista de ejercicios,
       sin importar el nivel: así una placa nunca envuelve a otra. */
    const stop = new Set(openers);
    for (const h of headings) if (EX_LIST_RE.test(text(h))) stop.add(h);

    const out: HastNode[] = [];
    let i = 0;
    while (i < children.length) {
      const node = children[i] as HastNode;
      if (!openers.has(node)) {
        out.push(node);
        i += 1;
        continue;
      }
      const lvl = level(node);
      const group: HastNode[] = [node];
      let j = i + 1;
      while (j < children.length) {
        const next = children[j] as HastNode;
        if (isHeading(next) && (level(next) <= lvl || stop.has(next))) break;
        group.push(next);
        j += 1;
      }
      /* El encabezado solo, sin cuerpo, es un título de sección disfrazado
         («## Ejercicio resuelto» seguido en seco de los «### Ejercicio …»):
         una placa vacía no aporta nada. */
      const hasBody = group.some((n) => n !== node && (isElement(n) || /\S/.test(n.value ?? "")));
      if (!hasBody) {
        out.push(node);
        i += 1;
        continue;
      }
      out.push(plate(group));
      i = j;
    }
    root.children = out;
    return undefined;
  };
}
