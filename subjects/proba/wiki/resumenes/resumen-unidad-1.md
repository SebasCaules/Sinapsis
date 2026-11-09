---
titulo: "Resumen de la Unidad 1 — Estadística Descriptiva"
tipo: resumen
unidad: 1
orden: 1
hub: true
tags: [resumen, estadistica-descriptiva, medidas-de-resumen, datos-agrupados]
resumen: "La Unidad 1 resume una muestra sin inferir sobre la población: centro (media, mediana, moda), dispersión (varianza $s^2$ con $n-1$, desvío, IQR), forma (asimetría y curtosis), histograma, boxplot con la regla de Tukey y datos agrupados por interpolación."
fuentes: ["[[estadistica-descriptiva]]", "[[poblacion-y-muestra]]", "[[medidas-de-tendencia-central]]", "[[medidas-de-dispersion]]", "[[asimetria-y-curtosis]]", "[[cuartiles-y-percentiles]]", "[[histograma-y-frecuencias]]", "[[boxplot]]", "[[datos-agrupados]]", "[[tecnica-datos-agrupados-interpolacion]]", "[[formulario-estadistica-descriptiva]]"]
actualizado: 2026-11-09
---

# Resumen de la Unidad 1 — Estadística Descriptiva

La Unidad 1 enseña a **resumir y describir** un conjunto de datos observados $\{x_i\}_{i=1}^n$ (una muestra) con unos pocos números y gráficos, **sin** todavía sacar conclusiones sobre la población. Se miden tres cosas: el **centro** (dónde están los valores), la **dispersión** (qué tan esparcidos están) y la **forma** (hacia dónde se estira la distribución y cuánto pesan sus colas), y se grafican con el **histograma** y el **boxplot**. Es la puerta de entrada de la materia: las medidas muestrales de esta unidad tienen su versión poblacional en la [[esperanza|esperanza $E[X]$]] y la [[varianza|varianza $V(X)$]] de una [[variable-aleatoria]], que se construyen a partir de la [[probabilidad|Unidad 2 (Introducción a la Probabilidad)]], y reaparecen como estimadores en la [[inferencia-estadistica|inferencia estadística]]. El mapa completo de la unidad está en [[estadistica-descriptiva|la página hub]].

> [!info] Lo esencial
> - La **media** $\bar x$ es sensible a valores atípicos; la **mediana** es **robusta** (igual que el MAD y el IQR).
> - La varianza muestral divide por $n-1$, no por $n$, y queda en unidades al cuadrado; el desvío $s=\sqrt{s^2}$ vuelve a la unidad de los datos.
> - La **asimetría** $\gamma$ dice hacia qué lado está la cola larga; la **curtosis** $\kappa$ (con el $-3$) compara el peso de las colas con la normal.
> - Los **cuartiles** parten la muestra ordenada en cuatro tramos; con ellos se arma el **boxplot** y la regla de Tukey ($1.5\cdot\text{IQR}$) para outliers.
> - Con una **tabla de frecuencias** (datos agrupados) todo es aproximado: media y desvío se ponderan con la marca de clase; mediana, cuartiles y proporciones se **interpolan** sobre la frecuencia acumulada, y la moda se busca en el intervalo de mayor frecuencia **absoluta**.
> - Antes de elegir fórmula, mirar si el enunciado da los datos uno por uno o solo una tabla: confundir las dos vías es el error más frecuente de la unidad.

## 1. Población, muestra y objetivo de la descriptiva

La **población** es el conjunto de todos los elementos cuyas características se quieren estudiar; muchas veces analizarla entera es imposible (población infinita), costoso o destructivo. La **muestra** es el subconjunto que efectivamente se observa, idealmente **representativa**, y una forma de lograrlo es elegir los elementos **al azar**. Una muestra puede ser **cualitativa** (características no numéricas, como la profesión) o **cuantitativa** (numéricas); la materia se concentra en las cuantitativas. Sobre la muestra se calculan las **medidas de resumen**, y el paso previo recomendado es un **vistazo exploratorio** (scatterplot muestra contra número de caso y dispersión de los datos sobre una recta) para detectar tendencias o atípicos.

$$ \bar x \ \text{estima}\ E[X], \qquad s \ \text{estima}\ \sigma = \sqrt{V(X)} $$

