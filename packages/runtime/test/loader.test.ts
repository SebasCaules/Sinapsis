import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createCompatApp, type RuntimeApp } from "../src/compat.js";
import { createLoader, dataKey, resolveUrl } from "../src/loader.js";
import { makeContext } from "./fixtures.js";

/**
 * jsdom no ejecuta scripts externos: se simula el ciclo de vida de la etiqueta
 * (`load` / `error`) y se corre el «contenido» del script desde un registro,
 * que es lo que hace falta para probar el ENCADENADO y la atribución.
 */
function stubScripts(code: Record<string, (app: RuntimeApp) => void>, app: RuntimeApp) {
  const orden: string[] = [];
  const real = document.head.appendChild.bind(document.head);
  const spy = vi
    .spyOn(document.head, "appendChild")
    .mockImplementation(((node: Node) => {
      const out = real(node as never);
      const el = node as HTMLElement;
      if (el.tagName === "SCRIPT") {
        const src = el.getAttribute("src") || "";
        orden.push(src);
        queueMicrotask(() => {
          const run = code[src];
          if (!run) {
            el.dispatchEvent(new Event("error"));
            return;
          }
          try {
            run(app);
            el.dispatchEvent(new Event("load"));
          } catch {
            el.dispatchEvent(new Event("error"));
          }
        });
      }
      return out;
    }) as typeof document.head.appendChild);
  return { orden, restore: () => spy.mockRestore() };
}

function stubFetch(files: Record<string, unknown>) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) => {
      if (!(url in files)) return { ok: false, status: 404, json: async () => ({}) } as unknown as Response;
      return { ok: true, status: 200, json: async () => files[url] } as unknown as Response;
    }),
  );
}

const BASE = "/api/subjects/proba/tools/figuras/files/";

let app: RuntimeApp;

beforeEach(() => {
  app = createCompatApp(makeContext()).app;
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  document.head.querySelectorAll("[data-bundle]").forEach((n) => n.remove());
});

describe("resolveUrl / dataKey", () => {
  it("une base y archivo, y respeta lo absoluto", () => {
    expect(resolveUrl(BASE, "figuras.js")).toBe(BASE + "figuras.js");
    expect(resolveUrl("/base", "a.js")).toBe("/base/a.js");
    expect(resolveUrl(BASE, "/otro/a.js")).toBe("/otro/a.js");
    expect(resolveUrl(BASE, "https://cdn/a.js")).toBe("https://cdn/a.js");
  });
  it("la clave de datos es el nombre sin extensión", () => {
    expect(dataKey("data/study-data.json")).toBe("study-data");
    expect(dataKey("tablas.json")).toBe("tablas");
  });
});

