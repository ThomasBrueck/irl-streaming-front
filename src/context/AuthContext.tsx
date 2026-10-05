import { useState, useCallback, type ReactNode } from "react";
import { login as apiLogin, register as apiRegister } from "../api/auth";
import { decodeToken, isTokenExpired } from "../lib/jwt";
import type { LoginRequest, RegisterRequest } from "../types/auth";
import { AuthContext, type AuthUser } from "./auth-context";

function userFromToken(token: string | null): AuthUser | null {
  if (!token || isTokenExpired(token)) return null;
  const payload = decodeToken(token);
  if (!payload) return null;
  return { id: payload.sub, username: payload.username, role: payload.role };
}

function readStoredToken(): string | null {
  const stored = localStorage.getItem("token");
  if (!stored) return null;
  if (isTokenExpired(stored)) {
    localStorage.removeItem("token");
    return null;
  }
  return stored;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(readStoredToken);
  const [user, setUser] = useState<AuthUser | null>(() => userFromToken(readStoredToken()));
  const [loading, setLoading] = useState(false);

  const applyToken = useCallback((t: string) => {
    localStorage.setItem("token", t);
    setToken(t);
    setUser(userFromToken(t));
  }, []);

  const login = useCallback(
    async (data: LoginRequest) => {
      setLoading(true);
      try {
        const token = await apiLogin(data);
        applyToken(token);
      } finally {
        setLoading(false);
      }
    },
    [applyToken]
  );

  const register = useCallback(async (data: RegisterRequest) => {
    setLoading(true);
    try {
      // The register endpoint never returns a session token — the account is
      // created and the user signs in explicitly right after (see Register.tsx).
      await apiRegister(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout, loading }}>{children}</AuthContext.Provider>
  );
}
