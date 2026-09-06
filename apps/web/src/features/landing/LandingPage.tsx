import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type Announcements,
  type CollisionDetection,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type KeyboardCoordinateGetter,
  type ScreenReaderInstructions,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  LS_KEYS,
  fold,
  plural,
  type CreateSubjectInput,
  type LandingLayoutInput,
  type SubjectCard as SubjectCardData,
} from "@sinapsis/contract";
import { api, qk } from "@/lib/api";
import { readJson, writeJson } from "@/lib/store";
import {
  compareSemestersDesc,
  groupBySemesters,
  nextSemesterSuggestion,
  semesterChip,
  semesterLabel,
  unionSemesters,
  type SemesterGroup,
} from "@/lib/semesters";
import {
  Button,
  Dialog,
  Field,
  PlatformHeader,
  UiIcon,
  useToast,
} from "@/components/platform";
import { SemesterOverlay, SemesterSection, groupId, isGroupId, semesterOfGroupId } from "./SemesterSection";
import { GhostCard, SubjectCard } from "./SubjectCard";
import { AddSubjectDialog } from "./AddSubjectDialog";
import css from "./LandingPage.module.css";

interface DraftGroup {
  semester: string;
  slugs: string[];
}

/** Diálogo de "+ Agregar cuatrimestre": rótulo a medio escribir y su reparo. */
interface SemesterDialog {
  draft: string;
  error?: string;
}

/**
 * Inserta un cuatrimestre nuevo donde lo pondría el orden por rótulo y deja el
 * resto como está: el usuario puede haber ordenado a mano y eso no se pisa.
 */
function insertSemester(list: DraftGroup[], semester: string): DraftGroup[] {
  if (list.some((g) => g.semester === semester)) return list;
  const at = list.findIndex((g) => compareSemestersDesc(semester, g.semester) < 0);
  const group: DraftGroup = { semester, slugs: [] };
  return at === -1 ? [...list, group] : [...list.slice(0, at), group, ...list.slice(at)];
}

function readCollapsed(): string[] {
  const raw = readJson<unknown>(LS_KEYS.landingCollapsed);
  return Array.isArray(raw) ? raw.filter((x): x is string => typeof x === "string") : [];
}

/**
 * Mientras se arrastra un cuatrimestre, las materias no son destino: son las que
 * viajan adentro. Sin este filtro la sección se «suelta» sobre una tarjeta de sí
 * misma y el orden nunca cambia.
 */
const collisionDetection: CollisionDetection = (args) =>
  isGroupId(String(args.active.id))
    ? closestCorners({ ...args, droppableContainers: args.droppableContainers.filter((c) => isGroupId(String(c.id))) })
    : closestCorners(args);

/**
 * Teclado: para las materias vale el recorrido de dnd-kit; para un cuatrimestre
 * se salta al cuatrimestre anterior o siguiente (arriba/abajo), que es el único
 * movimiento que tiene sentido en una lista de secciones apiladas.
 */
const keyboardCoordinates: KeyboardCoordinateGetter = (event, args) => {
  if (!isGroupId(String(args.active))) return sortableKeyboardCoordinates(event, args);
  const down = event.code === "ArrowDown";
  const up = event.code === "ArrowUp";
  const { collisionRect, droppableRects, droppableContainers } = args.context;
  if ((!down && !up) || !collisionRect) return undefined;
  event.preventDefault();

  let bestTop: number | undefined;
  for (const container of droppableContainers.getEnabled()) {
    if (!isGroupId(String(container.id)) || container.id === args.active) continue;
    const rect = droppableRects.get(container.id);
    if (!rect || (down ? rect.top <= collisionRect.top : rect.top >= collisionRect.top)) continue;
    if (bestTop === undefined || (down ? rect.top < bestTop : rect.top > bestTop)) bestTop = rect.top;
  }
  return bestTop === undefined ? undefined : { x: args.currentCoordinates.x, y: bestTop };
};

