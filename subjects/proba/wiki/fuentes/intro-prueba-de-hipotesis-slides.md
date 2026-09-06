---
titulo: Introducción a Prueba de hipótesis (slides)
resumen: 'Presentación que motiva la unidad 9 con el ejemplo de los tableros de secado: dos hipótesis en competencia, errores tipo I y II, elección del estadístico, región de rechazo con nivel $\alpha$ y valor p, más una prueba de proporción resuelta.'
tipo: fuente
formato: slides
unidad: 9
archivo_raw: "raw/10-pruebas-de-hipotesis/01 - Prueba de hipótesis.pptx"
ingerido: 2026-05-30
---

# Introducción a Prueba de hipótesis (slides)

**Qué es:** Presentación introductoria de la cátedra que motiva la prueba de
hipótesis con ejemplos y desarrolla la regla de decisión, el valor p y la
prueba para la proporción.

**Cubre las unidades/temas:** unidad 9 — motivación, errores tipo I y II, regla
de decisión, valor p, prueba para la media y para la proporción.

## Puntos clave

- **Ejemplo motivador (tableros de secado):** un fabricante afirma que el tiempo
  medio de secado es $\le 20$ min; en 36 tableros el promedio da 21 min. ¿Miente
  el fabricante o fue el azar? Hay **dos hipótesis** posibles (analogía con un
  jurado): cualquier decisión puede cometer un error por azar.
- **Errores:** se introducen el error tipo I (rechazar $H_0$ siendo verdadera) y
  el error tipo II (aceptar $H_0$ siendo falsa); hay que **buscar un balance**
  entre ambos.
- **Estrategias:** todas se basan en elegir un **estadístico** apropiado (función
  de la muestra). Dos enfoques: fijar región de rechazo con nivel $\alpha$, o
  reportar el **valor p**.
- **TCL:** las fórmulas valen para variables arbitrarias si la muestra es
  suficientemente grande, gracias al [[teorema-central-del-limite|Teorema Central del Límite]].
- **Valor p:** "probabilidad de que, si $H_0$ es verdadera, el estadístico de
  prueba dé tan mal o peor de lo que dio". Se rechaza $H_0$ si valor p $< \alpha$.
- **Ejemplo de proporción (máquina dosificadora):** 18 envases incompletos en 145
  (¿proporción $> 8\%$?), nivel $\alpha = 5\%$ → coincide con el ejercicio 17 del
  [[tp9-pruebas-de-hipotesis|TP9]].

> Nota: el texto de las fórmulas está embebido como imágenes en el pptx; el
> desarrollo completo de las reglas de decisión está en los apuntes manuscritos
> [[apunte-media-nula-igual]], [[apunte-media-nula-mayor-igual]],
> [[apunte-prueba-proporcion]] y [[apunte-media-desvio-desconocido]].

## Páginas del wiki que toca

- [[prueba-de-hipotesis]]
- [[error-tipo-i-y-tipo-ii]]
- [[valor-p]]
- [[prueba-de-hipotesis-para-la-media]]
- [[prueba-de-hipotesis-para-la-proporcion]]
