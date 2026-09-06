/**
 * S-16 — lo que el runtime le agrega al `App` para que el bundle de Proba corra
 * completo: `$`/`$$` acotados a la vista, la delegación de clics de navegación
 * y los dos ganchos de la paleta ⌘K.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { createCompatApp, PALETTE_EVENT } from "../src/compat.js";
import { isPlainClick, navTargetOf } from "../src/nav.js";
import { installRuntime, uninstallRuntime } from "../src/index.js";
import { makeContext } from "./fixtures.js";

afterEach(() => {
  uninstallRuntime();
  document.body.replaceChildren();
  document.documentElement.removeAttribute("data-palette-open");
  vi.restoreAllMocks();
});

/** Un contenedor montado, como el que arma `ToolHost`. */
function mount(html: string): HTMLElement {
  const host = document.createElement("div");
  host.className = "sinapsis-tool";
  host.innerHTML = html;
  document.body.appendChild(host);
  return host;
}

function click(el: Element, init: MouseEventInit = {}): MouseEvent {
  const ev = new MouseEvent("click", { bubbles: true, cancelable: true, button: 0, ...init });
  el.dispatchEvent(ev);
  return ev;
}

describe("navTargetOf — qué destino pide cada marcado", () => {
  it("`data-nav` con valor manda su valor", () => {
    const host = mount('<a data-nav="/m/proba/wiki" href="#/otra">ir</a>');
    expect(navTargetOf(host.querySelector("a")!)).toBe("/m/proba/wiki");
  });
  it("`data-nav` vacío (la forma del baseline) usa el `href`", () => {
    const host = mount('<a class="back-bar" href="#/taller" data-nav>volver</a>');
    expect(navTargetOf(host.querySelector("a")!)).toBe("#/taller");
  });
  it("`data-go` es el slug de una página de la materia", () => {
    const host = mount('<button data-go="distribucion-normal">ver</button>');
    expect(navTargetOf(host.querySelector("button")!)).toBe("#/p/distribucion-normal");
  });
  it("el wikilink conserva su `href` (y con él, el ancla)", () => {
    const host = mount('<a class="wikilink" href="/m/proba/p/normal#tabla" data-slug="normal">normal</a>');
    expect(navTargetOf(host.querySelector("a")!)).toBe("/m/proba/p/normal#tabla");
  });
  it("el wikilink con `data-anchor` lleva TAMBIÉN al encabezado (AC-10)", () => {
    /* El markdown deja el ancla aparte del `href` (un segundo `#` rompería la
       ruta); el delegado la vuelve a unir o el enlace cae al tope de la página. */
    const host = mount(
      '<a class="wikilink" href="/m/proba/p/normal" data-slug="normal" data-anchor="tabla-z">normal</a>',
    );
    expect(navTargetOf(host.querySelector("a")!)).toBe("/m/proba/p/normal#tabla-z");
  });
  it("un ancla ya presente en la base no se duplica", () => {
    const host = mount(
      '<a class="wikilink" href="/m/proba/p/normal#otra" data-slug="normal" data-anchor="tabla-z">normal</a>',
    );
    expect(navTargetOf(host.querySelector("a")!)).toBe("/m/proba/p/normal#otra");
  });
  it("sin `href` propio, el ancla se le pega a la forma corta del baseline", () => {
    /* El `#` inicial de `#/p/slug` no es un ancla: el ancla es la que sigue. */
    const host = mount('<a class="wikilink" data-slug="normal" data-anchor="tabla-z">normal</a>');
    expect(navTargetOf(host.querySelector("a")!)).toBe("#/p/normal#tabla-z");
  });

  it("`data-nav` vacío y sin `href` sigue la cadena en vez de rendirse (AC-11)", () => {
    const go = mount('<button data-nav data-go="normal">ver</button>');
    expect(navTargetOf(go.querySelector("button")!)).toBe("#/p/normal");

    const wiki = mount('<a class="wikilink" data-nav href="/m/proba/p/normal" data-slug="normal">normal</a>');
    /* Con `href` gana el `href` (la forma del baseline), pero el nodo se
       resuelve igual: lo que no puede pasar es que devuelva `null`. */
    expect(navTargetOf(wiki.querySelector("a")!)).toBe("/m/proba/p/normal");

    const soloSlug = mount('<span data-nav class="wikilink" data-slug="normal">normal</span>');
    expect(navTargetOf(soloSlug.querySelector("span")!)).toBe("#/p/normal");
  });

  it("`data-nav` con `href=\"\"` se frena, no recarga (AC-11)", () => {
    const host = mount('<a href="" data-nav>sin destino</a>');
    /* `""` = «es del delegado, pero no lleva a ningún lado». */
    expect(navTargetOf(host.querySelector("a")!)).toBe("");
  });

  it("se busca hacia arriba desde el nodo clicado, pero sin salir del contenedor", () => {
    const host = mount('<a data-nav="#/calc"><span>texto</span></a>');
    const span = host.querySelector("span")!;
    expect(navTargetOf(span, host)).toBe("#/calc");
    /* El mismo `span`, acotado a un contenedor que no contiene el enlace. */
    expect(navTargetOf(span, host.querySelector("span"))).toBeNull();
  });
  it("`target=\"_blank\"` y `download` siguen de largo", () => {
    const host = mount(
      '<a id="a" data-nav="#/calc" target="_blank">nueva</a><a id="b" data-nav="#/calc" download>bajar</a>',
    );
    expect(navTargetOf(host.querySelector("#a")!)).toBeNull();
    expect(navTargetOf(host.querySelector("#b")!)).toBeNull();
  });
  it("un nodo cualquiera no es navegación", () => {
    const host = mount("<p>sin enlaces</p>");
    expect(navTargetOf(host.querySelector("p")!)).toBeNull();
  });
});

