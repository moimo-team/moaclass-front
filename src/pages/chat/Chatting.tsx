import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';

import { getMyChatRooms, getRoomMessages } from '@/api/chat.api';
import ChatMessageSection from '@/components/features/chattings/ChatMessageSection';
import ChatRoomListSection from '@/components/features/chattings/ChatRoomListSection';
import LessonChatMessageSection from '@/components/features/chattings/LessonChatMessageSection';
import LessonChatRoomListSection from '@/components/features/chattings/LessonChatRoomListSection';
import { useChatSocket } from '@/hooks/useChatSocket';
import type { ChatMessage, ChatRoom, ChatType } from '@/models/chat.model';
import { useAuthStore } from '@/store/authStore';

type ChatLocationState = {
	chatType?: ChatType;
	meetingId?: number;
	roomId?: number;
	lessonId?: number;
} | null;

const getRoomIdFromRoom = (room: ChatRoom): number => room.roomId ?? room.meetingId ?? 0;
const getRoomIdFromMessage = (message: ChatMessage): number | null =>
	message.roomId ?? message.meetingId ?? null;

// API/socket payload 차이 정규화
const normalizeMessage = (message: ChatMessage): ChatMessage => {
	const roomId = getRoomIdFromMessage(message);
	const sender = message.sender ?? {
		id: message.senderId,
		nickname: message.senderNickname ?? '알 수 없음',
		image: '',
	};

	return {
		...message,
		roomId: roomId ?? undefined,
		sender,
	};
};

const resolveChatType = (room: ChatRoom): ChatType => {
	if (room.chatType) return room.chatType;
	if (room.lessonId) return 'lesson';
	return 'meeting';
};

