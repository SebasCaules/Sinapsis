/**
 * Verificación del ID token de Google (N0-4).
 *
 * `createGoogleVerifier` se inyecta en `createApp` para poder sustituirla en
 * los tests sin tocar la red.
 */
import { OAuth2Client } from "google-auth-library";

export interface GoogleIdentity {
  sub: string;
  email: string;
  name: string;
  picture: string | null;
}

export type GoogleVerifier = (credential: string) => Promise<GoogleIdentity | null>;

export function createGoogleVerifier(clientId: string): GoogleVerifier {
  const client = new OAuth2Client(clientId);
  return async (credential: string) => {
    let payload;
    try {
      const ticket = await client.verifyIdToken({ idToken: credential, audience: clientId });
      payload = ticket.getPayload();
    } catch {
      return null;
    }
    if (!payload?.sub || !payload.email) return null;
    if (payload.email_verified === false) return null;
    return {
      sub: payload.sub,
      email: payload.email,
      name: payload.name?.trim() || payload.email.split("@")[0] || "Usuario",
      picture: payload.picture ?? null,
    };
  };
}
