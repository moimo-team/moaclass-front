import { FaCircle } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { Notification } from '@/models/notification.model';
import { formatRelativeTime } from '@/utils/dateFormat';

export interface NotificationItemProps {
	notification: Notification;
	onClick: (notification: Notification) => void;
	onMarkAsRead: (notification: Notification) => void;
}

const getNotificationTitle = (notification: Notification) =>
	notification.type === 'NEW_CHAT'
		? `[${notification.linkType === 'MEETING' ? '모임 채팅' : '클래스 문의'}] ${
				notification.lessonTitle || '채팅방'
			}${notification.senderNickname ? ` · ${notification.senderNickname}님` : ''} 새 메시지`
		: notification.lessonTitle || notification.message || 'Notification';

const getNotificationBody = (notification: Notification) =>
	notification.message || notification.description || '';

export const NotificationItem = ({
	notification,
	onClick,
	onMarkAsRead,
}: NotificationItemProps) => {
	return (
		<DropdownMenuItem
			onClick={() => onClick(notification)}
			className={cn('flex items-start gap-3 p-3 cursor-pointer w-full')}
		>
			{/* 붉은 점 */}
			<div className="w-2 h-2 mt-1">
				{!notification.isRead && <FaCircle className="w-full h-full text-red-500" />}
			</div>

			{/* 메세지 섹션 */}
			<div className="flex-grow flex flex-col gap-1">
				<div className="flex justify-between items-baseline">
					<span
						className={cn(
							'font-semibold text-sm line-clamp-1',
							notification.isRead ? 'text-gray-500' : 'text-foreground',
						)}
					>
						{getNotificationTitle(notification)}
					</span>
					<span
						className={cn(
							'text-xs flex-shrink-0 ml-2',
							notification.isRead ? 'text-gray-500' : 'text-gray-400',
						)}
					>
						{formatRelativeTime(notification.createdAt)}
					</span>
				</div>
				<p
					className={cn(
						'text-xs line-clamp-2',
						notification.isRead ? 'text-gray-500' : 'text-gray-600',
					)}
				>
					{getNotificationBody(notification)}
				</p>
			</div>

			{/* 읽음 버튼 */}
			<div className="w-10 flex-shrink-0 flex justify-end self-center">
				{!notification.isRead && (
					<Button
						variant="ghost"
						size="sm"
						className="h-auto p-1 text-xs"
						onClick={(e) => {
							e.stopPropagation();
							onMarkAsRead(notification);
						}}
					>
						읽음
					</Button>
				)}
			</div>
		</DropdownMenuItem>
	);
};

export default NotificationItem;
