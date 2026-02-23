import { http, HttpResponse } from 'msw';

import type { NotificationListItemDto, NotificationType } from '@/models/notification.model';

import { httpUrl } from './mockData/mockData';

const now = new Date();

const isoBeforeMinutes = (minutes: number) =>
	new Date(now.getTime() - minutes * 60 * 1000).toISOString();

const createItem = (
	notificationId: number,
	type: NotificationType,
	options: {
		message?: string;
		isRead?: boolean;
		meetingId?: number;
		meetingTitle?: string;
		lessonId?: number;
		lessonTitle?: string;
		roomId?: number;
		minutesAgo?: number;
	},
): NotificationListItemDto => ({
	notificationId,
	type,
	message: options.message,
	isRead: options.isRead ?? false,
	createdAt: isoBeforeMinutes(options.minutesAgo ?? notificationId),
	readAt: options.isRead ? isoBeforeMinutes((options.minutesAgo ?? notificationId) - 1) : null,
	metadata: {
		meetingId: options.meetingId,
		meetingTitle: options.meetingTitle,
		lessonId: options.lessonId,
		lessonTitle: options.lessonTitle,
		roomId: options.roomId,
	},
});

const initialNotifications: NotificationListItemDto[] = [
	createItem(1, 'NEW_CHAT', {
		message: '새 메시지가 도착했습니다.',
		lessonId: 1,
		lessonTitle: '레슨 1 문의',
		roomId: 101,
		minutesAgo: 2,
	}),
	createItem(2, 'PARTICIPATION_REQUEST', {
		message: '새로운 참여 신청이 있습니다.',
		meetingId: 12,
		meetingTitle: '주말 러닝 모임',
		minutesAgo: 5,
	}),
	createItem(3, 'PARTICIPATION_ACCEPTED', {
		lessonId: 45,
		lessonTitle: '도자기 원데이 클래스',
		minutesAgo: 9,
	}),
	createItem(4, 'PARTICIPATION_REJECTED', {
		meetingId: 24,
		meetingTitle: '보드게임 모임',
		minutesAgo: 14,
	}),
	createItem(5, 'PARTICIPATION_CANCELED', {
		lessonId: 28,
		lessonTitle: '베이킹 클래스',
		minutesAgo: 18,
	}),
	createItem(6, 'MEETING_DELETED', {
		meetingId: 77,
		meetingTitle: '삭제된 모임',
		minutesAgo: 25,
	}),
	createItem(7, 'COMMENT_ON_LESSON', {
		lessonId: 19,
		lessonTitle: '캘리그라피',
		minutesAgo: 31,
	}),
	createItem(8, 'REPLY_ON_COMMENT', {
		lessonId: 19,
		lessonTitle: '캘리그라피',
		minutesAgo: 40,
	}),
	createItem(9, 'PAYMENT_SUCCESS', {
		lessonId: 31,
		lessonTitle: '영어 회화',
		minutesAgo: 47,
	}),
	createItem(10, 'PAYMENT_CANCELED', {
		lessonId: 31,
		lessonTitle: '영어 회화',
		minutesAgo: 55,
	}),
	createItem(11, 'LESSON_CANCELED', {
		lessonId: 33,
		lessonTitle: '요가 클래스',
		minutesAgo: 63,
	}),
	createItem(12, 'REMINDER_24H', {
		lessonId: 45,
		lessonTitle: '도자기 원데이 클래스',
		minutesAgo: 71,
	}),
	createItem(13, 'REMINDER_1H', {
		lessonId: 45,
		lessonTitle: '도자기 원데이 클래스',
		minutesAgo: 79,
	}),
	createItem(14, 'REVIEW_REQUEST', {
		lessonId: 52,
		lessonTitle: '프랑스 자수',
		minutesAgo: 91,
	}),
	// message 없는 케이스 fallback 검증
	createItem(15, 'PARTICIPATION_ACCEPTED', {
		meetingId: 15,
		meetingTitle: '무메시지 승인 테스트',
		minutesAgo: 120,
	}),
];

