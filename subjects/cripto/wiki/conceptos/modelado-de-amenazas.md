---
title: Modelado de amenazas
resumen: 'Proceso que documenta qué es lo que no se quiere que pase en un sistema y por qué caminos podría pasar; se organiza en el ciclo iterativo de cinco pasos de Microsoft y obliga a que las políticas eliminen toda amenaza documentada.'
fuentes: ["[[clase-08-principios-de-diseno-y-vulnerabilidades]]", "[[video-08-vulnerabilidades]]", "[[confianza-y-aseguramiento]]"]
aliases: [Ciclo de modelado de amenazas de Microsoft, Threat modeling, Perspectivas de modelado de amenazas, Identify Security Objectives, Conceptualizar la aplicación]
type: concepto
unidad: 2
clase: 8
orden: 4
created: 2026-09-04
updated: 2026-09-04
tags: [seguridad, modelado-de-amenazas, threat-modeling, microsoft, clase-08, sin-dictar]
sources: ["Clase 12 - Analisis de vulnerabilidades.pdf"]
---

# Modelado de amenazas

**El proceso con el que se documenta, antes o después de construir un sistema, qué es lo que no se quiere que pase y por qué caminos podría pasar igual.** Es el proceso completo del que las tres notas siguientes —[[descomposicion-de-la-aplicacion|Descomposición de la aplicación]], [[stride-y-arboles-de-ataque|STRIDE y árboles de ataque]] y la identificación de vulnerabilidades— desarrollan un paso cada una: esta nota da el mapa completo antes de entrar al detalle.

Cubre las filminas **9 a 13** del deck `Clase 12 - Analisis de vulnerabilidades.pdf`. **Esta clase todavía no se dictó** (hoy es 04/09/2026, la clase es el 15/10): no hay transcripción propia, y lo que sigue está escrito contra el PDF más [[video-08-vulnerabilidades|video-08]].

## Qué documenta y qué exige de las políticas

La filmina 9 define el modelado de amenazas como el proceso que **documenta los aspectos de seguridad que interesan en el sistema**, con una consecuencia normativa fuerte: **las políticas del sistema deben eliminar todas las amenazas documentadas**. No es un ejercicio descriptivo que termina en un documento archivado — cada amenaza que el proceso identifica genera una obligación sobre el diseño.

Da además tres **perspectivas** posibles, explícitamente no excluyentes:

| Perspectiva | Explota |
|---|---|
| **Centrada en el atacante** | Los objetivos de un atacante |
| **Centrada en el software** | Tipos de ataques a componentes |
| **Centrada en productos** (*assets*) | Ataques a productos o servicios |

Las tres perspectivas no compiten: un modelado completo suele combinarlas, porque cada una hace visibles amenazas que las otras dos pasan por alto. Pensar desde el atacante ("¿qué querría lograr alguien que ataca este sistema?") encuentra amenazas de negocio; pensar desde el software ("¿qué tipo de ataque afecta a un componente como éste?") encuentra amenazas técnicas genéricas; pensar desde los productos ("¿qué pasa si este activo específico se compromete?") encuentra amenazas propias del dominio.

## Entradas y salidas

La filmina 10 da lo que hace falta antes de empezar y lo que el proceso produce:

- **Entradas**: conocimiento de la función primaria de la aplicación, casos de uso e historias, flujo de datos y modelos entidad-relación, diagramas de despliegue.
- **Salidas**: lista de amenazas y lista de vulnerabilidades.

Según `video-08`, el docente resalta que el **conocimiento de la función primaria** es la entrada **más importante** de las cinco — está resaltada en azul en la propia filmina. La razón es directa: sin entender qué hace el sistema en su núcleo no hay forma de saber qué amenazas importan de verdad. Un mismo diagrama de despliegue —browser, firewall, web server, base de datos— sirve para modelar amenazas de un sistema de historias clínicas o de un sistema de e-commerce, pero las amenazas que de verdad importan en cada caso son completamente distintas, y esa diferencia sólo la aporta saber qué hace el sistema.

## El ciclo de cinco pasos de Microsoft

La filmina 11 es un diagrama, tomado de un artículo de Microsoft en `msdn.microsoft.com` y reproducido sin modificaciones por la cátedra, que organiza todo el proceso como un ciclo:

![Ciclo de modelado de amenazas de Microsoft](../../assets/clase08-ciclo-modelado-de-amenazas.png)

| Paso | Nombre | Qué pide | Se desarrolla en |
|---|---|---|---|
| 1 | **Identify Security Objectives** | Confidencialidad, integridad, disponibilidad; partir de los objetivos del sistema y considerar límites — la pregunta guía es **qué es lo que NO se quiere que pase** | Esta nota, más abajo |
| 2 | **Application Overview** | Esquematizar el despliegue, identificar roles y sus casos de uso, identificar tecnologías, identificar mecanismos de seguridad ya presentes | Esta nota, más abajo |
| 3 | **Decompose Application** | Identificar dónde cambia el nivel de confianza requerido, y el flujo de datos entre esas zonas | [[descomposicion-de-la-aplicacion\|Descomposición de la aplicación]] |
| 4 | **Identify Threats** | A partir de listas recurrentes o derivando amenazas mediante preguntas | [[stride-y-arboles-de-ataque\|STRIDE y árboles de ataque]] |
| 5 | **Identify Vulnerabilities** | Revisar las zonas del paso 3 buscando lo que efectivamente permite que las amenazas del paso 4 ocurran | Nota de identificación de vulnerabilidades |

