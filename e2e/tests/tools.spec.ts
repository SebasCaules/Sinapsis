/**
 * Herramientas de la materia (Sprint 3 · N0-41): el bundle que publica
 * `sinapsis tools push` y que el shell monta en `/m/:materia/t/:vista`.
 *
 * Lo que se prueba es la costura, no el dibujo: que el rail abra los slots que
 * declara el config, que la vista se monte de verdad dentro de `.sinapsis-tool`
 * (con su título y algo dibujado), que sobreviva a un cambio de tema, que salir
 * y volver la vuelva a montar y que una vista que ningún bundle registra no
 * rompa nada.
 *
 * El bundle lo siembra `global-setup.ts`: el de verdad de Proba
 * (`examples/proba/tools/proba-tools`) o el mínimo `fixtures/mini-tools/`. Las
 * vistas y sus rótulos salen del manifiesto, por `.auth/seed.json`.
 */
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";
import { setUserTheme, subjectTools, waitForSubjectShell, withApi } from "../support/app";
import { readSeed, SHOTS_DIR } from "../support/seed";

const seed = readSeed();
const subject = seed.subject;
const tools = seed.tools;
/** La vista con la que corren las pruebas: la primera del manifiesto. */
const view = tools.view;

/** Vista que ningún bundle registra: el estado de «no está» del host. */
const VISTA_INEXISTENTE = "vista-que-no-existe";

const rail = (page: Page) => page.locator('nav[aria-label="Secciones de la materia"]');
const host = (page: Page) => page.getByTestId("tool-host");
/** El nodo que el host le presta al bundle, ya montado. */
const mounted = (page: Page, id: string) => page.locator(`.sinapsis-tool[data-view="${id}"]`);
/** Lo que dibuja la vista: un lienzo o un vectorial dentro del nodo del bundle. */
const drawing = (page: Page, id: string) => mounted(page, id).locator("canvas, svg");

/** Errores de consola y excepciones sin atrapar, desde antes de navegar. */
function watchErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (error) => errors.push(String(error)));
  return errors;
}

async function openTool(page: Page, id: string): Promise<void> {
  await page.goto(`/m/${subject.slug}/t/${id}`);
  await waitForSubjectShell(page);
}

/**
 * Cambia el tema desde la cabecera. El control es un MENÚ
 * (`aria-haspopup="menu"`), así que se abre y se elige una escala distinta de la
 * puesta; la tecla «t» no sirve acá porque el foco puede estar en un campo de la
 * herramienta, donde los atajos de una sola letra no corren.
 */
async function elegirOtroTema(page: Page, actual: string | null): Promise<void> {
  await page.getByRole("button", { name: /^Tema: / }).click();
  const otro = ["Pergamino", "Laurel", "Claustro"].find(
    (nombre) => nombre.toLowerCase() !== (actual ?? "").toLowerCase(),
  );
  await page.getByRole("menuitemradio", { name: new RegExp(`^${otro}`) }).click();
  await expect(page.locator("html")).not.toHaveAttribute("data-theme", actual ?? "");
}

/** Espera a que la vista esté montada y dibujando. */
async function expectMounted(page: Page, id: string): Promise<void> {
  await expect(mounted(page, id)).toBeVisible();
  await expect(mounted(page, id)).toHaveAttribute("data-tool", tools.id);
  await expect(drawing(page, id).first()).toBeVisible();
}

test.afterAll(async () => {
  // La prueba del tema escribe el del perfil (es global, N0-8).
  await withApi((api) => setUserTheme(api, "pergamino"));
});

test("el rail abre los slots de herramientas que declara la materia", async ({ page, request }) => {
  const published = await subjectTools(request, subject.slug);
  const info = published.find((t) => t.manifest.id === tools.id);
  expect(info, `la materia no publicó el bundle «${tools.id}»`).toBeDefined();
  expect(info?.manifest.views.map((v) => v.id)).toEqual(tools.views.map((v) => v.id));

  await page.goto(`/m/${subject.slug}`);
  await waitForSubjectShell(page);

  expect(seed.railTools.length).toBeGreaterThan(0);
  for (const item of seed.railTools) {
    const link = rail(page).getByRole("link", { name: item.label, exact: true });
    await expect(link).toHaveAttribute("href", `/m/${subject.slug}/t/${item.target}`);
  }

  // Al menos un slot abre una vista que el bundle registra de verdad.
  const registrados = seed.railTools.filter((item) => tools.views.some((v) => v.id === item.target));
  expect(registrados.length).toBeGreaterThan(0);
});

