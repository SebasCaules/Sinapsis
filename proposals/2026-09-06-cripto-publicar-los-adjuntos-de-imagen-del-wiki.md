---
fecha: 2026-09-06
materia: cripto
titulo: "Publicar los adjuntos de imagen del wiki"
rama: proposal/cripto-20260906-publicar-los-adjuntos-de-imagen-del-wiki
estado: cambios-pedidos
pr: https://github.com/SebasCaules/Sinapsis/pull/2
---

## Motivo

El wiki de Criptografía y Seguridad trae **76 referencias de imagen repartidas en 26 páginas**, que resuelven a **50 archivos distintos** (6,7 MB en total), y hoy no hay forma de publicarlas.

Qué son. No son decoración: son los diagramas que la cátedra usa para explicar y que el texto no reemplaza. La red de Feistel de DES y su función f, el esquema de una ronda de AES, los cinco modos de encadenamiento (ECB, CBC, CFB, OFB, CTR), la construcción de Merkle-Damgård, GCM, el record de TLS, el ciclo de modelado de amenazas, y las resoluciones manuscritas de las Guías 1 y 2, que son literalmente la respuesta a un ejercicio fotografiada.

Qué pasa hoy. El contrato 02 §11 dice que los adjuntos del vault no se publican porque `Page` solo tiene texto. Las 26 páginas se publican con el ícono de imagen rota: el markdown `![](../../assets/clase02-des-feistel.png)` llega crudo al lector y su `src` relativo se resuelve contra la ruta de la SPA, que no existe. Verificado en el navegador: el pedido devuelve el HTML de la SPA con `content-type: text/html` y la imagen no carga.

Por qué no se resuelve en la materia. Las tres salidas que tenemos son peores que el problema:

1. Borrar las imágenes del wiki. Rompe el vault en Obsidian, que es donde se estudia, para arreglar la copia publicada. La materia produce contenido; que ese contenido pierda sus figuras al publicarse no es una decisión de la materia.
2. Meterlas en un bundle de `tools/`. El contrato 04 admite assets sueltos, pero la URL de un archivo de bundle es `BASE_URL + ToolInfo.base + '/' + path`, y `BASE_URL` vale `/` en desarrollo y `/Sinapsis/` en producción. Una ruta escrita a mano en el cuerpo markdown no puede ser correcta en los dos entornos a la vez. Además convertiría un diagrama estático en una herramienta, que no es lo que es.
3. Alojarlas afuera y enlazarlas por URL absoluta. Le pone al material de la cátedra una dependencia de un tercero y una URL que se puede caer.

Qué se pide, y qué trae esta rama. Un mecanismo común para los adjuntos de imagen de un wiki, con la forma que fijó la revisión: el compilador los reconoce, `publish` los copia a `subjects/<slug>/assets/`, `site build` los emite bajo una ruta estable y el lector reescribe el `src` al renderizar. `![alt](ruta)` ya es sintaxis estándar y es lo que Obsidian escribe solo al pegar una imagen: no hace falta tocar el markdown ni declarar nada en el config.

## Alcance

Archivos cambiados en la rama:

**Contrato** (`packages/contract`)

- `src/index.ts` — modificado. `PageAsset` (`ref` → `file`) y `Page.assets`, **opcional con default `[]`**. `PageMeta` lo omite junto con `body`, `links` y `headings`: los adjuntos viajan con el cuerpo, no en los listados.
- `src/site.ts` — modificado. `SITE_ASSETS_DIR`, `sitePaths.asset`, `siteAssetBase(slug)` y `SitePageBody.assets`, también con default `[]`.
- `src/site.test.ts` — modificado. Cuatro casos: `Page` sin `assets` nace vacío, un `pages.json` anterior a los adjuntos sigue validando, `PageMeta` no los lleva, y la base es relativa al sitio.

**Compilador** (`packages/markdown`)

- `src/assets.ts` — **nuevo**. `imageRefs` (saltea bloques y código en línea), `isLocalImageRef` (rechaza URLs, `data:`, `javascript:`, rutas absolutas y lo que no sea imagen), `assetFileName` (sha256 del contenido, 16 caracteres, más la extensión), `resolvePageAssets`, `capAssets`, `readAssetIndex` y los topes.
- `src/compile.ts` — modificado. Tres `IssueKind` nuevos (`asset-missing`, `asset-outside`, `asset-too-big`), la resolución de adjuntos dentro de `compileWiki` y `CompileWikiResult.assets`.
- `src/index.ts` — modificado. Reexporta la superficie de `assets.ts`.
- `src/assets.test.ts` — **nuevo**. 16 casos, incluida la equivalencia entre compilar el vault y compilar la copia publicada.

