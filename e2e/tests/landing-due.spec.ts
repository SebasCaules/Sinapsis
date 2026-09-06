/**
 * Tarjetas para repasar en la landing (Sprint 3): `dueCount` viaja en cada
 * `SubjectCard` y la tarjeta de la materia lo muestra como «N para repasar»,
 * enlazado al repaso. Con cero no se dibuja nada.
 *
 * El contador es de tarjetas VENCIDAS (`due <= ahora`), y ahí está la vuelta:
 * calificar corre el SM-2 del contrato, que nunca deja la próxima revisión en el
 * pasado —«Otra vez» la deja a diez minutos—, así que una sesión de repaso, por
 * sí sola, no puede hacer aparecer el contador. Las pruebas hacen las dos
 * mitades:
 *
 *   1. califican una tarjeta con «Otra vez» desde la sesión (teclado, como en
 *      `flashcards.spec.ts`) y comprueban lo que persistió el navegador y que la
 *      landing siga sin contador;
 *   2. adelantan el vencimiento de esa misma tarjeta (`expireSrsCards`, que
 *      escribe el documento local con el gancho de pruebas: ver el porqué en
 *      `support/app.ts`) y comprueban el contador, su cifra y su enlace.
 */
import { expect, test, type Page } from "@playwright/test";
import {
  expireSrsCards,
  landingCards,
  resetLanding,
  resetStudy,
  studyState,
  waitForSubjectShell,
} from "../support/app";
import { readSeed } from "../support/seed";

const seed = readSeed();
const subject = seed.subject;

/** Nota «Otra vez»: la que un estudiante da cuando no se acordó de nada. */
const OTRA_VEZ = "1";

const card = (page: Page) => page.locator(`[data-testid="subject-card"][data-slug="${subject.slug}"]`);
const dueLink = (page: Page) => card(page).getByRole("link", { name: /para repasar/ });

/** Abre el mazo más corto de la materia y califica la primera tarjeta con «Otra vez». */
async function gradeOneAgain(page: Page): Promise<string> {
  const deck = seed.study.deck;
  expect(deck, "la materia sembrada no tiene ningún mazo con tarjetas").toBeTruthy();
  const deckId = deck?.id ?? "";

  await page.goto(`/m/${subject.slug}/flashcards/${deckId}?modo=todo`);
  await waitForSubjectShell(page);
  await expect(page.getByTestId("session-counter")).toBeVisible();

  await page.keyboard.press("Space");
  await expect(page.getByRole("button", { name: /Ocultar la respuesta/ })).toBeVisible();
  await page.keyboard.press(OTRA_VEZ);

  await expect
    .poll(async () => (await studyState(page, subject.slug)).srs.length, {
      message: `la calificación del mazo «${deckId}» no quedó guardada`,
    })
    .toBe(1);
  return deckId;
}

test.beforeEach(async ({ page }) => {
  await resetStudy(page, subject.slug);
  await resetLanding(page);
});

test("«Otra vez» deja la tarjeta para dentro de diez minutos y la landing no la cuenta", async ({
  page,
}) => {
  const antes = Date.now();
  await gradeOneAgain(page);

  const { srs } = await studyState(page, subject.slug);
  const tarjeta = srs[0];
  expect(tarjeta?.lastGrade).toBe(Number(OTRA_VEZ));
  expect(tarjeta?.interval).toBe(0);
  // Diez minutos, ni vencida ni a un día: la tarjeta vuelve dentro de la sesión.
  const espera = Date.parse(tarjeta?.due ?? "") - antes;
  expect(espera).toBeGreaterThan(0);
  expect(espera).toBeLessThanOrEqual(11 * 60 * 1000);

  const cards = await landingCards(page);
  expect(cards.find((c) => c.slug === subject.slug)?.dueCount).toBe(0);

  await page.goto("/");
  await expect(card(page)).toBeVisible();
  await expect(dueLink(page)).toHaveCount(0);
});

test("con la tarjeta vencida, la landing muestra el contador y lleva al repaso", async ({ page }) => {
  await gradeOneAgain(page);
  expect(await expireSrsCards(page, subject.slug)).toBe(1);

  const cards = await landingCards(page);
  const pendientes = cards.find((c) => c.slug === subject.slug)?.dueCount ?? 0;
  expect(pendientes).toBe(1);

  await page.goto("/");
  await expect(dueLink(page)).toBeVisible();
  await expect(dueLink(page)).toHaveText(`${pendientes} para repasar`);
  // El nombre accesible dice de qué materia son: en la landing hay varias.
  await expect(dueLink(page)).toHaveAttribute(
    "aria-label",
    `${pendientes} tarjeta para repasar en ${subject.name}`,
  );

  // La materia placeholder no repasó nada: no lleva contador.
  await expect(
    page.locator(`[data-testid="subject-card"][data-slug="${seed.placeholder.slug}"]`).getByText("para repasar"),
  ).toHaveCount(0);

  await dueLink(page).click();
  await expect(page).toHaveURL(new RegExp(`/m/${subject.slug}/flashcards$`));
  await waitForSubjectShell(page);
  await expect(page.getByRole("heading", { name: "Flashcards", level: 1 })).toBeVisible();
});
