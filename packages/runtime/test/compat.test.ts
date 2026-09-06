import { afterEach, describe, expect, it, vi } from "vitest";
import { createCompatApp, translateRoute } from "../src/compat.js";
import { installRuntime, uninstallRuntime } from "../src/index.js";
import { makeContext } from "./fixtures.js";

afterEach(() => {
  uninstallRuntime();
  vi.restoreAllMocks();
});

describe("App.go — traducción de rutas del baseline", () => {
  it("#/p/slug → /m/<materia>/p/<slug>", () => {
    const ctx = makeContext();
    const { app } = createCompatApp(ctx);
    app.go("#/p/normal");
    expect(ctx.navigated[0]?.path).toBe("/m/proba/p/normal");
  });
  it("#/unidad/2 → /m/<materia>/d/2", () => {
    const ctx = makeContext();
    const { app } = createCompatApp(ctx);
    app.go("#/unidad/2");
    expect(ctx.navigated[0]?.path).toBe("/m/proba/d/2");
  });
  it("#/wiki → /m/<materia>/wiki", () => {
    const ctx = makeContext();
    const { app } = createCompatApp(ctx);
    app.go("#/wiki");
    expect(ctx.navigated[0]?.path).toBe("/m/proba/wiki");
  });
  it("#/<vista>/<arg> → /m/<materia>/t/<vista>?arg=…", () => {
    const ctx = makeContext();
    const { app } = createCompatApp(ctx);
    app.go("#/explorador/binomial");
    expect(ctx.navigated[0]?.path).toBe("/m/proba/t/explorador?arg=binomial");
  });
  it("una ruta del SPA pasa tal cual (y respeta {replace})", () => {
    const ctx = makeContext();
    const { app } = createCompatApp(ctx);
    app.go("/m/proba/flashcards", { replace: true });
    expect(ctx.navigated[0]?.path).toBe("/m/proba/flashcards");
    expect(ctx.navigated[0]?.opts).toEqual({ replace: true });
  });
  it("una URL externa se abre en otra pestaña, sin navegar", () => {
    const ctx = makeContext();
    const { app } = createCompatApp(ctx);
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    app.go("https://example.org/tabla");
    expect(open).toHaveBeenCalledWith("https://example.org/tabla", "_blank", "noopener");
    expect(ctx.navigated).toHaveLength(0);
  });
  it("translateRoute conserva la query del hash", () => {
    expect(translateRoute("proba", "#/explorador/binomial?n=10")).toBe(
      "/m/proba/t/explorador?arg=binomial&n=10",
    );
    expect(translateRoute("proba", "#/inicio")).toBe("/m/proba");
  });
});

describe("App — datos de la materia", () => {
  it("CONTENT excluye los tipos que no cuentan como contenido", () => {
    const { app } = createCompatApp(makeContext());
    expect(app.PAGES).toHaveLength(3);
    expect(app.CONTENT.map((p) => p.slug)).toEqual(["intro", "normal"]);
    expect(app.BY_SLUG["normal"]?.title).toBe("Distribución normal");
  });
  it("UNITS sale de las divisiones efectivas, con color por token", () => {
    const { app } = createCompatApp(makeContext());
    expect(app.UNITS.map((u) => u.key)).toEqual(["1", "2", "eval"]);
    expect(app.UNITS[0]?.color).toBe("var(--u1)");
    expect(app.UNITS[2]?.color).toBe("var(--u0)");
    expect(app.unitShort("2")).toBe("U2");
    expect(app.unitMeta("2").name).toBe("Variables aleatorias");
  });
  it("isStudied lee el conjunto del host en vivo", () => {
    const ctx = makeContext();
    const { app } = createCompatApp(ctx);
    expect(app.isStudied("intro")).toBe(true);
    expect(app.isStudied("normal")).toBe(false);
    ctx.studied.add("normal");
    expect(app.isStudied("normal")).toBe(true);
  });
  it("setContext cambia de materia sin recrear el App", () => {
    const ctx = makeContext();
    const handle = createCompatApp(ctx);
    const ref = handle.app;
    handle.setContext(makeContext({ slug: "algebra", pages: [] }));
    expect(handle.app).toBe(ref);
    expect(ref.subject).toBe("algebra");
    expect(ref.PAGES).toHaveLength(0);
  });
});

