---
title: "Matriz de frecuencias de temas en finales — Derecho para Ingenieros"
resumen: "Matriz de frecuencia de los temas canónicos en los finales fechados, con la tabla maestra por examen, las reglas de asignación de tier A/B/C, la curva de cobertura y el estado de cobertura de las fichas del kit."
type: examen
unidades: [1, 2, 3, 4, 5, 6, 7, 8, 9]
unidad: final
fuentes: ["banco-preguntas.md", "2007.pdf", "2010.pdf", "2011.doc", "Final 2018.txt", "Final Febrero 2019.pdf", "final_julio_2019.txt", "Final 2019 Julio 2da fecha.txt", "Preguntas Final Completo - Derecho para ingenieros.pdf", "Preguntas Final Reducido - Derecho para ingenieros.docx", "Finales y Preguntas Típicas.docx", "PREGUNTAS.docx", "2021_2C.pdf", "Derecho - Final Reducido.docx", "Derecho - Primeros Parciales Viejos.docx", "Derecho - Segundos Parciales Viejos.docx", "Finales 2015 (resueltos).pdf", "COMPILADO derecho_al_infierno.pdf", "Final Derecho - Febrero 2025.jpg", "2020 2C.docx"]
fecha_creacion: 2026-07-18
ultima_actualizacion: 2026-09-25
---

# Matriz de frecuencias de temas en finales

Derivada de [[banco-preguntas]].

> **Actualización del 4 de septiembre de 2026.** El volcado del Drive del CEITBA (ver [[fuente-drive-ceitba-61-31]]) sumó **siete finales fechados** que el corpus no tenía, entre ellos el más reciente conocido, el de **febrero de 2025**. El denominador pasó de 16 a **23 finales** y las observaciones de 82 a **114**. Los conteos y los tiers de este documento están recalculados; el cálculo es reproducible con `tools/drive-sync/recalcular_matriz.py`, que verifica que cada columna sume exactamente el número de preguntas de su examen.

## 1. Metodología

- **Observación** = una consigna de un examen **fechado presencial** que cae en un tema canónico del banco. Es lo único que entra en el conteo principal y en la fracción.
- **Denominador** = **23 finales fechados** (tabla "Finales fechados detectados" de [[banco-preguntas]]), que suman **114 preguntas**.
- **Señal** = todo lo que sugiere que un tema está activo pero NO es una observación: los compendios sin fecha, los finales **virtuales** de 2020 y 2021 (régimen distinto: preguntas cortas en Blackboard o Respondus) y la presencia del tema en parciales 2023-2025 y en el documento vivo `Derecho - Final Reducido` (2026).
- **Sin porcentajes ni probabilidades**: solo fracciones exactas del tipo "7 de 23". Un tema que salió 7 de 23 veces salió 7 de 23 veces; nada más se afirma.
- Un tema se cuenta a lo sumo una vez por final.

## 2. Leyenda de finales

