import { useState, useEffect, useRef, useCallback } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';

import { getChatRooms } from '@/api/chat.api';
import ChatMessageSection from '@/components/features/chattings/ChatMessageSection';
import ChatRoomListSection from '@/components/features/chattings/ChatRoomListSection';
import LessonChatMessageSection from '@/components/features/chattings/LessonChatMessageSection';
import LessonChatRoomListSection from '@/components/features/chattings/LessonChatRoomListSection';
import { useChatSocket } from '@/hooks/useChatSocket';
import type { ChatRoom, ChatMessage } from '@/models/chat.model';
import { useAuthStore } from '@/store/authStore';

const Chatting = () => {
	const { userId } = useAuthStore();
	const [selectedMeeting, setSelectedMeeting] = useState<ChatRoom | null>(null);
	const [inputValue, setInputValue] = useState('');
	const [chatType, setChatType] = useState<'meeting' | 'lesson'>('meeting');

	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const scrollRef = useRef<HTMLDivElement>(null);
	const queryClient = useQueryClient();
	const location = useLocation();

	const { data: chatRooms, isLoading } = useQuery({
		queryKey: ['chatRooms', userId],
		queryFn: getChatRooms,
		enabled: !!userId,
	});

	const handleNewMessage = useCallback(
		(newMessage: ChatMessage) => {
			if (newMessage.meetingId === selectedMeeting?.meetingId) {
				setMessages((prev) => [...prev, newMessage]);
			}

			queryClient.setQueryData<ChatRoom[]>(['chatRooms', userId], (oldData) => {
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
			const targetRoom = chatRooms.find((room) => room.meetingId === meetingIdFromState);

			if (targetRoom) {
				setSelectedMeeting(targetRoom);
			}
		}
	}, [isLoading, chatRooms, location.state]);

	const handleSendMessage = () => {
		if (!inputValue.trim()) return;
		sendMessage(inputValue);
		setInputValue('');
	};

	const handleBackToList = () => {
		setSelectedMeeting(null);
	};

	return (
		<div className="flex flex-col h-[calc(100vh-80px)] bg-background">
			<div className="flex justify-around p-4 border-b border-gray-200">
				{/* type으로 모임과 원데이클래스 채팅을 구분 */}
				<button
					className={`px-4 py-2 text-lg font-semibold ${
						chatType === 'meeting'
							? 'text-primary border-b-2 border-primary'
							: 'text-foreground'
					}`}
					onClick={() => setChatType('meeting')}
				>
					모임 채팅
				</button>
				<button
					className={`px-4 py-2 text-lg font-semibold ${
						chatType === 'lesson'
							? 'text-primary border-b-2 border-primary'
							: 'text-foreground'
					}`}
					onClick={() => setChatType('lesson')}
				>
					레슨 채팅
				</button>
			</div>

			{chatType === 'meeting' ? (
				<div className="flex flex-row flex-grow">
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
			) : (
				<div className="flex flex-row flex-grow">
					<LessonChatRoomListSection />
					<LessonChatMessageSection />
				</div>
			)}
		</div>
	);
};

export default Chatting;
