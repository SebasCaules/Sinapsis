---
title: "Servicios de soporte: DNS, log y proxy"
resumen: 'Los tres servicios que sostienen a los demás en el caso de estudio: DNS de la DMZ e interno, log server de sólo agregado y web server interno; es la primera vez que la clase admite violar mecanismos exclusivos, y cómo lo mitiga.'
fuentes: ["[[clase-10-seguridad-en-la-empresa]]", "[[diseno-de-servicios-en-la-dmz]]", "[[zona-desmilitarizada]]", "[[variaciones-de-la-arquitectura]]"]
aliases: [Servicios de soporte, DNS Server en DMZ, DNS Server interno, Log Server, Web server interno, Servidor de nombres interno y externo]
type: concepto
unidad: 2
clase: 10
orden: 7
created: 2026-09-04
updated: 2026-09-06
tags: [seguridad-en-redes, dns, logging, dmz, mecanismos-exclusivos, defensa-en-profundidad, clase-10, sin-dictar]
sources: ["Clase 11 - Seguridad en Redes.pdf"]
---

# Servicios de soporte: DNS, log y proxy

**Los tres servicios que no atienden directamente a un cliente externo, sino que sostienen a los que sí lo hacen: resolución de nombres, registro de eventos y una copia de staging del sitio web.** Es la nota donde el caso de estudio admite, por primera vez, que un principio de diseño se viola a propósito — y muestra cómo se mitiga en vez de evitarla.