**El paso 1 arranca el ciclo; los pasos 2 a 5 se retroalimentan entre sí como un proceso iterativo, no lineal** — el propio diagrama lo dibuja como un círculo con flechas de ida y vuelta hacia el paso 1. Esto tiene una consecuencia práctica que conviene no perder: no se hace el paso 3 una sola vez y se pasa al 4 para siempre. Identificar una amenaza nueva en el paso 4 puede obligar a volver al paso 3 para descomponer una zona que no se había considerado, y eso puede a su vez revelar un objetivo de seguridad no contemplado en el paso 1.

**Dónde entra `STRIDE`, y por qué el orden importa.** `STRIDE` entra recién en el **paso 4** (identificar amenazas), no antes. Es un error común tratarlo como el punto de partida del modelado — en realidad es una herramienta para hacer sistemático un paso que ya presupone que la aplicación fue conceptualizada (paso 2) y descompuesta en zonas de confianza (paso 3). Aplicar `STRIDE` sin haber hecho esos dos pasos previos produce una lista de amenazas genérica, no ligada a las fronteras de confianza reales del sistema.

## Paso 1 — Identificar objetivos de seguridad

La filmina 12 desarrolla el primer paso del ciclo: los objetivos apuntan a garantizar **confidencialidad**, **integridad** y **disponibilidad**. Hay que partir de los objetivos del sistema y considerar límites explícitamente — de nuevo, **qué es lo que NO se quiere que pase**.

Formular objetivos de seguridad como negaciones ("que no pase X") en vez de afirmaciones ("que el sistema sea seguro") es lo que después permite verificar si se cumplieron: "que no pase X" es una proposición contra la que se puede contrastar evidencia (siguiendo el criterio de [[confianza-y-aseguramiento|Confianza y aseguramiento]]); "que el sistema sea seguro" no lo es.

## Paso 2 — Conceptualizar la aplicación

La filmina 13 pide, en orden:

- **Esquematizar el escenario de despliegue**: determinar topología y capas, componentes críticos, servicios críticos e interfaces externas, protocolos.
- **Identificar roles** y sus casos de uso claves.
- **Identificar tecnologías**: sistema operativo, web server, servidor de base de datos, lenguaje de programación, *frameworks*.
- **Identificar los mecanismos de seguridad ya existentes.**

Este paso es el que produce el material crudo sobre el que trabajan los pasos 3 y 4: sin un esquema de despliegue no hay sobre qué marcar zonas de confianza, y sin conocer las tecnologías no hay forma de saber qué vulnerabilidades conocidas de esas tecnologías específicas podrían aplicar.

## La tensión entre invertir sin límite y decidir cuándo parar

Dos ideas habladas, según `video-08`, que no están en ninguna filmina pero que resumen el espíritu de todo el ciclo:

- **Quien modela amenazas tiene que sacarse el sombrero de desarrollador y ponerse el de atacante** — la misma separación de roles que justifica que el `QA` de un producto no sea la misma persona que lo construyó.
- **Invertir en seguridad no tiene techo.** Se puede meter presupuesto y paranoia indefinidamente, y en algún punto hay que parar. La decisión de dónde parar se toma con la **ecuación de riesgo** —$\text{Riesgo} = \text{Amenazas} \times \text{Vulnerabilidades} \times \text{Bienes}$, según `video-08`—: si no se puede eliminar una amenaza, se bajan las vulnerabilidades (mejorando el código) o se reduce el impacto sobre los bienes (poniendo restricciones), en vez de bloquear funcionalidad sin límite.

Es la misma idea de **seguridad *unbounded*** que cierra los [[principios-de-diseno#8. Aceptación psicológica|Principios de diseño]]: no hay un punto en el que un sistema esté "terminado" en materia de seguridad, sólo un punto en el que se decide, con criterio de riesgo, que ya es suficiente.

## Ver también

- [[clase-08-principios-de-diseno-y-vulnerabilidades#4. Modelado de amenazas|Clase 08 — Principios de diseño y vulnerabilidades § 4. Modelado de amenazas]]
- [[confianza-y-aseguramiento|Confianza y aseguramiento]] — el modelado de amenazas es, en el fondo, un proceso de aseguramiento aplicado al diseño
- [[aseguramiento-en-el-ciclo-de-vida|Aseguramiento en el ciclo de vida]] — la cadena bug → vulnerabilidad → amenaza → efecto que este proceso recorre en reversa
- [[descomposicion-de-la-aplicacion|Descomposición de la aplicación]] — el paso 3 del ciclo, desarrollado entero
- [[stride-y-arboles-de-ataque|STRIDE y árboles de ataque]] — el paso 4 del ciclo, desarrollado entero
- [[principios-de-diseno#8. Aceptación psicológica|Principios de diseño]] — la seguridad *unbounded* que también cierra este proceso
- [[video-08-vulnerabilidades#El proceso de modelado de amenazas de Microsoft|video-08 — Vulnerabilidades]] — la fuente hablada de esta nota
- [[videografia|Videografía]] — el mapa completo de los videos de la cátedra
