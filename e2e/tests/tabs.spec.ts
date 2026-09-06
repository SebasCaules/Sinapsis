/**
 * Pestañas de la materia (N0-29): ⌘/Ctrl-clic sobre un enlace interno abre una
 * pestaña nueva y salta a ella, el botón del medio la abre en segundo plano, el
 * clic en una pestaña navega y la marca activa, la ✕ la cierra, la barra
 * sobrevive a la recarga y ⌘⇧] pasa a la siguiente.
 *
 * El estado de las pestañas vive en `localStorage` (`sinapsis.<slug>.tabs`), y
 * cada prueba de Playwright arranca con un contexto limpio (el `storageState`
 * sembrado solo trae la cookie), así que el aislamiento es automático: cada
 * prueba empieza con una única pestaña «Inicio».
 */
import { expect, test, type Locator, type Page } from "@playwright/test";
import { waitForSubjectShell } from "../support/app";
import { readSeed } from "../support/seed";

const seed = readSeed();
const subject = seed.subject;
const home = `/m/${subject.slug}`;

const panel = (page: Page) => page.locator('aside[aria-label^="Índice de"]');
const strip = (page: Page) => page.getByRole("tablist", { name: "Pestañas de la materia" });
const tabs = (page: Page) => strip(page).getByRole("tab");

/** La pestaña marcada `aria-selected="true"` (siempre hay exactamente una). */
const activeTab = (page: Page): Locator => tabs(page).and(page.locator('[aria-selected="true"]'));

async function openHome(page: Page): Promise<void> {
  await page.goto(home);
  await waitForSubjectShell(page);
  await expect(tabs(page)).toHaveCount(1);
}

/** Despliega la división del índice y devuelve sus enlaces de página. */
async function pageLinks(page: Page) {
  await panel(page).locator(`[data-division="${seed.readerPage.division}"]`).click();
  const links = panel(page).locator(`a[href^="${home}/p/"]`);
  await expect(links.first()).toBeVisible();
  return links;
}

/**
 * Título de una fila del índice. La fila NO lleva `title` (la cubre la tarjeta
 * de vista previa del shell), así que se lee del segundo `span`: el primero es
 * el número de orden.
 */
async function linkTitle(link: Locator): Promise<string> {
  return (await link.locator("span").nth(1).innerText()).trim();
}

/**
 * Abre las dos primeras páginas del índice en pestañas nuevas con ⌘-clic.
 * Como en el baseline (core.js:2531), ⌘-clic SALTA a la pestaña nueva: al
 * terminar, la activa es la segunda página.
 */
async function openTwoPageTabs(page: Page): Promise<Array<{ href: string; title: string }>> {
  const links = await pageLinks(page);

  const opened: Array<{ href: string; title: string }> = [];
  for (const i of [0, 1]) {
    const link = links.nth(i);
    const href = (await link.getAttribute("href")) ?? "";
    const title = await linkTitle(link);
    // `modifiers` de Playwright: "ControlOrMeta" es ⌘ en macOS y Ctrl en el resto.
    await link.click({ modifiers: ["ControlOrMeta"] });
    await expect(tabs(page)).toHaveCount(opened.length + 2);
    await expect(page).toHaveURL(new RegExp(`${href}$`));
    opened.push({ href, title });
  }
  return opened;
}

test("⌘-clic abre la pestaña nueva y salta a ella", async ({ page }) => {
  await openHome(page);
  const opened = await openTwoPageTabs(page);
  const ultima = opened[1];
  if (!ultima) throw new Error("no se abrieron las dos pestañas");

  await expect(tabs(page)).toHaveCount(3);
  await expect(activeTab(page)).toHaveCount(1);
  await expect(activeTab(page)).toContainText(ultima.title);
  await expect(page).toHaveURL(new RegExp(`${ultima.href}$`));
  await expect(page.getByRole("heading", { level: 1, name: ultima.title, exact: true })).toBeVisible();
  await expect(tabs(page).nth(1)).toContainText(opened[0]?.title ?? "");
});

test("el clic con el botón del medio abre la pestaña en segundo plano", async ({ page }) => {
  await openHome(page);
  const links = await pageLinks(page);
  const link = links.first();
  const title = await linkTitle(link);

  await link.click({ button: "middle" });

  await expect(tabs(page)).toHaveCount(2);
  await expect(tabs(page).nth(1)).toContainText(title);
  // La otra puerta: ni la URL ni el contenido se movieron.
  await expect(page).toHaveURL(new RegExp(`${home}$`));
  await expect(activeTab(page)).toContainText("Inicio");
});

test("el clic en una pestaña navega a su ruta y la marca activa", async ({ page }) => {
  await openHome(page);
  const opened = await openTwoPageTabs(page);
  const target = opened[0];
  if (!target) throw new Error("no se abrieron las dos pestañas");

  await tabs(page).nth(1).click();

  await expect(page).toHaveURL(new RegExp(`${target.href}$`));
  await expect(page.getByRole("heading", { level: 1, name: target.title, exact: true })).toBeVisible();
  await expect(tabs(page).nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(tabs(page).nth(0)).toHaveAttribute("aria-selected", "false");
});

test("la ✕ cierra la pestaña y las que quedan sobreviven a la recarga", async ({ page }) => {
  await openHome(page);
  const opened = await openTwoPageTabs(page);
  const cerrada = opened[1];
  if (!cerrada) throw new Error("no se abrieron las dos pestañas");

  await tabs(page).nth(2).getByRole("button", { name: `Cerrar «${cerrada.title}»` }).click();
  await expect(tabs(page)).toHaveCount(2);
  // Se cerró la activa: manda la vecina de la izquierda (la otra página).
  await expect(page).toHaveURL(new RegExp(`${opened[0]?.href}$`));

  await page.reload();
  await waitForSubjectShell(page);
  await expect(tabs(page)).toHaveCount(2);
  await expect(tabs(page).nth(0)).toContainText("Inicio");
  await expect(tabs(page).nth(1)).toContainText(opened[0]?.title ?? "");
});

test("⌘⇧] pasa a la pestaña siguiente", async ({ page }) => {
  await openHome(page);
  await openTwoPageTabs(page);

  // La activa es la última: la siguiente da la vuelta hasta «Inicio».
  await page.keyboard.press("ControlOrMeta+Shift+BracketRight");

  await expect(tabs(page).nth(0)).toHaveAttribute("aria-selected", "true");
  await expect(page).toHaveURL(new RegExp(`${home}$`));
  await expect(page.getByRole("heading", { name: "Progreso", level: 1 })).toBeVisible();
});
