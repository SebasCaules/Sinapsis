/**
 * Cliente HTTP del API de Sinapsis (ver `docs/CONTRACT.md` §4 y §5).
 * Sin dependencias: usa el `fetch` de Node.
 */
import { API_PREFIX, SubjectDetail, SyncResult, type SubjectDetail as SubjectDetailType, type SyncPayload, type SyncResult as SyncResultType } from "@sinapsis/contract";

export class ApiError extends Error {
  readonly status: number | undefined;
  readonly url: string;

  constructor(message: string, url: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.url = url;
    this.status = status;
  }
}

export interface ApiOptions {
  /** Base del API, sin barra final: `http://localhost:3000`. */
  api: string;
  /** Token de sync (`SYNC_TOKEN`). */
  token?: string | undefined;
  /** Cookie de sesión, si ya se obtuvo una. */
  cookie?: string | undefined;
}

function url(opts: ApiOptions, pathname: string): string {
  return `${opts.api.replace(/\/+$/, "")}${API_PREFIX}${pathname}`;
}

function headers(opts: ApiOptions, extra: Record<string, string> = {}): Record<string, string> {
  const out: Record<string, string> = { Accept: "application/json", ...extra };
  if (opts.token) out["Authorization"] = `Bearer ${opts.token}`;
  if (opts.cookie) out["Cookie"] = opts.cookie;
  return out;
}

async function request(target: string, init: RequestInit): Promise<Response> {
  try {
    return await fetch(target, init);
  } catch (cause) {
    const detail = cause instanceof Error ? cause.message : String(cause);
    throw new ApiError(`no se pudo conectar con ${target}: ${detail}`, target);
  }
}

/** Lee el cuerpo como JSON; si no lo es, devuelve `null`. */
async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (text.trim() === "") return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { error: text.slice(0, 400) };
  }
}

/** Extrae el mensaje de error del cuerpo (`{ error }`) o arma uno con el status. */
function errorMessage(body: unknown, response: Response): string {
  if (body && typeof body === "object" && "error" in body) {
    const value = (body as { error?: unknown }).error;
    if (typeof value === "string" && value.trim() !== "") return value;
  }
  return `HTTP ${response.status} ${response.statusText}`.trim();
}

/** `PUT /api/subjects/:slug/sync` con `Authorization: Bearer <SYNC_TOKEN>`. */
export async function putSync(
  opts: ApiOptions,
  slug: string,
  payload: SyncPayload,
): Promise<SyncResultType> {
  const target = url(opts, `/subjects/${slug}/sync`);
  const response = await request(target, {
    method: "PUT",
    headers: headers(opts, { "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  const body = await readJson(response);
  if (!response.ok) throw new ApiError(errorMessage(body, response), target, response.status);

  const parsed = SyncResult.safeParse(body);
  if (!parsed.success) {
    throw new ApiError("el API respondió con un SyncResult inesperado", target, response.status);
  }
  return parsed.data;
}

/** `POST /api/auth/dev` — sesión local con `AUTH_DEV_BYPASS=1`. Devuelve la cookie o `null`. */
export async function devLogin(opts: ApiOptions): Promise<string | null> {
  const target = url(opts, "/auth/dev");
  let response: Response;
  try {
    response = await request(target, { method: "POST", headers: headers(opts) });
  } catch {
    return null;
  }
  if (!response.ok) return null;
  const raw = response.headers.getSetCookie?.() ?? [];
  const cookies = raw.map((c) => c.split(";")[0]).filter((c): c is string => Boolean(c));
  if (cookies.length === 0) {
    const single = response.headers.get("set-cookie");
    if (!single) return null;
    return single.split(";")[0] ?? null;
  }
  return cookies.join("; ");
}

/** `GET /api/subjects/:slug` — requiere sesión. */
export async function getSubject(opts: ApiOptions, slug: string): Promise<SubjectDetailType> {
  const target = url(opts, `/subjects/${slug}`);
  const response = await request(target, { method: "GET", headers: headers(opts) });
  const body = await readJson(response);
  if (!response.ok) throw new ApiError(errorMessage(body, response), target, response.status);

  const parsed = SubjectDetail.safeParse(body);
  if (!parsed.success) {
    throw new ApiError("el API respondió con un SubjectDetail inesperado", target, response.status);
  }
  return parsed.data;
}
