import { IoIosNotifications } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

import { joinChatRoom } from '@/api/chat.api';
import { NotificationItem } from '@/components/features/notification/NotificationItem';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { resolveNotificationNavigation } from '@/constants/notificationActions';
import { useMarkAllAsReadMutation, useMarkAsReadMutation } from '@/hooks/useNotificationMutations';
import { useNotificationQuery } from '@/hooks/useNotificationQuery';
import { resetAllNewChatRooms, resetNewChatByRoom } from '@/lib/newChatNotificationState';
import type { ChatType } from '@/models/chat.model';
import { isNewChatNotification, type NotificationUiItem } from '@/models/notification.model';

const mapLinkTypeToChatType = (linkType?: string): ChatType | undefined => {
	if (linkType === 'MEETING') return 'meeting';
	if (linkType === 'LESSON') return 'lesson';
	return undefined;
};

export const NotificationDropdown = () => {
	const navigate = useNavigate();
	const { notifications, isLoading, isError } = useNotificationQuery();

	const markAsReadMutation = useMarkAsReadMutation();
	const markAllAsReadMutation = useMarkAllAsReadMutation();

	const markAsReadWithReset = (notification: NotificationUiItem) => {
		markAsReadMutation.mutate(notification.id);
		if (isNewChatNotification(notification)) {
			resetNewChatByRoom(notification.roomId);
		}
	};

	const executeNewChatAction = async (notification: NotificationUiItem) => {
		const chatType = mapLinkTypeToChatType(notification.linkType);

		if (notification.roomId) {
			navigate('/chats', { state: { roomId: notification.roomId, chatType } });
			return;
		}

		if (notification.linkId && chatType === 'lesson') {
			try {
				const room = await joinChatRoom({ lessonId: notification.linkId });
				navigate('/chats', {
					state: {
						chatType: 'lesson',
						roomId: room.roomId,
						lessonId: notification.linkId,
					},
				});
				return;
			} catch {
				navigate('/chats', {
					state: {
						chatType: 'lesson',
						lessonId: notification.linkId,
					},
				});
				return;
			}
		}

		if (notification.linkId && chatType === 'meeting') {
			try {
				const room = await joinChatRoom({ meetingId: notification.linkId });
				navigate('/chats', {
					state: {
						chatType: 'meeting',
						roomId: room.roomId,
						meetingId: notification.linkId,
					},
				});
				return;
			} catch {
				navigate('/chats', {
					state: {
						chatType: 'meeting',
						meetingId: notification.linkId,
					},
				});
				return;
			}
		}

		navigate('/chats');
	};

	const executeNotificationAction = async (notification: NotificationUiItem) => {
		if (notification.type === 'NEW_CHAT') {
			await executeNewChatAction(notification);
			return;
		}

		const target = resolveNotificationNavigation(notification);
		if (!target) {
			navigate('/mypage');
			return;
		}

		navigate(target.path, target.state ? { state: target.state } : undefined);
	};

	const handleNotificationClick = (notification: NotificationUiItem) => {
		markAsReadWithReset(notification);
		void executeNotificationAction(notification); // 반환 Promise를 기다리지 않아 void 추가
	};

	const handleMarkAllRead = () => {
		markAllAsReadMutation.mutate();
		resetAllNewChatRooms();
	};

	const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0;

	if (isLoading) {
		return (
			<button className="relative">
				<Skeleton className="h-10 w-10 rounded-full" />
			</button>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button className="relative rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
					<Avatar className="cursor-pointer border-none bg-medium transition-colors hover:bg-accent hover:text-accent-foreground">
						<AvatarImage alt="Notification Avatar" />
						<AvatarFallback className="bg-medium">
							<IoIosNotifications
								className={`h-7 w-7 ${isError ? 'text-red-500' : 'text-foreground/80'}`}
							/>
						</AvatarFallback>
					</Avatar>
					{unreadCount > 0 && !isError && (
						<span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white ring-2 ring-background">
							{unreadCount}
						</span>
					)}
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-80" align="end">
				<DropdownMenuLabel className="flex items-center justify-between">
					<span>최근 알림</span>
					<Button
						variant="ghost"
						size="sm"
						className="h-auto p-1 text-xs"
						onClick={handleMarkAllRead}
						disabled={unreadCount === 0 || markAllAsReadMutation.isPending || isError}
					>
						전체 읽음
					</Button>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{isError ? (
					<DropdownMenuLabel className="text-center text-red-500">
						알림을 불러오지 못했습니다.
					</DropdownMenuLabel>
				) : notifications && notifications.length > 0 ? (
					notifications.map((notification) => (
						<NotificationItem
							key={notification.id}
							notification={notification}
							onClick={handleNotificationClick}
							onMarkAsRead={markAsReadWithReset}
						/>
					))
				) : (
					<DropdownMenuLabel className="text-center text-gray-500">
						새로운 알림이 없습니다.
					</DropdownMenuLabel>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
