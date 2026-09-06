---
titulo: Integrales dobles — masa de una placa (complemento matemático)
resumen: "Complemento matemático que construye la integral doble como la masa de una placa: suma de Riemann, teorema de Fubini y centro de masa, con la analogía de densidad conjunta y esperanzas; incluye una errata detectada en el cálculo del apunte."
tipo: fuente
formato: pdf
unidad: 0
archivo_raw: "raw/11-complementos-matematicos/Integrales dobles - masa de una placa.pdf"
ingerido: 2026-05-30
---

# Integrales dobles — masa de una placa (complemento matemático)

**Qué es:** apunte manuscrito (6 páginas) que introduce la integral doble a partir
de la analogía física de la **masa de una placa** con densidad superficial
$d(x,y)$. Es la base para calcular probabilidades y esperanzas con variables
aleatorias continuas bidimensionales.

**Cubre las unidades/temas:** complementos matemáticos (sin número de unidad).
Soporte para [[variables-aleatorias-bidimensionales]] y [[funcion-de-densidad]].

## Puntos clave
- **Idea (suma de Riemann):** se divide la placa en celdas $\Delta x \times \Delta y$.
  La masa de una celda es $\Delta\text{masa}(x_i,y_j)\approx d(x_i,y_j)\,\Delta x\,\Delta y$
  y la masa total es el límite de la doble suma $\sum_i\sum_j d(x_i,y_j)\Delta x\Delta y$,
  es decir la integral doble $\iint_R d(x,y)\,dx\,dy$.
- **Teorema de Fubini:** la integral doble se calcula como integral iterada, y se
  puede integrar en cualquier orden (eligiendo bien los límites del recinto):
  $$ \iint_R d\,dA = \int_0^1\!\!\int_0^{1-x} d\,dy\,dx = \int_0^1\!\!\int_0^{1-y} d\,dx\,dy. $$
- **Ejemplo (triángulo $0<x$, $0<y$, $x+y<1$, densidad $d(x,y)=xy$):**
  masa $=\int_0^1\int_0^{1-x} xy\,dy\,dx = \tfrac{1}{12}$ kg; el resultado no depende
  del orden de integración.
- **Centro de masa (baricentro):**
  $\bar x = \dfrac{\iint x\,d(x,y)\,dA}{\text{masa}}$,
  $\bar y = \dfrac{\iint y\,d(x,y)\,dA}{\text{masa}}$.
  En el ejemplo $\iint x\,d\,dA = \tfrac{1}{60}$, y el apunte concluye
  $\bar x = \tfrac{1/60}{1/12}=\tfrac{1}{5}=\bar y$ (ver la errata debajo: lo correcto
  es $\tfrac{1/60}{1/24}=\tfrac{2}{5}$).

> ⚠️ **Errata del raw (resuelta el 2026-08-13).** Los valores masa $=1/12$ y
> $\bar x=1/5$ del apunte son **incorrectos e internamente inconsistentes**. En el
> cálculo de la masa (pág. 3 del PDF) el apunte escribe la primitiva
> $\int xy\,dy = xy^2$ **omitiendo el factor $\tfrac12$**, mientras que en el numerador
> de $\bar x$ (pág. 5) sí lo incluye ($\int x^2 y\,dy = \frac{x^2y^2}{2}$, de donde sale
> $1/60$). Con la primitiva correcta la masa es $1/24$ y el baricentro
> $\bar x=\bar y=\frac{2}{5}$. Verificado de forma independiente (función Beta) y por
> consistencia física; el desarrollo completo está en
> [[tecnica-integrales-dobles#Ejercicio resuelto|el ejercicio resuelto de la técnica]],
> que ahora presenta el cálculo correcto y deja el del apunte anotado como errata.
- **Analogía probabilística:** $d(x,y)$ es la densidad conjunta, masa $\equiv$ probabilidad
  total (debe ser 1), y el baricentro $\equiv$ el vector de esperanzas $(E[X],E[Y])$.

## Páginas del wiki que toca
- [[tecnica-integrales-dobles|Técnica: integrales dobles]]
- [[variables-aleatorias-bidimensionales]]
- [[funcion-de-densidad]]
