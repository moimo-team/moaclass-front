import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import defaultMeetingIcon from "@/assets/images/moimer.png"; // 모임 기본 이미지 import

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
  return (
    <div
      key={id}
      className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer"
    >
      {/* 왼쪽: 모임 이미지 */}
      <Avatar className="w-12 h-12">
        <AvatarImage src={meetingImage || defaultMeetingIcon} alt={meetingTitle} />
        <AvatarFallback>{meetingTitle.slice(0, 2)}</AvatarFallback>
      </Avatar>

      {/* 오른쪽: 모임 제목, 마지막 대화 내용, 보낸 시각 */}
      <div className="flex flex-col flex-grow">
        <div className="font-semibold text-base">{meetingTitle}</div>
        <div className="flex flex-col items-start text-sm text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
          <p className="truncate max-w-[70%]">{lastMessageContent}</p>
          <time className="text-xs">{lastMessageTime}</time>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomItem;
