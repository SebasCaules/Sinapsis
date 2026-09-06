# 05 · Sync y API — el protocolo HTTP

Todo lo que viaja entre una materia y la plataforma pasa por este protocolo. Hay dos
clientes muy distintos: el **CLI de la materia**, que publica con un token, y la **web**, que
lee con la sesión del usuario.

Prefijo de todas las rutas: `API_PREFIX` = `/api`.

---

## 1. `SyncPayload` — lo que publica una materia

```ts
SyncPayload = {
  config:      SubjectConfig,   // obligatorio — ver 01-materia.md
  pages:       Page[],          // obligatorio, ≤ 20000 — ver 02-paginas.md
  study?:      StudyContent,    // opcional — ver 03-estudio.md
  generatedAt: string,          // obligatorio, texto libre (el CLI manda un ISO)
  generator?:  string,          // opcional, ≤ 80 ("@sinapsis/cli 0.1.0")
}
```

```
PUT /api/subjects/:slug/sync
Authorization: Bearer <SYNC_TOKEN>
Content-Type: application/json

→ 200  SyncResult = { subject, pages, created, updated, deleted, warnings: string[] }
```

| Campo de `SyncResult` | Qué cuenta |
|---|---|
| `subject` | El slug de la materia. |
| `pages` | Páginas que venían en el payload. |
| `created` | Páginas nuevas. |
| `updated` | Páginas cuyo contenido cambió. |
| `deleted` | Páginas que estaban y ya no vienen. |
| `warnings` | Advertencias del API (no del compilador), hasta 120 líneas; el resto se resume en `…y N advertencia(s) más`. |

### 1.1 Reglas del sync

1. **El slug de la URL manda.** Si `config.slug` no coincide, `400` con
   `El slug de la URL ("a") no coincide con el del config ("b")`.
2. **Ninguna página repetida.** Un slug duplicado en `pages` es `400`:
   `La página "<slug>" viene repetida en el payload`.
3. **Reemplazo total de páginas.** El conjunto de páginas de la materia pasa a ser
   exactamente el del payload: **lo que no viene, se borra**.
4. **Idempotente.** Un sync que no cambia nada no escribe nada: ni `pages`, ni `page_links`,
   ni el índice de búsqueda. La comparación es por huella (`sha1` de los campos que se
   guardan).
5. **Transaccional.** Todo el sync corre en una transacción: o queda entero, o no queda nada.
6. **La materia se crea o se actualiza.** Si el slug no existía, se crea; si existía como
   *placeholder* (creada a mano desde la landing, sin config), deja de serlo. Se guardan
   `name`, `code`, `institution`, `color`, `semester`, la nomenclatura de división, el config
   completo y `lastSyncAt`.
7. **El material de estudio se reemplaza entero cuando viene.** Un payload **sin** `study`
   (CLI anterior al Sprint 2) deja el que ya estaba guardado. El CLI actual manda `study`
   siempre, aunque esté vacío: por eso borrar la carpeta `estudio/` lo borra de la
   plataforma.
8. **No toca los bundles de herramientas.** `subject_tools` tiene su propio ciclo de vida
   (ver `04-herramientas-y-figuras.md`): un sync no puede dejar a la materia sin herramientas.
9. **Los enlaces se recalculan** solo si cambió alguna página: se vacía `page_links` y se
   vuelven a insertar las aristas cuyo destino existe en la misma materia, sin auto-enlaces y
   deduplicadas por par.

### 1.2 Qué sobrevive a un borrado

El estado del usuario se guarda por slug o por id, en tablas propias, y **no se borra con la
página**: progreso, favoritos, apuntes, repaso espaciado, tareas hechas e intentos de quiz.
Si el slug o el id vuelve, la marca sigue ahí. Lo que sí desaparece de la lectura es el
repaso espaciado de tarjetas que ya no existen: la fila queda, pero no viaja en
`StudyState.srs`.

### 1.3 Advertencias que devuelve el API

Se calculan sobre el payload recibido, en paralelo a las del compilador:

