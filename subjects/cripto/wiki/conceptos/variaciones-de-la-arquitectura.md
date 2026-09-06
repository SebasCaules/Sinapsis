---
title: Variaciones de la arquitectura
resumen: 'Los dos escenarios que fuerzan a modificar el diseño de referencia: clusters de firewalls para tráfico muy alto, donde sólo el packet filter escala sin coordinar nodos, y unificación de servidores o tercerización de la DMZ en redes chicas.'
fuentes: ["[[clase-10-seguridad-en-la-empresa]]", "[[firewalls]]", "[[seguridad-a-nivel-de-red]]", "[[servicios-de-soporte-dns-log-y-proxy]]"]
aliases: [Variaciones de la arquitectura, Clusters de firewalls, Sticky session, Tercerización de la DMZ, Unificación de servidores]
type: concepto
unidad: 2
clase: 10
orden: 11
created: 2026-09-04
updated: 2026-09-04
tags: [seguridad-en-redes, firewalls, dmz, clusters, virtualizacion, mecanismos-exclusivos, clase-10, sin-dictar]
sources: ["Clase 11 - Seguridad en Redes.pdf"]
---

# Variaciones de la arquitectura

**El cierre que evita leer las 32 filminas anteriores como una receta única: dos escenarios —tráfico muy alto y presupuesto muy bajo— que fuerzan a modificar el diseño de referencia, y cómo se lo modifica sin abandonar los principios que lo sostienen.** Es la contraparte directa de la filmina de apertura de la clase, que ya llamaba a los principios de diseño "guías", no receta.

Cubre las filminas **34 y 35** del deck `Clase 11 - Seguridad en Redes.pdf`, ambas tituladas *"Variaciones"*. La clase todavía no se dictó — hoy es 04/09/2026 y está agendada para el 29/10 — así que esta nota está escrita contra el PDF de filminas, sin transcripción ni grabación; ver el aviso de fuente completo en [[clase-10-seguridad-en-la-empresa|Clase 10 — Seguridad en la empresa]].

## Clusters de firewalls para redes con ancho de banda muy alto (filmina 34)

El problema que resuelve esta variación: un único firewall tiene un límite de throughput, y una red con tráfico muy alto puede superarlo. La solución es repartir la carga entre varios nodos, pero el costo de hacerlo depende **del tipo de firewall**:

- **Fácil de implementar con packet filters.** Un [[firewalls|packet filter]] evalúa cada paquete de forma independiente, sin memoria de paquetes anteriores —no tiene estado que mantener—, así que repartir paquetes entre varios nodos del cluster no requiere que esos nodos se coordinen entre sí.
- **Los statefull filters y los application proxies requieren sincronización entre nodos** (*sticky session*). La razón es la propiedad que los define: un [[firewalls|statefull filter]] necesita recordar si una conexión es nueva o ya establecida, y un application proxy necesita mantener el estado de la sesión que está mediando. Si dos paquetes de la **misma** conexión llegan a **distintos** nodos del cluster, y esos nodos no comparten el estado de esa conexión, cada uno la ve como si fuera la primera vez —o directamente la rechaza por no reconocerla—. *Sticky session* es la técnica que fija todos los paquetes de una misma conexión al mismo nodo (o replica el estado entre nodos), precisamente para evitar ese problema.

Este es el mismo trade-off de la [[firewalls|progresión de los tres tipos de firewall]]: a mayor capacidad de inspección, mayor costo — acá el costo adicional no es sólo de cómputo por paquete, sino de **coordinación** cuando se necesita escalar horizontalmente.

La segunda variante que da la filmina es distinta: en vez de escalar el mismo firewall horizontalmente, **separar por función en servidores diferentes** —uno sólo de packet filter, otro sólo de web proxy, otro sólo de SMTP proxy, etcétera—, en vez de un firewall monolítico que hace todo. Es una forma alternativa de repartir carga que no depende de resolver el problema de sincronización de estado: cada servidor tiene una función y un estado propios, sin necesidad de compartirlo con otro.

## Pequeñas redes (filmina 35)

