# 02 · Las páginas — del wiki markdown a `Page`

Una página de wiki es un archivo `.md` con frontmatter YAML. El compilador
(`@sinapsis/markdown`, N0-13) lo convierte en un objeto `Page` del contrato, que es lo único
que la plataforma guarda y sirve. El cuerpo viaja **crudo** (markdown): la plataforma lo
renderiza en el navegador (N0-10), no el servidor.

Este documento describe qué reconoce el compilador y qué renderiza el lector.

---

## 1. Dónde busca el compilador

```
<wiki.root>/                 (por defecto  wiki/ , relativa al config)
  conceptos/                 ← carpeta de primer nivel → páginas
    esperanza.md
    varianza.md
  distribuciones/
    distribucion-normal.md
    subcarpeta/              ← IGNORADA, con advertencia
  index.md                   ← solo si wiki.index lo declara
  log.md                     ← solo si wiki.log lo declara
```

Reglas, exactamente como las aplica `compileWiki`:

1. Se recorre **solo el primer nivel** de cada carpeta de `wiki.root`. Un `.md` en una
   subcarpeta no se compila: advertencia `subcarpeta ignorada "<carpeta>/<sub>"`.
2. Se descartan las carpetas que empiezan con `.` y las nombradas en `wiki.ignore`.
3. Una carpeta sin ningún `.md` directo no se considera carpeta del wiki.
4. Los archivos sueltos en la **raíz** de `wiki.root` no se compilan, salvo los que declaren
   `wiki.index` y `wiki.log`.
5. Orden de recorrido: primero las carpetas declaradas en `pageTypes[].folder`, en el orden
   del config; después el resto, alfabéticamente. Dentro de cada carpeta, los archivos
   alfabéticamente.
6. Si dos archivos producen el mismo slug, **gana el primero** y el segundo se descarta con
   la advertencia `slug duplicado "<slug>": <origen> choca con <origen previo>; se conserva
   la primera`.

### Páginas meta

`wiki.index` y `wiki.log` se compilan aparte, con valores forzados:

| Config | Slug publicado | `type` | `division` | `folder` |
|---|---|---|---|---|
| `wiki.index` | `indice` (`META_PAGES.index`) | `meta` (`PAGE_TYPE_META`) | `meta` (`DIVISION_NONE`) | `meta` |
| `wiki.log` | `log` (`META_PAGES.log`) | `meta` | `meta` | `meta` |

`meta` está reservado: no se declara en `pageTypes` (el esquema lo prohíbe) y no genera la
advertencia `tipo desconocido` ni `missing-summary`. Si el archivo declarado no existe, la
página simplemente no se emite (sin error). El rail fijo `wikimeta` abre esos dos slugs.

---

## 2. El slug

El slug de una página es **el nombre del archivo sin `.md`**, y tiene que cumplir `Slug`
(`^[a-z0-9][a-z0-9-]*$`, 1–120). Si no lo cumple, el compilador lo normaliza y avisa:

```
slug normalizado: "Distribución Normal" → "distribucion-normal"
```

`normalizeSlug` pliega acentos y mayúsculas (`fold`), reemplaza todo lo que no sea `[a-z0-9]`
por guiones, recorta los guiones de los extremos y trunca a 120. Si no queda nada utilizable,
el slug pasa a ser `pagina`.

**Renombrar un archivo equivale a borrar una página y crear otra**: al publicar desaparece el
slug viejo (con su lugar en el grafo) y aparece el nuevo. Las páginas estudiadas, los
favoritos y los apuntes se guardan por slug en el navegador y quedan huérfanos hasta que el
slug vuelva.

---

## 3. Frontmatter reconocido

Bloque YAML entre `---` al principio del archivo. Se parsea con el paquete `yaml`; si el
bloque no es un mapa válido, se cae a un parser manual línea a línea (`clave: valor`,
listas `[a, b]`, comillas simples o dobles) por paridad con el `build.py` del baseline.