| Advertencia | Causa |
|---|---|
| `página "<slug>": la división "<key>" no está declarada en el config` | `Page.division` fuera de `config.divisions` (y distinta de `meta`). |
| `página "<slug>": el tipo "<key>" no está declarado en pageTypes` | `Page.type` fuera de `config.pageTypes` (y distinto de `meta`). |
| `mazo "<id>": la tarjeta "<id>" cita la página "<slug>", que no existe` | `Card.page` roto. |
| `quiz "<id>": la pregunta "<id>" cita la página "<slug>", que no existe` | `QuizQuestion.page` roto. |
| `kit "<id>": la página "<slug>" no existe` / `el mazo "<id>" no existe` / `el quiz "<id>" no existe` | Referencias rotas de un kit. |
| `plan · tarea "<id>": la división "<key>" no está declarada en el config` | Tarea `read` rota. |
| `plan · tarea "<id>": el mazo "<id>" no existe` / `el quiz "<id>" no existe` | Tareas `cards` / `quiz` rotas. |

> El API recorre **solo `plan.phases`**, no `plan.tracks`: una tarea rota que exista únicamente
> en una modalidad alternativa la ve el compilador, no el API. Tampoco revisa las tareas
> `kind: "tool"` ni los `kit.tools` (esos los verifica el compilador contra el rail del config).

---

## 2. Autenticación

Hay **dos** mecanismos y no se mezclan.

### 2.1 `SYNC_TOKEN` — lo que publica una materia

```
Authorization: Bearer <SYNC_TOKEN>
```

- Es un token estático del `.env` del API (N0-7). El mismo para todas las materias.
- Se compara en **tiempo constante**.
- Sin él o con uno distinto: `401` con `{ "error": "Token de sincronización inválido" }`.
- Es la puerta de **todo lo que publica una materia**: el sync del wiki y el push y el borrado
  de bundles de herramientas. Nada más.
- El CLI lo toma de `--token`, `SINAPSIS_TOKEN` o `SYNC_TOKEN`, en ese orden.

### 2.2 Cookie de sesión — lo que lee la web

- Cookie `sinapsis_sid`, **firmada** con `SESSION_SECRET`, `httpOnly`, `SameSite=Lax`,
  `path=/`, `Secure` en producción (o con `COOKIE_SECURE=1`), 30 días de vida.
- La fila vive en la tabla `sessions`; una sesión vencida se borra al resolverla.
- Se obtiene con `POST /api/auth/google` (ID token de Google Identity Services verificado en
  el servidor, N0-4) o, solo en desarrollo, con `POST /api/auth/dev` (N0-5).
- Sin sesión válida: `401` con `{ "error": "Sesión requerida" }`.
- **Cualquier usuario autenticado puede abrir cualquier materia sincronizada**, esté o no en
  su landing (N0-6). Lo que es por usuario es la landing y el progreso, no el acceso.

### 2.3 CSRF — origen y tipo de contenido (N0-17)

Se aplica a **`POST`, `PUT`, `PATCH` y `DELETE`** sobre `/api/*`:

1. Si el pedido trae `Origin` (y no es `"null"`), su host tiene que coincidir con el `Host`
   del pedido, con `X-Forwarded-Host`, o el origen entero tiene que estar en
   `ALLOWED_ORIGINS`. Si no: `403` con `Origen no permitido`.
2. Si declara `Content-Type`, tiene que ser `application/json`; si no: `415` con
   `El cuerpo debe enviarse como application/json`.
3. Si declara cuerpo (`Content-Length` distinto de `0`, o `Transfer-Encoding`) y **no** trae
   `Content-Type`: `415` con `Falta el encabezado content-type: application/json`.

Un formulario HTML de otro sitio solo puede enviar `form-urlencoded`, `multipart` o
`text/plain`, así que la regla 2 alcanza para frenarlo. Los métodos sin cuerpo (logout,
`DELETE`, `POST /api/auth/dev`) no declaran `Content-Type` y pasan.

En desarrollo y en E2E no hace falta listar los puertos de Vite: el proxy reenvía el `Host`
del navegador, así que el `Origin` coincide con el `Host` del pedido.

### 2.4 Tope de cuerpo

50 MB para todo `/api/*` (`MAX_BODY_BYTES`). Superarlo es `413` con
`El cuerpo del pedido supera los 50 MB`. El tope de un bundle es aparte y más chico: 20 MB.

---