describe("loadBundle", () => {
  it("carga datos, estilos y scripts EN ORDEN", async () => {
    stubFetch({
      [BASE + "study-data.json"]: { DISTS: [{ id: "normal" }] },
      [BASE + "tablas.json"]: { z: [1.96] },
    });
    const visto: string[] = [];
    const { orden, restore } = stubScripts(
      {
        [BASE + "figures-u1.js"]: (a) => {
          visto.push("u1");
          a.registerFigure("u1-dado", () => undefined);
        },
        [BASE + "figures-u2.js"]: (a) => {
          // el segundo script ve lo que registró el primero: eso es el encadenado
          visto.push(Object.keys(a.FIGURES).join(","));
          a.registerView("explorador", () => undefined);
        },
      },
      app,
    );
    const loader = createLoader(app);
    await loader.loadBundle({
      id: "figuras",
      base: BASE,
      data: ["study-data.json", "tablas.json"],
      styles: ["figures.css"],
      scripts: ["figures-u1.js", "figures-u2.js"],
    });
    restore();

    expect(orden).toEqual([BASE + "figures-u1.js", BASE + "figures-u2.js"]);
    expect(visto).toEqual(["u1", "u1-dado"]);
    expect(app.DATA["tablas"]).toEqual({ z: [1.96] });
    expect(app.DATA["study-data"]).toEqual({ DISTS: [{ id: "normal" }] });
    // study-data.json además se funde en App.STUDY
    expect(app.STUDY["DISTS"]).toEqual([{ id: "normal" }]);
    const link = document.head.querySelector('link[data-bundle="figuras"]') as HTMLLinkElement;
    expect(link).not.toBeNull();
    expect(link.getAttribute("href")).toBe(BASE + "figures.css");
    expect(loader.isLoaded("figuras")).toBe(true);
  });

  it("es idempotente por id", async () => {
    stubFetch({});
    const { orden, restore } = stubScripts({ [BASE + "a.js"]: () => undefined }, app);
    const loader = createLoader(app);
    const info = { id: "tools", base: BASE, data: [], styles: [], scripts: ["a.js"] };
    await Promise.all([loader.loadBundle(info), loader.loadBundle(info)]);
    await loader.loadBundle(info);
    restore();
    expect(orden).toEqual([BASE + "a.js"]);
    expect(loader.ids()).toEqual(["tools"]);
  });

  it("un script que falla corta la carga y nombra la URL", async () => {
    stubFetch({});
    const { orden, restore } = stubScripts(
      { [BASE + "ok.js"]: () => undefined }, // "roto.js" no está: dispara error
      app,
    );
    const loader = createLoader(app);
    await expect(
      loader.loadBundle({ id: "tools", base: BASE, data: [], styles: [], scripts: ["ok.js", "roto.js", "nunca.js"] }),
    ).rejects.toThrow(/roto\.js/);
    restore();
    expect(orden).toEqual([BASE + "ok.js", BASE + "roto.js"]);
    // el bundle fallido no queda cargado: se puede reintentar
    expect(loader.isLoaded("tools")).toBe(false);
    expect(document.head.querySelector('script[data-bundle="tools"]')).toBeNull();
  });

  it("un script que falla NO deja registrado lo de los scripts anteriores", async () => {
    /* AC-12: al fallar, la entrada del bundle desaparece, así que `unloadBundle`
       ya no puede limpiar nada. Si el `catch` no borra lo registrado, la vista y
       la figura del primer script quedan colgadas en el `App` para siempre. */
    stubFetch({ [BASE + "tablas.json"]: { z: [1.96] } });
    const { restore } = stubScripts(
      {
        [BASE + "ok.js"]: (a) => {
          a.registerView("explorador", () => undefined);
          a.registerFigure("u1-dado", () => undefined);
        },
      }, // "roto.js" no está: dispara error
      app,
    );
    const loader = createLoader(app);
    /* Una figura de otro origen: la limpieza no puede llevársela puesta. */
    app.registerFigure("suelta", () => undefined);

    await expect(
      loader.loadBundle({
        id: "tools",
        base: BASE,
        data: ["tablas.json"],
        styles: [],
        scripts: ["ok.js", "roto.js"],
      }),
    ).rejects.toThrow(/roto\.js/);
    restore();

    expect(Object.keys(app.VIEWS)).not.toContain("explorador");
    expect(Object.keys(app.FIGURES)).not.toContain("u1-dado");
    expect(app.view("explorador")).toBeNull();
    expect(app.DATA["tablas"]).toBeUndefined();
    expect(app.FIGURES["suelta"]).toBeDefined();
  });

  it("un JSON que responde mal aborta con el status", async () => {
    stubFetch({});
    const loader = createLoader(app);
    await expect(
      loader.loadBundle({ id: "tools", base: BASE, data: ["falta.json"], styles: [], scripts: [] }),
    ).rejects.toThrow(/HTTP 404/);
  });

  it("unloadBundle quita estilos, vistas y figuras del bundle", async () => {
    stubFetch({});
    const { restore } = stubScripts(
      {
        [BASE + "a.js"]: (a) => {
          a.registerView("explorador", () => undefined);
          a.registerFigure("u1-dado", () => undefined);
        },
      },
      app,
    );
    const loader = createLoader(app);
    await loader.loadBundle({ id: "tools", base: BASE, data: [], styles: ["t.css"], scripts: ["a.js"] });
    restore();
    // otra figura, registrada FUERA del bundle: no se toca
    app.registerFigure("suelta", () => undefined);

    expect(app.view("explorador")).not.toBeNull();
    loader.unloadBundle("tools");
    expect(app.view("explorador")).toBeNull();
    expect(app.FIGURES["u1-dado"]).toBeUndefined();
    expect(app.FIGURES["suelta"]).toBeDefined();
    expect(document.head.querySelector('link[data-bundle="tools"]')).toBeNull();
    expect(loader.isLoaded("tools")).toBe(false);
  });
});
