import api from "../lib/axios";
import type { LoginRequest, RegisterRequest, AuthResponse } from "../types/auth";

export async function login(data: LoginRequest): Promise<string> {
  const res = await api.post<AuthResponse>("/api/auth/login", data);
  return res.data.token!;
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>("/api/auth/register", data);
  return res.data;
}
