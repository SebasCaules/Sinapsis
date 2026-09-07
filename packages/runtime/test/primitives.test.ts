/**
 * Las primitivas del baseline que el runtime tenía que poner para que se puedan
 * portar las vistas grandes (ejercicios, parcial, formularios): `A.LS`,
 * `A.parseRoute`, `A.setQuery`, `A.viewState`, `A.viewRoot`, `A.scrollFor`,
 * `A.onTeardown`, `A.registerSearchProvider`, `A.markActivity`, `A.setTitle`,
 * `A.localToday` y `A.today` (brecha noportado-36).
 *
 * Todas se prueban contra el `App` de verdad: lo que aquí se fija es el contrato
 * con el que los bundles van a estar escritos.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createCompatApp, isQueryOnlyChange, parseLocation, translateRoute } from "../src/compat.js";
import { installRuntime, uninstallRuntime } from "../src/index.js";
import { makeContext } from "./fixtures.js";

/** Deja la barra de direcciones en una ruta del SPA, sin navegar. */
function at(path: string): void {
  history.replaceState(null, "", path);
}

beforeEach(() => {
  at("/");
  localStorage.clear();
});

afterEach(() => {
  uninstallRuntime();
  vi.restoreAllMocks();
});

describe("App.LS — localStorage con prefijo por materia", () => {
  it("guarda y lee JSON bajo `sinapsis.<materia>.rt.<clave>`", () => {
    const { app } = createCompatApp(makeContext());
    app.LS.set("pe.exEstado", { v: 1, m: { a: 2 } });
    expect(app.LS.key("pe.exEstado")).toBe("sinapsis.proba.rt.pe.exEstado");
    expect(localStorage.getItem("sinapsis.proba.rt.pe.exEstado")).toBe('{"v":1,"m":{"a":2}}');
    expect(app.LS.get("pe.exEstado", null)).toEqual({ v: 1, m: { a: 2 } });
  });

  it("dos materias con la MISMA clave no se pisan", () => {
    const uno = createCompatApp(makeContext());
    const otro = createCompatApp(makeContext({ slug: "algebra" }));
    uno.app.LS.set("pref", "a");
    otro.app.LS.set("pref", "b");
    expect(uno.app.LS.get("pref", "")).toBe("a");
    expect(otro.app.LS.get("pref", "")).toBe("b");
  });

  it("devuelve el valor por omisión si no hay nada o si el JSON está roto", () => {
    const { app } = createCompatApp(makeContext());
    expect(app.LS.get("nada", "def")).toBe("def");
    localStorage.setItem("sinapsis.proba.rt.roto", "{no es json");
    expect(app.LS.get("roto", "def")).toBe("def");
  });

  it("getObj siempre da un objeto plano y del devuelve al valor por omisión", () => {
    const { app } = createCompatApp(makeContext());
    app.LS.set("lista", [1, 2, 3]);
    expect(app.LS.getObj("lista")).toEqual({});
    app.LS.set("obj", { a: 1 });
    expect(app.LS.getObj("obj")).toEqual({ a: 1 });
    app.LS.del("obj");
    expect(app.LS.getObj("obj")).toEqual({});
  });
});

