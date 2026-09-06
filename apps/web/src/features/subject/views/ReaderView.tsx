/**
 * Lector de una página del wiki (regiones 09 y 10): hoja de 840 con la barra de
 * la división, la prosa y la columna de 248 (índice de la página, fuentes y
 * backlinks). Es la vista más pesada del shell: se carga en diferido.
 *
 * Los ids de los encabezados los pone el compilador (`Page.headings[].id`, con
 * `headingId` del contrato) y el plugin de rehype los repite tal cual: el índice
 * de la página no necesita leer el DOM para saber a dónde apunta.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { routes, type PageHeading, type PageMeta } from "@sinapsis/contract";
import { Dialog, Icon, UiIcon } from "@/components/platform";
import { useSubjectCtx } from "../context";
import { Markdown } from "../markdown/Markdown";
import { ErrorCard, SheetSkeleton } from "../components/States";
import {
  useDeleteNote,
  usePage,
  useSaveNote,
  useStudyState,
  useToggleBookmark,
  useToggleStudied,
} from "../useSubject";
import css from "./ReaderView.module.css";

/**
 * A partir de acá la columna lateral cabe al lado de la hoja. Por debajo no
 * desaparece (N0-36): se vuelve un panel deslizante que abre el botón «PANEL»,
 * porque apuntes, índice, fuentes y backlinks tienen que seguir accesibles.
 */
const WIDE = "(min-width: 1280px)";

function useWideViewport(): boolean {
  const [wide, setWide] = useState(() =>
    typeof window === "undefined" ? true : window.matchMedia(WIDE).matches,
  );
  useEffect(() => {
    const query = window.matchMedia(WIDE);
    const onChange = () => setWide(query.matches);
    query.addEventListener("change", onChange);
    onChange();
    return () => query.removeEventListener("change", onChange);
  }, []);
  return wide;
}

