import { useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
	DEFAULT_NOTIFICATION_LIMIT,
	DEFAULT_NOTIFICATION_PAGE,
} from '@/hooks/useNotificationQuery';
import { getChatSocket, initChatSocket, type ChatSocket } from '@/lib/chatSocket';
import type { MockSocketClient } from '@/mock/mockData/socketMock';
import type { Notification } from '@/models/notification.model';
import { useAuthStore } from '@/store/authStore';

const normalizeIncomingNotification = (payload: Notification): Notification => ({
	...payload,
	message: payload.message ?? payload.description ?? '',
	description: payload.description ?? payload.message ?? '',
	isRead: false,
	readAt: null,
});

const isSocketIoClient = (socket: ChatSocket): socket is Exclude<ChatSocket, MockSocketClient> => {
	return 'io' in socket;
};

const attachNotificationListener = (
	socket: ChatSocket,
	listener: (payload: Notification) => void,
) => {
	if (isSocketIoClient(socket)) {
		socket.on('notification', listener);
		return () => socket.off('notification', listener);
	}

	socket.on('notification', listener);
	return () => socket.off('notification', listener);
};

export const useGlobalChatSocket = () => {
	const queryClient = useQueryClient();
	const { accessToken, isLoggedIn } = useAuthStore();

	useEffect(() => {
		if (!isLoggedIn || !accessToken) return;

		let detached = false;
		let teardown: (() => void) | undefined;

		const setup = async () => {
			const socket = await initChatSocket(accessToken);
			if (!socket || detached) return;

			const onNotification = (payload: Notification) => {
				const incoming = normalizeIncomingNotification(payload);

				queryClient.setQueryData<Notification[]>(
					['notifications', DEFAULT_NOTIFICATION_PAGE, DEFAULT_NOTIFICATION_LIMIT],
					(oldData) => {
						const prev = oldData ?? [];
						if (prev.some((n) => n.id === incoming.id)) return prev;
						return [incoming, ...prev];
					},
				);

				if (incoming.type === 'NEW_CHAT') {
					const sender = incoming.senderNickname ?? 'New message';
					const message = incoming.message ?? incoming.description ?? '';
					toast.info(`${sender}: ${message}`);
				}
			};

			teardown = attachNotificationListener(socket, onNotification);
		};

		void setup();

		return () => {
			detached = true;
			if (teardown) teardown();
		};
	}, [accessToken, isLoggedIn, queryClient]);

	return { socket: getChatSocket() };
};
