/**
 * Grafo de conexiones (N0-31): el lienzo, la lista accesible «MÁS CITADAS» que
 * dice lo mismo que el dibujo, el filtro «Solo contenido» y el resaltado por
 * título.
 *
 * El canvas no se puede inspeccionar desde afuera, así que todo lo que se
 * verifica pasa por el texto que lo acompaña: el contador de nodos y enlaces
 * (`graph-meta`) y la lista de la derecha.
 */
import { expect, test, type Page } from "@playwright/test";
import { waitForSubjectShell } from "../support/app";
import { readSeed } from "../support/seed";

const seed = readSeed();
const subject = seed.subject;
const graphUrl = `/m/${subject.slug}/graph`;

const meta = (page: Page) => page.getByTestId("graph-meta");
const masCitadas = (page: Page) => page.locator('section[aria-labelledby="graph-top"]');

/** «N de M páginas · K enlaces [· C coincidencias]» → los números. */
async function counters(page: Page): Promise<{ visible: number; total: number; edges: number; matches: number }> {
  const text = await meta(page).innerText();
  const nodes = text.match(/^(\d+) de (\d+) páginas? · (\d+) enlaces?/);
  if (!nodes) throw new Error(`El contador del grafo no tiene el formato esperado: «${text}»`);
  const matches = text.match(/· (\d+) coincidencias?/);
  return {
    visible: Number(nodes[1]),
    total: Number(nodes[2]),
    edges: Number(nodes[3]),
    matches: matches ? Number(matches[1]) : 0,
  };
}

async function openGraph(page: Page): Promise<void> {
  await page.goto(graphUrl);
  await waitForSubjectShell(page);
  await expect(page.getByRole("heading", { name: "Grafo de conexiones", level: 1 })).toBeVisible();
  await expect(meta(page)).toHaveText(/\d+ de \d+ páginas/);
}

test("dibuja el lienzo y la lista «MÁS CITADAS» con al menos cinco páginas", async ({ page }) => {
  await openGraph(page);

  const canvas = page.locator("canvas");
  await expect(canvas).toHaveCount(1);
  await expect(canvas).toBeVisible();
  const box = await canvas.boundingBox();
  expect(box?.width ?? 0).toBeGreaterThan(200);
  expect(box?.height ?? 0).toBeGreaterThan(200);

  const { visible, total, edges } = await counters(page);
  // «Solo contenido» nace encendido: se dibuja el temario, no el wiki entero.
  expect(visible).toBeGreaterThan(5);
  expect(visible).toBeLessThanOrEqual(total);
  expect(edges).toBeGreaterThan(0);

  await expect(masCitadas(page)).toContainText("MÁS CITADAS");
  expect(await masCitadas(page).getByRole("link").count()).toBeGreaterThanOrEqual(5);
});

test("«Solo contenido» nace encendido y al apagarlo entran las fuentes", async ({ page }) => {
  await openGraph(page);
  const antes = await counters(page);

  const filtro = page.getByRole("button", { name: "Solo contenido" });
  await expect(filtro).toHaveAttribute("aria-pressed", "true");
  await filtro.click();

  await expect(filtro).toHaveAttribute("aria-pressed", "false");
  // El parámetro APAGA el filtro: encendido es el estado por omisión.
  await expect(page).toHaveURL(/[?&]c=0/);
  await expect
    .poll(async () => (await counters(page)).visible, { message: "apagar el filtro no sumó las fuentes" })
    .toBeGreaterThan(antes.visible);

  const despues = await counters(page);
  // El total (el grafo completo) no cambia: lo que cambia es cuántos se dibujan.
  expect(despues.total).toBe(antes.total);
  expect(antes.visible).toBeGreaterThan(0);
});

test("la lista de páginas y sus enlaces dice lo mismo que el lienzo", async ({ page }) => {
  await openGraph(page);
  const { visible } = await counters(page);

  const lista = page.locator("details").filter({ hasText: "Lista de páginas y sus enlaces" });
  await lista.getByText("Lista de páginas y sus enlaces").click();
  await expect(lista.getByRole("link").first()).toBeVisible();
  // Una fila por página dibujada: es el equivalente textual del canvas, no un recorte.
  expect(await lista.getByRole("link").count()).toBe(visible);
});

test("«Encajar» encaja el grafo después de acercarlo con la rueda", async ({ page }) => {
  await openGraph(page);
  const canvas = page.locator("canvas");
  const box = await canvas.boundingBox();
  if (!box) throw new Error("el lienzo del grafo no tiene caja");

  const nivel = page.getByTestId("graph-zoom");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.wheel(0, -600);
  await expect.poll(async () => Number((await nivel.innerText()).replace(/\D/g, ""))).toBeGreaterThan(100);

  await page.getByRole("button", { name: "Encajar" }).click();
  // El encaje devuelve una escala que hace entrar el grafo entero: menos de 160 %.
  await expect.poll(async () => Number((await nivel.innerText()).replace(/\D/g, ""))).toBeLessThanOrEqual(160);
});

test("buscar «normal» resalta páginas sin sacar ninguna del grafo", async ({ page }) => {
  await openGraph(page);
  const antes = await counters(page);

  await page.getByLabel("Resaltar páginas en el grafo").fill(seed.palette.term);

  await expect(meta(page)).toHaveText(/coincidencias?/);
  const despues = await counters(page);
  expect(despues.matches).toBeGreaterThan(0);
  // Resalta, no filtra: el conjunto dibujado es el mismo.
  expect(despues.visible).toBe(antes.visible);
  await expect(page).toHaveURL(new RegExp(`[?&]q=${seed.palette.term}`));
});

test("un ítem de «MÁS CITADAS» abre la página en el lector", async ({ page }) => {
  await openGraph(page);

  const primera = masCitadas(page).getByRole("link").first();
  const titulo = (await primera.innerText()).replace(/^\d+\s*/, "").trim();
  await primera.click();

  await expect(page).toHaveURL(new RegExp(`/m/${subject.slug}/p/`));
  /* `exact`: el cuerpo de la página puede traer su propio H1 («… (TCL)»), y el
     nombre accesible se compara por subcadena si no se pide coincidencia exacta. */
  await expect(page.getByRole("heading", { level: 1, name: titulo, exact: true })).toBeVisible();
});
