import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";
export function Field({ label, ...rest }: { label: string } & InputHTMLAttributes<HTMLInputElement>) { return <label>{label}<input {...rest} /></label>; }
export function SelectField({ label, options, ...rest }: { label: string; options: { value: string; label: string }[] } & SelectHTMLAttributes<HTMLSelectElement>) {
  return <label>{label}<select {...rest}>{options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></label>;
}
