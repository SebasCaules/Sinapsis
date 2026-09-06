/**
 * Selector de fecha de la plataforma: reemplaza al <input type="date"> nativo,
 * que cambia de forma, de idioma y de teclado en cada navegador y no acepta los
 * tokens del tema. El valor de la API es SIEMPRE «AAAA-MM-DD» o null —nunca un
 * `Date`—, así que el componente entra y sale del mismo texto que ya viaja al
 * servidor y no hay conversión de zona horaria en el medio.
 *
 * CÓMO IMPORTARLO: `import { DatePicker } from "@/components/platform"`. En
 * macOS el sistema de archivos no distingue mayúsculas, así que `"./DatePicker"`
 * a secas encuentra primero `datePicker.ts` (la lógica pura) y TS lo rechaza con
 * TS1261; el índice de la plataforma ya lo reexporta con la extensión explícita.
 *
 * El calendario vive en un portal a <body> y se coloca a mano (position: fixed)
 * bajo el disparador: dentro del flujo lo recortaba el `overflow` de la tarjeta
 * del plan. No es modal (aria-modal="false"): no atrapa el foco, solo se cierra
 * al salir de él, al hacer clic fuera o con Escape.
 */
import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { UiIcon } from "./Icon";
import {
  type CalendarDate,
  WEEKDAYS,
  WEEKDAYS_SHORT,
  addDays,
  addMonths,
  addYears,
  clamp,
  compare,
  daysInMonth,
  formatIso,
  formatLong,
  formatMonthYear,
  formatShort,
  isOutOfRange,
  isSameDay,
  isWeekend,
  monthGrid,
  parseIso,
  today as todayOf,
  weekdayIndex,
} from "./datePicker";
import css from "./DatePicker.module.css";

export interface DatePickerProps {
  /** Fecha elegida como «AAAA-MM-DD», o null si no hay ninguna. Controlado. */
  value: string | null;
  onChange: (value: string | null) => void;
  /** Nombre accesible del control (obligatorio: el disparador no tiene <label>). */
  label: string;
  /** Texto del disparador cuando no hay fecha. */
  placeholder?: string;
  /** Límites del rango, «AAAA-MM-DD». Los días fuera quedan deshabilitados. */
  min?: string;
  max?: string;
  disabled?: boolean;
  id?: string;
  /** Muestra el botón «Quitar fecha» cuando hay valor. */
  clearable?: boolean;
  size?: "sm" | "md";
}

const GAP = 6;
const MARGIN = 8;

/** Botones que participan del Tab dentro del calendario, en orden de documento. */
function tabbables(root: HTMLElement | null): HTMLElement[] {
  if (!root) return [];
  return [...root.querySelectorAll<HTMLElement>("button:not([disabled])")].filter((n) => n.tabIndex >= 0);
}

