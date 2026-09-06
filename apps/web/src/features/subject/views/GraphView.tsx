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
 * salir del lienzo: al lado va una lista de las páginas más citadas, navegable
 * con teclado, que dice lo mismo que el dibujo.
 *
 * Los colores de las divisiones son tokens CSS (`var(--u3)`), que el canvas no
 * entiende: se resuelven UNA vez por tema con `getComputedStyle`.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { plural, routes } from "@sinapsis/contract";
import { forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation, type Simulation } from "d3-force";
import { select } from "d3-selection";
import { zoom, zoomIdentity, type D3ZoomEvent, type ZoomBehavior, type ZoomTransform } from "d3-zoom";
import { api, qk } from "@/lib/api";
import { UiIcon } from "@/components/platform";
import { useSubjectCtx } from "../context";
import { ErrorCard } from "../components/States";
import { useTheme } from "../store";
import { buildGraphModel, type GraphFilters, type GraphModelNode } from "./graphModel";
import css from "./GraphView.module.css";

/** Nodo con la posición que le pone la simulación. */
interface SimNode extends GraphModelNode {
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  index?: number;
  /** Color ya resuelto a un valor que el canvas entiende. */
  ink: string;
}

interface SimEdge {
  source: SimNode | string;
  target: SimNode | string;
}

/** El zoom a partir del cual las etiquetas se dibujan solas, sin hover. */
const LABEL_ZOOM = 1.4;
const LIST_SEP = ",";

