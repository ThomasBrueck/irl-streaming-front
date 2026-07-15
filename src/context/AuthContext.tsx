import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import api from "../lib/axios";
import type { LoginRequest, RegisterRequest, AuthResponse } from "../types/auth";

interface AuthContextType {
  token: string | null;
  user: { id: number; username: string; email: string; role: string } | null;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("token")
  );
  const [user, setUser] = useState<AuthContextType["user"] | null>(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (data: LoginRequest) => {
    setLoading(true);
    try {
      const res = await api.post<AuthResponse>("/api/auth/login", data);
      const t = res.data.token!;
      localStorage.setItem("token", t);
      setToken(t);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    setLoading(true);
    try {
      const res = await api.post<AuthResponse>("/api/auth/register", data);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
      }
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
    <AuthContext.Provider value={{ token, user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside <AuthProvider>");
  return ctx;
}
