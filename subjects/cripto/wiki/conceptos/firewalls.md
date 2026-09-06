---
title: Firewalls
resumen: 'Host que controla el acceso a una red, en los tres tipos que distingue la cátedra según cuánto del paquete inspeccionan: packet filter, statefull packet filter y application firewall o proxy, a mayor costo y especificidad.'
fuentes: ["[[clase-10-seguridad-en-la-empresa]]", "[[seguridad-a-nivel-de-red]]", "[[netfilter-e-iptables]]", "[[reglas-de-los-firewalls-externo-e-interno]]"]
aliases: [Firewall, Packet filter, Statefull packet filter, Stateful packet filter, Application firewall, WAF, Web Application Firewall, Proxy firewall]
type: concepto
unidad: 2
clase: 10
orden: 2
created: 2026-09-04
updated: 2026-09-04
tags: [seguridad-en-redes, firewalls, packet-filter, stateful, proxy, waf, clase-10, sin-dictar]
sources: ["Clase 11 - Seguridad en Redes.pdf"]
---

# Firewalls

**Los tres tipos de firewall, ordenados por cuánto del paquete inspeccionan, y por qué esa progresión es la primera pregunta de examen que se puede armar con este material: a mayor capacidad de inspección, mayor costo y mayor especificidad.** Ningún tipo domina a los otros en todos los ejes — es la razón por la que el caso de estudio de esta clase termina usando los tres a la vez, en distintos puntos de la misma red.

