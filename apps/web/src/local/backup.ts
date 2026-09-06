/**
 * Copia de seguridad del estado personal.
 *
 * El archivo que se descarga ES el documento que la plataforma guarda
 * (`LocalBackup`) más un `exportedAt`: exportar es escribirlo, importar es
 * validarlo y reemplazar. No hay conversión ni formato intermedio, así que una
 * copia vieja sigue abriéndose mientras `BACKUP_FORMAT` no cambie.
 *
 * Es la única red de seguridad que tiene el estudiante: si borra los datos del
 * sitio o cambia de computadora, esto es lo que se lleva.
 */
import { emptyBackup, type LocalBackup } from "@sinapsis/contract/site";
import { clearCatalogCache } from "./catalog";
import { clearSearchIndexes } from "./client";
import { clearPersisted, flush } from "./persist";
import { getState, parseBackup, replace } from "./state";

/** `sinapsis-backup-2026-09-06.json`. */
export function backupFileName(date = new Date()): string {
  const iso = Number.isNaN(date.getTime()) ? new Date() : date;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `sinapsis-backup-${iso.getFullYear()}-${pad(iso.getMonth() + 1)}-${pad(iso.getDate())}.json`;
}

/** El documento vigente, sellado con la fecha de exportación. */
export function exportBackup(at = new Date()): LocalBackup {
  return { ...getState(), exportedAt: at.toISOString() };
}

/** El archivo, ya serializado (con sangría: es un archivo que alguien puede abrir). */
export function serializeBackup(at = new Date()): string {
  return `${JSON.stringify(exportBackup(at), null, 2)}\n`;
}

/**
 * Dispara la descarga del archivo. Devuelve el nombre usado para poder avisarlo.
 * En un entorno sin DOM (pruebas) no hace nada más que devolver el nombre.
 */
export function downloadBackup(at = new Date()): string {
  const name = backupFileName(at);
  if (typeof document === "undefined" || typeof URL.createObjectURL !== "function") return name;

  const blob = new Blob([serializeBackup(at)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  /* Revocar en el mismo turno cancela la descarga en algunos navegadores. */
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
  return name;
}

/**
 * Valida el texto de un archivo de copia. Lanza un error con el motivo en
 * castellano: es lo que ve el usuario en el diálogo de «Restaurar copia».
 */
export function parseBackupFile(text: string): LocalBackup {
  let raw: unknown;
  try {
    raw = JSON.parse(text) as unknown;
  } catch {
    throw new Error("El archivo no es un JSON válido.");
  }
  const parsed = parseBackup(raw);
  if (!parsed) throw new Error("El archivo no es una copia de seguridad de Sinapsis.");
  return parsed;
}

/** Lee un archivo elegido con `<input type="file">` y lo valida. */
export async function readBackupFile(file: Blob): Promise<LocalBackup> {
  return parseBackupFile(await file.text());
}

/**
 * Reemplaza TODO el estado personal por el de la copia y lo baja al almacén de
 * inmediato: la fecha de guardado es la de ahora, así esta copia le gana a
 * cualquier resto que haya quedado en el espejo.
 */
export async function importBackup(doc: LocalBackup): Promise<void> {
  const { exportedAt: _ignored, ...rest } = doc;
  replace({ ...rest });
  clearSearchIndexes();
  await flush();
}

/** «Borrar todo lo local»: el documento vuelve a cero y el almacén se vacía. */
export async function clearAllLocal(): Promise<void> {
  replace(emptyBackup(new Date().toISOString()));
  clearSearchIndexes();
  clearCatalogCache();
  await clearPersisted();
}
