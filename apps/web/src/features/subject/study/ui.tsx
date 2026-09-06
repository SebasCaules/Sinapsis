/**
 * Vocabulario visual compartido por las cuatro vistas de estudio (flashcards,
 * quiz, plan, kits): cabecera de vista ancha, chips de división, barras y anillo
 * de progreso, cifras con rótulo versalita, teclas y panel de estado vacío.
 *
 * Es el MISMO lenguaje que el Inicio de la materia (tarjeta `--surface` con
 * relieve, versalita en los rótulos, Fraunces en los títulos, cifras en mono):
 * acá solo se le pone nombre a las piezas que se repiten en cuatro vistas.
 */
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { IconName } from "@sinapsis/contract";
import { Icon } from "@/components/platform";
import type { DivisionNode, SubjectModel } from "../model";
import css from "./ui.module.css";

export interface StudyHeadProps {
  icon: IconName;
  eyebrow: string;
  title: string;
  lead?: ReactNode;
  /** Bloque de la derecha: cifras, anillo o acciones. */
  aside?: ReactNode;
  /** Fila de acciones bajo el texto. */
  actions?: ReactNode;
}

/** Cabecera de una vista de estudio: versalita, título Fraunces y bajada. */
export function StudyHead({ icon, eyebrow, title, lead, aside, actions }: StudyHeadProps) {
  return (
    <header className={css.head}>
      <div className={css.headMain}>
        <span className={css.eyebrow}>
          <Icon name={icon} size={14} />
          {eyebrow}
        </span>
        <h1 className={css.h1}>{title}</h1>
        {lead ? <p className={css.lead}>{lead}</p> : null}
        {actions ? <div className={css.headActions}>{actions}</div> : null}
      </div>
      {aside ? <div className={css.headAside}>{aside}</div> : null}
    </header>
  );
}

/** Chip de división: punto de color + rótulo corto. */
export function DivisionChip({ division }: { division: DivisionNode | null | undefined }) {
  if (!division) return null;
  return (
    <span className={css.chip} style={{ ["--ucol" as string]: division.color }} title={division.long}>
      <span className={css.chipDot} aria-hidden="true" />
      {division.short}
    </span>
  );
}

/**
 * Los chips de una lista de claves de división (las que la materia no declara se
 * omiten).
 *
 * `max` corta la lista y resume el resto en un «+N» (revisión de diseño D5): en
 * la grilla de kits, un kit de nueve unidades envolvía los chips en dos líneas y
 * empujaba su título 27 px por debajo del de las tarjetas vecinas de la misma
 * fila. El «+N» lleva el nombre completo de las que faltan en su `title` y en su
 * nombre accesible, así que no se pierde información.
 */
export function DivisionChips({
  model,
  keys,
  max,
}: {
  model: SubjectModel;
  keys: readonly string[];
  max?: number;
}) {
  const nodes = keys.map((k) => model.division(k)).filter((d): d is DivisionNode => !!d);
  if (!nodes.length) return null;
  const cut = max !== undefined && nodes.length > max ? max : nodes.length;
  const shown = nodes.slice(0, cut);
  const rest = nodes.slice(cut);
  const restLabel = rest.map((d) => d.long).join(" · ");
  return (
    <span className={css.chips}>
      {shown.map((d) => (
        <DivisionChip key={d.key} division={d} />
      ))}
      {rest.length ? (
        <span className={`${css.chip} ${css.chipMore}`} title={restLabel}>
          +{rest.length}
          {/* Texto y no `aria-label`: en un `span` sin rol, `aria-label` no se
              expone de forma fiable. */}
          <span className={css.srOnly}>{` (${restLabel})`}</span>
        </span>
      ) : null}
    </span>
  );
}

/**
 * Barra de progreso fina. `ratio` es 0..1.
 *
 * Es un `progressbar` de verdad, con su valor (U23): dibujada solo con dos
 * `span`, el progreso existía únicamente para quien lo ve. `label` es su nombre
 * accesible y siempre hay que darlo: una barra sin nombre no dice de QUÉ es el
 * porcentaje que anuncia.
 */
