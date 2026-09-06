/**
 * Paleta de búsqueda (⌘K / Ctrl+K, o «/» fuera de un campo).
 *
 * Busca páginas en el API (con 150 ms de rebote) y, además, ofrece los ítems del
 * rail que coincidan por rótulo: dentro de una materia, «ir a» y «buscar» son la
 * misma pregunta.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { routes, type SearchHit } from "@sinapsis/contract";
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

/** Quita los marcadores del snippet del API: acá el resaltado lo hacemos nosotros. */
export function plainSnippet(raw: string): string {
  return raw.replace(/<\/?(?:b|mark|em|strong)>/gi, "").trim();
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
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setTerm("");
    setDebounced("");
    setCursor(0);
    const id = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(id);
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

  return (
    <div className={css.scrim} onMouseDown={onClose} role="presentation">
      <div
        className={css.palette}
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
            value={term}
            placeholder="Buscar páginas…"
            aria-label="Buscar páginas"
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setTerm(e.target.value)}
          />
          <kbd className={css.kbd}>Esc</kbd>
        </div>

        <div className={css.results} ref={listRef}>
          {!debounced.trim() ? (
            <p className={css.hint}>Escriba para buscar páginas, fórmulas o herramientas de la materia.</p>
          ) : search.isFetching && !rows.length ? (
            <p className={css.hint}>Buscando…</p>
          ) : !rows.length ? (
            <p className={css.hint}>Sin resultados para «{debounced.trim()}».</p>
          ) : (
            rows.map((row, i) => (
              <button
                key={row.key}
                type="button"
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
            ))
          )}
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
