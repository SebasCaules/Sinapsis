/**
 * Lector de una página del wiki (regiones 09 y 10): hoja de 840 con la barra de
 * la división, la prosa y la columna de 248 (índice de la página y apuntes). Es
 * la vista más pesada del shell: se carga en diferido.
 *
 * Los ids de los encabezados los pone el compilador (`Page.headings[].id`, con
 * `headingId` del contrato) y el plugin de rehype los repite tal cual: el índice
 * de la página no necesita leer el DOM para saber a dónde apunta.
 *
 * El recorrido es el del baseline (`neighborsOf`, reader.js:791-824): la lectura
 * NO se corta al final de la división —el vecino es la primera página de la
 * división siguiente, y se lo dice— y una página fuera de la secuencia (una
 * fuente) cae al orden de lectura global en vez de quedarse sin vecinos.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigationType, useParams } from "react-router-dom";
import { PAGE_TYPE_META, plural, routes, type PageHeading, type PageMeta } from "@sinapsis/contract";
import { Dialog, Icon, UiIcon, useToast } from "@/components/platform";
import { useSubjectCtx } from "../context";
import { recordActivity, setLastRead } from "../activity";
import { Markdown } from "../markdown/Markdown";
import { MathText } from "../components/MathText";
import { ErrorCard, SheetSkeleton } from "../components/States";
import type { DivisionNode, SubjectModel } from "../model";
import {
  useDeleteNote,
  usePage,
  useSaveNote,
  useStudyState,
  useToggleBookmark,
  useToggleStudied,
} from "../useSubject";
import css from "./ReaderView.module.css";

/**
 * A partir de acá la columna lateral cabe al lado de la hoja. Por debajo no
 * desaparece (N0-36): se vuelve un panel deslizante que abre el botón «PANEL»,
 * porque el índice de la página y los apuntes tienen que seguir accesibles.
 */
const WIDE = "(min-width: 1280px)";

/**
 * Franja en la que la columna le roba ancho a la lectura (§ lector-10). El
 * baseline arranca PLEGADO entre 1081 y 1366 px por la misma razón
 * (`railDefaultOpen`, reader.js:855-860): ahí la hoja baja de 700 px y las
 * fórmulas largas dejan de entrar. Es solo el valor INICIAL: en cuanto el lector
 * elige, manda su elección, que se recuerda.
 */
const SIDE_AUTO_MIN = 1280;
const SIDE_AUTO_MAX = 1400;
/** Preferencia del panel lateral, como el `pe.railOpen` del baseline. */
const SIDE_KEY = "sinapsis.reader.side";

/**
 * Un encabezado del wiki puede traer wikilinks: el índice muestra la ETIQUETA,
 * no el marcado. `h.text` se deja INTACTO porque de él sale `h.id` y es lo que
 * el autor escribe en `[[pagina#ancla]]` (N0-22): esto es solo presentación.
 * La matemática en línea la compone `MathText`, igual que en el catálogo.
 */
const WIKILINK_EN_TITULO = /\[\[([^\]\n|]+)(?:\|((?:[^\]\n]|\](?!\]))+?))?\]\]/g;
export const tocLabel = (text: string): string =>
  text.replace(WIKILINK_EN_TITULO, (_, destino: string, etiqueta?: string) =>
    (etiqueta ?? destino).trim(),
  );

function useWideViewport(): boolean {
  const [wide, setWide] = useState(() =>
    typeof window === "undefined" ? true : window.matchMedia(WIDE).matches,
  );
  useEffect(() => {
    const query = window.matchMedia(WIDE);
    const onChange = () => setWide(query.matches);
    query.addEventListener("change", onChange);
    onChange();
    return () => query.removeEventListener("change", onChange);
  }, []);
  return wide;
}

/** Preferencia guardada del panel (null si el lector todavía no eligió). */
function storedSide(): boolean | null {
  try {
    const raw = localStorage.getItem(SIDE_KEY);
    return raw === null ? null : raw === "true";
  } catch {
    return null;
  }
}

function rememberSide(open: boolean): void {
  try {
    localStorage.setItem(SIDE_KEY, String(open));
  } catch {
    /* sin almacenamiento: la elección vale para esta sesión */
  }
}

