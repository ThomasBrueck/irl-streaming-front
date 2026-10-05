import api from "../lib/axios";

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  displayName: string | null;
  createdAt: string;
}

export async function getUserById(id: number | string): Promise<UserResponse> {
  const res = await api.get<UserResponse>(`/api/users/${id}`);
  return res.data;
}
