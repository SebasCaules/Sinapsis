import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";
import css from "./Field.module.css";

export interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  /** Códigos, slugs y cifras van en la mono. */
  mono?: boolean;
  error?: string;
  hint?: ReactNode;
}

export function Field({ label, mono, error, hint, className, id, ...rest }: FieldProps) {
  const auto = useId();
  const fieldId = id ?? auto;
  return (
    <div className={css.field}>
      <label className={css.label} htmlFor={fieldId}>
        {label}
      </label>
      <input
        id={fieldId}
        className={[css.control, mono ? css.mono : "", className].filter(Boolean).join(" ")}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-err` : undefined}
        {...rest}
      />
      {error ? (
        <span className={css.error} id={`${fieldId}-err`} role="alert">
          {error}
        </span>
      ) : hint ? (
        <span className={css.hint}>{hint}</span>
      ) : null}
    </div>
  );
}

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
    <div className={css.field}>
      <label className={css.label} htmlFor={fieldId}>
        {label}
      </label>
      <select
        id={fieldId}
        className={[css.control, css.select, mono ? css.mono : "", className].filter(Boolean).join(" ")}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-err` : undefined}
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error ? (
        <span className={css.error} id={`${fieldId}-err`} role="alert">
          {error}
        </span>
      ) : hint ? (
        <span className={css.hint}>{hint}</span>
      ) : null}
    </div>
  );
}