| Clave (y sus alias) | Va a | Tipo | Obligatorio | Default | Límite | Descripción |
|---|---|---|---|---|---|---|
| `titulo` · `title` | `title` | texto | no | primer `# H1` del cuerpo; si no hay, el slug capitalizado con los guiones como espacios | 200 | Título de la página. |
| `tipo` · `type` | `type` | texto | no | el tipo de la carpeta (`pageTypes[].folder`); si no, el nombre de la carpeta; si no, `pagina` | 32 | Clave de `pageTypes`. |
| *(el campo de `wiki.divisionField`; por defecto `division`, en Proba `unidad`)* | `division` | `DivisionKey` | no | `meta` (transversal) | 24 | División del temario. Vacío o ausente = transversal. |
| `orden` · `order` | `order` | entero > 0 | no | — | — | Orden pedagógico dentro de la división. |
| `resumen` · `summary` | `summary` | texto | no (pero se avisa si falta) | `""` | 1200 | Una o dos frases. Alimenta tooltips, tarjetas y los mazos automáticos. |
| `formato` · `format` | `format` | texto libre | no | — | 40 | `apunte`, `pdf`, `guia`, `video`, `slides`… |
| `hub` | `hub` | booleano | no | ausente | — | Marca la página como **portada de su división**. Ver «El hub de una división», abajo. |
| `tags` | `tags` | lista de texto | no | `[]` | 60 por elemento | Etiquetas. Un escalar se parte por comas. |
| `fuentes` · `sources` | `sources` | lista de texto | no | `[]` | 120 por elemento | Fuentes citadas. Un `[[wikilink]]` se reduce a su destino sin ancla. |
| `actualizado` · `updatedAt` · `updated` | `updatedAt` | texto | no | — | 40 | Fecha declarada por el autor. Es texto libre: una fecha YAML se serializa como `AAAA-MM-DD`. |

Cualquier otra clave del frontmatter **se ignora en silencio**: no viaja en `Page`.

```yaml
---
titulo: Distribución Normal
tipo: distribucion            # clave de config.pageTypes
unidad: 4                     # el campo que declare wiki.divisionField
orden: 8                      # entero positivo, opcional
resumen: 'La campana: densidad simétrica definida por media y desvío.'
formato: apunte
hub: true                     # solo en la portada de la división, opcional
tags: [continua, normal]
fuentes: ["[[teorica-va-normal]]", "[[tp4]]"]
actualizado: 2026-09-04
---
```

### Cómo se leen los valores

- **Escalares**: se toma el primer alias presente cuyo valor no sea vacío, objeto ni lista.
- **Listas**: se acepta una lista YAML o un escalar separado por comas
  (`tags: continua, normal`). Los elementos vacíos se descartan.
- **Wikilinks en listas**: `[[destino|texto]]` y `[[destino#ancla]]` se reducen a `destino`.
  Sirve para que `fuentes` se escriba como enlaces en Obsidian y llegue como slugs.
- **División inválida**: si el valor no cumple `DivisionKey`, se normaliza y se avisa
  (`división normalizada en "<slug>": "<antes>" → "<después>"`). Si la clave normalizada no
  está en `config.divisions`, se avisa otra vez (`división "<key>" no está en
  config.divisions`) pero **la página se conserva**.
- **Orden inválido**: `orden: cero`, `orden: -1` o `orden: 0` → advertencia
  `orden inválido en "<slug>": orden "<valor>" (se ignora)` y el campo no se emite.

### El hub de una división

`hub: true` marca **la portada de la división**: la página que la presenta entera y desde la
cual se empieza a leerla. Se acepta `true`, `sí`, `si`, `yes` o `1` (sin distinguir
mayúsculas); cualquier otro valor, o la ausencia de la clave, deja el campo fuera de `Page`.

Efecto en la plataforma:

- **La secuencia de la división la abre el hub**, aunque su `orden` lo pusiera más adelante:
  `sequence(division)` lo adelanta a la primera posición. Todo lo que se apoya en la
  secuencia hereda ese orden: la numeración del temario, «Empezar a leer», los vecinos
  anterior/siguiente del lector y el orden de lectura global.
- **La vista de la división lo muestra como tarjeta de panorama**, con el epígrafe «Panorama
  de la unidad» y una insignia `hub` junto al título (en el temario y en el panorama). Sin
  ninguna página marcada, el panorama cae a la primera página del primer tipo de contenido
  declarado en `pageTypes` y el epígrafe pasa a «Para empezar».

