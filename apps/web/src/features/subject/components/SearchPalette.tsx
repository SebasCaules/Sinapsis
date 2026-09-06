/**
 * Paleta de búsqueda (⌘K / Ctrl+K, o «/» fuera de un campo).
 *
 * Busca páginas en el API (con 150 ms de rebote) y, además, ofrece los ítems del
 * rail que coincidan por rótulo: dentro de una materia, «ir a» y «buscar» son la
 * misma pregunta.
 *
 * Semántica: el campo es un `combobox` que gobierna una `listbox`; el foco no se
 * mueve de la entrada y la fila activa se señala con `aria-activedescendant`.
 * El Tab queda atrapado dentro del diálogo, como en `platform/Dialog`.
 */
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { countsAsContent, plural, routes, type SearchHit } from "@sinapsis/contract";
import { Icon, UiIcon } from "@/components/platform";
import type { RailGroupView, RailItemView, SubjectModel } from "../model";
import { useSearch } from "../useSubject";
import css from "./SearchPalette.module.css";

export interface SearchPaletteProps {
  model: SubjectModel;
  open: boolean;
  onClose: () => void;
}

interface Row {
  key: string;
  kind: "page" | "rail";
  label: string;
  meta: string;
  snippet: string | null;
  to: string | null;
  href: string | null;
  icon: React.ReactNode;
}

/** Una tanda de resultados con su encabezado («Herramientas», «Páginas (9)»). */
interface Section {
  title: string;
  rows: Row[];
}

