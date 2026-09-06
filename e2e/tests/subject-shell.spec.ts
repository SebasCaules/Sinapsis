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

  /* SLOT: los que declara `rail[]` del config de la materia. Proba ya no trae
     el grupo «Material» (el usuario sacó el enlace al campus), así que queda
     solo «Resolver»: la lista sale del config sembrado, no de la plataforma. */
  const slotLabels = await slots.evaluateAll((nodes) => nodes.map((n) => n.getAttribute("aria-label") ?? ""));
  expect(slotLabels).toEqual(["Resolver"]);
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

test("ocultar el índice desde el rail lo esconde y sobrevive a la recarga", async ({ page }) => {
  await expect(panel(page)).toBeVisible();

  // El botón del rail se llama «Ocultar el índice» / «Mostrar el índice».
  await rail(page).getByRole("button", { name: "Ocultar el índice" }).click();
  await expect(panel(page)).toHaveCount(0);

  await page.reload();
  await waitForSubjectShell(page);
  await expect(panel(page)).toHaveCount(0);

  // Se deja el shell como estaba para el resto de la suite.
  await rail(page).getByRole("button", { name: "Mostrar el índice" }).click();
  await expect(panel(page)).toBeVisible();
});

test("las migas de una página ofrecen el salto a «Todo el wiki»", async ({ page }) => {
  await page.goto(`${home}/p/${seed.readerPage.slug}`);
  await waitForSubjectShell(page);

  const wiki = crumbs(page).getByRole("link", { name: "Todo el wiki" });
  await expect(wiki).toBeVisible();
  await wiki.click();
  await expect(page).toHaveURL(new RegExp(`${home}/wiki$`));
});

test("la paleta con la consulta vacía lista las herramientas por sección y ⌘K la cierra", async ({ page }) => {
  await page.keyboard.press("ControlOrMeta+k");
  const dialog = page.getByRole("dialog", { name: "Buscar en la materia" });
  await expect(dialog).toBeVisible();

  // Sin escribir nada ya hay a dónde ir, agrupado por intención.
  await expect(dialog.getByRole("group", { name: "Mi ruta" })).toBeVisible();
  await expect(dialog.getByRole("group", { name: "Consultar" })).toBeVisible();
  await expect(dialog.getByRole("option").first()).toContainText("Inicio");

  // El mismo atajo la cierra.
  await page.keyboard.press("ControlOrMeta+k");
  await expect(dialog).toHaveCount(0);
});

test("el rail se recorre con las flechas ↑ y ↓", async ({ page }) => {
  const inicio = rail(page).getByRole("link", { name: "Inicio", exact: true });
  await inicio.focus();

  await page.keyboard.press("ArrowDown");
  const siguiente = await page.evaluate(() => document.activeElement?.getAttribute("aria-label") ?? "");
  expect(siguiente).not.toBe("Inicio");

  await page.keyboard.press("ArrowUp");
  await expect(inicio).toBeFocused();
});

test("por debajo de 900 px el índice es un cajón que abre el botón de menú", async ({ page }) => {
  await page.setViewportSize({ width: 700, height: 900 });
  await waitForSubjectShell(page);

  const abrir = header(page).getByRole("button", { name: "Abrir el índice" });
  await expect(abrir).toBeVisible();
  // Cerrado, el índice no tapa el contenido.
  await expect(panel(page)).toBeHidden();

  await abrir.click();
  await expect(panel(page)).toBeVisible();

  // El velo lo cierra.
  await page.getByTestId("drawer-scrim").click();
  await expect(panel(page)).toBeHidden();

  await page.setViewportSize({ width: 1440, height: 1024 });
  await expect(header(page).getByRole("button", { name: "Abrir el índice" })).toHaveCount(0);
});

test("al llegar al tope de pestañas avisa y no abre ninguna más", async ({ page }) => {
  const strip = page.getByRole("tablist", { name: "Pestañas de la materia" });
  const nueva = header(page).getByRole("button", { name: "Nueva pestaña" });

  for (let i = 1; i < 20; i += 1) await nueva.click();
  await expect(strip.getByRole("tab")).toHaveCount(20);

  await nueva.click();
  await expect(page.getByText("Máximo de pestañas abiertas (20)")).toBeVisible();
  await expect(strip.getByRole("tab")).toHaveCount(20);
});

test("el selector de tema lista los tres temas y deja elegir", async ({ page }) => {
  await header(page).getByRole("button", { name: /^Tema: / }).click();
  const menu = page.getByRole("menu", { name: "Tema" });
  await expect(menu.getByRole("menuitemradio")).toHaveCount(3);

  await menu.getByRole("menuitemradio", { name: /Claustro/ }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "claustro");

  // Se deja el tema como estaba: el ajuste viaja al perfil.
  await header(page).getByRole("button", { name: /^Tema: / }).click();
  await page.getByRole("menu", { name: "Tema" }).getByRole("menuitemradio", { name: /Pergamino/ }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "pergamino");
});

test("el sello S vuelve a la landing", async ({ page }) => {
  await rail(page).getByRole("link", { name: "Volver a Sinapsis" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { name: "Materias", level: 1 })).toBeVisible();
});
