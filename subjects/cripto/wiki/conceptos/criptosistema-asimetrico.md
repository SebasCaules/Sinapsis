---
title: Criptosistema asimétrico
resumen: 'Terna Gen, Enc, Dec con par de claves pública y privada, y experimento Eav en el que el adversario recibe pk. De ahí que ser indistinguible ante escucha ya implique CPA-Secure y que el cifrado deba ser probabilístico.'
fuentes: ["[[clase-04-criptografia-asimetrica-y-firma-digital]]", "[[pruebas-de-indistinguibilidad]]", "[[criptosistema]]", "[[cifrado-probabilistico-nonce-e-iv]]"]
aliases: [Criptosistema asimétrico, Cifrado de clave pública, Terna Gen Enc Dec asimétrica, Prueba Eav asimétrica, Cifrado no determinístico]
type: concepto
unidad: 1
clase: 4
orden: 5
created: 2026-09-04
updated: 2026-09-04
tags: [criptografia, criptosistema-asimetrico, clave-publica, indistinguibilidad, cpa-secure, clase-04, sin-dictar]
sources: ["Clase 04 - Criptografia - Cifrado asimetrico y firma digital.pdf"]
---

# Criptosistema asimétrico

**La terna de algoritmos y la prueba de indistinguibilidad que definen qué significa "cifrar con clave pública" — y por qué, en este mundo, ser seguro contra un adversario pasivo ya implica ser `CPA-Secure` sin necesidad de ningún oráculo.** Es la maquinaria formal que después instancian `RSA` y `El Gamal`.

Sale de las filminas **21 a 23** de la Clase 04. Esta clase todavía no se dictó —hoy es 04/09/2026, la clase es el 10/09—, así que la nota está escrita contra el PDF de filminas, más Katz & Lindell y lecturas propias rotuladas; no hay transcripción y por lo tanto ningún callout *De la transcripción*.

## La terna

