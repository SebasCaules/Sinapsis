/**
 * Utilidades compartidas por las specs. Todo lo que toca el estado del servidor
 * pasa por acá para que cada archivo pueda dejar la base como la encontró: las
 * pruebas corren en un solo worker sobre UNA sola base, así que el aislamiento
 * lo da la reposición explícita, no un usuario por prueba.
 */
import { request as playwrightRequest, type APIRequestContext, type Page } from "@playwright/test";
import { API_ORIGIN, STORAGE_STATE, readSeed } from "./seed";

/**
 * Contexto de API con la cookie sembrada. `beforeAll` / `afterAll` no reciben la
 * fixture `request` (es de alcance test), así que la limpieza de esos hooks pasa
 * por acá.
 */
export async function withApi<T>(fn: (api: APIRequestContext) => Promise<T>): Promise<T> {
  const api = await playwrightRequest.newContext({ storageState: STORAGE_STATE });
  try {
    return await fn(api);
  } finally {
    await api.dispose();
  }
}

export interface LandingCard {
  slug: string;
  name: string;
  code: string;
  semester: string;
  position: number;
  pagesCount: number;
  studiedCount: number;
  placeholder: boolean;
}

function url(route: string): string {
  return `${API_ORIGIN}/api${route}`;
}

export async function landingCards(request: APIRequestContext): Promise<LandingCard[]> {
  const res = await request.get(url("/landing"));
  if (!res.ok()) throw new Error(`GET /api/landing → ${res.status()} ${await res.text()}`);
  return (await res.json()) as LandingCard[];
}

/**
 * Deja la landing exactamente como la dejó la siembra: repone las materias que
 * falten, quita las que sobren y devuelve cada una a su cuatrimestre.
 */
export async function resetLanding(request: APIRequestContext): Promise<void> {
  const seed = readSeed();
  const wanted = new Map(seed.landing.map((s) => [s.slug, s]));

  let cards = await landingCards(request);

  for (const card of cards) {
    if (!wanted.has(card.slug)) {
      await request.delete(url(`/subjects/${card.slug}/landing`));
    }
  }
  for (const [slug, body] of wanted) {
    if (!cards.some((c) => c.slug === slug)) {
      await request.post(url("/subjects"), { data: body });
    }
  }

  cards = await landingCards(request);
  const items = seed.landing.map((body, position) => ({ slug: body.slug, semester: body.semester, position }));
  const misplaced = items.some((item) => {
    const card = cards.find((c) => c.slug === item.slug);
    return !card || card.semester !== item.semester;
  });
  if (misplaced) {
    const res = await request.put(url("/landing"), { data: { items } });
    if (!res.ok()) throw new Error(`PUT /api/landing → ${res.status()} ${await res.text()}`);
  }
}

/** Desmarca todas las páginas estudiadas de una materia. */
export async function resetProgress(request: APIRequestContext, slug: string): Promise<void> {
  const res = await request.get(url(`/subjects/${slug}`));
  if (!res.ok()) throw new Error(`GET /api/subjects/${slug} → ${res.status()}`);
  const detail = (await res.json()) as { studied: string[] };
  for (const page of detail.studied) {
    await request.delete(url(`/subjects/${slug}/progress/${page}`));
  }
}

/** Fija el tema del perfil (el front lo adopta una vez por carga). */
export async function setUserTheme(
  request: APIRequestContext,
  theme: "pergamino" | "laurel" | "claustro",
): Promise<void> {
  const res = await request.patch(url("/me"), { data: { theme } });
  if (!res.ok()) throw new Error(`PATCH /api/me → ${res.status()} ${await res.text()}`);
}

/** Tema pintado en `<html data-theme>`. */
export async function currentTheme(page: Page): Promise<string | null> {
  return page.locator("html").getAttribute("data-theme");
}

/** Espera a que el shell de la materia esté dibujado (no el armazón de carga). */
export async function waitForSubjectShell(page: Page): Promise<void> {
  await page.locator('nav[aria-label="Secciones de la materia"]').waitFor();
}
