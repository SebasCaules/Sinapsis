---
titulo: "Video — Mezcla"
resumen: "Clase en video de Lucio Pantazis (unidad 5) sobre variables de mezcla: la acumulada y la densidad como combinación convexa de las de cada escenario, la esperanza por linealidad y por qué la varianza no se mezcla de forma lineal."
tipo: fuente
formato: video
unidad: 5
url: "https://youtu.be/01vNiwYEhb4"
duracion: "22:21"
docente: Lucio Pantazis
ingerido: 2026-09-03
---

# Video — Mezcla

**Qué es:** clase en video (slides Beamer) sobre variables de mezcla, con un ejemplo completo de una v.a. continua condicionada a una partición de tres escenarios.
**Cubre:** mezcla de distribuciones (FDA, densidad, esperanza y varianza), por qué la varianza no se mezcla linealmente, y la mezcla como caso particular de vínculo entre variables.
**Guía asociada:** Guía 5

## Recorrido de la clase

| Timestamp | Tema |
|---|---|
| [00:04] | Introducción: qué es una variable de mezcla; se presenta como último "vínculo entre variables" de la unidad |
| [00:40] | Planteo del ejemplo: gastos $G$ de Federico, con comportamiento distinto en 3 escenarios |
| [02:00] | Partición $\{S,H,R\}$ (sueño / hambre / resto) con $P(S)=0.4$, $P(H)=0.35$, $P(R)=0.25$; analogía con una función partida de análisis |
| [04:21] | Por qué arrancar por la acumulada $F_G(t)$ al no conocer la distribución de $G$ |
| [05:14] | Se aplica probabilidad total sobre $F_G(t)$ usando la partición |
| [09:01] | $F_G(t)$ queda como promedio ponderado (combinación convexa) de las acumuladas de cada escenario |
| [10:06] | Cálculo explícito de $F_G(t)$ por tramos, con un error de pizarra corregido en vivo |
| [11:35] | Derivando $F_G$ se obtiene $f_G(t)$ como la misma combinación ponderada, ahora de densidades |
| [13:00] | Cálculo de $E(G)$ por linealidad de la integral: combinación convexa de los $E(G_i)$ |
| [15:09] | Advertencia: la varianza **no** es combinación convexa de las varianzas de cada escenario |
| [15:39] | Cálculo correcto de $\text{Var}(G)$ pasando por $E(G^2)$ |
| [18:33] | Generalización: qué se mezcla linealmente ($F_X$, $f_X$, $E(X)$, $E(X^2)$, $E(g(X))$) y qué no ($V(X)$, $\sigma(X)$) |
| [20:04] | Por qué la mezcla se puede pensar como vínculo entre variables: codificar la partición como una v.a. discreta |
| [21:02] | Advertencia final: mezclar normales muy separadas da varias campanas, no una única campana |
| [22:18] | Cierre de la clase, unidad 5 completa |

## Qué aporta sobre el apunte

- **(a) Ejemplo resuelto nuevo.** El apunte [[teorica-mezcla]] trae el ejemplo subte/colectivo
  (partición de **dos** escenarios, ambos exponenciales). Este video resuelve un ejemplo distinto y
  más rico: partición de **tres** escenarios con familias distintas (uniforme, exponencial
  trasladada y normal), lo que obliga a manejar la FDA por tramos y a construirla con cuidado.
  Reproducido completo abajo.
- **(b) Intuición nueva — analogía con función partida.** [02:56]–[03:47] El docente compara la
  variable de mezcla con una función partida (spline) de análisis: es lineal en un tramo, cuadrática
  en otro, trigonométrica en otro, pero la función total **no es ninguna de las tres cosas**. De la
  misma manera, $G$ no es uniforme, ni exponencial, ni normal — es otra cosa. Esta analogía no está
  en [[mezcla-de-distribuciones]] (que usa la analogía de las urnas) y complementa esa intuición.
- **(b) Intuición nueva — mezcla como vínculo entre variables.** [20:04] La partición que define los
  escenarios se puede codificar como una variable aleatoria discreta auxiliar (p. ej. $X=0,1,2$ para
  cada escenario), y entonces la mezcla se lee como un vínculo entre esa discreta y la $v.a.$
  continua observada — el mismo espíritu que [[funcion-de-variable-aleatoria]] y
  [[variables-aleatorias-bidimensionales]].
- **(b) Intuición nueva — mezcla de normales no es normal.** [21:02] Si se mezclan tres normales con
  medias muy separadas (ejemplo: 10, 100 y 200), la densidad resultante **no** es una única campana:
  se ven tres campanas separadas, porque en la zona de cada campana las otras dos valen
  aproximadamente cero. Ilustra visualmente por qué una mezcla puede ser multimodal aunque todos los
  componentes sean de la misma familia.
- **(c) Advertencia del docente.** [15:09]–[18:05] Remarca que el atajo de "mezclar" directamente
  desvíos o varianzas es un error muy común y que en los parciales se usa justamente para diferenciar
  a quien aplica la fórmula de memoria de quien realmente entiende el porqué. Este punto ya está
  documentado en [[mezcla-de-distribuciones]] (sección "## Fórmulas generales", el callout
  "⚠️ La varianza NO se mezcla linealmente"); aquí se agrega el comentario explícito del docente
  sobre su uso como trampa de examen (ya incorporado a esa página).
- **(d) Énfasis.** El docente insiste en que, para una variable continua desconocida, siempre
  conviene arrancar por la acumulada (porque es una probabilidad y admite probabilidad total), y
  deriva solo al final — remarca esto como método general, no solo para este ejercicio.

## Ejercicio resuelto en clase

