import { useCallback, useEffect, useRef } from 'react';

import { getChatSocket, initChatSocket, type ChatSocket } from '@/lib/chatSocket';
import type { MockSocketClient } from '@/mock/mockData/socketMock';
import type { NewMessagePayload } from '@/models/chat-socket.model';
import { useAuthStore } from '@/store/authStore';
import { ENV } from '@/utils/env';

const isMockingEnabled = ENV.ENABLE_MOCK;

const isSocketIoClient = (socket: ChatSocket): socket is Exclude<ChatSocket, MockSocketClient> => {
	return 'io' in socket;
};

const attachNewMessageListener = (
	socket: ChatSocket,
	listener: (message: NewMessagePayload) => void,
) => {
	if (isSocketIoClient(socket)) {
		socket.on('newMessage', listener);
		return () => socket.off('newMessage', listener);
	}

	socket.on('newMessage', listener);
	return () => socket.off('newMessage', listener);
};

export const useChatSocket = (
	selectedRoomId: number | null,
	onNewMessage: (message: NewMessagePayload) => void,
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

			const onMessage = (message: NewMessagePayload) => {
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
			socket.emit('joinRoom', selectedRoomId);
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
