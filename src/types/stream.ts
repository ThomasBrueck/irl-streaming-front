import type { StreamCategory } from "../lib/categories";

export interface StreamResponse {
  id: number;
  userID: number;
  title: string;
  description: string | null;
  category: StreamCategory | null;
  status: "OFFLINE" | "LIVE";
  streamKey: string;
  viewerCount: number;
  createdAt: string;
}

export interface CreateStreamRequest {
  title: string;
  description?: string;
  category?: StreamCategory;
}

export type UpdateStreamRequest = CreateStreamRequest;

export interface LiveKitTokenResponse {
  token: string;
  url: string;
  roomName: string;
  identity: string;
  canPublish: boolean;
}
