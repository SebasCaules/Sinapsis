---
tipo: flashcards
titulo: Criptografía clásica y secreto perfecto
id: criptografia-clasica
division: "1"
descripcion: Los cifrados de la Clase 1, el criptoanálisis que los rompe y la definición de secreto perfecto.
---

## Enuncie la definición formal de un esquema de cifrado de clave privada {#criptografia-clasica:criptosistema-definicion-formal}
> pagina: criptosistema

Es una terna de algoritmos $\Pi = (\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})$ junto con tres conjuntos: el espacio de claves $\mathcal{K}$, el de mensajes $\mathcal{M}$ y el de textos cifrados $\mathcal{C}$.

- $\mathsf{Gen}$ es **probabilístico** y sin entrada: $() \to \mathcal{K}$, con $k \leftarrow \mathsf{Gen}()$, típicamente uniforme sobre $\mathcal{K}$.
- $\mathsf{Enc}: \mathcal{K} \times \mathcal{M} \to \mathcal{C}$ y $\mathsf{Dec}: \mathcal{K} \times \mathcal{C} \to \mathcal{M}$ son determinísticos en todos los esquemas clásicos.

Especificar un esquema exige dar los **tres conjuntos y los tres algoritmos**, no sólo la fórmula de cifrado.

## Escriba la condición de corrección de un criptosistema {#criptografia-clasica:condicion-de-correccion}
> pagina: criptosistema

$$
\forall k \in \mathcal{K},\ \forall m \in \mathcal{M}: \quad \mathsf{Dec}_k(\mathsf{Enc}_k(m)) = m
$$

En la notación de la cátedra, $d_k(e_k(m)) = m$. Es la propiedad básica que exige la definición: sin ella no hay criptosistema.

Los cifrados clásicos además preservan la longitud: $\lvert \mathsf{Enc}_k(m)\rvert = \lvert m\rvert$.

## Enuncie el principio de Kerckhoffs y diga qué queda público y qué secreto {#criptografia-clasica:kerckhoffs-enunciado}
> pagina: principio-de-kerckhoffs

Un criptosistema debe ser seguro incluso si todo sobre el sistema, **excepto la clave**, es de público conocimiento (Auguste Kerckhoffs, 1883).

Público: el algoritmo ($\mathsf{Gen}$, $\mathsf{Enc}$, $\mathsf{Dec}$), los espacios $\mathcal{K}$, $\mathcal{M}$, $\mathcal{C}$, la implementación y los parámetros. Secreto: sólo la clave $k$.

Lo opuesto es la **seguridad por oscuridad**, que no cuenta como seguridad. Consecuencia directa: el César clásico fija $k = 3$ y elimina $\mathsf{Gen}$, así que no es un criptosistema sino una función pública y determinística.

## Nombre los cuatro modelos de ataque, de menor a mayor poder del adversario {#criptografia-clasica:modelos-de-ataque-cuatro}
> pagina: modelos-de-ataque

- **COA** (*ciphertext-only*): sólo criptogramas. Pasivo.
- **KPA** (*known-plaintext*): pares $(m, c)$ que no eligió. Pasivo.
- **CPA** (*chosen-plaintext*): pide el cifrado de mensajes que él elige, o sea un oráculo de $\mathsf{Enc}$. Activo.
- **CCA** (*chosen-ciphertext*): además pide el descifrado de criptogramas que él elige, oráculo de $\mathsf{Dec}$. Activo.

Cada modelo contiene al anterior y en los cuatro el objetivo es el mismo: obtener todo el plano. Un esquema que sólo resiste COA no sirve para nada moderno; el estándar mínimo actual es seguridad CPA.

## ¿Cómo caen la sustitución monoalfabética y Vigenère bajo CPA? {#criptografia-clasica:clasicos-bajo-cpa}
> pagina: modelos-de-ataque

Con **una sola consulta** se recupera la clave entera:

- Sustitución monoalfabética: se pide el cifrado de $m = \texttt{abcdefghijklmnopqrstuvwxyz}$ y el criptograma **es** la tabla de $\pi$ completa.
- Vigenère: se pide $m = \texttt{aaaa}\dots\texttt{a}$ de largo $\ge t$ y el criptograma **es** la clave repetida, porque $\texttt{a} = 0$ y entonces $c_i = k_j$.

