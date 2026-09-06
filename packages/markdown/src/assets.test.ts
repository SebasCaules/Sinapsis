/**
 * Adjuntos de imagen (N0-61).
 *
 * Las dos mitades que importan son las guardas —qué referencia se reconoce y
 * cuál no— y la EQUIVALENCIA entre compilar el vault y compilar la copia
 * publicada: el mismo wiki tiene que dar el mismo `Page.assets` en los dos, que
 * es lo que hace que `site build` no dependa de los archivos originales.
 */
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { SubjectConfig, type SubjectConfig as Cfg } from "@sinapsis/contract";
import {
  ASSET_INDEX_FILE,
  ASSET_INDEX_FORMAT,
  assetFileName,
  capAssets,
  extensionOf,
  imageRefs,
  isAssetIndex,
  isLocalImageRef,
  MAX_SUBJECT_ASSET_BYTES,
} from "./assets.js";
import { compileWiki } from "./compile.js";

const config: Cfg = SubjectConfig.parse({
  slug: "demo",
  name: "Materia de prueba",
  code: "00.00",
  institution: "ITBA",
  division: { singular: "Unidad", abbr: "U", plural: "Unidades" },
  divisions: [{ key: "1", name: "Primera" }],
  pageTypes: [{ key: "concepto", label: "Concepto", plural: "Conceptos", folder: "conceptos" }],
  wiki: { root: "wiki", divisionField: "unidad" },
});

/** Un PNG mínimo, distinto por byte para que el hash cambie. */
function png(seed: number): Buffer {
  return Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, seed]);
}

describe("imageRefs", () => {
  it("encuentra las imágenes del cuerpo, sin repetir y en orden", () => {
    const body = "![uno](../../assets/a.png)\n\ntexto\n\n![dos](b.jpg) y otra vez ![uno](../../assets/a.png)";
    expect(imageRefs(body)).toEqual(["../../assets/a.png", "b.jpg"]);
  });

  it("no mira dentro de un bloque de código ni del código en línea", () => {
    const body = "```md\n![x](a.png)\n```\n\nSe escribe `![alt](ruta.png)` y listo.";
    expect(imageRefs(body)).toEqual([]);
  });

  it("acepta el título opcional de markdown", () => {
    expect(imageRefs('![alt](a.png "Un título")')).toEqual(["a.png"]);
  });
});

describe("isLocalImageRef", () => {
  it("acepta rutas relativas con extensión de imagen", () => {
    expect(isLocalImageRef("../../assets/des-feistel.png")).toBe(true);
    expect(isLocalImageRef("figura.WEBP")).toBe(true);
    expect(isLocalImageRef("a.png#zoom")).toBe(true);
  });

  it("rechaza URLs, protocolos y rutas absolutas", () => {
    for (const ref of [
      "https://example.com/a.png",
      "//cdn.example.com/a.png",
      "data:image/png;base64,AAA",
      "javascript:alert(1)",
      "/assets/a.png",
      "C:\\fotos\\a.png",
    ]) {
      expect(isLocalImageRef(ref), ref).toBe(false);
    }
  });

  it("rechaza lo que no es una imagen", () => {
    expect(isLocalImageRef("../../raw/clase.pdf")).toBe(false);
    expect(extensionOf("a.svg")).toBe("svg");
    expect(extensionOf("a.pdf")).toBeNull();
  });
});

describe("assetFileName", () => {
  it("es estable y depende del contenido", () => {
    expect(assetFileName(png(1), "png")).toBe(assetFileName(png(1), "png"));
    expect(assetFileName(png(1), "png")).not.toBe(assetFileName(png(2), "png"));
    expect(assetFileName(png(1), "png")).toMatch(/^[0-9a-f]{16}\.png$/);
  });
});

describe("capAssets", () => {
  it("corta en el tope de la materia y devuelve lo que quedó afuera", () => {
    const big = { file: "a.png", source: "/a", ref: "a.png", bytes: MAX_SUBJECT_ASSET_BYTES };
    const extra = { file: "b.png", source: "/b", ref: "b.png", bytes: 1024 };
    const { kept, dropped } = capAssets([big, extra]);
    expect(kept).toEqual([big]);
    expect(dropped).toEqual([extra]);
  });
});

describe("isAssetIndex", () => {
  it("solo acepta la forma esperada", () => {
    expect(isAssetIndex({ format: ASSET_INDEX_FORMAT, assets: { "assets/a.png": "ff.png" } })).toBe(true);
    expect(isAssetIndex({ format: 2, assets: {} })).toBe(false);
    expect(isAssetIndex({ format: ASSET_INDEX_FORMAT, assets: [] })).toBe(false);
    expect(isAssetIndex({ format: ASSET_INDEX_FORMAT, assets: { a: 3 } })).toBe(false);
    expect(isAssetIndex(null)).toBe(false);
  });
});

