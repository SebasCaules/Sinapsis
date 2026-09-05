import type { ReactNode } from "react";
export function Dialog({ open, onClose, title, eyebrow, children, footer }: { open: boolean; onClose: () => void; title: string; eyebrow?: string; children: ReactNode; footer?: ReactNode }) {
  if (!open) return null;
  return <div role="dialog" aria-modal="true" aria-label={title}><button type="button" onClick={onClose} aria-label="Cerrar">×</button>{eyebrow}<h2>{title}</h2>{children}{footer}</div>;
}
