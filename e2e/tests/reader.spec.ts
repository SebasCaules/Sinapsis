/**
 * Lector: prosa con KaTeX, wikilinks navegables, columna derecha (índice de la
 * página y backlinks), marcar como estudiada (con eco en el índice, en el
 * progreso del inicio y tras recargar) y navegación a la página siguiente.
 */
import { expect, test, type Page } from "@playwright/test";
import { resetProgress, waitForSubjectShell } from "../support/app";
import { readSeed } from "../support/seed";

const seed = readSeed();
const subject = seed.subject;
const target = seed.readerPage;
const readerUrl = `/m/${subject.slug}/p/${target.slug}`;

const panel = (page: Page) => page.locator('aside[aria-label^="Índice de"]');
const toc = (page: Page) => page.locator('section[aria-labelledby="reader-toc"]');
const sheet = (page: Page) => page.locator("article").first();

async function openReader(page: Page): Promise<void> {
  await page.goto(readerUrl);
  await waitForSubjectShell(page);
  await expect(page.getByRole("heading", { level: 1, name: target.title })).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await resetProgress(page, subject.slug);
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

test("la columna derecha trae el índice de la página y los apuntes, y nada más", async ({ page }) => {
  await openReader(page);

  await expect(toc(page)).toContainText("EN ESTA PÁGINA");
  expect(await toc(page).getByRole("link").count()).toBeGreaterThanOrEqual(3);

  /* Fuentes y «Enlazan aquí» salieron de la columna (decisión del usuario, N0-51):
     la columna es índice de la página + apuntes. */
  await expect(page.locator('section[aria-labelledby="reader-backlinks"]')).toHaveCount(0);
  await expect(page.locator('section[aria-labelledby="reader-sources"]')).toHaveCount(0);
  await expect(page.getByRole("heading", { name: /APUNTES/i }).or(page.getByText("APUNTES", { exact: true }))).toBeVisible();
});

test("marcar estudiado se refleja en el índice, en el progreso y tras recargar", async ({ page }) => {
  await openReader(page);

  const boton = page.getByRole("button", { name: "Marcar estudiado" }).first();
  await expect(boton).toHaveAttribute("aria-pressed", "false");
  await boton.click();

  const estudiada = page.getByRole("button", { name: "Estudiada" }).first();
  await expect(estudiada).toBeVisible();
  await expect(estudiada).toHaveAttribute("aria-pressed", "true");

  // El índice marca la página con el tilde «Estudiada».
  const fila = panel(page).getByRole("link", { name: new RegExp(target.title) }).first();
  await expect(fila.getByRole("img", { name: "Estudiada" })).toBeVisible();

  await page.reload();
  await waitForSubjectShell(page);
  await expect(page.getByRole("button", { name: "Estudiada" }).first()).toHaveAttribute("aria-pressed", "true");

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

  /* El paso al pie es el que lleva el título entero de la página siguiente (el
     de la barra de unidad va a secas, por decisión del usuario): dirección en el
     primer renglón, título en el segundo. */
  const siguiente = page.locator('nav[aria-label="Páginas vecinas"] a[data-dir="next"]');
  await expect(siguiente).toBeVisible();
  const renglones = (await siguiente.innerText())
    .split("\n")
    .map((linea) => linea.trim())
    .filter(Boolean);
  const rotulo = renglones[renglones.length - 1] ?? "";

  await siguiente.click();
  await expect(page).toHaveURL(new RegExp(`/m/${subject.slug}/p/`));
  await expect(page.getByRole("heading", { level: 1, name: rotulo })).toBeVisible();
  // Sigue dentro de la misma división.
  await expect(migas.getByRole("link").last()).toHaveText(divisionAntes);
});
