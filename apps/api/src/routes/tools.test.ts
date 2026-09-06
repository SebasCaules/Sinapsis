/**
 * Bundles de herramientas (Sprint 3 · A4).
 *
 * Cubre las dos autenticaciones (token de sync para publicar, sesión para
 * leer), la validación del push (id, referencias del manifiesto, rutas, tope de
 * 20 MB), la atomicidad del reemplazo y el servicio de archivos con su
 * Content-Type, su ETag y su 304.
 */
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { RUNTIME_VERSION, type ToolInfo, type ToolManifestInput } from "@sinapsis/contract";
import { createHarness, type Harness } from "../test/harness.js";
import { demoPayload } from "../test/fixtures.js";
import { bundleDir, MAX_TOOL_BYTES, toolsRoot } from "../services/tools.js";
import { subjects } from "../db/schema.js";

/** 1×1 PNG transparente, para probar un archivo binario de verdad. */
const PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

function manifest(overrides: Partial<ToolManifestInput> = {}): ToolManifestInput {
  return {
    id: "explorador",
    title: "Explorador de distribuciones",
    version: "1.0.0",
    runtime: RUNTIME_VERSION,
    scripts: ["app.js"],
    styles: ["estilos/app.css"],
    views: [{ id: "explorador", label: "Explorador" }],
    figures: false,
    data: ["datos/study-data.json"],
    ...overrides,
  };
}

const files = [
  { path: "app.js", content: "window.App.registerView('explorador', () => {});" },
  { path: "estilos/app.css", content: ".explorador { color: red; }" },
  { path: "datos/study-data.json", content: '{"n":1}' },
  { path: "img/icono.png", encoding: "base64" as const, content: PNG_BASE64 },
];

