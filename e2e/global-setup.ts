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
 *      El payload lleva además el MATERIAL DE ESTUDIO del Sprint 2
 *      (`payload.study`: mazos, quiz, plan y kits de `examples/proba/estudio/`).
 *      Con el vault real se exige que llegue: sin él, las specs de estudio
 *      pasarían probando estados vacíos.
 *   c) POST /api/subjects para poner la materia sincronizada en la landing del
 *      usuario dev (el sync NO la agrega: es global, ver N0-6) y para crear la
 *      materia placeholder "Materia Demo B" (slug demo-b, 2025-2C).
 *      Se verifica con GET /api/landing.
 *   d) Publica el BUNDLE DE HERRAMIENTAS de la materia (Sprint 3 · N0-41):
 *      · con el vault real, el bundle de verdad de Proba
 *        (`examples/proba/tools/proba-tools`: 5 vistas y las figuras del wiki);
 *      · con el fixture, el bundle mínimo `fixtures/mini-tools/` (una vista
 *        «demo» y una figura «demo-fig»).
 *      Se construye con el MISMO `buildBundle` que usa `sinapsis tools build`
 *      —así la siembra falla igual que el CLI si el bundle está roto— y se sube
 *      con `PUT /api/subjects/:slug/tools/:id` y el token de sync, que es lo que
 *      hace `tools push`. Se verifica con GET /api/subjects/:slug/tools.
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
  MINI_BUNDLE,
  PROBA_BUNDLE,
  PROBA_VAULT,
  REPO_ROOT,
  SEED_FILE,
  SHOTS_DIR,
  STORAGE_STATE,
  SYNC_TOKEN,
  type CreateSubjectBody,
  type SeedManifest,
  type SeedTools,
} from "./support/seed";

/**
 * Lo que se sube en `PUT /api/subjects/:slug/sync`, con lo poco que la siembra
 * mira de adentro. `study` es del Sprint 2 y viaja SIEMPRE (aunque esté vacío):
 * ver §7 del contrato.
 */
interface SyncPayloadLike {
  config: Record<string, unknown>;
  pages: unknown[];
  study?: { decks: unknown[]; quizzes: unknown[]; plan: unknown; kits: unknown[] };
}

/** Página del payload, con lo que la siembra mira de adentro. */
interface PageLike {
  slug: string;
  title: string;
  division?: string;
  body: string;
}

/** Lo que la siembra usa del bundle que devuelve `buildBundle` del CLI. */
interface BuiltBundleLike {
  manifest: {
    id: string;
    title: string;
    views: Array<{ id: string; label: string }>;
    figures: boolean;
  };
  push: { manifest: unknown; files: Array<{ path: string; content: string }> };
  bytes: number;
  /** Código de la carpeta que el manifiesto no declara (no se sube). */
  ignored: string[];
  /** Archivos con extensión ajena al contrato (no se suben). */
  skipped: string[];
}

type BuildOutcomeLike =
  | { ok: true; bundle: BuiltBundleLike }
  | { ok: false; problems: Array<{ where: string; message: string }> };

interface ToolInfoDto {
  manifest: { id: string; views: Array<{ id: string; label: string }> };
  bytes: number;
  updatedAt: string;
  base: string;
}

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

/**
 * Compila el vault real de Proba con el config del repo apuntado al vault.
 *
 * El payload que devuelve trae también `study` (mazos, quiz, plan y kits): el
 * compilador lee `wiki.study`, que es relativa al CONFIG y no al vault (N0-27),
 * así que sale de `examples/proba/estudio/` aunque `wikiRoot` apunte a otro
 * lado. Acá no hay que hacer nada especial para que viaje: `PUT .../sync` sube
 * el payload entero.
 */
