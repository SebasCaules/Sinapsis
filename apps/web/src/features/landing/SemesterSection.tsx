import type { ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import type { SubjectCard as SubjectCardData } from "@sinapsis/contract";
import { UiIcon } from "@/components/platform";
import type { SemesterGroup } from "@/lib/semesters";
import { SortableSubjectCard, SubjectCard } from "./SubjectCard";
import css from "./SemesterSection.module.css";

/** id del contenedor droppable de un cuatrimestre (dnd-kit). */
export const groupId = (semester: string) => `sem:${semester}`;

export interface SemesterSectionProps {
  group: SemesterGroup;
  collapsed: boolean;
  onToggle: () => void;
  manage: boolean;
  semesters: string[];
  onRemove?: (card: SubjectCardData) => void;
  onMove?: (card: SubjectCardData, semester: string) => void;
  /** Tarjeta fantasma "+ Agregar materia" del cuatrimestre más reciente. */
  children?: ReactNode;
}

export function SemesterSection({
  group,
  collapsed,
  onToggle,
  manage,
  semesters,
  onRemove,
  onMove,
  children,
}: SemesterSectionProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: groupId(group.semester),
    data: { type: "group", semester: group.semester },
    disabled: !manage,
  });

  const n = group.cards.length;

  return (
    <section className={css.section} aria-label={group.label}>
      <div className={css.head}>
        {manage ? (
          <span className={css.handle} title="El orden de los cuatrimestres se deriva del rótulo" aria-hidden="true">
            ⋮⋮
          </span>
        ) : null}
        <span className={css.bar} aria-hidden="true" />
        <button type="button" className={css.toggle} onClick={onToggle} aria-expanded={!collapsed}>
          <span className={css.chip}>{group.chip}</span>
          <span className={css.title}>{group.label}</span>
          <span className={css.spacer} />
          <span className={css.count}>{n === 1 ? "1 materia" : `${n} materias`}</span>
          <UiIcon name="chevronDown" size={16} className={css.chev} data-collapsed={collapsed} />
        </button>
      </div>

      {collapsed ? null : (
        <div className={css.grid} ref={setNodeRef} data-over={manage && isOver ? "true" : undefined}>
          <SortableContext items={group.cards.map((c) => c.slug)} strategy={rectSortingStrategy}>
            {group.cards.map((card) =>
              manage ? (
                <SortableSubjectCard
                  key={card.slug}
                  card={card}
                  manage
                  semesters={semesters}
                  onRemove={onRemove}
                  onMove={onMove}
                />
              ) : (
                <SubjectCard key={card.slug} card={card} />
              ),
            )}
          </SortableContext>
          {n === 0 && manage ? (
            <div className={css.empty} data-over={isOver ? "true" : undefined}>
              SUELTE UNA MATERIA AQUÍ
            </div>
          ) : null}
          {children}
        </div>
      )}
    </section>
  );
}
