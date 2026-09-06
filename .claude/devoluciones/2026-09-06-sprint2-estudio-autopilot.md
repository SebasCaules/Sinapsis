---
fecha: 2026-09-06
proyecto: Projects/Sinapsis
ruta: /Users/sebastiancaules/Desktop/Projects/Sinapsis
tarea: "Sprint 2 (Estudio) de Sinapsis: pestañas, grafo, SRS, quiz, plan y kits en autopilot"
tags: [herramientas, autonomia, frontend, verificacion]
resultado: bueno
copia_central: /Users/sebastiancaules/Claude/Devoluciones/Projects/Sinapsis/2026-09-06-sprint2-estudio-autopilot.md
---

## Contexto
Continuar en autopilot tras el Sprint 1: convertir el shell de materia en una mesa de estudio (pestañas múltiples, grafo de conexiones, favoritos y apuntes, flashcards con SM-2, quiz, plan de estudio y kits), con el material de estudio compilado desde el wiki de cada materia y el contenido real de Proba convertido. Cinco constructores en paralelo, un agente E2E, tres auditores y tres fixers, todos en Opus; contratos, integración y adjudicación en la sesión. Cerrado con 431 tests y 47 E2E en verde.

## Salió bien
- Cinco constructores en paralelo con contrato, cliente de API y firmas de integración (`studyRoutes`, `useStudy`) escritos antes de lanzar: cero conflictos de archivos; la integración fue un ajuste de dos líneas.
- Dar a los fixers de UI el ownership de los E2E de sus pantallas eliminó el ciclo de selectores rotos del Sprint 1: la suite (47) pasó a la primera tras los fixes.
- Commits por carpeta de agente (`git add apps/api`) evitaron los commits parciales del sprint anterior.
- Convertir el contenido real de Proba (`study-data.js`) con un conversor reejecutable dio valor inmediato: 6 mazos, 1 quiz, plan de 89 tareas y 8 kits con 0 referencias rotas.
- La auditoría de seguridad no encontró nada: los arreglos del Sprint 1 (URLs, rutas contenidas, autorización por usuario) se sostuvieron en la superficie nueva.

## Salió mal / evitar
- Dos decisiones de F0 quedaron abiertas (columnas del índice FTS, esquemas de cuerpo de request) y obligaron a un agente de ajuste extra (A3b); como `SendMessage` está deshabilitado, no se pudo continuar al agente original. Causa: contrato incompleto en F0.
- Un parche propio por expresión regular insertó un `useRef` dentro de la lista de parámetros de un componente y rompió el typecheck. Causa: insertar sin leer el contexto exacto.
- La auditoría UX devolvió 43 hallazgos, la mayoría de accesibilidad (nombres duplicados, objetivos menores de 24 px, regiones vivas ausentes): los prompts de los constructores no tenían lista de verificación de accesibilidad. Causa: prompt incompleto.
- Los hexes de `--track` prescritos al fixer no cumplían el 3:1 que el propio pedido exigía (el fixer los midió y corrigió). Causa: color propuesto sin medir.
- Reiniciar el API de desarrollo obligó a volver a iniciar sesión en el navegador dos veces aunque la sesión vive en la base (pendiente S-13). Causa: entorno, sin diagnóstico aún.
- Los reportes de agentes paralelos describen estados transitorios de los demás (D3b creía que D3a no había cableado sus rutas; C3 aún no había terminado los mocks): hay que verificar en la integración, no confiar en el reporte.

## Reglas o hábitos a futuro
- `[global]` Incluir en el ENV de todo constructor de UI una lista mínima de accesibilidad: nombres accesibles únicos, roles y estados ARIA, objetivos ≥ 24 px, contraste AA medido, `aria-live` para cambios asíncronos, atajos documentados.
- `[global]` Antes de insertar código con una expresión regular, leer las líneas alrededor del punto de inserción (firma de la función incluida).
- Cerrar en F0 las decisiones que otros agentes van a consumir (columnas de índices, esquemas de entrada, semánticas de DTO) para no necesitar agentes de ajuste.
- Dar a cada fixer de UI el ownership de los E2E de sus pantallas (práctica confirmada).
- Medir el contraste de cualquier color que se prescriba a un agente, en vez de proponer hexes de memoria.
- Verificar en la integración lo que un agente afirme sobre el trabajo de otro agente.

## Evidencia
- Commits `8bc6ab7` (F0 del Sprint 2) → `01fcc96` (cierre) en `/Users/sebastiancaules/Desktop/Projects/Sinapsis`; `EXEC_STATE.md` (sección Sprint 2); `docs/HANDOFF-sprint2.md`.
- Agente de ajuste A3b (FTS con resumen + inputs del contrato); error de typecheck en `AddSubjectDialog.tsx`; decisión WL-1 sobre `--track`.
