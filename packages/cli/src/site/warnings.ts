/**
 * Advertencias de coherencia de una materia compilada.
 *
 * Son las que levantaba el API al recibir un sync (`services/sync.ts`:
 * `pageWarnings` y `studyWarnings`). Sin API, las tiene que levantar quien
 * compila el sitio: `sinapsis site build` las escribe en `subject.json` para
 * que el informe de la materia siga diciendo lo mismo que decía antes.
 *
 * Se conservan tal cual estaban, incluido el tope: por encima de `MAX_WARNINGS`
 * el resto se resume en una línea, así una materia con el config a medio
 * escribir no genera un `subject.json` de megabytes de texto.
 */
import {
  DIVISION_NONE,
  PAGE_TYPE_META,
  type Page,
  type StudyContent,
  type SubjectConfig,
} from "@sinapsis/contract";

/** Tope de advertencias acumuladas; el resto se resume en una línea final. */
export const MAX_WARNINGS = 120;

/** Acumulador con tope: el excedente se cuenta y se resume al drenar. */
export function warningSink(max = MAX_WARNINGS) {
  const list: string[] = [];
  let extra = 0;
  return {
    push(message: string): void {
      if (list.length < max) list.push(message);
      else extra += 1;
    },
    drain(): string[] {
      if (extra > 0) list.push(`…y ${extra} advertencia(s) más`);
      return list;
    },
  };
}

export type Sink = ReturnType<typeof warningSink>;

/**
 * Páginas con una división o un tipo que el config no declara, y las páginas
 * sin división que el índice no va a mostrar (N0-74): no existe el cajón
 * «Transversales», así que una página sin división que no sea el índice ni el
 * registro y no esté en `wiki.standalone` solo se llega por búsqueda, wikilinks
 * o el catálogo. Se avisa una vez por página; también de cada entrada de
 * `wiki.standalone` que no corresponde a ninguna página.
 */
export function pageWarnings(config: SubjectConfig, list: readonly Page[], sink: Sink): void {
  const divisions = new Set(config.divisions.map((d) => d.key));
  const types = new Set(config.pageTypes.map((t) => t.key));
  const standalone = new Set(config.wiki.standalone);
  const slugs = new Set(list.map((p) => p.slug));
  for (const slug of config.wiki.standalone) {
    if (!slugs.has(slug)) sink.push(`wiki.standalone: la página "${slug}" no existe`);
  }
  for (const page of list) {
    if (page.division !== DIVISION_NONE && !divisions.has(page.division)) {
      sink.push(`página "${page.slug}": la división "${page.division}" no está declarada en el config`);
    }
    if (page.division === DIVISION_NONE && page.type !== PAGE_TYPE_META && !standalone.has(page.slug)) {
      sink.push(
        `página "${page.slug}": sin división y fuera de wiki.standalone; no aparece en el índice (se llega por búsqueda, wikilinks o el catálogo)`,
      );
    }
    // "meta" es el tipo reservado de las páginas índice/registro: nunca se declara en pageTypes.
    if (page.type !== PAGE_TYPE_META && !types.has(page.type)) {
      sink.push(`página "${page.slug}": el tipo "${page.type}" no está declarado en pageTypes`);
    }
  }
}

/**
 * Referencias rotas del material de estudio: tarjetas y preguntas que citan una
 * página inexistente, kits que arman su combo con ids que no existen y tareas
 * del plan cuyo destino no se puede resolver.
 */
export function studyWarnings(
  config: SubjectConfig,
  study: StudyContent,
  pageSlugs: ReadonlySet<string>,
  sink: Sink,
): void {
  const deckIds = new Set(study.decks.map((d) => d.id));
  const quizIds = new Set(study.quizzes.map((q) => q.id));
  const divisions = new Set([...config.divisions.map((d) => d.key), DIVISION_NONE]);

  for (const deck of study.decks) {
    for (const card of deck.cards) {
      if (card.page !== undefined && !pageSlugs.has(card.page)) {
        sink.push(`mazo "${deck.id}": la tarjeta "${card.id}" cita la página "${card.page}", que no existe`);
      }
    }
  }
  for (const quiz of study.quizzes) {
    for (const question of quiz.questions) {
      if (question.page !== undefined && !pageSlugs.has(question.page)) {
        sink.push(`quiz "${quiz.id}": la pregunta "${question.id}" cita la página "${question.page}", que no existe`);
      }
    }
  }
  for (const kit of study.kits) {
    for (const slug of kit.pages) {
      if (!pageSlugs.has(slug)) sink.push(`kit "${kit.id}": la página "${slug}" no existe`);
    }
    for (const id of kit.decks) {
      if (!deckIds.has(id)) sink.push(`kit "${kit.id}": el mazo "${id}" no existe`);
    }
    for (const id of kit.quizzes) {
      if (!quizIds.has(id)) sink.push(`kit "${kit.id}": el quiz "${id}" no existe`);
    }
  }
  for (const phase of study.plan?.phases ?? []) {
    for (const milestone of phase.milestones) {
      for (const task of milestone.tasks) {
        const target = task.target ?? "";
        if (target.length === 0) continue;
        if (task.kind === "read" && !divisions.has(target)) {
          sink.push(`plan · tarea "${task.id}": la división "${target}" no está declarada en el config`);
        } else if (task.kind === "cards" && !deckIds.has(target)) {
          sink.push(`plan · tarea "${task.id}": el mazo "${target}" no existe`);
        } else if (task.kind === "quiz" && !quizIds.has(target)) {
          sink.push(`plan · tarea "${task.id}": el quiz "${target}" no existe`);
        }
      }
    }
  }
}

/**
 * Aristas del grafo de la materia (S-07): un wikilink por par distinto, y solo
 * cuando el destino es una página de la misma materia. Los enlaces rotos
 * (destino inexistente) y los que apuntan a la propia página no entran: la
 * lista es a la vez el índice de backlinks y el grafo de conexiones.
 *
 * Portada de `resolveLinks` del API, con los nombres del contrato del sitio
 * (`GraphEdge`: `from`/`to`).
 */
export function resolveLinks(list: readonly Page[], slugs: ReadonlySet<string>): Array<{ from: string; to: string }> {
  const out: Array<{ from: string; to: string }> = [];
  for (const page of list) {
    const seen = new Set<string>();
    for (const link of page.links) {
      if (link.slug === page.slug || seen.has(link.slug) || !slugs.has(link.slug)) continue;
      seen.add(link.slug);
      out.push({ from: page.slug, to: link.slug });
    }
  }
  return out;
}
