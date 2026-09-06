/**
 * Flashcards · lista de mazos. La foto del repaso espaciado de la materia: qué
 * hay vencido hoy, qué no se vio nunca y cuánto está dominado (intervalo ≥ 21 d).
 *
 * Ningún número se calcula acá: todos salen de `buildStudyModel`.
 */
import { plural, routes } from "@sinapsis/contract";
import { Icon } from "@/components/platform";
import { useSubjectCtx } from "../context";
import { ErrorCard, WideSkeleton } from "../components/States";
import { ALL_DECKS } from "./session";
import { ActionLink, Bar, DivisionChip, EmptyPanel, Stat, StudyHead, StudyView } from "./ui";
import { useStudy } from "./useStudy";
import css from "./FlashcardsView.module.css";

export function FlashcardsView() {
  const { slug, model } = useSubjectCtx();
  const { content, state, model: study } = useStudy(slug);

  if (content.isPending) return <WideSkeleton />;
  if (content.isError) return <ErrorCard error={content.error} subject={slug} />;
  /* Vencidas, nuevas y dominadas SON el estado del usuario: si esa consulta
     falla, la vista mostraba ceros como si estuviera todo al día (bug 12). */
  if (state.isError) return <ErrorCard error={state.error} subject={slug} />;

  const { decks, totals } = study;
  const session = (deck: string, modo: string) => `${routes.deck(slug, deck)}?modo=${modo}`;

  if (!decks.length) {
    return (
      <StudyView>
        <EmptyPanel
          eyebrow="SIN MAZOS"
          title="Esta materia todavía no tiene tarjetas"
          actions={
            <>
              <ActionLink to={routes.wiki(slug)} variant="primary">
                Todo el wiki
              </ActionLink>
              <ActionLink to={routes.kits(slug)}>Kits de estudio</ActionLink>
            </>
          }
        >
          <p className={css.emptyText}>
            Los mazos se escriben en la carpeta <code className={css.code}>estudio/</code> del wiki (un archivo
            markdown con <code className={css.code}>tipo: flashcards</code> y una tarjeta por cada{" "}
            <code className={css.code}>##</code>) y llegan con el próximo <code className={css.code}>sync</code>. Si
            las páginas tienen resumen, la plataforma arma además un mazo automático por{" "}
            {model.config.division.singular.toLowerCase()}.
          </p>
        </EmptyPanel>
      </StudyView>
    );
  }

  const queue = totals.due + totals.fresh;

  return (
    <StudyView>
      <StudyHead
        icon="cards"
        eyebrow="REPASO ESPACIADO"
        title="Flashcards"
        lead={
          <>
            {decks.length} {plural(decks.length, "mazo", "mazos")} · {totals.cards}{" "}
            {plural(totals.cards, "tarjeta", "tarjetas")}. Cada tarjeta vuelve a aparecer cuando toca: usted la
            califica y el intervalo se estira solo.
          </>
        }
        aside={
          <>
            <div className={css.totals}>
              <Stat value={totals.due} label="VENCIDAS" tone="due" />
              <Stat value={totals.fresh} label="NUEVAS" tone="fresh" />
              <Stat value={totals.mastered} label="DOMINADAS" tone="mastered" />
            </div>
            {queue > 0 ? (
              <ActionLink
                to={session(ALL_DECKS, totals.due > 0 ? "vencidas" : "nuevas")}
                variant="primary"
                title="Mezcla las tarjetas de todos los mazos"
              >
                <Icon name="timer" size={15} />
                {totals.due > 0 ? `Repasar todo lo vencido (${totals.due})` : `Empezar con las nuevas (${totals.fresh})`}
              </ActionLink>
            ) : (
              <span className={css.clear}>
                <Icon name="star" size={15} />
                Todo al día
              </span>
            )}
          </>
        }
      />

      <div className={css.grid}>
        {decks.map((stat) => {
          const { deck } = stat;
          const division = deck.division ? model.division(deck.division) : null;
          return (
            <article key={deck.id} className={css.card} data-testid="deck-card" data-deck={deck.id}>
              <div className={css.cardHead}>
                {division ? <DivisionChip division={division} /> : null}
                {deck.source === "auto" ? (
                  <span className={css.badge} title="Mazo generado con los resúmenes de las páginas">
                    Automático
                  </span>
                ) : null}
                <span className={css.cardCount}>
                  {stat.total} {plural(stat.total, "tarjeta", "tarjetas")}
                </span>
              </div>

              <h2 className={css.cardTitle}>{deck.title}</h2>
              {deck.description ? <p className={css.cardText}>{deck.description}</p> : null}

              <div className={css.cardStats}>
                <Stat value={stat.due} label="VENCIDAS" tone="due" />
                <Stat value={stat.fresh} label="NUEVAS" tone="fresh" />
                <Stat value={stat.mastered} label="DOMINADAS" tone="mastered" />
              </div>

              <div className={css.cardBar}>
                <Bar
                  ratio={stat.ratio}
                  color={division?.color}
                  label={`${deck.title}: ${stat.mastered} de ${stat.total} tarjetas dominadas`}
                />
                <span className={css.cardBarLabel}>
                  {stat.mastered}/{stat.total} dominadas
                </span>
              </div>

              <div className={css.cardActions}>
                {stat.due > 0 ? (
                  <ActionLink
                    to={session(deck.id, "vencidas")}
                    variant="primary"
                    label={`Repasar vencidas (${stat.due}) · ${deck.title}`}
                  >
                    Repasar vencidas ({stat.due})
                  </ActionLink>
                ) : stat.fresh > 0 ? (
                  <ActionLink
                    to={session(deck.id, "nuevas")}
                    variant="primary"
                    label={`Estudiar nuevas (${stat.fresh}) · ${deck.title}`}
                  >
                    Estudiar nuevas ({stat.fresh})
                  </ActionLink>
                ) : null}
                <ActionLink to={session(deck.id, "todo")} label={`Estudiar todo · ${deck.title}`}>
                  Estudiar todo
                </ActionLink>
              </div>
            </article>
          );
        })}
      </div>
    </StudyView>
  );
}

export default FlashcardsView;