test("la vista de la materia se monta con su título y su dibujo", async ({ page }) => {
  const errores = watchErrors(page);
  await openTool(page, view.id);

  await expect(host(page)).toBeVisible();
  await expectMounted(page, view.id);
  // El título lo escribe el bundle; el rótulo es el del manifiesto.
  await expect(mounted(page, view.id).getByRole("heading", { name: view.label })).toBeVisible();

  await page.screenshot({ path: path.join(SHOTS_DIR, `herramienta-${view.id}.png`) });
  expect(errores).toEqual([]);
});

test("cambiar de tema desde la cabecera no rompe la vista montada", async ({ page }) => {
  const errores = watchErrors(page);
  await openTool(page, view.id);
  await expectMounted(page, view.id);

  const antes = await page.locator("html").getAttribute("data-theme");
  await elegirOtroTema(page, antes);

  // La vista sigue montada y dibujando (la vuelva a montar el host o se redibuje
  // sola: el bundle decide, la herramienta tiene que quedar en pie).
  await expectMounted(page, view.id);
  await expect(mounted(page, view.id).getByRole("heading", { name: view.label })).toBeVisible();

  const tema = await page.locator("html").getAttribute("data-theme");
  await page.screenshot({ path: path.join(SHOTS_DIR, `herramienta-${view.id}-${tema}.png`) });
  expect(errores).toEqual([]);
});

test("cambiar de tema no borra lo que el usuario cargó en la herramienta", async ({ page }) => {
  /* Brecha herr-05: la calculadora no registra redibujo propio, así que el host
     la volvía a montar al cambiar el tema y le borraba los campos. */
  test.skip(seed.mode !== "proba", "necesita las calculadoras de Proba");
  const errores = watchErrors(page);
  await openTool(page, "calc");
  await expect(mounted(page, "calc").locator("#calcRoot")).toBeVisible();

  const campo = mounted(page, "calc").locator("#calcRoot input").first();
  await campo.fill("42");

  const antes = await page.locator("html").getAttribute("data-theme");
  await elegirOtroTema(page, antes);

  await expect(mounted(page, "calc").locator("#calcRoot input").first()).toHaveValue("42");
  expect(errores).toEqual([]);
});

test("cambiar de sección en las calculadoras conserva lo escrito", async ({ page }) => {
  /* Brecha herr-13 (y herr-02: los chips de sección son `<a href="#/calc/…">`
     sin `data-nav`, y en el baseline navegaban igual). */
  test.skip(seed.mode !== "proba", "necesita las calculadoras de Proba");
  const errores = watchErrors(page);
  await openTool(page, "calc");
  await expect(mounted(page, "calc").locator("#calcRoot")).toBeVisible();

  const campo = mounted(page, "calc").locator("#calcRoot input").first();
  await campo.fill("42");
  await mounted(page, "calc").locator('#calcSubnav a[data-sec="ic"]').click();

  await expect(page).toHaveURL(/[?&]arg=ic/);
  await expect(mounted(page, "calc").locator("#calcSubnav a.on")).toHaveText(/Intervalos/);
  await expect(mounted(page, "calc").locator("#calcRoot input").first()).toHaveValue("42");
  expect(errores).toEqual([]);
});

test("el asistente avanza por el árbol de decisión hasta el resultado", async ({ page }) => {
  /* Brecha herr-01: las tres acciones se redibujaban sobre `$("#main")`, que en
     la plataforma no existe, y cada clic lanzaba una excepción. */
  test.skip(seed.mode !== "proba", "necesita el asistente de Proba");
  const errores = watchErrors(page);
  await openTool(page, "asistente");
  await expect(mounted(page, "asistente").locator(".wiz-opt").first()).toBeVisible();

  await mounted(page, "asistente").locator(".wiz-opt").first().click();
  await expect(mounted(page, "asistente").locator(".wiz-crumbs span").first()).toBeVisible();

  for (let i = 0; i < 6; i++) {
    const opciones = mounted(page, "asistente").locator(".wiz-opt");
    if ((await opciones.count()) === 0) break;
    await opciones.first().click();
  }
  await expect(mounted(page, "asistente").locator(".wiz-result")).toBeVisible();

  /* «Empezar de nuevo» vuelve a la primera pregunta. */
  await mounted(page, "asistente").locator('[data-action="wiz-reset"]').click();
  await expect(mounted(page, "asistente").locator(".wiz-crumbs")).toHaveCount(0);
  await expect(mounted(page, "asistente").locator(".wiz-opt").first()).toBeVisible();

  expect(errores).toEqual([]);
});