En Vigenère el truco sólo funciona si $\mathsf{Enc}$ es determinístico y el mensaje arranca alineado con $k_1$. Comparado con COA, donde hacen falta frecuencias, o Kasiski más frecuencias, el modelo cambia el costo del ataque en órdenes de magnitud.

## Enuncie el principio de espacio de claves suficiente {#criptografia-clasica:espacio-de-claves-suficiente}
> pagina: ataque-de-fuerza-bruta

Si $\lvert \mathcal{K}\rvert$ es chico, el esquema es inseguro. **La condición es necesaria pero no suficiente.**

El ataque de fuerza bruta se puede montar siempre, porque no depende de ninguna debilidad del algoritmo sino sólo del tamaño de $\mathcal{K}$, y cuesta

$$
\text{Costo} = O(\lvert\mathcal{K}\rvert \cdot \ell), \qquad \ell = \lvert c \rvert
$$

La rotación cae con $\lvert\mathcal{K}\rvert = n$ (26 o 27); la sustitución monoalfabética resiste la fuerza bruta con $27! \approx 1{,}1\times10^{28}$ claves y aun así se rompe por frecuencias.

## ¿Qué hipótesis oculta asume todo ataque de fuerza bruta? {#criptografia-clasica:hipotesis-de-fuerza-bruta}
> pagina: ataque-de-fuerza-bruta

Que **se puede discriminar un descifrado válido de uno inválido**, lo cual exige redundancia en el mensaje.

Con ROT-X sobre un solo símbolo la hipótesis se cae: las $n$ claves producen $n$ mensajes todos igualmente plausibles, así que el ataque enumera pero no decide. Ese caso límite es exactamente secreto perfecto.

En la práctica la hipótesis se instrumenta con un test de plausibilidad: frecuencias de letras, listas de bigramas y trigramas frecuentes o un diccionario.

## Dé la definición formal del cifrado por rotación {#criptografia-clasica:rotacion-definicion}
> pagina: cifrado-por-rotacion

Con $\Sigma$ un alfabeto finito de $n = \lvert\Sigma\rvert$ símbolos ($n = 27$ en castellano, $n = 26$ en inglés): $\mathcal{K} = \mathbb{Z}_n$ y $\mathcal{M} = \mathcal{C} = \Sigma^{*}$.

$$
\mathsf{Gen}(): k \xleftarrow{\$} \mathbb{Z}_n, \qquad \mathsf{Enc}_k(m)_i = (m_i + k) \bmod n, \qquad \mathsf{Dec}_k(c)_i = (c_i - k) \bmod n
$$

Cada $\pi_k(x) = (x+k) \bmod n$ es una permutación de $\mathbb{Z}_n$ con inversa $\pi_{-k}$, y de ahí sale la corrección: $\pi_{-k} \circ \pi_k = \pi_0 = \operatorname{id}$.

Al definirlo conviene aclarar el rango de $k$: las filminas lo toman entre 1 y 26, la definición formal usa $\mathbb{Z}_n$ e incluye el $0$.

## ¿Cuánto vale el espacio de claves de la sustitución monoalfabética y por qué no alcanza? {#criptografia-clasica:sustitucion-espacio-de-claves}
> pagina: cifrado-de-sustitucion-monoalfabetica

La clave es una permutación del alfabeto, $\mathcal{K} = S_n$, de modo que

$$
\lvert\mathcal{K}\rvert = n! \qquad 26! \approx 4\times10^{26} \qquad 27! \approx 1{,}1\times10^{28}
$$

La fuerza bruta es inviable y sin embargo el esquema cae en minutos, porque **las propiedades estadísticas del lenguaje no se ven alteradas**: como $\pi$ es fija, la letra más frecuente del plano se mapea a la más frecuente del criptograma.

Es el ejemplo canónico de que un espacio de claves grande es necesario pero no suficiente.

## ¿Por qué Vigenère no falla por tener pocas claves? {#criptografia-clasica:vigenere-descomposicion}
> pagina: cifrado-de-vigenere

Es una sustitución polialfabética con clave de $t$ letras,

$$
c_i = \bigl(m_i + k_{((i-1) \bmod t)+1}\bigr) \bmod n
$$

así que un mismo símbolo se cifra distinto según su posición y el patrón de repeticiones del plano se rompe.

Falla porque el problema **se descompone**: hallado $t$, las posiciones $i \equiv j \pmod t$ fueron cifradas todas con la misma $k_j$, y cada una de esas $t$ subcadenas es un cifrado por rotación puro. El costo pasa de $n^t$ a $t \cdot n$, de exponencial a lineal en $t$.

