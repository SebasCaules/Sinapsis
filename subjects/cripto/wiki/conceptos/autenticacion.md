---
title: Autenticación
resumen: 'Asociar una identidad del mundo exterior a un principal interno del sistema; el modelo de cinco componentes, A, C, F, L y S, es el molde con el que la clase describe cada esquema concreto.'
fuentes: ["[[clase-07-autenticacion]]", "[[clase-06-politicas-de-seguridad-y-control-de-acceso]]"]
aliases: [Autenticación, Confirmación de identidad, Identidad y principal, Formalismo A C F L S, Funciones de complementación, Funciones de selección]
type: concepto
unidad: 2
clase: 7
orden: 1
created: 2026-09-04
updated: 2026-09-04
tags: [autenticacion, identidad, principal, modelo-formal, clase-07, sin-dictar]
sources: ["Clase 07 - Aplicaciones - Principios y autenticacion.pdf"]
---

# Autenticación

**Qué significa exactamente "autenticar" y qué cinco componentes hacen falta para describir cualquier esquema concreto —claves en texto plano, `/etc/passwd`, un token, una huella— como una instancia del mismo modelo.**

*Filminas 16 a 18 del deck de Aplicaciones. Esta clase todavía no se dictó (hoy es 04/09/2026): la nota está escrita contra el PDF de filminas y lecturas propias, rotuladas como tales — no hay transcripción ni callouts `De la transcripción`.*

## Identidad contra principal

**Autenticar es asociar una identidad a un principal.** La filmina 16 separa los dos lados con un diagrama de embudo: del lado del "Entorno" entra una **entidad externa** —una persona, un proceso, otro sistema—, atraviesa un módulo de identidad y un autenticador, y del lado del "Sistema" sale convertida en uno de los **principales** que el sistema ya tiene dados de alta (la filmina dibuja `Usuario1`, `Usuario2`, `Sistema1`).

La distinción importa porque son objetos de naturaleza distinta:

- La **identidad** vive **fuera** del sistema y el sistema no la controla — no puede impedir que dos personas distintas se llamen igual, ni verificar por sí solo que una entidad sea quien dice ser.
- El **principal** es una representación **interna**, creada y administrada por el propio sistema, sobre la que sí operan sus reglas de control de acceso.

*(Lectura nuestra.)* Es la misma distinción que hace el modelo de [[clase-06-politicas-de-seguridad-y-control-de-acceso|control de acceso]] de la clase anterior entre sujeto externo y entrada de una lista de control: el principal es lo que aparece después en cualquier matriz o `ACL`. La autenticación es el paso que **produce** ese principal; el control de acceso es lo que se hace **con** él una vez producido.

## Confirmar una identidad: pasos y consecuencias

La filmina 17 da tres pasos, siempre en el mismo orden, y dos consecuencias que se derivan de ellos:

$$\text{Obtener información de identidad} \;\to\; \text{Analizarla} \;\to\; \text{Determinar si corresponde a la entidad}$$

- Hay que **almacenar** información de cada entidad de antemano, para poder comparar contra ella.
- Hay que contar con **mecanismos para procesar** esa información — no alcanza con guardarla, hay que poder decidir con ella.

Estas dos consecuencias no son un comentario de paso: son la semilla de toda la clase. El almacenamiento es exactamente el tema de [[almacenamiento-de-claves|Almacenamiento de claves]], y el procesamiento —cómo se deriva y cómo se compara— es lo que las dos funciones $F$ y $L$ del modelo formalizan a continuación.

## El modelo formal: cinco componentes

La filmina 18 da la letra con la que la clase va a leer cualquier esquema concreto de ahí en adelante:

$$\begin{aligned}
A &= \{a\} &&\text{información de autenticación} \\
C &= \{c\} &&\text{información complementaria} \\
F &= \{\,F : A \to C\,\} &&\text{funciones de complementación} \\
L &= \{\,L : A \times C \to \{0,1\}\,\} &&\text{funciones de autenticación} \\
S &= \{s\} &&\text{funciones de selección}
\end{aligned}$$

