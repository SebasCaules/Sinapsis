/**
 * Modalidades del plan de estudio (Sprint 3 · N0-43): un plan puede traer más
 * de una vía —«cursada y final» o «final directo»— con sus propias fases, y
 * arriba de la pantalla hay un conmutador para elegir.
 *
 * Las modalidades salen del material sincronizado (`estudio/plan.json`), así que
 * las pruebas preguntan al API qué trajo el plan antes de decidir qué esperar:
 * con modalidades se prueba el conmutador; sin ellas, que no aparezca.
 *
 * La elección es del cliente y por materia (`sinapsis.<slug>.planTrack`): el
 * servidor no la guarda, de modo que la persistencia se comprueba recargando.
 */
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";
import { studyContent, waitForSubjectShell, type PlanTrackDto } from "../support/app";
import { readSeed, SHOTS_DIR } from "../support/seed";

const seed = readSeed();
const subject = seed.subject;
const planUrl = `/m/${subject.slug}/plan`;

const picker = (page: Page) => page.locator('[role="radiogroup"][aria-labelledby="plan-tracks-label"]');
const phases = (page: Page) => page.getByTestId("plan-phase");

async function openPlan(page: Page): Promise<void> {
  await page.goto(planUrl);
  await waitForSubjectShell(page);
}

/** Los ids de las fases dibujadas, en orden. */
async function visiblePhases(page: Page): Promise<string[]> {
  return phases(page).evaluateAll((nodes) => nodes.map((n) => n.getAttribute("data-phase") ?? ""));
}

/** La modalidad guardada en el cliente para esta materia. */
async function storedTrack(page: Page): Promise<string | null> {
  return page.evaluate((slug) => localStorage.getItem(`sinapsis.${slug}.planTrack`), subject.slug);
}

test("el conmutador ofrece las modalidades que trae el plan", async ({ page, request }) => {
  const tracks = (await studyContent(request, subject.slug)).plan?.tracks ?? [];
  test.skip(tracks.length === 0, "el plan de esta materia no declara modalidades");

  await openPlan(page);
  await expect(page.getByText("MODALIDAD")).toBeVisible();
  await expect(picker(page)).toBeVisible();

  const opciones = picker(page).getByRole("radio");
  await expect(opciones).toHaveCount(tracks.length);
  for (const [i, track] of tracks.entries()) {
    await expect(opciones.nth(i)).toHaveText(track.label);
  }

  // Sin elección previa manda la primera, y las fases son las suyas.
  const primera = tracks[0] as PlanTrackDto;
  await expect(picker(page).getByRole("radio", { name: primera.label, exact: true })).toHaveAttribute(
    "aria-checked",
    "true",
  );
  expect(await visiblePhases(page)).toEqual(primera.phases.map((p) => p.id));

  await page.screenshot({ path: path.join(SHOTS_DIR, "plan-modalidades.png") });
});

test("cambiar de modalidad cambia las fases y la elección sobrevive a la recarga", async ({
  page,
  request,
}) => {
  const tracks = (await studyContent(request, subject.slug)).plan?.tracks ?? [];
  test.skip(tracks.length < 2, "hacen falta dos modalidades para poder cambiar");
  const primera = tracks[0] as PlanTrackDto;
  const otra = tracks[1] as PlanTrackDto;
  // Si las dos vías dibujaran las mismas fases, el cambio no se vería.
  expect(otra.phases.map((p) => p.id)).not.toEqual(primera.phases.map((p) => p.id));

  await openPlan(page);
  expect(await visiblePhases(page)).toEqual(primera.phases.map((p) => p.id));

  await picker(page).getByRole("radio", { name: otra.label, exact: true }).click();

  await expect(picker(page).getByRole("radio", { name: otra.label, exact: true })).toHaveAttribute("aria-checked", "true");
  await expect(picker(page).getByRole("radio", { name: primera.label, exact: true })).toHaveAttribute(
    "aria-checked",
    "false",
  );
  await expect
    .poll(() => visiblePhases(page), { message: "las fases no siguieron a la modalidad" })
    .toEqual(otra.phases.map((p) => p.id));
  expect(await storedTrack(page)).toBe(otra.id);

  await page.reload();
  await waitForSubjectShell(page);
  await expect(picker(page).getByRole("radio", { name: otra.label, exact: true })).toHaveAttribute("aria-checked", "true");
  expect(await visiblePhases(page)).toEqual(otra.phases.map((p) => p.id));
});

test("un plan sin modalidades no dibuja el conmutador", async ({ page, request }) => {
  const plan = (await studyContent(request, subject.slug)).plan;
  test.skip((plan?.tracks ?? []).length > 0, "el plan de esta materia sí declara modalidades");

  await openPlan(page);
  await expect(picker(page)).toHaveCount(0);
  await expect(page.getByText("MODALIDAD")).toHaveCount(0);

  // Sin modalidades manda `plan.phases`; sin plan, el estado vacío.
  if (plan?.phases.length) {
    expect(await visiblePhases(page)).toEqual(plan.phases.map((p) => p.id));
  } else {
    await expect(page.getByText("SIN PLAN")).toBeVisible();
  }
});
