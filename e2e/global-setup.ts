/**
 * Siembra de las pruebas de punta a punta.
 *
 * Sin API y sin sesión, «sembrar» ya no es hacer peticiones: es COMPILAR una
 * materia al sitio estático que la web lee y describir en un manifiesto con qué
 * datos está corriendo la suite.
 *
 * El sitio lo construye `prepare-site.ts` desde el propio comando del
 * `webServer` (Playwright levanta los servidores ANTES de correr este archivo, y
 * Vite fotografía `publicDir` al crearse). Acá se lee lo que quedó escrito en
 * `e2e/.site/subjects/` y se deriva `e2e/.seed.json`:
 *
 *   a) el catálogo (`index.json`) y la materia (`subject.json`): nombre, código,
 *      divisiones declaradas y visibles, páginas y material de estudio;
 *   b) los bundles (`tools.json` + los archivos escritos): el principal es el
 *      que registra figuras, que es con el que corren `tools.spec.ts` y
 *      `figures.spec.ts`;
 *   c) la página con `> [!figura] <id>` (de `pages.json`), comprobando que algún
 *      script del bundle registre esa figura: sin eso `figures.spec.ts` fallaría
 *      con «la figura no dibujó» sin decir por qué;
 *   d) la landing inicial que reponen las specs de landing con `restore()`: el
 *      catálogo en el cuatrimestre que declara cada config, más la materia
 *      placeholder «Materia Demo B».
 *
 * El estado personal NO se siembra desde acá: vive en el navegador y cada prueba
 * de Playwright arranca con un contexto limpio (IndexedDB y `localStorage`
 * vacíos). Lo que una spec necesite ya cargado lo pone con
 * `window.__sinapsis.restore()` (ver `support/app.ts`).
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  SEED_FILE,
  SHOTS_DIR,
  SEED_PLACEHOLDER,
  type SeedManifest,
  type SeedStudy,
  type SeedTools,
} from "./support/seed";
import { SITE_SUBJECTS_DIR, readOrBuildSite } from "./support/site";

/** Lo que la siembra mira del `subject.json` que escribió `site build`. */
interface SiteSubjectLike {
  config: {
    slug: string;
    name: string;
    code: string;
    institution: string;
    semester?: string;
    division: { singular: string; abbr: string; plural: string };
    divisions: Array<{ key: string }>;
    pageTypes: Array<{ key: string; countsAsContent?: boolean }>;
    rail: Array<{ label: string; items?: Array<{ id: string; label: string; kind: string; target: string }> }>;
    wiki?: { standalone?: string[] };
  };
  pages: Array<{ slug: string; title: string; type: string; division: string; summary: string }>;
  study: {
    decks: Array<{ id: string; title: string; source?: string; cards: unknown[] }>;
    quizzes: Array<{ id: string; title: string; questions: unknown[] }>;
    plan: unknown;
    kits: unknown[];
  };
  warnings: string[];
}

interface SiteToolsLike {
  tools: Array<{
    manifest: {
      id: string;
      title: string;
      views: Array<{ id: string; label: string }>;
      figures: boolean;
    };
    base: string;
  }>;
}

interface SitePagesLike {
  pages: Record<string, { body: string }>;
}

function readJson<T>(file: string): T {
  return JSON.parse(readFileSync(file, "utf8")) as T;
}

/** Archivos de un bundle ya escritos en el sitio, recursivamente. */
function bundleFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) out.push(...bundleFiles(full));
    else out.push(full);
  }
  return out;
}

/**
 * Página con la que corre `figures.spec.ts` y el id de su primera figura. El id
 * sale del propio callout (`> [!figura] <id>`) y se comprueba que algún script
 * del bundle lo registre: si no, la figura se dibujaría como «no registrada» y
 * la spec fallaría sin decir por qué.
 */
function figurePageOf(
  subject: SiteSubjectLike,
  bodies: SitePagesLike,
  slug: string,
  bundleDir: string,
  bundleId: string,
): { slug: string; title: string; fig: string } {
  const meta = subject.pages.find((p) => p.slug === slug);
  const body = bodies.pages[slug]?.body;
  if (!meta || body === undefined) {
    throw new Error(`Siembra E2E — la página de figuras «${slug}» no está en la materia compilada`);
  }
  const found = body.match(/^>[ \t]*\[!figura\][ \t]+(\S+)/m);
  if (!found?.[1]) {
    throw new Error(`Siembra E2E — «${slug}» ya no trae ningún callout «> [!figura] <id>»`);
  }
  const fig = found[1];

  // `registerFigure(` y el id pueden estar en líneas distintas y con comillas
  // simples o dobles: el bundle lo escribe como quiere.
  const call = new RegExp(`registerFigure\\(\\s*["']${fig.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`);
  const registered = bundleFiles(bundleDir)
    .filter((file) => file.endsWith(".js"))
    .some((file) => call.test(readFileSync(file, "utf8")));
  if (!registered) {
    throw new Error(
      `Siembra E2E — ningún script de «${bundleId}» registra la figura «${fig}» que pide ${slug}`,
    );
  }
  return { slug: meta.slug, title: meta.title, fig };
}