test("la pestaña del navegador nombra a la materia, no a la app anterior", async ({ page }) => {
  /* Brecha herr-10: el bundle escribía `document.title` con el nombre de la app
     del baseline y ganaba, porque se monta después del efecto del shell. */
  test.skip(seed.mode !== "proba", "necesita el bundle de Proba");
  for (const id of ["explorador", "calc", "taller", "lab"]) {
    await openTool(page, id);
    await expect(mounted(page, id)).toBeVisible();
    await expect(page).toHaveTitle(new RegExp(`· ${subject.name}$`));
  }
});

test("volver al inicio de la materia y regresar vuelve a montar la vista", async ({ page }) => {
  const errores = watchErrors(page);
  await openTool(page, view.id);
  await expectMounted(page, view.id);

  await rail(page).getByRole("link", { name: "Inicio", exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/m/${subject.slug}$`));
  await expect(page.getByRole("heading", { name: "Progreso", level: 1 })).toBeVisible();
  await expect(mounted(page, view.id)).toHaveCount(0);

  await page.goBack();
  await expect(page).toHaveURL(new RegExp(`/m/${subject.slug}/t/${view.id}$`));
  await expectMounted(page, view.id);
  await expect(mounted(page, view.id).getByRole("heading", { name: view.label })).toBeVisible();

  expect(errores).toEqual([]);
});

test("una herramienta que la materia no reservó devuelve al inicio", async ({ page }) => {
  const errores = watchErrors(page);
  /* El baseline no deja al usuario en una pantalla muerta: una ruta que no
     existe vuelve al inicio de la materia (core.js:1359). «Próximamente» es una
     promesa, y solo vale para lo que la materia SÍ reservó en el rail. */
  await openTool(page, VISTA_INEXISTENTE);

  await expect(page).toHaveURL(new RegExp(`/m/${subject.slug}$`));
  await expect(page.getByRole("heading", { name: "Progreso", level: 1 })).toBeVisible();
  await expect(page.getByText("PRÓXIMAMENTE")).toHaveCount(0);
  await expect(host(page)).toHaveCount(0);

  expect(errores).toEqual([]);
});

test("un sitio reservado en el rail que ningún bundle registra dice «Próximamente»", async ({ page }) => {
  /* Solo se puede probar si la materia sembrada reservó un ítem sin vista: con
     el vault real de Proba, los cinco slots tienen bundle. */
  const reservado = seed.railTools.find((item) => !tools.views.some((v) => v.id === item.target));
  test.skip(!reservado, "la materia sembrada no tiene ningún slot de herramienta sin bundle");

  const errores = watchErrors(page);
  await openTool(page, reservado!.target);
  await expect(page.getByText("PRÓXIMAMENTE")).toBeVisible();
  await expect(page.getByRole("heading", { name: reservado!.label, level: 1 })).toBeVisible();
  await expect(host(page)).toHaveCount(0);
  expect(errores).toEqual([]);
});

test("los enlaces del bundle a vistas de la plataforma llegan a la vista real", async ({ page }) => {
  /* El pie del hub del taller manda a `#/plan` y a `#/calc`: la primera es una
     vista PROPIA de la plataforma y no una herramienta (brecha herr-03). */
  test.skip(seed.mode !== "proba", "necesita el bundle de Proba");
  const errores = watchErrors(page);
  await openTool(page, "taller");
  await expect(mounted(page, "taller")).toBeVisible();

  await mounted(page, "taller").getByRole("link", { name: /Plan de estudio/ }).click();
  await expect(page).toHaveURL(new RegExp(`/m/${subject.slug}/plan$`));
  await expect(page.getByText("PRÓXIMAMENTE")).toHaveCount(0);

  expect(errores).toEqual([]);
});
