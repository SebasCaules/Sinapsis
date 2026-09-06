/**
 * Qué mazos entran en una sesión de repaso (`/m/:slug/flashcards/:deck`).
 *
 * El parámetro de la ruta es casi siempre el id de un mazo, pero también admite
 * dos destinos sintéticos: `todo` (mezcla de todos los mazos, el botón «Repasar
 * todo lo vencido») y `kit:<id>` (los mazos de un kit). Se resuelve primero
 * contra los ids REALES, así que una materia que llame «todo» a un mazo suyo
 * sigue abriendo su mazo.
 */
import type { DeckStat, KitStat, StudyModel } from "./model";

/** Destino sintético: todos los mazos de la materia. */
export const ALL_DECKS = "todo";
/** Prefijo del destino sintético «los mazos de este kit». */
export const KIT_PREFIX = "kit:";

/** La ruta de la sesión de un kit (la usa el detalle del kit). */
export const kitDeckParam = (kitId: string): string => `${KIT_PREFIX}${kitId}`;

export interface SessionTarget {
  /** Rótulo de la sesión: el título del mazo, del kit o «Todos los mazos». */
  title: string;
  /** Ids de los mazos que entran; null = todos. */
  deckIds: string[] | null;
  deck: DeckStat | null;
  kit: KitStat | null;
}

/** Resuelve el `:deck` de la ruta; null si no existe (la vista muestra «no encontrado»). */
export function resolveSession(model: StudyModel, param: string): SessionTarget | null {
  const deck = model.deck(param);
  if (deck) return { title: deck.deck.title, deckIds: [deck.deck.id], deck, kit: null };

  if (param.startsWith(KIT_PREFIX)) {
    const kit = model.kit(param.slice(KIT_PREFIX.length));
    if (!kit) return null;
    return { title: kit.kit.title, deckIds: kit.decks.map((d) => d.id), deck: null, kit };
  }

  if (param === ALL_DECKS) return { title: "Todos los mazos", deckIds: null, deck: null, kit: null };
  return null;
}