/** Mazos automáticos que la web agrega al material autoral (contrato `autoDecks`). */
async function autoDeckCount(subject: SiteSubjectLike): Promise<number> {
  const { autoDecks } = (await import("../packages/contract/src/index.js")) as {
    autoDecks: (cfg: unknown, pages: unknown) => unknown[];
  };
  return autoDecks(subject.config, subject.pages).length;
}

/** Divisiones que el índice llega a dibujar (las declaradas con páginas + las sintéticas). */
function visibleDivisions(subject: SiteSubjectLike): number {
  const used = new Set(subject.pages.map((p) => p.division || "meta"));
  const declared = new Set(subject.config.divisions.map((d) => d.key));
  return (
    subject.config.divisions.filter((d) => used.has(d.key)).length +
    // La única división sintética del modelo del front es "otras" (claves que
    // las páginas usan y el config no declara). Las páginas sin división
    // ("meta") no forman una división (N0-74).
    ([...used].some((k) => k !== "meta" && !declared.has(k)) ? 1 : 0)
  );
}

export default async function globalSetup(): Promise<void> {
  mkdirSync(SHOTS_DIR, { recursive: true });

  const build = await readOrBuildSite();
  const proba = build.mode === "proba";
  const slug = proba ? "proba" : "demo";
  if (!build.subjects.includes(slug)) {
    throw new Error(
      `Siembra E2E — el sitio compilado no trae la materia «${slug}»: ${build.subjects.join(", ") || "(ninguna)"}`,
    );
  }

  const dir = path.join(SITE_SUBJECTS_DIR, slug);
  const subject = readJson<SiteSubjectLike>(path.join(dir, "subject.json"));
  const bodies = readJson<SitePagesLike>(path.join(dir, "pages.json"));
  const tools = readJson<SiteToolsLike>(path.join(dir, "tools.json"));
  const config = subject.config;

  // --- bundle principal ------------------------------------------------------
  /* El de las figuras: es el que montan `tools.spec.ts` y `figures.spec.ts`. Con
     Proba hay dos bundles (proba-tools y proba-exercises) y el orden del archivo
     no es el que interesa. */
  const main = tools.tools.find((t) => t.manifest.figures) ?? tools.tools[0];
  if (!main) throw new Error(`Siembra E2E — la materia «${slug}» no compiló ningún bundle de herramientas`);
  const view = main.manifest.views[0];
  /* Sin vistas, `/m/<materia>/t/<vista>` no tendría nada que montar y
     `tools.spec.ts` probaría el estado «Próximamente» creyendo que prueba una
     herramienta. */
  if (!view) throw new Error(`Siembra E2E — el bundle «${main.manifest.id}» no declara ninguna vista`);

  const bundleDir = path.join(dir, "tools", main.manifest.id);
  const seedTools: SeedTools = {
    id: main.manifest.id,
    title: main.manifest.title,
    views: main.manifest.views.map((v) => ({ id: v.id, label: v.label })),
    view: { id: view.id, label: view.label },
    allViews: tools.tools.flatMap((t) => t.manifest.views.map((v) => v.id)),
    figures: main.manifest.figures,
    files: bundleFiles(bundleDir).length,
  };

  // --- material de estudio ---------------------------------------------------
  const authored = subject.study.decks.filter((d) => d.source !== "auto");
  const shortest = [...authored].sort((a, b) => a.cards.length - b.cards.length)[0];
  const quiz = subject.study.quizzes[0];
  /* Con la materia real el material tiene que llegar: si dejara de llegar, las
     specs de estudio no fallarían, probarían estados vacíos y pasarían. */
  if (proba && (authored.length === 0 || !quiz || !subject.study.plan)) {
    throw new Error(
      "Siembra E2E — la materia real compiló sin material de estudio (mazos, quiz o plan). " +
        "Revise `wiki.study` del config y `subjects/proba/estudio/`.",
    );
  }
  const study: SeedStudy = {
    deck: shortest ? { id: shortest.id, title: shortest.title, cards: shortest.cards.length } : null,
    quiz: quiz ? { id: quiz.id, title: quiz.title, questions: quiz.questions.length } : null,
    autoDecks: await autoDeckCount(subject),
    authoredDecks: authored.length,
    hasPlan: subject.study.plan !== null,
    kits: subject.study.kits.length,
  };

  // --- landing inicial -------------------------------------------------------
  const semester = config.semester ?? "Sin cuatrimestre";
  const placeholder = SEED_PLACEHOLDER;
  const catalog = readJson<{ subjects: Array<{ slug: string; semester?: string }> }>(
    path.join(SITE_SUBJECTS_DIR, "index.json"),
  );
  const placements: Record<string, { semester: string; position: number }> = {};
  const perSemester = new Map<string, number>();
  for (const entry of catalog.subjects) {
    const label = entry.semester ?? "Sin cuatrimestre";
    const position = perSemester.get(label) ?? 0;
    perSemester.set(label, position + 1);
    placements[entry.slug] = { semester: label, position };
  }
  placements[placeholder.slug] = { semester: placeholder.semester, position: 0 };

  const { semester: _placeholderSemester, ...placeholderDoc } = placeholder;

  // --- páginas de referencia -------------------------------------------------
  const references = proba
    ? {
        readerPage: { slug: "distribucion-normal", title: "Distribución Normal", division: "4" },
        catalogDivision: "4",
        filterPage: {
          slug: "desigualdad-de-chebyshev",
          title: "Desigualdades de Markov y de Chebyshev",
          term: "chebyshev",
          division: "7",
        },
        palette: { term: "normal", expected: "Distribución Normal" },
        figure: "tecnica-derivadas-parciales",
      }
    : {
        readerPage: { slug: "demo-conceptos-basicos", title: "Conceptos básicos", division: "1" },
        catalogDivision: "1",
        filterPage: {
          slug: "demo-tecnica",
          title: "Técnica de resolución",
          term: "técnica",
          division: "2",
        },
        palette: { term: "formula", expected: "Fórmula clave" },
        figure: "demo-repaso",
      };

  const contentTypes = new Set(
    config.pageTypes.filter((t) => t.countsAsContent !== false).map((t) => t.key),
  );

  const manifest: SeedManifest = {
    mode: build.mode,
    subject: {
      slug: config.slug,
      name: config.name,
      code: config.code,
      institution: config.institution,
      semester,
      divisionPlural: config.division.plural.toUpperCase(),
      divisionsDeclared: config.divisions.length,
      divisionKeys: config.divisions.map((d) => d.key),
      divisionsVisible: visibleDivisions(subject),
      standalone: (subject.config.wiki?.standalone ?? []).filter((slug) => subject.pages.some((p) => p.slug === slug)),
      pages: subject.pages.length,
      contentPages: subject.pages.filter((p) => contentTypes.has(p.type)).length,
    },
    readerPage: references.readerPage,
    catalogDivision: references.catalogDivision,
    filterPage: references.filterPage,
    palette: references.palette,
    tools: seedTools,
    railTools: config.rail
      .flatMap((group) => group.items ?? [])
      .filter((item) => item.kind === "tool")
      .map((item) => ({ id: item.id, label: item.label, target: item.target })),
    railSlots: config.rail.map((group) => group.label),
    figurePage: figurePageOf(subject, bodies, references.figure, bundleDir, main.manifest.id),
    placeholder,
    landing: {
      placements,
      semesters: [...new Set([...perSemester.keys(), placeholder.semester])],
      hidden: [],
      placeholders: [placeholderDoc],
    },
    study,
  };

  writeFileSync(SEED_FILE, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  console.log(
    `[e2e] siembra: modo ${manifest.mode} → ${manifest.subject.slug} con ${manifest.subject.pages} páginas ` +
      `(${manifest.subject.contentPages} de contenido) y ${manifest.subject.divisionsVisible} divisiones visibles.`,
  );
  console.log(
    `[e2e] material de estudio: ${study.authoredDecks} mazo(s) autoral(es) + ${study.autoDecks} automático(s), ` +
      `${study.quiz ? `quiz «${study.quiz.id}» de ${study.quiz.questions} preguntas` : "sin quiz"}, ` +
      `${study.hasPlan ? "plan" : "sin plan"}, ${study.kits} kit(s).`,
  );
  console.log(
    `[e2e] herramientas: ${tools.tools.length} bundle(s); principal ${seedTools.id} con ${seedTools.files} archivos · ` +
      `vistas: ${seedTools.views.map((v) => v.id).join(", ")} · ` +
      `página con figura: ${manifest.figurePage.slug} (${manifest.figurePage.fig}).`,
  );
  if (subject.warnings.length) {
    console.log(`[e2e] avisos del compilador: ${subject.warnings.length}`);
  }
}
