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
import { Outlet, useLocation, useNavigate, useNavigationType, useParams } from "react-router-dom";
import { routes } from "@sinapsis/contract";
import { Seal, useToast } from "@/components/platform";
import { isTypingTarget } from "@/lib/keyboard";
import { Crumbs, type Crumb } from "./components/Crumbs";
import { Fab } from "./components/Fab";
import { IndexPanel } from "./components/IndexPanel";
import { PageTip } from "./components/PageTip";
import { Rail } from "./components/Rail";
import { SearchPalette } from "./components/SearchPalette";
import { ShortcutsDialog } from "./components/ShortcutsDialog";
import { SubjectHeader, tabElementId } from "./components/SubjectHeader";
import { ErrorCard, WideSkeleton } from "./components/States";
import type { SubjectCtx } from "./context";
import { describePath, isSubjectPath, type StudyLabels } from "./route-info";
import { MAX_TABS, splitHref, tabHref, useCompact, useSubjectTabsStore, useTabs } from "./store";
import { useRuntime } from "./tools/useRuntime";
import { PALETTE_EVENT } from "./tools/runtime";
import { useStudy } from "./study/useStudy";
import { useStudyState, useSubject, useSubjectModel } from "./useSubject";
import type { ExtraStep } from "./model";
import css from "./SubjectShell.module.css";

/**
 * Ancho angosto (`NARROW_Q` del baseline, core.js:1584-1585): por debajo de este
 * ancho el índice deja de ser una columna y pasa a ser un cajón que se abre
 * desde la cabecera, con su velo. La consulta es la MISMA que la de
 * `IndexPanel.module.css`, así el JS y el CSS no se pueden desfasar.
 */
const NARROW_Q = "(max-width: 900px)";

function useNarrow(): boolean {
  const [narrow, setNarrow] = useState(
    () => typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia(NARROW_Q).matches,
  );
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia(NARROW_Q);
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return narrow;
}

/** Quita el `basename` del router (`/Sinapsis`) de un href interno; sin base devuelve el href tal cual. */
function stripBasename(href: string): string {
  /* La misma fuente que el `basename` del router (N0-59), leída acá para no
     importar el router desde una vista que el router ya importa. */
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  if (!base) return href;
  if (href === base) return "/";
  return href.startsWith(base + "/") ? href.slice(base.length) : href;
}

