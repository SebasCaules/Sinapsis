---
tipo: flashcards
titulo: Seguridad en la red de una empresa
id: seguridad-en-redes
division: "10"
descripcion: Firewalls, reglas, DMZ, segmentación, netfilter e iptables.
---

## ¿Qué es un firewall y bajo qué criterio se distinguen sus tres tipos? {#seguridad-en-redes:firewall-definicion-y-tres-tipos}
> pagina: firewalls

Un firewall es un **host que controla el acceso a una red**. Los tres tipos se distinguen según **cuánto del paquete inspeccionan**:

1. **Packet filter** — sentido del tráfico y encabezados.
2. **Statefull packet filter** — lo anterior más el estado de la conexión.
3. **Application firewall**, *proxy* o `WAF` — el contenido de la aplicación.

Regla general: **a mayor capacidad de inspección, mayor costo y mayor especificidad**. Ningún tipo domina a los otros en todos los ejes, por eso el caso de estudio usa los tres a la vez en distintos puntos de la misma red.

## ¿Según qué características decide un packet filter, y qué es exactamente lo que no puede ver? {#seguridad-en-redes:packet-filter}
> pagina: firewalls

Decide según el **sentido** del tráfico (entrante o saliente) y características del paquete: **host y puerto** origen/destino, **flags** (`Syn`, `Rst`) y **protocolo de transporte** (`TCP`, `IP`, `ICMP`). Reglas del tipo `src:*:* dst:www.ss.com:80 allow`.

**No mira el contenido** del paquete, sólo sus encabezados; el ejemplo canónico son los **routers**. Por eso no puede distinguir un `GET /index.html` legítimo de un `GET /../../etc/passwd` malicioso si ambos llegan por el puerto 80 desde un origen permitido.

## ¿Qué dos capacidades agrega un statefull packet filter sobre un packet filter común? {#seguridad-en-redes:statefull-packet-filter}
> pagina: firewalls

- Determinar si una conexión es **nueva**, **existente** o **inválida**: evalúa cada paquete en el contexto de la conexión a la que pertenece, no de forma aislada.
- **Manipular los paquetes**, por ejemplo aplicar `NAT`.

Es la propiedad que explota el módulo `state` de `iptables`: una regla con `-m state --state NEW,ESTABLISHED` sólo tiene sentido si el firewall mantiene una tabla de conexiones activas contra la cual clasificar cada paquete.

## ¿Qué es un application firewall y qué cuatro rasgos lo definen? {#seguridad-en-redes:application-firewall}
> pagina: firewalls

Llamado también **proxy**, **proxy firewall** o `WAF` (*Web Application Firewall*). Es un **agente intermediario**:

- Cada parte dialoga con el proxy **pensando que es la otra parte**.
- El proxy **decide** si el mensaje pasa, se descarta o se modifica.
- Puede **registrar eventos** o **disparar alarmas**.
- Es **específico de un protocolo de aplicación** (web, ftp, email), aunque muchos manejen varios.

En el ejemplo del deck, el proxy de email **ensambla los paquetes y reconstruye el email** antes de escanear adjuntos y revisar el origen contra una lista de spam: reconstruirlo exige entender el protocolo completo. Un packet filter ve TCP; un application firewall ve SMTP.

## ¿Por qué el diseño de la red no alcanza para implementar toda la política de seguridad? {#seguridad-en-redes:limite-del-diseno-de-red}
> pagina: seguridad-a-nivel-de-red

Se **parte de una política de seguridad ya definida** y la estructura de la red debe implementar mecanismos de control que la **fuercen**; aun así, **es probable que no se pueda contemplar TODA la política mediante el diseño de red**. La filmina nombra dos huecos:

- Falta **seguridad en sistemas y en aplicaciones** — un firewall bien configurado no repara una aplicación web vulnerable que corre detrás de él.
- Faltan **procedimientos manuales** — políticas de contraseñas, capacitación, respuesta a incidentes.

Es la razón de fondo por la que el caso de estudio insiste en la defensa en profundidad.

