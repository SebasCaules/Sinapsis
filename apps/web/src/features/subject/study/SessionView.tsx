/**
 * Flashcards · la sesión de repaso. Una tarjeta grande y centrada: anverso,
 * vuelta (clic, Espacio o Intro) y cuatro notas con atajo 1-4.
 *
 * Reglas de la sesión:
 *  - La cola sale del modelo (`cardsOf`) UNA vez, al entrar: calificar no la
 *    rearma, o la tarjeta recién contestada saltaría de lugar bajo el cursor.
 *  - «Otra vez» (nota 1) devuelve la tarjeta al final de la cola: la sesión no
 *    termina hasta que todas salieron bien al menos una vez.
 *  - El próximo intervalo de cada botón lo calcula `sm2` del contrato, con el
 *    estado VIGENTE de la tarjeta (el optimista incluido): lo que promete el
 *    botón es lo que va a guardar el API.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { plural, routes, type SrsGrade } from "@sinapsis/contract";
import { Icon, UiIcon, useToast } from "@/components/platform";
import { isTypingTarget } from "@/lib/keyboard";
import { useSubjectCtx } from "../context";
import { ErrorCard, WideSkeleton } from "../components/States";
import { Markdown } from "../markdown/Markdown";
import { GRADES, GRADE_LABEL, intervalPreview, parseMode, type CardEntry, type SessionMode } from "./model";
import { resolveSession } from "./session";
import { ActionLink, Bar, DivisionChip, EmptyPanel, Kbd } from "./ui";
import { useStudy } from "./useStudy";
import css from "./SessionView.module.css";

const MODE_LABEL: Record<SessionMode, string> = {
  vencidas: "VENCIDAS",
  todo: "TODO EL MAZO",
  nuevas: "NUEVAS",
};

interface SessionState {
  /** Las tarjetas únicas de la sesión, en el orden en que salieron de la cola. */
  cards: CardEntry[];
  /** La cola viva: las «Otra vez» se agregan al final. */
  queue: CardEntry[];
  at: number;
  /** Ids que ya salieron con nota ≥ 2 (lo que mide la barra). */
  settled: string[];
  counts: Record<SrsGrade, number>;
  startedAt: number;
  endedAt: number | null;
}

function startSession(cards: CardEntry[]): SessionState {
  return {
    cards,
    queue: cards.slice(),
    at: 0,
    settled: [],
    counts: { 1: 0, 2: 0, 3: 0, 4: 0 },
    startedAt: Date.now(),
    endedAt: cards.length ? null : Date.now(),
  };
}

/** Las notas se guardan en un registro fijo; el acceso indexado va por acá. */
const countOf = (counts: Record<SrsGrade, number>, grade: SrsGrade): number => counts[grade] ?? 0;

/** «4 min 12 s» / «48 s». */
export function formatElapsed(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  const min = Math.floor(total / 60);
  const sec = total % 60;
  return min ? `${min} min ${sec} s` : `${sec} s`;
}

