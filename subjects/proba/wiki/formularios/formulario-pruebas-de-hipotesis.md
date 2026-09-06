---
titulo: Formulario — Pruebas de hipótesis
resumen: "Hoja de la unidad 9: tabla de errores y potencia, estadísticos $Z$ y $T$, regiones de rechazo según la cola, valor crítico del estimador, valor p, cálculo del error tipo II para media y proporción, y diseño del tamaño muestral."
tipo: formulario
unidad: 9
orden: 9
tags: [prueba-de-hipotesis, formulario, cheat-sheet]
fuentes: ["[[tp9-pruebas-de-hipotesis]]", "[[apunte-media-nula-igual]]", "[[apunte-media-nula-mayor-igual]]", "[[apunte-prueba-proporcion]]", "[[apunte-media-desvio-desconocido]]"]
actualizado: 2026-05-30
---

# Formulario — Pruebas de hipótesis (unidad 9)

Hoja de fórmulas para [[prueba-de-hipotesis|pruebas de hipótesis]]. Notación:
$\alpha$ = nivel de significación, $\Phi$ = FDA normal estándar, $\Xi_{n-1}$ =
FDA de la $t$ con $n-1$ g.l.

## Errores

| | $H_0$ verdadera | $H_0$ falsa |
|---|---|---|
| Acepta $H_0$ | OK | Error II ($\beta$) |
| Rechaza $H_0$ | Error I ($\alpha$) | OK |

Potencia $=1-\beta$. $\;P_{H_0}(\text{rechazar})\le\alpha$.

## Estadísticos

$$ Z_{\text{media}}=\frac{\bar X-\mu_0}{\sigma/\sqrt n}\quad(\sigma\text{ conocida o }n\text{ grande}) \qquad T=\frac{\bar X-\mu_0}{S/\sqrt n}\sim t_{n-1}\quad(\sigma\text{ desc., }n\text{ chico, normal}) $$
$$ Z_{\text{prop}}=\frac{\hat q-q_0}{\sqrt{q_0(1-q_0)/n}}\quad(n>100) $$

## Región de rechazo (con estadístico estandarizado)

| Prueba | $H_0$ / $H_1$ | Rechaza si ($Z$) | Rechaza si ($T$) |
|---|---|---|---|
| Dos colas | $=\ /\ \ne$ | $\lvert Z\rvert>z_{1-\alpha/2}$ | $\lvert T\rvert>t_{n-1,1-\alpha/2}$ |
| Cola derecha | $\le\ /\ >$ | $Z>z_{1-\alpha}$ | $T>t_{n-1,1-\alpha}$ |
| Cola izquierda | $\ge\ /\ <$ | $Z<-z_{1-\alpha}$ | $T<-t_{n-1,1-\alpha}$ |

## Valor crítico del estimador (media, $\sigma$ conocida)

- Dos colas: $\bar x_{c}=\mu_0\pm z_{1-\alpha/2}\,\dfrac{\sigma}{\sqrt n}$.
- Cola derecha: $\bar x_c=\mu_0+z_{1-\alpha}\,\dfrac{\sigma}{\sqrt n}$.
- Cola izquierda: $\bar x_c=\mu_0-z_{1-\alpha}\,\dfrac{\sigma}{\sqrt n}$.

Proporción (cola derecha): $\hat p_c=p_0+z_{1-\alpha}\sqrt{\dfrac{p_0(1-p_0)}{n}}$.

## Valor p

| Cola | Con $Z$ | Con $T$ |
|---|---|---|
| Derecha | $1-\Phi(z_{\text{obs}})$ | $1-\Xi_{n-1}(t_{\text{obs}})$ |
| Izquierda | $\Phi(z_{\text{obs}})$ | $\Xi_{n-1}(t_{\text{obs}})$ |
| Dos colas | $2(1-\Phi(\lvert z_{\text{obs}}\rvert))$ | $2(1-\Xi_{n-1}(\lvert t_{\text{obs}}\rvert))$ |

**Decisión:** rechazar $H_0\iff$ valor p $<\alpha$.

## Error tipo II — media, $\sigma$ conocida (TP9)

- Dos colas: $\beta(\mu_1)=\Phi\!\left(z_{1-\alpha/2}+\tfrac{\mu_0-\mu_1}{\sigma/\sqrt n}\right)-\Phi\!\left(-z_{1-\alpha/2}+\tfrac{\mu_0-\mu_1}{\sigma/\sqrt n}\right)$.
- Cola derecha: $\beta(\mu_1)=\Phi\!\left(z_{1-\alpha}+\tfrac{\mu_0-\mu_1}{\sigma/\sqrt n}\right)$.
- Cola izquierda: $\beta(\mu_1)=1-\Phi\!\left(-z_{1-\alpha}+\tfrac{\mu_0-\mu_1}{\sigma/\sqrt n}\right)$.

Valores guía: $\beta(\mu_0)=1-\alpha$; $\beta(\text{valor crítico})\approx 0.5$
(si simétrica); $\beta\to 0$ al alejarse hacia $H_1$.

## Error tipo II — proporción (cola derecha)

$$ \beta(q_1)=\Phi\!\left(z_{1-\alpha}\sqrt{\tfrac{q_0(1-q_0)}{q_1(1-q_1)}}+\frac{q_0-q_1}{\sqrt{q_1(1-q_1)/n}}\right). $$

## Diseño de la prueba — tamaño muestral (fijar α y β)

Imponiendo $\alpha$ y $\beta(\theta_1)\le\beta^*$ se despeja $n$ (ver
[[diseno-de-prueba-tamano-muestral|técnica de diseño]]).

- **Media, $\sigma$ conocida:** $\;n=\left(\dfrac{(z_{1-\alpha}+z_{1-\beta^*})\,\sigma}{\mu_1-\mu_0}\right)^2$ (redondear hacia arriba).
- **Valor crítico** (cola derecha): $\bar x_c=\mu_0+z_{1-\alpha}\,\sigma/\sqrt n$.
- **Proporción:** despejar $\sqrt n$ de $z_{1-\alpha}\sqrt{\tfrac{q_0(1-q_0)}{q_1(1-q_1)}}+\tfrac{q_0-q_1}{\sqrt{q_1(1-q_1)/n}}=-z_{1-\beta^*}$; luego $c=n\,\hat q_c$ con $\hat q_c=q_0+z_{1-\alpha}\sqrt{q_0(1-q_0)/n}$.

## Fractiles de uso frecuente

| $\alpha$ | $z_{1-\alpha}$ (1 cola) | $z_{1-\alpha/2}$ (2 colas) |
|---|---|---|
| 0.10 | 1.2816 | 1.6449 |
| 0.05 | 1.6449 | 1.9600 |
| 0.025 | 1.9600 | 2.2414 |
| 0.01 | 2.3263 | 2.5758 |

## Páginas relacionadas

- [[prueba-de-hipotesis]], [[prueba-de-hipotesis-para-la-media]], [[prueba-de-hipotesis-para-la-proporcion]]
- [[error-tipo-i-y-tipo-ii]], [[valor-p]], [[estadistico-de-prueba]], [[reconocer-prueba-de-hipotesis]]
- [[diseno-de-prueba-tamano-muestral]] (despejar $n$ y $c$ fijando $\alpha$ y $\beta$)
