---
titulo: Formulario — Suma de V.A., LGN y TCL
resumen: "Hoja de la unidad 7: esperanza y varianza de una suma, convolución, sumas con nombre propio de variables independientes, desigualdad de Chebyshev, ley de grandes números, teorema central del límite y aproximación normal de la binomial."
tipo: formulario
unidad: 7
orden: 10
tags: [formulario, suma-de-va, tcl, lgn, cheat-sheet]
fuentes: ["[[tp7-suma-de-va]]", "[[teorica-suma-va-general]]", "[[teorica-tcl-introduccion]]", "[[video-suma-variables]]"]
actualizado: 2026-09-03
---

# Formulario — Suma de V.A., LGN y TCL (unidad 7)

Hoja de fórmulas de la unidad. Hub: [[suma-de-variables-aleatorias]].

## Esperanza y varianza de una suma
- $E[X+Y]=E[X]+E[Y]$ (siempre).
- $V(X+Y)=V(X)+2\,\mathrm{Cov}(X,Y)+V(Y)$ (general).
- Indep. / no correlacionadas: $V(X\pm Y)=V(X)+V(Y)$.
- $n$ i.i.d.: $E[S_n]=n\mu$, $V(S_n)=n\sigma^2$; $\;E[\bar X_n]=\mu$, $V(\bar X_n)=\dfrac{\sigma^2}{n}$.

## Convolución (suma de independientes)
- Discreta: $p_S(s)=\sum_{y\in R_Y}p_X(s-y)p_Y(y)$.
- Continua: $f_S(s)=\int_{-\infty}^{+\infty}f_X(s-y)f_Y(y)\,dy$.

## Sumas con nombre propio (independientes) — ver [[suma-de-va-independientes]]
| Sumandos | Suma |
|---|---|
| $n\times\mathrm{Bernoulli}(p)$ | $\mathrm{Bin}(n,p)$ |
| $\mathrm{Bin}(n_1,p)+\mathrm{Bin}(n_2,p)$ | $\mathrm{Bin}(n_1+n_2,p)$ |
| $\mathrm{Poisson}(\lambda_1)+\mathrm{Poisson}(\lambda_2)$ | $\mathrm{Poisson}(\lambda_1+\lambda_2)$ |
| $\mathcal N(\mu_1,\sigma_1)+\mathcal N(\mu_2,\sigma_2)$ | $\mathcal N(\mu_1+\mu_2,\sqrt{\sigma_1^2+\sigma_2^2})$ |
| $\mathrm{Unif}(0,1)+\mathrm{Unif}(0,1)$ | triangular en $(0,2)$ |
| $n\times\mathrm{Exp}(\lambda)$ | $\mathrm{Gamma}(n,\lambda)=\mathrm{Erlang}_n(\lambda)$ |
| $\mathrm{Geo}(p)+\mathrm{Geo}(p)$ | $\mathrm{BinNeg}(2,p)$ |
| $\mathrm{BinNeg}(n,p)+\mathrm{BinNeg}(m,p)$ (misma $p$) | $\mathrm{BinNeg}(n+m,p)$ |
| $\sum_{i=1}^n\mathcal N(0,1)^2$ | $\chi^2_n$ |

> ⚠️ Geométrica/BinNeg: sumar solo en la **misma versión** (fracasos o
> intentos, nunca mezclar) — cambia el recorrido y $E[S]$. Ver
> [[video-suma-variables]] [33:05].

**Gamma / Erlang** (ver [[distribucion-gamma]] · [[distribucion-erlang]]):
$\;f_{\Gamma(n,\lambda)}(x)=\dfrac{\lambda^n x^{n-1}e^{-\lambda x}}{(n-1)!}$,
$\;E=\dfrac n\lambda$, $\;V=\dfrac n{\lambda^2}$. Para $P(T_n>t)$ usar
$\{T_n>t\}\Leftrightarrow\{N(t)\le n-1\}$ con $N(t)\sim\mathrm{Poisson}(\lambda t)$.

## Cotas — ver [[desigualdad-de-chebyshev]]
- Markov ($X\ge0$): $\;P(X\ge\alpha)\le\dfrac{E[X]}{\alpha}$.
- Chebyshev: $\;P(|X-\mu|\ge\varepsilon)\le\dfrac{\sigma^2}{\varepsilon^2}$.
- Promedio: $\;P(|\bar X_n-\mu|\ge\varepsilon)\le\dfrac{\sigma^2}{n\varepsilon^2}$.

## Convergencias — ver [[ley-de-grandes-numeros]]
- LGN débil: $\lim_n P(|\bar X_n-\mu|\ge\varepsilon)=0$.
- LGN fuerte: $P(\lim_n\bar X_n=\mu)=1$.

## TCL — ver [[teorema-central-del-limite]]
Con $X_k$ i.i.d., $\mu,\sigma$; $\;Z_n=\dfrac{\bar X_n-\mu}{\sigma/\sqrt n}$:
- $P(Z_n\le z)\approx\Phi(z)$.
- $\bar X_n\overset{\text{aprox}}{\sim}\mathcal N(\mu,\sigma/\sqrt n)$;
  $\;S_n\overset{\text{aprox}}{\sim}\mathcal N(n\mu,\sqrt n\,\sigma)$.
- Frecuencia relativa: $P(\hat P_n\le q)\approx\Phi\!\big(\tfrac{q-p}{\sqrt{p(1-p)/n}}\big)$.

## Aproximación normal de la binomial — ver [[aproximacion-normal-de-la-binomial]]
$\mathrm{Bin}(n,p)\approx\mathcal N(np,\sqrt{npq})$. **Corrección por continuidad:**
$$ P(a\le S_n\le b)\approx\Phi\!\big(\tfrac{b+\frac12-np}{\sqrt{npq}}\big)-\Phi\!\big(\tfrac{a-\frac12-np}{\sqrt{npq}}\big). $$

## Fractiles usuales (de la tabla del [[tp7-suma-de-va]])
- $z_{0.975}=1.96$, $\;z_{0.99}=2.3263$, $\;z_{0.95}=1.6449$, $\;z_{0.985}\approx2.17$.
