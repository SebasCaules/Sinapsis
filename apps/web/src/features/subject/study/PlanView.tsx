/**
 * Plan de estudio: fases (las instancias evaluatorias) → hitos → tareas
 * tildables. Es el mapa del cuatrimestre; la fase actual —la primera con tareas
 * pendientes— va marcada con el filete de la materia.
 *
 * Tildar es optimista: la casilla se enciende antes que responda el API y
 * vuelve atrás sola si falla.
 *
 * Modalidades (S-11 / N0-43): un plan puede traer más de una vía —«cursada y
 * final» o «final directo»— con sus propias fases. Arriba de todo hay un
 * conmutador; la elección se recuerda por materia, y el progreso, la fase actual
 * y «lo próximo» se cuentan SOLO sobre la modalidad activa. Los ids de tarea son
 * globales al plan: lo tildado en una vía aparece tildado en la otra.
 */
import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import {
  isExternalUrl,
  plural,
  routes,
  type PlanMilestone,
  type PlanPhase,
  type PlanTask,
  type PlanTrack,
} from "@sinapsis/contract";
import { Icon, UiIcon, useToast } from "@/components/platform";
import { useSubjectCtx } from "../context";
import { ErrorCard, WideSkeleton } from "../components/States";
import { Markdown } from "../markdown/Markdown";
import type { SubjectModel } from "../model";
import { formatDate, relativeDayLabel, type StudyModel } from "./model";
import { ActionLink, Bar, DivisionChips, EmptyPanel, Ring, StudyHead, StudyView } from "./ui";
import { useStudy } from "./useStudy";
import css from "./PlanView.module.css";

/**
 * El JSON de ejemplo habla el idioma de la materia: si sus divisiones son
 * «semanas», el ejemplo dice «Leer la semana» y no «Leer la unidad» (U33). Es
 * el mismo `division.singular` que usa el resto de la pantalla.
 */
const planExample = (unit: string): string => `{
  "title": "Plan de estudio",
  "phases": [{
    "id": "parcial-1",
    "title": "Primer parcial",
    "date": "2026-04-18",
    "scope": "Qué cae: descriptiva y conteo.",
    "milestones": [{
      "id": "hito-u1",
      "title": "Estadística descriptiva",
      "divisions": ["1"],
      "tasks": [
        { "id": "u1-leer", "label": "Leer la ${unit}",
          "kind": "read", "target": "1" },
        { "id": "u1-mazo", "label": "Repasar el mazo",
          "kind": "cards", "target": "u1" }
      ]
    }]
  }]
}`;

/** A dónde lleva una tarea según su tipo; null si el destino no existe en la materia. */
function taskLink(
  model: SubjectModel,
  study: StudyModel,
  slug: string,
  task: PlanTask,
): { to?: string; href?: string; label: string } | null {
  const target = task.target?.trim();
  if (!target) return null;

  if (task.kind === "read") {
    const division = model.division(target);
    return division ? { to: routes.division(slug, target), label: division.short } : null;
  }
  if (task.kind === "cards") {
    const deck = study.deck(target);
    return deck ? { to: routes.deck(slug, target), label: "Mazo" } : null;
  }
  if (task.kind === "quiz") {
    const quiz = study.quiz(target);
    return quiz ? { to: routes.quizOne(slug, target), label: "Quiz" } : null;
  }
  if (task.kind === "tool") {
    // Herramienta de la materia: un ítem del rail (page, link, tool o builtin).
    const item = model.railItem(target);
    if (!item) return null;
    if (item.to) return { to: item.to, label: item.item.label };
    if (item.href) return { href: item.href, label: item.item.label };
    return null;
  }
  if (isExternalUrl(target)) return { href: target, label: "Enlace" };
  const page = model.bySlug.get(target);
  return page ? { to: routes.page(slug, target), label: "Página" } : null;
}

