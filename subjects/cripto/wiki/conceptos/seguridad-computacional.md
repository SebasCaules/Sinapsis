---
title: Seguridad computacional
resumen: 'La noción de seguridad que reemplaza al secreto perfecto relajando dos cosas a la vez: el adversario queda limitado a tiempo polinomial probabilístico y se le admite una probabilidad de éxito despreciable.'
fuentes: ["[[clase-02-cifrado]]", "[[secreto-perfecto]]"]
aliases: [Seguridad computacional, Función despreciable, Negligible, PPT, Nivel de seguridad]
type: concepto
unidad: 1
clase: 2
orden: 2
created: 2026-08-21
updated: 2026-08-24
tags: [criptografia, seguridad-computacional, ppt, despreciable, nivel-de-seguridad, clase-02]
sources: [Clase 02 - Criptografia - Cifrado.pdf]
---

# Seguridad computacional

El cambio de definición que hace posible la criptografía práctica. Es **la bisagra de la Clase 02**: todo lo que viene después —flujo, bloque, modos, AES— sólo tiene sentido dentro de esta noción de seguridad.

---

## De dónde viene

> **Secreto perfecto = seguridad incondicional.**

El [[one-time-pad|OTP]] alcanza el [[secreto-perfecto|secreto perfecto]], pero cuesta $\lvert K\rvert \ge \lvert M\rvert$, y **todo esquema perfectamente secreto es reducible al OTP**. O sea: no hay nada mejor por buscar. Si se quiere claves cortas y reutilizables, hay que **bajar la vara**.

La filmina lo dibuja como una caída con dos escalones:

| Se relaja | Qué significa concretamente |
|---|---|
| **Limitar escenarios** | Garantizar seguridad **sólo contra adversarios "limitados"**. Se asume una cota en los recursos del atacante, *especialmente tiempo* |
| **Limitar garantías** | **Aceptar una pequeña probabilidad de éxito** para el atacante. Se deja de lado la infalibilidad |

El resultado de aplicar los dos es la **seguridad computacional**.

> **Por qué las dos relajaciones son inevitables, no arbitrarias.** *(lectura nuestra.)* Con $\lvert K\rvert < \lvert M\rvert$ la [[ataque-de-fuerza-bruta|fuerza bruta]] **siempre** funciona: probar las $\lvert K\rvert$ claves y quedarse con el descifrado que tenga sentido. Ese ataque no se puede prohibir — sólo se puede volver **caro** (de ahí *limitar escenarios*: el adversario no tiene tiempo infinito) y **poco confiable** (de ahí *limitar garantías*: puede acertar de casualidad). Las dos relajaciones son, respectivamente, las dos maneras de convivir con la fuerza bruta.

---

## Nivel de seguridad

> El **nivel de seguridad** está dado por una variable. **Relaciona la cota en el poder de un adversario con la probabilidad de éxito que tendrá.**

Dado un nivel de seguridad $n$, se espera que:

1. Un adversario corra algoritmos de orden **$\mathrm{PPT}(n)$** — *Probabilistic Polynomial Time*, tiempo polinomial probabilístico en $n$.
2. Su probabilidad de éxito sea una **función despreciable en $n$**.

$n$ es, en la práctica, el **largo de la clave**: "AES-128" es un criptosistema instanciado con $n = 128$. Todas las afirmaciones de seguridad se hacen **para la familia** $\Pi(n)$, no para un sistema fijo — por eso las [[pruebas-de-indistinguibilidad|pruebas de indistinguibilidad]] aparecen dos veces en las filminas: primero con un $\varepsilon$ suelto y después con $\varepsilon(n)$, ya parametrizado.

### Las dos piezas

**PPT** — el adversario es un algoritmo **probabilístico** (puede tirar monedas) que corre en tiempo **polinomial** en $n$. Es la formalización de *"adversario razonable"*: se le permite muchísimo, pero no $2^{n}$ pasos.

**Función despreciable** — la filmina la define así:

$$\varepsilon(n) \text{ es despreciable} \iff \lim \varepsilon(n) < 1/n^k$$

