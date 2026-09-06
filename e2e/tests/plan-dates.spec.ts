/**
 * Fechas de las instancias evaluatorias del plan (Sprint 3 · D7).
 *
 * Las instancias —los parcialitos, el parcial, su recuperatorio, el final— las
 * declara la materia en `estudio/plan.json` (`Plan.instances`); la FECHA de cada
 * una la carga el usuario y vive en su cuenta (`StudyState.planDates`), no en el
 * wiki. De ahí salen los chips de cuenta regresiva del panel del hero y de cada
 * fase, y la línea de ritmo.
 *
 * Como todo lo demás del plan, las instancias salen del material sincronizado:
 * si la materia sembrada no declara ninguna, la prueba se saltea en vez de
 * inventar contenido.
 *
 * El campo de fecha guarda con el evento `change` nativo, así que se usa
 * `fill()` (que lo dispara) y se espera al chip, no al valor del input: la
 * escritura es optimista y el chip es lo que ve quien estudia.
 */
import { expect, test, type APIRequestContext, type Locator, type Page } from "@playwright/test";
import { resetStudy, studyContent, studyState, waitForSubjectShell, withApi } from "../support/app";
import { API_ORIGIN, readSeed } from "../support/seed";

/* `support/app.ts` es de otro agente y sus DTO todavía no nombran las fechas del
   plan (son de este sprint): acá se declaran las dos formas que hacen falta, sin
   tocar el archivo compartido. */
interface PlanInstanceDto {
  key: string;
  label: string;
  optional?: boolean;
}
interface PlanDto {
  title: string;
  phases: Array<{ id: string; title: string; instance?: string; retake?: string }>;
  instances?: PlanInstanceDto[];
}

/** El plan de la materia sembrada, con las instancias evaluatorias que declara. */
async function plan(request: APIRequestContext): Promise<PlanDto | null> {
  return ((await studyContent(request, subject.slug)).plan ?? null) as PlanDto | null;
}

