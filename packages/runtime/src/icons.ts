/* ============================================================
   icons.ts — registro de iconos del baseline (`ICONS` de core.js) más los
   nombres nuevos del contrato (`IconName`). `icon(name, size)` devuelve el
   mismo SVG que la app de Proba: viewBox 24×24, trazo `currentColor` de 1.7 px.
   Un nombre desconocido devuelve un CUADRADO (marca visible de icono faltante),
   en vez del punto del baseline.
   ============================================================ */

/** Trazado de cada icono: una cadena de subtrazos que empiezan con «M». */
export const ICONS: Record<string, string> = {
    home: "M3 11.5 12 4l9 7.5M5 10v10h14V10",
    calc: "M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8 7h8M8 11h2M12 11h2M16 11h0M8 15h2M12 15h2M16 15v2",
    cards: "M4 7h13v11H4zM7 4h13v3M7 4v0M20 7v10",
    quiz: "M9 9a3 3 0 1 1 4 2.8c-.8.5-1 1-1 2.2M12 17h0M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z",
    pencil: "M4 20h4L19 9l-4-4L4 16zM14 6l4 4",
    compass: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM16 8l-2 6-6 2 2-6z",
    graph: "M5 6a2 2 0 1 0 0-.01M19 7a2 2 0 1 0 0-.01M7 18a2 2 0 1 0 0-.01M7 6h8M8 16l8-7",
    star: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 3 1-6.1L3 9.5l6.1-.9z",
    search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-4.3-4.3",
    sun: "M12 4V2M12 22v-2M4 12H2M22 12h-2M6 6 4.5 4.5M19.5 19.5 18 18M18 6l1.5-1.5M4.5 19.5 6 18M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
    moon: "M21 12.8A8.5 8.5 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z",
    chev: "M9 6l6 6-6 6", chevdown: "M6 9l6 6 6-6", chevright: "M9 6l6 6-6 6",
    calendar: "M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM8 3v4M16 3v4M4 10h16",
    link: "M9 15l6-6M10 6l1-1a3.5 3.5 0 0 1 5 5l-1 1M14 18l-1 1a3.5 3.5 0 0 1-5-5l1-1",
    book: "M5 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2zM18 6H7M5 20a2 2 0 0 1 2-2h11",
    dist: "M3 20h18M5 20v-6M9 20V9M13 20v-9M17 20v-4M5 14c2-7 4-9 6-9s4 2 6 5",
    x: "M6 6l12 12M18 6 6 18", check: "M5 12l5 5 9-11",
    bookmark: "M6 4h12v16l-6-4-6 4z", dot: "M12 12h.01",
    flag: "M5 21V4h11l-1 4 4 0v8H7M5 4v17",
    shuffle: "M16 4h4v4M20 4l-7 7M4 20l5-5M16 20h4v-4M4 4l16 16",
    target: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
    clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 7v5l3 2",
    list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
    grid: "M4 4h7v7H4zM13 4h7v7h-7zM13 13h7v7h-7zM4 13h7v7H4z",
    plus: "M12 5v14M5 12h14", minus: "M5 12h14",
    expand: "M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5",
    download: "M12 3v12M8 11l4 4 4-4M5 21h14",
    copy: "M9 9h10v10H9zM5 15H4V4h11v1",
    notebook: "M7 4h11a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H7zM7 4a2 2 0 0 0-2 2 2 2 0 0 0 2 2M5 12h2M5 17h2",
    timer: "M12 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM12 10v4l2.5 1.5M9 2h6M12 6V4",
    flame: "M12 22c4 0 7-2.6 7-6.5 0-4-3-5.5-3-9 0 0-2 2-3 5-1-1-1-3-1-4-2 1.5-4 4.2-4 8 0 3.9 3 6.5 7 6.5z",
    layers: "M12 3 3 8l9 5 9-5zM3 13l9 5 9-5M3 16.5l9 5 9-5",
    sliders: "M4 6h10M18 6h2M4 12h2M10 12h10M4 18h12M18 18h2M14 4v4M6 10v4M16 16v4",
    award: "M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM8.5 13.5 7 22l5-3 5 3-1.5-8.5",
    printer: "M6 9V3h12v6M6 18H4v-7h16v7h-2M8 14h8v7H8z",
    arrowright: "M5 12h14M13 6l6 6-6 6",
    sigma: "M18 5H6l6 7-6 7h12",
    refresh: "M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5",
    play: "M7 4v16l13-8z", lightbulb: "M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.3 1 2.5h6c0-1.2.2-1.7 1-2.5A6 6 0 0 0 12 3z",
    eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
    map: "M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14",
    function: "M19 5h-3a3 3 0 0 0-3 3v0M5 19h3a3 3 0 0 0 3-3v0M7 12h8",
    gauge: "M12 13l4-4M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zM12 21v0",
  // ---- nombres del contrato (`IconName`) que el baseline no tenía ----
  square: "M4 4h16v16H4z",
  circle: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
  diamond: "M12 3l9 9-9 9-9-9z",
  line: "M4 18L20 6",
  triangle: "M12 4l9 16H3z",
  flask: "M9 3h6M10 3v6L4 20h16L14 9V3M8 14h8",
  chart: "M4 20V6M4 20h16M8 20v-6M12 20v-9M16 20v-4",
  table: "M4 5h16v14H4zM4 10h16M10 10v9M4 15h16",
  tool: "M14 7a4 4 0 1 0 4 4l3 3-3 3-3-3a4 4 0 0 0-4-4M10 10L4 4M4 4v4h4",
  sparkle: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9z",
  wrench: "M15 3a5 5 0 0 0-4.6 7L3 17.4 5.6 20l7.4-7.4A5 5 0 1 0 15 3z",
};

/**
 * SVG en línea del icono. `size` en px (20 por omisión). Cada subtrazo «M…» del
 * registro sale como un `<path>` propio, igual que en el baseline.
 */
export function icon(name: string, size?: number): string {
  const p = ICONS[name] || (ICONS["square"] as string);
  const s = size || 20;
  return (
    '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="' + s +
    '" height="' + s + '" fill="none" stroke="currentColor" stroke-width="1.7" ' +
    'stroke-linecap="round" stroke-linejoin="round">' +
    String(p).split("M").filter(Boolean).map((d) => '<path d="M' + d + '"/>').join("") +
    "</svg>"
  );
}
