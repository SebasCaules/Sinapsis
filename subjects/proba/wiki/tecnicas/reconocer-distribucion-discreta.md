---
titulo: Reconocer qué distribución discreta usar
resumen: "Mapa de decisión para elegir la distribución discreta correcta según qué cuenta la variable y cómo se generan los datos: cantidad fija de ensayos o repetición hasta el éxito, y muestreo con o sin reposición. Incluye pistas por frase del enunciado."
tipo: tecnica
unidad: 3
orden: 13
tags: [discreta, distribucion, estrategia]
fuentes: ["[[tp3-variables-aleatorias-discretas]]", "[[bernoulli-apunte]]", "[[binomial-apunte]]", "[[geometrica-apunte]]", "[[binomial-negativa-apunte]]", "[[hipergeometrica-apunte]]", "[[poisson-apunte]]", "[[poisson-aproximacion-binomial-apunte]]", "[[video-geometrica-y-poisson]]"]
actualizado: 2026-09-04
---

# Reconocer qué distribución discreta usar

**En breve.** Mapa para elegir la distribución discreta correcta en un parcial a
partir de dos preguntas: **qué cuenta** la variable y **cómo se generan** los
datos. Incluye árbol de decisión, pistas por frase del enunciado y tabla
comparativa de soporte, PMF, $E$ y $V$.

Patrón de decisión para identificar la [[variable-aleatoria|v.a. discreta]]
adecuada en un ejercicio de parcial. La pregunta clave es **qué cuenta la
variable** y **cómo se generan los datos**.

## Árbol de decisión

1. **¿Un solo ensayo éxito/fracaso?** → [[distribucion-bernoulli|Bernoulli$(p)$]].
2. **¿Cantidad fija $n$ de ensayos independientes, cuento éxitos?**
   - Muestreo **con reposición** o población muy grande →
     [[distribucion-binomial|Binomial$(n,p)$]].
   - Muestreo **sin reposición** de población **finita** →
     [[distribucion-hipergeometrica|Hipergeométrica$(N,M,n)$]].
3. **¿Repito hasta el primer éxito, cuento fracasos previos?** →
   [[distribucion-geometrica|Geométrica$(p)$]].
4. **¿Repito hasta el $r$-ésimo éxito, cuento fracasos previos?** →
   [[distribucion-binomial-negativa|BinNeg$(r,p)$]].
5. **¿Cuento ocurrencias en un intervalo, con tasa media $\lambda$?** →
   [[distribucion-poisson|Poisson$(\lambda)$]].

> [!figura] u3-mapa-de-las-seis-discretas-y-los-pasajes-entre-e
> Las seis distribuciones discretas de la unidad con los pasajes entre ellas y una tabla de recorrido, esperanza y varianza. Note que en el pasaje hipergeométrica → binomial coincide $E[X]$ pero no $V(X)$.

> ⚠️ **Cuando ninguna estructura conocida aplica.** Que cada rama condicional de
> un experimento tenga una estructura conocida no implica que la variable total la
> tenga. Ejemplo ([[video-geometrica-y-poisson]] min. 59:46–62:26): una moneda
> decide el método de extracción de una urna (cara → 2 extracciones sin
> reposición, ceca → 2 extracciones con reposición) y $X$ cuenta las bolitas
> azules extraídas. Condicional a cara, $X$ es
> [[distribucion-hipergeometrica|hipergeométrica]]; condicional a ceca, es
> [[distribucion-binomial|binomial]] — pero la $X$ incondicional **no es ninguna
> de las dos** (no hay $N,M,n$ ni $n,p$ que reproduzcan sus probabilidades
> puntuales). Hay que calcular $P(X=k)$ desde cero con
> [[probabilidad-total-y-bayes|probabilidad total]], no forzar una fórmula
> conocida.

## Pistas en el enunciado

| Frase / situación | Distribución |
|---|---|
| "pasa / no pasa" en un único caso | [[distribucion-bernoulli\|Bernoulli]] |
| "cuántos de los $n$ ..." con reposición / lote grande | [[distribucion-binomial\|Binomial]] |
| "muestra sin reemplazo" de un total chico conocido ($N$, $M$) | [[distribucion-hipergeometrica\|Hipergeométrica]] |
| "hasta que ocurra **por primera vez**" | [[distribucion-geometrica\|Geométrica]] |
| "hasta acumular **$r$** éxitos" | [[distribucion-binomial-negativa\|BinNeg]] |
| "número medio por hora / km / página", eventos raros | [[distribucion-poisson\|Poisson]] |

