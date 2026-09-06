/**
 * Detalle de un kit: sus lanzadores (lo primero: es la razón de ser del kit),
 * sus páginas clave —que se pueden tildar como leídas desde acá, una por una o
 * todas juntas—, sus mazos y sus quizzes.
 *
 * Los lanzadores se resuelven contra el rail (`model.railItem`) por el id que
 * declara el kit; un lanzador con rótulo propio a una vista de herramienta que
 * el rail no declara sigue abriéndose por `/t/:id` (si el bundle no la trae, el
 * host muestra «Próximamente»).
 *
 * Marcar leída una página usa la MISMA mutación que el lector
 * (`useToggleStudied`), así que el tilde viaja al wiki, al índice y al inicio.
 */
import { useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { kitToolId, kitToolParams, plural, routes, type IconName, type KitTool } from "@sinapsis/contract";
import { Icon, UiIcon, useToast } from "@/components/platform";
import { useSubjectCtx } from "../context";
import { ErrorCard, WideSkeleton } from "../components/States";
import type { SubjectModel } from "../model";
import { useToggleStudied } from "../useSubject";
import { kitDeckParam } from "./session";
import { ActionLink, Bar, DivisionChip, DivisionChips, EmptyPanel, Ring, Stat, StudyView } from "./ui";
import { useStudy } from "./useStudy";
import css from "./KitView.module.css";

/** Un lanzador del kit, ya resuelto a un destino de la aplicación. */
export interface KitToolView {
  /** Clave de lista (un kit puede repetir destino con otro rótulo). */
  key: string;
  label: string;
  icon: IconName;
  /** Ruta interna, o null si es un enlace externo. */
  to: string | null;
  href: string | null;
  external: boolean;
}

/**
 * Resuelve los lanzadores de un kit contra el rail de la materia.
 *
 * El kit puede declarar solo el id (`"calc"`) —y entonces el rótulo y el icono
 * son los del rail— o su propio lanzador (`{ target, label, icon }`), con
 * parámetros en el destino (`"explorador?d=normal"`), como en el baseline.
 */
export function kitToolViews(model: SubjectModel, slug: string, tools: readonly KitTool[]): KitToolView[] {
  const out: KitToolView[] = [];
  tools.forEach((tool, i) => {
    const id = kitToolId(tool);
    const params = kitToolParams(tool);
    const own = typeof tool === "string" ? null : tool;
    const key = `${id}#${i}`;
    const withParams = (to: string): string => (params ? `${to}?${params}` : to);
    const view = model.railItem(id);

    if (view) {
      const label = own?.label ?? view.item.label;
      const icon = own?.icon ?? view.item.icon;
      /* Un enlace externo se abre tal cual: los parámetros del kit son de las
         rutas de la aplicación, no de un sitio de terceros. */
      if (view.external && view.href) {
        out.push({ key, label, icon, to: null, href: view.href, external: true });
      } else if (view.to) {
        out.push({ key, label, icon, to: withParams(view.to), href: null, external: false });
      }
      return;
    }

    /* Sin ítem en el rail, solo se dibuja el lanzador que trae rótulo propio:
       una cadena suelta que el rail no conoce no tiene nada que mostrar. */
    if (own?.label) {
      out.push({
        key,
        label: own.label,
        icon: own.icon ?? "tool",
        to: withParams(routes.tool(slug, id)),
        href: null,
        external: false,
      });
    }
  });
  return out;
}

export function KitView() {
  const { slug, model } = useSubjectCtx();
  const { kit: kitId = "" } = useParams();
  const { content, state, model: study } = useStudy(slug, model.studied);
  const toggleStudied = useToggleStudied(slug);
  const { toast } = useToast();
  const [marking, setMarking] = useState(false);

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
  const tools = kitToolViews(model, slug, kit.tools);
  /* El acento del kit: el que declara la materia y, si no, el de su primera
     división (así el kit se ve del color de lo que agrupa). */
  const accent = stat.color ?? model.division(kit.divisions[0] ?? "")?.color ?? "var(--primary)";
  const read = pages.filter((p) => model.studied.has(p.slug)).length;
  const allRead = pages.length > 0 && read === pages.length;

  const setRead = (page: string, studied: boolean) => {
    toggleStudied.mutate({ page, studied });
  };

  /** «Marcar todas como leídas» / «Desmarcar todas»: una página por vez, en orden. */
  const markAll = async () => {
    const on = !allRead;
    const targets = pages.filter((p) => model.studied.has(p.slug) !== on);
    if (!targets.length || marking) return;
    setMarking(true);
    try {
      for (const page of targets) {
        await toggleStudied.mutateAsync({ page: page.slug, studied: on });
      }
      toast(on ? "Páginas marcadas como leídas" : "Páginas desmarcadas", "good");
    } catch {
      /* El aviso de error lo pone la propia mutación (deshace el optimista). */
    } finally {
      setMarking(false);
    }
  };

  return (
    <StudyView>
      <header className={css.head} style={{ ["--ucol" as string]: accent }}>
        <div className={css.headMain}>
          <Link className={css.back} to={routes.kits(slug)}>
            <UiIcon name="back" size={15} />
            Kits
          </Link>
          <div className={css.identity}>
            <span className={css.pill} aria-hidden="true">
              <Icon name={stat.icon} size={24} />
            </span>
            <div className={css.identityText}>
              <span className={css.eyebrow}>
                <Icon name="grid" size={14} />
                KIT DE ESTUDIO
              </span>
              <h1 className={css.title}>{kit.title}</h1>
            </div>
          </div>
          {kit.description ? <p className={css.lead}>{kit.description}</p> : null}
          <DivisionChips model={model} keys={kit.divisions} />
        </div>
        <div className={css.headAside}>
          <div className={css.asideRow}>
            {pages.length ? (
              <Ring
                ratio={pages.length ? read / pages.length : 0}
                size={76}
                color={accent}
                label={`${kit.title}: ${read} de ${pages.length} páginas leídas`}
              />
            ) : null}
            <div className={css.totals}>
              <Stat value={`${read}/${pages.length}`} label="LEÍDAS" />
              <Stat value={stat.cards} label="TARJETAS" />
              <Stat value={stat.due} label="POR REPASAR" tone="due" />
            </div>
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

      {/* Las herramientas van PRIMERO: es a lo que se entra a buscar al kit. */}
      {tools.length ? (
        <Section icon="tool" title="Herramientas" count={`${tools.length} de la materia`}>
          <ul className={css.tools} style={{ ["--ucol" as string]: accent }}>
            {tools.map((tool) =>
              tool.external && tool.href ? (
                <li key={tool.key}>
                  <a className={css.tool} href={tool.href} target="_blank" rel="noopener noreferrer">
                    <span className={css.toolIcon} aria-hidden="true">
                      <Icon name={tool.icon} size={18} />
                    </span>
                    <span className={css.toolLabel}>{tool.label}</span>
                    <UiIcon name="external" size={14} className={css.chevron} />
                  </a>
                </li>
              ) : tool.to ? (
                <li key={tool.key}>
                  <Link className={css.tool} to={tool.to}>
                    <span className={css.toolIcon} aria-hidden="true">
                      <Icon name={tool.icon} size={18} />
                    </span>
                    <span className={css.toolLabel}>{tool.label}</span>
                    <UiIcon name="chevronRight" size={15} className={css.chevron} />
                  </Link>
                </li>
              ) : null,
            )}
          </ul>
        </Section>
      ) : null}

      {pages.length ? (
        <Section
          icon="book"
          title="Páginas clave"
          count={`${read} de ${pages.length} leídas`}
          action={
            <button type="button" className={css.markAll} onClick={() => void markAll()} disabled={marking}>
              <UiIcon name="check" size={13} />
              {allRead ? "Desmarcar todas" : "Marcar todas como leídas"}
            </button>
          }
        >
          <ul className={css.list}>
            {pages.map((page) => {
              const division = model.division(model.divisionOf(page));
              const done = model.studied.has(page.slug);
              return (
                <li key={page.slug} className={css.pageRow} data-done={done ? "true" : undefined}>
                  {/* La casilla es un control propio, fuera del enlace: antes
                      tenía forma de casilla pero navegaba a la página. El
                      rótulo lleva el título porque hay una casilla por fila. */}
                  <button
                    type="button"
                    className={css.check}
                    aria-pressed={done}
                    aria-label={`${done ? "Marcar como no leída" : "Marcar como leída"}: ${page.title}`}
                    onClick={() => setRead(page.slug, !done)}
                  >
                    <UiIcon name="check" size={12} />
                  </button>
                  <Link className={css.row} to={routes.page(slug, page.slug)}>
                    {division ? <DivisionChip division={division} /> : null}
                    <span className={css.rowTitle}>{page.title}</span>
                    <span className={css.rowMeta}>{model.typeLabel(page.type)}</span>
                    <UiIcon name="chevronRight" size={15} className={css.chevron} />
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
    </StudyView>
  );
}

function Section({
  icon,
  title,
  count,
  action,
  children,
}: {
  icon: IconName;
  title: string;
  count: string;
  /** Acción de la sección, a la derecha del conteo («Marcar todas como leídas»). */
  action?: ReactNode;
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
        <div className={css.sectionAside}>
          <span className={css.sectionCount}>{count}</span>
          {action}
        </div>
      </header>
      {children}
    </section>
  );
}

export default KitView;
