/**
 * Quiz: la lista con su puntaje y la partida pregunta por pregunta (revelado con
 * la explicación, resultado final e intento registrado).
 *
 * Qué opción es la correcta no se escribe acá: se lee del propio material
 * compilado (`e2e/.site/subjects/<materia>/subject.json`), así que la prueba
 * sigue valiendo si el wiki reordena las opciones.
 *
 * Y qué pregunta está en pantalla tampoco se supone por su posición: la partida
 * MEZCLA las preguntas en cada entrada, así que la vista publica el id de la
 * pregunta actual (`[data-testid="quiz-card"][data-question]`) y la prueba busca
 * su material por ese id.
 *
 * Los intentos quedan en el documento local; `resetStudy` los limpia antes de
 * cada prueba, y la aserción sigue siendo «al menos uno» para no depender del
 * recorte de historial que hace el cliente.
 */
import { expect, test, type Page } from "@playwright/test";
import { resetStudy, studyContent, studyState, waitForSubjectShell } from "../support/app";
import { readSeed } from "../support/seed";

const seed = readSeed();
const subject = seed.subject;
const quizUrl = `/m/${subject.slug}/quiz`;
const QUIZ = seed.study.quiz?.id ?? "";
const PREGUNTAS = seed.study.quiz?.questions ?? 0;

const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;

const counter = (page: Page) => page.getByTestId("quiz-counter");
/** El id de la pregunta que está en pantalla (la partida sale mezclada). */
const currentId = async (page: Page): Promise<string> =>
  (await page.getByTestId("quiz-card").getAttribute("data-question")) ?? "";
/** El bloque que se revela al elegir: `data-ok` dice si la elección era correcta. */
const reveal = (page: Page) => page.locator("main#contenido [data-ok]");

const option = (page: Page, index: number) =>
  page.getByRole("button", { name: new RegExp(`^${LETTERS[index] as string}\\. `) });

async function openQuiz(page: Page): Promise<void> {
  await page.goto(`${quizUrl}/${QUIZ}`);
  await waitForSubjectShell(page);
  await expect(counter(page)).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await resetStudy(page, subject.slug);
});

test("la lista muestra el quiz de la materia y lleva a la partida", async ({ page }) => {
  const content = await studyContent(subject.slug);
  const quiz = content.quizzes.find((q) => q.id === QUIZ);
  if (!quiz) throw new Error(`La siembra no trajo el quiz «${QUIZ}»`);

  await page.goto(quizUrl);
  await waitForSubjectShell(page);
  await expect(page.getByRole("heading", { name: "Quiz", level: 1 })).toBeVisible();

  const fila = page.locator("main#contenido li").filter({ hasText: quiz.title });
  await expect(fila).toHaveCount(1);
  await expect(fila).toContainText(`${quiz.questions.length} preguntas`);

  // «Empezar» la primera vez; «Reintentar» si ya hubo un intento (no se pueden borrar).
  await fila.getByRole("link", { name: /^(Empezar|Reintentar)$/ }).click();
  await expect(page).toHaveURL(new RegExp(`${quizUrl}/${QUIZ}$`));
  await expect(counter(page)).toHaveText(`1 / ${quiz.questions.length}`);
});

test("responder revela CORRECTO o INCORRECTO con su explicación", async ({ page }) => {
  const content = await studyContent(subject.slug);
  const preguntas = content.quizzes.find((q) => q.id === QUIZ)?.questions ?? [];
  expect(preguntas.length).toBeGreaterThanOrEqual(3);

  await openQuiz(page);

  for (let i = 0; i < 3; i += 1) {
    const id = await currentId(page);
    const pregunta = preguntas.find((q) => q.id === id);
    if (!pregunta) throw new Error(`La vista muestra una pregunta que no está en el material: «${id}»`);
    const correcta = pregunta.options.findIndex((o) => o.correct);
    // La segunda se falla a propósito: hay que ver los dos revelados.
    const elegida = i === 1 ? (correcta === 0 ? 1 : 0) : correcta;
    const acierta = elegida === correcta;

    await expect(counter(page)).toHaveText(`${i + 1} / ${preguntas.length}`);
    await option(page, elegida).click();

    await expect(reveal(page)).toBeVisible();
    await expect(reveal(page)).toHaveAttribute("data-ok", acierta ? "true" : "false");
    await expect(page.getByText(acierta ? "CORRECTO" : "INCORRECTO", { exact: true })).toBeVisible();
    // El revelado no es solo el sello: abajo va la explicación de la cátedra.
    expect((await reveal(page).innerText()).trim().length).toBeGreaterThan(
      (acierta ? "CORRECTO" : "INCORRECTO").length + 10,
    );

    await page.getByRole("button", { name: "Siguiente" }).click();
  }

  // Abandonar con Escape vuelve a la lista sin registrar intento.
  await page.keyboard.press("Escape");
  await expect(page).toHaveURL(new RegExp(`${quizUrl}$`));
  await expect(page.getByRole("heading", { name: "Quiz", level: 1 })).toBeVisible();
});

test("terminar el quiz entero muestra el resultado y registra el intento", async ({ page }) => {
  const content = await studyContent(subject.slug);
  const preguntas = content.quizzes.find((q) => q.id === QUIZ)?.questions ?? [];
  const total = preguntas.length;
  expect(total).toBe(PREGUNTAS);
  /* Siempre la primera opción: el puntaje esperado sale del material, no de un número escrito acá. */
  const esperado = preguntas.filter((q) => q.options[0]?.correct === true).length;

  await openQuiz(page);

  for (let i = 0; i < total; i += 1) {
    await expect(counter(page)).toHaveText(`${i + 1} / ${total}`);
    await option(page, 0).click();
    await page.getByRole("button", { name: i === total - 1 ? "Ver el resultado" : "Siguiente" }).click();
  }

  await expect(page.getByText("RESULTADO", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: `${esperado}/${total} ${esperado === 1 ? "respuesta correcta" : "respuestas correctas"}`,
    }),
  ).toBeVisible();

  const attempts = await (async () => {
    await expect
      .poll(async () => (await studyState(page, subject.slug)).attempts.length, {
        message: "el intento del quiz no quedó guardado",
      })
      .toBeGreaterThanOrEqual(1);
    return (await studyState(page, subject.slug)).attempts;
  })();

  const ultimo = attempts.filter((a) => a.quizId === QUIZ).at(-1);
  expect(ultimo?.total).toBe(total);
  expect(ultimo?.score).toBe(esperado);
});
