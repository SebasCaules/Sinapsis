import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { User } from "@sinapsis/contract";
import { createHarness, type Harness } from "../test/harness.js";

describe("auth y sesión", () => {
  let h: Harness;

  beforeAll(async () => {
    h = await createHarness();
  });

  afterAll(() => h.close());

  it("responde /api/health y /api/config sin sesión", async () => {
    const health = await h.request("/api/health");
    expect(health.status).toBe(200);
    expect(await health.json()).toEqual({ ok: true });

    const config = await h.request("/api/config");
    expect(config.status).toBe(200);
    expect(await config.json()).toEqual({ googleClientId: null, devBypass: true });
  });

  it("/api/me devuelve 401 sin cookie", async () => {
    const res = await h.request("/api/me");
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Sesión requerida" });
  });

  it("POST /api/auth/dev setea la cookie y /api/me devuelve el usuario", async () => {
    const res = await h.request("/api/auth/dev", { method: "POST" });
    expect(res.status).toBe(200);

    const setCookie = res.headers.get("set-cookie") ?? "";
    expect(setCookie).toContain("sinapsis_sid=");
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("SameSite=Lax");
    expect(setCookie).not.toContain("Secure");

    const user = (await res.json()) as User;
    expect(user.email).toBe("dev@sinapsis.local");
    expect(user.name).toBe("Usuario Dev");
    expect(user.theme).toBe("pergamino");

    const me = await h.request("/api/me");
    expect(me.status).toBe(200);
    expect((await me.json()) as User).toMatchObject({ email: "dev@sinapsis.local" });
  });

  it("PATCH /api/me cambia el tema y rechaza uno inválido", async () => {
    const ok = await h.json("PATCH", "/api/me", { theme: "claustro" });
    expect(ok.status).toBe(200);
    expect(((await ok.json()) as User).theme).toBe("claustro");

    const me = await h.request("/api/me");
    expect(((await me.json()) as User).theme).toBe("claustro");

    const bad = await h.json("PATCH", "/api/me", { theme: "neon" });
    expect(bad.status).toBe(400);
    expect((await bad.json()) as { error: string }).toHaveProperty("error");
  });

  it("rechaza cuerpos que no son application/json", async () => {
    const res = await h.request("/api/me", {
      method: "PATCH",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: "theme=laurel",
    });
    expect(res.status).toBe(415);
  });

  it("rechaza un Origin ajeno al host", async () => {
    const res = await h.json("PATCH", "/api/me", { theme: "laurel" }, { origin: "https://evil.example" });
    expect(res.status).toBe(403);
  });

  it("logout invalida la sesión", async () => {
    const out = await h.request("/api/auth/logout", { method: "POST" });
    expect(out.status).toBe(204);

    const me = await h.request("/api/me");
    expect(me.status).toBe(401);
  });

  it("vuelve a iniciar sesión sobre el mismo usuario", async () => {
    const user = await h.login();
    expect(user.email).toBe("dev@sinapsis.local");
    // El tema persistió del PATCH anterior: es el mismo usuario, no uno nuevo.
    expect(user.theme).toBe("claustro");
  });
});

describe("auth con el bypass apagado", () => {
  let h: Harness;

  beforeAll(async () => {
    h = await createHarness({ env: { AUTH_DEV_BYPASS: "0" } });
  });

  afterAll(() => h.close());

  it("POST /api/auth/dev devuelve 404", async () => {
    const res = await h.request("/api/auth/dev", { method: "POST" });
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Ruta no encontrada" });
  });

  it("/api/config informa devBypass:false", async () => {
    const res = await h.request("/api/config");
    expect(await res.json()).toMatchObject({ devBypass: false });
  });

  it("POST /api/auth/google devuelve 503 sin GOOGLE_CLIENT_ID", async () => {
    const res = await h.json("POST", "/api/auth/google", { credential: "loquesea" });
    expect(res.status).toBe(503);
  });
});

describe("auth con Google configurado", () => {
  let h: Harness;

  beforeAll(async () => {
    h = await createHarness({
      env: { GOOGLE_CLIENT_ID: "client-id-de-prueba.apps.googleusercontent.com" },
      deps: {
        googleVerifier: async (credential: string) =>
          credential === "token-bueno"
            ? {
                sub: "google-sub-1",
                email: "alumna@itba.edu.ar",
                name: "Alumna ITBA",
                picture: "https://example.test/a.png",
              }
            : null,
      },
    });
  });

  afterAll(() => h.close());

  it("rechaza un ID token inválido con 401", async () => {
    const res = await h.json("POST", "/api/auth/google", { credential: "token-malo" });
    expect(res.status).toBe(401);
  });

  it("crea el usuario y la sesión con un ID token válido", async () => {
    const res = await h.json("POST", "/api/auth/google", { credential: "token-bueno" });
    expect(res.status).toBe(200);
    const user = (await res.json()) as User;
    expect(user.email).toBe("alumna@itba.edu.ar");
    expect(user.picture).toBe("https://example.test/a.png");

    const me = await h.request("/api/me");
    expect(me.status).toBe(200);
    expect(((await me.json()) as User).id).toBe(user.id);
  });
});
