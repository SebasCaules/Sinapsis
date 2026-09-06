/**
 * Inicio de la materia: el panel de control del alumno, con el mismo orden y las
 * mismas funciones que el inicio del baseline —progreso · repaso de hoy y racha ·
 * plan · seguir estudiando · herramientas—, más lo propio de la plataforma (los
 * favoritos y la próxima tarea del plan).
 *
 * Es la vista ancha (1120) del contrato; no inventa datos: todo sale del modelo
 * de la materia, del modelo de estudio, del material que trajo el sync y de la
 * actividad local (`activity.ts`).
 */
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { plural, routes, type PageMeta, type PlanPhase } from "@sinapsis/contract";
import { Icon, UiIcon } from "@/components/platform";
import { localToday, useActivity } from "../activity";
import { useSubjectCtx } from "../context";
import type { RailGroupView, RailItemView, SubjectModel } from "../model";
import type { StudyModel } from "../study/model";
import { ALL_DECKS } from "../study/session";
import { Ring } from "../study/ui";
import { useStudy } from "../study/useStudy";
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

  const next = model.nextUnread();
  const started = progressTotal.done > 0;
  const nextDivision = next ? model.division(model.divisionOf(next)) : null;

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
      {/* El baseline muestra «por dónde empezar» SOLO en el primer uso: con
          progreso, el panel abre por el informe y «Seguir estudiando» es quien
          ofrece por dónde continuar. */}
      {!started ? <StartCard model={model} slug={slug} next={next} division={nextDivision} /> : null}

      <ProgressSection model={model} slug={slug} />

      <StudyBlocks model={model} slug={slug} started={started} days={activity.days} streak={activity.streak} />

      {started && (resume || next) ? <ResumeSection model={model} slug={slug} resume={resume} next={next} /> : null}

      {review.length ? <ReviewSection model={model} slug={slug} pages={review} /> : null}

      <ToolsSection model={model} />
    </div>
  );
}

/* ---------------------------------------------------------------- primer uso */

/**
 * «Por dónde empezar» del primer uso: el botón nombra la PÁGINA que abre (no su
 * división) y el secundario ofrece el plan de estudio, como en el baseline.
 */
