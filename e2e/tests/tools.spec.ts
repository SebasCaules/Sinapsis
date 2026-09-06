/**
 * Herramientas de la materia (Sprint 3 · N0-41): el bundle que publica
 * `sinapsis tools push` y que el shell monta en `/m/:materia/t/:vista`.
 *
 * Lo que se prueba es la costura, no el dibujo: que el rail abra los slots que
 * declara el config, que la vista se monte de verdad dentro de `.sinapsis-tool`
 * (con su título y algo dibujado), que sobreviva a un cambio de tema, que salir
 * y volver la vuelva a montar y que una vista que ningún bundle registra no
 * rompa nada.
 *
 * El bundle lo siembra `global-setup.ts`: el de verdad de Proba
 * (`examples/proba/tools/proba-tools`) o el mínimo `fixtures/mini-tools/`. Las
 * vistas y sus rótulos salen del manifiesto, por `.auth/seed.json`.
 */
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";
import { setUserTheme, subjectTools, waitForSubjectShell, withApi } from "../support/app";
import { readSeed, SHOTS_DIR } from "../support/seed";

const seed = readSeed();
const subject = seed.subject;
const tools = seed.tools;
/** La vista con la que corren las pruebas: la primera del manifiesto. */
const view = tools.view;

/** Vista que ningún bundle registra: el estado de «no está» del host. */
const VISTA_INEXISTENTE = "vista-que-no-existe";

const rail = (page: Page) => page.locator('nav[aria-label="Secciones de la materia"]');
const host = (page: Page) => page.getByTestId("tool-host");
/** El nodo que el host le presta al bundle, ya montado. */
const mounted = (page: Page, id: string) => page.locator(`.sinapsis-tool[data-view="${id}"]`);
/** Lo que dibuja la vista: un lienzo o un vectorial dentro del nodo del bundle. */
const drawing = (page: Page, id: string) => mounted(page, id).locator("canvas, svg");

/** Errores de consola y excepciones sin atrapar, desde antes de navegar. */
function watchErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (error) => errors.push(String(error)));
  return errors;
}

async function openTool(page: Page, id: string): Promise<void> {
  await page.goto(`/m/${subject.slug}/t/${id}`);
  await waitForSubjectShell(page);
}

/** Espera a que la vista esté montada y dibujando. */
async function expectMounted(page: Page, id: string): Promise<void> {
  await expect(mounted(page, id)).toBeVisible();
  await expect(mounted(page, id)).toHaveAttribute("data-tool", tools.id);
  await expect(drawing(page, id).first()).toBeVisible();
}

test.afterAll(async () => {
  // La prueba del tema escribe el del perfil (es global, N0-8).
  await withApi((api) => setUserTheme(api, "pergamino"));
});

test("el rail abre los slots de herramientas que declara la materia", async ({ page, request }) => {
  const published = await subjectTools(request, subject.slug);
  const info = published.find((t) => t.manifest.id === tools.id);
  expect(info, `la materia no publicó el bundle «${tools.id}»`).toBeDefined();
  expect(info?.manifest.views.map((v) => v.id)).toEqual(tools.views.map((v) => v.id));

  await page.goto(`/m/${subject.slug}`);
  await waitForSubjectShell(page);

  expect(seed.railTools.length).toBeGreaterThan(0);
  for (const item of seed.railTools) {
    const link = rail(page).getByRole("link", { name: item.label, exact: true });
    await expect(link).toHaveAttribute("href", `/m/${subject.slug}/t/${item.target}`);
  }

  // Al menos un slot abre una vista que el bundle registra de verdad.
  const registrados = seed.railTools.filter((item) => tools.views.some((v) => v.id === item.target));
  expect(registrados.length).toBeGreaterThan(0);
});

test("la vista de la materia se monta con su título y su dibujo", async ({ page }) => {
  const errores = watchErrors(page);
  await openTool(page, view.id);

  await expect(host(page)).toBeVisible();
  await expectMounted(page, view.id);
  // El título lo escribe el bundle; el rótulo es el del manifiesto.
  await expect(mounted(page, view.id).getByRole("heading", { name: view.label })).toBeVisible();

  await page.screenshot({ path: path.join(SHOTS_DIR, `herramienta-${view.id}.png`) });
  expect(errores).toEqual([]);
});

test("cambiar de tema desde la cabecera no rompe la vista montada", async ({ page }) => {
  const errores = watchErrors(page);
  await openTool(page, view.id);
  await expectMounted(page, view.id);

  const antes = await page.locator("html").getAttribute("data-theme");
  await page.getByRole("button", { name: /^Tema: / }).click();
  await expect(page.locator("html")).not.toHaveAttribute("data-theme", antes ?? "");

  // La vista sigue montada y dibujando (la vuelva a montar el host o se redibuje
  // sola: el bundle decide, la herramienta tiene que quedar en pie).
  await expectMounted(page, view.id);
  await expect(mounted(page, view.id).getByRole("heading", { name: view.label })).toBeVisible();

  const tema = await page.locator("html").getAttribute("data-theme");
  await page.screenshot({ path: path.join(SHOTS_DIR, `herramienta-${view.id}-${tema}.png`) });
  expect(errores).toEqual([]);
});

test("volver al inicio de la materia y regresar vuelve a montar la vista", async ({ page }) => {
  const errores = watchErrors(page);
  await openTool(page, view.id);
  await expectMounted(page, view.id);

  await rail(page).getByRole("link", { name: "Inicio", exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/m/${subject.slug}$`));
  await expect(page.getByRole("heading", { name: "Progreso", level: 1 })).toBeVisible();
  await expect(mounted(page, view.id)).toHaveCount(0);

  await page.goBack();
  await expect(page).toHaveURL(new RegExp(`/m/${subject.slug}/t/${view.id}$`));
  await expectMounted(page, view.id);
  await expect(mounted(page, view.id).getByRole("heading", { name: view.label })).toBeVisible();

  expect(errores).toEqual([]);
});

test("una vista que ningún bundle registra no rompe la materia", async ({ page }) => {
  const errores = watchErrors(page);
  await openTool(page, VISTA_INEXISTENTE);

  /* El host no puede decir «no existe» de una herramienta que la materia podría
     declarar más adelante: reserva el sitio y lo dice. */
  await expect(page.getByText("PRÓXIMAMENTE")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Herramienta de la materia", level: 1 })).toBeVisible();
  await expect(host(page)).toHaveCount(0);

  // El shell sigue entero: el rail lleva de vuelta al inicio de la materia.
  await rail(page).getByRole("link", { name: "Inicio", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Progreso", level: 1 })).toBeVisible();

  expect(errores).toEqual([]);
});
