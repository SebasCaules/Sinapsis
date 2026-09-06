---
title: OAuth 2.0
resumen: 'Estándar de facto para que una aplicación acceda a un recurso ajeno sin recibir nunca la contraseña de su dueño, con cuatro roles, un baile de ocho pasos que entrega el access token y cuatro grant types según el tipo de cliente.'
fuentes: ["[[clase-06-politicas-de-seguridad-y-control-de-acceso]]", "[[principio-de-kerckhoffs]]"]
aliases: [OAuth 2.0, OAuth Dance, Authorization Code Grant, Client secret y client id, Grant types de OAuth, Delegación de acceso]
type: concepto
unidad: 2
clase: 6
orden: 15
created: 2026-09-04
updated: 2026-09-04
tags: [control-de-acceso, oauth, autorizacion, delegacion, clase-06, sin-dictar]
sources: ["Clase 08 - Control de acceso.pdf"]
---

# OAuth 2.0

**El estándar de facto para que una aplicación acceda a un recurso ajeno sin que el dueño del recurso le entregue nunca su contraseña — y el mapa exacto de qué dato viaja por dónde, para que ese acceso delegado no se pueda robar interceptando la conexión equivocada.** Es la sección más larga de las ocho, y la única de esta clase que se aleja de los modelos formales de control de acceso para entrar en un protocolo web real, con mensajes concretos.

*Filminas 31 a 40 del deck de Control de acceso (`Clase 08 - Control de acceso.pdf`). La clase todavía no se dictó —hoy es 04/09/2026, la clase es el 01/10/2026—; esta nota está escrita contra el PDF y lecturas propias, rotuladas como tales. No hay transcripción.*

## Qué problema resuelve, y quiénes participan

*Filmina 32.* OAuth permite al **dueño de un recurso** (*Resource Owner*) delegar en una **aplicación cliente** (*Client Application*) el acceso a ese recurso, **sin entregarle sus credenciales**. Es la respuesta al patrón, hoy obsoleto y peligroso, de "dame tu usuario y contraseña de Gmail para que tu app de terceros pueda leer tu correo" — con OAuth, la aplicación nunca ve la contraseña, sólo un **token** con un alcance acotado.

Cuatro roles, cada uno con un rol distinto:

| Rol | Qué es |
|---|---|
| **Resource Owner** | el usuario dueño del recurso |
| **Client Application** | la aplicación que quiere acceder al recurso en nombre del usuario |
| **Resource Server** | donde vive el dato real |
| **Authorization Server** | quien autentica al usuario y emite los tokens |

La aplicación cliente habla con **los dos servidores**, nunca directamente con la contraseña del dueño del recurso — esa separación de cuatro roles es la que hace posible todo lo que sigue.

## Historia, en tres fechas

*Filmina 31.* *Open Standard for Authorization*. Nace en **2006** por una necesidad concreta de **Twitter**. `OAuth 1.0` se publica en **2010** (RFC 5849), con una estructura similar a la de OpenID. `OAuth 2.0` se publica en **octubre de 2012**: mucho más simple que la versión anterior, **no es compatible** con ella —es un protocolo distinto, no una revisión— y hoy es el **estándar de facto** para sitios públicos.

## El baile completo (OAuth Dance)

*Filmina 33.* Ocho pasos, y el orden importa tanto como cada paso individual:

$$\begin{aligned}
&\text{1. El usuario hace \textbf{Access App} sobre la aplicación cliente.}\\
&\text{2. La aplicación ofrece \textbf{Login via Google, Facebook, Twitter, etc.}}\\
&\text{3. El usuario hace \textbf{Login to Client App via } \langle proveedor \rangle \text{ — se autentica \emph{contra el proveedor}, no contra la app.}}\\
&\text{4. El proveedor hace \textbf{Redirect to Client App}, con un \emph{authentication code} — la redirección va al navegador.}\\
&\text{5. El navegador hace \textbf{Access redirect URL} sobre la app, entregándole ese código.}\\
&\text{6. La app hace \textbf{Send authentication code, client id, client secret} — \emph{directo al proveedor}, servidor a servidor.}\\
&\text{7. El proveedor responde con \textbf{Return access token}.}\\
&\text{8. La app cierra el flujo devolviendo \textbf{User logged in}.}
\end{aligned}$$

