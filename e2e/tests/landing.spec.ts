/**
 * Landing: las tarjetas de materia, el agrupado por cuatrimestre, el modo
 * gestión (mover y quitar), el alta desde el diálogo y el estado vacío.
 *
 * Sin API, la landing de un navegador nuevo es el CATÁLOGO entero del sitio:
 * cada materia compilada aparece en el cuatrimestre que declara su config. La
 * materia placeholder «Materia Demo B» —la que prueba las tarjetas sin wiki— la
 * pone `resetLanding` con el gancho de pruebas, porque no está en el catálogo.
 */
import { expect, test } from "@playwright/test";
import { landingCards, resetLanding, resetProgress, restore, snapshot } from "../support/app";
import { readSeed, semesterLabel } from "../support/seed";

const seed = readSeed();
const subject = seed.subject;
const placeholder = seed.placeholder;

const subjectSemester = semesterLabel(subject.semester);
const placeholderSemester = semesterLabel(placeholder.semester);

const cardOf = (slug: string) => `[data-testid="subject-card"][data-slug="${slug}"]`;

test.beforeEach(async ({ page }) => {
  await resetLanding(page);
  await resetProgress(page, subject.slug);
});

test("muestra la materia compilada con su código y sin comenzar", async ({ page }) => {
  const cards = await landingCards(page);
  const total = cards.find((c) => c.slug === subject.slug)?.pagesCount ?? 0;
  expect(total).toBeGreaterThan(0);

  await page.goto("/");

  const synced = page.locator(cardOf(subject.slug));
  await expect(synced).toBeVisible();
  await expect(synced).toContainText(subject.name);
  await expect(synced).toContainText(subject.code);
  await expect(synced).toContainText(subject.institution);
  await expect(synced).toContainText("SIN COMENZAR");
  await expect(synced).toContainText(`0/${total} páginas`);
  // La materia del catálogo NO lleva el sello "Sin sincronizar"; la placeholder sí.
  await expect(synced).not.toContainText("Sin sincronizar");
  await expect(page.locator(cardOf(placeholder.slug))).toContainText("Sin sincronizar");
});

test("agrupa las materias por cuatrimestre", async ({ page }) => {
  await page.goto("/");

  const primero = page.locator("section").filter({ hasText: subjectSemester }).first();
  const segundo = page.locator("section").filter({ hasText: placeholderSemester }).first();

  await expect(page.getByRole("button", { name: new RegExp(subjectSemester) })).toBeVisible();
  await expect(page.getByRole("button", { name: new RegExp(placeholderSemester) })).toBeVisible();

  await expect(primero.locator(`[data-slug="${subject.slug}"]`)).toBeVisible();
  await expect(segundo.locator(`[data-slug="${placeholder.slug}"]`)).toBeVisible();

  // El cuatrimestre más reciente va primero: 2026-1C antes que 2025-2C.
  const rotulos = await page.locator('section[aria-label^="Cuatrimestre"]').evaluateAll((nodes) =>
    nodes.map((n) => n.getAttribute("aria-label") ?? ""),
  );
  expect(rotulos).toEqual([subjectSemester, placeholderSemester]);
});

test("gestionar: mover una materia de cuatrimestre y guardar sobrevive a la recarga", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Gestionar" }).click();

  const mover = page.getByLabel(`Mover ${placeholder.name} a otro cuatrimestre`);
  await expect(mover).toBeVisible();
  await mover.selectOption(subject.semester);

  await page.getByRole("button", { name: "Guardar" }).click();
  await expect(page.getByText("Se guardaron sus materias.")).toBeVisible();

  await page.reload();
  const seccion = page.locator("section").filter({ hasText: subjectSemester }).first();
  await expect(seccion.locator(`[data-slug="${placeholder.slug}"]`)).toBeVisible();

  const cards = await landingCards(page);
  expect(cards.find((c) => c.slug === placeholder.slug)?.semester).toBe(subject.semester);
});

test("quitar una materia pide confirmación y la saca de la landing", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Gestionar" }).click();

  const card = page.locator(cardOf(placeholder.slug));
  // El nombre accesible del botón dice QUÉ materia se quita (U41).
  await card.getByRole("button", { name: `Quitar ${placeholder.name}`, exact: true }).click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("QUITAR DE SUS MATERIAS");
  await expect(dialog).toContainText(placeholder.name);
  await expect(dialog).toContainText("su progreso se conserva");

  await dialog.getByRole("button", { name: "Quitar materia" }).click();

  await expect(page.locator(cardOf(placeholder.slug))).toHaveCount(0);
  const cards = await landingCards(page);
  expect(cards.some((c) => c.slug === placeholder.slug)).toBe(false);
});