> **Cómo leerlo bien.** *(lectura nuestra: la escritura de la filmina es taquigráfica.)* La definición estándar es: $\varepsilon$ es despreciable si **para todo polinomio $p$** existe $N$ tal que $\varepsilon(n) < 1/p(n)$ para todo $n > N$. Es decir, $\varepsilon$ decae **más rápido que la inversa de cualquier polinomio** — el $k$ de la filmina está universalmente cuantificado, vale para *todo* $k$, no para uno elegido.

| $\varepsilon(n)$ | ¿Despreciable? | Por qué |
|---|---|---|
| $2^{-n}$ | Sí | Exponencial: le gana a $1/n^{k}$ para todo $k$ |
| $2^{-\sqrt{n}}$ | Sí | Sub-exponencial pero sigue superando a todo polinomio |
| $1/n^{100}$ | No | Es un polinomio; falla con $k = 101$ |
| $1/(n\cdot\log n)$ | No | Idem |

> **La intuición del par PPT + despreciable.** Si el adversario da $p(n)$ pasos y cada uno tiene probabilidad despreciable de acertar, el total $p(n)\cdot \varepsilon(n)$ **sigue siendo despreciable**. Esa clausura es la que permite componer construcciones y demostrar por reducción — es toda la razón por la que "despreciable" se define así y no como "menor que 0,001".

---

## Qué significa en la práctica

La seguridad computacional convierte *"es seguro"* en una afirmación con **tres parámetros explícitos**: contra qué prueba, con qué nivel $n$, y con qué $\varepsilon$. Eso es lo que habilita después el vocabulario de [[estado-de-un-criptosistema|estados de un criptosistema]] —seguro, debilitado, quebrado— y la observación de que **un mismo sistema puede ser seguro y estar quebrado a la vez**, porque cada prueba fija un escenario diferente.

También explica por qué la clase insiste con la escala física —$2^{88}$ átomos en el universo y $2^{58}$ segundos de edad del universo, en la tabla de [[eleccion-de-primitivas|elección de primitivas]]—: es la **escala** contra la cual se calibra "adversario limitado". Un ataque de $2^{128}$ no es difícil, es físicamente imposible: a una prueba por segundo desde el Big Bang, la cuenta llevaría $2^{58}$ intentos hechos y le faltarían $2^{70}$ edades del universo.

> **Errata de la filmina:** el $2^{88}$ no es la cantidad de átomos del universo observable, que tiene $\approx 10^{80} \approx 2^{266}$; $2^{88}$ es del orden de los átomos de unos kilos de agua. El $2^{58}$ de los segundos sí está bien. **El argumento de la clase no cambia** —lo que vuelve inalcanzable a $2^{128}$ es el tiempo, no el conteo de átomos—; el detalle de la cuenta está en [[eleccion-de-primitivas#Tamaños|elección de primitivas]].

> **Lo que la seguridad computacional NO es.** No es "todavía nadie lo rompió" —ese es el criterio pre-1949 que la [[clase-01-introduccion-y-criptografia-clasica|Clase 01]] descarta. Es una **demostración condicional**: *si* la primitiva subyacente es pseudoaleatoria, *entonces* la construcción pasa la prueba. La filmina lo remata sin anestesia: **no está demostrado que existan las funciones pseudoaleatorias.**

## Ver también

- [[one-time-pad|One Time Pad]] — lo que se abandona al dar este paso
- [[secreto-perfecto|Secreto perfecto]] — la seguridad incondicional
- [[pruebas-de-indistinguibilidad|Pruebas de indistinguibilidad]] — el instrumento con el que se mide $\varepsilon(n)$
- [[generador-pseudoaleatorio|Generador pseudoaleatorio]] — la primitiva sobre la que se apoyan las reducciones
- [[ataque-de-fuerza-bruta|Ataque de fuerza bruta]] — el ataque que esta definición admite y acota
- [[estado-de-un-criptosistema|Estado de un criptosistema]]
- Katz & Lindell §3.1 *Computational Security* ([[bibliografia|bibliografía]])
