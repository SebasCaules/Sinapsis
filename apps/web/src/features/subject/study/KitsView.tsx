/**
 * Kits de estudio: paquetes que juntan páginas, mazos, quizzes y herramientas
 * de la materia alrededor de un tema («Todo para el parcial de descriptiva»).
 * La lista muestra de qué está hecho cada kit y cuánto de su lectura va hecha.
 */
import { Link } from "react-router-dom";
import { plural, routes } from "@sinapsis/contract";
import { Icon } from "@/components/platform";
import { useSubjectCtx } from "../context";
import { ErrorCard, WideSkeleton } from "../components/States";
import { kitToolViews } from "./KitView";
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

  /* Páginas DISTINTAS: los kits comparten páginas a propósito (el parcial repasa
     lo del parcialito), así que la suma con repetidos dice «80 páginas que leer»
     donde hay 44. */
  const pages = new Set(kits.flatMap((k) => k.kit.pages)).size;

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
          /* Los mismos lanzadores que dibuja el detalle del kit: lo que el
             rail no sabe abrir tampoco se cuenta acá. */
          const tools = kitToolViews(model, slug, kit.tools);
          const accent = stat.color ?? model.division(kit.divisions[0] ?? "")?.color ?? "var(--primary)";
          const pct = Math.round(stat.readRatio * 100);
          return (
            <Link
              key={kit.id}
              className={css.card}
              style={{ ["--ucol" as string]: accent }}
              to={routes.kit(slug, kit.id)}
              data-testid="kit-card"
              data-kit={kit.id}
            >
              <div className={css.cardHead}>
                <DivisionChips model={model} keys={kit.divisions} max={3} />
                <span className={css.cardHeadRight}>
                  {stat.due > 0 ? <span className={css.due}>{stat.due} por repasar</span> : null}
                  <span className={css.pct}>{pct}%</span>
                </span>
              </div>

              <div className={css.cardTitleRow}>
                <span className={css.pill} aria-hidden="true">
                  <Icon name={stat.icon} size={20} />
                </span>
                <h2 className={css.cardTitle}>{kit.title}</h2>
              </div>
              {/* El recorte a cuatro líneas todavía puede cortar un resumen largo:
                  el `title` deja el texto entero al alcance sin romper la grilla. */}
              {kit.description ? (
                <p className={css.cardText} title={kit.description}>
                  {kit.description}
                </p>
              ) : null}

              <ul className={css.parts}>
                {tools.length ? (
                  <li>
                    <b className={css.partValue}>{tools.length}</b>{" "}
                    {plural(tools.length, "herramienta", "herramientas")}
                  </li>
                ) : null}
                <li>
                  <b className={css.partValue}>{kit.pages.length}</b>{" "}
                  {plural(kit.pages.length, "página", "páginas")}
                </li>
                {/* Lo que está en cero no se dibuja: seis de los ocho kits de
                    Proba decían «0 quizzes» sin que eso informe nada. */}
                {stat.decks.length ? (
                  <li>
                    <b className={css.partValue}>{stat.decks.length}</b>{" "}
                    {plural(stat.decks.length, "mazo", "mazos")}
                  </li>
                ) : null}
                {stat.quizzes.length ? (
                  <li>
                    <b className={css.partValue}>{stat.quizzes.length}</b>{" "}
                    {plural(stat.quizzes.length, "quiz", "quizzes")}
                  </li>
                ) : null}
              </ul>

              <div className={css.cardFoot}>
                <Bar
                  ratio={stat.readRatio}
                  color={accent}
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

      <div className={css.foot}>
        <ActionLink to={routes.plan(slug)}>
          <Icon name="map" size={15} />
          Ir al plan de estudio
        </ActionLink>
      </div>
    </StudyView>
  );
}

export default KitsView;
