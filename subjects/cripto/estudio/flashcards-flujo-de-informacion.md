---
tipo: flashcards
titulo: Flujo de información
id: flujo-de-informacion
division: "9"
descripcion: Flujo explícito e implícito, entropía, canales ocultos y el problema del confinamiento.
---

## ¿Por qué el ejemplo de los exámenes y `/tmp` muestra que el control de acceso no controla la información? {#flujo-de-informacion:acl-tmp-examenes}
> pagina: control-de-acceso-y-flujo-de-informacion

Las dos ACLs son, por separado, correctas:

$$
\mathrm{ACL}(\texttt{/var/cys/examenes}) = \{(\texttt{pablo},r),\ (\texttt{ana},r)\}
$$
$$
\mathrm{ACL}(\texttt{/tmp}) = \{(\texttt{pablo},rw),\ (\texttt{ana},rw),\ (\texttt{juan},rw)\}
$$

`juan` no aparece en la primera, así que no tiene ningún derecho sobre los exámenes. Pero si el editor de textos guarda una copia de trabajo en `/tmp`, esa copia es un **objeto distinto**, con la ACL permisiva de `/tmp`, y `juan` termina leyendo el contenido del examen sin haber tocado nunca el objeto protegido.

## ¿Cuál es la tesis de la filmina 4 sobre qué restringen las políticas, y qué se concluye sobre las ACLs? {#flujo-de-informacion:politicas-restringen-flujo}
> pagina: control-de-acceso-y-flujo-de-informacion

**Las políticas, por lo general, restringen el flujo de información y no el acceso a los objetos.** La comparación mínima: evitar que un empleado **sepa** el sueldo de otro no es lo mismo que evitar que **acceda** a la base de datos de sueldos.

Cierre: las ACLs **sirven**, pero por lo general son mecanismos abiertos y deben ser complementados. El argumento de fondo (filmina 5): el control de acceso limita operaciones sobre objetos, pero la información no es estática — se actualiza y puede copiarse.

## Escriba la definición de entropía de una variable aleatoria discreta y sus dos casos extremos {#flujo-de-informacion:entropia-definicion}
> pagina: entropia-y-entropia-condicional

$$
H(X) = -\sum_{i=1}^{n} p(x_i)\log p(x_i)
$$

Mide la incertidumbre al determinar el valor de la variable; con logaritmo en base dos se mide en bits.

- **Máximo**: $p(x_i)=1/n$ para todo $i$ (distribución uniforme).
- **Mínimo**: $p(x_i)=1$ y $p(x_j)=0$ para $j\neq i$ (evento único, sin incertidumbre).

## Escriba las dos fórmulas de la entropía condicional y explique qué mide cada una {#flujo-de-informacion:entropia-condicional-definicion}
> pagina: entropia-y-entropia-condicional

$$
H(X \mid Y=y) = -\sum_{i=1}^{n} p(x_i \mid y)\log p(x_i \mid y)
$$
$$
H(X \mid Y) = \sum_{j=1}^{m} p(y_j)\,H(X \mid Y=y_j)
$$

La primera es la incertidumbre sobre $X$ una vez **fijado un valor concreto** $y$. La segunda promedia esa incertidumbre pesándola por la probabilidad de cada $y_j$: la incertidumbre esperada sobre $X$ sabiendo algo de $Y$, sin saber todavía cuál valor.

## Enuncie la definición formal de flujo de información, con sus dos ramas {#flujo-de-informacion:definicion-formal-flujo}
> pagina: flujo-de-informacion

Sea $s$ el estado del sistema, $t$ el estado tras ejecutar $c_1,\dots,c_n$, y $x_s,y_s,y_t$ los valores de los objetos en esos estados. Hay flujo de información de $x$ a $y$ si:

$$
H(x_s \mid y_t) < H(x_s \mid y_s) \qquad \text{si } y \text{ existe en el estado } s
$$
$$
H(x_s \mid y_t) < H(x_s) \qquad \text{si } y \text{ no existe en el estado } s
$$

