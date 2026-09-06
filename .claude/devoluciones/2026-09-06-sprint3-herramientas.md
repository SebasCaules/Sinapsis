---
fecha: 2026-09-06
proyecto: Projects/Sinapsis
ruta: /Users/sebastiancaules/Desktop/Projects/Sinapsis
tarea: "Sprint 3 (Herramientas) de Sinapsis: plugins por materia, figuras, propuestas y cierre con revisión visual en autopilot"
tags: [herramientas, verificacion, autonomia, frontend]
resultado: bueno
copia_central: /Users/sebastiancaules/Claude/Devoluciones/Projects/Sinapsis/2026-09-06-sprint3-herramientas.md
---

## Contexto
Continuar en autopilot tras el Sprint 2: bundles de herramientas y figuras por materia sobre un runtime de compatibilidad, `Plan.tracks`, `dueCount`, flujo de propuestas materia → orquestador, contratos consolidados, y al cierre una revisión de diseño con el navegador y una comparación página a página con la app original de Proba. Tres olas con 14 agentes Opus (5 constructores, 6 de ola 2, 2 auditores, 3 fixers); contratos, integración, adjudicación y smoke del orquestador. Cerrado con 721 tests y 60 E2E.

## Salió bien
- El smoke propio del orquestador con datos reales encontró el bug más grave del sprint (51 páginas truncadas por `$$ fórmula` en la misma línea) antes de que lo viera ningún agente ni test: los tests con fixtures no lo cubrían.
- Probar el flujo de propuestas en un clon desechable con cinco casos negativos (Q5) antes de la propuesta real: 11 fricciones corregidas sin ensuciar `main`, y la propuesta real salió limpia a la primera.
- Dar a los agentes de revisión visual Playwright headless en vez del panel compartido del navegador: dos revisiones en paralelo (538 capturas) sin pisarse ni con el orquestador.
- Auditores de solo lectura (seguridad y corrección) más un fixer por auditoría, con el registro de lo ya adjudicado en el prompt: 19 hallazgos, 0 falsos positivos, ninguno re-reportado.
- Pedir a los agentes mediciones (ratios de contraste, conteos antes/después, estilos calculados) en vez de juicios visuales: los reportes fueron verificables y las correcciones, demostrables.

## Salió mal / evitar
- La normalización de `$$` se escribió a partir de UNA página rota y llegó con cuatro bugs (citas, listas, tres `$$` por línea, cercas largas) que atrapó la auditoría, más una regresión (sangría del cierre) que atrapó X5 después. Causa: no se corrió sobre las 209 páginas comparando el render antes de commitear. Lo hubiera evitado un barrido del corpus con conteo de errores de KaTeX y de encabezados por página.
- `git add packages/runtime/src` arrastró al commit de W5 el `figures.css` que F5 estaba editando; hubo que rehacer el commit. Causa: agregar una carpeta en vez de la lista exacta de archivos del agente.
- Dos diffs prescritos por el orquestador a los agentes eran incorrectos: `paletteOpen()` como acción (el baseline la usa como pregunta) y reordenar plugins para los wikilinks (remark-math es extensión del parser, el orden no cambia nada). Los agentes lo detectaron y lo demostraron. Causa: prescribir la corrección sin leer el código que la consume.
- El voseo reapareció en una skill nueva y en mensajes del CLI a pesar de la regla global. Causa: sin gate automático (ya hay regla candidata `gate-espanol-neutro`).
- Los agentes de revisión visual produjeron 180 MB de capturas sin instrucción de volumen; se resolvió con `.gitignore` y `git add -f` de las citadas en los docs. Causa: prompt sin límite ni criterio de versionado.
- Tras un reinicio automático del API de desarrollo el navegador volvió a pedir login aunque la sesión seguía en la base (S-24); quedó sin diagnosticar.

## Reglas o hábitos a futuro
- `[global]` Una transformación nueva del compilador se valida sobre el corpus entero (render + métricas por página) antes de commitearla, no sobre el caso que la motivó.
- Commitear el trabajo de un agente por lista explícita de archivos (`git add a b c`), nunca por carpeta, mientras haya otros agentes activos.
- `[global]` Un diff prescrito a un agente es una hipótesis: pedirle que lo verifique contra el código consumidor y que reporte si no aplica, en vez de aplicarlo a ciegas.
- Prompts de revisión visual con tope de capturas y criterio de cuáles se versionan (solo las citadas en el doc).
- Mantener el smoke propio del orquestador con datos reales como gate de cada ola (práctica confirmada por tercera vez).

## Evidencia
- Commits `442560a` (B4) → `fc3a284` (cierre) en `/Users/sebastiancaules/Desktop/Projects/Sinapsis`; `EXEC_STATE.md` (Sprint 3, S-14..S-26); `docs/HANDOFF-sprint3.md`.
- N0-47 en `77adf07`, corregido en `4b1697d` (auditoría AC-01..03/06) y en el commit siguiente (regresión hallada por X5); recommit de W5 en `e393a34`; propuesta real `b2f3a62`/`edcf469`.
