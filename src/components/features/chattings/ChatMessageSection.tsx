import React, { Fragment } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ChatMessageItem from "@/components/features/chattings/ChatMessage";
import type { ChatMessage, ChatRoom } from "@/models/chat.model";
import { formatDateSeparator, toYYYYMMDD } from "@/utils/dateFormat";
import DateSeparator from "@/components/features/chattings/DateSeparator";

interface ChatMessageSectionProps {
  selectedMeeting: ChatRoom | null;
  messages: ChatMessage[];
  sendMessage: () => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  onBackToList: () => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  userId: number | null;
}

const ChatMessageSection: React.FC<ChatMessageSectionProps> = ({
  selectedMeeting,
  messages,
  sendMessage,
  inputValue,
  setInputValue,
  onBackToList,
  scrollRef,
  userId,
}) => {
  if (!selectedMeeting) {
    return (
      <div className="hidden lg:flex flex-col items-center justify-center h-full text-muted-foreground w-full lg:w-[70%]">
        <p>채팅방을 선택하여 대화를 시작하세요.</p>
      </div>
    );
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      sendMessage();
    }
  };

  return (
    <div className="flex w-full lg:w-[70%] flex-col h-full bg-card">
      {/* 헤더 */}
      <div className="p-4 border-b shrink-0 flex items-center gap-3">
        <FaArrowLeft
          className="cursor-pointer text-xl"
          onClick={onBackToList}
        />
        <div>
          <h2 className="text-xl font-bold">{selectedMeeting.title}</h2>
          <p className="text-sm text-muted-foreground">
            멤버 {selectedMeeting.memberCount}명
          </p>
        </div>
      </div>

      {/* 메시지 목록 */}
      <div
        ref={scrollRef}
        className="flex flex-col gap-4 p-4 flex-grow overflow-y-auto"
      >
        {messages.map((msg, index) => {
          const showDateSeparator =
            index === 0 ||
            toYYYYMMDD(msg.createdAt) !==
              toYYYYMMDD(messages[index - 1].createdAt);

          return (
            <Fragment key={msg.id || index}>
              {showDateSeparator && (
                <DateSeparator date={formatDateSeparator(msg.createdAt)} />
              )}
              <ChatMessageItem
                message={msg}
                isMine={msg.senderId === userId}
                hostId={selectedMeeting.hostId}
              />
            </Fragment>
          );
        })}
      </div>

      {/* 입력창 */}
      <div className="p-4 border-t shrink-0">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="메시지를 입력하세요..."
            className="flex-grow"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button onClick={sendMessage}>
            <IoIosSend />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatMessageSection;
