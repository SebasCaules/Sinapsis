---
title: Teoría de números
resumen: 'Transcripción del manuscrito de repaso de teoría de números —divisibilidad, mcd, división entera, ecuación diofántica, congruencia e inverso modular— y mapa de qué fuente cubre cada hueco: los dos videos encargados y las notas de concepto.'
fuentes: ["[[clase-02-cifrado]]", "[[video-02-guia-rapida-a-teoria-de-numeros]]", "[[video-03-algoritmo-de-euclides-extendido]]", "[[aritmetica-modular-y-divisibilidad]]"]
aliases: [Teoría de números, Teoria de numeros, Quick and dirty guide to number theory, Guía rápida a teoría de números, Dirty guide to number theory]
type: apunte
clase: 2
orden: 34
created: 2026-08-24
updated: 2026-09-04
tags: [apunte, teoria-de-numeros, divisibilidad, mcd, euclides, ecuacion-diofantica, congruencia-modular, inverso-modular, clase-02, parcial]
sources: ["DirtyGuidToNumberTheory.pdf", "Teoría de Números - Algoritmo de Euclides Extendido.txt", "Repaso Teoría de Números - Inversas Modulares.txt", "Clase 02pt1-Transcripcion.VTT", "raw/clases/Clase 02pt2-Transcripcion.VTT"]
---

# Teoría de números

> **Fuentes:** [`DirtyGuidToNumberTheory.pdf`](../../raw/apuntes/DirtyGuidToNumberTheory.pdf) (2 páginas manuscritas, escaneadas) · [`Teoría de Números - Algoritmo de Euclides Extendido.txt`](../../raw/apuntes/Teor%C3%ADa%20de%20N%C3%BAmeros%20-%20Algoritmo%20de%20Euclides%20Extendido.txt) · [`Repaso Teoría de Números - Inversas Modulares.txt`](../../raw/apuntes/Repaso%20Teor%C3%ADa%20de%20N%C3%BAmeros%20-%20Inversas%20Modulares.txt) · encargado en la [[clase-02-cifrado|Clase 02]] ([transcripción](../../raw/clases/Clase%2002pt1-Transcripcion.VTT), cues 840-846)
> **Conceptos atómicos:** [[aritmetica-modular-y-divisibilidad|Aritmética modular y divisibilidad]] · [[algoritmo-de-euclides-extendido|Algoritmo de Euclides extendido]] · [[inverso-modular|Inverso modular]]

Esta nota trae **qué dice exactamente el apunte manuscrito de teoría de números y qué videos hay que mirar**. Esta nota hace dos cosas y sólo dos: transcribe fielmente las dos hojas del escaneo —que están escritas en un estilo telegráfico, con notación propia— y arma el mapa de qué fuente cubre qué. **La teoría desarrollada no vive acá**: los algoritmos, las demostraciones y los ejemplos numéricos están en las tres notas de concepto linkeadas arriba.

Es material de repaso, no material nuevo: son temas de Matemática Discreta que la materia da por sabidos. La razón de que aparezcan ahora está en la sección siguiente, y no es decorativa — **el docente los pidió explícitamente para el parcial**.

---

## 1. De dónde sale esto: es tarea de la Clase 02

Este apunte **no es material suelto**. Al cerrar la [[clase-02-cifrado|Clase 02]], Rodrigo Ramele lo encarga como preparación. Textual, de la [transcripción](../../raw/clases/Clase%2002pt1-Transcripcion.VTT) (cues 840-841, `02:04:40`-`02:05:01`):

> *"Yo les voy a estar subiendo **2 vídeos que son de teoría, de números** de algunas cosas del repaso de teoría de números. Es importante que le den **una vuelta de rosca**, por ejemplo, **cómo resolver la ecuación diofántica** o **cómo resolver lo que es el algoritmo de Euclides extendido**. **Eso le va a servir para el parcial**."*

Y sigue, con el motivo (cues 842-843):

> *"porque con eso lo que se pueden armar son algoritmos, criptosistemas simples numéricos que operan sobre $\mathbb{Z}$, sobre congruencia modular; entonces van a tener que desempolvar lo que se acuerden de matemática discreta y lo vamos a volver a ver un poco acá."*

Más abajo enumera el temario de los videos (cues 845-846, `02:05:36`-`02:06:01`):

> *"les voy a estar subiendo **2 vídeos míos** de hace muchos años, antes de la pandemia (...) porque son todos temas que ustedes ya vieron en otras materias, que tiene que ver con **números primos**, con **definición de divisibilidad**, con **resolver la ecuación de[i]ofántica**, **entender congruencia modular** y poder calcular cuál es el **inverso multiplicativo o modularmente de un número**."*

Y aclara el alcance (cue 844): *"No es que nosotros nos concentremos en eso, porque esta es una materia de seguridad desde la perspectiva de criptografía general y no de cómo se implementan los esquemas criptográficos."* O sea: **se pide como herramienta, no como tema de estudio en sí**.

