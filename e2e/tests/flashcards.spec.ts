/**
 * Flashcards: la lista de mazos (los del wiki más los automáticos por división)
 * y la sesión de repaso con el SM-2 del contrato.
 *
 * La sesión se maneja con el teclado, que es como está pensada: Espacio da
 * vuelta la tarjeta y 1-4 la califican. Lo que se comprueba del lado del
 * servidor es que la nota se haya PERSISTIDO: `GET .../study/state` devuelve un
 * `SrsState` por tarjeta calificada, con `due` en el futuro.
 */
import { expect, test, type Page } from "@playwright/test";
import { resetStudy, studyContent, studyState, waitForSubjectShell, withApi } from "../support/app";
import { readSeed } from "../support/seed";

const seed = readSeed();
const subject = seed.subject;
const flashcardsUrl = `/m/${subject.slug}/flashcards`;

/** El mazo autoral más corto de Proba: cuatro tarjetas, una sesión entera cabe en la prueba. */
const DECK = "procesos-estocasticos";
const DECK_CARDS = 4;
/** Nota «Bien»: con una tarjeta nueva deja un intervalo de 1 día. */
const BIEN = "3";

const counter = (page: Page) => page.getByTestId("session-counter");

async function openSession(page: Page, deck: string, modo: string): Promise<void> {
  await page.goto(`${flashcardsUrl}/${deck}?modo=${modo}`);
  await waitForSubjectShell(page);
  await expect(counter(page)).toBeVisible();
}

/** Da vuelta la tarjeta con Espacio y la califica con `nota`. */
async function answer(page: Page, nota: string): Promise<void> {
  await page.keyboard.press("Space");
  await expect(page.getByRole("button", { name: /Ocultar la respuesta/ })).toBeVisible();
  await page.keyboard.press(nota);
}

test.beforeEach(async ({ request }) => {
  await resetStudy(request, subject.slug);
});

test.afterAll(async () => {
  await withApi((api) => resetStudy(api, subject.slug));
});

test("lista los mazos del wiki y los automáticos por división", async ({ page, request }) => {
  const content = await studyContent(request, subject.slug);
  const autores = content.decks.filter((d) => d.source !== "auto");
  const automaticos = content.decks.filter((d) => d.source === "auto");
  expect(autores.length).toBeGreaterThanOrEqual(6);
  expect(automaticos.length).toBeGreaterThan(0);

  await page.goto(flashcardsUrl);
  await waitForSubjectShell(page);
  await expect(page.getByRole("heading", { name: "Flashcards", level: 1 })).toBeVisible();

  const mazos = page.getByTestId("deck-card");
  await expect(mazos).toHaveCount(content.decks.length);
  expect(await mazos.count()).toBeGreaterThanOrEqual(6);

  // La insignia distingue los mazos que arma la plataforma con los resúmenes.
  const auto = mazos.filter({ hasText: "Automático" });
  expect(await auto.count()).toBe(automaticos.length);
  await expect(auto.first()).toBeVisible();

  const corto = page.locator(`[data-testid="deck-card"][data-deck="${DECK}"]`);
  await expect(corto).toContainText(`${DECK_CARDS} tarjetas`);
  await expect(corto).not.toContainText("Automático");
});

test("calificar tres tarjetas avanza el contador y persiste el SRS", async ({ page, request }) => {
  await openSession(page, DECK, "todo");
  await expect(counter(page)).toHaveText(`1 / ${DECK_CARDS}`);

  for (let i = 1; i <= 3; i += 1) {
    await answer(page, BIEN);
    await expect(counter(page)).toHaveText(`${i + 1} / ${DECK_CARDS}`);
  }

  await expect
    .poll(async () => (await studyState(request, subject.slug)).srs.length, {
      message: "el API no registró las tres calificaciones",
    })
    .toBe(3);

  const { srs } = await studyState(request, subject.slug);
  const ahora = Date.now();
  for (const card of srs) {
    expect(card.cardId.startsWith(`${DECK}:`)).toBe(true);
    expect(card.lastGrade).toBe(Number(BIEN));
    expect(Date.parse(card.due)).toBeGreaterThan(ahora);
  }
});

test("terminar un mazo corto muestra la pantalla final de la sesión", async ({ page }) => {
  await openSession(page, DECK, "todo");

  for (let i = 0; i < DECK_CARDS; i += 1) await answer(page, BIEN);

  await expect(page.getByText("SESIÓN TERMINADA")).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: `${DECK_CARDS} tarjetas repasadas` }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Repetir" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Volver a los mazos" })).toBeVisible();
});
