import type { Notification } from '@/models/notification.model';

import { apiClient } from './client';

// TODO: URL 수정
export const fetchNotifications = async (): Promise<Notification[]> => {
	const response = await apiClient.get<Notification[]>('/notifications');
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
