/**
 * Cliente HTTP tipado contra el API de Sinapsis. ÚNICA fuente de fetch de la SPA.
 * Las firmas son contrato entre los agentes (landing, materia): no renombrar.
 * Todas las llamadas llevan la cookie de sesión (same-origin vía proxy de Vite).
 */
import {
  API_PREFIX,
  type CreateSubjectInput,
  type LandingLayoutInput,
  type PageDetail,
  type SearchHit,
  type SubjectCard,
  type SubjectDetail,
  type ThemeId,
  type User,
} from "@sinapsis/contract";

export class ApiError extends Error {
  constructor(public status: number, message: string, public body?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_PREFIX}${path}`, {
    method,
    credentials: "same-origin",
    headers: body !== undefined ? { "content-type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  const data = text ? safeJson(text) : null;
  if (!res.ok) {
    const msg = (data && typeof data === "object" && "error" in data && typeof (data as any).error === "string")
      ? (data as any).error
      : `${res.status} ${res.statusText}`;
    throw new ApiError(res.status, msg, data);
  }
  return data as T;
}
function safeJson(t: string): unknown { try { return JSON.parse(t); } catch { return t; } }

export const api = {
  auth: {
    me: () => request<User>("GET", "/me"),
    google: (credential: string) => request<User>("POST", "/auth/google", { credential }),
    dev: () => request<User>("POST", "/auth/dev"),
    logout: () => request<void>("POST", "/auth/logout"),
    setTheme: (theme: ThemeId) => request<User>("PATCH", "/me", { theme }),
  },
  landing: {
    list: () => request<SubjectCard[]>("GET", "/landing"),
    saveLayout: (input: LandingLayoutInput) => request<SubjectCard[]>("PUT", "/landing", input),
    createSubject: (input: CreateSubjectInput) => request<SubjectCard>("POST", "/subjects", input),
    removeFromLanding: (slug: string) => request<void>("DELETE", `/subjects/${enc(slug)}/landing`),
  },
  subject: {
    detail: (slug: string) => request<SubjectDetail>("GET", `/subjects/${enc(slug)}`),
    page: (slug: string, page: string) => request<PageDetail>("GET", `/subjects/${enc(slug)}/pages/${enc(page)}`),
    search: (slug: string, q: string) => request<SearchHit[]>("GET", `/subjects/${enc(slug)}/search?q=${encodeURIComponent(q)}`),
    markStudied: (slug: string, page: string) => request<void>("PUT", `/subjects/${enc(slug)}/progress/${enc(page)}`),
    unmarkStudied: (slug: string, page: string) => request<void>("DELETE", `/subjects/${enc(slug)}/progress/${enc(page)}`),
  },
  /** Config pública que el servidor expone sin sesión (p. ej. el Google Client ID). */
  config: () => request<{ googleClientId: string | null; devBypass: boolean }>("GET", "/config"),
};
const enc = encodeURIComponent;

/** Claves de TanStack Query compartidas por todas las features. */
export const qk = {
  me: ["me"] as const,
  config: ["config"] as const,
  landing: ["landing"] as const,
  subject: (slug: string) => ["subject", slug] as const,
  page: (slug: string, page: string) => ["subject", slug, "page", page] as const,
  search: (slug: string, q: string) => ["subject", slug, "search", q] as const,
};
