import { http, HttpResponse } from 'msw';

import { type Notification } from '@/models/notification.model';

let mockNotifications: Notification[] = [
	{
		id: 1,
		lessonId: 101,
		receiverId: 2,
		senderId: 3,
		targetId: 101,
		senderNickname: '김강사',
		type: 'COMMENT_ON_LESSON',
		lessonTitle: '초보자를 위한 강아지 훈련 교실',
		description: "새로운 문의 댓글이 등록되었습니다: '강아지 나이 제한이 있나요?'",
		createdAt: '2026-07-20T10:00:00Z',
		readAt: null,
		isRead: false,
	},
	{
		id: 2,
		lessonId: 102,
		receiverId: 1,
		senderId: 4,
		targetId: 102,
		senderNickname: '박수강',
		type: 'PAYMENT_SUCCESS',
		lessonTitle: '여름맞이 비건 베이킹 클래스',
		description: '박수강님이 클래스 결제를 완료했습니다.',
		createdAt: '2026-07-19T14:30:00Z',
		readAt: null,
		isRead: false,
	},
	{
		id: 3,
		lessonId: 103,
		receiverId: 5,
		senderId: 1,
		targetId: 103,
		senderNickname: '최선생',
		type: 'REPLY_ON_COMMENT',
		lessonTitle: '프로처럼 사진 찍는 법',
		description: '최선생님이 댓글에 답글을 남겼습니다.',
		createdAt: '2026-07-18T09:15:00Z',
		readAt: '2026-07-18T09:30:00Z',
		isRead: true,
	},
	{
		id: 4,
		lessonId: 104,
		receiverId: 1,
		senderId: 6,
		targetId: 104,
		senderNickname: '이강사',
		type: 'REMINDER_24H',
		lessonTitle: '코딩 부트캠프 시작!',
		description: "내일 '코딩 부트캠프 시작!' 클래스가 시작됩니다. 준비물을 확인하세요!",
		createdAt: '2026-07-17T20:00:00Z',
		readAt: null,
		isRead: false,
	},
	{
		id: 5,
		lessonId: 105,
		receiverId: 1,
		senderId: 7,
		targetId: 105,
		senderNickname: '김철수',
		type: 'NEW_CHAT',
		lessonTitle: '새로운 채팅',
		description: '김철수님으로부터 새로운 메시지가 도착했습니다.',
		createdAt: '2026-07-20T11:00:00Z',
		readAt: null,
		isRead: false,
	},
];

export const notificationHandlers = [
	http.get('/api/notifications', () => {
		return HttpResponse.json(mockNotifications);
	}),

	http.patch('/api/notifications/:notificationId/read', async ({ params }) => {
		const { notificationId } = params;
		mockNotifications = mockNotifications.map((notif) =>
			notif.id === Number(notificationId)
				? { ...notif, isRead: true, readAt: new Date().toISOString() }
				: notif,
		);
		return HttpResponse.json({ success: true });
	}),

	http.patch('/api/notifications/read-all', () => {
		mockNotifications = mockNotifications.map((notif) => ({
			...notif,
			isRead: true,
			readAt: new Date().toISOString(),
		}));
		return HttpResponse.json({ success: true });
	}),

	http.post('/api/notifications', async ({ request }) => {
		const newNotification = (await request.json()) as Notification;
		mockNotifications.push({
			...newNotification,
			id: mockNotifications.length + 1, // Simple ID generation
			createdAt: new Date().toISOString(),
			isRead: false,
			readAt: null,
		});
		return HttpResponse.json(newNotification, { status: 201 });
	}),

	http.delete('/api/notifications/:notificationId', ({ params }) => {
		const { notificationId } = params;
		const initialLength = mockNotifications.length;
		mockNotifications = mockNotifications.filter(
			(notif) => notif.id !== Number(notificationId),
		);
		if (mockNotifications.length < initialLength) {
			return HttpResponse.json({ success: true }, { status: 200 });
		}
		return HttpResponse.json(
			{ success: false, message: 'Notification not found' },
			{ status: 404 },
		);
	}),
];

