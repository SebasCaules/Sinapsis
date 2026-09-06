/**
 * PageTip — tarjeta flotante de vista previa de página (port de `tips.js` del
 * baseline de Proba, N0-50).
 *
 * UNA sola tarjeta, montada una vez en `SubjectShell`, que cubre TODO el shell
 * por delegación sobre su nodo raíz: wikilinks del lector, «Enlazan aquí»,
 * fuentes, anterior/siguiente, segmentos de la barra de unidad, panel índice,
 * inicio, catálogo, grafo, plan, kits, apuntes, favoritos y las vistas de
 * herramientas (que enlazan a la manera del baseline, `#/p/<slug>`). Ninguna de
 * esas piezas sabe que la tarjeta existe: solo tienen que enlazar a la página.
 *
 * Qué muestra (mismo orden que el baseline):
 *   título · «U3 · Concepto» con el punto de color de la división · resumen ·
 *   «§ Sección» + su primer párrafo cuando el enlace trae ancla · «N palabras ·
 *   leída ✓».
 *
 * De dónde salen los datos:
 *   - Título, tipo, división, palabras y resumen: del MODELO, que ya está en
 *     memoria (`PageMeta` de `GET /api/subjects/:slug`). Con eso la tarjeta se
 *     dibuja sin pedir nada.
 *   - El cuerpo (`PageDetail.page.body` + `headings`) SOLO se pide cuando hace
 *     falta: hay un ancla que resolver, o la página no tiene `resumen` y hay que
 *     caer al primer párrafo. Se pide por la misma caché del lector
 *     (`qk.page`), así que abrir después esa página ya no vuelve a la red. La
 *     tarjeta aparece primero con lo que hay y se completa al llegar el cuerpo.
 *
 * Comportamiento: retraso de 350 ms al entrar; cambiar de un enlace a otro
 * dentro de una ventana de 250 ms no vuelve a esperar; se cierra con Escape, con
 * un clic, al navegar y al desplazarse de verdad el ancla (con el foco puesto se
 * reubica en vez de cerrarse, porque el propio Tab desplaza la página); en
 * pantallas táctiles aparece al mantener pulsado 450 ms.
 */
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import type { PageHeading, PageMeta } from "@sinapsis/contract";
import { api, qk } from "@/lib/api";
import type { SubjectModel } from "../model";
import { MathText } from "./MathText";
import { leadOf, sectionOf, targetOf, type TipTarget } from "./page-tip";
import css from "./PageTip.module.css";

/** Id del nodo flotante: es el valor de `aria-describedby` del enlace. */
export const PAGE_TIP_ID = "pageTip";

const OPEN_DELAY = 350;
/** Ventana para cambiar de enlace sin volver a esperar el retraso. */
const SWITCH_MS = 250;
/** «Mantener pulsado» en pantallas táctiles. */
const HOLD_MS = 450;
/** Deriva del dedo que cancela el pulsado. */
const MOVE_TOL = 10;
/** Margen mínimo contra el borde del viewport. */
const PAD = 8;
/** Debajo de este ancho la tarjeta va centrada y ocupa casi todo. */
const MOBILE_W = 560;
/** El cuerpo de una página no cambia entre vistas previas seguidas. */
const BODY_STALE_MS = 5 * 60_000;

/* Los módulos de CSS se tipan con una firma de índice (`string | undefined`) y
   `classList.toggle("")` es un error de DOM: las dos clases que se conmutan a
   mano se resuelven una sola vez, con su nombre literal como respaldo. */
const MOBILE_CLASS = css.mobile ?? "mobile";
const ABOVE_CLASS = css.above ?? "above";

interface Shown {
  host: HTMLElement;
  slug: string;
  anchor: string;
}

/** Cuerpo ya traído de una página (solo cuando hizo falta). */
interface Body {
  slug: string;
  body: string;
  headings: readonly PageHeading[];
}

export interface PageTipProps {
  model: SubjectModel;
  /** Slug de la materia: arma el selector de los enlaces que la tarjeta cubre. */
  subject: string;
  /** Nodo raíz del shell: es donde se delegan puntero, foco y tacto. */
  rootRef: RefObject<HTMLElement | null>;
  /**
   * Página abierta en el lector, si la hay. Un enlace a otra página de la MISMA
   * división muestra además su posición («4 de 12 · sin leer»), que es lo que
   * decía el tooltip mini de la barra de unidad del baseline.
   */
  currentPage: string | null;
}

function xyOf(node: Element | null): { x: number; y: number } | null {
  if (!node || !node.isConnected) return null;
  const r = node.getBoundingClientRect();
  return { x: r.left, y: r.top };
}

