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
import { plural, routes, type SearchHit } from "@sinapsis/contract";
import { Icon, UiIcon } from "@/components/platform";
import type { SubjectModel } from "../model";
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

/* Las filas de resultado no se tabulan: se recorren con las flechas. */
const FOCUSABLE = 'input:not([disabled]), button:not([disabled]):not([tabindex="-1"]), [href]';

/**
 * Deja el snippet del API en prosa legible: fuera los marcadores del resaltado
 * (acá lo hacemos nosotros), fuera la sintaxis del wiki —un `[[slug|texto]]` se
 * lee por su texto— y la matemática se resume en «…», que es más honesto que
 * mostrar el LaTeX crudo en una lista.
 */
export function plainSnippet(raw: string): string {
  return (raw ?? "")
    .replace(/<\/?(?:b|mark|em|strong)>/gi, "")
    .replace(/\$\$[^$]*\$\$/g, "…")
    .replace(/\$[^$\n]+\$/g, "…")
    .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_m, target: string, alias?: string) => alias ?? target)
    .replace(/\s+/g, " ")
    .trim();
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

  const rows = useMemo<Row[]>(() => {
    const needle = debounced.trim().toLowerCase();
    if (!needle) return [];
    const railRows: Row[] = [];
    for (const group of model.railGroups) {
      for (const view of group.items) {
        if (!view.item.label.toLowerCase().includes(needle)) continue;
        railRows.push({
          key: `rail:${group.id}:${view.item.id}`,
          kind: "rail",
          label: view.item.label,
          meta: `Ir a · ${group.label}`,
          snippet: null,
          to: view.to,
          href: view.href,
          icon: <Icon name={view.item.icon} size={15} />,
        });
      }
    }
    const hits: SearchHit[] = search.data ?? [];
    const pageRows: Row[] = hits.map((hit) => {
      const known = model.bySlug.get(hit.slug);
      const division = model.division(known ? model.divisionOf(known) : hit.division);
      return {
        key: `page:${hit.slug}`,
        kind: "page",
        label: hit.title,
        meta: `${division?.short ?? hit.division} · ${model.typeLabel(hit.type)}`,
        snippet: plainSnippet(hit.snippet),
        to: routes.page(model.slug, hit.slug),
        href: null,
        icon: <UiIcon name="file" size={15} />,
      };
    });
    return [...railRows.slice(0, 4), ...pageRows];
  }, [debounced, model, search.data]);

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
            placeholder="Buscar páginas…"
            aria-label="Buscar páginas"
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
          {!searched ? (
            <p className={css.hint}>Escriba para buscar páginas, fórmulas o herramientas de la materia.</p>
          ) : search.isFetching && !rows.length ? (
            <p className={css.hint}>Buscando…</p>
          ) : !rows.length ? (
            <p className={css.hint}>Sin resultados para «{searched}».</p>
          ) : null}

          <div className={css.list} id={listId} role="listbox" aria-label="Resultados de la búsqueda">
            {rows.map((row, i) => (
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
