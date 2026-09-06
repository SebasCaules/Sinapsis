---
title: Cuerpos finitos y campos de Galois
resumen: 'Estructura algebraica sobre la que opera la criptografía: qué es un cuerpo, por qué los enteros módulo n solo forman uno cuando n es primo, existencia y unicidad de los campos de Galois, grupos cíclicos y generadores.'
fuentes: ["[[clase-02-cifrado]]", "[[cuerpos-finitos]]", "[[aritmetica-modular-y-divisibilidad]]"]
aliases: [Cuerpos finitos y campos de Galois, Cuerpo finito, Campo de Galois, Campos de Galois, GF(2^m), Estructura de cuerpo, Grupo cíclico, Elemento primitivo, Función de Euler, Orden de un elemento]
type: concepto
unidad: 1
clase: 2
orden: 16
created: 2026-08-24
updated: 2026-09-04
tags: [criptografia, algebra, cuerpos-finitos, campos-de-galois, grupos-ciclicos, generadores, funcion-de-euler, elemento-primitivo, gf28, zp, clase-02]
sources: ["Cuerpos Finitos - ITBA 2021(1).pdf", Clase 02 - Criptografia - Cifrado.pdf, "Clase 02pt1-Transcripcion.VTT"]
---

# Cuerpos finitos y campos de Galois

Esta nota trae **por qué la criptografía hace las cuentas en conjuntos raros y no en los enteros de siempre**: qué es un cuerpo, por qué $\mathbb{Z}_n$ sólo lo es cuando $n$ es primo, y por qué existe un cuerpo de $4$ elementos aunque $\mathbb{Z}_4$ **no** lo sea. Es la nota que le pone nombre al terreno sobre el que ya se venía operando sin saberlo desde el [[cifrado-por-rotacion|cifrado por rotación]].

