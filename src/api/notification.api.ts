import type { Notification } from '@/models/notification.model';

import { apiClient } from './client';

export interface FetchNotificationsParams {
	page?: number;
	limit?: number;
}

export const fetchNotifications = async (
	params: FetchNotificationsParams = {},
): Promise<Notification[]> => {
	const { page = 1, limit = 10 } = params;
	const response = await apiClient.get<Notification[]>('/notifications', {
		params: { page, limit },
	});
	return response.data;
};

export const markNotificationAsRead = async (
	notificationId: number,
): Promise<{ success: boolean }> => {
	const response = await apiClient.patch(`/notifications/${notificationId}/read`);
	return response.data;
};

export const markAllNotificationsAsRead = async (): Promise<{
	success: boolean;
}> => {
	const response = await apiClient.patch('/notifications/read-all');
	return response.data;
};
