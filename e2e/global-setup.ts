/**
 * Siembra de las pruebas de punta a punta.
 *
 * Corre DESPUÉS de que `webServer` levantó el API (:3100) y la web (:5174), así
 * que no puede borrar la base: de eso se encarga el propio comando del API en
 * `playwright.config.ts` (`rm -f apps/api/data/e2e.db*` antes de arrancar).
 *
 * Lo que hace, en orden:
 *   a) POST /api/auth/dev  → guarda la cookie de sesión en `.auth/dev.json`
 *      (el `storageState` de todas las specs salvo `auth.spec.ts`).
 *   b) Sincroniza una materia con contenido real:
 *      · si existe `~/Desktop/ITBA/26-1C/Proba_Obsidian/wiki`, compila ese vault
 *        con `compileWiki({ config, rootDir })` — el config es
 *        `examples/proba/sinapsis.config.json` con `wiki.root` reescrito a la
 *        ruta ABSOLUTA del vault — y hace PUT /api/subjects/proba/sync.
 *      · si no existe, sube tal cual `fixtures/mini-payload.json` (materia
 *        "Materia Demo", 3 semanas, 8 páginas) a PUT /api/subjects/demo/sync.
 *      El sync se autentica con `Authorization: Bearer e2e-token` (SYNC_TOKEN).
 *   c) POST /api/subjects para poner la materia sincronizada en la landing del
 *      usuario dev (el sync NO la agrega: es global, ver N0-6) y para crear la
 *      materia placeholder "Materia Demo B" (slug demo-b, 2025-2C).
 *      Se verifica con GET /api/landing.
 *
 * Deja `.auth/seed.json` con qué camino se tomó, para que las specs adapten sus
 * aserciones (ver `support/seed.ts`).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  API_ORIGIN,
  AUTH_DIR,
  E2E_DIR,
  PROBA_VAULT,
  REPO_ROOT,
  SEED_FILE,
  SHOTS_DIR,
  STORAGE_STATE,
  SYNC_TOKEN,
  type CreateSubjectBody,
  type SeedManifest,
} from "./support/seed";

interface SyncResultDto {
  subject: string;
  pages: number;
  created: number;
  updated: number;
  deleted: number;
  warnings: string[];
}

interface LandingCardDto {
  slug: string;
  name: string;
  semester: string;
  pagesCount: number;
}

/** Cuatrimestre con el que la materia sincronizada entra en la landing. */
const SUBJECT_SEMESTER = "2026-1C";
const PLACEHOLDER = { slug: "demo-b", name: "Materia Demo B", semester: "2025-2C" };

