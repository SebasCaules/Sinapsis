/**
 * La lógica pura de «Mis apuntes»: el orden, el buscador y la exportación.
 *
 * El markdown que baja «Exportar markdown» es un entregable del usuario: tiene
 * que abrirse en Obsidian igual que el resto del wiki, así que se prueba entero
 * y no por partes.
 */
import { describe, expect, it } from "vitest";
import { SubjectConfig, type Note, type PageMeta, type SubjectDetail } from "@sinapsis/contract";
import rawProbaConfig from "../../../../../../examples/proba/sinapsis.config.json";
import { buildSubjectModel } from "../model";
import {
  fold,
  isoDay,
  noteFilename,
  noteMarkdown,
  noteMatches,
  notesFilename,
  notesMarkdown,
  orderNotesByProgram,
  sortNotes,
} from "./notesExport";

const config = SubjectConfig.parse(rawProbaConfig);

function meta(slug: string, title: string, type: string, division: string): PageMeta {
  return { slug, title, type, folder: type, division, summary: "", tags: [], sources: [], words: 100 };
}

const pages: PageMeta[] = [
  meta("media", "Media aritmética", "concepto", "1"),
  meta("normal", "Distribución Normal", "distribucion", "3"),
];

const detail: SubjectDetail = { config, pages, studied: [], placeholder: false, lastSyncAt: null };
const model = buildSubjectModel(detail);

const NOW = "2026-09-05T18:30:00.000Z";

const notes: Note[] = [
  { page: "media", body: "Ojo: la media no resiste valores atípicos.", updatedAt: "2026-09-01T10:00:00.000Z" },
  { page: "normal", body: "La tabla Z se lee de adentro hacia afuera.", updatedAt: "2026-09-04T09:15:00.000Z" },
];

describe("notesMarkdown", () => {
  it("arma el documento completo en el orden del temario, no por fecha", () => {
    expect(notesMarkdown(model, notes, NOW)).toBe(
      [
        "# Mis apuntes — Probabilidad y Estadística",
        "",
        "> 2 apuntes · 93.24 · exportado el 2026-09-05",
        "",
        "## Media aritmética",
        "",
        "*U1 · Estadística Descriptiva · Concepto · 2026-09-01*",
        "",
        "Ojo: la media no resiste valores atípicos.",
        "",
        "[[media]]",
        "",
        "## Distribución Normal",
        "",
        "*U3 · Variables Aleatorias Discretas · Distribución · 2026-09-04*",
        "",
        "La tabla Z se lee de adentro hacia afuera.",
        "",
        "[[normal]]",
        "",
      ].join("\n"),
    );
  });

  it("el orden no cambia porque se toque un apunte (el diff del .md es estable)", () => {
    const tocado: Note[] = [
      { ...(notes[0] as Note), updatedAt: "2026-09-05T12:00:00.000Z" },
      notes[1] as Note,
    ];
    const antes = notesMarkdown(model, notes, NOW).replace(/2026-09-0\d\*/g, "FECHA*");
    const despues = notesMarkdown(model, tocado, NOW).replace(/2026-09-0\d\*/g, "FECHA*");
    expect(despues).toBe(antes);
  });

  it("el borrador general va primero y separado por una regla", () => {
    const md = notesMarkdown(model, notes, NOW, "  Repasar la tabla Z.  ");
    expect(md).toContain("## Borrador general\n\nRepasar la tabla Z.\n\n---\n");
    expect(md.indexOf("## Borrador general")).toBeLessThan(md.indexOf("## Media aritmética"));
    /* El borrador no es un apunte de página: no entra en el recuento. */
    expect(md).toContain("> 2 apuntes ·");
  });

  it("un borrador en blanco no deja la sección vacía", () => {
    expect(notesMarkdown(model, notes, NOW, "   \n  ")).not.toContain("Borrador general");
  });

  it("deja fuera los apuntes vacíos y ajusta el recuento", () => {
    const md = notesMarkdown(model, [...notes, { page: "media", body: "   ", updatedAt: NOW }], NOW);
    expect(md).toContain("> 2 apuntes ·");
  });

  it("sin apuntes explica que no hay nada en vez de dejar el archivo pelado", () => {
    const md = notesMarkdown(model, [], NOW);
    expect(md).toContain("# Mis apuntes — Probabilidad y Estadística");
    expect(md).toContain("> 0 apuntes ·");
    expect(md).toContain("_Todavía no hay apuntes en esta materia._");
  });

  it("con borrador y sin apuntes de página, el borrador igual se exporta", () => {
    const md = notesMarkdown(model, [], NOW, "Dudas sueltas");
    expect(md).toContain("## Borrador general");
    expect(md).toContain("Dudas sueltas");
    expect(md).toContain("_Todavía no hay apuntes en esta materia._");
  });

  it("un apunte de una página que ya no está en el wiki usa su slug y va al final", () => {
    const md = notesMarkdown(model, [{ page: "borrada", body: "queda esto", updatedAt: NOW }, ...notes], NOW);
    expect(md).toContain("## borrada");
    expect(md).toContain("[[borrada]]");
    expect(md.indexOf("## borrada")).toBeGreaterThan(md.indexOf("## Distribución Normal"));
  });

  it("un solo apunte se dice en singular", () => {
    expect(notesMarkdown(model, [notes[0] as Note], NOW)).toContain("> 1 apunte ·");
  });

  it("no reescribe el cuerpo: la matemática y los wikilinks salen tal cual", () => {
    const crudo = "Varianza: $s^2=\\frac{1}{n-1}\\sum (x_i-\\bar x)^2$\n\n- Ver [[boxplot]]";
    const md = notesMarkdown(model, [{ page: "media", body: crudo, updatedAt: NOW }], NOW);
    expect(md).toContain(crudo);
  });
});

