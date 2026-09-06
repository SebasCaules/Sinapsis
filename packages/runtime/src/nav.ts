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
 * Le pega el ancla al destino, salvo que la base ya traiga una.
 *
 * El `#` inicial de la gramática del baseline (`#/p/slug`) NO es un ancla: por
 * eso se busca el segundo `#`, no el primero.
 */
function withAnchor(base: string, anchor: string): string {
  if (!anchor) return base;
  if (base.indexOf("#", 1) >= 0) return base;
  return base + "#" + anchor;
}

/**
 * El destino que pide el nodo clicado, en la gramática de `App.go`.
 *
 * Devuelve:
 *   · la ruta, cuando el clic es de navegación;
 *   · `""` cuando el clic ES del delegado pero no lleva a ningún lado (un
 *     `[data-nav]` con `href=""`, que sin frenarlo recarga la página entera);
 *   · `null` cuando el clic no es asunto del delegado.
 *
 * Precedencia: `data-nav` (ruta explícita, o el `href` si viene vacío, que es
 * la forma del baseline: `<a href="#/taller" data-nav>`), después `data-go`
 * (slug de página) y por último el wikilink, que conserva su `href` y le suma
 * el `data-anchor` para no perder el encabezado.
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
  const href = (el.getAttribute("href") ?? "").trim();
  if (nav !== null) {
    const explicit = nav.trim();
    if (explicit) return explicit;
    if (href) return href;
    /* `data-nav` sin valor y sin `href`: no dice a dónde ir, así que sigue la
       cadena en vez de darse por resuelto. */
  }

  const go = (el.getAttribute("data-go") ?? "").trim();
  if (go) return "#/p/" + go;

  const slug = (el.getAttribute("data-slug") ?? "").trim();
  if (slug) {
    /* El ancla viaja aparte (`data-anchor`, nunca en el `href`: un segundo `#`
       rompería la ruta que arma el markdown). Acá se vuelve a unir. */
    const anchor = (el.getAttribute("data-anchor") ?? "").trim();
    return withAnchor(href.startsWith("/") ? href : "#/p/" + slug, anchor);
  }

  /* Nada resolvió. Un `[data-nav]` con `href` vacío recargaría la página: el
     clic se frena, pero no se navega a ningún lado. */
  if (nav !== null && el.hasAttribute("href")) return "";
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
    /* `""` es «frenar y quedarse»: `App.go("")` iría a la portada de la
       materia, que no es lo que pide un enlace sin destino. */
    if (target === "") return;
    go(target);
  };
  container.addEventListener("click", onClick);
  return () => container.removeEventListener("click", onClick);
}
