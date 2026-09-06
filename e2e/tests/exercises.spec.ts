/**
 * Segundo bundle de la materia: `proba-exercises` (ejercicios, simulador de
 * parcial y formularios).
 *
 * Lo que se prueba es que las TRES vistas del segundo bundle se monten en el
 * host y dibujen su contenido de verdad —el índice de las fichas, la pantalla de
 * preparación del parcial con su banco y el formulario con sus pestañas por
 * unidad—, y que el estado por ejercicio quede guardado con el prefijo de la
 * materia. No se prueba el dibujo fino de cada vista: eso se coteja contra el
 * baseline en `design/referencias/brechas-fix/`.
 *
 * Sprint 4: ya no hace falta publicar nada. `sinapsis site build` compila TODOS
 * los bundles de `subjects/proba/tools/` al sitio, así que el segundo llega con
 * la siembra igual que el primero; lo que antes hacían `beforeAll` y `afterAll`
 * (publicar y retirar por HTTP) desapareció con el API.
 *
 * En modo demo (con el fixture) no hay corpus que montar: la suite se salta
 * entera.
 */
import { expect, test } from "@playwright/test";
import { subjectTools, waitForSubjectShell } from "../support/app";
import { readSeed } from "../support/seed";

const seed = readSeed();
const subject = seed.subject;
const BUNDLE_ID = "proba-exercises";

/** Las tres vistas del manifiesto, con algo que solo dibuja cada una. */
const VISTAS = [
  { id: "ejercicios", texto: /289 ejercicios resueltos/ },
  { id: "parcial", texto: /Banco disponible:/ },
  { id: "formularios", texto: /Todo el programa/ },
] as const;

test.describe("Ejercicios, parcial y formularios (bundle proba-exercises)", () => {
  test.skip(seed.mode !== "proba", "sin la materia real no hay corpus de ejercicios que montar");

  test("el sitio compila el bundle con sus tres vistas", async () => {
    const tools = subjectTools(subject.slug);
    const info = tools.find((t) => t.manifest.id === BUNDLE_ID);
    expect(info, `«${BUNDLE_ID}» no quedó compilado en el sitio`).toBeTruthy();
    expect(info?.manifest.views.map((v) => v.id)).toEqual(["ejercicios", "parcial", "formularios"]);
    expect(info?.base).toBe(`subjects/${subject.slug}/tools/${BUNDLE_ID}`);
  });

  for (const vista of VISTAS) {
    test(`la vista «${vista.id}» se monta y dibuja lo suyo`, async ({ page }) => {
      const errores: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") errores.push(msg.text());
      });
      page.on("pageerror", (error) => errores.push(String(error)));

      await page.goto(`/m/${subject.slug}/t/${vista.id}`);
      await waitForSubjectShell(page);

      const montada = page.locator(`.sinapsis-tool[data-view="${vista.id}"]`);
      await expect(montada).toBeVisible();
      await expect(montada).toContainText(vista.texto);
      expect(errores, `la vista «${vista.id}» dejó errores en consola`).toEqual([]);
    });
  }

  test("marcar un ejercicio guarda el estado con el prefijo de la materia", async ({ page }) => {
    /* La colección de la guía de una unidad con ejercicios: el índice enlaza a
       la primera que existe, así que se entra por él y no por una URL fija. */
    await page.goto(`/m/${subject.slug}/t/ejercicios`);
    await waitForSubjectShell(page);
    const primeraUnidad = page.locator('.sinapsis-tool a[href^="#/ejercicios/"]').first();
    await expect(primeraUnidad).toBeVisible();
    await primeraUnidad.click();

    const item = page.locator(".sinapsis-tool .ej-item").first();
    await expect(item).toBeVisible();
    await item.getByRole("radio", { name: "Resuelto solo" }).click();

    await expect(item.getByRole("radio", { name: "Resuelto solo" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    const guardado = await page.evaluate(
      (slug) => localStorage.getItem(`sinapsis.${slug}.rt.pe.exEstado`),
      subject.slug,
    );
    expect(guardado, "el semáforo no guardó nada en App.LS").toBeTruthy();
    expect(JSON.parse(guardado ?? "{}")).toMatchObject({ v: 1 });
  });

  test("el rail de la materia lleva a las tres vistas", async ({ page }) => {
    await page.goto(`/m/${subject.slug}`);
    await waitForSubjectShell(page);
    const rail = page.locator('nav[aria-label="Secciones de la materia"]');
    for (const vista of VISTAS) {
      await expect(rail.locator(`a[href="/m/${subject.slug}/t/${vista.id}"]`)).toHaveCount(1);
    }
  });
});