*(Filminas 5 a 9 del deck de Seguridad en Redes.)* La **Clase 10 — Seguridad en la empresa** todavía no se dictó (hoy es 04/09/2026, la fecha del cronograma es el 29/10/2026): esta nota está escrita contra el PDF de filminas, sin transcripción ni video. Ver [[clase-10-seguridad-en-la-empresa#Estado de las fuentes|Estado de las fuentes de la clase]].

---

## Definición común (filmina 5)

Un **firewall** es, textualmente, un **host que controla el acceso a una red**. La filmina lo ilustra reutilizando el [[seguridad-a-nivel-de-red#El diagrama de referencia (filmina 4)|diagrama de referencia]] de la clase: hay exactamente dos firewalls en el caso de estudio, el `Outer firewall` (entre Internet y la DMZ) y el `Inner firewall` (entre la DMZ y la red interna), y los dos son firewalls en el mismo sentido de la palabra — controlan qué atraviesa un punto de mediación —, aunque terminen configurados con políticas muy distintas (ver [[reglas-de-los-firewalls-externo-e-interno|Reglas de los firewalls externo e interno]]).

Sobre esa definición común, la cátedra distingue tres tipos según **cuánto del paquete miran**.

## Tipo 1 — Packet filters (filmina 6)

Controlan el acceso según:

- El **sentido** del tráfico: entrante o saliente.
- Características del paquete: **host y puerto** origen/destino, **flags** (`Syn`, `Rst`), **protocolo de transporte** (`TCP`, `IP`, `ICMP`).

Reglas del tipo `src:*:* dst:www.ss.com:80 allow` — origen arbitrario, destino un host y puerto específicos, acción permitir. Es la **forma más simple y transparente de control**: **no mira el contenido** del paquete, sólo sus encabezados, y el ejemplo canónico son los **routers**.

Su límite es exactamente lo que no evalúa. *(Ejemplo propio, no de la filmina.)* Con una regla como la del ejemplo anterior —`src:*:* dst:www.ss.com:80 allow`—, un packet filter no puede distinguir un `GET /index.html` legítimo de un `GET /../../etc/passwd` malicioso si ambos llegan por el puerto 80 desde un origen permitido: los dos tienen los mismos encabezados de interés, y el contenido de la petición HTTP —la parte que marca la diferencia— es precisamente lo que este tipo de firewall no mira. Para eso hace falta el tipo 3.

## Tipo 2 — Statefull packet filters (filmina 7)

Igual que el tipo 1, pero **"recuerdan" conexiones pasadas**. Dos capacidades que agregan sobre el tipo anterior:

- Determinar si una conexión es **nueva**, **existente** o **inválida** — no evaluar cada paquete de forma aislada, sino en el contexto de la conexión a la que pertenece.
- **Manipular los paquetes**, por ejemplo aplicar `NAT`.

Esta es exactamente la propiedad que explota el módulo `state` de `iptables` en la sección siguiente: una regla con `-m state --state NEW,ESTABLISHED` sólo tiene sentido si el firewall lleva una tabla de conexiones activas para poder clasificar cada paquete entrante contra ella. Ver [[netfilter-e-iptables#Los seis comandos de las filminas 12 y 13|Netfilter e iptables]].

## Tipo 3 — Application firewalls (filminas 8-9)

También llamados **proxy**, **proxy firewall** o **`WAF`** (*Web Application Firewall*). Es un **agente intermediario**:

- Cada parte dialoga con el proxy **pensando que es la otra parte** — ni el cliente ni el servidor hablan directamente entre sí.
- El proxy **decide** si el mensaje pasa, se descarta, o se modifica.
- Puede además **registrar eventos** o **disparar alarmas**.
- Es **específico de un protocolo de aplicación** — web proxy, ftp proxy, email proxy — aunque muchos manejan varios protocolos a la vez.

### El ejemplo de la filmina 9, transcripto

La filmina da un ejemplo concreto que ancla el tipo 3, y es literalmente el flujo que el caso de estudio implementa después en el servicio de email de la DMZ (ver [[diseno-de-servicios-en-la-dmz#Servicio email (filminas 18-20)|Diseño de servicios en la DMZ]]):

$$\begin{aligned}
&\text{1. Los emails llegan al firewall}\\
&\text{2. El firewall ensambla los paquetes, reconstruye el email}\\
&\text{3. Si hay archivos adjuntos, los escanea}\\
&\qquad\text{3.1. Si detecta un problema, descarta el email o elimina el adjunto}\\
&\text{4. Revisa el origen contra una lista de spams}\\
&\qquad\text{4.1. Si lo encuentra en la lista, lo descarta}\\
&\text{5. Envía el email al servidor destino}
\end{aligned}$$

El paso 2 es la clave de por qué esto sólo lo puede hacer un application firewall y no un packet filter: **reconstruir el email exige entender el protocolo de aplicación por completo**, no sólo mirar puertos y flags. Un packet filter ve TCP; un application firewall ve SMTP.

## La progresión, y por qué el caso de estudio usa los tres

| Tipo | Qué mira | Estado de conexión | Entiende el protocolo | Costo | Ejemplo |
|---|---|---|---|---|---|
| Packet filter | Sentido + encabezados | No | No | Bajo | Router |
| Statefull packet filter | Ídem + estado de la conexión | Sí | No | Medio | `iptables` con `-m state` |
| Application firewall / proxy / `WAF` | Contenido de la aplicación | Depende de la implementación | Sí, de **un** protocolo | Alto | Proxy de email, proxy web |

**A mayor capacidad de inspección, mayor costo y mayor especificidad.** Un packet filter es barato y genérico pero ciego al contenido; un application firewall ve el contenido pero sólo entiende el protocolo para el que fue construido — un proxy de email no sirve para filtrar tráfico web. Es la base de cualquier pregunta de parcial que pida justificar por qué un firewall dado no alcanza para una tarea dada: si la tarea requiere mirar contenido de aplicación, ningún packet filter —con o sin estado— la resuelve.

El caso de estudio de las filminas 16-27 combina los tres niveles a propósito, en distintos puntos de la misma red: `iptables` (tipo 1 y 2, ver [[netfilter-e-iptables|Netfilter e iptables]]) en los dos firewalls perimetrales, y proxies de aplicación —email, web— como una capa adicional dentro de la DMZ. Ningún nivel reemplaza a los otros; se apilan.

## Ver también

- [[clase-10-seguridad-en-la-empresa#2. Firewalls: los tres tipos (filminas 5-9)|Clase 10 — Seguridad en la empresa]] — la sección de la clase que esta nota desarrolla
- [[seguridad-a-nivel-de-red|Seguridad a nivel de red]] — el diagrama de dos firewalls (externo/interno) sobre el que se define todo lo demás
- [[netfilter-e-iptables|Netfilter e iptables]] — la implementación concreta de los tipos 1 y 2 en Linux
- [[diseno-de-servicios-en-la-dmz|Diseño de servicios en la DMZ]] — dónde el caso de estudio usa un application firewall para email
- [[reglas-de-los-firewalls-externo-e-interno|Reglas de los firewalls externo e interno]] — las políticas concretas de los dos firewalls perimetrales del diagrama