Se espera **como mucho un hub por división**; si hay varios, manda el primero de la
secuencia. Una página de un tipo que no cuenta como contenido (una fuente) no puede ser hub:
no está en la secuencia.

---

## 4. `Page` — lo que emite el compilador

| Campo | Tipo | Default | Límite | Descripción |
|---|---|---|---|---|
| `slug` | `Slug` | — | 1–120 | Nombre del archivo, normalizado. |
| `title` | texto | — | 1–200 | Ver §3. |
| `type` | texto | — | 1–32 | Ver §3. |
| `folder` | texto | `""` | ≤ 64 | Carpeta de origen (`meta` para índice y registro). |
| `division` | `DivisionKey` | `"meta"` | 1–24 | División declarada, o `meta` si es transversal. |
| `order` | entero > 0 | — | — | Opcional. |
| `summary` | texto | `""` | ≤ 1200 | — |
| `format` | texto | — | ≤ 40 | Opcional. |
| `hub` | booleano | — | — | Opcional. Solo se emite cuando es `true`; ver §3. |
| `tags` | texto[] | `[]` | 60 por elemento | — |
| `sources` | texto[] | `[]` | 120 por elemento | Slugs (no se verifican contra las páginas). |
| `updatedAt` | texto | — | ≤ 40 | Opcional. |
| `links` | `PageLink[]` | `[]` | — | Wikilinks salientes; ver §6. |
| `headings` | `PageHeading[]` | `[]` | — | Tabla de contenidos; ver §7. |
| `body` | texto | — | — | Markdown crudo, sin frontmatter, ya normalizado (§8 y §9). |
| `words` | entero ≥ 0 | `0` | — | Palabras del cuerpo: coincidencias de `[\p{L}\p{N}_]+`. |

`PageMeta` es `Page` sin `body`, `links` ni `headings`: es lo que viaja en listados
(`SubjectDetail.pages`, backlinks, `App.PAGES`).

### Vista previa de página (la tarjeta de los enlaces, N0-50)

Cualquier enlace a una página dentro del shell —wikilink de la prosa, fila del índice,
segmento de la barra de la división, backlink, fuente, «¿Qué sigue?», resultado del
catálogo, enlace de una herramienta— muestra al pasar por encima (o al recibir el foco)
UNA tarjeta flotante con la vista previa del destino. Esto es lo que dibuja, y de dónde
sale cada dato:

| Lo que se ve | De dónde sale |
|---|---|
| Título | `Page.title` (§3). |
| «U3 · Concepto», con el punto del color de la división | División y `type` de la página, con los rótulos del `sinapsis.config.json` (`01`). |
| «4 de 12 · sin leer» | Solo cuando el enlace apunta a una página de la MISMA división que la abierta: posición en la secuencia pedagógica y progreso del usuario. |
| **Resumen** | **`resumen` del frontmatter (§3).** Si está vacío, el primer párrafo del cuerpo —sin el rótulo «**En breve.**» / «**Qué es:**», sin títulos, citas, listas ni fórmulas de display— recortado a 280 caracteres. |
| «§ Sección» + su primer párrafo | Solo si el enlace trae ancla (`[[pagina#ancla]]`): el encabezado que resuelve el ancla (§7) y su primer párrafo, recortado a 220. |
| «N palabras · leída ✓» | `Page.words` y el progreso del usuario. |

La consecuencia práctica para quien escribe el wiki: **el campo `resumen` es lo que se lee
en los tooltips**. Una página sin `resumen` no se queda sin tarjeta —cae al primer párrafo—,
pero muestra lo que el cuerpo diga primero, que casi nunca es una definición. El compilador
ya avisa cuáles faltan (`missing-summary`, §12).

La matemática en línea (`$…$`) se compone en la tarjeta; el recorte nunca parte una fórmula
por la mitad.

---

## 5. Divisiones efectivas

Una página puede declarar una división que el config no declara. La plataforma no la
descarta ni la inventa: la agrupa. Lo decide **el contrato**, no el cliente (N0-23).