describe("isPlainClick — qué clic atiende el delegado", () => {
  it("el principal sin modificadores, sí", () => {
    expect(isPlainClick(new MouseEvent("click", { button: 0 }))).toBe(true);
  });
  it("⌘/Ctrl-clic, Shift, Alt y el botón del medio, no", () => {
    expect(isPlainClick(new MouseEvent("click", { button: 0, metaKey: true }))).toBe(false);
    expect(isPlainClick(new MouseEvent("click", { button: 0, ctrlKey: true }))).toBe(false);
    expect(isPlainClick(new MouseEvent("click", { button: 0, shiftKey: true }))).toBe(false);
    expect(isPlainClick(new MouseEvent("click", { button: 0, altKey: true }))).toBe(false);
    expect(isPlainClick(new MouseEvent("click", { button: 1 }))).toBe(false);
  });
});

describe("runtime.bindView — delegación dentro del contenedor de la vista", () => {
  it("un clic en `[data-nav]` navega por el router y no recarga", () => {
    const ctx = makeContext();
    const rt = installRuntime(ctx);
    const host = mount('<a class="back-bar" href="#/taller" data-nav>volver</a>');
    const unbind = rt.bindView(host);

    const ev = click(host.querySelector("a")!);
    expect(ev.defaultPrevented).toBe(true);
    expect(ctx.navigated.map((n) => n.path)).toEqual(["/m/proba/t/taller"]);
    unbind();
  });

  it("`data-go` lleva a la página de la materia", () => {
    const ctx = makeContext();
    const rt = installRuntime(ctx);
    const host = mount('<button data-go="normal">ver</button>');
    const unbind = rt.bindView(host);

    click(host.querySelector("button")!);
    expect(ctx.navigated[0]?.path).toBe("/m/proba/p/normal");
    unbind();
  });

  it("un wikilink con ancla navega a la página Y al encabezado (AC-10)", () => {
    const ctx = makeContext();
    const rt = installRuntime(ctx);
    const host = mount(
      '<a class="wikilink" href="/m/proba/p/normal" data-slug="normal" data-anchor="tabla-z">tabla</a>',
    );
    const unbind = rt.bindView(host);

    click(host.querySelector("a")!);
    expect(ctx.navigated.map((n) => n.path)).toEqual(["/m/proba/p/normal#tabla-z"]);
    unbind();
  });

  it("un `[data-nav]` con `href=\"\"` se frena y no recarga ni navega (AC-11)", () => {
    const ctx = makeContext();
    const rt = installRuntime(ctx);
    const host = mount('<a href="" data-nav>sin destino</a>');
    const unbind = rt.bindView(host);

    const ev = click(host.querySelector("a")!);
    /* Frenado: sin esto, `href=""` recarga la URL actual y se pierde la vista. */
    expect(ev.defaultPrevented).toBe(true);
    expect(ctx.navigated).toHaveLength(0);
    unbind();
  });

  it("`data-nav` vacío con `data-go` navega igual (AC-11)", () => {
    const ctx = makeContext();
    const rt = installRuntime(ctx);
    const host = mount('<button data-nav data-go="normal">ver</button>');
    const unbind = rt.bindView(host);

    click(host.querySelector("button")!);
    expect(ctx.navigated.map((n) => n.path)).toEqual(["/m/proba/p/normal"]);
    unbind();
  });

  it("⌘-clic pasa: lo atiende el shell (pestaña nueva), no el bundle", () => {
    const ctx = makeContext();
    const rt = installRuntime(ctx);
    /* Sin `href`: lo que se comprueba es que el delegado no interviene, y así
       jsdom no intenta una navegación de verdad al no prevenirse el defecto. */
    const host = mount('<a data-nav="/m/proba/p/normal">normal</a>');
    const unbind = rt.bindView(host);

    const ev = click(host.querySelector("a")!, { metaKey: true });
    expect(ev.defaultPrevented).toBe(false);
    expect(ctx.navigated).toHaveLength(0);
    unbind();
  });

  it("el botón del medio pasa", () => {
    const ctx = makeContext();
    const rt = installRuntime(ctx);
    const host = mount('<a data-nav="/m/proba/p/normal">normal</a>');
    const unbind = rt.bindView(host);

    click(host.querySelector("a")!, { button: 1 });
    expect(ctx.navigated).toHaveLength(0);
    unbind();
  });

  it("desatar quita el listener: ir y volver no duplica navegaciones", () => {
    const ctx = makeContext();
    const rt = installRuntime(ctx);
    const host = mount('<a href="#/calc" data-nav>calc</a>');

    const first = rt.bindView(host);
    first();
    click(host.querySelector("a")!);
    expect(ctx.navigated).toHaveLength(0);

    const second = rt.bindView(host);
    click(host.querySelector("a")!);
    expect(ctx.navigated).toHaveLength(1);
    second();
  });

  it("soltar la vista borra el redibujo que había registrado", () => {
    const rt = installRuntime(makeContext());
    const host = mount("<p>vista</p>");
    const unbind = rt.bindView(host);

    let redrawn = 0;
    rt.App.setRedraw(() => {
      redrawn += 1;
    });
    rt.setTheme("claustro");
    expect(redrawn).toBe(1);

    /* Desmontada la vista, su redibujo no puede seguir corriendo sobre un
       contenedor que ya no está en el documento. */
    unbind();
    host.remove();
    rt.setTheme("laurel");
    expect(redrawn).toBe(1);
  });

  it("una URL externa se abre en otra pestaña en vez de navegar", () => {
    const ctx = makeContext();
    const rt = installRuntime(ctx);
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    const host = mount('<a href="https://es.wikipedia.org/wiki/Normal" data-nav>wiki</a>');
    const unbind = rt.bindView(host);

    click(host.querySelector("a")!);
    expect(open).toHaveBeenCalledWith("https://es.wikipedia.org/wiki/Normal", "_blank", "noopener");
    expect(ctx.navigated).toHaveLength(0);
    unbind();
  });
});