## 3. Todas las rutas

Leyenda de la columna **Auth**: `—` sin autenticación · `sesión` cookie · `token`
`Authorization: Bearer <SYNC_TOKEN>` · `dev` solo con `AUTH_DEV_BYPASS=1` y
`NODE_ENV != production`.

### 3.1 Salud y configuración

| Método y ruta | Auth | Cuerpo | Respuesta |
|---|---|---|---|
| `GET /api/health` | — | — | `200 { ok: true }` |
| `GET /api/config` | — | — | `200 { googleClientId: string \| null, devBypass: boolean }` |

### 3.2 Sesión

| Método y ruta | Auth | Cuerpo | Respuesta |
|---|---|---|---|
| `POST /api/auth/google` | — | `{ credential: string }` | `200 User` · `400` cuerpo inválido (`Cuerpo inválido — …`) · `401 El token de Google no es válido` · `503 El inicio de sesión con Google no está configurado en este servidor` |
| `POST /api/auth/dev` | dev | — | `200 User` · `404 Ruta no encontrada` fuera de desarrollo |
| `POST /api/auth/logout` | — | — | `204` (borra la cookie; inocuo sin sesión) |
| `GET /api/me` | sesión | — | `200 User` |
| `PATCH /api/me` | sesión | `{ theme: "pergamino" \| "laurel" \| "claustro" }` | `200 User` · `400 Tema inválido — …` |

`User = { id, email, name, picture: string | null, theme }`.

### 3.3 Landing

| Método y ruta | Auth | Cuerpo | Respuesta |
|---|---|---|---|
| `GET /api/landing` | sesión | — | `200 SubjectCard[]` (cuatrimestre descendente, después `position`, después nombre) |
| `GET /api/landing/semesters` | sesión | — | `200 string[]` — los cuatrimestres del usuario en su orden, **incluidos los vacíos** |
| `PUT /api/landing` | sesión | `LandingLayoutInput` | `200 SubjectCard[]` · `400 Disposición inválida — …` |
| `POST /api/subjects` | sesión | `CreateSubjectInput` | `201 SubjectCard` · `400 Materia inválida — …` · `409 La materia "<slug>" ya está en tu landing` |
| `DELETE /api/subjects/:slug/landing` | sesión | — | `204` (quita de la landing; **no** borra la materia ni el progreso) · `404 La materia no existe` |

- `LandingLayoutInput = { items: Array<{ slug, semester, position }>, semesters?: string[] }`.
  Los slugs que no existen o que no están en la landing del usuario **se ignoran en
  silencio**: la disposición es del usuario, no un alta. `semesters` ausente deja los
  cuatrimestres guardados como estaban.
- Los rótulos de cuatrimestre se guardan en forma canónica (`2026-1c` → `2026-1C`, N0-32).
- `SubjectCard = { slug, name, code, institution, color, division, divisionsCount,
  pagesCount, studiedCount, semester, position, placeholder, lastSyncAt, dueCount }`.
- `CreateSubjectInput = { slug, name, code, institution, semester, color?, division }`. Si el
  slug ya existe como materia, **no se crea otra**: se suma a la landing de este usuario
  (N0-6).

### 3.4 Materia y páginas

| Método y ruta | Auth | Cuerpo | Respuesta |
|---|---|---|---|
| `GET /api/subjects/:slug` | sesión | — | `200 SubjectDetail` · `404 La materia no existe` |
| `GET /api/subjects/:slug/pages/:page` | sesión | — | `200 PageDetail` · `404 La página no existe` |
| `GET /api/subjects/:slug/search?q=<texto>` | sesión | — | `200 SearchHit[]` (hasta 20) |
| `GET /api/subjects/:slug/graph` | sesión | — | `200 GraphData` |
| `PUT /api/subjects/:slug/progress/:page` | sesión | — | `204` · `404 La página no existe` |
| `DELETE /api/subjects/:slug/progress/:page` | sesión | — | `204` (idempotente) |

- `SubjectDetail = { config: SubjectConfigLoose, pages: PageMeta[], studied: Slug[],
  placeholder: boolean, lastSyncAt: string | null }`. `studied` viene ordenado de más viejo a
  más nuevo. `SubjectConfigLoose` admite `divisions` y `pageTypes` vacíos: es lo que devuelve
  una materia *placeholder* que todavía no recibió ningún sync.
