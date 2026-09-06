/*
 * Bundle de mentira de la materia de prueba (solo `?mock=1`).
 *
 * Es un script CLÁSICO contra `window.App`, exactamente como los bundles reales
 * (N0-41): sin imports, sin export, todo dentro de una IIFE. Registra lo mínimo
 * para poder mirar el shell de herramientas con los ojos:
 *
 *   - una vista, `explorador`, que escribe «Herramienta de prueba», muestra el
 *     `?arg=` de la URL, pide migas con `App.setCrumbs` y se redibuja sola al
 *     cambiar el tema (registra `App.setRedraw`);
 *   - una figura, `normal-densidad`, que es la que cita la página de mentira
 *     del lector con `> [!figura] normal-densidad`.
 *
 * Nada de HTML en cadenas: se arma con `document.createElement`, como cualquier
 * pieza de la plataforma.
 */
(function () {
  var App = window.App;
  if (!App || typeof App.registerView !== "function") return;

  function token(name, fallback) {
    try {
      var value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return value || fallback;
    } catch (e) {
      return fallback;
    }
  }

  App.registerView("explorador", function (main, arg) {
    function paint() {
      var ink = token("--text", "#222");
      var accent = token("--primary", "#7c2230");
      main.replaceChildren();

      var head = document.createElement("h1");
      head.textContent = "Herramienta de prueba";
      head.style.font = '600 26px var(--font-display), Georgia, serif';
      head.style.margin = "0 0 6px";
      head.style.color = ink;
      main.appendChild(head);

      var sub = document.createElement("p");
      sub.textContent = arg
        ? "Argumento de la URL: " + arg
        : "Sin argumento. Pruebe con ?arg=normal en la dirección.";
      sub.style.font = '500 13px var(--font-mono), monospace';
      sub.style.color = "var(--text-3)";
      sub.style.margin = "0 0 18px";
      main.appendChild(sub);

      /* Una barrita de color: alcanza para ver si el tema llegó a la vista. */
      var bar = document.createElement("div");
      bar.style.height = "8px";
      bar.style.borderRadius = "4px";
      bar.style.background = accent;
      bar.style.maxWidth = "320px";
      main.appendChild(bar);

      var clicks = 0;
      var button = document.createElement("button");
      button.type = "button";
      button.textContent = "Interacción de prueba: 0";
      button.style.marginTop = "18px";
      button.style.font = '600 12.5px var(--font-ui), system-ui, sans-serif';
      button.style.padding = "8px 14px";
      button.style.borderRadius = "9px";
      button.style.border = "1px solid var(--border-2)";
      button.style.background = "var(--surface-2)";
      button.style.color = ink;
      button.style.cursor = "pointer";
      button.addEventListener("click", function () {
        clicks += 1;
        button.textContent = "Interacción de prueba: " + clicks;
      });
      main.appendChild(button);
    }

    paint();

    if (typeof App.setCrumbs === "function") {
      App.setCrumbs([{ label: "Herramienta de prueba" }, { label: arg || "sin argumento" }]);
    }
    /* Al cambiar el tema el runtime llama acá: la vista se repinta sola y el
       host NO tiene que volver a montarla. */
    if (typeof App.setRedraw === "function") App.setRedraw(paint);

    return function () {
      if (typeof App.setRedraw === "function") App.setRedraw(null);
      main.replaceChildren();
    };
  });

  if (typeof App.registerFigure !== "function") return;

  App.registerFigure(
    "normal-densidad",
    function (host) {
      var NS = "http://www.w3.org/2000/svg";
      var svg = document.createElementNS(NS, "svg");
      svg.setAttribute("viewBox", "0 0 320 140");
      svg.setAttribute("role", "img");
      svg.setAttribute("aria-label", "Campana de la densidad normal (figura de prueba)");
      svg.style.width = "100%";
      svg.style.height = "auto";

      var axis = document.createElementNS(NS, "line");
      axis.setAttribute("x1", "10");
      axis.setAttribute("y1", "120");
      axis.setAttribute("x2", "310");
      axis.setAttribute("y2", "120");
      axis.setAttribute("stroke", token("--plot-axis", "#bbb"));
      svg.appendChild(axis);

      var points = [];
      for (var i = 0; i <= 60; i += 1) {
        var x = -3 + (i * 6) / 60;
        var y = Math.exp((-x * x) / 2);
        points.push(10 + ((x + 3) / 6) * 300 + "," + (120 - y * 95));
      }
      var curve = document.createElementNS(NS, "polyline");
      curve.setAttribute("points", points.join(" "));
      curve.setAttribute("fill", "none");
      curve.setAttribute("stroke", token("--primary", "#7c2230"));
      curve.setAttribute("stroke-width", "2");
      svg.appendChild(curve);

      host.appendChild(svg);
      return function () {
        host.replaceChildren();
      };
    },
    { caption: "Densidad de la normal estándar (figura de prueba).", height: 140 },
  );
})();
