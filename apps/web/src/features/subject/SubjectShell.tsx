/**
 * Shell de materia: la caja fija que envuelve a todas las vistas.
 *
 *   rail 52 · índice 250 · [ cabecera 40 · migas 28 · contenido con scroll propio ]
 *
 * Carga la materia UNA vez y la reparte por el Outlet; el resto de las vistas no
 * vuelven a pedirla. Es también quien conoce la ruta activa: de ahí salen la
 * pestaña, las migas, el título del documento, la división abierta en el índice
 * y el ítem activo del rail. Todo eso sale de UN solo cálculo (`route`): antes
 * la pestaña y las migas resolvían la misma ruta por separado y se contradecían.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { Outlet, useMatch, useParams } from "react-router-dom";
import { routes } from "@sinapsis/contract";
import { Seal } from "@/components/platform";
import { isTypingTarget } from "@/lib/keyboard";
import { Crumbs, type Crumb } from "./components/Crumbs";
import { Fab } from "./components/Fab";
import { IndexPanel } from "./components/IndexPanel";
import { Rail } from "./components/Rail";
import { SearchPalette } from "./components/SearchPalette";
import { SubjectHeader } from "./components/SubjectHeader";
import { ErrorCard, WideSkeleton } from "./components/States";
import type { SubjectCtx } from "./context";
import { useCompact } from "./store";
import { useSubject } from "./useSubject";
import css from "./SubjectShell.module.css";

/** Lo que la ruta activa aporta a la pestaña, a las migas y al título de la pestaña del navegador. */
interface RouteInfo {
  /** Rótulo de la vista: pestaña, última miga y `document.title`. */
  title: string;
  /** Rótulo corto de la división (solo con una página abierta). */
  chip: string | null;
  /** Color de la división, si la ruta pertenece a una. */
  color: string | null;
  /** Miga intermedia (la división de la página abierta). */
  parent: Crumb | null;
}

export function SubjectShell() {
  const { subject = "" } = useParams();
  const { query, model } = useSubject(subject);
  const { compact, toggle } = useCompact();
  const [searchOpen, setSearchOpen] = useState(false);
  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  const homeMatch = useMatch("/m/:subject");
  const pageMatch = useMatch("/m/:subject/p/:page");
  const divisionMatch = useMatch("/m/:subject/d/:division");
  const toolMatch = useMatch("/m/:subject/t/:tool");
  const wikiMatch = useMatch("/m/:subject/wiki");
  const graphMatch = useMatch("/m/:subject/graph");

  /* ⌘K / Ctrl+K en cualquier lado; «/» solo fuera de un campo de texto. */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
        return;
      }
      if (
        event.key === "/" &&
        !isTypingTarget(event.target) &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey
      ) {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const pageSlug = pageMatch?.params.page ?? null;
  const page = pageSlug && model ? (model.bySlug.get(pageSlug) ?? null) : null;
  const divisionKey = divisionMatch?.params.division ?? (page && model ? model.divisionOf(page) : null);
  const division = divisionKey && model ? (model.division(divisionKey) ?? null) : null;

  const route = useMemo<RouteInfo>(() => {
    const unit = model?.config.division.singular ?? "División";
    if (pageSlug) {
      return {
        title: page?.title ?? pageSlug,
        chip: division?.short ?? null,
        color: division?.color ?? null,
        parent: division ? { label: division.label, to: routes.division(subject, division.key) } : null,
      };
    }
    if (wikiMatch) return { title: "Todo el wiki", chip: null, color: null, parent: null };
    if (graphMatch) return { title: "Grafo de conexiones", chip: null, color: null, parent: null };
    if (divisionMatch) {
      return { title: division?.label ?? unit, chip: null, color: division?.color ?? null, parent: null };
    }
    if (toolMatch) {
      const label = model?.railItem(toolMatch.params.tool ?? "")?.item.label ?? "Herramienta";
      return { title: label, chip: null, color: null, parent: null };
    }
    if (homeMatch) return { title: "Inicio", chip: null, color: null, parent: null };
    return { title: "No encontrado", chip: null, color: null, parent: null };
  }, [model, subject, pageSlug, page, division, homeMatch, wikiMatch, graphMatch, divisionMatch, toolMatch]);

  const crumbs = useMemo<Crumb[]>(() => {
    const head: Crumb = { label: model?.config.name ?? subject, to: routes.subject(subject) };
    return route.parent ? [head, route.parent, { label: route.title }] : [head, { label: route.title }];
  }, [model, subject, route]);

  /* La pestaña del navegador dice lo mismo que la pestaña de la cabecera. */
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
    <div className={css.shell}>
      <a href="#contenido" className={css.skip}>
        Saltar al contenido
      </a>
      <Rail slug={subject} groups={model.railGroups} compact={compact} onToggleCompact={toggle} />
      {compact ? null : (
        <IndexPanel model={model} activePage={pageSlug} activeDivision={divisionKey ?? null} />
      )}
      <div className={css.content}>
        <SubjectHeader
          tab={{ title: route.title, chip: route.chip, color: route.color }}
          subject={subject}
          onSearch={openSearch}
        />
        <Crumbs items={crumbs} />
        <main className={css.main} id="contenido" data-subject-main="">
          <Outlet context={ctx} />
        </main>
        {model.fab ? <Fab view={model.fab} /> : null}
      </div>
      <SearchPalette model={model} open={searchOpen} onClose={closeSearch} />
    </div>
  );
}
