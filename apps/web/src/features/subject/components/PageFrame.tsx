/**
 * PageFrame — el marco de una página de la plataforma (N0-64).
 *
 * Es la hoja y todo lo que la rodea: el ancho con sus asas, la línea de
 * identidad (chip de división · etiqueta de tipo · posición · acciones), la
 * barra de la unidad con sus segmentos y el pie de Anterior/Siguiente. El
 * CONTENIDO lo pone quien usa el marco, en `children`.
 *
 * Lo usan dos vistas muy distintas y no sabe nada de ninguna:
 *
 *  - el lector del wiki (`views/ReaderView`), que le pasa la prosa compuesta, la
 *    columna derecha en `aside` y sus acciones de estudio;
 *  - las vistas de herramienta declaradas con `frame: "page"` en el manifiesto
 *    de la materia (`tools/ToolHost`), que le pasan el contenedor del bundle.
 *
 * Nada de acá es de una materia en particular: los pasos llegan ya resueltos
 * (`model.unitSteps`) y los enlaces salen de `routes.page` o del `to` que declaró
 * el proveedor de progreso. Una wiki nueva no tiene que tocar este archivo.
 */
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { Link } from "react-router-dom";
import { plural, routes, type PageMeta } from "@sinapsis/contract";
import type { DivisionNode, SubjectModel, UnitStep } from "../model";
import { EXERCISES_LABEL, PageTypeTag } from "./TypeTag";
import {
  SHEET_DEFAULT,
  SHEET_MAX,
  SHEET_MIN,
  SHEET_STEP,
  clampSheetWidth,
  resizeSheet,
  useSheetWidth,
} from "../views/sheetWidth";
import css from "./PageFrame.module.css";

/**
 * Vecino de lectura. `division` no es null cuando el paso CRUZA de división: es
 * la división a la que se entra, y el rótulo lo dice («← Unidad anterior: U3»).
 */
export interface Neighbor {
  page: PageMeta;
  division: DivisionNode | null;
}

/** Un grupo de ejercicios de la división, como paso de la secuencia (N0-61). */
export type GroupStep = Extract<UnitStep, { kind: "extra" }>;

/**
 * Un vecino del marco: la página de al lado (con su cruce de división) o un
 * grupo de ejercicios de la unidad.
 */
export type ReadStep = Neighbor | GroupStep;

/** ¿El paso es un grupo de ejercicios y no una página? */
export function isGroupStep(step: ReadStep | UnitStep | null | undefined): step is GroupStep {
  return step !== null && step !== undefined && "kind" in step && step.kind === "extra";
}

/** El paso que está abierto: una página del wiki o un grupo de ejercicios. */
export type FrameCurrent = { kind: "page"; slug: string } | { kind: "extra"; id: string };

export interface PageFrameProps {
  model: SubjectModel;
  /** Slug de la materia: arma los enlaces de la barra y del chip de división. */
  subject: string;
  /** División a la que pertenece el paso abierto (null fuera del programa). */
  division: DivisionNode | null | undefined;
  /** Clave del tipo, ya resuelta por quien llama (`page.type`, `EXERCISES_TYPE`…). */
  type: string;
  /** «página 3 de 14 · +16 ejercicios», «ejercicios 1 de 4 · 16 ejercicios»… */
  position?: ReactNode;
  /** Título de la hoja. Sin él, el título lo pone el contenido (lo hacen los bundles). */
  title?: ReactNode;
  /** Secuencia extendida de la unidad (`model.unitSteps`): páginas y grupos. */
  steps: UnitStep[];
  current: FrameCurrent;
  /** Vecinos ya resueltos: el marco no decide el recorrido, solo lo dibuja. */
  prev?: ReadStep | null;
  next?: ReadStep | null;
  /** Acciones de la línea de identidad («Marcar estudiado», «A favoritos»…). */
  actions?: ReactNode;
  /** Lo que va DEBAJO del Anterior/Siguiente del pie, dentro de la hoja. */
  footer?: ReactNode;
  /** Columna o docks que viven al lado de la hoja, fuera de ella. */
  aside?: ReactNode;
  /** Estado de esa columna: la hoja se corre para dejarle sitio. */
  side?: "open" | "closed";
  /** Ref a la hoja, para quien necesite mirar el DOM compuesto (figuras, scroll). */
  sheetRef?: RefObject<HTMLElement>;
  children: ReactNode;
}

