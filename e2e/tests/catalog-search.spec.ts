/**
 * Catálogo («Todo el wiki») y búsqueda: el filtro por división que viaja en la
 * URL, el filtro de texto y la paleta ⌘K / Ctrl+K contra el API.
 */
import { expect, test, type Page } from "@playwright/test";
import { waitForSubjectShell } from "../support/app";
import { readSeed } from "../support/seed";

const seed = readSeed();
const subject = seed.subject;
const filtro = seed.filterPage;
const paleta = seed.palette;
const wikiUrl = `/m/${subject.slug}/wiki`;

/** Tarjetas del catálogo: los enlaces a páginas dentro del área de contenido. */
const cards = (page: Page) => page.locator(`main a[href^="/m/${subject.slug}/p/"]`);

async function openCatalog(page: Page, query = ""): Promise<void> {
  await page.goto(`${wikiUrl}${query}`);
  await waitForSubjectShell(page);
  await expect(page.getByRole("heading", { name: "Todo el wiki", level: 1 })).toBeVisible();
}

test("?d= recorta el catálogo a una sola división", async ({ page }) => {
  await openCatalog(page);
  const total = await cards(page).count();
  expect(total).toBeGreaterThan(0);

  await openCatalog(page, `?d=${seed.catalogDivision}`);

  // Queda un solo grupo de división y menos tarjetas que sin filtrar.
  await expect(page.getByRole("heading", { level: 2 })).toHaveCount(1);
  const filtradas = await cards(page).count();
  expect(filtradas).toBeGreaterThan(0);
  expect(filtradas).toBeLessThan(total);
  await expect(page.getByText(new RegExp(`^${filtradas} entradas?$`))).toBeVisible();
});

test("el filtro de texto deja la tarjeta buscada", async ({ page }) => {
  await openCatalog(page);
  const total = await cards(page).count();

  await page.getByLabel("Filtrar el catálogo").fill(filtro.term);

  const buscada = cards(page).filter({ hasText: filtro.title });
  await expect(buscada).toHaveCount(1);
  await expect(buscada).toBeVisible();

  const filtradas = await cards(page).count();
  expect(filtradas).toBeLessThan(total);
  await expect(page.getByText(new RegExp(`^${filtradas} entradas?$`))).toBeVisible();

  // El filtro viaja en la URL para poder compartir el recorte.
  await expect(page).toHaveURL(/[?&]q=/);
});

test("⌘K abre la paleta y Enter navega al lector", async ({ page }) => {
  await page.goto(`/m/${subject.slug}`);
  await waitForSubjectShell(page);

  await page.keyboard.press("ControlOrMeta+k");
  const dialog = page.getByRole("dialog", { name: "Buscar en la materia" });
  await expect(dialog).toBeVisible();

  await dialog.getByLabel("Buscar páginas").fill(paleta.term);

  const primera = dialog.getByRole("option").first();
  await expect(primera).toContainText(paleta.expected);

  await page.keyboard.press("Enter");
  await expect(dialog).toHaveCount(0);
  await expect(page).toHaveURL(new RegExp(`/m/${subject.slug}/p/`));
  await expect(page.getByRole("heading", { level: 1, name: paleta.expected })).toBeVisible();
});
