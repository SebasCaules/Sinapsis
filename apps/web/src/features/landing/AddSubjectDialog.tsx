import { useEffect, useMemo, useState, type CSSProperties, type FormEvent } from "react";
import type { ZodIssue } from "zod";
import { CreateSubjectInput } from "@sinapsis/contract";
import { Button, Dialog, Field, SelectField } from "@/components/platform";
import { slugify } from "@/lib/slug";
import { nextSemesterSuggestion, semesterLabel } from "@/lib/semesters";
import css from "./AddSubjectDialog.module.css";

/** Los seis colores que ofrece el diálogo (los del mockup). */
export const SWATCHES = ["--u1", "--u2", "--u4", "--u6", "--u8", "--u0"] as const;

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
  semesters,
  defaultSemester,
  onSubmit,
  submitting = false,
}: AddSubjectDialogProps) {
  const [form, setForm] = useState(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [semester, setSemester] = useState(defaultSemester ?? semesters[0] ?? "");
  const [newSemester, setNewSemester] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  /* Cada apertura arranca de cero. */
  useEffect(() => {
    if (!open) return;
    setForm(EMPTY);
    setSlugTouched(false);
    setErrors({});
    setSemester(defaultSemester ?? semesters[0] ?? NEW_SEMESTER);
    setNewSemester(nextSemesterSuggestion(semesters));
  }, [open, defaultSemester, semesters]);

  const set = (patch: Partial<typeof EMPTY>) => setForm((f) => ({ ...f, ...patch }));
  const slug = slugTouched ? form.slug : slugify(form.name);

  const semesterOptions = useMemo(
    () => [
      ...semesters.map((s) => ({ value: s, label: semesterLabel(s) })),
      { value: NEW_SEMESTER, label: "Nuevo…" },
    ],
    [semesters],
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const chosenSemester = semester === NEW_SEMESTER ? newSemester.trim() : semester;
    const candidate = {
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
      if (candidate.slug === "") next.slug = "Se deriva del nombre: escriba un nombre o edite el slug.";
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
      eyebrow="CONTRATO DE MATERIA"
      title="Agregar materia"
      footer={
        <>
          <Button onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button variant="primary" form="add-subject" type="submit" disabled={submitting}>
            {submitting ? "Agregando…" : "Agregar materia"}
          </Button>
        </>
      }
    >
      <form id="add-subject" className={css.grid} onSubmit={handleSubmit} noValidate>
        {errors.form ? <div className={css.formError}>{errors.form}</div> : null}

        <div className={css.wide}>
          <Field
            label="Nombre"
            placeholder="Materia"
            value={form.name}
            error={errors.name}
            onChange={(e) => set({ name: e.target.value })}
            autoComplete="off"
          />
        </div>

        <div className={css.wide}>
          <Field
            label="Slug"
            mono
            placeholder="materia"
            value={slug}
            error={errors.slug}
            hint="Se usa en la dirección: /m/…"
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

        <SelectField
          label="Cuatrimestre"
          options={semesterOptions}
          value={semester}
          error={errors.semester}
          onChange={(e) => setSemester(e.target.value)}
        />

        <div className={css.swatches}>
          <span className={css.swatchLabel}>Color</span>
          <div className={css.swatchRow} role="group" aria-label="Color de la materia">
            {SWATCHES.map((token) => (
              <button
                key={token}
                type="button"
                className={css.swatch}
                style={{ "--sw": `var(${token})` } as CSSProperties}
                aria-label={`Color ${token}`}
                aria-pressed={form.color === token}
                onClick={() => set({ color: token })}
              />
            ))}
          </div>
        </div>

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
      </form>
    </Dialog>
  );
}