export function DatePicker({
  value,
  onChange,
  label,
  placeholder = "Sin fecha",
  min,
  max,
  disabled,
  id,
  clearable = true,
  size = "md",
}: DatePickerProps) {
  const autoId = useId();
  const rootId = id ?? `dp-${autoId}`;
  const popId = `${rootId}-cal`;
  const monthId = `${rootId}-month`;

  const selected = useMemo(() => parseIso(value), [value]);
  const minDate = useMemo(() => parseIso(min), [min]);
  const maxDate = useMemo(() => parseIso(max), [max]);
  const today = useMemo(() => todayOf(), []);

  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState<CalendarDate>(() => clamp(selected ?? today, minDate, maxDate));
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  /** true cuando el próximo pintado tiene que llevar el foco a la celda del cursor. */
  const wantCellFocus = useRef(false);

  const openCalendar = useCallback(() => {
    if (disabled) return;
    setCursor(clamp(selected ?? today, minDate, maxDate));
    wantCellFocus.current = true;
    setOpen(true);
  }, [disabled, selected, today, minDate, maxDate]);

  const closeCalendar = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    setPos(null);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);

  const choose = useCallback(
    (d: CalendarDate) => {
      if (isOutOfRange(d, minDate, maxDate)) return;
      onChange(formatIso(d));
      closeCalendar(true);
    },
    [minDate, maxDate, onChange, closeCalendar],
  );

  /* ---- colocación: bajo el disparador, o arriba si no entra, siempre dentro
     de la ventana con 8 px de margen. Se recalcula al redimensionar y al
     desplazar (en captura, para enterarse también del scroll de un panel). ---- */
  const place = useCallback(() => {
    const trigger = triggerRef.current;
    const pop = popRef.current;
    if (!trigger || !pop) return;
    const r = trigger.getBoundingClientRect();
    const w = pop.offsetWidth || 272;
    const h = pop.offsetHeight || 322;
    const left = Math.max(MARGIN, Math.min(r.left, window.innerWidth - w - MARGIN));
    let top = r.bottom + GAP;
    if (top + h > window.innerHeight - MARGIN) {
      const above = r.top - GAP - h;
      top = above >= MARGIN ? above : Math.max(MARGIN, window.innerHeight - h - MARGIN);
    }
    setPos({ top, left });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, place]);

  /* Foco de la celda: al abrir y en cada movimiento de teclado. */
  useLayoutEffect(() => {
    if (!open || !wantCellFocus.current) return;
    wantCellFocus.current = false;
    popRef.current?.querySelector<HTMLElement>(`[data-date="${formatIso(cursor)}"]`)?.focus();
  }, [open, cursor]);

  /* Escape y clic fuera. Escape va en captura para ganarle a cualquier diálogo
     que contenga al selector: primero cierra el calendario, no la ventana. */
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      e.preventDefault();
      e.stopPropagation();
      closeCalendar(true);
    }
    function onDown(e: MouseEvent) {
      const t = e.target as Node;
      if (wrapRef.current?.contains(t) || popRef.current?.contains(t)) return;
      closeCalendar(false);
    }
    document.addEventListener("keydown", onKey, true);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open, closeCalendar]);

  function onTriggerKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      /* preventDefault evita que el navegador convierta la tecla en un `click`
         y vuelva a alternar lo que acabamos de abrir. */
      e.preventDefault();
      if (open) closeCalendar(false);
      else openCalendar();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) openCalendar();
      return;
    }
    if (e.key === "Tab" && open && !e.shiftKey) {
      const first = tabbables(popRef.current)[0];
      if (first) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function onPopKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Tab") return;
    const nodes = tabbables(popRef.current);
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    const active = document.activeElement;
    if ((!e.shiftKey && active === last) || (e.shiftKey && active === first)) {
      /* Salir del calendario con Tab lo cierra y devuelve el foco al disparador. */
      e.preventDefault();
      closeCalendar(true);
    }
  }

  function onGridKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    let next: CalendarDate | null = null;
    switch (e.key) {
      case "ArrowLeft":
        next = addDays(cursor, -1);
        break;
      case "ArrowRight":
        next = addDays(cursor, 1);
        break;
      case "ArrowUp":
        next = addDays(cursor, -7);
        break;
      case "ArrowDown":
        next = addDays(cursor, 7);
        break;
      case "Home":
        next = addDays(cursor, -weekdayIndex(cursor));
        break;
      case "End":
        next = addDays(cursor, 6 - weekdayIndex(cursor));
        break;
      case "PageUp":
        next = e.shiftKey ? addYears(cursor, -1) : addMonths(cursor, -1);
        break;
      case "PageDown":
        next = e.shiftKey ? addYears(cursor, 1) : addMonths(cursor, 1);
        break;
      case "Enter":
      case " ":
      case "Spacebar":
        e.preventDefault();
        choose(cursor);
        return;
      default:
        return;
    }
    e.preventDefault();
    wantCellFocus.current = true;
    setCursor(clamp(next, minDate, maxDate));
  }

  const rows = useMemo(() => monthGrid(cursor.year, cursor.month), [cursor.year, cursor.month]);
  const firstOfView: CalendarDate = { year: cursor.year, month: cursor.month, day: 1 };
  const lastOfView: CalendarDate = {
    year: cursor.year,
    month: cursor.month,
    day: daysInMonth(cursor.year, cursor.month),
  };
  const prevDisabled = !!minDate && compare(firstOfView, minDate) <= 0;
  const nextDisabled = !!maxDate && compare(lastOfView, maxDate) >= 0;
  const todayDisabled = isOutOfRange(today, minDate, maxDate);

  function goMonth(delta: number) {
    setCursor((c) => clamp(addMonths(c, delta), minDate, maxDate));
  }

  const calendar = (
    <div
      ref={popRef}
      id={popId}
      role="dialog"
      aria-modal="false"
      aria-label={`Elegir fecha: ${label}`}
      className={css.pop}
      style={{ top: pos?.top ?? -9999, left: pos?.left ?? -9999 }}
      onKeyDown={onPopKeyDown}
    >
      <div className={css.head}>
        <button
          type="button"
          className={css.nav}
          aria-label="Mes anterior"
          disabled={prevDisabled}
          onClick={() => goMonth(-1)}
        >
          <UiIcon name="chevronLeft" size={16} />
        </button>
        <span className={css.month} id={monthId} aria-live="polite">
          {formatMonthYear(cursor.year, cursor.month)}
        </span>
        <button
          type="button"
          className={css.nav}
          aria-label="Mes siguiente"
          disabled={nextDisabled}
          onClick={() => goMonth(1)}
        >
          <UiIcon name="chevronRight" size={16} />
        </button>
        <button
          type="button"
          className={css.today}
          disabled={todayDisabled}
          onClick={() => setCursor(clamp(today, minDate, maxDate))}
        >
          Hoy
        </button>
      </div>

      <div className={css.week} aria-hidden="true">
        {WEEKDAYS_SHORT.map((w, i) => (
          <abbr key={w} title={WEEKDAYS[i]}>
            {w}
          </abbr>
        ))}
      </div>

      <div role="grid" aria-labelledby={monthId} className={css.grid} onKeyDown={onGridKeyDown}>
        {rows.map((row, r) => (
          <div role="row" className={css.row} key={r}>
            {row.map((d) => {
              const iso = formatIso(d);
              const isSelected = isSameDay(d, selected);
              const outside = d.month !== cursor.month || d.year !== cursor.year;
              const off = isOutOfRange(d, minDate, maxDate);
              return (
                <button
                  key={iso}
                  type="button"
                  role="gridcell"
                  data-date={iso}
                  data-today={isSameDay(d, today) ? "true" : undefined}
                  data-outside={outside ? "true" : undefined}
                  data-weekend={isWeekend(d) ? "true" : undefined}
                  data-selected={isSelected ? "true" : undefined}
                  className={css.cell}
                  aria-label={formatLong(d)}
                  aria-selected={isSelected}
                  disabled={off}
                  tabIndex={isSameDay(d, cursor) ? 0 : -1}
                  onClick={() => choose(d)}
                >
                  {d.day}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={css.wrap} ref={wrapRef} data-size={size} data-open={open ? "true" : undefined}>
      <button
        type="button"
        ref={triggerRef}
        id={rootId}
        className={css.trigger}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? popId : undefined}
        aria-label={label}
        data-value={value ?? ""}
        data-empty={selected ? undefined : "true"}
        onClick={() => (open ? closeCalendar(false) : openCalendar())}
        onKeyDown={onTriggerKeyDown}
      >
        <UiIcon name="calendar" size={size === "sm" ? 13 : 14} className={css.ico} />
        <span className={css.sr}>{label}</span>
        <span className={css.text}>{selected ? formatShort(selected) : placeholder}</span>
      </button>
      {clearable && selected && !disabled ? (
        <button
          type="button"
          className={css.clear}
          aria-label={`Quitar fecha: ${label}`}
          title="Quitar fecha"
          onClick={() => {
            onChange(null);
            triggerRef.current?.focus();
          }}
        >
          <UiIcon name="close" size={12} />
        </button>
      ) : null}
      {open && typeof document !== "undefined" ? createPortal(calendar, document.body) : null}
    </div>
  );
}