Las medidas muestrales ($\bar x$, $s$) son la contraparte observada de los parámetros poblacionales de una variable aleatoria $X$; ese salto de la muestra a la población es el objeto de la inferencia, no de esta unidad.

Cómo reconocerlo: si el enunciado da datos observados y pide «describir», «resumir» o «comparar» muestras, sin hablar de confianza ni de hipótesis, se está en estadística descriptiva.

Detalle: [[poblacion-y-muestra|Población y muestra]] y [[estadistica-descriptiva|Estadística Descriptiva (hub)]].

## 2. Medidas de tendencia central: media, mediana y moda

Responden «dónde se ubica el centro de los datos». La **media muestral** es el punto que equilibra los datos sobre la recta; los valores más alejados son los más influyentes, por eso es **sensible a outliers**. La **mediana** deja el 50 % de los datos a cada lado y se calcula sobre la muestra ordenada $\tilde x_1 \le \dots \le \tilde x_n$; es el segundo cuartil $q_2$ y es **robusta**. La **moda** es el valor más frecuente; puede haber varias (distribución **multimodal**) y sirve también para datos cualitativos.

$$ \bar{x} = \frac{1}{n}\sum_{i=1}^n x_i $$

Promedio de las $n$ observaciones. Control rápido: siempre debe caer en $[\min_i x_i,\ \max_i x_i]$; si no, hay un error de cuenta.

$$ m = \tilde x_{(n+1)/2}\ \ (n \text{ impar}), \qquad m = \frac{\tilde x_{n/2} + \tilde x_{n/2+1}}{2}\ \ (n \text{ par}) $$

Con $n$ impar es la observación central; con $n$ par ninguna observación parte a la mitad y se promedian las dos centrales.

Ejemplo de robustez: con alturas $\{150,160,170,180,190\}$ se tiene $\bar x = m = 170$; si un dato se registra mal como $290$, la mediana sigue en $170$ pero la media sube a $190$. Con ingresos $\{1,1,2,100\}$ la media es $104/4 = 26$ y la mediana $1.5$.

> [!warn] Discrepancia: media del ejemplo de ingresos
> La teórica [[estadistica-descriptiva-general]] reporta $\bar x \approx 20.8$ para $\{1,1,2,100\}$. El wiki lo marca como error: sale de dividir $104$ por $5$ en lugar de por $n=4$. El valor correcto es $26$.

Cómo reconocerlo: si hay valores extremos sospechosos (sueldos, precios, un dato mal medido) y se pide una medida de centro que no se mueva, corresponde la mediana. Para la moda con datos agrupados hay dos convenciones (punto medio o interpolación), que se ven en la sección 9.

> [!warn] Intervalo modal y media no tienen por qué coincidir
> Error marcado en clase: pensar que el intervalo de mayor frecuencia debe contener a la media. En el ejemplo de la clase la media es $\bar x = 40$ y el intervalo modal es $[37,39)$, que no la contiene.

> [!figura] u1-paridad-de-n-y-la-mediana
> Con $n$ impar la posición $(n+1)/2$ deja la misma cantidad de datos a cada lado; con $n$ par ninguna posición lo consigue —queda 29 contra 30 o 30 contra 29— y por eso se promedian las dos centrales.

> [!figura] u1-balanza-media-contra-mediana
> La media es el punto donde se equilibran los brazos de palanca, de modo que un solo dato lejano la arrastra; la mediana solo cuenta cuántos datos quedan a cada lado y no se mueve.

Detalle: [[medidas-de-tendencia-central|Medidas de tendencia central]].

## 3. Medidas de dispersión

Cuantifican qué tan esparcidos están los datos alrededor del centro: dos muestras con la misma media pueden ser muy distintas. El **rango** usa solo los dos extremos y es muy sensible a outliers. El **rango intercuartil** (IQR) mide el ancho del 50 % central y es robusto. La **varianza muestral** promedia los desvíos al cuadrado respecto de $\bar x$ (el cuadrado evita que los desvíos positivos y negativos se cancelen y penaliza más a los datos lejanos). El **desvío estándar** es la medida más usada y sirve sobre todo para **comparar** muestras con media similar. Hay además dos medidas basadas en valores absolutos: la **media del desvío absoluto** $w$ y el **MAD**, este último robusto.

$$ s^2 = \frac{1}{n-1}\sum_{i=1}^n (x_i - \bar{x})^2, \qquad s = \sqrt{s^2} $$

