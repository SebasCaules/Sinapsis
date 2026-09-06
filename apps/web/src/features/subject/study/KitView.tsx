/**
 * Detalle de un kit: sus páginas (con el estado de lectura), sus mazos (con lo
 * que hay vencido), sus quizzes y las herramientas de la materia que declara.
 * Las herramientas se resuelven contra el rail (`model.railItem`): si la materia
 * dejó de declararla, el ítem simplemente no se dibuja.
 */
import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { plural, routes, type IconName } from "@sinapsis/contract";
import { Icon, UiIcon } from "@/components/platform";
import { useSubjectCtx } from "../context";
import { ErrorCard, WideSkeleton } from "../components/States";
import { kitDeckParam } from "./session";
import { ActionLink, Bar, DivisionChip, DivisionChips, EmptyPanel, Stat, StudyView } from "./ui";
import { useStudy } from "./useStudy";
import css from "./KitView.module.css";

export function KitView() {
  const { slug, model } = useSubjectCtx();
  const { kit: kitId = "" } = useParams();
  const { content, state, model: study } = useStudy(slug, model.studied);

  if (content.isError) return <ErrorCard error={content.error} subject={slug} />;
  /* Lo vencido de los mazos del kit sale del estado del usuario (bug 12). */
  if (state.isError) return <ErrorCard error={state.error} subject={slug} />;
  if (content.isPending) return <WideSkeleton />;

  const stat = study.kit(kitId);

  if (!stat) {
    return (
      <StudyView>
        <EmptyPanel
          eyebrow="NO ENCONTRADO"
          title="Ese kit no existe en la materia"
          actions={
            <ActionLink to={routes.kits(slug)} variant="primary">
              Volver a los kits
            </ActionLink>
          }
        >
          <p className={css.text}>Puede que se haya renombrado en la última sincronización del wiki.</p>
        </EmptyPanel>
      </StudyView>
    );
  }

  const { kit } = stat;
  const pages = kit.pages.map((s) => model.bySlug.get(s)).filter((p): p is NonNullable<typeof p> => !!p);
  const tools = kit.tools.map((id) => model.railItem(id)).filter((t): t is NonNullable<typeof t> => !!t);

  return (
    <StudyView>
      <header className={css.head}>
        <div className={css.headMain}>
          <Link className={css.back} to={routes.kits(slug)}>
            <UiIcon name="back" size={15} />
            Kits
          </Link>
          <span className={css.eyebrow}>
            <Icon name="grid" size={14} />
            KIT DE ESTUDIO
          </span>
          <h1 className={css.title}>{kit.title}</h1>
          {kit.description ? <p className={css.lead}>{kit.description}</p> : null}
          <DivisionChips model={model} keys={kit.divisions} />
        </div>
        <div className={css.headAside}>
          <div className={css.totals}>
            <Stat value={`${stat.read}/${kit.pages.length}`} label="LEÍDAS" />
            <Stat value={stat.cards} label="TARJETAS" />
            <Stat value={stat.due} label="POR REPASAR" tone="due" />
          </div>
          {stat.decks.length ? (
            <ActionLink
              to={`${routes.deck(slug, kitDeckParam(kit.id))}?modo=${stat.due > 0 ? "vencidas" : "todo"}`}
              variant="primary"
            >
              <Icon name="cards" size={15} />
              Repasar los mazos del kit
            </ActionLink>
          ) : null}
        </div>
      </header>

      {pages.length ? (
        <Section icon="book" title="Páginas" count={`${stat.read} de ${pages.length} leídas`}>
          <ul className={css.list}>
            {pages.map((page) => {
              const division = model.division(model.divisionOf(page));
              const read = model.studied.has(page.slug);
              return (
                <li key={page.slug}>
                  <Link className={css.row} to={routes.page(slug, page.slug)} data-done={read ? "true" : undefined}>
                    <span className={css.check} aria-hidden="true">
                      <UiIcon name="check" size={12} />
                    </span>
                    {division ? <DivisionChip division={division} /> : null}
                    <span className={css.rowTitle}>{page.title}</span>
                    <span className={css.rowMeta}>{model.typeLabel(page.type)}</span>
                    <span className={css.srOnly}>{read ? "leída" : "sin leer"}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Section>
      ) : null}

      {stat.decks.length ? (
        <Section
          icon="cards"
          title="Mazos"
          count={`${stat.cards} ${plural(stat.cards, "tarjeta", "tarjetas")}`}
        >
          <ul className={css.list}>
            {stat.decks.map((deck) => {
              const d = study.deck(deck.id);
              const division = deck.division ? model.division(deck.division) : null;
              return (
                <li key={deck.id}>
                  <Link className={css.row} to={routes.deck(slug, deck.id)}>
                    {division ? <DivisionChip division={division} /> : null}
                    <span className={css.rowTitle}>{deck.title}</span>
                    <span className={css.rowBar}>
                      <Bar
                        ratio={d?.ratio ?? 0}
                        color={division?.color}
                        label={`${deck.title}: ${d?.mastered ?? 0} de ${d?.total ?? 0} tarjetas dominadas`}
                      />
                    </span>
                    <span className={css.rowMeta}>
                      {d ? `${d.due} vencidas · ${d.fresh} nuevas` : ""}
                    </span>
                    <UiIcon name="chevronRight" size={15} className={css.chevron} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </Section>
      ) : null}

      {stat.quizzes.length ? (
        <Section icon="quiz" title="Quizzes" count={`${stat.questions} ${plural(stat.questions, "pregunta", "preguntas")}`}>
          <ul className={css.list}>
            {stat.quizzes.map((quiz) => {
              const q = study.quiz(quiz.id);
              return (
                <li key={quiz.id}>
                  <Link className={css.row} to={routes.quizOne(slug, quiz.id)}>
                    <span className={css.rowTitle}>{quiz.title}</span>
                    <span className={css.rowMeta}>
                      {quiz.questions.length} {plural(quiz.questions.length, "pregunta", "preguntas")}
                      {q?.best ? ` · mejor ${q.best.score}/${q.best.total}` : " · sin intentos"}
                    </span>
                    <UiIcon name="chevronRight" size={15} className={css.chevron} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </Section>
      ) : null}

      {tools.length ? (
        <Section icon="tool" title="Herramientas" count={`${tools.length} de la materia`}>
          <ul className={css.tools}>
            {tools.map((view) =>
              view.external && view.href ? (
                <li key={view.item.id}>
                  <a className={css.tool} href={view.href} target="_blank" rel="noopener noreferrer">
                    <Icon name={view.item.icon} size={17} />
                    {view.item.label}
                    <UiIcon name="external" size={13} className={css.chevron} />
                  </a>
                </li>
              ) : view.to ? (
                <li key={view.item.id}>
                  <Link className={css.tool} to={view.to}>
                    <Icon name={view.item.icon} size={17} />
                    {view.item.label}
                    <UiIcon name="chevronRight" size={15} className={css.chevron} />
                  </Link>
                </li>
              ) : null,
            )}
          </ul>
        </Section>
      ) : null}
    </StudyView>
  );
}

function Section({
  icon,
  title,
  count,
  children,
}: {
  icon: IconName;
  title: string;
  count: string;
  children: ReactNode;
}) {
  return (
    <section className={css.section}>
      <header className={css.sectionHead}>
        {/* «Páginas», «Mazos», «Quizzes» y «Herramientas» son las secciones de la
            vista: en `span` no existían para quien navega por encabezados (U39). */}
        <h2 className={css.sectionTitle}>
          <Icon name={icon} size={15} />
          {title}
        </h2>
        <span className={css.sectionCount}>{count}</span>
      </header>
      {children}
    </section>
  );
}

export default KitView;
