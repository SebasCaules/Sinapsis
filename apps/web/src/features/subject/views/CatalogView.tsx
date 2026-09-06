/**
 * «Todo el wiki»: el catálogo completo de la materia, agrupado por división y,
 * dentro de cada división, por tipo de página. Filtrable por división, tipo y
 * texto; los filtros viven en la URL (`?d=&t=&q=`) para que un recorte se pueda
 * compartir o volver a abrir.
 *
 * Tres invariantes que vienen del baseline (`estudio/reader.js`) y que esta
 * vista tiene que sostener:
 *
 *  1. La búsqueda mira TÍTULO + TAGS + SLUG (no el resumen) y exige que TODOS
 *     los términos de la consulta estén presentes. Buscar en el resumen crudo
 *     devuelve ruido de LaTeX («frac», «\») y buscar una sola subcadena literal
 *     deja afuera «poisson proceso».
 *  2. Los contadores de cada fila de chips se recalculan contra LOS OTROS
 *     filtros: la fila de divisiones se cuenta con el tipo y el texto puestos, y
 *     la de tipos con la división y el texto. Un chip que promete «3» y lleva a
 *     «Sin resultados» es un callejón sin salida: el que queda en cero se apaga
 *     y se deshabilita, salvo el que está activo (hay que poder desmarcarlo).
 *  3. Las páginas reservadas del wiki (índice y registro, `PAGE_TYPE_META`) no
 *     son catálogo: no se listan ni cuentan en ningún número de esta vista.
 */
import { useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PAGE_TYPE_META, plural, routes, type PageMeta } from "@sinapsis/contract";
import { Icon, UiIcon } from "@/components/platform";
import { MathText } from "../components/MathText";
import { useSubjectCtx } from "../context";
import { useStudyState } from "../useSubject";
import type { DivisionNode } from "../model";
import css from "./CatalogView.module.css";

const LIST_SEP = ",";

export function parseList(value: string | null): string[] {
  return value ? value.split(LIST_SEP).filter(Boolean) : [];
}

/* El haystack de una página no cambia mientras viva el modelo: se memoriza por
   objeto (el baseline lo guardaba en `p.__hay`; acá, sin ensuciar el dato). */
const hayCache = new WeakMap<PageMeta, string>();

/** Texto sobre el que busca el catálogo: título + tags + slug, en minúsculas. */
export function haystack(page: PageMeta): string {
  let hay = hayCache.get(page);
  if (hay === undefined) {
    hay = `${page.title} ${page.tags.join(" ")} ${page.slug}`.toLowerCase();
    hayCache.set(page, hay);
  }
  return hay;
}

/**
 * ¿La página pasa la consulta? `needle` llega ya recortada y en minúsculas; se
 * parte por espacios y se exigen TODOS los términos (AND), como el baseline.
 */
export function matchesQuery(page: PageMeta, needle: string): boolean {
  if (!needle) return true;
  return needle.split(/\s+/).every((term) => haystack(page).includes(term));
}

export interface CatalogFilters {
  divisions: readonly string[];
  types: readonly string[];
  /** Consulta ya recortada y en minúsculas. */
  needle: string;
}

export interface ChipCounts {
  byDivision: Map<string, number>;
  byType: Map<string, number>;
}

/**
 * Contadores de las dos filas de chips. Cada fila se cuenta sobre el pool que
 * dejan LOS OTROS filtros, así que el número de un chip es exactamente cuántas
 * entradas se verían al pulsarlo (invariante 2 del encabezado).
 */
export function chipCounts(
  pages: readonly PageMeta[],
  divisionOf: (page: PageMeta) => string,
  filters: CatalogFilters,
): ChipCounts {
  const byDivision = new Map<string, number>();
  const byType = new Map<string, number>();
  for (const page of pages) {
    if (!matchesQuery(page, filters.needle)) continue;
    const key = divisionOf(page);
    if (!filters.types.length || filters.types.includes(page.type)) {
      byDivision.set(key, (byDivision.get(key) ?? 0) + 1);
    }
    if (!filters.divisions.length || filters.divisions.includes(key)) {
      byType.set(page.type, (byType.get(page.type) ?? 0) + 1);
    }
  }
  return { byDivision, byType };
}

export interface CatalogTypeBlock {
  key: string;
  /** Rótulo plural del tipo («Conceptos»), o la clave si el config no lo declara. */
  label: string;
  pages: PageMeta[];
}

/**
 * Reparte las páginas por tipo, en el orden declarado por la materia y con los
 * tipos no declarados al final (para que ninguna página se pierda). Dentro de
 * cada bloque el orden es alfabético en español, como el baseline: en un
 * catálogo se busca por nombre, no se lee en secuencia.
 */
export function typeBlocks(
  pages: readonly PageMeta[],
  order: readonly string[],
  label: (key: string) => string,
): CatalogTypeBlock[] {
  const buckets = new Map<string, PageMeta[]>();
  for (const page of pages) {
    const list = buckets.get(page.type);
    if (list) list.push(page);
    else buckets.set(page.type, [page]);
  }
  const declared = order.filter((key) => buckets.has(key));
  const rest = [...buckets.keys()].filter((key) => !order.includes(key));
  return [...declared, ...rest].map((key) => ({
    key,
    label: label(key),
    pages: (buckets.get(key) ?? []).slice().sort((a, b) => a.title.localeCompare(b.title, "es")),
  }));
}

