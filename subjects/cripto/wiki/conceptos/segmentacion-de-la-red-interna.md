---
title: Segmentación de la red interna
resumen: 'División de la red interna en subredes por grupo, cada una arbitrada por un firewall, para que adentro no sea un único nivel de confianza; el ejemplo de la cátedra niega el tráfico de desarrollo hacia la red corporativa.'
fuentes: ["[[clase-10-seguridad-en-la-empresa]]", "[[seguridad-a-nivel-de-red]]", "[[firewalls]]", "[[zona-desmilitarizada]]"]
aliases: [Segmentación de la red interna, Subredes internas, Corporate data subnet, Customer data subnet, Development subnet]
type: concepto
unidad: 2
clase: 10
orden: 8
created: 2026-09-04
updated: 2026-09-04
tags: [seguridad-en-redes, segmentacion, subredes, defensa-en-profundidad, dmz, clase-10, sin-dictar]
sources: ["Clase 11 - Seguridad en Redes.pdf"]
---

# Segmentación de la red interna

**Por qué "adentro de la red interna" no es un único nivel de confianza, sino varios: la misma lógica que separaba lo externo de lo interno se aplica de nuevo, un nivel más adentro.** Es la nota más corta del caso de estudio —una sola filmina— y también la más fácil de subestimar: sin ella, la DMZ resuelve el problema de afuera-hacia-adentro pero deja "adentro" como un bloque homogéneo, que no lo es.

Cubre la filmina **28** del deck `Clase 11 - Seguridad en Redes.pdf`. La clase todavía no se dictó — hoy es 04/09/2026 y está agendada para el 29/10 — así que esta nota está escrita contra el PDF de filminas, sin transcripción ni grabación; ver el aviso de fuente completo en [[clase-10-seguridad-en-la-empresa|Clase 10 — Seguridad en la empresa]]. Se verificó que la filmina no pierde contenido al extraerla con `pdftotext` —es texto corto, tres bullets—, renderizada a 150 dpi.

## El mecanismo

Tres reglas, textuales de la filmina:

1. **División en subredes según cada grupo.** En el diagrama de la [[clase-10-seguridad-en-la-empresa#1. Seguridad a nivel de red (filminas 2-4)|filmina 4]], la red `INTERNAL` no es un único segmento: son `Corporate data subnet`, `Customer data subnet` y `Development subnet`.
2. **Cada subred arbitrada por un firewall**, probablemente un [[firewalls|packet filter]] — la propia filmina usa "probablemente", así que no es una prescripción cerrada, es la opción que basta para el caso.
3. **Impide el acceso a subredes de acuerdo a las políticas.** El ejemplo concreto que da la filmina: *"no se permite tráfico desde la red de desarrollo hacia la red corporativa"*.

## Por qué el ejemplo elige justo desarrollo → corporativa

La dirección del ejemplo no es arbitraria. El entorno de desarrollo tiene, típicamente, un perfil de riesgo distinto al resto de la red interna:

- Corre código en construcción, con configuraciones menos endurecidas que producción —credenciales de prueba, debug habilitado, dependencias sin actualizar—.
- Es, con frecuencia, donde los desarrolladores prueban exactamente el tipo de cosas que un atacante también probaría: entradas fuera de rango, payloads inesperados, herramientas de red no estándar.

Si la red de desarrollo estuviera en el mismo segmento que la red corporativa —datos de nómina, de recursos humanos, de finanzas—, comprometer una máquina de desarrollo (el eslabón más débil, por diseño) equivaldría a comprometer el segmento entero. La regla de la filmina corta esa cadena en el punto exacto donde el riesgo es mayor.

## Por qué es la misma idea que la DMZ, un nivel más adentro

*(Lectura nuestra: la filmina no lo dice en estos términos, pero se sigue directo del resto del caso de estudio.)* La [[zona-desmilitarizada|DMZ]] separa lo que Internet puede alcanzar de lo que no puede. Pero comprometer el firewall interno y llegar a "la red interna" no debería ser, de por sí, comprometer **todo** lo interno —del mismo modo que comprometer el firewall externo no debería exponer directamente los servicios internos—. La segmentación aplica el mismo argumento de `defensa en profundidad` un nivel más adentro: cada subred es una capa más que un atacante tiene que atravesar, y cada capa que hay que atravesar es una oportunidad más de detectar el ataque antes de que llegue al dato sensible.

Es también una instancia de `Menor privilegio` aplicada a nivel de red en vez de a nivel de usuario o proceso: un servidor o una máquina de la red de desarrollo no **necesita** alcanzar la red corporativa para hacer su trabajo, así que no se le da esa posibilidad —el mismo argumento con el que, más adelante en el caso de estudio, se le niega a un servidor de la DMZ acceso a recursos internos que no necesita.

## Ver también

- [[clase-10-seguridad-en-la-empresa#8. Caso de estudio: segmentación de la red interna (filmina 28)|Clase 10 — Seguridad en la empresa: sección 8]]
- [[seguridad-a-nivel-de-red|Seguridad a nivel de red]] — el diagrama de la filmina 4, con las tres subredes internas
- [[firewalls|Firewalls]] — el packet filter que arbitra cada subred
- [[zona-desmilitarizada|Zona desmilitarizada]] — la misma lógica de aislamiento, aplicada afuera-adentro en vez de adentro-adentro
- [[servicios-de-soporte-dns-log-y-proxy|Servicios de soporte: DNS, log y proxy]]
- [[analisis-de-puntos-de-entrada|Análisis de puntos de entrada]]
- [[variaciones-de-la-arquitectura|Variaciones de la arquitectura]]
- [[videografia|Videografía]] — ningún video de la cátedra cubre esta clase, confirmado ahí