- `PageDetail = { page: Page, backlinks: PageMeta[], studied: boolean }`. Los backlinks salen
  de `page_links` (solo enlaces cuyo destino existe) y vienen ordenados por título.
- `SearchHit = { slug, title, type, division, snippet }`. Índice FTS5 sobre título, resumen y
  cuerpo; el `snippet` sale del cuerpo y, si no hay, del resumen. Las páginas de tipos con
  `countsAsContent: false` pesan menos en el ranking. Una consulta sin letras ni dígitos
  devuelve una lista vacía.
- `GraphData = { nodes: GraphNode[], edges: GraphEdge[] }` con
  `GraphNode = { slug, title, type, division, words, inDegree, outDegree }` y
  `GraphEdge = { from, to }`. `division` es la **efectiva** (`divisionOf`), para que los
  filtros del grafo coincidan con los del índice (N0-23). Los nodos incluyen las fuentes.

### 3.5 Estudio

| Método y ruta | Auth | Cuerpo | Respuesta |
|---|---|---|---|
| `GET /api/subjects/:slug/study` | sesión | — | `200 StudyContent` (autoral + mazos automáticos al final de `decks`) |
| `GET /api/subjects/:slug/study/state` | sesión | — | `200 StudyState` |
| `POST /api/subjects/:slug/study/srs/:cardId` | sesión | `{ grade: 1 \| 2 \| 3 \| 4 }` | `200 SrsState` · `400 Nota inválida — …` · `400 El id de la tarjeta no tiene un formato válido` |
| `DELETE /api/subjects/:slug/study/srs/:cardId` | sesión | — | `204` (reinicia esa tarjeta; idempotente) |
| `PUT /api/subjects/:slug/bookmarks/:page` | sesión | — | `204` · `404 La página no existe` |
| `DELETE /api/subjects/:slug/bookmarks/:page` | sesión | — | `204` (idempotente) |
| `PUT /api/subjects/:slug/notes/:page` | sesión | `{ body: string }` (≤ 50000) | `200 Note` · `400 Apunte inválido — …` · `404 La página no existe` |
| `DELETE /api/subjects/:slug/notes/:page` | sesión | — | `204` (idempotente) |
| `PUT /api/subjects/:slug/tasks/:taskId` | sesión | — | `204` · `400 El id de la tarea no tiene un formato válido` |
| `DELETE /api/subjects/:slug/tasks/:taskId` | sesión | — | `204` (idempotente) |
| `DELETE /api/subjects/:slug/tasks` | sesión | — | `204` («Reiniciar el plan»: destilda todas las tareas de la materia; idempotente) |
| `PUT /api/subjects/:slug/study/plan-dates/:key` | sesión | `{ date: "AAAA-MM-DD" }` | `204` (upsert) · `400 Fecha inválida — …` · `400 El id de la instancia no tiene un formato válido` |
| `DELETE /api/subjects/:slug/study/plan-dates/:key` | sesión | — | `204` (idempotente) |
| `DELETE /api/subjects/:slug/study/plan-dates` | sesión | — | `204` («Borrar fechas»: todas las de la materia; idempotente) |
| `POST /api/subjects/:slug/quiz/:quizId/attempts` | sesión | `{ score, total }` con `score ≤ total` | `201 QuizAttempt` · `400 Intento inválido — …` |

- Los ids de la URL (`:cardId`, `:taskId`, `:quizId`, `:key`) se validan con `StudyId`
  (`^[a-z0-9][a-z0-9._:-]*$`, ≤ 160).
- Las fechas de las instancias evaluatorias del plan (`Plan.instances[].key` → `AAAA-MM-DD`)
  vuelven en `StudyState.planDates` y viven en la cuenta, no en el navegador. Son
  **independientes del progreso**: «Reiniciar el plan» (`DELETE …/tasks`) no las toca, y
  «Borrar fechas» (`DELETE …/study/plan-dates`) no toca las tareas. Como la clave tampoco se
  valida contra el material, una instancia que hoy no está en el plan conserva su fecha si
  vuelve en un sync posterior.
