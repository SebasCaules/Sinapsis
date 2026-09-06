import type { ButtonHTMLAttributes, ReactNode } from "react";
import css from "./Button.module.css";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  /** Estado "encendido" de un botón de conmutación (p. ej. "Gestionar"). */
  active?: boolean;
}

export function Button({ variant = "secondary", size = "md", active, className, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      data-variant={variant}
      data-size={size}
      data-active={active ? "true" : undefined}
      aria-pressed={active === undefined ? undefined : active}
      className={[css.btn, css[variant], size === "sm" ? css.sm : "", className].filter(Boolean).join(" ")}
      {...rest}
    />
  );
}

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  children: ReactNode;
  active?: boolean;
  /** Lado del cuadrado en px (26 en la cabecera). */
  size?: number;
}

export function IconButton({ label, children, active, size = 26, className, style, ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      data-active={active ? "true" : undefined}
      className={[css.icon, className].filter(Boolean).join(" ")}
      style={size === 26 ? style : { width: size, height: size, ...style }}
      {...rest}
    >
      {children}
    </button>
  );
}
