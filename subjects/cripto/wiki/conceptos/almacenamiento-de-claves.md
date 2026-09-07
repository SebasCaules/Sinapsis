---
title: Almacenamiento de claves
resumen: 'Tipos de clave y las dos formas de guardarlas, en claro o en archivo cifrado, con su costo respectivo; el esquema Unix tradicional de /etc/passwd es la instancia completa que el resto de la clase da por conocida.'
fuentes: ["[[clase-07-autenticacion]]", "[[autenticacion]]", "[[video-06-principios-de-diseno-2026]]"]
aliases: [Almacenamiento de claves, Sistema unix tradicional, Esquema Unix tradicional, Passphrase, Claves de uso único, Dispositivo criptográfico especializado]
type: concepto
unidad: 2
clase: 7
orden: 3
created: 2026-09-04
updated: 2026-09-04
tags: [autenticacion, almacenamiento-de-claves, unix, crypt, hash, clase-07, sin-dictar]
sources: ["Clase 07 - Aplicaciones - Principios y autenticacion.pdf", "wiki/videos/video-06-principios-de-diseno-2026.md"]
---

# Almacenamiento de claves

**Qué tipos de clave existen, con qué dos alternativas se guardan y qué costo tiene cada una, y cómo el esquema clásico de `/etc/passwd` instancia todo eso en un caso concreto que el resto de la clase da por conocido.**

*Filminas 24 a 28 del deck de Aplicaciones. Esta clase todavía no se dictó (hoy es 04/09/2026): la nota está escrita contra el PDF de filminas, más el [[video-06-principios-de-diseno-2026|Video 06 — Principios de diseño (2026)]] —que sí desarrolla los dispositivos criptográficos físicos que la filmina sólo nombra— y lecturas propias, todas rotuladas.*

## Un sistema de autenticación con claves en texto plano

