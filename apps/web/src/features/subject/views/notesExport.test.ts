/**
 * El markdown que baja «Exportar markdown» es un entregable del usuario: tiene
 * que abrirse en Obsidian igual que el resto del wiki. Se prueba entero, no por
 * partes.
 */
import { describe, expect, it } from "vitest";
import { SubjectConfig, type Note, type PageMeta, type SubjectDetail } from "@sinapsis/contract";
import rawProbaConfig from "../../../../../../examples/proba/sinapsis.config.json";
import { buildSubjectModel } from "../model";
import { isoDay, notesFilename, notesMarkdown, sortNotes } from "./notesExport";

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
  it("arma el documento completo, del apunte más reciente al más viejo", () => {
    expect(notesMarkdown(model, notes, NOW)).toBe(
      [
        "# Mis apuntes — Probabilidad y Estadística",
        "",
        "> 2 apuntes · 93.24 · exportado el 2026-09-05",
        "",
        "## Distribución Normal",
        "",
        "*U3 · Variables Aleatorias Discretas · Distribución · 2026-09-04*",
        "",
        "La tabla Z se lee de adentro hacia afuera.",
        "",
        "[[normal]]",
        "",
        "## Media aritmética",
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

  it("un apunte de una página que ya no está en el wiki usa su slug", () => {
    const md = notesMarkdown(model, [{ page: "borrada", body: "queda esto", updatedAt: NOW }], NOW);
    expect(md).toContain("## borrada");
    expect(md).toContain("[[borrada]]");
  });

  it("un solo apunte se dice en singular", () => {
    expect(notesMarkdown(model, [notes[0] as Note], NOW)).toContain("> 1 apunte ·");
  });
});

describe("auxiliares", () => {
  it("ordena por fecha descendente", () => {
    expect(sortNotes(notes).map((n) => n.page)).toEqual(["normal", "media"]);
  });

  it("recorta la fecha a AAAA-MM-DD", () => {
    expect(isoDay(NOW)).toBe("2026-09-05");
    expect(isoDay("no es una fecha")).toBe("no es una ");
  });

  it("el archivo lleva la materia y el día", () => {
    expect(notesFilename("proba", NOW)).toBe("apuntes-proba-2026-09-05.md");
  });
});
