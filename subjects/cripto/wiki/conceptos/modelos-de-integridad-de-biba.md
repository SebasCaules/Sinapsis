---
title: Modelos de integridad de Biba
resumen: 'Familia de tres modelos de integridad con niveles y dominancia, Low-Water-Mark, Ring Policy y Strict Integrity, que limitan la modificación de información en vez del flujo y apuntan a ambientes comerciales más que militares.'
fuentes: ["[[clase-06-politicas-de-seguridad-y-control-de-acceso]]", "[[modelos-de-politica]]", "[[bell-lapadula]]", "[[confidencialidad-integridad-y-disponibilidad]]"]
aliases: [Biba, Low-Water-Mark, Ring Policy, Strict Integrity, Camino de transferencia de información, No read down no write up]
type: concepto
unidad: 2
clase: 6
orden: 7
created: 2026-09-04
updated: 2026-09-04
tags: [politicas-de-seguridad, biba, integridad, control-de-acceso-mandatorio, clase-06, sin-dictar]
sources: ["Clase 06 - Politicas.pdf"]
---

# Modelos de integridad de Biba

**Tres modelos hermanos que comparten casi toda la maquinaria de niveles y reglas, y se diferencian sólo en qué operación restringen — lectura, escritura, o las dos con niveles que nunca cambian—, más el porqué de fondo: invertir Bell-LaPadula tal cual no alcanza, porque proteger que la basura no suba pide requisitos que proteger que el secreto no baje nunca necesitó.**

Cubre las filminas **29-39** del deck de Políticas (`Clase 06 - Politicas.pdf`). La clase todavía no se dictó —hoy es **04/09/2026**, la clase es el **01/10/2026**— así que esta nota está escrita contra el PDF, sin transcripción.

## Por qué no alcanza con invertir Bell-LaPadula

Las políticas de integridad —de mayor uso en ambientes **comerciales** que militares— tienen requerimientos muy distintos de los de confidencialidad:

- **Separación de trabajo**: una función crítica que requiere al menos dos pasos debe ser ejecutada por personas distintas.
- **Auditoría**: control y registro de las operaciones realizadas.
- **Separación de funciones**: que la creación y el consumo de información no recaigan en la misma persona.
- **Acceso**: si alguien necesita información, se le da — lo opuesto al espíritu restrictivo de [[bell-lapadula|Bell-LaPadula]].
- **Administración descentralizada** de niveles y categorías.
- **Agregación**: evitar deducir información sensible a partir de información publicada — el mismo requisito de "ni siquiera por vías indirectas" de [[confidencialidad-integridad-y-disponibilidad|Confidencialidad, integridad y disponibilidad]], ahora del lado de integridad en vez de confidencialidad.

El deck es explícito: modelar esto con Bell-LaPadula sería **"muy complicado"**, porque la cantidad de niveles y categorías necesarios sería difícil de administrar de forma centralizada — BLP asume una jerarquía militar con niveles pocos y estables; un ambiente comercial con separación de trabajo y administración descentralizada no calza en ese molde sin explotar la cantidad de compartimentos necesarios.

## Base común a los tres modelos

Conjuntos de sujetos $S$, objetos $O$, niveles de integridad $I$; una relación $<$ sobre $I \times I$ que expresa dominancia del primero sobre el segundo; una función $i: S \cup O \to I$ que da el nivel de integridad de cada entidad; y relaciones $r, w, x \subseteq S \times O$ para lectura, escritura y ejecución permitidas.

**Niveles de integridad, no de seguridad.** A mayor nivel, mayor confianza en que un programa se ejecuta correctamente (o detecta errores en sus entradas) y en que un dato es preciso y fiable. La distinción con Bell-LaPadula es de fondo, no de vocabulario: **los niveles de seguridad limitan el flujo de información; los niveles de integridad limitan la modificación de información.** Son ejes ortogonales aunque compartan la misma maquinaria formal de niveles y dominancia — nada impide que una organización tenga las dos cosas al mismo tiempo, protegiendo confidencialidad con BLP e integridad con Biba sobre el mismo conjunto de sujetos y objetos.

**Camino de transferencia de información.** Secuencia de objetos $o_1,\dots,o_{n+1}$ y sujetos $s_1,\dots,s_n$ tal que

