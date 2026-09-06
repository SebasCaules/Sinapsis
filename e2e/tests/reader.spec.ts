/**
 * Lector: prosa con KaTeX, wikilinks navegables, columna derecha (índice de la
 * página y backlinks), marcar como estudiada (con eco en el índice, en el
 * progreso del inicio y tras recargar) y navegación a la página siguiente.
 */
import { expect, test, type Page } from "@playwright/test";
import { resetProgress, waitForSubjectShell, withApi } from "../support/app";
import { readSeed } from "../support/seed";

const seed = readSeed();
const subject = seed.subject;
const target = seed.readerPage;
const readerUrl = `/m/${subject.slug}/p/${target.slug}`;

const panel = (page: Page) => page.locator('aside[aria-label^="Índice de"]');
const toc = (page: Page) => page.locator('section[aria-labelledby="reader-toc"]');
const backlinks = (page: Page) => page.locator('section[aria-labelledby="reader-backlinks"]');
const sheet = (page: Page) => page.locator("article").first();

async function openReader(page: Page): Promise<void> {
  await page.goto(readerUrl);
  await waitForSubjectShell(page);
  await expect(page.getByRole("heading", { level: 1, name: target.title })).toBeVisible();
}

test.beforeEach(async ({ request }) => {
  await resetProgress(request, subject.slug);
});

test.afterAll(async () => {
  await withApi((api) => resetProgress(api, subject.slug));
});

test("dibuja el título y la matemática de la página", async ({ page }) => {
  await openReader(page);

  const displays = sheet(page).locator(".katex-display");
  await expect(displays.first()).toBeVisible();
  expect(await displays.count()).toBeGreaterThanOrEqual(1);
  expect(await sheet(page).locator(".katex").count()).toBeGreaterThan(3);
});

test("un wikilink interno navega a otra página de la materia", async ({ page }) => {
  await openReader(page);

  const wikilink = sheet(page).locator("a.wikilink").first();
  await expect(wikilink).toBeVisible();
  const href = await wikilink.getAttribute("href");
  expect(href).toMatch(new RegExp(`^/m/${subject.slug}/p/`));

  await wikilink.click();
  await expect(page).toHaveURL(new RegExp(`/m/${subject.slug}/p/`));
  expect(page.url()).not.toContain(`/p/${target.slug}`);
  await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
});

test("la columna derecha trae el índice de la página y los backlinks", async ({ page }) => {
  await openReader(page);

  await expect(toc(page)).toContainText("EN ESTA PÁGINA");
  expect(await toc(page).getByRole("link").count()).toBeGreaterThanOrEqual(3);

  await expect(backlinks(page)).toContainText("ENLAZAN AQUÍ");
  expect(await backlinks(page).getByRole("link").count()).toBeGreaterThanOrEqual(1);
});

test("marcar estudiado se refleja en el índice, en el progreso y tras recargar", async ({ page }) => {
  await openReader(page);

  const boton = page.getByRole("button", { name: "Marcar estudiado" });
  await expect(boton).toHaveAttribute("aria-pressed", "false");
  await boton.click();

  const estudiada = page.getByRole("button", { name: "Estudiada" });
  await expect(estudiada).toBeVisible();
  await expect(estudiada).toHaveAttribute("aria-pressed", "true");

  // El índice marca la página con el tilde «Estudiada».
  const fila = panel(page).getByRole("link", { name: new RegExp(target.title) }).first();
  await expect(fila.getByRole("img", { name: "Estudiada" })).toBeVisible();

  await page.reload();
  await waitForSubjectShell(page);
  await expect(page.getByRole("button", { name: "Estudiada" })).toHaveAttribute("aria-pressed", "true");

  // El inicio de la materia cuenta 1 página leída.
  await page.goto(`/m/${subject.slug}`);
  await waitForSubjectShell(page);
  await expect(page.getByText(/^1 \/ \d+ páginas$/)).toBeVisible();
});

test("«Siguiente» avanza dentro de la división", async ({ page }) => {
  await openReader(page);

  const migas = page.locator('nav[aria-label="Migas de pan"]');
  // Migas: casita · materia · división · página; la división es el último enlace.
  const divisionAntes = await migas.getByRole("link").last().innerText();

  const siguiente = page.getByRole("link", { name: /^Siguiente: / });
  await expect(siguiente).toBeVisible();
  const rotulo = (await siguiente.innerText()).replace(/^Siguiente:\s*/, "").replace(/\s*→$/, "").trim();

  await siguiente.click();
  await expect(page).toHaveURL(new RegExp(`/m/${subject.slug}/p/`));
  await expect(page.getByRole("heading", { level: 1, name: rotulo })).toBeVisible();
  // Sigue dentro de la misma división.
  await expect(migas.getByRole("link").last()).toHaveText(divisionAntes);
});
