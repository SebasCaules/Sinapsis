/**
 * Quiz · una pregunta a la vez. Al elegir se revela la respuesta (correcta en
 * verde, la elegida en rojo si erró) con su explicación; al final, el resultado
 * con las falladas y el enlace a la página del wiki que las explica.
 *
 * Como el baseline (study.js:195, 219): las preguntas se MEZCLAN en cada partida
 * y `?n=` recorta la tanda (5, 10, 15…), para poder practicar dos minutos sin
 * pasar el banco entero.
 *
 * La partida en curso se guarda en el navegador (`quizStore`): salir a otra
 * vista y volver la reanuda donde iba, como la `quizSession` de módulo del
 * baseline. Se descarta al ver el resultado.
 *
 * El intento se registra UNA sola vez por partida (`recordAttempt`), aunque el
 * componente se vuelva a montar: lo guarda una marca por partida. Una repesca o
 * una tanda corta no lo registran: su puntaje no es comparable con el del quiz
 * entero, que es lo que muestra «mejor puntaje».
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { plural, routes, type QuizOption, type QuizQuestion } from "@sinapsis/contract";
import { Icon, UiIcon, useToast } from "@/components/platform";
import { isTypingTarget } from "@/lib/keyboard";
import { useSubjectCtx } from "../context";
import { ErrorCard, WideSkeleton } from "../components/States";
import { MathText } from "../components/MathText";
import { Markdown } from "../markdown/Markdown";
import { recordActivity } from "../activity";
import { plainText, spokenMath } from "./model";
import { clearRun, readRun, saveRun, shuffle } from "./quizStore";
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
  /**
   * Repesca: la partida corre solo sobre las falladas. NO registra intento
   * (bug 11): su puntaje es sobre un subconjunto elegido para fallar y compararlo
   * con el del quiz completo —que es lo que muestran la lista y «mejor puntaje»—
   * no significa nada.
   */
  retry: boolean;
  /** Tanda corta pedida con `?n=`; null cuando la partida es el quiz entero. */
  n: number | null;
}

/**
 * El tono del resultado, con la escala del baseline (`ringColor`, study.js:281):
 * de 70 para arriba va bien, de 40 a 70 hay que repasar, y por debajo el
 * material está sin ver. Son tokens, no colores.
 */
const TONE_COLOR = { good: "var(--good)", warn: "var(--warn)", bad: "var(--bad)" } as const;
type Tone = keyof typeof TONE_COLOR;

const toneOf = (pct: number): Tone => (pct >= 70 ? "good" : pct >= 40 ? "warn" : "bad");

/** El veredicto del baseline (`quizVerdictMsg`, study.js:282-286). */
function verdictOf(pct: number): string {
  if (pct >= 70) return "Tema dominado.";
  if (pct >= 40) return "Conviene repasar los temas que falló.";
  return "Conviene repasar con las flashcards y el wiki.";
}

const isCorrect = (question: QuizQuestion, pick: number | undefined): boolean =>
  pick !== undefined && question.options[pick]?.correct === true;

/**
 * Nombre accesible de una opción: la letra, el texto legible y —una vez
 * revelada— qué papel juega. `alt` del contrato manda sobre cualquier
 * traducción automática de la matemática: la escribe quien redactó la pregunta.
 */
function optionLabel(option: QuizOption, index: number, revealed: boolean, chosen: boolean): string {
  const text = option.alt?.trim() || spokenMath(option.text);
  const head = `${LETTERS[index]}. ${text}`;
  if (!revealed) return head;
  if (option.correct) return chosen ? `${head} · su respuesta, correcta` : `${head} · correcta`;
  return chosen ? `${head} · su respuesta, incorrecta` : head;
}

