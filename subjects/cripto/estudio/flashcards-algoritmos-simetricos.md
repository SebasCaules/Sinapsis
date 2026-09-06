---
tipo: flashcards
titulo: Cifrado simétrico y modos
id: algoritmos-simetricos
division: "2"
descripcion: Flujo y bloque, PRG e indistinguibilidad, DES, AES y los modos de encadenamiento.
---

## Escriba la terna Gen / Enc / Dec del One Time Pad {#algoritmos-simetricos:otp-terna}
> pagina: one-time-pad

Atribuido a Vernam (1917), con $M = K = C = \{0,1\}^{n}$:

$$
\begin{aligned}
\mathsf{Gen} &: k \leftarrow \{0,1\}^n,\quad n = \lvert m\rvert \quad \text{(uniforme)}\\
\mathsf{Enc} &: e_k(m) = m \oplus k\\
\mathsf{Dec} &: d_k(c) = c \oplus k
\end{aligned}
$$

La corrección sale sola porque $\oplus$ es su propia inversa: $d_k(e_k(m)) = m \oplus (k \oplus k) = m$.

## ¿Cuáles son las tres limitaciones del One Time Pad? {#algoritmos-simetricos:otp-tres-limitaciones}
> pagina: one-time-pad

1. **Secreto perfecto $\Rightarrow \lvert K\rvert \ge \lvert C\rvert$** (cota de Shannon): la clave tiene que ser tan larga como el mensaje y distribuirse de antemano por un canal seguro.
2. **Reutilizar la clave lo destruye**: $c_1 \oplus c_2 = m_1 \oplus m_2$, la clave se cancela. De ahí el *One Time*.
3. **La clave debe ser aleatoria**: con una clave sesgada la posteriori se mueve y ya no hay secreto perfecto.

## ¿Qué dos cosas relaja la seguridad computacional respecto del secreto perfecto? {#algoritmos-simetricos:seguridad-computacional-dos-relajaciones}
> pagina: seguridad-computacional

- **Limitar escenarios**: garantizar seguridad sólo contra adversarios limitados, especialmente en **tiempo**.
- **Limitar garantías**: aceptar una **pequeña probabilidad de éxito** del atacante.

Dado un nivel de seguridad $n$, se espera que el adversario corra algoritmos $\mathrm{PPT}(n)$ y que su probabilidad de éxito sea despreciable en $n$. En la práctica $n$ es el largo de la clave.

## ¿Cuándo una función $\varepsilon(n)$ es despreciable? {#algoritmos-simetricos:funcion-despreciable}
> pagina: seguridad-computacional

$\varepsilon$ es despreciable si **para todo polinomio $p$** existe $N$ tal que $\varepsilon(n) < 1/p(n)$ para todo $n > N$: decae más rápido que la inversa de **cualquier** polinomio. El cuantificador sobre el polinomio es universal.

Sí: $2^{-n}$, $2^{-\sqrt{n}}$. No: $1/n^{100}$, $1/(n\log n)$.

La clausura es lo que sirve: si el adversario da $p(n)$ pasos, $p(n)\cdot\varepsilon(n)$ sigue siendo despreciable, y por eso se puede demostrar por reducción.

## Enuncie la definición formal de generador pseudoaleatorio {#algoritmos-simetricos:prg-definicion-formal}
> pagina: generador-pseudoaleatorio

Sea $D = \{\, f : \{0,1\}^{n} \to \{0,1\} \,\}$ una familia de funciones. Entonces $G: \{0,1\}^{s} \to \{0,1\}^{n}$ con $s < n$ es un generador pseudoaleatorio respecto de $D$ si para toda $f \in D$:

$$
P\big(\,f(G(r^{s})) \neq f(r^{n})\,\big) = \varepsilon
$$

con $r^{n}$ realmente aleatoria y $\varepsilon$ despreciable. $s < n$ es la condición de **expansión**; cada $f$ es una prueba estadística de un bit.

La definición **no** pide impredecibilidad, ni período largo, ni pasar tests de frecuencia: pide **indistinguibilidad**, y todo lo demás se deduce.

## Escriba la terna del criptosistema de flujo y la relación entre $\lvert K\rvert$ y $\lvert M\rvert$ {#algoritmos-simetricos:flujo-terna}
> pagina: criptosistema-de-flujo

