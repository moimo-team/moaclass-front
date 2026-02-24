import type { ChatMessage, ChatMessageResponse, ChatRoom } from '@/models/chat.model';

import { chatApiClient } from './client';

type JoinChatRoomRequest =
	| { meetingId: number }
	| { lessonId: number; studentId?: number }
	| { lessonId: number; studentId: number };

// 오류 방지를 위해 삭제하지 않음
type JoinChatRoomResponse = {
	roomId: number;
	meetingId?: number;
	lessonId?: number;
};

// 백엔드 응답에 맞춘 타입
type RawJoinChatRoomResponse = {
	id?: number;
	roomId?: number;
	meetingId?: number | null;
	lessonId?: number | null;
};

type RawMyChatRoom = {
	roomId: number;
	meetingId: number | null;
	lessonId: number | null;
	title: string;
	displayTitle?: string;
	lastMessage: string | null;
	updatedAt: string;
	representativeImage: string | null;
};

// 내 채팅방 목록 조회
export const getMyChatRooms = async (): Promise<ChatRoom[]> => {
	const response = await chatApiClient.get<RawMyChatRoom[]>('/chats/rooms/me');
	return response.data.map((room) => ({
		roomId: room.roomId,
		meetingId: room.meetingId,
		lessonId: room.lessonId,
		title: room.title,
		displayTitle: room.displayTitle,
		lastMessage: room.lastMessage,
		updatedAt: room.updatedAt,
		representativeImage: room.representativeImage,
	}));
};

// 기존 호출부 호환용 alias
export const getChatRooms = getMyChatRooms;

// 채팅방 생성/조회
export const joinChatRoom = async (payload: JoinChatRoomRequest): Promise<JoinChatRoomResponse> => {
	const response = await chatApiClient.post<RawJoinChatRoomResponse>(
		'/chats/rooms/join',
		payload,
	);
	const raw = response.data;
	const roomId = raw.roomId ?? raw.id;

	if (typeof roomId !== 'number') {
		throw new Error('채팅방 ID가 응답에 없습니다.');
	}

	return {
		roomId,
		meetingId: raw.meetingId ?? undefined,
		lessonId: raw.lessonId ?? undefined,
	};
};

// 룸 메시지 내역 조회
export const getRoomMessages = async (roomId: number): Promise<ChatMessage[]> => {
	const response = await chatApiClient.get<ChatMessage[] | ChatMessageResponse>(
		`/chats/rooms/${roomId}/messages`,
	);
	const data = response.data;

	return Array.isArray(data) ? data : data.messages;
};
