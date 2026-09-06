/**
 * La barra de unidad del lector con los ejercicios de la unidad (N0-61): un
 * segmento por grupo al final de los de las páginas, «+M ejercicios» junto a la
 * posición, y el «Siguiente» de la última página apuntando al primer grupo.
 *
 * Los segmentos de PÁGINA no se tocan: se comprueba que su `aria-label` y su
 * `data-seg` siguen exactamente como estaban (hay E2E sobre ellos).
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
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
import { buildSubjectModel, type ExtraStep } from "../model";
import { ReaderView } from "./ReaderView";

const config = SubjectConfig.parse(rawProbaConfig);

function meta(slug: string, title: string, order: number): PageMeta {
  return {
    slug,
    title,
    type: "concepto",
    folder: "conceptos",
    division: "1",
    order,
    summary: "",
    tags: [],
    sources: [],
    words: 200,
  };
}

const pages = [meta("u1-a", "Medidas de posición", 1), meta("u1-b", "Medidas de dispersión", 2)];
const detail: SubjectDetail = { config, pages, studied: [], placeholder: false, lastSyncAt: null };

/* Sin encabezados: el índice de la página monta un `IntersectionObserver`, que
   jsdom no tiene, y no es lo que se prueba acá. */
const bodyOf = (page: PageMeta): PageDetail => ({
  page: { ...page, links: [], headings: [], body: "Un párrafo cualquiera." },
  backlinks: [],
  studied: false,
});

const studyState: StudyState = {
  srs: [],
  bookmarks: [],
  notes: [],
  tasksDone: [],
  attempts: [],
  planDates: {},
};

/** Dos grupos: uno a medio hacer y otro sin empezar. */
const PASOS: Record<string, ExtraStep[]> = {
  "1": [
    { id: "g1", label: "Ejercicio 1", done: true, group: "Guía", to: "/m/proba/t/ejercicios?arg=1%2Fguia", source: "ejercicios" },
    { id: "g2", label: "Ejercicio 2", done: false, group: "Guía", to: "/m/proba/t/ejercicios?arg=1%2Fguia", source: "ejercicios" },
    { id: "p1", label: "Parcial 1", done: false, group: "Parciales", to: "/m/proba/t/ejercicios?arg=1%2Fparciales", source: "ejercicios" },
  ],
};

function mount(slug: string, pasos: boolean) {
  const model = buildSubjectModel(detail, false, pasos ? { extraSteps: (d) => PASOS[d] ?? [] } : {});
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity, refetchOnMount: false } },
  });
  for (const page of pages) client.setQueryData(qk.page("proba", page.slug), bodyOf(page));
  client.setQueryData(qk.studyState("proba"), studyState);
  const ctx = { slug: "proba", model, openSearch: () => {}, runtime: { ready: false } as never };
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[`/m/proba/p/${slug}`]}>
        <Routes>
          <Route path="/m/proba" element={<Outlet context={ctx} />}>
            <Route path="p/:page" element={<ReaderView />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

/* jsdom no trae `matchMedia` y el lector la consulta para saber si la columna
   lateral cabe al lado de la hoja. */
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

describe("barra de unidad · ejercicios", () => {
  it("cierra la barra con un segmento por grupo, con su avance en el nombre accesible", () => {
    mount("u1-a", true);
    const guia = screen.getByRole("link", { name: "Ejercicios · Guía · 1 de 2 resueltos" });
    expect(guia.getAttribute("href")).toBe("/m/proba/t/ejercicios?arg=1%2Fguia");
    expect(guia.dataset["state"]).toBe("partial");

    const parciales = screen.getByRole("link", { name: "Ejercicios · Parciales · 0 de 1 resuelto" });
    expect(parciales.dataset["state"]).toBe("todo");

    /* Van DESPUÉS de las páginas, que es el orden de la unidad. */
    const track = guia.parentElement as HTMLElement;
    expect(Array.from(track.children).map((el) => (el as HTMLElement).dataset["seg"] ?? "extra")).toEqual([
      "1",
      "2",
      "extra",
      "extra",
    ]);
  });

  /* N0-64: la tarjeta de vista previa cubre también los pasos de ejercicios.
     El segmento no la conoce: solo declara qué tiene que decir. */
  it("cada grupo declara su tarjeta de vista previa en atributos", () => {
    mount("u1-a", true);
    const guia = screen.getByRole("link", { name: "Ejercicios · Guía · 1 de 2 resueltos" });
    expect(guia.dataset["tipKicker"]).toBe("U1 · Ejercicios");
    expect(guia.dataset["tipTitle"]).toBe("Guía");
    expect(guia.dataset["tipText"]).toBe("1 de 2 resueltos");
    expect(guia.dataset["tipType"]).toBe("ejercicios");
    /* El proveedor se llama «ejercicios» y la etiqueta de la tarjeta ya lo dice:
       el pie se calla en vez de repetirlo. */
    expect(guia.dataset["tipMeta"]).toBeUndefined();

    /* Sin nada resuelto se dice cuántos hay, que es más útil que «0 de 1». */
    const parciales = screen.getByRole("link", { name: "Ejercicios · Parciales · 0 de 1 resuelto" });
    expect(parciales.dataset["tipText"]).toBe("1 ejercicio");
  });

  it("los segmentos de página no cambian", () => {
    mount("u1-a", true);
    const primera = screen.getByRole("link", { name: "1 de 2. Medidas de posición" });
    expect(primera.dataset["seg"]).toBe("1");
    expect(primera.dataset["state"]).toBe("current");
    expect(screen.getByRole("link", { name: "2 de 2. Medidas de dispersión" }).dataset["state"]).toBe("todo");
  });

  it("la posición sigue contando páginas y suma los ejercicios aparte", () => {
    mount("u1-a", true);
    expect(screen.getByText("página 1 de 2 · +3 ejercicios")).toBeTruthy();
  });

  it("la última página tiene como siguiente el primer grupo, arriba y al pie", () => {
    mount("u1-b", true);
    /* Junto a la barra: el rótulo nombra el grupo. */
    const arriba = screen.getByRole("link", { name: /^Guía →/ });
    expect(arriba.getAttribute("href")).toBe("/m/proba/t/ejercicios?arg=1%2Fguia");
    /* Al pie: el rótulo dice que lo que sigue son ejercicios. */
    const pie = screen.getByRole("link", { name: /Siguiente: ejercicios →/ });
    expect(pie.getAttribute("href")).toBe("/m/proba/t/ejercicios?arg=1%2Fguia");
    expect(pie.textContent).toContain("Guía · 1 de 2 resueltos");
  });

  it("sin proveedores, la barra y la posición quedan como estaban", () => {
    mount("u1-a", false);
    expect(screen.getByText("página 1 de 2")).toBeTruthy();
    expect(screen.queryByRole("link", { name: /^Ejercicios · / })).toBeNull();
    expect(screen.getByRole("link", { name: "1 de 2. Medidas de posición" })).toBeTruthy();
  });
});
