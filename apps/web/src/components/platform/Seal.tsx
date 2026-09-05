export function Seal({ size = 34, title = "Sinapsis" }: { size?: number; title?: string }) {
  return (
    <span role="img" aria-label={title} style={{ width: size, height: size, borderRadius: "50%", background: "var(--primary)", display: "inline-grid", placeItems: "center", boxShadow: "var(--relief), var(--shadow-ctrl)" }}>
      <span style={{ width: size * 0.76, height: size * 0.76, borderRadius: "50%", border: "1.5px solid var(--accent)", display: "grid", placeItems: "center", fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 600, fontSize: size * 0.44, color: "var(--on-primary)", lineHeight: 1 }}>S</span>
    </span>
  );
}
