import { useCallback, useEffect, useRef } from 'react';

import { io } from 'socket.io-client';

import type { createMockSocket } from '@/mock/mockData/socketMock';
import type { ChatMessage } from '@/models/chat.model';
import { useAuthStore } from '@/store/authStore';

import type { Socket } from 'socket.io-client';

type MockSocketType = ReturnType<typeof createMockSocket>;

const isMockingEnabled =
	import.meta.env.DEV && (import.meta.env.VITE_ENABLE_MOCK || 'true') === 'true';

const getSocketInstance = async (
	accessToken: string | null,
): Promise<Socket | MockSocketType | null> => {
	if (isMockingEnabled) {
		const { createMockSocket } = await import('@/mock/mockData/socketMock');
		return createMockSocket();
	}

	if (!accessToken) return null;

	return io(import.meta.env.VITE_SOCKET_URL, {
		auth: { token: accessToken },
		transports: ['websocket'],
		reconnection: true,
		reconnectionAttempts: 5,
	});
};

export const useChatSocket = (
	selectedRoomId: number | null,
	onNewMessage: (message: ChatMessage) => void,
) => {
	const socketRef = useRef<Socket | MockSocketType | null>(null);
	const selectedRoomIdRef = useRef<number | null>(selectedRoomId);

	const onNewMessageRef = useRef(onNewMessage);
	const { accessToken, userId } = useAuthStore();

	useEffect(() => {
		onNewMessageRef.current = onNewMessage;
	}, [onNewMessage]);

	useEffect(() => {
		selectedRoomIdRef.current = selectedRoomId;
	}, [selectedRoomId]);

	useEffect(() => {
		if (socketRef.current) return;

		const initSocket = async () => {
			const socket = await getSocketInstance(accessToken);
			if (!socket) return;

			socketRef.current = socket;

			if (selectedRoomIdRef.current) {
				socket.emit(
					'joinRoom',
					{ roomId: selectedRoomIdRef.current },
					(_response: unknown) => {},
				);
			}

			socket.on('connect', () => {});
			socket.on('disconnect', (_reason: string) => {});
			socket.on('connect_error', (error: Error) => {
				console.error('Socket connection error:', error);
			});

			socket.on('newMessage', (message: ChatMessage) => {
				if (!onNewMessageRef.current) return;
				onNewMessageRef.current(message);
			});
		};

		initSocket();

		return () => {
			if (socketRef.current) {
				socketRef.current.disconnect();
				socketRef.current = null;
			}
		};
	}, [accessToken]);

	useEffect(() => {
		const socket = socketRef.current;
		if (!socket || !selectedRoomId) {
			return;
		}

		socket.emit('joinRoom', { roomId: selectedRoomId }, (_response: unknown) => {});
	}, [selectedRoomId]);

	const sendMessage = useCallback(
		(content: string) => {
			if (socketRef.current && selectedRoomId && (userId || isMockingEnabled)) {
				socketRef.current.emit(
					'sendMessage',
					{ roomId: selectedRoomId, content },
					(_response: unknown) => {},
				);
			} else {
				console.error('Cannot send message: Missing socket, roomId, or userId');
			}
		},
		[selectedRoomId, userId],
	);

	return { sendMessage };
};