export function QuizView() {
  const { slug, model } = useSubjectCtx();
  const { quiz: quizId = "" } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { content, model: study, recordAttempt } = useStudy(slug);

  const stat = study.quiz(quizId);
  const [params] = useSearchParams();
  /* `?n=5` / `?n=10`: la tanda corta del baseline. Cualquier otra cosa es el
     quiz entero. */
  const rawN = params.get("n");
  const limit = rawN && /^[1-9]\d{0,2}$/.test(rawN) ? Number(rawN) : null;

  const [run, setRun] = useState<Run | null>(null);
  const recorded = useRef<number | null>(null);

  /** Una partida nueva: mezclada y recortada a la tanda pedida. */
  const freshRun = useCallback(
    (all: QuizQuestion[]): Run => {
      const mixed = shuffle(all);
      const n = limit !== null && limit < mixed.length ? limit : null;
      return { key: Date.now(), questions: n ? mixed.slice(0, n) : mixed, at: 0, picks: {}, retry: false, n };
    },
    [limit],
  );

  /* La partida se arma al entrar (y al reintentar): `study` cambia de identidad
     con cada intento registrado y no puede estar entre las dependencias.
     Si hay una partida guardada de ESTE quiz y de esta misma longitud, se
     reanuda en vez de empezar de cero. */
  useEffect(() => {
    if (!content.isSuccess) return;
    const all = study.quiz(quizId)?.quiz.questions ?? [];
    if (!all.length) {
      setRun({ key: Date.now(), questions: [], at: 0, picks: {}, retry: false, n: null });
      return;
    }
    const saved = readRun(slug, quizId);
    const wanted = limit !== null && limit < all.length ? limit : null;
    if (saved && saved.n === wanted) {
      const byId = new Map(all.map((q) => [q.id, q]));
      const questions = saved.ids.map((id) => byId.get(id)).filter((q): q is QuizQuestion => !!q);
      /* Si el wiki reescribió el quiz, la partida vieja ya no se puede rehidratar. */
      if (questions.length === saved.ids.length) {
        setRun({
          key: Date.now(),
          questions,
          at: Math.min(saved.at, questions.length),
          picks: saved.picks,
          retry: saved.retry,
          n: saved.n,
        });
        return;
      }
      clearRun(slug, quizId);
    }
    setRun(freshRun(all));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content.isSuccess, quizId, slug, limit]);

  /* La partida viaja al navegador con cada respuesta; al llegar al resultado se
     borra (verla ES terminarla). */
  useEffect(() => {
    if (!run || !run.questions.length) return;
    if (run.at >= run.questions.length) {
      clearRun(slug, quizId);
      return;
    }
    saveRun(slug, {
      quizId,
      ids: run.questions.map((q) => q.id),
      at: run.at,
      picks: run.picks,
      retry: run.retry,
      n: run.n,
    });
  }, [run, slug, quizId]);

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

  /** La repesca corre solo sobre las falladas, también mezcladas. */
  const retryWrong = useCallback((questions: QuizQuestion[]) => {
    setRun({ key: Date.now(), questions: shuffle(questions), at: 0, picks: {}, retry: true, n: null });
  }, []);

  /* El intento se registra al terminar, una vez por partida y solo si la partida
     fue sobre el quiz COMPLETO (bug 11). */
  useEffect(() => {
    if (!run || !finished || run.retry || run.n !== null || recorded.current === run.key) return;
    recorded.current = run.key;
    void recordAttempt(quizId, score, run.questions.length).catch(() =>
      toast("No se pudo registrar el intento.", "bad"),
    );
  }, [finished, run, quizId, score, recordAttempt, toast]);

  /* Responder un quiz cuenta como haber estudiado, como el `A.markActivity()`
     con el que el baseline cierra el resultado (study.js:240). Vale también
     para una repesca o una tanda corta: el día se estudió igual. */
  useEffect(() => {
    if (finished) recordActivity(slug);
  }, [finished, slug]);

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
          <p className={css.text}>Puede que se haya renombrado en la última sincronización del wiki.</p>
        </EmptyPanel>
      </div>
    );
  }

  const total = run.questions.length;
  /* La unidad de una pregunta puede venir declarada o salir de la página del
     wiki que la explica, como en el baseline (`BY_SLUG[q.slug].unidad`,
     study.js:322). Sin esto el chip no aparecía nunca: el material de Proba no
     declara `division` en ninguna pregunta. */
  const pageOf = current?.page ? model.bySlug.get(current.page) : undefined;
  const divisionKey = current?.division ?? (pageOf ? model.divisionOf(pageOf) : undefined);
  const division = divisionKey ? model.division(divisionKey) : null;

  /* Marcador en curso, como el «· Aciertos: N» del baseline (study.js:247): se
     cuenta sobre lo YA respondido, no sobre lo que falta. */
  const hits = run.questions.filter((q) => run.picks[q.id] !== undefined && isCorrect(q, run.picks[q.id])).length;

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
        <span className={css.score} data-testid="quiz-score">
          Aciertos: <strong className={css.scoreValue}>{hits}</strong>
        </span>
        <span className={css.counter} data-testid="quiz-counter">
          {Math.min(run.at + 1, total)} / {total}
        </span>
      </header>

      <Bar
        ratio={run.at / total}
        className={css.progress}
        label={`Preguntas respondidas: ${Math.min(run.at, total)} de ${total}`}
      />

      {finished ? (
        <Result
          slug={slug}
          score={score}
          total={total}
          wrong={wrong}
          picks={run.picks}
          retry={run.retry}
          partial={run.n !== null}
          onRetryWrong={() => retryWrong(wrong)}
          onRetryAll={() => setRun(freshRun(stat.quiz.questions))}
        />
      ) : current ? (
        <>
          {/* El `aria-live` NO va acá: con toda la tarjeta viva, cada pregunta
              se releía entera al pasar de una a otra. Vive en el panel de
              revelado, que es lo único que aparece sin que se navegue (U36). */}
          <section className={css.card} data-testid="quiz-card" data-question={current.id}>
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
                         nombre accesible más allá de su letra. Y tras revelar,
                         el color es lo único que decía cuál era la correcta y
                         cuál había marcado el usuario (U6). */
                      aria-label={optionLabel(option, i, revealed, pick === i)}
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
              <div className={css.reveal} data-ok={isCorrect(current, pick) ? "true" : "false"} aria-live="polite">
                <span className={css.revealTag}>
                  {isCorrect(current, pick) ? "CORRECTO" : "INCORRECTO"}
                </span>
                {/* Cuál era la correcta, EN TEXTO (study.js:274): antes solo lo
                    decían el color y el tilde sobre la opción. */}
                {isCorrect(current, pick) ? null : (
                  <p className={css.revealAnswer}>
                    La respuesta correcta es {LETTERS[current.options.findIndex((o) => o.correct)] ?? "—"}.
                  </p>
                )}
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
            <button
              type="button"
              className={css.next}
              onClick={next}
              disabled={!revealed}
              aria-keyshortcuts="Enter"
            >
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
  retry,
  partial,
  onRetryWrong,
  onRetryAll,
}: {
  slug: string;
  score: number;
  total: number;
  wrong: QuizQuestion[];
  picks: Record<string, number>;
  /** La partida fue una repesca: su puntaje no se registra (bug 11). */
  retry: boolean;
  /** La partida fue una tanda corta (`?n=`): tampoco se registra. */
  partial: boolean;
  onRetryWrong: () => void;
  onRetryAll: () => void;
}) {
  const { model } = useSubjectCtx();
  const pct = total ? Math.round((score / total) * 100) : 0;
  const tone = toneOf(pct);
  const tail = wrong.length
    ? ` Quedan ${wrong.length} ${plural(wrong.length, "pregunta", "preguntas")} para repasar: cada una enlaza a la página del wiki que la explica.`
    : "";
  return (
    /* El tono gradúa el anillo y el filo de la tarjeta: un 20 % y un 90 % no se
       pueden ver iguales (study.js:235 y :281). */
    <section className={css.result} data-tone={tone} aria-live="polite">
      <div className={css.resultHead}>
        <Ring
          ratio={total ? score / total : 0}
          size={104}
          color={TONE_COLOR[tone]}
          label={`${pct} por ciento de aciertos`}
        />
        <div className={css.resultText}>
          <span className={css.eyebrow}>{retry ? "REPESCA" : partial ? "TANDA CORTA" : "RESULTADO"}</span>
          <h2 className={css.resultTitle}>
            <span className={css.resultScore}>
              {score}
              <span className={css.resultOf}>/{total}</span>
            </span>{" "}
            {plural(score, "respuesta correcta", "respuestas correctas")}
          </h2>
          <p className={css.text}>
            {retry
              ? "Esta repesca no queda registrada: el puntaje se guarda solo cuando responde el quiz completo."
              : partial
                ? `${verdictOf(pct)} Esta tanda no queda registrada: el puntaje se guarda solo cuando responde el quiz completo.`
                : pct === 100
                  ? "Sin errores. El intento queda registrado como su mejor puntaje."
                  : `${verdictOf(pct)}${tail}`}
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
        {/* Un resultado bajo tiene que tener salida hacia el repaso, que es lo
            que dice el propio veredicto del baseline. */}
        {tone === "bad" ? <ActionLink to={routes.flashcards(slug)}>Repasar con las flashcards</ActionLink> : null}
        <ActionLink to={routes.quiz(slug)}>Volver</ActionLink>
      </div>
    </section>
  );
}

export default QuizView;