/** Estado inicial del panel en pantalla ancha: elección guardada o la franja. */
function defaultSide(): boolean {
  const saved = storedSide();
  if (saved !== null) return saved;
  const w = typeof window === "undefined" ? 0 : window.innerWidth;
  return !(w >= SIDE_AUTO_MIN && w < SIDE_AUTO_MAX);
}

/**
 * Vecino de lectura. `division` no es null cuando el paso CRUZA de división: es
 * la división a la que se entra, y el rótulo lo dice («← Unidad anterior: U3»).
 */
export interface Neighbor {
  page: PageMeta;
  division: DivisionNode | null;
}

/**
 * Orden de lectura GLOBAL (`A.READING_ORDER` del baseline, core.js:284-289):
 * las divisiones en orden y, dentro de cada una, su secuencia y después sus
 * fuentes. Es el respaldo de las páginas que no están en ninguna secuencia —las
 * 112 fuentes de Proba—, que sin él quedan sin «Anterior» ni «Siguiente».
 *
 * Las páginas del tipo reservado `meta` (índice y registro del wiki) quedan
 * afuera de todo, como en el baseline (`CONTENT`, core.js:266).
 */
export function readingOrder(model: SubjectModel): PageMeta[] {
  const out: PageMeta[] = [];
  for (const node of model.visibleDivisions) {
    for (const page of model.sequence(node.key)) out.push(page);
    for (const page of model.sources(node.key)) if (page.type !== PAGE_TYPE_META) out.push(page);
  }
  return out;
}

/**
 * Vecinos de lectura de una página, con cruce de división en los extremos.
 * Devuelve `{prev, next}` ya resueltos: dentro de la secuencia de la división,
 * o —si la página no está en ninguna— sobre el orden global.
 */
export function neighborsOf(
  model: SubjectModel,
  order: PageMeta[],
  pageSlug: string,
): { prev: Neighbor | null; next: Neighbor | null } {
  const page = model.bySlug.get(pageSlug);
  if (!page) return { prev: null, next: null };
  const key = model.divisionOf(page);
  /* El cajón sintético («Transversales», «Otras») no es un recorrido: sus
     páginas caen al orden global, como en el baseline (`neighborsOf` solo mira
     los pasos de la unidad cuando es una unidad DEL PROGRAMA). */
  const inSequence = !model.division(key)?.synthetic;
  const at = inSequence ? model.positions(key).get(pageSlug) : undefined;

  /* Primera o última página de la división vecina, con el cruce rotulado. */
  const edge = (dir: -1 | 1): Neighbor | null => {
    const node = model.adjacentDivision(key, dir);
    if (!node) return null;
    const seq = model.sequence(node.key);
    const target = dir === -1 ? seq[seq.length - 1] : seq[0];
    return target ? { page: target, division: node } : null;
  };

  if (at !== undefined) {
    const seq = model.sequence(key);
    const before = seq[at - 2];
    const after = seq[at];
    return {
      prev: before ? { page: before, division: null } : edge(-1),
      next: after ? { page: after, division: null } : edge(1),
    };
  }

  /* Fuera de la secuencia (una fuente, o el cajón transversal): orden global.
     Si el vecino pertenece a OTRA división recorrible, se entra por su primera
     o su última página, no por la fuente suelta que quedó al lado. */
  const i = order.findIndex((p) => p.slug === pageSlug);
  if (i < 0) return { prev: null, next: null };
  const cross = (target: PageMeta | undefined, which: "first" | "last"): Neighbor | null => {
    if (!target) return null;
    const other = model.divisionOf(target);
    if (other === key) return { page: target, division: null };
    const node = model.division(other);
    if (!node || node.synthetic) return { page: target, division: null };
    const seq = model.sequence(other);
    const entry = which === "first" ? seq[0] : seq[seq.length - 1];
    return { page: entry ?? target, division: node };
  };
  return { prev: cross(order[i - 1], "last"), next: cross(order[i + 1], "first") };
}

