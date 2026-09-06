---
title: Muralla china
resumen: 'Tercer modelo de la clase, híbrido de confidencialidad e integridad, pensado para el conflicto de interés. Agrupa empresas en clases COI y usa el historial de lecturas del sujeto, que Bell-LaPadula no tiene, para decidir cada acceso.'
fuentes: ["[[clase-06-politicas-de-seguridad-y-control-de-acceso]]", "[[modelos-de-politica]]", "[[bell-lapadula]]", "[[modelos-de-integridad-de-biba]]"]
aliases: [Chinese Wall, Modelo de la pared china, Company Dataset, Conflict of Interest Class, Elemento temporal de la muralla china]
type: concepto
unidad: 2
clase: 6
orden: 8
created: 2026-09-04
updated: 2026-09-04
tags: [politicas-de-seguridad, muralla-china, conflicto-de-interes, confidencialidad, integridad, clase-06, sin-dictar]
sources: ["Clase 06 - Politicas.pdf"]
---

# Muralla china

**El tercer y último modelo de la clase, el único híbrido de confidencialidad e integridad, y el único con memoria: a diferencia de Bell-LaPadula, que sólo mira el nivel del sujeto y del objeto en el instante del acceso, acá lo que ya se leyó antes cambia para siempre lo que se puede leer después.**

Cubre las filminas **40-47** del deck de Políticas (`Clase 06 - Politicas.pdf`). La clase todavía no se dictó —hoy es **04/09/2026**, la clase es el **01/10/2026**— así que esta nota está escrita contra el PDF, sin transcripción.

## Un modelo híbrido para un problema distinto

La muralla china es un **modelo híbrido**: toma en cuenta [[confidencialidad-integridad-y-disponibilidad|confidencialidad e integridad]] a la vez, y a diferencia de [[bell-lapadula|Bell-LaPadula]] (sólo confidencialidad) y de [[modelos-de-integridad-de-biba|Biba]] (sólo integridad), se concentra en un problema de naturaleza distinta: el **conflicto de interés**. Es de uso extendido en ámbitos bursátiles y judiciales —algunos países exigen por ley medidas que lo prevengan—. Dos ejemplos de la propia filmina: impedir que un *trader* represente a dos clientes que compiten en el mismo mercado, o que un perito trabaje simultáneamente para la fiscalía y para el defendido en un mismo caso.

## Concepto y definiciones

La idea general: agrupar entidades en **clases de conflicto de interés**; controlar el acceso de sujetos a cada clase; controlar la **escritura** a todas las clases para impedir que se mueva información en contra de la política; y permitir que datos **desclasificados** sean vistos por todos.

- **Objetos**: ítems de información relacionados con una empresa.
- **Company Dataset (CD)**: conjunto de objetos relacionados con la **misma** empresa.
- **Conflict of Interest Class (COI)**: contiene los CD de empresas en conflicto de interés entre sí. **Se asume que cada objeto pertenece a exactamente un COI.**

**Ejemplo.** Dos COI: *entidades financieras* —con los CD de Citibank, Santander y Banco Francés— y *medios de prensa* —con los CD de Clarín, La Nación y Crónica—. Un sujeto que lee un CD dentro de un COI queda restringido respecto del resto de ese mismo COI (ver el elemento temporal, más abajo), pero nada le impide, en principio, acceder también a un CD del **otro** COI: leer sobre Citibank y sobre Clarín en el mismo día no genera ningún conflicto, porque están en categorías de negocio distintas.

## Elemento temporal: lo que Bell-LaPadula no tiene

Si $S$ lee cualquier CD de un COI, **no puede volver a leer otra CD del mismo COI, nunca** — se impide que use información obtenida antes para tomar decisiones que afecten a intereses en competencia.

Este es un requerimiento **nuevo**, que Bell-LaPadula no captura: BLP no tiene memoria de qué se leyó antes, sólo compara niveles y compartimentos en el instante del acceso —dos lecturas del mismo sujeto, en momentos distintos, se evalúan de forma completamente independiente—. La muralla china, en cambio, hace que el **historial de accesos** del sujeto forme parte de la decisión: la primera lectura dentro de un COI cierra la puerta a cualquier otra empresa competidora de ese mismo COI, para siempre y sin excepción.

## Condición simple de seguridad

$S$ puede leer $o$ si se cumple **alguna** de estas tres condiciones:

$$\begin{aligned}
&\text{1. } \exists\, o' \text{ leído previamente por } S \text{ tal que } CD(o) = CD(o') \quad \text{(ya accedió a un dato de esa misma empresa)}\\
&\text{2. } \forall\, o' \text{ leído previamente por } S: \ COI(o) \ne COI(o') \quad \text{(nunca accedió a nada de ese COI)}\\
&\text{3. } o \text{ es un objeto declasificado} \quad \text{(información que dejó de ser confidencial, p. ej. un balance anual ya vencido)}
\end{aligned}$$

