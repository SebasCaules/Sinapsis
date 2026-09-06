/**
 * Lector de una página del wiki (regiones 09 y 10): hoja de 840 con la barra de
 * la división, la prosa y la columna de 248 (índice de la página, fuentes y
 * backlinks). Es la vista más pesada del shell: se carga en diferido.
 */
import { useEffect, useMemo, useRef, useState } from "react";
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
  const [domHeadings, setDomHeadings] = useState<PageHeading[]>([]);
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
  const slugs = useMemo(() => new Set(model.bySlug.keys()), [model]);
  const metaHeadings = useMemo(
    () => (page?.headings ?? []).filter((h) => h.level === 2 || h.level === 3),
    [page?.headings],
  );
  /* Los ids de verdad son los que puso rehype-slug en el DOM: el índice de la
     página se arma con ellos, no con los del compilador, para que un criterio
     distinto de slug (acentos, puntuación) no rompa las anclas. */
  const headings = domHeadings.length ? domHeadings : metaHeadings;

  useEffect(() => {
    if (!detail) return;
    const found = sheetRef.current?.querySelectorAll<HTMLElement>("h2[id], h3[id]");
    setDomHeadings(
      [...(found ?? [])].map((el) => ({
        level: el.tagName === "H3" ? 3 : 2,
        text: el.textContent ?? "",
        id: el.id,
      })),
    );
  }, [detail, pageSlug]);

  /* Al cambiar de página: arriba de todo, salvo que la URL traiga un ancla. */
  useEffect(() => {
    if (!detail) return;
    const scroller = document.querySelector<HTMLElement>("main[data-subject-main]");
    const hash = decodeURIComponent(location.hash.replace(/^#/, ""));
    if (hash) {
      const target = findAnchor(sheetRef.current, hash);
      if (target) {
        target.scrollIntoView({ block: "start" });
        return;
      }
    }
    scroller?.scrollTo({ top: 0 });
  }, [detail, pageSlug, location.hash, domHeadings]);

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

  if (query.isPending) return <SheetSkeleton />;
  if (query.isError || !detail || !page) {
    return <ErrorCard error={query.error} notFound="Esta página no existe en la materia" subject={slug} />;
  }

  const studied = detail.studied;
  const color = division?.color ?? "var(--primary)";
  const sources = page.sources.map((s) => ({ slug: s, page: model.bySlug.get(s) }));

  return (
    <div className={css.layout} style={{ ["--ucol" as string]: color }}>
      <div className={css.column}>
        <div className={css.chips}>
          <button
            type="button"
            className={css.chipButton}
            data-on={studied ? "true" : undefined}
            onClick={() => toggleStudied.mutate({ page: pageSlug, studied: !studied })}
            aria-pressed={studied}
          >
            <UiIcon name="check" size={13} />
            {studied ? "Estudiada" : "Marcar estudiado"}
          </button>
          <span className={css.chipDisabled}>
            <UiIcon name="bookmark" size={13} />
            Guardar
            <span className={css.tip} role="tooltip">
              Favoritos: próximamente
            </span>
          </span>
        </div>

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
                  />
                ))}
              </div>
            </div>
          ) : null}

          <nav className={css.prevNext} aria-label="Páginas vecinas">
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
              <span className={css.prevOff}>Última de la división</span>
            )}
          </nav>

          <h1 className={css.title}>{page.title}</h1>

          <Markdown body={page.body} subject={slug} slugs={slugs} />
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
                      findAnchor(sheetRef.current, h.id)?.scrollIntoView({ block: "start", behavior: "smooth" });
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

/**
 * Busca el destino de un ancla. Primero por id exacto; si no, comparando sin
 * acentos: un wikilink escrito «#estandarizacion» tiene que abrir la sección
 * «Estandarización» aunque el id del DOM conserve la tilde.
 */
function findAnchor(root: HTMLElement | null, hash: string): HTMLElement | null {
  if (!hash) return null;
  const direct = document.getElementById(hash);
  if (direct) return direct;
  const norm = (value: string) =>
    value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const wanted = norm(hash);
  for (const el of root?.querySelectorAll<HTMLElement>("[id]") ?? []) {
    if (norm(el.id) === wanted) return el;
  }
  return null;
}

export default ReaderView;
