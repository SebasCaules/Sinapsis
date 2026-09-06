---
title: Diseño de servicios en la DMZ
resumen: 'Cómo se implementan los tres servidores que Bishop ubica en la DMZ del caso de estudio, web, email y proxy web, y la consecuencia común: comprometer cualquiera de ellos no afecta a la red interna.'
fuentes: ["[[clase-10-seguridad-en-la-empresa]]", "[[zona-desmilitarizada]]", "[[firewalls]]", "[[clase-08-principios-de-diseno-y-vulnerabilidades]]"]
aliases: [Diseño de servicios en la DMZ, Bastion Host, Servidor endurecido, Carga desacoplada, Servicio web proxy, Reescritura de headers de email]
type: concepto
unidad: 2
clase: 10
orden: 5
created: 2026-09-04
updated: 2026-09-04
tags: [seguridad-en-redes, dmz, bastion-host, servidor-web, servidor-email, proxy, defensa-en-profundidad, clase-10, sin-dictar]
sources: ["Clase 11 - Seguridad en Redes.pdf"]
---

# Diseño de servicios en la DMZ

**Cómo se implementan, servicio por servicio, los tres servidores que Bishop ubica en la DMZ del caso de estudio — web, email y proxy web —, y qué consecuencia concreta de diseño sostiene cada uno.** Es la nota más larga de las seis porque cubre el tramo donde la clase deja de dar definiciones sueltas y arranca **un solo caso de estudio corrido**: cada decisión que sigue (filminas 16 a 35) se apoya en las que están acá.

