import api from "../lib/axios";
import type { StreamResponse, CreateStreamRequest, UpdateStreamRequest, LiveKitTokenResponse } from "../types/stream";

interface Page<T> {
  content: T[];
  totalElements: number;
}

export async function getStreams(): Promise<StreamResponse[]> {
  const res = await api.get<Page<StreamResponse>>("/api/streams", { params: { page: 0, size: 100 } });
  return res.data.content;
}

export async function getStreamById(id: number): Promise<StreamResponse> {
  const res = await api.get<StreamResponse>(`/api/streams/${id}`);
  return res.data;
}

/** Each person has exactly one channel. Returns null if they haven't set one up yet. */
export async function getMyStream(userId: string | number): Promise<StreamResponse | null> {
  try {
    const res = await api.get<StreamResponse>(`/api/streams/user/${userId}`);
    return res.data;
  } catch (err) {
    if ((err as { response?: { status?: number } })?.response?.status === 404) return null;
    throw err;
  }
}

export async function createStream(data: CreateStreamRequest): Promise<StreamResponse> {
  const res = await api.post<StreamResponse>("/api/streams", data);
  return res.data;
}

export async function updateStream(id: number, data: UpdateStreamRequest): Promise<StreamResponse> {
  const res = await api.patch<StreamResponse>(`/api/streams/${id}`, data);
  return res.data;
}

export async function updateStreamStatus(id: number, status: "LIVE" | "OFFLINE"): Promise<StreamResponse> {
  const res = await api.patch<StreamResponse>(`/api/streams/${id}/status`, { status });
  return res.data;
}

/**
 * Requests a scoped access token for the video call from the backend.
 * Publish rights are decided server-side (only the channel owner can
 * broadcast) — never trust or derive this on the client.
 */
export async function getLiveKitToken(streamId: number, displayName?: string): Promise<LiveKitTokenResponse> {
  const res = await api.post<LiveKitTokenResponse>(`/api/streams/${streamId}/token`, { displayName });
  return res.data;
}
