/**
 * La costura con el runtime: dónde quedan los archivos de un bundle.
 *
 * `tools.json` los declara con una base RELATIVA al sitio y el prefijo
 * `BASE_URL` se pone en un solo lugar —acá—, así el mismo archivo sirve en
 * desarrollo (`/`) y en GitHub Pages (`/Sinapsis/`).
 */
import { describe, expect, it } from "vitest";
import { RUNTIME_VERSION, type ToolInfo } from "@sinapsis/contract";
import { siteToolBase } from "@sinapsis/contract/site";
import { bundleOf, versionStamp, withBase, withVersion } from "./runtime";

function info(base: string): ToolInfo {
  return {
    manifest: {
      id: "figuras",
      title: "Figuras",
      version: "1.0.0",
      runtime: RUNTIME_VERSION,
      scripts: ["figuras.js"],
      styles: ["figuras.css"],
      views: [],
      figures: true,
      progress: false,
      data: ["data/valores.json"],
    },
    bytes: 100,
    updatedAt: "2026-09-05T10:00:00.000Z",
    base,
  };
}

describe("withBase", () => {
  it("antepone la base del sitio a una ruta relativa", () => {
    expect(withBase("subjects/proba/tools/figuras")).toBe("/subjects/proba/tools/figuras");
  });

  it("no deja barras dobles ni barra final", () => {
    expect(withBase("/subjects/proba/tools/figuras/")).toBe("/subjects/proba/tools/figuras");
  });

  it("deja pasar lo que ya es absoluto (una URL, un `blob:` del modo mock)", () => {
    expect(withBase("https://ejemplo.test/x")).toBe("https://ejemplo.test/x");
    expect(withBase("blob:http://localhost/abc")).toBe("blob:http://localhost/abc");
  });
});

describe("bundleOf", () => {
  it("arma la base con la que trae el archivo del sitio", () => {
    expect(bundleOf("proba", info(siteToolBase("proba", "figuras"))).base).toBe("/subjects/proba/tools/figuras");
  });

  it("sin base, la deduce igual que la escribió `site build`", () => {
    expect(bundleOf("proba", info("")).base).toBe("/subjects/proba/tools/figuras");
  });

  it("copia lo que el manifiesto declara y sella cada archivo con la fecha del build", () => {
    const bundle = bundleOf("proba", info("subjects/proba/tools/figuras"));
    expect(bundle).toMatchObject({
      id: "figuras",
      scripts: ["figuras.js?v=20260905100000"],
      styles: ["figuras.css?v=20260905100000"],
      data: ["data/valores.json?v=20260905100000"],
    });
  });

  it("el sello no toca URL absolutas y respeta una query previa", () => {
    expect(withVersion("https://cdn.example/x.js", "1")).toBe("https://cdn.example/x.js");
    expect(withVersion("/ya/absoluta.js", "1")).toBe("/ya/absoluta.js");
    expect(withVersion("a.js?x=1", "2")).toBe("a.js?x=1&v=2");
    expect(withVersion("a.js", "")).toBe("a.js");
    expect(versionStamp("2026-09-06T20:40:25.580Z")).toBe("20260906204025");
  });
});