function StartCard({
  model,
  slug,
  next,
  division,
}: {
  model: SubjectModel;
  slug: string;
  next: PageMeta | null;
  division: ReturnType<SubjectModel["division"]> | null;
}) {
  return (
    <section className={css.startCard} aria-labelledby="home-start">
      <div className={css.startBody}>
        <span className={css.eyebrow}>
          <Icon name="compass" size={14} />
          POR DÓNDE EMPEZAR
        </span>
        <h2 className={css.startTitle} id="home-start">
          Todavía no ha leído ninguna página
        </h2>
        {/* Sin mención al número de divisiones: el denominador de arriba suma
            TODAS las filas del progreso (incluidas las sintéticas), así que
            «de N unidades» se contradecía con la tabla (brecha inicio-13). */}
        <p className={css.startText}>
          Las {model.progressPartsTotal.pages.total} páginas de contenido están ordenadas para leerse en secuencia. El
          progreso de abajo se llena a medida que las marca como leídas.
        </p>
      </div>
      <div className={css.startActions}>
        {next ? (
          <Link className={css.primaryAction} to={routes.page(slug, next.slug)}>
            <UiIcon name="file" size={15} />
            Empezar por {division?.short ? `${division.short} · ` : ""}
            {next.title}
          </Link>
        ) : null}
        <Link className={css.secondaryAction} to={routes.plan(slug)}>
          <Icon name="map" size={15} />
          Ver el plan de estudio
        </Link>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ progreso */

/**
 * El informe de progreso: porcentaje global, barra SEGMENTADA por división (un
 * tramo por división con su color y su tooltip) y una fila por división con su
 * propio porcentaje.
 */
function ProgressSection({ model, slug }: { model: SubjectModel; slug: string }) {
  /* El carril y las filas miden la unidad ENTERA: páginas leídas más los pasos
     que aportan los bundles de la materia (N0-61). La línea de la cabecera los
     nombra por separado. */
  const { progressTotal, progressPartsTotal: parts } = model;
  const pct = Math.round(progressTotal.ratio * 100);
  /* Doce «0 %» no informan nada: el baseline deja la columna vacía hasta que hay
     algo que medir. */
  const showPct = progressTotal.done > 0;

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
        {model.visibleDivisions.map((division) => {
          const p = model.progress(division.key);
          const rowPct = Math.round(p.ratio * 100);
          return (
            <Link
              key={division.key}
              className={css.row}
              to={routes.division(slug, division.key)}
              style={{ ["--ucol" as string]: division.color }}
            >
              <span className={css.rowDot} aria-hidden="true" />
              {/* El rótulo corto en su propia columna: así TODAS las filas
                  tienen la misma forma, también las divisiones sin número
                  (brecha inicio-14). */}
              <span className={css.rowShort}>{division.short}</span>
              <span className={css.rowLabel}>{division.name}</span>
              <span className={css.rowTrack} aria-hidden="true">
                <span className={css.rowFill} style={{ width: `${rowPct}%` }} />
              </span>
              <span className={css.rowCount}>
                {p.done}/{p.total}
              </span>
              <span className={css.rowPct}>{showPct ? `${rowPct}%` : ""}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------- para hoy · racha · plan (estudio) */

/**
 * Los dos bloques que dependen del material de estudio, que se piden UNA vez:
 * «Para hoy» (repaso, racha y favoritos) y la tarjeta del plan (anillos por
 * fase). Van juntos porque comparten `useStudy`.
 */
function StudyBlocks({
  model,
  slug,
  started,
  days,
  streak,
}: {
  model: SubjectModel;
  slug: string;
  started: boolean;
  days: readonly string[];
  streak: number;
}) {
  const { state } = useStudyState(slug);
  const study = useStudy(slug);
  const task = study.nextTask();

  return (
    <>
      <TodayCard
        model={model}
        slug={slug}
        study={study.model}
        bookmarks={state.bookmarks}
        started={started}
        days={days}
        streak={streak}
      />
      <PlanCard model={model} slug={slug} study={study.model} task={task} />
    </>
  );
}

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
 * La tarjeta del plan: porcentaje global, un anillo por fase (cada uno abre SU
 * fase dentro del plan), la próxima tarea pendiente y las dos salidas del
 * baseline —el plan y los kits—.
 */
function PlanCard({
  model,
  slug,
  study,
  task,
}: {
  model: SubjectModel;
  slug: string;
  study: StudyModel;
  task: ReturnType<StudyModel["nextTask"]>;
}) {
  const { phases, planProgress } = study;
  if (!phases.length) return null;
  const pct = Math.round(planProgress.ratio * 100);

  return (
    <section className={css.plan} aria-labelledby="home-plan">
      <div className={css.planMain}>
        <div className={css.planHead}>
          <h2 className={css.planTitle} id="home-plan">
            <Icon name="map" size={15} className={css.planIcon} />
            Plan de estudio{planProgress.done ? ` · ${pct}%` : ""}
          </h2>
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
            const p = study.phaseProgress(phase.id);
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
        {division?.short ?? "—"} · {model.typeLabel(page.type)}
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
 */
function ToolsSection({ model }: { model: SubjectModel }) {
  const cards = useMemo(
    () =>
      model.railGroups.flatMap((group: RailGroupView) =>
        group.items
          // «Inicio» es esta misma pantalla.
          .filter((view) => !(view.item.kind === "builtin" && view.item.target === "home"))
          .map((view) => ({ group, view })),
      ),
    [model.railGroups],
  );
  if (!cards.length) return null;

  return (
    <section className={css.tools} aria-labelledby="home-tools">
      <h2 className={css.h2} id="home-tools">
        <Icon name="grid" size={16} />
        Herramientas
      </h2>
      <div className={css.toolGrid}>
        {cards.map(({ group, view }) => {
          const { item } = view;
          const hint = toolHint(model, view);
          const body = (
            <>
              <span className={css.toolIcon} aria-hidden="true">
                <Icon name={item.icon} size={20} />
              </span>
              <span className={css.toolTitle}>{item.label}</span>
              {hint ? <span className={css.toolText}>{hint}</span> : null}
              <span className={css.toolGroupName}>{group.label}</span>
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
