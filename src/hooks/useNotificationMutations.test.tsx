import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { markAllNotificationsAsRead, markNotificationAsRead } from '@/api/notification.api';
import { useMarkAllAsReadMutation, useMarkAsReadMutation } from '@/hooks/useNotificationMutations';
import type { FetchNotificationsResponse } from '@/models/notification.model';
import { createNotificationFixture } from '@/test/fixtures/notification.fixture';

// 읽음 처리의 낙관적 업데이트 로직을 검증

vi.mock('@/api/notification.api', () => ({
	markNotificationAsRead: vi.fn(),
	markAllNotificationsAsRead: vi.fn(),
}));

const createQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: { retry: false },
			mutations: { retry: false },
		},
	});

const createWrapper = (queryClient: QueryClient) => {
	return ({ children }: { children: ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

const createNotificationsResponse = (): FetchNotificationsResponse => ({
	data: [
		createNotificationFixture('PARTICIPATION_REQUEST', { id: 1, isRead: false, readAt: null }),
		createNotificationFixture('PAYMENT_SUCCESS', { id: 2, isRead: false, readAt: null }),
	],
	meta: { page: 1, limit: 10, totalCount: 2, totalPages: 1 },
});

describe('useNotificationMutations', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('optimistically marks single notification as read and invalidates', async () => {
		vi.mocked(markNotificationAsRead).mockResolvedValue({ success: true });
		const queryClient = createQueryClient();
		const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
		queryClient.setQueryData(['notifications', 1, 10], createNotificationsResponse());

		const { result } = renderHook(() => useMarkAsReadMutation(), {
			wrapper: createWrapper(queryClient),
		});

		result.current.mutate(1);

		await waitFor(() => {
			const optimistic = queryClient.getQueryData<FetchNotificationsResponse>([
				'notifications',
				1,
				10,
			]);
			expect(optimistic?.data[0].isRead).toBe(true);
			expect(optimistic?.data[0].readAt).not.toBeNull();
		});

		await waitFor(() => {
			expect(markNotificationAsRead).toHaveBeenCalledWith(1);
			expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['notifications'] });
		});
	});

	it('rolls back optimistic update when single mark-as-read fails', async () => {
		vi.mocked(markNotificationAsRead).mockRejectedValue(new Error('network'));
		const queryClient = createQueryClient();
		queryClient.setQueryData(['notifications', 1, 10], createNotificationsResponse());

		const { result } = renderHook(() => useMarkAsReadMutation(), {
			wrapper: createWrapper(queryClient),
		});

		result.current.mutate(1);

		await waitFor(() => {
			const rolledBack = queryClient.getQueryData<FetchNotificationsResponse>([
				'notifications',
				1,
				10,
			]);
			expect(rolledBack?.data[0].isRead).toBe(false);
			expect(rolledBack?.data[0].readAt).toBeNull();
		});
	});

	it('optimistically marks all as read and invalidates', async () => {
		vi.mocked(markAllNotificationsAsRead).mockResolvedValue({ success: true });
		const queryClient = createQueryClient();
		const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
		queryClient.setQueryData(['notifications', 1, 10], createNotificationsResponse());

		const { result } = renderHook(() => useMarkAllAsReadMutation(), {
			wrapper: createWrapper(queryClient),
		});

		result.current.mutate();

		await waitFor(() => {
			const optimistic = queryClient.getQueryData<FetchNotificationsResponse>([
				'notifications',
				1,
				10,
			]);
			expect(optimistic?.data.every((item) => item.isRead)).toBe(true);
		});

		await waitFor(() => {
			expect(markAllNotificationsAsRead).toHaveBeenCalled();
			expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['notifications'] });
		});
	});

	it('rolls back optimistic update when mark-all fails', async () => {
		vi.mocked(markAllNotificationsAsRead).mockRejectedValue(new Error('network'));
		const queryClient = createQueryClient();
		queryClient.setQueryData(['notifications', 1, 10], createNotificationsResponse());

		const { result } = renderHook(() => useMarkAllAsReadMutation(), {
			wrapper: createWrapper(queryClient),
		});

		result.current.mutate();

		await waitFor(() => {
			const rolledBack = queryClient.getQueryData<FetchNotificationsResponse>([
				'notifications',
				1,
				10,
			]);
			expect(rolledBack?.data.every((item) => item.isRead === false)).toBe(true);
		});
	});
});