const Chatting = () => {
	const { userId } = useAuthStore();
	const location = useLocation();
	const locationState = (location.state as ChatLocationState) ?? null;

	const [selectedMeeting, setSelectedMeeting] = useState<ChatRoom | null>(null);
	const [selectedLessonRoom, setSelectedLessonRoom] = useState<ChatRoom | null>(null);
	const [useInitialRouteSelection, setUseInitialRouteSelection] = useState(true);
	const [inputValue, setInputValue] = useState('');
	const [chatType, setChatType] = useState<ChatType>(() => locationState?.chatType ?? 'meeting');

	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const scrollRef = useRef<HTMLDivElement>(null);
	const queryClient = useQueryClient();

	const { data: chatRooms, isLoading } = useQuery({
		queryKey: ['chatRooms', userId],
		queryFn: getMyChatRooms,
		enabled: !!userId,
	});

	const meetingRooms = useMemo(
		() => chatRooms?.filter((room) => resolveChatType(room) === 'meeting') ?? [],
		[chatRooms],
	);
	const lessonRooms = useMemo(
		() => chatRooms?.filter((room) => resolveChatType(room) === 'lesson') ?? [],
		[chatRooms],
	);

	const initialMeetingRoomFromRoute = useMemo(() => {
		if (!useInitialRouteSelection) return null;
		if (locationState?.chatType === 'lesson') return null;

		if (locationState?.meetingId) {
			return meetingRooms.find((room) => room.meetingId === locationState.meetingId) ?? null;
		}

		if (locationState?.roomId) {
			const targetRoom =
				chatRooms?.find((room) => getRoomIdFromRoom(room) === locationState.roomId) ?? null;
			return targetRoom && resolveChatType(targetRoom) === 'meeting' ? targetRoom : null;
		}

		return null;
	}, [useInitialRouteSelection, locationState, meetingRooms, chatRooms]);

	const initialLessonRoomFromRoute = useMemo(() => {
		if (!useInitialRouteSelection) return null;

		if (locationState?.chatType === 'lesson' && locationState.roomId) {
			return (
				lessonRooms.find((room) => getRoomIdFromRoom(room) === locationState.roomId) ?? null
			);
		}

		if (locationState?.roomId) {
			const targetRoom =
				chatRooms?.find((room) => getRoomIdFromRoom(room) === locationState.roomId) ?? null;
			return targetRoom && resolveChatType(targetRoom) === 'lesson' ? targetRoom : null;
		}

		return null;
	}, [useInitialRouteSelection, locationState, lessonRooms, chatRooms]);

	const selectedRoom =
		chatType === 'meeting'
			? (selectedMeeting ?? initialMeetingRoomFromRoute)
			: (selectedLessonRoom ?? initialLessonRoomFromRoute);
	const selectedRoomId = selectedRoom ? getRoomIdFromRoom(selectedRoom) : null;

	// 열린 방은 append, 전체 방 목록은 정렬만 갱신
	const handleNewMessage = useCallback(
		(newMessage: ChatMessage) => {
			const normalizedMessage = normalizeMessage(newMessage);
			const incomingRoomId = getRoomIdFromMessage(normalizedMessage);
			if (!incomingRoomId) return;

			if (incomingRoomId === selectedRoomId) {
				setMessages((prev) => [...prev, normalizedMessage]);
			}

			queryClient.setQueryData<ChatRoom[]>(['chatRooms', userId], (oldData) => {
				if (!oldData) return [];

				const updatedData = oldData.map((room) => {
					if (getRoomIdFromRoom(room) === incomingRoomId) {
						return {
							...room,
							lastMessage: {
								content: normalizedMessage.content,
								createdAt: normalizedMessage.createdAt,
								sender:
									normalizedMessage.sender?.nickname ??
									normalizedMessage.senderNickname ??
									'알 수 없음',
							},
						};
					}
					return room;
				});

				const targetRoomIndex = updatedData.findIndex(
					(room) => getRoomIdFromRoom(room) === incomingRoomId,
				);

				if (targetRoomIndex > 0) {
					const targetRoom = updatedData.splice(targetRoomIndex, 1)[0];
					updatedData.unshift(targetRoom);
				}

				return updatedData;
			});
		},
		[queryClient, selectedRoomId, userId],
	);

	const { sendMessage } = useChatSocket(selectedRoomId, handleNewMessage);

	// 방 전환 시 history는 REST로 새로 로드(socket은 실시간 이벤트 전용)
	useEffect(() => {
		const loadMessages = async () => {
			if (!selectedRoomId) {
				setMessages([]);
				return;
			}

			try {
				const history = await getRoomMessages(selectedRoomId);
				setMessages(history.map(normalizeMessage));
			} catch {
				setMessages([]);
				toast.error('메세지 내역을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
			}
		};

		loadMessages();
	}, [selectedRoomId]);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [messages]);

	const handleSendMessage = () => {
		if (!inputValue.trim()) return;
		sendMessage(inputValue);
		setInputValue('');
	};

	const handleBackToList = () => {
		setUseInitialRouteSelection(false);
		if (chatType === 'meeting') {
			setSelectedMeeting(null);
		} else {
			setSelectedLessonRoom(null);
		}
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
					onClick={() => {
						setUseInitialRouteSelection(false);
						setChatType('meeting');
					}}
				>
					모임 채팅
				</button>
				<button
					className={`px-4 py-2 text-lg font-semibold ${
						chatType === 'lesson'
							? 'text-primary border-b-2 border-primary'
							: 'text-foreground'
					}`}
					onClick={() => {
						setUseInitialRouteSelection(false);
						setChatType('lesson');
					}}
				>
					레슨 채팅
				</button>
			</div>

			{chatType === 'meeting' ? (
				<div className="flex flex-row flex-grow">
					<ChatRoomListSection
						chatRooms={meetingRooms}
						isLoading={isLoading}
						onSelectRoom={(room) => {
							setUseInitialRouteSelection(false);
							setSelectedMeeting(room);
						}}
						selectedMeetingId={selectedRoom?.meetingId ?? selectedRoom?.roomId}
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
					<LessonChatRoomListSection
						chatRooms={lessonRooms}
						isLoading={isLoading}
						onSelectRoom={(room) => {
							setUseInitialRouteSelection(false);
							setSelectedLessonRoom(room);
						}}
						selectedRoomId={selectedRoom?.roomId}
					/>
					<LessonChatMessageSection
						selectedRoom={selectedLessonRoom}
						messages={messages}
						sendMessage={handleSendMessage}
						inputValue={inputValue}
						setInputValue={setInputValue}
						onBackToList={handleBackToList}
						scrollRef={scrollRef}
						userId={userId}
					/>
				</div>
			)}
		</div>
	);
};

export default Chatting;
