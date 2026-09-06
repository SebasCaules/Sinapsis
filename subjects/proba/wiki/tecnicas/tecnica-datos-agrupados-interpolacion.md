---
titulo: "Técnica: interpolación en datos agrupados"
resumen: 'Cuando el enunciado solo da una tabla de frecuencias, la mediana, los cuartiles y las proporciones salen de localizar el intervalo con la frecuencia acumulada e interpolar: $q_j=L_i+\frac{0.25\,j\,n-F_{i-1}}{f_i}(L_{s,i}-L_i)$.'
tipo: tecnica
unidad: 1
orden: 10
tags: [estadistica-descriptiva, datos-agrupados, interpolacion, parcial]
fuentes: ["[[estadistica-descriptiva-general]]", "[[tp1-estadistica-descriptiva]]", "[[video-datos-agrupados]]"]
actualizado: 2026-09-04
---

# Técnica: interpolación en datos agrupados

**En breve.** Receta de parcial para sacar **mediana, cuartiles, moda y proporciones**
a partir de una tabla de [[datos-agrupados]]: se localiza el intervalo donde cae la
fracción buscada usando la **frecuencia acumulada** y se **interpola linealmente**
dentro de él. Es el ejercicio típico de la Unidad 1.

Cómo obtener **mediana, cuartiles y proporciones** cuando solo se tiene una tabla
de [[datos-agrupados]] (intervalos $[L_i, L_{s,i})$ con frecuencia $f_i$).

## Cuándo se reconoce
El enunciado da una **tabla de frecuencias** (no los datos individuales) y pide un
cuartil, la mediana, o "qué porcentaje de los datos cae en tal intervalo".

## Cuartil / mediana por interpolación
1. Calcular la **frecuencia acumulada** $F_i$ (datos con valor $\le L_{s,i}$).
2. Para el cuartil $q_j$, buscar el intervalo $i$ donde la acumulada cruza
   $j\cdot 0.25 \cdot n$ (para la mediana, $j=2$ ⇒ $n/2$).
3. Interpolar linealmente dentro de ese intervalo:
$$ q_{j,Ag} = L_i + \frac{j\cdot 0.25\cdot n - F_{i-1}}{f_i}\,(L_{s,i} - L_i) $$
donde $F_{i-1}$ es la acumulada **hasta el inicio** del intervalo y $f_i$ su
frecuencia.

> [!figura] u1-lectura-del-cuartil-sobre-la-ojiva
> La fórmula leída como geometría: la horizontal en $j\cdot 0.25\cdot n$ corta el segmento del intervalo donde cae el cruce y la vertical baja hasta el cuartil. Observe que el cociente $(j\cdot 0.25\, n - F_{i-1})/f_i$ es la fracción del ancho del intervalo que se avanza.

> **Intuición.** La fórmula es una regla de tres: dentro del intervalo modal se supone
> que los datos están repartidos **parejo**, así que la posición buscada avanza una
> fracción del ancho del intervalo igual a la fracción de frecuencia que falta acumular
> $\big(\tfrac{j\cdot 0.25\, n - F_{i-1}}{f_i}\big)$. Es el mismo razonamiento de leer
> un valor intermedio en el polígono de [[histograma-y-frecuencias|frecuencias acumuladas]].

**Ejemplo** (teórica, $q_1$, $n=60$): intervalo $[36,39)$ con $F_{i-1}=12$,
$f_i=18$:
$$ q_{1,Ag} = 36 + \frac{0.25\cdot 60 - 12}{18}\,(39-36) = 36 + \frac{3}{18}\cdot 3 = 36.5. $$

## Proporción de datos en un intervalo $(a,b)$
Sea $P(\cdot)$ la interpolación lineal del **polígono de frecuencias acumuladas**.
La proporción de datos con valor en $(a,b)$ es
$$ \frac{P(b) - P(a)}{n}. $$
Para interpolar $P(x)$ en un intervalo $(L_i, L_{s,i})$ con acumuladas $F_{i-1}$ y
$F_i$ en sus extremos:
$$ P(x) = F_{i-1} + (F_i - F_{i-1})\,\frac{x - L_i}{L_{s,i}-L_i}. $$

