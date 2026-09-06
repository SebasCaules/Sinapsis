# Sinapsis

Plataforma personal para organizar y estudiar los wikis markdown de todas las materias.
Cada materia aporta su wiki (estilo Obsidian) y un `sinapsis.config.json`; la plataforma
los envuelve en un shell estándar de tres columnas —rail de herramientas, índice del
temario y área de lectura— con estética *university press* y tres temas.

- **Contrato** plataforma ↔ materia: [`docs/CONTRACT.md`](docs/CONTRACT.md) (fuente ejecutable: `packages/contract`).
- **Decisiones de arquitectura**: [`docs/DECISIONS.md`](docs/DECISIONS.md).
- **Plan por sprints**: [`docs/SPRINTS.md`](docs/SPRINTS.md). Estado de ejecución: [`EXEC_STATE.md`](EXEC_STATE.md).
- **Diseño**: mockups exportados de Claude Design en `design/export/`, brief del baseline en `design/referencias/`.

## Estructura

```
apps/web         SPA React + Vite (landing y shell de materia)
apps/api         API Hono + Drizzle + SQLite (libsql), auth Google, sync
packages/contract  esquemas zod y helpers compartidos (SubjectConfig, Page, DTOs)
packages/markdown  compilador del wiki: frontmatter, wikilinks, headings → Page[]
packages/cli       `sinapsis init | validate | sync | status | tools build|push|list | propose`
skills/sinapsis    skill /sinapsis para el agente de cada materia
examples/proba     configuración de la primera materia real (Probabilidad y Estadística)
e2e/               pruebas Playwright de punta a punta
```

## Requisitos

Node ≥ 20 (probado con 23), pnpm 10. Sin servicios externos: la base es un archivo SQLite.

## Puesta en marcha

```bash
pnpm install
cp apps/api/.env.example apps/api/.env      # editar SESSION_SECRET y SYNC_TOKEN
pnpm db:migrate
pnpm dev                                    # API en :3000 y web en :5173
```

Abrir <http://localhost:5173>. En desarrollo, con `AUTH_DEV_BYPASS=1`, el botón
"Entrar como usuario de desarrollo" inicia sesión sin Google.

### Login con Google

1. En [Google Cloud Console](https://console.cloud.google.com/apis/credentials) crear un
   **OAuth 2.0 Client ID** de tipo *Web application*.
2. Orígenes JavaScript autorizados: `http://localhost:5173` y `http://localhost:3000`
   (agregar el dominio real al desplegar). No hace falta URI de redirección: se usa el
   ID token de Google Identity Services.
3. Copiar el Client ID a `GOOGLE_CLIENT_ID` en `apps/api/.env` y reiniciar el API.
4. Para producción, poner `AUTH_DEV_BYPASS=0`.

### Sincronizar una materia

```bash
# 1) generar la configuración a partir del wiki (una sola vez)
pnpm sinapsis -- init --wiki ~/ruta/a/Materia_Obsidian/wiki --out ~/ruta/a/Materia_Obsidian/sinapsis.config.json

# 2) completar nombre, código, institución, divisiones y rail; validar
pnpm sinapsis -- validate --config ~/ruta/a/Materia_Obsidian/sinapsis.config.json

# 3) compilar y enviar al API (token = SYNC_TOKEN del .env del API)
SINAPSIS_TOKEN=... pnpm sinapsis -- sync --config ~/ruta/a/Materia_Obsidian/sinapsis.config.json
```

El ejemplo de Probabilidad y Estadística vive en `examples/proba/`; su wiki está en el vault
del usuario, por eso el CLI acepta `--wiki` para apuntar a la carpeta real:

```bash
SINAPSIS_TOKEN=... pnpm sinapsis -- sync --config examples/proba/sinapsis.config.json --wiki ~/Desktop/ITBA/26-1C/Proba_Obsidian/wiki
```

El material de estudio (mazos, quizzes, plan y kits) vive en la carpeta `estudio/` junto al wiki;
el formato está en `docs/contracts/03-estudio.md` y `pnpm sinapsis -- init` deja un ejemplo. Sin mazos
propios, la plataforma genera uno por división a partir de los resúmenes.

### Herramientas y figuras de una materia

Una materia puede traer sus propias vistas (explorador, calculadoras…) y figuras interactivas como
un bundle de scripts clásicos en `tools/` junto al wiki, descrito por `sinapsis.tools.json`
(contrato en `docs/contracts/04-herramientas-y-figuras.md`; ejemplo real en
`examples/proba/tools/proba-tools/`). Se construye, valida y sube con:

```bash
pnpm sinapsis -- tools build --config examples/proba/sinapsis.config.json --dir examples/proba/tools/proba-tools
SINAPSIS_TOKEN=... pnpm sinapsis -- tools push --config examples/proba/sinapsis.config.json --dir examples/proba/tools/proba-tools
SINAPSIS_TOKEN=... pnpm sinapsis -- sync --config … --tools        # wiki + estudio + bundles en un paso
```

Las vistas aparecen en el rail de la materia (`kind: "tool"` en el config) y en `/m/<materia>/t/<vista>`;
un `> [!figura] id` en una página del wiki monta la figura dentro del lector.

### Proponer un cambio a la plataforma

Cuando una materia necesita algo común (un campo del contrato, un componente, una regla del
compilador), su agente lo propone con `pnpm sinapsis -- propose --subject <slug> --title … --files …`:
el CLI corre los gates, crea la rama `proposal/*`, escribe la propuesta en `proposals/` y anota la
fila en `proposals/INBOX.md`; el orquestador la revisa con la skill `/sinapsis-review` y decide.
Flujo completo en `docs/contracts/07-propuestas.md`.

Dentro de cada repo de materia, el agente usa la skill `/sinapsis` (`init`, `validate`, `sync`,
`status`, `tools`, `propose`), que envuelve estos comandos. Para tenerla disponible en todos los
proyectos: `ln -s "$PWD/skills/sinapsis" ~/.claude/skills/sinapsis`; la del orquestador es
`skills/sinapsis-review`.

## Scripts

| Comando | Qué hace |
|---|---|
| `pnpm dev` | API + web en paralelo |
| `pnpm build` | compila todos los paquetes (`apps/web/dist` lo sirve el API en producción) |
| `pnpm typecheck` · `pnpm test` | gates de tipos y unitarios/integración en todo el repo |
| `pnpm e2e` | Playwright contra API + web reales |
| `pnpm db:migrate` | aplica las migraciones SQL |
| `pnpm sinapsis -- <cmd>` | CLI de materias |

## Producción (adelanto del Sprint 4)

`pnpm build` y luego `pnpm --filter @sinapsis/api start` (fija `NODE_ENV=production`) con
`WEB_DIST=../web/dist`, `AUTH_DEV_BYPASS=0` y un `GOOGLE_CLIENT_ID` real: el API sirve la SPA y
`DATABASE_URL` puede apuntar a un archivo o a Turso (`libsql://…`). Con `NODE_ENV=production` el
API se niega a arrancar si el bypass de desarrollo sigue activo, y la cookie de sesión lleva `Secure`
(fuera de producción se puede forzar con `COOKIE_SECURE=1`). Si la SPA se sirve desde otro origen,
declararlo en `ALLOWED_ORIGINS`.
