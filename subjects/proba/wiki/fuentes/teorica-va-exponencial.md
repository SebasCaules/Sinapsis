---
titulo: Teórica — Variable Aleatoria Exponencial (05 - V.A.C.)
resumen: 'Apunte manuscrito de la unidad 4 sobre la exponencial: densidad $\lambda e^{-\lambda x}$, FDA $1-e^{-\lambda x}$, momentos deducidos con la integral Gamma que dan $E[X]=\sigma_X=1/\lambda$, y la propiedad de falta de memoria.'
tipo: fuente
formato: slides
unidad: 4
archivo_raw: "raw/05-va-continuas/05 - V.A.C. - Variable Aleatoria Exponencial.pdf"
ingerido: 2026-05-30
---

# Teórica — Variable Aleatoria Exponencial (05 - V.A.C.)

**Qué es:** apunte manuscrito de la teórica sobre la distribución exponencial
$X\sim\text{Expo}(\lambda)$, con densidad, FDA, deducción de momentos vía la
integral Gamma, y la propiedad de falta de memoria.

**Cubre las unidades/temas:** unidad 4 — distribución exponencial.

## Puntos clave
- $X\sim\text{Expo}(\lambda)$, $\lambda>0$. Modela tiempos de vida, de espera,
  entre sucesos.
- **FDA:** $F_X(x)=0$ si $x<0$, $1-e^{-\lambda x}$ si $x\ge0$.
- **Densidad:** $f_X(x)=0$ si $x<0$, $\lambda e^{-\lambda x}$ si $x>0$.
- **Resultado conocido** usado para los momentos: $\int_0^\infty t^{n-1}e^{-t}\,dt=(n-1)!$.
  Con el cambio $u=\lambda t$: $E[X]=\frac{1}{\lambda}$, $E[X^2]=\frac{2}{\lambda^2}$,
  luego $\sigma_X^2=\frac{1}{\lambda^2}$ y $\sigma_X=\frac{1}{\lambda}$.
- **Falta de memoria:** $P(X>x)=e^{-\lambda x}$, y
  $P(X>x+\Delta\mid X>x)=e^{-\lambda\Delta}=P(X>\Delta)$. Ej.: $P(X>20+1\mid X>20)=P(X>1)$.
- **Curtosis** de la exponencial: $\kappa=+6$ (leptocúrtica, colas más gruesas que la normal).

## Páginas del wiki que toca
- [[distribucion-exponencial|Distribución Exponencial]]
- [[variable-aleatoria-continua|Variable aleatoria continua]]
- [[funcion-de-densidad|Función de densidad]]
- [[asimetria-y-curtosis|Asimetría y curtosis]]
