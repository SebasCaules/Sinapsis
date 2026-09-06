/**
 * Plan de estudio y kits: las dos vistas de «Mi ruta» que arma la materia en
 * `estudio/plan.json` y `estudio/kits.json`.
 *
 * Tildar una tarea es OPTIMISTA (la casilla se enciende antes que responda el
 * API), así que se usa `click()` y no `check()`: `check()` espera a que el
 * `checked` nativo cambie y acá la casilla la controla la caché.
 */
import { expect, test, type Page } from "@playwright/test";
import { resetStudy, studyContent, studyState, waitForSubjectShell, withApi } from "../support/app";
import { readSeed } from "../support/seed";

const seed = readSeed();
const subject = seed.subject;
const planUrl = `/m/${subject.slug}/plan`;
const kitsUrl = `/m/${subject.slug}/kits`;

const phases = (page: Page) => page.getByTestId("plan-phase");
const kits = (page: Page) => page.getByTestId("kit-card");

async function openPlan(page: Page): Promise<void> {
  await page.goto(planUrl);
  await waitForSubjectShell(page);
  await expect(phases(page).first()).toBeVisible();
}

test.beforeEach(async ({ request }) => {
  await resetStudy(request, subject.slug);
});

test.afterAll(async () => {
  await withApi((api) => resetStudy(api, subject.slug));
});

test("el plan dibuja las fases que declara la materia", async ({ page, request }) => {
  const plan = (await studyContent(request, subject.slug)).plan;
  if (!plan) throw new Error("La siembra no trajo plan de estudio");
  // `phases` es la modalidad por defecto (N0-43): con `tracks`, las demás fases viven en su modalidad.
  expect(plan.phases.length).toBeGreaterThan(0);

  await openPlan(page);

  await expect(page.getByRole("heading", { name: plan.title, level: 1 })).toBeVisible();
  await expect(phases(page)).toHaveCount(plan.phases.length);
  for (const phase of plan.phases) {
    await expect(page.locator(`[data-testid="plan-phase"][data-phase="${phase.id}"]`)).toContainText(phase.title);
  }
  // La fase actual —la primera con pendientes— va marcada: sin nada hecho, la primera.
  await expect(phases(page).first()).toHaveAttribute("data-current", "true");
});

test("tildar una tarea sube el contador y persiste tras recargar", async ({ page, request }) => {
  await openPlan(page);

  const total = page.getByTestId("plan-total");
  const inicial = (await total.innerText()).trim();
  expect(inicial).toMatch(/^0\/\d+$/);
  const pasos = Number(inicial.split("/")[1]);

  const primera = phases(page).first();
  const tarea = primera.getByRole("checkbox").first();
  await expect(tarea).not.toBeChecked();

  await tarea.click();

  await expect(total).toHaveText(`1/${pasos}`);
  await expect
    .poll(async () => (await studyState(request, subject.slug)).tasksDone.length, {
      message: "el API no registró la tarea",
    })
    .toBe(1);

  await page.reload();
  await waitForSubjectShell(page);
  await expect(page.getByTestId("plan-total")).toHaveText(`1/${pasos}`);
  await expect(phases(page).first().getByRole("checkbox").first()).toBeChecked();
});

test("los kits listan su material y llevan a repasar sus mazos", async ({ page, request }) => {
  const content = await studyContent(request, subject.slug);
  expect(content.kits.length).toBe(8);

  await page.goto(kitsUrl);
  await waitForSubjectShell(page);
  await expect(page.getByRole("heading", { name: "Kits de estudio", level: 1 })).toBeVisible();
  await expect(kits(page)).toHaveCount(content.kits.length);

  /* Se abre el kit «final»: es el único que junta páginas, mazos y quizzes. */
  const kitId = "final";
  const kit = content.kits.find((k) => k.id === kitId);
  if (!kit) throw new Error(`La siembra no trajo el kit «${kitId}»`);

  await page.locator(`[data-testid="kit-card"][data-kit="${kitId}"]`).click();
  await expect(page).toHaveURL(new RegExp(`${kitsUrl}/${kitId}$`));
  await expect(page.getByRole("heading", { name: kit.title, level: 1 })).toBeVisible();

  const main = page.locator("main#contenido");
  /* «Páginas clave»: el kit trae una SELECCIÓN de páginas, no todas las de sus
     unidades (el adjetivo es el del baseline). */
  await expect(main.getByText("Páginas clave", { exact: true })).toBeVisible();
  await expect(main.getByText("Mazos", { exact: true })).toBeVisible();
  await expect(main.getByText("Herramientas", { exact: true })).toBeVisible();
  const paginas = main.locator(`a[href^="/m/${subject.slug}/p/"]`);
  const mazos = main.locator(`a[href^="/m/${subject.slug}/flashcards/"]`);
  expect(await paginas.count()).toBeGreaterThan(0);
  expect(await mazos.count()).toBeGreaterThan(1);
  /* Los lanzadores que declara el kit, resueltos contra el rail. */
  expect(kit.tools.length).toBeGreaterThan(0);
  await expect(main.getByRole("link", { name: "Calculadoras Φ · t · χ²" })).toBeVisible();

  await page.getByRole("link", { name: "Repasar los mazos del kit" }).click();
  await expect(page).toHaveURL(new RegExp(`/m/${subject.slug}/flashcards/kit:${kitId}\\?modo=`));
  await expect(page.getByTestId("session-counter")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1, name: kit.title })).toBeVisible();
});

test("el kit marca sus páginas como leídas, de a una y todas juntas", async ({ page, request }) => {
  const content = await studyContent(request, subject.slug);
  const kit = content.kits.find((k) => k.id === "parcialito-1");
  if (!kit) throw new Error("La siembra no trajo el kit «parcialito-1»");

  await page.goto(`${kitsUrl}/${kit.id}`);
  await waitForSubjectShell(page);

  const main = page.locator("main#contenido");
  const casillas = main.getByRole("button", { name: /^Marcar como (no )?leída: / });
  await expect(casillas.first()).toHaveAttribute("aria-pressed", "false");

  await casillas.first().click();
  await expect(casillas.first()).toHaveAttribute("aria-pressed", "true");

  await main.getByRole("button", { name: "Marcar todas como leídas" }).click();
  await expect(main.getByRole("button", { name: "Desmarcar todas" })).toBeVisible();
  await expect(main.getByText(`${kit.pages.length} de ${kit.pages.length} leídas`)).toBeVisible();

  /* El tilde es el MISMO que el del lector: viaja al progreso de la materia. */
  await expect
    .poll(async () => (await page.request.get(`/api/subjects/${subject.slug}`).then((r) => r.json())).studied.length, {
      message: "el API no registró las páginas leídas del kit",
    })
    .toBeGreaterThanOrEqual(kit.pages.length);

  await main.getByRole("button", { name: "Desmarcar todas" }).click();
  await expect(main.getByRole("button", { name: "Marcar todas como leídas" })).toBeVisible();
});
