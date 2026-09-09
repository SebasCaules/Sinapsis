/**
 * Inicio de la materia: el panel de control del alumno, con el mismo orden y las
 * mismas funciones que el inicio del baseline —progreso · repaso de hoy y racha ·
 * plan · seguir estudiando · herramientas—, más lo propio de la plataforma (los
 * favoritos y la próxima tarea del plan).
 *
 * Encima de eso, lo que lo convierte en una portada de estudio y no en un
 * informe: cada fila del programa lleva sus accesos directos (leer, ejercicios,
 * repasar, quiz) al lado de la barra, y «Repaso general» junta lo que NO vive
 * dentro de una unidad —las secciones de evaluación, las páginas sueltas (el
 * formulario maestro) y el material entero por tipo—.
 *
 * Es la vista ancha (1120) del contrato; no inventa datos: todo sale del modelo
 * de la materia, del modelo de estudio, del material que trajo el sync y de la
 * actividad local (`activity.ts`).
 */
import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  PAGE_TYPE_META,
  plural,
  routes,
  type IconName,
  type PageMeta,
  type PlanPhase,
} from "@sinapsis/contract";
import { Icon, UiIcon } from "@/components/platform";
import { localToday, useActivity } from "../activity";
import { PageTypeTag } from "../components/TypeTag";
import { useSubjectCtx } from "../context";
import type {
  DivisionNode,
  ProgressGroup,
  RailGroupView,
  RailItemView,
  SubjectModel,
} from "../model";
import type { DeckStat, QuizStat, StudyModel } from "../study/model";
import { ALL_DECKS } from "../study/session";
import { Ring } from "../study/ui";
import { usePlanTrack } from "../store";
import { useStudy, type UseStudyResult } from "../study/useStudy";
import { useStudyState } from "../useSubject";
import css from "./HomeView.module.css";

/** Días de la tira de racha, como el baseline. */
const STREAK_DAYS = 14;
/** Inicial del día de la semana para la tira de racha (domingo primero). */
const DOW = ["D", "L", "M", "M", "J", "V", "S"] as const;

export function HomeView() {
  const { slug, model } = useSubjectCtx();
  const { progressTotal } = model;
  const activity = useActivity(slug);
  /* El material de estudio se pide UNA vez para toda la pantalla: el repaso
     general, el plan, las filas del programa y la tarjeta de hoy leen el mismo
     modelo (y la tarjeta del plan necesita además `setTrack`). */
  const study = useStudy(slug, model.studied);
  const { state } = useStudyState(slug);

  const next = model.nextUnread();
  const started = progressTotal.done > 0;

  /* «Continuar leyendo»: la última página que se abrió en el lector, siempre
     que siga existiendo y siga siendo contenido (una fuente o una página meta
     no es una lectura pendiente). */
  const resume = useMemo(() => {
    const page = activity.lastRead ? model.bySlug.get(activity.lastRead.page) : undefined;
    return page && model.isContent(page) ? page : null;
  }, [activity.lastRead, model]);

  /* Solo las páginas YA leídas: `reviewPages()` rellena con páginas sin leer
     cuando no hay ninguna leída, y «volver a leer» algo que nunca se abrió no
     es repasar (brecha inicio-11). Lo que ya está arriba en «Seguir estudiando»
     no se repite: dos tarjetas idénticas en la misma pantalla comparten nombre
     accesible y no aportan un destino nuevo. */
  const shown = new Set([resume?.slug, next?.slug].filter((s): s is string => Boolean(s)));
  const review = model
    .reviewPages()
    .filter((page) => model.studied.has(page.slug) && !shown.has(page.slug));

  if (model.placeholder || !model.pages.length) {
    return <EmptySubject name={model.config.name} slug={slug} />;
  }

  return (
    <div className={css.view}>
      {/* El orden de la pantalla es el del estudio: primero lo que se consulta
          siempre (evaluación y formularios), después el plan de la modalidad
          elegida, y recién entonces el programa con sus accesos. */}
      <GeneralSection model={model} slug={slug} />

      <PlanCard model={model} slug={slug} study={study} />

      <ProgressSection model={model} slug={slug} study={study.model} />

      <TodayCard
        model={model}
        slug={slug}
        study={study.model}
        bookmarks={state.bookmarks}
        started={started}
        days={activity.days}
        streak={activity.streak}
      />

      {started && (resume || next) ? <ResumeSection model={model} slug={slug} resume={resume} next={next} /> : null}

      {review.length ? <ReviewSection model={model} slug={slug} pages={review} /> : null}

      <ToolsSection model={model} />
    </div>
  );
}

/* ------------------------------------------------------------------ progreso */

/**
 * El informe de progreso: porcentaje global, barra SEGMENTADA por división (un
 * tramo por división con su color y su tooltip) y una fila por división con su
 * propio porcentaje.
 */
