/**
 * Cliente HTTP del API de Sinapsis (ver `docs/CONTRACT.md` §4 y §5).
 * Sin dependencias: usa el `fetch` de Node.
 */
import {
  API_PREFIX,
  SubjectDetail,
  SyncResult,
  errorMessageFromBody,
  type SubjectDetail as SubjectDetailType,
  type SyncPayload,
  type SyncResult as SyncResultType,
} from "@sinapsis/contract";
import type { z } from "zod";

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

/** Lee el cuerpo como JSON; si no lo es, lo envuelve como `{ error }`. */
async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (text.trim() === "") return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { error: text.slice(0, 400) };
  }
}

/** Cuerpo y nombre del esquema (solo para el mensaje de error). */
export interface RequestJsonOptions {
  /** Se envía como JSON; si falta, el pedido va sin cuerpo. */
  body?: unknown;
  /** Nombre del DTO esperado, para el mensaje si la respuesta no valida. */
  name?: string;
}

/**
 * Un pedido al API: arma la URL y los encabezados, valida el status y parsea la
 * respuesta contra el esquema del contrato. Cualquier desvío es un `ApiError`
 * con el mensaje que devolvió el API (`{ error }`) o el status.
 */
export async function requestJson<S extends z.ZodTypeAny>(
  opts: ApiOptions,
  method: string,
  pathname: string,
  schema: S,
  { body, name = "cuerpo" }: RequestJsonOptions = {},
): Promise<z.infer<S>> {
  const target = url(opts, pathname);
  const response = await request(target, {
    method,
    headers: headers(opts, body === undefined ? {} : { "Content-Type": "application/json" }),
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });

  const payload = await readJson(response);
  if (!response.ok) {
    throw new ApiError(errorMessageFromBody(payload, response.status, response.statusText), target, response.status);
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    throw new ApiError(`el API respondió con un ${name} inesperado`, target, response.status);
  }
  return parsed.data as z.infer<S>;
}

/** `PUT /api/subjects/:slug/sync` con `Authorization: Bearer <SYNC_TOKEN>`. */
export async function putSync(opts: ApiOptions, slug: string, payload: SyncPayload): Promise<SyncResultType> {
  return requestJson(opts, "PUT", `/subjects/${slug}/sync`, SyncResult, { body: payload, name: "SyncResult" });
}

/** `GET /api/subjects/:slug` — requiere sesión. */
export async function getSubject(opts: ApiOptions, slug: string): Promise<SubjectDetailType> {
  return requestJson(opts, "GET", `/subjects/${slug}`, SubjectDetail, { name: "SubjectDetail" });
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
