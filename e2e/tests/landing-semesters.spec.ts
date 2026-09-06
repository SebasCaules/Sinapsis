/**
 * Cuatrimestres de la landing (N0-32): son estado propio del usuario, no un
 * derivado de sus materias, así que uno VACÍO tiene que sobrevivir a la
 * recarga. Se prueban las tres operaciones del modo gestión: agregar, reordenar
 * con el teclado y quitar.
 *
 * `resetLanding` repone las materias (y la placeholder de la siembra);
 * `resetSemesters` repone la LISTA de cuatrimestres declarados, que es estado
 * aparte: sin ella un cuatrimestre vacío no tendría dónde vivir.
 */
import { expect, test, type Page } from "@playwright/test";
import { resetLanding, resetSemesters, snapshot } from "../support/app";
import { readSeed, semesterLabel } from "../support/seed";

const seed = readSeed();
const NUEVO = "2024-2C";

const NUEVO_LABEL = semesterLabel(NUEVO);
const sembrados = seed.landing.semesters.map(semesterLabel);

/**
 * Región viva de dnd-kit: la landing le escribe los anuncios en castellano
 * (`announcements` de `LandingPage`). Sirve de sincronización para el arrastre
 * con teclado, que dnd-kit procesa en varios cuadros: sin esperar cada anuncio,
 * la flecha llega antes de que la biblioteca haya medido los destinos.
 */
const anuncio = (page: Page) => page.locator('[aria-live="assertive"]');

/**
 * Dos cuadros de animación. dnd-kit MIDE los destinos con `requestAnimationFrame`
 * después de tomar el elemento, así que entre el «Tomó…» y la primera flecha hay
 * que dejarlo pintar: si no, el getter de coordenadas no encuentra ningún
 * destino y la flecha no mueve nada.
 */
async function settle(page: Page): Promise<void> {
  await page.evaluate(
    () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
  );
}

/** Rótulos de las secciones de cuatrimestre, de arriba abajo. */
async function orden(page: Page): Promise<string[]> {
  return page
    .locator('section[aria-label^="Cuatrimestre"]')
    .evaluateAll((nodes) => nodes.map((n) => n.getAttribute("aria-label") ?? ""));
}

/** Los cuatrimestres declarados que quedaron guardados, vacíos incluidos. */
async function savedSemesters(page: Page): Promise<string[]> {
  return (await snapshot(page)).landing.semesters;
}

async function manage(page: Page): Promise<void> {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Materias", level: 1 })).toBeVisible();
  await page.getByRole("button", { name: "Gestionar" }).click();
  await expect(page.getByRole("button", { name: "Guardar" })).toBeVisible();
}

async function save(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Guardar" }).click();
  await expect(page.getByText("Se guardaron sus materias.")).toBeVisible();
}

/** Agrega un cuatrimestre vacío desde el diálogo del modo gestión (sin guardar). */
async function addSemester(page: Page, label: string): Promise<void> {
  await page.getByRole("button", { name: "Agregar cuatrimestre" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("Agregar cuatrimestre");
  await dialog.getByLabel("Rótulo").fill(label);
  await dialog.getByRole("button", { name: "Agregar" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
}

test.beforeEach(async ({ page }) => {
  await resetLanding(page);
  await resetSemesters(page);
});

test("agregar un cuatrimestre vacío y guardarlo lo deja tras recargar", async ({ page }) => {
  await manage(page);
  expect(await orden(page)).toEqual(sembrados);

  await addSemester(page, NUEVO);
  const seccion = page.locator(`section[aria-label="${NUEVO_LABEL}"]`);
  await expect(seccion).toBeVisible();
  await expect(seccion).toContainText("0 materias");

  await save(page);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Materias", level: 1 })).toBeVisible();

  // El cuatrimestre vacío sigue ahí: no lo sostiene ninguna materia.
  await expect(page.locator(`section[aria-label="${NUEVO_LABEL}"]`)).toBeVisible();
  expect(await savedSemesters(page)).toContain(NUEVO);
});

test("reordenar un cuatrimestre con el teclado cambia el orden guardado", async ({ page }) => {
  await manage(page);
  const inicial = await orden(page);
  expect(inicial.length).toBeGreaterThanOrEqual(2);
  const primero = inicial[0] as string;
  const segundo = inicial[1] as string;

  // Asa → Espacio (tomar) → flecha abajo (mover) → Espacio (soltar).
  await page.getByRole("button", { name: `Reordenar ${primero}` }).focus();
  await page.keyboard.press("Space");
  await expect(anuncio(page)).toHaveText(`Tomó el cuatrimestre ${primero}.`);
  await settle(page);
  await page.keyboard.press("ArrowDown");
  await expect(anuncio(page)).toHaveText(`el cuatrimestre ${primero} está sobre el cuatrimestre ${segundo}.`);
  await page.keyboard.press("Space");
  await expect(anuncio(page)).toHaveText(`Soltó el cuatrimestre ${primero} sobre el cuatrimestre ${segundo}.`);

  await expect.poll(async () => (await orden(page))[0]).toBe(segundo);
  expect((await orden(page))[1]).toBe(primero);

  await save(page);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Materias", level: 1 })).toBeVisible();
  const despues = await orden(page);
  expect(despues[0]).toBe(segundo);
  expect(despues[1]).toBe(primero);
});

test("quitar un cuatrimestre vacío lo saca de la landing", async ({ page }) => {
  await manage(page);
  await addSemester(page, NUEVO);
  await save(page);

  await manage(page);
  const seccion = page.locator(`section[aria-label="${NUEVO_LABEL}"]`);
  await expect(seccion).toBeVisible();
  await seccion.getByRole("button", { name: "Quitar cuatrimestre" }).click();
  await expect(page.locator(`section[aria-label="${NUEVO_LABEL}"]`)).toHaveCount(0);

  await save(page);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Materias", level: 1 })).toBeVisible();
  await expect(page.locator(`section[aria-label="${NUEVO_LABEL}"]`)).toHaveCount(0);

  expect(await savedSemesters(page)).not.toContain(NUEVO);
});
