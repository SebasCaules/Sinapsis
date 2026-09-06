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
import { plural, routes } from "@sinapsis/contract";
import { Icon, UiIcon } from "@/components/platform";
import { pad2, type DivisionNode, type ProgressGroup, type SubjectModel } from "../model";
import { INDEX_PANEL_ID } from "./SubjectHeader";
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
  /** En el ancho angosto el panel es un cajón que entra desde la izquierda. */
  drawer?: boolean;
  drawerOpen?: boolean;
}

export function IndexPanel({
  model,
  activePage,
  activeDivision,
  bookmarks,
  drawer = false,
  drawerOpen = false,
}: IndexPanelProps) {
  const { config, placeholder } = model;
  const open = useOpenDivisions(model.slug);
  const openDivision = useSubjectUiStore((s) => s.openDivision);

  /* Al navegar a una página, su división se abre sola. */
  useEffect(() => {
    if (activeDivision) openDivision(model.slug, activeDivision);
  }, [activeDivision, model.slug, openDivision]);

  const divisions = placeholder && !model.pages.length ? model.divisions : model.visibleDivisions;

  return (
    <aside
      className={css.panel}
      id={INDEX_PANEL_ID}
      aria-label={`Índice de ${config.name}`}
      data-drawer={drawer ? "true" : undefined}
      data-open={drawer && drawerOpen ? "true" : undefined}
      aria-hidden={drawer && !drawerOpen ? true : undefined}
    >
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
  /* El tooltip del baseline (core.js:1916-1921): «U4 · … · 11 páginas · 0
     leídas». El progreso ya lo calcula el modelo; hasta ahora la fila no decía
     cuánto se llevaba leído. Son PÁGINAS: `progress()` suma también los pasos
     de los bundles (N0-61), y acá el denominador son las páginas. */
  const parts = model.progressParts(division.key);
  const done = parts.pages.done;
  const blocks = expanded ? model.typeBlocks(division.key) : [];
  /* Los ejercicios de la unidad, agrupados como los declara el bundle (N0-61):
     un bloque más al final del árbol, con el mismo aire que los de tipo. */
  const groups = expanded ? parts.groups : [];
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
        title={
          `${division.long} · ${count} ${plural(count, "página", "páginas")} · ${done} ${plural(done, "leída", "leídas")}` +
          /* Con ejercicios, el tooltip los nombra aparte: el badge numérico de
             la fila sigue contando PÁGINAS y no puede decirlo por sí solo. */
          (parts.extras.total
            ? ` · ${parts.extras.total} ${plural(parts.extras.total, "ejercicio", "ejercicios")} · ${parts.extras.done} ${plural(parts.extras.done, "resuelto", "resueltos")}`
            : "")
        }
      >
        <span className={css.dot} aria-hidden="true" />
        <span className={css.divisionLabel}>{division.label}</span>
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
            /* Dice qué se va a encontrar del otro lado (core.js:1923). */
            title={`Temario, progreso y fuentes de la ${model.config.division.singular.toLowerCase()}`}
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
          {groups.length ? <ExerciseBlock groups={groups} total={parts.extras.total} /> : null}
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
        <span title={`${block.count} ${block.type.plural.toLowerCase()}`}>
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

/**
 * El bloque de ejercicios de la división: una fila por grupo (Guía, Lutzio,
 * Parciales, Finales) con su avance. A diferencia de los bloques de tipo NO se
 * pliega: son cuatro filas como mucho, y plegarlas escondería justamente lo que
 * la barra de la unidad ahora cuenta.
 */
function ExerciseBlock({ groups, total }: { groups: ProgressGroup[]; total: number }) {
  return (
    <div className={css.block}>
      <div className={css.blockLabel} data-static="true">
        <span title={`${total} ${plural(total, "ejercicio", "ejercicios")}`}>EJERCICIOS · {total}</span>
      </div>
      {groups.map((group) => (
        <GroupRow key={group.id} group={group} />
      ))}
    </div>
  );
}

function GroupRow({ group }: { group: ProgressGroup }) {
  const complete = group.total > 0 && group.done === group.total;
  const label = `${group.label} · ${group.done} de ${group.total} ${plural(group.total, "resuelto", "resueltos")}`;
  const body = (
    <>
      <span className={css.num} aria-hidden="true">
        ·
      </span>
      <span className={css.pageTitle}>{group.label}</span>
      <span className={css.groupCount}>
        {group.done}/{group.total}
      </span>
      {complete ? <UiIcon name="check" size={12} className={css.groupCheck} title="Completo" /> : null}
    </>
  );
  /* El destino lo declara el bundle y es una ruta del SPA. Un valor que no lo
     sea deja la fila sin enlace: la plataforma no navega a donde no sabe. */
  return group.to && group.to.startsWith("/") ? (
    <Link className={css.page} to={group.to} title={label} aria-label={label}>
      {body}
    </Link>
  ) : (
    <span className={css.page} title={label}>
      {body}
    </span>
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
      /* Sin `title`: la fila la cubre la tarjeta de vista previa del shell
         (N0-50), que dice bastante más que el título repetido. */
    >
      <span className={css.num}>{num ? pad2(num) : "·"}</span>
      <span className={css.pageTitle}>{title}</span>
      {bookmarked ? <Icon name="star" size={11} className={css.star} title="Favorita" /> : null}
      {studied ? <UiIcon name="check" size={12} className={css.check} title="Estudiada" /> : null}
    </Link>
  );
});