**Ejemplo** (Ej 4 de la guía, 1000 llamadas): % de llamadas $>180$ s
$= 1 - P(180)/1000$, con $P(180)=(809+549)/2 = 679$ ⇒ **32.1%**.

## Moda por interpolación (del polígono de frecuencias)
Cuando los datos están agrupados, la moda se asigna primero al **intervalo modal**
(el de mayor frecuencia). Hay dos convenciones, según [[tp1-estadistica-descriptiva]] ej. 4:

1. **Convención simple (punto medio):** la moda es la **marca de clase** del
   intervalo modal, $M = (L_I + L_D)/2$.
2. **Convención por interpolación** (tiene en cuenta las frecuencias **vecinas**):
   se busca el punto $M$ del intervalo modal $[L_I, L_D]$ que reparte el "exceso"
   de frecuencia proporcionalmente respecto del intervalo de la izquierda
   (frecuencia $f_I$) y el de la derecha ($f_D$), siendo $f_M$ la frecuencia modal:
   $$ (M - L_I)\,(f_M - f_D) = (L_D - M)\,(f_M - f_I). $$
   Despejando,
   $$ M = \frac{L_D\,(f_M - f_I) + L_I\,(f_M - f_D)}{(f_M - f_I) + (f_M - f_D)}. $$

> La interpolación corre la moda hacia el intervalo vecino con **mayor** frecuencia.

## Ojo / errores comunes
- Usar la frecuencia **acumulada** $F_i$, no la absoluta $f_i$, para localizar el
  intervalo.
- $F_{i-1}$ es la acumulada hasta el **límite inferior** del intervalo elegido.
- La interpolación supone que los datos se reparten **uniformemente** dentro de
  cada intervalo (densidad constante) — es la suposición acorde a datos agrupados.

## Ejercicio resuelto — 1000 llamadas (TP1 ej. 4)
*Fuente: [[tp1-estadistica-descriptiva]] ej. 4 (resuelto).* Es el ejercicio más
completo de la unidad: combina **media/desvío agrupados, moda por interpolación,
mediana por interpolación y proporciones**.

**Enunciado.** Duración (en segundos) de 1000 llamadas telefónicas, agrupada en 10
intervalos de longitud 30 (la marca de clase es el punto medio del intervalo):

| Marca $x_i$ | 30 | 60 | 90 | 120 | 150 | 180 | 210 | 240 | 270 | 300 |
|---|---|---|---|---|---|---|---|---|---|---|
| Frec. $f_i$ | 6 | 28 | 88 | 180 | 247 | 260 | 133 | 42 | 11 | 5 |

(El primer intervalo es $(15,45]$ con marca $30$, el segundo $(45,75]$ con marca
$60$, etc.) Se pide: media, mediana, moda y desvío muestral; el % de llamadas en
los intervalos centrados en la media de semiamplitud $s, 2s, 3s$; y el % de
llamadas que superan los 3 minutos.

**1) Media y desvío (datos agrupados).** Con $n=\sum f_i = 1000$:
$$ \bar x = \frac{1}{n}\sum x_i f_i = \frac{157\,710}{1000} = 157.71 \text{ seg}, \qquad
s = \sqrt{\frac{\sum (x_i-\bar x)^2 f_i}{n-1}} \approx 45.37 \text{ seg}. $$

**2) Moda por interpolación.** El intervalo modal es el sexto, $(165,195]$, con la
frecuencia máxima $f_M = 260$; sus vecinos tienen $f_I = 247$ (izquierda) y
$f_D = 133$ (derecha). Con $L_I = 165$, $L_D = 195$:
$$ M = \frac{195\,(260-247) + 165\,(260-133)}{(260-247)+(260-133)}
= \frac{195\cdot 13 + 165\cdot 127}{13 + 127} \approx 167.79 \text{ seg}. $$
(La convención simple daría $M = 180$, el punto medio del intervalo modal.)

