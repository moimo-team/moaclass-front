import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ChatMessage as ChatMessageType } from "@/models/chat.model";
import defaultProfileIcon from "@/assets/images/profile.png";

interface ChatMessageProps {
  message: ChatMessageType;
  isMine: boolean;
  hostId: number;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isMine,
  hostId,
}) => {
  const { content, createdAt, sender } = message;

  // 메시지 발신자가 호스트인지 확인
  const isHost = sender.id === hostId;

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 max-w-[75%]",
        isMine ? "self-end flex-row-reverse" : "self-start",
      )}
    >
      {/* 상대방 메시지일 때만 프로필 이미지와 닉네임 표시 */}
      {!isMine && (
        <Avatar className="w-10 h-10">
          <AvatarImage
            src={sender.image || defaultProfileIcon}
            alt={sender.nickname}
          />
          <AvatarFallback>
            {sender.nickname?.slice(0, 2) || "NN"}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "flex flex-col gap-1",
          isMine ? "items-end" : "items-start",
        )}
      >
        {/* 상대방 메시지일 때만 닉네임과 뱃지 표시 */}
        {!isMine && (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{sender.nickname}</span>
            {isHost && (
              <Badge
                variant="outline"
                className="bg-orange-100 text-orange-700 border-orange-300"
              >
                호스트
              </Badge>
            )}
          </div>
        )}
        <div
          className={cn(
            "flex gap-2 items-end",
            isMine ? "flex-row-reverse" : "flex-row",
            "lg:flex-row lg:items-end lg:gap-2",
          )}
        >
          {/* 메시지 버블 */}
          <div
            className={cn(
              "p-3 rounded-lg max-w-md",
              isMine
                ? "bg-primary text-primary-foreground rounded-tr-none"
                : "bg-muted rounded-tl-none",
            )}
          >
            <p className="text-sm">{content}</p>
          </div>

          {/* 보낸 시간 */}
          <time className="text-xs text-muted-foreground">
            {new Date(createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
