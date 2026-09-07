---
fecha: 2026-09-06
materia: cripto
titulo: "Dibujar los diagramas Mermaid del wiki"
rama: proposal/cripto-20260906-dibujar-los-diagramas-mermaid-del-wiki
estado: aprobada
pr: https://github.com/SebasCaules/Sinapsis/pull/5
---

## Motivo

El wiki de Criptografía tiene **16 bloques ```mermaid en 15 páginas** —el mapa de cada clase, el handshake de TLS, la construcción de HMAC y de CBC-MAC, GCM, la arquitectura de red de una empresa— y la plataforma los muestra como texto de código. Un diagrama de secuencia de TLS leído como veinte líneas de `C->>S: ClientHello` no es el diagrama: es su código fuente.

Para qué. Mermaid es la forma en que un vault de Obsidian escribe un diagrama sin salir del markdown: se versiona, se corrige en una línea y no hay que mantener una imagen aparte. Obsidian ya lo dibuja; la plataforma no. Es la misma clase de hueco que los adjuntos de imagen, pero peor, porque acá el contenido sí está en el markdown y solo falta dibujarlo.

Por qué no se resuelve en la materia. El dibujo es del lector. La materia podría exportar cada diagrama a PNG y pegarlo como imagen, y eso es exactamente lo que Mermaid existe para evitar: dos fuentes de verdad, una que se edita y otra que se olvida de actualizar.

Qué trae la rama.

- Los bloques con lenguaje `mermaid` se dibujan; el resto de los bloques de código sigue igual.
- **La librería entra por import dinámico**, así que solo se descarga en las páginas que la usan. Medido en el build: el trozo del lector queda igual (819,13 kB contra 818,99 kB antes) y Mermaid sale en su propio archivo de 659 kB (159 kB comprimido) que una materia sin diagramas no baja nunca.
- `securityLevel: "strict"`, el nivel más alto: Mermaid sanea el texto de cada etiqueta antes de dibujarla. **No se arma ninguna cadena de HTML**: el texto del diagrama se entrega como `textContent` del hueco y es Mermaid quien construye el SVG nodo por nodo con `mermaid.run`. El lector sigue sin `rehype-raw`. Verificado en el lector sobre el diagrama de la Clase 01: cero `<script>` y cero atributos `on*` en el SVG montado.
- Los `<br/>` de las etiquetas —que este wiki usa en 10 de sus 15 páginas con diagramas— siguen partiendo la línea. Verificado: la etiqueta sale como `<p>Criptografía<br>qué es y para qué</p>` y se dibuja en dos renglones.
- Los colores salen de los tokens de la plataforma y el diagrama se vuelve a dibujar al cambiar de tema, mirando `data-theme` del `<html>`.
- Un diagrama ancho conserva su tamaño y el hueco se desplaza, como ya hacen las tablas y las fórmulas anchas. Encogerlo hasta entrar dejaba las etiquetas ilegibles.
- Si el diagrama no compila se muestra el bloque de código original, marcado, nunca un hueco en blanco ni el cartel de error de Mermaid.

En el mismo cambio, porque es la misma superficie: `font-variant-ligatures: none` en `code` y `pre`. JetBrains Mono liga `->`, `-->` y `=>` en una flecha sola, y en un wiki de criptografía eso es una errata a la vista — `-->` del código de un diagrama, `!=` de una condición o `<-` de una asignación se leen mal o no se leen.

TEXTO PARA LA FILA DE docs/DECISIONS.md

Qué se decide. El lector dibuja los bloques de código con lenguaje `mermaid`. La librería se carga por import dinámico, se configura con `securityLevel: "strict"` y con los tokens del tema, y un diagrama que no compila cae al bloque de código. Ningún otro lenguaje se resalta ni se ejecuta.

Por qué. Es el único contenido del markdown que la plataforma recibía entero y no podía mostrar: el diagrama estaba ahí, escrito, y se veía como su código fuente. La alternativa —exportar cada diagrama a imagen— crea dos fuentes de verdad para el mismo dibujo. Se eligió el import dinámico sobre agregar Mermaid al trozo del lector porque son 159 kB comprimidos que ninguna materia sin diagramas debería pagar, y `mermaid.run` sobre `mermaid.render` porque evita que el lector manipule una cadena de HTML.

Costo de revertir. Medio. Quitar el componente devuelve los bloques a texto, sin romper nada publicado ni ningún archivo del sitio: lo que se pierde es el dibujo. Lo que cuesta de verdad es la dependencia: Mermaid es grande y se actualiza seguido, y cada actualización puede cambiar cómo se ve un diagrama sin que cambie el markdown que lo produce. Está aislada en un trozo propio y detrás de un solo componente, así que sacarla es un cambio de un archivo.

NOTA SOBRE EL ALCANCE DE ESTA RAMA

La mitad de CSS de este cambio —los estilos del hueco del diagrama y el `font-variant-ligatures: none` de `code` y `pre`— **ya está en `main`**, arrastrada por el commit `3f20156` («Claustro: el grano pasa a ser una sola capa global…»), que se llevó el archivo `markdown.module.css` con mis cambios sin commitear mientras esta propuesta se escribía. No la puse ahí a propósito y no es parte del cambio de ese commit; queda anotado acá para que se revise igual, porque es tan parte de esta propuesta como el resto. Si la propuesta se rechaza, esas reglas hay que sacarlas de `main` a mano: son `.prose .mermaid`, `.prose .mermaid:empty`, `.prose .mermaid svg`, `.prose .mermaidFallback` y las dos líneas `font-variant-ligatures: none` de `.prose code` y `.prose pre`.

## Alcance

Archivos cambiados en la rama (`git status --porcelain` al proponer):

- `apps/web/package.json` — modificado
- `apps/web/src/features/subject/markdown/Markdown.tsx` — modificado
- `apps/web/src/features/subject/markdown/Mermaid.test.tsx` — nuevo
- `apps/web/src/features/subject/markdown/Mermaid.tsx` — nuevo
- `docs/contracts/02-paginas.md` — modificado
- `pnpm-lock.yaml` — modificado

Al responder la revisión se suman dos:

- `apps/web/src/features/subject/markdown/Mermaid.real.test.tsx` — nuevo (los tests contra
  la librería sin mockear)
- `apps/web/src/features/subject/markdown/markdown.module.css` — modificado (dos comentarios:
  `N0-63` → `N0-69`; el archivo ya estaba en `main`)

Contratos afectados: ninguno (`packages/contract` no se toca).

## Compatibilidad

Ninguna materia publicada tiene un bloque mermaid: Proba no tiene ninguno, así que sus páginas se ven igual y no descargan la librería. No cambia ningún esquema ni ninguna versión de formato. Un bloque de código de otro lenguaje sigue mostrándose tal cual; lo único que cambia para todos es que las ligaduras tipográficas quedan apagadas en code y pre, que es lo que hace que -->, != y <- se lean literales.

## Gates

Los conteos son los de la rama **rebasada sobre `origin/main`** (`7b35737`). Suben respecto
de la primera corrida porque la rama trae ahora los tests que entraron a `main` después de
proponer, más los siete que agrega esta respuesta.

### `pnpm typecheck` — OK

```

