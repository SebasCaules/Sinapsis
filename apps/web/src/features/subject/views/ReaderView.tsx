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
import { UiIcon } from "@/components/platform";
import { useSubjectCtx } from "../context";
import { Markdown } from "../markdown/Markdown";
import { ErrorCard, SheetSkeleton } from "../components/States";
import { usePage, useToggleStudied } from "../useSubject";
import css from "./ReaderView.module.css";

export function ReaderView() {
  const { slug, model } = useSubjectCtx();
  const { page: pageSlug = "" } = useParams();
  const location = useLocation();
  const query = usePage(slug, pageSlug);
  const toggleStudied = useToggleStudied(slug);
  const [sideOpen, setSideOpen] = useState(true);
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
  const onToggleStudied = () => toggleStudied.mutate({ page: pageSlug, studied: !studied });

  return (
    <div className={css.layout} style={{ ["--ucol" as string]: color }}>
      <div className={css.column}>
        <StudyActions studied={studied} onToggle={onToggleStudied} />

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
            <StudyActions studied={studied} onToggle={onToggleStudied} foot />
          </footer>
        </article>
      </div>

      {sideOpen ? (
        <div className={css.side}>
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
        aria-label={sideOpen ? "Ocultar el panel de la página" : "Mostrar el panel de la página"}
        title={sideOpen ? "Ocultar el panel" : "Mostrar el panel"}
      >
        PANEL
      </button>
    </div>
  );
}

/** «Marcar estudiado / Estudiada» + el hueco de Favoritos. Va arriba y al pie. */
function StudyActions({
  studied,
  onToggle,
  foot = false,
}: {
  studied: boolean;
  onToggle: () => void;
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
      <button
        type="button"
        className={css.chipDisabled}
        disabled
        aria-disabled="true"
        title="Favoritos: próximamente"
      >
        <UiIcon name="bookmark" size={13} />
        Guardar
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

export default ReaderView;
