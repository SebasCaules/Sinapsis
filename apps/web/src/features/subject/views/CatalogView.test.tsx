/**
 * El catálogo («Todo el wiki»), en sus dos mitades:
 *
 *  1. La lógica pura: sobre qué texto busca, cómo se cuentan los chips contra
 *     los otros filtros y cómo se reparten las páginas por tipo.
 *  2. El componente: los subgrupos con su rótulo, el enlace del encabezado de
 *     grupo, los chips muertos, el estado vacío y el botón de limpiar.
 *
 * Los casos son los del baseline (`estudio/reader.js`), que es el criterio: la
 * consulta «poisson proceso» tiene que devolver todo lo que mencione ambos
 * términos, y un chip en cero no puede seguir invitando a pulsarlo.
 */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import { SubjectConfig, type PageMeta, type StudyState, type SubjectDetail } from "@sinapsis/contract";
import rawProbaConfig from "../../../../../../examples/proba/sinapsis.config.json";
import { qk } from "@/lib/api";
import { buildSubjectModel } from "../model";
import { CatalogView, chipCounts, haystack, matchesQuery, typeBlocks } from "./CatalogView";

const config = SubjectConfig.parse(rawProbaConfig);

function meta(
  slug: string,
  title: string,
  type: string,
  division: string,
  extra: Partial<PageMeta> = {},
): PageMeta {
  return {
    slug,
    title,
    type,
    folder: `${type}s`,
    division,
    summary: "",
    tags: [],
    sources: [],
    words: 120,
    ...extra,
  };
}

// ---------------------------------------------------------------------------
// 1 · lógica pura
// ---------------------------------------------------------------------------

describe("haystack", () => {
  it("junta título, tags y slug en minúsculas", () => {
    const page = meta("va-discreta", "Variable Aleatoria Discreta", "concepto", "3", {
      tags: ["discreta", "Poisson"],
    });
    expect(haystack(page)).toBe("variable aleatoria discreta discreta poisson va-discreta");
  });

  /* El resumen viaja con LaTeX crudo: incluirlo hacía que «frac» o «\» barrieran
     media materia por coincidencias dentro de las fórmulas. */
  it("no incluye el resumen", () => {
    const page = meta("asimetria", "Asimetría", "concepto", "1", {
      summary: "La asimetría $\\gamma = \\frac{m_3}{s^3}$ mide la cola larga.",
    });
    expect(haystack(page)).not.toContain("frac");
    expect(haystack(page)).not.toContain("\\");
  });
});

describe("matchesQuery", () => {
  const poisson = meta("distribucion-poisson", "Distribución de Poisson", "distribucion", "3", {
    tags: ["discreta", "conteo"],
  });
  const proceso = meta("proceso-de-poisson", "Proceso de Poisson", "concepto", "6");

  it("encuentra por el slug, que es como se cita una página", () => {
    expect(matchesQuery(poisson, "distribucion-poisson")).toBe(true);
  });

  it("encuentra por un tag", () => {
    expect(matchesQuery(poisson, "conteo")).toBe(true);
  });

  it("exige TODOS los términos, no la subcadena literal", () => {
    expect(matchesQuery(proceso, "poisson proceso")).toBe(true);
    expect(matchesQuery(poisson, "poisson proceso")).toBe(false);
  });

  it("sin consulta pasa todo", () => {
    expect(matchesQuery(poisson, "")).toBe(true);
  });
});

describe("chipCounts", () => {
  const pages = [
    meta("a", "A", "concepto", "1"),
    meta("b", "B", "concepto", "3"),
    meta("c", "C", "distribucion", "3"),
    meta("d", "D", "teorema", "1"),
    meta("e", "E de Poisson", "distribucion", "3"),
  ];
  const divisionOf = (p: PageMeta) => p.division;

  it("sin filtros cuenta todo", () => {
    const { byDivision, byType } = chipCounts(pages, divisionOf, { divisions: [], types: [], needle: "" });
    expect(byDivision.get("1")).toBe(2);
    expect(byDivision.get("3")).toBe(3);
    expect(byType.get("concepto")).toBe(2);
    expect(byType.get("distribucion")).toBe(2);
    expect(byType.get("teorema")).toBe(1);
  });

  /* La fila de tipos se cuenta con la división puesta: con U3 seleccionada,
     «Teoremas» tiene que decir 0 y no seguir prometiendo 1. */
  it("la fila de tipos se cuenta con la división aplicada", () => {
    const { byType } = chipCounts(pages, divisionOf, { divisions: ["3"], types: [], needle: "" });
    expect(byType.get("concepto")).toBe(1);
    expect(byType.get("distribucion")).toBe(2);
    expect(byType.get("teorema")).toBeUndefined();
  });

  /* Y la de divisiones con el tipo puesto, SIN contarse a sí misma: si la fila
     de divisiones se recortara por la división elegida, el resto quedaría en 0
     y no se podría cambiar de unidad sin desmarcar primero. */
  it("la fila de divisiones se cuenta con el tipo aplicado y no consigo misma", () => {
    const { byDivision } = chipCounts(pages, divisionOf, { divisions: ["3"], types: ["concepto"], needle: "" });
    expect(byDivision.get("1")).toBe(1);
    expect(byDivision.get("3")).toBe(1);
  });

  it("la búsqueda pesa sobre las dos filas", () => {
    const counts = chipCounts(pages, divisionOf, { divisions: [], types: [], needle: "poisson" });
    expect(counts.byDivision.get("3")).toBe(1);
    expect(counts.byDivision.get("1")).toBeUndefined();
    expect(counts.byType.get("distribucion")).toBe(1);
  });
});

