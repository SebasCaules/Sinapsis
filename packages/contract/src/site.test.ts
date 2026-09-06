import { describe, expect, it } from "vitest";
import {
  BACKUP_FORMAT,
  LocalBackup,
  SITE_FORMAT,
  SiteCatalog,
  SitePages,
  SiteSubject,
  SiteTools,
  emptyBackup,
  emptySubjectState,
  siteToolBase,
} from "./site.js";
import { SubjectConfig } from "./index.js";

const config = SubjectConfig.parse({
  contract: 1,
  slug: "demo",
  name: "Materia Demo",
  code: "00.01",
  institution: "Instituto Demo",
  division: { singular: "Semana", abbr: "S", plural: "Semanas" },
  divisions: [{ key: "1", name: "Semana 01" }],
  pageTypes: [{ key: "nota", label: "Nota", plural: "Notas", folder: "notas" }],
  rail: [],
  fab: null,
  wiki: { root: "wiki" },
});

describe("archivos del sitio estático", () => {
  it("el catálogo lleva una entrada por materia con sus conteos", () => {
    const catalog = SiteCatalog.parse({
      format: SITE_FORMAT,
      builtAt: "2026-09-06T00:00:00.000Z",
      subjects: [
        {
          slug: "demo",
          name: "Materia Demo",
          code: "00.01",
          institution: "Instituto Demo",
          color: "--u4",
          semester: "2026-1C",
          division: config.division,
          divisionsCount: 1,
          pagesCount: 7,
          totalPages: 8,
          toolsCount: 1,
          builtAt: "2026-09-06T00:00:00.000Z",
        },
      ],
    });
    expect(catalog.subjects[0]?.semester).toBe("2026-1C");
    expect(SiteCatalog.safeParse({ format: 2, builtAt: "x", subjects: [] }).success).toBe(false);
  });

  it("subject.json va sin cuerpos; pages.json los lleva por slug", () => {
    const subject = SiteSubject.parse({
      format: SITE_FORMAT,
      builtAt: "2026-09-06T00:00:00.000Z",
      config,
      pages: [
        { slug: "a", title: "A", type: "nota", folder: "notas", division: "1", summary: "", tags: [], sources: [], words: 3 },
      ],
      links: [{ from: "a", to: "a" }],
      study: { decks: [], quizzes: [], plan: null, kits: [] },
      warnings: [],
    });
    expect("body" in (subject.pages[0] ?? {})).toBe(false);
    const pages = SitePages.parse({ format: SITE_FORMAT, pages: { a: { body: "# A", links: [], headings: [] } } });
    expect(pages.pages["a"]?.body).toBe("# A");
    expect(SitePages.safeParse({ format: SITE_FORMAT, pages: { "Mal Slug": { body: "", links: [], headings: [] } } }).success).toBe(false);
  });

  it("tools.json lista bundles con base relativa al sitio", () => {
    const tools = SiteTools.parse({
      format: SITE_FORMAT,
      tools: [
        {
          manifest: { id: "demo", title: "Demo", version: "1" },
          bytes: 10,
          updatedAt: "2026-09-06T00:00:00.000Z",
          base: siteToolBase("demo", "demo"),
        },
      ],
    });
    expect(tools.tools[0]?.base).toBe("subjects/demo/tools/demo");
  });
});

describe("copia de seguridad del estado personal", () => {
  it("el backup vacío valida y rellena los defaults", () => {
    const parsed = LocalBackup.parse(emptyBackup());
    expect(parsed.format).toBe(BACKUP_FORMAT);
    expect(parsed.profile.name).toBe("Estudiante");
    expect(parsed.landing.hidden).toEqual([]);
    expect(parsed.subjects).toEqual({});
  });

  it("un backup mínimo (solo format y savedAt) también valida: lo demás son defaults", () => {
    const parsed = LocalBackup.parse({ format: 1, savedAt: "2026-09-06T00:00:00.000Z" });
    expect(parsed.landing.placements).toEqual({});
    expect(parsed.profile.theme).toBe("pergamino");
  });

  it("el estado de una materia extiende StudyState con las páginas estudiadas y su fecha", () => {
    const state = emptySubjectState();
    state.studied["intro"] = "2026-09-06T00:00:00.000Z";
    state.bookmarks.push("intro");
    const parsed = LocalBackup.parse({ ...emptyBackup(), subjects: { demo: state } });
    expect(parsed.subjects["demo"]?.studied["intro"]).toBeDefined();
    expect(parsed.subjects["demo"]?.srs).toEqual([]);
  });

  it("rechaza formatos desconocidos y slugs inválidos", () => {
    expect(LocalBackup.safeParse({ format: 99, savedAt: "x" }).success).toBe(false);
    expect(LocalBackup.safeParse({ ...emptyBackup(), subjects: { "Mal Slug": emptySubjectState() } }).success).toBe(false);
    expect(LocalBackup.safeParse({ ...emptyBackup(), landing: { hidden: ["ok", "NO OK"] } }).success).toBe(false);
  });
});
