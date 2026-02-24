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

const getRoomIdFromRoom = (room: ChatRoom): number => room.roomId;
const getRoomIdFromMessage = (message: ChatMessage): number => message.roomId;

// API/socket payload 차이 정규화
const normalizeMessage = (message: ChatMessage): ChatMessage => message;

const resolveChatType = (room: ChatRoom): ChatType => {
	if (room.meetingId !== null) return 'meeting';
	if (room.lessonId !== null) return 'lesson';
	return 'meeting';
};

const isMentorLessonRoom = (room: ChatRoom): boolean => {
	if (room.lessonId === null) return false;
	const displayTitle = room.displayTitle?.trim();
	if (!displayTitle) return false;
	return displayTitle !== room.title;
};

const resolveRoomTitle = (room: ChatRoom): string => {
	return isMentorLessonRoom(room) ? room.displayTitle!.trim() : room.title;
};

interface ChattingContentProps {
	initialRoomId?: number;
	initialChatType?: ChatType;
	initialMeetingId?: number | string | null;
	initialLessonId?: number | string | null;
}

const toNumber = (value?: number | string | null): number | undefined => {
	if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
	if (typeof value === 'string' && value.trim()) {
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : undefined;
	}
	return undefined;
};

export const ChattingContent = ({
	initialRoomId,
	initialChatType,
	initialMeetingId,
	initialLessonId,
}: ChattingContentProps) => {
	const { userId } = useAuthStore();
	const location = useLocation();
	const locationState = (location.state as ChatLocationState) ?? null;
	// Query props are the canonical source in Next.js; location.state is fallback only.
	const routeRoomId = toNumber(initialRoomId) ?? locationState?.roomId;
	const routeMeetingId = toNumber(initialMeetingId) ?? locationState?.meetingId;
	const routeLessonId = toNumber(initialLessonId) ?? locationState?.lessonId;
	const routeChatType = initialChatType ?? locationState?.chatType;

	const [selectedMeeting, setSelectedMeeting] = useState<ChatRoom | null>(null);
	const [selectedLessonRoom, setSelectedLessonRoom] = useState<ChatRoom | null>(null);
	const [useInitialRouteSelection, setUseInitialRouteSelection] = useState(true);
	const [inputValue, setInputValue] = useState('');
	const [chatType, setChatType] = useState<ChatType>(() => routeChatType ?? 'lesson');

	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const scrollRef = useRef<HTMLDivElement>(null);
	const queryClient = useQueryClient();

	const {
		data: chatRooms,
		isLoading,
		refetch: refetchChatRooms,
	} = useQuery({
		queryKey: ['chatRooms', userId],
		queryFn: getMyChatRooms,
		enabled: !!userId,
	});

	const meetingRooms = useMemo(
		() =>
			chatRooms
				?.filter((room) => resolveChatType(room) === 'meeting')
				.map((room) => ({
					...room,
					title: resolveRoomTitle(room),
				})) ?? [],
		[chatRooms],
	);
	const lessonRooms = useMemo(
		() =>
			chatRooms
				?.filter((room) => resolveChatType(room) === 'lesson')
				.map((room) => ({
					...room,
					title: resolveRoomTitle(room),
				})) ?? [],
		[chatRooms],
	);
	const mentorLessonRoomIds = useMemo(
		() =>
			new Set(
				(chatRooms ?? [])
					.filter(
						(room) => resolveChatType(room) === 'lesson' && isMentorLessonRoom(room),
					)
					.map((room) => room.roomId),
			),
		[chatRooms],
	);

	const initialMeetingRoomFromRoute = useMemo(() => {
		if (!useInitialRouteSelection) return null;
		if (routeChatType === 'lesson') return null;

		if (routeMeetingId) {
			return meetingRooms.find((room) => room.meetingId === routeMeetingId) ?? null;
		}

		if (routeRoomId) {
			const targetRoom =
				chatRooms?.find((room) => getRoomIdFromRoom(room) === routeRoomId) ?? null;
			return targetRoom && resolveChatType(targetRoom) === 'meeting' ? targetRoom : null;
		}

		return null;
	}, [
		useInitialRouteSelection,
		routeChatType,
		routeMeetingId,
		routeRoomId,
		meetingRooms,
		chatRooms,
	]);

	const initialLessonRoomFromRoute = useMemo(() => {
		if (!useInitialRouteSelection) return null;

		if (routeChatType === 'lesson' && routeRoomId) {
			return lessonRooms.find((room) => getRoomIdFromRoom(room) === routeRoomId) ?? null;
		}

		if (routeLessonId) {
			return lessonRooms.find((room) => room.lessonId === routeLessonId) ?? null;
		}

		if (routeRoomId) {
			const targetRoom =
				chatRooms?.find((room) => getRoomIdFromRoom(room) === routeRoomId) ?? null;
			return targetRoom && resolveChatType(targetRoom) === 'lesson' ? targetRoom : null;
		}

		return null;
	}, [
		useInitialRouteSelection,
		routeChatType,
		routeRoomId,
		routeLessonId,
		lessonRooms,
		chatRooms,
	]);

	const selectedRoom =
		chatType === 'meeting'
			? (selectedMeeting ?? initialMeetingRoomFromRoute)
			: (selectedLessonRoom ?? initialLessonRoomFromRoute);
	const selectedRoomId = selectedRoom ? getRoomIdFromRoom(selectedRoom) : null;
	const hasSelectedRoom = Boolean(selectedRoom);

	// 열린 방은 append, 전체 방 목록은 정렬만 갱신
	const handleNewMessage = useCallback(
		(newMessage: ChatMessage) => {
			const normalizedMessage = normalizeMessage(newMessage);
			const messageForState = normalizedMessage;
			const incomingRoomId = getRoomIdFromMessage(messageForState);

			if (incomingRoomId === selectedRoomId) {
				setMessages((prev) => [...prev, messageForState]);
			}

			queryClient.setQueryData<ChatRoom[]>(['chatRooms', userId], (oldData) => {
				if (!oldData) return [];

				const updatedData = oldData.map((room) => {
					if (getRoomIdFromRoom(room) === incomingRoomId) {
						return {
							...room,
							lastMessage: messageForState.content,
							updatedAt: messageForState.createdAt,
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

	useEffect(() => {
		const targetRoomId = routeRoomId;
		if (!targetRoomId || !chatRooms) return;
		if (chatRooms.some((room) => getRoomIdFromRoom(room) === targetRoomId)) return;

		void refetchChatRooms();
	}, [routeRoomId, chatRooms, refetchChatRooms]);

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
		<div className="flex flex-col h-[calc(100vh-80px)] bg-background overflow-hidden">
			<div className="flex justify-around p-4 border-b border-gray-200">
				{/* type으로 모임과 원데이클래스 채팅을 구분 */}
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
					클래스 채팅 문의
				</button>
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
			</div>

			{chatType === 'meeting' ? (
				<div className="flex flex-row flex-grow min-h-0 overflow-hidden">
					<div
						data-testid="meeting-list-panel"
						className={`${hasSelectedRoom ? 'hidden' : 'block'} w-full lg:contents`}
					>
						<ChatRoomListSection
							chatRooms={meetingRooms}
							isLoading={isLoading}
							onSelectRoom={(room) => {
								setUseInitialRouteSelection(false);
								setSelectedMeeting(room);
							}}
							selectedMeetingId={selectedRoom?.meetingId ?? selectedRoom?.roomId}
						/>
					</div>
					<div
						data-testid="meeting-message-panel"
						className={`${hasSelectedRoom ? 'block' : 'hidden'} w-full lg:contents`}
					>
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
				</div>
			) : (
				<div className="flex flex-row flex-grow min-h-0 overflow-hidden">
					<div
						data-testid="lesson-list-panel"
						className={`${hasSelectedRoom ? 'hidden' : 'block'} w-full lg:contents`}
					>
						<LessonChatRoomListSection
							chatRooms={lessonRooms}
							isLoading={isLoading}
							onSelectRoom={(room) => {
								setUseInitialRouteSelection(false);
								setSelectedLessonRoom(room);
							}}
							selectedRoomId={selectedRoom?.roomId}
						/>
					</div>
					<div
						data-testid="lesson-message-panel"
						className={`${hasSelectedRoom ? 'block' : 'hidden'} w-full lg:contents`}
					>
						<LessonChatMessageSection
							selectedRoom={selectedRoom}
							isMentorView={
								selectedRoom ? mentorLessonRoomIds.has(selectedRoom.roomId) : false
							}
							messages={messages}
							sendMessage={handleSendMessage}
							inputValue={inputValue}
							setInputValue={setInputValue}
							onBackToList={handleBackToList}
							scrollRef={scrollRef}
							userId={userId}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

const Chatting = () => {
	const location = useLocation();
	const locationState = location.state as ChatLocationState;
	return (
		<ChattingContent
			initialRoomId={locationState?.roomId}
			initialChatType={locationState?.chatType}
			initialMeetingId={locationState?.meetingId}
			initialLessonId={locationState?.lessonId}
		/>
	);
};

export default Chatting;
