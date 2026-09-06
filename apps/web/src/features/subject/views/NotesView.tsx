/**
 * «Mis apuntes» (región «Lo mío»): el cuaderno de trabajo de la materia. No es
 * un listado de solo lectura: acá se relee lo escrito (compuesto con el mismo
 * motor markdown del lector, con fórmulas y wikilinks vivos), se busca dentro de
 * los apuntes, se anota lo que no pertenece a ninguna página —el «Borrador
 * general»— y se saca todo de la plataforma en markdown.
 *
 * El cuerpo del apunte NUNCA se reescribe para mostrarlo: el extracto «sin
 * marcado» borraba los guiones bajos de LaTeX (`x_i` salía «xi»). Lo que se ve
 * es lo que el usuario escribió, compuesto.
 *
 * El borrador general se guarda HOY en `localStorage`: el API exige que el
 * apunte cuelgue de una página existente del wiki (`requirePage`), así que no
 * hay dónde poner una nota suelta de la materia. En el reporte queda el cambio
 * exacto para promoverlo al servidor.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { plural, routes, type Note } from "@sinapsis/contract";
import { Dialog, Icon, UiIcon, useToast } from "@/components/platform";
import { useSubjectCtx } from "../context";
import { ErrorCard, WideSkeleton } from "../components/States";
import { Markdown } from "../markdown/Markdown";
import { useDeleteNote, useStudyState } from "../useSubject";
import {
  fold,
  noteFilename,
  noteMarkdown,
  noteMatches,
  notesFilename,
  notesMarkdown,
  SCRATCH_HEADING,
  sortNotes,
} from "./notesExport";
import css from "./mine.module.css";

/** Rebote del autoguardado del borrador, el mismo del baseline. */
const SCRATCH_DEBOUNCE = 400;
/** Cuánto dura el rótulo «Guardado» del borrador. */
const SAVED_MS = 1200;
/**
 * A partir de acá la tarjeta recorta el apunte y ofrece «Ver el apunte
 * completo». Se mide sobre el texto ORIGINAL: no se recorta el texto, se recorta
 * la caja.
 */
const LONG_CHARS = 480;
const LONG_LINES = 10;

/** Clave del borrador general de la materia (ver la nota de cabecera). */
const scratchKey = (slug: string) => `sinapsis.${slug}.scratch`;

function readScratch(slug: string): string {
  try {
    return window.localStorage.getItem(scratchKey(slug)) ?? "";
  } catch {
    return "";
  }
}

function writeScratch(slug: string, value: string): void {
  try {
    if (value) window.localStorage.setItem(scratchKey(slug), value);
    else window.localStorage.removeItem(scratchKey(slug));
  } catch {
    /* Modo privado o almacenamiento lleno: el borrador vive en memoria. */
  }
}

/** Fecha legible del listado: «5 sep 2026 · 14:32». */
function stamp(value: string): string {
  const at = Date.parse(value);
  if (Number.isNaN(at)) return value;
  const date = new Date(at);
  return `${date.toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric" })} · ${date.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}`;
}

/** Descarga un texto como archivo. Devuelve false si el navegador no dejó. */
function download(filename: string, text: string): boolean {
  try {
    const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    /* Un macrotick no alcanza: hay navegadores que resuelven la descarga de
       forma asíncrona y el archivo baja vacío. El baseline espera 1 s. */
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  } catch {
    return false;
  }
}