> **Esta nota está mejor anclada que sus hermanas de teoría de números.** Las notas [[aritmetica-modular-y-divisibilidad|02.13]], [[algoritmo-de-euclides-extendido|02.14]] y [[inverso-modular|02.15]] se ubican en la Clase 2 sólo porque el docente dejó el tema como tarea al cerrarla (ver [[#Sobre la numeración de esta nota|abajo]]). Ésta, en cambio, tiene el vínculo en el **contenido mismo de las filminas**: la tabla de etapas de [[aes|AES]] dice que `Byte Sub` es *"una tabla derivada de invertir en el campo $\mathrm{GF}(2^{8})$"*. O sea que la Clase 2 **usa** un cuerpo finito, con nombre y apellido, cuatro filminas antes de terminar. Lo que falta acá no es la conexión: es la definición de qué es ese objeto.

**Qué hay acá y qué no.** Esta nota es la versión atómica y reusable, y es el **único lugar del vault donde estas definiciones y teoremas están desarrollados**: qué es un cuerpo, existencia y unicidad, orden, exponente, grupo cíclico, generador y $\varphi$. El recorrido completo del PDF de la cátedra —tablas de operación, ejemplos numéricos verificados, erratas del original marcadas una por una— vive en el apunte [[cuerpos-finitos|Cuerpos finitos]], que para la teoría remite acá. Para estudiar de la fuente, conviene ir para allá; para linkear el concepto desde otra nota, conviene enlazar ésta.

---

## Estructura de cuerpo

Un conjunto $F$ con dos operaciones $\oplus$ y $\odot$ tiene **estructura de cuerpo** si se cumplen tres cosas, y conviene memorizarlas con esta forma —**dos grupos pegados por la distributiva**— antes que como una lista de nueve axiomas sueltos:

$$\begin{aligned}
&\textbf{(1)} && (F,\ \oplus) && \text{es grupo} \\
&\textbf{(2)} && (F \setminus \{e_{\oplus}\},\ \odot) && \text{es grupo} \\
&\textbf{(3)} && a \odot (b \oplus c) \;=\; (a \odot b) \oplus (a \odot c) && \text{distributiva}
\end{aligned}$$

Desplegado, "ser grupo" son cuatro propiedades por operación:

| Propiedad | En $\oplus$ | En $\odot$ |
|---|---|---|
| **Cerrada** | $a \oplus b \in F$ | $a \odot b \in F$ |
| **Asociativa** | $(a \oplus b) \oplus c = a \oplus (b \oplus c)$ | $(a \odot b) \odot c = a \odot (b \odot c)$ |
| **Neutro** | $\exists\, e_{\oplus}\ \forall a:\ e_{\oplus} \oplus a = a$ | $\exists\, e_{\odot}\ \forall a:\ e_{\odot} \odot a = a$ |
| **Inverso** | $\forall x\ \exists\, x':\ x \oplus x' = e_{\oplus}$ | $\forall a \in F \setminus \{e_{\oplus}\}\ \exists\, a^{-1}:\ a \odot a^{-1} = e_{\odot}$ |

### El detalle que decide todo: el 0 queda afuera del segundo grupo

La asimetría entre las dos columnas **no es un descuido de la definición**: el neutro aditivo $e_{\oplus}$ (el $0$) está excluido del grupo multiplicativo. Si el $0$ tuviera inverso, de $0 \odot a = 0$ saldría $1 = 0$ y el cuerpo se derrumbaría a un solo elemento.

De acá sale la heurística práctica: **cuando haya que refutar que algo es cuerpo, conviene apuntar al inverso multiplicativo.** Es la única propiedad que exige algo *distinto para cada elemento*; las otras son verificaciones globales que casi siempre salen gratis.

> **Precisión nuestra:** la fuente lista sólo cerrada, asociativa, neutro e inverso. La definición estándar de cuerpo pide además que **las dos operaciones sean conmutativas** (si no, lo que queda es un *anillo con división*). En todos los ejemplos del curso —$\mathbb{Z}_p$ y $\mathrm{GF}(2^{m})$— la conmutatividad se cumple, así que la omisión no cambia ninguna cuenta; **la anotamos para que no la memorices de menos.**

### Nomenclatura

- Si $F$ es **finito**, al cuerpo finito $(F, \oplus, \odot)$ también se lo llama **campo**. En este curso *cuerpo finito* y *campo* son sinónimos.
- Se denota $\mathbb{F}_q$ al cuerpo finito con $q$ elementos.
- $\mathrm{GF}$ es *Galois Field*: **campo de Galois** — un campo, no un grupo. *(La fuente lo escribe mal una vez; la errata está registrada en el [[cuerpos-finitos|apunte]].)*

---

## Cuándo Z_n es un cuerpo (y cuándo no)

$$\text{Si } p \text{ es primo, } \quad \mathbb{Z}_p = \{0, 1, \ldots, p-1\} \quad \text{es un cuerpo de } p \text{ elementos.}$$

Y si $n$ es compuesto, **no lo es**. La demostración no hace falta buscarla lejos: es exactamente el criterio de inversibilidad de la nota de [[inverso-modular|inverso modular]], leído en cadena.

$$\mathbb{Z}_n \text{ es cuerpo}
\;\iff\;
\text{todo } a \not\equiv 0 \text{ es inversible}
\;\iff\;
\varphi(n) = n-1
\;\iff\;
n \text{ es primo}
\qquad (n \ge 2)$$

Renglón por renglón:

1. **Primera equivalencia — es la definición.** Las otras ocho propiedades valen en cualquier $\mathbb{Z}_n$; lo único que puede fallar es el inverso multiplicativo. Ser cuerpo se reduce a que **ninguna clase no nula se quede sin inverso**.
2. **Segunda — es el criterio de Bézout.** $a$ es inversible módulo $n$ si y sólo si $\operatorname{mcd}(a, n) = 1$, y $\varphi(n)$ cuenta justamente cuántos coprimos con $n$ hay en $1 \le k \le n$. Pedir que las $n-1$ clases no nulas sean todas inversibles es pedir $\varphi(n) = n-1$.
3. **Tercera — es la definición de primo.** Que todo $k < n$ sea coprimo con $n$ es exactamente que $n$ no tenga divisores propios.

**La misma cadena, leída al revés, dice dónde se rompe:** si $n$ es compuesto, existe $a$ con $1 < \operatorname{mcd}(a, n) < n$; ese $a$ no tiene inverso, y encima es **divisor de cero** ($a \odot b = 0$ con $a, b \ne 0$), así que $\mathbb{Z}_n \setminus \{0\}$ ni siquiera es **cerrado** bajo el producto. Falla la primera propiedad de la lista, no sólo la última.

### El contraejemplo canónico: Z_4

Con $n = 4$, el elemento que rompe todo es el $2$. La fila del $2$ en la tabla del producto de $\mathbb{Z}_4$ es

$$2 \cdot 1 = 2, \qquad 2 \cdot 2 = 0, \qquad 2 \cdot 3 = 2$$

y **el $1$ no aparece**: ningún elemento multiplicado por $2$ da $1$, o sea $2^{-1}$ no existe. El $2 \cdot 2 = 0$ del medio es la causa: si existiera $a$ con $2a = 1$, entonces $0 = (2 \cdot 2)a = 2(2a) = 2$, absurdo. **Un divisor de cero nunca puede ser inversible.**

### La distinción central de esta nota

Acá es donde casi todo el mundo se equivoca, así que va aparte y en dos renglones:

| Afirmación | Valor |
|---|---|
| *"$\mathbb{Z}_4$ es un cuerpo"* | **Falso** |
| *"existe un cuerpo de $4$ elementos"* | **Verdadero** |

Las dos frases suenan a lo mismo y no lo son. El cuerpo de $4$ elementos **existe**, es único, y es $\mathrm{GF}(2^{2})$, cuyos elementos son

$$\mathrm{GF}(2^{2}) = \{\,0,\ 1,\ x,\ x+1\,\}$$

es decir **polinomios de grado menor que $2$ con coeficientes en $\{0,1\}$**: se suman coeficiente a coeficiente módulo $2$ (o sea, **xor**) y se multiplican como polinomios reduciendo con $x^{2} = x+1$. Ahí sí todo elemento no nulo tiene inverso:

$$1^{-1} = 1, \qquad x^{-1} = x+1, \qquad (x+1)^{-1} = x$$

> **Lo que falla en $\mathbb{Z}_4$ no es la cardinalidad, es el candidato.** *(Lectura nuestra; la fuente exhibe los dos objetos sin comparar sus estructuras.)* Los dos conjuntos tienen $4$ elementos, pero **la suma es distinta**: en $\mathbb{Z}_4$ vale $1+1 = 2 \ne 0$, mientras que en $\mathrm{GF}(2^{2})$ todo elemento sumado consigo mismo da $0$, porque la suma es xor. Son $\mathbb{Z}_4$ contra $\mathbb{Z}_2 \times \mathbb{Z}_2$: dos estructuras aditivas diferentes sobre conjuntos del mismo tamaño. **La cantidad de elementos no determina la estructura**, y el teorema de la sección siguiente dice que de las dos hay exactamente una que alcanza a ser cuerpo.

Las tablas completas de $\mathrm{GF}(2^{2})$ y la lectura detallada de las de $\mathbb{Z}_4$ y $\mathbb{Z}_7$ están en el [[cuerpos-finitos|apunte]], con las erratas del PDF marcadas.

---

## Teorema de existencia y unicidad

> **Teorema.** Para todo primo $p$ y todo natural $m$ existe un cuerpo finito con $p^{m}$ elementos. Tal cuerpo es **único salvo isomorfismos**.

Tres cosas que hay que leer juntas, porque separadas confunden:

- **La demostración es constructiva.** No dice sólo *"existe"*: explica cómo generar el cuerpo. Hay una construcción canónica, y todo cuerpo de $p^{m}$ elementos es isomorfo a ella.
- **Si $q = p$ es primo**, $\mathbb{Z}_p$ es isomorfo a esa construcción. Por eso $\mathbb{Z}_p$ es cuerpo.
- **Si $q$ no es primo**, $\mathbb{Z}_q$ **no** es isomorfo a esa construcción. Por eso $\mathbb{Z}_q$ no es cuerpo.

**Corolario que conviene tener en la punta de la lengua: la cardinalidad de un cuerpo finito es siempre una potencia de primo.** No existe cuerpo de $6$, ni de $10$, ni de $12$ elementos. Y a la inversa: si el tamaño es potencia de primo, el cuerpo existe, aunque el candidato obvio $\mathbb{Z}_q$ no sirva.

> **La unicidad va en la dirección contraria a la intuición.** *(Lectura nuestra.)* Como el cuerpo de $4$ elementos es único y $\mathbb{Z}_4$ no es cuerpo, el cuerpo de $4$ elementos **tiene que ser otra cosa**: otro conjunto, u otras operaciones sobre uno del mismo tamaño. El teorema no promete que el cuerpo de $q$ elementos sea $\mathbb{Z}_q$ — promete que hay uno solo, y a veces ese uno no es el que uno esperaba.

---

## Los dos cuerpos que usa la criptografía

La fuente lo despacha en dos renglones, pero es el renglón que explica por qué todo lo anterior está en una materia de criptografía:

| Tipo | Notación | Cardinalidad | Dónde se cobra |
|---|---|---|---|
| **Cuerpos binarios** | $\mathbb{F}_{2^{m}}$, o $\mathrm{GF}(2^{m})$ | $2^{m}$ | [[aes\|AES]] opera sobre $\mathrm{GF}(2^{8})$ |
| **Cuerpos $\mathbb{Z}_p$**, con $p$ primo **habitualmente muy grande** | $\mathbb{F}_p$ | $p$ | criptografía asimétrica *(inferencia nuestra en cuanto al destino: la fuente dice "muy grande" y no nombra ninguna clase)* |

### Por qué AES trabaja en GF(2^8) y no en Z_256

Un byte tiene $256$ valores y sería cómodo operarlo como $\mathbb{Z}_{256}$. **No se puede**, y la razón es literalmente la de $\mathbb{Z}_4$ con $m = 8$ en lugar de $m = 2$: $256 = 2^{8}$ no es primo, así que $\mathbb{Z}_{256}$ tiene divisores de cero y **ningún byte par tiene inverso**.

Pero el byte es la unidad natural de cualquier implementación, así que el cuerpo de $256$ elementos se quiere igual — y el teorema dice que **existe exactamente uno**: $\mathrm{GF}(2^{8})$. Cada byte se lee como un polinomio de grado $< 8$ sobre $\mathbb{Z}_2$, la suma es **xor** (gratis en hardware) y el producto se reduce módulo un polinomio irreducible fijo.

> **Ahí es donde el álgebra se vuelve la Clase 2.** El paso `Byte Sub` de AES es **la inversión multiplicativa en $\mathrm{GF}(2^{8})$**, seguida de una transformación afín; la caja $S$ es la tabla precalculada de esa composición. Esa inversión existe **sólo porque $\mathrm{GF}(2^{8})$ es un cuerpo**: si AES trabajara módulo $256$, la mitad de los bytes se quedaría sin inverso y la caja $S$ no podría definirse. *(Que el requisito de cuerpo sea la razón del diseño es lectura nuestra; la filmina enuncia la inversión sin justificarla.)*
>
> Y esto explica de paso por qué `Byte Sub` es la **única etapa no lineal** de AES: `Shift Row`, `Mix Column` y `Add Round Key` son operaciones lineales sobre el campo, y $a \mapsto a^{-1}$ no lo es. Toda la resistencia al criptoanálisis lineal y diferencial que [[des-y-3des|DES]] confiaba a unas cajas $S$ sin estructura publicada, AES la apoya en un objeto algebraico que cualquiera puede auditar. Es el [[principio-de-kerckhoffs|principio de Kerckhoffs]] aplicado al diseño interno de la primitiva.

---

## Grupos cíclicos, orden y generadores

Toda la sección vive dentro del **grupo multiplicativo** de un cuerpo, es decir $(F \setminus \{0\}, \cdot)$.

### Orden de un elemento

$$\operatorname{Ord}(x) \;=\; \min\{\, n \in \mathbb{N} \;:\; x^{n} = e \,\}$$

donde $x^{n} = x \cdot x \cdots x$ ($n$ veces) y $e$ es el neutro **de la operación que estés mirando**. El orden no es una propiedad del elemento a secas: es del par (elemento, operación). En $(\mathbb{Z}_p, +)$ con $p$ primo, por ejemplo, todos los elementos no nulos tienen orden $p$; en $(\mathbb{Z}_p \setminus \{0\}, \cdot)$ los órdenes son variados, que es justamente lo que hace interesante al segundo.

### Orden de un grupo (exponente)

$$\operatorname{Exp}(G) \;=\; \operatorname{mcm}\{\operatorname{ord}(x) \;:\; x \in G\}$$

> **Cuidado con esta palabra.** La fuente llama *"orden de un grupo"* al **mcm de los órdenes de sus elementos**, y aclara entre paréntesis que eso es el **exponente**. En la mayoría de los textos *orden de un grupo* significa otra cosa: la **cantidad de elementos**, $\lvert G \rvert$. Las dos nociones coinciden en los grupos cíclicos —el caso que interesa acá— pero no en general: $\mathbb{Z}_2 \times \mathbb{Z}_2$ tiene $4$ elementos y exponente $2$. Cuando aparezca *"orden del grupo"* en este bloque, se lee **exponente**, o la definición de cíclico no cierra.

### Grupo cíclico

> Si un grupo de $q$ elementos tiene orden (exponente) $q$, se dice **cíclico de orden $q$**.
>
> **Para todo $p$ primo, $(\mathbb{Z}_p \setminus \{0\}, \cdot)$ es cíclico de orden $p-1$.**

O sea: **cíclico $\iff$ el exponente iguala a la cantidad de elementos.** *(Lectura nuestra: el criterio funciona porque estos grupos son abelianos — en un grupo abeliano finito, exponente $=$ cardinal si y sólo si el grupo es cíclico. Ésa es la razón por la que la fuente puede usar el exponente como test.)*

### Generador o elemento primitivo

$$\langle x \rangle \;=\; \{\, x^{n} \;:\; n \in \mathbb{Z} \,\}, \qquad \#\langle x\rangle = \operatorname{ord}(x)$$

Si $\langle x \rangle = G$, entonces **$x$ genera $G$** y se lo llama **generador** o **elemento primitivo**. Combinando con la igualdad de la derecha:

$$x \text{ genera } G \iff \operatorname{ord}(x) = \lvert G \rvert$$

que es el criterio operativo: **se calculan órdenes y los generadores se leen de la tabla.**

### El ejemplo completo: Z_7 sin el 0, con el producto

| $x$ | $\operatorname{ord}(x)$ | Verificación | $\langle x \rangle$ | ¿Genera? |
|---|---|---|---|---|
| $1$ | $1$ | $1^{1} = 1$ | $\{1\}$ | No |
| $2$ | $3$ | $2^{3} = 8 \equiv 1$ | $\{1,2,4\}$ | No |
| $3$ | $6$ | $3^{6} = 729 \equiv 1$ | $\{3,2,6,4,5,1\}$ | **Sí** |
| $4$ | $3$ | $4^{3} = 64 \equiv 1$ | $\{1,4,2\}$ | No |
| $5$ | $6$ | $5^{6} \equiv 1$ | $\{5,4,6,2,3,1\}$ | **Sí** |
| $6$ | $2$ | $6^{2} = 36 \equiv 1$ | $\{1,6\}$ | No |

$$\operatorname{Exp}(G) = \operatorname{mcm}(1,2,3,6) = 6 = \lvert G \rvert \;\Longrightarrow\; \text{cíclico}$$

Las potencias sucesivas de los dos generadores, que es donde se ve que **barren el grupo entero** antes de volver al $1$:

| $n$ | $1$ | $2$ | $3$ | $4$ | $5$ | $6$ |
|---|---|---|---|---|---|---|
| $3^{n} \bmod 7$ | $3$ | $2$ | $6$ | $4$ | $5$ | $1$ |
| $5^{n} \bmod 7$ | $5$ | $4$ | $6$ | $2$ | $3$ | $1$ |

> **Control de la cuenta, gratis** *(observación nuestra; la fuente no lo menciona)*: los órdenes que salieron son $1, 2, 3, 6$, exactamente los **divisores de $6 = \lvert G \rvert$**. Eso es el teorema de Lagrange. Si en un ejercicio te da un orden que no divide al cardinal del grupo, **la cuenta está mal** — no sigas.

---

## Función phi de Euler

> $\varphi(n)$ indica el **número de enteros coprimos con $n$** en el rango $1 \le k \le n$.

*(La acotación del rango es precisión nuestra: la fuente no lo explicita, y sin rango la cuenta sería infinita.)*

| Propiedad | Enunciado |
|---|---|
| $p$ primo | $\varphi(p) = p - 1$ |
| $p$ primo, $r$ natural | $\varphi(p^{r}) = p^{r-1}(p-1)$ |
| $n = p \cdot q$, con $p$ y $q$ **coprimos entre sí** | $\varphi(n) = \varphi(p)\,\varphi(q)$ |

**La advertencia que importa:** $\varphi(n)$ es sencilla de calcular **sólo si $n$ está factorizado**. Las tres propiedades de arriba son recetas que presuponen conocer los factores primos; sin la factorización no hay atajo conocido.

### Cuántos generadores hay

| Grupo | Cantidad de generadores, según la fuente |
|---|---|
| Grupo multiplicativo de $\mathrm{GF}(2^{n})$ | $\dfrac{\varphi(2^{n} - 1)}{n}$ |
| $(\mathbb{Z}_p \setminus \{0\}, \cdot)$, con $p$ primo | $\varphi(p-1)$ |

Y el ejemplo cierra el círculo con la tabla de arriba: para $(\mathbb{Z}_7 \setminus \{0\}, \cdot)$,

$$\varphi(p-1) = \varphi(6) = \varphi(2)\,\varphi(3) = 1 \cdot 2 = 2$$

que son **exactamente los dos generadores que encontramos a mano**, el $3$ y el $5$.

> **La primera fila tiene una discrepancia y no la damos por resuelta.** Por el mismo argumento que la segunda, el grupo multiplicativo de $\mathrm{GF}(2^{n})$ —que también es cíclico, de cardinal $2^{n}-1$— debería tener $\varphi(2^{n}-1)$ generadores, **sin dividir por $n$**. Lo que $\varphi(2^{n}-1)/n$ cuenta es una cosa relacionada pero distinta: los **polinomios primitivos de grado $n$**. El análisis completo, con la verificación numérica en $\mathrm{GF}(2^{2})$ y en el $\mathrm{GF}(2^{8})$ de AES, está en el [[cuerpos-finitos|apunte]]. Queda anotado como **punto a chequear con la cátedra**, no como errata: la fuente remite esa fórmula a un apunte de campos de Galois que **no está en el vault**.

---

## El cierre: encontrar un generador es difícil

> **No se conoce ningún algoritmo eficiente para el cálculo de un elemento primitivo, ni siquiera en el caso de los cuerpos $\mathbb{F}_p$ con $p$ primo.**

Es la última línea de la fuente, y la más importante de las cuatro páginas. Nótese la asimetría que deja planteada: en $(\mathbb{Z}_7 \setminus \{0\}, \cdot)$ **sabemos cuántos** generadores hay antes de buscar ninguno —$\varphi(6) = 2$— y aun así **encontrarlos** obliga a probar. Con $p$ de tres bits eso es trivial; con el $p$ *"habitualmente muy grande"* de la sección anterior, deja de serlo.

### Por qué ésa es la forma de toda la criptografía asimétrica (lectura nuestra)

> Lo que sigue **no está en la fuente**, que corta en la línea de arriba sin sacar conclusiones.

Nótese el patrón, el mismo que se verá en la **Clase 4 — Criptografía Asimétrica (10/09)** del [[cronograma]]:

| Operación en $(\mathbb{Z}_p \setminus \{0\}, \cdot)$ | Costo |
|---|---|
| Dados $g$ y $n$, calcular $g^{n}$ | **barato** — exponenciación rápida, $O(\log n)$ multiplicaciones |
| Dados $g$ y $g^{n}$, recuperar $n$ | **caro** — es el problema del logaritmo discreto |
| Verificar si un $g$ dado es generador (con $p-1$ factorizado) | **barato** |
| Encontrar un generador sin más datos | **caro**, según la línea de arriba |
| Calcular $\varphi(n)$ sin la factorización de $n$ | **caro**, según la sección anterior |

**Ese contraste entre las filas baratas y las caras es el molde entero de la criptografía de clave pública**: se elige una operación fácil de hacer y difícil de deshacer, se publica el resultado y se guarda la entrada. La clave pública es lo barato; la privada es lo que haría falta invertir. Por eso este bloque de álgebra, que parece suelto, es en realidad el **prerrequisito de la Clase 4**: sin cuerpos finitos, grupos cíclicos y $\varphi$ no hay dónde plantar esos problemas duros.

Y es la misma lógica —distinta escala— que la [[seguridad-computacional|seguridad computacional]] de la Clase 2: nada de esto es **imposible**, es **caro**. Salvo que acá la dureza no se pide sobre una construcción que armamos nosotros, sino sobre un objeto matemático que existía de antes.

> **Dos precisiones para no memorizar de más** *(nuestras).*
> - Lo que sostiene los esquemas concretos (Diffie-Hellman, ElGamal, DSA) es el **logaritmo discreto**, no la búsqueda de generadores. La fuente **no nombra el logaritmo discreto en ninguna parte**; es tema de la Clase 4, todavía pendiente de ingerir.
> - En la práctica el problema del generador **se esquiva**: quien elige el primo lo construye a medida y conoce la factorización de $p-1$, con lo cual testear candidatos es barato; y como hay $\varphi(p-1)$ generadores entre $p-1$ elementos, sorteando al azar se acierta rápido. La afirmación de la fuente se entiende como *"sin conocer la factorización de $p-1$"*; la fuente no hace esa salvedad.

---

## Sobre la numeración de esta nota

> **Por qué esta nota es `02.16` y no una nota de la Clase 4** *(lectura nuestra; la ubicación es una decisión del vault, no de la cátedra).*
>
> - El **programa oficial** ([[programa-y-objetivos|nota]], [PDF](../../raw/material_Catedra/72.44%20-%20Criptograf%C3%ADa%20y%20Seguridad.pdf)) **no menciona teoría de números ni cuerpos finitos en ninguna unidad**: no hay atribución oficial de clase para este bloque.
> - La única fuente que lo asigna es la [transcripción de la Clase 2](../../raw/clases/Clase%2002pt1-Transcripcion.VTT), donde el docente cierra la clase dejando el tema como tarea explícita —los videos de Euclides extendido y ecuación diofántica— y avisa que *"eso le va a servir para el parcial"*.
> - La convención del vault ([[indice#Convenciones|sección "Convenciones"]]) dice que los conceptos que salen de la práctica o de la guía **continúan el contador** después de los de teoría. De ahí: unidad $1$, clase $2$, orden $16$, siguiendo a [[aritmetica-modular-y-divisibilidad|02.13]], [[algoritmo-de-euclides-extendido|02.14]] y [[inverso-modular|02.15]].
> - **Ésta tiene además un anclaje que las otras tres no tienen:** el $\mathrm{GF}(2^{8})$ de `Byte Sub` está en las filminas de la Clase 2, no sólo en la transcripción. Es el argumento más fuerte del bloque para quedarse acá.
> - **Si la cátedra lo introduce formalmente en la Clase 4** (Criptografía Asimétrica, 10/09), habrá que **renumerar** el bloque `02.13`–`02.16` como `04.xx`. Lo dejamos dicho para que el cambio sea barato: son cuatro archivos, sus campos de frontmatter y los links entrantes desde [[cuerpos-finitos|Cuerpos finitos]], [[teoria-de-numeros|Teoría de números]] y el [[indice|índice]].

---

## Ver también

- [[cuerpos-finitos|Cuerpos finitos]] — el apunte hermano: el recorrido completo del PDF de Arias Roig, con las tablas de $\mathbb{Z}_7$, $\mathbb{Z}_4$ y $\mathrm{GF}(2^{2})$, los ejemplos verificados y las erratas del original marcadas
- [[aes|AES]] — dónde se cobra todo esto: `Byte Sub` es la **inversión multiplicativa en $\mathrm{GF}(2^{8})$**
- [[inverso-modular|Inverso modular]] — el criterio $\operatorname{mcd}(a,n) = 1$ del que sale, entero, el *"$\mathbb{Z}_n$ es cuerpo si y sólo si $n$ es primo"*
- [[aritmetica-modular-y-divisibilidad|Aritmética modular y divisibilidad]] — congruencias, clases de equivalencia y $\mathbb{Z}_m$, que es el conjunto sobre el que esta nota pone estructura
- [[algoritmo-de-euclides-extendido|Algoritmo de Euclides extendido]] — cómo se calculan en la práctica los inversos que acá se postulan
- [[teoria-de-numeros|Teoría de números]] — el otro apunte del bloque algebraico
- [[primitiva-de-cifrado-en-bloque|Primitiva de cifrado en bloque]] — el marco donde vive AES
- [[des-y-3des|DES y 3-DES]] — la primitiva anterior, cuyas cajas $S$ **no** tienen estructura algebraica publicada: el contraste con AES es parte del punto
- [[cifrado-por-rotacion|Cifrado por rotación]] — el primer grupo cíclico del curso, $(\mathbb{Z}_n, +)$, aunque ahí no se lo llame así
- [[seguridad-computacional|Seguridad computacional]] — la otra vez que el curso cambia *"imposible"* por *"caro"*
- [[cronograma|Cronograma]] — la **Clase 4 (10/09), Criptografía Asimétrica**, donde esta álgebra se convierte en criptosistemas
