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
 *
 * Fechas (S3 · D7): las instancias evaluatorias reales —los parcialitos, el
 * parcial, su recuperatorio, el final— las declara el plan (`Plan.instances`) y
 * la FECHA de cada una la carga el usuario, en su cuenta. De ahí salen los chips
 * de cuenta regresiva y la línea de ritmo de cada fase. Reiniciar el progreso no
 * borra las fechas: son dos acciones distintas, como en el baseline.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  isExternalUrl,
  plural,
  routes,
  type IconName,
  type PlanMilestone,
  type PlanPhase,
  type PlanTask,
  type PlanTrack,
} from "@sinapsis/contract";
import { Button, DatePicker, Dialog, Icon, UiIcon, useToast } from "@/components/platform";
import { useSubjectCtx } from "../context";
import { ErrorCard, WideSkeleton } from "../components/States";
import { Markdown } from "../markdown/Markdown";
import type { SubjectModel } from "../model";
import {
  countChip,
  countListItems,
  formatDate,
  instanceLabel,
  paceFor,
  paceLabel,
  phaseMainDate,
  phaseRetakeDate,
  type PlanDates,
  type StudyModel,
} from "./model";
import { ActionLink, DivisionChips, EmptyPanel, Ring, StudyHead, StudyView } from "./ui";
import { useStudy } from "./useStudy";
import css from "./PlanView.module.css";

/**
 * El JSON de ejemplo habla el idioma de la materia: si sus divisiones son
 * «semanas», el ejemplo dice «Leer la semana» y no «Leer la unidad» (U33). Es
 * el mismo `division.singular` que usa el resto de la pantalla.
 */
