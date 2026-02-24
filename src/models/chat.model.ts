export type ChatType = 'meeting' | 'lesson';

// 메세지 전송자 정보
export interface MessageSender {
	id: number;
	nickname: string;
	image: string;
}

// 채팅 메세지 타입
export interface ChatMessage {
	id: number;
	content: string;
	senderId: number;
	roomId: number;
	createdAt: string;
	sender: MessageSender;
}

// 메세지 목록 조회 API 응답
export interface ChatMessageResponse {
	roomId?: number;
	messages: ChatMessage[];
}

// 채팅방 목록 조회 API 응답
export interface ChatRoom {
	roomId: number;
	meetingId: number | null;
	lessonId: number | null;
	title: string;
	displayTitle?: string;
	lastMessage: string | null;
	updatedAt: string;
	representativeImage: string | null;
}