async function compileProba(): Promise<{ payload: SyncPayloadLike; warnings: string[] }> {
  const { compileWiki } = (await import("../packages/markdown/src/index.js")) as {
    compileWiki: (opts: {
      config: unknown;
      rootDir: string;
      wikiRoot?: string;
      generator?: string;
    }) => Promise<{ payload: SyncPayloadLike; warnings: string[] }>;
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

/**
 * Construye el bundle de herramientas con el MISMO código que `sinapsis tools
 * build` (`packages/cli/src/tools/bundle.ts`): valida el manifiesto, comprueba
 * que cada archivo declarado exista y que cada script parsee. Un bundle roto
 * corta la siembra acá, con el problema que reportaría el CLI.
 */
async function buildTools(dir: string): Promise<BuiltBundleLike> {
  const { buildBundle } = (await import("../packages/cli/src/tools/bundle.js")) as {
    buildBundle: (dir: string, opts?: { minify?: boolean }) => Promise<BuildOutcomeLike>;
  };

  const outcome = await buildBundle(dir);
  if (!outcome.ok) {
    const detail = outcome.problems.map((p) => `${p.where}: ${p.message}`).join(" · ");
    throw new Error(`Siembra E2E — el bundle de ${dir} no se puede publicar: ${detail}`);
  }
  return outcome.bundle;
}

/**
 * Página con la que corre `figures.spec.ts` y el id de su primera figura. El id
 * sale del propio callout (`> [!figura] <id>`) y se comprueba que algún script
 * del bundle lo registre: si no, la figura se dibujaría como «no registrada» y
 * la spec fallaría sin decir por qué.
 */
function figurePageOf(
  pages: PageLike[],
  slug: string,
  bundle: BuiltBundleLike,
): { slug: string; title: string; fig: string } {
  const page = pages.find((p) => p.slug === slug);
  if (!page) {
    throw new Error(`Siembra E2E — la página de figuras «${slug}» no está en el payload sincronizado`);
  }
  const found = page.body.match(/^>[ \t]*\[!figura\][ \t]+(\S+)/m);
  if (!found?.[1]) {
    throw new Error(`Siembra E2E — «${slug}» ya no trae ningún callout «> [!figura] <id>»`);
  }
  const fig = found[1];

  // `registerFigure(` y el id pueden estar en líneas distintas y con comillas
  // simples o dobles: el bundle lo escribe como quiere.
  const call = new RegExp(`registerFigure\\(\\s*["']${fig.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`);
  const registered = bundle.push.files.some(
    (file) => file.path.endsWith(".js") && call.test(file.content),
  );
  if (!registered) {
    throw new Error(
      `Siembra E2E — ningún script de «${bundle.manifest.id}» registra la figura «${fig}» que pide ${slug}`,
    );
  }
  return { slug: page.slug, title: page.title, fig };
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
  let payload: SyncPayloadLike;
  let warnings: string[] = [];

  if (useProba) {
    const compiled = await compileProba();
    payload = compiled.payload;
    warnings = compiled.warnings;
  } else {
    payload = JSON.parse(
      readFileSync(path.join(E2E_DIR, "fixtures/mini-payload.json"), "utf8"),
    ) as SyncPayloadLike;
  }

  /* El material de estudio del Sprint 2 viaja en el MISMO payload. Si dejara de
     llegar, las specs de estudio no fallarían: probarían una materia sin mazos
     ni plan y pasarían por los estados vacíos. Se corta acá, con un mensaje que
     dice qué se rompió. */
  if (useProba && !payload.study?.decks.length) {
    throw new Error(
      "Siembra E2E — el payload compilado no trae material de estudio (payload.study). " +
        "Revisá `wiki.study` del config y `examples/proba/estudio/`.",
    );
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

  // --- (d) bundle de herramientas -------------------------------------------
  const bundle = await buildTools(useProba ? PROBA_BUNDLE : MINI_BUNDLE);
  const toolId = bundle.manifest.id;
  const pushed = await api("PUT", `/subjects/${slug}/tools/${toolId}`, {
    body: bundle.push,
    token: SYNC_TOKEN,
  });
  // 201 la primera vez, 200 si el bundle ya estaba (base reusada).
  if (pushed.status !== 200 && pushed.status !== 201) {
    fail(`PUT /api/subjects/${slug}/tools/${toolId}`, pushed.status, pushed.body);
  }

  const published = await api("GET", `/subjects/${slug}/tools`, { cookie: cookieHeader });
  if (published.status !== 200) fail(`GET /api/subjects/${slug}/tools`, published.status, published.body);
  const infos = published.body as ToolInfoDto[];
  const info = infos.find((t) => t.manifest.id === toolId);
  if (!info) {
    throw new Error(`Siembra E2E — «${toolId}» no quedó publicado: ${JSON.stringify(infos)}`);
  }
  /* Sin vistas, `/m/<materia>/t/<vista>` no tendría nada que montar y
     `tools.spec.ts` probaría el estado «Próximamente» creyendo que prueba una
     herramienta. */
  const view = bundle.manifest.views[0];
  if (!view) throw new Error(`Siembra E2E — el bundle «${toolId}» no declara ninguna vista`);

  const tools: SeedTools = {
    id: toolId,
    title: bundle.manifest.title,
    views: bundle.manifest.views.map((v) => ({ id: v.id, label: v.label })),
    view: { id: view.id, label: view.label },
    figures: bundle.manifest.figures,
    files: bundle.push.files.length,
  };

  // --- manifiesto para las specs --------------------------------------------
  const divisions = config["divisions"] as Array<{ key: string }>;
  const pages = payload.pages as Array<{ division?: string }>;
  const railGroups = (config["rail"] ?? []) as Array<{
    items?: Array<{ id: string; label: string; kind: string; target: string }>;
  }>;
  const railTools = railGroups
    .flatMap((group) => group.items ?? [])
    .filter((item) => item.kind === "tool")
    .map((item) => ({ id: item.id, label: item.label, target: item.target }));

  const figurePage = figurePageOf(
    payload.pages as PageLike[],
    useProba ? "tecnica-derivadas-parciales" : "demo-repaso",
    bundle,
  );
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
        tools,
        railTools,
        figurePage,
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
        tools,
        railTools,
        figurePage,
        placeholder: PLACEHOLDER,
        landing: landingBodies,
      };

  writeFileSync(SEED_FILE, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  const label = useProba ? `vault real (${PROBA_VAULT})` : "fixture mini-payload.json";
  console.log(
    `[e2e] siembra: ${label} → ${slug} con ${synced.pages} páginas ` +
      `(creadas ${synced.created}, borradas ${synced.deleted}); landing: ${cards.length} materias.`,
  );
  const study = payload.study;
  if (study) {
    /* Los mazos son los AUTORALES del wiki: los automáticos por división los
       agrega el API al leer, no viajan en el sync (N0-27). */
    const n = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`;
    console.log(
      `[e2e] material de estudio: ${n(study.decks.length, "mazo autoral", "mazos autorales")}, ` +
        `${n(study.quizzes.length, "quiz", "quizzes")}, ${study.plan ? "plan" : "sin plan"}, ` +
        `${n(study.kits.length, "kit", "kits")}.`,
    );
  }
  console.log(
    `[e2e] herramientas: ${toolId} ${bundle.push.files.length} archivos ` +
      `(${Math.round(bundle.bytes / 1024)} KB) · vistas: ${tools.views.map((v) => v.id).join(", ")} · ` +
      `figuras: ${tools.figures ? "sí" : "no"}; página con figura: ${figurePage.slug} (${figurePage.fig}).`,
  );
  if (bundle.ignored.length) {
    console.log(`[e2e] scripts del bundle sin declarar (no se suben): ${bundle.ignored.length}`);
  }
  if (warnings.length) console.log(`[e2e] avisos del compilador: ${warnings.length}`);
  if (synced.warnings.length) console.log(`[e2e] avisos del sync: ${synced.warnings.length}`);
}
