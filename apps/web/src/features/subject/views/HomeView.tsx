/**
 * Inicio de la materia: por dónde empezar, progreso por división y repaso.
 * Es la vista ancha (1120) del contrato; no inventa datos: todo sale del modelo.
 */
import { Link } from "react-router-dom";
import { routes } from "@sinapsis/contract";
import { Icon, UiIcon } from "@/components/platform";
import { useSubjectCtx } from "../context";
import { pad2 } from "../model";
import css from "./HomeView.module.css";

export function HomeView() {
  const { slug, model } = useSubjectCtx();
  const { progressTotal } = model;
  const next = model.nextUnread();
  const started = progressTotal.done > 0;
  const nextDivision = next ? model.division(model.divisionOf(next)) : null;
  const review = model.reviewPages();

  if (model.placeholder || !model.pages.length) {
    return <EmptySubject name={model.config.name} slug={slug} />;
  }

  return (
    <div className={css.view}>
      <section className={css.startCard} aria-labelledby="home-start">
        <div className={css.startBody}>
          <span className={css.eyebrow}>
            <Icon name="clock" size={14} />
            POR DÓNDE EMPEZAR
          </span>
          <h2 className={css.startTitle} id="home-start">
            {started
              ? next
                ? `Continuar por ${next.title}`
                : "Ha leído todas las páginas de contenido"
              : "Todavía no ha leído ninguna página"}
          </h2>
          <p className={css.startText}>
            Las {progressTotal.total} páginas de contenido están ordenadas para leerse en secuencia. El progreso de
            abajo se llena a medida que las marca como leídas.
          </p>
        </div>
        <div className={css.startActions}>
          {next ? (
            <Link className={css.primaryAction} to={routes.page(slug, next.slug)}>
              <UiIcon name="file" size={15} />
              {started ? "Continuar" : `Empezar por ${nextDivision?.label ?? next.title}`}
            </Link>
          ) : (
            <Link className={css.primaryAction} to={routes.wiki(slug)}>
              <UiIcon name="check" size={15} />
              Repasar el wiki
            </Link>
          )}
          <Link className={css.secondaryAction} to={routes.wiki(slug)}>
            <Icon name="book" size={15} />
            Todo el wiki
          </Link>
        </div>
      </section>

      <section className={css.progress} aria-labelledby="home-progress">
        <div className={css.progressHead}>
          <h1 className={css.h1} id="home-progress">
            Progreso
          </h1>
          <span className={css.progressCount}>
            {progressTotal.done} / {progressTotal.total} páginas
          </span>
        </div>
        <div className={css.totalTrack}>
          <span className={css.totalFill} style={{ width: `${Math.round(progressTotal.ratio * 100)}%` }} />
        </div>
        <div className={css.rows}>
          {model.visibleDivisions.map((division) => {
            const p = model.progress(division.key);
            return (
              <Link
                key={division.key}
                className={css.row}
                to={routes.division(slug, division.key)}
                style={{ ["--ucol" as string]: division.color }}
              >
                <span className={css.rowDot} aria-hidden="true" />
                <span className={css.rowLabel}>{division.label}</span>
                <span className={css.rowTrack}>
                  <span className={css.rowFill} style={{ width: `${Math.round(p.ratio * 100)}%` }} />
                </span>
                <span className={css.rowCount}>
                  {p.done}/{p.total}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {review.length ? (
        <section className={css.review} aria-labelledby="home-review">
          <span className={`${css.eyebrow} ${css.eyebrowAccent}`} id="home-review">
            <Icon name="circle" size={14} />
            REPASO DE HOY
          </span>
          <div className={css.reviewGrid}>
            {review.map((page) => {
              const division = model.division(model.divisionOf(page));
              return (
                <Link key={page.slug} className={css.reviewCard} to={routes.page(slug, page.slug)}>
                  <span className={css.reviewMeta}>
                    {division?.short ?? "—"} · {model.typeLabel(page.type).toUpperCase()}
                  </span>
                  <span className={css.reviewTitle}>{page.title}</span>
                  <span className={css.reviewNum}>{pad2(model.positionOf(page.slug))}</span>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function EmptySubject({ name, slug }: { name: string; slug: string }) {
  return (
    <div className={css.view}>
      <section className={css.startCard}>
        <div className={css.startBody}>
          <span className={css.eyebrow}>
            <Icon name="clock" size={14} />
            SIN SINCRONIZAR
          </span>
          <h2 className={css.startTitle}>{name} todavía no tiene páginas</h2>
          <p className={css.startText}>
            La materia existe en la plataforma, pero su wiki no se ha sincronizado. Desde la carpeta del repositorio,
            con el API levantado:
          </p>
          <pre className={css.command}>
            <code>pnpm sinapsis -- sync --config /ruta/a/{slug}/sinapsis.config.json</code>
          </pre>
          <p className={css.startText}>
            El comando compila el wiki markdown y lo sube; al volver a esta pantalla el índice ya muestra las
            divisiones con sus páginas.
          </p>
        </div>
      </section>
    </div>
  );
}
