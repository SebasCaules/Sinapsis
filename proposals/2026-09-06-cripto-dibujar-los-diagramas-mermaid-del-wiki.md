---
fecha: 2026-09-06
materia: cripto
titulo: "Dibujar los diagramas Mermaid del wiki"
rama: proposal/cripto-20260906-dibujar-los-diagramas-mermaid-del-wiki
estado: abierta
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

Contratos afectados: ninguno (`packages/contract` no se toca).

## Compatibilidad

Ninguna materia publicada tiene un bloque mermaid: Proba no tiene ninguno, así que sus páginas se ven igual y no descargan la librería. No cambia ningún esquema ni ninguna versión de formato. Un bloque de código de otro lenguaje sigue mostrándose tal cual; lo único que cambia para todos es que las ligaduras tipográficas quedan apagadas en code y pre, que es lo que hace que -->, != y <- se lean literales.

## Gates

### `pnpm typecheck` — OK

Últimas líneas:

```

> sinapsis@0.1.0 typecheck .
> pnpm -r run typecheck

Scope: 5 of 6 workspace projects
packages/contract typecheck$ tsc --noEmit -p tsconfig.json
packages/contract typecheck: Done
packages/markdown typecheck$ tsc --noEmit -p tsconfig.json
packages/runtime typecheck$ tsc --noEmit -p tsconfig.json
packages/markdown typecheck: Done
packages/runtime typecheck: Done
apps/web typecheck$ tsc --noEmit -p tsconfig.json
packages/cli typecheck$ tsc --noEmit -p tsconfig.json
packages/cli typecheck: Done
apps/web typecheck: Done
```

### `pnpm test` — OK

Conteos (esto es lo que el orquestador vuelve a obtener en la rama):

- `packages/contract`: 44 passed (44)
- `packages/markdown`: 97 passed (97)
- `packages/runtime`: 178 passed (178)
- `apps/web`: 686 passed (686)
- `packages/cli`: 57 passed (57)

Últimas líneas:

```
… (276 líneas anteriores)
apps/web test:  Test Files  55 passed (55)
apps/web test:       Tests  686 passed (686)
apps/web test:    Start at  20:24:02
apps/web test:    Duration  8.61s (transform 2.22s, setup 0ms, collect 19.64s, tests 13.42s, environment 33.79s, prepare 5.16s)
apps/web test: Done
packages/cli test:  ✓ src/cli.test.ts (57 tests) 10467ms
packages/cli test:    ✓ sinapsis publish > compila la materia real de Proba y escribe un payload válido (--dry-run) 1361ms
packages/cli test:    ✓ sinapsis publish --no-pr > deja la materia en una rama nueva sin tocar el árbol ni la rama del usuario 895ms
packages/cli test:    ✓ sinapsis publish --no-pr > una segunda publicación sin cambios no crea ninguna rama 1105ms
packages/cli test:    ✓ sinapsis status > no reporta diferencias cuando el vault y lo publicado coinciden 859ms
packages/cli test:    ✓ sinapsis site build > --only compila una sola materia y no borra el resto de la salida 316ms
packages/cli test:    ✓ sinapsis propose > crea la rama, escribe la propuesta, anota el INBOX en main y vuelve a main 800ms
packages/cli test:    ✓ sinapsis propose > corre los gates y no crea nada si fallan 376ms
packages/cli test:    ✓ sinapsis propose > si el commit falla, la rama NO queda creada: el intento siguiente pasa (AC-15) 1007ms
packages/cli test:    ✓ sinapsis propose > dos propuestas abiertas a la vez no se pisan: dos ramas y dos filas en el INBOX 457ms
packages/cli test:  Test Files  1 passed (1)
packages/cli test:       Tests  57 passed (57)
packages/cli test:    Start at  20:24:02
packages/cli test:    Duration  11.53s (transform 433ms, setup 0ms, collect 654ms, tests 10.47s, environment 0ms, prepare 154ms)
packages/cli test: Done
```

### `pnpm build` — OK

Últimas líneas:

```
… (175 líneas anteriores)
apps/web build: dist/assets/chunk-TICWLB2K-fd3cSXDc.js                 49.39 kB │ gzip:  15.66 kB │ map:   153.09 kB
apps/web build: dist/assets/flowDiagram-HODETNUW-BSnez71L.js           62.71 kB │ gzip:  19.83 kB │ map:   195.61 kB
apps/web build: dist/assets/c4Diagram-7LVT6UL2-Ek4VNo7K.js             65.65 kB │ gzip:  18.71 kB │ map:   192.69 kB
apps/web build: dist/assets/ganttDiagram-EL5Y4UJY-CgYjCqrV.js          69.79 kB │ gzip:  23.37 kB │ map:   249.92 kB
apps/web build: dist/assets/index-CWg8wgDp.js                          74.48 kB │ gzip:  28.93 kB │ map:   332.89 kB
apps/web build: dist/assets/cose-bilkent-JH36ORCC-W_-jNTdv.js          81.81 kB │ gzip:  22.45 kB │ map:   305.64 kB
apps/web build: dist/assets/swimlanes-42K2YHIH-m4aN7Gyt.js            117.21 kB │ gzip:  42.54 kB │ map:   547.57 kB
apps/web build: dist/assets/sequenceDiagram-WJ2MYXX4-CrcOwMlT.js      117.55 kB │ gzip:  31.08 kB │ map:   352.12 kB
apps/web build: dist/assets/architectureDiagram-5GKGNRK7-BpY8MOcn.js  152.12 kB │ gzip:  42.96 kB │ map:   602.43 kB
apps/web build: (!) Some chunks are larger than 500 kB after minification. Consider:
apps/web build: - Using dynamic import() to code-split the application
apps/web build: - Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
apps/web build: - Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
apps/web build: dist/assets/Markdown-BSfYa06e.js                      187.09 kB │ gzip:  57.91 kB │ map: 1,143.42 kB
apps/web build: dist/assets/cytoscape.esm-Bch-eiPH.js                 443.89 kB │ gzip: 141.82 kB │ map: 1,871.17 kB
apps/web build: dist/assets/mermaid.core-DUskkCLd.js                  659.13 kB │ gzip: 158.99 kB │ map: 2,245.78 kB
apps/web build: dist/assets/cynefin-OW5HDTMX-KIMlqpfR.js              690.91 kB │ gzip: 154.63 kB │ map: 2,180.10 kB
apps/web build: dist/assets/index-BOinC6gx.js                         819.13 kB │ gzip: 255.00 kB │ map: 3,174.26 kB
apps/web build: ✓ built in 7.99s
apps/web build: Done
```

## Revisión

(la completa el orquestador con `/sinapsis-review`: veredicto, motivos, commit de merge)