- Nada de este estado exige que la tarjeta, la tarea o el quiz existan en el material: los
  mazos automáticos se calculan al vuelo y el material autoral vive dentro de un JSON. Lo
  único que se valida contra la base son los slugs de página (favoritos y apuntes).
- `GET .../study/state` recorta el repaso espaciado al material vigente: una tarjeta borrada
  conserva su fila pero no viaja.

### 3.6 Herramientas

| Método y ruta | Auth | Cuerpo | Respuesta |
|---|---|---|---|
| `PUT /api/subjects/:slug/tools/:id` | **token** | `ToolPush` | `201 ToolInfo` la primera vez, `200 ToolInfo` al reemplazar · `400` (id cruzado, archivo faltante, ruta inválida, base64 inválido) · `404 La materia no existe` · `413 El bundle supera el tope de 20 MB` |
| `DELETE /api/subjects/:slug/tools/:id` | **token** | — | `204` (idempotente: también si no existía) |
| `GET /api/subjects/:slug/tools` | sesión | — | `200 ToolInfo[]` ordenado por id |
| `GET /api/subjects/:slug/tools/:id/files/*` | sesión | — | `200` con el archivo (`Content-Type` por extensión, `ETag`, `Cache-Control: private, max-age=0, must-revalidate`, `X-Content-Type-Options: nosniff`) · `304` si el `If-None-Match` coincide · `404 El archivo no existe` |

Un `:id` que no cumpla el formato del manifiesto (`^[a-z][a-z0-9_-]*$`, ≤ 48) devuelve
`404 La herramienta no existe`. Detalle completo en `04-herramientas-y-figuras.md`.

---

## 4. Errores: formato y códigos

**Todas** las respuestas de error tienen la misma forma:

```json
{ "error": "<texto en español>" }
```

El cliente la lee con `errorMessageFromBody(body, status, statusText)` del contrato: si el
cuerpo trae un `error` de tipo texto, lo devuelve; si no, `HTTP <status> <statusText>`. Es el
único lugar donde se decide qué mensaje ve el usuario ante un fallo del API.

| Código | Cuándo |
|---|---|
| `400` | Cuerpo que no es JSON (`El cuerpo no es JSON válido`); cuerpo que no cumple el esquema (`<prefijo> — <campo>: <motivo>; …`, hasta 8 issues); reglas del protocolo (slug cruzado, página repetida, id de manifiesto cruzado, id de estudio mal formado). |
| `401` | `Sesión requerida` · `Token de sincronización inválido` · `El token de Google no es válido`. |
| `403` | `Origen no permitido` (guard CSRF). |
| `404` | `Ruta no encontrada` · `La materia no existe` · `La página no existe` · `La herramienta no existe` · `El archivo no existe`. |
| `409` | `La materia "<slug>" ya está en tu landing`. |
| `413` | `El cuerpo del pedido supera los 50 MB` · `El bundle supera el tope de 20 MB`. |
| `415` | `El cuerpo debe enviarse como application/json` · `Falta el encabezado content-type: application/json`. |
| `503` | `El inicio de sesión con Google no está configurado en este servidor`. |
| `500` | `Error interno del servidor` (cualquier otra cosa; el detalle queda en el log del servidor, nunca en la respuesta). |

Prefijos del `400` de esquema, por ruta: `Payload de sync inválido`, `Bundle inválido`,
`Materia inválida`, `Disposición inválida`, `Nota inválida`, `Apunte inválido`,
`Intento inválido`, `Tema inválido`, `Cuerpo inválido`.

---

## 5. Idempotencia

