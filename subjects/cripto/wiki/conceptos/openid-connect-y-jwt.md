---
title: OpenID Connect y JWT
resumen: 'Capa de autenticación construida sobre OAuth 2.0, que al access token le suma un id_token con formato JWT, un documento JSON firmado por el proveedor de identidad y codificado en Base64 URL-safe, que dice quién es el usuario.'
fuentes: ["[[clase-06-politicas-de-seguridad-y-control-de-acceso]]", "[[oauth-2]]"]
aliases: [OIDC, JWT, JSON Web Token, Bearer token, id_token, Claims de un JWT]
type: concepto
unidad: 2
clase: 6
orden: 16
created: 2026-09-04
updated: 2026-09-04
tags: [control-de-acceso, oauth, oidc, jwt, autenticacion, clase-06, sin-dictar]
sources: ["Clase 08 - Control de acceso.pdf"]
---

# OpenID Connect y JWT

**La capa que le agrega a OAuth lo único que OAuth por sí solo no resuelve: no sólo delegar acceso a un recurso, sino saber quién es la persona del otro lado.** Es la última sección de la clase, y la que cierra con un ejemplo decodificable letra por letra: el propio token de la filmina es un JWT real, del ejemplo canónico de la especificación.

*Filminas 41 y 42 del deck de Control de acceso (`Clase 08 - Control de acceso.pdf`). La clase todavía no se dictó —hoy es 04/09/2026, la clase es el 01/10/2026—; esta nota está escrita contra el PDF y lecturas propias, rotuladas como tales. No hay transcripción.*

## Qué le agrega a OAuth

*Filmina 41.* [[oauth-2|OAuth 2.0]] resuelve **autorización** — delegar acceso a un recurso sin entregar la contraseña —, pero no dice nada sobre **quién** es el usuario que autorizó el acceso. **OpenID Connect (OIDC)** se construye encima de OAuth y agrega justamente eso: **autenticación**.

Lo hace apoyándose en un tipo especial de token, el **bearer token**, que se obtiene **junto** con el access token bajo el nombre `id_token`, codificado en **Base64 URL-safe** (el alfabeto de Base64 que reemplaza `+`/`/` por `-`/`_` para poder viajar dentro de una URL o un header sin escapar caracteres) *(la explicación del alfabeto URL-safe es lectura nuestra; la filmina 41 sólo anota "Base 64 - URLSAFE")*.

## El bearer token es un JWT

*Filmina 42.* El `id_token` **es** un **JWT** (*JSON Web Token*): un documento JSON **firmado digitalmente** por el proveedor de identidad. Un JWT tiene siempre tres partes separadas por puntos —`header.payload.signature`—, cada una codificada en Base64 URL-safe.

### El token de la propia filmina, decodificado

La filmina 41 no da un ejemplo abstracto: pega el `id_token` **real** del ejemplo canónico de la especificación OpenID Connect Core. Decodificando sus tres partes *(verificación nuestra, no está hecha en el deck)*:

**Header** (primera parte, antes del primer punto):
```json
{"alg":"RS256","kid":"1e9gdk7"}
```

**Payload** (segunda parte):
```json
{
  "iss": "http://server.example.com",
  "sub": "248289761001",
  "aud": "s6BhdRkqt3",
  "nonce": "n-0S6_WzA2Mj",
  "exp": 1311281970,
  "iat": 1311280970
}
```

**Signature** (tercera parte): 256 bytes al decodificar — exactamente el tamaño de una firma **RSA de 2048 bits** ($2048 / 8 = 256$), consistente con el algoritmo `RS256` (*RSA con SHA-256*) declarado en el header.

$$\mathsf{exp} - \mathsf{iat} = 1311281970 - 1311280970 = 1000 \text{ segundos} = 16\text{ min }40\text{ s}$$

—la ventana de validez de **ese** token concreto es de poco más de un cuarto de hora, coherente con la práctica habitual de mantener los `id_token` de vida corta. *(Todo el cálculo de esta subsección es verificación nuestra sobre el string exacto de la filmina; el deck sólo lo pega, no lo decodifica ni comenta sus campos.)*

### Los ocho claims

