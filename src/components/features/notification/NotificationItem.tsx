import { FaCircle } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { resolveNotificationTitle } from '@/constants/notificationActions';
import { resolveNotificationMessage } from '@/constants/notificationMessages';
import { cn } from '@/lib/utils';
import type { NotificationUiItem } from '@/models/notification.model';
import { formatRelativeTime } from '@/utils/dateFormat';

export interface NotificationItemProps {
	notification: NotificationUiItem;
	onClick: (notification: NotificationUiItem) => void;
	onMarkAsRead: (notification: NotificationUiItem) => void;
}

const getNotificationBody = (notification: NotificationUiItem) =>
	resolveNotificationMessage(notification);

export const NotificationItem = ({
	notification,
	onClick,
	onMarkAsRead,
}: NotificationItemProps) => {
	return (
		<DropdownMenuItem
			onClick={() => onClick(notification)}
			className={cn('flex w-full cursor-pointer items-start gap-3 p-3')}
		>
			{/* 붉은 점 */}
			<div className="mt-1 h-2 w-2">
				{!notification.isRead && <FaCircle className="h-full w-full text-red-500" />}
			</div>

			{/* 메세지 섹션 */}
			<div className="flex flex-grow flex-col gap-1">
				<div className="flex items-baseline justify-between">
					<span
						className={cn(
							'line-clamp-1 text-sm font-semibold',
							notification.isRead ? 'text-gray-500' : 'text-foreground',
						)}
					>
						{resolveNotificationTitle(notification)}
					</span>
					<span
						className={cn(
							'ml-2 flex-shrink-0 text-xs',
							notification.isRead ? 'text-gray-500' : 'text-gray-400',
						)}
					>
						{formatRelativeTime(notification.createdAt)}
					</span>
				</div>
				<p
					className={cn(
						'line-clamp-2 text-xs',
						notification.isRead ? 'text-gray-500' : 'text-gray-600',
					)}
				>
					{getNotificationBody(notification)}
				</p>
			</div>

			{/* 읽음 버튼 */}
			<div className="flex w-10 flex-shrink-0 justify-end self-center">
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
