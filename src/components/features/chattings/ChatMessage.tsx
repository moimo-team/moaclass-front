import defaultProfileIcon from '@/assets/images/profile.png';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ChatMessage as ChatMessageType } from '@/models/chat.model';
import { getImageSrc } from '@/utils/imageUtils';

interface ChatMessageProps {
	message: ChatMessageType;
	isMine: boolean;
	hostId: number;
	hostBadgeLabel?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
	message,
	isMine,
	hostId,
	hostBadgeLabel = '호스트',
}) => {
	const { content, createdAt } = message;
	const sender = message.sender;

	const isHost = sender.id === hostId;
	const defaultProfileImage = getImageSrc(defaultProfileIcon);
	const senderImageSrc =
		typeof sender.image === 'string' && sender.image.trim().length > 0
			? sender.image
			: defaultProfileImage;

	return (
		<div
			className={cn(
				'flex items-start gap-3 p-4 max-w-[75%]',
				isMine ? 'self-end flex-row-reverse' : 'self-start',
			)}
		>
			{!isMine && (
				<Avatar className="w-10 h-10">
					<AvatarImage src={senderImageSrc} alt={sender.nickname} />
					<AvatarFallback>{sender.nickname?.slice(0, 2) || 'NN'}</AvatarFallback>
				</Avatar>
			)}

			<div className={cn('flex flex-col gap-1', isMine ? 'items-end' : 'items-start')}>
				{!isMine && (
					<div className="flex items-center gap-2">
						<span className="font-semibold text-sm">{sender.nickname}</span>
						{isHost && (
							<Badge
								variant="outline"
								className="bg-orange-100 text-orange-700 border-orange-300"
							>
								{hostBadgeLabel}
							</Badge>
						)}
					</div>
				)}
				<div
					className={cn(
						'flex gap-2 items-end',
						isMine ? 'flex-row-reverse' : 'flex-row',
						'lg:flex-row lg:items-end lg:gap-2',
					)}
				>
					<div
						className={cn(
							'p-3 rounded-lg max-w-md',
							isMine
								? 'bg-primary text-primary-foreground rounded-tr-none'
								: 'bg-muted rounded-tl-none',
						)}
					>
						<p className="text-sm">{content}</p>
					</div>

					<time className="text-xs text-muted-foreground">
						{new Date(createdAt).toLocaleTimeString([], {
							hour: '2-digit',
							minute: '2-digit',
						})}
					</time>
				</div>
			</div>
		</div>
	);
};

export default ChatMessage;