describe("App.parseRoute — la ruta real del SPA con la gramática del baseline", () => {
  it("lee la vista y el argumento del camino", () => {
    at("/m/proba/t/calc/ic?x=1");
    const { app } = createCompatApp(makeContext());
    expect(app.parseRoute()).toEqual({ view: "calc", arg: "ic", query: { x: "1" }, qs: "x=1" });
  });

  it("acepta la forma antigua del argumento en la query, y no lo mezcla con los parámetros", () => {
    at("/m/proba/t/calc?arg=ic&x=1");
    const { app } = createCompatApp(makeContext());
    const r = app.parseRoute();
    expect(r.view).toBe("calc");
    expect(r.arg).toBe("ic");
    expect(r.query).toEqual({ x: "1" });
  });

  it("devuelve los nombres del baseline para las vistas de la plataforma", () => {
    expect(parseLocation("proba", "/m/proba")).toMatchObject({ view: "inicio", arg: "" });
    expect(parseLocation("proba", "/m/proba/p/normal")).toMatchObject({ view: "p", arg: "normal" });
    expect(parseLocation("proba", "/m/proba/d/2")).toMatchObject({ view: "unidad", arg: "2" });
    expect(parseLocation("proba", "/m/proba/wiki")).toMatchObject({ view: "wiki" });
    expect(parseLocation("proba", "/m/proba/notes")).toMatchObject({ view: "apuntes" });
    expect(parseLocation("proba", "/m/proba/graph")).toMatchObject({ view: "grafo" });
    expect(parseLocation("proba", "/m/proba/quiz/u2")).toMatchObject({ view: "quiz", arg: "u2" });
  });

  it("lee la ruta aunque el sitio cuelgue de un base (N0-59)", () => {
    /* En GitHub Pages el pathname es `/Sinapsis/m/proba/…`: el prefijo de la
       materia no está al principio. Sin esto la vista se leía «Sinapsis». */
    expect(parseLocation("proba", "/Sinapsis/m/proba")).toMatchObject({ view: "inicio", arg: "" });
    expect(parseLocation("proba", "/Sinapsis/m/proba/t/taller", "?arg=markov")).toMatchObject({
      view: "taller",
      arg: "markov",
    });
    expect(parseLocation("proba", "/Sinapsis/m/proba/p/normal")).toMatchObject({ view: "p", arg: "normal" });
    /* Y un base de varios segmentos tampoco confunde. */
    expect(parseLocation("proba", "/a/b/m/proba/d/2")).toMatchObject({ view: "unidad", arg: "2" });
  });

  it("no confunde un prefijo que no es un segmento completo", () => {
    /* `/m/probabilidad` no es `/m/proba`: la materia es otra. */
    expect(parseLocation("proba", "/m/probabilidad/p/x").view).not.toBe("p");
  });

  it("es la inversa de translateRoute para las rutas del baseline", () => {
    const ida = translateRoute("proba", "#/taller/markov");
    expect(ida).toBe("/m/proba/t/taller?arg=markov");
    const [path, search] = (ida as string).split("?");
    expect(parseLocation("proba", path as string, search)).toMatchObject({ view: "taller", arg: "markov" });
  });
});

describe("App.setQuery — parámetros en la URL sin re-renderizar", () => {
  it("fusiona, borra con null y deja la ruta igual", () => {
    at("/m/proba/t/ejercicios?u=2");
    const { app } = createCompatApp(makeContext());
    const q = app.setQuery({ col: "guia", u: null, ej: 7 });
    expect(q).toEqual({ col: "guia", ej: "7" });
    expect(location.pathname).toBe("/m/proba/t/ejercicios");
    expect(location.search).toBe("?col=guia&ej=7");
  });

  it("conserva el `arg` de la vista", () => {
    at("/m/proba/t/calc?arg=ic");
    const { app } = createCompatApp(makeContext());
    app.setQuery({ x: "1" });
    expect(location.search).toBe("?x=1&arg=ic");
    expect(app.parseRoute()).toMatchObject({ view: "calc", arg: "ic", query: { x: "1" } });
  });

  it("no navega: usa replaceState (el host no se entera)", () => {
    at("/m/proba/t/ejercicios");
    const ctx = makeContext();
    const { app } = createCompatApp(ctx);
    const spy = vi.spyOn(history, "replaceState");
    app.setQuery({ ej: "3" });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(ctx.navigated).toHaveLength(0);
  });
});

describe("App.viewState — estado por vista en memoria", () => {
  it("devuelve SIEMPRE el mismo objeto para el mismo id", () => {
    const { app } = createCompatApp(makeContext());
    app.viewState("ejercicios").filtro = "guia";
    expect(app.viewState("ejercicios")).toEqual({ filtro: "guia" });
    expect(app.viewState("otra")).toEqual({});
  });

  it("sobrevive al cambio de tema (que puede volver a montar la vista)", () => {
    const handle = createCompatApp(makeContext());
    handle.app.viewState("ejercicios").filtro = "guia";
    handle.setTheme("claustro");
    expect(handle.app.viewState("ejercicios")).toEqual({ filtro: "guia" });
  });

  it("se olvida al cambiar de materia", () => {
    const handle = createCompatApp(makeContext());
    handle.app.viewState("ejercicios").filtro = "guia";
    handle.setContext(makeContext({ slug: "algebra" }));
    expect(handle.app.viewState("ejercicios")).toEqual({});
  });
});