El criterio es de **reducción relativa**: si conocer $y$ deja menos incertidumbre sobre $x$ que antes, algo de $x$ se traspasó a $y$.

## Resuelva el ejemplo $y := x+z$ con $0\le x\le 7$ equiprobable y $Z=\{p(1)=0{,}5,\ p(2)=0{,}25,\ p(3)=0{,}25\}$ {#flujo-de-informacion:ejemplo-suma-con-ruido}
> pagina: flujo-de-informacion

$$
H(x) = -\sum_{i=0}^{7}\tfrac18\log_2\tfrac18 = 3 \text{ bits}
$$

Conocido $y$, $x$ sólo puede ser $y-1$, $y-2$ o $y-3$, heredando las probabilidades de $z$:

$$
H(x\mid y) = -\tfrac12\log_2\tfrac12 - 2\cdot\tfrac14\log_2\tfrac14 = 1{,}5 \text{ bits}
$$

Como $y$ no existía antes, se compara contra $H(x)$: $1{,}5 < 3$, **hay flujo de información** de $x$ a $y$. Se filtró un bit y medio.

## Distinga flujo explícito de flujo implícito, e indique a cuál corresponde cada ejemplo de la clase {#flujo-de-informacion:explicito-contra-implicito}
> pagina: flujo-explicito-e-implicito

- **Explícito**: existe una asignación o escritura de información del tipo $y := f(x)$. Ejemplo: $y := x+z$.
- **Implícito**: hay verificación de flujo **sin** asignaciones explícitas. Ejemplos: el `if` y el `while`.

Por tipo de canal: flujo por **dato** es siempre explícito; flujo por **control** (la rama que se ejecuta) y por **comportamiento** (si el programa termina) son implícitos. El problema abierto que ordena el resto de la clase es encontrar y controlar los flujos implícitos.

## ¿Por qué `if x = 0 then y = 1 else y = 0` filtra información, si $x$ e $y$ nunca aparecen en la misma asignación? {#flujo-de-informacion:flujo-por-rama-if}
> pagina: flujo-explicito-e-implicito

Con $x\in\{0,1\}$ y $p(x{=}0)=0{,}5$: $H(x)=1$ bit. Las dos ramas son mutuamente excluyentes y cubren todo el dominio, así que $y=1 \Rightarrow x=0$ y $y=0 \Rightarrow x=1$:

$$
H(x\mid y) = p(y{=}1)\cdot 0 + p(y{=}0)\cdot 0 = 0
$$

Como $0 < 1$, hay traspaso de información. El mecanismo es el **control**: qué rama se ejecutó fija el valor de $y$ tan directamente como lo haría un $y:=f(x)$ explícito, aunque cada rama asigne sólo una constante.

## ¿Cómo filtra información `while x = 0 loop {}`, y por qué es el caso límite? {#flujo-de-informacion:flujo-por-comportamiento-while}
> pagina: flujo-explicito-e-implicito

Con $x\in\{0,1\}$, $p(x{=}0)=0{,}5$, y definiendo $y=0$ si el programa termina: $H(x)=1$ y $H(x\mid y)=0$.

Si $x=1$ el programa termina de inmediato; si $x=0$ queda colgado para siempre. Observar si terminó o no determina $x$ por completo.

Es el caso límite porque **no existe ninguna asignación en absoluto**: lo único observable es la propia ejecución. Un análisis de flujo que sólo revise instrucciones de asignación no tiene nada que revisar aquí.

## Enuncie los dos principios que toda política de control de flujo debe cumplir {#flujo-de-informacion:reflexion-y-transitividad}
> pagina: politicas-de-control-de-flujo

$$
\textbf{Reflexión: } a,b \text{ en la misma clase},\ a \text{ puede leer/escribir } o_1 \implies b \text{ puede leer/escribir } o_1
$$

$$
\textbf{Transitividad: } a,b \text{ en clases distintas},\ a \text{ puede escribir } o_1 \text{ y leer } o_2,\ b \text{ puede leer } o_1 \implies b \text{ eventualmente puede leer } o_2
$$