export function ReaderView() {
  const { slug, model, runtime } = useSubjectCtx();
  const { page: pageSlug = "" } = useParams();
  const location = useLocation();
  const navigationType = useNavigationType();
  const query = usePage(slug, pageSlug);
  const toggleStudied = useToggleStudied(slug);
  const { bookmarks } = useStudyState(slug);
  const toggleBookmark = useToggleBookmark(slug);
  const { toast } = useToast();
  const wide = useWideViewport();
  /* Ancho: la columna está y se puede plegar, con la elección recordada (§
     lector-10). Angosto: es un panel que hay que abrir, y por lo tanto arranca
     cerrado para no tapar la lectura. */
  const [sideOpen, setSideOpen] = useState(() => (wide ? defaultSide() : false));
  useEffect(() => setSideOpen(wide ? defaultSide() : false), [wide]);
  const toggleSide = useCallback(() => {
    setSideOpen((open) => {
      rememberSide(!open);
      return !open;
    });
  }, []);
  const [activeHeading, setActiveHeading] = useState<string | null>(null);
  const sheetRef = useRef<HTMLElement>(null);

  const detail = query.data;
  const page = detail?.page;
  const meta = model.bySlug.get(pageSlug);
  const divisionKey = meta ? model.divisionOf(meta) : (page?.division ?? null);
  const division = divisionKey ? model.division(divisionKey) : undefined;
  const sequence = divisionKey ? model.sequence(divisionKey) : [];
  const position = model.positionOf(pageSlug);
  const order = useMemo(() => readingOrder(model), [model]);
  const { prev, next } = useMemo(
    () => neighborsOf(model, order, pageSlug),
    [model, order, pageSlug],
  );
  /* Callback estable: el pipeline de markdown se rearma solo si cambia la materia. */
  const exists = useCallback((target: string) => model.bySlug.has(target), [model]);
  const headings = useMemo(
    () => (page?.headings ?? []).filter((h) => h.level === 2 || h.level === 3),
    [page?.headings],
  );

  /**
   * Al cambiar de página: arriba de todo, salvo que la URL traiga un ancla.
   *
   * Volver con Atrás es la excepción (§ lector-03): ahí la posición la repone el
   * armazón, que la guarda por entrada del historial, y subir a cero acá borraba
   * esa restauración en una página de 4000 px.
   */
  useEffect(() => {
    if (!detail) return;
    const scroller = document.querySelector<HTMLElement>("main[data-subject-main]");
    const hash = decodeURIComponent(location.hash.replace(/^#/, ""));
    const target = hash ? document.getElementById(hash) : null;
    if (target) {
      scrollMainTo(target, "auto");
      return;
    }
    if (navigationType === "POP") return;
    scroller?.scrollTo({ top: 0 });
  }, [detail, pageSlug, location.hash, navigationType]);

  /**
   * Última página leída y día de actividad (§ lector-11), como el
   * `A.setLastRead(slug)` del final del render del baseline (reader.js:995): es
   * lo que el inicio usa para «Continuar leyendo» y para la racha. Las páginas
   * del tipo reservado `meta` no cuentan como lectura.
   */
  useEffect(() => {
    if (!detail || !page || page.type === PAGE_TYPE_META) return;
    setLastRead(slug, pageSlug);
    recordActivity(slug);
  }, [detail, page, slug, pageSlug]);

  /**
   * Figuras interactivas (N0-42). El markdown deja el hueco
   * (`figure.figura > .fig-host`) con un marco de reserva; si la materia trae un
   * bundle de figuras YA cargado, se vacía el hueco y las dibuja el runtime.
   * Sin bundle no se toca nada: se lee el epígrafe con su marco, como siempre.
   *
   * El handle cambia de identidad seguido (migas, bundles): se lo lee de una ref
   * para que este efecto dependa solo de la página y de si hay figuras.
   */
  const runtimeRef = useRef(runtime);
  runtimeRef.current = runtime;
  const hasFigures = runtime.figures;

  useEffect(() => {
    const article = sheetRef.current;
    if (!article || !detail || !hasFigures) return;
    /* `mountFigures` vacía el hueco antes de dibujar (y pone `.fig-missing` si
       la figura no está registrada): el marco de reserva se va solo. */
    if (!article.querySelector("figure[data-fig] > .fig-host")) return;
    const rt = runtimeRef.current;
    rt.mountFigures(article);
    /* Cambio de tema: las figuras RESUELVEN los colores al dibujar (`cssVar`
       devuelve el valor del token, no la referencia), así que un tema nuevo las
       deja con la paleta vieja hasta que se vuelva a entrar en la página.
       Volver a montarlas las redibuja conservando su estado interactivo, que el
       motor guarda en el hueco y no en los nodos. */
    const offTheme = rt.onThemeChange(() => {
      if (article.isConnected) rt.mountFigures(article);
    });
    return () => {
      offTheme();
      rt.unmountFigures(article);
    };
  }, [detail, pageSlug, hasFigures]);

  /* Scroll-spy del índice de la página. */
  useEffect(() => {
    if (!headings.length) return;
    const root = document.querySelector<HTMLElement>("main[data-subject-main]");
    const targets = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!targets.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const first = visible[0];
        if (first) setActiveHeading(first.target.id);
      },
      { root, rootMargin: "-72px 0px -68% 0px", threshold: 0 },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings, detail]);

  /* El error manda sobre la carga: un 404 no puede quedarse en el esqueleto. */
  if (query.isError || (!query.isPending && (!detail || !page))) {
    return <ErrorCard error={query.error} notFound="Esta página no existe en la materia" subject={slug} />;
  }
  if (query.isPending || !detail || !page) return <SheetSkeleton />;

  const studied = detail.studied;
  const color = division?.color ?? "var(--primary)";
  const unit = model.config.division.singular.toLowerCase();
  const bookmarked = bookmarks.has(pageSlug);
  /* El aviso sale del guardado que SÍ ocurrió: el camino de error ya tiene el
     suyo («No se pudo guardar»), en `useSubject`. */
  const onToggleStudied = () => {
    const on = !studied;
    toggleStudied.mutate(
      { page: pageSlug, studied: on },
      { onSuccess: () => toast(on ? "Marcada como estudiada" : "Quitada de estudiadas", on ? "good" : "info") },
    );
  };
  const onToggleBookmark = () => {
    const on = !bookmarked;
    toggleBookmark.mutate(
      { page: pageSlug, on },
      { onSuccess: () => toast(on ? "Guardada en favoritos" : "Quitada de favoritos", on ? "good" : "info") },
    );
  };

  /* El cajón transversal no es un recorrido y el baseline no le dibuja la barra
     (`is-bare`, reader.js:432-445): queda la línea de identidad y nada más. Su
     navegación viene del orden global, al pie. */
  const showStrip = sequence.length > 1 && !division?.synthetic;

  return (
    <div className={css.layout} style={{ ["--ucol" as string]: color }}>
      <div className={css.column}>
        <article className={css.sheet} ref={sheetRef}>
          <header className={css.sheetHead}>
            {division ? (
              <Link className={css.divisionChip} to={routes.division(slug, division.key)}>
                <span className={css.divisionDot} aria-hidden="true" />
                {division.label}
              </Link>
            ) : null}
            <span className={css.typeChip}>{model.typeLabel(page.type).toUpperCase()}</span>
            {/* Fuera de la secuencia se describe el universo, como el baseline
                («11 páginas + 3 colecciones», reader.js:466-476), en vez de
                decir lo que la página NO es (§ lector-20). En el cajón
                transversal no hay posición que contar. */}
            {division?.synthetic ? null : position ? (
              <span className={css.position}>
                página {position} de {sequence.length}
              </span>
            ) : sequence.length ? (
              <span className={css.position}>
                {sequence.length} {plural(sequence.length, "página", "páginas")} en la {unit}
              </span>
            ) : null}
            <span className={css.headSpacer} />
            {/* Las acciones de la página viven en la línea de identidad de la
                hoja (pedido del usuario): antes iban en una fila propia arriba
                y acá había «¿Qué sigue?» y «+N fuentes», que el usuario sacó.
                Las fuentes de la división se leen en su portada. */}
            <StudyActions
              studied={studied}
              onToggle={onToggleStudied}
              bookmarked={bookmarked}
              onToggleBookmark={onToggleBookmark}
              inline
            />
          </header>

          {showStrip ? (
            <nav className={css.segments} aria-label={`Páginas de la ${unit}`}>
              {/* Anterior y siguiente flanquean la barra (pedido del usuario): a
                  secas, sin títulos, que van en el pie. Lo único que se agrega
                  es el cruce de división, que cambia de destino y hay que
                  decirlo («Siguiente unidad →»). */}
              <div className={css.segmentsRow}>
                <StripLink side="prev" slug={slug} step={prev} unit={unit} />
                <div className={css.segmentsTrack}>
                {/* Sin `title`: el segmento lo cubre la tarjeta de vista previa
                    del shell (N0-50), que muestra el título, el resumen y la
                    posición «N de M»; el tooltip nativo dibujaría dos a la vez.
                    El nombre accesible lleva la posición (§ lector-19): con
                    lector de pantalla la pista era una lista de títulos sin
                    orden ni total. */}
                {sequence.map((p, i) => (
                  <Link
                    key={p.slug}
                    to={routes.page(slug, p.slug)}
                    className={css.segment}
                    data-seg={i + 1}
                    data-state={p.slug === pageSlug ? "current" : model.studied.has(p.slug) ? "studied" : "todo"}
                    aria-label={`${i + 1} de ${sequence.length}. ${p.title}`}
                    aria-current={p.slug === pageSlug ? "page" : undefined}
                  />
                ))}
              </div>
                <StripLink side="next" slug={slug} step={next} unit={unit} />
              </div>
            </nav>
          ) : null}

          <h1 className={css.title}>{page.title}</h1>

          <Markdown body={page.body} subject={slug} exists={exists} />

          {/* El mismo par de acciones al terminar de leer: nadie tiene que volver
              arriba para marcar la página o pasar a la siguiente. */}
          <footer className={css.foot}>
            <PrevNext slug={slug} prev={prev} next={next} unit={unit} />
            <StudyActions
              studied={studied}
              onToggle={onToggleStudied}
              bookmarked={bookmarked}
              onToggleBookmark={onToggleBookmark}
              foot
            />
          </footer>
        </article>
      </div>

      {sideOpen ? (
        <div
          id="reader-side"
          className={wide ? css.side : `${css.side} ${css.sideFloating}`}
          data-floating={wide ? undefined : "true"}
        >
          <section className={css.card} aria-labelledby="reader-toc">
            <div className={css.cardHead} id="reader-toc">
              <UiIcon name="menu" size={13} />
              EN ESTA PÁGINA
            </div>
            {headings.length ? (
              <div className={css.toc}>
                {headings.map((h: PageHeading, i: number) => (
                  <a
                    /* Dos encabezados distintos pueden dar el MISMO id —el
                       compilador es el dueño del algoritmo y no desambigua
                       (N0-22)—: `formulario-maestro` tiene «Independencia» dos
                       veces. El ancla se conserva tal cual; lo que se
                       desambigua es solo la clave de React, con el índice. */
                    key={`${i}-${h.id}`}
                    href={`#${h.id}`}
                    className={h.level === 3 ? css.tocSub : css.tocItem}
                    data-active={activeHeading === h.id ? "true" : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById(h.id);
                      if (el) scrollMainTo(el, "smooth");
                      history.replaceState(null, "", `#${h.id}`);
                    }}
                  >
                    <MathText text={tocLabel(h.text)} />
                  </a>
                ))}
              </div>
            ) : (
              <p className={css.cardEmpty}>Esta página no tiene secciones.</p>
            )}
          </section>

          <NotesCard slug={slug} page={pageSlug} exists={exists} />

        </div>
      ) : null}

      <button
        type="button"
        className={css.sideTab}
        onClick={toggleSide}
        aria-expanded={sideOpen}
        aria-controls={sideOpen ? "reader-side" : undefined}
        aria-label={sideOpen ? "Ocultar el panel de la página" : "Mostrar el panel de la página"}
        title={sideOpen ? "Ocultar el panel" : "Mostrar el panel"}
      >
        PANEL
      </button>
    </div>
  );
}

