import { PageMeta, SubjectConfigLoose } from "@sinapsis/contract";
import type { SubjectContext } from "../src/compat.js";

/** Config mínima de materia, validada por el contrato (rellena los defaults). */
export const config = SubjectConfigLoose.parse({
  slug: "proba",
  name: "Probabilidad y Estadística",
  code: "22.14",
  institution: "ITBA",
  division: { singular: "Unidad", abbr: "U", plural: "Unidades" },
  divisions: [
    { key: "1", name: "Probabilidad" },
    { key: "2", name: "Variables aleatorias" },
    { key: "eval", name: "Evaluaciones", kind: "extra" },
  ],
  pageTypes: [
    { key: "apunte", label: "Apunte", plural: "Apuntes" },
    { key: "fuente", label: "Fuente", plural: "Fuentes", countsAsContent: false },
  ],
});

function page(slug: string, title: string, division: string, type = "apunte") {
  return PageMeta.parse({
    slug,
    title,
    type,
    division,
    folder: "",
    tags: [],
    sources: [],
    updatedAt: "2026-09-01",
    summary: "",
    words: 100,
  });
}

export const pages = [
  page("intro", "Introducción", "1"),
  page("normal", "Distribución normal", "2"),
  page("apunte-catedra", "Apunte de cátedra", "2", "fuente"),
];

/** Contexto de materia para las pruebas, con `navigate` y `toast` espiables. */
export function makeContext(over: Partial<SubjectContext> = {}): SubjectContext & {
  navigated: Array<{ path: string; opts?: { replace?: boolean } }>;
  toasts: Array<{ message: string; tone?: string }>;
} {
  const navigated: Array<{ path: string; opts?: { replace?: boolean } }> = [];
  const toasts: Array<{ message: string; tone?: string }> = [];
  return {
    slug: "proba",
    config,
    pages,
    studied: new Set<string>(["intro"]),
    navigate(path: string, opts?: { replace?: boolean }) {
      navigated.push({ path, opts });
    },
    toast(message: string, tone?: "ok" | "bad") {
      toasts.push({ message, tone });
    },
    theme: "pergamino",
    navigated,
    toasts,
    ...over,
  };
}
