import type { ReactNode } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NotificationDropdown } from '@/components/common/NotificationDropdown';
import type { NotificationUiItem } from '@/models/notification.model';
import {
	createNewChatNotificationFixture,
	createNotificationFixture,
} from '@/test/fixtures/notification.fixture';

// 사용자가 실제로 알림을 클릭했을 때의 핵심 UX 흐름을 검증
// 알림 클릭 동작 회귀를 막는 통합 테스트

const mockNavigate = vi.fn();
const mockJoinChatRoom = vi.fn();
const mockMarkAsReadMutate = vi.fn();
const mockMarkAllAsReadMutate = vi.fn();
const mockResetNewChatByRoom = vi.fn();
const mockResetAllNewChatRooms = vi.fn();

let mockNotifications: NotificationUiItem[] = [];
let mockIsLoading = false;
let mockIsError = false;

vi.mock('react-router-dom', () => ({
	useNavigate: () => mockNavigate,
}));

vi.mock('@/api/chat.api', () => ({
	joinChatRoom: (...args: Parameters<typeof mockJoinChatRoom>) => mockJoinChatRoom(...args),
}));

vi.mock('@/hooks/useNotificationQuery', () => ({
	useNotificationQuery: () => ({
		notifications: mockNotifications,
		isLoading: mockIsLoading,
		isError: mockIsError,
	}),
}));

vi.mock('@/hooks/useNotificationMutations', () => ({
	useMarkAsReadMutation: () => ({
		mutate: mockMarkAsReadMutate,
	}),
	useMarkAllAsReadMutation: () => ({
		mutate: mockMarkAllAsReadMutate,
		isPending: false,
	}),
}));

vi.mock('@/lib/newChatNotificationState', () => ({
	resetNewChatByRoom: (...args: Parameters<typeof mockResetNewChatByRoom>) =>
		mockResetNewChatByRoom(...args),
	resetAllNewChatRooms: () => mockResetAllNewChatRooms(),
}));

vi.mock('@/components/ui/dropdown-menu', () => ({
	DropdownMenu: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	DropdownMenuTrigger: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	DropdownMenuContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	DropdownMenuLabel: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	DropdownMenuSeparator: () => <hr />,
	DropdownMenuItem: ({ children, onClick }: { children: ReactNode; onClick?: () => void }) => (
		<button type="button" onClick={onClick}>
			{children}
		</button>
	),
}));

vi.mock('@/components/ui/avatar', () => ({
	Avatar: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	AvatarImage: () => <span>avatar-image</span>,
	AvatarFallback: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/ui/button', () => ({
	Button: ({
		children,
		onClick,
		disabled,
	}: {
		children: ReactNode;
		onClick?: () => void;
		disabled?: boolean;
	}) => (
		<button type="button" onClick={onClick} disabled={disabled}>
			{children}
		</button>
	),
}));

vi.mock('@/components/ui/skeleton', () => ({
	Skeleton: () => <div>loading</div>,
}));

vi.mock('@/components/features/notification/NotificationItem', () => ({
	NotificationItem: ({
		notification,
		onClick,
		onMarkAsRead,
	}: {
		notification: NotificationUiItem;
		onClick: (notification: NotificationUiItem) => void;
		onMarkAsRead: (notification: NotificationUiItem) => void;
	}) => (
		<div>
			<button type="button" onClick={() => onClick(notification)}>
				item-{notification.id}
			</button>
			<button type="button" onClick={() => onMarkAsRead(notification)}>
				mark-{notification.id}
			</button>
		</div>
	),
}));

