import { delay, http, HttpResponse } from 'msw';

import { CHAT_API_URL } from '@/config/chatConfig';

import { lessonChatParticipants, mockChatMessages, mockChatRooms } from './mockData/chatMock';

const getMyChatRooms = http.get(`${CHAT_API_URL}/chats/rooms/me`, async () => {
	await delay(300);
	return HttpResponse.json(mockChatRooms);
});

const getChatRooms = http.get(`${CHAT_API_URL}/chats/rooms`, async () => {
	await delay(300);
	return HttpResponse.json(mockChatRooms);
});

const getRoomMessages = http.get(
	`${CHAT_API_URL}/chats/rooms/:roomId/messages`,
	async ({ params }) => {
		const roomId = Number(params.roomId);
		await delay(300);
		return HttpResponse.json(mockChatMessages[roomId] || []);
	},
);

const joinRoom = http.post(`${CHAT_API_URL}/chats/rooms/join`, async ({ request }) => {
	const body = (await request.json()) as {
		lessonId?: number;
		meetingId?: number;
		studentId?: number;
	};

	if (body.meetingId) {
		const existingMeetingRoom = mockChatRooms.find((room) => room.meetingId === body.meetingId);
		if (existingMeetingRoom) {
			return HttpResponse.json({
				roomId: existingMeetingRoom.roomId,
				meetingId: body.meetingId,
			});
		}
	}

	if (body.lessonId) {
		// lessonId 단위로 1:1 문의 채팅방 1개를 재사용
		const existingLessonRoom = mockChatRooms.find((room) => room.lessonId === body.lessonId);
		if (existingLessonRoom) {
			return HttpResponse.json({
				roomId: existingLessonRoom.roomId,
				lessonId: body.lessonId,
			});
		}

		const roomId = Date.now();
		mockChatRooms.unshift({
			roomId,
			chatType: 'lesson',
			lessonId: body.lessonId,
			title: `클래스 ${body.lessonId} 문의`,
			image: null,
			memberCount: 2,
			hostId: lessonChatParticipants.mentor.id,
			isLeader: false,
		});

		mockChatMessages[roomId] = [
			{
				id: Date.now() + 1,
				roomId,
				content: `클래스 ${body.lessonId} 문의 채팅이 시작되었어요.`,
				senderId: lessonChatParticipants.mentor.id,
				createdAt: new Date().toISOString(),
				sender: lessonChatParticipants.mentor,
			},
		];

		return HttpResponse.json({ roomId, lessonId: body.lessonId });
	}

	return HttpResponse.json({ roomId: 0 }, { status: 400 });
});

export const chatHandler = [getMyChatRooms, getChatRooms, getRoomMessages, joinRoom];
