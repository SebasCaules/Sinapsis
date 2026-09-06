/**
 * Tarjeta de vista previa de página (N0-50): la que aparece al pasar por
 * cualquier enlace a una página del wiki dentro del shell de la materia.
 *
 * Cubre las cuatro superficies que pidió el contrato —wikilink de la prosa, foco
 * de teclado, segmento de la barra de unidad y enlace del índice lateral— y que
 * ningún enlace a página conserve el tooltip nativo (`title`), que dibujaría dos
 * tarjetas a la vez: ese último barrido recorre TODAS las vistas del shell
 * (inicio, catálogo, grafo, división, lector, kits, apuntes, favoritos y el
 * plan), no solo la hoja del lector. Corre igual con el vault de Proba y con el
 * fixture.
 */
import { expect, test, type Page } from "@playwright/test";
import { studyContent, waitForSubjectShell, withApi } from "../support/app";
import { API_ORIGIN, readSeed } from "../support/seed";

const seed = readSeed();
const subject = seed.subject;
const target = seed.readerPage;
const readerUrl = `/m/${subject.slug}/p/${target.slug}`;
const pageHref = `/m/${subject.slug}/p/`;

/** El nodo flotante: uno solo en todo el documento. */
const tip = (page: Page) => page.locator("#pageTip");
const sheet = (page: Page) => page.locator("article").first();
const panel = (page: Page) => page.locator('aside[aria-label^="Índice de"]');

async function openReader(page: Page): Promise<void> {
  await page.goto(readerUrl);
  await waitForSubjectShell(page);
  /* `.first()`: el fixture del modo demo conserva el `# H1` del cuerpo, así que
     el título de la hoja y el del markdown son dos encabezados con el mismo
     nombre (con el vault real lo recorta el compilador, N0-21). */
  await expect(page.getByRole("heading", { level: 1, name: target.title }).first()).toBeVisible();
}

/** Aleja el puntero: la tarjeta se cierra al salir del enlace. */
async function moveAway(page: Page): Promise<void> {
  await page.mouse.move(2, 2);
  await expect(tip(page)).toHaveCount(0);
}

/** `slug` de un href del lector, sin el ancla. */
function slugOf(href: string): string {
  return (href.slice(pageHref.length).split("#")[0] ?? "").split("?")[0] ?? "";
}

/**
 * Trozo de un resumen que se puede buscar como TEXTO: la matemática la compone
 * KaTeX y deja el `$…$` fuera del DOM, así que solo sirve lo que viene antes de
 * la primera fórmula.
 */
function plainStart(summary: string): string {
  const head = (summary.split("$")[0] ?? "").trim();
  return head.slice(0, 40).trim();
}

/** `slug` → resumen, tal como los tiene el modelo de la materia. */
async function summaries(page: Page): Promise<Map<string, string>> {
  const res = await page.request.get(`${API_ORIGIN}/api/subjects/${subject.slug}`);
  expect(res.ok()).toBe(true);
  const detail = (await res.json()) as { pages: Array<{ slug: string; title: string; summary: string }> };
  return new Map(detail.pages.map((p) => [p.slug, p.summary ?? ""]));
}

test("un wikilink de la prosa muestra el título y el resumen de su destino", async ({ page }) => {
  await openReader(page);
  const resumen = await summaries(page);

  const wikilinks = sheet(page).locator("a.wikilink");
  const hrefs = await wikilinks.evaluateAll((els) => els.map((el) => el.getAttribute("href") ?? ""));
  /* El primero cuyo destino tenga un resumen con prosa suficiente para buscarla. */
  const at = hrefs.findIndex((href) => {
    if (!href.startsWith(pageHref)) return false;
    return plainStart(resumen.get(slugOf(href)) ?? "").length >= 12;
  });
  expect(at, "la página del lector no tiene wikilinks a destinos con resumen").toBeGreaterThanOrEqual(0);

  const destino = slugOf(hrefs[at] ?? "");
  const link = wikilinks.nth(at);
  await link.hover();

  await expect(tip(page)).toBeVisible();
  await expect(tip(page)).toHaveAttribute("role", "tooltip");
  await expect(link).toHaveAttribute("aria-describedby", "pageTip");

  const titulo = await page.request
    .get(`${API_ORIGIN}/api/subjects/${subject.slug}/pages/${destino}`)
    .then((r) => r.json())
    .then((d: { page: { title: string } }) => d.page.title);
  await expect(tip(page)).toContainText(titulo);
  await expect(tip(page)).toContainText(plainStart(resumen.get(destino) ?? ""));
  /* La tarjeta del baseline hereda el peso 500 del cuerpo (`tips.css` no
     declara ninguno): con 400 el resumen y el pie salían más claros. */
  await expect(tip(page)).toHaveCSS("font-weight", "500");

  await moveAway(page);
});