describe("bundles de herramientas", () => {
  let h: Harness;
  let subjectId: string;

  const auth = () => ({ authorization: `Bearer ${h.env.SYNC_TOKEN}` });

  const push = (body: unknown, id = "explorador", token: string | null = "sync") =>
    h.json(
      "PUT",
      `/api/subjects/demo/tools/${id}`,
      body,
      token === null ? {} : { authorization: `Bearer ${token === "sync" ? h.env.SYNC_TOKEN : token}` },
    );

  const list = async (): Promise<ToolInfo[]> =>
    (await (await h.request("/api/subjects/demo/tools")).json()) as ToolInfo[];

  beforeAll(async () => {
    h = await createHarness();
    await h.login();
    const synced = await h.json("PUT", "/api/subjects/demo/sync", demoPayload(), auth());
    expect(synced.status).toBe(200);
    subjectId = (await h.db.select({ id: subjects.id }).from(subjects))[0]?.id ?? "";
    expect(subjectId).not.toBe("");
  });

  afterAll(() => h.close());

  // -------------------------------------------------------------------------
  // Autenticación
  // -------------------------------------------------------------------------

  it("publicar exige el token de sync", async () => {
    expect((await push({ manifest: manifest(), files }, "explorador", null)).status).toBe(401);
    expect((await push({ manifest: manifest(), files }, "explorador", "token-mal")).status).toBe(401);
    const del = await h.json("DELETE", "/api/subjects/demo/tools/explorador", undefined, {});
    expect(del.status).toBe(401);
  });

  it("leer exige sesión", async () => {
    const anon = await createHarness();
    expect((await anon.request("/api/subjects/demo/tools")).status).toBe(401);
    expect((await anon.request("/api/subjects/demo/tools/explorador/files/app.js")).status).toBe(401);
    anon.close();
  });

  it("la materia tiene que existir", async () => {
    const res = await push({ manifest: manifest(), files }, "explorador");
    expect(res.status).toBe(201);
    const otra = await h.json(
      "PUT",
      "/api/subjects/fantasma/tools/explorador",
      { manifest: manifest(), files },
      auth(),
    );
    expect(otra.status).toBe(404);
  });

  // -------------------------------------------------------------------------
  // Push
  // -------------------------------------------------------------------------

  it("un push válido devuelve 201 la primera vez y 200 al reemplazar", async () => {
    const first = await push({ manifest: manifest(), files });
    // El bundle ya existe desde el test anterior: acá se está reemplazando.
    expect(first.status).toBe(200);
    const info = (await first.json()) as ToolInfo;
    expect(info.base).toBe("/api/subjects/demo/tools/explorador/files");
    expect(info.manifest.id).toBe("explorador");
    expect(info.manifest.runtime).toBe(RUNTIME_VERSION);
    expect(info.bytes).toBeGreaterThan(0);
    expect(Date.parse(info.updatedAt)).not.toBeNaN();

    const second = await push({ manifest: manifest({ id: "taller", title: "Taller" }), files }, "taller");
    expect(second.status).toBe(201);
  });

  it("el id del manifiesto tiene que coincidir con el de la URL", async () => {
    const res = await push({ manifest: manifest({ id: "otro" }), files });
    expect(res.status).toBe(400);
    expect(((await res.json()) as { error: string }).error).toContain("no coincide");
  });

  it("rechaza un manifiesto que declara archivos ausentes, y los nombra", async () => {
    const res = await push({
      manifest: manifest({ scripts: ["app.js", "falta.js"], data: ["datos/no-esta.json"] }),
      files,
    });
    expect(res.status).toBe(400);
    const { error } = (await res.json()) as { error: string };
    expect(error).toBe(
      "El manifiesto declara archivos que no vienen en el bundle: falta.js, datos/no-esta.json",
    );
  });

  it("rechaza rutas con «..», absolutas o sin normalizar", async () => {
    for (const path of ["../fuera.js", "a/../../fuera.js", "/etc/passwd.js"]) {
      const res = await push({
        manifest: manifest({ scripts: [], styles: [], data: [] }),
        files: [{ path, content: "x" }],
      });
      expect(res.status, path).toBe(400);
    }
    const raro = await push({
      manifest: manifest({ scripts: [], styles: [], data: [] }),
      files: [{ path: "a/./b.js", content: "x" }],
    });
    expect(raro.status).toBe(400);
    expect(((await raro.json()) as { error: string }).error).toContain("normalizada");
  });

  it("rechaza rutas repetidas y base64 inválido", async () => {
    const repetido = await push({
      manifest: manifest({ scripts: [], styles: [], data: [] }),
      files: [
        { path: "a.js", content: "1" },
        { path: "a.js", content: "2" },
      ],
    });
    expect(repetido.status).toBe(400);
    expect(((await repetido.json()) as { error: string }).error).toContain("repetido");

    const base64 = await push({
      manifest: manifest({ scripts: [], styles: [], data: [] }),
      files: [{ path: "a.png", encoding: "base64", content: "no-es-base64-!!" }],
    });
    expect(base64.status).toBe(400);
  });

  it("rechaza un bundle de más de 20 MB con 413", async () => {
    const res = await push({
      manifest: manifest({ scripts: ["grande.js"], styles: [], data: [] }),
      files: [{ path: "grande.js", content: "a".repeat(MAX_TOOL_BYTES + 1) }],
    });
    expect(res.status).toBe(413);
    expect(((await res.json()) as { error: string }).error).toContain("20 MB");
  });

  // -------------------------------------------------------------------------
  // Listado
  // -------------------------------------------------------------------------

  it("lista los bundles con su base sin barra final", async () => {
    const infos = await list();
    expect(infos.map((info) => info.manifest.id)).toEqual(["explorador", "taller"]);
    for (const info of infos) {
      expect(info.base).toBe(`/api/subjects/demo/tools/${info.manifest.id}/files`);
      expect(info.base.endsWith("/")).toBe(false);
      // La web compone `${base}/${path}`.
      const res = await h.request(`${info.base}/${info.manifest.scripts[0] ?? ""}`);
      expect(res.status).toBe(200);
    }
  });

  // -------------------------------------------------------------------------
  // Servicio de archivos
  // -------------------------------------------------------------------------

  it("sirve cada archivo con su Content-Type, nosniff y Cache-Control", async () => {
    const casos: Array<[string, string]> = [
      ["app.js", "text/javascript"],
      ["estilos/app.css", "text/css"],
      ["datos/study-data.json", "application/json"],
      ["img/icono.png", "image/png"],
    ];
    for (const [path, tipo] of casos) {
      const res = await h.request(`/api/subjects/demo/tools/explorador/files/${path}`);
      expect(res.status, path).toBe(200);
      expect(res.headers.get("content-type") ?? "", path).toContain(tipo);
      expect(res.headers.get("x-content-type-options")).toBe("nosniff");
      // un .svg abierto como documento no puede ejecutar nada en el origen (AS S3-A1)
      expect(res.headers.get("content-security-policy")).toContain("sandbox");
      expect(res.headers.get("cache-control")).toBe("private, max-age=0, must-revalidate");
      expect(res.headers.get("etag") ?? "").toMatch(/^"[0-9a-f]{32}"$/);
    }
  });

  it("devuelve el binario intacto", async () => {
    const res = await h.request("/api/subjects/demo/tools/explorador/files/img/icono.png");
    const bytes = Buffer.from(await res.arrayBuffer());
    expect(bytes.equals(Buffer.from(PNG_BASE64, "base64"))).toBe(true);
  });

  it("responde 304 cuando el ETag coincide y 200 cuando no", async () => {
    const first = await h.request("/api/subjects/demo/tools/explorador/files/app.js");
    const etag = first.headers.get("etag") ?? "";
    expect(etag).not.toBe("");

    const cached = await h.request("/api/subjects/demo/tools/explorador/files/app.js", {
      headers: { "if-none-match": etag },
    });
    expect(cached.status).toBe(304);
    expect(cached.headers.get("etag")).toBe(etag);
    expect(cached.headers.get("cache-control")).toBe("private, max-age=0, must-revalidate");
    expect(await cached.text()).toBe("");

    const otro = await h.request("/api/subjects/demo/tools/explorador/files/app.js", {
      headers: { "if-none-match": `"${"0".repeat(32)}"` },
    });
    expect(otro.status).toBe(200);
  });

  it("el ETag cambia cuando cambia el contenido", async () => {
    const antes = (await h.request("/api/subjects/demo/tools/taller/files/app.js")).headers.get("etag");
    await push(
      {
        manifest: manifest({ id: "taller", title: "Taller", styles: [], data: [] }),
        files: [{ path: "app.js", content: "// otra versión" }],
      },
      "taller",
    );
    const res = await h.request("/api/subjects/demo/tools/taller/files/app.js");
    expect(res.headers.get("etag")).not.toBe(antes);
    expect(await res.text()).toBe("// otra versión");
  });

  it("un push borra los archivos que ya no están en el bundle", async () => {
    // El push anterior dejó "taller" con un solo archivo.
    expect((await h.request("/api/subjects/demo/tools/taller/files/estilos/app.css")).status).toBe(404);
    expect(readdirSync(bundleDir(h.env, subjectId, "taller"))).toEqual(["app.js"]);
  });

  it("nunca sirve nada fuera de la carpeta del bundle", async () => {
    // Un archivo real, hermano de la carpeta del bundle: si el traversal
    // funcionara, se serviría.
    const secreto = join(toolsRoot(h.env), subjectId, "secreto.js");
    mkdirSync(join(toolsRoot(h.env), subjectId), { recursive: true });
    writeFileSync(secreto, "// secreto");
    expect(existsSync(secreto)).toBe(true);

    const rutas = [
      "/api/subjects/demo/tools/explorador/files/../secreto.js",
      "/api/subjects/demo/tools/explorador/files/..%2Fsecreto.js",
      "/api/subjects/demo/tools/explorador/files/%2e%2e/secreto.js",
      "/api/subjects/demo/tools/explorador/files/estilos/../../secreto.js",
      "/api/subjects/demo/tools/explorador/files/",
      "/api/subjects/demo/tools/explorador/files/no-existe.js",
      "/api/subjects/demo/tools/explorador/files/estilos",
    ];
    for (const ruta of rutas) {
      const res = await h.request(ruta);
      expect(res.status, ruta).toBe(404);
      expect(await res.text(), ruta).not.toContain("secreto");
    }
  });

  it("un id de herramienta con formato inválido es 404", async () => {
    expect((await h.request("/api/subjects/demo/tools/..%2F..%2Fx/files/app.js")).status).toBe(404);
    expect((await h.request("/api/subjects/demo/tools/Mayúsculas/files/app.js")).status).toBe(404);
  });

  // -------------------------------------------------------------------------
  // Convivencia con el sync y borrado
  // -------------------------------------------------------------------------

  it("el sync del wiki no borra los bundles", async () => {
    const antes = (await list()).map((info) => info.manifest.id);
    const res = await h.json("PUT", "/api/subjects/demo/sync", demoPayload(), auth());
    expect(res.status).toBe(200);
    expect((await list()).map((info) => info.manifest.id)).toEqual(antes);
    expect((await h.request("/api/subjects/demo/tools/explorador/files/app.js")).status).toBe(200);
  });

  it("DELETE borra la fila y la carpeta, y es idempotente", async () => {
    const res = await h.json("DELETE", "/api/subjects/demo/tools/taller", undefined, auth());
    expect(res.status).toBe(204);
    expect(existsSync(bundleDir(h.env, subjectId, "taller"))).toBe(false);
    expect((await list()).map((info) => info.manifest.id)).toEqual(["explorador"]);
    expect((await h.request("/api/subjects/demo/tools/taller/files/app.js")).status).toBe(404);

    const otra = await h.json("DELETE", "/api/subjects/demo/tools/taller", undefined, auth());
    expect(otra.status).toBe(204);
  });
});