export function PageTip({ model, subject, rootRef, currentPage }: PageTipProps) {
  const queryClient = useQueryClient();
  const location = useLocation();
  const [shown, setShown] = useState<Shown | null>(null);
  const [body, setBody] = useState<Body | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  /* El modelo cambia de identidad al marcar una página como estudiada; los
     manejadores se atan UNA vez y lo leen de la ref. */
  const modelRef = useRef(model);
  modelRef.current = model;
  const shownRef = useRef<Shown | null>(null);
  const pendingRef = useRef<HTMLElement | null>(null);
  const openTimer = useRef(0);
  const holdTimer = useRef(0);
  const lastHide = useRef(0);
  const viaFocus = useRef(false);
  const baseXY = useRef<{ x: number; y: number } | null>(null);
  const touchPt = useRef<{ x: number; y: number } | null>(null);
  const touchOpened = useRef(false);

  const hide = useCallback(() => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(holdTimer.current);
    pendingRef.current = null;
    touchPt.current = null;
    baseXY.current = null;
    if (shownRef.current) lastHide.current = Date.now();
    shownRef.current = null;
    setShown(null);
  }, []);

  const open = useCallback((target: TipTarget) => {
    const next: Shown = { host: target.el, slug: target.slug, anchor: target.anchor };
    shownRef.current = next;
    pendingRef.current = null;
    setShown(next);
  }, []);

  /** Pide la tarjeta con el retraso que corresponda (ninguno si venimos de otro enlace). */
  const request = useCallback(
    (target: TipTarget, fromFocus: boolean) => {
      viaFocus.current = fromFocus;
      baseXY.current = xyOf(target.el);
      if (shownRef.current?.host === target.el) return;
      window.clearTimeout(openTimer.current);
      pendingRef.current = target.el;
      const fast = shownRef.current !== null || Date.now() - lastHide.current < SWITCH_MS;
      if (fast) {
        open(target);
        return;
      }
      openTimer.current = window.setTimeout(() => {
        if (pendingRef.current === target.el) open(target);
      }, OPEN_DELAY);
    },
    [open],
  );

  /* ---------- delegación sobre el shell ----------------------------------- */

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    /** El enlace bajo el evento, solo si su página existe en la materia. */
    const hit = (node: EventTarget | null): TipTarget | null => {
      const target = targetOf(node, subject);
      if (!target || !modelRef.current.bySlug.has(target.slug)) return null;
      return target;
    };

    const onOver = (event: MouseEvent) => {
      const target = hit(event.target);
      if (target) request(target, false);
    };

    const onOut = (event: MouseEvent) => {
      if (!pendingRef.current && !shownRef.current) return;
      const from = hit(event.target);
      if (!from) return;
      const related = event.relatedTarget;
      const to = related instanceof Element ? targetOf(related, subject) : null;
      /* Seguimos dentro del mismo enlace (pasar de su texto a su icono, por
         ejemplo): la tarjeta no parpadea. */
      if (to && to.el === from.el) return;
      hide();
    };

    const onFocusIn = (event: FocusEvent) => {
      const target = hit(event.target);
      if (!target) {
        if (shownRef.current) hide();
        return;
      }
      request(target, true);
    };

    const onFocusOut = (event: FocusEvent) => {
      const target = hit(event.target);
      if (!target) return;
      if (target.el === shownRef.current?.host) hide();
      else if (target.el === pendingRef.current) {
        window.clearTimeout(openTimer.current);
        pendingRef.current = null;
      }
    };

    const onTouchStart = (event: TouchEvent) => {
      touchOpened.current = false;
      if (shownRef.current) hide();
      const target = hit(event.target);
      if (!target || event.touches.length !== 1) return;
      const touch = event.touches[0];
      if (!touch) return;
      viaFocus.current = false;
      touchPt.current = { x: touch.clientX, y: touch.clientY };
      window.clearTimeout(holdTimer.current);
      holdTimer.current = window.setTimeout(() => {
        touchOpened.current = true;
        baseXY.current = xyOf(target.el);
        open(target);
      }, HOLD_MS);
    };

    const onTouchMove = (event: TouchEvent) => {
      const start = touchPt.current;
      const touch = event.touches[0];
      if (!start || !touch) return;
      const dx = touch.clientX - start.x;
      const dy = touch.clientY - start.y;
      if (Math.sqrt(dx * dx + dy * dy) > MOVE_TOL) {
        window.clearTimeout(holdTimer.current);
        touchPt.current = null;
      }
    };

    const onTouchEnd = (event: TouchEvent) => {
      window.clearTimeout(holdTimer.current);
      touchPt.current = null;
      /* Si la tarjeta se abrió por pulsado largo, ese toque no navega. */
      if (touchOpened.current && event.cancelable) event.preventDefault();
      touchOpened.current = false;
    };

    const onTouchCancel = () => {
      window.clearTimeout(holdTimer.current);
      touchPt.current = null;
      touchOpened.current = false;
    };

    root.addEventListener("mouseover", onOver);
    root.addEventListener("mouseout", onOut);
    root.addEventListener("focusin", onFocusIn);
    root.addEventListener("focusout", onFocusOut);
    root.addEventListener("touchstart", onTouchStart, { passive: true });
    root.addEventListener("touchmove", onTouchMove, { passive: true });
    root.addEventListener("touchend", onTouchEnd);
    root.addEventListener("touchcancel", onTouchCancel);
    return () => {
      root.removeEventListener("mouseover", onOver);
      root.removeEventListener("mouseout", onOut);
      root.removeEventListener("focusin", onFocusIn);
      root.removeEventListener("focusout", onFocusOut);
      root.removeEventListener("touchstart", onTouchStart);
      root.removeEventListener("touchmove", onTouchMove);
      root.removeEventListener("touchend", onTouchEnd);
      root.removeEventListener("touchcancel", onTouchCancel);
    };
  }, [rootRef, subject, request, hide, open]);

  /* ---------- cierres globales -------------------------------------------- */

  const position = useCallback(() => {
    const node = cardRef.current;
    const host = shownRef.current?.host;
    if (!node || !host || !host.isConnected) return;
    const r = host.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    const mobile = vw <= MOBILE_W;
    node.classList.toggle(MOBILE_CLASS, mobile);
    const w = node.offsetWidth;
    const h = node.offsetHeight;
    let left = mobile ? Math.round((vw - w) / 2) : Math.round(r.left);
    left = Math.max(PAD, Math.min(left, Math.max(PAD, vw - w - PAD)));
    let top = Math.round(r.bottom + 8);
    let above = false;
    if (top + h > vh - PAD) {
      const up = Math.round(r.top - h - 8);
      if (up >= PAD) {
        top = up;
        above = true;
      } else top = Math.max(PAD, vh - h - PAD);
    }
    node.classList.toggle(ABOVE_CLASS, above);
    node.style.left = `${left}px`;
    node.style.top = `${top}px`;
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const visible = shownRef.current !== null;
      if (!visible && !pendingRef.current) return;
      /* La tarjeta VISIBLE se cierra ANTES que cualquier otro Escape del shell
         (la paleta, el diálogo de atajos): es la capa de más arriba, como en el
         baseline. Una tarjeta apenas PENDIENTE todavía no se ve, así que
         cancelarla en silencio y dejar seguir el Escape: si no, la tecla se
         gastaría en cerrar algo que nadie llegó a ver. */
      if (visible) event.stopPropagation();
      hide();
    };
    const onClick = () => hide();
    const onScroll = () => {
      const ref = shownRef.current?.host ?? pendingRef.current;
      if (!ref) return;
      const xy = xyOf(ref);
      if (!xy) {
        hide();
        return;
      }
      /* Pedida por el foco: el desplazamiento que provoca el propio Tab no la
         cancela, la acompaña. */
      if (viaFocus.current) {
        baseXY.current = xy;
        if (shownRef.current) position();
        return;
      }
      /* Solo cierra si el ancla se movió DE VERDAD: el shell emite eventos de
         scroll de contenedores internos (el índice, la restauración de la
         pestaña) que no deberían apagar una tarjeta recién pedida. */
      const base = baseXY.current;
      if (!base) {
        hide();
        return;
      }
      if (Math.abs(xy.x - base.x) <= 4 && Math.abs(xy.y - base.y) <= 4) return;
      hide();
    };
    const onResize = () => {
      if (shownRef.current) position();
    };
    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("click", onClick, true);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [hide, position]);

  /* Navegar cierra la tarjeta (el equivalente del `hashchange` del baseline). */
  useEffect(() => {
    hide();
  }, [location.pathname, location.hash, hide]);

  /* Al desmontar el shell no puede quedar ningún temporizador vivo. */
  useEffect(
    () => () => {
      window.clearTimeout(openTimer.current);
      window.clearTimeout(holdTimer.current);
    },
    [],
  );

  /* ---------- datos -------------------------------------------------------- */

  const meta: PageMeta | undefined = shown ? model.bySlug.get(shown.slug) : undefined;
  const bodyText = shown && body?.slug === shown.slug ? body.body : undefined;

  /* El enlace lleva `aria-describedby` MIENTRAS la tarjeta está visible: sin eso
     un lector de pantalla no la anuncia (la tarjeta vive en un portal, lejos del
     enlace). */
  useEffect(() => {
    const host = shown?.host;
    if (!host) return;
    host.setAttribute("aria-describedby", PAGE_TIP_ID);
    return () => host.removeAttribute("aria-describedby");
  }, [shown]);

  /* El cuerpo solo se pide cuando hace falta: un ancla que resolver o una página
     sin resumen. La consulta es la MISMA del lector, así que abrirla después no
     vuelve a la red. */
  useEffect(() => {
    if (!shown || !meta) return;
    const needsBody = shown.anchor !== "" || meta.summary.trim() === "";
    if (!needsBody) return;
    if (body?.slug === shown.slug) return;
    let alive = true;
    const wanted = shown.slug;
    void queryClient
      .fetchQuery({
        queryKey: qk.page(subject, wanted),
        queryFn: () => api.subject.page(subject, wanted),
        staleTime: BODY_STALE_MS,
      })
      .then((detail) => {
        if (!alive) return;
        setBody({ slug: wanted, body: detail.page.body, headings: detail.page.headings });
      })
      .catch(() => {
        /* Sin cuerpo la tarjeta se queda con lo que ya mostraba: una vista previa
           no puede convertirse en un error. */
      });
    return () => {
      alive = false;
    };
  }, [shown, meta, body, queryClient, subject]);

  /* Se reubica cuando aparece y cuando el cuerpo la hace crecer (sin parpadeo:
     la medición va antes del pintado). */
  useLayoutEffect(() => {
    if (shown) position();
  }, [shown, bodyText, position]);

  if (!shown || !meta) return null;

  const divisionKey = model.divisionOf(meta);
  const division = model.division(divisionKey);
  const lead = leadOf(meta, bodyText);
  const section =
    shown.anchor && body?.slug === shown.slug ? sectionOf(body.body, body.headings, shown.anchor) : null;
  const studied = model.studied.has(shown.slug);

  /* «U3 · Concepto» y, si el enlace apunta a la misma división que la página
     abierta, «4 de 12 · sin leer»: la posición que mostraba el tooltip mini de
     la barra de unidad del baseline. Sale de la SECUENCIA del modelo, no de un
     atributo en el DOM: así vale para el segmento y para cualquier otro enlace
     a una página de la misma división (índice, «¿Qué sigue?», backlinks). */
  /* La línea meta se arma por piezas: división (con su punto), el TIPO como
     etiqueta (así se sabe qué es cada página sin depender del color de la
     barra), la posición dentro de la división y el ESTADO como insignia bien
     visible (leída ✓ · sin leer · actual), que es lo que el usuario mira en el
     tooltip de la barra de progreso. */
  const isContent = model.isContent(meta);
  const current = currentPage ? model.bySlug.get(currentPage) : undefined;
  let posLabel: string | null = null;
  if (current && model.divisionOf(current) === divisionKey && isContent) {
    const at = model.positionOf(shown.slug);
    const total = model.sequence(divisionKey).length;
    if (at) posLabel = `${at} de ${total}`;
  }
  const format = !isContent && meta.format ? meta.format.charAt(0).toUpperCase() + meta.format.slice(1) : null;
  const state: "now" | "read" | "unread" | null = !isContent
    ? null
    : shown.slug === currentPage
      ? "now"
      : studied
        ? "read"
        : "unread";
  const stateLabel = state === "now" ? "actual" : state === "read" ? "leída ✓" : state === "unread" ? "sin leer" : "";

  const foot: string[] = [];
  if (meta.words) foot.push(`${meta.words} palabras`);

  return createPortal(
    <div className={css.card} id={PAGE_TIP_ID} role="tooltip" data-page-tip-card="" ref={cardRef}>
      <div className={css.title}>{meta.title}</div>
      <div className={css.meta}>
        <span
          className={css.dot}
          aria-hidden="true"
          style={{ background: division?.color ?? "var(--primary)" }}
        />
        {division && isContent ? <span>{division.short}</span> : null}
        <span className={css.typeTag}>{model.typeLabel(meta.type)}</span>
        {format ? <span>{format}</span> : null}
        {posLabel ? <span className={css.position}>{posLabel}</span> : null}
        {state ? (
          <span className={css.state} data-state={state}>
            {stateLabel}
          </span>
        ) : null}
      </div>
      {lead ? <MathText className={css.lead} text={lead} /> : null}
      {section ? (
        <div className={css.section}>
          <div className={css.sectionHead}>§ {section.title}</div>
          {section.text ? <MathText className={css.sectionBody} text={section.text} /> : null}
        </div>
      ) : null}
      {foot.length ? <div className={css.foot}>{foot.join(" · ")}</div> : null}
    </div>,
    document.body,
  );
}
