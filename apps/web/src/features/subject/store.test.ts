/**
 * Las pestañas (N0-29) son la única pieza del shell con reglas de estado propias
 * —cuál se activa al cerrar, qué pasa al pasarse de 20, cuándo la navegación
 * mueve la activa y cuándo salta a otra—, así que se prueban acá, sin React.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { LS_KEYS, routes } from "@sinapsis/contract";
import {
  MAX_TABS,
  resetTabsForTests,
  tabHref,
  useSubjectTabsStore,
  type SubjectTab,
  type TabInfo,
} from "./store";

const SLUG = "proba";
const home = routes.subject(SLUG);
const page = (p: string) => routes.page(SLUG, p);

const info = (path: string, title = path): TabInfo => ({ path, title, chip: null, color: null });

const store = () => useSubjectTabsStore.getState();
const tabs = () => store().tabsOf(SLUG);
const paths = () => tabs().list.map((t) => t.path);
const activePath = () => tabs().list.find((t) => t.id === tabs().active)?.path;

beforeEach(() => {
  localStorage.clear();
  resetTabsForTests();
});

describe("estado inicial", () => {
  it("arranca con una sola pestaña «Inicio»", () => {
    expect(tabs().list).toHaveLength(1);
    expect(tabs().list[0]?.path).toBe(home);
    expect(tabs().list[0]?.title).toBe("Inicio");
    expect(activePath()).toBe(home);
  });
});

describe("abrir", () => {
  it("⌘-clic abre una pestaña nueva SIN activarla (no se navega)", () => {
    const before = tabs().active;
    store().openTab(SLUG, info(page("p-a")));
    expect(paths()).toEqual([home, page("p-a")]);
    expect(tabs().active).toBe(before);
    expect(activePath()).toBe(home);
  });

  it("el botón «+» abre una pestaña «Inicio» y la activa", () => {
    const id = store().newTab(SLUG);
    expect(tabs().list).toHaveLength(2);
    expect(tabs().active).toBe(id);
    expect(activePath()).toBe(home);
  });

  it("al pasarse de 20 cierra la primera que no esté activa", () => {
    for (let i = 0; i < MAX_TABS - 1; i += 1) store().openTab(SLUG, info(page(`p-${i}`)));
    expect(tabs().list).toHaveLength(MAX_TABS);
    /* La activa sigue siendo la primera («Inicio»): la víctima es la segunda. */
    const victim = tabs().list[1]?.path;
    store().openTab(SLUG, info(page("p-nueva")));
    expect(tabs().list).toHaveLength(MAX_TABS);
    expect(paths()).not.toContain(victim);
    expect(paths()).toContain(page("p-nueva"));
    expect(activePath()).toBe(home);
  });
});

describe("activar y cerrar", () => {
  it("activar guarda el scroll con el que se deja la anterior", () => {
    const id = store().openTab(SLUG, info(page("p-a")));
    store().activateTab(SLUG, id, 420);
    expect(tabs().list[0]?.scrollY).toBe(420);
    expect(tabs().active).toBe(id);
  });

  it("cerrar la activa pasa a la vecina de la derecha y devuelve su ruta", () => {
    const a = store().openTab(SLUG, info(page("p-a")));
    const b = store().openTab(SLUG, info(page("p-b")));
    store().activateTab(SLUG, a);
    const next = store().closeTab(SLUG, a);
    expect(next).toBe(page("p-b"));
    expect(tabs().active).toBe(b);
    expect(paths()).toEqual([home, page("p-b")]);
  });

  it("cerrar una que no está activa no navega", () => {
    const a = store().openTab(SLUG, info(page("p-a")));
    expect(store().closeTab(SLUG, a)).toBeNull();
    expect(activePath()).toBe(home);
  });

  it("cerrar la última repone «Inicio»", () => {
    const only = tabs().list[0]?.id as string;
    const next = store().closeTab(SLUG, only);
    expect(next).toBe(home);
    expect(tabs().list).toHaveLength(1);
    expect(tabs().list[0]?.title).toBe("Inicio");
  });
});

describe("reordenar", () => {
  it("mueve la pestaña de una posición a otra", () => {
    store().openTab(SLUG, info(page("p-a")));
    store().openTab(SLUG, info(page("p-b")));
    store().moveTab(SLUG, 2, 0);
    expect(paths()).toEqual([page("p-b"), home, page("p-a")]);
  });

  it("ignora índices fuera de rango", () => {
    store().moveTab(SLUG, 0, 9);
    expect(paths()).toEqual([home]);
  });
});

