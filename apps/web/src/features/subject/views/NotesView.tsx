/**
 * «Mis apuntes» (región «Lo mío»): todo lo escrito en la materia, del apunte más
 * reciente al más viejo, con un extracto y el enlace de vuelta al lector.
 *
 * El botón «Exportar markdown» arma el documento con `notesMarkdown` (puro y
 * probado) y lo descarga con un Blob: los apuntes son del usuario y tienen que
 * poder salir de la plataforma en el mismo formato en el que entró el wiki.
 */
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { plural, routes } from "@sinapsis/contract";
import { Icon, UiIcon } from "@/components/platform";
import { useSubjectCtx } from "../context";
import { ErrorCard } from "../components/States";
import { useDeleteNote, useStudyState } from "../useSubject";
import { notesFilename, notesMarkdown, sortNotes } from "./notesExport";
import css from "./mine.module.css";

/** Fecha legible del listado: «5 sep 2026 · 14:32». */
function stamp(value: string): string {
  const at = Date.parse(value);
  if (Number.isNaN(at)) return value;
  const date = new Date(at);
  return `${date.toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric" })} · ${date.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}`;
}

/** Primeras líneas del apunte, en una sola línea y sin marcado. */
function excerpt(body: string, max = 220): string {
  const flat = body
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_`>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return flat.length > max ? `${flat.slice(0, max).trimEnd()}…` : flat;
}

export function NotesView() {
  const { slug, model } = useSubjectCtx();
  const { query, state } = useStudyState(slug);
  const remove = useDeleteNote(slug);

  const notes = useMemo(() => sortNotes(state.notes).filter((n) => n.body.trim().length > 0), [state.notes]);

  const exportMarkdown = () => {
    const now = new Date().toISOString();
    const blob = new Blob([notesMarkdown(model, notes, now)], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = notesFilename(slug, now);
    document.body.appendChild(link);
    link.click();
    link.remove();
    /* El objeto vive hasta que el navegador termina la descarga: se libera en el
       siguiente turno, no en el mismo. */
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  if (query.isError) return <ErrorCard error={query.error} subject={slug} />;

  return (
    <div className={css.view}>
      <header className={css.headRow}>
        <div className={css.head}>
          <span className={css.ribbon}>— LO MÍO —</span>
          <h1 className={css.h1}>Mis apuntes</h1>
          <p className={css.sub}>
            {notes.length} {plural(notes.length, "apunte", "apuntes")} en {model.config.name}
          </p>
        </div>
        <button
          type="button"
          className={css.exportButton}
          onClick={exportMarkdown}
          disabled={!notes.length}
          title={notes.length ? "Descargar todos los apuntes en un .md" : "Todavía no hay apuntes que exportar"}
        >
          <UiIcon name="file" size={15} />
          Exportar markdown
        </button>
      </header>

      {!notes.length ? (
        <div className={css.empty}>
          <Icon name="notebook" size={26} className={css.emptyIcon} />
          <p className={css.emptyTitle}>Todavía no escribió ningún apunte</p>
          <p className={css.emptyText}>
            En el lector, la tarjeta <strong>APUNTES</strong> de la columna derecha guarda lo que escriba sobre esa
            página: la duda que quedó, el ejemplo que la explicó, el paso que siempre se olvida. Se guarda solo
            mientras escribe y se puede exportar entero desde acá.
          </p>
          <Link className={css.emptyAction} to={routes.wiki(slug)}>
            <Icon name="book" size={15} />
            Ir al catálogo del wiki
          </Link>
        </div>
      ) : null}

      <div className={css.notes}>
        {notes.map((note) => {
          const page = model.bySlug.get(note.page);
          const division = page ? model.division(model.divisionOf(page)) : undefined;
          return (
            <article
              key={note.page}
              className={css.note}
              style={division ? { ["--ucol" as string]: division.color } : undefined}
            >
              <header className={css.noteHead}>
                {division ? <span className={css.noteChip}>{division.short}</span> : null}
                <Link className={css.noteTitle} to={routes.page(slug, note.page)}>
                  {page?.title ?? note.page}
                </Link>
                <span className={css.noteDate}>{stamp(note.updatedAt)}</span>
              </header>
              <p className={css.noteBody}>{excerpt(note.body)}</p>
              <footer className={css.noteFoot}>
                <Link className={css.noteAction} to={routes.page(slug, note.page)}>
                  <UiIcon name="external" size={13} />
                  Abrir en el lector
                </Link>
                <button
                  type="button"
                  className={css.noteAction}
                  onClick={() => remove.mutate({ page: note.page })}
                  aria-label={`Borrar el apunte de «${page?.title ?? note.page}»`}
                >
                  <UiIcon name="close" size={13} />
                  Borrar
                </button>
              </footer>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default NotesView;
