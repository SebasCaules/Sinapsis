---
title: Descomposición de la aplicación
resumen: 'Paso 3 del modelado de amenazas: identificar las zonas externas y privilegiadas donde cambia el nivel de confianza requerido y seguir el flujo de datos entre ellas, refinando por capas, páginas y componentes.'
fuentes: ["[[clase-08-principios-de-diseno-y-vulnerabilidades]]", "[[modelado-de-amenazas]]", "[[stride-y-arboles-de-ataque]]", "[[video-08-vulnerabilidades]]"]
aliases: [Web App Security Frame, Zonas de confianza, Zonas privilegiadas, Flujo de datos entre zonas, Refinar por niveles]
type: concepto
unidad: 2
clase: 8
orden: 5
created: 2026-09-04
updated: 2026-09-06
tags: [seguridad, modelado-de-amenazas, zonas-de-confianza, web-app-security-frame, clase-08, sin-dictar]
sources: ["Clase 12 - Analisis de vulnerabilidades.pdf"]
---

# Descomposición de la aplicación

**Cómo partir un sistema en pedazos que se puedan analizar por separado: encontrar dónde cambia cuánta confianza hace falta para cruzar de una zona a otra, y seguir el dato desde que entra hasta que sale.** Es el paso 3 del [[modelado-de-amenazas#El ciclo de cinco pasos de Microsoft|ciclo de modelado de amenazas de Microsoft]], y el que convierte un diagrama de despliegue en el mapa sobre el que después se aplica [[stride-y-arboles-de-ataque|STRIDE]].

Cubre las filminas **14 a 16** del deck `Clase 12 - Analisis de vulnerabilidades.pdf`. **Esta clase todavía no se dictó** (hoy es 04/09/2026, la clase es el 15/10): no hay transcripción propia, y lo que sigue está escrito contra el PDF más [[video-08-vulnerabilidades|video-08]].

## El Web App Security Frame

La filmina 14 da diez áreas que sirven como lista de verificación al modelar una aplicación web:

1. Validación de entradas y datos
2. Autenticación
3. Autorización
4. Administración de configuración
5. Datos sensitivos
6. Manejo de sesión
7. Criptografía
8. Manipulación de parámetros
9. Manejo de excepciones
10. Auditoría y logs

No es una lista de amenazas: es una lista de **superficies** — cada área es un lugar distinto donde puede vivir una vulnerabilidad, y sirve como checklist para no dejar afuera una superficie entera del análisis. La filmina 17, que desarrolla [[stride-y-arboles-de-ataque|STRIDE y árboles de ataque]], remite a esta misma lista —bajo el nombre técnico de *Microsoft patterns & practices*— como catálogo de amenazas, ataques y contramedidas recurrentes por cada uno de estos diez aspectos.

## Zonas donde cambia el nivel de confianza

La filmina 15 pide identificar **zonas donde cambia el nivel de confianza requerido**, y da dos tipos:

- **Zonas externas** — acceso al sistema de archivos del servidor, acceso a la base de datos, acceso a web services.
- **Zonas privilegiadas** — partes accesibles sólo para un rol particular.

Los ejemplos de la propia filmina son elocuentes: la frontera entre internet e intranet, entre el web server y el db server, y —el que más rinde como ejemplo de examen— el **reporte de sueldos** como zona reservada a managers. Según `video-08`, el docente extiende la idea a contratos con otras empresas y listas de precios: cualquier información cuya divulgación interna descontrolada sea un problema es, por definición, una zona privilegiada, aunque no tenga nada que ver con "seguridad" en el sentido técnico habitual — es un problema de negocio que el modelado de amenazas también tiene que capturar.

**Por qué "zona" y no "componente".** Una zona de confianza no coincide necesariamente con un componente de software: el mismo servidor de aplicación puede alojar código que corre con dos niveles de confianza distintos según qué endpoint atienda —uno público, otro sólo para administradores—. Lo que define una zona es el nivel de confianza que hace falta para operar ahí, no dónde vive físicamente el código. Esa distinción es la que después hace que [[stride-y-arboles-de-ataque|STRIDE]] se aplique **por cada frontera de confianza**, no una sola vez por servidor.

## Flujo de datos entre zonas

La filmina 16 pide identificar el **flujo de datos** entre esas zonas, siguiendo la información desde su ingreso hasta su salida y marcando los puntos relevantes. La estrategia que recomienda es **refinar por niveles**:

1. Primero, el flujo por **capas** — `browser` / `web` / `middle` / `db` / `filesystem`.
2. Luego, entre **páginas**.
3. Luego, entre **componentes**.

**Por qué el orden va de lo grueso a lo fino, y no al revés.** Empezar por el detalle de componentes sin tener antes el mapa de capas produce un análisis exhaustivo de partes que tal vez ni siquiera manejan datos sensibles, mientras una frontera de confianza real —por ejemplo, entre el `middle tier` y la base de datos— queda sin marcar porque nadie llegó a mirarla al nivel correcto. Refinar por niveles asegura que el primer pase, barato, ya cubre todo el sistema con la granularidad mínima necesaria; los pases siguientes sólo profundizan donde el nivel anterior encontró algo que merece más detalle.

## El ejemplo que conecta esta nota con la siguiente

El deck reutiliza, para la identificación de vulnerabilidades, un único ejemplo desarrollado: un sistema de historial médico que permite a médicos consultar y agregar entradas, y a pacientes acceder al propio historial, con una arquitectura **browser → firewall → web server (con su filesystem) → base de datos**. Esa arquitectura es exactamente el material sobre el que se aplica la descomposición de esta nota — dónde está la zona externa (el browser, del otro lado del firewall), dónde la zona privilegiada (probablemente el acceso de médicos frente al de pacientes, aunque el deck no lo detalla), y por dónde fluye el dato desde que un médico lo ingresa hasta que queda en la base.