| ID | Fecha | Archivo | N | Nota |
|---|---|---|---|---|
| F1 | 12/2007 (día s/f) | raw/finales/2007.pdf | 10 | formato viejo |
| F2 | 16/07/2010 | raw/finales/2010.pdf | 5 | |
| F3 | 29/06/2011 | raw/finales/2011.doc | 5 | |
| F4 | 02/09/2015 | Preguntas Final Completo.pdf | 5 | ahora **resuelto** en COMPILADO derecho_al_infierno.pdf |
| F5 | 09/02/2017 | Preguntas Final Completo.pdf | 5 | |
| F6 | 07/12/2017 | Preguntas Final Reducido.txt | 3 transcriptas | |
| F7 | 03/07/2018 (completo) | Preguntas Final Completo.pdf | 5 | |
| F8 | 03/07/2018 (reducido) | Preguntas Final Reducido.txt | 4 transcriptas | |
| F9 | 2018 s/f — Tema 1 | raw/finales/Final 2018.txt | 5 | |
| F10 | 2018 s/f — Tema 2 | raw/finales/Final 2018.txt | 5 | |
| F11 | 07/12/2018 | Finales y Preguntas Típicas.txt | 5 | |
| F12 | 14/12/2018 | Finales y Preguntas Típicas.txt | 5 | ahora **resuelto** en COMPILADO derecho_al_infierno.pdf |
| F13 | 08/02/2019 | Final Febrero 2019.pdf | 5 | |
| F14 | 07/2019 1ª fecha | final_julio_2019.txt | 5 | |
| F15 | 07/2019 2ª fecha | Final 2019 Julio 2da fecha.txt | 5 | |
| F16 | 29/10/2019 | Finales y Preguntas Típicas.txt | 5 | la fuente lo titula "Parcial" |
| **F17** | **julio 2015, 1er llamado** | Finales 2015 (resueltos).pdf | 5 | **nuevo**, con desarrollo modelo |
| **F18** | **julio 2015, 2do llamado** | Finales 2015 (resueltos).pdf | 4 transcriptas | **nuevo**, con desarrollo modelo |
| **F19** | **diciembre 2015, 1er llamado** | Finales 2015 (resueltos).pdf | 4 transcriptas | **nuevo**, con desarrollo modelo |
| **F20** | **diciembre 2019, 1ra fecha** | COMPILADO derecho_al_infierno.pdf | 5 | **nuevo** |
| **F21** | **diciembre 2019, 2da fecha** | COMPILADO derecho_al_infierno.pdf | 4 identificables de 5 | **nuevo**; la consigna 2 figura como "???" en la fuente |
| **F22** | **febrero 2025** | Final Derecho - Febrero 2025.jpg | 5 | **nuevo**, el final más reciente del corpus |
| **F23** | **14/12/2018, segunda versión** | COMPILADO derecho_al_infierno.pdf | 5 | **nuevo**; ver la advertencia de abajo |

> ⚠️ **Sobre F23.** El compilado trae un examen rotulado "Final Derecho 14 Dic. 2018" cuyas cinco consignas no coinciden con las de F12, que ya estaba en el banco con esa misma fecha: solo comparten el tema de concursos. Los dos revisores que cruzaron el corpus de forma independiente concluyeron que son exámenes distintos, probablemente dos temas o dos turnos del mismo llamado, igual que los "Tema 1" y "Tema 2" de 2018. Se cuenta aparte, pero si en realidad fuera una transcripción alternativa del mismo examen, el denominador sería 22 y bajarían en uno los conteos de modalidades laborales, persona y capacidad, concursos, sociedades y marcas.

**Los dos finales virtuales quedan fuera del denominador**: el del **17/12/2020** (Blackboard, 17 preguntas cortas transcriptas con respuestas, en `Examenes/Final/Tincho/2020 2C.docx`) y el del **2C 2021** (Respondus, 20 preguntas). Son de otro régimen y van en la columna de señal.

## 3. Tabla maestra

Señal 2025-26: **fuerte** = bloque del doc vivo `Derecho - Final Reducido` (2026) o tema dominante en parciales 2023-2025; **sí** = presente en parciales 2023-2025; **—** = sin señal reciente.