export function PlanView() {
  const { slug, model } = useSubjectCtx();
  const { toast } = useToast();
  const { content, state, model: study, setTask, setTrack } = useStudy(slug);
  const [busy, setBusy] = useState<string | null>(null);
  const unit = model.config.division.singular.toLowerCase();

  const toggle = useCallback(
    (taskId: string, done: boolean) => {
      void setTask(taskId, done).catch(() => toast("No se pudo guardar la tarea.", "bad"));
    },
    [setTask, toast],
  );

  const toggleMilestone = useCallback(
    async (milestone: PlanMilestone, done: boolean) => {
      setBusy(milestone.id);
      try {
        for (const task of milestone.tasks) {
          if (study.isTaskDone(task.id) !== done) await setTask(task.id, done);
        }
      } catch {
        toast("No se pudieron guardar todas las tareas.", "bad");
      } finally {
        setBusy(null);
      }
    },
    [setTask, study, toast],
  );

  /* Las tareas tildadas vienen del estado del usuario: si esa consulta falla,
     el plan entero se vería como si no hubiera nada hecho (bug 12). */
  if (content.isError) return <ErrorCard error={content.error} subject={slug} />;
  if (state.isError) return <ErrorCard error={state.error} subject={slug} />;
  if (content.isPending) return <WideSkeleton />;

  const plan = study.plan;

  if (!plan || !plan.phases.length) {
    return (
      <StudyView>
        <EmptyPanel
          eyebrow="SIN PLAN"
          title="Esta materia todavía no tiene plan de estudio"
          actions={
            <>
              <ActionLink to={routes.kits(slug)} variant="primary">
                Kits de estudio
              </ActionLink>
              <ActionLink to={routes.flashcards(slug)}>Flashcards</ActionLink>
            </>
          }
        >
          <p className={css.emptyText}>
            El plan se escribe en <code className={css.code}>estudio/plan.json</code>, dentro del wiki de la materia:
            una lista de <strong>fases</strong> (las instancias evaluatorias, con su fecha y su «qué cae»), cada una
            con <strong>hitos</strong> y cada hito con <strong>tareas</strong> tildables. Llega con el próximo{" "}
            <code className={css.code}>sync</code>.
          </p>
          <details className={css.example}>
            <summary className={css.exampleSummary}>
              <UiIcon name="chevronRight" size={14} className={css.chevron} />
              Ver el formato
            </summary>
            <pre className={css.pre}>
              <code>{planExample(unit)}</code>
            </pre>
            <p className={css.emptyText}>
              Las tareas admiten <code className={css.code}>kind</code>{" "}
              <code className={css.code}>read</code> (una {unit}),{" "}
              <code className={css.code}>cards</code> (un mazo), <code className={css.code}>quiz</code>,{" "}
              <code className={css.code}>exercises</code> y <code className={css.code}>custom</code> (una página del
              wiki o una URL). El contrato completo está documentado en{" "}
              <code className={css.code}>docs/CONTRACT.md</code> y en la skill{" "}
              <code className={css.code}>/sinapsis</code>.
            </p>
          </details>
        </EmptyPanel>
      </StudyView>
    );
  }

  const total = study.planProgress;
  const next = study.nextTask();
  const tracks = study.tracks;

  return (
    <StudyView>
      {tracks.length > 0 ? (
        <TrackPicker tracks={tracks} active={study.track?.id ?? null} onPick={setTrack} />
      ) : null}

      <StudyHead
        icon="map"
        eyebrow="CAMINO AL FINAL"
        title={plan.title || "Plan de estudio"}
        lead={
          next ? (
            <>
              Lo próximo: <strong className={css.nextTask}>{next.task.label}</strong>, en{" "}
              {next.milestone.title} ({next.phase.title}).
            </>
          ) : (
            "Todas las tareas del plan están hechas. El repaso espaciado se encarga del resto."
          )
        }
        aside={
          <>
            <div className={css.totalText}>
              <span className={css.totalValue} data-testid="plan-total">
                {total.done}
                <span className={css.totalOf}>/{total.total}</span>
              </span>
              {/* «Tareas» es como se llaman en el contrato, en el JSON del plan
                  y en el resto de esta pantalla; «pasos» no existía (U33). */}
              <span className={css.totalLabel}>TAREAS COMPLETADAS</span>
            </div>
            <Ring ratio={total.ratio} label={`${Math.round(total.ratio * 100)} por ciento del plan`} />
          </>
        }
      />

      {study.phases.map((phase) => (
        <Phase
          key={phase.id}
          phase={phase}
          slug={slug}
          model={model}
          study={study}
          current={study.currentPhase?.id === phase.id}
          busy={busy}
          onToggle={toggle}
          onToggleMilestone={toggleMilestone}
        />
      ))}
    </StudyView>
  );
}

/**
 * Conmutador de modalidad. Es un `radiogroup` de verdad y no un puñado de
 * botones: son opciones EXCLUYENTES sobre el mismo plan, y con las flechas se
 * recorren como tales. La activa lleva `aria-checked`, no solo el color.
 */
function TrackPicker({
  tracks,
  active,
  onPick,
}: {
  tracks: readonly PlanTrack[];
  active: string | null;
  onPick: (id: string) => void;
}) {
  const at = Math.max(0, tracks.findIndex((t) => t.id === active));
  const current = tracks[at];

  const move = (delta: number) => {
    const next = tracks[(at + delta + tracks.length) % tracks.length];
    if (next) onPick(next.id);
  };

  return (
    <div className={css.tracks}>
      <span className={css.tracksLabel} id="plan-tracks-label">
        MODALIDAD
      </span>
      <div className={css.segmented} role="radiogroup" aria-labelledby="plan-tracks-label">
        {tracks.map((track, i) => {
          const on = i === at;
          return (
            <button
              key={track.id}
              type="button"
              role="radio"
              aria-checked={on}
              /* Solo la activa entra en el orden de tabulación: adentro del
                 grupo se mueve uno con las flechas (patrón `radiogroup`). */
              tabIndex={on ? 0 : -1}
              className={css.segment}
              data-on={on ? "true" : undefined}
              title={track.description}
              onClick={() => onPick(track.id)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                  event.preventDefault();
                  move(1);
                } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                  event.preventDefault();
                  move(-1);
                }
              }}
            >
              {track.label}
            </button>
          );
        })}
      </div>
      {current?.description ? <p className={css.tracksHint}>{current.description}</p> : null}
    </div>
  );
}

