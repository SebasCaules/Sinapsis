/**
 * La lógica pura de «Mis apuntes»: el orden de la lista, el filtro del buscador
 * y la exportación a markdown. Vive fuera de la vista para poder probarse.
 *
 * Son funciones puras y probadas porque el archivo que baja el usuario es un
 * entregable: tiene que abrirse en Obsidian igual que el resto del wiki, con un
 * H1 por materia, un H2 por página y la referencia de vuelta al wiki.
 *
 * El documento completo se ordena por el temario (división y, dentro, título) y
 * NO por fecha: así dos exportaciones seguidas producen el mismo archivo aunque
 * en el medio se haya releído o retocado un apunte, y el diff sirve para quien
 * versiona el .md en su bóveda. El orden por fecha queda para la pantalla.
 */
import type { Note } from "@sinapsis/contract";
import type { SubjectModel } from "../model";

/** Minúsculas y sin acentos: «Estadística» se encuentra escribiendo «estadistica». */
export function fold(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * ¿El apunte responde a la búsqueda? Como en el baseline, se busca en el título
 * de la página Y en el cuerpo del apunte: lo que uno recuerda de lo que escribió
 * casi nunca es el título.
 */
export function noteMatches(model: SubjectModel, note: Note, folded: string): boolean {
  if (!folded) return true;
  const title = model.bySlug.get(note.page)?.title ?? note.page;
  return fold(title).includes(folded) || fold(note.body).includes(folded);
}

/** Título de la sección del borrador general (también en la vista). */
export const SCRATCH_HEADING = "Borrador general";

/** Fecha corta y estable para el documento: AAAA-MM-DD (sin zona horaria local). */
export function isoDay(value: string): string {
  const at = Date.parse(value);
  if (Number.isNaN(at)) return value.slice(0, 10);
  return new Date(at).toISOString().slice(0, 10);
}

/** Apuntes ordenados por fecha, del más reciente al más viejo (orden de pantalla). */
export function sortNotes(notes: readonly Note[]): Note[] {
  return [...notes].sort((a, b) => (Date.parse(b.updatedAt) || 0) - (Date.parse(a.updatedAt) || 0));
}

/**
 * Apuntes en el orden del temario: primero la división (el orden del modelo, el
 * mismo que usan el índice y Favoritos) y dentro de cada una el título. Las
 * páginas que ya no están en el wiki van al final, por su slug.
 */
export function orderNotesByProgram(model: SubjectModel, notes: readonly Note[]): Note[] {
  const rank = new Map(model.divisions.map((d, i) => [d.key, i]));
  const key = (note: Note): { rank: number; title: string } => {
    const page = model.bySlug.get(note.page);
    const division = page ? rank.get(model.divisionOf(page)) : undefined;
    return { rank: division ?? Number.MAX_SAFE_INTEGER, title: page?.title ?? note.page };
  };
  return [...notes].sort((a, b) => {
    const ka = key(a);
    const kb = key(b);
    if (ka.rank !== kb.rank) return ka.rank - kb.rank;
    return ka.title.localeCompare(kb.title, "es");
  });
}

/** `*U1 · Estadística Descriptiva · Concepto · 2026-09-01*` */
function metaLine(model: SubjectModel, note: Note): string {
  const page = model.bySlug.get(note.page);
  const division = page ? model.division(model.divisionOf(page)) : undefined;
  return [division?.label, page ? model.typeLabel(page.type) : null, isoDay(note.updatedAt)]
    .filter((x): x is string => Boolean(x))
    .join(" · ");
}

/** Cuerpo de una sección: la metalínea, el apunte y el wikilink de vuelta. */
function noteBlock(model: SubjectModel, note: Note): string[] {
  return [
    "",
    `*${metaLine(model, note)}*`,
    "",
    note.body.trim(),
    "",
    /* El wikilink cierra el círculo: el archivo exportado devuelve al wiki. */
    `[[${note.page}]]`,
    "",
  ];
}

/**
 * `# Mis apuntes — <materia>` y una sección por página, con su división, su tipo
 * y la fecha del apunte. `now` se pasa a propósito (no se lee del reloj) para
 * que el documento sea reproducible y se pueda probar.
 *
 * `scratch` es el borrador general de la materia: va primero y separado por una
 * regla, como en el baseline; no cuenta como apunte de página.
 */
export function notesMarkdown(
  model: SubjectModel,
  notes: readonly Note[],
  now: string,
  scratch = "",
): string {
  const ordered = orderNotesByProgram(
    model,
    notes.filter((n) => n.body.trim().length > 0),
  );
  const lines: string[] = [`# Mis apuntes — ${model.config.name}`, ""];
  lines.push(`> ${ordered.length} ${ordered.length === 1 ? "apunte" : "apuntes"} · ${model.config.code} · exportado el ${isoDay(now)}`);
  lines.push("");

  if (scratch.trim()) {
    lines.push(`## ${SCRATCH_HEADING}`);
    lines.push("");
    lines.push(scratch.trim());
    lines.push("");
    lines.push("---");
    lines.push("");
  }

  if (!ordered.length) {
    lines.push("_Todavía no hay apuntes en esta materia._");
    lines.push("");
    return lines.join("\n");
  }

  for (const note of ordered) {
    const page = model.bySlug.get(note.page);
    lines.push(`## ${page?.title ?? note.page}`);
    lines.push(...noteBlock(model, note));
  }

  return lines.join("\n");
}

/**
 * Un apunte suelto, para el botón «Exportar» de su tarjeta: mismo encabezado,
 * misma metalínea y mismo wikilink que la sección del documento completo, pero
 * con el título como H1 porque el archivo es solo de esa página.
 */
export function noteMarkdown(model: SubjectModel, note: Note): string {
  const page = model.bySlug.get(note.page);
  return [`# ${page?.title ?? note.page}`, ...noteBlock(model, note)].join("\n");
}

/** Nombre del archivo que se descarga: `apuntes-<materia>-AAAA-MM-DD.md`. */
export function notesFilename(slug: string, now: string): string {
  return `apuntes-${slug}-${isoDay(now)}.md`;
}

/** Nombre del archivo de un apunte suelto: `apunte-<página>-AAAA-MM-DD.md`. */
export function noteFilename(page: string, updatedAt: string): string {
  return `apunte-${page}-${isoDay(updatedAt)}.md`;
}
