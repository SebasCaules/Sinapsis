---
title: Reglas de los firewalls externo e interno
resumen: 'Política concreta de los dos firewalls del caso de estudio: qué protocolos permite cada uno y en qué sentido, con el interno mucho más restrictivo que el externo en la dirección DMZ hacia la red interna.'
fuentes: ["[[clase-10-seguridad-en-la-empresa]]", "[[netfilter-e-iptables]]", "[[diseno-de-servicios-en-la-dmz]]", "[[zona-desmilitarizada]]"]
aliases: [Firewall externo, Firewall interno, Reglas del firewall externo, Reglas del firewall interno, Asimetría de los dos firewalls, Outer firewall, Inner firewall]
type: concepto
unidad: 2
clase: 10
orden: 6
created: 2026-09-04
updated: 2026-09-06
tags: [seguridad-en-redes, firewalls, dmz, nat, mediacion-completa, clase-10, sin-dictar]
sources: ["Clase 11 - Seguridad en Redes.pdf"]
---

# Reglas de los firewalls externo e interno

**La política concreta de cada uno de los dos firewalls del caso de estudio, y por qué el interno es marcadamente más restrictivo que el externo en un solo sentido del tráfico.** Es la nota que traduce [[netfilter-e-iptables|Netfilter e iptables]] y los [[diseno-de-servicios-en-la-dmz|tres servicios de la DMZ]] en reglas de alto nivel — el punto donde el vocabulario técnico de las secciones anteriores se convierte en la política real de una red.

