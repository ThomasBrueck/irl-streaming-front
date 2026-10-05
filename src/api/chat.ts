import api from "../lib/axios";

export interface ChatMessageDto {
  streamId: string;
  userId: string;
  username: string;
  content: string;
  createdAt?: string;
}

/** Loads the recent chat history so viewers joining late have context. */
export async function getChatHistory(streamId: number): Promise<ChatMessageDto[]> {
  const res = await api.get<ChatMessageDto[]>(`/api/chat/${streamId}/history`);
  return res.data;
}
