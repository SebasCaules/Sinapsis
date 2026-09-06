---
title: Secretos compartidos y método de Shamir
resumen: 'Esquema de umbral que reparte un secreto en n sombras de modo que cualesquiera t lo reconstruyan por interpolación de Lagrange módulo p, y que menos de t no filtren ninguna información sobre él.'
fuentes: ["[[clase-06-politicas-de-seguridad-y-control-de-acceso]]", "[[parciales-viejos]]", "[[inverso-modular]]", "[[secreto-perfecto]]"]
aliases: [Secretos compartidos, Método de Shamir, Shamir secret sharing, Esquema threshold, Interpolación de Lagrange en Zp, Umbral t de n]
type: concepto
unidad: 2
clase: 6
orden: 13
created: 2026-09-04
updated: 2026-09-04
tags: [control-de-acceso, secretos-compartidos, shamir, aritmetica-modular, clase-06, sin-dictar]
sources: ["Clase 08 - Control de acceso.pdf"]
---

# Secretos compartidos y método de Shamir

**Cómo repartir un secreto en $n$ pedazos de forma que cualquier $t$ de ellos lo reconstruyan por completo, y cualquier $t-1$ no filtre absolutamente nada.** Es la nota con la cuenta más larga de las ocho de esta clase, y la única filmina de todo el bloque de Control de acceso con un error de aritmética verificable en el propio PDF.

*Filminas 23 a 27 del deck de Control de acceso (`Clase 08 - Control de acceso.pdf`). La clase todavía no se dictó —hoy es 04/09/2026, la clase es el 01/10/2026—; esta nota está escrita contra el PDF y lecturas propias, rotuladas como tales. No hay transcripción.*

## El problema que resuelve

*Filmina 23.* Secretos compartidos son una implementación de políticas de **separación de privilegios**: en vez de que un único sujeto controle un secreto completo (una clave maestra, por ejemplo), se lo reparte de forma que haga falta la **cooperación** de varios.

$$\textbf{Esquema } (t,n)\textbf{-threshold: } \text{repartir un secreto en } n \text{ partes (sombras), tales que}$$
$$\textbf{cualesquiera } t \text{ sombras permiten reconstruirlo, y cualesquiera } k<t \text{ no dan ninguna información sobre él}$$

La filmina aclara que esto puede implementarse por **control del sistema** (un servidor que exige $t$ credenciales antes de liberar el secreto) o, como desarrolla el resto de la sección, con **criptografía de umbral** (*threshold cryptography*) — sin ningún servidor de por medio, el secreto queda matemáticamente irrecuperable con menos de $t$ partes.

## El principio, y una imprecisión que hay que resolver con el ejemplo

*Filmina 24.* El principio matemático detrás del método:

> Un polinomio de grado $t$ puede ser especificado mediante su evaluación en $t$ puntos diferentes.

> **Errata de la filmina.** Verificado sobre la página renderizada a 200 dpi —no es un artefacto de `pdftotext`, el texto extraído dice lo mismo—: esta frase es **matemáticamente imprecisa**. Un polinomio de grado $d$ tiene $d+1$ coeficientes ($a_d, a_{d-1}, \dots, a_0$) y hacen falta $d+1$ puntos, no $d$, para determinarlo unívocamente — es la base de la interpolación de Lagrange que usa la propia filmina 25, la lámina inmediatamente siguiente. La misma filmina 24 escribe la construcción como $P(x) = a_t x^t + \dots + a_1 x + a_0$, que tiene $t+1$ coeficientes, y sin embargo dice que **$t$ puntos** alcanzan. El ejemplo desarrollado (filmina 26) resuelve la ambigüedad en la práctica: con umbral $t=3$ se usa un polinomio de **grado 2** —tres coeficientes, $a_2, a_1, a_0$— y hacen falta exactamente **3** puntos. La relación correcta, la que efectivamente usa el ejemplo, es $\text{grado} = t-1$, y por lo tanto **$t$ puntos determinan un polinomio de grado $t-1$**, no de grado $t$. Conviene memorizar la relación del ejemplo, no la frase de la filmina 24.

**Construcción**, ya con la relación correcta ($P$ de grado $t-1$):

$$P(x) = a_{t-1}x^{t-1} + a_{t-2}x^{t-2} + \cdots + a_1 x + a_0 \pmod p$$