$s^2$ queda en unidades al cuadrado; $s$ vuelve a la unidad de los datos. Se divide por $n-1$ porque $\bar x$ sale de los mismos datos y las distancias a $\bar x$ quedan algo pequeñas; $n-1$ corrige ese sesgo.

$$ R = \max_i x_i - \min_i x_i, \qquad \text{IQR} = q_3 - q_1 $$

El TP1 escribe el rango con valor absoluto, $|\max - \min|$, que es lo mismo porque $\max \ge \min$.

$$ w = \frac{1}{n}\sum_{i=1}^n \lvert x_i - \bar{x}\rvert, \qquad \text{MAD} = \text{mediana}\{\lvert x_i - \bar{x}\rvert\} $$

$w$ es más «natural» que la varianza pero analíticamente más incómoda ($\lvert x\rvert$ no es derivable en $0$); el MAD es la versión robusta.

Ejemplo: subte y colectivo con $n=61$ y medias casi idénticas ($\approx 40$ min) tienen desvíos muy distintos, lo que muestra que la media sola resume demasiado.

> [!warn] Discrepancia: desvíos del ejemplo subte y colectivo
> La clase grabada [[video-medidas-de-resumen]] da $s=4.313204$ (subte) y $s=7.240922$ (colectivo); la teórica [[estadistica-descriptiva-general]] da $4.792449$ y $7.188674$. Son corridas de datos distintas; la conclusión (el colectivo es más disperso) no cambia.

Cómo reconocerlo: si se pide «qué tan variable» o se comparan dos muestras de media parecida, se calcula $s$; si hay atípicos y se quiere robustez, IQR o MAD en lugar de desvío y rango.

> [!figura] u1-bandas-x-ks-sobre-el-histograma
> Qué porcentaje de datos cae realmente dentro de $\bar x \pm k\,s$. Con el conjunto aproximadamente normal se recuperan las referencias 68 / 95 / 99 %; con el asimétrico esa regla práctica deja de valer.

Detalle: [[medidas-de-dispersion|Medidas de dispersión]].

## 4. Forma: asimetría y curtosis

Después del centro y la dispersión, dos coeficientes **adimensionales** describen la forma. La **asimetría** $\gamma$ usa el cubo de los desvíos, que conserva el signo: una cola larga a la derecha aporta términos positivos grandes y da $\gamma>0$. La **curtosis** $\kappa$ usa la cuarta potencia y mide el **peso de las colas**; el $-3$ toma como referencia la distribución normal, que queda en $\kappa = 0$.

$$ \gamma = \frac{\sum_{i=1}^n (x_i - \bar{x})^3}{n\, s^3} $$

$\gamma \approx 0$: simétrica; $\gamma > 0$: asimétrica a derecha (cola larga a la derecha); $\gamma < 0$: asimétrica a izquierda. La cola arrastra la media hacia su lado: si $\bar x >$ mediana, sospechar $\gamma > 0$.

$$ \kappa = \frac{\sum_{i=1}^n (x_i - \bar{x})^4}{n\, s^4} - 3 $$

$\kappa \approx 0$: **mesocúrtica** (como la [[distribucion-normal|normal]]); $\kappa < 0$: **platicúrtica**, colas más livianas (la uniforme da $\kappa = -1.2$); $\kappa > 0$: **leptocúrtica**, colas más pesadas y mayor concentración en torno a la media (Laplace da $\kappa = 3$).

> [!warn] Discrepancia: signo de la curtosis en la teórica
> La teórica [[estadistica-descriptiva-general]] dice lo contrario ($\kappa<0$ con colas más pesadas). El wiki lo considera una errata: la guía [[tp1-estadistica-descriptiva]] dice «positivo si es alta la concentración» y la propia fórmula da $+3$ para Laplace (colas pesadas). En el parcial, usar la convención de arriba.

Las slides introductorias presentan también una **versión corregida** de ambos coeficientes, que evita un sesgo de estimación (en la curtosis, válida solo para variables normales); sobre las 200 monedas el cambio es pequeño ($\gamma$: $0.13174 \to 0.13274$; $\kappa$: $-0.10237 \to -0.04442$). La forma se ve mejor en el gráfico que en el número: en el ejemplo de transporte, taxi $\gamma = 1.898$ (cola a derecha), tren $\gamma = -1.505$ (cola a izquierda), moto $\kappa = 2.563$ (colas pesadas) y bicicleta $\kappa = -1.320$ (colas livianas).

