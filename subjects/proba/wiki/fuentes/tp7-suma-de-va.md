---
titulo: TP7 — Suma de variables aleatorias, distribución en el muestreo
resumen: "Guía de ejercicios de la unidad 7 (curso 2024) sobre suma de variables y distribución en el muestreo: tabla de sumas especiales, Chebyshev, ley de los grandes números y teorema central del límite; atención a la doble numeración del PDF."
tipo: fuente
formato: guia
unidad: 7
archivo_raw: "raw/08-suma-de-va/tp7_2024.pdf"
ingerido: 2026-05-30
---

# TP7 — Suma de variables aleatorias, distribución en el muestreo

**Qué es:** guía de ejercicios (curso 2024) de la unidad 7. Incluye repaso
teórico, tabla de la $\mathcal N(0,1)$, tabla de fractiles, 24 ejercicios con
respuestas y **6 ejercicios resueltos paso a paso**.

> ⚠️ **Doble numeración del PDF.** La sección 6 ("Ejercicios resueltos") los
> reetiqueta como *Ejercicio 1, 3, 5, 12, 14, 17*, pero esos números **no**
> coinciden con la **guía** (sección 4). El mismo enunciado aparece dos veces con
> número distinto. Para citar usamos siempre la **numeración de la guía**:
>
> | Tema | Nº en la guía (§4 y §5 Respuestas) | Nº en "resueltos" (§6) |
> |---|---|---|
> | Cañón $\mathrm{Bin}(100,0.8)$ | **3** | 1 |
> | Central telefónica $N=78$ | **5** | 3 |
> | 30 instrumentos exponenciales | **7** | 5 |
> | Tamaño de muestra $\hat P_n$ | **14** | 12 |
> | Pruebas mínimas (Chebyshev/normal) | **16** | 14 |
> | Diferencia de promedios | **19** | 17 |

**Cubre las unidades/temas:** suma de v.a., i.i.d., Markov/Chebyshev, LGN, TCL,
aproximación normal de la binomial, distribución en el muestreo.

## Puntos clave / contenido del repaso
- Generalidades de la suma (E, V, convolución) y tabla de **sumas especiales**:
  - Bernoulli→Binomial; Binomial+Binomial→Binomial; Poisson+Poisson→Poisson;
    Normal+Normal→Normal; Geométrica→BinNeg; BinNeg+BinNeg→BinNeg;
    Exponenciales→Gamma; $\sum N(0,1)^2\to\chi^2$; $\chi^2+\chi^2\to\chi^2$; Cauchy+Cauchy→Cauchy.
- **Distribuciones infinitamente divisibles** (se escriben como suma de i.i.d.):
  BinNeg, Poisson, Gamma, Normal, $\chi^2$, Cauchy.
- **Distribuciones estables** (combinación lineal de dos copias indep. mantiene la
  forma salvo escala/localización): estable $\Rightarrow$ infinitamente divisible (no al revés).
- Markov, Chebyshev, LGN (débil y fuerte), TCL, corrección por continuidad,
  aproximación normal de $\hat P_n$.

## Ejercicios resueltos disponibles (numeración de la guía)
- **Ej. 3** — cañón, $\mathrm{Bin}(100,0.8)$, $P(70<X<90)$ exacto y por normal con corrección. Resultado $\approx0.983$.
- **Ej. 5** — central telefónica, dimensionar $N$ líneas, $N=78$.
- **Ej. 7** — 30 instrumentos exponenciales, $T\sim\mathrm{Gamma}(30,0.1)$, $P(T>310)\approx0.4276$ (TCL); valor exacto $\approx0.4047$.
- **Ej. 14** — tamaño de muestra para $\hat P_n$ ($p=0.07$: $n\ge 3523$; $p$ desconocida: $n\le 13529$).
- **Ej. 16** — pruebas mínimas (Chebyshev: $3333$/$3334$; normal: $471$).
- **Ej. 19** — diferencia de promedios de dos muestras normales, $\approx0.6714$.

> ⚠️ **Discrepancias internas del raw en los valores oficiales.**
> - **Ej. 14a** ($p=0.07$): la sección "Respuestas" da $n=3523$ (de
>   $n\ge 10000\,z_{0.99}^2\,p(1-p)=3523.1$, truncado). La resolución paso a paso
>   redondea hacia arriba a $n\ge 3524$. **Valor oficial: $3523$.**
> - **Ej. 14b** ($p$ desconocida): "Respuestas" da $n\le 13529$
>   (de $13529.74$); la resolución la deja en $n\ge 13530$. **Valor oficial: $13529$.**
> - **Ej. 16** (Chebyshev): "Respuestas" da $3333$ (de $n>3333.\overline 3$,
>   truncado); la resolución exige $n\ge 3334$. El **valor matemáticamente
>   correcto** es $n\ge 3334$ (hay que **redondear hacia arriba** para satisfacer
>   la cota). El $471$ (aproximación normal) coincide en ambas secciones.

## Páginas del wiki que toca
- [[suma-de-variables-aleatorias]]
- [[suma-de-va-independientes]]
- [[teorema-central-del-limite]]
- [[ley-de-grandes-numeros]]
- [[desigualdad-de-chebyshev]]
- [[aproximacion-normal-de-la-binomial]]
- [[distribucion-gamma]]
- [[distribucion-erlang]]
