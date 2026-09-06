import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent } from "react";
import type { ZodIssue } from "zod";
import { CreateSubjectInput, plural, type SubjectCard } from "@sinapsis/contract";
import { Button, Dialog, Field, SelectField, UiIcon } from "@/components/platform";
import { slugify } from "@/lib/slug";
import { nextSemesterSuggestion, semesterLabel } from "@/lib/semesters";
import css from "./AddSubjectDialog.module.css";

/** Los seis colores que ofrece el diálogo (los del mockup), con su nombre. */
export const SWATCHES = [
  { token: "--u1", name: "Verde jade" },
  { token: "--u2", name: "Azul" },
  { token: "--u4", name: "Óxido" },
  { token: "--u6", name: "Ámbar" },
  { token: "--u8", name: "Verde" },
  { token: "--u0", name: "Gris" },
] as const;

const NEW_SEMESTER = "__new__";

const TOP_FIELDS = new Set(["name", "slug", "code", "institution", "semester"]);

/** Los mensajes por defecto de zod están en inglés: acá se dicen en español. */
function issueText(issue: ZodIssue): string {
  if (issue.code === "too_small") {
    return issue.minimum === 1 ? "Este campo es obligatorio." : `Escriba al menos ${issue.minimum} caracteres.`;
  }
  if (issue.code === "too_big") return `No puede pasar de ${issue.maximum} caracteres.`;
  /* Los mensajes propios del contrato ya vienen en español; los genéricos no. */
  return /^(String|Number|Invalid|Required|Expected|Array)\b/.test(issue.message)
    ? "El formato no es válido."
    : issue.message;
}

const EMPTY = {
  name: "",
  slug: "",
  code: "",
  institution: "",
  color: "--u1" as string,
  singular: "Unidad",
  abbr: "U",
  plural: "Unidades",
};

export interface AddSubjectDialogProps {
  open: boolean;
  onClose: () => void;
  /**
   * Materias del catálogo del sitio que NO están en la landing: se ofrecen
   * primero, porque agregarlas es un clic y traen su wiki entero. El formulario
   * de abajo sigue siendo para las materias que el usuario inventa (S4 · §2.2).
   */
  available?: SubjectCard[];
  semesters: string[];
  /** Cuatrimestre preseleccionado (el más reciente). */
  defaultSemester?: string;
  onSubmit: (input: CreateSubjectInput) => Promise<void>;
  submitting?: boolean;
}

type Errors = Partial<Record<"name" | "slug" | "code" | "institution" | "semester" | "singular" | "abbr" | "plural" | "form", string>>;