con $s$ el secreto a compartir, $p$ un primo tal que $p > s$ y $p > n$ (para que cada sombra y el secreto quepan sin ambigüedad módulo $p$, y para que haya suficientes puntos de evaluación distintos), y $a_0 := s$ — el término independiente **es** el secreto, por definición. Las **sombras** son las evaluaciones

$$P(1),\ P(2),\ \dots,\ P(n)$$

## Reconstrucción por interpolación de Lagrange

*Filmina 25.* Con $t$ sombras cualesquiera $(i_a, s_{i_a})_{a=1}^{t}$:

$$P(x) = \sum_{a=1}^{t} s_{i_a} \prod_{\substack{b=1\\ b \ne a}}^{t} \frac{x - i_b}{i_a - i_b} \pmod p$$

> **Errata de la filmina.** El índice de exclusión del producto está escrito, en la filmina, como $b \ne s$ — verificado con zoom sobre la página renderizada, no es un artefacto de extracción. Esa $s$ no está definida en ningún otro lugar de la fórmula: sólo aparecen $t$, los índices $a$ y $b$, y las posiciones $i_a, i_b$. Es casi con certeza un desliz de tipeo por el índice $a$ del sumatorio exterior — la interpolación de Lagrange excluye por definición el término $b=a$. Arriba va con la exclusión correcta, $b \ne a$.

Evaluando en $x=0$ se obtiene directamente el secreto, $P(0) = s$, porque $a_0 = s$ por construcción. Todas las operaciones —restas, productos, la división— se hacen módulo $p$, usando el [[inverso-modular|inverso modular]] donde haga falta dividir.

**Por qué $t-1$ sombras no dan ninguna información.** Con menos de $t$ puntos, el sistema de ecuaciones que determina los $t$ coeficientes de $P$ queda subdeterminado: para **cualquier** valor candidato del secreto $s' \in \mathbb{Z}_p$ existe un polinomio de grado $t-1$ que pasa exactamente por esas $t-1$ sombras y tiene $a_0 = s'$ — de hecho, exactamente uno, por el mismo argumento de interpolación. Ningún valor de $s'$ es más consistente que otro con lo que $t-1$ sombras muestran, así que no filtran nada — es la propiedad de **secreto perfecto** del esquema, en el mismo sentido en que la Clase 01 define [[secreto-perfecto|secreto perfecto]] para el One Time Pad: la distribución del secreto, condicionada a lo que el atacante ve, no cambia. *(La conexión explícita con el secreto perfecto de la Clase 01 es lectura nuestra; el deck no la hace.)*

## El ejemplo, rehecho y verificado con puntos propios

*Filmina 26.* Secreto $s = 7$, esquema $(3,5)$ — es decir, $t=3$, $n=5$ —, con $P(x) = 5x^2 + 3x + 7 \pmod{11}$ (grado $t-1=2$, tres coeficientes: coincide con la corrección de arriba).

$$\begin{aligned}
P(1) &= 5+3+7 = 15 \equiv 4\\
P(2) &= 20+6+7 = 33 \equiv 0\\
P(3) &= 45+9+7 = 61 \equiv 6\\
P(4) &= 80+12+7 = 99 \equiv \mathbf{0}\\
P(5) &= 125+15+7 = 147 \equiv 4
\end{aligned} \pmod{11}$$

> **Errata de la filmina.** El PDF escribe *"P(4) = 80 + 12 + 7 mod 11 = 2"* — verificado sobre la página renderizada, no es un artefacto de extracción. La cuenta está mal: $80+12+7 = 99$, y $99 = 9 \times 11$, así que $99 \equiv 0 \pmod{11}$, no $2$. La sombra correcta es $(4,0)$, no $(4,2)$. Que coincida con la sombra $(2,0)$ no es indicio de otro error: un polinomio de grado 2 puede anularse en dos puntos distintos de $\mathbb{Z}_{11}$ sin ningún problema.

**Reconstrucción independiente, con las sombras $(1,4), (3,6), (5,4)$** — un subconjunto que **no** toca la sombra corregida, para verificar el esquema por un camino distinto del que usa la propia filmina 27:

$$L_1(0) = \frac{(0-3)(0-5)}{(1-3)(1-5)} = \frac{15}{8} \equiv 4 \cdot 8^{-1} \equiv 4\cdot 7 \equiv 28 \equiv 6 \pmod{11}$$
$$L_2(0) = \frac{(0-1)(0-5)}{(3-1)(3-5)} = \frac{5}{-4} \equiv 5\cdot 7^{-1} \equiv 5\cdot 8 \equiv 40 \equiv 7 \pmod{11}$$
$$L_3(0) = \frac{(0-1)(0-3)}{(5-1)(5-3)} = \frac{3}{8} \equiv 3\cdot 8^{-1} \equiv 3\cdot 7 \equiv 21 \equiv 10 \pmod{11}$$

