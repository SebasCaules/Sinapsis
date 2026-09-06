/**
 * Sesión del usuario. `useMe()` es la única fuente de verdad de "hay sesión".
 *
 * Hay tres desenlaces posibles, y son TRES, no dos (S-15):
 *
 *  - `data: User`   → hay sesión;
 *  - `data: null`   → el servidor contestó «no autorizado» (401/403): NO hay
 *    sesión, y quien pregunte debe mandar a `/login`;
 *  - `isError`      → no se pudo saber. Un 5xx o un fallo de red no dicen nada
 *    sobre la sesión: el API puede estar reiniciándose mientras la cookie sigue
 *    siendo válida y la fila de `sessions` sigue en la base. Confundir esto con
 *    «no hay sesión» era lo que echaba al usuario a `/login` cada vez que se
 *    reiniciaba el API de desarrollo (S-13 → S-15).
 *
 * Por eso la consulta reintenta con espera creciente ante 5xx y fallos de red, y
 * no reintenta nunca ante una respuesta del servidor que ya es concluyente.
 */
import { useMutation, useQuery, useQueryClient, type UseQueryResult } from "@tanstack/react-query";
import type { User } from "@sinapsis/contract";
import { ApiError, api, qk } from "./api";

/** Intentos fallidos antes de darse por vencido y declarar el error. */
export const ME_MAX_RETRIES = 5;

/**
 * Espera antes del intento `attempt` (0 = el primer reintento): 300 ms, 600,
 * 1200, 2400, 4000. Poco más de ocho segundos en total, que es de sobra para un
 * reinicio del API y poco para que se note como una pantalla trabada.
 */
export function meRetryDelay(attempt: number): number {
  return Math.min(300 * 2 ** attempt, 4000);
}

/**
 * ¿Vale la pena volver a preguntar? Solo si la respuesta no fue concluyente:
 * un fallo de red (no hay `ApiError`) o un 5xx. Un 4xx ya contestó.
 */
export function shouldRetryMe(failureCount: number, error: unknown): boolean {
  if (error instanceof ApiError && error.status < 500) return false;
  return failureCount < ME_MAX_RETRIES;
}

export function useMe(): UseQueryResult<User | null> {
  return useQuery<User | null>({
    queryKey: qk.me,
    queryFn: async () => {
      try {
        return await api.auth.me();
      } catch (err) {
        /* 401 y 403 son concluyentes: el servidor está sano y dice que no hay
           sesión. Cualquier otra cosa se propaga como error y se reintenta. */
        if (err instanceof ApiError && (err.status === 401 || err.status === 403)) return null;
        throw err;
      }
    },
    retry: shouldRetryMe,
    retryDelay: meRetryDelay,
    staleTime: 5 * 60_000,
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.auth.logout(),
    onSettled: () => {
      qc.setQueryData(qk.me, null);
      qc.removeQueries({ queryKey: qk.landing });
    },
  });
}
