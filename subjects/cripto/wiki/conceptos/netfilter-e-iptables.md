---
title: Netfilter e iptables
resumen: 'Implementación en Linux de un packet filter y de un statefull packet filter: tablas, chains, policy por defecto y los seis comandos de ejemplo del deck, explicados bandera por bandera.'
fuentes: ["[[clase-10-seguridad-en-la-empresa]]", "[[firewalls]]", "[[reglas-de-los-firewalls-externo-e-interno]]", "[[clase-08-principios-de-diseno-y-vulnerabilidades]]"]
aliases: [Netfilter, iptables, IPTables, Chains de iptables, Tablas de iptables, FORWARD chain, Reglas de iptables]
type: concepto
unidad: 2
clase: 10
orden: 3
created: 2026-09-04
updated: 2026-09-04
tags: [seguridad-en-redes, iptables, netfilter, linux, firewalls, clase-10, sin-dictar]
sources: ["Clase 11 - Seguridad en Redes.pdf"]
---

# Netfilter e iptables

**Cómo se implementa en Linux un [[firewalls|packet filter y un statefull packet filter]], con las seis reglas de ejemplo del deck transcriptas y explicadas flag por flag — es el material más directamente transcribible a un examen escrito, porque cada bandera tiene un porqué puntual.** `Netfilter`/`iptables` es el firewall por defecto en Linux, y las filminas 12-13 son, en la práctica, un mini-catálogo de los casos de uso más comunes.

