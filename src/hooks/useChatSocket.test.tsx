import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useChatSocket } from '@/hooks/useChatSocket';
import type { ChatMessage } from '@/models/chat.model';
import { createChatMessageFixture } from '@/test/fixtures/chat.fixture';

type SocketListener = (message: ChatMessage) => void;

const mockInitChatSocket = vi.fn();
const mockGetChatSocket = vi.fn();
const mockUseAuthStore = vi.fn();

const mockSocket = {
	on: vi.fn(),
	off: vi.fn(),
	emit: vi.fn(),
};

vi.mock('@/lib/chatSocket', () => ({
	initChatSocket: (...args: Parameters<typeof mockInitChatSocket>) => mockInitChatSocket(...args),
	getChatSocket: () => mockGetChatSocket(),
}));

vi.mock('@/store/authStore', () => ({
	useAuthStore: () => mockUseAuthStore(),
}));

describe('useChatSocket', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseAuthStore.mockReturnValue({
			accessToken: 'token',
			userId: 46,
		});
		mockInitChatSocket.mockResolvedValue(mockSocket);
		mockGetChatSocket.mockReturnValue(mockSocket);
	});

	it('does not initialize socket without accessToken', () => {
		mockUseAuthStore.mockReturnValue({
			accessToken: null,
			userId: 46,
		});

		renderHook(() => useChatSocket(101, vi.fn()));
		expect(mockInitChatSocket).not.toHaveBeenCalled();
	});

	it('registers newMessage listener and forwards message', async () => {
		const onNewMessage = vi.fn();
		renderHook(() => useChatSocket(101, onNewMessage));

		await waitFor(() => {
			expect(mockSocket.on).toHaveBeenCalledWith('newMessage', expect.any(Function));
		});

		const listener = mockSocket.on.mock.calls.find((call) => call[0] === 'newMessage')?.[1] as
			| SocketListener
			| undefined;

		const message = createChatMessageFixture({ id: 99 });
		listener?.(message);

		expect(onNewMessage).toHaveBeenCalledWith(message);
	});

	it('joins selected room when selectedRoomId changes', async () => {
		const { rerender } = renderHook(({ roomId }) => useChatSocket(roomId, vi.fn()), {
			initialProps: { roomId: null as number | null },
		});

		rerender({ roomId: 101 });

		await waitFor(() => {
			expect(mockSocket.emit).toHaveBeenCalledWith('joinRoom', { roomId: 101 });
		});
	});

	it('sends message with selected room', () => {
		const { result } = renderHook(() => useChatSocket(101, vi.fn()));

		result.current.sendMessage('hello');

		expect(mockSocket.emit).toHaveBeenCalledWith('sendMessage', {
			roomId: 101,
			content: 'hello',
		});
	});

	it('does not send message when selectedRoomId is null', () => {
		const { result } = renderHook(() => useChatSocket(null, vi.fn()));

		result.current.sendMessage('hello');

		expect(mockSocket.emit).not.toHaveBeenCalledWith('sendMessage', expect.anything());
	});

	it('removes listener on unmount', async () => {
		const { unmount } = renderHook(() => useChatSocket(101, vi.fn()));

		await waitFor(() => {
			expect(mockSocket.on).toHaveBeenCalledWith('newMessage', expect.any(Function));
		});

		const listener = mockSocket.on.mock.calls.find((call) => call[0] === 'newMessage')?.[1];
		unmount();

		expect(mockSocket.off).toHaveBeenCalledWith('newMessage', listener);
	});

	it('does not register duplicated newMessage listener on rerender', async () => {
		const { rerender } = renderHook(({ roomId }) => useChatSocket(roomId, vi.fn()), {
			initialProps: { roomId: 101 },
		});

		await waitFor(() => {
			expect(mockSocket.on).toHaveBeenCalledWith('newMessage', expect.any(Function));
		});
		const onCallCount = mockSocket.on.mock.calls.filter(
			(call) => call[0] === 'newMessage',
		).length;

		rerender({ roomId: 201 });

		const afterRerenderCount = mockSocket.on.mock.calls.filter(
			(call) => call[0] === 'newMessage',
		).length;
		expect(afterRerenderCount).toBe(onCallCount);
	});

	it('does not emit joinRoom again when selectedRoomId stays same', async () => {
		const { rerender } = renderHook(({ roomId }) => useChatSocket(roomId, vi.fn()), {
			initialProps: { roomId: 101 },
		});

		await waitFor(() => {
			expect(mockSocket.emit).toHaveBeenCalledWith('joinRoom', { roomId: 101 });
		});
		const initialJoinCalls = mockSocket.emit.mock.calls.filter(
			(call) => call[0] === 'joinRoom',
		).length;

		rerender({ roomId: 101 });

		const afterRerenderJoinCalls = mockSocket.emit.mock.calls.filter(
			(call) => call[0] === 'joinRoom',
		).length;
		expect(afterRerenderJoinCalls).toBe(initialJoinCalls);
	});
});
