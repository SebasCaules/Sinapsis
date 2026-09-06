/**
 * «Favoritos» (región «Lo mío»): las páginas marcadas con ★, agrupadas por
 * división y en el mismo orden del temario. No es una lista de lo último
 * marcado: es un recorte del programa, así que respeta la secuencia pedagógica.
 */
import { Link } from "react-router-dom";
import { plural, routes } from "@sinapsis/contract";
import { Icon, UiIcon } from "@/components/platform";
import { MathText } from "../components/MathText";
import { useSubjectCtx } from "../context";
import { useStudyState, useToggleBookmark } from "../useSubject";
import { ErrorCard } from "../components/States";
import css from "./mine.module.css";

export function FavoritesView() {
  const { slug, model } = useSubjectCtx();
  const { query, bookmarks } = useStudyState(slug);
  const toggle = useToggleBookmark(slug);

  if (query.isError) return <ErrorCard error={query.error} subject={slug} />;

  /* El orden lo pone el modelo (divisiones del temario + secuencia dentro de
     cada una); los favoritos solo lo filtran. */
  const groups = model.visibleDivisions
    .map((division) => ({
      division,
      pages: model.pagesByDivision(division.key).filter((p) => bookmarks.has(p.slug)),
    }))
    .filter((g) => g.pages.length > 0);

  const total = groups.reduce((n, g) => n + g.pages.length, 0);

  return (
    <div className={css.view}>
      <header className={css.head}>
        <span className={css.ribbon}>— LO MÍO —</span>
        <h1 className={css.h1}>Favoritos</h1>
        <p className={css.sub}>
          {total} {plural(total, "página guardada", "páginas guardadas")}
        </p>
      </header>

      {!total ? (
        <div className={css.empty}>
          <Icon name="star" size={26} className={css.emptyIcon} />
          <p className={css.emptyTitle}>Todavía no guardó ninguna página</p>
          <p className={css.emptyText}>
            En el lector, el botón <strong>Guardar</strong> marca la página como favorita. Sirve para armarse un
            atajo a lo que se vuelve a consultar todo el tiempo —las tablas, los formularios, el teorema del que
            uno nunca se acuerda— sin tener que buscarlo cada vez.
          </p>
          <Link className={css.emptyAction} to={routes.wiki(slug)}>
            <Icon name="book" size={15} />
            Ir al catálogo del wiki
          </Link>
        </div>
      ) : null}

      {groups.map(({ division, pages }) => (
        <section key={division.key} className={css.group} style={{ ["--ucol" as string]: division.color }}>
          <div className={css.groupHead}>
            <span className={css.groupBar} aria-hidden="true" />
            <span className={css.groupChip}>{division.short}</span>
            <h2 className={css.groupTitle}>{division.name}</h2>
            <span className={css.groupCount}>{pages.length}</span>
          </div>

          <div className={css.rows}>
            {pages.map((page) => (
              <div key={page.slug} className={css.row}>
                <Link className={css.rowMain} to={routes.page(slug, page.slug)}>
                  <span className={css.rowType}>{model.typeLabel(page.type).toUpperCase()}</span>
                  <span className={css.rowTitle}>{page.title}</span>
                  {page.summary ? <MathText className={css.rowSummary} text={page.summary} /> : null}
                </Link>
                <button
                  type="button"
                  className={css.rowAction}
                  onClick={() => toggle.mutate({ page: page.slug, on: false })}
                  aria-label={`Quitar «${page.title}» de favoritos`}
                  title="Quitar de favoritos"
                >
                  <UiIcon name="close" size={13} />
                  Quitar
                </button>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default FavoritesView;
