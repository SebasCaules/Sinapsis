import { describe, expect, it } from "vitest";
import { allowedOrigins, cookieSecure, devBypassEnabled, loadEnv } from "./env.js";

const base = { SESSION_SECRET: "secreto-de-prueba-largo-1234", SYNC_TOKEN: "token-de-prueba" };

describe("loadEnv", () => {
  it("rechaza el bypass de desarrollo en producción (fail-fast)", () => {
    expect(() => loadEnv({ ...base, NODE_ENV: "production", AUTH_DEV_BYPASS: "1" })).toThrow(/AUTH_DEV_BYPASS/);
  });
  it("en desarrollo el bypass está permitido y la cookie no es Secure salvo COOKIE_SECURE", () => {
    const env = loadEnv({ ...base, AUTH_DEV_BYPASS: "1" });
    expect(devBypassEnabled(env)).toBe(true);
    expect(cookieSecure(env)).toBe(false);
    expect(cookieSecure(loadEnv({ ...base, COOKIE_SECURE: "1" }))).toBe(true);
  });
  it("los orígenes admitidos son solo los de ALLOWED_ORIGINS, en cualquier entorno", () => {
    // Ni siquiera en desarrollo se abren los puertos de Vite: el proxy manda el
    // Host de la web, así que el guard ya los acepta por `originHost === host`.
    expect([...allowedOrigins(loadEnv({ ...base, AUTH_DEV_BYPASS: "1" }))]).toEqual([]);

    const env = loadEnv({ ...base, NODE_ENV: "production", ALLOWED_ORIGINS: "https://sinapsis.example, https://app.example" });
    expect(devBypassEnabled(env)).toBe(false);
    expect(cookieSecure(env)).toBe(true);
    const origins = allowedOrigins(env);
    expect(origins.has("http://localhost:5173")).toBe(false);
    expect(origins.has("https://sinapsis.example")).toBe(true);
    expect(origins.has("https://app.example")).toBe(true);
  });
});
