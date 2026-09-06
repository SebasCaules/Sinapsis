---
titulo: Cómo reconocer y plantear una prueba de hipótesis
resumen: "Receta para los ejercicios de prueba de hipótesis: detectar el planteo, decidir si es de media o de proporción, elegir la cola y el estadístico. Regla de oro: la igualdad va en $H_0$ y la afirmación que se quiere probar, en $H_1$."
tipo: tecnica
unidad: 9
orden: 7
tags: [prueba-de-hipotesis, tecnica, reconocer]
fuentes: ["[[tp9-pruebas-de-hipotesis]]", "[[intro-prueba-de-hipotesis-slides]]"]
actualizado: 2026-09-04
---

# Cómo reconocer y plantear una prueba de hipótesis

**En breve.** Receta paso a paso para los ejercicios de prueba de hipótesis:
detectar que es una prueba, decidir si es de media o proporción, plantear
$H_0$/$H_1$ y la cola, elegir el estadístico y decidir. El error más común
(mal planteo de la cola) se evita con la regla de oro de abajo.

Patrón de resolución estilo parcial para los ejercicios de
[[prueba-de-hipotesis|pruebas de hipótesis]] (unidad 9).

## Paso 0: ¿es prueba de hipótesis?

Señales en el enunciado: "¿se puede concluir/afirmar que...?", "¿hay evidencia de
que...?", "¿es justificable...?", "¿hay que ajustar/revisar/rechazar...?",
"con un nivel de significación del X %". Hay un **valor de referencia** ($\mu_0$,
$q_0$) y se pregunta por una desigualdad o igualdad respecto de él.

## Paso 1: ¿media o proporción?

| Si el dato es... | Parámetro | Página |
|---|---|---|
| un **promedio**, "media", "tiempo medio", "peso promedio", una lista de mediciones | media $\mu$ | [[prueba-de-hipotesis-para-la-media]] |
| un **conteo de éxitos** ("18 de 145", "92 de 400"), "porcentaje", "proporción" | proporción $q$ | [[prueba-de-hipotesis-para-la-proporcion]] |

## Paso 2: plantear $H_0$ y $H_1$ (elegir la cola)

**Regla de oro:** la **igualdad siempre va en $H_0$**, y la **sospecha/afirmación
que se quiere "probar con evidencia" suele ir en $H_1$** (porque controlamos el
error de afirmarla en falso vía $\alpha$).

> **Intuición (por qué la afirmación va en $H_1$).** Solo controlamos
> directamente el [[error-tipo-i-y-tipo-ii|error tipo I]] ($\alpha$ = afirmar algo
> falso al rechazar $H_0$). Si ponemos la afirmación que queremos *demostrar* en
> $H_1$, entonces rechazar $H_0$ equivale a "probar la afirmación", y ese paso
> está protegido por $\alpha$ chico: solo concluimos a favor de $H_1$ con
> evidencia fuerte. Es la carga de la prueba sobre $H_1$, igual que en el
> [[prueba-de-hipotesis|jurado]].

| El enunciado pregunta por... | $H_0$ | $H_1$ | Cola |
|---|---|---|---|
| "diferente / distinto a $\theta_0$" | $\theta=\theta_0$ | $\theta\ne\theta_0$ | dos colas |
| "mayor / superior a $\theta_0$", "aumentó" | $\theta\le\theta_0$ | $\theta>\theta_0$ | derecha |
| "menor / inferior a $\theta_0$", "disminuyó" | $\theta\ge\theta_0$ | $\theta<\theta_0$ | izquierda |

> Truco: ubicar la igualdad y el signo en $H_0$ tal que $H_0$ contenga el
> "statu quo" o lo que se asume cierto hasta que la evidencia diga lo contrario.

## Paso 3: elegir el estadístico

Para la **media** (ver árbol completo en [[prueba-de-hipotesis-para-la-media]]):

