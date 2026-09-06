/**
 * «Lo mío»: favoritos y apuntes. Se escriben desde el lector (el botón
 * «Guardar» y la tarjeta APUNTES) y se leen desde `/favorites` y `/notes`, con
 * la exportación a markdown de los apuntes.
 *
 * Ensucia el estado de estudio del usuario: `beforeEach` y `afterAll` lo
 * reponen con los endpoints del contrato (§5).
 */
import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { resetStudy, studyState, waitForSubjectShell, withApi } from "../support/app";
import { readSeed } from "../support/seed";

const seed = readSeed();
const subject = seed.subject;
const target = seed.readerPage;
const readerUrl = `/m/${subject.slug}/p/${target.slug}`;

/** Texto del apunte: sin marcado, para poder buscarlo tal cual en la vista y en el .md. */
const APUNTE = "Repasar la tabla Z antes del parcial";

const main = (page: Page) => page.locator("main#contenido");

async function openReader(page: Page): Promise<void> {
  await page.goto(readerUrl);
  await waitForSubjectShell(page);
  await expect(page.getByRole("heading", { level: 1, name: target.title })).toBeVisible();
}

test.beforeEach(async ({ request }) => {
  await resetStudy(request, subject.slug);
});

test.afterAll(async () => {
  await withApi((api) => resetStudy(api, subject.slug));
});

test("guardar una página desde el lector la deja en Favoritos y sobrevive a la recarga", async ({
  page,
  request,
}) => {
  await openReader(page);

  const guardar = page.getByRole("button", { name: "Guardar", exact: true }).first();
  await expect(guardar).toHaveAttribute("aria-pressed", "false");
  await guardar.click();

  const guardada = page.getByRole("button", { name: "Guardada", exact: true }).first();
  await expect(guardada).toBeVisible();
  await expect(guardada).toHaveAttribute("aria-pressed", "true");

  await expect
    .poll(async () => (await studyState(request, subject.slug)).bookmarks)
    .toContain(target.slug);

  await page.goto(`/m/${subject.slug}/favorites`);
  await waitForSubjectShell(page);
  await expect(page.getByRole("heading", { name: "Favoritos", level: 1 })).toBeVisible();
  await expect(main(page)).toContainText("1 página guardada");
  await expect(main(page).getByRole("link", { name: new RegExp(target.title) })).toBeVisible();

  await page.reload();
  await waitForSubjectShell(page);
  await expect(main(page).getByRole("link", { name: new RegExp(target.title) })).toBeVisible();
});

test("un apunte escrito en el lector se vuelve a ver tras recargar", async ({ page, request }) => {
  await openReader(page);

  await main(page).getByLabel("Apunte de esta página").fill(APUNTE);
  // El guardado es automático (rebote de 800 ms): el rótulo de la tarjeta lo confirma.
  await expect(main(page).getByText(/^Guardado ·/)).toBeVisible();

  await expect
    .poll(async () => (await studyState(request, subject.slug)).notes.map((n) => n.page))
    .toContain(target.slug);

  await page.reload();
  await waitForSubjectShell(page);
  // Sin foco, la tarjeta muestra el apunte ya compuesto (el mismo motor markdown).
  await expect(main(page).getByText(APUNTE)).toBeVisible();
});

test("«Mis apuntes» lista el apunte y «Exportar markdown» lo descarga", async ({ page }) => {
  await openReader(page);
  await main(page).getByLabel("Apunte de esta página").fill(APUNTE);
  await expect(main(page).getByText(/^Guardado ·/)).toBeVisible();

  await page.goto(`/m/${subject.slug}/notes`);
  await waitForSubjectShell(page);
  await expect(page.getByRole("heading", { name: "Mis apuntes", level: 1 })).toBeVisible();
  await expect(main(page)).toContainText(`1 apunte en ${subject.name}`);
  await expect(main(page)).toContainText(APUNTE);
  await expect(main(page).getByRole("link", { name: target.title })).toBeVisible();

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Exportar markdown" }).click(),
  ]);

  expect(download.suggestedFilename()).toMatch(new RegExp(`^apuntes-${subject.slug}-\\d{4}-\\d{2}-\\d{2}\\.md$`));
  const file = await download.path();
  expect(file).not.toBeNull();
  const markdown = readFileSync(file as string, "utf8");
  expect(markdown).toContain(`# Mis apuntes — ${subject.name}`);
  expect(markdown).toContain(`## ${target.title}`);
  expect(markdown).toContain(APUNTE);
  expect(markdown).toContain(`[[${target.slug}]]`);
});
