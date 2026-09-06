/**
 * Bundle mínimo de la siembra E2E (modo demo): una vista y una figura.
 *
 * Es el ejemplo de `skills/sinapsis/reference/herramientas.md` reducido a lo que
 * las specs necesitan comprobar:
 *
 *   · la vista «demo» escribe un <h2> con el rótulo del manifiesto y monta un
 *     hueco de figura, así `/m/demo/t/demo` dibuja algo dentro de
 *     `.sinapsis-tool`;
 *   · la figura «demo-fig» dibuja un <canvas> y la usa la página del wiki que la
 *     siembra marca con `> [!figura] demo-fig`.
 *
 * Es JavaScript clásico contra `window.App`: sin módulos, sin build y sin más
 * dependencias que el runtime de la plataforma.
 */
(function () {
  "use strict";

  var App = window.App;

  /** Nodo con atributos y texto, sin concatenar marcado. */
  function el(tag, attrs, text) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (key) {
      node.setAttribute(key, attrs[key]);
    });
    if (text !== undefined) node.textContent = text;
    return node;
  }

  /** Dibuja una parábola en el canvas con el color del tema. */
  function draw(canvas, color, ink) {
    var context = canvas.getContext("2d");
    if (!context) return;
    var w = canvas.width;
    var h = canvas.height;

    context.clearRect(0, 0, w, h);
    context.strokeStyle = ink;
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(0, h - 1);
    context.lineTo(w, h - 1);
    context.stroke();

    context.strokeStyle = color;
    context.lineWidth = 3;
    context.beginPath();
    for (var i = 0; i <= 120; i += 1) {
      var t = i / 120;
      var x = t * w;
      var y = h - 8 - (h - 24) * (1 - Math.pow(2 * t - 1, 2));
      if (i === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.stroke();
  }

  // --- una vista: se abre en /m/<materia>/t/demo ----------------------------
  App.registerView("demo", function (main) {
    main.replaceChildren();

    var box = el("div", { class: "demo" });
    box.append(el("h2", {}, "Vista de demostración"));
    box.append(el("p", {}, "La vista y la figura salen del mismo bundle de la materia."));

    // El mismo marcado que emite el lector para `> [!figura] demo-fig`.
    var figure = el("figure", { class: "figura doc-figure demo-plot", "data-fig": "demo-fig" });
    figure.append(el("div", { class: "fig-host" }));
    box.append(figure);

    main.append(box);
    App.mountFigures(main);
    return function () {
      App.unmountFigures(main);
    };
  });

  // --- una figura: la usa el wiki con `> [!figura] demo-fig` ----------------
  App.registerFigure(
    "demo-fig",
    function (host, api) {
      var width = 480;
      var height = 180;

      var canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = "100%";
      canvas.style.height = height + "px";
      canvas.setAttribute("role", "img");
      canvas.setAttribute("aria-label", "Parábola de demostración");

      // Los colores salen del tema: la plataforma tiene tres y la figura se
      // vuelve a dibujar con cada cambio.
      draw(canvas, api.cssVar("--primary"), api.cssVar("--border"));
      host.replaceChildren(canvas);
    },
    { caption: "Parábola de demostración", height: 180 },
  );
})();