Cómo reconocerlo: si dos muestras coinciden en media y desvío y se pregunta qué las distingue, la respuesta está en $\gamma$ o $\kappa$.

> [!figura] u1-tres-formas-y-el-orden-media-mediana
> Los tres casos de la teórica en la misma escala, con la media y la mediana superpuestas: la cola larga arrastra la media hacia su lado, de modo que $\bar x >$ mediana cuando $\gamma > 0$ y al revés cuando $\gamma < 0$.

> [!figura] u1-peso-de-colas-a-igual-media-y-desvio
> Tres densidades con la **misma media y el mismo desvío**: lo único que las distingue es el peso de las colas. El detalle logarítmico muestra que la de Laplace ($\kappa=3$) se apaga mucho más lento que la normal, mientras que la uniforme ($\kappa=-1.2$) directamente se corta.

Detalle: [[asimetria-y-curtosis|Asimetría y curtosis]].

## 5. Cuartiles y percentiles

Así como la mediana parte la muestra ordenada en dos, los **cuartiles** la parten en cuatro: $q_1$ deja el **25 %** a su izquierda, $q_2$ es la mediana y $q_3$ deja el **75 %**. Los **deciles** la parten en 10 y los **percentiles** en 100. Son medidas de **posición** que no se ven afectadas por valores extremos y son la base del IQR y del boxplot. Hay ambigüedad entre libros y programas sobre cómo tomar el «compromiso» cuando no se acumula exactamente la cantidad pedida; las diferencias son insignificantes en muestras grandes.

$$ q_j \in [\tilde x_k,\, \tilde x_{k+1}] \quad \text{con} \quad \frac{k}{n} \le j\cdot 0.25 < \frac{k+1}{n} $$

Definición formal del $j$-ésimo cuartil sobre la muestra ordenada.

$$ h = p\,n; \qquad \text{percentil}_p = \frac{\tilde x_h + \tilde x_{h+1}}{2}\ \ (h \text{ entero}), \qquad \text{percentil}_p = \tilde x_k + f\,(\tilde x_{k+1} - \tilde x_k)\ \ (h \text{ no entero}) $$

Criterio de interpolación lineal de [[video-percentilos]], con $p\in(0,1)$, $k = \lfloor h \rfloor$ y $f = h - k$. Ejemplos con $n = 60$: $q_1$ tiene $h = 15$ (entero), así que $q_1 = (\tilde x_{15}+\tilde x_{16})/2$; el percentil 97 tiene $h = 58.2$, así que $p_{97} = \tilde x_{58} + 0.2\,(\tilde x_{59}-\tilde x_{58})$.

> [!warn] El caso «$h$ entero» se trata aparte
> No es el límite $f \to 0$ de la rama de interpolación: da un promedio de dos estadísticos de orden, no $\tilde x_k$.

> [!warn] Discrepancia: percentil 50 con $n$ impar
> Con $p = 0.5$ y $n = 61$ la fórmula daría $h = 30.5$ y un promedio, pero la definición de mediana da $\tilde x_{31}$. **Prevalece la definición de mediana**; la fórmula de percentiles es una convención entre varias posibles.

Cómo reconocerlo: «el valor que deja por debajo al 25 % / 90 % de los datos» o «en qué percentil está tal valor».

Detalle: [[cuartiles-y-percentiles|Cuartiles y percentiles]].

## 6. Histograma y frecuencias

Para ver cómo se reparten los datos se divide el rango en **intervalos** (*bins*) $a_1 < \dots < a_{N+1}$, habitualmente de igual longitud, y se cuenta cuántos datos caen en cada uno. El **histograma** es el gráfico de barras de las frecuencias (barras **contiguas**, porque la variable es continua); el **polígono de frecuencias** une los puntos medios de las barras. Es la versión muestral de una densidad.

$$ n_k = \lvert\{x_i : x_i \in (a_k, a_{k+1}]\}\rvert, \qquad f_k = \frac{n_k}{n}, \qquad \sum_{k=1}^N n_k = n,\ \ \sum_{k=1}^N f_k = 1 $$

$n_k$ es la frecuencia absoluta del intervalo $k$ y $f_k$ la relativa. Atención: en las secciones 8 y 9 (datos agrupados) la letra $f_i$ designa la frecuencia **absoluta**, con $n=\sum f_i$; no confundirla con esta $f_k$ relativa.