async function api(
  method: string,
  route: string,
  init: { body?: unknown; token?: string; cookie?: string } = {},
): Promise<{ status: number; body: unknown; setCookie: string[] }> {
  const headers: Record<string, string> = { accept: "application/json" };
  if (init.body !== undefined) headers["content-type"] = "application/json";
  if (init.token) headers["authorization"] = `Bearer ${init.token}`;
  if (init.cookie) headers["cookie"] = init.cookie;

  const res = await fetch(`${API_ORIGIN}/api${route}`, {
    method,
    headers,
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
  const text = await res.text();
  let body: unknown = null;
  if (text.trim() !== "") {
    try {
      body = JSON.parse(text) as unknown;
    } catch {
      body = text;
    }
  }
  return { status: res.status, body, setCookie: res.headers.getSetCookie() };
}

function fail(step: string, status: number, body: unknown): never {
  const detail = typeof body === "string" ? body : JSON.stringify(body);
  throw new Error(`Siembra E2E — ${step} devolvió ${status}: ${detail}`);
}

/** Convierte el `Set-Cookie` del API en una cookie de `storageState`. */
function toStorageCookie(raw: string): {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires: number;
  httpOnly: boolean;
  secure: boolean;
  sameSite: "Lax";
} {
  const [pair = "", ...attrs] = raw.split(";");
  const eq = pair.indexOf("=");
  const name = pair.slice(0, eq).trim();
  const value = pair.slice(eq + 1).trim();
  let expires = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30;
  for (const attr of attrs) {
    const [key = "", val = ""] = attr.split("=");
    if (key.trim().toLowerCase() === "max-age") {
      const seconds = Number(val.trim());
      if (Number.isFinite(seconds)) expires = Math.floor(Date.now() / 1000) + seconds;
    }
  }
  return {
    name,
    value,
    domain: "localhost",
    path: "/",
    expires,
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
  };
}

/** Compila el vault real de Proba con el config del repo apuntado al vault. */
async function compileProba(): Promise<{ payload: { config: Record<string, unknown>; pages: unknown[] }; warnings: string[] }> {
  const { compileWiki } = (await import("../packages/markdown/src/index.js")) as {
    compileWiki: (opts: {
      config: unknown;
      rootDir: string;
      wikiRoot?: string;
      generator?: string;
    }) => Promise<{ payload: { config: Record<string, unknown>; pages: unknown[] }; warnings: string[] }>;
  };

  const configPath = path.join(REPO_ROOT, "examples/proba/sinapsis.config.json");
  const config = JSON.parse(readFileSync(configPath, "utf8")) as Record<string, unknown>;

  // El config del repo apunta a "wiki" relativo a sí mismo y el contrato exige que
  // `wiki.root` sea RELATIVO (endurecimiento contra travesía de rutas), así que la
  // raíz absoluta del vault se pasa por `wikiRoot` — el mismo camino que usa el
  // flag `--wiki` del CLI, que el compilador trata como entrada de confianza.
  return compileWiki({
    config,
    rootDir: path.dirname(configPath),
    wikiRoot: PROBA_VAULT,
    generator: "@sinapsis/e2e",
  });
}

export default async function globalSetup(): Promise<void> {
  mkdirSync(AUTH_DIR, { recursive: true });
  mkdirSync(SHOTS_DIR, { recursive: true });

  // --- (a) sesión de desarrollo ---------------------------------------------
  const dev = await api("POST", "/auth/dev");
  if (dev.status !== 200) fail("POST /api/auth/dev", dev.status, dev.body);
  const sessionCookie = dev.setCookie.find((c) => c.startsWith("sinapsis_sid="));
  if (!sessionCookie) throw new Error("Siembra E2E — POST /api/auth/dev no devolvió la cookie de sesión");
  const cookie = toStorageCookie(sessionCookie);
  writeFileSync(STORAGE_STATE, `${JSON.stringify({ cookies: [cookie], origins: [] }, null, 2)}\n`, "utf8");
  const cookieHeader = `${cookie.name}=${cookie.value}`;

  // --- (b) materia con contenido real ---------------------------------------
  const useProba = existsSync(PROBA_VAULT);
  let payload: { config: Record<string, unknown>; pages: unknown[] };
  let warnings: string[] = [];

  if (useProba) {
    const compiled = await compileProba();
    payload = compiled.payload;
    warnings = compiled.warnings;
  } else {
    payload = JSON.parse(
      readFileSync(path.join(E2E_DIR, "fixtures/mini-payload.json"), "utf8"),
    ) as { config: Record<string, unknown>; pages: unknown[] };
  }

  const config = payload.config;
  const slug = String(config["slug"]);
  const sync = await api("PUT", `/subjects/${slug}/sync`, { body: payload, token: SYNC_TOKEN });
  if (sync.status !== 200) fail(`PUT /api/subjects/${slug}/sync`, sync.status, sync.body);
  const synced = sync.body as SyncResultDto;

  // --- (c) landing del usuario dev ------------------------------------------
  const division = config["division"] as { singular: string; abbr: string; plural: string };
  const landingBodies: CreateSubjectBody[] = [
    {
      slug,
      name: String(config["name"]),
      code: String(config["code"]),
      institution: String(config["institution"]),
      semester: SUBJECT_SEMESTER,
      color: String(config["color"] ?? "--u1"),
      division,
    },
    {
      slug: PLACEHOLDER.slug,
      name: PLACEHOLDER.name,
      code: "00.02",
      institution: "Instituto Demo",
      semester: PLACEHOLDER.semester,
      color: "--u6",
      division: { singular: "Unidad", abbr: "U", plural: "Unidades" },
    },
  ];

  for (const body of landingBodies) {
    const added = await api("POST", "/subjects", { cookie: cookieHeader, body });
    // 409 = ya estaba en la landing (no pasa con base limpia, pero el conflicto
    // no es un fallo de la siembra).
    if (added.status !== 201 && added.status !== 409) {
      fail(`POST /api/subjects (${body.slug})`, added.status, added.body);
    }
  }

  const landing = await api("GET", "/landing", { cookie: cookieHeader });
  if (landing.status !== 200) fail("GET /api/landing", landing.status, landing.body);
  const cards = landing.body as LandingCardDto[];
  for (const expected of landingBodies.map((b) => b.slug)) {
    if (!cards.some((c) => c.slug === expected)) {
      throw new Error(`Siembra E2E — «${expected}» no quedó en la landing: ${JSON.stringify(cards)}`);
    }
  }

  // --- manifiesto para las specs --------------------------------------------
  const divisions = config["divisions"] as Array<{ key: string }>;
  const pages = payload.pages as Array<{ division?: string }>;
  const usedDivisions = new Set(pages.map((p) => p.division ?? "meta"));
  const declaredKeys = new Set(divisions.map((d) => d.key));
  const visible =
    divisions.filter((d) => usedDivisions.has(d.key)).length +
    // divisiones sintéticas que agrega el modelo del front: "meta" (Transversales)
    // y "otras" (claves que las páginas usan pero el config no declara).
    (usedDivisions.has("meta") ? 1 : 0) +
    ([...usedDivisions].some((k) => k !== "meta" && !declaredKeys.has(k)) ? 1 : 0);

  const manifest: SeedManifest = useProba
    ? {
        mode: "proba",
        subject: {
          slug,
          name: "Probabilidad y Estadística",
          code: "93.24",
          institution: "ITBA",
          semester: SUBJECT_SEMESTER,
          divisionPlural: division.plural.toUpperCase(),
          divisionsDeclared: divisions.length,
          divisionKeys: divisions.map((d) => d.key),
          divisionsVisible: visible,
          pages: synced.pages,
        },
        readerPage: { slug: "distribucion-normal", title: "Distribución Normal", division: "4" },
        catalogDivision: "4",
        filterPage: {
          slug: "desigualdad-de-chebyshev",
          title: "Desigualdades de Markov y de Chebyshev",
          term: "chebyshev",
          division: "7",
        },
        palette: { term: "normal", expected: "Distribución Normal" },
        placeholder: PLACEHOLDER,
        landing: landingBodies,
      }
    : {
        mode: "demo",
        subject: {
          slug,
          name: String(config["name"]),
          code: String(config["code"]),
          institution: String(config["institution"]),
          semester: SUBJECT_SEMESTER,
          divisionPlural: division.plural.toUpperCase(),
          divisionsDeclared: divisions.length,
          divisionKeys: divisions.map((d) => d.key),
          divisionsVisible: visible,
          pages: synced.pages,
        },
        readerPage: { slug: "demo-formula-clave", title: "Fórmula clave", division: "1" },
        catalogDivision: "1",
        filterPage: { slug: "demo-tecnica", title: "Técnica de resolución", term: "técnica", division: "2" },
        palette: { term: "formula", expected: "Fórmula clave" },
        placeholder: PLACEHOLDER,
        landing: landingBodies,
      };

  writeFileSync(SEED_FILE, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  const label = useProba ? `vault real (${PROBA_VAULT})` : "fixture mini-payload.json";
  console.log(
    `[e2e] siembra: ${label} → ${slug} con ${synced.pages} páginas ` +
      `(creadas ${synced.created}, borradas ${synced.deleted}); landing: ${cards.length} materias.`,
  );
  if (warnings.length) console.log(`[e2e] avisos del compilador: ${warnings.length}`);
  if (synced.warnings.length) console.log(`[e2e] avisos del sync: ${synced.warnings.length}`);
}
