/**
 * Mapa de atajos del shell de materia (U19). Se abre con «?» desde cualquier
 * lado que no sea un campo de texto y es la ÚNICA documentación del teclado que
 * tiene la materia: lo que no esté en esta lista, no existe.
 *
 * Los rótulos usan los símbolos de macOS (⌘, ⇧) porque son los que muestra el
 * resto de la interfaz; en Windows y Linux el modificador es Ctrl y así lo dice
 * la nota del pie.
 */
import { Dialog } from "@/components/platform";
import css from "./ShortcutsDialog.module.css";

interface Shortcut {
  keys: string[];
  what: string;
}

interface Group {
  title: string;
  items: Shortcut[];
}

const GROUPS: Group[] = [
  {
    title: "En toda la materia",
    items: [
      { keys: ["⌘", "K"], what: "Buscar en la materia" },
      { keys: ["/"], what: "Buscar en la materia (una sola tecla)" },
      { keys: ["T"], what: "Cambiar de tema" },
      { keys: ["?"], what: "Abrir esta lista" },
      { keys: ["Esc"], what: "Cerrar lo que esté abierto" },
    ],
  },
  {
    title: "Pestañas",
    items: [
      { keys: ["⌘", "⇧", "]"], what: "Pestaña siguiente" },
      { keys: ["⌘", "⇧", "["], what: "Pestaña anterior" },
      { keys: ["⌘", "⇧", "W"], what: "Cerrar la pestaña activa" },
      { keys: ["←", "→"], what: "Recorrer las pestañas (con el foco en la barra)" },
    ],
  },
  {
    title: "Sesión de repaso",
    items: [
      { keys: ["Espacio"], what: "Ver u ocultar la respuesta" },
      { keys: ["1", "–", "4"], what: "Calificar la tarjeta" },
    ],
  },
  {
    title: "Quiz",
    items: [
      { keys: ["A", "–", "D"], what: "Elegir una opción" },
      { keys: ["1", "–", "8"], what: "Elegir una opción" },
      { keys: ["Intro"], what: "Pasar a la pregunta siguiente" },
    ],
  },
  {
    title: "Lector",
    items: [{ keys: ["⌘", "S"], what: "Guardar el apunte de la página" }],
  },
];

export function ShortcutsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onClose={onClose} eyebrow="TECLADO" title="Atajos de la materia" width={560}>
      <div className={css.groups}>
        {GROUPS.map((group) => (
          <section key={group.title} className={css.group}>
            <h3 className={css.groupTitle}>{group.title}</h3>
            <dl className={css.list}>
              {group.items.map((item) => (
                <div key={`${group.title}-${item.what}-${item.keys.join("")}`} className={css.row}>
                  <dt className={css.keys}>
                    {item.keys.map((key, i) =>
                      key === "–" ? (
                        <span key={i} className={css.range}>
                          a
                        </span>
                      ) : (
                        <kbd key={i} className={css.kbd}>
                          {key}
                        </kbd>
                      ),
                    )}
                  </dt>
                  <dd className={css.what}>{item.what}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
      <p className={css.note}>En Windows y Linux, ⌘ es Ctrl.</p>
    </Dialog>
  );
}
