import { Fragment } from "react";
import { Separator } from "@/components/ui/separator";
import ChatRoomItem from "@/components/features/chattings/ChatRoomItem";
import type { ChatRoom } from "@/models/chat.model";
import { useAuthStore } from "@/store/authStore";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface ChatRoomListSectionProps {
  chatRooms: ChatRoom[] | undefined;
  isLoading: boolean;
  onSelectRoom: (room: ChatRoom) => void;
  selectedMeetingId: number | null | undefined;
}

const ChatRoomListSection: React.FC<ChatRoomListSectionProps> = ({
  chatRooms,
  isLoading,
  onSelectRoom,
  selectedMeetingId,
}) => {
  const { nickname } = useAuthStore();

  return (
    <div className={`w-full lg:w-[28%] min-w-[300px] flex-col h-full border-r`}>
      <div className="p-4 font-semibold shrink-0">
        {nickname ? `${nickname} 님의 채팅` : "로그인이 필요합니다"}
      </div>
      <Separator />
      <div className="flex-grow overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <LoadingSpinner />
          </div>
        ) : (
          <Fragment>
            {chatRooms?.map((room) => (
              <div
                key={room.meetingId}
                onClick={() => onSelectRoom(room)}
                className={
                  selectedMeetingId === room.meetingId
                    ? "bg-muted/50"
                    : "hover:bg-muted/50"
                }
              >
                <ChatRoomItem
                  id={room.meetingId}
                  meetingImage={room.image}
                  meetingTitle={room.title}
                  lastMessageContent={
                    room.lastMessage?.content || "대화를 시작하세요"
                  }
                  lastMessageTime={
                    room.lastMessage?.createdAt
                      ? new Date(room.lastMessage.createdAt).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )
                      : ""
                  }
                />
              </div>
            ))}
            {(!chatRooms || chatRooms.length === 0) && (
              <div className="p-4 text-muted-foreground">
                참여 중인 채팅방이 없습니다.
              </div>
            )}
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default ChatRoomListSection;
