import type { ChatMessage, ChatRoom } from '@/models/chat.model';

const BASE_CREATED_AT = '2026-02-21T10:00:00.000Z';

export const BASE_MEETING_ROOM: ChatRoom = {
	roomId: 101,
	meetingId: 10,
	lessonId: null,
	title: 'Weekend study meetup',
	representativeImage: null,
	lastMessage: 'Meeting notice',
	updatedAt: BASE_CREATED_AT,
};

export const BASE_LESSON_ROOM: ChatRoom = {
	roomId: 201,
	meetingId: null,
	lessonId: 20,
	title: 'One-day class inquiry',
	representativeImage: null,
	lastMessage: 'Please answer the inquiry',
	updatedAt: BASE_CREATED_AT,
};

export const createChatRoomFixture = (overrides: Partial<ChatRoom> = {}): ChatRoom => {
	return {
		...BASE_MEETING_ROOM,
		...overrides,
	};
};

export const BASE_CHAT_MESSAGE: ChatMessage = {
	id: 1,
	content: 'hello',
	senderId: 46,
	roomId: 101,
	createdAt: BASE_CREATED_AT,
	sender: {
		id: 46,
		nickname: 'mentor',
		image: '',
	},
};

export const createChatMessageFixture = (overrides: Partial<ChatMessage> = {}): ChatMessage => {
	return {
		...BASE_CHAT_MESSAGE,
		...overrides,
	};
};
