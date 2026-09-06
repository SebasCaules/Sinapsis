/**
 * Copia de seguridad del estado personal (Sprint 4 · §2.2).
 *
 * Sin API, lo que el estudiante hace vive en SU navegador: IndexedDB con espejo
 * en `localStorage`. Esta suite prueba las cuatro cosas que sostienen esa
 * promesa, desde la interfaz y no desde el gancho de pruebas:
 *
 *   1. lo marcado sobrevive a la recarga (la persistencia, sin la cual no hay
 *      nada que respaldar);
 *   2. «Descargar copia de seguridad» baja un JSON con la forma de `LocalBackup`
 *      y el estado de verdad adentro;
 *   3. «Restaurar copia» con ese archivo repone el estado en un navegador que ya
 *      lo había perdido;
 *   4. «Borrar todo lo local» deja la landing como recién estrenada.
 *
 * El archivo que baja la aplicación ES el documento que guarda (`LocalBackup`
 * más `exportedAt`), así que la prueba lo valida contra esa forma y lo vuelve a
 * subir tal cual.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { expect, test, type Download, type Page } from "@playwright/test";
import { resetLanding, snapshot, waitForSubjectShell, type LocalBackupDto } from "../support/app";
import { readSeed } from "../support/seed";

const seed = readSeed();
const subject = seed.subject;
const target = seed.readerPage;
const readerUrl = `/m/${subject.slug}/p/${target.slug}`;

const avatar = (page: Page) => page.getByRole("button", { name: /^Perfil de / });
const card = (page: Page) => page.locator(`[data-testid="subject-card"][data-slug="${subject.slug}"]`);

/** Abre el menú del avatar. */
async function openMenu(page: Page): Promise<void> {
  await avatar(page).click();
  await expect(page.getByRole("menu")).toBeVisible();
}

/** Marca la página del lector como estudiada y espera el eco del botón. */
async function markStudied(page: Page): Promise<void> {
  await page.goto(readerUrl);
  await waitForSubjectShell(page);
  await page.getByRole("button", { name: "Marcar estudiado" }).first().click();
  await expect(page.getByRole("button", { name: "Estudiada" }).first()).toHaveAttribute(
    "aria-pressed",
    "true",
  );
}

/**
 * Baja la copia desde el menú y la deja en disco CON SU NOMBRE.
 * `download.path()` devuelve un temporal con nombre aleatorio, y el diálogo de
 * «Restaurar copia» muestra el nombre del archivo elegido: sin `saveAs` la
 * prueba subiría un archivo llamado como un UUID.
 */
async function downloadBackup(page: Page, dir: string): Promise<{ file: string; name: string }> {
  await openMenu(page);
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("menuitem", { name: /Descargar copia de seguridad/ }).click(),
  ]);
  const name = download.suggestedFilename();
  const file = path.join(dir, name);
  await (download as Download).saveAs(file);
  return { file, name };
}

/** Lo que la aplicación considera una copia válida, con lo que mira la prueba. */
function parseBackup(text: string): LocalBackupDto {
  const raw = JSON.parse(text) as LocalBackupDto;
  expect(raw.format, "el archivo no declara el formato de la copia").toBe(1);
  expect(typeof raw.savedAt).toBe("string");
  expect(Number.isNaN(Date.parse(raw.savedAt))).toBe(false);
  expect(typeof raw.exportedAt).toBe("string");
  expect(typeof raw.profile?.name).toBe("string");
  expect(["pergamino", "laurel", "claustro"]).toContain(raw.profile?.theme);
  expect(Array.isArray(raw.landing?.semesters)).toBe(true);
  expect(Array.isArray(raw.landing?.hidden)).toBe(true);
  expect(Array.isArray(raw.landing?.placeholders)).toBe(true);
  expect(typeof raw.landing?.placements).toBe("object");
  expect(typeof raw.subjects).toBe("object");
  return raw;
}

test("lo marcado en el lector sobrevive a la recarga", async ({ page }) => {
  await markStudied(page);

  await page.reload();
  await waitForSubjectShell(page);
  await expect(page.getByRole("button", { name: "Estudiada" }).first()).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  /* Y también a salir de la pestaña y volver por otra ruta: el documento se lee
     del almacén en cada arranque, no de la memoria de la vista. */
  await page.goto("/");
  await expect(card(page)).toContainText(`1/${seed.subject.contentPages} páginas`);
});

test("«Descargar copia de seguridad» baja un JSON con el estado adentro", async ({ page }, testInfo) => {
  await markStudied(page);
  await page.goto("/");

  const { file, name } = await downloadBackup(page, testInfo.outputDir);
  expect(name).toMatch(/^sinapsis-backup-\d{4}-\d{2}-\d{2}\.json$/);

  const doc = parseBackup(readFileSync(file, "utf8"));
  expect(Object.keys(doc.subjects[subject.slug]?.studied ?? {})).toContain(target.slug);
  await expect(page.getByText(`Se descargó «${name}».`)).toBeVisible();
});

