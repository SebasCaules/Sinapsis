---
fecha: 2026-09-06
materia: cripto
titulo: "Publicar los adjuntos de imagen del wiki"
rama: proposal/cripto-20260906-publicar-los-adjuntos-de-imagen-del-wiki
estado: abierta
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

**Veredicto:** cambios-pedidos
**Revisó:** orquestador de la plataforma · 2026-09-06
**Commit de merge:** no corresponde

### Gates en la rama
- `pnpm typecheck`: no corresponde (`--skip-gates`; se comprobó con `git diff --stat main...rama` que la rama no cambia código ejecutable: solo trae este archivo)
- `pnpm test`: no corresponde
- `pnpm build`: no corresponde
- `pnpm e2e`: no corresponde

### Hallazgos
1. **(alto)** La propuesta no trae implementación. El contrato 07 (§1 y §3.1, punto 3) pide que la materia implemente el cambio en una rama de la plataforma y pida revisión; esta rama solo trae el pedido. El motivo es válido y el problema es de la plataforma (el contrato 02 §11 lo lista como no soportado), así que no se rechaza: se pide la implementación, con la forma fijada abajo.
2. **(medio)** «Alcance» — lista `.claude/devoluciones/2026-09-06-sprint4-sitio-estatico.md` como archivo cambiado. Es un archivo sin seguimiento, ajeno a la propuesta, que estaba en el árbol de la plataforma al proponer; ni siquiera viajó en el commit. La sección tiene que decir lo que la rama trae de verdad.
3. **(bajo)** «Motivo» — dice «76 imágenes en 8 páginas»; en la rama `subject/cripto-20260906` son 76 referencias repartidas en 26 páginas (`grep -rl '](../../assets/' wiki`). Corregir el dato.

### Qué hace falta para aprobar
La plataforma fija la forma; la implementación viene en esta misma rama, con sus tests:

1. **Compilador** (`packages/markdown`): reconocer `![alt](ruta relativa)` cuyo destino resuelve dentro del vault (relativo a la página), con estas guardas: solo extensiones de imagen (`png`, `jpg`, `jpeg`, `gif`, `svg`, `webp`); sin rutas absolutas ni URLs; un `..` que salga de la raíz del vault se descarta con advertencia; un destino que no existe se deja como está y se avisa. Emitir la lista de adjuntos de la materia (archivo de origen → nombre estable con hash de contenido) como salida **opcional con default vacío**, para que Proba y cualquier materia sin imágenes compilen exactamente igual.
2. **`publish`** (`packages/cli`): copiar los adjuntos reconocidos a `subjects/<slug>/assets/<hash>.<ext>`, con un tope de tamaño por archivo y por materia decidido en la propuesta, documentado y con advertencia al superarlo.
3. **`site build`**: emitir los adjuntos bajo una ruta estable de la salida (`subjects/<slug>/assets/…`), como hoy hace con los bundles, respetando `BASE_URL`.
4. **Lector** (`apps/web`): reescribir el `src` relativo al renderizar (un plugin de remark que consulta el mapa de adjuntos de la página), **sin `rehype-raw`** y sin admitir `javascript:` ni `data:`. Una referencia que no está en el mapa se deja intacta.
5. **Contrato y decisiones**: `docs/contracts/02-paginas.md` §4 (si `Page` gana un campo: opcional y con default) y §11 (la fila de adjuntos); una fila `N0-nn` en `docs/DECISIONS.md` con el porqué y el costo de revertir; si cambia un esquema de `packages/contract`, campo opcional con default y tests que validen los `sinapsis.config.json` existentes.
6. **Gates** sin `--skip-gates`, y las secciones «Alcance» y «Compatibilidad» acordes con lo que la rama trae (Proba sigue publicando igual: sin imágenes, sin adjuntos).

### Efecto en las materias
- Ninguno hasta que la propuesta vuelva con la implementación. Mientras tanto Cripto se publica con las imágenes rotas, que es la limitación vigente del contrato 02 §11.