> **Por qué importa la distinción.** Que sea "sólo repaso" hace fácil saltearlo, y es justo lo que no conviene: es lo único de esta clase que el docente marcó nominalmente como *"le va a servir para el parcial"*. El [[guia-02-criptografia-simetrica|Ej. 7c de la Guía 2]] ya lo usa —hay que calcular $7^{-1} \bmod 32$ con Euclides extendido para poder descifrar en `CBC`— y es un ejercicio de la unidad de criptografía **simétrica**, no de la asimétrica. Es decir: el tema ya está en juego.

### Los dos videos son estos

Los dos `.txt` de `raw/apuntes/` **contienen una sola línea cada uno: la URL**. Nada de tema, fecha ni descripción. Lo que sí se puede verificar contra YouTube es el título y el autor:

| Archivo en `raw/apuntes/` | Título en YouTube | Autor | Link |
|---|---|---|---|
| [`Teoría de Números - Algoritmo de Euclides Extendido.txt`](../../raw/apuntes/Teor%C3%ADa%20de%20N%C3%BAmeros%20-%20Algoritmo%20de%20Euclides%20Extendido.txt) | *Criptografía y Seguridad Informática - Algoritmo Euclides Extendido* | Rodrigo Ramele (`@faturita`) | https://www.youtube.com/watch?v=KgnrX6I_Nd4 |
| [`Repaso Teoría de Números - Inversas Modulares.txt`](../../raw/apuntes/Repaso%20Teor%C3%ADa%20de%20N%C3%BAmeros%20-%20Inversas%20Modulares.txt) | *Criptografía y Seguridad Informática - Guía Rápida a Teoría de Números* | Rodrigo Ramele (`@faturita`) | https://www.youtube.com/watch?v=FcM8RpBvkf4 |

**La identificación cierra por cuatro lados** *(inferencia nuestra, pero con la evidencia a la vista)*: son **dos**, son **de teoría de números**, son **del propio docente** (*"2 vídeos míos"* — el canal `@faturita` es de Rodrigo Ramele, el mismo handle que aparece en los repos de GitHub que linkean [`Implementación AES en JAVA.txt`](../../raw/apuntes/Implementaci%C3%B3n%20AES%20en%20JAVA.txt) y [`Implementación DES en JAVA.txt`](../../raw/apuntes/Implementaci%C3%B3n%20DES%20en%20JAVA.txt), de esta misma carpeta), y cubren exactamente los dos procedimientos que nombró. Estrictamente, **los `.txt` no dicen "estos son los videos de la Clase 2"**: eso lo cierra el cruce con la transcripción, no la fuente.

> **Ojo con el segundo título.** El archivo se llama *"Inversas Modulares"* pero YouTube lo titula ***"Guía Rápida a Teoría de Números"*** — que es, palabra por palabra, la traducción de *"Quick and dirty guide to number theory"*, el título del manuscrito. **Lectura nuestra:** el PDF escaneado es, con toda probabilidad, el soporte de ese video. No está afirmado en ninguna de las dos fuentes; lo sostienen el título y que el autor del canal sea el mismo docente. Se deja anotado como hipótesis, no como dato.

> **Estos dos no están solos.** El canal `@faturita` tiene una playlist de la materia con **14 entradas, 13 accesibles** (la restante pasó a privada), y estos son 2 de ellas: los únicos que la cátedra encargó explícitamente. Los otros once cubren de la Clase 2 a la Clase 11 y **nadie del vault los tenía**. Están todos mirados y mapeados en [[videografia|Videografía]]. De los 13, **estos dos son de los únicos 3 que son públicos**; el resto son ocultos.
>
> **Y estos dos son distintos de los otros once en algo más que el encargo:** son los únicos que **no son grabaciones de clase**. No tienen una sola marca de audiencia —ni un vocativo, ni una pregunta al curso, ni un nombre propio— y el propio Ramele los llama *"video"*, remitiendo de uno al otro. Son material didáctico producido aparte.

- **Los dos videos están mirados**, y cada uno tiene su nota: [[video-02-guia-rapida-a-teoria-de-numeros|video-02 Guía rápida a teoría de números]] (31 min) y [[video-03-algoritmo-de-euclides-extendido|video-03 Algoritmo de Euclides extendido]] (14 min). Ahí está el desarrollo que a este manuscrito le falta — el `03` resuelve la diofántica $41x - 19y = 8$ entera, paso a paso.

### Qué NO se sabe del escaneo

El PDF no trae ni firma ni fecha en las hojas. Los metadatos del archivo dicen esto y nada más:

| Campo | Valor |
|---|---|
| `Title` | `Dirty2` |
| `CreationDate` / `ModDate` | `2021-03-09 22:41 -03` |
| `Producer` | `GPL Ghostscript 9.53.2` |
| `Author` | **ausente** |

