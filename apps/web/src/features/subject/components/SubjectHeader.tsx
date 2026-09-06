/**
 * Cabecera de 40 px (región 07): atrás · barra de pestañas · ⌘K · tema · avatar.
 *
 * Las pestañas son las de N0-29: hasta 20, reordenables por arrastre, cada una
 * con su ruta y su scroll. Esta pieza SOLO dibuja: el estado y las reglas (abrir,
 * cerrar, activar, limitar) viven en el store, y el shell es quien las conecta
 * con la navegación.
 *
 * Teclado: la barra es un `tablist` con tabindex móvil — las flechas mueven y
 * activan, Supr cierra —, y el shell suma ⌘⇧] / ⌘⇧[ / ⌘W desde cualquier lado.
 */
import { useEffect, useRef, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AvatarMenu, SearchButton, ThemeToggle, UiIcon } from "@/components/platform";
import type { SubjectTab } from "../store";
import css from "./SubjectHeader.module.css";

export interface SubjectHeaderProps {
  tabs: SubjectTab[];
  activeId: string;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
  onNew: () => void;
  onReorder: (from: number, to: number) => void;
  onSearch: () => void;
}

export function SubjectHeader({ tabs, activeId, onSelect, onClose, onNew, onReorder, onSearch }: SubjectHeaderProps) {
  const navigate = useNavigate();
  const stripRef = useRef<HTMLDivElement>(null);

  /* Un arrastre corto no puede robarle el clic a la pestaña: 5 px de umbral. */
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = tabs.findIndex((t) => t.id === active.id);
    const to = tabs.findIndex((t) => t.id === over.id);
    if (from !== -1 && to !== -1) onReorder(from, to);
  };

  /* La pestaña activa siempre a la vista, aunque la barra esté desplazada. */
  useEffect(() => {
    const strip = stripRef.current;
    const current = strip?.querySelector<HTMLElement>('[data-tab-active="true"]');
    current?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [activeId, tabs.length]);

  const onStripKeyDown = (event: ReactKeyboardEvent) => {
    const at = tabs.findIndex((t) => t.id === activeId);
    if (at === -1) return;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const delta = event.key === "ArrowRight" ? 1 : -1;
      const next = tabs[(at + delta + tabs.length) % tabs.length];
      if (next) {
        onSelect(next.id);
        window.requestAnimationFrame(() =>
          stripRef.current?.querySelector<HTMLElement>(`[data-tab-id="${next.id}"]`)?.focus(),
        );
      }
      return;
    }
    if (event.key === "Delete") {
      event.preventDefault();
      onClose(activeId);
    }
  };

  return (
    <header className={css.header} data-testid="subject-header">
      <button type="button" className={css.back} onClick={() => navigate(-1)} aria-label="Atrás" title="Atrás">
        <UiIcon name="chevronLeft" size={14} />
      </button>

      <div
        className={css.strip}
        ref={stripRef}
        role="tablist"
        aria-label="Pestañas de la materia"
        aria-orientation="horizontal"
        onKeyDown={onStripKeyDown}
      >
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={tabs.map((t) => t.id)} strategy={horizontalListSortingStrategy}>
            {tabs.map((tab) => (
              <SortableTab
                key={tab.id}
                tab={tab}
                active={tab.id === activeId}
                closable={tabs.length > 1}
                onSelect={onSelect}
                onClose={onClose}
              />
            ))}
          </SortableContext>
        </DndContext>

        <button
          type="button"
          className={css.addTab}
          onClick={onNew}
          aria-label="Nueva pestaña"
          title="Nueva pestaña (Inicio)"
        >
          <UiIcon name="plus" size={13} />
        </button>
      </div>

      <SearchButton label="Buscar páginas…" width={250} onClick={onSearch} />
      <ThemeToggle />
      <AvatarMenu />
    </header>
  );
}

interface TabProps {
  tab: SubjectTab;
  active: boolean;
  /** false con una sola pestaña abierta: cerrarla la repondría igual. */
  closable: boolean;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
}

function SortableTab({ tab, active, closable, onSelect, onClose }: TabProps) {
  /* `attributes` de dnd-kit se descarta a propósito: trae `role="button"` y su
     propio tabindex, y acá el papel lo fija el `tablist` (role="tab" + tabindex
     móvil), que es lo que espera un lector de pantalla. */
  const { listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: tab.id });

  return (
    <div
      ref={setNodeRef}
      className={css.tab}
      role="tab"
      aria-selected={active}
      tabIndex={active ? 0 : -1}
      data-tab-id={tab.id}
      data-tab-active={active ? "true" : undefined}
      data-dragging={isDragging ? "true" : undefined}
      title={tab.title}
      style={{
        ...(tab.color ? { ["--ucol" as string]: tab.color } : null),
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      {...listeners}
      onClick={() => onSelect(tab.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(tab.id);
        }
      }}
      /* Botón del medio: la convención de todos los navegadores para cerrar. */
      onAuxClick={(event) => {
        if (event.button !== 1) return;
        event.preventDefault();
        onClose(tab.id);
      }}
    >
      {tab.chip ? (
        <span className={css.tabChip}>{tab.chip}</span>
      ) : (
        <span className={css.tabDot} aria-hidden="true" />
      )}
      <span className={css.tabTitle}>{tab.title}</span>
      {closable ? (
        <button
          type="button"
          className={css.tabClose}
          aria-label={`Cerrar «${tab.title}»`}
          title="Cerrar la pestaña"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            onClose(tab.id);
          }}
        >
          <UiIcon name="close" size={13} />
        </button>
      ) : null}
    </div>
  );
}
