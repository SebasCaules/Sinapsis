---
tipo: flashcards
titulo: Matemática de fondo
id: matematica
descripcion: 'Aritmética modular, Euclides extendido, inverso modular y cuerpos finitos: la herramienta que usan DES, AES y RSA.'
---

## Enuncie el lemma de combinación lineal y diga qué sostiene {#matematica:lemma-combinacion-lineal}
> pagina: aritmetica-modular-y-divisibilidad

Si $d \mid a$ y $d \mid b$, entonces $d \mid (a x + b y)$ para cualesquiera $x, y \in \mathbb{Z}$.

Demostración: $a = d\alpha$ y $b = d\beta$, luego $ax + by = d(\alpha x + \beta y)$.

De él salen tres cosas: la mitad necesaria del criterio de la ecuación diofántica, el paso de recursión de Euclides y la compatibilidad de la congruencia con la suma y el producto.

## ¿Con qué dos cláusulas se define $\operatorname{mcd}(a,b) = d$, y por qué no con "el divisor común más grande"? {#matematica:mcd-definicion}
> pagina: aritmetica-modular-y-divisibilidad

$$
\operatorname{mcd}(a,b) = d \iff \begin{cases} d \mid a \;\wedge\; d \mid b \\ \forall k:\; k \mid a \wedge k \mid b \Rightarrow k \mid d \end{cases}
$$

El "máximo" es en el orden de la divisibilidad, no en el de tamaño. Se prefiere esta definición porque es la que se usa en las demostraciones, porque cubre el caso $\operatorname{mcd}(0,0) = 0$ y porque se generaliza a estructuras sin orden útil, como los polinomios de $\mathrm{GF}(2^{8})$. Consecuencia: el mcd es único salvo signo y por convención se toma positivo.

## Enuncie el algoritmo de la división y diga qué papel cumple la cota $0 \le r < \lvert a\rvert$ {#matematica:algoritmo-de-la-division}
> pagina: aritmetica-modular-y-divisibilidad

Para todo $b \in \mathbb{Z}$ y todo $a \ne 0$ existen y son **únicos** $q, r$ tales que

$$
b = q\,a + r, \qquad 0 \le r < \lvert a\rvert
$$

La cota es exactamente lo que da la unicidad: sin ella se pasa de $b = qa + r$ a $b = (q{+}1)a + (r{-}a)$ indefinidamente. Esa unicidad permite definir la función $r_m(x) = x \bmod m$, y por lo tanto $\mathbb{Z}_m$. Además, $r = 0 \iff a \mid b$.

## Dé las tres caracterizaciones equivalentes de $x \equiv y \pmod m$ y para qué sirve cada una {#matematica:congruencia-tres-formas}
> pagina: aritmetica-modular-y-divisibilidad

$$
x \equiv y \pmod m \iff r_m(x) = r_m(y) \iff m \mid (x-y) \iff \exists\, k \in \mathbb{Z}: x = y + km
$$

La primera sirve para entender ("caen en la misma casilla"), la segunda para demostrar (reduce la congruencia a divisibilidad) y la tercera para calcular (permite reemplazar un número por otro más cómodo). La equivalencia se apoya en la unicidad del resto.

## ¿Qué propiedad de $\mathbb{Z}$ **no** se hereda en $\mathbb{Z}_m$, y cuál es el contraejemplo mínimo? {#matematica:cancelacion-en-zm}
> pagina: aritmetica-modular-y-divisibilidad

La **cancelación**. Módulo $32$:

$$
4 \cdot 3 = 12 \quad\text{y}\quad 4 \cdot 11 = 44 \equiv 12 \pmod{32}, \qquad 3 \not\equiv 11
$$

Multiplicar por $4$ no es inyectivo, así que el $4$ no se puede simplificar. Se puede cancelar $a$ si y sólo si $a \perp m$. La suma y el producto sí son compatibles con la congruencia; la división es la única operación que $\mathbb{Z}_m$ no trae de fábrica.

## ¿Cuándo tiene solución entera la ecuación diofántica $ax + by = c$? {#matematica:diofantica-criterio}
> pagina: algoritmo-de-euclides-extendido

Si y sólo si $\operatorname{mcd}(a,b) \mid c$.

