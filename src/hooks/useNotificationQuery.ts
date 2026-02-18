import { useQuery } from '@tanstack/react-query';

import { fetchNotifications, type FetchNotificationsParams } from '@/api/notification.api';
import type { Notification } from '@/models/notification.model';

export const DEFAULT_NOTIFICATION_PAGE = 1;
export const DEFAULT_NOTIFICATION_LIMIT = 10;

export const useNotificationQuery = (params: FetchNotificationsParams = {}) => {
	const page = params.page ?? DEFAULT_NOTIFICATION_PAGE;
	const limit = params.limit ?? DEFAULT_NOTIFICATION_LIMIT;

	return useQuery<Notification[], Error>({
		queryKey: ['notifications', page, limit],
		queryFn: () => fetchNotifications({ page, limit }),
	});
};