$$s_i\ r\ o_i \ \wedge\ s_i\ w\ o_{i+1} \qquad \text{para todo } 1 \le i \le n$$

— cada sujeto lee el objeto anterior y escribe el siguiente, encadenando una transferencia **indirecta** de $o_1$ a $o_{n+1}$ aunque ningún sujeto individual toque los dos extremos. Es el equivalente, del lado de integridad, del "canal indirecto" que la condición de cierre de Bell-LaPadula bloquea del lado de confidencialidad: la propiedad que importa no es sólo qué puede hacer un sujeto puntual, sino qué se puede propagar a través de una cadena de sujetos.

## Los tres modelos

### 1. Low-Water-Mark

Idea: si un sujeto usa información poco confiable, se vuelve poco confiable.

$$\begin{aligned}
&\text{1. } s \in S \text{ puede escribir } o \in O \iff i(o) \le i(s)\\
&\text{2. Si } s \text{ lee } o: \quad i'(s) = \min\bigl(i(s), i(o)\bigr) \text{ es el nuevo nivel de } s\\
&\text{3. } s_1 \text{ puede ejecutar } s_2 \iff i(s_2) \le i(s_1)
\end{aligned}$$

La regla 2 es la que le da nombre al modelo: el nivel de un sujeto **no es fijo**, baja (nunca sube) cada vez que lee algo de menor confianza. Previene tanto modificaciones **directas** que bajarían el nivel de integridad (regla 1: no se puede escribir un objeto de mayor confianza que la propia) como modificaciones **indirectas** con información de menor nivel (regla 2: leer basura degrada al lector, de modo que después no puede escribir nada de nivel alto sin violar la regla 1).

**Demostración de que restringe el flujo, verificada.** La filmina 35 lo enuncia así: *"Si hay un camino de transferencia entre $o_1$ y $o_n$ la aplicación de la política requiere $i(o_j) \le i(o_1)$ para todo $1 < j \le n$."*

