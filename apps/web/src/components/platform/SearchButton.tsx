export function SearchButton({ onClick, label = "Buscar…", hint = "⌘K" }: { onClick?: () => void; label?: string; hint?: string }) {
  return <button type="button" onClick={onClick}>{label} <kbd>{hint}</kbd></button>;
}
