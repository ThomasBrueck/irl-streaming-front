export interface StreamResponse {
  id: number;
  userID: number;
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