export function PageFrame({
  model,
  subject,
  division,
  type,
  position,
  title,
  steps,
  current,
  prev = null,
  next = null,
  actions,
  footer,
  aside,
  side = "closed",
  sheetRef,
  children,
}: PageFrameProps) {
  /* Ancho de la hoja: preferencia de lectura global, con sus asas (ver
     `views/sheetWidth.ts`). `layoutRef` es donde vive la variable —el arrastre la
     escribe directamente ahí, sin re-renderizar— y `columnRef` da el techo real
     de la pantalla. */
  const [sheetWidth, setSheetWidth] = useSheetWidth();
  const layoutRef = useRef<HTMLDivElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);
  const ownSheet = useRef<HTMLElement>(null);
  const sheet = sheetRef ?? ownSheet;

  const color = division?.color ?? "var(--primary)";
  const unit = model.config.division.singular.toLowerCase();
  const pages = steps.filter((s): s is Extract<UnitStep, { kind: "page" }> => s.kind === "page");
  const groups = steps.filter(isGroupStep);

  /* El cajón transversal no es un recorrido y el baseline no le dibuja la barra
     (`is-bare`, reader.js:432-445): queda la línea de identidad y nada más. Su
     navegación viene del orden global, al pie. */
  const showStrip = pages.length > 1 && !division?.synthetic;

  return (
    <div
      className={css.layout}
      ref={layoutRef}
      data-side={side}
      style={{ ["--ucol" as string]: color, ["--sheet-width" as string]: `${sheetWidth}px` }}
    >
      <div className={css.column} ref={columnRef}>
        <article className={css.sheet} ref={sheet} data-page-frame="">
          <header className={css.sheetHead}>
            {division ? (
              <Link className={css.divisionChip} to={routes.division(subject, division.key)}>
                <span className={css.divisionDot} aria-hidden="true" />
                {division.label}
              </Link>
            ) : null}
            {/* La etiqueta de tipo es LA misma de toda la materia (`TypeTag`):
                el lector, el índice, la tarjeta de vista previa y la vista de
                ejercicios hablan el mismo idioma. */}
            <PageTypeTag model={model} type={type} />
            {position ? <span className={css.position}>{position}</span> : null}
            <span className={css.headSpacer} />
            {/* Las acciones de la página viven en la línea de identidad de la
                hoja (pedido del usuario): antes iban en una fila propia arriba
                y acá había «¿Qué sigue?» y «+N fuentes», que el usuario sacó.
                Las fuentes de la división se leen en su portada. */}
            {actions}
          </header>

          {showStrip ? (
            <nav className={css.segments} aria-label={`Páginas de la ${unit}`}>
              {/* Anterior y siguiente flanquean la barra (pedido del usuario): a
                  secas, sin títulos, que van en el pie. Lo único que se agrega
                  es el cruce de división, que cambia de destino y hay que
                  decirlo («Siguiente unidad →»). */}
              <div className={css.segmentsRow}>
                <StripLink side="prev" slug={subject} step={prev} unit={unit} />
                <div className={css.segmentsTrack}>
                {/* Sin `title`: el segmento lo cubre la tarjeta de vista previa
                    del shell (N0-50), que muestra el título, el resumen y la
                    posición «N de M»; el tooltip nativo dibujaría dos a la vez.
                    El nombre accesible lleva la posición (§ lector-19): con
                    lector de pantalla la pista era una lista de títulos sin
                    orden ni total. */}
                {pages.map((step, i) => (
                  <Link
                    key={step.page.slug}
                    to={routes.page(subject, step.page.slug)}
                    className={css.segment}
                    data-seg={i + 1}
                    data-state={
                      current.kind === "page" && step.page.slug === current.slug
                        ? "current"
                        : model.studied.has(step.page.slug)
                          ? "studied"
                          : "todo"
                    }
                    aria-label={`${i + 1} de ${pages.length}. ${step.page.title}`}
                    aria-current={
                      current.kind === "page" && step.page.slug === current.slug ? "page" : undefined
                    }
                  />
                ))}
                {/* Los grupos de ejercicios cierran la barra: un segmento por
                    grupo, con el trazo punteado que los distingue de una página
                    y el relleno proporcional a lo resuelto (N0-61). */}
                {groups.map((group) => (
                  <GroupSegment
                    key={group.id}
                    group={group}
                    division={division ?? null}
                    current={current.kind === "extra" && current.id === group.id}
                  />
                ))}
              </div>
                <StripLink side="next" slug={subject} step={next} unit={unit} />
              </div>
            </nav>
          ) : null}

          {title ? <h1 className={css.title}>{title}</h1> : null}

          {children}

          {/* El mismo par de acciones al terminar de leer: nadie tiene que volver
              arriba para marcar la página o pasar a la siguiente. */}
          <footer className={css.foot}>
            <PrevNext slug={subject} prev={prev} next={next} unit={unit} />
            {footer}
          </footer>

          {/* Las asas van ÚLTIMAS y absolutas: no entran en el flujo de la hoja,
              así que no mueven ni un píxel de lo que ya se leía. */}
          <SheetHandle
            side="left"
            width={sheetWidth}
            onWidth={setSheetWidth}
            layoutRef={layoutRef}
            columnRef={columnRef}
          />
          <SheetHandle
            side="right"
            width={sheetWidth}
            onWidth={setSheetWidth}
            layoutRef={layoutRef}
            columnRef={columnRef}
          />
        </article>
      </div>

      {aside}
    </div>
  );
}

