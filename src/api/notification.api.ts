import { apiClient } from '@/api/client';
import type {
	FetchNotificationsResponse,
	NotificationListItemDto,
	NotificationSocketPayload,
	NotificationUiItem,
} from '@/models/notification.model';

export interface FetchNotificationsParams {
	page?: number;
	limit?: number;
}

const isListItemDto = (
	item: NotificationListItemDto | NotificationUiItem,
): item is NotificationListItemDto => {
	return 'notificationId' in item;
};

export const mapNotificationDtoToUiItem = (
	item: NotificationListItemDto | NotificationUiItem,
): NotificationUiItem => {
	if (!isListItemDto(item)) {
		return {
			...item,
		};
	}

	const metadata = item.metadata ?? {};
	const linkId = metadata.meetingId ?? metadata.lessonId;
	const linkType = metadata.meetingId ? 'MEETING' : metadata.lessonId ? 'LESSON' : undefined;

	return {
		id: item.notificationId,
		type: item.type,
		message: item.message,
		description: item.message,
		linkId,
		linkType,
		roomId: metadata.roomId,
		meetingTitle: metadata.meetingTitle,
		lessonTitle: metadata.lessonTitle,
		isRead: item.isRead,
		createdAt: item.createdAt,
		readAt: item.readAt ?? null,
	};
};

export const fetchNotifications = async (
	params: FetchNotificationsParams = {},
): Promise<FetchNotificationsResponse> => {
	const { page = 1, limit = 10 } = params;
	const response = await apiClient.get<{
		data: Array<NotificationListItemDto | NotificationUiItem>;
		meta: FetchNotificationsResponse['meta'];
	}>('/notifications', {
		params: { page, limit },
	});

	return {
		data: response.data.data.map(mapNotificationDtoToUiItem),
		meta: response.data.meta,
	};
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

export const mapSocketPayloadToNotification = (
	payload: NotificationSocketPayload,
): NotificationUiItem => {
	return {
		...payload,
		isRead: false,
		readAt: null,
		createdAt: new Date().toISOString(),
	};
};