| Operación | ¿Idempotente? | Detalle |
|---|---|---|
| `PUT …/sync` | **Sí** | Reemplaza el estado completo. Repetirlo con el mismo payload devuelve `created: 0, updated: 0, deleted: 0` y no escribe nada. |
| `PUT …/tools/:id` | **Sí** | Reemplaza el bundle entero, de forma atómica. Cambia solo el código (`201` la primera vez, `200` después). |
| `DELETE …/tools/:id` | **Sí** | `204` aunque no existiera. |
| `PUT …/progress/:page` | **Sí** | Upsert; actualiza la marca de tiempo. |
| `DELETE …/progress/:page` | **Sí** | — |
| `PUT …/bookmarks/:page` | **Sí** | Alta sin conflicto. |
| `PUT …/notes/:page` | **Sí** | Upsert del apunte. |
| `PUT …/tasks/:taskId` | **Sí** | Alta sin conflicto. |
| `PUT …/study/plan-dates/:key` | **Sí** | Upsert de la fecha de esa instancia. |
| `DELETE …` (bookmarks, notes, tasks, srs, plan-dates) | **Sí** | Incluye los borrados totales `DELETE …/tasks` y `DELETE …/study/plan-dates`. |
| `PUT /api/landing` | **Sí** | Reemplaza la disposición del usuario. |
| `POST …/study/srs/:cardId` | **No** | Cada llamada **avanza el calendario** de esa tarjeta (SM-2). Repetir una nota no es inocuo. |
| `POST …/quiz/:quizId/attempts` | **No** | Agrega una fila de intento por llamada. |
| `POST /api/subjects` | **No** | La segunda vez es `409`. |
| `POST /api/auth/*` | **No** | Crea una sesión nueva. |

---

## 6. Entorno del API

De `apps/api/.env.example` y `EnvSchema`:

| Variable | Obligatoria | Default | Qué es |
|---|---|---|---|
| `NODE_ENV` | no | `development` | `production` activa `Secure` en la cookie y prohíbe el bypass. |
| `PORT` | no | `3000` | Puerto (entero 1–65535). |
| `DATABASE_URL` | no | `file:./data/sinapsis.db` | SQLite local o `libsql://…` (Turso). |
| `DATABASE_AUTH_TOKEN` (o `TURSO_AUTH_TOKEN`) | no | — | Token de la base remota. |
| `SESSION_SECRET` | **sí** | — | ≥ 16 caracteres. Firma la cookie de sesión. |
| `GOOGLE_CLIENT_ID` | no | — | Sin él, `POST /api/auth/google` responde `503`. |
| `SYNC_TOKEN` | **sí** | — | ≥ 8 caracteres. Publica el CLI. |
| `AUTH_DEV_BYPASS` | no | `false` | Habilita `POST /api/auth/dev`. **El API se niega a arrancar** si está activo con `NODE_ENV=production`. |
| `WEB_DIST` | no | — | Carpeta del build de la SPA para servirla desde el API. |
| `TOOLS_DIR` | no | la carpeta `tools/` al lado del archivo de `DATABASE_URL` | Raíz de los bundles. |
| `COOKIE_SECURE` | no | `false` | Fuerza `Secure` fuera de producción. |
| `ALLOWED_ORIGINS` | no | `[]` | Orígenes extra del guard CSRF, separados por coma. |

Los booleanos aceptan `1`, `0`, `true`, `false`, `yes`, `no`, `on`, `off` (vacío = `false`).
Un entorno inválido hace fallar el arranque con
`Configuración inválida en el entorno — <campo>: <motivo>; …`.

**Fallback estático**: si `WEB_DIST` existe, el API sirve sus archivos y devuelve
`index.html` para cualquier ruta que no empiece por `/api` (SPA con rutas de navegador,
N0-9).

---

## 7. El cliente del CLI

`packages/cli/src/api.ts` es la implementación de referencia de este protocolo:

- Base: `--api`, `SINAPSIS_API`, o `http://localhost:3000`. Se le recortan las barras finales
  y se le agrega `API_PREFIX`.
- Encabezados: `Accept: application/json`, `Authorization: Bearer <token>` si hay token,
  `Cookie` si hay sesión, y `Content-Type: application/json` solo cuando hay cuerpo.
- La respuesta se valida **contra el esquema del contrato**: si no valida, el error es
  `el API respondió con un <DTO> inesperado`.
- Un fallo de red (sin respuesta) es `no se pudo conectar con <url>: <detalle>` y el CLI
  agrega `¿Está corriendo el API? \`pnpm dev:api\` en el repo de Sinapsis.`
- `status` y `tools list` necesitan **sesión**, no token: el CLI intenta primero
  `POST /api/auth/dev` y reutiliza la cookie. Si el API no lo permite, lo dice en vez de
  rodear la autenticación.