$$ F(\alpha) = \frac{\lvert\{x_i : x_i \le \alpha\}\rvert}{n} \in [0,1] $$

Frecuencia relativa acumulada: una escalera creciente, contraparte muestral de la [[funcion-de-distribucion-acumulada|función de distribución acumulada]]. No depende del ancho de los intervalos, por eso sobre ella se leen mediana, cuartiles y proporciones.

Elegir el ancho de los bins no tiene fórmula cerrada: muy anchos esconden la forma, muy finos la vuelven ruido; la clase sugiere empezar con **15 a 20 intervalos** y ajustar mirando el gráfico.

Cómo reconocerlo: «construir el histograma», «tabla de frecuencias», «frecuencia acumulada» o leer la moda de datos continuos (punto medio del intervalo de mayor frecuencia).

> [!figura] u1-el-ancho-de-bin-cambia-la-historia
> El mismo conjunto de datos con distinta cantidad de intervalos: con pocos aparece una sola joroba y con muchos queda ruido. La acumulada de abajo no cambia, y es por eso que los cuartiles se leen sobre ella.

Detalle: [[histograma-y-frecuencias|Histograma y frecuencias]].

## 7. Boxplot y outliers

El **boxplot** resume la muestra con cinco números: la **caja** va de $q_1$ a $q_3$ (el 50 % central), una línea marca la **mediana** y los **bigotes** llegan hasta el mínimo y el máximo «normales»; los datos fuera de los límites se dibujan como puntos sueltos (**outliers**). La distancia desigual de $q_1$ y $q_3$ a la mediana revela asimetría.

$$ L_W = q_1 - 1.5\cdot\text{IQR}, \qquad U_W = q_3 + 1.5\cdot\text{IQR} $$

Regla de Tukey: todo dato fuera de $[L_W, U_W]$ es outlier. El factor $1.5$ es una convención; como el IQR usa solo el 50 % central, un outlier no agranda la regla que lo detecta.

> [!warn] Los bigotes no llegan a $L_W$ y $U_W$
> Error marcado en clase: el bigote se corta en el **dato real** más extremo que sigue dentro de $[L_W, U_W]$. «El boxplot se termina donde se terminan los datos».

Para comparar grupos, los boxplots van **en paralelo, en el mismo gráfico y con la misma escala**; un grupo con pocas observaciones produce una caja igual de «sólida» pero sus cuartiles son mucho menos confiables.

Cómo reconocerlo: «detectar valores atípicos», «dibujar el diagrama de caja» o comparar visualmente varias muestras.

> [!figura] u1-bigotes-vs-limites-de-tukey
> El bigote superior se detiene en el **dato real** más grande que sigue por debajo de $U_W$. Al llevar el punto móvil por encima de la valla, el bigote salta hacia atrás en lugar de estirarse hasta $U_W$.

Detalle: [[boxplot|Boxplot (diagrama de caja)]].

## 8. Datos agrupados: fórmulas ponderadas

A veces los datos vienen solo como **tabla de frecuencias** por intervalos $[L_i, L_{s,i})$: se sabe cuántos datos cayeron en cada intervalo ($f_i$, frecuencia **absoluta**), pero se perdió el valor exacto de cada uno, así que **todo es aproximado**. Cada intervalo se representa con su **marca de clase**, suponiendo que los datos se reparten **uniformemente** dentro de él; cuanto más anchos los intervalos, mayor el error respecto del cálculo con los datos crudos.

> [!nota] Cierre de los intervalos
> Las fuentes usan dos convenciones: $[L_i, L_{s,i})$, cerrado a izquierda, en la teórica de datos agrupados, y $(a_k, a_{k+1}]$, cerrado a derecha, en el histograma y en el TP1 (ej. 4 y 5). Con datos continuos no cambia nada; con datos discretos o con valores justo en un límite, conviene fijar cuál usa el enunciado antes de contar.

$$ x_i = \frac{L_i + L_{s,i}}{2} $$

Marca de clase: punto medio del intervalo $i$; reemplaza a cada dato de ese intervalo. Desde aquí $x_i$ denota la marca de clase, no un dato individual.

$$ \bar x_{Ag} = \frac{\sum_{i=1}^L x_i\, f_i}{n}, \qquad s_{Ag} = \sqrt{\frac{\sum_{i=1}^L (x_i - \bar{x}_{Ag})^2\, f_i}{n-1}} $$

