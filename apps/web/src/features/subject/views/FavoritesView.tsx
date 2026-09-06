/**
 * «Favoritos» (región «Lo mío»): las páginas marcadas con ★, agrupadas por
 * división y en el mismo orden del temario. No es una lista de lo último
 * marcado: es un recorte del programa, así que respeta la secuencia pedagógica.
 *
 * Cada fila dice si la página ya está leída (como el `miniCard` del baseline):
 * lo que uno se guardó y todavía no leyó se tiene que ver de un vistazo.
 *
 * «Quitar» es destructivo de un clic, así que deja una tira con «Deshacer»: el
 * aviso efímero de la plataforma no admite acciones, y perder un favorito por
 * un clic de más obligaba a volver a abrir la página en el lector.
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { plural, routes } from "@sinapsis/contract";
import { Icon, UiIcon } from "@/components/platform";
import { MathText } from "../components/MathText";
import { useSubjectCtx } from "../context";
import { useStudyState, useToggleBookmark } from "../useSubject";
import { ErrorCard, WideSkeleton } from "../components/States";
import css from "./mine.module.css";

export function FavoritesView() {
  const { slug, model } = useSubjectCtx();
  const { query, bookmarks, state } = useStudyState(slug);
  const toggle = useToggleBookmark(slug);
  /** Lo último que se quitó, para poder devolverlo sin salir de la vista. */
  const [undo, setUndo] = useState<{ page: string; title: string } | null>(null);

  if (query.isError) return <ErrorCard error={query.error} subject={slug} />;
  /* Sin esto, mientras carga el estado de estudio la vista dibujaba el «todavía
     no guardó ninguna página» y después lo reemplazaba por la lista (U14). */
  if (query.isPending) return <WideSkeleton />;

  /* El orden lo pone el modelo (divisiones del temario + secuencia dentro de
     cada una); los favoritos solo lo filtran. */
  const groups = model.visibleDivisions
    .map((division) => ({
      division,
      pages: model.pagesByDivision(division.key).filter((p) => bookmarks.has(p.slug)),
    }))
    .filter((g) => g.pages.length > 0);

  const total = groups.reduce((n, g) => n + g.pages.length, 0);
  const noteCount = state.notes.filter((n) => n.body.trim().length > 0).length;

  return (
    <div className={css.view}>
      <header className={css.head}>
        <span className={css.ribbon}>— LO MÍO —</span>
        <h1 className={css.h1}>Favoritos</h1>
        {/* «en favoritos», no «guardadas»: el mismo nombre que usan el botón
            del lector, el rail y el bloque del inicio (U30). */}
        <p className={css.sub}>
          {total} {plural(total, "página en favoritos", "páginas en favoritos")}
        </p>
      </header>

      {undo ? (
        <div className={css.undoBar} role="status">
          <span className={css.undoText}>Se quitó «{undo.title}» de favoritos.</span>
          <button
            type="button"
            className={css.undoAction}
            onClick={() => {
              toggle.mutate({ page: undo.page, on: true });
              setUndo(null);
            }}
          >
            Deshacer
          </button>
          <button
            type="button"
            className={css.undoDismiss}
            onClick={() => setUndo(null)}
            aria-label="Descartar el aviso"
          >
            <UiIcon name="close" size={13} />
          </button>
        </div>
      ) : null}

      {!total ? (
        <div className={css.empty}>
          <Icon name="star" size={26} className={css.emptyIcon} />
          <p className={css.emptyTitle}>Todavía no guardó ninguna página</p>
          <p className={css.emptyText}>
            En el lector, el botón <strong>A favoritos</strong> marca la página. Sirve para armarse un atajo a lo que
            se vuelve a consultar todo el tiempo —las tablas, los formularios, el teorema del que uno nunca se
            acuerda— sin tener que buscarlo cada vez.
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
                  <span className={css.rowMeta}>
                    <span className={css.rowType}>{model.typeLabel(page.type).toUpperCase()}</span>
                    {model.studied.has(page.slug) ? (
                      <span className={css.rowRead}>
                        <UiIcon name="check" size={11} aria-hidden="true" />
                        leída
                      </span>
                    ) : null}
                  </span>
                  <span className={css.rowTitle}>{page.title}</span>
                  {page.summary ? <MathText className={css.rowSummary} text={page.summary} /> : null}
                </Link>
                <button
                  type="button"
                  className={css.rowAction}
                  onClick={() => {
                    toggle.mutate({ page: page.slug, on: false });
                    setUndo({ page: page.slug, title: page.title });
                  }}
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

      {/* El puente entre las dos mitades de «Lo mío» (baseline: el chip
          «Apuntes en N páginas» al pie de Favoritos). */}
      {noteCount ? (
        <p className={css.crossLink}>
          <Link className={css.emptyAction} to={routes.notes(slug)}>
            <Icon name="notebook" size={15} />
            Apuntes en {noteCount} {plural(noteCount, "página", "páginas")}
          </Link>
        </p>
      ) : null}
    </div>
  );
}

export default FavoritesView;
