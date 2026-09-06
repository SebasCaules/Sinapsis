---
title: Zona desmilitarizada
resumen: 'Subred que separa la red interna de la externa, también llamada red perimetral: aloja entre los dos firewalls los servicios que Internet debe alcanzar, de modo que comprometer uno no comprometa la red interna.'
fuentes: ["[[clase-10-seguridad-en-la-empresa]]", "[[seguridad-a-nivel-de-red]]", "[[firewalls]]", "[[diseno-de-servicios-en-la-dmz]]"]
aliases: [DMZ, Zona desmilitarizada, Demilitarized Zone, Red perimetral, Panmunjom]
type: concepto
unidad: 2
clase: 10
orden: 4
created: 2026-09-04
updated: 2026-09-04
tags: [seguridad-en-redes, dmz, red-perimetral, defensa-en-profundidad, clase-10, sin-dictar]
sources: ["Clase 11 - Seguridad en Redes.pdf"]
---

# Zona desmilitarizada

**Qué es la subred que separa "afuera" de "adentro" en el diagrama de la clase, y por qué su sola existencia — antes de cualquier regla concreta de firewall — ya es una decisión de diseño con un principio detrás.** Es la nota más corta de las seis, porque el concepto en sí ocupa dos filminas; el peso real de la DMZ está en el [[diseno-de-servicios-en-la-dmz|caso de estudio]] que ocupa las veinte filminas siguientes.

*(Filminas 14 y 15 del deck de Seguridad en Redes.)* La **Clase 10 — Seguridad en la empresa** todavía no se dictó (hoy es 04/09/2026, la fecha del cronograma es el 29/10/2026): esta nota está escrita contra el PDF de filminas, sin transcripción ni video. Ver [[clase-10-seguridad-en-la-empresa#Estado de las fuentes|Estado de las fuentes de la clase]].

---

## Definición (filmina 14)

**DMZ** (*Demilitarized Zone*): **subred que separa la red interna de la externa**, también conocida como **red perimetral**. En el [[seguridad-a-nivel-de-red#El diagrama de referencia (filmina 4)|diagrama de referencia]] de la clase, es donde viven el `Web server`, el `Mail server` y el `DNS server` — todo lo que Internet necesita alcanzar directamente —, ubicada entre el `Outer firewall` y el `Inner firewall`.

## Las dos razones de ser (filmina 15)

- **Permite aislar los servicios accesibles desde el exterior de la red interna.** Si un atacante ingresa a la DMZ, **la red interna sigue protegida** — el compromiso de un servidor público no es, por sí solo, compromiso de los datos corporativos.
- **Permite diferenciar claramente los servicios internos y externos.** No es sólo una cuestión de contención: separar físicamente los servicios según su audiencia (Internet vs. red propia) simplifica qué política aplica a cada uno, en vez de mezclar ambos criterios en la misma subred.

La primera razón es la que hace todo el trabajo pesado, y es la que reaparece, nombrada explícitamente, en cada filmina de "consecuencias" del caso de estudio: *"si el servidor X es comprometido, la red interna no se ve afectada"* (ver [[diseno-de-servicios-en-la-dmz#Servicio web (filminas 16-17)|Diseño de servicios en la DMZ]]). Es la instancia concreta, a nivel de arquitectura de red, de los principios de [[clase-08-principios-de-diseno-y-vulnerabilidades#1.6. Separación de privilegios|separación de privilegios]] y [[clase-08-principios-de-diseno-y-vulnerabilidades#1.7. Mecanismos exclusivos|mecanismos exclusivos]]: comprometer un mecanismo (el servidor expuesto) no debería bastar para comprometer el otro (la red interna).

## La analogía de Panmunjom

La filmina ilustra la idea con una fotografía de la frontera entre las dos Coreas en **Panmunjom** *(identificación nuestra de la imagen)*: guardias enfrentados a ambos lados de una franja de terreno que, formalmente, **no pertenece del todo a ninguno de los dos países** — es la DMZ militar real, de la que el término toma prestado el nombre. La analogía es puramente visual, no aporta contenido técnico adicional, pero fija bien la intuición: una DMZ de red no es "territorio interno con menos reglas", es una **zona intermedia**, vigilada desde los dos lados (los dos firewalls del diagrama), que ninguno de los dos extremos trata como propio.

## Por qué la DMZ no es sólo "una subred con menos privilegios"

Vale la pena adelantar, aunque el desarrollo completo esté en las notas siguientes, una distinción que separa a la DMZ de una simple subred aislada: cada servidor de la DMZ está, además, **diseñado como si fuera a ser comprometido**. El servicio web ([[diseno-de-servicios-en-la-dmz#Servicio web (filminas 16-17)|Diseño de servicios en la DMZ]]) es un *Bastion Host* endurecido que **no accede a recursos internos** aunque quisiera; el firewall interno ([[reglas-de-los-firewalls-externo-e-interno|Reglas de los firewalls externo e interno]]) trata a los ataques que ocurren *dentro* de la DMZ con especial atención, porque "no debiera haber ataques en la DMZ" y su sola presencia ya implica haber pasado el firewall externo (ver [[analisis-de-puntos-de-entrada|Análisis de puntos de entrada]]). La DMZ, en otras palabras, no reemplaza la defensa de cada servidor individual — la asume incompleta y construye una segunda barrera detrás.

## Ver también

- [[clase-10-seguridad-en-la-empresa#4. Zona desmilitarizada (filminas 14-15)|Clase 10 — Seguridad en la empresa]] — la sección de la clase que esta nota desarrolla
- [[seguridad-a-nivel-de-red|Seguridad a nivel de red]] — el diagrama completo donde la DMZ es una de las tres subredes
- [[firewalls|Firewalls]] — los mecanismos que median en los dos bordes de la DMZ
- [[diseno-de-servicios-en-la-dmz|Diseño de servicios en la DMZ]] — el caso de estudio completo de qué vive adentro de la DMZ y cómo se lo diseña
- [[analisis-de-puntos-de-entrada|Análisis de puntos de entrada]] — por qué un ataque dentro de la DMZ se trata distinto que uno en el perímetro
- [[clase-08-principios-de-diseno-y-vulnerabilidades#1.6. Separación de privilegios|Clase 08 — Principios de diseño y vulnerabilidades]] — separación de privilegios y mecanismos exclusivos, los principios detrás de esta separación