export function SessionView() {
  const { slug, model } = useSubjectCtx();
  const { deck: deckParam = "" } = useParams();
  const [params] = useSearchParams();
  const mode = parseMode(params.get("modo"));
  const navigate = useNavigate();
  const { toast } = useToast();

  const { content, state, model: study, grade } = useStudy(slug);
  const ready = content.isSuccess && !state.isPending;

  const [session, setSession] = useState<SessionState | null>(null);
  const [flipped, setFlipped] = useState(false);

  const target = ready ? resolveSession(study, deckParam) : null;
  /* La cola se arma una sola vez por (mazo, modo): `study` cambia de identidad
     con cada calificación y no puede estar entre las dependencias, o la tarjeta
     recién contestada saltaría de lugar. */
  const deckKey = target?.deckIds ? target.deckIds.join(",") : "*";

  useEffect(() => {
    if (!ready) return;
    setSession(startSession(target ? study.cardsOf(target.deckIds, mode) : []));
    setFlipped(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, deckParam, deckKey, mode]);

  /** «Repetir» rehace la MISMA sesión: las tarjetas ya no están vencidas. */
  const repeat = useCallback(() => {
    setSession((prev) => (prev ? startSession(prev.cards) : prev));
    setFlipped(false);
  }, []);

  const current: CardEntry | null = session ? (session.queue[session.at] ?? null) : null;
  const done = !!session && session.at >= session.queue.length;

  const exists = useCallback((s: string) => model.bySlug.has(s), [model]);

  const answer = useCallback(
    (value: SrsGrade) => {
      if (!session || !current || !flipped) return;
      const cardId = current.card.id;
      setSession((prev) => {
        if (!prev) return prev;
        const queue = value === 1 ? [...prev.queue, current] : prev.queue;
        const at = prev.at + 1;
        const settled = value === 1 ? prev.settled : [...new Set([...prev.settled, cardId])];
        return {
          ...prev,
          queue,
          at,
          settled,
          counts: { ...prev.counts, [value]: countOf(prev.counts, value) + 1 },
          endedAt: at >= queue.length ? Date.now() : null,
        };
      });
      setFlipped(false);
      void grade(cardId, value).catch(() => toast("No se pudo guardar la calificación.", "bad"));
    },
    [session, current, flipped, grade, toast],
  );

  /* Atajos: Espacio / Intro dan vuelta, 1-4 califican, Esc vuelve a los mazos. */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target) || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === "Escape") {
        event.preventDefault();
        navigate(routes.flashcards(slug));
        return;
      }
      if (!current) return;
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        setFlipped((f) => !f);
        return;
      }
      const n = Number(event.key);
      if (flipped && n >= 1 && n <= 4) {
        event.preventDefault();
        answer(n as SrsGrade);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answer, current, flipped, navigate, slug]);

  const previews = useMemo(() => {
    if (!current) return null;
    const prev = study.srsOf(current.card.id);
    return GRADES.map((g) => intervalPreview(prev, g, study.now));
  }, [current, study]);

  if (content.isError) return <ErrorCard error={content.error} subject={slug} />;
  if (!ready || !session) return <WideSkeleton />;

  if (!target) {
    return (
      <div className={css.view}>
        <EmptyPanel
          eyebrow="NO ENCONTRADO"
          title="Ese mazo no existe en la materia"
          actions={
            <ActionLink to={routes.flashcards(slug)} variant="primary">
              Volver a los mazos
            </ActionLink>
          }
        >
          <p className={css.text}>Puede que el mazo se haya renombrado en el último sync del wiki.</p>
        </EmptyPanel>
      </div>
    );
  }

  const total = session?.cards.length ?? 0;
  const settled = session?.settled.length ?? 0;
  const position = Math.min(settled + 1, total);
  const division = current?.card.division ? model.division(current.card.division) : null;

  if (session && !total) {
    return (
      <div className={css.view}>
        <EmptyPanel
          eyebrow="NADA PENDIENTE"
          title={
            mode === "nuevas"
              ? "No quedan tarjetas nuevas en este mazo"
              : "No hay tarjetas vencidas en este mazo"
          }
          actions={
            <>
              <ActionLink to={`${routes.deck(slug, deckParam)}?modo=todo`} variant="primary">
                Estudiar todo igual
              </ActionLink>
              <ActionLink to={routes.flashcards(slug)}>Volver a los mazos</ActionLink>
            </>
          }
        >
          <p className={css.text}>
            El repaso espaciado las vuelve a poner en la cola cuando toque. Mientras tanto puede repasar el mazo
            entero.
          </p>
        </EmptyPanel>
      </div>
    );
  }

  return (
    <div className={css.view}>
      <header className={css.head}>
        <Link className={css.back} to={routes.flashcards(slug)}>
          <UiIcon name="back" size={15} />
          Mazos
        </Link>
        <div className={css.headTitle}>
          <span className={css.eyebrow}>{MODE_LABEL[mode]}</span>
          <h1 className={css.title}>{target.title}</h1>
        </div>
        <span className={css.counter} data-testid="session-counter">
          {position} / {total}
        </span>
      </header>

      <Bar ratio={total ? settled / total : 0} className={css.progress} />

      {done ? (
        <Summary session={session} slug={slug} onRepeat={repeat} />
      ) : current ? (
        <>
          <div className={css.stage}>
            <div
              className={css.flip}
              data-flipped={flipped ? "true" : "false"}
              role="button"
              tabIndex={0}
              aria-label={flipped ? "Ocultar la respuesta" : "Ver la respuesta"}
              onClick={() => setFlipped((f) => !f)}
              onKeyDown={(event) => {
                if (event.key === " " || event.key === "Enter") {
                  event.preventDefault();
                  setFlipped((f) => !f);
                }
              }}
            >
              <div className={css.face} aria-hidden={flipped}>
                <span className={css.faceTag}>
                  {division ? <DivisionChip division={division} /> : null}
                  <span className={css.faceKind}>ANVERSO</span>
                </span>
                <div className={css.faceBody}>
                  <Markdown body={current.card.front} subject={slug} exists={exists} />
                </div>
                <span className={css.hint}>
                  <Kbd>Espacio</Kbd> para ver la respuesta
                </span>
              </div>

              <div className={`${css.face} ${css.faceBack}`} aria-hidden={!flipped}>
                <span className={css.faceTag}>
                  <span className={css.faceKind}>REVERSO</span>
                </span>
                <div className={css.faceBody}>
                  <Markdown body={current.card.back} subject={slug} exists={exists} />
                </div>
              </div>
            </div>
          </div>

          <div className={css.underCard}>
            {flipped && current.card.page && model.bySlug.has(current.card.page) ? (
              <Link className={css.wikiLink} to={routes.page(slug, current.card.page)}>
                <Icon name="book" size={14} />
                Ver en el wiki
              </Link>
            ) : (
              <span className={css.queueNote}>
                {session && session.queue.length - session.at > 1
                  ? `Quedan ${session.queue.length - session.at - 1} en la cola`
                  : "Última de la cola"}
              </span>
            )}
          </div>

          <div className={css.grades} role="group" aria-label="Calificar la tarjeta">
            {GRADES.map((g, i) => (
              <button
                key={g}
                type="button"
                className={css.grade}
                data-grade={g}
                disabled={!flipped}
                onClick={() => answer(g)}
              >
                <Kbd>{g}</Kbd>
                <span className={css.gradeLabel}>{GRADE_LABEL[g]}</span>
                <span className={css.gradeInterval}>{previews?.[i] ?? "—"}</span>
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

function Summary({
  session,
  slug,
  onRepeat,
}: {
  session: SessionState;
  slug: string;
  onRepeat: () => void;
}) {
  const elapsed = formatElapsed((session.endedAt ?? Date.now()) - session.startedAt);
  const answered = GRADES.reduce((n, g) => n + countOf(session.counts, g), 0);
  return (
    <section className={css.summary} aria-live="polite">
      <span className={css.eyebrow}>SESIÓN TERMINADA</span>
      <h2 className={css.summaryTitle}>
        {session.cards.length} {plural(session.cards.length, "tarjeta repasada", "tarjetas repasadas")}
      </h2>
      <p className={css.text}>
        Tardó <strong className={css.mono}>{elapsed}</strong> en {answered}{" "}
        {plural(answered, "respuesta", "respuestas")}. Las que calificó «Otra vez» volvieron a la cola hasta salir
        bien.
      </p>
      <div className={css.summaryGrid}>
        {GRADES.map((g) => (
          <div key={g} className={css.summaryCell} data-grade={g}>
            <span className={css.summaryValue}>{countOf(session.counts, g)}</span>
            <span className={css.summaryLabel}>{GRADE_LABEL[g]?.toUpperCase()}</span>
          </div>
        ))}
      </div>
      <div className={css.summaryActions}>
        <button type="button" className={css.repeat} onClick={onRepeat}>
          <UiIcon name="check" size={15} />
          Repetir
        </button>
        <ActionLink to={routes.flashcards(slug)}>Volver a los mazos</ActionLink>
      </div>
    </section>
  );
}

export default SessionView;