export function NotesView() {
  const { slug, model } = useSubjectCtx();
  const { query, state } = useStudyState(slug);
  const remove = useDeleteNote(slug);
  const { toast } = useToast();

  const [q, setQ] = useState("");
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(() => new Set<string>());
  const [pendingDelete, setPendingDelete] = useState<Note | null>(null);

  /* --- borrador general --- */
  const [scratch, setScratch] = useState(() => readScratch(slug));
  const [scratchTab, setScratchTab] = useState<"edit" | "view">("edit");
  const [scratchSaved, setScratchSaved] = useState(false);
  const saveTimer = useRef(0);
  const savedTimer = useRef(0);

  /* Cambiar de materia cambia de borrador. */
  useEffect(() => {
    setScratch(readScratch(slug));
    setScratchTab("edit");
    return () => {
      window.clearTimeout(saveTimer.current);
      window.clearTimeout(savedTimer.current);
    };
  }, [slug]);

  const onScratch = (value: string) => {
    setScratch(value);
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      writeScratch(slug, value);
      setScratchSaved(true);
      window.clearTimeout(savedTimer.current);
      savedTimer.current = window.setTimeout(() => setScratchSaved(false), SAVED_MS);
    }, SCRATCH_DEBOUNCE);
  };

  /* `exists` tiene que ser ESTABLE: si cambia de identidad, el markdown de cada
     apunte se vuelve a parsear en cada render. */
  const exists = useCallback((page: string) => model.bySlug.has(page), [model]);

  const notes = useMemo(
    () => sortNotes(state.notes).filter((n) => n.body.trim().length > 0),
    [state.notes],
  );

  const needle = fold(q.trim());
  const shown = useMemo(
    () => (needle ? notes.filter((note) => noteMatches(model, note, needle)) : notes),
    [notes, needle, model],
  );

  const exportAll = () => {
    const now = new Date().toISOString();
    const ok = download(notesFilename(slug, now), notesMarkdown(model, notes, now, scratch));
    if (!ok) {
      toast("No se pudo exportar el archivo.", "bad");
      return;
    }
    toast(`Se ${notes.length === 1 ? "exportó" : "exportaron"} ${notes.length} ${plural(notes.length, "apunte", "apuntes")}.`, "good");
  };

  const exportOne = (note: Note) => {
    const ok = download(noteFilename(note.page, note.updatedAt), noteMarkdown(model, note));
    toast(ok ? "Apunte exportado." : "No se pudo exportar el archivo.", ok ? "good" : "bad");
  };

  const copyAll = () => {
    const md = notesMarkdown(model, notes, new Date().toISOString(), scratch);
    if (!navigator.clipboard?.writeText) {
      toast("El portapapeles no está disponible en este navegador.", "bad");
      return;
    }
    void navigator.clipboard.writeText(md).then(
      () => toast("Apuntes copiados al portapapeles.", "good"),
      () => toast("No se pudo copiar al portapapeles.", "bad"),
    );
  };

  const toggleExpanded = (page: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (!next.delete(page)) next.add(page);
      return next;
    });
  };

  if (query.isError) return <ErrorCard error={query.error} subject={slug} />;
  /* Mientras carga no se puede afirmar que no haya apuntes (U14). */
  if (query.isPending) return <WideSkeleton />;

  const hasSomething = notes.length > 0 || scratch.trim().length > 0;

  return (
    <div className={css.view}>
      <header className={css.headRow}>
        <div className={css.head}>
          <span className={css.ribbon}>— LO MÍO —</span>
          <h1 className={css.h1}>Mis apuntes</h1>
          <p className={css.sub}>
            {notes.length} {plural(notes.length, "apunte", "apuntes")} en {model.config.name}
          </p>
          {/* Es la única pista de que se puede escribir **negrita** y $\bar x$. */}
          <p className={css.hint}>Aceptan markdown y fórmulas $…$.</p>
        </div>
        <div className={css.headActions}>
          <button
            type="button"
            className={css.exportButton}
            onClick={exportAll}
            disabled={!hasSomething}
            title={hasSomething ? "Descargar todos los apuntes en un .md" : "Todavía no hay apuntes que exportar"}
          >
            <UiIcon name="file" size={15} />
            Exportar markdown
          </button>
          <button
            type="button"
            className={`${css.exportButton} ${css.exportButtonGhost}`}
            onClick={copyAll}
            disabled={!hasSomething}
            title={hasSomething ? "Copiar todos los apuntes al portapapeles" : "Todavía no hay apuntes que copiar"}
          >
            <Icon name="cards" size={15} />
            Copiar todo
          </button>
        </div>
      </header>

      {/* --- Borrador general: lo que no pertenece a ninguna página --- */}
      <section className={css.scratch} aria-labelledby="notes-scratch">
        <div className={css.scratchHead}>
          <span className={css.scratchTitle} id="notes-scratch">
            <Icon name="pencil" size={13} />
            {SCRATCH_HEADING.toUpperCase()}
          </span>
          <span className={css.scratchState} data-on={scratchSaved ? "" : undefined} aria-live="polite">
            {scratchSaved ? "Guardado" : ""}
          </span>
          <div className={css.scratchTabs} role="group" aria-label="Modo del borrador general">
            <button
              type="button"
              className={css.scratchTab}
              aria-pressed={scratchTab === "edit"}
              onClick={() => setScratchTab("edit")}
            >
              Escribir
            </button>
            <button
              type="button"
              className={css.scratchTab}
              aria-pressed={scratchTab === "view"}
              onClick={() => setScratchTab("view")}
            >
              Vista
            </button>
          </div>
        </div>

        {scratchTab === "edit" ? (
          <textarea
            className={css.scratchArea}
            value={scratch}
            onChange={(event) => onScratch(event.target.value)}
            aria-label="Borrador general de la materia"
            placeholder="Dudas, fórmulas para memorizar, plan del día… acepta markdown y fórmulas $…$"
          />
        ) : (
          <div className={css.scratchPreview}>
            <Markdown body={scratch.trim() || "_El borrador todavía está en blanco._"} subject={slug} exists={exists} />
          </div>
        )}

        <div className={css.scratchFoot}>
          <span className={css.scratchCount}>{scratch.length ? `${scratch.length} car.` : ""}</span>
          <span className={css.scratchNote}>Se guarda en este navegador y entra en la exportación.</span>
        </div>
      </section>

      {!notes.length ? (
        <div className={css.empty}>
          <Icon name="notebook" size={26} className={css.emptyIcon} />
          <p className={css.emptyTitle}>Todavía no escribió ningún apunte de página</p>
          <p className={css.emptyText}>
            En el lector, la tarjeta <strong>APUNTES</strong> de la columna derecha guarda lo que escriba sobre esa
            página: la duda que quedó, el ejemplo que la explicó, el paso que siempre se olvida. Se guarda solo
            mientras escribe y se puede exportar entero desde aquí.
          </p>
          <Link className={css.emptyAction} to={routes.wiki(slug)}>
            <Icon name="book" size={15} />
            Ir al catálogo del wiki
          </Link>
        </div>
      ) : null}

      {notes.length ? (
        <div className={css.searchRow}>
          <UiIcon name="search" size={15} className={css.searchIcon} aria-hidden="true" />
          <input
            type="search"
            className={css.searchField}
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Buscar en mis apuntes…"
            aria-label="Buscar en mis apuntes"
          />
          <span className={css.searchCount} aria-live="polite">
            {needle ? `${shown.length} de ${notes.length}` : ""}
          </span>
        </div>
      ) : null}

      {notes.length && !shown.length ? (
        <p className={css.noResults}>Sin resultados para esa búsqueda.</p>
      ) : null}

      <div className={css.notes}>
        {shown.map((note) => {
          const page = model.bySlug.get(note.page);
          const title = page?.title ?? note.page;
          const division = page ? model.division(model.divisionOf(page)) : undefined;
          const long = note.body.length > LONG_CHARS || note.body.split("\n").length > LONG_LINES;
          const open = expanded.has(note.page);
          return (
            <article
              key={note.page}
              className={css.note}
              style={division ? { ["--ucol" as string]: division.color } : undefined}
            >
              <header className={css.noteHead}>
                {division ? <span className={css.noteChip}>{division.short}</span> : null}
                <Link className={css.noteTitle} to={routes.page(slug, note.page)}>
                  {title}
                </Link>
                <span className={css.noteDate}>{stamp(note.updatedAt)}</span>
              </header>

              {/* El apunte se compone, no se resume: el markdown, la matemática y
                  los wikilinks son parte de lo que el usuario escribió. */}
              <div className={css.noteBody} data-clamp={long && !open ? "" : undefined}>
                <Markdown body={note.body} subject={slug} exists={exists} />
              </div>
              {long ? (
                <button
                  type="button"
                  className={css.noteMore}
                  onClick={() => toggleExpanded(note.page)}
                  aria-expanded={open}
                >
                  {open ? "Ver menos" : "Ver el apunte completo"}
                  <span className={css.noteMoreOf}> de «{title}»</span>
                </button>
              ) : null}

              <footer className={css.noteFoot}>
                <Link className={css.noteAction} to={routes.page(slug, note.page)}>
                  <UiIcon name="external" size={13} />
                  Abrir en el lector
                </Link>
                <button
                  type="button"
                  className={css.noteAction}
                  onClick={() => exportOne(note)}
                  aria-label={`Exportar el apunte de «${title}»`}
                >
                  <UiIcon name="file" size={13} />
                  Exportar
                </button>
                <button
                  type="button"
                  className={css.noteAction}
                  onClick={() => setPendingDelete(note)}
                  aria-label={`Borrar el apunte de «${title}»`}
                >
                  <UiIcon name="close" size={13} />
                  Borrar
                </button>
              </footer>
            </article>
          );
        })}
      </div>

      {notes.length ? (
        <p className={css.crossLink}>
          <Link className={css.emptyAction} to={routes.favorites(slug)}>
            <Icon name="star" size={15} />
            Ver mis favoritos
          </Link>
        </p>
      ) : null}

      {/* Borrar un apunte no tiene deshacer: se pregunta antes, igual que en la
          tarjeta del lector (N0-35). */}
      <Dialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        eyebrow="APUNTES"
        title="¿Borrar este apunte?"
        width={440}
        footer={
          <>
            <button type="button" className={css.dialogCancel} onClick={() => setPendingDelete(null)}>
              Conservarlo
            </button>
            <button
              type="button"
              className={css.dialogDelete}
              onClick={() => {
                if (pendingDelete) remove.mutate({ page: pendingDelete.page });
                setPendingDelete(null);
              }}
            >
              Borrar el apunte
            </button>
          </>
        }
      >
        <p className={css.dialogText}>
          Se pierde lo escrito en «{pendingDelete ? (model.bySlug.get(pendingDelete.page)?.title ?? pendingDelete.page) : ""}
          » y la página deja de aparecer en «Mis apuntes». No se puede deshacer.
        </p>
      </Dialog>
    </div>
  );
}

export default NotesView;