function ProgressSection({ model, slug, study }: { model: SubjectModel; slug: string; study: StudyModel }) {
  /* El carril y las filas miden la unidad ENTERA: páginas leídas más los pasos
     que aportan los bundles de la materia (N0-61). La línea de la cabecera los
     nombra por separado. */
  const { progressTotal, progressPartsTotal: parts } = model;
  const pct = Math.round(progressTotal.ratio * 100);
  /* Doce «0 %» no informan nada: el baseline deja la columna vacía hasta que hay
     algo que medir. */
  const showPct = progressTotal.done > 0;
  const rows = useMemo(() => unitRows(model, study), [model, study]);
  /* Las columnas de acción son las mismas para todas las filas: una división sin
     mazo deja el hueco, y así los iconos quedan alineados de arriba abajo en vez
     de correrse fila por fila. Una columna que no usa NADIE no se dibuja. */
  const slots = useMemo(
    () => ({
      read: rows.some((r) => r.read),
      exercises: rows.some((r) => r.exercises),
      exam: rows.some((r) => r.exam),
      deck: rows.some((r) => r.deck),
      quiz: rows.some((r) => r.quiz),
    }),
    [rows],
  );

  return (
    <section className={css.progress} aria-labelledby="home-progress">
      <div className={css.progressHead}>
        <h1 className={css.h1} id="home-progress">
          Progreso
        </h1>
        <span className={css.progressNum}>
          {showPct ? <b className={css.progressPct}>{pct}%</b> : null}
          <span className={css.progressCount}>
            {parts.pages.done} / {parts.pages.total} {plural(parts.pages.total, "página", "páginas")}
            {parts.sources.map((source) => (
              <span key={source.label} className={css.progressExtra}>
                {" · "}
                {source.done} / {source.total} {source.label}
              </span>
            ))}
          </span>
        </span>
      </div>

      <div className={css.totalTrack} role="img" aria-label={`Progreso total: ${pct}%`}>
        {model.visibleDivisions.map((division) => {
          const p = model.progress(division.key);
          if (!p.done) return null;
          return (
            <i
              key={division.key}
              className={css.totalSeg}
              style={{ width: `${(p.done / progressTotal.total) * 100}%`, background: division.color }}
              title={`${division.short}: ${p.done}`}
            />
          );
        })}
      </div>

      <div className={css.rows}>
        {rows.map((row) => (
          <UnitRow key={row.division.key} row={row} slug={slug} showPct={showPct} slots={slots} />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------ el programa, por fila */

/**
 * Qué grupos de ejercicios son de EXAMEN. La plataforma no tiene un campo para
 * decirlo: los grupos los nombra la materia («Guía», «Lutzio», «Parciales»), así
 * que se los reconoce por su propio nombre. Una materia que no use estas
 * palabras simplemente no muestra el botón, y sus grupos siguen entrando por
 * «Ejercicios».
 */
const EXAM_RE = /parcial|examen|final|evaluaci|recuperatorio/i;

function isExamGroup(group: ProgressGroup): boolean {
  return EXAM_RE.test(`${group.id} ${group.label} ${group.source ?? ""}`);
}

/** Una fila del programa: la división y los accesos que puede ofrecer. */
interface UnitRow {
  division: DivisionNode;
  done: number;
  total: number;
  pct: number;
  /** Adónde lleva «leer»: la primera sin leer, o la primera de la secuencia. */
  read: PageMeta | null;
  /** true si esa página continúa una lectura empezada (cambia el verbo). */
  started: boolean;
  /** Grupo de práctica al que salta la fila (el primero sin terminar). */
  exercises: ProgressGroup | null;
  /** Grupo de examen de la división (parciales, finales). */
  exam: ProgressGroup | null;
  /** Mazo de la división (el primero, si declara varios). */
  deck: DeckStat | null;
  /** Quiz de la división. */
  quiz: QuizStat | null;
}

/**
 * El programa, fila por fila. Nada se calcula acá que el modelo no sepa: el
 * progreso y los grupos de ejercicios salen de `../model`, y el mazo y el quiz
 * de la división salen del material de estudio (`Deck.division` / `Quiz.division`
 * del contrato). Sin material declarado, la fila simplemente muestra menos
 * botones: ninguna materia se nombra acá.
 */
function unitRows(model: SubjectModel, study: StudyModel): UnitRow[] {
  return model.visibleDivisions.map((division) => {
    const key = division.key;
    const progress = model.progress(key);
    const sequence = model.sequence(key);
    const pending = sequence.find((page) => !model.studied.has(page.slug)) ?? null;
    /* Un grupo sin destino del SPA no es un botón: la plataforma no navega a
       donde no sabe. */
    const groups = model.progressParts(key).groups.filter((g) => g.to && g.to.startsWith("/"));
    const exams = groups.filter(isExamGroup);
    const practice = groups.filter((g) => !isExamGroup(g));
    /* El primero sin terminar: el botón lleva a donde quedó trabajo. */
    const firstOpen = (list: ProgressGroup[]) => list.find((g) => g.done < g.total) ?? list[0] ?? null;
    return {
      division,
      done: progress.done,
      total: progress.total,
      pct: Math.round(progress.ratio * 100),
      read: pending ?? sequence[0] ?? null,
      started: Boolean(pending) && sequence.some((page) => model.studied.has(page.slug)),
      exercises: firstOpen(practice),
      exam: firstOpen(exams),
      deck: study.decks.find((d) => d.deck.division === key) ?? null,
      quiz: study.quizzes.find((q) => q.quiz.division === key) ?? null,
    };
  });
}

/** El destino de una sesión de repaso: lo vencido primero, y si no hay nada, el mazo entero. */
function deckSession(slug: string, deck: DeckStat): string {
  const mode = deck.due > 0 ? "vencidas" : deck.fresh > 0 ? "nuevas" : "todo";
  return `${routes.deck(slug, deck.deck.id)}?modo=${mode}`;
}

/** Qué columnas de acción dibuja la tabla (las que usa al menos una fila). */
interface ActionSlots {
  read: boolean;
  exercises: boolean;
  exam: boolean;
  deck: boolean;
  quiz: boolean;
}

/** Un acceso de la fila, ya resuelto: es lo que dibuja `<Act>`. */
interface RowAction {
  to: string;
  label: string;
  /** Rótulo accesible y tooltip: nombra la división, así ninguna fila repite nombre. */
  title: string;
  aria: string;
  icon: IconName;
  primary?: boolean;
}

/**
 * Una fila del programa: el enlace a la portada de la división (con su barra y
 * su recuento, que es lo que el informe siempre mostró) y, a la derecha, los
 * accesos que ahorran el rodeo por esa portada —leer, ejercicios, el examen de
 * la unidad, el mazo y el quiz—.
 *
 * Cada acceso ocupa su COLUMNA, esté o no en esa fila: una división sin mazo
 * deja el hueco y los botones siguen alineados de arriba abajo.
 */
function UnitRow({
  row,
  slug,
  showPct,
  slots,
}: {
  row: UnitRow;
  slug: string;
  showPct: boolean;
  slots: ActionSlots;
}) {
  const { division, done, total, pct, read, started, exercises, exam, deck, quiz } = row;
  const short = division.short;
  const verb = started ? "Seguir" : "Leer";

  const readAction: RowAction | null = read
    ? {
        to: routes.page(slug, read.slug),
        label: verb,
        title: `${verb} ${short}: ${read.title}`,
        aria: `${verb} ${short}`,
        icon: "book",
        primary: true,
      }
    : null;
  const groupAction = (group: ProgressGroup | null, icon: IconName, what: string): RowAction | null =>
    group
      ? {
          to: group.to as string,
          /* El rótulo es el que puso la materia («Guía», «Parciales»): la
             plataforma no le cambia el nombre a su propio material. */
          label: group.label,
          title: `${what} de ${short} · ${group.label} ${group.done}/${group.total}`,
          aria: `${group.label} de ${short}`,
          icon,
        }
      : null;

  return (
    <div className={css.row} style={{ ["--ucol" as string]: division.color }}>
      <Link className={css.rowMain} to={routes.division(slug, division.key)}>
        <span className={css.rowDot} aria-hidden="true" />
        {/* El rótulo corto en su propia columna: así TODAS las filas tienen la
            misma forma, también las divisiones sin número (brecha inicio-14). */}
        <span className={css.rowShort}>{short}</span>
        <span className={css.rowLabel}>{division.name}</span>
        <span className={css.rowTrack} aria-hidden="true">
          <span className={css.rowFill} style={{ width: `${pct}%` }} />
        </span>
        <span className={css.rowCount}>
          {done}/{total}
        </span>
        <span className={css.rowPct}>{showPct ? `${pct}%` : ""}</span>
      </Link>

      <span className={css.rowActions}>
        {slots.read ? <Act action={readAction} width={css.slotRead} /> : null}
        {slots.exercises ? <Act action={groupAction(exercises, "pencil", "Ejercicios")} width={css.slotWide} /> : null}
        {slots.exam ? <Act action={groupAction(exam, "exam", "Examen")} width={css.slotWide} /> : null}
        {slots.deck ? (
          <Act
            action={
              deck
                ? {
                    to: deckSession(slug, deck),
                    label: "Repasar",
                    title: `Repasar ${short} · ${deck.pending || deck.total} ${plural(deck.pending || deck.total, "tarjeta", "tarjetas")}`,
                    aria: `Repasar ${short}`,
                    icon: "cards",
                  }
                : null
            }
            width={css.slotDeck}
          />
        ) : null}
        {slots.quiz ? (
          <Act
            action={
              quiz
                ? {
                    to: routes.quizOne(slug, quiz.quiz.id),
                    label: "Quiz",
                    title: `Quiz de ${short} · ${quiz.questions} ${plural(quiz.questions, "pregunta", "preguntas")}`,
                    aria: `Quiz de ${short}`,
                    icon: "quiz",
                  }
                : null
            }
            width={css.slotQuiz}
          />
        ) : null}
      </span>
    </div>
  );
}

/** Un acceso de la fila dentro de su columna; sin acción, la columna queda vacía. */
function Act({ action, width }: { action: RowAction | null; width?: string }) {
  return (
    <span className={`${css.slot} ${width ?? ""}`}>
      {action ? (
        <Link
          className={action.primary ? `${css.act} ${css.actRead}` : css.act}
          to={action.to}
          title={action.title}
          aria-label={action.aria}
        >
          <Icon name={action.icon} size={14} />
          <span className={css.actLabel}>{action.label}</span>
        </Link>
      ) : null}
    </span>
  );
}

/* --------------------------------------------------- para hoy · racha */

/**
 * «PARA HOY»: lo único de la pantalla que caduca — las flashcards pendientes, la
 * racha de los últimos 14 días y los últimos favoritos.
 *
 * Con mazos pero sin nada vencido la tarjeta SIGUE en pantalla con «Sin tarjetas
 * pendientes para hoy»: estar al día es un resultado, y una tarjeta que
 * desaparece no se distingue de una pantalla que no muestra nada.
 */
function TodayCard({
  model,
  slug,
  study,
  bookmarks,
  started,
  days,
  streak,
}: {
  model: SubjectModel;
  slug: string;
  study: StudyModel;
  bookmarks: readonly string[];
  started: boolean;
  days: readonly string[];
  streak: number;
}) {
  /* Las cuentas salen del modelo de estudio, que es quien sabe qué tarjetas
     EXISTEN todavía: contarlas sobre `state.srs` crudo incluía el SRS de
     tarjetas que el último sync se llevó (bug 7). «Pendientes» son las vencidas
     MÁS las nunca vistas, la misma cola que abre la sesión. */
  const { due, fresh, pending } = study.totals;
  const hasDecks = study.decks.length > 0;
  const session = `${routes.deck(slug, ALL_DECKS)}?modo=${due > 0 ? "vencidas" : "nuevas"}`;

  /* Los últimos guardados primero: el API devuelve los favoritos en el orden en
     que se marcaron. */
  const favorites = useMemo(
    () =>
      bookmarks
        .slice(-3)
        .reverse()
        .map((page) => model.bySlug.get(page))
        .filter((p): p is PageMeta => Boolean(p)),
    [bookmarks, model],
  );

  /* Como en el baseline: la tira aparece cuando hay algo que contar (o cuando ya
     hay lectura, aunque la actividad de este navegador todavía esté vacía). */
  const showStreak = days.length > 0 || started;

  if (!hasDecks && !favorites.length && !showStreak) return null;

  return (
    <section className={css.today} aria-labelledby="home-today">
      <span className={`${css.eyebrow} ${css.eyebrowToday}`} id="home-today">
        <Icon name="timer" size={14} />
        PARA HOY
      </span>

      <div className={css.todayGrid}>
        {hasDecks ? (
          <div className={css.todayItem}>
            <span className={css.todayLabel}>REPASO DE HOY</span>
            {pending ? (
              <>
                <p className={css.todayText}>
                  {due && fresh ? (
                    <>
                      <strong>{due}</strong> {plural(due, "vencida", "vencidas")} · <strong>{fresh}</strong>{" "}
                      {plural(fresh, "nueva", "nuevas")} en los mazos.
                    </>
                  ) : due ? (
                    <>
                      <strong>{due}</strong> {plural(due, "tarjeta vencida", "tarjetas vencidas")} esperando en el
                      mazo.
                    </>
                  ) : (
                    <>
                      <strong>{fresh}</strong> {plural(fresh, "tarjeta nueva", "tarjetas nuevas")} sin ver todavía.
                    </>
                  )}
                </p>
                {/* Entra DIRECTO a la sesión de repaso, sin pasar por la lista
                    de mazos (brecha inicio-10). */}
                <Link className={css.todayAction} to={session}>
                  <Icon name="cards" size={15} />
                  Repasar {pending} {plural(pending, "tarjeta pendiente", "tarjetas pendientes")}
                </Link>
              </>
            ) : (
              <p className={`${css.todayText} ${css.todayDone}`}>
                <UiIcon name="check" size={15} />
                Sin tarjetas pendientes para hoy.
              </p>
            )}
          </div>
        ) : null}

        {showStreak ? <Streak days={days} streak={streak} /> : null}

        {favorites.length ? (
          <div className={css.todayItem}>
            <span className={css.todayLabel}>FAVORITOS</span>
            <div className={css.todayList}>
              {favorites.map((page) => (
                <Link key={page.slug} className={css.todayLink} to={routes.page(slug, page.slug)}>
                  <Icon name="star" size={12} className={css.todayStar} />
                  {page.title}
                </Link>
              ))}
            </div>
            <Link className={css.todayMore} to={routes.favorites(slug)}>
              Ver todos los favoritos →
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}

/** Día local AAAA-MM-DD desplazado `n` días respecto de hoy (negativo = pasado). */
function dayOffset(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return localToday(d);
}

/** La tira de los últimos 14 días, con la de hoy anillada (baseline dashboard.js:130-144). */
function Streak({ days, streak }: { days: readonly string[]; streak: number }) {
  const set = useMemo(() => new Set(days), [days]);
  const cells = useMemo(
    () =>
      Array.from({ length: STREAK_DAYS }, (_, i) => {
        const iso = dayOffset(i - (STREAK_DAYS - 1));
        return { iso, on: set.has(iso), today: i === STREAK_DAYS - 1 };
      }),
    [set],
  );
  const active = cells.filter((c) => c.on).length;

  return (
    <div className={css.todayItem}>
      <span className={css.todayLabel}>
        RACHA · {streak} {plural(streak, "día", "días")}
      </span>
      <div
        className={css.streakRow}
        role="img"
        aria-label={`Racha de ${streak} ${plural(streak, "día", "días")}: ${active} de los últimos ${STREAK_DAYS} días con estudio`}
      >
        {cells.map((cell) => (
          <div
            key={cell.iso}
            className={`${css.streakDot}${cell.on ? ` ${css.streakOn}` : ""}${cell.today ? ` ${css.streakToday}` : ""}`}
            title={`${cell.iso}${cell.on ? " · con actividad" : ""}`}
          >
            <span className={css.streakCell} />
            <span className={css.streakDay}>{DOW[new Date(`${cell.iso}T00:00:00`).getDay()]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Color de la fase: el de su primera división declarada (la del primer hito que
 * tenga alguna), igual que en el plan. Una fase sin divisiones toma el de la
 * materia.
 */
function phaseColor(model: SubjectModel, phase: PlanPhase): string {
  for (const milestone of phase.milestones) {
    for (const key of milestone.divisions) {
      const division = model.division(key);
      if (division) return division.color;
    }
  }
  return "var(--primary)";
}

/**
 * La tarjeta del plan: la modalidad elegida (cursada + final o final directo),
 * el porcentaje global, un anillo por fase (cada uno abre SU fase dentro del
 * plan), la próxima tarea pendiente y las dos salidas del baseline —el plan y
 * los kits—.
 *
 * La modalidad se elige acá y no solo dentro del plan: TODO lo que la tarjeta
 * muestra (las fases, el porcentaje, la próxima tarea) depende de ella, y quien
 * cursa no tiene por qué ver como próximo paso una fase que solo existe en el
 * final directo. Es el MISMO estado que usa el plan (el store de la materia),
 * así que las dos pantallas nunca discrepan.
 */
function PlanCard({ model, slug, study }: { model: SubjectModel; slug: string; study: UseStudyResult }) {
  const { phases, planProgress, plan, tracks, track, state } = study.model;
  const task = study.nextTask();
  /* Null mientras el alumno no haya elegido: `resolveTrack` cae en la primera
     modalidad para poder dibujar algo, pero eso NO es una elección suya. */
  const chosen = usePlanTrack(slug);
  if (!phases.length) return null;
  const pct = Math.round(planProgress.ratio * 100);

  /* El plan se configura una vez: la modalidad (cuando la materia ofrece más de
     una) y las fechas de las instancias obligatorias. Sin eso, la tarjeta no
     muestra fases —el porcentaje y «lo próximo» serían de una modalidad que
     nadie eligió—: lleva a configurarlo. */
  const required = (plan?.instances ?? []).filter((instance) => !instance.optional);
  const needsTrack = tracks.length > 1 && !chosen;
  const needsDates = required.length > 0 && !required.some((instance) => state.planDates[instance.key]);
  if (needsTrack || needsDates) {
    return (
      <section className={css.plan} aria-labelledby="home-plan">
        <div className={css.planMain}>
          <div className={css.planHead}>
            <h2 className={css.planTitle} id="home-plan">
              <Icon name="map" size={15} className={css.planIcon} />
              Plan de estudio
            </h2>
            <p className={css.planNext}>
              {needsTrack && needsDates
                ? "Falta elegir la modalidad y cargar las fechas de las instancias."
                : needsTrack
                  ? `Falta elegir la modalidad: ${tracks.map((t) => t.label).join(" o ")}.`
                  : "Faltan las fechas de las instancias evaluatorias."}
              <br />
              <span className={css.planWhere}>El plan ordena las fases con eso.</span>
            </p>
          </div>
        </div>
        <div className={css.planActions}>
          <Link className={css.primaryAction} to={routes.plan(slug)}>
            <Icon name="map" size={15} />
            Configurar el plan
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={css.plan} aria-labelledby="home-plan">
      <div className={css.planMain}>
        <div className={css.planHead}>
          <h2 className={css.planTitle} id="home-plan">
            <Icon name="map" size={15} className={css.planIcon} />
            Plan de estudio{planProgress.done ? ` · ${pct}%` : ""}
          </h2>
          {/* La modalidad elegida se MUESTRA, no se cambia acá: es una decisión
              de cursada, y un conmutador en el inicio invita a tocarla sin ver
              el plan entero. Se cambia dentro del plan. */}
          {tracks.length > 1 && track ? (
            <span className={css.planTrackTag} title={track.description}>
              {track.label}
            </span>
          ) : null}
          {task ? (
            <p className={css.planNext}>
              <strong>{task.task.label}</strong>
              <br />
              <span className={css.planWhere}>
                {task.phase.title} · {task.milestone.title}
              </span>
            </p>
          ) : (
            <p className={css.planNext}>
              <strong>El plan está completo.</strong>
            </p>
          )}
        </div>
        <div className={css.planPhases}>
          {phases.map((phase) => {
            const p = study.model.phaseProgress(phase.id);
            return (
              <Link
                key={phase.id}
                className={css.phase}
                to={`${routes.plan(slug)}?fase=${encodeURIComponent(phase.id)}`}
              >
                <Ring
                  ratio={p.ratio}
                  size={46}
                  color={phaseColor(model, phase)}
                  label={`${phase.title}: ${p.done} de ${p.total}`}
                />
                <span className={css.phaseText}>
                  <b>{phase.title}</b>
                  <span>
                    {p.done}/{p.total}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
      <div className={css.planActions}>
        <Link className={css.primaryAction} to={routes.plan(slug)}>
          <Icon name="map" size={15} />
          Abrir el plan
        </Link>
        <Link className={css.secondaryAction} to={routes.kits(slug)}>
          <Icon name="grid" size={15} />
          Kits de estudio
        </Link>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ repaso general */

/** Cuántos tipos de referencia entran en el repaso general (los de más páginas). */
const REFERENCE_TYPES = 3;

/** Un acceso del repaso general: lo que se dibuja, ya resuelto a un destino. */
interface GeneralTile {
  id: string;
  kicker: string;
  title: string;
  count: string;
  icon: "exam" | "sigma" | "list";
  to: string;
  color?: string;
}

/**
 * «Repaso general»: lo que se consulta SIEMPRE, sin importar por qué unidad se
 * vaya —la sección de evaluación de la materia, las páginas sueltas (el
 * formulario maestro) y el material de referencia por tipo (distribuciones,
 * técnicas, formularios), cada uno contra el catálogo ya filtrado—.
 *
 * Es una banda corta a propósito: NO es el catálogo. De los tipos que declara la
 * materia quedan afuera los que no son contenido (fuentes, videos, apuntes), el
 * primero declarado y el más numeroso —el cuerpo de lectura, que es justamente
 * lo que se recorre unidad por unidad en el programa de abajo—.
 *
 * Todo sale del config: la sección de evaluación es la división que declara el
 * color `--ueval`, las sueltas son `wiki.standalone` y los tipos son
 * `pageTypes`. Ninguna materia se nombra acá.
 */
function GeneralSection({ model, slug }: { model: SubjectModel; slug: string }) {
  const tiles = useMemo<GeneralTile[]>(() => {
    const out: GeneralTile[] = [];

    /* La sección de evaluación: la división sin número que la materia tiñe con
       `--ueval` («Evaluaciones» en Proba, «Cátedra y evaluación» en Cripto). Si
       ninguna lo declara, valen todas las divisiones sin número. */
    const extra = model.visibleDivisions.filter((d) => d.kind === "extra");
    const evaluation = extra.filter((d) => d.color === "var(--ueval)");
    for (const division of evaluation.length ? evaluation : extra) {
      const n = model.pagesByDivision(division.key).length;
      out.push({
        id: `d-${division.key}`,
        kicker: "EVALUACIÓN",
        title: division.name,
        count: `${n} ${plural(n, "entrada", "entradas")}`,
        icon: "exam",
        to: routes.division(slug, division.key),
        color: division.color,
      });
    }

    /* Las páginas sueltas que declara la materia (N0-74): el formulario maestro
       de Proba es exactamente esto. */
    for (const page of model.standalone) {
      out.push({
        id: `p-${page.slug}`,
        kicker: model.typeLabel(page.type).toUpperCase(),
        title: page.title,
        count: model.studied.has(page.slug) ? "leída" : "abrir",
        icon: "sigma",
        to: routes.page(slug, page.slug),
        color: model.typeColor(page.type),
      });
    }

    /* El material de referencia por tipo, contra el catálogo filtrado (`?t=`):
       un clic y quedan solo los formularios, o solo las distribuciones. Las
       páginas reservadas del wiki (índice y registro) no son material. */
    const counts = new Map<string, number>();
    for (const page of model.pages) {
      if (page.type === PAGE_TYPE_META) continue;
      if (!model.isContent(page)) continue;
      counts.set(page.type, (counts.get(page.type) ?? 0) + 1);
    }
    const content = model.config.pageTypes.filter((t) => t.countsAsContent !== false && counts.has(t.key));
    const main = new Set<string>();
    if (content[0]) main.add(content[0].key);
    /* El tipo más numeroso es el cuerpo de lectura de la materia (los conceptos):
       su tarjeta sería «todo el wiki» con otro nombre. */
    const bySize = content.slice().sort((a, b) => (counts.get(b.key) ?? 0) - (counts.get(a.key) ?? 0));
    if (bySize[0]) main.add(bySize[0].key);
    /* La banda no crece con la materia: entran los tipos de referencia con más
       páginas y el resto se busca en el catálogo, que para eso está. */
    const shown = new Set(bySize.filter((t) => !main.has(t.key)).slice(0, REFERENCE_TYPES).map((t) => t.key));
    for (const type of content) {
      if (!shown.has(type.key)) continue;
      const n = counts.get(type.key) ?? 0;
      out.push({
        id: `t-${type.key}`,
        kicker: "CONSULTAR",
        title: type.plural,
        count: `${n} ${plural(n, "página", "páginas")}`,
        icon: "list",
        to: `${routes.wiki(slug)}?t=${encodeURIComponent(type.key)}`,
        color: model.typeColor(type.key),
      });
    }

    return out;
  }, [model, slug]);

  if (!tiles.length) return null;

  return (
    <section className={css.general} aria-labelledby="home-general">
      <h2 className={css.h2} id="home-general">
        <Icon name="sigma" size={16} />
        Repaso general
      </h2>

      <div className={css.generalGrid}>
        {tiles.map((tile) => (
          <Link
            key={tile.id}
            className={css.generalTile}
            to={tile.to}
            style={{ ["--tcol" as string]: tile.color ?? "var(--primary)" }}
          >
            <span className={css.generalIcon} aria-hidden="true">
              <Icon name={tile.icon} size={17} />
            </span>
            <span className={css.generalKicker}>{tile.kicker}</span>
            <span className={css.generalTitle}>{tile.title}</span>
            <span className={css.generalCount}>{tile.count}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------------------------------- seguir estudiando */

/** La tarjeta chica del baseline: filete de color de la división, título y meta. */
function MiniCard({ model, slug, page }: { model: SubjectModel; slug: string; page: PageMeta }) {
  const division = model.division(model.divisionOf(page));
  const read = model.studied.has(page.slug);
  return (
    <Link
      className={css.mini}
      to={routes.page(slug, page.slug)}
      style={{ ["--ucol" as string]: division?.color ?? "var(--u0)" }}
    >
      <span className={css.miniTitle}>{page.title}</span>
      <span className={css.miniMeta}>
        {division?.short ?? "—"} · <PageTypeTag model={model} type={page.type} size="sm" />
        {read ? <span className={css.miniRead}> · ✓ leída</span> : null}
      </span>
    </Link>
  );
}

/**
 * «Seguir estudiando»: la última página abierta y la primera sin leer. Si son la
 * misma, una sola columna (como el baseline).
 */
function ResumeSection({
  model,
  slug,
  resume,
  next,
}: {
  model: SubjectModel;
  slug: string;
  resume: PageMeta | null;
  next: PageMeta | null;
}) {
  const showNext = next && (!resume || next.slug !== resume.slug);
  return (
    <section className={css.resume} aria-labelledby="home-resume">
      <h2 className={css.h2} id="home-resume">
        <Icon name="compass" size={16} />
        Seguir estudiando
      </h2>
      <div className={css.resumeGrid}>
        {resume ? (
          <div className={css.resumeCol}>
            <span className={css.resumeKicker}>
              <Icon name="book" size={12} />
              CONTINUAR LEYENDO
            </span>
            <MiniCard model={model} slug={slug} page={resume} />
          </div>
        ) : null}
        {showNext && next ? (
          <div className={css.resumeCol}>
            <span className={css.resumeKicker}>
              <Icon name="list" size={12} />
              SIGUIENTE RECOMENDADO
            </span>
            <MiniCard model={model} slug={slug} page={next} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- volver a leer */

/**
 * «Volver a leer»: las páginas leídas hace más tiempo. No es el repaso de hoy
 * —ese es el de las flashcards, y vive en «Para hoy»—, así que no se llama así.
 */
function ReviewSection({ model, slug, pages }: { model: SubjectModel; slug: string; pages: PageMeta[] }) {
  return (
    <section className={css.review} aria-labelledby="home-review">
      <span className={`${css.eyebrow} ${css.eyebrowAccent}`} id="home-review">
        <Icon name="clock" size={14} />
        VOLVER A LEER · LO QUE MARCÓ HACE MÁS TIEMPO
      </span>
      <div className={css.reviewGrid}>
        {pages.map((page) => (
          <MiniCard key={page.slug} model={model} slug={slug} page={page} />
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- herramientas */

/**
 * Qué hace cada vista de la PLATAFORMA. Las herramientas y las páginas de la
 * materia traen su propia descripción (`RailItem.hint` del contrato, o el
 * resumen de la página): esta tabla es solo para lo que dibuja la plataforma.
 */
const BUILTIN_HINTS: Record<string, string> = {
  plan: "Fases por instancia evaluatoria, con fechas y ritmo.",
  kits: "Herramientas, páginas y flashcards por objetivo.",
  graph: "Las páginas del programa y sus enlaces.",
  flashcards: "Repetición espaciada de fórmulas y definiciones.",
  quiz: "Opción múltiple con explicaciones.",
  notes: "El cuaderno de la materia, exportable en markdown.",
  favorites: "Las páginas marcadas con estrella.",
};

/** La descripción de una tarjeta de herramienta, o null si la materia no la declara. */
function toolHint(model: SubjectModel, view: RailItemView): string | null {
  const { item } = view;
  if (item.hint) return item.hint;
  if (item.kind === "builtin") {
    if (item.target === "wiki") {
      return `Todas las páginas, por ${model.config.division.singular.toLowerCase()}.`;
    }
    return BUILTIN_HINTS[item.target] ?? null;
  }
  if (item.kind === "page") return model.bySlug.get(item.target)?.summary || null;
  return null;
}

/**
 * La grilla de accesos: TODO lo que ofrece el rail, con icono, título y una línea
 * de qué hace. Sale de `model.railGroups`, así que incluye por igual las vistas
 * de la plataforma y lo que declara la materia, sin una segunda lista que
 * mantener (brecha inicio-01).
 *
 * Se dibuja GRUPO POR GRUPO, con el rótulo del rail como encabezado: el grupo
 * que la materia llama «Evaluación» o «Resolver» es una sección buscable, y en
 * una grilla única el rótulo quedaba al pie de cada tarjeta, donde no ordena
 * nada.
 */
function ToolsSection({ model }: { model: SubjectModel }) {
  const groups = useMemo(
    () =>
      model.railGroups
        .map((group: RailGroupView) => ({
          group,
          // «Inicio» es esta misma pantalla.
          items: group.items.filter((view) => !(view.item.kind === "builtin" && view.item.target === "home")),
        }))
        .filter(({ items }) => items.length),
    [model.railGroups],
  );
  if (!groups.length) return null;

  return (
    <section className={css.tools} aria-labelledby="home-tools">
      <h2 className={css.h2} id="home-tools">
        <Icon name="grid" size={16} />
        Herramientas
      </h2>
      {groups.map(({ group, items }) => (
        <div key={group.id} className={css.toolGroup}>
          <h3 className={css.toolGroupTitle} style={{ ["--tcol" as string]: group.color }}>
            <span className={css.toolGroupBar} aria-hidden="true" />
            {group.label}
          </h3>
          <div className={css.toolGrid}>
            {items.map((view) => {
              const { item } = view;
              const hint = toolHint(model, view);
              const body = (
                <>
                  <span className={css.toolIcon} aria-hidden="true">
                    <Icon name={item.icon} size={20} />
                  </span>
                  <span className={css.toolTitle}>{item.label}</span>
                  {hint ? <span className={css.toolText}>{hint}</span> : null}
                </>
              );
              const style = { ["--tcol" as string]: group.color };
              return view.href ? (
                <a
                  key={`${group.id}-${item.id}`}
                  className={css.tool}
                  href={view.href}
                  target="_blank"
                  rel="noreferrer"
                  style={style}
                >
                  {body}
                </a>
              ) : (
                <Link key={`${group.id}-${item.id}`} className={css.tool} to={view.to ?? "."} style={style}>
                  {body}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}

function EmptySubject({ name, slug }: { name: string; slug: string }) {
  return (
    <div className={css.view}>
      <section className={css.startCard}>
        <div className={css.startBody}>
          <span className={css.eyebrow}>
            <Icon name="clock" size={14} />
            SIN PUBLICAR
          </span>
          <h2 className={css.startTitle}>{name} todavía no tiene páginas</h2>
          <p className={css.startText}>
            La materia está en su inicio, pero su wiki todavía no se publicó en el sitio. Desde la carpeta del vault
            de la materia:
          </p>
          <pre className={css.command}>
            <code>pnpm sinapsis -- publish --config /ruta/a/{slug}/sinapsis.config.json</code>
          </pre>
          <p className={css.startText}>
            El comando compila el wiki markdown y abre el pedido de incorporación; cuando la materia entre en el
            sitio, esta pantalla muestra las divisiones con sus páginas.
          </p>
        </div>
      </section>
    </div>
  );
}