/** Cómo se anuncia el arrastre con lector de pantalla (dnd-kit habla inglés por defecto). */
const screenReaderInstructions: ScreenReaderInstructions = {
  draggable:
    "Para tomar una materia o un cuatrimestre, pulse la barra espaciadora sobre su asa. Mientras lo arrastra, use " +
    "las flechas para mover la materia dentro del cuatrimestre o hacia otro, o para cambiar el orden de los " +
    "cuatrimestres. Pulse otra vez la barra espaciadora para soltarlo, o Escape para cancelar.",
};

export function LandingPage() {
  const qc = useQueryClient();
  const { toast } = useToast();

  const landing = useQuery({ queryKey: qk.landing, queryFn: () => api.landing.list() });
  const cards = useMemo(() => landing.data ?? [], [landing.data]);

  /* Los cuatrimestres del usuario son estado propio (N0-32): vienen con los
     vacíos y con el orden que él eligió, que no tiene por qué ser el del rótulo. */
  const savedSemesters = useQuery({ queryKey: qk.semesters, queryFn: () => api.landing.semesters() });

  /* Un solo estado para el modo gestión: null = no se está gestionando. */
  const [draft, setDraft] = useState<DraftGroup[] | null>(null);
  const manage = draft !== null;
  /** Lo que se está arrastrando: el slug de una materia o el id `sem:` de un cuatrimestre. */
  const [activeId, setActiveId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<string[]>(readCollapsed);
  const [addOpen, setAddOpen] = useState(false);
  /** Cuatrimestre con el que abre el diálogo de materia nueva (la fantasma del grupo). */
  const [addTarget, setAddTarget] = useState<string | undefined>(undefined);
  const [semesterDialog, setSemesterDialog] = useState<SemesterDialog | null>(null);
  const [removing, setRemoving] = useState<SubjectCardData | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = "Materias · Sinapsis";
  }, []);

  const serverSemesters = useMemo(
    () => unionSemesters(savedSemesters.data ?? [], cards),
    [savedSemesters.data, cards],
  );
  const serverGroups = useMemo(() => groupBySemesters(serverSemesters, cards), [serverSemesters, cards]);
  const byId = useMemo(() => new Map(cards.map((c) => [c.slug, c])), [cards]);

  /* Modo normal: lo que dice el servidor. Modo gestión: el borrador local. */
  const groups: SemesterGroup[] = useMemo(() => {
    if (!draft) return serverGroups;
    return draft.map((g) => ({
      semester: g.semester,
      label: semesterLabel(g.semester),
      chip: semesterChip(g.semester),
      cards: g.slugs
        .map((slug) => byId.get(slug))
        .filter((c): c is SubjectCardData => Boolean(c))
        .map((c) => ({ ...c, semester: g.semester })),
    }));
  }, [draft, serverGroups, byId]);

  const semesters = useMemo(() => groups.map((g) => g.semester), [groups]);

  const q = fold(query.trim());
  const visibleGroups = useMemo(() => {
    if (!q) return groups;
    return groups
      .map((g) => ({ ...g, cards: g.cards.filter((c) => fold(c.name).includes(q) || fold(c.code).includes(q)) }))
      .filter((g) => g.cards.length > 0);
  }, [groups, q]);

  const matchCount = visibleGroups.reduce((n, g) => n + g.cards.length, 0);
  const subtitle = q
    ? `${matchCount} ${plural(matchCount, "coincidencia", "coincidencias")} de ${cards.length}`
    : `${cards.length} ${plural(cards.length, "materia", "materias")} · ` +
      `${groups.length} ${plural(groups.length, "cuatrimestre", "cuatrimestres")}`;

  const openAdd = useCallback((semester?: string) => {
    setAddTarget(semester);
    setAddOpen(true);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery("");
    searchRef.current?.focus();
  }, []);

  /* --- plegado (persistido) --- */
  const toggleCollapsed = useCallback((semester: string) => {
    setCollapsed((prev) => {
      const next = prev.includes(semester) ? prev.filter((s) => s !== semester) : [...prev, semester];
      writeJson(LS_KEYS.landingCollapsed, next);
      return next;
    });
  }, []);

  /* --- buscador ⌘K --- */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setDraft(null);
        setSearchOpen(true);
        searchRef.current?.focus();
        searchRef.current?.select();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  /* --- modo gestión --- */
  const startManage = useCallback(() => {
    setQuery("");
    setSearchOpen(false);
    setDraft(serverGroups.map((g) => ({ semester: g.semester, slugs: g.cards.map((c) => c.slug) })));
  }, [serverGroups]);

  const cancelManage = useCallback(() => {
    setDraft(null);
    setActiveId(null);
  }, []);

  const saveLayout = useMutation({
    mutationFn: (input: LandingLayoutInput) => api.landing.saveLayout(input),
    onSuccess: async (data, input) => {
      qc.setQueryData(qk.landing, data);
      /* Sin esto, entre la respuesta y el refetch de `semesters` la lista vieja
         haría desaparecer por un instante el cuatrimestre recién agregado. */
      if (input.semesters) qc.setQueryData(qk.semesters, input.semesters);
      setDraft(null);
      /* La respuesta trae las materias, no los cuatrimestres: la lista (con los
         vacíos y su orden) se vuelve a pedir. */
      await Promise.all([
        qc.invalidateQueries({ queryKey: qk.semesters }),
        qc.invalidateQueries({ queryKey: qk.landing }),
      ]);
      toast("Landing guardada.", "good");
    },
    onError: () => {
      toast("No se pudo guardar el orden. Se recargó la landing.", "bad");
      void qc.invalidateQueries({ queryKey: qk.landing });
      void qc.invalidateQueries({ queryKey: qk.semesters });
      cancelManage();
    },
  });

  const createSubject = useMutation({
    mutationFn: (input: CreateSubjectInput) => api.landing.createSubject(input),
    onSuccess: async (card) => {
      setAddOpen(false);
      /* Si se está gestionando, la materia nueva entra en el borrador: si no,
         al guardar el orden desaparecería de la landing recién creada. */
      setDraft((prev) =>
        prev === null
          ? prev
          : insertSemester(prev, card.semester).map((g) =>
              g.semester === card.semester && !g.slugs.includes(card.slug)
                ? { ...g, slugs: [...g.slugs, card.slug] }
                : g,
            ),
      );
      await Promise.all([
        qc.invalidateQueries({ queryKey: qk.landing }),
        qc.invalidateQueries({ queryKey: qk.semesters }),
      ]);
      toast(`«${card.name}» se agregó a su landing.`, "good");
    },
  });

  const removeSubject = useMutation({
    mutationFn: (slug: string) => api.landing.removeFromLanding(slug),
    onSuccess: async (_data, slug) => {
      setDraft((prev) => prev && prev.map((g) => ({ ...g, slugs: g.slugs.filter((s) => s !== slug) })));
      setRemoving(null);
      await qc.invalidateQueries({ queryKey: qk.landing });
      toast("La materia se quitó de su landing. El progreso se conserva.", "good");
    },
    onError: (e: Error) => {
      setRemoving(null);
      toast(e.message || "No se pudo quitar la materia.", "bad");
    },
  });

  function handleSave() {
    const groupsToSave = draft ?? [];
    const items = groupsToSave.flatMap((g) => g.slugs.map((slug, position) => ({ slug, semester: g.semester, position })));
    /* `semesters` va SIEMPRE: es lo que persiste los vacíos y su orden (N0-32). */
    saveLayout.mutate({ items, semesters: groupsToSave.map((g) => g.semester) });
  }

  function moveToSemester(card: SubjectCardData, semester: string) {
    setDraft((prev) => {
      if (!prev || !prev.some((g) => g.semester === semester)) return prev;
      return prev.map((g) => {
        if (g.semester === semester) {
          return g.slugs.includes(card.slug) ? g : { ...g, slugs: [...g.slugs, card.slug] };
        }
        return { ...g, slugs: g.slugs.filter((s) => s !== card.slug) };
      });
    });
  }

  function addSemester() {
    const label = (semesterDialog?.draft ?? "").trim();
    if (!label) {
      setSemesterDialog((prev) => prev && { ...prev, error: "Escriba un rótulo." });
      return;
    }
    if ((draft ?? []).some((g) => g.semester === label)) {
      setSemesterDialog((prev) => prev && { ...prev, error: "Ese cuatrimestre ya existe." });
      return;
    }
    setDraft((prev) => insertSemester(prev ?? [], label));
    setSemesterDialog(null);
  }

  /** Solo se ofrece con el cuatrimestre vacío; se hace firme al guardar. */
  function removeSemester(semester: string) {
    setDraft((prev) => prev && prev.filter((g) => g.semester !== semester || g.slugs.length > 0));
  }

  /* --- arrastrar y soltar --- */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: keyboardCoordinates }),
  );

  const announcements: Announcements = useMemo(() => {
    /* Se arrastran dos cosas: materias y cuatrimestres. El anuncio dice cuál. */
    const what = (id: string | number) => {
      const raw = String(id);
      return isGroupId(raw)
        ? `el cuatrimestre ${semesterLabel(semesterOfGroupId(raw))}`
        : `la materia ${byId.get(raw)?.name ?? raw}`;
    };
    return {
      onDragStart: ({ active }) => `Tomó ${what(active.id)}.`,
      /* Al tomarla, dnd-kit avisa que está «sobre sí misma»: eso no se dice. */
      onDragOver: ({ active, over }) =>
        !over
          ? `${what(active.id)} no está sobre ningún destino.`
          : over.id === active.id
            ? undefined
            : `${what(active.id)} está sobre ${what(over.id)}.`,
      onDragEnd: ({ active, over }) =>
        over
          ? `Soltó ${what(active.id)} sobre ${what(over.id)}.`
          : `Soltó ${what(active.id)} fuera de un destino: vuelve a su lugar.`,
      onDragCancel: ({ active }) => `Se canceló el movimiento: ${what(active.id)} vuelve a su lugar.`,
    };
  }, [byId]);

  const containerOf = (list: DraftGroup[], id: string): number =>
    isGroupId(id)
      ? list.findIndex((g) => g.semester === semesterOfGroupId(id))
      : list.findIndex((g) => g.slugs.includes(id));

  function onDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }

  function onDragOver(e: DragOverEvent) {
    const over = e.over;
    if (!over) return;
    const activeId = String(e.active.id);
    const overId = String(over.id);
    /* Los cuatrimestres se reordenan al soltar, no al pasar por encima: mover
       secciones enteras mientras se arrastra marea y confunde al lector. */
    if (isGroupId(activeId)) return;
    setDraft((prev) => {
      if (!prev) return prev;
      const from = containerOf(prev, activeId);
      const to = containerOf(prev, overId);
      if (from === -1 || to === -1 || from === to) return prev;
      const next = prev.map((g) => ({ ...g, slugs: [...g.slugs] }));
      const source = next[from];
      const target = next[to];
      if (!source || !target) return prev;
      source.slugs = source.slugs.filter((s) => s !== activeId);
      const overIndex = isGroupId(overId) ? -1 : target.slugs.indexOf(overId);
      const at = overIndex < 0 ? target.slugs.length : overIndex;
      target.slugs.splice(at, 0, activeId);
      return next;
    });
  }

  function onDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const over = e.over;
    if (!over) return;
    const activeId = String(e.active.id);
    const overId = String(over.id);
    if (activeId === overId) return;

    /* Cuatrimestre: cambia el orden de las secciones (y con él, el que se guarda). */
    if (isGroupId(activeId)) {
      setDraft((prev) => {
        if (!prev) return prev;
        const from = containerOf(prev, activeId);
        const to = containerOf(prev, overId);
        return from === -1 || to === -1 || from === to ? prev : arrayMove(prev, from, to);
      });
      return;
    }

    setDraft((prev) => {
      if (!prev) return prev;
      const from = containerOf(prev, activeId);
      const to = containerOf(prev, overId);
      if (from === -1 || to === -1 || from !== to) return prev;
      const group = prev[from];
      if (!group) return prev;
      const oldIndex = group.slugs.indexOf(activeId);
      const newIndex = isGroupId(overId) ? group.slugs.length - 1 : group.slugs.indexOf(overId);
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return prev;
      const next = prev.map((g) => ({ ...g, slugs: [...g.slugs] }));
      const moved = next[from];
      if (!moved) return prev;
      moved.slugs = arrayMove(moved.slugs, oldIndex, newIndex);
      return next;
    });
  }

  const activeCard = activeId && !isGroupId(activeId) ? byId.get(activeId) : undefined;
  const activeGroup =
    activeId && isGroupId(activeId) ? groups.find((g) => g.semester === semesterOfGroupId(activeId)) : undefined;
  const isEmpty = !landing.isPending && !landing.isError && cards.length === 0;
  const newestSemester = groups[0]?.semester;

  const sections = (
    <SortableContext items={visibleGroups.map((g) => groupId(g.semester))} strategy={verticalListSortingStrategy}>
      {visibleGroups.map((group, index) => {
        /* La fantasma acompaña al primer cuatrimestre y a los vacíos; en gestión
           el hueco vacío ya dice «suelte una materia aquí» y no hace falta. */
        const ghost = !q && (group.cards.length === 0 ? !manage : index === 0);
        return (
          <SemesterSection
            key={group.semester}
            group={group}
            collapsed={!manage && collapsed.includes(group.semester)}
            onToggle={() => toggleCollapsed(group.semester)}
            manage={manage}
            semesters={semesters}
            onRemove={setRemoving}
            onMove={moveToSemester}
            onRemoveSemester={removeSemester}
          >
            {ghost ? <GhostCard onClick={() => openAdd(group.semester)} /> : null}
          </SemesterSection>
        );
      })}
    </SortableContext>
  );

  return (
    <div className={css.page}>
      <PlatformHeader
        search={{
          placeholder: "Filtrar materias…",
          onClick: () => setSearchOpen(true),
          width: 300,
          inline: searchOpen
            ? {
                value: query,
                onChange: setQuery,
                onClose: () => {
                  setQuery("");
                  setSearchOpen(false);
                },
                inputRef: searchRef,
              }
            : undefined,
        }}
      />

      {manage ? (
        <div className={css.manageBar}>
          <span className={css.dot} aria-hidden="true" />
          <span className={css.manageText}>
            EDITANDO · ARRASTRE LAS MATERIAS Y LOS CUATRIMESTRES DESDE SU ASA ⋮⋮
          </span>
          <span className={css.manageSpacer} />
          <Button
            size="sm"
            variant="primary"
            onClick={handleSave}
            disabled={saveLayout.isPending}
            aria-busy={saveLayout.isPending || undefined}
          >
            {saveLayout.isPending ? "Guardando…" : "Guardar"}
          </Button>
          <Button size="sm" onClick={cancelManage} disabled={saveLayout.isPending}>
            Cancelar
          </Button>
        </div>
      ) : null}

      <main className={css.main}>
        <div className={css.wrap}>
          <div className={css.head}>
            <div className={css.title}>
              <span className={css.eyebrow}>MIS MATERIAS</span>
              <h1 className={css.h1}>Materias</h1>
              <span className={css.subtitle}>{subtitle}</span>
            </div>
            {isEmpty ? null : (
              <div className={css.actions}>
                <Button variant="primary" onClick={() => openAdd()}>
                  <UiIcon name="plus" size={15} />
                  Agregar materia
                </Button>
                {/* Gestionar con la landing a medio cargar armaría un borrador
                    vacío y guardarlo borraría materias y cuatrimestres. */}
                <Button
                  active={manage}
                  disabled={landing.isPending || savedSemesters.isPending}
                  onClick={() => (manage ? cancelManage() : startManage())}
                >
                  <UiIcon name="menu" size={15} />
                  Gestionar
                </Button>
              </div>
            )}
          </div>

          {landing.isPending ? <div className={css.notice}>Buscando sus materias</div> : null}

          {landing.isError ? (
            <div className={css.retry}>
              <span className={css.notice}>No se pudo cargar la landing</span>
              <Button onClick={() => void landing.refetch()}>Reintentar</Button>
            </div>
          ) : null}

          {isEmpty ? (
            <div className={css.empty}>
              <span className={css.emptyIcon}>
                <UiIcon name="gridPlus" size={22} />
              </span>
              <span className={css.emptyTitle}>Todavía no hay materias</span>
              <span className={css.emptyText}>Cada materia trae su temario, sus herramientas y su color.</span>
              <Button variant="primary" onClick={() => openAdd()}>
                Agregar la primera materia
              </Button>
            </div>
          ) : null}

          {q && matchCount === 0 && cards.length > 0 ? (
            <div className={css.noMatch}>
              <span className={css.notice}>Ninguna materia coincide con «{query.trim()}»</span>
              <Button size="sm" onClick={clearSearch}>
                Limpiar la búsqueda
              </Button>
            </div>
          ) : null}

          {manage ? (
            <DndContext
              sensors={sensors}
              collisionDetection={collisionDetection}
              accessibility={{ screenReaderInstructions, announcements }}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDragEnd={onDragEnd}
              onDragCancel={() => setActiveId(null)}
            >
              {sections}
              <DragOverlay>
                {activeCard ? <SubjectCard card={activeCard} overlay /> : null}
                {activeGroup ? <SemesterOverlay group={activeGroup} /> : null}
              </DragOverlay>
            </DndContext>
          ) : (
            sections
          )}

          {manage ? (
            <button
              type="button"
              className={css.addSemester}
              onClick={() => setSemesterDialog({ draft: nextSemesterSuggestion(semesters) })}
            >
              <UiIcon name="plus" size={16} />
              Agregar cuatrimestre
            </button>
          ) : null}

          <div className={css.foot}>Sinapsis · v0.0</div>
        </div>
      </main>

      <AddSubjectDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        semesters={semesters}
        defaultSemester={addTarget ?? newestSemester}
        submitting={createSubject.isPending}
        onSubmit={async (input) => {
          await createSubject.mutateAsync(input);
        }}
      />

      <Dialog
        open={semesterDialog !== null}
        onClose={() => setSemesterDialog(null)}
        eyebrow="LANDING"
        title="Agregar cuatrimestre"
        footer={
          <>
            <Button onClick={() => setSemesterDialog(null)}>Cancelar</Button>
            <Button variant="primary" onClick={addSemester}>
              Agregar
            </Button>
          </>
        }
      >
        <Field
          label="Rótulo"
          mono
          value={semesterDialog?.draft ?? ""}
          error={semesterDialog?.error}
          hint="Formato sugerido: AAAA-1C o AAAA-2C."
          placeholder="2026-1C"
          onChange={(e) => setSemesterDialog({ draft: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addSemester();
            }
          }}
        />
      </Dialog>

      <Dialog
        open={removing !== null}
        onClose={() => setRemoving(null)}
        eyebrow="QUITAR DE LA LANDING"
        title={removing?.name ?? ""}
        footer={
          <>
            <Button onClick={() => setRemoving(null)} disabled={removeSubject.isPending}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={() => removing && removeSubject.mutate(removing.slug)}
              disabled={removeSubject.isPending}
              aria-busy={removeSubject.isPending || undefined}
            >
              {removeSubject.isPending ? "Quitando…" : "Quitar materia"}
            </Button>
          </>
        }
      >
        <p className={css.confirmText}>
          Se quita de su landing; su progreso se conserva. Puede volver a agregarla cuando quiera.
        </p>
      </Dialog>
    </div>
  );
}