export function SubjectShell() {
  const { subject = "" } = useParams();
  /* Dos vueltas del mismo modelo, y por una razón: el runtime necesita la
     materia derivada para instalarse (config, páginas, leídas), y el modelo que
     ven las vistas necesita los pasos de progreso que aportan los bundles, que
     solo existen una vez instalado (N0-61). El primero no lleva pasos y solo lo
     usa el runtime; el segundo es el que viaja por el Outlet. Rehacerlo cuesta
     un recorrido de las páginas y ocurre cuando cambia la respuesta, el tema o
     el pulso del progreso. */
  const { query, model: baseModel } = useSubject(subject);
  const { bookmarks } = useStudyState(subject);
  const { compact, toggle } = useCompact();
  const [searchOpen, setSearchOpen] = useState(false);
  const openSearch = useCallback(() => setSearchOpen(true), []);
  /* `App.openPalette()` del runtime fuera de una vista de herramienta (una figura
     del lector, por ejemplo) llega como evento en `window` (`PALETTE_EVENT`);
     `[data-palette-open]` es la marca que leen `App.paletteOpen()` y el
     `lookup.js` del baseline en su guardia de Escape (N0-48). */
  useEffect(() => {
    const onPalette = () => setSearchOpen(true);
    window.addEventListener(PALETTE_EVENT, onPalette);
    return () => window.removeEventListener(PALETTE_EVENT, onPalette);
  }, []);
  useEffect(() => {
    const root = document.documentElement;
    if (searchOpen) root.setAttribute("data-palette-open", "");
    else root.removeAttribute("data-palette-open");
    return () => root.removeAttribute("data-palette-open");
  }, [searchOpen]);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  /* El mapa de atajos (U19): se abre con «?» y es la única documentación que
     tiene el teclado del shell. */
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const closeShortcuts = useCallback(() => setShortcutsOpen(false), []);

  const location = useLocation();
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const { toast } = useToast();
  /* Modo angosto (N0-29 / nav.css:543-549): el índice es un cajón. */
  const narrow = useNarrow();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setDrawerOpen((v) => !v), []);
  const mainRef = useRef<HTMLElement>(null);
  /* Raíz del shell: es el nodo sobre el que la tarjeta de vista previa (N0-50)
     delega puntero, foco y tacto, igual que el ⌘-clic de las pestañas. */
  const shellRef = useRef<HTMLDivElement>(null);

  /* El cajón se cierra al llegar a destino y al volver al ancho ancho: si no,
     quedaba tapando el contenido de la página recién abierta. */
  useEffect(() => setDrawerOpen(false), [location.pathname]);
  useEffect(() => {
    if (!narrow) setDrawerOpen(false);
  }, [narrow]);

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
  /* El runtime de la materia (N0-41): se instala al entrar, se desinstala al
     salir y es quien conoce los bundles de herramientas y de figuras. */
  const searchOpenRef = useRef(searchOpen);
  searchOpenRef.current = searchOpen;
  const runtimeHooks = useMemo(
    () => ({ paletteOpen: () => searchOpenRef.current, openPalette: openSearch }),
    [openSearch],
  );
  const runtime = useRuntime(subject, baseModel, runtimeHooks);
  const { viewLabel, progressProviders, progressTick } = runtime;

  /* Los pasos de una división son los de TODOS los proveedores cargados, con el
     id del proveedor por delante (dos bundles pueden numerar igual) y su rótulo
     pegado, que es lo que el desglose lee («… · 8 / 34 ejercicios resueltos»). */
  const extraSteps = useCallback(
    (division: string): ExtraStep[] =>
      progressProviders().flatMap((provider) => {
        let steps;
        try {
          steps = provider.stepsOf(division) || [];
        } catch {
          /* Un proveedor que se rompe deja a la división con sus páginas. */
          return [];
        }
        return steps.map((step) => ({
          ...step,
          id: `${provider.id}:${step.id}`,
          source: provider.label,
        }));
      }),
    [progressProviders],
  );
  const model = useSubjectModel(query.data, { extraSteps, tick: progressTick });
  const studyLabels = useMemo<StudyLabels>(
    () => ({
      deck: (id) => study.model.deck(id)?.deck.title,
      quiz: (id) => study.model.quiz(id)?.quiz.title,
      kit: (id) => study.model.kit(id)?.kit.title,
      /* El rótulo de una herramienta es el de SU VISTA en el manifiesto: la
         pestaña, la miga y el título del documento dicen lo mismo que el host. */
      tool: (id) => viewLabel(id),
    }),
    [study.model, viewLabel],
  );

  const route = useMemo(
    () => describePath(model, subject, location.pathname, studyLabels),
    [model, subject, location.pathname, studyLabels],
  );

  const runtimeCrumbs = runtime.crumbs;
  /**
   * Rótulo REAL de la vista abierta (herr-11): cuando una herramienta pide sus
   * propias migas con `App.setCrumbs`, el último tramo nombra el argumento
   * («Cadenas de Markov», «Binomial») y es lo que el baseline pone en la pestaña
   * y en el título del documento (`tabTitle()` deriva del `document.title` de la
   * vista, core.js:1611). Sin esto la pestaña dice siempre el rótulo genérico.
   */
  const viewTitle = useMemo(() => {
    if (!route.tool || !runtimeCrumbs?.length) return route.title;
    const last = runtimeCrumbs[runtimeCrumbs.length - 1];
    return last?.label?.trim() || route.title;
  }, [route.tool, route.title, runtimeCrumbs]);

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
        search: location.search,
        hash: location.hash,
        title: viewTitle,
        chip: route.chip,
        color: route.color,
        section: route.section,
      },
      mainRef.current?.scrollTop,
    );
  }, [subject, location.pathname, location.search, location.hash, viewTitle, route.chip, route.color, route.section, syncActive]);

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

  /**
   * Memoria de scroll POR RUTA (`scrollMem` del baseline, core.js:1292-1330).
   *
   * La memoria por pestaña no alcanza: ir de `/t/calc` a `/t/lab` en la misma
   * pestaña pisa el valor con el 0 del destino, y volver con Atrás dejaba la
   * lectura en el tope. Acá se anota además la posición de cada dirección, se
   * restaura SOLO al volver (`POP`) y se borra la entrada del destino en una
   * navegación hacia adelante, que es exactamente lo que hace `go()`.
   */
  const routeKey = `${location.pathname}${location.search}`;
  const routeKeyRef = useRef(routeKey);
  routeKeyRef.current = routeKey;
  const routeScrollRef = useRef(new Map<string, number>());

  /** Deja `main` en `y` cuando la vista ya tiene alto real, sin anotarlo como scroll del usuario. */
  const restoreScroll = useCallback((y: number) => {
    restoringRef.current = true;
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
  }, []);

  useEffect(() => {
    if (navigationType === "POP") {
      const y = routeScrollRef.current.get(routeKey);
      if (y === undefined || y <= 0) return;
      return restoreScroll(y);
    }
    /* Hacia adelante: la dirección de destino se lee desde el principio. */
    routeScrollRef.current.delete(routeKey);
    return;
  }, [routeKey, navigationType, restoreScroll]);

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
        routeScrollRef.current.set(routeKeyRef.current, main.scrollTop);
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
    const y = useSubjectTabsStore.getState().tabsOf(subject).list.find((t) => t.id === tabs.active)?.scrollY ?? 0;
    return restoreScroll(y);
  }, [tabs.active, subject, restoreScroll]);

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

  /** Aviso único del tope de pestañas (core.js:1626-1628). */
  const warnFullTabs = useCallback(() => toast(`Máximo de pestañas abiertas (${MAX_TABS})`), [toast]);

  const addTab = useCallback(() => {
    saveScroll();
    if (!newTab(subject)) {
      warnFullTabs();
      return;
    }
    navigate(routes.subject(subject));
  }, [saveScroll, newTab, subject, navigate, warnFullTabs]);

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
      /* En GitHub Pages el sitio cuelga de `/Sinapsis/` y los `<Link>` llevan ese
         prefijo en su `href`: se quita antes de mirar la ruta, si no ningún
         enlace parecía de la materia y ⌘-clic caía al navegador. */
      const raw = stripBasename(anchor.getAttribute("href") ?? "");
      /* Dos puertas distintas (core.js:2508-2512 y 2531): ⌘/Ctrl-clic SALTA a la
         pestaña nueva; el botón del medio la deja en segundo plano. */
      const activate = !aux;
      const openIn = (href: string) => {
        const { path, search, hash } = splitHref(href);
        if (!isSubjectPath(subject, path)) return;
        const info = describePath(model, subject, path, studyLabels);
        const id = openTab(
          subject,
          { path, search, hash, title: info.title, chip: info.chip, color: info.color, section: info.section },
          activate,
        );
        if (!id) {
          warnFullTabs();
          return;
        }
        if (activate) navigate(`${path}${search}${hash}`);
      };
      if (raw.startsWith("/")) {
        const { path } = splitHref(raw);
        if (!isSubjectPath(subject, path)) return;
        event.preventDefault();
        event.stopPropagation();
        openIn(raw);
        return;
      }
      /* Un enlace de un bundle viene en la gramática del baseline (`#/taller`,
         `#/p/slug`, `data-nav`, `data-go`): se traduce a la ruta del SPA con las
         mismas reglas que `App.go`, así ⌘-clic abre una pestaña interna y no una
         del navegador (pedido del usuario, 2026-09-07). El runtime se importa de
         forma diferida para no engordar el trozo principal: cuando hay un bundle
         en pantalla ya está cargado. */
      const isBundleLink =
        raw.startsWith("#/") || anchor.hasAttribute("data-nav") || anchor.hasAttribute("data-go") || anchor.matches("a.wikilink[data-slug]");
      if (!isBundleLink) return;
      event.preventDefault();
      event.stopPropagation();
      const root = shellRef.current;
      void import("@sinapsis/runtime").then(({ navTargetOf, translateRoute }) => {
        const target = navTargetOf(anchor, root);
        const translated = target ? translateRoute(subject, target) : null;
        if (translated) openIn(translated);
      });
    },
    [subject, model, openTab, studyLabels, navigate, warnFullTabs],
  );

  /* ---------- teclado ------------------------------------------------------ */
  /* ⌘K / Ctrl+K en cualquier lado; «/» y los atajos de pestaña solo fuera de un
     campo de texto. */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const mod = event.metaKey || event.ctrlKey;
      if (mod && event.key.toLowerCase() === "k") {
        event.preventDefault();
        /* ⌘K conmuta: dos pulsaciones seguidas dejan la paleta cerrada
           (core.js:2569). */
        setSearchOpen((open) => !open);
        return;
      }
      if (event.key === "Escape" && drawerOpen) {
        event.preventDefault();
        setDrawerOpen(false);
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
  }, [subject, selectTab, closeTab, drawerOpen]);

  /* ---------- migas y título ----------------------------------------------- */

  const crumbs = useMemo<Crumb[]>(() => {
    const home = routes.subject(subject);
    const head: Crumb = { label: model?.config.name ?? subject, to: home };
    /* Una vista de herramienta puede escribir sus propias migas con
       `App.setCrumbs` (el «Explorador · Normal» del baseline): cuelgan de la
       materia y reemplazan el rótulo único de la vista. */
    if (route.tool && runtimeCrumbs?.length) {
      /* El bundle antepone su propio «Inicio» (tools.js:707-709), que en el
         baseline se pinta como la casita. Acá la casita y el nombre de la
         materia ya lo dicen: repetirlo daba cinco tramos donde el original
         tiene tres (herr-09). */
      const first = runtimeCrumbs[0];
      const redundant =
        !!first && (first.label.trim().toLowerCase() === "inicio" || first.href === home || first.hash === "#/inicio");
      const rest = redundant ? runtimeCrumbs.slice(1) : runtimeCrumbs;
      return [head, ...rest.map((c) => ({ label: c.label, to: c.href }))];
    }
    /* Una página del wiki cuelga de «Todo el wiki» (core.js:1494-1508): sin ese
       tramo el catálogo solo se alcanza por el icono del rail. El rótulo es el
       del propio ítem del rail, para que la miga y el rail se llamen igual. */
    if (route.page) {
      const wiki: Crumb = { label: model?.railItem("wiki")?.item.label ?? "Todo el wiki", to: routes.wiki(subject) };
      return route.parent
        ? [head, wiki, route.parent, { label: viewTitle }]
        : [head, wiki, { label: viewTitle }];
    }
    return route.parent ? [head, route.parent, { label: viewTitle }] : [head, { label: viewTitle }];
  }, [model, subject, route, runtimeCrumbs, viewTitle]);

  /* La pestaña del navegador dice lo mismo que la pestaña activa de la cabecera. */
  useEffect(() => {
    const name = model?.config.name ?? subject;
    if (!name) return;
    document.title = `${viewTitle} · ${name}`;
  }, [viewTitle, model, subject]);

  const ctx = useMemo<SubjectCtx | null>(
    () => (model ? { slug: subject, model, openSearch, runtime } : null),
    [subject, model, openSearch, runtime],
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
      ref={shellRef}
      onClick={(event) => openLinkInNewTab(event, false)}
      onAuxClick={(event) => openLinkInNewTab(event, event.button === 1)}
    >
      <a href="#contenido" className={css.skip}>
        Saltar al contenido
      </a>
      <Rail slug={subject} groups={model.railGroups} compact={compact} onToggleCompact={toggle} />
      {/* En el ancho angosto el índice es un cajón. Con el índice plegado desde
          el rail no se dibuja hasta que el botón de menú lo pide: así ninguno de
          los dos controles queda sin efecto. */}
      {!compact || (narrow && drawerOpen) ? (
        <IndexPanel
          model={model}
          activePage={route.page}
          activeDivision={route.division}
          bookmarks={bookmarks}
          drawer={narrow}
          drawerOpen={drawerOpen}
        />
      ) : null}
      {narrow && drawerOpen ? (
        <div className={css.scrim} role="presentation" onClick={closeDrawer} data-testid="drawer-scrim" />
      ) : null}
      <div className={css.content}>
        <SubjectHeader
          tabs={tabs.list}
          activeId={tabs.active}
          onSelect={selectTab}
          onClose={closeTab}
          onNew={addTab}
          onReorder={reorderTabs}
          onSearch={openSearch}
          narrow={narrow}
          drawerOpen={drawerOpen}
          onToggleDrawer={toggleDrawer}
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
      {/* Una sola tarjeta de vista previa para todo el shell: cubre por
          delegación los enlaces a páginas de cualquier vista (N0-50). */}
      <PageTip model={model} subject={subject} rootRef={shellRef} currentPage={route.page} />
      <ShortcutsDialog open={shortcutsOpen} onClose={closeShortcuts} />
    </div>
  );
}