**3) Mediana por interpolación** sobre el polígono de frecuencias **acumuladas**.
La frecuencia acumulada $n/2 = 500$ cae en el intervalo $(135,165]$, cuyos extremos
acumulan $302$ y $549$:
$$ m_e = 135 + 30\cdot\frac{500 - 302}{549 - 302} \approx 159.05 \text{ seg}. $$

**4) Proporciones por interpolación.** Sea $P(x)$ la frecuencia acumulada
interpolada. El intervalo centrado en la media con semiamplitud $s$ es
$(\bar x - s, \bar x + s) = (112.34, 203.08)$. Interpolando:
$$ P(112.34) = 122 + (302-122)\tfrac{112.34-105}{30} \approx 166.04, $$
$$ P(203.08) = 809 + (942-809)\tfrac{203.08-195}{30} \approx 844.82, $$
de donde la proporción en $\bar x \pm s$ es $(844.82 - 166.04)/1000 \approx 0.68$
(**68%**). Análogamente se obtienen las de $\bar x \pm 2s$ y $\bar x \pm 3s$.

**5) % de llamadas $>3$ min** ($=180$ s): $1 - P(180)/1000$, con
$P(180) = (809+549)/2 = 679$, así que el porcentaje es **32.1%**.

## Ejercicio resuelto — mediana de 100 recién nacidos (TP1 ej. 5)
*Fuente: [[tp1-estadistica-descriptiva]] ej. 5 (resuelto).* Ilustra la mediana por
interpolación cuando se da directamente la tabla de marcas y frecuencias.

**Enunciado.** Se pesan 100 recién nacidos. Tabla de datos agrupados (marca en kg):

| Marca $x_i$ | 2.7 | 2.9 | 3.1 | 3.3 | 3.5 | 3.7 | 3.9 | 4.1 | 4.3 | 4.5 |
|---|---|---|---|---|---|---|---|---|---|---|
| Frec. $f_i$ | 2 | 3 | 14 | 10 | 15 | 18 | 16 | 14 | 4 | 4 |

**Cálculo.** Los datos **no** se acumulan "hasta" las marcas sino hasta los
**extremos derechos** de los intervalos de clase. La marca $3.5$ representa el
intervalo $(3.4, 3.6]$ y la marca $3.7$ el intervalo $(3.6, 3.8]$. La frecuencia
acumulada hasta $3.6$ es $2+3+14+10+15 = 44$ y hasta $3.8$ es $44+18 = 62$. Como
$n/2 = 50$ cae en $(3.6, 3.8]$, se interpola:
$$ m_e = 3.6 + \frac{50 - 44}{62 - 44}\,(3.8 - 3.6) = 3.6667 \text{ kg}. $$
(Para media y desvío de este mismo ejercicio ver [[medidas-de-tendencia-central]] y
[[medidas-de-dispersion]]: $\bar x = 3.6460$, $s = 0.4234$.)

## Ejercicio resuelto — tardanzas en el subte (clase grabada)
*Fuente: [[video-datos-agrupados#Ejercicio resuelto en clase|clase grabada de Pantazis]]*,
narrado paso a paso con la interpolación gráfica (dividir el intervalo en tantos
subintervalos como datos tiene). Mediana $=39$ y $q_1=37$ (caen exactos, sin
interpolar); percentil 15 $=35{,}29$ y percentil 30 $=37{,}4$ (sí requieren
interpolación) sobre una tabla de 11 intervalos, $n=60$.

## Relacionado
[[datos-agrupados]] · [[cuartiles-y-percentiles]] · [[histograma-y-frecuencias]] ·
[[video-datos-agrupados]]