export function ReaderView() {
  const { slug, model } = useSubjectCtx();
  const { page: pageSlug = "" } = useParams();
  const location = useLocation();
  const query = usePage(slug, pageSlug);
  const toggleStudied = useToggleStudied(slug);
  const { bookmarks } = useStudyState(slug);
  const toggleBookmark = useToggleBookmark(slug);
  const wide = useWideViewport();
  /* Ancho: la columna está y se puede plegar. Angosto: es un panel que hay que
     abrir, y por lo tanto arranca cerrado para no tapar la lectura. */
  const [sideOpen, setSideOpen] = useState(wide);
  useEffect(() => setSideOpen(wide), [wide]);
  const [activeHeading, setActiveHeading] = useState<string | null>(null);
  const sourcesRef = useRef<HTMLElement>(null);
  const sheetRef = useRef<HTMLElement>(null);

  const detail = query.data;
  const page = detail?.page;
  const meta = model.bySlug.get(pageSlug);
  const divisionKey = meta ? model.divisionOf(meta) : (page?.division ?? null);
  const division = divisionKey ? model.division(divisionKey) : undefined;
  const sequence = divisionKey ? model.sequence(divisionKey) : [];
  const position = model.positionOf(pageSlug);
  const { prev, next } = model.prevNext(pageSlug);
  const upcoming = position ? sequence.slice(position, position + 3) : [];
  /* Callback estable: el pipeline de markdown se rearma solo si cambia la materia. */
  const exists = useCallback((target: string) => model.bySlug.has(target), [model]);
  const headings = useMemo(
    () => (page?.headings ?? []).filter((h) => h.level === 2 || h.level === 3),
    [page?.headings],
  );

  /* Al cambiar de página: arriba de todo, salvo que la URL traiga un ancla. */
  useEffect(() => {
    if (!detail) return;
    const scroller = document.querySelector<HTMLElement>("main[data-subject-main]");
    const hash = decodeURIComponent(location.hash.replace(/^#/, ""));
    const target = hash ? document.getElementById(hash) : null;
    if (target) {
      target.scrollIntoView({ block: "start" });
      return;
    }
    scroller?.scrollTo({ top: 0 });
  }, [detail, pageSlug, location.hash]);

  /* Scroll-spy del índice de la página. */
  useEffect(() => {
    if (!headings.length) return;
    const root = document.querySelector<HTMLElement>("main[data-subject-main]");
    const targets = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!targets.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const first = visible[0];
        if (first) setActiveHeading(first.target.id);
      },
      { root, rootMargin: "-72px 0px -68% 0px", threshold: 0 },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings, detail]);

  /* El error manda sobre la carga: un 404 no puede quedarse en el esqueleto. */
  if (query.isError || (!query.isPending && (!detail || !page))) {
    return <ErrorCard error={query.error} notFound="Esta página no existe en la materia" subject={slug} />;
  }
  if (query.isPending || !detail || !page) return <SheetSkeleton />;

  const studied = detail.studied;
  const color = division?.color ?? "var(--primary)";
  const sources = page.sources.map((s) => ({ slug: s, page: model.bySlug.get(s) }));
  const unit = model.config.division.singular.toLowerCase();
  const bookmarked = bookmarks.has(pageSlug);
  const onToggleStudied = () => toggleStudied.mutate({ page: pageSlug, studied: !studied });
  const onToggleBookmark = () => toggleBookmark.mutate({ page: pageSlug, on: !bookmarked });

  return (
    <div className={css.layout} style={{ ["--ucol" as string]: color }}>
      <div className={css.column}>
        <StudyActions
          studied={studied}
          onToggle={onToggleStudied}
          bookmarked={bookmarked}
          onToggleBookmark={onToggleBookmark}
        />

        <article className={css.sheet} ref={sheetRef}>
          <header className={css.sheetHead}>
            {division ? (
              <Link className={css.divisionChip} to={routes.division(slug, division.key)}>
                <span className={css.divisionDot} aria-hidden="true" />
                {division.label}
              </Link>
            ) : null}
            <span className={css.typeChip}>{model.typeLabel(page.type).toUpperCase()}</span>
            {position ? (
              <span className={css.position}>
                página {position} de {sequence.length}
              </span>
            ) : (
              <span className={css.position}>fuera de la secuencia</span>
            )}
            <span className={css.headSpacer} />
            {upcoming.length ? (
              <details className={css.whatsNext}>
                <summary className={css.whatsNextSummary}>¿Qué sigue?</summary>
                <div className={css.whatsNextPanel}>
                  {upcoming.map((p, i) => (
                    <Link key={p.slug} className={css.whatsNextItem} to={routes.page(slug, p.slug)}>
                      <span className={css.whatsNextNum}>{position + i + 1}</span>
                      {p.title}
                    </Link>
                  ))}
                </div>
              </details>
            ) : null}
            {sources.length ? (
              <button
                type="button"
                className={css.sourcesLink}
                onClick={() => {
                  setSideOpen(true);
                  window.requestAnimationFrame(() =>
                    sourcesRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }),
                  );
                }}
              >
                +{sources.length} fuentes
              </button>
            ) : null}
          </header>

          {sequence.length > 1 ? (
            <div className={css.segments}>
              <span className={css.segmentsLabel}>{model.typeLabel(page.type).toUpperCase()}</span>
              <div className={css.segmentsRow}>
                {sequence.map((p) => (
                  <Link
                    key={p.slug}
                    to={routes.page(slug, p.slug)}
                    className={css.segment}
                    data-state={p.slug === pageSlug ? "current" : model.studied.has(p.slug) ? "studied" : "todo"}
                    title={p.title}
                    aria-label={p.title}
                    aria-current={p.slug === pageSlug ? "page" : undefined}
                  />
                ))}
              </div>
            </div>
          ) : null}

          <PrevNext slug={slug} prev={prev} next={next} unit={unit} />

          <h1 className={css.title}>{page.title}</h1>

          <Markdown body={page.body} subject={slug} exists={exists} />

          {/* El mismo par de acciones al terminar de leer: nadie tiene que volver
              arriba para marcar la página o pasar a la siguiente. */}
          <footer className={css.foot}>
            <PrevNext slug={slug} prev={prev} next={next} unit={unit} foot />
            <StudyActions
              studied={studied}
              onToggle={onToggleStudied}
              bookmarked={bookmarked}
              onToggleBookmark={onToggleBookmark}
              foot
            />
          </footer>
        </article>
      </div>

      {sideOpen ? (
        <div
          id="reader-side"
          className={wide ? css.side : `${css.side} ${css.sideFloating}`}
          data-floating={wide ? undefined : "true"}
        >
          <section className={css.card} aria-labelledby="reader-toc">
            <div className={css.cardHead} id="reader-toc">
              <UiIcon name="menu" size={13} />
              EN ESTA PÁGINA
            </div>
            {headings.length ? (
              <div className={css.toc}>
                {headings.map((h: PageHeading) => (
                  <a
                    key={h.id}
                    href={`#${h.id}`}
                    className={h.level === 3 ? css.tocSub : css.tocItem}
                    data-active={activeHeading === h.id ? "true" : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(h.id)?.scrollIntoView({ block: "start", behavior: "smooth" });
                      history.replaceState(null, "", `#${h.id}`);
                    }}
                  >
                    {h.text}
                  </a>
                ))}
              </div>
            ) : (
              <p className={css.cardEmpty}>Esta página no tiene secciones.</p>
            )}
          </section>

          <NotesCard slug={slug} page={pageSlug} exists={exists} />

          {sources.length ? (
            <section className={css.card} ref={sourcesRef} aria-labelledby="reader-sources">
              <div className={css.cardHead} id="reader-sources">
                <UiIcon name="file" size={13} />
                FUENTES
              </div>
              {sources.map((source) =>
                source.page ? (
                  <Link key={source.slug} className={css.cardLink} to={routes.page(slug, source.slug)}>
                    {source.page.title}
                  </Link>
                ) : (
                  <span key={source.slug} className={css.cardMissing} title="No está en la materia">
                    {source.slug}
                  </span>
                ),
              )}
            </section>
          ) : null}

          {detail.backlinks.length ? (
            <section className={css.card} aria-labelledby="reader-backlinks">
              <div className={css.cardHead} id="reader-backlinks">
                <UiIcon name="external" size={13} />
                ENLAZAN AQUÍ ({detail.backlinks.length})
              </div>
              {detail.backlinks.map((back: PageMeta) => (
                <Link key={back.slug} className={css.cardLink} to={routes.page(slug, back.slug)}>
                  → {back.title}
                </Link>
              ))}
            </section>
          ) : null}
        </div>
      ) : null}

      <button
        type="button"
        className={css.sideTab}
        onClick={() => setSideOpen((v) => !v)}
        aria-expanded={sideOpen}
        aria-controls={sideOpen ? "reader-side" : undefined}
        aria-label={sideOpen ? "Ocultar el panel de la página" : "Mostrar el panel de la página"}
        title={sideOpen ? "Ocultar el panel" : "Mostrar el panel"}
      >
        PANEL
      </button>
    </div>
  );
}