Leído por roles:

| Símbolo | Quién lo aporta | Qué es |
|---|---|---|
| $A$ | la **entidad externa**, en el momento de autenticarse | designación de quién dice ser, más el dato que aporta como prueba (una clave, una huella, un certificado) |
| $C$ | el **sistema**, guardado de antemano | especificación del principal más cualquier información complementaria almacenada |
| $F$ | el sistema, aplicada típicamente **al dar de alta** la entidad | deriva $C$ a partir de $A$ — por ejemplo, aplicar una función de hash a la clave elegida |
| $L$ | el sistema, aplicada **en cada intento** de autenticación | decide: dado un par $(a,c)$, dice si es una asociación válida |
| $S$ | el sistema, aplicada en **alta, baja y cambio** | crea y actualiza $A$ y $C$ — el `adduser`, el `removeuser`, el `passwd` de cualquier sistema real |

**Por qué $F$ y $L$ están separadas.** No son la misma operación mirada dos veces: $F$ corre **una sola vez**, cuando se registra la información complementaria, y $L$ corre **en cada verificación**, sobre el $a$ que trae la entidad en ese momento. En el caso más simple —texto plano— las dos colapsan hasta volverse casi triviales (ver [[almacenamiento-de-claves#Un sistema de autenticación con claves en texto plano|Almacenamiento de claves § Un sistema de autenticación con claves en texto plano]]), pero en general no tienen por qué parecerse: $F$ puede ser una función de hash lenta y $L$ una simple comparación de igualdad sobre su salida.

### Instanciando el modelo: un ejemplo fuera del deck

*(Ejemplo nuestro, para fijar cómo se completa la letra antes de ver los dos casos que trae el propio deck.)* Un sistema de webmail con usuario y contraseña, sin ningún tratamiento adicional de la clave:

$$A = \{(\mathit{usuario}, \mathit{clave})\}, \quad C = \{(\mathit{usuario}, h(\mathit{clave}))\}, \quad F(\mathit{usuario}, \mathit{clave}) = (\mathit{usuario}, h(\mathit{clave}))$$

$$L\bigl((\mathit{usuario}, \mathit{clave}), (\mathit{usuario}', h)\bigr) = 1 \iff \mathit{usuario} = \mathit{usuario}' \ \wedge\ h(\mathit{clave}) = h, \qquad S = \{\texttt{signup}, \texttt{delete\_account}, \texttt{change\_password}\}$$

con $h$ una [[funciones-de-hash-criptograficas|función de hash criptográfica]]. Completar las cinco letras de esta manera es, según la sección "Para el parcial" de la [[clase-07-autenticacion#Para el parcial|nota de clase]], el tipo de ejercicio más probable sobre este tema — el propio deck ya lo hace dos veces, con las claves en texto plano (filmina 24) y con el esquema Unix tradicional (filmina 28).

## Ver también

- [[clase-07-autenticacion#1. Autenticación|Clase 07 — Autenticación § 1. Autenticación]] — la sección de la que cuelga esta nota
- [[factores-de-autenticacion|Factores de autenticación]] — de dónde puede salir el $a \in A$ que la entidad aporta
- [[almacenamiento-de-claves|Almacenamiento de claves]] — dos instancias completas del modelo $(A,C,F,L,S)$: texto plano y Unix tradicional
- [[ataques-a-un-sistema-de-autenticacion|Ataques a un sistema de autenticación]] — el mecanismo de ataque escrito con las mismas cinco letras
- [[complejidad-y-espacio-de-claves|Complejidad y espacio de claves]] — cuánto cuesta atacar el par $(a,c)$ de este modelo
- [[funciones-de-hash-criptograficas|Funciones de hash criptográficas]] — la instanciación típica de $F$ cuando la clave no se guarda en claro
- [[clase-06-politicas-de-seguridad-y-control-de-acceso|Clase 06 — Políticas de seguridad y control de acceso]] — qué se hace con el principal una vez que esta etapa lo produjo
