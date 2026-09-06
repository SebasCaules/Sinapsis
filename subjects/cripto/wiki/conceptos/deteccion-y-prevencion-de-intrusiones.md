---
title: Detección y prevención de intrusiones
resumen: 'El IDS, software que analiza eventos buscando patrones de ataque y complementa el control manual, frente al IPS, que le agrega una respuesta automática: por lo general bloquear en el firewall el origen del ataque.'
fuentes: ["[[clase-10-seguridad-en-la-empresa]]", "[[analisis-de-puntos-de-entrada]]", "[[firewalls]]"]
aliases: [IDS, IPS, Intruder Detection System, Intruder Prevention System, Detección y prevención de intrusiones]
type: concepto
unidad: 2
clase: 10
orden: 10
created: 2026-09-04
updated: 2026-09-04
tags: [seguridad-en-redes, ids, ips, deteccion-de-intrusiones, clase-10, sin-dictar]
sources: ["Clase 11 - Seguridad en Redes.pdf"]
---

# Detección y prevención de intrusiones

**La distinción de una línea que separa "saber que hubo un ataque" de "actuar automáticamente cuando lo hay", y por qué la primera sigue haciendo falta aunque exista la segunda.** Es la nota más corta en contenido de filmina de las cinco, pero la que más aparece en cualquier examen de seguridad de redes por fuera de esta materia — vale la pena fijar la definición exacta, no sólo la sigla.

Cubre las filminas **32 y 33** del deck `Clase 11 - Seguridad en Redes.pdf`, ambas bajo el título *"Anticipándose"* que también encabeza las dos filminas anteriores de [[analisis-de-puntos-de-entrada|Análisis de puntos de entrada]]. La clase todavía no se dictó — hoy es 04/09/2026 y está agendada para el 29/10 — así que esta nota está escrita contra el PDF de filminas, sin transcripción ni grabación; ver el aviso de fuente completo en [[clase-10-seguridad-en-la-empresa|Clase 10 — Seguridad en la empresa]].

## IDS — Intruder Detection System (filmina 32)

Definición de la filmina: **software que analiza eventos y busca patrones que indiquen un posible ataque.**

Tres precisiones que da la propia lámina:

- **Idealmente combina dos fuentes de eventos**: eventos de red (tráfico, conexiones) y eventos de hosts (procesos ejecutados, uso de memoria, sesiones abiertas). Ninguna de las dos fuentes por sí sola alcanza — un patrón de red sospechoso sin contexto del host puede ser una falsa alarma, y viceversa; combinarlas reduce falsos positivos y falsos negativos frente a mirar cada una por separado.
- **Requiere cierta afinación** (*tuning*): un `IDS` mal calibrado genera demasiadas alertas irrelevantes (falsos positivos) o deja pasar ataques reales (falsos negativos). La filmina no desarrolla el mecanismo de afinación, pero lo señala como una condición necesaria para que el `IDS` sea útil, no un detalle de implementación menor.
- **Complementa al control manual, no lo reemplaza.** Y da el mecanismo concreto de esa complementación: *"debiera realizarse una contrastación manual periódica de que esté funcionando"* — por ejemplo, **seleccionar un segmento y comparar sus eventos reales contra las alertas que el `IDS` generó para ese mismo segmento**. Es, en esencia, una auditoría de la propia herramienta de auditoría: sin ese chequeo periódico, un `IDS` que dejó de funcionar correctamente —por una regla rota, un sensor caído, una actualización que introdujo un bug— puede pasar meses sin que nadie lo note, precisamente porque su función es avisar cuando algo anda mal, y nadie está mirando si el que avisa sigue funcionando.

## IPS — Intruder Prevention System (filmina 33)

Definición de la filmina: **lleva la detección de intrusiones un nivel más adelante, permitiendo llevar a cabo acciones al momento de detectar ataques.**

> **Errata de la filmina.** El primer punto de la filmina 33 dice *"Lleva la detección de intrusiones un niel más adelante"*: falta la **v** de "nivel"; y el segundo punto escribe *"aciones"* por "acciones". Verificado contra la página renderizada — no es un artefacto de extracción, las palabras mal escritas están en la lámina.

La acción concreta que la filmina menciona: **por lo general se limita a bloquear en el firewall las comunicaciones que incluyan al origen del ataque.** Es una acción acotada —no dice "aislar el sistema comprometido" ni "revertir cambios", dice bloquear el origen en el firewall—, y la filmina no da ninguna razón de diseño para esa acotación.

*(Lectura nuestra.)* Una razón práctica posible es que bloquear una IP de origen es una acción reversible y de bajo riesgo de efecto colateral, mientras que acciones más agresivas (aislar un host, matar un proceso, revertir una transacción) pueden causar tanto daño operativo como el propio ataque si la detección fue un falso positivo.

## La distinción exacta, y por qué importa el orden

`IDS` **detecta y avisa**; `IPS` **detecta y actúa**. La forma más precisa de decirlo: todo `IPS` necesita, como componente interno, la misma capacidad de análisis de un `IDS` —no puede actuar sobre un patrón que no supo reconocer—, así que `IPS` no es una alternativa a `IDS`, es un `IDS` con una etapa de respuesta automática agregada encima. Es exactamente lo que dice la filmina con "un nivel más adelante": no reemplaza el nivel anterior, lo extiende.

Esto conecta directo con el trade-off que ya apareció en [[analisis-de-puntos-de-entrada#La premisa que reencuadra todo (filminas 30-31)|Análisis de puntos de entrada]]: la respuesta automática de un `IPS` es más rápida que la inspección manual, pero también hereda el riesgo de cualquier automatización —un falso positivo en un `IPS` no genera una alerta que alguien revisa, genera una acción real, como bloquear tráfico legítimo. Es la razón por la que la filmina 30 sigue listando "inspección manual de eventos" como un recaudo aparte, incluso en una arquitectura que ya tiene `IDS` e `IPS`.

## Dónde encaja esto en la arquitectura del caso de estudio

*(Lectura nuestra.)* La cátedra no da, en estas dos filminas, ejemplos de producto ni de firma de ataque concreta —queda deliberadamente en el nivel de arquitectura—, pero el rol de `IDS`/`IPS` ya estaba anticipado en la sección anterior: son la herramienta detrás de "registrar ataques" (firewall externo) y "tener interés particular en los ataques" ([[analisis-de-puntos-de-entrada#En la DMZ|DMZ]]). El `IDS` es lo que permite **saber** qué pasó en cada capa; el `IPS` es lo que convierte esa detección en una respuesta automática en el firewall, en vez de en un log que alguien revisa después.

## Ver también

- [[clase-10-seguridad-en-la-empresa#10. Detección y prevención de intrusiones (filminas 32-33)|Clase 10 — Seguridad en la empresa: sección 10]]
- [[analisis-de-puntos-de-entrada|Análisis de puntos de entrada]] — la premisa ("puede haber un ataque exitoso") y los cuatro recaudos generales que anticipan esta nota
- [[servicios-de-soporte-dns-log-y-proxy|Servicios de soporte: DNS, log y proxy]] — el Log Server, insumo de todo análisis de eventos
- [[firewalls|Firewalls]] — el mecanismo (bloqueo en el firewall) que ejecuta la acción de un `IPS`
- [[variaciones-de-la-arquitectura|Variaciones de la arquitectura]]
- [[videografia|Videografía]] — ningún video de la cátedra cubre esta clase, confirmado ahí