function Phase({
  phase,
  slug,
  model,
  study,
  current,
  busy,
  onToggle,
  onToggleMilestone,
}: {
  phase: PlanPhase;
  slug: string;
  model: SubjectModel;
  study: StudyModel;
  current: boolean;
  busy: string | null;
  onToggle: (taskId: string, done: boolean) => void;
  onToggleMilestone: (milestone: PlanMilestone, done: boolean) => void;
}) {
  const progress = study.phaseProgress(phase.id);
  const relative = phase.date ? relativeDayLabel(phase.date, study.now) : null;
  const exists = useCallback((s: string) => model.bySlug.has(s), [model]);

  return (
    <section
      className={css.phase}
      data-current={current ? "true" : undefined}
      data-testid="plan-phase"
      data-phase={phase.id}
    >
      <header className={css.phaseHead}>
        <div className={css.phaseMain}>
          <span className={css.phaseEyebrow}>
            {current ? "FASE ACTUAL · " : ""}
            {phase.milestones.length} {plural(phase.milestones.length, "HITO", "HITOS")}
          </span>
          <h2 className={css.phaseTitle}>{phase.title}</h2>
          {phase.subtitle ? <p className={css.phaseSubtitle}>{phase.subtitle}</p> : null}
        </div>
        <div className={css.phaseAside}>
          {phase.date ? (
            <span className={css.date}>
              <Icon name="clock" size={13} />
              {formatDate(phase.date)}
              {relative ? <span className={css.dateRelative}>{relative}</span> : null}
            </span>
          ) : null}
          <span className={css.phaseCount}>
            {progress.done} / {progress.total}
          </span>
          <Bar
            ratio={progress.ratio}
            className={css.phaseBar}
            label={`${phase.title}: ${progress.done} de ${progress.total} tareas`}
          />
        </div>
      </header>

      {phase.scope ? (
        <details className={css.scope}>
          {/* Un plan tiene seis «Qué cae» idénticos: el nombre accesible dice de
              qué fase es cada uno (U22). */}
          <summary className={css.scopeSummary} aria-label={`Qué cae en ${phase.title}`}>
            <UiIcon name="chevronRight" size={14} className={css.chevron} />
            Qué cae
          </summary>
          <div className={css.scopeBody}>
            <Markdown body={phase.scope} subject={slug} exists={exists} />
          </div>
        </details>
      ) : null}

      <div className={css.milestones}>
        {phase.milestones.map((milestone) => {
          const mp = study.milestoneProgress(milestone.id);
          const allDone = mp.total > 0 && mp.done === mp.total;
          return (
            <article key={milestone.id} className={css.milestone}>
              <header className={css.milestoneHead}>
                <h3 className={css.milestoneTitle}>{milestone.title}</h3>
                <DivisionChips model={model} keys={milestone.divisions} max={3} />
                <span className={css.milestoneCount}>
                  {mp.done}/{mp.total}
                </span>
                <button
                  type="button"
                  className={css.bulk}
                  disabled={busy === milestone.id || mp.total === 0}
                  /* El mismo hito aparece en varias fases: sin la fase, media
                     docena de botones comparten nombre (U22). */
                  aria-label={
                    allDone
                      ? `Desmarcar todo el hito «${milestone.title}» de ${phase.title}`
                      : `Marcar todo el hito «${milestone.title}» de ${phase.title}`
                  }
                  onClick={() => onToggleMilestone(milestone, !allDone)}
                >
                  {allDone ? "Desmarcar" : "Marcar todo el hito"}
                </button>
              </header>

              <ul className={css.tasks}>
                {milestone.tasks.map((task) => {
                  const done = study.isTaskDone(task.id);
                  const link = taskLink(model, study, slug, task);
                  return (
                    <li key={task.id} className={css.task} data-done={done ? "true" : undefined}>
                      <label className={css.check}>
                        {/* «Resolver el TP1» se repite entre hitos y el mismo
                            hito entre fases: hacen falta los dos para que cada
                            casilla tenga un nombre propio (U22). */}
                        <input
                          type="checkbox"
                          className={css.input}
                          checked={done}
                          aria-label={`${task.label} · ${milestone.title} · ${phase.title}`}
                          onChange={(event) => onToggle(task.id, event.target.checked)}
                        />
                        <span className={css.box} aria-hidden="true">
                          <UiIcon name="check" size={12} />
                        </span>
                        <span className={css.taskLabel}>{task.label}</span>
                      </label>
                      {link?.to ? (
                        <Link className={css.taskLink} to={link.to} aria-label={`${link.label}: ${task.label}`}>
                          {link.label}
                          <UiIcon name="chevronRight" size={13} />
                        </Link>
                      ) : link?.href ? (
                        <a
                          className={css.taskLink}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${link.label}: ${task.label} (se abre en otra pestaña)`}
                        >
                          {link.label}
                          <UiIcon name="external" size={12} />
                        </a>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default PlanView;
