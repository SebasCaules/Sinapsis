---
title: Análisis de puntos de entrada
resumen: 'Inventario de las tres superficies por las que un atacante puede entrar a la arquitectura y de qué cubre cada una, con la premisa de que algún ataque puede ser exitoso y el trato asimétrico según la capa donde ocurre.'
fuentes: ["[[clase-10-seguridad-en-la-empresa]]", "[[diseno-de-servicios-en-la-dmz]]", "[[servicios-de-soporte-dns-log-y-proxy]]", "[[deteccion-y-prevencion-de-intrusiones]]"]
aliases: [Análisis de puntos de entrada, Puntos externos de entrada, Anticipándose al ataque, Anticipándose]
type: concepto
unidad: 2
clase: 10
orden: 9
created: 2026-09-04
updated: 2026-09-04
tags: [seguridad-en-redes, superficie-de-ataque, dmz, defensa-en-profundidad, ids, clase-10, sin-dictar]
sources: ["Clase 11 - Seguridad en Redes.pdf"]
---

# Análisis de puntos de entrada

**Un inventario explícito de por dónde puede entrar un atacante a la arquitectura completa, y qué cubre cada punto — cerrado con la premisa que reencuadra las ocho secciones anteriores: es posible que algún ataque sea exitoso.** Es la bisagra entre "diseñar para prevenir" (secciones 1 a 8) y "diseñar asumiendo que la prevención puede fallar" ([[deteccion-y-prevencion-de-intrusiones|Detección y prevención de intrusiones]]).

Cubre las filminas **29 a 31** del deck `Clase 11 - Seguridad en Redes.pdf`, tituladas *"Análisis de ataques"* (29) y *"Anticipándose"* (30-31). La clase todavía no se dictó — hoy es 04/09/2026 y está agendada para el 29/10 — así que esta nota está escrita contra el PDF de filminas, sin transcripción ni grabación; ver el aviso de fuente completo en [[clase-10-seguridad-en-la-empresa|Clase 10 — Seguridad en la empresa]].

## Los tres puntos externos de entrada (filmina 29)

La filmina no enumera vulnerabilidades puntuales: enumera **superficies**, y para cada una nombra qué la cubre.

