import { chatApiClient } from "./client";
import type { ChatRoom } from "@/models/chat.model";

// 채팅방 목록 조회
export const getChatRooms = async (): Promise<ChatRoom[]> => {
  const response = await chatApiClient.get<ChatRoom[]>("/chats/rooms");

  return response.data;
};
