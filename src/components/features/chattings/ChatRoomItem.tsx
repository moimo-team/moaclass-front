import defaultMeetingIcon from '@/assets/images/moaclass-chat.png'; // 모임 기본 이미지 import
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getImageSrc } from '@/utils/imageUtils';

interface ChatRoomItemProps {
	id: string | number;
	meetingImage: string | null; // null 타입 추가
	meetingTitle: string;
	lastMessageContent: string;
	lastMessageTime: string;
}

const ChatRoomItem: React.FC<ChatRoomItemProps> = ({
	id,
	meetingImage,
	meetingTitle,
	lastMessageContent,
	lastMessageTime,
}) => {
	const previewMessage =
		lastMessageContent.length > 24
			? `${lastMessageContent.slice(0, 24)}...`
			: lastMessageContent;

	const defaultMeetingImage = getImageSrc(defaultMeetingIcon);
	const meetingImageSrc =
		typeof meetingImage === 'string' && meetingImage.trim().length > 0
			? meetingImage
			: defaultMeetingImage;

	return (
		<div key={id} className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer">
			{/* 왼쪽: 모임 이미지 */}
			<Avatar className="w-12 h-12">
				<AvatarImage src={meetingImageSrc} alt={meetingTitle} />
				<AvatarFallback>{meetingTitle.slice(0, 2)}</AvatarFallback>
			</Avatar>

			{/* 오른쪽: 모임 제목, 마지막 대화 내용, 보낸 시각 */}
			<div className="flex min-w-0 flex-col flex-grow">
				<div className="truncate font-semibold text-base">{meetingTitle}</div>
				<div className="mt-0.5 flex items-center justify-between gap-2 text-sm text-muted-foreground">
					<p className="min-w-0 flex-1 truncate lg:max-w-[65%]">{previewMessage}</p>
					<time className="shrink-0 text-xs">{lastMessageTime}</time>
				</div>
			</div>
		</div>
	);
};

export default ChatRoomItem;