/** «Marcar estudiado / Estudiada» y «A favoritos / En favoritos». Va arriba y al pie. */
function StudyActions({
  studied,
  onToggle,
  bookmarked,
  onToggleBookmark,
  foot = false,
}: {
  studied: boolean;
  onToggle: () => void;
  bookmarked: boolean;
  onToggleBookmark: () => void;
  foot?: boolean;
}) {
  return (
    <div className={foot ? `${css.chips} ${css.chipsFoot}` : css.chips}>
      <button
        type="button"
        className={css.chipButton}
        data-on={studied ? "true" : undefined}
        onClick={onToggle}
        aria-pressed={studied}
      >
        <UiIcon name="check" size={13} />
        {studied ? "Estudiada" : "Marcar estudiado"}
      </button>
      {/* «Guardar» no decía dónde: el destino es «Favoritos», el mismo nombre
          que tiene la vista de «Lo mío» a la que va a parar la página (U17). */}
      <button
        type="button"
        className={css.chipSave}
        data-on={bookmarked ? "true" : undefined}
        onClick={onToggleBookmark}
        aria-pressed={bookmarked}
        aria-label="Guardar en favoritos"
        title={bookmarked ? "Quitar de favoritos" : "Guardar en favoritos"}
      >
        <UiIcon name="bookmark" size={13} />
        {bookmarked ? "En favoritos" : "A favoritos"}
      </button>
    </div>
  );
}