describe("navegación (syncActive)", () => {
  it("mover la activa a otra ruta actualiza su path y su rótulo", () => {
    store().syncActive(SLUG, { path: page("p-a"), title: "Página A", chip: "U1", color: "var(--u1)" });
    expect(paths()).toEqual([page("p-a")]);
    expect(tabs().list[0]?.title).toBe("Página A");
    expect(tabs().list[0]?.chip).toBe("U1");
  });

  it("si el destino ya está abierto en otra pestaña, la activa (y no duplica)", () => {
    const other = store().openTab(SLUG, info(page("p-a")));
    store().syncActive(SLUG, info(page("p-a")), 120);
    expect(tabs().active).toBe(other);
    expect(tabs().list).toHaveLength(2);
    /* Y guarda el scroll de la que se deja. */
    expect(tabs().list[0]?.scrollY).toBe(120);
  });

  it("estando ya en esa ruta no salta a otra pestaña con la misma (abrir «+» dos veces)", () => {
    const fresh = store().newTab(SLUG);
    store().syncActive(SLUG, info(home, "Inicio"));
    expect(tabs().active).toBe(fresh);
    expect(tabs().list).toHaveLength(2);
  });

  it("cambiar de ruta reinicia el scroll de la pestaña", () => {
    const only = tabs().list[0]?.id as string;
    store().setScroll(SLUG, only, 300);
    store().syncActive(SLUG, info(page("p-a")));
    expect(tabs().list[0]?.scrollY).toBe(0);
  });
});

describe("el ancla viaja aparte del pathname (bug 4)", () => {
  const conAncla = `${page("p-a")}#estandarizacion`;

  it("⌘-clic sobre un enlace con ancla guarda el ancla fuera de `path`", () => {
    store().openTab(SLUG, { path: page("p-a"), hash: "#estandarizacion", title: "Página A", chip: null, color: null });
    const abierta = tabs().list[1];
    expect(abierta?.path).toBe(page("p-a"));
    expect(abierta?.hash).toBe("#estandarizacion");
    expect(tabHref(abierta as SubjectTab)).toBe(conAncla);
  });

  it("una dirección con ancla en `path` se normaliza igual", () => {
    store().openTab(SLUG, info(conAncla, "Página A"));
    expect(tabs().list[1]?.path).toBe(page("p-a"));
    expect(tabs().list[1]?.hash).toBe("#estandarizacion");
  });

  it("navegar a la MISMA página sin ancla no abre ni salta de pestaña", () => {
    const conHash = store().openTab(SLUG, { path: page("p-a"), hash: "#uno", title: "A", chip: null, color: null }, true);
    /* Lo que hace el shell al llegar: pasa `location.pathname`, sin ancla. */
    store().syncActive(SLUG, { path: page("p-a"), hash: "", title: "A", chip: null, color: null });
    expect(tabs().active).toBe(conHash);
    expect(tabs().list).toHaveLength(2);
    expect(paths()).toEqual([home, page("p-a")]);
  });

  it("el destino ya abierto se reconoce aunque la pestaña tenga ancla", () => {
    const other = store().openTab(SLUG, { path: page("p-a"), hash: "#dos", title: "A", chip: null, color: null });
    store().syncActive(SLUG, info(page("p-a")));
    expect(tabs().active).toBe(other);
    expect(tabs().list).toHaveLength(2);
  });

  it("cerrar devuelve la dirección con su ancla", () => {
    const a = store().openTab(SLUG, { path: page("p-a"), hash: "#tres", title: "A", chip: null, color: null });
    const b = store().openTab(SLUG, info(page("p-b")));
    store().activateTab(SLUG, b);
    expect(store().closeTab(SLUG, b)).toBe(`${page("p-a")}#tres`);
    expect(tabs().active).toBe(a);
  });

  it("lo persistido por una versión anterior (ancla dentro de `path`) se sanea al releerlo", () => {
    localStorage.setItem(
      LS_KEYS.tabs(SLUG),
      JSON.stringify({ list: [{ id: "viejo", path: conAncla, title: "A", chip: null, color: null, scrollY: 0 }], active: "viejo" }),
    );
    resetTabsForTests();
    expect(tabs().list[0]?.path).toBe(page("p-a"));
    expect(tabs().list[0]?.hash).toBe("#estandarizacion");
  });
});

describe("persistencia", () => {
  it("guarda en `LS_KEYS.tabs(slug)` y se relee al arrancar", () => {
    store().openTab(SLUG, info(page("p-a")));
    store().openTab(SLUG, info(page("p-b")));
    expect(localStorage.getItem(LS_KEYS.tabs(SLUG))).toContain("p-b");

    /* Otra sesión: el store se vacía, pero localStorage manda. */
    resetTabsForTests();
    expect(paths()).toEqual([home, page("p-a"), page("p-b")]);
  });

  it("descarta lo persistido si no tiene forma de pestañas", () => {
    localStorage.setItem(LS_KEYS.tabs(SLUG), JSON.stringify({ list: "rota" }));
    resetTabsForTests();
    expect(tabs().list).toHaveLength(1);
    expect(tabs().list[0]?.path).toBe(home);
  });

  it("repara una pestaña activa que ya no está en la lista", () => {
    localStorage.setItem(
      LS_KEYS.tabs(SLUG),
      JSON.stringify({ list: [{ id: "x", path: home, title: "Inicio", scrollY: 0 }], active: "fantasma" }),
    );
    resetTabsForTests();
    expect(tabs().active).toBe("x");
  });
});
