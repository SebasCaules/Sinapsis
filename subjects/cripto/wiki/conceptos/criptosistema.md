---
title: Criptosistema
resumen: 'Esquema de cifrado definido como la terna de algoritmos Gen, Enc y Dec junto con los espacios de claves, mensajes y textos cifrados, sujeto a la condición de corrección; es la unidad básica de toda la materia.'
fuentes: ["[[clase-01-introduccion-y-criptografia-clasica]]", "[[practica-01-esquemas-y-taxonomias]]", "[[guia-01-criptografia-clasica]]"]
aliases: [Criptosistema, Esquema de cifrado, Gen/Enc/Dec]
type: concepto
unidad: 1
clase: 1
orden: 1
created: 2026-08-10
updated: 2026-08-24
tags: [criptografia, definiciones, gen-enc-dec, correccion, clase-01]
sources: [Clase 01, Guía 1 Ej. 1]
---

# Criptosistema

> La unidad básica de toda la materia. Todo esquema clásico ([[cifrado-por-rotacion|rotación]], [[cifrado-de-sustitucion-monoalfabetica|sustitución]], [[cifrado-de-vigenere|Vigenère]]) es una instancia de esta definición, y toda noción de seguridad ([[secreto-perfecto|secreto perfecto]]) se enuncia sobre ella.

**Criptografía** — del griego *escritura secreta*. Conjunto de funciones matemáticas y técnicas que son las herramientas básicas desde donde construir seguridad.

> Cuando la criptografía funciona bien, es invisible.

---

## Vista informal

![Criptosistema](../../assets/image.png)

Un criptosistema permite transformar un **mensaje o texto plano** en un **mensaje o texto cifrado** (operación de *cifrar* / *encriptar*) y volver atrás (*descifrar* / *desencriptar*).

| | Entrada | Salida |
|---|---|---|
| **Cifrado** | mensaje plano × clave | mensaje cifrado |
| **Descifrado** | mensaje cifrado × clave | mensaje plano |

El texto cifrado **no tiene información útil** por sí mismo: puede ser almacenado o transferido libremente. La clave es lo que permite **controlar quién puede recuperar el mensaje**.

### Notaciones equivalentes

Todas estas escrituras significan lo mismo — conviene reconocerlas porque la bibliografía las mezcla:

$$\begin{aligned}
\text{cifrado} &: e_k(p) = \mathsf{enc}_k(p) = e(k, p) = \{p\}_k = c\\
\text{descifrado} &: d_k(c) = \mathsf{dec}_k(c) = d(k, c) = \{c\}^{-1}_k = p
\end{aligned}$$

Katz & Lindell usan $\mathsf{Enc}_k(m) = c$ y $\mathsf{Dec}_k(c) = m$; las filminas de la cátedra usan $e$/$d$ con $p$ de *plaintext*. Es la misma cosa.

Para el **esquema completo** (no una operación suelta), la [[practica-01-esquemas-y-taxonomias|práctica 01]] lo escribe $\Pi(\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})_{\text{priv}}$, con el subíndice marcando que es de **clave privada**. Es la notación que conviene usar en el práctico; equivale al $\Pi = (\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$ de la definición formal de abajo.

### Clave

> La **clave** es un bloque arbitrario de información.

Al probar la seguridad de un sistema **se presupone que la clave está protegida**. Esa suposición es lo que hace que el análisis tenga sentido — ver [[principio-de-kerckhoffs|Principio de Kerckhoffs]].

---

## Definición formal

Un **esquema de cifrado de clave privada** es una terna de algoritmos $\Pi = (\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$ junto con tres conjuntos: el espacio de claves $K$, el espacio de mensajes $M$ y el espacio de textos cifrados $C$.

> Los tres conjuntos alcanzan para **definir** el esquema, pero no para hablar de **seguridad**: para eso hay que poner **distribuciones de probabilidad** encima de ellos ($\Pr[M = x]$, $\Pr[K = k]$) — ver [[modelo-probabilistico-de-un-criptosistema|modelo probabilístico de un criptosistema]].

> **Cómo se escriben.** La convención del vault es **mayúscula caligráfica para el conjunto, minúscula itálica para el elemento**: $\mathcal{K}$, $\mathcal{M}$, $\mathcal{C}$ contra $k$, $m$, $c$ (esta nota los abrevia $K$, $M$, $C$ cuando no hay ambigüedad). Si te cruzás con un $p$ en lugar de $m$, o con el par $x$/$y$, son estas mismas cosas escritas por otra fuente: el inventario completo, símbolo por símbolo y con el link a dónde se usa cada uno, está en [[notacion-y-terminologia#1. Los tres espacios y sus elementos|notación y terminología § Los tres espacios]].

| Algoritmo | Tipo | Firma | Notación |
|---|---|---|---|
| `Gen` | **probabilístico**, sin entrada | $() \to K$ | $k \leftarrow \mathsf{Gen}()$ |
| `Enc` | determinístico (en los clásicos) | $K \times M \to C$ | $c \leftarrow \mathsf{Enc}_k(m)$ |
| `Dec` | determinístico | $K \times C \to M$ | $m := \mathsf{Dec}_k(c)$ |

### Condición de corrección

Es la propiedad básica que exige la definición — sin ella no hay criptosistema, hay ruido:

$$\forall k \in \mathcal{K},\ \forall m \in \mathcal{M}: \quad \mathsf{Dec}_k(\mathsf{Enc}_k(m)) = m$$

O en la notación de la cátedra: $d_k(e_k(m)) = m$.

### Puntos que se piden en el parcial

- `Gen` es el **único algoritmo probabilístico**; `Enc` y `Dec` son determinísticos en todos los esquemas clásicos.
- Especificar un esquema **no es** dar la fórmula de cifrado: hay que dar los **tres conjuntos** ($K$, $M$, $C$) **y los tres algoritmos**. Es el error típico del Ej. 1 de la [[guia-01-criptografia-clasica|Guía 1]].
- Decir *cómo* se elige la clave en `Gen` (típicamente **uniforme** sobre $K$) es parte de la definición, no un detalle.
- Los cifrados clásicos **preservan la longitud**: $\lvert \mathsf{Enc}_k(m)\rvert = \lvert m\rvert$.

---

## Seguridad (informal)

![Seguridad informal](../../assets/Pasted%20image%2020260806164009.png)

> Un criptosistema es **seguro** si ningún adversario puede computar **cualquier función** del texto plano a partir del mensaje cifrado que posee.

El cuantificador "cualquier función" es fuerte a propósito. Significa que:

- no se puede recuperar el mensaje;
- no se puede recuperar **parte** del mensaje;
- no se puede recuperar **sentido** del mensaje (ni un bit de información sobre él).

Las técnicas para probar o romper la seguridad de un criptosistema se denominan **criptoanálisis**. La versión formal de esta idea es el [[secreto-perfecto|secreto perfecto]].

---

## Ver también

- [[principio-de-kerckhoffs|Principio de Kerckhoffs]] — qué se asume público y qué secreto
- [[secreto-perfecto|Secreto perfecto]] — la definición rigurosa de "seguro"
- [[modelos-de-ataque|Modelos de ataque]] — qué puede hacer el adversario
- [[notacion-y-terminologia|Notación y terminología]] — el glosario del vault: los tres espacios, la terna $(\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$ y las dos flechas de asignación
- [[clase-01-introduccion-y-criptografia-clasica|Clase 01]]
