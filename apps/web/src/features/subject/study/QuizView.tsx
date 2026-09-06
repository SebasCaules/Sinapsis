/**
 * Quiz · una pregunta a la vez. Al elegir se revela la respuesta (correcta en
 * verde, la elegida en rojo si erró) con su explicación; al final, el resultado
 * con las falladas y el enlace a la página del wiki que las explica.
 *
 * El intento se registra UNA sola vez por partida (`recordAttempt`), aunque el
 * componente se vuelva a montar: lo guarda una marca por partida.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { plural, routes, type QuizQuestion } from "@sinapsis/contract";
import { Icon, UiIcon, useToast } from "@/components/platform";
import { isTypingTarget } from "@/lib/keyboard";
import { useSubjectCtx } from "../context";
import { ErrorCard, WideSkeleton } from "../components/States";
import { MathText } from "../components/MathText";
import { Markdown } from "../markdown/Markdown";
import { plainText } from "./model";
import { ActionLink, Bar, DivisionChip, EmptyPanel, Kbd, Ring } from "./ui";
import { useStudy } from "./useStudy";
import css from "./QuizView.module.css";

const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;

interface Run {
  /** Cambia con cada partida: es la marca que evita registrar dos veces el intento. */
  key: number;
  questions: QuizQuestion[];
  at: number;
  /** id de pregunta → índice de la opción elegida. */
  picks: Record<string, number>;
}

const isCorrect = (question: QuizQuestion, pick: number | undefined): boolean =>
  pick !== undefined && question.options[pick]?.correct === true;