El problema que resuelve esta segunda variación es el opuesto: no exceso de tráfico, sino **costo prohibitivo**. La arquitectura de referencia de la clase —dos firewalls perimetrales más media docena de servidores dedicados (web, email, proxy, DNS ×2, log, web interno)— tiene un costo de hardware y de administración que una empresa chica no puede asumir. La filmina lo resume en una frase: **compromiso entre costo y seguridad.**

Dos caminos, cada uno con su propio costo oculto:

### Unificación de servidores

Juntar varios servicios —por ejemplo, DNS, email y web— en una sola máquina física. Consecuencias que la propia filmina reconoce:

- **Viola el principio de `mecanismos exclusivos`.** Es la misma tensión que ya apareció con el [[servicios-de-soporte-dns-log-y-proxy#DNS Server interno|DNS interno]] en la filmina 25 —un mecanismo compartido por consumidores de distinta confianza—, ahora generalizada a **toda** la arquitectura: si un solo servidor hace de DNS, email y web a la vez, cualquier vulnerabilidad en cualquiera de los tres protocolos compromete los tres servicios de una sola vez.
- **Single point of failure.** No es sólo un problema de seguridad sino de disponibilidad: una falla de hardware, no necesariamente un ataque, tira abajo todos los servicios a la vez.
- **Paliativo: virtualización.** Separar lógicamente lo que no se puede separar físicamente —cada servicio en su propia máquina virtual, sobre el mismo hardware—. No elimina el *single point of failure* de hardware (si la máquina física cae, caen todas las VMs), pero sí restaura buena parte del aislamiento de `mecanismos exclusivos`: un compromiso de la VM de email, si el hipervisor está bien configurado, no da acceso directo a la VM de DNS.

Es la segunda de las dos excepciones que la clase reconoce explícitamente a un principio de diseño —la primera es el DNS interno—, y las dos comparten la misma estructura: se admite la violación, y se ofrece una mitigación puntual en vez de descartar la solución completa. Es, otra vez, material directo para una pregunta de "justifique un trade-off": la respuesta correcta no es "está mal", es "viola X, se mitiga con Y, porque Z no es viable en este contexto".

### Tercerización de la DMZ

Los servicios externos (web, email, DNS) residen en un **datacenter alquilado**, en vez de en hardware propio. La filmina no desarrolla las implicancias de este camino, pero la lógica de fondo es distinta a la de la unificación: acá no se sacrifica aislamiento entre servicios —cada uno puede seguir separado, sólo que en infraestructura de un tercero—, se sacrifica **control directo** sobre el hardware y, según el proveedor, sobre parte de la configuración de red. Es la variación que hoy correspondería, en términos modernos, a mover la DMZ a un proveedor de nube o de hosting administrado, aunque el deck no usa esa terminología.

## El cierre del caso de estudio

La filmina de cierre del deck (36) recomienda el capítulo 26 de *Computer Security Art and Science* de Matt Bishop —el mismo capítulo del que sale el diagrama de referencia de la [[seguridad-a-nivel-de-red|filmina 4]]—, así que todo el caso de estudio de esta clase, variaciones incluidas, tiene ahí su desarrollo completo con más variantes y casos de borde de los que el deck alcanza a cubrir.

## Ver también

- [[clase-10-seguridad-en-la-empresa#11. Variaciones de la arquitectura (filminas 34-35)|Clase 10 — Seguridad en la empresa: sección 11]]
- [[firewalls|Firewalls]] — los tres tipos cuya capacidad de clusterizarse depende de si mantienen estado
- [[seguridad-a-nivel-de-red|Seguridad a nivel de red]] — la arquitectura de referencia que estas variaciones modifican
- [[servicios-de-soporte-dns-log-y-proxy|Servicios de soporte: DNS, log y proxy]] — el DNS interno, la otra excepción admitida a `mecanismos exclusivos`
- [[segmentacion-de-la-red-interna|Segmentación de la red interna]]
- [[analisis-de-puntos-de-entrada|Análisis de puntos de entrada]]
- [[deteccion-y-prevencion-de-intrusiones|Detección y prevención de intrusiones]]
- Matt Bishop, *Computer Security: Art and Science*, cap. 26 *Network Security* — la fuente de todo el caso de estudio ([[bibliografia|bibliografía]])
- [[videografia|Videografía]] — ningún video de la cátedra cubre esta clase, confirmado ahí