| Situación | `Page.division` | División efectiva (`divisionOf`) | Cómo se ve |
|---|---|---|---|
| Declara una división que está en el config | esa clave | esa clave | Bloque de esa división. |
| No declara ninguna (campo vacío o ausente) | `meta` (`DIVISION_NONE`) | `meta` | Bloque sintético **«Transversales»**, `kind: "extra"`, color `--umeta`. |
| Declara una división que **no** está en el config | esa clave | `otras` (`DIVISION_OTHER`) | Bloque sintético **«Otras»**, `kind: "extra"`, color `--u0`. |

`effectiveDivisions(config, pages)` devuelve las divisiones declaradas (ordenadas por
`order ?? posición`) y agrega «Transversales» y «Otras` **solo si hay páginas que caigan
ahí**. Las sintéticas no cuentan como divisiones declaradas: no salen en el conteo de la
tarjeta de la landing y no reciben número.

La misma función alimenta el índice, los filtros del grafo y los mazos automáticos, así que
los tres coinciden siempre.

---

## 6. Wikilinks

Formas reconocidas, en cualquier lugar del cuerpo:

```markdown
[[distribucion-normal]]                       enlace simple
[[distribucion-normal|la campana]]            con texto alternativo
[[distribucion-normal#propiedades]]           a un encabezado
[[distribucion-normal#propiedades|ver ahí]]   ambas cosas
[[#propiedades]]                              a un encabezado de ESTA página
```

Lo que hace el compilador:

- Desescapa `\|` (los pipes escapados dentro de tablas de Obsidian).
- Parte por el **primer** `|`: lo de la izquierda es el destino, lo de la derecha el texto.
- Del destino, lo anterior al primer `#` es el slug y lo posterior el ancla.
- Recorta espacios y barras invertidas finales del destino.
- Un destino vacío (`[[#ancla]]`) apunta a la propia página.
- Un destino que no es un `Slug` válido se normaliza igual que un nombre de archivo:
  `[[De Morgan]]` → `de-morgan`. El texto original se guarda para la advertencia.
- Deduplica por la terna `(slug, anchor, text)`.

`PageLink`: `{ slug (1–200), anchor? (≤ 200), text? (≤ 200) }`. El `slug` de un enlace **no**
tiene que existir: si no existe, el compilador avisa.

```
3 wikilink(s) roto(s) hacia 2 destino(s) inexistente(s): de-morgan, tp7
  · "independencia" → de-morgan (escrito "De Morgan"), tp7
```

**Lo que hace el build con los enlaces**: `SiteSubject.links` guarda solo las aristas cuyo
destino existe **en la misma materia** y que no son auto-enlaces, deduplicadas por par. Es a
la vez el índice de enlaces entrantes del lector y el grafo de conexiones. Un enlace roto no
aparece en el grafo ni en los enlaces entrantes, pero sigue en `SitePages` (`links` de la
página) y el lector lo dibuja como enlace roto.

---

## 7. Encabezados e ids

Se extraen los encabezados **H1 a H4** del cuerpo ya normalizado. El patrón es
`^(#{1,4})\s+(texto)\s*#*$`: hace falta al menos un espacio después de los `#`, y los `#` de
cierre al final de la línea se descartan. **H5 y H6 no entran** en `headings` (el lector los
sigue renderizando, pero no van al índice de la página).

Las líneas dentro de un bloque `$$…$$` no cuentan: una línea cuyo texto recortado empiece con
`$$` se salta, y alterna el estado «dentro de matemática» si contiene una cantidad **impar**
de `$$`.

`PageHeading`: `{ level (1–6), text (≤ 300), id (≤ 200) }`.

### `headingId` — el algoritmo, que es contrato (N0-22)

El compilador es el **dueño único** del id de un encabezado y el lector aplica exactamente el
mismo algoritmo al renderizar, para que `[[pagina#ancla]]` resuelva siempre igual. Pasos, en
orden:

1. Se quita toda la matemática en línea: `\$[^$]*\$` → nada.
2. Se resuelven los wikilinks: `[[destino|alias]]` → `alias`; `[[destino]]` → `destino`.
3. Se borran las marcas de énfasis `*`, `_` y `` ` ``.
4. Minúsculas y recorte.
5. Se borra todo lo que no sea `[a-z0-9áéíóúñü ]` (**las vocales acentuadas y la eñe se
   conservan**).
6. Los espacios pasan a guiones y se recortan los guiones de los extremos.
7. Si no queda nada, el id es `h`.

```
"## Propiedades de $F_X$"            → "propiedades-de"
"## La **campana** de Gauss"         → "la-campana-de-gauss"
"## Función de distribución"         → "funcion-de-distribución"   ← ojo: la ó se conserva
"## Ver [[esperanza|el valor medio]]"→ "ver-el-valor-medio"
```

> El paso 5 conserva los acentos pero el paso 1 ya borró la matemática: un encabezado que es
> solo una fórmula termina con id `h`. Si dos encabezados de la misma página producen el
> mismo id, el contrato no los distingue: conviene evitarlo.

---

## 8. El H1 duplicado (N0-21)

El shell ya dibuja el título de la página. Un `# H1` inicial que solo repita ese título
sería un segundo encabezado idéntico, así que **el compilador lo recorta**:

- Si el cuerpo tiene un primer `# H1` y su texto coincide con el `title` de la página —
  comparando con acentos y mayúsculas plegados (`fold`) y sin las marcas `*_\`` —, esa línea
  se quita de `body` y, con ella, del índice de encabezados.
- Se quita también la línea en blanco que la siga, si la hay.
- Vale tanto si el título salió de ese H1 (no había `titulo` en el frontmatter) como si el
  frontmatter lo declara con el mismo texto.

Es la **única divergencia deliberada** con el `build.py` del baseline.

```markdown
---
titulo: Distribución Normal
---

# Distribución Normal          ← se recorta

La densidad…
```

Un H1 distinto del título se conserva:

```markdown
---
titulo: Distribución Normal
---

# La campana                   ← se conserva (texto distinto)
```

---

## 9. Matemática y la normalización de `$$` (N0-47)

- **En línea**: `$…$`. Se renderiza con KaTeX.
- **En display**: `$$…$$`.

El baseline emparejaba `$$…$$` sin importar dónde cayeran los saltos de línea; `remark-math`
solo abre un bloque cuando `$$` está **solo en su línea**. Sin corregirlo, `$$ f(x)` se lee
como una cerca con «meta»: la fórmula se pierde y el bloque se traga el resto de la página
(en Proba truncaba 51 páginas). Por eso `normalizeDisplayMath` reescribe el cuerpo antes de
emitirlo:

| Se escribió | Se emite | Efecto |
|---|---|---|
| `$$ f(x)` al principio de una línea, con `$$` impares | `$$` / `f(x)` en líneas propias | Abre el bloque. |
| `g(x) $$` al final de una línea, con el bloque abierto | `g(x)` / `$$` en líneas propias | Cierra el bloque. |
| `$$ h(x) $$` **sola en su línea** | `$$` / `h(x)` / `$$` | Bloque display de tres líneas (antes salía inline y chico). |
| `$$` sola en su línea | igual | Ya estaba bien. |
| `texto $$a$$ texto` (con texto alrededor) | igual | Sigue siendo inline doble, como en el baseline. |

La normalización **no toca el interior de los bloques de código** (` ``` ` o `~~~`). Los
encabezados se extraen del cuerpo **ya normalizado**, lo que recupera en el índice los
encabezados que el baseline se perdía después de un cierre `g(x) $$`.

El cuerpo que se guarda y se sirve es el normalizado: lo que se ve en el lector no es
carácter por carácter lo que hay en el archivo `.md`.

---

## 10. Callouts

Bloques `>` de Obsidian con una cabecera `[!tipo]`:

```markdown
> [!info] Título opcional
> Cuerpo del aviso, con **markdown** y $matemática$.
```

Se renderizan como `<aside class="callout" data-type="<tipo>">` con un rótulo en versalita.

### Tipos reconocidos y su rótulo

| Tipo | Rótulo | Alias aceptados |
|---|---|---|
| `info` | Información | `tldr`, `abstract` |
| `nota` | Nota | `note` |
| `tip` | Truco | `hint` |
| `intuicion` | Intuición | `intuition` |
| `ejemplo` | Ejemplo | `example` |
| `warn` | Atención | `warning`, `caution`, `atencion` |
| `discrepancia` | Discrepancia | — |
| `cita` | Cita | `quote`, `cite` |
| `figura` | Figura | `figure` |

El tipo se compara con acentos y mayúsculas plegados (`fold`), así que `[!Intuición]`,
`[!INTUICION]` e `[!intuicion]` son el mismo aviso. **Un tipo desconocido cae en `nota`**: no
es un error, y no hace falta declarar nada en el config.

### El marcador de plegado (N0-62)

El marcador de Obsidian decide si el aviso llega abierto o cerrado, con la misma semántica que
en Obsidian:

| Se escribe | Se dibuja | Marcado |
|---|---|---|
| `> [!cita]- Título` | **Cerrado**, se abre con un clic o con el teclado | `<details class="callout calloutFolded" data-type="cita">` con la versalita de `<summary>` |
| `> [!cita]+ Título` | Abierto | `<aside class="callout" data-type="cita">` |
| `> [!cita] Título` | Abierto | ídem |

Tres reglas que van con eso:

- **El cuerpo está en el HTML aunque el aviso esté cerrado.** No se recorta ni se carga
  aparte: la búsqueda, los enlaces entrantes y el índice de la página no cambian por plegar.
- **Un ancla que apunta adentro de un aviso cerrado lo abre.** El lector abre todos los
  pliegues que contienen al destino antes de saltar (`openFoldedAncestors`); si no, el
  encabezado no tiene medida y el salto queda en cualquier lado.
- **`[!figura]` no se pliega.** No es un aviso sino el hueco de una figura, y el marcador se
  ignora ahí.

Vale para todos los tipos del registro. La versalita sigue siendo **una sola** por aviso
(§ lector-17): plegado, esa versalita es la cabecera del pliegue.

### `[!figura]` es otra cosa (N0-42)

`> [!figura] <id> <epígrafe opcional>` no es un aviso: es el **hueco de una figura
interactiva**. El primer token del título es el id que un bundle registró con
`App.registerFigure`; lo que sigue es epígrafe.

```markdown
> [!figura] demo-normal
> La densidad de la normal estándar.
```

Emite exactamente el marcado que espera `App.mountFigures`:

```html
<figure class="figura doc-figure" data-fig="demo-normal">
  <div class="fig-host"><span class="figFrame">Figura interactiva</span></div>
  <figcaption>
    <p class="figLabel">Figura · demo-normal</p>
    <p>La densidad de la normal estándar.</p>
  </figcaption>
</figure>
```

Si la materia trae un bundle de figuras cargado, el lector vacía el hueco y monta el dibujo.
Si no, queda el marco discontinuo y el epígrafe se lee igual: **una materia sin herramientas
no rompe nada**. Un `[!figura]` sin id se dibuja como figura vacía (sin `data-fig`).

---

## 11. Qué NO se soporta

| Cosa | Por qué | Qué hacer en su lugar |
|---|---|---|
| **HTML crudo en el cuerpo** | El markdown se renderiza en el cliente sin `rehype-raw` (N0-10 + auditoría del Sprint 2): un `<div>` o un `<script>` escrito en el `.md` se muestra como texto, no como marcado. Es lo que evita que el contenido de una materia inyecte HTML en la plataforma. | Callouts, tablas GFM, o una figura (`[!figura]`) si hace falta marcado propio. |
| Subcarpetas del wiki | El compilador recorre un solo nivel. | Aplanar la carpeta. |
| Encabezados H5 y H6 en el índice de la página | `extractHeadings` solo mira H1–H4. | Usar hasta H4 para lo que deba aparecer en el índice. |
| Enlaces markdown `[texto](otra-pagina)` como enlaces internos | Solo los wikilinks `[[…]]` se resuelven contra la materia y alimentan el grafo. | `[[slug|texto]]`. |
| Adjuntos e imágenes locales del vault | No se publican: `Page` solo tiene texto. | Publicarlas dentro de un bundle de herramientas (`04`) o enlazarlas por URL. |
| Un tipo de callout propio | El registro es cerrado. | Usar el más parecido; un tipo desconocido cae en `nota`. |
| Frontmatter con claves propias | El compilador ignora lo que no está en §3. | Si hace falta un campo nuevo, es una propuesta (`07`). |

---

## 12. Advertencias del compilador, en una tabla

| Advertencia | `IssueKind` | Qué significa | Arreglo |
|---|---|---|---|
| `slug normalizado: "X" → "y"` | `slug-normalized` | El nombre del archivo no es un slug válido. | Renombrar el archivo. |
| `slug duplicado "x": A choca con B; se conserva la primera` | `duplicate-slug` | Dos archivos producen el mismo slug. | Renombrar uno. |
| `subcarpeta ignorada "a/b"` | `nested-folder` | Hay `.md` en un segundo nivel. | Aplanar. |
| `división normalizada en "x": "A" → "a"` | `invalid-division` | La división del frontmatter no cumple `DivisionKey`. | Corregir el frontmatter. |
| `"división X" no está en config.divisions — N página(s): …` | `unknown-division` | Falta declararla, o hay una errata. | Agregar la división o corregir las páginas. |
| `"tipo X" no está en config.pageTypes — N página(s): …` | `unknown-type` | Ídem con los tipos. | Agregar el tipo o corregir las páginas. |
| `orden inválido en "x": orden "cero" (se ignora)` | `invalid-order` | `orden` no es un entero positivo. | Poner un entero > 0 o quitarlo. |
| `N página(s) sin "resumen": …` | `missing-summary` | Sin tooltip, sin tarjeta y sin mazo automático. | Escribir 1–2 frases. |
| `N wikilink(s) roto(s) hacia M destino(s) inexistente(s): …` | `broken-link` | El destino no existe como página. | Corregir el slug, crear la página o desenlazar. |

Ninguna de ellas detiene la publicación. Las listas largas se recortan a 6 elementos con
`(+N más)`.

---

## Fuente ejecutable

- `packages/markdown/src/compile.ts` — `compilePage`, `compileWiki`, `IssueKind`,
  `formatIssues`, recorte del H1 (N0-21), orden de carpetas, páginas meta.
- `packages/markdown/src/frontmatter.ts` — `parseFrontmatter`, parser tolerante y manual,
  `cleanWikilink`.
- `packages/markdown/src/inline.ts` — `extractLinks`, `extractHeadings`, `countWords`,
  `firstH1Line`, `normalizeDisplayMath` (N0-47).
- `packages/contract/src/index.ts` — `Page`, `PageMeta`, `PageLink`, `PageHeading`,
  `headingId`, `fold`, `normalizeSlug`, `normalizeDivisionKey`, `DIVISION_NONE`,
  `DIVISION_OTHER`, `PAGE_TYPE_META`, `META_PAGES`, `divisionOf`, `effectiveDivisions`.
- `apps/web/src/features/subject/markdown/remarkCallouts.ts` — `CALLOUT_LABELS`, alias,
  `[!figura]` y el marcador de plegado.
- `apps/web/src/features/subject/markdown/folded.ts` — `openFoldedAncestors`: el ancla que
  cae dentro de un aviso cerrado.
- `apps/web/src/features/subject/components/page-tip.ts` — `leadOf`, `firstPara`,
  `sectionOf`: de dónde sale cada texto de la vista previa (N0-50).
- `packages/runtime/src/markdown.ts` — `figureMarkup`, el mismo marcado desde el runtime.
- `packages/cli/src/commands/site.ts` — `resolveLinks` (qué aristas entran en
  `SiteSubject.links`).

## Decisiones relacionadas

N0-10 (markdown en el cliente, sin HTML crudo) · N0-13 (compilador propio) ·
N0-21 (recorte del H1 duplicado) · N0-22 (el compilador es dueño de los ids de encabezado) ·
N0-23 (divisiones sintéticas) · N0-42 (figuras en callouts) ·
N0-47 (normalización de los `$$` de display) · N0-50 (vista previa de página) ·
N0-62 (callouts plegables).
