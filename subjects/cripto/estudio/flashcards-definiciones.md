---
tipo: flashcards
titulo: Definiciones formales
id: definiciones
descripcion: Las definiciones que se piden enunciadas con precisión: de criptosistema a política de seguridad.
---

## Enuncie la definición formal de un esquema de cifrado de clave privada, con su condición de corrección {#definiciones:criptosistema-terna-y-correccion}
> pagina: criptosistema

Es una terna de algoritmos $\Pi = (\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$ junto con tres conjuntos: el espacio de claves $K$, el de mensajes $M$ y el de textos cifrados $C$. `Gen` es probabilístico y sin entrada, $() \to K$; `Enc` va de $K \times M$ en $C$ y `Dec` de $K \times C$ en $M$, determinísticos en los esquemas clásicos.

$$
\forall k \in \mathcal{K},\ \forall m \in \mathcal{M}: \quad \mathsf{Dec}_k(\mathsf{Enc}_k(m)) = m
$$

Especificar un esquema exige dar los **tres conjuntos y los tres algoritmos**, y decir cómo `Gen` elige la clave (típicamente uniforme sobre $K$).

## Enuncie el principio de Kerckhoffs y diga qué queda público y qué secreto {#definiciones:principio-de-kerckhoffs-enunciado}
> pagina: principio-de-kerckhoffs

"Un criptosistema debe ser seguro incluso si todo sobre el sistema, excepto la clave, es de público conocimiento" (Auguste Kerckhoffs, 1883).

- **Público:** el algoritmo (`Gen`, `Enc`, `Dec`), los espacios $K$, $M$, $C$, la implementación y los parámetros del esquema.
- **Secreto:** únicamente la clave $k$.

Apoyar la seguridad en el secreto del diseño se llama **seguridad por oscuridad** y no cuenta como seguridad.

## Enuncie la definición de secreto perfecto {#definiciones:secreto-perfecto-definicion}
> pagina: secreto-perfecto

Un criptosistema $(\mathsf{Gen}, e, d)$ posee secreto perfecto si para toda distribución de probabilidades en $M$, todo $m \in M$ y todo $c \in C$ con $\Pr[C = c] > 0$:

$$
\Pr[M = m \mid C = c] = \Pr[M = m]
$$

Observar el criptograma no cambia lo que el adversario cree sobre el mensaje: la distribución a posteriori es idéntica a la a priori. La definición no dice nada sobre el poder de cómputo del adversario, así que es seguridad **incondicional**.

## Enuncie el teorema de Shannon sobre el secreto perfecto y diga si su condición es suficiente {#definiciones:teorema-de-shannon-cota-de-claves}
> pagina: secreto-perfecto

$$
\text{Secreto perfecto} \implies \lvert\mathcal{K}\rvert \ge \lvert\mathcal{M}\rvert
$$

Es una cota de conteo: con menos claves que mensajes, algún $c$ no sería alcanzable desde algún $m$, y ese $c$ descartaría ese $m$, filtrando información. La implicación va en **un solo sentido**: la condición es necesaria pero **no suficiente**, porque también importa cómo se reparten las claves entre los criptogramas. La versión más fuerte, en entropía, es $H(K) \ge H(M)$.

## Enumere los cuatro modelos de ataque y diga cuáles son activos {#definiciones:modelos-de-ataque-los-cuatro}
> pagina: modelos-de-ataque

De menor a mayor poder del adversario; cada uno contiene al anterior:

| Modelo | Qué tiene | Pasivo / activo |
|---|---|---|
| COA (ciphertext-only) | sólo criptogramas | pasivo |
| KPA (known-plaintext) | pares $(m,c)$ que no eligió | pasivo |
| CPA (chosen-plaintext) | oráculo de `Enc`: elige los mensajes | activo |
| CCA (chosen-ciphertext) | además oráculo de `Dec` | activo |

En los cuatro se asume el principio de Kerckhoffs y el objetivo es el mismo: obtener todo el plano. El estándar mínimo moderno es seguridad CPA.

## ¿Qué dos cosas relaja la seguridad computacional respecto del secreto perfecto? {#definiciones:seguridad-computacional-dos-relajaciones}
> pagina: seguridad-computacional

1. **Limitar escenarios:** garantizar seguridad sólo contra adversarios limitados, con una cota en sus recursos y especialmente en el tiempo.
2. **Limitar garantías:** aceptar una pequeña probabilidad de éxito del atacante, dejando de lado la infalibilidad.

Aplicar las dos da la seguridad computacional. Dado un nivel de seguridad $n$ —en la práctica, el largo de la clave— se espera que el adversario corra algoritmos $\mathrm{PPT}(n)$, tiempo polinomial probabilístico, y que su probabilidad de éxito sea una función despreciable en $n$.

## ¿Cuándo una función $\varepsilon(n)$ es despreciable? {#definiciones:funcion-despreciable-definicion}
> pagina: seguridad-computacional

$\varepsilon$ es despreciable si **para todo polinomio $p$** existe $N$ tal que $\varepsilon(n) < 1/p(n)$ para todo $n > N$: decae más rápido que la inversa de cualquier polinomio. La filmina lo escribe de forma taquigráfica como $\lim \varepsilon(n) < 1/n^k$, con el $k$ cuantificado universalmente.

Son despreciables $2^{-n}$ y $2^{-\sqrt{n}}$; no lo son $1/n^{100}$ ni $1/(n\cdot\log n)$. La propiedad clave es la clausura: si el adversario da $p(n)$ pasos y cada uno acierta con probabilidad despreciable, $p(n)\cdot\varepsilon(n)$ sigue siendo despreciable.

## Escriba el experimento $\mathsf{Eav}_{A,\Pi}$ y la condición que define indistinguibilidad {#definiciones:prueba-eav-enunciado}
> pagina: pruebas-de-indistinguibilidad

$$
\begin{aligned}
&1)\ \ A \text{ genera } m_0 \text{ y } m_1 \text{ arbitrariamente}\\
&2)\ \ \text{se genera una clave } k \leftarrow K\\
&3)\ \ \text{se genera } b \leftarrow \{0,1\}\\
&4)\ \ A \text{ recibe } c = e_k(m_b)\\
&5)\ \ A \text{ emite } b' \in \{0,1\}
\end{aligned}
$$