/**
 * La hoja ajustable, sin el marco de página: la misma caja y las mismas asas que
 * usa `PageFrame`, para lo que se lee como un documento pero no es un paso de
 * ningún recorrido —una herramienta con `frame: "sheet"` (N0-73)—.
 */
export function Sheet({ children }: { children: ReactNode }) {
  const [sheetWidth, setSheetWidth] = useSheetWidth();
  const layoutRef = useRef<HTMLDivElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);
  return (
    <div
      className={css.layout}
      ref={layoutRef}
      style={{ ["--sheet-width" as string]: `${sheetWidth}px` }}
    >
      <div className={css.column} ref={columnRef}>
        <article className={css.sheet} data-page-frame="">
          {children}
          <SheetHandle side="left" width={sheetWidth} onWidth={setSheetWidth} layoutRef={layoutRef} columnRef={columnRef} />
          <SheetHandle side="right" width={sheetWidth} onWidth={setSheetWidth} layoutRef={layoutRef} columnRef={columnRef} />
        </article>
      </div>
    </div>
  );
}

const HANDLE_TITLE = `Arrastre para cambiar el ancho de la hoja · doble clic: volver a ${SHEET_DEFAULT}`;

/**
 * Cursor y selección del documento mientras se arrastra: sin esto, salir de los
 * 12 px del asa devolvía la flecha del puntero a mitad del gesto y el arrastre
 * iba seleccionando la prosa a su paso. Se guarda lo que había para reponerlo:
 * el marco no es el dueño del `body`.
 */
let bodyLock: { cursor: string; userSelect: string } | null = null;

function lockBody(): void {
  if (typeof document === "undefined" || bodyLock) return;
  const style = document.body.style;
  bodyLock = { cursor: style.cursor, userSelect: style.userSelect };
  style.cursor = "col-resize";
  style.userSelect = "none";
}

function unlockBody(): void {
  if (typeof document === "undefined" || !bodyLock) return;
  document.body.style.cursor = bodyLock.cursor;
  document.body.style.userSelect = bodyLock.userSelect;
  bodyLock = null;
}