Igual que un criptosistema simétrico ($\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec}$, [[clase-01-introduccion-y-criptografia-clasica#2. Criptosistema (vista informal)|Clase 01]]), un criptosistema asimétrico es una terna de algoritmos — la diferencia decisiva está en qué toma cada uno como clave:

$$\begin{aligned}
\mathsf{Gen}&:\ () \to (pk, sk) &&\text{(public key, secret key)}\\
\mathsf{Enc}&:\ \mathsf{Enc}_{pk}(m)\\
\mathsf{Dec}&:\ \mathsf{Dec}_{sk}(c)\\[4pt]
&\text{Propiedad: para todo } m,\ \mathsf{Dec}_{sk}(\mathsf{Enc}_{pk}(m)) = m
\end{aligned}$$

$\mathsf{Gen}$ ya no produce una única clave sino un **par**: una clave pública $pk$, que se puede distribuir sin restricción, y una clave privada $sk$, que se mantiene en secreto. $\mathsf{Enc}$ **siempre** toma la clave pública, nunca la privada; $\mathsf{Dec}$ **siempre** toma la privada. Es la traducción directa de la idea del candado que abre el [[clase-04-criptografia-asimetrica-y-firma-digital#2. La revolución asimétrica|§2 de la Clase 04]]: cualquiera puede cerrar (cifrar, con $pk$), sólo el dueño de la llave puede abrir (descifrar, con $sk$).

## La prueba Eav: indistinguibilidad ante escucha

$$\begin{aligned}
\textbf{Experimento } \mathsf{Eav}_{A,\Pi}:\\
&\text{Se genera } (pk, sk) \leftarrow \mathcal{K}\\
&\text{1. } A \text{ recibe } pk \text{ y emite } m_0, m_1\\
&\text{2. Se genera } b \leftarrow \{0,1\}\\
&\text{3. Se calcula } c \leftarrow \mathsf{Enc}_{pk}(m_b) \text{ y se le envía a } A\\
&\text{4. } A \text{ emite } b' \in \{0,1\}\\
&\mathsf{Eav}_{A,\Pi} = 1 \iff b = b'
\end{aligned}$$

$$\Pr[\mathsf{Eav}_{A,\Pi}=1] < 0{,}5 + \varepsilon(n) \;\Longrightarrow\; \Pi \text{ es indistinguible}$$

Es literalmente el mismo experimento `Eav` simétrico de la [[clase-02-cifrado#7. Pruebas de seguridad e indistinguibilidad|Clase 02]] —el adversario elige dos mensajes, recibe el cifrado de uno de los dos elegido al azar, y tiene que adivinar cuál fue— salvo por un cambio de un solo símbolo que decide todo: **acá el adversario recibe $pk$** antes de elegir $m_0$ y $m_1$.

> **Errata de la filmina (22), ya señalada en la [[clase-04-criptografia-asimetrica-y-firma-digital#6. Criptosistema asimétrico y la prueba de indistinguibilidad|Clase 04]].** El paso 3 de la filmina dice *"$c \leftarrow \mathsf{Enc}_{sk}(m_b)$"* — con la clave **privada**. Es incoherente con la propia terna de la filmina anterior, donde $\mathsf{Enc}$ toma siempre $pk$, y el adversario de este experimento sólo conoce $pk$: no podría ni evaluar esa línea. Arriba va corregido a $\mathsf{Enc}_{pk}(m_b)$.

## Por qué el pk público lo cambia todo

En el mundo simétrico, la prueba `Eav` es estrictamente más débil que `CPA`: en `Eav` el adversario no tiene acceso a un oráculo de cifrado, así que sólo puede observar **un** cifrado elegido por el desafiante. Ganar acceso a un oráculo —poder pedir el cifrado de mensajes propios— es lo que separa `Eav` de `CPA` en la [[clase-02-cifrado#7. Pruebas de seguridad e indistinguibilidad|Clase 02]].

**En el mundo asimétrico esa distinción se borra.** Cualquiera que conozca $pk$ —y en este experimento el adversario la conoce desde el paso 1— **ya tiene acceso de fábrica a la función de cifrado**: puede calcular $\mathsf{Enc}_{pk}(m)$ para cualquier $m$ que elija, sin necesitar preguntarle nada a nadie. Es exactamente lo que en simétrico había que ganar con un oráculo de consultas.

$$\text{Indistinguible ante un adversario pasivo (`Eav`)} \;\Longrightarrow\; \text{`CPA-Secure`}$$

en un criptosistema asimétrico, sin que haga falta un experimento `CPA` separado con oráculo explícito — el oráculo está siempre disponible con solo conocer $pk$.

## El corolario que se sigue directo: cifrado no determinístico obligatorio

$$\text{`CPA-Secure`} \;\Longrightarrow\; \mathsf{Enc}_{pk} \text{ no puede ser determinística}$$

**Por qué.** Si $\mathsf{Enc}_{pk}$ fuera determinística —el mismo mensaje siempre produce el mismo criptograma bajo la misma clave—, el propio adversario del experimento `Eav` podría, tras recibir $c$ en el paso 3, calcular por su cuenta $\mathsf{Enc}_{pk}(m_0)$ y $\mathsf{Enc}_{pk}(m_1)$ —tiene $pk$, así que puede hacerlo sin ningún oráculo— y comparar cuál de los dos coincide bit a bit con $c$. Esa comparación identifica $b$ con probabilidad $1$, así que $\Pr[\mathsf{Eav}=1]=1 \gg 0{,}5+\varepsilon(n)$: el esquema queda roto trivialmente.

Esta es la razón formal, no una preferencia de diseño, de por qué **todo** criptosistema asimétrico seguro tiene que ser probabilístico: necesita algún tipo de aleatoriedad interna —un valor $r$ o $y$ elegido al azar en cada ejecución de $\mathsf{Enc}$— para que cifrar el mismo mensaje dos veces dé resultados distintos. Es la misma exigencia que [[cifrado-probabilistico-nonce-e-iv|Cifrado probabilístico, nonce e IV]] desarrolla para el mundo simétrico, llevada acá a una consecuencia todavía más dura: en simétrico un esquema determinístico puede seguir siendo `Eav`-seguro (porque el adversario no tiene acceso de fábrica al cifrado); en asimétrico, no.

**Consecuencia inmediata sobre los esquemas concretos que siguen.** `Textbook RSA` ([[rsa|RSA]]) es determinístico y por lo tanto **no puede ser `CPA-Secure`** — es exactamente el primer problema que la [[clase-04-criptografia-asimetrica-y-firma-digital#7. RSA: textbook RSA y sus problemas|Clase 04]] señala de textbook RSA, y esta nota es la que explica **por qué** ese problema es fatal y no cosmético. `El Gamal`, en cambio, sortea un exponente $y$ nuevo en cada cifrado —es probabilístico por construcción— y por eso puede alcanzar `CPA-Secure` bajo `DDH`.

## Ver también

- [[clase-04-criptografia-asimetrica-y-firma-digital#6. Criptosistema asimétrico y la prueba de indistinguibilidad|Clase 04 — Criptografía asimétrica y firma digital § 6. Criptosistema asimétrico y la prueba de indistinguibilidad]] — la sección de la que sale esta nota, con la errata de la filmina 22 desarrollada
- [[diffie-hellman|Diffie-Hellman]] — el intercambio de claves que antecede a esta terna en la estructura de la clase
- [[rsa|RSA]] — el primer criptosistema concreto, y por qué su determinismo lo descalifica de entrada según esta nota
- [[el-gamal|El Gamal]] — el criptosistema probabilístico que sí satisface esta definición bajo `DDH`
- [[firma-digital|Firma digital]] — la terna espejada de ésta, con clave privada para firmar y pública para verificar
- [[pruebas-de-indistinguibilidad|Pruebas de indistinguibilidad]] — la familia `Eav`/`Mul`/`CPA`/`CCA` de la que este `Eav` asimétrico es una variante
- [[cifrado-probabilistico-nonce-e-iv|Cifrado probabilístico, nonce e IV]] — la misma exigencia de no determinismo, del lado simétrico
- [[criptosistema|Criptosistema]] — la terna $(\mathsf{Gen},\mathsf{Enc},\mathsf{Dec})$ simétrica de la que ésta es la variante de clave pública
- Katz & Lindell, cap. 11 *Public-Key Encryption* — la definición formal de criptosistema de clave pública e `IND-CPA` ([[bibliografia|bibliografía]])
