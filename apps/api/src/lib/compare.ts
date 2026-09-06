import { timingSafeEqual } from "node:crypto";

/** Comparación de secretos en tiempo constante (tolera longitudes distintas). */
export function secretEquals(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) {
    // Se compara igual contra sí mismo para no filtrar la longitud por tiempo.
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}
