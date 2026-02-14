import { useMutation, useQueryClient } from '@tanstack/react-query';

import { markAllNotificationsAsRead, markNotificationAsRead } from '@/api/notification.api';

export const useMarkAsReadMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (notificationId: number) => markNotificationAsRead(notificationId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['notifications'] });
		},
		onError: (error) => {
			console.error('알림 읽음 실패:', error);
		},
	});
};

export const useMarkAllAsReadMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => markAllNotificationsAsRead(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['notifications'] });
		},
		onError: (error) => {
			console.error('알림 전체 읽음 실패:', error);
		},
	});
};
