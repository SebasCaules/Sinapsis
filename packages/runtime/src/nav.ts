/* ============================================================
   nav.ts — delegación de clics de navegación dentro del contenedor de una vista.

   El baseline de Proba ataba UN solo listener en `core.js` con
   `NAV_SEL = "[data-nav], a.wikilink[data-slug]"` y mandaba el destino a
   `App.go`. Sin eso, los enlaces del hub del taller y de la subnavegación de
   calculadoras navegan al hash crudo (`#/taller`) y recargan la página, porque
   son `<a href>` de verdad y no `<Link>` del router (pedido 5 de P4).

   Acá se agrega `[data-go="slug"]`, que es la forma corta de «llevame a esa
   página de la materia» sin escribir la ruta.

   Reglas del delegado:
     · solo el clic principal y sin modificadores: ⌘/Ctrl-clic, Shift, Alt y el
       botón del medio SIGUEN de largo, para que el navegador —y las pestañas
       del shell— hagan lo suyo;
     · `target="_blank"` y `download` también siguen de largo;
     · el destino se busca hacia arriba desde el nodo clicado pero SIN salir del
       contenedor: un `[data-nav]` de la plataforma que envuelva a la vista no
       es asunto del bundle;
     · quien traduce el destino es `App.go`, que ya entiende la gramática del
       baseline (`#/p/slug`, `#/unidad/3`, `#/vista/arg`) y las rutas del SPA.
   ============================================================ */

/** Selector del baseline, más `[data-go]`. */
export const NAV_SEL = "[data-nav], [data-go], a.wikilink[data-slug]";

/** El clic «normal»: botón principal, sin modificadores y sin dueño previo. */
export function isPlainClick(ev: MouseEvent): boolean {
  if (ev.defaultPrevented) return false;
  if (typeof ev.button === "number" && ev.button !== 0) return false;
  return !(ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey);
}

/**
 * El destino que pide el nodo clicado, en la gramática de `App.go`, o null si
 * ese clic no es de navegación.
 *
 * Precedencia: `data-nav` (ruta explícita, o el `href` si viene vacío, que es
 * la forma del baseline: `<a href="#/taller" data-nav>`), después `data-go`
 * (slug de página) y por último el wikilink, que conserva su `href` para no
 * perder el ancla.
 */
export function navTargetOf(start: Element, root?: Element | null): string | null {
  if (typeof start.closest !== "function") return null;
  const el = start.closest(NAV_SEL);
  if (!el) return null;
  if (root && !root.contains(el)) return null;

  const tag = el.tagName.toLowerCase();
  if (tag === "a") {
    if (el.getAttribute("target") === "_blank") return null;
    if (el.hasAttribute("download")) return null;
  }

  const nav = el.getAttribute("data-nav");
  if (nav !== null) {
    const explicit = nav.trim();
    if (explicit) return explicit;
    const href = (el.getAttribute("href") ?? "").trim();
    return href || null;
  }

  const go = (el.getAttribute("data-go") ?? "").trim();
  if (go) return "#/p/" + go;

  const slug = (el.getAttribute("data-slug") ?? "").trim();
  if (slug) {
    const href = (el.getAttribute("href") ?? "").trim();
    return href.startsWith("/") ? href : "#/p/" + slug;
  }
  return null;
}

/**
 * Ata la delegación a un contenedor. `go` es siempre `App.go`, que navega por
 * el router del host (sin recargar) y abre las URL externas en otra pestaña.
 * Devuelve el desatador.
 */
export function bindNav(container: HTMLElement, go: (target: string) => void): () => void {
  const onClick = (ev: Event): void => {
    const mouse = ev as MouseEvent;
    if (!isPlainClick(mouse)) return;
    const from = mouse.target as Element | null;
    if (!from) return;
    const target = navTargetOf(from, container);
    if (target === null) return;
    ev.preventDefault();
    go(target);
  };
  container.addEventListener("click", onClick);
  return () => container.removeEventListener("click", onClick);
}