Es el One Time Pad con la clave reemplazada por la salida de un generador pseudoaleatorio:

$$
\begin{aligned}
\mathsf{Gen} &: k \leftarrow K\\
\mathsf{Enc} &: e_k(m) = G(k) \oplus m\\
\mathsf{Dec} &: d_k(c) = G(k) \oplus c
\end{aligned}
$$

La gran diferencia es $\lvert K\rvert \lll \lvert M\rvert$ (por ejemplo $\lvert K\rvert = 2^{128}$ y $\lvert M\rvert = \lvert K\rvert^{128}$). Como el teorema de Shannon exige $\lvert K\rvert \ge \lvert M\rvert$, **no puede tener secreto perfecto**: es el precio que se elige pagar.

## ¿Qué prueba pasa un cifrado de flujo sin IV y cuál falla? {#algoritmos-simetricos:flujo-eav-y-mul}
> pagina: criptosistema-de-flujo

**Pasa `Eav`.** Teorema de la clase: si $G(\cdot)$ es un generador pseudoaleatorio, el criptosistema es indistinguible ante observadores.

**Falla `Mul`.** Con la misma semilla, el keystream se cancela:

$$
c_1 \oplus c_2 = m_1 \oplus m_2
$$

La generalización que importa: **si una función de cifrado es determinística, no es segura bajo múltiples cifrados**. La reparación es volver `Enc` probabilístico con un nonce o IV.

## ¿Qué distingue a `Eav`, `Mul` y `CPA`, y cuál es la exigencia más fuerte? {#algoritmos-simetricos:pruebas-eav-mul-cpa}
> pagina: pruebas-de-indistinguibilidad

- **`Eav`**: $A$ elige $m_0, m_1$ y ve **un** criptograma. Adversario pasivo.
- **`Mul`**: $A$ elige dos **vectores** de mensajes, todos cifrados con la **misma** clave. Pasivo.
- **`CPA`**: $A$ tiene un **oráculo** $f(x) = e_k(x)$; por eso la clave se genera **primero**, antes de que elija sus mensajes. Adversario activo.

En las tres gana si $b = b'$, y se exige $\Pr[\text{prueba} = 1] \le 1/2 + \varepsilon(n)$ para todo adversario $\mathrm{PPT}$. Cada prueba contiene a la anterior, así que **`CPA` es la exigencia más fuerte de las tres: pasarla es el estándar mínimo moderno**.

## Demuestre que un criptosistema determinístico no puede ser CPA-Secure {#algoritmos-simetricos:cpa-deterministico}
> pagina: pruebas-de-indistinguibilidad

1. $A$ le pide al oráculo $c^{*} = f(m_0)$.
2. Emite $(m_0, m_1)$ con $m_0 \ne m_1$ y recibe $c = e_k(m_b)$.
3. Si `Enc` es determinística, $c = c^{*}$ **exactamente cuando $b = 0$**.
4. $A$ responde $b' = 0$ si $c = c^{*}$ y $b' = 1$ si no.

Gana con **probabilidad 1**. Leída junto con la propiedad de que un CPA-Secure de tamaño limitado se puede extender concatenando, esta es la justificación completa de por qué hacen falta los modos de encadenamiento.

## ¿Qué se le exige a un nonce y qué de más a un IV aleatorio? {#algoritmos-simetricos:nonce-vs-iv-aleatorio}
> pagina: cifrado-probabilistico-nonce-e-iv

- **Nonce** (*number used once*): sólo **unicidad**, que no se repita con la misma clave. Puede ser un contador y puede ser predecible.
- **IV aleatorio**: unicidad **e impredecibilidad**, se sortea uniformemente.

Por eso **CBC requiere un IV aleatorio** —uno predecible lo rompe aunque nunca se repita— y **CTR es CPA-Secure si no se repite $(k, \text{nonce})$**, que es lo que le permite usar un contador.

El keystream pasa de $G(k)$ a $G(k, \mathrm{IV})$, el IV viaja en claro y `Enc` deja de ser una función para ser un algoritmo probabilístico. Lo que no se puede repetir es el par $(k, \mathrm{IV})$.