/** Anterior / Siguiente dentro de la secuencia de la división. */
function PrevNext({
  slug,
  prev,
  next,
  unit,
  foot = false,
}: {
  slug: string;
  prev: PageMeta | null;
  next: PageMeta | null;
  /** Nombre de la división de la materia, en minúscula ("unidad", "semana"). */
  unit: string;
  foot?: boolean;
}) {
  return (
    <nav className={foot ? `${css.prevNext} ${css.prevNextFoot}` : css.prevNext} aria-label="Páginas vecinas">
      {prev ? (
        <Link className={css.prev} to={routes.page(slug, prev.slug)}>
          ← Anterior
        </Link>
      ) : (
        <span className={css.prevOff}>← Anterior</span>
      )}
      {next ? (
        <Link className={css.next} to={routes.page(slug, next.slug)}>
          Siguiente: {next.title} →
        </Link>
      ) : (
        <span className={css.prevOff}>Última de la {unit}</span>
      )}
    </nav>
  );
}

/** Rótulo del estado del apunte: «Guardado · 14:32». */
function savedAt(value: string): string {
  const at = Date.parse(value);
  if (Number.isNaN(at)) return "Guardado";
  return `Guardado · ${new Date(at).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}`;
}

const NOTE_ROWS_MIN = 6;
const NOTE_ROWS_MAX = 20;
/** Rebote del guardado automático mientras se escribe. */
const NOTE_DEBOUNCE = 800;

/** Estado del guardado del apunte: manda sobre el rótulo de la cabecera. */
type NoteStatus = "idle" | "saving" | "error";

/**
 * Tarjeta «APUNTES»: lo que el usuario escribe sobre ESTA página.
 *
 * El contrato de guardado es el de N0-35, y en este orden:
 *  1. Nunca se pierde nada: se guarda solo 800 ms después de la última tecla, y
 *     también al salir del campo, con ⌘S y con «Guardar apunte». Un guardado
 *     FALLIDO no da el texto por guardado: el borrador sigue sucio, la tarjeta
 *     dice «No se pudo guardar» y ofrece «Reintentar» (bug 1). Mientras haya
 *     cambios locales, el valor del servidor nunca los pisa.
 *  2. Al perder el foco se ve el markdown ya compuesto (mismo motor que la
 *     página): el apunte se lee como se va a leer después, no como se escribió.
 *  3. Vaciar el campo BORRA el apunte —con confirmación si se pide desde
 *     «Borrar»—: no queda una entrada en blanco colgando en «Mis apuntes».
 */