let mockNotifications: NotificationListItemDto[] = [...initialNotifications];

const paginate = (items: NotificationListItemDto[], page: number, limit: number) => {
	const start = (page - 1) * limit;
	return items.slice(start, start + limit);
};

export const notificationHandlers = [
	http.get(`${httpUrl}/notifications`, ({ request }) => {
		const url = new URL(request.url);
		const page = Number(url.searchParams.get('page') ?? 1);
		const limit = Number(url.searchParams.get('limit') ?? 10);

		const sorted = [...mockNotifications].sort(
			(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
		);

		return HttpResponse.json({
			data: paginate(sorted, page, limit),
			meta: {
				page,
				limit,
				totalCount: sorted.length,
				totalPages: Math.ceil(sorted.length / limit),
			},
		});
	}),

	http.patch(`${httpUrl}/notifications/:notificationId/read`, ({ params }) => {
		const notificationId = Number(params.notificationId);
		mockNotifications = mockNotifications.map((notif) =>
			notif.notificationId === notificationId
				? { ...notif, isRead: true, readAt: new Date().toISOString() }
				: notif,
		);
		return HttpResponse.json({ success: true });
	}),

	http.patch(`${httpUrl}/notifications/read-all`, () => {
		mockNotifications = mockNotifications.map((notif) => ({
			...notif,
			isRead: true,
			readAt: new Date().toISOString(),
		}));
		return HttpResponse.json({ success: true });
	}),

	http.post(`${httpUrl}/notifications`, async ({ request }) => {
		const payload = (await request.json()) as Omit<
			NotificationListItemDto,
			'notificationId' | 'createdAt' | 'isRead' | 'readAt'
		>;
		const nextId =
			mockNotifications.length > 0
				? Math.max(...mockNotifications.map((n) => n.notificationId)) + 1
				: 1;

		const newNotification: NotificationListItemDto = {
			...payload,
			notificationId: nextId,
			createdAt: new Date().toISOString(),
			isRead: false,
			readAt: null,
		};
		mockNotifications = [newNotification, ...mockNotifications];
		return HttpResponse.json(newNotification, { status: 201 });
	}),

	http.delete(`${httpUrl}/notifications/:notificationId`, ({ params }) => {
		const notificationId = Number(params.notificationId);
		const before = mockNotifications.length;
		mockNotifications = mockNotifications.filter(
			(notif) => notif.notificationId !== notificationId,
		);
		if (mockNotifications.length < before) return HttpResponse.json({ success: true });
		return HttpResponse.json(
			{ success: false, message: 'Notification not found' },
			{ status: 404 },
		);
	}),
];

export { mockNotifications };

export const getMockNotifications = () => mockNotifications;

export const addMockNotification = (
	notification: Omit<
		NotificationListItemDto,
		'notificationId' | 'createdAt' | 'isRead' | 'readAt'
	>,
) => {
	const nextId =
		mockNotifications.length > 0
			? Math.max(...mockNotifications.map((n) => n.notificationId)) + 1
			: 1;

	const newNotification: NotificationListItemDto = {
		...notification,
		notificationId: nextId,
		createdAt: new Date().toISOString(),
		isRead: false,
		readAt: null,
	};
	mockNotifications = [newNotification, ...mockNotifications];
	return newNotification;
};

export const markMockNotificationAsRead = (id: number) => {
	mockNotifications = mockNotifications.map((notif) =>
		notif.notificationId === id
			? { ...notif, isRead: true, readAt: new Date().toISOString() }
			: notif,
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
	const before = mockNotifications.length;
	mockNotifications = mockNotifications.filter((notif) => notif.notificationId !== id);
	return mockNotifications.length < before;
};

export const resetMockNotifications = () => {
	mockNotifications = [...initialNotifications];
};