/** «Marcar estudiado / Estudiada» y «A favoritos / En favoritos». Va arriba y al pie. */
function StudyActions({
  studied,
  onToggle,
  bookmarked,
  onToggleBookmark,
  foot = false,
  inline = false,
}: {
  studied: boolean;
  onToggle: () => void;
  bookmarked: boolean;
  onToggleBookmark: () => void;
  foot?: boolean;
  /** Dentro de la línea de identidad de la hoja: chips más bajos, sin margen. */
  inline?: boolean;
}) {
  return (
    <div className={foot ? `${css.chips} ${css.chipsFoot}` : inline ? `${css.chips} ${css.chipsInline}` : css.chips}>
      <button
        type="button"
        className={css.chipButton}
        data-on={studied ? "true" : undefined}
        onClick={onToggle}
        aria-pressed={studied}
      >
        <UiIcon name="check" size={13} />
        {studied ? "Estudiada" : "Marcar estudiado"}
      </button>
      {/* «Guardar» no decía dónde: el destino es «Favoritos», el mismo nombre
          que tiene la vista de «Lo mío» a la que va a parar la página (U17). */}
      <button
        type="button"
        className={css.chipSave}
        data-on={bookmarked ? "true" : undefined}
        onClick={onToggleBookmark}
        aria-pressed={bookmarked}
        aria-label="Guardar en favoritos"
        title={bookmarked ? "Quitar de favoritos" : "Guardar en favoritos"}
      >
        <UiIcon name="bookmark" size={13} />
        {bookmarked ? "En favoritos" : "A favoritos"}
      </button>
    </div>
  );
}

