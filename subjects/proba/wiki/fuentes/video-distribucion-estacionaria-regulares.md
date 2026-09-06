---
titulo: "Video — Distribución Estacionaria (Regulares)"
resumen: "Clase en video de Lucio Pantazis (unidad 6) sobre la distribución estacionaria de una cadena regular: límite de las potencias de la matriz de transición, definición de cadena regular y resolución del sistema con la restricción de normalización."
tipo: fuente
formato: video
unidad: 6
url: "https://youtu.be/rrIu9X3v1Us"
duracion: "18:25"
docente: Lucio Pantazis
ingerido: 2026-09-03
---

# Video — Distribución Estacionaria (Regulares)

**Qué es:** clase corta y muy concentrada en un solo ejemplo, que desarrolla
la distribución estacionaria de una cadena de Markov para el caso en que la
cadena es **regular**.
**Cubre:** definición de distribución estacionaria como límite de
$\mathbb{P}^n$, estado accesible, cadena regular, la propiedad "regular ⟹
existe $\vec\pi=\vec\pi\mathbb{P}$" (condición suficiente no necesaria), y un
ejemplo numérico completo (comidas de Natalia: bizcochos/cereal/fruta).
**Guía asociada:** Guía 6.

## Recorrido de la clase

| Timestamp | Tema |
|---|---|
| [00:00] | Introducción: qué significa "largo plazo" en un proceso estocástico y por qué en una cadena de Markov sí se puede estudiar, a través de las potencias de $\mathbb{P}$ |
| [00:56] | Reinterpreta las potencias de $\mathbb{P}$ con el ejemplo de las comidas de Natalia: $\mathbb{P}$, $\mathbb{P}^2$, $\mathbb{P}^4$ como probabilidad de pasar de bizcochos a bizcochos en 1, 2 y 4 pasos |
| [02:11] | Muestra $\mathbb{P}^{16}$: todas las filas ya convergen prácticamente al mismo valor — la probabilidad de largo plazo no depende del estado inicial |
| [04:25] | Nombra el fenómeno: "distribución estacionaria" |
| [04:46] | Definición formal: existe $\lim_{n\to\infty}\mathbb{P}^n$ con todas las filas iguales entre sí; ese vector común es $\vec\pi$ |
| [06:37] | Define estado accesible ($\exists k: (\mathbb{P}^k)_{ij}>0$) y menciona, sin desarrollar, la noción de cadena "ergódica" |
| [09:00] | Define cadena regular: existe una potencia de $\mathbb{P}$ con **todas** las coordenadas estrictamente positivas; si una potencia lo cumple, todas las siguientes también |
| [09:43] | Propiedad: cadena regular $\Rightarrow$ existe distribución estacionaria y $\vec\pi=\vec\pi\mathbb{P}$ (autovector a izquierda de autovalor 1) |
| [10:41] | Advertencia: la condición es suficiente pero **no necesaria**; señala como error muy común no verificar la regularidad antes de plantear el autovector |
| [11:47] | Arranca el ejemplo resuelto: comidas de Natalia (bizcochos/cereal/fruta) |
| [12:03] | Explica la técnica de avanzar en potencias de 2 ($\mathbb{P}^2\cdot\mathbb{P}^2=\mathbb{P}^4$, $\mathbb{P}^4\cdot\mathbb{P}^4=\mathbb{P}^8$, …) para verificar regularidad más rápido a mano |
| [14:00] | Plantea el sistema $\vec\pi=\vec\pi\mathbb{P}$; advierte sobre el error de multiplicar "fila por fila" en vez de fila por columna |
| [14:54] | Nota que las tres ecuaciones son linealmente dependientes y agrega la restricción de normalización $a+b+c=1$ |
| [16:53] | Resuelve el sistema numéricamente: $c=2/15$, $a=8/15$, $b=1/3$ |
| [18:09] | Compara el resultado con $\mathbb{P}^{32}$ (coincide) y cierra el video anunciando el caso no regular para la próxima clase |

## Qué aporta sobre el apunte

- **(a) Ejemplo resuelto completo.** El video plantea y resuelve numéricamente,
  paso a paso, el sistema $\vec\pi=\vec\pi\mathbb{P}$ para el ejemplo de las
  comidas de Natalia (bizcochos/cereal/fruta), incluyendo la resolución del
  sistema linealmente dependiente con la restricción $a+b+c=1$. Esta misma
  matriz es la del Ej. 3 del parcial 2025Q2, ya citado (solo como planteo, sin
  resolución numérica) en [[ejercicios-de-parcial-resueltos]]; el video
  completa esa resolución con los valores finales $\vec\pi=(8/15,\,1/3,\,2/15)$.
- **(a) Técnica de las potencias de 2.** El apunte teórico ([[teorica-cadenas-de-markov]]
  y [[cadenas-de-markov]]) no explica *cómo* buscar eficientemente la potencia
  $\mathbb{P}^n$ toda positiva a mano; el video muestra la técnica de elevar al
  cuadrado sucesivamente ($\mathbb{P}^2\cdot\mathbb{P}^2=\mathbb{P}^4$,
  $\mathbb{P}^4\cdot\mathbb{P}^4=\mathbb{P}^8$, etc.) para llegar más rápido a
  una potencia con todas las entradas positivas, en vez de multiplicar por
  $\mathbb{P}$ una vez a la vez.
