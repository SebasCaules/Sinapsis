/**
 * Shell de materia: la caja fija que envuelve a todas las vistas.
 *
 *   rail 52 · índice 250 · [ cabecera 40 · migas 28 · contenido con scroll propio ]
 *
 * Carga la materia UNA vez y la reparte por el Outlet; el resto de las vistas no
 * vuelven a pedirla. Es también quien conoce la ruta activa: de ahí salen la
 * pestaña, las migas, la división abierta en el índice y el ítem activo del rail.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { Outlet, useMatch, useParams } from "react-router-dom";
import { routes } from "@sinapsis/contract";
import { Seal } from "@/components/platform";
import { Crumbs, type Crumb } from "./components/Crumbs";
import { Fab } from "./components/Fab";
import { IndexPanel } from "./components/IndexPanel";
import { Rail } from "./components/Rail";
import { SearchPalette } from "./components/SearchPalette";
import { SubjectHeader, type TabInfo } from "./components/SubjectHeader";
import { ErrorCard, WideSkeleton } from "./components/States";
import type { SubjectCtx } from "./context";
import { useCompact } from "./store";
import { useSubject } from "./useSubject";
import css from "./SubjectShell.module.css";

export function SubjectShell() {
  const { subject = "" } = useParams();
  const { query, model } = useSubject(subject);
  const { compact, toggle } = useCompact();
  const [searchOpen, setSearchOpen] = useState(false);
  const openSearch = useCallback(() => setSearchOpen(true), []);

  const pageMatch = useMatch("/m/:subject/p/:page");
  const divisionMatch = useMatch("/m/:subject/d/:division");
  const toolMatch = useMatch("/m/:subject/t/:tool");
  const wikiMatch = useMatch("/m/:subject/wiki");
  const graphMatch = useMatch("/m/:subject/graph");

  /* ⌘K / Ctrl+K en cualquier lado; «/» solo fuera de un campo de texto. */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        !!target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
        return;
      }
      if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
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

  const tab = useMemo<TabInfo>(() => {
    if (pageSlug) {
      return {
        title: page?.title ?? pageSlug,
        chip: division?.short ?? null,
        color: division?.color ?? null,
      };
    }
    if (wikiMatch) return { title: "Todo el wiki", chip: null, color: null };
    if (graphMatch) return { title: "Grafo de conexiones", chip: null, color: null };
    if (divisionMatch) return { title: division?.label ?? "División", chip: null, color: division?.color ?? null };
    if (toolMatch) return { title: toolLabel(model, toolMatch.params.tool), chip: null, color: null };
    return { title: "Inicio", chip: null, color: null };
  }, [pageSlug, page, division, wikiMatch, graphMatch, divisionMatch, toolMatch, model]);

  const crumbs = useMemo<Crumb[]>(() => {
    const name = model?.config.name ?? subject;
    const head: Crumb = { label: name, to: routes.subject(subject) };
    if (pageSlug) {
      const items: Crumb[] = [head];
      if (division) items.push({ label: division.label, to: routes.division(subject, division.key) });
      items.push({ label: page?.title ?? pageSlug });
      return items;
    }
    if (wikiMatch) return [head, { label: "Todo el wiki" }];
    if (graphMatch) return [head, { label: "Grafo de conexiones" }];
    if (divisionMatch) return [head, { label: division?.label ?? "División" }];
    if (toolMatch) return [head, { label: toolLabel(model, toolMatch.params.tool) }];
    return [head, { label: "Inicio" }];
  }, [model, subject, pageSlug, page, division, wikiMatch, graphMatch, divisionMatch, toolMatch]);

  if (!model) {
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
          <main className={css.main}>
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

  const ctx: SubjectCtx = { slug: subject, model, openSearch };

  return (
    <div className={css.shell}>
      <Rail slug={subject} groups={model.railGroups} compact={compact} onToggleCompact={toggle} />
      {compact ? null : (
        <IndexPanel model={model} activePage={pageSlug} activeDivision={divisionKey ?? null} />
      )}
      <div className={css.content}>
        <SubjectHeader tab={tab} onSearch={openSearch} />
        <Crumbs items={crumbs} />
        <main className={css.main} data-subject-main="">
          <Outlet context={ctx} />
        </main>
        {model.config.fab ? <Fab slug={subject} fab={model.config.fab} /> : null}
      </div>
      <SearchPalette model={model} open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}

/** Rótulo de una herramienta a partir del rail de la materia. */
function toolLabel(model: ReturnType<typeof useSubject>["model"], tool: string | undefined): string {
  if (!tool) return "Herramienta";
  for (const group of model?.railGroups ?? []) {
    for (const view of group.items) {
      const { item } = view;
      if ((item.kind === "tool" && item.target === tool) || (item.kind === "builtin" && item.id === tool)) {
        return item.label;
      }
    }
  }
  return "Herramienta";
}
