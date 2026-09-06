/**
 * Las asas de la hoja, montadas: qué anuncia cada una, qué hace el teclado y qué
 * queda guardado.
 *
 * El arrastre con el puntero no se prueba acá —jsdom no tiene captura de puntero
 * ni geometría— sino en dos partes: la cuenta, en `sheetWidth.test.ts`
 * (`resizeSheet`), y el gesto de verdad, en la verificación con el navegador.
 * Lo que sí tiene que quedar clavado es el teclado, que es el único camino de
 * quien no puede arrastrar.
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import {
  SubjectConfig,
  type PageDetail,
  type PageMeta,
  type StudyState,
  type SubjectDetail,
} from "@sinapsis/contract";
import rawProbaConfig from "../../../../../../subjects/proba/sinapsis.config.json";
import { qk } from "@/lib/api";
import { buildSubjectModel } from "../model";
import { ReaderView } from "./ReaderView";
import { SHEET_DEFAULT, SHEET_MAX, SHEET_MIN, SHEET_STEP, SHEET_WIDTH_KEY } from "./sheetWidth";

const config = SubjectConfig.parse(rawProbaConfig);
const SLUG = "variable-aleatoria-continua";

const meta: PageMeta = {
  slug: SLUG,
  title: "Variable Aleatoria Continua",
  type: "concepto",
  folder: "conceptos",
  division: "4",
  order: 1,
  summary: "",
  tags: [],
  sources: [],
  words: 220,
};

const detail: SubjectDetail = {
  config,
  pages: [meta],
  studied: [],
  placeholder: false,
  lastSyncAt: null,
};

/* Sin encabezados a propósito: el índice de la página monta un
   `IntersectionObserver`, que jsdom no tiene, y no es lo que se prueba acá. */
const pageDetail: PageDetail = {
  page: { ...meta, links: [], headings: [], body: "Un párrafo cualquiera." },
  backlinks: [],
  studied: false,
};

const studyState: StudyState = {
  srs: [],
  bookmarks: [],
  notes: [],
  tasksDone: [],
  attempts: [],
  planDates: {},
};

const model = buildSubjectModel(detail);

