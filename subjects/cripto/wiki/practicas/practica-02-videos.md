---
title: Práctica 02 — Videos
resumen: 'Los cuatro videos de la clase práctica 2, que verifican sobre un mismo esquema de juguete las cuatro caracterizaciones equivalentes del secreto perfecto, con la resolución numérica completa por escrito.'
fuentes: ["[[clase-02-cifrado]]", "[[secreto-perfecto]]", "[[modelo-probabilistico-de-un-criptosistema]]", "[[probabilidad-y-criptografia]]"]
aliases: [Práctica 2, Practica 2, Clase 2 links, Videos clase práctica 2, Videos de secreto perfecto, Cuatro definiciones de secreto perfecto, Práctica 2 en video]
type: practica
clase: 2
orden: 20
practica: 2
created: 2026-08-11
updated: 2026-09-04
tags: [practica, videos, youtube, secreto-perfecto, probabilidad, bayes, indistinguibilidad, eav, cuadrado-latino, arias, clase-02, pendiente]
sources: ["Clase 2 links.txt", "https://www.youtube.com/watch?v=ZE-bVO_tWBw", "https://www.youtube.com/watch?v=0H6Je7Z2ZMY", "https://www.youtube.com/watch?v=-65CBsJZr2g", "https://www.youtube.com/watch?v=4SPIG8uNneU"]
---

# Práctica 02 — Videos

> Fuente de los links: [`raw/practicas/Clase 2 links.txt`](../../raw/practicas/Clase%202%20links.txt) — cuatro títulos y cuatro URLs, nada más.
> **Los cuatro videos están mirados.** Son de **Ana Arias**, duran **14 min 4 s** entre los cuatro, están **ocultos** (*unlisted*) y se subieron los cuatro el **13/03/2021**. La hoja que filman está fechada a mano **16/3/2020**.
> Concepto: [[secreto-perfecto|Secreto perfecto]] · Marco: [[modelo-probabilistico-de-un-criptosistema|Modelo probabilístico de un criptosistema]] · Cuentas del mismo tipo, ya en el vault: [[probabilidad-y-criptografia|Probabilidad y criptografía]]

**Los cuatro videos son un solo ejercicio partido en tandas.** El tema es **secreto perfecto**, y lo que hacen es verificar que un esquema de juguete —dos claves equiprobables, dos mensajes con probabilidades $0{,}7$ y $0{,}3$, dos cifrados— lo tiene, **por las cuatro caracterizaciones equivalentes, una por una**. La Parte 0 arma la notación; la Parte 1 hace la definición 1; la Parte 2 hace la 2 y la 3; la Parte 3 hace la 4, que es el experimento $\mathsf{PrivK}^{\mathsf{eav}}_{A,\Pi}$.

Esta nota reúne **la resolución numérica completa**, desarrollada abajo. Los videos en sí valen poco por encima de eso: son 14 minutos de cámara cenital sobre una hoja, sin filminas, sin alumnos y sin nada que el vault no pueda contener escrito. **Lo que sí es único es la combinación**: es la única fuente de la cátedra que verifica las cuatro caracterizaciones sobre **un mismo esquema que sí cumple** y con **distribución de mensajes no uniforme**.

---

## Los cuatro videos