| Punto de entrada | Qué lo cubre |
|---|---|
| Puertos del web server | El [[clase-10-seguridad-en-la-empresa#Servicio web proxy (filmina 21)\|proxy]] revisa requerimientos inválidos o sospechosos y los rechaza |
| Puerto del servidor de email | El [[clase-10-seguridad-en-la-empresa#Servicio email (filminas 18-20)\|proxy de email]] revisa emails buscando mensajes inválidos y los rechaza |
| Problemas de software o hardware en el firewall mismo | Dos principios combinados: el firewall diseñado lo más simple posible, y `defensa en profundidad` (DMZ + firewall interno) |

El tercer punto es el más interesante porque **no tiene un control puntual** como los dos primeros. Un packet filter o un application firewall son, ellos mismos, software: pueden tener bugs, configuraciones erróneas, o hardware que falla. Contra eso no hay un filtro adicional que lo revise —sería el mismo problema un nivel más arriba—, así que la mitigación es estructural: **menos código, menos superficie**, y si aun así falla, **una segunda barrera detrás** (el firewall interno) contiene el daño. Es la razón de fondo por la que la arquitectura entera usa dos firewalls y no uno solo: no es redundancia por las dudas, es la respuesta directa a que el firewall es, él mismo, un posible punto de entrada.

## La premisa que reencuadra todo (filminas 30-31)

*"Es posible que algún ataque sea exitoso."* Después de nueve secciones diseñando para minimizar probabilidad e impacto, la clase declara explícitamente que esa probabilidad **no llega a cero**, y dedica dos filminas a qué hacer cuando falla.

Los recaudos generales que propone (filmina 30) son cuatro, en orden creciente de automatización:

1. **Log detallado de eventos**, para ayudar el análisis — el insumo que produce el [[servicios-de-soporte-dns-log-y-proxy#Log Server en DMZ (filmina 26)|Log Server]] de la sección anterior.
2. **Análisis automático de eventos** (`IDS`).
3. **Ejecución de tareas en base a eventos** (`IPS`).
4. **Inspección manual de eventos.**

Las cuatro conviven: el log es el dato crudo, el `IDS` y el `IPS` son formas de automatizar su análisis y su respuesta —desarrolladas en [[deteccion-y-prevencion-de-intrusiones|Detección y prevención de intrusiones]]—, y la inspección manual sigue haciendo falta porque, como esa misma nota desarrolla, el `IDS` **complementa** el control manual, no lo reemplaza.

## Tratamiento asimétrico según dónde ocurre el ataque

Este es el contenido más denso de las dos filminas, y la parte que conviene retener con precisión: **el mismo evento —un ataque detectado— se trata distinto según en qué capa ocurre**, porque la capa determina qué tan probable "debería" ser ese evento.

### En el firewall externo

**Registrar los ataques no exitosos e ignorarlos**, más que nada para fines estadísticos. Es una decisión de costo, no de negligencia: el firewall externo está expuesto a Internet, así que recibe tráfico hostil de forma constante y previsible —escaneos de puertos, intentos de fuerza bruta, bots automatizados—. Investigar cada intento fallido individualmente no es productivo cuando el volumen es alto y la tasa de éxito, por diseño, es baja.

### En la DMZ

**Interés particular en los ataques, tanto exitosos como no exitosos.** La razón que da la propia filmina es la clave de toda la sección: *"se supone que no debiera haber ataques en la DMZ"*. Un intento de ataque contra un servidor de la DMZ ya es, en sí mismo, una señal de alarma —no hace falta que tenga éxito—, porque implica que alguien está apuntando específicamente a esa capa en vez de barrer Internet al azar.

> **Errata de la filmina.** La filmina 31 dice *"Tanto exitoso como no existosos"*: además de la falta de concordancia en número ("exitoso" en singular junto a "no existosos" en plural), la segunda palabra tiene dos letras trastocadas —debería ser "exitosos"—. Verificado contra la página renderizada a 150 dpi; no es un artefacto de `pdftotext`.

Más aún: **un ataque exitoso en la DMZ implica haber pasado el firewall externo**, lo que reduce las causas posibles a exactamente tres, según la propia filmina:

1. Un administrador que no es confiable (amenaza interna).
2. El firewall externo comprometido.
3. Un fallo de software en la propia DMZ.

Nótese que las tres son mutuamente excluyentes como explicación de **cómo** llegó el ataque, y las tres son piezas de la propia arquitectura de la clase —lo que confirma, otra vez, que un ataque exitoso en la DMZ nunca es "ruido de fondo": siempre apunta a una falla concreta en alguna de esas tres piezas.

## Por qué la asimetría es defendible, no arbitraria

*(Lectura nuestra.)* La justificación de fondo es bayesiana, aunque la filmina no lo plantee en esos términos: la probabilidad **a priori** de un ataque exitoso es muy distinta según la capa. Afuera del firewall externo, el tráfico hostil es la norma y el filtro exitoso es la excepción esperable —tratar cada intento fallido como una emergencia sería ruido puro—. Adentro de la DMZ, la norma **debería** ser tráfico legítimo ya filtrado por el firewall externo, así que cualquier desviación —exitosa o no— es evidencia fuerte de que algo en el modelo falló. La misma señal (un ataque) actualiza mucho más la creencia de "algo anda mal" cuando ocurre donde es infrecuente que cuando ocurre donde es rutina.

## Ver también

- [[clase-10-seguridad-en-la-empresa#9. Caso de estudio: análisis de puntos de entrada (filminas 29-31)|Clase 10 — Seguridad en la empresa: sección 9]]
- [[servicios-de-soporte-dns-log-y-proxy|Servicios de soporte: DNS, log y proxy]] — el Log Server que produce el insumo de este análisis
- [[segmentacion-de-la-red-interna|Segmentación de la red interna]]
- [[deteccion-y-prevencion-de-intrusiones|Detección y prevención de intrusiones]] — desarrollo de `IDS` e `IPS`, apenas anunciados acá
- [[diseno-de-servicios-en-la-dmz|Diseño de servicios en la DMZ]] — los proxies que cubren los dos primeros puntos de entrada
- [[videografia|Videografía]] — ningún video de la cátedra cubre esta clase, confirmado ahí
