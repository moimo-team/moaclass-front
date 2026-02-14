import { useQuery } from '@tanstack/react-query';

import { fetchNotifications } from '@/api/notification.api';
import type { Notification } from '@/models/notification.model';

export const useNotificationQuery = () => {
	return useQuery<Notification[], Error>({
		queryKey: ['notifications'],
		queryFn: fetchNotifications,
	});
};
