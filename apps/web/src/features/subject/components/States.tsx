/**
 * Estados compartidos de las vistas de materia: cargas discretas (esqueletos que
 * ocupan el sitio del contenido real), errores con el mensaje que traiga la capa
 * de datos y la vista «Próximamente» de lo que todavía no existe.
 */
import { Link } from "react-router-dom";
import { routes } from "@sinapsis/contract";
import { ApiError } from "@/lib/api";
import css from "./States.module.css";

/** Esqueleto de una vista ancha (inicio, catálogo, división). */
export function WideSkeleton() {
  return (
    <div className={css.wide} aria-busy="true" aria-live="polite">
      <span className={css.srOnly}>Cargando la materia…</span>
      <div className={css.card} />
      <div className={css.lineWide} />
      <div className={css.rows}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={css.row} />
        ))}
      </div>
    </div>
  );
}

/** Esqueleto de la hoja del lector. */
export function SheetSkeleton() {
  return (
    <div className={css.sheetWrap} aria-busy="true" aria-live="polite">
      <span className={css.srOnly}>Cargando la página…</span>
      <div className={css.sheet}>
        <div className={css.lineChip} />
        <div className={css.lineTitle} />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className={css.line} style={{ width: `${92 - (i % 3) * 14}%` }} />
        ))}
      </div>
    </div>
  );
}

export interface ErrorCardProps {
  error: unknown;
  /** Mensaje propio para el 404 ("Esta materia no existe"). */
  notFound?: string;
  /** Materia a la que volver, si la hay. */
  subject?: string;
}

export function ErrorCard({ error, notFound, subject }: ErrorCardProps) {
  const status = error instanceof ApiError ? error.status : null;
  const message =
    status === 404 && notFound
      ? notFound
      : error instanceof Error && error.message
        ? error.message
        : "No se pudo cargar el contenido.";

  return (
    <div className={css.center}>
      <div className={css.panel} role="alert">
        <span className={css.eyebrow}>{status === 404 ? "NO ENCONTRADO" : "ERROR"}</span>
        <h1 className={css.title}>{message}</h1>
        {status && status !== 404 ? <p className={css.text}>Código de error: {status}.</p> : null}
        <div className={css.actions}>
          {subject ? (
            <Link className={css.action} to={routes.subject(subject)}>
              Ir al inicio de la materia
            </Link>
          ) : null}
          <Link className={css.action} to={routes.landing()}>
            Mis materias
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * «Próximamente». El texto no nombra sprints ni «rail»: son palabras del equipo,
 * no del estudiante (U32). `sprint` se conserva por compatibilidad de firma y ya
 * no se muestra.
 */
export function ComingSoon({ title }: { title: string }) {
  return (
    <div className={css.center}>
      <div className={css.panel}>
        <span className={css.eyebrow}>PRÓXIMAMENTE</span>
        <h1 className={css.title}>{title}</h1>
        <p className={css.text}>
          Esta herramienta llega en la próxima entrega. El sitio ya está reservado en la barra lateral de la materia:
          cuando exista, se abre aquí mismo sin mover nada.
        </p>
      </div>
    </div>
  );
}

export function NotFoundInSubject({ subject }: { subject: string }) {
  return (
    <div className={css.center}>
      <div className={css.panel}>
        <span className={css.eyebrow}>NO ENCONTRADO</span>
        <h1 className={css.title}>Esta dirección no existe en la materia</h1>
        <p className={css.text}>Puede volver al inicio o revisar el catálogo completo del wiki.</p>
        <div className={css.actions}>
          <Link className={css.action} to={routes.subject(subject)}>
            Inicio
          </Link>
          <Link className={css.action} to={routes.wiki(subject)}>
            Todo el wiki
          </Link>
        </div>
      </div>
    </div>
  );
}
