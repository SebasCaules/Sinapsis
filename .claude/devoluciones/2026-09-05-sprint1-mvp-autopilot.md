---
fecha: 2026-09-05
proyecto: Projects/Sinapsis
ruta: /Users/sebastiancaules/Desktop/Projects/Sinapsis
tarea: "Sprint 1 (MVP) de Sinapsis: monorepo API+SPA+CLI desde un mockup, en autopilot con agentes"
tags: [herramientas, autonomia, arquitectura, verificacion]
resultado: bueno
copia_central: /Users/sebastiancaules/Claude/Devoluciones/Projects/Sinapsis/2026-09-05-sprint1-mvp-autopilot.md
---

## Contexto
A partir del mockup exportado de Claude Design, construir y verificar de punta a punta el MVP (API Hono + SQLite, SPA React, compilador de wikis, CLI y skill `/sinapsis`) sin intervención del usuario, dejando todas las decisiones anotadas para revisarlas al final. Se entregó completo en una sesión: 3 olas de agentes Opus (4 constructores, 1 E2E, 4 auditores, 4 lentes de simplificación, 3 fixers) con contratos, integración y adjudicación a cargo del orquestador.

## Salió bien
- La Fase 0 hecha por el orquestador (contrato zod, cliente de API tipado, router y stubs de los componentes compartidos) permitió cuatro constructores en paralelo con ownership disjunto y cero conflictos de archivos; la integración solo pidió dos ajustes al contrato.
- El smoke con datos reales que hizo el orquestador en el navegador encontró el único bug de integración (guard CSRF: `Origin` :5173 frente a `Host` :3000 detrás del proxy de Vite), invisible para los tests con fixtures de cada agente.
- Auditoría final con cuatro lentes (seguridad, corrección, UX/fidelidad, simplificación en cuatro ángulos) produjo más de 100 hallazgos concretos con archivo:línea; adjudicarlos leyendo el código fue más barato y preciso que lanzar refutadores adicionales.
- La regla del usuario "Fable para lo imprescindible, Opus para el resto" funcionó: once agentes Opus construyeron, probaron y auditaron; el orquestador escribió contratos, integró y decidió.
- Documentar cada decisión numerada (N0-1..25) con su costo de revertir permitió avanzar en autopilot sin bloquear y dejó la revisión del usuario acotada a una tabla.

## Salió mal / evitar
- La primera tarea (redactar un solo prompt) se orquestó con 4 borradores + 3 jueces + 2 rondas de críticos; el usuario lo cortó a mitad de camino. Causa: sobre-orquestación para un entregable único. Lo hubiera evitado un redactor más un crítico, o hacerlo inline.
- La skill `/security-review` asume `git diff origin/HEAD...`; el repo nuevo no tenía remoto y hubo que fabricar `refs/remotes/origin/HEAD` para poder usarla. Causa: supuesto de la herramienta sobre el entorno.
- Un `git add -A` mientras dos agentes seguían escribiendo dejó un commit intermedio con archivos parciales. Causa: apuro del orquestador por checkpointear.
- Un `pkill -f "tsx src/index.ts"` mató el API de desarrollo que el agente de UX estaba usando para sus capturas. Causa: procesos compartidos identificados por patrón de comando.
- Los fixes de UI (textos «entradas», roles `option` en la paleta, acciones duplicadas al pie del lector) rompieron 5 selectores E2E y costaron un ciclo extra. Causa: el agente E2E corrió antes que los fixers de UX y nadie tenía ownership de actualizar los specs.
- Un agente entregó el copy del CLI en voseo («Revisá», «Levantá») a pesar de la instrucción de español neutro; hizo falta un barrido manual. Causa: supuesto del agente, sin gate que lo detectara.

## Reglas o hábitos a futuro
- `[global]` Para un artefacto único (un prompt, un documento, un config), usar como máximo un redactor y un crítico; reservar los workflows con paneles para listas de trabajo.
- `[global]` En un repo recién creado, fijar `refs/remotes/origin/HEAD` al commit base antes de invocar skills de review que diffean contra `origin/HEAD`.
- Commitear por agente terminado y solo sus carpetas (`git add <rutas>`); nunca `git add -A` con agentes activos.
- Matar procesos por PID o por puerto propio, nunca por patrón de comando compartido con otros agentes.
- Los fixers de UI actualizan los E2E de sus pantallas en la misma ola: darles ownership de esos specs o correr E2E después de los fixes.
- `[global]` Antes de cerrar, correr un grep de formas voseantes (Revisá, Levantá, Corré, tenés, podés, invocás…) sobre textos de UI, CLI y skills.

## Evidencia
- Commits `5a39786` (F0) → `84169c6` (cierre) en `/Users/sebastiancaules/Desktop/Projects/Sinapsis`; `EXEC_STATE.md` y `docs/HANDOFF-sprint1.md`.
- Corte del workflow inicial: mensaje del usuario "cortalo y dame un output ya".
- Fix CSRF en `1a178a9`; barrido de voseo y fixes S/W2 en `d02815c`; ajuste de selectores E2E en `dfbd68b`.