**Enunciado.** [00:40] Los gastos diarios $G$ de Federico (en miles de pesos) dependen de cómo
viene su día:
- Si duerme mal ($S$ = "tiene sueño"), se olvida la mitad de las cosas y gasta menos:
  $G_S\sim\mathcal{U}(20,50)$.
- Si se quedó sin comida y llega con hambre ($H$), gasta más: $G_H=30+Y$ con
  $Y\sim\mathcal{E}(1/40)$ (exponencial de media 40, trasladada 30).
- En el resto de los casos ($R$), $G_R\sim\mathcal{N}(40,5)$.

Se supone que $S$, $H$ y $R$ forman una partición (nunca coexisten sueño y hambre), con
$P(S)=0.4$, $P(H)=0.35$, $P(R)=0.25$.

**Planteo — acumulada por probabilidad total.** [04:21]–[09:28] Como $\{S,H,R\}$ es una partición:
$$ F_G(t)=P(G\le t)=P(G\le t\mid S)\,P(S)+P(G\le t\mid H)\,P(H)+P(G\le t\mid R)\,P(R) = F_{G_S}(t)P(S)+F_{G_H}(t)P(H)+F_{G_R}(t)P(R). $$

Cada acumulada condicional es conocida:
$$ F_{G_S}(t)=\begin{cases}0 & t<20\\ \dfrac{t-20}{30} & 20\le t\le 50\\ 1 & t>50\end{cases}\qquad
F_{G_H}(t)=P(Y+30\le t)=P(Y\le t-30)=\begin{cases}1-e^{-\frac{t-30}{40}} & t>30\\ 0 & t\le 30\end{cases}\qquad
F_{G_R}(t)=\Phi\!\left(\frac{t-40}{5}\right). $$

**Cálculo — acumulada por tramos.** [10:06]–[11:26] Activando cada tramo según corresponda:
$$ F_G(t)=\begin{cases}
\Phi\!\left(\dfrac{t-40}{5}\right)P(R) & t<20\\[2mm]
\Phi\!\left(\dfrac{t-40}{5}\right)P(R)+\dfrac{t-20}{30}P(S) & 20\le t\le 30\\[2mm]
\Phi\!\left(\dfrac{t-40}{5}\right)P(R)+\dfrac{t-20}{30}P(S)+\left(1-e^{-\frac{t-30}{40}}\right)P(H) & 30<t\le 50\\[2mm]
\Phi\!\left(\dfrac{t-40}{5}\right)P(R)+P(S)+\left(1-e^{-\frac{t-30}{40}}\right)P(H) & t>50
\end{cases} $$

**Densidad.** [11:35] Derivando $F_G$ se obtiene, directamente, la misma combinación convexa de
densidades:
$$ f_G(t)=f_{G_S}(t)\,P(S)+f_{G_H}(t)\,P(H)+f_{G_R}(t)\,P(R). $$

**Esperanza.** [13:00]–[14:58] Por linealidad de la integral (la densidad de la mezcla ya es una
combinación convexa, así que integrar $t\cdot f_G(t)$ separa en tres integrales):
$$ E(G)=P(S)\,E(G_S)+P(H)\,E(G_H)+P(R)\,E(G_R)=0.4\cdot\frac{20+50}{2}+0.35\cdot(30+40)+0.25\cdot 40 = 14+24.5+10=48.5. $$

**Varianza — con cuidado.** [15:09]–[18:25] $\text{Var}(G)\neq P(S)\text{Var}(G_S)+P(H)\text{Var}(G_H)+P(R)\text{Var}(G_R)$: el cuadrado rompe la
linealidad. Lo que sí es combinación convexa es $E(G^2)$:
$$ E(G^2)=P(S)\left(V(G_S)+E^2(G_S)\right)+P(H)\left(V(G_H)+E^2(G_H)\right)+P(R)\left(V(G_R)+E^2(G_R)\right). $$
Con $V(G_S)=\dfrac{30^2}{12}=75$, $E(G_S)=35$; $V(G_H)=40^2=1600$ (la traslación no cambia la
varianza), $E(G_H)=70$; $V(G_R)=5^2=25$, $E(G_R)=40$:
$$ E(G^2)=0.4\,(75+35^2)+0.35\,(1600+70^2)+0.25\,(25+40^2)=520+2275+406.25=3201.25. $$
$$ \text{Var}(G)=E(G^2)-E(G)^2=3201.25-48.5^2=3201.25-2352.25=849 \;\Rightarrow\; \sigma(G)=\sqrt{849}\approx 29.14. $$

**Resultado.** $E(G)=48.5$ (miles de pesos), $\text{Var}(G)=849$, $\sigma(G)\approx29.14$. El mismo
patrón (mezclar $E(g(X))$ vale, mezclar $V(X)$ y $\sigma(X)$ no) que en el ejemplo del
subte/colectivo de [[teorica-mezcla]] y que en [[mezcla-de-distribuciones]].

## Advertencias del docente

- [15:09]–[18:28] La descomposición lineal de la varianza/desvío por escenario **no vale nunca**
  ($\sigma(X)\neq\sigma(X_1)P(A_1)+\dots$); el docente aclara que este atajo mal aplicado es un error
  frecuente que se usa deliberadamente en el parcial para distinguir a quien resuelve de memoria de
  quien entiende el razonamiento.
- [21:02]–[22:09] Al mezclar distribuciones de la misma familia pero con parámetros muy separados
  (ejemplo: normales de medias 10, 100 y 200), el resultado no se parece a esa familia: aparecen
  varias modas visibles en la densidad en vez de una única campana.

## Páginas del wiki que toca

- [[mezcla-de-distribuciones]]
- [[esperanza-condicional]]
- [[variables-aleatorias-bidimensionales]]
- [[funcion-de-variable-aleatoria]]
