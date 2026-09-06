/**
 * Tarjeta de vista previa de página (N0-50), en sus dos mitades:
 *
 *  1. `page-tip.ts`, la lógica pura: qué enlace es un objetivo, cómo se recorta
 *     el texto y de dónde sale la sección de un ancla.
 *  2. `PageTip.tsx`, el componente: retraso, foco, Escape y la ventana para
 *     cambiar de enlace sin volver a esperar.
 */
import { useRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { SubjectConfig, type PageHeading, type PageMeta, type SubjectDetail } from "@sinapsis/contract";
import rawProbaConfig from "../../../../../../subjects/proba/sinapsis.config.json";
import { buildSubjectModel } from "../model";
import { PageTip, PAGE_TIP_ID } from "./PageTip";
import { clip, firstPara, leadOf, plainish, sectionOf, stripLabel, targetOf } from "./page-tip";

// ---------------------------------------------------------------------------
// 1 · lógica pura
// ---------------------------------------------------------------------------

describe("clip", () => {
  it("corta en palabra y agrega puntos suspensivos", () => {
    const text = "una frase bastante larga que hay que recortar en algún lugar razonable";
    const out = clip(text, 30);
    expect(out.length).toBeLessThanOrEqual(31);
    expect(out.endsWith("…")).toBe(true);
    expect(out).not.toMatch(/\s…$/);
  });

  it("nunca deja un dólar suelto", () => {
    const text = "La densidad de la Normal es $f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-z^2/2}$ y es simétrica.";
    const out = clip(text, 40);
    expect((out.match(/\$/g) ?? []).length % 2).toBe(0);
  });

  it("deja el texto corto tal cual", () => {
    expect(clip("dos palabras", 100)).toBe("dos palabras");
  });
});

describe("plainish", () => {
  it("reduce wikilinks, enlaces y código a su texto y conserva la matemática", () => {
    const out = plainish("Ver [[distribucion-normal|la Normal]] y `code`, [link](http://x) con $\\mu$.");
    expect(out).toBe("Ver la Normal y code, link con $\\mu$.");
  });

  it("desarma la negrita, que MathText no compone", () => {
    expect(plainish("El **proceso de conteo** cuenta $N(t)$.")).toBe("El proceso de conteo cuenta $N(t)$.");
  });

  it("un wikilink sin etiqueta se reduce a su destino", () => {
    expect(plainish("Ver [[esperanza]].")).toBe("Ver esperanza.");
  });
});

describe("firstPara", () => {
  it("salta títulos, citas, listas y cercas de código", () => {
    const body = [
      "## Un título",
      "",
      "> una cita",
      "",
      "- un ítem",
      "",
      "```",
      "codigo = 1",
      "```",
      "",
      "El párrafo de verdad.",
      "Sigue en la línea siguiente.",
      "",
      "Otro párrafo que no entra.",
    ].join("\n");
    expect(firstPara(body)).toBe("El párrafo de verdad. Sigue en la línea siguiente.");
  });

  it("salta un bloque de matemática de display", () => {
    expect(firstPara("$$\nx = 1\n$$\n\nDespués el texto.")).toBe("Después el texto.");
  });
});

describe("stripLabel", () => {
  it("quita el rótulo con el que abren las páginas del wiki", () => {
    expect(stripLabel("**En breve.** La campana.")).toBe("La campana.");
    expect(stripLabel("**Qué es:** una técnica.")).toBe("una técnica.");
    expect(stripLabel("Sin rótulo.")).toBe("Sin rótulo.");
  });
});

describe("leadOf", () => {
  it("prefiere el resumen del frontmatter", () => {
    expect(leadOf({ summary: "El resumen." }, "# Título\n\nEl cuerpo.")).toBe("El resumen.");
  });

  it("sin resumen cae al primer párrafo del cuerpo, sin rótulo", () => {
    expect(leadOf({ summary: "" }, "## Sección\n\n**En breve.** El cuerpo.")).toBe("El cuerpo.");
  });

  it("sin resumen y sin cuerpo no inventa nada", () => {
    expect(leadOf({ summary: "" })).toBe("");
  });
});

describe("sectionOf", () => {
  const body = [
    "## Proceso de conteo",
    "",
    "Cuenta los eventos hasta el instante $t$.",
    "",
    "## Independencia",
    "",
    "Dos sucesos son independientes cuando $P(A\\cap B)=P(A)P(B)$.",
    "",
    "## Otra sección",
    "",
    "Nada que ver.",
  ].join("\n");
  const headings: PageHeading[] = [
    { id: "proceso-de-conteo", text: "Proceso de conteo", level: 2 },
    { id: "independencia", text: "Independencia", level: 2 },
    { id: "otra-seccion", text: "Otra sección", level: 2 },
  ];

  it("encuentra la sección por el id del contrato", () => {
    const out = sectionOf(body, headings, "independencia");
    expect(out?.title).toBe("Independencia");
    expect(out?.text).toContain("independientes");
  });

  /* `headingId` no es idempotente (borra los guiones antes de poner los suyos):
     un ancla que YA es un id, como la que escribe el compilador en el href de un
     wikilink, tiene que encontrarse igual. */
  it("encuentra la sección con un ancla de varias palabras ya normalizada", () => {
    const out = sectionOf(body, headings, "proceso-de-conteo");
    expect(out?.title).toBe("Proceso de conteo");
    expect(out?.text).toBe("Cuenta los eventos hasta el instante $t$.");
  });

  it("encuentra la sección por el texto del encabezado", () => {
    expect(sectionOf(body, headings, "Otra sección")?.text).toBe("Nada que ver.");
  });

  it("con el encabezado solo en el índice muestra el título sin cuerpo", () => {
    const only: PageHeading[] = [{ id: "resumen-final", text: "Resumen final", level: 2 }];
    expect(sectionOf("Un cuerpo sin encabezados.", only, "resumen-final")).toEqual({
      title: "Resumen final",
      text: "",
    });
  });

  it("sin ancla y sin coincidencia devuelve null", () => {
    expect(sectionOf(body, headings, "")).toBeNull();
    expect(sectionOf(body, headings, "no-existe")).toBeNull();
  });
});

describe("targetOf", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  const mount = (html: string): void => {
    document.body.innerHTML = html;
  };

  it("reconoce el enlace del SPA, con y sin ancla", () => {
    mount('<a id="a" href="/m/proba/p/distribucion-normal">N</a>');
    const a = document.getElementById("a");
    expect(targetOf(a, "proba")).toMatchObject({ slug: "distribucion-normal", anchor: "" });

    mount('<a id="b" href="/m/proba/p/formulario-maestro#independencia">I</a>');
    expect(targetOf(document.getElementById("b"), "proba")).toMatchObject({
      slug: "formulario-maestro",
      anchor: "independencia",
    });
  });

  it("reconoce las formas del baseline: href de hash, data-go y data-nav", () => {
    mount('<a id="a" href="#/p/esperanza">E</a>');
    expect(targetOf(document.getElementById("a"), "proba")?.slug).toBe("esperanza");

    mount('<button id="b" data-go="#/p/varianza">V</button>');
    expect(targetOf(document.getElementById("b"), "proba")?.slug).toBe("varianza");

    mount('<button id="c" data-nav="#/p/covarianza">C</button>');
    expect(targetOf(document.getElementById("c"), "proba")?.slug).toBe("covarianza");
  });

  it("reconoce la marca explícita data-page-tip, con ancla", () => {
    mount('<span id="a" data-page-tip="formulario-maestro#independencia">F</span>');
    expect(targetOf(document.getElementById("a"), "proba")).toMatchObject({
      slug: "formulario-maestro",
      anchor: "independencia",
    });
  });

  it("sube desde el nodo interno hasta el enlace", () => {
    mount('<a href="/m/proba/p/esperanza"><span id="dentro">E</span></a>');
    expect(targetOf(document.getElementById("dentro"), "proba")?.slug).toBe("esperanza");
  });

  it("no reconoce enlaces de otra materia, de otra vista ni saltos internos", () => {
    mount('<a id="a" href="/m/algebra/p/matrices">M</a>');
    expect(targetOf(document.getElementById("a"), "proba")).toBeNull();

    mount('<a id="b" href="/m/proba/d/1">U1</a>');
    expect(targetOf(document.getElementById("b"), "proba")).toBeNull();

    mount('<a id="c" class="wikilink" href="#independencia">I</a>');
    expect(targetOf(document.getElementById("c"), "proba")).toBeNull();
  });

  it("excluye el rail, la propia tarjeta y los diálogos", () => {
    mount(
      '<nav aria-label="Secciones de la materia"><a id="a" href="/m/proba/p/esperanza">E</a></nav>' +
        '<div data-page-tip-card=""><a id="b" href="/m/proba/p/varianza">V</a></div>' +
        '<div role="dialog"><a id="c" href="/m/proba/p/covarianza">C</a></div>',
    );
    expect(targetOf(document.getElementById("a"), "proba")).toBeNull();
    expect(targetOf(document.getElementById("b"), "proba")).toBeNull();
    expect(targetOf(document.getElementById("c"), "proba")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 2 · el componente
// ---------------------------------------------------------------------------

const config = SubjectConfig.parse(rawProbaConfig);

function meta(slug: string, title: string, summary: string, order: number): PageMeta {
  return {
    slug,
    title,
    type: "concepto",
    folder: "conceptos",
    division: "1",
    order,
    summary,
    tags: [],
    sources: [],
    words: 300,
  };
}

const detail: SubjectDetail = {
  config,
  pages: [
    meta("esperanza", "Esperanza", "El valor medio de una variable aleatoria.", 1),
    meta("varianza", "Varianza", "Cuánto se aparta una variable de su media.", 2),
  ],
  studied: ["esperanza"],
  placeholder: false,
  lastSyncAt: null,
};

/** El retraso de apertura, con margen para el reloj falso. */
const OPEN = 400;

/**
 * Un shell de mentira: el `div` raíz con la ref (donde se delegan los eventos),
 * cuatro enlaces y la tarjeta, igual que en `SubjectShell`.
 */
function Harness({ model }: { model: ReturnType<typeof buildSubjectModel> }) {
  const rootRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={rootRef}>
      <a href="/m/proba/p/esperanza">Esperanza</a>
      <a href="/m/proba/p/varianza">Varianza</a>
      <a href="/m/proba/p/no-existe">Fantasma</a>
      <a href="https://example.org">Afuera</a>
      <PageTip model={model} subject="proba" rootRef={rootRef} currentPage={null} />
    </div>
  );
}

function mount() {
  const model = buildSubjectModel(detail);
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <Harness model={model} />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

const tip = () => document.getElementById(PAGE_TIP_ID);

describe("PageTip", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  it("aparece a los 350 ms de entrar y describe al enlace", () => {
    mount();
    const link = screen.getByRole("link", { name: "Esperanza" });

    fireEvent.mouseOver(link);
    expect(tip()).toBeNull();
    act(() => {
      vi.advanceTimersByTime(340);
    });
    expect(tip()).toBeNull();

    act(() => {
      vi.advanceTimersByTime(20);
    });
    const card = tip();
    expect(card).not.toBeNull();
    expect(card?.getAttribute("role")).toBe("tooltip");
    expect(card?.textContent).toContain("Esperanza");
    expect(card?.textContent).toContain("El valor medio de una variable aleatoria.");
    /* Estudiada: el pie lo dice y la línea meta trae la división y el tipo. */
    expect(card?.textContent).toContain("300 palabras");
    expect(card?.textContent).toContain("leída");
    /* La línea meta va por piezas: división, etiqueta del tipo, insignia de estado. */
    expect(card?.textContent).toContain("U1");
    expect(card?.textContent).toContain("Concepto");
    expect(link.getAttribute("aria-describedby")).toBe(PAGE_TIP_ID);
  });

  it("el foco del teclado también la muestra", () => {
    mount();
    const link = screen.getByRole("link", { name: "Varianza" });
    fireEvent.focusIn(link);
    act(() => {
      vi.advanceTimersByTime(OPEN);
    });
    expect(tip()?.textContent).toContain("Cuánto se aparta una variable de su media.");
  });

  it("Escape la cierra y suelta el aria-describedby", () => {
    mount();
    const link = screen.getByRole("link", { name: "Esperanza" });
    fireEvent.mouseOver(link);
    act(() => {
      vi.advanceTimersByTime(OPEN);
    });
    expect(tip()).not.toBeNull();

    act(() => {
      fireEvent.keyDown(document, { key: "Escape" });
    });
    expect(tip()).toBeNull();
    expect(link.hasAttribute("aria-describedby")).toBe(false);
  });

  /* La tarjeta visible se queda con el Escape (es la capa de más arriba, como
     en el baseline); una que todavía no se ve no puede gastarlo. */
  it("solo la tarjeta visible se queda con el Escape", () => {
    mount();
    const link = screen.getByRole("link", { name: "Esperanza" });
    /* En burbuja sobre el `body`: el manejador de la tarjeta corre antes, en
       captura sobre `document`, así que esto solo se llama si dejó pasar. */
    const shell = vi.fn();
    document.body.addEventListener("keydown", shell);
    try {
      // 1 · apenas pendiente (todavía invisible): el Escape sigue su camino.
      fireEvent.mouseOver(link);
      act(() => {
        vi.advanceTimersByTime(100);
      });
      expect(tip()).toBeNull();
      act(() => {
        fireEvent.keyDown(link, { key: "Escape" });
      });
      expect(shell).toHaveBeenCalledTimes(1);
      act(() => {
        vi.advanceTimersByTime(OPEN);
      });
      expect(tip()).toBeNull();

      // 2 · ya visible: el Escape la cierra y no llega a nadie más.
      shell.mockClear();
      fireEvent.mouseOver(link);
      act(() => {
        vi.advanceTimersByTime(OPEN);
      });
      expect(tip()).not.toBeNull();
      act(() => {
        fireEvent.keyDown(link, { key: "Escape" });
      });
      expect(tip()).toBeNull();
      expect(shell).not.toHaveBeenCalled();
    } finally {
      document.body.removeEventListener("keydown", shell);
    }
  });

  it("cambiar de enlace dentro de la ventana no vuelve a esperar", () => {
    mount();
    const primero = screen.getByRole("link", { name: "Esperanza" });
    const segundo = screen.getByRole("link", { name: "Varianza" });

    fireEvent.mouseOver(primero);
    act(() => {
      vi.advanceTimersByTime(OPEN);
    });
    expect(tip()?.textContent).toContain("Esperanza");

    /* Salir del primero cierra; entrar al segundo dentro de los 250 ms la vuelve
       a mostrar SIN retraso. */
    act(() => {
      fireEvent.mouseOut(primero, { relatedTarget: segundo });
    });
    expect(tip()).toBeNull();
    act(() => {
      fireEvent.mouseOver(segundo);
    });
    expect(tip()?.textContent).toContain("Varianza");
  });

  it("un enlace que no es una página de la materia no la muestra", () => {
    mount();
    fireEvent.mouseOver(screen.getByRole("link", { name: "Afuera" }));
    fireEvent.mouseOver(screen.getByRole("link", { name: "Fantasma" }));
    act(() => {
      vi.advanceTimersByTime(OPEN);
    });
    expect(tip()).toBeNull();
  });
});