test("agregar materia desde el diálogo crea la tarjeta", async ({ page }) => {
  const nueva = {
    name: "Álgebra E2E",
    slug: "algebra-e2e",
    code: "22.03",
    institution: "ITBA",
    semester: "2024-1C",
  };

  await page.goto("/");
  await page.getByRole("button", { name: "Agregar materia" }).first().click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("NUEVA MATERIA");

  await dialog.getByLabel("Nombre").fill(nueva.name);
  await dialog.getByLabel("Código").fill(nueva.code);
  await dialog.getByLabel("Institución").fill(nueva.institution);
  await dialog.getByLabel("Cuatrimestre", { exact: true }).selectOption({ label: "Nuevo…" });
  await dialog.getByLabel("Nuevo cuatrimestre").fill(nueva.semester);
  await dialog.getByLabel("Singular").fill("Capítulo");
  await dialog.getByLabel("Abreviatura").fill("C");
  await dialog.getByLabel("Plural").fill("Capítulos");

  // El slug se deriva del nombre.
  await expect(dialog.getByLabel("Dirección (/m/…)")).toHaveValue(nueva.slug);

  await dialog.getByRole("button", { name: "Agregar materia" }).click();

  const creada = page.locator(cardOf(nueva.slug));
  await expect(creada).toBeVisible();
  await expect(creada).toContainText(nueva.code);
  await expect(creada).toContainText("0 capítulos · 0 páginas");
  await expect(page.getByRole("button", { name: new RegExp(semesterLabel(nueva.semester)) })).toBeVisible();

  const cards = await landingCards(page);
  expect(cards.some((c) => c.slug === nueva.slug)).toBe(true);
});

/**
 * Lo nuevo del sitio estático (S4 · §2.2): quitar una materia del catálogo no la
 * borra —no es de nadie: está compilada en el sitio—, la ESCONDE. El diálogo
 * «Agregar materia» ofrece primero esas materias escondidas, antes que el
 * formulario para inventar una.
 */
test("una materia del catálogo que se quitó vuelve desde el diálogo", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Gestionar" }).click();
  await page
    .locator(cardOf(subject.slug))
    .getByRole("button", { name: `Quitar ${subject.name}`, exact: true })
    .click();
  await page.getByRole("dialog").getByRole("button", { name: "Quitar materia" }).click();
  await expect(page.locator(cardOf(subject.slug))).toHaveCount(0);

  await page.getByRole("button", { name: "Agregar materia" }).first().click();
  const dialog = page.getByRole("dialog");
  const catalogo = dialog.getByRole("radiogroup", { name: "Materias del catálogo" });
  await expect(catalogo).toBeVisible();

  const fila = catalogo.getByRole("radio", { name: new RegExp(subject.name) });
  await expect(fila).toBeVisible();
  await fila.click();
  await expect(fila).toHaveAttribute("aria-checked", "true");
  // Elegida una materia del catálogo, el formulario de materia nueva desaparece.
  await expect(dialog.getByLabel("Nombre")).toHaveCount(0);

  await dialog.getByLabel("Cuatrimestre", { exact: true }).selectOption(subject.semester);
  await dialog.getByRole("button", { name: "Agregar materia" }).click();

  const vuelta = page.locator(cardOf(subject.slug));
  await expect(vuelta).toBeVisible();
  await expect(vuelta).not.toContainText("Sin sincronizar");
  const cards = await landingCards(page);
  expect(cards.find((c) => c.slug === subject.slug)?.semester).toBe(subject.semester);
});

test("sin materias muestra el estado vacío", async ({ page }) => {
  /* La landing vacía es el catálogo entero escondido y ninguna placeholder: la
     única forma de no tener materias cuando el sitio trae las suyas. */
  const doc = await snapshot(page);
  const todas = (await landingCards(page)).map((c) => c.slug);
  await restore(page, {
    ...doc,
    landing: { ...doc.landing, hidden: todas, placeholders: [], placements: {} },
  });

  await page.goto("/");
  await expect(page.getByText("Todavía no hay materias")).toBeVisible();
  await expect(page.getByRole("button", { name: "Agregar la primera materia" })).toBeVisible();
  // Con la landing vacía desaparecen las acciones de la cabecera.
  await expect(page.getByRole("button", { name: "Gestionar" })).toHaveCount(0);
});
