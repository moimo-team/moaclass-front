import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useGlobalChatSocket } from '@/hooks/useGlobalChatSocket';
import type { NotificationSocketPayload, NotificationUiItem } from '@/models/notification.model';

const mockInitChatSocket = vi.fn();
const mockGetChatSocket = vi.fn();
const mockUseAuthStore = vi.fn();

type NotificationListener = (payload: NotificationSocketPayload) => void;

const mockSocket = {
	on: vi.fn(),
	off: vi.fn(),
	io: {},
};

vi.mock('@/lib/chatSocket', () => ({
	initChatSocket: (...args: Parameters<typeof mockInitChatSocket>) => mockInitChatSocket(...args),
	getChatSocket: () => mockGetChatSocket(),
}));

vi.mock('@/store/authStore', () => ({
	useAuthStore: () => mockUseAuthStore(),
}));

const createQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: { retry: false },
		},
	});

const createWrapper = (queryClient: QueryClient) => {
	return ({ children }: { children: ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

const queryKey = ['notifications', 1, 10] as const;

const createSocketPayload = (
	overrides: Partial<NotificationSocketPayload> = {},
): NotificationSocketPayload => ({
	id: 1001,
	type: 'NEW_CHAT',
	message: '새 메시지',
	roomId: 201,
	linkId: 20,
	linkType: 'LESSON',
	...overrides,
});

describe('useGlobalChatSocket', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseAuthStore.mockReturnValue({
			accessToken: 'token',
			isLoggedIn: true,
		});
		mockInitChatSocket.mockResolvedValue(mockSocket);
		mockGetChatSocket.mockReturnValue(mockSocket);
	});

	it('subscribes notification event and appends to cache', async () => {
		const queryClient = createQueryClient();
		renderHook(() => useGlobalChatSocket(), {
			wrapper: createWrapper(queryClient),
		});

		await waitFor(() => {
			expect(mockSocket.on).toHaveBeenCalledWith('notification', expect.any(Function));
		});

		const listener = mockSocket.on.mock.calls.find(
			(call) => call[0] === 'notification',
		)?.[1] as NotificationListener | undefined;

		listener?.(createSocketPayload());

		const notifications = queryClient.getQueryData<NotificationUiItem[]>(queryKey);
		expect(notifications?.[0].id).toBe(1001);
		expect(notifications?.[0].type).toBe('NEW_CHAT');
	});

	it('prevents duplicated notification by id', async () => {
		const queryClient = createQueryClient();
		renderHook(() => useGlobalChatSocket(), {
			wrapper: createWrapper(queryClient),
		});

		await waitFor(() => {
			expect(mockSocket.on).toHaveBeenCalled();
		});

		const listener = mockSocket.on.mock.calls.find(
			(call) => call[0] === 'notification',
		)?.[1] as NotificationListener | undefined;

		const payload = createSocketPayload({ id: 1002 });
		listener?.(payload);
		listener?.(payload);

		const notifications = queryClient.getQueryData<NotificationUiItem[]>(queryKey) ?? [];
		expect(notifications).toHaveLength(1);
		expect(notifications[0].id).toBe(1002);
	});

	it('keeps max 10 notifications and trims read item first', async () => {
		const queryClient = createQueryClient();
		const seeded: NotificationUiItem[] = Array.from({ length: 10 }).map((_, idx) => ({
			id: idx + 1,
			type: 'PARTICIPATION_REQUEST',
			message: `n-${idx + 1}`,
			createdAt: new Date(Date.now() - idx * 1000).toISOString(),
			isRead: idx === 9,
			readAt: idx === 9 ? new Date().toISOString() : null,
		}));
		queryClient.setQueryData(queryKey, seeded);

		renderHook(() => useGlobalChatSocket(), {
			wrapper: createWrapper(queryClient),
		});

		await waitFor(() => {
			expect(mockSocket.on).toHaveBeenCalled();
		});

		const listener = mockSocket.on.mock.calls.find(
			(call) => call[0] === 'notification',
		)?.[1] as NotificationListener | undefined;
		listener?.(createSocketPayload({ id: 9999 }));

		const notifications = queryClient.getQueryData<NotificationUiItem[]>(queryKey) ?? [];
		expect(notifications).toHaveLength(10);
		expect(notifications.some((item) => item.id === 10)).toBe(false);
		expect(notifications[0].id).toBe(9999);
	});
});
