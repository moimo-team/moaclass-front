import { fakerKO as faker } from '@faker-js/faker';

import type { ChatMessage, ChatRoom, MessageSender } from '@/models/chat.model';
import type { User } from '@/models/user.model';

const meetingUser1: Pick<User, 'id' | 'email' | 'nickname' | 'profileImage'> = {
	id: 1,
	email: 'user1@example.com',
	nickname: '첫번째유저',
	profileImage: 'https://i.pravatar.cc/150?img=1',
};

const meetingUser2: Pick<User, 'id' | 'email' | 'nickname' | 'profileImage'> = {
	id: 2,
	email: 'user2@example.com',
	nickname: '두번째유저',
	profileImage: 'https://i.pravatar.cc/150?img=2',
};

const meetingUser3: Pick<User, 'id' | 'email' | 'nickname' | 'profileImage'> = {
	id: 3,
	email: 'user3@example.com',
	nickname: '세번째유저',
	profileImage: 'https://i.pravatar.cc/150?img=3',
};

const lessonMentor: MessageSender = {
	id: 100,
	nickname: '모멘토(선생)',
	image: 'https://i.pravatar.cc/150?img=30',
};

const lessonStudentA: MessageSender = {
	id: 200,
	nickname: '모멘티A(학생)',
	image: 'https://i.pravatar.cc/150?img=45',
};

const lessonStudentB: MessageSender = {
	id: 201,
	nickname: '모멘티B(학생)',
	image: 'https://i.pravatar.cc/150?img=46',
};

export const mockUsers = [meetingUser1, meetingUser2, meetingUser3];

const generateMeetingMessages = (roomId: number, count: number): ChatMessage[] => {
	const senders = [meetingUser1, meetingUser2, meetingUser3];
	return Array.from({ length: count }, (_, i) => {
		const sender = senders[i % senders.length];
		return {
			id: roomId * 1000 + i + 1,
			content: `[모임 ${roomId}] ${sender.nickname}의 ${i + 1}번째 메시지`,
			senderId: sender.id,
			roomId,
			createdAt: new Date(Date.now() - (count - i) * 60 * 1000).toISOString(),
			sender: {
				id: sender.id,
				nickname: sender.nickname,
				image: sender.profileImage || '',
			},
		};
	});
};

const generateLessonMessages = (
	roomId: number,
	lessonId: number,
	student: MessageSender,
	count: number,
): ChatMessage[] => {
	const senders = [lessonMentor, student];
	return Array.from({ length: count }, (_, i) => {
		const sender = senders[i % 2];
		return {
			id: roomId * 1000 + i + 1,
			content:
				i % 2 === 0
					? `레슨 ${lessonId} 문의 답변 드릴게요.`
					: `레슨 ${lessonId} 문의드립니다.`,
			senderId: sender.id,
			roomId,
			createdAt: new Date(Date.now() - (count - i) * 60 * 1000).toISOString(),
			sender,
		};
	});
};

export const mockChatMessages: Record<number, ChatMessage[]> = {
	1: generateMeetingMessages(1, 10),
	2: generateMeetingMessages(2, 8),
	3: generateMeetingMessages(3, 6),
	101: generateLessonMessages(101, 1, lessonStudentA, 6),
	102: generateLessonMessages(102, 1, lessonStudentB, 6),
};

const buildLastMessage = (roomId: number): string => {
	const messages = mockChatMessages[roomId];
	const lastMessage = messages[messages.length - 1];
	return lastMessage.content;
};

const buildUpdatedAt = (roomId: number): string => {
	const messages = mockChatMessages[roomId];
	const lastMessage = messages[messages.length - 1];
	return lastMessage.createdAt;
};

const meetingRooms: ChatRoom[] = [1, 2, 3].map((roomId) => ({
	roomId,
	meetingId: roomId,
	lessonId: null,
	title: `모임 채팅방 ${roomId}`,
	representativeImage: faker.image.urlLoremFlickr({ category: 'nature' }),
	lastMessage: buildLastMessage(roomId),
	updatedAt: buildUpdatedAt(roomId),
}));

const lessonRooms: ChatRoom[] = [
	{
		roomId: 101,
		lessonId: 1,
		studentName: lessonStudentA.nickname,
	},
	{
		roomId: 102,
		lessonId: 1,
		studentName: lessonStudentB.nickname,
	},
].map(({ roomId, lessonId, studentName }) => ({
	roomId,
	meetingId: null,
	lessonId,
	title: `레슨 ${lessonId} 문의 (${studentName})`,
	representativeImage: faker.image.urlLoremFlickr({ category: 'people' }),
	lastMessage: buildLastMessage(roomId),
	updatedAt: buildUpdatedAt(roomId),
}));

export const mockChatRooms: ChatRoom[] = [...meetingRooms, ...lessonRooms];

export const lessonChatParticipants = {
	mentor: lessonMentor,
	studentA: lessonStudentA,
	studentB: lessonStudentB,
};
