import { afterEach, describe, expect, it, vi } from "vitest";
import { createCompatApp } from "../src/compat.js";
import type { FigureApi } from "../src/figures.js";
import { createMarkdown } from "../src/markdown.js";
import { makeContext } from "./fixtures.js";

function mount(html: string): HTMLElement {
  const root = document.createElement("div");
  root.appendChild(document.createRange().createContextualFragment(html));
  document.body.appendChild(root);
  return root;
}

afterEach(() => {
  document.body.textContent = "";
});

describe("mountFigures", () => {
  it("dibuja una figura registrada dentro del .fig-host", () => {
    const { app } = createCompatApp(makeContext());
    const draw = vi.fn((host: HTMLElement) => {
      const p = document.createElement("p");
      p.className = "dibujo";
      host.appendChild(p);
    });
    app.registerFigure("u2-normal", draw);

    const root = mount('<figure class="doc-figure" data-fig="u2-normal"><div class="fig-host"></div><figcaption>Densidad</figcaption></figure>');
    const n = app.mountFigures(root);

    expect(n).toBe(1);
    expect(draw).toHaveBeenCalledTimes(1);
    expect(root.querySelector(".fig-host .dibujo")).not.toBeNull();
    const fig = root.querySelector("[data-fig]") as HTMLElement;
    expect(fig.dataset["mounted"]).toBe("1");
  });

  it("es idempotente: volver a montar no duplica el dibujo", () => {
    const { app } = createCompatApp(makeContext());
    app.registerFigure("u2-normal", (host: HTMLElement) => {
      host.appendChild(document.createElement("span"));
    });
    const root = mount('<figure data-fig="u2-normal"><div class="fig-host"></div></figure>');
    app.mountFigures(root);
    app.mountFigures(root);
    expect(root.querySelectorAll(".fig-host span")).toHaveLength(1);
  });

  it("una figura no registrada deja el aviso y no cuenta", () => {
    const { app } = createCompatApp(makeContext());
    const root = mount('<figure data-fig="no-existe"><div class="fig-host"></div></figure>');
    expect(app.mountFigures(root)).toBe(0);
    const missing = root.querySelector(".fig-missing");
    expect(missing?.textContent).toContain("no-existe");
    expect(missing?.textContent).toContain("figura no registrada");
  });

  it("unmountFigures ejecuta las limpiezas y vacía el host", () => {
    const { app } = createCompatApp(makeContext());
    const cleanup = vi.fn();
    app.registerFigure("u2-normal", (host: HTMLElement) => {
      host.appendChild(document.createElement("span"));
      return cleanup;
    });
    const root = mount('<figure data-fig="u2-normal"><div class="fig-host"></div></figure>');
    app.mountFigures(root);
    expect(app.unmountFigures(root)).toBe(1);
    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(root.querySelectorAll(".fig-host span")).toHaveLength(0);
  });

  it("el estado de la figura sobrevive al remonte (setState redibuja)", () => {
    const { app } = createCompatApp(makeContext());
    const vistos: number[] = [];
    app.registerFigure("u2-normal", (host: HTMLElement, api: FigureApi) => {
      const n = (api.state["n"] as number) ?? 1;
      vistos.push(n);
      host.appendChild(document.createElement("i"));
      if (n === 1) api.setState({ n: 2 });
    });
    const root = mount('<figure data-fig="u2-normal"><div class="fig-host"></div></figure>');
    app.mountFigures(root);
    expect(vistos).toEqual([1, 2]);
    app.mountFigures(root);
    expect(vistos).toEqual([1, 2, 2]);
  });

  it("monta la figura que emite renderMarkdown para `> [!figura] id`", () => {
    const ctx = makeContext();
    const { app } = createCompatApp(ctx);
    const md = createMarkdown(() => ({ subject: "proba", hasPage: () => false, titleOf: () => null }));
    app.registerFigure("u2-normal", (host: HTMLElement) => {
      host.appendChild(document.createElement("svg"));
    });
    const root = mount(md.renderMarkdown("> [!figura] u2-normal\n> La densidad."));
    expect(app.mountFigures(root)).toBe(1);
    expect(root.querySelector(".fig-host svg")).not.toBeNull();
    expect(root.querySelector("figcaption")?.textContent).toContain("La densidad.");
  });

  it("Fig.svg arma el lienzo responsive del baseline", () => {
    const { app } = createCompatApp(makeContext());
    let svgTag = "";
    app.registerFigure("u2-normal", (host: HTMLElement, api: FigureApi) => {
      const svgOf = api.Fig["svg"] as (h: HTMLElement, o: Record<string, unknown>) => SVGElement;
      const svg = svgOf(host, { w: 640, h: 320 });
      svgTag = svg.tagName;
    });
    const root = mount('<figure data-fig="u2-normal"><div class="fig-host"></div></figure>');
    app.mountFigures(root);
    expect(svgTag).toBe("svg");
    expect(root.querySelector(".fig-svg")).not.toBeNull();
  });
});
