/** Un `ColorRef` del contrato (hex o token `--uN`) como valor CSS listo para usar. */
export function cssColor(ref: string | null | undefined, fallback = "var(--u0)"): string {
  if (!ref) return fallback;
  return ref.startsWith("--") ? `var(${ref})` : ref;
}