*(usando $8^{-1} \equiv 7$ porque $8\cdot 7 = 56 \equiv 1$, y $7^{-1}\equiv 8$ por la misma igualdad leída al revés — ver [[inverso-modular|Inverso modular]].)*

$$P(0) = 4\cdot 6 + 6\cdot 7 + 4\cdot 10 = 24+42+40 = 106 \equiv 7 \pmod{11} \quad\checkmark$$

**Da 7**, el secreto original — confirmado por un camino de cálculo independiente del que trae la filmina.

### La invitación de la propia filmina, y por qué exhibe la errata

La filmina 27 invita a *"intentar con $(1,4), (3,6), (4,2)$"* — usando la sombra **tal como está escrita**, con el error. Repitiendo la interpolación:

$$L_1(0) = \frac{(0-3)(0-4)}{(1-3)(1-4)} = \frac{12}{6} = 2, \qquad L_2(0) = \frac{(0-1)(0-4)}{(3-1)(3-4)} = \frac{4}{-2} \equiv -2 \equiv 9, \qquad L_3(0) = \frac{(0-1)(0-3)}{(4-1)(4-3)} = \frac{3}{3} = 1 \pmod{11}$$

$$P(0) = 4\cdot 2 + 6\cdot 9 + 2\cdot 1 = 8+54+2 = 64 \equiv 9 \pmod{11}$$

**No da 7.** Repitiendo con la sombra **corregida**, $(4,0)$ en vez de $(4,2)$ — los coeficientes $L_1(0)=2$ y $L_2(0)=9$ no cambian, porque sólo dependen de las posiciones, no de los valores—:

$$P(0) = 4\cdot 2 + 6\cdot 9 + 0\cdot 1 = 8+54+0 = 62 \equiv 7 \pmod{11} \quad\checkmark$$

**Sí da 7.** Las dos reconstrucciones —la de $(1,4),(3,6),(5,4)$ de más arriba y ésta con la sombra corregida— confirman, por dos caminos que no comparten ningún punto en común salvo el $(1,4)$ y el $(3,6)$, que el secreto es $7$ y que el único valor erróneo en todo el ejemplo de la cátedra es el $2$ de la filmina 26.

## Cruce con un ejercicio de parcial ya documentado

El vault ya tiene un ejercicio de Shamir resuelto en [[parciales-viejos#Los ejercicios de Shamir, de la Guía 6|parciales-viejos.md]]: un esquema $(2,3) \bmod 11$ con **cuatro** sombras, una de ellas impostora. Usa la misma mecánica de fondo —evaluar y reconstruir un polinomio en $\mathbb{Z}_{11}$— pero con umbral $t=2$: ahí $P$ es de **grado 1** (una recta, no una parábola), así que alcanza con tomar dos puntos, construir la recta, y ver cuál de las sombras restantes **no** cae en ella, en vez de reconstruir con Lagrange sobre tres puntos como acá. Esa nota registra, además, que la resolución manuscrita que documenta comete su **propio** error de aritmética modular — un patrón de arrastre parecido, en espíritu, al $2$ en vez de $0$ de esta filmina.

## Ver también

- [[clase-06-politicas-de-seguridad-y-control-de-acceso#13. Secretos compartidos y método de Shamir|Clase 06 — Secretos compartidos y método de Shamir]]
- [[listas-de-capacidades|Listas de capacidades]] — la sección inmediatamente anterior; Shamir es, en la clase, un método más de separación de privilegios sobre capacidades
- [[acls-propagables|ACLs propagables]] — la sección inmediatamente siguiente
- [[inverso-modular|Inverso modular]] — el cálculo que hace posible dividir dentro de $\mathbb{Z}_{11}$ en toda la interpolación de Lagrange
- [[secreto-perfecto|Secreto perfecto]] — el sentido en que $t-1$ sombras no filtran ninguna información sobre el secreto
- [[parciales-viejos#Los ejercicios de Shamir, de la Guía 6|Ejercicios de Shamir, Guía 6]] — otro esquema resuelto, con umbral $t=2$ y su propio error documentado
- Adi Shamir, *"How to Share a Secret"* (Communications of the ACM, 1979) — el paper original del método, no citado por número en el deck