describe("noteMarkdown", () => {
  it("un apunte suelto sale con su título como H1 y el wikilink de vuelta", () => {
    expect(noteMarkdown(model, notes[0] as Note)).toBe(
      [
        "# Media aritmética",
        "",
        "*U1 · Estadística Descriptiva · Concepto · 2026-09-01*",
        "",
        "Ojo: la media no resiste valores atípicos.",
        "",
        "[[media]]",
        "",
      ].join("\n"),
    );
  });

  it("una página que ya no está en el wiki usa su slug", () => {
    const md = noteMarkdown(model, { page: "borrada", body: "queda esto", updatedAt: NOW });
    expect(md).toContain("# borrada");
    expect(md).toContain("[[borrada]]");
  });
});

describe("buscador", () => {
  const nota = notes[0] as Note;

  it("sin búsqueda no filtra nada", () => {
    expect(noteMatches(model, nota, "")).toBe(true);
  });

  it("encuentra por el título de la página", () => {
    expect(noteMatches(model, nota, fold("media"))).toBe(true);
  });

  it("encuentra por el CUERPO del apunte, que es lo que uno recuerda", () => {
    expect(noteMatches(model, nota, fold("atípicos"))).toBe(true);
    expect(noteMatches(model, notes[1] as Note, fold("tabla z"))).toBe(true);
  });

  it("no distingue mayúsculas ni acentos", () => {
    expect(noteMatches(model, nota, fold("ARITMETICA"))).toBe(true);
    expect(noteMatches(model, nota, fold("atipicos"))).toBe(true);
  });

  it("lo que no está no aparece", () => {
    expect(noteMatches(model, nota, fold("bayes"))).toBe(false);
  });

  it("una página que ya no está en el wiki se busca por su slug", () => {
    const huerfano: Note = { page: "pagina-borrada", body: "x", updatedAt: NOW };
    expect(noteMatches(model, huerfano, fold("borrada"))).toBe(true);
  });
});

describe("auxiliares", () => {
  it("ordena por fecha descendente (el orden de la pantalla)", () => {
    expect(sortNotes(notes).map((n) => n.page)).toEqual(["normal", "media"]);
  });

  it("ordena por división y título (el orden del documento)", () => {
    expect(orderNotesByProgram(model, notes).map((n) => n.page)).toEqual(["media", "normal"]);
  });

  it("recorta la fecha a AAAA-MM-DD", () => {
    expect(isoDay(NOW)).toBe("2026-09-05");
    expect(isoDay("no es una fecha")).toBe("no es una ");
  });

  it("el archivo lleva la materia y el día", () => {
    expect(notesFilename("proba", NOW)).toBe("apuntes-proba-2026-09-05.md");
  });

  it("el archivo de un apunte suelto lleva la página y el día", () => {
    expect(noteFilename("media", NOW)).toBe("apunte-media-2026-09-05.md");
  });
});