describe("App.$ / App.$$ — acotados a la vista montada", () => {
  it("sin vista montada, buscan en el documento", () => {
    const { app } = createCompatApp(makeContext());
    mount('<p class="x">fuera</p>');
    expect(app.$(".x")?.textContent).toBe("fuera");
    expect(app.$$(".x")).toHaveLength(1);
  });

  it("con la vista atada, no ven lo que está fuera del contenedor", () => {
    const rt = installRuntime(makeContext());
    mount('<p class="x">de otra vista</p>');
    const host = mount('<p class="x">de esta vista</p><p class="x">y otra</p>');
    const unbind = rt.bindView(host);

    expect(rt.App.$(".x")?.textContent).toBe("de esta vista");
    expect(rt.App.$$(".x")).toHaveLength(2);

    unbind();
    /* Desatada, vuelve a ver todo el documento (las tres). */
    expect(rt.App.$$(".x")).toHaveLength(3);
  });

  it("una raíz explícita gana siempre", () => {
    const rt = installRuntime(makeContext());
    const other = mount('<p class="x">explícita</p>');
    const host = mount('<p class="x">de la vista</p>');
    const unbind = rt.bindView(host);
    expect(rt.App.$(".x", other)?.textContent).toBe("explícita");
    unbind();
  });

  it("un contenedor ya desmontado no secuestra la búsqueda", () => {
    const rt = installRuntime(makeContext());
    const host = mount('<p class="x">vieja</p>');
    rt.bindView(host);
    host.remove();
    const live = mount('<p class="x">viva</p>');
    /* Sin desatar (el caso feo): al no estar en el documento, se cae a `document`. */
    expect(rt.App.$(".x")?.textContent).toBe("viva");
    expect(live.isConnected).toBe(true);
  });

  it("`$$` devuelve un array de verdad, como en el baseline", () => {
    const rt = installRuntime(makeContext());
    const host = mount('<b class="y"></b><b class="y"></b>');
    const unbind = rt.bindView(host);
    const found = rt.App.$$(".y");
    expect(Array.isArray(found)).toBe(true);
    expect(found.map((el) => el.tagName)).toEqual(["B", "B"]);
    unbind();
  });
});

