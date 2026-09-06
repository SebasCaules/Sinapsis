import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { MAX_BODY_BYTES } from "./app.js";
import { createHarness, type Harness } from "./test/harness.js";

describe("fallback estático de la SPA", () => {
  let h: Harness;
  let dist: string;

  beforeAll(async () => {
    dist = mkdtempSync(join(tmpdir(), "sinapsis-dist-"));
    mkdirSync(join(dist, "assets"), { recursive: true });
    writeFileSync(join(dist, "index.html"), "<!doctype html><title>Sinapsis</title><div id=root></div>");
    writeFileSync(join(dist, "assets", "app.js"), "console.log('sinapsis');");
    // serveStatic resuelve `root` contra el cwd del proceso.
    h = await createHarness({ env: { WEB_DIST: relative(process.cwd(), dist) } });
  });

  afterAll(() => {
    h.close();
    rmSync(dist, { recursive: true, force: true });
  });

  it("sirve los archivos del build", async () => {
    const res = await h.request("/assets/app.js");
    expect(res.status).toBe(200);
    expect(await res.text()).toContain("sinapsis");
  });

  it("devuelve index.html en cualquier ruta del SPA", async () => {
    for (const path of ["/", "/login", "/m/proba/p/distribucion-normal"]) {
      const res = await h.request(path);
      expect(res.status, path).toBe(200);
      expect(await res.text()).toContain('<div id=root>');
    }
  });

  it("no tapa el API: /api sigue devolviendo JSON", async () => {
    const health = await h.request("/api/health");
    expect(health.status).toBe(200);
    expect(await health.json()).toEqual({ ok: true });

    const missing = await h.request("/api/no-existe");
    expect(missing.status).toBe(404);
    expect(await missing.json()).toEqual({ error: "Ruta no encontrada" });
  });
});

describe("sin WEB_DIST", () => {
  let h: Harness;

  beforeAll(async () => {
    h = await createHarness();
  });

  afterAll(() => h.close());

  it("una ruta que no es del API devuelve 404 JSON", async () => {
    const res = await h.request("/login");
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Ruta no encontrada" });
  });

  it("ignora un WEB_DIST que no existe", async () => {
    const otro = await createHarness({ env: { WEB_DIST: "./no-existe-esta-carpeta" } });
    expect((await otro.request("/")).status).toBe(404);
    expect((await otro.request("/api/health")).status).toBe(200);
    otro.close();
  });
});

describe("cuerpo JSON roto", () => {
  let h: Harness;

  beforeAll(async () => {
    h = await createHarness();
    await h.login();
  });

  afterAll(() => h.close());

  // El guard CSRF ya no pre-parsea el cuerpo: el JSON roto lo levanta el
  // validador de la ruta y lo traduce `app.onError`. Cambia el camino, no el
  // resultado.
  const roto = (path: string, headers: Record<string, string> = {}) =>
    h.request(path, {
      method: "PATCH",
      headers: { "content-type": "application/json", ...headers },
      body: '{ "theme": ',
    });

  it("devuelve 400 con el mensaje del API", async () => {
    const res = await roto("/api/me");
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "El cuerpo no es JSON válido" });
  });

  it("también en el sync, que se autentica con token", async () => {
    const res = await h.request("/api/subjects/demo/sync", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${h.env.SYNC_TOKEN}`,
      },
      body: "{ no es json",
    });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "El cuerpo no es JSON válido" });
  });

  it("un cuerpo JSON válido pero con el tema equivocado sigue dando su propio 400", async () => {
    const res = await h.json("PATCH", "/api/me", { theme: "neon" });
    expect(res.status).toBe(400);
    expect((await res.json()) as { error: string }).toMatchObject({
      error: expect.stringContaining("Tema inválido"),
    });
  });
});

describe("límite de cuerpo", () => {
  let h: Harness;

  beforeAll(async () => {
    h = await createHarness();
  });

  afterAll(() => h.close());

  it("rechaza con 413 un cuerpo que se declara mayor a 50 MB", async () => {
    const res = await h.request("/api/subjects/demo/sync", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        "content-length": String(MAX_BODY_BYTES + 1),
        authorization: "Bearer lo-que-sea",
      },
      body: "{}",
    });
    expect(res.status).toBe(413);
    expect(await res.json()).toEqual({ error: "El cuerpo del pedido supera los 50 MB" });
  });
});
