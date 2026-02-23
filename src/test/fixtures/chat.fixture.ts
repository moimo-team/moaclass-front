import type { ChatMessage, ChatRoom } from '@/models/chat.model';

const BASE_CREATED_AT = '2026-02-21T10:00:00.000Z';

export const BASE_MEETING_ROOM: ChatRoom = {
	roomId: 101,
	chatType: 'meeting',
	meetingId: 10,
	title: '주말 스터디 모임',
	image: null,
	memberCount: 5,
	isLeader: false,
	hostId: 2,
	lastMessage: '모임 공지입니다.',
	updatedAt: BASE_CREATED_AT,
};

export const BASE_LESSON_ROOM: ChatRoom = {
	roomId: 201,
	chatType: 'lesson',
	lessonId: 20,
	title: '도예 원데이 클래스',
	image: null,
	memberCount: 2,
	isLeader: false,
	hostId: 3,
	lastMessage: '문의 남겨주세요.',
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
	content: '안녕하세요',
	senderId: 46,
	roomId: 101,
	createdAt: BASE_CREATED_AT,
	sender: {
		id: 46,
		nickname: '모멘티',
		image: '',
	},
};

export const createChatMessageFixture = (overrides: Partial<ChatMessage> = {}): ChatMessage => {
	return {
		...BASE_CHAT_MESSAGE,
		...overrides,
	};
};
