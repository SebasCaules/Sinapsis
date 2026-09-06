---
title: Cuerpos finitos
resumen: 'Lectura del apunte de Arias Roig sobre cuerpos finitos: el recorrido de sus cuatro páginas, las tablas de operación de $\mathbb{Z}_7$, $\mathbb{Z}_4$ y $\mathrm{GF}(2^2)$, las cuentas verificadas y las erratas del original.'
fuentes: ["[[cuerpos-finitos-y-campos-de-galois]]", "[[aritmetica-modular-y-divisibilidad]]", "[[teoria-de-numeros]]"]
aliases: [Cuerpos finitos (apunte), Apunte de cuerpos finitos, Arias Roig — Cuerpos finitos, Tablas de Z7 y Z4]
type: apunte
clase: 2
orden: 30
created: 2026-08-24
updated: 2026-09-04
tags: [apunte, cuerpos-finitos, campos-de-galois, algebra, grupos-ciclicos, funcion-de-euler, elemento-primitivo, gf28, zp]
sources: ["Cuerpos Finitos - ITBA 2021(1).pdf"]
---

# Cuerpos finitos

> **Fuente:** [`Cuerpos Finitos - ITBA 2021(1).pdf`](../../raw/apuntes/Cuerpos%20Finitos%20-%20ITBA%202021%281%29.pdf) (4 páginas) · Lic. Ana María Arias Roig, ITBA · Concepto atómico: [[cuerpos-finitos-y-campos-de-galois|Cuerpos finitos y campos de Galois]]

Esta nota trae **qué dice exactamente el PDF de Arias Roig, con qué ejemplos lo dice y qué hay que corregirle**: el recorrido de las cuatro páginas en orden, las tablas de operación de $\mathbb{Z}_7$, $\mathbb{Z}_4$ y $\mathrm{GF}(2^{2})$, las cuentas verificadas a mano, las erratas del original marcadas una por una, y la lista de lo que la fuente delega a un segundo apunte que el vault no tiene.

> **Cómo se reparte esta nota con la de concepto.** Las **definiciones y los teoremas** —estructura de cuerpo, existencia y unicidad, orden, exponente, grupo cíclico, generador, función $\varphi$— están desarrollados **una sola vez**, en [[cuerpos-finitos-y-campos-de-galois|Cuerpos finitos y campos de Galois]]. Acá no se repiten: cada sección dice qué trae la fuente, linkea el desarrollo y se queda con lo que es propio de **este** PDF. Para estudiar la teoría conviene empezar por el concepto; para leer la fuente, ubicar un ejemplo o chequear una cuenta, esta es la nota indicada.