test("«Restaurar copia» repone el estado que trae el archivo", async ({ page }, testInfo) => {
  /* Primero se fabrica la copia: se marca una página, se baja el archivo y se
     borra todo. Después se restaura y tiene que volver lo marcado. */
  await markStudied(page);
  await page.goto("/");
  const { file, name } = await downloadBackup(page, testInfo.outputDir);

  await openMenu(page);
  await page.getByRole("menuitem", { name: /Borrar todo lo local/ }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Borrar todo" }).click();
  await expect(page.getByText("Se borró todo lo guardado en este navegador.")).toBeVisible();

  await page.goto(readerUrl);
  await waitForSubjectShell(page);
  await expect(page.getByRole("button", { name: "Marcar estudiado" }).first()).toHaveAttribute(
    "aria-pressed",
    "false",
  );

  // El `<input type=file>` del menú está oculto a propósito: se lo llena directo.
  await page.locator('input[type="file"]').setInputFiles(file);
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("¿Restaurar esta copia?");
  await expect(dialog).toContainText(name);
  await dialog.getByRole("button", { name: "Restaurar" }).click();
  await expect(page.getByText("Se restauró la copia de seguridad.")).toBeVisible();

  // El documento vigente vuelve a traer la página marcada…
  const doc = await snapshot(page);
  expect(Object.keys(doc.subjects[subject.slug]?.studied ?? {})).toContain(target.slug);

  // …y quedó guardado: la recarga lo encuentra.
  await page.reload();
  await waitForSubjectShell(page);
  await expect(page.getByRole("button", { name: "Estudiada" }).first()).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

test("«Borrar todo lo local» vacía el documento y la landing vuelve a su estado inicial", async ({
  page,
}) => {
  /* Se ensucia todo lo que se puede desde la landing: la materia placeholder de
     la siembra y una página estudiada. */
  await resetLanding(page);
  await markStudied(page);
  await page.goto("/");
  await expect(
    page.locator(`[data-testid="subject-card"][data-slug="${seed.placeholder.slug}"]`),
  ).toBeVisible();

  await openMenu(page);
  await page.getByRole("menuitem", { name: /Borrar todo lo local/ }).click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("¿Borrar todo lo local?");
  await expect(dialog).toContainText("No se puede deshacer.");
  await dialog.getByRole("button", { name: "Borrar todo" }).click();
  await expect(page.getByText("Se borró todo lo guardado en este navegador.")).toBeVisible();

  // El documento quedó vacío de verdad.
  const doc = await snapshot(page);
  expect(doc.subjects).toEqual({});
  expect(doc.landing.placeholders).toEqual([]);
  expect(doc.landing.hidden).toEqual([]);

  /* Y la landing vuelve a ser el catálogo del sitio y nada más: la materia
     placeholder se fue con el documento y la del catálogo vuelve sin progreso. */
  await page.reload();
  await expect(card(page)).toBeVisible();
  await expect(card(page)).toContainText("SIN COMENZAR");
  await expect(card(page)).toContainText(`0/${seed.subject.contentPages} páginas`);
  await expect(
    page.locator(`[data-testid="subject-card"][data-slug="${seed.placeholder.slug}"]`),
  ).toHaveCount(0);
});

/**
 * Bug de la web, no de la suite: «Borrar todo lo local» deja el documento vacío
 * pero la landing sigue dibujando el progreso viejo hasta que se recarga.
 *
 * `AvatarMenu.refreshEverything` (apps/web/src/components/platform/AvatarMenu.tsx:121-125)
 * hace `queryClient.clear()` y DESPUÉS `queryClient.invalidateQueries()`: con la
 * caché ya vacía no queda ninguna consulta que invalidar, así que los
 * observadores montados se quedan con lo último que renderizaron. Con
 * `resetQueries()` —o invalidando sin limpiar antes— la tarjeta se rehace sola.
 * El mismo par está en `apps/web/src/local/testHook.ts:44-46` y `:54-55`.
 */
test("«Borrar todo lo local» refresca la landing sin recargar", async ({ page }) => {
  await markStudied(page);
  await page.goto("/");
  await expect(card(page)).toContainText(`1/${seed.subject.contentPages} páginas`);

  await openMenu(page);
  await page.getByRole("menuitem", { name: /Borrar todo lo local/ }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Borrar todo" }).click();
  await expect(page.getByText("Se borró todo lo guardado en este navegador.")).toBeVisible();

  await expect(card(page)).toContainText(`0/${seed.subject.contentPages} páginas`);
  await expect(card(page)).toContainText("SIN COMENZAR");
});
