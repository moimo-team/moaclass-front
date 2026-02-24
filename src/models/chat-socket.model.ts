import type { ChatMessage } from '@/models/chat.model';

export type JoinRoomPayload = number;

export interface SendMessagePayload {
	roomId: number;
	content: string;
}

export type NewMessagePayload = ChatMessage;

export interface JoinRoomAck {
	status: 'success';
	roomId: number;
}

export interface SendMessageAck {
	status: 'sent';
	message: ChatMessage;
}
