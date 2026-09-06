/**
 * Figuras interactivas del lector (Sprint 3 · N0-42): el callout
 * `> [!figura] id` deja un hueco (`figure.figura > .fig-host`) y, si la materia
 * trae un bundle de figuras cargado, el runtime dibuja adentro.
 *
 * La página y el id de la figura los elige la siembra (`.auth/seed.json`), que
 * además comprueba que algún script del bundle registre esa figura: acá se mira
 * el resultado en el navegador.
 *
 * La segunda prueba es la regresión de N0-47 (el compilador normaliza los `$$`
 * de display): `tecnica-derivadas-parciales` se truncaba y llegaba a la mitad.
 */
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";
import { waitForSubjectShell } from "../support/app";
import { isProba, readSeed, SHOTS_DIR } from "../support/seed";

const seed = readSeed();
const subject = seed.subject;
const target = seed.figurePage;

const sheet = (page: Page) => page.locator("article").first();
const figure = (page: Page) => sheet(page).locator(`figure.figura[data-fig="${target.fig}"]`);

async function openPage(page: Page, slug: string): Promise<void> {
  await page.goto(`/m/${subject.slug}/p/${slug}`);
  await waitForSubjectShell(page);
  await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
}

test("la página con figura la monta dentro del hueco del callout", async ({ page }) => {
  await openPage(page, target.slug);

  await expect(figure(page)).toBeVisible();
  // Lo que dibuja el bundle vive DENTRO del hueco, no en cualquier lado.
  const dibujo = figure(page).locator(".fig-host canvas, .fig-host svg");
  await expect(dibujo.first()).toBeVisible();

  // El marco de reserva y el aviso de figura sin registrar se fueron.
  await expect(figure(page).locator(".figFrame")).toHaveCount(0);
  await expect(figure(page).locator(".fig-missing")).toHaveCount(0);

  /* El epígrafe se lee igual, y ahora SIN rótulo delante (§ lector-18): el
     baseline (`makeFigure`) mueve los nodos al `figcaption` sin anteponer nada,
     así que el epígrafe empieza en el texto que escribió el wiki. El id —el
     primer token de `> [!figura] <id>`— es el nombre interno del bundle, no
     texto para el lector: sigue donde lo busca `mountFigures` (`data-fig`, que
     esta misma prueba afirma arriba) y no se filtra al epígrafe. */
  const epigrafe = figure(page).locator("figcaption");
  await expect(epigrafe).toBeVisible();
  await expect(epigrafe.locator(".figLabel")).toHaveCount(0);
  await expect(epigrafe).not.toContainText(target.fig);
  expect(((await epigrafe.innerText()) || "").trim().length).toBeGreaterThan(10);

  await figure(page).scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(SHOTS_DIR, `figura-${target.fig}.png`) });
});

test("todas las figuras de la página dibujan en su hueco", async ({ page }) => {
  await openPage(page, target.slug);

  const huecos = sheet(page).locator("figure.figura[data-fig]");
  const total = await huecos.count();
  expect(total).toBeGreaterThanOrEqual(1);

  for (let i = 0; i < total; i += 1) {
    const hueco = huecos.nth(i);
    const id = await hueco.getAttribute("data-fig");
    await expect(
      hueco.locator(".fig-host canvas, .fig-host svg").first(),
      `la figura «${id}» no dibujó`,
    ).toBeVisible({ timeout: 10_000 });
    await expect(hueco.locator(".fig-missing"), `la figura «${id}» no está registrada`).toHaveCount(0);
  }
});

test("«tecnica-derivadas-parciales» llega entera y sin matemática rota (N0-47)", async ({ page }) => {
  test.skip(!isProba(), "la regresión es de una página del vault real de Proba");
  await openPage(page, "tecnica-derivadas-parciales");

  await expect(page.getByRole("heading", { level: 1, name: "Derivadas parciales" })).toBeVisible();

  // La página se truncaba: sin sus seis secciones, la mitad de abajo no llegaba.
  expect(await sheet(page).locator("h2").count()).toBeGreaterThanOrEqual(6);
  expect(await sheet(page).locator(".katex-display").count()).toBeGreaterThanOrEqual(1);
  expect(await sheet(page).locator(".katex-error").count()).toBe(0);
  await expect(sheet(page)).not.toContainText("undefined");
});