export function CatalogView() {
  const { slug, model } = useSubjectCtx();
  const { bookmarks } = useStudyState(slug);
  const [params, setParams] = useSearchParams();
  const searchRef = useRef<HTMLInputElement>(null);

  const q = params.get("q") ?? "";
  /* `parseList` devuelve un array nuevo en cada render: memorizarlo a partir de
     la cadena cruda evita que el filtrado entero se rehaga sin motivo. */
  const divisions = useMemo(() => parseList(params.get("d")), [params]);
  const types = useMemo(() => parseList(params.get("t")), [params]);

  const update = (key: string, value: string[] | string) => {
    const next = new URLSearchParams(params);
    const flat = Array.isArray(value) ? value.join(LIST_SEP) : value;
    if (flat) next.set(key, flat);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const toggleIn = (key: string, list: string[], value: string) =>
    update(key, list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  /* El índice y el registro del wiki son andamiaje de la materia, no material:
     el baseline los saca del catálogo (`CONTENT = PAGES.filter(folder !== meta)`)
     y con ellos afuera la suma de los chips vuelve a cerrar con el encabezado. */
  const catalogPages = useMemo(() => model.pages.filter((p) => p.type !== PAGE_TYPE_META), [model]);

  /** Rótulo plural de un tipo: es el que llevan los chips y los subgrupos. */
  const typePlural = useMemo(() => {
    const map = new Map(model.config.pageTypes.map((t) => [t.key, t.plural]));
    return (key: string) => map.get(key) ?? key;
  }, [model]);

  const typeOrder = useMemo(() => model.config.pageTypes.map((t) => t.key), [model]);

  /** Divisiones con al menos una entrada de catálogo, en el orden del índice. */
  const allGroups = useMemo(() => {
    const present = new Set(catalogPages.map((p) => model.divisionOf(p)));
    return model.visibleDivisions.filter((d) => present.has(d.key));
  }, [catalogPages, model]);

  /** Tipos presentes en el catálogo, en el orden declarado por la materia. */
  const allTypes = useMemo(
    () => typeBlocks(catalogPages, typeOrder, typePlural).map(({ key, label }) => ({ key, label })),
    [catalogPages, typeOrder, typePlural],
  );

  const needle = q.trim().toLowerCase();
  const filters = useMemo<CatalogFilters>(() => ({ divisions, types, needle }), [divisions, types, needle]);

  const filtered = useMemo(() => {
    return catalogPages.filter((page) => {
      if (divisions.length && !divisions.includes(model.divisionOf(page))) return false;
      if (types.length && !types.includes(page.type)) return false;
      return matchesQuery(page, needle);
    });
  }, [catalogPages, model, divisions, types, needle]);

  const counts = useMemo(
    () => chipCounts(catalogPages, model.divisionOf, filters),
    [catalogPages, model, filters],
  );

  /** Cada división visible con sus bloques por tipo, ya filtrados. */
  const grouped = useMemo(() => {
    const out: Array<{ division: DivisionNode; total: number; blocks: CatalogTypeBlock[] }> = [];
    for (const division of allGroups) {
      const pages = filtered.filter((p) => model.divisionOf(p) === division.key);
      if (!pages.length) continue;
      out.push({ division, total: pages.length, blocks: typeBlocks(pages, typeOrder, typePlural) });
    }
    return out;
  }, [allGroups, filtered, model, typeOrder, typePlural]);

  const entries = catalogPages.length;
  const contentTotal = useMemo(() => catalogPages.filter((p) => model.isContent(p)).length, [catalogPages, model]);
  const sources = entries - contentTotal;
  const divisionWord = plural(
    allGroups.length,
    model.config.division.singular,
    model.config.division.plural,
  ).toLowerCase();

  const clearAll = () => setParams(new URLSearchParams(), { replace: true });

  return (
    <div className={css.view}>
      <header className={css.head}>
        <span className={css.ribbon}>— CATÁLOGO —</span>
        <h1 className={css.h1}>Todo el wiki</h1>
        {/* «Entradas», no «páginas»: acá se listan también las fuentes, y
            «página» tiene que significar lo mismo que en el progreso. El número
            de divisiones va al frente, como en el baseline: dimensiona la
            materia antes de bajar por la lista. */}
        <p className={css.sub}>
          {entries} {plural(entries, "entrada", "entradas")} · {allGroups.length} {divisionWord} ({contentTotal} de
          contenido · {sources} {plural(sources, "fuente", "fuentes")})
        </p>
      </header>

      <div className={css.filters}>
        <div className={css.searchWrap}>
          <label className={css.searchField}>
            <UiIcon name="search" size={15} />
            <input
              ref={searchRef}
              type="search"
              className={css.searchInput}
              value={q}
              placeholder="Buscar por título, tag o slug…"
              aria-label="Filtrar el catálogo"
              onChange={(e) => update("q", e.target.value)}
            />
          </label>
          {/* La × nativa de `input[type=search]` solo existe en Chromium, no se
              puede tematizar y deja el foco donde caiga: se oculta por CSS y el
              control propio devuelve el foco al campo. */}
          {q ? (
            <button
              type="button"
              className={css.clear}
              aria-label="Limpiar la búsqueda"
              onClick={() => {
                update("q", "");
                searchRef.current?.focus();
              }}
            >
              <UiIcon name="close" size={14} />
            </button>
          ) : null}
        </div>

        <div className={css.chipRow} role="group" aria-label={model.config.division.plural}>
          <span className={css.chipLabel}>{model.config.division.plural.toUpperCase()}</span>
          <button
            type="button"
            className={css.chip}
            data-on={divisions.length === 0 ? "true" : undefined}
            aria-pressed={divisions.length === 0}
            onClick={() => update("d", [])}
          >
            Todas
          </button>
          {allGroups.map((division) => {
            const n = counts.byDivision.get(division.key) ?? 0;
            const on = divisions.includes(division.key);
            return (
              <button
                key={division.key}
                type="button"
                className={css.chip}
                data-on={on ? "true" : undefined}
                data-empty={!n && !on ? "true" : undefined}
                aria-pressed={on}
                disabled={!n && !on}
                style={{ ["--ucol" as string]: division.color }}
                onClick={() => toggleIn("d", divisions, division.key)}
              >
                <span className={css.chipDot} aria-hidden="true" />
                {division.short}
                <span className={css.chipCount}>{n}</span>
              </button>
            );
          })}
        </div>

        <div className={css.chipRow} role="group" aria-label="Tipos de página">
          <span className={css.chipLabel}>TIPO</span>
          <button
            type="button"
            className={css.chip}
            data-on={types.length === 0 ? "true" : undefined}
            aria-pressed={types.length === 0}
            onClick={() => update("t", [])}
          >
            Todos
          </button>
          {allTypes.map((type) => {
            const n = counts.byType.get(type.key) ?? 0;
            const on = types.includes(type.key);
            return (
              <button
                key={type.key}
                type="button"
                className={css.chip}
                data-on={on ? "true" : undefined}
                data-empty={!n && !on ? "true" : undefined}
                aria-pressed={on}
                disabled={!n && !on}
                onClick={() => toggleIn("t", types, type.key)}
              >
                {type.label}
                <span className={css.chipCount}>{n}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Con cero resultados el contador no aporta nada («0 entradas» arriba de
          «Sin resultados» dice dos veces lo mismo): solo se dibuja si hay algo. */}
      {filtered.length ? (
        <p className={css.resultCount}>
          {filtered.length} {plural(filtered.length, "entrada", "entradas")}
        </p>
      ) : null}

      {grouped.map(({ division, total, blocks }) => (
        <section key={division.key} className={css.group} style={{ ["--ucol" as string]: division.color }}>
          <div className={css.groupHead}>
            <span className={css.groupBar} aria-hidden="true" />
            <h2 className={css.groupTitle}>
              <Link className={css.groupLink} to={routes.division(slug, division.key)}>
                <span className={css.groupChip}>{division.short}</span>
                <span className={css.groupName}>{division.name}</span>
              </Link>
            </h2>
            <span className={css.groupCount}>{total}</span>
          </div>

          {blocks.map((block) => (
            <div key={block.key} className={css.typeBlock}>
              <h3 className={css.typeLabel}>
                {block.label} <span className={css.typeCount}>{block.pages.length}</span>
              </h3>
              <div className={css.grid}>
                {block.pages.map((page) => (
                  <Link key={page.slug} className={css.card} to={routes.page(slug, page.slug)}>
                    <span className={css.cardTitle}>{page.title}</span>
                    {/* Línea de meta del baseline: «U3 · Distribución · ✓ leída».
                        El estado va con su palabra, no solo con un punto de color. */}
                    <span className={css.cardMeta}>
                      {division.short} · {model.typeLabel(page.type)}
                      {model.studied.has(page.slug) ? (
                        <>
                          {" · "}
                          <span className={css.markRead}>
                            <UiIcon name="check" size={11} className={css.cardCheck} aria-hidden="true" />
                            leída
                          </span>
                        </>
                      ) : null}
                      {bookmarks.has(page.slug) ? (
                        <>
                          {" · "}
                          <span className={css.markFav}>
                            <Icon name="star" size={11} className={css.cardStar} aria-hidden="true" />
                            favorita
                          </span>
                        </>
                      ) : null}
                    </span>
                    {page.summary ? <MathText className={css.cardSummary} text={page.summary} /> : null}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>
      ))}

      {!grouped.length ? (
        <div className={css.empty}>
          <UiIcon name="search" size={40} aria-hidden="true" />
          <p className={css.emptyTitle}>Sin resultados.</p>
          <p className={css.emptyHint}>Pruebe con otra palabra o quite los filtros.</p>
          <button type="button" className={css.reset} onClick={clearAll}>
            Quitar los filtros
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default CatalogView;