| Tema | F1 | F2 | F3 | F4 | F5 | F6 | F7 | F8 | F9 | F10 | F11 | F12 | F13 | F14 | F15 | F16 | F17 | F18 | F19 | F20 | F21 | F22 | F23 | Fracción | Señal (s/f + virtual) | Señal 2025-26 | Unidades | Tier |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| [[banco-preguntas#modalidades-contratacion-laboral\|modalidades-contratacion-laboral]] | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |  |  | ✓ |  | ✓ |  |  |  |  |  |  |  | ✓ |  |  | ✓ | ✓ | **11 de 23** | 0 | sí (casos prácticos en 2º parcial 2C-2025) | 9 | **A** |
| [[banco-preguntas#sociedades-tipos-y-responsabilidad\|sociedades-tipos-y-responsabilidad]] |  | ✓ |  |  |  |  |  | ✓ | ✓ |  | ✓ |  |  | ✓ |  | ✓ | ✓ |  | ✓ |  |  |  | ✓ | **9 de 23** | 0 | sí (caso aplicado repetido desde 2C-2023) | 6 | **A** |
| [[banco-preguntas#defensa-de-la-competencia\|defensa-de-la-competencia]] | ✓ | ✓ | ✓ | ✓ | ✓ |  |  |  |  | ✓ |  |  |  |  |  |  |  |  |  | ✓ |  | ✓ |  | **8 de 23** | 0 | — | 4 | **A** |
| [[banco-preguntas#concursos-y-quiebras\|concursos-y-quiebras]] |  |  |  | ✓ | ✓ |  |  |  |  | ✓ | ✓ | ✓ |  |  |  |  |  |  |  |  |  | ✓ | ✓ | **7 de 23** | 3 | **fuerte** (doc vivo 2026; cesación de pagos en parcial 2025) | 4 | **A** |
| [[banco-preguntas#defensa-del-consumidor\|defensa-del-consumidor]] |  |  |  |  |  | ✓ |  | ✓ | ✓ |  |  |  |  |  |  |  | ✓ | ✓ | ✓ |  | ✓ |  |  | **7 de 23** | 0 | **fuerte** (Ley 24.240 recurrente en 2º parcial 2023-2025) | 8 | **A** |
| [[banco-preguntas#laboral-extincion\|laboral-extincion]] |  |  | ✓ |  |  |  | ✓ | ✓ |  |  |  |  |  | ✓ |  |  |  | ✓ |  | ✓ |  |  |  | **6 de 23** | 0 | **fuerte** (doc vivo 2026: extinción/despido) | 9 | **A** |
| [[banco-preguntas#marcas\|marcas]] |  |  |  |  |  |  |  |  | ✓ |  |  |  | ✓ | ✓ | ✓ | ✓ |  |  |  |  |  |  | ✓ | **6 de 23** | 5 | **fuerte** (doc vivo 2026; marca notoria en parcial 2025) | 5 | **A** |
| [[banco-preguntas#obligaciones-concepto-tipos\|obligaciones-concepto-tipos]] | ✓ |  |  | ✓ |  |  | ✓ |  |  |  |  |  |  |  | ✓ | ✓ |  |  |  |  |  | ✓ |  | **6 de 23** | 3 | sí (1er parcial 2C-2025) | 3 | **A** |
| [[banco-preguntas#contrato-concepto-y-elementos\|contrato-concepto-y-elementos]] |  |  |  |  | ✓ | ✓ |  |  |  |  |  |  |  |  |  |  | ✓ | ✓ |  |  |  | ✓ |  | **5 de 23** | 0 | **fuerte** (doc vivo 2026; domina 2º parcial 2023-2025) | 7 | **A** |
| [[banco-preguntas#cheque\|cheque]] |  |  |  |  |  |  | ✓ |  | ✓ |  |  |  | ✓ |  | ✓ |  |  |  |  |  |  |  |  | **4 de 23** | 5 | sí (caso del virtual 2021 reciclado en parcial 2025) | 4 | **A** |
| [[banco-preguntas#derecho-y-fuentes\|derecho-y-fuentes]] |  |  |  |  | ✓ |  |  |  |  |  |  |  | ✓ | ✓ |  | ✓ |  |  |  |  |  |  |  | **4 de 23** | 5 | — | 1 | **A** |
| [[banco-preguntas#documentos-y-firma-digital\|documentos-y-firma-digital]] |  |  |  |  |  |  |  |  |  |  |  | ✓ | ✓ | ✓ |  | ✓ |  |  |  |  |  |  |  | **4 de 23** | 0 | — | 3 | **A** |
| [[banco-preguntas#jornada-de-trabajo\|jornada-de-trabajo]] |  |  |  |  |  |  |  |  |  |  |  |  |  |  | ✓ |  |  | ✓ | ✓ |  |  |  |  | 3 de 23 | 0 | — | 9 | B |
| [[banco-preguntas#persona-y-capacidad\|persona-y-capacidad]] |  |  |  |  |  |  | ✓ |  |  |  | ✓ |  |  |  |  |  |  |  |  |  |  |  | ✓ | 3 de 23 | 5 | sí (bloque amplio en 1er parcial 2C-2025) | 3 | B |
| [[banco-preguntas#contrato-de-compraventa\|contrato-de-compraventa]] |  |  |  |  |  |  | ✓ | ✓ |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 2 de 23 | 0 | — | 7 | B |
| [[banco-preguntas#contratos-con-el-estado\|contratos-con-el-estado]] | ✓ | ✓ |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 2 de 23 | 0 | — | 2, 7 | B |
| [[banco-preguntas#derecho-y-moral\|derecho-y-moral]] |  |  |  |  |  |  |  |  |  |  |  | ✓ |  |  |  |  |  |  |  |  | ✓ |  |  | 2 de 23 | 1 | — | 1 | B |
| [[banco-preguntas#fondo-de-comercio\|fondo-de-comercio]] |  |  |  | ✓ |  |  |  |  |  |  | ✓ |  |  |  |  |  |  |  |  |  |  |  |  | 2 de 23 | 2 | — | 4 | B |
| [[banco-preguntas#leasing-franchising-licencia\|leasing-franchising-licencia]] |  |  | ✓ |  |  |  |  |  |  |  |  |  |  |  |  |  | ✓ |  |  |  |  |  |  | 2 de 23 | 0 | — | 7 | B |
| [[banco-preguntas#patentes-e-invencion\|patentes-e-invencion]] |  |  |  |  |  |  |  |  |  |  |  | ✓ |  |  |  |  |  |  |  |  | ✓ |  |  | 2 de 23 | 3 | sí (patentabilidad, INPI, modelos de utilidad en parcial 2025) | 5 | B |
| [[banco-preguntas#relacion-y-contrato-de-trabajo\|relacion-y-contrato-de-trabajo]] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | ✓ |  |  |  | ✓ |  |  | 2 de 23 | 0 | si (subordinacion y planos en 2do parcial 2C-2025) | 9 | B |
| [[banco-preguntas#responsabilidad-civil\|responsabilidad-civil]] |  |  |  |  |  |  |  |  |  |  |  | ✓ |  |  |  |  |  |  |  | ✓ |  |  |  | 2 de 23 | 3 | **fuerte** (doc vivo 2026 + parciales 2025) | 3 | B |
| [[banco-preguntas#seguros\|seguros]] | ✓ |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | ✓ |  |  |  | 2 de 23 | 2 | sí (bloque en 1er parcial 2C-2025) | 4, 7 | B |
| [[banco-preguntas#acto-administrativo\|acto-administrativo]] |  |  |  |  |  |  |  |  |  | ✓ |  |  |  |  |  |  |  |  |  |  |  |  |  | 1 de 23 | 0 | — | 2 | C |
| [[banco-preguntas#articulo-14-cn\|articulo-14-cn]] |  |  |  |  |  |  |  |  |  |  |  |  |  |  | ✓ |  |  |  |  |  |  |  |  | 1 de 23 | 3 | — | 2 | B |
| [[banco-preguntas#articulo-41-ambiente\|articulo-41-ambiente]] |  | ✓ |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 1 de 23 | 2 | — | 2 | B |
| [[banco-preguntas#derechos-de-autor-y-software\|derechos-de-autor-y-software]] | ✓ |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 1 de 23 | 1 | sí (plazos de derechos de autor en parcial 2025) | 5 | B |
| [[banco-preguntas#derechos-del-trabajador-14bis\|derechos-del-trabajador-14bis]] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | ✓ |  |  |  | 1 de 23 | 2 | indirecta (principios laborales en doc vivo 2026) | 9 | B |
| [[banco-preguntas#etica-empresarial\|etica-empresarial]] | ✓ |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 1 de 23 | 0 | — | 1 (fuera de temario actual) | C |
| [[banco-preguntas#extincion-de-obligaciones\|extincion-de-obligaciones]] |  |  |  |  |  |  |  |  |  | ✓ |  |  |  |  |  |  |  |  |  |  |  |  |  | 1 de 23 | 4 | sí (compensación en 1er parcial 2C-2025) | 3 | B |
| [[banco-preguntas#impuestos-provinciales\|impuestos-provinciales]] | ✓ |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 1 de 23 | 0 | — | 2 | C |
| [[banco-preguntas#inspeccion-general-de-justicia\|inspeccion-general-de-justicia]] |  |  | ✓ |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 1 de 23 | 0 | — | 6 | C |
| [[banco-preguntas#negociacion-colectiva\|negociacion-colectiva]] | ✓ |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 1 de 23 | 0 | — | 9 | C |
| [[banco-preguntas#organizacion-del-estado-poderes\|organizacion-del-estado-poderes]] | ✓ |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 1 de 23 | 5 | sí (bloque en 1er parcial 2C-2025) | 2 | B |
| [[banco-preguntas#plagio-y-defraudacion\|plagio-y-defraudacion]] |  |  |  |  |  |  |  |  |  | ✓ |  |  |  |  |  |  |  |  |  |  |  |  |  | 1 de 23 | 0 | — | 5 | C |
| [[banco-preguntas#reglamentos-internos-y-sanciones\|reglamentos-internos-y-sanciones]] |  |  |  |  |  |  |  |  |  |  |  |  | ✓ |  |  |  |  |  |  |  |  |  |  | 1 de 23 | 0 | — | 9 | C |
| [[banco-preguntas#clasificacion-del-derecho\|clasificacion-del-derecho]] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 0 de 23 | 3 | — | 1 | C |
| [[banco-preguntas#norma-juridica-jerarquia\|norma-juridica-jerarquia]] |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 0 de 23 | 3 | — | 1 | C |

Verificación mecánica: cada columna suma exactamente el número de preguntas de su examen, y el total da 114 observaciones. Lo comprueba el script en cada corrida.

## 4. Reglas de tier

Se mantienen **las mismas reglas absolutas** del documento original, sin cambiarlas al crecer el denominador:

- **Tier A**: **≥4 apariciones** en finales fechados; o exactamente **3 + señal 2025-26 fuerte**.
- **Tier B**: no cumple A, y **2-3 apariciones**; o exactamente **1 + al menos una señal adicional**.
- **Tier C**: el resto.

Resultado: **A = 12 · B = 17 · C = 9**, sobre 38 temas canónicos (el nuevo es *relacion-y-contrato-de-trabajo*).

> **Nota sobre el umbral.** Con 16 finales, "4 apariciones" era un cuarto del corpus. Con 23, el equivalente proporcional serían 6. Aplicando ese umbral más exigente, el tier A quedaría en 9 temas y bajarían a B **derecho-y-fuentes**, **documentos-y-firma-digital** y **cheque**, que se quedaron en 4 apariciones mientras el corpus crecía. Se optó por **no cambiar la regla** — un cambio de regla a mitad de camino es peor que un tier levemente inflado —, pero esos tres temas son los que perdieron peso relativo y conviene tenerlo presente al repartir el tiempo de estudio.

### Los movimientos que produjo el corpus nuevo

| Tema | Antes | Ahora | Movimiento |
|---|---|---|---|
| defensa-del-consumidor | 3 de 16 | **7 de 23** | Era el tema A más flojo, sostenido por su señal reciente. Ahora es de los más frecuentes por derecho propio: apareció en F17, F18, F19 y F21 |
| contrato-concepto-y-elementos | 2 de 16 | **5 de 23** | **B → A**. Apareció en F17, F18 y F22 |
| sociedades-tipos-y-responsabilidad | 6 de 16 | 9 de 23 | Segundo tema más frecuente del corpus |
| jornada-de-trabajo | 1 de 16 | 3 de 23 | **C → B**. Apareció en F18 y F19; el kit no le tenía ficha |
| leasing-franchising-licencia | 1 de 16 | 2 de 23 | **C → B**. Apareció en F17 |
| derecho-y-moral | 1 de 16 | 2 de 23 | **C → B**. Apareció en F21 |
| derechos-del-trabajador-14bis | 0 de 16 | 1 de 23 | **C → B**. Primera aparición en un final fechado, en F20 |
| **relacion-y-contrato-de-trabajo** | no existía | **2 de 23** | **Tema nuevo, tier B.** Apareció en F17 y F21. No tiene ficha ni esqueleto en el kit |
| responsabilidad-civil, seguros, patentes-e-invencion | 1 de 16 | 2 de 23 | Los tres subieron con F20 y F21, confirmando la "flecha para arriba" que ya se les había marcado |

## 5. Curva de cobertura, final por final

De las N preguntas de cada examen, cuántas caen en tier A y cuántas en A+B.

| Final | N | En tier A | En A+B | Preguntas fuera de A+B (tier C) |
|---|---|---|---|---|
| F1 — 12/2007 (viejo) | 10 | 3 | **7** | impuestos-provinciales, negociacion-colectiva, etica-empresarial |
| F2 — 16/07/2010 | 5 | 3 | **5** | — |
| F3 — 29/06/2011 | 5 | 3 | **4** | inspeccion-general-de-justicia |
| F4 — 02/09/2015 | 5 | **4** | **5** | — |
| F5 — 09/02/2017 | 5 | **5** | **5** | — |
| F6 — 07/12/2017 | 3 | 3 | 3 | — |
| F7 — 03/07/2018 completo | 5 | 3 | **5** | — |
| F8 — 03/07/2018 reducido | 4 | 3 | **4** | — |
| F9 — 2018 Tema 1 | 5 | **5** | **5** | — |
| F10 — 2018 Tema 2 | 5 | 2 | 3 | acto-administrativo, plagio-y-defraudacion |
| F11 — 07/12/2018 | 5 | 3 | **5** | — |
| F12 — 14/12/2018 | 5 | 2 | **5** | — |
| F13 — 08/02/2019 | 5 | **4** | **4** | reglamentos-internos-y-sanciones |
| F14 — 07/2019 1ª | 5 | **5** | **5** | — |
| F15 — 07/2019 2ª | 5 | 3 | **5** | — |
| F16 — 29/10/2019 | 5 | **5** | **5** | — |
| F17 — jul 2015 1er llamado | 5 | 3 | **5** | — |
| F18 — jul 2015 2do llamado | 4 | 3 | **4** | — |
| F19 — dic 2015 1er llamado | 4 | 3 | **4** | — |
| F20 — dic 2019 1ra fecha | 5 | 2 | **5** | — |
| F21 — dic 2019 2da fecha | 4 | 1 | **4** | — |
| F22 — febrero 2025 | 5 | **5** | **5** | — |
| F23 — 14/12/2018 segunda version | 5 | **4** | **5** | — |

Totales sobre las 114 preguntas: **77 caen en tier A** y **107 en A+B**; las 7 restantes son de temas C.

## 6. Análisis para la regla 4-de-5

La condición de aprobación documentada (`Finales y Preguntas Típicas.txt`): "Toman 5 preguntas. Condición de Aprobación: Se debe obtener al menos 1 punto en 4 preguntas". Se puede dejar UNA en blanco, no dos.

Contando sobre los **17 finales con 5 preguntas completas**:

- Sabiendo **solo tier A**, hubo 4 o 5 preguntas de tier A en **8 de 17** finales. Dominar solo A sigue sin alcanzar como estrategia.
- Sabiendo **A+B**, hubo 4 o 5 preguntas de A+B en **16 de 17** finales. El único donde A+B cubría apenas 3 es F10 (2018 Tema 2), donde cayeron acto administrativo y plagio, ambos tier C.

La conclusión operativa no cambia y ahora se apoya en un corpus casi 40% más grande: **fichas profundas para los temas A, fichas medias para los B, y un párrafo mínimo digno para cada tema C**. La regla no exige excelencia en cinco preguntas, exige no quedarse mudo en más de una. Nada de esto es una probabilidad sobre el próximo llamado: es un conteo sobre 2007-2025.

El dato más tranquilizador del corpus nuevo: el final de **febrero de 2025 tuvo sus 5 preguntas en tier A**. El más reciente de todos es también el más "clásico".

## 7. Limitaciones

1. **El corpus sigue teniendo un hueco**: hay finales de 2007 a 2020 y uno de febrero de 2025, pero ninguno de 2021 a 2024 salvo el virtual de 2021.
2. ⚠️ **F16 (29/10/2019) probablemente no sea un final.** Su única fuente, `Finales y Preguntas Típicas.txt`, lo rotula "Preguntas **Parcial** 29/10/2019", y ese mismo archivo distingue de forma deliberada las dos categorías: las demás entradas dicen "Preguntas **Final**" con su fecha. Se lo mantiene en el denominador por continuidad con la versión anterior del banco, pero la atribución es dudosa. **Si se lo excluyera**, el denominador bajaría a 22 y perderían una aparición cada uno los cinco temas de ese examen: derecho-y-fuentes (pasaría a 3 de 22), sociedades-tipos-y-responsabilidad (8), marcas (5), documentos-y-firma-digital (3) y modalidades-contratacion-laboral (10). Los dos primeros conservarían su tier; **derecho-y-fuentes y documentos-y-firma-digital caerían de tier A a tier B**. Conviene tenerlo presente al repartir el tiempo de estudio: esos dos temas son los que más dependen de un examen de atribución incierta.
3. **F23** puede no ser un examen distinto de F12 (ver la advertencia de la sección 2).
4. **F6, F8, F18, F19 y F21 están incompletos** (3 o 4 consignas transcriptas de 5): sus temas pueden estar **subcontados**.
5. La columna de **señal s/f + virtual** mezcla compendios sin fecha, que probablemente dupliquen consignas de finales ya contados, con los dos finales virtuales. Por eso es señal y no observación.
6. Las **señales 2025-26** salen de parciales y de un documento de estudio de alumnos, no de finales.
7. **F1 (2007)** es formato viejo de 10 preguntas: infla levemente los conteos de sus temas.
8. El tier es **mecánico por frecuencia**: no dice nada de la profundidad ni de la dificultad con que se pregunta cada tema.
9. El [[programa-oficial-61-31|programa oficial de 2025]] admite que el final sea **oral**. Toda esta matriz sirve igual para elegir qué estudiar, pero no describe el formato garantizado del examen.

## 8. Fichas: estado de cobertura tras la actualización

Los cinco temas que el recálculo sobre 23 finales dejó en tier B sin ficha ya la tienen (escritas el 4/9/2026):

| Tema | Fracción | Ficha |
|---|---|---|
| relacion-y-contrato-de-trabajo | 2 de 23, tier B | [[ficha-relacion-y-contrato-de-trabajo\|relacion-y-contrato-de-trabajo]] |
| jornada-de-trabajo | 3 de 23, tier B | [[ficha-jornada-de-trabajo\|jornada-de-trabajo]] |
| leasing-franchising-licencia | 2 de 23, tier B | [[ficha-leasing-franchising-licencia\|leasing-franchising-licencia]] |
| derecho-y-moral | 2 de 23, tier B | [[ficha-derecho-y-moral\|derecho-y-moral]] |
| derechos-del-trabajador-14bis | 1 de 23, tier B | [[ficha-derechos-del-trabajador-14bis\|derechos-del-trabajador-14bis]] |

**Temas procedimentales** (la ficha necesita un paso a paso, no solo definiciones): marcas (registro ante el INPI), concursos y quiebras (proceso concursal), laboral-extinción (intimación, preaviso, indemnización), contratos con el Estado (licitación) y fondo de comercio (transmisión con publicación y oposición).

**Ya reciclados del kit del reducido**: contrato-concepto-y-elementos, laboral-extincion, concursos-y-quiebras, marcas y responsabilidad-civil. Con la actualización, cuatro de esos cinco son tier A.

## Relación con otras páginas

- [[banco-preguntas]] · [[indice-final-completo|hub del final completo]] · [[esqueletos-todos]] · [[confundibles]] · [[fuente-drive-ceitba-61-31]] · [[programa-oficial-61-31|programa-oficial-61-31]]

## Fuentes citadas

- [[banco-preguntas]], con los conteos verificados mecánicamente por `tools/drive-sync/recalcular_matriz.py`.
- Regla de aprobación 4-de-5: `Finales y Preguntas Típicas.txt`, sección "Modalidad".
- Finales nuevos: `raw/drive-ceitba/Examenes/Final/Finales 2015 (resueltos).pdf`, `raw/drive-ceitba/Examenes/COMPILADO derecho_al_infierno.pdf`, `raw/drive-ceitba/Examenes/Final/Febrero 2025/Final Derecho - Febrero 2025.jpg`, `raw/drive-ceitba/Examenes/Final/Tincho/2020 2C.docx`.
- Señales 2025-26: `.converted/finales/Derecho - Primeros Parciales Viejos.txt`, `Derecho - Segundos Parciales Viejos.txt`, `Derecho - Final Reducido.txt`.
