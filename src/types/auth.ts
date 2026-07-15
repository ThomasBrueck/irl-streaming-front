export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  passwordConfirm: string;
  displayName?: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  role: string;
  token?: string;
}