// Export for direct use in tests or other mock setups if needed
export { mockNotifications };

// Functions for direct manipulation if not using MSW handlers
export const getMockNotifications = () => mockNotifications;

export const addMockNotification = (
	notification: Omit<Notification, 'id' | 'createdAt' | 'isRead' | 'readAt'>,
) => {
	const newNotification: Notification = {
		...notification,
		id: mockNotifications.length > 0 ? Math.max(...mockNotifications.map((n) => n.id)) + 1 : 1,
		createdAt: new Date().toISOString(),
		isRead: false,
		readAt: null,
	};
	mockNotifications.push(newNotification);
	return newNotification;
};

export const markMockNotificationAsRead = (id: number) => {
	mockNotifications = mockNotifications.map((notif) =>
		notif.id === id ? { ...notif, isRead: true, readAt: new Date().toISOString() } : notif,
	);
};

export const markAllMockNotificationsAsRead = () => {
	mockNotifications = mockNotifications.map((notif) => ({
		...notif,
		isRead: true,
		readAt: new Date().toISOString(),
	}));
};

export const deleteMockNotification = (id: number) => {
	const initialLength = mockNotifications.length;
	mockNotifications = mockNotifications.filter((notif) => notif.id !== id);
	return mockNotifications.length < initialLength;
};

export const resetMockNotifications = () => {
	mockNotifications = [
		{
			id: 1,
			lessonId: 101,
			receiverId: 2,
			senderId: 3,
			targetId: 101,
			senderNickname: '김강사',
			type: 'COMMENT_ON_LESSON',
			lessonTitle: '초보자를 위한 강아지 훈련 교실',
			description: "새로운 문의 댓글이 등록되었습니다: '강아지 나이 제한이 있나요?'",
			createdAt: '2026-07-20T10:00:00Z',
			readAt: null,
			isRead: false,
		},
		{
			id: 2,
			lessonId: 102,
			receiverId: 1,
			senderId: 4,
			targetId: 102,
			senderNickname: '박수강',
			type: 'PAYMENT_SUCCESS',
			lessonTitle: '여름맞이 비건 베이킹 클래스',
			description: '박수강님이 클래스 결제를 완료했습니다.',
			createdAt: '2026-07-19T14:30:00Z',
			readAt: null,
			isRead: false,
		},
		{
			id: 3,
			lessonId: 103,
			receiverId: 5,
			senderId: 1,
			targetId: 103,
			senderNickname: '최선생',
			type: 'REPLY_ON_COMMENT',
			lessonTitle: '프로처럼 사진 찍는 법',
			description: '최선생님이 댓글에 답글을 남겼습니다.',
			createdAt: '2026-07-18T09:15:00Z',
			readAt: '2026-07-18T09:30:00Z',
			isRead: true,
		},
		{
			id: 4,
			lessonId: 104,
			receiverId: 1,
			senderId: 6,
			targetId: 104,
			senderNickname: '이강사',
			type: 'REMINDER_24H',
			lessonTitle: '코딩 부트캠프 시작!',
			description: "내일 '코딩 부트캠프 시작!' 클래스가 시작됩니다. 준비물을 확인하세요!",
			createdAt: '2026-07-17T20:00:00Z',
			readAt: null,
			isRead: false,
		},
		{
			id: 5,
			lessonId: 105,
			receiverId: 1,
			senderId: 7,
			targetId: 105,
			senderNickname: '김철수',
			type: 'NEW_CHAT',
			lessonTitle: '새로운 채팅',
			description: '김철수님으로부터 새로운 메시지가 도착했습니다.',
			createdAt: '2026-07-20T11:00:00Z',
			readAt: null,
			isRead: false,
		},
	];
};
