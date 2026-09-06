/**
 * Etiqueta de TIPO de contenido, única para toda la materia (pedido del
 * usuario: «el tag de concepto / fórmula / ejercicio debe ser consistente en
 * toda la página»). Antes cada vista dibujaba la suya (`typeChip` del lector,
 * `typeTag` de la tarjeta, la píldora del temario, `rowType` de favoritos…) con
 * fuentes, tamaños y colores distintos.
 *
 * Una sola forma: versalita monoespaciada, tintada con el color del tipo
 * (`--tcol`, el de `model.typeColor`) en dos tamaños. `EXERCISES_TYPE` es el
 * tipo sintético de los pasos de ejercicios (N0-61), que no es un tipo de
 * página del config pero se etiqueta igual para que la barra, el índice y la
 * vista de ejercicios hablen el mismo idioma.
 */
import type { CSSProperties } from "react";
import type { SubjectModel } from "../model";
import css from "./TypeTag.module.css";

/** Tipo sintético de los pasos de ejercicios (no viene de `pageTypes`). */
export const EXERCISES_TYPE = "ejercicios" as const;
export const EXERCISES_LABEL = "Ejercicios";
/** Color de los ejercicios: el mismo que usaba el original en el rail (`--u7`). */
export const EXERCISES_COLOR = "var(--u7)";

export interface TypeTagProps {
  /** Clave del tipo (`concepto`, `distribucion`, `ejercicios`…): viaja en `data-type`. */
  type: string;
  /** Rótulo ya resuelto (`model.typeLabel`); se muestra en versalita. */
  label: string;
  /** Color CSS del tipo (`model.typeColor`); tinta borde y fondo. */
  color?: string;
  size?: "sm" | "md";
  className?: string;
  title?: string;
}

export function TypeTag({ type, label, color, size = "md", className, title }: TypeTagProps) {
  const style = color ? ({ ["--tcol" as string]: color } as CSSProperties) : undefined;
  return (
    <span
      className={[css.tag, size === "sm" ? css.sm : "", className ?? ""].filter(Boolean).join(" ")}
      data-type={type}
      style={style}
      title={title}
    >
      {label}
    </span>
  );
}

/** Rótulo y color de un tipo, con el sintético de ejercicios resuelto. */
export function typeTagOf(
  model: Pick<SubjectModel, "typeLabel" | "typeColor">,
  type: string,
): { label: string; color: string } {
  if (type === EXERCISES_TYPE) return { label: EXERCISES_LABEL, color: EXERCISES_COLOR };
  return { label: model.typeLabel(type), color: model.typeColor(type) };
}

/** `TypeTag` que resuelve rótulo y color desde el modelo de la materia. */
export function PageTypeTag({
  model,
  type,
  ...rest
}: { model: Pick<SubjectModel, "typeLabel" | "typeColor">; type: string } & Omit<TypeTagProps, "type" | "label" | "color">) {
  const { label, color } = typeTagOf(model, type);
  return <TypeTag type={type} label={label} color={color} {...rest} />;
}