describe('NotificationDropdown', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockNotifications = [];
		mockIsLoading = false;
		mockIsError = false;
	});

	it('shows unread count badge', () => {
		mockNotifications = [
			createNotificationFixture('PARTICIPATION_REQUEST', { id: 1, isRead: false }),
			createNotificationFixture('PAYMENT_SUCCESS', { id: 2, isRead: false }),
			createNotificationFixture('REMINDER_24H', { id: 3, isRead: true }),
		];

		render(<NotificationDropdown />);
		expect(screen.getByText('2')).toBeInTheDocument();
	});

	it('navigates on non-chat notification click', async () => {
		mockNotifications = [
			createNotificationFixture('PARTICIPATION_ACCEPTED', {
				id: 10,
				linkType: 'LESSON',
				linkId: 77,
			}),
		];

		render(<NotificationDropdown />);
		await userEvent.click(screen.getByText('item-10'));

		expect(mockMarkAsReadMutate).toHaveBeenCalledWith(10);
		expect(mockNavigate).toHaveBeenCalledWith('/lessons/77', undefined);
	});

	it('handles NEW_CHAT with roomId', async () => {
		mockNotifications = [
			createNewChatNotificationFixture({
				id: 20,
				roomId: 101,
				linkType: 'LESSON',
			}),
		];

		render(<NotificationDropdown />);
		await userEvent.click(screen.getByText('item-20'));

		expect(mockMarkAsReadMutate).toHaveBeenCalledWith(20);
		expect(mockResetNewChatByRoom).toHaveBeenCalledWith(101);
		expect(mockNavigate).toHaveBeenCalledWith('/chats', {
			state: { roomId: 101, chatType: 'lesson' },
		});
	});

	it('handles NEW_CHAT without roomId (lesson) with join success', async () => {
		mockJoinChatRoom.mockResolvedValue({ roomId: 300 });
		mockNotifications = [
			createNewChatNotificationFixture({
				id: 21,
				roomId: undefined,
				linkType: 'LESSON',
				linkId: 55,
			}),
		];

		render(<NotificationDropdown />);
		await userEvent.click(screen.getByText('item-21'));

		await waitFor(() => {
			expect(mockJoinChatRoom).toHaveBeenCalledWith({ lessonId: 55 });
			expect(mockNavigate).toHaveBeenCalledWith('/chats', {
				state: { chatType: 'lesson', roomId: 300, lessonId: 55 },
			});
		});
	});

	it('handles NEW_CHAT without roomId (lesson) with join failure fallback', async () => {
		mockJoinChatRoom.mockRejectedValue(new Error('fail'));
		mockNotifications = [
			createNewChatNotificationFixture({
				id: 22,
				roomId: undefined,
				linkType: 'LESSON',
				linkId: 56,
			}),
		];

		render(<NotificationDropdown />);
		await userEvent.click(screen.getByText('item-22'));

		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith('/chats', {
				state: { chatType: 'lesson', lessonId: 56 },
			});
		});
	});

	it('handles NEW_CHAT without roomId (meeting) with join success', async () => {
		mockJoinChatRoom.mockResolvedValue({ roomId: 301 });
		mockNotifications = [
			createNewChatNotificationFixture({
				id: 23,
				roomId: undefined,
				linkType: 'MEETING',
				linkId: 57,
			}),
		];

		render(<NotificationDropdown />);
		await userEvent.click(screen.getByText('item-23'));

		await waitFor(() => {
			expect(mockJoinChatRoom).toHaveBeenCalledWith({ meetingId: 57 });
			expect(mockNavigate).toHaveBeenCalledWith('/chats', {
				state: { chatType: 'meeting', roomId: 301, meetingId: 57 },
			});
		});
	});

	it('handles NEW_CHAT without roomId (meeting) with join failure fallback', async () => {
		mockJoinChatRoom.mockRejectedValue(new Error('fail'));
		mockNotifications = [
			createNewChatNotificationFixture({
				id: 24,
				roomId: undefined,
				linkType: 'MEETING',
				linkId: 58,
			}),
		];

		render(<NotificationDropdown />);
		await userEvent.click(screen.getByText('item-24'));

		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith('/chats', {
				state: { chatType: 'meeting', meetingId: 58 },
			});
		});
	});

	it('marks all as read and resets NEW_CHAT lock state', async () => {
		mockNotifications = [
			createNotificationFixture('PARTICIPATION_REQUEST', { id: 31, isRead: false }),
		];

		render(<NotificationDropdown />);
		await userEvent.click(screen.getByRole('button', { name: '전체 읽음' }));

		expect(mockMarkAllAsReadMutate).toHaveBeenCalled();
		expect(mockResetAllNewChatRooms).toHaveBeenCalled();
	});
});