## ¿Por qué una primitiva de cifrado en bloque no es un criptosistema usable? {#algoritmos-simetricos:primitiva-no-es-criptosistema}
> pagina: primitiva-de-cifrado-en-bloque

Porque le faltan tres cosas, y los modos de encadenamiento son lo que salva esas tres distancias:

| La primitiva | El criptosistema |
|---|---|
| determinística | debe ser probabilística |
| tamaño fijo $b$ | debe cifrar cualquier largo |
| falla `Mul` y `CPA` | debe ser CPA-Secure |

Lo que sí es: una **función pseudoaleatoria**. No es posible distinguir $f(x) = \mathsf{Enc}_k(x)$ de una función tomada al azar del conjunto de funciones del mismo dominio. Y no hay que mezclar los dos parámetros: en AES-256, $n = 256$ pero $b = 128$.

## ¿Cuáles son los parámetros de DES y por qué la clave tiene 56 bits efectivos? {#algoritmos-simetricos:des-parametros}
> pagina: des-y-3des

Entrada, salida y bloque de **64 bits**; clave de **64 bits con 56 efectivos**; **16 rondas** de red de Feistel.

Los 8 bits faltantes son **de paridad**: el octavo bit de cada uno de los 8 bytes queda determinado por los otros siete y no se puede elegir. El nivel real de seguridad es $2^{56}$, y eso —no el criptoanálisis— es lo que terminó rompiendo a DES por fuerza bruta.

En la red de Feistel, cifrar y descifrar son **el mismo circuito** con las subclaves en orden inverso; por eso la función $F$ no necesita ser invertible.

## Defina clave débil de DES y diga cuántas hay {#algoritmos-simetricos:des-claves-debiles}
> pagina: des-y-3des

$K$ es **débil** si $\mathsf{Enc}_K\big(\mathsf{Enc}_K(x)\big) = x$ para todo $x$, o sea si $\mathsf{Enc}_K = \mathsf{Dec}_K$ (es una involución). Operativamente: **el key schedule genera 1 sola subclave en vez de 16**.

Ocurre cuando $C_0$ y $D_0$ son constantes ($0^{28}$ o $1^{28}$), porque quedan fijas bajo cualquier rotación del calendario. Son $2 \times 2 = \mathbf{4}$ claves débiles.

Las **semi-débiles** generan **2 o 4** subclaves y vienen de a pares: $\mathsf{Enc}_{K_x}\big(\mathsf{Enc}_{K_y}(m)\big) = m$. Hay 12, agrupadas en 6 pares.

La debilidad no está en las cajas $S$ ni en la función $F$: está en el **key schedule**.

## Escriba la construcción de 3-DES y diga qué seguridad brinda {#algoritmos-simetricos:3des-construccion}
> pagina: des-y-3des

Con **3 claves independientes**:

$$
c = \mathsf{Enc}_{k_1}\big(\mathsf{Dec}_{k_2}(\mathsf{Enc}_{k_3}(p))\big)
$$

- Seguridad del orden de **112 bits**, menor a los 168 por el ataque **meet-in-the-middle**.
- **Inmune** a criptoanálisis diferencial y lineal.
- **3 veces más lenta** que DES.

El `Dec` del medio es compatibilidad hacia atrás: con $k_1 = k_2 = k_3$ degenera exactamente en DES.

## ¿Qué tamaños tiene AES y qué es lo único que la cátedra toma de su lógica? {#algoritmos-simetricos:aes-parametros}
> pagina: aes

Bloques de **128 bits** y clave de **128, 192 o 256 bits**. Es el reemplazo de DES, elegido por un **concurso internacional abierto** de 5 años.

Lo evaluable es la **estructura algebraica**: AES está basado en resolver un sistema matricial sobre un **campo de Galois finito $\mathrm{GF}(2^{8})$**. El key schedule no se toma.

Los tres tamaños de clave son flexibilidad para soportar el paso del tiempo. Recomendación operativa de la clase: AES de entre 192 y 256 bits, probablemente 256.

## Nombre las cuatro etapas de una ronda de AES y las dos asimetrías del esquema {#algoritmos-simetricos:aes-etapas-de-ronda}
> pagina: aes