## ¿En qué se apoya el test de Kasiski para hallar la longitud de clave? {#criptografia-clasica:kasiski-idea}
> pagina: test-de-kasiski

En que si una misma secuencia del texto plano aparece dos veces **alineada con la misma parte de la clave**, se cifra al mismo criptograma. Por lo tanto el período $t$ divide a cada distancia $D$ entre apariciones de una secuencia repetida, y $t$ se busca entre los divisores comunes de las distancias observadas.

Procedimiento: listar las secuencias repetidas de al menos 3 caracteres con sus distancias, factorizarlas, estimar $t$ como el divisor común más plausible (el mcd, descartando repeticiones azarosas) y **verificar** que el histograma de cada sub-bloque tenga el perfil del castellano. Publicado por Friedrich Kasiski en 1863.

## Defina el índice de coincidencia y dé sus valores de referencia {#criptografia-clasica:indice-de-coincidencia-formula}
> pagina: indice-de-coincidencia

Es la probabilidad de que dos letras tomadas al azar **sin reposición** de un texto resulten iguales. Hay una versión teórica, del idioma, y una muestral, del criptograma:

$$
\mathrm{IC}_{\text{teo}} = \sum_{i=0}^{n-1} p_i^{\,2}, \qquad \mathrm{IC}_{\text{mue}} = \frac{\sum_{i=0}^{n-1} n_i\,(n_i - 1)}{N\,(N-1)}
$$

Referencias: castellano $\approx 0{,}0775$ según la filmina; texto uniforme $1/n$, o sea $\approx 0{,}0370$ con $n = 27$. La señal es ese factor de alrededor de $2$, no la precisión decimal.

Lectura: **alto** significa monoalfabética o transposición, porque ambas conservan el multiconjunto de conteos y el IC no las separa entre sí; **bajo** significa polialfabética, que mezcla $t$ histogramas rotados y aplana la distribución hacia $1/n$.

## ¿Cómo se reparten el trabajo el test de Kasiski y el índice de coincidencia? {#criptografia-clasica:kasiski-propone-ic-confirma}
> pagina: indice-de-coincidencia

**Kasiski propone, el IC confirma.** Kasiski es generativo: necesita secuencias repetidas y devuelve candidatos, los divisores comunes de las distancias. El IC es verificativo: sólo necesita largo suficiente, cuesta $O(N)$ por candidato y da un veredicto por cada $t$ que se le pase.

Para confirmar un $t$: partir el criptograma en los $t$ sub-textos de posiciones $i \equiv j \pmod t$, calcular el IC muestral de cada uno y promediar. Si $t$ es el largo real, cada sub-texto es rotación pura sobre castellano y el promedio salta a $\approx 0{,}0775$.

Se toma el **$t$ más chico que salta**, porque sus múltiplos también saltan; y con $t$ grande y criptograma corto el estimador se vuelve ruidoso.

## ¿Cómo se identifica el tipo de cifrado clásico mirando sólo el histograma? {#criptografia-clasica:diagnostico-por-histograma}
> pagina: criptoanalisis-por-frecuencias

- Frecuencias **iguales** a las del castellano, letra por letra: transposición.
- **Mismo perfil** que el castellano (un pico de $\approx 13\%$ y cola larga) pero sobre letras distintas: sustitución monoalfabética.
- Frecuencias **aplanadas**, sin picos claros, todas cerca de $1/n$: sustitución polialfabética.

El criterio operativo es mirar la forma del histograma ordenado de mayor a menor, no las letras concretas. En castellano las más frecuentes son E ($13{,}11\%$), A ($10{,}60\%$), S ($8{,}47\%$) y O ($8{,}23\%$).

## ¿Qué altera un cifrado por transposición y cómo se lo detecta? {#criptografia-clasica:transposicion-familia}
> pagina: cifrado-por-transposicion

Es la familia complementaria a la sustitución: **no cambia los símbolos, cambia sus posiciones**. Por eso preserva el histograma exacto del idioma.

Se lo detecta sin descifrarlo: sus frecuencias coinciden exactamente con las del idioma letra por letra, y ninguna sustitución produce eso salvo la identidad. El análisis de frecuencias no lo rompe, pero lo delata.

