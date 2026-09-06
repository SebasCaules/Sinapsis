---
titulo: Técnica — Hallar la distribución de Y = g(X)
resumen: 'Método de la acumulada para hallar la distribución de $Y=g(X)$: escribir $F_Y(y)=P(g(X)\le y)$, traducir el evento a uno sobre $X$, evaluar en $F_X$ y derivar. Es el camino esperado en el parcial, aun cuando $g$ no sea inyectiva.'
tipo: tecnica
unidad: 5
orden: 2
tags: [tecnica, funcion-de-variable-aleatoria, fda]
fuentes: ["[[teorica-funcion-de-variable-aleatoria]]", "[[tp5-2024]]", "[[video-funciones-de-variables-aleatorias]]"]
actualizado: 2026-09-03
---

# Técnica — Hallar la distribución de $Y=g(X)$

**En breve.** Receta paso a paso para el ejercicio clásico "tengo la distribución de $X$, quiero
la de $Y=g(X)$": escribir $F_Y(y)=P(g(X)\le y)$, traducir el evento a $X$, evaluar en $F_X$ y
derivar. La teoría completa está en [[funcion-de-variable-aleatoria]].

Patrón de resolución para los ejercicios donde dan la distribución de $X$ y piden la de
$Y=g(X)$. Es el método más confiable y casi siempre el esperado en el parcial. Ver el concepto en
[[funcion-de-variable-aleatoria]].

## Receta (método de la FDA)

1. **Identificar el soporte de $Y$.** Calcular la imagen de $g$ sobre $R_X$. Esto fija dónde la
   densidad/masa de $Y$ es no nula.
2. **Escribir $F_Y(y)=P(g(X)\le y)$** y traducir el evento a uno sobre $X$:
   - $g$ **creciente**: $\{g(X)\le y\}=\{X\le g^{-1}(y)\}$ → $F_Y(y)=F_X(g^{-1}(y))$.
   - $g$ **decreciente**: $\{g(X)\le y\}=\{X\ge g^{-1}(y)\}$ → $F_Y(y)=1-F_X(g^{-1}(y))$.
   - $g$ **no inyectiva** (p. ej. $g(x)=x^2$ o $|x|$): la preimagen es una unión de intervalos.
     Para $Y=X^2$: $\{X^2\le y\}=\{-\sqrt{y}\le X\le\sqrt{y}\}$ → $F_Y(y)=F_X(\sqrt{y})-F_X(-\sqrt{y})$.
3. **Pasar a densidad/masa:**
   - continua: derivar, $f_Y(y)=\dfrac{d}{dy}F_Y(y)$ (¡regla de la cadena!).
   - discreta: $p_Y(k)=\sum_{x:\,g(x)=k} p_X(x)$.
4. **Escribir el resultado por tramos**, especificando el soporte.

## Atajos según el tipo de $g$

- **Afín $Y=aX+b$**: no hace falta la FDA para los momentos: $E[Y]=aE[X]+b$,
  $\text{Var}(Y)=a^2\text{Var}(X)$. Si $X$ es normal, $Y$ también lo es.
- **$g$ escalonada (clasifica en categorías)** con $X$ continua: $Y$ es **discreta**; cada
  $p_Y(k)$ es la probabilidad de que $X$ caiga en el tramo correspondiente, usando $F_X$.
- **Monótona estricta**: existe inversa, se puede usar directamente la fórmula del cambio de
  variable $f_Y(y)=f_X(g^{-1}(y))\,\left|\frac{d}{dy}g^{-1}(y)\right|$.
- **Parábola genérica no monótona** (fuera del caso $Y=X^2$). Cuando $g(x)=ax^2+bx+c$ con $a>0$
  y el vértice cae dentro del soporte de $X$, para cada $t$ hay que resolver
  $ax^2+bx+(c-t)=0$ con Bhaskara y usar las dos raíces $x_1<x_2$ como límites:
  $F_Y(t)=F_X(x_2)-F_X(x_1)$ (la parábola queda por debajo de $t$ *entre* las raíces). Para el
  tramo donde el discriminante es negativo, no alcanza con la intuición: hay que justificar
  $F_Y(t)=0$ o $F_Y(t)=1$ viendo que la parábola no cambia de signo (discriminante negativo +
  signo del coeficiente principal, apoyado en el teorema de Bolzano). Ejemplo completo en
  [[video-funciones-de-variables-aleatorias]].