export function QuizView() {
  const { slug, model } = useSubjectCtx();
  const { quiz: quizId = "" } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { content, model: study, recordAttempt } = useStudy(slug);

  const stat = study.quiz(quizId);
  const [run, setRun] = useState<Run | null>(null);
  const recorded = useRef<number | null>(null);

  /* La partida se arma al entrar (y al reintentar): `study` cambia de identidad
     con cada intento registrado y no puede estar entre las dependencias. */
  useEffect(() => {
    if (!content.isSuccess) return;
    const questions = study.quiz(quizId)?.quiz.questions ?? [];
    setRun({ key: Date.now(), questions, at: 0, picks: {} });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content.isSuccess, quizId]);

  const current = run ? (run.questions[run.at] ?? null) : null;
  const pick = current && run ? run.picks[current.id] : undefined;
  const revealed = pick !== undefined;
  const finished = !!run && run.questions.length > 0 && run.at >= run.questions.length;

  const wrong = useMemo(
    () => (run ? run.questions.filter((q) => !isCorrect(q, run.picks[q.id])) : []),
    [run],
  );
  const score = (run?.questions.length ?? 0) - wrong.length;

  const choose = useCallback(
    (index: number) => {
      setRun((prev) => {
        if (!prev) return prev;
        const q = prev.questions[prev.at];
        if (!q || prev.picks[q.id] !== undefined) return prev;
        return { ...prev, picks: { ...prev.picks, [q.id]: index } };
      });
    },
    [],
  );

  const next = useCallback(() => {
    setRun((prev) => (prev ? { ...prev, at: prev.at + 1 } : prev));
  }, []);

  const restart = useCallback((questions: QuizQuestion[]) => {
    setRun({ key: Date.now(), questions, at: 0, picks: {} });
  }, []);

  /* El intento se registra al terminar, una vez por partida. */
  useEffect(() => {
    if (!run || !finished || recorded.current === run.key) return;
    recorded.current = run.key;
    void recordAttempt(quizId, score, run.questions.length).catch(() =>
      toast("No se pudo registrar el intento.", "bad"),
    );
  }, [finished, run, quizId, score, recordAttempt, toast]);

  /* Atajos: A-D o 1-4 eligen, Intro/→ avanzan, Esc vuelve a la lista. */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target) || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === "Escape") {
        event.preventDefault();
        navigate(routes.quiz(slug));
        return;
      }
      if (!current) return;
      if (revealed) {
        if (event.key === "Enter" || event.key === " " || event.key === "ArrowRight") {
          event.preventDefault();
          next();
        }
        return;
      }
      const letter = LETTERS.indexOf(event.key.toUpperCase() as (typeof LETTERS)[number]);
      const digit = Number(event.key) - 1;
      const index = letter >= 0 ? letter : Number.isInteger(digit) ? digit : -1;
      if (index >= 0 && index < current.options.length) {
        event.preventDefault();
        choose(index);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [choose, current, navigate, next, revealed, slug]);

  const exists = useCallback((s: string) => model.bySlug.has(s), [model]);

  if (content.isError) return <ErrorCard error={content.error} subject={slug} />;
  if (content.isPending || !run) return <WideSkeleton />;

  if (!stat || !run.questions.length) {
    return (
      <div className={css.view}>
        <EmptyPanel
          eyebrow="NO ENCONTRADO"
          title="Ese quiz no existe en la materia"
          actions={
            <ActionLink to={routes.quiz(slug)} variant="primary">
              Volver a los quizzes
            </ActionLink>
          }
        >
          <p className={css.text}>Puede que se haya renombrado en el último sync del wiki.</p>
        </EmptyPanel>
      </div>
    );
  }

  const total = run.questions.length;
  const division = current?.division ? model.division(current.division) : null;

  return (
    <div className={css.view}>
      <header className={css.head}>
        <Link className={css.back} to={routes.quiz(slug)}>
          <UiIcon name="back" size={15} />
          Quizzes
        </Link>
        <div className={css.headTitle}>
          <span className={css.eyebrow}>QUIZ</span>
          <h1 className={css.title}>{stat.quiz.title}</h1>
        </div>
        <span className={css.counter}>
          {Math.min(run.at + 1, total)} / {total}
        </span>
      </header>

      <Bar ratio={run.at / total} className={css.progress} />

      {finished ? (
        <Result
          slug={slug}
          score={score}
          total={total}
          wrong={wrong}
          picks={run.picks}
          onRetryWrong={() => restart(wrong)}
          onRetryAll={() => restart(stat.quiz.questions)}
        />
      ) : current ? (
        <>
          <section className={css.card} aria-live="polite">
            <div className={css.cardHead}>
              {division ? <DivisionChip division={division} /> : null}
              <span className={css.cardKind}>PREGUNTA {run.at + 1}</span>
            </div>
            <div className={css.prompt}>
              <Markdown body={current.prompt} subject={slug} exists={exists} />
            </div>

            <ul className={css.options}>
              {current.options.map((option, i) => {
                const state = !revealed
                  ? "idle"
                  : option.correct
                    ? "correct"
                    : pick === i
                      ? "wrong"
                      : "idle";
                return (
                  <li key={i}>
                    <button
                      type="button"
                      className={css.option}
                      data-state={state}
                      data-chosen={pick === i ? "true" : undefined}
                      disabled={revealed}
                      /* KaTeX dibuja la fórmula con `aria-hidden`: sin este
                         rótulo, una opción que es solo matemática no tiene
                         nombre accesible más allá de su letra. */
                      aria-label={`${LETTERS[i]}. ${option.text.replace(/\$/g, "")}`}
                      onClick={() => choose(i)}
                    >
                      <span className={css.letter}>{LETTERS[i]}</span>
                      <MathText className={css.optionText} text={option.text} />
                      {state === "correct" ? <UiIcon name="check" size={16} className={css.mark} /> : null}
                      {state === "wrong" ? <UiIcon name="close" size={16} className={css.mark} /> : null}
                    </button>
                  </li>
                );
              })}
            </ul>

            {revealed ? (
              <div className={css.reveal} data-ok={isCorrect(current, pick) ? "true" : "false"}>
                <span className={css.revealTag}>
                  {isCorrect(current, pick) ? "CORRECTO" : "INCORRECTO"}
                </span>
                {current.explanation ? (
                  <div className={css.explanation}>
                    <Markdown body={current.explanation} subject={slug} exists={exists} />
                  </div>
                ) : null}
                {current.page && model.bySlug.has(current.page) ? (
                  <Link className={css.wikiLink} to={routes.page(slug, current.page)}>
                    <Icon name="book" size={14} />
                    Ver en el wiki
                  </Link>
                ) : null}
              </div>
            ) : (
              <p className={css.hint}>
                Elija una opción con el ratón o con <Kbd>A</Kbd>–<Kbd>{LETTERS[current.options.length - 1]}</Kbd>.
              </p>
            )}
          </section>

          <div className={css.foot}>
            <button type="button" className={css.next} onClick={next} disabled={!revealed}>
              {run.at + 1 === total ? "Ver el resultado" : "Siguiente"}
              <UiIcon name="chevronRight" size={16} />
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}

function Result({
  slug,
  score,
  total,
  wrong,
  picks,
  onRetryWrong,
  onRetryAll,
}: {
  slug: string;
  score: number;
  total: number;
  wrong: QuizQuestion[];
  picks: Record<string, number>;
  onRetryWrong: () => void;
  onRetryAll: () => void;
}) {
  const { model } = useSubjectCtx();
  const pct = total ? Math.round((score / total) * 100) : 0;
  return (
    <section className={css.result} aria-live="polite">
      <div className={css.resultHead}>
        <Ring ratio={total ? score / total : 0} size={104} label={`${pct} por ciento`} />
        <div className={css.resultText}>
          <span className={css.eyebrow}>RESULTADO</span>
          <h2 className={css.resultTitle}>
            <span className={css.resultScore}>
              {score}
              <span className={css.resultOf}>/{total}</span>
            </span>{" "}
            {plural(score, "respuesta correcta", "respuestas correctas")}
          </h2>
          <p className={css.text}>
            {pct === 100
              ? "Sin errores. El intento queda registrado como su mejor puntaje."
              : `Quedan ${wrong.length} ${plural(wrong.length, "pregunta", "preguntas")} para repasar: cada una enlaza a la página del wiki que la explica.`}
          </p>
        </div>
      </div>

      {wrong.length ? (
        <ul className={css.wrongList}>
          {wrong.map((q) => {
            const chosen = picks[q.id];
            const right = q.options.findIndex((o) => o.correct);
            return (
              <li key={q.id} className={css.wrongItem}>
                <div className={css.wrongMain}>
                  <MathText className={css.wrongPrompt} text={plainText(q.prompt)} />
                  <span className={css.wrongAnswer}>
                    {chosen === undefined ? (
                      "Sin responder"
                    ) : (
                      <>
                        Marcó <strong>{LETTERS[chosen]}</strong>
                      </>
                    )}{" "}
                    · correcta <strong className={css.good}>{LETTERS[right] ?? "—"}</strong>
                  </span>
                </div>
                {q.page && model.bySlug.has(q.page) ? (
                  <Link className={css.wikiLink} to={routes.page(slug, q.page)}>
                    <Icon name="book" size={14} />
                    Ver en el wiki
                  </Link>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}

      <div className={css.resultActions}>
        {wrong.length ? (
          <button type="button" className={css.next} onClick={onRetryWrong}>
            Reintentar solo las falladas ({wrong.length})
          </button>
        ) : null}
        <button type="button" className={css.secondary} onClick={onRetryAll}>
          Repetir el quiz
        </button>
        <ActionLink to={routes.quiz(slug)}>Volver</ActionLink>
      </div>
    </section>
  );
}

export default QuizView;