Con $n = \sum f_i$ y $L$ el número de intervalos; las $f_i$ son absolutas (con frecuencias relativas no se divide por $n$). Asimetría y curtosis agrupadas son análogas: se agrega $f_i$ a las sumas y se usan $\bar x_{Ag}$ y $s_{Ag}$.

> [!warn] Los percentiles no son «paralelos»
> Advertencia del docente: media, desvío, asimetría y curtosis agrupados son las fórmulas de siempre con $f_i$ en la suma. Mediana, cuartiles y percentiles **no**: se basan en **acumular** ($F_i$), no en sumar, y se obtienen por interpolación (sección 9).

Ejemplo (TP1 ej. 5, 100 recién nacidos, marcas de $2.7$ a $4.5$ kg): $\bar x_{Ag} = 364.60/100 = 3.6460$ kg y $s_{Ag} = \sqrt{17.7484/99} = 0.4234$ kg.

Cómo reconocerlo: el enunciado da una tabla de intervalos (o marcas) con frecuencias en lugar de la lista de datos.

> [!figura] u1-los-f-i-subintervalos-del-reparto
> De dónde sale la fórmula: el intervalo se parte en $f_i$ subintervalos iguales, uno por dato, y el cuartil cae donde termina el subintervalo del dato buscado. En el dibujo, los $f_i = 18$ datos del intervalo $[36, 39)$ se reparten parejo en 18 subintervalos iguales, y por eso cada tabique adelanta el acumulado en una unidad. El supuesto de reparto uniforme es lo que vuelve **aproximado** el resultado.

Detalle: [[datos-agrupados|Datos agrupados]].

## 9. Interpolación en datos agrupados (técnica de parcial)

Receta para sacar **mediana, cuartiles y proporciones** de una tabla agrupada: se calcula la **frecuencia acumulada** $F_i$ (datos acumulados hasta el extremo derecho $L_{s,i}$ del intervalo $i$), se localiza el intervalo donde la acumulada cruza la cantidad buscada y se **interpola linealmente** dentro de él. Es una regla de tres: dentro del intervalo se avanza una fracción del ancho igual a la fracción de frecuencia que falta acumular.

$$ q_{j,Ag} = L_i + \frac{j\cdot 0.25\cdot n - F_{i-1}}{f_i}\,(L_{s,i} - L_i) $$

$F_{i-1}$ es la acumulada hasta el límite inferior del intervalo elegido y $f_i$ su frecuencia; para la mediana, $j = 2$ (se busca $n/2$). Ejemplo de la teórica: $q_1$ con $n = 60$ en $[36,39)$, $F_{i-1} = 12$, $f_i = 18$: $q_1 = 36 + \tfrac{15-12}{18}\cdot 3 = 36.5$.

$$ P(x) = F_{i-1} + (F_i - F_{i-1})\,\frac{x - L_i}{L_{s,i}-L_i}, \qquad \text{proporción en } (a,b) = \frac{P(b) - P(a)}{n} $$

$P$ es el polígono de frecuencias acumuladas interpolado; sirve para «qué porcentaje de los datos cae entre $a$ y $b$».

$$ M = \frac{L_D\,(f_M - f_I) + L_I\,(f_M - f_D)}{(f_M - f_I) + (f_M - f_D)} $$

La **moda** sigue otra receta: el intervalo modal no se localiza con la acumulada sino con la frecuencia **absoluta** máxima $f_M$, y la fórmula usa solo frecuencias absolutas. Moda por interpolación en el intervalo modal $[L_I, L_D]$ de frecuencia $f_M$, con vecinos $f_I$ (izquierda) y $f_D$ (derecha); sale de $(M - L_I)(f_M - f_D) = (L_D - M)(f_M - f_I)$ y corre la moda hacia el vecino más frecuente.

> [!warn] Dos convenciones para la moda agrupada
> Según [[tp1-estadistica-descriptiva]] ej. 4, la moda puede tomarse como el **punto medio** del intervalo modal, $M = (L_I + L_D)/2$, o por la **interpolación** de arriba. En ese ejercicio dan $180$ y $167.79$ s respectivamente: conviene aclarar cuál se usa.

