import type { ChatRoom } from '@/models/chat.model';

import { chatApiClient } from './client';

// 채팅방 목록 조회
export const getChatRooms = async (): Promise<ChatRoom[]> => {
	const response = await chatApiClient.get<ChatRoom[]>('/chats/rooms');

	return response.data;
};
