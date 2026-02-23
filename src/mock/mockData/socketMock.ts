import { markNewChatEmitted, shouldEmitNewChat } from '@/lib/newChatNotificationState';
import { mockChatMessages, mockChatRooms } from '@/mock/mockData/chatMock';
import type {
	JoinRoomAck,
	JoinRoomPayload,
	NewMessagePayload,
	SendMessageAck,
	SendMessagePayload,
} from '@/models/chat-socket.model';
import type { ChatMessage } from '@/models/chat.model';
import type { Notification } from '@/models/notification.model';

type SocketEvents = {
	connect: () => void;
	notification: (payload: Notification) => void;
	newMessage: (message: NewMessagePayload) => void;
};

type EmitFn = {
	(event: 'joinRoom', payload: JoinRoomPayload, callback?: (res: JoinRoomAck) => void): void;
	(
		event: 'sendMessage',
		payload: SendMessagePayload,
		callback?: (res: SendMessageAck) => void,
	): void;
};

export type MockSocketClient = {
	id: string;
	on: <K extends keyof SocketEvents>(eventName: K, listener: SocketEvents[K]) => MockSocketClient;
	off: <K extends keyof SocketEvents>(
		eventName: K,
		listener: SocketEvents[K],
	) => MockSocketClient;
	emit: EmitFn;
	disconnect: () => void;
	connected: boolean;
};

const emitNewChatNotification = (
	roomId: number,
	content: string,
	nickname: string,
	notifyListeners: Array<(payload: Notification) => void>,
) => {
	const room = mockChatRooms.find((item) => item.roomId === roomId);
	if (!room || room.chatType !== 'lesson') return;
	if (!shouldEmitNewChat(roomId)) return;

	const notification: Notification = {
		id: Date.now(),
		type: 'NEW_CHAT',
		message: content,
		description: content,
		roomId,
		linkId: room.lessonId,
		linkType: 'LESSON',
		senderNickname: nickname,
		lessonTitle: room.title,
		createdAt: new Date().toISOString(),
		isRead: false,
		readAt: null,
	};

	notifyListeners.forEach((listener) => listener(notification));
	markNewChatEmitted(roomId);
};

export const createMockSocket = (): MockSocketClient => {
	const id = `mock_socket_${Math.random().toString(36).slice(2, 11)}`;
	let activeRoomId: number | null = null;

	const userId = 46;
	const nickname = '테스트 유저';
	const profileImage = 'https://i.pravatar.cc/150?img=46';

	const connectListeners: Array<() => void> = [];
	const notificationListeners: Array<(payload: Notification) => void> = [];
	const newMessageListeners: Array<(message: NewMessagePayload) => void> = [];

	const on: MockSocketClient['on'] = (eventName, listener) => {
		if (eventName === 'connect') {
			connectListeners.push(listener as () => void);
			return client;
		}

		if (eventName === 'notification') {
			notificationListeners.push(listener as (payload: Notification) => void);
			return client;
		}

		newMessageListeners.push(listener as (message: NewMessagePayload) => void);
		return client;
	};

	const off: MockSocketClient['off'] = (eventName, listener) => {
		if (eventName === 'connect') {
			const idx = connectListeners.indexOf(listener as () => void);
			if (idx >= 0) connectListeners.splice(idx, 1);
			return client;
		}

		if (eventName === 'notification') {
			const idx = notificationListeners.indexOf(listener as (payload: Notification) => void);
			if (idx >= 0) notificationListeners.splice(idx, 1);
			return client;
		}

		const idx = newMessageListeners.indexOf(listener as (message: NewMessagePayload) => void);
		if (idx >= 0) newMessageListeners.splice(idx, 1);
		return client;
	};

	function emit(
		event: 'joinRoom',
		payload: JoinRoomPayload,
		callback?: (res: JoinRoomAck) => void,
	): void;
	function emit(
		event: 'sendMessage',
		payload: SendMessagePayload,
		callback?: (res: SendMessageAck) => void,
	): void;
	function emit(
		event: 'joinRoom' | 'sendMessage',
		payload: JoinRoomPayload | SendMessagePayload,
		callback?: ((res: JoinRoomAck) => void) | ((res: SendMessageAck) => void),
	): void {
		if (event === 'joinRoom') {
			const roomId = payload as JoinRoomPayload;
			activeRoomId = roomId;
			if (callback) {
				(callback as (res: JoinRoomAck) => void)({ status: 'success', roomId });
			}
			return;
		}

		const messagePayload = payload as SendMessagePayload;
		const roomId = messagePayload.roomId ?? activeRoomId;
		if (!roomId) return;

		const newMessage: ChatMessage = {
			id: Date.now(),
			roomId,
			senderId: userId,
			content: messagePayload.content,
			createdAt: new Date().toISOString(),
			sender: {
				id: userId,
				nickname,
				image: profileImage,
			},
		};

		if (!mockChatMessages[roomId]) {
			mockChatMessages[roomId] = [];
		}
		mockChatMessages[roomId].push(newMessage);

		const room = mockChatRooms.find((item) => item.roomId === roomId);
		if (room) {
			room.lastMessage = newMessage.content;
			room.updatedAt = newMessage.createdAt;
		}

		newMessageListeners.forEach((listener) => listener(newMessage));
		emitNewChatNotification(roomId, newMessage.content, nickname, notificationListeners);

		if (callback) {
			(callback as (res: SendMessageAck) => void)({ status: 'sent', message: newMessage });
		}
	}

	const disconnect = () => {
		activeRoomId = null;
	};

	const client: MockSocketClient = {
		id,
		on,
		off,
		emit,
		disconnect,
		connected: true,
	};

	setTimeout(() => {
		connectListeners.forEach((listener) => listener());
	}, 100);

	return client;
};