**CLI** (`packages/cli`)

- `src/commands/publish.ts` — modificado. Copia los adjuntos a `subjects/<slug>/assets/<hash>.<ext>`, escribe el índice, y los cuenta en la salida, en el commit y en el cuerpo del PR.
- `src/commands/site.ts` — modificado. Emite los adjuntos bajo `<out>/<slug>/assets/` y los guarda en `SitePageBody.assets`.

**Lector** (`apps/web`)

- `src/features/subject/markdown/remarkAssets.ts` — **nuevo**. Reescribe el `url` del nodo `image`; sin `rehype-raw`, sin `data:` ni `javascript:`, y solo para las referencias que están en el mapa.
- `src/features/subject/markdown/remarkAssets.test.tsx` — **nuevo**. 6 casos.
- `src/features/subject/markdown/Markdown.tsx` — modificado. Prop `assets`, opcional.
- `src/features/subject/views/ReaderView.tsx`, `src/local/client.ts` — modificados. Llevan los adjuntos de `pages.json` al lector.
- `src/features/subject/mocks/proba-fixture.ts`, `src/local/client.test.ts`, `src/features/subject/views/ReaderView.resize.test.tsx`, `src/features/subject/views/ReaderView.strip.test.tsx` — modificados. Los fixtures tipados con la salida del esquema necesitan el campo; los datos JSON no (para eso está el default).

**Documentación**

- `docs/contracts/02-paginas.md` — modificado. §4 (`Page.assets`), §10 bis nueva (qué se reconoce, cómo viaja, las tres advertencias) y §11 (la fila de adjuntos ahora dice qué NO se publica: lo que no es imagen).
- `docs/contracts/05-publicacion-y-sitio.md` — modificado. §1.1 (qué copia `publish`) y §2.1 (los archivos del sitio).

**Contrato afectado: `packages/contract`.** Los dos campos nuevos son **opcionales con default**, así que no hace falta subir `contract` ni `SITE_FORMAT`. La fila `N0-nn` la escribe el orquestador al aprobar; el texto propuesto está abajo.

## Texto para la fila de `docs/DECISIONS.md`

**Qué se decide.** El wiki de una materia puede traer imágenes locales y la plataforma las publica. El compilador reconoce `![alt](ruta relativa)` dentro de la carpeta de la materia, le da a cada archivo un nombre estable con el hash de su contenido, `publish` los copia a `subjects/<slug>/assets/` con un índice, `site build` los emite bajo esa misma ruta y el lector reescribe el `src`. Solo imágenes (`png`, `jpg`, `jpeg`, `gif`, `svg`, `webp`), solo dentro de la materia, 2 MB por archivo y 25 MB por materia.

**Por qué.** Era el único material de una materia que la plataforma no sabía llevar, y el que menos se puede reemplazar con texto: un diagrama de Feistel o una resolución manuscrita no tienen equivalente en prosa. Las alternativas dentro de la materia eran romper el vault en Obsidian, disfrazar un diagrama de herramienta, o depender de un tercero. El hash como nombre resuelve tres cosas a la vez: nombres de archivo con espacios y acentos que no sirven como URL, el mismo archivo referenciado desde varias páginas, y el cacheado del sitio estático.

**Costo de revertir.** Bajo. Los dos campos son opcionales con default: quitarlos deja de emitirlos y las páginas vuelven a publicarse con la imagen rota, sin romper ningún archivo del sitio ya escrito. Lo que sí se pierde es la carpeta `assets/` de cada materia publicada, que hay que volver a generar con un `publish`. Nada del estado personal del usuario depende de esto.

## Compatibilidad

- **Proba se publica exactamente igual.** No tiene una sola imagen en `wiki/`: `compileWiki` devuelve `assets: []`, `publish` no crea la carpeta `assets/` y `site build` no emite nada nuevo. Verificado con `pnpm build:subjects` sobre las dos materias del repositorio.
- **Los archivos del sitio ya escritos siguen validando.** `SitePageBody.assets` tiene default `[]`, así que un `pages.json` de antes de este cambio valida sin tocarlo. Hay un test que lo fija.
- **No sube ninguna versión de formato.** Ni `contract`, ni `SITE_FORMAT`, ni `BACKUP_FORMAT`: los dos campos son aditivos con default, que es el caso compatible del contrato 00 §4.1.
- **El estado personal no se toca.** Los adjuntos no tienen id de usuario ni entran en el repaso, los favoritos o el progreso.
- **Una materia que ya usa `![]()` con una URL absoluta no cambia**: el compilador no la reconoce como adjunto y el lector la deja pasar igual que antes.

