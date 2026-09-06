/**
 * Exportación de los apuntes a markdown (el botón de «Mis apuntes»).
 *
 * Es una función pura y probada porque el archivo que baja el usuario es un
 * entregable: tiene que abrirse en Obsidian igual que el resto del wiki, con un
 * H1 por materia, un H2 por página y la referencia de vuelta al wiki.
 */
import type { Note } from "@sinapsis/contract";
import type { SubjectModel } from "../model";

/** Fecha corta y estable para el documento: AAAA-MM-DD (sin zona horaria local). */
export function isoDay(value: string): string {
  const at = Date.parse(value);
  if (Number.isNaN(at)) return value.slice(0, 10);
  return new Date(at).toISOString().slice(0, 10);
}

/** Apuntes ordenados por fecha, del más reciente al más viejo. */
export function sortNotes(notes: readonly Note[]): Note[] {
  return [...notes].sort((a, b) => (Date.parse(b.updatedAt) || 0) - (Date.parse(a.updatedAt) || 0));
}

/**
 * `# Mis apuntes — <materia>` y una sección por página, con su división, su tipo
 * y la fecha del apunte. `now` se pasa a propósito (no se lee del reloj) para
 * que el documento sea reproducible y se pueda probar.
 */
export function notesMarkdown(model: SubjectModel, notes: readonly Note[], now: string): string {
  const ordered = sortNotes(notes).filter((n) => n.body.trim().length > 0);
  const lines: string[] = [`# Mis apuntes — ${model.config.name}`, ""];
  lines.push(`> ${ordered.length} ${ordered.length === 1 ? "apunte" : "apuntes"} · ${model.config.code} · exportado el ${isoDay(now)}`);
  lines.push("");

  if (!ordered.length) {
    lines.push("_Todavía no hay apuntes en esta materia._");
    lines.push("");
    return lines.join("\n");
  }

  for (const note of ordered) {
    const page = model.bySlug.get(note.page);
    const division = page ? model.division(model.divisionOf(page)) : undefined;
    const meta = [division?.label, page ? model.typeLabel(page.type) : null, isoDay(note.updatedAt)]
      .filter((x): x is string => Boolean(x))
      .join(" · ");
    lines.push(`## ${page?.title ?? note.page}`);
    lines.push("");
    lines.push(`*${meta}*`);
    lines.push("");
    lines.push(note.body.trim());
    lines.push("");
    /* El wikilink cierra el círculo: el archivo exportado devuelve al wiki. */
    lines.push(`[[${note.page}]]`);
    lines.push("");
  }

  return lines.join("\n");
}

/** Nombre del archivo que se descarga: `apuntes-<materia>-AAAA-MM-DD.md`. */
export function notesFilename(slug: string, now: string): string {
  return `apuntes-${slug}-${isoDay(now)}.md`;
}