describe("typeBlocks", () => {
  const order = ["concepto", "distribucion", "fuente"];
  const label = (key: string) => ({ concepto: "Conceptos", distribucion: "Distribuciones" })[key] ?? key;

  it("respeta el orden declarado y ordena por título en español", () => {
    const pages = [
      meta("geometrica", "Geométrica", "distribucion", "3"),
      meta("binomial-negativa", "Binomial Negativa (Pascal)", "distribucion", "3"),
      meta("binomial", "Binomial", "distribucion", "3"),
      meta("independencia", "Independencia", "concepto", "3"),
    ];
    const blocks = typeBlocks(pages, order, label);
    expect(blocks.map((b) => b.label)).toEqual(["Conceptos", "Distribuciones"]);
    expect(blocks[1]?.pages.map((p) => p.title)).toEqual([
      "Binomial",
      "Binomial Negativa (Pascal)",
      "Geométrica",
    ]);
  });

  it("un tipo no declarado no pierde sus páginas: va al final con su clave", () => {
    const blocks = typeBlocks([meta("x", "X", "rareza", "1")], order, label);
    expect(blocks).toHaveLength(1);
    expect(blocks[0]?.label).toBe("rareza");
  });
});

// ---------------------------------------------------------------------------
// 2 · el componente
// ---------------------------------------------------------------------------

const pages: PageMeta[] = [
  // U3 · dos conceptos, tres distribuciones y una fuente
  meta("variable-aleatoria-discreta", "Variable Aleatoria Discreta", "concepto", "3", { order: 1 }),
  meta("funcion-de-probabilidad", "Función de probabilidad", "concepto", "3", { order: 2 }),
  meta("geometrica", "Geométrica", "distribucion", "3", { order: 5 }),
  meta("binomial", "Binomial", "distribucion", "3", { order: 3 }),
  meta("binomial-negativa", "Binomial Negativa (Pascal)", "distribucion", "3", { order: 4 }),
  meta("teorica-03", "Teórica 03 — Discretas", "fuente", "3"),
  // U1 · un concepto y un teorema
  meta("media-y-mediana", "Media y mediana", "concepto", "1", {
    order: 1,
    summary: "La media $\\bar{x}$ y la mediana.",
    tags: ["posicion"],
  }),
  meta("chebyshev", "Desigualdad de Chebyshev", "teorema", "1", { order: 2 }),
  // páginas reservadas del wiki: no son catálogo
  meta("indice", "Índice — Wiki", "meta", "meta"),
  meta("log", "Registro de la wiki", "meta", "meta"),
];

const detail: SubjectDetail = {
  config,
  pages,
  studied: ["binomial"],
  placeholder: false,
  lastSyncAt: null,
};

const studyState: StudyState = {
  srs: [],
  bookmarks: ["geometrica"],
  notes: [],
  tasksDone: [],
  attempts: [],
  planDates: {},
};

/* El modelo se construye UNA vez: la vista lo memoriza por identidad. */
const model = buildSubjectModel(detail);

/**
 * El shell le pasa la materia a sus vistas por el contexto del Outlet: la
 * prueba monta el mismo par de rutas en vez de sustituir el hook, así que lo
 * que se ejercita es el camino real.
 */
