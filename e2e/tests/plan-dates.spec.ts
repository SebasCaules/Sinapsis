/**
 * Fechas de las instancias evaluatorias del plan (Sprint 3 · D7).
 *
 * Las instancias —los parcialitos, el parcial, su recuperatorio, el final— las
 * declara la materia en `estudio/plan.json` (`Plan.instances`); la FECHA de cada
 * una la carga el usuario y vive en su cuenta (`StudyState.planDates`), no en el
 * wiki. De ahí salen los chips de cuenta regresiva del panel del hero y de cada
 * fase, y la línea de ritmo.
 *
 * Como todo lo demás del plan, las instancias salen del material compilado: si
 * la materia sembrada no declara ninguna, la prueba se saltea en vez de inventar
 * contenido.
 *
 * Sprint 4: la prueba que reproducía el bug del guardado LENTO Y FALLIDO
 * (`route.fulfill({status: 500})` sobre `PUT .../study/plan-dates/:key`) se
 * eliminó con el API. Sin servidor no hay respuesta que falle ni mutaciones
 * solapadas que revertir: el cliente local escribe en memoria y baja el
 * documento con un rebote. Lo que sí se conserva es la otra mitad —que elegir
 * una fecha guarde UNA sola fecha, y que abrir el calendario o cambiar de mes no
 * guarden nada—, ahora leída del documento en vez de contando peticiones.
 */
import { expect, test, type Locator, type Page } from "@playwright/test";
import { resetStudy, studyContent, studyState, waitForSubjectShell, type PlanDto } from "../support/app";
import { readSeed } from "../support/seed";

/** El plan de la materia sembrada, con las instancias evaluatorias que declara. */
async function plan(): Promise<PlanDto | null> {
  return (await studyContent(subject.slug)).plan;
}

/** Las fechas cargadas por el usuario (`StudyState.planDates`). */
async function planDates(page: Page): Promise<Record<string, string>> {
  return (await studyState(page, subject.slug)).planDates;
}

const seed = readSeed();
const subject = seed.subject;
const planUrl = `/m/${subject.slug}/plan`;

/* `exact` en todos los `getByLabel("Fecha de …")`: el botón de quitar del
   calendario se llama «Quitar fecha: Fecha de …», así que sin él cada campo
   resuelve a dos elementos. Lo mismo con las celdas del calendario: «6 de
   octubre de 2026» es prefijo de «16…» y «26…». */
const panel = (page: Page) => page.getByText("Fechas de las instancias");
const phases = (page: Page) => page.getByTestId("plan-phase");

/** `AAAA-MM-DD` del día LOCAL que cae dentro de `days` días. */
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

