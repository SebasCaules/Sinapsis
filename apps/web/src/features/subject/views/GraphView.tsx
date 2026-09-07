/**
 * Grafo de conexiones (N0-31): las páginas del wiki y sus wikilinks, sobre un
 * lienzo a pantalla completa con `d3-force` y `d3-zoom`.
 *
 * Reparto de trabajo:
 *  - `graphModel.ts` (puro, probado) filtra y prepara los nodos.
 *  - Este archivo solo dibuja y escucha: simulación, zoom, hover y clic.
 *
 * Por qué canvas y no SVG: con 400 nodos y sus aristas, el SVG mete miles de
 * elementos en el DOM y cada tick de la simulación los toca todos. En canvas
 * cada tick es un dibujo y nada más. El precio es que la accesibilidad no puede
 * salir del lienzo: al lado va la lista de las páginas más citadas, el lienzo
 * mismo se recorre con las flechas, y debajo va el equivalente textual COMPLETO
 * —todas las páginas dibujadas, agrupadas por división y con su cantidad de
 * enlaces—, que es lo que el baseline llama «Lista de páginas y sus enlaces».
 *
 * Los colores de las divisiones son tokens CSS (`var(--u3)`), que el canvas no
 * entiende: se resuelven UNA vez por tema con `getComputedStyle`.
 */
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { plural, routes } from "@sinapsis/contract";
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type Simulation,
} from "d3-force";
import { select } from "d3-selection";
import { zoom, zoomIdentity, type D3ZoomEvent, type ZoomBehavior, type ZoomTransform } from "d3-zoom";
import { api, qk } from "@/lib/api";
import { UiIcon } from "@/components/platform";
import { useSubjectCtx } from "../context";
import { ErrorCard } from "../components/States";
import { PageTypeTag } from "../components/TypeTag";
import { useTheme } from "../store";
import { CONTENT_ONLY_DEFAULT, buildGraphModel, type GraphFilters, type GraphModelNode } from "./graphModel";
import css from "./GraphView.module.css";

/** Nodo con la posición que le pone la simulación. */
interface SimNode extends GraphModelNode {
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  index?: number;
  /** Posición fijada por el arrastre: el nodo se queda donde se lo soltó. */
  fx?: number | null;
  fy?: number | null;
  /** Color ya resuelto a un valor que el canvas entiende. */
  ink: string;
}

/** Rectángulo en píxeles de pantalla (para el reparto de etiquetas). */
interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface SimEdge {
  source: SimNode | string;
  target: SimNode | string;
}

/** El zoom a partir del cual las etiquetas se dibujan solas, sin hover. */
const LABEL_ZOOM = 1.4;
const LIST_SEP = ",";

/** Un solo texto para la carga del grafo, lo diga el contador o el velo (U35). */
const LOADING = "Trazando el grafo…";

/** «Más citadas»: cuántas se ven de entrada y hasta cuántas llega «Ver más» (N0-39). */
const TOP_MIN = 12;
const TOP_MAX = 30;

/** Cuánto acerca o aleja cada golpe de los botones − / +. */
const ZOOM_STEP = 1.35;

/** Margen del encuadre automático, en píxeles de pantalla. */
const FIT_PAD = 48;
/** Cada cuántos cuadros de la simulación se vuelve a encuadrar. */
const FIT_EVERY = 6;
/** Un rótulo más largo que esto se corta: dos nombres enteros no entran en el mapa. */
const LABEL_MAX = 30;

/** Pista de uso: se retira en la primera interacción con el lienzo. */
const HINT = "Arrastre un nodo o el fondo · rueda para acercar · clic para abrir";

/**
 * Reparto de fuerzas del baseline (reader.js): repulsión larga y sin techo,
 * colisión aparte, gravedad suave al centro y un resorte flojo. Con la
 * repulsión corta y la colisión dura de antes, doscientos nodos se estabilizaban
 * como un empaquetado de círculos que se tocan y las aristas desaparecían.
 */
const REPULSION = -420;
const REPULSION_MAX = 900;
const LINK_LEN = 64;
const LINK_STRENGTH = 0.05;
const COLLIDE_PAD = 6;
const GRAVITY = 0.02;
/** Ángulo áureo: la espiral de Fermat con la que se siembran los nodos. */
const GOLDEN_ANGLE = 2.399963;

const parseList = (v: string | null): string[] => (v ? v.split(LIST_SEP).filter(Boolean) : []);

/** «meta» → «Meta»: los tipos llegan en minúscula desde el wiki (U28). */
const capitalize = (label: string): string => (label ? label[0]?.toUpperCase() + label.slice(1) : label);

/**
 * Resuelve `var(--u3)` al color real del tema activo. Los hex y los `oklch()`
 * que devuelve la escala paramétrica pasan tal cual.
 */
function makeResolver(): (value: string) => string {
  const styles = getComputedStyle(document.documentElement);
  const cache = new Map<string, string>();
  return (value: string): string => {
    const hit = cache.get(value);
    if (hit) return hit;
    const token = /^var\((--[a-z0-9-]+)\)$/i.exec(value.trim());
    const out = token ? styles.getPropertyValue(token[1] as string).trim() || "#888" : value;
    cache.set(value, out);
    return out;
  };
}