describe("App.viewRoot y `$(\"#main\")`", () => {
  it("sin vista montada no hay raíz", () => {
    const { app } = createCompatApp(makeContext());
    expect(app.viewRoot()).toBeNull();
  });

  it("`$(\"#main\")` resuelve al contenedor de la vista (brecha herr-01)", () => {
    const handle = createCompatApp(makeContext());
    const host = document.createElement("div");
    document.body.appendChild(host);
    handle.setViewRoot(host);
    expect(handle.app.viewRoot()).toBe(host);
    expect(handle.app.$("#main")).toBe(host);
    expect(handle.app.$$("#main")).toEqual([host]);
    host.remove();
    /* Ya desmontado, deja de ser la raíz: nadie dibuja fuera del documento. */
    expect(handle.app.viewRoot()).toBeNull();
    expect(handle.app.$("#main")).toBeNull();
  });
});

describe("App.scrollFor — memoria de scroll por ruta", () => {
  it("anota lo que scrollea el contenedor del shell y lo devuelve para esa ruta", () => {
    at("/m/proba/t/ejercicios");
    const rt = installRuntime(makeContext());
    expect(rt.App.scrollFor()).toBeUndefined();

    const main = document.createElement("div");
    document.body.appendChild(main);
    Object.defineProperty(main, "scrollTop", { value: 420, configurable: true });
    main.dispatchEvent(new Event("scroll"));

    expect(rt.App.scrollFor()).toBe(420);
    /* Otra ruta no hereda la posición de esta. */
    expect(rt.App.scrollFor("#/calc")).toBeUndefined();
    main.remove();
  });
});

describe("App.onTeardown y App.registerSearchProvider", () => {
  it("los limpiadores registrados fuera de un bundle corren al desinstalar", () => {
    const rt = installRuntime(makeContext());
    const limpio = vi.fn();
    rt.App.onTeardown(limpio);
    expect(limpio).not.toHaveBeenCalled();
    uninstallRuntime();
    expect(limpio).toHaveBeenCalledTimes(1);
  });

  it("un limpiador que falla no impide que corran los demás", () => {
    const rt = installRuntime(makeContext());
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const segundo = vi.fn();
    rt.App.onTeardown(() => {
      throw new Error("ruidoso");
    });
    rt.App.onTeardown(segundo);
    uninstallRuntime();
    expect(segundo).toHaveBeenCalledTimes(1);
  });

  it("los proveedores de búsqueda quedan a la vista del shell", () => {
    const rt = installRuntime(makeContext());
    const provider = () => [{ label: "Ejercicio 4.2", target: "#/ejercicios/4.2" }];
    rt.App.registerSearchProvider(provider);
    expect(rt.searchProviders()).toEqual([provider]);
    uninstallRuntime();
  });
});

describe("App.registerProgressProvider y App.progressChanged", () => {
  it("sin proveedores, la lista está vacía: el progreso son solo páginas", () => {
    const rt = installRuntime(makeContext());
    expect(rt.progressProviders()).toEqual([]);
    uninstallRuntime();
  });

  it("el proveedor registrado queda a la vista del anfitrión", () => {
    const rt = installRuntime(makeContext());
    const provider = {
      id: "ejercicios",
      label: "ejercicios",
      stepsOf: (u: string) => [{ id: u + "-1", label: "Ejercicio 1", done: true, group: "Guía" }],
    };
    rt.App.registerProgressProvider(provider);
    expect(rt.progressProviders()).toEqual([provider]);
    expect(rt.progressProviders()[0]!.stepsOf("3")).toEqual([
      { id: "3-1", label: "Ejercicio 1", done: true, group: "Guía" },
    ]);
    uninstallRuntime();
  });

  it("progressChanged avisa a los suscriptores hasta que se sueltan", () => {
    const rt = installRuntime(makeContext());
    const avisos = vi.fn();
    const off = rt.onProgressChange(avisos);
    rt.App.progressChanged();
    rt.App.progressChanged();
    expect(avisos).toHaveBeenCalledTimes(2);
    off();
    rt.App.progressChanged();
    expect(avisos).toHaveBeenCalledTimes(2);
    uninstallRuntime();
  });

  it("un suscriptor que falla no le tapa el aviso a los demás", () => {
    const rt = installRuntime(makeContext());
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const segundo = vi.fn();
    rt.onProgressChange(() => {
      throw new Error("ruidoso");
    });
    rt.onProgressChange(segundo);
    rt.App.progressChanged();
    expect(segundo).toHaveBeenCalledTimes(1);
    uninstallRuntime();
  });

  it("desinstalar el runtime olvida proveedores y suscriptores", () => {
    const rt = installRuntime(makeContext());
    const avisos = vi.fn();
    rt.onProgressChange(avisos);
    rt.App.registerProgressProvider({ id: "x", label: "x", stepsOf: () => [] });
    expect(rt.progressProviders()).toHaveLength(1);
    uninstallRuntime();
    expect(rt.progressProviders()).toEqual([]);
    rt.App.progressChanged();
    expect(avisos).not.toHaveBeenCalled();
  });
});

