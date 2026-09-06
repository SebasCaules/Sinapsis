import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { routes, type SubjectCard as SubjectCardData } from "@sinapsis/contract";
import { UiIcon } from "@/components/platform";
import { cssColor } from "@/lib/color";
import { semesterShort } from "@/lib/semesters";
import css from "./SubjectCard.module.css";

export type ProgressState = "none" | "doing" | "done";

export interface Progress {
  pct: number;
  state: ProgressState;
  label: string;
}

/** Progreso de una materia: porcentaje, estado y rótulo versalita. */
export function progressOf(card: Pick<SubjectCardData, "pagesCount" | "studiedCount">): Progress {
  const total = Math.max(0, card.pagesCount);
  const done = Math.min(Math.max(0, card.studiedCount), total);
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  if (total > 0 && done >= total) return { pct: 100, state: "done", label: "COMPLETA" };
  if (done > 0) return { pct, state: "doing", label: "EN CURSO" };
  return { pct: 0, state: "none", label: "SIN COMENZAR" };
}

/** "12 divisiones · 207 páginas", con el rótulo de división de la materia. */
export function metaOf(card: SubjectCardData): string {
  const divisions = card.divisionsCount;
  const unit = divisions === 1 ? card.division.singular.toLowerCase() : card.division.plural.toLowerCase();
  const pages = card.pagesCount === 1 ? "página" : "páginas";
  return `${divisions} ${unit} · ${card.pagesCount} ${pages}`;
}

export interface SubjectCardProps {
  card: SubjectCardData;
  /** Modo gestión: la tarjeta deja de navegar y muestra asa, Quitar y Mover. */
  manage?: boolean;
  semesters?: string[];
  onRemove?: (card: SubjectCardData) => void;
  onMove?: (card: SubjectCardData, semester: string) => void;
  /** Copia que sigue al puntero mientras se arrastra. */
  overlay?: boolean;
  dragging?: boolean;
  handle?: ReactNode;
  style?: CSSProperties;
}

export function SubjectCard({
  card,
  manage = false,
  semesters = [],
  onRemove,
  onMove,
  overlay = false,
  dragging = false,
  handle,
  style,
}: SubjectCardProps) {
  const color = cssColor(card.color);
  const progress = progressOf(card);
  const initial = card.name.trim().charAt(0).toUpperCase() || "S";

  const body = (
    <>
      <div className={css.top}>
        {handle}
        <span className={css.mark} aria-hidden="true">
          {initial}
        </span>
        <span className={css.ident}>
          <span className={css.code}>{card.code}</span>
          <span className={css.name}>{card.name}</span>
          <span className={css.institution}>{card.institution}</span>
        </span>
      </div>

      <div className={css.progress}>
        <div
          className={css.track}
          role="progressbar"
          aria-valuenow={progress.pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progreso de ${card.name}`}
        >
          <div className={css.fill} style={{ width: `${progress.pct}%` }} />
        </div>
        <div className={css.progressRow}>
          <span className={css.pages}>
            {card.studiedCount}/{card.pagesCount} páginas
          </span>
          <span className={css.state} data-state={progress.state}>
            {progress.label}
          </span>
        </div>
      </div>

      <div className={css.foot}>
        <span className={css.meta}>{metaOf(card)}</span>
        {card.placeholder ? <span className={css.badge}>Sin sincronizar</span> : null}
        {manage ? (
          <span className={css.manageTools}>
            <button type="button" className={css.remove} onClick={() => onRemove?.(card)}>
              Quitar
            </button>
            <select
              className={css.move}
              value={card.semester}
              aria-label={`Mover ${card.name} a otro cuatrimestre`}
              onChange={(e) => onMove?.(card, e.target.value)}
            >
              {(semesters.includes(card.semester) ? semesters : [card.semester, ...semesters]).map((s) => (
                <option key={s} value={s}>
                  {semesterShort(s)}
                </option>
              ))}
            </select>
          </span>
        ) : null}
      </div>
    </>
  );

  const className = [css.card, overlay ? css.overlay : "", dragging ? css.hole : ""].filter(Boolean).join(" ");
  const vars = { ...style, "--ucol": color } as CSSProperties;

  if (manage || overlay) {
    return (
      <div className={className} style={vars} data-testid="subject-card" data-slug={card.slug}>
        {body}
      </div>
    );
  }

  return (
    <Link
      className={className}
      style={vars}
      to={routes.subject(card.slug)}
      data-testid="subject-card"
      data-slug={card.slug}
    >
      {body}
    </Link>
  );
}

/** La misma tarjeta, conectada al arrastre (solo se activa desde el asa ⋮⋮). */
export function SortableSubjectCard(props: SubjectCardProps & { card: SubjectCardData }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: props.card.slug,
    data: { type: "card", semester: props.card.semester },
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className={css.sortable}>
      <SubjectCard
        {...props}
        dragging={isDragging}
        handle={
          <button
            type="button"
            ref={setActivatorNodeRef}
            className={css.handle}
            aria-label={`Reordenar ${props.card.name}`}
            {...attributes}
            {...listeners}
          >
            ⋮⋮
          </button>
        }
      />
    </div>
  );
}

/** Tarjeta fantasma al final del cuatrimestre más reciente. */
export function GhostCard({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className={css.ghost} onClick={onClick}>
      <UiIcon name="plus" size={20} />
      Agregar materia
    </button>
  );
}