test("con el foco del teclado también aparece, y Escape la cierra", async ({ page }) => {
  await openReader(page);

  const wikilink = sheet(page).locator(`a.wikilink[href^="${pageHref}"]`).first();
  await expect(wikilink).toBeVisible();

  /* Se llega con Tab de verdad: se enfoca el elemento anterior de la hoja y se
     avanza uno. Si el wikilink es el primer foco de la hoja, se lo enfoca
     directamente (el camino del evento es el mismo, `focusin`). */
  const focusables = sheet(page).locator('a[href], button, [tabindex]:not([tabindex="-1"])');
  const marks = await focusables.evaluateAll((els) =>
    els.map((el) => el.classList.contains("wikilink") && el.getAttribute("href")?.includes("/p/")),
  );
  const at = marks.indexOf(true);
  if (at > 0) {
    await focusables.nth(at - 1).focus();
    await page.keyboard.press("Tab");
  } else {
    await wikilink.focus();
  }
  await expect(wikilink).toBeFocused();
  await expect(tip(page)).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(tip(page)).toHaveCount(0);
  await expect(wikilink).not.toHaveAttribute("aria-describedby", "pageTip");
});

test("un segmento de la barra de unidad muestra la posición y el estado", async ({ page }) => {
  await openReader(page);

  /* Los segmentos son los únicos enlaces a página de la hoja con nombre
     accesible propio y sin texto (el título lo dice la tarjeta, no un `title`). */
  const segments = sheet(page).locator(`a[href^="${pageHref}"][aria-label]`);
  const total = await segments.count();
  test.skip(total < 2, "la división de la página del lector no tiene barra de unidad");

  const segment = segments.first();
  /* El nombre accesible del segmento abre con la posición («1 de 11. Título»,
     § lector-19), que es lo que el baseline anuncia: el título es lo que sigue. */
  const titulo = ((await segment.getAttribute("aria-label")) ?? "").replace(/^\d+ de \d+\.\s*/, "");
  await segment.hover();

  await expect(tip(page)).toBeVisible();
  await expect(tip(page)).toContainText(titulo);
  await expect(tip(page)).toContainText(new RegExp(`1 de ${total}`));
  await expect(tip(page)).toContainText(/actual|leída|sin leer/);

  await moveAway(page);
});

test("un enlace del índice lateral la muestra", async ({ page }) => {
  await openReader(page);

  const fila = panel(page).locator(`a[href^="${pageHref}"]`).first();
  const titulo = (await fila.innerText()).replace(/^\d+\s*/, "").trim();
  await fila.hover();

  await expect(tip(page)).toBeVisible();
  await expect(tip(page)).toContainText(titulo);

  await moveAway(page);
});

/**
 * Enlaces a una página del wiki que hay en la vista, con su `title` si lo
 * tienen. Se descarta el rail, que enlaza a las SECCIONES de la materia y trae
 * su propio tooltip.
 */
async function pageLinks(page: Page): Promise<Array<{ href: string; title: string }>> {
  return page.evaluate((prefix) => {
    const rail = 'nav[aria-label="Secciones de la materia"]';
    return Array.from(document.querySelectorAll("a[href]"))
      .filter((a) => (a.getAttribute("href") ?? "").startsWith(prefix) && !a.closest(rail))
      .map((a) => ({ href: a.getAttribute("href") ?? "", title: a.getAttribute("title") ?? "" }));
  }, pageHref);
}

test("ningún enlace a una página conserva el tooltip nativo, en ninguna vista del shell", async ({
  page,
}) => {
  /* El plan solo dibuja tareas si la materia sembrada lo declara. */
  const conPlan = await withApi(async (api) => (await studyContent(api, subject.slug)).plan !== null);

  const vistas: Array<{ nombre: string; url: string; listo?: () => Promise<unknown> }> = [
    { nombre: "inicio", url: `/m/${subject.slug}` },
    { nombre: "catálogo", url: `/m/${subject.slug}/wiki` },
    { nombre: "grafo", url: `/m/${subject.slug}/graph` },
    { nombre: "división", url: `/m/${subject.slug}/d/${target.division}` },
    { nombre: "lector", url: readerUrl },
    { nombre: "kits", url: `/m/${subject.slug}/kits` },
    { nombre: "apuntes", url: `/m/${subject.slug}/notes` },
    { nombre: "favoritos", url: `/m/${subject.slug}/favorites` },
  ];
  if (conPlan) {
    vistas.push({
      nombre: "plan",
      url: `/m/${subject.slug}/plan`,
      /* Las tareas del plan son las que traían `title="Abrir"`: se espera a que
         la primera fase esté dibujada para no barrer una vista vacía. */
      listo: () => page.getByTestId("plan-phase").first().waitFor(),
    });
  }

  let vistos = 0;
  for (const vista of vistas) {
    await page.goto(vista.url);
    await waitForSubjectShell(page);
    await page.locator("main").first().waitFor();
    if (vista.listo) await vista.listo();

    const enlaces = await pageLinks(page);
    vistos += enlaces.length;
    expect(
      enlaces.filter((a) => a.title !== ""),
      `enlaces a página con tooltip nativo en «${vista.nombre}»`,
    ).toEqual([]);
  }

  // El barrido tiene que haber mirado enlaces de verdad, no vistas vacías.
  expect(vistos, "el barrido no encontró ningún enlace a página").toBeGreaterThan(0);
});
