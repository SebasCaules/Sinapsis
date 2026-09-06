/**
 * Cabecera de 40 px (región 07): atrás · barra de pestañas · ⌘K · tema · avatar.
 *
 * Las pestañas son las de N0-29: hasta 20, reordenables por arrastre, cada una
 * con su ruta y su scroll. Esta pieza SOLO dibuja: el estado y las reglas (abrir,
 * cerrar, activar, limitar) viven en el store, y el shell es quien las conecta
 * con la navegación.
 *
 * Teclado (N0-34): la barra es un `tablist` con tabindex móvil — las flechas
 * mueven y activan, Inicio/Fin van a los extremos, Supr cierra —, el foco sigue
 * a la pestaña activa mientras se navega con el teclado, y el shell suma
 * ⌘⇧] / ⌘⇧[ / ⌘⇧W desde cualquier lado. El panel de contenido (`main`) es el
 * `tabpanel` que rotula la pestaña activa.
 */
import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
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

/** id del elemento de una pestaña: lo usa el `aria-labelledby` del `tabpanel`. */
export const tabElementId = (id: string): string => `subject-tab-${id}`;

/** El `id` del panel que gobiernan todas las pestañas (el `main` del shell). */
const PANEL_ID = "contenido";

/** Cuánto desplaza la tira cada golpe de ‹ o ›. */
const SCROLL_STEP = 180;

export interface SubjectHeaderProps {
  tabs: SubjectTab[];
  activeId: string;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
  onNew: () => void;
  onReorder: (from: number, to: number) => void;
  onSearch: () => void;
}

/**
 * Rótulos visibles: los títulos repetidos se numeran («Inicio», «Inicio 2»…),
 * que es lo que pide N0-34. Sin esto, dos pestañas de «Inicio» son
 * indistinguibles tanto en la barra como para un lector de pantalla.
 */
function numberedTitles(tabs: SubjectTab[]): string[] {
  const seen = new Map<string, number>();
  return tabs.map((tab) => {
    const n = (seen.get(tab.title) ?? 0) + 1;
    seen.set(tab.title, n);
    return n > 1 ? `${tab.title} ${n}` : tab.title;
  });
}