export function GraphView() {
  const { slug, model } = useSubjectCtx();
  const navigate = useNavigate();
  const theme = useTheme();
  const [params, setParams] = useSearchParams();

  const query = useQuery({ queryKey: qk.graph(slug), queryFn: () => api.subject.graph(slug) });

  const filters = useMemo<GraphFilters>(
    () => ({
      divisions: parseList(params.get("d")),
      types: parseList(params.get("t")),
      /* Nace ENCENDIDO (como el «Solo temas» del baseline): el parámetro sirve
         para APAGARLO, no para encenderlo. */
      contentOnly: params.get("c") === "0" ? false : CONTENT_ONLY_DEFAULT,
      query: params.get("q") ?? "",
    }),
    [params],
  );

  const update = useCallback(
    (key: string, value: string[] | string) => {
      const next = new URLSearchParams(params);
      const flat = Array.isArray(value) ? value.join(LIST_SEP) : value;
      if (flat) next.set(key, flat);
      else next.delete(key);
      setParams(next, { replace: true });
    },
    [params, setParams],
  );

  const toggleIn = (key: string, list: string[], value: string) =>
    update(key, list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const graph = useMemo(
    () => (query.data ? buildGraphModel(query.data, model, filters) : null),
    [query.data, model, filters],
  );

  /* ---------- lienzo ------------------------------------------------------- */
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<Simulation<SimNode, undefined> | null>(null);
  const nodesRef = useRef<SimNode[]>([]);
  const edgesRef = useRef<SimEdge[]>([]);
  const transformRef = useRef<ZoomTransform>(zoomIdentity);
  const sizeRef = useRef({ w: 0, h: 0 });
  const hoverRef = useRef<SimNode | null>(null);
  const rafRef = useRef(0);
  const zoomRef = useRef<ZoomBehavior<HTMLCanvasElement, unknown> | null>(null);
  const downRef = useRef<{ x: number; y: number } | null>(null);
  /** Nodo que se está arrastrando (null = nadie). */
  const dragRef = useRef<SimNode | null>(null);
  /**
   * El lector ya movió la vista (arrastre, rueda, botones o cursor de teclado):
   * el encuadre automático deja de intervenir hasta que cambie el conjunto de
   * nodos. Sin esto, la simulación le corregía el encuadre por debajo.
   */
  const viewLockedRef = useRef(false);
  const tickRef = useRef(0);
  /* Los controles flotantes se pintan ENCIMA del lienzo: las etiquetas los
     esquivan, así que el dibujo necesita saber dónde están. */
  const zoomBarRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const [hovered, setHovered] = useState<{ node: GraphModelNode; x: number; y: number } | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  /**
   * Nodo bajo el cursor de TECLADO (U5). El lienzo es enfocable y las flechas
   * recorren los nodos en el mismo orden que la lista «más citadas»: sin esto,
   * el grafo era estrictamente un dibujo y no había forma de llegar a un nodo
   * sin apuntarle con el ratón. −1 es «todavía no se movió».
   */
  const [cursor, setCursor] = useState(-1);
  const cursorRef = useRef<string | null>(null);
  /** «Más citadas» empieza recortada; «Ver más» la lleva hasta 30 (N0-39). */
  const [topAll, setTopAll] = useState(false);
  /** La pista de uso ocupa la esquina hasta la primera interacción. */
  const [hintOn, setHintOn] = useState(true);
  /**
   * La lista textual abierta no cabe en una pantalla: la vista deja de tener
   * alto fijo y pasa a hacer scroll dentro de `main`, como en anchos chicos.
   */
  const [altOpen, setAltOpen] = useState(false);

  const ready = query.data !== undefined;

  /* La identidad de los nodos: solo si cambia hay que rearmar la simulación
     (mover un chip de filtro sí; escribir en la búsqueda no). */
  const nodeKey = useMemo(() => (graph ? graph.nodes.map((n) => n.slug).join("|") : ""), [graph]);

  /** Dibuja un cuadro. Nunca se llama directo: siempre por `schedule`. */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const { w, h } = sizeRef.current;
    const t = transformRef.current;
    const styles = getComputedStyle(document.documentElement);
    const ink = styles.getPropertyValue("--text").trim() || "#222";
    const faint = styles.getPropertyValue("--border-2").trim() || "#999";
    const paper = styles.getPropertyValue("--bg").trim() || "#fff";
    const surface = styles.getPropertyValue("--surface").trim() || "#fff";
    const hot = styles.getPropertyValue("--primary").trim() || "#c00";
    const mono = styles.getPropertyValue("--font-mono").trim() || 'ui-monospace, monospace';

    ctx.save();
    ctx.fillStyle = paper;
    ctx.fillRect(0, 0, w, h);
    ctx.translate(t.x, t.y);
    ctx.scale(t.k, t.k);

    const hover = hoverRef.current;
    /* Vecinos del nodo bajo el ratón: mandan el atenuado y el color de acento. */
    const neighbours = new Set<string>();
    /* Vecinos del foco (ratón O cursor de teclado): mandan las etiquetas. */
    const near = new Set<string>();
    const focus = new Set<string>();
    if (hover) focus.add(hover.slug);
    if (cursorRef.current) focus.add(cursorRef.current);
    if (focus.size) {
      for (const edge of edgesRef.current) {
        const a = edge.source as SimNode;
        const b = edge.target as SimNode;
        if (typeof a !== "object" || typeof b !== "object") continue;
        if (focus.has(a.slug)) near.add(b.slug);
        if (focus.has(b.slug)) near.add(a.slug);
        if (hover && a.slug === hover.slug) neighbours.add(b.slug);
        if (hover && b.slug === hover.slug) neighbours.add(a.slug);
      }
    }

    /* Aristas: con el ratón sobre un nodo, TODA la maraña ajena baja a 0.12 y
       solo se leen sus conexiones (si no, el resaltado se pierde en el fondo). */
    ctx.lineWidth = 0.7 / t.k;
    ctx.strokeStyle = faint;
    ctx.globalAlpha = hover ? 0.12 : 0.5;
    ctx.beginPath();
    for (const edge of edgesRef.current) {
      const a = edge.source as SimNode;
      const b = edge.target as SimNode;
      if (typeof a !== "object" || typeof b !== "object") continue;
      if (hover && (a.slug === hover.slug || b.slug === hover.slug)) continue;
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;

    if (hover) {
      /* La vecindad del nodo bajo el cursor, por encima de todo lo demás. */
      ctx.lineWidth = 1.4 / t.k;
      ctx.strokeStyle = hot;
      ctx.globalAlpha = 0.95;
      ctx.beginPath();
      for (const edge of edgesRef.current) {
        const a = edge.source as SimNode;
        const b = edge.target as SimNode;
        if (typeof a !== "object" || typeof b !== "object") continue;
        if (a.slug !== hover.slug && b.slug !== hover.slug) continue;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    for (const node of nodesRef.current) {
      const dim = node.source || (hover !== null && node.slug !== hover.slug && !neighbours.has(node.slug));
      ctx.globalAlpha = dim ? 0.22 : 1;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = node.ink;
      ctx.fill();
      /* Aro del color del papel: sin él, dos nodos que se tocan se leen como una
         sola mancha (es lo que hacía que el grafo pareciera una bola). */
      ctx.lineWidth = 1.5 / t.k;
      ctx.strokeStyle = node.source ? node.ink : surface;
      ctx.stroke();
      /* Páginas troncales: aro de acento. Son los puntos de orientación del
         mapa y se ven aunque no haya nada bajo el ratón. */
      if (node.hub) {
        ctx.globalAlpha = dim ? 0.3 : 1;
        ctx.lineWidth = 2 / t.k;
        ctx.strokeStyle = hot;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 2.5 / t.k, 0, Math.PI * 2);
        ctx.stroke();
      }
      if (node.match) {
        ctx.globalAlpha = 1;
        ctx.lineWidth = 2.4 / t.k;
        ctx.strokeStyle = hot;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 3.5 / t.k, 0, Math.PI * 2);
        ctx.stroke();
      }
      /* El nodo que tiene el cursor de teclado lleva su propio aro: es el
         equivalente en el lienzo del anillo de foco de cualquier control. */
      if (node.slug === cursorRef.current) {
        ctx.globalAlpha = 1;
        ctx.lineWidth = 2 / t.k;
        ctx.strokeStyle = ink;
        ctx.setLineDash([3 / t.k, 3 / t.k]);
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 6 / t.k, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
    ctx.globalAlpha = 1;

    /* ---- etiquetas ------------------------------------------------------
       Prioridad: 0 el nodo enfocado, 1 sus vecinos, 2 las páginas troncales
       (solo en reposo) y 3 el resto, que aparece recién con zoom. El rótulo que
       se superpone a otro NO se dibuja: dos nombres encimados no se leen ni
       valen más que uno solo. */
    const canvasBox = canvas.getBoundingClientRect();
    const reserved: Rect[] = [];
    for (const el of [zoomBarRef.current, hintRef.current]) {
      if (!el || el.hidden) continue;
      const box = el.getBoundingClientRect();
      if (!box.width) continue;
      reserved.push({ x: box.left - canvasBox.left, y: box.top - canvasBox.top, w: box.width, h: box.height });
    }

    const hits = (a: Rect, b: Rect): boolean =>
      a.x < b.x + b.w + 2 && b.x < a.x + a.w + 2 && a.y < b.y + b.h + 2 && b.y < a.y + a.h + 2;

    const placed: Rect[] = [];
    const paintLabel = (node: SimNode): void => {
      const raw = node.title;
      const text = raw.length > LABEL_MAX ? `${raw.slice(0, LABEL_MAX - 2)}…` : raw;
      ctx.font = `600 ${11 / t.k}px ${mono}`;
      const ph = 15 / t.k;
      const pw = ctx.measureText(text).width + 12 / t.k;
      const pad = 6 / t.k;
      /* Recuadro visible en coordenadas de mundo: el lienzo recorta, así que la
         etiqueta se acota a él en vez de salirse por el borde. */
      const vx0 = -t.x / t.k + pad;
      let vx1 = (w - t.x) / t.k - pad;
      const vy0 = -t.y / t.k + pad;
      let vy1 = (h - t.y) / t.k - pad;
      if (node.x < vx0 - node.radius || node.x > vx1 + node.radius) return;
      if (node.y < vy0 - node.radius || node.y > vy1 + node.radius) return;

      let lx = node.x - pw / 2;
      let ly = node.y - node.radius - ph - 4 / t.k;
      /* Los controles flotantes (zoom, pista) están ENCIMA del lienzo: en su
         franja el borde útil se corre para adentro. */
      for (const box of reserved) {
        const top = (box.y - t.y) / t.k;
        const bottom = (box.y + box.h - t.y) / t.k;
        if (ly + ph < top || ly > bottom) continue;
        const left = (box.x - t.x) / t.k;
        /* Un control pegado al borde derecho corre el borde útil hacia adentro;
           uno pegado al izquierdo sube el piso, que es lo único que le queda. */
        if (box.x + box.w / 2 > w / 2) vx1 = Math.min(vx1, left - pad);
        else vy1 = Math.min(vy1, top - pad);
      }
      lx = Math.max(vx0, Math.min(lx, Math.max(vx0, vx1 - pw)));
      if (ly < vy0) ly = node.y + node.radius + 4 / t.k;
      ly = Math.max(vy0, Math.min(ly, Math.max(vy0, vy1 - ph)));

      const rect: Rect = { x: lx * t.k + t.x, y: ly * t.k + t.y, w: pw * t.k, h: ph * t.k };
      for (const other of placed) if (hits(rect, other)) return;
      for (const box of reserved) if (hits(rect, box)) return;
      placed.push(rect);

      /* Placa opaca: sobre el amontonamiento de nodos un simple cerco no separa
         el texto del fondo. */
      const r = 5 / t.k;
      ctx.beginPath();
      ctx.moveTo(lx + r, ly);
      ctx.arcTo(lx + pw, ly, lx + pw, ly + ph, r);
      ctx.arcTo(lx + pw, ly + ph, lx, ly + ph, r);
      ctx.arcTo(lx, ly + ph, lx, ly, r);
      ctx.arcTo(lx, ly, lx + pw, ly, r);
      ctx.closePath();
      ctx.globalAlpha = 0.92;
      ctx.fillStyle = surface;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = ink;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, lx + pw / 2, ly + ph / 2);
    };

    const labels: Array<{ node: SimNode; prio: number }> = [];
    for (const node of nodesRef.current) {
      const prio = focus.has(node.slug)
        ? 0
        : near.has(node.slug)
          ? 1
          : focus.size === 0 && node.hub
            ? 2
            : t.k > LABEL_ZOOM
              ? 3
              : -1;
      if (prio >= 0) labels.push({ node, prio });
    }
    labels.sort((a, b) => a.prio - b.prio || b.node.radius - a.node.radius);
    for (const item of labels) paintLabel(item.node);

    ctx.restore();
  }, []);

  const schedule = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = 0;
      draw();
    });
  }, [draw]);

  /**
   * Encaja el grafo entero en el lienzo: la caja de todos los nodos —INCLUIDO
   * su radio, o los grandes del borde quedan cortados— con margen, y de ahí la
   * escala y la traslación. Es lo que hace «Encajar» y lo que corre solo
   * mientras la simulación enfría.
   */
  const fitToNodes = useCallback(() => {
    const canvas = canvasRef.current;
    const behavior = zoomRef.current;
    const nodes = nodesRef.current;
    const { w, h } = sizeRef.current;
    if (!canvas || !behavior || !nodes.length || !w || !h) return;
    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;
    for (const node of nodes) {
      x0 = Math.min(x0, node.x - node.radius);
      y0 = Math.min(y0, node.y - node.radius);
      x1 = Math.max(x1, node.x + node.radius);
      y1 = Math.max(y1, node.y + node.radius);
    }
    const bw = x1 - x0 || 1;
    const bh = y1 - y0 || 1;
    const k = Math.max(0.25, Math.min(1.6, Math.min((w - FIT_PAD * 2) / bw, (h - FIT_PAD * 2) / bh)));
    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2;
    select(canvas).call(behavior.transform, zoomIdentity.translate(w / 2 - cx * k, h / 2 - cy * k).scale(k));
  }, []);

  /** El encuadre automático: se calla en cuanto el lector movió la vista. */
  const autoFit = useCallback(() => {
    if (viewLockedRef.current) return;
    fitToNodes();
  }, [fitToNodes]);

  /* Tamaño real del lienzo (con densidad de pantalla) y redibujo al cambiar. */
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      sizeRef.current = { w: rect.width, h: rect.height };
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
      const sim = simRef.current;
      if (sim) {
        sim.force("center", forceCenter(rect.width / 2, rect.height / 2));
        sim.force("x", forceX<SimNode>(rect.width / 2).strength(GRAVITY));
        sim.force("y", forceY<SimNode>(rect.height / 2).strength(GRAVITY));
        sim.alpha(0.35).restart();
      }
      schedule();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    return () => observer.disconnect();
  }, [schedule, ready]);

  /* Simulación: se rearma solo cuando cambia el conjunto de nodos. Al llegar al
     reposo, d3 la detiene sola (no hay bucle de rAF en segundo plano). */
  useEffect(() => {
    if (!graph) return;
    const resolve = makeResolver();
    const { w, h } = sizeRef.current;
    const previous = new Map(nodesRef.current.map((n) => [n.slug, n]));
    const nodes: SimNode[] = graph.nodes.map((node, i) => {
      const old = previous.get(node.slug);
      /* Espiral de Fermat en vez de posiciones al azar: la simulación arranca
         siempre del mismo estado y el mapa converge a un dibujo reconocible
         entre sesiones (con posiciones al azar no había «mi mapa»). */
      const angle = i * GOLDEN_ANGLE;
      const rad = 16 * Math.sqrt(i + 1);
      return {
        ...node,
        ink: resolve(node.color),
        x: old?.x ?? w / 2 + Math.cos(angle) * rad,
        y: old?.y ?? h / 2 + Math.sin(angle) * rad,
        fx: old?.fx ?? null,
        fy: old?.fy ?? null,
      };
    });
    const edges: SimEdge[] = graph.edges.map((e) => ({ source: e.from, target: e.to }));
    nodesRef.current = nodes;
    edgesRef.current = edges;
    /* Conjunto nuevo de nodos: el encuadre automático vuelve a mandar. */
    viewLockedRef.current = false;
    tickRef.current = 0;

    simRef.current?.stop();
    const sim = forceSimulation<SimNode>(nodes)
      .force(
        "link",
        forceLink<SimNode, SimEdge>(edges)
          .id((d) => d.slug)
          .distance(LINK_LEN)
          .strength(LINK_STRENGTH),
      )
      .force("charge", forceManyBody<SimNode>().strength(REPULSION).distanceMax(REPULSION_MAX))
      .force("center", forceCenter(w / 2, h / 2))
      .force("x", forceX<SimNode>(w / 2).strength(GRAVITY))
      .force("y", forceY<SimNode>(h / 2).strength(GRAVITY))
      .force("collide", forceCollide<SimNode>((d) => d.radius + COLLIDE_PAD).strength(0.7))
      .alphaDecay(0.035)
      .on("tick", () => {
        /* La simulación sigue expandiéndose después del primer cuadro: si el
           encuadre se calculara una sola vez, los nodos terminarían fuera del
           lienzo. Se reencuadra cada pocos cuadros y al enfriarse del todo. */
        tickRef.current += 1;
        if (tickRef.current % FIT_EVERY === 0) autoFit();
        schedule();
      })
      .on("end", () => {
        autoFit();
        schedule();
      });
    simRef.current = sim;
    return () => {
      sim.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeKey, schedule]);

  /* Cambiar el conjunto de nodos invalida el cursor de teclado: el índice 7 de
     la lista anterior no es la misma página en la nueva. */
  useEffect(() => {
    setCursor(-1);
  }, [nodeKey]);

  /* La búsqueda y el tema no tocan la simulación: solo el color y el redibujo. */
  useEffect(() => {
    if (!graph) return;
    const resolve = makeResolver();
    const bySlug = new Map(graph.nodes.map((n) => [n.slug, n]));
    for (const node of nodesRef.current) {
      const fresh = bySlug.get(node.slug);
      if (!fresh) continue;
      node.match = fresh.match;
      node.ink = resolve(fresh.color);
    }
    schedule();
  }, [graph, theme, schedule]);

  /** Nodo bajo un punto del lienzo (coordenadas de pantalla). */
  const nodeAt = useCallback((px: number, py: number): SimNode | null => {
    const t = transformRef.current;
    const x = (px - t.x) / t.k;
    const y = (py - t.y) / t.k;
    let best: SimNode | null = null;
    let bestDistance = Infinity;
    for (const node of nodesRef.current) {
      const dx = node.x - x;
      const dy = node.y - y;
      const distance = dx * dx + dy * dy;
      const reach = (node.radius + 4) * (node.radius + 4);
      if (distance <= reach && distance < bestDistance) {
        best = node;
        bestDistance = distance;
      }
    }
    return best;
  }, []);

  /** La pista de uso cumplió en cuanto el lector interactúa: se retira. */
  const dismissHint = useCallback(() => {
    setHintOn((on) => (on ? false : on));
  }, []);

  /* Zoom con la rueda y panorámica con el arrastre DEL FONDO. */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const behavior = zoom<HTMLCanvasElement, unknown>()
      .scaleExtent([0.25, 5])
      /* El arrastre que empieza sobre un nodo es del NODO, no de la vista: el
         zoom solo se queda con los gestos que nacen en el fondo. El resto
         reproduce el filtro por omisión de d3-zoom. */
      .filter((event: MouseEvent & { button?: number }) => {
        if (event.ctrlKey && event.type !== "wheel") return false;
        if (event.button) return false;
        if (event.type === "mousedown") {
          const rect = canvas.getBoundingClientRect();
          if (nodeAt(event.clientX - rect.left, event.clientY - rect.top)) return false;
        }
        return true;
      })
      .on("zoom", (event: D3ZoomEvent<HTMLCanvasElement, unknown>) => {
        /* Solo un gesto del lector bloquea el encuadre automático: las
           transformaciones que aplica la propia vista llegan sin `sourceEvent`.
           La rueda no llega al `onWheel` de React —d3-zoom corta la propagación—
           así que la pista de uso también se retira desde acá. */
        if (event.sourceEvent) {
          viewLockedRef.current = true;
          dismissHint();
        }
        transformRef.current = event.transform;
        setZoomLevel(event.transform.k);
        schedule();
      });
    zoomRef.current = behavior;
    const selection = select(canvas);
    selection.call(behavior);
    selection.on("dblclick.zoom", null);
    return () => {
      selection.on(".zoom", null);
    };
  }, [schedule, ready, nodeAt, dismissHint]);

  /**
   * Soltar el nodo arrastrado. Va en `window`: el ratón puede levantarse fuera
   * del lienzo y el nodo quedaría pegado al puntero.
   */
  useEffect(() => {
    const release = () => {
      if (!dragRef.current) return;
      dragRef.current = null;
      simRef.current?.alphaTarget(0);
    };
    window.addEventListener("mouseup", release);
    return () => window.removeEventListener("mouseup", release);
  }, []);

  const onMove = (event: ReactMouseEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;
    /* Arrastre de un nodo: es el gesto que separa un tema de la maraña. */
    const dragged = dragRef.current;
    if (dragged) {
      const t = transformRef.current;
      dragged.fx = (px - t.x) / t.k;
      dragged.fy = (py - t.y) / t.k;
      dragged.x = dragged.fx;
      dragged.y = dragged.fy;
      schedule();
      return;
    }
    const node = nodeAt(px, py);
    if (node?.slug !== hoverRef.current?.slug) {
      hoverRef.current = node;
      schedule();
    }
    setHovered(node ? { node, x: px, y: py } : null);
  };

  const onDown = (event: ReactMouseEvent<HTMLCanvasElement>) => {
    downRef.current = { x: event.clientX, y: event.clientY };
    dismissHint();
    const rect = event.currentTarget.getBoundingClientRect();
    const node = nodeAt(event.clientX - rect.left, event.clientY - rect.top);
    if (!node) return;
    /* Fijar el nodo y recalentar la simulación: los vecinos lo siguen. El nodo
       se queda donde se lo suelta, como en el baseline. */
    dragRef.current = node;
    viewLockedRef.current = true;
    node.fx = node.x;
    node.fy = node.y;
    simRef.current?.alphaTarget(0.25).restart();
  };

  const onUp = (event: ReactMouseEvent<HTMLCanvasElement>) => {
    const start = downRef.current;
    downRef.current = null;
    if (!start) return;
    /* Un arrastre de más de 4 px era una panorámica o un nodo movido, no un clic. */
    if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > 4) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const node = nodeAt(event.clientX - rect.left, event.clientY - rect.top);
    if (node) navigate(routes.page(slug, node.slug));
  };

  /* Acercar y alejar sin rueda ni gesto de pellizco (N0-39): con un trackpad
     prestado o solo con el teclado, el zoom era inalcanzable. */
  const zoomBy = (factor: number) => {
    const canvas = canvasRef.current;
    const behavior = zoomRef.current;
    if (!canvas || !behavior) return;
    viewLockedRef.current = true;
    select(canvas).call(behavior.scaleBy, factor);
  };

  /**
   * El grafo, ordenado por cuántas páginas lo citan. Es el orden de la lista
   * «más citadas» Y el que recorren las flechas sobre el lienzo: una sola
   * secuencia, para que el dibujo y su alternativa textual no se contradigan.
   */
  const ranked = graph
    ? [...graph.nodes].sort((a, b) => b.inDegree - a.inDegree || a.title.localeCompare(b.title, "es"))
    : [];

  const cursorNode = cursor >= 0 ? (ranked[cursor] ?? null) : null;
  cursorRef.current = cursorNode?.slug ?? null;

  /**
   * El cursor de teclado tiene que quedar A LA VISTA (U5). Con 400 nodos el aro
   * discontinuo caía casi siempre fuera del lienzo y las flechas parecían no
   * hacer nada: si el nodo está fuera del área útil, se centra el lienzo en él
   * con `translateTo` de d3-zoom (el mismo comportamiento del arrastre, así que
   * `transformRef` se entera por el propio evento de zoom). Si ya está adentro
   * no se mueve nada: desplazar el dibujo en cada flecha marea.
   */
  const ensureVisible = (slug: string | null) => {
    const canvas = canvasRef.current;
    const behavior = zoomRef.current;
    if (!slug || !canvas || !behavior) return;
    const node = nodesRef.current.find((n) => n.slug === slug);
    if (!node) return;
    const { w, h } = sizeRef.current;
    if (!w || !h) return;
    const t = transformRef.current;
    const px = t.applyX(node.x);
    const py = t.applyY(node.y);
    /* Margen: el aro y la etiqueta del nodo también tienen que entrar. */
    const margin = Math.min(64, Math.max(24, Math.min(w, h) * 0.12));
    if (px >= margin && px <= w - margin && py >= margin && py <= h - margin) return;
    /* Mover la vista con el teclado también apaga el encuadre automático: si no,
       la simulación se la devolvía al centro en el cuadro siguiente. */
    viewLockedRef.current = true;
    select(canvas).call(behavior.translateTo, node.x, node.y);
  };

  /* Se centra DESPUÉS de pintar: el nodo puede haberse movido en el mismo tick
     de la simulación que lo trajo. */
  useEffect(() => {
    ensureVisible(cursorRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor, nodeKey]);

  const moveCursor = (delta: number) => {
    if (!ranked.length) return;
    setCursor((at) => {
      const next = at < 0 ? (delta > 0 ? 0 : ranked.length - 1) : at + delta;
      return Math.min(ranked.length - 1, Math.max(0, next));
    });
    schedule();
  };

  const onCanvasKeyDown = (event: ReactKeyboardEvent<HTMLCanvasElement>) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    dismissHint();
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        moveCursor(1);
        return;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        moveCursor(-1);
        return;
      case "Home":
        event.preventDefault();
        setCursor(0);
        schedule();
        return;
      case "End":
        event.preventDefault();
        setCursor(ranked.length - 1);
        schedule();
        return;
      case "Enter":
        if (!cursorNode) return;
        event.preventDefault();
        navigate(routes.page(slug, cursorNode.slug));
        return;
      default:
    }
  };

  /* ---------- estados ------------------------------------------------------ */
  if (query.isError) {
    return <ErrorCard error={query.error} notFound="Esta materia no tiene grafo" subject={slug} />;
  }

  const empty = graph !== null && graph.total === 0;
  const filteredOut = graph !== null && graph.total > 0 && graph.nodes.length === 0;
  const top = ranked.slice(0, topAll ? TOP_MAX : TOP_MIN);

  return (
    <div className={css.view} data-alt={altOpen ? "true" : undefined}>
      <header className={css.head}>
        <div className={css.headText}>
          <span className={css.ribbon}>— CONEXIONES —</span>
          <h1 className={css.h1}>Grafo de conexiones</h1>
          {/* `status`: el recuento cambia solo al mover un filtro o escribir en
              la búsqueda, y es la única confirmación de que el filtro hizo algo
              para quien no ve el lienzo (U34). */}
          <p className={css.sub} data-testid="graph-meta" role="status">
            {graph
              ? `${graph.nodes.length} de ${graph.total} ${plural(graph.total, "página", "páginas")} · ${graph.edges.length} ${plural(graph.edges.length, "enlace", "enlaces")}`
              : LOADING}
            {graph && filters.query
              ? ` · ${graph.matches} ${plural(graph.matches, "coincidencia", "coincidencias")}`
              : ""}
          </p>
        </div>
        <label className={css.searchField}>
          <UiIcon name="search" size={15} />
          <input
            type="search"
            className={css.searchInput}
            value={filters.query}
            placeholder="Resaltar por título…"
            aria-label="Resaltar páginas en el grafo"
            onChange={(e) => update("q", e.target.value)}
          />
        </label>
      </header>

      <div className={css.filters}>
        <div className={css.chipRow} role="group" aria-label={model.config.division.plural}>
          <span className={css.chipLabel}>{model.config.division.plural.toUpperCase()}</span>
          {/* Todos los chips son interruptores y todos lo dicen: antes el estado
              encendido solo existía en el color de fondo (U21). */}
          <button
            type="button"
            className={css.chip}
            data-on={filters.divisions.length === 0 ? "true" : undefined}
            aria-pressed={filters.divisions.length === 0}
            onClick={() => update("d", [])}
          >
            Todas
          </button>
          {model.catalogDivisions.map((division) => (
            <button
              key={division.key}
              type="button"
              className={css.chip}
              data-on={filters.divisions.includes(division.key) ? "true" : undefined}
              aria-pressed={filters.divisions.includes(division.key)}
              aria-label={division.long}
              style={{ ["--ucol" as string]: division.color }}
              onClick={() => toggleIn("d", filters.divisions, division.key)}
            >
              <span className={css.chipDot} aria-hidden="true" />
              {division.short}
            </button>
          ))}
        </div>

        <div className={css.chipRow} role="group" aria-label="Tipos de página">
          <span className={css.chipLabel}>TIPO</span>
          <button
            type="button"
            className={css.chip}
            data-on={filters.types.length === 0 ? "true" : undefined}
            aria-pressed={filters.types.length === 0}
            onClick={() => update("t", [])}
          >
            Todos
          </button>
          {(graph?.types ?? []).map((type) => (
            <button
              key={type.key}
              type="button"
              className={css.chip}
              data-on={filters.types.includes(type.key) ? "true" : undefined}
              aria-pressed={filters.types.includes(type.key)}
              onClick={() => toggleIn("t", filters.types, type.key)}
            >
              {capitalize(type.label)}
              <span className={css.chipCount}>{type.count}</span>
            </button>
          ))}
          <button
            type="button"
            className={`${css.chip} ${css.chipToggle}`}
            data-on={filters.contentOnly ? "true" : undefined}
            aria-pressed={filters.contentOnly}
            onClick={() => update("c", filters.contentOnly ? "0" : "")}
            title="Deja fuera las fuentes: las páginas que no cuentan en el progreso"
          >
            <UiIcon name="check" size={12} />
            Solo contenido
          </button>
        </div>
      </div>

      <div className={css.stage}>
        <div className={css.canvasWrap} ref={wrapRef}>
          {/* El lienzo entra en el orden de tabulación y las flechas recorren
              los nodos, Intro abre el que esté seleccionado (U5). El rótulo dice
              exactamente eso: el anterior prometía una lista «navegable con el
              teclado» que no lo era (U12). */}
          <canvas
            ref={canvasRef}
            className={css.canvas}
            data-hover={hovered ? "true" : undefined}
            tabIndex={0}
            role="img"
            aria-label={`Grafo de ${graph?.nodes.length ?? 0} ${plural(graph?.nodes.length ?? 0, "página", "páginas")} y ${graph?.edges.length ?? 0} ${plural(graph?.edges.length ?? 0, "enlace", "enlaces")}. Con el foco aquí, las flechas recorren las páginas de más a menos citada e Intro abre la seleccionada.`}
            aria-keyshortcuts="ArrowRight ArrowLeft Enter"
            onKeyDown={onCanvasKeyDown}
            onBlur={() => {
              setCursor(-1);
              schedule();
            }}
            onMouseMove={onMove}
            onMouseLeave={() => {
              hoverRef.current = null;
              setHovered(null);
              schedule();
            }}
            onMouseDown={onDown}
            onMouseUp={onUp}
            onWheel={dismissHint}
          />

          {/* Pista de uso: la única indicación visible de que los nodos se
              arrastran, se acercan y se abren. Se retira en la primera
              interacción y le devuelve la esquina a las etiquetas. */}
          <p className={css.hint} ref={hintRef} hidden={!hintOn} aria-hidden="true">
            {HINT}
          </p>

          {/* Lo que el aro del cursor dice en el dibujo, dicho en palabras. */}
          <span className={css.srOnly} role="status">
            {cursorNode
              ? `${cursorNode.title}. ${capitalize(model.typeLabel(cursorNode.type))} de ${cursorNode.divisionShort.replace(/\.$/, "")}. ${cursorNode.inDegree} ${plural(cursorNode.inDegree, "página la enlaza", "páginas la enlazan")}. Intro para abrirla.`
              : ""}
          </span>

          {query.isPending ? (
            <div className={css.overlay} aria-busy="true" aria-live="polite">
              <span className={css.overlayText}>{LOADING}</span>
            </div>
          ) : null}

          {empty ? (
            <div className={css.overlay} aria-live="polite">
              <p className={css.overlayTitle}>Todavía no hay enlaces</p>
              <p className={css.overlayText}>
                El grafo se dibuja con los wikilinks entre páginas. En cuanto el wiki tenga enlaces{" "}
                <code>[[así]]</code> entre sus páginas, aparecen aquí.
              </p>
            </div>
          ) : null}

          {filteredOut ? (
            <div className={css.overlay} aria-live="polite">
              <p className={css.overlayTitle}>El filtro no deja ninguna página</p>
              <button
                type="button"
                className={css.overlayAction}
                onClick={() => setParams(new URLSearchParams(), { replace: true })}
              >
                Quitar los filtros
              </button>
            </div>
          ) : null}

          {hovered ? (
            <div
              className={css.tooltip}
              style={{ left: `${hovered.x}px`, top: `${hovered.y}px`, ["--ucol" as string]: hovered.node.color }}
              role="tooltip"
            >
              <span className={css.tipChip}>{hovered.node.divisionShort}</span>
              <span className={css.tipTitle}>{hovered.node.title}</span>
              <span className={css.tipMeta}>
                <PageTypeTag model={model} type={hovered.node.type} size="sm" /> · {hovered.node.inDegree}{" "}
                {plural(hovered.node.inDegree, "entrada", "entradas")} · {hovered.node.outDegree}{" "}
                {plural(hovered.node.outDegree, "salida", "salidas")}
              </span>
            </div>
          ) : null}

          {/* Sin rueda ni pellizco el zoom no existía (N0-39). */}
          <div className={css.zoomBar} ref={zoomBarRef}>
            <button
              type="button"
              className={css.zoomStep}
              onClick={() => zoomBy(1 / ZOOM_STEP)}
              aria-label="Alejar el grafo"
              title="Alejar"
            >
              −
            </button>
            <span className={css.zoomValue} role="status" data-testid="graph-zoom">
              {Math.round(zoomLevel * 100)} %
            </span>
            <button
              type="button"
              className={css.zoomStep}
              onClick={() => zoomBy(ZOOM_STEP)}
              aria-label="Acercar el grafo"
              title="Acercar"
            >
              +
            </button>
            {/* «Encajar», no «Centrar»: devolver la escala 1 no era un encaje y
                dejaba el grafo desbordado igual que al entrar. */}
            <button
              type="button"
              className={css.zoomReset}
              onClick={fitToNodes}
              title="Encajar el grafo entero en la vista"
            >
              Encajar
            </button>
          </div>
        </div>

        <aside className={css.side}>
          <section className={css.card} aria-labelledby="graph-legend">
            <div className={css.cardHead} id="graph-legend">
              LEYENDA
            </div>
            {(graph?.legend ?? []).map((entry) => (
              <div key={entry.key} className={css.legendRow} style={{ ["--ucol" as string]: entry.color }}>
                <span className={css.legendDot} aria-hidden="true" />
                <span className={css.legendLabel}>{entry.label}</span>
                <span className={css.legendCount}>{entry.count}</span>
              </div>
            ))}
            <p className={css.cardNote}>
              El tamaño del círculo mide cuántos enlaces tiene la página. Las páginas troncales llevan aro de acento
              y etiqueta fija; las fuentes van atenuadas.
            </p>
          </section>

          <section className={css.card} aria-labelledby="graph-top">
            <div className={css.cardHead} id="graph-top">
              MÁS CITADAS
            </div>
            {top.map((node) => (
              <Link
                key={node.slug}
                className={css.topRow}
                to={routes.page(slug, node.slug)}
                aria-label={`${node.title}: ${node.inDegree} ${plural(node.inDegree, "página la enlaza", "páginas la enlazan")}`}
              >
                <span className={css.topCount}>{node.inDegree}</span>
                <span className={css.topTitle}>{node.title}</span>
              </Link>
            ))}
            {!top.length ? <p className={css.cardNote}>Sin páginas que mostrar.</p> : null}
            {/* Doce de doscientas no es «la lista dice lo mismo que el dibujo»:
                se puede llegar hasta treinta (U13 / N0-39). */}
            {ranked.length > TOP_MIN ? (
              <button
                type="button"
                className={css.topMore}
                aria-expanded={topAll}
                onClick={() => setTopAll((v) => !v)}
              >
                {topAll
                  ? "Ver menos"
                  : `Ver más (${Math.min(TOP_MAX, ranked.length) - TOP_MIN} ${plural(Math.min(TOP_MAX, ranked.length) - TOP_MIN, "página", "páginas")})`}
              </button>
            ) : null}
          </section>
        </aside>
      </div>

      {/* El equivalente textual COMPLETO del lienzo (el canvas no se puede
          recorrer): las mismas páginas que se dibujan, agrupadas por división y
          con su cantidad de enlaces. «Más citadas» llega a treinta; esto, a
          todas. */}
      <details className={css.alt} onToggle={(event) => setAltOpen(event.currentTarget.open)}>
        <summary className={css.altSummary}>Lista de páginas y sus enlaces</summary>
        <div className={css.altBody}>
          {(graph?.alt ?? []).map((group) => (
            <section key={group.key} className={css.altGroup} style={{ ["--ucol" as string]: group.color }}>
              <h2 className={css.altTitle}>{group.label}</h2>
              <ul className={css.altList}>
                {group.nodes.map((node) => (
                  <li key={node.slug} className={css.altItem}>
                    <Link className={css.altLink} to={routes.page(slug, node.slug)}>
                      {node.title}
                    </Link>
                    <span className={css.altCount}>
                      {node.degree} {plural(node.degree, "enlace", "enlaces")}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          {!graph?.alt.length ? <p className={css.cardNote}>Sin páginas que mostrar.</p> : null}
        </div>
      </details>
    </div>
  );
}

export default GraphView;
