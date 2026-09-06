import { useEffect, useId, useRef, useState, type ChangeEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { LocalBackup } from "@sinapsis/contract/site";
import { useMe, useSetProfileName } from "@/lib/profile";
import { useUiStore } from "@/lib/store";
import { clearAllLocal, downloadBackup, importBackup, readBackupFile } from "@/local/backup";
import { Icon, UiIcon } from "./Icon";
import { Button } from "./Button";
import { Dialog } from "./Dialog";
import { useToast } from "./Toast";
import css from "./AvatarMenu.module.css";

/** "Sebastián Caules" → "SC"; con una sola palabra, sus dos primeras letras. */
export function initialsOf(name: string, fallback = ""): string {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  const first = parts[0] ?? "";
  const last = parts[parts.length - 1] ?? "";
  if (parts.length >= 2) return (first.charAt(0) + last.charAt(0)).toUpperCase();
  if (parts.length === 1) return first.slice(0, 2).toUpperCase();
  return (fallback.slice(0, 2) || "ES").toUpperCase();
}

/** Qué confirmación está abierta (las dos son destructivas y ninguna se deshace). */
type Confirm = { kind: "restore"; doc: LocalBackup; file: string } | { kind: "clear" };

/**
 * Menú del avatar. Sin sesión que cerrar: lo que hay detrás del avatar es el
 * PERFIL LOCAL (un nombre) y las tres cosas que se pueden hacer con el estado
 * guardado en este navegador — bajarlo, reponerlo y borrarlo.
 *
 * Las dos acciones destructivas confirman en un `Dialog` de la plataforma, no
 * con `window.confirm`: el diálogo del navegador no se puede leer ni estilar, y
 * en un menú que se cierra al perder el foco quedaba fuera de lugar.
 */
export function AvatarMenu() {
  const { data: me } = useMe();
  const setProfileName = useSetProfileName();
  const setTheme = useUiStore((s) => s.setTheme);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [confirm, setConfirm] = useState<Confirm | null>(null);
  const [busy, setBusy] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  /* El menú se cierra mientras hay una confirmación abierta: el diálogo es
     modal y el menú detrás no puede seguir recibiendo el foco. */
  useEffect(() => {
    if (confirm) setOpen(false);
  }, [confirm]);

  const name = me?.name || "Estudiante";
  const initials = initialsOf(name);

  function startEditing() {
    setDraft(name);
    setEditing(true);
    /* El campo aparece en este mismo render: el foco va después de pintarlo. */
    setTimeout(() => nameRef.current?.select(), 0);
  }

  function commitName() {
    const next = draft.trim();
    setEditing(false);
    if (!next || next === name) return;
    setProfileName.mutate(next);
  }

  // -------------------------------------------------------------------------
  // Copia de seguridad
  // -------------------------------------------------------------------------

  function onDownload() {
    setOpen(false);
    const file = downloadBackup();
    toast(`Se descargó «${file}».`, "good");
  }

  async function onPickFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    /* El input se vacía siempre: si no, elegir dos veces el mismo archivo no
       dispara un segundo `change`. */
    e.target.value = "";
    if (!file) return;
    try {
      setConfirm({ kind: "restore", doc: await readBackupFile(file), file: file.name });
    } catch (err) {
      toast(err instanceof Error ? err.message : "No se pudo leer el archivo.", "bad");
    }
  }

  /**
   * Después de reemplazar el estado, ninguna consulta sirve: se rehacen todas.
   * `resetQueries` (y no `clear` + `invalidateQueries`): con la caché vacía no
   * queda nada que invalidar y las vistas montadas se quedaban con lo último
   * dibujado hasta recargar (hallazgo de la suite E2E, `backup.spec`).
   */
  async function refreshEverything(theme: LocalBackup["profile"]["theme"]) {
    setTheme(theme, { push: false });
    await queryClient.resetQueries();
  }

  async function applyConfirm() {
    if (!confirm) return;
    setBusy(true);
    try {
      if (confirm.kind === "restore") {
        await importBackup(confirm.doc);
        await refreshEverything(confirm.doc.profile.theme);
        toast("Se restauró la copia de seguridad.", "good");
      } else {
        await clearAllLocal();
        await refreshEverything("pergamino");
        toast("Se borró todo lo guardado en este navegador.", "good");
      }
      setConfirm(null);
    } catch (err) {
      toast(err instanceof Error ? err.message : "No se pudo completar la operación.", "bad");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={css.wrap} ref={wrapRef}>
      <button
        ref={buttonRef}
        type="button"
        className={css.avatar}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={`Perfil de ${name}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={css.initials}>{initials}</span>
      </button>

      {open ? (
        <div className={css.menu} id={menuId} role="menu">
          <div className={css.head}>
            <span className={css.eyebrow}>PERFIL</span>
            {editing ? (
              <input
                ref={nameRef}
                className={css.nameInput}
                value={draft}
                maxLength={120}
                aria-label="Nombre"
                onChange={(e) => setDraft(e.target.value)}
                onBlur={commitName}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    commitName();
                  }
                  if (e.key === "Escape") {
                    e.stopPropagation();
                    setEditing(false);
                  }
                }}
              />
            ) : (
              <button type="button" className={css.nameButton} onClick={startEditing} aria-label={`Cambiar el nombre (${name})`}>
                <span className={css.name}>{name}</span>
                <Icon name="pencil" size={12} />
              </button>
            )}
          </div>

          <button type="button" role="menuitem" className={css.item} onClick={onDownload}>
            <UiIcon name="file" size={14} />
            Descargar copia de seguridad
          </button>

          <button type="button" role="menuitem" className={css.item} onClick={() => fileRef.current?.click()}>
            <UiIcon name="folder" size={14} />
            Restaurar copia…
          </button>

          <button type="button" role="menuitem" className={`${css.item} ${css.danger}`} onClick={() => setConfirm({ kind: "clear" })}>
            <UiIcon name="close" size={14} />
            Borrar todo lo local…
          </button>

          <p className={css.notice}>
            Tu progreso se guarda en este navegador. Descarga una copia de seguridad para no perderlo.
          </p>
        </div>
      ) : null}

      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className={css.file}
        aria-hidden="true"
        tabIndex={-1}
        onChange={(e) => void onPickFile(e)}
      />

      <Dialog
        open={confirm !== null}
        onClose={() => (busy ? undefined : setConfirm(null))}
        eyebrow={confirm?.kind === "clear" ? "BORRAR" : "RESTAURAR"}
        title={confirm?.kind === "clear" ? "¿Borrar todo lo local?" : "¿Restaurar esta copia?"}
        width={460}
        footer={
          <>
            <Button onClick={() => setConfirm(null)} disabled={busy}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={() => void applyConfirm()} disabled={busy} aria-busy={busy || undefined}>
              {confirm?.kind === "clear" ? "Borrar todo" : "Restaurar"}
            </Button>
          </>
        }
      >
        {confirm?.kind === "restore" ? (
          <p className={css.dialogText}>
            El archivo «{confirm.file}» reemplaza todo lo que hay guardado en este navegador: progreso, favoritos,
            apuntes, repaso, plan y sus materias. Lo actual se pierde.
          </p>
        ) : (
          <p className={css.dialogText}>
            Se borra todo lo que la plataforma guarda en este navegador: progreso, favoritos, apuntes, repaso, plan y
            sus materias. Las materias del catálogo vuelven a aparecer vacías. No se puede deshacer.
          </p>
        )}
      </Dialog>
    </div>
  );
}
