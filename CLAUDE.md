# Sinapsis — directivas del proyecto

Destiladas de las seis devoluciones de este repositorio (2026-09-05 a 2026-09-07), con
`/devolucion destilar --proyecto Sinapsis`. Son las lecciones que **solo** aplican acá; las
que valen para cualquier proyecto viven en `~/.claude/CLAUDE.md` y no se repiten.

Al aprender algo nuevo en una sesión, registrarlo con `/devolucion` y volver a destilar; no
editar este archivo a mano con impresiones sueltas.

## Trabajo con agentes en paralelo

- **Cerrar en F0 toda decisión que otro agente vaya a consumir**: columnas de índices,
  esquemas de cuerpo de request, semánticas de DTO. Dos decisiones abiertas costaron un
  agente de ajuste entero (A3b), y `SendMessage` deshabilitado impidió retomar al original.
- **Commitear por agente terminado y por lista explícita de archivos** (`git add a b c`),
  nunca por carpeta ni por patrón. `git add packages/runtime/src` se llevó el `figures.css`
  que otro agente estaba editando; `git add $(git diff --name-only -- '*.css')` arrastró
  CSS ajeno a un PR y el revisor tuvo que pedir que se quitara.
- **Repartir ownership por archivo, después de buscar copias gemelas.** Los dos `vocab.css`
  de los bundles de Proba son copias que se cargan juntas: dos correctores con ownership
  disjunto se pisaron y hizo falta un tercero para igualarlas.
- **Los pedidos pequeños de interfaz se hacen en línea, no se delegan.** Encolar "agarradera
  visible" o "botón PANEL" a un agente ocupado con el mismo archivo terminó con el usuario
  pidiendo "sin agente, hazlo ahora". Un entregable único no justifica una orquesta.
- **Matar procesos por PID o por puerto propio**, nunca por patrón de comando: un
  `pkill -f "tsx src/index.ts"` mató el API que otro agente usaba para sus capturas.
- **Los prompts a constructores de UI llevan lista de verificación de accesibilidad**
  (nombres únicos, objetivos ≥24 px, regiones vivas) y **tope de capturas** con criterio de
  cuáles se versionan: sin eso, una auditoría devolvió 43 hallazgos y otra, 180 MB de PNG.
- **Los fixers de UI son dueños de los E2E de sus pantallas** y los actualizan en la misma
  ola. Cuando el agente de E2E corrió antes que los de UX, cinco selectores se rompieron.

## Medir antes de repartir

- **Una hipótesis sistémica se mide en el centro antes de lanzar auditores.** Un
  `getComputedStyle` sobre el panel mostró que todos los contenedores sólidos quedaban más
  oscuros que su entorno texturizado: una decisión (capa de grano global) reemplazó lo que
  habrían sido treinta parches locales.
- **Los tokens de color se deciden con una matriz de contraste por script, antes** de
  repartir correcciones. Así siete correctores aplicaron 115 hallazgos sin un conflicto.
- **El criterio de cierre visual es un censo, no una opinión**: script de Playwright contra
  el dev server (`window.__sinapsis.setTheme`) con censo de contraste WCAG en el DOM, sobre
  todas las vistas × los tres temas.

## Verificar en el navegador real

- **Hover con eventos de puntero reales.** `dispatchEvent`/`mouseover` sintético dio un
  falso negativo en el tooltip; solo el hover real lo dispara.
- **Un test con mock no prueba nada sobre la librería.** El test de Mermaid mockeaba `run` y
  ocultaba que un diagrama roto deja el SVG de error en lugar de caer al bloque de código.
- **El compilador valida el frontmatter mejor que un grep propio**: correr
  `pnpm build:subjects --only <slug>` antes de muestrear a mano. El muestreo manual dio
  falsos "falta titulo/tipo" porque el wiki usa los alias en inglés que el contrato admite.
- **No indicar un puerto sin comprobar que ese servidor siga vivo y al día.**

## E2E y gates

- **La E2E usa el puerto fijo 5174: correr la de una rama por vez.** Con otra en marcha (o
  con el Vite de otra sesión encima) da choques de puerto y timeouts falsos.
- **Después de mergear una materia nueva, correr `pnpm e2e` en `main` una vez.** El CI no
  corre E2E y `landing.spec` asume una sola materia: la primera ronda de Cripto rompió la
  E2E de `main` sin que nadie lo viera.
- `SessionView` ("Espacio… UNA sola vez") y una prueba del lector son **intermitentes bajo
  carga**: si fallan, repetir a solas antes de investigarlas.

## Sitio estático y publicación

- **Probar el build de producción bajo la base real** (`VITE_BASE`, `/Sinapsis/`) antes de
  publicar: la tarjeta de vista previa no reconocía enlaces con esa base.
- **La caché del host es parte del diseño, no un parche**: con `max-age=600` el CDN sirvió
  `tools.json` y scripts viejos junto con la web nueva. Revalidación con ETag o sellos de
  versión en la URL.

## Decisiones y propuestas

- **Numerar decisiones leyendo `docs/DECISIONS.md` de `origin/main`, no la copia local.**
  Dos sesiones usaron N0-66 a la vez y hubo conflicto en el cherry-pick.
- **En el código y los documentos de una propuesta se escribe el marcador `N0-nn`**; el
  número real lo pone el orquestador al mergear. Tres propuestas citaron números ya usados.
- **La sección «Alcance» de una propuesta se escribe leyendo `git diff`**, no el plan que
  uno tenía en la cabeza.
- **Antes de `propose` o de empujar a una rama, `git fetch` y mirar `git log origin/main`**:
  lo que estaba abierto puede haberse mergeado mientras tanto.
- **Revisar y mergear siempre desde un worktree temporal.** En una segunda ronda la carpeta
  principal estaba en otra rama con 211 cambios ajenos, y aun así se pudo revisar, mergear y
  empujar sin tocarla.

## Defectos abiertos conocidos

- Reiniciar el API de desarrollo obliga a volver a iniciar sesión en el navegador aunque la
  sesión siga viva en la base (S-13, S-24). Sin diagnóstico.
- El CLI `propose` estampa `pr:` con `--amend` después de empujar y lista archivos sin
  seguimiento en «Alcance» (anotado en los veredictos, sin arreglo).
