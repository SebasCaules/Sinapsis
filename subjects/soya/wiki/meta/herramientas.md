---
titulo: Herramientas del vault
tipo: wiki
modulo: []
clase: []
division: "vault"
tags: [salud-de-la-wiki, herramientas, lint]
fuentes: []
actualizado: 2026-09-15
estado: en-desarrollo
resumen: 'Documenta los cinco scripts de tools/ — qué hace cada uno, cómo se corre y qué devuelve — para que el usuario sepa qué puede ejecutar y para que el propio lint deje de reportarlos como huérfanos del repo.'
---

## En una línea

Documenta los cinco scripts de `tools/` — qué hace cada uno, cómo se corre y qué devuelve —
para que el usuario sepa qué puede ejecutar y para que el propio lint deje de reportarlos como
huérfanos del repo.

## Por qué existe esta página

Los scripts viven en el repo pero, hasta ahora, ninguna página de la wiki los nombraba por su
ruta completa. `tools/lint.py` chequea que **todo archivo del repo esté nombrado desde alguna
página** ([[#Invariantes que verifica el lint]]), así que `tools/extraer.py`, `tools/buscar.py`,
`tools/lint.py` y `tools/alias.py` aparecían como huérfanos en su propio reporte. Esta página los
nombra y de paso les da un manual.

## `tools/extraer.py` — extracción de texto

Convierte los PDF y PPTX de `raw/` a texto plano en `.cache/txt/`, con marcadores de página o de
slide intercalados. `raw/` es de solo lectura: `tools/extraer.py` únicamente lee de ahí y escribe
en `.cache/`, nunca al revés.

```bash
python3 tools/extraer.py            # regenera solo lo que esté desactualizado
python3 tools/extraer.py --force    # fuerza la regeneración de todo
```

Qué hace exactamente:

- Recorre `raw/` buscando `.pdf` y `.pptx`. Por cada archivo, si el `.txt` correspondiente en
  `.cache/txt/` ya existe y es más nuevo que la fuente, lo salta e imprime `[ok]`; si no,
  lo (re)genera e imprime `[nuevo]`.
- El nombre del `.txt` de salida sale de la ruta relativa a `raw/`, con cada segmento pasado por
  slug (minúsculas, sin acentos, espacios a guiones) y unido con `--`. Por eso
  `raw/clases/1er clase SOyA - V-3.pdf` termina en `.cache/txt/clases--1er-clase-soya---v-3.txt`.
- En PDF marca cada página con `<<<<< PDF_PAGE n | archivo >>>>>` y extrae el texto con `pypdf`;
  si una página falla, deja constancia del error en el propio texto en vez de abortar el archivo
  entero.
- En PPTX marca cada slide con `<<<<< SLIDE n | archivo >>>>>` y además de las cajas de texto lee
  **tablas** (fila por fila, celdas unidas con ` | `), **formas agrupadas** (entra recursivamente
  en el grupo) y las **notas del orador**, que en esta cátedra suelen traer el guion completo de
  la clase — perderlas sería perder texto real, no solo formato.

Cuándo conviene correrlo: después de que el usuario deja un PDF o PPTX nuevo en `raw/`, como
primer paso de cualquier ingesta (ver el workflow 3.1 de `CLAUDE.md`). Es seguro correrlo sin
argumentos en cualquier momento — sin fuentes nuevas no reescribe nada.

## `tools/buscar.py` — búsqueda en wiki y fuentes

Busca un patrón, insensible a mayúsculas y a acentos, tanto en el cuerpo de `wiki/` como en el
texto crudo cacheado de `.cache/txt/`. Sirve para no tener que abrir `raw/` a mano ni adivinar en
qué página ya se escribió algo.

```bash
python3 tools/buscar.py "barreras"              # busca en wiki/ y en .cache/txt/
python3 tools/buscar.py --wiki "barreras"       # solo en wiki/
python3 tools/buscar.py --fuentes "barreras"    # solo en .cache/txt/
```

Qué hace exactamente:

- Normaliza el patrón y cada línea comparada quitándoles los acentos (NFKD + descarte de
  combining marks) y pasándolos a minúsculas, así "máxima" matchea con "maxima".
- Sobre `wiki/`: recorre todo `.md` del vault línea por línea e imprime `ruta:número: línea` por
  cada coincidencia.
- Sobre `.cache/txt/`: recorre cada `.txt`, sigue los marcadores `<<<<< PDF_PAGE n | ... >>>>>`
  para saber en qué página del PDF va cada línea, e imprime hasta 12 coincidencias por archivo
  con esa página; si hay más, avisa cuántas quedaron afuera en vez de inundar la salida. (El
  marcador que reconoce es el de PDF; en un `.txt` que venga de un PPTX no reporta número de
  slide, solo el texto.)
- Sin `--wiki` ni `--fuentes` corre las dos búsquedas, wiki primero.

Cuándo conviene correrlo: en el workflow de consulta (3.2), antes de escribir una respuesta, para
ubicar qué páginas ya tocan el tema y en qué slide/página exacta lo dice la fuente cruda —
insumo directo para la cita.

## `tools/lint.py` — chequeo de salud del vault

El verificador de consistencia del repo. Recorre toda la wiki y reporta ocho categorías de
problemas (frontmatter, nombres y aliases, imágenes, regla de espejo, tablas rotas, huérfanos del
repo, páginas huérfanas y enlaces rotos), y sale con código 1 si encuentra algo no declarado
como intencional — pensado para cerrar una ingesta.

```bash
python3 tools/lint.py               # reporte de salud, sin sugerencias
python3 tools/lint.py --huecos      # además, sugiere qué página crear según enlaces rotos repetidos
```

Qué devuelve: un reporte por secciones (`== FRONTMATTER ==`, `== ALIASES Y NOMBRES ==`,
`== IMÁGENES Y ADJUNTOS ==`, `== REGLA DE ESPEJO ==`, `== TABLAS ROTAS ==`,
`== TABLAS FRÁGILES ==`, `== HUÉRFANOS DEL REPO ==`, `== HUÉRFANAS ==`, `== ENLACES ROTOS ==`) y,
con `--huecos`, una sección `== SUGERENCIAS ==` que propone crear una página por cada destino
roto que reclaman 3 o más páginas. Termina con `OK: sin problemas no declarados` o
`FALLA: N problemas`.

Cuándo conviene correrlo: al final de cualquier operación que toque la wiki (regla dura de
`CLAUDE.md`), y con `--huecos` quincenalmente o después de una ingesta grande, para decidir qué
páginas de concepto crear a partir de lo que la propia wiki está pidiendo.

## `tools/transcribir.py` — transcripción de clases grabadas

**Agregado el 2026-09-15**, con la ingesta de [[clase-05]]: la cátedra de 2020 dejó tres clases
grabadas, y una grabación sin transcripción no se puede citar por minuto ni buscar. Es el hermano
de `extraer.py` para video y audio.

```bash
python3 tools/transcribir.py                                   # todo video/audio de raw/
python3 tools/transcribir.py "raw/clases/x/1 - Tema.mp4"       # uno en particular
python3 tools/transcribir.py --raw-dir raw/clases/clase-riesgos1 "~/Downloads/1 - Tema.mp4"
python3 tools/transcribir.py --force --prompt "vocabulario extra" …
```

Qué hace exactamente:

- Recorre `raw/` buscando `.mp4`, `.mov`, `.mkv`, `.webm`, `.m4a`, `.mp3`, `.wav`, `.aac` (o toma
  los archivos que se le pasen). Para cada uno, si el `.txt` del caché es más nuevo que la fuente,
  lo salta e imprime `[ok]`; si no, lo genera e imprime `[nuevo]`.
- El nombre de salida sigue **la misma convención que `extraer.py`** (ruta relativa a `raw/`,
  segmentos pasados por slug, unidos con `--`): `raw/clases/clase-riesgos1/1 - Contaminación
  ambiental.mp4` → `.cache/txt/clases--clase-riesgos1--1---contaminacion-ambiental.txt`.
- **`--raw-dir`** resuelve el caso en que el archivo todavía no está en `raw/` (porque `raw/` lo
  escribe el usuario, no el LLM): el caché se nombra como si ya estuviera en esa carpeta, y cuando
  el usuario lo mueva no hay nada que renombrar. Es lo que se hizo con los tres videos de la clase
  5, que se transcribieron desde una descarga temporal y después se borraron: **el `.txt` del
  caché es todo lo que queda de ellos en el repo**, así que no se regenera solo.
- Extrae el audio con `ffmpeg` (mono, 16 kHz) a un directorio temporal y lo transcribe **en la
  máquina** con `mlx-whisper` (modelo `mlx-community/whisper-large-v3-turbo`, idioma forzado a
  español, con un *prompt* de vocabulario de la materia que mejora siglas y nombres). **Nada sale a
  ninguna API.** En un M3 Pro tarda ≈ 2,5 minutos por hora de audio.
- Escribe una cabecera `<<<<< VIDEO | archivo | duración | modelo (fecha) … >>>>>` y una línea por
  segmento: `[mm:ss] texto`. Cada línea lleva su minuto, así que un hallazgo de `buscar.py` ya
  trae la cita.

Cuándo conviene correrlo: al ingestar una clase grabada, antes de escribir la página de
`wiki/fuentes/`. Después conviene **muestrear el video** (por ejemplo `ffmpeg -vf fps=1/60`) para
saber qué slide está en pantalla en cada minuto: la transcripción dice qué se dijo, no qué se
mostró.

Límites que hay que tener presentes: es reconocimiento automático **sin corrección** — los
tecnicismos y los nombres pueden salir mal ("tetradrofuego", "los CNA guarrasque arden") y no se
cita por palabra sino por minuto. Requiere `ffmpeg` y `pip install mlx-whisper` (Apple Silicon);
la primera corrida descarga el modelo (~1,6 GB).

## `tools/alias.py` — gestión de aliases

Resuelve enlaces rotos declarando alias en el frontmatter de la página canónica, en vez de
duplicar contenido o reescribir wikilinks a mano. Solo toca páginas cuyo nombre canónico ya existe
en la wiki y solo agrega un alias si ese nombre efectivamente está roto — es idempotente, correrlo
dos veces no repite trabajo.

```bash
python3 tools/alias.py              # dry-run: muestra qué aplicaría
python3 tools/alias.py --aplicar    # escribe los alias en el frontmatter
```

Qué hace exactamente:

- Tiene un `MAPA` interno de página-canónica → lista de sinónimos y una tabla `REDIRECCIONES`
  aparte para nombres que no son sinónimos estrictos sino subtemas ya cubiertos dentro de la
  página canónica; ambas se fusionan en `MAPA` al cargar el script.
- Calcula qué wikilinks de la wiki están rotos hoy (no resuelven ni por nombre de archivo ni por
  un alias ya declarado).
- Para cada entrada del mapa cuya canónica exista como página, filtra los alias que están
  realmente rotos y no estaban ya declarados, y los imprime como `[dry-run]` o, con `--aplicar`,
  los escribe en el campo `aliases:` del frontmatter de esa página (creándolo si no existía).
- Al final imprime cuántos enlaces rotos quedan **sin** alias en el mapa — son candidatos a que
  alguien los agregue al `MAPA`, o a que se cree la página en vez de redirigirla.

> **Inferencia:** el `MAPA` que trae hoy el script está lleno de sinónimos de Aprendizaje
> Automático (`svm`, `knn`, `pca`, `k-means`...), heredados del vault de FGIII del que se migró
> `tools/lint.py` (ver [[#Ajustes propios de esta materia]]). No aplica a ningún concepto de
> SOyA todavía: correrlo hoy no cambia nada en esta wiki hasta que se cargue un mapa propio de
> la materia.

Cuándo conviene correrlo: cuando `tools/lint.py` reporta el mismo enlace roto desde varias
páginas y se confirma que es un sinónimo real (no un tema nuevo) — se agrega la entrada a `MAPA`
y se corre con `--aplicar`.

## Invariantes que verifica el lint

Lo que `tools/lint.py` chequea, sección por sección del reporte:

- **Frontmatter completo y válido**: están los ocho campos obligatorios
  (`titulo, tipo, modulo, clase, temas, fuentes, actualizado, estado`); `tipo` es uno de los
  permitidos; `estado` es uno de los permitidos; `actualizado` es una fecha real en formato
  `AAAA-MM-DD` y no está en el futuro; una página `tipo: fuente` además tiene `raw_path` y `rol`.
- **Tipos y estados permitidos**: `tipo` ∈ {fuente, concepto, entidad, normativa, ejercicio, hub,
  wiki}; `estado` ∈ {esbozo, en-desarrollo, consolidado}. El tipo de las páginas de `meta/` se
  llama `wiki` y no `meta` porque Sinapsis reserva esa clave para el índice y el registro.
- **Coherencia del prefijo `<clase>-<orden>-`**: si el archivo lleva prefijo (propio de
  `conceptos/`), la clase del prefijo tiene que ser la **menor** clase declarada en el frontmatter;
  una página `tipo: concepto` con `clase` no vacía pero sin prefijo también se marca. El separador
  es guion y no punto porque Sinapsis no admite puntos en el slug.
- **Coherencia de `division` con `modulo`**: `division` es la clave con la que Sinapsis agrupa la
  página. `modulo: [1]` pide `"1"`, `[2]` pide `"2"`, las transversales (`[1, 2]` o `[]`) van a
  `"cursada"`, las de `meta/` a `"vault"`, y el índice y la síntesis quedan sin división (`""`).
- **Regla de espejo `raw/` ↔ `wiki/fuentes/`**: cada archivo de `raw/` (menos `.DS_Store` y
  `.gitkeep`) tiene que estar cubierto por el `raw_path` de exactamente una página de
  `wiki/fuentes/`; un `raw_path` puede apuntar a una carpeta completa. Avisa si un archivo de
  `raw/` no está cubierto, si dos páginas reclaman el mismo `raw_path`, si un `raw_path` declarado
  no existe en disco, o si alguien declara la raíz de `raw/` entera (taparía cualquier fuente
  nueva).
- **Huérfanos del repo**: todo archivo del repositorio (fuera de `.git`, `.obsidian`, `.cache` y
  `.plans`) tiene que estar nombrado o enlazado desde alguna página de la wiki, o cubierto por la
  regla de espejo si vive en `raw/`. Es la categoría que reportaba a los scripts de
  `tools/` como huérfanos antes de esta página.
- **Enlaces rotos**: todo wikilink (`[[…]]`) cuyo destino no sea el nombre de archivo ni un alias de
  ninguna página existente (los enlaces dentro de un bloque de código no cuentan, son ejemplos
  de documentación).
- **Tablas markdown que pierden celdas en el render**: detecta pipes (`|`) sin escapar dentro de
  matemática (`$...$`) o de un code span dentro de una tabla, wikilinks con alias sin escapar
  (un alias con la barra sin escapar, en vez de con `\|`), y filas cuya cantidad de celdas no coincide
  con la del encabezado — las tres formas en que GFM descarta contenido en silencio en vez de
  avisar.
- **Aliases duplicados**: dos páginas con el mismo nombre de archivo, o un mismo alias reclamado
  por dos páginas distintas (Obsidian no podría resolverlo), o un alias que colisiona con el
  nombre de archivo de otra página.
- **Nombres fuera de convención**: mayúsculas, acentos, ñ, espacios o guion bajo en el nombre de
  archivo — todo lo que rompería un wikilink en `kebab-case`.

También reporta, sin contar como falla: **tablas frágiles** (pipes escapados dentro de matemática
que podrían haber sido una norma `‖·‖` degradada a valor absoluto — pide criterio humano, no se
puede decidir en automático) y **páginas sin enlaces entrantes**.

## Ajustes propios de esta materia

`tools/lint.py` no se escribió para SOyA: se heredó del vault de Fundamentos de Ingeniería para
la Inteligencia Artificial (FGIII) y se migró. Lo que cambió en la migración:

- El campo de frontmatter `unidad` pasó a llamarse **`modulo`**, porque esta materia se organiza
  en dos módulos independientes (Seguridad y Medio Ambiente) en vez de unidades temáticas.
- Los tipos de página `caso` y `tpc` (propios de FGIII) se reemplazaron por **`normativa`** y
  **`ejercicio`**, que son los tipos que necesita el temario de SOyA.
- La tabla `UNIDAD_DE_CLASE` de FGIII se reemplazó primero por un `MODULO_DE_CLASE` que sólo
  conocía las clases 1 y 2, y desde el 2026-09-15 por la coherencia **`division` ↔ `modulo`**
  (tablas `DIVISION_DE_MODULO` y `SIN_DIVISION`): el módulo lo dice el frontmatter, no el nombre
  del archivo ni la carpeta, así que no hace falta saber en qué clase arranca cada módulo.
- **`CLASES_VALIDAS`** quedó como `range(1, 21)` — una cota provisoria y holgada para atrapar un
  error de tipeo evidente (`clase: [99]`) sin rechazar clases legítimas, hasta que llegue el
  cronograma real (ver [[huecos]], H-01) y se pueda ajustar al número exacto de clases de la
  cursada.
- **`.cache/` y `.plans/`** se agregaron a `REPO_EXCLUIR_DIR`, así que el chequeo de huérfanos del
  repo no los recorre: `.cache/` es texto regenerable por `tools/extraer.py` y no versionado, y
  `.plans/` es estado de ejecución del proceso, no contenido de la wiki.

## Estado actual del lint

Salida de `python3 tools/lint.py --huecos` corrida desde la raíz del vault el 2026-08-13, sobre
47 páginas:

```
Páginas: 47   Enlaces distintos: 396

== FRONTMATTER ==
  ok

== ALIASES Y NOMBRES ==
  ok

== IMÁGENES Y ADJUNTOS ==
  ok

== REGLA DE ESPEJO (raw/ ↔ wiki/fuentes/) ==
  ok

== TABLAS ROTAS (se pierde contenido en el render) ==
  ok

== TABLAS FRÁGILES (0, avisos: piden criterio, no fallan) ==
  ok

== HUÉRFANOS DEL REPO (4) ==
  ! tools/alias.py: no lo nombra ni lo enlaza ninguna página
  ! tools/buscar.py: no lo nombra ni lo enlaza ninguna página
  ! tools/extraer.py: no lo nombra ni lo enlaza ninguna página
  ! wiki/meta/glosario-es-en.md: no lo nombra ni lo enlaza ninguna página

== HUÉRFANAS (sin enlaces entrantes) ==
  ! glosario-es-en

== ENLACES ROTOS (2 destinos inexistentes, 2 no declarados) ==
  (el conteo son OCURRENCIAS; entre paréntesis, en cuántas páginas distintas)
  !  23 (12 pág.)  ejercicio-barreras   ← 01-07-accidente, 02-03-barrera, ...
  !   1 (1 pág.)  index                ← materia

== SUGERENCIAS ==
  crear wiki/…/ejercicio-barreras.md — lo reclaman 23 páginas

FALLA: 7 problemas
```

Línea por línea, qué es deuda real y qué es esperado:

- **`tools/alias.py`, `tools/buscar.py`, `tools/extraer.py` huérfanos** — era deuda real: nadie
  los nombraba por ruta completa. Esta misma página los nombra a los cuatro (incluido
  `tools/lint.py`, que no aparecía en el reporte porque el propio `CLAUDE.md` raíz ya lo
  menciona), así que se resuelve al publicarla.
- **`wiki/meta/glosario-es-en.md` huérfano y sin enlaces entrantes** — deuda real y previa a esta
  tarea, sin relación con las herramientas: ninguna página de concepto todavía enlaza el
  glosario ES↔EN. Queda anotado acá para que no se pierda; la resolución (enlazarlo desde las
  páginas de `conceptos/` que introducen un término en inglés) es trabajo de otra página, no de
  esta.
- **`ejercicio-barreras` roto, reclamado por 23 páginas** — esperado y ya documentado por la
  propia consigna del vault: `raw/ejercicios/` tiene el PDF (ver
  [[ejercicio-barreras-consigna]], la página de fuente) pero **la resolución propia del ejercicio
  como página de `wiki/ejercicios/`** todavía no se escribió. Es exactamente el caso que
  `--huecos` está diseñado para señalar: un enlace que 23 páginas ya dan por sentado.
- **`index` roto desde `materia`** — esperado: `index.md` es del orquestador (regla dura n.º 5 de
  `CLAUDE.md`), esta tarea no puede crearlo ni tocarlo. El `[[indice]]` que enlaza `materia.md`
  queda intencionalmente roto hasta que el orquestador lo cree.

Ninguno de los cuatro problemas restantes lo genera ni lo resuelve esta página; se dejan
anotados acá porque es donde se corrió el lint que los mostró.

## Sinapsis — la materia publicada

Desde el 2026-09-15 la wiki se publica en la plataforma Sinapsis (`/m/soya`). El puente son dos
cosas que viven en la raíz del repo y no en `wiki/`:

- **`sinapsis.config.json`** — lo que la plataforma sabe de la materia: nombre, código 12.83, la
  nomenclatura de división (Módulo), las cuatro divisiones (`1` Higiene y Seguridad Ocupacional,
  `2` Medio Ambiente, `cursada`, `vault`), los siete tipos de página, el rail (repaso del parcial
  1, banco del parcial 2, guía de finales, programa, contradicciones, huecos) y el campo del
  frontmatter que dice la división (`division`). La síntesis va como página suelta arriba del
  índice (`wiki.standalone`).
- **`estudio/`** — el material de estudio, que la plataforma lee y la wiki no:

  | Archivo | Qué es |
  |---|---|
  | `flashcards-definiciones-modulo-1.md` | 31 tarjetas con las definiciones literales de las clases 1 a 5 |
  | `flashcards-numeros-modulo-1.md` | 27 tarjetas con los datos numéricos del módulo 1, cada uno con su organismo y su año |
  | `flashcards-normativa.md` | 17 tarjetas, una por norma de los dos módulos |
  | `flashcards-parcial-2-preguntas.md` | las 80 preguntas de [[guia-parcial-2-ambiental]] con la respuesta en una línea de [[banco-parcial-2-ambiental]]; se genera desde la tabla del banco |
  | `quiz-modulo-1.md` | 24 preguntas de opción múltiple del módulo 1 |
  | `quiz-modulo-2.md` | 22 preguntas de opción múltiple del módulo 2, sobre lo que cayó en finales |
  | `plan.json` | el plan de estudio: parcial 1, parcial 2 y final, con el recuperatorio como instancia opcional; sin fechas, que las carga cada usuario (H-01) |
  | `kits.json` | tres kits: parcial 1, parcial 2 y final |

Lo que el compilador de Sinapsis exige y esta wiki cumple desde esa fecha: slugs sin puntos
(prefijo `CC-NN-`), un solo nivel de carpetas dentro de `wiki/`, `division` y `resumen` en cada
frontmatter, `tags` en vez de `temas`, y ningún `tipo: meta`. El `resumen` de cada página es su
sección "En una línea" aplanada, y es lo que la plataforma muestra en tooltips y tarjetas.

Comandos, desde la raíz del repo (el CLI vive en el repositorio de la plataforma, `SINAPSIS_HOME`):

```bash
pnpm --dir "$SINAPSIS_HOME" sinapsis -- --cwd "$PWD" validate --config sinapsis.config.json
pnpm --dir "$SINAPSIS_HOME" sinapsis -- --cwd "$PWD" publish  --config sinapsis.config.json --dry-run
pnpm --dir "$SINAPSIS_HOME" sinapsis -- --cwd "$PWD" publish  --config sinapsis.config.json
```

`publish` copia la materia a `subjects/soya/` del repositorio de la plataforma en una rama
`subject/soya-<fecha>` y abre el pull request; lo revisa y mergea el orquestador de la plataforma,
no esta materia. Es reemplazo completo: lo que no está en el vault se borra de la plataforma.

## Qué NO hay

- **No hay motor de búsqueda semántica.** `tools/buscar.py` es coincidencia literal de texto
  (normalizada en mayúsculas y acentos), no búsqueda por significado: no hay `qmd`, embeddings ni
  ningún índice vectorial en este vault.
- **No hay control de versiones.** El vault no es un repositorio git — no hay historial de
  commits, ni forma de ver una versión anterior de una página más que abriéndola. El registro de
  cambios cronológico es `log.md` (append-only), no un VCS.
- **No hay extracción de imágenes de los PDF.** `tools/extraer.py` solo extrae **texto** (y, de
  los PPTX, tablas y notas del orador). Ningún script recorta ni exporta las figuras o diagramas
  de los slides; los recortes de `assets/` que la wiki referencia se generan a mano con
  `pdftoppm` (ver `CLAUDE.md` §2).
- **No hay descarga de videos.** `tools/transcribir.py` transcribe archivos locales; bajar una
  clase de Drive o del campus es un paso manual (los de la clase 5 exigieron la sesión de Google
  del usuario). Ver [[clase-05]].

## Relación con otros temas

- [[huecos]] — H-01 es la razón de fondo por la que `CLASES_VALIDAS` sigue siendo provisorio en
  el lint.
- [[contradicciones]] — misma familia de páginas de salud del vault; a diferencia de esta, registra
  desacuerdos entre fuentes, no estado del tooling.
- [[materia]] — hub de la cursada; enlaza [[huecos]] del mismo modo que esta página documenta lo
  que los sostiene por detrás.
- [[indice]] — el catálogo de páginas que `tools/lint.py` usa como referencia de qué existe;
  todavía no está creado (ver [[huecos]]), pero ésta es la entrada que debería sumarle: "meta →
  herramientas del vault".

## Fuentes

Ninguna: esta página describe el código de `tools/` tal como está escrito en el repo, no una
clase ni una consigna de la cátedra.
