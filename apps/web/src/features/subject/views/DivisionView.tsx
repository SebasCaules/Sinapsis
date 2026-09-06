/**
 * Una división completa: su progreso, la secuencia numerada de páginas de
 * contenido y, al final, el bloque de fuentes (plegado, como en el índice).
 */
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { plural, routes } from "@sinapsis/contract";
import { UiIcon } from "@/components/platform";
import { MathText } from "../components/MathText";
import { NotFoundInSubject } from "../components/States";
import { useSubjectCtx } from "../context";
import { pad2 } from "../model";
import css from "./DivisionView.module.css";

export function DivisionView() {
  const { slug, model } = useSubjectCtx();
  const { division: key = "" } = useParams();
  const division = model.division(key);
  const [showSources, setShowSources] = useState(false);

  if (!division) return <NotFoundInSubject subject={slug} />;

  const sequence = model.sequence(key);
  const progress = model.progress(key);
  /* Qué cuenta como fuente lo decide el modelo (una sola vez, con la regla del
     contrato): la vista no vuelve a mirar `countsAsContent`. */
  const sources = model.sources(key);
  const unit = model.config.division.singular.toLowerCase();

  return (
    <div className={css.view} style={{ ["--ucol" as string]: division.color }}>
      <header className={css.head}>
        <div className={css.eyebrow}>
          <span className={css.dot} aria-hidden="true" />
          <span className={css.short}>{division.short}</span>
          <span className={css.kind}>
            {division.kind === "extra" ? "Sección extra" : model.config.division.singular}
          </span>
        </div>
        <h1 className={css.h1}>{division.name}</h1>
        <div className={css.progress}>
          <span className={css.track}>
            <span className={css.fill} style={{ width: `${Math.round(progress.ratio * 100)}%` }} />
          </span>
          <span className={css.count}>
            {progress.done} / {progress.total} {plural(progress.total, "página leída", "páginas leídas")}
          </span>
        </div>
      </header>

      <ol className={css.list}>
        {sequence.map((page, i) => (
          <li key={page.slug}>
            <Link className={css.item} to={routes.page(slug, page.slug)}>
              <span className={css.num}>{pad2(i + 1)}</span>
              <span className={css.body}>
                <span className={css.itemTitle}>{page.title}</span>
                {page.summary ? <MathText className={css.itemSummary} text={page.summary} /> : null}
              </span>
              <span className={css.itemType}>{model.typeLabel(page.type).toUpperCase()}</span>
              {model.studied.has(page.slug) ? (
                <UiIcon name="check" size={14} className={css.check} title="Estudiada" />
              ) : (
                <span className={css.checkOff} aria-hidden="true" />
              )}
            </Link>
          </li>
        ))}
        {!sequence.length ? (
          <li className={css.empty}>Esta {unit} todavía no tiene páginas de contenido.</li>
        ) : null}
      </ol>

      {sources.length ? (
        <section className={css.sources}>
          <button
            type="button"
            className={css.sourcesHead}
            onClick={() => setShowSources((v) => !v)}
            aria-expanded={showSources}
          >
            <UiIcon name="chevronDown" size={13} className={showSources ? css.chevOpen : css.chev} />
            {plural(sources.length, "FUENTE", "FUENTES")} · {sources.length}
          </button>
          {showSources ? (
            <div className={css.sourceList}>
              {sources.map((page) => (
                <Link key={page.slug} className={css.source} to={routes.page(slug, page.slug)}>
                  <UiIcon name="file" size={13} />
                  {page.title}
                  {page.format ? <span className={css.format}>{page.format}</span> : null}
                </Link>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

export default DivisionView;