const planExample = (unit: string): string => `{
  "title": "Plan de estudio",
  "instances": [
    { "key": "parcial-1", "label": "Primer parcial" }
  ],
  "phases": [{
    "id": "parcial-1",
    "title": "Primer parcial",
    "subtitle": "TP1 y TP2",
    "instance": "parcial-1",
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

/** Icono de una tarea según su tipo (el mismo criterio que el baseline). */
const TASK_ICON: Record<PlanTask["kind"], IconName> = {
  read: "book",
  cards: "cards",
  quiz: "quiz",
  exercises: "list",
  tool: "tool",
  custom: "circle",
};

/**
 * Color de la fase: el de su primera división declarada (la del primer hito que
 * tenga alguna). Una fase sin divisiones toma el de la materia.
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

/**
 * Guardar (o borrar, con `null`) la fecha de una instancia. Devuelve la promesa
 * del guardado para que el campo pueda resincronizarse cuando termina.
 */
type SaveDate = (key: string, date: string | null) => void | Promise<unknown>;

/** Cuál de las dos confirmaciones del pie está abierta. */
type Confirm = "tasks" | "dates" | null;

/**
 * La tarjeta de una fase en el documento. Se busca por `data-phase` y no por un
 * `id`: el id de la fase viene de la materia (y del `?fase=` de la URL), así que
 * meterlo en un selector obligaría a escaparlo, y como `id` del DOM podría
 * chocar con el de cualquier otra cosa de la página.
 */
function phaseNode(phaseId: string): HTMLElement | null {
  for (const node of document.querySelectorAll<HTMLElement>('[data-testid="plan-phase"]')) {
    if (node.dataset.phase === phaseId) return node;
  }
  return null;
}

export function PlanView() {
  const { slug, model } = useSubjectCtx();
  const { toast } = useToast();
  const {
    content,
    state,
    model: study,
    setTask,
    setTrack,
    resetTasks,
    setPlanDate,
    clearPlanDate,
    resetPlanDates,
  } = useStudy(slug);
  const [busy, setBusy] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<Confirm>(null);
  const [params, setParams] = useSearchParams();
  const unit = model.config.division.singular.toLowerCase();
  const wanted = params.get("fase");

  const toggle = useCallback(
    (taskId: string, done: boolean) => {
      void setTask(taskId, done).catch(() => toast("No se pudo guardar la tarea.", "bad"));
    },
    [setTask, toast],
  );

  const toggleMany = useCallback(
    async (key: string, tasks: readonly PlanTask[], done: boolean) => {
      setBusy(key);
      try {
        for (const task of tasks) {
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

  const toggleMilestone = useCallback(
    (milestone: PlanMilestone, done: boolean) => void toggleMany(milestone.id, milestone.tasks, done),
    [toggleMany],
  );

  const togglePhase = useCallback(
    (phase: PlanPhase, done: boolean) =>
      void toggleMany(
        `fase:${phase.id}`,
        phase.milestones.flatMap((m) => m.tasks),
        done,
      ),
    [toggleMany],
  );

  /* Guardar la fecha no re-monta nada: la mutación escribe la caché en optimista
     y el campo (no controlado) conserva el foco. Devuelve la promesa —ya sin
     error, el aviso lo da el toast— para que el campo sepa cuándo terminó y
     pueda volver a mirar la caché. */
  const saveDate = useCallback(
    (key: string, date: string | null) => {
      const run = date === null ? clearPlanDate(key) : setPlanDate(key, date);
      return run.catch(() => toast("No se pudo guardar la fecha.", "bad"));
    },
    [clearPlanDate, setPlanDate, toast],
  );

  /* Entrada directa con `?fase=…` (lo ponen los chips de navegación y, más
     adelante, el inicio de la materia): se baja a esa fase UNA sola vez. La
     vista se vuelve a dibujar con cada tilde, y volver a saltar mientras se
     trabaja en otra fase sería peor que no saltar. */
  const jumped = useRef<string | null>(null);
  const phasesReady = study.phases.length > 0;
  useEffect(() => {
    if (!wanted || !phasesReady || jumped.current === wanted) return;
    jumped.current = wanted;
    const node = phaseNode(wanted);
    if (node) requestAnimationFrame(() => node.scrollIntoView({ block: "start" }));
  }, [wanted, phasesReady]);

  const goToPhase = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, phaseId: string) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      const node = phaseNode(phaseId);
      if (!node) return;
      event.preventDefault();
      jumped.current = phaseId;
      /* `replace`: bajar a una fase no es un paso del historial. Y se copia lo
         que ya había en la query en vez de reemplazarla entera. */
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set("fase", phaseId);
          return next;
        },
        { replace: true },
      );
      node.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [setParams],
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
            una lista de <strong>fases</strong> (las instancias evaluatorias, con su «qué cae»), cada una con{" "}
            <strong>hitos</strong> y cada hito con <strong>tareas</strong> tildables. Llega con el próximo{" "}
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
  const dates: PlanDates = study.state.planDates;

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
        actions={
          <div className={css.heroControls}>
            {tracks.length > 0 ? (
              <TrackPicker tracks={tracks} active={study.track?.id ?? null} onPick={setTrack} />
            ) : null}
            {plan.instances.length > 0 ? (
              <DatePanel instances={plan.instances} dates={dates} now={study.now} onChange={saveDate} />
            ) : null}
          </div>
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

      {/* El href es una ruta real: abierto en una pestaña nueva o con el botón
          del medio cae en el plan, no en una vista desconocida. */}
      <nav className={css.phaseNav} aria-label="Fases del plan">
        {study.phases.map((phase) => {
          const progress = study.phaseProgress(phase.id);
          return (
            <a
              key={phase.id}
              className={css.pn}
              style={{ ["--pcol" as string]: phaseColor(model, phase) }}
              href={`${routes.plan(slug)}?fase=${encodeURIComponent(phase.id)}`}
              onClick={(event) => goToPhase(event, phase.id)}
            >
              <span className={css.pnDot} aria-hidden="true" />
              <span className={css.pnTitle}>{phase.title}</span>
              <span className={css.pnPct}>{Math.round(progress.ratio * 100)}%</span>
            </a>
          );
        })}
      </nav>

      {study.phases.map((phase) => (
        <Phase
          key={phase.id}
          phase={phase}
          slug={slug}
          model={model}
          study={study}
          plan={plan}
          dates={dates}
          current={study.currentPhase?.id === phase.id}
          busy={busy}
          onToggle={toggle}
          onToggleMilestone={toggleMilestone}
          onTogglePhase={togglePhase}
          onDate={saveDate}
        />
      ))}

      <div className={css.foot}>
        <Button variant="ghost" onClick={() => setConfirm("tasks")}>
          Reiniciar el plan
        </Button>
        {plan.instances.length > 0 ? (
          <Button variant="ghost" onClick={() => setConfirm("dates")}>
            Borrar fechas
          </Button>
        ) : null}
        <ActionLink to={routes.kits(slug)} variant="primary">
          Ver los kits de estudio
        </ActionLink>
      </div>

      <Dialog
        open={confirm === "tasks"}
        onClose={() => setConfirm(null)}
        eyebrow="PLAN DE ESTUDIO"
        title="¿Reiniciar el plan?"
        footer={
          <>
            <Button onClick={() => setConfirm(null)}>Cancelar</Button>
            <Button
              variant="danger"
              onClick={() => {
                setConfirm(null);
                void resetTasks().catch(() => toast("No se pudo reiniciar el plan.", "bad"));
              }}
            >
              Reiniciar el plan
            </Button>
          </>
        }
      >
        <p className={css.dialogText}>
          {/* El API destilda TODAS las tareas de la materia, no solo las de la
              modalidad que está a la vista: el texto no promete otra cosa. */}
          Se destildan todas las tareas del plan de esta materia, también las de la otra modalidad. Las fechas de las
          instancias, la modalidad elegida y el repaso de las flashcards no se tocan.
        </p>
      </Dialog>

      <Dialog
        open={confirm === "dates"}
        onClose={() => setConfirm(null)}
        eyebrow="PLAN DE ESTUDIO"
        title="¿Borrar las fechas?"
        footer={
          <>
            <Button onClick={() => setConfirm(null)}>Cancelar</Button>
            <Button
              variant="danger"
              onClick={() => {
                setConfirm(null);
                void resetPlanDates().catch(() => toast("No se pudieron borrar las fechas.", "bad"));
              }}
            >
              Borrar fechas
            </Button>
          </>
        }
      >
        <p className={css.dialogText}>
          Se borran las fechas de todas las instancias evaluatorias. El progreso del plan y la modalidad no se tocan.
        </p>
      </Dialog>
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
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  /* En un `radiogroup` el foco SIGUE a la selección (APG): con el tabindex
     rotativo que usa el grupo, quedarse sobre el botón anterior deja el foco en
     un radio que acaba de pasar a `aria-checked=false` y a `tabIndex=-1`, así
     que un lector de pantalla solo anuncia que se desmarcó y nunca cuál quedó
     activa. */
  const move = (delta: number) => {
    const to = (at + delta + tracks.length) % tracks.length;
    const next = tracks[to];
    if (!next) return;
    onPick(next.id);
    buttons.current[to]?.focus();
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
              ref={(node) => {
                buttons.current[i] = node;
              }}
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
      <p className={css.tracksHint}>
        {current?.description ? (
          <>
            <span>{current.description}</span>
            {" · "}
          </>
        ) : null}
        El porcentaje total se mide sobre las fases de la modalidad elegida, así que cambia al cambiarla.
      </p>
    </div>
  );
}

/**
 * Campo de fecha de una instancia: el calendario propio de la plataforma.
 *
 * Es CONTROLADO desde la caché del estado de estudio, y por eso no hay ningún
 * valor local que pueda quedar desfasado: «Borrar fechas» y la vuelta atrás de
 * un guardado que falló se ven solas, y los dos campos de la misma instancia
 * —el del panel del hero y el de la tarjeta de la fase— nunca pueden mostrar
 * cosas distintas.
 *
 * El campo nativo `type="date"` que había antes no daba ninguna de las dos
 * cosas: su segmento de año emite un `change` por dígito, así que teclear
 * «2027» disparaba cuatro guardados («0002-…», «0020-…», «0202-…», «2027-…»),
 * los tres primeros se persistían de verdad en la cuenta, y las mutaciones
 * solapadas dejaban la pantalla mintiendo. Cada elección del calendario es un
 * solo guardado.
 */
function DateField({
  instanceKey,
  label,
  value,
  showLabel = true,
  onChange,
}: {
  instanceKey: string;
  label: string;
  value: string;
  showLabel?: boolean;
  onChange: SaveDate;
}) {
  /* Calendario propio de la plataforma (pedido del usuario): controlado desde la
     caché del estado de estudio, así «Borrar fechas» o la vuelta atrás de un
     guardado fallido se reflejan solos. Cada elección guarda una vez. */
  return (
    <div className={css.dfield}>
      {showLabel ? <span className={css.dlabel}>{label}</span> : null}
      <DatePicker
        value={value ? value : null}
        onChange={(next) => {
          void onChange(instanceKey, next);
        }}
        label={`Fecha de ${label}`}
        size="sm"
      />
    </div>
  );
}

/** Chip de cuenta regresiva: «faltan 12 días». Nada si la instancia no tiene fecha. */
function CountChipView({ date, now }: { date: string | null | undefined; now: Date }) {
  const chip = countChip(date, now);
  if (!chip) return null;
  return (
    <span className={css.count} data-tone={chip.tone}>
      <Icon name="clock" size={12} />
      {chip.text}
    </span>
  );
}

/** Panel plegable del hero: una fila por instancia evaluatoria del plan. */
function DatePanel({
  instances,
  dates,
  now,
  onChange,
}: {
  instances: readonly { key: string; label: string; optional: boolean }[];
  dates: PlanDates;
  now: Date;
  onChange: SaveDate;
}) {
  return (
    <details className={css.datePanel}>
      <summary className={css.datePanelSummary}>
        <UiIcon name="chevronRight" size={13} className={css.chevron} />
        <Icon name="clock" size={13} />
        Fechas de las instancias
      </summary>
      <div className={css.datePanelGrid}>
        {instances.map((instance) => (
          <div key={instance.key} className={css.dateRow}>
            <DateField
              instanceKey={instance.key}
              label={instance.label}
              value={dates[instance.key] ?? ""}
              onChange={onChange}
            />
            <CountChipView date={dates[instance.key]} now={now} />
          </div>
        ))}
      </div>
      <p className={css.datePanelNote}>
        Las fechas quedan guardadas en su cuenta y no se borran al reiniciar el progreso del plan.
      </p>
    </details>
  );
}

/** Bloque de fechas de una fase: su instancia, su recuperatorio y el ritmo. */
function PhaseDates({
  phase,
  plan,
  dates,
  study,
  onChange,
}: {
  phase: PlanPhase;
  plan: NonNullable<StudyModel["plan"]>;
  dates: PlanDates;
  study: StudyModel;
  onChange: SaveDate;
}) {
  const main = phaseMainDate(phase, dates);
  const retakeDate = phaseRetakeDate(phase, dates);
  const progress = study.phaseProgress(phase.id);
  const msPending = phase.milestones.filter((m) => {
    const p = study.milestoneProgress(m.id);
    return p.done < p.total;
  }).length;
  const pace = paceLabel(paceFor(phase, dates, progress.total - progress.done, msPending, study.now));

  if (!phase.instance && !main) return null;

  return (
    <div className={css.dates}>
      <div className={css.dateRow}>
        {phase.instance ? (
          <DateField
            instanceKey={phase.instance}
            label={instanceLabel(plan, phase.instance)}
            value={dates[phase.instance] ?? ""}
            onChange={onChange}
          />
        ) : main ? (
          /* Fase sin instancia declarada: la fecha del cronograma, sin campo. */
          <span className={css.dateStatic}>
            <Icon name="clock" size={13} />
            {formatDate(main)}
          </span>
        ) : null}
        <CountChipView date={main} now={study.now} />
      </div>

      {phase.retake ? (
        <details className={css.retake} open={!!retakeDate}>
          <summary className={css.retakeSummary}>
            <UiIcon name="chevronRight" size={12} className={css.chevron} />
            {instanceLabel(plan, phase.retake)}
          </summary>
          <div className={css.dateRow}>
            <DateField
              instanceKey={phase.retake}
              label={instanceLabel(plan, phase.retake)}
              value={retakeDate ?? ""}
              showLabel={false}
              onChange={onChange}
            />
            <CountChipView date={retakeDate} now={study.now} />
          </div>
        </details>
      ) : null}

      {pace ? <p className={css.pace}>{pace}</p> : null}
    </div>
  );
}

function Phase({
  phase,
  slug,
  model,
  study,
  plan,
  dates,
  current,
  busy,
  onToggle,
  onToggleMilestone,
  onTogglePhase,
  onDate,
}: {
  phase: PlanPhase;
  slug: string;
  model: SubjectModel;
  study: StudyModel;
  plan: NonNullable<StudyModel["plan"]>;
  dates: PlanDates;
  current: boolean;
  busy: string | null;
  onToggle: (taskId: string, done: boolean) => void;
  onToggleMilestone: (milestone: PlanMilestone, done: boolean) => void;
  onTogglePhase: (phase: PlanPhase, done: boolean) => void;
  onDate: SaveDate;
}) {
  const progress = study.phaseProgress(phase.id);
  const allDone = progress.total > 0 && progress.done === progress.total;
  const color = phaseColor(model, phase);
  const scopeItems = countListItems(phase.scope);
  const exists = useCallback((s: string) => model.bySlug.has(s), [model]);

  return (
    <section
      className={css.phase}
      style={{ ["--pcol" as string]: color }}
      data-current={current ? "true" : undefined}
      data-testid="plan-phase"
      data-phase={phase.id}
    >
      <header className={css.phaseHead}>
        <div className={css.phaseMain}>
          <span className={css.phaseKicker}>
            {current ? "FASE ACTUAL · " : ""}
            {(phase.subtitle ?? `${phase.milestones.length} ${plural(phase.milestones.length, "hito", "hitos")}`).toUpperCase()}
          </span>
          <h2 className={css.phaseTitle}>{phase.title}</h2>
          {phase.description ? <p className={css.phaseBlurb}>{phase.description}</p> : null}
          <PhaseDates phase={phase} plan={plan} dates={dates} study={study} onChange={onDate} />
        </div>
        <div className={css.phaseAside}>
          <Ring
            ratio={progress.ratio}
            size={76}
            color={color}
            label={`${phase.title}: ${progress.done} de ${progress.total} tareas`}
          />
          <span className={css.phaseCount}>
            {progress.done} / {progress.total}
          </span>
          <button
            type="button"
            className={css.bulkLg}
            disabled={busy === `fase:${phase.id}` || progress.total === 0}
            onClick={() => onTogglePhase(phase, !allDone)}
          >
            {allDone ? "Reabrir fase" : "Completar fase"}
          </button>
        </div>
      </header>

      {phase.scope ? (
        <details className={css.scope} open={current}>
          {/* Un plan tiene seis «Qué cae» idénticos: el nombre accesible dice de
              qué fase es cada uno (U22). */}
          <summary className={css.scopeSummary} aria-label={`Qué cae en el examen de ${phase.title}`}>
            <UiIcon name="chevronRight" size={14} className={css.chevron} />
            Qué cae en este examen
            {scopeItems > 0 ? <span className={css.scopeCount}>{scopeItems}</span> : null}
          </summary>
          <div className={css.scopeBody}>
            <Markdown body={phase.scope} subject={slug} exists={exists} />
          </div>
        </details>
      ) : null}

      {phase.guide ? (
        <details className={`${css.scope} ${css.guide}`}>
          <summary className={css.scopeSummary} aria-label={`Cómo recorrer el programa de ${phase.title}`}>
            <UiIcon name="chevronRight" size={14} className={css.chevron} />
            Cómo recorrer el programa
          </summary>
          <div className={css.scopeBody}>
            <Markdown body={phase.guide} subject={slug} exists={exists} />
          </div>
        </details>
      ) : null}

      <div className={css.milestones}>
        {phase.milestones.map((milestone) => {
          const mp = study.milestoneProgress(milestone.id);
          const done = mp.total > 0 && mp.done === mp.total;
          return (
            <article key={milestone.id} className={css.milestone}>
              <header className={css.milestoneHead}>
                <Icon name={milestone.icon ?? "layers"} size={16} className={css.milestoneIcon} />
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
                    done
                      ? `Reabrir el hito «${milestone.title}» de ${phase.title}`
                      : `Marcar todo el hito «${milestone.title}» de ${phase.title}`
                  }
                  onClick={() => onToggleMilestone(milestone, !done)}
                >
                  {done ? "Reabrir" : "Marcar todo"}
                </button>
              </header>

              <ul className={css.tasks}>
                {milestone.tasks.map((task) => {
                  const taskDone = study.isTaskDone(task.id);
                  const link = taskLink(model, study, slug, task);
                  return (
                    <li key={task.id} className={css.task} data-done={taskDone ? "true" : undefined}>
                      <label className={css.check}>
                        {/* «Resolver el TP1» se repite entre hitos y el mismo
                            hito entre fases: hacen falta los dos para que cada
                            casilla tenga un nombre propio (U22). */}
                        <input
                          type="checkbox"
                          className={css.input}
                          checked={taskDone}
                          aria-label={`${task.label} · ${milestone.title} · ${phase.title}`}
                          onChange={(event) => onToggle(task.id, event.target.checked)}
                        />
                        <span className={css.box} aria-hidden="true">
                          <UiIcon name="check" size={12} />
                        </span>
                        <Icon name={TASK_ICON[task.kind]} size={15} className={css.taskIcon} />
                        <span className={css.taskBody}>
                          <span className={css.taskLabel}>{task.label}</span>
                          {task.detail ? <span className={css.taskHint}>{task.detail}</span> : null}
                        </span>
                      </label>
                      {link?.to ? (
                        /* Sin `title`: cuando la tarea apunta a una página, la
                           vista previa (N0-50) ya se encarga del enlace y el
                           tooltip nativo dibujaría una segunda tarjeta encima.
                           El nombre accesible lo sigue dando `aria-label`. */
                        <Link
                          className={css.taskLink}
                          to={link.to}
                          aria-label={`Abrir ${link.label}: ${task.label}`}
                        >
                          <UiIcon name="chevronRight" size={15} />
                        </Link>
                      ) : link?.href ? (
                        <a
                          className={css.taskLink}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Abrir"
                          aria-label={`Abrir ${link.label}: ${task.label} (se abre en otra pestaña)`}
                        >
                          <UiIcon name="external" size={13} />
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
