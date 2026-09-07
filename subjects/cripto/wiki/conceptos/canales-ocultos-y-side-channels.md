---
title: Canales ocultos y side channels
resumen: 'Canal de comunicación que no fue diseñado para ello, espacial o temporal y caracterizado por ruido y ancho de banda, y el ataque lateral que recupera el exponente secreto midiendo el tiempo de una exponenciación modular.'
fuentes: ["[[clase-09-flujo-de-informacion]]", "[[problema-del-confinamiento]]", "[[video-11-flujo-de-informacion]]"]
aliases: [Canales ocultos, Covert channel, Canal oculto espacial, Canal oculto temporal, Timing attack, Ataque de canal lateral]
type: concepto
unidad: 2
clase: 9
orden: 8
created: 2026-09-04
updated: 2026-09-06
tags: [seguridad, flujo-de-informacion, canales-ocultos, side-channel, timing-attack, exponenciacion-modular, bloque-2, clase-09, sin-dictar]
sources: ["Clase 10 - Aplicaciones - Flujo de informacion.pdf"]
---

# Canales ocultos y side channels

**El mecanismo concreto por el que el [[problema-del-confinamiento|problema del confinamiento]] deja de ser una preocupación teórica: cualquier recurso compartido y medible se puede convertir en un canal de comunicación que nadie diseñó para eso, y un atacante puede usarlo para robar información en vez de para comunicarse.** Cierra con el único ejemplo de todo el deck donde esta clase de seguridad toca criptografía concreta: un ataque de tiempo sobre la exponenciación modular.

Cubre las filminas **21 a 23** del deck `Clase 10 - Aplicaciones - Flujo de informacion.pdf`. La clase todavía no se dictó —hoy es 04/09/2026—, así que esta nota está escrita sólo contra el PDF; lo que no sale literal de la filmina va marcado como *(lectura nuestra)*.

## Canal oculto: definición y clasificación

**Filmina 21.** Un **canal oculto** es *un canal de comunicación que no fue diseñado para ello*. Se clasifica según qué propiedad del recurso compartido explota:

| Tipo | Explota |
|---|---|
| **Espacial** | Atributos de recursos compartidos —cuánto espacio, cuánta capacidad, en qué estado quedó algo— |
| **Temporal** | Información temporal o de **orden** en el acceso a recursos compartidos —cuánto tardó, en qué secuencia pasó algo— |

Y dos atributos con los que se lo caracteriza, independientes de la clasificación anterior:

- **Ruido** — la capacidad de interferencia no premeditada de terceras partes: cuánto "ensucian" la señal otros procesos que comparten el mismo recurso sin participar del canal.
- **Ancho de banda** — la tasa de transmisión del canal: cuántos bits por unidad de tiempo se pueden hacer pasar de manera confiable.

