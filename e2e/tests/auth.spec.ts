/**
 * Puerta de sesión. Es el único archivo que corre SIN `storageState`: parte de
 * un navegador sin cookie para poder ver el redirect a /login, el bypass de
 * desarrollo y el cierre de sesión desde el menú del avatar.
 *
 * Entrar acá crea una sesión NUEVA para el mismo usuario dev; cerrarla destruye
 * solo esa, así que la cookie sembrada en `.auth/dev.json` sigue sirviendo para
 * el resto de la suite.
 */
import { expect, test } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });

const DEV_USER = { name: "Usuario Dev", email: "dev@sinapsis.local" };

test("sin sesión, la landing redirige a /login", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Sinapsis", level: 1 })).toBeVisible();
  await expect(page.getByRole("button", { name: "Entrar como usuario de desarrollo" })).toBeVisible();
});

test("el bypass de desarrollo entra y muestra la landing; el avatar cierra la sesión", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Entrar como usuario de desarrollo" }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { name: "Materias", level: 1 })).toBeVisible();

  const avatar = page.getByRole("button", { name: `Cuenta de ${DEV_USER.name}` });
  await avatar.click();
  const menu = page.getByRole("menu");
  await expect(menu).toContainText(DEV_USER.name);
  await expect(menu).toContainText(DEV_USER.email);

  await menu.getByRole("menuitem", { name: "Cerrar sesión" }).click();

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("button", { name: "Entrar como usuario de desarrollo" })).toBeVisible();

  // La sesión quedó cerrada de verdad: volver a la landing vuelve a rebotar.
  await page.goto("/");
  await expect(page).toHaveURL(/\/login$/);
});