$\mathsf{Eav}_{A,\Pi} = 1$ si $b = b'$. $\Pi$ es indistinguible si $\Pr[\mathsf{Eav}_{A,\Pi} = 1] \le 1/2 + \varepsilon(n)$ **para todo adversario PPT**, con $\varepsilon$ despreciable en $n$. Adivinando a ciegas se gana con probabilidad $0{,}5$: el piso es inevitable y lo que se acota es el margen.

## ¿Qué diferencia estructural tiene CPA respecto de Eav, y por qué un criptosistema determinístico no puede ser CPA-Secure? {#definiciones:prueba-cpa-y-determinismo}
> pagina: pruebas-de-indistinguibilidad

En `CPA` **la clave se genera primero**, porque $A$ necesita el oráculo $f(x) = e_k(x)$ **antes** de elegir $m_0$ y $m_1$: el adversario es activo.

Si `Enc` es determinística, $A$ pide al oráculo $c^{*} = f(m_0)$, emite $(m_0, m_1)$ con $m_0 \ne m_1$ y recibe $c$. Como $c = c^{*}$ exactamente cuando $b = 0$, responde $b'=0$ si coinciden y $b'=1$ si no: **gana con probabilidad 1**. Además, un esquema CPA-Secure para un mensaje lo es para múltiples, y uno de tamaño limitado se puede extender por concatenación.

## Enuncie la definición formal de generador pseudoaleatorio {#definiciones:generador-pseudoaleatorio-definicion}
> pagina: generador-pseudoaleatorio

Sea $D = \{\, f : \{0,1\}^{n} \to \{0,1\} \,\}$ una familia de funciones. Entonces $G: \{0,1\}^s \to \{0,1\}^n$, con $s < n$, es un generador pseudoaleatorio respecto de $D$ si para toda $f \in D$:

$$
P\big(\,f(G(r^s)) \neq f(r^n)\,\big) = \varepsilon
$$

con $r^{n}$ una secuencia realmente aleatoria y $\varepsilon$ despreciable. $s < n$ es la condición de **expansión**; cada $f$ es una prueba estadística de un bit. Lo que se pide no es impredecibilidad ni período largo, sino **indistinguibilidad**: ninguna prueba de la familia reacciona distinto ante la salida del generador que ante ruido genuino.

## Enuncie la terna que define un MAC y su propiedad básica {#definiciones:mac-terna-y-propiedad-basica}
> pagina: message-authentication-code

$$
\begin{aligned}
\mathsf{Gen} &: () \to \mathcal{K} && \text{generador de clave}\\
\mathsf{Mac} &: \mathcal{K}\times\mathcal{P} \to \mathcal{T} && \text{etiquetador}\\
\mathsf{Vrfy} &: \mathcal{K}\times\mathcal{P}\times\mathcal{T} \to \{0,1\} && \text{verificador}
\end{aligned}
$$

$$
\forall m \in \mathcal{P},\ \forall k \in \mathcal{K}: \qquad \mathsf{Vrfy}_k\bigl(m,\ \mathsf{Mac}_k(m)\bigr) = 1
$$