Necesidad: por el lemma de combinación lineal, $d$ divide a toda combinación $ax+by$. Suficiencia: por Bézout hay $x_0,y_0$ con $ax_0 + by_0 = d$, y como $c/d$ es entero, multiplicar la identidad por $c/d$ da la solución. Ejemplo sin solución: $84x + 30y = 5$, porque $6 \nmid 5$.

## Enuncie la identidad de Bézout y explique por qué su demostración clásica no alcanza {#matematica:identidad-de-bezout}
> pagina: algoritmo-de-euclides-extendido

Para todo par $a, b$ no ambos nulos existen $x, y \in \mathbb{Z}$ con

$$
a x + b y = \operatorname{mcd}(a,b)
$$

En particular, si $a \perp b$ existen $x,y$ con $ax + by = 1$.

La prueba por el mínimo del conjunto de combinaciones lineales positivas es **no constructiva**: garantiza que los coeficientes existen y no da forma de encontrarlos. Euclides extendido es la versión constructiva del mismo teorema, y por eso es la que se estudia.

## ¿Cómo se corre Euclides extendido y cuál es su invariante? {#matematica:euclides-extendido-recurrencia}
> pagina: algoritmo-de-euclides-extendido

Se apoya en $\operatorname{mcd}(a,0) = \lvert a\rvert$ y $\operatorname{mcd}(a,b) = \operatorname{mcd}(b,\ a \bmod b)$; el mcd es el **último resto no nulo**, no el cero. Con $q_i = \lfloor r_{i-2}/r_{i-1}\rfloor$, las tres columnas obedecen la misma recurrencia:

$$
r_i = r_{i-2} - q_i r_{i-1}, \qquad s_i = s_{i-2} - q_i s_{i-1}, \qquad t_i = t_{i-2} - q_i t_{i-1}
$$

con $(r_{-1}, s_{-1}, t_{-1}) = (a,1,0)$ y $(r_0, s_0, t_0) = (b,0,1)$. Invariante: $r_i = s_i\,a + t_i\,b$, de donde sale Bézout en el último renglón no nulo.

## Dada una solución particular $(x_0,y_0)$ de $ax+by=c$, escriba todas las soluciones enteras {#matematica:diofantica-forma-general}
> pagina: algoritmo-de-euclides-extendido

Con $d = \operatorname{mcd}(a,b)$ y $t \in \mathbb{Z}$:

$$
x = x_0 + t\,\frac{b}{d}, \qquad y = y_0 - t\,\frac{a}{d}
$$

El paso es $b/d$, no $b$: usar $b$ en lugar de $b/d$ es uno de los tres errores más frecuentes del tema. En $84x + 30y = 18$, con $(x_0,y_0)=(-3,9)$, el $x$ avanza de $5$ en $5$ porque $30/6 = 5$.

## ¿Cuándo existe $a^{-1}$ módulo $m$, y por qué? {#matematica:inverso-existencia}
> pagina: inverso-modular

Si y sólo si $\operatorname{mcd}(a,m) = 1$.

Ida: por Bézout, $ax + my = 1$; leído módulo $m$ el término $my$ desaparece y queda $ax \equiv 1$. Vuelta: si $ax \equiv 1$, entonces $ax + my = 1$ y $d = \operatorname{mcd}(a,m)$ divide a $1$.

Lectura equivalente: $a$ es inversible si y sólo si $x \mapsto a x \bmod m$ es una biyección de $\mathbb{Z}_m$. Cuando existe, el inverso es único en $\mathbb{Z}_m$.

## ¿Cómo se calcula $7^{-1}$ en $\mathbb{Z}_{32}$, y cuál de los coeficientes de Bézout es el inverso? {#matematica:inverso-calculo-y-ejemplo}
> pagina: inverso-modular

Se corre Euclides extendido sobre $a$ y $m$; si $d \ne 1$ el inverso no existe. Si $d = 1$, el inverso es **el coeficiente que multiplica a $a$** (no el que multiplica a $m$), reducido a $\{0,\dots,m-1\}$.

$$
2\cdot 32 - 9\cdot 7 = 1 \;\Longrightarrow\; -9 \equiv 23 \pmod{32} \;\Longrightarrow\; 7^{-1} = 23 \text{ en } \mathbb{Z}_{32}
$$

Verificación: $7 \cdot 23 = 161 = 5\cdot 32 + 1$.

