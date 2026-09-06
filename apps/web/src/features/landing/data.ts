/**
 * Acceso a datos de la landing. En producción es `api.landing` tal cual; con
 * `?mock=1` en desarrollo trabaja sobre un juego de fixtures en memoria para
 * poder revisar la vista (y sacar capturas) sin el API levantado.
 */
import type { CreateSubjectInput, LandingLayoutInput, SubjectCard } from "@sinapsis/contract";
import { api } from "@/lib/api";
import { isMockMode, mockLanding, mockParam } from "@/mocks/dev-fixtures";

let mockState: SubjectCard[] | null = null;

function state(): SubjectCard[] {
  if (!mockState) mockState = mockParam("empty") === "1" ? [] : mockLanding.map((c) => ({ ...c }));
  return mockState;
}

export const landingData = {
  list: async (): Promise<SubjectCard[]> => (isMockMode() ? state().map((c) => ({ ...c })) : api.landing.list()),

  saveLayout: async (input: LandingLayoutInput): Promise<SubjectCard[]> => {
    if (!isMockMode()) return api.landing.saveLayout(input);
    const byId = new Map(state().map((c) => [c.slug, c]));
    for (const item of input.items) {
      const card = byId.get(item.slug);
      if (card) Object.assign(card, { semester: item.semester, position: item.position });
    }
    return state().map((c) => ({ ...c }));
  },

  createSubject: async (input: CreateSubjectInput): Promise<SubjectCard> => {
    if (!isMockMode()) return api.landing.createSubject(input);
    const position = state().filter((c) => c.semester === input.semester).length;
    const card: SubjectCard = {
      ...input,
      color: input.color ?? "--u0",
      divisionsCount: 0,
      pagesCount: 0,
      studiedCount: 0,
      position,
      placeholder: true,
      lastSyncAt: null,
    };
    state().push(card);
    return { ...card };
  },

  removeFromLanding: async (slug: string): Promise<void> => {
    if (!isMockMode()) return api.landing.removeFromLanding(slug);
    mockState = state().filter((c) => c.slug !== slug);
  },
};
