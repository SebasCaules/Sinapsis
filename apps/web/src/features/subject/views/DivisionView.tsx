/**
 * Una división completa, como portada del tramo: barra de vuelta al catálogo,
 * hero con filete de color y progreso, acción primaria de lectura, tarjeta de
 * panorama, temario numerado, fuentes en grilla y salto a la división vecina.
 */
import { useId, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { numberedIndex, plural, routes } from "@sinapsis/contract";
import { Icon, UiIcon } from "@/components/platform";
import { MathText } from "../components/MathText";
import { NotFoundInSubject } from "../components/States";
import {
  EXERCISES_COLOR,
  EXERCISES_LABEL,
  EXERCISES_TYPE,
  PageTypeTag,
  TypeTag,
} from "../components/TypeTag";
import { useSubjectCtx } from "../context";
import { pad2 } from "../model";
import css from "./DivisionView.module.css";

export function DivisionView() {
  const { slug, model } = useSubjectCtx();
  const { division: key = "" } = useParams();
  const division = model.division(key);
  const [showSources, setShowSources] = useState(false);
  const headings = useId();

  if (!division) return <NotFoundInSubject subject={slug} />;

  const sequence = model.sequence(key);
  /* La barra mide la unidad ENTERA: las páginas leídas más los pasos que
     aportan los bundles de la materia (los ejercicios de la guía, de Lutzio y
     de parcial). El texto los nombra por separado (N0-61). */
  const parts = model.progressParts(key);
  const progress = model.progress(key);
  /* Qué cuenta como fuente lo decide el modelo (una sola vez, con la regla del
     contrato): la vista no vuelve a mirar `countsAsContent`. */
  const sources = model.sources(key);
  const overview = model.overview(key);
  const prev = model.adjacentDivision(key, -1);
  const next = model.adjacentDivision(key, 1);
  const pct = Math.round(progress.ratio * 100);

  /* Una división «extra» (Complementos, Evaluaciones) o sintética (Transversales)
     no es una unidad del programa: se la nombra como lo que dice el epígrafe. */
  const singular = model.config.division.singular;
  const number = division.synthetic ? null : numberedIndex(model.config, key);
  const unit = number === null ? "sección" : singular.toLowerCase();
  /* El epígrafe nombra el tramo, sin jerga de plataforma ni el nombre recortado:
     «Unidad 6» en las numeradas, «Complementos Matemáticos» en las demás. */
  const eyebrow = number === null ? division.name : `${singular} ${number}`;

  /* La acción primaria es una sola: empezar la división o retomarla donde quedó.
     El original siempre manda a la primera página; acá, con progreso, manda a la
     primera sin leer, que es lo que el lector espera de una portada de curso. */
  const pending = sequence.find((page) => !model.studied.has(page.slug));
  /* La acción mira las PÁGINAS: con ejercicios resueltos y nada leído, la
     portada sigue ofreciendo «Empezar a leer», que es lo que corresponde. */
  const started = parts.pages.done > 0;
  const target = started && pending ? pending : sequence[0];
  const ctaLabel = started && pending ? "Continuar leyendo" : "Empezar a leer";

  return (
    <div className={css.view} style={{ ["--ucol" as string]: division.color }}>
      <Link className={css.back} to={routes.wiki(slug)}>
        <UiIcon name="chevronLeft" size={15} />
        Todo el wiki
      </Link>

      <header className={css.head}>
        <div className={css.eyebrow}>
          <span className={css.dot} aria-hidden="true" />
          {eyebrow}
        </div>
        <h1 className={css.h1}>{division.name}</h1>
        <div className={css.heroRow}>
          <div className={css.progress}>
            <span className={css.track}>
              <span className={css.fill} style={{ width: `${pct}%` }} />
            </span>
            <span className={css.count}>
              {parts.pages.done} / {parts.pages.total}{" "}
              {plural(parts.pages.total, "página leída", "páginas leídas")}
              {parts.sources.map((source) => (
                <span key={source.label} className={css.countExtra}>
                  {" · "}
                  {source.done} / {source.total} {source.label}{" "}
                  {plural(source.total, "resuelto", "resueltos")}
                </span>
              ))}
            </span>
            <span className={css.pct}>{pct}%</span>
          </div>
          {target ? (
            <Link className={css.cta} to={routes.page(slug, target.slug)}>
              {ctaLabel}
            </Link>
          ) : null}
        </div>
      </header>

      {overview ? (
        <section className={css.overview} aria-labelledby={`${headings}-panorama`}>
          <div className={css.overviewKick} id={`${headings}-panorama`}>
            {overview.hub ? `Panorama de la ${unit}` : "Para empezar"}
          </div>
          <Link className={css.overviewTitle} to={routes.page(slug, overview.slug)}>
            {overview.title}
            {overview.hub ? <span className={css.hub}>hub</span> : null}
          </Link>
          {overview.summary ? <MathText className={css.overviewText} text={overview.summary} /> : null}
        </section>
      ) : null}

      <section className={css.block}>
        <h2 className={css.h2} id={`${headings}-temario`}>
          <Icon name="list" size={16} />
          Temario
        </h2>
        <div className={css.listLabel}>
          <span>Páginas en orden de aparición</span>
          <span className={css.listN}>{sequence.length}</span>
        </div>
        <ol className={css.list} aria-labelledby={`${headings}-temario`}>
          {sequence.map((page, i) => {
            const read = model.studied.has(page.slug);
            return (
              <li key={page.slug}>
                <Link
                  className={read ? `${css.item} ${css.read}` : css.item}
                  to={routes.page(slug, page.slug)}
                >
                  <span className={css.num}>
                    {read ? <UiIcon name="check" size={14} title="Leída" /> : pad2(i + 1)}
                  </span>
                  <span className={css.itemTitle}>
                    {page.title}
                    {page.hub ? <span className={css.hub}>hub</span> : null}
                  </span>
                  <PageTypeTag model={model} type={page.type} size="sm" className={css.itemType} />
                  <UiIcon name="chevronRight" size={14} className={css.arrow} />
                </Link>
              </li>
            );
          })}
          {!sequence.length ? (
            <li className={css.empty}>Esta {unit} todavía no tiene páginas de contenido.</li>
          ) : null}
        </ol>
      </section>

      {parts.groups.length ? (
        <section className={css.block} aria-labelledby={`${headings}-ejercicios`}>
          <h2 className={css.h2} id={`${headings}-ejercicios`}>
            <Icon name="pencil" size={16} />
            Ejercicios
          </h2>
          <div className={css.listLabel}>
            <span>Cuentan para la barra de esta {unit}</span>
            <span className={css.listN}>{parts.extras.total}</span>
          </div>
          <div className={css.groupGrid}>
            {parts.groups.map((group) => {
              const complete = group.total > 0 && group.done === group.total;
              /* El mismo recuento que muestra la tarjeta viaja al tooltip. */
              const count =
                group.done > 0
                  ? `${group.done} de ${group.total} ${plural(group.total, "resuelto", "resueltos")}`
                  : `${group.total} ${plural(group.total, "ejercicio", "ejercicios")}`;
              const body = (
                <>
                  <span className={css.groupHead}>
                    <span className={css.groupTitle}>{group.label}</span>
                    <TypeTag type={EXERCISES_TYPE} label={EXERCISES_LABEL} color={EXERCISES_COLOR} size="sm" />
                  </span>
                  <span className={css.groupMeta}>
                    {count}
                    {complete ? <span className={css.groupDone}>completo</span> : null}
                  </span>
                  <span className={css.groupTrack} aria-hidden="true">
                    <span
                      className={css.groupFill}
                      style={{ width: `${group.total ? (group.done / group.total) * 100 : 0}%` }}
                    />
                  </span>
                </>
              );
              /* El destino lo declara el bundle y es una ruta del SPA. Un valor
                 que no lo sea deja la tarjeta sin enlace: la plataforma no
                 navega a donde no sabe. */
              return group.to && group.to.startsWith("/") ? (
                <Link
                  key={group.id}
                  className={css.group}
                  to={group.to}
                  data-tip-title={group.label}
                  data-tip-kicker={`${division.short} · ${EXERCISES_LABEL}`}
                  data-tip-text={count}
                  data-tip-meta={group.source}
                >
                  {body}
                  <UiIcon name="chevronRight" size={14} className={css.arrow} />
                </Link>
              ) : (
                <div
                  key={group.id}
                  className={css.group}
                  data-tip-title={group.label}
                  data-tip-kicker={`${division.short} · ${EXERCISES_LABEL}`}
                  data-tip-text={count}
                  data-tip-meta={group.source}
                >
                  {body}
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {sources.length ? (
        <section className={css.sources} aria-labelledby={`${headings}-fuentes`}>
          <button
            type="button"
            id={`${headings}-fuentes`}
            className={css.sourcesHead}
            onClick={() => setShowSources((v) => !v)}
            aria-expanded={showSources}
          >
            <Icon name="book" size={15} />
            <span className={css.sourcesTitle}>
              Fuentes de esta {unit} ({sources.length})
            </span>
            <span className={css.sourcesSign} aria-hidden="true">
              {showSources ? "−" : "+"}
            </span>
          </button>
          {showSources ? (
            <div className={css.sourceGrid}>
              {sources.map((page) => (
                <Link key={page.slug} className={css.source} to={routes.page(slug, page.slug)}>
                  <span className={css.sourceBar} aria-hidden="true" />
                  <span className={css.sourceBody}>
                    <span className={css.sourceTitle}>{page.title}</span>
                    <span className={css.sourceMeta}>
                      {division.short} · <PageTypeTag model={model} type={page.type} size="sm" />
                      {page.format ? ` · ${page.format}` : ""}
                      {model.studied.has(page.slug) ? (
                        <span className={css.readMark}>
                          {" · "}
                          <UiIcon name="check" size={11} />
                          leída
                        </span>
                      ) : null}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {prev || next ? (
        <nav className={css.prevNext} aria-label={`Navegación entre ${model.config.division.plural.toLowerCase()}`}>
          {prev ? (
            <Link className={css.pnPrev} to={routes.division(slug, prev.key)}>
              <span className={css.pnDir}>← {singular} anterior</span>
              <span className={css.pnTitle}>{prev.label}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link className={css.pnNext} to={routes.division(slug, next.key)}>
              <span className={css.pnDir}>Siguiente {singular.toLowerCase()} →</span>
              <span className={css.pnTitle}>{next.label}</span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </div>
  );
}

export default DivisionView;