La reflexión asegura que la clase agrupe sujetos equivalentes. La transitividad es la que muerde: formaliza que la información se escurre por caminos indirectos de más de un salto — exactamente el caso de `/tmp`.

## En el caso 3 de la filmina 15, ¿cómo se elude la restricción discrecional $(b,-,C_1)$? {#flujo-de-informacion:dominancia-restriccion-discrecional}
> pagina: politicas-de-control-de-flujo

Configuración: $a\in C_1$, $b\in C_2$ con $C_2 \operatorname{dom} C_1$, $o\in C_1$, más una restricción discrecional $(b,-,C_1)$ que le revoca a $b$ el acceso a objetos de $C_1$.

$a$ puede leer $o$ y escribir $o'$ en $C_2$, que $b$ **sí** puede leer: la restricción discrecional se elude por el camino indirecto, porque sólo mencionaba $C_1$. Es la transitividad con nombres concretos, y la ilustración de que los accesos discrecionales sólo restringen a los mandatorios pero no cierran los caminos derivados.

## Compare el mecanismo estático y el dinámico de control de flujo {#flujo-de-informacion:estatico-contra-dinamico}
> pagina: mecanismos-de-control-de-flujo

- **Estático**: actúa antes de ejecutar, en compilación. Analiza el flujo **comando por comando** con herramientas de teoría de compiladores y sólo deja pasar los comandos que logra **certificar**. El costo se paga una sola vez, pero es conservador por necesidad: rechaza todo programa cuyo flujo no pueda demostrar seguro.
- **Dinámico**: actúa durante la ejecución, asignando **etiquetas** a la información. Cada zona del sistema declara qué etiquetas tiene prohibidas y cuáles requiere.

## Enuncie la regla de propagación de etiquetas del mecanismo dinámico y su costo {#flujo-de-informacion:propagacion-de-etiquetas}
> pagina: mecanismos-de-control-de-flujo

- **Al leer**, el usuario o proceso adquiere la etiqueta del dato leído.
- **Al escribir**, el dato de salida queda marcado con **todas** las etiquetas que el escritor tenía acumuladas, no sólo la del dato que se escribe en ese instante.

Costo: basta con haber leído alguna vez un dato de alta etiqueta para que todo lo producido después quede marcado igual, aunque ese dato no haya influido en el resultado. Para no dejar pasar un flujo real, el mecanismo bloquea también flujos que no lo eran.

## ¿Cuál es el límite de lo técnico que plantea la filmina 17? {#flujo-de-informacion:limite-de-lo-tecnico}
> pagina: mecanismos-de-control-de-flujo

El ejemplo: un oficial que adquiere derechos de acceso a información confidencial deja de poder emitir comunicados oficiales públicos — control de flujo por etiquetas aplicado a una persona. Pero quedan tres preguntas sin respuesta técnica:

- ¿Cómo impedir que hable informalmente?
- ¿Cómo impedir que imprima documentación clasificada?
- ¿Cómo impedir que fotografíe una pantalla?

La conclusión de la filmina: *"el control de información puede escapar del ámbito técnico"*. Sólo se puede controlar lo que admite un mecanismo técnico.

## Defina el problema del confinamiento y los dos requisitos que separa la filmina 18 {#flujo-de-informacion:problema-de-confinamiento}
> pagina: problema-del-confinamiento

El **problema de confinamiento** es *prevenir que un servidor revele información que el usuario del servicio considere confidencial*.

Los dos requisitos de un sistema ideal, separados por dificultad:

- **Fácil**: permitir que una entidad acceda sólo a los recursos para los que está autorizada — ya existen mecanismos seguros (el control de acceso).
- **Difícil**: no revelar información de ningún tipo a quien no está autorizado.

## ¿Qué exige la aislación total y por qué es inalcanzable en la práctica? {#flujo-de-informacion:aislacion-total-inalcanzable}
> pagina: problema-del-confinamiento