Una etiqueta legítima siempre verifica, y nada más: la propiedad básica no dice nada sobre seguridad. `Mac` y `Vrfy` **no son inversas** —`Vrfy` devuelve un bit, no el mensaje—, el servicio que dan es integridad y el MAC no aporta confidencialidad.

## Escriba el experimento Mac-Forge y diga cuándo un MAC es infalsificable {#definiciones:mac-forge-infalsificable}
> pagina: seguridad-de-un-mac

$$
\begin{aligned}
&1)\ \ \text{se genera una clave } k \leftarrow \mathcal{K}\\
&2)\ \ A \text{ obtiene el oráculo de etiquetado } f(x) = \mathsf{Mac}_k(x)\\
&3)\ \ A \text{ hace las evaluaciones que quiera; } Q \text{ es el conjunto de sus consultas}\\
&4)\ \ A \text{ emite } (m,\, t) \ \text{ con } \ m \notin Q
\end{aligned}
$$

$\mathsf{Mac\text{-}Forge}_{A,\Pi} = 1$ si $\mathsf{Vrfy}_k(m,t) = 1$. $\Pi$ es **infalsificable** si $\Pr[\mathsf{Mac\text{-}Forge}_{A,\Pi}(n) = 1] \le \mathsf{negl}(n)$ para todo adversario PPT. La cota es despreciable **a secas**, no $1/2 + \mathsf{negl}(n)$: aquí no hay bit que adivinar, el adversario tiene que fabricar la etiqueta.

## Defina una función de hash criptográfica y explique por qué el selector $s$ no es una clave {#definiciones:funcion-de-hash-definicion}
> pagina: funciones-de-hash-criptograficas

Es un **par de algoritmos**: $\mathsf{Gen}$, que elige $s \leftarrow S$, y $\mathsf{Hash}$, que calcula $h = H^{s}(m) \in \{0,1\}^{L}$. Tres rasgos: el dominio no está acotado, el codominio sí y es chico, y **no hay ningún valor secreto**.

$s$ no es una clave porque en criptografía "clave" significa un valor que el adversario **no conoce**, y $s$ es información pública: la seguridad tiene que valer aun entregándoselo al adversario. Está para impedir que se traiga una colisión precomputada; en la práctica muchas veces $S = \{s_0\}$ y la función queda fija en el estándar.

## Enuncie las tres resistencias de una función de hash y qué las distingue {#definiciones:tres-resistencias-enunciados}
> pagina: resistencias-de-una-funcion-de-hash