*(Nota de nomenclatura.)* La filmina 27 titula este bloque completo "Otros" y su último servicio es el **web server interno**, no un proxy adicional — el servicio de **web proxy** propiamente dicho ya está cubierto en [[diseno-de-servicios-en-la-dmz|Diseño de servicios en la DMZ]], filmina 21, desarrollado en [[diseno-de-servicios-en-la-dmz#Servicio web proxy (filmina 21)|Servicio web proxy]]. Se conserva el nombre de archivo tal como fue asignado, y esta nota linkea al proxy real en el lugar que le corresponde en vez de inventarle contenido nuevo.

Cubre las filminas **25 a 27** del deck `Clase 11 - Seguridad en Redes.pdf`. La clase todavía no se dictó — hoy es 04/09/2026 y está agendada para el 29/10 — así que esta nota está escrita contra el PDF de filminas, sin transcripción ni grabación; ver el aviso de fuente completo en [[clase-10-seguridad-en-la-empresa|Clase 10 — Seguridad en la empresa]].

## Por qué van juntos estos tres servicios

Los tres comparten un mismo rol funcional en el caso de estudio de la clase: ninguno recibe tráfico de un cliente externo directamente, y ninguno tiene una filmina de "consecuencias" propia como sí la tienen el [[diseno-de-servicios-en-la-dmz|servicio web y el de email]]. Son la infraestructura que el resto de los servicios necesita para funcionar — nombres, auditoría y un lugar donde probar cambios antes de publicarlos.

## DNS Server en DMZ

Brinda a los servidores de la DMZ los nombres de los otros servidores de la propia DMZ. Dos propiedades:

- **Permite reconfigurar la DMZ fácilmente**: si cambia la dirección de un servidor, se actualiza en un solo lugar en vez de en la configuración de cada servidor que lo necesite.
- **Sólo incluye información de la DMZ.** No resuelve nombres de la red interna. Es la aplicación directa de `Menor privilegio`: cada servidor de la DMZ conoce sólo lo que necesita conocer —los demás servidores de su propia zona—, nada de la topología interna.

## DNS Server interno

Cumple la función simétrica del lado de adentro: **resuelve direcciones internas**, y además **puede permitir búsquedas de DNS externos**, pasando por los firewalls.

Esta segunda función es la que la propia filmina marca como un problema, textual: *"esto viola el principio de mecanismos exclusivos (todos los servidores usarían este servicio)"*. Vale la pena desarmar por qué:

- `Mecanismos exclusivos` pide que un mismo mecanismo no sirva a la vez para funciones con distinto nivel de confianza — cuantos menos consumidores comparte un recurso, menor la superficie si ese recurso falla.
- Si **todos** los servidores de la red interna —desde una estación de trabajo hasta un servidor de datos de clientes— dependen del mismo DNS interno para resolver nombres externos, ese servidor se vuelve un punto único que, si es comprometido, puede redirigir a **cualquier** consumidor de la red hacia un destino malicioso (el mecanismo clásico detrás de un ataque de DNS spoofing o de un dominio de phishing servido con una respuesta falsa).

La mitigación que ofrece la propia filmina no elimina la violación —sigue siendo un servicio compartido por todos— sino que **acota el daño de un servidor comprometido**: *"como medida extra se suelen configurar las direcciones de los firewalls en cada servidor"*. Es decir, cada servidor conserva, fuera del DNS, una referencia fija a los firewalls que necesita alcanzar; si el DNS interno cae o es manipulado, esa ruta crítica no depende de una resolución de nombres que podría estar mentida. Es la misma lógica que aparece de nuevo, generalizada a toda la arquitectura, en la [[variaciones-de-la-arquitectura|unificación de servidores de redes chicas]]: un principio que cede ante una restricción práctica, compensado con una medida puntual en vez de descartado.

*(Lectura nuestra.)* Ninguna de las dos filminas anteriores del caso de estudio —ni el [[diseno-de-servicios-en-la-dmz#Servicio web (filminas 16-17)|servicio web]] ni el [[diseno-de-servicios-en-la-dmz#Servicio email (filminas 18-20)|servicio email]]— admite abiertamente violar un principio de diseño: las dos presentan el diseño como si cumpliera todos los principios. Ésta es la primera de las dos excepciones que la clase reconoce explícitamente (la otra es la unificación de servidores de la filmina 35); conviene tenerlas ambas en la cabeza como el material más probable de una pregunta de "justifique un trade-off" en el parcial.

## Log Server en DMZ (filmina 26)

Recibe logs de **todos** los servidores de la DMZ, con tres reglas de diseño:

1. **Cada servidor sólo puede agregar información al log** — nunca leerlo ni modificarlo. Un servidor comprometido no puede revisar ni borrar lo que ya escribió, ni el suyo ni el de otro.
2. **Cada servidor utiliza un canal propio.** Aísla el canal de logging de un servidor del de los demás; comprometer uno no da acceso al canal de otro.
3. **Los logs se guardan en el filesystem y en un medio de sólo escritura.** Doble redundancia con distinta propiedad de acceso.

> **Errata de la filmina.** La filmina 26 escribe *"filessytem"* en vez de *"filesystem"*, con dos letras trastocadas. Verificado contra la página renderizada — no es un artefacto de `pdftotext`, la palabra está mal escrita en la lámina.

La regla de "sólo agregar, nunca leer ni modificar" es la misma que ya aparece en la [[diseno-de-servicios-en-la-dmz#Servicio web (filminas 16-17)|carga de órdenes del servidor web]] (filmina 16): ahí un proceso sólo puede escribir en una zona que otro lee después; acá un servidor sólo puede escribir en un log que otro proceso conserva. En ambos casos, comprometer el emisor no da acceso de lectura a lo ya emitido — el atacante puede seguir agregando ruido al log, pero no puede purgar la evidencia de lo que hizo antes de ser detectado.

**Ante un incidente**, la filmina resuelve los dos escenarios de compromiso posibles:

- Si un **servidor** (de la DMZ) fue comprometido, el log de lo que hizo ya existe en el log server, fuera de su alcance.
- Si el **log server** fue comprometido, todavía se puede recuperar el log accediendo **físicamente** al medio de sólo escritura — el atacante puede tener control remoto total del log server y aun así no poder alterar lo ya grabado en ese medio, porque la operación de borrado o modificación no está disponible por la vía que el atacante tiene.

Es, otra vez, `Separación de privilegios`: ni comprometer un servidor de la DMZ ni comprometer el propio log server alcanza, por sí solo, para destruir el rastro de un ataque.

## Web server interno (filmina 27)

Cierra el capítulo de servicios de soporte con la pieza que faltaba para entender la actualización del servidor web expuesto (filmina 16, en [[diseno-de-servicios-en-la-dmz|Diseño de servicios en la DMZ]]): una copia interna del sitio, para no editar nunca directamente el que da la cara a Internet.

- **Mantiene una copia del web server de la DMZ.**
- **Permite modificar y probar aplicaciones y modificaciones**, con algún control de acceso implementado en el propio servidor.
- **Permite implementar el mecanismo para actualizar la página web del servidor en la DMZ**, vía acceso SSH desde una terminal administrativa.

Es, en terminología moderna, un entorno de *staging*: el cambio se prueba acá, adentro de la red interna, y de acá se empuja hacia el servidor expuesto — nunca al revés. Encaja con la restricción que ya fijaban las [[diseno-de-servicios-en-la-dmz#Consecuencias (filmina 17)|consecuencias del servicio web]]: *"el servidor sólo acepta conexiones administrativas remotas desde la red interna"*. El web server interno es, precisamente, el origen de esas conexiones administrativas.