*(Filminas 22 a 24 del deck de Seguridad en Redes.)* La **Clase 10 — Seguridad en la empresa** todavía no se dictó (hoy es 04/09/2026, la fecha del cronograma es el 29/10/2026): esta nota está escrita contra el PDF de filminas, sin transcripción ni video. Verificada contra la página renderizada a 150 dpi. Ver [[clase-10-seguridad-en-la-empresa#Estado de las fuentes|Estado de las fuentes de la clase]].

---

## Firewall externo (filmina 22)

Media entre `Internet` y la `DMZ` en el [[seguridad-a-nivel-de-red#El diagrama de referencia (filmina 4)|diagrama de referencia]]:

- **Permite tráfico entrante** SMTP, HTTP y HTTPS: redirecciona SMTP al `mail server`, HTTP/S al `web server`.
- **Permite tráfico saliente** HTTP/S y SMTP: SMTP **sólo** desde el `mail server` de la DMZ, HTTP/S **sólo** desde el `web proxy server` de la DMZ.
- Realiza **NAT** para ocultar direcciones internas.
- **Rechaza cualquier otro tipo de tráfico.**

El punto que conviene no pasar por alto: el tráfico saliente permitido no es "desde cualquier host de la DMZ", es **desde un servidor puntual por protocolo** — SMTP únicamente desde el mail server, HTTP/S únicamente desde el proxy web. Un tercer servidor de la DMZ (el DNS server, por ejemplo) no tiene permiso para iniciar tráfico saliente HTTP/S ni SMTP por esta regla, aunque esté en la misma subred.

## Firewall interno (filmina 23)

Media entre la `DMZ` y la red `INTERNAL`:

- **Permite tráfico de la red interna a la DMZ**:
  - SMTP saliente, **sólo** desde el servidor SMTP interno, redireccionado a **web server en DMZ**.
  - HTTP/S saliente, redireccionado **(transparentemente)** al proxy web.
  - SSH, **sólo** desde el host administrativo hacia servidores de la DMZ.
- **Permite tráfico de la DMZ a la red interna**: **sólo** tráfico SMTP proveniente del email server.
- Realiza **NAT** para ocultar direcciones internas.
- **Rechaza cualquier otro tipo de tráfico.**

> **Posible inconsistencia de contenido, no errata de tipeo** *(lectura nuestra).* La filmina dice literalmente *"redireccionado a web server en DMZ"* para el tráfico SMTP saliente desde el servidor SMTP interno — verificado contra la página renderizada a 150 dpi, no es un artefacto de extracción. Llama la atención frente al resto de la clase: la filmina 22 (firewall externo) sí redirige el SMTP **entrante** al **mail server**, y en ningún otro lugar del deck el servidor web recibe tráfico SMTP — el servicio email de las filminas 18-20 corre siempre en su propio servidor, separado del web. Es posible que la filmina tenga un error de contenido y debiera decir "mail server", pero no hay forma de confirmarlo sin la clase en vivo, así que se deja tal como está escrita en el material de la cátedra en lugar de corregirla en silencio.

### La asimetría entre los dos firewalls

Dos observaciones que conviene tener explícitas, porque es el tipo de comparación que un examen puede pedir directamente:

- **El firewall interno es más restrictivo que el externo en la dirección DMZ→interna.** El externo deja pasar SMTP y HTTP/S en ambos sentidos (con las restricciones de origen ya vistas); el interno, en el sentido DMZ→interna, **sólo** deja pasar SMTP. La DMZ nunca inicia una conexión web hacia la red interna, porque no hay ninguna razón operativa para que lo haga — nada en la red interna necesita recibir peticiones web iniciadas desde afuera de sí misma.
- **El proxy web recibe tráfico redireccionado, no solicitado directamente por el usuario.** *"Redirecciona (transparentemente)"* significa que el usuario de la red interna no configura el proxy a mano: el propio firewall interno **intercepta** el tráfico HTTP/S saliente y lo fuerza a pasar por el proxy, sin que el usuario lo note. Es una instancia concreta de [[principios-de-diseno#4. Mediación completa|mediación completa]]: todo el tráfico relevante pasa por el punto de control, sin depender de que cada usuario recuerde configurarlo.

## Consecuencias, comunes a ambos firewalls (filmina 24)

- **Toda comunicación con Internet pasa por los firewalls externo *y* interno** — nunca por uno solo.
- **La mediación de tráfico web es transparente para el usuario.**
- **Sólo se permiten conexiones salientes desde servidores conocidos** — nunca desde un host arbitrario de la DMZ o de la red interna.
- **La arquitectura permite separar los servicios en diferentes servidores.**

Las etiquetas de margen de esta filmina son `Mediación Completa`, `Aceptación Psicológica`, `Menor privilegio` y `Mecanismos Exclusivos`. La que vale la pena resaltar es **[[principios-de-diseno#8. Aceptación psicológica|aceptación psicológica]]**: que el proxy sea transparente significa que el usuario **no necesita saber** que está siendo mediado para seguir usando la red con normalidad — el mecanismo de seguridad no le exige un cambio de comportamiento, que es justamente lo que ese principio pide. Un proxy que el usuario tuviera que configurar a mano fallaría en ese punto, aunque filtrara exactamente lo mismo.

## Tabla resumen: quién puede hablar con quién

| Origen → Destino | Protocolo permitido | Restricción de origen/destino |
|---|---|---|
| Internet → DMZ | SMTP, HTTP/S | Redirigido al mail server / web server según protocolo |
| DMZ → Internet | SMTP, HTTP/S | Sólo desde mail server (SMTP) o proxy web (HTTP/S) |
| Interna → DMZ | SMTP, HTTP/S, SSH | SMTP sólo desde SMTP interno; HTTP/S redirigido al proxy; SSH sólo desde host administrativo |
| DMZ → Interna | SMTP únicamente | Sólo desde el email server |
| Cualquier otro caso | — | Rechazado por ambos firewalls |

La fila que más se presta a error en un parcial es la de **DMZ → Interna**: de los cuatro flujos posibles, es el único reducido a un solo protocolo y un solo origen — reflejo directo de que, según la [[zona-desmilitarizada#Por qué la DMZ no es sólo "una subred con menos privilegios"|zona desmilitarizada]], un servidor de la DMZ comprometido no debería tener casi ningún camino de vuelta hacia adentro.
