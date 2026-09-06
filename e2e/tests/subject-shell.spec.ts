/**
 * Shell de materia: la geometría fija del contrato (rail 52 · panel 250 ·
 * cabecera 40 · migas 28), los grupos FIJOS y SLOT del rail, el hero y el árbol
 * del índice, el plegado persistente y el sello de vuelta a la landing.
 */
import { expect, test, type Page } from "@playwright/test";
import { waitForSubjectShell } from "../support/app";
import { readSeed } from "../support/seed";

const seed = readSeed();
const subject = seed.subject;
const home = `/m/${subject.slug}`;

const rail = (page: Page) => page.locator('nav[aria-label="Secciones de la materia"]');
const panel = (page: Page) => page.locator('aside[aria-label^="Índice de"]');
const crumbs = (page: Page) => page.locator('nav[aria-label="Migas de pan"]');
const header = (page: Page) => page.getByTestId("subject-header");

test.beforeEach(async ({ page }) => {
  await page.goto(home);
  await waitForSubjectShell(page);
});

test("respeta la geometría fija: rail 52 · panel 250 · cabecera 40 · migas 28", async ({ page }) => {
  const medidas = {
    rail: await rail(page).boundingBox(),
    panel: await panel(page).boundingBox(),
    header: await header(page).boundingBox(),
    crumbs: await crumbs(page).boundingBox(),
  };

  expect(medidas.rail?.width).toBe(52);
  expect(medidas.panel?.width).toBe(250);
  expect(medidas.header?.height).toBe(40);
  expect(medidas.crumbs?.height).toBe(28);
});

test("el rail separa los grupos fijos de la plataforma de los slots de la materia", async ({ page }) => {
  const fijos = rail(page).locator('[data-slot="false"]');
  const slots = rail(page).locator('[data-slot="true"]');

  // FIJOS: «Mi ruta» y «Consultar» siempre; «Wiki» solo si la materia tiene
  // índice y registro sincronizados.
  const fijosLabels = await fijos.evaluateAll((nodes) => nodes.map((n) => n.getAttribute("aria-label") ?? ""));
  expect(fijosLabels).toContain("Mi ruta");
  expect(fijosLabels).toContain("Consultar");

  // SLOT: los que declara `rail[]` del config de la materia.
  const slotLabels = await slots.evaluateAll((nodes) => nodes.map((n) => n.getAttribute("aria-label") ?? ""));
  expect(slotLabels).toEqual(["Resolver", "Material"]);
});

test("el hero del índice muestra el nombre, el código y la institución", async ({ page }) => {
  await expect(panel(page).getByText(subject.name, { exact: true })).toBeVisible();
  await expect(panel(page).getByText(`${subject.code} · ${subject.institution}`)).toBeVisible();
});

test("el índice lista las divisiones bajo el rótulo del contrato", async ({ page }) => {
  await expect(panel(page).getByText(subject.divisionPlural, { exact: true })).toBeVisible();

  const filas = panel(page).getByTestId("division-row");
  // Todas las divisiones DECLARADAS que tienen páginas, más las sintéticas que
  // agrega la plataforma («meta» → Transversales para índice y registro).
  await expect(filas).toHaveCount(subject.divisionsVisible);
  for (const key of subject.divisionKeys) {
    await expect(panel(page).locator(`[data-division="${key}"]`)).toHaveCount(1);
  }
  expect(subject.divisionsDeclared).toBe(subject.divisionKeys.length);
});

test("plegar el índice desde el rail lo oculta y sobrevive a la recarga", async ({ page }) => {
  await expect(panel(page)).toBeVisible();

  await rail(page).getByRole("button", { name: "Plegar el índice" }).click();
  await expect(panel(page)).toHaveCount(0);

  await page.reload();
  await waitForSubjectShell(page);
  await expect(panel(page)).toHaveCount(0);

  // Se deja el shell como estaba para el resto de la suite.
  await rail(page).getByRole("button", { name: "Desplegar el índice" }).click();
  await expect(panel(page)).toBeVisible();
});

test("el sello S vuelve a la landing", async ({ page }) => {
  await rail(page).getByRole("link", { name: "Volver a Sinapsis" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { name: "Materias", level: 1 })).toBeVisible();
});
