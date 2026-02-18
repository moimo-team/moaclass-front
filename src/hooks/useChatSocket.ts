import { useCallback, useEffect, useRef } from 'react';

import { getChatSocket, initChatSocket, type ChatSocket } from '@/lib/chatSocket';
import type { MockSocketClient } from '@/mock/mockData/socketMock';
import type { ChatMessage } from '@/models/chat.model';
import { useAuthStore } from '@/store/authStore';

const isMockingEnabled =
	import.meta.env.DEV && (import.meta.env.VITE_ENABLE_MOCK || 'true') === 'true';

const isSocketIoClient = (socket: ChatSocket): socket is Exclude<ChatSocket, MockSocketClient> => {
	return 'io' in socket;
};

const attachNewMessageListener = (socket: ChatSocket, listener: (message: ChatMessage) => void) => {
	if (isSocketIoClient(socket)) {
		socket.on('newMessage', listener);
		return () => socket.off('newMessage', listener);
	}

	socket.on('newMessage', listener);
	return () => socket.off('newMessage', listener);
};

export const useChatSocket = (
	selectedRoomId: number | null,
	onNewMessage: (message: ChatMessage) => void,
) => {
	const onNewMessageRef = useRef(onNewMessage);
	const { accessToken, userId } = useAuthStore();

	useEffect(() => {
		onNewMessageRef.current = onNewMessage;
	}, [onNewMessage]);

	useEffect(() => {
		if (!accessToken) return;

		let detached = false;
		let teardown: (() => void) | undefined;

		const setup = async () => {
			const socket = await initChatSocket(accessToken);
			if (!socket || detached) return;

			const onMessage = (message: ChatMessage) => {
				onNewMessageRef.current(message);
			};

			teardown = attachNewMessageListener(socket, onMessage);
		};

		void setup();

		return () => {
			detached = true;
			if (teardown) teardown();
		};
	}, [accessToken]);

	useEffect(() => {
		if (!selectedRoomId || !accessToken) return;

		const joinSelectedRoom = async () => {
			const socket = getChatSocket() ?? (await initChatSocket(accessToken));
			if (!socket) return;
			socket.emit('joinRoom', { roomId: selectedRoomId });
		};

		void joinSelectedRoom();
	}, [accessToken, selectedRoomId]);

	const sendMessage = useCallback(
		(content: string) => {
			const socket = getChatSocket();
			if (socket && selectedRoomId && (userId || isMockingEnabled)) {
				socket.emit('sendMessage', { roomId: selectedRoomId, content });
			}
		},
		[selectedRoomId, userId],
	);

	return { sendMessage };
};
