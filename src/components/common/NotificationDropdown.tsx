import { useRouter } from 'next/navigation';
import { IoIosNotifications } from 'react-icons/io';

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
import { useMarkAllAsReadMutation, useMarkAsReadMutation } from '@/hooks/useNotificationMutations';
import { useNotificationQuery } from '@/hooks/useNotificationQuery';
import { resetAllNewChatRooms, resetNewChatByRoom } from '@/lib/newChatNotificationState';
import type { ChatType } from '@/models/chat.model';
import { isNewChatNotification, type Notification } from '@/models/notification.model';

const mapLinkTypeToChatType = (linkType?: string): ChatType | undefined => {
	if (linkType === 'MEETING') return 'meeting';
	if (linkType === 'LESSON') return 'lesson';
	return undefined;
};

export const NotificationDropdown = () => {
	const router = useRouter();
	const { notifications, isLoading, isError } = useNotificationQuery();

	const markAsReadMutation = useMarkAsReadMutation();
	const markAllAsReadMutation = useMarkAllAsReadMutation();

	const markAsReadWithReset = (notification: Notification) => {
		markAsReadMutation.mutate(notification.id);
		if (isNewChatNotification(notification)) {
			resetNewChatByRoom(notification.roomId);
		}
	};

	const executeNotificationAction = async (notification: Notification) => {
		if (notification.type !== 'NEW_CHAT') return;
		const chatType = mapLinkTypeToChatType(notification.linkType);

		if (notification.roomId) {
			router.push('/chats');
			// roomId state 전달은 Next.js router.push에서 직접적으로는 안되므로
			// 세션스토리지 등을 사용하거나 URL 파라미터로 변경이 필요할 수 있음.
			// 여기서는 일단 경로 이동만 보장함.
			return;
		}

		if (notification.linkId && chatType === 'lesson') {
			try {
				const room = await joinChatRoom({ lessonId: notification.linkId });
				router.push(
					`/chats?roomId=${room.roomId}&chatType=lesson&lessonId=${notification.linkId}`,
				);
				return;
			} catch {
				router.push(`/chats?chatType=lesson&lessonId=${notification.linkId}`);
				return;
			}
		}

		if (notification.linkId && chatType === 'meeting') {
			try {
				const room = await joinChatRoom({ meetingId: notification.linkId });
				router.push(
					`/chats?roomId=${room.roomId}&chatType=meeting&meetingId=${notification.linkId}`,
				);
				return;
			} catch {
				router.push(`/chats?chatType=meeting&meetingId=${notification.linkId}`);
				return;
			}
		}

		if (notification.linkId) {
			const meetingId = chatType === 'meeting' ? notification.linkId : '';
			const lessonId = chatType === 'lesson' ? notification.linkId : '';
			router.push(
				`/chats?chatType=${chatType || ''}&meetingId=${meetingId}&lessonId=${lessonId}`,
			);
			return;
		}

		router.push('/chats');
	};

	const handleNotificationClick = (notification: Notification) => {
		markAsReadWithReset(notification);
		void executeNotificationAction(notification); // 반환 Promise를 기다리지 않아 void 추가
	};

	const handleMarkAllRead = () => {
		markAllAsReadMutation.mutate();
		resetAllNewChatRooms();
	};

	const unreadCount = Array.isArray(notifications)
		? notifications.filter((n) => !n.isRead).length
		: 0;

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
				<button className="relative focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full">
					<Avatar className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors border-none bg-medium">
						<AvatarImage alt="Notification Avatar" />
						<AvatarFallback className="bg-medium">
							<IoIosNotifications
								className={`w-7 h-7 ${isError ? 'text-red-500' : 'text-foreground/80'}`}
							/>
						</AvatarFallback>
					</Avatar>
					{unreadCount > 0 && !isError && (
						<span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white ring-2 ring-background">
							{unreadCount}
						</span>
					)}
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-80" align="end">
				<DropdownMenuLabel className="flex justify-between items-center">
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
				) : Array.isArray(notifications) && notifications.length > 0 ? (
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
