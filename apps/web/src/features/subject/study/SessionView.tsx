/**
 * Flashcards · la sesión de repaso. Una tarjeta grande y centrada: anverso,
 * vuelta (clic, Espacio o Intro) y cuatro notas con atajo 1-4.
 *
 * Reglas de la sesión:
 *  - La cola sale del modelo (`cardsOf`) UNA vez, al entrar: calificar no la
 *    rearma, o la tarjeta recién contestada saltaría de lugar bajo el cursor.
 *  - La cola se BARAJA al armarla, como el baseline (`shuffle(pool)` de
 *    study.js:101): dos entradas al mismo mazo no dan el mismo orden, y
 *    «Repetir» tampoco repite la secuencia.
 *  - «Otra vez» (nota 1) devuelve la tarjeta al final de la cola: la sesión no
 *    termina hasta que todas salieron bien al menos una vez.
 *  - El próximo intervalo de cada botón lo calcula `sm2` del contrato, con el
 *    estado VIGENTE de la tarjeta (el optimista incluido): lo que promete el
 *    botón es lo que va a guardar el API.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { plural, routes, type SrsGrade } from "@sinapsis/contract";
import { Icon, UiIcon, useToast } from "@/components/platform";
import { isTypingTarget } from "@/lib/keyboard";
import { useSubjectCtx } from "../context";
import { ErrorCard, WideSkeleton } from "../components/States";
import { Markdown } from "../markdown/Markdown";
import { recordActivity } from "../activity";
import { GRADES, GRADE_LABEL, intervalPreview, parseMode, type CardEntry, type SessionMode } from "./model";
import { shuffle } from "./quizStore";
import { resolveSession } from "./session";
import { ActionLink, Bar, DivisionChip, EmptyPanel, Kbd } from "./ui";
import { useStudy } from "./useStudy";
import css from "./SessionView.module.css";

/**
 * El modo «vencidas» abre la cola de hoy, que es vencidas MÁS nuevas (el mismo
 * criterio del baseline, core.js:1209): llamarla «VENCIDAS» mentía sobre lo que
 * hay en la cola cuando casi todo es material nunca visto.
 */
