---
title: Confianza y aseguramiento
resumen: 'Vocabulario para justificar con evidencia por qué se confía en un sistema: sistema confiable y aseguramiento, las cuatro vías para establecer confianza, la cadena política, aseguramiento y mecanismo, y los tres niveles de evidencia.'
fuentes: ["[[clase-08-principios-de-diseno-y-vulnerabilidades]]", "[[principios-de-diseno]]", "[[riesgo-y-seguridad-relativa]]", "[[video-08-vulnerabilidades]]"]
aliases: [Sistema confiable y aseguramiento, Política aseguramiento mecanismo, Niveles de evidencia, Evidencia informal semiformal y formal, Revisión por expertos]
type: concepto
unidad: 2
clase: 8
orden: 2
created: 2026-09-04
updated: 2026-09-06
tags: [seguridad, confianza, aseguramiento, evidencia, verificacion-formal, clase-08, sin-dictar]
sources: ["Clase 12 - Analisis de vulnerabilidades.pdf"]
---

# Confianza y aseguramiento

**El vocabulario con el que se responde, sin apelar a la fe, a la pregunta "¿por qué se confía en que este sistema es seguro?".** Fija dos términos —confiable y aseguramiento— y una regla que se repite en el resto del bloque: afirmar que algo es seguro sin mostrar evidencia es, en sí mismo, una señal de alarma.

Cubre las filminas **2 a 5** del deck `Clase 12 - Analisis de vulnerabilidades.pdf`. **Esta clase todavía no se dictó** (hoy es 04/09/2026, la clase es el 15/10): no hay transcripción propia, y lo que sigue está escrito contra el PDF —renderizado y verificado a 150 dpi— más [[video-08-vulnerabilidades|video-08]], que proyecta un deck con el mismo nombre de archivo y el mismo contenido en este tramo.

## Los dos términos que sostienen todo el bloque

La filmina 2 los define en un mismo cuadro:

| Término | Definición de la filmina |
|---|---|
| **Sistema confiable** | Cuenta con **suficiente evidencia creíble** para que se crea que va a cumplir un conjunto de requerimientos. **La confianza no es una escala discreta** — es gradual, no un sí o no |
| **Aseguramiento** | La **confianza obtenida a través de técnicas específicas**: es la justificación de por qué se confía |

La filmina remata con una advertencia explícita, en un recuadro propio: **estos conceptos no aplican sólo a seguridad**. Según `video-08`, el docente desarrolla la idea diciendo que la seguridad informática le copia mucho a la seguridad financiera: certificaciones, estandarización de procesos, auditorías de terceros, requisitos regulatorios para empresas que cotizan en bolsa. La comparación no es adorno: es la razón de que el resto de esta nota hable en términos de *evidencia* y *justificación* en vez de *convicción*.

**Por qué "gradual, no discreta" no es un detalle menor.** Un sistema no es "seguro" o "inseguro" en bloque: tiene grados de confianza distintos según qué requerimiento se mire y contra qué evidencia se lo sostenga. Es el mismo espíritu que [[estado-de-un-criptosistema|Estado de un criptosistema]] aplica a un esquema criptográfico concreto —seguro, debilitado o quebrado son estados relativos a una prueba, no juicios absolutos—, trasladado acá a un sistema completo.

## Cuatro vías para establecer confianza

La filmina 3 da cuatro caminos, con una jerarquía marcada por flechas en el propio diagrama:

- **Procesos de aseguramiento**
- **Adhesión a estándares**
- **Documentación**
- **Revisión por expertos**

El diagrama señala que la **revisión por expertos es la más efectiva cuando existen las otras tres**, y a la vez la **más costosa y la más compleja** — no reemplaza a las demás, las corona. Un experto que revisa un sistema sin procesos documentados, sin estándares y sin nada escrito revisa a ciegas; un experto que revisa sobre esa base encuentra lo que los procesos automáticos no ven.

> [!nota]- Qué dibuja exactamente la filmina, y por qué la lectura de arriba es una interpretación
> Alrededor de la lista de cuatro ítems, la lámina traza: una flecha rotulada *"Lleva a"* que sale de *Procesos de aseguramiento* y entra en una llave que agrupa *Documentación* y *Revisión por expertos*; una segunda llave que abarca los cuatro ítems, a la que llega una flecha rotulada *"Es más efectiva si existen"*; y dos cajas, *"Costosos"* y *"Complejos"*, a las que apuntan sendas flechas diagonales.
>
> Los orígenes de esa última flecha y de las dos diagonales **no están anclados a ningún ítem**: arrancan en espacio en blanco, a la derecha y por debajo del bloque de viñetas. Con los orígenes sin anclar, quién es el sujeto de *"Es más efectiva si existen"*, de *"Costosos"* y de *"Complejos"* queda a cargo de quien mira la lámina. *(Lectura nuestra del diagrama: puestos juntos, esos trazos se leen como que la revisión por expertos es la más efectiva cuando ya existen las otras tres vías, y a la vez la más costosa y la más compleja. Es una lectura, no algo que el diagrama rotule.)*

