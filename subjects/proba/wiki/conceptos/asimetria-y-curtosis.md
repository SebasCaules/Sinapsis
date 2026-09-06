---
titulo: Asimetría y curtosis (parámetros de forma)
resumen: 'Dos coeficientes adimensionales de forma: la asimetría $\gamma=\frac{\sum(x_i-\bar x)^3}{n s^3}$ indica hacia qué lado se estira la distribución y la curtosis $\kappa=\frac{\sum(x_i-\bar x)^4}{n s^4}-3$ mide el peso de las colas frente a la normal.'
tipo: concepto
unidad: 1
orden: 5
tags: [estadistica-descriptiva, asimetria, curtosis, forma]
fuentes: ["[[estadistica-descriptiva-general]]", "[[tp1-estadistica-descriptiva]]", "[[estadistica-descriptiva-introduccion]]", "[[video-histogramas]]", "[[video-medidas-de-resumen]]"]
actualizado: 2026-09-04
---

# Asimetría y curtosis (parámetros de forma)

**En breve.** Después del centro ([[medidas-de-tendencia-central|tendencia central]])
y la [[medidas-de-dispersion|dispersión]], estos dos coeficientes adimensionales
describen la **forma**: la **asimetría** dice hacia qué lado se estira la distribución
y la **curtosis** cuánto pesan sus colas comparada con la [[distribucion-normal|normal]].

Describen la **forma** de la distribución de los datos, más allá del centro y la
dispersión. Ambas son **adimensionales** (no dependen de la unidad).

## Coeficiente de asimetría (simetría)
$$ \gamma = \frac{\sum_{i=1}^n (x_i - \bar{x})^3}{n\, s^3} $$
($s$ = [[medidas-de-dispersion|desvío estándar]].) Interpretación:
- $\gamma \approx 0$ → distribución **simétrica** respecto de la
  [[medidas-de-tendencia-central|media]].
- $\gamma > 0$ → **asimétrica a derecha** (cola larga a la derecha).
- $\gamma < 0$ → **asimétrica a izquierda**.
- Cuanto más lejos de 0, más asimétrica.

> [!figura] u1-tres-formas-y-el-orden-media-mediana
> Los tres casos de la teórica en la misma escala, con la media y la mediana superpuestas: la cola larga arrastra la media hacia su lado, de modo que $\bar x >$ mediana cuando $\gamma > 0$ y al revés cuando $\gamma < 0$.

> **Intuición.** El cubo $(x_i-\bar x)^3$ **conserva el signo** del desvío: una cola
> larga a la derecha mete unos pocos términos positivos muy grandes que no se
> compensan, y la suma da $\gamma>0$. Es la misma cola que separa la media de la
> mediana, así que un truco de parcial es: si $\bar x > $ mediana, sospechar $\gamma>0$
> (cola a derecha).

## Coeficiente de curtosis (kurtosis)
$$ \kappa = \frac{\sum_{i=1}^n (x_i - \bar{x})^4}{n\, s^4} - 3 $$
Mide cuánto **peso** tienen las colas (qué tanto se concentran los datos lejos de
la media). El $-3$ usa como referencia la [[distribucion-normal|distribución normal]]:
- $\kappa \approx 0$ → colas similares a la normal (**mesocúrtica**).
- $\kappa < 0$ → colas **más livianas** que la normal, distribución más achatada
  (**platicúrtica**; p. ej. la [[distribucion-uniforme-continua|uniforme]], $\kappa=-1.2$).
- $\kappa > 0$ → colas **más pesadas** y mayor concentración en torno a la media
  (**leptocúrtica**; p. ej. la [[distribucion-t-de-student|t de Student]]).

> [!figura] u1-peso-de-colas-a-igual-media-y-desvio
> Tres densidades con la **misma media y el mismo desvío**: lo único que las distingue es el peso de las colas. El detalle logarítmico muestra que la de Laplace ($\kappa=3$) se apaga mucho más lento que la normal, mientras que la uniforme ($\kappa=-1.2$) directamente se corta.

> ✅ **Discrepancia resuelta (2026-08-13).** La teórica
> [[estadistica-descriptiva-general]] enuncia lo contrario (dice que $\kappa<0$ ⇒ "el
> peso de las colas es **mayor**" y $\kappa>0$ ⇒ "**menor**"). Esos dos bullets son una
> **errata del apunte**, no otra convención, por dos razones independientes:
> 1. **La guía de la cátedra dice lo contrario.** [[tp1-estadistica-descriptiva]]
>    (ec. 7) define la misma $\kappa$ y aclara: *"se refiere a la concentración en
>    torno a la media (**positivo si es alta la concentración**)"*.
> 2. **La fórmula misma lo decide.** Evaluando la $\kappa$ del apunte sobre
>    distribuciones conocidas: uniforme (colas livianas) $\to -1.2$; normal $\to 0$;
>    Laplace (colas pesadas) $\to +3$. Con esa fórmula, colas pesadas $\Rightarrow$
>    $\kappa>0$, necesariamente.
>
> **En el parcial:** Usar la convención estándar de arriba, que es además la de la guía
> y la que usan las resoluciones del curso. Si un enunciado cita textual el bullet de la
> teórica, aclarar el signo al responder.

## Versión con corrección por muestra pequeña
Las slides introductorias ([[estadistica-descriptiva-introduccion]], slides 11-12)
presentan además una **versión corregida** de la asimetría y la curtosis. Esta
corrección **evita un sesgo en la estimación** del parámetro (se retoma al estudiar
[[estimacion-puntual|estimadores]] en U8); en el caso de la **curtosis**, la
corrección sirve solo para variables normales. Sobre el dataset de las 200 monedas
el efecto es pequeño: $\gamma$ pasa de $0.13174$ a $0.13274$ y $\kappa$ de
$-0.10237$ a $-0.04442$.

## Visualización
Se observan mejor **gráficamente** (forma de [[histograma-y-frecuencias|histograma]]
o [[boxplot]]) que por su valor numérico. [[video-histogramas]] lo ilustra con cuatro
histogramas de duración de viajes: **taxi** (asimetría hacia valores altos) vs. **tren**
(asimetría hacia valores bajos), y **bicicleta** (colas livianas, sin outliers visibles)
vs. **moto** (colas pesadas, con outliers claramente separados del resto).

## Ejercicios resueltos
[[video-medidas-de-resumen]] retoma el mismo conjunto de medios de transporte y da los
valores numéricos de $\gamma$ y $\kappa$, agregando **subte** como caso casi simétrico de
referencia (dos comparaciones con misma media y desvío entre sí, para aislar el efecto de
la forma):
- **Asimetría** [21:57]: taxi $\gamma=1.89803$ (asimétrica a derecha) vs. tren
  $\gamma=-1.504807$ (asimétrica a izquierda) vs. subte $\gamma=0.3057749$
  (aproximadamente simétrica).
- **Curtosis** [25:53]: moto $\kappa=2.563028$ (leptocúrtica) vs. bicicleta
  $\kappa=-1.32002$ (platicúrtica) vs. subte $\kappa=-0.1125623$ (cercana a mesocúrtica).

Sirve para mostrar que dos conjuntos pueden coincidir en media y desvío mientras la
asimetría o la curtosis los distingue.

## Con datos agrupados
Mismas fórmulas incorporando la frecuencia $f_i$ y la marca de clase: ver
[[datos-agrupados]].