const MODE_LABEL: Record<SessionMode, string> = {
  vencidas: "PENDIENTES HOY",
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

/**
 * El orden de la sesión. El baseline baraja el mazo entero; acá se conserva
 * además el criterio de la cola de hoy —la más atrasada primero— barajando
 * DENTRO de cada día de atraso, y con las nuevas al final, también barajadas.
 * En los modos «todo» y «nuevas» no hay criterio que conservar: mezcla llana.
 */
function shuffleQueue(cards: readonly CardEntry[], mode: SessionMode): CardEntry[] {
  if (mode !== "vencidas") return shuffle(cards);
  const out: CardEntry[] = [];
  const fresh: CardEntry[] = [];
  let group: CardEntry[] = [];
  let day: string | null = null;
  for (const entry of cards) {
    /* Sin estado SRS es una tarjeta nueva: va al final, después de las vencidas. */
    if (!entry.srs) {
      fresh.push(entry);
      continue;
    }
    const key = entry.srs.due.slice(0, 10);
    if (key !== day) {
      out.push(...shuffle(group));
      group = [];
      day = key;
    }
    group.push(entry);
  }
  out.push(...shuffle(group), ...shuffle(fresh));
  return out;
}

function startSession(cards: readonly CardEntry[], mode: SessionMode): SessionState {
  const ordered = shuffleQueue(cards, mode);
  return {
    cards: ordered,
    queue: ordered.slice(),
    at: 0,
    settled: [],
    counts: { 1: 0, 2: 0, 3: 0, 4: 0 },
    startedAt: Date.now(),
    endedAt: ordered.length ? null : Date.now(),
  };
}

/** Las notas se guardan en un registro fijo; el acceso indexado va por acá. */
const countOf = (counts: Record<SrsGrade, number>, grade: SrsGrade): number => counts[grade] ?? 0;

/**
 * Qué decir cuando la cola sale vacía. Depende del MODO, no del mazo: «no hay
 * vencidas» y «el mazo no tiene tarjetas» son dos cosas distintas y la acción
 * que corresponde tampoco es la misma.
 */
function emptyForMode(mode: SessionMode): { eyebrow: string; title: string; text: string } {
  switch (mode) {
    case "nuevas":
      return {
        eyebrow: "NADA NUEVO",
        title: "No quedan tarjetas nuevas en este mazo",
        text: "Ya vio todas las tarjetas al menos una vez. Puede repasar el mazo entero cuando quiera.",
      };
    case "vencidas":
      return {
        eyebrow: "NADA PENDIENTE",
        title: "No hay tarjetas vencidas en este mazo",
        text: "El repaso espaciado las vuelve a poner en la cola cuando toque. Mientras tanto puede repasar el mazo entero.",
      };
    case "todo":
      return {
        eyebrow: "MAZO VACÍO",
        title: "Este mazo todavía no tiene tarjetas",
        text: "Las tarjetas se escriben en la carpeta «estudio/» del wiki y llegan con la próxima sincronización.",
      };
  }
}

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

  /* La cara que está de espaldas se marca `inert`: además de `aria-hidden`, saca
     del orden de tabulación los enlaces del markdown de la cara oculta, que se
     podían enfocar aunque no se vieran (U37). El atributo no está en los tipos
     de React 18, así que se aplica sobre el nodo. */
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    frontRef.current?.toggleAttribute("inert", flipped);
    backRef.current?.toggleAttribute("inert", !flipped);
  });

  const target = ready ? resolveSession(study, deckParam) : null;
  /* La cola se arma una sola vez por (mazo, modo): `study` cambia de identidad
     con cada calificación y no puede estar entre las dependencias, o la tarjeta
     recién contestada saltaría de lugar. */
  const deckKey = target?.deckIds ? target.deckIds.join(",") : "*";

  useEffect(() => {
    if (!ready) return;
    setSession(startSession(target ? study.cardsOf(target.deckIds, mode) : [], mode));
    setFlipped(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, deckParam, deckKey, mode]);

  /**
   * «Repetir» rehace la MISMA sesión (las tarjetas ya no están vencidas), pero
   * vuelve a barajar: repetir el mismo orden es memorizar la secuencia, no el
   * material — el baseline también rebaraja en `fc-restart` (study.js:166).
   */
  const repeat = useCallback(() => {
    setSession((prev) => (prev ? startSession(prev.cards, mode) : prev));
    setFlipped(false);
  }, [mode]);

  const current: CardEntry | null = session ? (session.queue[session.at] ?? null) : null;
  const done = !!session && session.at >= session.queue.length;

  const exists = useCallback((s: string) => model.bySlug.has(s), [model]);

  const answer = useCallback(
    (value: SrsGrade) => {
      if (!session || !current || !flipped) return;
      const cardId = current.card.id;
      const entry = current;
      setSession((prev) => {
        if (!prev) return prev;
        const queue = value === 1 ? [...prev.queue, entry] : prev.queue;
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
      /* Calificar cuenta como estudiar: es lo que enciende la racha del inicio
         (el `markActivity()` de core.js:1222). Vive en el navegador hasta que
         `StudyState` tenga su propio mapa de días. */
      recordActivity(slug);
      void grade(cardId, value).catch(() => {
        /* Si el API rechaza la nota, la tarjeta NO se pierde: vuelve al final de
           la cola y deja de contar como resuelta. Antes se avisaba con un aviso
           y la tarjeta desaparecía igual, sin estado SRS. La nota 1 ya volvió a
           la cola por su cuenta: ahí solo hace falta el aviso. */
        toast("No se pudo guardar la calificación: la tarjeta vuelve a la cola.", "bad");
        if (value === 1) return;
        setSession((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            queue: [...prev.queue, entry],
            settled: prev.settled.filter((id) => id !== cardId),
            counts: { ...prev.counts, [value]: Math.max(0, countOf(prev.counts, value) - 1) },
            endedAt: null,
          };
        });
      });
    },
    [session, current, flipped, grade, slug, toast],
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
        /* Un botón nativo ya convierte Espacio e Intro en su propio clic: si
           además corriera este atajo, la tarjeta se daría vuelta dos veces
           (bug 2). Las notas 1-4 sí valen con el foco en cualquier lado. */
        if (event.target instanceof HTMLElement && event.target.closest("button")) return;
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

  /* El foco vuelve a la tarjeta con cada tarjeta nueva y con cada vuelta, como
     hace el baseline en cada repintado (`fcCard.focus({preventScroll:true})`,
     study.js:151). Es lo que hace que un lector de pantalla anuncie la tarjeta
     que entró —y si está mostrando el anverso o la respuesta, que va en su
     nombre— y que Espacio y 1-4 funcionen sin ir a buscar el foco. No se usa
     `aria-live` en el cuerpo: con el foco encima, la tarjeta se leería dos
     veces. */
  const cardRef = useRef<HTMLDivElement>(null);
  const currentId = current?.card.id ?? null;
  useEffect(() => {
    if (!currentId) return;
    cardRef.current?.focus({ preventScroll: true });
  }, [currentId, flipped]);

  const previews = useMemo(() => {
    if (!current) return null;
    const prev = study.srsOf(current.card.id);
    return GRADES.map((g) => intervalPreview(prev, g, study.now));
  }, [current, study]);

  /* El estado del usuario es tan obligatorio como el material: sin él no se
     sabe qué está vencido, y tratarlo como «no hay nada» era mentir (bug 12). */
  if (content.isError) return <ErrorCard error={content.error} subject={slug} />;
  if (state.isError) return <ErrorCard error={state.error} subject={slug} />;
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
          <p className={css.text}>Puede que el mazo se haya renombrado en la última sincronización del wiki.</p>
        </EmptyPanel>
      </div>
    );
  }

  const total = session?.cards.length ?? 0;
  const settled = session?.settled.length ?? 0;
  /* Dos cifras distintas y a propósito: el CONTADOR es la posición en la cola
     viva —crece con cualquier nota, también con «Otra vez», que además alarga la
     cola— y la BARRA mide lo resuelto sobre las tarjetas del mazo. Con una sola
     cifra, calificar «Otra vez» cambiaba de tarjeta sin mover el contador y la
     sesión parecía trabada. */
  const queued = session?.queue.length ?? 0;
  const position = Math.min((session?.at ?? 0) + 1, queued);
  const division = current?.card.division ? model.division(current.card.division) : null;

  /* Cola vacía. Los tres modos vacían por motivos DISTINTOS, y ofrecer
     «Estudiar todo igual» estando ya en el modo «todo» —que era lo que pasaba—
     no lleva a ninguna parte (U38). */
  if (session && !total) {
    const empty = emptyForMode(mode);
    return (
      <div className={css.view}>
        <EmptyPanel
          eyebrow={empty.eyebrow}
          title={empty.title}
          actions={
            <>
              {mode === "todo" ? null : (
                <ActionLink to={`${routes.deck(slug, deckParam)}?modo=todo`} variant="primary">
                  Estudiar todo el mazo
                </ActionLink>
              )}
              <ActionLink to={routes.flashcards(slug)} variant={mode === "todo" ? "primary" : "secondary"}>
                Volver a los mazos
              </ActionLink>
            </>
          }
        >
          <p className={css.text}>{empty.text}</p>
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
          {position} / {queued}
        </span>
      </header>

      <Bar
        ratio={total ? settled / total : 0}
        className={css.progress}
        label={`Tarjetas resueltas: ${settled} de ${total}`}
      />

      {done ? (
        <Summary session={session} slug={slug} onRepeat={repeat} />
      ) : current ? (
        <>
          <div className={css.stage}>
            {/* La tarjeta NO es un botón: si lo fuera, su `aria-label` sería su
                único nombre y el anverso —que es todo el contenido— quedaría
                fuera del alcance de un lector de pantalla (U37). Es un grupo
                enfocable (Espacio la da vuelta) y quien la manipula por nombre
                es el botón hermano de abajo. */}
            <div
              className={css.flip}
              id="session-card"
              ref={cardRef}
              data-flipped={flipped ? "true" : "false"}
              role="group"
              /* La posición y el lado van en el NOMBRE, como en el baseline
                 (study.js:125-127): al enfocarse sola con cada tarjeta, eso es
                 lo que anuncia que cambió algo y qué se está mirando. */
              aria-label={`Tarjeta ${position} de ${queued}, ${flipped ? "respuesta visible" : "anverso"}`}
              tabIndex={0}
              onClick={() => setFlipped((f) => !f)}
            >
              <div className={css.face} aria-hidden={flipped} ref={frontRef}>
                <span className={css.faceTag}>
                  {division ? <DivisionChip division={division} /> : null}
                  <span className={css.faceKind}>ANVERSO</span>
                </span>
                <div className={css.faceBody}>
                  <Markdown body={current.card.front} subject={slug} exists={exists} />
                </div>
                <span className={css.hint}>
                  Clic o <Kbd>Espacio</Kbd> para ver la respuesta
                </span>
              </div>

              <div className={`${css.face} ${css.faceBack}`} aria-hidden={!flipped} ref={backRef}>
                <span className={css.faceTag}>
                  {/* El mismo chip que el anverso: al voltear se perdía de qué
                      unidad era la tarjeta. */}
                  {division ? <DivisionChip division={division} /> : null}
                  <span className={css.faceKind}>REVERSO</span>
                </span>
                <div className={css.faceBody}>
                  <Markdown body={current.card.back} subject={slug} exists={exists} />
                </div>
              </div>
            </div>
          </div>

          <div className={css.underCard}>
            <button
              type="button"
              className={css.flipButton}
              aria-expanded={flipped}
              aria-controls="session-card"
              aria-keyshortcuts="Space"
              onClick={() => setFlipped((f) => !f)}
            >
              <UiIcon name={flipped ? "close" : "check"} size={14} />
              {flipped ? "Ocultar la respuesta" : "Ver la respuesta"}
            </button>
            {/* El enlace al wiki y lo que queda en la cola CONVIVEN (en el
                baseline el enlace va dentro del reverso y el progreso queda
                arriba): antes se turnaban la misma ranura y en las tarjetas con
                página no se sabía cuánto faltaba. */}
            {flipped && current.card.page && model.bySlug.has(current.card.page) ? (
              <Link className={css.wikiLink} to={routes.page(slug, current.card.page)}>
                <Icon name="book" size={14} />
                Ver en el wiki
              </Link>
            ) : null}
            <span className={css.queueNote}>
              {queued - session.at > 1 ? `Quedan ${queued - session.at - 1} en la cola` : "Última de la cola"}
            </span>
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
