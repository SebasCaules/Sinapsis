/**
 * Perfil local: reemplaza a la sesión del Sprint 3.
 *
 * No hay servidor a quien preguntarle quién es el usuario y no hay tres
 * desenlaces posibles: el perfil vive en el documento local y siempre está.
 * `useMe()` conserva el nombre y la forma que ya usaban las vistas (`User`),
 * pero es una lectura de memoria: no reintenta, no caduca (`staleTime:
 * Infinity`) y solo se refresca cuando algo la invalida.
 */
import { useMutation, useQuery, useQueryClient, type UseQueryResult } from "@tanstack/react-query";
import type { User } from "@sinapsis/contract";
import { api, qk } from "./api";

/** El perfil local, con la forma de siempre. */
export function useMe(): UseQueryResult<User> {
  return useQuery<User>({
    queryKey: qk.me,
    queryFn: () => api.auth.me(),
    staleTime: Infinity,
    retry: false,
  });
}

/** Cambia el nombre del perfil («Estudiante» por defecto). */
export function useSetProfileName() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => api.auth.setName(name),
    onSuccess: (user) => {
      qc.setQueryData(qk.me, user);
    },
  });
}
