/**
 * Banco de pruebas del <DatePicker/>. SOLO en desarrollo: el router monta la
 * ruta /dev/datepicker dentro de `import.meta.env.DEV`, de modo que en el
 * paquete de producción esta rama muere con el `import()` dinámico dentro y el
 * archivo no llega a compilarse en ningún «chunk».
 *
 * Sirve para ver a mano lo que las pruebas no miran: la colocación cerca de los
 * bordes de la ventana, los tres temas y el ancho de 390 px.
 */
import { useState } from "react";
import type { ThemeId } from "@sinapsis/contract";
import { DatePicker } from "@/components/platform/DatePicker.tsx";
import { THEME_LABEL, useUiStore } from "@/lib/store";

const THEMES: ThemeId[] = ["pergamino", "laurel", "claustro"];

const page: React.CSSProperties = {
  minHeight: "100vh",
  background: "var(--bg)",
  color: "var(--text)",
  font: "400 13px/1.5 var(--font-ui)",
  padding: "24px 20px 120px",
};

const card: React.CSSProperties = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: "var(--r-lg)",
  boxShadow: "var(--shadow)",
  padding: "16px 18px",
  marginBottom: 14,
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const legend: React.CSSProperties = {
  font: "600 10.5px var(--font-ui)",
  letterSpacing: ".06em",
  textTransform: "uppercase",
  color: "var(--text-3)",
};

const out: React.CSSProperties = { font: "500 12px var(--font-mono)", color: "var(--text-2)" };

export function DatePickerPlayground() {
  const theme = useUiStore((s) => s.theme);
  const setTheme = useUiStore((s) => s.setTheme);
  const [vacia, setVacia] = useState<string | null>(null);
  const [conValor, setConValor] = useState<string | null>("2026-04-12");
  const [acotada, setAcotada] = useState<string | null>("2026-04-15");
  const [esquina, setEsquina] = useState<string | null>(null);

  return (
    <div style={page} data-dev-page="datepicker">
      <h1 style={{ font: "600 26px/1.2 var(--font-display)", margin: "0 0 4px" }}>DatePicker</h1>
      <p style={{ color: "var(--text-2)", margin: "0 0 18px", maxWidth: 520 }}>
        Banco de pruebas de desarrollo. El valor siempre es «AAAA-MM-DD» o null.
      </p>

      <div style={{ display: "flex", gap: 6, marginBottom: 18 }} role="group" aria-label="Tema">
        {THEMES.map((t) => (
          <button
            key={t}
            type="button"
            data-theme-btn={t}
            aria-pressed={theme === t}
            onClick={() => setTheme(t, { push: false })}
            style={{
              height: 28,
              padding: "0 12px",
              borderRadius: "var(--r-ctrl)",
              border: `1px solid ${theme === t ? "var(--primary)" : "var(--border-2)"}`,
              background: theme === t ? "var(--primary-soft)" : "var(--surface)",
              color: theme === t ? "var(--primary)" : "var(--text-2)",
              font: "600 12px var(--font-ui)",
              cursor: "pointer",
            }}
          >
            {THEME_LABEL[t]}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 520 }}>
        <div style={card} data-case="vacia">
          <span style={legend}>Vacía</span>
          <DatePicker value={vacia} onChange={setVacia} label="Fecha de entrega" />
          <span style={out} data-out="vacia">{String(vacia)}</span>
        </div>

        <div style={card} data-case="con-valor">
          <span style={legend}>Con valor · tamaño sm</span>
          <DatePicker value={conValor} onChange={setConValor} label="Inicio de la cursada" size="sm" />
          <span style={out} data-out="con-valor">{String(conValor)}</span>
        </div>

        <div style={card} data-case="acotada">
          <span style={legend}>Con min/max (10 – 20 de abril de 2026) y una deshabilitada</span>
          <DatePicker
            value={acotada}
            onChange={setAcotada}
            label="Fecha del parcial"
            min="2026-04-10"
            max="2026-04-20"
          />
          <span style={out} data-out="acotada">{String(acotada)}</span>
          <DatePicker value="2026-05-30" onChange={() => {}} label="Fecha del final" disabled />
        </div>
      </div>

      {/* Esquina inferior derecha: el caso en el que el calendario tiene que
          subir y pegarse al margen de 8 px para no salirse de la ventana. */}
      <div style={{ position: "fixed", right: 10, bottom: 10 }} data-case="esquina">
        <DatePicker value={esquina} onChange={setEsquina} label="Cerca del borde" size="sm" />
      </div>
    </div>
  );
}
