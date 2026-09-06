import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { UiIcon } from "./Icon";
import css from "./Dialog.module.css";

const FOCUSABLE =
  'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  children: ReactNode;
  footer?: ReactNode;
  /** Ancho del panel; 520 px es el del mockup. */
  width?: number;
}

/**
 * Diálogo modal de la plataforma. Cierra con Esc o clic fuera; al abrirse deja
 * el foco en el primer campo y lo devuelve al cerrarse.
 */
export function Dialog({ open, onClose, title, eyebrow, children, footer, width = 520 }: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement | null;
    const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const nodes = [...(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])].filter(
        (n) => n.offsetParent !== null || n === document.activeElement,
      );
      const firstNode = nodes[0];
      const lastNode = nodes[nodes.length - 1];
      if (!firstNode || !lastNode) return;
      if (!e.shiftKey && document.activeElement === lastNode) {
        e.preventDefault();
        firstNode.focus();
      } else if (e.shiftKey && document.activeElement === firstNode) {
        e.preventDefault();
        lastNode.focus();
      }
    }
    document.addEventListener("keydown", onKey, true);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = prevOverflow;
      restoreRef.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  const node = (
    <div
      className={css.overlay}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={css.panel} style={{ width }} ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className={css.head}>
          {eyebrow ? <span className={css.eyebrow}>{eyebrow}</span> : null}
          <h2 className={css.title} id={titleId}>
            {title}
          </h2>
          <button type="button" className={css.close} onClick={onClose} aria-label="Cerrar">
            <UiIcon name="close" size={14} />
          </button>
        </div>
        <div className={css.body}>{children}</div>
        {footer ? <div className={css.foot}>{footer}</div> : null}
      </div>
    </div>
  );

  return typeof document === "undefined" ? node : createPortal(node, document.body);
}