Las tres condiciones cubren, en orden, los tres casos posibles: **repetir** acceso a la misma empresa (siempre permitido — leer de nuevo algo de Citibank no agrega ningún conflicto que ya no existiera), **entrar por primera vez** a un COI (permitido, porque todavía no hay ningún compromiso previo con un competidor de ese sector), o acceder a algo que ya **salió** del ámbito de la confidencialidad. Cualquier otro caso —leer una segunda empresa **distinta** dentro de un COI ya tocado, sin que el objeto esté desclasificado— queda prohibido por omisión: es exactamente el elemento temporal de la sección anterior, escrito como condición formal.

## Por qué la escritura necesita su propia regla

Si $s_1$ y $s_2$ acceden a dos CD que pertenecen al **mismo** COI (dos empresas en competencia, por ejemplo) no hay, todavía, conflicto de interés: cada uno leyó lo suyo, y la condición simple ya se encargó de que ninguno de los dos haya leído ambas. Y si $s_1$ y $s_2$ acceden **ambos** a un tercer CD de otro COI, tampoco lo hay: es información neutral respecto del conflicto entre las dos primeras empresas.

**Pero** si uno de los dos puede *escribir* información en ese CD común, se abre un canal indirecto —exactamente el mismo mecanismo que el [[modelos-de-integridad-de-biba#Base común a los tres modelos|camino de transferencia de información de Biba]] o que la condición de cierre de Bell-LaPadula— por el que información de una empresa puede terminar filtrándose, a través del CD compartido, hacia alguien con acceso al competidor. $s_1$ escribe en el CD neutral algo que refleja lo que sabe de su empresa; $s_2$, que también lee ese CD neutral, termina enterándose indirectamente de información de la competencia de $s_1$ sin haber leído nunca el CD original.

## Propiedad de cierre

$S$ puede escribir $o$ si se cumplen **las dos** condiciones:

$$\begin{aligned}
&\text{1. } S \text{ puede leer } o \text{ según la condición simple de seguridad}\\
&\text{2. Para todo objeto no público } o': \ S \text{ puede leer } o' \implies CD(o') = CD(o)
\end{aligned}$$

En prosa: para poder escribir un objeto, **todo** lo que ese sujeto puede leer tiene que pertenecer a la misma empresa que el objeto en cuestión — *"el dato es escrito por un miembro de la empresa"*, en la formulación de la propia filmina. Si $S$ tiene acceso de lectura a información de más de una empresa (algo que la condición simple permite, siempre que sean de COI distintos), $S$ **no puede escribir nada**: cualquier objeto que escribiera podría, en principio, filtrar lo que sabe de cualquiera de las empresas a las que tiene acceso.

Es la misma lógica exacta de la *-property* de Bell-LaPadula —impedir canales de escritura que desarmen lo que la condición de lectura ya protegía—, aplicada al vocabulario de COI y CD en lugar de niveles y compartimentos: en los dos modelos, la regla de escritura existe únicamente para tapar el agujero que la regla de lectura, sola, dejaría abierto.

## Comparación con Bell-LaPadula

$$\begin{array}{l|l|l}
 & \text{Bell-LaPadula} & \text{Muralla china}\\ \hline
\text{Qué protege} & \text{Confidencialidad} & \text{Confidencialidad e integridad (conflicto de interés)}\\
\text{Con qué compara} & \text{Nivel/compartimento del sujeto y el objeto} & \text{Historial completo de lecturas del sujeto}\\
\text{¿Tiene memoria?} & \text{No — cada acceso se evalúa de forma independiente} & \text{Sí — el elemento temporal es intrínseco al modelo}\\
\text{Por qué hace falta la regla de escritura} & \text{Bloquear el canal indirecto lectura-alto/escritura-bajo} & \text{Bloquear el canal indirecto vía un CD compartido}
\end{array}$$

La fila que más distingue a los dos modelos es la de la memoria: implementar la muralla china exige un sistema que **registre y consulte el historial de accesos** de cada sujeto para cada decisión de lectura, algo que Bell-LaPadula, con su comparación puntual de niveles, no necesita.

## Ver también

- [[clase-06-politicas-de-seguridad-y-control-de-acceso#8. Muralla china|Clase 06 — Políticas de seguridad y control de acceso § 8. Muralla china]]
- [[bell-lapadula|Bell-LaPadula]] — el modelo del que la propiedad de cierre de esta nota copia la lógica, adaptada a COI y CD
- [[modelos-de-integridad-de-biba|Modelos de integridad de Biba]] — el camino de transferencia de información, la versión de Biba del mismo canal indirecto que motiva la propiedad de cierre acá
- [[confidencialidad-integridad-y-disponibilidad|Confidencialidad, integridad y disponibilidad]] — por qué este modelo cuenta como híbrido de las dos primeras propiedades
- [[modelos-de-politica|Modelos de política]] — el tercer modelo concreto de la familia que abre esta sección
- [[composicion-de-politicas|Composición de políticas]] — qué pasa al intentar combinar modelos como este con otros, en el resto de la clase