*(Filminas 10 a 13 del deck de Seguridad en Redes.)* La **Clase 10 — Seguridad en la empresa** todavía no se dictó (hoy es 04/09/2026, la fecha del cronograma es el 29/10/2026): esta nota está escrita contra el PDF de filminas, sin transcripción ni video. Comandos verificados contra la página renderizada a 150 dpi, no contra el texto extraído. Ver [[clase-10-seguridad-en-la-empresa#Estado de las fuentes|Estado de las fuentes de la clase]].

---

## Tablas, chains y reglas (filmina 10)

`Netfilter`/`iptables` define **tablas** (*tables*) con **reglas** (*policies*) para distintos tipos de operaciones, llamadas **chains**. En la tabla `FILTER` —la que importa para esta nota— las chains más comunes son:

- `INPUT` — paquetes **entrantes** al host.
- `OUTPUT` — paquetes **salientes** del host.
- `FORWARD` — paquetes que se **rutean entre redes**, con el host actuando de router.

Cada chain tiene una **acción por defecto** (*policy*): `ACCEPT` o `DROP`. Es la política que se aplica cuando **ninguna** regla explícita de la chain matcheó al paquete — la diferencia entre "agregar una regla" y "fijar la policy" es la primera distinción que hay que tener clara antes de leer los ejemplos.

## Las otras tablas (filmina 11)

Cada tabla la define un módulo distinto de Netfilter:

| Tabla | Para qué sirve |
|---|---|
| `Filter` | Grupo **por defecto**; el original de Netfilter, para reglas de firewall |
| `Nat` | Traducción de direcciones de red |
| `Raw` | Reglas que acceden en crudo a los paquetes |
| `Security` | Reglas de acceso discrecional aplicadas cuando hay una capa de acceso mandatorio (por ejemplo, `SELinux`) |
| `Mangle` | Modificar headers por temas de `QoS`, `TTL`, o marcarlos para darles contexto |

De las cinco, la única que aparece en los ejemplos de las filminas 12-13 es `Filter` — las reglas de `NAT` que mencionan las [[reglas-de-los-firewalls-externo-e-interno|políticas de los firewalls perimetrales]] ("realiza NAT para ocultar direcciones internas") corresponden a la tabla `Nat`, pero el deck no da su sintaxis.

## Los seis comandos de las filminas 12 y 13

Transcriptos literalmente, verificados contra la página renderizada. Cada bloque es exactamente el texto de la filmina, con sus flags explicados debajo.

### 1. Bloquear tráfico desde una IP

```
iptables -A INPUT -s "201.232.1.24" -j DROP
```

`-A INPUT` **agrega** (*append*) la regla al final de la chain `INPUT`. `-s` fija la dirección **origen** (*source*) a matchear. `-j DROP` es el *target*: si la regla matchea, **descarta** el paquete sin avisar al emisor.

### 2. Denegar tráfico entrante por defecto

```
iptables -P INPUT DROP
```

`-P` fija la **policy** (acción por defecto) de la chain, **no agrega una regla**. Cambia la chain entera a *denegar por defecto* — el patrón de diseño que exige [[clase-08-principios-de-diseno-y-vulnerabilidades#1.4. Mediación completa|mediación completa]]: todo lo no permitido explícitamente queda afuera.

*(Lectura nuestra sobre el orden de este comando en un script real.)* La filmina no dice en qué momento del script conviene fijar esta policy, y hay dos prácticas con compromisos opuestos, no una sola "correcta". Fijar `DROP` **al principio**, antes de cargar las reglas de `ACCEPT` que siguen, cierra de entrada cualquier ventana con el `ACCEPT` por defecto de fábrica de la chain — al costo de dejar al propio administrador bloqueado por esa misma policy hasta terminar de cargar las reglas, riesgo que en la práctica se resuelve teniendo acceso por consola (fuera de la interfaz de red que se está configurando) en vez de depender de la sesión que se está por cortar. Fijar `DROP` **al final**, después de cargar las reglas de `ACCEPT`, evita ese riesgo de bloqueo — pero deja la chain en `ACCEPT` mientras el resto del script corre. Muchas guías de hardening optan por la primera opción justamente para no dejar esa ventana; ninguna de las dos es universalmente superior, es un trade-off entre superficie de exposición temporal y riesgo de auto-bloqueo.

### 3. Permitir conexiones SSH desde una IP

Dos reglas que van **juntas**:

```
iptables -A INPUT -i eth0 -p tcp -s 192.168.200.0/24 --dport 22
          -m state --state NEW,ESTABLISHED -j ACCEPT

iptables -A OUTPUT -o eth0 -p tcp --sport 22
          -m state --state ESTABLISHED -j ACCEPT
```

- `-i eth0` / `-o eth0` — interfaz de **entrada** (*in*) o **salida** (*out*) por la que debe llegar/salir el paquete.
- `-p tcp` — protocolo de transporte.
- `-s 192.168.200.0/24` — restringe el origen a esa subred.
- `--dport 22` / `--sport 22` — puerto **destino** o **origen**; 22 es el puerto de SSH.
- `-m state --state NEW,ESTABLISHED` — invoca el módulo *statefull* (ver [[firewalls#Tipo 2 — Statefull packet filters (filmina 7)|Firewalls, tipo 2]]): acepta paquetes que **inician** una conexión nueva o que pertenecen a una **ya establecida**.
- `-j ACCEPT` — deja pasar el paquete.

**Por qué `OUTPUT` sólo acepta `ESTABLISHED`, no `NEW`.** La conexión SSH la abre siempre el cliente hacia el servidor; el servidor nunca inicia una sesión SSH saliente por ese puerto, sólo responde dentro de una ya abierta. Si la regla de `OUTPUT` aceptara también `NEW`, estaría permitiendo que **el propio host** iniciara conexiones SSH salientes por el puerto 22 — un permiso que la regla de entrada no pide y que ensancharía innecesariamente la superficie de lo permitido, violando [[clase-08-principios-de-diseno-y-vulnerabilidades#1.1. Menor privilegio|menor privilegio]] *(lectura nuestra)*.

### 4. Permitir conexiones http/s

```
iptables -A INPUT -i eth0 -p tcp -m multiport --dports 80,443
          -m state --state NEW,ESTABLISHED -j ACCEPT
iptables -A OUTPUT -o eth0 -p tcp -m multiport --sports 80,443
          -m state --state ESTABLISHED -j ACCEPT
```

Mismo patrón que SSH, con una novedad: `-m multiport --dports 80,443` invoca el módulo `multiport` para matchear **una lista** de puertos destino (HTTP y HTTPS) **en una sola regla**, en vez de escribir una regla por puerto. Sin `multiport` harían falta cuatro reglas (dos puertos × dos chains) en lugar de dos.

### 5. Prevenir DoS

```
iptables -A INPUT -p tcp --dport 80
          -m limit --limit 25/minute --limit-burst 100 -j ACCEPT
```

`-m limit` invoca el módulo de *rate limiting*. `--limit 25/minute` fija el régimen **sostenido**: como máximo 25 paquetes por minuto matchean y se aceptan por esta regla. `--limit-burst 100` es el balde inicial: permite una **ráfaga** de hasta 100 antes de que el límite sostenido empiece a aplicar.

> **Lectura nuestra sobre el efecto real de esta regla.** Tal como está escrita, **no** hay una regla de `DROP` explícita después para el tráfico que excede el límite. Lo único que hace esta línea sola es dejar de emitir `ACCEPT` para el exceso; qué le pasa efectivamente a ese tráfico depende de la **policy por defecto** de la chain `INPUT` (comando 2 de esta misma filmina): si es `DROP`, el exceso se descarta y la regla cumple su propósito de mitigar DoS; si fuera `ACCEPT`, el tráfico en exceso pasaría igual y la regla de `limit` no protegería nada. La filmina no lo dice explícitamente, pero encaja con el resto del deck: el caso de estudio siempre asume policy `DROP` por defecto en los firewalls perimetrales (ver [[reglas-de-los-firewalls-externo-e-interno|Reglas de los firewalls externo e interno]], *"rechaza cualquier otro tipo de tráfico"*).

### 6. Permitir conexiones desde la red interna a la externa

```
# eth0 – red interna, eth1 - internet
iptables -A FORWARD -i eth0 -o eth1 -j ACCEPT
```

La única de las seis que toca la chain `FORWARD`: el host actúa de **router** entre dos interfaces, no de origen o destino final del tráfico — exactamente el rol de un firewall perimetral con dos patas de red, como los dos firewalls del [[seguridad-a-nivel-de-red#El diagrama de referencia (filmina 4)|diagrama de referencia]] de la clase.

## Tabla resumen de flags, para repaso rápido

| Flag | Qué fija | Chain donde aparece en los ejemplos |
|---|---|---|
| `-A` | Agrega una regla al final de la chain | Todas |
| `-P` | Fija la policy por defecto (no agrega regla) | `INPUT` |
| `-i` / `-o` | Interfaz de entrada / salida | `INPUT`/`OUTPUT`/`FORWARD` |
| `-s` / `-d` | Dirección origen / destino | `INPUT` |
| `-p` | Protocolo de transporte | `INPUT`, `OUTPUT` |
| `--dport` / `--sport` | Puerto destino / origen | `INPUT`, `OUTPUT` |
| `-m multiport --dports/--sports` | Lista de puertos en una sola regla | `INPUT`, `OUTPUT` |
| `-m state --state` | Filtra por estado de la conexión (`NEW`, `ESTABLISHED`, `INVALID`) | `INPUT`, `OUTPUT` |
| `-m limit --limit/--limit-burst` | Régimen y ráfaga de *rate limiting* | `INPUT` |
| `-j` | Target: `ACCEPT` / `DROP` | Todas |

## Ver también

- [[clase-10-seguridad-en-la-empresa#3. Netfilter e iptables (filminas 10-13)|Clase 10 — Seguridad en la empresa]] — la sección de la clase que esta nota desarrolla
- [[firewalls#Tipo 2 — Statefull packet filters (filmina 7)|Firewalls]] — qué es un statefull packet filter, del que `-m state` es la implementación concreta
- [[reglas-de-los-firewalls-externo-e-interno|Reglas de los firewalls externo e interno]] — la política de alto nivel que estas reglas de `iptables` implementarían en la práctica
- [[clase-08-principios-de-diseno-y-vulnerabilidades#1.4. Mediación completa|Clase 08 — Principios de diseño y vulnerabilidades]] — el principio de mediación completa que la policy `DROP` por defecto materializa
