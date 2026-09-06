/**
 * «Todo el wiki»: el catálogo completo de la materia, agrupado por división y
 * filtrable por división, tipo y texto. Los filtros viven en la URL (`?d=&t=&q=`)
 * para que un recorte se pueda compartir o volver a abrir.
 */
import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { plural, routes, type PageMeta } from "@sinapsis/contract";
import { Icon, UiIcon } from "@/components/platform";
import { MathText } from "../components/MathText";
import { useSubjectCtx } from "../context";
import { useStudyState } from "../useSubject";
import type { DivisionNode } from "../model";
import css from "./CatalogView.module.css";

const LIST_SEP = ",";

function parseList(value: string | null): string[] {
  return value ? value.split(LIST_SEP).filter(Boolean) : [];
}

export function CatalogView() {
  const { slug, model } = useSubjectCtx();
  const { bookmarks } = useStudyState(slug);
  const [params, setParams] = useSearchParams();

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

  const needle = q.trim().toLowerCase();
  const filtered = useMemo(() => {
    return model.pages.filter((page) => {
      if (divisions.length && !divisions.includes(model.divisionOf(page))) return false;
      if (types.length && !types.includes(page.type)) return false;
      if (needle && !`${page.title} ${page.summary}`.toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [model, divisions, types, needle]);

  const grouped = useMemo(() => {
    const out: Array<{ division: DivisionNode; pages: PageMeta[] }> = [];
    for (const division of model.visibleDivisions) {
      const pages = filtered.filter((p) => model.divisionOf(p) === division.key);
      if (pages.length) out.push({ division, pages });
    }
    return out;
  }, [filtered, model]);

  const typeCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const page of model.pages) counts.set(page.type, (counts.get(page.type) ?? 0) + 1);
    return counts;
  }, [model]);

  const contentTotal = model.allSequence.length;
  const entries = model.pages.length;

  return (
    <div className={css.view}>
      <header className={css.head}>
        <span className={css.ribbon}>— CATÁLOGO —</span>
        <h1 className={css.h1}>Todo el wiki</h1>
        {/* «Entradas», no «páginas»: acá se listan también las fuentes, y
            «página» tiene que significar lo mismo que en el progreso. */}
        <p className={css.sub}>
          {entries} {plural(entries, "entrada", "entradas")} ({contentTotal} de contenido · {model.sourcesCount}{" "}
          {plural(model.sourcesCount, "fuente", "fuentes")})
        </p>
      </header>

      <div className={css.filters}>
        <label className={css.searchField}>
          <UiIcon name="search" size={15} />
          <input
            type="search"
            className={css.searchInput}
            value={q}
            placeholder="Buscar por título o resumen…"
            aria-label="Filtrar el catálogo"
            onChange={(e) => update("q", e.target.value)}
          />
        </label>

        <div className={css.chipRow} role="group" aria-label={model.config.division.plural}>
          <span className={css.chipLabel}>{model.config.division.plural.toUpperCase()}</span>
          <button
            type="button"
            className={css.chip}
            data-on={divisions.length === 0 ? "true" : undefined}
            onClick={() => update("d", [])}
          >
            Todas
          </button>
          {model.visibleDivisions.map((division) => (
            <button
              key={division.key}
              type="button"
              className={css.chip}
              data-on={divisions.includes(division.key) ? "true" : undefined}
              style={{ ["--ucol" as string]: division.color }}
              onClick={() => toggleIn("d", divisions, division.key)}
            >
              <span className={css.chipDot} aria-hidden="true" />
              {division.short}
              <span className={css.chipCount}>{model.pagesByDivision(division.key).length}</span>
            </button>
          ))}
        </div>

        <div className={css.chipRow} role="group" aria-label="Tipos de página">
          <span className={css.chipLabel}>TIPO</span>
          <button
            type="button"
            className={css.chip}
            data-on={types.length === 0 ? "true" : undefined}
            onClick={() => update("t", [])}
          >
            Todos
          </button>
          {model.config.pageTypes
            .filter((type) => typeCounts.get(type.key))
            .map((type) => (
              <button
                key={type.key}
                type="button"
                className={css.chip}
                data-on={types.includes(type.key) ? "true" : undefined}
                onClick={() => toggleIn("t", types, type.key)}
              >
                {type.plural}
                <span className={css.chipCount}>{typeCounts.get(type.key)}</span>
              </button>
            ))}
        </div>
      </div>

      <p className={css.resultCount}>
        {filtered.length} {plural(filtered.length, "entrada", "entradas")}
      </p>

      {grouped.map(({ division, pages }) => (
        <section key={division.key} className={css.group} style={{ ["--ucol" as string]: division.color }}>
          <div className={css.groupHead}>
            <span className={css.groupBar} aria-hidden="true" />
            <span className={css.groupChip}>{division.short}</span>
            <h2 className={css.groupTitle}>{division.name}</h2>
            <span className={css.groupCount}>{pages.length}</span>
          </div>
          <div className={css.grid}>
            {pages.map((page) => (
              <Link key={page.slug} className={css.card} to={routes.page(slug, page.slug)}>
                <span className={css.cardType}>{model.typeLabel(page.type).toUpperCase()}</span>
                <span className={css.cardTitle}>{page.title}</span>
                {page.summary ? <MathText className={css.cardSummary} text={page.summary} /> : null}
                <span className={css.cardMarks}>
                  {bookmarks.has(page.slug) ? (
                    <Icon name="star" size={13} className={css.cardStar} title="Favorita" />
                  ) : null}
                  {model.studied.has(page.slug) ? (
                    <UiIcon name="check" size={13} className={css.cardCheck} title="Estudiada" />
                  ) : null}
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {!grouped.length ? (
        <p className={css.empty}>
          Ninguna página coincide con el filtro.{" "}
          <button type="button" className={css.reset} onClick={() => setParams(new URLSearchParams(), { replace: true })}>
            Quitar los filtros
          </button>
        </p>
      ) : null}
    </div>
  );
}

export default CatalogView;
