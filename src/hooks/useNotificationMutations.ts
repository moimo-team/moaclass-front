import { useMutation, useQueryClient } from '@tanstack/react-query';

import { markAllNotificationsAsRead, markNotificationAsRead } from '@/api/notification.api';
import type { FetchNotificationsResponse } from '@/models/notification.model';

type NotificationsQuerySnapshot = Array<
	[readonly unknown[], FetchNotificationsResponse | undefined]
>;

export const useMarkAsReadMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (notificationId: number) => markNotificationAsRead(notificationId),
		onMutate: async (notificationId) => {
			await queryClient.cancelQueries({ queryKey: ['notifications'] });

			const previousQueries = queryClient.getQueriesData<FetchNotificationsResponse>({
				queryKey: ['notifications'],
			}) as NotificationsQuerySnapshot;

			const readAt = new Date().toISOString();

			queryClient.setQueriesData<FetchNotificationsResponse>(
				{ queryKey: ['notifications'] },
				(oldData) => {
					if (!oldData) return oldData;
					return {
						...oldData,
						data: oldData.data.map((notification) =>
							notification.id === notificationId
								? { ...notification, isRead: true, readAt }
								: notification,
						),
					};
				},
			);

			return { previousQueries };
		},
		onError: (_, _notificationId, context) => {
			context?.previousQueries.forEach(([queryKey, data]) => {
				queryClient.setQueryData(queryKey, data);
			});
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['notifications'] });
		},
	});
};

export const useMarkAllAsReadMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => markAllNotificationsAsRead(),
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: ['notifications'] });

			const previousQueries = queryClient.getQueriesData<FetchNotificationsResponse>({
				queryKey: ['notifications'],
			}) as NotificationsQuerySnapshot;

			const readAt = new Date().toISOString();

			queryClient.setQueriesData<FetchNotificationsResponse>(
				{ queryKey: ['notifications'] },
				(oldData) => {
					if (!oldData) return oldData;
					return {
						...oldData,
						data: oldData.data.map((notification) => ({
							...notification,
							isRead: true,
							readAt,
						})),
					};
				},
			);

			return { previousQueries };
		},
		onError: (_, _variables, context) => {
			context?.previousQueries.forEach(([queryKey, data]) => {
				queryClient.setQueryData(queryKey, data);
			});
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['notifications'] });
		},
	});
};