describe("App.paletteOpen / App.openPalette", () => {
  it("`paletteOpen()` PREGUNTA si la paleta está abierta (así la usa lookup.js)", () => {
    const rt = installRuntime(makeContext());
    expect(rt.App.paletteOpen()).toBe(false);
    document.documentElement.setAttribute("data-palette-open", "");
    expect(rt.App.paletteOpen()).toBe(true);
  });

  it("el host puede responder con su propio estado", () => {
    let open = false;
    const rt = installRuntime(makeContext({ paletteOpen: () => open }));
    expect(rt.App.paletteOpen()).toBe(false);
    open = true;
    expect(rt.App.paletteOpen()).toBe(true);
  });

  it("`openPalette()` usa el gancho del host si lo hay", () => {
    const opened: number[] = [];
    const rt = installRuntime(makeContext({ openPalette: () => opened.push(1) }));
    rt.App.openPalette();
    expect(opened).toHaveLength(1);
  });

  it("sin gancho, despacha el evento que el shell escucha", () => {
    const rt = installRuntime(makeContext());
    const seen: Event[] = [];
    const onPalette = (ev: Event) => seen.push(ev);
    window.addEventListener(PALETTE_EVENT, onPalette);
    rt.App.openPalette();
    window.removeEventListener(PALETTE_EVENT, onPalette);
    expect(seen).toHaveLength(1);
    expect(PALETTE_EVENT).toBe("sinapsis:palette");
  });
});