> **Inconsistencia del deck** *(lectura nuestra)*. La filmina 35 indexa el camino como $o_1,\dots,o_n$ y pide la condición para $1 < j \le n$ — el objeto final es $o_n$. Pero la definición de "camino de transferencia" de la filmina 33, dos láminas antes en el mismo deck, indexa la secuencia como $o_1,\dots,o_{n+1}$ objetos con $s_1,\dots,s_n$ sujetos (véase [[#Base común a los tres modelos|más arriba]]) — ahí el objeto final es $o_{n+1}$, no $o_n$. Las dos filminas no comparten el índice del último objeto de la cadena. Lo que sigue reconstruye la demostración con la indexación de la filmina 33 ($o_1,\dots,o_{n+1}$, con $n$ sujetos y $n$ pasos de lectura-escritura), que es la que hace que la cadena tenga la cantidad de eslabones que el propio ejemplo de la filmina 33 dibuja (tres sujetos, cuatro objetos); es una reconciliación nuestra entre las dos filminas, no el enunciado literal de la 35.

Con esa indexación, la política exige $i(o_j) \le i(o_1)$ para todo $1 < j \le n{+}1$ — la integridad nunca puede *subir* a lo largo de la cadena. Por inducción, con $m_k := \min\bigl(i(o_1),\dots,i(o_k)\bigr)$:

- **Caso base** ($i=1$): $s_1$ lee $o_1$, así que por la regla 2 su nivel pasa a ser $\le i(o_1) = m_1$. Luego $s_1$ escribe $o_2$, lo que exige $i(o_2) \le i(s_1) \le m_1 = i(o_1)$.
- **Paso inductivo**: si ya vale $i(o_k) \le m_{k-1} \le i(o_1)$, entonces $m_k = \min(m_{k-1}, i(o_k)) = i(o_k)$ (porque $i(o_k)$ ya es el mínimo). $s_k$ lee $o_k$: su nivel pasa a ser $\le i(o_k) = m_k$. $s_k$ escribe $o_{k+1}$: $i(o_{k+1}) \le i(s_k) \le m_k \le i(o_1)$.

Cerrando la inducción hasta $k=n$: $i(o_{n+1}) \le i(o_1)$. **La integridad de un objeto nunca puede superar la del primer eslabón de cualquier cadena de transferencia que lo alcance** — es la contracara exacta, del lado de integridad, de "la información fluye hacia arriba" de BLP: acá lo que fluye (o más bien, lo que nunca puede subir) es la confianza.

**El precio.** Los niveles de los sujetos **decaen con el uso**: eventualmente nadie puede acceder ni generar objetos de nivel alto, porque cualquier lectura de algo de menor confianza degrada permanentemente al lector. Degradar los niveles de los **objetos** en lugar de los sujetos tiene el mismo problema simétrico: los objetos se degradan hasta el piso con el tiempo. Es el costo estructural de un modelo que ata la confianza al historial completo de lecturas, y no sólo al estado presente.

### 2. Ring Policy

Considera **sólo** la modificación directa; cualquiera puede leer cualquier cosa.

$$\begin{aligned}
&\text{1. } s \in S \text{ puede escribir } o \in O \iff i(o) \le i(s)\\
&\text{2. Cualquier sujeto puede leer cualquier objeto}\\
&\text{3. } s_1 \text{ puede ejecutar } s_2 \iff i(s_2) \le i(s_1)
\end{aligned}$$

Los niveles son **estáticos** —a diferencia de Low-Water-Mark, leer no cambia el nivel de nadie— y el modelo **permite** usar información de baja confianza para generar información de nivel alto: si un sujeto de nivel alto lee un dato de baja confianza, puede seguir escribiendo objetos de nivel alto sin que su propio nivel se vea afectado. La lectura sin restricción es la contracara directa de esa libertad: el modelo no protege contra la **contaminación por lectura**, sólo contra la escritura directa de basura sobre un objeto confiable.

### 3. Strict Integrity — el dual exacto de Bell-LaPadula

$$\begin{aligned}
&\text{1. } s \in S \text{ puede leer } o \in O \iff i(s) \le i(o)\\
&\text{2. } s \in S \text{ puede escribir } o \in O \iff i(o) \le i(s)\\
&\text{3. } s_1 \text{ puede ejecutar } s_2 \iff i(s_2) \le i(s_1)
\end{aligned}$$

Léase: **"no se puede leer hacia abajo, no se puede escribir hacia arriba"** — exactamente invertido respecto de las dos condiciones de Bell-LaPadula ($L(O)\le L(S)$ para leer, $L(S)\le L(O)$ para escribir). La razón de la inversión es la razón de fondo de toda esta nota: acá lo que se protege no es que el secreto no baje, sino que **la basura no suba** — leer algo de menor integridad podría contaminar el conocimiento del sujeto, y escribir algo de mayor integridad con datos poco confiables sería degradar ese objeto. Agregando categorías y controles discrecionales se obtiene el dual completo de BLP, y el modelo mantiene la misma restricción de flujo demostrada arriba para Low-Water-Mark: la integridad nunca puede aumentar a lo largo de una cadena de transferencia.

### Los tres, uno al lado del otro

$$\begin{array}{l|c|c|c}
 & \text{Escritura} & \text{Lectura} & \text{Nivel del sujeto}\\ \hline
\text{Low-Water-Mark} & i(o)\le i(s) & \text{libre, pero degrada} & \text{dinámico (sólo baja)}\\
\text{Ring Policy} & i(o)\le i(s) & \text{libre, sin costo} & \text{estático}\\
\text{Strict Integrity} & i(o)\le i(s) & i(s)\le i(o) & \text{estático}
\end{array}$$

Los tres comparten la regla de escritura ($i(o)\le i(s)$: no se puede escribir por encima del propio nivel). Lo que los distingue es exclusivamente qué hacen con la **lectura**: Low-Water-Mark la permite pero cobra el precio de degradar al lector; Ring Policy la permite gratis; Strict Integrity la restringe directamente, replicando la estructura completa de BLP.

## Ejemplo: S.O. LOCUS

Cada archivo tiene un **nivel de credibilidad**; cada usuario arranca con un **nivel de confianza máximo** preasignado; cada **proceso** tiene un **nivel de riesgo** —el máximo nivel al que puede correr, fijado por la credibilidad de su ejecutable—. Para ejecutar un proceso de menor integridad hay que invocar explícitamente `run-untrusted` — el mismo patrón de **"degradación explícita, nunca implícita"** que el principio de tranquilidad de Bell-LaPadula aplica del lado de la confidencialidad: en los dos modelos, cruzar una frontera de confianza requiere una acción deliberada y visible, no puede pasar como efecto colateral silencioso de una operación cualquiera.
