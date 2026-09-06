---
titulo: Apunte — Prueba para la media con desvío desconocido (t de Student)
resumen: 'Apunte manuscrito de la unidad 9 que deduce la prueba para la media cuando el desvío poblacional es desconocido y la muestra es normal y chica, con el estadístico $T=(\bar X_n-\mu_0)/(S/\sqrt n)\sim t_{n-1}$ y el ejemplo resuelto de las lámparas.'
tipo: fuente
formato: apunte
unidad: 9
archivo_raw: "raw/10-pruebas-de-hipotesis/10 - Prueba de hipótesis para la Media - Desvío desconocido.pdf"
ingerido: 2026-05-30
---

# Apunte — Prueba para la media con desvío desconocido (t de Student)

**Qué es:** Apunte manuscrito que motiva y deduce la prueba para la media cuando
$\sigma$ es **desconocido** y la muestra es chica y normal, usando el
estadístico $T$ y la distribución $t$ de Student. Incluye el ejemplo resuelto de
las lámparas (ejercicio 10 del [[tp9-pruebas-de-hipotesis|TP9]]).

**Cubre las unidades/temas:** unidad 9 — prueba para la media con $\sigma$
desconocido.

## Puntos clave

- Si $\sigma$ es desconocido **no se puede** usar la regla con $z$ y $\sigma$.
  Se usa $T=\dfrac{\bar X_n - \mu_0}{S/\sqrt n}\sim t_{n-1}$ (Student con $n-1$ g.l.).
- Para cola derecha ($H_0:\mu\le\mu_0$): se rechaza si $T>t_c$ con
  $t_c = t_{n-1,\,1-\alpha}$ (deducido de $P_{\mu_0}(T\le t_c)=1-\alpha$).
- Regla de decisión de las tres colas con $T$ (idéntica forma que con $Z$ pero
  usando fractiles $t_{n-1}$).
- **Advertencia clave del docente:** la regla de decisión (y por ende el tamaño
  $n$) debe fijarse **antes** de tomar la muestra, antes de calcular $S$;
  expresar $\bar x_c$ en función de $S/\sqrt n$ "está mal" porque $S$ es
  desconocido de antemano.
- **Ejemplo (lámparas, ej. 10):** $\mu_0=9.5$, $n=10$, $\alpha=0.05$; observado
  $\bar x_{\text{obs}}=10.985$, $S=1.1489$, $t_{\text{obs}}=4.0873 >
  t_{9,0.95}=1.8331$ → se rechaza $H_0$; valor p $\approx 0.0014$.

## Páginas del wiki que toca

- [[prueba-de-hipotesis-para-la-media]]
- [[distribucion-t-de-student]]
- [[valor-p]]
