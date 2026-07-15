export interface StreamResponse {
  id: number;
  userId: number;
  title: string;
  description: string | null;
  category: string | null;
  status: "OFFLINE" | "LIVE";
  streamKey: string;
  viewerCount: number;
  createdAt: string;
}

export interface CreateStreamRequest {
  title: string;
  description?: string;
  category?: string;
}