## Defina DMZ y enuncie sus dos razones de ser {#seguridad-en-redes:dmz-definicion-y-razones}
> pagina: zona-desmilitarizada

**DMZ** (*Demilitarized Zone*): **subred que separa la red interna de la externa**, también conocida como **red perimetral**. En el diagrama de referencia aloja el `Web server`, el `Mail server` y el `DNS server`, entre el `Outer firewall` y el `Inner firewall`.

- **Permite aislar los servicios accesibles desde el exterior de la red interna**: si un atacante ingresa a la DMZ, la red interna sigue protegida.
- **Permite diferenciar claramente los servicios internos y externos**, lo que simplifica qué política aplica a cada uno.

## En iptables, ¿cuáles son las chains más comunes de la tabla FILTER y qué es la policy por defecto? {#seguridad-en-redes:iptables-chains-y-policy}
> pagina: netfilter-e-iptables

Las **chains** son los tipos de operación sobre los que se definen reglas dentro de una tabla. En `FILTER`, las más comunes son:

- `INPUT` — paquetes **entrantes** al host.
- `OUTPUT` — paquetes **salientes** del host.
- `FORWARD` — paquetes que se **rutean entre redes**, con el host actuando de router.

Cada chain tiene una **acción por defecto** (*policy*), `ACCEPT` o `DROP`, que se aplica cuando **ninguna** regla explícita matcheó. Se fija con `iptables -P INPUT DROP`, que **no agrega una regla**: cambia la chain entera a denegar por defecto.

## Escriba las dos reglas de iptables que habilitan SSH desde una subred y explique por qué la de OUTPUT no acepta NEW {#seguridad-en-redes:iptables-ssh-output-established}
> pagina: netfilter-e-iptables

```
iptables -A INPUT -i eth0 -p tcp -s 192.168.200.0/24 --dport 22
          -m state --state NEW,ESTABLISHED -j ACCEPT

iptables -A OUTPUT -o eth0 -p tcp --sport 22
          -m state --state ESTABLISHED -j ACCEPT
```

La conexión SSH la abre siempre el cliente hacia el servidor; el servidor sólo responde dentro de una sesión ya abierta. Aceptar `NEW` en `OUTPUT` permitiría que el **propio host** iniciara conexiones SSH salientes por el puerto 22, un permiso que la regla de entrada no pide y que violaría menor privilegio.

## ¿Cómo se escribe en iptables una regla de mitigación de DoS y de qué depende su efecto real? {#seguridad-en-redes:iptables-limit-dos}
> pagina: netfilter-e-iptables

```
iptables -A INPUT -p tcp --dport 80
          -m limit --limit 25/minute --limit-burst 100 -j ACCEPT
```

`-m limit` invoca el módulo de *rate limiting*: `--limit 25/minute` fija el régimen **sostenido** y `--limit-burst 100` la **ráfaga** inicial permitida antes de que ese límite empiece a aplicar.

La regla sola no descarta nada: sólo deja de emitir `ACCEPT` para el exceso. Qué ocurre con ese tráfico depende de la **policy por defecto** de `INPUT`, así que mitiga el DoS únicamente si esa policy es `DROP`.

## ¿Cómo se implementa el servicio web de la DMZ y por qué comprometerlo no revela información de clientes? {#seguridad-en-redes:web-server-bastion-y-carga-desacoplada}
> pagina: diseno-de-servicios-en-la-dmz

Es un **servidor endurecido** (*Bastion Host*) ubicado en la DMZ: sólo brinda los servicios necesarios, **web y SSH**, y la conexión remota se permite **sólo desde el firewall interno** y con certificados.

La **carga de nuevas órdenes está desacoplada** en tres pasos: la aplicación web procesa la orden y la graba; **otro proceso** la encripta y la mueve a una zona no accesible por el web server; un proceso de la **red interna** recupera los archivos.

Como el web server sólo escribe, comprometerlo no da acceso de lectura a las órdenes ya cargadas: leerlas es un privilegio que ese servidor nunca tuvo.

