---
titulo: Apunte — Prueba para la media, nula "igual" (dos colas)
resumen: 'Apunte manuscrito de la unidad 9 que deduce la región de rechazo bilateral para $H_0:\mu=\mu_0$ con desvío conocido, con semiamplitud $\Delta_c=z_{1-\alpha/2}\,\sigma/\sqrt n$, y la curva de error tipo II $\beta(\mu)$ con sus valores característicos.'
tipo: fuente
formato: apunte
unidad: 9
archivo_raw: "raw/10-pruebas-de-hipotesis/06 - Prueba de hipotesis para la media - Nula Igual.pdf"
ingerido: 2026-05-30
---

# Apunte — Prueba para la media, nula "igual" (dos colas)

**Qué es:** Apunte manuscrito de la cátedra que deduce la región de rechazo de
**dos colas** ($H_0:\mu=\mu_0$) y la probabilidad de error tipo II $\beta(\mu)$.

**Cubre las unidades/temas:** unidad 9 — prueba para la media bilateral con
$\sigma$ conocida.

## Puntos clave

- Recta $\bar X_n$ con región de **aceptación** centrada en $\mu_0$ y dos zonas
  de **rechazo** en las colas, con límites $\bar x_{c_1}=\mu_0-\Delta_c$ y
  $\bar x_{c_2}=\mu_0+\Delta_c$.
- Bajo $H_0$, $\bar X_n \sim N(\mu_0, \sigma/\sqrt n)$.
- Probabilidad de error tipo I:
  $$ P(\text{Error Tipo I}) = P_{\mu_0}(|\bar X_n - \mu_0| > \Delta_c) = 2\left(1-\Phi\!\left(\tfrac{\Delta_c}{\sigma/\sqrt n}\right)\right) = \alpha $$
  de donde $\Delta_c = z_{1-\alpha/2}\,\dfrac{\sigma}{\sqrt n}$.
- $\beta(\mu) = \Phi\!\left(z_{1-\alpha/2} + \tfrac{\mu_0-\mu}{\sigma}\sqrt n\right) - \Phi\!\left(-z_{1-\alpha/2} + \tfrac{\mu_0-\mu}{\sigma}\sqrt n\right)$.
- Valores característicos: $\beta(\mu_0)=1-\alpha$, $\beta(\bar x_{c_1})\approx\beta(\bar x_{c_2})\approx 0.5$, $\beta(\pm\infty)=0$.

## Páginas del wiki que toca

- [[prueba-de-hipotesis-para-la-media]]
- [[error-tipo-i-y-tipo-ii]]
