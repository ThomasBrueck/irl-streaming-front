import { createContext } from "react";
import type { LoginRequest, RegisterRequest } from "../types/auth";

export interface AuthUser {
  id: string;
  username: string;
  role: string;
}

export interface AuthContextType {
  token: string | null;
  user: AuthUser | null;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);
