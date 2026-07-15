import api from "../lib/axios";
import type { StreamResponse, CreateStreamRequest } from "../types/stream";

export async function getStreams(): Promise<StreamResponse[]> {
  const res = await api.get<StreamResponse[]>("/api/streams");
  return res.data;
}

export async function getStreamById(id: number): Promise<StreamResponse> {
  const res = await api.get<StreamResponse>(`/api/streams/${id}`);
  return res.data;
}

export async function createStream(data: CreateStreamRequest): Promise<StreamResponse> {
  const res = await api.post<StreamResponse>("/api/streams", data);
  return res.data;
}

export async function updateStreamStatus(id: number, status: "LIVE" | "OFFLINE"): Promise<StreamResponse> {
  const res = await api.patch<StreamResponse>(`/api/streams/${id}/status`, { status });
  return res.data;
}
