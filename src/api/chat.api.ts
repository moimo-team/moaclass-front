import type { ChatMessage, ChatMessageResponse, ChatRoom } from '@/models/chat.model';

import { chatApiClient } from './client';

type JoinChatRoomRequest =
	| { meetingId: number }
	| { lessonId: number; studentId?: number }
	| { lessonId: number; studentId: number };

type JoinChatRoomResponse = {
	roomId: number;
	meetingId?: number;
	lessonId?: number;
};

// 내 채팅방 목록 조회
export const getMyChatRooms = async (): Promise<ChatRoom[]> => {
	const response = await chatApiClient.get<ChatRoom[]>('/chats/rooms/me');
	return response.data;
};

// 기존 호출부 호환용 alias
export const getChatRooms = getMyChatRooms;

// 채팅방 생성/조회
export const joinChatRoom = async (payload: JoinChatRoomRequest): Promise<JoinChatRoomResponse> => {
	const response = await chatApiClient.post<JoinChatRoomResponse>('/chats/rooms/join', payload);
	return response.data;
};

// 룸 메시지 내역 조회
export const getRoomMessages = async (roomId: number): Promise<ChatMessage[]> => {
	const response = await chatApiClient.get<ChatMessage[] | ChatMessageResponse>(
		`/chats/rooms/${roomId}/messages`,
	);
	const data = response.data;

	return Array.isArray(data) ? data : data.messages;
};
