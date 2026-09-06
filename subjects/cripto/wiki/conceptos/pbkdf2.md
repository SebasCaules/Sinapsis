---
title: PBKDF2
resumen: 'Función de derivación de claves que itera $c$ veces una función pseudoaleatoria sobre la contraseña y la sal: multiplica por $c$ el costo de cada intento offline sin tocar la seguridad de la primitiva iterada.'
fuentes: ["[[clase-07-autenticacion]]", "[[salting]]", "[[complejidad-y-espacio-de-claves]]", "[[ataque-de-diccionario-sobre-hashes]]"]
aliases: [PKCS 5 v2.0, Función de derivación de claves basada en contraseña, Estiramiento de claves, Key stretching, Password-Based Key Derivation Function 2]
type: concepto
unidad: 2
clase: 7
orden: 8
created: 2026-09-04
updated: 2026-09-04
tags: [criptografia, autenticacion, pbkdf2, kdf, prf, salting, clase-07, sin-dictar]
sources: ["Clase 07 - Aplicaciones - Principios y autenticacion.pdf"]
---

# PBKDF2

**Cómo estirar el costo de verificar una candidata a contraseña multiplicándolo por $c$ evaluaciones de una función pseudoaleatoria, y por qué eso mueve la aguja de la fórmula de Anderson sin tocar en absoluto la seguridad de la función que se está iterando.** Es, según la propia filmina 27 de esta clase, *"la forma correcta de (no) almacenar contraseñas"*.

Cubre las filminas **41 y 42** del deck `Clase 07 - Aplicaciones - Principios y autenticacion.pdf`, verificadas contra la página renderizada a 150 dpi. Esta clase todavía no se dictó —hoy es 04/09/2026—, así que la nota está escrita contra el PDF, el estándar PKCS #5 v2.0 (RFC 8018) y lecturas propias, rotuladas como tales; no hay transcripción ni video que la cubra.

## La idea, para un solo bloque de salida

La filmina 41 plantea el caso simple: una contraseña $\mathit{pass}$, una sal $S$ ya calculada, y una función pseudoaleatoria $\mathrm{PRF}$ —instanciable con un criptosistema simétrico o un [[message-authentication-code|MAC]]— que se aplica **encadenada sobre sí misma**:

$$u_1 = \mathrm{PRF}(\mathit{pass}, S), \qquad u_2 = \mathrm{PRF}(\mathit{pass}, u_1), \qquad \ldots, \qquad u_j = \mathrm{PRF}(\mathit{pass}, u_{j-1})$$

$$\text{Resultado: } u_1 \oplus u_2 \oplus \cdots \oplus u_j$$

$j$ acá es el **número total de iteraciones** — el parámetro de costo que en la literatura y en el propio algoritmo de la filmina siguiente se llama $c$. Ninguna de las $u_i$ intermedias se expone: se calculan, se van sumando por `xor`, y sólo el `xor` final es el resultado.

## El algoritmo completo, para claves de cualquier largo

La filmina 42 generaliza a una clave derivada $K$ de la longitud $\mathit{len}$ que haga falta, concatenando tantos bloques $T$ como sean necesarios:

$$K = \mathrm{PBKDF2}(\mathrm{prf}, \mathit{pass}, \mathit{salt}, c, \mathit{len}), \qquad K = T_1 \Vert T_2 \Vert \cdots \Vert T_j$$

$$T_j = u_1 \oplus u_2 \oplus \cdots \oplus u_j, \qquad U_1 = \mathrm{PRF}(\mathit{pass}, \mathit{salt}\,\Vert\, j), \qquad U_k = \mathrm{PRF}(\mathit{pass}, u_{k-1})$$

