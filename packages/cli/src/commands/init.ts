/** `sinapsis init` — propone un `sinapsis.config.json` a partir del wiki. */
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import pc from "picocolors";
import { SubjectConfig } from "@sinapsis/contract";
import { inspectWiki, isDirectory, pendingFields, scaffoldConfig, TODO } from "@sinapsis/markdown";
import { resolveUserPath, type Ctx } from "../context.js";

export interface InitOptions {
  wiki?: string;
  out?: string;
  slug?: string;
  force?: boolean;
}

export async function runInit(opts: InitOptions, ctx: Ctx): Promise<number> {
  const wikiDir = resolveUserPath(ctx, opts.wiki ?? "wiki");
  if (!(await isDirectory(wikiDir))) {
    ctx.err(pc.red(`No encuentro la carpeta del wiki: ${wikiDir}`));
    ctx.err(pc.dim("Indique otra con --wiki <dir>."));
    return 1;
  }

  const outFile = resolveUserPath(ctx, opts.out ?? "sinapsis.config.json");
  if (existsSync(outFile) && !opts.force) {
    ctx.err(pc.red(`Ya existe ${outFile}.`));
    ctx.err(pc.dim("Use --force para sobreescribirlo o --out <file> para escribir en otro lado."));
    return 1;
  }

  const survey = await inspectWiki(wikiDir);
  if (survey.pages === 0) {
    ctx.err(pc.red(`No hay páginas .md en las carpetas de ${wikiDir}.`));
    ctx.err(pc.dim("El compilador solo recorre el primer nivel de cada carpeta del wiki."));
    return 1;
  }

  const draft = await scaffoldConfig({
    wikiDir,
    ...(opts.slug ? { slug: opts.slug } : {}),
    configDir: path.dirname(outFile),
    survey,
  });

  const parsed = SubjectConfig.safeParse(draft);
  if (!parsed.success) {
    ctx.err(pc.red("El config inferido no valida contra el contrato:"));
    for (const issue of parsed.error.issues) {
      ctx.err(`  ${pc.bold(issue.path.join(".") || "(raíz)")}: ${issue.message}`);
    }
    return 1;
  }

  await writeFile(outFile, `${JSON.stringify(draft, null, 2)}\n`, "utf8");
  const study = await scaffoldStudy(path.dirname(outFile), parsed.data.wiki.study);

  // ---- informe -------------------------------------------------------------
  ctx.out(pc.green(`Config escrito en ${outFile}`));
  ctx.out("");
  ctx.out(`  wiki: ${pc.dim(wikiDir)}`);
  ctx.out(`  páginas: ${survey.pages} en ${survey.folders.length} carpeta(s)`);
  ctx.out(pc.bold("  tipos de página inferidos (de las carpetas)"));
  for (const type of draft.pageTypes) {
    const folder = type.folder ?? "—";
    const count = survey.folders.find((f) => f.folder === folder)?.pages ?? 0;
    ctx.out(`    ${type.key.padEnd(16)} ${String(count).padStart(4)}  ${pc.dim(`${folder}/`)}`);
  }
  ctx.out(
    pc.bold(
      `  campo de división: ${pc.reset(pc.cyan(survey.divisionField))} ${pc.dim(
        `(${survey.divisionFieldHits} de ${survey.pages} páginas lo declaran)`,
      )}`,
    ),
  );
  for (const division of survey.divisions) {
    const def = draft.divisions.find((d) => d.key === division.key);
    ctx.out(`    ${division.key.padEnd(8)} ${String(division.count).padStart(4)}  ${pc.dim(def?.name ?? "")}`);
  }
  if (survey.withoutSummary > 0) {
    ctx.out(pc.yellow(`  ${survey.withoutSummary} página(s) sin "resumen" (afecta tooltips y tarjetas)`));
  }
  ctx.out(
    `  material de estudio: ${pc.dim(relative(ctx, study.dir))} ${
      study.created.length > 0 ? pc.dim(`(${study.created.join(", ")})`) : pc.dim("(ya existía; no se tocó)")
    }`,
  );

  ctx.out("");
  ctx.out(pc.bold("Qué falta completar a mano:"));
  const pending = pendingFields(draft);
  if (pending.length > 0) {
    ctx.out(`  · ${pending.join(", ")} — hoy dicen "${TODO}".`);
  }
  ctx.out(`  · divisions[].name — reemplazá los nombres provisorios por los del programa.`);
  ctx.out(`  · division — nomenclatura (${draft.division.singular}/${draft.division.abbr}/${draft.division.plural}).`);
  ctx.out(`  · rail — grupos slot con las herramientas de la materia (queda vacío).`);
  ctx.out(`  · color — opcional: token --u1…--u9 o hex #rrggbb.`);
  ctx.out(
    `  · ${relative(ctx, study.dir)}/ — mazos, quiz, plan.json y kits.json (opcional; ver su README.md).`,
  );
  ctx.out("");
  ctx.out(pc.dim(`Después: sinapsis validate --config ${relative(ctx, outFile)}`));
  ctx.out(pc.dim(`Y luego: sinapsis sync --config ${relative(ctx, outFile)} --dry-run`));
  return 0;
}