/**
 * Asa de ancho: el borde izquierdo o el derecho de la hoja, de arriba abajo.
 *
 * Arrastrar es lo obvio, pero no es la única manera: el asa se enfoca con el
 * tabulador y ahí las flechas mueven de a `SHEET_STEP` (×4 con Shift), Inicio y
 * Fin van a los extremos, y Entrar, Espacio o un doble clic devuelven la hoja a
 * los 840 de fábrica. El valor se OYE, además de verse (`aria-valuetext`).
 *
 * Mientras dura el gesto la variable se escribe directamente en el nodo de
 * `.layout` dentro de un `requestAnimationFrame`: un `pointermove` puede llegar
 * cien veces por segundo y re-renderizar la vista —con su markdown y su
 * KaTeX— en cada uno era insostenible. El estado se confirma al soltar, que es
 * también donde se persiste.
 */
function SheetHandle({
  side,
  width,
  onWidth,
  layoutRef,
  columnRef,
}: {
  side: "left" | "right";
  width: number;
  onWidth: (value: number) => void;
  layoutRef: RefObject<HTMLDivElement>;
  columnRef: RefObject<HTMLDivElement>;
}) {
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ startX: number; startWidth: number; value: number } | null>(null);
  const frame = useRef(0);

  /* Techo del arrastre: los límites del módulo, pero nunca más que el ancho que
     realmente hay en la columna. La hoja no puede desbordar (el CSS la corta en
     `100%`), y sin este tope el asa se quedaba clavada mientras el puntero
     seguía viajando. El valor guardado sí puede ser mayor: en una pantalla más
     ancha vuelve a valer entero. */
  const roof = useCallback(() => {
    const room = columnRef.current?.clientWidth ?? 0;
    return room > SHEET_MIN ? Math.min(SHEET_MAX, room) : SHEET_MAX;
  }, [columnRef]);

  const paint = useCallback(
    (value: number) => layoutRef.current?.style.setProperty("--sheet-width", `${value}px`),
    [layoutRef],
  );

  /* Un desmontaje a mitad de gesto (cambio de página con el botón apretado) no
     puede dejar el documento con el cursor de arrastre para siempre. */
  useEffect(
    () => () => {
      if (frame.current) cancelAnimationFrame(frame.current);
      unlockBody();
    },
    [],
  );

  const finish = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state) return;
    drag.current = null;
    setDragging(false);
    if (frame.current) {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    }
    unlockBody();
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      /* el puntero ya se había soltado solo */
    }
    paint(state.value);
    onWidth(state.value);
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? SHEET_STEP * 4 : SHEET_STEP;
    /* En el asa izquierda las flechas van al revés, como si se arrastrara ESE
       borde: hacia afuera (←) agranda, hacia adentro (→) achica. */
    const grow = side === "right" ? "ArrowRight" : "ArrowLeft";
    const shrink = side === "right" ? "ArrowLeft" : "ArrowRight";
    let next: number | null = null;
    if (event.key === grow) next = width + step;
    else if (event.key === shrink) next = width - step;
    else if (event.key === "Home") next = SHEET_MIN;
    else if (event.key === "End") next = SHEET_MAX;
    else if (event.key === "Enter" || event.key === " ") next = SHEET_DEFAULT;
    if (next === null) return;
    event.preventDefault();
    onWidth(clampSheetWidth(next));
  };

  return (
    <div
      className={`${css.handle} ${side === "left" ? css.handleLeft : css.handleRight}`}
      role="separator"
      aria-orientation="vertical"
      aria-label="Ancho de la hoja"
      aria-valuemin={SHEET_MIN}
      aria-valuemax={SHEET_MAX}
      aria-valuenow={width}
      aria-valuetext={`${width} píxeles`}
      tabIndex={0}
      title={HANDLE_TITLE}
      data-side={side}
      data-dragging={dragging ? "true" : undefined}
      onPointerDown={(event) => {
        /* Solo el botón principal: con el secundario se abre el menú del
           navegador y el gesto quedaba a medias. */
        if (event.button !== 0) return;
        event.preventDefault();
        drag.current = { startX: event.clientX, startWidth: width, value: width };
        setDragging(true);
        lockBody();
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
          /* sin captura el gesto sigue valiendo mientras el puntero esté encima */
        }
      }}
      onPointerMove={(event) => {
        const state = drag.current;
        if (!state) return;
        state.value = Math.min(resizeSheet(state.startWidth, event.clientX - state.startX, side), roof());
        if (frame.current) return;
        frame.current = requestAnimationFrame(() => {
          frame.current = 0;
          if (drag.current) paint(drag.current.value);
        });
      }}
      onPointerUp={finish}
      onPointerCancel={finish}
      onDoubleClick={() => onWidth(SHEET_DEFAULT)}
      onKeyDown={onKeyDown}
    />
  );
}

