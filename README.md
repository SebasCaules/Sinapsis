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
packages/cli       `sinapsis init | validate | sync | status`
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

Dentro de cada repo de materia, el agente usa la skill `/sinapsis` (`init`, `validate`,
`sync`, `status`), que envuelve estos comandos. Para tenerla disponible en todos los
proyectos: `ln -s "$PWD/skills/sinapsis" ~/.claude/skills/sinapsis`.

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

`pnpm build` y luego `node apps/api/dist/index.js` con `WEB_DIST=../web/dist`: el API sirve
la SPA y `DATABASE_URL` puede apuntar a un archivo o a Turso (`libsql://…`).
