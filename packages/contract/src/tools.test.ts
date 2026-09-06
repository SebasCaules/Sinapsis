/**
 * Tests del contrato de herramientas (Sprint 3, decisiones N0-41 y N0-42).
 *
 * Un bundle de herramientas viaja desde el repositorio de una materia —que puede
 * ser ajeno— hasta el API, y sus archivos se sirven después bajo el origen de la
 * plataforma. Por eso lo que más se prueba acá es la contención de `ToolFilePath`:
 * ninguna ruta puede escapar de la carpeta del bundle ni traer una extensión que
 * el navegador interprete de forma inesperada.
 */
import { sitePaths, siteToolBase } from "./site.js";
import { describe, expect, it } from "vitest";
import {
  RUNTIME_VERSION,
  ToolFilePath,
  ToolInfo,
  ToolManifest,
  ToolPush,
  type ToolManifestInput,
} from "./index.js";

/** Manifiesto mínimo pero realista: una vista, una figura y un JSON de datos. */
const manifest: ToolManifestInput = {
  id: "proba-tools",
  title: "Herramientas de Probabilidad",
  version: "1.0.0",
  description: "Explorador de distribuciones, calculadoras y las 92 figuras del wiki.",
  scripts: ["lib-math.js", "figures/plot.js", "views/explorador.js"],
  styles: ["tools.css"],
  views: [{ id: "explorador", label: "Explorador de distribuciones", icon: "compass" }],
  figures: true,
  data: ["data/study-data.json"],
};

describe("ToolManifest", () => {
  it("valida un manifiesto completo y aplica los valores por defecto", () => {
    const parsed = ToolManifest.parse(manifest);

    expect(parsed.id).toBe("proba-tools");
    expect(parsed.runtime).toBe(RUNTIME_VERSION);
    expect(parsed.scripts).toEqual(["lib-math.js", "figures/plot.js", "views/explorador.js"]);
    expect(parsed.figures).toBe(true);
    // `layout` de una vista y las listas ausentes se completan solas.
    expect(parsed.views[0]).toEqual({
      id: "explorador",
      label: "Explorador de distribuciones",
      icon: "compass",
      layout: "wide",
    });
  });

  it("un manifiesto sin listas es válido: el bundle puede aportar solo figuras", () => {
    const parsed = ToolManifest.parse({ id: "figuras", title: "Figuras", version: "0.1.0", figures: true });
    expect(parsed).toMatchObject({ scripts: [], styles: [], views: [], data: [], figures: true });
  });

  it("`progress` es opcional y por omisión falso: solo lo declara quien suma pasos a la barra", () => {
    expect(ToolManifest.parse(manifest).progress).toBe(false);
    const declara = ToolManifest.parse({ ...manifest, progress: true });
    expect(declara.progress).toBe(true);
    expect(() => ToolManifest.parse({ ...manifest, progress: "sí" })).toThrow();
  });

  it("rechaza el id que no es un identificador de ruta y la versión de runtime ajena", () => {
    expect(() => ToolManifest.parse({ ...manifest, id: "Proba Tools" })).toThrow();
    expect(() => ToolManifest.parse({ ...manifest, id: "1-tools" })).toThrow();
    expect(() => ToolManifest.parse({ ...manifest, runtime: 2 })).toThrow();
    expect(() => ToolManifest.parse({ ...manifest, views: [{ id: "X", label: "Mal" }] })).toThrow();
  });

  it("rechaza una ruta con «..» dentro del manifiesto, no solo en el esquema suelto", () => {
    expect(() => ToolManifest.parse({ ...manifest, scripts: ["../../.ssh/id_rsa.js"] })).toThrow(/\.\./);
    expect(() => ToolManifest.parse({ ...manifest, data: ["datos/../../secreto.json"] })).toThrow(/\.\./);
  });
});