/** Primera letra en mayúscula («unidad» → «Unidad»). */
export function cap(text: string): string {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}

/** «3 de 16 resueltos», que es lo que se lee de un grupo en todas partes. */
export function groupProgressLabel(group: GroupStep): string {
  return `${group.done} de ${group.total} ${plural(group.total, "resuelto", "resueltos")}`;
}

/**
 * El enlace corto que flanquea la barra. Va a secas (pedido del usuario) salvo
 * cuando el paso CRUZA de división: ahí el rótulo lo dice, porque el destino
 * deja de ser «la página de al lado».
 */
function StripLink({
  side,
  slug,
  step,
  unit,
}: {
  side: "prev" | "next";
  slug: string;
  step: ReadStep | null;
  unit: string;
}) {
  /* Un grupo de ejercicios NO es la página de al lado: el rótulo lo nombra,
     como el cruce de división, porque el destino cambia de naturaleza. */
  if (isGroupStep(step)) {
    const text = side === "prev" ? `← ${step.label}` : `${step.label} →`;
    const klass = side === "prev" ? `${css.prev} ${css.sidePrev}` : `${css.next} ${css.sideNext}`;
    const href = groupHref(step);
    if (!href) {
      return (
        <span className={`${css.prevOff} ${side === "prev" ? css.sidePrev : css.sideNext}`}>{text}</span>
      );
    }
    return (
      <Link className={klass} to={href}>
        {text}
        <span className={css.srOnly}>{`: ${EXERCISES_LABEL} — ${groupProgressLabel(step)}`}</span>
      </Link>
    );
  }
  const cross = step?.division ?? null;
  const text =
    side === "prev"
      ? cross
        ? `← ${cap(unit)} anterior`
        : "← Anterior"
      : cross
        ? `${cap(unit)} siguiente →`
        : "Siguiente →";
  const klass = side === "prev" ? `${css.prev} ${css.sidePrev}` : `${css.next} ${css.sideNext}`;
  if (!step) {
    return <span className={`${css.prevOff} ${side === "prev" ? css.sidePrev : css.sideNext}`}>{text}</span>;
  }
  return (
    <Link className={klass} to={routes.page(slug, step.page.slug)}>
      {text}
      {/* El destino se OYE pero no se ve: en pantalla el enlace va a secas
          (pedido del usuario) y con lector de pantalla dice a dónde lleva, que
          es lo que el baseline muestra en el `title` del enlace. */}
      <span className={css.srOnly}>
        {cross ? `: ${cross.label} — ${step.page.title}` : `: ${step.page.title}`}
      </span>
    </Link>
  );
}

/**
 * El destino de un grupo, si es una ruta del SPA. Lo declara el bundle: un
 * valor que no empiece por `/` deja el paso sin enlace, porque la plataforma no
 * navega a donde no sabe.
 */
export function groupHref(group: GroupStep): string | null {
  return group.to && group.to.startsWith("/") ? group.to : null;
}

/**
 * Un grupo de ejercicios como segmento de la barra. Se distingue de una página
 * por el trazo punteado, y lo resuelto se pinta con un relleno proporcional en
 * vez de un estado de tres valores: un grupo de 16 ejercicios rara vez está
 * entero hecho o entero sin hacer.
 *
 * Lleva además los atributos de la tarjeta de vista previa genérica
 * (`data-tip-*`, ver `page-tip.ts`): al pasar el puntero se lee de qué grupo se
 * trata y cuánto lleva hecho, igual que en un segmento de página.
 */