## ¿Qué dos controles tiene el camino saliente del servicio de email que el entrante no tiene? {#seguridad-en-redes:email-entrante-contra-saliente}
> pagina: diseno-de-servicios-en-la-dmz

Los dos caminos revisan encabezados, contenido y adjuntos y filtran spam y virus conocidos. El **saliente** agrega:

- **Filtrar contenidos confidenciales** — marcas de agua, palabras clave.
- **Revisar todo el header y reemplazar hosts, IPs y usuarios internos** por la dirección o nombre del firewall externo.

El **entrante**, en cambio, elimina emails mal formados y **reescribe direcciones** para que apunten al email interno (`xx@drib.org` → `xx@smtpe1.drig.org`). El entrante oculta la estructura interna; el saliente oculta la identidad interna y además evita fugas de información.

## ¿Qué hace el servidor web proxy de la DMZ? {#seguridad-en-redes:web-proxy-saliente}
> pagina: diseno-de-servicios-en-la-dmz

Es el proxy **saliente** que usa la red interna para navegar:

- Recibe requerimientos web dirigidos a terceros.
- **Verifica que el origen sea la dirección del firewall interno**: no acepta pedidos que no vengan mediados por ese firewall.
- Filtra requerimientos mal formados: posibles ataques lanzados desde la propia red interna, o uso indebido del protocolo (ejemplo de la filmina: un servidor SSH externo escuchando en el puerto 80 para evadir un firewall que sólo permite tráfico web).
- Prohíbe el acceso a páginas no permitidas y, **opcionalmente**, cachea los recursos más solicitados.

## Enuncie la política del firewall externo del caso de estudio {#seguridad-en-redes:firewall-externo-reglas}
> pagina: reglas-de-los-firewalls-externo-e-interno

Media entre `Internet` y la `DMZ`:

- **Tráfico entrante** SMTP, HTTP y HTTPS: redirecciona SMTP al `mail server` y HTTP/S al `web server`.
- **Tráfico saliente** HTTP/S y SMTP: SMTP **sólo** desde el `mail server` de la DMZ, HTTP/S **sólo** desde el `web proxy server`.
- Realiza **NAT** para ocultar direcciones internas.
- **Rechaza cualquier otro tipo de tráfico.**

El permiso saliente no es "desde cualquier host de la DMZ": es un servidor puntual por protocolo.

## Enuncie la política del firewall interno y la asimetría que lo distingue del externo {#seguridad-en-redes:firewall-interno-asimetria}
> pagina: reglas-de-los-firewalls-externo-e-interno

Media entre la `DMZ` y la red `INTERNAL`:

- **De la red interna a la DMZ**: SMTP saliente sólo desde el servidor SMTP interno; HTTP/S saliente redireccionado **(transparentemente)** al proxy web; SSH sólo desde el host administrativo hacia servidores de la DMZ.
- **De la DMZ a la red interna**: **sólo** tráfico SMTP proveniente del email server.
- Realiza **NAT** y **rechaza cualquier otro tipo de tráfico**.

La asimetría: de los cuatro flujos posibles, DMZ→interna es el único reducido a **un solo protocolo y un solo origen**, para que un servidor comprometido de la DMZ casi no tenga camino de vuelta hacia adentro.

## ¿En qué consiste la segmentación de la red interna y qué ejemplo de política da la cátedra? {#seguridad-en-redes:segmentacion-red-interna}
> pagina: segmentacion-de-la-red-interna

Tres reglas:

1. **División en subredes según cada grupo** — en el diagrama, `Corporate data subnet`, `Customer data subnet` y `Development subnet`.
2. **Cada subred arbitrada por un firewall**, probablemente un packet filter.
3. **Impide el acceso a subredes de acuerdo a las políticas.**

El ejemplo de la filmina: *"no se permite tráfico desde la red de desarrollo hacia la red corporativa"*. Es la misma lógica de la DMZ un nivel más adentro: "adentro" no es un único nivel de confianza.

