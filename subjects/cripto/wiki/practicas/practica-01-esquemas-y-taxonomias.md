---
title: Práctica 01 — Esquemas y taxonomías
resumen: 'Clase práctica del 10/08 en cuatro filminas que no agregan contenido nuevo y ordenan lo que la teoría dio suelto: el esquema de clave privada Gen, Enc, Dec, los árboles de cifrados clásicos y de ataques, y un cierre sobre Malvinas.'
fuentes: ["[[clase-01-introduccion-y-criptografia-clasica]]", "[[guia-01-criptografia-clasica]]"]
aliases: [Práctica 1, Práctica 01, Clase práctica 1, Taxonomía de cifrados clásicos, Taxonomía de ataques]
type: practica
clase: 1
orden: 20
practica: 1
fecha: 2026-08-10
created: 2026-08-11
updated: 2026-09-04
tags: [practica, criptografia-clasica, taxonomia, modelos-de-ataque, indice-de-coincidencia, malvinas]
sources: [Clase 1.pdf]
---

# Práctica 01 — Esquemas y taxonomías

> **10/08/2026** · [Filminas](../../raw/practicas/Clase%201.pdf) · Teoría: [[clase-01-introduccion-y-criptografia-clasica|Clase 01]] · Guía: [[guia-01-criptografia-clasica|Guía 1 — Criptografía Clásica]]

> **Ojo con el nombre.** El archivo de la cátedra se llama `Clase 1.pdf`, pero es la **clase práctica del lunes 10/08**, no la clase teórica 1 (esa es del jueves 06/08 y vive en [[clase-01-introduccion-y-criptografia-clasica|clase-01]], con filminas `Clase 01 - Criptografia - Introduccion.pdf`). Dos archivos distintos, dos clases distintas, nombres casi idénticos. Acá va la práctica.
> El patrón se repite tres veces más y conviene tenerlo entero: `Clase 3.pdf` es la [[practica-03-seudoaleatoriedad-y-modos|Práctica 03]] del 24/08, `Clase 4.pdf` es la [[practica-04-macs-hash-y-cifrado-autenticado|Práctica 04]] del 31/08, y —fuera de `raw/practicas/`— `raw/clases/Clase 03pt2 - Transcripcion.VTT` no es la Clase 4 sino la **segunda sesión de la Clase 3**. La cátedra numera **por sesión**, no por tema.

Son **cuatro filminas** y ninguna introduce contenido nuevo: son el **mapa** de lo que la teoría dio suelto. Sirven exactamente para eso — si se busca "¿por dónde se ataca cada cifrado?" o "¿qué diferencia hay entre plano conocido y plano elegido?", la respuesta está acá en forma de árbol, y el desarrollo está en los conceptos linkeados.

---

## 1. El esquema pi(Gen, Enc, Dec) de clave privada

La notación que la práctica va a usar de acá en adelante:

$$\begin{aligned}
&\pi(\mathsf{Gen}, \mathsf{Enc}, \mathsf{Dec})_{\text{priv}}\\[6pt]
&\quad k \leftarrow \mathsf{Gen}()\\
&\quad c \leftarrow \mathsf{Enc}_k(m)\\
&\quad m := \mathsf{Dec}_k(c)\\[6pt]
&\quad \mathsf{Dec}_k(\mathsf{Enc}_k(m)) = m \qquad \longleftarrow \text{Correcto}
\end{aligned}$$

> **La seguridad debe recaer en que la clave se mantenga en secreto.**

> La filmina escribe la letra en **minúscula** ($\pi$), y así se reproduce acá. Katz & Lindell nota lo mismo con **$\Pi$ mayúscula**; si estás leyendo el libro en paralelo, es el mismo objeto. (Ojo con el choque de símbolos: en el ataque a la [[cifrado-de-sustitucion-monoalfabetica|sustitución monoalfabética]] $\pi$ es la permutación-clave, otra cosa.)

Es la **misma terna** de [[criptosistema]]; lo que aporta la filmina es la notación fina:

| Símbolo | Qué marca | Dónde aparece |
|---|---|---|
| $\leftarrow$ | asignación **probabilística** | $k \leftarrow \mathsf{Gen}()$, $c \leftarrow \mathsf{Enc}_k(m)$ |
| $:=$ | asignación **determinística** | $m := \mathsf{Dec}_k(c)$ |

`Dec` está escrito con $:=$ a propósito: **descifrar no puede tirar una moneda**, porque el resultado tiene que ser único. `Gen` sí es probabilístico (elige la clave al azar), y `Enc` se escribe con $\leftarrow$ para dejar la puerta abierta a esquemas modernos donde el cifrado es probabilístico — en los clásicos es determinístico.