function GroupSegment({
  group,
  division,
  current,
}: {
  group: GroupStep;
  division: DivisionNode | null;
  current: boolean;
}) {
  const pct = group.total ? Math.round((group.done / group.total) * 100) : 0;
  const label = `${EXERCISES_LABEL} · ${group.label} · ${groupProgressLabel(group)}`;
  const state = group.total > 0 && group.done === group.total ? "done" : group.done ? "partial" : "todo";
  const href = groupHref(group);
  const style = { ["--fill" as string]: `${pct}%` };
  /* La tarjeta: antetítulo con la unidad, el grupo como título, el avance como
     cuerpo y el proveedor al pie. Sin nada hecho todavía se dice cuántos hay,
     que es más útil que un «0 de 16». */
  const tip = {
    "data-tip-kicker": division ? `${division.short} · ${EXERCISES_LABEL}` : EXERCISES_LABEL,
    "data-tip-title": group.label,
    "data-tip-text": group.done
      ? groupProgressLabel(group)
      : `${group.total} ${plural(group.total, "ejercicio", "ejercicios")}`,
    /* El proveedor al pie SOLO cuando dice algo nuevo: en una materia cuyo
       bundle se llama «ejercicios», repetirlo debajo de la etiqueta EJERCICIOS
       era una línea de ruido. Otro proveedor («simulacros», «tarjetas») sí. */
    ...(group.source && group.source.toLowerCase() !== EXERCISES_LABEL.toLowerCase()
      ? { "data-tip-meta": group.source }
      : {}),
    "data-tip-type": "ejercicios",
  };
  if (!href) {
    return (
      <span
        className={css.segmentExtra}
        data-state={state}
        data-current={current ? "true" : undefined}
        style={style}
        aria-label={label}
        role="img"
        {...tip}
      />
    );
  }
  return (
    <Link
      to={href}
      className={css.segmentExtra}
      data-extra={group.id}
      data-state={state}
      data-current={current ? "true" : undefined}
      style={style}
      aria-label={label}
      aria-current={current ? "page" : undefined}
      {...tip}
    />
  );
}

/**
 * Anterior / Siguiente al pie, con el título entero de las dos páginas y el
 * cruce de división rotulado, como `prevNextHtml` del baseline
 * (reader.js:826-841): «← Unidad anterior: U3 / Ejercicios de finales».
 */
function PrevNext({
  slug,
  prev,
  next,
  unit,
}: {
  slug: string;
  prev: ReadStep | null;
  next: ReadStep | null;
  /** Nombre de la división de la materia, en minúscula ("unidad", "semana"). */
  unit: string;
}) {
  if (!prev && !next) return null;
  return (
    <nav className={`${css.prevNext} ${css.prevNextFoot}`} aria-label="Páginas vecinas">
      <FootStep slug={slug} step={prev} unit={unit} dir="prev" />
      <FootStep slug={slug} step={next} unit={unit} dir="next" />
    </nav>
  );
}

/** Una de las dos tarjetas del pie (o el hueco que la reemplaza). */
function FootStep({
  slug,
  step,
  unit,
  dir,
}: {
  slug: string;
  step: ReadStep | null;
  unit: string;
  dir: "prev" | "next";
}) {
  const klass = dir === "prev" ? css.prev : css.next;
  if (isGroupStep(step)) {
    const href = groupHref(step);
    if (!href) return <span />;
    return (
      <Link className={klass} data-dir={dir} to={href}>
        <span className={css.dir}>
          {dir === "prev" ? "← Anterior: ejercicios" : "Siguiente: ejercicios →"}
        </span>
        <span className={css.dirTitle}>
          {step.label} · {groupProgressLabel(step)}
        </span>
      </Link>
    );
  }
  if (!step) return <span />;
  const cross = step.division;
  return (
    <Link className={klass} data-dir={dir} to={routes.page(slug, step.page.slug)}>
      <span className={css.dir}>
        {dir === "prev"
          ? cross
            ? `← ${cap(unit)} anterior: ${cross.short}`
            : "← Anterior"
          : cross
            ? `${cap(unit)} siguiente: ${cross.short} →`
            : "Siguiente →"}
      </span>
      <span className={css.dirTitle}>{step.page.title}</span>
    </Link>
  );
}

export default PageFrame;