describe("App.markActivity, App.setTitle y las fechas", () => {
  it("markActivity y setTitle le hablan al anfitrión", () => {
    const marks: number[] = [];
    const titles: string[] = [];
    const { app } = createCompatApp(
      makeContext({ markActivity: () => marks.push(1), setTitle: (t: string) => titles.push(t) }),
    );
    app.markActivity();
    app.setTitle("Calculadoras");
    expect(marks).toHaveLength(1);
    expect(titles).toEqual(["Calculadoras"]);
  });

  it("sin anfitrión que las atienda, no rompen nada", () => {
    const { app } = createCompatApp(makeContext());
    expect(() => {
      app.markActivity();
      app.setTitle("Calculadoras");
    }).not.toThrow();
  });

  it("localToday da el día LOCAL y today el UTC", () => {
    const { app } = createCompatApp(makeContext());
    /* 31 de diciembre a las 21:00 en un huso al oeste: el día UTC ya es otro. */
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 11, 31, 21, 0, 0));
    const local = app.localToday();
    expect(local).toBe("2026-12-31");
    expect(app.today()).toBe(new Date().toISOString().slice(0, 10));
    vi.useRealTimers();
  });
});

describe("App.go — redibujo cuando solo cambia la consulta", () => {
  it("isQueryOnlyChange distingue el cambio de consulta del de argumento", () => {
    const aqui = { pathname: "/m/proba/t/formularios", search: "?arg=5" };
    /* Misma vista y mismo argumento, otra consulta: hay que redibujar. */
    expect(isQueryOnlyChange("proba", "/m/proba/t/formularios?arg=5&sel=1", aqui)).toBe(true);
    /* Cambia el ARGUMENTO: lo atiende el host sin desmontar (herr-13). */
    expect(isQueryOnlyChange("proba", "/m/proba/t/formularios?arg=6", aqui)).toBe(false);
    /* Cambia la VISTA: montaje nuevo. */
    expect(isQueryOnlyChange("proba", "/m/proba/t/ejercicios?arg=5&sel=1", aqui)).toBe(false);
    /* La misma ruta exacta no borra lo que la vista tenga cargado. */
    expect(isQueryOnlyChange("proba", "/m/proba/t/formularios?arg=5", aqui)).toBe(false);
  });

  it("decide igual con el sitio colgado de un base (N0-59)", () => {
    /* Es el caso de producción: `/Sinapsis/m/cripto/t/parciales`. Sin descontar
       el base, las dos rutas se leían como la vista «Sinapsis» con el mismo
       argumento vacío y el redibujo no se pedía nunca. */
    const aqui = { pathname: "/Sinapsis/m/cripto/t/parciales", search: "" };
    expect(isQueryOnlyChange("cripto", "/Sinapsis/m/cripto/t/parciales?orden=parcial", aqui)).toBe(true);
    expect(isQueryOnlyChange("cripto", "/Sinapsis/m/cripto/t/parciales", aqui)).toBe(false);
    expect(isQueryOnlyChange("cripto", "/Sinapsis/m/cripto/t/otra?orden=parcial", aqui)).toBe(false);
  });

  it("App.go pide el redibujo al anfitrión solo en ese caso", () => {
    at("/m/proba/t/formularios?arg=5");
    const renders: number[] = [];
    const ctx = makeContext({ render: () => renders.push(1) });
    const { app } = createCompatApp(ctx);

    app.go("#/formularios/5?sel=1");
    expect(ctx.navigated.at(-1)?.path).toBe("/m/proba/t/formularios?arg=5&sel=1");
    expect(renders).toHaveLength(1);

    /* Saltar de sección NO redibuja: el host reinvoca la vista sin desmontarla. */
    app.go("#/formularios/6");
    expect(renders).toHaveLength(1);
  });
});
