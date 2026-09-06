---
titulo: "Proceso de Bernoulli (teóricas manuscritas)"
resumen: 'Tres apuntes manuscritos de la unidad 6 que definen el proceso de Bernoulli por incrementos independientes y estacionarios, con $N(k)\sim\text{Binomial}(k,p)$, tiempos entre eventos geométricos y tiempo hasta el $k$-ésimo binomial negativo.'
tipo: fuente
formato: apunte
unidad: 6
archivo_raw: "raw/07-procesos-estocasticos/01 - Proceso de Bernoulli - Definición.pdf"
ingerido: 2026-05-30
---

# Proceso de Bernoulli (teóricas manuscritas)

**Qué es:** tres apuntes manuscritos consecutivos que desarrollan el proceso de
Bernoulli: definición, incrementos y tiempos entre eventos.
**Cubre las unidades/temas:** proceso de conteo en tiempo discreto, condiciones
del proceso de Bernoulli, $N(k)\sim\text{Binomial}(k,p)$, incrementos
estacionarios e independientes, propiedad de Markov, tiempos entre eventos
geométricos y tiempo hasta el $k$-ésimo evento binomial negativo.

## Puntos clave (archivos 01, 02, 03)
- **Definición (01):** $N(t)$ es proceso de Bernoulli con parámetro $p$ sii es un
  proceso de conteo de tiempo discreto con incrementos independientes y
  estacionarios, $P(N(k{+}1)-N(k)=1)=p$ y $P(N(k{+}1)-N(k)=m)=0$ para $m>1$. En
  cada intervalo hay un experimento de Bernoulli i.i.d. con éxito $p$ constante.
  Luego $N(k)=$ # de éxitos en $k$ experimentos $\sim\text{Binomial}(k,p)$, con
  recorrido $\{0,1,\dots,k\}$.
- **Incrementos (02):** por incrementos estacionarios e independientes,
  $N(m)-N(k)\sim\text{Binomial}(m-k,p)$; se demuestra además la propiedad de
  Markov a partir de los incrementos independientes.
- **Tiempos entre eventos (03):** los tiempos entre eventos $\tau_i\sim
  \text{Geométrica}(p)$ i.i.d., y el tiempo hasta el $k$-ésimo evento
  $T_k\sim\text{Binomial negativa}(k,p)$.

## Páginas del wiki que toca
- [[proceso-de-bernoulli]]
- [[distribucion-binomial]], [[distribucion-geometrica]], [[distribucion-binomial-negativa]]
- [[relacion-bernoulli-poisson]]