function mount(search = "") {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity, refetchOnMount: false } },
  });
  client.setQueryData(qk.studyState("proba"), studyState);
  const ctx = { slug: "proba", model, openSearch: () => {}, runtime: { ready: false } as never };
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[`/m/proba/wiki${search}`]}>
        <Routes>
          <Route path="/m/proba" element={<Outlet context={ctx} />}>
            <Route path="wiki" element={<CatalogView />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

const cards = () => screen.getAllByRole("link").filter((a) => a.getAttribute("href")?.includes("/p/"));
const cardFor = (slug: string) =>
  cards().find((a) => a.getAttribute("href") === `/m/proba/p/${slug}`) as HTMLElement;

afterEach(cleanup);

describe("CatalogView", () => {
  it("no lista el índice ni el registro del wiki, y los números cierran", () => {
    mount();
    expect(screen.queryByText("Índice — Wiki")).toBeNull();
    expect(screen.queryByText("Registro de la wiki")).toBeNull();
    expect(cards()).toHaveLength(8);
    // 8 entradas · 2 unidades (7 de contenido · 1 fuente)
    expect(screen.getByText(/8 entradas · 2 unidades \(7 de contenido · 1 fuente\)/)).toBeTruthy();
  });

  it("dentro de cada división hay un subgrupo por tipo, con rótulo y contador", () => {
    mount();
    const u3 = screen.getByRole("heading", { name: /Variables Aleatorias Discretas/ }).closest("section");
    expect(u3).toBeTruthy();
    const grupos = within(u3 as HTMLElement).getAllByRole("heading", { level: 3 });
    expect(grupos.map((h) => h.textContent)).toEqual(["Conceptos 2", "Distribuciones 3", "Fuentes 1"]);
  });

  it("dentro del subgrupo las tarjetas van por título, no por el orden del API", () => {
    mount();
    const u3 = screen.getByRole("heading", { name: /Variables Aleatorias Discretas/ }).closest("section");
    const distribuciones = within(u3 as HTMLElement)
      .getByRole("heading", { level: 3, name: /Distribuciones/ })
      .parentElement as HTMLElement;
    const titulos = within(distribuciones)
      .getAllByRole("link")
      .map((a) => a.textContent ?? "");
    expect(titulos[0]).toContain("Binomial");
    expect(titulos[1]).toContain("Binomial Negativa (Pascal)");
    expect(titulos[2]).toContain("Geométrica");
  });

  it("el encabezado de grupo lleva a la vista de la división", () => {
    mount();
    const cabecera = screen.getByRole("heading", { name: /Variables Aleatorias Discretas/ });
    const enlace = cabecera.querySelector("a");
    expect(enlace?.getAttribute("href")).toBe("/m/proba/d/3");
    expect(enlace?.textContent).toContain("U3");
  });

  it("la tarjeta dice «leída» y «favorita» con palabras, no solo con un ícono", () => {
    mount();
    expect(cardFor("binomial").textContent).toContain("leída");
    expect(cardFor("geometrica").textContent).toContain("favorita");
    expect(cardFor("geometrica").textContent).not.toContain("leída");
  });

  it("los contadores de los chips se recalculan contra los otros filtros", () => {
    mount("?d=3");
    const tipos = screen.getByRole("group", { name: "Tipos de página" });
    const teoremas = within(tipos).getByRole("button", { name: /Teoremas/ });
    expect(teoremas.textContent).toBe("Teoremas0");
    expect(within(tipos).getByRole("button", { name: /Distribuciones/ }).textContent).toBe("Distribuciones3");
  });

  it("un chip que llevaría a cero se apaga y se deshabilita", () => {
    mount("?d=3");
    const tipos = screen.getByRole("group", { name: "Tipos de página" });
    const teoremas = within(tipos).getByRole("button", { name: /Teoremas/ });
    expect((teoremas as HTMLButtonElement).disabled).toBe(true);
    expect(teoremas.dataset["empty"]).toBe("true");
    // El chip activo NUNCA se deshabilita: hay que poder desmarcarlo.
    const unidades = screen.getByRole("group", { name: "Unidades" });
    const u3 = within(unidades).getByRole("button", { name: /U3/ }) as HTMLButtonElement;
    expect(u3.disabled).toBe(false);
    expect(u3.getAttribute("aria-pressed")).toBe("true");
  });

  it("los chips anuncian su estado con aria-pressed", () => {
    mount("?t=concepto");
    const tipos = screen.getByRole("group", { name: "Tipos de página" });
    expect(within(tipos).getByRole("button", { name: "Todos" }).getAttribute("aria-pressed")).toBe("false");
    expect(within(tipos).getByRole("button", { name: /Conceptos/ }).getAttribute("aria-pressed")).toBe("true");
  });

  it("la búsqueda usa varios términos y no mira el resumen", () => {
    mount("?q=media mediana");
    expect(cards()).toHaveLength(1);
    cleanup();

    /* «bar» solo aparece dentro del LaTeX del resumen de «Media y mediana»:
       buscar ahí devolvía ruido de fórmulas. */
    mount("?q=bar");
    expect(screen.getByText("Sin resultados.")).toBeTruthy();
  });

  it("sin resultados no se dice dos veces: no hay contador, hay estado vacío", () => {
    mount("?q=zzzz");
    expect(screen.queryByText(/^0 entradas$/)).toBeNull();
    expect(screen.getByText("Sin resultados.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Quitar los filtros" })).toBeTruthy();
  });

  it("«Quitar los filtros» devuelve el catálogo entero", () => {
    mount("?q=zzzz&d=3");
    fireEvent.click(screen.getByRole("button", { name: "Quitar los filtros" }));
    expect(cards()).toHaveLength(8);
  });

  it("el botón de limpiar solo existe con texto y devuelve el foco al campo", () => {
    mount();
    expect(screen.queryByRole("button", { name: "Limpiar la búsqueda" })).toBeNull();
    cleanup();

    mount("?q=binomial");
    const limpiar = screen.getByRole("button", { name: "Limpiar la búsqueda" });
    fireEvent.click(limpiar);
    const campo = screen.getByLabelText("Filtrar el catálogo") as HTMLInputElement;
    expect(campo.value).toBe("");
    expect(document.activeElement).toBe(campo);
  });
});
