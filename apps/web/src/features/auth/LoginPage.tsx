import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { routes } from "@sinapsis/contract";
import { api, qk } from "@/lib/api";
import { useMe } from "@/lib/auth";
import { isMockMode } from "@/mocks/dev-fixtures";
import { Button, Seal, ThemeToggle } from "@/components/platform";
import css from "./LoginPage.module.css";

const GSI_SRC = "https://accounts.google.com/gsi/client";

/** Carga el script de Google Identity Services una sola vez por documento. */
function loadGsi(): Promise<void> {
  if (typeof document === "undefined") return Promise.reject(new Error("sin documento"));
  if (window.google?.accounts?.id) return Promise.resolve();
  const existing = document.querySelector<HTMLScriptElement>(`script[src="${GSI_SRC}"]`);
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("no se pudo cargar Google")), { once: true });
    });
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = GSI_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("no se pudo cargar Google"));
    document.head.appendChild(script);
  });
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const qc = useQueryClient();
  const { data: me } = useMe();
  const gsiRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: string } | null)?.from ?? routes.landing();

  const config = useQuery({
    queryKey: qk.config,
    queryFn: () => (isMockMode() ? { googleClientId: null, devBypass: true } : api.config()),
    retry: false,
    staleTime: Infinity,
  });

  const finish = useCallback(async () => {
    await qc.invalidateQueries({ queryKey: qk.me });
    navigate(from, { replace: true });
  }, [from, navigate, qc]);

  const googleLogin = useMutation({
    mutationFn: (credential: string) => api.auth.google(credential),
    onSuccess: finish,
    onError: (e: Error) => setError(e.message || "No se pudo iniciar sesión con Google."),
  });

  const devLogin = useMutation({
    mutationFn: () => api.auth.dev(),
    onSuccess: finish,
    onError: (e: Error) => setError(e.message || "No se pudo iniciar la sesión de desarrollo."),
  });

  /* Si ya hay sesión, esta pantalla no tiene nada que hacer. */
  useEffect(() => {
    if (me) navigate(from, { replace: true });
  }, [me, from, navigate]);

  /* Botón de Google: solo si el servidor publica un Client ID. */
  const clientId = config.data?.googleClientId ?? null;
  useEffect(() => {
    if (!clientId || !gsiRef.current) return;
    let cancelled = false;
    loadGsi()
      .then(() => {
        if (cancelled || !gsiRef.current || !window.google) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => googleLogin.mutate(response.credential),
          cancel_on_tap_outside: true,
        });
        gsiRef.current.replaceChildren();
        window.google.accounts.id.renderButton(gsiRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          logo_alignment: "left",
          width: 316,
          locale: "es",
        });
      })
      .catch(() => {
        if (!cancelled) setError("No se pudo cargar el inicio de sesión de Google. Revise la conexión.");
      });
    return () => {
      cancelled = true;
    };
    // googleLogin es estable en la práctica; recrear el botón por su identidad
    // reiniciaría el widget en cada render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  const busy = googleLogin.isPending || devLogin.isPending;

  return (
    <div className={css.page}>
      <div style={{ position: "fixed", top: 12, right: 14 }}>
        <ThemeToggle />
      </div>

      <main className={css.card}>
        <Seal size={46} />
        <span className={css.eyebrow}>BIBLIOTECA PERSONAL</span>
        <h1 className={css.wordmark}>Sinapsis</h1>
        <p className={css.subtitle}>
          Sus materias, sus wikis y su progreso, en una sola mesa de estudio.
        </p>

        <div className={css.rule} />

        {error ? <div className={css.error}>{error}</div> : null}

        <div className={css.actions}>
          {config.isPending ? (
            <span className={css.note}>Conectando…</span>
          ) : (
            <>
              {clientId ? <div className={css.gsi} ref={gsiRef} /> : null}
              {config.data?.devBypass ? (
                <Button
                  variant={clientId ? "secondary" : "primary"}
                  onClick={() => devLogin.mutate()}
                  disabled={busy}
                >
                  Entrar como usuario de desarrollo
                </Button>
              ) : null}
              {!clientId && !config.data?.devBypass ? (
                <span className={css.note}>
                  {config.isError ? "El servidor no responde." : "No hay métodos de acceso configurados."}
                </span>
              ) : null}
            </>
          )}
        </div>

        <span className={css.foot}>Sinapsis · v0.0</span>
      </main>
    </div>
  );
}
