/**
 * Acceso al material de estudio de una materia: dos consultas —el contenido que
 * trajo el sync (`qk.study`) y lo que hizo el usuario (`qk.studyState`)— y las
 * tres mutaciones que lo mueven (calificar una tarjeta, tildar una tarea del
 * plan, registrar un intento de quiz).
 *
 * Todo lo derivado vive en `model.ts` y se memoriza por respuesta: las vistas no
 * recorren los mazos ni el plan por su cuenta. Las mutaciones escriben la caché
 * en optimista y vuelven atrás si el API falla; `qk.studyState` es la MISMA
 * consulta que usan el lector y «Lo mío» (favoritos, apuntes), así que un repaso
 * y un favorito nunca se pisan: cada mutación toca solo su campo.
 */
import { useCallback, useMemo, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import type {
  QuizAttempt,
  SrsGrade,
  SrsState,
  StudyContent,
  StudyState,
} from "@sinapsis/contract";
import { api, qk } from "@/lib/api";
import { usePlanTrack, useSubjectUiStore } from "../store";
import {
  EMPTY_STATE,
  buildStudyModel,
  nextSrs,
  type CardEntry,
  type StudyModel,
  type TaskRef,
} from "./model";

export interface UseStudyResult {
  /** `api.study.content(slug)` — el material compilado de la materia. */
  content: UseQueryResult<StudyContent>;
  /** `api.study.state(slug)` — SRS, tareas hechas e intentos. */
  state: UseQueryResult<StudyState>;
  /** Nunca null: mientras carga es el modelo vacío. */
  model: StudyModel;
  /** La cola de hoy: vencidas (la más atrasada primero) y después las nuevas. */
  dueCards: (now?: Date) => CardEntry[];
  /**
   * La primera tarea pendiente del plan, DENTRO de la modalidad elegida (N0-43):
   * quien estudia por «final directo» no tiene que ver como próximo paso una
   * tarea que solo existe en la cursada.
   */
  nextTask: () => TaskRef | null;
  /** Elige la modalidad del plan (se recuerda por materia en el cliente). */
  setTrack: (trackId: string) => void;
  /** Califica una tarjeta con el SM-2 del contrato. Devuelve el estado que persistió el API. */
  grade: (cardId: string, grade: SrsGrade) => Promise<SrsState>;
  /** Tilda o destilda una tarea del plan. */
  setTask: (taskId: string, done: boolean) => Promise<void>;
  /** Destilda TODAS las tareas del plan de la materia («Reiniciar el plan»). */
  resetTasks: () => Promise<void>;
  /** Carga la fecha de una instancia evaluatoria (AAAA-MM-DD). */
  setPlanDate: (key: string, date: string) => Promise<void>;
  /** Borra la fecha de una instancia (vaciar el campo). */
  clearPlanDate: (key: string) => Promise<void>;
  /** Borra las fechas de todas las instancias («Borrar fechas»). */
  resetPlanDates: () => Promise<void>;
  /** Registra el resultado de un quiz. */
  recordAttempt: (quizId: string, score: number, total: number) => Promise<QuizAttempt>;
}

/** Escribe el estado de estudio en caché y devuelve el anterior (para la vuelta atrás). */
function patchState(
  qc: QueryClient,
  slug: string,
  patch: (prev: StudyState) => StudyState,
): StudyState | undefined {
  const prev = qc.getQueryData<StudyState>(qk.studyState(slug));
  qc.setQueryData<StudyState>(qk.studyState(slug), patch(prev ?? EMPTY_STATE));
  return prev;
}

/**
 * El material de estudio y su modelo derivado.
 *
 * `studied` (las páginas leídas, que conoce el shell) es opcional y solo alimenta
 * la barra de lectura de los kits: el material de estudio no sabe de páginas.
 *
 * La modalidad del plan sale del store de la materia, no de la vista: así el
 * progreso, la fase actual y «lo próximo» son los MISMOS en el plan y en el
 * inicio de la materia.
 */
export function useStudy(slug: string, studied?: ReadonlySet<string>): UseStudyResult {
  const qc = useQueryClient();
  const content = useQuery({ queryKey: qk.study(slug), queryFn: () => api.study.content(slug) });
  const state = useQuery({ queryKey: qk.studyState(slug), queryFn: () => api.study.state(slug) });

  /* La hora se fija al montar: si fuese `new Date()` en cada render, el modelo
     (y con él la cola de repaso) se rearmaría a cada tecla. */
  const [now] = useState(() => new Date());

  /**
   * Las mutaciones del plan (tareas y fechas) comparten clave para poder
   * contarlas: un solo gesto dispara varias —el segmento de año del campo de
   * fecha emite un `change` por dígito, «Completar fase» tilda tarea por
   * tarea—, y cuando se solapan cada una guarda en `ctx.prev` una foto que YA
   * trae el parche optimista de la anterior. Sin volver a pedir el estado, la
   * última vuelta atrás restauraría esa foto vieja y la pantalla quedaría
   * mintiendo hasta recargar.
   */
  const planMutationKey = useMemo(() => ["study", slug, "plan"] as const, [slug]);

  /**
   * Vuelve a pedir el estado cuando termina la ÚLTIMA mutación del plan en
   * vuelo (en `onSettled` la propia mutación todavía cuenta, de ahí el 1). Si
   * quedara alguna, su respuesta —o su vuelta atrás— es la que manda, y
   * refrescar en el medio pisaría un optimista todavía válido.
   */
  const settleState = useCallback(() => {
    if (qc.isMutating({ mutationKey: planMutationKey }) > 1) return;
    void qc.invalidateQueries({ queryKey: qk.studyState(slug) });
  }, [qc, planMutationKey, slug]);

  const trackId = usePlanTrack(slug);
  const setPlanTrack = useSubjectUiStore((s) => s.setPlanTrack);
  const setTrack = useCallback((id: string) => setPlanTrack(slug, id), [setPlanTrack, slug]);

  const model = useMemo(
    () => buildStudyModel(content.data, state.data, now, studied, trackId),
    [content.data, state.data, now, studied, trackId],
  );

  const gradeMutation = useMutation({
    mutationFn: ({ cardId, grade }: { cardId: string; grade: SrsGrade }) =>
      api.study.grade(slug, cardId, grade),
    onMutate: async ({ cardId, grade }) => {
      await qc.cancelQueries({ queryKey: qk.studyState(slug) });
      /* El mismo SM-2 que corre el servidor (contrato, decisión N0-28): la
         tarjeta siguiente aparece sin esperar la respuesta. */
      const prev = patchState(qc, slug, (s) => {
        const current = s.srs.find((x) => x.cardId === cardId) ?? null;
        const optimistic = nextSrs(cardId, current, grade, new Date());
        return { ...s, srs: [...s.srs.filter((x) => x.cardId !== cardId), optimistic] };
      });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(qk.studyState(slug), ctx.prev);
    },
    onSuccess: (srs) => {
      patchState(qc, slug, (s) => ({ ...s, srs: [...s.srs.filter((x) => x.cardId !== srs.cardId), srs] }));
    },
  });

  const taskMutation = useMutation({
    mutationFn: ({ taskId, done }: { taskId: string; done: boolean }) =>
      api.study.setTask(slug, taskId, done),
    onMutate: async ({ taskId, done }) => {
      await qc.cancelQueries({ queryKey: qk.studyState(slug) });
      const prev = patchState(qc, slug, (s) => ({
        ...s,
        tasksDone: done
          ? s.tasksDone.includes(taskId)
            ? s.tasksDone
            : [...s.tasksDone, taskId]
          : s.tasksDone.filter((id) => id !== taskId),
      }));
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(qk.studyState(slug), ctx.prev);
    },
  });

  /* «Reiniciar el plan»: destilda todo de una. Optimista como el tilde suelto,
     y las fechas NO se tocan (son otra tabla y otra acción). */
  const resetTasksMutation = useMutation({
    mutationKey: planMutationKey,
    mutationFn: () => api.study.resetTasks(slug),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: qk.studyState(slug) });
      return { prev: patchState(qc, slug, (s) => ({ ...s, tasksDone: [] })) };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(qk.studyState(slug), ctx.prev);
    },
    onSettled: settleState,
  });

  /* Fechas de las instancias. Una sola mutación para cargar y borrar: el campo
     vacío ES el borrado, y así dos cambios seguidos sobre la misma instancia no
     compiten entre dos mutaciones distintas. */
  const planDateMutation = useMutation({
    mutationKey: planMutationKey,
    mutationFn: ({ key, date }: { key: string; date: string | null }) =>
      date === null ? api.study.clearPlanDate(slug, key) : api.study.setPlanDate(slug, key, date),
    onMutate: async ({ key, date }) => {
      await qc.cancelQueries({ queryKey: qk.studyState(slug) });
      const prev = patchState(qc, slug, (s) => {
        const next = { ...s.planDates };
        if (date === null) delete next[key];
        else next[key] = date;
        return { ...s, planDates: next };
      });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(qk.studyState(slug), ctx.prev);
    },
    onSettled: settleState,
  });

  const resetPlanDatesMutation = useMutation({
    mutationKey: planMutationKey,
    mutationFn: () => api.study.resetPlanDates(slug),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: qk.studyState(slug) });
      return { prev: patchState(qc, slug, (s) => ({ ...s, planDates: {} })) };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(qk.studyState(slug), ctx.prev);
    },
    onSettled: settleState,
  });

  const attemptMutation = useMutation({
    mutationFn: ({ quizId, score, total }: { quizId: string; score: number; total: number }) =>
      api.study.recordAttempt(slug, quizId, score, total),
    onMutate: async ({ quizId, score, total }) => {
      await qc.cancelQueries({ queryKey: qk.studyState(slug) });
      const at = new Date().toISOString();
      const prev = patchState(qc, slug, (s) => ({ ...s, attempts: [...s.attempts, { quizId, score, total, at }] }));
      return { prev, at };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(qk.studyState(slug), ctx.prev);
    },
    onSuccess: (attempt, _vars, ctx) => {
      /* Se reemplaza el intento de mentira por el que devolvió el API (su `at`
         es el del servidor), sin volver a pedir la consulta entera. */
      patchState(qc, slug, (s) => ({
        ...s,
        attempts: [...s.attempts.filter((a) => !(a.quizId === attempt.quizId && a.at === ctx?.at)), attempt],
      }));
    },
  });

  const dueCards = useCallback((when?: Date) => model.dueCards(when), [model]);
  const nextTask = useCallback(() => model.nextTask(), [model]);

  const grade = useCallback(
    (cardId: string, value: SrsGrade) => gradeMutation.mutateAsync({ cardId, grade: value }),
    [gradeMutation],
  );
  const setTask = useCallback(
    async (taskId: string, done: boolean) => {
      await taskMutation.mutateAsync({ taskId, done });
    },
    [taskMutation],
  );
  const recordAttempt = useCallback(
    (quizId: string, score: number, total: number) => attemptMutation.mutateAsync({ quizId, score, total }),
    [attemptMutation],
  );
  const resetTasks = useCallback(async () => {
    await resetTasksMutation.mutateAsync();
  }, [resetTasksMutation]);
  const setPlanDate = useCallback(
    async (key: string, date: string) => {
      await planDateMutation.mutateAsync({ key, date });
    },
    [planDateMutation],
  );
  const clearPlanDate = useCallback(
    async (key: string) => {
      await planDateMutation.mutateAsync({ key, date: null });
    },
    [planDateMutation],
  );
  const resetPlanDates = useCallback(async () => {
    await resetPlanDatesMutation.mutateAsync();
  }, [resetPlanDatesMutation]);

  return {
    content,
    state,
    model,
    dueCards,
    nextTask,
    setTrack,
    grade,
    setTask,
    resetTasks,
    setPlanDate,
    clearPlanDate,
    resetPlanDates,
    recordAttempt,
  };
}

/**
 * Rótulos del material de estudio para el shell (pestaña, migas, título del
 * documento): id de mazo, de quiz o de kit → su título. Se apoya en la MISMA
 * consulta que las vistas, así que no agrega ni una llamada.
 */
export function useStudyLabels(slug: string): {
  deck: (id: string) => string | undefined;
  quiz: (id: string) => string | undefined;
  kit: (id: string) => string | undefined;
} {
  const { model } = useStudy(slug);
  return useMemo(
    () => ({
      deck: (id: string) => model.deck(id)?.deck.title,
      quiz: (id: string) => model.quiz(id)?.quiz.title,
      kit: (id: string) => model.kit(id)?.kit.title,
    }),
    [model],
  );
}