## Gates

Corridos sobre la rama, sin `--skip-gates`.

### `pnpm typecheck` — OK

```
packages/contract typecheck: Done
packages/markdown typecheck: Done
packages/runtime typecheck: Done
packages/cli typecheck: Done
apps/web typecheck: Done
```

### `pnpm test` — OK

Conteos:

- `packages/contract test`: 48 passed (48)
- `packages/markdown test`: 113 passed (113)
- `packages/runtime test`: 178 passed (178)
- `apps/web test`: 687 passed (687)
- `packages/cli test`: 57 passed (57)

De esos, nuevos en esta rama: 16 en `packages/markdown/src/assets.test.ts`, 6 en `apps/web/src/features/subject/markdown/remarkAssets.test.tsx` y 4 en `packages/contract/src/site.test.ts`.

### `pnpm build` — OK

```
apps/web build: ✓ built in 2.09s
apps/web build: Done
```

## Respuesta a la revisión

| Hallazgo | Qué se hizo |
|---|---|
| **(alto)** La propuesta no traía implementación | Implementada en esta misma rama, con la forma que fijó la revisión: compilador, `publish`, `site build`, lector, contrato y documentación, cada uno con sus tests. El detalle está en «Alcance». |
| **(medio)** «Alcance» listaba un archivo ajeno | Reescrito. El archivo era `.claude/devoluciones/…`, un archivo local sin seguimiento que estaba en el árbol de la plataforma al proponer; se sacó de la rama y ahora está en `.git/info/exclude` para que no se cuele otra vez. |
| **(bajo)** «Motivo» decía 8 páginas | Corregido: 76 referencias en 26 páginas, que resuelven a 50 archivos distintos. |

Sobre los seis puntos de «Qué hace falta para aprobar»:

1. **Compilador.** `resolvePageAssets` resuelve la referencia contra la carpeta de la página y exige que caiga dentro de la carpeta del **config** —no del wiki—, porque es ahí donde un vault de Obsidian guarda sus adjuntos (`../../assets/x.png`). Extensiones cerradas, sin rutas absolutas ni URLs, `..` que sale → `asset-outside`, destino inexistente → `asset-missing` y la referencia queda intacta. `CompileWikiResult.assets` es la lista de adjuntos, vacía por default.
2. **`publish`.** Copia a `subjects/<slug>/assets/<hash>.<ext>`. Topes: 2 MB por archivo (`MAX_ASSET_BYTES`) y 25 MB por materia (`MAX_SUBJECT_ASSET_BYTES`), documentados en el contrato 02 §10 bis, con advertencia `asset-too-big` y sin publicar lo que no entra.
3. **`site build`.** Emite bajo `<out>/<slug>/assets/`, al lado de los bundles, y la ruta se compone con `sitePaths.asset(base, …)`, que respeta `BASE_URL`.
4. **Lector.** `remarkAssets` reescribe el `url` del nodo `image` del árbol de remark. Sin `rehype-raw`, sin `data:` ni `javascript:`, y una referencia que no está en el mapa se deja intacta. Hay un test por cada una de esas tres reglas.
5. **Contrato.** `docs/contracts/02-paginas.md` §4 y §10 bis, y `05-publicacion-y-sitio.md`. Los campos nuevos son opcionales con default y hay tests que fijan que lo ya publicado sigue validando. El texto de la fila `N0-nn` está arriba.
6. **Gates** corridos sin `--skip-gates`, y «Alcance» y «Compatibilidad» reescritas.

**Un detalle de diseño que la revisión no pedía pero que hacía falta.** `site build` compila desde `subjects/<slug>/`, donde los archivos ya no se llaman como en el vault: la referencia dice `../../assets/x.png` y el archivo es `<hash>.png`. Para que la copia publicada compile al mismo resultado, `publish` deja `subjects/<slug>/assets/assets.json`, un índice `ruta del vault → nombre publicado` que el compilador usa cuando existe. Sin él, `site build` habría emitido `assets: []` y las imágenes seguirían rotas en el sitio aunque los archivos estuvieran copiados. Está probado con el caso «la copia publicada da el mismo resultado leyendo el índice».

## Revisión

**Veredicto:** cambios-pedidos (segunda vuelta)
**Revisó:** orquestador de la plataforma · 2026-09-06
**Commit de merge:** no corresponde

