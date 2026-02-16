import { mockChatMessages, mockChatRooms } from '@/mock/mockData/chatMock';
import type { ChatMessage } from '@/models/chat.model';

class CustomEventEmitter {
	private events: Record<string, Function[]> = {};

	on(eventName: string, listener: Function): this {
		if (!this.events[eventName]) {
			this.events[eventName] = [];
		}
		this.events[eventName].push(listener);
		return this;
	}

	emit(eventName: string, ...args: any[]): boolean {
		if (this.events[eventName]) {
			this.events[eventName].forEach((listener) => listener(...args));
			return true;
		}
		return false;
	}
}

class MockSocket extends CustomEventEmitter {
	public id: string;
	private roomId: number | null = null;
	private userId = 46;
	private nickname = '테스트유저';
	private profileImage = 'https://i.pravatar.cc/150?img=46';

	constructor() {
		super();
		this.id = `mock_socket_${Math.random().toString(36).slice(2, 11)}`;
	}

	private extractRoomId(value: number | { roomId: number }): number {
		return typeof value === 'number' ? value : value.roomId;
	}

	joinRoom(payload: number | { roomId: number }, callback?: (res: any) => void) {
		const roomId = this.extractRoomId(payload);
		this.roomId = roomId;
		if (callback) callback({ status: 'success', roomId });
	}

	sendMessage(
		payload: {
			roomId?: number;
			meetingId?: number;
			content: string;
		},
		callback?: (res: any) => void,
	) {
		const roomId = payload.roomId ?? payload.meetingId ?? this.roomId;
		if (!roomId) return;

		const newMessage: ChatMessage = {
			id: Date.now(),
			roomId,
			meetingId: roomId,
			senderId: this.userId,
			content: payload.content,
			createdAt: new Date().toISOString(),
			sender: {
				id: this.userId,
				nickname: this.nickname,
				image: this.profileImage,
			},
		};

		if (!mockChatMessages[roomId]) {
			mockChatMessages[roomId] = [];
		}
		mockChatMessages[roomId].push(newMessage);

		const room = mockChatRooms.find((r) => r.roomId === roomId);
		if (room) {
			room.lastMessage = {
				sender: this.nickname,
				content: newMessage.content,
				createdAt: newMessage.createdAt,
			};
		}

		this.emit('newMessage', newMessage);
		if (callback) callback({ status: 'sent', message: newMessage });
	}

	disconnect() {
		this.roomId = null;
	}

	handleClientEmit(event: string, ...args: any[]) {
		const payload = args[0];
		const callback =
			typeof args[args.length - 1] === 'function' ? args[args.length - 1] : undefined;

		switch (event) {
			case 'joinRoom':
				this.joinRoom(payload, callback);
				break;
			case 'sendMessage':
				this.sendMessage(payload, callback);
				break;
			default:
				break;
		}
	}

	simulateConnection() {
		setTimeout(() => {
			this.emit('connect');
		}, 100);
	}
}

export const createMockSocket = () => {
	const mockSocket = new MockSocket();
	mockSocket.simulateConnection();

	return {
		id: mockSocket.id,
		on: mockSocket.on.bind(mockSocket),
		emit: mockSocket.handleClientEmit.bind(mockSocket),
		disconnect: mockSocket.disconnect.bind(mockSocket),
		connected: true,
	};
};
