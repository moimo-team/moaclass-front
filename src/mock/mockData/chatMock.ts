import { fakerKO as faker } from '@faker-js/faker';

import type { ChatMessage, ChatRoom } from '@/models/chat.model';
import type { User } from '@/models/user.model';

const mockUser1: Pick<User, 'id' | 'email' | 'nickname' | 'profileImage'> = {
	id: 1,
	email: 'user1@example.com',
	nickname: '첫번째유저',
	profileImage: 'https://i.pravatar.cc/150?img=1',
};

const mockUser2: Pick<User, 'id' | 'email' | 'nickname' | 'profileImage'> = {
	id: 2,
	email: 'user2@example.com',
	nickname: '두번째유저',
	profileImage: 'https://i.pravatar.cc/150?img=2',
};

const mockUser3: Pick<User, 'id' | 'email' | 'nickname' | 'profileImage'> = {
	id: 3,
	email: 'user3@example.com',
	nickname: '세번째유저',
	profileImage: 'https://i.pravatar.cc/150?img=3',
};

export const mockUsers = [mockUser1, mockUser2, mockUser3];

const generateChatMessages = (roomId: number, count: number): ChatMessage[] => {
	const messages: ChatMessage[] = [];
	for (let i = 0; i < count; i++) {
		const sender = mockUsers[i % mockUsers.length];
		const createdAt = new Date(Date.now() - (count - i) * 60 * 1000).toISOString();
		messages.push({
			id: roomId * 1000 + i + 1,
			content: `[방 ${roomId}] ${sender.nickname}의 ${i + 1}번째 메시지`,
			senderId: sender.id,
			roomId,
			meetingId: roomId,
			createdAt,
			sender: {
				id: sender.id,
				nickname: sender.nickname,
				image: sender.profileImage || '',
			},
		});
	}
	return messages;
};

export const mockChatMessages: Record<number, ChatMessage[]> = {
	1: generateChatMessages(1, 10),
	2: generateChatMessages(2, 8),
	3: generateChatMessages(3, 6),
	101: generateChatMessages(101, 5),
	102: generateChatMessages(102, 4),
};

const buildLastMessage = (roomId: number) => {
	const messages = mockChatMessages[roomId];
	const lastMessage = messages[messages.length - 1];

	return {
		sender: lastMessage.sender?.nickname ?? '알 수 없음',
		content: lastMessage.content,
		createdAt: lastMessage.createdAt,
	};
};

const meetingRooms: ChatRoom[] = [1, 2, 3].map((roomId, i) => ({
	roomId,
	chatType: 'meeting',
	meetingId: roomId,
	title: `모임 채팅방 ${roomId}`,
	memberCount: faker.number.int({ min: 2, max: 10 }),
	image: faker.image.urlLoremFlickr({ category: 'nature' }),
	lastMessage: buildLastMessage(roomId),
	hostId: mockUsers[0].id,
	isLeader: i % 2 === 0,
}));

const lessonRooms: ChatRoom[] = [101, 102].map((roomId, i) => ({
	roomId,
	chatType: 'lesson',
	lessonId: i + 20,
	title: `레슨 문의 ${i + 1}`,
	memberCount: 2,
	image: faker.image.urlLoremFlickr({ category: 'people' }),
	lastMessage: buildLastMessage(roomId),
	hostId: mockUsers[1].id,
	isLeader: false,
}));

export const mockChatRooms: ChatRoom[] = [...meetingRooms, ...lessonRooms];
