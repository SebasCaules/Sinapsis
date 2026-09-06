/**
 * Diagramas Mermaid del wiki (N0-63).
 *
 * Un bloque ```` ```mermaid ```` del cuerpo se dibuja como diagrama. La librería
 * es grande, así que **entra por import dinámico**: solo se descarga cuando una
 * página tiene al menos un bloque, y una materia que no usa Mermaid no paga
 * nada. Vite la emite en su propio trozo, fuera del que carga el lector.
 *
 * ## Por qué esto no contradice «sin HTML crudo» (N0-10)
 *
 * El lector no monta `rehype-raw`: el markdown de una materia nunca inyecta
 * marcado, y acá tampoco. **No se arma ninguna cadena de HTML**: el texto del
 * diagrama se pone como `textContent` del hueco —donde no puede ser marcado— y
 * es Mermaid quien construye el SVG nodo por nodo con `mermaid.run`, bajo
 * `securityLevel: "strict"`: Mermaid pasa el texto de cada etiqueta por su
 * propio saneado antes de dibujarla, y el resultado no lleva `<script>`, ni
 * manejadores de evento, ni enlaces `javascript:` (verificado en el lector).
 *
 * ## Qué pasa si el diagrama no compila
 *
 * Se muestra **el bloque de código original**. Nunca un hueco en blanco ni el
 * cartel de error de Mermaid: un diagrama con una errata sigue siendo el texto
 * que el autor escribió, y así se lee y se corrige.
 */
import { useEffect, useRef, useState } from "react";
import css from "./markdown.module.css";

export interface MermaidProps {
  /** El texto del bloque, tal como está en el markdown. */
  chart: string;
}

/** Tokens de la plataforma que Mermaid necesita para no desentonar. */
export function themeVariables(): Record<string, string> {
  const s = getComputedStyle(document.documentElement);
  const token = (name: string, fallback: string) => s.getPropertyValue(name).trim() || fallback;
  const text = token("--text", "#231c12");
  const line = token("--line", "#cbbfa8");
  const soft = token("--text-3", "#6a6150");
  const surface = token("--surface", "#faf5ea");
  const surface2 = token("--surface-2", "#f2ebdb");
  return {
    background: surface,
    primaryColor: surface2,
    primaryTextColor: text,
    primaryBorderColor: line,
    secondaryColor: surface,
    tertiaryColor: surface2,
    lineColor: soft,
    textColor: text,
    mainBkg: surface2,
    nodeBorder: line,
    clusterBkg: surface,
    clusterBorder: line,
    titleColor: text,
    edgeLabelBackground: surface,
    actorBkg: surface2,
    actorBorder: line,
    actorTextColor: text,
    actorLineColor: soft,
    signalColor: text,
    signalTextColor: text,
    labelBoxBkgColor: surface2,
    labelBoxBorderColor: line,
    labelTextColor: text,
    loopTextColor: text,
    noteBkgColor: token("--accent-soft", "#f1e7cf"),
    noteBorderColor: line,
    noteTextColor: text,
    activationBkgColor: surface,
    activationBorderColor: token("--primary", "#7c2230"),
    sequenceNumberColor: surface,
  };
}

export function Mermaid({ chart }: MermaidProps) {
  const [drawn, setDrawn] = useState(false);
  const [failed, setFailed] = useState(false);
  /* El tema vive en `data-theme` del `<html>` y lo puede cambiar cualquiera (el
     menú, otra pestaña, el atajo de teclado): se observa el atributo en vez de
     atarse al store, así el diagrama se recompone con los colores nuevos. */
  const [theme, setTheme] = useState(() =>
    typeof document === "undefined" ? "" : (document.documentElement.getAttribute("data-theme") ?? ""),
  );
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof MutationObserver === "undefined") return;
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute("data-theme") ?? "");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const target = host.current;
    if (!target) return;
    let alive = true;
    setFailed(false);
    setDrawn(false);
    void (async () => {
      try {
        const { default: mermaid } = await import("mermaid");
        if (!alive) return;
        mermaid.initialize({
          startOnLoad: false,
          /* `strict` es el nivel más alto: Mermaid sanea el texto de cada
             etiqueta antes de dibujarla. Los `<br/>` que el wiki usa en las
             etiquetas siguen partiendo la línea. */
          securityLevel: "strict",
          theme: "base",
          themeVariables: themeVariables(),
          fontFamily: getComputedStyle(document.documentElement).getPropertyValue("--font-ui").trim() || "system-ui",
          /* `useMaxWidth: false`: un diagrama ancho conserva su tamaño y el
             hueco se desplaza, como ya hacen las tablas y las fórmulas anchas
             del lector. Encogerlo hasta entrar deja las etiquetas ilegibles. */
          flowchart: { useMaxWidth: false },
          sequence: { useMaxWidth: false, wrap: true },
        });
        /* El texto va como `textContent`, no como HTML: acá no hay forma de que
           el cuerpo de una página se convierta en marcado. Mermaid reemplaza el
           contenido del hueco por el SVG que construye. */
        target.textContent = chart;
        target.removeAttribute("data-processed");
        await mermaid.run({ nodes: [target], suppressErrors: true });
        if (!alive) return;
        /* `suppressErrors` no lanza: el diagrama salió bien si quedó un SVG. */
        const ok = target.querySelector("svg") !== null;
        if (!ok) target.textContent = "";
        setDrawn(ok);
        setFailed(!ok);
      } catch {
        if (!alive) return;
        target.textContent = "";
        setDrawn(false);
        setFailed(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [chart, theme]);

  /* El hueco NO se oculta mientras dibuja: Mermaid mide cada etiqueta con
     `getBBox`, y dentro de un elemento sin caja esa medida da cero y el
     diagrama sale vacío. Mientras tanto no se ve nada, porque el hueco está
     vacío hasta que Mermaid lo llena. */
  return (
    <>
      <div ref={host} className={css.mermaid} data-mermaid={drawn ? "dibujado" : "vacio"} />
      {failed ? (
        <pre className={css.mermaidFallback} data-mermaid="sin-dibujar">
          <code>{chart}</code>
        </pre>
      ) : null}
    </>
  );
}
