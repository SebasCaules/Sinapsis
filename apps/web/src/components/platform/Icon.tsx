/**
 * Registro cerrado de iconos (trazo 1.5, viewBox 24). Los nombres son el enum
 * `IconName` del contrato: si una materia declara un icono, existe acá.
 * Agente C puede pulir los trazados; NO cambiar la firma.
 */
import type { IconName } from "@sinapsis/contract";

const PATHS: Record<IconName, string> = {
  home: "M4 10.5 12 4l8 6.5V20H4z M10 20v-6h4v6",
  map: "M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2z M9 4v14 M15 6v14",
  grid: "M4 4h7v7H4z M13 4h7v7h-7z M4 13h7v7H4z M13 13h7v7h-7z",
  book: "M4 5h7v15H4z M13 5h7v15h-7z M11 5v15",
  sigma: "M17 6H8l5 6-5 6h9",
  graph: "M6 18a2 2 0 100-4 2 2 0 100 4z M18 8a2 2 0 100-4 2 2 0 100 4z M18 20a2 2 0 100-4 2 2 0 100 4z M7.5 15l9-8 M7.5 17l9 2",
  cards: "M5 7h11v12H5z M9 4h11v12",
  quiz: "M9 9a3 3 0 115 2.2c-1 .7-2 1.3-2 2.8 M12 17v.5 M12 3a9 9 0 100 18 9 9 0 100-18",
  pencil: "M5 19h3l10-10-3-3L5 16z M13 7l3 3",
  timer: "M12 8v5l3 2 M12 21a8 8 0 100-16 8 8 0 100 16 M9 3h6",
  function: "M15 4c-2 0-3 1-3.3 3L10 20c-.3 2-1.3 3-3 3 M6 12h8 M14 14l4 4 M18 14l-4 4",
  calc: "M6 3h12v18H6z M9 7h6 M9 11h2 M13 11h2 M9 15h2 M13 15h2",
  compass: "M12 21a9 9 0 100-18 9 9 0 100 18 M15.5 8.5l-2 5-5 2 2-5z",
  layers: "M12 4l8 4-8 4-8-4z M4 12l8 4 8-4 M4 16l8 4 8-4",
  notebook: "M6 3h12v18H6z M9 3v18 M12 8h3 M12 12h3",
  star: "M12 4l2.4 5 5.6.8-4 4 1 5.6-5-2.7-5 2.7 1-5.6-4-4 5.6-.8z",
  list: "M8 7h11 M8 12h11 M8 17h11 M4.5 7h.01 M4.5 12h.01 M4.5 17h.01",
  clock: "M12 4a8 8 0 100 16 8 8 0 100-16 M12 8v4l3 2",
  square: "M5 5h14v14H5z",
  circle: "M12 4a8 8 0 100 16 8 8 0 100-16",
  diamond: "M12 4l8 8-8 8-8-8z",
  line: "M4 12h16",
  triangle: "M12 5l7 13H5z",
  flask: "M9 3h6 M10 3v6l-5 9a2 2 0 001.8 3h10.4A2 2 0 0019 18l-5-9V3 M7.5 15h9",
  chart: "M4 20h16 M7 16v-5 M12 16V8 M17 16v-9",
  table: "M4 5h16v14H4z M4 10h16 M4 15h16 M10 5v14",
  link: "M9 15l6-6 M7 11l-2 2a3 3 0 004 4l2-2 M17 13l2-2a3 3 0 00-4-4l-2 2",
  tool: "M14.7 6.3a4 4 0 00-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 005.4-5.4l-2.4 2.4-1.9-1.9z",
  sparkle: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z M19 17l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z",
  wrench: "M14.7 6.3a4 4 0 00-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 005.4-5.4l-2.4 2.4-1.9-1.9z",
};

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
  /** Etiqueta accesible; si falta el icono es decorativo (aria-hidden). */
  title?: string;
}

export function Icon({ name, size = 18, title, ...rest }: IconProps) {
  const d = PATHS[name] ?? PATHS.square;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      <path d={d} />
    </svg>
  );
}

/** Iconos de UI que no forman parte del enum del contrato (controles de la plataforma). */
export const UI_PATHS = {
  search: "M11 5a6 6 0 100 12 6 6 0 100-12 M15.5 15.5 20 20",
  sun: "M12 7a5 5 0 100 10 5 5 0 100-10 M12 3v2 M12 19v2 M3 12h2 M19 12h2 M5.6 5.6 7 7 M17 17l1.4 1.4 M18.4 5.6 17 7 M7 17l-1.4 1.4",
  moon: "M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z",
  leaf: "M5 19c0-8 5-13 14-14-1 9-6 14-14 14z M5 19l7-7",
  chevronDown: "M6 9l6 6 6-6",
  chevronLeft: "M14 8l-4 4 4 4",
  chevronRight: "M10 8l4 4-4 4",
  close: "M7 7l10 10 M17 7L7 17",
  plus: "M12 5v14 M5 12h14",
  check: "M5 13l4 4 10-10",
  menu: "M4 7h16 M4 12h16 M4 17h16",
  drag: "M9 6h.01 M15 6h.01 M9 12h.01 M15 12h.01 M9 18h.01 M15 18h.01",
  bookmark: "M7 4h10v16l-5-4-5 4z",
  external: "M14 4h6v6 M20 4l-9 9 M18 14v6H4V6h6",
  logout: "M9 20H5V4h4 M15 16l4-4-4-4 M19 12H9",
  folder: "M4 6h6l2 2h8v11H4z",
  file: "M6 4h9l3 3v13H6z M15 4v3h3",
  back: "M10 6l-6 6 6 6 M4 12h16",
  /* Panel lateral (el icono clásico de mostrar/ocultar la barra): marco con la columna izquierda. */
  sidebar: "M4 5h16v14H4z M9 5v14",
  /* Cuadrícula con un hueco a completar: estado vacío de la landing. */
  gridPlus: "M5 5h6v6H5z M13 5h6v6h-6z M5 13h6v6H5z M16 13v6 M13 16h6",
  /* Calendario de pared: hoja, anillas y el filete bajo la cabecera (DatePicker). */
  calendar: "M4 6h16v14H4z M4 10h16 M8 3.5v4 M16 3.5v4",
} as const;
export type UiIconName = keyof typeof UI_PATHS;

export function UiIcon({ name, size = 16, title, ...rest }: { name: UiIconName; size?: number; title?: string } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden={title ? undefined : true} role={title ? "img" : undefined} {...rest}>
      {title ? <title>{title}</title> : null}
      <path d={UI_PATHS[name]} />
    </svg>
  );
}