## ¿Cuántas soluciones tiene la congruencia lineal $a\bar{x} \equiv b \pmod m$? {#matematica:congruencia-lineal-cantidad-de-soluciones}
> pagina: inverso-modular

Con $d = \operatorname{mcd}(a,m)$: ninguna si $d \nmid b$, y exactamente $d$ soluciones distintas en $\mathbb{Z}_m$ si $d \mid b$, espaciadas $m/d$.

Receta: dividir por $d$ la congruencia, los coeficientes **y el módulo**, resolver la única solución $x_0$ módulo $m/d$, y levantar con $x_0 + t\,\frac{m}{d}$ para $t = 0,\dots,d-1$. Ejemplo: $6x \equiv 4 \pmod{10}$ da $\{4, 9\}$; $6x \equiv 3 \pmod{10}$ no tiene solución.

## En $E(K,M) = (M\cdot K)\bmod n$, ¿qué claves son usables y cuántas hay para $n=32$? {#matematica:espacio-de-claves-multiplicativo}
> pagina: inverso-modular

Las inversibles: $\mathbb{Z}_n^{*} = \{K : \operatorname{mcd}(K,n)=1\}$, y hay $\varphi(n)$. No es una recomendación de seguridad sino la condición de corrección: sin inverso no existe $\mathsf{Dec}$.

Para $n = 32$: $\varphi(32) = 2^{4}(2-1) = 16$ (los impares), $15$ con efecto real al sacar $K=1$, o sea **4 bits efectivos y no 5**. Con $K=4$, $4\cdot 3 \equiv 4\cdot 11 \equiv 12 \pmod{32}$: dos mensajes distintos, el mismo criptograma.

## ¿Qué tres condiciones definen una estructura de cuerpo? {#matematica:estructura-de-cuerpo}
> pagina: cuerpos-finitos-y-campos-de-galois

$$
(1)\ (F, \oplus) \text{ es grupo} \qquad (2)\ (F\setminus\{e_{\oplus}\}, \odot) \text{ es grupo} \qquad (3)\ a\odot(b\oplus c) = (a\odot b)\oplus(a\odot c)
$$

Ser grupo son cuatro propiedades: cerrada, asociativa, neutro e inverso. El neutro aditivo queda **afuera** del segundo grupo: si el $0$ tuviera inverso, de $0 \odot a = 0$ saldría $1 = 0$. Para refutar que algo es cuerpo conviene apuntar al inverso multiplicativo, que es la única propiedad que exige algo distinto para cada elemento. La definición estándar pide además conmutatividad de ambas operaciones.

## ¿Por qué $\mathbb{Z}_n$ es cuerpo si y sólo si $n$ es primo? {#matematica:zn-cuerpo-sii-primo}
> pagina: cuerpos-finitos-y-campos-de-galois

$$
\mathbb{Z}_n \text{ es cuerpo} \iff \text{todo } a \not\equiv 0 \text{ es inversible} \iff \varphi(n) = n-1 \iff n \text{ es primo} \qquad (n \ge 2)
$$

Las otras ocho propiedades valen en cualquier $\mathbb{Z}_n$; lo único que puede fallar es el inverso multiplicativo, y el criterio es $\operatorname{mcd}(a,n)=1$. Si $n$ es compuesto, existe $a$ con $1 < \operatorname{mcd}(a,n) < n$: ese $a$ es divisor de cero, así que $\mathbb{Z}_n\setminus\{0\}$ ni siquiera es cerrado bajo el producto. Contraejemplo: en $\mathbb{Z}_4$, $2\cdot 2 = 0$ y $2^{-1}$ no existe.

## Enuncie el teorema de existencia y unicidad de cuerpos finitos y su corolario {#matematica:existencia-y-unicidad-de-cuerpos-finitos}
> pagina: cuerpos-finitos-y-campos-de-galois

Para todo primo $p$ y todo natural $m$ existe un cuerpo finito con $p^{m}$ elementos, y es **único salvo isomorfismos**.

Corolario: la cardinalidad de un cuerpo finito es siempre potencia de primo — no hay cuerpo de $6$, ni de $10$, ni de $12$ elementos.

