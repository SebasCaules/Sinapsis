/**
 * Quiz · lista. Cada quiz con sus preguntas, su división, el mejor puntaje y el
 * último intento (los dos salen de `state.attempts` a través del modelo).
 */
import { plural, routes } from "@sinapsis/contract";
import { useSubjectCtx } from "../context";
import { ErrorCard, WideSkeleton } from "../components/States";
import { relativeSince } from "./model";
import { ActionLink, Bar, DivisionChip, EmptyPanel, Stat, StudyHead, StudyView } from "./ui";
import { useStudy } from "./useStudy";
import css from "./QuizzesView.module.css";

export function QuizzesView() {
  const { slug, model } = useSubjectCtx();
  const { content, state, model: study } = useStudy(slug);

  if (content.isError) return <ErrorCard error={content.error} subject={slug} />;
  /* El mejor puntaje y el último intento salen del estado del usuario: sin él,
     todos los quizzes decían «Sin intentos» (bug 12). */
  if (state.isError) return <ErrorCard error={state.error} subject={slug} />;
  if (content.isPending) return <WideSkeleton />;

  const { quizzes } = study;

  if (!quizzes.length) {
    return (
      <StudyView>
        <EmptyPanel
          eyebrow="SIN QUIZZES"
          title="Esta materia todavía no tiene quizzes"
          actions={
            <>
              <ActionLink to={routes.flashcards(slug)} variant="primary">
                Ir a las flashcards
              </ActionLink>
              <ActionLink to={routes.wiki(slug)}>Todo el wiki</ActionLink>
            </>
          }
        >
          <p className={css.text}>
            Los quizzes se escriben en la carpeta <code className={css.code}>estudio/</code> del wiki (un archivo
            markdown con <code className={css.code}>tipo: quiz</code> y una pregunta por cada{" "}
            <code className={css.code}>##</code>) y llegan con el próximo <code className={css.code}>sync</code>.
          </p>
        </EmptyPanel>
      </StudyView>
    );
  }

  const questions = quizzes.reduce((n, q) => n + q.questions, 0);
  const tried = quizzes.filter((q) => q.attempts.length > 0).length;

  return (
    <StudyView>
      <StudyHead
        icon="quiz"
        eyebrow="PONERSE A PRUEBA"
        title="Quiz"
        lead="Una pregunta a la vez, con la explicación al descubrir la respuesta. El resultado queda registrado para comparar con el próximo intento."
        aside={
          <div className={css.totals}>
            <Stat value={quizzes.length} label="QUIZZES" />
            <Stat value={questions} label="PREGUNTAS" />
            <Stat value={`${tried}/${quizzes.length}`} label="INTENTADOS" tone="mastered" />
          </div>
        }
      />

      <ul className={css.list}>
        {quizzes.map((stat) => {
          const { quiz } = stat;
          const division = quiz.division ? model.division(quiz.division) : null;
          return (
            <li key={quiz.id} className={css.row}>
              <div className={css.rowMain}>
                <div className={css.rowHead}>
                  {division ? <DivisionChip division={division} /> : null}
                  <span className={css.rowCount}>
                    {stat.questions} {plural(stat.questions, "pregunta", "preguntas")}
                  </span>
                </div>
                <h2 className={css.rowTitle}>{quiz.title}</h2>
                {quiz.description ? <p className={css.rowText}>{quiz.description}</p> : null}
              </div>

              <div className={css.rowScore}>
                {stat.best ? (
                  <>
                    <span className={css.best}>
                      {stat.best.score}
                      <span className={css.bestOf}>/{stat.best.total}</span>
                    </span>
                    <Bar
                      ratio={stat.bestPct === null ? 0 : stat.bestPct / 100}
                      className={css.bestBar}
                      label={`${quiz.title}: mejor puntaje ${stat.bestPct ?? 0} por ciento`}
                    />
                    <span className={css.rowMeta}>
                      Mejor {stat.bestPct} % · último {relativeSince(stat.last?.at ?? stat.best.at, study.now)}
                    </span>
                  </>
                ) : (
                  <span className={css.rowMeta}>Sin intentos</span>
                )}
              </div>

              <ActionLink to={routes.quizOne(slug, quiz.id)} variant={stat.best ? "secondary" : "primary"}>
                {stat.best ? "Reintentar" : "Empezar"}
              </ActionLink>
            </li>
          );
        })}
      </ul>
    </StudyView>
  );
}

export default QuizzesView;
