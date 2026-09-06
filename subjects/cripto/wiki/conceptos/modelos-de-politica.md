---
title: Modelos de política
resumen: 'Un modelo describe una familia de políticas y no una política puntual, y por eso permite reutilizar demostraciones e instanciar políticas nuevas sin volver a probarlas. La clase da tres, Bell-LaPadula, Biba y muralla china.'
fuentes: ["[[clase-06-politicas-de-seguridad-y-control-de-acceso]]", "[[politica-de-seguridad-y-sistema-seguro]]", "[[lenguajes-de-descripcion-de-politicas]]", "[[confidencialidad-integridad-y-disponibilidad]]"]
aliases: [Modelo de política, Familia de políticas, Marco teórico de una política]
type: concepto
unidad: 2
clase: 6
orden: 5
created: 2026-09-04
updated: 2026-09-04
tags: [politicas-de-seguridad, modelos-de-seguridad, clase-06, sin-dictar]
sources: ["Clase 06 - Politicas.pdf"]
---

# Modelos de política

**La bisagra de una sola filmina entre la parte conceptual de la clase —qué es una política, cómo se escribe, cómo se formaliza C-I-D— y la parte de reglas concretas que sigue: Bell-LaPadula, Biba y la muralla china.** Sin esta nota, esos tres nombres parecen tres temas sueltos; con ella, son tres instancias de una misma cosa.

Cubre la filmina **14** del deck de Políticas (`Clase 06 - Politicas.pdf`). La clase todavía no se dictó —hoy es **04/09/2026**, la clase es el **01/10/2026**— así que esta nota está escrita contra el PDF, sin transcripción.

## Qué es un modelo, y en qué se diferencia de una política

Un **modelo** describe una **familia de políticas**, no una política puntual. La diferencia con los [[lenguajes-de-descripcion-de-politicas|lenguajes de descripción de políticas]] de la sección anterior es de nivel de abstracción: un lenguaje de alto nivel (el ejemplo cerrado de la sección 4, con $S$, $O$, $R$, $A$ fijos) describe **una** política puntual, para un sistema concreto. Un modelo, en cambio, es el molde del que salen muchas políticas distintas — Bell-LaPadula no es una política, es una **forma** de escribir políticas de confidencialidad (cualquier asignación concreta de niveles y compartimentos a sujetos y objetos, siempre que respete las condiciones del modelo, es una política válida dentro de ese modelo).

## Por qué tener un modelo, en vez de escribir cada política desde cero

Un modelo provee dos cosas que una política aislada no da:

1. **Un marco teórico común**, que permite **reutilizar demostraciones** entre políticas distintas que instancian el mismo modelo. Si ya está probado que el modelo Bell-LaPadula, seguido al pie de la letra, nunca produce un estado inseguro —eso es exactamente lo que hace el [[bell-lapadula#Bell-LaPadula|Teorema básico de la seguridad]]—, entonces **cualquier** política concreta que se exprese con etiquetas y compartimentos de BLP hereda esa garantía sin necesidad de una prueba nueva.
2. **Simplifica el desarrollo de políticas nuevas**: no hay que reprobar desde cero que una política es consistente si ya se sabe que el modelo del que sale lo es. Diseñar una política de acceso para una organización concreta se reduce a **instanciar** el modelo —elegir los niveles, las categorías, los sujetos— en vez de inventar reglas de transición y después demostrar que son seguras.

## Los tres modelos que da la clase, y de qué propiedad se ocupa cada uno

Las tres secciones que siguen en la clase son tres modelos con exactamente ese estatus: cada uno fija su propio vocabulario de sujetos, objetos y reglas de transición, y cada uno viene acompañado de una prueba de que seguir las reglas alcanza para no salir nunca del conjunto de estados autorizados —la instancia concreta del [[bell-lapadula#Bell-LaPadula|Teorema básico de la seguridad]], que es el ejemplo canónico de esa prueba.

$$\begin{array}{l|l}
\text{Modelo} & \text{Propiedad de C-I-D que protege}\\ \hline
\text{Bell-LaPadula} & \text{Confidencialidad}\\
\text{Biba} & \text{Integridad}\\
\text{Muralla china} & \text{Confidencialidad e integridad (conflicto de interés)}
\end{array}$$

Cada uno responde a la formalización de [[confidencialidad-integridad-y-disponibilidad|Confidencialidad, integridad y disponibilidad]] con una partición de estados concreta y un par de reglas de transición (típicamente, condiciones separadas para lectura y para escritura) que garantizan no cruzarla nunca — la misma estructura de [[politica-de-seguridad-y-sistema-seguro|Política de seguridad y sistema seguro]], instanciada tres veces.

## Ver también

- [[clase-06-politicas-de-seguridad-y-control-de-acceso#5. Modelos de política|Clase 06 — Políticas de seguridad y control de acceso § 5. Modelos de política]]
- [[politica-de-seguridad-y-sistema-seguro|Política de seguridad y sistema seguro]] — la partición de estados y la garantía sobre transiciones que cada modelo instancia
- [[confidencialidad-integridad-y-disponibilidad|Confidencialidad, integridad y disponibilidad]] — la propiedad concreta que cada modelo protege
- [[lenguajes-de-descripcion-de-politicas|Lenguajes de descripción de políticas]] — el nivel de abstracción anterior: una política puntual, no una familia
- [[bell-lapadula|Bell-LaPadula]], [[modelos-de-integridad-de-biba|Modelos de integridad de Biba]], [[muralla-china|Muralla china]] — los tres modelos concretos que desarrolla el resto de la clase
- [[composicion-de-politicas|Composición de políticas]] — qué pasa cuando hay que combinar dos instancias de un modelo, o dos modelos distintos