describe("ToolFilePath", () => {
  it("acepta rutas relativas con subcarpetas y las extensiones del contrato", () => {
    for (const ok of [
      "index.js",
      "lib/math.mjs",
      "estilos/tools.css",
      "data/study-data.json",
      "img/normal.svg",
      "img/histograma.png",
      "fuentes/inter.woff2",
      "notas.md",
      "tabla.csv",
      "_privado/util.js",
    ]) {
      expect(ToolFilePath.safeParse(ok).success, ok).toBe(true);
    }
  });

  it("rechaza cualquier ruta que se salga de la carpeta del bundle", () => {
    for (const bad of [
      "../secreto.js",
      "a/../../secreto.js",
      "..",
      "../",
      "/etc/passwd.js",
      "/index.js",
      "./index.js", // empieza con «.»: la clase inicial no lo admite
      "~/index.js",
      "C:/tmp/x.js",
      "a//..//b.js",
    ]) {
      expect(ToolFilePath.safeParse(bad).success, bad).toBe(false);
    }
  });

  it("exige rutas normalizadas: sin «./», sin «//» y sin barra final", () => {
    for (const bad of ["a/./b.js", "a//b.js", "css/", "a/b/", "./a.js"]) {
      expect(ToolFilePath.safeParse(bad).success, bad).toBe(false);
    }
    // La normalización es de forma, no de contenido: un punto dentro del nombre vale.
    expect(ToolFilePath.safeParse("lib/math.min.js").success).toBe(true);
    expect(ToolFilePath.safeParse("a/b.c/d.js").success).toBe(true);
  });

  it("rechaza las extensiones que no están en el contrato (y la ausencia de extensión)", () => {
    for (const bad of [
      "index.html",
      "index.htm",
      "app.wasm",
      "script.js.map",
      "Makefile",
      "index.JS.txt.exe",
      "datos.yaml",
      "estilos.scss",
      "index.ts",
    ]) {
      expect(ToolFilePath.safeParse(bad).success, bad).toBe(false);
    }
    // La comprobación de extensión no distingue mayúsculas.
    expect(ToolFilePath.safeParse("Figura.SVG").success).toBe(true);
  });
});

describe("ToolPush y ToolInfo", () => {
  it("un push lleva el manifiesto y al menos un archivo, en utf8 o base64", () => {
    const push = ToolPush.parse({
      manifest,
      files: [
        { path: "views/explorador.js", content: "(function(){ App.registerView('explorador', function(){}); })();" },
        { path: "img/normal.png", encoding: "base64", content: "iVBORw0KGgo=" },
      ],
    });
    expect(push.files[0]!.encoding).toBe("utf8");
    expect(push.files[1]!.encoding).toBe("base64");
    expect(() => ToolPush.parse({ manifest, files: [] })).toThrow();
  });

  it("ToolInfo describe lo que la web necesita para cargar el bundle", () => {
    const info = ToolInfo.parse({
      manifest,
      bytes: 12_345,
      updatedAt: "2026-09-06T12:00:00.000Z",
      base: siteToolBase("proba", "proba-tools"),
    });
    expect(info.manifest.id).toBe("proba-tools");
    expect(info.bytes).toBe(12_345);
  });
});

describe("siteToolBase y sitePaths.toolFile", () => {
  it("la base es relativa al sitio y sin barra final: la web compone `${BASE_URL}${base}/${path}`", () => {
    const base = siteToolBase("proba", "proba-tools");
    expect(base).toBe("subjects/proba/tools/proba-tools");
    expect(base.endsWith("/")).toBe(false);
    expect(base.startsWith("/")).toBe(false);
  });

  it("sitePaths arma las URL bajo BASE_URL, con o sin barra final", () => {
    expect(sitePaths.catalog("/")).toBe("/subjects/index.json");
    expect(sitePaths.subject("/Sinapsis/", "proba")).toBe("/Sinapsis/subjects/proba/subject.json");
    expect(sitePaths.pages("/Sinapsis", "proba")).toBe("/Sinapsis/subjects/proba/pages.json");
    expect(sitePaths.tools("/", "proba")).toBe("/subjects/proba/tools.json");
    expect(sitePaths.toolBase("/Sinapsis/", "proba", "proba-tools")).toBe("/Sinapsis/subjects/proba/tools/proba-tools");
    expect(sitePaths.toolFile("/Sinapsis/", "proba", "proba-tools", "views/explorador.js")).toBe(
      "/Sinapsis/subjects/proba/tools/proba-tools/views/explorador.js",
    );
    expect(`${sitePaths.toolBase("/", "proba", "proba-tools")}/a.js`).toBe(sitePaths.toolFile("/", "proba", "proba-tools", "a.js"));
  });
});
