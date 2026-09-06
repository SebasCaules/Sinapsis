import { describe, expect, it } from "vitest";
import { createMarkdown, joinInlineMath, renderMathHtml, rich } from "../src/markdown.js";
import { pages } from "./fixtures.js";

const bySlug = new Map(pages.map((p) => [p.slug, p]));
const md = createMarkdown(() => ({
  subject: "proba",
  hasPage: (slug: string) => bySlug.has(slug),
  titleOf: (slug: string) => bySlug.get(slug)?.title ?? null,
}));

/** Monta HTML en un contenedor real (sin innerHTML). */
function mount(html: string): HTMLElement {
  const root = document.createElement("div");
  root.appendChild(document.createRange().createContextualFragment(html));
  return root;
}

describe("renderMarkdown — matemática", () => {
  it("resuelve la math en línea con KaTeX", () => {
    const html = md.renderMarkdown("Sea $x^2 + 1$ el polinomio.");
    expect(html).toContain('class="katex"');
    expect(html).not.toContain("$x^2");
  });
  it("resuelve la math de bloque en modo display", () => {
    const html = md.renderMarkdown("$$\\int_0^1 x\\,dx = \\tfrac12$$");
    expect(html).toContain("katex-display");
  });
  it("deja literal lo que va entre acentos graves", () => {
    const html = md.renderMarkdown("El texto `$x$` no es matemática.");
    expect(html).toContain("<code>$x$</code>");
  });
  it("protege los montos escapados (\\$)", () => {
    const html = md.renderMarkdown("Cuesta \\$100 y no es math.");
    expect(html).toContain("$100");
    expect(html).not.toContain('class="katex"');
  });
  it("une la math en línea partida en dos renglones", () => {
    expect(joinInlineMath("texto $a +\nb$ final", true)).toBe("texto $a + b$ final");
  });
  it("renderMathHtml resuelve sobre HTML ya armado", () => {
    expect(renderMathHtml("<p>$a<b$</p>")).toContain('class="katex"');
  });
  it("rich compone texto plano con math y negritas", () => {
    const out = rich("**Media** $\\mu$");
    expect(out).toContain("<strong>Media</strong>");
    expect(out).toContain('class="katex"');
  });
});

describe("renderMarkdown — wikilinks", () => {
  it("una página existente sale como enlace del SPA", () => {
    const html = md.renderMarkdown("Ver [[normal|la normal]].");
    expect(html).toContain('href="/m/proba/p/normal"');
    expect(html).toContain('data-slug="normal"');
    expect(html).toContain(">la normal</a>");
  });
  it("sin texto propio usa el título de la página", () => {
    const html = md.renderMarkdown("Ver [[normal]].");
    expect(html).toContain(">Distribución normal</a>");
  });
  it("el ancla viaja en data-anchor, no en el href", () => {
    const html = md.renderMarkdown("Ver [[normal#Función de densidad]].");
    expect(html).toContain('href="/m/proba/p/normal"');
    expect(html).toContain('data-anchor="función-de-densidad"');
  });
  it("una página inexistente sale como wikilink roto", () => {
    const html = md.renderMarkdown("Ver [[no-existe|esto]].");
    expect(html).toContain('class="wikilink wikilink-broken"');
    expect(html).not.toContain("<a ");
  });
});

describe("renderMarkdown — callouts y figuras", () => {
  it("un callout de Obsidian sale como <aside class=callout>", () => {
    const html = md.renderMarkdown("> [!nota] Cuidado con el signo\n> El cuerpo del callout.");
    expect(html).toContain('<aside class="callout callout-nota"');
    expect(html).toContain('data-type="nota"');
    expect(html).toContain('data-callout-title="Cuidado con el signo"');
    expect(html).toContain("El cuerpo del callout.");
    expect(html).not.toContain("[!nota]");
  });
  it("el tipo se normaliza y el título tiene valor por omisión", () => {
    const html = md.renderMarkdown("> [!warning]\n> Ojo.");
    expect(html).toContain('data-type="warn"');
    expect(html).toContain('data-callout-title="Atención"');
  });
  it("[!figura] emite el marcado que espera mountFigures", () => {
    const html = md.renderMarkdown("> [!figura] u2-normal\n> La densidad y su acumulada.");
    expect(html).toContain('<figure class="doc-figure" data-fig="u2-normal">');
    expect(html).toContain('<div class="fig-host"></div>');
    expect(html).toContain("<figcaption>");
    expect(html).toContain("La densidad y su acumulada.");
  });
  it("un id de figura inválido degrada a callout informativo", () => {
    const html = md.renderMarkdown("> [!figura] Figura de la normal\n> Epígrafe.");
    expect(html).toContain('data-type="info"');
    expect(html).not.toContain("data-fig=");
  });
  it("un blockquote común sigue siendo blockquote", () => {
    const html = md.renderMarkdown("> Una cita cualquiera.");
    expect(html).toContain("<blockquote>");
    expect(html).not.toContain("callout");
  });
});

describe("enhanceDoc", () => {
  it("pone ids de encabezado y devuelve el TOC", () => {
    const root = mount(md.renderMarkdown("## Función de densidad\n\ntexto\n\n### Caso discreto\n"));
    const toc = md.enhanceDoc(root);
    expect(toc.map((t) => t.id)).toEqual(["función-de-densidad", "caso-discreto"]);
    expect(root.querySelector("h2")?.id).toBe("función-de-densidad");
  });
  it("envuelve las tablas para el scroll horizontal", () => {
    const root = mount(md.renderMarkdown("| a | b |\n| - | - |\n| 1 | 2 |\n"));
    md.enhanceDoc(root);
    expect(root.querySelector(".table-wrap table")).not.toBeNull();
  });
});

describe("katexRender — política de trust", () => {
  it("no deja pasar \\href{javascript:…} y sí http(s)", async () => {
    const { katexRender } = await import("../src/markdown.js");
    expect(katexRender("\\href{javascript:alert(1)}{p}")).not.toContain('href="javascript:');
    expect(katexRender("\\href{https://example.org}{p}")).toContain('href="https://example.org"');
  });
});
