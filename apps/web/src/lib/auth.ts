/**
 * Sesión del usuario. `useMe()` es la única fuente de verdad de "hay sesión":
 * un 401 no es un error, es "no hay sesión" (null), para que RequireAuth pueda
 * decidir sin manejar excepciones.
 */
import { useMutation, useQuery, useQueryClient, type UseQueryResult } from "@tanstack/react-query";
import type { User } from "@sinapsis/contract";
import { ApiError, api, qk } from "./api";
import { isMockMode, mockUser } from "@/mocks/dev-fixtures";

export function useMe(): UseQueryResult<User | null> {
  return useQuery<User | null>({
    queryKey: qk.me,
    queryFn: async () => {
      if (isMockMode()) return mockUser;
      try {
        return await api.auth.me();
      } catch (err) {
        if (err instanceof ApiError && (err.status === 401 || err.status === 403)) return null;
        throw err;
      }
    },
    retry: false,
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