Distinción central: *"$\mathbb{Z}_4$ es un cuerpo"* es **falso**, pero *"existe un cuerpo de $4$ elementos"* es **verdadero**: es $\mathrm{GF}(2^{2}) = \{0, 1, x, x+1\}$, con suma xor y producto reducido con $x^{2} = x+1$.

## ¿Por qué AES opera sobre $\mathrm{GF}(2^{8})$ y no sobre $\mathbb{Z}_{256}$? {#matematica:gf-2-8-en-aes}
> pagina: cuerpos-finitos-y-campos-de-galois

Porque $256 = 2^{8}$ no es primo: $\mathbb{Z}_{256}$ tiene divisores de cero y **ningún byte par tiene inverso**. El cuerpo de $256$ elementos existe igual y es único: $\mathrm{GF}(2^{8})$, donde cada byte es un polinomio de grado menor que $8$ sobre $\mathbb{Z}_2$, la suma es xor y el producto se reduce módulo un polinomio irreducible fijo.

`Byte Sub` es la inversión multiplicativa en $\mathrm{GF}(2^{8})$ seguida de una transformación afín, y es la única etapa no lineal de AES.

## Defina orden de un elemento y generador, y diga cuántos generadores tiene $(\mathbb{Z}_p\setminus\{0\},\cdot)$ {#matematica:generador-y-orden}
> pagina: cuerpos-finitos-y-campos-de-galois

$$
\operatorname{Ord}(x) = \min\{n \in \mathbb{N} : x^{n} = e\}, \qquad \langle x\rangle = \{x^{n} : n \in \mathbb{Z}\}, \qquad \#\langle x\rangle = \operatorname{ord}(x)
$$

$x$ genera $G$ (es **elemento primitivo**) si y sólo si $\operatorname{ord}(x) = \lvert G\rvert$. Para $p$ primo, $(\mathbb{Z}_p\setminus\{0\},\cdot)$ es cíclico de orden $p-1$ y tiene $\varphi(p-1)$ generadores: en $\mathbb{Z}_7$, $\varphi(6)=2$, y son el $3$ y el $5$.

Control gratis: todos los órdenes dividen a $\lvert G\rvert$ (Lagrange). Y no se conoce algoritmo eficiente para **encontrar** un elemento primitivo, ni siquiera en $\mathbb{F}_p$.

## ¿Qué es $\mathbb{Z}_p^{*}$, cuál es su tamaño, y qué es un subgrupo? {#matematica:zp-estrella-y-subgrupo}
> pagina: grupos-anillos-y-cuerpos

$$
\mathbb{Z}_p^{*} = \bigl(\{\, k \mid k \in \mathbb{Z}_p - \{0\} \;\wedge\; \gcd(k,p)=1 \,\},\ +,\ *\bigr), \qquad p \text{ primo}, \qquad \lvert\mathbb{Z}_p^{*}\rvert = p-1
$$

Es el grupo sobre el que corre toda la aritmética de Diffie-Hellman y El Gamal: el generador y las claves viven en $\mathbb{Z}_p^{*}$, nunca en $\mathbb{Z}_p$ completo.

$(G',+)$ es **subgrupo** de $(G,+)$ si $G' \subseteq G$, $G' \ne \varnothing$ y $(G',+)$ es grupo por sí mismo. En DSS el generador genera un subgrupo de orden $q$ dentro de $\mathbb{Z}_p^{*}$, que tiene orden $p-1$: un subgrupo propio.

## Enuncie el teorema de Euler-Fermat y las propiedades de $\varphi$ que usa RSA {#matematica:euler-fermat}
> pagina: grupos-anillos-y-cuerpos

$$
a^{\varphi(n)} \equiv 1 \pmod n, \qquad \text{y si } p \text{ es primo: } a^{p-1} \equiv 1 \pmod p
$$

$$
\varphi(n\cdot m) = \varphi(n)\,\varphi(m) \text{ si } \gcd(n,m)=1, \qquad \varphi(p^{a}) = p^{a} - p^{a-1} = p^{a-1}(p-1) \text{ con } p \text{ primo}
$$

Es lo que hace que en RSA, con $e\cdot d \equiv 1 \pmod{\varphi(n)}$, el descifrado recupere exactamente $m$: $\varphi(n) = (p-1)(q-1)$ mide el tamaño del grupo multiplicativo $\mathbb{Z}_n^{*}$.
