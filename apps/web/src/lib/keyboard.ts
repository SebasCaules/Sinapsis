/**
 * Teclado de la plataforma. Regla única compartida por todos los atajos de una
 * sola tecla (T del tema, / de la paleta…): si el foco está en un campo de
 * texto, la tecla se escribe, no dispara el atajo.
 */

/** true si el elemento enfocado acepta escritura (input, textarea, select o editable). */
export function isTypingTarget(el: EventTarget | null): boolean {
  const node = el as HTMLElement | null;
  if (!node || typeof node.tagName !== "string") return false;
  const tag = node.tagName.toLowerCase();
  return tag === "input" || tag === "textarea" || tag === "select" || node.isContentEditable === true;
}
