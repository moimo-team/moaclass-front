import { io } from 'socket.io-client';

import { CHAT_API_URL } from '@/config/chatConfig';
import type { createMockSocket } from '@/mock/mockData/socketMock';
import { ENV } from '@/utils/env';

import type { Socket } from 'socket.io-client';

type MockSocketType = ReturnType<typeof createMockSocket>;
export type ChatSocket = Socket | MockSocketType;

const isMockingEnabled = ENV.ENABLE_MOCK;

let socketInstance: ChatSocket | null = null;

const ensureChatsNamespace = (url: string) =>
	url.endsWith('/chats') ? url : `${url.replace(/\/$/, '')}/chats`;

const createSocket = async (accessToken: string): Promise<ChatSocket> => {
	if (isMockingEnabled) {
		const { createMockSocket } = await import('@/mock/mockData/socketMock');
		return createMockSocket();
	}

	const socketUrl = ensureChatsNamespace(ENV.SOCKET_URL || CHAT_API_URL);

	return io(socketUrl, {
		auth: { token: accessToken },
		query: { token: accessToken },
		transports: ['websocket'],
		reconnection: true,
		reconnectionAttempts: 5,
	});
};

export const initChatSocket = async (accessToken: string | null): Promise<ChatSocket | null> => {
	if (!accessToken) return null;
	if (socketInstance) return socketInstance;

	socketInstance = await createSocket(accessToken);
	return socketInstance;
};

export const getChatSocket = (): ChatSocket | null => socketInstance;

export const disconnectChatSocket = () => {
	if (!socketInstance) return;
	socketInstance.disconnect();
	socketInstance = null;
};
