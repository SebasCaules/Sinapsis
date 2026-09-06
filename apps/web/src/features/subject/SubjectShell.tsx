/**
 * Shell de materia: la caja fija que envuelve a todas las vistas.
 *
 *   rail 52 · índice 250 · [ cabecera 40 · migas 28 · contenido con scroll propio ]
 *
 * Carga la materia UNA vez y la reparte por el Outlet; el resto de las vistas no
 * vuelven a pedirla. Es también quien conoce la ruta activa: de ahí salen las
 * pestañas, las migas, el título del documento, la división abierta en el índice
 * y el ítem activo del rail. Todo eso sale de UNA sola función pura
 * (`describePath`), que además puede describir rutas que no se están visitando
 * — la que abre un ⌘-clic en una pestaña nueva.
 *
 * Las pestañas (N0-29) viven en el store; acá se las conecta con el router:
 * navegar actualiza la activa, ⌘-clic abre una nueva sin moverse, cada una
 * recuerda el scroll de `main`.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { routes } from "@sinapsis/contract";
import { Seal } from "@/components/platform";
import { isTypingTarget } from "@/lib/keyboard";
import { Crumbs, type Crumb } from "./components/Crumbs";
import { Fab } from "./components/Fab";
import { IndexPanel } from "./components/IndexPanel";
import { Rail } from "./components/Rail";
import { SearchPalette } from "./components/SearchPalette";
import { ShortcutsDialog } from "./components/ShortcutsDialog";
import { SubjectHeader, tabElementId } from "./components/SubjectHeader";
import { ErrorCard, WideSkeleton } from "./components/States";
import type { SubjectCtx } from "./context";
import { describePath, isSubjectPath, type StudyLabels } from "./route-info";
import { splitHash, tabHref, useCompact, useSubjectTabsStore, useTabs } from "./store";
import { useStudy } from "./study/useStudy";
import { useStudyState, useSubject } from "./useSubject";
import css from "./SubjectShell.module.css";

export function SubjectShell() {
  const { subject = "" } = useParams();
  const { query, model } = useSubject(subject);
  const { bookmarks } = useStudyState(subject);
  const { compact, toggle } = useCompact();
  const [searchOpen, setSearchOpen] = useState(false);
  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  /* El mapa de atajos (U19): se abre con «?» y es la única documentación que
     tiene el teclado del shell. */
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const closeShortcuts = useCallback(() => setShortcutsOpen(false), []);

  const location = useLocation();
  const navigate = useNavigate();
  const mainRef = useRef<HTMLElement>(null);

  const tabs = useTabs(subject);
  const openTab = useSubjectTabsStore((s) => s.openTab);
  const newTab = useSubjectTabsStore((s) => s.newTab);
  const activateTab = useSubjectTabsStore((s) => s.activateTab);
  const closeTabAction = useSubjectTabsStore((s) => s.closeTab);
  const moveTab = useSubjectTabsStore((s) => s.moveTab);
  const syncActive = useSubjectTabsStore((s) => s.syncActive);
  const setScroll = useSubjectTabsStore((s) => s.setScroll);

  /* Los rótulos del material de estudio salen del modelo de `study/`: así una
     pestaña de flashcards dice «Repaso U1» y no «Flashcards» a secas. La consulta
     ya está en caché (la comparten el rail y las vistas de estudio). */
  const study = useStudy(subject);
  const studyLabels = useMemo<StudyLabels>(
    () => ({
      deck: (id) => study.model.deck(id)?.deck.title,
      quiz: (id) => study.model.quiz(id)?.quiz.title,
      kit: (id) => study.model.kit(id)?.kit.title,
    }),
    [study.model],
  );

  const route = useMemo(
    () => describePath(model, subject, location.pathname, studyLabels),
    [model, subject, location.pathname, studyLabels],
  );

  /* ---------- pestañas ↔ router ------------------------------------------- */

  /** Escribe en la pestaña activa el scroll con el que se la está dejando. */
  const saveScroll = useCallback(() => {
    const y = mainRef.current?.scrollTop;
    if (y !== undefined) setScroll(subject, tabs.active, y);
  }, [setScroll, subject, tabs.active]);

  /* Navegar dentro de la materia mueve la pestaña activa (o salta a la que ya
     tenga abierto el destino). */
  useEffect(() => {
    if (!isSubjectPath(subject, location.pathname)) return;
    syncActive(
      subject,
      {
        path: location.pathname,
        hash: location.hash,
        title: route.title,
        chip: route.chip,
        color: route.color,
      },
      mainRef.current?.scrollTop,
    );
  }, [subject, location.pathname, location.hash, route.title, route.chip, route.color, syncActive]);

  /**
   * Restauración del scroll al cambiar de pestaña (bug 5).
   *
   * La vista de la pestaña nueva se monta y desplaza `main` por su cuenta (el
   * lector, por ejemplo, sube a cero). Esos eventos llegaban ANTES de la
   * restauración y el anotador de abajo los guardaba como si fueran del usuario:
   * la pestaña perdía su posición. Por eso hay una bandera, y el anotador no
   * escribe nada mientras la restauración está en curso.
   */
  const restoringRef = useRef(false);

  /* Mientras se lee, la pestaña activa va anotando su scroll: al volver a ella
     no hace falta haber pasado por ningún «guardar antes de salir». */
  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    let raf = 0;
    const onScroll = () => {
      if (raf || restoringRef.current) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        if (restoringRef.current) return;
        setScroll(subject, useSubjectTabsStore.getState().tabsOf(subject).active, main.scrollTop);
      });
    };
    main.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      main.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [subject, setScroll, model]);

  /* Al cambiar de pestaña se repone su scroll (dos cuadros: el primero monta la
     vista, el segundo ya tiene el alto real para desplazarse). El valor se lee
     del store en el momento de restaurar, no de la lista que cerró este render:
     así el efecto depende SOLO de la pestaña activa. */
  const restoredRef = useRef(tabs.active);
  useEffect(() => {
    if (restoredRef.current === tabs.active) return;
    restoredRef.current = tabs.active;
    restoringRef.current = true;
    const y = useSubjectTabsStore.getState().tabsOf(subject).list.find((t) => t.id === tabs.active)?.scrollY ?? 0;
    let second = 0;
    let third = 0;
    const first = window.requestAnimationFrame(() => {
      second = window.requestAnimationFrame(() => {
        mainRef.current?.scrollTo({ top: y });
        /* Un cuadro más: el evento que dispara `scrollTo` llega después. */
        third = window.requestAnimationFrame(() => {
          restoringRef.current = false;
        });
      });
    });
    return () => {
      window.cancelAnimationFrame(first);
      if (second) window.cancelAnimationFrame(second);
      if (third) window.cancelAnimationFrame(third);
      restoringRef.current = false;
    };
  }, [tabs.active, subject]);

  const selectTab = useCallback(
    (id: string) => {
      if (id === tabs.active) return;
      const target = tabs.list.find((t) => t.id === id);
      if (!target) return;
      saveScroll();
      activateTab(subject, id);
      /* El ancla vive aparte del pathname (bug 4): se vuelve a pegar acá. */
      navigate(tabHref(target));
    },
    [tabs.active, tabs.list, saveScroll, activateTab, subject, navigate],
  );

  const closeTab = useCallback(
    (id: string) => {
      const path = closeTabAction(subject, id);
      if (path) navigate(path);
    },
    [closeTabAction, subject, navigate],
  );

  const addTab = useCallback(() => {
    saveScroll();
    newTab(subject);
    navigate(routes.subject(subject));
  }, [saveScroll, newTab, subject, navigate]);

  const reorderTabs = useCallback((from: number, to: number) => moveTab(subject, from, to), [moveTab, subject]);

  /**
   * ⌘/Ctrl-clic (y clic con el botón del medio) sobre CUALQUIER enlace interno
   * de la materia: abre una pestaña nueva sin moverse de la actual. Se delega en
   * la raíz del shell a propósito — así vale igual para el índice, los wikilinks
   * del lector, el catálogo, el rail y todo lo que venga, sin que ninguna de esas
   * piezas tenga que saber que las pestañas existen.
   */
  const openLinkInNewTab = useCallback(
    (event: ReactMouseEvent, aux: boolean) => {
      if (!aux && !(event.metaKey || event.ctrlKey)) return;
      if (event.shiftKey || event.altKey) return;
      const anchor = (event.target as HTMLElement | null)?.closest?.("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target === "_blank") return;
      const href = anchor.getAttribute("href") ?? "";
      const { path, hash } = splitHash(href);
      if (!href.startsWith("/") || !isSubjectPath(subject, path)) return;
      event.preventDefault();
      event.stopPropagation();
      const info = describePath(model, subject, path, studyLabels);
      openTab(subject, { path, hash, title: info.title, chip: info.chip, color: info.color });
    },
    [subject, model, openTab, studyLabels],
  );

  /* ---------- teclado ------------------------------------------------------ */
  /* ⌘K / Ctrl+K en cualquier lado; «/» y los atajos de pestaña solo fuera de un
     campo de texto. */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const mod = event.metaKey || event.ctrlKey;
      if (mod && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
        return;
      }
      if (isTypingTarget(event.target)) return;

      if (mod && event.shiftKey) {
        /* `code` sobrevive al Shift (que convierte «]» en «}») y a los teclados
           que no tienen corchetes sin AltGr. */
        const forward = event.code === "BracketRight" || event.key === "]" || event.key === "}";
        const back = event.code === "BracketLeft" || event.key === "[" || event.key === "{";
        if (forward || back) {
          event.preventDefault();
          const state = useSubjectTabsStore.getState().tabsOf(subject);
          if (state.list.length < 2) return;
          const at = state.list.findIndex((t) => t.id === state.active);
          const next = state.list[(at + (forward ? 1 : -1) + state.list.length) % state.list.length];
          if (next) selectTab(next.id);
          return;
        }
        /* Cerrar es ⌘⇧W y no ⌘W (N0-34): ⌘W lo reserva el navegador y no se
           puede interceptar en Chrome. */
        if (event.key.toLowerCase() === "w") {
          event.preventDefault();
          closeTab(useSubjectTabsStore.getState().tabsOf(subject).active);
          return;
        }
      }
      if (event.key === "/" && !mod && !event.altKey) {
        event.preventDefault();
        setSearchOpen(true);
        return;
      }
      if (event.key === "?" && !mod && !event.altKey) {
        event.preventDefault();
        setShortcutsOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [subject, selectTab, closeTab]);

  /* ---------- migas y título ----------------------------------------------- */

  const crumbs = useMemo<Crumb[]>(() => {
    const head: Crumb = { label: model?.config.name ?? subject, to: routes.subject(subject) };
    return route.parent ? [head, route.parent, { label: route.title }] : [head, { label: route.title }];
  }, [model, subject, route]);

  /* La pestaña del navegador dice lo mismo que la pestaña activa de la cabecera. */
  useEffect(() => {
    const name = model?.config.name ?? subject;
    if (!name) return;
    document.title = `${route.title} · ${name}`;
  }, [route.title, model, subject]);

  const ctx = useMemo<SubjectCtx | null>(
    () => (model ? { slug: subject, model, openSearch } : null),
    [subject, model, openSearch],
  );

  if (!model || !ctx) {
    return (
      <div className={css.shell}>
        <div className={css.railGhost}>
          <div className={css.sealRow}>
            <Seal size={34} />
          </div>
        </div>
        {compact ? null : <div className={css.panelGhost} />}
        <div className={css.content}>
          <div className={css.headerGhost} />
          <div className={css.crumbsGhost} />
          <main className={css.main} id="contenido">
            {query.isError ? (
              <ErrorCard error={query.error} notFound="Esta materia no existe" />
            ) : (
              <WideSkeleton />
            )}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div
      className={css.shell}
      onClick={(event) => openLinkInNewTab(event, false)}
      onAuxClick={(event) => openLinkInNewTab(event, event.button === 1)}
    >
      <a href="#contenido" className={css.skip}>
        Saltar al contenido
      </a>
      <Rail slug={subject} groups={model.railGroups} compact={compact} onToggleCompact={toggle} />
      {compact ? null : (
        <IndexPanel
          model={model}
          activePage={route.page}
          activeDivision={route.division}
          bookmarks={bookmarks}
        />
      )}
      <div className={css.content}>
        <SubjectHeader
          tabs={tabs.list}
          activeId={tabs.active}
          onSelect={selectTab}
          onClose={closeTab}
          onNew={addTab}
          onReorder={reorderTabs}
          onSearch={openSearch}
        />
        <Crumbs items={crumbs} />
        {/* El contenido es el panel de la pestaña activa (N0-34): el patrón de
            `tabs` se completa acá, con el `tabpanel` rotulado por su pestaña. */}
        <main
          className={css.main}
          id="contenido"
          data-subject-main=""
          ref={mainRef}
          role="tabpanel"
          aria-labelledby={tabElementId(tabs.active)}
        >
          <Outlet context={ctx} />
        </main>
        {model.fab ? <Fab view={model.fab} /> : null}
      </div>
      <SearchPalette model={model} open={searchOpen} onClose={closeSearch} />
      <ShortcutsDialog open={shortcutsOpen} onClose={closeShortcuts} />
    </div>
  );
}