/** Las fechas cargadas por el usuario (`StudyState.planDates`). */
async function planDates(request: APIRequestContext): Promise<Record<string, string>> {
  const state = (await studyState(request, subject.slug)) as unknown as {
    planDates?: Record<string, string>;
  };
  return state.planDates ?? {};
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

/** Las fechas del usuario, que `resetStudy` no toca (son otra tabla y otra acción). */
async function clearDates(request: APIRequestContext): Promise<void> {
  await request.delete(`${API_ORIGIN}/api/subjects/${subject.slug}/study/plan-dates`);
}

async function openPlan(page: Page): Promise<void> {
  await page.goto(planUrl);
  await waitForSubjectShell(page);
  await expect(phases(page).first()).toBeVisible();
}

test.beforeEach(async ({ request }) => {
  await resetStudy(request, subject.slug);
  await clearDates(request);
});

test.afterAll(async () => {
  await withApi(async (api) => {
    await resetStudy(api, subject.slug);
    await clearDates(api);
  });
});

test("cargar la fecha de una instancia la cuenta, la baja a su fase y persiste", async ({
  page,
  request,
}) => {
  const contenido = await plan(request);
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
    .poll(async () => (await planDates(request))[primera.key], {
      message: "el API no registró la fecha de la instancia",
    })
    .toBe(isoIn(12));

  /* …y sobrevive a la recarga. El chip que se mira es el de la TARJETA: el panel
     del hero vuelve plegado, y el suyo queda dentro de un `details` cerrado. */
  await page.reload();
  await waitForSubjectShell(page);
  await expect(tarjeta.getByLabel(`Fecha de ${primera.label}`, { exact: true })).toHaveAttribute("data-value", isoIn(12));
  await expect(tarjeta.getByText("faltan 12 días")).toBeVisible();
});

test("vaciar el campo borra la fecha", async ({ page, request }) => {
  const contenido = await plan(request);
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
    .poll(async () => (await planDates(request))[primera.key])
    .toBeUndefined();
});

test("«Borrar fechas» las saca todas y «Reiniciar el plan» no las toca", async ({ page, request }) => {
  const contenido = await plan(request);
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
    .poll(async () => (await planDates(request))[primera.key])
    .toBe(isoIn(30));

  // Ahora sí, borrar las fechas.
  await page.getByRole("button", { name: "Borrar fechas" }).click();
  const confirmarFechas = page.getByRole("dialog");
  await confirmarFechas.getByRole("button", { name: "Borrar fechas" }).click();

  await expect(page.getByText("faltan 30 días")).toHaveCount(0);
  await expect(page.getByLabel(`Fecha de ${primera.label}`, { exact: true }).first()).toHaveAttribute("data-value", "");
  await expect
    .poll(async () => Object.keys(await planDates(request)).length)
    .toBe(0);
});

/**
 * Elegir un día en el calendario propio guarda UNA sola vez: ni al abrir, ni al
 * cambiar de mes, ni al mover el foco por la rejilla se dispara ningún PUT.
 */
test("elegir la fecha en el calendario guarda una sola vez", async ({ page, request }) => {
  const contenido = await plan(request);
  const instances = contenido?.instances ?? [];
  test.skip(instances.length === 0, "el plan de esta materia todavía no declara instancias evaluatorias");
  const primera = instances[0]!;

  const puts: string[] = [];
  await page.route("**/study/plan-dates/**", async (route) => {
    if (route.request().method() === "PUT") puts.push(route.request().postData() ?? "");
    await route.continue();
  });

  await openPlan(page);
  await panel(page).click();
  const campo = page.getByLabel(`Fecha de ${primera.label}`, { exact: true }).first();
  const objetivo = isoIn(45);
  await elegirFecha(page, campo, objetivo);

  await expect
    .poll(async () => (await planDates(request))[primera.key], {
      message: "el API no registró la fecha elegida",
    })
    .toBe(objetivo);
  expect(puts, `un solo PUT: ${puts.join(" | ")}`).toHaveLength(1);
  await expect(page.getByLabel(`Fecha de ${primera.label}`, { exact: true }).nth(1)).toHaveAttribute("data-value", objetivo);
});

/**
 * Reproducción del bug: con el guardado lento y fallando, cada mutación
 * solapada guardaba como «estado anterior» una foto que ya traía el parche
 * optimista de la anterior, así que la última vuelta atrás restauraba una fecha
 * que el servidor nunca guardó. Quedaban los dos campos de la MISMA instancia
 * con valores distintos y dos chips contando días desde el año 202.
 */
test("si el guardado falla no queda nada a la vista que el servidor no tenga", async ({
  page,
  request,
}) => {
  const contenido = await plan(request);
  const instances = contenido?.instances ?? [];
  test.skip(instances.length === 0, "el plan de esta materia todavía no declara instancias evaluatorias");
  const primera = instances[0]!;

  await page.route("**/study/plan-dates/**", async (route) => {
    if (route.request().method() !== "PUT") return route.continue();
    await new Promise((r) => setTimeout(r, 900));
    await route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ error: "falla simulada" }),
    });
  });

  await openPlan(page);
  await panel(page).click();
  const campos = page.getByLabel(`Fecha de ${primera.label}`, { exact: true });

  /* Espaciados más que el antirrebote: cada uno sale como su propio PUT y, con
     900 ms de latencia, se solapan entre sí. El foco NO se saca del campo. */
  await campos.first().focus();
  for (const value of ["0002-04-15", "0020-04-15", "0202-04-15", "2027-04-15"]) {
    await campos.first().evaluate((el: HTMLInputElement, v: string) => {
      el.value = v;
      el.dispatchEvent(new Event("change", { bubbles: true }));
    }, value);
    await page.waitForTimeout(450);
  }
  await expect(campos.first()).toBeFocused();

  // Nada se guardó…
  await expect
    .poll(async () => Object.keys(await planDates(request)).length, {
      message: "el API guardó algo pese al 500",
    })
    .toBe(0);

  // …así que nada puede quedar a la vista, ni siquiera con el foco adentro.
  await expect(campos.first()).toHaveAttribute("data-value", "");
  await expect(campos.nth(1)).toHaveAttribute("data-value", "");
  await expect(page.getByText(/faltan .* días|falta 1 día|es hoy|pasó hace/)).toHaveCount(0);
});

test("un plan sin instancias no dibuja el panel de fechas", async ({ page, request }) => {
  const contenido = await plan(request);
  test.skip((contenido?.instances ?? []).length > 0, "el plan de esta materia sí declara instancias");

  await openPlan(page);
  await expect(panel(page)).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Borrar fechas" })).toHaveCount(0);
  /* «Reiniciar el plan» no depende de las fechas: siempre está. */
  await expect(page.getByRole("button", { name: "Reiniciar el plan" })).toBeVisible();
});