/** Sin tildes y en minúsculas: es con lo que se compara, no con lo que se muestra. */
export function norm(text: string): string {
  return (text ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const reEsc = (t: string): string => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** ¿El término aparece al PRINCIPIO de una palabra? (core.js:2159-2161). */
function wordStart(hay: string, term: string): boolean {
  return new RegExp(`(?:^|[^a-z0-9])${reEsc(term)}`).test(hay);
}

/**
 * Sustantivo genérico inicial del título: lo que queda es el NOMBRE de la página
 * («Distribución Binomial» → «binomial»). Es la lista del baseline
 * (core.js:2062-2066) y sirve para reconocer la página canónica de un término y
 * ponerla primera.
 */
const GENERIC_HEAD = /^(?:distribucion|proceso|teorema|prueba|funcion|variable)\s+(?:de\s+la\s+|de\s+los\s+|del\s+|de\s+)?/;
export function coreTitle(tn: string): string {
  return tn.replace(GENERIC_HEAD, "").trim() || tn;
}

/**
 * Puntaje de una página, con el criterio de core.js:2170-2185: manda la
 * coincidencia al principio de una palabra del título, el contenido va antes que
 * las fuentes y la página que SE LLAMA como lo escrito sube a la cabeza.
 */
export function scorePage(
  input: { title: string; hay: string; content: boolean },
  needle: string,
  terms: string[],
): number {
  const tn = norm(input.title);
  const core = coreTitle(tn);
  let sc = 0;
  for (const term of terms) {
    if (tn.startsWith(term)) sc += 6;
    else if (wordStart(tn, term)) sc += 4;
    else if (tn.includes(term)) sc += 2;
    if (input.hay.includes(term)) sc += 1;
  }
  if (input.content) sc += 3;
  if (core.startsWith(needle)) {
    sc += 5;
    if (core.split(/\s+/).length === terms.length) sc += 3;
  }
  return sc;
}

/* Las filas de resultado no se tabulan: se recorren con las flechas. */
const FOCUSABLE = 'input:not([disabled]), button:not([disabled]):not([tabindex="-1"]), [href]';

/**
 * Deja el snippet del API en prosa legible: fuera los marcadores del resaltado
 * (acá lo hacemos nosotros), fuera la sintaxis del wiki —un `[[slug|texto]]` se
 * lee por su texto—, fuera los marcadores de markdown y la matemática resumida
 * en «…», que es más honesto que mostrar el LaTeX crudo en una lista.
 *
 * El fragmento llega RECORTADO por el API, así que una fórmula puede venir
 * abierta y sin cerrar: sin tratarla, la paleta mostraba cosas como
 * «**Qué es:** … $$ F_X(x)=P…» (revisión de diseño D5). Un «$» suelto marca el
 * comienzo de matemática que ya no se puede leer: de ahí en adelante se resume.
 */
export function plainSnippet(raw: string): string {
  let text = (raw ?? "").replace(/<\/?(?:b|mark|em|strong)>/gi, "");

  // matemática emparejada
  text = text.replace(/\$\$[^$]*\$\$/g, "…").replace(/\$[^$\n]+\$/g, "…");
  // matemática abierta por el recorte del fragmento
  const open = text.indexOf("$");
  if (open >= 0) text = `${text.slice(0, open)}…`;

  text = text
    // wikilinks: se leen por su texto
    .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_m, target: string, alias?: string) => alias ?? target)
    // enlaces e imágenes de markdown: se leen por su rótulo
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    // negrita, cursiva y código
    .replace(/(\*\*|__)(.+?)\1/g, "$2")
    .replace(/(?:^|(?<=\s))([*_])(?=\S)([^*_\n]+?)\1(?=$|[\s.,;:)!?])/g, "$2")
    .replace(/`+/g, "")
    // encabezados, citas y viñetas al principio de una línea
    .replace(/^[ \t]{0,3}#{1,6}[ \t]+/gm, "")
    .replace(/^[ \t]{0,3}>[ \t]?/gm, "")
    .replace(/^[ \t]{0,3}[-*+][ \t]+/gm, "")
    .replace(/\s+/g, " ")
    .trim();

  // varios recortes seguidos se leen como uno solo
  return text.replace(/…(?:\s*…)+/g, "…");
}

/** Parte un texto por el término buscado (sin distinguir mayúsculas). */
export function highlight(text: string, term: string): Array<{ text: string; hit: boolean }> {
  const needle = term.trim();
  if (!needle) return [{ text, hit: false }];
  const out: Array<{ text: string; hit: boolean }> = [];
  const lowerText = text.toLowerCase();
  const lowerNeedle = needle.toLowerCase();
  let from = 0;
  for (;;) {
    const at = lowerText.indexOf(lowerNeedle, from);
    if (at === -1) break;
    if (at > from) out.push({ text: text.slice(from, at), hit: false });
    out.push({ text: text.slice(at, at + needle.length), hit: true });
    from = at + needle.length;
  }
  if (from < text.length) out.push({ text: text.slice(from), hit: false });
  return out.length ? out : [{ text, hit: false }];
}

export function SearchPalette({ model, open, onClose }: SearchPaletteProps) {
  const navigate = useNavigate();
  const [term, setTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const listId = useId();
  const optionId = useCallback((i: number) => `${listId}-opt-${i}`, [listId]);

  useEffect(() => {
    if (!open) return;
    setTerm("");
    setDebounced("");
    setCursor(0);
    restoreRef.current = document.activeElement as HTMLElement | null;
    const id = window.setTimeout(() => inputRef.current?.focus(), 0);
    const restore = restoreRef.current;
    return () => {
      window.clearTimeout(id);
      restore?.focus?.();
    };
  }, [open]);

  /* Trampa de Tab: mientras la paleta está abierta, el foco no se va del diálogo. */
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const nodes = [...(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])].filter(
        (n) => n.offsetParent !== null || n === document.activeElement,
      );
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (!first || !last) return;
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [open]);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(term), 150);
    return () => window.clearTimeout(id);
  }, [term]);

  const search = useSearch(model.slug, debounced, open);

  const railRow = useCallback(
    (group: RailGroupView, view: RailItemView): Row => ({
      key: `rail:${group.id}:${view.item.id}`,
      kind: "rail",
      label: view.item.label,
      meta: group.label,
      snippet: null,
      to: view.to,
      href: view.href,
      icon: <Icon name={view.item.icon} size={15} />,
    }),
    [],
  );

  /**
   * Las tandas de la paleta, con su encabezado. Es el «ir a» de la materia: con
   * la consulta VACÍA lista todas las herramientas agrupadas por intención
   * (core.js:2150-2157), y con consulta emite «Herramientas» y «Páginas (N)»
   * como el baseline (core.js:2151-2214).
   */
  const sections = useMemo<Section[]>(() => {
    const raw = debounced.trim();
    const needle = norm(raw);

    /* Sin escribir nada: el menú entero, por secciones. Abrir ⌘K y pulsar Enter
       lleva a Inicio, que es la primera fila. */
    if (!needle) {
      return model.railGroups
        .map((group) => ({ title: group.label, rows: group.items.map((view) => railRow(group, view)) }))
        .filter((s) => s.rows.length > 0);
    }

    const terms = needle.split(/\s+/).filter(Boolean);
    const out: Section[] = [];

    /* Los ítems del rail se buscan también por su sección y por su ruta
       (`NAV_INDEX`, core.js:2075-2079), a principio de palabra y sin tope. */
    const railRows: Row[] = [];
    for (const group of model.railGroups) {
      for (const view of group.items) {
        const hay = norm(`${view.item.label} ${group.label} ${view.to ?? view.href ?? ""}`);
        if (!terms.every((t) => wordStart(hay, t))) continue;
        railRows.push(railRow(group, view));
      }
    }
    if (railRows.length) out.push({ title: "Herramientas", rows: railRows });

    const hits: SearchHit[] = search.data ?? [];
    const pageRows: Row[] = hits
      .map((hit) => {
        const known = model.bySlug.get(hit.slug);
        const division = model.division(known ? model.divisionOf(known) : hit.division);
        const content = known ? model.isContent(known) : countsAsContent(model.config, hit.type);
        return {
          hit,
          score: scorePage({ title: hit.title, hay: norm(`${hit.title} ${hit.slug}`), content }, needle, terms),
          row: {
            key: `page:${hit.slug}`,
            kind: "page" as const,
            label: hit.title,
            meta: `${division?.short ?? hit.division} · ${model.typeLabel(hit.type)}`,
            snippet: plainSnippet(hit.snippet),
            to: routes.page(model.slug, hit.slug),
            href: null,
            icon: <UiIcon name="file" size={15} />,
          },
        };
      })
      /* A igualdad de puntaje gana el título más corto: la página más general. */
      .sort((a, b) => b.score - a.score || a.hit.title.length - b.hit.title.length)
      .map((x) => x.row);
    if (pageRows.length) out.push({ title: `Páginas (${pageRows.length})`, rows: pageRows });

    return out;
  }, [debounced, model, search.data, railRow]);

  /* La lista plana: es la que recorren las flechas y la que nombra
     `aria-activedescendant`. */
  const rows = useMemo<Row[]>(() => sections.flatMap((s) => s.rows), [sections]);

  useEffect(() => {
    setCursor((c) => (c < rows.length ? c : 0));
  }, [rows.length]);

  /* La fila activa se mantiene a la vista aunque el foco no se mueva de la entrada. */
  useEffect(() => {
    if (!open) return;
    document.getElementById(optionId(cursor))?.scrollIntoView({ block: "nearest" });
  }, [cursor, open, optionId]);

  if (!open) return null;

  const go = (row: Row | undefined) => {
    if (!row) return;
    if (row.href) window.open(row.href, "_blank", "noopener,noreferrer");
    else if (row.to) navigate(row.to);
    onClose();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setCursor((c) => (rows.length ? (c + 1) % rows.length : 0));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setCursor((c) => (rows.length ? (c - 1 + rows.length) % rows.length : 0));
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      go(rows[cursor]);
    }
  };

  const searched = debounced.trim();
  /* Posición de cada fila en la lista plana: las tandas se dibujan anidadas pero
     el cursor y `aria-activedescendant` cuentan corrido. */
  const flatIndex = new Map(rows.map((row, i) => [row.key, i]));
  const index = (key: string): number => flatIndex.get(key) ?? 0;

  return (
    <div className={css.scrim} onMouseDown={onClose} role="presentation">
      <div
        className={css.palette}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Buscar en la materia"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className={css.field}>
          <UiIcon name="search" size={16} />
          <input
            ref={inputRef}
            className={css.input}
            type="text"
            role="combobox"
            aria-expanded={rows.length > 0}
            aria-controls={listId}
            aria-activedescendant={rows.length ? optionId(cursor) : undefined}
            aria-autocomplete="list"
            value={term}
            placeholder="Buscar páginas y herramientas…"
            aria-label="Buscar páginas y herramientas de la materia"
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setTerm(e.target.value)}
          />
          <kbd className={css.kbd}>Esc</kbd>
        </div>

        {/* Lo que un lector de pantalla necesita saber sin ver la lista. */}
        <p className={css.srOnly} role="status" aria-live="polite">
          {searched ? `${rows.length} ${plural(rows.length, "resultado", "resultados")}` : ""}
        </p>

        <div className={css.results}>
          {searched && search.isFetching && !rows.length ? (
            <p className={css.hint}>Buscando…</p>
          ) : searched && !rows.length ? (
            <p className={css.hint}>Sin resultados para «{searched}».</p>
          ) : null}

          {/* Las tandas se anuncian como `group` dentro de la `listbox`: el
              índice de las filas sigue siendo plano (`aria-activedescendant`) y
              el encabezado dice cuánto hay antes de recorrerlo. */}
          <div className={css.list} id={listId} role="listbox" aria-label="Resultados de la búsqueda">
            {sections.map((section) => (
              <div key={section.title} className={css.section} role="group" aria-label={section.title}>
                <div className={css.groupHead} aria-hidden="true">
                  {section.title}
                </div>
                {section.rows.map((row) => {
                  const i = index(row.key);
                  return (
                    <button
                      key={row.key}
                      id={optionId(i)}
                      type="button"
                      role="option"
                      tabIndex={-1}
                      aria-selected={i === cursor}
                      className={css.row}
                      data-active={i === cursor ? "true" : undefined}
                      onMouseEnter={() => setCursor(i)}
                      onClick={() => go(row)}
                    >
                      <span className={css.rowIcon}>{row.icon}</span>
                      <span className={css.rowBody}>
                        <span className={css.rowTitle}>
                          {highlight(row.label, debounced).map((part, k) =>
                            part.hit ? <mark key={k}>{part.text}</mark> : <span key={k}>{part.text}</span>,
                          )}
                        </span>
                        {row.snippet ? (
                          <span className={css.rowSnippet}>
                            {highlight(row.snippet, debounced).map((part, k) =>
                              part.hit ? <mark key={k}>{part.text}</mark> : <span key={k}>{part.text}</span>,
                            )}
                          </span>
                        ) : null}
                      </span>
                      <span className={css.rowMeta}>{row.meta}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className={css.foot}>
          <span>
            <kbd className={css.kbd}>↑</kbd>
            <kbd className={css.kbd}>↓</kbd> moverse
          </span>
          <span>
            <kbd className={css.kbd}>↵</kbd> abrir
          </span>
          <span>
            <kbd className={css.kbd}>Esc</kbd> cerrar
          </span>
        </div>
      </div>
    </div>
  );
}
