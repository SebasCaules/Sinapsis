# Material de estudio

Todo lo de esta carpeta es **opcional** y viaja a la plataforma en cada `sinapsis sync`.
La carpeta se declara en `wiki.study` del config y es **relativa al config**, no al wiki.

| Archivo | Qué es |
|---|---|
| `flashcards-*.md` | Un mazo de tarjetas (`tipo: flashcards`). |
| `quiz-*.md` | Un cuestionario de opción múltiple (`tipo: quiz`). |
| `plan.json` | El plan de estudio: fases → hitos → tareas. |
| `kits.json` | Kits: paquetes de páginas, mazos, quizzes y herramientas del rail. |

## Mazos (`tipo: flashcards`)

Cada `## …` abre una tarjeta: el encabezado es el **anverso** y lo que sigue, hasta el
próximo `##`, el **reverso** (markdown y KaTeX, igual que el wiki).

```markdown
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

$E[X]=\sum_x x\,p_X(x)$.
```

El id de cada tarjeta es `<id del mazo>:<n>`; para fijarlo (y no perder el progreso del
SRS al reordenar) se escribe al final del encabezado: `## Anverso {#mi-id}`.

## Quizzes (`tipo: quiz`)

Cada `## …` abre una pregunta. Las opciones son una lista de tildes —`- [x]` la
correcta— y el blockquote que sigue a la lista es la explicación.

```markdown
---
tipo: quiz
titulo: Quiz de la unidad 1
---

## ¿Qué distribución tiene media = varianza?

> pagina: distribucion-poisson

- [ ] Binomial
- [x] Poisson
- [ ] Normal

> Poisson: $E[X]=V(X)=\lambda$.
```

Hacen falta al menos 2 opciones y al menos una correcta; si no, la pregunta se descarta
con una advertencia.

## Plan y kits

`plan.json` y `kits.json` los valida el contrato (`Plan` y `Kit[]`). Las tareas del plan
tienen `kind`: `read` (destino: una división), `cards` (un mazo), `quiz` (un quiz),
`exercises` y `custom` (una página o una URL).

## Verificar

```bash
sinapsis validate                 # formato de los archivos
sinapsis sync --dry-run           # + referencias a páginas, mazos y quizzes
```