/** El mismo par de rutas que arma el shell: la vista recibe la materia por el Outlet. */
function mount() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity, refetchOnMount: false } },
  });
  client.setQueryData(qk.page("proba", SLUG), pageDetail);
  client.setQueryData(qk.studyState("proba"), studyState);
  const ctx = { slug: "proba", model, openSearch: () => {}, runtime: { ready: false } as never };
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[`/m/proba/p/${SLUG}`]}>
        <Routes>
          <Route path="/m/proba" element={<Outlet context={ctx} />}>
            <Route path="p/:page" element={<ReaderView />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

const handles = () => screen.getAllByRole("separator", { name: "Ancho de la hoja" });
const handle = (side: "left" | "right") =>
  handles().find((el) => el.dataset["side"] === side) as HTMLElement;
/** El nodo que lleva la variable: es el que envuelve toda la vista. */
const layout = (container: HTMLElement) => container.firstElementChild as HTMLElement;
const width = () => Number(handle("right").getAttribute("aria-valuenow"));

/* jsdom no trae `matchMedia` y el lector la consulta para saber si la columna
   lateral cabe al lado de la hoja. Se responde que sí (pantalla ancha), que es
   el caso donde las asas tienen todo el espacio para moverse. */
beforeEach(() => {
  localStorage.clear();
  if (typeof window.matchMedia !== "function") {
    window.matchMedia = ((media: string) => ({
      media,
      matches: true,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    })) as typeof window.matchMedia;
  }
});
afterEach(cleanup);

describe("asas de ancho de la hoja", () => {
  it("hay una a cada lado, y las dos dicen su valor", () => {
    const { container } = mount();
    expect(handles()).toHaveLength(2);
    for (const el of handles()) {
      expect(el.getAttribute("aria-orientation")).toBe("vertical");
      expect(el.getAttribute("aria-valuemin")).toBe(String(SHEET_MIN));
      expect(el.getAttribute("aria-valuemax")).toBe(String(SHEET_MAX));
      expect(el.getAttribute("aria-valuenow")).toBe(String(SHEET_DEFAULT));
      /* El lector de pantalla tiene que oír la UNIDAD, no un número pelado. */
      expect(el.getAttribute("aria-valuetext")).toBe(`${SHEET_DEFAULT} píxeles`);
      expect(el.tabIndex).toBe(0);
      expect(el.getAttribute("title")).toContain("doble clic");
    }
    expect(layout(container).style.getPropertyValue("--sheet-width")).toBe("840px");
  });

  it("→ en el asa derecha agranda un paso, y queda guardado", () => {
    const { container } = mount();
    fireEvent.keyDown(handle("right"), { key: "ArrowRight" });
    expect(width()).toBe(SHEET_DEFAULT + SHEET_STEP);
    expect(layout(container).style.getPropertyValue("--sheet-width")).toBe("864px");
    expect(localStorage.getItem(SHEET_WIDTH_KEY)).toBe("864");
  });

  it("← en el asa derecha achica un paso", () => {
    mount();
    fireEvent.keyDown(handle("right"), { key: "ArrowLeft" });
    expect(width()).toBe(SHEET_DEFAULT - SHEET_STEP);
  });

  it("con Shift el paso es cuatro veces mayor", () => {
    mount();
    fireEvent.keyDown(handle("right"), { key: "ArrowRight", shiftKey: true });
    expect(width()).toBe(SHEET_DEFAULT + SHEET_STEP * 4);
    expect(localStorage.getItem(SHEET_WIDTH_KEY)).toBe("936");
  });

  /* El asa izquierda se arrastra hacia AFUERA para agrandar; las flechas hacen
     lo mismo, o quien la use con el teclado la vería moverse al revés. */
  it("en el asa izquierda las flechas van al revés", () => {
    mount();
    fireEvent.keyDown(handle("left"), { key: "ArrowLeft" });
    expect(width()).toBe(SHEET_DEFAULT + SHEET_STEP);
    fireEvent.keyDown(handle("left"), { key: "ArrowRight" });
    expect(width()).toBe(SHEET_DEFAULT);
  });

  it("Inicio y Fin van a los extremos", () => {
    mount();
    fireEvent.keyDown(handle("right"), { key: "Home" });
    expect(width()).toBe(SHEET_MIN);
    expect(localStorage.getItem(SHEET_WIDTH_KEY)).toBe(String(SHEET_MIN));
    fireEvent.keyDown(handle("right"), { key: "End" });
    expect(width()).toBe(SHEET_MAX);
  });

  it("las flechas no pasan de los límites", () => {
    mount();
    fireEvent.keyDown(handle("right"), { key: "End" });
    fireEvent.keyDown(handle("right"), { key: "ArrowRight" });
    expect(width()).toBe(SHEET_MAX);
    fireEvent.keyDown(handle("right"), { key: "Home" });
    fireEvent.keyDown(handle("right"), { key: "ArrowLeft", shiftKey: true });
    expect(width()).toBe(SHEET_MIN);
  });

  it("Entrar, Espacio y el doble clic devuelven la hoja a los 840", () => {
    mount();
    fireEvent.keyDown(handle("right"), { key: "End" });
    fireEvent.keyDown(handle("right"), { key: "Enter" });
    expect(width()).toBe(SHEET_DEFAULT);

    fireEvent.keyDown(handle("right"), { key: "End" });
    fireEvent.keyDown(handle("right"), { key: " " });
    expect(width()).toBe(SHEET_DEFAULT);

    fireEvent.keyDown(handle("right"), { key: "End" });
    fireEvent.doubleClick(handle("left"));
    expect(width()).toBe(SHEET_DEFAULT);
    expect(localStorage.getItem(SHEET_WIDTH_KEY)).toBe(String(SHEET_DEFAULT));
  });

  it("una tecla que no es del asa no cambia nada", () => {
    mount();
    fireEvent.keyDown(handle("right"), { key: "a" });
    expect(width()).toBe(SHEET_DEFAULT);
    expect(localStorage.getItem(SHEET_WIDTH_KEY)).toBeNull();
  });

  it("la hoja abre con el ancho de la vez pasada", () => {
    localStorage.setItem(SHEET_WIDTH_KEY, "1024");
    const { container } = mount();
    expect(width()).toBe(1024);
    expect(layout(container).style.getPropertyValue("--sheet-width")).toBe("1024px");
  });

  /* La preferencia es de LECTURA y global, no de la materia: la clave no lleva
     el slug (a diferencia de `planTrackKey`). */
  it("la clave guardada es global, sin la materia adentro", () => {
    mount();
    fireEvent.keyDown(handle("right"), { key: "Home" });
    expect(SHEET_WIDTH_KEY).toBe("sinapsis.sheetWidth");
    expect(localStorage.getItem(SHEET_WIDTH_KEY)).toBe(String(SHEET_MIN));
  });

  /* Las asas se AGREGAN: nada de lo que ya se leía puede haberse movido. */
  it("la hoja sigue teniendo lo de siempre", () => {
    mount();
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Variable Aleatoria Continua");
    expect(screen.getByText("Un párrafo cualquiera.")).toBeTruthy();
  });
});