**El punto de diseño que este orden protege.** El **código de autorización** (pasos 4-5) viaja por el navegador del usuario, expuesto en una URL de redirección — cualquiera que intercepte esa URL lo ve. Pero el intercambio final por el **access token** (pasos 6-7) es un canal **servidor a servidor** que además exige el `client secret`, y ese secreto **nunca** pasa por el navegador. Por eso interceptar la URL de redirección **no alcanza** para robar el token: hace falta también el secreto del cliente, que sólo conocen la aplicación y el servidor de autorización.

Los mensajes concretos de las filminas 37-40 (más abajo) lo confirman letra por letra: el código que aparece en la *Callback response* (paso 4-5) es exactamente el mismo string que reaparece en la *Token Request* (paso 6) — la prueba de que es un valor de un solo uso, pasado de mano en mano.

## Tipos de clientes

*Filmina 34.* La distinción determina si el flujo de arriba se puede usar con seguridad tal cual, o si hace falta una variante:

- **Confidencial** — típicamente una aplicación que corre en un **servidor**: puede mantener un `client secret` compartido con el servidor de autorización, porque nadie externo tiene acceso al binario o al código que lo guarda.
- **Público** — una aplicación de **escritorio, móvil o que corre en el navegador**: **no puede** mantener un secreto de forma confiable, porque el binario o el código fuente terminan, tarde o temprano, en manos del usuario final — el mismo argumento de [[principio-de-kerckhoffs|Kerckhoffs]] sobre por qué el algoritmo siempre termina expuesto, aplicado acá a un secreto de aplicación en vez de a un algoritmo de cifrado.

## Registro previo del cliente

*Filmina 35.* Todo cliente tiene que registrarse por adelantado ante el servidor de autorización, y ese registro fija tres datos:

- **Client ID** — identificador único de la aplicación.
- **Client Secret** — sólo para clientes confidenciales.
- **Redirect URI(s)** — la lista de direcciones válidas a las que el proveedor puede redirigir con el código. Es un control de seguridad, no un detalle administrativo: si el proveedor redirigiera a cualquier URL, un atacante podría registrar la suya propia y capturar el código de una víctima.

## Grant types: cuatro formas de conseguir el token

*Filmina 36.*

| Grant type | Mecanismo |
|---|---|
| **Authorization Code** | El servidor de autorización devuelve un código; el cliente lo cambia por el access token junto con su `client_id` y `client_secret` — es el flujo de ocho pasos de arriba |
| **Implicit** | El servidor de autorización devuelve el access token **directamente**, sin código intermedio — pensado para clientes públicos que no pueden guardar un secreto, al costo de exponer el token mismo en la URL |
| **Resource Owner Password Credentials** | En lugar de redirigir, el cliente captura y envía él mismo usuario y contraseña al servidor de autorización |
| **Client Credentials** | Autorización a nivel del propio cliente, vía su `client secret`, sin ningún usuario final involucrado |

El criterio para elegir entre ellos es exactamente la tabla de **tipos de cliente** de arriba: **Authorization Code** es la opción segura por defecto para un cliente confidencial; **Implicit** es la concesión que se hacía a un cliente público antes de que existiera el flujo con *PKCE* (una mejora posterior que ninguno de los dos decks de esta clase cubre); **Resource Owner Password Credentials** exige tanta confianza en el cliente —ve la contraseña real— que sólo tiene sentido si cliente y servidor de autorización son de la misma organización; **Client Credentials** es para comunicación máquina a máquina, sin un usuario detrás.

## Los mensajes reales, línea por línea

*Filminas 37-40.* Transcritos tal cual del deck:

