/* ============================================================
   markdown.ts — render de markdown del wiki, compatible con el baseline
   (`core.js` de la app de Proba: renderMarkdown / renderMathHtml /
   joinInlineMath / rich / enhanceDoc / refitFormulas).

   Diferencias deliberadas con el baseline, todas por el contrato de Sinapsis:
     · los wikilinks apuntan a `routes.page(materia, slug)` (ruta del SPA), no
       al hash `#/p/slug`; el slug viaja en `data-slug` y el ancla en
       `data-anchor` (nunca en el href: un segundo '#' rompería la ruta);
     · los ids de encabezado salen de `headingId` del contrato, dueño único de
       la regla (el compilador emite los mismos en `Page.headings[].id`);
     · los callouts se resuelven en el propio render (no después, sobre el DOM)
       y salen como `<aside class="callout callout-<tipo>" data-type>`;
     · de `enhanceDoc` se portan ids + TOC, envoltorio de tablas y ajuste de
       fórmulas anchas; las heurísticas de placas de ejercicio y de callouts
       «legacy» ('⚠ …', '**Intuición.**') quedan fuera: son del wiki de Proba,
       no del contrato.
   ============================================================ */
import katex from "katex";
import type { TrustContext } from "katex";
import { Marked, type Tokens } from "marked";
import { headingId, routes } from "@sinapsis/contract";

/** Macros compartidas con el resto del material (mismas que el baseline). */
export const KATEX_MACROS: Record<string, string> = {
  "\\R": "\\mathbb{R}",
  "\\N": "\\mathbb{N}",
  "\\E": "\\mathbb{E}",
  "\\P": "\\mathbb{P}",
  "\\Var": "\\operatorname{Var}",
  "\\Cov": "\\operatorname{Cov}",
  "\\indic": "\\mathbf{1}",
};

