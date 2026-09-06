---
titulo: Derivadas parciales — densidad de una placa (complemento matemático)
resumen: 'Complemento matemático que presenta la derivada parcial como la operación inversa de acumular masa: derivando la masa acumulada se obtiene la densidad, y en dos dimensiones $d(x,y)=\partial^2 m/\partial x\,\partial y$, analogía directa de la densidad conjunta.'
tipo: fuente
formato: pdf
unidad: 0
archivo_raw: "raw/11-complementos-matematicos/Derivadas parciales - densidad de una placa.pdf"
ingerido: 2026-05-30
---

# Derivadas parciales — densidad de una placa (complemento matemático)

**Qué es:** apunte manuscrito (5 páginas) que motiva la derivada (parcial) como la
operación inversa de acumular masa: si conozco la **masa acumulada**, derivando
obtengo la **densidad**. Es la analogía masa/densidad que conecta la función de
distribución acumulada con la función de densidad.

**Cubre las unidades/temas:** complementos matemáticos (sin número de unidad).
Soporte para [[funcion-de-densidad]], [[funcion-de-distribucion-acumulada]] y
[[variables-aleatorias-bidimensionales]].

## Puntos clave
- **Caso 1D (alambre):** si $m(x)$ es la masa acumulada desde $x=0$ [kg], la
  densidad lineal [kg/m] es la derivada
  $$ \frac{\Delta m}{\Delta x}=\frac{m\!\left(\alpha+\tfrac{\Delta x}{2}\right)-m\!\left(\alpha-\tfrac{\Delta x}{2}\right)}{\Delta x}\xrightarrow[\Delta x\to 0]{}\frac{dm}{dx}(\alpha). $$
- **Caso 2D (placa):** $m(\alpha,\beta)=$ masa de la placa para $x\le\alpha,\,y\le\beta$
  [kg]. La densidad superficial [kg/m²] es la **derivada parcial cruzada** de la
  masa acumulada:
  $$ d(x,y)=\frac{\partial}{\partial x}\frac{\partial}{\partial y}m(x,y)=\frac{\partial^2 m}{\partial x\,\partial y}. $$
- **Igualdad de derivadas cruzadas (Schwarz/Clairaut):** bajo ciertas condiciones
  $\dfrac{\partial^2 m}{\partial x\,\partial y}=\dfrac{\partial^2 m}{\partial y\,\partial x}$,
  así que el orden de derivación no importa.
- **Ejemplo:** con $m(x,y)=x^2 y^3$: $\partial_x m = 2xy^3$, $\partial_y m = 3x^2y^2$,
  y ambas cruzadas dan $\partial^2_{xy}m = 6xy^2$.
- **Analogía probabilística:** la masa acumulada $m$ juega el papel de la FDA
  conjunta $F(x,y)$ y su densidad es $f(x,y)=\partial^2 F/\partial x\,\partial y$.

## Páginas del wiki que toca
- [[tecnica-derivadas-parciales|Técnica: derivadas parciales]]
- [[funcion-de-densidad]]
- [[funcion-de-distribucion-acumulada]]
- [[variables-aleatorias-bidimensionales]]
