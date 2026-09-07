---
title: Modelo probabilístico de un criptosistema
resumen: 'Capa de distribuciones sobre los espacios de mensajes y claves que la terna Gen, Enc, Dec no provee; de ella se derivan la marginal del cifrado, la condicional y la a posteriori de Bayes con las que se enuncia el secreto perfecto.'
fuentes: ["[[probabilidad-y-criptografia]]", "[[clase-01-introduccion-y-criptografia-clasica]]"]
aliases: [Espacios M K C, Distribuciones sobre M y K]
type: concepto
unidad: 1
clase: 1
orden: 10
created: 2026-08-11
updated: 2026-09-04
tags: [criptografia, probabilidad, secreto-perfecto, bayes, apunte, clase-01]
sources: ["probabilidad y criptografia.pdf", "Clase 01"]
---

# Modelo probabilístico de un criptosistema

> El andamiaje que hay que montar **antes** de poder enunciar [[secreto-perfecto|secreto perfecto]]. Esta nota trae de dónde salen $P[C=y]$, $P[C=y \mid M=x]$ y $P[M=x \mid C=y]$, y por qué la definición de seguridad se chequea con la segunda y no con la tercera.

---

## Qué agrega sobre la definición de criptosistema

La terna $(\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$ de [[criptosistema]] es **combinatoria**: dice qué funciones hay y sobre qué conjuntos $K$, $M$, $C$, pero no dice nada sobre **qué tan probable** es cada elemento. Con eso alcanza para hablar de corrección ($\mathsf{Dec}_k(\mathsf{Enc}_k(m)) = m$) y no alcanza para hablar de seguridad.

Para hablar de seguridad hacen falta **distribuciones**. La idea central:

> $M$ y $K$ son **variables aleatorias**; $C$ es la variable aleatoria **derivada** $C = \mathsf{Enc}_K(M)$.

No se elige una distribución para $C$: queda **inducida** por las otras dos y por el algoritmo `Enc`. Todo el cálculo de esta nota consiste en escribir esa distribución inducida.

## Las dos distribuciones de entrada

| Variable | Notación | Quién la fija |
|---|---|---|
| Mensaje | $P[M = x]$ | El **idioma y el contexto**: qué mensajes tiene sentido que Alice mande. No la controla el diseñador del esquema. |
| Clave | $P[K = k]$ | El algoritmo **`Gen`**: es parte de la especificación del criptosistema (típicamente uniforme sobre $K$). |

### Hipótesis de independencia

> *"Las claves se eligen independientemente de los mensajes planos"*, y por lo tanto
> $$P[M = x,\ K = k] = P[M = x]\cdot P[K = k]$$

Es razonable porque `Gen` **sortea la clave sin mirar el mensaje** — corre antes, o en otra máquina, y sólo depende de su propia aleatoriedad. Es la hipótesis que permite factorizar la conjunta, y **sin ella no vale ninguna de las tres fórmulas de abajo**: si conocer $x$ cambiara la distribución de $K$, $P[C=y \mid M=x]$ ya no sería "la masa de claves que llevan $x$ a $y$", porque esas claves tendrían otra probabilidad al condicionar. Todo el cálculo se cae.

---

## Las tres fórmulas derivadas

Notación: $C(k) = \{\, \mathsf{Enc}_k(x) : x \in M \,\}$ es la imagen de `Enc` con la clave $k$, es decir los cifrados alcanzables con esa clave.

**1. Marginal del cifrado** — probabilidad de que aparezca el texto cifrado $y$:

$$P[C = y] = \sum_{k\ :\ y\, \in\, C(k)} P[K = k]\cdot P[M = \mathsf{Dec}_k(y)]$$

*Lectura:* se suma sobre las claves que **pueden** producir $y$, y cada una aporta su probabilidad por la del único mensaje que con esa clave da $y$. Depende de las **dos** distribuciones.

**2. Condicional del cifrado dado el plano** — probabilidad de que aparezca $y$ si el mensaje fue $x$:

$$P[C = y \mid M = x] = \sum_{k\ :\ x\, =\, \mathsf{Dec}_k(y)} P[K = k]$$

*Lectura:* es la **masa de claves que mapean $x$ a $y$**. Es la fórmula que se usa para **verificar secreto perfecto**, porque en ella no aparece $P[M = \cdot\,]$ por ningún lado: depende sólo de `Gen` y de la tabla de cifrado.

> **Ojo con qué es exactamente lo libre de distribución.** Lo que se chequea sin tocar $P[M = \cdot\,]$ es que este valor sea **el mismo para todo $x$**: $P[C=y \mid M=x] = P[C=y \mid M=x']$ para todo par $x, x'$. La igualdad $P[C=y \mid M=x] = P[C=y]$ **no** es libre de distribución leída al pie de la letra —su lado derecho es la fórmula 1, que sí depende de $P[M = \cdot\,]$—; es la **consecuencia** de la anterior, ver [[#Cómo esto reescribe el secreto perfecto|abajo]].

**3. A posteriori (Bayes)** — probabilidad de que el plano sea $x$ sabiendo que se vio $y$:

$$P[M = x \mid C = y] = \frac{P[M = x]\cdot \sum_{k\ :\ x\, =\, \mathsf{Dec}_k(y)} P[K = k]}{P[C = y]}$$

*Lectura:* es **lo que el adversario cree del mensaje después de ver el criptograma**. Es la cantidad que la definición de seguridad quiere dejar igual a la creencia a priori $P[M = x]$.

---

## Cómo esto reescribe el secreto perfecto

Con este vocabulario, la definición de [[secreto-perfecto|secreto perfecto]] es literalmente *"la fórmula 3 devuelve $P[M = x]$"*. Y por Bayes las dos condiciones son **equivalentes** (para $P[M=x] > 0$, $P[C=y] > 0$):

$$P[M = x \mid C = y] = P[M = x] \quad\Longleftrightarrow\quad P[C = y \mid M = x] = P[C = y] \qquad \forall x, \forall y$$

Sale de sustituir la 3 en la 1: $P[M=x\mid C=y] = \dfrac{P[C=y\mid M=x]\,P[M=x]}{P[C=y]}$, y pedir que el cociente $\frac{P[C=y\mid M=x]}{P[C=y]}$ valga 1.

**En la práctica se chequea la segunda.** Las dos son equivalentes, pero no cuestan lo mismo:

- La condición *a posteriori* está cuantificada sobre **toda distribución de $M$** (así está enunciada en [[secreto-perfecto|secreto perfecto]]): verificarla directo obliga a razonar sobre un $P[M{=}\cdot\,]$ arbitrario.
- La condición *a priori* $P[C=y \mid M=x] = P[C=y]$ se colapsa, por la fórmula 2, a **"la masa de claves que llevan $x$ a $y$ no depende de $x$"**, y eso se lee de la tabla de cifrado y de `Gen`.

**Cuidado con el "no depende de $x$", que es donde está la sutileza.** La forma genuinamente libre de distribución no es $P[C=y \mid M=x] = P[C=y]$ —su lado derecho es la fórmula 1, que **sí** depende de $P[M = \cdot\,]$— sino

$$P[C = y \mid M = x] = P[C = y \mid M = x'] \qquad \forall x, x' \in \mathcal{M},\ \forall y$$

o sea: **todos los $P[C=y \mid M=x]$ valen lo mismo**. *Eso* se chequea con la fórmula 2 sin mirar nunca $P[M = \cdot\,]$. Que ese valor común sea justamente $P[C=y]$ **sale de ahí, no se pide aparte**: agrupando la fórmula 1 por $x = \mathsf{Dec}_k(y)$ queda

$$P[C = y] = \sum_{x \in \mathcal{M}} P[M = x]\cdot P[C = y \mid M = x]$$

es decir $P[C=y]$ es un **promedio ponderado** (por $P[M = \cdot\,]$, que suma 1) de los $P[C=y \mid M=x]$; si todos esos valores son iguales, el promedio es ese valor, cualquiera sea la distribución de $M$.

Es la misma idea que la [[secreto-perfecto#Caracterización equivalente|caracterización equivalente]] de esa nota ($\Pr[\mathsf{Enc}_K(m) = c]$ igual para todo $m$), escrita como probabilidad condicional en vez de como igualdad entre dos mensajes.

---

## Los ejemplos del apunte

El apunte instancia todo esto en **dos ejemplos numéricos completos** — uno con secreto perfecto y otro sin él — desarrollados en [[probabilidad-y-criptografia|Probabilidad y criptografía]].

Lo que hay que sacar del segundo: que **la cota de Shannon $\lvert K\rvert \ge \lvert M\rvert$ es necesaria pero no suficiente** — el desarrollo, con los números del Ejemplo 2, está en [[secreto-perfecto#Teorema de Shannon (cota de claves)|secreto perfecto]].

Es el mismo hilo conductor que ya recorre la wiki: en [[ataque-de-fuerza-bruta|fuerza bruta]] y en [[cifrado-de-sustitucion-monoalfabetica|sustitución monoalfabética]], *espacio de claves grande ≠ seguro*. Acá aparece la versión fina del mismo error: no alcanza con **contar** claves, hay que mirar **cómo se reparten** — que es exactamente lo que mide $P[C=y \mid M=x]$.
