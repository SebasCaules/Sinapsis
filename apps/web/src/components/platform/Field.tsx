import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";
import css from "./Field.module.css";

const cx = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(" ");

interface FieldShellProps {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  /** El control en sí (input, select…), ya etiquetado con `id`. */
  children: ReactNode;
}

/**
 * Envoltura común de todo campo: rótulo, control y UNA sola línea de apoyo
 * abajo (el error tapa la ayuda mientras existe). Los campos concretos solo
 * aportan su control.
 */
function FieldShell({ id, label, error, hint, children }: FieldShellProps) {
  return (
    <div className={css.field}>
      <label className={css.label} htmlFor={id}>
        {label}
      </label>
      {children}
      {error ? (
        <span className={css.error} id={`${id}-err`} role="alert">
          {error}
        </span>
      ) : hint ? (
        <span className={css.hint} id={`${id}-hint`}>
          {hint}
        </span>
      ) : null}
    </div>
  );
}

/**
 * Atributos que enlazan el control con su rótulo y con su línea de apoyo. Abajo
 * hay UNA sola línea (el error tapa la ayuda mientras existe), así que
 * `aria-describedby` apunta a la que esté puesta: sin esto, un lector de
 * pantalla leía el campo sin el formato que se le pide (U40).
 */
const bind = (id: string, error?: string, hint?: ReactNode) => ({
  id,
  "aria-invalid": error ? true : undefined,
  "aria-describedby": error ? `${id}-err` : hint ? `${id}-hint` : undefined,
});

export interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  /** Códigos, slugs y cifras van en la mono. */
  mono?: boolean;
  error?: string;
  hint?: ReactNode;
}

/**
 * Reenvía la `ref` al <input>: quien abre un diálogo necesita poder apuntar el
 * foco inicial a SU campo (`Dialog.initialFocus`), no al primer enfocable.
 */
export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, mono, error, hint, className, id, ...rest },
  ref,
) {
  const auto = useId();
  const fieldId = id ?? auto;
  return (
    <FieldShell id={fieldId} label={label} error={error} hint={hint}>
      <input
        ref={ref}
        className={cx(css.control, mono && css.mono, className)}
        {...bind(fieldId, error, hint)}
        {...rest}
      />
    </FieldShell>
  );
});

export interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
  hint?: ReactNode;
  mono?: boolean;
}

export function SelectField({ label, options, error, hint, mono, className, id, ...rest }: SelectFieldProps) {
  const auto = useId();
  const fieldId = id ?? auto;
  return (
    <FieldShell id={fieldId} label={label} error={error} hint={hint}>
      <select className={cx(css.control, css.select, mono && css.mono, className)} {...bind(fieldId, error, hint)} {...rest}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}