> [!warn] Errores comunes
> Para mediana, cuartiles y percentiles, localizar el intervalo con la frecuencia **acumulada** $F_i$, no con la absoluta $f_i$ (la moda es la excepción: intervalo de $f_i$ máxima). Acumular hasta los **extremos derechos** de los intervalos, no hasta las marcas de clase (en el TP1 ej. 5 la marca $3.7$ representa $(3.6, 3.8]$).

Cómo reconocerlo: tabla de frecuencias más un pedido de mediana, cuartil, percentil, moda o «porcentaje de datos mayores que / entre».

> [!figura] u1-lectura-del-cuartil-sobre-la-ojiva
> La fórmula leída como geometría: la horizontal en $j\cdot 0.25\cdot n$ corta el segmento del intervalo donde cae el cruce y la vertical baja hasta el cuartil. Observe que el cociente $(j\cdot 0.25\, n - F_{i-1})/f_i$ es la fracción del ancho del intervalo que se avanza.

Detalle: [[tecnica-datos-agrupados-interpolacion|Técnica: interpolación en datos agrupados]].

## Cómo aparece en los parciales

Los ejercicios resueltos de la unidad (TP1, ejemplos de clase y los parciales reales de [[ejercicios-de-parcial-resueltos-estadistica|Ejercicios de parcial resueltos]]) siguen estos patrones:

- **Tabla agrupada completa** (TP1 ej. 4, 1000 llamadas en intervalos de 30 s): media $\bar x = 157.71$ s y desvío $s \approx 45.37$ s ponderados; moda por interpolación $M \approx 167.79$ s (contra $180$ por punto medio); mediana por interpolación $m_e = 135 + 30\cdot\frac{500-302}{549-302} \approx 159.05$ s; proporción en $\bar x \pm s$ interpolando la acumulada en $112.34$ y $203.08$, que da $\approx 68\,\%$ (y análogamente $\bar x \pm 2s$, $\bar x \pm 3s$); se comparan con las referencias $68/95/99.7\,\%$ de datos aproximadamente normales, regla que deja de valer si la distribución es asimétrica; porcentaje mayor a 3 min como $1 - P(180)/1000$ con $P(180) = (809+549)/2 = 679$, es decir $32.1\,\%$.
- **Media, desvío y mediana de una tabla de marcas** (TP1 ej. 5, 100 recién nacidos): $\bar x = 3.6460$ kg, $s = 0.4234$ kg y $m_e = 3.6 + \frac{50-44}{62-44}(0.2) = 3.6667$ kg, acumulando hasta los extremos derechos. El mismo cálculo de mediana aparece en un primer parcial (ej. 1).
- **Mediana agrupada con un parámetro** (Parcialito TP1 y 2, ej. 1): intervalos $[20,30), [30,40), [40,50), [50,60)$ con frecuencias $5, 15, k, 10$ y $k \ge 35$; $n = 30+k$, $n/2 = 15 + k/2$ cae en $[40,50)$ y $m_e = 40 + \frac{(15+k/2)-20}{k}\cdot 10 = 45 - \frac{50}{k}$.
- **Mediana, cuartiles y percentiles agrupados** (clase grabada, tardanzas en el subte, $n = 60$, 11 intervalos): mediana $39$ y $q_1 = 37$ caen exactos; percentil 15 $= 35.29$ y percentil 30 $= 37.4$ requieren interpolación.
- **Percentiles de datos sin agrupar** con $h = p\,n$: distinguir $h$ entero (promedio de dos órdenes) de $h$ no entero (interpolación), y usar la definición de mediana si $p = 0.5$ con $n$ impar.
- **Elegir la medida adecuada y justificar**: media contra mediana ante outliers (ejemplos de alturas y de ingresos $\{1,1,2,100\}$); comparar muestras de media parecida por su desvío (subte contra colectivo); distinguir muestras por $\gamma$ y $\kappa$ (taxi, tren, moto, bicicleta).
- **Boxplot y outliers** (Final 15/12/2025, ej. 1b, 12 datos discretos $1,1,2,2,2,3,3,4,4,4,5,8$): $q_1 = 2$, $m_e = 3$, $q_3 = 4$, $\text{IQR} = 2$; la cerca superior es $4 + 1.5\cdot 2 = 7$, así que $8$ es outlier y el bigote superior se corta en el último dato real dentro de la cerca ($5$).
- La media y el desvío agrupados reaparecen más adelante como insumo de un intervalo de confianza para la media (ver [[intervalos-de-confianza]]).

