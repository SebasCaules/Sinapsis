import { useEffect, useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "@sinapsis/contract";
import { useLogout, useMe } from "@/lib/auth";
import { UiIcon } from "./Icon";
import css from "./AvatarMenu.module.css";

/** "Sebastián Caules" → "SC"; sin nombre, la inicial del correo. */
export function initialsOf(name: string, email = ""): string {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  const first = parts[0] ?? "";
  const last = parts[parts.length - 1] ?? "";
  if (parts.length >= 2) return (first.charAt(0) + last.charAt(0)).toUpperCase();
  if (parts.length === 1) return first.slice(0, 2).toUpperCase();
  return (email.slice(0, 2) || "NA").toUpperCase();
}

export function AvatarMenu() {
  const { data: me } = useMe();
  const logout = useLogout();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
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

  const name = me?.name ?? "Sin sesión";
  const email = me?.email ?? "";
  const initials = initialsOf(name, email);

  return (
    <div className={css.wrap} ref={wrapRef}>
      <button
        ref={buttonRef}
        type="button"
        className={css.avatar}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={`Cuenta de ${name}`}
        onClick={() => setOpen((v) => !v)}
      >
        {me?.picture ? (
          <img className={css.photo} src={me.picture} alt="" referrerPolicy="no-referrer" />
        ) : (
          <span className={css.initials}>{initials}</span>
        )}
      </button>

      {open ? (
        <div className={css.menu} id={menuId} role="menu">
          <div className={css.head}>
            <span className={css.name}>{name}</span>
            <span className={css.email} title={email}>
              {email}
            </span>
          </div>
          <button
            type="button"
            role="menuitem"
            className={css.item}
            onClick={() => {
              setOpen(false);
              logout.mutate(undefined, { onSettled: () => navigate(routes.login(), { replace: true }) });
            }}
          >
            <UiIcon name="logout" size={14} />
            Cerrar sesión
          </button>
        </div>
      ) : null}
    </div>
  );
}