const parseList = (v: string | null): string[] => (v ? v.split(LIST_SEP).filter(Boolean) : []);

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
      contentOnly: params.get("c") === "1",
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
  const [hovered, setHovered] = useState<{ node: GraphModelNode; x: number; y: number } | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

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
    const halo = styles.getPropertyValue("--elevated").trim() || "#fff";
    const hot = styles.getPropertyValue("--primary").trim() || "#c00";

    ctx.save();
    ctx.fillStyle = paper;
    ctx.fillRect(0, 0, w, h);
    ctx.translate(t.x, t.y);
    ctx.scale(t.k, t.k);

    // aristas
    ctx.lineWidth = 0.7 / t.k;
    ctx.strokeStyle = faint;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    for (const edge of edgesRef.current) {
      const a = edge.source as SimNode;
      const b = edge.target as SimNode;
      if (typeof a !== "object" || typeof b !== "object") continue;
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;

    const hover = hoverRef.current;
    const neighbours = new Set<string>();
    if (hover) {
      for (const edge of edgesRef.current) {
        const a = edge.source as SimNode;
        const b = edge.target as SimNode;
        if (a.slug === hover.slug) neighbours.add(b.slug);
        if (b.slug === hover.slug) neighbours.add(a.slug);
      }
      /* La vecindad del nodo bajo el cursor, por encima de todo lo demás. */
      ctx.lineWidth = 1.4 / t.k;
      ctx.strokeStyle = hot;
      ctx.beginPath();
      for (const edge of edgesRef.current) {
        const a = edge.source as SimNode;
        const b = edge.target as SimNode;
        if (a.slug !== hover.slug && b.slug !== hover.slug) continue;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
      }
      ctx.stroke();
    }

    for (const node of nodesRef.current) {
      const dim = node.source || (hover !== null && node.slug !== hover.slug && !neighbours.has(node.slug));
      ctx.globalAlpha = dim ? 0.34 : 1;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = node.ink;
      ctx.fill();
      /* Las fuentes van con aro: se distinguen del contenido sin necesidad de
         otro color (el color ya significa «división»). */
      if (node.source) {
        ctx.globalAlpha = 0.8;
        ctx.lineWidth = 1.2 / t.k;
        ctx.strokeStyle = node.ink;
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
    }
    ctx.globalAlpha = 1;

    // etiquetas: con zoom suficiente, o la del nodo bajo el cursor y sus vecinos
    if (t.k > LABEL_ZOOM || hover !== null) {
      ctx.font = `600 ${11 / t.k}px "Hanken", system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.lineJoin = "round";
      for (const node of nodesRef.current) {
        if (t.k <= LABEL_ZOOM && node.slug !== hover?.slug && !neighbours.has(node.slug)) continue;
        const y = node.y + node.radius + 3 / t.k;
        /* Cerco del color del papel: la etiqueta se lee aunque caiga sobre una arista. */
        ctx.lineWidth = 3 / t.k;
        ctx.strokeStyle = halo;
        ctx.strokeText(node.title, node.x, y);
        ctx.fillStyle = ink;
        ctx.fillText(node.title, node.x, y);
      }
    }

    ctx.restore();
  }, []);

  const schedule = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = 0;
      draw();
    });
  }, [draw]);

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
    const nodes: SimNode[] = graph.nodes.map((node) => {
      const old = previous.get(node.slug);
      return {
        ...node,
        ink: resolve(node.color),
        x: old?.x ?? w / 2 + (Math.random() - 0.5) * 280,
        y: old?.y ?? h / 2 + (Math.random() - 0.5) * 280,
      };
    });
    const edges: SimEdge[] = graph.edges.map((e) => ({ source: e.from, target: e.to }));
    nodesRef.current = nodes;
    edgesRef.current = edges;

    simRef.current?.stop();
    const sim = forceSimulation<SimNode>(nodes)
      .force(
        "link",
        forceLink<SimNode, SimEdge>(edges)
          .id((d) => d.slug)
          .distance(54)
          .strength(0.28),
      )
      .force("charge", forceManyBody<SimNode>().strength(-150).distanceMax(440))
      .force("center", forceCenter(w / 2, h / 2))
      .force("collide", forceCollide<SimNode>((d) => d.radius + 4).strength(0.85))
      .alphaDecay(0.035)
      .on("tick", schedule)
      .on("end", schedule);
    simRef.current = sim;
    return () => {
      sim.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeKey, schedule]);

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

  /* Zoom con la rueda y panorámica con el arrastre. */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const behavior = zoom<HTMLCanvasElement, unknown>()
      .scaleExtent([0.25, 5])
      .on("zoom", (event: D3ZoomEvent<HTMLCanvasElement, unknown>) => {
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
  }, [schedule, ready]);

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

  const onMove = (event: ReactMouseEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;
    const node = nodeAt(px, py);
    if (node?.slug !== hoverRef.current?.slug) {
      hoverRef.current = node;
      schedule();
    }
    setHovered(node ? { node, x: px, y: py } : null);
  };

  const onUp = (event: ReactMouseEvent<HTMLCanvasElement>) => {
    const start = downRef.current;
    downRef.current = null;
    if (!start) return;
    /* Un arrastre de más de 4 px era una panorámica, no un clic. */
    if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > 4) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const node = nodeAt(event.clientX - rect.left, event.clientY - rect.top);
    if (node) navigate(routes.page(slug, node.slug));
  };

  const resetZoom = () => {
    const canvas = canvasRef.current;
    const behavior = zoomRef.current;
    if (!canvas || !behavior) return;
    /* Sin `transition()`: eso pediría `d3-transition`, una dependencia entera
       para animar un único salto de 200 ms. Se centra de golpe. */
    select(canvas).call(behavior.transform, zoomIdentity);
  };

  /* ---------- estados ------------------------------------------------------ */
  if (query.isError) {
    return <ErrorCard error={query.error} notFound="Esta materia no tiene grafo" subject={slug} />;
  }

  const empty = graph !== null && graph.total === 0;
  const filteredOut = graph !== null && graph.total > 0 && graph.nodes.length === 0;
  const top = graph
    ? [...graph.nodes].sort((a, b) => b.inDegree - a.inDegree || a.title.localeCompare(b.title, "es")).slice(0, 12)
    : [];

  return (
    <div className={css.view}>
      <header className={css.head}>
        <div className={css.headText}>
          <span className={css.ribbon}>— CONEXIONES —</span>
          <h1 className={css.h1}>Grafo de conexiones</h1>
          <p className={css.sub}>
            {graph
              ? `${graph.nodes.length} de ${graph.total} ${plural(graph.total, "página", "páginas")} · ${graph.edges.length} ${plural(graph.edges.length, "enlace", "enlaces")}`
              : "Cargando el grafo…"}
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
          <button
            type="button"
            className={css.chip}
            data-on={filters.divisions.length === 0 ? "true" : undefined}
            onClick={() => update("d", [])}
          >
            Todas
          </button>
          {model.visibleDivisions.map((division) => (
            <button
              key={division.key}
              type="button"
              className={css.chip}
              data-on={filters.divisions.includes(division.key) ? "true" : undefined}
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
              onClick={() => toggleIn("t", filters.types, type.key)}
            >
              {type.label}
              <span className={css.chipCount}>{type.count}</span>
            </button>
          ))}
          <button
            type="button"
            className={`${css.chip} ${css.chipToggle}`}
            data-on={filters.contentOnly ? "true" : undefined}
            aria-pressed={filters.contentOnly}
            onClick={() => update("c", filters.contentOnly ? "" : "1")}
            title="Deja fuera las fuentes: las páginas que no cuentan en el progreso"
          >
            <UiIcon name="check" size={12} />
            Solo contenido
          </button>
        </div>
      </div>

      <div className={css.stage}>
        <div className={css.canvasWrap} ref={wrapRef}>
          <canvas
            ref={canvasRef}
            className={css.canvas}
            data-hover={hovered ? "true" : undefined}
            role="img"
            aria-label={`Grafo de ${graph?.nodes.length ?? 0} páginas y sus enlaces. La lista «más citadas» dice lo mismo y se recorre con el teclado.`}
            onMouseMove={onMove}
            onMouseLeave={() => {
              hoverRef.current = null;
              setHovered(null);
              schedule();
            }}
            onMouseDown={(event) => {
              downRef.current = { x: event.clientX, y: event.clientY };
            }}
            onMouseUp={onUp}
          />

          {query.isPending ? (
            <div className={css.overlay} aria-busy="true">
              <span className={css.overlayText}>Trazando el grafo…</span>
            </div>
          ) : null}

          {empty ? (
            <div className={css.overlay}>
              <p className={css.overlayTitle}>Todavía no hay enlaces</p>
              <p className={css.overlayText}>
                El grafo se dibuja con los wikilinks entre páginas. En cuanto el wiki tenga enlaces{" "}
                <code>[[así]]</code> entre sus páginas, aparecen acá.
              </p>
            </div>
          ) : null}

          {filteredOut ? (
            <div className={css.overlay}>
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
                {model.typeLabel(hovered.node.type)} · {hovered.node.inDegree}{" "}
                {plural(hovered.node.inDegree, "entrada", "entradas")} · {hovered.node.outDegree}{" "}
                {plural(hovered.node.outDegree, "salida", "salidas")}
              </span>
            </div>
          ) : null}

          <div className={css.zoomBar}>
            <span className={css.zoomValue}>{Math.round(zoomLevel * 100)} %</span>
            <button type="button" className={css.zoomReset} onClick={resetZoom}>
              Centrar
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
              El tamaño del círculo mide cuántas páginas enlazan a esa. Las fuentes van atenuadas y con aro.
            </p>
          </section>

          <section className={css.card} aria-labelledby="graph-top">
            <div className={css.cardHead} id="graph-top">
              MÁS CITADAS
            </div>
            {top.map((node) => (
              <Link key={node.slug} className={css.topRow} to={routes.page(slug, node.slug)}>
                <span className={css.topCount}>{node.inDegree}</span>
                <span className={css.topTitle}>{node.title}</span>
              </Link>
            ))}
            {!top.length ? <p className={css.cardNote}>Sin páginas que mostrar.</p> : null}
          </section>
        </aside>
      </div>
    </div>
  );
}

export default GraphView;
