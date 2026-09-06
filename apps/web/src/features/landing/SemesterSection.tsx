import { useId, type CSSProperties, type ReactNode } from "react";
import { SortableContext, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { plural, type SubjectCard as SubjectCardData } from "@sinapsis/contract";
import { UiIcon } from "@/components/platform";
import type { SemesterGroup } from "@/lib/semesters";
import { SortableSubjectCard, SubjectCard } from "./SubjectCard";
import css from "./SemesterSection.module.css";

/** id del contenedor de un cuatrimestre (dnd-kit): destino de las materias y, a la vez, ítem ordenable. */
export const GROUP_PREFIX = "sem:";
export const groupId = (semester: string) => `${GROUP_PREFIX}${semester}`;
export const isGroupId = (id: string) => id.startsWith(GROUP_PREFIX);
export const semesterOfGroupId = (id: string) => id.slice(GROUP_PREFIX.length);

export interface SemesterSectionProps {
  group: SemesterGroup;
  collapsed: boolean;
  onToggle: () => void;
  manage: boolean;
  semesters: string[];
  onRemove?: (card: SubjectCardData) => void;
  onMove?: (card: SubjectCardData, semester: string) => void;
  /** Quitar el cuatrimestre (solo se ofrece si está vacío). */
  onRemoveSemester?: (semester: string) => void;
  /** Tarjeta fantasma "+ Agregar materia". */
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
  onRemoveSemester,
  children,
}: SemesterSectionProps) {
  /* Una sola identidad para las dos funciones del cuatrimestre: destino donde
     soltar materias (droppable) y ficha que se puede reordenar (draggable). */
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging, isOver } =
    useSortable({
      id: groupId(group.semester),
      data: { type: "group", semester: group.semester },
      disabled: !manage,
      attributes: { roleDescription: "cuatrimestre ordenable" },
    });

  const n = group.cards.length;
  const style: CSSProperties = manage
    ? { transform: CSS.Transform.toString(transform), transition }
    : {};
  /* El plegable necesita nombrar lo que pliega y apuntar a la grilla que abre
     y cierra (U41): el rótulo solo no dice cuántas materias esconde. */
  const gridId = useId();
  const count = `${n} ${plural(n, "materia", "materias")}`;
  const empty = n === 0;
  const REMOVE_BLOCKED = "Mueva o quite sus materias primero";

  return (
    <section
      ref={setNodeRef}
      style={style}
      className={css.section}
      aria-label={group.label}
      data-dragging={isDragging ? "true" : undefined}
    >
      <div className={css.head}>
        {manage ? (
          <button
            type="button"
            ref={setActivatorNodeRef}
            className={css.handle}
            aria-label={`Reordenar ${group.label}`}
            {...attributes}
            {...listeners}
          >
            ⋮⋮
          </button>
        ) : null}
        <span className={css.bar} aria-hidden="true" />
        <button
          type="button"
          className={css.toggle}
          onClick={onToggle}
          aria-expanded={!collapsed}
          aria-controls={gridId}
          aria-label={`${group.label}, ${count}`}
          data-semester-toggle={group.semester}
        >
          <span className={css.chip}>{group.chip}</span>
          <span className={css.title}>{group.label}</span>
          <span className={css.spacer} />
          <span className={css.count}>{count}</span>
          <UiIcon name="chevronDown" size={16} className={css.chev} data-collapsed={collapsed} />
        </button>
        {/* Solo se puede quitar un cuatrimestre vacío: nunca se pierde una materia
            por descuido. Con materias el botón NO desaparece (U10): se muestra
            apagado y dice por qué, que es lo que el usuario vino a averiguar.
            El motivo va en el `title` del ENVOLTORIO (un <button disabled> no
            recibe eventos de puntero y el navegador no le dibujaría el globo) y
            en un `aria-describedby`: puesto en el propio botón, el `title` le
            reemplazaba el nombre accesible y el rótulo visible dejaba de estar
            en él (WCAG 2.5.3). */}
        {manage && onRemoveSemester ? (
          <span className={css.removeSlot} title={empty ? undefined : REMOVE_BLOCKED}>
            <button
              type="button"
              className={css.removeSemester}
              disabled={!empty}
              aria-describedby={empty ? undefined : `${gridId}-block`}
              onClick={() => onRemoveSemester(group.semester)}
            >
              Quitar cuatrimestre
            </button>
            {empty ? null : (
              <span className={css.srOnly} id={`${gridId}-block`}>
                {REMOVE_BLOCKED}
              </span>
            )}
          </span>
        ) : null}
      </div>

      {/* La grilla se oculta con `hidden`, no se desmonta: el `aria-controls` del
          plegable tiene que apuntar a un elemento que exista siempre. */}
      <div id={gridId} className={css.grid} hidden={collapsed} data-over={manage && isOver ? "true" : undefined}>
        {collapsed ? null : (
          <>
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
            {empty && manage ? (
              <div className={css.empty} data-over={isOver ? "true" : undefined}>
                Suelte o mueva una materia aquí
              </div>
            ) : null}
            {children}
          </>
        )}
      </div>
    </section>
  );
}

/** Lo que sigue al puntero mientras se arrastra un cuatrimestre entero. */
export function SemesterOverlay({ group }: { group: SemesterGroup }) {
  const n = group.cards.length;
  return (
    <div className={css.overlay}>
      <span className={css.chip}>{group.chip}</span>
      <span className={css.title}>{group.label}</span>
      <span className={css.count}>{`${n} ${plural(n, "materia", "materias")}`}</span>
    </div>
  );
}