export function escapeHtml(s: unknown): string {
  const map: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return String(s).replace(/[&<>"']/g, (c) => map[c] as string);
}

/** KaTeX con las macros del baseline; si falla, deja el TeX en un `<code>`. */
/** Política de `trust` de KaTeX compartida por el runtime: `http`, `https` y rutas relativas. */
export function KATEX_TRUST(ctx: TrustContext): boolean {
  /* Los comandos con URL (`\url`, `\href`, `\includegraphics`) solo con protocolos que
     no pueden volverse código; `\htmlClass`/`\htmlId`/`\htmlStyle`/`\htmlData` (sin
     URL) siguen permitidos como en el baseline. */
  if (!("url" in ctx)) return true;
  return ctx.protocol === "http" || ctx.protocol === "https" || ctx.protocol === "_relative";
}

export function katexRender(tex: string, display?: boolean): string {
  try {
    return katex.renderToString(tex, {
      displayMode: !!display,
      throwOnError: false,
      strict: false,
      /* Solo protocolos que no pueden volverse código: el texto del wiki es dato,
         no HTML (N0-10). `trust: true` dejaba pasar `\href{javascript:…}`. */
      trust: KATEX_TRUST,
      macros: KATEX_MACROS,
    });
  } catch {
    return "<code>" + escapeHtml(tex) + "</code>";
  }
}

/** Marcador interno para `\$` (montos) durante el render de math. */
const DLR = "\u0001";

const JOIN_NL_HTML = /[ \t]*\n[ \t]*/g;
const JOIN_NL_MD = /[ \t]*\n[ \t]*(?:>[ \t]*)*/g;
const JOIN_BLANK_RE = /\n[ \t]*(?:>[ \t]*)*\n/;

/**
 * Une las líneas dentro de cada par `$…$` inline (la math inline no cruza
 * saltos de línea) y deja los `$$…$$` tal cual. Port literal del baseline.
 * `md = true` si el texto es markdown (la continuación puede traer los '>' de
 * un blockquote).
 */
export function joinInlineMath(src: string | null | undefined, md?: boolean): string {
  let s = src == null ? "" : String(src);
  if (s.indexOf("$") < 0 || s.indexOf("\n") < 0) return s;
  const nlRe = md ? JOIN_NL_MD : JOIN_NL_HTML;
  let out = "";
  let i = 0;
  const n = s.length;
  while (i < n) {
    const ch = s.charAt(i);
    if (ch === "\\") { out += s.substr(i, 2); i += 2; continue; }
    if (ch !== "$") { out += ch; i++; continue; }
    if (s.charAt(i + 1) === "$") {
      // display: sin tocar
      const end = s.indexOf("$$", i + 2);
      if (end < 0) { out += s.slice(i); break; }
      out += s.slice(i, end + 2);
      i = end + 2;
      continue;
    }
    let j = i + 1;
    let close = -1;
    while (j < n) {
      const c = s.charAt(j);
      if (c === "\\") { j += 2; continue; }
      if (c === "$") { close = j; break; }
      j++;
    }
    if (close < 0) { out += s.slice(i); break; }
    let body = s.slice(i + 1, close);
    if (
      body.indexOf("\n") >= 0 && body.length <= 400 &&
      body.indexOf("</") < 0 && body.indexOf("<p") < 0 &&
      !JOIN_BLANK_RE.test(body)
    ) {
      body = body.replace(nlRe, " ");
    }
    out += "$" + body + "$";
    i = close + 1;
  }
  return out;
}

/** Dentro de la math el HTML puede traer entidades: KaTeX quiere el TeX literal. */
function unescapeMath(t: string): string {
  return String(t)
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

/**
 * Resuelve `$$…$$` y `$…$` dentro de un string de HTML ya armado. El orden es
 * obligatorio: primero `renderMathHtml(html)`, y recién después se inserta el
 * resultado en el documento (los '<' que viven dentro de la math romperían el
 * árbol si entraran crudos).
 */
export function renderMathHtml(html: string | null | undefined): string {
  if (!html) return "";
  let s = String(html);
  s = s.replace(/\\\$/g, DLR);
  s = joinInlineMath(s);
  const kx = (tex: string, display: boolean): string =>
    katexRender(unescapeMath(tex).split(DLR).join("\\$"), display);
  s = s.replace(/\$\$([\s\S]+?)\$\$/g, (_m, t: string) => kx(t.trim(), true));
  s = s.replace(/\$([^$\n]+?)\$/g, (_m, t: string) => kx(t, false));
  s = s.split(DLR).join("$");
  return s;
}

function richSeg(s: string): string {
  return escapeHtml(s).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

/** Texto plano con `$…$` y `**negritas**` → HTML en línea (port del baseline). */
export function rich(text: string | null | undefined): string {
  if (text == null) return "";
  let out = "";
  let last = 0;
  const re = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    out += richSeg(text.slice(last, m.index));
    out += katexRender((m[1] != null ? m[1] : m[2]) as string, m[1] != null);
    last = re.lastIndex;
  }
  out += richSeg(text.slice(last));
  return out;
}

// ---------------------------------------------------------------------------
// Callouts y figuras
// ---------------------------------------------------------------------------

/** Normalización de tipos de callout de Obsidian (vocabulario del baseline). */
const CALLOUT_TYPE: Record<string, string> = {
  note: "nota", nota: "nota",
  warning: "warn", caution: "warn", atencion: "warn", "atención": "warn", warn: "warn",
  info: "info", "información": "info", informacion: "info",
  tip: "tip", consejo: "tip",
  ejemplo: "ejemplo", example: "ejemplo",
  intuicion: "intuicion", "intuición": "intuicion",
  discrepancia: "discrepancia",
  figura: "figura", figure: "figura",
};

const CALLOUT_DEFAULT_TITLE: Record<string, string> = {
  nota: "Nota", warn: "Atención", info: "Información", tip: "Consejo",
  ejemplo: "Ejemplo", intuicion: "Intuición", discrepancia: "Discrepancia",
};

/** `[!tipo]±  Título` al principio del primer párrafo del blockquote. */
const CALLOUT_HTML_RE = /^(\s*<p>)\s*\[!([\wáéíóúñü-]+)\]([+-]?)[ \t]*([^\n<]*)/i;

/** Id de figura admitido en `> [!figura] <id>` (mismo criterio que el baseline). */
const FIGURE_ID_RE = /^[a-z0-9-]+$/;

/**
 * Marcado que debe emitir el lector para una figura interactiva. Es EXACTAMENTE
 * el que busca `mountFigures`: el ancla es `[data-fig]` y el dibujo va en el
 * `.fig-host` (si no existe, el motor dibuja sobre el propio `[data-fig]`).
 */
export function figureMarkup(id: string, captionHtml = ""): string {
  return (
    '<figure class="doc-figure" data-fig="' + escapeHtml(id) +
    '"><div class="fig-host"></div><figcaption>' + captionHtml + "</figcaption></figure>"
  );
}

/** Quita un `<p></p>` vacío que quede al retirar el encabezado del callout. */
function dropEmptyLead(html: string): string {
  return html.replace(/^\s*<p>\s*<\/p>\s*/, "");
}

// ---------------------------------------------------------------------------
// renderMarkdown
// ---------------------------------------------------------------------------

/** Lo que el runtime necesita saber de la materia para resolver los wikilinks. */
export interface MarkdownContext {
  /** Slug de la materia: arma `routes.page(subject, slug)`. */
  subject: string;
  /** ¿Existe esa página en la materia? */
  hasPage(slug: string): boolean;
  /** Título de la página (para `[[slug]]` sin texto propio). */
  titleOf(slug: string): string | null;
}

/** Lo que va entre acentos graves es literal: ni math ni wikilinks. */
const MD_CODE_RE = /```[\s\S]*?```|``[^`]*``|`[^`\n]*`/g;

function outsideCode(s: string, fn: (seg: string) => string): string {
  if (s.indexOf("`") < 0) return fn(s);
  let out = "";
  let last = 0;
  let m: RegExpExecArray | null;
  MD_CODE_RE.lastIndex = 0;
  while ((m = MD_CODE_RE.exec(s))) {
    out += fn(s.slice(last, m.index)) + m[0];
    last = MD_CODE_RE.lastIndex;
  }
  return out + fn(s.slice(last));
}

export interface MarkdownApi {
  renderMarkdown(md: string, currentSlug?: string): string;
  renderMathHtml(html: string): string;
  joinInlineMath(src: string, md?: boolean): string;
  rich(text: string): string;
  enhanceDoc(root: HTMLElement): Array<{ id: string; text: string; lvl: number }>;
  refitFormulas(container?: HTMLElement | null): void;
  escapeHtml(s: unknown): string;
  figureMarkup(id: string, captionHtml?: string): string;
}

/**
 * Crea el render de markdown atado a una materia. `getCtx` se lee en cada
 * llamada, así que `updateContext` del runtime cambia de materia sin recrear
 * nada.
 */
export function createMarkdown(getCtx: () => MarkdownContext): MarkdownApi {
  const marked = new Marked({ gfm: true, breaks: false });

  function callout(tipo: string, title: string, inner: string): string {
    return (
      '<aside class="callout callout-' + escapeHtml(tipo) +
      '" data-type="' + escapeHtml(tipo) +
      '" data-callout-title="' + escapeHtml(title) + '">' + inner + "</aside>"
    );
  }

  marked.use({
    renderer: {
      blockquote(this: { parser: { parse(tokens: unknown[]): string } }, token: Tokens.Blockquote) {
        const inner = this.parser.parse(token.tokens as unknown[]);
        const m = CALLOUT_HTML_RE.exec(inner);
        if (!m) return "<blockquote>" + inner + "</blockquote>";
        const key = String(m[2]).toLowerCase();
        const tipo = CALLOUT_TYPE[key] || key;
        const title = String(m[4] || "").trim();
        // se quita SOLO el prefijo: el resto del párrafo queda donde estaba
        const rest = dropEmptyLead((m[1] as string) + inner.slice(m[0].length));
        if (tipo === "figura") {
          if (FIGURE_ID_RE.test(title)) return figureMarkup(title, rest);
          return callout("info", title || "Figura", rest);
        }
        return callout(tipo, title || CALLOUT_DEFAULT_TITLE[tipo] || "", rest);
      },
    },
  });

  /** `[[slug|texto]]`, `[[slug#ancla]]`, `[[#ancla]]` → enlace del SPA. */
  function wikilinkHtml(inner: string, curSlug?: string): string {
    const ctx = getCtx();
    inner = inner.replace(/\\\|/g, "|");
    let target = inner;
    let text = "";
    const bar = inner.indexOf("|");
    if (bar >= 0) { target = inner.slice(0, bar); text = inner.slice(bar + 1); }
    target = target.trim().replace(/\\$/, "");
    const hash = target.indexOf("#");
    let slug = target;
    let anchor = "";
    if (hash >= 0) { slug = target.slice(0, hash); anchor = target.slice(hash + 1); }
    slug = slug.trim();
    const selfAnchor = slug === "" && !!anchor;
    if (selfAnchor) slug = curSlug || "";
    let label = (text || (selfAnchor ? anchor : slug)).trim() || slug;
    if (!text && !selfAnchor) {
      const t = ctx.titleOf(slug);
      if (t) label = t;
    }
    if (ctx.hasPage(slug)) {
      const href = routes.page(ctx.subject, slug);
      return (
        '<a class="wikilink" href="' + escapeHtml(href) +
        '" data-slug="' + escapeHtml(slug) + '"' +
        (anchor ? ' data-anchor="' + escapeHtml(headingId(anchor)) + '"' : "") +
        ">" + escapeHtml(label) + "</a>"
      );
    }
    return '<span class="wikilink wikilink-broken" title="Página aún no creada">' + escapeHtml(label) + "</span>";
  }

  /**
   * markdown → HTML: math extraída antes de marked (para que KaTeX reciba el
   * TeX literal), wikilinks, callouts y figuras. Mismo orden que el baseline.
   */
  function renderMarkdown(md: string, currentSlug?: string): string {
    const math: Array<{ t: string; d: boolean }> = [];
    const s = outsideCode(md == null ? "" : String(md), (seg) => {
      seg = seg.replace(/\\\$/g, "@@DLR@@");
      seg = joinInlineMath(seg, true);
      seg = seg.replace(/\$\$([\s\S]+?)\$\$/g, (_m, t: string) => {
        math.push({ t: t.trim(), d: true });
        return "@@M" + (math.length - 1) + "@@";
      });
      seg = seg.replace(/\$([^$\n]+?)\$/g, (_m, t: string) => {
        math.push({ t: t.trim(), d: false });
        return "@@M" + (math.length - 1) + "@@";
      });
      return seg.replace(/\[\[([^\]]+)\]\]/g, (_m, inner: string) => wikilinkHtml(inner, currentSlug));
    });
    let html = marked.parse(s) as string;
    html = html.replace(/@@M(\d+)@@/g, (_m, i: string) => {
      const entry = math[+i];
      if (!entry) return "";
      return katexRender(entry.t.replace(/@@DLR@@/g, () => "\\$"), entry.d);
    });
    html = html.replace(/@@DLR@@/g, () => "$");
    return html;
  }

  return {
    renderMarkdown,
    renderMathHtml,
    joinInlineMath,
    rich,
    enhanceDoc,
    refitFormulas,
    escapeHtml,
    figureMarkup,
  };
}

// ---------------------------------------------------------------------------
// enhanceDoc / refitFormulas (sobre el DOM ya pintado)
// ---------------------------------------------------------------------------

function all<T extends Element>(sel: string, root: ParentNode): T[] {
  return Array.prototype.slice.call(root.querySelectorAll(sel)) as T[];
}

/** Texto de un encabezado sin el MathML que KaTeX deja duplicado. */
function docCleanText(el: Element): string {
  const c = el.cloneNode(true) as Element;
  all(".katex-mathml", c).forEach((n) => n.remove());
  return (c.textContent || "").replace(/\s+/g, " ").trim();
}

/**
 * Retoques sobre el documento ya insertado: ids de encabezado (regla del
 * contrato), TOC de niveles 2 y 3, tablas con scroll y ajuste de las placas de
 * fórmula anchas. Idempotente.
 */
export function enhanceDoc(container: HTMLElement): Array<{ id: string; text: string; lvl: number }> {
  const used: Record<string, number> = {};
  const toc: Array<{ id: string; text: string; lvl: number }> = [];
  all<HTMLElement>("h1,h2,h3,h4", container).forEach((h) => {
    const txt = docCleanText(h);
    let id = headingId(txt);
    const seen = used[id];
    if (seen) { used[id] = seen + 1; id = id + "-" + (seen + 1); }
    else used[id] = 1;
    h.id = id;
    const lvl = +(h.tagName[1] as string);
    if (lvl === 2 || lvl === 3) toc.push({ id, text: txt, lvl });
  });
  all<HTMLTableElement>("table", container).forEach((tb) => {
    if (tb.parentElement && tb.parentElement.classList.contains("table-wrap")) return;
    const w = document.createElement("div");
    w.className = "table-wrap";
    tb.parentNode?.insertBefore(w, tb);
    w.appendChild(tb);
  });
  scheduleFitWideFormulas(container);
  return toc;
}

const KTX_MIN_K = 0.78;
const KTX_BASE_EM = 1.14;

function ktxBaseEm(el: HTMLElement): number {
  const par = el.parentNode as HTMLElement | null;
  if (!par || par.nodeType !== 1 || !window.getComputedStyle) return KTX_BASE_EM;
  const own = parseFloat(getComputedStyle(el).fontSize);
  const base = parseFloat(getComputedStyle(par).fontSize);
  if (!own || !base) return KTX_BASE_EM;
  return own / base;
}

function markWideScroll(el: HTMLElement): void {
  const max = el.scrollWidth - el.clientWidth;
  el.classList.toggle("at-start", el.scrollLeft <= 1);
  el.classList.toggle("at-end", el.scrollLeft >= max - 1);
}

let wideScrollHooked = false;
function hookWideScroll(): void {
  if (wideScrollHooked) return;
  wideScrollHooked = true;
  // 'scroll' no burbujea: un único listener en captura cubre todas las placas.
  document.addEventListener(
    "scroll",
    (ev) => {
      const t = ev.target as HTMLElement | null;
      if (t && t.nodeType === 1 && t.classList && t.classList.contains("is-wide")) markWideScroll(t);
    },
    true,
  );
}

interface PlateFit { cw: number; sw: number; over: boolean }

/** Ancho REAL de la fórmula contra el ancho de CONTENIDO de la placa. */
function plateFit(el: HTMLElement): PlateFit {
  const cs = window.getComputedStyle(el);
  const padL = parseFloat(cs.paddingLeft) || 0;
  const padR = parseFloat(cs.paddingRight) || 0;
  const cw = el.clientWidth - padL - padR;
  const kh = el.querySelector(".katex-html");
  const sw = kh ? kh.scrollWidth : Math.max(0, el.scrollWidth - padL - padR);
  return { cw, sw, over: cw > 0 && sw > cw };
}

/** Port del `fitWideFormulas` del baseline (dos pasadas + scroll con degradado). */
function fitWideFormulas(container: HTMLElement | null): void {
  if (!container || !container.querySelectorAll) return;
  const plates = all<HTMLElement>(".katex-display", container);
  if (!plates.length) return;
  plates.forEach((el) => {
    el.style.fontSize = "";
    el.classList.remove("is-wide", "at-start", "at-end");
  });
  const over: Array<{ el: HTMLElement; k: number; base: number; m?: PlateFit }> = [];
  plates.forEach((el) => {
    const m = plateFit(el);
    if (m.cw <= 0) return;                 // fuera del DOM u oculta: no se toca
    if (m.over) over.push({ el, k: m.cw / (m.sw + 1), base: ktxBaseEm(el) });
  });
  if (!over.length) return;
  over.forEach((o) => {
    o.k = Math.max(KTX_MIN_K, Math.min(1, o.k));
    o.el.style.fontSize = "calc(" + o.base.toFixed(3) + "em * " + o.k.toFixed(3) + ")";
  });
  const still = over.filter((o) => { o.m = plateFit(o.el); return o.m.over; });
  still.forEach((o) => {
    const m = o.m as PlateFit;
    const k2 = o.k * (m.cw / (m.sw + 1));
    if (k2 >= KTX_MIN_K) o.el.style.fontSize = "calc(" + o.base.toFixed(3) + "em * " + k2.toFixed(3) + ")";
    else {
      o.el.style.fontSize = "calc(" + o.base.toFixed(3) + "em * " + KTX_MIN_K + ")";
      o.el.classList.add("is-wide");
    }
  });
  still.forEach((o) => { if (plateFit(o.el).over) o.el.classList.add("is-wide"); });
  const wide = still.filter((o) => o.el.classList.contains("is-wide"));
  if (!wide.length) return;
  hookWideScroll();
  wide.forEach((o) => markWideScroll(o.el));
}

function scheduleFitWideFormulas(container: HTMLElement): void {
  const raf: (f: FrameRequestCallback) => unknown =
    typeof window !== "undefined" && window.requestAnimationFrame
      ? window.requestAnimationFrame.bind(window)
      : (f: FrameRequestCallback) => setTimeout(() => f(0), 16);
  raf(() => {
    try { fitWideFormulas(container); } catch { /* puede no estar en el DOM */ }
    const first = container && container.querySelector ? container.querySelector(".katex-display") : null;
    if (first && !first.clientWidth) {
      setTimeout(() => { try { fitWideFormulas(container); } catch { /* idem */ } }, 80);
    }
  });
}

/** Vuelve a ajustar las placas de fórmula (por omisión, las de `#main`). */
export function refitFormulas(container?: HTMLElement | null): void {
  const root = container || document.getElementById("main");
  if (!root) return;
  try { fitWideFormulas(root); } catch { /* medir puede fallar si está oculto */ }
}
