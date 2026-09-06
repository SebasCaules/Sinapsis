# 03 · El material de estudio — `StudyContent`

Los mazos de flashcards, los quizzes, el plan de estudio y los kits son **contenido de la
materia**, no de la plataforma (N0-27). Viven en el repositorio de la materia, se compilan
junto con el wiki y viajan en `SyncPayload.study`.

Todo es opcional. Sin carpeta, la plataforma autogenera un mazo por división a partir de los
`resumen` de las páginas.

---

## 1. La carpeta

```
<config>/                      ← la carpeta del sinapsis.config.json
  sinapsis.config.json
  estudio/                     ← wiki.study (default "estudio")
    flashcards-definiciones.md   tipo: flashcards  → un Deck
    quiz-general.md              tipo: quiz        → un Quiz
    plan.json                                      → un Plan
    kits.json                                      → Kit[]
    README.md                                      ← ignorado
    _borrador.md                                   ← ignorado (empieza con "_")
```

Reglas de descubrimiento (`compileStudy`):

1. `wiki.study` es **relativa al config, no al wiki** (N0-27). `sinapsis sync --wiki
   <otro-vault>` no la desvía: el material de estudio es del repositorio de la materia.
   No puede salir de la carpeta del config (error duro, ver `00-principios.md` §6.2).
2. Si la carpeta no existe, el resultado es un `StudyContent` vacío y **ninguna advertencia**.
3. Solo se miran archivos del primer nivel. Se descartan los que empiezan con `.` o con `_`,
   y los directorios.
4. De los `.md` se descarta `readme.md` (sin distinguir mayúsculas).
5. Un `.md` **sin `tipo` en el frontmatter se ignora en silencio**: son las notas del autor.
6. Un `.md` con un `tipo` que no se reconoce genera la advertencia
   `tipo "X" desconocido (se admiten "flashcards" y "quiz"); el archivo se ignora`.
7. `plan.json` y `kits.json` se leen solo si existen con ese nombre exacto.

| `tipo` del frontmatter | Compila a |
|---|---|
| `flashcards`, `mazo`, `cards`, `tarjetas` | Un `Deck` |
| `quiz`, `cuestionario` | Un `Quiz` |

**Nada de esto puede romper un sync.** Los problemas de formato y las referencias rotas son
advertencias; el material se emite igual y el autor decide si lo arregla. La única
excepción es la red final: si el `StudyContent` armado no valida contra el contrato pese a
todo, se avisa y se emite un `StudyContent` **vacío** antes que un payload inválido.

---

## 2. Mazos — `tipo: flashcards`

### 2.1 Formato

```markdown
---
tipo: flashcards
titulo: Definiciones clave
id: definiciones-clave        # opcional; si falta, el nombre del archivo normalizado
division: "3"                 # opcional; una clave de config.divisions
descripcion: Las que se toman siempre.   # opcional
---

## Definición de esperanza $E[X]$

> pagina: esperanza            # opcional: página del wiki relacionada
> tags: discreta, momentos     # opcional

$E[X]=\sum_x x\,p_X(x)$. Es el promedio ponderado por probabilidad.

## Fórmula práctica de la varianza {#varianza-practica}

$V(X)=E[X^2]-\big(E[X]\big)^2\ge 0$.
```

### 2.2 Frontmatter del mazo

| Clave (alias) | Va a | Obligatorio | Default | Límite | Descripción |
|---|---|---|---|---|---|
| `tipo` · `type` | — | **sí** | — | — | `flashcards`, `mazo`, `cards` o `tarjetas`. |
| `id` | `Deck.id` | no | el nombre del archivo sin `.md`, normalizado; si no queda nada, `mazo` | 160 | `StudyId`. Un id inválido se normaliza con advertencia. |
| `titulo` · `title` | `Deck.title` | sí en la práctica | el `id` | 120 | Sin él se avisa: `falta "titulo" en el frontmatter`. |
| `descripcion` · `description` | `Deck.description` | no | — | 600 | — |
| `division` · `división` · *(el campo de `wiki.divisionField`)* | `Deck.division` y la de cada tarjeta | no | — | 24 | Si no está en `config.divisions`, advertencia. |

