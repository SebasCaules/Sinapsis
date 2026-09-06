/**
 * Ajuste del rail a la altura disponible (kebab-case como route-info.ts).
 *
 * El rail nunca desborda ni desplaza: si sus grupos no entran en la ventana,
 * todo se achica de forma proporcional (ítems, iconos, separaciones, rótulos)
 * hasta un piso (55 %: iconos de 10 px), y solo por debajo del piso desborda. La escala
 * se calcula con las medidas NATURALES (a escala 1), no midiendo el DOM ya
 * escalado, así no oscila.
 */

/** Geometría natural del rail en px (la del contrato: ítems 36, hueco 2, grupo con 6+6 de aire y 1 de filete). */
export const RAIL_NATURAL = {
  seal: 40,
  toggle: 48,
  item: 36,
  gap: 2,
  groupPad: 12,
  groupBorder: 1,
} as const;

export const RAIL_MIN_SCALE = 0.55;

/** Alto natural que piden los grupos (sin sello ni conmutador). */
export function railGroupsHeight(itemsPerGroup: readonly number[]): number {
  return itemsPerGroup.reduce((sum, n) => {
    if (n <= 0) return sum;
    return sum + n * RAIL_NATURAL.item + (n - 1) * RAIL_NATURAL.gap + RAIL_NATURAL.groupPad + RAIL_NATURAL.groupBorder;
  }, 0);
}

/**
 * Escala (0.7..1) con la que los grupos entran en `available` px una vez
 * descontados el sello y el conmutador, que no se achican.
 */
export function railScale(available: number, itemsPerGroup: readonly number[]): number {
  const fixed = RAIL_NATURAL.seal + RAIL_NATURAL.toggle;
  const needed = railGroupsHeight(itemsPerGroup);
  if (needed <= 0 || available <= 0) return 1;
  const room = Math.max(0, available - fixed);
  const scale = room / needed;
  if (scale >= 1) return 1;
  return Math.max(RAIL_MIN_SCALE, Math.round(scale * 100) / 100);
}