**Login redirect** (URL hacia el servidor de autorización):
```
https://login.salesforce.com/services/oauth2/authorize
?response_type=code&client_id=8483756923465.as.org&redirect_uri=https%3A%2F%2Fwww.example.com%2Fback
```

**Callback response** (URL que recibe la aplicación cliente):
```
https://app.example.com/oauth_callback
?code=aWekysIEeqM9PiThEfm0Cnr6MoLIfwWyRJcqOqHdF8f9INokharAS09ia7UNP6RiVScerfhc4w%3D%3D
```

**Token Request** (POST al proveedor, `form-url-encoding`):
```
code=aWekysIEeqM9PiThEfm0Cnr6MoLIfwWyRJcqOqHdF8f9INokharAS09ia7UNP6RiVScerfhc4w==
&grant_type=authorization_code&client_id=ffdskhfeihoaw&client_secret=khfeaihdiu38nd&redirect_uri=...
```

**Response token** (cuerpo JSON):
```json
{
  "id": "https://login.salesforce.com/id/00D5000Z3ZEAW/00550001fg5OAQ",
  "issued_at": "1296458209517",
  "refresh_token": "5Aep862eWO5D.7wJBuW5aaARbbxQ83jMRnbFNT5R8X2GUKNA==",
  "instance_url": "",
  "signature": "0/1Ldval/TIPf2tTgTKUAxRy44VwEJ7ffsFLMWFcNoA=",
  "access_token": "00D50000000IZ3Z!AQ0AQDpEDKYsn7ioKug2aSmgCjgrPjG9eRLz"
}
```

**Verificación cruzada entre las láminas.** El campo `code` de la *Token Request* es, carácter por carácter, el mismo valor que llegó en la *Callback response* —ambos terminan en `...RiVScerfhc4w`, con la única diferencia de que la URL lo trae URL-encodeado (`%3D%3D` en vez de `==`, que es el mismo padding de Base64 escapado para viajar en una query string)—. Es la confirmación textual, dentro del propio material de la cátedra, de que el código de autorización pasa **intacto** del navegador (paso 5) al canal servidor-a-servidor (paso 6).

**Lo que trae el `response`, y lo que no.** Nótese que el JSON de respuesta no incluye ningún dato de identidad del usuario más allá de un `id` que es una URL interna de Salesforce — sólo `access_token` (para usar el recurso) y `refresh_token` (para renovar el acceso sin repetir el login). OAuth puro **no autentica** al usuario ante el cliente: sólo le entrega una credencial de acceso al recurso. Ese hueco —saber *quién* es el usuario, no sólo tener permiso para acceder a algo suyo— es exactamente lo que agrega [[openid-connect-y-jwt|OpenID Connect]].

## Ver también

- [[clase-06-politicas-de-seguridad-y-control-de-acceso#15. OAuth 2.0|Clase 06 — OAuth 2.0]]
- [[acls-propagables|ACLs propagables]] — la sección inmediatamente anterior
- [[openid-connect-y-jwt|OpenID Connect y JWT]] — la capa de autenticación que OAuth por sí solo no tiene
- [[principio-de-kerckhoffs|Principio de Kerckhoffs]] — el mismo argumento de "un cliente público no puede guardar un secreto" aplicado en la Clase 01 al algoritmo de cifrado
- [[autenticacion|Autenticación]] — la Clase 07 desarrolla el modelo formal de qué significa autenticar; OAuth por sí solo resuelve *autorización*, no esa pregunta
- [[video-12-proteccion-de-datos-personales|Video 12 — Protección de datos personales]] — trae la advertencia *"ojo en el parcial con autenticación versus control de acceso"*, exactamente la distinción que separa OAuth de OpenID Connect
- RFC 6749 (*The OAuth 2.0 Authorization Framework*) y RFC 5849 (*OAuth 1.0*) — Matt Bishop, *Computer Security: Art and Science*, cap. 15 (*Representing Identity*) ([[bibliografia|Bibliografía]])
