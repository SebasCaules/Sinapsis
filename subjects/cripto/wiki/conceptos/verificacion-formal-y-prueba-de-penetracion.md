---
title: Verificación formal y prueba de penetración
resumen: 'Contraste entre dos métodos escritos con la misma estructura de precondiciones y poscondiciones: la verificación formal puede probar ausencia de vulnerabilidades pero escala mal; la prueba de penetración nunca la prueba.'
fuentes: ["[[clase-08-principios-de-diseno-y-vulnerabilidades]]", "[[video-09-pentesting-metodologia]]", "[[confianza-y-aseguramiento]]"]
aliases: [Verificación formal y prueba de penetración, Verificación formal, Definición de prueba de penetración, Pentest ético, Problema SAT, Precondiciones y poscondiciones]
type: concepto
unidad: 2
clase: 8
orden: 8
created: 2026-09-04
updated: 2026-09-04
tags: [seguridad, pentesting, verificacion-formal, sat, ethical-hacking, clase-08, sin-dictar]
sources: ["Clase 13 - Pentesing.pdf"]
---

# Verificación formal y prueba de penetración

**Por qué un pentest exitoso no demuestra que un sistema es seguro, y por qué eso no es una debilidad del método sino su definición.** Los dos procesos se escriben con la misma estructura de precondiciones y poscondiciones, y precisamente por eso el contraste entre lo que cada uno puede probar queda tan nítido: uno alcanza la ausencia de vulnerabilidades, al costo de escalar mal; el otro nunca la alcanza, pero prueba el sistema entero, personas incluidas.

Cubre las filminas **2 a 5** del deck de Pentesting, con las que abre la clase. **Esta clase todavía no se dictó** (hoy es 04/09/2026); lo que sigue está escrito contra el PDF, cruzado con [[video-09-pentesting-metodologia|video-09]], que desarrolla en voz el mismo bloque sobre un deck equivalente, más lecturas propias rotuladas como tales.

## Las dos definiciones, con la misma estructura

La filmina 2, **verificación formal**: es la **verificación matemática de que un sistema cumple con ciertas restricciones**.

$$\text{Precondiciones y Entradas} \;\longrightarrow\; \mathrm{Op}_1 \ldots \mathrm{Op}_n \;\longrightarrow\; \text{Poscondiciones}$$

- **Precondiciones** — hipótesis sobre el estado del sistema.
- **Poscondiciones** — resultado de aplicar las operaciones del sistema a un input dado.
- **Requerimiento** — que las poscondiciones cumplan las restricciones.

La filmina 3, **prueba de penetración**, se escribe deliberadamente con la misma forma para que el contraste salte a la vista:

- **Precondiciones** — hipótesis sobre el estado del sistema **y la existencia de una vulnerabilidad**.
- **Poscondiciones** — **sistema comprometido**.
- **Ejecución** — aplicar pruebas para intentar mover al sistema del estado inicial al estado comprometido.

La diferencia que ya se puede leer con sólo mirar las dos listas: la verificación formal parte de una hipótesis sobre el estado del sistema, sin más; el pentest agrega a esa hipótesis **la existencia de una vulnerabilidad concreta** —la que se va a probar—, y su poscondición no es "un resultado que cumple restricciones", es directamente "el sistema comprometido". Uno describe una propiedad que se busca verificar; el otro describe un ataque que se busca ejecutar.

## Similitudes y diferencias: existencia contra ausencia

La filmina 4 es la que hay que tener resuelta de memoria, porque condensa el resultado del bloque entero:

| | Verificación formal | Prueba de penetración |
|---|---|---|
| Prueba **existencia** de vulnerabilidades | Sí | Sí |
| Prueba **ausencia** de vulnerabilidades | Sí — pero para eso debe incluir **todos** los factores externos, cosa que en la práctica no ocurre: se prueba ausencia en un algoritmo, programa o ambiente acotado, ignorando instalación y uso | **No, nunca** |

El matiz que hace que la fila de "ausencia" no sea una victoria limpia para la verificación formal: probar ausencia de vulnerabilidades exige incluir **todos** los factores externos del sistema real, y en la práctica eso nunca ocurre. Lo que efectivamente se prueba es la ausencia de vulnerabilidades **en un algoritmo, programa o ambiente acotado**, ignorando instalación y uso — que es exactamente donde entran los problemas que ni la política ni el diseño anticiparon. Según `video-09`, la filmina de 32:35 lo dice sin rodeos: la verificación formal prueba ausencia **sólo si** incluye todos los factores externos, y eso "en la práctica no ocurre".

> [!quote]- Del video 09 — por qué el pentest no prueba nada sobre la ausencia (33:45)
> "Si hago un pen testing y no encuentro nada, lo que estoy probando es que simplemente yo no las encontré."

