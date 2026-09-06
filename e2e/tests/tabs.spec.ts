/**
 * Pestañas de la materia (N0-29): ⌘/Ctrl-clic sobre un enlace interno abre una
 * pestaña nueva SIN moverse, el clic en una pestaña navega y la marca activa, la
 * ✕ la cierra, la barra sobrevive a la recarga y ⌘⇧] pasa a la siguiente.
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

/**
 * Despliega una división del índice y ⌘-clickea sus dos primeras páginas.
 * Devuelve la ruta y el título de cada una, en el orden en que se abrieron.
 */
async function openTwoPageTabs(page: Page): Promise<Array<{ href: string; title: string }>> {
  await panel(page).locator(`[data-division="${seed.readerPage.division}"]`).click();

  const links = panel(page).locator(`a[href^="${home}/p/"]`);
  await expect(links.first()).toBeVisible();

  const opened: Array<{ href: string; title: string }> = [];
  for (const i of [0, 1]) {
    const link = links.nth(i);
    const href = (await link.getAttribute("href")) ?? "";
    const title = (await link.getAttribute("title")) ?? "";
    // `modifiers` de Playwright: "ControlOrMeta" es ⌘ en macOS y Ctrl en el resto.
    await link.click({ modifiers: ["ControlOrMeta"] });
    await expect(tabs(page)).toHaveCount(opened.length + 2);
    opened.push({ href, title });
  }
  return opened;
}

test("⌘-clic sobre dos páginas del índice abre dos pestañas sin navegar", async ({ page }) => {
  await openHome(page);
  const opened = await openTwoPageTabs(page);

  // Ni la URL ni el contenido se movieron: las pestañas nuevas quedan en segundo plano.
  await expect(page).toHaveURL(new RegExp(`${home}$`));
  await expect(page.getByRole("heading", { name: "Progreso", level: 1 })).toBeVisible();

  await expect(tabs(page)).toHaveCount(3);
  await expect(activeTab(page)).toHaveCount(1);
  await expect(activeTab(page)).toContainText("Inicio");
  await expect(tabs(page).nth(1)).toContainText(opened[0]?.title ?? "");
  await expect(tabs(page).nth(2)).toContainText(opened[1]?.title ?? "");
});

test("el clic en una pestaña navega a su ruta y la marca activa", async ({ page }) => {
  await openHome(page);
  const opened = await openTwoPageTabs(page);
  const target = opened[1];
  if (!target) throw new Error("no se abrieron las dos pestañas");

  await tabs(page).nth(2).click();

  await expect(page).toHaveURL(new RegExp(`${target.href}$`));
  await expect(page.getByRole("heading", { level: 1, name: target.title, exact: true })).toBeVisible();
  await expect(tabs(page).nth(2)).toHaveAttribute("aria-selected", "true");
  await expect(tabs(page).nth(0)).toHaveAttribute("aria-selected", "false");
});

test("la ✕ cierra la pestaña y las que quedan sobreviven a la recarga", async ({ page }) => {
  await openHome(page);
  const opened = await openTwoPageTabs(page);
  const cerrada = opened[1];
  if (!cerrada) throw new Error("no se abrieron las dos pestañas");

  await tabs(page).nth(2).getByRole("button", { name: `Cerrar «${cerrada.title}»` }).click();
  await expect(tabs(page)).toHaveCount(2);
  // Se cerró una pestaña de fondo: la activa no se mueve.
  await expect(page).toHaveURL(new RegExp(`${home}$`));

  await page.reload();
  await waitForSubjectShell(page);
  await expect(tabs(page)).toHaveCount(2);
  await expect(tabs(page).nth(0)).toContainText("Inicio");
  await expect(tabs(page).nth(1)).toContainText(opened[0]?.title ?? "");
});

test("⌘⇧] pasa a la pestaña siguiente", async ({ page }) => {
  await openHome(page);
  const opened = await openTwoPageTabs(page);
  const primera = opened[0];
  if (!primera) throw new Error("no se abrieron las dos pestañas");

  await page.keyboard.press("ControlOrMeta+Shift+BracketRight");

  await expect(tabs(page).nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(page).toHaveURL(new RegExp(`${primera.href}$`));
  await expect(page.getByRole("heading", { level: 1, name: primera.title, exact: true })).toBeVisible();
});