| Parte | Título real en YouTube | Etiqueta del archivo | Duración | Qué hace |
|---|---|---|---|---|
| **0** | *Criptografía y Seguridad - Clase 2 - Parte 0* | `clase 2 pt1` | 2:05 | Notación: $\Pi = (\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$ y los tres espacios. No resuelve nada |
| **1** | *… - Parte 1* | `clase 2 pt2` | 5:38 | Plantea el esquema, calcula $\Pr[C]$ y verifica la **definición 1** |
| **2** | *… - Parte 2* | `clase 2 pt3` | 2:29 | Verifica las **definiciones 2 y 3** |
| **3** | *… - Parte 3* | `clase 2 pt 4` | 3:52 | Verifica la **definición 4**: el experimento `Eav` |

Links: [Parte 0](https://www.youtube.com/watch?v=ZE-bVO_tWBw) · [Parte 1](https://www.youtube.com/watch?v=0H6Je7Z2ZMY) · [Parte 2](https://www.youtube.com/watch?v=-65CBsJZr2g) · [Parte 3](https://www.youtube.com/watch?v=4SPIG8uNneU)

Metadatos idénticos en los cuatro: canal **Ana Arias**, `upload_date` **20210313**, `availability` **unlisted**, resolución **640 × 360**. Las descripciones dicen, textualmente, *"Presentacion - Secreto Perfecto"* (Parte 0) y *"Parte 1 / 2 / 3 - Secreto Perfecto"*. **El tema está escrito por la propia autora en el metadato**, además de estar dicho en el audio y escrito a mano en la hoja: son tres evidencias independientes.

> [!quote]- Del video — Parte 0, primera oración (00:01)
> *"bueno, la clase que corresponde a la práctica 2, vamos a hacer un repaso de cómo se hace para demostrar que un esquema de [en]cripción tiene secreto perfecto"*
>
> *(El ASR escribe sistemáticamente "inscripción" por "encripción"; los corchetes marcan la corrección.)*

> [!quote]- Del video — Parte 1, apertura: el plan de los cuatro (00:00)
> *"para ver las cuatro definiciones que tenemos de esquemas de secreto perfecto vamos a utilizar en primer lugar este ejemplo"*

---

## La numeración del archivo de la cátedra está corrida en uno

El archivo etiqueta los links como `pt1`, `pt2`, `pt3` y `pt 4`. Los títulos reales son **Parte 0, 1, 2 y 3**. O sea que `pt1` es la **Parte 0**, `pt2` es la **Parte 1**, y así.

**Y el corrimiento no es sólo nominal: el contenido lo confirma.** La "Parte 0" es realmente la de apertura —muestra la hoja desde cero, dice *"vamos a hacer un repaso"*, arma la notación y no resuelve nada—, y la Parte 3 arranca diciendo que es *"la última forma"*. La numeración del raw es la que está mal alineada, no la de la autora.

**Consecuencia práctica:** si alguien de la cursada se refiere a "la parte 2", hay que preguntar cuál de las dos numeraciones está usando.

---

## Parte 0 — la notación del esquema

Dos minutos de encuadre, sin una sola cuenta. Sobre una hoja con el título ya escrito a mano —*"Criptografía  Práctica 2"* y el enunciado *"Cómo demostrar que un Esquema de Encripción tiene Secreto Perfecto"*—, la docente agrega en verde el árbol de los tres algoritmos:

$$\mathsf{Gen} \longrightarrow k \in \mathcal{K} \qquad\qquad c \leftarrow \mathsf{Enc}_k(m),\ m \in \mathcal{M} \qquad\qquad m = \mathsf{Dec}_k(c),\ c \in \mathcal{C}$$

y cierra con la terna y los tres conjuntos:

$$\Pi = (\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec}) \qquad\qquad \mathcal{K},\ \mathcal{M},\ \mathcal{C}$$

Dos detalles que sí vale registrar, porque son criterio y no adorno:

- **`Gen` es probabilístico y lo dice explícitamente** (00:18): elige la clave *"según una distribución probabilística"*. Es de dónde sale el $\Pr[K{=}k]$ del [[modelo-probabilistico-de-un-criptosistema|modelo probabilístico]].
- **`Enc` va con flecha y `Dec` con igual** — $c \leftarrow \mathsf{Enc}_k(m)$ contra $m = \mathsf{Dec}_k(c)$. La flecha marca el sorteo; el igual, el cálculo determinístico. Es exactamente la distinción de [[notacion-y-terminologia#4. Asignación y azar|Notación y terminología § Asignación y azar]].
- **$\mathcal{C}$ es derivado, no un dato** (01:12): el espacio de cifrados queda definido por $\mathcal{K}$, $\mathcal{M}$ y `Enc`. Es literal lo que dice la [[modelo-probabilistico-de-un-criptosistema|nota del modelo probabilístico]], que escribe $\mathcal{C}$ como la imagen de `Enc`.

El video corta justo antes de definir secreto perfecto: *"ahora lo que queremos demostrar, según propiedades y según definiciones, es cuándo un esquema de este tipo tiene el secreto perfecto"* (01:51). **No hay definición formal en la Parte 0** — arranca en la Parte 1.

> **Si ya leíste [[criptosistema|Criptosistema]], la Parte 0 no te aporta nada.** Son los mismos tres algoritmos y los mismos tres espacios. Está acá para que la serie se entienda completa, no porque haga falta mirarla.

---

## El ejercicio, resuelto de punta a punta

Esto es lo que hay que saber de estos videos. Todo lo que sigue está **escrito en la hoja o dicho en el audio**; lo que agregamos nosotros va rotulado.

### El esquema de juguete

$$\Pi = (\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$$
$$\mathcal{K} = \{k_0, k_1\},\qquad \Pr[K{=}k_0] = \Pr[K{=}k_1] = 0{,}5$$
$$\mathcal{M} = \{m_0, m_1\},\qquad \Pr[M{=}m_0] = 0{,}7,\qquad \Pr[M{=}m_1] = 0{,}3$$
$$\mathcal{C} = \{1, 2\}$$

Tabla de `Enc`, rotulada en la hoja *"Enc dado por"*:

| `Enc` | $k_0$ · 0,5 | $k_1$ · 0,5 |
|---|---|---|
| $m_0$ · 0,7 | 1 | 2 |
| $m_1$ · 0,3 | 2 | 1 |

$$\mathsf{Enc}_{k_0}(m_0) = 1,\quad \mathsf{Enc}_{k_1}(m_0) = 2,\quad \mathsf{Enc}_{k_0}(m_1) = 2,\quad \mathsf{Enc}_{k_1}(m_1) = 1$$

> **Ojo con la orientación de la tabla.** Acá los **mensajes van en las filas** y las claves en las columnas. El [[probabilidad-y-criptografia|apunte de probabilidad]] la escribe **transpuesta** (claves en filas). Es la misma tabla; si la copiás de una fuente a la otra sin darte cuenta, las condicionales te salen cruzadas.

**El punto pedagógico del ejemplo es la asimetría de $\Pr[M]$.** $0{,}7$ y $0{,}3$ no son uniformes, y el esquema **igual** tiene secreto perfecto. Es la respuesta al malentendido más común del tema: lo que tiene que quedar uniforme no es la distribución de los mensajes sino la de los cifrados, **para cada mensaje fijo**.

### Paso previo — la distribución de los cifrados

Lo primero que hace la Parte 1 (00:38–02:28) es lo que falta en el planteo: la marginal de $C$. Cada cifrado se arma sumando los casos disjuntos que lo producen, y cada término se factoriza por la [[modelo-probabilistico-de-un-criptosistema#Hipótesis de independencia|hipótesis de independencia]] entre mensaje y clave.

$$\Pr[C{=}1] = \Pr[M{=}m_0]\Pr[K{=}k_0] + \Pr[M{=}m_1]\Pr[K{=}k_1] = 0{,}7\cdot 0{,}5 + 0{,}3\cdot 0{,}5 = 0{,}35 + 0{,}15 = 0{,}5$$

$$\Pr[C{=}2] = \Pr[M{=}m_0]\Pr[K{=}k_1] + \Pr[M{=}m_1]\Pr[K{=}k_0] = 0{,}35 + 0{,}15 = 0{,}5$$

**Los dos cifrados quedan equiprobables aunque los mensajes no lo sean.** Y lo dice explícitamente: esto se calcula ahora porque hace falta *"para algunas partes de las demostraciones"* — es el lado izquierdo de la definición 2 y el denominador de Bayes de la definición 1.

> [!quote]- Del video — Parte 1, la independencia como habilitación de la cuenta (01:24)
> *"esta combinación de las claves respecto de los mensajes, si son independientes, entonces acá simplemente es cuestión de multiplicar"*

### Definición 1 — criterio del mensaje

Numerada `1.` en la hoja (Parte 1, 02:28):

$$\Pr[M{=}m] = \Pr[M{=}m \mid C{=}c] \qquad \forall m \in \mathcal{M},\ \forall c \in \mathcal{C}$$

Es **la definición** de [[secreto-perfecto#Definición|secreto perfecto]]: ver el cifrado no cambia lo que el adversario cree del mensaje.

**Primero por inspección** (03:35). Para $m_0$ y $c = 1$: a priori $\Pr[M{=}m_0] = 0{,}70$; los únicos casos que producen el cifrado $1$ son $(m_0, k_0)$ y $(m_1, k_1)$, con masas $0{,}35$ y $0{,}15$, así que la parte que viene de $m_0$ es $0{,}35 / 0{,}5 = 0{,}70$. Coincide, y lo tilda.

**Después "de forma más formal", con Bayes** (04:12):

$$\Pr[M{=}m_0 \mid C{=}1] \;=\; \frac{\Pr[M{=}m_0]\cdot \Pr[C{=}1 \mid M{=}m_0]}{\Pr[C{=}1]} \;=\; \frac{0{,}7 \cdot 0{,}5}{0{,}5} \;=\; 0{,}7$$

donde el $\Pr[C{=}1 \mid M{=}m_0] = 0{,}5$ **se lee del renglón $m_0$ de la tabla**: fijado el mensaje, el $1$ sale con $k_0$ y el $2$ con $k_1$, cada una con $0{,}5$. Cierra en $0{,}7$, *"lo mismo que habíamos intuido antes"*, y escribe **Secreto Perfecto** en naranja.

**Aclara ella misma que el chequeo está incompleto**: habría que hacerlo para todos los $m$ y todos los $c$, salvo que uno falle antes y ahí ya se cae. La tabla entera está más abajo.

### Definición 2 — criterio del cifrado

Numerada `2.` en la hoja (Parte 2, 00:00–01:45):

$$\Pr[C{=}c] = \Pr[C{=}c \mid M{=}m] \qquad \forall m,\ \forall c$$

La presenta como **recíproca de la definición 1** y aclara que la equivalencia se puede demostrar. Evaluada en $c = 1$:

$$\Pr[C{=}1] = 0{,}5 \qquad \Pr[C{=}1 \mid M{=}m_0] = \Pr[K{=}k_0] = 0{,}5 \qquad \Pr[C{=}1 \mid M{=}m_1] = \Pr[K{=}k_1] = 0{,}5$$

**El método concreto, que es lo transferible al parcial:** fijado el mensaje, uno se para en su renglón de la tabla y suma las probabilidades de **las claves que llevan ese mensaje a ese cifrado**. Como cada cifrado aparece **una sola vez por renglón** y las claves son equiprobables, siempre da $0{,}5$. Es la fórmula operativa de [[secreto-perfecto#¿De dónde salen esas probabilidades?|secreto perfecto § ¿De dónde salen esas probabilidades?]], aplicada a mano.

Las tres cantidades coinciden y anota **Secreto Perfecto** al margen.

### Definición 3 — indistinguibilidad de mensajes

Numerada `3.` en la hoja (Parte 2, 01:45–02:12):

$$\Pr[C{=}c \mid M{=}m_0] = \Pr[C{=}c \mid M{=}m_1] \qquad \forall m_0, m_1 \in \mathcal{M}$$

La trata como consecuencia inmediata de lo anterior: los dos valores ya están calculados, así que escribe $0{,}5 = 0{,}5$ y vuelve a anotar **Secreto Perfecto**. Es la [[secreto-perfecto#Caracterización equivalente|caracterización equivalente]] de la nota de concepto.

**Es la única de las cuatro que no menciona $\Pr[M]$ en ninguna parte** — y por eso es la que de verdad cierra el caso, como está explicado abajo.

Cierra la Parte 2 con la advertencia metodológica: en rigor hay que verificarlo para todos los cifrados y todos los mensajes; como acá hay sólo dos de cada uno, falta apenas un caso más. *(El ASR de ese tramo está roto y no se cita textual.)*

### Definición 4 — el experimento PrivK-eav

Toda la Parte 3, numerada `4.` en la hoja como *"Experimento $\mathsf{PrivK}^{\mathsf{eav}}_{A,\Pi}$"*. Arranca diciendo que es **la última forma**:

> [!quote]- Del video — Parte 3, apertura (00:00)
> *"la última forma de demostrar que un esquema tiene secreto perfecto es haciendo la prueba de lo que se conoce como experimento frente a adversarios pasivos"*

**El experimento, tal cual está escrito en la hoja** (00:10–00:55):

$$\begin{aligned}
&1)\ \ A \text{ emite } m_0,\ m_1\\
&2)\ \ A \text{ recibe } c = \mathsf{Enc}_k(m_b),\ \text{ con } b \leftarrow \{0,1\}\\
&3)\ \ A \text{ emite } b'\\
&4)\ \ \text{si } b' = b \text{ hay ÉXITO; si no, no}
\end{aligned}$$

**Criterio**, escrito con fibrón a 01:13:

$$\Pr\big[\mathsf{PrivK}^{\mathsf{eav}}_{A,\Pi} = 1\big] = 0{,}5 \quad\Longrightarrow\quad \Pi \text{ tiene secreto perfecto}$$

Explica el superíndice: `eav` es por el adversario **pasivo**, el que sólo observa el canal.

**Se fija una estrategia concreta del adversario** (01:35, a lápiz en el margen) — sin esto no se puede contar nada:

$$b' = \begin{cases} 0 & \text{si } c = 1 \\ 1 & \text{en caso contrario} \end{cases}$$

**Y se recorren los cuatro casos**, cruzando con la tabla de `Enc` de arriba (02:16–03:29):

| $b$ | mensaje cifrado | $k$ | $c = \mathsf{Enc}_k(m_b)$ | $b'$ | ¿Acierta? |
|---|---|---|---|---|---|
| 0 | $m_0$ | $k_0$ | 1 | 0 | **Sí** |
| 0 | $m_0$ | $k_1$ | 2 | 1 | No |
| 1 | $m_1$ | $k_0$ | 2 | 1 | **Sí** |
| 1 | $m_1$ | $k_1$ | 1 | 0 | No |

Dos aciertos sobre cuatro casos equiprobables:

$$\Pr\big[\mathsf{PrivK}^{\mathsf{eav}}_{A,\Pi} = 1\big] = \frac{2}{4} = 0{,}5$$

*"Acertó el 50 por ciento de los casos"*, y cierra: *"con probabilidad de 0,50 en este caso podemos decir que el secreto es perfecto"*. **Secreto Perfecto**, cuarta vez.

> **Por qué los cuatro casos son equiprobables, que el video no explicita.** ***(Lectura nuestra.)*** Porque $b$ es uniforme por definición del experimento y $k$ es uniforme por `Gen`, y son independientes: cada par $(b, k)$ pesa $\tfrac12\cdot\tfrac12 = \tfrac14$. **El $0{,}7$ / $0{,}3$ de $\Pr[M]$ no entra en esta cuenta**, y no puede entrar: los dos mensajes los elige el adversario, no los sortea la fuente. Es la diferencia estructural entre esta caracterización y las tres anteriores, y es también la razón de que sea la más limpia de aplicar.

### Lo que la verificación deja abierto

Los videos verifican **un caso de cada definición** y lo dicen. Acá va lo que falta, que es corto y es exactamente lo que hay que saber escribir en un parcial.

***(Desarrollo nuestro. Los videos no lo hacen; sí anuncian que habría que hacerlo.)***

**Definición 1, la tabla completa.** Con $\Pr[C{=}1] = \Pr[C{=}2] = 0{,}5$ y una única clave por casilla:

| A posteriori | $c = 1$ | $c = 2$ | A priori | ¿Coincide? |
|---|---|---|---|---|
| $\Pr[M{=}m_0 \mid C{=}c]$ | $0{,}35/0{,}5 = 0{,}7$ | $0{,}35/0{,}5 = 0{,}7$ | $0{,}7$ | Sí |
| $\Pr[M{=}m_1 \mid C{=}c]$ | $0{,}15/0{,}5 = 0{,}3$ | $0{,}15/0{,}5 = 0{,}3$ | $0{,}3$ | Sí |

**Definiciones 2 y 3, la tabla completa.** Es la misma tabla leída de dos maneras: contra la marginal (def. 2) y las filas entre sí (def. 3).

| $\Pr[C{=}c \mid M{=}m]$ | $c = 1$ | $c = 2$ |
|---|---|---|
| $m = m_0$ | $\Pr[K{=}k_0] = 0{,}5$ | $\Pr[K{=}k_1] = 0{,}5$ |
| $m = m_1$ | $\Pr[K{=}k_1] = 0{,}5$ | $\Pr[K{=}k_0] = 0{,}5$ |
| **$\Pr[C{=}c]$** | $0{,}5$ | $0{,}5$ |

Las dos filas son iguales entre sí **y** a la marginal: las definiciones 2 y 3 se cumplen para los cuatro pares.

**Definición 4, todos los adversarios.** El video prueba **una** estrategia, y en el margen de la hoja hay dos marcas a lápiz, *"1ª"* y *"2ª"*, de las que sólo se completa la primera — el bloque *"2ª"* queda vacío al terminar el video. Como sólo hay dos cifrados observables, un adversario determinístico es una función $\{1,2\} \to \{0,1\}$, y hay exactamente cuatro:

| Estrategia | $c{=}1 \mapsto$ | $c{=}2 \mapsto$ | Aciertos sobre 4 | $\Pr[\mathsf{PrivK}^{\mathsf{eav}}_{A,\Pi} = 1]$ |
|---|---|---|---|---|
| la del video | $0$ | $1$ | 2 | $0{,}5$ |
| la complementaria | $1$ | $0$ | 2 | $0{,}5$ |
| constante en 0 | $0$ | $0$ | 2 (los dos con $b{=}0$) | $0{,}5$ |
| constante en 1 | $1$ | $1$ | 2 (los dos con $b{=}1$) | $0{,}5$ |

Las cuatro dan $0{,}5$, y cualquier adversario aleatorizado es una combinación convexa de éstas, así que también. **Recién ahí el criterio queda verificado para todo $A$**, que es lo que la definición pide.

**Y el argumento que hace innecesario todo lo anterior: es un cuadrado latino.** La tabla de `Enc` no repite valores ni en filas ni en columnas. Con claves uniformes, eso fuerza

$$\Pr[C{=}c \mid M{=}m] = \frac{1}{\lvert\mathcal{K}\rvert} = 0{,}5 \qquad \text{independiente de } m$$

y por lo tanto hay secreto perfecto **para cualquier distribución sobre $\mathcal{M}$**, no sólo para la $0{,}7$ / $0{,}3$ del enunciado. **Esto importa y no es un detalle formal**: la [[secreto-perfecto#Definición|definición]] cuantifica sobre *toda* distribución de mensajes, así que verificar las definiciones 1 y 4 con un $\Pr[M]$ fijo no certifica nada por sí solo. La que cierra el caso es la definición 3, que no menciona $\Pr[M]$. El argumento completo está en [[probabilidad-y-criptografia#Por qué funciona: es un cuadrado latino|Probabilidad y criptografía § Por qué funciona: es un cuadrado latino]].

> **Y es, otra vez, el mismo objeto de siempre.** Identificando $m_0, 1 \mapsto 0$ y $m_1, 2 \mapsto 1$, el esquema es el [[cifrado-por-rotacion|cifrado por rotación]] sobre $(\mathbb{Z}_2, +)$ con $\ell = 1$, o sea el [[one-time-pad|one-time pad]] de un bit. Todo el ejercicio es el caso más chico posible del [[one-time-pad#El OTP tiene secreto perfecto|lema del OTP]].

---

## Qué aporta esto sobre lo que ya estaba en el vault

Sin inflar: **la teoría no es nueva y las cuentas de este tipo tampoco.** Lo que sigue separa lo que aporta de lo que ya estaba.

**Lo que ya estaba, y con más desarrollo que en los videos:**

- La definición y las caracterizaciones equivalentes → [[secreto-perfecto|Secreto perfecto]].
- Las tres fórmulas y la hipótesis de independencia → [[modelo-probabilistico-de-un-criptosistema#Las tres fórmulas derivadas|Modelo probabilístico de un criptosistema]].
- El experimento paso a paso, y su versión computacional con $\varepsilon(n)$ → [[pruebas-de-indistinguibilidad#Las tres pruebas|Pruebas de indistinguibilidad]].
- **Un ejemplo casi idéntico, ya resuelto** → el [[probabilidad-y-criptografia#2. Ejemplo 1 — sí hay secreto perfecto|Ejemplo 1 de Probabilidad y criptografía]]: mismos dos mensajes, dos claves y dos cifrados, mismo cuadrado latino. La diferencia es que ahí $\Pr[M]$ es uniforme.
- **Las cuatro maneras, en el caso negativo** → el [[guia-02-resolucion#b) Las cuatro demostraciones|Ejercicio 1 de la Guía 2]], que refuta el secreto perfecto por las mismas cuatro y en el mismo orden.

**Lo que sí aportan los videos:**

1. **$\Pr[M]$ no uniforme.** Es la única fuente del vault que exhibe un esquema con **secreto perfecto y mensajes desbalanceados**. El apunte usa $0{,}5$ / $0{,}5$ en el caso que cumple, así que ahí la asimetría nunca se ve.
2. **Las cuatro caracterizaciones sobre un esquema que sí cumple.** La [[guia-02-resolucion#Ejercicio 1|Guía 2]] hace las cuatro pero para **refutar**, que es más barato: alcanza un contraejemplo. Acá se ve el costo del caso afirmativo, que es la tabla entera.
3. **El experimento `Eav` calculado por tabla de casos $(b, k)$**, con un resultado que da **exactamente** $0{,}5$. El vault tiene los cálculos que dan $3/4$ y $2/3$ —los dos casos que fallan— pero ninguno que dé el valor de borde.
4. **El puente con la teórica del 13/08.** Ahí el docente enuncia esta cuarta caracterización en una línea, sin cuenta: *"si esto da exacto 0,5 es porque es secreto perfecto"* ([[clase-02-cifrado|Clase 02]], cue pt1 403). **Estos videos son esa línea hecha número.**

**Lo que no aportan:** la Parte 0 entera (2:05 de notación ya cubierta), y la advertencia repetida tres veces de que habría que verificar todos los casos. Si el tiempo es escaso, **la Parte 1 y la Parte 3 son las dos que valen**; la 2 son dos definiciones que salen de la tabla que la 1 ya construyó.

---

## Las dos fechas: 16/3/2020 y 13/03/2021

**Ninguna de las dos estaba en el vault, y las dos son verificables.**

| Dato | Valor | Cómo se verifica | Día de la semana |
|---|---|---|---|
| Fecha manuscrita en la hoja | **16/3/2020** | Escrita a mano en el casillero impreso `FECHA / DATA` de la hoja. Legible en pantalla de punta a punta en la **Parte 0** y en la **Parte 1** | **lunes** |
| Subida a YouTube | **13/03/2021** | `upload_date: 20210313` en los metadatos de los cuatro videos | sábado |

La lectura del año se verificó **con zoom, por dos agentes independientes, sobre frames distintos** de los dos videos: el último dígito es un cero cerrado, idéntico al primer $0$ de "2020". No es OCR dudoso.

**Las dos fechas no se contradicen, se complementan:** es material grabado en **marzo de 2020** y publicado casi un año después, en **marzo de 2021**, para la cohorte siguiente. Lo que sostiene que el 2020 es real y no el error de tipeo típico de principios de año es el día de la semana: **16/3/2020 fue lunes** —el día habitual de las prácticas— y **16/3/2021 fue martes**.

> ***(Lectura nuestra.)*** Marzo de 2020 es la semana en que se suspendieron las clases presenciales en el país, y el formato de los videos es exactamente el que esa situación produce: cámara de celular cenital sobre una hoja de carpeta, grabado en soledad, sin alumnos, sin preguntas, sin filminas, partido en tandas de dos a cinco minutos. **Nada de esto está dicho en los videos** — es la explicación más económica de la forma que tienen, no un dato.

**La numeración "Práctica 2" también es de 2020.** La hoja dice *"Criptografía  Práctica 2"* y el audio *"la clase que corresponde a la práctica 2"*: es la práctica 2 de **aquella** cursada. Que coincida con la Práctica 2 de 2026 no es prueba de nada más que de que el secreto perfecto cae en el mismo lugar del programa los dos años.

---

## Por qué la cátedra los linkea en 2026

Esta parte **cambia respecto de la versión anterior de la nota**, que decía que los videos "cubrían el feriado". La inferencia sigue viva, pero hay que partirla en dos.

**Lo que es dato:**

- La [[practica-01-esquemas-y-taxonomias|Práctica 01]] fue el lunes **10/08** y la [[practica-03-seudoaleatoriedad-y-modos|Práctica 03]] el lunes **24/08** (fecha impresa en su PDF). En el medio hay **un solo lunes: el 17/08, feriado** ([[cronograma]]).
- Al abrir la clase del **20/08**, el docente dice *"como tampoco vieron el lunes"* (cue pt2 24): **ese lunes no hubo clase presencial**.
- Al cerrar la clase del **13/08** —la que desarrolla secreto perfecto— anuncia: *"y ahora lo van a ver con Ana. Ana les va a hacer un súper repaso y ya empezar a ir con las prácticas"* (cue pt1 857).
- Los cuatro videos son **de Ana Arias** y son, literalmente, un **repaso de secreto perfecto** — la Parte 0 usa esa misma palabra en su primera oración.

**Lo que es lectura nuestra:**

> ***(Lectura nuestra.)*** El *"súper repaso con Ana"* prometido el 13/08 y los cuatro videos son **la misma cosa**: la práctica del lunes 17/08 caía en feriado, y la cátedra tapó el hueco reciclando el material de archivo que ya tenía sobre exactamente ese tema. Encaja la fuente (Ana), el tema (secreto perfecto), la palabra (*repaso*), la posición en el programa y el hueco en el calendario. **Pero sigue siendo una inferencia**: nadie de la cátedra dijo que estos cuatro links sean la Práctica 2 de 2026, y el archivo `Clase 2 links.txt` no trae fecha ni tema.

**Lo que ya NO se puede decir, y la versión anterior de esta nota decía:**

- Que **no hay fecha verificable**. Hay dos: 16/3/2020 y 13/03/2021.
- Que **no se sabe el tema**. Es secreto perfecto, con evidencia triple.
- Que los videos se **grabaron** para el feriado del 17/08/2026. Son de 2020. Lo que puede haber sido decidido en 2026 es **linkearlos**, no grabarlos.

> **Un candidato para cuándo se linkearon, que no alcanza para cerrar.** El 20/08 el docente dice *"subimos varios links de vídeos"* (cue pt2 27), en el mismo tramo en que presenta los apuntes de Ana. **Podría ser este archivo**, pero está dicho junto a los videos de teoría de números y a otros apuntes, así que no identifica cuáles. ***(Lectura nuestra, y débil: no lo usamos para fechar nada.)***

---

## Los videos no están muertos: cómo se bajan

Dato operativo, porque cuesta media hora descubrirlo: **`yt-dlp` con su player client por defecto devuelve `This video is not available` para los cuatro**. No están borrados ni caídos — están **ocultos** (*unlisted*) y el cliente web es el que falla.

Forzando el cliente **android** o **ios** bajan los cuatro sin problema:

```sh
yt-dlp --extractor-args "youtube:player_client=android" "https://www.youtube.com/watch?v=ZE-bVO_tWBw"
```

Siguen sin aparecer en la búsqueda de YouTube ni en la lista pública del canal: **el link es la única puerta**, así que conviene no perder [`Clase 2 links.txt`](../../raw/practicas/Clase%202%20links.txt).

---

## Lo que no se pudo leer, y el ASR

- **Las transcripciones son subtítulos automáticos de YouTube y están rotas en el vocabulario de la materia.** "Encripción" sale siempre como "inscripción"; "k cero" como "casero"; "la clave uno" como "la prueba uno"; "secreto perfecto" como "secreto compartido" (Parte 1, 05:14); "b cero" como "el becerro" (Parte 3). **Todos los valores numéricos de esta nota salen de la hoja filmada, no del ASR** — el ASR imprime "0 50" y "0 70" sin coma y no es fuente confiable para eso.
- **Las citas textuales de esta nota son de tramos donde el subtítulo está limpio**, con corrección entre corchetes donde hacía falta. Los tramos rotos se parafrasean y se avisa.
- **El borde superior de la hoja está fuera de cuadro en la Parte 2**, así que ahí no se ve el encabezado. La fecha se lee en la Parte 0 y en la Parte 1, que sí lo muestran.
- **En la Parte 1, a partir de 04:22, asoma otra hoja al borde del encuadre** con una anotación circulada que podría ser un "03" o un "0,3". Está fuera de foco y cortada: **no se pudo leer**, y no se cuenta como número de guía ni de ejercicio.
- **Los conjuntos están manuscritos en caligráfica y el video es de 640 × 360.** Se leen como $\mathcal{K}$, $\mathcal{M}$, $\mathcal{C}$, consistente con lo que dice el audio ("espacio de claves, de mensajes, de cifrados") y con Katz & Lindell, pero el trazo de la $\mathcal{C}$ es el menos nítido de la hoja.
- **No hay número de guía ni de ejercicio en ninguno de los cuatro.** El enunciado general del ejercicio —la consigna original— **nunca aparece en pantalla**: la Parte 3 arranca directo con el ítem 4. Los únicos números visibles son el `1.`, `2.`, `3.` y `4.` que rotulan las cuatro definiciones, y confundirlos con números de ejercicio es el error fácil.

---

## Pendientes

- **Confirmar en clase o en el campus** que estos cuatro links son la Práctica 2 de 2026 y que corresponden al lunes 17/08. Es lo único que queda abierto de la datación, y ninguna fuente disponible lo dice.
- Chequear si en el campus están acompañados de un enunciado escrito: el ejercicio que resuelven **no está numerado** en ninguna guía del vault, y su consigna original no aparece en los videos.

---

## Ver también

- [[secreto-perfecto|Secreto perfecto]] — la definición y las caracterizaciones que estos videos verifican una por una
- [[modelo-probabilistico-de-un-criptosistema|Modelo probabilístico de un criptosistema]] — de dónde salen $\Pr[M]$, $\Pr[K]$ y la marginal de $C$
- [[probabilidad-y-criptografia|Probabilidad y criptografía]] — el apunte de la misma docente, con el ejemplo gemelo (mismo cuadrado latino, $\Pr[M]$ uniforme) y el caso que **no** cumple
- [[pruebas-de-indistinguibilidad|Pruebas de indistinguibilidad]] — el experimento de la Parte 3, y su versión computacional con $\varepsilon(n)$
- [[one-time-pad|One Time Pad]] — de lo que el esquema del ejercicio es el caso de un bit
- [[guia-02-resolucion#Ejercicio 1|Guía 2 — Resolución]] — las mismas cuatro maneras, en el mismo orden, sobre un esquema que **no** tiene secreto perfecto
- [[clase-02-cifrado|Clase 02 — Cifrado simétrico]] — la teórica del 13/08 que estos videos repasan, y donde el docente enuncia la cuarta caracterización sin hacer la cuenta
- [[practica-01-esquemas-y-taxonomias|Práctica 01 — Esquemas y taxonomías]] — la práctica del 10/08, con filminas
- [[practica-03-seudoaleatoriedad-y-modos|Práctica 03 — Seudoaleatoriedad y modos]] — la del 24/08; es su fecha la que cierra la ventana de ésta
- [[videografia|Videografía]] — el mapa de todos los videos del vault; **estos cuatro no son de la playlist de Ramele**, son de otro canal y de la clase práctica
- [[cronograma|Cronograma]]
