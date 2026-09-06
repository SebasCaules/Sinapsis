/**
 * Avisos efímeros. El store es de módulo (no de contexto) para que `useToast()`
 * funcione en cualquier profundidad sin envolver el árbol; `<Toaster/>` se monta
 * una sola vez en AppRoot.
 */
import { useEffect } from "react";
import { create } from "zustand";
import css from "./Toast.module.css";

export type ToastTone = "info" | "good" | "bad";
export interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

interface ToastState {
  items: ToastItem[];
  push: (message: string, tone: ToastTone) => void;
  dismiss: (id: number) => void;
}

let seq = 0;
const useToastStore = create<ToastState>((set) => ({
  items: [],
  push: (message, tone) => set((s) => ({ items: [...s.items, { id: ++seq, message, tone }] })),
  dismiss: (id) => set((s) => ({ items: s.items.filter((t) => t.id !== id) })),
}));

export const TOAST_MS = 3000;

export function useToast() {
  const push = useToastStore((s) => s.push);
  return {
    toast: (message: string, tone: ToastTone = "info") => push(message, tone),
  };
}

export function Toaster() {
  const items = useToastStore((s) => s.items);
  const dismiss = useToastStore((s) => s.dismiss);
  if (items.length === 0) return null;
  return (
    <div className={css.layer} role="status" aria-live="polite">
      {items.map((t) => (
        <ToastRow key={t.id} item={t} onDone={dismiss} />
      ))}
    </div>
  );
}

/** Cada aviso lleva su propio reloj: uno nuevo no reinicia el de los anteriores. */
function ToastRow({ item, onDone }: { item: ToastItem; onDone: (id: number) => void }) {
  useEffect(() => {
    const timer = window.setTimeout(() => onDone(item.id), TOAST_MS);
    return () => window.clearTimeout(timer);
  }, [item.id, onDone]);
  return (
    <div className={css.toast} data-tone={item.tone}>
      {item.message}
    </div>
  );
}