export function Bar({
  ratio,
  color,
  className,
  label,
}: {
  ratio: number;
  color?: string;
  className?: string;
  label: string;
}) {
  const pct = Math.round(Math.min(1, Math.max(0, ratio)) * 100);
  return (
    <span
      className={[css.track, className].filter(Boolean).join(" ")}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-valuetext={`${pct} %`}
    >
      <span className={css.fill} style={{ width: `${pct}%`, ...(color ? { background: color } : null) }} />
    </span>
  );
}

/**
 * Anillo de progreso con el porcentaje en el centro (el del plan del baseline).
 *
 * `color` tiñe el arco: en el plan, el color de la fase. Sin él manda `--primary`.
 */
export function Ring({
  ratio,
  size = 92,
  label,
  color,
}: {
  ratio: number;
  size?: number;
  label?: string;
  color?: string;
}) {
  const pct = Math.round(Math.min(1, Math.max(0, ratio)) * 100);
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div
      className={css.ring}
      style={{ width: size, height: size, ...(color ? { ["--ring-col" as string]: color } : null) }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} className={css.ringTrack} strokeWidth={5} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className={css.ringFill}
          strokeWidth={5}
          fill="none"
          strokeLinecap={pct > 0 ? "round" : "butt"}
          strokeDasharray={`${(c * pct) / 100} ${c}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className={css.ringPct}>
        {pct}
        <span className={css.ringUnit}>%</span>
      </span>
      {label ? <span className={css.srOnly}>{label}</span> : null}
    </div>
  );
}

/** Cifra con rótulo versalita. `tone` tiñe la cifra (vencidas, dominadas…). */
export function Stat({
  value,
  label,
  tone = "plain",
}: {
  value: ReactNode;
  label: string;
  tone?: "plain" | "due" | "fresh" | "mastered";
}) {
  return (
    <span className={css.stat} data-tone={tone}>
      <span className={css.statValue}>{value}</span>
      <span className={css.statLabel}>{label}</span>
    </span>
  );
}

/** Tecla del atajo (1-4, A-D, Espacio). */
export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className={css.kbd}>{children}</kbd>;
}

export interface EmptyPanelProps {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  actions?: ReactNode;
}

/**
 * Panel de estado vacío: mismo relieve que las tarjetas de estado del shell.
 *
 * El título va en `h1` (U39): cuando este panel se dibuja ES la vista entera, y
 * dejarlo en `h2` hacía que la pantalla no tuviera encabezado de primer nivel.
 */
export function EmptyPanel({ eyebrow, title, children, actions }: EmptyPanelProps) {
  return (
    <div className={css.emptyWrap}>
      <div className={css.empty}>
        <span className={css.eyebrow}>{eyebrow}</span>
        <h1 className={css.emptyTitle}>{title}</h1>
        {children}
        {actions ? <div className={css.emptyActions}>{actions}</div> : null}
      </div>
    </div>
  );
}

type ActionVariant = "primary" | "secondary";

const actionClass = (variant: ActionVariant, className?: string): string =>
  [css.action, variant === "primary" ? css.actionPrimary : css.actionSecondary, className]
    .filter(Boolean)
    .join(" ");

/** Enlace con forma de botón (la misma que el Inicio de la materia). */
export function ActionLink({
  to,
  variant = "secondary",
  children,
  className,
  title,
  label,
}: {
  to: string;
  variant?: ActionVariant;
  children: ReactNode;
  className?: string;
  title?: string;
  /**
   * Nombre accesible cuando el rótulo visible se repite en la pantalla: en la
   * lista de mazos hay dieciocho «Estudiar todo» y seis «Estudiar nuevas (11)»
   * que, sin esto, suenan idénticos en la lista de enlaces de un lector de
   * pantalla (revisión de diseño D5).
   */
  label?: string;
}) {
  return (
    <Link className={actionClass(variant, className)} to={to} title={title} aria-label={label}>
      {children}
    </Link>
  );
}

/** Contenedor de vista ancha (1120), el mismo que usa el Inicio. */
export function StudyView({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={[css.view, className].filter(Boolean).join(" ")}>{children}</div>;
}
