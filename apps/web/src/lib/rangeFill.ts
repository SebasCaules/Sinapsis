/**
 * Parte recorrida de los deslizadores (`input[type="range"]`): el estilo global
 * de base.css pinta la pista hasta `--pct`, y acá se mantiene ese porcentaje
 * al día para TODOS los deslizadores del documento, incluidos los que montan
 * los bundles de herramientas y las figuras:
 *
 *   · `input`/`change` delegados en `document` → el usuario arrastra;
 *   · un MutationObserver → deslizadores que aparecen o desaparecen;
 *   · el setter de `value` de HTMLInputElement, envuelto una sola vez → un
 *     script cambia el valor por programa (el explorador al elegir otra
 *     distribución) sin disparar ningún evento.
 */
export function rangePercent(value: number, min: number, max: number): number {
  if (!Number.isFinite(value) || !Number.isFinite(min) || !Number.isFinite(max) || max <= min) return 0;
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
}

export function syncRange(el: HTMLInputElement): void {
  const min = el.min === "" ? 0 : Number(el.min);
  const max = el.max === "" ? 100 : Number(el.max);
  el.style.setProperty("--pct", `${rangePercent(Number(el.value), min, max).toFixed(2)}%`);
}

function isRange(node: unknown): node is HTMLInputElement {
  return node instanceof HTMLInputElement && node.type === "range";
}

function syncAll(root: ParentNode): void {
  if (root instanceof HTMLInputElement) {
    if (root.type === "range") syncRange(root);
    return;
  }
  root.querySelectorAll?.<HTMLInputElement>('input[type="range"]').forEach(syncRange);
}

let installed = false;

/** Se instala una sola vez por documento; devuelve el desinstalador (tests). */
export function installRangeFill(doc: Document = document): () => void {
  if (installed) return () => undefined;
  installed = true;

  const onInput = (event: Event) => {
    if (isRange(event.target)) syncRange(event.target);
  };
  doc.addEventListener("input", onInput, true);
  doc.addEventListener("change", onInput, true);

  const observer = new MutationObserver((records) => {
    for (const record of records) {
      record.addedNodes.forEach((node) => {
        if (node instanceof Element) syncAll(node);
      });
      if (record.type === "attributes" && isRange(record.target)) syncRange(record.target);
    }
  });
  observer.observe(doc.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["value", "min", "max"] });

  /* Cambios por programa: `el.value = 3` no emite eventos. */
  const proto = HTMLInputElement.prototype;
  const desc = Object.getOwnPropertyDescriptor(proto, "value");
  if (desc && desc.set && desc.get && !("__sinapsisRange" in desc.set)) {
    const set = desc.set;
    const wrapped = function (this: HTMLInputElement, v: string) {
      set.call(this, v);
      if (this.type === "range") syncRange(this);
    };
    (wrapped as unknown as { __sinapsisRange: true }).__sinapsisRange = true;
    Object.defineProperty(proto, "value", { ...desc, set: wrapped });
  }

  syncAll(doc);
  return () => {
    doc.removeEventListener("input", onInput, true);
    doc.removeEventListener("change", onInput, true);
    observer.disconnect();
    if (desc) Object.defineProperty(proto, "value", desc);
    installed = false;
  };
}
