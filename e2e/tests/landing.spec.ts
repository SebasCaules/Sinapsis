/**
 * Landing: las tarjetas de materia, el agrupado por cuatrimestre, el modo
 * gestión (mover y quitar), el alta desde el diálogo y el estado vacío.
 *
 * Todas las pruebas de este archivo reponen la landing sembrada antes y después
 * de correr: comparten una única base con el resto de la suite.
 */
import { expect, test } from "@playwright/test";
import { landingCards, resetLanding, resetProgress, withApi } from "../support/app";
import { API_ORIGIN, readSeed } from "../support/seed";

const seed = readSeed();
const subject = seed.subject;
const placeholder = seed.placeholder;

/** "2026-1C" → "Cuatrimestre 1 · 2026". */
function semesterLabel(raw: string): string {
  const m = raw.match(/^(\d{4})-(\d)C$/);
  return m ? `Cuatrimestre ${m[2]} · ${m[1]}` : raw;
}

const subjectSemester = semesterLabel(subject.semester);
const placeholderSemester = semesterLabel(placeholder.semester);

const cardOf = (slug: string) => `[data-testid="subject-card"][data-slug="${slug}"]`;

test.beforeEach(async ({ request }) => {
  await resetLanding(request);
  await resetProgress(request, subject.slug);
});

test.afterAll(async () => {
  await withApi(resetLanding);
});

test("muestra la materia sincronizada con su código y sin comenzar", async ({ page, request }) => {
  const cards = await landingCards(request);
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
  // La materia sincronizada NO lleva el sello "Sin sincronizar"; la placeholder sí.
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

test("gestionar: mover una materia de cuatrimestre y guardar sobrevive a la recarga", async ({ page, request }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Gestionar" }).click();

  const mover = page.getByLabel(`Mover ${placeholder.name} a otro cuatrimestre`);
  await expect(mover).toBeVisible();
  await mover.selectOption(subject.semester);

  await page.getByRole("button", { name: "Guardar" }).click();
  await expect(page.getByText("Landing guardada.")).toBeVisible();

  await page.reload();
  const seccion = page.locator("section").filter({ hasText: subjectSemester }).first();
  await expect(seccion.locator(`[data-slug="${placeholder.slug}"]`)).toBeVisible();

  const cards = await landingCards(request);
  expect(cards.find((c) => c.slug === placeholder.slug)?.semester).toBe(subject.semester);
});

test("quitar una materia pide confirmación y la saca de la landing", async ({ page, request }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Gestionar" }).click();

  const card = page.locator(cardOf(placeholder.slug));
  await card.getByRole("button", { name: "Quitar", exact: true }).click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("QUITAR DE LA LANDING");
  await expect(dialog).toContainText(placeholder.name);
  await expect(dialog).toContainText("su progreso se conserva");

  await dialog.getByRole("button", { name: "Quitar materia" }).click();

  await expect(page.locator(cardOf(placeholder.slug))).toHaveCount(0);
  const cards = await landingCards(request);
  expect(cards.some((c) => c.slug === placeholder.slug)).toBe(false);
});

test("agregar materia desde el diálogo crea la tarjeta", async ({ page, request }) => {
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
  await expect(dialog).toContainText("CONTRATO DE MATERIA");

  await dialog.getByLabel("Nombre").fill(nueva.name);
  await dialog.getByLabel("Código").fill(nueva.code);
  await dialog.getByLabel("Institución").fill(nueva.institution);
  await dialog.getByLabel("Cuatrimestre", { exact: true }).selectOption({ label: "Nuevo…" });
  await dialog.getByLabel("Nuevo cuatrimestre").fill(nueva.semester);
  await dialog.getByLabel("Singular").fill("Capítulo");
  await dialog.getByLabel("Abreviatura").fill("C");
  await dialog.getByLabel("Plural").fill("Capítulos");

  // El slug se deriva del nombre.
  await expect(dialog.getByLabel("Slug")).toHaveValue(nueva.slug);

  await dialog.getByRole("button", { name: "Agregar materia" }).click();

  const creada = page.locator(cardOf(nueva.slug));
  await expect(creada).toBeVisible();
  await expect(creada).toContainText(nueva.code);
  await expect(creada).toContainText("0 capítulos · 0 páginas");
  await expect(page.getByRole("button", { name: new RegExp(semesterLabel(nueva.semester)) })).toBeVisible();

  const cards = await landingCards(request);
  expect(cards.some((c) => c.slug === nueva.slug)).toBe(true);

  await request.delete(`${API_ORIGIN}/api/subjects/${nueva.slug}/landing`);
});

/* Destructivo: vacía la landing entera. Va último del archivo y `afterAll` repone. */
test("sin materias muestra el estado vacío", async ({ page, request }) => {
  for (const card of await landingCards(request)) {
    await request.delete(`${API_ORIGIN}/api/subjects/${card.slug}/landing`);
  }
  expect(await landingCards(request)).toHaveLength(0);

  await page.goto("/");
  await expect(page.getByText("Todavía no hay materias")).toBeVisible();
  await expect(page.getByRole("button", { name: "Agregar la primera materia" })).toBeVisible();
  // Con la landing vacía desaparecen las acciones de la cabecera.
  await expect(page.getByRole("button", { name: "Gestionar" })).toHaveCount(0);
});
