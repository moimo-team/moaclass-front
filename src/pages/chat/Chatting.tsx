import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { getChatRooms } from "@/api/chat.api";
import { useChatSocket } from "@/hooks/useChatSocket";
import type { ChatRoom, ChatMessage } from "@/models/chat.model";
import { useLocation } from "react-router-dom";
import ChatRoomListSection from "@/components/features/chattings/ChatRoomListSection";
import ChatMessageSection from "@/components/features/chattings/ChatMessageSection";

const Chatting = () => {
  const { userId } = useAuthStore();
  const [selectedMeeting, setSelectedMeeting] = useState<ChatRoom | null>(null);
  const [inputValue, setInputValue] = useState("");

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const location = useLocation();

  const { data: chatRooms, isLoading } = useQuery({
    queryKey: ["chatRooms", userId],
    queryFn: getChatRooms,
    enabled: !!userId,
  });

  const handleNewMessage = useCallback(
    (newMessage: ChatMessage) => {
      if (newMessage.meetingId === selectedMeeting?.meetingId) {
        setMessages((prev) => [...prev, newMessage]);
      }

      queryClient.setQueryData<ChatRoom[]>(["chatRooms", userId], (oldData) => {
        if (!oldData) return [];

        const updatedData = oldData.map((room) => {
          if (room.meetingId === newMessage.meetingId) {
            return {
              ...room,
              lastMessage: {
                content: newMessage.content,
                createdAt: newMessage.createdAt,
                sender: newMessage.sender.nickname,
              },
            };
          }
          return room;
        });

        const targetRoomIndex = updatedData.findIndex(
          (room) => room.meetingId === newMessage.meetingId,
        );
        if (targetRoomIndex > 0) {
          const targetRoom = updatedData.splice(targetRoomIndex, 1)[0];
          updatedData.unshift(targetRoom);
        }

        return updatedData;
      });
    },
    [queryClient, selectedMeeting?.meetingId, userId],
  );

  const { initialMessages, sendMessage } = useChatSocket(
    selectedMeeting?.meetingId || null,
    handleNewMessage,
  );

  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!isLoading && chatRooms && location.state?.meetingId) {
      const meetingIdFromState = location.state.meetingId;
      const targetRoom = chatRooms.find(
        (room) => room.meetingId === meetingIdFromState,
      );

      if (targetRoom) {
        setSelectedMeeting(targetRoom);
      }
    }
  }, [isLoading, chatRooms, location.state]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue("");
  };

  const handleBackToList = () => {
    setSelectedMeeting(null);
  };

  return (
    <div className="flex flex-row h-[calc(100vh-80px)] bg-background">
      <ChatRoomListSection
        chatRooms={chatRooms}
        isLoading={isLoading}
        onSelectRoom={setSelectedMeeting}
        selectedMeetingId={selectedMeeting?.meetingId}
      />
      <ChatMessageSection
        selectedMeeting={selectedMeeting}
        messages={messages}
        sendMessage={handleSendMessage}
        inputValue={inputValue}
        setInputValue={setInputValue}
        onBackToList={handleBackToList}
        scrollRef={scrollRef}
        userId={userId}
      />
    </div>
  );
};

export default Chatting;