| Etapa | Qué hace |
|---|---|
| **Byte Sub** | sustitución según una tabla derivada de invertir en $\mathrm{GF}(2^{8})$ — es el **único paso no lineal** |
| **Shift Row** | permutación |
| **Mix Column** | transformación lineal invertible de cada byte en función de los 4 de su grupo |
| **Add Round Key** | xor con la parte de la clave derivada para esa ronda |

Las asimetrías: la **primera ronda** tiene sólo `Add Round Key`, y la **última** no tiene `Mix Column`. Sirven para que el cifrado no sea tan predecible.

## ¿Qué modos son CPA-Secure y bajo qué condición? ¿Cuál está prohibido? {#algoritmos-simetricos:modos-cpa-secure}
> pagina: modos-de-encadenamiento

Si la primitiva es una **función pseudoaleatoria**:

- **CBC**, **OFB** y **CFB** son CPA-Secure **con IVs aleatorios**.
- **Counter** es CPA-Secure **si no se repite $(k, \text{nonce})$**.
- **ECB no es CPA-Secure: no utilizar.** Al ser determinístico, bloques iguales dan criptogramas iguales y el patrón de repeticiones del texto plano sobrevive intacto.

Las pruebas son **por reducción** a propiedades de la primitiva, y el remate de la filmina es que **no está demostrado que existan las funciones pseudoaleatorias**.

## En CBC, ¿hasta dónde se propaga un error de 1 bit? {#algoritmos-simetricos:propagacion-de-errores-cbc}
> pagina: modos-de-encadenamiento

Son dos preguntas distintas, y la regla es una: si el bloque tocado entra **por la primitiva** hay avalancha (bloque destruido); si entra **por un xor directo**, se da vuelta ese bit y nada más.

**En el texto claro**, con $C_i = \mathsf{Enc}_K(P_i \oplus C_{i-1})$: la cadena nunca se corta, así que un bit mal en $P_1$ arruina **todos** los bloques de cifrado.

**En el canal**, con $P_i = \mathsf{Dec}_K(C_i) \oplus C_{i-1}$: $C_1$ aparece en dos ecuaciones. Destruye $P_1$ entero y da vuelta **exactamente un bit** de $P_2$; del tercer bloque en adelante el descifrado se recupera solo. Son **2 bloques**.

Por eso CBC es autosincronizante **ante errores de bit**, no ante pérdida de bloques.

## Defina seguro, debilitado y quebrado {#algoritmos-simetricos:estados-de-un-criptosistema}
> pagina: estado-de-un-criptosistema

- **Seguro**: cumple con las expectativas de su modelo de seguridad. Operativamente, **lo mejor que puede hacer un atacante es probar todas las claves**.
- **Debilitado**: existen adversarios con probabilidad **no despreciable** de éxito, pero el esfuerzo es altísimo (décadas) o las condiciones muy difíciles (por ejemplo disponer de $2^{80}$ mensajes).
- **Quebrado**: existen adversarios con probabilidad no despreciable de éxito **en tiempos practicables**.

**No son excluyentes**: hay múltiples pruebas y cada una cubre un escenario distinto, así que un sistema puede ser seguro y estar quebrado a la vez. Regla práctica: ni debilitado ni quebrado entran a un proyecto nuevo.

## ¿Qué primitivas y tamaños se recomiendan para un proyecto nuevo? {#algoritmos-simetricos:primitivas-y-tamanos-recomendados}
> pagina: eleccion-de-primitivas

Se considera **mala práctica desarrollar un criptosistema nuevo** para un proyecto: hay funciones estudiadas por años, y conviene la biblioteca ya escrutada.

- **Bloque**: `AES-CBC` y `AES-CTR` son lo recomendado para proyectos nuevos. DES aparece tachado; IDEA y 3DES arrastran bloques de 64 bits.
- **Flujo**: Salsa20 y Rabbit, los dos con IV en la firma. Tachados: RC4, CSS, A5/1, A5/2, E0.
- **Tamaños**: claves $> 64$ bits (AES tiene 128, 192 o 256) y mensajes de bloque $\ge 128$ bits.

Cada entrada de la tabla es **primitiva más modo**, nunca la primitiva sola. Para dimensionar los exponentes: la edad del universo es de unos $2^{58}$ segundos.