- **(b) Analogía del gol de rebote.** Para explicar por qué la condición
  "regular $\Rightarrow$ existe $\vec\pi$" es suficiente pero no necesaria, y
  por qué encontrar un vector que cumple $\vec\pi=\vec\pi\mathbb{P}$ sin haber
  verificado antes la regularidad no es un método válido (aunque el resultado
  dé bien), usa la metáfora de patear mal la pelota y que rebote en un
  defensor y termine entrando: "no significa que pateamos bien la pelota,
  significa que tuvimos suerte" [11:34].
- **(d) Énfasis.** Remarca fuertemente el orden correcto del razonamiento:
  primero verificar que la cadena es regular, y **solo después** resolver el
  autovector a izquierda — invertir el orden es, según el docente, "un error
  muy común" [11:04]-[11:47]. También aclara terminología: se dice "cadena
  regular", no "matriz regular" [09:04].

## Ejercicio resuelto en clase

*Arranca en [11:47]. Ejemplo de las comidas de Natalia: $X(n)$ = comida en la
hora $n$, con estados $\{B,C,F\}$ (bizcochos, cereal, fruta) y matriz de
transición*
$$ \mathbb{P}=\begin{pmatrix}0.75 & 0 & 0.25\\ 0.40 & 0.60 & 0\\ 0 & 1 & 0\end{pmatrix}\qquad\text{(orden de filas/columnas }B,C,F\text{).} $$

**Paso 1 — Verificar regularidad [12:03].** Ya se había calculado
$$ \mathbb{P}^4=\begin{pmatrix}0.5264 & 0.3431 & 0.1305\\ 0.5382 & 0.3246 & 0.1373\\ 0.549 & 0.316 & 0.135\end{pmatrix}>0, $$
con **todas** las coordenadas estrictamente positivas. $\mathbb{P}^4$ se
obtuvo como $\mathbb{P}^2\cdot\mathbb{P}^2$ (en vez de $\mathbb{P}^2\cdot\mathbb{P}$
y luego $\cdot\mathbb{P}$ otra vez), avanzando más rápido en la cadena.
Como hay una potencia toda positiva, la cadena es **regular**, y por lo
tanto existe distribución estacionaria.

**Paso 2 — Plantear el sistema [14:00].** Se busca $\vec\pi=(a,b,c)$ tal que
$\vec\pi=\vec\pi\,\mathbb{P}$:
$$ (a,b,c)=(a,b,c)\begin{pmatrix}0.75 & 0 & 0.25\\ 0.40 & 0.60 & 0\\ 0 & 1 & 0\end{pmatrix} \;\Rightarrow\;
\begin{cases} a = 0.75\,a + 0.4\,b\\ b = 0.6\,b + c\\ c = 0.25\,a \end{cases}
\;\Rightarrow\;
\begin{cases} 0.25\,a = 0.4\,b\\ 0.4\,b = c\\ c = 0.25\,a \end{cases} $$

**Paso 3 — Detectar la dependencia lineal y normalizar [14:54].** Las tres
ecuaciones son linealmente dependientes (dan información redundante), así que
no alcanzan para despejar $a,b,c$: hay que "fletear" una y agregar que
$\vec\pi$ es una distribución de probabilidad, $a+b+c=1$. Fleteando la
segunda ecuación ($0.4\,b=c$, con $0.4=2/5$):
$$ \begin{cases} b=\dfrac{5}{2}\,c\\ a=4c\\ a+b+c=1 \end{cases} $$

**Paso 4 — Resolver numéricamente [16:53].** Reemplazando en la restricción
de normalización:
$$ 4c+\frac{5}{2}c+c=1 \;\Rightarrow\; \frac{15}{2}c=1 \;\Rightarrow\; c=\frac{2}{15}. $$
Entonces
$$ a=4c=\frac{8}{15}\approx 0.5333,\qquad b=\frac{5}{2}c=\frac{1}{3}\approx 0.3333. $$

**Resultado.**
$$ \vec\pi=\left(\frac{8}{15},\ \frac{1}{3},\ \frac{2}{15}\right). $$

**Verificación [18:09].** Coincide exactamente con las filas (ya estabilizadas)
de $\mathbb{P}^{32}\approx\begin{pmatrix}0.5333&0.3333&0.1333\\ 0.5333&0.3333&0.1333\\ 0.5333&0.3333&0.1333\end{pmatrix}$,
confirmando que el cálculo algebraico coincide con el límite numérico de las
potencias de $\mathbb{P}$.

## Advertencias del docente

- Es "cadena regular", no "matriz regular": el término correcto se aplica a la
  cadena, no a la matriz de transición [09:04].
- Error muy común: aplicar el procedimiento del autovector a izquierda
  ($\vec\pi=\vec\pi\mathbb{P}$) **sin haber verificado antes** que la cadena es
  regular. Si la cadena no es regular, ese procedimiento no es una herramienta
  válida, aunque por casualidad dé un resultado que parezca correcto [10:41]-[11:44].
- Al hacer $(a,b,c)\times\mathbb{P}$, la multiplicación de matrices es **fila
  por columna**; el docente marca explícitamente que confundir esto y hacerlo
  "fila por fila" (o al revés, trasponiendo la matriz) es "un error muy muy
  evitable" que además "demuestra que no están entendiendo nada" [14:11]-[14:29].

## Páginas del wiki que toca

- [[cadenas-de-markov]]
- [[procesos-estocasticos]]