- `putTool` acepta que la respuesta no sea un `ToolInfo` (un API anterior al Sprint 3): el
  bundle ya se subió y el CLI informa lo que compiló.

---

## 8. Errores típicos

| Síntoma | Causa | Arreglo |
|---|---|---|
| `401 Token de sincronización inválido` | El token no coincide con `SYNC_TOKEN` del `.env` del API. | Exportar `SINAPSIS_TOKEN` o pasar `--token`. |
| `401 Sesión requerida` en `status` / `tools list` | El API no tiene `AUTH_DEV_BYPASS=1` y no hay sesión. | Levantar el API con esa variable, o iniciar sesión en la web. |
| `403 Origen no permitido` | La SPA se sirve desde otro origen que el API. | Declararlo en `ALLOWED_ORIGINS`. |
| `404 La materia no existe` al publicar un bundle | El bundle no crea la materia. | Correr `sinapsis sync` primero. |
| `413` en el sync | Un wiki enorme, o adjuntos incrustados en el markdown. | El tope es 50 MB; revisar qué engordó el payload. |
| `415 Falta el encabezado content-type` | Un cliente propio manda cuerpo sin declararlo. | `Content-Type: application/json`. |
| El sync borró páginas que no se querían borrar | Se sincronizó apuntando a un wiki incompleto (`--wiki` equivocado). | Volver a sincronizar con el wiki correcto: el estado del usuario sobrevivió. |
| El material de estudio desapareció | Se sincronizó sin la carpeta `estudio/`: `study` viajó vacío y reemplazó lo que había. | Restaurar la carpeta y volver a sincronizar. |
| `created: 0, updated: 0` y «no pasó nada» | Es lo correcto: el sync es idempotente y nada cambió. | — |
| Los cambios del config no se ven | El config viaja **con** el sync: no hay una ruta para actualizarlo solo. | `sinapsis sync`. |

---

## Fuente ejecutable

- `packages/contract/src/index.ts` — `SyncPayload`, `SyncResult`, `User`, `SubjectCard`,
  `CreateSubjectInput`, `LandingLayoutInput`, `SubjectConfigLoose`, `SubjectDetail`,
  `PageDetail`, `SearchHit`, `GraphData`, `StudyState`, `SrsGradeInput`, `NoteInput`,
  `QuizAttemptInput`, `API_PREFIX`, `errorMessageFromBody`.
- `apps/api/src/app.ts` — montaje, `MAX_BODY_BYTES`, `app.onError`, fallback estático.
- `apps/api/src/env.ts` y `apps/api/.env.example` — variables de entorno.
- `apps/api/src/auth/sync-token.ts` — `Bearer <SYNC_TOKEN>`.
- `apps/api/src/auth/session.ts` · `auth/middleware.ts` · `auth/google.ts` — la sesión.
- `apps/api/src/middleware/csrf.ts` — origen y `content-type`.
- `apps/api/src/middleware/subject.ts` — `404 La materia no existe`.
- `apps/api/src/lib/errors.ts` · `lib/validate.ts` — forma de los errores.
- `apps/api/src/routes/` — `config.ts`, `auth.ts`, `me.ts`, `landing.ts`, `subjects.ts`,
  `sync.ts`, `pages.ts`, `search.ts`, `progress.ts`, `graph.ts`, `study.ts`, `tools.ts`.
- `apps/api/src/services/` — `sync.ts`, `study.ts`, `landing.ts`, `subjects.ts`, `search.ts`,
  `graph.ts`, `tools.ts`.
- `packages/cli/src/api.ts` — cliente de referencia.

## Decisiones relacionadas

N0-2 (SQLite/libSQL) · N0-3 (Hono) · N0-4 (Google Identity Services + cookie de sesión) ·
N0-5 (bypass de desarrollo) · N0-6 (materias globales, landing por usuario) ·
N0-7 (`SYNC_TOKEN` estático) · N0-9 (rutas de navegador y fallback de la SPA) ·
N0-17 (un solo origen, CSRF mínima) · N0-23 (divisiones efectivas en el grafo) ·
N0-27 (`study` viaja siempre) · N0-31 (grafo desde `page_links`) ·
N0-32 (cuatrimestres persistentes) · N0-41 y N0-42 (rutas de herramientas).
