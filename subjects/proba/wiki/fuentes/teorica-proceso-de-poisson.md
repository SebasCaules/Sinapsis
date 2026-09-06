---
titulo: "Proceso de Poisson (teóricas manuscritas)"
resumen: 'Tres apuntes manuscritos de la unidad 6 que definen el proceso de Poisson con la notación $o(h)$, deducen por ecuaciones diferenciales que $N(t)\sim\text{Poisson}(\lambda t)$ y prueban que los tiempos entre eventos son exponenciales i.i.d.'
tipo: fuente
formato: apunte
unidad: 6
archivo_raw: "raw/07-procesos-estocasticos/04 - Proceso de Poisson - Definición.pdf"
ingerido: 2026-05-30
---

# Proceso de Poisson (teóricas manuscritas)

**Qué es:** tres apuntes manuscritos consecutivos que desarrollan el proceso de
Poisson: definición, deducción de la distribución de los conteos y tiempos entre
eventos.
**Cubre las unidades/temas:** proceso de conteo en tiempo continuo, notación
$o(h)$, ecuaciones diferenciales de $P_n(t)$, $N(t)\sim\text{Poisson}(\lambda t)$,
tiempos entre eventos exponenciales i.i.d. y caracterización alternativa.

## Puntos clave (archivos 04, 05, 06)
- **Definición (04):** $N(t)$ es proceso de Poisson con parámetro/tasa $\lambda$
  sii es un proceso de conteo con incrementos independientes y estacionarios,
  $P(N(t{+}h)-N(t)=1)=\lambda h+o(h)$ y $P(N(t{+}h)-N(t)>1)=o(h)$. Se define
  $f(h)=o(h)$ sii $\lim_{h\to0} f(h)/h=0$. De aquí se deduce el sistema de
  ecuaciones diferenciales $\dot P_0(t)=-\lambda P_0(t)$ y
  $\dot P_n(t)=-\lambda P_n(t)+\lambda P_{n-1}(t)$.
- **Distribución (05):** resolviendo el sistema por inducción se obtiene
  $P_n(t)=P(N(t)=n)=\dfrac{(\lambda t)^n}{n!}e^{-\lambda t}$, es decir
  $N(t)\sim\text{Poisson}(\lambda t)$.
- **Tiempos entre eventos (06):** $P(\tau_{n+1}>t)=P(\Delta N(t)=0)=e^{-\lambda t}$,
  por lo que $\tau_{n+1}\sim\text{Exponencial}(\lambda)$ i.i.d. Caracterización
  alternativa: $N(t)$ es Poisson($\lambda$) $\iff$ los tiempos entre eventos son
  $\text{Expo}(\lambda)$ i.i.d.

## Páginas del wiki que toca
- [[proceso-de-poisson]]
- [[distribucion-poisson]], [[distribucion-exponencial]]
- [[relacion-bernoulli-poisson]]