> *Inferencia (no está dicho en la filmina):* ese determinismo de `Enc` es lo que vuelve **repetible** la consulta al oráculo, y por eso los clásicos caen tan barato bajo [[modelos-de-ataque|CPA]]. La filmina sólo pone la flecha; el enlace con CPA lo agrego yo.

> **Esta distinción es lo que la práctica le exporta al resto del vault.** El glosario la levanta de acá: en [[notacion-y-terminologia#4. Asignación y azar|notación y terminología § Asignación y azar]] el $\leftarrow$ y el $:=$ conviven con la flecha de **sorteo uniforme** y con el $b \leftarrow \{0,1\}$ que sortea el bit oculto de las [[pruebas-de-indistinguibilidad|pruebas de indistinguibilidad]]. Si aparece un símbolo del vault y no se recuerda qué era, esa es la nota de vuelta.

La igualdad rotulada **"Correcto"** es la **condición de corrección**: sin ella no hay criptosistema. Es la propiedad mínima, previa a cualquier discusión de seguridad.

El subíndice $\text{priv}$ (de *private-key*) marca que el esquema es de **clave privada**: una sola $k$ para cifrar y descifrar.

> *Inferencia (no está dicho en la filmina):* si hace falta aclarar el $\text{priv}$, es porque más adelante va a aparecer la contraparte **asimétrica**, con clave de cifrar distinta de la de descifrar. La filmina no lo anuncia — el subíndice sí queda sin sentido si no existiera esa otra rama.

Y el recuadro cierra con lo único que se asume secreto — es [[principio-de-kerckhoffs|Kerckhoffs]] enunciado en una línea: todo lo demás (los tres algoritmos, los tres espacios) es público.

---

## 2. Taxonomía de cifrados clásicos

```
Cifrados clásicos
│
├── Sustitución
│   │
│   ├── Sustitución Monoalfabética ──── Ej: Cifrado César
│   │        • Espacio de claves (necesario)
│   │        • Frecuencias originales en cifrado
│   │
│   └── Sustitución Polialfabética ──── Ej: Cifrado Vigenere
│            • Período de clave:  D |periodo
│            • Índice de coincidencia:  Σ p_i² ≈ 0,0775
│
└── Trasposición ─────────────────────── Ej: Trasposición por columnas
         • Frecuencias originales
```

Las hojas, con su nota:

| Familia | Ejemplo | Concepto |
|---|---|---|
| Sustitución monoalfabética | Cifrado César | [[cifrado-de-sustitucion-monoalfabetica\|Sustitución monoalfabética]] · [[cifrado-por-rotacion\|Cifrado por rotación]] |
| Sustitución polialfabética | Cifrado Vigenère | [[cifrado-de-vigenere\|Cifrado de Vigenère]] |
| Trasposición | Trasposición por columnas | [[cifrado-por-transposicion\|Cifrado por transposición]] |

### La columna de la derecha es lo importante

Los bullets **no describen** cada familia: dicen **por dónde se la ataca**. Leído así, el árbol es una tabla de vulnerabilidades.

**• Espacio de claves (necesario)** → [[ataque-de-fuerza-bruta|Ataque de fuerza bruta]]
Que $\lvert K\rvert$ sea grande es condición **necesaria pero no suficiente**. César tiene $\lvert K\rvert = n$ y cae por [[ataque-de-fuerza-bruta|fuerza bruta]] en un pizarrón; la sustitución monoalfabética general tiene $\lvert K\rvert = n!$ y **igual cae**, por el bullet de abajo. El "(necesario)" del paréntesis es exactamente ese matiz.

> **Cuánto vale $n$ depende del alfabeto**, y en esta materia conviven los dos.
> - $n = 26$ (inglés) es el del ejemplo de sustitución de la [[clase-01-introduccion-y-criptografia-clasica|Clase 01]] (`a…z`, $26!$) y el que adopta **nuestra resolución** del Ej. 1 — ojo: el enunciado del [[guia-01-criptografia-clasica|Ej. 1]] **no fija ningún alfabeto**, el 26 lo elegimos [[guia-01-resolucion|nosotros]].
> - $n = 27$ (castellano) es el del **Ej. 3**, que lo dice explícito (*"texto en español (27 letras)"*), el del ejercicio de descifrado de la Clase 01 (*"el mensaje original está en castellano"*) y el que implica la sumatoria $\sum_{i=0}^{26}$ de la filmina del IC.
>
> Da $26! \approx 4\times10^{26}$ contra $27! \approx 1{,}1\times10^{28}$: el argumento no cambia (fuerza bruta inviable en los dos casos), el número sí. Por eso acá se escribe $n!$ y se aclara el $n$ en cada ejercicio — es el criterio de [[cifrado-de-sustitucion-monoalfabetica|sustitución monoalfabética]].
>
> *Lectura propia:* la filmina de rotación de la Clase 01 es ambigua sobre esto. Dice *"la clave $k$ es un número entre 1 y 26 **(cantidad de letras − 1)**"*, que sólo cierra con 27 letras, pero en la línea siguiente dice *"volviendo a la `'a'` luego de la `'z'`"*, que implica 26. Conviene fijar el alfabeto en cada ejercicio en vez de dar uno por sentado.

**• Frecuencias originales en cifrado** → [[criptoanalisis-por-frecuencias|Criptoanálisis por frecuencias]]
La sustitución monoalfabética permuta los símbolos pero **no toca sus conteos**: el histograma del criptograma es el del castellano con las etiquetas cambiadas de lugar. Se ataca emparejando picos.

**• Período de clave: $D \mid \text{periodo}$** → [[test-de-kasiski|Test de Kasiski]]
Así, tal cual y sin glosa, lo anota la filmina. El mecanismo que comprime: si una misma secuencia se repite en el criptograma, es (casi siempre) el mismo trozo de plano cifrado con el **mismo tramo de clave**, así que la **distancia $D$** entre las dos apariciones es múltiplo del período $t$. Se juntan varias distancias, se factorizan, y los **divisores comunes** quedan como candidatos a longitud de clave. Es el procedimiento del [[guia-01-criptografia-clasica|Ej. 6 de la Guía 1]].

> *Lectura propia (la filmina no la explicita):* el hecho matemático va en el sentido **$\text{período} \mid D$** — el período divide a **cada** distancia entre repeticiones —, así que la notación de la filmina, leída literal como "$D$ divide al período", queda **al revés**. Que la lectura inversa es falsa se ve con un contraejemplo: si el período es $t = 3$ y las distancias observadas son $12$ y $18$, entonces $D = 6$ es divisor común de las dos y **no** divide a $3$. Por eso $t$ aparece *entre* los divisores comunes de las distancias, pero no todo divisor común es $t$: hay que elegir el candidato (mcd, o el divisor más frecuente), que es justamente el paso de estimación del método. Desarrollo en [[test-de-kasiski|Test de Kasiski]].

**• Índice de coincidencia: $\sum_{i=0}^{26} p_i^{2} \approx 0{,}0775$** → [[indice-de-coincidencia|Índice de coincidencia]]
La probabilidad de que dos letras tomadas al azar del texto coincidan. Para el castellano da **0,0775**; para texto uniforme da $1/n \approx 0{,}037$. Sirve como **confirmación estadística** de lo que Kasiski sugiere: si se parte el criptograma en $t$ sub-cadenas y cada una da un IC cercano a $0{,}0775$, ese $t$ es el período correcto (cada sub-cadena es un [[cifrado-por-rotacion|cifrado por rotación]] puro, y rotar **no cambia** el IC). Si $t$ está mal, las sub-cadenas mezclan corrimientos y el IC se cae hacia el valor uniforme.

> *Inferencia (no está dicho en la filmina):* que la sumatoria vaya de $i = 0$ a $26$ son **27 términos**, o sea el alfabeto castellano de 27 letras — consistente con el valor 0,0775 y con los enunciados de la [[guia-01-criptografia-clasica|Guía 1]], que trabajan en castellano de 27 letras.

### El contraste que hace legible al árbol

Nótese qué bullet se repite y dónde:

| Familia | ¿Deja las frecuencias originales? | Consecuencia |
|---|---|---|
| Monoalfabética | **Sí** (permutadas de etiqueta) | Cae por frecuencias |
| Polialfabética | **No** — las aplana | Hay que romper el período primero (Kasiski / IC) |
| Trasposición | **Sí** (idénticas, ni siquiera permutadas) | Cae por frecuencias… pero de otra manera |

**Monoalfabética y trasposición comparten el mismo bullet**, y eso es el punto: ambas preservan la estadística de primer orden, así que el histograma **no alcanza para distinguirlas entre sí** — sólo para separarlas de la polialfabética. Es literalmente el [[guia-01-criptografia-clasica|Ej. 5 de la Guía 1]]: dado un criptograma, decidir cuál de las tres es.

El criterio que sale del árbol:

1. **¿El histograma es plano** (todas las letras parecidas, IC $\approx 1/n$)? → **polialfabética**.
2. **¿Tiene la forma característica del castellano?** → monoalfabética **o** transposición. Para desempatar hay que mirar otra cosa: si las letras que aparecen son **exactamente** las frecuentes del castellano (`E`, `A`, `O`…) con sus conteos, es **transposición** (los símbolos no cambiaron, sólo se movieron); si la forma está pero asignada a letras "equivocadas", es **monoalfabética**.

---

## 3. Taxonomía de ataques

```
Ataques
│
├── Pasivo
│   │
│   ├── Ataque de texto cifrado solo
│   │        • Dato: cifrado
│   │        • Obtiene todo el plano
│   │
│   └── Ataque de texto plano conocido
│            • Dato: pares (cifrado, plano)
│            • Obtiene todo el plano
│
└── Activo
    │
    ├── Ataque de texto plano elegido
    │        • Obtiene pares (cifrado, plano)   ← elige el PLANO
    │        • Obtiene todo el plano
    │
    └── Ataque de texto cifrado elegido
             • Obtiene pares (cifrado, plano)   ← elige el CIFRADO
             • Obtiene todo el plano
```

### El eje pasivo / activo

**Esto es lo que aporta la filmina:** el corte de primer nivel no es "cuánta información tiene el adversario", es **si interactúa o no**. El desarrollo del eje está en [[modelos-de-ataque|modelos de ataque]] (sección *El eje pasivo / activo*); acá va sólo lo que se lee del árbol.

- **Pasivo** — el adversario **sólo observa**. Recibe lo que el canal le da y no puede influir en qué se cifra. Por eso los bullets dicen ***Dato***: es material que le llega, no que él produce.
- **Activo** — el adversario **interactúa con un oráculo**: elige las entradas y consigue las salidas correspondientes. Por eso los bullets dicen ***Obtiene***: los pares no le llegan, se los fabrica.

El verbo del bullet (*Dato* vs *Obtiene*) es la marca de la filmina para esa distinción. Y notar que **el objetivo es el mismo en los cuatro**: `Obtiene todo el plano`. Lo que cambia es el poder de partida, no la meta.

### Mapeo a la nomenclatura COA/KPA/CPA/CCA

| Filmina | Sigla | Inglés | Eje | Qué elige |
|---|---|---|---|---|
| Ataque de texto cifrado solo | **COA** | *ciphertext-only attack* | Pasivo | nada |
| Ataque de texto plano conocido | **KPA** | *known-plaintext attack* | Pasivo | nada (los pares le vienen dados) |
| Ataque de texto plano elegido | **CPA** | *chosen-plaintext attack* | Activo | el **plano** (oráculo de `Enc`) |
| Ataque de texto cifrado elegido | **CCA** | *chosen-ciphertext attack* | Activo | el **cifrado** (oráculo de `Dec`) |

→ Desarrollo completo, incluida la relación de inclusión entre los cuatro y por qué son realistas: **[[modelos-de-ataque|Modelos de ataque]]**.

La bisagra entre **KPA y CPA** es exactamente el eje pasivo/activo, y es la que más se confunde: en los dos casos el adversario tiene pares $(m, c)$. La diferencia es **quién eligió el $m$**. En KPA se los encontró; en CPA los pidió. Con esa capacidad de elegir, los cifrados clásicos caen con **una sola consulta** — es el [[guia-01-criptografia-clasica|Ej. 8 de la Guía 1]].

---

## 4. Criptografía clásica en la Guerra de Malvinas

Cierre de la práctica. La filmina muestra la foto de una **máquina de cifrado mecánica** y de un **telegrama cifrado** de la época, más dos links de lectura:

- <https://www.tec.gob.ar/el-ultimo-secreto-de-malvinas-como-la-inteligencia-argentina-busco-informacion-sobre-el-enemigo/>
- <https://hoydia.com.ar/mundo/66689-revelan-complicidad-de-ee-uu-con-gran-bretana-durante-la-guerra-de-malvinas/>

> La filmina **no trae texto**: sólo las imágenes y los dos enlaces. No hay desarrollo del caso en el material de la cátedra, así que acá no se afirma nada sobre él. Si en clase se dijo algo, va acá.

---

## Ver también

- [[clase-01-introduccion-y-criptografia-clasica|Clase 01 — Introducción y criptografía clásica]] — la teoría del jueves 06/08, que esta práctica ordena
- [[guia-01-criptografia-clasica|Guía 1 — Criptografía Clásica]] — los ejercicios donde se aplica cada rama del árbol (Ej. 5 → taxonomía de cifrados, Ej. 6 → Kasiski/IC, Ej. 8 → CPA)
- [[practica-02-videos|Práctica 02 — Videos]]
- [[criptosistema|Criptosistema]] · [[principio-de-kerckhoffs|Principio de Kerckhoffs]]
- [[modelos-de-ataque|Modelos de ataque]] · [[indice-de-coincidencia|Índice de coincidencia]] · [[test-de-kasiski|Test de Kasiski]]
- [[notacion-y-terminologia|Notación y terminología]] — el glosario que toma de esta práctica la distinción $\leftarrow$ contra $:=$ y la extiende a todos los símbolos del vault
- [[indice|Índice del vault]]