> **Errata de la filmina** *(ya señalada en la [[clase-07-autenticacion#8. PBKDF2|Clase 07]]).* El renglón $K = T_1 \Vert T_2 \Vert T_i$ usa una letra $i$ que no aparece en ningún otro lado de la lámina; la línea siguiente ya define $T_j$, y $U_1$ concatena la sal también con $j$. Arriba va con $j$ en las tres apariciones, que es la letra consistente con el resto de la fórmula.

### Lo que la filmina no distingue: dos roles distintos para la misma letra

**Esto no está en la clase — es una precisión necesaria para poder usar la fórmula sin confundirse.** Aun corregida la errata de arriba, la filmina usa $j$ para **dos cosas simultáneamente**:

1. En $U_1 = \mathrm{PRF}(\mathit{pass}, \mathit{salt}\Vert j)$, $j$ es el **índice del bloque de salida** — el mismo rol que la filmina 41 no necesitaba nombrar, porque ahí sólo había un bloque.
2. En $T_j = u_1 \oplus \cdots \oplus u_j$, la $j$ que indexa la última $u$ es el **número de iteraciones internas**, $c$ — el mismo $j$ genérico de la filmina 41.

Son dos cantidades distintas: una identifica **qué bloque de $K$** se está calculando; la otra dice **cuántas veces** se itera $\mathrm{PRF}$ para calcular ese bloque. El estándar **PKCS #5 v2.0** (RFC 8018) sí las separa, con $i$ para el bloque y $c$ para las iteraciones:

$$\mathrm{DK} = T_1 \Vert T_2 \Vert \cdots \Vert T_l, \qquad l = \left\lceil \frac{\mathit{dkLen}}{\mathit{hLen}} \right\rceil$$

$$T_i = F(P,S,c,i) = U_1 \oplus U_2 \oplus \cdots \oplus U_c, \qquad U_1 = \mathrm{PRF}(P,\, S \,\Vert\, \mathrm{INT}_{32}(i)), \qquad U_k = \mathrm{PRF}(P, U_{k-1}) \;\; (k=2,\ldots,c)$$

donde $\mathrm{INT}_{32}(i)$ es $i$ codificado en 4 bytes big-endian, y el último bloque $T_l$ se trunca a los bytes que falten para completar $\mathit{dkLen}$. Con esta notación, la filmina 42 describe exactamente el caso $l=1$ escrito de forma genérica — y por eso le alcanza una sola letra: cuando sólo hay un bloque de salida, "el índice del bloque" y "el total de iteraciones para producirlo" conviven sin chocar. El problema aparece recién si se lee la fórmula pensando en $l>1$ bloques, que es exactamente lo que $\mathit{len}$ en la firma de la función promete soportar.

## Por qué iterar sube el costo por intento

Cada evaluación de $\mathrm{PRF}$ es una operación más que un atacante offline tiene que pagar por cada candidata que prueba. Subir $c$ **no cambia la seguridad de $\mathrm{PRF}$**: sigue siendo la misma función, con las mismas garantías. Lo que cambia es el **costo por intento**, y ese costo es exactamente el $G$ —pruebas por segundo— de la [[clase-07-autenticacion#La fórmula de Anderson|fórmula de Anderson]]:

$$P \ge \frac{T \cdot G}{N}, \qquad G_{\mathrm{PBKDF2}} = \frac{G_{\text{sin KDF}}}{c}$$

### La cuenta, sobre el propio Ejemplo 1 de la clase

**Ejemplo nuestro, reusando los parámetros exactos del [[clase-07-autenticacion#Ejemplo 1 — cuánto tarda un ataque (filmina 33)|Ejemplo 1]] de la clase** para que la comparación sea directa. Como en los tres ejemplos del deck, la desigualdad se usa acá como **igualdad de estimación** —se reemplaza y se saca un número— y no como la cota que el signo declara *(lectura nuestra)*. Ese ejemplo tenía $N = 10^{10}$ y $G = 10^{4}$ pruebas/segundo, y con $T = 500\,000$ s ($\approx 5{,}79$ días) llegaba a $P = 0{,}5$.

Si esas mismas claves se protegieran con `PBKDF2` a $c = 100\,000$ iteraciones, cada prueba cuesta $10^5$ veces más, así que $G' = G/c = 10^{4}/10^{5} = 0{,}1$ pruebas por segundo. Manteniendo el **mismo** $T = 500\,000$ s:

$$P' = \frac{T \cdot G'}{N} = \frac{500\,000 \times 0{,}1}{10^{10}} = \frac{50\,000}{10^{10}} = 5\times 10^{-6}$$

**La probabilidad de éxito en el mismo tiempo cae de $0{,}5$ a $0{,}0005\,\%$** — seis órdenes de magnitud, exactamente el factor $c$ dividido entre el $G$ original. Visto desde el otro despeje, alcanzar la misma $P=0{,}5$ de antes exige ahora

$$T' \approx \frac{0{,}5 \times 10^{10}}{0{,}1} = 5\times 10^{10}\text{ s} \approx 1585\text{ años}$$

Ninguno de los tres números —$N$, la seguridad de $\mathrm{PRF}$, el algoritmo de ataque— cambió. Lo único que cambió es cuánto cuesta **un** intento, y ese único cambio atraviesa toda la fórmula.

## Qué no resuelve: sin costo de memoria, el ataque se paraleliza barato

**Esto no está en la filmina — es la limitación que llevó a que la práctica se corriera hacia otras funciones.** `PBKDF2` sube $c_h$ —el costo por evaluación—, pero cada evaluación de $\mathrm{PRF}$ sigue siendo **barata en memoria**: son unas pocas operaciones sobre unos pocos bytes de estado. Eso es exactamente lo que le permite a un atacante con GPUs o ASICs correr **miles de evaluaciones en paralelo**, una por núcleo, sin competir por memoria entre ellas — el costo por intento sube, pero se puede pagar en paralelo casi sin fricción.

[[ataque-de-diccionario-sobre-hashes#Funciones deliberadamente lentas|Ataque de diccionario sobre hashes § Funciones deliberadamente lentas]] ya registra la respuesta a esto: `scrypt` y `Argon2` agregan **costo de memoria** además del costo de tiempo, precisamente porque **es la memoria, no el cómputo, lo que no se paraleliza barato** en hardware dedicado. `PBKDF2` sigue siendo estándar —FIPS lo certifica, y es lo único de esta familia que Java expone de fábrica—, pero frente a un atacante con hardware especializado ofrece menos margen por bit de $c$ gastado que sus sucesoras.

## El fragmento de código de la filmina

```
PBEKeySpec spec = new PBEKeySpec(password, salt, iterations, bytes * 8);
SecretKeyFactory skf = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
byte[] key = skf.generateSecret(spec).getEncoded();
```

*(Se preserva tal cual la filmina: es un fragmento de API de JCE, no una fórmula, y por eso queda en backticks en vez de LaTeX.)* La instanciación elegida es `HmacSHA1` — o sea, $\mathrm{PRF} = \mathrm{HMAC}\text{-}\mathrm{SHA1}$ con la clave dada por la propia contraseña. Es la instanciación real más común de la $\mathrm{PRF}$ genérica de la filmina 41: ver [[hmac#HMAC en la práctica|HMAC § HMAC en la práctica]] para cómo se arma esa construcción a partir de una función de hash.

## Ver también

- [[clase-07-autenticacion#8. PBKDF2|Clase 07 — Autenticación § 8. PBKDF2]] — la sección de la que cuelga esta nota
- [[salting|Salting]] — de dónde sale la sal $S$ que esta construcción toma como entrada
- [[complejidad-y-espacio-de-claves|Complejidad y espacio de claves]] — la fórmula de Anderson y el Ejemplo 1 que esta nota reutiliza para la cuenta de costo
- [[politicas-de-seleccion-y-expiracion-de-claves|Políticas de selección y expiración de claves]] — la otra vía para subir el costo de un ataque, actuando sobre el usuario en lugar de sobre el verificador
- [[hmac|HMAC]] — la instanciación real de la $\mathrm{PRF}$ que usa el ejemplo de código
- [[ataque-de-diccionario-sobre-hashes#Funciones deliberadamente lentas|Ataque de diccionario sobre hashes § Funciones deliberadamente lentas]] — dónde entra `PBKDF2` en la familia de KDFs lentas, y por qué `scrypt`/`Argon2` la superan contra hardware dedicado
- [[primitiva-de-cifrado-en-bloque|Primitiva de cifrado en bloque]] — qué es una función pseudoaleatoria, el ingrediente genérico de toda esta construcción
- [[ataques-a-un-sistema-de-autenticacion|Ataques a un sistema de autenticación]] — el ataque offline contra el que esta construcción sube el costo
