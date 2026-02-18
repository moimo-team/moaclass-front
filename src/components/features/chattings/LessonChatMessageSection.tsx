import React from 'react';

import ChatMessageSection from '@/components/features/chattings/ChatMessageSection';
import type { ChatMessage, ChatRoom } from '@/models/chat.model';

interface LessonChatMessageSectionProps {
	selectedRoom: ChatRoom | null;
	messages: ChatMessage[];
	sendMessage: () => void;
	inputValue: string;
	setInputValue: (value: string) => void;
	onBackToList: () => void;
	scrollRef: React.RefObject<HTMLDivElement | null>;
	userId: number | null;
}

const LessonChatMessageSection: React.FC<LessonChatMessageSectionProps> = ({
	selectedRoom,
	messages,
	sendMessage,
	inputValue,
	setInputValue,
	onBackToList,
	scrollRef,
	userId,
}) => {
	if (!selectedRoom) {
		return (
			<div className="hidden lg:flex flex-col items-center justify-center h-full text-muted-foreground w-full lg:w-[70%]">
				<p>레슨 채팅방을 선택하여 대화를 시작하세요.</p>
			</div>
		);
	}

	return (
		<ChatMessageSection
			selectedMeeting={{
				...selectedRoom,
				meetingId: selectedRoom.meetingId ?? selectedRoom.roomId,
			}}
			messages={messages}
			sendMessage={sendMessage}
			inputValue={inputValue}
			setInputValue={setInputValue}
			onBackToList={onBackToList}
			scrollRef={scrollRef}
			userId={userId}
			hostBadgeLabel="모멘토"
		/>
	);
};

export default LessonChatMessageSection;