Requisitos: el proceso no puede comunicarse con otros procesos, y no puede ser observado. Si se cumplieran, el proceso no revelaría información.

Es inalcanzable porque **todo proceso usa recursos medibles**: memoria, ciclos de CPU, espacio en disco, ancho de banda. En el caso general, dos procesos $a$ y $b$ que no pueden comunicarse por definición igual comparten el sistema de archivos; si no lo comparten, comparten el procesador; y además comparten memoria. Todos esos recursos son observables, y observarlos permite crear un canal.

## Defina canal oculto, sus dos tipos y los dos atributos que lo caracterizan {#flujo-de-informacion:canal-oculto-clasificacion}
> pagina: canales-ocultos-y-side-channels

Un **canal oculto** es *un canal de comunicación que no fue diseñado para ello*.

- **Espacial**: explota atributos de recursos compartidos (cuánto espacio, cuánta capacidad, en qué estado quedó algo).
- **Temporal**: explota información temporal o de **orden** en el acceso a recursos compartidos.

Atributos: **ruido** (capacidad de interferencia no premeditada de terceras partes) y **ancho de banda** (tasa de transmisión del canal).

## Describa el canal oculto temporal sobre una CPU compartida {#flujo-de-informacion:canal-temporal-cpu}
> pagina: canales-ocultos-y-side-channels

Dos procesos $a$ y $b$ tienen prohibido comunicarse pero comparten la CPU del mismo servidor:

- Para enviar un **bit 0**, $a$ devuelve el control al sistema operativo **inmediatamente**.
- Para enviar un **bit 1**, $a$ hace uso **intensivo** de su *slot* temporal.
- $b$ accede al reloj de tiempo real y mide cuánto tarda en recuperar el control: si tardó más de lo esperado, decodifica un $1$; si tardó lo normal, un $0$.

No hay ninguna llamada entre $a$ y $b$, y sin embargo el bit llega.

## ¿Qué es un side channel attack y cómo se ataca la exponenciación modular por tiempo? {#flujo-de-informacion:side-channel-exponenciacion}
> pagina: canales-ocultos-y-side-channels

Un **side channel attack** hace uso de un canal oculto para ganar información. Sobre el algoritmo de cuadrado y multiplicación para $a^b \bmod n$, cuyo cuerpo recorre los bits $b_i$ de la representación binaria de $b$:

$$
\begin{aligned}
&\textbf{if } b_i = 1 \textbf{ then } x := (x\cdot a_{\mathrm{tmp}})\bmod n; \\
&a_{\mathrm{tmp}} := (a_{\mathrm{tmp}}\cdot a_{\mathrm{tmp}})\bmod n;
\end{aligned}
$$

La multiplicación de la rama sólo se ejecuta cuando $b_i=1$; el cuadrado, que está **fuera** del `if`, se ejecuta siempre. Entonces el tiempo total depende de **cuántos bits de $b$ valen 1**, y con métodos estadísticos se reconstruye parte de $b$ — típicamente el exponente secreto de RSA o Diffie-Hellman.

## Distinga máquina virtual de sandbox como métodos de aislación {#flujo-de-informacion:vm-contra-sandbox}
> pagina: metodos-de-aislacion

- **Máquina virtual**: **presenta un ambiente** que se comporta como una computadora que sólo corre los procesos aislados. **No** modifica el sistema. Simula el hardware y permite correr sistemas operativos sin modificarlos; el núcleo de la máquina virtual se convierte en el agente que provee seguridad, con las máquinas virtuales como sujetos y los recursos físicos como objetos. Ejemplos: `KVM`, `VMware`, `qemu`, la JVM.
- **Sandbox**: **corre los procesos en un ambiente** que analiza las acciones y detecta fugas de información, limitándolas según una política. **Sí** modifica el sistema, ya sea el ambiente (kernel) o el propio programa mediante puntos de control. Ejemplos: `chroot`, el *ebuild sandbox* de Gentoo, la JVM.
