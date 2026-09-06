import { describe, expect, it } from "vitest";
import {
  Plan,
  SRS_DEFAULT,
  SubjectConfig,
  autoDecks,
  sm2,
  type Page,
  type SubjectConfig as Cfg,
} from "./index.js";

const NOW = "2026-09-05T12:00:00.000Z";
const days = (from: string, to: string) => Math.round((Date.parse(to) - Date.parse(from)) / 86_400_000);

describe("sm2", () => {
  it("con la secuencia bien · bien · fácil crece 1 → 3 → más, y siempre agenda a futuro", () => {
    const uno = sm2({ ...SRS_DEFAULT }, 3, NOW);
    expect(uno.interval).toBe(1);
    expect(uno.reps).toBe(1);
    expect(uno.lapses).toBe(0);
    expect(days(NOW, uno.due)).toBe(1);

    const dos = sm2(uno, 3, NOW);
    expect(dos.interval).toBe(3);
    expect(dos.reps).toBe(2);
    expect(days(NOW, dos.due)).toBe(3);

    const tres = sm2(dos, 4, NOW);
    expect(tres.interval).toBeGreaterThan(dos.interval);
    expect(tres.reps).toBe(3);
    expect(tres.ease).toBeGreaterThan(dos.ease);
    expect(Date.parse(tres.due)).toBeGreaterThan(Date.parse(NOW));
    expect(tres.lastGrade).toBe(4);
  });

  it("la nota 1 reinicia el intervalo, suma una recaída y reagenda en minutos", () => {
    const tres = sm2(sm2(sm2({ ...SRS_DEFAULT }, 3, NOW), 3, NOW), 4, NOW);
    const otraVez = sm2(tres, 1, NOW);

    expect(otraVez.interval).toBe(0);
    expect(otraVez.reps).toBe(0);
    expect(otraVez.lapses).toBe(1);
    expect(otraVez.ease).toBeCloseTo(tres.ease - 0.2, 10);
    expect(Date.parse(otraVez.due) - Date.parse(NOW)).toBe(10 * 60 * 1000);
  });

  it("nunca baja la facilidad de 1.3 por más recaídas que haya", () => {
    let state = { ...SRS_DEFAULT };
    for (let i = 0; i < 20; i += 1) state = { ...state, ...sm2(state, 1, NOW) };
    expect(state.ease).toBe(1.3);
  });
});

describe("autoDecks", () => {
  const config: Cfg = SubjectConfig.parse({
    slug: "demo",
    name: "Demo",
    code: "0",
    institution: "ITBA",
    division: { singular: "Unidad", abbr: "U", plural: "Unidades" },
    divisions: [
      { key: "1", name: "Primera" },
      { key: "2", name: "Segunda" },
      { key: "3", name: "Sin páginas" },
    ],
    pageTypes: [
      { key: "concepto", label: "Concepto", plural: "Conceptos", folder: "conceptos" },
      { key: "fuente", label: "Fuente", plural: "Fuentes", folder: "fuentes", countsAsContent: false },
    ],
  });

  const page = (slug: string, division: string, type: string, summary: string): Pick<Page, "slug" | "title" | "summary" | "type" | "division"> => ({
    slug,
    title: slug.replace(/-/g, " "),
    summary,
    type,
    division,
  });

  const pages = [
    page("uno", "1", "concepto", "El primero."),
    page("dos", "1", "concepto", "El segundo."),
    page("tres", "2", "concepto", "El tercero."),
    page("sin-resumen", "2", "concepto", ""),
    page("apunte-de-catedra", "1", "fuente", "Una fuente con resumen."),
    page("transversal", "meta", "concepto", "Vale para toda la materia."),
  ];

  it("agrupa por división, excluye fuentes y páginas sin resumen", () => {
    const decks = autoDecks(config, pages);

    expect(decks.map((d) => d.id)).toEqual(["auto-1", "auto-2", "auto-meta"]);
    expect(decks.every((d) => d.source === "auto")).toBe(true);

    const primera = decks[0]!;
    expect(primera.title).toContain("Primera");
    expect(primera.division).toBe("1");
    // "apunte-de-catedra" es de un tipo con countsAsContent:false y queda afuera.
    expect(primera.cards.map((c) => c.page)).toEqual(["uno", "dos"]);
    expect(primera.cards[0]).toMatchObject({ id: "auto:uno", front: "uno", back: "El primero." });

    // "sin-resumen" no puede ser tarjeta: el reverso sería vacío.
    expect(decks[1]!.cards.map((c) => c.page)).toEqual(["tres"]);
    // La división declarada sin páginas no genera mazo; las transversales sí.
    expect(decks.map((d) => d.division)).not.toContain("3");
    expect(decks[2]!.cards.map((c) => c.page)).toEqual(["transversal"]);
  });

  it("sin páginas con resumen no genera ningún mazo", () => {
    expect(autoDecks(config, [page("x", "1", "concepto", "")])).toEqual([]);
    expect(autoDecks(config, [])).toEqual([]);
  });
});

describe("Plan.tracks", () => {
  const fase = (id: string, tarea: string) => ({
    id,
    title: `Fase ${id}`,
    milestones: [{ id: `hito-${id}`, title: "Hito", tasks: [{ id: tarea, label: "Tarea" }] }],
  });

  it("una modalidad puede compartir una fase con `phases` (misma fase, mismos ids de tarea)", () => {
    const compartida = fase("fase-1", "t-1");
    const plan = Plan.parse({
      phases: [compartida],
      tracks: [
        { id: "cursada", label: "Cursada + final", phases: [compartida, fase("fase-2", "t-2")] },
        { id: "final-directo", label: "Final directo", phases: [fase("fase-3", "t-3")] },
      ],
    });
    expect(plan.tracks).toHaveLength(2);
    expect(plan.tracks[0]?.phases[0]).toEqual(plan.phases[0]);
    expect(plan.tracks[0]?.phases[0]?.milestones[0]?.tasks[0]?.id).toBe("t-1");
  });

  it("sin modalidades, `tracks` queda vacío por defecto", () => {
    expect(Plan.parse({ phases: [fase("fase-1", "t-1")] }).tracks).toEqual([]);
  });
});