*(Filminas 16 a 21 del deck de Seguridad en Redes.)* La **Clase 10 — Seguridad en la empresa** todavía no se dictó (hoy es 04/09/2026, la fecha del cronograma es el 29/10/2026): esta nota está escrita contra el PDF de filminas, sin transcripción ni video. Erratas verificadas contra la página renderizada, no contra el texto extraído. Ver [[clase-10-seguridad-en-la-empresa#Estado de las fuentes|Estado de las fuentes de la clase]].

---

## El patrón que se repite tres veces

Cada uno de los tres servicios de esta nota sigue la misma estructura: primero **cómo se implementa**, después una filmina de **consecuencias** con etiquetas azules al margen que nombran el principio de diseño que la sostiene (`Mediación Completa`, `Separación de Privilegios`, `Mecanismos Exclusivos`, `Menor privilegio`, `Aceptación Psicológica` — el vocabulario de la [[clase-08-principios-de-diseno-y-vulnerabilidades#1. Los ocho principios de diseño de Saltzer y Schroeder|Clase 08]]). Esas filminas de consecuencias son, de las tres, las que conviene estudiar con más cuidado: la pregunta de examen más probable sobre este material tiene la forma *"si el servidor X es comprometido, ¿qué información queda expuesta?"*, y la respuesta correcta en los tres casos es **ninguna de la red interna**, con una razón de diseño específica detrás.

## Servicio web (filminas 16-17)

Brindado por un **servidor web**, ubicado en la DMZ, de modo que los requerimientos externos **no llegan a la red interna**. Es un **servidor endurecido** (*Bastion Host*):

- Sólo brinda los servicios necesarios: **web, SSH**. Nada más corre en esa máquina — es [[clase-08-principios-de-diseno-y-vulnerabilidades#1.1. Menor privilegio|menor privilegio]] aplicado al propio host, no sólo a sus usuarios.
- La conexión remota (SSH) está permitida **sólo desde el firewall interno**, y con certificados — no contraseña, no acceso desde cualquier punto de la red.
- La **carga de nuevas órdenes está desacoplada** en tres pasos: la aplicación web procesa la orden y la graba; **otro proceso** la encripta y la mueve a una zona no accesible por el web server; un proceso en la **red interna** recupera los archivos.

> **Errata de la filmina.** En la filmina 16, el tercer punto de la carga desacoplada dice *"mueve a zona no accesible pro el web server"*: falta la **r** de *"por"*. Verificado contra la página renderizada — no es un artefacto de extracción, la palabra mal escrita está en la lámina.

### Por qué el desacople de la carga es la pieza más sutil del diseño

Si el web server sólo **escribe** en una zona que después otro proceso lee y mueve, comprometer el web server **no** le da al atacante acceso de lectura a lo que ya se subió. El atacante que controla el servidor web podría, como máximo, escribir órdenes falsas — pero no leer las órdenes reales de otros clientes que ya pasaron por ahí, porque leerlas es un privilegio que el web server nunca tuvo. Es la misma lógica de "escribir sin poder leer" que reaparece, aplicada esta vez al registro de eventos en vez de a órdenes, en el [[servicios-de-soporte-dns-log-y-proxy#Log Server en DMZ (filmina 26)|Log Server de la DMZ]]: en los dos casos, el mecanismo que escribe y el mecanismo que lee son procesos distintos, con privilegios distintos, precisamente para que comprometer uno no dé acceso al historial que maneja el otro.

### Consecuencias (filmina 17)

- Todos los requerimientos externos pasan por el **firewall externo** y llegan al servidor web.
- El servidor web **no accede a recursos de la red interna**.
- Si el servidor web es comprometido, **la red interna no se ve afectada**.
- Afuera de la red, la dirección del servidor web **es la del firewall externo** — el atacante nunca ve la IP real del servidor.
- El servidor sólo acepta conexiones administrativas remotas **desde la red interna**.
- Comprometer el servidor **no revela información de clientes**, porque esa información nunca estuvo ahí.

> **Errata de la filmina.** En la filmina 17, el segundo punto dice *"El servidor web no accede a recursso de la red interna"*: falta la **o** de *"recursos"*. Verificado contra la página renderizada.

## Servicio email (filminas 18-20)

A diferencia del web —una sola instancia expuesta más una copia interna, ver [[servicios-de-soporte-dns-log-y-proxy#Web server interno (filmina 27)|Servicios de soporte]]—, el servicio email tiene **dos servidores separados**: uno en la DMZ y otro en la red interna. En la DMZ, administración remota vía SSH.

### Camino entrante (filmina 18)

Recibe email desde Internet y lo reenvía a la red interna:

1. Revisa encabezados, contenido y adjuntos.
2. Filtra spam y virus conocidos.
3. Elimina emails mal formados (posibles ataques).
4. **Reescribe direcciones** para que apunten al email interno — ejemplo de la filmina: `xx@drib.org` → `xx@smtpe1.drig.org`.
5. Reenvía los emails "sanos" al servidor interno.

La filmina deja anotado, como alternativa y no como obligación, que **el filtro de spam, virus y emails mal formados puede ocurrir en el firewall externo** en lugar de en el propio servidor de email.

### Camino saliente (filmina 19)

Recibe email de la red interna y lo envía a Internet, con los mismos chequeos de encabezado/contenido/adjuntos y spam/virus del camino entrante, **más dos controles que el camino entrante no tiene**:

- **Filtra contenidos confidenciales** — marcas de agua, palabras clave.
- **Revisa todo el header y reemplaza hosts, IPs y usuarios internos** por la dirección/nombre del firewall externo — la misma lógica de ocultamiento que ya se vio para el web server (filmina 17), aplicada esta vez encabezado por encabezado, en cada email que sale.

La asimetría entre los dos caminos tiene una razón clara: el camino entrante necesita ocultar la **estructura interna** (a dónde reenviar), el saliente necesita ocultar la **identidad interna** (quién envió) además de filtrar fugas de información — dos problemas distintos, dos juegos de controles distintos.

### Consecuencias (filmina 20)

- Todos los emails pasan por el servidor de email en la DMZ.
- El servidor **no accede a recursos internos**.
- Si se compromete, **la red interna no se ve afectada**.
- Afuera de la red, la dirección del servidor es la del **firewall externo**.
- El servidor sólo acepta administración remota **desde la red interna**.
- **Afuera de la red no se conocen servidores ni direcciones internas** — la generalización, a toda la red, de la reescritura de headers del camino saliente.

## Servicio web proxy (filmina 21)

Brindado por un servidor **web proxy** en la DMZ. A diferencia de los dos anteriores —que sirven contenido **hacia** Internet—, este es el proxy **saliente** que usa la red interna para navegar:

- Recibe requerimientos web dirigidos a terceros.
- **Verifica que el origen sea la dirección del firewall interno** — no acepta pedidos que no vengan mediados por ese firewall.
- Filtra requerimientos mal formados: posibles ataques lanzados desde la propia red interna, o uso indebido del protocolo (ejemplo de la filmina: un servidor SSH externo escuchando en el puerto 80, para evadir un firewall que sólo permite tráfico "web").
- Prohíbe el acceso a páginas no permitidas.
- **Opcionalmente**, cachea los recursos más solicitados.

Este servicio **no tiene una filmina de consecuencias propia**: sus consecuencias quedan absorbidas en las del [[reglas-de-los-firewalls-externo-e-interno#Consecuencias, comunes a ambos firewalls (filmina 24)|firewall interno]], que es quien fuerza que **todo** el tráfico http/s saliente de la red interna pase por este proxy — el proxy web es, en ese sentido, un mecanismo que el firewall interno instrumenta, no una pieza independiente del diseño.

## Tabla comparativa de los tres servicios

| | Web | Email | Web proxy |
|---|---|---|---|
| Dirección del tráfico | Entrante (Internet → DMZ) | Ambas (entrante y saliente) | Saliente (interna → Internet) |
| Instancias | 1 en DMZ + 1 copia interna | 1 en DMZ + 1 en red interna | 1 en DMZ |
| Verifica origen contra | — | — | Dirección del firewall interno |
| Control distintivo | Carga de órdenes desacoplada | Reescritura de headers/direcciones | Filtra uso indebido del protocolo |
| Filmina de consecuencias propia | Sí (17) | Sí (20) | No — absorbida en la del firewall interno (24) |

## Ver también

- [[clase-10-seguridad-en-la-empresa#5. Caso de estudio: diseño de servicios en la DMZ (filminas 16-21)|Clase 10 — Seguridad en la empresa]] — la sección de la clase que esta nota desarrolla
- [[zona-desmilitarizada|Zona desmilitarizada]] — qué es la DMZ donde viven estos tres servicios
- [[firewalls#Tipo 3 — Application firewalls (filminas 8-9)|Firewalls]] — el application firewall cuyo ejemplo de la filmina 9 es literalmente el flujo del servicio de email
- [[reglas-de-los-firewalls-externo-e-interno|Reglas de los firewalls externo e interno]] — cómo el firewall interno fuerza el uso del proxy web
- [[servicios-de-soporte-dns-log-y-proxy|Servicios de soporte: DNS, log y proxy]] — el Log Server, que reusa la misma lógica de "escribir sin poder leer" del servicio web
- [[clase-08-principios-de-diseno-y-vulnerabilidades#1. Los ocho principios de diseño de Saltzer y Schroeder|Clase 08 — Principios de diseño y vulnerabilidades]] — los principios que las etiquetas de margen de las filminas de consecuencias nombran