function NotesCard({ slug, page, exists }: { slug: string; page: string; exists: (target: string) => boolean }) {
  const { notes } = useStudyState(slug);
  const stored = notes.get(page);
  const save = useSaveNote(slug);
  const remove = useDeleteNote(slug);

  const [draft, setDraft] = useState(stored?.body ?? "");
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<NoteStatus>("idle");
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef(0);
  const dirtyRef = useRef(false);

  /* Cuando la consulta responde (o el servidor devuelve la fecha real) se repone
     el texto, pero SOLO si no hay nada escrito sin guardar: un guardado fallido
     deja `dirtyRef` en true justamente para que esto no vacíe el campo. */
  useEffect(() => {
    if (dirtyRef.current) return;
    setDraft(stored?.body ?? "");
  }, [stored?.body, stored?.updatedAt]);

  /* El mapa de apuntes es de la materia entera, así que `commit` puede volcar
     el de CUALQUIER página: es lo que necesita el cambio de página, que tiene
     que guardar el apunte de la que se está dejando. */
  const notesRef = useRef(notes);
  notesRef.current = notes;

  const commit = useCallback(
    (body: string, target: string) => {
      window.clearTimeout(timerRef.current);
      timerRef.current = 0;
      const previous = notesRef.current.get(target);
      const settled = () => {
        dirtyRef.current = false;
        setDirty(false);
        setStatus("idle");
      };
      const failed = () => setStatus("error");

      const trimmed = body.trim();
      if (!trimmed) {
        if (!previous) {
          settled();
          return;
        }
        setStatus("saving");
        remove.mutate({ page: target }, { onSuccess: settled, onError: failed });
        return;
      }
      if (previous?.body === body) {
        settled();
        return;
      }
      setStatus("saving");
      save.mutate({ page: target, body }, { onSuccess: settled, onError: failed });
    },
    [remove, save],
  );

  const draftRef = useRef(draft);
  draftRef.current = draft;
  const commitRef = useRef(commit);
  commitRef.current = commit;

  /**
   * Cambiar de página cambia de apunte. La limpieza de este efecto corre ANTES
   * de que el cuerpo reponga el borrador de la página nueva: ahí se vuelca lo
   * pendiente de la que se deja y se apaga el temporizador (bug 8). También es
   * lo que salva el apunte al desmontarse el lector.
   */
  useEffect(() => {
    setDraft(notesRef.current.get(page)?.body ?? "");
    setDirty(false);
    dirtyRef.current = false;
    setStatus("idle");
    setEditing(false);
    /* `commitRef` ya apunta al commit de ESTA página; se captura para que la
       limpieza no use el de la página siguiente. */
    const flush = commitRef.current;
    const leaving = page;
    return () => {
      window.clearTimeout(timerRef.current);
      timerRef.current = 0;
      if (dirtyRef.current) flush(draftRef.current, leaving);
    };
  }, [page]);

  const onChange = (value: string) => {
    setDraft(value);
    setDirty(true);
    dirtyRef.current = true;
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => commit(value, page), NOTE_DEBOUNCE);
  };

  const rows = Math.min(NOTE_ROWS_MAX, Math.max(NOTE_ROWS_MIN, draft.split("\n").length + 1));
  const showPreview = !editing && draft.trim().length > 0;

  return (
    <section className={css.card} aria-labelledby="reader-notes">
      <div className={css.cardHead} id="reader-notes">
        <Icon name="pencil" size={13} />
        APUNTES
        {status === "error" ? (
          <span className={css.noteState} data-state="error">
            No se pudo guardar
            <button type="button" className={css.noteRetry} onClick={() => commit(draft, page)}>
              Reintentar
            </button>
          </span>
        ) : (
          <span className={css.noteState} data-state={dirty ? "dirty" : undefined}>
            {dirty ? "Sin guardar" : stored ? savedAt(stored.updatedAt) : ""}
          </span>
        )}
      </div>

      {showPreview ? (
        <button
          type="button"
          className={css.notePreview}
          onClick={() => {
            setEditing(true);
            window.requestAnimationFrame(() => areaRef.current?.focus());
          }}
          title="Editar el apunte"
        >
          <Markdown body={draft} subject={slug} exists={exists} />
        </button>
      ) : (
        <textarea
          ref={areaRef}
          className={css.noteArea}
          value={draft}
          rows={rows}
          placeholder="Lo que quiera recordar de esta página…"
          aria-label="Apunte de esta página"
          aria-keyshortcuts="Control+S"
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => setEditing(true)}
          onBlur={() => {
            setEditing(false);
            if (dirtyRef.current) commit(draft, page);
          }}
          onKeyDown={(event) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
              event.preventDefault();
              commit(draft, page);
            }
          }}
        />
      )}

      <div className={css.noteFoot}>
        <button
          type="button"
          className={css.noteSave}
          onClick={() => commit(draft, page)}
          disabled={!dirty && status !== "error"}
          aria-keyshortcuts="Control+S"
          title="Guardar el apunte (⌘S)"
        >
          Guardar apunte
        </button>
        {stored ? (
          <button
            type="button"
            className={css.noteDelete}
            onClick={() => setConfirmDelete(true)}
            aria-label="Borrar el apunte de esta página"
          >
            Borrar
          </button>
        ) : null}
      </div>

      {/* Borrar un apunte no tiene deshacer: se pregunta antes (N0-35). */}
      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        eyebrow="APUNTES"
        title="¿Borrar el apunte de esta página?"
        width={440}
        footer={
          <>
            <button type="button" className={css.dialogCancel} onClick={() => setConfirmDelete(false)}>
              Conservarlo
            </button>
            <button
              type="button"
              className={css.dialogDelete}
              onClick={() => {
                setConfirmDelete(false);
                setDraft("");
                dirtyRef.current = true;
                setDirty(true);
                commit("", page);
              }}
            >
              Borrar el apunte
            </button>
          </>
        }
      >
        <p className={css.dialogText}>
          Lo escrito se pierde y la página deja de aparecer en «Mis apuntes». No se puede deshacer.
        </p>
      </Dialog>
    </section>
  );
}

export default ReaderView;
