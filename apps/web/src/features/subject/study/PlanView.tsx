/**
 * Plan de estudio: fases (las instancias evaluatorias) → hitos → tareas
 * tildables. Es el mapa del cuatrimestre; la fase actual —la primera con tareas
 * pendientes— va marcada con el filete de la materia.
 *
 * Tildar es optimista: la casilla se enciende antes que responda el API y
 * vuelve atrás sola si falla.
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

const PLAN_EXAMPLE = `{
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
        { "id": "u1-leer", "label": "Leer la unidad",
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
  if (isExternalUrl(target)) return { href: target, label: "Enlace" };
  const page = model.bySlug.get(target);
  return page ? { to: routes.page(slug, target), label: "Página" } : null;
}

export function PlanView() {
  const { slug, model } = useSubjectCtx();
  const { toast } = useToast();
  const { content, model: study, setTask } = useStudy(slug);
  const [busy, setBusy] = useState<string | null>(null);

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

  if (content.isError) return <ErrorCard error={content.error} subject={slug} />;
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
              <code>{PLAN_EXAMPLE}</code>
            </pre>
            <p className={css.emptyText}>
              Las tareas admiten <code className={css.code}>kind</code>{" "}
              <code className={css.code}>read</code> (una {model.config.division.singular.toLowerCase()}),{" "}
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

  return (
    <StudyView>
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
              <span className={css.totalValue}>
                {total.done}
                <span className={css.totalOf}>/{total.total}</span>
              </span>
              <span className={css.totalLabel}>PASOS COMPLETADOS</span>
            </div>
            <Ring ratio={total.ratio} label={`${Math.round(total.ratio * 100)} por ciento`} />
          </>
        }
      />

      {plan.phases.map((phase) => (
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
    <section className={css.phase} data-current={current ? "true" : undefined}>
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
          <Bar ratio={progress.ratio} className={css.phaseBar} />
        </div>
      </header>

      {phase.scope ? (
        <details className={css.scope}>
          <summary className={css.scopeSummary}>
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
                <DivisionChips model={model} keys={milestone.divisions} />
                <span className={css.milestoneCount}>
                  {mp.done}/{mp.total}
                </span>
                <button
                  type="button"
                  className={css.bulk}
                  disabled={busy === milestone.id || mp.total === 0}
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
                        <input
                          type="checkbox"
                          className={css.input}
                          checked={done}
                          onChange={(event) => onToggle(task.id, event.target.checked)}
                        />
                        <span className={css.box} aria-hidden="true">
                          <UiIcon name="check" size={12} />
                        </span>
                        <span className={css.taskLabel}>{task.label}</span>
                      </label>
                      {link?.to ? (
                        <Link className={css.taskLink} to={link.to}>
                          {link.label}
                          <UiIcon name="chevronRight" size={13} />
                        </Link>
                      ) : link?.href ? (
                        <a
                          className={css.taskLink}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
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