El ejemplo de [[problema-del-confinamiento#Un ejemplo de por qué "medible" implica "explotable"|cuota de disco]] de la nota anterior es un canal **espacial** —el bit se codifica en un atributo del recurso (cuánto espacio libre queda), no en cuándo se lo mide—. El ejemplo de CPU que sigue es la contracara **temporal**.

### La conexión con la entropía condicional

*(Lectura nuestra: la filmina 21 no hace esta conexión; la hace, en cambio, el video de la cátedra que cubre este mismo deck.)* La filmina define "canal oculto" sin volver a mencionar entropía, pero el vocabulario de "leakage" —fuga— que se usa para hablar de estos canales es, literalmente, el mismo criterio de la [[flujo-de-informacion#La definición formal|definición de flujo]] de la filmina 8:

> [!quote]- Citado en Video 11 — el leakage como caída de entropía condicional (44:50)
> *"Ahí aparece la idea del leak de información: el leakage va a ser algo que me va a permitir reducir la entropía condicional de lo que yo quiero que permanezca oculto."*

Dicho en la notación de esta clase: un canal oculto **es** un $y$ tal que $H(x_s \mid y_t) < H(x_s)$ para el secreto $x$ que se quiere proteger, con la única diferencia de que acá $y$ no es una variable del programa sino un recurso físico compartido —tiempo de CPU, espacio en disco, contención de un lock—. El "ancho de banda" del canal es, en esos términos, la velocidad a la que esa entropía condicional cae a medida que se repiten las observaciones.

## Un canal temporal completo: CPU compartida

**Filmina 22.** Dos procesos $a$ y $b$ tienen prohibido comunicarse, pero corren en el mismo servidor y comparten la CPU. Eso alcanza para construir un canal con su propia codificación:

- Para enviar un **bit 0**, el proceso $a$ devuelve el control al sistema operativo **inmediatamente**.
- Para enviar un **bit 1**, el proceso $a$ hace uso **intensivo** de su *slot* temporal.
- El proceso $b$ accede al reloj de tiempo real y mide cuánto tarda en recuperar el control de la CPU: si tardó más de lo esperado, infiere que $a$ estaba en el caso de uso intensivo, y decodifica un $1$; si tardó lo normal, decodifica un $0$.

No hay ninguna llamada entre $a$ y $b$ —la prohibición de comunicarse se respeta al pie de la letra—, y sin embargo el bit llega. Es exactamente el enunciado del [[problema-del-confinamiento#Aislación total: la solución que no se puede alcanzar|problema del confinamiento]] hecho carne: dos procesos aislados en el papel construyen igual un canal completo sobre un recurso —el planificador de la CPU— que nadie diseñó para transmitir nada.

## Side channel attack: la exponenciación modular

**Filmina 23.** Un **side channel attack** *hace uso de un canal oculto para ganar información* — la diferencia con el ejemplo anterior es que acá nadie está transmitiendo a propósito: un atacante externo explota un canal que el propio programa deja abierto sin querer, contra un secreto que ese programa nunca pensó exponer. El caso de la filmina es el algoritmo estándar de cuadrado-y-multiplicación para calcular $a^{b} \bmod n$:

$$\begin{aligned}
&x := 1;\quad a_{\mathrm{tmp}} := a \\
&\textbf{for } i := 0 \textbf{ to } k-1 \textbf{ do begin} \\
&\quad \textbf{if } b_i = 1 \textbf{ then } x := (x \cdot a_{\mathrm{tmp}}) \bmod n; \\
&\quad a_{\mathrm{tmp}} := (a_{\mathrm{tmp}} \cdot a_{\mathrm{tmp}}) \bmod n; \\
&\textbf{end} \\
&\mathrm{result} := x
\end{aligned}$$

donde $b_i$ es el $i$-ésimo bit de la representación binaria de $b$, con $b_0$ el bit menos significativo. Es el mismo algoritmo de exponenciación rápida que aparece en cualquier implementación de RSA o de Diffie-Hellman, y la notación modular con paréntesis es la de [[aritmetica-modular-y-divisibilidad|Aritmética modular y divisibilidad]]. **El ataque, en una línea:** la multiplicación de la rama `if` sólo se ejecuta cuando $b_i = 1$; el "cuadrado" ($a_{\mathrm{tmp}} := a_{\mathrm{tmp}}^2 \bmod n$) se ejecuta siempre. Entonces **el tiempo total de ejecución depende de cuántos bits de $b$ valen 1**, y con métodos estadísticos se puede reconstruir parte de $b$ — que es, típicamente, el exponente secreto de un esquema como RSA o Diffie-Hellman.

### El ataque, verificado con un ejemplo numérico

*(Lectura nuestra: la filmina no trae ningún ejemplo numérico; éste se arma y se verifica acá para mostrar exactamente qué es lo que el tiempo revela.)* Sea $a = 3$, $n = 11$, y el exponente secreto $b = 5$, es decir $k=3$ bits con $b_0=1,\ b_1=0,\ b_2=1$ (porque $5 = 1\cdot 2^0 + 0\cdot 2^1 + 1\cdot 2^2$).

$$
\begin{array}{c|c|c|c}
i & b_i & x \text{ tras esta ronda} & a_{\mathrm{tmp}} \text{ tras esta ronda} \\ \hline
- & - & 1 & 3 \\
0 & 1 & (1\cdot 3)\bmod 11 = 3 & (3\cdot 3)\bmod 11 = 9 \\
1 & 0 & 3 \text{ (sin cambios)} & (9\cdot 9)\bmod 11 = 81\bmod 11 = 4 \\
2 & 1 & (3\cdot 4)\bmod 11 = 12\bmod 11 = 1 & (4\cdot 4)\bmod 11 = 16\bmod 11 = 5
\end{array}
$$

$\mathrm{result} = x = 1$. Verificación directa: $3^{5} = 243$, y $243 = 22\cdot 11 + 1$, así que $3^{5}\bmod 11 = 1$ — coincide.

**Lo que el tiempo filtra.** En esta corrida la multiplicación de la rama `if` se ejecutó en $i=0$ y en $i=2$: **dos** veces, porque $b$ tiene dos bits en 1 —su peso de Hamming es 2—. El "cuadrado" se ejecutó las tres veces, siempre. Si en cambio $b$ hubiera sido, por ejemplo, $b=4$ (binario $100$, un solo bit en 1), la misma cadena de tres rondas habría hecho sólo **una** multiplicación de rama en vez de dos, y habría tardado menos. **El tiempo total de ejecución es, hasta una constante, una función lineal del peso de Hamming de $b$** —cuenta cuántos unos tiene el exponente, no en qué posiciones están—.

**De contar unos a saber cuáles son unos.** Lo anterior alcanza para filtrar el peso de Hamming con una sola medición, pero el ataque real es más fino: si el atacante puede pedir la exponenciación repetidas veces con la **misma** clave secreta $b$ y **distintas** bases $a$ conocidas, puede medir el tiempo de cada ronda por separado —no sólo el total—. Como el tiempo de la ronda $i$ depende únicamente de $b_i$ y de los valores intermedios de esa ronda (que el atacante puede calcular para cada hipótesis de $b_i$ porque conoce $a$), correlacionar estadísticamente el tiempo medido contra cada hipótesis $b_i=0$ o $b_i=1$ permite reconstruir el exponente **bit por bit**, empezando por $b_0$ y avanzando. Esta técnica —correlación estadística sobre mediciones repetidas para separar bit por bit lo que una sola medición sólo entrega agregado— es la que Paul Kocher publicó en 1996 contra implementaciones reales de Diffie-Hellman, RSA y DSS, y es el motivo por el que toda implementación seria de exponenciación modular hoy corre en **tiempo constante**, sin ninguna rama que dependa del valor de un bit secreto. *(Lectura nuestra, contexto histórico: ni la filmina ni el ejemplo numérico anterior son de Kocher; el ataque de la filmina es la versión mínima —peso de Hamming vía tiempo total— y esta es la generalización a bit por bit.)*

### El mismo problema, del otro lado del curso

*(Lectura nuestra.)* Éste no es el único side channel de tiempo que el curso toca: la nota de [[cbc-mac#Lo que la clase no dice sobre los MACs iterativos|CBC-MAC]] ya había señalado que comparar una etiqueta byte a byte y cortar en la primera diferencia filtra cuántos bytes coinciden —el caso documentado de la Xbox 360, con una diferencia de tiempo de apenas 2,2 ms—. Es la misma estructura del ataque de esta filmina: una operación cuyo **tiempo** depende de un valor que se supone secreto, con la diferencia de que allá el defecto está en la comparación de `Vrfy` y acá en el propio algoritmo de exponenciación. Los dos son el mismo recordatorio: una construcción matemáticamente segura puede filtrar igual si la implementación no corre en tiempo constante.