En la transposición por columnas el texto se escribe por filas en una grilla de $n$ columnas y se lee por columnas; la clave es $n$ y, en la variante con palabra clave, el orden de lectura. El antecedente histórico es la escítala espartana, donde la clave es el diámetro del bastón.

## Enuncie la definición de secreto perfecto {#criptografia-clasica:secreto-perfecto-definicion}
> pagina: secreto-perfecto

Un criptosistema $(\mathsf{Gen}, e, d)$ posee secreto perfecto si para **toda** distribución de probabilidades en $\mathcal{M}$, cada $m \in \mathcal{M}$ y cada $c \in \mathcal{C}$ con $\Pr[C = c] > 0$:

$$
\Pr[M = m \mid C = c] = \Pr[M = m]
$$

Observar el criptograma no cambia lo que el adversario cree sobre el mensaje: la distribución a posteriori es idéntica a la a priori.

La definición no dice nada sobre el poder de cómputo del adversario: el secreto perfecto es **incondicional**.

## Dé la caracterización equivalente del secreto perfecto {#criptografia-clasica:secreto-perfecto-caracterizacion}
> pagina: secreto-perfecto

$$
\Pr[\mathsf{Enc}_K(m) = c] = \Pr[\mathsf{Enc}_K(m') = c] \quad \forall m, m' \in \mathcal{M},\ \forall c \in \mathcal{C}, \quad K \leftarrow \mathsf{Gen}()
$$

Es decir: la distribución del texto cifrado es la misma cualquiera sea el mensaje.

Suele ser más cómoda para demostrar, porque elimina el condicionamiento y la cuantificación sobre toda distribución de $\mathcal{M}$.

## Enuncie el teorema de Shannon sobre la cota de claves {#criptografia-clasica:teorema-de-shannon}
> pagina: secreto-perfecto

$$
\text{Secreto perfecto} \implies \lvert\mathcal{K}\rvert \ge \lvert\mathcal{M}\rvert
$$

Es una cota de conteo: si hubiera menos claves que mensajes, algún $c$ no sería alcanzable desde algún $m$, y ver ese $c$ descartaría ese $m$, filtrando información. Por eso el secreto perfecto es caro: la clave tiene que ser al menos tan larga como todo lo que se vaya a cifrar.

La implicación va **en un solo sentido**: $\lvert\mathcal{K}\rvert \ge \lvert\mathcal{M}\rvert$ es necesario pero no suficiente. La versión más fuerte, en entropía, es $H(K) \ge H(M)$, y tampoco es suficiente.

## ¿Cuándo el cifrado por rotación tiene secreto perfecto? {#criptografia-clasica:rotacion-secreto-perfecto}
> pagina: secreto-perfecto

Con $\mathcal{M} = \mathcal{C} = \Sigma^{\ell}$, si y sólo si $\ell = 1$.

Para $\ell = 1$ existe exactamente una clave que lleva $m$ a $c$, $k = (c - m) \bmod n$, así que $\Pr[\mathsf{Enc}_K(m) = c] = 1/n$, valor independiente de $m$: la tabla de cifrado es un cuadrado latino. Es el one-time pad sobre el grupo $(\mathbb{Z}_n, +)$.

Para $\ell \ge 2$ falla por conteo, $\lvert\mathcal{K}\rvert = n < n^{\ell} = \lvert\mathcal{M}\rvert$, y también de forma explícita: $\mathsf{Enc}_k$ preserva las igualdades posicionales, la misma fuga que habilita el criptoanálisis por frecuencias.

## ¿Qué fórmula se usa para verificar a mano si un esquema tiene secreto perfecto? {#criptografia-clasica:formula-operativa-condicional}
> pagina: modelo-probabilistico-de-un-criptosistema

$$
\Pr[C = y \mid M = x] = \sum_{k\ :\ x\, =\, \mathsf{Dec}_k(y)} \Pr[K = k]
$$

Es la **masa de claves que llevan $x$ a $y$**, y no contiene a $\Pr[M = \cdot\,]$: se lee de la tabla de cifrado y de $\mathsf{Gen}$. Lo que se chequea, libre de distribución, es que ese valor sea el mismo para todo mensaje: $\Pr[C = y \mid M = x] = \Pr[C = y \mid M = x']$ para todo par $x, x'$ y todo $y$.

Todo esto exige la hipótesis de independencia entre clave y mensaje, $\Pr[M = x,\ K = k] = \Pr[M = x]\cdot\Pr[K = k]$; sin ella el cálculo no vale.
