/* lib-math.js — utilidades numéricas para distribuciones y fractiles.
   Sin dependencias. Expone window.M con funciones puras.

   ──────────────────────────────────────────────────────────────────────────
   CUANTILES DISCRETOS Y COLAS SUPERIORES (agregados para el buscador rápido)
   ──────────────────────────────────────────────────────────────────────────
   binomInv(p, n, pr)   → menor k entero tal que P(X ≤ k) ≥ p, con X ~ Bi(n, pr).
                          p ≤ 0 devuelve 0 y p ≥ 1 devuelve n. Recorre la PMF
                          acumulando, así que no depende de ninguna inversa
                          aproximada.
   poissonInv(p, lam)   → menor k entero tal que P(X ≤ k) ≥ p, con X ~ Po(lam).
                          p ≤ 0 devuelve 0; p ≥ 1 devuelve Infinity (el soporte
                          no está acotado). Corta cuando la cola remanente es
                          numéricamente nula.
   binomSF(k, n, p)     → P(X ≥ k) por SUMA DIRECTA de la cola superior
                          (i = k … n). Evita la cancelación catastrófica de
                          1 − P(X ≤ k−1), que en la cola derecha pierde dígitos
                          y puede colapsar a 0.
   poissonSF(k, lam)    → P(X ≥ k) por suma directa hacia arriba desde k, con
                          corte cuando el término deja de aportar cifras. Misma
                          motivación que binomSF.
   En las cuatro, k no entero se interpreta como el evento discreto que lo
   contiene: P(X ≤ k) usa ⌊k⌋ y P(X ≥ k) usa ⌈k⌉.

   NORMAL: erfc DE PRECISIÓN DOBLE Y COLA SUPERIOR PROPIA
   erf/erfc            aproximaciones racionales por tramos de W. J. Cody
                       (1969), error relativo ~1e-16 en todo el eje. Sustituyen
                       a la fórmula 7.1.26 de Abramowitz & Stegun, cuyo error
                       ABSOLUTO de 1.5e-7 arruinaba las colas (Φ(−6) con dos
                       cifras buenas, z_{0.9999} con el cuarto decimal falso).
   normCDF(x,mu,sig)   Φ(x) = ½·erfc(−z/√2); conserva las cifras de la cola
                       IZQUIERDA hasta el subdesbordamiento (z ≈ −37.5).
   normSF(x,mu,sig)    cola SUPERIOR P(X > x) = ½·erfc(z/√2), calculada
                       directamente. Úsela en lugar de 1 − normCDF(x): la
                       resta pierde todos los dígitos de la cola y colapsa a 0
                       a partir de z ≈ 8.3 (valores-p, α de cola lejana).
   normInv(p,mu,sig)   Acklam + un paso de Halley; arriba de p = 0.5 el residuo
                       se arma con la cola superior, así que z_{0.9999} sale
                       correcto en los 6 decimales que se imprimen.

   BINOMIAL EXACTA PARA n MODERADO
   combExact(n,k)      C(n,k) por producto multiplicativo, exacto mientras
                       entre en 2^53; NaN si se pasa.
   binomPMF            usa esa vía directa cuando puede (Bi(10; 0.5) en k = 3
                       da 0.1171875 clavado) y cae a la logarítmica si C(n,k)
                       se sale de rango o el producto subdesborda.

   CASOS DEGENERADOS BLINDADOS
   binomPMF   p = 0 → concentra toda la masa en k = 0; p = 1 → en k = n.
   poissonPMF lam = 0 → concentra toda la masa en k = 0.
   negbinPMF  p = 1 → concentra toda la masa en k = 0 (ningún fracaso).
   Los tres casos daban NaN por el término 0·log 0 y son alcanzables desde la
   interfaz (los campos aceptan p ∈ [0,1] y λ ≥ 0). */
/**
 * Tipado laxo del kernel numérico: el baseline es JS sin tipos y el port es
 * fiel línea a línea. La superficie pública queda tipada en `MathLib`.
 */
type Loose = any;

/** Matriz densa (arreglo de filas), como la usa el baseline. */
export type Matrix = number[][];