**Un pentest limpio no es un certificado de seguridad.** Es, en el mejor de los casos, evidencia de que el equipo que probó no encontró nada con el tiempo y las hipótesis que tenía — lo cual es información distinta, y mucho más débil, que "no hay nada que encontrar". Esta asimetría es la razón profunda de por qué la [[metodologia-de-hipotesis-de-falla|Metodología de hipótesis de falla]] que sigue en la clase nunca declara a un sistema "seguro": sólo documenta qué vulnerabilidades se buscaron y no se encontraron.

### Por qué la verificación formal escala mal: el problema SAT

La filmina no lo explica —es aporte exclusivo de `video-09`, filmina de 23:51 en adelante—, pero es la razón técnica detrás de la fila de "ausencia" de la tabla. Verificar una pieza de código con pre y poscondiciones es **equivalente al problema `SAT`** —satisfacibilidad booleana: dada una fórmula de productos y sumas de variables booleanas, determinar si existe una asignación que la haga verdadera, sin construir la tabla de verdad completa—, que es **`NP`-completo**. Un problema `NP`-completo no tiene, hasta donde se sabe, un algoritmo que lo resuelva en tiempo polinomial en el peor caso: el costo de verificar crece mucho más rápido que el tamaño del código a verificar. Por eso la verificación formal **no escala** al ritmo al que crece el software, y se reserva a piezas de criticidad extrema —el ejemplo que da la cátedra es el chip de control de un misil o de una central nuclear—, donde el costo de una falla es tan alto que justifica pagar el costo de la prueba exhaustiva.

Es la misma idea que ya aparece, sin la justificación técnica, en [[confianza-y-aseguramiento#Los tres niveles de evidencia|Confianza y aseguramiento]]: la evidencia formal es la más rigurosa de los tres niveles y también la más cara, y sólo se paga cuando el riesgo lo amerita.

### El misil que aloca memoria y nunca la libera

**El mejor ejemplo del corpus de por qué las precondiciones son parte del diseño y no un detalle accesorio**, y aunque no está en ninguna filmina de este deck, `video-09` lo trae precisamente para ilustrar este punto (27:40). Una empresa auditora reporta como bug lo que parecía trivial: el código en C del chip de control de un misil **aloca memoria todo el tiempo para hacer cálculos y nunca la libera**. Los desarrolladores contestan que es un *feature*, no un bug: alocaban memoria extra deliberadamente para no tener que correr la rutina de liberación —que agrega complejidad y superficie de error—, y para cuando el misil explotaba, la fuga de memoria ya no importaba. **El tiempo hasta que la fuga se volviera un problema real era mucho mayor que el tiempo de vida promedio del misil.**

Lo que a primera vista se ve como un descuido de implementación resulta ser, mirado con las precondiciones correctas, una decisión de diseño consciente: la precondición implícita —"este proceso vive minutos, no días"— hace que la poscondición "memoria sin liberar" deje de violar ninguna restricción real del sistema. Es la ilustración concreta de por qué, en la tabla de arriba, "probar ausencia" exige *todos* los factores externos: sin la precondición de vida útil, cualquier verificador —formal o no— reportaría este código como defectuoso, cuando en su contexto real no lo es.

## Objetivos del pentest, y por qué se llama ethical hacking

La filmina 5 cierra el bloque definiendo el objetivo: probar la eficacia de los controles de seguridad de un sistema **intentando violar la política de seguridad**, requiriendo ejecutar técnicas similares a las de un atacante — de ahí el nombre, **`ethical hacking`**. Dos precisiones que trae la propia filmina:

- **Es análogo a las pruebas manuales de un sistema y no reemplaza un buen diseño e implementación.** Un pentest exitoso a posteriori no compensa haber ignorado seguridad durante el diseño — es exactamente la advertencia de [[aseguramiento-en-el-ciclo-de-vida|Aseguramiento en el ciclo de vida]], que insiste en no dejar la seguridad para el final del proyecto.
- **Prueba al sistema como un todo, no sólo sus aspectos técnicos** — lo que incluye a las personas y a los procesos. Es la razón última de por qué el [[casos-de-prueba-de-penetracion#Caso: ataque externo por ingeniería social|caso de ingeniería social]] que desarrolla más adelante la Metodología de Hipótesis de Falla pertenece a esta misma disciplina, aunque no toque una sola línea de código.

`video-09` agrega, sobre esta misma filmina (35:10), el par de roles que se arma alrededor de esa idea: el **red team** ataca —tiene que ponerse en la cabeza de un atacante— y el **blue team** defiende. Y trae el motivo práctico por el que casi nunca conviene que el mismo equipo que desarrolló un sistema lo pentestee:

> [!quote]- Del video 09 — por qué no se puede pentestear el sistema propio (36:41)
> "Uno tiene que tratar de buscar la manera de destruirlo, y naturalmente, si uno es parte del equipo que lo desarrolló, va a tener cierta resistencia a destruirlo."

Es la misma lógica que separa QA de desarrollo, ya señalada en [[confianza-y-aseguramiento|Confianza y aseguramiento]]: revisar el propio trabajo con la hostilidad necesaria para encontrarle fallas es, en la práctica, un conflicto de interés.