- **Preimágenes:** para todo $y$, es computacionalmente imposible hallar $x$ tal que $h(x) = y$.
- **Segundas preimágenes:** para todo $x$, es computacionalmente imposible hallar $x' \ne x$ con $h(x') = h(x)$.
- **Colisiones:** es computacionalmente imposible hallar $x, x'$ con $x \ne x'$ y $h(x) = h(x')$.

Lo único que las separa es **quién elige qué**: en preimagen el objetivo está fijo, en segunda preimagen viene dado $x$, y en colisión el adversario elige los dos mensajes. Más grados de libertad, ataque más fácil y propiedad más fuerte. "Computacionalmente imposible" significa que todo $A$ PPT lo logra con probabilidad $\le \mathsf{negl}(n)$; las colisiones existen siempre, por el principio del palomar.

## Defina cifrado autenticado y escriba la construcción genérica {#definiciones:cifrado-autenticado-definicion}
> pagina: cifrado-autenticado

$$
\textbf{Cifrado autenticado} = \text{privacidad} + \text{integridad} = \texttt{CCA-Secure} + \texttt{Mac-Forge-Secure}
$$

Con $\Pi_e$ CPA-Secure y $\Pi_m$ un MAC infalsificable, con etiquetas únicas y claves independientes:

$$
\begin{aligned}
\mathsf{Gen}(1^{n}):\quad & k_1 \leftarrow \mathsf{Gen}_e(1^{n}),\qquad k_2 \leftarrow \mathsf{Gen}_m(1^{n}) \\
\mathsf{Enc}_{k_1,k_2}(m):\quad & c \leftarrow \mathsf{Enc}_{k_1}(m),\quad t \leftarrow \mathsf{Mac}_{k_2}(c),\quad \text{salida } \langle c, t\rangle \\
\mathsf{Dec}_{k_1,k_2}(\langle c,t\rangle):\quad & \text{si } \mathsf{Vrfy}_{k_2}(c,t) = 1 \to m := \mathsf{Dec}_{k_1}(c);\ \text{ si no } \to \perp
\end{aligned}
$$

Es `Encrypt-then-MAC`: primero se verifica y solo después se descifra. El criptosistema resultante es CCA-Secure y aparece un modo de falla nuevo, $\perp$, que no pertenece a $\mathcal{M}$.

## Enuncie la terna de un criptosistema asimétrico y por qué ahí Eav ya implica CPA-Secure {#definiciones:criptosistema-asimetrico-eav-implica-cpa}
> pagina: criptosistema-asimetrico

$$
\mathsf{Gen}: () \to (pk, sk), \qquad \mathsf{Enc}_{pk}(m), \qquad \mathsf{Dec}_{sk}(c), \qquad \mathsf{Dec}_{sk}(\mathsf{Enc}_{pk}(m)) = m
$$

En el experimento `Eav` asimétrico el adversario **recibe $pk$** antes de elegir $m_0$ y $m_1$. Como con $pk$ puede calcular $\mathsf{Enc}_{pk}(m)$ para cualquier $m$, ya tiene de fábrica el oráculo de cifrado que en el mundo simétrico había que ganar: indistinguibilidad ante escucha implica CPA-Secure, sin experimento aparte. Corolario: $\mathsf{Enc}_{pk}$ **no puede ser determinística**, o el adversario cifra $m_0$ y $m_1$ y compara contra el desafío.

## Enuncie la terna de una firma digital y el experimento Sig-forge {#definiciones:firma-digital-terna-y-sig-forge}
> pagina: firma-digital

$$
\mathsf{Gen}: (n) \to (sk, pk), \qquad s \leftarrow \mathsf{Sign}_{sk}(m), \qquad b = \mathsf{Vrfy}_{pk}(m,s)
$$

con correctud $\mathsf{Vrfy}_{pk}(m, \mathsf{Sign}_{sk}(m)) = 1$. En `Sig-forge` el adversario recibe $pk$ y acceso de oráculo a $\mathsf{Sign}_{sk}$; sea $Q$ el conjunto de sus consultas, emite $(m,s)$ y gana si $\mathsf{Vrfy}_{pk}(m,s)=1$ y $m \notin Q$. Es seguro si $\Pr[\mathsf{Sig\text{-}forge}_{A,\Pi}=1] \le \mathsf{negl}(n)$ para todo $A$ PPT. La asimetría de claves da verificación pública, transferibilidad y **no repudio**, que un MAC no puede dar.

## Defina política de seguridad, sistema seguro y violación de seguridad {#definiciones:politica-de-seguridad-definiciones}
> pagina: politica-de-seguridad-y-sistema-seguro

- **Política de seguridad:** enunciado que parte los estados de un sistema en autorizados (seguros) y no autorizados.
- **Sistema seguro:** sistema que comienza en un estado autorizado y nunca puede entrar en un estado no autorizado.
- **Violación de seguridad:** transición del sistema hacia un estado no autorizado.

La política es una partición **estática** del espacio de estados; ser seguro es una propiedad **dinámica** sobre todas las trayectorias. La definición de violación no exige intención ni adversario: vale igual si la provoca un ataque, un error de configuración o un bug.

## Escriba el modelo formal de cinco componentes de un sistema de autenticación {#definiciones:autenticacion-modelo-acfls}
> pagina: autenticacion

$$
\begin{aligned}
A &= \{a\} &&\text{información de autenticación} \\
C &= \{c\} &&\text{información complementaria} \\
F &= \{\,F : A \to C\,\} &&\text{funciones de complementación} \\
L &= \{\,L : A \times C \to \{0,1\}\,\} &&\text{funciones de autenticación} \\
S &= \{s\} &&\text{funciones de selección}
\end{aligned}
$$

$A$ lo aporta la entidad externa al autenticarse; $C$ lo guarda el sistema de antemano. $F$ corre **una sola vez**, al dar de alta, y deriva $C$ desde $A$; $L$ corre **en cada intento** y decide si el par $(a,c)$ es válido; $S$ hace alta, baja y cambio. Autenticar es asociar una **identidad** externa a un **principal** interno del sistema.

## Enuncie la definición formal de flujo de información {#definiciones:flujo-de-informacion-definicion}
> pagina: flujo-de-informacion

Sea $s$ el estado del sistema y $t$ el estado luego de ejecutar $c_1,\dots,c_n$. Hay flujo de información de $x$ a $y$ si:

$$
H(x_s \mid y_t) < H(x_s \mid y_s) \qquad \text{cuando } y \text{ existe en el estado } s
$$

$$
H(x_s \mid y_t) < H(x_s) \qquad \text{cuando } y \text{ no existe en el estado } s
$$

Si después de ejecutar el programa y conocer $y$ queda **menos** incertidumbre sobre $x$ que antes, algo de $x$ se traspasó a $y$. El criterio es de reducción relativa, no de valor absoluto.