## La cadena de tres niveles

La filmina 4 es la que la cátedra más repite, según `video-08`:

$$\text{Política} \;\longrightarrow\; \text{Aseguramiento} \;\longrightarrow\; \text{Mecanismo}$$

| Nivel | Qué es |
|---|---|
| **Política** | Requerimientos que definen **explícitamente** las expectativas de seguridad |
| **Aseguramiento** | Justificación de que el mecanismo sigue la política, **a través de evidencia** |
| **Mecanismo** | Ejecutables diseñados e implementados para hacer cumplir las políticas |

> **Errata de la filmina, confirmada renderizando la página 4 a 150 dpi:** el renglón de *Mecanismo* dice literalmente *"Ejecutables diseñados e implementados para cumplir hacer cumplir las políticas"* — duplicación defectuosa de "cumplir". La tabla de arriba va con la lectura corregida.

**Por qué el orden de la cadena importa más que los tres nombres sueltos.** Sin política, "mecanismo seguro" no significa nada — seguro *contra qué*—. Sin aseguramiento, un mecanismo que por casualidad cumple la política no se distingue de uno que la viola y todavía no se probó: la diferencia entre los dos es exactamente la evidencia que falta. El aseguramiento es el eslabón que convierte "creemos que funciona" en "podemos justificar por qué funciona".

**El punto que `video-08` marca como el más importante de este tramo:** decir que algo es seguro sin ofrecer evidencia es, en sí mismo, una señal de alarma. El ejemplo que trae el video es el de un sistema de voto electrónico cuyo responsable afirmaba que era *"totalmente seguro"* sin mostrar un solo documento que lo sostuviera — la ausencia de evidencia no es neutral, es sospechosa.

## Los tres niveles de evidencia

La filmina 5 clasifica la evidencia, de menos a más rigurosa:

| Nivel | Qué incluye |
|---|---|
| **Informal** | Enunciados, analogías |
| **Semiformal** | Pseudocódigo, análisis caso por caso |
| **Formal** | Métodos matemáticos, lenguajes formales de demostración de teoremas |

Según `video-08`, la cátedra aclara que **probar formalmente una pieza de código sólo se justifica en criticidad extrema** —el ejemplo que da es un riesgo de explosión nuclear—, porque el costo de la verificación formal crece mucho más rápido que el del resto del desarrollo. Es la misma idea que retoma, con más detalle y con la razón técnica de por qué escala tan mal —la equivalencia con el problema `SAT`, `NP`-completo—, la sección de [[verificacion-formal-y-prueba-de-penetracion|verificación formal contra prueba de penetración]] del deck de Pentesting: los dos bloques convergen en el mismo punto desde ángulos distintos, uno hablando de evidencia y el otro de metodología.

**Por qué la escala tiene sólo tres escalones y no un continuo.** Cada nivel exige una inversión de orden de magnitud distinto sobre el anterior: pasar de un enunciado en prosa a pseudocódigo revisable es barato; pasar de pseudocódigo a una demostración matemática formal exige herramientas, tiempo de especialistas y, muchas veces, reescribir el sistema en un lenguaje formal desde cero. La clase no da una fórmula de costo, pero la conclusión operativa es clara: **el nivel de evidencia que se elige es una decisión de riesgo**, no un ideal a maximizar siempre — el mismo razonamiento que [[riesgo-y-seguridad-relativa|Riesgo y seguridad relativa]] aplica a la elección de con qué proteger un sistema criptográfico.

## Dónde encaja esto en el resto de la clase

Esta nota da el vocabulario; las siguientes lo usan sin volver a definirlo:

- [[aseguramiento-en-el-ciclo-de-vida|Aseguramiento en el ciclo de vida]] toma la cadena Política → Aseguramiento → Mecanismo y la distribuye sobre las etapas de un proyecto.
- [[modelado-de-amenazas|Modelado de amenazas]] es, en el fondo, un proceso para **producir evidencia** de qué amenazas existen y qué tan bien están cubiertas — es aseguramiento aplicado al diseño, antes de que exista el sistema.
- La distinción entre **verificación formal** (evidencia del nivel más alto, pero acotada a un ambiente controlado) y **prueba de penetración** (nunca alcanza evidencia formal, pero prueba el sistema real) que cierra la clase de Pentesting es, otra vez, la misma escala de esta nota aplicada a dos técnicas concretas.
