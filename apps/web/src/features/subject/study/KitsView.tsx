/**
 * Kits de estudio: paquetes que juntan páginas, mazos, quizzes y herramientas
 * de la materia alrededor de un tema («Todo para el parcial de descriptiva»).
 * La lista muestra de qué está hecho cada kit y cuánto de su lectura va hecha.
 */
import { Link } from "react-router-dom";
import { plural, routes } from "@sinapsis/contract";
import { useSubjectCtx } from "../context";
import { ErrorCard, WideSkeleton } from "../components/States";
import { ActionLink, Bar, DivisionChips, EmptyPanel, Stat, StudyHead, StudyView } from "./ui";
import { useStudy } from "./useStudy";
import css from "./KitsView.module.css";

export function KitsView() {
  const { slug, model } = useSubjectCtx();
  const { content, state, model: study } = useStudy(slug, model.studied);

  if (content.isError) return <ErrorCard error={content.error} subject={slug} />;
  /* «Por repasar» y el progreso de lectura salen del estado del usuario (bug 12). */
  if (state.isError) return <ErrorCard error={state.error} subject={slug} />;
  if (content.isPending) return <WideSkeleton />;

  const { kits } = study;

  if (!kits.length) {
    return (
      <StudyView>
        <EmptyPanel
          eyebrow="SIN KITS"
          title="Esta materia todavía no tiene kits"
          actions={
            <>
              <ActionLink to={routes.wiki(slug)} variant="primary">
                Todo el wiki
              </ActionLink>
              <ActionLink to={routes.plan(slug)}>Plan de estudio</ActionLink>
            </>
          }
        >
          <p className={css.text}>
            Los kits se declaran en <code className={css.code}>estudio/kits.json</code>: cada uno junta páginas del
            wiki, mazos, quizzes y herramientas del rail alrededor de un tema, para no tener que buscarlos sueltos.
          </p>
        </EmptyPanel>
      </StudyView>
    );
  }

  const pages = kits.reduce((n, k) => n + k.pages.length, 0);

  return (
    <StudyView>
      <StudyHead
        icon="grid"
        eyebrow="TODO JUNTO"
        title="Kits de estudio"
        lead="Cada kit reúne lo que hace falta para un tema: las páginas que hay que leer, los mazos que hay que repasar, los quizzes y las herramientas de la materia."
        aside={
          <div className={css.totals}>
            <Stat value={kits.length} label="KITS" />
            <Stat value={pages} label="PÁGINAS" />
          </div>
        }
      />

      <div className={css.grid}>
        {kits.map((stat) => {
          const { kit } = stat;
          /* Solo se cuentan las herramientas que el rail sabe abrir: es lo que
             después dibuja el detalle del kit. */
          const tools = kit.tools.filter((id) => model.railItem(id));
          return (
            <Link
              key={kit.id}
              className={css.card}
              to={routes.kit(slug, kit.id)}
              data-testid="kit-card"
              data-kit={kit.id}
            >
              <div className={css.cardHead}>
                <DivisionChips model={model} keys={kit.divisions} max={3} />
                {stat.due > 0 ? <span className={css.due}>{stat.due} por repasar</span> : null}
              </div>

              <h2 className={css.cardTitle}>{kit.title}</h2>
              {kit.description ? <p className={css.cardText}>{kit.description}</p> : null}

              <ul className={css.parts}>
                <li>
                  <b className={css.partValue}>{kit.pages.length}</b>{" "}
                  {plural(kit.pages.length, "página", "páginas")}
                </li>
                <li>
                  <b className={css.partValue}>{stat.decks.length}</b>{" "}
                  {plural(stat.decks.length, "mazo", "mazos")}
                </li>
                <li>
                  <b className={css.partValue}>{stat.quizzes.length}</b>{" "}
                  {plural(stat.quizzes.length, "quiz", "quizzes")}
                </li>
                {tools.length ? (
                  <li>
                    <b className={css.partValue}>{tools.length}</b>{" "}
                    {plural(tools.length, "herramienta", "herramientas")}
                  </li>
                ) : null}
              </ul>

              <div className={css.cardFoot}>
                <Bar
                  ratio={stat.readRatio}
                  label={`${kit.title}: ${stat.read} de ${kit.pages.length} páginas leídas`}
                />
                <span className={css.readLabel}>
                  {stat.read}/{kit.pages.length} leídas
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </StudyView>
  );
}

export default KitsView;
