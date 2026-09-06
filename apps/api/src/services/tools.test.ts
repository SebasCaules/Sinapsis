/**
 * Unidades del servicio de bundles: dónde caen los archivos, qué rutas se
 * admiten y qué tipo MIME se sirve. Las rutas HTTP se prueban en
 * `routes/tools.test.ts`.
 */
import { describe, expect, it } from "vitest";
import { join, resolve } from "node:path";
import { EnvSchema, type AppEnv } from "../env.js";
import {
  bundleDir,
  checkToolPath,
  contentTypeFor,
  decodeToolFiles,
  MAX_TOOL_BYTES,
  missingManifestFiles,
  resolveInside,
  toolBase,
  toolsRoot,
} from "./tools.js";

const env = (over: Record<string, unknown> = {}): AppEnv =>
  EnvSchema.parse({
    NODE_ENV: "test",
    SESSION_SECRET: "secreto-de-pruebas-suficientemente-largo",
    SYNC_TOKEN: "token-de-sync-de-pruebas",
    ...over,
  });

describe("ubicación de los bundles", () => {
  it("por defecto, `tools/` al lado del archivo de la base", () => {
    expect(toolsRoot(env({ DATABASE_URL: "file:./data/sinapsis.db" }))).toBe(
      resolve(process.cwd(), "data", "tools"),
    );
    expect(toolsRoot(env({ DATABASE_URL: "file:/var/lib/sinapsis/db.sqlite" }))).toBe(
      "/var/lib/sinapsis/tools",
    );
  });

  it("TOOLS_DIR pisa el valor por defecto", () => {
    expect(toolsRoot(env({ TOOLS_DIR: "/srv/bundles" }))).toBe("/srv/bundles");
  });

  it("con una base sin archivo cae en ./data/tools", () => {
    expect(toolsRoot(env({ DATABASE_URL: "file::memory:" }))).toBe(resolve(process.cwd(), "data", "tools"));
    expect(toolsRoot(env({ DATABASE_URL: "libsql://x.turso.io" }))).toBe(
      resolve(process.cwd(), "data", "tools"),
    );
  });

  it("la carpeta es <raíz>/<subject_id>/<tool_id>", () => {
    expect(bundleDir(env({ TOOLS_DIR: "/srv/bundles" }), "s1", "explorador")).toBe(
      join("/srv/bundles", "s1", "explorador"),
    );
  });

  it("resolveInside deja pasar lo de adentro y frena lo de afuera", () => {
    expect(resolveInside("/srv/b", "app.js")).toBe("/srv/b/app.js");
    expect(resolveInside("/srv/b", "sub/app.js")).toBe("/srv/b/sub/app.js");
    expect(resolveInside("/srv/b", "../app.js")).toBeNull();
    expect(resolveInside("/srv/b", "sub/../../app.js")).toBeNull();
    expect(resolveInside("/srv/b", "/etc/passwd")).toBeNull();
    expect(resolveInside("/srv/b", ".")).toBeNull();
    // Un hermano con el mismo prefijo de texto no es "adentro".
    expect(resolveInside("/srv/b", "../b-otro/app.js")).toBeNull();
  });
});

describe("rutas y tipos", () => {
  it("acepta las rutas normalizadas del contrato", () => {
    for (const path of ["app.js", "estilos/app.css", "img/a/b.png", "_privado.json"]) {
      expect(checkToolPath(path), path).toBeNull();
    }
  });

  it("rechaza «..», raíz, extensión desconocida y rutas sin normalizar", () => {
    for (const path of ["../x.js", "/x.js", "x.exe", "a/./b.js", "a//b.js", "a/../b.js"]) {
      expect(checkToolPath(path), path).not.toBeNull();
    }
  });

  it("la base de las URLs no lleva barra final", () => {
    expect(toolBase("demo", "explorador")).toBe("/api/subjects/demo/tools/explorador/files");
    expect(`${toolBase("demo", "explorador")}/estilos/app.css`).toBe(
      "/api/subjects/demo/tools/explorador/files/estilos/app.css",
    );
  });

  it("mapea las extensiones a su MIME", () => {
    expect(contentTypeFor("a.js")).toContain("text/javascript");
    expect(contentTypeFor("a.mjs")).toContain("text/javascript");
    expect(contentTypeFor("a.CSS")).toContain("text/css");
    expect(contentTypeFor("a.json")).toContain("application/json");
    expect(contentTypeFor("a.svg")).toBe("image/svg+xml");
    expect(contentTypeFor("a.woff2")).toBe("font/woff2");
    expect(contentTypeFor("a.desconocida")).toBe("application/octet-stream");
  });
});

describe("decodificación del push", () => {
  const root = "/srv/bundles/s1/t1";

  it("decodifica utf8 y base64", () => {
    const out = decodeToolFiles(
      [
        { path: "a.js", encoding: "utf8", content: "ñ" },
        { path: "b.png", encoding: "base64", content: Buffer.from([1, 2, 3]).toString("base64") },
      ],
      root,
    );
    expect(out[0]?.data.byteLength).toBe(2);
    expect([...(out[1]?.data ?? [])]).toEqual([1, 2, 3]);
  });

  it("corta en el tope de 20 MB", () => {
    expect(() =>
      decodeToolFiles([{ path: "a.js", encoding: "utf8", content: "a".repeat(MAX_TOOL_BYTES + 1) }], root),
    ).toThrowError();
    expect(
      decodeToolFiles([{ path: "a.js", encoding: "utf8", content: "a".repeat(MAX_TOOL_BYTES) }], root),
    ).toHaveLength(1);
  });

  it("nombra los archivos del manifiesto que faltan, sin repetir", () => {
    const manifest = {
      id: "t1",
      title: "T",
      version: "1",
      runtime: 1 as const,
      scripts: ["a.js", "falta.js"],
      styles: ["falta.js"],
      views: [],
      figures: false,
      data: ["d.json"],
    };
    expect(missingManifestFiles(manifest, new Set(["a.js"]))).toEqual(["falta.js", "d.json"]);
    expect(missingManifestFiles(manifest, new Set(["a.js", "falta.js", "d.json"]))).toEqual([]);
  });
});
