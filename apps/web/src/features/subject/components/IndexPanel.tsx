/**
 * Panel índice de 250 px (regiones 05-06): hero de la materia y árbol
 * divisiones → bloques por tipo → páginas numeradas.
 *
 * La mecánica es FIJA (la dibuja la plataforma); los datos son de la materia:
 * el rótulo sale de `division.plural`, los bloques de `pageTypes` y el color de
 * cada división de la escala paramétrica del contrato.
 */
import { memo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { routes } from "@sinapsis/contract";
import { Icon, UiIcon } from "@/components/platform";
import { pad2, type DivisionNode, type SubjectModel } from "../model";
import { useOpenDivisions, useSubjectUiStore, useTypeCollapsed } from "../store";
import css from "./IndexPanel.module.css";

export interface IndexPanelProps {
  model: SubjectModel;
  /** Slug de la página abierta en el lector (si hay una). */
  activePage: string | null;
  /** Clave de la división en foco (por la página abierta o por /d/:division). */
  activeDivision: string | null;
  /** Slugs marcados como favoritos: la ★ del árbol. */
  bookmarks: ReadonlySet<string>;
}

export function IndexPanel({ model, activePage, activeDivision, bookmarks }: IndexPanelProps) {
  const { config, placeholder } = model;
  const open = useOpenDivisions(model.slug);
  const openDivision = useSubjectUiStore((s) => s.openDivision);

  /* Al navegar a una página, su división se abre sola. */
  useEffect(() => {
    if (activeDivision) openDivision(model.slug, activeDivision);
  }, [activeDivision, model.slug, openDivision]);

  const divisions = placeholder && !model.pages.length ? model.divisions : model.visibleDivisions;

  return (
    <aside className={css.panel} aria-label={`Índice de ${config.name}`}>
      <Link
        to={routes.subject(model.slug)}
        className={css.hero}
        aria-label={`Inicio de ${config.name}`}
        title="Ir al inicio de la materia"
      >
        <span className={css.name}>{config.name}</span>
        <span className={css.code}>
          {config.code} · {config.institution}
        </span>
      </Link>

      {placeholder ? (
        <p className={css.placeholder}>
          Sin sincronizar: ejecuta <code>/sinapsis sync</code> para traer el wiki.
        </p>
      ) : null}

      <div className={css.treeLabel}>{config.division.plural.toUpperCase()}</div>

      <div className={css.tree}>
        {divisions.map((division) => (
          <DivisionRow
            key={division.key}
            model={model}
            division={division}
            expanded={open.includes(division.key)}
            active={activeDivision === division.key}
            activePage={activePage}
            bookmarks={bookmarks}
          />
        ))}
        {!divisions.length ? <p className={css.empty}>Todavía no hay páginas sincronizadas.</p> : null}
      </div>
    </aside>
  );
}

interface DivisionRowProps {
  model: SubjectModel;
  division: DivisionNode;
  expanded: boolean;
  active: boolean;
  activePage: string | null;
  bookmarks: ReadonlySet<string>;
}

/* `memo` de verdad: todas las props son estables (el modelo y la división viven
   lo que la respuesta del API; el resto son primitivas) y la acción del store la
   toma la propia fila, así no llega una lambda nueva en cada render del panel. */
const DivisionRow = memo(function DivisionRow({
  model,
  division,
  expanded,
  active,
  activePage,
  bookmarks,
}: DivisionRowProps) {
  const toggleDivision = useSubjectUiStore((s) => s.toggleDivision);
  const count = model.contentPages(division.key).length;
  const blocks = expanded ? model.typeBlocks(division.key) : [];
  /* El mapa de posiciones lo memoriza el modelo: una vez por división, no por render. */
  const position = model.positions(division.key);
  /* Una división sin páginas no se puede desplegar: el control no se atenúa, se apaga. */
  const empty = model.pagesByDivision(division.key).length === 0;

  return (
    <div
      className={css.division}
      style={{ ["--ucol" as string]: division.color }}
      data-dimmed={empty || undefined}
    >
      <button
        type="button"
        className={css.divisionRow}
        onClick={() => toggleDivision(model.slug, division.key)}
        disabled={empty}
        aria-expanded={empty ? undefined : expanded}
        data-active={active ? "true" : undefined}
        data-testid="division-row"
        data-division={division.key}
      >
        <span className={css.dot} aria-hidden="true" />
        <span className={css.divisionLabel} title={division.long}>
          {division.label}
        </span>
        <span className={css.count}>{count}</span>
        <UiIcon name="chevronDown" size={14} className={expanded ? css.chevOpen : css.chev} />
      </button>

      {expanded ? (
        <div className={css.body}>
          {/* El rótulo visible se repite en cada división abierta: sin `aria-label`
              la lista de enlaces de un lector de pantalla mostraba doce «Ver la
              unidad completa» idénticos (revisión de diseño D5). El nombre
              accesible EMPIEZA por el rótulo visible (WCAG 2.5.3). */}
          <Link
            className={css.wholeDivision}
            to={routes.division(model.slug, division.key)}
            aria-label={`Ver la ${model.config.division.singular.toLowerCase()} completa: ${division.name}`}
          >
            <UiIcon name="menu" size={13} />
            Ver la {model.config.division.singular.toLowerCase()} completa
          </Link>
          {blocks.map((block) => (
            <TypeBlockRows
              key={block.type.key}
              model={model}
              divisionKey={division.key}
              block={block}
              position={position}
              activePage={activePage}
              bookmarks={bookmarks}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
});

function TypeBlockRows({
  model,
  divisionKey,
  block,
  position,
  activePage,
  bookmarks,
}: {
  model: SubjectModel;
  divisionKey: string;
  block: ReturnType<SubjectModel["typeBlocks"]>[number];
  position: ReadonlyMap<string, number>;
  activePage: string | null;
  bookmarks: ReadonlySet<string>;
}) {
  const collapsed = useTypeCollapsed(model.slug, divisionKey, block.type.key, block.type.collapsedByDefault);
  const toggleType = useSubjectUiStore((s) => s.toggleType);
  const holdsActive = activePage !== null && block.pages.some((p) => p.slug === activePage);
  const shown = collapsed && !holdsActive ? [] : block.pages;

  return (
    <div className={css.block}>
      <button
        type="button"
        className={css.blockLabel}
        onClick={() => toggleType(model.slug, divisionKey, block.type.key, block.type.collapsedByDefault)}
        aria-expanded={shown.length > 0}
      >
        <span>
          {block.type.plural.toUpperCase()} · {block.count}
        </span>
        <UiIcon name="chevronDown" size={11} className={shown.length ? css.chevOpen : css.chev} />
      </button>
      {shown.map((page) => (
        <PageRow
          key={page.slug}
          to={routes.page(model.slug, page.slug)}
          num={position.get(page.slug)}
          title={page.title}
          studied={model.studied.has(page.slug)}
          bookmarked={bookmarks.has(page.slug)}
          active={page.slug === activePage}
        />
      ))}
    </div>
  );
}

const PageRow = memo(function PageRow({
  to,
  num,
  title,
  studied,
  bookmarked,
  active,
}: {
  to: string;
  num: number | undefined;
  title: string;
  studied: boolean;
  /** Favorito: la ★ del contrato («Lo mío»). */
  bookmarked: boolean;
  active: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    if (active) ref.current?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <Link
      ref={ref}
      to={to}
      className={css.page}
      data-active={active ? "true" : undefined}
      aria-current={active ? "page" : undefined}
      title={title}
    >
      <span className={css.num}>{num ? pad2(num) : "·"}</span>
      <span className={css.pageTitle}>{title}</span>
      {bookmarked ? <Icon name="star" size={11} className={css.star} title="Favorita" /> : null}
      {studied ? <UiIcon name="check" size={12} className={css.check} title="Estudiada" /> : null}
    </Link>
  );
});