export function AddSubjectDialog({
  open,
  onClose,
  available = [],
  semesters,
  defaultSemester,
  onSubmit,
  submitting = false,
}: AddSubjectDialogProps) {
  const nameRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [semester, setSemester] = useState(defaultSemester ?? semesters[0] ?? "");
  const [newSemester, setNewSemester] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  /** Slug de la materia del catálogo elegida; `null` = «Materia nueva». */
  const [picked, setPicked] = useState<string | null>(null);
  const swatchRef = useRef<HTMLDivElement>(null);

  /* Cada apertura arranca de cero. */
  useEffect(() => {
    if (!open) return;
    setForm(EMPTY);
    setSlugTouched(false);
    setErrors({});
    setSemester(defaultSemester ?? semesters[0] ?? NEW_SEMESTER);
    setNewSemester(nextSemesterSuggestion(semesters));
    /* Si hay materias del catálogo, la primera viene elegida: agregarla es el
       camino corto y el formulario queda para quien lo necesite. */
    setPicked(available[0]?.slug ?? null);
  }, [open, defaultSemester, semesters, available]);

  const set = (patch: Partial<typeof EMPTY>) => setForm((f) => ({ ...f, ...patch }));

  /* Un radiogroup se recorre con las flechas, no con el tabulador. */
  function onSwatchKey(e: KeyboardEvent<HTMLDivElement>) {
    const delta = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (delta === 0) return;
    e.preventDefault();
    /* El punto de partida es el que tiene el foco, no el del estado: con la
       tecla repetida el foco ya se movió antes de que React confirme el color. */
    const focused = (document.activeElement as HTMLElement | null)?.dataset.token;
    const at = SWATCHES.findIndex((sw) => sw.token === (focused ?? form.color));
    const next = SWATCHES[(at + delta + SWATCHES.length) % SWATCHES.length];
    if (!next) return;
    set({ color: next.token });
    swatchRef.current?.querySelector<HTMLButtonElement>(`[data-token="${next.token}"]`)?.focus();
  }
  const slug = slugTouched ? form.slug : slugify(form.name);

  const semesterOptions = useMemo(
    () => [
      ...semesters.map((s) => ({ value: s, label: semesterLabel(s) })),
      { value: NEW_SEMESTER, label: "Nuevo…" },
    ],
    [semesters],
  );

  const chosen = picked ? available.find((card) => card.slug === picked) : undefined;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const chosenSemester = semester === NEW_SEMESTER ? newSemester.trim() : semester;
    const candidate = chosen
      ? {
          slug: chosen.slug,
          name: chosen.name,
          code: chosen.code,
          institution: chosen.institution,
          semester: chosenSemester,
          color: chosen.color,
          division: chosen.division,
        }
      : {
          slug,
          name: form.name.trim(),
          code: form.code.trim(),
          institution: form.institution.trim(),
          semester: chosenSemester,
          color: form.color,
          division: { singular: form.singular.trim(), abbr: form.abbr.trim(), plural: form.plural.trim() },
        };

    const parsed = CreateSubjectInput.safeParse(candidate);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const [head, tail] = issue.path as (string | number)[];
        if (head === "division") {
          const key = tail === "singular" ? "singular" : tail === "abbr" ? "abbr" : "plural";
          next[key] ??= issueText(issue);
        } else if (typeof head === "string" && TOP_FIELDS.has(head)) {
          next[head as keyof Errors] ??= issueText(issue);
        } else {
          next.form ??= issueText(issue);
        }
      }
      if (!chosen && candidate.slug === "") next.slug = "Se deriva del nombre: escriba un nombre o edite la dirección.";
      setErrors(next);
      return;
    }

    setErrors({});
    void onSubmit(parsed.data).catch((err: Error) => setErrors({ form: err.message }));
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      initialFocus={nameRef}
      eyebrow="NUEVA MATERIA"
      title="Agregar materia"
      footer={
        <>
          <Button onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            form="add-subject"
            type="submit"
            disabled={submitting}
            aria-busy={submitting || undefined}
          >
            {submitting ? "Agregando…" : "Agregar materia"}
          </Button>
        </>
      }
    >
      <form id="add-subject" className={css.grid} onSubmit={handleSubmit} noValidate>
        {errors.form ? <div className={css.formError}>{errors.form}</div> : null}

        {available.length > 0 ? (
          <div className={`${css.wide} ${css.catalog}`}>
            <span className={css.catalogLabel}>Materias del catálogo</span>
            <div className={css.catalogList} role="radiogroup" aria-label="Materias del catálogo">
              {available.map((card) => (
                <button
                  key={card.slug}
                  type="button"
                  role="radio"
                  aria-checked={picked === card.slug}
                  className={css.catalogRow}
                  onClick={() => setPicked(card.slug)}
                >
                  <span className={css.dot} style={{ "--sw": `var(${card.color})` } as CSSProperties} />
                  <span className={css.catalogName}>{card.name}</span>
                  <span className={css.catalogMeta}>
                    {card.code} · {plural(card.pagesCount, "página", "páginas")}
                  </span>
                </button>
              ))}
              <button
                type="button"
                role="radio"
                aria-checked={picked === null}
                className={css.catalogRow}
                onClick={() => setPicked(null)}
              >
                <span className={css.dotPlus}>
                  <UiIcon name="plus" size={12} />
                </span>
                <span className={css.catalogName}>Materia nueva</span>
                <span className={css.catalogMeta}>Para completar a mano</span>
              </button>
            </div>
          </div>
        ) : null}

        {chosen ? null : (
        <>
        <div className={css.wide}>
          <Field
            ref={nameRef}
            label="Nombre"
            placeholder="Materia"
            value={form.name}
            error={errors.name}
            onChange={(e) => set({ name: e.target.value })}
            autoComplete="off"
          />
        </div>

        <div className={css.wide}>
          {/* «Slug» es jerga: el usuario ve la dirección de la materia (U31). */}
          <Field
            label="Dirección (/m/…)"
            mono
            placeholder="materia"
            value={slug}
            error={errors.slug}
            hint="Se deriva del nombre; se puede editar."
            onChange={(e) => {
              setSlugTouched(true);
              set({ slug: slugify(e.target.value) });
            }}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <Field
          label="Código"
          mono
          placeholder="00.00"
          value={form.code}
          error={errors.code}
          onChange={(e) => set({ code: e.target.value })}
          autoComplete="off"
        />

        <Field
          label="Institución"
          placeholder="Institución"
          value={form.institution}
          error={errors.institution}
          onChange={(e) => set({ institution: e.target.value })}
          autoComplete="off"
        />
        </>
        )}

        <SelectField
          label="Cuatrimestre"
          options={semesterOptions}
          value={semester}
          error={errors.semester}
          onChange={(e) => setSemester(e.target.value)}
        />

        {chosen ? null : (
        <div className={css.swatches}>
          <span className={css.swatchLabel}>Color</span>
          <div
            className={css.swatchRow}
            role="radiogroup"
            aria-label="Color de la materia"
            ref={swatchRef}
            onKeyDown={onSwatchKey}
          >
            {SWATCHES.map(({ token, name }) => (
              <button
                key={token}
                type="button"
                role="radio"
                data-token={token}
                className={css.swatch}
                style={{ "--sw": `var(${token})` } as CSSProperties}
                aria-label={name}
                aria-checked={form.color === token}
                tabIndex={form.color === token ? 0 : -1}
                onClick={() => set({ color: token })}
              />
            ))}
          </div>
        </div>
        )}

        {semester === NEW_SEMESTER ? (
          <div className={css.wide}>
            <Field
              label="Nuevo cuatrimestre"
              mono
              placeholder="2026-1C"
              value={newSemester}
              error={errors.semester}
              hint="Formato sugerido: AAAA-1C o AAAA-2C."
              onChange={(e) => setNewSemester(e.target.value)}
              autoComplete="off"
            />
          </div>
        ) : null}

        {chosen ? null : (
        <div className={css.division}>
          <span className={css.divisionLabel}>Rótulo de división</span>
          <div className={css.divisionGrid}>
            <Field
              label="Singular"
              placeholder="Unidad"
              value={form.singular}
              error={errors.singular}
              onChange={(e) => set({ singular: e.target.value })}
            />
            <Field
              label="Abreviatura"
              placeholder="U"
              value={form.abbr}
              error={errors.abbr}
              onChange={(e) => set({ abbr: e.target.value })}
            />
            <Field
              label="Plural"
              placeholder="Unidades"
              value={form.plural}
              error={errors.plural}
              onChange={(e) => set({ plural: e.target.value })}
            />
          </div>
        </div>
        )}
      </form>
    </Dialog>
  );
}