La filmina 24 instancia el [[autenticacion#El modelo formal: cinco componentes|modelo (A, C, F, L, S)]] en el caso más simple posible — la clave se guarda tal cual el usuario la escribió:

$$A = \{\,x \mid x \text{ es clave}\,\}, \quad C = A, \quad F = \{\mathrm{id}\}, \quad L = \{\text{igual}\}, \quad S = \{\texttt{adduser()}, \texttt{removeuser()}, \texttt{passwd()}\}$$

$C=A$ y $F=\{\mathrm{id}\}$ son la misma afirmación mirada dos veces: no hay **ninguna** transformación entre lo que la entidad ingresa y lo que el sistema guarda, así que $L$ se reduce a comparar dos cadenas. Es el caso degenerado sobre el que las dos secciones siguientes —tipos de clave y forma de almacenamiento— van agregando complejidad, y es también el escenario más frágil posible frente a los [[ataques-a-un-sistema-de-autenticacion|ataques offline]] que vienen después: quien lea $c$ ya tiene $a$, sin ningún paso intermedio que atacar.

## Tipos de claves

La filmina 25 distingue tres familias, ya sin instanciar el modelo — la clasificación es sobre $a$, no sobre cómo se guarda:

- **Secuencias de caracteres** — con restricciones (por ejemplo, 8 caracteres, 10 dígitos), generadas al azar, por la propia entidad o de forma asistida.
- **Secuencias de palabras** — las *pass-phrases*, frases clave en vez de una única palabra.
- **Algorítmicas** — no son un secreto fijo que se compara por igualdad: incluyen el esquema de pregunta-respuesta (*challenge-response*, más adelante en la clase) y las **claves de un solo uso** (OTP, *one time passwords*), donde $a$ cambia en cada intento y por lo tanto $L$ no puede ser una simple comparación contra un $c$ estático.

## Cómo se almacenan

Antes de llegar al ejemplo de Unix, la filmina da dos alternativas generales y las dos con un costo explícito que la propia filmina nombra:

### Texto en claro

La filmina 26 es la más corta de las dos, y el motivo es que no hace falta mucho más: guardar las claves en un archivo o una base de datos **potencialmente accedido por fuera del sistema** — es decir, sin que la única vía de lectura sea pasar por $L$. La conclusión de la filmina es categórica: **no puede garantizarse confidencialidad** de las claves guardadas así.

### Archivo cifrado

La filmina 27 agrega una capa: cifrar el archivo con las contraseñas requiere a su vez una clave para descifrarlo, y esa clave de acceso puede vivir en cuatro lugares distintos:

- en un archivo de configuración,
- en el propio ejecutable del sistema,
- pedida al usuario en cada arranque,
- o guardada en un **dispositivo criptográfico especializado**.

**La filmina es explícita sobre cuándo esta alternativa tiene sentido: sólo si hace falta recuperar la clave original** — por ejemplo, para reenviarla a un tercer sistema que la necesite en claro. Para cualquier otro caso, la propia filmina remite hacia adelante a *"la forma correcta de (no) almacenar contraseñas"*: PBKDF2 (más adelante en la clase), que no guarda nada reversible.

**El "dispositivo criptográfico especializado" que la filmina menciona sin desarrollar** es exactamente el contenido que trae el [[video-06-principios-de-diseno-2026#La digresión de los HSMs|Video 06]], sobre la digresión de los `HSM` al explicar el principio de *fail-safe defaults*: tokens, *cryptochips* y **`HSM`** (*Hardware Security Modules*) que usan los bancos permiten **flashear la clave privada adentro del dispositivo y después quedar sin acceso externo a ella** — el sistema que necesita cifrar o descifrar no obtiene la clave, le pide al módulo que ejecute la operación. Eso es **antitampering**, y la norma de certificación que el video cita —niveles 1 a 4, sin poder confirmar con certeza si es `FIPS 140` por un problema del audio— fija en el nivel más alto que ante manipulación física (la imagen que da el video es una bomba explotando al lado del módulo) **o el dispositivo se destruye por completo, o la clave sigue sin poder leerse**. Es la instancia real de "dispositivo criptográfico especializado" que la filmina 27 sólo nombra.

## El ejemplo Unix tradicional

La filmina 28 formaliza el esquema clásico de `/etc/passwd`, completando otra vez las cinco letras del modelo:

$$A = \{\text{secuencias de hasta 8 caracteres}\}, \qquad C = \{\,\underbrace{xx}_{2}\,\underbrace{H\!\cdots\!H}_{11}\,\}$$

- $xx$ identifica **cuál de 4096 funciones** se usó — 2 caracteres.
- $H\cdots H$ es el resultado de esa función — 11 caracteres.
- $F = \{\text{4096 versiones modificadas de DES}\}$.
- $L = \{\texttt{login}, \texttt{su}, \texttt{sudo}, \ldots\}$.
- $S = \{\texttt{passwd}, \texttt{adduser}, \ldots\}$.

> **Precisión nuestra: "hash" en sentido coloquial, no técnico.** La filmina llama a esto *"4096 funciones de hash"*, pero lo que describe es el `crypt(3)` clásico de Unix — una **primitiva de cifrado en bloque** (DES) modificada y aplicada de forma iterada, usando la clave del usuario como clave de cifrado sobre un bloque fijo de ceros durante 25 rondas, con la tabla de expansión de DES perturbada por los dos caracteres de $xx$. Eso **no** es una [[funciones-de-hash-criptograficas|función de hash criptográfica]] en el sentido técnico que el vault fija en esa nota — no está pensada para admitir entradas de longitud arbitraria ni se diseñó bajo los mismos objetivos de resistencia—, aunque la industria lo llame así de forma coloquial desde hace décadas.

**Las $xx$ son la sal del esquema.** Con 4096 valores posibles ($2^{12}$), impiden que dos usuarios con la misma clave terminen con el mismo $C$ — es exactamente el objetivo que [[salting|Salting]] generaliza más adelante en la clase, y acá aparece ya construido, sin nombrarse todavía.

Esta es también la puerta de entrada a los [[ataques-a-un-sistema-de-autenticacion|ataques offline]] de la sección siguiente: robar el archivo con los $C$ —`/etc/shadow`— y probar candidatos fuera de línea es el [[ataque-de-diccionario-sobre-hashes|ataque de diccionario sobre hashes]] aplicado a este esquema concreto.