## Enuncie las tres reglas de diseño del log server de la DMZ y qué garantizan ante un incidente {#seguridad-en-redes:log-server-dmz}
> pagina: servicios-de-soporte-dns-log-y-proxy

1. Cada servidor **sólo puede agregar** información al log, nunca leerlo ni modificarlo.
2. Cada servidor utiliza un **canal propio**.
3. Los logs se guardan **en el filesystem y en un medio de sólo escritura**.

Ante un incidente: si se compromete un servidor de la DMZ, el registro de lo que hizo ya está en el log server, fuera de su alcance; si se compromete el propio log server, el log todavía se recupera accediendo **físicamente** al medio de sólo escritura.

## ¿Qué principio de diseño viola el DNS server interno, por qué, y cómo se lo mitiga? {#seguridad-en-redes:dns-interno-mecanismos-exclusivos}
> pagina: servicios-de-soporte-dns-log-y-proxy

Resuelve direcciones internas y además **puede permitir búsquedas de DNS externos** pasando por los firewalls. Eso, textual de la filmina, **viola el principio de mecanismos exclusivos, porque todos los servidores usarían este servicio**: un punto único que, comprometido, puede redirigir a cualquier consumidor de la red hacia un destino malicioso.

Mitigación que da la propia filmina: **configurar las direcciones de los firewalls en cada servidor**, de modo que esa ruta crítica no dependa de una resolución de nombres que podría estar falseada. El DNS de la DMZ, en cambio, **sólo incluye información de la DMZ**.

## ¿Por qué un ataque en la DMZ se trata distinto que uno en el firewall externo? {#seguridad-en-redes:ataques-en-la-dmz}
> pagina: analisis-de-puntos-de-entrada

- **En el firewall externo**: se **registran los ataques no exitosos y se los ignora**, más que nada con fines estadísticos, porque el tráfico hostil de Internet es constante y previsible.
- **En la DMZ**: interés particular en los ataques, **tanto exitosos como no exitosos**, porque *"se supone que no debiera haber ataques en la DMZ"*.

Un ataque exitoso en la DMZ implica haber pasado el firewall externo, lo que reduce las causas posibles a tres: un administrador que no es confiable, el firewall externo comprometido, o un fallo de software en la propia DMZ.

## Distinga IDS de IPS, con la definición de cada uno {#seguridad-en-redes:ids-contra-ips}
> pagina: deteccion-y-prevencion-de-intrusiones

- **`IDS`** (*Intruder Detection System*): software que **analiza eventos y busca patrones que indiquen un posible ataque**. Idealmente combina eventos de **red** y de **hosts**, requiere afinación, y **complementa al control manual, no lo reemplaza** — debiera realizarse una contrastación manual periódica de que esté funcionando.
- **`IPS`** (*Intruder Prevention System*): lleva la detección de intrusiones **un nivel más adelante**, permitiendo ejecutar acciones al momento de detectar el ataque; por lo general se limita a **bloquear en el firewall las comunicaciones que incluyan al origen del ataque**.

`IDS` detecta y avisa; `IPS` detecta y actúa, y necesita internamente la misma capacidad de análisis que un `IDS`.

## ¿Cuáles son las dos variaciones de la arquitectura que reconoce la clase y qué las motiva? {#seguridad-en-redes:variaciones-de-la-arquitectura}
> pagina: variaciones-de-la-arquitectura

- **Ancho de banda muy alto → clusters de firewalls.** Es **fácil con packet filters**, que evalúan cada paquete de forma independiente; los **statefull filters y los application proxies requieren sincronización entre nodos** (*sticky session*). Variante alternativa: separar por función en servidores diferentes (packet filter, web proxy, SMTP proxy).
- **Redes pequeñas → compromiso entre costo y seguridad.** Unificar servidores, lo que **viola mecanismos exclusivos** y crea un *single point of failure* (paliativo: **virtualización**), o **tercerizar la DMZ** en un datacenter alquilado.