/** Superficie pública de `window.M` (nombres del baseline, sin renombrar). */
export interface MathLib {
  // gamma / combinatoria
  lgamma(z: number): number;
  gammafn(z: number): number;
  comb(n: number, k: number): number;
  combExact(n: number, k: number): number;
  combLog(n: number, k: number): number;
  lfact(n: number): number;
  // normal
  erf(x: number): number;
  erfc(x: number): number;
  normPDF(x: number, mu?: number, sigma?: number): number;
  normCDF(x: number, mu?: number, sigma?: number): number;
  normSF(x: number, mu?: number, sigma?: number): number;
  normInv(p: number, mu?: number, sigma?: number): number;
  // gamma incompleta / chi cuadrado
  gammp(a: number, x: number): number;
  gammaSF(x: number, a: number, lam: number): number;
  chi2PDF(x: number, k: number): number;
  chi2CDF(x: number, k: number): number;
  chi2Inv(p: number, k: number): number;
  // beta incompleta / t de Student
  betai(a: number, b: number, x: number): number;
  tPDF(t: number, df: number): number;
  tCDF(t: number, df: number): number;
  tInv(p: number, df: number): number;
  // discretas
  binomPMF(k: number, n: number, p: number): number;
  poissonPMF(k: number, lam: number): number;
  hyperPMF(k: number, N: number, M: number, n: number): number;
  geomPMF(k: number, p: number): number;
  negbinPMF(k: number, r: number, p: number): number;
  binomCDF(k: number, n: number, p: number): number;
  poissonCDF(k: number, lam: number): number;
  hyperCDF(k: number, N: number, M: number, n: number): number;
  geomCDF(k: number, p: number): number;
  negbinCDF(k: number, r: number, p: number): number;
  binomSF(k: number, n: number, p: number): number;
  poissonSF(k: number, lam: number): number;
  binomInv(p: number, n: number, pr: number): number;
  poissonInv(p: number, lam: number): number;
  // continuas básicas
  expPDF(x: number, lam: number): number;
  expCDF(x: number, lam: number): number;
  uniformCDF(x: number, a: number, b: number): number;
  // muestra
  meanOf(xs: number[]): number;
  sampleSD(xs: number[]): number;
  // álgebra lineal (cadenas de Markov) e integración
  eye(n: number): Matrix;
  matMul(A: Matrix, B: Matrix): Matrix;
  matPow(A: Matrix, e: number): Matrix;
  transpose(A: Matrix): Matrix;
  solveLinear(A: Matrix, b: number[]): number[] | null;
  matInverse(A: Matrix): Matrix | null;
  stationary(P: Matrix): number[] | null;
  integrate(f: (x: number) => number, a: number, b: number, n?: number): number;
}