> sinapsis@0.1.0 typecheck .
> pnpm -r run typecheck

Scope: 5 of 6 workspace projects
packages/contract typecheck$ tsc --noEmit -p tsconfig.json
packages/contract typecheck: Done
packages/runtime typecheck$ tsc --noEmit -p tsconfig.json
packages/markdown typecheck$ tsc --noEmit -p tsconfig.json
packages/runtime typecheck: Done
packages/markdown typecheck: Done
packages/cli typecheck$ tsc --noEmit -p tsconfig.json
apps/web typecheck$ tsc --noEmit -p tsconfig.json
packages/cli typecheck: Done
apps/web typecheck: Done
```

### `pnpm test` — OK

Conteos:

```
packages/contract test:  Test Files   4 passed (4)    Tests   44 passed (44)
packages/markdown test:  Test Files   6 passed (6)    Tests   97 passed (97)
packages/runtime  test:  Test Files   9 passed (9)    Tests  178 passed (178)
apps/web          test:  Test Files  57 passed (57)   Tests  700 passed (700)
packages/cli      test:  Test Files   1 passed (1)    Tests   57 passed (57)
```

Total: **1 076 pasados**. Dos de `packages/cli` son `it.skipIf(!existsSync(dist))`
(`packages/cli/src/cli.test.ts:843` y `:860`): en un árbol recién clonado, sin `dist`, se
omiten, y pasan después del `pnpm build`. Vienen de `main` y no son de esta rama.

De los 700 de `apps/web`, **11 son de Mermaid**: siete en `Mermaid.test.tsx` (la librería
mockeada: el import diferido y las tres formas de fallar) y cuatro en `Mermaid.real.test.tsx`
(`mermaid@11.17.2` sin mockear). Antes de la revisión eran cinco, todos mockeados.

### `pnpm build` — OK

Últimas líneas:

```
apps/web build: dist/assets/Markdown-Bgv5If69.js                      187.65 kB │ gzip:  58.08 kB
apps/web build: dist/assets/cytoscape.esm-Bch-eiPH.js                 443.89 kB │ gzip: 141.82 kB
apps/web build: dist/assets/mermaid.core-BNMEjKVX.js                  659.13 kB │ gzip: 158.99 kB
apps/web build: dist/assets/cynefin-OW5HDTMX-Bwz-QnQf.js              690.91 kB │ gzip: 154.63 kB
apps/web build: dist/assets/index-BZfiQuqb.js                         819.14 kB │ gzip: 255.01 kB
apps/web build: ✓ built in 9.93s
apps/web build: Done
```

Mermaid sigue en su propio trozo (659,13 kB; 158,99 kB comprimido) y el del lector queda en
819,14 kB, la misma cifra de la primera corrida: la corrección no mueve nada del reparto.

## Revisión

**Veredicto:** aprobada
**Revisó:** orquestador de la plataforma · 2026-09-07
**Commit de merge:** `01ee8a9`

### Gates en la rama
- `pnpm typecheck`: OK
- `pnpm test`: OK (web 700, markdown 97; los demás sin cambios)
- `pnpm build`: OK (`mermaid.core` en su propio trozo)
- `pnpm e2e`: no corresponde (la suite completa corre en `main` tras el merge)

### Hallazgos
Sin hallazgos nuevos. Se buscó: que el cartel de error de Mermaid no llegue al lector (`isDrawn` descarta `aria-roledescription="error"`, el texto «Syntax error in text» y el SVG vacío; `suppressErrorRendering: true`), que el texto entre como `textContent` y no como HTML, `securityLevel: "strict"`, que el test real (`Mermaid.real.test.tsx`) falle al quitar la corrección, que el diff sea solo de Mermaid tras el rebase (9 archivos) y que ningún commit lleve coautoría.

### Efecto en las materias
- Ninguno: el dibujo lo hace el lector sobre el markdown ya publicado. Cripto verá sus diagramas en cuanto se despliegue `main`.

## Revisiones anteriores

### Revisión previa

**Veredicto:** cambios-pedidos
**Revisó:** orquestador de la plataforma · 2026-09-06
**Commit de merge:** no corresponde

### Gates en la rama
- `pnpm typecheck`: OK
- `pnpm test`: OK — contract 44, markdown 97, runtime 178, web 686, cli 57 (una primera corrida bajo carga dio un timeout en «compila la materia real de Proba»; a solas pasan las 57). Coinciden con la propuesta.
- `pnpm build`: OK — `mermaid.core` sale en su propio trozo (659 kB, 159 kB comprimido) y el del lector no crece, como dice la propuesta.
- `pnpm e2e`: 92 pasadas, 3 omitidas, 2 fallas: `landing.spec.ts:47` («agrupa las materias por cuatrimestre») es **preexistente en `main`** (asume una sola materia; falla igual en las otras ramas), y `reader.spec.ts:65` («marcar estudiado…») fue un timeout bajo carga: repetida a solas pasa dos de dos. Ninguna es de esta propuesta.

### Hallazgos
1. **(medio)** `apps/web/src/features/subject/markdown/Mermaid.tsx:111-129` — la promesa «si el diagrama no compila se muestra el bloque de código original, nunca el cartel de error de Mermaid» **no se cumple** con la librería real. Con `mermaid@11.17.2`, `securityLevel: "strict"` y `suppressErrors: true`, un texto que no parsea deja en el hueco el SVG de error de Mermaid («Syntax error in text · mermaid version 11.17.2»); `target.querySelector("svg")` lo encuentra, el componente marca `data-mermaid="dibujado"` y el lector muestra la bomba de Mermaid en vez del código. Lo comprobé en este worktree con un test contra la librería real (no mockeada). El test de la propuesta (`Mermaid.test.tsx:15-33`) no lo detecta porque el mock de `run` deja el nodo vacío al fallar, que no es lo que hace Mermaid. Hace falta: `suppressErrorRendering: true` en `initialize` (existe en la versión fijada: `config.type.d.ts:252`), y que el caso «no compila» se pruebe con la librería real o con un mock que reproduzca el SVG de error.
2. **(medio)** La rama incluye el commit `3f20156` («Claustro: el grano pasa a ser una sola capa global…», N0-65), que no es de esta propuesta: nació de un `main` local que estaba adelante de `origin/main`, y ese commit además arrastró el CSS de Mermaid (`.prose .mermaid`, `.mermaidFallback`, `font-variant-ligatures: none`), como la propia propuesta anota. Para que el diff del PR sea solo la propuesta, `3f20156` tiene que llegar a `origin/main` antes (lo empuja quien lo hizo, desde `main`); si no llega, el CSS hay que traerlo a esta rama de forma explícita.
3. **(bajo)** Los comentarios del código y el contrato citan la decisión como **N0-63**, que ya existe (dock del botón «Panel»). Escriba `N0-69`; el número lo pone el orquestador al mergear.
4. **(bajo)** El contrato 02 §11 sigue diciendo que los adjuntos de imagen no se publican; no lo toque acá (es de la propuesta de adjuntos), pero al rebasar sobre `main` puede aparecer el conflicto: la fila la resuelve la otra propuesta.

Lo demás pasa las lentes: el texto del diagrama entra como `textContent` y no como HTML, sin `rehype-raw`; `securityLevel: "strict"` es correcto; la carga es diferida y medida; los `<br/>` se conservan; los colores salen de los tokens y se recomponen al cambiar el tema; una página sin Mermaid no importa la librería (probado). Español neutro.

### Efecto en las materias
- Ninguno hasta aprobar. Cripto no tiene que republicar: el dibujo lo hace el lector sobre el markdown ya publicado.

## Respuesta a la revisión

**Materia:** cripto · 2026-09-06 · rama rebasada sobre `origin/main` (`7b35737`).

### 1 (medio) — el cartel de error de Mermaid llegaba al lector

Confirmado tal cual: con `mermaid@11.17.2` y `securityLevel: "strict"`, un texto que no parsea
**no lanza**, deja en el hueco el SVG de error de la propia librería
(`aria-roledescription="error"`, con el texto «Syntax error in text · mermaid version
11.17.2»), y `querySelector("svg")` lo encontraba. Corregido en dos partes:

- `apps/web/src/features/subject/markdown/Mermaid.tsx:138` — `suppressErrorRendering: true`
  en `mermaid.initialize`, junto a `securityLevel: "strict"`. Con eso el hueco queda vacío en
  vez de recibir el cartel.
- `apps/web/src/features/subject/markdown/Mermaid.tsx:91-97` — `isDrawn(target)`: el hueco
  solo cuenta como dibujado si hay un `<svg>` **y** ese SVG no está marcado como error
  (`aria-roledescription="error"`), no dice «Syntax error in text», y tiene algo más que su
  hoja de estilos. Un `<svg>` vacío es un fallo, no un diagrama.
- `apps/web/src/features/subject/markdown/Mermaid.tsx:156` — el resultado de `run` se lee con
  `isDrawn` en vez de con `querySelector("svg") !== null`. La promesa rechazada ya caía al
  `catch` de la línea 160, que también manda al bloque de código; ahora está probado.

**El test sin mock existe y usa `render`, no `parse`.** Archivo nuevo
`apps/web/src/features/subject/markdown/Mermaid.real.test.tsx`: importa `mermaid@11.17.2` de
verdad —sin `vi.mock`— y monta `<Markdown>` entero.

- `Mermaid.real.test.tsx:64-74` — el diagrama inválido `flowchart TD\n  A --> ` deja el
  `<pre data-mermaid="sin-dibujar"><code>` con el texto del autor, no hay **ningún** `<svg>` en
  el contenedor, y ni el contenedor ni `document.body` contienen «Syntax error».
- `Mermaid.real.test.tsx:55-62` — el diagrama válido produce un `<svg>` con
  `aria-roledescription="flowchart-v2"` y el bloque de código desaparece.
- `Mermaid.real.test.tsx:76-89` — dos comprobaciones más contra la librería real: el SVG entra sin
  `<script>`, sin `javascript:` y sin atributos `on*`; y un `<br/>` de etiqueta sigue partiendo
  la línea.

Hizo falta **un solo relleno** para que jsdom soporte `mermaid.render`, y está explicado en el
encabezado del archivo (`Mermaid.real.test.tsx:11-18`): jsdom implementa el DOM pero no el
layout, así que `SVGElement.prototype.getBBox` no existe y la librería moría con
«childNodeEl.node(...)?.getBBox is not a function». Se le da una medida aproximada (ancho
proporcional al largo del texto) y de ahí en adelante corre la librería entera: parsea, arma
el SVG y lo monta. Lo único falso es cuánto mide cada caja, que no es lo que estos tests
miran. **No hizo falta caer a `mermaid.parse`.**

Comprobado que el test detecta la regresión: quitando `suppressErrorRendering` y volviendo a
`querySelector("svg") !== null`, `Mermaid.real.test.tsx:64` falla.

El archivo mockeado (`Mermaid.test.tsx`) se queda con lo que un mock sí puede probar sin
mentir —que una página sin diagramas no toca la librería— y su caso de fallo ahora **imita al
de verdad**: el mock inyecta el cartel de error de Mermaid (`Mermaid.test.tsx:24-33`) en vez
de dejar el nodo vacío, y hay un caso por cada forma de fallar: cartel
(`Mermaid.test.tsx:82`), hueco vacío (`:90`) y promesa rechazada (`:98`).

### 2 (medio) — el commit `3f20156` en la rama

Resuelto por el rebase: `3f20156` ya está en `origin/main`, así que dejó de ser un commit de
esta rama. `git diff origin/main --stat` da ahora exactamente los archivos de la propuesta y
nada más. El CSS de Mermaid que ese commit arrastró (`.prose .mermaid`,
`.prose .mermaid:empty`, `.prose .mermaid svg`, `.prose .mermaidFallback` y las dos líneas
`font-variant-ligatures: none`) quedó en `main` en una sola copia: el rebase no lo duplicó y
se verificó a mano en `markdown.module.css`. Sigue en pie lo anotado más arriba: si la
propuesta se rechaza, esas reglas hay que sacarlas de `main` a mano.

Conflictos del rebase y cómo se resolvieron:

- `docs/contracts/02-paginas.md` — dos choques, los dos por la propuesta de callouts plegables
  que ya entró a `main`. Se conservaron **los dos lados**: en «Fuente ejecutable» quedan
  `folded.ts` (de plegables) y `Mermaid.tsx` (de esta), y en «Decisiones relacionadas» quedan
  `N0-66 (callouts plegables) · N0-69 (diagramas Mermaid)`.
- `apps/web/src/features/subject/markdown/Markdown.tsx`, `apps/web/package.json` y
  `pnpm-lock.yaml` — se fusionaron solos, sin choque.
- `e2e/shots/*.png` — el commit de revisión traía 18 capturas regeneradas que no son de esta
  propuesta y que hacían retroceder a las de `main` (más nuevas, de la auditoría de temas). Se
  devolvieron a la versión de `origin/main`.

### 3 (bajo) — `N0-63` ya existe

Reemplazado por `N0-69` en todo lo que es de esta propuesta:

- `apps/web/src/features/subject/markdown/Mermaid.tsx:2`
- `apps/web/src/features/subject/markdown/Mermaid.test.tsx:2`
- `apps/web/src/features/subject/markdown/Mermaid.real.test.tsx:2` (archivo nuevo)
- `docs/contracts/02-paginas.md:365` (título de §9 bis) y `:545` (decisiones relacionadas)
- `apps/web/src/features/subject/markdown/markdown.module.css:88` y `:107`

Los dos últimos son el archivo que `3f20156` arrastró a `main`, así que **esta rama toca un
archivo más de los que enumeraba el alcance**; se anota acá para que se vea. `docs/DECISIONS.md`
no se tocó: el `N0-63` de ahí es el dock del botón «Panel» y es legítimo, igual que las
menciones de `EXEC_STATE.md:232` y `docs/HANDOFF-sprint4.md:112`, que apuntan a esa misma
decisión.

### 4 (bajo) — §11 del contrato sobre adjuntos

Sin tocar, como pide la revisión: la fila la resuelve la propuesta de adjuntos. El rebase no la
rompió —no hubo conflicto en esa parte del archivo— y `docs/contracts/02-paginas.md` sigue
diciendo lo mismo que en `main` sobre los adjuntos.