/** «2026-04-12» → «12 de abril de 2026» (el nombre accesible de la celda del calendario). */
function largo(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} de ${MESES[(m ?? 1) - 1]} de ${y}`;
}

/**
 * Elige `iso` en el calendario propio del campo `campo` (el disparador con
 * aria-label «Fecha de …»): lo abre, avanza o retrocede los meses que hagan
 * falta desde el mes en que abre (el de su valor, o el de hoy) y toca el día.
 */
async function elegirFecha(page: Page, campo: Locator, iso: string): Promise<void> {
  const desde = (await campo.getAttribute("data-value")) || isoIn(0);
  await campo.click();
  const dialogo = page.getByRole("dialog", { name: /Elegir fecha/ });
  await expect(dialogo).toBeVisible();
  const [y1, m1] = desde.split("-").map(Number);
  const [y2, m2] = iso.split("-").map(Number);
  const saltos = ((y2 ?? 0) - (y1 ?? 0)) * 12 + ((m2 ?? 0) - (m1 ?? 0));
  const boton = saltos >= 0 ? "Mes siguiente" : "Mes anterior";
  for (let i = 0; i < Math.abs(saltos); i += 1) await dialogo.getByRole("button", { name: boton }).click();
  await dialogo.getByRole("gridcell", { name: largo(iso), exact: true }).click();
  await expect(campo).toHaveAttribute("data-value", iso);
}

/** Quita la fecha del campo con su botón «Quitar fecha». */
async function quitarFecha(page: Page, label: string): Promise<void> {
  await page.getByRole("button", { name: `Quitar fecha: Fecha de ${label}` }).first().click();
}

function isoIn(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

async function openPlan(page: Page): Promise<void> {
  await page.goto(planUrl);
  await waitForSubjectShell(page);
  await expect(phases(page).first()).toBeVisible();
}

/* `resetStudy` deja la materia sin repasos, sin tareas y SIN FECHAS del plan. */
test.beforeEach(async ({ page }) => {
  await resetStudy(page, subject.slug);
});

test("cargar la fecha de una instancia la cuenta, la baja a su fase y persiste", async ({ page }) => {
  const contenido = await plan();
  const instances = contenido?.instances ?? [];
  test.skip(
    instances.length === 0,
    "el plan de esta materia todavía no declara instancias evaluatorias (Plan.instances)",
  );
  const primera = instances[0]!;
  /* La fase que usa esa instancia: es la que tiene que mostrar la misma fecha. */
  const fase = (contenido?.phases ?? []).find((p) => p.instance === primera.key);
  if (!fase) throw new Error(`ninguna fase de «phases» usa la instancia «${primera.key}»`);

  await openPlan(page);
  await panel(page).click();

  const campos = page.getByLabel(`Fecha de ${primera.label}`, { exact: true });
  await expect(campos).toHaveCount(2); // el del panel y el de la tarjeta de la fase
  await expect(campos.first()).toHaveAttribute("data-value", "");

  await elegirFecha(page, campos.first(), isoIn(12));

  // El chip aparece en los dos lugares con el mismo texto.
  await expect(page.getByText("faltan 12 días")).toHaveCount(2);
  const tarjeta = page.locator(`[data-testid="plan-phase"][data-phase="${fase.id}"]`);
  await expect(tarjeta.getByLabel(`Fecha de ${primera.label}`, { exact: true })).toHaveAttribute("data-value", isoIn(12));

  // El API la guardó de verdad.
  await expect
    .poll(async () => (await planDates(page))[primera.key], {
      message: "la fecha de la instancia no quedó guardada",
    })
    .toBe(isoIn(12));

  /* …y sobrevive a la recarga. El chip que se mira es el de la TARJETA: el panel
     del hero vuelve plegado, y el suyo queda dentro de un `details` cerrado. */
  await page.reload();
  await waitForSubjectShell(page);
  await expect(tarjeta.getByLabel(`Fecha de ${primera.label}`, { exact: true })).toHaveAttribute("data-value", isoIn(12));
  await expect(tarjeta.getByText("faltan 12 días")).toBeVisible();
});

test("vaciar el campo borra la fecha", async ({ page }) => {
  const contenido = await plan();
  const instances = contenido?.instances ?? [];
  test.skip(instances.length === 0, "el plan de esta materia todavía no declara instancias evaluatorias");
  const primera = instances[0]!;

  await openPlan(page);
  await panel(page).click();
  const campo = page.getByLabel(`Fecha de ${primera.label}`, { exact: true }).first();
  await elegirFecha(page, campo, isoIn(20));
  await expect(page.getByText("faltan 20 días").first()).toBeVisible();

  await quitarFecha(page, primera.label);

  await expect(page.getByText("faltan 20 días")).toHaveCount(0);
  await expect
    .poll(async () => (await planDates(page))[primera.key])
    .toBeUndefined();
});

test("«Borrar fechas» las saca todas y «Reiniciar el plan» no las toca", async ({ page }) => {
  const contenido = await plan();
  const instances = contenido?.instances ?? [];
  test.skip(instances.length === 0, "el plan de esta materia todavía no declara instancias evaluatorias");
  const primera = instances[0]!;

  await openPlan(page);
  await panel(page).click();
  await elegirFecha(page, page.getByLabel(`Fecha de ${primera.label}`, { exact: true }).first(), isoIn(30));
  await expect(page.getByText("faltan 30 días").first()).toBeVisible();

  /* Reiniciar el progreso tilda… y destilda: las fechas siguen ahí. Es la
     diferencia que el baseline dejaba explícita en su confirmación. */
  const tarea = phases(page).first().getByRole("checkbox").first();
  await tarea.click();
  await expect(page.getByTestId("plan-total")).not.toHaveText(/^0\//);

  await page.getByRole("button", { name: "Reiniciar el plan" }).click();
  const confirmarPlan = page.getByRole("dialog");
  await confirmarPlan.getByRole("button", { name: "Reiniciar el plan" }).click();

  await expect(page.getByTestId("plan-total")).toHaveText(/^0\//);
  await expect(page.getByText("faltan 30 días").first()).toBeVisible();
  await expect
    .poll(async () => (await planDates(page))[primera.key])
    .toBe(isoIn(30));

  // Ahora sí, borrar las fechas.
  await page.getByRole("button", { name: "Borrar fechas" }).click();
  const confirmarFechas = page.getByRole("dialog");
  await confirmarFechas.getByRole("button", { name: "Borrar fechas" }).click();

  await expect(page.getByText("faltan 30 días")).toHaveCount(0);
  await expect(page.getByLabel(`Fecha de ${primera.label}`, { exact: true }).first()).toHaveAttribute("data-value", "");
  await expect
    .poll(async () => Object.keys(await planDates(page)).length)
    .toBe(0);
});

/**
 * Elegir un día en el calendario propio guarda UNA sola fecha: ni al abrirlo, ni
 * al cambiar de mes, ni al mover el foco por la rejilla se escribe nada.
 */
test("elegir la fecha en el calendario guarda una sola vez", async ({ page }) => {
  const contenido = await plan();
  const instances = contenido?.instances ?? [];
  test.skip(instances.length === 0, "el plan de esta materia todavía no declara instancias evaluatorias");
  const primera = instances[0]!;

  await openPlan(page);
  await panel(page).click();
  const campo = page.getByLabel(`Fecha de ${primera.label}`, { exact: true }).first();
  const objetivo = isoIn(45);

  // Abrir el calendario y pasear por los meses no guarda nada.
  await campo.click();
  const dialogo = page.getByRole("dialog", { name: /Elegir fecha/ });
  await expect(dialogo).toBeVisible();
  await dialogo.getByRole("button", { name: "Mes siguiente" }).click();
  await dialogo.getByRole("button", { name: "Mes anterior" }).click();
  expect(await planDates(page), "abrir el calendario guardó una fecha").toEqual({});
  await page.keyboard.press("Escape");

  await elegirFecha(page, campo, objetivo);

  await expect
    .poll(async () => (await planDates(page))[primera.key], {
      message: "la fecha elegida no quedó guardada",
    })
    .toBe(objetivo);
  // Una sola fecha: la de la instancia elegida.
  expect(Object.keys(await planDates(page))).toEqual([primera.key]);
  await expect(page.getByLabel(`Fecha de ${primera.label}`, { exact: true }).nth(1)).toHaveAttribute("data-value", objetivo);
});

test("un plan sin instancias no dibuja el panel de fechas", async ({ page }) => {
  const contenido = await plan();
  test.skip((contenido?.instances ?? []).length > 0, "el plan de esta materia sí declara instancias");

  await openPlan(page);
  await expect(panel(page)).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Borrar fechas" })).toHaveCount(0);
  /* «Reiniciar el plan» no depende de las fechas: siempre está. */
  await expect(page.getByRole("button", { name: "Reiniciar el plan" })).toBeVisible();
});