`Deck.source` siempre vale `"authored"` en un mazo escrito a mano (los generados por la
plataforma llevan `"auto"`).

### 2.3 Cómo se cortan las tarjetas

- **Cada `##` abre una tarjeta.** El encabezado es el **anverso** y todo lo que sigue, hasta
  el próximo `##`, es el **reverso** (markdown y KaTeX, igual que una página).
- Los `###` **no** abren tarjeta: el reverso puede tener sus propios subtítulos.
- Los `##` dentro de un bloque de código (` ``` ` o `~~~`) o dentro de un `$$…$$` no cuentan.
- Lo que haya **antes** del primer `##` se descarta (sirve para un comentario del autor).
- Una tarjeta sin anverso o sin reverso se descarta con advertencia
  `la tarjeta N ("<anverso>") no tiene anverso|reverso`.
- Un mazo que queda sin tarjetas se descarta entero con
  `el mazo no tiene tarjetas (cada «## …» abre una)`.

### 2.4 Directivas del reverso

Al **principio** del reverso, antes de cualquier contenido, con o sin `>` delante (así se
leen como un callout en Obsidian). Las líneas en blanco y las líneas con solo `>` se saltan;
la primera línea que no sea una directiva cierra el bloque.

| Directiva | Va a | Qué hace |
|---|---|---|
| `pagina:` · `página:` · `page:` | `Card.page` | Página del wiki relacionada («ver en el wiki»). Se normaliza como un slug; si no queda un slug válido, se ignora con advertencia. |
| `tags:` | `Card.tags` | Lista separada por comas; cada etiqueta se recorta a 60. |

### 2.5 Ids de tarjeta — **lo más delicado del contrato**

El repaso espaciado del usuario (`SrsState`) se guarda **por id de tarjeta**. El id se
calcula así:

1. Si el encabezado termina con `{#mi-id}`, ese es el id (normalizado como `StudyId`).
2. Si no, es `<id del mazo>:<n>`, con `n` correlativo **entre las tarjetas válidas** del
   mazo, empezando en 1.

Consecuencia: **reordenar, insertar o borrar una tarjeta sin id explícito corre la numeración
y el usuario pierde el progreso de todas las tarjetas siguientes.** Para un mazo que ya se
está repasando, poner ids explícitos:

```markdown
## Definición de esperanza $E[X]$ {#esperanza-def}
```

Los ids repetidos generan la advertencia
`id de tarjeta "<id>" (el SRS del usuario se guarda por id) repetido`.

### 2.6 `Deck` y `Card` en el contrato

| `Deck` | Tipo | Obligatorio | Default | Límite |
|---|---|---|---|---|
| `id` | `StudyId` | sí | — | 1–160, `^[a-z0-9][a-z0-9._:-]*$` (sin distinguir mayúsculas) |
| `title` | texto | sí | — | 1–120 |
| `description` | texto | no | — | ≤ 600 |
| `division` | `DivisionKey` | no | — | 1–24 |
| `source` | `"authored"` \| `"auto"` | no | `"authored"` | — |
| `cards` | `Card[]` | sí | — | ≤ 2000 |

| `Card` | Tipo | Obligatorio | Default | Límite |
|---|---|---|---|---|
| `id` | `StudyId` | sí | — | 1–160 |
| `front` | markdown | sí | — | 1–4000 (se recorta con advertencia) |
| `back` | markdown | sí | — | 1–8000 (se recorta con advertencia) |
| `division` | `DivisionKey` | no | la del mazo | 1–24 |
| `page` | `Slug` | no | — | — |
| `tags` | texto[] | no | `[]` | 60 por elemento |

---

## 3. Quizzes — `tipo: quiz`

### 3.1 Formato

```markdown
---
tipo: quiz
titulo: Quiz conceptual
id: quiz-general
division: "3"                 # opcional
descripcion: Repaso rápido.   # opcional
---

## ¿Qué distribución tiene media igual a varianza?

> pagina: distribucion-poisson

Se sabe que el conteo es de eventos raros en un intervalo fijo.

- [ ] Binomial
- [x] Poisson
- [ ] Normal

> Poisson: $E[X]=V(X)=\lambda$.

## ¿Qué mide la potencia de una prueba?

- [ ] $\alpha$ {alt: alfa}
- [x] $1-\beta$ {alt: uno menos beta}
```

### 3.2 Cómo se corta una pregunta

- **Cada `##` abre una pregunta**, con las mismas reglas de corte que un mazo (`###` no,
  bloques de código y `$$` tampoco).
- Las directivas `pagina:` / `tags:` valen al principio, igual que en un mazo (en un quiz
  solo se usa `pagina:`; las etiquetas no viajan en `QuizQuestion`).
- **Enunciado** (`prompt`): el texto del encabezado más todo lo que haya **antes de la
  primera opción**, unidos por una línea en blanco.
- **Opciones**: una lista de tildes. El patrón es `- [ ] texto` / `- [x] texto` (también
  valen `*` y `+` como viñeta, hasta 3 espacios de sangría, y `[X]` en mayúscula).
- **Explicación** (`explanation`): los blockquotes (`> …`) que van **después** de la primera
  opción, unidos por saltos de línea. Un blockquote **antes** de la primera opción se suma al
  enunciado, no a la explicación.

### 3.3 `{alt: …}` — accesibilidad de las opciones matemáticas

Una opción que es solo matemática (`$\alpha$`) no deja nada que leer en voz alta. El texto
para el lector de pantalla va al final de la línea:

```markdown
- [x] $1-\beta$ {alt: uno menos beta}
```

Va a `QuizOption.alt` (≤ 300). Es opcional y solo hace falta ahí. **Si al quitar el `{alt:
…}` la opción quedara sin texto, la directiva se ignora** y `{alt: …}` se toma como el texto
de la opción: la opción vale más que su alternativa.

### 3.4 Validaciones

| Regla | Si no se cumple |
|---|---|
| La pregunta tiene enunciado | Advertencia `la pregunta N (…) no tiene enunciado`; se descarta. |
| Al menos **2** opciones | Advertencia `… tiene N opción(es); hacen falta al menos 2 (lista "- [ ] …" / "- [x] …")`; se descarta. |
| Como mucho **8** opciones | Advertencia `… tiene N opciones; se conservan las primeras 8`; se recorta. |
| Al menos **1** opción correcta | Advertencia `… no marca ninguna opción correcta con "- [x]"; la pregunta se descarta`. |
| El quiz queda con ≥ 1 pregunta | Advertencia `el quiz no tiene preguntas válidas (cada «## …» abre una)`; se descarta el quiz entero. |

### 3.5 `Quiz`, `QuizQuestion` y `QuizOption`

| Campo | Tipo | Obligatorio | Default | Límite |
|---|---|---|---|---|
| `Quiz.id` | `StudyId` | sí | nombre del archivo normalizado | 1–160 |
| `Quiz.title` | texto | sí | el `id` | 1–120 |
| `Quiz.description` | texto | no | — | ≤ 600 |
| `Quiz.division` | `DivisionKey` | no | — | 1–24 |
| `Quiz.questions` | `QuizQuestion[]` | sí | — | **1**–500 |
| `QuizQuestion.id` | `StudyId` | sí | `<id del quiz>:<n>` o `{#id}` | 1–160 |
| `QuizQuestion.prompt` | markdown | sí | — | 1–4000 |
| `QuizQuestion.options` | `QuizOption[]` | sí | — | 2–8 |
| `QuizQuestion.explanation` | markdown | no | — | ≤ 4000 |
| `QuizQuestion.division` | `DivisionKey` | no | la del quiz | 1–24 |
| `QuizQuestion.page` | `Slug` | no | — | — |
| `QuizOption.text` | texto | sí | — | 1–600 |
| `QuizOption.correct` | booleano | sí | — | — |
| `QuizOption.alt` | texto | no | — | ≤ 300 |

El esquema exige además que **cada pregunta tenga al menos una opción correcta**
(`quiz: cada pregunta necesita al menos una opción correcta`).

---

## 4. `plan.json` — el plan de estudio

JSON validado contra `Plan`. Los errores se informan con la ruta del campo:
`plan.json: phases.0.milestones.2.title: Required`.

```jsonc
{
  "title": "Plan de estudio · Probabilidad y Estadística",
  "phases": [
    {
      "id": "fase-1",
      "title": "Parcialito 1",
      "subtitle": "TP1 y TP2 · Unidades 1 y 2",
      "icon": "map",                    // opcional, del registro cerrado de iconos
      "date": "2026-10-01",             // opcional, AAAA-MM-DD exacto
      "scope": "Qué cae en este examen (markdown, hasta 4000 caracteres).",
      "milestones": [
        {
          "id": "fase-1-h1",
          "title": "Unidad 1 · Estadística Descriptiva",
          "icon": "book",               // opcional
          "divisions": ["1"],           // claves de config.divisions
          "tasks": [
            { "id": "fase-1-h1-t1", "label": "Leer la teoría de la Unidad 1",
              "kind": "read", "target": "1" },
            { "id": "fase-1-h1-t2", "label": "Repasar «Definiciones clave»",
              "kind": "cards", "target": "definiciones-clave" },
            { "id": "fase-1-h1-t3", "label": "Resolver el TP1",
              "kind": "exercises", "detail": "7 ejercicios · 4–5 h" }
          ]
        }
      ]
    }
  ],
  "tracks": []                          // opcional; ver §5
}
```

### 4.1 Esquema

| Campo | Tipo | Obligatorio | Default | Límite |
|---|---|---|---|---|
| `Plan.title` | texto | no | `"Plan de estudio"` | ≤ 160 |
| `Plan.phases` | `PlanPhase[]` | **sí** | — | **1**–20 |
| `Plan.tracks` | `PlanTrack[]` | no | `[]` | ≤ 6 |
| `PlanPhase.id` | `StudyId` | sí | — | 1–160 |
| `PlanPhase.title` | texto | sí | — | 1–160 |
| `PlanPhase.subtitle` | texto | no | — | ≤ 300 |
| `PlanPhase.icon` | `IconName` | no | — | registro cerrado |
| `PlanPhase.date` | texto | no | — | exactamente `^\d{4}-\d{2}-\d{2}$` |
| `PlanPhase.scope` | markdown | no | — | ≤ 4000 |
| `PlanPhase.milestones` | `PlanMilestone[]` | sí | — | ≤ 40 |
| `PlanMilestone.id` | `StudyId` | sí | — | 1–160 |
| `PlanMilestone.title` | texto | sí | — | 1–160 |
| `PlanMilestone.icon` | `IconName` | no | — | registro cerrado |
| `PlanMilestone.divisions` | `DivisionKey[]` | no | `[]` | — |
| `PlanMilestone.tasks` | `PlanTask[]` | sí | — | ≤ 40 |
| `PlanTask.id` | `StudyId` | sí | — | 1–160 |
| `PlanTask.label` | texto | sí | — | 1–200 |
| `PlanTask.kind` | enum | no | `"custom"` | ver §4.2 |
| `PlanTask.target` | texto | no | — | ≤ 400 |
| `PlanTask.detail` | texto | no | — | ≤ 300 |

`detail` es una línea corta aparte del `label` («41 ejercicios · 14–16 h»): la plataforma la
muestra separada, no dentro del nombre de la tarea.

### 4.2 `kind` de una tarea y qué es su `target`

| `kind` | `target` | Qué abre | Se verifica contra |
|---|---|---|---|
| `read` | clave de división | Esa división en el índice. | `config.divisions` |
| `cards` | id de mazo (o sin `target`) | Ese mazo (o el repaso del día). | los ids de `decks` |
| `quiz` | id de quiz | Ese quiz. | los ids de `quizzes` |
| `tool` | **id de un ítem del `rail`** del config | Esa herramienta de la materia. | los `rail[].items[].id` |
| `exercises` | slug de página o URL (opcional) | Práctica: un TP, una guía. | — |
| `custom` | slug de página o URL (opcional) | Cualquier otra cosa. | — |

> Ojo con `tool`: acá el `target` es el **id del ítem del rail**, no el id de la vista del
> bundle. Es al revés que en `RailItem.target` (ver `01-materia.md` §5.4).

### 4.3 Ids de tarea — estado del usuario

`StudyState.tasksDone` guarda las tareas hechas **por id, global a la materia**. Cambiar el
id de una tarea la deja sin marcar; repetir un id hace que dos tareas distintas se marquen
juntas. El compilador avisa:

```
id de tarea "<id>" (los ids son globales al plan y el progreso del usuario se guarda por id) repetido
```

---

## 5. `tracks` — modalidades del plan (N0-43)

Una materia puede tener más de una forma de cursarse: «Cursada + final» y «Final directo»,
por ejemplo. Cada modalidad trae sus propias fases.

```jsonc
{
  "title": "Plan de estudio",
  // `phases` es lo que se muestra mientras el usuario no elija modalidad:
  // tiene que REPETIR las fases de la modalidad por defecto.
  "phases": [ /* … las mismas fases que tracks[0].phases … */ ],
  "tracks": [
    { "id": "cursada", "label": "Cursada + final",
      "description": "Parcialitos, TPs y final.",
      "phases": [ /* … */ ] },
    { "id": "final-directo", "label": "Final directo",
      "phases": [ /* … */ ] }
  ]
}
```

| Campo | Tipo | Obligatorio | Default | Límite |
|---|---|---|---|---|
| `PlanTrack.id` | `StudyId` | sí | — | 1–160 |
| `PlanTrack.label` | texto | sí | — | 1–80 |
| `PlanTrack.description` | texto | no | — | ≤ 300 |
| `PlanTrack.phases` | `PlanPhase[]` | sí | — | **1**–20 |

### La semántica, que es lo importante

**Una fase que aparece en dos modalidades es la MISMA fase.** No es una copia: es la misma,
identificada por su `id`. De ahí salen tres consecuencias:

1. `planPhases(plan)` recorre `phases` y después las de cada `track`, **deduplicando por
   `id`**: una fase compartida se cuenta una sola vez. Es lo que permite que `phases`
   duplique la modalidad por defecto sin que el plan quede inválido.
2. El progreso del usuario vale en las dos modalidades: los ids de tarea son los mismos.
3. Los ids de tarea son **globales al plan**, no por modalidad: se comprueban a través de
   todas las modalidades a la vez.

### Qué verifica `checkPlanIds`

| Regla | Advertencia si no se cumple |
|---|---|
| Ids de modalidad únicos | `id de modalidad "<id>" repetido` |
| Ids de fase únicos dentro de `phases` | `id de fase "<id>" en "phases" repetido` |
| Ids de fase únicos dentro de cada modalidad | `id de fase "<id>" en la modalidad "<track>" repetido` |
| Ids de hito únicos entre todas las fases distintas | `id de hito "<id>" repetido` |
| Ids de tarea únicos entre **todas** las modalidades | `id de tarea "<id>" (los ids son globales al plan…) repetido` |
| Una fase con el mismo `id` en dos modalidades tiene **contenido idéntico** | `la fase "<id>" aparece en dos modalidades con contenido distinto: use ids distintos o repita la misma fase` |
| `phases` coincide con alguna modalidad de `tracks` | `"phases" no coincide con ninguna modalidad de "tracks": es lo que se muestra mientras el usuario no elija una, así que debería repetir las fases de la modalidad por defecto ("a", "b")` |

La comparación de «misma fase» es literal: se serializa la fase entera y se compara el
texto. Dos fases con el mismo id que difieren en un espacio ya son distintas.

---

## 6. `kits.json` — paquetes de material

Un array de `Kit`, validado contra `Kit[]`.

```jsonc
[
  {
    "id": "parcialito-1",
    "title": "Parcialito 1 · TP1–TP2",
    "description": "Unidades 1 y 2: descriptiva, conteo, condicional y Bayes.",
    "divisions": ["1", "2"],                   // claves de config.divisions
    "pages": ["estadistica-descriptiva", "probabilidad-total-y-bayes"],
    "decks": ["definiciones-clave"],           // ids de mazos
    "quizzes": ["quiz-general"],               // ids de quizzes
    "tools": ["calc", "formularios"]           // ids de ÍTEMS DEL RAIL del config
  }
]
```

| Campo | Tipo | Obligatorio | Default | Límite |
|---|---|---|---|---|
| `id` | `StudyId` | sí | — | 1–160 |
| `title` | texto | sí | — | 1–120 |
| `description` | texto | no | — | ≤ 600 |
| `divisions` | `DivisionKey[]` | no | `[]` | — |
| `pages` | `Slug[]` | no | `[]` | — |
| `decks` | `StudyId[]` | no | `[]` | — |
| `quizzes` | `StudyId[]` | no | `[]` | — |
| `tools` | texto[] | no | `[]` | 48 por elemento |

`tools` son **ids de ítems del rail** del config, igual que en una tarea `kind: "tool"`.

---

## 7. Mazos automáticos (`autoDecks`)

La plataforma **siempre** agrega, al final de `decks`, un mazo por división efectiva armado
con las páginas de contenido que tienen `resumen`:

- Id del mazo: `auto-<clave de división>`.
- Título: `Resúmenes · <rótulo largo de la división>`.
- `source: "auto"`.
- Una tarjeta por página: id `auto:<slug>`, anverso = `title`, reverso = `summary`,
  `page` = el slug de la página.
- Se saltan las páginas cuyo tipo tiene `countsAsContent: false` y las que no tienen
  `resumen`. Una división sin tarjetas no genera mazo.

**No se guardan**: se calculan en cada lectura de `GET /api/subjects/:slug/study`, a partir de
las páginas vigentes. Así siguen a los resúmenes del wiki sin depender de una
re-sincronización. Sus ids son estables mientras no cambie el slug de la página.

---

## 8. Cómo viaja el material

`SyncPayload.study` lleva el `StudyContent` compilado. Sus límites:

| Campo | Límite |
|---|---|
| `decks` | ≤ 200 |
| `quizzes` | ≤ 200 |
| `plan` | un `Plan` o `null` |
| `kits` | ≤ 100 |

**El campo viaja siempre, aunque esté vacío.** Es lo que hace que el sync reemplace el
material igual que reemplaza las páginas: borrar la carpeta `estudio/` lo borra de la
plataforma. La **ausencia** del campo queda reservada para un CLI anterior al Sprint 2, y el
API la interpreta como «deje lo que ya tenía».

---

## 9. Repaso espaciado — `sm2` (N0-28)

SM-2 con **cuatro notas**, implementado como función pura en el contrato: lo usan el API
para persistir y la web para previsualizar («en 3 d»).

| Nota | Significado | Qué hace |
|---|---|---|
| `1` | Otra vez | `reps = 0`, `lapses += 1`, `interval = 0`, `ease = max(1.3, ease − 0.2)`. Vuelve **en 10 minutos**. |
| `2` | Difícil | `q = 3`. Intervalo con factor `0.8`. |
| `3` | Bien | `q = 4`. Intervalo sin factor. |
| `4` | Fácil | `q = 5`. Intervalo con factor `1.3`. |

Para las notas 2–4:

```
ease  = max(1.3, ease + (0.1 − (5 − q) · (0.08 + (5 − q) · 0.02)))
reps == 0  →  interval = 1
reps == 1  →  interval = (nota 4 ? 4 : 3)
reps >= 2  →  interval = round(interval · ease · factor)
             (con nota 2 y reps > 1, nunca menor que 1)
reps += 1
```

`due = ahora + (interval == 0 ? 10 minutos : interval días)`.

Estado inicial (`SRS_DEFAULT`): `ease 2.5`, `interval 0`, `reps 0`, `lapses 0`,
`lastGrade null`.

| `SrsState` | Tipo | Límite |
|---|---|---|
| `cardId` | `StudyId` | 1–160 |
| `ease` | número | 1.3–5 |
| `interval` | número (días) | ≥ 0 |
| `due` | ISO | — |
| `reps` | entero | ≥ 0 |
| `lapses` | entero | ≥ 0 |
| `lastGrade` | 1–4 o `null` | — |
| `updatedAt` | ISO | — |

---

## 10. `StudyState` — el estado del usuario

Lo devuelve `GET /api/subjects/:slug/study/state`. Es **por usuario y por materia**.

| Campo | Tipo | Qué es |
|---|---|---|
| `srs` | `SrsState[]` | Repaso espaciado, ordenado por `due` y después por `cardId`. **Solo tarjetas que existen hoy** (autorales + automáticas): las filas de tarjetas borradas se conservan en la base pero no viajan, para que la web no dibuje un «vence hoy» de algo que no puede abrir. |
| `bookmarks` | `Slug[]` | Favoritos, por orden de alta. |
| `notes` | `Note[]` | Apuntes por página: `{ page, body (≤ 50000), updatedAt }`. |
| `tasksDone` | `StudyId[]` | Tareas del plan hechas, por id. |
| `attempts` | `QuizAttempt[]` | `{ quizId, score, total, at }`, los **50** más recientes. |

Nada de lo que se guarda depende de que la tarjeta, la tarea o el quiz existan en el
material: los mazos automáticos se calculan al vuelo y el material autoral vive dentro de un
JSON. Lo único que se valida contra la base son los slugs de página (favoritos y apuntes),
que sí son filas de `pages`.

---

## 11. Qué se verifica y cuándo

Todas son **advertencias**, nunca errores.

### Verificaciones cruzadas (`crossCheck`)

| Advertencia | Causa |
|---|---|
| `estudio · mazos: id de mazo "<id>" repetido` | Dos mazos con el mismo id. |
| `estudio · quizzes: id de quiz "<id>" repetido` | Ídem quizzes. |
| `estudio · mazos: id de tarjeta "<id>" (el SRS del usuario se guarda por id) repetido` | Dos tarjetas con el mismo id. |
| `estudio · quizzes: id de pregunta "<id>" repetido` | Ídem preguntas. |
| `estudio · kits.json: id de kit "<id>" repetido` | Ídem kits. |
| `estudio · referencia rota en mazo "<id>": la página "<slug>" no existe en el wiki` | `pagina:` de una tarjeta. |
| `estudio · referencia rota en quiz "<id>": la página "<slug>" no existe en el wiki` | `pagina:` de una pregunta. |
| `estudio · referencia rota en plan.json · <fase>/<hito>: la división "<key>" no está en config.divisions` | `milestones[].divisions`. |
| `estudio · referencia rota en plan.json · <fase>/<hito>/<tarea>: «read» apunta a "<x>", que no es una división del config` | Tarea `read`. |
| `… «cards» apunta al mazo "<x>", que no existe` | Tarea `cards`. |
| `… «quiz» apunta al quiz "<x>", que no existe` | Tarea `quiz`. |
| `… «tool» apunta a "<x>", que no es un id de ítem del rail del config` | Tarea `tool`. |
| `estudio · referencia rota en kits.json · <kit>: …` | División, página, mazo, quiz o herramienta inexistente en un kit. |
| `estudio · <archivo>: la división "<key>" no está en config.divisions` | `division` de un mazo o quiz. |

### Dónde corre cada cosa

| Comando | Formato de los archivos | Ids repetidos | Referencias a divisiones, mazos, quizzes, rail | Referencias a **páginas** |
|---|---|---|---|---|
| `sinapsis validate` | sí | sí | sí | **no** (no compila el wiki) |
| `sinapsis sync --dry-run` | sí | sí | sí | sí |
| `sinapsis sync` | sí | sí | sí | sí |
| API (al recibir el payload) | — | — | parcial (`read`/`cards`/`quiz` de la modalidad por defecto) | sí |

`validate` lo aclara en su salida:
`(las referencias a páginas se verifican en \`sinapsis sync --dry-run\`)`.

> El API repite un subconjunto de las verificaciones sobre `SyncPayload.study`, pero recorre
> **solo `plan.phases`**, no `plan.tracks`: una tarea rota que exista únicamente en una
> modalidad alternativa la ve el compilador (`checkPlanIds` / `crossCheck` usan `planPhases`)
> y no el API.

---

## 12. Errores típicos

| Síntoma | Causa | Arreglo |
|---|---|---|
| El mazo no aparece | El `.md` no tiene `tipo` en el frontmatter. | Agregar `tipo: flashcards`. |
| `tipo "flashcard" desconocido` | Singular. | `flashcards` (o `mazo`, `cards`, `tarjetas`). |
| El mazo aparece vacío | Se usaron `###` en vez de `##`, o todo el contenido está antes del primer `##`. | Cada tarjeta abre con `##`. |
| Una tarjeta se comió la siguiente | El `##` de la segunda quedó dentro de un bloque `$$…$$` sin cerrar. | Cerrar el bloque. |
| El usuario perdió su progreso de repaso | Se reordenó o insertó una tarjeta y corrió la numeración de los ids. | Fijar los ids con `{#id}` **antes** de reordenar. |
| Una pregunta desaparece | Tiene menos de 2 opciones, o ninguna `- [x]`. | Completar la lista y marcar la correcta. |
| La explicación se metió en el enunciado | El blockquote está **antes** de la lista de opciones. | Moverlo debajo de las opciones. |
| `plan.json: phases.0.date: Invalid` | La fecha no es `AAAA-MM-DD` exacto. | `2026-10-01`, no `01/10/2026`. |
| `"phases" no coincide con ninguna modalidad de "tracks"` | Se agregaron `tracks` sin repetir en `phases` las fases de la modalidad por defecto. | Copiar en `phases` las fases de `tracks[0]`. |
| `la fase "x" aparece en dos modalidades con contenido distinto` | Se reusó un id de fase para dos fases parecidas. | Ids distintos, o repetir la fase idéntica. |
| Una tarea `tool` no abre nada | El `target` es el id de la **vista** del bundle en vez del id del **ítem del rail**. | Usar el `rail[].items[].id`. |
| El material desapareció de la plataforma | Se borró (o se movió) la carpeta `estudio/`: el sync la reemplaza por vacío. | Restaurarla y volver a sincronizar. |
| «Estudio: sin material propio» | La carpeta no existe, está vacía o todos sus `.md` quedaron sin `tipo`. | Es válido: la plataforma autogenera un mazo por división. |

---

## Fuente ejecutable

- `packages/markdown/src/study.ts` — `compileStudy`, `parseDeck`, `parseQuiz`,
  `splitSections`, `takeDirectives`, `crossCheck`, `checkPlanIds`, `planPhases`,
  `studyCounts`, `isEmptyStudy`, `emptyStudy`.
- `packages/contract/src/index.ts` — `StudyContent`, `Deck`, `Card`, `Quiz`, `QuizQuestion`,
  `QuizOption`, `Plan`, `PlanTrack`, `PlanPhase`, `PlanMilestone`, `PlanTask`, `PlanTaskKind`,
  `Kit`, `StudyId`, `autoDecks`, `sm2`, `SrsState`, `SRS_DEFAULT`, `SrsGrade`, `StudyState`,
  `Note`, `QuizAttempt`.
- `apps/api/src/services/study.ts` — `readStudyContent` (autoral + automático),
  `studyCardIds`, `readStudyState`, `ATTEMPTS_LIMIT`.
- `apps/api/src/services/sync.ts` — `studyWarnings` (lo que revalida el API).
- `apps/api/src/routes/study.ts` — las rutas del estado del usuario.
- `examples/proba/estudio/` — 6 mazos, 1 quiz, `plan.json` con modalidades, `kits.json`.

## Decisiones relacionadas

N0-27 (el material de estudio es contenido de la materia; mazos automáticos) ·
N0-28 (SM-2 con cuatro notas) · N0-33 (nombres «Flashcards», «Quiz», «Kits de estudio») ·
N0-37 (el plan sin modalidades hasta S-11) · N0-43 (`Plan.tracks`).
