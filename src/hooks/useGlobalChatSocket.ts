import { useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { resolveNotificationMessage } from '@/constants/notificationMessages';
import {
	DEFAULT_NOTIFICATION_LIMIT,
	DEFAULT_NOTIFICATION_PAGE,
} from '@/hooks/useNotificationQuery';
import { getChatSocket, initChatSocket, type ChatSocket } from '@/lib/chatSocket';
import type { MockSocketClient } from '@/mock/mockData/socketMock';
import type { NotificationSocketPayload, NotificationUiItem } from '@/models/notification.model';
import { useAuthStore } from '@/store/authStore';

const MAX_STORED_NOTIFICATIONS = 10;

const normalizeIncomingNotification = (payload: NotificationSocketPayload): NotificationUiItem => {
	const message = resolveNotificationMessage(payload);

	return {
		id: payload.id,
		type: payload.type,
		message,
		description: message,
		linkId: payload.linkId,
		linkType: payload.linkType,
		roomId: payload.roomId,
		senderNickname: payload.senderNickname,
		lessonTitle: payload.lessonTitle,
		meetingTitle: payload.meetingTitle,
		isRead: false,
		readAt: null,
		createdAt: new Date().toISOString(),
	};
};

const trimNotifications = (notifications: NotificationUiItem[]): NotificationUiItem[] => {
	const next = [...notifications];

	while (next.length > MAX_STORED_NOTIFICATIONS) {
		let readIndex = -1;
		for (let i = next.length - 1; i >= 0; i -= 1) {
			if (next[i].isRead) {
				readIndex = i;
				break;
			}
		}

		next.splice(readIndex >= 0 ? readIndex : next.length - 1, 1);
	}

	return next;
};

const isSocketIoClient = (socket: ChatSocket): socket is Exclude<ChatSocket, MockSocketClient> => {
	return 'io' in socket;
};

const attachNotificationListener = (
	socket: ChatSocket,
	listener: (payload: NotificationSocketPayload) => void,
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

			const onNotification = (payload: NotificationSocketPayload) => {
				const incoming = normalizeIncomingNotification(payload);

				queryClient.setQueryData<NotificationUiItem[]>(
					['notifications', DEFAULT_NOTIFICATION_PAGE, DEFAULT_NOTIFICATION_LIMIT],
					(oldData) => {
						const prev = oldData ?? [];
						if (prev.some((n) => n.id === incoming.id)) return prev;
						return trimNotifications([incoming, ...prev]);
					},
				);
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
