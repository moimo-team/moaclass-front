import { http, HttpResponse } from 'msw';

import type { Notification } from '@/models/notification.model';

const initialNotifications: Notification[] = [
	{
		id: 1,
		type: 'NEW_CHAT',
		message: '[CASE 1] roomId가 있는 NEW_CHAT',
		description: '[CASE 1] roomId가 있는 NEW_CHAT',
		roomId: 101,
		linkId: 1,
		linkType: 'LESSON',
		senderNickname: '모멘토',
		createdAt: '2026-02-17T09:10:00Z',
		readAt: null,
		isRead: false,
	},
	{
		id: 2,
		type: 'NEW_CHAT',
		message: '[CASE 2] roomId 없이 linkId만 있는 NEW_CHAT',
		description: '[CASE 2] roomId 없이 linkId만 있는 NEW_CHAT',
		linkId: 2,
		linkType: 'LESSON',
		senderNickname: '모멘티',
		createdAt: '2026-02-17T09:00:00Z',
		readAt: null,
		isRead: false,
	},
	{
		id: 3,
		type: 'NEW_CHAT',
		message: '[CASE 3] roomId와 linkId가 모두 없는 NEW_CHAT',
		description: '[CASE 3] roomId와 linkId가 모두 없는 NEW_CHAT',
		senderNickname: '알림봇',
		createdAt: '2026-02-17T08:50:00Z',
		readAt: null,
		isRead: false,
	},
	{
		id: 4,
		type: 'PARTICIPATION_REQUEST',
		message: '새로운 참여 신청이 도착했어요.',
		description: '새로운 참여 신청이 도착했어요.',
		linkId: 10,
		linkType: 'MEETING',
		createdAt: '2026-02-16T20:15:00Z',
		readAt: '2026-02-16T20:30:00Z',
		isRead: true,
	},
];

let mockNotifications: Notification[] = [...initialNotifications];

const paginate = (items: Notification[], page: number, limit: number) => {
	const start = (page - 1) * limit;
	return items.slice(start, start + limit);
};

export const notificationHandlers = [
	http.get('/api/notifications', ({ request }) => {
		const url = new URL(request.url);
		const page = Number(url.searchParams.get('page') ?? 1);
		const limit = Number(url.searchParams.get('limit') ?? 10);

		const sorted = [...mockNotifications].sort(
			(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
		);

		return HttpResponse.json(paginate(sorted, page, limit));
	}),

	http.patch('/api/notifications/:notificationId/read', ({ params }) => {
		const notificationId = Number(params.notificationId);
		mockNotifications = mockNotifications.map((notif) =>
			notif.id === notificationId
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
		const payload = (await request.json()) as Omit<
			Notification,
			'id' | 'createdAt' | 'isRead' | 'readAt'
		>;
		const newNotification: Notification = {
			...payload,
			id:
				mockNotifications.length > 0
					? Math.max(...mockNotifications.map((n) => n.id)) + 1
					: 1,
			createdAt: new Date().toISOString(),
			isRead: false,
			readAt: null,
		};
		mockNotifications = [newNotification, ...mockNotifications];
		return HttpResponse.json(newNotification, { status: 201 });
	}),

	http.delete('/api/notifications/:notificationId', ({ params }) => {
		const notificationId = Number(params.notificationId);
		const before = mockNotifications.length;
		mockNotifications = mockNotifications.filter((notif) => notif.id !== notificationId);
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
	notification: Omit<Notification, 'id' | 'createdAt' | 'isRead' | 'readAt'>,
) => {
	const newNotification: Notification = {
		...notification,
		id: mockNotifications.length > 0 ? Math.max(...mockNotifications.map((n) => n.id)) + 1 : 1,
		createdAt: new Date().toISOString(),
		isRead: false,
		readAt: null,
	};
	mockNotifications = [newNotification, ...mockNotifications];
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
	const before = mockNotifications.length;
	mockNotifications = mockNotifications.filter((notif) => notif.id !== id);
	return mockNotifications.length < before;
};

export const resetMockNotifications = () => {
	mockNotifications = [...initialNotifications];
};
