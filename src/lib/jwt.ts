import { decodeJwt } from "jose";

export interface TokenPayload {
  sub: string;
  username: string;
  role: string;
  exp: number;
  iat: number;
}

/** Decodes (without verifying — the server already did) our own access token. */
export function decodeToken(token: string): TokenPayload | null {
  try {
    const payload = decodeJwt(token) as unknown as TokenPayload;
    if (!payload || !payload.sub || !payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload) return true;
  return payload.exp * 1000 <= Date.now();
}
