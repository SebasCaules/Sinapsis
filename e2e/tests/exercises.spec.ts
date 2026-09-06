/**
 * Segundo bundle de la materia: `proba-exercises` (ejercicios, simulador de
 * parcial y formularios).
 *
 * Lo que se prueba es que las TRES vistas del segundo bundle se monten en el
 * host y dibujen su contenido de verdad —el índice de las 289 fichas, la
 * pantalla de preparación del parcial con su banco y el formulario con sus
 * pestañas por unidad—, y que el estado por ejercicio quede guardado con el
 * prefijo de la materia. No se prueba el dibujo fino de cada vista: eso se
 * coteja contra el baseline en `design/referencias/brechas-fix/`.
 *
 * La siembra general (`global-setup.ts`) publica UN bundle por materia, el de
 * `proba-tools`. Este archivo publica el suyo en `beforeAll` con el mismo
 * `buildBundle` que usa `sinapsis tools build` —un bundle roto corta la prueba
 * acá, con el problema que reportaría el CLI— y lo retira en `afterAll`, para
 * dejar la base como la encontró.
 *
 * En modo demo (sin el vault de Proba) no hay corpus que montar: la suite se
 * salta entera.
 */
import path from "node:path";
import { expect, test, type APIRequestContext } from "@playwright/test";
import { subjectTools, waitForSubjectShell, withApi } from "../support/app";
import { API_ORIGIN, REPO_ROOT, SYNC_TOKEN, readSeed } from "../support/seed";

const seed = readSeed();
const subject = seed.subject;
const BUNDLE_DIR = path.join(REPO_ROOT, "examples/proba/tools/proba-exercises");
const BUNDLE_ID = "proba-exercises";

/** Las tres vistas del manifiesto, con algo que solo dibuja cada una. */
const VISTAS = [
  { id: "ejercicios", texto: /289 ejercicios resueltos/ },
  { id: "parcial", texto: /Banco disponible:/ },
  { id: "formularios", texto: /Todo el programa/ },
] as const;

test.describe("Ejercicios, parcial y formularios (bundle proba-exercises)", () => {
  test.skip(seed.mode !== "proba", "sin el vault de Proba no hay corpus de ejercicios que montar");

  test.beforeAll(async () => {
    const { buildBundle } = (await import("../../packages/cli/src/tools/bundle.js")) as {
      buildBundle: (dir: string) => Promise<
        | { ok: true; bundle: { push: unknown; manifest: { id: string } } }
        | { ok: false; problems: Array<{ where: string; message: string }> }
      >;
    };
    const outcome = await buildBundle(BUNDLE_DIR);
    if (!outcome.ok) {
      const detalle = outcome.problems.map((p) => `${p.where}: ${p.message}`).join(" · ");
      throw new Error(`El bundle ${BUNDLE_ID} no se puede publicar: ${detalle}`);
    }
    await withApi(async (api: APIRequestContext) => {
      const res = await api.put(`${API_ORIGIN}/api/subjects/${subject.slug}/tools/${BUNDLE_ID}`, {
        data: outcome.bundle.push,
        headers: { authorization: `Bearer ${SYNC_TOKEN}` },
      });
      if (res.status() !== 200 && res.status() !== 201) {
        throw new Error(`PUT .../tools/${BUNDLE_ID} → ${res.status()} ${await res.text()}`);
      }
    });
  });

  /* Se retira con el MISMO token con el que se publicó (`DELETE .../tools/:id`
     pide el token de sync, no la cookie): si quedara publicado, el sitio del
     rail que `tools.spec.ts` usa para probar «Próximamente» dejaría de estar
     libre y esa prueba fallaría. */
  test.afterAll(async () => {
    await withApi(async (api: APIRequestContext) => {
      const res = await api.delete(`${API_ORIGIN}/api/subjects/${subject.slug}/tools/${BUNDLE_ID}`, {
        headers: { authorization: `Bearer ${SYNC_TOKEN}` },
      });
      if (res.status() !== 204) {
        throw new Error(`DELETE .../tools/${BUNDLE_ID} → ${res.status()} ${await res.text()}`);
      }
    });
  });

  test("el API publica el bundle con sus tres vistas", async ({ request }) => {
    const tools = await subjectTools(request, subject.slug);
    const info = tools.find((t) => t.manifest.id === BUNDLE_ID);
    expect(info, `«${BUNDLE_ID}» no quedó publicado`).toBeTruthy();
    expect(info?.manifest.views.map((v) => v.id)).toEqual(["ejercicios", "parcial", "formularios"]);
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