> **El PDF tiene dos títulos.** La primera línea del cuerpo dice **"CUERPOS FINITOS"**, pero el **título interno del archivo** es **"CAMPOS DE GALOIS GF(2N)"**. El contenido efectivo es el primero: los campos de Galois se **nombran** y se derivan a un segundo apunte que no tenemos (ver [[#10. Lo que el apunte manda a buscar y no está en el vault|abajo]]).

---

## 1. Qué es un cuerpo

El apunte abre definiendo la **estructura de cuerpo** sobre un conjunto $F$ con dos operaciones $\oplus$ y $\odot$, en tres bloques: $(F, \oplus)$ es grupo, $(F - \{e_{\oplus}\}, \odot)$ es grupo, y la distributiva —la única propiedad que **liga** las dos operaciones— cierra la definición. Cada "ser grupo" se despliega en cuatro propiedades: cerrada, asociativa, neutro e inverso.

Los nueve axiomas escritos, la tabla que los ordena por operación, la heurística de por dónde atacar cuando hay que refutar que algo es cuerpo y la precisión sobre la conmutatividad que la fuente omite están en [[cuerpos-finitos-y-campos-de-galois#Estructura de cuerpo|el concepto]].

Lo propio de **esta** fuente son dos cosas:

- **La exclusión del cero, dicha entre paréntesis y sin justificar.** Al enumerar los inversos multiplicativos, el PDF aclara: *"tienen inverso todos, salvo el neutro de $+$"*. Enuncia la exclusión y no dice por qué. *(El argumento de por qué es necesaria —si el $0$ tuviera inverso, de $0 \odot a = 0$ saldría $1 = 0$— es reconstrucción nuestra, y está en el concepto.)*
- **La nomenclatura que después usa sin volver a definir.** Acá fija que, si $F$ es **finito**, al cuerpo $(F, \oplus, \odot)$ también se lo llama **campo**, y que $\mathbb{F}_q$ nota al cuerpo finito con $q$ elementos.

---

## 2. Congruencias y el cuerpo Z_p

Dos enteros $x$ e $y$ son **congruentes módulo $p$** si $p \mid (x - y)$, es decir: si $(x-y)$ es divisible por $p$. Se denota $x \equiv y$.

> **Errata de notación del apunte.** El PDF escribe la condición como $(x-y) \mid p$ —que se lee *"$(x-y)$ divide a $p$"*, la relación **al revés**— y a renglón seguido la explica bien en palabras: *"es decir: $(x-y)$ es divisible por $p$"*. Lo correcto es $p \mid (x-y)$. Que son cosas distintas se ve con $p = 7$, $x = 17$, $y = 3$: acá $x \equiv y$ porque $7 \mid 14$, pero la versión impresa pediría $14 \mid 7$, que es falsa. La intención del apunte es inequívoca; lo que está mal es el símbolo.

Esa relación parte los enteros en **clases de equivalencia**, cada una simbolizada $[x]$ o directamente $x$, y sobre ellas el apunte enuncia —sin demostrarlo— que **$\mathbb{Z}_p$ con $p$ primo es un cuerpo de $p$ elementos**. La cadena de equivalencias que lo demuestra, y que además dice exactamente dónde se rompe cuando el módulo es compuesto, está en [[cuerpos-finitos-y-campos-de-galois|el concepto]]; el andamiaje de congruencias y clases, en [[aritmetica-modular-y-divisibilidad|Aritmética modular y divisibilidad]].

---

## 3. Existencia y unicidad de los cuerpos finitos

El apunte enuncia el **teorema de existencia y unicidad** —para todo primo $p$ y todo natural $m$ hay un cuerpo finito de $p^{m}$ elementos, único salvo isomorfismos— y marca como *importantes* dos consecuencias, que son justamente las que después necesita para el ejemplo de $\mathbb{Z}_4$:

- la demostración **no es sólo existencial**: explica cómo generar el cuerpo, o sea que hay una construcción canónica;
- $\mathbb{Z}_q$ es isomorfo a esa construcción **si y sólo si $q$ es primo** — y de ahí sale, en un renglón, que $\mathbb{Z}_q$ con $q$ compuesto no es cuerpo.

El enunciado desarrollado, el corolario de que todo cuerpo finito tiene cardinal potencia de primo y la lectura de por qué la unicidad va en dirección contraria a la intuición están en [[cuerpos-finitos-y-campos-de-galois#Teorema de existencia y unicidad|el concepto]].

---

## 4. Los ejemplos: Z_7 sí, Z_4 no

Este es el corazón del PDF y la parte que **sólo está acá**: cuatro tablas de operación, con sus erratas.

### 4.1 Z_7 con suma y producto es un cuerpo finito

$$\begin{array}{c|ccccccc}
+ & 0 & 1 & 2 & 3 & 4 & 5 & 6 \\ \hline
0 & 0 & 1 & 2 & 3 & 4 & 5 & 6 \\
1 & 1 & 2 & 3 & 4 & 5 & 6 & 0 \\
2 & 2 & 3 & 4 & 5 & 6 & 0 & 1 \\
3 & 3 & 4 & 5 & 6 & 0 & 1 & 2 \\
4 & 4 & 5 & 6 & 0 & 1 & 2 & 3 \\
5 & 5 & 6 & 0 & 1 & 2 & 3 & 4 \\
6 & 6 & 0 & 1 & 2 & 3 & 4 & 5
\end{array}$$

$$\begin{array}{c|cccccc}
\cdot & 1 & 2 & 3 & 4 & 5 & 6 \\ \hline
1 & 1 & 2 & 3 & 4 & 5 & 6 \\
2 & 2 & 4 & 6 & 1 & 3 & 5 \\
3 & 3 & 6 & 2 & 5 & 1 & 4 \\
4 & 4 & 1 & 5 & 2 & 6 & 3 \\
5 & 5 & 3 & 1 & 6 & 4 & 2 \\
6 & 6 & 5 & 4 & 3 & 2 & 1
\end{array}$$

**Cómo se lee que es cuerpo, mirando sólo las tablas** *(lectura nuestra; el apunte las muestra sin comentar cómo interpretarlas)*:

- La tabla de $+$ **no repite ningún valor en ninguna fila ni columna** y usa los $7$ símbolos: es un **cuadrado latino**. Eso equivale a que cada fila sea una biyección, o sea que todo elemento tenga inverso aditivo.
- La tabla de $\cdot$ está armada sobre $\mathbb{Z}_7 - \{0\}$, y **el $1$ aparece exactamente una vez por fila**: $2\cdot 4 = 1$, $3 \cdot 5 = 1$, $6 \cdot 6 = 1$, $1 \cdot 1 = 1$. Ese es el chequeo del inverso multiplicativo, elemento por elemento.
- Nunca aparece un $0$ en la tabla de $\cdot$: el producto de no nulos es no nulo (no hay **divisores de cero**), que es lo que hace que $\mathbb{Z}_7 - \{0\}$ sea **cerrado** bajo el producto.

### 4.2 Z_4 con suma y producto no es un cuerpo finito

$$\begin{array}{c|cccc}
+ & 0 & 1 & 2 & 3 \\ \hline
0 & 0 & 1 & 2 & 3 \\
1 & 1 & 2 & 3 & 0 \\
2 & 2 & 3 & 0 & 1 \\
3 & 3 & 0 & 1 & 2
\end{array}$$

$$\begin{array}{c|ccc}
\cdot & 1 & 2 & 3 \\ \hline
1 & 1 & 2 & 3 \\
2 & 2 & 0 & 2 \\
3 & 3 & 2 & 1
\end{array}$$

**La razón exacta, según el apunte:** *"no existe inverso para el $2$"* — ningún elemento de $\mathbb{Z}_4 - \{0\}$ multiplicado por $2$ da $1$. Se ve en la fila del $2$ de la tabla: $\{2, 0, 2\}$, y el $1$ no está.

> **Errata de la tabla del apunte.** En la tabla de $+$, la última fila del PDF imprime $3 \;\; 3\;\;0\;\;1\;\;1$: la casilla $3 + 3$ figura como $1$ cuando debe ser $2$. La fila correcta es $3,\,0,\,1,\,2$, y así está arriba. Se detecta sin hacer la cuenta: con un $1$ ahí, la columna del $3$ tendría dos unos y la tabla dejaría de ser un cuadrado latino, es decir el $3$ no tendría inverso aditivo — lo cual es falso, $3 + 1 = 0$.

**Dos fallas, no una** *(lectura nuestra)*. El apunte señala la falta de inverso, pero en la misma fila del $2$ hay algo más grave y anterior: **$2 \cdot 2 = 0$**, o sea que $\mathbb{Z}_4 - \{0\}$ ni siquiera es **cerrado** bajo el producto — el resultado se sale del conjunto. Por qué un divisor de cero **nunca** puede ser inversible, y cómo eso se generaliza al criterio $\operatorname{mcd}(x,q)=1$ para todo $\mathbb{Z}_q$ compuesto, está desarrollado en el concepto y en [[inverso-modular|Inverso modular]].

### 4.3 Pero sí existe un cuerpo de cuatro elementos: GF(2^2)

El apunte hace la pregunta y la contesta en una línea: *"¿existe un cuerpo finito de $4$ elementos? Sí. Es el $\mathrm{GF}(2^{2})$ cuyos elementos son $\{0, 1, x, x+1\}$"*, y remite en una nota al pie al **apunte de campos de Galois** — que no tenemos (ver la [[#10. Lo que el apunte manda a buscar y no está en el vault|sección 10]]).

Esto es coherente con el teorema: $4 = 2^{2}$ es potencia de primo, así que el cuerpo **existe y es único**; lo que falla no es la cantidad de elementos, es $\mathbb{Z}_4$ como candidato.

> **Las tablas de $\mathrm{GF}(2^{2})$** *(reconstrucción nuestra: el apunte da la lista de elementos y nada más; la construcción es la estándar, con polinomios sobre $\mathbb{Z}_2$ módulo $x^{2}+x+1$).*
>
> $$\begin{array}{c|cccc}
> + & 0 & 1 & x & x{+}1 \\ \hline
> 0 & 0 & 1 & x & x{+}1 \\
> 1 & 1 & 0 & x{+}1 & x \\
> x & x & x{+}1 & 0 & 1 \\
> x{+}1 & x{+}1 & x & 1 & 0
> \end{array}
> \qquad
> \begin{array}{c|ccc}
> \cdot & 1 & x & x{+}1 \\ \hline
> 1 & 1 & x & x{+}1 \\
> x & x & x{+}1 & 1 \\
> x{+}1 & x{+}1 & 1 & x
> \end{array}$$
>
> Ahora sí **el $1$ aparece una vez por fila** en la tabla del producto: $1^{-1} = 1$, $x^{-1} = x+1$, $(x+1)^{-1} = x$. Es cuerpo. Y las diagonales de las dos tablas de $+$ son la clave de por qué esto no es $\mathbb{Z}_4$ disfrazado: acá **todo elemento sumado consigo mismo da $0$** y en $\mathbb{Z}_4$ no. La comparación completa de las dos estructuras está en el concepto.

---

## 5. Los dos cuerpos que usa la criptografía

El apunte lo despacha en dos renglones —los **cuerpos binarios** $\mathrm{GF}(2^{m})$ y los **cuerpos $\mathbb{Z}_p$ con $p$ primo, "habitualmente muy grande"**— y se va sin decir dónde se usan. Que los primeros son el terreno de [[aes|AES]] y los segundos el de la criptografía asimétrica de la [[cronograma|Clase 4]] es agregado del vault: la fuente **no nombra ninguna clase ni ningún criptosistema**. El cuadro con las notaciones y el desarrollo de por qué un byte no se puede operar como $\mathbb{Z}_{256}$ están en [[cuerpos-finitos-y-campos-de-galois#Los dos cuerpos que usa la criptografía|el concepto]].

> **Errata menor de vocabulario.** El apunte escribe *"grupos de Galois $\mathrm{GF}(2^{m})$"*. $\mathrm{GF}$ es *Galois Field*: **campo** (o cuerpo) de Galois, no grupo. El propio apunte había definido "campo" como sinónimo de cuerpo finito unas líneas antes, así que es un desliz de tipeo, no un concepto distinto.

---

## 6. Grupos cíclicos

El bloque siguiente define $\operatorname{Ord}(x)$, el exponente de un grupo y qué es un grupo cíclico, y los ejercita todos sobre el mismo ejemplo: $(\mathbb{Z}_7 - \{0\}, \cdot)$. **Las definiciones, la tabla completa de los seis órdenes con los subgrupos que generan y el control de Lagrange están en [[cuerpos-finitos-y-campos-de-galois#Grupos cíclicos, orden y generadores|el concepto]].** Acá quedan las particularidades de cómo lo escribe la fuente:

- **La barra como *"tal que"*.** El PDF escribe el orden como $\min\{n \,/\, x^{n} = 1\}$; en la notación del vault eso es $\min\{\, n \in \mathbb{N} : x^{n} = e \,\}$. La nota al pie aclara que $x^{n} = x \cdot x \cdots x$ ($n$ veces) donde **la operación puede ser cualquiera** y $e$ es el neutro **de esa** operación: el orden es una propiedad del par (elemento, operación), no del elemento suelto.
- **La nota al pie sobre la suma.** Dice que en $(\mathbb{Z}_p, +)$ con $p$ primo el orden de todos los elementos es $p$. *(Precisión nuestra: vale para los elementos **no nulos**; el neutro $0$ tiene orden $1$. El apunte no hace la salvedad.)*
- **La trampa de vocabulario.** El PDF llama *"orden de un grupo"* al mínimo común múltiplo de los órdenes de sus elementos, y aclara entre paréntesis que eso es el **exponente**. En la mayoría de los textos *orden de un grupo* es la cantidad de elementos. Al leer *"orden del grupo"* en estas cuatro páginas, corresponde entender **exponente**, o la definición de cíclico que viene después no cierra; el desarme completo de la ambigüedad está en el concepto.

---

## 7. Generadores y elementos primitivos

El apunte introduce el conjunto generado $\langle x\rangle$, define **generador** o **elemento primitivo**, y agrega la igualdad que convierte todo eso en un criterio operativo: $\#\langle x \rangle = \operatorname{ord}(x)$. Después la ejercita mostrando que el $3$ y el $5$ barren los seis elementos de $\mathbb{Z}_7 - \{0\}$ antes de volver al $1$. Las definiciones, la tabla de potencias sucesivas y la deducción del criterio están en el concepto; acá queda la errata.

> **Errata del apunte.** El PDF escribe $\#\langle x\rangle = \operatorname{ord}(G)$, con $G$ donde va $x$. Que corresponde $\operatorname{ord}(x)$ lo confirma el propio apunte dos renglones después, cuando anota *"$\operatorname{orden}(3) = 6$ (además $\#\langle 3\rangle = 6$)"*. En el ejemplo las dos cosas valen $6$ y la errata pasa desapercibida; en general no coinciden.

---

## 8. Función phi de Euler

El apunte define $\varphi(n)$ como el número de enteros coprimos con $n$, da tres propiedades para calcularla —$\varphi(p)$, $\varphi(p^{r})$ y la multiplicatividad sobre factores coprimos— y las usa para contar generadores. Las tres fórmulas, la acotación del rango que la fuente no explicita y el conteo $\varphi(p-1)$ están en el concepto.

Lo que hay que traerse de esta sección es **una línea y una discrepancia**.

> **La bisagra criptográfica, textual:** *"la función de Euler $\varphi(n)$ es sencilla de calcular **sólo si $n$ está factorizado**"*. Las tres propiedades son recetas que **presuponen conocer los factores primos**; sin la factorización no hay atajo conocido. *(Que ese hueco sea el que después sostiene a la criptografía asimétrica es lectura nuestra: el apunte enuncia la advertencia sin conectarla con nada.)*

### La discrepancia del /n, verificada con números

El apunte cuenta los generadores con dos fórmulas: $\varphi(p-1)$ para $(\mathbb{Z}_p - \{0\}, \cdot)$, y $\varphi(2^{n}-1)/n$ para el grupo multiplicativo de $\mathrm{GF}(2^{n})$. Las dos filas parecen inconsistentes: la primera cuenta $\varphi(\lvert G\rvert)$ sin dividir por nada, y la segunda divide por $n$ aunque también sea $\lvert G\rvert = 2^{n}-1$. Y **el grupo multiplicativo de $\mathrm{GF}(2^{n})$ es cíclico igual que el de $\mathbb{Z}_p$**, así que por el mismo argumento debería tener $\varphi(2^{n}-1)$ generadores, sin dividir.

Lo que $\varphi(2^{n}-1)/n$ cuenta es otra cosa muy relacionada: la cantidad de **polinomios primitivos de grado $n$** sobre $\mathbb{Z}_2$. Los $\varphi(2^{n}-1)$ elementos primitivos se agrupan de a $n$ —cada uno con sus conjugados $\alpha, \alpha^{2}, \alpha^{4}, \ldots, \alpha^{2^{n-1}}$— y cada grupito es el conjunto de raíces de un mismo polinomio; de ahí la división.

Se chequea con los dos campos que están sobre la mesa:

| Campo | $\varphi(2^{n}-1)$ = generadores | $\varphi(2^{n}-1)/n$ = polinomios primitivos |
|---|---|---|
| $\mathrm{GF}(2^{2})$ | $\varphi(3) = 2$ — son $x$ y $x+1$, los dos no triviales de la tabla de 4.3 | $2/2 = 1$ — es $x^{2}+x+1$, el que se usó para construirlo |
| $\mathrm{GF}(2^{8})$, el de AES | $\varphi(255) = \varphi(3)\varphi(5)\varphi(17) = 2 \cdot 4 \cdot 16 = 128$ | $128/8 = 16$ |

**No lo damos por errata**, porque el apunte remite esa fórmula al *apunte de campos de Galois* que no tenemos y ahí puede estar contando polinomios con otra nomenclatura. Queda anotado como **discrepancia a chequear con la cátedra**.

---

## 9. El cierre: no hay algoritmo eficiente para encontrar un elemento primitivo

La página 4 termina con una sola línea suelta, y es la más importante de las cuatro: **no se conoce ningún algoritmo eficiente para calcular un elemento primitivo**, ni siquiera en los cuerpos $\mathbb{F}_p$ con $p$ primo. Está citada textual y desarrollada —con la tabla de operaciones baratas contra caras, y por qué ése es el molde entero de la criptografía de clave pública— en [[cuerpos-finitos-y-campos-de-galois|el concepto]].

La asimetría que deja planteada se ve en el propio ejemplo del apunte: en $(\mathbb{Z}_7 - \{0\}, \cdot)$ **sabemos cuántos** generadores hay antes de buscar ninguno —$\varphi(6) = 2$— y aun así **encontrarlos** obliga a probar uno por uno. Con un $p$ que entra en tres bits, como el $7$, probar es gratis; con el $p$ *"habitualmente muy grande"* de la sección 5, deja de serlo. Ese contraste es todo lo que el apunte deja dicho: no nombra el logaritmo discreto, ni Diffie-Hellman, ni ningún criptosistema.

---

## 10. Lo que el apunte manda a buscar y no está en el vault

El PDF remite **dos veces**, en sendas notas al pie, a un *"apunte de campos de Galois"*:

| Dónde | Qué delega |
|---|---|
| Nota 1, en el ejemplo de $\mathrm{GF}(2^{2}) = \{0,1,x,x+1\}$ | la **construcción** del campo: por qué esos son los elementos y cómo se opera |
| Nota 3, en la fórmula $\varphi(2^{n}-1)/n$ | la **justificación** del conteo de elementos primitivos en $\mathrm{GF}(2^{n})$ |

**Ese apunte no está en el vault.** No es un archivo que falte enlazar: no existe en [`raw/apuntes/`](../../raw/apuntes/) ni en ninguna otra carpeta de `raw/`. Es una fuente que la cátedra menciona y que todavía no tenemos, y es justamente la que contiene la parte constructiva de $\mathrm{GF}(2^{m})$ — la que hace falta para entender AES a fondo. Queda **pendiente de conseguir**.

Mientras tanto, las dos tablas de $\mathrm{GF}(2^{2})$ de la sección 4.3 y el argumento de los conjugados de la sección 8 son **reconstrucción nuestra**, no material de la cátedra: sirven para estudiar, pero no son cita.

> En `raw/apuntes/` sí hay un [`DirtyGuidToNumberTheory.pdf`](../../raw/apuntes/DirtyGuidToNumberTheory.pdf) de teoría de números, ingresado el mismo día que este PDF. **No es** el apunte de campos de Galois que se cita acá —ninguna de las dos notas al pie lo nombra— pero es material de fondo del mismo bloque algebraico. *(Observación nuestra.)*

---

## 11. Resumen para el parcial

| Pregunta | Respuesta corta |
|---|---|
| ¿Cuándo $\mathbb{Z}_q$ es cuerpo? | **Sólo si $q$ es primo.** Si no, hay elementos sin inverso multiplicativo |
| ¿De qué tamaños hay cuerpos finitos? | De $p^{m}$ elementos, $p$ primo — y de esos, uno solo salvo isomorfismo |
| ¿Por qué $\mathbb{Z}_4$ no y $\mathrm{GF}(2^{2})$ sí, si los dos tienen 4 elementos? | Distinta estructura aditiva: $\mathbb{Z}_4$ contra $\mathbb{Z}_2\times\mathbb{Z}_2$. El $2$ de $\mathbb{Z}_4$ es divisor de cero |
| ¿Qué dos cuerpos usa la criptografía? | $\mathrm{GF}(2^{m})$ binarios, y $\mathbb{Z}_p$ con $p$ primo grande |
| ¿Cómo se testea que un grupo es cíclico? | $\operatorname{Exp}(G) = \lvert G\rvert$, con $\operatorname{Exp}$ el mcm de los órdenes |
| ¿Cuántos generadores tiene $(\mathbb{Z}_p-\{0\},\cdot)$? | $\varphi(p-1)$. Para $p=7$: $\varphi(6)=2$, que son el $3$ y el $5$ |
| ¿Cuándo es fácil calcular $\varphi(n)$? | **Sólo con $n$ factorizado** |
| ¿Se puede encontrar un elemento primitivo eficientemente? | **No se conoce cómo**, ni siquiera en $\mathbb{F}_p$ con $p$ primo |

| Errata del PDF | Dónde | Qué dice y qué debería decir |
|---|---|---|
| Divisibilidad al revés | sección 2 | imprime $(x-y) \mid p$; va $p \mid (x-y)$ |
| Casilla de la tabla de $\mathbb{Z}_4$ | sección 4.2 | imprime $3+3 = 1$; va $3+3 = 2$ |
| *"Grupos"* de Galois | sección 5 | $\mathrm{GF}$ es *Galois **Field***: campo, no grupo |
| $\#\langle x\rangle = \operatorname{ord}(G)$ | sección 7 | va $\operatorname{ord}(x)$; con $G$ sólo coincide por casualidad en el ejemplo |
| $\varphi(2^{n}-1)/n$ | sección 8 | cuenta polinomios primitivos, no generadores — **a chequear**, no confirmada como errata |

---

## Ver también

- [[cuerpos-finitos-y-campos-de-galois|Cuerpos finitos y campos de Galois]] — el concepto atómico: **toda la teoría de esta nota, desarrollada**. Es el destino de casi todos los links de arriba
- [[aes|AES]] — dónde se cobra todo esto: `Byte Sub` es la **inversión multiplicativa en $\mathrm{GF}(2^{8})$**, y ese campo existe por el teorema de la sección 3
- [[teoria-de-numeros|Teoría de números]] — el otro apunte del bloque algebraico, sobre el manuscrito de divisibilidad, mcd y Euclides
- [[aritmetica-modular-y-divisibilidad|Aritmética modular y divisibilidad]] — congruencias y $\mathbb{Z}_m$, el conjunto sobre el que la sección 2 empieza a poner estructura
- [[inverso-modular|Inverso modular]] — el criterio $\operatorname{mcd}(x,q)=1$ que explica la fila del $2$ en $\mathbb{Z}_4$
- [[primitiva-de-cifrado-en-bloque|Primitiva de cifrado en bloque]] — la familia a la que pertenece AES, o sea el objeto que termina usando $\mathrm{GF}(2^{8})$
- [[des-y-3des|DES y 3-DES]] — la primitiva que **no** se apoya en ninguna de estas tablas: sus cajas $S$ no tienen estructura algebraica publicada
- [[cifrado-por-rotacion|Cifrado por rotación]] — donde ya habías operado en $(\mathbb{Z}_n, +)$ sin que nadie lo llamara grupo
- [[probabilidad-y-criptografia|Probabilidad y criptografía]] — el otro apunte suelto del vault, con el andamiaje probabilístico en lugar del algebraico
- [[cronograma|Cronograma]] — para ubicar la **Clase 4 (10/09)**, que es cuando esta álgebra se cobra
- [[bibliografia|Bibliografía]] — el apunte **no cita ninguna fuente externa**, pero el respaldo natural en la bibliografía obligatoria es **Katz & Lindell, cap. 8** *(Number Theory and Cryptographic Hardness Assumptions,* mapeado a la **Clase 4** como soporte*)* y el **Apéndice A** *(Mathematical Background)*. Quien busque grupos cíclicos, generadores y $\varphi$ desarrollados con demostraciones los encuentra ahí *(observación nuestra)*
