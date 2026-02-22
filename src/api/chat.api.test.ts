import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getMyChatRooms, getRoomMessages, joinChatRoom } from '@/api/chat.api';
import { chatApiClient } from '@/api/client';
import { createChatMessageFixture, createChatRoomFixture } from '@/test/fixtures/chat.fixture';

vi.mock('@/api/client', () => ({
	chatApiClient: {
		get: vi.fn(),
		post: vi.fn(),
	},
}));

describe('chat.api', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('fetches my chat rooms', async () => {
		const rooms = [createChatRoomFixture(), createChatRoomFixture({ roomId: 202 })];
		vi.mocked(chatApiClient.get).mockResolvedValue({ data: rooms });

		const result = await getMyChatRooms();

		expect(chatApiClient.get).toHaveBeenCalledWith('/chats/rooms/me');
		expect(result).toEqual(rooms);
	});

	it('joins chat room with payload', async () => {
		const payload = { lessonId: 20, studentId: 46 };
		vi.mocked(chatApiClient.post).mockResolvedValue({
			data: { roomId: 201, lessonId: 20 },
		});

		const result = await joinChatRoom(payload);

		expect(chatApiClient.post).toHaveBeenCalledWith('/chats/rooms/join', payload);
		expect(result.roomId).toBe(201);
	});

	it('returns room messages when response is array', async () => {
		const messages = [createChatMessageFixture({ id: 10 })];
		vi.mocked(chatApiClient.get).mockResolvedValue({ data: messages });

		const result = await getRoomMessages(101);

		expect(chatApiClient.get).toHaveBeenCalledWith('/chats/rooms/101/messages');
		expect(result).toEqual(messages);
	});

	it('returns messages from wrapped response', async () => {
		const messages = [createChatMessageFixture({ id: 11 })];
		vi.mocked(chatApiClient.get).mockResolvedValue({
			data: { roomId: 101, messages },
		});

		const result = await getRoomMessages(101);

		expect(result).toEqual(messages);
	});

	it('returns empty array for empty wrapped response', async () => {
		vi.mocked(chatApiClient.get).mockResolvedValue({
			data: { roomId: 101, messages: [] },
		});

		const result = await getRoomMessages(101);

		expect(result).toEqual([]);
	});
});
