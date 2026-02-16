import { delay, http, HttpResponse } from 'msw';

import { mockChatMessages, mockChatRooms } from './mockData/chatMock';
import { httpUrl } from './mockData/mockData';

const getMyChatRooms = http.get(`${httpUrl}/chats/rooms/me`, async () => {
	await delay(300);
	return HttpResponse.json(mockChatRooms);
});

// Backward compatibility for legacy endpoint usage
const getChatRooms = http.get(`${httpUrl}/chats/rooms`, async () => {
	await delay(300);
	return HttpResponse.json(mockChatRooms);
});

const getRoomMessages = http.get(`${httpUrl}/chats/rooms/:roomId/messages`, async ({ params }) => {
	const roomId = Number(params.roomId);
	await delay(300);
	return HttpResponse.json(mockChatMessages[roomId] || []);
});

const joinRoom = http.post(`${httpUrl}/chats/rooms/join`, async ({ request }) => {
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
			title: `레슨 문의 ${body.lessonId}`,
			image: null,
			memberCount: 2,
			hostId: body.studentId ?? 1,
			isLeader: false,
		});
		mockChatMessages[roomId] = [];
		return HttpResponse.json({ roomId, lessonId: body.lessonId });
	}

	return HttpResponse.json({ roomId: 0 }, { status: 400 });
});

export const chatHandler = [getMyChatRooms, getChatRooms, getRoomMessages, joinRoom];