O sea: **el apunte no tiene autor declarado ni fecha de escritura**. El `2021-03-09` es la fecha en que se armó el PDF (Ghostscript, típico de un escaneo procesado), no necesariamente la de las hojas. Y hay un detalle que **no cierra**: el docente describe los videos como *"de hace muchos años, antes de la pandemia"*, pero el PDF se generó en **marzo de 2021**, ya en pandemia. Las dos cosas son compatibles —se puede escanear en 2021 algo escrito antes— pero **la fuente no permite fechar el manuscrito**, así que acá no se le pone fecha. *(Lectura nuestra.)*

### Aparte y optativo: el libro de aritmética que recomienda el 20/08

**Son dos encargos distintos y conviene no mezclarlos.** Todo lo de arriba —los dos videos, la diofántica, Euclides extendido— se pide el **13/08**, al cerrar el primero de los dos jueves de la Clase 02 (cues pt1 840-846), y viene **atado al parcial**. Lo que sigue es del **20/08**, la segunda fecha, y es de otro nivel: en el último minuto el docente recomienda un libro **sin atarlo a nada evaluable**, y lo presenta así: *"para los que sean más nerds de ustedes"* (cues pt2 536-540).

Es un libro **de aritmética** de **María Lina Becquer y Carlos Sánchez**, de los que se usan —*"o se usaba, por lo menos"*— en las **olimpíadas de matemática**, con ejercicios de teoría de números *"divertidos"* que, según el docente, están basados en la teoría de números **que se usa en criptografía**. Sirve exactamente para lo que a este manuscrito le falta: [[#6. Lo que el manuscrito NO trae|ejemplos y ejercicios]] con los que verificar que entendiste.

**Es optativo, no bibliografía obligatoria.** No figura en ninguna de las dos listas de la [[bibliografia|bibliografía]] —ni la obligatoria ni la de consulta— y por lo tanto no entra en lo que el [[reglamento-y-evaluacion|reglamento]] declara evaluable.

**Lo que la transcripción NO da: el título exacto, el año y la editorial.** Ninguno de los tres aparece en ningún cue, así que acá no se completan — **sin título no hay cita bibliográfica posible**, y esto queda como pista para buscar, no como referencia. El encuadre completo está en [[bibliografia#Recomendado en clase, fuera del programa|Bibliografía § Recomendado en clase, fuera del programa]].

---

## 2. La notación propia del manuscrito

Antes de la transcripción conviene tener esta tabla a mano: el apunte usa varios símbolos que **no son los habituales**, y sin traducirlos las dos hojas se leen mal.

| Manuscrito | Lo habitual | Qué significa |
|---|---|---|
| $(a{:}b)$ | $\gcd(a,b)$, $\operatorname{mcd}(a,b)$ | **máximo común divisor**. El apunte introduce las tres notaciones y después usa siempre la de los dos puntos |
| $r_m(x)$ | $x \bmod m$ | **resto** de dividir $x$ por $m$ |
| $a \perp b$ | $\operatorname{mcd}(a,b) = 1$ | **coprimos** (el apunte lo glosa como *"$a$ COPRIME $b$"*) |
| $x \equiv y\ (m)$ | $x \equiv y \pmod{m}$ | congruencia: el módulo va como **subíndice entre paréntesis**, sin el `mod` |
| $\emptyset$ | $0$ | **cero tachado**, para no confundirlo con la letra O. Aparece en $a \mid \emptyset$ y en $(a{:}\emptyset)$ |
| $\bar{x}$ | $x$ | la **incógnita** de una congruencia lleva barra: es la clase de $x$ en $\mathbb{Z}_m$, no un entero suelto |
| $\wedge$ | "y" | conjunción lógica. En la letra manuscrita parece un $1$ chico |
| $/$ | "tal que" | como en $\exists\, c \in \mathbb{Z} \;/\; b = a \cdot c$ |
| `MULTIPLO`, `COPRIME` | — | el apunte mezcla castellano e inglés, y escribe en imprenta mayúscula las palabras que no son símbolos |

El título de la primera hoja está en inglés (*Quick and dirty guide to number theory*) y los encabezados de sección en castellano, subrayados en rojo. Todo lo demás está en azul.

---

## 3. Hoja 1 — divisibilidad, mcd, división entera, diofántica

### Divisor

$$a, b \in \mathbb{Z} \qquad a \mid b \iff \exists\, c \in \mathbb{Z} \;/\; b = a \cdot c$$
$$1 \mid b \quad \forall b \qquad\qquad a \mid \emptyset \quad \forall a$$
$$\text{si } a \mid b \;\Rightarrow\; b \text{ es } \textbf{MÚLTIPLO} \text{ de } a$$

**Qué está diciendo.** La divisibilidad se define **con una multiplicación, no con una división**: $a \mid b$ no dice "$b/a$ da exacto", dice "existe un entero $c$ que multiplicado por $a$ da $b$". Esa es la razón de que el concepto viva cómodo en $\mathbb{Z}$, donde la división no siempre existe: nunca se sale de los enteros.

Cuidado con la dirección al leerlo: **$a \mid b$ se lee "$a$ divide a $b$"**, o sea $a$ es el **divisor** y $b$ el **múltiplo** — lo que **no** significa que $a$ sea el chico, como muestra el caso borde de dos viñetas más abajo: $a \mid 0$ vale para todo $a$. Es un error clásico invertir la dirección, y el apunte lo previene con la última línea: *"$a \mid b$ ⟹ $b$ múltiplo de $a$"* — es **la misma afirmación leída desde el otro lado**, no un teorema nuevo. Divisor y múltiplo son la misma relación mirada de punta a punta.

Los dos casos borde que anota:

- **$1 \mid b$ para todo $b$** — tomando $c = b$. El $1$ divide a todo.
- **$a \mid 0$ para todo $a$** — tomando $c = 0$. **Todo entero divide al cero**, y no al revés: $0 \mid b$ sólo cuando $b = 0$. Es el caso que rompe la intuición de "divisor = más chico".

### GCD ó MCD

$$d, \qquad \gcd(a,b) = \operatorname{mcd}(a,b) = d \quad \lor \quad (a{:}b) = d$$

$$\text{iff} \qquad
\begin{cases}
d \mid a \;\wedge\; d \mid b \\[2pt]
\exists\, k \;/\; k \mid a \;\wedge\; k \mid b \;\Rightarrow\; k \mid d
\end{cases}$$

**Qué está diciendo.** No define el mcd como *"el más grande de los divisores comunes"* sino por **dos cláusulas**:

1. **$d$ es divisor común** de $a$ y de $b$.
2. **Todo otro divisor común divide a $d$** — es decir, $d$ es el máximo **en el orden de la divisibilidad**, no en el orden $\le$ de los números.

Que esta caracterización sea equivalente a *"el más grande de los divisores comunes"* no es obvio, y la segunda cláusula es la que vale la pena entender: dice que $d$ **absorbe** a todos los divisores comunes. Esa formulación es más fuerte y más útil que "el más grande" — es la que se usa en las demostraciones, la que hace único al mcd (salvo signo) y la que sobrevive cuando el concepto se generaliza a objetos donde "más grande" no significa nada, como los polinomios.

> **Errata del manuscrito.** La segunda cláusula está escrita con $\exists\, k$ y **corresponde $\forall k$**: *para todo* $k$ que divida a $a$ y a $b$, $k$ divide a $d$. Con $\exists$ la condición es trivial —el $k = 1$ la cumple siempre— y no caracterizaría nada. La primera hoja usa $\forall$ correctamente dos renglones más arriba ($1 \mid b\ \forall b$), así que es un desliz de escritura, no un criterio distinto. *(Corrección nuestra.)*

### Tips

$$(a{:}\emptyset) = \lvert a \rvert, \qquad a \perp b, \quad a \text{ COPRIME } b$$
$$\Longrightarrow \quad (a{:}b) = 1 \;\Rightarrow\; a x + b y = 1$$

Tres cosas apretadas en dos renglones:

- **$(a{:}0) = \lvert a \rvert$** — sale de que todo divide al $0$: los divisores comunes de $a$ y $0$ son los divisores de $a$, y el mayor es $\lvert a \rvert$. **No es una curiosidad**: es el **caso base del algoritmo de Euclides**, el renglón donde la recursión se detiene. Ver [[algoritmo-de-euclides-extendido|Algoritmo de Euclides extendido]].
- **$a \perp b$** — la notación del apunte para *coprimos*, o sea $(a{:}b) = 1$: no comparten ningún factor primo.
- **$(a{:}b) = 1 \Rightarrow ax + by = 1$** — es la **identidad de Bézout** en su caso particular. Dice que si $a$ y $b$ son coprimos, **existen enteros $x, y$** que combinan $a$ y $b$ hasta dar exactamente $1$.

> **Este último renglón es la bisagra de todo el apunte** *(lectura nuestra: el manuscrito lo pone como un "tip" al pasar y nunca vuelve sobre él)*. Ese $x$ de Bézout **es el inverso modular de $a$ módulo $b$**: si $ax + by = 1$, tomando resto módulo $b$ el término $by$ se anula y queda $ax \equiv 1\ (b)$. La hoja 2 va a definir el inverso modular sin decir de dónde sale; sale de acá. Y **quien produce ese $x$ es el algoritmo de Euclides extendido** — que es exactamente el procedimiento que el docente marcó para el parcial. Desarrollo en [[inverso-modular|Inverso modular]].

### División entera

$$\exists\, a, b \in \mathbb{N}, \quad \exists\, q, r \in \mathbb{Z}$$
$$\boxed{\,b = q\,a + r\,} \qquad 0 \le r < a$$
$$\text{si } r = 0 \;\Rightarrow\; a \mid b$$

Con esta leyenda al margen, en rojo:

| Símbolo | Rol |
|---|---|
| $b$ | dividendo |
| $q$ | cociente |
| $a$ | divisor |
| $r$ | resto |

**Qué está diciendo.** Es el algoritmo de la división. Dos observaciones importantes:

- **La convención de letras es la del apunte, no la del libro.** Acá el **divisor es $a$** y el **dividendo es $b$** (por eso $b = qa + r$, con la $a$ pegada a la $q$). Casi toda la bibliografía escribe $a = qb + r$, con $a$ de dividendo. *(Lectura nuestra:* la elección se entiende **para que sea coherente con $a \mid b$** de la primera definición — la misma $a$ es "la que divide" en los dos lados de la hoja; el apunte no lo justifica.*)* Mezclar las dos convenciones lleva a equivocarse de variable.
- **La condición $0 \le r < a$ es la que da unicidad.** Sin ella hay infinitas descomposiciones: de $b = qa + r$ se pasa a $b = (q{+}1)a + (r{-}a)$, y así indefinidamente. Acotar el resto al intervalo $[0, a)$ deja **exactamente un** par $(q, r)$, y es lo que permite hablar de *"el"* resto y definir la función $r_m$ del renglón siguiente.

El cierre $r = 0 \Rightarrow a \mid b$ conecta la división con la primera definición: **el resto cero es la traducción operativa de "es divisor"**. Vale en los dos sentidos, aunque el apunte escriba sólo uno.

> **Errata del manuscrito.** El renglón de cuantificadores dice $\exists\, a, b \in \mathbb{N}$ y corresponde **$\forall a, b$** (con $a \ne 0$), $\exists!\, q, r$. El teorema afirma que **para cualesquiera** dividendo y divisor **existen únicos** cociente y resto; leído literal, el apunte afirma apenas que *hay algún* par $a,b$ que admite la descomposición, que es infinitamente más débil. La **unicidad** tampoco está escrita, y es la mitad interesante del enunciado — es la que hace que $r_m(x)$ sea una función. *(Corrección nuestra.)*

$$r_m(x) = r \;/\; x = k\,m + r$$

**Qué está diciendo.** Bautiza la operación: **$r_m(x)$ es el resto de dividir $x$ por $m$** — lo que la mayoría escribe $x \bmod m$. Nótese que es la misma ecuación de arriba con las letras cambiadas ($m$ de divisor, $k$ de cociente), y que la cota $0 \le r < m$ queda implícita, heredada del recuadro. Sin esa cota, $r_m$ no sería una función.

Esta notación es la que usa toda la hoja 2, así que conviene fijarla.

### Ecuación diofántica lineal

$$a x + b y = c, \qquad a, b, c \in \mathbb{Z}$$
$$\exists\, x, y \in \mathbb{Z} \iff (a{:}b) \mid c$$

**Qué está diciendo.** *"Diofántica"* significa que **sólo se aceptan soluciones enteras**. Esa restricción es toda la dificultad: sobre los racionales, $ax + by = c$ tiene infinitas soluciones para cualquier $c$ (con $a, b$ no ambos nulos) y no habría nada que discutir. Pedir $x, y \in \mathbb{Z}$ la convierte en un problema de divisibilidad.

Y el criterio es de una línea: **hay solución entera si y sólo si el mcd de $a$ y $b$ divide a $c$**. La intuición de por qué:

- **Necesario** — llamando $d = (a{:}b)$, como $d \mid a$ y $d \mid b$, cualquier combinación $ax + by$ es múltiplo de $d$. Si $c$ no es múltiplo de $d$, no hay forma.
- **Suficiente** — Bézout da $x_0, y_0$ con $a x_0 + b y_0 = d$; multiplicando todo por $c/d$ (que es entero justamente porque $d \mid c$) se obtiene una solución de $ax + by = c$.

Notar que el criterio dice **si hay** solución, no **cuál es**. Encontrarla es el trabajo del algoritmo de Euclides extendido, y el manuscrito **no lo trae** (ver la §6, *Lo que el manuscrito NO trae*). El tip de Bézout de más arriba es exactamente el caso $c = 1$ de esta ecuación.

> **Matiz de escritura.** El tip de la hoja 1 escribe $(a{:}b) = 1 \Rightarrow ax + by = 1$ con implicación simple, pero acá el mismo enunciado aparece con $\iff$. La vuelta también vale: si $ax + by = 1$ tiene solución entera, todo divisor común de $a$ y $b$ divide a $1$, o sea $(a{:}b) = 1$. Es un ida y vuelta, no una implicación. *(Lectura nuestra.)*

---

## 4. Hoja 2 — congruencia, ecuación de congruencia, inverso modular

La segunda hoja es la que le da sentido criptográfico a la primera: es donde aparece $\mathbb{Z}_m$, que es el terreno donde viven los *"criptosistemas simples numéricos"* que mencionó el docente.

### Congruencia modular

$$x \equiv y\ (m) \qquad m \in \mathbb{N},\ x, y \in \mathbb{Z}$$
$$\iff \quad r_m(x) = r_m(y)$$
$$\iff \quad (x - y) \text{ es } \textbf{MÚLTIPLO} \text{ de } m$$
$$\Big\Downarrow$$
$$m \mid (x-y) \;\Rightarrow\; (x-y) = k\,m$$
$$x = y + k\,m$$

**Qué está diciendo.** Tres formas equivalentes de leer la misma relación, encadenadas de la más conceptual a la más operativa:

| Lectura | Fórmula | Para qué sirve |
|---|---|---|
| **Mismo resto** | $r_m(x) = r_m(y)$ | es la definición intuitiva: $x$ e $y$ caen en la misma casilla al dividir por $m$ |
| **Diferencia múltiplo** | $m \mid (x-y)$ | es la que se usa para **demostrar** cosas: reduce la congruencia a una divisibilidad, y ahí entra toda la hoja 1 |
| **Despeje** | $x = y + k\,m$ | es la que se usa para **calcular**: permite reemplazar $x$ por $y$ más cualquier cantidad de vueltas de $m$ |

La flecha $\Downarrow$ del manuscrito marca justamente ese paso, de la caracterización a la forma despejada.

**Por qué esto es lo que importa para criptografía** *(lectura nuestra: el manuscrito no lo dice, lo dice el docente en la clase)*. La tercera lectura es la clave: trabajar módulo $m$ es trabajar **a menos de múltiplos de $m$**. La congruencia es una relación de equivalencia **compatible con la suma y el producto** —si $x \equiv x'$ e $y \equiv y'$, entonces $x+y \equiv x'+y'$ y $xy \equiv x'y'$—, y por eso las clases forman una estructura donde se puede sumar y multiplicar: $\mathbb{Z}_m$, que el apunte anota al lado del título. Sin esa compatibilidad no habría aritmética modular, y sin aritmética modular no hay ni [[cifrado-por-rotacion|cifrado por rotación]] ni RSA.

Lo que **no** se hereda gratis es la **división**: y de ahí sale el resto de la hoja.

### Ecuación lineal de congruencia

$$a\,\bar{x} \equiv b\ (m)$$
$$\hookrightarrow \quad a\,\bar{x} - k\,m = b \qquad \text{si } (a{:}m) \mid b$$
$$\hookrightarrow \quad x = x_0 + t\,\frac{m}{d}$$

**Qué está diciendo.** La primera flecha es **el truco entero del apunte**, y está escrita sin comentario ninguno:

> Una **congruencia** en una incógnita **es** una **ecuación diofántica** en dos incógnitas.

El pasaje: $a\bar{x} \equiv b\ (m)$ significa $m \mid (a\bar{x} - b)$, o sea $a\bar{x} - b = km$ para algún entero $k$, o sea $a\bar{x} - km = b$. Se cambió el $\equiv$ por un $=$ **al precio de introducir una incógnita nueva**, $k$. Y esa ecuación es exactamente la diofántica de la hoja 1, con este diccionario:

| Hoja 1: $\;a x + b y = c$ | Hoja 2: $\;a\bar{x} - k\,m = b$ |
|---|---|
| $x$ | $\bar{x}$ |
| coeficiente $b$ | $-m$ |
| $y$ | $k$ |
| término independiente $c$ | $b$ |

> **Ojo con la letra $b$:** en la hoja 1 es un **coeficiente** y en la hoja 2 es el **término independiente**. Es la misma letra haciendo dos papeles distintos, y es la fuente de confusión más probable de todo el apunte. *(Advertencia nuestra.)*

Por eso el criterio de existencia es **el mismo** que el de la diofántica: hay solución si y sólo si $(a{:}m) \mid b$. El apunte no lo justifica; no hace falta, es literalmente el mismo enunciado con otras letras.

La segunda flecha da la **forma de las soluciones**: si $x_0$ es una solución particular, todas las demás son $x_0 + t\,\frac{m}{d}$ con $t \in \mathbb{Z}$. Leído módulo $m$ eso significa que hay **exactamente $d$ soluciones distintas**, espaciadas $m/d$. Una congruencia lineal, a diferencia de una ecuación en $\mathbb{R}$, **puede tener varias soluciones o ninguna**.

> **Dos cosas que el manuscrito deja implícitas** *(lectura nuestra)*:
>
> - **La $d$ nunca se redefine en la hoja 2.** Es la $d$ de $(a{:}b) = d$ de la hoja 1, acá con $b := m$: o sea $d = (a{:}m)$, el mismo mcd que aparece dos renglones antes en el criterio. Sin esa identificación la fórmula final no se puede usar.
> - **El apunte escribe "if", pero es "si y sólo si".** El criterio $(a{:}m) \mid b$ es una caracterización completa, y el propio apunte lo había escrito con $\iff$ en la hoja 1. Cuando $(a{:}m) \nmid b$ la congruencia **no tiene ninguna** solución.
>
> Y una que no deja implícita sino **directamente afuera**: cómo se consigue $x_0$. La fórmula describe la familia a partir de una solución particular que nunca dice cómo obtener. Se obtiene con Euclides extendido — ver la §6, *Lo que el manuscrito NO trae*.

### Inverso modular

$$a\,\bar{x} \equiv 1\ (m) \qquad\qquad (a{:}m) = 1 \;\Rightarrow\; a \perp m$$
$$\text{si } \bar{x} \text{ verifica} \;\Rightarrow\; \bar{x} = a^{-1}\ (m) \;=\; \bar{x} = \frac{1}{a}$$

*(En el original, una flecha manuscrita sube desde "si $\bar{x}$ verifica" hasta la congruencia de arriba: el "verifica" se refiere a esa.)*

**Qué está diciendo.** Es **el caso $b = 1$ de la sección anterior**, y por eso el apunte lo despacha en dos renglones. Pero es el caso que importa, así que conviene desplegarlo:

- **Criterio de existencia.** Aplicando el criterio general con $b = 1$: hay solución si y sólo si $(a{:}m) \mid 1$, y el único divisor positivo de $1$ es $1$. Entonces la condición es $(a{:}m) = 1$, es decir **$a \perp m$**: el inverso de $a$ módulo $m$ **existe si y sólo si $a$ y $m$ son coprimos**. Eso es lo que anota a la derecha.
- **Unicidad.** Con $d = (a{:}m) = 1$, la fórmula de la sección anterior da $x = x_0 + t\,m/1 = x_0 + tm$: **todas las soluciones son congruentes entre sí módulo $m$**. O sea, hay **exactamente un** inverso en $\mathbb{Z}_m$, y por eso tiene sentido hablar de *"el"* inverso y escribirlo $a^{-1}$.
- **De dónde sale.** Por Bézout (el tip de la hoja 1): $a \perp m$ garantiza que existen $x, y$ con $ax + my = 1$; tomando resto módulo $m$, el $my$ desaparece y queda $ax \equiv 1\ (m)$. **Ese $x$ es el inverso.** Y quien lo calcula es Euclides extendido.

> **Cuidado con la última igualdad.** El apunte escribe $\bar{x} = a^{-1}\ (m) = \bar{x} = \frac{1}{a}$. El $\frac{1}{a}$ es un **abuso de notación**, no una división: en $\mathbb{Z}_m$ no hay fracciones, y $a^{-1}$ es "el elemento que multiplicado por $a$ da $1$", definido por la congruencia y nada más. Escribirlo $1/a$ ayuda a la intuición —el inverso hace el papel del recíproco— pero **calcularlo como una división da cualquier cosa**: el inverso de $7$ módulo $32$ es $23$, no $0{,}142\ldots$ ni $1/7$. *(Advertencia nuestra; el manuscrito escribe la igualdad sin comentario.)*

**Por qué esto es el destino de las dos hojas.** El inverso modular es lo que le devuelve a $\mathbb{Z}_m$ la operación que la congruencia no traía de fábrica: **dividir**. Y dividir es lo que hace falta para **descifrar** cualquier esquema que cifre multiplicando. El [[guia-02-criptografia-simetrica|Ej. 7 de la Guía 2]] es exactamente eso: la primitiva es $E(K, M) = (M \cdot K) \bmod 32$, y para escribir `Dec` hay que calcular $K^{-1} \bmod 32$. Sin inverso no hay descifrado, y sin coprimalidad no hay inverso — por eso ahí las claves útiles son sólo las impares.

---

## 5. El hilo que une las dos hojas

*(Síntesis nuestra: el manuscrito presenta las siete definiciones como una lista y nunca dibuja esta cadena.)*

Leído de corrido, el apunte es una sola línea argumental que va de la divisibilidad al descifrado:

$$a \perp m
\;\underset{\text{Bézout}}{\Longrightarrow}\;
\exists\, x,y: ax + my = 1
\;\underset{(m)}{\Longrightarrow}\;
a x \equiv 1\ (m)
\;\Longrightarrow\;
x = a^{-1}
\;\Longrightarrow\;
\textsf{Dec} \text{ existe}$$

Y cada eslabón tiene su lugar en las hojas:

| Paso | Dónde está | Qué aporta |
|---|---|---|
| Divisibilidad, múltiplo | hoja 1, *Divisor* | el vocabulario base |
| $(a{:}b)$ y sus dos cláusulas | hoja 1, *GCD ó MCD* | el objeto que decide todo lo demás |
| $(a{:}0) = \lvert a \rvert$ | hoja 1, *tips* | el caso base de Euclides |
| División entera, $r_m(x)$ | hoja 1, *División Entera* | el paso de la relación a la operación |
| Criterio $(a{:}b) \mid c$ | hoja 1, *Ecuación diofántica lineal* | **cuándo** hay solución |
| Bézout $ax + by = 1$ | hoja 1, *tips* | el puente hacia la hoja 2 |
| $\mathbb{Z}_m$ y las tres lecturas | hoja 2, *Congruencia modular* | el terreno donde vive la criptografía numérica |
| Congruencia = diofántica | hoja 2, *Ecuación lineal de congruencia* | reduce lo nuevo a lo ya resuelto |
| $a^{-1}$ existe $\iff a \perp m$ | hoja 2, *Inverso modular* | la división que faltaba |

**El patrón que conviene ver:** hay **un solo criterio** en todo el apunte, escrito tres veces con disfraces distintos.

$$(a{:}b) \mid c \quad\longrightarrow\quad (a{:}m) \mid b \quad\longrightarrow\quad (a{:}m) = 1$$

La diofántica general, la congruencia lineal y el inverso modular son **el mismo problema** con $c$ arbitrario, con $c$ del lado de la congruencia, y con $c = 1$. Si se recuerda el primero, los otros dos salen solos.

---

## 6. Lo que el manuscrito NO trae

Esta sección es la razón de ser de los videos y de las notas de concepto: el manuscrito es una hoja de **enunciados**, no de **procedimientos**.

*(En la columna derecha, cuando dice "video" la atribución ya está **verificada contra el video mirado**, no inferida del título. El desarrollo de cada uno está en [[video-02-guia-rapida-a-teoria-de-numeros|video-02]] y [[video-03-algoritmo-de-euclides-extendido|video-03]].)*

| Falta | Dónde está |
|---|---|
| **El algoritmo de Euclides.** El apunte define qué **es** el mcd, pero **en ninguna parte dice cómo calcularlo**. No hay cadena de divisiones sucesivas ni nada parecido | [[algoritmo-de-euclides-extendido\|Algoritmo de Euclides extendido]] · video *Algoritmo Euclides Extendido* |
| **Euclides extendido.** Cómo obtener los $x, y$ de Bézout. El apunte afirma que existen y nunca los construye | [[algoritmo-de-euclides-extendido\|Algoritmo de Euclides extendido]] · video *Algoritmo Euclides Extendido* |
| **Cómo se despeja $x_0$** en la ecuación lineal de congruencia. La fórmula $x = x_0 + t\,m/d$ describe la familia a partir de un dato que nunca se calcula | [[inverso-modular\|Inverso modular]] |
| **Un solo ejemplo numérico.** Las dos hojas no traen **ningún** número concreto: son puro enunciado. No hay con qué verificar que entendiste | [[guia-02-criptografia-simetrica\|Ej. 7c de la Guía 2]] ($7^{-1} \bmod 32 = 23$) y las notas de concepto |
| **Números primos y factorización.** El docente los nombra entre los temas de los videos (cue 845), pero **el escaneo no los toca** | los videos |
| **Aritmética de $\mathbb{Z}_m$ más allá de lo lineal:** exponenciación modular, $\varphi$ de Euler, teorema chino del resto, cuerpos finitos | fuera de estas fuentes. **Los cuerpos finitos y $\varphi$ de Euler sí tienen nota**: [[cuerpos-finitos\|Cuerpos finitos]] —el recorrido del PDF [`Cuerpos Finitos - ITBA 2021(1).pdf`](../../raw/apuntes/Cuerpos%20Finitos%20-%20ITBA%202021%281%29.pdf) de `raw/apuntes/`— y [[cuerpos-finitos-y-campos-de-galois\|Cuerpos finitos y campos de Galois]]. La **exponenciación modular** aparece ahí sólo mencionada al pasar, y el **teorema chino del resto** no está en ninguna nota del vault |
| **Para qué sirve.** El manuscrito no menciona criptografía ni una vez. La motivación viene entera de la [[clase-02-cifrado\|Clase 02]] | esta nota, §1 |

> **Cómo leerlo, entonces.** El manuscrito sirve como **checklist de definiciones y criterios** —es exactamente lo que uno quiere tener delante en un parcial— y **no** como material para aprender el tema de cero. Si nunca resolviste una diofántica, el orden útil es: mirar el video, hacer un par de ejemplos, y recién después usar estas dos hojas como resumen.

---

## 7. Para el parcial

Lo que el docente marcó nominalmente (cues 840-841, 846):

- **Resolver una ecuación diofántica** $ax + by = c$: decidir si tiene solución (criterio $(a{:}b) \mid c$) y encontrarla.
- **Ejecutar el algoritmo de Euclides extendido** de punta a punta, con la sustitución hacia atrás.
- **Calcular el inverso multiplicativo módulo $m$** de un número, y saber **cuándo no existe**.
- **Entender congruencia modular** y poder moverse entre las tres lecturas equivalentes.

Y lo que conviene tener afilado además, leyendo el apunte:

- La cadena **$a \perp m \Rightarrow$ Bézout $\Rightarrow$ inverso**, que es lo que convierte el algoritmo en una herramienta y no en una cuenta suelta.
- Que **$a^{-1}$ existe si y sólo si $a \perp m$** — y qué consecuencia tiene sobre un espacio de claves (el Ej. 7a de la Guía 2: de $32$ claves nominales sólo $\varphi(32) = 16$ sirven).
- Que una **congruencia lineal puede tener $d$ soluciones o ninguna**, a diferencia de una ecuación real. El $d$ es $(a{:}m)$.
- La **notación del apunte** ($(a{:}b)$, $r_m(x)$, $a \perp b$), por si el enunciado del parcial la usa.
- El caso base **$(a{:}0) = \lvert a \rvert$**, que es donde termina Euclides y donde más se traba la gente al escribir el algoritmo.