- $\sigma$ **conocida** → $Z=\dfrac{\bar X-\mu_0}{\sigma/\sqrt n}\sim N(0,1)$.
- $\sigma$ **desconocida** y $n$ **grande** → $Z=\dfrac{\bar X-\mu_0}{S/\sqrt n}$ (TCL).
- $\sigma$ **desconocida**, normal y $n$ **chico** → $T=\dfrac{\bar X-\mu_0}{S/\sqrt n}\sim t_{n-1}$.

Para la **proporción** ($n$ grande): $Z=\dfrac{\hat q-q_0}{\sqrt{q_0(1-q_0)/n}}\sim N(0,1)$.

> [!figura] u9-arbol-de-eleccion-del-estadistico
> El árbol completo con las condiciones escritas sobre cada rama. Las preguntas son siempre las mismas y en el mismo orden: qué resume la muestra, qué se conoce de la dispersión y cuánta muestra hay.

## Paso 4: región de rechazo y decisión

1. Fijar $\alpha$ y buscar el fractil crítico ($z_{1-\alpha}$, $z_{1-\alpha/2}$,
   $t_{n-1,1-\alpha}$, ...).
2. Calcular el [[estadistico-de-prueba|valor observado]].
3. Decidir: rechazar $H_0$ si cae en la región (o si [[valor-p|valor p]] $<\alpha$).
4. **Concluir en palabras del problema**, no sólo "rechazo / no rechazo".

## Errores frecuentes

- Poner la igualdad en $H_1$ (mal: la igualdad siempre va en $H_0$).
- Confundir cola: "no llegan a $\theta_0$" / "inferior" es **izquierda**.
- Usar $Z$ con $n$ chico y $\sigma$ desconocido (corresponde $T$).
- Olvidar dividir $\alpha$ entre 2 en pruebas de dos colas.
- Calcular la regla de decisión con $S$ "después" de ver la muestra cuando se usa
  $T$: la regla se fija **antes** ([[apunte-media-desvio-desconocido|advertencia]]).

## Ejercicio resuelto

**Enunciado** (ejercicio 15 del [[tp9-pruebas-de-hipotesis|TP9]]): El $30\%$ de
los automovilistas cruzan en rojo. Tras una campaña, de $400$ autos $92$ cruzaron
en rojo. ¿Se puede afirmar (error $5\%$) que la campaña hizo **descender** el
porcentaje?

**Paso 1.** Conteo de éxitos sobre total → **proporción**.

**Paso 2.** "Descender / inferior a $0.30$" → cola izquierda:
$$ H_0: q\ge 0.30 \qquad H_1: q<0.30, \qquad \alpha=0.05. $$

**Paso 3.** $n=400$ grande → $Z=\dfrac{\hat q - 0.30}{\sqrt{0.30\cdot 0.70/400}}$,
con $\hat q = 92/400 = 0.23$.

**Paso 4 (cálculo y decisión).**
$$ z_{\text{obs}}=\frac{0.23-0.30}{\sqrt{0.21/400}}=\frac{-0.07}{0.0229}\approx -3.055. $$
Región de rechazo (izquierda): $Z<-z_{0.95}=-1.645$. Como
$z_{\text{obs}}=-3.055 < -1.645$, se **rechaza $H_0$**.

**Conclusión.** Con la evidencia muestral, a nivel $5\%$, la campaña produjo una
disminución significativa del porcentaje de automovilistas que cruzan en rojo
(coincide con la respuesta del TP9).

## Conceptos y técnicas relacionados

- [[prueba-de-hipotesis]] — marco general (hub de la unidad).
- [[prueba-de-hipotesis-para-la-media]], [[prueba-de-hipotesis-para-la-proporcion]] — fórmulas de cada caso.
- [[estadistico-de-prueba]], [[valor-p]], [[error-tipo-i-y-tipo-ii]] — los ingredientes.
- [[diseno-de-prueba-tamano-muestral]] — el paso siguiente cuando además se fija $\beta$.
- [[formulario-pruebas-de-hipotesis]] — todas las fórmulas en una hoja.