function relative(ctx: Ctx, target: string): string {
  const rel = path.relative(ctx.cwd, target);
  return rel === "" || rel.startsWith("..") ? target : rel;
}

/**
 * Deja la carpeta del material de estudio con lo mínimo para empezar: el README
 * del formato y un mazo de ejemplo. No pisa nada de lo que ya exista.
 */
async function scaffoldStudy(configDir: string, folder: string): Promise<{ dir: string; created: string[] }> {
  const dir = path.resolve(configDir, folder);
  await mkdir(dir, { recursive: true });

  const created: string[] = [];
  for (const [name, text] of Object.entries(STUDY_TEMPLATES)) {
    const file = path.join(dir, name);
    if (existsSync(file)) continue;
    await writeFile(file, text, "utf8");
    created.push(name);
  }
  return { dir, created };
}

const STUDY_TEMPLATES: Record<string, string> = {
  "README.md": `# Material de estudio

Todo lo de esta carpeta es **opcional** y viaja a la plataforma en cada \`sinapsis sync\`.
La carpeta se declara en \`wiki.study\` del config y es **relativa al config**, no al wiki.

| Archivo | Qué es |
|---|---|
| \`flashcards-*.md\` | Un mazo de tarjetas (\`tipo: flashcards\`). |
| \`quiz-*.md\` | Un cuestionario de opción múltiple (\`tipo: quiz\`). |
| \`plan.json\` | El plan de estudio: fases → hitos → tareas. |
| \`kits.json\` | Kits: paquetes de páginas, mazos, quizzes y herramientas del rail. |

## Mazos (\`tipo: flashcards\`)

Cada \`## …\` abre una tarjeta: el encabezado es el **anverso** y lo que sigue, hasta el
próximo \`##\`, el **reverso** (markdown y KaTeX, igual que el wiki).

\`\`\`markdown
---
tipo: flashcards
titulo: Definiciones clave
id: definiciones-clave      # opcional; si falta, el nombre del archivo
division: "1"               # opcional; una división del config
descripcion: Las que se toman siempre.   # opcional
---

## Definición de esperanza $E[X]$

> pagina: esperanza          # opcional: página del wiki relacionada
> tags: discreta, momentos   # opcional

$E[X]=\\sum_x x\\,p_X(x)$.
\`\`\`

El id de cada tarjeta es \`<id del mazo>:<n>\`; para fijarlo (y no perder el progreso del
SRS al reordenar) se escribe al final del encabezado: \`## Anverso {#mi-id}\`.

## Quizzes (\`tipo: quiz\`)

Cada \`## …\` abre una pregunta. Las opciones son una lista de tildes —\`- [x]\` la
correcta— y el blockquote que sigue a la lista es la explicación.

\`\`\`markdown
---
tipo: quiz
titulo: Quiz de la unidad 1
---

## ¿Qué distribución tiene media = varianza?

> pagina: distribucion-poisson

- [ ] Binomial
- [x] Poisson
- [ ] Normal

> Poisson: $E[X]=V(X)=\\lambda$.
\`\`\`

Hacen falta al menos 2 opciones y al menos una correcta; si no, la pregunta se descarta
con una advertencia.

## Plan y kits

\`plan.json\` y \`kits.json\` los valida el contrato (\`Plan\` y \`Kit[]\`). Las tareas del plan
tienen \`kind\`: \`read\` (destino: una división), \`cards\` (un mazo), \`quiz\` (un quiz),
\`exercises\` y \`custom\` (una página o una URL).

## Verificar

\`\`\`bash
sinapsis validate                 # formato de los archivos
sinapsis sync --dry-run           # + referencias a páginas, mazos y quizzes
\`\`\`
`,

  "flashcards-ejemplo.md": `---
tipo: flashcards
titulo: Mazo de ejemplo
id: ejemplo
# division: "1"                 # descomentar para atarlo a una división del config
descripcion: Borre este archivo cuando tenga mazos de verdad.
---

<!-- Cada "## …" abre una tarjeta: el encabezado es el anverso; lo que sigue, el reverso. -->

## ¿Qué es una flashcard?

> pagina: indice

Una pregunta corta y su respuesta. La plataforma la programa con SM-2: cada repaso se
califica *otra vez · difícil · bien · fácil* y de ahí sale la próxima fecha.

## ¿Cómo se fija el id de una tarjeta? {#ids}

Con \`{#un-id}\` al final del encabezado, como en esta misma tarjeta. Sin eso, el id es
\`<id del mazo>:<n>\` y cambia si se reordenan las tarjetas (se pierde su progreso).
`,
};
