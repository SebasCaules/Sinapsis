/**
 * Flashcards · lista de mazos. La foto del repaso espaciado de la materia: qué
 * hay vencido hoy, qué no se vio nunca y cuánto está dominado (intervalo ≥ 21 d).
 *
 * Dos accesos sintéticos arriba, los mismos que el baseline (study.js:63-70):
 * «Repaso de hoy» —vencidas MÁS nuevas, que es lo que abre la sesión— y «Todas
 * las tarjetas», para pasar el material entero antes de un parcial.
 *
 * Ningún número se calcula acá: todos salen de `buildStudyModel`.
 */
import { Link } from "react-router-dom";
import { plural, routes } from "@sinapsis/contract";
import { Icon } from "@/components/platform";
import { useSubjectCtx } from "../context";
import type { SubjectModel } from "../model";
import { ErrorCard, WideSkeleton } from "../components/States";
import { MASTERED_DAYS, type DeckStat } from "./model";
import { ALL_DECKS } from "./session";
import { ActionLink, Bar, DivisionChip, EmptyPanel, Kbd, Stat, StudyHead, StudyView } from "./ui";
import { useStudy } from "./useStudy";
import css from "./FlashcardsView.module.css";

/** Qué define «dominada»; el número sale del modelo para no repetirlo en el copy. */
const MASTERED_HINT = `Tarjetas cuyo próximo repaso cae a ${MASTERED_DAYS} días o más`;

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

  /* Los mazos que escribió la materia primero; los que arma la plataforma con
     los resúmenes de las páginas (N0-27), en su propia sección: son doce contra
     seis en Proba y empujaban el material redactado fuera de la pantalla. */
  const authored = decks.filter((d) => d.deck.source !== "auto");
  const auto = decks.filter((d) => d.deck.source === "auto");
  const split = authored.length > 0 && auto.length > 0;

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
            califica y el intervalo se estira solo. Atajos: <Kbd>Espacio</Kbd> voltea, <Kbd>1</Kbd>–<Kbd>4</Kbd>{" "}
            califican, <Kbd>Esc</Kbd> vuelve.
          </>
        }
        aside={
          <>
            <div className={css.totals}>
              <Stat value={totals.due} label="VENCIDAS" tone="due" />
              <Stat value={totals.fresh} label="NUEVAS" tone="fresh" />
              {/* El envoltorio existe solo por el `title`: `Stat` todavía no
                  recibe descripción (pedido a la dueña de `study/ui.tsx`). */}
              <span className={css.statHint} title={MASTERED_HINT}>
                <Stat value={totals.mastered} label="DOMINADAS" tone="mastered" />
              </span>
            </div>
            <div className={css.headActions}>
              {totals.pending > 0 ? (
                <ActionLink
                  to={session(ALL_DECKS, "vencidas")}
                  variant="primary"
                  title="Mezcla lo pendiente de todos los mazos: lo vencido primero y después lo que nunca vio"
                >
                  <Icon name="timer" size={15} />
                  Repaso de hoy ({totals.pending})
                </ActionLink>
              ) : (
                <span className={css.clear}>
                  <Icon name="star" size={15} />
                  Todo al día
                </span>
              )}
              {/* Permanente, como el mazo sintético «Todas las tarjetas» del
                  baseline: es la salida del estado «Todo al día», que antes era
                  un texto sin ninguna acción. */}
              <ActionLink
                to={session(ALL_DECKS, "todo")}
                variant={totals.pending > 0 ? "secondary" : "primary"}
                title="Baraja el material entero, esté vencido o no"
              >
                Todas las tarjetas ({totals.cards})
              </ActionLink>
            </div>
          </>
        }
      />

      {split ? (
        <>
          <DeckSection
            title="Mazos de la materia"
            hint="Escritos en la carpeta «estudio/» del wiki."
            decks={authored}
            slug={slug}
            model={model}
            level={3}
          />
          <DeckSection
            title="Resúmenes automáticos"
            hint={`Los arma la plataforma con el resumen de cada página, uno por ${model.config.division.singular.toLowerCase()}.`}
            decks={auto}
            slug={slug}
            model={model}
            level={3}
          />
        </>
      ) : (
        <DeckSection decks={decks} slug={slug} model={model} level={2} />
      )}
    </StudyView>
  );
}

function DeckSection({
  title,
  hint,
  decks,
  slug,
  model,
  level,
}: {
  title?: string;
  hint?: string;
  decks: DeckStat[];
  slug: string;
  model: SubjectModel;
  /** El título de un mazo baja a h3 cuando la sección se lleva el h2. */
  level: 2 | 3;
}) {
  const session = (deck: string, modo: string) => `${routes.deck(slug, deck)}?modo=${modo}`;
  const Title = level === 2 ? "h2" : "h3";

  return (
    <section className={css.section}>
      {title ? (
        <div className={css.sectionHead}>
          <h2 className={css.sectionTitle}>{title}</h2>
          <span className={css.sectionMeta}>
            {decks.length} {plural(decks.length, "mazo", "mazos")}
            {hint ? ` · ${hint}` : ""}
          </span>
        </div>
      ) : null}

      <div className={css.grid}>
        {decks.map((stat) => {
          const { deck } = stat;
          const division = deck.division ? model.division(deck.division) : null;
          /* Un mazo que nunca se estudió tiene tres ceros y una barra vacía que
             no dicen nada: en el arranque eran dieciocho filas iguales. El bloque
             de cifras aparece cuando hay algo que mostrar. */
          const started = stat.fresh < stat.total;
          const main = stat.pending > 0 ? session(deck.id, "vencidas") : session(deck.id, "todo");
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

              {/* La baldosa entera abre el mazo, como el `<button class="deck-card">`
                  del baseline (study.js:85): el enlace del título se estira sobre
                  toda la tarjeta con un pseudoelemento, así que sigue habiendo un
                  solo punto de tabulación por acción. */}
              <Title className={css.cardTitle}>
                <Link className={css.cardLink} to={main}>
                  {deck.title}
                </Link>
              </Title>
              {deck.description ? <p className={css.cardText}>{deck.description}</p> : null}

              {started ? (
                <>
                  <div className={css.cardStats}>
                    <Stat value={stat.due} label="VENCIDAS" tone="due" />
                    <Stat value={stat.fresh} label="NUEVAS" tone="fresh" />
                    <span className={css.statHint} title={MASTERED_HINT}>
                      <Stat value={stat.mastered} label="DOMINADAS" tone="mastered" />
                    </span>
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
                </>
              ) : null}

              <div className={css.cardActions}>
                {stat.pending > 0 ? (
                  <ActionLink
                    to={session(deck.id, "vencidas")}
                    variant="primary"
                    label={`Repasar pendientes (${stat.pending}) · ${deck.title}`}
                  >
                    Repasar pendientes ({stat.pending})
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
    </section>
  );
}

export default FlashcardsView;