> **Intuición (el porqué del valor absoluto).** Una densidad debe ser $\ge0$. El factor
> $|{dg^{-1}}/{dy}|$ corrige cómo $g$ estira o comprime el eje: si $g$ "estira" una zona, la masa
> que cabía en un intervalo ahora se reparte en uno más largo, así que la densidad baja, y
> viceversa. El módulo es porque ese factor de escala es siempre positivo, aunque $g$ sea
> decreciente (ahí $g^{-1}$ tiene derivada negativa).

## Errores típicos a evitar

- Olvidar el **valor absoluto del jacobiano** $|dg^{-1}/dy|$ al derivar.
- No tratar la **no inyectividad**: sumar las dos ramas en $Y=X^2$, $Y=|X|$.
- Confundir el **soporte**: si $0<x<1$ y $Y=x^3$, entonces $0<y<1$, no todo $\mathbb{R}$.
- En transformación afín con $a<0$: $\sigma_Y=|a|\sigma_X$ (no $a\sigma_X$).

> **Nota sobre la numeración de la guía.** El [[tp5-2024]] tiene una *guía de ejercicios* y una
> *sección de resueltos* con numeración propia. La esfera es el **Ej. 5 de la guía** (etiquetado
> "Ejercicio 7" en los resueltos) y el beneficio es el **Ej. 6 de la guía** (etiquetado "Ejercicio
> 8" en los resueltos). Aquí se cita la numeración de la guía.

## Ejercicio resuelto

**(Ej. 6 de [[tp5-2024]]; "Ejercicio 8" en la sección de resueltos)** El beneficio de una empresa
es $B=10Q-5Q^2$ (en miles de pesos), con $Q$ continua de densidad triangular: $f_Q(q)=q$ en
$0<q<1$ y $f_Q(q)=-q+2$ en $1<q<2$. Hallar $F_B$ y $P(B>3)$.

**Soporte de $B$.** $g(q)=10q-5q^2$ es una parábola con máximo en $q=1$ ($g(1)=5$) y $g(0)=g(2)=0$.
Entonces $B\in[0,5]$.

**FDA por la región.** Para $b\in[0,5]$, el evento $\{B\le b\}$ corresponde a $Q\le q_{\alpha,1}$ o
$Q\ge q_{\alpha,2}$, donde $q_{\alpha,1},q_{\alpha,2}=1\pm\sqrt{1-\tfrac{b}{5}}$ son las raíces de
$b=10q-5q^2$. Integrando la densidad triangular en esas dos colas:
$$ F_B(b)=\frac{q_{\alpha,1}^2}{2}+\frac{(2-q_{\alpha,2})^2}{2}=\left(1-\sqrt{1-\tfrac{b}{5}}\right)^2,\qquad b\in[0,5]. $$

**Probabilidad pedida.**
$$ P(B>3)=1-F_B(3)=1-\left(1-\sqrt{1-\tfrac{3}{5}}\right)^2\approx0.8649. $$

**Resultado.** $F_B(b)=\left(1-\sqrt{1-b/5}\right)^2$ en $[0,5]$ y $P(B>3)\approx0.8649$. La
esperanza puede obtenerse integrando $g$ contra $f_Q$: $E[B]=\int(10q-5q^2)f_Q(q)\,dq=\tfrac{25}{6}$.

## Relación con otras páginas
- [[funcion-de-variable-aleatoria]] — teoría completa.
- [[tecnica-integrales-impropias]], [[tecnica-integrales-dobles]] — herramientas de cálculo.
- [[funcion-de-distribucion-acumulada]], [[funcion-de-densidad]].
- [[mezcla-de-distribuciones]] — variante con v.a. auxiliar discreta.