export function SubjectHeader({ tabs, activeId, onSelect, onClose, onNew, onReorder, onSearch }: SubjectHeaderProps) {
  const stripRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(false);

  /* Un arrastre corto no puede robarle el clic a la pestaña: 5 px de umbral. */
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const labels = useMemo(() => numberedTitles(tabs), [tabs]);

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = tabs.findIndex((t) => t.id === active.id);
    const to = tabs.findIndex((t) => t.id === over.id);
    if (from !== -1 && to !== -1) onReorder(from, to);
  };

  /* La pestaña activa siempre a la vista, aunque la barra esté desplazada. Y si
     el foco estaba en la tira, lo sigue: es lo que espera el patrón de `tablist`
     con tabindex móvil, y sin esto el foco se quedaba en una pestaña con
     `tabIndex={-1}` después de moverse con las flechas o con ⌘⇧]. */
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const current = strip.querySelector<HTMLElement>('[data-tab-active="true"]');
    current?.scrollIntoView({ block: "nearest", inline: "nearest" });
    const focused = document.activeElement;
    if (current && focused instanceof HTMLElement && focused !== current && strip.contains(focused)) {
      current.focus();
    }
  }, [activeId, tabs.length]);

  /* Los botones ‹ › solo existen cuando la tira desborda: con dos pestañas
     abiertas no hay nada que desplazar. */
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const check = () => setOverflow(strip.scrollWidth > strip.clientWidth + 1);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(strip);
    return () => observer.disconnect();
  }, [tabs.length]);

  /* Sin `behavior`: la animación la decide la hoja de estilo, que ya la apaga
     con `prefers-reduced-motion`. Pasarla acá pisaría esa preferencia. */
  const scrollStrip = (direction: -1 | 1) => {
    stripRef.current?.scrollBy({ left: direction * SCROLL_STEP });
  };

  const onStripKeyDown = (event: ReactKeyboardEvent) => {
    const at = tabs.findIndex((t) => t.id === activeId);
    if (at === -1) return;
    const go = (index: number) => {
      const next = tabs[index];
      if (next && next.id !== activeId) onSelect(next.id);
    };
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      go((at + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length);
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      go(0);
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      go(tabs.length - 1);
      return;
    }
    if (event.key === "Delete") {
      event.preventDefault();
      onClose(activeId);
    }
  };

  return (
    <header className={css.header} data-testid="subject-header">
      <div className={css.tabsArea}>
        {overflow ? (
          <button
            type="button"
            className={css.scrollTabs}
            onClick={() => scrollStrip(-1)}
            aria-label="Desplazar las pestañas a la izquierda"
            title="Pestañas anteriores"
          >
            ‹
          </button>
        ) : null}

        {/* `DndContext` va FUERA del `tablist`: dibuja sus propios nodos de
            accesibilidad (una región `status` y una descripción oculta) y ahí
            dentro serían hijos de un `tablist` que no son pestañas. */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <div
            className={css.strip}
            ref={stripRef}
            role="tablist"
            aria-label="Pestañas de la materia"
            aria-orientation="horizontal"
            aria-keyshortcuts="Control+Shift+BracketRight Control+Shift+BracketLeft Control+Shift+W"
            data-overflow={overflow ? "true" : undefined}
            onKeyDown={onStripKeyDown}
          >
            <SortableContext items={tabs.map((t) => t.id)} strategy={horizontalListSortingStrategy}>
              {tabs.map((tab, i) => (
                <SortableTab
                  key={tab.id}
                  tab={tab}
                  label={labels[i] ?? tab.title}
                  active={tab.id === activeId}
                  closable={tabs.length > 1}
                  onSelect={onSelect}
                  onClose={onClose}
                />
              ))}
            </SortableContext>
          </div>
        </DndContext>

        {overflow ? (
          <button
            type="button"
            className={css.scrollTabs}
            onClick={() => scrollStrip(1)}
            aria-label="Desplazar las pestañas a la derecha"
            title="Pestañas siguientes"
          >
            ›
          </button>
        ) : null}

        <button
          type="button"
          className={css.addTab}
          onClick={onNew}
          aria-label="Nueva pestaña"
          title="Nueva pestaña (Inicio)"
        >
          <UiIcon name="plus" size={14} />
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
  /** Rótulo visible, ya numerado si el título se repite. */
  label: string;
  active: boolean;
  /** false con una sola pestaña abierta: cerrarla la repondría igual. */
  closable: boolean;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
}

function SortableTab({ tab, label, active, closable, onSelect, onClose }: TabProps) {
  /* `attributes` de dnd-kit se descarta a propósito: trae `role="button"` y su
     propio tabindex, y acá el papel lo fija el `tablist` (role="tab" + tabindex
     móvil), que es lo que espera un lector de pantalla. */
  const { listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: tab.id });

  return (
    <div
      ref={setNodeRef}
      className={css.tab}
      id={tabElementId(tab.id)}
      role="tab"
      aria-selected={active}
      aria-controls={PANEL_ID}
      tabIndex={active ? 0 : -1}
      data-tab-id={tab.id}
      data-tab-active={active ? "true" : undefined}
      data-dragging={isDragging ? "true" : undefined}
      title={label}
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
      <span className={css.tabTitle}>{label}</span>
      {closable ? (
        <button
          type="button"
          className={css.tabClose}
          /* Solo la activa entra en el orden de tabulación: el `tablist` tiene
             un único punto de entrada y desde ahí se llega con Tab a su ✕. */
          tabIndex={active ? 0 : -1}
          aria-label={`Cerrar «${label}»`}
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
