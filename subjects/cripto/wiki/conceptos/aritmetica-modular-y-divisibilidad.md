---
title: Aritmética modular y divisibilidad
resumen: 'Base de teoría de números del curso: divisibilidad, máximo común divisor, coprimalidad, algoritmo de la división y congruencia módulo m, con el lemma de combinación lineal que sostiene a Euclides y al inverso modular.'
fuentes: ["[[clase-02-cifrado]]", "[[teoria-de-numeros]]", "[[video-02-guia-rapida-a-teoria-de-numeros]]", "[[video-03-algoritmo-de-euclides-extendido]]"]
aliases: [Aritmética modular, Aritmetica modular, Divisibilidad, Máximo común divisor, MCD, Congruencia modular, Coprimos, Algoritmo de la división, Clases de equivalencia módulo m]
type: concepto
unidad: 1
clase: 2
orden: 13
created: 2026-08-24
updated: 2026-09-04
tags: [criptografia, teoria-de-numeros, divisibilidad, mcd, congruencia, aritmetica-modular, clase-02, parcial]
sources: [DirtyGuidToNumberTheory.pdf, "Clase 02pt1-Transcripcion.VTT", "Guía Rápida a Teoría de Números (video, mirado)", "Algoritmo Euclides Extendido (video, mirado)"]
---

# Aritmética modular y divisibilidad

Esta nota trae **el andamiaje de $\mathbb{Z}_m$: qué significa "divide", qué es exactamente el mcd, por qué el resto es único y qué se puede y qué no se puede hacer con una congruencia**. Es la nota de base de las tres de teoría de números: [[algoritmo-de-euclides-extendido|Euclides extendido]] y el [[inverso-modular|inverso modular]] se apoyan enteros acá.

**Qué la distingue de sus vecinas.** El [[teoria-de-numeros|apunte de teoría de números]] transcribe fielmente las dos hojas manuscritas de la fuente, con su notación propia y sus erratas. **Esta nota no transcribe: desarrolla.** Acá están las demostraciones que el manuscrito no trae, la razón de ser de cada definición, y el lemma de combinación lineal, que es el que hace funcionar todo lo demás y que el manuscrito ni menciona.

> **Fuentes.** Apunte manuscrito [`DirtyGuidToNumberTheory.pdf`](../../raw/apuntes/DirtyGuidToNumberTheory.pdf) (hojas 1 y 2) · los dos videos del docente, **ya mirados y volcados** en [[video-03-algoritmo-de-euclides-extendido|video-03 Euclides extendido]] y [[video-02-guia-rapida-a-teoria-de-numeros|video-02 Guía rápida a teoría de números]] · el encargo en la [transcripción de la Clase 02](../../raw/clases/Clase%2002pt1-Transcripcion.VTT).
>
> Todo lo que va más allá de los enunciados del manuscrito —las demostraciones, el lemma de combinación lineal, la discusión de qué se pierde al pasar a $\mathbb{Z}_m$ y las conexiones con los cifrados clásicos— es **desarrollo nuestro**, y va rotulado donde corresponde.

---

## 1. Divisibilidad

$$a, b \in \mathbb{Z}: \qquad a \mid b \iff \exists\, c \in \mathbb{Z} \;:\; b = a\cdot c$$

Se lee **"$a$ divide a $b$"**, y equivale a decir que **$b$ es múltiplo de $a$**: son la misma relación mirada desde cada punta.

> **Lo primero que hay que notar es qué operación NO aparece: la división.** La definición está escrita con un producto. Eso no es un capricho de estilo — es lo que permite que el concepto viva dentro de $\mathbb{Z}$, donde la división no siempre da un entero. Si definieras $a \mid b$ como *"$b/a$ da exacto"* estarías apoyándote en una operación que no existe en el conjunto donde se quiere trabajar. *(Desarrollo nuestro: el manuscrito escribe la definición y sigue de largo.)*

### Los casos borde, y por qué importan