### Gates en la rama
- `pnpm typecheck`: OK
- `pnpm test`: OK — contract 48, markdown 113, runtime 178, web 687, cli 55 + 2 omitidas (57; las omitidas exigen `packages/cli/dist`, que el worktree no tiene). Coinciden con la propuesta.
- `pnpm build`: OK
- `pnpm build:subjects`: OK. Cripto pasa a emitir **76 advertencias `asset-missing`** porque la copia publicada en `main` todavía no trae `assets/`: desaparecen con el primer `publish` posterior al merge. Proba, igual que antes.
- `pnpm e2e`: 93 pasadas, 3 omitidas, 1 falla **preexistente en `main`**: `landing.spec.ts:47` («agrupa las materias por cuatrimestre») compara la lista exacta de cuatrimestres y asume una sola materia; falla igual en las otras dos ramas abiertas y en `main` desde que entró Cripto (2026-2C). No es de esta propuesta.

### Hallazgos
1. **(alto)** `packages/markdown/src/assets.ts:56-62` y `:183-185`, `packages/cli/src/commands/site.ts:147` — el nombre publicado que llega por `assets/assets.json` **no se valida**. `isAssetIndex` solo exige que los valores sean cadenas no vacías, y `resolvePageAssets` arma `source = rootDir/assets/<named>` con ese valor tal cual. Un `assets.json` de una materia con `"assets/x.png": "../../../../algo"` hace que `site build` lea ese archivo desde fuera de la materia y lo copie con `copyFile(asset.source, path.join(assetsDir, asset.file))`, también fuera de `assets/` (site.ts no usa `resolveInside`, que sí usa `publish.ts:340`). Como `site build` corre en el CI de cada PR y en el despliegue, es lectura y escritura de archivos arbitrarios del runner desde un dato de la materia. El lector no se ve afectado (`isSafeFile` en `remarkAssets.ts` lo descarta), pero el compilador y el CLI sí. Hace falta: (a) que `isAssetIndex` o `resolvePageAssets` acepten solo nombres con la forma `^[0-9a-f]{16}\.(png|jpg|jpeg|gif|webp)$` (la que produce `assetFileName`) y descarten el resto con `asset-missing`; (b) que `site.ts` contenga el destino con `resolveInside`, como hace `publish.ts`; (c) un test por cada guarda con un índice malicioso (`..`, barra, `javascript:`).
2. **(medio)** `packages/markdown/src/assets.ts:29` — `svg` en `IMAGE_EXTENSIONS`. Un SVG se publica tal cual en el **mismo origen** del sitio (`sebascaules.github.io`), y un SVG puede llevar `<script>` y manejadores de evento: abierto por su URL, ejecuta con acceso al estado personal de la plataforma (`localStorage` e IndexedDB). Servido en un `<img>` no ejecuta, pero la URL es pública. Cripto no usa ningún SVG (sus 57 archivos son PNG). Hace falta sacar `svg` de la lista, o sanearlo al publicar con un sanitizador documentado y probado (sin `<script>`, sin `on*`, sin `href` a `javascript:`), y decir en el contrato 02 §10 bis cuál de las dos.
3. **(bajo)** Los comentarios del código y las secciones del contrato citan la decisión como **N0-61**, que ya existe (progreso por pasos de los bundles). El número lo asigna el orquestador al aprobar: escriba `N0-nn` en código y documentos y el orquestador lo reemplaza al mergear.
4. **(bajo)** `packages/markdown/src/compile.ts` — la advertencia `asset-too-big` por tope de materia usa `page: asset.ref` (una ruta de archivo) donde las demás llevan el slug de la página: se lee «adjunto demasiado grande en "assets/x.png"». Preferible listar las páginas que lo referencian, o anteponer «archivo».

Lo demás pasa las siete lentes: la contención de la referencia (`..` fuera de la carpeta del config → `asset-outside`) está bien y probada; URLs, `data:`, `javascript:` y rutas absolutas se rechazan; los campos del contrato son opcionales con default y hay tests de compatibilidad; Proba compila igual; sin `rehype-raw`; español neutro. La respuesta a la primera revisión está completa y el índice `assets.json` está bien justificado.

### Efecto en las materias
- Cuando se apruebe, Cripto tiene que volver a publicar (`/sinapsis publish`) para que `subjects/cripto/assets/` exista y las 76 advertencias desaparezcan.

### Revisión anterior

Primera vuelta (2026-09-06): cambios pedidos por falta de implementación, «Alcance» con un archivo ajeno y el conteo de páginas. Los tres puntos están respondidos en «Respuesta a la revisión»; los dos primeros hallazgos de esta vuelta son nuevos, sobre la implementación.