La filmina 42 usa un ejemplo distinto —con `sub: "alice"`— para anotar el significado de cada campo:

| Claim | Significado |
|---|---|
| `sub` | *Subject* — a quién identifica el token |
| `iss` | *Issuer* — quién lo emitió |
| `aud` | *Audience* — para quién es (el destinatario esperado) |
| `nonce` | Valor de un solo uso, para evitar *replay* del token *(lectura nuestra; la filmina sólo anota "Nonce")* |
| `auth_time` | Cuándo fue autenticado el sujeto |
| `acr` | Cómo fue autenticado (opcional) |
| `iat` | *Issued At* — cuándo se emitió el token |
| `exp` | *Expiration* — cuándo deja de ser válido |

Los ocho claims se agrupan en tres preguntas distintas, y conviene tenerlas separadas porque un JWT mal validado suele fallar en una sola de las tres sin que salte a la vista:

- **¿Quién y para quién?** — `sub`, `iss`, `aud`. *(Razonamiento nuestro, no desarrollado en el deck:)* verificar `aud` es lo que impide que un token emitido para una aplicación se reuse válidamente contra otra: si el cliente A recibe un token con `aud` apuntando al cliente B y no valida ese campo, podría aceptar como propio un token que nunca fue pensado para él.
- **¿Cuándo?** — `iat`, `exp`, y opcionalmente `auth_time`. Acotan la ventana de validez temporal del token, igual que el ejemplo decodificado arriba.
- **¿Cómo se garantiza que no es replay ni fue alterado?** — `nonce` (contra reenvío del mismo token) y la **firma** del JWT completo (contra alteración de cualquiera de los campos anteriores: cambiar un solo carácter del payload invalida la firma sobre `header.payload`).

Entre los cuatro primeros —`iat`/`exp`/`aud`/`iss`— el JWT replica, en un documento **autocontenido y verificable con una firma**, buena parte de lo que en OAuth puro dependía de mantener una sesión abierta con el servidor de autorización: el cliente no necesita volver a preguntarle al proveedor "¿este usuario sigue autenticado?" — le alcanza con verificar la firma y los claims de tiempo del token que ya tiene.

## Por qué esto no es lo mismo que control de acceso

*(Cruce con video, no del deck.)* El [[video-12-proteccion-de-datos-personales|Video 12]] reporta una advertencia explícita, de otra clase del mismo canal: *"ojo en el parcial con autenticación versus control de acceso"*. Esta sección es la ilustración perfecta de esa distinción: **OIDC/JWT resuelve autenticación** —saber que `sub: "alice"` es efectivamente Alice, y desde cuándo—, mientras que el resto de la Clase 06 —[[matriz-de-control-de-acceso|matriz]], [[listas-de-control-de-acceso|ACLs]], [[listas-de-capacidades|capacidades]]— resuelve **qué puede hacer** esa Alice ya autenticada. Son preguntas distintas que un sistema real necesita resolver las dos, en ese orden: primero autenticar, después autorizar. El modelo formal completo de qué significa "autenticar" —los cinco componentes que hacen falta para describir cualquier esquema concreto— es contenido de la [[clase-07-autenticacion|Clase 07]], no de ésta.

## Ver también

- [[clase-06-politicas-de-seguridad-y-control-de-acceso#16. OpenID Connect y JWT|Clase 06 — OpenID Connect y JWT]]
- [[oauth-2|OAuth 2.0]] — la sección inmediatamente anterior, y el protocolo sobre el que se construye OIDC
- [[autenticacion|Autenticación]] — el modelo formal de qué significa autenticar, desarrollado en la Clase 07
- [[video-12-proteccion-de-datos-personales|Video 12 — Protección de datos personales]] — la advertencia sobre autenticación versus control de acceso, y el ejemplo de policy de AWS IAM que ilustra la terna sujeto/objeto/derecho del lado del control de acceso
- OpenID Connect Core 1.0 §2 (*ID Token*) — la especificación de la que sale, verbatim, el `id_token` de ejemplo de la filmina 41
- RFC 7519 (*JSON Web Token*) y RFC 7518 (*JSON Web Algorithms*, para `RS256`)