| Caso | Vale porque | Para qué se usa |
|---|---|---|
| $1 \mid b$ para todo $b$ | tomando $c = b$ | es el que hace que la condición $\operatorname{mcd}(a,m) \mid 1$ colapse a $\operatorname{mcd}(a,m) = 1$ — ver [[inverso-modular\|inverso modular]] |
| $a \mid 0$ para todo $a$ | tomando $c = 0$ | **todo entero divide al cero**. Es el caso base del [[algoritmo-de-euclides-extendido\|algoritmo de Euclides]] |
| $0 \mid b$ sólo si $b = 0$ | $0 \cdot c = 0$ siempre | el $0$ es el único número al que el $0$ divide. Es la asimetría que rompe la intuición de *"divisor = más chico"* |
| $a \mid b$ y $b \mid a$ $\Rightarrow$ $\lvert a\rvert = \lvert b\rvert$ | dos divisiones encadenadas | la divisibilidad es un orden **salvo signo**: por eso el mcd se define positivo |

### El lemma que sostiene todo lo demás

> **Lemma (combinación lineal).** Si $d \mid a$ y $d \mid b$, entonces $d \mid (a x + b y)$ para cualesquiera $x, y \in \mathbb{Z}$.

*Demostración.* Por hipótesis $a = d\alpha$ y $b = d\beta$ con $\alpha, \beta \in \mathbb{Z}$. Entonces
$$a x + b y = d\alpha x + d\beta y = d\,(\alpha x + \beta y)$$
y $\alpha x + \beta y$ es entero. Luego $d$ divide a la combinación. $\blacksquare$

**Este renglón de tres líneas es el motor de las tres notas.** *(Desarrollo nuestro: el manuscrito no lo enuncia, pero lo usa implícitamente tres veces.)* De él salen, sin esfuerzo adicional:

- la mitad **necesaria** del criterio de la [[algoritmo-de-euclides-extendido#2. La ecuación diofántica lineal|ecuación diofántica]] — si $d = \operatorname{mcd}(a,b)$, toda combinación $ax+by$ es múltiplo de $d$, así que $ax+by=c$ es imposible si $d \nmid c$;
- el paso de recursión de **Euclides** (sección 2 de acá abajo);
- la razón de que la **congruencia sea compatible con la suma y el producto** (sección 5).

---

## 2. Máximo común divisor

El manuscrito **no** define el mcd como *"el más grande de los divisores comunes"*. Lo define por dos cláusulas:

$$\operatorname{mcd}(a,b) = d \quad\iff\quad
\begin{cases}
d \mid a \;\wedge\; d \mid b & \text{(es divisor común)}\\[4pt]
\forall k:\; k \mid a \;\wedge\; k \mid b \;\Rightarrow\; k \mid d & \text{(es el mayor en el orden de la divisibilidad)}
\end{cases}$$

*(Notación del manuscrito: $(a{:}b) = d$. Acá se usa $\operatorname{mcd}$; el diccionario completo está en el [[teoria-de-numeros#2. La notación propia del manuscrito|apunte]].)*

### Por qué esta definición y no la ingenua

*(Desarrollo nuestro. El manuscrito da la definición sin justificarla, y es una de las cosas que más cuesta al leerlo.)*

Las dos definiciones dan el mismo número para $a, b$ no ambos nulos, pero la de arriba es mejor por tres razones concretas:

1. **Es la que se usa en las demostraciones.** *"Todo divisor común divide a $d$"* es una hipótesis con la que se puede trabajar; *"$d$ es el más grande"* obliga a comparar tamaños, que es un argumento mucho más torpe.
2. **Cubre el caso $a = b = 0$.** Con la definición ingenua no existe *"el más grande"* de los divisores comunes de $0$ y $0$ (los divide todo el mundo). Con la de arriba, $\operatorname{mcd}(0,0) = 0$: el $0$ es divisor común de $0$ y $0$, y todo $k$ divide a $0$.
3. **Es la que se generaliza.** En estructuras donde no hay un orden $\le$ útil —polinomios, por ejemplo, que es exactamente el terreno de [[cuerpos-finitos|GF(2⁸) en AES]]— la única definición que sobrevive es la de la propiedad universal.

> **Consecuencia inmediata de la segunda cláusula:** el mcd es **único salvo signo**, y por convención se toma el positivo. Si $d$ y $d'$ cumplen las dos cláusulas, cada uno divide al otro, y por el cuarto caso borde de la sección 1 tienen el mismo valor absoluto.

### Las dos propiedades que usa Euclides

| Propiedad | Enunciado | De dónde sale |
|---|---|---|
| **Caso base** | $\operatorname{mcd}(a, 0) = \lvert a\rvert$ | los divisores comunes de $a$ y $0$ son los divisores de $a$, porque todo divide al $0$ |
| **Paso de recursión** | $\operatorname{mcd}(a, b) = \operatorname{mcd}(b,\, a \bmod b)$ para $b \ne 0$ | ver la demostración de abajo |

*Demostración del paso de recursión.* Se escribe $a = qb + r$ con $0 \le r < \lvert b\rvert$ (sección 4). Entonces:

- Si $k \mid b$ y $k \mid r$, como $a = qb + r$ es una combinación lineal de $b$ y $r$, el lemma da $k \mid a$.
- Si $k \mid a$ y $k \mid b$, como $r = a - qb$ es una combinación lineal de $a$ y $b$, el lemma da $k \mid r$.

O sea: **el conjunto de divisores comunes de $(a,b)$ es idéntico al de $(b,r)$**. Si los conjuntos son el mismo, el máximo también. $\blacksquare$

> **Ese es todo el algoritmo de Euclides.** No hay ningún truco adicional: el par $(a,b)$ se reemplaza por $(b, a \bmod b)$, que tiene los mismos divisores comunes y números estrictamente más chicos, hasta caer en el caso base. El desarrollo con la corrida paso a paso y los coeficientes está en [[algoritmo-de-euclides-extendido|Algoritmo de Euclides extendido]].

---

## 3. Coprimalidad

$$a \perp b \quad\iff\quad \operatorname{mcd}(a,b) = 1$$

*($a \perp b$ es la notación del manuscrito, que lo glosa como "$a$ COPRIME $b$".)*

Dos enteros son **coprimos** cuando no comparten ningún factor primo. Tres lecturas de lo mismo, cada una útil en su lugar:

| Lectura | Enunciado | Dónde se usa |
|---|---|---|
| **Factorización** | $a$ y $b$ no tienen primos en común | para decidirlo de un vistazo: $\operatorname{mcd}(7,32)=1$ porque $32=2^5$ y $7$ es impar |
| **Bézout** | existen $x,y$ con $ax + by = 1$ | [[algoritmo-de-euclides-extendido\|Euclides extendido]] |
| **Inversibilidad** | $a$ tiene inverso módulo $b$ | [[inverso-modular\|inverso modular]] — es la que le importa a la criptografía |

> **La tercera es la que convierte esto en criptografía.** Ser coprimo con el módulo es exactamente la condición para que multiplicar por $a$ sea una **biyección** de $\mathbb{Z}_b$ en sí mismo — o sea, para que se pueda **descifrar**. En el [[guia-02-criptografia-simetrica|Ej. 7 de la Guía 2]] eso es literalmente el espacio de claves usable. *(Lectura nuestra: el manuscrito nunca menciona criptografía.)*

**Cuidado con "coprimo" versus "primo".** No hace falta que ninguno de los dos sea primo: $8 \perp 9$ y ninguno lo es. Y ser primo tampoco alcanza por sí solo: $3$ es primo pero $3 \not\perp 12$.

---

## 4. El algoritmo de la división

> **Teorema.** Para todo $b \in \mathbb{Z}$ (dividendo) y todo $a \in \mathbb{Z}$, $a \ne 0$ (divisor), **existen y son únicos** $q, r \in \mathbb{Z}$ tales que
> $$b = q\,a + r, \qquad 0 \le r < \lvert a\rvert$$

*(Convención de letras: es la del manuscrito, donde el **divisor es $a$** y el **dividendo es $b$**. Casi toda la bibliografía escribe $a = qb + r$. Mezclar las dos lleva a equivocarse de variable; el [[teoria-de-numeros#División entera|apunte]] discute por qué el manuscrito eligió así.)*

**Errata del manuscrito:** la hoja escribe $\exists\, a, b \in \mathbb{N}$, que leído literal afirma apenas que *hay algún* par que admite la descomposición. Corresponde $\forall a, b$ con $a \ne 0$, y $\exists!\,q,r$. La **unicidad** no está escrita en la fuente y es la mitad interesante del enunciado.

### La demostración, y para qué sirve cada mitad

**Existencia.** Considérese el conjunto $S = \{\, b - qa \;:\; q \in \mathbb{Z} \,\} \cap \mathbb{Z}_{\ge 0}$, o sea todos los valores no negativos que se pueden obtener restándole a $b$ múltiplos de $a$. No es vacío (tomando $q$ suficientemente negativo o positivo según el signo de $a$ se llega a un valor $\ge 0$), así que tiene un **mínimo** $r = b - qa \ge 0$. Si fuera $r \ge \lvert a\rvert$, entonces $r - \lvert a\rvert$ seguiría en $S$ y sería más chico, contra la minimalidad. Luego $0 \le r < \lvert a\rvert$. $\blacksquare$

**Unicidad.** Supongamos $b = q_1 a + r_1 = q_2 a + r_2$ con $0 \le r_1, r_2 < \lvert a\rvert$. Restando: $a(q_1 - q_2) = r_2 - r_1$. El lado izquierdo es múltiplo de $a$; el derecho cumple $\lvert r_2 - r_1\rvert < \lvert a\rvert$. El único múltiplo de $a$ de valor absoluto menor que $\lvert a\rvert$ es el $0$, así que $r_1 = r_2$ y, como $a \ne 0$, también $q_1 = q_2$. $\blacksquare$

> **La condición $0 \le r < \lvert a\rvert$ no es cosmética: es la unicidad.** Sin ella, de $b = qa + r$ se pasa a $b = (q{+}1)a + (r{-}a)$ y así infinitamente. Acotar el resto deja **exactamente un** par $(q,r)$, y eso es lo que permite hablar de *"el"* resto — es decir, definir una **función**:
> $$r_m(x) = r \quad\text{tal que}\quad x = k\,m + r,\ \ 0 \le r < m$$
> que es lo que casi todo el mundo escribe $x \bmod m$. **Toda la aritmética modular se apoya en esta unicidad**: si el resto no fuera único, $\mathbb{Z}_m$ no estaría bien definido. *(Énfasis nuestro; el manuscrito da la cota sin comentarla.)*

Y el cierre que conecta con la sección 1: $r = 0 \iff a \mid b$. **Resto cero es la traducción operativa de "es divisor"** — vale en los dos sentidos, aunque el manuscrito escriba sólo uno.

---

## 5. Congruencia módulo m

$$x \equiv y \pmod m, \qquad m \in \mathbb{N},\ x,y \in \mathbb{Z}$$

*(El manuscrito lo anota $x \equiv y\ (m)$, con el módulo entre paréntesis como subíndice.)*

### Las tres caracterizaciones equivalentes

$$x \equiv y \pmod m
\;\iff\;
\underbrace{r_m(x) = r_m(y)}_{\text{(i) mismo resto}}
\;\iff\;
\underbrace{m \mid (x-y)}_{\text{(ii) diferencia múltiplo}}
\;\iff\;
\underbrace{\exists\, k \in \mathbb{Z}: x = y + k\,m}_{\text{(iii) despeje}}$$

*Demostración del ciclo.* *(Desarrollo nuestro: el manuscrito encadena las tres formas con flechas y no las demuestra.)*

- **(i) $\Rightarrow$ (ii).** Si $x = k_1 m + r$ e $y = k_2 m + r$ con el mismo $r$, entonces $x - y = (k_1-k_2)m$, o sea $m \mid (x-y)$.
- **(ii) $\Rightarrow$ (iii).** Es la definición de divisibilidad aplicada a $x-y$: existe $k$ con $x - y = km$, y se despeja.
- **(iii) $\Rightarrow$ (i).** Se escribe $y = qm + r$ con $0 \le r < m$ (sección 4). Entonces $x = y + km = (q+k)m + r$, con el **mismo** $r$ en el rango correcto. Por la **unicidad** del algoritmo de la división, ese $r$ es $r_m(x)$. Luego $r_m(x) = r_m(y)$. $\blacksquare$

Nótese dónde entró la unicidad: en el último paso. **Sin unicidad del resto, las tres formas no serían equivalentes.**

### Cuál usar en cada situación

| Forma | Cuándo conviene | Ejemplo |
|---|---|---|
| $r_m(x) = r_m(y)$ | para **entender**: es la definición intuitiva, "caen en la misma casilla" | $17 \equiv 5 \pmod{12}$ porque los dos dejan resto $5$ |
| $m \mid (x-y)$ | para **demostrar**: reduce la congruencia a divisibilidad, y ahí entra todo lo de arriba | casi todas las pruebas de esta nota |
| $x = y + km$ | para **calcular**: permite reemplazar un número por otro más cómodo | $7 \cdot 23 = 161 = 5\cdot 32 + 1 \equiv 1 \pmod{32}$ |

### Qué se hereda y qué no

La congruencia módulo $m$ es una **relación de equivalencia** (reflexiva, simétrica y transitiva — las tres salen directo de la forma (ii) y del lemma de combinación lineal) y además es **compatible con la suma y el producto**:

$$x \equiv x' \;\wedge\; y \equiv y' \pmod m \quad\Longrightarrow\quad x + y \equiv x' + y' \;\wedge\; x\,y \equiv x'\,y' \pmod m$$

*Demostración del producto (la que no es obvia).* Por (iii), $x = x' + k m$ e $y = y' + l m$. Entonces
$$x\,y = (x' + km)(y' + lm) = x'y' + m\,(x'l + y'k + klm)$$
o sea $xy - x'y'$ es múltiplo de $m$. $\blacksquare$

**Esa compatibilidad es exactamente lo que hace que exista la aritmética modular.** Sin ella no se podría operar con representantes, y no habría ni [[cifrado-por-rotacion|cifrado por rotación]] ni RSA.

> **Lo que NO se hereda: la cancelación.** En $\mathbb{Z}$, de $ax = ay$ con $a \ne 0$ se deduce $x = y$. **En $\mathbb{Z}_m$ eso es falso.** Contraejemplo mínimo: módulo $32$,
> $$4 \cdot 3 = 12 \quad\text{y}\quad 4 \cdot 11 = 44 \equiv 12 \pmod{32}$$
> con $3 \not\equiv 11 \pmod{32}$. Multiplicar por $4$ **no es inyectivo** módulo $32$, y por eso no se puede simplificar el $4$.
>
> **Se puede cancelar $a$ si y sólo si $a \perp m$**, y ese "si y sólo si" es todo el contenido de la nota de [[inverso-modular|inverso modular]]. Dicho al revés: **la división es la única operación que $\mathbb{Z}_m$ no trae de fábrica**, y recuperarla —para los $a$ que se dejan— es el objetivo de las otras dos notas de este bloque. *(Desarrollo nuestro; el manuscrito nunca señala qué se pierde.)*

---

## 6. Z_m: las clases de equivalencia

Como $\equiv \pmod m$ es una relación de equivalencia, parte a $\mathbb{Z}$ en **clases**. La clase de $x$ es

$$\bar{x} = [x]_m = \{\, x + k\,m \;:\; k \in \mathbb{Z} \,\} = \{\, \dots,\, x-2m,\; x-m,\; x,\; x+m,\; x+2m,\, \dots \,\}$$

y el conjunto de todas las clases es

$$\mathbb{Z}_m = \mathbb{Z}/m\mathbb{Z} = \{\, \bar{0},\, \bar{1},\, \dots,\, \overline{m-1} \,\}, \qquad \lvert \mathbb{Z}_m\rvert = m$$

**Hay exactamente $m$ clases, y $\{0, 1, \dots, m-1\}$ es un sistema completo de representantes** — eso es, otra vez, el algoritmo de la división: todo entero cae en una y sólo una casilla.

> **Por qué la barra.** El manuscrito escribe la incógnita de una congruencia como $\bar{x}$, y no es decoración: **la solución de $a\bar{x} \equiv b \pmod m$ no es un entero, es una clase**. Si $x_0$ resuelve, también resuelve $x_0 + m$, y $x_0 + 2m$, y así. Preguntar *"¿cuánto vale $x$?"* sólo tiene respuesta única **dentro de $\mathbb{Z}_m$**. Es la misma distinción que hay entre *"el ángulo es $\pi/2$"* y *"el ángulo es $\pi/2$ más un múltiplo de $2\pi$"*.

Gracias a la compatibilidad de la sección 5, las operaciones **se pasan a las clases sin ambigüedad**:

$$\bar{x} + \bar{y} := \overline{x+y}, \qquad \bar{x}\cdot\bar{y} := \overline{x\,y}$$

y el resultado no depende de qué representante elijas. Con eso, $(\mathbb{Z}_m, +, \cdot)$ es un **anillo conmutativo con unidad**. Lo que falta para que sea un **cuerpo** —que todo elemento no nulo tenga inverso multiplicativo— pasa **si y sólo si $m$ es primo**, y ese es el tema de [[cuerpos-finitos-y-campos-de-galois|cuerpos finitos]] y del [[cuerpos-finitos|apunte correspondiente]].

| $m$ | Estructura de $\mathbb{Z}_m$ | Elementos inversibles |
|---|---|---|
| $m$ primo | **cuerpo** $\mathbb{Z}_p$ | los $p-1$ no nulos |
| $m$ compuesto | anillo con **divisores de cero** | los $\varphi(m)$ coprimos con $m$ |
| $m = 32$ | anillo; $4\cdot 8 \equiv 0$ | los $16$ impares — [[guia-02-criptografia-simetrica\|Ej. 7 de la Guía 2]] |

---

## 7. Esto no es nuevo: ya se venía haciendo aritmética modular desde la Clase 1

*(Conexión nuestra: ni el manuscrito ni las filminas la hacen explícita. Vale la pena hacerla porque el tema se presenta como "repaso de matemática discreta" y eso hace fácil no reconocerlo cuando reaparece.)*

Los cifrados clásicos de la [[clase-01-introduccion-y-criptografia-clasica|Clase 01]] **están definidos en $\mathbb{Z}_n$**, sólo que ahí no se lo llamó así:

| Cifrado | Ecuación | Dónde está la aritmética modular |
|---|---|---|
| [[cifrado-por-rotacion\|Rotación / César]] | $c = (m + k) \bmod n$ | la suma en el grupo $(\mathbb{Z}_n, +)$, con $n = 27$ para el castellano |
| [[cifrado-de-vigenere\|Vigenère]] | $c_i = \bigl(m_i + k_{((i-1)\bmod t)+1}\bigr) \bmod n$ | **dos** módulos distintos y con roles distintos: $\bmod\ n$ para las letras, $\bmod\ t$ para el índice cíclico de la clave |
| [[guia-02-criptografia-simetrica\|Ej. 7 de la Guía 2]] | $E(K,M) = (M \cdot K) \bmod 32$ | el **producto** en $\mathbb{Z}_{32}$, no la suma |

**Y ahí está el salto que justifica todo este bloque.** Nótese la diferencia entre las dos primeras filas y la tercera:

- La rotación y Vigenère **suman**. La suma en $\mathbb{Z}_n$ es siempre inversible: sumar $k$ se deshace restando $k$, para **cualquier** $k$. Por eso $\mathsf{Dec}$ siempre existe y nadie tuvo que hablar de teoría de números.
- El cifrado multiplicativo **multiplica**. Y el producto en $\mathbb{Z}_m$ **no siempre es inversible**: sólo lo es cuando la clave es coprima con el módulo (sección 5, "lo que no se hereda"). De golpe, la [[criptosistema#Condición de corrección|condición de corrección del criptosistema]] —que $\mathsf{Dec}_k(\mathsf{Enc}_k(m)) = m$— deja de ser gratis y **pasa a depender de un cálculo de teoría de números**.

Ese es el motivo por el que el docente pidió este repaso justo al cerrar la [[clase-02-cifrado|Clase 02]], y por el que el [[guia-02-criptografia-simetrica|Ej. 7 de la Guía 2]] no se puede terminar sin [[algoritmo-de-euclides-extendido|Euclides extendido]].

En Vigenère, además, el índice $((i-1)\bmod t)+1$ es un uso de $\mathbb{Z}_t$ **como conjunto de índices**, no como conjunto de valores: es la forma canónica de decir *"recorrer la clave en círculo"*. Es el mismo truco que usa el contador de [[modos-de-encadenamiento|CTR]] para no repetir bloques de keystream.

---

## 8. Resumen operativo

| Concepto | Definición | El detalle que se olvida |
|---|---|---|
| $a \mid b$ | $\exists c: b = ac$ | se define con **producto**, no con división. $a$ divide, $b$ es el múltiplo — y **no** significa que $a$ sea el chico: $a \mid 0$ vale para todo $a$ |
| $a \mid 0$ | vale para todo $a$ | caso base de Euclides |
| $\operatorname{mcd}(a,b) = d$ | divisor común **y** todo divisor común divide a $d$ | el "máximo" es en el orden de la **divisibilidad** |
| Lemma de combinación lineal | $d\mid a,\ d\mid b \Rightarrow d \mid (ax+by)$ | es el que hace funcionar Euclides, Bézout y la compatibilidad de la congruencia |
| $a \perp b$ | $\operatorname{mcd}(a,b)=1$ | ninguno de los dos tiene que ser primo |
| $b = qa + r$, $0 \le r < \lvert a\rvert$ | existencia **y unicidad** | la cota es lo que da la unicidad, y la unicidad es lo que define $\mathbb{Z}_m$ |
| $x \equiv y \pmod m$ | tres formas equivalentes | usar (ii) para demostrar, (iii) para calcular |
| $\mathbb{Z}_m$ | $m$ clases de equivalencia | se suma y multiplica; **no siempre se divide** |

---

## Sobre la numeración de esta nota

*(Lectura nuestra. Se deja escrito para que la decisión sea auditable y el cambio sea barato si la cátedra lo ubica en otro lado. **Esta es la justificación del bloque entero**: [[algoritmo-de-euclides-extendido|02.14]] y [[inverso-modular|02.15]] remiten acá en vez de repetirla.)*

- El **programa oficial** ([[programa-y-objetivos|nota]], PDF [`72.44 - Criptografía y Seguridad.pdf`](../../raw/material_Catedra/72.44%20-%20Criptograf%C3%ADa%20y%20Seguridad.pdf)) **no menciona teoría de números en ninguna unidad**. No hay atribución oficial de clase para este tema.
- La **única fuente que lo asigna** a una clase es la [transcripción de la Clase 02](../../raw/clases/Clase%2002pt1-Transcripcion.VTT), donde el docente lo deja como tarea explícita al cerrar la clase y avisa que *"eso le va a servir para el parcial"*.
- La [[indice#Convenciones|convención del vault]] dice que los conceptos que salen de la práctica o de la guía **continúan el contador después de los de teoría**. La Clase 02 cierra en `02.12`.

Por eso: **unidad 1, clase 2, orden 13 en adelante**. Si más adelante la cátedra introduce el tema formalmente en la **Clase 4 (Criptografía Asimétrica, 10/09)**, corresponde renumerar este bloque a `04.xx` — son tres notas de concepto más los links entrantes desde el [[teoria-de-numeros|apunte]], la [[guia-02-criptografia-simetrica|Guía 2]] y el [[indice|índice]].
