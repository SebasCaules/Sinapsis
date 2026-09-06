/**
 * §4-B — los globales que el runtime publica mientras hay una materia abierta.
 *
 * `window.katex` es el que el baseline definía desde su `index.html` y el que
 * los bundles asumen: `figures.js` → `putTex` compone con `window.katex` y, sin
 * el global, las trece fórmulas de las figuras de Proba salían como LaTeX crudo
 * dentro de un `<code>`.
 */
import { afterEach, describe, expect, it } from "vitest";
import katex from "katex";
import { installRuntime, uninstallRuntime } from "../src/index.js";
import { makeContext } from "./fixtures.js";

afterEach(() => {
  uninstallRuntime();
  delete (window as { katex?: unknown }).katex;
});

describe("globales del runtime", () => {
  it("publica `window.katex` al instalar y lo retira al desinstalar", () => {
    expect(window.katex).toBeUndefined();

    installRuntime(makeContext());
    expect(window.katex).toBe(katex);
    /* Lo que `putTex` necesita de verdad no es la identidad sino `render`. */
    expect(typeof (window.katex as { render?: unknown }).render).toBe("function");

    uninstallRuntime();
    expect(window.katex).toBeUndefined();
  });

  it("respeta un KaTeX que ya estaba puesto por otro y no se lo lleva", () => {
    const ajeno = { render() {} };
    (window as { katex?: unknown }).katex = ajeno;

    installRuntime(makeContext());
    expect(window.katex).toBe(ajeno);

    uninstallRuntime();
    // no es suyo: el teardown no puede borrarlo
    expect(window.katex).toBe(ajeno);
  });

  it("`App`, `M` y `SinapsisRuntime` siguen yendo y viniendo con el runtime", () => {
    const rt = installRuntime(makeContext());
    expect(window.App).toBe(rt.App);
    expect(window.M).toBe(rt.App.M);
    expect(window.SinapsisRuntime).toBe(rt);

    uninstallRuntime();
    expect(window.App).toBeUndefined();
    expect(window.M).toBeUndefined();
    expect(window.SinapsisRuntime).toBeUndefined();
  });
});
