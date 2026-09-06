/**
 * Temas: la tecla T cicla pergamino → laurel → claustro, el tema sobrevive a la
 * recarga (localStorage + perfil) y se guardan las capturas del smoke visual en
 * `e2e/shots/<vista>-<tema>.png` a 1440×1024.
 *
 * Son ocho vistas × tres temas: landing, inicio de materia, lector, grafo,
 * flashcards, sesión de repaso, plan y kits. Todas salen deterministas salvo el
 * grafo, cuyo lienzo parte de posiciones al azar (la simulación de fuerzas): la
 * captura sirve para mirar los colores del tema, no para comparar píxeles.
 *
 * Corre al final de la suite (orden alfabético) porque escribe el tema del
 * perfil; `afterAll` lo devuelve a pergamino.
 */
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";
import { currentTheme, resetLanding, setUserTheme, waitForSubjectShell } from "../support/app";
import { readSeed, SHOTS_DIR } from "../support/seed";

const seed = readSeed();
const subject = seed.subject;

const CICLO = ["pergamino", "laurel", "claustro"] as const;
type Tema = (typeof CICLO)[number];

/** Mazo de la captura de sesión: el autoral más corto de la materia sembrada. */
const SESION_DECK = seed.study.deck?.id ?? "";

const shot = (vista: string, tema: string) => path.join(SHOTS_DIR, `${vista}-${tema}.png`);

test.beforeEach(async ({ page }) => {
  await resetLanding(page);
  await setUserTheme(page, "pergamino");
});

/** Espera a que el `<html data-theme>` valga `tema`. */
async function expectTheme(page: Page, tema: Tema): Promise<void> {
  await expect(page.locator("html")).toHaveAttribute("data-theme", tema);
}

test("la tecla T cicla los tres temas y el elegido persiste tras recargar", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Materias", level: 1 })).toBeVisible();
  await expectTheme(page, "pergamino");

  await page.keyboard.press("t");
  await expectTheme(page, "laurel");

  await page.keyboard.press("t");
  await expectTheme(page, "claustro");

  await page.keyboard.press("t");
  await expectTheme(page, "pergamino");

  // Una vuelta más para dejar un tema distinto del inicial y recargar.
  await page.keyboard.press("t");
  await expectTheme(page, "laurel");

  await page.reload();
  await expect(page.getByRole("heading", { name: "Materias", level: 1 })).toBeVisible();
  expect(await currentTheme(page)).toBe("laurel");
});

test("capturas de las ocho vistas en los tres temas", async ({ page }) => {
  const vistas: Array<{ nombre: string; abrir: () => Promise<void> }> = [
    {
      nombre: "landing",
      abrir: async () => {
        await page.goto("/");
        await expect(page.getByRole("heading", { name: "Materias", level: 1 })).toBeVisible();
      },
    },
    {
      nombre: "materia",
      abrir: async () => {
        await page.goto(`/m/${subject.slug}`);
        await waitForSubjectShell(page);
        await expect(page.getByRole("heading", { name: "Progreso", level: 1 })).toBeVisible();
      },
    },
    {
      nombre: "lector",
      abrir: async () => {
        await page.goto(`/m/${subject.slug}/p/${seed.readerPage.slug}`);
        await waitForSubjectShell(page);
        await expect(page.getByRole("heading", { level: 1, name: seed.readerPage.title })).toBeVisible();
        await expect(page.locator("article .katex").first()).toBeVisible();
      },
    },
    {
      nombre: "grafo",
      abrir: async () => {
        await page.goto(`/m/${subject.slug}/graph`);
        await waitForSubjectShell(page);
        await expect(page.getByRole("heading", { name: "Grafo de conexiones", level: 1 })).toBeVisible();
        await expect(page.getByTestId("graph-meta")).toHaveText(/\d+ de \d+ páginas/);
        // El lienzo se dibuja con una simulación de fuerzas: se la deja asentar.
        await page.waitForTimeout(900);
      },
    },
    {
      nombre: "flashcards",
      abrir: async () => {
        await page.goto(`/m/${subject.slug}/flashcards`);
        await waitForSubjectShell(page);
        await expect(page.getByRole("heading", { name: "Flashcards", level: 1 })).toBeVisible();
        await expect(page.getByTestId("deck-card").first()).toBeVisible();
      },
    },
    {
      nombre: "sesion",
      abrir: async () => {
        await page.goto(`/m/${subject.slug}/flashcards/${SESION_DECK}?modo=todo`);
        await waitForSubjectShell(page);
        await expect(page.getByTestId("session-counter")).toBeVisible();
        await expect(page.getByRole("button", { name: "Ver la respuesta" })).toBeVisible();
      },
    },
    {
      nombre: "plan",
      abrir: async () => {
        await page.goto(`/m/${subject.slug}/plan`);
        await waitForSubjectShell(page);
        await expect(page.getByTestId("plan-phase").first()).toBeVisible();
      },
    },
    {
      nombre: "kits",
      abrir: async () => {
        await page.goto(`/m/${subject.slug}/kits`);
        await waitForSubjectShell(page);
        await expect(page.getByRole("heading", { name: "Kits de estudio", level: 1 })).toBeVisible();
        await expect(page.getByTestId("kit-card").first()).toBeVisible();
      },
    },
  ];

  // El índice recuerda qué divisiones están abiertas: se fija la del lector antes
  // de la primera captura para que las nueve salgan con el mismo árbol desplegado.
  await page.goto("/");
  await page.evaluate(
    ([slug, division]) => {
      localStorage.setItem(`sinapsis.${slug}.openDivisions`, JSON.stringify([division]));
    },
    [subject.slug, seed.readerPage.division],
  );

  for (const tema of CICLO) {
    /* El tema es del PERFIL (N0-8: global, no por materia) y se guarda con el
       resto del estado local, así que fijarlo con el gancho es lo mismo que
       ciclarlo con la tecla T. */
    await setUserTheme(page, tema);
    for (const vista of vistas) {
      await vista.abrir();
      await expectTheme(page, tema);
      await page.waitForTimeout(150); // deja asentar las transiciones de color
      await page.screenshot({ path: shot(vista.nombre, tema), fullPage: false });
    }
  }
});