/** Primera letra en mayúscula («unidad» → «Unidad»). */
function cap(text: string): string {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
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
  step: Neighbor | null;
  unit: string;
}) {
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
  prev: Neighbor | null;
  next: Neighbor | null;
  /** Nombre de la división de la materia, en minúscula ("unidad", "semana"). */
  unit: string;
}) {
  if (!prev && !next) return null;
  return (
    <nav className={`${css.prevNext} ${css.prevNextFoot}`} aria-label="Páginas vecinas">
      {prev ? (
        <Link className={css.prev} data-dir="prev" to={routes.page(slug, prev.page.slug)}>
          <span className={css.dir}>
            {prev.division ? `← ${cap(unit)} anterior: ${prev.division.short}` : "← Anterior"}
          </span>
          <span className={css.dirTitle}>{prev.page.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link className={css.next} data-dir="next" to={routes.page(slug, next.page.slug)}>
          <span className={css.dir}>
            {next.division ? `${cap(unit)} siguiente: ${next.division.short} →` : "Siguiente →"}
          </span>
          <span className={css.dirTitle}>{next.page.title}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}

/**
 * Sello del apunte. La HORA sola miente cuando el apunte es de otro día
 * («Guardado · 23:22» en algo escrito hace tres días, § lector-02): fuera de
 * hoy se antepone el día, con el mismo criterio que la lista de «Mis apuntes».
 */
export function savedAt(value: string, now = new Date()): string {
  const at = Date.parse(value);
  if (Number.isNaN(at)) return "Guardado";
  const date = new Date(at);
  const hora = date.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" });
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  if (sameDay) return `Guardado · ${hora}`;
  return `Guardado · ${date.toLocaleDateString("es", { day: "numeric", month: "short" })} · ${hora}`;
}

const NOTE_ROWS_MIN = 6;
const NOTE_ROWS_MAX = 20;
/** Rebote del guardado automático mientras se escribe. */
const NOTE_DEBOUNCE = 800;

/** Estado del guardado del apunte: manda sobre el rótulo de la cabecera. */
type NoteStatus = "idle" | "saving" | "error";

/**
 * Tarjeta «APUNTES»: lo que el usuario escribe sobre ESTA página.
 *
 * El contrato de guardado es el de N0-35, y en este orden:
 *  1. Nunca se pierde nada: se guarda solo 800 ms después de la última tecla, y
 *     también al salir del campo, con ⌘S y con «Guardar apunte». Un guardado
 *     FALLIDO no da el texto por guardado: el borrador sigue sucio, la tarjeta
 *     dice «No se pudo guardar» y ofrece «Reintentar» (bug 1). Mientras haya
 *     cambios locales, el valor del servidor nunca los pisa.
 *  2. La composición se pide: «Escribir» y «Vista» son dos botones, como en el
 *     baseline (reader.js:962-963), y no dependen de dónde esté el foco (§
 *     lector-03 de la tarjeta). La vista es un `div`, no un botón: adentro hay
 *     wikilinks, y un enlace dentro de un botón no es marcado válido ni se puede
 *     usar (§ lector-04).
 *  3. Vaciar el campo BORRA el apunte —con confirmación si se pide desde
 *     «Borrar»—: no queda una entrada en blanco colgando en «Mis apuntes».
 */
function NotesCard({ slug, page, exists }: { slug: string; page: string; exists: (target: string) => boolean }) {
  const { notes } = useStudyState(slug);
  const stored = notes.get(page);
  const save = useSaveNote(slug);
  const remove = useDeleteNote(slug);

  const [draft, setDraft] = useState(stored?.body ?? "");
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<NoteStatus>("idle");
  const [mode, setMode] = useState<"edit" | "view">("edit");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef(0);
  const dirtyRef = useRef(false);

  /* Cuando la consulta responde (o el servidor devuelve la fecha real) se repone
     el texto, pero SOLO si no hay nada escrito sin guardar: un guardado fallido
     deja `dirtyRef` en true justamente para que esto no vacíe el campo. */
  useEffect(() => {
    if (dirtyRef.current) return;
    setDraft(stored?.body ?? "");
  }, [stored?.body, stored?.updatedAt]);

  /* El mapa de apuntes es de la materia entera, así que `commit` puede volcar
     el de CUALQUIER página: es lo que necesita el cambio de página, que tiene
     que guardar el apunte de la que se está dejando. */
  const notesRef = useRef(notes);
  notesRef.current = notes;

  const commit = useCallback(
    (body: string, target: string) => {
      window.clearTimeout(timerRef.current);
      timerRef.current = 0;
      const previous = notesRef.current.get(target);
      const settled = () => {
        dirtyRef.current = false;
        setDirty(false);
        setStatus("idle");
      };
      const failed = () => setStatus("error");

      const trimmed = body.trim();
      if (!trimmed) {
        if (!previous) {
          settled();
          return;
        }
        setStatus("saving");
        remove.mutate({ page: target }, { onSuccess: settled, onError: failed });
        return;
      }
      if (previous?.body === body) {
        settled();
        return;
      }
      setStatus("saving");
      save.mutate({ page: target, body }, { onSuccess: settled, onError: failed });
    },
    [remove, save],
  );

  const draftRef = useRef(draft);
  draftRef.current = draft;
  const commitRef = useRef(commit);
  commitRef.current = commit;

  /**
   * Cambiar de página cambia de apunte. La limpieza de este efecto corre ANTES
   * de que el cuerpo reponga el borrador de la página nueva: ahí se vuelca lo
   * pendiente de la que se deja y se apaga el temporizador (bug 8). También es
   * lo que salva el apunte al desmontarse el lector.
   */
  useEffect(() => {
    setDraft(notesRef.current.get(page)?.body ?? "");
    setDirty(false);
    dirtyRef.current = false;
    setStatus("idle");
    setMode("edit");
    /* `commitRef` ya apunta al commit de ESTA página; se captura para que la
       limpieza no use el de la página siguiente. */
    const flush = commitRef.current;
    const leaving = page;
    return () => {
      window.clearTimeout(timerRef.current);
      timerRef.current = 0;
      if (dirtyRef.current) flush(draftRef.current, leaving);
    };
  }, [page]);

  const onChange = (value: string) => {
    setDraft(value);
    setDirty(true);
    dirtyRef.current = true;
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => commit(value, page), NOTE_DEBOUNCE);
  };

  const write = () => {
    setMode("edit");
    window.requestAnimationFrame(() => areaRef.current?.focus());
  };

  const rows = Math.min(NOTE_ROWS_MAX, Math.max(NOTE_ROWS_MIN, draft.split("\n").length + 1));
  const chars = draft.length;

  return (
    <section className={css.card} aria-labelledby="reader-notes">
      <div className={css.cardHead} id="reader-notes">
        <Icon name="pencil" size={13} />
        APUNTES
        {status === "error" ? (
          <span className={css.noteState} data-state="error">
            No se pudo guardar
            <button type="button" className={css.noteRetry} onClick={() => commit(draft, page)}>
              Reintentar
            </button>
          </span>
        ) : (
          <span className={css.noteState} data-state={dirty ? "dirty" : undefined}>
            {dirty ? "Sin guardar" : stored ? savedAt(stored.updatedAt) : ""}
          </span>
        )}
      </div>

      {/* Dos modos explícitos, como el baseline: se puede ver el markdown
          compuesto sin dejar de escribir, y volver a la fuente sin tocar nada. */}
      <div className={css.noteTabs} role="group" aria-label="Modo del apunte">
        <button
          type="button"
          className={css.noteTab}
          data-on={mode === "edit" ? "true" : undefined}
          aria-pressed={mode === "edit"}
          onClick={write}
        >
          Escribir
        </button>
        <button
          type="button"
          className={css.noteTab}
          data-on={mode === "view" ? "true" : undefined}
          aria-pressed={mode === "view"}
          onClick={() => {
            if (dirtyRef.current) commit(draft, page);
            setMode("view");
          }}
        >
          Vista
        </button>
      </div>

      {mode === "view" ? (
        draft.trim() ? (
          /* Un `div`, no un botón: adentro hay wikilinks (§ lector-04). Se
             vuelve a escribir con la pestaña o con un doble clic. */
          <div className={css.notePreview} onDoubleClick={write}>
            <Markdown body={draft} subject={slug} exists={exists} />
          </div>
        ) : (
          <p className={css.noteEmpty}>Sin apuntes todavía.</p>
        )
      ) : (
        <textarea
          ref={areaRef}
          className={css.noteArea}
          value={draft}
          rows={rows}
          placeholder="Lo que quiera recordar de esta página…"
          aria-label="Apunte de esta página"
          aria-keyshortcuts="Control+S"
          onChange={(event) => onChange(event.target.value)}
          onBlur={() => {
            if (dirtyRef.current) commit(draft, page);
          }}
          onKeyDown={(event) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
              event.preventDefault();
              commit(draft, page);
            }
          }}
        />
      )}

      <div className={css.noteFoot}>
        <button
          type="button"
          className={css.noteSave}
          onClick={() => commit(draft, page)}
          disabled={!dirty && status !== "error"}
          aria-keyshortcuts="Control+S"
          title="Guardar el apunte (⌘S)"
        >
          Guardar apunte
        </button>
        {/* El contador del baseline: dice cuánto se escribió sin tener que
            contar renglones (reader.js:1035). */}
        <span className={css.noteCount}>{chars ? `${chars} car.` : ""}</span>
        {stored ? (
          <button
            type="button"
            className={css.noteDelete}
            onClick={() => setConfirmDelete(true)}
            aria-label="Borrar el apunte de esta página"
          >
            Borrar
          </button>
        ) : null}
      </div>

      {/* Desde donde uno acaba de escribir hay un paso a la colección entera
          (reader.js:969), que antes solo se alcanzaba por el rail. */}
      <Link className={css.noteAll} to={routes.notes(slug)}>
        <Icon name="notebook" size={13} />
        Todos mis apuntes
      </Link>

      {/* Borrar un apunte no tiene deshacer: se pregunta antes (N0-35). */}
      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        eyebrow="APUNTES"
        title="¿Borrar el apunte de esta página?"
        width={440}
        footer={
          <>
            <button type="button" className={css.dialogCancel} onClick={() => setConfirmDelete(false)}>
              Conservarlo
            </button>
            <button
              type="button"
              className={css.dialogDelete}
              onClick={() => {
                setConfirmDelete(false);
                setDraft("");
                dirtyRef.current = true;
                setDirty(true);
                commit("", page);
              }}
            >
              Borrar el apunte
            </button>
          </>
        }
      >
        <p className={css.dialogText}>
          Lo escrito se pierde y la página deja de aparecer en «Mis apuntes». No se puede deshacer.
        </p>
      </Dialog>
    </section>
  );
}

export default ReaderView;

/**
 * Desplaza SOLO el contenedor de la materia (`main[data-subject-main]`) hasta
 * `el`. `scrollIntoView` no sirve acá: también desplaza a los ancestros con
 * `overflow: hidden` (la cabecera y el rail se iban de la pantalla al tocar un
 * enlace del índice de la página y todo quedaba «elevado» hasta recargar).
 */
function scrollMainTo(el: HTMLElement, behavior: ScrollBehavior): void {
  const main = el.closest<HTMLElement>("main[data-subject-main]") ?? document.querySelector<HTMLElement>("main[data-subject-main]");
  if (!main) {
    el.scrollIntoView({ block: "start", behavior });
    return;
  }
  const top = el.getBoundingClientRect().top - main.getBoundingClientRect().top + main.scrollTop - 12;
  main.scrollTo({ top: Math.max(0, top), behavior });
}