## Aproximaciones útiles (simplifican cuentas)

- **Hipergeométrica $\to$ Binomial** si $N \gg n$ (con $p = M/N$): muestrear sin
  reposición se parece a con reposición. Fuente: [[hipergeometrica-apunte]].
- **Binomial $\to$ Poisson** si $n$ grande y $p$ chico (con $\lambda = np$): eventos
  poco probables en muchos ensayos. Fuente:
  [[poisson-aproximacion-binomial-apunte]].

## Tabla comparativa (soporte, PMF, $E$, $V$)

| Distribución | $\mathcal{R}_X$ | $p_X(k)$ | $E[X]$ | $V(X)$ |
|---|---|---|---|---|
| [[distribucion-bernoulli\|Bernoulli$(p)$]] | $\{0,1\}$ | $p^k q^{1-k}$ | $p$ | $pq$ |
| [[distribucion-binomial\|Binomial$(n,p)$]] | $\{0,\dots,n\}$ | $\binom{n}{k}p^k q^{n-k}$ | $np$ | $npq$ |
| [[distribucion-geometrica\|Geométrica$(p)$]] | $\mathbb{N}_0$ | $q^k p$ | $q/p$ | $q/p^2$ |
| [[distribucion-binomial-negativa\|BinNeg$(r,p)$]] | $\mathbb{N}_0$ | $\binom{k+r-1}{k}q^k p^r$ | $rq/p$ | $rq/p^2$ |
| [[distribucion-hipergeometrica\|Hipergeom.$(N,M,n)$]] | $\{\max\{0,n-(N-M)\},\dots,\min\{n,M\}\}$ | $\frac{\binom{M}{k}\binom{N-M}{n-k}}{\binom{N}{n}}$ | $n\frac{M}{N}$ | $n\frac{M}{N}\frac{N-M}{N}\frac{N-n}{N-1}$ |
| [[distribucion-poisson\|Poisson$(\lambda)$]] | $\mathbb{N}_0$ | $\frac{\lambda^k}{k!}e^{-\lambda}$ | $\lambda$ | $\lambda$ |

con $q = 1-p$.

> Para la **FGM** de cada una de estas distribuciones, ver la tabla en
> [[funcion-generadora-de-momentos|Función generadora de momentos]].

> ⚠️ **Cuidado con la convención de la cátedra.** En esta materia la
> [[distribucion-geometrica|geométrica]] y la
> [[distribucion-binomial-negativa|binomial negativa]] cuentan **fracasos** (no
> ensayos), así que su soporte es $\mathbb{N}_0$ (incluye 0) y la media es $q/p$ (no
> $1/p$). Ver [[tp3-variables-aleatorias-discretas]].

## Ejercicio resuelto

**Enunciado** ([[tp3-variables-aleatorias-discretas]] ej. 41). El 20 % de los
exámenes que corrige un docente tienen el mismo error. a) ¿Probabilidad de ver 10
exámenes antes de encontrar el primero con ese error? b) Si ya vio 10 exámenes sin
el error, ¿probabilidad de ver 10 más hasta encontrarlo?

**Identificación.** "Hasta encontrar **por primera vez**" → geométrica. "Éxito" =
examen con el error, $p = 0{,}2$. $X$ = n.º de exámenes **sin** error (fracasos)
antes del primero con error $\Rightarrow X \sim \text{Geométrica}(0{,}2)$.

**Cálculo.**
- a) "10 exámenes antes de encontrar el primero" = 10 fracasos seguidos y luego el
  éxito: $P(X = 10) = q^{10}p = 0{,}8^{10}\cdot 0{,}2 \approx 0{,}0215$.
- b) Por la **[[distribucion-geometrica|falta de memoria]]**, haber visto ya 10 sin
  el error no cambia nada: la probabilidad de ver exactamente 10 más hasta el error
  es la misma que partir de cero, $0{,}8^{10}\cdot 0{,}2 \approx 0{,}0215$.

**Resultado.** a) $\approx 0{,}0215$; b) $\approx 0{,}0215$ (idénticas, por falta de
memoria).