describe("App — helpers de render", () => {
  it("katex funciona como función (baseline) y como objeto (contrato)", () => {
    const { app } = createCompatApp(makeContext());
    expect(app.katex("x^2", true)).toContain("katex-display");
    expect(app.katex.renderToString("x^2")).toContain('class="katex"');
  });
  it("icon devuelve un SVG y cae en el cuadrado si el nombre no existe", () => {
    const { app } = createCompatApp(makeContext());
    expect(app.icon("home", 16)).toContain('width="16"');
    expect(app.icon("no-existe")).toContain('d="M4 4h16v16H4z"');
  });
  it("fmt, withAlpha, emptyState y backBar", () => {
    const { app } = createCompatApp(makeContext());
    expect(app.fmt(3)).toBe("3");
    expect(app.fmt(3.14159)).toBe("3.14");
    expect(app.fmt(3.14159, 3)).toBe("3.142");
    expect(app.withAlpha("#7c2230", 0.5)).toBe("rgba(124,34,48,0.5)");
    expect(app.emptyState("Nada acá", "probá otra búsqueda")).toContain("Nada acá");
    expect(app.backBar("/m/proba", "Volver")).toContain('href="/m/proba"');
  });
  it("Fig, Plot y M quedan instalados sobre el App", () => {
    const { app } = createCompatApp(makeContext());
    expect(typeof (app.Fig as Record<string, unknown>)["svg"]).toBe("function");
    expect(typeof (app.Plot as Record<string, unknown>)["axes"]).toBe("function");
    expect(typeof (app.M as Record<string, unknown>)["normCDF"]).toBe("function");
  });
});

describe("installRuntime", () => {
  it("publica los globales y los quita al desinstalar", () => {
    const rt = installRuntime(makeContext());
    expect(window.App).toBe(rt.App);
    expect(window.M).toBe(rt.App.M);
    expect(window.SinapsisRuntime).toBe(rt);
    expect(rt.version).toBe(1);
    expect(rt.subject).toBe("proba");
    uninstallRuntime();
    expect(window.App).toBeUndefined();
    expect(window.SinapsisRuntime).toBeUndefined();
  });

  it("registerView / view y la delegación de data-action", () => {
    const rt = installRuntime(makeContext());
    const view = vi.fn();
    rt.App.registerView("explorador", view);
    expect(rt.view("explorador")).toBe(view);
    expect(rt.view("no-existe")).toBeNull();

    const clicked = vi.fn();
    rt.App.registerAction("copiar", clicked);
    const btn = document.createElement("button");
    btn.setAttribute("data-action", "copiar");
    document.body.appendChild(btn);
    btn.click();
    expect(clicked).toHaveBeenCalledTimes(1);
    btn.remove();
  });

  it("setTheme avisa a los oyentes y dispara el redibujo de la vista", () => {
    const rt = installRuntime(makeContext());
    const redraw = vi.fn();
    const onTheme = vi.fn();
    rt.App.setRedraw(redraw);
    const off = rt.onThemeChange(onTheme);
    rt.setTheme("claustro");
    expect(redraw).toHaveBeenCalledTimes(1);
    expect(onTheme).toHaveBeenCalledWith("claustro");
    expect(rt.theme).toBe("claustro");
    off();
    rt.setTheme("laurel");
    expect(onTheme).toHaveBeenCalledTimes(1);
  });

  it("updateContext cambia la materia sin recargar el runtime", () => {
    const rt = installRuntime(makeContext());
    rt.updateContext(makeContext({ slug: "algebra" }));
    expect(rt.subject).toBe("algebra");
    rt.App.go("#/p/normal");
    expect(rt.App.PAGES).toHaveLength(3);
  });
});