/** Crea el objeto `M` del baseline (`window.M`). Puro: no toca el DOM. */
export function createMath(): MathLib {

  // ---- log Gamma (Lanczos) ----
  const G = 7;
  const C: Loose = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];
  function lgamma(z?: any): any {
    if (z < 0.5) {
      // reflexión
      return Math.log(Math.PI / Math.sin(Math.PI * z)) - lgamma(1 - z);
    }
    z -= 1;
    let x = C[0];
    for (let i = 1; i < G + 2; i++) x += C[i] / (z + i);
    const t = z + G + 0.5;
    return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
  }
  function gammafn(z?: any): any {
    if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gammafn(1 - z));
    return Math.exp(lgamma(z));
  }
  // log factorial / combinatoria estable
  function lfact(n?: any): any { return lgamma(n + 1); }
  function comb(n?: any, k?: any): any {
    if (k < 0 || k > n) return 0;
    return Math.round(Math.exp(lfact(n) - lfact(k) - lfact(n - k)));
  }
  function combLog(n?: any, k?: any): any { return lfact(n) - lfact(k) - lfact(n - k); }
  // C(n,k) EXACTO por producto multiplicativo, o NaN si se sale del rango en
  // que un entero de JS es exacto (2^53). A diferencia de comb(), que redondea
  // un exp(log), aquí no hay error de redondeo intermedio: cada producto
  // parcial C(n-k+i, i) es entero.
  function combExact(n?: any, k?: any): any {
    if (!(n >= 0) || !(k >= 0) || k > n || Math.floor(n) !== n || Math.floor(k) !== k) return NaN;
    if (k > n - k) k = n - k;
    let r = 1;
    for (let i = 1; i <= k; i++) {
      const t = r * (n - k + i);
      if (!(t <= 9007199254740992)) return NaN;   // 2^53: más allá el entero deja de ser exacto
      r = t / i;                                  // exacto: el cociente vuelve a ser entero
    }
    return r;
  }

  // ---- erf / erfc / función normal ----
  // erfc de PRECISIÓN DOBLE: aproximaciones racionales por tramos de W. J.
  // Cody (1969), con la misma partición que CALERF de SPECFUN (|x| ≤ 0.46875,
  // ≤ 4, > 4). El error relativo queda en el orden de 1e-16 en todo el eje,
  // incluidas las colas, hasta que erfc subdesborda (x ≈ 26.5, o sea z ≈ 37.5).
  //
  // Reemplaza a la fórmula 7.1.26 de Abramowitz & Stegun, cuyo error ABSOLUTO
  // de 1.5e-7 se volvía error RELATIVO grande en las colas: Φ(−6) salía con
  // tres cifras significativas y solo dos correctas, y el fractil z_{0.9999}
  // tenía el cuarto decimal falso. Toda la cola normal se calcula ahora con
  // erfc directa (nunca como 1 − Φ), así que no hay cancelación.
  const ERF_A: Loose = [3.16112374387056560e0, 1.13864154151050156e2, 3.77485237685302021e2, 3.20937758913846947e3, 1.85777706184603153e-1];
  const ERF_B: Loose = [2.36012909523441209e1, 2.44024637934444173e2, 1.28261652607737228e3, 2.84423683343917062e3];
  const ERF_C: Loose = [5.64188496988670089e-1, 8.88314979438837594e0, 6.61191906371416295e1, 2.98635138197400131e2, 8.81952221241769090e2, 1.71204761263407058e3, 2.05107837782607147e3, 1.23033935479799725e3, 2.15311535474403846e-8];
  const ERF_D: Loose = [1.57449261107098347e1, 1.17693950891312499e2, 5.37181101862009858e2, 1.62138957456669019e3, 3.29079923573345963e3, 4.36261909014324716e3, 3.43936767414372164e3, 1.23033935480374942e3];
  const ERF_P: Loose = [3.05326634961232344e-1, 3.60344899949804439e-1, 1.25781726111229246e-1, 1.60837851487422766e-2, 6.58749161529837803e-4, 1.63153871373020978e-2];
  const ERF_Q: Loose = [2.56852019228982242e0, 1.87295284992346047e0, 5.27905102951428412e-1, 6.05183413124413191e-2, 2.33520497626869185e-3];
  const SQRPI = 5.6418958354775628695e-1;   // 1/√π
  const ERF_THRESH = 0.46875, ERF_XSMALL = 1.11e-16, ERF_XBIG = 26.543;

  // calerf(x, 0) → erf(x) · calerf(x, 1) → erfc(x)
  function calerf(x?: any, jint?: any): any {
    if (x !== x) return NaN;
    const y = Math.abs(x);
    let res, xnum, xden, ysq, del, i;
    if (y <= ERF_THRESH) {
      ysq = y > ERF_XSMALL ? y * y : 0;
      xnum = ERF_A[4] * ysq; xden = ysq;
      for (i = 0; i < 3; i++) { xnum = (xnum + ERF_A[i]) * ysq; xden = (xden + ERF_B[i]) * ysq; }
      res = x * (xnum + ERF_A[3]) / (xden + ERF_B[3]);   // erf(x) en el tramo central
      return jint === 0 ? res : 1 - res;
    }
    if (y <= 4) {
      xnum = ERF_C[8] * y; xden = y;
      for (i = 0; i < 7; i++) { xnum = (xnum + ERF_C[i]) * y; xden = (xden + ERF_D[i]) * y; }
      res = (xnum + ERF_C[7]) / (xden + ERF_D[7]);
    } else if (y >= ERF_XBIG) {
      res = 0;                                            // erfc subdesborda
    } else {
      ysq = 1 / (y * y);
      xnum = ERF_P[5] * ysq; xden = ysq;
      for (i = 0; i < 4; i++) { xnum = (xnum + ERF_P[i]) * ysq; xden = (xden + ERF_Q[i]) * ysq; }
      res = ysq * (xnum + ERF_P[4]) / (xden + ERF_Q[4]);
      res = (SQRPI - res) / y;
    }
    if (res !== 0) {
      // exp(−y²) partido en dos factores: el truncado a múltiplos de 1/16 se
      // eleva sin error de redondeo y el resto es chico. Es lo que conserva
      // las cifras de la cola.
      ysq = Math.floor(y * 16) / 16;
      del = (y - ysq) * (y + ysq);
      res = Math.exp(-ysq * ysq) * Math.exp(-del) * res;   // erfc(|x|)
    }
    if (jint === 0) return x < 0 ? res - 1 : 1 - res;      // erf(x)
    return x < 0 ? 2 - res : res;                          // erfc(x)
  }
  function erf(x?: any): any { return calerf(x, 0); }
  function erfc(x?: any): any { return calerf(x, 1); }

  function normPDF(x?: any, mu?: any, sigma?: any): any {
    mu = mu || 0; sigma = sigma == null ? 1 : sigma;
    const z = (x - mu) / sigma;
    return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI));
  }
  // Φ(x) = P(X ≤ x). Se arma con erfc para que la cola izquierda conserve sus
  // cifras significativas (Φ(−6) = 9.8659e-10 y no un valor con dos cifras).
  function normCDF(x?: any, mu?: any, sigma?: any): any {
    mu = mu || 0; sigma = sigma == null ? 1 : sigma;
    return 0.5 * erfc(-((x - mu) / sigma) / Math.SQRT2);
  }
  // Cola SUPERIOR P(X > x), calculada directamente: 1 − Φ(x) perdería todos
  // los dígitos justo donde hace falta (valores-p, α de cola lejana).
  function normSF(x?: any, mu?: any, sigma?: any): any {
    mu = mu || 0; sigma = sigma == null ? 1 : sigma;
    return 0.5 * erfc(((x - mu) / sigma) / Math.SQRT2);
  }
  // inversa de Φ (Acklam) + refinamiento Halley
  function normInv(p?: any, mu?: any, sigma?: any): any {
    mu = mu || 0; sigma = sigma == null ? 1 : sigma;
    if (p <= 0) return -Infinity;
    if (p >= 1) return Infinity;
    const a: Loose = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
    const b: Loose = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
    const c: Loose = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
    const d: Loose = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];
    const pl = 0.02425, ph = 1 - pl;
    let x;
    if (p < pl) {
      const q = Math.sqrt(-2 * Math.log(p));
      x = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    } else if (p <= ph) {
      const q = p - 0.5, r = q * q;
      x = (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
    } else {
      const q = Math.sqrt(-2 * Math.log(1 - p));
      x = -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    }
    // Un paso de Halley. Arriba de 0.5 el residuo se arma con la cola superior:
    // Φ(x) − p restaría dos números casi iguales y se comería justamente las
    // cifras que el fractil de la cola necesita.
    const e = p > 0.5 ? (1 - p) - normSF(x) : normCDF(x) - p;
    const u = e * Math.sqrt(2 * Math.PI) * Math.exp(x * x / 2);
    // En p extremos (|x| > 37) exp(x²/2) desborda; ahí Acklam sola ya da
    // 1e-9 relativo y el paso se omite antes que devolver NaN.
    if (isFinite(u)) x = x - u / (1 + x * u / 2);
    return mu + sigma * x;
  }

  // ---- gamma incompleta regularizada (para χ²) ----
  function gammp(a?: any, x?: any): any {
    if (x <= 0) return 0;
    if (x < a + 1) {
      // serie
      let ap = a, sum = 1 / a, del = sum;
      for (let n = 0; n < 200; n++) {
        ap += 1; del *= x / ap; sum += del;
        if (Math.abs(del) < Math.abs(sum) * 1e-12) break;
      }
      return sum * Math.exp(-x + a * Math.log(x) - lgamma(a));
    }
    // fracción continua (gammq = 1 - gammp)
    const FPMIN = 1e-300;
    let b = x + 1 - a, c = 1 / FPMIN, d = 1 / b, h = d;
    for (let i = 1; i < 200; i++) {
      const an = -i * (i - a);
      b += 2;
      d = an * d + b; if (Math.abs(d) < FPMIN) d = FPMIN;
      c = b + an / c; if (Math.abs(c) < FPMIN) c = FPMIN;
      d = 1 / d; const del = d * c; h *= del;
      if (Math.abs(del - 1) < 1e-12) break;
    }
    const q = Math.exp(-x + a * Math.log(x) - lgamma(a)) * h;
    return 1 - q;
  }

  // gammaSF(x, a, lam) → cola SUPERIOR P(X > x) de una Gamma(forma a, tasa lam),
  // por fracción continua directa de la gamma incompleta en vez de 1 − gammp:
  // lejos de la media esa resta cancela todas las cifras y colapsa a 0 donde el
  // valor es diminuto pero no nulo. Para lam·x < a+1 no hay cancelación y
  // alcanza con el complemento.
  function gammaSF(x?: any, a?: any, lam?: any): any {
    if (x <= 0) return 1;
    const y = lam * x;
    if (y < a + 1) return 1 - gammp(a, y);
    const FPMIN = 1e-300;
    let b = y + 1 - a, c = 1 / FPMIN, d = 1 / b, h = d;
    for (let i = 1; i < 300; i++) {
      const an = -i * (i - a);
      b += 2;
      d = an * d + b; if (Math.abs(d) < FPMIN) d = FPMIN;
      c = b + an / c; if (Math.abs(c) < FPMIN) c = FPMIN;
      d = 1 / d; const del = d * c; h *= del;
      if (Math.abs(del - 1) < 1e-13) break;
    }
    return Math.exp(-y + a * Math.log(y) - lgamma(a)) * h;
  }
  function chi2PDF(x?: any, k?: any): any {
    if (x <= 0) return 0;
    return Math.exp((k / 2 - 1) * Math.log(x) - x / 2 - (k / 2) * Math.log(2) - lgamma(k / 2));
  }
  function chi2CDF(x?: any, k?: any): any { return gammp(k / 2, x / 2); }
  function chi2Inv(p?: any, k?: any): any {
    if (p <= 0) return 0;
    if (p >= 1) return Infinity;
    let lo = 0, hi = Math.max(20, k * 4 + 40);
    while (chi2CDF(hi, k) < p) hi *= 2;
    for (let i = 0; i < 200; i++) {
      const mid = (lo + hi) / 2;
      if (chi2CDF(mid, k) < p) lo = mid; else hi = mid;
    }
    return (lo + hi) / 2;
  }

  // ---- beta incompleta regularizada (para t de Student) ----
  function betacf(a?: any, b?: any, x?: any): any {
    const FPMIN = 1e-300;
    let qab = a + b, qap = a + 1, qam = a - 1;
    let c = 1, d = 1 - qab * x / qap;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    d = 1 / d; let h = d;
    for (let m = 1; m <= 200; m++) {
      const m2 = 2 * m;
      let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN;
      c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN;
      d = 1 / d; h *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN;
      c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN;
      d = 1 / d; const del = d * c; h *= del;
      if (Math.abs(del - 1) < 1e-12) break;
    }
    return h;
  }
  function betai(a?: any, b?: any, x?: any): any {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    const bt = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x));
    if (x < (a + 1) / (a + b + 2)) return bt * betacf(a, b, x) / a;
    return 1 - bt * betacf(b, a, 1 - x) / b;
  }
  function tPDF(t?: any, df?: any): any {
    return Math.exp(lgamma((df + 1) / 2) - lgamma(df / 2) - 0.5 * Math.log(df * Math.PI) - ((df + 1) / 2) * Math.log(1 + t * t / df));
  }
  function tCDF(t?: any, df?: any): any {
    const x = df / (df + t * t);
    const p = 0.5 * betai(df / 2, 0.5, x);
    return t > 0 ? 1 - p : p;
  }
  function tInv(p?: any, df?: any): any {
    if (p <= 0) return -Infinity;
    if (p >= 1) return Infinity;
    // El corchete se ABRE hasta contener la raíz, como en `chi2Inv`. Con [-1000,
    // 1000] fijo, una cola extrema de pocos grados de libertad devolvía el
    // extremo en silencio: t_{0.9999, 1} = 3183.0988 salía 1000.
    let lo = -1000, hi = 1000;
    while (tCDF(hi, df) < p && hi < 1e300) { hi *= 2; lo = -hi; }
    while (tCDF(lo, df) > p && lo > -1e300) { lo *= 2; hi = -lo; }
    for (let i = 0; i < 200; i++) {
      const mid = (lo + hi) / 2;
      if (tCDF(mid, df) < p) lo = mid; else hi = mid;
    }
    return (lo + hi) / 2;
  }

  // ---- pmf/pdf helpers ----
  function binomPMF(k?: any, n?: any, p?: any): any {
    if (k < 0 || k > n) return 0;
    if (p === 0) return k === 0 ? 1 : 0;   // degenerada en 0 (sin pasar por log 0)
    if (p === 1) return k === n ? 1 : 0;   // degenerada en n
    // Vía directa mientras C(n,k) sea un entero exacto: Bi(10; 0.5) en k = 3 da
    // 0.1171875 clavado, y no el 0.11718749999… que devuelve exp(log C + …) y
    // que al imprimirse con 6 decimales cambia el último dígito.
    const c = combExact(n, k);
    if (c === c) {
      const v = c * Math.pow(p, k) * Math.pow(1 - p, n - k);
      if (v > 0 && isFinite(v)) return v;  // v = 0 solo por subdesbordamiento: se usa la vía logarítmica
    }
    return Math.exp(combLog(n, k) + k * Math.log(p) + (n - k) * Math.log(1 - p));
  }
  function poissonPMF(k?: any, lam?: any): any {
    if (k < 0) return 0;
    if (lam === 0) return k === 0 ? 1 : 0; // degenerada en 0 (sin pasar por log 0)
    return Math.exp(k * Math.log(lam) - lam - lfact(k));
  }
  function hyperPMF(k?: any, N?: any, M?: any, n?: any): any {
    const lo = Math.max(0, n - (N - M)), hi = Math.min(n, M);
    if (k < lo || k > hi) return 0;
    return Math.exp(combLog(M, k) + combLog(N - M, n - k) - combLog(N, n));
  }
  // geométrica que cuenta FRACASOS antes del primer éxito (convención de la cátedra): soporte N₀
  function geomPMF(k?: any, p?: any): any { if (k < 0) return 0; return p * Math.pow(1 - p, k); }
  // binomial negativa que cuenta FRACASOS antes del r-ésimo éxito: soporte N₀
  function negbinPMF(k?: any, r?: any, p?: any): any {
    if (k < 0) return 0;
    if (p === 1) return k === 0 ? 1 : 0;   // con p = 1 nunca hay fracasos
    if (p === 0) return 0;                 // con p = 0 nunca se alcanza el r-ésimo éxito
    return Math.exp(combLog(k + r - 1, k) + r * Math.log(p) + k * Math.log(1 - p));
  }

  // ---- CDF discretas: P(X ≤ k) sumando la PMF (estable para los rangos del curso) ----
  function binomCDF(k?: any, n?: any, p?: any): any { k = Math.floor(k); if (k < 0) return 0; if (k >= n) return 1; let s = 0; for (let i = 0; i <= k; i++) s += binomPMF(i, n, p); return Math.min(1, s); }
  function poissonCDF(k?: any, lam?: any): any { k = Math.floor(k); if (k < 0) return 0; let s = 0; for (let i = 0; i <= k; i++) s += poissonPMF(i, lam); return Math.min(1, s); }
  function hyperCDF(k?: any, N?: any, M?: any, n?: any): any { k = Math.floor(k); const hi = Math.min(n, M); if (k >= hi) return 1; let s = 0; for (let i = 0; i <= k; i++) s += hyperPMF(i, N, M, n); return Math.min(1, s); }
  function geomCDF(k?: any, p?: any): any { k = Math.floor(k); if (k < 0) return 0; return 1 - Math.pow(1 - p, k + 1); }       // P(X ≤ k), conteo de fracasos
  function negbinCDF(k?: any, r?: any, p?: any): any { k = Math.floor(k); if (k < 0) return 0; let s = 0; for (let i = 0; i <= k; i++) s += negbinPMF(i, r, p); return Math.min(1, s); }

  // ---- colas superiores P(X ≥ k) por suma directa (sin la cancelación de 1 − CDF(k−1)) ----
  function binomSF(k?: any, n?: any, p?: any): any {
    k = Math.ceil(k);
    if (k <= 0) return 1;
    if (k > n) return 0;
    let s = 0;
    for (let i = k; i <= n; i++) s += binomPMF(i, n, p);
    return Math.min(1, s);
  }
  function poissonSF(k?: any, lam?: any): any {
    k = Math.ceil(k);
    if (k <= 0) return 1;
    if (!(lam >= 0)) return NaN;
    if (lam === 0) return 0;               // X ≡ 0, así que P(X ≥ k) = 0 para k ≥ 1
    let s = 0;
    // Cota generosa: la masa de Poisson es despreciable bastante antes de este punto.
    const top = Math.max(k, lam) + 12 * Math.sqrt(lam + 1) + 1200;
    for (let i = k; i <= top; i++) {
      const term = poissonPMF(i, lam);
      s += term;
      if (i > lam && (term === 0 || term < s * 1e-17)) break;
    }
    return Math.min(1, s);
  }

  // ---- cuantiles discretos: menor k con P(X ≤ k) ≥ p ----
  function binomInv(p?: any, n?: any, pr?: any): any {
    n = Math.floor(n);
    if (!(n >= 0) || !(p >= 0) || p > 1) return NaN;
    if (p <= 0) return 0;
    if (p >= 1) return n;
    let acc = 0;
    for (let k = 0; k <= n; k++) {
      acc += binomPMF(k, n, pr);
      if (acc >= p) return k;
    }
    return n;                              // redondeo: la CDF llega a 1 en k = n
  }
  function poissonInv(p?: any, lam?: any): any {
    if (!(lam >= 0) || !(p >= 0) || p > 1) return NaN;
    if (p <= 0) return 0;
    if (p >= 1) return Infinity;           // el soporte de Poisson no está acotado
    let acc = 0;
    const top = lam + 12 * Math.sqrt(lam + 1) + 1200;
    for (let k = 0; k <= top; k++) {
      acc += poissonPMF(k, lam);
      if (acc >= p) return k;
    }
    return Math.ceil(top);
  }

  // ---- continuas básicas ----
  function expPDF(x?: any, lam?: any): any { return x < 0 ? 0 : lam * Math.exp(-lam * x); }
  function expCDF(x?: any, lam?: any): any { return x < 0 ? 0 : 1 - Math.exp(-lam * x); }
  function uniformCDF(x?: any, a?: any, b?: any): any { if (x <= a) return 0; if (x >= b) return 1; return (x - a) / (b - a); }

  // media y desvío muestral de un array (para calculadoras de inferencia)
  function meanOf(xs?: any): any { return xs.reduce((a: number, b: number) => a + b, 0) / xs.length; }
  function sampleSD(xs?: any): any { const m = meanOf(xs); const s2 = xs.reduce((a: number, b: number) => a + (b - m) * (b - m), 0) / (xs.length - 1); return Math.sqrt(s2); }

  // ============================================================
  //  Álgebra lineal mínima (para cadenas de Markov)
  // ============================================================
  function eye(n?: any): any { const I: Loose = []; for (let i = 0; i < n; i++) { I.push([]); for (let j = 0; j < n; j++) I[i].push(i === j ? 1 : 0); } return I; }
  function matMul(A?: any, B?: any): any {
    const n = A.length, m = B[0].length, p = B.length, C: Loose = [];
    for (let i = 0; i < n; i++) { C.push([]); for (let j = 0; j < m; j++) { let s = 0; for (let k = 0; k < p; k++) s += A[i][k] * B[k][j]; C[i].push(s); } }
    return C;
  }
  function matPow(A?: any, e?: any): any { // exponenciación binaria, e entero ≥ 0
    let R = eye(A.length), base = A.map((r: Loose) => r.slice());
    e = Math.max(0, Math.floor(e));
    while (e > 0) { if (e & 1) R = matMul(R, base); base = matMul(base, base); e = Math.floor(e / 2); }
    return R;
  }
  function transpose(A?: any): any { const n = A.length, m = A[0].length, T: Loose = []; for (let j = 0; j < m; j++) { T.push([]); for (let i = 0; i < n; i++) T[j].push(A[i][j]); } return T; }
  // resuelve A x = b por eliminación gaussiana con pivoteo parcial; null si singular
  function solveLinear(A?: any, b?: any): any {
    const n = A.length;
    const M: Loose = A.map((r: Loose, i: number) => r.slice().concat([b[i]]));
    for (let col = 0; col < n; col++) {
      let piv = col;
      for (let r = col + 1; r < n; r++) if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r;
      if (Math.abs(M[piv][col]) < 1e-12) return null;
      const tmp = M[piv]; M[piv] = M[col]; M[col] = tmp;
      for (let r = 0; r < n; r++) {
        if (r === col) continue;
        const f = M[r][col] / M[col][col];
        for (let c = col; c <= n; c++) M[r][c] -= f * M[col][c];
      }
    }
    const x = []; for (let i = 0; i < n; i++) x.push(M[i][n] / M[i][i]); return x;
  }
  // inversa por Gauss-Jordan; null si singular
  function matInverse(A?: any): any {
    const n = A.length;
    const M: Loose = A.map((r: Loose, i: number) => r.slice().concat(eye(n)[i]));
    for (let col = 0; col < n; col++) {
      let piv = col;
      for (let r = col + 1; r < n; r++) if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r;
      if (Math.abs(M[piv][col]) < 1e-12) return null;
      const tmp = M[piv]; M[piv] = M[col]; M[col] = tmp;
      const pivVal = M[col][col];
      for (let c = 0; c < 2 * n; c++) M[col][c] /= pivVal;
      for (let r = 0; r < n; r++) {
        if (r === col) continue;
        const f = M[r][col];
        for (let c = 0; c < 2 * n; c++) M[r][c] -= f * M[col][c];
      }
    }
    return M.map((r: Loose) => r.slice(n));
  }
  // distribución estacionaria π: resuelve πP=π con Σπ=1 (reemplaza una ecuación por la normalización)
  function stationary(P?: any): any {
    const n = P.length;
    // (Pᵀ − I) π = 0  →  A π = 0; sustituimos la última fila por Σπ = 1
    const Pt = transpose(P), A: Loose = [];
    for (let i = 0; i < n; i++) { A.push([]); for (let j = 0; j < n; j++) A[i].push(Pt[i][j] - (i === j ? 1 : 0)); }
    const b = new Array(n).fill(0);
    for (let j = 0; j < n; j++) A[n - 1][j] = 1;
    b[n - 1] = 1;
    return solveLinear(A, b);
  }

  // integración numérica (Simpson compuesto) — para E[T] = ∫ R(t) dt
  function integrate(f?: any, a?: any, b?: any, n?: any): any {
    n = n || 2000; if (n % 2) n++;
    const h = (b - a) / n; let s = f(a) + f(b);
    for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * h);
    return s * h / 3;
  }

  const M: MathLib = {
    lgamma, gammafn, comb, combExact, combLog, lfact,
    erf, erfc, normPDF, normCDF, normSF, normInv,
    gammp, gammaSF, chi2PDF, chi2CDF, chi2Inv,
    betai, tPDF, tCDF, tInv,
    binomPMF, poissonPMF, hyperPMF, geomPMF, negbinPMF,
    binomCDF, poissonCDF, hyperCDF, geomCDF, negbinCDF,
    binomSF, poissonSF, binomInv, poissonInv,
    expPDF, expCDF, uniformCDF,
    meanOf, sampleSD,
    eye, matMul, matPow, transpose, solveLinear, matInverse, stationary, integrate,
  };

  return M;
}