describe("compileWiki · adjuntos", () => {
  let dir: string;
  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), "sinapsis-assets-"));
    await mkdir(path.join(dir, "wiki", "conceptos"), { recursive: true });
    await mkdir(path.join(dir, "assets"), { recursive: true });
  });
  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("resuelve la imagen del vault y le da un nombre con hash", async () => {
    await writeFile(path.join(dir, "assets", "des feistel.png"), png(1));
    await writeFile(
      path.join(dir, "wiki", "conceptos", "des.md"),
      "---\ntitulo: DES\nunidad: 1\nresumen: x\n---\n\n![Feistel](../../assets/des%20feistel.png)\n",
    );
    const out = await compileWiki({ config, rootDir: dir });
    const page = out.payload.pages.find((p) => p.slug === "des");
    expect(page?.assets).toEqual([{ ref: "../../assets/des%20feistel.png", file: assetFileName(png(1), "png") }]);
    expect(out.assets).toHaveLength(1);
    expect(out.assets[0]?.ref).toBe("assets/des feistel.png");
    expect(out.issues).toHaveLength(0);
  });

  it("una materia sin imágenes compila exactamente igual que antes", async () => {
    await writeFile(
      path.join(dir, "wiki", "conceptos", "a.md"),
      "---\ntitulo: A\nunidad: 1\nresumen: x\n---\n\nSin imágenes.\n",
    );
    const out = await compileWiki({ config, rootDir: dir });
    expect(out.assets).toEqual([]);
    expect(out.payload.pages[0]?.assets).toEqual([]);
    expect(out.issues).toHaveLength(0);
  });

  it("avisa y deja intacta la referencia que no existe", async () => {
    await writeFile(
      path.join(dir, "wiki", "conceptos", "a.md"),
      "---\ntitulo: A\nunidad: 1\nresumen: x\n---\n\n![no está](../../assets/falta.png)\n",
    );
    const out = await compileWiki({ config, rootDir: dir });
    expect(out.payload.pages[0]?.assets).toEqual([]);
    expect(out.payload.pages[0]?.body).toContain("![no está](../../assets/falta.png)");
    expect(out.issues.map((i) => i.kind)).toEqual(["asset-missing"]);
    expect(out.warnings.join("\n")).toContain("la imagen se deja como está");
  });

  it("descarta lo que sale de la carpeta de la materia", async () => {
    await writeFile(
      path.join(dir, "wiki", "conceptos", "a.md"),
      "---\ntitulo: A\nunidad: 1\nresumen: x\n---\n\n![afuera](../../../secreto.png)\n",
    );
    const out = await compileWiki({ config, rootDir: dir });
    expect(out.assets).toEqual([]);
    expect(out.issues.map((i) => i.kind)).toEqual(["asset-outside"]);
  });

  it("no toca URLs ni `data:`", async () => {
    await writeFile(
      path.join(dir, "wiki", "conceptos", "a.md"),
      "---\ntitulo: A\nunidad: 1\nresumen: x\n---\n\n![web](https://example.com/a.png)\n\n![mala](data:image/png;base64,AAA)\n",
    );
    const out = await compileWiki({ config, rootDir: dir });
    expect(out.assets).toEqual([]);
    expect(out.issues).toHaveLength(0);
  });

  it("comparte el adjunto entre páginas y lo cuenta una vez", async () => {
    await writeFile(path.join(dir, "assets", "x.png"), png(3));
    for (const slug of ["a", "b"]) {
      await writeFile(
        path.join(dir, "wiki", "conceptos", `${slug}.md`),
        `---\ntitulo: ${slug}\nunidad: 1\nresumen: x\n---\n\n![x](../../assets/x.png)\n`,
      );
    }
    const out = await compileWiki({ config, rootDir: dir });
    expect(out.assets).toHaveLength(1);
    expect(out.payload.pages.map((p) => p.assets.length)).toEqual([1, 1]);
  });

  it("la copia publicada da el mismo resultado leyendo el índice", async () => {
    // Así queda `subjects/<slug>/` después de `publish`: el markdown sigue
    // apuntando a `../../assets/x.png`, pero el archivo se llama `<hash>.png`.
    const file = assetFileName(png(4), "png");
    await writeFile(path.join(dir, "assets", file), png(4));
    await writeFile(
      path.join(dir, "assets", ASSET_INDEX_FILE),
      JSON.stringify({ format: ASSET_INDEX_FORMAT, assets: { "assets/x.png": file } }),
    );
    await writeFile(
      path.join(dir, "wiki", "conceptos", "a.md"),
      "---\ntitulo: A\nunidad: 1\nresumen: x\n---\n\n![x](../../assets/x.png)\n",
    );
    const out = await compileWiki({ config, rootDir: dir });
    expect(out.payload.pages[0]?.assets).toEqual([{ ref: "../../assets/x.png", file }]);
    expect(out.assets[0]?.source).toBe(path.join(dir, "assets", file));
    expect(out.issues).toHaveLength(0);
  });
});