## Tabla de fórmulas de la unidad

| Qué | Fórmula | Cuándo se usa |
|---|---|---|
| Media muestral | $\bar x = \frac{1}{n}\sum x_i$ | Centro con datos individuales; sensible a outliers |
| Mediana | $\tilde x_{(n+1)/2}$ ($n$ impar); $\frac{\tilde x_{n/2}+\tilde x_{n/2+1}}{2}$ ($n$ par) | Centro robusto |
| Moda | valor de frecuencia máxima | Valor más repetido; sirve también para datos cualitativos; puede ser multimodal |
| Rango | $R = \max_i x_i - \min_i x_i$ | Dispersión rápida; muy sensible a outliers |
| Rango intercuartil | $\text{IQR} = q_3 - q_1$ | Dispersión robusta; base de Tukey |
| Varianza muestral | $s^2 = \frac{1}{n-1}\sum (x_i-\bar x)^2$ | Dispersión; unidades al cuadrado |
| Desvío estándar | $s = \sqrt{s^2}$ | Dispersión en la unidad de los datos; comparar muestras |
| Desvío absoluto medio | $w = \frac{1}{n}\sum \lvert x_i - \bar x\rvert$ | Alternativa a $s$ con valor absoluto |
| MAD | $\text{mediana}\{\lvert x_i - \bar x\rvert\}$ | Dispersión robusta |
| Asimetría | $\gamma = \frac{\sum (x_i-\bar x)^3}{n s^3}$ | Signo: lado de la cola larga |
| Curtosis (exceso) | $\kappa = \frac{\sum (x_i-\bar x)^4}{n s^4} - 3$ | Peso de colas frente a la normal ($\kappa = 0$) |
| Cuartil (definición) | $q_j \in [\tilde x_k, \tilde x_{k+1}]$, $\frac{k}{n} \le 0.25\,j < \frac{k+1}{n}$ | Datos individuales ordenados |
| Percentil | $h = pn$; $\frac{\tilde x_h+\tilde x_{h+1}}{2}$ o $\tilde x_k + f(\tilde x_{k+1}-\tilde x_k)$ | Datos individuales; $h$ entero o no |
| Frecuencias | $n_k$, $f_k = n_k/n$, $\sum f_k = 1$ | Histograma ($f_k$ relativa) |
| Acumulada relativa | $F(\alpha) = \lvert\{x_i \le \alpha\}\rvert / n$ | Leer cuartiles y proporciones |
| Cercas de Tukey | $q_1 - 1.5\,\text{IQR}$, $q_3 + 1.5\,\text{IQR}$ | Outliers y bigotes del boxplot |
| Marca de clase | $x_i = (L_i + L_{s,i})/2$ | Representante de cada intervalo |
| Media agrupada | $\bar x_{Ag} = \frac{\sum x_i f_i}{n}$ | Tabla de frecuencias ($f_i$ absoluta, $n = \sum f_i$) |
| Desvío agrupado | $s_{Ag} = \sqrt{\frac{\sum (x_i - \bar x_{Ag})^2 f_i}{n-1}}$ | Tabla de frecuencias |
| Asimetría y curtosis agrupadas | $\gamma_{Ag} = \frac{\sum (x_i-\bar x_{Ag})^3 f_i}{n s_{Ag}^3}$, $\kappa_{Ag} = \frac{\sum (x_i-\bar x_{Ag})^4 f_i}{n s_{Ag}^4} - 3$ | Tabla de frecuencias |
| Cuartil agrupado | $q_{j,Ag} = L_i + \frac{0.25\,j\,n - F_{i-1}}{f_i}(L_{s,i}-L_i)$ | Mediana ($j=2$) y cuartiles de una tabla |
| Acumulada interpolada | $P(x) = F_{i-1} + (F_i - F_{i-1})\frac{x-L_i}{L_{s,i}-L_i}$ | Proporción en $(a,b)$: $\frac{P(b)-P(a)}{n}$ |
| Moda agrupada | $M = \frac{L_D(f_M-f_I) + L_I(f_M-f_D)}{(f_M-f_I)+(f_M-f_D)}$ o $M = \frac{L_I+L_D}{2}$ | Interpolación o punto medio del intervalo modal |

Todas las fórmulas, ordenadas por tema, están en el [[formulario-estadistica-descriptiva|Formulario — Estadística Descriptiva]].
