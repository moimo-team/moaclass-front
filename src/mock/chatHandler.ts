// src/mock/chatHandler.ts
import { http, HttpResponse, delay } from 'msw';

import type { ChatMessageResponse } from '@/models/chat.model';

import { mockChatMessages, mockChatRooms } from './mockData/chatMock';
import { httpUrl } from './mockData/mockData';

// 메시지 목록 조회 Mock
const getMessages = http.get(`${httpUrl}/chats/:meetingId/messages`, async ({ params }) => {
	const { meetingId } = params;
	const meetingIdNum = Number(meetingId);
	await delay(300);

	const messages = mockChatMessages[meetingIdNum] || [];

	const response: ChatMessageResponse = {
		meetingId: meetingIdNum,
		messages: messages,
	};

	return HttpResponse.json(response);
});

// 채팅방 목록 조회 Mock
const getChatRooms = http.get(`${httpUrl}/chats/rooms`, async () => {
	await delay(300);
	return HttpResponse.json(mockChatRooms);
});

export const chatHandler = [getMessages, getChatRooms];
